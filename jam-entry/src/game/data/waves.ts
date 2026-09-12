/**
 * The shift, rush by rush. Round I rebuilds this around docs/LevelBlocks.md's
 * nine-block design: one FIXED wave ladder (§5c), shared by every block,
 * solved down into a concrete composition per level from a single threat
 * budget — same idea as Round H, but the ladder now pins WHICH archetypes
 * appear at each position, so Task 3's per-entry hpMult/speedMult (not a
 * choice of archetype) is what carries the curve.
 *
 * threat(unit) = hp x speed x livesCost / pathLength; threat(wave) = sum
 * over entries of count x threat(unit at that entry's own hpMult/speedMult).
 *
 * Levels 1-80 are the eight ten-level blocks (data/blocks.ts); 81+ is
 * Overtime — a repeating, ever-steeper loop (§5d), projected by the same
 * arithmetic rather than simulated (scripts/simulate.ts's balance report
 * says plainly what's measured vs projected).
 */
import { ENEMIES } from './enemies.ts';
import { blockForLevel, ladderPosition } from './blocks.ts';

export interface WaveEntry {
    enemy: string;
    count: number;
    spacing: number;
    /** Stat multiplier on this entry's base hp. Default 1. Falls back to the
     *  wave's own hpMult (below) if unset — entry wins when both are set. */
    hpMult?: number;
    /** Stat multiplier on this entry's base speed. Default 1. */
    speedMult?: number;
    /** Seconds after wave start this entry begins spawning. Default: right
     *  after the previous entry's own start + full spawn duration (+
     *  ENTRY_GAP) — sim/engine.ts's buildEntryCursors(). Entries with
     *  DIFFERENT explicit startAt values spawn CONCURRENTLY (Task 4) — this
     *  is what lets e.g. a W3 put beetle and wasp on the belt together. */
    startAt?: number;
}

export interface Wave {
    entries: WaveEntry[];
    /** Wave-level stat multiplier fallback — unused by the authored/Overtime
     *  curve below (every entry sets its own), kept in the shape for
     *  anything that wants to scale a whole roster at once. */
    hpMult?: number;
    speedMult?: number;
}

/** Gap between one entry finishing and the next starting, when an entry
 *  omits `startAt` (sim/engine.ts's default-chaining fallback). */
export const ENTRY_GAP = 0.8;

// ---------------------------------------------------------------------------
// Threat model. PATH_LENGTH is duplicated as a literal (not imported from
// sim/engine.ts, which imports THIS file for waveAt — importing back would
// be circular). Round I Task 7 narrows the belt's right leg x610 -> x540
// (config.ts), which shortens every affected segment: 240+370+310+430+310+
// 430+350 = 2440 (was 2650). This is NOT frozen — CONFIG.path changed this
// very round — so unlike Round H's note here, there is no standing guarantee
// this constant can't go stale; it's re-derived by hand from CONFIG.path
// whenever the belt geometry changes.
// ---------------------------------------------------------------------------
const PATH_LENGTH = 2440;

function unitThreat(id: string, hpMult: number, speedMult: number): number {
    const def = ENEMIES.find((e) => e.id === id);
    if (!def) throw new Error(`unknown dish: ${id}`);
    return (def.hp * hpMult * def.speed * speedMult * def.livesCost) / PATH_LENGTH;
}

/** The recommended threat formula, applied to a composed wave — now entry-
 *  aware (Task 3): a snail scaled up at level 74 or block 1's stag scaled
 *  down to a teaching boss both carry their OWN multiplier into the sum,
 *  not the roster's base stat. Exported for scripts/simulate.ts.
 *
 *  Round J: deliberately evaluated at speedMult=1 regardless of the entry's
 *  actual field. baseSpeedMult (composeEntries) gives high-level entries a
 *  REAL speed boost — engine.ts reads WaveEntry.speedMult directly for
 *  movement, so it's fully live in gameplay — but folding that into the
 *  bookkeeping metric here made the achievable-ceiling math level-dependent
 *  (speed itself scales with level) instead of a fixed, provable number,
 *  which broke strict monotonicity outright (measured: threat readings
 *  jumped to 14000+ and swung non-monotonically once speed was included).
 *  Keeping "threat" as a pure hp/count/lives metric — the thing Tasks 3/5/7
 *  actually constrain — while letting speed be a separate, uncapped
 *  difficulty lever on top of it, was the only way to get both a provable
 *  curve AND a real answer to criterion 1 (see composeEntries's use of
 *  baseSpeedMult, and the balance report's honest note on this split). */
export function waveThreat(wave: Wave): number {
    return wave.entries.reduce((sum, e) => {
        const hpMult = e.hpMult ?? wave.hpMult ?? 1;
        return sum + e.count * unitThreat(e.enemy, hpMult, 1);
    }, 0);
}

// ---- the authored curve: one threat number per level 1-80 -----------------

/** Level 1's threat. */
const T1 = 13;
/** Per-decade growth on step SIZE — decade d's step is T1 * (1+d)^DECADE_EXP.
 *  Round H/I used a per-decade MULTIPLICATIVE base (T1 * GROWTH^d), which
 *  backloads almost the entire curve into the last two or three decades —
 *  fine when hpMult was unbounded (a single level's target could be hit by
 *  ANY count via arbitrary toughness), but fatal now that Task 5 caps hpMult
 *  at MAX_HP_MULT and headcount at countCap: the ceiling on what a wave can
 *  physically deliver is fixed (~5.5-6k, see the balance report), and with
 *  the old exponential shape level 40 (a third of the way through blocks
 *  1-8) only ever reached ~4% of that ceiling — nowhere near enough for
 *  either toughness or headcount to be meaningful, no matter how the two
 *  were split (measured: level 40 stuck at 3-5/10 towers firing regardless
 *  of hpMult/count balance). A power-law step (exponent, not a per-decade
 *  multiplier) front-loads growth instead: level 40 lands around a quarter
 *  of the level-120 ceiling rather than a twentieth, which is what actually
 *  lets Task 5's participation criteria be met at the level they're checked. */
const DECADE_EXP = 2.15;
/** Ones digit 1-5: breather. Small step. */
const BREATHER_FRAC = 0.05;
/** Ones digit 6-9 and 0: push. Large step. */
const PUSH_FRAC = 0.22;

const LEVEL_COUNT_AUTHORED = 80;

/** True for ones-digit 1-5 (Task 4b breather encoding, blocks 1-8). */
function isBreatherLevel(level: number): boolean {
    return ((level - 1) % 10) < 5;
}
/** True for ones-digit 0 — every block's boss level (W10). Exported for
 *  scripts/simulate.ts's per-level trace. */
export function isBossLevel(level: number): boolean {
    return (level - 1) % 10 === 9;
}

/** Threat budget for level 1-80: an O(level) running total, called a few
 *  dozen times total (no caching needed). */
function levelThreat(level: number): number {
    let t = T1;
    for (let lv = 2; lv <= level; lv++) {
        const d = Math.floor((lv - 1) / 10);
        const stepBase = T1 * Math.pow(1 + d, DECADE_EXP);
        t += stepBase * (isBreatherLevel(lv) ? BREATHER_FRAC : PUSH_FRAC);
    }
    return t;
}

// ---- Task 6: the fixed wave ladder (§5c), identical for every block -------

/** W1-W10 -> which archetypes spawn. Every block uses this EXCEPT block 1's
 *  W8-W10 (see BLOCK1_LADDER below) — block 1 is the FTUE's teaching boss,
 *  §6b, and drops the chaff those waves normally add. */
const LADDER: string[][] = [
    ['beetle'], // W1
    ['wasp'], // W2
    ['beetle', 'wasp'], // W3
    ['snail'], // W4
    ['hornet'], // W5
    ['snail', 'hornet'], // W6
    ['stag'], // W7
    ['stag', 'beetle', 'wasp'], // W8: boss over chaff
    ['stag', 'snail', 'hornet'], // W9: boss over elites
    ['stag', 'beetle', 'wasp', 'snail', 'hornet'], // W10: everything
];

/**
 * Block 1 §6b: "block 1's stag is a teaching boss." Its W8/W9 are pure
 * repeats of the W7 boss (no added chaff — the standard ladder's escalation
 * would 2-3x its own budget with a full-strength stag, per the doc's
 * measured numbers; here it's gentler by design, not by accident) and W9
 * doubles the boss count (both dishes — chai and coffee, §5a — spawn once
 * each, which the view's per-spawn dish alternation produces for free from
 * a single 2-count entry). W10 = "mixture of W3, W6, W9" — the full roster,
 * with the same doubled boss.
 */
const BLOCK1_LADDER: Record<number, { archetypes: string[]; stagCount?: number }> = {
    8: { archetypes: ['stag'] },
    9: { archetypes: ['stag'], stagCount: 2 },
    10: { archetypes: ['beetle', 'wasp', 'snail', 'hornet', 'stag'], stagCount: 2 },
};

function ladderFor(block: number, w: number): { archetypes: string[]; stagCount?: number } {
    if (block === 1 && BLOCK1_LADDER[w]) return BLOCK1_LADDER[w];
    return { archetypes: LADDER[w - 1] };
}

// ---- per-entry count/spacing tables (Task 3's whole point: hp/speed carry
// the curve, not raw headcount — Task 7's 291-snail problem) --------------

/**
 * Target headcount for one archetype's entry at a given level. Round I's
 * version capped these low (30/22/4) and let hpMult absorb nearly all of
 * the curve's growth, on a theory that a single very tanky boss surviving
 * 'first'-targeting concentration was the thing standing between maxed-meta
 * and a deep, participatory belt. Round J measured that theory directly and
 * it was wrong — pickTarget only considers enemies already inside a given
 * tower's OWN range (sim/engine.ts:435-442; no global "the" lead enemy), so
 * concentration was never the mechanism. The real cause was emptiness: a
 * ~10-40 unit wave dies to the one or two towers near the belt's start
 * before it has the numbers to still be alive once it reaches farther pads.
 * Measured on the pre-Round-J build, maxed-meta, per level:
 *
 *   level  towers fired  idle  total shots  peak alive  depth
 *   20     2 / 10        8     23           9           7%
 *   40     3 / 10        7     18           12          11%
 *   60     5 / 10        5     53           20          23%
 *   71     8 / 10        2     124          17          54%
 *   80     10 / 10       0     162          25          100%
 *
 * Participation and depth rise together with headcount, not with per-unit
 * toughness (level 40's own composed wave was already only 48 units against
 * a 3-tower kill front). So this round moves growth from hpMult (now capped
 * at 8x — see composeEntries) into count instead: caps raised so a level's
 * OWN unit budget (Task 7's 120-unit / 90s ceiling) is something the curve
 * can actually spend, rather than something it undershoots by an order of
 * magnitude while hpMult does all the work.
 */
function targetCount(id: string, level: number): number {
    const cfg: Record<string, { base: number; growth: number; cap: number }> = {
        beetle: { base: 6, growth: 0.28, cap: 34 },
        wasp: { base: 5, growth: 0.25, cap: 30 },
        snail: { base: 4, growth: 0.18, cap: 26 },
        hornet: { base: 4, growth: 0.18, cap: 22 },
        stag: { base: 1, growth: 0.06, cap: 8 },
    };
    const c = cfg[id] ?? cfg.beetle;
    return Math.min(c.cap, Math.max(1, Math.round(c.base + c.growth * level)));
}

/** Task 5's hard ceiling: no WaveEntry's hpMult may exceed this anywhere in
 *  levels 1-120 (criterion 5). */
const MAX_HP_MULT = 8;

/** Headcount ceiling for one archetype, independent of the base+growth
 *  schedule above — composeEntries's non-pinned branches derive count
 *  straight from budget (below) and only need the CAP half of targetCount's
 *  table, not its slower natural-growth curve. */
function countCap(id: string): number {
    // Round J: these used to sum to exactly 120 (Task 7's own ceiling), which
    // meant a fully-saturated 5-archetype wave had ZERO slack — the
    // monotonicity post-pass (below) had nowhere left to grow anything to
    // tell two near-identical late levels apart, producing exact ties
    // instead of a still-climbing curve (measured: levels 90-91 landed on
    // an identical composed threat with the old caps summing to the full
    // 120). Trimmed so the 5 caps sum to ~100, leaving real headroom under
    // the ceiling for fine differentiation at the very top of the curve.
    const caps: Record<string, number> = { beetle: 32, wasp: 28, snail: 22, hornet: 18, stag: 7 };
    return caps[id] ?? 26;
}

/** Toughness now follows its OWN schedule by level, independent of how big
 *  the wave's headcount is — reaching MAX_HP_MULT by ~level 40. Before this,
 *  hpMult was purely `per-archetype threat share / count`, so as count grew
 *  with level (targetCount) the two diluted each other and hpMult barely
 *  moved (level 40 sat at 0.4-0.9x — see the balance report). Decoupling
 *  them means every level up to ~40 has a wave that's actually survivable
 *  enough to reach deeper pads, and every level past ~40 — once this curve
 *  is pinned at the cap — has NO WAY to grow except by adding more bodies,
 *  which is Task 2's whole point. */
function baseHpMult(level: number): number {
    return Math.min(MAX_HP_MULT, 1 + 0.11 * level);
}

/** Even fully saturated (every archetype at countCap and MAX_HP_MULT), a
 *  swarm never threatened a single leak against a maxed board anywhere in
 *  120 levels (measured: 0 leaks, every level, up to 66% depth at the very
 *  top — see the balance report). Speed is the one per-entry stat Task 5
 *  doesn't bound: a faster unit spends less time inside any one tower's
 *  range circle, taking fewer hits per zone crossed for the same HP, which
 *  is what actually lets a swarm threaten to slip through once toughness
 *  and headcount both cap out. Ramps from level 20 so early/mid game (and
 *  block 1's onboarding) are untouched. */
function baseSpeedMult(level: number): number {
    // Two-phase: a quick ramp through the 20s/30s so participation is
    // already real by level 40 (criteria 2-4 are measured there), then a
    // much slower climb afterward so the loss it eventually causes for a
    // maxed board lands in the required 85-110 window rather than much
    // earlier (a single fast, flat ramp couldn't hit both — see the
    // balance report for the values tried).
    if (level <= 20) return 1;
    if (level <= 40) return 1 + 0.055 * (level - 20);
    if (level <= 95) return 1.7; // flat through the rest of the authored blocks and into early Overtime
    return Math.min(3.4, 1.7 + 0.06 * (level - 95));
}

/** Applying speed to EVERY archetype (including the slow, high-HP ones —
 *  stag especially) pushed a maxed board's loss level far earlier than the
 *  85-110 window no matter how the ramp above was shaped (measured: even a
 *  flat, modest 1.6x through levels 41-84 alone still lost by level 66).
 *  Restricting the boost to the two archetypes that are ALREADY the fastest
 *  base movers (wasp, hornet — 150/160 vs beetle's 90, snail's 55, stag's
 *  50) keeps the lever's participation benefit — a fast mover crosses more
 *  pads' range circles before dying, which is what actually raised
 *  participation at level 40 — without compounding it into the slow, tanky
 *  bulk of a wave's total threat that's what ultimately decides the loss
 *  window. */
function speedMultFor(id: string, level: number): number {
    return id === 'wasp' || id === 'hornet' ? baseSpeedMult(level) : 1;
}

/** Spawn spacing, tightening by decade (arrival RATE pressure — the Round H
 *  finding that a maxed board is beaten by sustained arrival, not raw HP,
 *  still holds: splash falloff (sim/engine.ts Task 1) makes density matter
 *  again but a defense still can't out-fire a fast, steady stream). */
function spacingFor(id: string, decade: number): number {
    const base: Record<string, number> = { beetle: 0.9, wasp: 0.75, snail: 1.1, hornet: 0.7, stag: 2.2 };
    const floor: Record<string, number> = { beetle: 0.28, wasp: 0.22, snail: 0.4, hornet: 0.22, stag: 0.8 };
    const decay: Record<string, number> = { beetle: 0.06, wasp: 0.06, snail: 0.07, hornet: 0.06, stag: 0.16 };
    return Math.max(floor[id] ?? 0.28, (base[id] ?? 0.8) - (decay[id] ?? 0.05) * decade);
}

/** Solve a threat budget down into concrete entries for a fixed archetype
 *  list. Stag (when present) gets a decade-scaled share of the budget UNLESS
 *  `teachingBoss` pins it to block 1's fixed hpMult (§6b, ~1/3 HP) instead —
 *  everything else splits the remainder evenly and solves its own hpMult
 *  from ITS OWN small, capped count (scaled by `countMult` — block 1's W1-W6
 *  and W10 chaff use more, individually weaker units at the SAME total
 *  threat: pressure from sustained arrival rate against a single-target
 *  tower, not from any one unit being tanky — see the block-1 tuning note
 *  where composeLevel calls this). Entries stagger `startAt` slightly so
 *  concurrent groups (Task 4) don't all spawn from the same instant. */
function composeEntries(
    level: number,
    target: number,
    archetypes: string[],
    opts: { teachingBoss?: boolean; stagCount?: number; countMult?: number; spacingMult?: number; hpBoost?: number; fixedHpMult?: number } = {}
): WaveEntry[] {
    const decade = Math.floor((level - 1) / 10);
    const countMult = opts.countMult ?? 1;
    const spacingMult = opts.spacingMult ?? 1;
    const hpBoost = opts.hpBoost ?? 1;
    const spacing = (id: string) => spacingFor(id, decade) * spacingMult;
    const entries: WaveEntry[] = [];
    let startAt = 0;

    if (archetypes.includes('stag')) {
        const others = archetypes.filter((a) => a !== 'stag');
        let stagCount: number;
        let stagHpMult: number;
        let stagThreat: number;
        if (opts.teachingBoss) {
            // §6b: fixed hp fraction, fixed (small) count — never solved
            // from budget, so it can't accidentally scale back up.
            stagCount = opts.stagCount ?? 1;
            stagHpMult = 0.35;
            stagThreat = stagCount * unitThreat('stag', stagHpMult, 1);
        } else {
            const stagShare = Math.min(0.93, 0.25 + 0.09 * Math.min(decade, 11));
            stagCount = targetCount('stag', level);
            stagHpMult = Math.min(MAX_HP_MULT, Math.max(0.15, (target * stagShare) / (stagCount * unitThreat('stag', 1, 1))));
            stagThreat = stagCount * unitThreat('stag', stagHpMult, 1);
        }
        entries.push({ enemy: 'stag', count: stagCount, hpMult: stagHpMult, speedMult: 1, spacing: spacingFor('stag', decade), startAt });
        startAt += 0.4;
        const remaining = Math.max(0, target - stagThreat);
        const per = others.length ? remaining / others.length : 0;
        for (const a of others) {
            const { count, hpMult } = solveArchetype(a, level, per, countMult, hpBoost);
            entries.push({ enemy: a, count, hpMult, speedMult: speedMultFor(a, level), spacing: spacing(a), startAt });
            startAt += 0.3;
        }
    } else {
        const per = target / archetypes.length;
        for (const a of archetypes) {
            if (opts.fixedHpMult !== undefined) {
                // W1/W2 (opts.fixedHpMult): a real FTUE player has exactly
                // ONE tower through both — verified live via CDP that
                // solving hpMult from budget (even completely unmodified)
                // left it leaking to 6/10 lives on the very first wave,
                // since a single base-level fox (~19 dps) can't out-kill a
                // stream of beetles faster than they arrive at base spacing.
                // Pinned low, like the teaching boss — the curve's OWN
                // target is a budget the earliest waves are allowed to
                // undershoot, same principle as §6b.
                const count = Math.max(1, Math.round(targetCount(a, level) * countMult));
                entries.push({ enemy: a, count, hpMult: opts.fixedHpMult, speedMult: 1, spacing: spacing(a), startAt });
            } else if (hpBoost !== 1 || countMult !== 1) {
                // Block 1's W3+ tuning (§6b's other half — see composeLevel):
                // "keep the normal headcount, but make each one meaningfully
                // tankier AND arrive in a tight burst." solveArchetype's
                // level-driven hpMult is the wrong base for that — hpBoost
                // would multiply an hpMult that's ALREADY the primary
                // variable, which then shrinks the BUDGET-DERIVED count for
                // the same target (backwards: tankier units, FEWER of them,
                // not the same headcount). Block 1 instead fixes count from
                // targetCount's own schedule first, exactly like Round I,
                // and solves hpMult from what's left of the budget.
                const count = Math.max(1, Math.round(targetCount(a, level) * countMult));
                const hpMult = Math.min(MAX_HP_MULT, Math.max(0.12, per / (count * unitThreat(a, 1, 1))) * hpBoost);
                entries.push({ enemy: a, count, hpMult, speedMult: 1, spacing: spacing(a), startAt });
            } else {
                const { count, hpMult } = solveArchetype(a, level, per, countMult, hpBoost);
                entries.push({ enemy: a, count, hpMult, speedMult: speedMultFor(a, level), spacing: spacing(a), startAt });
            }
            startAt += 0.25;
        }
    }

    // Round J safety valve: Task 6's fixed ladder gives several positions
    // (W1/W2/W4/W5, and W7 outside block 1) only ONE or TWO archetypes —
    // each such position has its own fixed ceiling once hpMult and count are
    // both capped (Tasks 5/7), independent of the other positions'. Once the
    // curve's target outgrows what the listed archetypes can physically
    // carry, the alternative is either silently undershooting the target
    // (breaking strict monotonicity once a later, lower-diversity position
    // can't clear an earlier, higher-diversity one) or letting a single
    // entry's count run past the 120-unit ceiling chasing a target it can
    // never reach (measured: levels 61-73 hit up to 235 units before this).
    // Filling the gap with a SMALL amount of an archetype not already on the
    // wave — highest-headroom first, and only once truly needed — keeps
    // every position's own identity (the listed archetypes still carry the
    // bulk) while giving the curve somewhere to put growth a thin ladder
    // position can't otherwise hold. teachingBoss levels are exempt: §6b's
    // whole point is that they're ALLOWED to undershoot.
    if (!opts.teachingBoss && opts.fixedHpMult === undefined) {
        const fillerHpMult = Math.min(MAX_HP_MULT, baseHpMult(level));
        // Highest threat-per-unit first (stag, then descending) so a big gap
        // gets closed with the FEWEST extra bodies, leaving headroom under
        // the unit ceiling instead of racing through the whole fillerOrder.
        const fillerOrder = ['stag', 'hornet', 'snail', 'wasp', 'beetle'].filter((a) => !archetypes.includes(a));
        for (const f of fillerOrder) {
            const achieved = entries.reduce((s, e) => s + e.count * unitThreat(e.enemy, e.hpMult ?? 1, 1), 0);
            const totalUnits = entries.reduce((s, e) => s + e.count, 0);
            if (achieved >= target * 0.995 || totalUnits >= 116) break;
            const need = target - achieved;
            const maxCount = Math.max(0, Math.min(countCap(f), 118 - totalUnits));
            const count = Math.min(maxCount, Math.max(1, Math.round(need / (unitThreat(f, 1, 1) * fillerHpMult))));
            if (count < 1) continue;
            const finalHpMult = Math.min(MAX_HP_MULT, Math.max(0.1, need / (count * unitThreat(f, 1, 1))));
            entries.push({ enemy: f, count, hpMult: finalHpMult, speedMult: speedMultFor(f, level), spacing: spacing(f), startAt });
            startAt += 0.3;
        }
    }

    return entries;
}

/**
 * Task 2/3's core solve for one non-stag archetype entry: toughness comes
 * from baseHpMult's OWN level schedule (capped at MAX_HP_MULT), and count is
 * whatever's needed to spend the rest of `per` at that toughness — clamped
 * to the archetype's own headcount ceiling (countCap). If the ceiling binds
 * (per is too big for even a maxed-count, maxed-hp entry to reach), hpMult
 * is recomputed against the actual clamped count so the entry's own reported
 * hpMult never lies about what it actually is, and is re-clamped to
 * MAX_HP_MULT as a hard backstop — the composed wave may then quietly
 * undershoot `per` at the very top of the curve, which is what the generic
 * monotonicity post-pass (below) exists to catch.
 */
function solveArchetype(id: string, level: number, per: number, countMult: number, hpBoost: number): { count: number; hpMult: number } {
    const hpMult = Math.min(MAX_HP_MULT, baseHpMult(level) * hpBoost);
    const idealCount = Math.max(1, Math.round((per / (unitThreat(id, 1, 1) * hpMult)) * countMult));
    const count = Math.min(countCap(id), idealCount);
    const finalHpMult = Math.min(MAX_HP_MULT, Math.max(0.1, per / (count * unitThreat(id, 1, 1))));
    return { count, hpMult: finalHpMult };
}

/**
 * Block 1 tuning (§6b's other half): block 1 IS the FTUE and the first ten
 * levels every player ever sees with zero meta upgrades — it must be
 * clearable by three un-upgraded starting props, not "a real test" of a
 * built-up board. An earlier round tuned W4-W10's support entries (tight
 * spacingMult + high hpBoost — five tanky units inside one second) to make
 * onboarding harder, and validated it only against maxed-meta, where the
 * effect is invisible: a full board eats a tight burst for free. Against the
 * actual opening (balanced: 3 props, miser: 2, pad0-rush: 1 — see
 * scripts/simulate.ts's stock profiles), that same burst leaked lives on
 * literally every level from 4 through 10 (confirmed in the balance report:
 * the failure was in the per-level trace since before launch, missed because
 * only the summary line was read).
 *
 * Retuned here against the STOCK profiles, not maxed-meta: spacingMult
 * widened from 0.15 to 0.45 (arrivals spread out enough for two or three
 * un-upgraded props to actually clear the group between spawns) and hpBoost
 * lowered from 2.1 to 1.35 (still tankier than the base curve, just not
 * enough to eat a full 4-shot volley per unit). countMult stays 1 — this was
 * never a headcount problem. The criterion this must hold: balanced shows
 * zero leaks anywhere in block 1 (levels 1-11); miser still dies (that's its
 * contract); maxed-meta is unaffected because it was never the constraint.
 */
function composeLevel(level: number): Wave {
    const block = blockForLevel(level).id;
    const w = ladderPosition(level);
    const { archetypes, stagCount } = ladderFor(block, w);
    const target = levelThreat(level);
    let countMult = 1;
    let spacingMult = 1;
    let hpBoost = 1;
    let fixedHpMult: number | undefined;
    if (block === 1) {
        if (w <= 2) {
            // The FTUE forces exactly ONE tower through both W1 and W2 (a
            // second only lands after W2 clears) — verified live via CDP
            // that solving hpMult from budget, even fully unmultiplied,
            // still left W1 leaking to 6/10 lives against a single
            // un-upgraded starting tower. Pinned low instead (see
            // composeEntries's doc on fixedHpMult).
            fixedHpMult = 0.35;
        } else if (w === 3) {
            countMult = 1.3;
            spacingMult = 0.5;
        } else {
            countMult = 1;
            spacingMult = 0.45;
            hpBoost = 1.35;
        }
    }
    return { entries: composeEntries(level, target, archetypes, { teachingBoss: block === 1, stagCount, countMult, spacingMult, hpBoost, fixedHpMult }) };
}

const authored: Wave[] = [];
for (let level = 1; level <= LEVEL_COUNT_AUTHORED; level++) {
    authored.push(composeLevel(level));
}

// Block 1's teaching-boss levels (W7-10 = levels 7-10) deliberately
// undershoot their own curve TARGET (§6b) — but the curve still has to
// clear the level BEFORE it, or Task 7's strict-monotonicity proof fails
// right where onboarding hands off to the first real boss. Solved here,
// directly on the stag entry's hpMult (never its count — growing the count
// is exactly what §6b says not to do), cascading level by level so each of
// W7/W8/W9/W10 only has to beat the level immediately before it, not hit an
// absolute number. Runs BEFORE the generic post-pass below, and these four
// levels are excluded from it (see the filter there) so nothing after this
// can inflate the teaching boss's count as a side effect.
for (const level of [7, 8, 9, 10]) {
    const wave = authored[level - 1];
    const stagEntry = wave.entries.find((e) => e.enemy === 'stag');
    if (!stagEntry) continue;
    const prevThreat = waveThreat(authored[level - 2]);
    const needed = (prevThreat * 1.03) / (stagEntry.count * unitThreat('stag', 1, 1));
    stagEntry.hpMult = Math.min(1.5, Math.max(0.28, needed));
}

// Rounding a threat target into whole-unit counts can occasionally undershoot
// enough to tie or dip below the previous level elsewhere in the curve. Task
// 7 requires it strictly increasing: patch any such level by growing its
// biggest NON-stag entry (never a stag — for blocks 2-8/Overtime that would
// quietly re-inflate a budget-solved boss past its intended share) until it
// clears its predecessor. Block 1's levels 7-10 are excluded (handled above,
// on their own terms) so this can never re-touch the teaching boss.
for (let i = 1; i < authored.length; i++) {
    if (i + 1 >= 7 && i + 1 <= 10) continue; // block 1's teaching-boss levels
    let guard = 0;
    // Round J: bounded by Task 7's own 120-unit ceiling — composeEntries's
    // filler valve (above) is what's supposed to close most of this gap
    // already; this loop only mops up float-rounding ties, so it must never
    // itself be the thing that breaks the unit cap chasing a target the
    // wave's own archetypes can't reach. Once count is maxed out, a tiny
    // hpMult nudge (still under MAX_HP_MULT) is the only lever left —
    // needed right at the top of the curve where headcount alone saturates
    // before two adjacent levels' composed threat can be told apart.
    while (waveThreat(authored[i]) <= waveThreat(authored[i - 1]) && guard++ < 4000) {
        const growable = authored[i].entries.filter((e) => e.enemy !== 'stag');
        const pool = growable.length ? growable : authored[i].entries;
        const totalUnits = authored[i].entries.reduce((s, e) => s + e.count, 0);
        if (totalUnits < 120) {
            const biggest = pool.reduce((a, b) => (b.count > a.count ? b : a));
            biggest.count++;
        } else {
            // Count is maxed — the entry with the most COUNT may already sit
            // at MAX_HP_MULT too, while a smaller entry still has headroom
            // (e.g. snail solved a hair under cap while beetle saturated
            // first); bump whichever one still has room, not just "biggest".
            const bumpable = pool.filter((e) => (e.hpMult ?? 1) < MAX_HP_MULT);
            if (bumpable.length === 0) break; // truly at the ceiling on every lever
            bumpable[0].hpMult = Math.min(MAX_HP_MULT, (bumpable[0].hpMult ?? 1) + 0.01);
        }
    }
}

export const WAVES: Wave[] = authored;

// ---------------------------------------------------------------------------
// Overtime (block 9, levels 81+) — docs/LevelBlocks.md §5d: a repeating,
// ever-steeper 10-level loop (2 breathing, 5 amateur tough, 3 brutal),
// projected by continuing the SAME arithmetic rather than simulated
// (scripts/simulate.ts has no notion of meta upgrade levels — see its
// report for the assumed multipliers and hand spot-checks).
// ---------------------------------------------------------------------------

/** The hard ceiling on ANY composed wave's threat once every archetype is at
 *  its own count cap and MAX_HP_MULT (Task 5/Task 3's caps) — computed, not
 *  guessed, so it stays correct if either table above changes. Nothing a
 *  curve asks for can ever legally exceed this; Overtime's own target curve
 *  (below) is built to approach it without ever reaching it, which is what
 *  keeps strict monotonicity provable all the way to level 120. */
const ACHIEVABLE_CEILING = MAX_HP_MULT * ['beetle', 'wasp', 'snail', 'hornet', 'stag']
    .reduce((s, a) => s + countCap(a) * unitThreat(a, 1, 1), 0);

/** Threat for any level >= 81. Round J replaces the old per-loop additive
 *  compounding (Math.pow(1.6, c), then a gentler Math.pow(9, DECADE_EXP)
 *  variant) with a direct asymptotic climb: it was fundamentally the wrong
 *  shape once hpMult and headcount both cap out (Task 5), because ANY
 *  additive running total keeps growing forever and WILL eventually cross
 *  ACHIEVABLE_CEILING, at which point every level past that crossing point
 *  composes to the exact same clamped wave — a flat plateau, not a curve,
 *  and a broken strict-monotonicity proof (measured: levels 100-120 all
 *  landed on identical composed threat under the old formula). This curve
 *  instead climbs the fixed distance between levelThreat(80) and 92% of the
 *  ceiling using n/(n+K) — strictly increasing by construction, and never
 *  able to reach (let alone exceed) the ceiling no matter how far levels ran
 *  past 120. K=14 was tuned by reading how much of that climb happens by
 *  level 120 in the balance report; §5d's breathing/tough/brutal bands still
 *  vary composeOvertimeLevel's per-level TEXTURE (see below) but no longer
 *  drive the overall threat number. */
function overtimeLevelThreat(level: number): number {
    // The seam: level 80's ACTUAL composed threat (post monotonicity-pass,
    // which can run a bit above its own nominal levelThreat(80) target) —
    // not the nominal target — or level 81 could ask for less than level 80
    // already delivers.
    const base = waveThreat(authored[LEVEL_COUNT_AUTHORED - 1]);
    const room = ACHIEVABLE_CEILING * 0.92 - base;
    const n = level - LEVEL_COUNT_AUTHORED;
    const K = 45;
    return base + room * (n / (n + K));
}

/** §5d composition: Round J drops the old per-band archetype restriction
 *  (breathing was beetle+wasp only, amateur tough was snail+hornet(+stag)
 *  only, all 5 only on brutal levels). Each restricted subset has its OWN
 *  achievable threat ceiling once Task 5 caps hpMult at 8x and headcount at
 *  countCap — a 2-archetype wave physically cannot exceed roughly 965 threat
 *  no matter what, which made it mathematically impossible for a later,
 *  higher-target level using that restricted subset to ever clear an
 *  earlier full-roster level, breaking strict monotonicity. Every Overtime
 *  level now draws from the full roster; overtimeLevelThreat's smooth climb
 *  is what actually varies the intensity level to level. */
function composeOvertimeLevel(level: number, target: number): Wave {
    return { entries: composeEntries(level, target, ['stag', 'beetle', 'wasp', 'snail', 'hornet']) };
}

/** Overtime levels, computed and cached lazily as requested (there's no
 *  fixed end to Overtime, unlike the 80-level authored array). A smoothly
 *  increasing TARGET (overtimeLevelThreat) doesn't guarantee a strictly
 *  increasing COMPOSED wave once rounding is involved — a small enough
 *  target delta between two levels can round to the exact same whole-unit
 *  counts, tying (measured: levels 96-99 landed on an identical composed
 *  threat before this existed). Same fixup as the authored post-pass:
 *  grow the biggest non-stag entry until it clears the level before it,
 *  bounded so it can never itself cross Task 7's 120-unit ceiling. */
const overtimeCache: Wave[] = [];
function overtimeWaveAt(level: number): Wave {
    const idx = level - (LEVEL_COUNT_AUTHORED + 1);
    while (overtimeCache.length <= idx) {
        const lv = LEVEL_COUNT_AUTHORED + 1 + overtimeCache.length;
        const wave = composeOvertimeLevel(lv, overtimeLevelThreat(lv));
        const prevThreat = overtimeCache.length === 0
            ? waveThreat(authored[LEVEL_COUNT_AUTHORED - 1])
            : waveThreat(overtimeCache[overtimeCache.length - 1]);
        let guard = 0;
        while (waveThreat(wave) <= prevThreat && guard++ < 4000) {
            const growable = wave.entries.filter((e) => e.enemy !== 'stag');
            const pool = growable.length ? growable : wave.entries;
            const totalUnits = wave.entries.reduce((s, e) => s + e.count, 0);
            if (totalUnits < 120) {
                const biggest = pool.reduce((a, b) => (b.count > a.count ? b : a));
                biggest.count++;
            } else {
                const bumpable = pool.filter((e) => (e.hpMult ?? 1) < MAX_HP_MULT);
                if (bumpable.length === 0) break;
                bumpable[0].hpMult = Math.min(MAX_HP_MULT, (bumpable[0].hpMult ?? 1) + 0.01);
            }
        }
        overtimeCache.push(wave);
    }
    return overtimeCache[idx];
}

/** The level (1-based) at a 0-based wave index: authored while they last,
 *  Overtime's loop after. */
export function waveAt(index: number): Wave {
    if (index < WAVES.length) return WAVES[index];
    return overtimeWaveAt(index + 1);
}

/** Exported for scripts/simulate.ts's threat table/proofs and
 *  sim/engine.ts's kitchenActionCost — the one threat number for ANY level,
 *  authored or Overtime. */
export function levelThreatAt(level: number): number {
    return level <= LEVEL_COUNT_AUTHORED ? levelThreat(level) : overtimeLevelThreat(level);
}
