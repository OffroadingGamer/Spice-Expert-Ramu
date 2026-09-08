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
 * This is a container, not a mechanic: `dishes`, `ingredients`, `props`,
 * `prePlaced` and `grants` are recorded for completeness and for the FTUE
 * round to build on, but nothing reads them yet. Only `target`,
 * `walkoutsAllowed`, `startingFloat` and `stars` are live this round — see
 * `getActiveLevel()` call sites in sim/kitchen.ts and kitchenScene.ts.
 * kitchenConfig.ts's `recipe`/`ingredientKinds`/`levelProps` are untouched,
 * so every level still runs the same Masala Chai belt regardless of which
 * one is active — switching the active level changes pacing and scoring
 * numbers only, not the actual dishes on screen. Real per-level content is
 * the FTUE round's job.
 */

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

/** The single hard-coded selection point — level-select is out of scope this
 *  round (handover: "hard-code the active level to N0 L1 so the build stays
 *  byte-identical in behaviour"). Change this and only this to test a
 *  different level; it is not read by anything except getActiveLevel(). */
export const ACTIVE_LEVEL_ID = 'n0l1';

export function getActiveLevel(): LevelRecord {
    const level = BY_ID.get(ACTIVE_LEVEL_ID);
    if (!level) {
        throw new Error(`levels.ts: ACTIVE_LEVEL_ID '${ACTIVE_LEVEL_ID}' has no matching LevelRecord.`);
    }
    return level;
}
