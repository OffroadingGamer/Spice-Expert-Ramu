/**
 * TEST MODE ONLY — grey-box geometry for the belt-length experiment
 * (build-order item 4, sim/kitchen.ts). Isolated from the live board on
 * purpose: never read CONFIG.path/CONFIG.pads from here, and this file is
 * never imported by the tower-defence code.
 *
 * Design units, 720 x 1280 — rendered via kitchenStage.ts's contain-fit
 * (NOT stage.ts's width-fit: the live board's variable-height layout doesn't
 * apply here, this composition is a fixed 720x1280 whole).
 *
 * 🔒 VALIDATED ON DEVICE (KitchenMode.md §6.6, 2026-09-07) — do not change
 * beltPath, beltSpeed, spawnInterval, slotReach, or the beltRun1/beltRun2/
 * finalDishArea bands (renamed from propTray in round 3; geometry untouched).
 * The belt reads as runway; that verdict is measured against these exact
 * numbers.
 */
export const KITCHEN_CONFIG = {
    boardWidth: 720,
    boardHeight: 1280,

    /** Bands, top to bottom, summing to boardHeight. beltRun1/beltRun2/
     *  finalDishArea are the validated geometry above — unchanged, renamed
     *  only (propTray -> finalDishArea: round 3 repurposes it, see below).
     *  The billboard absorbs the old separate HUD band; stationRow keeps
     *  its y/height but holds a 2x2 grid instead of one row of four (see
     *  `slots`). */
    bands: {
        billboard: { y: 0, height: 400 },
        beltRun1: { y: 400, height: 140 },
        stationRow: { y: 540, height: 320 },
        beltRun2: { y: 860, height: 140 },
        /**
         * Round 3: this is the final-dish area (finished dish sprites), not
         * a prop tray. Split so the hamburger — a DOM button in CSS pixels,
         * conversion drifts with device — never overlaps the dishes: y
         * 1000-1160 for dish sprites, y 1160-1280 reserved empty for the
         * hamburger (h-11/44px + 0.5rem margin is ~90 design units at the
         * 476x743 test viewport, ~118 on a 320-wide phone; 120 covers both).
         */
        finalDishArea: { y: 1000, height: 280 },
        finalDishContent: { y: 1000, height: 160 },
        hamburgerReserve: { y: 1160, height: 120 },
    },

    /**
     * The billboard (ui-billboard, 512x512 native, drawn stretched to
     * 640x400 — line art, accepted distortion) is the entire HUD: an upper
     * panel (ui-hotbar) for the walkouts counter, a gap for the billboard's
     * own posts/frame art, and a lower panel (ui-container) for the recipe.
     * Both panels 9-sliced, never uniform-scaled — flat wooden panels with
     * a ~40px unscaled border.
     */
    billboard: {
        sprite: { x: 40, y: 0, w: 640, h: 400 },
        /** Shared x/width for both inner panels (94.9% of the 640 sprite). */
        panelInner: { x: 57, width: 607 },
        upperPanel: { y: 20, height: 80 },
        // y 100-132 is the posts/gap: the billboard art itself, no content.
        lowerPanel: { y: 132, height: 248 },
        nineSliceBorder: 40,
        /**
         * Ingredient row layout (Specs.md §8b's formula, numbers re-derived
         * against this lower panel's own inner width):
         *   slot = (innerWidth - (n-1)*plusWidth - pad) / n
         * n=5 -> slot ~86, comfortably above the 5-ingredient working target.
         *
         * Round 3: tiles anchor bottom-center (0.5, 1) and grow upward from
         * `rowInset` above the panel's bottom edge — the same 40 units the
         * recipe name insets from the top, so the two gaps read as equal.
         */
        ingredientRow: { innerWidth: 559, plusWidth: 28, pad: 16, rowInset: 40 },
    },

    /**
     * Serpentine belt: IN -> run 1 (L->R) -> drop -> run 2 (R->L) -> PASS.
     * Segment lengths noted alongside; total 1600 design units.
     */
    beltPath: [
        { x: 75, y: 470 },   // IN
        { x: 645, y: 470 },  // run 1   570
        { x: 645, y: 930 },  // drop    460
        { x: 75, y: 930 },   // run 2   570  -> PASS
    ],

    /**
     * Station slots, 2 rows x 2 columns (was one row of four). Row centres
     * y 615/785, column centres x 240/480. Each row sits 145 units from its
     * OWN belt run and 315 from the other — with slotReach unchanged at
     * 260, the top row (y615) only reaches run 1 and the bottom row (y785)
     * only reaches run 2. That's intended: a dish crosses run 1 past both
     * top slots, then run 2 past both bottom slots, so it still meets all
     * four. Raising slotReach to restore both-runs-from-either-row is
     * exactly the thing NOT to do (see the file header).
     */
    slots: [
        { x: 240, y: 615 },
        { x: 480, y: 615 },
        { x: 240, y: 785 },
        { x: 480, y: 785 },
    ],
    slotBox: { w: 139, h: 150 },

    /**
     * Round 3: which prop each of the 4 slots (in `slots` order) shows,
     * assigned round-robin by index (i % levelProps.length) — a level-design
     * choice, not a global catalogue. Multiple slots may share a prop type;
     * nothing here is unique per slot. Drawn on top of the ui-slot-empty/
     * ui-slot-filled background, centre-anchored, at all times (the prop
     * identifies the station; empty/filled is the separate occupancy read).
     */
    levelProps: ['prop-kettle-l1', 'prop-water-dispenser-l1'],
    propSize: { w: 84, h: 90 },

    /** How far a slot reaches to tap a passing dish. VALIDATED — do not
     *  raise; narrow the station band instead if it ever reads as generous. */
    slotReach: 260,

    dishSize: { w: 106, h: 70 },

    /**
     * Round 3: the belt's ingredient test set. Bag-shuffled in sim/kitchen.ts
     * (Fisher-Yates over one full set, dealt out, reshuffled only when empty)
     * so every kind spawns exactly once per lap — longest possible drought is
     * 2n-2 spawns, an immediate repeat can only happen across a bag boundary.
     * `alias` is manifest-listed art if it exists (ing-milk, ing-ginger);
     * otherwise kitchenScene.ts draws a flat procedural tile keyed by the
     * same string (§2.6's pattern, replicated locally — not an import of
     * textures.ts, see kitchenScene.ts's file header on isolation).
     */
    ingredientKinds: [
        { key: 'tea-leaf', alias: 'ing-tea-leaf', label: 'Tea Leaf', color: 0x3a5f3a },
        { key: 'milk', alias: 'ing-milk', label: 'Milk', color: 0xe8e2d0 },
        { key: 'sugar', alias: 'ing-sugar', label: 'Sugar', color: 0xf1f1e8 },
        { key: 'ginger', alias: 'ing-ginger', label: 'Ginger', color: 0xd9a441 },
        { key: 'chai-masala', alias: 'ing-chai-masala', label: 'Chai Masala', color: 0x8a5a33 },
    ],

    /**
     * Round 3: finished-dish sprites for the final-dish area (bands.
     * finalDishContent), served dishes shown round-robin. Native 212x141,
     * drawn at dishSize (106x70) — same footprint as belt ingredients.
     */
    finalDishes: ['dish-chai', 'dish-coffee'],

    /** Design-unit travel speed along the belt. VALIDATED (§6.6: runway). */
    beltSpeed: 100,

    /** Seconds between dish spawns. VALIDATED. */
    spawnInterval: 2.2,

    /** Total dishes in one test session (a WIN once they're all resolved). */
    shiftDishCount: 20,

    /** Walkouts (unserved dishes reaching PASS) allowed before a LOSS.
     *  Not 10 — the belt sim carries its own count, per KitchenMode §2.7. */
    walkoutsAllowed: 5,

    /**
     * Display-only placeholder recipe for the billboard's lower panel.
     * sim/kitchen.ts models no recipe steps or cook time (single-tap serve,
     * per KitchenMode §6.6) — this is grey-box dressing for the layout test,
     * not gameplay data. Round 3: aligned to the belt's actual ingredient
     * test set (was a placeholder list including "cardamom", never carried
     * by the belt) so the billboard row and the belt agree.
     */
    recipe: {
        name: 'Masala Chai',
        ingredients: ['tea-leaf', 'milk', 'sugar', 'ginger', 'chai-masala'],
    },
} as const;
