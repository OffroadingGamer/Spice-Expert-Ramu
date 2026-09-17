/**
 * Round 12 Part 2.1 (docs/Ideas.md §6d, "Playtest of 1.83.0" item 5, pick
 * B): a blurred, desaturated copy of the shipped `menu-backdrop` image
 * (assets/manifest.ts — the same file MainMenu.tsx uses at full res, no new
 * art) for the ranks board's ground layer.
 *
 * Cost control per the handover: do the resize+blur+desaturate pass ONCE,
 * on a 480px-wide downscaled copy, via canvas — not `filter: blur()` on the
 * full-resolution JPEG every frame. A live CSS filter re-runs every repaint
 * over however many source pixels the element covers; baking it once into a
 * small raster and then displaying that raster with `object-fit: cover`
 * costs a single canvas pass for the whole session and zero per-frame filter
 * work afterwards. No new file ships under public/ — the result is a
 * `data:` URL kept in memory for this session only (recomputed on reload,
 * which is fine: the pass is cheap and runs at most once per load).
 */
import { MANIFEST } from '../assets/manifest.ts';

const ASSET_SRC = new Map(
    MANIFEST.bundles.flatMap((b) => b.assets).map((a) => [a.alias as string, a.src as string])
);

const TARGET_WIDTH = 480;

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`[blurredBackdrop] failed to load ${src}`));
        img.src = src;
    });
}

let cached: Promise<string | null> | null = null;

/**
 * Resolves to a blurred (3px), desaturated (0.9) data: URL of the menu
 * backdrop at 480px wide, or null if the source asset isn't available or
 * this browser's canvas has no 2D filter support (a very old WebView) —
 * callers fall back to the plain gradient-only ground rather than throwing.
 * Memoized module-wide: only the first caller in a session does the work;
 * every later call (switching tabs, reopening Ranks) reuses the same result.
 */
export function getBlurredBackdrop(): Promise<string | null> {
    if (cached) return cached;
    cached = (async () => {
        const src = ASSET_SRC.get('menu-backdrop');
        if (!src) return null;
        try {
            const img = await loadImage(src);
            const w = TARGET_WIDTH;
            const h = Math.round(img.naturalHeight * (TARGET_WIDTH / img.naturalWidth));
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;
            if ('filter' in ctx) {
                ctx.filter = 'blur(3px) saturate(0.9)';
            }
            ctx.drawImage(img, 0, 0, w, h);
            return canvas.toDataURL('image/jpeg', 0.82);
        } catch {
            return null;
        }
    })();
    return cached;
}
