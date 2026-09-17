/**
 * Design-resolution stage: scene code works in fixed DESIGN UNITS, and this
 * module maps them to real pixels — so anything sized at 1/4 of the design
 * width takes up 1/4 of the screen width on EVERY device and aspect ratio.
 *
 * How it works (contain-fit, round C onward; Round 12b: bands are now
 * MEASURED CSS PIXELS, not design units — see the long comment on
 * FALLBACK_TOP_PX/FALLBACK_BOTTOM_PX below for why the old design-unit
 * bands were the actual bug):
 *   - The stage root container is scaled by
 *     min(screenWidth / DESIGN_WIDTH, (screenHeight - topPx - bottomPx) /
 *     PLAYFIELD_HEIGHT) * BOARD_SCALE, so the WHOLE playfield (path
 *     included) is always on screen, never cropped, and never drawn
 *     underneath the HUD's own top/bottom chrome.
 *   - On a viewport relatively narrower than that calls for, the height
 *     term binds: the content column is centered horizontally and
 *     letterboxes evenly left/right (root.x offset in layout() below).
 *   - Vertical space still varies with the device: designHeight() reports
 *     how many units tall the FULL screen currently is (unrelated to the
 *     bands — full-bleed backdrops use this). The playfield itself is
 *     placed via boardOffsetY() (design units, added to boardRoot.y by
 *     towerScene.ts's anchorBoard) — never hardcode a bottom edge.
 *
 * getFit()/designToScreen() below are the SAME math layout() uses — the one
 * source of truth for any DOM overlay that needs to place something over
 * the canvas. Do not re-derive this by hand a second time.
 */
import { Container, type Application } from 'pixi.js';
import { CONFIG } from './config.ts';
import { store } from '../state/store.ts';

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
 * Round 12b Part 1 hotfix (Round 12 hotfix, "HUD bands in pixels"): every
 * round through Round 12 reserved the HUD's clearance as DESIGN-UNIT bands
 * (TOP_BAND/BOTTOM_BAND, folded into a design-unit FIT_HEIGHT) — but the HUD
 * itself is DOM, not scaled with the board, so a taller bottom column
 * needed a BIGGER design-unit band to represent the same real pixel height,
 * which LOWERED the scale, which shrank that same band back down in actual
 * pixels once re-multiplied by the new (smaller) scale. That feedback loop
 * is exactly what forced Round 12's own BOTTOM_BAND to 2400 and roughly
 * halved the board (measured: 123px wide at 360x780, was 247px at 1.83.0).
 * Bumping the design-unit number could never converge cleanly because the
 * number being tuned wasn't the thing that actually needed protecting (real
 * screen pixels) — it was a proxy for it, filtered back through the very
 * scale computation it was feeding.
 *
 * The fix: stop guessing a design-unit reservation at all. Hud.tsx's own
 * top-row and bottom-column containers are measured directly via
 * ResizeObserver (their real CSS-px height, from #app-frame's own top/
 * bottom edges) and written to the store as `hudTopPx`/`hudBottomPx`; getFit
 * below takes those as real pixel arguments and subtracts them from
 * screenH BEFORE computing scale — so the reservation is exactly what the
 * DOM occupies, in the units it actually occupies them in, with no
 * scale-dependent round-trip left to loop on.
 */
export const FALLBACK_TOP_PX = 96;
export const FALLBACK_BOTTOM_PX = 240;

/** What createStage returns — the surface scenes build against. */
export interface Stage {
    /** Add all scene content here (NOT app.stage), positioned in design units. */
    root: Container;
    /** Constant: the design-space width (= DESIGN_WIDTH). */
    width: number;
    /** Current FULL screen height in design units (unrelated to the HUD
     *  bands — for full-bleed content like backdrops). Re-read after resizes. */
    designHeight(): number;
    /** Current design-unit → pixel factor (rarely needed directly). */
    scale(): number;
    /** The playfield's own vertical placement, in design units local to
     *  `root` (root itself is never y-translated — only scaled + x-offset,
     *  same contract as before). towerScene.ts's anchorBoard assigns this
     *  straight to boardRoot.y; equals offsetY/scale from getFit() below. */
    boardOffsetY(): number;
    /** Subscribe to resizes (re-anchor bottom/center content) — fires on a
     *  real window/host resize AND whenever the measured HUD bands change.
     *  Returns unsubscribe. */
    onResize(cb: () => void): () => void;
    destroy(): void;
}

/**
 * Final polish round, task 1: shrink the whole board render by this factor
 * after playtesting found it reading too large. Folded into getFit() itself
 * (below) rather than a second scale on towerScene.ts's boardRoot — Hud.tsx's
 * FTUE cue (the picker-beat arrow) is DOM, positioned via designToScreen(),
 * and never sees a Pixi-container-only scale; a factor
 * applied only inside towerScene.ts would desync the two silently (the cues
 * would keep pointing at the OLD, unscaled pad positions). Deriving scale,
 * offsetX, offsetY and designHeight all from the same reduced number, in one
 * place both consumers call, is what keeps them from drifting apart.
 *
 * Final round Tier 2 tried dropping this to 0.80 with a left-aligned
 * offsetX to permanently reserve a right-edge strip for a persistent
 * station rail. Reverted in the final round: the reservation read as a
 * fixed "dark column" whenever nothing needed it, and the left-aligned
 * board sat flush against the screen edge with no margin. The rail is
 * back to an overlay (StationRail.tsx) that only occupies screen space
 * while a pad is selected, so the board goes back to this centered fit.
 */
const BOARD_SCALE = 0.85;

/**
 * StationRail.tsx's own overlay width, in design units. It no longer
 * feeds getFit() — the rail overlays the board on selection instead of
 * reserving layout space, so nothing here needs to shrink the playfield.
 */
export const RAIL_WIDTH_UNITS = 140;

/**
 * Pure contain-fit math: given a screen size (CSS px, e.g. #app-frame's
 * getBoundingClientRect()) and the HUD's own measured top/bottom band
 * heights (also CSS px — Hud.tsx's ResizeObservers, store.ts's hudTopPx/
 * hudBottomPx), returns the design->screen scale, the horizontal letterbox
 * offset, the resulting FULL-screen design-unit height, and the screen-px
 * y-offset at which the playfield's own top edge sits (topPx plus whatever
 * extra centering slack the available vertical space has left over). Both
 * layout() below and any DOM overlay call this — never re-derive it by hand.
 */
export function getFit(screenW: number, screenH: number, topPx: number, bottomPx: number) {
    const availH = Math.max(0, screenH - topPx - bottomPx);
    const scale = Math.min(screenW / DESIGN_WIDTH, availH / PLAYFIELD_HEIGHT) * BOARD_SCALE;
    const offsetX = (screenW - DESIGN_WIDTH * scale) / 2;
    const offsetY = topPx + (availH - PLAYFIELD_HEIGHT * scale) / 2;
    const designHeight = screenH / scale;
    return { scale, offsetX, offsetY, designHeight };
}

/** Map a design-space point (e.g. a pad center) to screen CSS px, given the
 *  current #app-frame size. For DOM overlays only — Pixi content inside the
 *  canvas positions itself in design units directly via stage.root. topPx/
 *  bottomPx default to the pre-measure fallback for a caller that doesn't
 *  have the live store value handy; pass the real measured values when
 *  available (the store's hudTopPx/hudBottomPx). */
export function designToScreen(
    x: number, y: number, screenW: number, screenH: number,
    topPx: number = FALLBACK_TOP_PX, bottomPx: number = FALLBACK_BOTTOM_PX,
) {
    const { scale, offsetX, offsetY } = getFit(screenW, screenH, topPx, bottomPx);
    return { x: offsetX + x * scale, y: offsetY + y * scale };
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
    let _boardOffsetY = 0;

    const layout = () => {
        const { hudTopPx, hudBottomPx } = store.get();
        const { scale, offsetX, offsetY, designHeight } = getFit(app.screen.width, app.screen.height, hudTopPx, hudBottomPx);
        // Cold-boot blocker: a host that hasn't been sized yet (an iframe in
        // the RUN host, or dvw/dvh still settling on mobile) can call this
        // with screen 0x0, producing scale 0 -- committing that would leave
        // the whole board permanently invisible. Pixi's resizeTo only reacts
        // to WINDOW resize events (see node_modules/pixi.js's ResizePlugin),
        // never to the host element's own later resize, so nothing would
        // ever re-run this with a good size on its own; GameCanvas.tsx's own
        // ResizeObserver on the host (mirroring StationRail.tsx's
        // useRailWidthPx) is what re-triggers it once the host actually has
        // one. Skip committing a broken layout rather than guess a fallback
        // size — the next real resize corrects it.
        if (!Number.isFinite(scale) || scale <= 0) return;
        root.scale.set(scale);
        root.x = offsetX;
        _designHeight = designHeight;
        _boardOffsetY = offsetY / scale;
        for (const cb of resizeCbs) cb();
    };

    // app.screen is in CSS pixels regardless of resolution/autoDensity, so
    // the design mapping is unaffected by devicePixelRatio.
    app.renderer.on('resize', layout);
    // Round 12b Part 1: re-run layout whenever Hud.tsx's ResizeObservers
    // patch a genuinely new hudTopPx/hudBottomPx into the store — debounced
    // to one animation frame so two patches landing in the same tick (both
    // bands measuring on mount, or a rotate firing both observers at once)
    // collapse into a single layout() pass rather than laying out twice.
    let lastTopPx = store.get().hudTopPx;
    let lastBottomPx = store.get().hudBottomPx;
    let pendingFrame: number | null = null;
    const scheduleLayout = () => {
        if (pendingFrame !== null) return;
        pendingFrame = requestAnimationFrame(() => { pendingFrame = null; layout(); });
    };
    const offStoreSub = store.subscribe(() => {
        const s = store.get();
        if (s.hudTopPx !== lastTopPx || s.hudBottomPx !== lastBottomPx) {
            lastTopPx = s.hudTopPx;
            lastBottomPx = s.hudBottomPx;
            scheduleLayout();
        }
    });
    layout();

    return {
        root,
        width: DESIGN_WIDTH,
        designHeight: () => _designHeight,
        scale: () => root.scale.x,
        boardOffsetY: () => _boardOffsetY,
        onResize(cb) {
            resizeCbs.add(cb);
            return () => resizeCbs.delete(cb);
        },
        destroy() {
            app.renderer.off('resize', layout);
            offStoreSub();
            if (pendingFrame !== null) cancelAnimationFrame(pendingFrame);
            resizeCbs.clear();
            root.destroy({ children: true });
        },
    };
}
