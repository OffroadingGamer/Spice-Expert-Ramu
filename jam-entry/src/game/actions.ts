/**
 * The bridge between React UI and the running engine. The scene registers
 * its engine instance here; UI components call these actions and read
 * results through the store (never holding engine state in React).
 */
import { store, type AppState } from '../state/store.ts';
import { track, trackFunnelStep } from '../sdk/analytics.ts';
import { switchCue, prefetchCue, isAudioUnlocked, sfx } from '../audio/audio.ts';
import { completeFtue, setFtueFirstTower } from '../state/save.ts';
import { CONFIG } from './config.ts';
import { WAVES } from './data/waves.ts';
import { OPENING_DIALOGUE } from './data/dialogue.ts';
import { queueDialogue, resetDialogueQueue, isDialogueMuted } from './dialogueController.ts';
import type { TargetingMode } from './data/targeting.ts';
import { kitchenActionCost, type Engine, type KitchenActionKind } from './sim/engine.ts';

/**
 * DEV ROBUSTNESS: the engine reference lives on globalThis for the same
 * reason as the store's state (see store.ts) — Vite on Windows can serve
 * duplicate copies of this module after a hot reload, and a module-scoped
 * reference would strand the UI's copy at null. Round 15 Part 2: the same
 * slot also carries `reArmRunEnd` — towerScene.ts registers a closure here
 * (right alongside its own registerEngine(engine) call) that resets its
 * private `ended` latch; see applyContinueGrant below for why an outside
 * re-arm is needed at all.
 */
const host = globalThis as typeof globalThis & {
    __spice_ramu_engine__?: { current: Engine | null; reArmRunEnd: (() => void) | null };
};
const slot = (host.__spice_ramu_engine__ ??= { current: null, reArmRunEnd: null });

/** Round 15 Part 2: towerScene.ts calls this once, right after
 *  registerEngine(engine), with a closure that resets its own private
 *  `ended` run-end latch (checkEnd() would otherwise never fire again for
 *  the REAL loss that follows a granted continue — see applyContinueGrant's
 *  own doc). Cleared (null) on scene teardown so a stale closure from a
 *  destroyed scene can never fire. */
export function registerRunEndReArm(fn: (() => void) | null): void {
    slot.reArmRunEnd = fn;
}

/**
 * Onboarding-balance round: the FTUE's forced first placement, moved off pad
 * 0 (A1, bonus: null — the single worst opening in the game; pad0-rush's
 * whole profile is "start there and nowhere else," and it died by level 4).
 * Pad 4 is B3 (config.ts), bonus: damage x1.5 — confirmed against
 * npm run balance as the highest-value opener against block 1's tanky
 * support entries (data/waves.ts's block-1 tuning), where raw damage clears
 * a burst faster than extra range or fire rate does at un-upgraded level 1.
 * Every hardcoded reference to "the first forced pad" (scriptedRunStart,
 * isFtueBeatResolvable, placeTower, upgradeTower, towerScene.ts,
 * StationRail.tsx) reads this constant now instead of a literal 0.
 */
export const FTUE_FIRST_PAD = 4;

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
    // Blocker round: the ONLY place engineReady is ever set — this is what
    // makes "the engine became ready" a real, subscribable store transition
    // instead of a plain module read that render-time getEngine() callers
    // could see stale forever (store.ts's own doc on this field has the
    // full mechanism). Patched unconditionally, on BOTH registration (e
    // truthy) and teardown (e null, from the scene's destroy()) — the
    // teardown half is what guarantees the NEXT registration is a genuine
    // false -> true transition, not a no-op re-patch of an already-true
    // value that a freshly remounted component would never observe change.
    store.patch({ engineReady: e !== null });
    if (e) {
        runStartedAt = performance.now();
        runAnalytics = { towersPlaced: 0, firstTowerPlaced: false, firstWaveStarted: false };
        highTensionLatched = false;
        // Delivered-audio round, task 2: only switch here if audio is
        // already unlocked (a Retry, or Menu -> Challenge Mode, both well
        // after the player's first gesture). On a cold boot into 'playing'
        // (main.tsx, no menu tap first), this fires before ctx exists —
        // skip it and let initAudio's unlock handler set the correct cue
        // once it actually can (see audio.ts's isAudioUnlocked doc).
        if (isAudioUnlocked()) switchCue('service_low');
        prefetchCue('service_high');
        trackFunnelStep(2, 'run_start', 'run', 2);
        track('run_start', { wave_target: WAVES.length, lives_start: e.state.lives });
    }
}

export function getEngine(): Engine | null {
    return slot.current;
}

/**
 * The FTUE script's start payload (GDD §10.11): force FTUE_FIRST_PAD's
 * selection, a fresh runId (remounts GameCanvas into a new engine), and beat
 * 1 armed. Three call sites need exactly this — MainMenu's Challenge Mode
 * button, main.tsx's cold-boot-straight-into-Challenge, and EndScreen's
 * Retry — each layering its own phase transition on top (phase: 'playing'
 * for a fresh mount into 'playing'; tdPhase: 'build' for Retry, which is
 * already on the 'playing' phase and just needs the sim-facing field reset).
 * One function here means the script's shape can't quietly drift between
 * them.
 *
 * Round 1 (docs/Ideas.md §1/§6d): the opening dialogue is armed in this SAME
 * patch rather than queued through dialogueController.ts — queueDialogue
 * reads store.get().dialogue to decide whether to open or queue, and this
 * patch hasn't landed yet when scriptedRunStart runs, so routing the opening
 * through it here would always see a stale "nothing open" read from the
 * PREVIOUS run. Showing it also holds off the placeFirst picker cue
 * (selectedPad stays null) until the opening closes — DialogueBox.tsx sets
 * selectedPad to FTUE_FIRST_PAD itself at that point, the one FTUE-specific
 * wire this whole dialogue pass needs (see that file's / dialogueController.
 * ts's doc comments). Round 2b (docs/Ideas.md §6d amendment): the opening
 * shows on EVERY run now (dialogueSeen is gone — beats 1-4 ride ftueActive,
 * which is already every run), so CONFIG.narrative.enabled is the only gate
 * left; off gets exactly today's plain-Ready FTUE, unchanged. Round 3: a
 * muted player (dialogueController.ts's isDialogueMuted, loaded from the
 * save by resetDialogueQueue() right above) takes the SAME branch — folded
 * into showOpening rather than a second condition below, so a muted Retry
 * skips straight to FTUE_FIRST_PAD exactly like flag-off does today.
 */
export function scriptedRunStart(): Partial<AppState> {
    resetDialogueQueue();
    const showOpening = CONFIG.narrative.enabled && !isDialogueMuted();
    if (showOpening) {
        track('dialogue_shown', { id: OPENING_DIALOGUE.id });
    }
    return {
        selectedPad: showOpening ? null : FTUE_FIRST_PAD,
        runId: store.get().runId + 1,
        ftueActive: true,
        ftueBeat: 'placeFirst',
        dialogue: showOpening
            ? { id: OPENING_DIALOGUE.id, voice: OPENING_DIALOGUE.voice, lines: OPENING_DIALOGUE.lines, index: 0 }
            : null,
        // Round 15 Part 1: the one rewarded continue is per-run — every
        // fresh run (Retry, menu Start, cold boot) gets a clean slate here,
        // same posture as adBonusClaimed's own per-run reset in checkEnd.
        continuedThisRun: false,
        runEndDecided: false,
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
        const t = engine.state.towers.find((tw) => tw.padIndex === FTUE_FIRST_PAD);
        return !!t && t.level <= t.def.upgrades.length;
    }
    const pad = ftueBeat === 'placeFirst' ? FTUE_FIRST_PAD : ftueBeatPad;
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
    store.patch({ ftueActive: false, ftueBeat: null });
}

/**
 * Round 4 Part B (docs/Ideas.md §6d): opens the upgrade dock on
 * FTUE_FIRST_PAD with beat 3 ('upgrade0') armed. Used to be towerScene.ts's
 * applyFtueWaveEnd(1) branch, firing the INSTANT wave 1 cleared — moved here
 * (and made callable on demand) because Round 4 gives the 'wave1-cleared'
 * dialogue box the screen to itself first; DialogueBox.tsx now calls this
 * when the PLAYER closes that box (tap or Skip), not at the wave-clear tick.
 * Beat 3's requirement is the forced upgrade's own cost — the documented
 * trap (Tandoor at beat 1 leaves the upgrade unaffordable with flawless
 * play) — computed from live state, never typed in; grantFtueShortfall
 * no-ops if already affordable. If FTUE_FIRST_PAD has nothing left to
 * upgrade (safe today at wave 1 end, guarded in case that changes), there's
 * nothing to force the player into — retire the script instead.
 */
export function openUpgrade0Beat(): void {
    const engine = slot.current;
    if (!engine) return;
    const t = engine.state.towers.find((tw) => tw.padIndex === FTUE_FIRST_PAD);
    if (t && t.level <= t.def.upgrades.length) {
        grantFtueShortfall(t.def.upgrades[t.level - 1].cost);
        store.patch({ selectedPad: FTUE_FIRST_PAD, ftueBeat: 'upgrade0' });
    } else {
        retireFtue();
    }
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
        // Round D: a forced picker beat (placeFirst at run start, place2
        // after wave 2, place3 after wave 3) resolves the instant its own
        // pad gets a tower — release the walls (Ready/Close/canvas-tap lock)
        // right here, the single place this can happen, rather than
        // duplicating the check per UI. Round E: place2/place3's target is
        // ftueBeatPad, not a hardcoded pad number (see store.ts). This MUST
        // run before syncStore() below: the beat's target pad becoming
        // occupied is exactly what resolves it, but it's also exactly what
        // isFtueBeatResolvable() reads as "gone unresolvable" — releasing
        // the beat first means syncStore() sees ftueBeat already null and
        // never gets a chance to misread it.
        const beat = store.get().ftueBeat;
        const beatPad = beat === 'placeFirst' ? FTUE_FIRST_PAD : store.get().ftueBeatPad;
        if ((beat === 'placeFirst' || beat === 'place2' || beat === 'place3') && padIndex === beatPad) {
            store.patch({ ftueBeat: null });
            // Round 2b (docs/Ideas.md §6d amendment): placeFirst resolving is
            // what opens beat 2 ('stove-lit') — the dialogue box IS this
            // beat's Ready (tap starts wave 1), so it queues right here
            // rather than waiting for a later tick. place3 resolving opens
            // beat 4 ('wave4-ready') the same way. place2 has no beat of its
            // own — waves 2->3 stay the plain Ready button, unchanged.
            // Round 3: queueDialogue itself now no-ops when muted (Skip on
            // any earlier box), so neither call here needs its own mute
            // check — that used to be wasOpeningSkipped's one job.
            if (beat === 'placeFirst') queueDialogue('stove-lit');
            if (beat === 'place3') queueDialogue('wave4-ready');
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
        // GDD §10.11 pre-start beat: FTUE_FIRST_PAD is the only pad the FTUE
        // forces a selection onto, so whatever lands there is "the tower id
        // placed at the pre-start beat" — round B turns this into a Warrior
        // achievement.
        if (padIndex === FTUE_FIRST_PAD && store.get().ftueActive) {
            setFtueFirstTower(towerId);
        }
    }
}

export function upgradeTower(padIndex: number): void {
    const towerId = slot.current?.state.towers.find((t) => t.padIndex === padIndex)?.def.id;
    if (slot.current?.upgradeTower(padIndex)) {
        // Round D: the forced upgrade beat (FTUE_FIRST_PAD after wave 1)
        // resolves the instant it upgrades — mirror placeTower's auto-close
        // so the sheet doesn't linger, and release the walls. Round E: runs
        // before syncStore() below for the same reason as placeTower()
        // above — the level bump that resolves this beat is also what
        // isFtueBeatResolvable() would otherwise have to re-derive from
        // scratch one line later.
        if (store.get().ftueBeat === 'upgrade0' && padIndex === FTUE_FIRST_PAD) {
            // Round 2b (docs/Ideas.md §6d amendment): beat 3 ('wave1-
            // cleared') opened when wave 1 cleared and stays open through
            // this purchase — resolving upgrade0 just releases the rail/
            // wall; it no longer queues a dialogue of its own (that used to
            // be 'first-upgrade', now retired — see DialogueBox.tsx's
            // readyTapId, which flips beat 3's own tap to startWave() the
            // instant ftueBeat clears).
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
    // Round D: the current forced beat (placeFirst/upgrade0/place2/place3)
    // walls Ready off entirely — one gate, here, so no UI path can start a
    // wave out from under an unresolved beat regardless of what the button
    // shows.
    if (store.get().ftueBeat !== null) return;
    // Final round, task 4: same one-gate posture for the block-transition
    // lock (towerScene.ts) — Hud.tsx's disabled attribute is the visible
    // half, this is what actually stops it.
    if (store.get().backdropTransitioning) return;
    if (slot.current?.startWave()) {
        syncStore();
        track('level_start', { wave: slot.current.state.waveIndex + 1 });
        if (!runAnalytics.firstWaveStarted) {
            runAnalytics.firstWaveStarted = true;
            trackFunnelStep(4, 'first_wave_started', 'run', 2);
        }
        // The scripted FTUE retires the instant wave 4 BEGINS, not when it
        // clears (round D changes this from round A's wave-3-clear trigger;
        // onboarding-balance round: extended from wave 3 to wave 4 to make
        // room for the third forced placement — towerScene.ts's
        // applyFtueWaveEnd's cleared === 3 branch — which now owns the build
        // phase between waves 3 and 4) — Sell/Close/full freedom apply for
        // the rest of the run from here.
        if (store.get().ftueActive && slot.current.state.waveIndex + 1 === 4) {
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

/**
 * Round 15 Part 2 (docs/Ideas.md §10.3 pick A, no-nerf variant — the engine
 * stays sealed, no `handicap` hook added). Called ONLY from
 * ui/ContinueOffer.tsx's onReward, after ads.grantReward() has already
 * confirmed the rewarded ad actually completed (anything else never reaches
 * here — no grant, the end screen mounts as normal).
 *
 * The patch itself is two fields on the engine's own exposed state object
 * (engine.ts:185's plain `state`, never a method the sealed engine offers —
 * there is no "revive" verb in engine.ts and Part 2's brief is explicit that
 * none should be added): `lives = 6` (the +6 escapes) and `phase = 'wave'`.
 * Nothing else needs touching — engine.ts's step() only ever gates on
 * `state.phase !== 'wave'` (a single early return, sim/engine.ts:503) and
 * loss itself (sim/engine.ts:532-536) never clears enemies/projectiles or
 * the spawn cursors, only sets lives/phase — so flipping phase back to
 * 'wave' resumes stepSpawning, enemy movement and firing exactly where they
 * were, with whatever was still on the belt. The three action guards
 * (placeTower/upgradeTower/sellTower, sim/engine.ts:665/695/708) are each a
 * bare `if (state.phase === 'lost') return false`, so they un-gate for free
 * the instant phase flips too.
 *
 * The ONE latch this does NOT self-heal: towerScene.ts's checkEnd() guards
 * itself with a private `ended` closure flag that goes true forever the
 * first time it sees phase 'lost' (so a genuine SECOND loss later in the
 * same continued run would otherwise never re-run recordRunEnd/
 * submitRunScores/trackRunEnd — the run would look like it never ended).
 * That flag lives inside createTowerScene's closure with no exported
 * setter, so it's re-armed from here via the registerRunEndReArm() slot
 * towerScene.ts populates at scene creation — see that function's own doc.
 */
export function applyContinueGrant(): void {
    const engine = slot.current;
    if (!engine) return;
    engine.state.lives = 6;
    engine.state.phase = 'wave';
    syncStore();
    slot.reArmRunEnd?.();
    store.patch({ continuedThisRun: true });
    queueDialogue('continue-granted');
    sfx.continueGranted();
    track('continue_granted', { wave: engine.state.waveIndex + 1 });
}
