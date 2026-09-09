/**
 * TEST MODE — private, menu-gated grey-box belt (build-order item 4,
 * sim/kitchen.ts). Answers one question on real device: does the belt's
 * 1,600-unit serpentine travel read as runway or as waiting.
 *
 * Additive and isolated: owns its own Pixi app + local state, never reads or
 * writes the shared AppState beyond `phase`/`paused`/the audio volumes
 * (already-existing fields), never calls leaderboard.ts (the belt's boards
 * don't exist). It does NOT cite KitchenMode.md §2.6 for a UI-sprite licence
 * restriction — §2.6 never contained one, and in any case that restriction
 * was cleared Sep 9 (Plan item 57).
 *
 * Round A2, task 4: the MainMenu.tsx entry button is now gated behind
 * devMode.ts's `?test=1` latch — it was the public menu's primary CTA,
 * dropping every player into this unfinished belt. This comment used to
 * flag that as unresolved; it's resolved now.
 *
 * Round 5: slots start empty and are filled via PropPicker.tsx (itself a
 * duplicate of BuildSheet.tsx's pattern, see its own header); the end
 * screen is now driven by kitchenScene's onShiftEnd event rather than by
 * polling sim phase, and its stats are restacked one-per-line; a
 * first-entry hint nudges the player toward the empty stations until the
 * first one is filled.
 *
 * The shift menu below is a DUPLICATE of Hud.tsx's — extracting it would
 * violate "move nothing that already exists" (Hud.tsx's menu is inline
 * markup, not a component). A fix to one does not automatically reach the
 * other; note it in any future change that touches both (same accepted
 * pattern as the duplicated engine tick loop, KitchenMode.md §2.5).
 *
 * Round 8: the end screen's stats reflect the recipe gate — `served` keeps
 * its original meaning (ingredients picked up, renamed honestly to
 * "ingredients collected" here) and is no longer the only number on screen;
 * `completed` (chai actually made) gets its own line, and a diagnostic
 * leftover count (task 4 — discarded held ingredients, not scored) rounds
 * it out. All five figures are still driven off the frozen `shiftResult`
 * snapshot, per round 5's fix — never live state.
 *
 * Round 9: a Ready overlay gates the whole shift (task 4) — nothing spawns
 * and no slot responds until Scene.start() fires, and "Run Again" (a full
 * remount) returns here rather than auto-starting. `shiftPending` is gone;
 * "N chai short" (task 2) takes its place on a loss. The end screen also
 * carries the frozen `shiftEconomy` snapshot (coins earned, wallet, Chef
 * Hats) from kitchenScene.ts's onShiftEnd, and two new DOM overlays —
 * `message` and `sellSlot` — duplicate PropPicker.tsx's bg-black/60-backdrop
 * pattern a third time (KitchenMode.md §2.5) for the unlock guard /
 * insufficient-funds text and the sell confirmation.
 *
 * Round 10: the setup phase. The Ready overlay is no longer a full-screen
 * scrim — round 9's version swallowed all input, which was wrong: the
 * kitchen should stay live under it so a player can unlock a slot and place
 * a prop before starting the belt. It's now just a button, bottom-centre
 * above the hamburger, that disappears once pressed. The first-entry nudge
 * and the hamburger are no longer gated on `ready` either, for the same
 * reason. A new `unlockedSlots` count (mirrors `filledSlots`, off
 * kitchenScene's new onSlotsUnlockedChange) lets the nudge tell "nothing
 * unlocked yet" (name unlocking as the first step) apart from "unlocked but
 * empty" (round 5's original "tap an empty station" text, still correct —
 * just no longer correct as the FIRST thing a player reads).
 *
 * Round 11: the end screen now shows the baked ui-coin/ui-chef-hat icons
 * beside their figures (`ASSET_SRC`, the same manifest-lookup pattern
 * PropPicker.tsx uses) instead of bare text. Star row/thresholds unchanged.
 *
 * Round 16: `chaiShort` and the star thresholds/row now read the active
 * level record (`LEVEL`, src/game/data/levels.ts) instead of KITCHEN_CONFIG.
 * A boss (`LEVEL.isBoss`, `LEVEL.target === null`) never falls short of a
 * dish target and awards no stars at all — both are handled by null checks
 * below rather than a boss-specific branch, since a boss's own `stars`
 * field is already null and its sim (sim/kitchen.ts) never reaches 'won'.
 *
 * Round 18: the Ready button slot is gated on `LEVEL.id === 'n0l1'` — FTUE
 * level 1 shows a taught, non-interactive sequence (unlock -> place -> Ready)
 * instead of an always-pressable button, so a first-timer can no longer start
 * a shift with an empty board and watch it run out. Every other level keeps
 * the plain button unchanged. Setup interaction itself (slot taps, picker,
 * hamburger) is untouched — still ungated, exactly as round 10 left it.
 *
 * Round 19: round 10's separate top-of-screen setup nudge is retired — round
 * 18's Ready-slot sequence already teaches the same thing, at the point
 * where the player is actually looking (task 1). This deliberately removes
 * setup text on N0 L2+ too: teaching is FTUE-only now, and every other level
 * always showed a plain Ready button anyway, so there was nothing left for
 * the top nudge to say there that the bottom slot didn't already cover. The
 * Ready slot itself moves up to `bottom: 30%` (task 2) so it clears
 * finalDishArea (design y 1000+) ahead of tasks 3-5 moving content into that
 * band — 22% was tried first and measured landing at design y 1072, inside
 * the band it was meant to clear (see the comment at the style prop below).
 * The hamburger moves from centred to `left: 25%` (task 4) — the same
 * horizontal fraction kitchenScene.ts's coin group now centres on, so the
 * two agree on where "the left quarter" is without sharing a literal pixel
 * value across a DOM/Pixi boundary.
 *
 * Round 21: task 3's real fix for the bug round 19's task 2 comment
 * described but didn't solve — every percentage above was tuned against
 * this project's one validated portrait test aspect, and was simply wrong
 * on anything wider (measured: the hamburger landed 406px off the coin
 * group's left edge at 1280x720, on the black letterbox bar outside the
 * board entirely). The Ready-slot wrapper and the hamburger are now nested
 * in a wrapper div sized to `stageRect`, the exact contain-fit content rect
 * kitchenStage.ts publishes via its new onLayout callback — so their
 * percentages mean fractions of the true 720x1280 board at any aspect, not
 * fractions of the full DOM viewport. `bottom: 30%` on the Ready slot
 * becomes an exact `bottom: 25%` (960 of 1280); `left: 3.61%` on the
 * hamburger is unchanged in value but now correct everywhere, since it's a
 * fraction of the wrapper's real 720 rather than the viewport's arbitrary
 * width. See the fitted-wrapper comment and the two elements' own comments
 * below for the exact derivations. Also this round: the ui-exit-sign icon
 * (task 1/2) — no changes needed in this file for that, it flows through
 * kitchenScene.ts's existing HAS_EXIT_SIGN gate untouched.
 *
 * Round 22, task 4: both `pendingSlot` (the picker) and `sellSlot` (the sell
 * confirmation) now pause the shift on open and resume it on every exit
 * path — before this round neither did, so the belt kept running (and
 * walkouts kept accruing) behind either modal with no way for the player to
 * react. `pendingSlot` also now carries a `wallet` snapshot alongside the
 * slot index (task 4b), taken once when the slot is tapped rather than
 * subscribed live, since the pause guarantees it stays exact for the whole
 * time the picker is open. See the picker/sell-confirmation JSX below for
 * the enumerated exit paths and PropPicker.tsx's own header for tasks 2/3
 * (the picker's shared icon scale and its coin-prefixed cost display).
 *
 * Round 23: this file now owns the current level. `LEVEL` was a module
 * constant read once off `getActiveLevel()`; it's now `getLevelById(levelId)`
 * with `levelId` in React state (task 4), seeded from `FIRST_LEVEL_ID` — a
 * reload always returns to that seed, since nothing here persists it (task
 * 6: no SaveData, no SAVE_KEY bump, that's its own round). Advancing reuses
 * the existing remount path unchanged (the scene-creation effect already
 * tears down scene/stage/app and `key={runId}` remounts the host div) —
 * `levelId` just joins `runId` in that effect's dependency array, so a level
 * change can never land against a stale scene. The end screen's Next Level
 * button (task 5) drives that advance, gated on `cleared` — a boss
 * (`LEVEL.isBoss`) has a null target (§7.3b), so its sim can never reach
 * 'won' and always ends 'lost' on the walkout budget instead; treating only
 * 'won' as a clear would make N0 L4 (Morning Rush) unpassable and node 1
 * unreachable. No per-level prop gating this round (task 6) —
 * LevelRecord.props/prePlaced stay unread, the picker still offers
 * KITCHEN_CONFIG.levelProps unconditionally.
 *
 * Round 25: two end-screen fixes. Task 1 — the figure list now prints one
 * line per recipe (`LEVEL.recipes`, named), off a new `dishCounts` on
 * kitchenScene.ts's EconomySnapshot, instead of totalling every completion
 * under one hardcoded "chai" line; the loss shortfall line no longer names a
 * dish either (`LEVEL.target` is a level-wide total, not any one recipe's).
 * Task 2 — the end screen's `bg-black/70` scrim (which let the live board
 * read through and let its buttons overlap station sprites) is replaced by
 * an actual card panel: a 9-sliced (`border-image`, `fill`) wood/red PNG
 * (`ui-card-wood`/`ui-card-red`, baked from the same demo pack as
 * ui-billboard/ui-hotbar/ui-container) that grows to contain its content
 * without distorting its corners. The title sits in the fixed header band
 * (absolutely positioned at half the header's own border-width, so it stays
 * correct regardless of the panel's final size); every other figure, the
 * star row, Chef Hats, and all three buttons move inside the cream body —
 * see CARD_GEOMETRY/cardPanelStyle just below the imports for the measured
 * slice values and why border-image-width is left at its CSS default
 * (`auto`, which just adopts border-width) rather than set separately.
 *
 * Round 27: the `cleared` gate (task 5, above) — a boss ending its shift AT
 * ALL used to count as a clear, including a zero-tap, five-walkout loss.
 * `cleared` now also requires `shiftResult.completed >= LEVEL.bossClearAt`
 * on a boss (sim/kitchen.ts's escalation ramp and spawn-out terminator are
 * this round's other two fixes, both off-screen from this file). Every
 * non-boss level's `bossClearAt` is null, so this clause never fires for
 * them — `phase === 'won'` alone still decides it, unchanged.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Application } from 'pixi.js';
import { setMusicVolume, setSfxVolume, sfx, switchCue } from '../audio/audio.ts';
import { createPixiApp } from '../game/pixiApp.ts';
import { createKitchenStage, type KitchenStage, type KitchenStageRect } from '../game/kitchenStage.ts';
import { createKitchenScene, type EconomySnapshot, type Scene } from '../game/kitchenScene.ts';
import { KITCHEN_CONFIG } from '../game/kitchenConfig.ts';
import { FIRST_LEVEL_ID, getLevelById, getNextLevelId } from '../game/data/levels.ts';
import type { KitchenState } from '../game/sim/kitchen.ts';
import { setAudioVolumes } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';
import { MANIFEST } from '../assets/manifest.ts';
import PropPicker from './PropPicker.tsx';
import Slider from './Slider.tsx';

// Round 11: same manifest-lookup pattern as PropPicker.tsx's ASSET_SRC — one
// place (the manifest) lists what an alias's image file actually is.
const ASSET_SRC = new Map(
    MANIFEST.bundles.flatMap((b) => b.assets).map((a) => [a.alias as string, a.src as string])
);

// Round 25, task 2: the end-screen card backdrop's 9-slice geometry, sampled
// down each source PNG's own centre column (see the handover) — top differs
// by 1px between the two (red's divider sits 1px lower; expected, not
// chased), right/bottom/left are shared. CARD_ZOOM scales the fixed
// header/footer/side art up to a legible on-screen size; it does NOT touch
// border-image-slice (that reads pixel offsets in the SOURCE image, which
// never changes) — only border-width/border-image-width, which is what
// "zoom" actually means for a 9-slice: the fixed frame gets thicker, the
// cream body in the middle still stretches to whatever the content needs.
const CARD_ZOOM = 1.3;
const CARD_GEOMETRY = {
    wood: { sliceTop: 85, borderTop: Math.round(85 * CARD_ZOOM) },
    red: { sliceTop: 86, borderTop: Math.round(86 * CARD_ZOOM) },
} as const;
const CARD_SIDE = Math.round(7 * CARD_ZOOM);
const CARD_BOTTOM = Math.round(22 * CARD_ZOOM);

function cardPanelStyle(variant: 'wood' | 'red'): CSSProperties {
    const g = CARD_GEOMETRY[variant];
    const src = ASSET_SRC.get(variant === 'wood' ? 'ui-card-wood' : 'ui-card-red');
    return {
        borderStyle: 'solid',
        borderWidth: `${g.borderTop}px ${CARD_SIDE}px ${CARD_BOTTOM}px ${CARD_SIDE}px`,
        borderImageSource: `url(${src})`,
        borderImageSlice: `${g.sliceTop} 7 22 7 fill`,
        borderImageRepeat: 'stretch',
    };
}

export default function TestBelt() {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const appRef = useRef<Application | null>(null);
    const sceneRef = useRef<Scene | null>(null);
    const [runId, setRunId] = useState(0);
    // Round 23, task 4: this file now owns the current level — no
    // persistence (task 6), so a reload always seeds back to FIRST_LEVEL_ID.
    // `getLevelById` only returns undefined for an id this file never set
    // itself (FIRST_LEVEL_ID or a real getNextLevelId() result), so the
    // assertion below can't actually fail.
    const [levelId, setLevelId] = useState(FIRST_LEVEL_ID);
    const LEVEL = getLevelById(levelId)!;
    // Only setState is used — the live per-tick state has no React reader
    // now that the walkouts counter is drawn on the Pixi canvas itself and
    // the end screen reads the frozen `shiftResult` snapshot instead.
    const [, setState] = useState<KitchenState | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    // Round 5, task 7: the end screen is a distinct piece of state, set only
    // by kitchenScene's onShiftEnd callback — not derived from `state` on
    // every tick — so it fires exactly once, off the sim's own event.
    const [shiftResult, setShiftResult] = useState<KitchenState | null>(null);
    // Round 9: the economy snapshot frozen at the same instant as shiftResult.
    const [shiftEconomy, setShiftEconomy] = useState<EconomySnapshot | null>(null);
    // Round 5, task 3: which empty slot opened the picker, if any. Round 22,
    // task 4b: carries the wallet snapshotted at the moment the slot was
    // tapped — the shift is paused for the picker's whole lifetime (below),
    // so this snapshot never goes stale; a live subscription would re-render
    // the picker on every ingredient grab for no reason.
    const [pendingSlot, setPendingSlot] = useState<{ index: number; wallet: number } | null>(null);
    const [filledSlots, setFilledSlots] = useState(0);
    // Round 10: mirrors filledSlots — how many slots are unlocked, so the
    // setup nudge can tell "nothing unlocked yet" apart from "unlocked but
    // empty".
    const [unlockedSlots, setUnlockedSlots] = useState(0);
    // Round 9, task 4: the Ready gate — false until Scene.start() is called.
    const [ready, setReady] = useState(false);
    // Round 9, task 5: a short message (unlock guard, insufficient funds).
    const [message, setMessage] = useState<string | null>(null);
    // Round 9, task 6: which filled slot offered a sell, and what it pays.
    const [sellSlot, setSellSlot] = useState<{ index: number; name: string; refund: number } | null>(null);
    // Round 21, task 3b: the contain-fit content rect kitchenStage.ts computes,
    // in CSS px — published via onLayout so board-aligned DOM furniture (the
    // Ready slot, the hamburger) can align to the SAME rect the canvas is
    // actually letterboxed into, instead of covering the full viewport and
    // guessing at percentages that only meant the board on a 9:16 screen.
    const [stageRect, setStageRect] = useState<KitchenStageRect | null>(null);
    const paused = useStore((s) => s.paused);
    const musicVol = useStore((s) => s.musicVol);
    const sfxVol = useStore((s) => s.sfxVol);

    useEffect(() => {
        let disposed = false;
        let scene: Scene | null = null;
        let stage: KitchenStage | null = null;
        // A fresh run starts every round-5 piece of state over: no shift
        // result to show, no picker open, no stations filled yet. Round 9:
        // also back to the Ready state, no message/sell dialog open.
        setShiftResult(null);
        setShiftEconomy(null);
        setPendingSlot(null);
        setFilledSlots(0);
        setUnlockedSlots(0);
        setReady(false);
        setMessage(null);
        setSellSlot(null);
        setStageRect(null);
        (async () => {
            const app = await createPixiApp(hostRef.current!);
            if (disposed) {
                app.destroy({ removeView: true }, { children: true });
                return;
            }
            appRef.current = app;
            stage = createKitchenStage(app, (rect) => setStageRect(rect));
            scene = await createKitchenScene(app, stage, {
                onChange: (s) => setState(s),
                onShiftEnd: (s, economy) => { setShiftResult(s); setShiftEconomy(economy); },
                // Round 22, task 4a: both slot modals pause the shift on
                // open, unconditionally — during setup the ticker has
                // nothing to advance anyway, so a "only if running" branch
                // would only be one more thing to get wrong. See the JSX
                // below for every resume path.
                onSlotTapEmpty: (i, wallet) => { store.patch({ paused: true }); setPendingSlot({ index: i, wallet }); },
                onSlotTapFilled: (i, info) => { store.patch({ paused: true }); setSellSlot({ index: i, ...info }); },
                onSlotsFilledChange: (n) => setFilledSlots(n),
                onSlotsUnlockedChange: (n) => setUnlockedSlots(n),
                onMessage: (text) => setMessage(text),
            }, LEVEL);
            sceneRef.current = scene;
            if (disposed) {
                scene.destroy();
                stage.destroy();
                app.destroy({ removeView: true }, { children: true });
                return;
            }
            // Mirrors GameCanvas.tsx:39 — a pause that landed while the
            // canvas was initializing must still take effect.
            if (store.get().paused) app.ticker.stop();
        })();
        return () => {
            disposed = true;
            sceneRef.current = null;
            try { scene?.destroy(); } catch { /* scene already torn down */ }
            try { stage?.destroy(); } catch { /* stage already torn down */ }
            if (appRef.current) {
                appRef.current.destroy({ removeView: true }, { children: true });
                appRef.current = null;
            }
        };
        // Round 23, task 4: `levelId` joins `runId` here so a level change
        // (Next Level) can never run this effect against a stale `LEVEL` —
        // React re-runs it whenever either changes, and `LEVEL` above is
        // recomputed fresh every render off the same `levelId` this effect
        // reads, so the two can't disagree.
    }, [runId, levelId]);

    // Mirrors GameCanvas.tsx:56 — store.paused otherwise has no effect here,
    // since kitchenScene's own ticker never reads it.
    useEffect(() => {
        const app = appRef.current;
        if (!app) return;
        if (paused) app.ticker.stop();
        else app.ticker.start();
    }, [paused]);

    const applyVolumes = (music: number, sound: number) => {
        setMusicVolume(music);
        setSfxVolume(sound);
        setAudioVolumes(music, sound);
        store.patch({ musicVol: music, sfxVol: sound });
    };
    const openMenu = () => { sfx.click(); store.patch({ paused: true }); setMenuOpen(true); };
    const closeMenu = () => { sfx.click(); store.patch({ paused: false }); setMenuOpen(false); };
    const toMainMenu = () => {
        sfx.click();
        switchCue('menu');
        setMenuOpen(false);
        store.patch({ paused: false, phase: 'menu' });
    };

    // Round 9, task 2: shiftPending is gone — once spawning is open-ended
    // (kitchenConfig.ts's maxSpawns replacing shiftDishCount), the four
    // buckets it used to sum no longer add up to a known total. "N chai
    // short" replaces it: zero on a win (hides itself), the real gap on a
    // loss. Off the frozen shiftResult snapshot, per round 5's fix.
    // Round 16: LEVEL.target is null on a boss (endless, §7.3b) — there is
    // no target to fall short of, so this stays 0 and the "N chai short"
    // line below is hidden entirely for one rather than showing a bogus
    // negative-target number.
    const chaiShort = shiftResult && LEVEL.target !== null
        ? Math.max(0, LEVEL.target - shiftResult.completed)
        : 0;
    // Round 8, task 4 (superseded by round 9): a diagnostic count of held
    // ingredients at shift end — round 9 also scores these via
    // kitchenConfig.ts's `hats.perLeftover`, so "not scored" no longer holds,
    // but they still convert to no currency (parked for a future system).
    // Also off the frozen snapshot, per round 5's fix.
    const shiftLeftover = shiftResult
        ? Object.values(shiftResult.held).reduce((sum, v) => sum + v, 0)
        : 0;
    // Round 25, task 1: per-recipe completion counts for the end screen's
    // dish lines. shiftEconomy is always set in the same onShiftEnd call as
    // shiftResult (see the effect below), so this only ever falls back
    // before either has fired.
    const dishCounts = shiftEconomy?.dishCounts ?? LEVEL.recipes.map(() => 0);
    // Round 9, task 9: stars are on coinsEarned, and only on a clear — a
    // loss shows none at all, regardless of coins earned.
    // Round 16: LEVEL.stars is null on a boss — it awards no stars at all
    // (§7.3b). In practice a boss's sim never reaches 'won' either (no
    // target to hit), so this check is redundant with that today, but it's
    // the actual rule and it's cheap to state directly rather than lean on
    // the sim's shape to enforce it by accident.
    const stars =
        shiftEconomy && shiftResult?.phase === 'won' && LEVEL.stars !== null
            ? shiftEconomy.coinsEarned >= LEVEL.stars.three
                ? 3
                : shiftEconomy.coinsEarned >= LEVEL.stars.two
                    ? 2
                    : 1
            : 0;
    // Round 23, task 5: "cleared" is NOT phase === 'won' alone — a boss
    // (LEVEL.isBoss) has target: null, so sim/kitchen.ts's checkShiftEnd can
    // never fire 'won' for one; its shift always ends 'lost' (either the
    // walkout budget, or — round 27 — spawning out with an empty belt).
    //
    // Round 27: a boss shift ENDING is no longer enough on its own — that
    // counted a zero-tap, five-instant-walkout run as a clear (KitchenMode
    // §6.23, the live gate this round closes). A boss now also needs
    // `shiftResult.completed` to have reached its own `bossClearAt` bar.
    // Every non-boss level takes `bossClearAt: null` and keeps using
    // `phase === 'won'` alone — this clause is unreachable for them. No Next
    // Level when an ordinary level is lost, when a boss falls short of its
    // bar, or when this is the last entry in LEVELS (getNextLevelId returns
    // null).
    const cleared = shiftResult !== null && (
        shiftResult.phase === 'won' ||
        (LEVEL.isBoss && LEVEL.bossClearAt !== null && shiftResult.completed >= LEVEL.bossClearAt)
    );
    const nextLevelId = cleared ? getNextLevelId(LEVEL.id) : null;
    const goToNextLevel = () => {
        if (nextLevelId === null) return;
        sfx.click();
        setLevelId(nextLevelId);
        setRunId((n) => n + 1);
    };

    return (
        <div className="absolute inset-0 bg-surface">
            <div key={runId} ref={hostRef} className="absolute inset-0" />

            {/* Round 21, task 3b: the fitted wrapper. TestBelt's outer
                `absolute inset-0` is the full DOM viewport, but
                kitchenStage.ts contain-fits the Pixi content inside it —
                so a percentage on the full viewport only means the board's
                own geometry on a 9:16 screen (see round 19's task-2 comment,
                now retired below, which found this the hard way in y at
                one aspect only). This wrapper is instead sized and
                positioned to `stageRect` — the exact rect kitchenStage.ts
                publishes via onLayout, in CSS px, re-published on every
                resize — so its own two children's percentages are fractions
                of the true 720x1280 board, correct at ANY aspect. Only
                board-aligned furniture belongs in here; everything else
                (end screen, shift menu, prop picker, message/sell toasts)
                stays on the full viewport, since a scrim still needs to
                cover the letterbox bars outside the board. Falls back to a
                full-viewport inset while `stageRect` hasn't published yet
                (the first render before kitchenStage.ts's synchronous
                initial layout() call lands in state). */}
            <div
                className="pointer-events-none absolute"
                style={
                    stageRect
                        ? { left: stageRect.x, top: stageRect.y, width: stageRect.width, height: stageRect.height }
                        : { inset: 0 }
                }
            >
                {/* Round 10: no more full-screen scrim — the board is live under
                    this button, so setup (unlock, place) works before it's
                    pressed. Bottom-centre, clear of the slot cluster
                    (design-space x 170-550, y 540-860) and stacked above the
                    hamburger rather than overlapping it. Hidden once pressed;
                    a "Run Again" remount shows it again since `ready` resets to
                    false on every fresh scene.

                    Round 18, task 1: on FTUE level 1 only (LEVEL.id === 'n0l1'),
                    this slot teaches the opening sequence instead of showing an
                    always-pressable button — Ready was reachable with an empty
                    board, so a first-timer could start (and only ever run out) a
                    shift with nothing set up. The two instructional lines are
                    plain text, not buttons: the wrapper stays pointer-events-none
                    throughout, and only the real Ready button (once reachable)
                    opts back into pointer-events-auto. Coin icon reuses the same
                    ui-coin asset the end screen already draws (ASSET_SRC), sized
                    in `em` units so it tracks this paragraph's own resolved font
                    size — the DOM analogue of round 14's lock-label pattern
                    (coin icon sized off its accompanying text, never a fixed
                    constant). Every other level keeps today's behaviour: the
                    button is always shown, exactly as before this round.

                    Round 21, task 3c: now nested in the fitted wrapper above,
                    `bottom: 25%` is 320 of the wrapper's true 1280 design
                    units — the element's bottom edge sits at design y 960, a
                    clean 40 units clear of finalDishArea's top at 1000. This
                    replaces round 19's tuned-and-measured 30%, which was only
                    ever correct at this project's one validated test aspect;
                    the derivation above is exact at every aspect now that the
                    wrapper itself is content-fit, so there's nothing left to
                    tune. */}
                {!ready && !shiftResult && (
                    <div
                        className="pointer-events-none absolute inset-x-0 flex justify-center px-6"
                        style={{ bottom: '25%' }}
                    >
                        {LEVEL.id === 'n0l1' && filledSlots === 0 ? (
                            <p className="rounded-2xl bg-black/70 px-6 py-3 text-center text-xl font-bold text-white">
                                {unlockedSlots === 0 ? (
                                    <>
                                        {`Tap a locked station to unlock it — ${KITCHEN_CONFIG.slotUnlockCost} `}
                                        <img
                                            src={ASSET_SRC.get('ui-coin')}
                                            alt=""
                                            className="inline-block h-[1em] w-[1em] align-[-0.15em] object-contain"
                                        />
                                    </>
                                ) : (
                                    'Tap an empty station to set it up.'
                                )}
                            </p>
                        ) : (
                            <button
                                type="button"
                                className="pointer-events-auto rounded-2xl bg-primary px-10 py-4 text-2xl font-bold text-black shadow-lg transition-transform active:scale-95"
                                onClick={() => { sfx.click(); sceneRef.current?.start(); setReady(true); }}
                            >
                                Ready
                            </button>
                        )}
                    </div>
                )}

                {/* Round 19, task 1: round 10's separate top-of-screen setup nudge
                    (duplicating round 18's Ready-slot text a second time, on
                    EVERY level with an empty board, not just FTUE) is retired —
                    see the file header. Deleted, not hidden: `unlockedSlots` and
                    `filledSlots` still exist for the Ready-slot gate below. */}

                {/* Hamburger: bottom, left of centre. No longer gated on `ready`
                    — it's needed most during setup.

                    Round 19, task 4: moved from centred (`left-1/2`) to
                    `left: 25%`, `-translate-x-1/2`'d off that point.

                    Round 20, task 2d: left-anchored instead — the translate is
                    dropped and `left` now expresses the SAME fraction of board
                    width as the coin group's own left inset
                    (COIN_GROUP_LEFT_X / boardWidth = 26/720 ≈ 3.61%), so the
                    hamburger's left edge, not its centre, lines up with the
                    coin icon's left edge — the two now read as one left-aligned
                    vertical stack rather than sharing a centre point. Still
                    stacked in the 1160-1280 reserve below the coins group — see
                    kitchenScene.ts's dishBoardViewport comment for why that
                    reserve is now a LEFT-half-only concern.

                    Round 21, task 3c: now nested in the fitted wrapper above,
                    so `left: 3.61%` is a fraction of the wrapper's true 720
                    design units, literally COIN_GROUP_LEFT_X / boardWidth =
                    26 / 720 — correct at every aspect, not just the one this
                    project happens to test at. A future edit to
                    COIN_GROUP_LEFT_X in kitchenScene.ts must update this
                    literal to match; nothing derives one from the other
                    across the DOM/Pixi boundary.

                    Round 21, task 3d: size stays h-11 (44 CSS px) — a touch-
                    target floor, not a design-unit measurement. Sizing it in
                    design units would put it at 37.5 CSS px on a 360-wide
                    phone, under the floor. So the coin-icon/hamburger visual
                    size match stays approximate (COIN_ICON_H=75 design units
                    resolves to ~41-53 CSS px across realistic viewports,
                    against the hamburger's fixed 44) while its POSITION is
                    now exact — do not "finish the job" by converting the
                    size to design units too.

                    env(safe-area-inset-bottom) stays on `bottom` — now that
                    the wrapper itself is inset it's belt-and-braces rather
                    than load-bearing, but dropping it needs testing on a
                    notched device, which this round didn't do. */}
                {!menuOpen && (
                    <button
                        type="button"
                        aria-label="Shift menu"
                        className="pointer-events-auto absolute left-[3.61%] flex h-11 w-11 items-center justify-center rounded-xl bg-black/55 transition-transform active:scale-95"
                        style={{ bottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
                        onClick={openMenu}
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                            strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="17" x2="20" y2="17" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Round 5, task 7: driven by shiftResult (set once, off
                kitchenScene's onShiftEnd event) — not by polling state.phase
                on a tick that may not run once the last dish resolves.
                Round 5, task 7: figures restacked one per line. */}
            {/* Round 25, task 2: a real panel backdrop instead of bg-black/70
                straight over the live board — the board was reading through
                and the buttons overlapped station sprites. The dim scrim
                here is now just enough to focus attention on the card; the
                card itself (opaque cream body, `fill`-sliced) is what stops
                the board showing through. `variant`/`geometry` are scoped to
                this block since they only matter once shiftResult exists. */}
            {shiftResult && (() => {
                const variant: 'wood' | 'red' = shiftResult.phase === 'won' ? 'wood' : 'red';
                const geometry = CARD_GEOMETRY[variant];
                return (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-4">
                        {/* The panel: border-image-width defaults to the
                            plain `border-width` above (CSS's own "auto"
                            behavior), so the interior content box already
                            starts exactly at the cream body's edge — no
                            manual padding math duplicating the border
                            widths. `position: relative` is only so the
                            title (below) can anchor to this box, not the
                            viewport. */}
                        <div
                            className="relative flex max-w-full flex-col items-center"
                            style={{ ...cardPanelStyle(variant), maxWidth: 'calc(100vw - 2rem)' }}
                        >
                            {/* Round 25, task 2: the title sits in the header
                                band — anchored to its vertical centre
                                (borderTop / 2) regardless of the panel's
                                final width/height, so it stays correctly
                                placed whether the cream body below it is at
                                its narrowest or stretched wide for a long
                                button row. It renders as this box's own
                                child, so it paints after (on top of) the
                                border-image beneath it — no z-index needed. */}
                            <p
                                className="absolute left-1/2 whitespace-nowrap text-center text-2xl font-bold text-white"
                                style={{
                                    // A positioned ancestor's offsets resolve
                                    // against its PADDING edge (inside the
                                    // border), not its outer border edge — so
                                    // "the header's vertical centre" is a
                                    // NEGATIVE offset from that edge (half the
                                    // header's own height, back up across the
                                    // border into it), not a positive one.
                                    // Confirmed the hard way: a positive
                                    // offset here landed the title down among
                                    // the cream-body dish lines instead.
                                    top: -(geometry.borderTop / 2),
                                    transform: 'translate(-50%, -50%)',
                                    textShadow: '0 1px 4px rgba(0,0,0,0.65)',
                                }}
                            >
                                {shiftResult.phase === 'won' ? 'Shift cleared' : 'Too many walkouts'}
                            </p>
                            {/* Everything else — the figure list, coins, star
                                row, Chef Hats, and all three buttons — sits
                                in the cream body, per the handover. Text
                                colors below are dark (the header's white
                                title is the one exception, since it sits over
                                the header band's own colored art, not the
                                cream). */}
                            <div className="flex flex-col items-center gap-6 px-4 py-4">
                                <div className="flex flex-col items-center gap-1 text-lg text-[#7a6353]">
                                    {/* Round 25, task 1: one line per recipe, named from
                                        LEVEL.recipes, instead of totalling every
                                        completion under one hardcoded dish name — a
                                        two-recipe level used to print "N chai completed"
                                        even when most of N was coffee. `dishCounts` comes
                                        off the frozen shiftEconomy snapshot (index-
                                        aligned to LEVEL.recipes); shiftResult.completed
                                        stays the scalar the sim itself uses for the win
                                        check, unrelated to this display. A zero-count
                                        recipe still renders — "0 Coffee" is information,
                                        same reasoning as the live dish board showing
                                        unserved recipes dimmed rather than hiding them. */}
                                    {LEVEL.recipes.map((recipe, i) => (
                                        <p key={recipe.id}>{dishCounts[i] ?? 0} {recipe.name} completed</p>
                                    ))}
                                    <p>{shiftResult.served} ingredients collected</p>
                                    <p>{shiftResult.walkouts} walked out</p>
                                    <p>{shiftLeftover} ingredients discarded</p>
                                    {/* Round 9, task 2: replaces shiftPending — zero on a
                                        win hides the line entirely (rendered only on a
                                        loss); the real gap on a loss. Round 16: also
                                        hidden on a boss (LEVEL.target null) — there is
                                        no target to have fallen short of. Round 25: LEVEL
                                        .target is a level-wide total across recipes, not
                                        any one dish's — worded as "short of target",
                                        never naming a specific dish. */}
                                    {shiftResult.phase === 'lost' && LEVEL.target !== null && <p>{chaiShort} short of target</p>}
                                </div>
                                {/* Round 9, task 9: Chef Hats on any completed run (win or
                                    loss); coins earned + stars + thresholds only on a
                                    clear — a loss shows no stars at all. */}
                                {shiftEconomy && (
                                    <div className="flex flex-col items-center gap-3">
                                        {/* Round 16: also gated on LEVEL.stars !== null —
                                            a boss shows coins/hats but no star row at
                                            all, per §7.3b. */}
                                        {shiftResult.phase === 'won' && LEVEL.stars !== null && (
                                            <>
                                                <p className="flex items-center gap-2 text-xl font-bold text-[#3a2a1e]">
                                                    <img src={ASSET_SRC.get('ui-coin')} alt="" className="h-6 w-6 object-contain" />
                                                    earned = {shiftEconomy.coinsEarned}
                                                </p>
                                                {/* Round 20, task 1: fills right-to-left — star i (0-indexed,
                                                    left to right) lights when stars >= 3-i, so the star that
                                                    goes dark first on a lower grade is the leftmost one. This
                                                    row is positionally paired with the threshold row directly
                                                    below (three / two / clear, left to right); reordering one
                                                    without the other breaks the pairing a player reads between
                                                    them. */}
                                                <div className="flex gap-6 text-3xl text-[#3a2a1e]">
                                                    <span>{stars >= 3 ? '★' : '☆'}</span>
                                                    <span>{stars >= 2 ? '★' : '☆'}</span>
                                                    <span>{stars >= 1 ? '★' : '☆'}</span>
                                                </div>
                                                <div className="flex gap-6 text-sm text-[#9c8873]">
                                                    <span>{LEVEL.stars.three}</span>
                                                    <span>{LEVEL.stars.two}</span>
                                                    <span>clear</span>
                                                </div>
                                            </>
                                        )}
                                        <p className="flex items-center gap-2 text-lg text-[#7a6353]">
                                            <img src={ASSET_SRC.get('ui-chef-hat')} alt="" className="h-6 w-6 object-contain" />
                                            {shiftEconomy.hats} Chef Hats
                                        </p>
                                    </div>
                                )}
                                <div className="flex flex-wrap justify-center gap-4">
                                    {/* Round 23, task 5: Next Level, primary, first —
                                        only when cleared (see `cleared`'s own comment
                                        above) AND a next level actually exists. */}
                                    {nextLevelId !== null && (
                                        <button
                                            type="button"
                                            className="rounded-2xl bg-primary px-8 py-3 text-xl font-bold text-black"
                                            onClick={goToNextLevel}
                                        >
                                            Next Level
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="rounded-2xl bg-primary px-8 py-3 text-xl font-bold text-black"
                                        onClick={() => setRunId((n) => n + 1)}
                                    >
                                        Run Again
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded-2xl bg-black/10 px-8 py-3 text-xl font-bold text-[#3a2a1e]"
                                        onClick={toMainMenu}
                                    >
                                        Main Menu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Round 5, task 3: the prop picker for an empty slot. Round 22,
                task 4a: every exit path resumes the shift — pick (onPick,
                below) and Cancel/backdrop (both routed through PropPicker's
                own onClose) are the only two ways out. Resume fires last,
                after the scene mutation (placeProp) and after clearing this
                modal's own state, matching onClose's own ordering. */}
            {pendingSlot !== null && (
                <PropPicker
                    wallet={pendingSlot.wallet}
                    onPick={(propIndex) => {
                        sceneRef.current?.placeProp(pendingSlot.index, propIndex);
                        setPendingSlot(null);
                        store.patch({ paused: false });
                    }}
                    onClose={() => {
                        setPendingSlot(null);
                        store.patch({ paused: false });
                    }}
                />
            )}

            {/* Round 9, task 5: the unlock guard / insufficient-funds message
                — a third copy of PropPicker's DOM-overlay pattern
                (KitchenMode.md §2.5). */}
            {message && (
                <div
                    className="pointer-events-auto absolute inset-0 z-20 flex items-end justify-center bg-black/60"
                    onClick={() => setMessage(null)}
                >
                    <div className="mx-3 mb-3 w-full max-w-md rounded-2xl bg-black/85 p-4" onClick={(e) => e.stopPropagation()}>
                        <p className="text-center text-lg font-bold text-white">{message}</p>
                        <button
                            type="button"
                            className="mt-3 w-full rounded-xl bg-white/10 py-2 text-[1.1rem] font-semibold text-white/70 transition-transform active:scale-95"
                            onClick={() => { sfx.click(); setMessage(null); }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Round 9, task 6: sell confirmation for a filled slot with
                nothing to serve — same DOM-overlay pattern again. Round 22,
                task 4a: three exit paths (confirm, Cancel, backdrop), each
                resuming the shift last — after the scene mutation (sellProp,
                confirm only) and after clearing this modal's own state. */}
            {sellSlot && (
                <div
                    className="pointer-events-auto absolute inset-0 z-20 flex items-end justify-center bg-black/60"
                    onClick={() => { setSellSlot(null); store.patch({ paused: false }); }}
                >
                    <div className="mx-3 mb-3 w-full max-w-md rounded-2xl bg-black/85 p-4" onClick={(e) => e.stopPropagation()}>
                        <p className="mb-1 text-center text-xl font-bold text-white">Sell {sellSlot.name}?</p>
                        <p className="mb-3 text-center text-[1.1rem] text-white/60">Refund: {sellSlot.refund} coins</p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="flex-1 rounded-xl bg-primary py-2 text-lg font-bold text-black transition-transform active:scale-95"
                                onClick={() => {
                                    sceneRef.current?.sellProp(sellSlot.index);
                                    setSellSlot(null);
                                    store.patch({ paused: false });
                                }}
                            >
                                Sell
                            </button>
                            <button
                                type="button"
                                className="flex-1 rounded-xl bg-white/10 py-2 text-lg font-semibold text-white/70 transition-transform active:scale-95"
                                onClick={() => { sfx.click(); setSellSlot(null); store.patch({ paused: false }); }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Shift menu — duplicated from Hud.tsx, see file header. */}
            {menuOpen && (
                <div
                    className="pointer-events-auto absolute inset-0 z-20 flex flex-col items-center justify-center gap-10 bg-black/75 px-6 pt-safe-top pb-safe-bottom"
                    onClick={closeMenu}
                >
                    <div className="flex flex-col items-center gap-8" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-primary">Shift paused</h2>
                        <div className="flex flex-col gap-5">
                            <Slider compact label="Music" value={musicVol} onChange={(v) => applyVolumes(v, sfxVol)} />
                            <Slider
                                compact
                                label="Sound"
                                value={sfxVol}
                                onChange={(v) => { applyVolumes(musicVol, v); sfx.click(); }}
                            />
                        </div>
                        <button
                            type="button"
                            className="rounded-2xl bg-white/15 px-10 py-3 text-xl font-bold text-white transition-transform active:scale-95"
                            onClick={closeMenu}
                        >
                            Back to shift
                        </button>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 flex justify-center px-6 pb-safe-bottom">
                        <button
                            type="button"
                            className="mb-3 w-64 rounded-2xl bg-white/10 px-10 py-4 text-xl font-bold text-white/85 transition-transform active:scale-95"
                            onClick={(e) => { e.stopPropagation(); toMainMenu(); }}
                        >
                            Main Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
