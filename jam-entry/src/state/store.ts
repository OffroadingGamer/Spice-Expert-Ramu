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
    /** True from the moment a Challenge run starts until wave 4 begins
     *  (GDD §10.11, round D: persistent — every run, not just the first;
     *  onboarding-balance round: extended from wave 3 to wave 4 to cover the
     *  third forced placement, 'place3' below). Gates the "Tap a cook to
     *  upgrade" hint (the cues below replace it) and keeps Sell disabled for
     *  the whole onboarding, not just the forced beats themselves. */
    ftueActive: boolean;
    /** Which forced FTUE beat currently walls the UI (Ready blocked, Close
     *  hidden, canvas taps locked to the beat's own pad) — null during free
     *  play within waves 1-3, and for the rest of the run once wave 4
     *  starts. 'placeFirst' (run start), 'place2' (post-wave-2) and 'place3'
     *  (post-wave-3) are picker beats with a canvas arrow cue; 'upgrade0'
     *  (post-wave-1, FTUE_FIRST_PAD) is a tower-view beat with a DOM cue
     *  anchored to BuildSheet's own Upgrade button instead (never both at
     *  once — one voice). Onboarding-balance round: 'place0' renamed
     *  'placeFirst' — its target moved off pad 0 (the worst opening in the
     *  game, bonus: null) onto FTUE_FIRST_PAD (actions.ts), a bonused pad,
     *  so the name no longer describes a literal pad index either. Round E:
     *  'place2'/'place3' don't literally mean "pad 2"/"pad 3" — see
     *  ftueBeatPad below — the label only says which KIND of beat this is;
     *  towerScene.ts's applyFtueWaveEnd never sets a beat whose target can't
     *  be resolved (occupied pad / already-max tower), and actions.ts's
     *  syncStore keeps checking that live, in case something changes that
     *  later. */
    ftueBeat: 'placeFirst' | 'upgrade0' | 'place2' | 'place3' | null;
    /** The pad ftueBeat's forced action targets. Always FTUE_FIRST_PAD
     *  (actions.ts) for 'placeFirst' and 'upgrade0' (hardcoded — never
     *  buggy, FTUE_FIRST_PAD is always the pre-start pad); for 'place2' and
     *  'place3' this is the real, dynamically-chosen target (each prefers
     *  its own bonused pad, falls back to the nearest empty pad) — the
     *  round E fix for the hard-lock a hardcoded pad 2 caused when it was
     *  occupied or the board was full. Stale/unused whenever ftueBeat is
     *  'placeFirst', 'upgrade0', or null. */
    ftueBeatPad: number;
    /** Empty pad indices currently mid-pulse — round E generalises this
     *  from the FTUE's own post-wave-2/post-wave-3 transitions (still used
     *  there, just before each beat's target/its fallback auto-selects) to
     *  firing after EVERY wave clear once the FTUE is done (persists
     *  through the whole build phase; actions.ts's startWave() clears it
     *  when the next wave starts, and placeTower() drops a pad from it the
     *  instant that pad fills). null when nothing is pulsing. */
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
    /** Blocker round: whether actions.getEngine() currently returns a live
     *  engine. getEngine() itself is a plain module read, not store state —
     *  reading it during render (StationRail.tsx, Hud.tsx) is invisible to
     *  React, so a component that mounts before createTowerScene's async
     *  createPixiApp resolves sees engine === null on its first render and
     *  has no guaranteed later render to recover on: useStore is
     *  useSyncExternalStore, which bails whenever a subscribed snapshot is
     *  unchanged, and on a re-entry with no tower placed, every OTHER field
     *  a component might subscribe to (coins/lives/wave/tdPhase/selectedPad)
     *  is already back at the exact values the new run re-establishes, so
     *  nothing forces a re-render. This field exists so "the engine became
     *  ready" is itself a real, subscribable state transition — set (both
     *  ways) by registerEngine() only, nowhere else. */
    engineReady: boolean;
    /** Platform engagement prompts: capability-gated by the host at boot */
    likeAvailable: boolean;
    commentsAvailable: boolean;
    isLiked: boolean;
    /** Rounds 0+1 (docs/Ideas.md §1/§6d): the one open dialogue beat, or
     *  null. `index` is which line of `lines` is showing. Only ever set by
     *  dialogueController.ts (queueDialogue/advanceDialogue/skipDialogue) —
     *  see that file for the queueing rule when a second beat triggers while
     *  one is still open. Hud.tsx hides Ready while this is non-null, the
     *  same condition it already applies for `selectedPad`. */
    dialogue: { id: string; voice: 'A' | 'B' | 'C'; lines: string[]; index: number } | null;
    /** Round 3 (docs/Ideas.md §6a/§6d): this wave's service progress —
     *  lives-weighted units, dishes served so far (kills since wave start),
     *  and the SAFE threshold below which the run can still be lost this
     *  wave. Patched from towerScene.ts's tick loop (syncGauge, mirroring
     *  actions.ts's syncStore diffing discipline — only on change), sampled
     *  once at wave start and held for the wave's duration (recomputing SAFE
     *  against a dropping mid-wave lives count would make the target line
     *  drift as you take damage). During the build phase this is a forecast
     *  of the UPCOMING wave (served: 0) rather than null, so Hud.tsx has
     *  something to draw before the first kill; null only once the run is
     *  lost (tdPhase === 'lost') or before an engine exists at all. */
    gauge: { units: number; served: number; safe: number } | null;
    /** Round 3: bumped by dialogueController.ts's unmuteDialogue() so
     *  ChefPortrait.tsx can play its brief warm->wry->warm un-mute cue
     *  (reusing the face-crossfade plumbing it already has) — the nonce, not
     *  a boolean, is what keys the effect, since un-muting twice in a row
     *  (impossible today, but see ftueGrantNonce's own doc for the same
     *  reasoning) must still be able to re-trigger it. */
    unmuteCueNonce: number;
    /** Round 4 Part D (docs/Ideas.md §6d): a reactive mirror of
     *  dialogueController.ts's own module-private `dialogueMuted` — that
     *  module's isDialogueMuted() is a plain read, invisible to React (the
     *  same class of problem store.ts's own engineReady field exists to
     *  solve). ServiceRing.tsx reads this to grey the ring regardless of
     *  fill. Kept in sync by muteDialogue()/unmuteDialogue()/
     *  resetDialogueQueue() (dialogueController.ts) — never patched
     *  anywhere else. */
    dialogueMuted: boolean;
    /** Round 6 Part B (docs/Ideas.md §6d): per-archetype count of enemies
     *  removed from the CURRENT wave's alive set (death or leak — this
     *  doesn't distinguish which, only that the dish is no longer on
     *  board), keyed by archetype id. Patched from towerScene.ts's tick
     *  loop, straight off the same preUids/postUids diff the coin-popup
     *  and leak-attribution tracking already runs every substep — no
     *  second enemy-tracking pass. Reset to {} the instant `wave` changes
     *  (the same "build phase begins" moment waveAt/blockForLevel key off
     *  of), so it always describes THIS wave, never a stale one. WaveBubble
     *  subtracts this from each dish's total to show a live "remaining"
     *  count. */
    waveDishServed: Record<string, number>;
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
    engineReady: false,
    likeAvailable: false,
    commentsAvailable: false,
    isLiked: false,
    dialogue: null,
    gauge: null,
    unmuteCueNonce: 0,
    dialogueMuted: false,
    waveDishServed: {},
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
