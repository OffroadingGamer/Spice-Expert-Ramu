/**
 * Round 14 Part 3 (docs/Ideas.md §10.4, recipe scrolls): the 22 shipped
 * dishes (data/blocks.ts's own dish slugs — CAFE through NORTH EAST, blocks
 * 6-9 reuse these, never add a new one) that can carry an unlocked scroll's
 * one-line Ramu note. Data only, same posture as blocks.ts/dialogue.ts: the
 * note TEXT lives in en.ts under recipeNoteKey(slug) — every display string
 * belongs in the string table, not baked into a data file, so a future
 * Hindi/Tamil pass only ever touches en.ts, never this list.
 */
export const RECIPE_SLUGS: string[] = [
    'chai',
    'coffee',
    'naan',
    'jeera-rice',
    'palak-aloo',
    'gobhi-masala',
    'rajma',
    'coconut-chutney',
    'idli',
    'upma',
    'sambar',
    'beans-poriyal',
    'pesto',
    'minestrone',
    'arrabbiata',
    'aglio-e-olio',
    'risotto',
    'veg-thukpa',
    'bamboo-shoot-fry',
    'veg-momo',
    'sticky-rice',
    'ooti',
];

/** en.ts key for a dish's unlocked-scroll note. */
export function recipeNoteKey(slug: string): string {
    return `recipe.${slug}.note`;
}
