/**
 * TEST MODE ONLY — the rendered view over sim/kitchen.ts. The billboard
 * (ui-billboard + ui-hotbar + ui-container, from the demo tier of a
 * commercial UI pack — private-build only, see KitchenMode.md §2.6) is the
 * entire HUD; everything else stays grey-box or round-3 baked art. No
 * Kitchen Props furniture sprites here (Plan item 51: those are a
 * background layer at their own scale, never a belt/slot sprite) — the
 * `prop-*` aliases below are the station-identity props this handover asked
 * for, a different thing.
 *
 * Isolated from the live board's STATE and RENDER PATH: never imports
 * towerScene.ts, sim/engine.ts, or stage.ts (see kitchenStage.ts), and never
 * reads CONFIG.path/CONFIG.pads/data/. Round 3 imports `config.ts` for two
 * READ-ONLY constants only — CONFIG.sizes.pathWidth and CONFIG.colors.path*
 * — so the belt's stroke weight and color read as the same rail as the live
 * board's, per the handover. Nothing here writes CONFIG or touches its path
 * data.
 *
 * Round 4: dish-count entries (task 1), prop name/level labels (task 2), a
 * placeholder fridge anchoring both belt ends (task 3, knowingly bending
 * PropSpriteIndex.md §5 — see kitchenConfig.ts's `fridge` comment), sprite-
 * over-name billboard ingredients (task 4), and one shared `contentInset`
 * constant so the round-3 inset symmetry holds by construction (task 5).
 *
 * Round 5: chai-only dish tray (task 1), an aspect-correct fridge over a
 * recomputed belt path/speed (task 2), station slots that start empty and
 * fill via a tap-to-place picker driven by the new onSlotTapEmpty/placeProp
 * callbacks (task 3), icon-centre/label-bottom prop slots (tasks 4-5), a
 * larger recipe-name heading (task 6), an end-screen driven off the sim's
 * own won/lost event rather than polled phase (task 7), and a larger single
 * final dish (task 8).
 *
 * Round 6: prop labels now measure clearance from ItemSlot1.png's inner well
 * (kitchenConfig.ts's slotWell/labelGap), not the slot box's outer edge
 * (task 1); syncSlots' filled-highlight and sim/kitchen.ts's tapSlot both
 * gate on isEligibleDist so a dish on a fridge connector stub is never
 * tappable (task 2); the belt's ingredient set corrected to milk/ginger/
 * tea-leaf (task 3).
 *
 * Round 7: the billboard ingredient row's sprite size is fixed at
 * kitchenConfig.ts's ingredientRow.capN (5) instead of recomputing larger
 * for a shorter recipe (task 1); the belt now switches music cues and plays
 * SFX exactly as the live game does — service_low on shift start, service_high
 * once past KITCHEN_CONFIG.walkoutsAllowed * 0.3 remaining lives (KitchenMode
 * §4's amendment, guarded at remaining > 0 per §4), served/walkout/won/lost
 * routed to sfx.shot/leak/win/lose (task 2-3). sfx.shot() here is a
 * deliberate loose-fit stand-in, not a settled choice — serving a cooked dish
 * will want its own cue once cooking exists; it borrows the tower-firing cue
 * only because nothing closer exists yet. src/audio/audio.ts itself is
 * untouched — this only calls its existing switchCue/prefetchCue/sfx surface.
 *
 * Round 8: the recipe gate (sim/kitchen.ts) is now visible here — each
 * billboard ingredient carries a live badge counter (ui-badge-count, task 5)
 * redrawn on 'served' and 'completed'; the final-dish ×N counter now fires
 * on 'completed' only, not on every pickup (task 6); completion gets its own
 * cue, sfx.upgrade(), resolving round 7's flagged sfx.shot() stand-in for
 * that moment (task 7); prop labels abbreviate "Level" to "Lv" for more name
 * room (task 8, independent of the gate). The belt's speed ramp
 * (kitchenConfig.ts's beltRamp) is read from sim.state.beltSpeed wherever
 * this file would otherwise reference KITCHEN_CONFIG.beltSpeed directly —
 * it doesn't, so no rendering code changed for the ramp itself.
 *
 * Round 9: this file now owns the entire coin economy — `wallet` and
 * `coinsEarned`, both derived from sim events, since sim/kitchen.ts knows
 * nothing about props, slots, or coins (see that file's header). Slots
 * start LOCKED and unlock for coins, guarded against a second unlock before
 * any prop is placed (task 5); a placed prop costs coins by tier and can be
 * sold back (task 6); a filled slot goes on cooldown after every grab, shown
 * as a dark sweep over the slot (task 7); the billboard's upper panel now
 * shows Coins alongside Walkouts Left, split left/right (task 8). The round
 * no longer starts at scene creation — `start()` (called from TestBelt.tsx's
 * Ready button) is what begins spawning and the service_low cue; before
 * that, `tick()` does nothing at all (task 4). `onShiftEnd` now also passes
 * a frozen EconomySnapshot (wallet/coinsEarned/hats) alongside the sim
 * state, and a new `onMessage` callback drives the same DOM-overlay pattern
 * PropPicker.tsx uses, for the unlock guard and insufficient-funds text
 * (KitchenMode.md §2.5 — noted here as the third copy of that pattern).
 *
 * Round 10: the setup phase. Round 9's `ready` gate was "pause everything";
 * it should have been "freeze the belt, leave the kitchen live" — so `onTap`
 * no longer checks `ready` at all. Unlock, picker, place and sell all work
 * before the Ready press, and the second-unlock guard now correctly fires
 * during setup, which is where it belongs. `tick()`'s own `ready` guard is
 * untouched — that is the only thing that should freeze the sim, and it
 * still does: `sim.step` never runs, so spawned/elapsed/walkouts all stay at
 * 0 through the whole setup phase. A new `onSlotsUnlockedChange` callback
 * (mirroring the existing `onSlotsFilledChange`) lets TestBelt.tsx tell the
 * setup nudge apart from the "place a prop" nudge — locked-board vs
 * unlocked-but-empty are different first steps.
 *
 * Round 11: two independent fixes. `walletFloor()` replaces the one-way
 * `hasEverPlacedProp` lift — the floor is now read fresh off live state
 * (placed / unlocked-but-empty / nothing-unlocked) every time it's applied,
 * so selling a station or emptying the board reopens the right floor instead
 * of leaving the wallet able to strand below what a station costs
 * (kitchenConfig.ts's `coins` comment has the failure case). Separately, the
 * baked ui-coin icon replaces the word "Coins" in the HUD banner, and the
 * per-grab cue moves from tick()'s 'served' branch (a round-7 loose-fit
 * sfx.shot('kitchen') stand-in) into attemptUseOrSell, where the slot index
 * is known — a Kettle grab plays kettle-boil, a Water Dispenser grab plays
 * water-pour, exactly one sound per grab.
 *
 * Round 12: the reach overlay — a placed prop now draws a translucent band
 * along the belt showing exactly which stretch it can serve from, derived at
 * scene creation from sim/kitchen.ts's own `posAt`/`isEligibleDist` (never a
 * second copy of the beltPath polyline — see computeReachBands below) and
 * shown/hidden alongside slotProp[i], live during setup too. Separately, the
 * unlock guard (attemptUnlock) no longer requires a prop to already be placed
 * before a second slot can unlock — it now only refuses an unlock that would
 * leave the wallet unable to afford the cheapest utensil afterward, closing
 * LevelEconomy's double-unlock trap without the previous rule's stricter
 * side effect of blocking a well-funded player from unlocking two slots
 * before placing anything in either.
 *
 * Round 13: round 12's radial reach overlay (and the radial acceptance rule
 * it illustrated) is gone — replaced by sim/kitchen.ts's `SLOT_ZONES`, one
 * assigned, non-overlapping stretch of belt per station. This file no longer
 * derives any of that geometry; it reads `SLOT_ZONES` straight from
 * sim/kitchen.ts and only traces it (via `posAt`) for drawing. `syncSlots`'s
 * filled-highlight is updated the same way, for the same reason round 6
 * first gated it on `isEligibleDist` — it must never light up "filled" for a
 * dish `tapSlot` would actually refuse.
 *
 * Round 14: a locked slot now shows its price — padlock raised, "Unlock for"
 * / "<n>[coin]" stacked beneath it (LOCK_CONTENT below), instead of a bare
 * centred padlock with the cost only in TestBelt.tsx's banner. The stack is
 * contained the same way round 6 contained prop labels — against
 * ItemSlot1.png's inner well, not the slot box's outer edge — so the two
 * containment rules can't drift apart from each other.
 *
 * Round 16: the per-level tuning values this file owns (starting float,
 * walkouts allowed) are now read off the active level record
 * (src/game/data/levels.ts), not KITCHEN_CONFIG — see `level` below and its
 * call sites. kitchenConfig.ts's own copies are superseded fallbacks, see
 * that file's comments. Belt/slot/prop geometry and the recipe are untouched
 * — this file still runs the same board regardless of which level is
 * active.
 *
 * Round 17: content goes per-level. `level`/`ACTIVE_INGREDIENT_KINDS`/
 * `KIND_INFO` move to MODULE scope (read once, like sim/kitchen.ts's own
 * ACTIVE_LEVEL) since `BAKED_ALIASES` needs them before createKitchenScene
 * ever runs — superseded by Round 23 below, which moves all three back into
 * the function body, off a `level` parameter instead of a module-scope
 * global. The billboard now draws one ingredient row per active recipe
 * (buildIngredientRow, stacked, §8b's shrink-to-fit reused vertically when
 * two rows don't fit) and the final-dish tray one entry per recipe
 * (makeFinalDishView/layoutDishEntries), both replacing the old
 * single-recipe/single-dish blocks. A missing ingredient or dish sprite
 * (coffee-extract, cream, rice, ghee, jeera-rice's dish) falls back to a
 * procedural tile exactly as tea-leaf always has — `BAKED_ALIASES` only
 * preloads aliases the manifest actually lists (`MANIFEST_ALIASES`), so
 * requesting one that doesn't exist can never 404 Assets.load. Boss hats
 * (computeEconomySnapshot) branch on `level.isBoss` — LevelEconomy.md
 * §7.3b/§10.3's Σ(wave×30) = 15n(n+1), FIRST CLEAR ONLY; the flat-50 repeat
 * rule needs SaveData.kitchen, which doesn't exist yet (out of scope this
 * round, see that function's comment).
 *
 * Round 18: a permanent recipe-name label is drawn under every final-dish
 * entry, centred on the group's own slot (finalDishSlotX[i], not the sprite
 * alone) and visible even at count 0 — see the block right after
 * `dishEntryViews`. The station-zone reach overlay is trimmed by two
 * kitchenConfig.ts constants (`slotBandSeam` widened, the new
 * `slotBandEndInset`), both consumed inside sim/kitchen.ts's `SLOT_ZONES` —
 * this file makes no separate change for that, since it already reads
 * `SLOT_ZONES` rather than deriving its own copy (round 12/13's anti-drift
 * reasoning). Round 9's old unlock guard is retired in its own comment below,
 * not restored — TestBelt.tsx's new FTUE Ready gate (n0l1 only) replaces it.
 *
 * Round 19: the billboard's upper panel now shows Walkouts alone, centred
 * (task 3) — Coins moves out entirely into finalDishArea's left half
 * alongside the DOM hamburger, the two agreeing on a horizontal fraction
 * (x = boardWidth/4) rather than a shared pixel constant (task 4). Round
 * 18's single-row final-dish tray is replaced outright by a vertical,
 * scrollable dish BOARD (task 5) — `dishBoardViewport` is the one place its
 * geometry is computed, the same anti-drift shape as `SLOT_ZONES`. The reach
 * overlay's corner brightening (task 6) is fixed by drawing each zone
 * opaque and compositing the group's alpha once via `cacheAsTexture`, rather
 * than blending four (or one self-overlapping) translucent shapes.
 *
 * Round 20: the coin group (task 2) is left-anchored on a fixed inset
 * (`COIN_GROUP_LEFT_X`) instead of centred — round 19's centring re-centred
 * the icon itself every time the wallet's digit count changed, which a HUD
 * anchor shouldn't do. The inset mirrors the dish board's own measured
 * right margin; the icon grows to the hamburger's approximate on-screen
 * size (same DOM/Pixi seam as round 19's Ready slot); the wallet number
 * takes the dish board's own fixed one-recipe size (44) instead of scaling
 * off the icon, which deliberately breaks round 11's icon-height/text-size
 * link now that the coin is a HUD anchor rather than an inline banner
 * glyph. The dish board's scroll affordance (task 3) is a small chevron,
 * shown only while scrollable and only above the floor — round 19's
 * assumption that the mask itself would clip a partial row and read as
 * "more below" was never true, since ROW_MIN is exactly AVAIL/3 and a
 * scrollable board always shows exactly three whole rows at rest.
 *
 * Round 22: props now share one fit scale (`PROP_FIT_SCALE`, task 1) instead
 * of each sprite fitting `propSize` independently — a per-prop fit let two
 * props at different native aspect ratios render at different apparent size
 * even though the art shares one world scale; one shared minimum keeps that
 * scale consistent across the board. `onSlotTapEmpty` (task 4b) now also
 * hands the picker a snapshot of `wallet` — the pause TestBelt.tsx applies
 * around both slot modals (task 4a, entirely on that side; this file has no
 * notion of `paused`) is what makes that snapshot exact for the modal's
 * whole lifetime, so no live subscription is needed.
 *
 * Round 23: `createKitchenScene` takes `level` as a parameter instead of
 * reading a frozen module-scope global — TestBelt.tsx now owns which level
 * is active and can create a fresh scene for a different one after Next
 * Level. `ACTIVE_INGREDIENT_KINDS`/`KIND_INFO`/`BAKED_ALIASES`, all
 * level-dependent, move from module scope into the function body, computed
 * off the parameter before the async asset load (BAKED_ALIASES must exist
 * before `Assets.load` runs); `createKitchenSim(level)` is passed the same
 * parameter through. `UI_ALIASES`/`MANIFEST_ALIASES`/`EXIT_SIGN_ALIAS`/
 * `HAS_EXIT_SIGN` are level-independent and stay at module scope, untouched.
 *
 * Round 25, task 1: EconomySnapshot now carries `dishCounts` — the same
 * per-recipe tallies the dish board (`dishCounts`, local to this function)
 * already keeps — so TestBelt.tsx's end screen can print one line per
 * recipe instead of totalling every completion under one hardcoded dish
 * name. No new counting: `computeEconomySnapshot` just copies the array
 * that already exists at the same scope depth.
 */
import {
    Assets,
    Container,
    Graphics,
    NineSliceSprite,
    Sprite,
    Text,
    type Application,
    type FederatedPointerEvent,
    type Texture,
    type TextStyleFontWeight,
    type Ticker,
} from 'pixi.js';
import { playSample, prefetchCue, sfx, switchCue } from '../audio/audio.ts';
import { CONFIG } from './config.ts';
import { KITCHEN_CONFIG } from './kitchenConfig.ts';
import { getIngredientKinds, type IngredientKind, type LevelRecord, type RecipeRecord } from './data/levels.ts';
import { createKitchenSim, isEligibleDist, posAt, SLOT_ZONES, type KitchenState } from './sim/kitchen.ts';
import type { KitchenStage } from './kitchenStage.ts';
import { MANIFEST } from '../assets/manifest.ts';

/** Round 9: a frozen snapshot of the economy at shift end, passed alongside
 *  KitchenState to onShiftEnd — sim/kitchen.ts has no notion of coins. */
export interface EconomySnapshot {
    wallet: number;
    /** Floored at 100 for display/scoring — see kitchenConfig.ts's `coins`. */
    coinsEarned: number;
    hats: number;
    /** Round 25, task 1: per-recipe completion counts, index-aligned to
     *  `level.recipes` — a frozen copy of the dish board's own running
     *  tally at the instant of 'won'/'lost', so a two-recipe level's end
     *  screen can name each dish instead of totalling under one name.
     *  KitchenState.completed stays the scalar sum used by the win check
     *  and the belt ramp; this is purely for display. */
    dishCounts: number[];
}

export interface Scene {
    /** Round 9, task 4: begin the shift — spawning, service_low, and
     *  sfx.startWave() all wait for this instead of firing at creation.
     *  No-op if already started (a fresh scene per run needs no guard from
     *  the caller). */
    start(): void;
    /** Round 5, task 3: place `levelProps[propIndex]` into station slot
     *  `slotIndex`. No-op if that slot already holds a prop. */
    placeProp(slotIndex: number, propIndex: number): void;
    /** Round 9, task 6: sell the prop in `slotIndex` for its tier's refund;
     *  the slot itself stays unlocked, not refunded. No-op if empty. */
    sellProp(slotIndex: number): void;
    destroy(): void;
}

export interface KitchenSceneCallbacks {
    /** Fires once per tick with the latest sim state — drives the live HUD. */
    onChange(s: KitchenState): void;
    /**
     * Round 5, task 7: fires exactly once, off the sim's own 'won'/'lost'
     * event — not off polling `state.phase` on a tick that might not run
     * again once the last dish resolves. Drives the end-screen overlay.
     * Round 9: also carries the frozen EconomySnapshot for that same
     * instant — coins earned, wallet, and Chef Hats.
     */
    onShiftEnd(s: KitchenState, economy: EconomySnapshot): void;
    /** Round 5, task 3: an empty slot was tapped — show the prop picker.
     *  Round 22, task 4b: also carries the current wallet, snapshotted once
     *  rather than subscribed — see the Round 22 file-header note. */
    onSlotTapEmpty(slotIndex: number, wallet: number): void;
    /** Round 9, task 6: a filled slot was tapped with nothing to serve —
     *  offer to sell it. `info` is the placed prop's name and its refund. */
    onSlotTapFilled(slotIndex: number, info: { name: string; refund: number }): void;
    /** Round 5, task 3: fires after a prop is placed, with the new total
     *  filled count — drives the "tap a station" first-entry hint. */
    onSlotsFilledChange(filledCount: number): void;
    /** Round 10: fires after a slot unlocks, with the new total unlocked
     *  count — mirrors onSlotsFilledChange, and exists for the same reason:
     *  TestBelt.tsx's setup nudge needs to tell "nothing unlocked yet" apart
     *  from "unlocked but empty", which are different first steps. */
    onSlotsUnlockedChange(unlockedCount: number): void;
    /** Round 9, task 5: a short user-facing message (the unlock guard, an
     *  insufficient-funds notice) — shown via PropPicker's DOM-overlay
     *  pattern, not drawn on the Pixi canvas. */
    onMessage(text: string): void;
}

const BAND_TINTS = {
    beltRun1: 0x33291c,
    stationRow: 0x1c2733,
    beltRun2: 0x33291c,
    finalDishArea: 0x27241c,
} as const;

// Round 11 (corrected round 12): 'ui-chef-hat' is force-loaded here even
// though it's never drawn on this Pixi canvas — TestBelt.tsx's end screen
// shows it as a plain DOM <img>, which never reads Pixi's Assets/texture
// cache at all. What forcing the load here actually buys is a warm browser
// HTTP cache: by the time the end screen mounts, the bytes are already in
// hand, so the image paints without a pop-in — Assets.backgroundLoadBundle()
// is idle-priority and can't be trusted to land in time on its own. ui-coin
// is different and genuinely belongs in this array for the original reason:
// it's a real Pixi sprite (the HUD coin icon), so it needs the texture cache.
const UI_ALIASES = ['ui-slot-empty', 'ui-slot-filled', 'ui-hotbar', 'ui-container', 'ui-billboard', 'ui-badge-count', 'ui-coin', 'ui-chef-hat'];
// Baked art across rounds 3-4: real where it exists (manifest-listed),
// fallback everywhere else via `Assets.cache.has()` checks below — the
// fallback alias (ing-tea-leaf) is never requested from Assets, only used
// as a map key, so no 404s from an unlisted manifest entry.
// Round 17: which of the active level's ingredient/dish aliases actually
// have a manifest entry — Assets.load throws on an alias the manifest never
// registered, so an alias with no art yet (coffee-extract, cream, rice,
// ghee, jeera-rice's dish — none wired into manifest.ts, see levels.ts's
// INGREDIENT_CATALOG/RecipeRecord comments) must never reach it. Filtering
// here, rather than trusting callers to only ask for real ones, is what
// keeps "no asset work this round" true without every future level author
// needing to remember this rule too.
const MANIFEST_ALIASES = new Set(MANIFEST.bundles.flatMap((b) => b.assets).map((a) => a.alias as string));

// Round 19, task 3: the exit-sign icon's art is a parallel handover — it may
// not exist in the manifest yet. Checked once here (not force-loaded via
// UI_ALIASES, which would throw Assets.load on a missing manifest entry
// exactly as BAKED_ALIASES's own comment above describes) so the HUD can
// render text-only when it's absent, per that task's explicit instruction
// against a labelled placeholder tile.
const EXIT_SIGN_ALIAS = 'ui-exit-sign';
const HAS_EXIT_SIGN = MANIFEST_ALIASES.has(EXIT_SIGN_ALIAS);

/**
 * `callbacks` lets a React overlay (ui/TestBelt.tsx) show the live HUD and
 * the win/lose banner, and drive the prop picker, without this scene
 * touching the shared app store. See KitchenSceneCallbacks above.
 */
export async function createKitchenScene(
    app: Application,
    stage: KitchenStage,
    callbacks: KitchenSceneCallbacks,
    level: LevelRecord
): Promise<Scene> {
    const { onChange, onShiftEnd, onSlotTapEmpty, onSlotTapFilled, onSlotsFilledChange, onSlotsUnlockedChange, onMessage } = callbacks;
    // Round 23: level-dependent — computed off the `level` parameter, not a
    // module-scope global read once at first import (see the Round 23
    // file-header note and levels.ts's own). Declared before Assets.load
    // since BAKED_ALIASES must exist before that call runs.
    const ACTIVE_INGREDIENT_KINDS = getIngredientKinds(level);
    const KIND_INFO = new Map<string, IngredientKind>(ACTIVE_INGREDIENT_KINDS.map((k) => [k.key, k]));
    // Baked art across rounds 3-4: real where it exists (manifest-listed),
    // fallback everywhere else via `Assets.cache.has()` checks below — see
    // MANIFEST_ALIASES's own comment above for why this filters to aliases
    // the manifest actually lists.
    const BAKED_ALIASES = [
        ...KITCHEN_CONFIG.levelProps.map((p) => p.alias),
        ...ACTIVE_INGREDIENT_KINDS.map((k) => k.alias).filter((a) => MANIFEST_ALIASES.has(a)),
        ...level.recipes.map((r) => r.finalDish).filter((a) => MANIFEST_ALIASES.has(a)),
        'prop-fridge',
    ];
    // Manifest-listed (deferred bundle) — load on demand rather than trust
    // background-load timing, so Test Mode never races its own art. Round
    // 19: ui-exit-sign only when the manifest actually lists it — see
    // HAS_EXIT_SIGN's comment above.
    await Assets.load([...UI_ALIASES, ...BAKED_ALIASES, ...(HAS_EXIT_SIGN ? [EXIT_SIGN_ALIAS] : [])]);
    const tex = {
        slotEmpty: Assets.get<Texture>('ui-slot-empty'),
        slotFilled: Assets.get<Texture>('ui-slot-filled'),
        hotbar: Assets.get<Texture>('ui-hotbar'),
        container: Assets.get<Texture>('ui-container'),
        billboard: Assets.get<Texture>('ui-billboard'),
        badgeCount: Assets.get<Texture>('ui-badge-count'),
        coin: Assets.get<Texture>('ui-coin'),
    };

    // Round 22, task 1: one fit scale shared by every levelProps sprite, not
    // a per-prop fit against propSize — normalising each sprite to touch its
    // OWN box edge let the box, not the object, set apparent size, so props
    // whose native aspect ratios differ rendered at different scale even
    // though the pack's sprites share one world scale (confirmed by eye —
    // see the round's screenshot). The minimum across every prop is the one
    // factor that keeps every sprite within propSize AND at the same scale
    // as its neighbours. Derived from the loaded textures, not a typed
    // pixel size in kitchenConfig.ts, which would go stale the moment a
    // sprite is re-exported.
    const PROP_FIT_SCALE = Math.min(
        ...KITCHEN_CONFIG.levelProps.map((p) => {
            const t = Assets.get<Texture>(p.alias);
            return Math.min(KITCHEN_CONFIG.propSize.w / t.width, KITCHEN_CONFIG.propSize.h / t.height);
        })
    );

    // A child of stage.root, not stage.root itself — kitchenStage.ts's
    // caller (TestBelt.tsx) destroys the stage separately, after this scene.
    const boardRoot = new Container();
    stage.root.addChild(boardRoot);
    // Round 19, task 5: teardown for the scrollable dish board's drag/wheel
    // listeners, which (unlike everything else in this closure) are NOT
    // children of boardRoot and so aren't caught by boardRoot.destroy().
    // Only ever populated when the dish board is actually scrollable.
    const extraCleanups: (() => void)[] = [];

    function band(y: number, height: number, color: number): void {
        const g = new Graphics();
        g.rect(0, y, KITCHEN_CONFIG.boardWidth, height).fill(color);
        boardRoot.addChild(g);
    }
    const B = KITCHEN_CONFIG.bands;
    band(B.beltRun1.y, B.beltRun1.height, BAND_TINTS.beltRun1);
    band(B.stationRow.y, B.stationRow.height, BAND_TINTS.stationRow);
    band(B.beltRun2.y, B.beltRun2.height, BAND_TINTS.beltRun2);
    band(B.finalDishArea.y, B.finalDishArea.height, BAND_TINTS.finalDishArea);
    // Round 19: hoisted here (FD was declared later, locally to the
    // final-dish block) so both the coin group (task 4, finalDishContent —
    // y 1000-1160) and the dish board viewport (task 5, the WHOLE
    // finalDishArea — y 1000-1280, since the hamburger no longer reserves
    // any of the right half) share one read apiece, rather than reaching
    // into KITCHEN_CONFIG.bands twice for the same rectangles.
    const FD = B.finalDishContent;
    const FA = B.finalDishArea;

    // Round 3, task 2: the belt drawn as a path, not just band color — same
    // two-pass edge+dirt stroke as towerScene.ts's drawRoad, same pathWidth,
    // so it reads at the live board's rail weight. cap/join 'round' rounds
    // the two turns (including the x=645 drop) without extra geometry.
    const road = new Graphics();
    const drawBelt = (g: Graphics, width: number, color: number) => {
        const path = KITCHEN_CONFIG.beltPath;
        g.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) g.lineTo(path[i].x, path[i].y);
        g.stroke({ width, color, cap: 'round', join: 'round' });
    };
    drawBelt(road, CONFIG.sizes.pathWidth + 14, CONFIG.colors.pathEdge);
    drawBelt(road, CONFIG.sizes.pathWidth, CONFIG.colors.pathDirt);
    boardRoot.addChild(road);

    // Round 4, task 3: fridge anchoring both belt ends. Added AFTER `road`
    // so it draws on top — the belt's rounded end-caps poke slightly past
    // the fridge box's edge (half the stroke width), and this sprite
    // covers that poke, reading as "the belt runs into/out of the fridge"
    // rather than just stopping beside it.
    //
    // Round 5, task 2: aspect-fit, not stretch-to-fill — the box (72x108)
    // was sized to the native sprite's own 32x48 aspect x2.25, so this
    // computes the same result as a literal x2.25 scale but stays correct
    // if the box or the source art ever changes independently.
    const fridgeBox = KITCHEN_CONFIG.fridge;
    const fridgeTex = Assets.get<Texture>('prop-fridge');
    const fridgeSprite = new Sprite(fridgeTex);
    fridgeSprite.anchor.set(0.5);
    const fridgeFit = Math.min(fridgeBox.w / fridgeTex.width, fridgeBox.h / fridgeTex.height);
    fridgeSprite.width = fridgeTex.width * fridgeFit;
    fridgeSprite.height = fridgeTex.height * fridgeFit;
    fridgeSprite.position.set(fridgeBox.x + fridgeBox.w / 2, fridgeBox.y + fridgeBox.h / 2);
    boardRoot.addChild(fridgeSprite);

    // ---- billboard: the entire HUD ----------------------------------------
    const BB = KITCHEN_CONFIG.billboard;
    const billboardSprite = new Sprite(tex.billboard);
    billboardSprite.position.set(BB.sprite.x, BB.sprite.y);
    billboardSprite.width = BB.sprite.w;
    billboardSprite.height = BB.sprite.h; // stretched from square — accepted, see file header
    boardRoot.addChild(billboardSprite);

    const border = BB.nineSliceBorder;
    const upperPanel = new NineSliceSprite({
        texture: tex.hotbar,
        leftWidth: border, rightWidth: border, topHeight: border, bottomHeight: border,
        width: BB.panelInner.width,
        height: BB.upperPanel.height,
    });
    upperPanel.position.set(BB.panelInner.x, BB.upperPanel.y);
    boardRoot.addChild(upperPanel);

    // Round 9, task 8 (superseded by round 19): the upper panel used to
    // split left/right, Walkouts on the left quarter-centre and Coins on the
    // right. Round 19, task 4 moves Coins out of this panel entirely, into
    // finalDishArea's left half (below) — Walkouts now owns the whole panel
    // and centres on it. `HUD_MAX_W` widens from a quarter-width budget to
    // (nearly) the whole panel accordingly.
    const HUD_SIDE_INSET = 24;
    const HUD_MAX_W = BB.panelInner.width - 2 * HUD_SIDE_INSET;
    const hudY = BB.upperPanel.y + BB.upperPanel.height / 2;
    const panelCenterX = BB.panelInner.x + BB.panelInner.width / 2;

    // Round 19, task 3: an exit-sign icon to the left of the text, when the
    // art exists — `ui-exit-sign`'s sprite is a parallel handover, not
    // guaranteed to have landed in the manifest yet (HAS_EXIT_SIGN, above).
    // No manifest line is added and no placeholder tile is drawn for it this
    // round: a labelled placeholder in the HUD banner would look worse than
    // no icon, per the handover, so this renders text-only when absent.
    const EXIT_SIGN_ICON_H = 26;
    const EXIT_SIGN_GAP = 8;
    const exitSignIcon = HAS_EXIT_SIGN ? new Sprite(Assets.get<Texture>(EXIT_SIGN_ALIAS)) : null;
    if (exitSignIcon) {
        exitSignIcon.anchor.set(0.5);
        exitSignIcon.height = EXIT_SIGN_ICON_H;
        exitSignIcon.width = exitSignIcon.texture.width * (EXIT_SIGN_ICON_H / exitSignIcon.texture.height);
        boardRoot.addChild(exitSignIcon);
    }

    const walkoutsText = new Text({
        text: '',
        style: { fill: 0x1b1b2b, fontSize: 26, fontWeight: '800' },
    });
    // Left-anchored (was centred) — layoutWalkouts below positions the
    // icon+text group by its own left edge so the pair can be centred on the
    // panel together, rather than centring the text alone and eyeballing
    // where the icon sits relative to it.
    walkoutsText.anchor.set(0, 0.5);
    boardRoot.addChild(walkoutsText);
    function layoutWalkouts(): void {
        const iconSpan = exitSignIcon ? exitSignIcon.width + EXIT_SIGN_GAP : 0;
        const groupLeft = panelCenterX - (iconSpan + walkoutsText.width) / 2;
        if (exitSignIcon) exitSignIcon.position.set(groupLeft + exitSignIcon.width / 2, hudY);
        walkoutsText.position.set(groupLeft + iconSpan, hudY);
    }

    // Round 19, task 4: coins move out of the upper panel into
    // finalDishArea's left half — Pixi stays Pixi (no wallet callback into
    // React), only the position changes. The upper panel's dark text fill
    // (0x1b1b2b, tuned for the light hotbar wood texture) would be invisible
    // against finalDishArea's dark band tint, so this switches to white —
    // the same fill the dish-count text already uses successfully on this
    // same band.
    //
    // Round 20, task 2: left-anchored, not centred. Centring on boardWidth/4
    // (round 19) re-centred the whole group — and moved the icon — every
    // time the wallet gained or lost a digit. A HUD anchor should hold
    // still; only the number's own width should grow. Hoisted here (ahead
    // of its round-19 declaration site below) so the coin group's own width
    // budget can be checked against the dish board's real left edge instead
    // of a re-typed copy of the same literal.
    const DISH_BOARD_INSET = 8;
    // Mirrors the dish board's own right margin, measured rather than
    // guessed: at N0 L1, count 12, the ×12 text's right edge sat 25.63
    // units short of the board's right edge (720) — see kitchenScene.ts's
    // dish row layout, task 2b (rounded to 26; the handover's own from-the-
    // row-math estimate was ~34-38, notably off — the actual glyph metrics
    // of "×12" at fontSize 44 render narrower than that estimate assumed).
    // Using the same inset on this side means the two HUD anchors read as a
    // matched pair rather than two unrelated numbers.
    const COIN_GROUP_LEFT_X = 26;
    const COIN_ICON_GAP = 6;
    // Round 20, task 2c: the icon grows to the hamburger's on-screen size —
    // DOM h-11 is 44 CSS px, which at this project's validated 420×900 test
    // aspect (stage scale 0.5833) is ~75.4 design units. This is an
    // approximate visual match, not a computed one: it drifts on any other
    // viewport aspect, the same DOM/Pixi seam round 19 hit at the Ready
    // slot (kitchenScene.ts vs TestBelt.tsx both approximate a cross-
    // renderer size or position rather than truly sharing one; a real fix
    // would content-fit the DOM overlay the way kitchenStage.ts fits the
    // canvas, which stays out of scope this round too.
    const COIN_ICON_H = 75;
    const COIN_GROUP_CENTER_Y = FD.y + FD.height / 2;
    // The cap keeps the group's right edge clear of dishBoardViewport's
    // left edge (x = boardWidth/2 + DISH_BOARD_INSET = 368) even at an
    // implausibly wide wallet string; setFitText below only ever needs to
    // bite into this margin, never the left inset itself, so the icon never
    // moves.
    const COIN_TO_DISHBOARD_MARGIN = 24;
    const COIN_GROUP_MAX_W =
        KITCHEN_CONFIG.boardWidth / 2 + DISH_BOARD_INSET - COIN_GROUP_LEFT_X - COIN_TO_DISHBOARD_MARGIN;
    const coinIcon = new Sprite(tex.coin);
    coinIcon.anchor.set(0, 0.5);
    coinIcon.height = COIN_ICON_H;
    coinIcon.width = tex.coin.width * (COIN_ICON_H / tex.coin.height);
    // Fixed once, never touched again — task 2a's whole point is that this
    // icon does not move as the wallet gains or loses digits.
    coinIcon.position.set(COIN_GROUP_LEFT_X, COIN_GROUP_CENTER_Y);
    boardRoot.addChild(coinIcon);

    const coinsText = new Text({
        text: '',
        // Round 20, task 2c: fixed at the dish board's own one-recipe ×N
        // size (44) rather than scaling off the icon's own height — this
        // deliberately breaks round 11's 1:1 icon-height-to-text-size
        // relation, which was load-bearing when the coin was an inline
        // banner glyph and isn't now that it's a left-anchored HUD stack:
        // the wallet number and the dish ×N are meant to read as a pair
        // across the band, not the icon and its own number.
        style: { fill: 0xffffff, fontSize: 44, fontWeight: '800' },
    });
    coinsText.anchor.set(0, 0.5);
    boardRoot.addChild(coinsText);

    function setFitText(t: Text, text: string, maxWidth: number, baseSize: number, minSize: number): void {
        t.text = text;
        let size = baseSize;
        t.style.fontSize = size;
        while (t.width > maxWidth && size > minSize) {
            size -= 1;
            t.style.fontSize = size;
        }
    }

    const lowerPanel = new NineSliceSprite({
        texture: tex.container,
        leftWidth: border, rightWidth: border, topHeight: border, bottomHeight: border,
        width: BB.panelInner.width,
        height: BB.lowerPanel.height,
    });
    lowerPanel.position.set(BB.panelInner.x, BB.lowerPanel.y);
    boardRoot.addChild(lowerPanel);

    // Round 17: the heading names the ACTIVE LEVEL (e.g. "Two Tickets" for
    // two live recipes), not one fixed recipe's name — KITCHEN_CONFIG.recipe
    // is superseded, and every level already carries a `name` that serves
    // exactly this heading's purpose.
    const recipeNameText = new Text({
        text: level.name,
        // Round 5, task 6: reads as the panel's heading now — size only,
        // alignment/position unchanged.
        style: { fill: 0xffffff, fontSize: BB.recipeNameSize, fontWeight: '700' },
    });
    recipeNameText.anchor.set(0.5, 0);
    // Round 4, task 5: shares `contentInset` with the ingredient row's
    // baseline below — one constant, so the two gaps are equal by
    // construction rather than two 40s that could drift apart later.
    recipeNameText.position.set(BB.panelInner.x + BB.panelInner.width / 2, BB.lowerPanel.y + BB.contentInset);
    boardRoot.addChild(recipeNameText);

    // Ingredient row(s) — Specs.md §8b's overflow formula: [icon] + [icon] + ...
    //
    // Round 3, task 1: bottom-anchored, not centered. Every tile's bottom
    // edge sits exactly `contentInset` above the panel's bottom edge — the
    // same constant the recipe name insets from the top — so the two gaps
    // are equal by construction, not by eyeballing.
    //
    // Round 4, task 4: each entry is now [sprite above][name below], real
    // art where the manifest has it (ing-milk, ing-ginger), else the
    // round-3 procedural fallback tile — see makeIngredientView below,
    // which this reuses. Name text shrinks to fit `slotSize` rather than
    // clipping (checked against "Chai Masala", the longest label at n=5).
    //
    // Round 17, task 6: one row PER ACTIVE RECIPE, stacked in declaration
    // order (top = recipes[0], e.g. chai; bottom = the LAST recipe, which
    // sits at exactly the old single-row baseline — so a one-recipe level,
    // N0 L1/L2/N1 L1, is geometrically identical to round 16). No row here
    // ever overflows horizontally (max n=3, under capN=5), but two stacked
    // rows can overflow the panel's remaining height — when they would,
    // §8b's own shrink-to-fit SHAPE (scale = min(1, available / natural))
    // is reused vertically rather than writing new layout code, per the
    // handover; every tile dimension below (sprite, label gap, badge, plus
    // sign) scales by the same factor so a shrunk row stays proportional to
    // an unshrunk one, not just narrower.
    const { innerWidth, plusWidth, pad, labelHeight, labelGap, capN } = BB.ingredientRow;
    const rowCenterX = BB.panelInner.x + BB.panelInner.width / 2;
    const BADGE_W = 36;
    const ROW_GAP = 12;
    const NAME_GAP = 8;
    const naturalRowHeight = (innerWidth - (capN - 1) * plusWidth - pad) / capN;
    const recipeCount = level.recipes.length;
    const naturalTotalHeight = recipeCount * naturalRowHeight + (recipeCount - 1) * ROW_GAP;
    const contentTop = BB.lowerPanel.y + BB.contentInset + recipeNameText.height + NAME_GAP;
    const contentBottom = BB.lowerPanel.y + BB.lowerPanel.height - BB.contentInset;
    const availableHeight = contentBottom - contentTop;
    const rowScale = recipeCount > 1 ? Math.min(1, availableHeight / naturalTotalHeight) : 1;
    const scaledRowHeight = naturalRowHeight * rowScale;

    // Round 17: each badge keeps its own maxW (a shrunk row's badges are
    // smaller than an unshrunk one's) instead of one shared constant.
    const badgeDigits: { key: string; cx: number; cy: number; text: Text; maxW: number }[] = [];

    function buildIngredientRow(recipe: RecipeRecord, baseline: number, scale: number): void {
        const rowIngredients = recipe.ingredients;
        const n = rowIngredients.length;
        const rowLabelHeight = labelHeight * scale;
        const rowLabelGap = labelGap * scale;
        const rowPlusWidth = plusWidth * scale;
        // Round 7, task 1: fixed sprite size, computed at the capN cap — a
        // shorter recipe (n<=3 here) is a shorter, centred row at the SAME
        // tile size a capN-length row would use, not a bigger one. §8b's
        // own shrink-to-fit formula (divided by the actual n) is kept as
        // the fallback past the cap, so a 6-ingredient recipe still can't
        // overflow horizontally — independent of the vertical `scale` this
        // round adds.
        const baseSlotSize = n <= capN
            ? (innerWidth - (capN - 1) * plusWidth - pad) / capN
            : (innerWidth - (n - 1) * plusWidth - pad) / n;
        const slotSize = baseSlotSize * scale;
        const rowWidth = n * slotSize + (n - 1) * rowPlusWidth;
        const spriteBoxH = slotSize - rowLabelHeight - rowLabelGap;
        // Round 8, task 5: top of each ingredient's sprite box — the badge
        // sits at this row's top-right corner, 4 (scaled) units in from
        // each edge.
        const spriteTop = baseline - rowLabelHeight - rowLabelGap - spriteBoxH;
        // Badge: 36 design units wide at scale 1, native aspect (291x305)
        // preserved — never squashed (round 5's fridge mistake, see
        // kitchenConfig.ts's `fridge` comment). Digit fit against the
        // badge's clear interior (159/291 of its width, per the source
        // glyph's own bbox).
        const badgeW = BADGE_W * scale;
        const badgeH = badgeW * (tex.badgeCount.height / tex.badgeCount.width);
        const badgeDigitMaxW = (159 / 291) * badgeW;

        let cursorX = rowCenterX - rowWidth / 2;
        rowIngredients.forEach((key, i) => {
            const info = KIND_INFO.get(key);
            const cx = cursorX + slotSize / 2;

            const view = makeIngredientView(key, slotSize, spriteBoxH);
            // makeIngredientView anchors its content around (0,0); position
            // it so its own bottom edge lands directly above the name text
            // below.
            view.position.set(cx, baseline - rowLabelHeight - rowLabelGap - spriteBoxH / 2);
            boardRoot.addChild(view);

            const label = fitText(info?.label ?? key, slotSize, 13, 8);
            label.anchor.set(0.5, 1);
            label.position.set(cx, baseline);
            boardRoot.addChild(label);

            // Round 8, task 5: live badge counter — a checklist, not a
            // score, so it starts at 0 and stays visible at 0 (confirmed by
            // the user).
            const badgeCx = cx + slotSize / 2 - 4 * scale;
            const badgeCy = spriteTop + 4 * scale;
            const badge = new Sprite(tex.badgeCount);
            badge.anchor.set(0.5);
            badge.width = badgeW;
            badge.height = badgeH;
            badge.position.set(badgeCx, badgeCy);
            boardRoot.addChild(badge);
            const digit = fitText('0', badgeDigitMaxW, 20, 8, { fill: 0xfdfae7, fontWeight: '700' });
            digit.anchor.set(0.5);
            // The source sprite carries a bottom drop shadow, so its visual
            // centre sits slightly above its geometric one — a sub-unit
            // correction, applied because it's free and correct, not
            // because it's visible at this size.
            digit.position.set(badgeCx, badgeCy - badgeH * 0.026);
            boardRoot.addChild(digit);
            badgeDigits.push({ key, cx: badgeCx, cy: badgeCy - badgeH * 0.026, text: digit, maxW: badgeDigitMaxW });

            cursorX += slotSize;
            if (i < n - 1) {
                const plus = new Text({ text: '+', style: { fill: 0xffffff, fontSize: 22 * scale, fontWeight: '700' } });
                plus.anchor.set(0.5);
                plus.position.set(cursorX + rowPlusWidth / 2, baseline - slotSize / 2);
                boardRoot.addChild(plus);
                cursorX += rowPlusWidth;
            }
        });
    }

    level.recipes.forEach((recipe, i) => {
        // Stack from the bottom up — the LAST recipe always sits at
        // `contentBottom`, the same y a single-recipe level's only row has
        // always used (recipeCount===1 resolves rowFromBottom to 0 and
        // rowScale to 1, so this is byte-identical to round 16 there).
        const rowFromBottom = recipeCount - 1 - i;
        const baseline = contentBottom - rowFromBottom * (scaledRowHeight + ROW_GAP);
        buildIngredientRow(recipe, baseline, rowScale);
    });

    // Round 8, task 5: redrawn on 'served' and 'completed' (see the tick
    // loop below) — recreates the digit Text via fitText each time so a
    // longer recipe or a longer shift can't silently overflow the badge.
    function syncBadges(): void {
        for (const b of badgeDigits) {
            const count = sim.state.held[b.key] ?? 0;
            const text = String(count);
            if (b.text.text === text) continue;
            b.text.destroy();
            const t = fitText(text, b.maxW, 20, 8, { fill: 0xfdfae7, fontWeight: '700' });
            t.anchor.set(0.5);
            t.position.set(b.cx, b.cy);
            boardRoot.addChild(t);
            b.text = t;
        }
    }

    // Round 4: measures the level suffix first (never truncates), gives the
    // name whatever width remains, ellipsizing it if needed. One Text probe,
    // reused and destroyed — not one allocation per candidate length.
    // Stroked: the empty-slot background (ui-slot-empty) is near-white, so a
    // flat white fill was unreadable there even though it read fine on the
    // filled (orange) background. The stroke fixes both.
    const PROP_LABEL_STYLE = {
        fill: 0xffffff,
        fontSize: 13,
        fontWeight: '600',
        stroke: { color: 0x1b1b2b, width: 3 },
    } as const;
    function formatPropLabel(name: string, level: number, maxWidth: number): string {
        // Round 8, task 8: "Level" -> "Lv" frees ~19-20 units for the name —
        // the suffix is still measured first and never truncates; only the
        // name ever ellipsizes (round 4's rule, unchanged).
        const suffix = ` - Lv ${level}`;
        const probe = new Text({ text: suffix, style: PROP_LABEL_STYLE });
        const availW = maxWidth - probe.width;
        let candidate = name;
        let truncated = false;
        probe.text = candidate;
        while (probe.width > availW && candidate.length > 1) {
            candidate = candidate.slice(0, -1);
            truncated = true;
            probe.text = candidate + '…';
        }
        probe.destroy();
        return (truncated ? candidate + '…' : candidate) + suffix;
    }

    // Round 4, task 4: shrink-to-fit rather than clip or ellipsis — used for
    // the billboard ingredient names ("Chai Masala" at slot~86 is the check).
    // Round 8, task 5: `style` override lets the badge digit reuse this same
    // shrink loop with its own fill/weight instead of duplicating it.
    function fitText(
        text: string,
        maxWidth: number,
        baseSize: number,
        minSize: number,
        style?: { fill?: number; fontWeight?: TextStyleFontWeight }
    ): Text {
        let size = baseSize;
        const t = new Text({
            text,
            style: { fill: style?.fill ?? 0xffffff, fontSize: size, fontWeight: style?.fontWeight ?? '600' },
        });
        while (t.width > maxWidth && size > minSize) {
            size -= 1;
            t.style.fontSize = size;
        }
        return t;
    }

    // Round 16: the active level's own tuning values — see the file header.
    // Round 17: `level` moved to module scope (see there) — no local
    // re-declaration needed.

    // ---- Round 9: the coin economy (wallet/coinsEarned/locks/cooldown) ----
    // Lives entirely in this closure — sim/kitchen.ts has no notion of any
    // of it (see the file header). Round 11 replaced the one-way
    // `hasEverPlacedProp` lift with the state-derived `walletFloor()` below,
    // which re-reads live state every time it's applied.
    let wallet: number = level.startingFloat;
    let coinsEarned = 0;
    const slotLocked: boolean[] = KITCHEN_CONFIG.slots.map(() => true);
    const cooldownRemaining: number[] = KITCHEN_CONFIG.slots.map(() => 0);

    // Round 11: the wallet floor, read fresh off live state every time it's
    // applied (on a walkout, and again after a sell) — replaces the one-way
    // `hasEverPlacedProp` lift. See kitchenConfig.ts's `coins` comment for
    // the deadlock this fixes. Declared here (a `function`, hoisted) even
    // though `filledSlotCount` below isn't assigned yet — nothing calls this
    // until after that assignment runs.
    function walletFloor(): number {
        if (filledSlotCount > 0) return 0;
        if (slotLocked.some((l) => !l)) return KITCHEN_CONFIG.propTierCost[0];
        return level.startingFloat;
    }

    // ---- station slots, 2x2 -------------------------------------------------
    // Round 5, task 3: slots start EMPTY — no prop assigned until the player
    // taps an empty slot and picks one from KITCHEN_CONFIG.levelProps via
    // PropPicker.tsx (a DOM overlay; see its file header for the
    // BuildSheet-pattern duplication note, KitchenMode.md §2.5). The empty/
    // filled background sprite below still tracks dish-reach occupancy
    // (syncSlots) — a separate concept from whether a prop has been placed.
    //
    // Round 9, task 5: slots now start LOCKED, a third state ahead of empty
    // (locked -> unlocked+empty -> filled). Reuses ui-slot-empty (no new art)
    // tinted dark plus a lock glyph — a distinct affordance from the
    // unlocked-empty state, which already reads as "tap me".
    const slotSprites = KITCHEN_CONFIG.slots.map((slot) => {
        const s = new Sprite(tex.slotEmpty);
        s.anchor.set(0.5);
        s.width = KITCHEN_CONFIG.slotBox.w;
        s.height = KITCHEN_CONFIG.slotBox.h;
        s.position.set(slot.x, slot.y);
        boardRoot.addChild(s);
        return s;
    });
    // Round 14: the containment rect a locked slot's padlock+price stack must
    // stay inside — the SAME well/labelGap round 6 defined for prop labels
    // (kitchenConfig.ts's `slotWell`/`labelGap` comment), rederived here
    // rather than duplicated as numbers so a future slotBox/slotWell change
    // keeps both containment rules in sync automatically. Note `centerY` is
    // -1, not 0 — the well is asymmetric top-to-bottom, so the safe stack is
    // centred on this rect, not on the slot itself.
    const LOCK_CONTENT = (() => {
        const { w, h } = KITCHEN_CONFIG.slotBox;
        const well = KITCHEN_CONFIG.slotWell;
        const gap = KITCHEN_CONFIG.labelGap;
        const left = -w / 2 + well.left + gap;
        const right = w / 2 - well.right - gap;
        const top = -h / 2 + well.top + gap;
        const bottom = h / 2 - well.bottom - gap;
        return { width: right - left, height: bottom - top, centerY: (top + bottom) / 2 };
    })();
    // A function of slot index, not a bare inline read, so a future move to
    // a per-slot cost array is a one-line change here rather than four.
    function unlockCostFor(_slotIndex: number): number {
        return KITCHEN_CONFIG.slotUnlockCost;
    }
    const LOCK_ROW_GAP = 4;
    const LOCK_LINE2_GAP = 4;
    const LOCK_ICON_SIZE = 22;
    const lockIcons: Text[] = [];
    const lockLine1Texts: Text[] = [];
    const lockCostTexts: Text[] = [];
    const lockCoinIcons: Sprite[] = [];
    KITCHEN_CONFIG.slots.forEach((slot, i) => {
        const lock = new Text({ text: '\u{1F512}', style: { fontSize: LOCK_ICON_SIZE } });
        lock.anchor.set(0.5);
        boardRoot.addChild(lock);

        // Line 1: "Unlock for" — fit by measurement (setFitText), same
        // family as PROP_LABEL_STYLE so this reads as the same UI as the
        // prop name labels.
        const line1 = new Text({ text: '', style: PROP_LABEL_STYLE });
        line1.anchor.set(0.5);
        let line1Size = 13;
        setFitText(line1, 'Unlock for', LOCK_CONTENT.width, line1Size, 8);
        boardRoot.addChild(line1);

        // Line 2: "<n>" + coin icon, a horizontal group centred on x=0 —
        // mirrors the HUD's coin+number layout (coinIcon/coinsText above)
        // rather than extracting a shared helper (accepted duplication,
        // KitchenMode.md §2.5). The icon is sized off the number's own
        // resolved font size, not COIN_ICON_H — that constant is sized for
        // the HUD banner and is too large for this box.
        const costText = new Text({ text: '', style: PROP_LABEL_STYLE });
        costText.anchor.set(0, 0.5);
        boardRoot.addChild(costText);
        const coinIconSmall = new Sprite(tex.coin);
        coinIconSmall.anchor.set(0, 0.5);
        boardRoot.addChild(coinIconSmall);

        const cost = unlockCostFor(i);
        let costSize = 13;
        const sizeLine2 = () => {
            costText.style.fontSize = costSize;
            costText.text = `${cost}`;
            coinIconSmall.height = costSize;
            coinIconSmall.width = tex.coin.width * (costSize / tex.coin.height);
        };
        sizeLine2();
        while (costText.width + LOCK_LINE2_GAP + coinIconSmall.width > LOCK_CONTENT.width && costSize > 8) {
            costSize -= 1;
            sizeLine2();
        }
        let line2Width = costText.width + LOCK_LINE2_GAP + coinIconSmall.width;
        let line2Height = Math.max(costText.height, coinIconSmall.height);

        // Round 15, task 4: nothing previously stopped the stack's total
        // height from exceeding LOCK_CONTENT.height — a later font-size
        // raise would overflow ItemSlot1.png's inner well silently, with no
        // error anywhere. Shrink to fit: the same iterate-to-fit pattern as
        // setFitText and line 2's width loop above, rather than clip or
        // overflow. Floors of 10 (padlock) / 8 (text, matching the floors
        // already used above) keep the shrink from running unbounded.
        let lockSize = LOCK_ICON_SIZE;
        let totalHeight = lock.height + LOCK_ROW_GAP + line1.height + LOCK_ROW_GAP + line2Height;
        while (totalHeight > LOCK_CONTENT.height && (lockSize > 10 || line1Size > 8 || costSize > 8)) {
            if (lockSize > 10) {
                lockSize -= 1;
                lock.style.fontSize = lockSize;
            }
            if (line1Size > 8) {
                line1Size -= 1;
                setFitText(line1, 'Unlock for', LOCK_CONTENT.width, line1Size, 8);
            }
            if (costSize > 8) {
                costSize -= 1;
                sizeLine2();
                line2Width = costText.width + LOCK_LINE2_GAP + coinIconSmall.width;
            }
            line2Height = Math.max(costText.height, coinIconSmall.height);
            totalHeight = lock.height + LOCK_ROW_GAP + line1.height + LOCK_ROW_GAP + line2Height;
        }

        // Vertical stack — padlock, line 1, line 2 — centred on the content
        // rect's own centre, not the slot centre (see LOCK_CONTENT above).
        const stackTop = slot.y + LOCK_CONTENT.centerY - totalHeight / 2;
        lock.position.set(slot.x, stackTop + lock.height / 2);
        line1.position.set(slot.x, stackTop + lock.height + LOCK_ROW_GAP + line1.height / 2);
        const line2Y = stackTop + lock.height + LOCK_ROW_GAP + line1.height + LOCK_ROW_GAP + line2Height / 2;
        costText.position.set(slot.x - line2Width / 2, line2Y);
        coinIconSmall.position.set(slot.x - line2Width / 2 + costText.width + LOCK_LINE2_GAP, line2Y);

        lockIcons.push(lock);
        lockLine1Texts.push(line1);
        lockCostTexts.push(costText);
        lockCoinIcons.push(coinIconSmall);
    });
    function setSlotLockVisual(i: number, locked: boolean): void {
        slotSprites[i].tint = locked ? 0x555566 : 0xffffff;
        lockIcons[i].visible = locked;
        lockLine1Texts[i].visible = locked;
        lockCostTexts[i].visible = locked;
        lockCoinIcons[i].visible = locked;
    }
    KITCHEN_CONFIG.slots.forEach((_, i) => setSlotLockVisual(i, slotLocked[i]));

    // Round 9, task 7: a dark sweep over a slot on cooldown, from full cover
    // down to nothing as `cooldownRemaining` counts down — "the kettle is
    // busy" has to be readable, not just true.
    const cooldownOverlays = KITCHEN_CONFIG.slots.map(() => {
        const g = new Graphics();
        g.visible = false;
        boardRoot.addChild(g);
        return g;
    });
    function drawCooldownOverlay(i: number): void {
        const g = cooldownOverlays[i];
        g.clear();
        const frac = cooldownRemaining[i] / KITCHEN_CONFIG.propCooldown;
        if (frac <= 0) {
            g.visible = false;
            return;
        }
        g.visible = true;
        const { w, h } = KITCHEN_CONFIG.slotBox;
        const slot = KITCHEN_CONFIG.slots[i];
        g.rect(slot.x - w / 2, slot.y - h / 2, w, h * frac).fill({ color: 0x000000, alpha: 0.5 });
    }
    // Round 5, tasks 4-5: reverses round 4's top-anchored icon+label stack —
    // icon centre-centre in the slotBox (aspect-fit, unchanged), label
    // centre-bottom with propLabelPad design units of padding on every side
    // so no glyph lands within ~4 CSS px of the slotBox's inner edge at the
    // test viewport. formatPropLabel (unchanged from round 4) still measures
    // the level suffix first and only ever ellipsizes the name.
    const slotProp: (number | null)[] = KITCHEN_CONFIG.slots.map(() => null);
    // Round 9, task 6: kept so sellProp can tear the right sprite/label back
    // down again — placeProp never stored these before this round because
    // nothing ever removed a placed prop.
    const propViews: ({ sprite: Sprite; label: Text } | null)[] = KITCHEN_CONFIG.slots.map(() => null);
    let filledSlotCount = 0;
    function placeProp(slotIndex: number, propIndex: number): void {
        if (slotProp[slotIndex] !== null) return;
        const propInfo = KITCHEN_CONFIG.levelProps[propIndex];
        const cost = KITCHEN_CONFIG.propTierCost[propInfo.level - 1];
        if (wallet < cost) {
            onMessage(`Not enough coins to place ${propInfo.name} (${cost} needed).`);
            return;
        }
        wallet -= cost;
        slotProp[slotIndex] = propIndex;
        const slot = KITCHEN_CONFIG.slots[slotIndex];
        const propTex = Assets.get<Texture>(propInfo.alias);

        const p = new Sprite(propTex);
        p.anchor.set(0.5);
        // Round 22, task 1: PROP_FIT_SCALE, not a per-prop fit — see its
        // definition above.
        p.width = propTex.width * PROP_FIT_SCALE;
        p.height = propTex.height * PROP_FIT_SCALE;
        p.position.set(slot.x, slot.y);
        boardRoot.addChild(p);

        // Round 6, task 1: contain against ItemSlot1.png's inner well, not
        // the slotBox's outer edge — the well is well inside the sprite's
        // raised border. See kitchenConfig.ts's `slotWell`/`labelGap` comment.
        const well = KITCHEN_CONFIG.slotWell;
        const gap = KITCHEN_CONFIG.labelGap;
        const labelMaxWidth = KITCHEN_CONFIG.slotBox.w - 2 * (well.left + gap);
        const label = new Text({
            text: formatPropLabel(propInfo.name, propInfo.level, labelMaxWidth),
            style: PROP_LABEL_STYLE,
        });
        label.anchor.set(0.5, 1);
        label.position.set(slot.x, slot.y + KITCHEN_CONFIG.slotBox.h / 2 - well.bottom - gap);
        boardRoot.addChild(label);
        propViews[slotIndex] = { sprite: p, label };

        filledSlotCount++;
        onSlotsFilledChange(filledSlotCount);
        updateReachOverlay(slotIndex);
        refreshHud();
    }

    // Round 9, task 6: refund floor(cost * propSellRefund); the slot itself
    // stays unlocked, per LevelEconomy.md §7.1 ("the slot stays unlocked and
    // is not refunded").
    function sellProp(slotIndex: number): void {
        const propIndex = slotProp[slotIndex];
        if (propIndex === null) return;
        const propInfo = KITCHEN_CONFIG.levelProps[propIndex];
        const cost = KITCHEN_CONFIG.propTierCost[propInfo.level - 1];
        const refund = Math.floor(cost * KITCHEN_CONFIG.propSellRefund);
        wallet += refund;
        propViews[slotIndex]?.sprite.destroy();
        propViews[slotIndex]?.label.destroy();
        propViews[slotIndex] = null;
        slotProp[slotIndex] = null;
        cooldownRemaining[slotIndex] = 0;
        filledSlotCount--;
        // Round 11: selling the last station can strand the wallet below the
        // price of a new one (LevelEconomy's deadlock, see kitchenConfig.ts)
        // — apply the floor here too, after filledSlotCount has dropped so
        // an empty board re-floors at the right tier.
        wallet = Math.max(walletFloor(), wallet);
        onSlotsFilledChange(filledSlotCount);
        updateReachOverlay(slotIndex);
        sfx.sell();
        refreshHud();
    }

    // Round 3, task 4 / Round 4, task 4: real sprite where manifest art
    // exists (ing-milk, ing-ginger), else a flat procedural tile keyed by
    // the same kind string — replicating textures.ts's art()-fallback
    // pattern locally (see the file header on why this doesn't import
    // textures.ts itself). `w`/`h` default to the belt footprint (dishSize)
    // but the billboard row passes its own smaller slotSize/spriteBoxH.
    function makeIngredientView(kind: string, w?: number, h?: number): Container {
        const info = KIND_INFO.get(kind);
        const dw = w ?? KITCHEN_CONFIG.dishSize.w;
        const dh = h ?? KITCHEN_CONFIG.dishSize.h;
        if (info && Assets.cache.has(info.alias)) {
            const srcTex = Assets.get<Texture>(info.alias);
            const s = new Sprite(srcTex);
            s.anchor.set(0.5);
            const fit = Math.min(dw / srcTex.width, dh / srcTex.height);
            s.width = srcTex.width * fit;
            s.height = srcTex.height * fit;
            return s;
        }
        const c = new Container();
        const g = new Graphics();
        g.roundRect(-dw / 2, -dh / 2, dw, dh, 8).fill(info?.color ?? 0xff6b1a);
        c.addChild(g);
        const label = new Text({
            text: (info?.label ?? kind).slice(0, 2).toUpperCase(),
            style: { fill: 0xffffff, fontSize: Math.min(16, dh * 0.3), fontWeight: '700' },
        });
        label.anchor.set(0.5);
        c.addChild(label);
        return c;
    }

    const world = new Container();
    boardRoot.addChild(world);

    // ---- Round 13, task: the reach overlay traces sim/kitchen.ts's SLOT_ZONES
    // A translucent band along the belt showing exactly the stretch a placed
    // station can serve from. Added to `world` right here — before any dish
    // view exists — so every dish, present or future, draws on top of it with
    // no z-order fuss.
    //
    // Round 12's version discovered its own accepted range by sampling the
    // (now-gone) radial rule. Round 13's station acceptance is instead a
    // pre-computed, non-overlapping zone per slot (SLOT_ZONES), and this file
    // does not re-derive that boundary math — it only traces each zone's own
    // [start, end) via posAt() to get a polyline. Sampling posAt() (rather
    // than walking beltPath's segments here) is what makes that trace follow
    // the belt's corners for free, exactly as round 12 relied on.
    //
    // Geometry is static, so every slot's band is computed exactly once,
    // right here at scene creation — never in the tick loop.
    const REACH_STEP = 0.25;
    const REACH_COLOR = 0x39d1ff;
    const REACH_ALPHA = 0.32;
    function zonePoints(zone: { start: number; end: number }): { x: number; y: number }[] {
        const points: { x: number; y: number }[] = [];
        for (let d = zone.start; d < zone.end; d += REACH_STEP) points.push(posAt(d));
        points.push(posAt(zone.end));
        return points;
    }

    // Round 19, task 6: each zone's own stroke geometry self-overlaps at the
    // belt's two right-hand corner vertices — zone 2 [496,941] contains the
    // vertex at 746, zone 3 [1011,1456] contains 1206, and the join geometry
    // 'round' generates there double-composites when drawn at REACH_ALPHA
    // directly, brightening a ~beltwidth square. (The left vertices at
    // 176/1776 fall inside round 18's end insets and correctly carry no band
    // at all — that absence is unrelated and untouched.) The fix: stroke
    // every zone fully OPAQUE (alpha 1 — overlapping opaque triangles just
    // overwrite each other, no accumulation), then flatten the group to a
    // single texture via cacheAsTexture and apply REACH_ALPHA ONCE on that
    // flattened result — one composite over the whole (now self-consistent)
    // group instead of a blend per triangle. The four zones are disjoint
    // from EACH OTHER, so one shared alpha over all four remains correct;
    // the artefact this fixes was always internal to a single zone's own
    // geometry, never a cross-zone overlap.
    const reachOverlayGroup = new Container();
    const reachOverlays = KITCHEN_CONFIG.slots.map((_, i) => {
        const g = new Graphics();
        const points = zonePoints(SLOT_ZONES[i]);
        if (points.length >= 2) {
            g.moveTo(points[0].x, points[0].y);
            for (let k = 1; k < points.length; k++) g.lineTo(points[k].x, points[k].y);
            // Round 12a (unchanged in round 13): `butt` cap and exactly
            // pathWidth, not `round` and pathWidth+14. A round cap extends a
            // stroke by half its width BEYOND each endpoint, which would draw
            // band past a zone's own boundary straight into the seam next to
            // it — exactly the disagreement-with-the-accepting-rule this
            // overlay exists to avoid. `join` stays round — that shapes the
            // belt's own corners, which fall mid-band, not at band ends.
            g.stroke({
                width: CONFIG.sizes.pathWidth,
                color: REACH_COLOR,
                alpha: 1,
                cap: 'butt',
                join: 'round',
            });
        }
        g.visible = false;
        reachOverlayGroup.addChild(g);
        return g;
    });
    reachOverlayGroup.alpha = REACH_ALPHA;
    reachOverlayGroup.cacheAsTexture(true);
    world.addChild(reachOverlayGroup);
    // Visibility mirrors slotProp[i] !== null — called from the same two
    // places that already fire onSlotsFilledChange (placeProp, sellProp), and
    // gated on nothing else, so it's live during setup, before Ready.
    // Round 19: also refreshes the cached texture — cacheAsTexture snapshots
    // the group once, so a visibility change on one child needs an explicit
    // updateCacheTexture() or the flattened cache would go stale.
    function updateReachOverlay(i: number): void {
        reachOverlays[i].visible = slotProp[i] !== null;
        reachOverlayGroup.updateCacheTexture();
    }

    const dishViews = new Map<number, Container>();

    // Round 19, task 5: the dish board — a vertical, scrollable list, one
    // row per recipe, replacing round 17's horizontal per-recipe split
    // outright. `dishBoardViewport` is the ONE place this geometry is
    // computed (same anti-drift shape as sim/kitchen.ts's SLOT_ZONES) — the
    // right half of finalDishArea (FA), inset 8 on all four sides. With the
    // hamburger gone from this half (task 4 moved it, and the coin group,
    // into the LEFT half instead), this viewport uses the full band down to
    // FA's own bottom edge — hamburgerReserve (1160-1280) is no longer a
    // right-half concern at all, only a left-half one (kitchenScene.ts no
    // longer draws anything there; TestBelt.tsx's DOM hamburger occupies it).
    // DISH_BOARD_INSET itself is declared earlier (task 2's coin group needs
    // it too, to check its own width budget against this viewport's real
    // left edge) — reused here, not redeclared.
    const dishBoardViewport = {
        x: KITCHEN_CONFIG.boardWidth / 2 + DISH_BOARD_INSET,
        y: FA.y + DISH_BOARD_INSET,
        w: KITCHEN_CONFIG.boardWidth / 2 - DISH_BOARD_INSET * 2,
        h: FA.height - DISH_BOARD_INSET * 2,
    };
    const dishRecipeCount = level.recipes.length;
    const FD_CAP = KITCHEN_CONFIG.finalDishSize; // round 5's 205x136 — the size cap
    const dishRowCenterX = dishBoardViewport.x + dishBoardViewport.w / 2;

    // A recipe name label, always drawn (round 18, task 4's rule survives
    // unchanged here — see the 🔵 dimming rule below for why it's the ONE
    // thing in a row that's never hidden or dimmed). Borrows PROP_LABEL_
    // STYLE's dark stroke so it reads against the billboard-brown band.
    const ROW_NAME_GAP = 6;
    const RECIPE_NAME_STYLE = {
        fill: 0xffffff,
        fontSize: 22,
        fontWeight: '700',
        stroke: { color: 0x1b1b2b, width: 3 },
    } as const;
    // Measured, not hardcoded — a probe with a tall glyph, destroyed right
    // after, the same one-off-probe idiom formatPropLabel already uses below.
    const nameProbe = new Text({ text: 'Mg', style: RECIPE_NAME_STYLE });
    const nameBlockHeight = nameProbe.height;
    nameProbe.destroy();

    // Row height: ROW_MAX is exactly the natural (unscaled) stack height —
    // the full-size sprite (FD_CAP.h) + the gap + the name block — so a
    // single recipe (dishRecipeCount===1) always resolves dishRowScale to 1
    // below and draws at the unchanged round-5 205x136 size. ROW_MIN is a
    // hard floor of AVAIL/3, so a level can never shrink rows past a stable
    // three-row minimum — a 4th+ recipe grows the list instead of the rows.
    const ROW_MAX = FD_CAP.h + ROW_NAME_GAP + nameBlockHeight;
    const ROW_MIN = dishBoardViewport.h / 3;
    const rowHeight = Math.min(ROW_MAX, Math.max(ROW_MIN, dishBoardViewport.h / dishRecipeCount));
    const contentHeight = dishRecipeCount * rowHeight;
    const scrollable = contentHeight > dishBoardViewport.h;
    // Centred when everything fits (a one-recipe level keeps today's
    // centred look); top-aligned and scrollable otherwise.
    const boardTopY = scrollable
        ? dishBoardViewport.y
        : dishBoardViewport.y + (dishBoardViewport.h - contentHeight) / 2;

    // One row scale for the whole board (every row is the same height) — the
    // name block above is treated as fixed (its own setFitText floor governs
    // it, not this scale), so the sprite gets whatever vertical room is left
    // after reserving it. At ROW_MIN (88) that leaves ~54 units of sprite
    // height against a still-~22px name — the name reads large relative to
    // the dish there; accepted per the handover, not retuned here.
    // `widthCapScale` is round 17's own 76-unit budget (count-text gap + a
    // 1-2 digit ×N), re-derived against the viewport's fixed 344 width
    // instead of a per-recipe slotWidth — it isn't the binding constraint at
    // today's recipe counts (never below 1 for n<=7), but stays in place so
    // sprite+gap+×N still can never exceed the viewport if that changes.
    const MIN_ROW_SCALE = 0.2;
    const spriteFitScale = (rowHeight - ROW_NAME_GAP - nameBlockHeight) / FD_CAP.h;
    const widthCapScale = dishBoardViewport.w / (FD_CAP.w + 76);
    const dishRowScale = Math.max(MIN_ROW_SCALE, Math.min(spriteFitScale, widthCapScale));
    const fdw = FD_CAP.w * dishRowScale;
    const fdh = FD_CAP.h * dishRowScale;
    const COUNT_FONT_FLOOR = 16;
    const countFontSize = Math.max(COUNT_FONT_FLOOR, Math.round(44 * dishRowScale));

    function makeFinalDishView(alias: string, name: string): Container {
        if (Assets.cache.has(alias)) {
            const s = new Sprite(Assets.get<Texture>(alias));
            s.anchor.set(0.5);
            s.width = fdw;
            s.height = fdh;
            return s;
        }
        const c = new Container();
        const g = new Graphics();
        g.roundRect(-fdw / 2, -fdh / 2, fdw, fdh, 10).fill(0x5a4632);
        c.addChild(g);
        const label = new Text({
            text: name,
            style: { fill: 0xffffff, fontSize: Math.min(20, fdh * 0.18), fontWeight: '700' },
        });
        label.anchor.set(0.5);
        c.addChild(label);
        return c;
    }

    // The scroll container: everything a row draws is a child of this, not
    // of boardRoot directly, so scrolling is one Container.y change rather
    // than repositioning every child. `dishBoardMaskG` is parented into the
    // display list (boardRoot, not the scroll container itself — masking a
    // container with its own child is a Pixi footgun) per the handover.
    const dishBoardMaskG = new Graphics();
    dishBoardMaskG.rect(dishBoardViewport.x, dishBoardViewport.y, dishBoardViewport.w, dishBoardViewport.h).fill(0xffffff);
    boardRoot.addChild(dishBoardMaskG);
    const dishBoardScroll = new Container();
    dishBoardScroll.mask = dishBoardMaskG;
    boardRoot.addChild(dishBoardScroll);

    const dishCounts: number[] = level.recipes.map(() => 0);
    // Round 19, task 5 (🔵): the sprite, the count text, and the name label
    // per row — replaces round 17/18's single [view, countText] pair.
    const dishRows: { view: Container; countText: Text; y: number }[] = level.recipes.map((recipe, i) => {
        const rowY = boardTopY + i * rowHeight;
        const view = makeFinalDishView(recipe.finalDish, recipe.name);
        dishBoardScroll.addChild(view);
        const countText = new Text({ text: '', style: { fill: 0xffffff, fontSize: countFontSize, fontWeight: '800' } });
        countText.anchor.set(0, 0.5);
        countText.visible = false;
        dishBoardScroll.addChild(countText);
        const nameLabel = new Text({ text: '', style: RECIPE_NAME_STYLE });
        nameLabel.anchor.set(0.5, 0);
        setFitText(nameLabel, recipe.name, dishBoardViewport.w, 22, 10);
        nameLabel.position.set(dishRowCenterX, rowY + fdh + ROW_NAME_GAP);
        dishBoardScroll.addChild(nameLabel);
        return { view, countText, y: rowY };
    });

    // Round 19, task 5 (🔵): before anything is served, the row shows a
    // DIMMED sprite (DISH_UNSERVED_ALPHA), not empty space — the board's job
    // before the first dish lands is "here is what you are cooking", and a
    // bare name gets a first-timer less than half of that. ×N stays hidden
    // at count 0 (round 4's rule: a zero type is never shown as ×0); the
    // name stays fully opaque throughout, the one element in a row that's
    // never hidden or dimmed. At count 0 the sprite alone centres on the row
    // centre, so it shifts left by roughly half the ×N width the instant the
    // first dish lands — a one-time, accepted shift (reserving blank space
    // for a number that doesn't exist yet would look worse).
    const DISH_UNSERVED_ALPHA = 0.35;
    function layoutDishRow(i: number): void {
        const count = dishCounts[i];
        const { view, countText, y } = dishRows[i];
        const spriteCenterY = y + fdh / 2;
        view.visible = true;
        if (count === 0) {
            view.alpha = DISH_UNSERVED_ALPHA;
            countText.visible = false;
            view.position.set(dishRowCenterX, spriteCenterY);
            return;
        }
        view.alpha = 1;
        countText.visible = true;
        countText.text = `×${count}`;
        const gap = 16;
        const totalW = fdw + gap + countText.width;
        const spriteX = dishRowCenterX - totalW / 2 + fdw / 2;
        view.position.set(spriteX, spriteCenterY);
        countText.position.set(spriteX + fdw / 2 + gap, spriteCenterY);
    }
    level.recipes.forEach((_, i) => layoutDishRow(i));

    // Round 8, task 6: fires on 'completed' only, not on every pickup — the
    // ×N under the belt is now the number of that dish actually made, which
    // is what it has always looked like it meant. Round 17: takes which
    // recipe completed (sim/kitchen.ts's KitchenEvent now carries it) so a
    // two-recipe level credits the right counter.
    function onCompletedDish(recipeIndex: number): void {
        dishCounts[recipeIndex]++;
        layoutDishRow(recipeIndex);
    }

    // Round 19, task 5: drag-to-scroll (+ desktop wheel), installed ONLY
    // when the content actually overflows the viewport — "no shipping level
    // scrolls today" (max 2 recipes live), so this path is untested by
    // ordinary play and only exercises via the temporary 6-recipe check
    // (acceptance item 11). Offset is dishBoardScroll's own `.y`, clamped to
    // [AVAIL - contentHeight, 0] — 0 keeps the top row's top at the
    // viewport's top edge, the negative floor keeps the last row's bottom at
    // the viewport's bottom edge. No stopPropagation anywhere: onTap
    // (below) hit-tests only the four slot boxes at y 540-860, nowhere near
    // this viewport (y 1008+), so the two can never contend for the same
    // gesture — confirmed, not just assumed, before writing this.
    //
    // Round 20, task 3: round 19's "the mask clips a partial row" affordance
    // never actually existed — ROW_MIN is exactly AVAIL/3, so every
    // scrollable board (which only ever uses ROW_MIN, by definition of
    // being scrollable) shows exactly three WHOLE rows at rest. Nothing is
    // ever clipped, so there was no visual cue that a six-recipe board was
    // anything but a complete three-row list. A real affordance is added
    // below instead: a small down-chevron, drawn on
    // boardRoot (so the mask doesn't clip it and it costs no row-layout
    // room), visible only while scrollable and only while there is more
    // content below the fold.
    if (scrollable) {
        const minOffset = dishBoardViewport.h - contentHeight;
        const maxOffset = 0;
        // The hit-test target is a SEPARATE, NEVER-MOVED zone — not
        // dishBoardScroll itself. Pixi's `hitArea` is tested in the
        // object's own LOCAL space, and dishBoardScroll's local space
        // shifts by exactly its own `.y` as it scrolls, so a hitArea fixed
        // at the viewport's rectangle would silently drift out of
        // alignment with the visually-fixed on-screen viewport the moment
        // the container scrolls off 0 (confirmed the hard way: after one
        // drag to the floor, a second drag inside the same visible area
        // stopped registering at all). A dedicated invisible zone at a
        // constant position has no such drift.
        const dishBoardHitZone = new Graphics();
        dishBoardHitZone
            .rect(dishBoardViewport.x, dishBoardViewport.y, dishBoardViewport.w, dishBoardViewport.h)
            .fill({ color: 0xffffff, alpha: 0 });
        dishBoardHitZone.eventMode = 'static';
        boardRoot.addChild(dishBoardHitZone);

        // The scroll hint itself: a down-chevron centred on the viewport,
        // its bottom edge sitting just inside the viewport's own bottom
        // edge. Added to boardRoot (a sibling of dishBoardScroll, not a
        // child of it), so the mask never clips it and it draws on top of
        // whatever row happens to be underneath — a deliberate small
        // overlap with the last visible row's bottom, not a layout
        // reservation, so it costs no row height. Text rather than a hand-
        // drawn Graphics shape for the same reason nameLabel above uses
        // Text: one glyph, trivially centred, no path math to get wrong.
        const dishScrollHint = new Text({
            text: '▼',
            style: { fill: 0xffffff, fontSize: 26, fontWeight: '900', stroke: { color: 0x1b1b2b, width: 3 } },
        });
        dishScrollHint.anchor.set(0.5, 1);
        dishScrollHint.alpha = 0.85;
        dishScrollHint.position.set(dishRowCenterX, dishBoardViewport.y + dishBoardViewport.h - 4);
        boardRoot.addChild(dishScrollHint);
        // Present at rest (offset 0, > minOffset since minOffset is
        // negative) and gone once a drag/wheel reaches the floor exactly —
        // called once here for the initial state, then again after every
        // clamp below.
        function updateScrollHint(): void {
            dishScrollHint.visible = dishBoardScroll.y > minOffset;
        }
        updateScrollHint();

        let dragging = false;
        let dragStartY = 0;
        let scrollStartY = 0;
        // `e.global` is in the RENDERER's screen space (CSS px, matching
        // app.screen) — dishBoardScroll.y lives in design-space units, one
        // level inside kitchenStage.ts's contain-fit scale. Converting
        // through boardRoot.toLocal (the same idiom onTap below already
        // uses for its own hit-test) turns the pointer's screen-space
        // position into design-space directly, so the drag tracks the
        // finger 1:1 regardless of the current letterbox scale — a raw
        // `e.global.y` delta applied straight to dishBoardScroll.y would
        // under-move the content by exactly that scale factor.
        const onDown = (e: FederatedPointerEvent) => {
            dragging = true;
            dragStartY = boardRoot.toLocal(e.global).y;
            scrollStartY = dishBoardScroll.y;
        };
        const onMove = (e: FederatedPointerEvent) => {
            if (!dragging) return;
            const dy = boardRoot.toLocal(e.global).y - dragStartY;
            dishBoardScroll.y = Math.min(maxOffset, Math.max(minOffset, scrollStartY + dy));
            updateScrollHint();
        };
        const endDrag = () => { dragging = false; };
        dishBoardHitZone.on('pointerdown', onDown);
        app.stage.on('pointermove', onMove);
        app.stage.on('pointerup', endDrag);
        app.stage.on('pointerupoutside', endDrag);
        const onWheel = (e: WheelEvent) => {
            // Same scale correction as the drag handler above — deltaY is a
            // CSS-px-ish DOM value, not a design-space one.
            const dyDesign = e.deltaY / stage.root.scale.y;
            dishBoardScroll.y = Math.min(maxOffset, Math.max(minOffset, dishBoardScroll.y - dyDesign));
            updateScrollHint();
            e.preventDefault();
        };
        app.canvas.addEventListener('wheel', onWheel, { passive: false });
        extraCleanups.push(() => {
            dishBoardHitZone.off('pointerdown', onDown);
            app.stage.off('pointermove', onMove);
            app.stage.off('pointerup', endDrag);
            app.stage.off('pointerupoutside', endDrag);
            app.canvas.removeEventListener('wheel', onWheel);
        });
    }

    const sim = createKitchenSim(level);

    // Round 9, task 4 (narrowed by round 10): the round no longer starts at
    // scene creation — it waits for TestBelt.tsx's Ready button to call
    // Scene.start(). Until then `ready` stays false and tick() below does
    // nothing at all: no spawning, no timer, no HUD update. Round 10: slot
    // interaction is NOT gated on this any more — onTap works pre-Ready, so
    // a player can unlock and place props during setup while the belt itself
    // stays frozen (sim.step is never called, so spawned/elapsed/walkouts
    // all hold at 0 the whole time).
    let ready = false;
    // Round 10: the billboard's Walkouts/Coins readout must stay live during
    // setup too — the kitchen is no longer paused, so a player unlocking or
    // placing props needs to see their wallet move, not just infer it. Called
    // once below for the initial render, then again after every wallet
    // change (attemptUnlock, placeProp, sellProp) and every tick.
    function refreshHud(): void {
        const remaining = Math.max(0, level.walkoutsAllowed - sim.state.walkouts);
        const walkoutsMaxW = exitSignIcon ? HUD_MAX_W - exitSignIcon.width - EXIT_SIGN_GAP : HUD_MAX_W;
        // Round A, task 2: level.target was never rendered anywhere, so a
        // player saw walkouts counting down and dishes counting up with no
        // stated ceiling. `completed` (not `served`, which only counts
        // ingredient pickups) is what the sim actually checks against
        // target/bossClearAt (sim/kitchen.ts) — that's the number shown here,
        // under the player-facing label "Served" a finished dish earns.
        const objective =
            level.isBoss && level.bossClearAt !== null ? `  ·  Served ${sim.state.completed}/${level.bossClearAt}`
            : level.target !== null ? `  ·  Served ${sim.state.completed}/${level.target}`
            : '';
        setFitText(walkoutsText, `Walkouts Left : ${remaining}${objective}`, walkoutsMaxW, 26, 14);
        layoutWalkouts();

        // Round 20, task 2a: the icon's position is set once, outside this
        // function (it never moves); only the number's own width changes
        // here, growing the group rightward instead of re-centring it.
        setFitText(coinsText, `${wallet}`, COIN_GROUP_MAX_W - coinIcon.width - COIN_ICON_GAP, 44, 14);
        coinsText.position.set(COIN_GROUP_LEFT_X + coinIcon.width + COIN_ICON_GAP, COIN_GROUP_CENTER_Y);
    }
    refreshHud();
    function start(): void {
        if (ready) return;
        ready = true;
        // Round 7, task 2 (superseded): this used to fire at scene creation
        // ("shift starts == this scene's creation"). Round 9 moves it here —
        // the shift now starts on the Ready press, not on mount. A "Run
        // Again" remount recreates this scene from scratch with `ready`
        // false again, so it returns to the Ready state rather than
        // auto-starting.
        switchCue('service_low');
        prefetchCue('service_high');
        sfx.startWave();
    }
    // Per-run latch (KitchenMode §4's amendment) — see the tick loop below.
    // Scoped to this scene's closure, so a fresh scene each run resets it.
    let highTensionLatched = false;

    // Round 9, task 9: hats formula (LevelEconomy.md §7.3), frozen at the
    // exact instant of 'won'/'lost' alongside sim.state — see onShiftEnd.
    function computeEconomySnapshot(): EconomySnapshot {
        // Round 17, task 7: a boss pays LevelEconomy.md §7.3b/§10.3's
        // Σ(wave × 30) = 15n(n+1) for n waves (4 completions each) instead
        // of the ordinary per-dish/leftover/walkout-avoided/clear-bonus
        // formula below — a boss never "clears" in the win sense (`target`
        // is null; see sim/kitchen.ts), so its payout is about survival
        // depth, not completion. §10.3 ALSO settles a flat-50 payout on
        // every REPEAT clear, specifically so re-farming a boss can never
        // out-earn replaying an ordinary level — that needs SaveData.kitchen
        // to know "this is a repeat," which does not exist yet (round 17's
        // explicit boundary: no SaveData.kitchen/SAVE_KEY change, no
        // persisting first-clear state). So this always pays the FIRST-clear
        // formula, uncapped, until that persistence lands — do not add a
        // repeat branch without it.
        if (level.isBoss) {
            const waves = Math.floor(sim.state.completed / 4);
            const hats = 15 * waves * (waves + 1);
            return { wallet, coinsEarned: Math.max(100, coinsEarned), hats, dishCounts: [...dishCounts] };
        }
        const leftover = Object.values(sim.state.held).reduce((a, b) => a + b, 0);
        const H = KITCHEN_CONFIG.hats;
        const hats =
            sim.state.completed * H.perDish +
            leftover * H.perLeftover +
            (level.walkoutsAllowed - sim.state.walkouts) * H.perWalkoutAvoided +
            (sim.state.phase === 'won' ? H.clearBonus : 0);
        // Round 9, task 3: coinsEarned is floored at 100 for display/scoring
        // only — the underlying accumulator can dip lower, this just keeps a
        // heavy loss from ever showing (or scoring against) a negative.
        // Round 25, task 1: a copy, not the live `dishCounts` array — this is
        // a frozen snapshot, and the live array keeps mutating on every
        // 'completed' event after the end screen has already rendered it.
        return { wallet, coinsEarned: Math.max(100, coinsEarned), hats, dishCounts: [...dishCounts] };
    }

    // Round 9, task 5 (superseded by round 12; retired by round 18): unlock a
    // LOCKED slot for coins. Round 9's guard blocked ANY second unlock until
    // a prop was placed — safe, but stricter than it needed to be, and it
    // never checked affordability at all. Round 12: the guard now only
    // refuses an unlock that would leave the wallet unable to afford even the
    // cheapest utensil afterward, unless a prop already placed is earning —
    // LevelEconomy.md §7.2's actual failure mode (unlock, unlock again, land
    // on 0 with two open slots and no way to earn back the 40 a utensil
    // costs), not a stand-in for it. A well-funded player can now unlock two
    // slots before placing anything in either, which the old rule didn't
    // allow.
    //
    // Round 9's ORIGINAL purpose — teaching a first-timer the unlock-then-
    // place order — is not restored here. Round 18's FTUE Ready gate
    // (TestBelt.tsx, gated on `level.id === 'n0l1'`) replaces it more
    // completely: it doesn't just nudge the order, it makes starting a shift
    // with an empty board impossible in the first place, which is the actual
    // softlock round 9 was reacting to. Do not reintroduce a placement
    // precondition here.
    function attemptUnlock(i: number): void {
        if (filledSlotCount === 0 && wallet < KITCHEN_CONFIG.slotUnlockCost + KITCHEN_CONFIG.propTierCost[0]) {
            onMessage('Unlocking now would leave nothing for a utensil — place one first.');
            return;
        }
        if (wallet < KITCHEN_CONFIG.slotUnlockCost) {
            onMessage(`Not enough coins to unlock (${KITCHEN_CONFIG.slotUnlockCost} needed).`);
            return;
        }
        wallet -= KITCHEN_CONFIG.slotUnlockCost;
        slotLocked[i] = false;
        setSlotLockVisual(i, false);
        sfx.upgrade();
        onSlotsUnlockedChange(slotLocked.filter((l) => !l).length);
        refreshHud();
    }

    // Round 9, tasks 6-7: a filled slot's tap either serves (if a dish is in
    // reach and the prop isn't on cooldown) or, when there's nothing to
    // serve, offers to sell instead — reusing the tap rather than adding a
    // second gesture. A tap while on cooldown does nothing either way; the
    // dark sweep (drawCooldownOverlay) is what tells the player that.
    function attemptUseOrSell(i: number): void {
        if (cooldownRemaining[i] > 0) return;
        const before = sim.state.served;
        sim.tapSlot(i);
        if (sim.state.served > before) {
            cooldownRemaining[i] = KITCHEN_CONFIG.propCooldown;
            // Round 11: the per-grab cue, picked by the prop actually in
            // this slot — moved here from tick()'s 'served' branch (a
            // round-7 loose-fit sfx.shot('kitchen') stand-in) because this
            // is where the slot index is known. Only two props exist, so no
            // fallback case is needed.
            const propAlias = KITCHEN_CONFIG.levelProps[slotProp[i]!].alias;
            if (propAlias === 'prop-kettle-l1') playSample('kettle-boil');
            else if (propAlias === 'prop-water-dispenser-l1') playSample('water-pour');
            return;
        }
        const propInfo = KITCHEN_CONFIG.levelProps[slotProp[i]!];
        const cost = KITCHEN_CONFIG.propTierCost[propInfo.level - 1];
        const refund = Math.floor(cost * KITCHEN_CONFIG.propSellRefund);
        onSlotTapFilled(i, { name: propInfo.name, refund });
    }

    const onTap = (e: FederatedPointerEvent) => {
        // Round 10: no `ready` gate here — unlock, picker, place and sell
        // all work before the Ready press. tick()'s own `ready` guard is
        // what freezes the sim; this handler was never that guard's job.
        const local = boardRoot.toLocal(e.global);
        const { w, h } = KITCHEN_CONFIG.slotBox;
        for (let i = 0; i < KITCHEN_CONFIG.slots.length; i++) {
            const slot = KITCHEN_CONFIG.slots[i];
            if (Math.abs(local.x - slot.x) <= w / 2 && Math.abs(local.y - slot.y) <= h / 2) {
                // Round 9, task 5: locked comes before empty/filled — a
                // locked slot is neither.
                if (slotLocked[i]) attemptUnlock(i);
                // Round 5, task 3: an empty slot opens the picker instead of
                // serving — a station has to be set up before it can work.
                else if (slotProp[i] === null) onSlotTapEmpty(i, wallet);
                else attemptUseOrSell(i);
                break;
            }
        }
    };
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointertap', onTap);

    function syncDishes(): void {
        const alive = new Set<number>();
        for (const d of sim.state.dishes) {
            alive.add(d.uid);
            let g = dishViews.get(d.uid);
            if (!g) {
                g = makeIngredientView(d.kind);
                world.addChild(g);
                dishViews.set(d.uid, g);
            }
            g.position.set(d.x, d.y);
        }
        for (const [uid, g] of dishViews) {
            if (!alive.has(uid)) {
                g.destroy({ children: true });
                dishViews.delete(uid);
            }
        }
    }

    function syncSlots(): void {
        KITCHEN_CONFIG.slots.forEach((_, i) => {
            // Round 9, task 5: a locked slot never lights up as "filled" —
            // there's no prop there to receive anything, however close a
            // dish passes.
            if (slotLocked[i]) {
                slotSprites[i].texture = tex.slotEmpty;
                return;
            }
            // Round 6, task 2: a dish on a fridge connector stub never lights
            // a slot up, however close. Round 13: "in reach" is zone
            // membership, not radius — matches tapSlot's own SLOT_ZONES test
            // in sim/kitchen.ts exactly, so the highlight never lies about
            // tappability (a dish spatially close but in a neighbour's zone
            // must not light this slot up).
            const zone = SLOT_ZONES[i];
            const filled = sim.state.dishes.some(
                (d) => isEligibleDist(d.dist) && d.dist >= zone.start && d.dist < zone.end
            );
            slotSprites[i].texture = filled ? tex.slotFilled : tex.slotEmpty;
        });
    }

    const tick = (ticker: Ticker) => {
        // Round 9, task 4: nothing runs before the Ready press — no
        // spawning, no timer, no HUD update.
        if (!ready) return;
        const dt = Math.min(ticker.deltaMS, 50) / 1000;
        sim.step(dt);
        // Round 9, task 7: cooldowns count down every tick regardless of
        // events, and their sweep overlay redraws to match.
        for (let i = 0; i < cooldownRemaining.length; i++) {
            if (cooldownRemaining[i] > 0) cooldownRemaining[i] = Math.max(0, cooldownRemaining[i] - dt);
            drawCooldownOverlay(i);
        }
        for (const e of sim.drainEvents()) {
            // Round 7, task 3 / Round 8, task 7: sfx.shot() is a deliberate
            // loose-fit stand-in for a pickup (see file header) — resolved
            // for completion, which now has its own cue (sfx.upgrade()).
            // Both routed through the shared sfx object, never the synth
            // directly. Round 8, task 5: badges redraw on both events since
            // both change `held`. Round 9, task 3: both events also feed the
            // wallet/coinsEarned pair (kitchenConfig.ts's `coins` rates).
            if (e.type === 'served') {
                wallet += KITCHEN_CONFIG.coins.perGrab;
                coinsEarned += KITCHEN_CONFIG.coins.perGrab;
                // Round 11: the pickup cue moved to attemptUseOrSell, where
                // the slot (and so which prop fired) is known — resolves
                // round 7's flagged sfx.shot('kitchen') stand-in.
                syncBadges();
            } else if (e.type === 'completed') {
                wallet += KITCHEN_CONFIG.coins.perDish;
                coinsEarned += KITCHEN_CONFIG.coins.perDish;
                onCompletedDish(e.recipeIndex); sfx.upgrade(); syncBadges();
            } else if (e.type === 'walkout') {
                wallet -= KITCHEN_CONFIG.coins.walkoutCharge;
                coinsEarned -= KITCHEN_CONFIG.coins.walkoutCharge;
                // Round 11: floor is state-derived — see walletFloor() and
                // kitchenConfig.ts's `coins` comment.
                wallet = Math.max(walletFloor(), wallet);
                sfx.leak();
            }
            // Round 5, task 7: the end-screen fires off this event, not off
            // polling `state.phase` on a tick that may not run once the last
            // dish resolves. Round 9: also freezes the economy snapshot at
            // the same instant.
            else if (e.type === 'won') { onShiftEnd(sim.state, computeEconomySnapshot()); sfx.win(); }
            else if (e.type === 'lost') { onShiftEnd(sim.state, computeEconomySnapshot()); sfx.lose(); }
        }
        syncDishes();
        syncSlots();
        const remaining = Math.max(0, level.walkoutsAllowed - sim.state.walkouts);
        // Round 7, task 2: KitchenMode §4's amendment — proportional to the
        // belt's OWN walkoutsAllowed (5), not the tower defence's literal 3
        // (which reads there as CONFIG.economy.startLives * 0.3 = 3 of 10;
        // here it's walkoutsAllowed * 0.3 = 1.5, so it fires with 1 left).
        // `remaining > 0` guard, per §4: nothing costs more than one walkout
        // today so this can't yet land on the game-over screen, but the
        // guard costs nothing and stops that from becoming a silent landmine
        // later. Round 16: reads the active level's own walkoutsAllowed.
        if (!highTensionLatched && remaining > 0 && remaining < level.walkoutsAllowed * 0.3) {
            highTensionLatched = true;
            switchCue('service_high');
        }
        refreshHud();
        onChange(sim.state);
    };
    app.ticker.add(tick);

    return {
        start,
        placeProp,
        sellProp,
        destroy() {
            app.ticker.remove(tick);
            app.stage.off('pointertap', onTap);
            // Round 19: the dish board's drag/wheel listeners live on
            // app.stage and app.canvas, neither of which boardRoot.destroy()
            // below reaches.
            for (const cleanup of extraCleanups) cleanup();
            boardRoot.destroy({ children: true });
        },
    };
}
