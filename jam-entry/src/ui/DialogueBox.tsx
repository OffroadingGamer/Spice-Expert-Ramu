/**
 * Ramu's dialogue box (docs/Ideas.md §1/§6b/§6d Round 1). Bottom-anchored,
 * same absolute-positioning tier Hud.tsx's Ready column uses — the two are
 * mutually exclusive by construction (Hud.tsx hides Ready whenever
 * `dialogue !== null`, the same condition it already applies for
 * `selectedPad`), so there's no overlap to coordinate against.
 *
 * Tap anywhere on the box to advance; the last line's tap closes it. A small
 * skip affordance shows only on the opening beat (id 'opening') — district
 * beats are not skippable (docs/Ideas.md §1's own design note).
 *
 * Left side: a 160x160px slot holding Round 2's ChefPortrait (body + face,
 * costume by block, face by this beat's voice — see ChefPortrait.tsx).
 *
 * The one FTUE-specific wire this whole dialogue pass needs: closing the
 * OPENING beat is what releases the placeFirst picker cue (StationRail's
 * station list + arrow) — scriptedRunStart (actions.ts) held selectedPad at
 * null specifically so the picker doesn't appear behind/before the opening
 * two lines. Kept here (not in dialogueController.ts) to avoid a cycle:
 * this component already imports actions.ts, and dialogueController.ts must
 * not import back into it — see that file's own doc comment.
 */
import { advanceDialogue, skipDialogue } from '../game/dialogueController.ts';
import { FTUE_FIRST_PAD } from '../game/actions.ts';
import { sfx } from '../audio/audio.ts';
import { store, useStore } from '../state/store.ts';
import ChefPortrait from './ChefPortrait.tsx';

/** After closing the opening beat specifically, release the placeFirst
 *  picker cue — a no-op for every other beat, and a no-op if the player
 *  somehow left placeFirst already (nothing else can this early in a run,
 *  but this stays a plain state check rather than an assumption). */
function releasePlaceFirstIfOpeningClosed(closedId: string): void {
    const s = store.get();
    if (closedId === 'opening' && s.ftueActive && s.ftueBeat === 'placeFirst') {
        store.patch({ selectedPad: FTUE_FIRST_PAD });
    }
}

export default function DialogueBox() {
    const dialogue = useStore((s) => s.dialogue);
    if (!dialogue) return null;

    const isLastLine = dialogue.index === dialogue.lines.length - 1;
    const isOpening = dialogue.id === 'opening';

    const handleAdvance = () => {
        sfx.click();
        advanceDialogue();
        if (isLastLine) releasePlaceFirstIfOpeningClosed(dialogue.id);
    };

    const handleSkip = () => {
        sfx.click();
        skipDialogue();
        releasePlaceFirstIfOpeningClosed(dialogue.id);
    };

    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-safe-bottom">
            <button
                type="button"
                aria-label="Continue"
                onClick={handleAdvance}
                className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-black/80 p-3 text-left"
            >
                <ChefPortrait size={160} variant="dialogue" />
                <p className="flex-1 text-[1.05rem] leading-snug font-semibold text-white">
                    {dialogue.lines[dialogue.index]}
                </p>
            </button>
            {isOpening && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleSkip(); }}
                    className="pointer-events-auto absolute top-0 right-6 -translate-y-full rounded-full bg-black/70 px-3 py-1 text-[0.7rem] font-bold text-white/70"
                >
                    Skip
                </button>
            )}
        </div>
    );
}
