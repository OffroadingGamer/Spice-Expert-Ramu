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
import { BELT_LENGTH, createKitchenSim, isEligibleDist, posAt, type KitchenState } from './sim/kitchen.ts';
import type { KitchenStage } from './kitchenStage.ts';

/** Round 9: a frozen snapshot of the economy at shift end, passed alongside
 *  KitchenState to onShiftEnd — sim/kitchen.ts has no notion of coins. */
export interface EconomySnapshot {
    wallet: number;
    /** Floored at 100 for display/scoring — see kitchenConfig.ts's `coins`. */
    coinsEarned: number;
    hats: number;
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
    /** Round 5, task 3: an empty slot was tapped — show the prop picker. */
    onSlotTapEmpty(slotIndex: number): void;
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

type IngredientKind = (typeof KITCHEN_CONFIG.ingredientKinds)[number];
const KIND_INFO = new Map<string, IngredientKind>(KITCHEN_CONFIG.ingredientKinds.map((k) => [k.key, k]));

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
const BAKED_ALIASES = [
    ...KITCHEN_CONFIG.levelProps.map((p) => p.alias),
    'ing-milk',
    'ing-ginger',
    ...KITCHEN_CONFIG.finalDishes,
    'prop-fridge',
];

/**
 * `callbacks` lets a React overlay (ui/TestBelt.tsx) show the live HUD and
 * the win/lose banner, and drive the prop picker, without this scene
 * touching the shared app store. See KitchenSceneCallbacks above.
 */
export async function createKitchenScene(
    app: Application,
    stage: KitchenStage,
    callbacks: KitchenSceneCallbacks
): Promise<Scene> {
    const { onChange, onShiftEnd, onSlotTapEmpty, onSlotTapFilled, onSlotsFilledChange, onSlotsUnlockedChange, onMessage } = callbacks;
    // Manifest-listed (deferred bundle) — load on demand rather than trust
    // background-load timing, so Test Mode never races its own art.
    await Assets.load([...UI_ALIASES, ...BAKED_ALIASES]);
    const tex = {
        slotEmpty: Assets.get<Texture>('ui-slot-empty'),
        slotFilled: Assets.get<Texture>('ui-slot-filled'),
        hotbar: Assets.get<Texture>('ui-hotbar'),
        container: Assets.get<Texture>('ui-container'),
        billboard: Assets.get<Texture>('ui-billboard'),
        badgeCount: Assets.get<Texture>('ui-badge-count'),
        coin: Assets.get<Texture>('ui-coin'),
    };

    // A child of stage.root, not stage.root itself — kitchenStage.ts's
    // caller (TestBelt.tsx) destroys the stage separately, after this scene.
    const boardRoot = new Container();
    stage.root.addChild(boardRoot);

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

    // Round 9, task 8: the upper panel splits left/right — Walkouts Left on
    // the left quarter-centre, Coins on the right, both at the panel's
    // vertical centre. `HUD_MAX_W` keeps a four-digit wallet from
    // overflowing into the other half, via `setFitText` below (same
    // shrink-to-fit discipline as the ingredient row's `fitText`, but
    // mutating an existing Text in place rather than recreating one every
    // tick — these two update every frame, badges only on an event).
    const HUD_MAX_W = BB.panelInner.width / 2 - 24;
    const hudY = BB.upperPanel.y + BB.upperPanel.height / 2;
    const walkoutsText = new Text({
        text: '',
        style: { fill: 0x1b1b2b, fontSize: 26, fontWeight: '800' },
    });
    walkoutsText.anchor.set(0.5);
    walkoutsText.position.set(BB.panelInner.x + BB.panelInner.width / 4, hudY);
    boardRoot.addChild(walkoutsText);

    // Round 11: the word "Coins" is replaced by the baked ui-coin icon —
    // icon height matched to the text's own base size (26), then a small
    // gap, then the number. The number's own max width shrinks by the
    // icon+gap first, so the group's total width still can't exceed
    // HUD_MAX_W and collide with walkoutsText, same bound the bare text used
    // to respect.
    //
    // Round 12a: the group is RIGHT-ANCHORED, not centred on the panel's
    // right quarter-point. Centring suited the old fixed-width "Coins : N"
    // string but not an icon plus a 1-3 digit number: a narrow group left a
    // visible gap to the panel's right edge while sitting far from
    // walkoutsText. Anchoring the right edge also keeps the readout still as
    // the digit count changes — a centred group shifts BOTH of its ends on
    // every coin gained. The collision bound holds by construction: the
    // group is at most HUD_MAX_W wide, so its left edge cannot reach the
    // panel's midpoint.
    const COIN_ICON_H = 26;
    const COIN_ICON_GAP = 6;
    // The same 24 HUD_MAX_W reserves off the half-width — one inset for this
    // block, so the right margin and the collision slack can't drift apart.
    const HUD_RIGHT_INSET = 24;
    const coinIcon = new Sprite(tex.coin);
    coinIcon.anchor.set(0.5);
    coinIcon.height = COIN_ICON_H;
    coinIcon.width = tex.coin.width * (COIN_ICON_H / tex.coin.height);
    boardRoot.addChild(coinIcon);

    const coinsText = new Text({
        text: '',
        style: { fill: 0x1b1b2b, fontSize: 26, fontWeight: '800' },
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

    const recipeNameText = new Text({
        text: KITCHEN_CONFIG.recipe.name,
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

    // Ingredient row — Specs.md §8b's overflow formula: [icon] + [icon] + ...
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
    const { ingredients } = KITCHEN_CONFIG.recipe;
    const { innerWidth, plusWidth, pad, labelHeight, labelGap, capN } = BB.ingredientRow;
    const n = ingredients.length;
    // Round 7, task 1: fixed sprite size, computed at the capN cap — a
    // shorter recipe (n=3 today) is a shorter, centred row at the SAME tile
    // size a capN-length row would use, not a bigger one. §8b's own
    // shrink-to-fit formula (divided by the actual n) is kept as the
    // fallback past the cap, so a 6-ingredient recipe still can't overflow.
    const slotSize = n <= capN
        ? (innerWidth - (capN - 1) * plusWidth - pad) / capN
        : (innerWidth - (n - 1) * plusWidth - pad) / n;
    const rowWidth = n * slotSize + (n - 1) * plusWidth;
    const baseline = BB.lowerPanel.y + BB.lowerPanel.height - BB.contentInset;
    const rowCenterX = BB.panelInner.x + BB.panelInner.width / 2;
    const spriteBoxH = slotSize - labelHeight - labelGap;
    // Round 8, task 5: top of each ingredient's sprite box — the badge sits
    // at this row's top-right corner, 4 units in from each edge.
    const spriteTop = baseline - labelHeight - labelGap - spriteBoxH;
    // Badge: 36 design units wide, native aspect (291x305) preserved — never
    // squashed (round 5's fridge mistake, see kitchenConfig.ts's `fridge`
    // comment). Digit fit against the badge's clear interior (159/291 of its
    // width, per the source glyph's own bbox).
    const BADGE_W = 36;
    const badgeH = BADGE_W * (tex.badgeCount.height / tex.badgeCount.width);
    const badgeDigitMaxW = (159 / 291) * BADGE_W;
    const badgeDigits: { key: string; cx: number; cy: number; text: Text }[] = [];
    let cursorX = rowCenterX - rowWidth / 2;
    ingredients.forEach((key, i) => {
        const info = KIND_INFO.get(key);
        const cx = cursorX + slotSize / 2;

        const view = makeIngredientView(key, slotSize, spriteBoxH);
        // makeIngredientView anchors its content around (0,0); position it
        // so its own bottom edge lands directly above the name text below.
        view.position.set(cx, baseline - labelHeight - labelGap - spriteBoxH / 2);
        boardRoot.addChild(view);

        const label = fitText(info?.label ?? key, slotSize, 13, 8);
        label.anchor.set(0.5, 1);
        label.position.set(cx, baseline);
        boardRoot.addChild(label);

        // Round 8, task 5: live badge counter — a checklist, not a score, so
        // it starts at 0 and stays visible at 0 (confirmed by the user).
        const badgeCx = cx + slotSize / 2 - 4;
        const badgeCy = spriteTop + 4;
        const badge = new Sprite(tex.badgeCount);
        badge.anchor.set(0.5);
        badge.width = BADGE_W;
        badge.height = badgeH;
        badge.position.set(badgeCx, badgeCy);
        boardRoot.addChild(badge);
        const digit = fitText('0', badgeDigitMaxW, 20, 8, { fill: 0xfdfae7, fontWeight: '700' });
        digit.anchor.set(0.5);
        // The source sprite carries a bottom drop shadow, so its visual
        // centre sits slightly above its geometric one — a sub-unit
        // correction, applied because it's free and correct, not because
        // it's visible at this size.
        digit.position.set(badgeCx, badgeCy - badgeH * 0.026);
        boardRoot.addChild(digit);
        badgeDigits.push({ key, cx: badgeCx, cy: badgeCy - badgeH * 0.026, text: digit });

        cursorX += slotSize;
        if (i < n - 1) {
            const plus = new Text({ text: '+', style: { fill: 0xffffff, fontSize: 22, fontWeight: '700' } });
            plus.anchor.set(0.5);
            plus.position.set(cursorX + plusWidth / 2, baseline - slotSize / 2);
            boardRoot.addChild(plus);
            cursorX += plusWidth;
        }
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
            const t = fitText(text, badgeDigitMaxW, 20, 8, { fill: 0xfdfae7, fontWeight: '700' });
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

    // ---- Round 9: the coin economy (wallet/coinsEarned/locks/cooldown) ----
    // Lives entirely in this closure — sim/kitchen.ts has no notion of any
    // of it (see the file header). Round 11 replaced the one-way
    // `hasEverPlacedProp` lift with the state-derived `walletFloor()` below,
    // which re-reads live state every time it's applied.
    let wallet: number = KITCHEN_CONFIG.coins.startingFloat;
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
        return KITCHEN_CONFIG.coins.startingFloat;
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
    const lockIcons = KITCHEN_CONFIG.slots.map((slot) => {
        const t = new Text({ text: '\u{1F512}', style: { fontSize: 40 } });
        t.anchor.set(0.5);
        t.position.set(slot.x, slot.y);
        boardRoot.addChild(t);
        return t;
    });
    function setSlotLockVisual(i: number, locked: boolean): void {
        slotSprites[i].tint = locked ? 0x555566 : 0xffffff;
        lockIcons[i].visible = locked;
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
        const { w: pw, h: ph } = KITCHEN_CONFIG.propSize;
        const fit = Math.min(pw / propTex.width, ph / propTex.height);
        p.width = propTex.width * fit;
        p.height = propTex.height * fit;
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

    // ---- Round 12, task 1: the reach overlay --------------------------------
    // A translucent band along the belt showing exactly which stretch a
    // placed station can serve from. Added to `world` right here — before
    // any dish view exists — so every dish, present or future, draws on top
    // of it with no z-order fuss.
    //
    // The predicate is copied exactly from sim/kitchen.ts's tapSlot: a point
    // at distance `d` is in reach of `slot` iff isEligibleDist(d) AND
    // hypot(posAt(d) - slot) <= slotReach. Sampling posAt() at a fine step
    // (not recomputing beltPath's polyline here) is what keeps this overlay
    // from ever drifting out of agreement with the sim — corners fall out of
    // posAt's own segment walk for free, so tracing sampled points already
    // "follows the corners" without this file needing to know where they are.
    //
    // Geometry (beltPath/slots/slotReach) is static, so every slot's bands
    // are computed exactly once, right here at scene creation — never in the
    // tick loop.
    const REACH_STEP = 0.25;
    const REACH_COLOR = 0x39d1ff;
    const REACH_ALPHA = 0.32;
    interface ReachBand {
        start: number;
        end: number;
        points: { x: number; y: number }[];
    }
    function computeReachBands(slot: { x: number; y: number }): ReachBand[] {
        const bands: ReachBand[] = [];
        let current: ReachBand | null = null;
        for (let d = 0; d <= BELT_LENGTH; d += REACH_STEP) {
            const p = posAt(d);
            const inReach = isEligibleDist(d) && Math.hypot(p.x - slot.x, p.y - slot.y) <= KITCHEN_CONFIG.slotReach;
            if (inReach) {
                if (!current) {
                    current = { start: d, end: d, points: [] };
                    bands.push(current);
                }
                current.end = d;
                current.points.push(p);
            } else {
                current = null;
            }
        }
        return bands;
    }
    const reachBands: ReachBand[][] = KITCHEN_CONFIG.slots.map(computeReachBands);

    const reachOverlays = KITCHEN_CONFIG.slots.map((_, i) => {
        const g = new Graphics();
        for (const band of reachBands[i]) {
            if (band.points.length < 2) continue;
            g.moveTo(band.points[0].x, band.points[0].y);
            for (let k = 1; k < band.points.length; k++) g.lineTo(band.points[k].x, band.points[k].y);
            // Round 12a: `butt` cap and exactly pathWidth, not `round` and
            // pathWidth+14. A round cap extends a stroke by half its width
            // BEYOND each endpoint — at width 86 that drew 43 units of band
            // past both ends, so every band rendered 86 units longer than the
            // stretch it actually accepts (+23% on the left slots) and the
            // drawn right-hand overlap read 318 units against a true 232.
            // The overlay's whole justification is that it cannot disagree
            // with tapSlot, and a decorative cap was doing exactly that, in
            // the worst direction: it invited taps just outside the window.
            // `join` stays round — that shapes the belt's own corners, which
            // are mid-band, not band ends.
            g.stroke({
                width: CONFIG.sizes.pathWidth,
                color: REACH_COLOR,
                alpha: REACH_ALPHA,
                cap: 'butt',
                join: 'round',
            });
        }
        g.visible = false;
        world.addChild(g);
        return g;
    });
    // Visibility mirrors slotProp[i] !== null — called from the same two
    // places that already fire onSlotsFilledChange (placeProp, sellProp), and
    // gated on nothing else, so it's live during setup, before Ready.
    function updateReachOverlay(i: number): void {
        reachOverlays[i].visible = slotProp[i] !== null;
    }

    const dishViews = new Map<number, Container>();

    // Round 4, task 1: one entry per dish type — [sprite] x[count] — instead
    // of round 3's accumulating 12-slot pool. A type with zero served stays
    // hidden entirely (not shown as x0). Stays inside finalDishContent
    // (y 1000-1160); hamburgerReserve (1160-1280) is never touched.
    //
    // Round 5, task 1: chai only — finalDishes has exactly one entry, so
    // there's no round-robin left to do (dropped rather than kept as dead
    // `% 1` arithmetic, per the handover).
    // Round 5, task 8: drawn at finalDishSize (205x136, native aspect
    // preserved) — the room a two-dish grid used to split, now given whole
    // to the one dish this FTUE level actually serves. Count text sized to
    // match.
    const FD = KITCHEN_CONFIG.bands.finalDishContent;
    const { w: fdw, h: fdh } = KITCHEN_CONFIG.finalDishSize;
    const entryY = FD.y + FD.height / 2;
    let dishCount = 0;
    const dishEntrySprite = new Sprite(Assets.get<Texture>(KITCHEN_CONFIG.finalDishes[0]));
    dishEntrySprite.anchor.set(0.5);
    dishEntrySprite.width = fdw;
    dishEntrySprite.height = fdh;
    dishEntrySprite.visible = false;
    boardRoot.addChild(dishEntrySprite);
    const dishCountText = new Text({ text: '', style: { fill: 0xffffff, fontSize: 44, fontWeight: '800' } });
    dishCountText.anchor.set(0, 0.5);
    dishCountText.visible = false;
    boardRoot.addChild(dishCountText);
    function layoutDishEntry(): void {
        dishEntrySprite.visible = dishCount > 0;
        dishCountText.visible = dishCount > 0;
        if (dishCount === 0) return;
        dishCountText.text = `×${dishCount}`;
        const centerX = KITCHEN_CONFIG.finalDishSlotX[0];
        const gap = 16;
        const totalW = fdw + gap + dishCountText.width;
        const spriteX = centerX - totalW / 2 + fdw / 2;
        dishEntrySprite.position.set(spriteX, entryY);
        dishCountText.position.set(spriteX + fdw / 2 + gap, entryY);
    }
    // Round 8, task 6: fires on 'completed' only, not on every pickup — the
    // ×N under the belt is now the number of chai actually made, which is
    // what it has always looked like it meant.
    function onCompletedDish(): void {
        dishCount++;
        layoutDishEntry();
    }

    const sim = createKitchenSim();

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
        const remaining = Math.max(0, KITCHEN_CONFIG.walkoutsAllowed - sim.state.walkouts);
        setFitText(walkoutsText, `Walkouts Left : ${remaining}`, HUD_MAX_W, 26, 14);
        // Round 11: the icon consumes width setFitText previously had —
        // shrink its budget by the icon+gap so (icon+gap+number) still fits
        // HUD_MAX_W as a group.
        setFitText(coinsText, `${wallet}`, HUD_MAX_W - coinIcon.width - COIN_ICON_GAP, 26, 14);
        // Round 12a: right-anchored — see the coinIcon block above.
        const groupRight = BB.panelInner.x + BB.panelInner.width - HUD_RIGHT_INSET;
        const groupLeft = groupRight - (coinIcon.width + COIN_ICON_GAP + coinsText.width);
        coinIcon.position.set(groupLeft + coinIcon.width / 2, hudY);
        coinsText.position.set(groupLeft + coinIcon.width + COIN_ICON_GAP, hudY);
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
        const leftover = Object.values(sim.state.held).reduce((a, b) => a + b, 0);
        const H = KITCHEN_CONFIG.hats;
        const hats =
            sim.state.completed * H.perDish +
            leftover * H.perLeftover +
            (KITCHEN_CONFIG.walkoutsAllowed - sim.state.walkouts) * H.perWalkoutAvoided +
            (sim.state.phase === 'won' ? H.clearBonus : 0);
        // Round 9, task 3: coinsEarned is floored at 100 for display/scoring
        // only — the underlying accumulator can dip lower, this just keeps a
        // heavy loss from ever showing (or scoring against) a negative.
        return { wallet, coinsEarned: Math.max(100, coinsEarned), hats };
    }

    // Round 9, task 5 (superseded by round 12): unlock a LOCKED slot for
    // coins. Round 9's guard blocked ANY second unlock until a prop was
    // placed — safe, but stricter than it needed to be, and it never checked
    // affordability at all. Round 12: the guard now only refuses an unlock
    // that would leave the wallet unable to afford even the cheapest utensil
    // afterward, unless a prop already placed is earning — LevelEconomy.md
    // §7.2's actual failure mode (unlock, unlock again, land on 0 with two
    // open slots and no way to earn back the 40 a utensil costs), not a
    // stand-in for it. A well-funded player can now unlock two slots before
    // placing anything in either, which the old rule didn't allow.
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
                else if (slotProp[i] === null) onSlotTapEmpty(i);
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
        KITCHEN_CONFIG.slots.forEach((slot, i) => {
            // Round 9, task 5: a locked slot never lights up as "filled" —
            // there's no prop there to receive anything, however close a
            // dish passes.
            if (slotLocked[i]) {
                slotSprites[i].texture = tex.slotEmpty;
                return;
            }
            // Round 6, task 2: a dish on a fridge connector stub never lights
            // a slot up, however close — matches tapSlot's own gate in
            // sim/kitchen.ts, so the highlight never lies about tappability.
            const filled = sim.state.dishes.some(
                (d) => isEligibleDist(d.dist) && Math.hypot(d.x - slot.x, d.y - slot.y) <= KITCHEN_CONFIG.slotReach
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
                onCompletedDish(); sfx.upgrade(); syncBadges();
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
        const remaining = Math.max(0, KITCHEN_CONFIG.walkoutsAllowed - sim.state.walkouts);
        // Round 7, task 2: KitchenMode §4's amendment — proportional to the
        // belt's OWN walkoutsAllowed (5), not the tower defence's literal 3
        // (which reads there as CONFIG.economy.startLives * 0.3 = 3 of 10;
        // here it's walkoutsAllowed * 0.3 = 1.5, so it fires with 1 left).
        // `remaining > 0` guard, per §4: nothing costs more than one walkout
        // today so this can't yet land on the game-over screen, but the
        // guard costs nothing and stops that from becoming a silent landmine
        // later.
        if (!highTensionLatched && remaining > 0 && remaining < KITCHEN_CONFIG.walkoutsAllowed * 0.3) {
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
            boardRoot.destroy({ children: true });
        },
    };
}
