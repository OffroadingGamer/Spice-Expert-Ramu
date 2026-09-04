/**
 * The bridge between React UI and the running engine. The scene registers
 * its engine instance here; UI components call these actions and read
 * results through the store (never holding engine state in React).
 */
import { store } from '../state/store.ts';
import { track, trackFunnelStep } from '../sdk/analytics.ts';
import { switchCue, prefetchCue } from '../audio/audio.ts';
import { WAVES } from './data/waves.ts';
import type { TargetingMode } from './data/targeting.ts';
import type { Engine } from './sim/engine.ts';

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
        if (!highTensionLatched && s.lives < 3) { highTensionLatched = true; switchCue('service_high'); }
    }
}

export function placeTower(padIndex: number, towerId: string): void {
    if (slot.current?.placeTower(padIndex, towerId)) {
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
    }
}

export function upgradeTower(padIndex: number): void {
    const towerId = slot.current?.state.towers.find((t) => t.padIndex === padIndex)?.def.id;
    if (slot.current?.upgradeTower(padIndex)) {
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
    if (slot.current?.startWave()) {
        syncStore();
        track('level_start', { wave: slot.current.state.waveIndex + 1 });
        if (!runAnalytics.firstWaveStarted) {
            runAnalytics.firstWaveStarted = true;
            trackFunnelStep(4, 'first_wave_started', 'run', 2);
        }
    }
}
