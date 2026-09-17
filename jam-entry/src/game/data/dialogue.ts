/**
 * Ramu's dialogue-box pass (docs/Ideas.md §1, "Chosen dialogue — SELECTED
 * Sep 12 2026"; §6d's "Round 2b" amendment, Sep 15 2026, turns beats 1-4
 * into the FTUE's own Ready button). 12 entries, one line each — the
 * opening's second line is now its own beat (see 'stove-lit' below) instead
 * of sharing 'opening's two-line array, because it fires on a different
 * trigger and its tap starts wave 1 rather than just closing the box.
 *
 * `trigger` is a plain lookup key, not consumed generically: the opening is
 * embedded directly into actions.ts's scriptedRunStart() (it must land in
 * the same patch that arms the FTUE), 'stove-lit' and 'wave4-ready' queue
 * from actions.ts's placeTower() (placeFirst/place3 resolving), 'wave1-
 * cleared' queues from towerScene.ts's trackWaveClears(), and 'district-<n>'
 * / 'overtime' queue from towerScene.ts's block-boundary branch keyed on
 * block.id. No beat is once-per-player any more (the amendment retired
 * dialogueSeen) — beats 1-4 ride ftueActive (already every run), 5-12 reset
 * with runId as before.
 *
 * Round 10 Part 2 (docs/Ideas.md §6d, "Playtest of 1.80.0" item 4): four
 * more beats — 'recipe-widget', 'heat-gauge-intro', 'prop-placement' below,
 * plus the EXISTING 'upgrade0' DOM cue (BuildSheet's own Upgrade-button
 * arrow, not a beat in this table — Central's own item 4 confirmed the
 * existing beat already teaches this, no new entry needed). Unlike beats
 * 1-12 above, these three fire ONCE EVER PER SAVE, not once per run —
 * dialogueController.ts's queueDialogueOnce (not the plain queueDialogue
 * every other beat here uses) persists a seen-flag per id in state/save.ts,
 * mirroring dialogueMuted's own persistence shape. Trigger sites: 'recipe-
 * widget' from WaveBubble.tsx's useWaveBubble (first render where the
 * bubble is populated for wave 1's build phase), 'heat-gauge-intro' from
 * towerScene.ts's trackWaveClears (queued immediately before 'wave1-
 * cleared' on e.cleared === 1, so it drains first), 'prop-placement' from
 * DialogueBox.tsx's releasePlaceFirstIfOpeningClosed and actions.ts's
 * scriptedRunStart (whichever moment the placeFirst picker cue actually
 * becomes live — right after the opening beat closes, or immediately if
 * the opening is off/muted).
 */
export interface DialogueBeat {
    id: string;
    trigger: string;
    voice: 'A' | 'B' | 'C';
    lines: string[];
}

export const DIALOGUE_BEATS: DialogueBeat[] = [
    {
        id: 'opening',
        trigger: 'run-start',
        voice: 'A',
        lines: ["Some days the tin is empty. Today's one of them."],
    },
    {
        id: 'prop-placement',
        trigger: 'place-first-armed',
        voice: 'A',
        lines: ['Green ring means you can afford it. Tap one and pick a prop. Red means save up.'],
    },
    {
        id: 'stove-lit',
        trigger: 'place-first-resolved',
        voice: 'A',
        lines: ["But the stove still lights. That's enough to start."],
    },
    {
        id: 'recipe-widget',
        trigger: 'wave-bubble-first-shown',
        voice: 'A',
        lines: ['That scroll up top is the order. Every dish on it walks in this rush — count them off as you serve.'],
    },
    {
        id: 'heat-gauge-intro',
        trigger: 'rush-1-cleared-pre-upgrade',
        voice: 'A',
        lines: ['See the heat on the left? Every rush you survive turns it up a notch. When it hits the flame — the big one walks in. Be ready.'],
    },
    {
        id: 'wave1-cleared',
        trigger: 'wave-1-cleared',
        voice: 'A',
        lines: ["They came back for seconds. Did you see that? It's time to upgrade."],
    },
    {
        id: 'wave4-ready',
        trigger: 'wave-4-build',
        voice: 'B',
        lines: ["New gear, same nerves. Let's find out."],
    },
    {
        id: 'district-2',
        trigger: 'block-2',
        voice: 'A',
        lines: ["A real dhaba. Tandoor and all. I'm not dreaming?"],
    },
    {
        id: 'district-3',
        trigger: 'block-3',
        voice: 'A',
        lines: ['They want dosa now. My wrist is ready.'],
    },
    {
        id: 'district-4',
        trigger: 'block-4',
        voice: 'B',
        lines: ["They want Italian. I watched one video. We're fine."],
    },
    {
        id: 'district-5',
        trigger: 'block-5',
        voice: 'B',
        lines: ["Smoked chilli. I'll cry through this whole shift."],
    },
    {
        id: 'district-6',
        trigger: 'block-6',
        voice: 'A',
        lines: ["I stopped copying recipes. I'm writing them."],
    },
    {
        id: 'district-7',
        trigger: 'block-7',
        voice: 'A',
        lines: ['Two kitchens, one plate. Nobody taught me this.'],
    },
    {
        id: 'district-8',
        trigger: 'block-8',
        voice: 'A',
        lines: ["This one's mine. Every bit of it."],
    },
    {
        id: 'overtime',
        trigger: 'block-9',
        voice: 'C',
        lines: ['Every plate tonight had two pairs of hands. Thank you.'],
    },
];

export const OPENING_DIALOGUE = DIALOGUE_BEATS[0];

const BEATS_BY_ID = new Map(DIALOGUE_BEATS.map((b) => [b.id, b]));

/** District/overtime beats are keyed on block.id (2-9) at the call site —
 *  this is the one lookup towerScene.ts needs. */
export function dialogueForBlock(blockId: number): DialogueBeat | undefined {
    return BEATS_BY_ID.get(blockId === 9 ? 'overtime' : `district-${blockId}`);
}

export function dialogueById(id: string): DialogueBeat | undefined {
    return BEATS_BY_ID.get(id);
}
