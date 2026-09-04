/**
 * Asset manifest — the single place that lists what gets loaded and when.
 * Files live in public/ (URLs are relative to the page, so 'images/x.png'
 * means public/images/x.png; works in dev and in the deployed subdirectory).
 *
 * Two tiers (the pattern production RUN games use):
 *   - 'critical'  — awaited during the loading screen. Everything the first
 *                   interactive screen needs: menu art, UI chrome, the sprites
 *                   visible in the first seconds of play.
 *   - 'deferred'  — fire-and-forget background load after boot. Sub-screen
 *                   art, late-game content, anything the player can't see yet.
 *
 * Keep 'critical' small: every asset here delays first interaction.
 */
import type { AssetsManifest, UnresolvedAsset } from 'pixi.js';

/**
 * A narrowing of Pixi's AssetsManifest: Pixi also allows `assets` to be a
 * record, but this template keeps it an array so the tier filters below can
 * check `assets.length`. Still assignable to AssetsManifest (Assets.init).
 */
export interface Manifest extends AssetsManifest {
    bundles: { name: string; assets: UnresolvedAsset[] }[];
}

export const MANIFEST: Manifest = {
    bundles: [
        {
            name: 'critical',
            assets: [
                { alias: 'enemy-beetle', src: 'images/enemy-beetle.png' },
                { alias: 'enemy-wasp', src: 'images/enemy-wasp.png' },
                { alias: 'enemy-snail', src: 'images/enemy-snail.png' },
                { alias: 'enemy-hornet', src: 'images/enemy-hornet.png' },
                { alias: 'enemy-stag', src: 'images/enemy-stag.png' },
                { alias: 'tower-fox', src: 'images/tower-fox.png' },
                { alias: 'tower-owl', src: 'images/tower-owl.png' },
                { alias: 'tower-bear', src: 'images/tower-bear.png' },
                { alias: 'tower-squirrel', src: 'images/tower-squirrel.png' },
                { alias: 'proj-fox', src: 'images/proj-fox.png' },
                { alias: 'proj-owl', src: 'images/proj-owl.png' },
                { alias: 'proj-bear', src: 'images/proj-bear.png' },
                { alias: 'pad', src: 'images/pad.png' },
                { alias: 'pad-gold', src: 'images/pad-gold.png' },
                { alias: 'burrow', src: 'images/burrow.png' },
            ],
        },
        {
            name: 'deferred',
            assets: [
                // sub-screen backgrounds, late-game content...
            ],
        },
    ],
};

// Empty bundles are skipped so an unused tier never errors.
export const CRITICAL_BUNDLES: string[] = MANIFEST.bundles
    .filter((b) => b.name !== 'deferred' && b.assets.length > 0)
    .map((b) => b.name);

export const DEFERRED_BUNDLES: string[] = MANIFEST.bundles
    .filter((b) => b.name === 'deferred' && b.assets.length > 0)
    .map((b) => b.name);
