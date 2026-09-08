/**
 * TEST MODE ONLY — a contain-fit stage for the belt, isolated from
 * stage.ts's width-fit (which the live tower-defence board depends on and
 * this file never touches).
 *
 * stage.ts scales by width and lets height vary because the live board's
 * content is open-ended vertically (taller phones simply see more of it).
 * The belt is the opposite: a fixed 720x1280 composition that must always
 * be fully visible, hamburger included. Contain-fit (scale to whichever of
 * width/height is more constraining, centre the remainder) guarantees
 * that on any aspect ratio — pillarboxing on a device shorter than 9:16
 * (KitchenMode.md §6.6's crop bug), letterboxing on one taller.
 */
import { Container, type Application } from 'pixi.js';
import { KITCHEN_CONFIG } from './kitchenConfig.ts';

/** The contain-fit content rect, in CSS pixels (matches app.screen's unit). */
export interface KitchenStageRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface KitchenStage {
    /** Add all scene content here, positioned in the belt's design units. */
    root: Container;
    destroy(): void;
}

/**
 * Round 21, task 3a: onLayout publishes the same rect layout() already
 * computes, so a DOM overlay (TestBelt.tsx) can align to it instead of
 * re-deriving min(w/720, h/1280) itself — that second copy of the stage's
 * own geometry is exactly the drift SLOT_ZONES exists to prevent elsewhere.
 * Fires once immediately and again on every renderer 'resize'.
 */
export function createKitchenStage(app: Application, onLayout?: (rect: KitchenStageRect) => void): KitchenStage {
    const root = new Container();
    app.stage.addChild(root);

    const layout = () => {
        const s = Math.min(
            app.screen.width / KITCHEN_CONFIG.boardWidth,
            app.screen.height / KITCHEN_CONFIG.boardHeight
        );
        root.scale.set(s);
        root.x = (app.screen.width - KITCHEN_CONFIG.boardWidth * s) / 2;
        root.y = (app.screen.height - KITCHEN_CONFIG.boardHeight * s) / 2;
        onLayout?.({
            x: root.x,
            y: root.y,
            width: KITCHEN_CONFIG.boardWidth * s,
            height: KITCHEN_CONFIG.boardHeight * s,
        });
    };
    app.renderer.on('resize', layout);
    layout();

    return {
        root,
        destroy() {
            app.renderer.off('resize', layout);
            root.destroy({ children: true });
        },
    };
}
