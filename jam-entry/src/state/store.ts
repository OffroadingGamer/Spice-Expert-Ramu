/**
 * Tiny external store bridging game code (Pixi ticker, SDK callbacks, plain
 * modules) and React — no state-library dependency. Game code calls
 * store.patch(); React components subscribe with useStore(selector).
 *
 * Keep this store for UI-FACING state only (phase, HUD numbers, popups).
 * Per-frame simulation state stays inside the engine — patching the store
 * every frame re-renders React every frame (actions.syncStore diffs first).
 */
import { useSyncExternalStore } from 'react';
import type { TdPhase } from '../game/sim/engine.ts';
import type { MetaLevels } from './save.ts';

/** The UI-facing app state. */
export interface AppState {
    /** 'loading' → 'menu' → 'playing' | 'testbelt'. 'testbelt' is Kitchen
     *  Mode (src/ui/TestBelt.tsx) — now the menu's primary "Play Game"
     *  action, never reachable from 'playing'. It ships public only once
     *  the FTUE node and Node 1 are complete; until then this build stays
     *  private. */
    phase: 'loading' | 'menu' | 'playing' | 'testbelt';
    /** 0..1 progress of the critical-asset warm during 'loading' */
    loadProgress: number;
    /** Set by the host's onPause/onResume lifecycle hooks */
    paused: boolean;
    /** Bumped to remount GameCanvas — each run is one engine instance */
    runId: number;
    /** Mirrors of engine state for the HUD (diffed in actions.syncStore) */
    coins: number;
    lives: number;
    wave: number;
    waveCount: number;
    tdPhase: TdPhase;
    /** Game-speed multiplier (the engine substeps this many times per frame) */
    speed: 1 | 2 | 3 | 4;
    /** Pad index the player tapped (opens the build sheet); null = none */
    selectedPad: number | null;
    /** Bumped after coin-free engine mutations (e.g. targeting change) so the build sheet re-renders */
    padVersion: number;
    /** Highest wave fully cleared, ever (persisted) */
    bestWave: number;
    /** Meta currency (persisted) and what the last run just paid out */
    gems: number;
    gemsEarned: number;
    /** True once this run's watch-ad gem bonus has been claimed */
    adBonusClaimed: boolean;
    /** Persistent per-tower upgrade levels, mirrored for the upgrades menu */
    metaLevels: MetaLevels;
    /** The main menu's persistent-upgrades overlay */
    metaOpen: boolean;
    /** The leaderboards overlay */
    ranksOpen: boolean;
    /** The settings overlay + current audio volumes (0..1, persisted) */
    settingsOpen: boolean;
    musicVol: number;
    sfxVol: number;
    /** Bugs squashed in the run that just ended (end screen) */
    runKills: number;
    /** True from the moment a Challenge run starts until wave 3 begins
     *  (GDD §10.11, round D: persistent — every run, not just the first).
     *  Gates the "Tap a cook to upgrade" hint (the cues below replace it)
     *  and keeps Sell disabled for the whole onboarding, not just the
     *  forced beats themselves. */
    ftueActive: boolean;
    /** Which forced FTUE beat currently walls the UI (Ready blocked, Close
     *  hidden, canvas taps locked to the beat's own pad) — null during free
     *  play within waves 1-2, and for the rest of the run once wave 3
     *  starts. 'place0' (run start) and 'place2' (post-wave-2) are picker
     *  beats with a canvas arrow cue; 'upgrade0' (post-wave-1, pad 0) is a
     *  tower-view beat with a DOM cue anchored to BuildSheet's own Upgrade
     *  button instead (never both at once — one voice). Round E: 'place2'
     *  no longer literally means "pad 2" — see ftueBeatPad below — the
     *  label only says which KIND of beat this is; towerScene.ts's
     *  applyFtueWaveEnd never sets a beat whose target can't be resolved
     *  (occupied pad / already-max tower), and actions.ts's syncStore
     *  keeps checking that live, in case something changes that later. */
    ftueBeat: 'place0' | 'upgrade0' | 'place2' | null;
    /** The pad ftueBeat's forced action targets. Always 0 for 'place0' and
     *  'upgrade0' (hardcoded — never buggy, pad 0 is always the pre-start
     *  pad); for 'place2' this is the real, dynamically-chosen target
     *  (prefers pad 2, falls back to the nearest empty pad) — the round E
     *  fix for the hard-lock a hardcoded pad 2 caused when it was occupied
     *  or the board was full. Stale/unused whenever ftueBeat isn't
     *  'place2'. */
    ftueBeatPad: number;
    /** Empty pad indices currently mid-pulse — round E generalises this
     *  from the FTUE's own post-wave-2 transition (still used there, just
     *  before pad 2/its fallback auto-selects) to firing after EVERY wave
     *  clear once the FTUE is done (persists through the whole build
     *  phase; actions.ts's startWave() clears it when the next wave
     *  starts, and placeTower() drops a pad from it the instant that pad
     *  fills). null when nothing is pulsing. */
    pulsePads: number[] | null;
    /** Last FTUE coin top-up (round D, task 3): the exact shortfall granted
     *  so a forced beat's requirement was affordable, shown briefly as a
     *  toast. ftueGrantNonce bumps on every grant (amounts can repeat
     *  across the two grant points, so the value alone can't key a re-show). */
    ftueGrantAmount: number;
    ftueGrantNonce: number;
    /** PNG data URLs of the tower art, generated at boot for DOM UI use */
    towerIcons: Record<string, string>;
    /** True for BACKDROP_LOCK_S (towerScene.ts) after a genuine block-to-
     *  block backdrop transition — art already cached, so the crossfade
     *  plays immediately, distinct from the silent game-start swap and a
     *  silent late-arriving load (docs: towerScene.ts's updateBackdrop).
     *  Ready reads this to lock itself for the crossfade's duration; reset
     *  at both run start and scene teardown so it can never latch locked. */
    backdropTransitioning: boolean;
    /** Platform engagement prompts: capability-gated by the host at boot */
    likeAvailable: boolean;
    commentsAvailable: boolean;
    isLiked: boolean;
}

const INITIAL: AppState = {
    phase: 'loading',
    loadProgress: 0,
    paused: false,
    runId: 0,
    coins: 0,
    lives: 0,
    wave: 1,
    waveCount: 10,
    tdPhase: 'build',
    speed: 1,
    selectedPad: null,
    padVersion: 0,
    bestWave: 0,
    gems: 0,
    gemsEarned: 0,
    adBonusClaimed: false,
    metaLevels: {},
    metaOpen: false,
    ranksOpen: false,
    settingsOpen: false,
    musicVol: 0.6,
    sfxVol: 0.8,
    runKills: 0,
    ftueActive: false,
    ftueBeat: null,
    ftueBeatPad: 3, // Round I Task 7: old pad 2 is now B2, index 3 (config.ts)
    pulsePads: null,
    ftueGrantAmount: 0,
    ftueGrantNonce: 0,
    towerIcons: {},
    backdropTransitioning: false,
    likeAvailable: false,
    commentsAvailable: false,
    isLiked: false,
};

/**
 * DEV ROBUSTNESS: the state lives on globalThis, not in module scope. On
 * Windows, Vite + the Tailwind plugin can transiently serve this module
 * under TWO urls (/src/... and /@fs/C:/...) after a hot reload, which
 * would give the Pixi scene and the React tree two separate stores
 * (symptoms: taps select pads but no sheet opens; towers and enemies stop
 * rendering). Anchoring the state globally makes every copy of this module
 * share one store. Harmless in production, where only one copy exists.
 */
interface StoreCore {
    state: AppState;
    listeners: Set<() => void>;
}
const host = globalThis as typeof globalThis & { __spice_ramu_store__?: StoreCore };
const core: StoreCore = (host.__spice_ramu_store__ ??= { state: INITIAL, listeners: new Set() });

export const store = {
    /** Read the current state (from game code; in React use useStore). */
    get: (): AppState => core.state,
    /** Shallow-merge a partial update and notify React subscribers. */
    patch(partial: Partial<AppState>): void {
        core.state = { ...core.state, ...partial };
        for (const l of core.listeners) l();
    },
    subscribe(l: () => void): () => void {
        core.listeners.add(l);
        return () => core.listeners.delete(l);
    },
};

/**
 * React hook. IMPORTANT: the selector must return a primitive or a stable
 * reference (e.g. s => s.phase). Returning a fresh object/array each call
 * makes React re-render forever.
 */
export function useStore<T = AppState>(
    selector: (s: AppState) => T = (s) => s as unknown as T
): T {
    return useSyncExternalStore(store.subscribe, () => selector(core.state));
}
