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
// Round 3 art: real where it exists (manifest-listed), fallback everywhere
// else via `Assets.cache.has()` checks below — the fallback aliases
// (ing-tea-leaf/ing-sugar/ing-chai-masala) are never requested from Assets,
// only used as map keys, so no 404s from unlisted manifest entries.
const ROUND3_ALIASES = [...KITCHEN_CONFIG.levelProps, 'ing-milk', 'ing-ginger', ...KITCHEN_CONFIG.finalDishes];

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
    await Assets.load([...UI_ALIASES, ...ROUND3_ALIASES]);
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
    recipeNameText.position.set(BB.panelInner.x + BB.panelInner.width / 2, BB.lowerPanel.y + 40);
    boardRoot.addChild(recipeNameText);

    // Ingredient row — Specs.md §8b's overflow formula: [icon] + [icon] + ...
    // No ingredient art was authorized for the billboard row, so tiles stay
    // grey-box (§2.6): flat tint + a short label, not real sprites.
    //
    // Round 3, task 1: bottom-anchored, not centered. Every tile's bottom
    // edge sits exactly `rowInset` (40) above the panel's bottom edge — the
    // same 40 units the recipe name insets from the top — so the two gaps
    // are equal by construction, not by eyeballing.
    const { ingredients } = KITCHEN_CONFIG.recipe;
    const { innerWidth, plusWidth, pad, rowInset } = BB.ingredientRow;
    const n = ingredients.length;
    const slotSize = (innerWidth - (n - 1) * plusWidth - pad) / n;
    const rowWidth = n * slotSize + (n - 1) * plusWidth;
    const baseline = BB.lowerPanel.y + BB.lowerPanel.height - rowInset;
    const rowCenterX = BB.panelInner.x + BB.panelInner.width / 2;
    let cursorX = rowCenterX - rowWidth / 2;
    ingredients.forEach((key, i) => {
        const info = KIND_INFO.get(key);
        const tile = new Graphics();
        // Drawn above (0,0) so position.set(x, baseline) plants the tile's
        // BOTTOM edge on the baseline — anchor (0.5, 1) without needing
        // Graphics' pivot (which has no built-in anchor unlike Sprite/Text).
        tile.roundRect(-slotSize / 2, -slotSize, slotSize, slotSize, 6).fill(info?.color ?? 0x5a5a66);
        tile.position.set(cursorX + slotSize / 2, baseline);
        boardRoot.addChild(tile);
        const label = new Text({
            text: (info?.label ?? key).slice(0, 2).toUpperCase(),
            style: { fill: 0xffffff, fontSize: Math.max(10, slotSize * 0.3), fontWeight: '700' },
        });
        label.anchor.set(0.5);
        label.position.set(cursorX + slotSize / 2, baseline - slotSize / 2);
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
    KITCHEN_CONFIG.slots.forEach((slot, i) => {
        const alias = KITCHEN_CONFIG.levelProps[i % KITCHEN_CONFIG.levelProps.length];
        const propTex = Assets.get<Texture>(alias);
        const p = new Sprite(propTex);
        p.anchor.set(0.5);
        const { w: pw, h: ph } = KITCHEN_CONFIG.propSize;
        const fit = Math.min(pw / propTex.width, ph / propTex.height);
        p.width = propTex.width * fit;
        p.height = propTex.height * fit;
        p.position.set(slot.x, slot.y);
        boardRoot.addChild(p);
    });

    // Round 3, task 4: real sprite where manifest art exists (ing-milk,
    // ing-ginger), else a flat procedural tile keyed by the same kind string
    // — replicating textures.ts's art()-fallback pattern locally (see the
    // file header on why this doesn't import textures.ts itself).
    function makeIngredientView(kind: string): Container {
        const info = KIND_INFO.get(kind);
        const { w: dw, h: dh } = KITCHEN_CONFIG.dishSize;
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
            style: { fill: 0xffffff, fontSize: 16, fontWeight: '700' },
        });
        label.anchor.set(0.5);
        c.addChild(label);
        return c;
    }

    const world = new Container();
    boardRoot.addChild(world);
    const dishViews = new Map<number, Container>();

    // Round 3, task 5: the final-dish area shows served dishes round-robin
    // (dish-chai, dish-coffee) into a fixed grid pool, confined to
    // finalDishContent (y 1000-1160) — never the hamburgerReserve below it.
    const FD = KITCHEN_CONFIG.bands.finalDishContent;
    const { w: fdw, h: fdh } = KITCHEN_CONFIG.dishSize;
    const DISH_COLS = 6;
    const DISH_ROWS = 2;
    const DISH_GAP = 14;
    const dishPool: Sprite[] = [];
    {
        const totalW = DISH_COLS * fdw + (DISH_COLS - 1) * DISH_GAP;
        const totalH = DISH_ROWS * fdh + (DISH_ROWS - 1) * DISH_GAP;
        const startX = (KITCHEN_CONFIG.boardWidth - totalW) / 2 + fdw / 2;
        const startY = FD.y + (FD.height - totalH) / 2 + fdh / 2;
        for (let i = 0; i < DISH_COLS * DISH_ROWS; i++) {
            const col = i % DISH_COLS;
            const row = Math.floor(i / DISH_COLS);
            const s = new Sprite(Assets.get<Texture>(KITCHEN_CONFIG.finalDishes[0]));
            s.anchor.set(0.5);
            s.width = fdw;
            s.height = fdh;
            s.position.set(startX + col * (fdw + DISH_GAP), startY + row * (fdh + DISH_GAP));
            s.visible = false;
            boardRoot.addChild(s);
            dishPool.push(s);
        }
    }
    let servedCount = 0;
    function onServed(): void {
        const alias = KITCHEN_CONFIG.finalDishes[servedCount % KITCHEN_CONFIG.finalDishes.length];
        const sp = dishPool[servedCount % dishPool.length];
        sp.texture = Assets.get<Texture>(alias);
        sp.visible = true;
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
