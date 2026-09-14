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
 */
import { store } from '../state/store.ts';
import { track } from '../sdk/analytics.ts';
import { CONFIG } from './config.ts';
import { dialogueById, type DialogueBeat } from './data/dialogue.ts';

let queue: DialogueBeat[] = [];

/** Round 2b (docs/Ideas.md §6d amendment): "Skip on beat 1 only skips beats
 *  1 and 2 together" — beat 2 ('stove-lit') doesn't open on its own timer,
 *  it opens later, whenever placeFirst happens to resolve (actions.ts's
 *  placeTower), so suppressing it can't go through the FIFO queue above
 *  (that only holds beats already competing to open NOW). This flag is the
 *  one piece of state that survives between "beat 1 closed" and "placeFirst
 *  resolved," parallel to `queue` itself — reset every run alongside it. */
let openingSkipped = false;

/** Called from actions.ts's scriptedRunStart — a fresh run's beats re-queue
 *  from scratch, so any leftover overflow from a run that was quit mid-queue
 *  must not bleed into the next one. */
export function resetDialogueQueue(): void {
    queue = [];
    openingSkipped = false;
}

/** DialogueBox.tsx calls this from its Skip handler, only for the opening
 *  beat (id 'opening') — skipping a later, already-skippable beat (5-12)
 *  has nothing to suppress downstream and must not set this. */
export function markOpeningSkipped(): void {
    openingSkipped = true;
}

/** actions.ts's placeTower reads this once, at the moment placeFirst
 *  resolves, to decide whether beat 2 still queues. */
export function wasOpeningSkipped(): boolean {
    return openingSkipped;
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
 * the master switch — false makes every call here a no-op.
 */
export function queueDialogue(id: string): void {
    if (!CONFIG.narrative.enabled) return;
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

/** Opening-only skip affordance — closes immediately regardless of index. */
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
