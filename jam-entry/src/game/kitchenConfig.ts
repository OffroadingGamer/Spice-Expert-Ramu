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
 *
 * Round 6: prop labels measure clearance from ItemSlot1.png's inner well
 * (`slotWell`/`labelGap` below), not from the slot box's outer edge; props
 * only interact with ingredients on the belt's three working runs, never on
 * the two fridge connector stubs (kitchenScene.ts derives this from beltPath
 * at runtime, sim/kitchen.ts's `isEligibleDist`); and the chai recipe drops
 * to its real three ingredients (milk, ginger, tea-leaf) — sugar and chai
 * masala never belonged in this FTUE node (§6.3: chai masala is a grinding
 * output Node 0 has none of). beltPath/beltSpeed/spawnInterval/slotReach/
 * the fridge box/the band boundaries are untouched — round 5's 16.0s
 * traverse stands.
 *
 * Round 7: the billboard ingredient row's sprite size is now fixed at the
 * n=5 cap (`ingredientRow.capN` below) instead of §8b's shrink-to-fit
 * recomputing a larger tile whenever the actual recipe is shorter than the
 * cap — a 3-ingredient recipe is a shorter, centred row at the SAME sprite
 * size a 5-ingredient row would use, not a bigger one (kitchenScene.ts).
 * §8b's shrink-to-fit formula still applies, unchanged, for n > capN (6, the
 * documented hard maximum) so the row can never overflow. The belt also
 * gained the live game's music/SFX this round (kitchenScene.ts, TestBelt.tsx,
 * PropPicker.tsx) — src/audio/audio.ts itself is untouched, shared with the
 * live game.
 *
 * Round 8: the recipe gate (KitchenMode §6.3) — sim/kitchen.ts now tracks
 * held ingredient counts and consumes one of each on completion, instead of
 * turning any single ingredient into a served dish. The billboard recipe row
 * grows a live badge counter per ingredient (`ingredientRow` unchanged;
 * badge geometry is derived in kitchenScene.ts, not stored here). The belt
 * also gains a speed ramp keyed to completions (`beltRamp` below) — see its
 * comment and the 🛑 lock on `beltPath` for how the two stay consistent.
 * Prop labels abbreviate "Level" to "Lv" (kitchenScene.ts's
 * formatPropLabel) — independent of the recipe gate, more label room only.
 *
 * Round 9: a level is now economically complete (LevelEconomy.md is the
 * source of truth for every number below). The round ends at
 * `shiftChaiTarget` COMPLETIONS, not at a spawn count (`shiftDishCount` is
 * gone, split into `shiftChaiTarget` + the safety-cap-only `maxSpawns`).
 * Two coin accumulators exist — the spendable `wallet` and the
 * star/hat-driving `coinsEarned` — both computed in kitchenScene.ts from
 * the `coins` rates below, not stored here. Station slots start LOCKED
 * (`slotUnlockCost`) and props cost coins by tier (`propTierCost`,
 * `propSellRefund`); a placed prop is busy for `propCooldown` seconds after
 * every grab. Chef Hats (`hats` below) are awarded on any completed run;
 * stars (`starThresholds`) only on a clear. Leftover ingredients are no
 * longer merely "discarded silently, not scored" as round 8's comment on
 * `held` said (sim/kitchen.ts) — they now pay `hats.perLeftover` each, per
 * this round's Chef Hat formula. That comment is updated alongside this one
 * so the two files don't contradict each other; leftovers still convert to
 * no currency, since that system still doesn't exist.
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
         *
         * Round 7, task 1: `capN` is the recipe-length cap the sprite size is
         * fixed against — the formula above evaluated at n=capN, not at the
         * actual recipe's ingredient count, so a shorter recipe (n=3 today)
         * draws a shorter, centred row at the SAME tile size a capN-length
         * row would use, never a bigger one. §8b's own shrink-to-fit formula
         * (n in the divisor) is kept, unchanged, as the fallback for n >
         * capN — 6, §8b's documented hard maximum — so the row still can
         * never overflow. See kitchenScene.ts's ingredient-row block.
         */
        ingredientRow: { innerWidth: 559, plusWidth: 28, pad: 16, labelHeight: 16, labelGap: 4, capN: 5 },
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
     *
     * Round 8 reinterpretation: what this lock protects is the 16.0 seconds,
     * not the number 122. `beltRamp` below lets speed vary during a shift
     * without breaking the lock, because speed is still always derived from
     * a traverse target — 16.0s is now the ramp's OPENING value instead of a
     * constant. Do not quietly replace 122 with a bigger typed number; if
     * the ramp's baseTraverse ever changes, beltSpeed must be recomputed
     * from it (BELT_LENGTH / beltRamp.baseTraverse) exactly as this lock
     * always required.
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

    /** Round 9, task 5: coins to unlock a LOCKED slot. Flat, all four
     *  (LevelEconomy.md §7.1). See kitchenScene.ts for the guard that stops
     *  a second slot unlocking before any prop is placed in the first. */
    slotUnlockCost: 50,

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
     * Round 9, task 6: cost to PLACE a prop of tier N (1-indexed, from the
     * prop's existing `level` field — no new field needed). ~1.7x per step,
     * so one Level 3 (120) costs exactly three Level 1s (120) and one
     * Level 2 (70) sits just under two Level 1s (80) — PropList.md §7.1's
     * "one strong station, or two weak ones", true at the till. Node 0 ships
     * only tier-1 props (`levelProps` above) — tiers 2-5 are config for when
     * higher-tier sprites land; do not go looking for that art now.
     */
    propTierCost: [40, 70, 120, 200, 320],

    /** Refund on selling a PLACED PROP. The slot stays unlocked and is not
     *  refunded. 0.75 makes swapping an L1 for an L2 cost 80 against 70 for
     *  committing up front — a 10-coin premium for changing your mind. */
    propSellRefund: 0.75,
    /**
     * Round 5, tasks 4-5: reverses round 4's top-anchored icon/label stack —
     * icon centre-centre in the slotBox (aspect-fit within propSize,
     * unchanged), label centre-bottom.
     *
     * Round 6, task 1: ItemSlot1.png has a raised border, so the box's own
     * outer edge is NOT the containment boundary — its inner well is, well
     * inside that border. `slotWell` is that inset, measured from the
     * slotBox's edge in design units; `labelGap` is extra clear space inside
     * it. Any text drawn inside a station slot (present or future) must stay
     * clear of the well by at least `labelGap` on every side — the name
     * truncates harder before this padding ever gives (formatPropLabel,
     * below, is unchanged: the level suffix still never truncates).
     */
    slotWell: { left: 15, right: 15, top: 19, bottom: 21 },
    labelGap: 6,

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

    /**
     * Round 9, task 7: seconds a prop is busy after taking an ingredient. ON
     * USE, not on placement (LevelEconomy.md §7.3a.3).
     *
     * Why 2.0 and not 3.0. Spawn rate is 1/2.2 = 0.455 dishes/s; one prop's
     * rate is 1/N. At 3.0s one prop yields 0.333/s and falls 27% short,
     * burning ~2 of the 5 walkouts before a second station is affordable at
     * ~18s — that punishes the float, not the player. At 2.0s one prop
     * yields 0.500/s, a 10% margin: tight but survivable, two comfortable,
     * four insurance at speed.
     */
    propCooldown: 2.0,

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
     *
     * Round 6, task 3: down to the real 3-ingredient chai — sugar and chai
     * masala removed. Chai masala especially never belonged here: §6.3 lists
     * it as the output of a grinding level, and this FTUE node (Node 0) has
     * none, so it couldn't legitimately exist on this belt. Real sprites
     * exist for milk and ginger; tea-leaf stays the procedural placeholder
     * until §6.3's container art lands. At n=3 the bag's longest drought is
     * 2n-2=4 spawns (was 8 at n=5) — tighter cycle, no code change needed.
     */
    ingredientKinds: [
        { key: 'milk', alias: 'ing-milk', label: 'Milk', color: 0xe8e2d0 },
        { key: 'ginger', alias: 'ing-ginger', label: 'Ginger', color: 0xd9a441 },
        { key: 'tea-leaf', alias: 'ing-tea-leaf', label: 'Tea Leaf', color: 0x3a5f3a },
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

    /**
     * Round 8: the belt accelerates as the player completes dishes. Expressed
     * as TRAVERSE SECONDS, not u/s, so the 🛑 lock above still holds — speed is
     * always BELT_LENGTH / target, never a typed constant.
     *
     * Linear in traverse, deliberately: a linear *speed* increase would give a
     * decelerating loss of reaction time, so the ramp would feel strong early
     * and fade. Linear in traverse costs the player the same half-second of
     * thinking time per cup.
     *
     *  chai   0     1     2     3     4     5     6     7
     *  trav  16.0  15.5  15.0  14.5  14.0  13.5  13.0  12.5   seconds
     *  speed  122   126   130   135   139   145   150   156   u/s
     *  window 3.54  3.43  3.32  3.21  3.10  2.99  2.88  2.76  s in one slot's reach
     *
     * ⬜ UNSETTLED — the user is reviewing this curve after playing round 8 and
     * will retune it. Keep all three numbers here, in seconds, so a retune is a
     * one-number edit. Do not inline them.
     *
     * 🔒 Round 9: this ramp needs no change at a 12-dish target — it and
     * `shiftChaiTarget` below are exactly matched, 16.0 − 0.5 × 12 = 10.0,
     * so the belt reaches `minTraverse` precisely on the final dish. Full
     * range used, no plateau. A level that changes its dish target must
     * re-derive `perCompletion` (LevelEconomy.md §7.5), or the ramp either
     * plateaus early (target > 12) or never reaches its floor (target < 12).
     */
    beltRamp: {
        baseTraverse: 16.0,
        perCompletion: 0.5,
        minTraverse: 10.0,
    },

    /** Design-unit travel speed along the belt. VALIDATED (§6.6: runway,
     *  measured at the old 1600-unit path). Round 4: 100 -> 111 to hold the
     *  traverse time at 16.0s over the 1780-unit path. Round 5: 111 -> 122
     *  to hold it again over the new 1952-unit path — see beltPath.
     *
     *  Round 8: this is now the OPENING value only — sim/kitchen.ts derives
     *  the live speed from `beltRamp` above every tick. Must equal
     *  BELT_LENGTH / beltRamp.baseTraverse = 1952 / 16.0 = 122; a dev-time
     *  check in sim/kitchen.ts asserts this on load. */
    beltSpeed: 122,

    /** Seconds between dish spawns. VALIDATED. */
    spawnInterval: 2.2,

    /** Round 9: the win condition. The round ends when this many dishes are
     *  COMPLETED. Spawning runs open-ended until then. LevelEconomy.md §2. */
    shiftChaiTarget: 12,

    /** Safety cap only — a runaway spawn loop must not hang the tab. A clean
     *  run needs 36 spawns; a bad one ~48. 200 is unreachable in play. */
    maxSpawns: 200,

    /** Walkouts (unserved dishes reaching PASS) allowed before a LOSS.
     *  Not 10 — the belt sim carries its own count, per KitchenMode §2.7. */
    walkoutsAllowed: 5,

    /**
     * Round 9, task 3: the coin wallet's per-event rates (LevelEconomy.md
     * §7.1/§7.3a.2). `wallet` (spendable) and `coinsEarned` (the round's
     * score, excludes `startingFloat` and ignores spending) are two separate
     * accumulators computed in kitchenScene.ts from these rates — kept
     * separate because they answer different questions.
     *
     * 🔒 The 100 floor, and when it lifts. While zero props are EVER placed,
     * wallet is floored at `startingFloat`. The moment the first prop is
     * placed the floor drops to 0, permanently, even if that prop is later
     * sold. Dishes walk out whether or not the player has placed anything,
     * so walkouts can accrue before the first prop exists — during the
     * opening seconds, or while someone reads the picker. With no prop there
     * is no way to grab, therefore no way to earn back what those walkouts
     * take. Unfloored, a slow start could drop the wallet under the 90
     * needed to open a station and leave the round unwinnable with no way to
     * report why — Retro.md item 53's exact failure. Once one prop is down,
     * income exists and the charge is fair.
     */
    coins: {
        startingFloat: 100, // a grant, never counted as earned
        perGrab: 3,
        perDish: 20,
        walkoutCharge: 25, // same 25 the Chef Hat uses — one number, both currencies
    },

    /** Round 9: star bands, on `coinsEarned` (LevelEconomy.md §7.3a.2) — not
     *  a currency, but only meaningful next to `coins` above, so it lives
     *  here rather than beside the unrelated Chef Hat formula. ⭐ needs only
     *  a clear, no threshold. */
    starThresholds: { three: 340, two: 300 },

    /**
     * Round 9, task 9: the Chef Hat formula (LevelEconomy.md §7.3), awarded
     * on any completed run (win OR loss). `perDish` and `perWalkoutAvoided`
     * intentionally mirror `coins.perDish`/`coins.walkoutCharge` — the same
     * two numbers score both currencies, not a coincidence.
     *
     * ⚠️ Round 8's comment on `held` (sim/kitchen.ts) called leftovers
     * "discarded silently, not scored" — that was about currency conversion,
     * which still doesn't exist. `perLeftover` below is the additive hats
     * bonus originally asked for and supersedes that note; it does not
     * reintroduce a currency.
     */
    hats: {
        perDish: 20,
        perLeftover: 2,
        perWalkoutAvoided: 25,
        clearBonus: 100,
    },

    /**
     * Display-only placeholder recipe for the billboard's lower panel.
     * sim/kitchen.ts models no recipe steps or cook time (single-tap serve,
     * per KitchenMode §6.6) — this is grey-box dressing for the layout test,
     * not gameplay data. Round 3: aligned to the belt's actual ingredient
     * test set (was a placeholder list including "cardamom", never carried
     * by the belt) so the billboard row and the belt agree.
     *
     * Round 6, task 3: matches the belt's corrected 3-ingredient set. §8b at
     * n=3 gives slot ~162 -> scale 1.00 (comfortably above the formula's
     * n=5 "working target" row) — the row draws at full size, no shrink.
     */
    recipe: {
        name: 'Masala Chai',
        ingredients: ['milk', 'ginger', 'tea-leaf'],
    },
} as const;
