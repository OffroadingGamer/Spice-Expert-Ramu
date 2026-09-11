/**
 * The pure simulation engine: the ENTIRE game state and rules, no Pixi, no
 * React, no DOM. The rendered scene (towerScene.ts) is a view over this, and
 * the headless balance tool (scripts/simulate.ts, `npm run balance`) runs
 * the exact same code fast-forwarded — so what the simulator proves is what
 * the player plays.
 *
 * Determinism: the ONLY randomness is a seeded PRNG (crit rolls), so the
 * same placements + the same step sizes give the same outcome, every time —
 * in the game AND in the simulator.
 */
import { CONFIG } from '../config.ts';
import { enemyDef, type EnemyDef } from '../data/enemies.ts';
import { KNOCKBACK_TIME, makeEffect, type StatusEffect } from '../data/status.ts';
import type { TargetingMode } from '../data/targeting.ts';
import { towerDef, type TowerDef } from '../data/towers.ts';
import { ENTRY_GAP, waveAt, waveThreat } from '../data/waves.ts';
// type-only: the engine stays free of the save/SDK at runtime, so the
// headless balance sim can bundle it for node
import type { MetaLevels } from '../../state/save.ts';

/** No 'won': after the authored waves, endless waves continue until a loss. */
export type TdPhase = 'build' | 'wave' | 'lost';

/** Discrete things that just happened, for the view to render/sound. */
export type EngineEvent =
    | { type: 'shot'; towerId: string }
    | { type: 'beam'; towerId: string; points: { x: number; y: number }[] }
    | { type: 'death' }
    | { type: 'leak' }
    | { type: 'wave-clear'; cleared: number }
    | { type: 'lost' };

export interface EnemyInst {
    uid: number;
    def: EnemyDef;
    /** Distance travelled along the path polyline. */
    dist: number;
    hp: number;
    /** This instance's max hp and walk speed (endless waves scale both). */
    maxHp: number;
    speed: number;
    /** Active status effects (see data/status.ts for the rules). */
    effects: StatusEffect[];
    /** Cached world position for this step (targeting, splash, rendering). */
    x: number;
    y: number;
}

export interface TowerInst {
    padIndex: number;
    def: TowerDef;
    /** 1-based; upgrades push it to def.upgrades.length + 1. */
    level: number;
    cooldown: number;
    damage: number;
    fireRate: number;
    /** Total coins sunk into this tower (purchase + upgrades) — sell basis. */
    spent: number;
    /** Which bug in range to attack; starts at def.targeting, player-changeable. */
    targeting: TargetingMode;
    /** Effective attack radius (base range * meta range bonus). */
    range: number;
    /** Resolved meta-unique stats. */
    critChance: number;
    chains: number;
    splash: number;
    statusDurationBonus: number;
    statusDamageBonus: number;
    knockbackBonus: number;
    x: number;
    y: number;
}

export interface ProjInst {
    uid: number;
    x: number;
    y: number;
    /** Launch point + initial distance, for the view's cosmetic lob arc. */
    sx: number;
    sy: number;
    flight: number;
    arc: boolean;
    targetUid: number;
    towerId: string;
    speed: number;
    damage: number;
    splash: number;
    statusDurationBonus: number;
    statusDamageBonus: number;
    knockbackBonus: number;
}

/** Round I Task 9: Kitchen Actions — the non-tower coin sink. Bought in the
 *  build phase, each applies to the NEXT wave only, then clears itself. */
export type KitchenActionKind = 'freeze' | 'heat' | 'slow';

export interface EngineState {
    phase: TdPhase;
    /** 0-based index of the CURRENT wave (during build: the next one). */
    waveIndex: number;
    coins: number;
    lives: number;
    /** Bugs squashed this run (leaderboard + end screen). */
    kills: number;
    /** Seconds of wave time elapsed this run (leaderboard submit duration). */
    elapsed: number;
    /** Furthest any enemy has travelled this WAVE, as a fraction of
     *  PATH_LENGTH (0-1). Reset at startWave(); scripts/simulate.ts reports
     *  it per level (Round I Task 2/7's "deepest" column). */
    deepestFrac: number;
    enemies: EnemyInst[];
    towers: TowerInst[];
    projectiles: ProjInst[];
    /** Kitchen Actions bought for the wave in progress/about to start. */
    kitchenActions: Record<KitchenActionKind, boolean>;
}

// ---- path geometry ---------------------------------------------------------

const PATH = CONFIG.path;
const segLengths: number[] = [];
const cumLengths: number[] = [0];
for (let i = 0; i < PATH.length - 1; i++) {
    const len = Math.hypot(PATH[i + 1].x - PATH[i].x, PATH[i + 1].y - PATH[i].y);
    segLengths.push(len);
    cumLengths.push(cumLengths[i] + len);
}
export const PATH_LENGTH = cumLengths[cumLengths.length - 1];

// ---- Playtest round, task 4: spawn safe zone -------------------------------

/**
 * Enemies still on the path's FIRST leg (the vertical drop straight out of
 * the burrow) can't be targeted or splash-damaged — a device playtest found
 * towers camping the spawn point trivializing the run. Derived from
 * CONFIG.path's own first segment length, never a hardcoded distance: the
 * belt geometry has already moved once this project (Round I Task 7).
 */
const SPAWN_SAFE_ZONE_LEN = segLengths[0];

// ---- Round I Task 1: splash distance falloff -------------------------------

/** Linear falloff from the impact point: 1 (100%) at dist=0, down to
 *  (1 - SPLASH_FALLOFF) at the rim (dist=splash). Was flat 1 everywhere
 *  (Round H finding: a maxed Tandoor's splash caught ~6 enemies per shot at
 *  full damage each). Tuned against Task 8's acceptance criteria alongside
 *  the curve; see the balance report for the final value. */
const SPLASH_FALLOFF = 0.95;

// ---- Round I Task 9: Kitchen Actions (the coin sink) -----------------------

/** Turn Up The Heat's burn recipe — a fixed, tower-independent DoT applied
 *  on top of (or instead of) whatever the hitting tower already inflicts. */
const HEAT_BURN = { type: 'burn' as const, tickDamage: 4, tickEvery: 0.5, duration: 2 };

/** cost = round(base * threat(level) / threat(10)) — docs/LevelBlocks.md
 *  §12: a flat price lets a late-game coin pile buy the whole system out;
 *  scaling with the SAME threat curve the enemies scale by keeps a purchase
 *  costing a comparable share of income at level 20 and at level 80. */
const REF_THREAT_L10 = waveThreat(waveAt(9));
export function kitchenActionCost(kind: KitchenActionKind, level: number): number {
    const base = CONFIG.economy.kitchenActions[
        kind === 'freeze' ? 'freezeBase' : kind === 'heat' ? 'heatBase' : 'slowBase'
    ];
    return Math.round((base * waveThreat(waveAt(level - 1))) / REF_THREAT_L10);
}

/** World position at a distance along the path (clamped to the ends). */
export function posAt(dist: number): { x: number; y: number } {
    if (dist <= 0) return { ...PATH[0] };
    if (dist >= PATH_LENGTH) return { ...PATH[PATH.length - 1] };
    let i = 0;
    while (dist > cumLengths[i + 1]) i++;
    const t = (dist - cumLengths[i]) / segLengths[i];
    return {
        x: PATH[i].x + (PATH[i + 1].x - PATH[i].x) * t,
        y: PATH[i].y + (PATH[i + 1].y - PATH[i].y) * t,
    };
}

// ---- the engine ------------------------------------------------------------

export interface Engine {
    state: EngineState;
    /** Place a tower on an empty pad. False if occupied/unaffordable. */
    placeTower(padIndex: number, towerId: string): boolean;
    /** Buy the pad's tower's next upgrade. False if maxed/unaffordable/empty. */
    upgradeTower(padIndex: number): boolean;
    /**
     * Sell the pad's tower for CONFIG.economy.sellRefund of its total spend
     * (rounded down). False if the pad is empty or the run is over.
     */
    sellTower(padIndex: number): boolean;
    /** Change the pad's tower's targeting mode. False if the pad is empty. */
    setTargeting(padIndex: number, mode: TargetingMode): boolean;
    /**
     * Buy a Kitchen Action for the wave about to start (build phase only).
     * False if already bought this wave, unaffordable, or mid-wave.
     */
    buyKitchenAction(kind: KitchenActionKind): boolean;
    /** Begin the next wave (build phase only). */
    startWave(): boolean;
    /** Advance the simulation. Call with small dt (the view clamps to 50ms). */
    step(dt: number): void;
    /**
     * Return and clear the events accumulated since the last drain (the view
     * drains once per FRAME, after all speed substeps). The headless sim
     * never drains; the array just grows harmlessly for its short life.
     */
    drainEvents(): EngineEvent[];
}

/**
 * @param meta persistent per-tower upgrade levels (main-menu gems shop).
 *             Omit for the base game — `npm run balance` does, on purpose,
 *             so it always verifies what a brand-new player faces.
 */
export function createEngine(meta: MetaLevels = {}): Engine {
    const state: EngineState = {
        phase: 'build',
        waveIndex: 0,
        coins: CONFIG.economy.startCoins,
        lives: CONFIG.economy.startLives,
        kills: 0,
        elapsed: 0,
        deepestFrac: 0,
        enemies: [],
        towers: [],
        projectiles: [],
        kitchenActions: { freeze: false, heat: false, slow: false },
    };

    let nextUid = 1;
    const events: EngineEvent[] = [];
    // Round I Task 4: wave-spawning bookkeeping — one cursor PER ENTRY (was
    // one cursor for the whole wave, advancing to the next entry only after
    // the current one's full count had spawned: a wave could never occupy
    // more than one entry's worth of the belt at a time). Every entry now
    // has its own startAt (seconds from wave start) and spawns independently
    // on its own spacing once that time passes, so e.g. a W3 (beetle+wasp)
    // can have both types on the belt together. Entries without an explicit
    // startAt default to starting right after the previous entry's own
    // start-plus-duration (+ the old ENTRY_GAP) — Round H's sequential
    // behaviour, preserved as the fallback so nothing regresses by omission.
    let waveElapsed = 0;
    let entryCursors: { spawned: number; nextAt: number }[] = [];

    // Deterministic PRNG (mulberry32) for crit rolls: fixed seed, so a run
    // with identical inputs replays identically, in the game and the sim.
    let rngState = 0x9e3779b9;
    function rng(): number {
        rngState |= 0;
        rngState = (rngState + 0x6d2b79f5) | 0;
        let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    function applyLevel(t: TowerInst): void {
        let damage = t.def.damage;
        let fireRate = t.def.fireRate;
        for (let i = 0; i < t.level - 1; i++) {
            damage *= t.def.upgrades[i].damageMult;
            fireRate *= t.def.upgrades[i].fireRateMult;
        }
        // persistent meta upgrades multiply on top of in-run levels
        const m = meta[t.def.id];
        if (m) {
            damage *= 1 + m.damage * CONFIG.meta.damagePerLevel;
            fireRate *= 1 + m.speed * CONFIG.meta.speedPerLevel;
        }
        // gold pad bonus, if this tower stands on one
        const padBonus = CONFIG.pads[t.padIndex].bonus;
        if (padBonus?.stat === 'damage') damage *= padBonus.mult;
        if (padBonus?.stat === 'fireRate') fireRate *= padBonus.mult;
        t.damage = damage;
        t.fireRate = fireRate;
        t.range =
            t.def.range *
            (1 + (m?.range ?? 0) * CONFIG.meta.rangePerLevel) *
            (padBonus?.stat === 'range' ? padBonus.mult : 1);
        // the tower's signature meta track
        const uniqueLevel = m?.unique ?? 0;
        const u = t.def.metaUnique;
        t.critChance = u.kind === 'crit' ? uniqueLevel * u.perLevel : 0;
        t.chains =
            (t.def.attack.kind === 'beam' ? t.def.attack.chains : 0) +
            (u.kind === 'chains' ? uniqueLevel * u.perLevel : 0);
        t.splash =
            (t.def.attack.kind === 'projectile' ? t.def.attack.splash : 0) +
            (u.kind === 'splash' ? uniqueLevel * u.perLevel : 0);
        t.statusDurationBonus = u.kind === 'status-duration' ? uniqueLevel * u.perLevel : 0;
        t.statusDamageBonus = u.kind === 'status-damage' ? uniqueLevel * u.perLevel : 0;
        t.knockbackBonus = u.kind === 'knockback' ? uniqueLevel * u.perLevel : 0;
    }

    function spawnEnemy(id: string, hpMult: number, speedMult: number): void {
        const def = enemyDef(id);
        const pos = posAt(0);
        const e: EnemyInst = {
            uid: nextUid++,
            def,
            dist: 0,
            hp: def.hp * hpMult,
            maxHp: def.hp * hpMult,
            speed: def.speed * speedMult,
            effects: [],
            x: pos.x,
            y: pos.y,
        };
        state.enemies.push(e);
        // Round I Task 9: Deep Freeze / Slow Service apply at ARRIVAL, to
        // every enemy the wave spawns while bought — a board-wide effect
        // via the existing status pipeline (data/status.ts), no new system.
        if (state.kitchenActions.freeze) {
            applyInflict(e, { type: 'frozen', duration: 2 }, 0, 0, 0);
        }
        if (state.kitchenActions.slow) {
            applyInflict(e, { type: 'slow', factor: 0.6, duration: 4 }, 0, 0, 0);
        }
    }

    /** Build this wave's per-entry cursors: each entry's start time (its own
     *  startAt, or — Task 4's default — right after the previous entry's
     *  own start plus its full spawn duration and the legacy ENTRY_GAP). */
    function buildEntryCursors(wave: ReturnType<typeof waveAt>): { spawned: number; nextAt: number }[] {
        let cursor = 0;
        return wave.entries.map((entry) => {
            const startAt = entry.startAt ?? cursor;
            cursor = startAt + entry.count * entry.spacing + ENTRY_GAP;
            return { spawned: 0, nextAt: startAt };
        });
    }

    function stepSpawning(dt: number): void {
        const wave = waveAt(state.waveIndex);
        waveElapsed += dt;
        for (let i = 0; i < wave.entries.length; i++) {
            const entry = wave.entries[i];
            const cur = entryCursors[i];
            if (!cur || cur.spawned >= entry.count) continue;
            if (waveElapsed < cur.nextAt) continue;
            spawnEnemy(entry.enemy, entry.hpMult ?? wave.hpMult ?? 1, entry.speedMult ?? wave.speedMult ?? 1);
            cur.spawned++;
            cur.nextAt = waveElapsed + entry.spacing;
        }
    }

    function damageEnemy(e: EnemyInst, amount: number): void {
        e.hp -= amount; // corpses are collected (and paid for) after the combat pass
    }

    /**
     * Apply a tower's status recipe to one bug. Knockback becomes a brief
     * backward slide (the shove reads as motion, not a teleport); lasting
     * effects replace same-type instances, and burn and poison evict each
     * other (one DoT slot — see data/status.ts).
     */
    function applyInflict(
        e: EnemyInst,
        recipe: NonNullable<TowerDef['status']>,
        durationBonus: number,
        damageBonus: number,
        knockbackBonus: number
    ): void {
        if (recipe.type === 'knockback') {
            const shove: StatusEffect = {
                type: 'knockback',
                remaining: KNOCKBACK_TIME,
                speed: (recipe.distance + knockbackBonus) / KNOCKBACK_TIME,
            };
            const kbIdx = e.effects.findIndex((s) => s.type === 'knockback');
            if (kbIdx >= 0) e.effects[kbIdx] = shove;
            else e.effects.push(shove);
            return;
        }
        const effect = makeEffect(recipe, durationBonus, damageBonus);
        if (effect.type === 'burn' || effect.type === 'poison') {
            const rival = effect.type === 'burn' ? 'poison' : 'burn';
            const rivalIdx = e.effects.findIndex((s) => s.type === rival);
            if (rivalIdx >= 0) e.effects.splice(rivalIdx, 1);
        }
        const idx = e.effects.findIndex((s) => s.type === effect.type);
        if (idx >= 0) e.effects[idx] = effect;
        else e.effects.push(effect);
    }

    function inflict(e: EnemyInst, t: TowerInst): void {
        if (!t.def.status) return;
        applyInflict(e, t.def.status, t.statusDurationBonus, t.statusDamageBonus, t.knockbackBonus);
    }

    /** Movement speed multiplier from active effects (frozen wins outright). */
    function speedFactor(e: EnemyInst): number {
        let factor = 1;
        for (const s of e.effects) {
            if (s.type === 'frozen') return 0;
            if (s.type === 'slow') factor = Math.min(factor, s.factor);
        }
        return factor;
    }

    /** Tick effect timers: poison damage, expiry. */
    function stepEffects(e: EnemyInst, dt: number): void {
        for (let i = e.effects.length - 1; i >= 0; i--) {
            const s = e.effects[i];
            s.remaining -= dt;
            if (s.type === 'poison' || s.type === 'burn') {
                s.tickIn -= dt;
                while (s.tickIn <= 0) {
                    damageEnemy(e, s.tickDamage);
                    s.tickIn += s.tickEvery;
                }
            }
            if (s.remaining <= 0) e.effects.splice(i, 1);
        }
    }

    /**
     * True if `e` beats the incumbent `best` under the tower's targeting
     * mode (see data/targeting.ts for semantics). Ties prefer the bug
     * furthest along the path, so equal candidates still threaten leaks
     * least.
     */
    function beats(mode: TargetingMode, t: TowerInst, e: EnemyInst, best: EnemyInst): boolean {
        switch (mode) {
            case 'first': return e.dist > best.dist;
            case 'last': return e.dist < best.dist;
            case 'closest': {
                const de = Math.hypot(e.x - t.x, e.y - t.y);
                const db = Math.hypot(best.x - t.x, best.y - t.y);
                return de < db || (de === db && e.dist > best.dist);
            }
            case 'strongest':
                return e.def.hp > best.def.hp || (e.def.hp === best.def.hp && e.dist > best.dist);
            case 'weakest':
                return e.def.hp < best.def.hp || (e.def.hp === best.def.hp && e.dist > best.dist);
            case 'highest-hp':
                return e.hp > best.hp || (e.hp === best.hp && e.dist > best.dist);
            case 'lowest-hp':
                return e.hp < best.hp || (e.hp === best.hp && e.dist > best.dist);
        }
    }

    function pickTarget(t: TowerInst, enemies: EnemyInst[]): EnemyInst | null {
        let best: EnemyInst | null = null;
        for (const e of enemies) {
            if (e.dist < SPAWN_SAFE_ZONE_LEN) continue;
            if (Math.hypot(e.x - t.x, e.y - t.y) > t.range) continue;
            if (!best || beats(t.targeting, t, e, best)) best = e;
        }
        return best;
    }

    /** Roll damage with the tower's crit chance (crits do 2x). */
    function rollDamage(t: TowerInst): number {
        return t.critChance > 0 && rng() < t.critChance ? t.damage * 2 : t.damage;
    }

    /** Beam attack: hit the target, then chain to nearby unhit bugs. */
    function fireBeam(t: TowerInst, target: EnemyInst): void {
        if (t.def.attack.kind !== 'beam') return;
        const falloff = t.def.attack.chainFalloff;
        const chainRange = t.def.attack.chainRange;
        const hit: EnemyInst[] = [target];
        let last = target;
        for (let hop = 0; hop < t.chains; hop++) {
            let next: EnemyInst | null = null;
            let bestDist = Infinity;
            for (const e of state.enemies) {
                if (hit.includes(e)) continue;
                if (e.dist < SPAWN_SAFE_ZONE_LEN) continue;
                const d = Math.hypot(e.x - last.x, e.y - last.y);
                if (d <= chainRange && d < bestDist) {
                    bestDist = d;
                    next = e;
                }
            }
            if (!next) break;
            hit.push(next);
            last = next;
        }
        for (let i = 0; i < hit.length; i++) {
            damageEnemy(hit[i], rollDamage(t) * Math.pow(falloff, i));
            inflict(hit[i], t);
            // Round I Task 9: Turn Up The Heat — every tower hit applies
            // burn for the wave it's bought, independent of the tower's own
            // status recipe (a beam tower with no status of its own still
            // burns everything it touches while this is active).
            if (state.kitchenActions.heat) {
                applyInflict(hit[i], HEAT_BURN, 0, 0, 0);
            }
        }
        events.push({
            type: 'beam',
            towerId: t.def.id,
            points: [{ x: t.x, y: t.y - 30 }, ...hit.map((e) => ({ x: e.x, y: e.y }))],
        });
    }

    function step(dt: number): void {
        if (state.phase !== 'wave') return;
        state.elapsed += dt;

        stepSpawning(dt);

        // enemies walk (status-modified); leaks cost lives. A bug being
        // shoved slides backward instead of advancing.
        for (let i = state.enemies.length - 1; i >= 0; i--) {
            const e = state.enemies[i];
            stepEffects(e, dt);
            const shove = e.effects.find((s) => s.type === 'knockback');
            if (shove && shove.type === 'knockback') {
                e.dist = Math.max(0, e.dist - shove.speed * dt);
            } else {
                e.dist += e.speed * speedFactor(e) * dt;
            }
            if (e.dist >= PATH_LENGTH) {
                state.deepestFrac = 1;
                state.enemies.splice(i, 1);
                state.lives -= e.def.livesCost;
                events.push({ type: 'leak' });
                continue;
            }
            const pos = posAt(e.dist);
            e.x = pos.x;
            e.y = pos.y;
            const frac = e.dist / PATH_LENGTH;
            if (frac > state.deepestFrac) state.deepestFrac = frac;
        }
        if (state.lives <= 0) {
            state.lives = 0;
            state.phase = 'lost';
            events.push({ type: 'lost' });
            return;
        }

        // towers fire at the in-range bug their targeting mode prefers
        for (const t of state.towers) {
            t.cooldown -= dt;
            if (t.cooldown > 0) continue;
            const target = pickTarget(t, state.enemies);
            if (!target) continue;
            t.cooldown = 1 / t.fireRate;
            if (t.def.attack.kind === 'beam') {
                fireBeam(t, target);
                continue;
            }
            events.push({ type: 'shot', towerId: t.def.id });
            const launchX = t.x;
            const launchY = t.y - 30; // leaves from the tower's paws, roughly
            state.projectiles.push({
                uid: nextUid++,
                x: launchX,
                y: launchY,
                sx: launchX,
                sy: launchY,
                flight: Math.hypot(target.x - launchX, target.y - launchY),
                arc: t.def.attack.arc ?? false,
                targetUid: target.uid,
                towerId: t.def.id,
                speed: t.def.attack.projSpeed,
                damage: rollDamage(t),
                splash: t.splash,
                statusDurationBonus: t.statusDurationBonus,
                statusDamageBonus: t.statusDamageBonus,
                knockbackBonus: t.knockbackBonus,
            });
        }

        // projectiles home in; hits apply damage, splash, and statuses
        for (let i = state.projectiles.length - 1; i >= 0; i--) {
            const p = state.projectiles[i];
            const target = state.enemies.find((e) => e.uid === p.targetUid);
            if (!target) {
                state.projectiles.splice(i, 1);
                continue;
            }
            const dx = target.x - p.x;
            const dy = target.y - p.y;
            const dist = Math.hypot(dx, dy);
            const step_ = p.speed * dt;
            if (dist <= Math.max(step_, 12)) {
                // hit
                const def = towerDef(p.towerId);
                // Round I Task 1: splash used to deal FULL damage to every
                // enemy in radius (measured: a maxed Tandoor's 170-unit
                // splash caught ~6 enemies per shot at level-80 spacing —
                // ~770 effective DPS from one tower, making density the
                // defender's damage stat). Now linear falloff from the
                // impact point: 100% at dist=0, (1-FALLOFF) at the rim. The
                // struck target itself always takes full damage regardless
                // of the formula (dist=0 there always resolves to 1 anyway,
                // this just avoids float noise).
                if (p.splash > 0) {
                    for (const v of state.enemies) {
                        if (v.dist < SPAWN_SAFE_ZONE_LEN) continue;
                        const d = Math.hypot(v.x - target.x, v.y - target.y);
                        if (d > p.splash) continue;
                        const factor = v === target ? 1 : Math.max(0, 1 - SPLASH_FALLOFF * (d / p.splash));
                        damageEnemy(v, p.damage * factor);
                        if (def.status) {
                            applyInflict(v, def.status, p.statusDurationBonus, p.statusDamageBonus, p.knockbackBonus);
                        }
                        if (state.kitchenActions.heat) applyInflict(v, HEAT_BURN, 0, 0, 0);
                    }
                } else {
                    damageEnemy(target, p.damage);
                    if (def.status) {
                        applyInflict(target, def.status, p.statusDurationBonus, p.statusDamageBonus, p.knockbackBonus);
                    }
                    if (state.kitchenActions.heat) applyInflict(target, HEAT_BURN, 0, 0, 0);
                }
                state.projectiles.splice(i, 1);
            } else {
                p.x += (dx / dist) * step_;
                p.y += (dy / dist) * step_;
            }
        }

        // deaths pay bounties. Round H Task 5: enemies.ts is sealed this
        // round, so the level-11+ income cut is a multiplier applied here
        // rather than a stat change — bounty is the dominant income source
        // once wave sizes grow, so this (not just waveBonus below) is what
        // keeps coins a live constraint at higher levels.
        const level = state.waveIndex + 1;
        const bountyMult = level < CONFIG.economy.lateEconomy.fromLevel ? 1 : CONFIG.economy.lateEconomy.bountyMult;
        for (let i = state.enemies.length - 1; i >= 0; i--) {
            if (state.enemies[i].hp <= 0) {
                state.coins += Math.round(state.enemies[i].def.bounty * bountyMult);
                state.kills++;
                events.push({ type: 'death' });
                state.enemies.splice(i, 1);
            }
        }

        // wave over? There is no win: after the authored levels, Overtime
        // keeps coming (data/waves.ts waveAt).
        const wave = waveAt(state.waveIndex);
        const doneSpawning = entryCursors.every((c, i) => c.spawned >= wave.entries[i].count);
        if (doneSpawning && state.enemies.length === 0) {
            state.projectiles.length = 0;
            state.coins +=
                level < CONFIG.economy.lateEconomy.fromLevel
                    ? CONFIG.economy.waveBonus
                    : CONFIG.economy.lateEconomy.waveBonus;
            // Round I Task 8: Round H's level<=5 life restore is retired —
            // "made losing impossible but the tension fake" (the user's own
            // words, docs/LevelBlocks.md §6b). Leaks now cost real lives from
            // level 1 on; block 1's sweet spot (a competent build finishes
            // around 5-8/10 lives, miser still dies ~4-8) is tuned through
            // composition and block 1's teaching-boss hpMult instead of a
            // restore — see data/waves.ts.
            state.kitchenActions = { freeze: false, heat: false, slow: false };
            state.waveIndex++;
            state.phase = 'build';
            events.push({ type: 'wave-clear', cleared: state.waveIndex });
        }
    }

    return {
        state,
        placeTower(padIndex, towerId) {
            if (state.phase === 'lost') return false;
            if (state.towers.some((t) => t.padIndex === padIndex)) return false;
            const def = towerDef(towerId);
            if (state.coins < def.cost) return false;
            state.coins -= def.cost;
            const pad = CONFIG.pads[padIndex];
            const t: TowerInst = {
                padIndex,
                def,
                level: 1,
                cooldown: 0,
                damage: def.damage,
                fireRate: def.fireRate,
                spent: def.cost,
                targeting: def.targeting,
                range: def.range,
                critChance: 0,
                chains: 0,
                splash: 0,
                statusDurationBonus: 0,
                statusDamageBonus: 0,
                knockbackBonus: 0,
                x: pad.x,
                y: pad.y,
            };
            applyLevel(t);
            state.towers.push(t);
            return true;
        },
        upgradeTower(padIndex) {
            if (state.phase === 'lost') return false;
            const t = state.towers.find((tw) => tw.padIndex === padIndex);
            if (!t) return false;
            if (t.level > t.def.upgrades.length) return false;
            const cost = t.def.upgrades[t.level - 1].cost;
            if (state.coins < cost) return false;
            state.coins -= cost;
            t.spent += cost;
            t.level++;
            applyLevel(t);
            return true;
        },
        sellTower(padIndex) {
            if (state.phase === 'lost') return false;
            const idx = state.towers.findIndex((tw) => tw.padIndex === padIndex);
            if (idx < 0) return false;
            state.coins += Math.floor(state.towers[idx].spent * CONFIG.economy.sellRefund);
            state.towers.splice(idx, 1);
            return true;
        },
        setTargeting(padIndex, mode) {
            const t = state.towers.find((tw) => tw.padIndex === padIndex);
            if (!t) return false;
            t.targeting = mode;
            return true;
        },
        startWave() {
            if (state.phase !== 'build') return false;
            state.phase = 'wave';
            state.deepestFrac = 0;
            waveElapsed = 0;
            entryCursors = buildEntryCursors(waveAt(state.waveIndex));
            return true;
        },
        buyKitchenAction(kind) {
            if (state.phase !== 'build') return false;
            if (state.kitchenActions[kind]) return false; // already bought this wave
            const cost = kitchenActionCost(kind, state.waveIndex + 1);
            if (state.coins < cost) return false;
            state.coins -= cost;
            state.kitchenActions[kind] = true;
            return true;
        },
        step,
        drainEvents() {
            return events.splice(0, events.length);
        },
    };
}
