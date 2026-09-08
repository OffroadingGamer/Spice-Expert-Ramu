/**
 * Round 16: the level-data container. Node 0's four levels plus Node 1 Level
 * 1 — the five levels the FTUE round needs to exist before it can be
 * written (KitchenMode/LevelEconomy.md §11). Every number below is
 * LevelEconomy.md §11.2's, derived there, not invented here — see that
 * section for the derivation and its one exception (N0 L1 keeps its shipped
 * 340 over the formula's 339: the one-coin difference can't change a band).
 *
 * 🔑 Narrow exception to the src/game/data/ ban this round only — this file
 * is new, and it is the ONLY file in this folder Kitchen Mode may touch;
 * towers.ts/enemies.ts/waves.ts/status.ts/targeting.ts belong to Challenge
 * Mode and are untouched.
 *
 * This is a container, not a mechanic: `dishes`, `props`, `prePlaced` and
 * `grants` are recorded for completeness and for the FTUE round to build on,
 * but nothing reads them yet. `target`, `walkoutsAllowed`, `startingFloat`,
 * `stars` and — as of round 17 — `recipes` (and the `ingredients` count it
 * implies) are all live; see `getActiveLevel()` call sites in
 * sim/kitchen.ts and kitchenScene.ts. kitchenConfig.ts's `levelProps` is
 * still untouched — station/prop wiring per level stays data-only
 * (`props`/`prePlaced`) this round too.
 *
 * Round 17: `recipes` is what a level actually cooks. Each entry is an id, a
 * display name, an ingredients string array (keys into `INGREDIENT_CATALOG`
 * below), and a `finalDish` manifest alias — RecipeList.md §7.0/§7.1 fixes
 * the dishes; sim/kitchen.ts derives its ingredient bag and its completion
 * check from the ACTIVE level's `recipes`, never KITCHEN_CONFIG's own
 * copies (now SUPERSEDED, see that file). A dish with no manifest sprite
 * (jeera-rice's `finalDish` below) is fine, exactly like an ingredient with
 * none — kitchenScene.ts falls back to a procedural tile either way, no
 * asset work needed this round. `CHAI_RECIPE`/`COFFEE_RECIPE` are declared
 * once and referenced from every level that cooks them (N0 L3 and N0 L4
 * both cook the same pair L1/L2 introduce separately) so the copies can't
 * quietly drift apart from each other.
 *
 * Round 23: level selection is no longer frozen at module scope.
 * `getActiveLevel()`/`getActiveIngredientKinds()` are deleted outright (no
 * wrappers) — `ACTIVE_LEVEL_ID` is renamed `FIRST_LEVEL_ID` (where a fresh
 * session starts, not "the level"), and callers now navigate explicitly:
 * `getLevelById(id)`, `getNextLevelId(id)`, and `getIngredientKinds(level)`
 * (the same union this file always computed, now taking the level as an
 * argument instead of reading a frozen global). The level records
 * themselves are unchanged — this is only how one gets selected.
 */

/** Round 17: display info for one ingredient key — the alias/label/color
 *  kitchenScene.ts's makeIngredientView needs, independent of which
 *  recipe(s) reference the key. Every key any of the five levels' recipes
 *  use must have an entry here; sim/kitchen.ts and kitchenScene.ts both
 *  derive their live ingredient set as a level's own union of this catalog
 *  (Round 23: `getIngredientKinds(level)` below) — never the full catalog,
 *  and never KITCHEN_CONFIG.ingredientKinds (SUPERSEDED, see that file). */
export interface IngredientKind {
    key: string;
    alias: string;
    label: string;
    color: number;
}

/**
 * Round 17: every ingredient key any of the five levels' recipes reference.
 * `coffee-extract`/`cream`/`rice`/`ghee` have no manifest sprite yet — the
 * same procedural-tile fallback tea-leaf already used (kitchenScene.ts's
 * makeIngredientView keys off `alias` via Assets.cache.has; no 404 risk,
 * since these aliases are never passed to Assets.load unless a manifest
 * entry actually exists — see kitchenScene.ts's BAKED_ALIASES filter). No
 * asset work this round, per the handover.
 */
export const INGREDIENT_CATALOG: IngredientKind[] = [
    { key: 'milk', alias: 'ing-milk', label: 'Milk', color: 0xe8e2d0 },
    { key: 'ginger', alias: 'ing-ginger', label: 'Ginger', color: 0xd9a441 },
    { key: 'tea-leaf', alias: 'ing-tea-leaf', label: 'Tea Leaf', color: 0x3a5f3a },
    { key: 'coffee-extract', alias: 'ing-coffee-extract', label: 'Coffee Extract', color: 0x4a2f1a },
    { key: 'cream', alias: 'ing-cream', label: 'Cream', color: 0xf3ead2 },
    { key: 'rice', alias: 'ing-rice', label: 'Rice', color: 0xf0e6c8 },
    { key: 'ghee', alias: 'ing-ghee', label: 'Ghee', color: 0xffcd4b },
];

/** Round 17: one dish a level cooks — see the file header. */
export interface RecipeRecord {
    id: string;
    name: string;
    /** Keys into INGREDIENT_CATALOG. */
    ingredients: string[];
    /** Manifest alias of the finished-dish sprite (may not exist yet — see
     *  INGREDIENT_CATALOG's comment on the same fallback for ingredients). */
    finalDish: string;
}

// Declared once, referenced by every level that cooks them, so N0 L1/L3/L4
// (chai) and N0 L2/L3/L4 (coffee) can never quietly drift into three
// different ingredient lists for what LevelEconomy.md §11.2 costed as one.
//
// ⚠️ Coffee's third ingredient (cream) is a judgment call, not a source
// document's — RecipeList.md §7.0 fixes the two FTUE dishes but never lists
// coffee's cells (only node 1+ dishes get a Primary/Oil/Secondary row).
// §11.2 fixes `ingredients: 3` for N0 L2, so coffee-extract + milk + cream
// were chosen because all three have real pack sprites (Ingredient/26, 07,
// 08) even though none are wired into manifest.ts yet. Sugar would read
// truer to filter coffee but has no sprite at all. Flag if this reads
// wrong; do not silently change it.
const CHAI_RECIPE: RecipeRecord = {
    id: 'chai',
    name: 'Masala Chai',
    ingredients: ['milk', 'ginger', 'tea-leaf'],
    finalDish: 'dish-chai',
};
const COFFEE_RECIPE: RecipeRecord = {
    id: 'coffee',
    name: 'Coffee',
    ingredients: ['coffee-extract', 'milk', 'cream'],
    finalDish: 'dish-coffee',
};
// ✅ Faithful to RecipeList.md §7.1's row (Primary Rice, Oil Ghee,
// Secondary —): jeera (cumin) is implied by the dish name, not a spawn
// cell, and adding it as a third ingredient would invalidate §11.2's
// committed 312/303/259 (fixed at `ingredients: 2`). Do not add cumin.
const JEERA_RICE_RECIPE: RecipeRecord = {
    id: 'jeera-rice',
    name: 'Jeera Rice',
    ingredients: ['rice', 'ghee'],
    finalDish: 'dish-jeera-rice',
};

export interface LevelRecord {
    id: string;
    /** 0-based. */
    node: number;
    /** 1-based within its node. */
    index: number;
    /** ⬜ Placeholder — the dish name. The 34-level naming pass
     *  (LevelEconomy.md §10.5) hasn't happened. */
    name: string;
    /** Recipe keys spawned this level (RecipeList.md §7.0/§7.1). */
    dishes: string[];
    /** Round 17: what this level actually cooks — live (sim/kitchen.ts
     *  derives its ingredient bag and completion check from this), not
     *  just a data mirror of `dishes` above. See the file header. */
    recipes: RecipeRecord[];
    /** Completions to clear. null = endless — boss levels only (§7.3b),
     *  which end on the walkout budget instead. */
    target: number | null;
    /** Ingredients per dish — the input to §7.3a.4's F formula. null where
     *  that formula doesn't apply (a boss uses §7.3b's formula instead). */
    ingredients: number | null;
    walkoutsAllowed: number;
    startingFloat: number;
    /** Star thresholds on coinsEarned (§7.3a.4). null on a boss — it awards
     *  no stars at all, ever (§7.3b: it never "clears", so no threshold
     *  could apply). */
    stars: { three: number; two: number } | null;
    /** Prop families placeable this level (§11.1 / §7.0). */
    props: string[];
    /** A loaner prop pre-placed at launch, locked to its slot and unsellable
     *  (§7.2a). null on all five of these levels — only Naan (node 1 level
     *  4, out of this round's scope) pre-places one. */
    prePlaced: { slotIndex: number; propId: string } | null;
    /** Prop families unlocked on clear (§7.0/§11.1). */
    grants: string[];
    /** A boss level: no star thresholds (`stars` is null), and it ends on
     *  the walkout budget rather than a dish target (`target` is null). */
    isBoss: boolean;
}

export const LEVELS: LevelRecord[] = [
    {
        id: 'n0l1',
        node: 0,
        index: 1,
        name: 'First Pour',
        dishes: ['chai'],
        recipes: [CHAI_RECIPE],
        target: 12,
        ingredients: 3,
        walkoutsAllowed: 5,
        startingFloat: 100,
        // ⚠️ Kept at the shipped 340, not the formula's 339 (§11.2) —
        // correcting a live tuned number to match a formula it already
        // agrees with buys nothing, and the one-coin gap can't move a band.
        stars: { three: 340, two: 295 },
        props: ['water-dispenser', 'kettle'],
        prePlaced: null,
        grants: [],
        isBoss: false,
    },
    {
        id: 'n0l2',
        node: 0,
        index: 2,
        name: 'Second Order',
        dishes: ['coffee'],
        recipes: [COFFEE_RECIPE],
        target: 14,
        ingredients: 3,
        walkoutsAllowed: 5,
        startingFloat: 100,
        stars: { three: 397, two: 353 },
        props: ['water-dispenser', 'kettle', 'beverage-dispenser'],
        prePlaced: null,
        grants: [],
        isBoss: false,
    },
    {
        id: 'n0l3',
        node: 0,
        index: 3,
        name: 'Two Tickets',
        dishes: ['chai', 'coffee'],
        // Round 24: declaration order here no longer decides a
        // shared-ingredient tie (milk, between chai and coffee) — that
        // used to make chai win every time, starving coffee outright.
        // sim/kitchen.ts's completion walk now rotates its start index off
        // whichever recipe last completed, so this array's order is
        // presentational only (billboard/dish-tray row order), not a
        // priority list.
        recipes: [CHAI_RECIPE, COFFEE_RECIPE],
        target: 16,
        ingredients: 3,
        walkoutsAllowed: 5,
        startingFloat: 100,
        stars: { three: 455, two: 411 },
        props: ['water-dispenser', 'kettle', 'beverage-dispenser'],
        prePlaced: null,
        grants: [],
        isBoss: false,
    },
    {
        id: 'n0l4',
        node: 0,
        index: 4,
        name: 'Morning Rush',
        dishes: ['chai', 'coffee'],
        recipes: [CHAI_RECIPE, COFFEE_RECIPE],
        target: null,
        ingredients: null,
        walkoutsAllowed: 5,
        startingFloat: 100,
        stars: null,
        props: ['water-dispenser', 'kettle', 'beverage-dispenser', 'brazier', 'tandoor'],
        prePlaced: null,
        grants: ['brazier', 'tandoor'],
        isBoss: true,
    },
    {
        id: 'n1l1',
        node: 1,
        index: 1,
        name: 'Open the Dhaba',
        dishes: ['jeera-rice'],
        recipes: [JEERA_RICE_RECIPE],
        target: 12,
        ingredients: 2,
        walkoutsAllowed: 5,
        startingFloat: 100,
        stars: { three: 303, two: 259 },
        props: ['rice-cooker'],
        prePlaced: null,
        grants: [],
        isBoss: false,
    },
];

const BY_ID = new Map(LEVELS.map((l) => [l.id, l]));

/** Round 23: where a fresh session starts — no longer "the level" (that was
 *  `ACTIVE_LEVEL_ID`, read once at module scope by the now-deleted
 *  `getActiveLevel()`). TestBelt.tsx holds the current level in React state,
 *  seeded from this constant. */
export const FIRST_LEVEL_ID = 'n0l1';

/** Round 23: the level with this id, or undefined if none matches. */
export function getLevelById(id: string): LevelRecord | undefined {
    return BY_ID.get(id);
}

/** Round 23: the entry after `id` in `LEVELS` order, or null past the last
 *  one — the linear-advance rule task 5's Next Level button drives off. */
export function getNextLevelId(id: string): string | null {
    const idx = LEVELS.findIndex((l) => l.id === id);
    if (idx < 0 || idx >= LEVELS.length - 1) return null;
    return LEVELS[idx + 1].id;
}

/**
 * Round 17, task 2 (Round 23: takes the level as a parameter instead of
 * reading a frozen module-scope global): the union of every ingredient
 * across a level's recipes — the ONE place this union is computed, so
 * sim/kitchen.ts's bag and kitchenScene.ts's billboard/asset-preload can
 * never disagree about what belongs to a level (same anti-drift reason
 * sim/kitchen.ts's SLOT_ZONES is computed once and only traced elsewhere).
 * Order follows INGREDIENT_CATALOG, not recipe-declaration order —
 * irrelevant to the bag (Fisher-Yates shuffles it anyway) and to the
 * billboard (each row draws its own recipe's ingredients in that recipe's
 * own order, not this list's).
 */
export function getIngredientKinds(level: LevelRecord): IngredientKind[] {
    const keys = new Set(level.recipes.flatMap((r) => r.ingredients));
    return INGREDIENT_CATALOG.filter((k) => keys.has(k.key));
}
