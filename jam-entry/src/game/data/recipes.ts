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

/**
 * Round 17 Part 3/4 (docs/Ideas.md §6d "Kitchen relayout + recipe sheet",
 * item 5), corrected Round 18 Part 1, rebuilt Round 18b Part 2 once the
 * licensed-pack stand-ins (semolina, tamarind, basil, green beans, spinach,
 * cabbage, bamboo shoot, the four oils, spaghetti, noodles) shipped as real
 * sprites: what RecipeSheet.tsx's ingredient rail shows, per dish, in the
 * cook's order (not alphabetical) — sprite ALIAS keys (manifest.ts's
 * `ing-<name>`), the same string ui/MetaUpgrades.tsx's ASSET_SRC map and
 * en.ts's `ingredient.<key>` labels both key off (see ingredientNameKey
 * below).
 *
 * Content, not simulation: this is flavor text for the unlocked-scroll
 * sheet, entirely independent of game/data/levels.ts's own INGREDIENT_
 * CATALOG (a different, unrelated "Kitchen Mode" sim this round's handover
 * explicitly keeps out of scope — kitchenScene.ts is untouched).
 *
 * Sixteen of the 22 rails changed from Round 18's data — each dish's own
 * genuine primary (rava for upma, green beans for beans-poriyal, basil for
 * pesto, spaghetti for aglio-e-olio, bamboo shoot for its own fry and for
 * ooti, etc.) now has a real sprite instead of being missing or standing in
 * for something else, and RecipeList.md §7's own Oil column supplies each
 * dish's actual oil (five dishes — chai, coffee, idli, sticky-rice,
 * veg-momo — take none: beverages and steamed things; five take ghee, which
 * already existed). Counts now range 2 (coffee/idli/sticky-rice) to 7
 * (palak-aloo/sambar/ooti).
 *
 * `aubergine` is referenced by zero rails, still: it was drawn for Baingan
 * Bharta, a level dish, not one of these 22 recipe slugs (docs/i18n/
 * recipes.md §4.4). ing-aubergine.png and its manifest alias stay.
 */
export const RECIPE_INGREDIENTS: Record<string, string[]> = {
    chai: ['ing-tea-leaf', 'ing-milk', 'ing-ginger', 'ing-cardamom', 'ing-clove'],
    coffee: ['ing-coffee-extract', 'ing-milk'],
    naan: ['ing-flour', 'ing-ghee', 'ing-cumin-seed'],
    'jeera-rice': ['ing-rice', 'ing-ghee', 'ing-cumin-seed', 'ing-bay-leaf'],
    'palak-aloo': ['ing-potato', 'ing-onion', 'ing-garlic', 'ing-turmeric', 'ing-green-chilli', 'ing-spinach', 'ing-ghee'],
    'gobhi-masala': ['ing-cauliflower', 'ing-onion', 'ing-tomato', 'ing-turmeric', 'ing-coriander-seed', 'ing-oil-mustard'],
    rajma: ['ing-kidney-beans', 'ing-onion', 'ing-tomato', 'ing-garlic', 'ing-cumin-seed', 'ing-ghee'],
    'coconut-chutney': ['ing-coconut-half', 'ing-green-chilli', 'ing-curry-leaf', 'ing-mustard-seed', 'ing-urad-dal', 'ing-oil-sesame'],
    idli: ['ing-rice', 'ing-urad-dal'],
    upma: ['ing-onion', 'ing-mustard-seed', 'ing-curry-leaf', 'ing-green-chilli', 'ing-semolina', 'ing-ghee'],
    sambar: ['ing-toor-dal', 'ing-tomato', 'ing-turmeric', 'ing-curry-leaf', 'ing-mustard-seed', 'ing-tamarind', 'ing-oil-sesame'],
    'beans-poriyal': ['ing-coconut-half', 'ing-mustard-seed', 'ing-curry-leaf', 'ing-green-chilli', 'ing-green-beans', 'ing-oil-coconut'],
    pesto: ['ing-pine-nut', 'ing-garlic', 'ing-parsley', 'ing-basil', 'ing-oil-olive'],
    minestrone: ['ing-tomato', 'ing-onion', 'ing-potato', 'ing-peas', 'ing-oil-olive'],
    arrabbiata: ['ing-tomato', 'ing-garlic', 'ing-dried-red-chilli', 'ing-chilli-flakes', 'ing-oregano', 'ing-oil-olive'],
    'aglio-e-olio': ['ing-garlic', 'ing-chilli-flakes', 'ing-parsley', 'ing-spaghetti', 'ing-oil-olive'],
    risotto: ['ing-rice', 'ing-onion', 'ing-garlic', 'ing-cream', 'ing-oil-olive'],
    'veg-thukpa': ['ing-onion', 'ing-garlic', 'ing-green-chilli', 'ing-cabbage', 'ing-noodles', 'ing-oil-mustard'],
    'bamboo-shoot-fry': ['ing-garlic', 'ing-green-chilli', 'ing-onion', 'ing-turmeric', 'ing-bamboo-shoot', 'ing-oil-mustard'],
    'veg-momo': ['ing-flour', 'ing-potato', 'ing-onion', 'ing-garlic', 'ing-cabbage'],
    'sticky-rice': ['ing-rice', 'ing-coconut-half'],
    ooti: ['ing-peas', 'ing-onion', 'ing-ginger', 'ing-garlic', 'ing-dried-red-chilli', 'ing-bamboo-shoot', 'ing-oil-mustard'],
};

/** A slug's ingredient alias list, or []  for an unknown slug (defensive —
 *  every RECIPE_SLUGS entry has an array above; this never actually returns
 *  []) . */
export function recipeIngredients(slug: string): string[] {
    return RECIPE_INGREDIENTS[slug] ?? [];
}

/** en.ts key for one ingredient's display name — keyed on the bare
 *  ingredient key (alias minus its `ing-` prefix), same as game/data/
 *  levels.ts's own IngredientKind.key, so a future merge of the two
 *  ingredient lists doesn't have to rename anything. */
export function ingredientNameKey(ingredientAlias: string): string {
    return `ingredient.${ingredientAlias.replace(/^ing-/, '')}`;
}

/**
 * Round 19 Part 1/2 (docs/Ideas.md §11.2j): per-recipe shard economy,
 * replacing the old flat SHARDS_PER_SCROLL=8 / SCROLL_GEM_PRICE=150
 * constants (save.ts) and the flat +1-per-clear award (awardShards). Four
 * values per dish: the wave that must be beaten once before the recipe can
 * be collected at all (null for chai/coffee — gated on FTUE completion, not
 * a wave number, see recipeUnlockWave), the toque-badge count needed to
 * complete the scroll, the gem price to buy it outright, and the badges
 * paid per zero-leak clear of a wave that serves this dish.
 *
 * unlockWave is HARDCODED, not derived at runtime — data/waves.ts's LADDER
 * (which archetype opens each of a block's ten wave positions) is
 * unexported and waves.ts is sealed this round, so this is a one-time
 * read-and-check, re-derivable by hand from blocks.ts + waves.ts's own
 * LADDER whenever either changes:
 *
 *   unlockWave = 10 * (block.id - 1) + ladderPositionOf(archetype)
 *
 * where a dish's (block, archetype) is its entry in blocks.ts's own
 * BLOCKS[n].dishes, and ladderPositionOf is {beetle:1, wasp:2, snail:4,
 * hornet:5, stag:7} (waves.ts's LADDER array — positions 3/6/8/9/10 never
 * OPEN a new archetype, so they never gate a recipe). E.g. rajma is block
 * 2's stag (offset 10, stag position 7) -> wave 17; sambar is block 3's
 * hornet (offset 20, hornet position 5) -> wave 25. Verified this way for
 * all 20 gated dishes against docs/Ideas.md §11.2j's own table. Fusion
 * blocks 6-9 reuse an earlier block's dish on a LATER position (e.g. block
 * 6's beetle also carries pesto, block 4's own beetle dish) — that later
 * position is never the dish's gate, its ORIGINAL (lowest-block) position
 * always is, since a player reaches the earlier block first.
 */
export interface RecipeEconomy {
    /** Wave that must be beaten once before this recipe can be collected —
     *  null for chai/coffee, which gate on FTUE completion instead (see
     *  RecipeCard's own `unlockWave === null` branch, ui/MetaUpgrades.tsx). */
    unlockWave: number | null;
    /** Toque badges needed to complete the scroll. Was flat 8 for every dish. */
    shardsNeeded: number;
    /** Gem price to buy the scroll outright. Was flat 150 for every dish. */
    gemPrice: number;
    /** Badges paid per zero-leak wave clear serving this dish. Was flat +1. */
    shardAward: number;
}

export const RECIPE_ECONOMY: Record<string, RecipeEconomy> = {
    // Cafe (block 1) — FTUE, no wave gate.
    chai: { unlockWave: null, shardsNeeded: 10, gemPrice: 100, shardAward: 1 },
    coffee: { unlockWave: null, shardsNeeded: 12, gemPrice: 120, shardAward: 1 },
    // North Indian (block 2, offset 10).
    naan: { unlockWave: 11, shardsNeeded: 16, gemPrice: 160, shardAward: 2 },
    'jeera-rice': { unlockWave: 12, shardsNeeded: 18, gemPrice: 180, shardAward: 2 },
    'palak-aloo': { unlockWave: 14, shardsNeeded: 20, gemPrice: 200, shardAward: 2 },
    'gobhi-masala': { unlockWave: 15, shardsNeeded: 22, gemPrice: 220, shardAward: 2 },
    rajma: { unlockWave: 17, shardsNeeded: 24, gemPrice: 240, shardAward: 2 },
    // South Indian (block 3, offset 20).
    'coconut-chutney': { unlockWave: 21, shardsNeeded: 26, gemPrice: 260, shardAward: 3 },
    idli: { unlockWave: 22, shardsNeeded: 28, gemPrice: 280, shardAward: 3 },
    upma: { unlockWave: 24, shardsNeeded: 30, gemPrice: 300, shardAward: 3 },
    sambar: { unlockWave: 25, shardsNeeded: 32, gemPrice: 320, shardAward: 3 },
    'beans-poriyal': { unlockWave: 27, shardsNeeded: 34, gemPrice: 340, shardAward: 3 },
    // Italian (block 4, offset 30).
    pesto: { unlockWave: 31, shardsNeeded: 38, gemPrice: 380, shardAward: 4 },
    minestrone: { unlockWave: 32, shardsNeeded: 40, gemPrice: 400, shardAward: 4 },
    arrabbiata: { unlockWave: 34, shardsNeeded: 42, gemPrice: 420, shardAward: 4 },
    'aglio-e-olio': { unlockWave: 35, shardsNeeded: 44, gemPrice: 440, shardAward: 4 },
    risotto: { unlockWave: 37, shardsNeeded: 46, gemPrice: 460, shardAward: 4 },
    // North East (block 5, offset 40) — ooti is the deliberate capstone.
    'veg-thukpa': { unlockWave: 41, shardsNeeded: 52, gemPrice: 520, shardAward: 5 },
    'bamboo-shoot-fry': { unlockWave: 42, shardsNeeded: 54, gemPrice: 540, shardAward: 5 },
    'veg-momo': { unlockWave: 44, shardsNeeded: 56, gemPrice: 560, shardAward: 5 },
    'sticky-rice': { unlockWave: 45, shardsNeeded: 58, gemPrice: 580, shardAward: 5 },
    ooti: { unlockWave: 47, shardsNeeded: 60, gemPrice: 600, shardAward: 5 },
};

/** Wave that must be beaten once before this recipe can be collected, or
 *  null for chai/coffee (FTUE-gated, not wave-gated). Defensive fallback
 *  (null) for an unknown slug — every RECIPE_SLUGS entry has a real row
 *  above, this never actually falls through. */
export function recipeUnlockWave(slug: string): number | null {
    return RECIPE_ECONOMY[slug]?.unlockWave ?? null;
}

/** Toque badges needed to complete this recipe's scroll. Defensive fallback
 *  (the old flat value) for an unknown slug — never actually hit. */
export function recipeShardsNeeded(slug: string): number {
    return RECIPE_ECONOMY[slug]?.shardsNeeded ?? 8;
}

/** Gem price to buy this recipe's scroll outright. Defensive fallback (the
 *  old flat value) for an unknown slug — never actually hit. */
export function recipeGemPrice(slug: string): number {
    return RECIPE_ECONOMY[slug]?.gemPrice ?? 150;
}

/** Badges awarded per zero-leak wave clear serving this dish. Defensive
 *  fallback (the old flat value) for an unknown slug — never actually hit. */
export function recipeShardAward(slug: string): number {
    return RECIPE_ECONOMY[slug]?.shardAward ?? 1;
}

/**
 * Round 18 Part 3: how much larger than every other dish's icon chai and
 * coffee need to render at, in the two recipe-only surfaces (card medallion,
 * sheet header plate) — every dish not listed here defaults to 1 (no zoom).
 * Both dish-*.png sprites share the same 212x141 canvas, but chai/coffee's
 * own opaque art is only 75px wide on it, against the ~204px every other
 * dish fills (the canonical bbox RecipeSheet.tsx:44's own DISH_OPAQUE_W
 * documents) — an older/FTUE art lineage, not a scaling bug. 204/75 = 2.72
 * brings their rendered opaque width to parity with every other dish's.
 * Applied by sizing the <img> element itself (never a CSS transform, which
 * would rasterize-then-blur an already-rasterized layer) inside an
 * overflow:hidden container, so the browser re-rasterizes at the larger
 * size and 75 source px into ~18mu stays a downscale, not an upscale.
 */
export const DISH_ICON_ZOOM: Record<string, number> = {
    chai: 204 / 75,
    coffee: 204 / 75,
};

/** A dish's icon zoom factor, or 1 for every dish not in DISH_ICON_ZOOM. */
export function dishIconZoom(slug: string): number {
    return DISH_ICON_ZOOM[slug] ?? 1;
}
