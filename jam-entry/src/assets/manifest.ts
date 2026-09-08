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
                // TEST MODE ONLY (src/ui/TestBelt.tsx) — demo tier of a
                // commercial pack, private-build only; see KitchenMode.md §2.6.
                { alias: 'ui-slot-empty', src: 'images/ui-slot-empty.png' },
                { alias: 'ui-slot-filled', src: 'images/ui-slot-filled.png' },
                { alias: 'ui-hotbar', src: 'images/ui-hotbar.png' },
                { alias: 'ui-container', src: 'images/ui-container.png' },
                { alias: 'ui-billboard', src: 'images/ui-billboard.png' },
                // Round 8, task 1: badge counter sprite for the billboard
                // recipe row — derived from UI/Icons (gitignored source), the
                // plus glyph filled solid so a digit can be drawn over it.
                { alias: 'ui-badge-count', src: 'images/ui-badge-count.png' },
                // Round 11: Chef Hat + Coin icons — our own generated assets
                // (Art/_gen/ui-final/), not the demo pack above, so no
                // licence comment applies. Baked from 1024x1024 sources:
                // alpha-trimmed, padded to a square canvas (content height
                // 80%), downscaled to 256x256 — see kitchenScene.ts's HUD
                // coin readout and TestBelt.tsx's end screen.
                // Round 21: Exit Sign icon added to the same set (still our
                // own generated art, still no licence comment) — drawn as
                // geometry to the palette and metrics sampled off the two
                // above: outline #500C23, stroke 8px at 256, content bbox
                // inset 25px. Used by kitchenScene.ts's walkouts-left group.
                { alias: 'ui-chef-hat', src: 'images/ui-chef-hat.png' },
                { alias: 'ui-coin', src: 'images/ui-coin.png' },
                { alias: 'ui-exit-sign', src: 'images/ui-exit-sign.png' },
                // Round 3: station props + belt ingredients + final dishes.
                // ing-tea-leaf / ing-sugar / ing-chai-masala have no manifest
                // line yet (§2.6 — procedural placeholder until art exists).
                { alias: 'prop-kettle-l1', src: 'images/prop-kettle-l1.png' },
                { alias: 'prop-water-dispenser-l1', src: 'images/prop-water-dispenser-l1.png' },
                { alias: 'ing-milk', src: 'images/ing-milk.png' },
                { alias: 'ing-ginger', src: 'images/ing-ginger.png' },
                { alias: 'dish-chai', src: 'images/dish-chai.png' },
                { alias: 'dish-coffee', src: 'images/dish-coffee.png' },
                // Round 4: fridge anchoring both belt ends. Kitchen Props
                // furniture sprite (kp1, NOT kp2 — see kitchenConfig.ts),
                // knowingly upscaled ~5.8x as a temporary placeholder.
                { alias: 'prop-fridge', src: 'images/prop-fridge.png' },
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
