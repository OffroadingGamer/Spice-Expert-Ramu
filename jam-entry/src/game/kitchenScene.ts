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
    type Ticker,
} from 'pixi.js';
import { CONFIG } from './config.ts';
import { KITCHEN_CONFIG } from './kitchenConfig.ts';
import { createKitchenSim, type KitchenState } from './sim/kitchen.ts';
import type { KitchenStage } from './kitchenStage.ts';

export interface Scene {
    destroy(): void;
}

const BAND_TINTS = {
    beltRun1: 0x33291c,
    stationRow: 0x1c2733,
    beltRun2: 0x33291c,
    finalDishArea: 0x27241c,
} as const;

type IngredientKind = (typeof KITCHEN_CONFIG.ingredientKinds)[number];
const KIND_INFO = new Map<string, IngredientKind>(KITCHEN_CONFIG.ingredientKinds.map((k) => [k.key, k]));

const UI_ALIASES = ['ui-slot-empty', 'ui-slot-filled', 'ui-hotbar', 'ui-container', 'ui-billboard'];
// Baked art across rounds 3-4: real where it exists (manifest-listed),
// fallback everywhere else via `Assets.cache.has()` checks below — the
// fallback aliases (ing-tea-leaf/ing-sugar/ing-chai-masala) are never
// requested from Assets, only used as map keys, so no 404s from unlisted
// manifest entries.
const BAKED_ALIASES = [
    ...KITCHEN_CONFIG.levelProps.map((p) => p.alias),
    'ing-milk',
    'ing-ginger',
    ...KITCHEN_CONFIG.finalDishes,
    'prop-fridge',
];

/**
 * @param onChange fires once per tick with the latest sim state, so a React
 *                 overlay (ui/TestBelt.tsx) can show the win/lose banner
 *                 without this scene touching the shared app store.
 */
export async function createKitchenScene(
    app: Application,
    stage: KitchenStage,
    onChange: (s: KitchenState) => void
): Promise<Scene> {
    // Manifest-listed (deferred bundle) — load on demand rather than trust
    // background-load timing, so Test Mode never races its own art.
    await Assets.load([...UI_ALIASES, ...BAKED_ALIASES]);
    const tex = {
        slotEmpty: Assets.get<Texture>('ui-slot-empty'),
        slotFilled: Assets.get<Texture>('ui-slot-filled'),
        hotbar: Assets.get<Texture>('ui-hotbar'),
        container: Assets.get<Texture>('ui-container'),
        billboard: Assets.get<Texture>('ui-billboard'),
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
    // rather than just stopping beside it. Stretched to fill (not
    // aspect-fit) per the handover's accepted squash.
    const fridgeBox = KITCHEN_CONFIG.fridge;
    const fridgeSprite = new Sprite(Assets.get<Texture>('prop-fridge'));
    fridgeSprite.anchor.set(0.5);
    fridgeSprite.width = fridgeBox.w;
    fridgeSprite.height = fridgeBox.h;
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

    const walkoutsText = new Text({
        text: '',
        style: { fill: 0x1b1b2b, fontSize: 26, fontWeight: '800' },
    });
    walkoutsText.anchor.set(0.5);
    walkoutsText.position.set(
        BB.panelInner.x + BB.panelInner.width / 2,
        BB.upperPanel.y + BB.upperPanel.height / 2
    );
    boardRoot.addChild(walkoutsText);

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
        style: { fill: 0xffffff, fontSize: 24, fontWeight: '700' },
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
    const { innerWidth, plusWidth, pad, labelHeight, labelGap } = BB.ingredientRow;
    const n = ingredients.length;
    const slotSize = (innerWidth - (n - 1) * plusWidth - pad) / n;
    const rowWidth = n * slotSize + (n - 1) * plusWidth;
    const baseline = BB.lowerPanel.y + BB.lowerPanel.height - BB.contentInset;
    const rowCenterX = BB.panelInner.x + BB.panelInner.width / 2;
    const spriteBoxH = slotSize - labelHeight - labelGap;
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

        cursorX += slotSize;
        if (i < n - 1) {
            const plus = new Text({ text: '+', style: { fill: 0xffffff, fontSize: 22, fontWeight: '700' } });
            plus.anchor.set(0.5);
            plus.position.set(cursorX + plusWidth / 2, baseline - slotSize / 2);
            boardRoot.addChild(plus);
            cursorX += plusWidth;
        }
    });

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
        const suffix = ` - Level ${level}`;
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
    function fitText(text: string, maxWidth: number, baseSize: number, minSize: number): Text {
        let size = baseSize;
        const t = new Text({ text, style: { fill: 0xffffff, fontSize: size, fontWeight: '600' } });
        while (t.width > maxWidth && size > minSize) {
            size -= 1;
            t.style.fontSize = size;
        }
        return t;
    }

    // ---- station slots, 2x2 -------------------------------------------------
    // Round 3, task 3: each slot also carries a fixed station prop, assigned
    // round-robin from levelProps — always visible (it identifies the
    // station), on top of the empty/filled background that tracks occupancy.
    const slotSprites = KITCHEN_CONFIG.slots.map((slot) => {
        const s = new Sprite(tex.slotEmpty);
        s.anchor.set(0.5);
        s.width = KITCHEN_CONFIG.slotBox.w;
        s.height = KITCHEN_CONFIG.slotBox.h;
        s.position.set(slot.x, slot.y);
        boardRoot.addChild(s);
        return s;
    });
    // Round 4, task 2: prop anchored (0.5, 0) at the box's top inner edge
    // (aspect-fit, unchanged), with a one-line "Name… - Level N" label
    // beneath it, both inside the 139x150 slotBox.
    KITCHEN_CONFIG.slots.forEach((slot, i) => {
        const propInfo = KITCHEN_CONFIG.levelProps[i % KITCHEN_CONFIG.levelProps.length];
        const propTex = Assets.get<Texture>(propInfo.alias);
        const p = new Sprite(propTex);
        p.anchor.set(0.5, 0);
        const { w: pw, h: ph } = KITCHEN_CONFIG.propSize;
        const fit = Math.min(pw / propTex.width, ph / propTex.height);
        p.width = propTex.width * fit;
        p.height = propTex.height * fit;
        const topY = slot.y - KITCHEN_CONFIG.slotBox.h / 2 + KITCHEN_CONFIG.propLabelTopPad;
        p.position.set(slot.x, topY);
        boardRoot.addChild(p);

        const labelMaxWidth = KITCHEN_CONFIG.slotBox.w - 10;
        const label = new Text({
            text: formatPropLabel(propInfo.name, propInfo.level, labelMaxWidth),
            style: PROP_LABEL_STYLE,
        });
        label.anchor.set(0.5, 0);
        label.position.set(slot.x, topY + p.height + KITCHEN_CONFIG.propLabelGap);
        boardRoot.addChild(label);
    });

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
    const dishViews = new Map<number, Container>();

    // Round 4, task 1: one entry per dish type — [sprite] x[count] — instead
    // of round 3's accumulating 12-slot pool. A type with zero served stays
    // hidden entirely (not shown as x0). Both entries stay inside
    // finalDishContent (y 1000-1160); hamburgerReserve (1160-1280) is never
    // touched. Which type a given served dish counts as still round-robins
    // by servedCount parity — the sim has no recipe-outcome concept (see
    // finalDishes' own comment in kitchenConfig.ts).
    const FD = KITCHEN_CONFIG.bands.finalDishContent;
    const { w: fdw, h: fdh } = KITCHEN_CONFIG.dishSize;
    const entryY = FD.y + FD.height / 2;
    const dishCounts = KITCHEN_CONFIG.finalDishes.map(() => 0);
    const dishEntrySprites = KITCHEN_CONFIG.finalDishes.map((alias) => {
        const s = new Sprite(Assets.get<Texture>(alias));
        s.anchor.set(0.5);
        s.width = fdw;
        s.height = fdh;
        s.visible = false;
        boardRoot.addChild(s);
        return s;
    });
    const dishCountTexts = KITCHEN_CONFIG.finalDishes.map(() => {
        const t = new Text({ text: '', style: { fill: 0xffffff, fontSize: 24, fontWeight: '800' } });
        t.anchor.set(0, 0.5);
        t.visible = false;
        boardRoot.addChild(t);
        return t;
    });
    function layoutDishEntry(i: number): void {
        const count = dishCounts[i];
        dishEntrySprites[i].visible = count > 0;
        dishCountTexts[i].visible = count > 0;
        if (count === 0) return;
        dishCountTexts[i].text = `×${count}`;
        const centerX = KITCHEN_CONFIG.finalDishSlotX[i];
        const gap = 10;
        const totalW = fdw + gap + dishCountTexts[i].width;
        const spriteX = centerX - totalW / 2 + fdw / 2;
        dishEntrySprites[i].position.set(spriteX, entryY);
        dishCountTexts[i].position.set(spriteX + fdw / 2 + gap, entryY);
    }
    let servedCount = 0;
    function onServed(): void {
        const i = servedCount % KITCHEN_CONFIG.finalDishes.length;
        dishCounts[i]++;
        layoutDishEntry(i);
        servedCount++;
    }

    const sim = createKitchenSim();

    const onTap = (e: FederatedPointerEvent) => {
        const local = boardRoot.toLocal(e.global);
        const { w, h } = KITCHEN_CONFIG.slotBox;
        for (let i = 0; i < KITCHEN_CONFIG.slots.length; i++) {
            const slot = KITCHEN_CONFIG.slots[i];
            if (Math.abs(local.x - slot.x) <= w / 2 && Math.abs(local.y - slot.y) <= h / 2) {
                sim.tapSlot(i);
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
            const filled = sim.state.dishes.some(
                (d) => Math.hypot(d.x - slot.x, d.y - slot.y) <= KITCHEN_CONFIG.slotReach
            );
            slotSprites[i].texture = filled ? tex.slotFilled : tex.slotEmpty;
        });
    }

    const tick = (ticker: Ticker) => {
        const dt = Math.min(ticker.deltaMS, 50) / 1000;
        sim.step(dt);
        for (const e of sim.drainEvents()) {
            if (e.type === 'served') onServed();
        }
        syncDishes();
        syncSlots();
        const remaining = Math.max(0, KITCHEN_CONFIG.walkoutsAllowed - sim.state.walkouts);
        walkoutsText.text = `Walkouts Left : ${remaining}`;
        onChange(sim.state);
    };
    app.ticker.add(tick);

    return {
        destroy() {
            app.ticker.remove(tick);
            app.stage.off('pointertap', onTap);
            boardRoot.destroy({ children: true });
        },
    };
}
