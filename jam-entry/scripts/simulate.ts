/**
 * Headless balance simulator — `npm run balance`.
 *
 * Runs the EXACT game engine (src/game/sim/engine.ts) against canned
 * build strategies at 30 steps/simulated-second, no rendering, and reports
 * per-level lives so tuning changes in config/data are verifiable in seconds.
 *
 * Round I: the primary case is now `maxed-meta` — 10 maxed Tandoors, full
 * persistent meta upgrades, the same board docs/LevelBlocks.md §5b measured
 * (10% depth reached, levels 1-120) — because Round H's own strategies never
 * modelled a real player (createEngine() with zero meta) and never modelled
 * the strengthened board this level design produced.
 */
import { CONFIG } from '../src/game/config.ts';
import { WAVES, waveAt, waveThreat, levelThreatAt, isBossLevel, type Wave } from '../src/game/data/waves.ts';
import { createEngine, type Engine } from '../src/game/sim/engine.ts';
import { TOWERS } from '../src/game/data/towers.ts';
import { BLOCKS } from '../src/game/data/blocks.ts';
import type { MetaLevels } from '../src/state/save.ts';

const DT = 1 / 30;
/** Round I Task 2: raised from 80 (Round H) to 120 so Overtime (81+) is
 *  actually exercised — Task 1's acceptance criterion is maxed-meta losing
 *  somewhere in 85-110. */
const MAX_WAVES = 120;
/** Safety valve: no wave should take longer than this to resolve. */
const MAX_WAVE_SECONDS = 300;

/** Pad build priority: the six bonused center pads (B/C rows) first, then
 *  the four plain corners (A/D rows) — config.ts's 10-slot order is
 *  A1 A2 B1 B2 B3 C1 C2 C3 D1 D2 (indices 0-9). */
const PAD_PRIORITY = [3, 2, 4, 6, 5, 7, 1, 0, 9, 8];

interface Strategy {
    name: string;
    /** Called every build phase; spend what you want. */
    buy(e: Engine): void;
    /** Persistent meta upgrade levels this strategy plays with. Default: none
     *  (Round H's rule — verify the base game a brand-new player faces). */
    meta?: MetaLevels;
}

function nextFreePad(e: Engine): number | null {
    for (const pad of PAD_PRIORITY) {
        if (!e.state.towers.some((t) => t.padIndex === pad)) return pad;
    }
    return null;
}

/** Upgrade the cheapest available upgrade, repeatedly. */
function upgradeCheapest(e: Engine): boolean {
    let bestPad = -1;
    let bestCost = Infinity;
    for (const t of e.state.towers) {
        if (t.level > t.def.upgrades.length) continue;
        const cost = t.def.upgrades[t.level - 1].cost;
        if (cost < bestCost) {
            bestCost = cost;
            bestPad = t.padIndex;
        }
    }
    if (bestPad < 0 || e.state.coins < bestCost) return false;
    return e.upgradeTower(bestPad);
}

/** All towers, at every meta stat's max level (damage/speed/range: 10; the
 *  tower's own signature track: its own maxLevel — squirrel's chains caps
 *  at 3, not 10). docs/LevelBlocks.md §5b's own reference measurement. */
function maxedMeta(): MetaLevels {
    const meta: MetaLevels = {};
    for (const t of TOWERS) {
        meta[t.id] = {
            damage: CONFIG.meta.maxLevel,
            speed: CONFIG.meta.maxLevel,
            range: CONFIG.meta.maxLevel,
            unique: t.metaUnique.maxLevel,
        };
    }
    return meta;
}

const STRATEGIES: Strategy[] = [
    {
        // everything into foxes, then upgrades — the single-tower baseline
        name: 'fox-spam',
        buy(e) {
            let acted = true;
            while (acted) {
                acted = false;
                const pad = nextFreePad(e);
                if (pad !== null && e.placeTower(pad, 'fox')) acted = true;
                else if (upgradeCheapest(e)) acted = true;
            }
        },
    },
    {
        // intended composition: a bit of everything the roster offers
        name: 'balanced',
        buy(e) {
            const buildOrder = ['fox', 'owl', 'squirrel', 'bear', 'fox', 'squirrel', 'fox', 'bear', 'owl', 'bear'];
            let acted = true;
            while (acted) {
                acted = false;
                const pad = nextFreePad(e);
                const built = e.state.towers.length;
                if (pad !== null && built < buildOrder.length && e.placeTower(pad, buildOrder[built])) {
                    acted = true;
                } else if (upgradeCheapest(e)) {
                    acted = true;
                }
            }
        },
    },
    {
        // deliberately weak: two foxes, never another purchase. Must LOSE,
        // or the waves are too easy.
        name: 'miser (should lose)',
        buy(e) {
            if (e.state.towers.length < 2) {
                const pad = nextFreePad(e);
                if (pad !== null) e.placeTower(pad, 'fox');
            }
        },
    },
    {
        // Round H Task 2: the strategy no past sim validated against before
        // it existed. Pad 0 (now A1) carries no bonus post-Round-H-Task-3,
        // but kept as the floor case for continuity across rounds.
        name: 'pad0-rush',
        buy(e) {
            let pad0 = e.state.towers.find((t) => t.padIndex === 0);
            if (!pad0) {
                const strongest = [...TOWERS].filter((t) => t.cost <= e.state.coins).sort((a, b) => b.cost - a.cost)[0];
                if (strongest) e.placeTower(0, strongest.id);
                pad0 = e.state.towers.find((t) => t.padIndex === 0);
                if (!pad0) return;
            }
            while (pad0.level <= pad0.def.upgrades.length) {
                const cost = pad0.def.upgrades[pad0.level - 1].cost;
                if (e.state.coins < cost) return;
                e.upgradeTower(0);
            }
            let acted = true;
            while (acted) {
                acted = false;
                const pad = nextFreePad(e);
                if (pad !== null && e.placeTower(pad, 'fox')) acted = true;
                else if (upgradeCheapest(e)) acted = true;
            }
        },
    },
    {
        // Round I Task 2: the PRIMARY case. All 10 pads filled with Tandoor
        // (bear — splash), every tower upgraded to its in-run cap, full
        // persistent meta — the strongest board docs/LevelBlocks.md §5b
        // measured (10% depth reached across 120 levels, pre-Task-1-falloff).
        // This is what the curve now has to actually threaten.
        name: 'maxed-meta',
        meta: maxedMeta(),
        buy(e) {
            let acted = true;
            while (acted) {
                acted = false;
                const pad = nextFreePad(e);
                if (pad !== null && e.placeTower(pad, 'bear')) acted = true;
            }
            for (const t of e.state.towers) {
                while (t.level <= t.def.upgrades.length && e.upgradeTower(t.padIndex)) { /* keep upgrading */ }
            }
        },
    },
];

/** Total headcount and spawn duration for a level, from the WAVE DATA alone
 *  (no engine run needed) — Task 7's 120-unit / 90-second ceiling is a
 *  property of the authored composition, not a runtime measurement. */
function waveShape(wave: Wave): { units: number; spawnSecs: number } {
    const units = wave.entries.reduce((s, e) => s + e.count, 0);
    const spawnSecs = wave.entries.reduce((m, e) => Math.max(m, (e.startAt ?? 0) + e.count * e.spacing), 0);
    return { units, spawnSecs };
}

/** Round J Task 5: per-level participation — which pads ever fired a shot,
 *  and the most enemies simultaneously alive. Cooldown only ever moves in
 *  two directions: it counts DOWN every step (t.cooldown -= dt) and jumps
 *  UP to 1/fireRate the instant a tower fires (engine.ts:528-532) — so
 *  sampling it before/after a step and looking for a RISE catches every
 *  shot without needing to touch the sealed engine. */
interface ParticipationRow {
    level: number;
    firedPads: number;
    totalPads: number;
    peakAlive: number;
    deepestPct: number;
}

function run(strategy: Strategy): { lastPurchaseLevel: number; participation: ParticipationRow[] } {
    const e = createEngine(strategy.meta ?? {});
    const rows: string[] = [];
    const participation: ParticipationRow[] = [];
    let lastPurchaseLevel = 0;
    while (e.state.phase === 'build' && e.state.waveIndex < MAX_WAVES) {
        const level = e.state.waveIndex + 1;
        const preTowerCount = e.state.towers.length;
        const preTotalLevels = e.state.towers.reduce((s, t) => s + t.level, 0);
        strategy.buy(e);
        const bought = e.state.towers.length !== preTowerCount || e.state.towers.reduce((s, t) => s + t.level, 0) !== preTotalLevels;
        if (bought) lastPurchaseLevel = level;

        const livesBefore = e.state.lives;
        const towerCount = e.state.towers.length;
        const coinsBefore = e.state.coins;
        const shape = waveShape(waveAt(level - 1));
        e.startWave();
        const firedPads = new Set<number>();
        let peakAlive = 0;
        let t = 0;
        while (e.state.phase === 'wave' && t < MAX_WAVE_SECONDS) {
            const before = new Map(e.state.towers.map((tw) => [tw.padIndex, tw.cooldown]));
            e.step(DT);
            for (const tw of e.state.towers) {
                if (tw.cooldown > (before.get(tw.padIndex) ?? -Infinity)) firedPads.add(tw.padIndex);
            }
            if (e.state.enemies.length > peakAlive) peakAlive = e.state.enemies.length;
            t += DT;
        }
        if (t >= MAX_WAVE_SECONDS) {
            rows.push(`  level ${level}: STALLED after ${MAX_WAVE_SECONDS}s (bug or unkillable enemy?)`);
            break;
        }
        participation.push({ level, firedPads: firedPads.size, totalPads: towerCount, peakAlive, deepestPct: e.state.deepestFrac * 100 });
        const leaked = livesBefore - e.state.lives;
        rows.push(
            `  level ${String(level).padStart(3)}: ` +
            `lives ${String(e.state.lives).padStart(2)} ` +
            `(leaked ${leaked}) towers ${towerCount} ` +
            `coins ${coinsBefore}->${e.state.coins} ` +
            `cleared in ${t.toFixed(0)}s ` +
            `deepest ${(e.state.deepestFrac * 100).toFixed(0)}% ` +
            `units ${shape.units} spawn ${shape.spawnSecs.toFixed(0)}s ` +
            `fired ${firedPads.size}/${towerCount} peakAlive ${peakAlive}`
        );
        if (e.state.phase === 'lost') break;
    }
    const outcome =
        e.state.phase === 'lost'
            ? `LOST on level ${e.state.waveIndex + 1}`
            : `SURVIVED to the sim cap (level ${MAX_WAVES}) with ${e.state.lives}/${CONFIG.economy.startLives} lives`;
    console.log(`\n${strategy.name}: ${outcome}`);
    for (const r of rows) console.log(r);
    return { lastPurchaseLevel, participation };
}

console.log(`Balance simulation — ${WAVES.length} authored levels + Overtime, dt=${DT.toFixed(3)}s, MAX_WAVES=${MAX_WAVES}`);
const results: Record<string, { lastPurchaseLevel: number; participation: ParticipationRow[] }> = {};
for (const s of STRATEGIES) results[s.name] = run(s);

console.log('\nReading the results:');
console.log('  - maxed-meta is the PRIMARY case (10 maxed Tandoors, full meta): must lose somewhere in levels 85-110, not at the cap, not before 85.');
console.log('  - pad0-rush/fox-spam/balanced/miser are floor cases carried from Round H — miser must still lose, ideally around levels 4-8.');
console.log(`  - balanced stopped making any purchase after level ${results['balanced'].lastPurchaseLevel} (Acceptance Criterion 7 — coins as a live constraint).`);

// ---------------------------------------------------------------------------
// Round J Task 5: maxed-meta's participation table (criteria 2, 3, 4).
// ---------------------------------------------------------------------------
console.log('\nmaxed-meta participation (criteria 2-4: >=8/10 fired, >=40 peak alive, >=60% depth, all at level 40):');
console.log('  level  towers-fired  idle  peak-alive  depth');
for (const p of results['maxed-meta'].participation) {
    if (p.level % 10 === 0 || p.level === 40) {
        console.log(`  L${String(p.level).padStart(3)}   ${String(p.firedPads).padStart(2)}/${p.totalPads}         ${String(p.totalPads - p.firedPads).padStart(2)}    ${String(p.peakAlive).padStart(3)}         ${p.deepestPct.toFixed(0)}%`);
    }
}
const l40 = results['maxed-meta'].participation.find((p) => p.level === 40);
if (l40) {
    const c2 = l40.firedPads >= 8;
    const c3 = l40.peakAlive >= 40;
    const c4 = l40.deepestPct >= 60;
    console.log(`  Criterion 2 (>=8/10 fired @ L40): ${c2 ? 'MET' : 'NOT MET'} (${l40.firedPads}/${l40.totalPads})`);
    console.log(`  Criterion 3 (>=40 peak alive @ L40): ${c3 ? 'MET' : 'NOT MET'} (${l40.peakAlive})`);
    console.log(`  Criterion 4 (>=60% depth @ L40): ${c4 ? 'MET' : 'NOT MET'} (${l40.deepestPct.toFixed(0)}%)`);
} else {
    console.log('  maxed-meta never reached level 40 (lost earlier) — criteria 2-4 not measurable.');
}

// ---------------------------------------------------------------------------
// Round I Task 7: the four required proofs.
// ---------------------------------------------------------------------------

// 1) Threat strictly increasing, levels 1-120.
console.log('\nThreat + shape curve, levels 1-120 (threat = sum of count x (hp x speed x livesCost) / pathLength; units/spawn-secs are Task 7\'s 120-unit / 90s ceiling):');
const levelRows: { level: number; threat: number; units: number; spawnSecs: number; boss: boolean }[] = [];
for (let level = 1; level <= 120; level++) {
    const wave = waveAt(level - 1);
    const shape = waveShape(wave);
    levelRows.push({ level, threat: waveThreat(wave), units: shape.units, spawnSecs: shape.spawnSecs, boss: level <= 80 && isBossLevel(level) });
}
let row = '';
for (const r of levelRows) {
    const tag = r.boss ? '*' : ' ';
    row += `L${String(r.level).padStart(3)}${tag}:${r.threat.toFixed(0).padStart(5)} u${String(r.units).padStart(3)} s${r.spawnSecs.toFixed(0).padStart(2)}  `;
    if (r.level % 4 === 0) { console.log('  ' + row); row = ''; }
}
if (row) console.log('  ' + row);

let monotonic = true;
for (let i = 1; i < levelRows.length; i++) {
    if (levelRows[i].threat <= levelRows[i - 1].threat) {
        monotonic = false;
        console.log(`  ASSERTION FAILED: threat did not increase from level ${levelRows[i - 1].level} (${levelRows[i - 1].threat.toFixed(1)}) to level ${levelRows[i].level} (${levelRows[i].threat.toFixed(1)})`);
    }
}
console.log(monotonic
    ? '  PROVEN: threat is strictly increasing across every level 1-120.'
    : '  NOT PROVEN: see failures above.');

// Round J Task 5's own criterion (5): no entry's hpMult may exceed 8x anywhere 1-120.
let maxHpMult = 0;
let maxHpMultAt = '';
for (let level = 1; level <= 120; level++) {
    for (const entry of waveAt(level - 1).entries) {
        const m = entry.hpMult ?? 1;
        if (m > maxHpMult) { maxHpMult = m; maxHpMultAt = `level ${level} (${entry.enemy})`; }
    }
}
console.log(`\nHighest hpMult anywhere in levels 1-120: ${maxHpMult.toFixed(2)}x at ${maxHpMultAt}.`);
console.log(maxHpMult <= 8
    ? '  PROVEN: no entry\'s hpMult exceeds 8x anywhere in 1-120.'
    : '  NOT PROVEN: exceeds the 8x ceiling.');

// 2) Task 7's 120-unit / 90-second ceiling, every level 1-120 (the 291-snail test).
let shapeOk = true;
for (const r of levelRows) {
    if (r.units > 120 || r.spawnSecs > 90) {
        shapeOk = false;
        console.log(`  ASSERTION FAILED: level ${r.level} has ${r.units} units / ${r.spawnSecs.toFixed(0)}s spawning (limits: 120 units, 90s)`);
    }
}
console.log(shapeOk
    ? '  PROVEN: no level 1-120 exceeds 120 units or 90 seconds of spawning.'
    : '  NOT PROVEN: see failures above.');

// 3) Breather-decade guarantee, levels 21-80 (Round H's original proof,
// scoped to the authored blocks — Overtime's bands (§5d) are a different,
// loop-based structure, not the ones-digit encoding this checks).
console.log('\nBreather-decade guarantee, levels 21-80 (each decade\'s breather floor must exceed the previous decade\'s breather ceiling):');
function decadeBreatherRange(decadeIndex: number): { floor: number; ceil: number } {
    const start = decadeIndex * 10 + 1;
    const vals: number[] = [];
    for (let level = start; level <= start + 4; level++) vals.push(waveThreat(WAVES[level - 1]));
    return { floor: Math.min(...vals), ceil: Math.max(...vals) };
}
let breatherOk = true;
for (let d = 2; d <= 7; d++) {
    const prev = decadeBreatherRange(d - 1);
    const cur = decadeBreatherRange(d);
    const ok = cur.floor > prev.ceil;
    if (!ok) breatherOk = false;
    console.log(
        `  levels ${d * 10 + 1}-${d * 10 + 5} floor ${cur.floor.toFixed(1)} vs levels ${(d - 1) * 10 + 1}-${(d - 1) * 10 + 5} ceiling ${prev.ceil.toFixed(1)}: ${ok ? 'OK (floor > ceiling)' : 'FAILED'}`
    );
}
console.log(breatherOk
    ? '  PROVEN: every decade\'s breather floor (21-80) exceeds the previous decade\'s breather ceiling.'
    : '  NOT PROVEN: see failures above.');

// 4) Overtime (81-120+): PROJECTED, not simulated.
console.log('\nOvertime threat projection, levels 81-120 (PROJECTED via levelThreatAt — no meta upgrades or MetaLevels notion in this projection):');
{
    let orow = '';
    for (let level = 81; level <= 120; level++) {
        orow += `L${level}:${levelThreatAt(level).toFixed(0).padStart(6)}  `;
        if (level % 5 === 0) { console.log('  ' + orow); orow = ''; }
    }
}

// ---------------------------------------------------------------------------
// Round I Task 6 acceptance criterion 6: print the composition of all 10
// waves for blocks 1, 5 and 8 so the fixed ladder is checkable by eye.
// ---------------------------------------------------------------------------
console.log('\nWave-ladder composition, blocks 1, 5, 8 (10 levels each):');
for (const blockId of [1, 5, 8]) {
    const block = BLOCKS[blockId - 1];
    console.log(`  Block ${blockId} (${block.label}):`);
    const startLevel = (blockId - 1) * 10 + 1;
    for (let w = 1; w <= 10; w++) {
        const level = startLevel + w - 1;
        const wave = WAVES[level - 1];
        const parts = wave.entries.map((e) => `${e.enemy} x${e.count} (hpMult ${(e.hpMult ?? 1).toFixed(2)})`);
        console.log(`    L${level} W${w}: ${parts.join(', ')}  [threat ${waveThreat(wave).toFixed(1)}]`);
    }
}

// ---------------------------------------------------------------------------
// Round I Task 7 (board): pad geometry — no pad may overlap another pad or
// any belt segment. Distance-to-segment math, not eyeballing.
// ---------------------------------------------------------------------------
console.log('\nPad geometry assertion (10 slots, A1 A2 B1 B2 B3 C1 C2 C3 D1 D2):');
function pointSegDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let t = len2 === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
{
    const pads = CONFIG.pads;
    const path = CONFIG.path;
    const padRadius = Math.max(CONFIG.sizes.pad.w, CONFIG.sizes.pad.h) / 2;
    const pathHalf = CONFIG.sizes.pathWidth / 2;
    let geomOk = true;
    for (let i = 0; i < pads.length; i++) {
        for (let j = i + 1; j < pads.length; j++) {
            const d = Math.hypot(pads[i].x - pads[j].x, pads[i].y - pads[j].y);
            const min = padRadius * 2;
            const ok = d >= min;
            if (!ok) geomOk = false;
            console.log(`  pad ${i} vs pad ${j}: dist ${d.toFixed(1)} (need >= ${min}) : ${ok ? 'OK' : 'FAILED'}`);
        }
    }
    for (let i = 0; i < pads.length; i++) {
        let minDist = Infinity;
        for (let s = 0; s < path.length - 1; s++) {
            minDist = Math.min(minDist, pointSegDist(pads[i].x, pads[i].y, path[s].x, path[s].y, path[s + 1].x, path[s + 1].y));
        }
        const min = padRadius + pathHalf;
        const ok = minDist >= min;
        if (!ok) geomOk = false;
        console.log(`  pad ${i} vs belt: closest ${minDist.toFixed(1)} (need >= ${min}) : ${ok ? 'OK' : 'FAILED'}`);
    }
    console.log(geomOk
        ? '  PROVEN: no pad overlaps another pad or any belt segment.'
        : '  NOT PROVEN: see failures above.');
}
