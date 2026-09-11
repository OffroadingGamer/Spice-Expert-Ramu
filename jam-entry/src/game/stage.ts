/**
 * Design-resolution stage: scene code works in fixed DESIGN UNITS, and this
 * module maps them to real pixels — so anything sized at 1/4 of the design
 * width takes up 1/4 of the screen width on EVERY device and aspect ratio.
 *
 * How it works (contain-fit, round C onward — see FIT_HEIGHT below):
 *   - The stage root container is scaled by
 *     min(screenWidth / DESIGN_WIDTH, screenHeight / FIT_HEIGHT), so the
 *     WHOLE playfield (path included) is always on screen, never cropped.
 *   - On a viewport relatively narrower than FIT_HEIGHT calls for, the
 *     height term binds: the content column is centered horizontally and
 *     letterboxes evenly left/right (root.x offset in layout() below).
 *   - Vertical space still varies with the device: designHeight() reports
 *     how many units tall the screen currently is. Anchor vertical layout
 *     to top / bottom / center via designHeight() — never hardcode a
 *     bottom edge.
 *
 * getFit()/designToScreen() below are the SAME math layout() uses — the one
 * source of truth for any DOM overlay (Hud.tsx) that needs to place
 * something over the canvas. Do not re-derive this by hand a second time.
 */
import { Container, type Application } from 'pixi.js';
import { CONFIG } from './config.ts';

/**
 * ADAPT: the game's design width, in units. 720 is a good default for
 * portrait (art assets sized against a 720-wide layout look right at 2x DPR
 * on modern phones). For a LANDSCAPE game, invert the pattern: fix a design
 * HEIGHT instead and scale by screenHeight / DESIGN_HEIGHT, letting width
 * vary — see layout() below.
 */
export const DESIGN_WIDTH = 720;

/**
 * The playfield's true vertical extent in design units, derived from the
 * path's own waypoints — never a typed-in number (Retro 79: the formula is
 * the source, the number is a claim). If the path ever moves, this follows
 * it automatically. CONFIG.boardHeight (1280) is a nominal 9:16 reference,
 * not the real content extent: the path's last point sits at y:1300, 20
 * units past it — that gap is what round C's bug report was.
 */
export const PLAYFIELD_HEIGHT = Math.max(...CONFIG.path.map((p) => p.y));

/**
 * Reserved vertical bands (design units), added above/below the playfield
 * so the contain-fit leaves room for the HUD without clipping gameplay.
 *
 * anchorBoard's centering formula (towerScene.ts) is symmetric, so what it
 * actually guarantees on each side is HALF of (TOP_BAND + BOTTOM_BAND) —
 * the split below is a documentation aid (row1+row2's real CSS height vs.
 * the Ready cluster's), not two independently-enforced minimums.
 *
 * Measured live (round C, on the actual rendered Hud.tsx, not guessed):
 * row1+row2 bottom sits at a fixed 98.4 CSS px from the top; the Ready
 * button's top sits a fixed 84 CSS px from the bottom (both independent of
 * canvas scale — plain CSS layout). At the tightest tested viewport
 * (390x844, a tall 19.5:9 phone) those fixed distances left only ~1px of
 * top clearance and the Ready button OVERLAPPING the goal by ~14px at the
 * first band sizes tried (110/150, FIT_HEIGHT 1560) — so they were sized
 * up from that measurement, not intuition, to clear both with margin at
 * 844 CSS px tall while keeping FIT_HEIGHT as small as the fix allows
 * (bigger bands shrink the whole game — see CONFIG.padTapRadius's report
 * in round C's acceptance notes for the resulting tradeoff on that phone).
 */
export const TOP_BAND = 170;
export const BOTTOM_BAND = 180;

/** Total design-unit height the contain-fit guarantees is visible. */
export const FIT_HEIGHT = PLAYFIELD_HEIGHT + TOP_BAND + BOTTOM_BAND;

/** What createStage returns — the surface scenes build against. */
export interface Stage {
    /** Add all scene content here (NOT app.stage), positioned in design units. */
    root: Container;
    /** Constant: the design-space width (= DESIGN_WIDTH). */
    width: number;
    /** Current screen height in design units — re-read after resizes. */
    designHeight(): number;
    /** Current design-unit → pixel factor (rarely needed directly). */
    scale(): number;
    /** Subscribe to resizes (re-anchor bottom/center content). Returns unsubscribe. */
    onResize(cb: () => void): () => void;
    destroy(): void;
}

/**
 * Final polish round, task 1: shrink the whole board render by this factor
 * after playtesting found it reading too large. Folded into getFit() itself
 * (below) rather than a second scale on towerScene.ts's boardRoot — Hud.tsx's
 * FTUE cues (the picker-beat arrow, the empty-pad pulse) are DOM, positioned
 * via designToScreen(), and never see a Pixi-container-only scale; a factor
 * applied only inside towerScene.ts would desync the two silently (the cues
 * would keep pointing at the OLD, unscaled pad positions). Deriving scale,
 * offsetX, designHeight and boardY all from the same reduced number, in one
 * place both consumers call, is what keeps them from drifting apart.
 */
const BOARD_SCALE = 0.85;

/**
 * Pure contain-fit math: given a screen size (CSS px, e.g. #app-frame's
 * getBoundingClientRect()), returns the design->screen scale, the
 * horizontal letterbox offset, the resulting design-unit screen height, and
 * the vertical board-centering offset (mirrors towerScene.ts's anchorBoard,
 * against PLAYFIELD_HEIGHT rather than CONFIG.boardHeight). Both layout()
 * below and any DOM overlay call this — never re-derive it by hand.
 */
export function getFit(screenW: number, screenH: number) {
    const scale = Math.min(screenW / DESIGN_WIDTH, screenH / FIT_HEIGHT) * BOARD_SCALE;
    const offsetX = (screenW - DESIGN_WIDTH * scale) / 2;
    const designHeight = screenH / scale;
    const boardY = Math.max(0, (designHeight - PLAYFIELD_HEIGHT) / 2);
    return { scale, offsetX, designHeight, boardY };
}

/** Map a design-space point (e.g. a pad center) to screen CSS px, given the
 *  current #app-frame size. For DOM overlays only — Pixi content inside the
 *  canvas positions itself in design units directly via stage.root. */
export function designToScreen(x: number, y: number, screenW: number, screenH: number) {
    const { scale, offsetX, boardY } = getFit(screenW, screenH);
    return { x: offsetX + x * scale, y: (y + boardY) * scale };
}

/**
 * Create the stage on a Pixi app. Add all scene content to `stage.root`
 * (NOT app.stage) and position/size it in design units.
 */
export function createStage(app: Application): Stage {
    const root = new Container();
    app.stage.addChild(root);

    const resizeCbs = new Set<() => void>();
    let _designHeight = 0;

    const layout = () => {
        const { scale, offsetX, designHeight } = getFit(app.screen.width, app.screen.height);
        root.scale.set(scale);
        root.x = offsetX;
        _designHeight = designHeight;
        for (const cb of resizeCbs) cb();
    };

    // app.screen is in CSS pixels regardless of resolution/autoDensity, so
    // the design mapping is unaffected by devicePixelRatio.
    app.renderer.on('resize', layout);
    layout();

    return {
        root,
        width: DESIGN_WIDTH,
        designHeight: () => _designHeight,
        scale: () => root.scale.x,
        onResize(cb) {
            resizeCbs.add(cb);
            return () => resizeCbs.delete(cb);
        },
        destroy() {
            app.renderer.off('resize', layout);
            resizeCbs.clear();
            root.destroy({ children: true });
        },
    };
}
