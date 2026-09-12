/**
 * The bridge between React UI and the running engine. The scene registers
 * its engine instance here; UI components call these actions and read
 * results through the store (never holding engine state in React).
 */
import { store, type AppState } from '../state/store.ts';
import { track, trackFunnelStep } from '../sdk/analytics.ts';
import { switchCue, prefetchCue } from '../audio/audio.ts';
import { completeFtue, setFtueFirstTower } from '../state/save.ts';
import { CONFIG } from './config.ts';
import { WAVES } from './data/waves.ts';
import type { TargetingMode } from './data/targeting.ts';
import { kitchenActionCost, type Engine, type KitchenActionKind } from './sim/engine.ts';

/**
 * DEV ROBUSTNESS: the engine reference lives on globalThis for the same
 * reason as the store's state (see store.ts) — Vite on Windows can serve
 * duplicate copies of this module after a hot reload, and a module-scoped
 * reference would strand the UI's copy at null.
 */
const host = globalThis as typeof globalThis & { __spice_ramu_engine__?: { current: Engine | null } };
const slot = (host.__spice_ramu_engine__ ??= { current: null });

/**
 * Run-scoped analytics bookkeeping. Reset every time a fresh engine is
 * registered (= a new run begins, see registerEngine). Lives here — not in
 * towerScene.ts — because tower placement/upgrade/sell and startWave are
 * direct action calls, not EngineEvents, so this is the only precise place
 * to count them without diffing engine state every frame.
 */
let runStartedAt = 0;
let runAnalytics = { towersPlaced: 0, firstTowerPlaced: false, firstWaveStarted: false };
/** service_high is one-way per run: lives only fall (see engine.ts), so this
 * never needs to un-latch. Reset alongside runAnalytics in registerEngine. */
let highTensionLatched = false;

/** For towerScene.ts's run_end payload (towers_placed). */
export function getTowersPlacedThisRun(): number {
    return runAnalytics.towersPlaced;
}

export function registerEngine(e: Engine | null): void {
    slot.current = e;
    if (e) {
        runStartedAt = performance.now();
        runAnalytics = { towersPlaced: 0, firstTowerPlaced: false, firstWaveStarted: false };
        highTensionLatched = false;
        switchCue('service_low');
        prefetchCue('service_high');
        trackFunnelStep(2, 'run_start', 'run', 2);
        track('run_start', { wave_target: WAVES.length, lives_start: e.state.lives });
    }
}

export function getEngine(): Engine | null {
    return slot.current;
}

/**
 * The FTUE script's start payload (GDD §10.11): force pad 0's selection, a
 * fresh runId (remounts GameCanvas into a new engine), and beat 1 armed.
 * Three call sites need exactly this — MainMenu's Challenge Mode button,
 * main.tsx's cold-boot-straight-into-Challenge, and EndScreen's Retry —
 * each layering its own phase transition on top (phase: 'playing' for a
 * fresh mount into 'playing'; tdPhase: 'build' for Retry, which is already
 * on the 'playing' phase and just needs the sim-facing field reset). One
 * function here means the script's shape can't quietly drift between them.
 */
export function scriptedRunStart(): Partial<AppState> {
    return {
        selectedPad: 0,
        runId: store.get().runId + 1,
        ftueActive: true,
        ftueBeat: 'place0',
        pulsePads: null,
    };
}

/**
 * Round E: true while `ftueBeat`'s forced action is still physically
 * possible against live engine state. towerScene.ts's applyFtueWaveEnd
 * never SETS a beat this already rejects (the first half of the hard-lock
 * fix); this is the second half — the deterministic guarantee that catches
 * a beat that was resolvable when set but stops being true later. Called
 * from syncStore() below, which already runs on every frame and after
 * every action, so no separate timer/poll is needed.
 */
function isFtueBeatResolvable(): boolean {
    const engine = slot.current;
    const { ftueBeat, ftueBeatPad } = store.get();
    if (!ftueBeat || !engine) return true;
    if (ftueBeat === 'upgrade0') {
        const t = engine.state.towers.find((tw) => tw.padIndex === 0);
        return !!t && t.level <= t.def.upgrades.length;
    }
    const pad = ftueBeat === 'place0' ? 0 : ftueBeatPad;
    return !engine.state.towers.some((tw) => tw.padIndex === pad);
}

/**
 * Ends the FTUE script and releases every wall it holds — the single place
 * this happens, whether triggered by wave 3 starting (startWave() below,
 * the intended ending) or by a forced beat becoming unresolvable
 * (isFtueBeatResolvable() above, or towerScene.ts's own pre-set guards —
 * the round E hard-lock fix). completeFtue() is idempotent, so calling it
 * from more than one path is safe.
 */
export function retireFtue(): void {
    completeFtue();
    store.patch({ ftueActive: false, ftueBeat: null, pulsePads: null });
}

/** Patch UI-facing engine values into the store (only what changed). */
export function syncStore(): void {
    const engine = slot.current;
    if (!engine) return;
    const s = engine.state;
    const cur = store.get();
    const wave = s.waveIndex + 1; // unbounded: endless after the authored waves
    if (
        cur.coins !== s.coins ||
        cur.lives !== s.lives ||
        cur.wave !== wave ||
        cur.tdPhase !== s.phase
    ) {
        store.patch({ coins: s.coins, lives: s.lives, wave, tdPhase: s.phase });
        if (!highTensionLatched && s.lives < CONFIG.economy.startLives * 0.3) { highTensionLatched = true; switchCue('service_high'); }
    }
    if (store.get().ftueBeat !== null && !isFtueBeatResolvable()) {
        retireFtue();
    }
}

export function placeTower(padIndex: number, towerId: string): void {
    if (slot.current?.placeTower(padIndex, towerId)) {
        // Round D: a forced picker beat (place0 at run start, place2 after
        // wave 2) resolves the instant its own pad gets a tower — release
        // the walls (Ready/Close/canvas-tap lock) right here, the single
        // place this can happen, rather than duplicating the check per UI.
        // Round E: place2's target is ftueBeatPad, not a hardcoded 2 (see
        // store.ts). This MUST run before syncStore() below: the beat's
        // target pad becoming occupied is exactly what resolves it, but
        // it's also exactly what isFtueBeatResolvable() reads as "gone
        // unresolvable" — releasing the beat first means syncStore() sees
        // ftueBeat already null and never gets a chance to misread it.
        const beat = store.get().ftueBeat;
        const beatPad = beat === 'place0' ? 0 : store.get().ftueBeatPad;
        if ((beat === 'place0' || beat === 'place2') && padIndex === beatPad) {
            store.patch({ ftueBeat: null });
        }
        syncStore();
        runAnalytics.towersPlaced++;
        track('tower_placed', {
            tower_id: towerId,
            pad_index: padIndex,
            wave: slot.current.state.waveIndex + 1,
            seconds_into_run: (performance.now() - runStartedAt) / 1000,
        });
        if (!runAnalytics.firstTowerPlaced) {
            runAnalytics.firstTowerPlaced = true;
            trackFunnelStep(3, 'first_tower_placed', 'run', 2);
        }
        // GDD §10.11 pre-start beat: pad 0 is the only pad the FTUE forces a
        // selection onto, so whatever lands there is "the tower id placed at
        // the pre-start beat" — round B turns this into a Warrior achievement.
        if (padIndex === 0 && store.get().ftueActive) {
            setFtueFirstTower(towerId);
        }
        // Round E task 2: a pad that fills stops pulsing, whether it was
        // pulsing as the FTUE's own cue or the general post-wave pulse.
        const pulsePads = store.get().pulsePads;
        if (pulsePads?.includes(padIndex)) {
            store.patch({ pulsePads: pulsePads.filter((p) => p !== padIndex) });
        }
    }
}

export function upgradeTower(padIndex: number): void {
    const towerId = slot.current?.state.towers.find((t) => t.padIndex === padIndex)?.def.id;
    if (slot.current?.upgradeTower(padIndex)) {
        // Round D: the forced upgrade beat (pad 0 after wave 1) resolves the
        // instant it upgrades — mirror placeTower's auto-close so the sheet
        // doesn't linger, and release the walls. Round E: runs before
        // syncStore() below for the same reason as placeTower() above — the
        // level bump that resolves this beat is also what
        // isFtueBeatResolvable() would otherwise have to re-derive from
        // scratch one line later.
        if (store.get().ftueBeat === 'upgrade0' && padIndex === 0) {
            store.patch({ ftueBeat: null, selectedPad: null });
        }
        syncStore();
        track('tower_upgraded', {
            tower_id: towerId ?? 'unknown',
            pad_index: padIndex,
            wave: slot.current.state.waveIndex + 1,
        });
    }
}

export function sellTower(padIndex: number): void {
    const towerId = slot.current?.state.towers.find((t) => t.padIndex === padIndex)?.def.id;
    const wave = slot.current ? slot.current.state.waveIndex + 1 : 0;
    if (slot.current?.sellTower(padIndex)) {
        syncStore();
        track('tower_sold', { tower_id: towerId ?? 'unknown', pad_index: padIndex, wave });
    }
}

export function setTargeting(padIndex: number, mode: TargetingMode): void {
    if (slot.current?.setTargeting(padIndex, mode)) {
        // costs no coins, so bump the nonce to re-render the build sheet
        store.patch({ padVersion: store.get().padVersion + 1 });
    }
}

export function startWave(): void {
    // Round D: the current forced beat (place0/upgrade0/place2) walls Ready
    // off entirely — one gate, here, so no UI path can start a wave out
    // from under an unresolved beat regardless of what the button shows.
    if (store.get().ftueBeat !== null) return;
    // Final round, task 4: same one-gate posture for the block-transition
    // lock (towerScene.ts) — Hud.tsx's disabled attribute is the visible
    // half, this is what actually stops it.
    if (store.get().backdropTransitioning) return;
    if (slot.current?.startWave()) {
        syncStore();
        // Round E task 2: whatever was pulsing (the FTUE's own cue or the
        // general post-wave pulse) belongs to the build phase that just
        // ended — the next wave starts with a clean board.
        store.patch({ pulsePads: null });
        track('level_start', { wave: slot.current.state.waveIndex + 1 });
        if (!runAnalytics.firstWaveStarted) {
            runAnalytics.firstWaveStarted = true;
            trackFunnelStep(4, 'first_wave_started', 'run', 2);
        }
        // The scripted FTUE retires the instant wave 3 BEGINS, not when it
        // clears (round D changes this from round A's wave-3-clear trigger)
        // — Sell/Close/full freedom apply for the rest of the run from here.
        if (store.get().ftueActive && slot.current.state.waveIndex + 1 === 3) {
            retireFtue();
        }
    }
}

/**
 * Round I Task 9: buy a Kitchen Action for the wave about to start. Minimal
 * wrapper — mirrors placeTower/upgradeTower's pattern (call the engine,
 * syncStore on success, track it) — the UI itself (Hud.tsx) is deliberately
 * provisional, a row of three buttons; round 3 restyles this area.
 */
export function buyKitchenAction(kind: KitchenActionKind): void {
    const level = slot.current ? slot.current.state.waveIndex + 1 : 0;
    if (slot.current?.buyKitchenAction(kind)) {
        syncStore();
        track('kitchen_action_bought', { kind, wave: level });
    }
}

/** Live price for a Kitchen Action at the CURRENT level (build phase —
 *  applies to the wave about to start). Hud.tsx reads this to label buttons. */
export function kitchenActionPrice(kind: KitchenActionKind): number {
    const level = slot.current ? slot.current.state.waveIndex + 1 : 1;
    return kitchenActionCost(kind, level);
}

/**
 * FTUE-only: top up coins to cover exactly the shortfall for a forced
 * beat's required cost (never more) — so a first-time player is never
 * soft-locked behind an unaffordable, hidden-Close forced action, and
 * instead sees a real economy lesson: it costs money, and you came up
 * short. The player still pays the requirement's full price out of this.
 * Call sites: towerScene.ts's applyFtueWaveEnd only — never reachable from
 * ordinary play.
 */
export function grantFtueShortfall(requiredCost: number): number {
    const engine = slot.current;
    if (!engine) return 0;
    const shortfall = Math.max(0, requiredCost - engine.state.coins);
    if (shortfall > 0) {
        engine.state.coins += shortfall;
        syncStore();
        store.patch({ ftueGrantAmount: shortfall, ftueGrantNonce: store.get().ftueGrantNonce + 1 });
    }
    return shortfall;
}
