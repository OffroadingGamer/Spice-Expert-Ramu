/**
 * Ramu's dialogue box (docs/Ideas.md §1/§6b/§6d Round 1; §6d's "Round 2b"
 * amendment, Sep 15 2026). Bottom-anchored, same absolute-positioning tier
 * Hud.tsx's Ready column uses — the two are mutually exclusive by
 * construction (Hud.tsx hides Ready whenever `dialogue !== null`, the same
 * condition it already applies for `selectedPad`), so there's no overlap to
 * coordinate against there.
 *
 * Round 2c (same day, a playtest correction): the upgrade-reminder toast
 * this file used to render above beat 4 is gone (see towerScene.ts's Lv↑
 * markers instead); the line text is vertically centred against the
 * portrait rather than bottom-hugging; and Skip moved INSIDE the box's own
 * top-right corner at higher contrast (was rendering outside it, faint).
 * The visible "box" is a plain `<div>` now, not the Continue `<button>`
 * itself — Skip is a real sibling `<button>` positioned against that div,
 * which a nested button couldn't be (invalid HTML).
 *
 * Round 2b turns beats 1-4 into the FTUE's own Ready button — the box no
 * longer just advances/closes on every tap:
 *   - 'opening' (beat 1): plain advance/close, same as every other beat.
 *     Skippable — closing it (tap OR skip) is what releases the placeFirst
 *     picker cue (see releasePlaceFirstIfOpeningClosed below).
 *   - 'stove-lit' (beat 2, opens once placeFirst resolves) and 'wave4-ready'
 *     (beat 4, opens once place3 resolves): tap calls startWave() — the box
 *     IS Ready for these two, exactly like the real button (Hud.tsx).
 *   - 'wave1-cleared' (beat 3, opens on wave-1-cleared): stays open through
 *     the upgrade0 purchase (StationRail is on screen at the same time for
 *     exactly this window — the ONE case this box and the rail coexist, see
 *     useRailClearancePx below). Tap is a no-op while ftueBeat is still
 *     'upgrade0' (nothing to advance to yet); once the purchase resolves it,
 *     tap calls startWave() same as beats 2/4.
 *   - district-2..8 / overtime (beats 5-12): plain advance/close, unchanged,
 *     now also skippable (the amendment's own rule).
 * Skip only ever renders where skipping is actually allowed (isSkippable
 * below) — beats 2-4 have none: tapping IS the action, there's nothing to
 * skip past. Every box gets the small "tap to continue" hint regardless.
 *
 * Left side: a 160x160px slot holding Round 2's ChefPortrait (body + face,
 * costume by block, face by this beat's voice — see ChefPortrait.tsx).
 * Dropped only for beat 3's collision window (waitingOnUpgrade below) — the
 * box narrows to clear the rail there, and 160px of portrait plus the rail's
 * own reserved width leaves no room for the line to read at all.
 *
 * The one FTUE-specific wire this whole dialogue pass needs: closing the
 * OPENING beat is what releases the placeFirst picker cue (StationRail's
 * station list + arrow) — scriptedRunStart (actions.ts) held selectedPad at
 * null specifically so the picker doesn't appear behind/before it. Kept here
 * (not in dialogueController.ts) to avoid a cycle: this component already
 * imports actions.ts, and dialogueController.ts must not import back into
 * it — see that file's own doc comment.
 */
import { useEffect, useState } from 'react';
import { advanceDialogue, markOpeningSkipped, skipDialogue } from '../game/dialogueController.ts';
import { FTUE_FIRST_PAD, startWave } from '../game/actions.ts';
import { getFit, RAIL_WIDTH_UNITS } from '../game/stage.ts';
import { sfx } from '../audio/audio.ts';
import { store, useStore } from '../state/store.ts';
import ChefPortrait from './ChefPortrait.tsx';
import { RAIL_MIN_PX } from './StationRail.tsx';

/** Beats 5-12 (districts + overtime) are skippable, same as beat 1 — the
 *  amendment's own rule. Beats 2-4 ('stove-lit'/'wave1-cleared'/
 *  'wave4-ready') are themselves single-tap Ready substitutes and have no
 *  Skip: there's nothing to skip past, tapping already is the action. */
function isSkippable(id: string): boolean {
    return id === 'opening' || id.startsWith('district-') || id === 'overtime';
}

/** Live px StationRail.tsx's own right-edge panel plus its right-3 gutter
 *  occupies — RAIL_MIN_PX is exported from there so this isn't a second,
 *  driftable copy of that floor (same "one number" posture as Round 2's
 *  BACKDROP_FADE_S / chefBodyAliasForBlock shares). Only beat 3 needs this —
 *  every other beat's own ftueBeat state keeps the rail closed while its box
 *  is open, so there's nothing to clear. */
function useRailClearancePx(): number {
    const [px, setPx] = useState(0);
    useEffect(() => {
        const frame = document.getElementById('app-frame');
        if (!frame) return;
        const compute = () => {
            const rect = frame.getBoundingClientRect();
            const { scale } = getFit(rect.width, rect.height);
            setPx(Math.max(scale * RAIL_WIDTH_UNITS, RAIL_MIN_PX) + 12);
        };
        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(frame);
        return () => ro.disconnect();
    }, []);
    return px;
}

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
    // Subscribed so beat 3's tap behaviour (below) flips live the instant
    // the upgrade0 purchase resolves it — the box is already open and
    // doesn't otherwise re-render on that transition.
    const ftueBeat = useStore((s) => s.ftueBeat);
    const railClearancePx = useRailClearancePx();
    if (!dialogue) return null;

    const isLastLine = dialogue.index === dialogue.lines.length - 1;
    const skippable = isSkippable(dialogue.id);
    const waitingOnUpgrade = dialogue.id === 'wave1-cleared' && ftueBeat === 'upgrade0';
    const readyTap = dialogue.id === 'stove-lit' || dialogue.id === 'wave4-ready'
        || (dialogue.id === 'wave1-cleared' && !waitingOnUpgrade);

    const handleAdvance = () => {
        if (waitingOnUpgrade) return; // held open through the upgrade0 purchase — nothing to do yet
        if (readyTap) {
            sfx.startWave();
            startWave();
            advanceDialogue(); // always this beat's last line -- closes
            return;
        }
        sfx.click();
        advanceDialogue();
        if (isLastLine) releasePlaceFirstIfOpeningClosed(dialogue.id);
    };

    const handleSkip = () => {
        sfx.click();
        // Skipping the opening also skips beat 2 ('stove-lit') -- it doesn't
        // open on its own timer, it opens later when placeFirst resolves
        // (actions.ts's placeTower), so it must be told NOT to now.
        if (dialogue.id === 'opening') markOpeningSkipped();
        skipDialogue();
        releasePlaceFirstIfOpeningClosed(dialogue.id);
    };

    return (
        <div
            className={
                'pointer-events-none absolute inset-x-0 bottom-0 z-20 flex px-3 pb-safe-bottom ' +
                (waitingOnUpgrade ? 'justify-start' : 'justify-center')
            }
        >
            {/* waitingOnUpgrade left-anchors instead of centering — centering
                a narrowed box still places its right edge by the CONTAINER's
                centre, which can still reach into the rail (StationRail.tsx,
                right-3) depending on viewport width. Left-anchored, the
                inline maxWidth above is a hard right-edge cap measured from
                the screen's left edge, which is what actually keeps it clear. */}
            {/* Round 2c (docs/Ideas.md §6d amendment) removed the
                upgrade-reminder toast that used to render here above beat 4
                — see towerScene.ts's Lv↑ markers instead. */}
            {/* Round 2c: the visible "box" is this div now, not the Continue
                button directly — Skip needs to be a real sibling positioned
                against the box's own bounds (top-right corner, INSIDE it),
                and a <button> can't contain another <button> (invalid HTML;
                browsers hoist the nested one out, breaking both the layout
                and the tap target). Continue fills the box edge-to-edge. */}
            <div
                className="pointer-events-auto relative w-full overflow-hidden rounded-2xl bg-black/80"
                style={waitingOnUpgrade ? { maxWidth: `calc(100% - ${railClearancePx}px)` } : { maxWidth: '28rem' }}
            >
                <button
                    type="button"
                    aria-label="Continue"
                    onClick={handleAdvance}
                    className="flex w-full items-center gap-3 p-3 text-left"
                >
                    {!waitingOnUpgrade && <ChefPortrait size={160} variant="dialogue" />}
                    {/* Round 2c: centred against the 160px portrait (was
                        bottom-hugging via the row's old items-end-by-default —
                        items-center on the row above plus self-center here is
                        what actually centres it, since a flex-1 child
                        otherwise stretches to the row's own cross-size and
                        top-aligns its own text by default). Unaffected by the
                        compact beat-3 strip, which drops the portrait but
                        keeps this row. */}
                    <p className="flex-1 self-center text-[1.05rem] leading-snug font-semibold text-white">
                        {dialogue.lines[dialogue.index]}
                    </p>
                </button>
                {/* Round 2c: moved inside the box (was rendering outside its
                    right edge at white/70 on transparent — illegible at arm's
                    length). white/85 on the box's own bg-black/80 reads
                    clearly; stopPropagation keeps a Skip tap from also
                    registering as a tap-to-continue on the button beneath it. */}
                {skippable && (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleSkip(); }}
                        className="absolute top-2 right-2 rounded-full bg-black/70 px-3 py-1 text-[0.7rem] font-bold text-white/85"
                    >
                        Skip
                    </button>
                )}
                <span className="pointer-events-none absolute right-2 bottom-1 text-[0.6rem] font-semibold text-white/40">
                    tap to continue ▸
                </span>
            </div>
        </div>
    );
}
