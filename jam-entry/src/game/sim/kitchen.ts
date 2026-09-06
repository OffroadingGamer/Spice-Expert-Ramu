/**
 * TEST MODE ONLY — the belt's pure simulation. No Pixi, no React, no store,
 * no leaderboard: this measures one thing (does the 1,600-unit serpentine
 * belt read as runway or as waiting) and nothing else. Mirrors the shape of
 * sim/engine.ts (state + step + drained events) but is otherwise
 * independent — it never imports config.ts or engine.ts.
 */
import { KITCHEN_CONFIG } from '../kitchenConfig.ts';

export type KitchenPhase = 'running' | 'won' | 'lost';

export interface DishInst {
    uid: number;
    /** Distance travelled along beltPath. */
    dist: number;
    x: number;
    y: number;
}

export interface KitchenState {
    phase: KitchenPhase;
    dishes: DishInst[];
    /** Dishes spawned so far this session (of KITCHEN_CONFIG.shiftDishCount). */
    spawned: number;
    served: number;
    walkouts: number;
    elapsed: number;
}

export type KitchenEvent =
    | { type: 'served' }
    | { type: 'walkout' }
    | { type: 'won' }
    | { type: 'lost' };

export interface KitchenSim {
    state: KitchenState;
    /** Tap station slot `slotIndex` — serves the nearest in-reach dish, if any. */
    tapSlot(slotIndex: number): void;
    step(dt: number): void;
    drainEvents(): KitchenEvent[];
}

// ---- belt path geometry (same polyline-walk approach as sim/engine.ts) ----

const PATH = KITCHEN_CONFIG.beltPath;
const segLengths: number[] = [];
const cumLengths: number[] = [0];
for (let i = 0; i < PATH.length - 1; i++) {
    const len = Math.hypot(PATH[i + 1].x - PATH[i].x, PATH[i + 1].y - PATH[i].y);
    segLengths.push(len);
    cumLengths.push(cumLengths[i] + len);
}
export const BELT_LENGTH = cumLengths[cumLengths.length - 1];

function posAt(dist: number): { x: number; y: number } {
    if (dist <= 0) return { ...PATH[0] };
    if (dist >= BELT_LENGTH) return { ...PATH[PATH.length - 1] };
    let i = 0;
    while (dist > cumLengths[i + 1]) i++;
    const t = (dist - cumLengths[i]) / segLengths[i];
    return {
        x: PATH[i].x + (PATH[i + 1].x - PATH[i].x) * t,
        y: PATH[i].y + (PATH[i + 1].y - PATH[i].y) * t,
    };
}

export function createKitchenSim(): KitchenSim {
    const state: KitchenState = {
        phase: 'running',
        dishes: [],
        spawned: 0,
        served: 0,
        walkouts: 0,
        elapsed: 0,
    };

    let nextUid = 1;
    let spawnTimer = 0;
    const events: KitchenEvent[] = [];

    function spawnIfDue(dt: number): void {
        if (state.spawned >= KITCHEN_CONFIG.shiftDishCount) return;
        spawnTimer -= dt;
        if (spawnTimer > 0) return;
        spawnTimer = KITCHEN_CONFIG.spawnInterval;
        const pos = posAt(0);
        state.dishes.push({ uid: nextUid++, dist: 0, x: pos.x, y: pos.y });
        state.spawned++;
    }

    function checkShiftEnd(): void {
        if (state.phase !== 'running') return;
        if (state.spawned >= KITCHEN_CONFIG.shiftDishCount && state.dishes.length === 0) {
            state.phase = 'won';
            events.push({ type: 'won' });
        }
    }

    return {
        state,
        tapSlot(slotIndex) {
            if (state.phase !== 'running') return;
            const slot = KITCHEN_CONFIG.slots[slotIndex];
            if (!slot) return;
            let bestIdx = -1;
            let bestDist: number = KITCHEN_CONFIG.slotReach;
            for (let i = 0; i < state.dishes.length; i++) {
                const d = state.dishes[i];
                const dist = Math.hypot(d.x - slot.x, d.y - slot.y);
                if (dist <= bestDist) {
                    bestDist = dist;
                    bestIdx = i;
                }
            }
            if (bestIdx < 0) return;
            state.dishes.splice(bestIdx, 1);
            state.served++;
            events.push({ type: 'served' });
            checkShiftEnd();
        },
        step(dt) {
            if (state.phase !== 'running') return;
            state.elapsed += dt;
            spawnIfDue(dt);
            for (let i = state.dishes.length - 1; i >= 0; i--) {
                const d = state.dishes[i];
                d.dist += KITCHEN_CONFIG.beltSpeed * dt;
                if (d.dist >= BELT_LENGTH) {
                    state.dishes.splice(i, 1);
                    state.walkouts++;
                    events.push({ type: 'walkout' });
                    continue;
                }
                const pos = posAt(d.dist);
                d.x = pos.x;
                d.y = pos.y;
            }
            if (state.walkouts >= KITCHEN_CONFIG.walkoutsAllowed) {
                state.phase = 'lost';
                events.push({ type: 'lost' });
                return;
            }
            checkShiftEnd();
        },
        drainEvents() {
            return events.splice(0, events.length);
        },
    };
}
