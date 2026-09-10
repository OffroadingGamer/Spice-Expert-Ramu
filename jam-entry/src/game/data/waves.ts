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
 *  not the roster's base stat. Exported for scripts/simulate.ts. */
export function waveThreat(wave: Wave): number {
    return wave.entries.reduce((sum, e) => {
        const hpMult = e.hpMult ?? wave.hpMult ?? 1;
        const speedMult = e.speedMult ?? wave.speedMult ?? 1;
        return sum + e.count * unitThreat(e.enemy, hpMult, speedMult);
    }, 0);
}

// ---- the authored curve: one threat number per level 1-80 -----------------

/** Level 1's threat. */
const T1 = 13;
/** Per-decade growth on step SIZE — decade d's step is T1 * GROWTH^d. Kept
 *  from Round H: it's what makes "the tens digit drive absolute difficulty
 *  upward" (Task 4b) and guarantees every decade's breather floor clears the
 *  previous decade's breather ceiling (levelThreat is a running total that
 *  only ever grows, so decade d+1's first breather already carries all of
 *  decade d's growth). Re-tuned from 1.7 against the Round I board (10 slots,
 *  6 bonuses, splash falloff, real spawn concurrency — see the balance
 *  report for the final value and the maxed-meta loss window it produces). */
const DECADE_GROWTH = 1.85;
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
        const stepBase = T1 * Math.pow(DECADE_GROWTH, d);
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
 * Target headcount for one archetype's entry at a given level — grows
 * slowly and CAPS (Task 7: no level may spawn more than 120 units total or
 * take more than 90s to finish spawning). Whatever budget a count this
 * small can't reach, hpMult below makes up.
 *
 * Stag's cap (4) and its decade-scaled share (below, stagShare) were pushed
 * as far as they could go toward "few, very tanky bosses" chasing Task 7's
 * acceptance criterion 2 (maxed-meta reaching 60% path depth by level 40 —
 * today's baseline was 10%). 🔴 HONEST GAP: even at cap 2 / 97% share, a
 * single boss still only reached ~15% by level 40 before dying to 10 maxed
 * Tandoors' concentrated fire (all ten in 'first'-targeting range of the
 * same lead enemy) — and pushing further cost the maxed-meta loss window,
 * moving it to level 79 (below the required 85). The math: surviving to 60%
 * depth against ~1300 combined DPS at stag's speed needs roughly 30,000+ hp
 * on a single unit, which would require a threat magnitude that breaks
 * monotonicity, the unit/duration ceiling, AND block 1's tuning simultaneously
 * (verified — see the balance report). Splash falloff (Task 1) measurably
 * helped ordinary builds (fox-spam/balanced reach 40-55% by level 40, up
 * from the same 10% baseline) but not this specific all-splash, fully-maxed
 * edge case, because concentrated SINGLE-TARGET damage (10 towers all
 * hitting the one lead enemy at full damage) was never something Task 1's
 * splash-radius falloff could touch. Landed at cap 4 / 93% share: the best
 * balance found between "some genuine depth improvement" and "still loses
 * in the required window" — reported honestly rather than forced further.
 */
function targetCount(id: string, level: number): number {
    const cfg: Record<string, { base: number; growth: number; cap: number }> = {
        beetle: { base: 5, growth: 0.22, cap: 30 },
        wasp: { base: 4, growth: 0.2, cap: 30 },
        snail: { base: 3, growth: 0.17, cap: 22 },
        hornet: { base: 3, growth: 0.17, cap: 22 },
        stag: { base: 1, growth: 0.03, cap: 4 },
    };
    const c = cfg[id] ?? cfg.beetle;
    return Math.min(c.cap, Math.max(1, Math.round(c.base + c.growth * level)));
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
            stagHpMult = Math.max(0.15, (target * stagShare) / (stagCount * unitThreat('stag', 1, 1)));
            stagThreat = stagCount * unitThreat('stag', stagHpMult, 1);
        }
        entries.push({ enemy: 'stag', count: stagCount, hpMult: stagHpMult, speedMult: 1, spacing: spacingFor('stag', decade), startAt });
        startAt += 0.4;
        const remaining = Math.max(0, target - stagThreat);
        const per = others.length ? remaining / others.length : 0;
        for (const a of others) {
            const count = Math.max(1, Math.round(targetCount(a, level) * countMult));
            const hpMult = Math.max(0.1, per / (count * unitThreat(a, 1, 1))) * hpBoost;
            entries.push({ enemy: a, count, hpMult, speedMult: 1, spacing: spacing(a), startAt });
            startAt += 0.3;
        }
        return entries;
    }

    const per = target / archetypes.length;
    for (const a of archetypes) {
        const count = Math.max(1, Math.round(targetCount(a, level) * countMult));
        // W1/W2 (opts.fixedHpMult): a real FTUE player has exactly ONE
        // tower through both — verified live via CDP that solving hpMult
        // from budget (even completely unmodified) left it leaking to
        // 6/10 lives on the very first wave, since a single base-level fox
        // (~19 dps) can't out-kill a stream of beetles faster than they
        // arrive at base spacing. Pinned low, like the teaching boss — the
        // curve's OWN target is a budget the earliest waves are allowed to
        // undershoot, same principle as §6b.
        const hpMult = opts.fixedHpMult ?? Math.max(0.12, per / (count * unitThreat(a, 1, 1))) * hpBoost;
        entries.push({ enemy: a, count, hpMult, speedMult: 1, spacing: spacing(a), startAt });
        startAt += 0.25;
    }
    return entries;
}

/**
 * Block 1 tuning (§6b's other half — "balanced leaks at least once across
 * W4-W10 and finishes level 10 with 5-8/10 lives; miser still dies"): the
 * teaching boss (W7-10) is capped low BY DESIGN, so it can't be the lever
 * that makes onboarding a real test — the only levers are W4/W5/W6/W10's
 * support entries. Found empirically against `npm run balance` (see the
 * balance report), not derived analytically:
 *   - MORE, weaker units (high countMult, tiny spacing) failed — hpMult hit
 *     its floor, so a 'first'-targeting tower one-shot every arrival
 *     regardless of how many showed up at once.
 *   - FEWER, tougher units (reduced countMult) failed too — with only one
 *     or two on the field, a still-modest board's COMBINED dps focuses them
 *     down before they cover meaningful ground.
 *   - What works: keep the normal headcount, but make each one meaningfully
 *     tankier (hpBoost) AND arrive in a tight burst (spacingMult) — enough
 *     simultaneous targets that 'first'-targeting can't clear the group
 *     before some of it closes real distance.
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
            spacingMult = 0.15;
            hpBoost = 2.1;
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
    while (waveThreat(authored[i]) <= waveThreat(authored[i - 1]) && guard++ < 2000) {
        const growable = authored[i].entries.filter((e) => e.enemy !== 'stag');
        const pool = growable.length ? growable : authored[i].entries;
        const biggest = pool.reduce((a, b) => (b.count > a.count ? b : a));
        biggest.count++;
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

/** §5d: loop index c and position p within the loop (level 81 -> c=0, p=0). */
function overtimeLoop(level: number): { c: number; p: number } {
    const n = level - 81;
    return { c: Math.floor(n / 10), p: n % 10 };
}

/** §5d step base: the authored curve's own growth continued (decade 8),
 *  then compounding PER LOOP instead of per decade. */
function overtimeStepBase(c: number): number {
    return T1 * Math.pow(DECADE_GROWTH, 8) * Math.pow(1.6, c);
}

/** §5d band fractions: breathing +4%, amateur tough +15%, brutal +35%. */
function overtimeFrac(p: number): number {
    if (p <= 1) return 0.04;
    if (p <= 6) return 0.15;
    return 0.35;
}

/** Threat for any level >= 81: levelThreat(80)'s authored total, plus every
 *  Overtime step since. O(level) like levelThreat, called rarely. */
function overtimeLevelThreat(level: number): number {
    let t = levelThreat(LEVEL_COUNT_AUTHORED);
    for (let lv = 81; lv <= level; lv++) {
        const { c, p } = overtimeLoop(lv);
        t += overtimeStepBase(c) * overtimeFrac(p);
    }
    return t;
}

/** §5d composition per band: breathing is W3 shape (beetle+wasp), amateur
 *  tough is W6 shape (snail+hornet, +stag once p>=3), brutal is W10 shape
 *  (stag-led, count rising with level via targetCount). */
function composeOvertimeLevel(level: number, target: number): Wave {
    const { p } = overtimeLoop(level);
    let archetypes: string[];
    if (p <= 1) archetypes = ['beetle', 'wasp'];
    else if (p <= 6) archetypes = p >= 3 ? ['snail', 'hornet', 'stag'] : ['snail', 'hornet'];
    else archetypes = ['stag', 'beetle', 'wasp', 'snail', 'hornet'];
    return { entries: composeEntries(level, target, archetypes) };
}

/** The level (1-based) at a 0-based wave index: authored while they last,
 *  Overtime's loop after. */
export function waveAt(index: number): Wave {
    if (index < WAVES.length) return WAVES[index];
    const level = index + 1;
    return composeOvertimeLevel(level, overtimeLevelThreat(level));
}

/** Exported for scripts/simulate.ts's threat table/proofs and
 *  sim/engine.ts's kitchenActionCost — the one threat number for ANY level,
 *  authored or Overtime. */
export function levelThreatAt(level: number): number {
    return level <= LEVEL_COUNT_AUTHORED ? levelThreat(level) : overtimeLevelThreat(level);
}
