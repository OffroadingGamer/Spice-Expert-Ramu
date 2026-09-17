/**
 * Ramu's dialogue box (docs/Ideas.md §1/§6b/§6d Round 1; §6d's "Round 2b"
 * amendment, Sep 15 2026; Round 4, Sep 16 2026, moves it to screen centre
 * and splits beat 3 from the upgrade dock — see below).
 *
 * Round 4 Part A (docs/Ideas.md §6d): centred both axes over the board,
 * which stays visible and tappable around it — this overlay's wrapper is
 * pointer-events-none, only the box itself opts back in, same as every
 * other HUD control. Same max-width as before (Tailwind's max-w-md IS
 * 28rem, so this is the same number, just no longer a one-off inline
 * style). The whole box is the Continue button (a tap anywhere inside
 * advances); Skip stays a real sibling, top-right, INSIDE the box, with
 * stopPropagation so it never also registers as a tap-to-continue.
 *
 * Round 4 Part B (docs/Ideas.md §6d): beat 3 ('wave1-cleared') no longer
 * stays open through the upgrade0 purchase — it's a plain advance/close
 * beat now, exactly like 'opening'. Closing it (tap OR skip) is what OPENS
 * the upgrade dock (actions.ts's openUpgrade0Beat, which is what
 * towerScene.ts's applyFtueWaveEnd used to do the INSTANT wave 1 cleared —
 * deferred here so the box gets the screen to itself first, per this
 * round's own screenshot feedback: "the box opens alone; tapping it shut
 * opens the upgrade dock"). This retires the narrowed/compact
 * rail-clearance variant entirely (the old RAIL_MIN_PX/useRailClearancePx
 * plumbing) — the box and the rail can no longer be on screen at the same
 * time, so there is nothing left to clear.
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
 * Round 3 (same day, folded into the amendment): Skip's MEANING changed —
 * it no longer just closes the current box, it mutes every later one for
 * the rest of the run (and every run after, persisted — see
 * dialogueController.ts's muteDialogue/unmuteDialogue). Because muting is
 * now a real, standalone action rather than a "nothing to skip past"
 * non-event, Skip renders on EVERY box now, including beats 2-4 — tapping
 * it there mutes and closes without starting the wave, which is harmless:
 * each of those beats' own ftueBeat/selectedPad state has already resolved
 * to "Ready would show" by the time its box is up, so closing the box
 * (muted or not) simply reveals the real Ready button underneath.
 *
 * Round 2b turns beats 1-4 into the FTUE's own Ready button — the box no
 * longer just advances/closes on every tap:
 *   - 'opening' (beat 1): plain advance/close, same as every other beat.
 *     Closing it (tap OR skip) is what releases the placeFirst picker cue
 *     (see releasePlaceFirstIfOpeningClosed below).
 *   - 'stove-lit' (beat 2, opens once placeFirst resolves) and 'wave4-ready'
 *     (beat 4, opens once place3 resolves): tap calls startWave() — the box
 *     IS Ready for these two, exactly like the real button (Hud.tsx).
 *   - 'wave1-cleared' (beat 3, opens on wave-1-cleared): Round 4 makes this
 *     a plain advance/close beat too (see this file's header note above) —
 *     closing it opens the upgrade dock instead of starting a wave.
 *   - district-2..8 / overtime (beats 5-12): plain advance/close, unchanged.
 * Every box gets the small "tap to continue" hint too.
 *
 * Left side: a 160x160px slot holding Round 2's ChefPortrait (body + face,
 * costume by block, face by this beat's voice — see ChefPortrait.tsx).
 * Round 4 drops the 100px compact-strip case Round 3 added for beat 3's old
 * rail-clearance window — every beat renders the full 160px now.
 *
 * Round 7 item 2 (docs/Ideas.md §6d, playtest of 1.77.0): beats 5-12 only
 * (the district/overtime beats — DISTRICT_BLOCK_ID below is exactly that
 * set) get a header line above the dialogue text, "RUSH: <BLOCK LABEL>" in
 * the WAVE chip's own sub-label wording (Hud.tsx: "RUSH: {block.label}") —
 * blocks.ts's labels are already upper-case, so no text-transform is doing
 * real work, just insurance. Looked up by the beat's own id rather than the
 * live store.wave, so there's no dependency on exactly when syncStore's
 * patch lands relative to this render (see towerScene.ts's tick() — the
 * block-boundary detection that queues these beats runs before syncStore in
 * the same tick, but reading the beat id directly needs no reasoning about
 * that ordering at all). Beats 1-4 (no header) keep the original
 * items-center/self-center centering; a header beat switches the row to
 * items-start so the portrait's top edge lines up with the header's own
 * top line ("portrait nudged up") instead of the whole block being
 * centered lower against just one line of text.
 *
 * The one FTUE-specific wire this whole dialogue pass needs: closing the
 * OPENING beat is what releases the placeFirst picker cue (StationRail's
 * station list + arrow) — scriptedRunStart (actions.ts) held selectedPad at
 * null specifically so the picker doesn't appear behind/before it. Kept here
 * (not in dialogueController.ts) to avoid a cycle: this component already
 * imports actions.ts, and dialogueController.ts must not import back into
 * it — see that file's own doc comment.
 */
import { advanceDialogue, muteDialogue, queueDialogueOnce, skipDialogue } from '../game/dialogueController.ts';
import { FTUE_FIRST_PAD, openUpgrade0Beat, startWave } from '../game/actions.ts';
import { BLOCKS } from '../game/data/blocks.ts';
import { sfx } from '../audio/audio.ts';
import { store, useStore } from '../state/store.ts';
import ChefPortrait from './ChefPortrait.tsx';

/** Round 7 item 2: beat id -> block id, for exactly the district/overtime
 *  beats (data/dialogue.ts's own ids) — enumerated explicitly rather than
 *  parsed out of the id string, so "beats 5-12 only" is a literal, visible
 *  set here rather than a regex some future beat id could accidentally
 *  match or miss. */
const DISTRICT_BLOCK_ID: Record<string, number> = {
    'district-2': 2,
    'district-3': 3,
    'district-4': 4,
    'district-5': 5,
    'district-6': 6,
    'district-7': 7,
    'district-8': 8,
    overtime: 9,
};

/** Round 7 item 2: "box ~15% taller" for a header beat — 184 is the box's
 *  natural (no-header) height (160px portrait + p-3's 12px top/bottom
 *  padding), measured live rather than assumed. */
const HEADER_BOX_MIN_PX = Math.round(184 * 1.15);

/** After closing the opening beat specifically, release the placeFirst
 *  picker cue — a no-op for every other beat, and a no-op if the player
 *  somehow left placeFirst already (nothing else can this early in a run,
 *  but this stays a plain state check rather than an assumption).
 *  Round 10 Part 2: this is also the moment the placeFirst picker cue
 *  actually becomes visible, so the 'prop-placement' once-ever beat queues
 *  right here. This function only ever runs when the opening beat WAS
 *  shown (closedId can only be 'opening' if that beat actually opened),
 *  which itself requires narrative on and not muted — the exact same two
 *  conditions queueDialogueOnce/queueDialogue re-check internally, so there
 *  is no separate "opening was skipped/off" trigger site to also cover:
 *  whenever the opening never shows, no beat in this whole system shows
 *  either, prop-placement included, consistent with every other beat here. */
function releasePlaceFirstIfOpeningClosed(closedId: string): void {
    const s = store.get();
    if (closedId === 'opening' && s.ftueActive && s.ftueBeat === 'placeFirst') {
        store.patch({ selectedPad: FTUE_FIRST_PAD });
        queueDialogueOnce('prop-placement');
    }
}

/** Round 4 Part B: after closing beat 3 ('wave1-cleared') specifically,
 *  open the upgrade dock on FTUE_FIRST_PAD — what towerScene.ts's
 *  applyFtueWaveEnd used to do the instant wave 1 cleared, now deferred to
 *  the moment the player actually dismisses the box (see this file's
 *  header note). A no-op for every other beat, and a no-op once the FTUE
 *  has already ended some other way. */
function openUpgrade0IfWave1ClearedClosed(closedId: string): void {
    if (closedId === 'wave1-cleared' && store.get().ftueActive) {
        openUpgrade0Beat();
    }
}

export default function DialogueBox() {
    const dialogue = useStore((s) => s.dialogue);
    if (!dialogue) return null;

    const isLastLine = dialogue.index === dialogue.lines.length - 1;
    const readyTap = dialogue.id === 'stove-lit' || dialogue.id === 'wave4-ready';
    const districtBlockId = DISTRICT_BLOCK_ID[dialogue.id];
    const header = districtBlockId ? `RUSH: ${BLOCKS[districtBlockId - 1].label}` : null;

    const onClosed = (closedId: string) => {
        releasePlaceFirstIfOpeningClosed(closedId);
        openUpgrade0IfWave1ClearedClosed(closedId);
    };

    const handleAdvance = () => {
        if (readyTap) {
            sfx.startWave();
            startWave();
            advanceDialogue(); // always this beat's last line -- closes
            return;
        }
        sfx.click();
        advanceDialogue();
        if (isLastLine) onClosed(dialogue.id);
    };

    const handleSkip = () => {
        sfx.click();
        // Round 3: Skip mutes every later box for the rest of the run (and
        // beyond, persisted) regardless of which beat it's tapped on — see
        // dialogueController.ts's own doc for why this doesn't need an
        // opening-specific case any more.
        muteDialogue();
        skipDialogue();
        onClosed(dialogue.id);
    };

    return (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-3">
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
                className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl bg-black/80"
                // Round 7 item 2: "box ~15% taller" for the header beats.
                // The box's natural height (no header) is bounded by the
                // 160px portrait plus its p-3 padding (~184px) — the header
                // line alone doesn't grow it (the text column is shorter
                // than the portrait either way), so a header beat needs an
                // explicit floor: HEADER_BOX_MIN_PX is exactly 184 * 1.15,
                // rounded.
                style={header ? { minHeight: HEADER_BOX_MIN_PX } : undefined}
            >
                <button
                    type="button"
                    aria-label="Continue"
                    onClick={handleAdvance}
                    className={
                        'flex w-full gap-3 p-3 text-left ' + (header ? 'h-full items-start' : 'items-center')
                    }
                >
                    <ChefPortrait size={160} variant="dialogue" />
                    {/* Round 2c: centred against the portrait (was
                        bottom-hugging via the row's old items-end-by-default —
                        items-center on the row above plus self-center here is
                        what actually centres it, since a flex-1 child
                        otherwise stretches to the row's own cross-size and
                        top-aligns its own text by default). Round 7 item 2:
                        a header beat instead uses items-start on the row
                        (above) so the header's own top line sits level with
                        the portrait's top edge — self-center here still
                        centres the (header+text) column as a group inside
                        whatever height the row gives it, unchanged. Round 7
                        item 2: self-center would override items-start above
                        for header beats (a per-child align-self always wins
                        over the parent's align-items), so it switches to
                        self-start there instead — the div's own top (the
                        header line) then sits at the row's top same as the
                        portrait, rather than being re-centred past it. */}
                    <div className={'flex flex-1 flex-col gap-1 ' + (header ? 'self-start' : 'self-center')}>
                        {header && (
                            <span className="text-[0.7rem] font-bold tracking-wide text-primary uppercase">
                                {header}
                            </span>
                        )}
                        <p className="text-[1.05rem] leading-snug font-semibold text-white">
                            {dialogue.lines[dialogue.index]}
                        </p>
                    </div>
                </button>
                {/* Round 2c: moved inside the box (was rendering outside its
                    right edge at white/70 on transparent — illegible at arm's
                    length). white/85 on the box's own bg-black/80 reads
                    clearly; stopPropagation keeps a Skip tap from also
                    registering as a tap-to-continue on the button beneath it.
                    Round 3: unconditional now — every box gets one, since
                    Skip's job changed from "skip this step" (beats 2-4 had
                    none, tapping already was the action) to "mute the rest of
                    the run" (a real action on any box, readyTap ones
                    included — see this file's header comment). */}
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleSkip(); }}
                    className="absolute top-2 right-2 rounded-full bg-black/70 px-3 py-1 text-[0.7rem] font-bold text-white/85"
                >
                    Skip
                </button>
                <span className="pointer-events-none absolute right-2 bottom-1 text-[0.6rem] font-semibold text-white/40">
                    tap to continue ▸
                </span>
            </div>
        </div>
    );
}
