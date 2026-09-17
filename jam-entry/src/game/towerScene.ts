/**
 * The rendered view over the pure engine (sim/engine.ts): one run per scene
 * instance. Everything gameplay-true happens in the engine; this file only
 * draws state, forwards taps, and keeps sprite pools in sync. A restart is a
 * keyed React remount (store.runId), so there is no in-scene reset path.
 *
 * All positions/sizes are design units (stage.ts).
 */
import {
    Assets,
    Container,
    Graphics,
    Sprite,
    Text,
    TextStyle,
    type Application,
    type FederatedPointerEvent,
    type Texture,
    type Ticker,
} from 'pixi.js';
import { CONFIG } from './config.ts';
import { WAVES, waveAt } from './data/waves.ts';
import { enemyDef } from './data/enemies.ts';
import { BLOCKS, blockForLevel, chefBodyAliasForBlock, type Block } from './data/blocks.ts';
import { MANIFEST } from '../assets/manifest.ts';
import { createEngine, posAt, PATH_LENGTH, type EngineEvent } from './sim/engine.ts';
import { registerEngine, syncStore, getTowersPlacedThisRun, grantFtueShortfall, retireFtue, FTUE_FIRST_PAD } from './actions.ts';
import { TOWERS } from './data/towers.ts';
import { dialogueForBlock } from './data/dialogue.ts';
import { queueDialogue } from './dialogueController.ts';
import { track, trackFunnelStep } from '../sdk/analytics.ts';
import {
    dishContentExtent,
    freeTexture,
    makeBurrowTexture,
    makeEnemyTexture,
    makeGlowTexture,
    makeGrassTexture,
    makeHeatFlashTexture,
    makeIceCubeTexture,
    makePadGhostTexture,
    makePadGoldGhostTexture,
    makeProjBearTexture,
    makeProjFoxTexture,
    makeProjOwlTexture,
    makeProjTrailTexture,
    makeSteamPuffTexture,
    makeTowerLevelSizes,
    makeTowerLevelTextures,
} from './textures.ts';
import { store } from '../state/store.ts';
import { getSave, recordRunEnd } from '../state/save.ts';
import { submitRunScores } from '../sdk/leaderboard.ts';
import { duckMusicForSting, playSample, resetMusicDuck, sfx } from '../audio/audio.ts';
import { PLAYFIELD_HEIGHT, type Stage } from './stage.ts';

/** The scene contract: every createXxxScene(app, stage) returns one of these. */
export interface Scene {
    destroy(): void;
}

// Dish-art race fix: which aliases the manifest actually registers — an
// alias with no manifest entry must never reach Assets.load (it throws).
// Same rule/pattern as kitchenScene.ts's MANIFEST_ALIASES.
const MANIFEST_ALIASES = new Set(MANIFEST.bundles.flatMap((b) => b.assets).map((a) => a.alias as string));

/** How long a REAL block-to-block backdrop crossfade takes (see
 *  createTowerScene's own BACKDROP_LOCK_S below, which locks Ready for
 *  exactly this long). Exported so ChefPortrait.tsx (Round 2) can fade the
 *  costume in the SAME window when the swap rides a real transition —
 *  one number, not a second copy. */
export const BACKDROP_FADE_S = 2.5;

/** This block's backdrop alias (docs/LevelBlocks.md §7). */
function backdropAliasForBlock(blockId: number): string {
    return `bg-block-${blockId}`;
}

/** Every asset one block needs before it can play — its enemies' dish-*
 *  aliases, its backdrop, AND its chef-body costume — filtered through
 *  MANIFEST_ALIASES so a not-yet-registered asset is silently skipped
 *  (falls back to the archetype silhouette / procedural backdrop / no chef
 *  sprite yet, same posture as today) instead of throwing. Visual round,
 *  task 1: the backdrop rides in the SAME Assets.load() batch as the dishes
 *  (ensureBlockAssets below) — same race, same fix, not a second mechanism;
 *  Rounds 0+1 extend that one batch again for the chef costume rather than
 *  adding a second prefetch path. */
function blockAssetAliases(block: Block): string[] {
    const aliases = new Set<string>();
    for (const slugs of Object.values(block.dishes)) {
        for (const slug of slugs) {
            const alias = `dish-${slug}`;
            if (MANIFEST_ALIASES.has(alias)) aliases.add(alias);
        }
    }
    const bgAlias = backdropAliasForBlock(block.id);
    if (MANIFEST_ALIASES.has(bgAlias)) aliases.add(bgAlias);
    const chefAlias = chefBodyAliasForBlock(block);
    if (MANIFEST_ALIASES.has(chefAlias)) aliases.add(chefAlias);
    return [...aliases];
}

export function createTowerScene(app: Application, stage: Stage): Scene {
    const SZ = CONFIG.sizes;

    const tex = {
        grass: makeGrassTexture(app.renderer),
        padGhost: makePadGhostTexture(app.renderer),
        padGhostGold: makePadGoldGhostTexture(app.renderer),
        burrow: makeBurrowTexture(app.renderer),
        ice: makeIceCubeTexture(app.renderer),
        // Round I Task 6: no longer a fixed 5 — every (archetype, dish) pair
        // actually spawned this run gets its own texture, built on first use
        // (see enemyTextureFor below) and cached here for the run's life.
        enemies: new Map<string, Texture>(),
        // §6a glow tiers: red (snail/hornet), light gold (stag); beetle/wasp
        // get none, so no texture is built for tier 1.
        glow: {
            red: makeGlowTexture(app.renderer, 0xff4040),
            gold: makeGlowTexture(app.renderer, 0xffd76a),
        },
        projectiles: {
            fox: makeProjFoxTexture(app.renderer),
            owl: makeProjOwlTexture(app.renderer),
            bear: makeProjBearTexture(app.renderer),
        } as Record<string, Texture>,
        // Round 5 Part 1 (docs/Ideas.md §6d amendment, "prop feedback
        // bundle"): one shared procedural texture per effect, reused via
        // sprite pooling below — never a texture per prop/shot.
        heatFlash: makeHeatFlashTexture(app.renderer),
        projTrail: makeProjTrailTexture(app.renderer),
        steamPuff: makeSteamPuffTexture(app.renderer),
    };

    /** Round 5 Part 1: read once per scene — a run doesn't live long enough
     *  for the OS setting to change mid-run, so no live matchMedia listener
     *  is needed. Gates ONLY the idle cooking loop's bob/steam and cuts the
     *  heat flash to a single frame, exactly the amendment's own reduced-
     *  motion scope — recoil squash and the projectile trail are brief
     *  (<=200ms) one-shot reactions to a player-caused event, not a looping
     *  ambient animation, so they're outside that scope. */
    const reducedMotion = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    /**
     * Visual round, task 2 (docs/LevelBlocks.md §10): each station's three
     * level textures, plus the on-screen (design-unit) size to render each
     * one at — computed ONCE per station here, not per sprite, because the
     * source art's raw pixel sizes are wildly inconsistent (e.g. the
     * Tandoor's three tiers are 118x131 / 158x261 / 246x191). Fitting each
     * tier independently into the 64-unit slot would make the upgrade read
     * as a squash (tall-narrow at Lv2, short-wide at Lv3) and let Prep Board
     * Lv1 outsize Lv2. Fix: one bounding box across the family (its largest
     * raw dimension across all 3 tiers), one shared scale factor derived
     * from it so that dimension exactly fills SZ.tower — every other tier
     * scales by the SAME factor, preserving their real relative sizes
     * instead of normalizing them away. syncTowers() anchors every sprite at
     * the BOTTOM edge (not center) so tiers of different heights still sit
     * on the pad consistently.
     *
     * Playtest round, task 2: the actual per-family factor (incl. the +25%
     * playtest bonus) now lives in textures.ts's makeTowerLevelSizes, shared
     * with towerIcons.ts's build-menu icon so both grow together.
     */
    const towerLevelTex: Record<string, [Texture, Texture, Texture]> = {};
    const towerDisplaySize: Record<string, [{ w: number; h: number }, { w: number; h: number }, { w: number; h: number }]> = {};
    for (const def of TOWERS) {
        const texes = makeTowerLevelTextures(app.renderer, def.id);
        towerLevelTex[def.id] = texes;
        towerDisplaySize[def.id] = makeTowerLevelSizes(texes);
    }

    /** Glow tier per archetype (docs/LevelBlocks.md §6a). */
    const GLOW_TIER: Record<string, 'red' | 'gold' | null> = {
        beetle: null,
        wasp: null,
        snail: 'red',
        hornet: 'red',
        stag: 'gold',
    };

    // Double-dish blocks (6-8, Overtime) alternate PER SPAWN — this counter,
    // one per archetype, drives that alternation (see enemyTextureFor).
    const dishSpawnCounter: Record<string, number> = {};

    /** The texture for one archetype at the CURRENT level, building and
     *  caching it on first use. Dish choice: data/blocks.ts's block for the
     *  current level, alternating per spawn when the block carries two.
     *  Also returns the dish itself — syncEnemies below needs it to size the
     *  sprite (final polish round, task 4: chai/coffee render larger). */
    function enemyTextureFor(archetypeId: string): { tex: Texture; dish: string } {
        const level = engine.state.waveIndex + 1;
        const block = blockForLevel(level);
        const dishes = block.dishes[archetypeId] ?? ['chai'];
        const n = dishSpawnCounter[archetypeId] ?? 0;
        dishSpawnCounter[archetypeId] = n + 1;
        const dish = dishes[n % dishes.length];
        const key = `${archetypeId}:${dish}`;
        let t = tex.enemies.get(key);
        if (!t) {
            t = makeEnemyTexture(app.renderer, archetypeId, dish);
            tex.enemies.set(key, t);
        }
        return { tex: t, dish };
    }

    /**
     * Final polish round, task 4: chai and coffee read too small against the
     * board — per-DISH, not per-archetype (a beetle/snail/stag serving chai
     * is bigger than the same archetype serving anything else). Chai/coffee
     * only appear in block 1 (data/blocks.ts), so this is block-1-only by
     * construction, not a special case wired to level number. Sizes are
     * cosmetic — targeting and splash use centre points (e.dist/e.x/e.y),
     * never sprite bounds — so this can't move `npm run balance`.
     *
     * Final round, task 5: base dish sizes grew (config.ts, 44 -> 64), so
     * this drops from 2 to 1.375 to hold block 1's already-approved size —
     * 64 * 1.375 = 88, the same on-screen size as the old 44 * 2.
     */
    const DISH_SIZE_MULT: Record<string, number> = { chai: 1.375, coffee: 1.375 };

    /** Final round Tier 1, task 2: single retune knob for the ellipse glow's
     *  padding over the dish's measured content extent. */
    const GLOW_PAD = 1.15;

    /**
     * Final round Tier 2, task 1: the block-1 cup glow read too loose even
     * after Tier 1's ellipse fit — this halves it on both axes, chai/coffee
     * only. Everything else stays at the Tier 1 ellipse (implicit 1 here).
     * A separate knob from GLOW_PAD/DISH_SIZE_MULT on purpose: it's a
     * per-dish visual correction, not a re-tune of the general glow-fit
     * formula or the sprite's own drawn size.
     */
    const DISH_GLOW_MULT: Record<string, number> = { chai: 0.5, coffee: 0.5 };

    /**
     * Dish-art race fix (handover, addendum to Round J — this file is the
     * only one it touches). Bug: textures.ts's artSquare() falls back to the
     * drawn archetype silhouette whenever Assets.cache misses, and
     * makeEnemyTexture caches that per (archetype, dish) for the run's whole
     * life — a miss never recovers. All 22 dish PNGs the nine blocks need
     * are registered, but most sit in preload.ts's DEFERRED bundle
     * (background-loaded on its own schedule), so a cold cache could always
     * lose the race against wave 1's first spawn.
     *
     * Mirrors kitchenScene.ts:374's fix: Assets.load() the current block's
     * dishes on demand rather than trust background-load timing.
     * `readyBlocks` gates the engine stepping loop below (tick()) so no
     * enemy of a not-yet-loaded block can spawn; `ensureBlockAssets` also
     * kicks off the NEXT block's load a block early (called with `+1` at
     * every block-boundary crossing) so blocks 2+ are already warm by the
     * time play reaches them and the gate is a no-op in practice.
     */
    const readyBlocks = new Set<number>();
    const loadingBlocks = new Set<number>();
    let trackedBlockId = 0;

    function ensureBlockAssets(blockId: number): void {
        if (blockId < 1 || blockId > BLOCKS.length) return;
        if (readyBlocks.has(blockId) || loadingBlocks.has(blockId)) return;
        loadingBlocks.add(blockId);
        const aliases = blockAssetAliases(BLOCKS[blockId - 1]);
        const settle = () => {
            loadingBlocks.delete(blockId);
            readyBlocks.add(blockId);
        };
        if (aliases.length === 0) {
            settle();
            return;
        }
        Assets.load(aliases).then(settle).catch((err) => {
            // Never brick the run over art (preload.ts's failure posture) —
            // mark ready anyway so the sim isn't stuck forever; whichever
            // alias failed still falls back to the silhouette at draw time.
            console.warn('[towerScene] dish asset load failed — falling back to silhouette', err);
            settle();
        });
    }

    // ---- static board ------------------------------------------------------
    // Visual round, task 1 (docs/LevelBlocks.md §7): a full-field illustrated
    // backdrop per block, replacing the old tileable grass floor. Kept as a
    // stack of Sprites (not one) so a block change can CROSSFADE: the
    // incoming backdrop fades in over BACKDROP_FADE_S while the outgoing one
    // is still visible underneath, then the old one(s) are dropped once it's
    // fully opaque. tex.grass (still made above) is the immediate fallback —
    // shown until the current block's real art is in Assets.cache — so the
    // board is never a blank field while a cold cache is still loading it.
    // Final round, task 4: raised from 0.5s — at that speed a real block
    // change read as a glitchy blink rather than a scene change. A separate
    // constant for the Ready lock's own duration (below), even though it's
    // set equal to this one today, so retuning either later is a one-line
    // change that can't accidentally couple to the other.
    const BACKDROP_LOCK_S = BACKDROP_FADE_S;
    const backdropLayer = new Container();
    const backdropSprites: Sprite[] = [];
    let currentBackdropAlias: string | null = null;
    /** Cleared on scene destroy, same posture as ftuePulseTimer below — a
     *  stray callback must never patch backdropTransitioning into whatever
     *  run (or menu) comes next. */
    let backdropLockTimer: ReturnType<typeof setTimeout> | null = null;

    /** Cover-fit (aspect preserved, overflow cropped) a backdrop sprite
     *  against the full visible screen box — never contain-fit: the source
     *  images are already the board's exact 9:16 ratio (docs/LevelBlocks.md
     *  §7's own corrected note), so cover is what avoids letterbox bars on
     *  a screen taller/shorter than that ratio without ever distorting it. */
    function fitBackdropSprite(sprite: Sprite): void {
        const dh = stage.designHeight();
        const fullDesignW = app.screen.width / stage.scale();
        const scale = Math.max(fullDesignW / sprite.texture.width, dh / sprite.texture.height);
        sprite.anchor.set(0.5);
        sprite.width = sprite.texture.width * scale;
        sprite.height = sprite.texture.height * scale;
        sprite.position.set(stage.width / 2, dh / 2);
    }

    const fallbackBackdrop = new Sprite(tex.grass);
    backdropLayer.addChild(fallbackBackdrop);
    backdropSprites.push(fallbackBackdrop);

    /** Called every tick with the CURRENT block id: swaps in that block's
     *  real backdrop (crossfading) the moment it's in Assets.cache — no
     *  extra promise plumbing, same cache-check pattern textures.ts's art()
     *  already uses, so this naturally recovers whenever the load finishes,
     *  whether that's before or after the block boundary was crossed. */
    function updateBackdrop(blockId: number): void {
        const alias = backdropAliasForBlock(blockId);
        if (alias === currentBackdropAlias || !Assets.cache.has(alias)) return;
        currentBackdropAlias = alias;
        const sprite = new Sprite(Assets.get<Texture>(alias));
        sprite.alpha = 0;
        fitBackdropSprite(sprite);
        backdropLayer.addChild(sprite);
        backdropSprites.push(sprite);
    }

    /** Advances the crossfade; once the newest backdrop is fully opaque,
     *  every older one is dropped (they're plain Sprites over shared,
     *  Assets-cache-owned textures — destroy() here never touches the
     *  texture itself, see destroy() below). */
    function fadeBackdrop(dt: number): void {
        if (backdropSprites.length <= 1) return;
        const top = backdropSprites[backdropSprites.length - 1];
        top.alpha = Math.min(1, top.alpha + dt / BACKDROP_FADE_S);
        if (top.alpha >= 1) {
            for (let i = 0; i < backdropSprites.length - 1; i++) backdropSprites[i].destroy();
            backdropSprites.length = 0;
            backdropSprites.push(top);
        }
    }

    // boardRoot carries EVERYTHING gameplay-positioned. stage.ts's contain-fit
    // (FIT_HEIGHT) guarantees at least PLAYFIELD_HEIGHT units of vertical
    // room; on taller/wider-fit aspects boardRoot is offset so the extra
    // height splits evenly above and below — the path itself never
    // stretches, keeping path length (and therefore balance) identical on
    // every device and in the headless simulator.
    const boardRoot = new Container();
    const board = new Container(); // path, burrows, pads, selection ring
    const world = new Container(); // towers, enemies, projectiles (y-sorted)
    world.sortableChildren = true;
    // Round 2c (docs/Ideas.md §6d amendment): Lv↑ affordability markers, a
    // sibling layer (not nested inside world's own y-sorted tower nodes) so
    // a marker is never sorted behind a taller/closer tower — being added
    // to boardRoot AFTER world already puts every marker above every tower
    // regardless of world's own internal zIndex sort.
    const markerLayer = new Container();
    // Task 4 (delivered-audio round): coin-kill popups, above everything
    // else in the board (its own layer, not fighting world's y-sort zIndex).
    const popupLayer = new Container();
    boardRoot.addChild(board, world, markerLayer, popupLayer);
    stage.root.addChild(backdropLayer, boardRoot);

    // Pool, not spawn-per-kill: 4x speed can kill many enemies (splash) in
    // one frame, and a fresh PIXI.Text + style per popup is exactly the
    // "cost frames" the handover warns against. Fixed pool of reusable Text
    // nodes; a kill that finds every slot busy is simply skipped (capped,
    // never grows) rather than queued or forced.
    const COIN_POPUP_POOL_SIZE = 16;
    const COIN_POPUP_LIFETIME_S = 0.8;
    const COIN_POPUP_RISE_PX = 34; // per second, in design units
    const coinPopupStyle = new TextStyle({
        fontSize: 22,
        fontWeight: 'bold',
        fill: 0xffd54a,
        stroke: { color: 0x000000, width: 3 },
    });
    const coinPopupPool: { text: Text; life: number; active: boolean }[] = [];
    for (let i = 0; i < COIN_POPUP_POOL_SIZE; i++) {
        const text = new Text({ text: '', style: coinPopupStyle });
        text.anchor.set(0.5);
        text.visible = false;
        popupLayer.addChild(text);
        coinPopupPool.push({ text, life: 0, active: false });
    }

    /** Spawns nothing (silently) once every pooled slot is already busy —
     *  the intended cap, not a bug. */
    function spawnCoinPopup(x: number, y: number, amount: number): void {
        const slot = coinPopupPool.find((p) => !p.active);
        if (!slot) return;
        slot.active = true;
        slot.life = COIN_POPUP_LIFETIME_S;
        slot.text.text = `+${amount}`;
        slot.text.position.set(x, y);
        slot.text.alpha = 1;
        slot.text.visible = true;
    }

    /** Called once per RENDERED frame (not per substep) with the frame's
     *  own dt — popups rise/fade at a constant real-time pace regardless of
     *  the game-speed multiplier, same posture as fadeBackdrop's dt. */
    function updateCoinPopups(dt: number): void {
        for (const p of coinPopupPool) {
            if (!p.active) continue;
            p.life -= dt;
            if (p.life <= 0) { p.active = false; p.text.visible = false; continue; }
            p.text.y -= dt * COIN_POPUP_RISE_PX;
            p.text.alpha = Math.max(0, p.life / COIN_POPUP_LIFETIME_S);
        }
    }

    // the bugs' road: fat rounded polyline, edge stroke first for a border
    const road = new Graphics();
    const drawRoad = (g: Graphics, width: number, color: number) => {
        g.moveTo(CONFIG.path[0].x, CONFIG.path[0].y);
        for (let i = 1; i < CONFIG.path.length; i++) g.lineTo(CONFIG.path[i].x, CONFIG.path[i].y);
        g.stroke({ width, color, cap: 'round', join: 'round' });
    };
    drawRoad(road, SZ.pathWidth + 14, CONFIG.colors.pathEdge);
    drawRoad(road, SZ.pathWidth, CONFIG.colors.pathDirt);
    board.addChild(road);

    // burrows at both ends of the road, so bugs appear and vanish INTO
    // something no matter where the board sits vertically.
    // Delivered-audio round, task 5: a round line cap extends a stroke by
    // half its own width BEYOND each endpoint (same reasoning kitchenScene.ts's
    // round-12a comment already documents for its own belt-cap fix) — here
    // that's (SZ.pathWidth + 14) / 2 = 43 units past both (170,90) and
    // (540,1300), each approached on a vertical path segment. The old fixed
    // 64-tall hole only covered 32 of that, so the road's rounded end
    // visibly poked out past the decal by 11 units at both burrows. Sized
    // from the measured protrusion, not guessed: height covers the full
    // cap radius on both sides (2x), width keeps the original 110/64
    // aspect ratio exactly.
    const capRadius = (SZ.pathWidth + 14) / 2;
    const holeHeight = capRadius * 2;
    const holeWidth = holeHeight * (110 / 64);
    for (const end of [CONFIG.path[0], CONFIG.path[CONFIG.path.length - 1]]) {
        const hole = new Sprite(tex.burrow);
        hole.anchor.set(0.5);
        hole.width = holeWidth;
        hole.height = holeHeight;
        hole.position.set(end.x, end.y);
        board.addChild(hole);
    }

    // Visual round, task 4: every pad STARTS as a dotted ghost slot (gold vs
    // plain keeps the bonus distinction alive while empty) and flips to the
    // solid decal the instant a tower is placed there — see syncPads() below,
    // called every tick alongside syncTowers().
    const padViews: Sprite[] = [];
    for (const pad of CONFIG.pads) {
        const p = new Sprite(pad.bonus ? tex.padGhostGold : tex.padGhost);
        p.anchor.set(0.5);
        p.width = SZ.pad.w;
        p.height = SZ.pad.h;
        p.position.set(pad.x, pad.y);
        board.addChild(p);
        padViews.push(p);
    }

    // selection highlight + range preview for the selected pad
    const selection = new Graphics();
    board.addChild(selection);

    // lightning beams: short-lived glowing polylines above the world
    const beamLayer = new Graphics();
    beamLayer.zIndex = 9000;
    world.addChild(beamLayer);
    const BEAM_TTL = 0.18;
    const beams: { points: { x: number; y: number }[]; ttl: number }[] = [];

    function drawBeams(dt: number): void {
        beamLayer.clear();
        for (let i = beams.length - 1; i >= 0; i--) {
            const b = beams[i];
            b.ttl -= dt;
            if (b.ttl <= 0) {
                beams.splice(i, 1);
                continue;
            }
            const alpha = b.ttl / BEAM_TTL;
            beamLayer.moveTo(b.points[0].x, b.points[0].y);
            for (let p = 1; p < b.points.length; p++) beamLayer.lineTo(b.points[p].x, b.points[p].y);
            beamLayer.stroke({ width: 9, color: CONFIG.colors.lightning, alpha: alpha * 0.45 });
            beamLayer.moveTo(b.points[0].x, b.points[0].y);
            for (let p = 1; p < b.points.length; p++) beamLayer.lineTo(b.points[p].x, b.points[p].y);
            beamLayer.stroke({ width: 3.5, color: 0xffffff, alpha });
        }
    }

    const anchorBoard = () => {
        const dh = stage.designHeight();
        // Re-fit every live backdrop sprite (usually one, briefly two mid-
        // crossfade) against the current screen box — cover-fit, so this
        // also handles contain-fit's horizontal letterboxing (stage.ts,
        // round C): the content column no longer always spans the full
        // screen width, and fitBackdropSprite re-derives the true visible
        // design-unit box from the live screen/scale on every call.
        for (const sprite of backdropSprites) fitBackdropSprite(sprite);
        // Centre against the playfield's real extent (PLAYFIELD_HEIGHT,
        // derived from CONFIG.path — see stage.ts), not the nominal
        // CONFIG.boardHeight: boardHeight undercounts the path's actual
        // last point (y:1300 vs boardHeight's 1280), which is what let the
        // goal clip off the bottom pre-round-C.
        boardRoot.y = Math.max(0, (dh - PLAYFIELD_HEIGHT) / 2);
    };
    anchorBoard();
    const offResize = stage.onResize(anchorBoard);

    // ---- engine (with the player's persistent meta upgrades applied) -------
    const engine = createEngine(getSave().meta);
    registerEngine(engine); // also fires the run_start funnel step + event (actions.ts)
    // GDD §10.11's pre-start beat pre-selects FTUE_FIRST_PAD (set by
    // MainMenu.tsx / EndScreen.tsx's Retry BEFORE this scene mounts) — this
    // reset must not clobber it, or the FTUE's opening StationRail never
    // opens. Round 1 (docs/Ideas.md §1/§6d): EXCEPT while the opening
    // dialogue is showing (scriptedRunStart armed it in the same patch,
    // selectedPad null) — the picker cue must wait for DialogueBox.tsx to
    // release it, so this reset must not clobber THAT either.
    store.patch({
        selectedPad: store.get().ftueActive && !store.get().dialogue ? FTUE_FIRST_PAD : null,
        waveCount: WAVES.length,
        tdPhase: 'build',
        wave: 1,
        // Final round, task 4: defensively reset every run — belt-and-
        // suspenders alongside destroy()'s own reset against ever latching
        // locked (a stray timer from a prior run should already be
        // impossible, but this costs nothing and the acceptance bar is
        // "can never latch locked", not "shouldn't in practice").
        backdropTransitioning: false,
    });
    resetMusicDuck(); // same defensive posture as backdropTransitioning just above
    syncStore();
    // Kick the current block's dish load off immediately (don't wait for the
    // first tick) so it has the longest possible head start before wave 1
    // can spawn anything — see ensureBlockAssets's comment above.
    ensureBlockAssets(blockForLevel(engine.state.waveIndex + 1).id);

    // ---- analytics bookkeeping (wall-clock, this run only) -----------------
    const runStartedAt = performance.now();
    let waveStartedAt = performance.now();
    let prevPhase = engine.state.phase;
    // ---- Round 3 (docs/Ideas.md §6a/§6d): the service gauge ----------------
    // Both sampled once at the SAME "wave just started" transition tick
    // already detected below (prevPhase !== 'wave' -> engine.state.phase ===
    // 'wave') — never recomputed mid-wave, so SAFE can't drift as lives drop.
    let killsAtWaveStart = engine.state.kills;
    let livesAtWaveStart = engine.state.lives;
    // Memoized by waveIndex — waveAt(index).entries never changes for a
    // given index within one run, so there's no reason to re-sum it every
    // tick just because syncGauge() itself runs every tick.
    let gaugeUnitsCache: { index: number; units: number } | null = null;
    function waveUnits(index: number): number {
        if (gaugeUnitsCache?.index === index) return gaugeUnitsCache.units;
        const units = waveAt(index).entries.reduce((sum, e) => sum + e.count * enemyDef(e.enemy).livesCost, 0);
        gaugeUnitsCache = { index, units };
        return units;
    }
    /**
     * SAFE = max(0, units - (lives - 1)) — the minimum served count that
     * guarantees survival even if every remaining unit in the wave leaked
     * (§6a's own derivation; the "red pulse when unreachable" case turned out
     * to be dead logic — see the amendment's own note — so this is only ever
     * amber-below/green-at-or-above). During 'build' this is a forecast of
     * the wave about to start (served: 0, using CURRENT lives — stable
     * through build since nothing can leak before a wave starts); during
     * 'wave' it uses the sampled livesAtWaveStart/killsAtWaveStart above, so
     * the target line holds still while you're actually playing it. Hidden
     * (null) once the run is lost — Hud.tsx has nothing to draw a target
     * against for a wave that will never resume.
     */
    function syncGauge(): void {
        const phase = engine.state.phase;
        if (phase === 'lost') {
            if (store.get().gauge !== null) store.patch({ gauge: null });
            return;
        }
        const units = waveUnits(engine.state.waveIndex);
        const lives = phase === 'wave' ? livesAtWaveStart : engine.state.lives;
        const safe = Math.max(0, units - (lives - 1));
        const served = phase === 'wave' ? engine.state.kills - killsAtWaveStart : 0;
        const cur = store.get().gauge;
        if (!cur || cur.units !== units || cur.served !== served || cur.safe !== safe) {
            store.patch({ gauge: { units, served, safe } });
        }
    }
    // uid -> enemy type, so a leaked ticket can report which dish it was;
    // only ever grows (uids never repeat), which is fine for one run's life
    const enemyDefByUid = new Map<number, string>();
    // uid -> that enemy's base bounty (data/enemies.ts, sealed — read via
    // the live instance's own e.def.bounty, never imported directly).
    // Task 4: this is what lets trackDeathBounties credit the SAME amount
    // engine.ts:628 actually paid (base * lateEconomy.bountyMult past
    // fromLevel) without needing anything from the sealed engine's own
    // { type: 'death' } event, which carries neither position nor amount.
    const enemyBountyByUid = new Map<number, number>();
    // uid -> credited coin amount, for a death attributed THIS frame — the
    // syncEnemies() removal loop (which already has each enemy's last
    // rendered position) drains this to spawn the actual popup, then
    // clears it; a uid that leaked, or died in a step this frame's
    // attribution couldn't disambiguate, is simply never in here.
    const pendingBounties = new Map<number, number>();

    /** Attribute this step's leak(s) to an enemy type when unambiguous —
     *  i.e. nothing also died in the same physics step. Never guesses. */
    function trackLeaksForStep(stepEvents: EngineEvent[], preUids: Set<number>): void {
        const leakCount = stepEvents.filter((e) => e.type === 'leak').length;
        if (leakCount === 0) return;
        const deathCount = stepEvents.filter((e) => e.type === 'death').length;
        const postUids = new Set(engine.state.enemies.map((e) => e.uid));
        const missing = [...preUids].filter((uid) => !postUids.has(uid));
        const attributable = deathCount === 0 && missing.length === leakCount;
        const wave = engine.state.waveIndex + 1;
        for (let i = 0; i < leakCount; i++) {
            const enemyId = attributable ? enemyDefByUid.get(missing[i]) : undefined;
            track('ticket_leaked', {
                ...(enemyId ? { enemy_id: enemyId } : {}),
                wave,
                lives_remaining: engine.state.lives,
            });
        }
    }

    /**
     * Task 4 (delivered-audio round): a coin popup must never show for a
     * leak (🔴 acceptance) — mirrors trackLeaksForStep's own attribution
     * exactly (same events, same preUids, same "never guess" posture), just
     * for the opposite event. Only credits when this step's missing uids
     * are ALL deaths (leakCount === 0) and the count matches exactly; a
     * step that mixes a leak in with deaths is genuinely ambiguous per-uid
     * (which missing uid was which event?) and is skipped entirely rather
     * than risk crediting the leaked one. `level` is read by the CALLER
     * before engine.step() so it matches engine.ts:627's own snapshot for
     * the bounty math this exact step just ran (waveIndex only advances
     * on a same-step wave-clear, which happens AFTER the death/bounty pass).
     */
    function trackDeathBounties(stepEvents: EngineEvent[], preUids: Set<number>, level: number): void {
        const deathCount = stepEvents.filter((e) => e.type === 'death').length;
        if (deathCount === 0) return;
        const leakCount = stepEvents.filter((e) => e.type === 'leak').length;
        const postUids = new Set(engine.state.enemies.map((e) => e.uid));
        const missing = [...preUids].filter((uid) => !postUids.has(uid));
        if (leakCount !== 0 || missing.length !== deathCount) return;
        const bountyMult = level < CONFIG.economy.lateEconomy.fromLevel ? 1 : CONFIG.economy.lateEconomy.bountyMult;
        for (const uid of missing) {
            const bounty = enemyBountyByUid.get(uid);
            if (bounty === undefined) continue;
            pendingBounties.set(uid, Math.round(bounty * bountyMult));
        }
    }

    /**
     * Round 6 Part B: per-archetype "removed from THIS wave's alive set"
     * tally, for WaveBubble's live remaining count. Unlike
     * trackLeaksForStep/trackDeathBounties above, this needs no
     * disambiguation — it doesn't care WHETHER a missing uid died or
     * leaked, only WHICH ARCHETYPE it was, and enemyDefByUid already maps
     * every uid to its archetype exactly (recorded from that uid's own
     * e.def.id at spawn), so a plain preUids/postUids set difference is
     * never ambiguous the way "how many of these N missing uids were
     * leaks" is. Reset (see the tick loop) the instant the wave number
     * changes, so a lingering count from the previous wave can never bleed
     * into the next one's display.
     */
    let waveDishServed: Record<string, number> = {};
    let waveDishTallyLevel = engine.state.waveIndex + 1;
    let dishTallyGen = 0;
    function trackDishTally(preUids: Set<number>): void {
        const postUids = new Set(engine.state.enemies.map((e) => e.uid));
        for (const uid of preUids) {
            if (postUids.has(uid)) continue;
            const archetype = enemyDefByUid.get(uid);
            if (!archetype) continue;
            waveDishServed[archetype] = (waveDishServed[archetype] ?? 0) + 1;
            dishTallyGen++;
        }
    }

    let syncedDishTallyGen = -1;
    /** Patches the store only when trackDishTally (or the level-change
     *  reset below) actually changed something — same "diff before patch"
     *  discipline as syncGauge/syncStore. */
    function syncDishTally(): void {
        if (dishTallyGen === syncedDishTallyGen) return;
        syncedDishTallyGen = dishTallyGen;
        store.patch({ waveDishServed: { ...waveDishServed } });
    }

    /** Pending target-pad auto-select after the post-wave-2 pulse (round D
     *  task 1/2) — cleared on scene destroy so a mid-pulse quit can't fire a
     *  store.patch into whatever screen comes next. */
    let ftuePulseTimer: ReturnType<typeof setTimeout> | null = null;

    /**
     * GDD §10.11's scripted FTUE (round D: persistent — every run, not just
     * the first — and walled: see actions.ts's startWave/placeTower/
     * upgradeTower for the Ready/Close/Sell gates this beat state drives).
     * Advanced off the same wave-clear events analytics already drains
     * here — no new engine hook. Onboarding-balance round: extended from
     * three forced beats to four — see the third placement below — so the
     * player opens with THREE placed props, not two, before free play.
     *
     * Wave 1 end used to force FTUE_FIRST_PAD's tower view open with the
     * Upgrade button cued the instant it cleared — Round 4 (docs/Ideas.md
     * §6d) moves that to actions.ts's openUpgrade0Beat, called by
     * DialogueBox.tsx once the player closes the 'wave1-cleared' box, so
     * that box gets the screen to itself first (see this round's own
     * report). This function no longer has a cleared === 1 branch as a
     * result. Wave 2 end pulses every empty pad, then auto-selects one of
     * them (preferring B2) with the picker cued (Hud.tsx); wave 3 end
     * repeats that same pulse-and-select pattern (preferring B1) for a
     * third placement. Wave 4 STARTING (not clearing — see actions.ts's
     * startWave) retires the script for good. A run that never reaches wave
     * 4 (e.g. lost on wave 1-3) leaves `ftueActive` true, so Retry restarts
     * the whole script from beat 1 (EndScreen.tsx).
     *
     * Round E: neither beat below is ever SET unless its target is
     * actually resolvable — the reported hard-lock was a beat set
     * unconditionally (a hardcoded pad 2, occupied or the board full)
     * whose release condition (actions.ts) could then never fire.
     * actions.ts's syncStore() re-checks this on every frame as a backstop
     * for anything that becomes unresolvable after being set.
     */
    function applyFtueWaveEnd(cleared: number): void {
        if (!store.get().ftueActive) return;
        if (cleared === 2) {
            // Round I Task 7: old pad 2 (360,485) is now B2, index 3 — the
            // 10-slot board (config.ts) re-orders A1 A2 B1 B2 B3 C1 C2 C3 D1
            // D2, and B2 is the direct descendant (same mid-board spot, same
            // range bonus family). Re-pointed here; store.ts's ftueBeatPad
            // default follows suit.
            //
            // Round H Task 1: if the target pad is already occupied here,
            // the player placed a second counter unprompted between beats —
            // the lesson (place a second counter) is already demonstrated.
            // The old fallback (force a THIRD placement onto the nearest
            // empty pad, funded by grantFtueShortfall) taught nothing and
            // handed out coins they didn't need. Retire instead, same as a
            // full board.
            const target = 3;
            if (engine.state.towers.some((tw) => tw.padIndex === target)) {
                retireFtue();
                return;
            }
            const emptyPads = CONFIG.pads
                .map((_, i) => i)
                .filter((i) => !engine.state.towers.some((tw) => tw.padIndex === i));
            // target is confirmed empty above, so it's always in this list —
            // no full-board case is reachable here, but the check stays as
            // a harmless backstop.
            if (emptyPads.length === 0) {
                retireFtue();
                return;
            }
            // Beat 5's requirement: the cheapest tower, so whatever the
            // player affords is guaranteed placeable at the target pad.
            grantFtueShortfall(Math.min(...TOWERS.map((def) => def.cost)));
            // Ready/Close/Sell wall from the moment wave 2 clears (before
            // the target pad is even selected) through the pulse, not just
            // after.
            store.patch({ selectedPad: null, ftueBeat: 'place2', ftueBeatPad: target, pulsePads: emptyPads });
            ftuePulseTimer = setTimeout(() => {
                ftuePulseTimer = null;
                store.patch({ selectedPad: target, pulsePads: null });
            }, 900);
        } else if (cleared === 3) {
            // Onboarding-balance round: the third forced placement — same
            // shape as cleared === 2 above (a full board / already-occupied
            // target both retire rather than force anything), pointed at B1
            // (index 2, fireRate x1.5) so by the time free play starts the
            // player has one prop on every bonused B-row pad, not just two.
            const target = 2;
            if (engine.state.towers.some((tw) => tw.padIndex === target)) {
                retireFtue();
                return;
            }
            const emptyPads = CONFIG.pads
                .map((_, i) => i)
                .filter((i) => !engine.state.towers.some((tw) => tw.padIndex === i));
            if (emptyPads.length === 0) {
                retireFtue();
                return;
            }
            grantFtueShortfall(Math.min(...TOWERS.map((def) => def.cost)));
            store.patch({ selectedPad: null, ftueBeat: 'place3', ftueBeatPad: target, pulsePads: emptyPads });
            ftuePulseTimer = setTimeout(() => {
                ftuePulseTimer = null;
                store.patch({ selectedPad: target, pulsePads: null });
            }, 900);
        }
    }

    /**
     * Round E task 2: pulse every empty pad after every wave clear once the
     * FTUE is done owning the screen — persists through the whole build
     * phase (actions.ts's startWave() clears it when the next wave
     * starts; placeTower() drops a pad from it the instant that pad
     * fills). Never fires while the FTUE is active (it owns its own cue
     * via applyFtueWaveEnd above — one voice, round 19) or when the player
     * can't even afford the cheapest tower (a pulse inviting an action
     * nobody can take is worse than none).
     */
    function applyPostWavePulse(): void {
        const cheapest = Math.min(...TOWERS.map((def) => def.cost));
        if (store.get().coins < cheapest) return;
        const emptyPads = CONFIG.pads
            .map((_, i) => i)
            .filter((i) => !engine.state.towers.some((tw) => tw.padIndex === i));
        if (emptyPads.length === 0) return;
        store.patch({ pulsePads: emptyPads });
    }

    function trackWaveClears(evts: EngineEvent[]): void {
        for (const e of evts) {
            if (e.type !== 'wave-clear') continue;
            track('level_complete', {
                wave: e.cleared,
                lives_remaining: engine.state.lives,
                duration_s: (performance.now() - waveStartedAt) / 1000,
            });
            if (e.cleared === 1) {
                trackFunnelStep(5, 'wave_1_cleared', 'run', 2);
                // Round 2b (docs/Ideas.md §6d amendment): every run now
                // (dialogueSeen is gone) — stays open through the upgrade0
                // purchase that applyFtueWaveEnd(1) arms right below;
                // DialogueBox.tsx's own tap logic handles that window.
                queueDialogue('wave1-cleared');
            }
            if (store.get().ftueActive) {
                // Task F, onboarding-balance round: a practical guarantee
                // against losing DURING the scripted, walled FTUE, not a
                // mathematical one — the real floor belongs at the decrement
                // site in sim/engine.ts (state.lives -= e.def.livesCost),
                // which is still sealed. Restoring here, once per build
                // phase, can in principle still be beaten by a single wave
                // whose total livesCost >= CONFIG.economy.startLives (10) —
                // level 3 is 17 units at 1 lifeCost each, and stag costs 3 —
                // so this is a silent net, not a visible mechanic. With
                // Task C/D's block-1 retune landed, balanced leaks nothing
                // in block 1, so this should never fire in practice; if it
                // ever fires VISIBLY (lives jumping back up mid-onboarding
                // reads as fake), that's a signal C/D need retuning, not
                // that this restore needs widening. Also invisible to
                // npm run balance: the simulator drives the engine directly
                // and has no FTUE, so this line is never exercised there —
                // C and D are data and stay modelled by the sim; this is
                // not, and must never become load-bearing for the
                // acceptance numbers.
                engine.state.lives = CONFIG.economy.startLives;
                applyFtueWaveEnd(e.cleared);
            } else {
                applyPostWavePulse();
            }
        }
    }

    function trackRunEnd(outcome: 'lost' | 'quit'): void {
        track('run_end', {
            waves_cleared: engine.state.waveIndex,
            duration_s: (performance.now() - runStartedAt) / 1000,
            towers_placed: getTowersPlacedThisRun(),
            lives_remaining: engine.state.lives,
            outcome,
        });
        trackFunnelStep(6, 'run_end', 'run', 2);
    }

    // ---- tap-to-select pads ------------------------------------------------
    const onTap = (e: FederatedPointerEvent) => {
        // Round D: a forced beat (placeFirst/upgrade0/place2/place3) walls
        // every canvas tap — re-tapping the forced pad, tapping empty board, or
        // tapping any other pad would all otherwise change/clear
        // selectedPad (see the hit/deselect logic below) and escape the
        // script. StationRail's own buttons (not gated by this listener)
        // remain the only way through.
        if (store.get().ftueBeat !== null) return;
        // convert through boardRoot so pad hit-tests track the vertical offset
        const local = boardRoot.toLocal(e.global);
        let hit: number | null = null;
        for (let i = 0; i < CONFIG.pads.length; i++) {
            if (Math.hypot(local.x - CONFIG.pads[i].x, local.y - CONFIG.pads[i].y) < CONFIG.padTapRadius) {
                hit = i;
                break;
            }
        }
        store.patch({ selectedPad: hit === store.get().selectedPad ? null : hit });
    };
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointertap', onTap);

    // ---- sprite pools synced from engine state -----------------------------
    interface EnemyView { node: Container; sprite: Sprite; hpBar: Graphics; ice: Sprite; lastHp: number; size: number; distOffset: number }
    const enemyViews = new Map<number, EnemyView>();
    const projViews = new Map<number, Sprite>();
    const towerViews = new Map<number, Container>(); // by padIndex
    const towerLevels = new Map<number, number>();

    /**
     * Round 5 Part 1: per-pad cosmetic state for the recoil squash, heat
     * flash, and idle cooking loop — one record per placed prop, created
     * alongside its towerViews node (syncTowers below) and torn down with
     * it. `sprite`/`flash`/`wrapper` are the SAME instances syncTowers
     * already owns, stored here directly rather than re-indexed into
     * node.children every tick.
     *
     * Round 6 Part A (fixes the recoil scale bug): `sprite` is sized with
     * sprite.width/height (syncTowers below), which leaves it at whatever
     * base scale the texture/display-size ratio implies — NEVER a round
     * number. The old code wrote fx.sprite.scale.set(1.08, 0.90)... straight
     * onto that sprite, clobbering its real base scale with ~1 and inflating
     * the prop to the full source texture size on its first shot. `wrapper`
     * is a plain Container, always created at scale (1,1)/position (0,0),
     * sitting between `node` (fixed at the tower's board position) and
     * `sprite` (sized, never touched by FX again) — every FX transform
     * (recoil scale, idle bob's y) is applied to `wrapper` instead, so the
     * sprite's own scale is written ONLY by the sizing code in syncTowers.
     */
    interface TowerFx {
        wrapper: Container;
        sprite: Sprite;
        flash: Sprite;
        /** Seconds since the shot that's driving the current squash;
         *  Infinity while idle (scale already settled back to 1,1). */
        recoilT: number;
        /** Same shape, for the heat-flash fade. */
        flashT: number;
        /** Per-pad phase offset so the idle bob doesn't move every prop in
         *  lockstep — rolled once at placement, stable for the tower's life. */
        idlePhase: number;
        /** Counts down to the next steam puff while phase is 'wave'. */
        steamTimer: number;
    }
    const towerFx = new Map<number, TowerFx>();

    const RECOIL_PHASE1_S = 0.08;
    const RECOIL_PHASE2_S = 0.06;
    const RECOIL_PHASE3_S = 0.06;
    const RECOIL_TOTAL_S = RECOIL_PHASE1_S + RECOIL_PHASE2_S + RECOIL_PHASE3_S;
    // Reduced motion doesn't drop the heat flash (see reducedMotion's own
    // doc) — it cuts its DURATION to one rendered frame, still a real fade,
    // just not a sustained one.
    const HEAT_FLASH_S = reducedMotion ? 1 / 60 : 0.12;
    const HEAT_FLASH_TINT: Record<string, number> = {
        fox: 0xffffff, // steam-white, Stock Pot
        owl: CONFIG.colors.lightning, // spark-yellow, Pressure Cooker
        bear: CONFIG.colors.fire, // flame-orange, Cooktop
        squirrel: 0xfbbf24, // amber, Sauce Pot (ServiceRing's own AMBER)
    };
    const IDLE_BOB_PERIOD_S = 2.2;
    const IDLE_BOB_AMPLITUDE = 2;
    const STEAM_DURATION_S = 2.2;
    const STEAM_RISE_PX = 34;
    // Spawns faster than one lifetime so ~2-3 puffs are alive per prop at
    // once, each staggered (steamTimer's own per-pad jitter below), matching
    // the handover's "2-3 puffs, staggered" without a fixed puff count.
    const STEAM_INTERVAL_S = STEAM_DURATION_S / 2.6;
    const STEAM_POOL_SIZE = 48; // 9 props x ~3 puffs, headroom included

    interface SteamPuff { sprite: Sprite; life: number; active: boolean; startX: number; startY: number }
    const steamPool: SteamPuff[] = [];
    for (let i = 0; i < STEAM_POOL_SIZE; i++) {
        const sprite = new Sprite(tex.steamPuff);
        sprite.anchor.set(0.5);
        sprite.visible = false;
        sprite.blendMode = 'add';
        sprite.zIndex = 6000; // above towers/enemies, same "always on top" posture as beams/projectiles
        world.addChild(sprite);
        steamPool.push({ sprite, life: 0, active: false, startX: 0, startY: 0 });
    }

    /** Spawns nothing once every pooled slot is busy — same cap posture as
     *  spawnCoinPopup above. */
    function spawnSteamPuff(x: number, y: number): void {
        const slot = steamPool.find((p) => !p.active);
        if (!slot) return;
        slot.active = true;
        slot.life = 0;
        slot.startX = x;
        slot.startY = y;
        slot.sprite.visible = true;
    }

    function updateSteamPuffs(dt: number): void {
        for (const p of steamPool) {
            if (!p.active) continue;
            p.life += dt;
            if (p.life >= STEAM_DURATION_S) {
                p.active = false;
                p.sprite.visible = false;
                continue;
            }
            const u = p.life / STEAM_DURATION_S;
            p.sprite.position.set(p.startX, p.startY - STEAM_RISE_PX * u);
            p.sprite.scale.set(0.6 + 0.6 * u);
            // alpha 0 -> 0.7 -> 0: ramps to peak by 25% of the lifetime, then
            // fades the rest of the way out.
            const peak = 0.25;
            p.sprite.alpha = u < peak ? 0.7 * (u / peak) : 0.7 * Math.max(0, 1 - (u - peak) / (1 - peak));
        }
    }

    /** Restarts both the recoil squash and the heat flash for one pad,
     *  cleanly — called from detectShotsAndTriggerFx below, whether that
     *  pad already mid-tween or idle (the handover's own "restart cleanly
     *  if it fires again mid-tween"). */
    function triggerShotFx(padIndex: number): void {
        const fx = towerFx.get(padIndex);
        if (!fx) return;
        fx.recoilT = 0;
        fx.flashT = 0;
    }

    /**
     * Round 5 Part 1 tasks 1/2: detect a shot per PROP (not per tower TYPE —
     * EngineEvent's own 'shot'/'beam' carry only towerId, never padIndex) by
     * matching each new projectile's launch point (sx, sy) — or each beam
     * event's own points[0] — against a live tower's (x, y-30), the exact
     * launch-offset formula sim/engine.ts uses for both (line ~552/498,
     * sealed, read here only as plain state, never imported). Diffed once
     * per RENDERED frame (prevProjUids persists across ticks, not reset per
     * substep) — the tween this drives is cosmetic, so multiple shots from
     * one pad inside a single 4x-speed frame just restart it once, which
     * reads fine.
     */
    let prevProjUids = new Set<number>();
    function detectShotsAndTriggerFx(evts: EngineEvent[]): void {
        const firedPads = new Set<number>();
        for (const e of evts) {
            if (e.type !== 'beam') continue;
            const origin = e.points[0];
            const t = engine.state.towers.find(
                (tw) => Math.abs(tw.x - origin.x) < 1 && Math.abs(tw.y - 30 - origin.y) < 1,
            );
            if (t) firedPads.add(t.padIndex);
        }
        for (const p of engine.state.projectiles) {
            if (prevProjUids.has(p.uid)) continue;
            const t = engine.state.towers.find(
                (tw) => Math.abs(tw.x - p.sx) < 1 && Math.abs(tw.y - 30 - p.sy) < 1,
            );
            if (t) firedPads.add(t.padIndex);
        }
        for (const pad of firedPads) triggerShotFx(pad);
        prevProjUids = new Set(engine.state.projectiles.map((p) => p.uid));
    }

    /**
     * Round 5 Part 1 tasks 1/2/4: advances every placed prop's recoil
     * squash, heat flash, and (wave-phase-only) idle bob + steam puffs.
     * Runs every tick with the frame's own real dt — same "never scaled by
     * game speed" posture as fadeBackdrop/updateCoinPopups above, so these
     * read at a constant, readable pace regardless of the speed multiplier.
     */
    function syncTowerFx(dt: number): void {
        const inWave = engine.state.phase === 'wave';
        for (const t of engine.state.towers) {
            const fx = towerFx.get(t.padIndex);
            if (!fx) continue;

            // Round 6 acceptance rule ("reduced motion: wrapper scale stays
            // 1,1 throughout a wave"): the squash is a brief, event-
            // triggered reaction (Round 5's own reasoning for why it wasn't
            // gated), but this round's own acceptance bar is explicit, so it
            // now is. Forced to exactly (1,1) every frame under reduced
            // motion, regardless of recoilT — never partially eased.
            if (reducedMotion) {
                fx.wrapper.scale.set(1, 1);
            } else if (fx.recoilT < RECOIL_TOTAL_S) {
                fx.recoilT += dt;
                let sx: number;
                let sy: number;
                if (fx.recoilT < RECOIL_PHASE1_S) {
                    const u = fx.recoilT / RECOIL_PHASE1_S;
                    sx = 1 + 0.08 * u;
                    sy = 1 - 0.1 * u;
                } else if (fx.recoilT < RECOIL_PHASE1_S + RECOIL_PHASE2_S) {
                    const u = (fx.recoilT - RECOIL_PHASE1_S) / RECOIL_PHASE2_S;
                    sx = 1.08 - 0.12 * u; // 1.08 -> 0.96
                    sy = 0.9 + 0.15 * u; // 0.90 -> 1.05
                } else if (fx.recoilT < RECOIL_TOTAL_S) {
                    const u = (fx.recoilT - RECOIL_PHASE1_S - RECOIL_PHASE2_S) / RECOIL_PHASE3_S;
                    sx = 0.96 + 0.04 * u; // 0.96 -> 1
                    sy = 1.05 - 0.05 * u; // 1.05 -> 1
                } else {
                    sx = 1;
                    sy = 1;
                    fx.recoilT = Infinity;
                }
                fx.wrapper.scale.set(sx, sy);
            }

            if (fx.flashT < HEAT_FLASH_S) {
                fx.flashT += dt;
                const u = Math.min(1, fx.flashT / HEAT_FLASH_S);
                fx.flash.visible = true;
                fx.flash.tint = HEAT_FLASH_TINT[t.def.id] ?? 0xffffff;
                fx.flash.alpha = 0.9 * (1 - u);
                const size = towerDisplaySize[t.def.id][t.level - 1];
                const base = Math.max(size.w, 64);
                fx.flash.width = base * (1 + 0.3 * u);
                fx.flash.height = base * (1 + 0.3 * u);
                if (u >= 1) {
                    fx.flash.visible = false;
                    fx.flashT = Infinity;
                }
            }

            // Round 6 Part A: `node` (towerViews) is positioned ONCE at
            // creation (syncTowers) and never moved again — the bob now
            // offsets `wrapper`'s LOCAL y instead, so it can never fight the
            // recoil squash (a different property of the same Container) and
            // so anything anchored off node.y (the Lv↑ marker, the upgrade
            // preview bubble) reads a value that only ever changes when the
            // tower's own board position does, never a per-frame cosmetic.
            const baseY = t.y - 14 + SZ.tower / 2; // still needed below: steam spawns in WORLD space, not wrapper-local
            if (inWave && !reducedMotion) {
                const bob = Math.sin((fxClock / IDLE_BOB_PERIOD_S) * Math.PI * 2 + fx.idlePhase) * IDLE_BOB_AMPLITUDE;
                fx.wrapper.position.set(0, bob);
            } else {
                fx.wrapper.position.set(0, 0);
            }

            if (inWave && !reducedMotion) {
                fx.steamTimer -= dt;
                if (fx.steamTimer <= 0) {
                    fx.steamTimer = STEAM_INTERVAL_S * (0.8 + Math.random() * 0.4);
                    const size = towerDisplaySize[t.def.id][t.level - 1];
                    spawnSteamPuff(t.x + (Math.random() - 0.5) * 20, baseY - size.h * 0.7);
                }
            }
        }
    }

    /** Real-time clock (never scaled by game speed), driving the idle bob's
     *  sine phase — a plain running total, same posture as every other
     *  cosmetic timer in this file. */
    let fxClock = 0;

    function syncEnemies(): void {
        const alive = new Set<number>();
        for (const e of engine.state.enemies) {
            alive.add(e.uid);
            let v = enemyViews.get(e.uid);
            if (!v) {
                const node = new Container();
                const { tex: enemyTex, dish } = enemyTextureFor(e.def.id);
                const baseSize = SZ.enemy[e.def.id as keyof typeof SZ.enemy] ?? 44;
                const size = baseSize * (DISH_SIZE_MULT[dish] ?? 1);
                // §6a glow tier, behind everything else, so a poisoned/
                // burning stag's tint (below) never fights it.
                //
                // Final round, task 6/7: shadow and ice derive from
                // baseSize (not size = baseSize * the per-dish multiplier),
                // so they stay constant regardless of which dish this enemy
                // happens to be serving, satisfying "smaller, exclusively
                // for block 1" by construction.
                //
                // Tier 1 task 2: the glow, unlike shadow/ice, DOES derive
                // from `size` — it's now an ellipse fit to the dish's actual
                // drawn content (dishContentExtent), so it needs the real
                // drawn size to size against, not the archetype-constant one.
                const tier = GLOW_TIER[e.def.id] ?? null;
                if (tier) {
                    const glow = new Sprite(tex.glow[tier]);
                    glow.anchor.set(0.5);
                    const ext = dishContentExtent(app.renderer, dish);
                    const glowMult = DISH_GLOW_MULT[dish] ?? 1;
                    glow.width = size * ext.w * GLOW_PAD * glowMult;
                    glow.height = size * ext.h * GLOW_PAD * glowMult;
                    node.addChild(glow);
                }
                const shadow = new Graphics();
                shadow.ellipse(0, baseSize * 0.42, baseSize * 0.4, baseSize * 0.14)
                    .fill({ color: CONFIG.colors.shadow, alpha: 0.2 });
                const sprite = new Sprite(enemyTex);
                sprite.anchor.set(0.5);
                sprite.width = size;
                sprite.height = size;
                const hpBar = new Graphics();
                hpBar.y = -size * 0.62;
                const ice = new Sprite(tex.ice);
                ice.anchor.set(0.5);
                ice.width = baseSize * 1.25;
                ice.height = baseSize * 1.25;
                ice.visible = false;
                node.addChild(shadow, sprite, ice, hpBar);
                world.addChild(node);
                v = { node, sprite, hpBar, ice, lastHp: -1, size, distOffset: 0 };
                enemyViews.set(e.uid, v);
            }
            // Position is set below by relaxEnemyPositions(), which runs once
            // for every enemy after this loop (including brand-new ones —
            // distOffset starts at 0, so posAt(e.dist) matches e.x/e.y exactly
            // until a collision nudges it).
            v.node.zIndex = e.y;
            // status visuals: ice cube while frozen; green tint for poison,
            // orange for burn (the two never coexist — one DoT slot)
            let frozen = false;
            let tint = 0xffffff;
            for (const s of e.effects) {
                if (s.type === 'frozen') frozen = true;
                if (s.type === 'poison') tint = 0x9fe87a;
                if (s.type === 'burn') tint = 0xffa15c;
            }
            v.ice.visible = frozen;
            v.sprite.tint = tint;
            if (v.lastHp !== e.hp) {
                v.lastHp = e.hp;
                const frac = Math.max(0, e.hp / e.maxHp);
                v.hpBar.clear();
                if (frac < 1) {
                    v.hpBar.rect(-18, 0, 36, 6).fill(CONFIG.colors.hpBack);
                    v.hpBar.rect(-18, 0, 36 * frac, 6).fill(CONFIG.colors.hpFill);
                }
            }
        }
        for (const [uid, v] of enemyViews) {
            if (!alive.has(uid)) {
                // Task 4: this loop already has the last rendered position
                // for every uid being torn down, dead or leaked alike —
                // exactly what a coin popup needs, and exactly why it's
                // spawned HERE rather than back in the substep loop (which
                // only knows uids and amounts, not screen position).
                // pendingBounties holds ONLY uids trackDeathBounties already
                // attributed as an unambiguous death this frame; a leaked
                // uid, or one from an ambiguous mixed step, is never in it.
                const credited = pendingBounties.get(uid);
                if (credited !== undefined) spawnCoinPopup(v.node.x, v.node.y, credited);
                v.node.destroy({ children: true });
                enemyViews.delete(uid);
            }
        }
        pendingBounties.clear();
        relaxEnemyPositions();
    }

    /**
     * Final round, task 9 / Tier 1 task 1: enemies take engine coordinates
     * verbatim, so two of the same archetype at the same sim `dist` land on
     * identical pixels — nothing in the sim itself ever separates them. This
     * is a RENDER-ONLY fix: `e.dist`/`e.x`/`e.y` are never written, only a
     * per-enemy `distOffset` and the node's drawn screen position.
     *
     * v1.55.0 shipped this as free 2D separation, which was unsatisfiable on
     * the belt — block 1's 88-wide sprites against a 72-wide path meant the
     * push ran outward forever, walking dishes onto the floorboards, and the
     * push being a 2D vector (mostly perpendicular to the belt near a
     * corner) made it worse there. Separating in 1D along the path instead
     * — via a small offset added to `e.dist` before calling `posAt` — makes
     * leaving the belt structurally impossible: every position still comes
     * from `posAt`, which by construction lies on the path.
     *
     * Every frame: decay each offset toward zero so a dish returns to its
     * true position once its cluster clears, then relax same-archetype
     * pairs along the path (grouping by archetype is what lets different
     * archetypes pass through each other — they're never compared), then
     * clamp the accumulated offset and position every node from it. The
     * clamps (6 units/pair/iteration, 2 iterations, ±20 accumulated) keep
     * the render lie small — targeting/splash/the spawn safe zone all read
     * the untouched `e.dist`, so a big offset would visibly desync sprites
     * from what towers actually shoot.
     */
    function relaxEnemyPositions(): void {
        const DIST_DECAY = 0.88;
        const PUSH_CLAMP = 6;
        const MAX_OFFSET = 20;
        const ITERATIONS = 2;
        const byArchetype = new Map<string, { dist: number; v: EnemyView }[]>();
        for (const e of engine.state.enemies) {
            const v = enemyViews.get(e.uid);
            if (!v) continue;
            v.distOffset *= DIST_DECAY;
            const entry = { dist: e.dist, v };
            const group = byArchetype.get(e.def.id);
            if (group) group.push(entry);
            else byArchetype.set(e.def.id, [entry]);
        }
        for (let iter = 0; iter < ITERATIONS; iter++) {
            for (const group of byArchetype.values()) {
                for (let i = 0; i < group.length; i++) {
                    for (let j = i + 1; j < group.length; j++) {
                        const a = group[i];
                        const b = group[j];
                        const sep = (b.dist + b.v.distOffset) - (a.dist + a.v.distOffset);
                        const minSep = (a.v.size + b.v.size) * 0.5 * 0.8;
                        const mag = Math.abs(sep);
                        if (mag >= minSep) continue;
                        const push = Math.min((minSep - mag) / 2, PUSH_CLAMP);
                        const dir = sep >= 0 ? 1 : -1;
                        a.v.distOffset -= dir * push;
                        b.v.distOffset += dir * push;
                    }
                }
            }
        }
        for (const e of engine.state.enemies) {
            const v = enemyViews.get(e.uid);
            if (!v) continue;
            v.distOffset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, v.distOffset));
            const d = Math.max(0, Math.min(PATH_LENGTH, e.dist + v.distOffset));
            const p = posAt(d);
            v.node.position.set(p.x, p.y);
        }
    }

    /** Round 5 Part 1 task 3: per-projectile trail colour, mirroring each
     *  archetype's own projectile texture tint (textures.ts). Beam towers
     *  (squirrel) never reach here — they have no ProjInst. */
    const TRAIL_TINT: Record<string, number> = {
        fox: CONFIG.colors.arrow,
        owl: CONFIG.colors.frost,
        bear: CONFIG.colors.boulder,
    };
    const TRAIL_LENGTH = 26;
    interface ProjTrail { sprite: Sprite; prevX: number; prevY: number }
    const projTrails = new Map<number, ProjTrail>();

    function syncProjectiles(): void {
        const alive = new Set<number>();
        for (const p of engine.state.projectiles) {
            alive.add(p.uid);
            let s = projViews.get(p.uid);
            if (!s) {
                s = new Sprite(tex.projectiles[p.towerId]);
                s.anchor.set(0.5);
                s.width = SZ.projectile;
                s.height = SZ.projectile;
                s.zIndex = 5000; // always above the crowd
                world.addChild(s);
                projViews.set(p.uid, s);
            }
            // the bear's boulder lobs: a cosmetic vertical arc from launch
            // progress (the sim itself flies straight, so balance is unmoved)
            let px = p.x;
            let py = p.y;
            if (p.arc) {
                const travelled = Math.hypot(p.x - p.sx, p.y - p.sy);
                const progress = Math.min(1, travelled / Math.max(1, p.flight));
                py = p.y - Math.sin(Math.PI * progress) * 55;
            }
            s.position.set(px, py);

            // Round 5 Part 1 task 3: one pooled sprite per LIVE projectile
            // (never per frame), pointed back along wherever it actually
            // moved since last frame — reusing the arc-adjusted (px, py)
            // above keeps the trail glued to the bear's cosmetic lob too,
            // not just the sim's straight-line (p.x, p.y).
            let trail = projTrails.get(p.uid);
            if (!trail) {
                const ts = new Sprite(tex.projTrail);
                ts.anchor.set(0.5, 0);
                ts.tint = TRAIL_TINT[p.towerId] ?? 0xffffff;
                ts.width = SZ.projectile * 0.5;
                ts.height = TRAIL_LENGTH;
                ts.zIndex = 4999; // just under the projectile itself
                world.addChild(ts);
                trail = { sprite: ts, prevX: p.sx, prevY: p.sy };
                projTrails.set(p.uid, trail);
            }
            const dx = px - trail.prevX;
            const dy = py - trail.prevY;
            if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
                trail.sprite.rotation = Math.atan2(-dy, -dx) - Math.PI / 2;
            }
            trail.sprite.position.set(px, py);
            trail.prevX = px;
            trail.prevY = py;
        }
        for (const [uid, s] of projViews) {
            if (!alive.has(uid)) {
                s.destroy();
                projViews.delete(uid);
                const trail = projTrails.get(uid);
                if (trail) {
                    trail.sprite.destroy();
                    projTrails.delete(uid);
                }
            }
        }
    }

    /** Empty pad -> dotted ghost decal (gold/plain keeps the bonus
     *  distinction alive); occupied pad -> NO decal at all. Playtest round,
     *  task 3: the solid stone decal under a placed tower read as an odd
     *  "table" under the prop, and dropping it is also what makes room for
     *  task 2's larger props without crowding the pad. */
    function syncPads(): void {
        const occupied = new Set(engine.state.towers.map((t) => t.padIndex));
        for (let i = 0; i < CONFIG.pads.length; i++) {
            const pad = CONFIG.pads[i];
            padViews[i].visible = !occupied.has(i);
            if (!occupied.has(i)) {
                const want = pad.bonus ? tex.padGhostGold : tex.padGhost;
                if (padViews[i].texture !== want) padViews[i].texture = want;
            }
        }
    }

    function syncTowers(): void {
        // sold towers: drop their sprites
        const occupied = new Set(engine.state.towers.map((t) => t.padIndex));
        for (const [pad, node] of towerViews) {
            if (!occupied.has(pad)) {
                node.destroy({ children: true });
                towerViews.delete(pad);
                towerLevels.delete(pad);
                towerFx.delete(pad);
            }
        }
        for (const t of engine.state.towers) {
            let node = towerViews.get(t.padIndex);
            if (!node) {
                node = new Container();
                // §10's per-family fit: sprite is BOTTOM-anchored (not
                // centered) at the node's own local origin, so every tier —
                // whatever its own height — sits on the same "foot" point
                // instead of growing/shrinking around a shared center.
                const shadow = new Graphics();
                shadow.ellipse(0, -SZ.tower * 0.08, SZ.tower * 0.42, SZ.tower * 0.15)
                    .fill({ color: CONFIG.colors.shadow, alpha: 0.22 });
                // Round 5 Part 1 task 2: the heat-flash glow sits BEHIND the
                // sprite by construction — added before it in this same
                // addChild call, not by a separate zIndex.
                const flash = new Sprite(tex.heatFlash);
                flash.anchor.set(0.5, 0.7);
                flash.blendMode = 'add';
                flash.alpha = 0;
                flash.visible = false;
                // Round 6 Part A: `sprite` never sits directly in `node` —
                // it's nested one level deeper, inside `wrapper`, which is
                // the ONLY thing syncTowerFx's recoil/bob ever transforms.
                // `sprite`'s own scale is written exclusively by the sizing
                // code just below (and the level-change block right after
                // this one) — never by syncTowerFx. `pips` stays a direct
                // child of `node` (still index 3, unaffected by the swap of
                // index 2 from `sprite` to `wrapper`) — it's a static
                // per-level pip row, not part of the squashing prop art.
                const sprite = new Sprite();
                sprite.anchor.set(0.5, 1);
                const wrapper = new Container();
                wrapper.addChild(sprite);
                const pips = new Graphics();
                pips.y = SZ.tower * 0.08;
                node.addChild(shadow, flash, wrapper, pips);
                // Old center-anchored sprites sat with their visual bottom
                // edge at (t.y - 14) + SZ.tower/2 — shift the node's origin
                // there so the new bottom-anchored foot lands in the same
                // spot the tower always has. Set ONCE, here — never touched
                // again (in particular, never by the idle bob, which now
                // offsets wrapper's local position instead — see
                // syncTowerFx), so anything anchored off node.y (the Lv↑
                // marker, the upgrade preview bubble) reads a stable value.
                node.position.set(t.x, t.y - 14 + SZ.tower / 2);
                node.zIndex = t.y;
                world.addChild(node);
                towerViews.set(t.padIndex, node);
                towerLevels.set(t.padIndex, 0); // forces the texture apply below on first sync
                towerFx.set(t.padIndex, {
                    wrapper,
                    sprite,
                    flash,
                    recoilT: Infinity,
                    flashT: Infinity,
                    idlePhase: Math.random() * Math.PI * 2,
                    steamTimer: Math.random() * STEAM_INTERVAL_S,
                });
            }
            if (towerLevels.get(t.padIndex) !== t.level) {
                towerLevels.set(t.padIndex, t.level);
                // Round 6: read via towerFx (never node.children[N]) — the
                // sprite's own index shifted when `wrapper` was inserted,
                // and indexing into towerFx's stored reference can't drift
                // out of sync with whatever syncTowers's own addChild order
                // happens to be.
                const sprite = towerFx.get(t.padIndex)!.sprite;
                const size = towerDisplaySize[t.def.id][t.level - 1];
                sprite.texture = towerLevelTex[t.def.id][t.level - 1];
                sprite.width = size.w;
                sprite.height = size.h;
                const pips = node.children[3] as Graphics;
                pips.clear();
                for (let i = 0; i < t.level; i++) {
                    pips.circle((i - (t.level - 1) / 2) * 14, 0, 5).fill(CONFIG.colors.arrow);
                }
            }
        }
    }

    /**
     * Round 2c (docs/Ideas.md §6d amendment): a small "Lv↑" pill above every
     * placed prop whose next upgrade is affordable RIGHT NOW — the same
     * test StationRail.tsx's own Upgrade button uses (line ~328:
     * `coins >= tower.def.upgrades[tower.level - 1].cost`, guarded by "not
     * already max level"), so the marker and the button it's pointing at
     * never disagree. Hidden for the selected pad — the rail is already
     * showing the same information bigger there.
     *
     * Allocates a marker's Graphics+Text ONLY on the tick its visibility
     * actually flips (a tower entering/leaving affordability, being
     * selected/deselected, sold, or hitting max level) — every other tick
     * this loop is three cheap Set/Map lookups per placed tower, no
     * allocation, same "pool it, don't spawn it" posture spawnCoinPopup's
     * own doc explains above. No pulse/animation at all (the simplest way
     * to satisfy "reduced-motion safe: no pulse" everywhere, not just under
     * the media query) — it just appears and disappears.
     */
    const upgradeMarkers = new Map<number, Container>(); // by padIndex
    // fontSize 15 measured illegible live (403x874's ~0.45 board scale
    // shrinks it to ~7 CSS px, blurring the ↑ glyph into a smudge) -- 24
    // matches the coin-popup text's own already-proven-legible size at the
    // same scale (coinPopupStyle above), one row up from this file's own
    // "small overlay text that must stay readable" bar.
    const upgradeMarkerStyle = new TextStyle({ fontSize: 24, fontWeight: 'bold', fill: 0xffffff });
    // Shared by buildUpgradeMarker (the Lv↑ pill) and Round 4's
    // syncUpgradePreview below — one number, not two driftable copies, same
    // "cosmetic clearance from the sprite's own top edge" meaning in both.
    const UPGRADE_MARKER_GAP = 8;

    function upgradeAffordable(t: (typeof engine.state.towers)[number]): boolean {
        if (t.level > t.def.upgrades.length) return false; // max level -- rail's own "Max" guard
        return engine.state.coins >= t.def.upgrades[t.level - 1].cost;
    }

    function buildUpgradeMarker(t: (typeof engine.state.towers)[number]): Container {
        const size = towerDisplaySize[t.def.id][t.level - 1];
        const label = new Text({ text: 'Lv↑', style: upgradeMarkerStyle });
        label.anchor.set(0.5);
        // ~60% of the tower's own current sprite width is the handover's own
        // spec and the common case; a floor against the LABEL'S OWN measured
        // width (not a guessed constant) guarantees the text is never
        // clipped on a narrow-bodied tower at this larger font -- Text
        // objects report real rendered width/height after construction, so
        // this reads the actual glyph metrics rather than estimating them.
        const pillW = Math.max(size.w * 0.6, label.width + 14);
        const pillH = label.height + 8;
        const c = new Container();
        const bg = new Graphics();
        // CONFIG.colors.grass (0x14141a) IS app.css's --color-surface / the
        // HUD's dark chip tone -- reused rather than a second color entry.
        bg.roundRect(-pillW / 2, -pillH, pillW, pillH, pillH / 2).fill({ color: CONFIG.colors.grass });
        label.position.set(0, -pillH / 2);
        c.addChild(bg, label);
        // Sits just above the tower's sprite: the node's own bottom-anchor
        // convention (see syncTowers above) puts the sprite's top edge at
        // node.y - size.h in board space; UPGRADE_MARKER_GAP is pure
        // cosmetic clearance from that edge, not a hit-test boundary.
        const node = towerViews.get(t.padIndex)!;
        c.position.set(t.x, node.y - size.h - UPGRADE_MARKER_GAP);
        return c;
    }

    function syncUpgradeMarkers(): void {
        const selectedPad = store.get().selectedPad;
        for (const t of engine.state.towers) {
            const want = t.padIndex !== selectedPad && upgradeAffordable(t);
            const has = upgradeMarkers.has(t.padIndex);
            if (want && !has) {
                const marker = buildUpgradeMarker(t);
                markerLayer.addChild(marker);
                upgradeMarkers.set(t.padIndex, marker);
            } else if (!want && has) {
                upgradeMarkers.get(t.padIndex)!.destroy({ children: true });
                upgradeMarkers.delete(t.padIndex);
            }
        }
        // sold towers: drop any marker left standing over an empty pad,
        // same cleanup syncTowers() does for the tower sprite itself.
        const occupied = new Set(engine.state.towers.map((tw) => tw.padIndex));
        for (const [pad, marker] of upgradeMarkers) {
            if (!occupied.has(pad)) {
                marker.destroy({ children: true });
                upgradeMarkers.delete(pad);
            }
        }
    }

    /**
     * Round 4 Part C (docs/Ideas.md §6d), Round 5 Part 2C (playtest of
     * 1.75.0): while the rail is open for a tower with a next upgrade, two
     * lines above it show the post-upgrade damage/rate — the rail's own
     * numbers (StationRail.tsx: `Math.round(tower.damage)` /
     * `tower.fireRate.toFixed(1)`), so the two can never disagree. Takes the
     * Lv↑ marker's exact anchor point (syncUpgradeMarkers already hides that
     * marker for the selected pad — "the marker already hides on selection,
     * this takes its place"). Only ever one instance (there's only ever one
     * selected pad), so this is a single pooled Container updated in place
     * every tick rather than a per-pad map like upgradeMarkers above.
     *
     * Round 5: the playtest found the bare green text illegible mid-wave
     * over dishes/projectiles — wrapped in a translucent dark bubble
     * (rgba(0,0,0,.7), matching the wave-bubble trigger's own black/80
     * family) so it reads on any background. Each line is now TWO Text
     * objects side by side (current value + arrow in white/85, the new
     * value in green) rather than one — Pixi's plain Text has no rich-text
     * mixed-colour run, so "18 → " and "25 dmg" are drawn and measured
     * separately, then laid out left-to-right and the pair centred as a
     * unit under the anchor point.
     */
    const upgradePreviewWhiteStyle = new TextStyle({ fontSize: 24, fontWeight: 'bold', fill: 0xffffff });
    const upgradePreviewGreenStyle = new TextStyle({ fontSize: 24, fontWeight: 'bold', fill: 0x34d399 });
    const upgradePreviewBg = new Graphics();
    const upgradePreviewLine1White = new Text({ text: '', style: upgradePreviewWhiteStyle });
    const upgradePreviewLine1Green = new Text({ text: '', style: upgradePreviewGreenStyle });
    const upgradePreviewLine2White = new Text({ text: '', style: upgradePreviewWhiteStyle });
    const upgradePreviewLine2Green = new Text({ text: '', style: upgradePreviewGreenStyle });
    upgradePreviewLine1White.alpha = 0.85;
    upgradePreviewLine2White.alpha = 0.85;
    // Bottom-left anchor on every part — lets each line be laid out
    // left-to-right at a shared baseline (anchor.y 1) before the whole pair
    // is shifted to centre under the anchor point (see below).
    for (const part of [upgradePreviewLine1White, upgradePreviewLine1Green, upgradePreviewLine2White, upgradePreviewLine2Green]) {
        part.anchor.set(0, 1);
    }
    const upgradePreview = new Container();
    upgradePreview.addChild(
        upgradePreviewBg,
        upgradePreviewLine1White,
        upgradePreviewLine1Green,
        upgradePreviewLine2White,
        upgradePreviewLine2Green,
    );
    upgradePreview.visible = false;
    markerLayer.addChild(upgradePreview);

    const UPGRADE_PREVIEW_PAD_X = 6;
    const UPGRADE_PREVIEW_PAD_Y = 4;
    const UPGRADE_PREVIEW_LINE_GAP = 2;

    /** Lays out one line's white/green pair left-to-right, centred as a
     *  unit at local x=0, with its bottom (baseline) at local y=`bottomY` —
     *  returns the line's own height, so the caller can stack the next line
     *  above it. */
    function layoutPreviewLine(white: Text, green: Text, bottomY: number): number {
        const total = white.width + green.width;
        const x0 = -total / 2;
        white.position.set(x0, bottomY);
        green.position.set(x0 + white.width, bottomY);
        return Math.max(white.height, green.height);
    }

    function syncUpgradePreview(): void {
        const sel = store.get().selectedPad;
        if (sel === null || engine.state.phase === 'lost') { upgradePreview.visible = false; return; }
        const t = engine.state.towers.find((tw) => tw.padIndex === sel);
        // Max level (StationRail's own "Max" guard) has no next step to
        // preview; deselected/lost are covered by the two checks above.
        if (!t || t.level > t.def.upgrades.length) { upgradePreview.visible = false; return; }
        const node = towerViews.get(t.padIndex);
        if (!node) { upgradePreview.visible = false; return; }
        const step = t.def.upgrades[t.level - 1];
        upgradePreviewLine1White.text = `${Math.round(t.damage)} → `;
        upgradePreviewLine1Green.text = `${Math.round(t.damage * step.damageMult)} dmg`;
        upgradePreviewLine2White.text = `${t.fireRate.toFixed(1)} → `;
        upgradePreviewLine2Green.text = `${(t.fireRate * step.fireRateMult).toFixed(1)}/s`;
        const size = towerDisplaySize[t.def.id][t.level - 1];
        const anchorY = node.y - size.h - UPGRADE_MARKER_GAP;
        // Line 1 (damage) sits at the marker's own anchor point, bottom-most;
        // line 2 (fire rate) stacks directly above it.
        const line1Height = layoutPreviewLine(upgradePreviewLine1White, upgradePreviewLine1Green, 0);
        const line2Height = layoutPreviewLine(upgradePreviewLine2White, upgradePreviewLine2Green, -(line1Height + UPGRADE_PREVIEW_LINE_GAP));
        const blockWidth = Math.max(
            upgradePreviewLine1White.width + upgradePreviewLine1Green.width,
            upgradePreviewLine2White.width + upgradePreviewLine2Green.width,
        );
        const blockHeight = line1Height + UPGRADE_PREVIEW_LINE_GAP + line2Height;
        upgradePreviewBg.clear();
        upgradePreviewBg.roundRect(
            -blockWidth / 2 - UPGRADE_PREVIEW_PAD_X,
            -blockHeight - UPGRADE_PREVIEW_PAD_Y,
            blockWidth + UPGRADE_PREVIEW_PAD_X * 2,
            blockHeight + UPGRADE_PREVIEW_PAD_Y * 2,
            8,
        ).fill({ color: 0x000000, alpha: 0.7 });
        upgradePreview.position.set(t.x, anchorY);
        upgradePreview.visible = true;
    }

    function drawSelection(): void {
        selection.clear();
        const sel = store.get().selectedPad;
        if (sel === null) return;
        const pad = CONFIG.pads[sel];
        selection.ellipse(pad.x, pad.y, SZ.pad.w * 0.62, SZ.pad.h * 0.62)
            .stroke({ width: 4, color: 0xffffff, alpha: 0.8 });
        const t = engine.state.towers.find((tw) => tw.padIndex === sel);
        if (t) {
            selection.circle(pad.x, pad.y, t.range)
                .stroke({ width: 3, color: CONFIG.colors.range, alpha: 0.35 });
        }
    }

    /**
     * Engine events → sounds, capped per frame so a 4x-speed massacre stays
     * an accent, not a wall of noise: one shot per tower type, a couple of
     * pops/leaks, and the one-shot jingles.
     */
    function playEvents(evts: ReturnType<typeof engine.drainEvents>): void {
        const shotTypes = new Set<string>();
        let deaths = 0;
        let leaks = 0;
        for (const e of evts) {
            if (e.type === 'beam') {
                beams.push({ points: e.points, ttl: BEAM_TTL });
                if (!shotTypes.has(e.towerId)) {
                    shotTypes.add(e.towerId);
                    sfx.shot(e.towerId);
                }
            } else if (e.type === 'shot' && !shotTypes.has(e.towerId)) {
                shotTypes.add(e.towerId);
                sfx.shot(e.towerId);
            } else if (e.type === 'death' && deaths < 2) {
                deaths++;
                sfx.death();
            } else if (e.type === 'leak' && leaks < 2) {
                leaks++;
                sfx.leak();
            } else if (e.type === 'wave-clear') {
                // clearing the last authored wave is the campaign milestone
                if (e.cleared === WAVES.length) sfx.win();
                else sfx.waveClear();
            } else if (e.type === 'lost') {
                sfx.lose();
            }
        }
    }

    // ---- run end bookkeeping ----------------------------------------------
    let ended = false;
    function checkEnd(): void {
        if (ended) return;
        const phase = engine.state.phase;
        if (phase === 'lost') {
            ended = true;
            // Round 7 item 6: capture the OLD best before recordRunEnd
            // overwrites it below — EndScreen.tsx's "new best" vs "near
            // best" outcome needs both numbers, and reading store.bestWave
            // after the patch would only ever see the already-updated one.
            const previousBestWave = store.get().bestWave;
            // waveIndex counts fully CLEARED waves at this point
            const { gemsEarned, save } = recordRunEnd(engine.state.waveIndex);
            // fire-and-forget: both boards, server keeps each player's best
            submitRunScores(engine.state.kills, engine.state.waveIndex, engine.state.elapsed);
            store.patch({
                bestWave: save.bestWave,
                previousBestWave,
                gems: save.gems,
                gemsEarned,
                adBonusClaimed: false,
                runKills: engine.state.kills,
                selectedPad: null,
            });
            trackRunEnd('lost');
        }
    }

    // ---- tick --------------------------------------------------------------
    const tick = (ticker: Ticker) => {
        const dt = Math.min(ticker.deltaMS, 50) / 1000;
        // Dish-art race fix: which block is live right now, and (a block
        // boundary just crossed) make sure its assets are loading and the
        // NEXT block's are already warming in the background.
        const level = engine.state.waveIndex + 1;
        // Round 6 Part B: `level` is the exact value store.wave mirrors
        // (actions.ts:204) — resetting the dish tally the instant it
        // changes means it's already empty by the time the build phase for
        // the new wave is even visible, never carrying a stale count over
        // from the wave that just cleared.
        if (level !== waveDishTallyLevel) {
            waveDishTallyLevel = level;
            waveDishServed = {};
            dishTallyGen++;
        }
        const block = blockForLevel(level);
        if (block.id !== trackedBlockId) {
            const priorBlockId = trackedBlockId;
            trackedBlockId = block.id;
            ensureBlockAssets(block.id);
            ensureBlockAssets(block.id + 1);
            // Final round, task 4: the sting+lock fires for exactly one of
            // updateBackdrop's three situations — a REAL block change whose
            // art is ALREADY cached at this exact boundary tick, the common
            // case thanks to the block+1 prefetch a whole block early
            // (above). priorBlockId > 0 excludes the game-start swap
            // (grass -> block 1, priorBlockId is the 0 sentinel) — that one
            // is never a "change" the player could have opinions about.
            // A cold/slow load that reaches Assets.cache many ticks after
            // THIS check (situation 3 — "late load, arbitrary timing") does
            // NOT retroactively qualify: this check runs once, right here,
            // at the boundary, deliberately held apart from
            // currentBackdropAlias's own cache-polling below, which is
            // what actually performs the swap whenever it lands.
            if (priorBlockId > 0 && Assets.cache.has(backdropAliasForBlock(block.id))) {
                playSample('block-transition'); // no-op, silently, until the file lands
                duckMusicForSting(); // dip the BGM so the sting is audible over it (audio.ts)
                store.patch({ backdropTransitioning: true });
                if (backdropLockTimer) clearTimeout(backdropLockTimer);
                backdropLockTimer = setTimeout(() => {
                    backdropLockTimer = null;
                    store.patch({ backdropTransitioning: false });
                }, BACKDROP_LOCK_S * 1000);
                // Round 1 (docs/Ideas.md §1 beats 5-12, "Districts" +
                // "Overtime"): the same real-transition branch the backdrop
                // crossfade uses — costs no new dead time, the design note
                // this whole beat kind is built on. Once per RUN (not
                // persisted): a block boundary only exists once per run by
                // construction, so no dialogueSeen gating is needed here,
                // unlike beats 1-4 above.
                const beat = dialogueForBlock(block.id);
                if (beat) queueDialogue(beat.id);
            }
        }
        // Polled every tick (not only at the boundary above) so the swap
        // fires the instant the backdrop lands in Assets.cache, whether
        // that's before the boundary (prefetch already warmed it — the
        // common case) or after (a cold block 1 load, or a slow network).
        updateBackdrop(block.id);
        fadeBackdrop(dt);
        // Once per rendered frame, real dt — same posture as fadeBackdrop
        // just above (never multiplied by speed, so popups always rise and
        // fade at the same readable pace regardless of game-speed).
        updateCoinPopups(dt);
        // Speed-up runs MORE substeps of the same dt (never one bigger step),
        // so 4x is exactly 4 seconds of identical simulation per second.
        // Drained per substep (not once after the loop) so a leak can be
        // attributed to the enemy that vanished in THAT step; the sound/UI
        // sync below still sees every event, in the same order, unchanged.
        const allEvents: EngineEvent[] = [];
        // Gate stepping (not just this scene's own reads) on the CURRENT
        // block's dish art being loaded — the engine's spawn timers only
        // advance inside step(), so holding this off is what stops a cold
        // cache from ever composing an enemy sprite before its art exists.
        if (readyBlocks.has(block.id)) {
            for (let i = 0; i < store.get().speed; i++) {
                const preUids = new Set(engine.state.enemies.map((e) => e.uid));
                const levelForStep = engine.state.waveIndex + 1;
                for (const e of engine.state.enemies) {
                    enemyDefByUid.set(e.uid, e.def.id);
                    enemyBountyByUid.set(e.uid, e.def.bounty);
                }
                const wasWave = prevPhase === 'wave';
                engine.step(dt);
                if (!wasWave && engine.state.phase === 'wave') {
                    waveStartedAt = performance.now();
                    killsAtWaveStart = engine.state.kills;
                    livesAtWaveStart = engine.state.lives;
                }
                prevPhase = engine.state.phase;
                const stepEvents = engine.drainEvents();
                trackLeaksForStep(stepEvents, preUids);
                trackDeathBounties(stepEvents, preUids, levelForStep);
                trackDishTally(preUids);
                allEvents.push(...stepEvents);
            }
        }
        playEvents(allEvents);
        trackWaveClears(allEvents);
        detectShotsAndTriggerFx(allEvents);
        syncStore();
        syncGauge();
        syncDishTally();
        syncEnemies();
        syncProjectiles();
        syncTowers();
        fxClock += dt;
        syncTowerFx(dt);
        updateSteamPuffs(dt);
        syncUpgradeMarkers();
        syncUpgradePreview();
        syncPads();
        drawBeams(dt);
        drawSelection();
        checkEnd();
    };
    app.ticker.add(tick);

    return {
        destroy() {
            if (!ended) {
                ended = true;
                trackRunEnd('quit');
            }
            if (ftuePulseTimer) { clearTimeout(ftuePulseTimer); ftuePulseTimer = null; }
            if (backdropLockTimer) { clearTimeout(backdropLockTimer); backdropLockTimer = null; }
            store.patch({ backdropTransitioning: false }); // never leave Ready latched locked past this scene
            resetMusicDuck(); // same guarantee, for the music: never leave it latched ducked past this scene
            app.ticker.remove(tick);
            app.stage.off('pointertap', onTap);
            offResize();
            registerEngine(null);
            // Sprite.destroy() (default options) never touches the texture
            // itself — safe for both the Assets-cache-owned backdrop
            // textures and tex.grass's generated fallback (freed below).
            backdropLayer.destroy({ children: true });
            boardRoot.destroy({ children: true });
            freeTexture(tex.grass);
            freeTexture(tex.padGhost);
            freeTexture(tex.padGhostGold);
            freeTexture(tex.burrow);
            freeTexture(tex.ice);
            for (const texes of Object.values(towerLevelTex)) for (const t of texes) freeTexture(t);
            for (const t of tex.enemies.values()) freeTexture(t);
            freeTexture(tex.glow.red);
            freeTexture(tex.glow.gold);
            for (const t of Object.values(tex.projectiles)) freeTexture(t);
            freeTexture(tex.heatFlash);
            freeTexture(tex.projTrail);
            freeTexture(tex.steamPuff);
        },
    };
}
