/**
 * Headless balance simulator — `npm run balance`.
 *
 * Runs the EXACT game engine (src/game/sim/engine.ts) against canned
 * build strategies at 30 steps/simulated-second, no rendering, and reports
 * per-wave lives so tuning changes in config/data are verifiable in seconds:
 *
 *   - If every strategy loses early, the waves are too hard (unwinnable).
 *   - If the deliberately weak "miser" strategy wins, they are too easy.
 *   - The playable band is: sensible strategies win, the miser does not.
 *
 * Strategies buy during build phases only (like a calm player). They are
 * deterministic, so a given config always prints the same table.
 */
import { CONFIG } from '../src/game/config.ts';
import { WAVES, waveThreat } from '../src/game/data/waves.ts';
import { createEngine, type Engine } from '../src/game/sim/engine.ts';
import { TOWERS } from '../src/game/data/towers.ts';

const DT = 1 / 30;
/**
 * Round H Task 2/7: raised from WAVES.length + 15 (=25) to 80 — level 80 is
 * the round's central claim ("unwinnable at base stats with no kitchen
 * upgrades") and the sim must actually run that far to demonstrate it.
 */
const MAX_WAVES = 80;
/** Safety valve: no wave should take longer than this to resolve. */
const MAX_WAVE_SECONDS = 300;

/** Pad build priority: center double-coverage pads first, corners last. */
const PAD_PRIORITY = [2, 1, 3, 4, 5, 0, 6, 7];

interface Strategy {
    name: string;
    /** Called every build phase; spend what you want. */
    buy(e: Engine): void;
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
            const buildOrder = ['fox', 'owl', 'squirrel', 'bear', 'fox', 'squirrel', 'fox', 'bear'];
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
        // Round H Task 2: the strategy no past sim ever validated against.
        // Pad 0 sits at the head of the path; before this round it also
        // carried a x1.5 damage bonus (Task 3 strips it), so a real player
        // maxed it first and coasted 28 rushes. Every "balanced" verdict the
        // sim ever printed was measured against PAD_PRIORITY's ordering
        // (pad 0 sixth of eight), which no one actually plays.
        name: 'pad0-rush',
        buy(e) {
            let pad0 = e.state.towers.find((t) => t.padIndex === 0);
            if (!pad0) {
                const strongest = [...TOWERS].filter((t) => t.cost <= e.state.coins).sort((a, b) => b.cost - a.cost)[0];
                if (strongest) e.placeTower(0, strongest.id);
                pad0 = e.state.towers.find((t) => t.padIndex === 0);
                if (!pad0) return; // can't afford even the cheapest tower yet
            }
            // Max pad 0 before spending anywhere else.
            while (pad0.level <= pad0.def.upgrades.length) {
                const cost = pad0.def.upgrades[pad0.level - 1].cost;
                if (e.state.coins < cost) return;
                e.upgradeTower(0);
            }
            // Pad 0 maxed: coast on the rest of the board like a normal
            // player would, rather than sitting on gold forever.
            let acted = true;
            while (acted) {
                acted = false;
                const pad = nextFreePad(e);
                if (pad !== null && e.placeTower(pad, 'fox')) acted = true;
                else if (upgradeCheapest(e)) acted = true;
            }
        },
    },
];

function run(strategy: Strategy): void {
    const e = createEngine();
    const rows: string[] = [];
    while (e.state.phase === 'build' && e.state.waveIndex < MAX_WAVES) {
        strategy.buy(e);
        const waveNo = e.state.waveIndex + 1;
        const livesBefore = e.state.lives;
        const towerCount = e.state.towers.length;
        const coinsBefore = e.state.coins;
        e.startWave();
        let t = 0;
        while (e.state.phase === 'wave' && t < MAX_WAVE_SECONDS) {
            e.step(DT);
            t += DT;
        }
        if (t >= MAX_WAVE_SECONDS) {
            rows.push(`  wave ${waveNo}: STALLED after ${MAX_WAVE_SECONDS}s (bug or unkillable enemy?)`);
            break;
        }
        const leaked = livesBefore - e.state.lives;
        rows.push(
            `  wave ${String(waveNo).padStart(2)}: ` +
            `lives ${String(e.state.lives).padStart(2)} ` +
            `(leaked ${leaked}) towers ${towerCount} ` +
            `coins ${coinsBefore}->${e.state.coins} ` +
            `cleared in ${t.toFixed(0)}s`
        );
        if (e.state.phase === 'lost') break;
    }
    const outcome =
        e.state.phase === 'lost'
            ? `LOST on wave ${e.state.waveIndex + 1}`
            : `SURVIVED to the sim cap (wave ${MAX_WAVES}) with ${e.state.lives}/${CONFIG.economy.startLives} lives`;
    console.log(`\n${strategy.name}: ${outcome}`);
    for (const r of rows) console.log(r);
}

console.log(`Balance simulation — ${WAVES.length} levels, dt=${DT.toFixed(3)}s`);
for (const s of STRATEGIES) run(s);

console.log('\nReading the results:');
console.log('  - pad0-rush is the strategy the curve is tuned against: clear level 10 comfortably, lose at or before level 80 with no meta upgrades.');
console.log('  - balanced and fox-spam should also clear the onboarding band and hold on for a while into the climb.');
console.log('  - miser must LOSE, ideally around levels 4-6.');

// ---------------------------------------------------------------------------
// Round H Task 7: the threat proofs. Printed as a column so the curve can be
// read at a glance, plus the two structural guarantees asserted in code
// rather than left to hand-tuning.
// ---------------------------------------------------------------------------
console.log('\nThreat curve, levels 1-80 (threat = Σ hp × speed × livesCost / pathLength):');
const threats = WAVES.map((w) => waveThreat(w));
let threatRow = '';
for (let i = 0; i < threats.length; i++) {
    threatRow += `L${String(i + 1).padStart(2)}:${threats[i].toFixed(1).padStart(7)}  `;
    if ((i + 1) % 5 === 0) {
        console.log('  ' + threatRow);
        threatRow = '';
    }
}
if (threatRow) console.log('  ' + threatRow);

let monotonic = true;
for (let i = 1; i < threats.length; i++) {
    if (threats[i] <= threats[i - 1]) {
        monotonic = false;
        console.log(`  ASSERTION FAILED: threat did not increase from level ${i} (${threats[i - 1].toFixed(1)}) to level ${i + 1} (${threats[i].toFixed(1)})`);
    }
}
console.log(monotonic
    ? '  PROVEN: threat is strictly increasing (so non-decreasing) across every level 1-80.'
    : '  NOT PROVEN: see failures above.');

console.log('\nBreather-decade guarantee, levels 21-80 (each decade\'s breather floor must exceed the previous decade\'s breather ceiling):');
function decadeBreatherRange(decadeIndex: number): { floor: number; ceil: number } {
    const start = decadeIndex * 10 + 1; // ones digit 1
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

// ---------------------------------------------------------------------------
// Overtime (81-110) is projected, not simulated — the sim has no notion of
// MetaLevels. Printed here as arithmetic continuation only, clearly labeled.
// ---------------------------------------------------------------------------
console.log('\nOvertime threat projection, levels 81-110 (PROJECTED — not simulated, no meta upgrades modeled here):');
{
    // duplicate of data/waves.ts's private levelThreat(), for reporting only
    const T1 = 13, DECADE_GROWTH = 1.7, BREATHER_FRAC = 0.05, PUSH_FRAC = 0.22, TENSION_BOOST_DECADE_1 = 1.8;
    function isBreather(level: number) { return ((level - 1) % 10) < 5; }
    function levelThreat(level: number): number {
        let t = T1;
        for (let lv = 2; lv <= level; lv++) {
            const d = Math.floor((lv - 1) / 10);
            const boost = d === 1 ? TENSION_BOOST_DECADE_1 : 1;
            t += T1 * Math.pow(DECADE_GROWTH, d) * boost * (isBreather(lv) ? BREATHER_FRAC : PUSH_FRAC);
        }
        return t;
    }
    let row = '';
    for (let level = 81; level <= 110; level++) {
        row += `L${level}:${levelThreat(level).toFixed(0).padStart(6)}  `;
        if (level % 5 === 0) { console.log('  ' + row); row = ''; }
    }
}
