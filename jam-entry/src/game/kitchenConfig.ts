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
 * spawnInterval, slotReach, or the beltRun1/beltRun2/finalDishArea bands
 * (renamed from propTray in round 3; geometry untouched). The belt reads as
 * runway; that verdict is measured against these exact band numbers.
 *
 * Round 4: beltPath grew two segments (fridge in/out) and beltSpeed moved
 * 100 -> 111 to hold the *traverse time* constant at 16.0s — the number
 * that's actually validated, not the raw speed constant. See beltPath below
 * before touching either one.
 *
 * Round 5: chai only (finalDishes down to one entry, no round-robin left to
 * do), the fridge box corrected to a true 2.25x scale of its native art (was
 * squashed in round 4) which re-lengthens the fridge connector stubs and
 * moves beltSpeed to 122 — same 16.0s traverse, recomputed for the new
 * 1952-unit path (was 1780). Station slots start empty and are filled by a
 * tap-to-place picker instead of a fixed round-robin assignment.
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
         * Round 4, task 5: ONE constant for both the recipe name's top inset
         * and the ingredient row's bottom inset, so the round-3 "gaps read
         * equal" claim holds by construction, not by two separately-typed
         * 40s drifting apart later. Used at kitchenScene.ts's recipeNameText
         * position AND the ingredient row's baseline.
         */
        contentInset: 40,

        /** Round 5, task 6: recipe name reads as the panel's heading now.
         *  Position/alignment (centred, contentInset from the panel top)
         *  unchanged — only the size grew. */
        recipeNameSize: 32,

        /**
         * Ingredient row layout (Specs.md §8b's formula, numbers re-derived
         * against this lower panel's own inner width):
         *   slot = (innerWidth - (n-1)*plusWidth - pad) / n
         * n=5 -> slot ~86, comfortably above the 5-ingredient working target.
         *
         * Round 3: tiles anchor bottom-center (0.5, 1) and grow upward from
         * `contentInset` above the panel's bottom edge (the row's baseline).
         * Round 4, task 4: the tile is now [sprite above][name below] instead
         * of a flat color+2-letter tile — sprite real where manifest art
         * exists (ing-milk, ing-ginger), else the round-3 procedural
         * fallback; name text sized down to fit `slotSize`, never clipped
         * (checked against "Chai Masala", the longest label at n=5).
         */
        ingredientRow: { innerWidth: 559, plusWidth: 28, pad: 16, labelHeight: 16, labelGap: 4 },
    },

    /**
     * Round 4: fridge anchoring both ends. OUT of the fridge -> run 1
     * (L->R) -> drop -> run 2 (R->L) -> INTO the fridge. Runs stay at
     * x=75 — the x validated in §6.6.
     *
     * Round 5, task 2: the fridge box grew from 140x280 to its correct
     * 2.25x-native size (72x108 — see `fridge` below), so the connector
     * stubs at each end lengthen from 90 to 176 units to cover the space the
     * old oversized box used to fill. Total 1952 design units (was 1780).
     *
     * 🛑 Both this path and beltSpeed below are load-bearing together, not
     * separately. beltSpeed=122 holds the traverse time at 1952/122=16.0s,
     * identical to the validated run — it is not a tuning choice. If the
     * path changes for any reason, recompute the speed from
     * BELT_LENGTH / 16.0 and say so; do not move the runs off x=75.
     */
    beltPath: [
        { x: 75, y: 646 },   // OUT of the fridge     176
        { x: 75, y: 470 },
        { x: 645, y: 470 },  // run 1                 570
        { x: 645, y: 930 },  // drop                  460
        { x: 75, y: 930 },   // run 2                 570
        { x: 75, y: 754 },   // INTO the fridge       176
    ],                       //                total 1952

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
     * Round 3: which prop each of the 4 slots (in `slots` order) can show —
     * a level-design catalogue, not a per-slot assignment.
     *
     * Round 4, task 2: `name` and `level` are separate fields so the label
     * format ("Name… - Level N") lives in one place (kitchenScene.ts's
     * formatPropLabel) — the level suffix is measured first and never
     * truncates; the name gets whatever width remains and may ellipsis.
     *
     * Round 5, task 3: no longer auto-assigned round-robin at scene start.
     * All 4 slots begin empty; tapping an empty slot opens a picker over
     * this list (PropPicker.tsx) and the chosen entry is placed there.
     */
    levelProps: [
        { alias: 'prop-kettle-l1', name: 'Kettle', level: 1 },
        { alias: 'prop-water-dispenser-l1', name: 'Water Dispenser', level: 1 },
    ],
    propSize: { w: 84, h: 90 },
    /**
     * Round 5, tasks 4-5: reverses round 4's top-anchored icon/label stack —
     * icon centre-centre in the slotBox (aspect-fit within propSize,
     * unchanged), label centre-bottom. `propLabelPad` design units of inner
     * padding on every side of the label keep glyphs off the slotBox's inner
     * edge (~4 CSS px at the 476x743 test viewport); the name truncates
     * harder before the padding ever gives, per the handover.
     */
    propLabelPad: 8,

    /**
     * Round 4, task 3: placeholder fridge anchoring both belt ends — see
     * beltPath above. Drawn ABOVE the belt in z-order, so the belt visibly
     * runs into and out of it.
     *
     * Round 5, task 2: corrected to a true 2.25x scale of the native 32x48
     * sprite (was stretched to a squashed 140x280 in round 4). 72x108 keeps
     * the 0.667 native aspect exactly, and 72 wide matches
     * CONFIG.sizes.pathWidth, so the belt runs into the fridge rather than
     * protruding past it. Still centred on x=75.
     *
     * 🛑 Knowing, temporary exception to PropSpriteIndex.md §5, not a
     * reversal of it: prop-fridge (kp1/087.png, 32x48 isometric pixel art)
     * beside painterly Essentials art will look wrong, exactly as §5
     * predicts — the aspect fix above only removes the *extra* distortion
     * from squashing, not the base tonal mismatch. Not licence to use
     * Kitchen Props sprites anywhere else on the line.
     */
    fridge: { x: 39, y: 646, w: 72, h: 108 },

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
     * finalDishContent). Native 212x141, drawn at dishSize (106x70) — same
     * footprint as belt ingredients. Served dishes shown round-robin by
     * servedCount parity (the sim has no recipe-outcome concept; this is
     * grey-box dressing, same as billboard.recipe below).
     *
     * Round 4, task 1: one entry per type now, not one sprite per served
     * dish — [sprite] x[count], hidden while count is 0. `finalDishSlotX`
     * is the fixed centre-x per type, in `finalDishes` order.
     *
     * Round 5, task 1: this is FTUE level 1 — chai only. Down to one entry,
     * centred at the board's own centre (was two entries split around it).
     * Round 5, task 8: `finalDishSize` gives the single dish the room the
     * two-dish grid used to split between them — 205x136 (native 212x141
     * aspect preserved), vertically centred in finalDishContent (160 tall)
     * with ~12 units of margin top and bottom.
     */
    finalDishes: ['dish-chai'],
    finalDishSlotX: [360],
    finalDishSize: { w: 205, h: 136 },

    /** Design-unit travel speed along the belt. VALIDATED (§6.6: runway,
     *  measured at the old 1600-unit path). Round 4: 100 -> 111 to hold the
     *  traverse time at 16.0s over the 1780-unit path. Round 5: 111 -> 122
     *  to hold it again over the new 1952-unit path — see beltPath. */
    beltSpeed: 122,

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
