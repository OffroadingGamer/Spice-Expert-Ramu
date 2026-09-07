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
 * propTray bands. The belt reads as runway; that verdict is measured
 * against these exact numbers.
 */
export const KITCHEN_CONFIG = {
    boardWidth: 720,
    boardHeight: 1280,

    /** Bands, top to bottom, summing to boardHeight. beltRun1/beltRun2/
     *  propTray are the validated geometry above — unchanged. The billboard
     *  now absorbs the old separate HUD band; stationRow keeps its y/height
     *  but holds a 2x2 grid instead of one row of four (see `slots`). */
    bands: {
        billboard: { y: 0, height: 400 },
        beltRun1: { y: 400, height: 140 },
        stationRow: { y: 540, height: 320 },
        beltRun2: { y: 860, height: 140 },
        propTray: { y: 1000, height: 280 },
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
         */
        ingredientRow: { innerWidth: 559, plusWidth: 28, pad: 16 },
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

    /** How far a slot reaches to tap a passing dish. VALIDATED — do not
     *  raise; narrow the station band instead if it ever reads as generous. */
    slotReach: 260,

    dishSize: { w: 106, h: 70 },

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
     * per KitchenMode §6.6) — this is grey-box dressing for the layout
     * test, not gameplay data. No ingredient art was authorized for this
     * handover, so ingredients render as grey-box tiles (§2.6).
     */
    recipe: {
        name: 'Masala Chai',
        ingredients: ['milk', 'tea', 'sugar', 'cardamom', 'ginger'],
    },
} as const;
