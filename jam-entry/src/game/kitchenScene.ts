/**
 * TEST MODE ONLY — the rendered view over sim/kitchen.ts. The billboard
 * (ui-billboard + ui-hotbar + ui-container, from the demo tier of a
 * commercial UI pack — private-build only, see KitchenMode.md §2.6) is the
 * entire HUD; everything else stays grey-box. No manifest art beyond the
 * five listed aliases, no Kitchen Props sprites (Plan item 51: those are a
 * background layer at their own scale, never a belt sprite).
 *
 * Isolated from the live board: does not import config.ts, textures.ts,
 * towerScene.ts, sim/engine.ts, or stage.ts (see kitchenStage.ts).
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
    propTray: 0x27241c,
} as const;

const DISH_COLOR = 0xff6b1a; // matches CONFIG.colors.pathEdge, the "hot ticket" tone
const INGREDIENT_COLORS = [0x8a5a33, 0x5fbf4a, 0xf5c542, 0xe25822, 0x9d8ec4, 0x3a5683];

const UI_ALIASES = ['ui-slot-empty', 'ui-slot-filled', 'ui-hotbar', 'ui-container', 'ui-billboard'];

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
    await Assets.load(UI_ALIASES);
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
    band(B.propTray.y, B.propTray.height, BAND_TINTS.propTray);

    const propLabel = new Text({
        text: 'PROP TRAY (prop-kettle, prop-tray)',
        style: { fill: 0xffffff, fontSize: 22, fontWeight: '700' },
    });
    propLabel.anchor.set(0.5);
    propLabel.alpha = 0.55;
    propLabel.position.set(KITCHEN_CONFIG.boardWidth / 2, B.propTray.y + B.propTray.height / 2);
    boardRoot.addChild(propLabel);

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
    // No ingredient art was authorized for this handover, so tiles are
    // grey-box (§2.6): flat tint + a short label, not real sprites.
    const { ingredients } = KITCHEN_CONFIG.recipe;
    const { innerWidth, plusWidth, pad } = BB.ingredientRow;
    const n = ingredients.length;
    const slotSize = (innerWidth - (n - 1) * plusWidth - pad) / n;
    const rowWidth = n * slotSize + (n - 1) * plusWidth;
    const rowY = BB.lowerPanel.y + BB.lowerPanel.height - 40;
    const rowCenterX = BB.panelInner.x + BB.panelInner.width / 2;
    let cursorX = rowCenterX - rowWidth / 2;
    ingredients.forEach((name, i) => {
        const tile = new Graphics();
        tile.roundRect(0, 0, slotSize, slotSize, 6).fill(INGREDIENT_COLORS[i % INGREDIENT_COLORS.length]);
        tile.pivot.set(slotSize / 2, slotSize / 2);
        tile.position.set(cursorX + slotSize / 2, rowY);
        boardRoot.addChild(tile);
        const label = new Text({
            text: name.slice(0, 2).toUpperCase(),
            style: { fill: 0xffffff, fontSize: Math.max(10, slotSize * 0.3), fontWeight: '700' },
        });
        label.anchor.set(0.5);
        label.position.set(cursorX + slotSize / 2, rowY);
        boardRoot.addChild(label);
        cursorX += slotSize;
        if (i < n - 1) {
            const plus = new Text({ text: '+', style: { fill: 0xffffff, fontSize: 22, fontWeight: '700' } });
            plus.anchor.set(0.5);
            plus.position.set(cursorX + plusWidth / 2, rowY);
            boardRoot.addChild(plus);
            cursorX += plusWidth;
        }
    });

    // ---- station slots, 2x2 -------------------------------------------------
    const slotSprites = KITCHEN_CONFIG.slots.map((slot) => {
        const s = new Sprite(tex.slotEmpty);
        s.anchor.set(0.5);
        s.width = KITCHEN_CONFIG.slotBox.w;
        s.height = KITCHEN_CONFIG.slotBox.h;
        s.position.set(slot.x, slot.y);
        boardRoot.addChild(s);
        return s;
    });

    const world = new Container();
    boardRoot.addChild(world);
    const dishViews = new Map<number, Graphics>();

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
                g = new Graphics();
                const { w: dw, h: dh } = KITCHEN_CONFIG.dishSize;
                g.roundRect(-dw / 2, -dh / 2, dw, dh, 8).fill(DISH_COLOR);
                world.addChild(g);
                dishViews.set(d.uid, g);
            }
            g.position.set(d.x, d.y);
        }
        for (const [uid, g] of dishViews) {
            if (!alive.has(uid)) {
                g.destroy();
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
        sim.drainEvents(); // consumed for side effects only; React reads state each tick
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
