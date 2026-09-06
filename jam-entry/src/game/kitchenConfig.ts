/**
 * TEST MODE ONLY — grey-box geometry for the belt-length experiment
 * (build-order item 4, sim/kitchen.ts). Isolated from the live board on
 * purpose: never read CONFIG.path/CONFIG.pads from here, and this file is
 * never imported by the tower-defence code.
 *
 * Design units, 720 x 1280 (see stage.ts — same design-resolution system the
 * live board uses, so what's tested here scales the same way on device).
 */
export const KITCHEN_CONFIG = {
    boardWidth: 720,
    boardHeight: 1280,

    /** Bands, top to bottom, summing to boardHeight. Layout reference only —
     *  the scene draws them as flat tint rectangles, nothing more. */
    bands: {
        hud: { y: 0, height: 100 },
        billboard: { y: 100, height: 300, innerWidth: 520 },
        beltRun1: { y: 400, height: 140 },
        stationRow: { y: 540, height: 320 },
        beltRun2: { y: 860, height: 140 },
        propTray: { y: 1000, height: 280 },
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

    /** Four station slots, each 230 units from both run centrelines — one
     *  row serves the belt twice, which is why the path is serpentine. */
    slots: [
        { x: 150, y: 700 },
        { x: 290, y: 700 },
        { x: 430, y: 700 },
        { x: 570, y: 700 },
    ],

    /** How far a slot reaches to tap a passing dish (230-unit offset + a
     *  forgiving margin). Narrow the station band, not this, if 230 reads
     *  as too generous on device. */
    slotReach: 260,

    dishSize: { w: 106, h: 70 },

    /** Design-unit travel speed along the belt. This number is the actual
     *  variable under test — tune it here and redeploy to compare "runway"
     *  vs "waiting" on device without touching the sim. */
    beltSpeed: 100,

    /** Seconds between dish spawns. */
    spawnInterval: 2.2,

    /** Total dishes in one test session (a WIN once they're all resolved). */
    shiftDishCount: 20,

    /** Walkouts (unserved dishes reaching PASS) allowed before a LOSS.
     *  Not 10 — the belt sim carries its own count, per KitchenMode §2.7. */
    walkoutsAllowed: 5,
} as const;
