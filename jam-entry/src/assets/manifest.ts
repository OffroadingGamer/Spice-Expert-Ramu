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
                // Round G: the five dishes textures.ts draws the enemies
                // from (chai/bhindi-fry/rajma/beans-poriyal/ooti) — moved
                // here from 'deferred' so wave 1 never renders the
                // procedural fallback while the rest of the dish roster is
                // still loading in the background. This replaces the five
                // enemy-*.png insect sprites (Sep 4, pre-dish-roster; see
                // Retro.md lesson 86) that critical loaded until now and
                // that textures.ts no longer references — net smaller, not
                // larger: those five insect PNGs totalled ~235KB, these
                // five dish PNGs total ~63KB.
                { alias: 'dish-chai', src: 'images/dish-chai.png' },
                { alias: 'dish-bhindi-fry', src: 'images/dish-bhindi-fry.png' },
                { alias: 'dish-rajma', src: 'images/dish-rajma.png' },
                { alias: 'dish-beans-poriyal', src: 'images/dish-beans-poriyal.png' },
                { alias: 'dish-ooti', src: 'images/dish-ooti.png' },
                // Visual round, task 2 (docs/LevelBlocks.md §10): the four
                // tower-*.png silhouettes are retired — the four stations now
                // draw real kitchen-prop art, one alias per tower LEVEL (see
                // textures.ts's makeTowerLevelTextures), moved here from
                // 'deferred' for the same reason the five dish textures
                // above were: the towers are visible from the first frame of
                // play, so their art can't race a background load. Measured
                // Sep 11: +31 KB net (12 props @ 285 KB in, 4 tower-*.png @
                // 254 KB out).
                { alias: 'prop-stock-pot-l1', src: 'images/prop-stock-pot-l1.png' },
                { alias: 'prop-stock-pot-l2', src: 'images/prop-stock-pot-l2.png' },
                { alias: 'prop-stock-pot-l3', src: 'images/prop-stock-pot-l3.png' },
                { alias: 'prop-pressure-cooker-l1', src: 'images/prop-pressure-cooker-l1.png' },
                { alias: 'prop-pressure-cooker-l2', src: 'images/prop-pressure-cooker-l2.png' },
                { alias: 'prop-pressure-cooker-l3', src: 'images/prop-pressure-cooker-l3.png' },
                { alias: 'prop-cooktop-l2', src: 'images/prop-cooktop-l2.png' },
                { alias: 'prop-cooktop-l3', src: 'images/prop-cooktop-l3.png' },
                { alias: 'prop-cooktop-l5', src: 'images/prop-cooktop-l5.png' },
                // Visual round part 2, task 1 (docs/LevelBlocks.md §10,
                // "REMAPPED Sep 11"): the Fryer's prop-fry-pan-l2/l3/l4 were
                // never fry-pan art — all five fry-pan tiers render bowls of
                // FINISHED FOOD, the same category as the enemies, so the
                // Fryer looked like the dish it shoots at. Sauce pot is
                // equipment with a consistent silhouette and near-identical
                // dimensions (107x117/99x117/98x118), so the per-family fit
                // lands clean; the other two 3-tier candidates (sauce pan,
                // rice cooker) were opened and rejected — see §10.
                { alias: 'prop-sauce-pot-l1', src: 'images/prop-sauce-pot-l1.png' },
                { alias: 'prop-sauce-pot-l2', src: 'images/prop-sauce-pot-l2.png' },
                { alias: 'prop-sauce-pot-l3', src: 'images/prop-sauce-pot-l3.png' },
                { alias: 'proj-fox', src: 'images/proj-fox.png' },
                { alias: 'proj-owl', src: 'images/proj-owl.png' },
                { alias: 'proj-bear', src: 'images/proj-bear.png' },
                // pad / pad-gold RETIRED (playtest round, task 3): the solid
                // decal they drew was only ever shown under a PLACED tower,
                // which is now decal-less (towerScene.ts's syncPads) —
                // nothing loads these aliases anymore. Same treatment the
                // Fryer's stale fry-pan aliases got in the visual round's
                // part 2: no callers left, remove the alias, not just the
                // call site.
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
                // Round 25, task 2: end-screen card backdrop, baked from
                // Ramu - The Chef/UI/Cards/CardRegular/ (gitignored source,
                // same demo pack as ui-billboard/ui-hotbar/ui-container
                // above) — wood on a clear ('won'), red on a loss ('lost').
                // 9-sliced in TestBelt.tsx, never uniform-scaled.
                { alias: 'ui-card-wood', src: 'images/ui-card-wood.png' },
                { alias: 'ui-card-red', src: 'images/ui-card-red.png' },
                // Round 3: station props + belt ingredients + final dishes.
                // ing-sugar / ing-chai-masala still have no manifest line
                // (§2.6 — procedural placeholder until art exists);
                // ing-tea-leaf got its line in round 26, below.
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
                // Round 26: the rest of the prop catalogue (PropList.md §8.1),
                // baked as plain copies from Art/_sliced/01 - Kitchen
                // Essentials/props/ — same treatment as prop-kettle-l1 /
                // prop-water-dispenser-l1 above, no compression benefit on
                // these small sprite-sheet crops. 22-Masala container.png is
                // excluded (PropList §7.3 — it's an ingredient, not a station).
                { alias: 'prop-beverage-dispenser-l1', src: 'images/prop-beverage-dispenser-l1.png' },
                { alias: 'prop-beverage-dispenser-l2', src: 'images/prop-beverage-dispenser-l2.png' },
                { alias: 'prop-brazier-l1', src: 'images/prop-brazier-l1.png' },
                { alias: 'prop-cast-iron-skillet-l1', src: 'images/prop-cast-iron-skillet-l1.png' },
                { alias: 'prop-cast-iron-skillet-l2', src: 'images/prop-cast-iron-skillet-l2.png' },
                { alias: 'prop-cooktop-l1', src: 'images/prop-cooktop-l1.png' },
                // prop-cooktop-l2/l3/l5 moved to 'critical' (Visual round,
                // task 2 — the Tandoor tower's three levels).
                { alias: 'prop-cooktop-l4', src: 'images/prop-cooktop-l4.png' },
                { alias: 'prop-dough-counter-l1', src: 'images/prop-dough-counter-l1.png' },
                { alias: 'prop-dough-counter-l2', src: 'images/prop-dough-counter-l2.png' },
                { alias: 'prop-dough-counter-l3', src: 'images/prop-dough-counter-l3.png' },
                { alias: 'prop-fry-pan-l1', src: 'images/prop-fry-pan-l1.png' },
                // Visual round part 2: fry-pan-l2/l3/l4 moved back here from
                // 'critical' — the Fryer no longer uses this family (§10,
                // "REMAPPED Sep 11": the art renders bowls of food, not a
                // pan). Ordinary unused-by-a-tower catalogue entries again,
                // same as l1/l5 always were.
                { alias: 'prop-fry-pan-l2', src: 'images/prop-fry-pan-l2.png' },
                { alias: 'prop-fry-pan-l3', src: 'images/prop-fry-pan-l3.png' },
                { alias: 'prop-fry-pan-l4', src: 'images/prop-fry-pan-l4.png' },
                { alias: 'prop-fry-pan-l5', src: 'images/prop-fry-pan-l5.png' },
                { alias: 'prop-kettle-l2', src: 'images/prop-kettle-l2.png' },
                { alias: 'prop-kettle-l3', src: 'images/prop-kettle-l3.png' },
                // prop-pressure-cooker-l1/l2/l3 moved to 'critical' (the Prep Board tower's three levels).
                { alias: 'prop-rice-cooker-l1', src: 'images/prop-rice-cooker-l1.png' },
                { alias: 'prop-rice-cooker-l2', src: 'images/prop-rice-cooker-l2.png' },
                { alias: 'prop-rice-cooker-l3', src: 'images/prop-rice-cooker-l3.png' },
                { alias: 'prop-sauce-pan-l1', src: 'images/prop-sauce-pan-l1.png' },
                { alias: 'prop-sauce-pan-l2', src: 'images/prop-sauce-pan-l2.png' },
                { alias: 'prop-sauce-pan-l3', src: 'images/prop-sauce-pan-l3.png' },
                // prop-sauce-pot-l1/l2/l3 moved to 'critical' (Visual round
                // part 2 — the Fryer tower's three levels, replacing fry-pan).
                { alias: 'prop-spice-grinder-l1', src: 'images/prop-spice-grinder-l1.png' },
                { alias: 'prop-spice-grinder-l2', src: 'images/prop-spice-grinder-l2.png' },
                { alias: 'prop-spice-grinder-l3', src: 'images/prop-spice-grinder-l3.png' },
                { alias: 'prop-spice-grinder-l4', src: 'images/prop-spice-grinder-l4.png' },
                { alias: 'prop-steam-cooktop-l1', src: 'images/prop-steam-cooktop-l1.png' },
                // prop-stock-pot-l1/l2/l3 moved to 'critical' (the Grill tower's three levels).
                { alias: 'prop-water-dispenser-l2', src: 'images/prop-water-dispenser-l2.png' },
                // Round 26: dish trays (Art/_gen/dishes-final/), palette-
                // quantized via sharp/imagequant (quality:40) — same
                // technique dish-chai/dish-coffee already proved, matched
                // here rather than re-derived. Dimensions untouched.
                { alias: 'dish-aglio-e-olio', src: 'images/dish-aglio-e-olio.png' },
                { alias: 'dish-arrabbiata', src: 'images/dish-arrabbiata.png' },
                { alias: 'dish-baingan-bharta', src: 'images/dish-baingan-bharta.png' },
                { alias: 'dish-bamboo-shoot-fry', src: 'images/dish-bamboo-shoot-fry.png' },
                { alias: 'dish-bruschetta', src: 'images/dish-bruschetta.png' },
                { alias: 'dish-coconut-chutney', src: 'images/dish-coconut-chutney.png' },
                { alias: 'dish-dal-cooked', src: 'images/dish-dal-cooked.png' },
                { alias: 'dish-dal-tadka', src: 'images/dish-dal-tadka.png' },
                { alias: 'dish-gobhi-masala', src: 'images/dish-gobhi-masala.png' },
                { alias: 'dish-idli', src: 'images/dish-idli.png' },
                { alias: 'dish-jeera-rice', src: 'images/dish-jeera-rice.png' },
                { alias: 'dish-minestrone', src: 'images/dish-minestrone.png' },
                { alias: 'dish-naan', src: 'images/dish-naan.png' },
                { alias: 'dish-palak-aloo', src: 'images/dish-palak-aloo.png' },
                { alias: 'dish-pesto', src: 'images/dish-pesto.png' },
                { alias: 'dish-rasam', src: 'images/dish-rasam.png' },
                { alias: 'dish-risotto', src: 'images/dish-risotto.png' },
                { alias: 'dish-sambar', src: 'images/dish-sambar.png' },
                { alias: 'dish-sticky-rice', src: 'images/dish-sticky-rice.png' },
                { alias: 'dish-tomato-gravy', src: 'images/dish-tomato-gravy.png' },
                { alias: 'dish-upma', src: 'images/dish-upma.png' },
                { alias: 'dish-veg-momo', src: 'images/dish-veg-momo.png' },
                { alias: 'dish-veg-thukpa', src: 'images/dish-veg-thukpa.png' },
                { alias: 'dish-xaak-bhaji', src: 'images/dish-xaak-bhaji.png' },
                // Round 26: the five INGREDIENT_CATALOG aliases that were
                // rendering as grey placeholder tiles. ing-tea-leaf is a
                // Art/_gen/ingredients/ render (palette-quantized, same as
                // the dish trays above); the other four are _sliced crops
                // (plain copy, same as the props above).
                { alias: 'ing-tea-leaf', src: 'images/ing-tea-leaf.png' },
                { alias: 'ing-coffee-extract', src: 'images/ing-coffee-extract.png' },
                { alias: 'ing-cream', src: 'images/ing-cream.png' },
                { alias: 'ing-rice', src: 'images/ing-rice.png' },
                { alias: 'ing-ghee', src: 'images/ing-ghee.png' },
                // Visual round, task 1 (docs/LevelBlocks.md §7): the nine
                // Challenge Mode backdrops, 720x1280 each (~120 KB). MUST
                // stay deferred — one promoted to critical would add ~120 KB
                // (~25%) to first paint, paid by exactly the first-time
                // players Daily Unique Plays counts. towerScene.ts's
                // ensureBlockAssets loads the current+next block's backdrop
                // in the same Assets.load() batch as that block's dishes —
                // same race, same fix, not a second mechanism.
                { alias: 'bg-block-1', src: 'images/bg-block-1.jpg' },
                { alias: 'bg-block-2', src: 'images/bg-block-2.jpg' },
                { alias: 'bg-block-3', src: 'images/bg-block-3.jpg' },
                { alias: 'bg-block-4', src: 'images/bg-block-4.jpg' },
                { alias: 'bg-block-5', src: 'images/bg-block-5.jpg' },
                { alias: 'bg-block-6', src: 'images/bg-block-6.jpg' },
                { alias: 'bg-block-7', src: 'images/bg-block-7.jpg' },
                { alias: 'bg-block-8', src: 'images/bg-block-8.jpg' },
                { alias: 'bg-block-9', src: 'images/bg-block-9.jpg' },
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
