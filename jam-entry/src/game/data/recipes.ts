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
