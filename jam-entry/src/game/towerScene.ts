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
    type Application,
    type FederatedPointerEvent,
    type Texture,
    type Ticker,
} from 'pixi.js';
import { CONFIG } from './config.ts';
import { WAVES } from './data/waves.ts';
import { BLOCKS, blockForLevel, type Block } from './data/blocks.ts';
import { MANIFEST } from '../assets/manifest.ts';
import { createEngine, type EngineEvent } from './sim/engine.ts';
import { registerEngine, syncStore, getTowersPlacedThisRun, grantFtueShortfall, retireFtue } from './actions.ts';
import { TOWERS } from './data/towers.ts';
import { track, trackFunnelStep } from '../sdk/analytics.ts';
import {
    freeTexture,
    makeBurrowTexture,
    makeEnemyTexture,
    makeGlowTexture,
    makeGrassTexture,
    makeIceCubeTexture,
    makePadGhostTexture,
    makePadGoldGhostTexture,
    makeProjBearTexture,
    makeProjFoxTexture,
    makeProjOwlTexture,
    makeTowerLevelSizes,
    makeTowerLevelTextures,
} from './textures.ts';
import { store } from '../state/store.ts';
import { getSave, recordRunEnd } from '../state/save.ts';
import { submitRunScores } from '../sdk/leaderboard.ts';
import { sfx } from '../audio/audio.ts';
import { PLAYFIELD_HEIGHT, type Stage } from './stage.ts';

/** The scene contract: every createXxxScene(app, stage) returns one of these. */
export interface Scene {
    destroy(): void;
}

// Dish-art race fix: which aliases the manifest actually registers — an
// alias with no manifest entry must never reach Assets.load (it throws).
// Same rule/pattern as kitchenScene.ts's MANIFEST_ALIASES.
const MANIFEST_ALIASES = new Set(MANIFEST.bundles.flatMap((b) => b.assets).map((a) => a.alias as string));

/** This block's backdrop alias (docs/LevelBlocks.md §7). */
function backdropAliasForBlock(blockId: number): string {
    return `bg-block-${blockId}`;
}

/** Every asset one block needs before it can play — its enemies' dish-*
 *  aliases AND its backdrop — filtered through MANIFEST_ALIASES so a
 *  not-yet-registered asset is silently skipped (falls back to the
 *  archetype silhouette / procedural backdrop, same as today) instead of
 *  throwing. Visual round, task 1: the backdrop rides in the SAME
 *  Assets.load() batch as the dishes (ensureBlockAssets below) — same race,
 *  same fix, not a second mechanism. */
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
    };

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
     */
    const DISH_SIZE_MULT: Record<string, number> = { chai: 2, coffee: 2 };

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
    const BACKDROP_FADE_S = 0.5;
    const backdropLayer = new Container();
    const backdropSprites: Sprite[] = [];
    let currentBackdropAlias: string | null = null;

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
    boardRoot.addChild(board, world);
    stage.root.addChild(backdropLayer, boardRoot);

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
    // something no matter where the board sits vertically
    for (const end of [CONFIG.path[0], CONFIG.path[CONFIG.path.length - 1]]) {
        const hole = new Sprite(tex.burrow);
        hole.anchor.set(0.5);
        hole.width = 110;
        hole.height = 64;
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
    // GDD §10.11's pre-start beat pre-selects pad 0 (set by MainMenu.tsx /
    // EndScreen.tsx's Retry BEFORE this scene mounts) — this reset must not
    // clobber it, or the FTUE's opening BuildSheet never opens.
    store.patch({
        selectedPad: store.get().ftueActive ? 0 : null,
        waveCount: WAVES.length,
        tdPhase: 'build',
        wave: 1,
    });
    syncStore();
    // Kick the current block's dish load off immediately (don't wait for the
    // first tick) so it has the longest possible head start before wave 1
    // can spawn anything — see ensureBlockAssets's comment above.
    ensureBlockAssets(blockForLevel(engine.state.waveIndex + 1).id);

    // ---- analytics bookkeeping (wall-clock, this run only) -----------------
    const runStartedAt = performance.now();
    let waveStartedAt = performance.now();
    let prevPhase = engine.state.phase;
    // uid -> enemy type, so a leaked ticket can report which dish it was;
    // only ever grows (uids never repeat), which is fine for one run's life
    const enemyDefByUid = new Map<number, string>();

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

    /** Pending target-pad auto-select after the post-wave-2 pulse (round D
     *  task 1/2) — cleared on scene destroy so a mid-pulse quit can't fire a
     *  store.patch into whatever screen comes next. */
    let ftuePulseTimer: ReturnType<typeof setTimeout> | null = null;

    /**
     * GDD §10.11's scripted three-wave FTUE (round D: persistent — every
     * run, not just the first — and walled: see actions.ts's startWave/
     * placeTower/upgradeTower for the Ready/Close/Sell gates this beat
     * state drives). Advanced off the same wave-clear events analytics
     * already drains here — no new engine hook.
     *
     * Wave 1 end forces pad 0's tower view open with the Upgrade button
     * cued (BuildSheet.tsx); wave 2 end pulses every empty pad, then
     * auto-selects one of them (preferring pad 2) with the picker cued
     * (Hud.tsx). Wave 3 STARTING (not clearing — see actions.ts's
     * startWave) retires the script for good. A run that never reaches
     * wave 3 (e.g. lost on wave 1 or 2) leaves `ftueActive` true, so Retry
     * restarts the whole script from beat 1 (EndScreen.tsx).
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
        if (cleared === 1) {
            const t = engine.state.towers.find((tw) => tw.padIndex === 0);
            // Beat 3's requirement: the forced upgrade's own cost — this is
            // the documented trap (Tandoor at beat 1 leaves the upgrade
            // unaffordable with flawless play). Computed from live state,
            // never typed in; grantFtueShortfall no-ops if already affordable.
            if (t && t.level <= t.def.upgrades.length) {
                grantFtueShortfall(t.def.upgrades[t.level - 1].cost);
                store.patch({ selectedPad: 0, ftueBeat: 'upgrade0' });
            } else {
                // Pad 0 has nothing left to upgrade — safe today (level 1
                // of up to 3 at wave 1 end), guarded in case that changes.
                // Nothing to force the player into; let the script go.
                retireFtue();
            }
        } else if (cleared === 2) {
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
            if (e.cleared === 1) trackFunnelStep(5, 'wave_1_cleared', 'run', 2);
            if (store.get().ftueActive) {
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
        // Round D: a forced beat (place0/upgrade0/place2) walls every
        // canvas tap — re-tapping the forced pad, tapping empty board, or
        // tapping any other pad would all otherwise change/clear
        // selectedPad (see the hit/deselect logic below) and escape the
        // script. BuildSheet's own buttons (not gated by this listener)
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
    interface EnemyView { node: Container; sprite: Sprite; hpBar: Graphics; ice: Sprite; lastHp: number }
    const enemyViews = new Map<number, EnemyView>();
    const projViews = new Map<number, Sprite>();
    const towerViews = new Map<number, Container>(); // by padIndex
    const towerLevels = new Map<number, number>();

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
                const tier = GLOW_TIER[e.def.id] ?? null;
                if (tier) {
                    const glow = new Sprite(tex.glow[tier]);
                    glow.anchor.set(0.5);
                    glow.width = size * 1.9;
                    glow.height = size * 1.9;
                    node.addChild(glow);
                }
                const shadow = new Graphics();
                shadow.ellipse(0, size * 0.42, size * 0.4, size * 0.14)
                    .fill({ color: CONFIG.colors.shadow, alpha: 0.2 });
                const sprite = new Sprite(enemyTex);
                sprite.anchor.set(0.5);
                sprite.width = size;
                sprite.height = size;
                const hpBar = new Graphics();
                hpBar.y = -size * 0.62;
                const ice = new Sprite(tex.ice);
                ice.anchor.set(0.5);
                ice.width = size * 1.25;
                ice.height = size * 1.25;
                ice.visible = false;
                node.addChild(shadow, sprite, ice, hpBar);
                world.addChild(node);
                v = { node, sprite, hpBar, ice, lastHp: -1 };
                enemyViews.set(e.uid, v);
            }
            v.node.position.set(e.x, e.y);
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
                v.node.destroy({ children: true });
                enemyViews.delete(uid);
            }
        }
    }

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
            if (p.arc) {
                const travelled = Math.hypot(p.x - p.sx, p.y - p.sy);
                const progress = Math.min(1, travelled / Math.max(1, p.flight));
                s.position.set(p.x, p.y - Math.sin(Math.PI * progress) * 55);
            } else {
                s.position.set(p.x, p.y);
            }
        }
        for (const [uid, s] of projViews) {
            if (!alive.has(uid)) {
                s.destroy();
                projViews.delete(uid);
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
                const sprite = new Sprite();
                sprite.anchor.set(0.5, 1);
                const pips = new Graphics();
                pips.y = SZ.tower * 0.08;
                node.addChild(shadow, sprite, pips);
                // Old center-anchored sprites sat with their visual bottom
                // edge at (t.y - 14) + SZ.tower/2 — shift the node's origin
                // there so the new bottom-anchored foot lands in the same
                // spot the tower always has.
                node.position.set(t.x, t.y - 14 + SZ.tower / 2);
                node.zIndex = t.y;
                world.addChild(node);
                towerViews.set(t.padIndex, node);
                towerLevels.set(t.padIndex, 0); // forces the texture apply below on first sync
            }
            if (towerLevels.get(t.padIndex) !== t.level) {
                towerLevels.set(t.padIndex, t.level);
                const sprite = node.children[1] as Sprite;
                const size = towerDisplaySize[t.def.id][t.level - 1];
                sprite.texture = towerLevelTex[t.def.id][t.level - 1];
                sprite.width = size.w;
                sprite.height = size.h;
                const pips = node.children[2] as Graphics;
                pips.clear();
                for (let i = 0; i < t.level; i++) {
                    pips.circle((i - (t.level - 1) / 2) * 14, 0, 5).fill(CONFIG.colors.arrow);
                }
            }
        }
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
            // waveIndex counts fully CLEARED waves at this point
            const { gemsEarned, save } = recordRunEnd(engine.state.waveIndex);
            // fire-and-forget: both boards, server keeps each player's best
            submitRunScores(engine.state.kills, engine.state.waveIndex, engine.state.elapsed);
            store.patch({
                bestWave: save.bestWave,
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
        const block = blockForLevel(level);
        if (block.id !== trackedBlockId) {
            trackedBlockId = block.id;
            ensureBlockAssets(block.id);
            ensureBlockAssets(block.id + 1);
        }
        // Polled every tick (not only at the boundary above) so the swap
        // fires the instant the backdrop lands in Assets.cache, whether
        // that's before the boundary (prefetch already warmed it — the
        // common case) or after (a cold block 1 load, or a slow network).
        updateBackdrop(block.id);
        fadeBackdrop(dt);
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
                for (const e of engine.state.enemies) enemyDefByUid.set(e.uid, e.def.id);
                const wasWave = prevPhase === 'wave';
                engine.step(dt);
                if (!wasWave && engine.state.phase === 'wave') waveStartedAt = performance.now();
                prevPhase = engine.state.phase;
                const stepEvents = engine.drainEvents();
                trackLeaksForStep(stepEvents, preUids);
                allEvents.push(...stepEvents);
            }
        }
        playEvents(allEvents);
        trackWaveClears(allEvents);
        syncStore();
        syncEnemies();
        syncProjectiles();
        syncTowers();
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
        },
    };
}
