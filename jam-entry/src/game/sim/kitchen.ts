/**
 * TEST MODE ONLY — the belt's pure simulation. No Pixi, no React, no store,
 * no leaderboard: this measures one thing (does the 1,600-unit serpentine
 * belt read as runway or as waiting) and nothing else. Mirrors the shape of
 * sim/engine.ts (state + step + drained events) but is otherwise
 * independent — it never imports config.ts or engine.ts.
 *
 * Round 8: the recipe gate. `held` counts ingredients picked up and not yet
 * spent; a tap that completes a full set (one of every KITCHEN_CONFIG.
 * recipe.ingredients key) consumes exactly one of each and increments
 * `completed` — the first gameplay clause this belt has ever enforced, per
 * KitchenMode §6.3. `served` keeps its original meaning (ingredients picked
 * up) and is not repurposed. The belt also gained a speed ramp tied to
 * `completed` (see `currentSpeed`/`beltRamp` below) — dishes already in
 * flight accelerate too, since `state.beltSpeed` is recomputed every tick.
 *
 * Round 9: the round now ends at `shiftChaiTarget` COMPLETIONS, not at a
 * spawn count — `checkShiftEnd` no longer waits for the belt to empty, so
 * dishes still in flight when the target lands are simply abandoned.
 * Spawning itself is now open-ended, capped only by `maxSpawns` as a safety
 * net. The coin economy (wallet, coinsEarned, slot locks, prop cooldown) is
 * NOT tracked here — this sim knows nothing about props or slots being
 * placed/locked, so kitchenScene.ts owns all of that state and derives it
 * from this module's events ('served'/'completed'/'walkout') exactly as it
 * already derives SFX cues from them.
 */
import { KITCHEN_CONFIG } from '../kitchenConfig.ts';

export type KitchenPhase = 'running' | 'won' | 'lost';

export interface DishInst {
    uid: number;
    /** Distance travelled along beltPath. */
    dist: number;
    x: number;
    y: number;
    /** Which KITCHEN_CONFIG.ingredientKinds[].key this belt item carries. */
    kind: string;
}

export interface KitchenState {
    phase: KitchenPhase;
    dishes: DishInst[];
    /** Dishes spawned so far this session (of KITCHEN_CONFIG.maxSpawns — a
     *  safety cap, not the win condition; see `completed`/shiftChaiTarget). */
    spawned: number;
    served: number;
    walkouts: number;
    elapsed: number;
    /** Round 8: ingredients picked up and not yet spent, keyed by
     *  ingredientKinds[].key. Every key initialised to 0 at sim creation —
     *  never undefined. Surplus carries over during the shift. Round 9:
     *  whatever remains here at shift end is scored (kitchenConfig.ts's
     *  `hats.perLeftover`) but converts to no currency — that system still
     *  doesn't exist. Not consumed or reset by this module; the frozen
     *  final `held` is what the caller sums for both the hats formula and
     *  the end screen's diagnostic count. */
    held: Record<string, number>;
    /** Round 8: completed dishes this shift. NOT the same as `served`. */
    completed: number;
    /** Round 8: the belt's current design-unit speed, derived from
     *  `completed` every tick (see `currentSpeed`) — read by kitchenScene.ts,
     *  never written outside this module. */
    beltSpeed: number;
}

export type KitchenEvent =
    | { type: 'served' }
    | { type: 'completed' }
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

/**
 * Round 8, task 3: the belt speed ramp. Expressed as a traverse-seconds
 * target (KITCHEN_CONFIG.beltRamp), never a typed speed constant, so the
 * 🛑 lock on kitchenConfig.ts's beltPath/beltSpeed pair still holds — see
 * that file's comments. `completed` (not `served`) drives the ramp: it's
 * the count of the thing the player actually accomplished.
 */
function currentSpeed(completed: number): number {
    const t = Math.max(
        KITCHEN_CONFIG.beltRamp.minTraverse,
        KITCHEN_CONFIG.beltRamp.baseTraverse
            - KITCHEN_CONFIG.beltRamp.perCompletion * completed,
    );
    return BELT_LENGTH / t;
}

// Dev-time check: kitchenConfig.ts's beltSpeed must equal the ramp's own
// opening value, or the 🛑 lock's "not a tuning choice" claim would be lying
// about which number is actually load-bearing.
{
    const expectedOpening = BELT_LENGTH / KITCHEN_CONFIG.beltRamp.baseTraverse;
    if (Math.abs(expectedOpening - KITCHEN_CONFIG.beltSpeed) > 0.01) {
        console.warn(
            `[kitchen] beltSpeed (${KITCHEN_CONFIG.beltSpeed}) does not match ` +
            `BELT_LENGTH / beltRamp.baseTraverse (${expectedOpening}) — see the ` +
            `🛑 lock in kitchenConfig.ts.`
        );
    }
}

/**
 * Round 6, task 2: props may only interact with a dish on the belt's three
 * "working" segments — run 1, the drop, run 2 — never on the two fridge
 * connector stubs (segment 0, out of the fridge; the last segment, into it),
 * where a dish is in transit and untouchable however close a slot sits.
 * Derived from beltPath's own cumulative lengths at runtime (segment 1's
 * start through the second-to-last segment's start) rather than pasted, so
 * this stays correct if the path ever changes again. With the current
 * 6-point path that resolves to dist ∈ [176, 1776) of 1952.
 */
const ELIGIBLE_DIST_MIN = cumLengths[1];
const ELIGIBLE_DIST_MAX = cumLengths[cumLengths.length - 2];
export function isEligibleDist(dist: number): boolean {
    return dist >= ELIGIBLE_DIST_MIN && dist < ELIGIBLE_DIST_MAX;
}

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

/**
 * Bag shuffle (Fisher-Yates), refilled only when empty: every kind is dealt
 * exactly once per lap, so the longest possible drought between two spawns
 * of the same kind is 2n-2, and a repeat can only land across a bag
 * boundary. Plain Math.random() per spawn would allow both long droughts
 * and back-to-back triples — the property the handover asked for.
 */
function makeBag(): () => string {
    const kinds = KITCHEN_CONFIG.ingredientKinds.map((k) => k.key);
    let bag: string[] = [];
    return () => {
        if (bag.length === 0) {
            bag = [...kinds];
            for (let i = bag.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [bag[i], bag[j]] = [bag[j], bag[i]];
            }
        }
        return bag.pop()!;
    };
}

export function createKitchenSim(): KitchenSim {
    const held: Record<string, number> = {};
    for (const k of KITCHEN_CONFIG.ingredientKinds) held[k.key] = 0;

    const state: KitchenState = {
        phase: 'running',
        dishes: [],
        spawned: 0,
        served: 0,
        walkouts: 0,
        elapsed: 0,
        held,
        completed: 0,
        beltSpeed: currentSpeed(0),
    };

    let nextUid = 1;
    let spawnTimer = 0;
    const events: KitchenEvent[] = [];
    const drawKind = makeBag();

    function spawnIfDue(dt: number): void {
        // Round 9, task 1: gates on the safety cap only — the win condition
        // is `completed`, not spawn count, so spawning runs open-ended
        // until checkShiftEnd fires.
        if (state.spawned >= KITCHEN_CONFIG.maxSpawns) return;
        spawnTimer -= dt;
        if (spawnTimer > 0) return;
        spawnTimer = KITCHEN_CONFIG.spawnInterval;
        const pos = posAt(0);
        state.dishes.push({ uid: nextUid++, dist: 0, x: pos.x, y: pos.y, kind: drawKind() });
        state.spawned++;
    }

    function checkShiftEnd(): void {
        if (state.phase !== 'running') return;
        // Round 9, task 1: the round ends the instant the target is hit —
        // dishes still on the belt are simply abandoned, not waited out.
        if (state.completed >= KITCHEN_CONFIG.shiftChaiTarget) {
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
                // Round 6, task 2: ineligible-segment dishes (the fridge
                // connector stubs) are never a valid tap target, however
                // close — gate on segment, not distance.
                if (!isEligibleDist(d.dist)) continue;
                const dist = Math.hypot(d.x - slot.x, d.y - slot.y);
                if (dist <= bestDist) {
                    bestDist = dist;
                    bestIdx = i;
                }
            }
            if (bestIdx < 0) return;
            const [d] = state.dishes.splice(bestIdx, 1);
            state.held[d.kind]++;
            state.served++;
            events.push({ type: 'served' });

            const recipe = KITCHEN_CONFIG.recipe.ingredients;
            // Write a single if, never a while, and keep this comment: one
            // tap adds exactly 1 to exactly one counter, and completion is
            // checked-and-consumed on every tap, so at most one set can ever
            // newly complete per tap. If a while loop would ever iterate
            // twice, the state has already gone wrong and the loop would
            // hide it.
            if (recipe.every((k) => state.held[k] > 0)) {
                for (const k of recipe) state.held[k]--;
                state.completed++;
                events.push({ type: 'completed' });
                state.beltSpeed = currentSpeed(state.completed);
            }
            checkShiftEnd();
        },
        step(dt) {
            if (state.phase !== 'running') return;
            state.elapsed += dt;
            spawnIfDue(dt);
            // Round 8, task 3: recomputed every tick, not only on completion —
            // this is what makes dishes already in flight accelerate too. The
            // drawn belt and the sim must never disagree on the live speed.
            state.beltSpeed = currentSpeed(state.completed);
            for (let i = state.dishes.length - 1; i >= 0; i--) {
                const d = state.dishes[i];
                d.dist += state.beltSpeed * dt;
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
