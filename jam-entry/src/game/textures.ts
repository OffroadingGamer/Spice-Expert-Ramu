/**
 * Every texture the game uses comes from here, resolved in two steps:
 *
 *   1. REAL ART — if the alias is listed in src/assets/manifest.ts (and so
 *      was loaded at boot), that image is used.
 *   2. PROCEDURAL FALLBACK — otherwise the placeholder is drawn at runtime,
 *      so the game always runs, even with zero bundled images.
 *
 * To swap in your art: drop a PNG in public/images/, add it to the manifest
 * under the alias named on the make*() function below, done — no code
 * changes anywhere else.
 *
 * Aliases (display sizes live in CONFIG.sizes; author real art at 2x them):
 *   'proj-fox' / 'proj-owl' / 'proj-bear'      projectiles (beams draw as lines)
 *   'fx-ice'                                   translucent cube over frozen enemies
 *   'pad' / 'pad-gold'                         occupied build spot (plain / bonused)
 *   'burrow'                                   hole the bugs enter/exit through
 *   'grass-tile'                               fallback ground, tiles on both axes
 *
 * The four towers (fox/owl/bear/squirrel) are a second exception, alongside
 * the enemies below: each draws from ITS OWN THREE per-level `prop-*`
 * aliases (see TOWER_PROP_LEVELS and makeTowerLevelTextures), not a single
 * fixed `tower-*` alias — Round G's tower-fox.png etc. were retired in the
 * visual round (docs/LevelBlocks.md §10) once the stations got real
 * per-level Kitchen Essentials art instead of one fixed silhouette.
 * The empty-slot ghost decals ('pad'/'pad-gold's counterpart) have no art of
 * their own — makePadGhostTexture/makePadGoldGhostTexture are always
 * procedural, there being no ghost-slot PNG to swap in.
 *
 * The five enemies (beetle/wasp/snail/hornet/stag) are the exception: they
 * draw from the dish-* aliases already registered for the recipe game (see
 * manifest.ts), not a dedicated enemy-* alias — art('enemy-beetle', ...) was
 * pointing at genuine insect PNGs baked Sep 4, before the 30-dish roster was
 * canon (Round G). Each make*Texture() below hardcodes which dish alias it
 * reads, via artSquare() so a non-square tray never gets stretched.
 *
 * Procedural textures are drawn at 2x their design-unit display size and
 * scaled down by the sprites that use them, so edges stay crisp at high DPR.
 */
import { Assets, Container, Graphics, Sprite, Texture, type Renderer } from 'pixi.js';
import { CONFIG } from './config.ts';

const C = CONFIG.colors;
const SS = 2;

const generated = new WeakSet<Texture>();

/** Manifest-listed art wins; the drawn placeholder is the fallback. */
function art(alias: string, fallback: () => Texture): Texture {
    if (Assets.cache.has(alias)) return Assets.get<Texture>(alias);
    return fallback();
}

/**
 * The alpha content bounding box of a texture, in that texture's own pixel
 * space — cached per alias (renderer.extract.pixels is a GPU readback, and
 * every dish alias only needs scanning once for the run). A fully
 * transparent source (shouldn't happen for real art) falls back to the
 * whole-texture box rather than degenerately fitting a zero-size region.
 */
const contentBBoxCache = new Map<string, { x: number; y: number; w: number; h: number }>();
function alphaContentBBox(renderer: Renderer, alias: string, tex: Texture): { x: number; y: number; w: number; h: number } {
    const cached = contentBBoxCache.get(alias);
    if (cached) return cached;
    const { pixels, width, height } = renderer.extract.pixels(tex);
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (pixels[(y * width + x) * 4 + 3] > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }
    const box = maxX >= minX
        ? { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
        : { x: 0, y: 0, w: width, h: height };
    contentBBoxCache.set(alias, box);
    return box;
}

/**
 * Same resolution rule as art(), but for sprites (like the dish trays) whose
 * natural aspect ratio isn't square: the loaded art is uniformly scaled so
 * its ALPHA CONTENT (not the file's raw canvas bounds) fits a `size` x
 * `size` square, centered, transparent letterbox around it, baked into a new
 * square texture. Callers that force sprite.width === sprite.height
 * (towerScene.ts's enemy sprites do) would otherwise stretch a landscape
 * tray non-uniformly.
 *
 * Playtest round, task 1: every dish file shares one 212x141 canvas, but
 * chai/coffee's actual art only fills a 75x55 corner of it against
 * 205x134 for the other 28 — scaling by the FILE bounds (the old behaviour)
 * gave every dish the same factor, so chai/coffee rendered at roughly a
 * third the apparent size of the rest. Fitting on the content box instead
 * makes every dish read at the same size regardless of how much transparent
 * margin its canvas carries.
 *
 * The baked texture is a fresh render, so it's tracked in `generated` like
 * gen()'s output for freeTexture() to reclaim.
 */
function artSquare(renderer: Renderer, alias: string, size: number, fallback: () => Texture): Texture {
    if (!Assets.cache.has(alias)) return fallback();
    const src = Assets.get<Texture>(alias);
    const bbox = alphaContentBBox(renderer, alias, src);
    const box = new Container();
    const bg = new Graphics().rect(0, 0, size, size).fill({ color: 0xffffff, alpha: 0 });
    const sprite = new Sprite(src);
    const scale = size / Math.max(bbox.w, bbox.h);
    sprite.width = src.width * scale;
    sprite.height = src.height * scale;
    sprite.anchor.set(0.5);
    // Center the CONTENT box on the square's center, not the whole (possibly
    // padded) source image — offset from the source's own center to the
    // content box's center, scaled the same as the sprite itself.
    const contentCx = bbox.x + bbox.w / 2;
    const contentCy = bbox.y + bbox.h / 2;
    const offsetX = (contentCx - src.width / 2) * scale;
    const offsetY = (contentCy - src.height / 2) * scale;
    sprite.position.set(size / 2 + offsetX, size / 2 + offsetY);
    box.addChild(bg, sprite);
    const tex = renderer.generateTexture({ target: box, resolution: 1 });
    box.destroy({ children: true });
    generated.add(tex);
    return tex;
}

/**
 * Final round Tier 1, task 2: normalised content extent for a dish alias —
 * the larger of width/height is 1, the other is its ratio to it. artSquare
 * already measures this (via alphaContentBBox) to fit the sprite; exposing
 * it lets towerScene.ts size a dish's glow as an ellipse matching its actual
 * proportions instead of a fixed circle. Falls back to a square extent when
 * the alias isn't loaded — the same case artSquare falls back to a drawn
 * placeholder for.
 */
export function dishContentExtent(renderer: Renderer, dishSlug: string): { w: number; h: number } {
    const alias = `dish-${dishSlug}`;
    if (!Assets.cache.has(alias)) return { w: 1, h: 1 };
    const src = Assets.get<Texture>(alias);
    const bbox = alphaContentBBox(renderer, alias, src);
    const m = Math.max(bbox.w, bbox.h);
    return { w: bbox.w / m, h: bbox.h / m };
}

function gen(renderer: Renderer, draw: (g: Graphics) => void): Texture {
    const g = new Graphics();
    draw(g);
    const tex = renderer.generateTexture({ target: g, resolution: 1 });
    g.destroy();
    generated.add(tex);
    return tex;
}

/**
 * Scene teardown MUST use this instead of texture.destroy(): generated
 * placeholders are per-scene and freed; manifest-loaded art is shared in
 * the Assets cache and must survive scene remounts.
 */
export function freeTexture(tex: Texture): void {
    if (generated.has(tex)) tex.destroy(true);
}

const T = CONFIG.sizes.tower * SS;

/** Fox: orange, pointed ears, white muzzle. */
function drawFoxFallback(g: Graphics): void {
    const w = T;
    const h = T;
    // ears
    g.poly([w * 0.14, h * 0.3, w * 0.24, h * 0.02, w * 0.4, h * 0.24]).fill(C.fox);
    g.poly([w * 0.86, h * 0.3, w * 0.76, h * 0.02, w * 0.6, h * 0.24]).fill(C.fox);
    g.poly([w * 0.19, h * 0.24, w * 0.25, h * 0.08, w * 0.34, h * 0.22]).fill(C.foxDark);
    g.poly([w * 0.81, h * 0.24, w * 0.75, h * 0.08, w * 0.66, h * 0.22]).fill(C.foxDark);
    // head/body
    g.roundRect(w * 0.08, h * 0.18, w * 0.84, h * 0.78, w * 0.3).fill(C.fox);
    // muzzle
    g.ellipse(w * 0.5, h * 0.68, w * 0.26, h * 0.2).fill(C.belly);
    g.ellipse(w * 0.5, h * 0.58, w * 0.07, h * 0.05).fill(C.eyePupil);
    // eyes
    g.circle(w * 0.33, h * 0.46, w * 0.08).fill(C.eyeWhite);
    g.circle(w * 0.67, h * 0.46, w * 0.08).fill(C.eyeWhite);
    g.circle(w * 0.33, h * 0.475, w * 0.04).fill(C.eyePupil);
    g.circle(w * 0.67, h * 0.475, w * 0.04).fill(C.eyePupil);
}

/** Owl: violet-grey, huge eyes, tufts. */
function drawOwlFallback(g: Graphics): void {
    const w = T;
    const h = T;
    // tufts
    g.poly([w * 0.2, h * 0.22, w * 0.14, h * 0.02, w * 0.36, h * 0.14]).fill(C.owlDark);
    g.poly([w * 0.8, h * 0.22, w * 0.86, h * 0.02, w * 0.64, h * 0.14]).fill(C.owlDark);
    // body
    g.roundRect(w * 0.08, h * 0.1, w * 0.84, h * 0.86, w * 0.36).fill(C.owl);
    // belly feathers
    g.ellipse(w * 0.5, h * 0.76, w * 0.28, h * 0.18).fill(C.belly);
    // eye discs
    g.circle(w * 0.33, h * 0.4, w * 0.17).fill(C.belly);
    g.circle(w * 0.67, h * 0.4, w * 0.17).fill(C.belly);
    g.circle(w * 0.33, h * 0.4, w * 0.09).fill(C.eyePupil);
    g.circle(w * 0.67, h * 0.4, w * 0.09).fill(C.eyePupil);
    g.circle(w * 0.36, h * 0.37, w * 0.03).fill(C.eyeWhite);
    g.circle(w * 0.7, h * 0.37, w * 0.03).fill(C.eyeWhite);
    // beak
    g.poly([w * 0.5, h * 0.48, w * 0.44, h * 0.58, w * 0.56, h * 0.58]).fill(C.wasp);
}

/** Bear: big, brown, round ears. */
function drawBearFallback(g: Graphics): void {
    const w = T;
    const h = T;
    // ears
    g.circle(w * 0.22, h * 0.14, w * 0.13).fill(C.bear);
    g.circle(w * 0.78, h * 0.14, w * 0.13).fill(C.bear);
    g.circle(w * 0.22, h * 0.14, w * 0.06).fill(C.bearDark);
    g.circle(w * 0.78, h * 0.14, w * 0.06).fill(C.bearDark);
    // body
    g.roundRect(w * 0.04, h * 0.1, w * 0.92, h * 0.86, w * 0.32).fill(C.bear);
    // muzzle
    g.ellipse(w * 0.5, h * 0.62, w * 0.24, h * 0.18).fill(C.belly);
    g.ellipse(w * 0.5, h * 0.55, w * 0.08, h * 0.055).fill(C.eyePupil);
    // eyes
    g.circle(w * 0.32, h * 0.4, w * 0.055).fill(C.eyePupil);
    g.circle(w * 0.68, h * 0.4, w * 0.055).fill(C.eyePupil);
}

/** Squirrel: russet, big tail arcing behind, tufted ears. */
function drawSquirrelFallback(g: Graphics): void {
    const w = T;
    const h = T;
    // the tail, arcing up behind the body
    g.ellipse(w * 0.82, h * 0.42, w * 0.2, h * 0.4).fill(C.squirrelDark);
    g.ellipse(w * 0.78, h * 0.3, w * 0.13, h * 0.2).fill(C.squirrel);
    // ears
    g.poly([w * 0.18, h * 0.28, w * 0.26, h * 0.04, w * 0.38, h * 0.24]).fill(C.squirrel);
    g.poly([w * 0.62, h * 0.24, w * 0.72, h * 0.04, w * 0.8, h * 0.26]).fill(C.squirrel);
    // body
    g.roundRect(w * 0.06, h * 0.18, w * 0.7, h * 0.78, w * 0.26).fill(C.squirrel);
    // belly
    g.ellipse(w * 0.41, h * 0.72, w * 0.22, h * 0.2).fill(C.belly);
    // eyes
    g.circle(w * 0.26, h * 0.42, w * 0.07).fill(C.eyeWhite);
    g.circle(w * 0.54, h * 0.42, w * 0.07).fill(C.eyeWhite);
    g.circle(w * 0.27, h * 0.435, w * 0.035).fill(C.eyePupil);
    g.circle(w * 0.55, h * 0.435, w * 0.035).fill(C.eyePupil);
    // static spark above the head
    g.poly([
        w * 0.46, h * 0.02, w * 0.4, h * 0.14, w * 0.46, h * 0.14,
        w * 0.4, h * 0.26, w * 0.52, h * 0.12, w * 0.46, h * 0.12,
    ]).fill(C.lightning);
}

/** Station id -> its draw function (the identical-at-every-level silhouette
 *  used only when a station has no registered prop art at all). */
const STATION_FALLBACK: Record<string, (g: Graphics) => void> = {
    fox: drawFoxFallback,
    owl: drawOwlFallback,
    bear: drawBearFallback,
    squirrel: drawSquirrelFallback,
};

/**
 * Visual round, task 2 (docs/LevelBlocks.md §10): each station's three tower
 * LEVELS are now real kitchen-prop art (Kitchen Essentials pack, already
 * deployed for Kitchen Mode), one alias per level, replacing the single
 * fixed tower-*.png silhouette Round G drew at every level. The mapping is
 * set by the user, not derived: Grill/fox -> stock pot, Prep Board/owl ->
 * pressure cooker, Tandoor/bear -> cooktop (indices 2/3/5, deliberately
 * skipping 1 and 4), Fryer/squirrel -> sauce pot (indices 1/2/3) — §10's
 * own table is the source of truth if this ever needs re-deriving.
 *
 * Fryer/squirrel was REMAPPED in visual round part 2: the original choice,
 * fry pan (indices 2/3/4), isn't fry-pan art at all — every fry-pan tier
 * renders a bowl of FINISHED FOOD, the same category of object as the
 * enemies, so the tower looked like the dish it shoots at. Sauce pot is
 * genuine equipment with a consistent silhouette across all three tiers.
 */
const TOWER_PROP_LEVELS: Record<string, [string, string, string]> = {
    fox: ['prop-stock-pot-l1', 'prop-stock-pot-l2', 'prop-stock-pot-l3'],
    owl: ['prop-pressure-cooker-l1', 'prop-pressure-cooker-l2', 'prop-pressure-cooker-l3'],
    bear: ['prop-cooktop-l2', 'prop-cooktop-l3', 'prop-cooktop-l5'],
    squirrel: ['prop-sauce-pot-l1', 'prop-sauce-pot-l2', 'prop-sauce-pot-l3'],
};

/**
 * The three level textures for one station: real prop art where the manifest
 * has it, the ORIGINAL procedural silhouette (same drawing at all 3 levels,
 * as before this round) as a per-texture fallback otherwise — so a missing
 * PNG degrades one tier gracefully instead of the whole station.
 *
 * Deliberately returns each tier's RAW (un-square-baked) texture, unlike
 * enemies' artSquare(): towerScene.ts needs each tier's true aspect ratio
 * and native pixel size to compute the per-family uniform fit (§10's "fit
 * per FAMILY, not per sprite" — the sizes are wildly inconsistent, e.g. the
 * Tandoor's three are 118x131 / 158x261 / 246x191, and independently
 * square-fitting each would make the Lv2->Lv3 upgrade read as a squash).
 */
export function makeTowerLevelTextures(renderer: Renderer, stationId: string): [Texture, Texture, Texture] {
    const aliases = TOWER_PROP_LEVELS[stationId];
    const fallbackDraw = STATION_FALLBACK[stationId];
    const fallback = () => gen(renderer, (g) => fallbackDraw(g));
    if (!aliases || !fallbackDraw) return [fallback(), fallback(), fallback()];
    return [art(aliases[0], fallback), art(aliases[1], fallback), art(aliases[2], fallback)];
}

/**
 * Playtest round, task 2: a device playtest found the stations reading too
 * small against the board. §10's per-family fit (one bounding box across a
 * station's 3 tiers, one shared factor so the largest raw dimension fills
 * SZ.tower) stays exactly as designed — this only scales the RESULT by a
 * flat bonus. Pulled out as the one place both consumers of that fit
 * (towerScene.ts's board sprites and towerIcons.ts's build-menu icon) derive
 * their size from, so the two can't drift out of sync with each other.
 */
const PROP_SCALE_BONUS = 1.25;

/**
 * Final polish round, task 3: the shared per-family factor is set by
 * whichever tier has the largest raw dimension — for Tandoor/bear
 * (118x131 -> 158x261 -> 246x191) that's Lv2's height, so Lv1's own largest
 * dimension (131) only fills ~50% of the family box, against 96-100% for
 * every other station (whose Lv1 IS close to the family's largest tier).
 * Rather than special-case Tandoor, any level whose fill falls under this
 * floor is scaled up to it individually — generic, so it self-corrects if
 * future art changes which tier ends up smallest, and levels that already
 * clear the floor (every level of every other station, and Tandoor's own
 * Lv2/Lv3) are untouched.
 */
const MIN_LEVEL_FILL = 0.63;

export type TowerLevelSize = { w: number; h: number };

export function makeTowerLevelSizes(texes: [Texture, Texture, Texture]): [TowerLevelSize, TowerLevelSize, TowerLevelSize] {
    const bboxMax = Math.max(...texes.flatMap((t) => [t.width, t.height]));
    const familyBox = CONFIG.sizes.tower * PROP_SCALE_BONUS;
    const factor = familyBox / bboxMax;
    return texes.map((t) => {
        const levelMax = Math.max(t.width, t.height);
        const fill = levelMax / bboxMax;
        const levelFactor = fill < MIN_LEVEL_FILL ? (familyBox * MIN_LEVEL_FILL) / levelMax : factor;
        return { w: t.width * levelFactor, h: t.height * levelFactor };
    }) as [TowerLevelSize, TowerLevelSize, TowerLevelSize];
}

/**
 * Bakes ONE texture into a size x size square (transparent letterbox,
 * top-left of the content free to sit off-center — only used for the
 * build-menu icon, which centers via CSS anyway) at an explicit w x h,
 * rather than a uniform scale — towerIcons.ts uses this to render a
 * station's level-1 art at the SAME per-family (+bonus) size the board
 * uses, so BuildSheet.tsx's object-contain <img> shows it at a
 * correspondingly larger fraction of its fixed 48px box instead of the
 * raw, un-scaled source dimensions.
 */
export function bakeTowerIcon(renderer: Renderer, tex: Texture, w: number, h: number): Texture {
    const size = Math.max(w, h);
    const box = new Container();
    const bg = new Graphics().rect(0, 0, size, size).fill({ color: 0xffffff, alpha: 0 });
    const sprite = new Sprite(tex);
    sprite.width = w;
    sprite.height = h;
    sprite.anchor.set(0.5);
    sprite.position.set(size / 2, size / 2);
    box.addChild(bg, sprite);
    const out = renderer.generateTexture({ target: box, resolution: 1 });
    box.destroy({ children: true });
    generated.add(out);
    return out;
}

function bugBase(g: Graphics, w: number, h: number, body: number, dark: number): void {
    g.ellipse(w * 0.5, h * 0.55, w * 0.42, h * 0.38).fill(body);
    g.ellipse(w * 0.5, h * 0.3, w * 0.24, h * 0.2).fill(dark);
    // eyes on the head blob
    g.circle(w * 0.42, h * 0.26, w * 0.045).fill(C.eyeWhite);
    g.circle(w * 0.58, h * 0.26, w * 0.045).fill(C.eyeWhite);
}

/** Archetype silhouette (fallback only — real art is the dish tray via
 *  artSquare). Kept as one dispatcher (was 5 separate make*Texture
 *  functions) because Round I Task 6 needs a texture per (archetype, dish)
 *  PAIR, not one fixed alias per archetype — see makeEnemyTexture below. */
function drawArchetypeFallback(g: Graphics, archetypeId: string, s: number): void {
    switch (archetypeId) {
        case 'beetle':
            bugBase(g, s, s, C.beetle, C.beetleDark);
            g.rect(s * 0.48, s * 0.36, s * 0.04, s * 0.54).fill(C.beetleDark); // shell split
            break;
        case 'wasp':
            g.ellipse(s * 0.2, s * 0.42, s * 0.18, s * 0.1).fill({ color: 0xffffff, alpha: 0.5 });
            g.ellipse(s * 0.8, s * 0.42, s * 0.18, s * 0.1).fill({ color: 0xffffff, alpha: 0.5 });
            bugBase(g, s, s, C.wasp, C.waspDark);
            g.rect(s * 0.2, s * 0.5, s * 0.6, s * 0.09).fill(C.waspDark);
            g.rect(s * 0.24, s * 0.68, s * 0.52, s * 0.09).fill(C.waspDark);
            break;
        case 'snail':
            // body/foot
            g.ellipse(s * 0.45, s * 0.78, s * 0.4, s * 0.16).fill(C.snail);
            g.circle(s * 0.16, s * 0.5, s * 0.11).fill(C.snail); // head
            g.circle(s * 0.13, s * 0.45, s * 0.028).fill(C.eyePupil);
            // shell spiral
            g.circle(s * 0.58, s * 0.5, s * 0.3).fill(C.snailShell);
            g.circle(s * 0.58, s * 0.5, s * 0.18).fill(C.snail);
            g.circle(s * 0.58, s * 0.5, s * 0.08).fill(C.snailShell);
            break;
        case 'hornet':
            g.ellipse(s * 0.2, s * 0.38, s * 0.2, s * 0.11).fill({ color: 0xffffff, alpha: 0.5 });
            g.ellipse(s * 0.8, s * 0.38, s * 0.2, s * 0.11).fill({ color: 0xffffff, alpha: 0.5 });
            bugBase(g, s, s, C.hornet, C.waspDark);
            g.rect(s * 0.2, s * 0.52, s * 0.6, s * 0.09).fill(C.waspDark);
            // stinger
            g.poly([s * 0.5, s * 0.98, s * 0.44, s * 0.84, s * 0.56, s * 0.84]).fill(C.waspDark);
            break;
        case 'stag':
            // mandibles
            g.poly([s * 0.34, s * 0.2, s * 0.18, s * 0.0, s * 0.3, s * 0.0, s * 0.44, s * 0.16]).fill(C.stag);
            g.poly([s * 0.66, s * 0.2, s * 0.82, s * 0.0, s * 0.7, s * 0.0, s * 0.56, s * 0.16]).fill(C.stag);
            bugBase(g, s, s, C.stag, C.beetleDark);
            g.rect(s * 0.48, s * 0.36, s * 0.04, s * 0.54).fill(C.beetleDark);
            // angry brows
            g.rect(s * 0.36, s * 0.2, s * 0.1, s * 0.025).fill(C.eyeWhite);
            g.rect(s * 0.54, s * 0.2, s * 0.1, s * 0.025).fill(C.eyeWhite);
            break;
        default:
            bugBase(g, s, s, C.beetle, C.beetleDark);
    }
}

/**
 * Round I Task 6: one enemy is now painted with whichever dish its current
 * BLOCK assigns to its archetype (data/blocks.ts) — up to 9 blocks x 5
 * archetypes x up to 2 alternating dishes, not the fixed 5 textures Round G
 * built once at scene creation. towerScene.ts builds these lazily, one per
 * (archetype, dish) pair actually seen, and caches them for the run.
 */
export function makeEnemyTexture(renderer: Renderer, archetypeId: string, dishSlug: string): Texture {
    const s = (CONFIG.sizes.enemy[archetypeId as keyof typeof CONFIG.sizes.enemy] ?? 44) * SS;
    return artSquare(renderer, `dish-${dishSlug}`, s, () => gen(renderer, (g) => drawArchetypeFallback(g, archetypeId, s)));
}

/**
 * Round I Task 5 / docs/LevelBlocks.md §6a: a soft radial glow rendered
 * BEHIND an enemy's tray, tinted per tier (red for snail/hornet, light gold
 * for stag; beetle/wasp get none). Deliberately NOT sprite.tint (that
 * channel is already owned by status effects — see towerScene.ts's poison/
 * burn tints) and deliberately NOT pixi-filters (not a dependency) — just a
 * procedurally generated concentric-circle falloff, like every other
 * placeholder texture in this file.
 */
export function makeGlowTexture(renderer: Renderer, color: number): Texture {
    return gen(renderer, (g) => {
        const s = 128;
        const cx = s / 2;
        const cy = s / 2;
        const steps = 10;
        const strokeWidth = cx / steps + 1;
        // Final round, task 7: the old falloff filled concentric DISCS,
        // largest first with smaller ones stacked on top — alpha blending
        // means the centre always ends up the most painted-over region no
        // matter how each ring's own alpha is weighted, so that shape can
        // only ever read as a halo. Stroking a series of thin, largely
        // non-overlapping RINGS instead lets each radius carry its own
        // alpha independently: the peak sits near the outer edge (a
        // gaussian bump at ~82% of the radius) and falls off toward both
        // the transparent centre and the true edge, reading as a rim-light.
        //
        // Final round Tier 1, task 2: the outermost ring sat at exactly
        // r = cx, so half its stroke fell outside the 128px canvas — a hard
        // cut at alpha ~0.32 right at the texture boundary. Pulling it in by
        // half a stroke width keeps the whole ring inside the texture.
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const r = i === steps ? cx - strokeWidth / 2 : cx * t;
            const rim = Math.exp(-((t - 0.82) ** 2) / (2 * 0.16 ** 2));
            g.circle(cx, cy, r).stroke({ width: strokeWidth, color, alpha: 0.6 * rim });
        }
    });
}

export function makeProjFoxTexture(renderer: Renderer): Texture {
    return art('proj-fox', () => gen(renderer, (g) => {
        const s = CONFIG.sizes.projectile * SS;
        g.poly([s * 0.5, 0, s, s * 0.5, s * 0.5, s, 0, s * 0.5]).fill(C.arrow);
    }));
}

export function makeProjOwlTexture(renderer: Renderer): Texture {
    return art('proj-owl', () => gen(renderer, (g) => {
        const s = CONFIG.sizes.projectile * SS;
        g.circle(s / 2, s / 2, s * 0.4).fill(C.frost);
        g.circle(s / 2, s / 2, s * 0.2).fill(C.eyeWhite);
    }));
}

export function makeProjBearTexture(renderer: Renderer): Texture {
    return art('proj-bear', () => gen(renderer, (g) => {
        const s = CONFIG.sizes.projectile * SS;
        g.circle(s / 2, s / 2, s * 0.5).fill(C.boulder);
        g.circle(s * 0.38, s * 0.38, s * 0.14).fill({ color: 0xffffff, alpha: 0.35 });
    }));
}

/** Translucent ice cube, drawn over frozen bugs (scaled per bug by the view). */
export function makeIceCubeTexture(renderer: Renderer): Texture {
    return art('fx-ice', () => gen(renderer, (g) => {
        const s = 64 * SS;
        g.roundRect(0, 0, s, s, s * 0.18).fill({ color: C.ice, alpha: 0.55 });
        g.roundRect(s * 0.06, s * 0.06, s * 0.88, s * 0.88, s * 0.14)
            .stroke({ width: s * 0.05, color: 0xffffff, alpha: 0.5 });
        // glint
        g.poly([s * 0.16, s * 0.34, s * 0.34, s * 0.16, s * 0.44, s * 0.16, s * 0.16, s * 0.44])
            .fill({ color: 0xffffff, alpha: 0.55 });
    }));
}

/**
 * Round 5 Part 1 (docs/Ideas.md §6d amendment, "prop feedback bundle"): a
 * solid white radial falloff, ~64px, for the on-fire heat flash — filled
 * concentric discs (largest/faintest first, smaller/brighter painted on top)
 * rather than makeGlowTexture's stroked RINGS above: that shape is a rim-
 * light on purpose (built for a halo behind an enemy tray); this wants a
 * plain bright-centre bloom instead, so discs are the right primitive here,
 * not a defect repeat of the rim-light finding. One shared, untinted texture
 * — towerScene.ts tints it per archetype via sprite.tint.
 */
export function makeHeatFlashTexture(renderer: Renderer): Texture {
    return gen(renderer, (g) => {
        const s = 64 * SS;
        const cx = s / 2;
        const steps = 12;
        for (let i = steps; i >= 1; i--) {
            const t = i / steps;
            g.circle(cx, cx, cx * t).fill({ color: 0xffffff, alpha: (1 - t) ** 1.6 });
        }
    });
}

/**
 * Round 5 Part 1 task 3: a projectile trail — a narrow strip fading from
 * opaque (head) to transparent (tail), stacked as thin horizontal bands
 * (same "no native gradient fill in this codebase" posture as every other
 * procedural texture here). towerScene.ts anchors this at (0.5, 0), sets its
 * height to the design-unit trail length every frame, and rotates it to face
 * back along the projectile's own travel direction — the texture itself is
 * drawn tall/thin so the anchor math has one fixed source shape to scale.
 */
export function makeProjTrailTexture(renderer: Renderer): Texture {
    return gen(renderer, (g) => {
        const w = 6 * SS;
        const h = 32 * SS;
        const steps = 10;
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            const bandH = h / steps + 1;
            g.rect(0, t * h, w, bandH).fill({ color: 0xffffff, alpha: 0.7 * (1 - t) });
        }
    });
}

/** Round 5 Part 1 task 4: one small white puff for the idle cooking loop's
 *  steam — pooled and reused (towerScene.ts), so this is drawn once. */
export function makeSteamPuffTexture(renderer: Renderer): Texture {
    return gen(renderer, (g) => {
        const s = 20 * SS;
        g.circle(s / 2, s / 2, s / 2).fill({ color: 0xffffff, alpha: 0.85 });
    });
}

/**
 * Playtest round, task 3: the solid stone pad/gold-pad decal (formerly shown
 * under a PLACED tower) was retired — an occupied pad now shows no decal at
 * all (see towerScene.ts's syncPads). The 'pad'/'pad-gold' manifest aliases
 * these two functions resolved are retired alongside them (manifest.ts) —
 * same "no callers left, remove the alias" treatment the Fryer's stale
 * fry-pan aliases got in the visual round's part 2.
 */

/** Draws a dashed ring (no filled interior) around an ellipse — used for the
 *  ghost/empty build-slot decals below. Pixi's Graphics has no native dash
 *  support, so each dash is drawn as its own short polyline segment with a
 *  gap after it. */
function drawDashedEllipse(g: Graphics, cx: number, cy: number, rx: number, ry: number, color: number, strokeWidth: number): void {
    const dashCount = 14;
    const dashFraction = 0.55; // fraction of each segment that's ink, rest is gap
    for (let i = 0; i < dashCount; i++) {
        const a0 = (i / dashCount) * Math.PI * 2;
        const a1 = a0 + ((Math.PI * 2) / dashCount) * dashFraction;
        g.moveTo(cx + Math.cos(a0) * rx, cy + Math.sin(a0) * ry);
        const steps = 3; // a few line segments per dash so the ellipse curve still reads
        for (let s = 1; s <= steps; s++) {
            const a = a0 + (a1 - a0) * (s / steps);
            g.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
        }
    }
    g.stroke({ width: strokeWidth, color, alpha: 0.9 });
}

/**
 * Visual round, task 4 (docs/LevelBlocks.md §9's "002" schematic): an EMPTY
 * build slot reads as a dotted outline, not a filled stone disc — the solid
 * pad.png/pad-gold.png decal read ambiguously against a placed tower
 * (flagged in a v1.47.0 playtest, and the same "ugly sprites... causing
 * ambiguity" complaint the 002 schematic recorded). No ghost-slot art was
 * delivered, so this is procedural like every other placeholder in this
 * file. Gold vs plain keeps the bonus-pad distinction alive while empty
 * (towerScene.ts's syncPads swaps back to the solid pad/pad-gold decal the
 * moment a tower is placed there).
 */
export function makePadGhostTexture(renderer: Renderer): Texture {
    return gen(renderer, (g) => {
        const w = CONFIG.sizes.pad.w * SS;
        const h = CONFIG.sizes.pad.h * SS;
        // Final polish round, task 5: shrunk from 0.46/0.4 (~0.48 of pad
        // width) to ~0.38 — pads 0, 4 and 5 sit only 11-16 design units from
        // the belt edge, so the old radius visually touched it.
        drawDashedEllipse(g, w * 0.5, h * 0.5, w * 0.38, h * 0.33, C.pad, 3 * SS);
    });
}

/** Gold counterpart of makePadGhostTexture, for bonused-but-empty slots. */
export function makePadGoldGhostTexture(renderer: Renderer): Texture {
    return gen(renderer, (g) => {
        const w = CONFIG.sizes.pad.w * SS;
        const h = CONFIG.sizes.pad.h * SS;
        drawDashedEllipse(g, w * 0.5, h * 0.5, w * 0.38, h * 0.33, C.gold, 3 * SS);
    });
}

/** Burrow: the dark hole bugs crawl out of (path start) and escape into (path end). */
export function makeBurrowTexture(renderer: Renderer): Texture {
    return art('burrow', () => gen(renderer, (g) => {
        const w = 110 * SS;
        const h = 64 * SS;
        // mounded dirt rim
        g.ellipse(w * 0.5, h * 0.5, w * 0.5, h * 0.48).fill(C.pathEdge);
        g.ellipse(w * 0.5, h * 0.46, w * 0.44, h * 0.38).fill(C.pathDirt);
        // the hole
        g.ellipse(w * 0.5, h * 0.52, w * 0.36, h * 0.28).fill(0x120e16);
        // inner shadow crescent
        g.ellipse(w * 0.5, h * 0.42, w * 0.3, h * 0.14).fill(0x000000);
    }));
}

/** Grass tile — MUST tile seamlessly on both axes (speckles off the edges). */
export function makeGrassTexture(renderer: Renderer): Texture {
    return art('grass-tile', () => gen(renderer, (g) => {
        const s = 120 * SS;
        g.rect(0, 0, s, s).fill(C.grass);
        const specks: [number, number][] = [
            [0.2, 0.3], [0.55, 0.18], [0.75, 0.55], [0.3, 0.7], [0.6, 0.82], [0.12, 0.55],
        ];
        for (const [x, y] of specks) {
            g.roundRect(s * x, s * y, s * 0.06, s * 0.03, 4).fill(C.grassSpeck);
        }
    }));
}
