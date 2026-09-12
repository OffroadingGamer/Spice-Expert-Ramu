/**
 * Tower icons for the React UI (upgrades menu). The tower art is Pixi
 * textures (procedural, or real art via the manifest — same art() resolver
 * either way), so to show it in DOM we render each texture once with a
 * tiny throwaway renderer and extract a PNG data URL. Generated
 * fire-and-forget at boot (main.tsx step 8) into store.towerIcons.
 */
import { autoDetectRenderer, type Renderer } from 'pixi.js';
import { TOWERS } from './data/towers.ts';
import { bakeTowerIcon, freeTexture, makeTowerLevelSizes, makeTowerLevelTextures } from './textures.ts';
import { store } from '../state/store.ts';
import { track } from '../sdk/analytics.ts';

/** WebGLRenderer race round: how long generateTowerIconsWhenSafe() will wait
 *  for store.engineReady before generating anyway (see its own doc below). */
const ICON_WAIT_TIMEOUT_MS = 8000;

/**
 * Render every tower's LEVEL 1 texture (the build card shows the base
 * station, before any upgrade) to a data URL. Never throws; may be empty.
 *
 * Playtest round, task 2: baked at the SAME per-family fit (+25% bonus)
 * towerScene.ts's board sprites use, via makeTowerLevelSizes — extracting
 * the raw texture alone (the old behaviour) ignored that scale entirely,
 * since BuildSheet.tsx's <img> is object-contain into a fixed 48px box: a
 * raw extract's on-screen size there depends only on the source PNG's own
 * aspect ratio, never on any factor computed in JS. Baking into a canvas
 * sized by that factor is what lets the icon grow when the board's does.
 */
export async function generateTowerIcons(): Promise<Record<string, string>> {
    try {
        const renderer = (await autoDetectRenderer({
            width: 16,
            height: 16,
            backgroundAlpha: 0,
        })) as Renderer;
        const icons: Record<string, string> = {};
        for (const t of TOWERS) {
            const texes = makeTowerLevelTextures(renderer, t.id);
            const sizes = makeTowerLevelSizes(texes);
            const icon = bakeTowerIcon(renderer, texes[0], sizes[0].w, sizes[0].h);
            icons[t.id] = await renderer.extract.base64(icon);
            freeTexture(icon);
            for (const tex of texes) freeTexture(tex); // frees procedural placeholders; manifest art survives
        }
        renderer.destroy();
        return icons;
    } catch (err) {
        // No WebGL, or the race below's timeout still lost (should be rare —
        // see generateTowerIconsWhenSafe): the UI falls back to name-only
        // cards, but that fallback must be visible somewhere other than a
        // console nobody on a phone opens.
        console.warn('[towerIcons] generateTowerIcons failed', err);
        track('error_occurred', { source: 'tower_icons' });
        return {};
    }
}

/**
 * WebGLRenderer race round: gate icon generation on the game's own renderer
 * already existing, so this module's autoDetectRenderer() call is never the
 * FIRST thing to touch Pixi's renderer chunk.
 *
 * The bug: Pixi 8 code-splits the renderer into its own lazily-imported
 * chunk (dist/assets/WebGLRenderer-*.js). Two call sites used to first-touch
 * that chunk within microseconds of each other at boot — GameCanvas.tsx's
 * effect (via createPixiApp -> app.init(), main.tsx step 6) and this
 * module's autoDetectRenderer() (main.tsx step 8, previously called
 * directly as generateTowerIcons()). A concurrent first-touch of a chunk
 * with an internal init cycle threw "Cannot access 'WebGLRenderer' before
 * initialization" on slower (mostly iOS) devices — caught by both callers'
 * .catch(), so it surfaced as a silently icon-less UI rather than a crash.
 *
 * The fix: wait for store.engineReady (set only by registerEngine() in
 * actions.ts, once GameCanvas's createTowerScene has run app.init() to
 * completion and the renderer chunk is fully evaluated) before calling
 * autoDetectRenderer() here. Ordering guarantee: while engineReady is
 * false, GameCanvas either hasn't started app.init() yet or is still
 * awaiting it, so this function has not yet called autoDetectRenderer() —
 * by the time engineReady flips true, app.init()'s renderer import has
 * already resolved, making this call a cache hit on an already-evaluated
 * module, not a second concurrent evaluation.
 *
 * Fallback: if engineReady never flips within ICON_WAIT_TIMEOUT_MS (e.g.
 * GameCanvas's own init is exhausting its retries — see GameCanvas.tsx's
 * MAX_INIT_ATTEMPTS/INIT_RETRY_DELAYS_MS, whose worst case is ~2.1s, well
 * inside this window), generate anyway rather than leaving the UI
 * permanently icon-less over an unrelated canvas failure.
 */
export function generateTowerIconsWhenSafe(): Promise<Record<string, string>> {
    if (store.get().engineReady) return generateTowerIcons();
    return new Promise((resolve) => {
        let settled = false;
        let unsubscribe: (() => void) | null = null;
        let timer: ReturnType<typeof setTimeout> | null = null;
        const finish = () => {
            if (settled) return; // exactly-once guard: signal and timeout can race
            settled = true;
            unsubscribe?.();
            if (timer) clearTimeout(timer);
            resolve(generateTowerIcons());
        };
        unsubscribe = store.subscribe(() => {
            if (store.get().engineReady) finish();
        });
        timer = setTimeout(finish, ICON_WAIT_TIMEOUT_MS);
    });
}
