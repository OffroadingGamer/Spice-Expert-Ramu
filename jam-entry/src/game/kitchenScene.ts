/**
 * TEST MODE ONLY — the rendered view over sim/kitchen.ts. Grey-box
 * throughout: flat tint rectangles for the bands, belt, slots, and dishes.
 * No manifest art, no Kitchen Props sprites (Plan item 51: those are a
 * background layer at their own scale, never a belt sprite) — coloured
 * rectangles at the correct dimensions are what this test needs; real
 * sprites would obscure the thing being measured.
 *
 * Isolated from the live board: does not import config.ts, textures.ts,
 * towerScene.ts, or sim/engine.ts.
 */
import {
    Container,
    Graphics,
    Text,
    type Application,
    type FederatedPointerEvent,
    type Ticker,
} from 'pixi.js';
import { KITCHEN_CONFIG } from './kitchenConfig.ts';
import { createKitchenSim, type KitchenState } from './sim/kitchen.ts';
import type { Stage } from './stage.ts';

export interface Scene {
    destroy(): void;
}

const BAND_TINTS = {
    hud: 0x24242c,
    billboard: 0x2c2430,
    beltRun1: 0x33291c,
    stationRow: 0x1c2733,
    beltRun2: 0x33291c,
    propTray: 0x27241c,
} as const;

const DISH_COLOR = 0xff6b1a; // matches CONFIG.colors.pathEdge, the "hot ticket" tone
const SLOT_IDLE = 0x8a8a93;
const SLOT_HIT = 0xf5c542;

/**
 * @param onChange fires once per tick with the latest sim state, so a React
 *                 overlay (ui/TestBelt.tsx) can show walkouts/served/phase
 *                 without this scene touching the shared app store.
 */
export function createKitchenScene(
    app: Application,
    stage: Stage,
    onChange: (s: KitchenState) => void
): Scene {
    const boardRoot = new Container();
    stage.root.addChild(boardRoot);

    function band(y: number, height: number, width: number, x: number, color: number): void {
        const g = new Graphics();
        g.rect(x, y, width, height).fill(color);
        boardRoot.addChild(g);
    }
    const W = KITCHEN_CONFIG.boardWidth;
    const B = KITCHEN_CONFIG.bands;
    band(B.hud.y, B.hud.height, W, 0, BAND_TINTS.hud);
    band(B.billboard.y, B.billboard.height, W, 0, BAND_TINTS.billboard);
    band(B.beltRun1.y, B.beltRun1.height, W, 0, BAND_TINTS.beltRun1);
    band(B.stationRow.y, B.stationRow.height, W, 0, BAND_TINTS.stationRow);
    band(B.beltRun2.y, B.beltRun2.height, W, 0, BAND_TINTS.beltRun2);
    band(B.propTray.y, B.propTray.height, W, 0, BAND_TINTS.propTray);

    const label = (text: string, x: number, y: number) => {
        const t = new Text({ text, style: { fill: 0xffffff, fontSize: 22, fontWeight: '700' } });
        t.anchor.set(0.5);
        t.position.set(x, y);
        t.alpha = 0.55;
        boardRoot.addChild(t);
    };
    label('BILLBOARD (dish-billboard)', W / 2, B.billboard.y + B.billboard.height / 2);
    label('PROP TRAY (prop-kettle, prop-tray)', W / 2, B.propTray.y + B.propTray.height / 2);

    // belt centreline, so the path itself is visible against its band
    const path = new Graphics();
    const P = KITCHEN_CONFIG.beltPath;
    path.moveTo(P[0].x, P[0].y);
    for (let i = 1; i < P.length; i++) path.lineTo(P[i].x, P[i].y);
    path.stroke({ width: 6, color: 0x000000, alpha: 0.3, cap: 'round', join: 'round' });
    boardRoot.addChild(path);

    // station slots (dish-alias placeholders drawn on demand below)
    const slotGfx = KITCHEN_CONFIG.slots.map((slot) => {
        const g = new Graphics();
        g.position.set(slot.x, slot.y);
        boardRoot.addChild(g);
        return g;
    });
    function drawSlot(i: number, hit: boolean): void {
        const g = slotGfx[i];
        g.clear();
        g.roundRect(-40, -40, 80, 80, 12).fill(hit ? SLOT_HIT : SLOT_IDLE);
    }
    KITCHEN_CONFIG.slots.forEach((_, i) => drawSlot(i, false));

    const world = new Container();
    boardRoot.addChild(world);
    const dishViews = new Map<number, Graphics>();

    const anchorBoard = () => {
        const dh = stage.designHeight();
        boardRoot.y = Math.max(0, (dh - KITCHEN_CONFIG.boardHeight) / 2);
    };
    anchorBoard();
    const offResize = stage.onResize(anchorBoard);

    const sim = createKitchenSim();
    const flashUntil = new Array(KITCHEN_CONFIG.slots.length).fill(0);

    const onTap = (e: FederatedPointerEvent) => {
        const local = boardRoot.toLocal(e.global);
        for (let i = 0; i < KITCHEN_CONFIG.slots.length; i++) {
            const slot = KITCHEN_CONFIG.slots[i];
            if (Math.hypot(local.x - slot.x, local.y - slot.y) < 60) {
                sim.tapSlot(i);
                flashUntil[i] = performance.now() + 120;
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
                const { w, h } = KITCHEN_CONFIG.dishSize;
                g.roundRect(-w / 2, -h / 2, w, h, 8).fill(DISH_COLOR);
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

    const tick = (ticker: Ticker) => {
        const dt = Math.min(ticker.deltaMS, 50) / 1000;
        sim.step(dt);
        sim.drainEvents(); // consumed for side effects only; React reads state each tick
        syncDishes();
        const now = performance.now();
        KITCHEN_CONFIG.slots.forEach((_, i) => drawSlot(i, now < flashUntil[i]));
        onChange(sim.state);
    };
    app.ticker.add(tick);

    return {
        destroy() {
            app.ticker.remove(tick);
            app.stage.off('pointertap', onTap);
            offResize();
            boardRoot.destroy({ children: true });
        },
    };
}
