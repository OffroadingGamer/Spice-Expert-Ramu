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
 * Same resolution rule as art(), but for sprites (like the dish trays) whose
 * natural aspect ratio isn't square: the loaded art is uniformly scaled to
 * CONTAIN within a `size` x `size` square (centered, transparent letterbox)
 * and baked into a new square texture. Callers that force sprite.width ===
 * sprite.height (towerScene.ts's enemy sprites do) would otherwise stretch a
 * landscape tray non-uniformly. The baked texture is a fresh render, so it's
 * tracked in `generated` like gen()'s output for freeTexture() to reclaim.
 */
function artSquare(renderer: Renderer, alias: string, size: number, fallback: () => Texture): Texture {
    if (!Assets.cache.has(alias)) return fallback();
    const src = Assets.get<Texture>(alias);
    const box = new Container();
    const bg = new Graphics().rect(0, 0, size, size).fill({ color: 0xffffff, alpha: 0 });
    const sprite = new Sprite(src);
    const scale = size / Math.max(src.width, src.height);
    sprite.width = src.width * scale;
    sprite.height = src.height * scale;
    sprite.anchor.set(0.5);
    sprite.position.set(size / 2, size / 2);
    box.addChild(bg, sprite);
    const tex = renderer.generateTexture({ target: box, resolution: 1 });
    box.destroy({ children: true });
    generated.add(tex);
    return tex;
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
 * skipping 1 and 4), Fryer/squirrel -> fry pan (indices 2/3/4, skipping 1
 * and 5) — §10's own table is the source of truth if this ever needs
 * re-deriving.
 */
const TOWER_PROP_LEVELS: Record<string, [string, string, string]> = {
    fox: ['prop-stock-pot-l1', 'prop-stock-pot-l2', 'prop-stock-pot-l3'],
    owl: ['prop-pressure-cooker-l1', 'prop-pressure-cooker-l2', 'prop-pressure-cooker-l3'],
    bear: ['prop-cooktop-l2', 'prop-cooktop-l3', 'prop-cooktop-l5'],
    squirrel: ['prop-fry-pan-l2', 'prop-fry-pan-l3', 'prop-fry-pan-l4'],
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
        const steps = 8;
        for (let i = steps; i >= 1; i--) {
            const r = cx * (i / steps);
            const alpha = Math.min(0.5, 0.05 + 0.055 * (steps - i));
            g.circle(cx, cy, r).fill({ color, alpha });
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

/** Stone build pad: flat 3/4 ellipse. */
export function makePadTexture(renderer: Renderer): Texture {
    return art('pad', () => gen(renderer, (g) => {
        const w = CONFIG.sizes.pad.w * SS;
        const h = CONFIG.sizes.pad.h * SS;
        g.ellipse(w * 0.5, h * 0.55, w * 0.48, h * 0.42).fill(C.padDark);
        g.ellipse(w * 0.5, h * 0.48, w * 0.44, h * 0.36).fill(C.pad);
        g.ellipse(w * 0.36, h * 0.4, w * 0.09, h * 0.09).fill(C.padDark);
        g.ellipse(w * 0.62, h * 0.55, w * 0.07, h * 0.08).fill(C.padDark);
    }));
}

/** GOLD build pad: a bonus spot (config pads with a `bonus`). */
export function makeGoldPadTexture(renderer: Renderer): Texture {
    return art('pad-gold', () => gen(renderer, (g) => {
        const w = CONFIG.sizes.pad.w * SS;
        const h = CONFIG.sizes.pad.h * SS;
        g.ellipse(w * 0.5, h * 0.55, w * 0.48, h * 0.42).fill(C.goldDark);
        g.ellipse(w * 0.5, h * 0.48, w * 0.44, h * 0.36).fill(C.gold);
        // star etched into the stone
        const cx = w * 0.5;
        const cy = h * 0.48;
        const pts: number[] = [];
        for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? w * 0.11 : w * 0.045;
            const a = -Math.PI / 2 + (i * Math.PI) / 5;
            pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8);
        }
        g.poly(pts).fill(C.goldShine);
        g.ellipse(w * 0.34, h * 0.36, w * 0.06, h * 0.07).fill(C.goldShine);
    }));
}

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
        drawDashedEllipse(g, w * 0.5, h * 0.5, w * 0.46, h * 0.4, C.pad, 3 * SS);
    });
}

/** Gold counterpart of makePadGhostTexture, for bonused-but-empty slots. */
export function makePadGoldGhostTexture(renderer: Renderer): Texture {
    return gen(renderer, (g) => {
        const w = CONFIG.sizes.pad.w * SS;
        const h = CONFIG.sizes.pad.h * SS;
        drawDashedEllipse(g, w * 0.5, h * 0.5, w * 0.46, h * 0.4, C.gold, 3 * SS);
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
