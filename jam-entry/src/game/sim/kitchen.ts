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
 *
 * Round 12: `posAt` exported (same shape of change as round 11's `playSample`)
 * so kitchenScene.ts's reach overlay can derive its bands from this module's
 * own geometry instead of recomputing beltPath's polyline itself — the two
 * must never be able to disagree about where distance `d` sits on the belt.
 *
 * Round 13: `tapSlot`'s radial "any dish within slotReach" test is replaced
 * outright by `SLOT_ZONES` — each station now owns one assigned, non-
 * overlapping stretch of belt, so a dish spatially close to a station but
 * sitting in a neighbour's zone is no longer servable there however near it
 * passes. `Math.hypot` survives only as the tie-break between multiple
 * dishes inside the same zone. `SLOT_ZONES` is exported as the one place this
 * geometry is computed; kitchenScene.ts's overlay reads it directly rather
 * than re-deriving the boundaries, for the same anti-drift reason round 12
 * exported `posAt`.
 *
 * Round 16: the win/loss thresholds (`shiftChaiTarget`, `walkoutsAllowed`)
 * are read from the active level record (src/game/data/levels.ts) instead of
 * KITCHEN_CONFIG — kitchenConfig.ts's own copies are superseded fallbacks,
 * see its comments. `ACTIVE_LEVEL.target` is `number | null`; null means
 * endless (a boss level, §7.3b of LevelEconomy.md) — `checkShiftEnd` never
 * fires 'won' for one, so it can only end on the walkout budget below.
 *
 * Round 17: content goes per-level. The ingredient bag (`makeBag`) draws
 * from `ACTIVE_INGREDIENT_KINDS` — the active level's own ingredient union
 * (src/game/data/levels.ts's getActiveIngredientKinds(), never
 * KITCHEN_CONFIG.ingredientKinds, now a superseded fallback) — and
 * `tapSlot`'s completion check walks `ACTIVE_LEVEL.recipes` instead of one
 * hard-coded KITCHEN_CONFIG.recipe. See tapSlot's own comment for the
 * multi-recipe completion rule (at most one completion per tap, by
 * declaration order) this makes necessary.
 */
import { KITCHEN_CONFIG } from '../kitchenConfig.ts';
import { getActiveLevel, getActiveIngredientKinds } from '../data/levels.ts';

const ACTIVE_LEVEL = getActiveLevel();
const ACTIVE_INGREDIENT_KINDS = getActiveIngredientKinds();

export type KitchenPhase = 'running' | 'won' | 'lost';

export interface DishInst {
    uid: number;
    /** Distance travelled along beltPath. */
    dist: number;
    x: number;
    y: number;
    /** Which ACTIVE_INGREDIENT_KINDS[].key this belt item carries (Round 17
     *  — was KITCHEN_CONFIG.ingredientKinds[].key before content went
     *  per-level). */
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
    // Round 17: carries which of ACTIVE_LEVEL.recipes just completed, so
    // kitchenScene.ts's per-recipe final-dish counter (Task 5) can credit
    // the right dish — a single level-wide counter no longer identifies
    // which of two simultaneously-active recipes was actually served.
    | { type: 'completed'; recipeIndex: number }
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

export function posAt(dist: number): { x: number; y: number } {
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
 * Round 13: one assigned, non-overlapping belt zone per station — replaces
 * the old radial `slotReach` test entirely (kitchenConfig.ts's `slotReach`
 * comment). Boundaries sit at the midpoint of each of the three working runs
 * (top run: cumLengths[1]->cumLengths[2]; right drop: cumLengths[2]->
 * cumLengths[3]; bottom run: cumLengths[3]->cumLengths[4]), each opening a
 * `slotBandSeam`-wide gap (±half either side) so neighbours never touch. The
 * outer ends of the first and last zone are the eligible bounds themselves
 * (ELIGIBLE_DIST_MIN/MAX) — nothing extends onto a fridge stub.
 *
 * Which KITCHEN_CONFIG.slots index owns which zone is derived, not pasted:
 * each zone's slot is whichever slot sits nearest posAt(that zone's own
 * midpoint). With the current layout this resolves to slots[0], slots[1],
 * slots[3], slots[2] in belt order — the two bottom stations are NOT in
 * slots order (slots is TL, TR, BL, BR; the belt visits bottom-right before
 * bottom-left) — but the nearest-slot rule gets this right on its own and
 * keeps being right if `slots` is ever reordered.
 *
 * `SLOT_ZONES[i]` corresponds to `KITCHEN_CONFIG.slots[i]` — this is the
 * ONLY place this geometry is computed. kitchenScene.ts's overlay reads this
 * export directly rather than re-deriving the boundaries; two derivations of
 * the same boundary is exactly how the overlay could end up disagreeing with
 * `tapSlot`.
 */
export interface SlotZone {
    start: number;
    end: number;
}
const rawZoneBoundaries = [
    ELIGIBLE_DIST_MIN,
    (cumLengths[1] + cumLengths[2]) / 2,
    (cumLengths[2] + cumLengths[3]) / 2,
    (cumLengths[3] + cumLengths[4]) / 2,
    ELIGIBLE_DIST_MAX,
];
export const SLOT_ZONES: SlotZone[] = (() => {
    const bySlot: SlotZone[] = new Array(KITCHEN_CONFIG.slots.length);
    for (let i = 0; i < rawZoneBoundaries.length - 1; i++) {
        const seamHalf = KITCHEN_CONFIG.slotBandSeam / 2;
        const zone: SlotZone = {
            start: i === 0 ? rawZoneBoundaries[i] : rawZoneBoundaries[i] + seamHalf,
            end: i === rawZoneBoundaries.length - 2 ? rawZoneBoundaries[i + 1] : rawZoneBoundaries[i + 1] - seamHalf,
        };
        const mid = posAt((zone.start + zone.end) / 2);
        let bestSlot = -1;
        let bestDist = Infinity;
        KITCHEN_CONFIG.slots.forEach((slot, slotIndex) => {
            const d = Math.hypot(mid.x - slot.x, mid.y - slot.y);
            if (d < bestDist) {
                bestDist = d;
                bestSlot = slotIndex;
            }
        });
        // Nearest-slot-to-midpoint assumes a bijection between zones and slots.
        // If a future slot reposition breaks that assumption, fail loudly here
        // (module load) rather than leaving a silently-overwritten slot to
        // TypeError on the first tap of that station, far from this cause.
        if (bySlot[bestSlot] !== undefined) {
            const prev = bySlot[bestSlot];
            throw new Error(
                `SLOT_ZONES: slot ${bestSlot} claimed by two zones ` +
                `[${prev.start}, ${prev.end}] and [${zone.start}, ${zone.end}] — ` +
                `nearest-slot-to-midpoint is no longer a bijection. Check KITCHEN_CONFIG.slots.`
            );
        }
        bySlot[bestSlot] = zone;
    }
    return bySlot;
})();

/**
 * Bag shuffle (Fisher-Yates), refilled only when empty: every kind is dealt
 * exactly once per lap, so the longest possible drought between two spawns
 * of the same kind is 2n-2, and a repeat can only land across a bag
 * boundary. Plain Math.random() per spawn would allow both long droughts
 * and back-to-back triples — the property the handover asked for.
 *
 * Round 17: `n` is now the ACTIVE level's own ingredient union, not a fixed
 * 3 — a two-recipe level's union can be larger (N0 L3/L4's chai+coffee union
 * is 5), which raises the drought ceiling to 2(5)-2=8. That is flagged, not
 * fixed, at this round's call site (see the file header) — do not retune
 * spawnInterval or the bag mechanism itself to compensate.
 */
function makeBag(): () => string {
    const kinds = ACTIVE_INGREDIENT_KINDS.map((k) => k.key);
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
    for (const k of ACTIVE_INGREDIENT_KINDS) held[k.key] = 0;

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
        // Round 16: a null target (a boss, ACTIVE_LEVEL.isBoss) is endless —
        // this never fires 'won' for one; see the file header.
        if (ACTIVE_LEVEL.target !== null && state.completed >= ACTIVE_LEVEL.target) {
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
            // Round 13: acceptance is zone membership, not radius — see
            // SLOT_ZONES above. Math.hypot survives only as the tie-break
            // among several dishes inside the same zone; nearest-to-the-
            // station, unchanged from the old radial rule.
            const zone = SLOT_ZONES[slotIndex];
            let bestIdx = -1;
            let bestDist = Infinity;
            for (let i = 0; i < state.dishes.length; i++) {
                const d = state.dishes[i];
                // Round 6, task 2: ineligible-segment dishes (the fridge
                // connector stubs) are never a valid tap target, however
                // close — gate on segment, not distance. Redundant with the
                // zones (which sit inside [ELIGIBLE_DIST_MIN, MAX) by
                // construction) but cheap insurance against a future seam
                // change quietly reopening a fridge stub.
                if (!isEligibleDist(d.dist)) continue;
                if (!(d.dist >= zone.start && d.dist < zone.end)) continue;
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

            // Round 17: at most one completion per tap is still the rule,
            // but with more than one recipe live (N0 L3/L4's chai+coffee)
            // it needs a sharper argument than round 8's, since two recipes
            // can share an ingredient (both want milk). One tap adds
            // exactly 1 to exactly one held counter, so only the recipe(s)
            // that use THAT ingredient can newly become fully held this
            // tap — and if two of them share it, BOTH can be fully held at
            // once (e.g. chai and coffee each one ingredient short, and the
            // shared milk arrives). Declaration order in
            // ACTIVE_LEVEL.recipes breaks that tie deterministically: walk
            // the list in order and take the FIRST fully-held recipe, never
            // a second one on the same tap — a single for-loop with an
            // immediate break on match, not a while, so it is structurally
            // impossible to complete two recipes off one tap. Consuming the
            // winner's ingredients is what keeps a second, still-fully-held
            // recipe from silently completing on some LATER unrelated tap
            // too: subtracting the shared ingredient (milk, here) drops
            // that second recipe's count back below what it needs, so it
            // waits for its own next matching ingredient exactly as if the
            // two recipes had never shared anything. If this ever needed to
            // become a while loop to catch a second completion in the same
            // tap, the state has already gone wrong and the loop would hide
            // it.
            const recipes = ACTIVE_LEVEL.recipes;
            let completedIndex = -1;
            for (let ri = 0; ri < recipes.length; ri++) {
                if (recipes[ri].ingredients.every((k) => state.held[k] > 0)) {
                    completedIndex = ri;
                    break;
                }
            }
            if (completedIndex >= 0) {
                for (const k of recipes[completedIndex].ingredients) state.held[k]--;
                state.completed++;
                events.push({ type: 'completed', recipeIndex: completedIndex });
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
            if (state.walkouts >= ACTIVE_LEVEL.walkoutsAllowed) {
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
