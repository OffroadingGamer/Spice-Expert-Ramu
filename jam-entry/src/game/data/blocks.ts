/**
 * Round I Task 6: the nine level blocks (Challenge Mode's ten-level nodes).
 * Data only — no logic. Source: docs/LevelBlocks.md §5a (dishes/themes) and
 * the RUSH labels table beneath it.
 *
 * Blocks 1-8 are ten levels each (block N = levels 10*(N-1)+1 .. 10*N);
 * block 9 is Overtime, levels 81+, endless.
 *
 * Every block shares one belt, one slot array and one wave ladder
 * (data/waves.ts) — blocks differ ONLY by which dish is painted on each of
 * the five fixed archetypes (and, for blocks 6-8 and Overtime, by carrying
 * TWO dishes per archetype that alternate per spawn — see towerScene.ts's
 * per-block dish selection). `label` is stored for the future HUD rename
 * (round 3); nothing renders it this round.
 */
export interface Block {
    id: number;
    label: string;
    theme: string;
    /** archetype id -> 1 or 2 dish slugs (manifest.ts `dish-*` aliases, minus the `dish-` prefix). */
    dishes: Record<string, string[]>;
}

export const BLOCKS: Block[] = [
    {
        id: 1,
        label: 'CAFE',
        theme: 'Cafe',
        // Block 1 is the FTUE: two dishes only (Chai, Coffee), across all
        // five archetypes — the glow tier is what tells them apart. §3:
        // "will prevent beginner's fatigue and encourage the players to
        // pursue." Stag alone carries both, alternating per boss wave (W7
        // chai, W8 coffee — see data/waves.ts's block-1 ladder override).
        dishes: {
            beetle: ['chai'],
            wasp: ['coffee'],
            snail: ['chai'],
            hornet: ['coffee'],
            stag: ['chai', 'coffee'],
        },
    },
    {
        id: 2,
        label: 'NORTH INDIAN',
        theme: 'North Indian Dhaba',
        dishes: {
            beetle: ['naan'],
            wasp: ['jeera-rice'],
            snail: ['palak-aloo'],
            hornet: ['gobhi-masala'],
            stag: ['rajma'],
            // omitted: baingan-bharta
        },
    },
    {
        id: 3,
        label: 'SOUTH INDIAN',
        theme: 'South Indian Dhaba',
        dishes: {
            beetle: ['coconut-chutney'],
            wasp: ['idli'],
            snail: ['upma'],
            hornet: ['sambar'],
            stag: ['beans-poriyal'],
            // omitted: rasam
        },
    },
    {
        id: 4,
        label: 'ITALIAN',
        theme: 'Italian Cookout',
        dishes: {
            beetle: ['pesto'],
            wasp: ['minestrone'],
            snail: ['arrabbiata'],
            hornet: ['aglio-e-olio'],
            stag: ['risotto'],
            // omitted: bruschetta
        },
    },
    {
        id: 5,
        label: 'NORTH EAST',
        theme: 'North-East Indian Eatery',
        dishes: {
            beetle: ['veg-thukpa'],
            wasp: ['bamboo-shoot-fry'],
            snail: ['veg-momo'],
            hornet: ['sticky-rice'],
            stag: ['ooti'],
            // omitted: xaak-bhaji
        },
    },
    {
        id: 6,
        label: 'NE FUSION',
        theme: 'NE Indian & Italian Fusion Cafe',
        // Double set: block 5 + block 4, one dish from each, alternating per spawn.
        dishes: {
            beetle: ['veg-thukpa', 'pesto'],
            wasp: ['bamboo-shoot-fry', 'minestrone'],
            snail: ['veg-momo', 'arrabbiata'],
            hornet: ['sticky-rice', 'aglio-e-olio'],
            stag: ['ooti', 'risotto'],
        },
    },
    {
        id: 7,
        label: 'ITALIAN FUSION',
        theme: 'Italian & S. Indian Fusion Dhaba',
        // Double set: block 4 + block 3.
        dishes: {
            beetle: ['pesto', 'coconut-chutney'],
            wasp: ['minestrone', 'idli'],
            snail: ['arrabbiata', 'upma'],
            hornet: ['aglio-e-olio', 'sambar'],
            stag: ['risotto', 'beans-poriyal'],
        },
    },
    {
        id: 8,
        label: 'DESI FUSION',
        theme: 'S. Indian & N. Indian Fusion Dhaba',
        // Double set: block 3 + block 2.
        dishes: {
            beetle: ['coconut-chutney', 'naan'],
            wasp: ['idli', 'jeera-rice'],
            snail: ['upma', 'palak-aloo'],
            hornet: ['sambar', 'gobhi-masala'],
            stag: ['beans-poriyal', 'rajma'],
        },
    },
    {
        id: 9,
        label: 'OVERTIME',
        theme: '5-star Royal Indian Restaurant',
        // Inherits block 8's double set (§5a: "inherits block 8's double set").
        dishes: {
            beetle: ['coconut-chutney', 'naan'],
            wasp: ['idli', 'jeera-rice'],
            snail: ['upma', 'palak-aloo'],
            hornet: ['sambar', 'gobhi-masala'],
            stag: ['beans-poriyal', 'rajma'],
        },
    },
];

/** Block (1-9) a given level (1-based) belongs to. Levels 81+ are all block 9. */
export function blockForLevel(level: number): Block {
    const id = level <= 80 ? Math.floor((level - 1) / 10) + 1 : 9;
    return BLOCKS[id - 1];
}

/** This level's position in its block's wave ladder (1-10). Levels 81+
 *  (Overtime) have no ladder position — callers should not call this for them. */
export function ladderPosition(level: number): number {
    return ((level - 1) % 10) + 1;
}

/** This block's chef-body manifest alias (Rounds 0+1/2, docs/Ideas.md
 *  §6b/§6d) — the slug matches manifest.ts's chef-body-* aliases by
 *  construction: both derive from the same block label, lowercased/
 *  hyphenated ('NORTH INDIAN' -> 'north-indian'), so a new block only ever
 *  needs its manifest line. Shared by towerScene.ts's prefetch and
 *  ChefPortrait.tsx's costume render — one copy, not two. */
export function chefBodyAliasForBlock(block: Block): string {
    return `chef-body-${block.label.toLowerCase().replace(/\s+/g, '-')}`;
}
