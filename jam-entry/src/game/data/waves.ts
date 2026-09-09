/**
 * The shift, rush by rush. Each rush is a burst of tickets down the rail (an
 * arithmetic Overtime continuation follows; see below). Entries in a wave
 * spawn sequentially (with a short gap between entries), each entry spawning
 * `count` of one bug type every `spacing` seconds. No hidden scaling: what
 * `npm run balance` simulates is exactly what attacks.
 *
 * ============================== ROUND H CURVE ==============================
 * Levels 1-80 are authored here from a single number per level — its total
 * THREAT budget — solved down into a concrete enemy composition. Levels
 * 81-110 ("Overtime") extend the same arithmetic, projected but not
 * simulated (see scripts/simulate.ts and the Round H balance report).
 *
 * threat(wave) = Σ over units of (hp × speed × livesCost) / pathLength
 *
 * A unit that is tougher, faster, or costs more walkouts is proportionally
 * harder to stop before the pass; dividing by path length normalizes for
 * "how long defenders get to work it." Verified against the OLD 10-wave set
 * before any retuning: a naive total-HP metric shows drops at L3 and L6 (HP
 * alone dips when a wave trades a few slow tanks for more fast bugs) but
 * this formula is already monotonic across all 10 — hp alone mis-ranks the
 * boss and the saw-tooth it produces is exactly the defect this round
 * removes.
 * ============================================================================
 */
import { ENEMIES } from './enemies.ts';

export interface WaveEntry {
    enemy: string;
    count: number;
    spacing: number;
}

export interface Wave {
    entries: WaveEntry[];
    /** Stat multipliers on top of the roster's base stats (unused by the
     *  authored/Overtime curve below — composition alone carries the curve —
     *  but left in the shape for anything that wants to scale a fixed
     *  roster instead of picking a new one). */
    hpMult?: number;
    speedMult?: number;
}

/** Gap between one entry finishing and the next starting, seconds. */
export const ENTRY_GAP = 0.8;

// ---------------------------------------------------------------------------
// Threat model. PATH_LENGTH is duplicated as a literal (not imported from
// sim/engine.ts, which imports THIS file for waveAt — importing back would
// be circular) computed from CONFIG.path's polyline: 240+440+310+500+310+
// 500+350. CONFIG.path is frozen this round, so this cannot go stale without
// the frozen-path guarantee already being broken elsewhere.
// ---------------------------------------------------------------------------
const PATH_LENGTH = 2650;

function unitThreat(id: string): number {
    const def = ENEMIES.find((e) => e.id === id);
    if (!def) throw new Error(`unknown dish: ${id}`);
    return (def.hp * def.speed * def.livesCost) / PATH_LENGTH;
}

/** The recommended threat formula, applied to a composed wave. Exported for
 *  scripts/simulate.ts's balance table and proofs. */
export function waveThreat(wave: Wave): number {
    return wave.entries.reduce((sum, e) => sum + e.count * unitThreat(e.enemy), 0);
}

// ---- the authored curve: one threat number per level 1-80 -----------------

/** Level 1's threat: harder than the old wave 1 (9.37 under this formula)
 *  but still gentle — the FTUE (actions.ts/towerScene.ts) plays through
 *  levels 1-3 with at most two towers. */
const T1 = 13;
/** Per-decade growth on step SIZE (not level count) — this is what makes
 *  "the tens digit drive absolute difficulty upward" (Task 4b) and, given
 *  breathers always sit in the same relative position each decade, is what
 *  guarantees every decade's breather floor clears the previous decade's
 *  breather ceiling (see the assertion in scripts/simulate.ts): decade d+1's
 *  first breather inherits the fully-grown total of all of decade d, which
 *  is already above decade d's own breather ceiling. Tuned against
 *  `npm run balance` (Task 7): pad0-rush clears level 10 comfortably and
 *  loses at or before level 80 with no meta upgrades; miser loses ~4-6.
 */
const DECADE_GROWTH = 1.7;
/** Ones digit 1-5: breather. Small step — a level that visibly eases off. */
const BREATHER_FRAC = 0.05;
/** Ones digit 6-9 and 0: push. Large step — the decade's rising tension. */
const PUSH_FRAC = 0.22;

const LEVEL_COUNT_AUTHORED = 80;

/** True for ones-digit 1-5 (Task 4b). */
function isBreatherLevel(level: number): boolean {
    return ((level - 1) % 10) < 5;
}
/** True for ones-digit 0 (the decade's last, hardest push) — where a boss
 *  (stag) appears from level 10 on. */
function isBossLevel(level: number): boolean {
    return (level - 1) % 10 === 9;
}

/** Threat budget for any level >=1 (levels beyond 80 keep extending the same
 *  arithmetic — Overtime, 81-110, projected rather than simulated; see the
 *  balance report). No array/cache: it's an O(level) loop, called a few
 *  dozen times total. */
/**
 * Decade 1 (levels 11-20) gets an extra multiplier on top of the normal
 * per-decade growth. Live-play testing during tuning showed that against
 * any reasonably-built defense (not just the deliberately-weak miser and
 * pad0-rush strategies scripts/simulate.ts proves against), levels 11-20
 * leaked zero lives — the "observable tension" band read as a complete
 * non-event once a couple of towers existed. This boost is scoped to
 * decade 1 only so it doesn't disturb the already-proven levels 1-10 (FTUE)
 * or 21-80/pad0-rush/miser tuning.
 */
const TENSION_BOOST_DECADE_1 = 1.8;

function levelThreat(level: number): number {
    let t = T1;
    for (let lv = 2; lv <= level; lv++) {
        const d = Math.floor((lv - 1) / 10);
        const boost = d === 1 ? TENSION_BOOST_DECADE_1 : 1;
        const stepBase = T1 * Math.pow(DECADE_GROWTH, d) * boost;
        t += stepBase * (isBreatherLevel(lv) ? BREATHER_FRAC : PUSH_FRAC);
    }
    return t;
}

/** Which non-boss dish types are on the rail yet, by level — mirrors the old
 *  wave 1-10 unlock pacing (beetle -> +wasp -> +snail -> +hornet) so the
 *  onboarding band still feels familiar, just re-tuned for a smooth curve. */
function unlockedIds(level: number): string[] {
    if (level <= 2) return ['beetle'];
    if (level <= 4) return ['beetle', 'wasp'];
    if (level <= 6) return ['beetle', 'wasp', 'snail'];
    return ['beetle', 'wasp', 'snail', 'hornet'];
}

/**
 * Round H finding, not in the original recommended-formula spec: bear's
 * splash (sim/engine.ts's `victims.forEach(damageEnemy(v, p.damage))`) deals
 * FULL damage to every enemy caught in it, so a cluster of many weak,
 * tightly-spaced units dies to roughly as many volleys as ONE of them would
 * — raw count does not scale real difficulty against this engine the way
 * the threat formula's linear count term implies. What a fixed, fully-built
 * defense can't out-damage is sustained high-HP arrival rate. So: fine for
 * ranking within a composition (that's what it's used for below), but past
 * level 20, hitting the target with more weak fodder stopped raising real
 * difficulty and started producing multi-hundred-count waves that just ran
 * long (some stalled the sim's 300s-per-wave safety valve outright). Fixed
 * by leaning composition on stag — the only sealed unit tanky enough to
 * carry a big budget at a sane headcount — for push levels from level 21 on
 * and for every boss level, with stag's own spacing tightening by decade
 * too (arrival RATE, not just total HP, is what actually pressures a maxed
 * board). See the balance report for the levels-1-80 outcome this produced.
 */
const spacingFor = (id: string, decade: number): number => {
    const base: Record<string, number> = { beetle: 0.9, wasp: 0.75, snail: 1.1, hornet: 0.7, stag: 3.0 };
    const floor: Record<string, number> = { beetle: 0.32, wasp: 0.28, snail: 0.5, hornet: 0.3, stag: 1.0 };
    const decayPerDecade: Record<string, number> = { beetle: 0.05, wasp: 0.05, snail: 0.06, hornet: 0.05, stag: 0.28 };
    return Math.max(floor[id] ?? 0.32, (base[id] ?? 0.8) - (decayPerDecade[id] ?? 0.05) * decade);
};

/** Solve one level's threat target down into a concrete composition. */
function composeLevel(level: number, target: number): Wave {
    const decade = Math.floor((level - 1) / 10);

    if (isBossLevel(level)) {
        // Boss levels (10, 20, ..., 80): stag-led, growing share by decade —
        // level 10 (decade 0, onboarding) needs to stay clearable by a
        // still-forming defense (each un-killed stag costs 3 lives, not 1 —
        // a floor of "3 stags minimum" here nearly cost pad0-rush the run
        // at level 10 during tuning); level 80 needs to be a wall.
        const stagShare = Math.min(0.85, 0.25 + 0.075 * decade);
        const stagCount = Math.max(1, Math.round((target * stagShare) / unitThreat('stag')));
        const remaining = Math.max(target - stagCount * unitThreat('stag'), 0);
        const hornetCount = Math.max(2, Math.round(remaining / unitThreat('hornet')));
        return {
            entries: [
                { enemy: 'stag', count: stagCount, spacing: spacingFor('stag', decade) },
                { enemy: 'hornet', count: hornetCount, spacing: spacingFor('hornet', decade) },
            ],
        };
    }

    const unlocked = unlockedIds(level);
    if (decade >= 2) {
        // Levels 21+ (both breathers and pushes) draw on stag, growing
        // share by decade — same reasoning as boss levels above. Breathers
        // get HALF the push weight (still a rest relative to their own
        // decade's push levels) and lean on snail rather than hornet for
        // the remainder — softer, since a breather should still read as
        // one. Without this, breathers keep using flat beetle/wasp filler,
        // and at a level-70+ target that alone means a 400-500-count
        // entry — which is exactly what stalled the sim's 300s-per-wave
        // safety valve once during tuning.
        const isBreather = isBreatherLevel(level);
        const pushWeight = isBreather ? 0.5 : 1;
        const stagShare = Math.min(0.85, pushWeight * (0.15 + 0.1 * decade));
        const stagCount = Math.max(1, Math.round((target * stagShare) / unitThreat('stag')));
        const remaining = Math.max(target - stagCount * unitThreat('stag'), 0);
        const support = isBreather ? 'snail' : 'hornet'; // hardest unlocked non-boss type by level 21
        const supportCount = Math.max(1, Math.round(remaining / unitThreat(support)));
        return {
            entries: [
                { enemy: 'stag', count: stagCount, spacing: spacingFor('stag', decade) },
                { enemy: support, count: supportCount, spacing: spacingFor(support, decade) },
            ],
        };
    }

    // Levels 1-20 only (both breathers and pushes): the original weak/mid
    // roster, no stag yet.
    const byThreat = [...unlocked].sort((a, b) => unitThreat(a) - unitThreat(b));
    let primary: string;
    let secondary: string;
    let primaryShare: number;
    if (isBreatherLevel(level)) {
        // Gentle: mostly the weakest unlocked filler — visually busy maybe,
        // but individually soft. This is the "observable tension without
        // losing" rest, not an empty level.
        primary = byThreat[0];
        secondary = byThreat[1] ?? byThreat[0];
        primaryShare = 0.7;
    } else {
        // Push: lean on the two toughest unlocked types.
        primary = byThreat[byThreat.length - 2] ?? byThreat[byThreat.length - 1];
        secondary = byThreat[byThreat.length - 1];
        primaryShare = 0.55;
    }
    const primaryCount = Math.max(1, Math.round((target * primaryShare) / unitThreat(primary)));
    const secondaryCount = Math.max(1, Math.round((target * (1 - primaryShare)) / unitThreat(secondary)));
    const entries: WaveEntry[] =
        primary === secondary
            ? [{ enemy: primary, count: primaryCount + secondaryCount, spacing: spacingFor(primary, decade) }]
            : [
                  { enemy: primary, count: primaryCount, spacing: spacingFor(primary, decade) },
                  { enemy: secondary, count: secondaryCount, spacing: spacingFor(secondary, decade) },
              ];
    return { entries };
}

const authored: Wave[] = [];
for (let level = 1; level <= LEVEL_COUNT_AUTHORED; level++) {
    authored.push(composeLevel(level, levelThreat(level)));
}
// Rounding a threat target into whole-unit counts can occasionally undershoot
// enough to tie or dip below the previous level. Task 7 requires the curve
// strictly increasing, so patch any such level by growing its biggest entry
// until it clears its predecessor — the target above is a budget to solve
// for, not a promise this loop breaks.
for (let i = 1; i < authored.length; i++) {
    let guard = 0;
    while (waveThreat(authored[i]) <= waveThreat(authored[i - 1]) && guard++ < 1000) {
        const biggest = authored[i].entries.reduce((a, b) => (b.count > a.count ? b : a));
        biggest.count++;
    }
}

export const WAVES: Wave[] = authored;

// ---------------------------------------------------------------------------
// OVERTIME (levels 81-110 and beyond): exactly one enemy type per level,
// continuing the SAME arithmetic curve above rather than a new one, so
// difficulty never actually resets — just keeps climbing at the established
// per-decade rate. Projected mathematically (levelThreat has no lower bound
// on `level`), not simulated: `npm run balance` has no notion of the
// meta-upgrade levels a player would need to survive here (see the balance
// report for the assumed multipliers and three hand spot-checks).
// ---------------------------------------------------------------------------
function composeOvertimeLevel(level: number, target: number): Wave {
    const decade = Math.floor((level - 1) / 10);
    const count = Math.max(1, Math.round(target / unitThreat('stag')));
    return { entries: [{ enemy: 'stag', count, spacing: spacingFor('stag', decade) }] };
}

/** The level (1-based) at a 0-based wave index: authored while they last,
 *  arithmetic Overtime after. */
export function waveAt(index: number): Wave {
    if (index < WAVES.length) return WAVES[index];
    const level = index + 1;
    return composeOvertimeLevel(level, levelThreat(level));
}
