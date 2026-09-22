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
 * item 5): what RecipeSheet.tsx's ingredient rail shows, per dish, in the
 * cook's order (not alphabetical) — sprite ALIAS keys (manifest.ts's
 * `ing-<name>`), the same string ui/MetaUpgrades.tsx's ASSET_SRC map and
 * en.ts's `ingredient.<key>` labels both key off (see ingredientNameKey
 * below). Every alias here has a manifest entry as of art round 4's
 * flour/garlic/tomato landing (Round 17 Part 4) — none of the 30 that
 * shipped before it are missing either.
 *
 * Content, not simulation: this is flavor text for the unlocked-scroll
 * sheet, entirely independent of game/data/levels.ts's own INGREDIENT_
 * CATALOG (a different, unrelated "Kitchen Mode" sim this round's handover
 * explicitly keeps out of scope — kitchenScene.ts is untouched). A few
 * picks are deliberate, not just decorative:
 *   - chai / sambar are exactly 5 ingredients (the round's own acceptance
 *     line tests these two dish slugs at 5).
 *   - idli / sticky-rice are exactly 2 (the "2-ingredient dish" case the
 *     acceptance line's sheet-height check needs).
 *   - ooti (the boss dish) is exactly 7 (the "7-ingredient dish" case the
 *     same check needs) — a festive everything-dish reads right for a boss.
 *   - naan and aglio-e-olio were flagged "thin" in the source doc (only 2
 *     sprites each before art round 4); flour/garlic close them to 3.
 *   - arrabbiata / minestrone / risotto / pesto / veg-momo are the five
 *     dishes the source doc named as "strengthened" by the round-4 trio —
 *     each gets at least one of flour/garlic/tomato.
 * Every one of the 33 shipped ing-* aliases (7 pre-existing + 23 from
 * Art/_gen/ingredients/ + 3 from ingredients-r4-final/) is used at least
 * once below.
 */
export const RECIPE_INGREDIENTS: Record<string, string[]> = {
    chai: ['ing-tea-leaf', 'ing-milk', 'ing-ginger', 'ing-cardamom', 'ing-clove'],
    coffee: ['ing-coffee-extract', 'ing-milk', 'ing-cream'],
    naan: ['ing-flour', 'ing-ghee', 'ing-cumin-seed'],
    'jeera-rice': ['ing-rice', 'ing-ghee', 'ing-cumin-seed', 'ing-bay-leaf'],
    'palak-aloo': ['ing-potato', 'ing-onion', 'ing-garlic', 'ing-turmeric', 'ing-green-chilli'],
    'gobhi-masala': ['ing-cauliflower', 'ing-onion', 'ing-tomato', 'ing-turmeric', 'ing-coriander-seed'],
    rajma: ['ing-kidney-beans', 'ing-onion', 'ing-tomato', 'ing-garlic', 'ing-cumin-seed'],
    'coconut-chutney': ['ing-coconut-half', 'ing-green-chilli', 'ing-curry-leaf', 'ing-mustard-seed', 'ing-urad-dal'],
    idli: ['ing-rice', 'ing-urad-dal'],
    upma: ['ing-flour', 'ing-onion', 'ing-mustard-seed', 'ing-curry-leaf', 'ing-green-chilli'],
    sambar: ['ing-toor-dal', 'ing-tomato', 'ing-turmeric', 'ing-curry-leaf', 'ing-mustard-seed'],
    'beans-poriyal': ['ing-peas', 'ing-coconut-half', 'ing-mustard-seed', 'ing-curry-leaf', 'ing-green-chilli'],
    pesto: ['ing-pine-nut', 'ing-garlic', 'ing-parsley', 'ing-tomato'],
    minestrone: ['ing-tomato', 'ing-onion', 'ing-potato', 'ing-peas', 'ing-aubergine'],
    arrabbiata: ['ing-tomato', 'ing-garlic', 'ing-dried-red-chilli', 'ing-chilli-flakes', 'ing-oregano'],
    'aglio-e-olio': ['ing-garlic', 'ing-chilli-flakes', 'ing-parsley'],
    risotto: ['ing-rice', 'ing-onion', 'ing-garlic', 'ing-cream'],
    'veg-thukpa': ['ing-onion', 'ing-garlic', 'ing-coriander-seed', 'ing-green-chilli'],
    'bamboo-shoot-fry': ['ing-garlic', 'ing-green-chilli', 'ing-onion', 'ing-turmeric'],
    'veg-momo': ['ing-flour', 'ing-potato', 'ing-onion', 'ing-garlic', 'ing-coriander-seed'],
    'sticky-rice': ['ing-rice', 'ing-coconut-half'],
    ooti: ['ing-rice', 'ing-ghee', 'ing-cardamom', 'ing-clove', 'ing-cumin-seed', 'ing-bay-leaf', 'ing-turmeric'],
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
