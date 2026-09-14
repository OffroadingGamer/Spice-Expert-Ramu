/**
 * Ramu's dialogue-box pass (docs/Ideas.md §1, "Chosen dialogue — SELECTED
 * Sep 12 2026"). 11 entries carrying the 12 lines verbatim — the opening is
 * one entry with two lines (beats 1-2); every other beat is one line.
 *
 * `trigger` is a plain lookup key, not consumed generically: the opening is
 * embedded directly into actions.ts's scriptedRunStart() (it must land in
 * the same patch that arms the FTUE), 'wave1-cleared' and 'first-upgrade'
 * are queued from their one call site each, and 'district-<n>' / 'overtime'
 * are queued from towerScene.ts's block-boundary branch keyed on block.id.
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
        lines: [
            "Some days the tin is empty. Today's one of them.",
            "But the stove still lights. That's enough to start.",
        ],
    },
    {
        id: 'wave1-cleared',
        trigger: 'wave-1-cleared',
        voice: 'A',
        lines: ['They came back for seconds. Did you see that?'],
    },
    {
        id: 'first-upgrade',
        trigger: 'first-upgrade',
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
