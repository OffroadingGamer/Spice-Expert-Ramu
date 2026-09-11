/**
 * ============================== TUNING HUB ==============================
 * Every gameplay number lives in exactly four files, all data, no logic:
 *
 *   src/game/config.ts        <- YOU ARE HERE: board layout, economy
 *                                (incl. the sell refund), lives, sizes
 *   src/game/data/towers.ts   <- tower stats, costs, upgrade tracks,
 *                                default targeting (modes: data/targeting.ts)
 *   src/game/data/enemies.ts  <- bug hp/speed/bounty
 *   src/game/data/waves.ts    <- what attacks, wave by wave
 *
 * Numbers are in design units (720-wide stage, see stage.ts) and seconds.
 * All four files feed the pure simulation engine (src/game/sim/engine.ts),
 * which also powers `npm run balance` — run it after ANY tuning change to
 * verify the game is still winnable but not trivial, without playtesting.
 * ========================================================================
 */
/**
 * Round H Task 3: pad 0's bonus stat was the only 'damage' bonus in the
 * roster, so setting it to null would otherwise let `as const` narrow every
 * pad's bonus union down to 'range' | 'fireRate' — silently breaking the
 * `stat === 'damage'` checks in sim/engine.ts and BuildSheet.tsx even though
 * they never changed. Typed explicitly here so 'damage' stays a valid pad
 * bonus stat regardless of which pad literal currently uses it.
 */
type PadBonus = { stat: 'damage' | 'range' | 'fireRate'; mult: number } | null;
interface Pad {
    x: number;
    y: number;
    bonus: PadBonus;
}

/**
 * Round I Task 7: the level-design schematics (docs/LevelBlocks.md §5b, §9)
 * replace Round H's 8 pads with 10, laid out in 4 rows — A (2, single-leg
 * coverage), B (3, between the top and middle horizontal legs), C (3,
 * mirroring B between the middle and bottom legs), D (2, single-leg
 * coverage) — array order A1 A2 B1 B2 B3 C1 C2 C3 D1 D2, so `pads[i]`
 * matches every doc reference by index (old pad 2 is now B2, index 3).
 * Coordinates were hand-solved then verified by scripts/simulate.ts's
 * assertPadGeometry(): every pad clears every OTHER pad and every belt
 * segment by pad half-width (48) + path half-width (36) = 84 units, with a
 * comfortable margin (16-56 units) on all ten — see the balance report for
 * the assertion's printed output.
 */
const PADS: Pad[] = [
    { x: 270, y: 195, bonus: null }, // A1
    { x: 430, y: 195, bonus: null }, // A2
    { x: 205, y: 485, bonus: { stat: 'fireRate', mult: 1.5 } }, // B1
    { x: 325, y: 485, bonus: { stat: 'range', mult: 1.5 } }, // B2 — old pad 2
    { x: 445, y: 485, bonus: { stat: 'damage', mult: 1.5 } }, // B3
    { x: 205, y: 795, bonus: { stat: 'damage', mult: 1.5 } }, // C1
    { x: 325, y: 795, bonus: { stat: 'range', mult: 1.5 } }, // C2
    { x: 445, y: 795, bonus: { stat: 'fireRate', mult: 1.5 } }, // C3
    { x: 225, y: 1090, bonus: null }, // D1
    { x: 430, y: 1090, bonus: null }, // D2
];

export const CONFIG = {
    colors: {
        grass: 0x14141a,        // kitchen floor
        grassSpeck: 0x1e1e26,   // floor tile speck
        pathDirt: 0x3a3a44,     // the rail
        pathEdge: 0xff6b1a,     // hot pass-light edge
        pad: 0x8a8a93,          // steel counter
        padDark: 0x5e5e66,
        gold: 0xf5c542,
        goldDark: 0xc99a1e,
        goldShine: 0xffe58a,
        // towers (towers)
        fox: 0xe8823a,
        foxDark: 0xb85f22,
        belly: 0xf7e8d4,
        owl: 0x9d8ec4,
        owlDark: 0x7a6ba3,
        bear: 0x8a5a33,
        bearDark: 0x6e4626,
        eyeWhite: 0xffffff,
        eyePupil: 0x1b1b2b,
        // bugs (enemies)
        beetle: 0x3a5683,
        beetleDark: 0x283c5e,
        wasp: 0xf0c030,
        waspDark: 0x2b2b2b,
        snail: 0xc48a5a,
        snailShell: 0x8a5a8f,
        hornet: 0xe4572e,
        stag: 0x2f2545,
        // towers (new towers)
        squirrel: 0xb0713d,
        squirrelDark: 0x8a5527,
        frog: 0x5fbf4a,
        frogDark: 0x3f8f31,
        penguin: 0x2e3440,
        penguinDark: 0x1d2129,
        beak: 0xf0913a,
        salamander: 0xe25822,
        salamanderDark: 0xb03a12,
        ram: 0xd9d2c4,
        ramDark: 0xb3a98f,
        horn: 0x8a744f,
        fire: 0xff8c42,
        // projectiles + fx
        arrow: 0xffe58a,
        frost: 0xbfe8ff,
        boulder: 0x8f97a5,
        lightning: 0xffe873,
        poison: 0x7ed957,
        ice: 0xa8e4ff,
        hpBack: 0x1b1b2b,
        hpFill: 0x7bd94a,
        range: 0xffffff,
        shadow: 0x000000,
    },

    /**
     * On-screen display sizes in design units (textures draw at 2x these).
     * Round I Task 5: Round H's spread (36/32/54/48/84) is reverted — the
     * user's words, "the size shouldn't variate and uniform fit model to be
     * adopted." All five archetypes render at the same size; tankiness
     * reads from the HP bar, and archetype tier reads from the glow
     * (textures.ts's makeGlowTexture, towerScene.ts's glow render — see
     * docs/LevelBlocks.md §6a) instead of silhouette size.
     */
    sizes: {
        tower: 64,
        enemy: { beetle: 64, wasp: 64, snail: 64, hornet: 64, stag: 64 },
        pad: { w: 96, h: 52 },
        projectile: 16,
        pathWidth: 72,
    },

    /**
     * The designed board height in design units. The board is drawn for a
     * 9:16 screen (1280 units); on taller screens the whole board is
     * vertically centered in the extra space (see towerScene.ts), so the
     * PATH NEVER STRETCHES: path length, and therefore balance, is
     * identical on every device and in `npm run balance`.
     */
    boardHeight: 1280,

    /**
     * The bugs' road, as polyline waypoints. Enemies climb out of a burrow
     * at the first point and escape into one at the last; both ends get a
     * burrow decal so entering/leaving reads as intentional at any offset.
     *
     * Round I Task 7: the right leg narrows x610 -> x540 (docs/LevelBlocks.md
     * §1, §9) to make room for the build sidebar landing in round 3. New
     * length 2440 (was 2650) — see data/waves.ts's PATH_LENGTH.
     */
    path: [
        { x: 170, y: 90 },
        { x: 170, y: 330 },
        { x: 540, y: 330 },
        { x: 540, y: 640 },
        { x: 110, y: 640 },
        { x: 110, y: 950 },
        { x: 540, y: 950 },
        { x: 540, y: 1300 },
    ],

    /** Build spots — see the PADS definition above the CONFIG object. */
    pads: PADS,

    /** Tap tolerance for selecting a pad, from its center. */
    padTapRadius: 58,

    economy: {
        startCoins: 140,   // two cheap towers, or one mid + savings
        startLives: 10,
        waveBonus: 15,     // flat build-phase income per cleared wave, levels 1-10
        /**
         * Round H Task 5: levels 1-10 keep the economy above exactly as-is
         * (onboarding stays generous). From level 11 (sim/engine.ts checks
         * waveIndex >= lateEconomy.fromLevel - 1), both the flat clear bonus
         * and the per-kill bounty (enemies.ts is sealed this round, so the
         * cut is a multiplier applied where bounty is paid, not a stat
         * change) drop — bounty dominates income once wave sizes grow, so
         * that multiplier is what actually keeps coins a live constraint
         * instead of the ~25,000 idle-by-level-15 pileup this round exists
         * to fix. Tuned alongside the levels 1-80 threat curve
         * (data/waves.ts) — see the balance report's coin-curve column.
         */
        lateEconomy: {
            fromLevel: 11,
            waveBonus: 6,
            bountyMult: 0.55,
        },
        /**
         * Fraction of a tower's TOTAL spend (purchase plus upgrades bought)
         * refunded on sell: at 0.75, a tower that cost 200 in total sells
         * for 150. Refunds round down. 1 would make repositioning free;
         * low values make placement a commitment.
         */
        sellRefund: 0.75,
        /**
         * Round I Task 9: the coin sink. 10 slots x 3 tower levels caps
         * total possible board spend at a few thousand coins against a
         * player holding tens of thousands by the endgame (docs/
         * LevelBlocks.md §12) — "a ceiling cannot be fixed by a rate."
         * Kitchen Actions are consumables instead: bought in the build
         * phase, applied to the wave about to start, gone after. Base
         * prices scale with level via sim/engine.ts's kitchenActionCost()
         * (cost = round(base * threat(level) / threat(10))), so a purchase
         * costs a comparable share of income at level 20 and at level 80.
         */
        kitchenActions: {
            freezeBase: 60,
            heatBase: 90,
            slowBase: 45,
        },
    },

    /**
     * Meta progression: gems earned at the end of every run buy PERSISTENT
     * per-tower upgrades from the main menu (damage, attack speed, range;
     * ten levels each). These multiply on top of in-run upgrades.
     *
     * NOTE: `npm run balance` simulates with ZERO meta levels on purpose —
     * it verifies the base game a brand-new player faces.
     */
    meta: {
        /** Gems for clearing wave N = N * this (a full 10-wave run pays 40). */
        gemsPerWave: 4,
        maxLevel: 10,
        /** Buying INTO level n (1-based) costs costBase + costStep * (n - 1). */
        costBase: 4,
        costStep: 2,
        /** Effect per level, as a fraction added to the base stat. */
        damagePerLevel: 0.05,  // +50% damage at level 10
        speedPerLevel: 0.04,   // +40% attack speed at level 10
        rangePerLevel: 0.02,   // +20% range at level 10
    },

    /** Rewarded ads (systems/ads.ts, copied in from run-game-helpers). */
    ads: {
        /** Game-wide daily rewarded-watch budget shared by every placement. */
        maxPerDay: 15,
        /** Game-over placement: bonus gems = ceil(gemsEarned * this). */
        gemBonusFactor: 0.5,
    },
} as const;
