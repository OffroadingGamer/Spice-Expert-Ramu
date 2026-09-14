/**
 * Owns the dialogue queue (docs/Ideas.md §6d Round 1). Deliberately decoupled
 * from actions.ts/FTUE state — the one FTUE-specific wire (the opening beat
 * releasing the placeFirst picker cue) lives in DialogueBox.tsx instead,
 * which already imports actions.ts; importing FTUE_FIRST_PAD back in here
 * would cycle against actions.ts's own future imports of queueDialogue.
 *
 * Only one beat is ever open (store.dialogue); a second trigger while one is
 * showing queues behind it, FIFO — see store.ts's doc on `dialogue` for why
 * this is a guard against a case that can't currently happen rather than a
 * load-bearing feature.
 */
import { store } from '../state/store.ts';
import { track } from '../sdk/analytics.ts';
import { CONFIG } from './config.ts';
import { getSave, markDialogueSeen } from '../state/save.ts';
import { dialogueById, type DialogueBeat } from './data/dialogue.ts';

let queue: DialogueBeat[] = [];

/** Called from actions.ts's scriptedRunStart — a fresh run's beats re-queue
 *  from scratch, so any leftover overflow from a run that was quit mid-queue
 *  must not bleed into the next one. */
export function resetDialogueQueue(): void {
    queue = [];
}

function openBeat(beat: DialogueBeat): void {
    store.patch({ dialogue: { id: beat.id, voice: beat.voice, lines: beat.lines, index: 0 } });
    track('dialogue_shown', { id: beat.id });
}

/**
 * Queue a beat by id. `oncePerPlayer` beats (wave1-cleared, first-upgrade —
 * the opening is special-cased in actions.ts's scriptedRunStart, not routed
 * through here) are gated on, and immediately marked into, the persisted
 * dialogueSeen list — marked BEFORE opening so a beat can never replay even
 * if the tab closes mid-line. District/overtime beats pass false: they
 * reset every run by construction (a block boundary only exists once per
 * run), no persistence needed. CONFIG.narrative.enabled is the master
 * switch — false makes every call here a no-op.
 */
export function queueDialogue(id: string, oncePerPlayer: boolean): void {
    if (!CONFIG.narrative.enabled) return;
    const beat = dialogueById(id);
    if (!beat) return;
    if (oncePerPlayer) {
        if (getSave().dialogueSeen.includes(id)) return;
        markDialogueSeen(id);
    }
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
