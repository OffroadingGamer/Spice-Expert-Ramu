/**
 * Owns the dialogue queue (docs/Ideas.md §6d Round 1; §6d's Round 2b
 * amendment retired the once-per-player dialogueSeen gate — every beat
 * resets each run now, so queueDialogue no longer takes an oncePerPlayer
 * flag). Deliberately decoupled from actions.ts/FTUE state — the one
 * FTUE-specific wire (the opening beat releasing the placeFirst picker cue)
 * lives in DialogueBox.tsx instead, which already imports actions.ts;
 * importing FTUE_FIRST_PAD back in here would cycle against actions.ts's own
 * future imports of queueDialogue.
 *
 * Only one beat is ever open (store.dialogue); a second trigger while one is
 * showing queues behind it, FIFO — see store.ts's doc on `dialogue` for why
 * this is a guard against a case that can't currently happen rather than a
 * load-bearing feature.
 *
 * Round 3 (docs/Ideas.md §6d amendment, "Skip = mute"): Skip on ANY box now
 * mutes every later one for the rest of the run — and every run after,
 * persisted (state/save.ts) — until the player taps the chef. This replaces
 * Round 2b's narrower `openingSkipped` (which only ever suppressed beat 2)
 * with one flag that queueDialogue itself checks, the same early-return
 * shape as the CONFIG.narrative.enabled check right above it: a muted run
 * takes the identical "no dialogue, FTUE walls/rail proceed unchanged" path
 * a flag-off run already took, not a third code path. scriptedRunStart
 * (actions.ts) folds it into `showOpening` the same way, so a muted Retry
 * shows no opening either.
 */
import { store } from '../state/store.ts';
import { track } from '../sdk/analytics.ts';
import { getSave, setDialogueMuted } from '../state/save.ts';
import { CONFIG } from './config.ts';
import { dialogueById, type DialogueBeat } from './data/dialogue.ts';

let queue: DialogueBeat[] = [];

/** Loaded from the save at the start of every run (resetDialogueQueue) and
 *  flipped in place by mute/unmuteDialogue below — mirrors Round 2b's
 *  openingSkipped in shape (module-scoped, run-independent survivor) but
 *  persists past a single run rather than resetting with `queue`. */
let dialogueMuted = false;

/** Called from actions.ts's scriptedRunStart — a fresh run's beats re-queue
 *  from scratch, so any leftover overflow from a run that was quit mid-queue
 *  must not bleed into the next one. Also the one place the persisted mute
 *  flag loads into this module's live copy — a Retry must see whatever the
 *  player last set, not whatever this module happened to hold from before. */
export function resetDialogueQueue(): void {
    queue = [];
    dialogueMuted = getSave().dialogueMuted;
}

/** DialogueBox.tsx's Skip handler calls this for every box now (Round 3)
 *  — persists immediately so a mute survives Retry/reload even if the tab
 *  closes before anything else flushes the save. */
export function muteDialogue(): void {
    if (dialogueMuted) return;
    dialogueMuted = true;
    setDialogueMuted(true);
}

/** The chef-tap un-mute (idle portrait, or the HUD's chef-head button —
 *  Hud.tsx/ChefPortrait.tsx). Bumps unmuteCueNonce so ChefPortrait.tsx can
 *  play its brief face cue; "takes effect from the next wave" (docs/Ideas.md
 *  §6d amendment) falls out for free here — nothing re-queues a beat that
 *  already fired-and-was-suppressed, only a beat's own NEXT live trigger
 *  (the next wave's, in practice) ever calls queueDialogue again. */
export function unmuteDialogue(): void {
    if (!dialogueMuted) return;
    dialogueMuted = false;
    setDialogueMuted(false);
    store.patch({ unmuteCueNonce: store.get().unmuteCueNonce + 1 });
}

/** For anything (tests, a future HUD affordance) that needs to read the
 *  current mute state without reaching into state/save.ts's own store. */
export function isDialogueMuted(): boolean {
    return dialogueMuted;
}

function openBeat(beat: DialogueBeat): void {
    store.patch({ dialogue: { id: beat.id, voice: beat.voice, lines: beat.lines, index: 0 } });
    track('dialogue_shown', { id: beat.id });
}

/**
 * Queue a beat by id (the opening is special-cased in actions.ts's
 * scriptedRunStart, not routed through here). Every beat resets every run —
 * beats 1-4 ride ftueActive (already every run), district/overtime beats
 * reset by construction (a block boundary only exists once per run) — so
 * there is no persisted gate to check any more. CONFIG.narrative.enabled is
 * the master switch — false makes every call here a no-op; Round 3's
 * dialogueMuted is the same shape, checked right alongside it, so a muted
 * run is suppressed here at the exact moment its trigger fires ("suppressed,
 * not queued" — the amendment's own wording) rather than queued and then
 * discarded.
 */
export function queueDialogue(id: string): void {
    if (!CONFIG.narrative.enabled || dialogueMuted) return;
    const beat = dialogueById(id);
    if (!beat) return;
    if (store.get().dialogue) {
        queue.push(beat);
        return;
    }
    openBeat(beat);
}

/** Advance the open beat by one line, or close it on the last line. Reset on
 *  scene teardown isn't needed — the queue only ever holds cross-beat
 *  overflow within a single run and a fresh run's beats re-queue from
 *  scratch regardless of what was pending. */
export function advanceDialogue(): void {
    const current = store.get().dialogue;
    if (!current) return;
    if (current.index + 1 < current.lines.length) {
        store.patch({ dialogue: { ...current, index: current.index + 1 } });
        return;
    }
    closeCurrent(false);
}

/** Skip affordance, now on every box (Round 3) — closes immediately
 *  regardless of index. Callers pair this with muteDialogue() above; kept
 *  separate because they're independently meaningful (closeCurrent still
 *  needs to run even in a hypothetical future where Skip stops muting). */
export function skipDialogue(): void {
    closeCurrent(true);
}

function closeCurrent(skipped: boolean): void {
    const current = store.get().dialogue;
    if (!current) return;
    if (skipped) track('dialogue_skipped', { id: current.id });
    store.patch({ dialogue: null });
    const next = queue.shift();
    if (next) openBeat(next);
}
