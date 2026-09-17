/**
 * In-game HUD: a React overlay above the Pixi canvas.
 *
 * Pattern to keep: the overlay itself is pointer-events-none so taps fall
 * through to the canvas (pad selection lives there); each interactive
 * control opts back in with pointer-events-auto.
 *
 * LAYOUT CONTRACT (portrait, phone-first):
 *   row 1        lives chip + coins chip left, hamburger right — this and
 *                row 2 sit inside `topRowRef` below, whose real rendered
 *                height stage.ts reserves as `hudTopPx` (Round 12b Part 1 —
 *                see that file's own doc for why this replaced a design-unit
 *                TOP_BAND guess)
 *   row 2        rush counter left, speed buttons right, both nowrap
 *   bottom       `bottomColRef` below, whose real rendered height stage.ts
 *                reserves as `hudBottomPx`. Round 7 item 4: one
 *                always-mounted column — row 1 is the chef idle portrait
 *                (bottom-centre, 120px — ChefPortrait.tsx) with "Ready!"
 *                immediately to its right, vertically centred on it, shown
 *                only during the build phase (hidden with the rail while a
 *                pad is selected, with the shift menu, or under the post-
 *                boss panel below); row 2 is the Kitchen Actions row,
 *                centred under the pair, same build-phase gating. This
 *                retires the old bottom-left idle mount and its device-
 *                dependent gutter sizing (ChefPortrait.tsx's own doc has
 *                the detail) — the bottom band exists on every phone now,
 *                so there's no gutter left to measure.
 *   post-boss    PostBossPanel.tsx: a centred overlay for the one build
 *                phase right after a boss level clears — its own READY
 *                replaces the inline one for that wave; the Kitchen
 *                Actions row stays usable underneath it.
 * Every edge uses px-3 plus safe-area padding: nothing touches a screen
 * edge, and the speed row shrinks rather than overflowing.
 *
 * StationRail.tsx (was BuildSheet.tsx, a bottom sheet) is a right-edge
 * panel that overlays the board only while a pad is selected — it mounts
 * nothing and claims no screen space otherwise, so this HUD needs no
 * clearance padding for it. Ready! and the rail can't overlap because
 * they're mutually exclusive on the same selectedPad flag: Ready shows
 * only while selectedPad is null, which is exactly when the rail unmounts.
 *
 * The hamburger opens the shift menu, which pauses the run (store.paused
 * stops the Pixi ticker) and offers continuous music/sound sliders plus
 * Main Menu. The kit's plain "Paused" card is suppressed while it is open
 * so the two overlays never stack.
 *
 * Round 10 Part 7 (docs/Ideas.md §6d, "Playtest of 1.81.0" item 4): the
 * shift menu is rebuilt on the same "look A" card shell Settings.tsx uses
 * (SettingsCard.tsx) — title "SHIFT PAUSED", the two sliders, credit line,
 * no Name row (renaming mid-run isn't offered); Continue (filled green)
 * above Main Menu (red-outline ghost), scrim tap = Continue. Main Menu's
 * own behaviour (straight to the menu, no confirm) is unchanged.
 *
 * Round A (Challenge-mode FTUE, GDD §10.11): an objective banner fires per
 * run (keyed on runId — Retry counts as a new run), and the lives chip is
 * labelled (Round 3: relabelled again, ESCAPES LEFT — see docs/LevelBlocks.md §11).
 *
 * Round D: the FTUE is a persistent, walled script through wave 4
 * (onboarding-balance round: was wave 3, before a third forced placement
 * extended the script by one wave — store.ftueBeat drives the walls, see
 * actions.ts/towerScene.ts). Every forced-beat arrow (upgrade0, placeFirst,
 * place2, place3) is a DOM cue anchored to a live element inside
 * StationRail.tsx by getBoundingClientRect() instead, and lives entirely
 * there.
 *
 * Round E: the picker-beat arrow's pad is store.ftueBeatPad, not a
 * hardcoded pad — see store.ts/towerScene.ts. Round 10 Part 4: the orange
 * empty-pad pulse that used to fire after every wave clear (and cover the
 * FTUE's own place2/place3 delay) is removed entirely — towerScene.ts's
 * per-pad green/red affordability cue (syncPadCues, Round 9 Part 3) is the
 * one empty-pad signal now, everywhere, so this file no longer tracks or
 * renders anything pulse-related.
 */
import { useEffect, useRef, useState } from 'react';
import { setMusicVolume, setSfxVolume, sfx, switchCue } from '../audio/audio.ts';
import { buyKitchenAction, getEngine, kitchenActionPrice, startWave } from '../game/actions.ts';
import { blockForLevel } from '../game/data/blocks.ts';
import { CONFIG } from '../game/config.ts';
import { unmuteDialogue } from '../game/dialogueController.ts';
import { setAudioVolumes } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';
import { ChefHeadIcon, ChefPortraitIdle } from './ChefPortrait.tsx';
import DialogueBox from './DialogueBox.tsx';
import PostBossPanel, { usePostBossPanel } from './PostBossPanel.tsx';
import ServiceRing from './ServiceRing.tsx';
import { Card, CardCredit, CardDivider, CardScrim, CardTitle } from './SettingsCard.tsx';
import Slider from './Slider.tsx';
import { useMenuUnit } from './useMenuUnit.ts';
import { useWaveBubble, WaveBubbleSubmenu, WaveBubbleTrigger } from './WaveBubble.tsx';

/** Danger threshold for the lives chip's red pulse: ≤30% of starting lives
 *  is the conventional "danger zone" cutoff (enough runway left to react,
 *  not so early it cries wolf) — for CONFIG.economy.startLives (10) that's
 *  3. Derived, not typed in, so a balance change to startLives carries it. */
const LIVES_DANGER = Math.ceil(CONFIG.economy.startLives * 0.3);

export default function Hud() {
    const coins = useStore((s) => s.coins);
    const lives = useStore((s) => s.lives);
    const wave = useStore((s) => s.wave);
    const waveCount = useStore((s) => s.waveCount);
    const tdPhase = useStore((s) => s.tdPhase);
    const speed = useStore((s) => s.speed);
    const paused = useStore((s) => s.paused);
    const musicVol = useStore((s) => s.musicVol);
    const sfxVol = useStore((s) => s.sfxVol);
    const selectedPad = useStore((s) => s.selectedPad);
    const runId = useStore((s) => s.runId);
    const ftueBeat = useStore((s) => s.ftueBeat);
    const ftueActive = useStore((s) => s.ftueActive);
    const backdropTransitioning = useStore((s) => s.backdropTransitioning);
    const ftueGrantAmount = useStore((s) => s.ftueGrantAmount);
    const ftueGrantNonce = useStore((s) => s.ftueGrantNonce);
    const dialogue = useStore((s) => s.dialogue);
    const mu = useMenuUnit();
    const waveBubble = useWaveBubble();
    const bossPanel = usePostBossPanel();
    // Blocker round audit: the Kitchen Actions row below reads getEngine()
    // during render, same non-reactive-read shape StationRail.tsx's own doc
    // comment describes in full. Not the reported repro path (this row only
    // shows post-FTUE, by which point the engine has been alive for many
    // renders already), but the same latent bug class — subscribing here is
    // what makes it safe regardless, rather than relying on that timing.
    useStore((s) => s.engineReady);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showObjective, setShowObjective] = useState(true);
    const [showMilestone, setShowMilestone] = useState(false);
    const [showGrant, setShowGrant] = useState(false);
    // Round 12b Part 1: measured by the ResizeObserver effect below.
    const topRowRef = useRef<HTMLDivElement>(null);
    const bottomColRef = useRef<HTMLDivElement>(null);

    // Coin top-up toast (round D, task 3): re-show on every grant, even a
    // repeat amount — nonce, not the amount, is what keys the effect.
    useEffect(() => {
        if (ftueGrantNonce === 0) return;
        setShowGrant(true);
        const t = setTimeout(() => setShowGrant(false), 2600);
        return () => clearTimeout(t);
    }, [ftueGrantNonce]);

    // One-time objective banner per run (Retry bumps runId, so it repeats).
    useEffect(() => {
        setShowObjective(true);
        const t = setTimeout(() => setShowObjective(false), 4000);
        return () => clearTimeout(t);
    }, [runId]);

    // Round A2: the campaign-milestone banner — the moment `wave` first
    // crosses into overtime (waveCount + 1), once, per waves.ts's own
    // authoritative count. Deriving isMilestoneWave and keying the effect on
    // that boolean (rather than on [wave, waveCount] directly) matters:
    // overtime keeps incrementing `wave` on every later rush too, and each
    // of those changes reruns any effect keyed on `wave` itself — cleanup
    // clears the pending hide-timeout, but the handler's own `wave !==
    // waveCount + 1` guard returns early on those later waves without ever
    // re-arming it, leaving the banner stuck on screen for the rest of the
    // run. Keying on isMilestoneWave collapses every later wave to the same
    // "false" value, so the effect only re-runs at the two edges that
    // matter — the crossing itself, and whenever it's no longer true — and
    // explicitly hides on the latter rather than leaving it to a timer that
    // may never get the chance to fire.
    const isMilestoneWave = wave === waveCount + 1;
    useEffect(() => {
        if (!isMilestoneWave) { setShowMilestone(false); return; }
        setShowMilestone(true);
        const t = setTimeout(() => setShowMilestone(false), 4500);
        return () => clearTimeout(t);
    }, [isMilestoneWave]);

    // Round 12b Part 1 (HUD bands in pixels): the two containers stage.ts
    // now reserves clearance for, measured directly rather than guessed as
    // a design-unit constant — see stage.ts's own doc for why the old guess
    // was the actual bug. Distance is taken from #app-frame's own top/
    // bottom edges (not the raw viewport), since that's the exact box
    // stage.ts's screenW/screenH already describe: GameCanvas's own host and
    // this HUD's root are both `inset-0` siblings inside the same
    // app-frame-filling wrapper (App.tsx), so #app-frame IS the canvas's
    // frame of reference. Both containers are ALWAYS mounted (only their
    // INNER content — Ready, the actions row — comes and goes), so one
    // ResizeObserver on each, set up once, sees every real change; a
    // requestAnimationFrame coalesces the (up to two) callbacks that can
    // fire in the same tick into one store write, so stage.ts's own
    // rAF-debounced layout() (see that file) never re-lays-out twice for
    // one visual change.
    useEffect(() => {
        const frame = document.getElementById('app-frame');
        const topEl = topRowRef.current;
        const bottomEl = bottomColRef.current;
        if (!frame || !topEl || !bottomEl) return;
        let raf: number | null = null;
        const measure = () => {
            raf = null;
            const frameRect = frame.getBoundingClientRect();
            const topRect = topEl.getBoundingClientRect();
            const bottomRect = bottomEl.getBoundingClientRect();
            const hudTopPx = Math.max(0, topRect.bottom - frameRect.top);
            const hudBottomPx = Math.max(0, frameRect.bottom - bottomRect.top);
            const cur = store.get();
            if (cur.hudTopPx !== hudTopPx || cur.hudBottomPx !== hudBottomPx) {
                store.patch({ hudTopPx, hudBottomPx });
            }
        };
        const schedule = () => {
            if (raf !== null) return;
            raf = requestAnimationFrame(measure);
        };
        const ro = new ResizeObserver(schedule);
        ro.observe(topEl);
        ro.observe(bottomEl);
        schedule();
        return () => {
            ro.disconnect();
            if (raf !== null) cancelAnimationFrame(raf);
        };
    }, []);

    const applyVolumes = (music: number, sound: number) => {
        setMusicVolume(music);
        setSfxVolume(sound);
        setAudioVolumes(music, sound);
        store.patch({ musicVol: music, sfxVol: sound });
    };

    const openMenu = () => { sfx.click(); store.patch({ paused: true }); setMenuOpen(true); };
    const closeMenu = () => { sfx.click(); store.patch({ paused: false }); setMenuOpen(false); };

    // Round 7 item 4: the bottom band's build-phase gate — same conditions
    // Ready has always used, shared here so the actions row (which stays
    // usable under the post-boss panel) and Ready (which does not) can gate
    // independently off one source instead of repeating the clause twice.
    const bottomBandActive = tdPhase === 'build' && selectedPad === null && ftueBeat === null && dialogue === null && !menuOpen;
    const showInlineReady = bottomBandActive && !bossPanel.visible;

    return (
        <div className="pointer-events-none absolute inset-0 pt-safe-top">
            <div className="flex flex-col gap-2 px-3">
                {/* Round 12b Part 1: topRowRef wraps ONLY the persistent
                    chrome (row 1, row 2, the wave-bubble submenu) — NOT the
                    coin-toast or the objective/milestone banners just below,
                    which are moved to after this wrapper's close. Those are
                    transient (2.6s / 4-4.5s) and the objective banner in
                    particular defaults to SHOWING on every run's first
                    render — measuring straight through them inflated
                    hudTopPx by ~200px in testing (a banner's own real
                    height), which fed stage.ts's getFit() and visibly
                    shrank the board for that whole opening window. Keeping
                    them outside the measured subtree means they still
                    render in the same visual column (just after row 1/2/
                    submenu instead of interleaved before row 2) and simply
                    draw over whatever's beneath them while visible, exactly
                    as they effectively did before this round (band
                    reservation was a fixed design-unit guess before,
                    unaware of ANY HUD content's real height either). */}
                <div ref={topRowRef} className="flex flex-col gap-2">
                {/* row 1: status + hamburger */}
                <div className="flex items-center justify-between gap-2">
                    <div id="hud-chip-row" className="flex min-w-0 gap-2">
                        {/* Round 3 HUD relabel (docs/LevelBlocks.md §11): 🚪 10
                            named nothing; ESCAPES LEFT names what a lost life
                            IS — a customer walking out. Label stacked above
                            the number (not inline) so the longer text stays
                            on one line at 360px wide. Two opaque chips, not
                            one translucent pill: the number the player most
                            needs (lives) was losing to the board behind it.
                            Lives turn red and pulse below LIVES_DANGER;
                            motion-safe: respects prefers-reduced-motion. */}
                        <div
                            className={
                                'flex flex-col items-start rounded-xl px-3 py-1.5 leading-tight whitespace-nowrap ' +
                                (lives <= LIVES_DANGER
                                    ? 'bg-red-900 text-red-200 motion-safe:animate-pulse'
                                    : 'bg-surface text-white')
                            }
                        >
                            <span className="text-[0.62rem] font-bold uppercase tracking-wide opacity-80">
                                ❤️🏃 Escapes left
                            </span>
                            <span className="text-xl font-bold tabular-nums">{lives}</span>
                        </div>
                        <div className="flex flex-col items-start rounded-xl bg-surface px-3 py-1.5 leading-tight text-white whitespace-nowrap">
                            <span className="text-[0.62rem] font-bold uppercase tracking-wide opacity-80">💰 Cash</span>
                            <span className="text-xl font-bold tabular-nums">{coins.toLocaleString()}</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        aria-label="Shift menu"
                        className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/55 transition-transform active:scale-95"
                        onClick={openMenu}
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                            strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="17" x2="20" y2="17" />
                        </svg>
                    </button>
                </div>

                {/* row 2: wave/rush + speed, both shrink-proof. Round 3 HUD
                    relabel (docs/LevelBlocks.md §11): WAVE and RUSH stop
                    being the same counter — WAVE is the absolute level,
                    RUSH is the block label (data/blocks.ts), so level 34
                    reads "WAVE 34 / RUSH: SOUTH INDIAN". `wave` already IS
                    the absolute level (this chip's old ternary only existed
                    to spell "Overtime" by hand — block 9's own label already
                    says OVERTIME, so blockForLevel needs no special case). */}
                {/* Round 11 Part 1.5 fix (docs/Ideas.md §6d, "Playtest of
                    1.82.0"): the icon growth below (56->64px) made a full
                    3-dish bubble (level 81: Naan/Idli/Jeera Rice, the spec's
                    own worst case) wider than the leftover space next to the
                    speed buttons at 360px — measured a real -23.8px overlap
                    before this fix, and the WAVE-chip+ring pair ALONE
                    already consumes essentially this row's entire width at
                    that viewport, so a two-tier `justify-between` split (one
                    fixed-width "left" box, one fixed-width "right" box)
                    can't make room for the bubble no matter how it's
                    apportioned — any positive-width bubble box overlaps the
                    speed box's own reported position, because that position
                    is computed from the SAME two boxes' widths, not from
                    where content visually ends up once one of them wraps
                    internally (this file's own earlier attempt: making just
                    the left box `flex-wrap` left it still overlapping,
                    since the box's reported width stayed pinned to its
                    widest single line).
                    The fix: ONE flat flex-wrap row for every element (WAVE
                    chip, ring/head box, bubble, speed buttons) instead of
                    two nested boxes — normal flex flow wraps whichever
                    trailing item doesn't fit onto a new line, so nothing
                    can ever overlap by construction; `ml-auto` on the speed
                    row keeps it right-aligned exactly like `justify-between`
                    did whenever everything DOES fit on one line (every wider
                    viewport this file's own history was measured against),
                    and lets it drop to its own line otherwise. Per Round 6
                    Part B's own already-documented allowance, "row 2 may
                    grow taller as a result." */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex shrink-0 flex-col items-start rounded-xl bg-black/55 px-3 py-1 leading-tight whitespace-nowrap">
                        <span className="text-lg font-bold tabular-nums">WAVE {wave}</span>
                        <span className="text-[0.68rem] font-semibold text-white/70">
                            RUSH: {blockForLevel(wave).label}
                        </span>
                    </div>
                    {/* Round 3 (docs/Ideas.md §6d amendment, "Skip = mute"):
                        always-present un-mute tap target — the idle chef
                        portrait (ChefPortraitIdle, now bottom-centre in
                        the bottom band — Round 7 item 4) is the other
                        one; both are always mounted today (the bottom
                        band exists on every phone, retiring the gutter
                        case this comment used to describe), so this one
                        mainly exists as the top-left ring/bubble anchor
                        below. Placed next to the WAVE chip (not under
                        it) so it can never collide with the row below.
                        Stable id — Round 4's chat bubble anchors here.
                        unmuteDialogue() no-ops while not muted, so this
                        is always safe to tap.
                        Round 4 Part D: wrapped in a 52px box so
                        ServiceRing (the service gauge, now a ring
                        instead of Round 3's bar) can sit behind the 44px
                        button itself without resizing it. */}
                    <div className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center">
                        <ServiceRing />
                        <button
                            type="button"
                            id="chef-head-button"
                            aria-label="Ramu — tap to un-mute his dialogue"
                            onClick={() => { sfx.click(); unmuteDialogue(); }}
                            className="pointer-events-auto relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-black/55"
                        >
                            <ChefHeadIcon />
                        </button>
                    </div>
                    {/* Round 4 Part E: the wave bubble trigger — plain DOM
                        flow next to #chef-head-button is "anchored to its
                        right" by construction (see WaveBubble.tsx). */}
                    <WaveBubbleTrigger state={waveBubble} />
                    <div className="pointer-events-auto ml-auto flex shrink-0 overflow-hidden rounded-xl bg-black/55">
                        {([1, 2, 3, 4] as const).map((s) => (
                            <button
                                key={s}
                                type="button"
                                className={
                                    'px-2.5 py-1.5 text-[1.1rem] font-bold transition-colors ' +
                                    (speed === s ? 'bg-primary text-black' : 'text-white/70')
                                }
                                onClick={() => { sfx.click(); store.patch({ speed: s }); }}
                            >
                                {s}x
                            </button>
                        ))}
                    </div>
                </div>

                {/* Round 4 Part D retires Round 3's bar (ServiceGauge.tsx,
                    deleted — the service gauge is now ServiceRing.tsx,
                    around #chef-head-button above). Part E's scroll submenu
                    takes this row instead — directly under the WAVE/RUSH +
                    speed row by DOM order, in the "top band between the
                    WAVE chip and the speed buttons" the handover asks for;
                    a separate row rather than squeezed between them within
                    row 2 itself is what guarantees it can never overlap
                    either. */}
                <WaveBubbleSubmenu state={waveBubble} />
                </div>

                {/* Coin top-up toast (round D, task 3; round 5 playtest fix:
                    was `absolute left-3 top-24`, a magic offset that landed
                    squarely on row 2 at 403x874 — half-covering the 1x speed
                    button and reading as "an FTUE Shift float overlapping
                    the WAVE chip" (playtest screenshot 1). Same structural
                    fix as the Ready/Kitchen-Actions column below: a normal
                    flow row in this same flex-col column, so it can't
                    overlap row 1/2/submenu at any viewport/safe-area — it
                    just pushes whatever comes after it down for the ~2.6s
                    it's visible, same trade the objective/milestone banners
                    make. Round 12b Part 1: moved from BETWEEN row 1 and row
                    2 to AFTER the topRowRef-measured block (see that ref's
                    own comment) — visually it now appears below the speed
                    row instead of above it, a deliberate placement change to
                    keep this transient toast out of the persistent HUD-band
                    measurement, not an accident. */}
                {showGrant && (
                    <div className="pointer-events-none flex justify-start">
                        <span className="rounded-lg bg-primary px-3 py-1 text-[1.05rem] font-bold text-black">
                            +{ftueGrantAmount} 🪙 shift float
                        </span>
                    </div>
                )}

                {/* Mobile layout round, task 2: the objective/milestone
                    banners used to be separate `absolute top-20` overlays —
                    a magic offset measured against row 1+2's height at one
                    viewport, which overlapped the WAVE label and speed row
                    the moment either grew (a longer RUSH label wrapping, a
                    taller safe-area top inset). Flowing them as ordinary
                    flex children right here, inside the same gap-2 column as
                    row 1+2, makes "below the top rows" true by construction
                    at any height instead of a guessed pixel value — the
                    shared `gap-2` is the only spacing rule, and it already
                    applies correctly whether 0, 1, or 2 of the rows above
                    grow. Round 12b Part 1: this column's ITSELF is now
                    outside topRowRef (see that ref's own comment) — still
                    the same shared flex-col, still "below the top rows" by
                    the same construction, just no longer part of what
                    stage.ts reserves board-scale clearance for. Objective
                    and milestone are mutually exclusive
                    (each guards on !showMilestone / the FTUE state so only
                    one ever speaks at once — round 19's belt mistake was
                    two cues teaching the same moment), so at most one of
                    these two slots is ever occupied. Copy round: the
                    objective banner now reads the live `lives` count instead
                    of a fixed number, so it stays accurate even if it's
                    still on screen when the player takes an early hit. */}
                {showObjective && ftueBeat === null && !showMilestone && (
                    <div className="pointer-events-auto flex justify-center" onClick={() => setShowObjective(false)}>
                        <p className="max-w-xs rounded-xl bg-black/70 px-4 py-2 text-center text-[1.05rem] font-semibold leading-snug">
                            Don't miss an order — you only have {lives} ❤️🏃 before you lose.
                        </p>
                    </div>
                )}
                {showMilestone && ftueBeat === null && (
                    <div className="pointer-events-auto flex justify-center" onClick={() => setShowMilestone(false)}>
                        <p className="max-w-xs rounded-xl bg-primary px-4 py-2 text-center text-[1.05rem] font-semibold leading-snug text-black">
                            Full shift held. Everything from here is overtime — how far can you push it?
                        </p>
                    </div>
                )}
            </div>

            {/* Mobile layout round, task 1: Ready and the Kitchen Actions row
                collided on-device three times running (12px overlap, then a
                34px-safe-area overlap the desktop-emulation testing that
                "fixed" it never had). Each prior fix was a magic offset
                (bottom-16 / bottom-0) tuned against a zero-inset desktop
                measurement, so it broke again the moment a real
                env(safe-area-inset-bottom) (~34px on a home-indicator
                device) lifted the actions row without also lifting Ready.
                The structural fix: ONE bottom-anchored flex column holds
                the wave-4 toast, Ready, and the actions row, in that visual
                order, with a shared `gap` between whichever of them render
                and `pb-safe-bottom` applied exactly once on the column
                itself. Ready's position is now "however tall the actions
                row is, plus one gap" instead of a fixed guess — the two
                literally cannot overlap at any viewport, inset, or text
                scale, because normal flex flow (not two independently
                positioned siblings) is what's placing them. This also
                retires the wave-4 toast's old bottom-48 fixed clearance
                (see its own comment below) in favour of the same flow.
                Round 7 item 4: this column is now ALWAYS mounted (the chef
                portrait persists across the build and wave phases alike —
                "wave phase: portrait stays"), with Ready/actions each
                gating internally instead of the whole column being
                conditional — see bottomBandActive/showInlineReady above. */}
            {/* Round 7 item 4: gap-1 (was gap-2) between row 1 and row 2 —
                shaved 4px off the column's total height, part of clearing
                the path's exit corner alongside stage.ts's then-BOTTOM_BAND
                bump (that constant is gone — Round 12b Part 1 replaced it
                with a measured hudBottomPx; see stage.ts's own doc). */}
            <div ref={bottomColRef} className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-1 px-3 pb-safe-bottom">
                {/* Round 2c (docs/Ideas.md §6d amendment) removed the
                    upgrade-reminder toast that used to live here at
                    wave 4 — replaced by the Lv↑ markers towerScene.ts
                    now draws over any placed, upgrade-affordable prop,
                    every wave, not just wave 4. */}

                {/* Row 1: Round 12 Part 1.3 (docs/Ideas.md §6d, "Playtest of
                    1.83.0" item 4) moved Ready from beside the portrait to
                    ABOVE it, once Part 1.2 rescaled the portrait to 132px —
                    at that size, beside it pushed the row's total width past
                    what 360px-wide phones have to spare. flex-col
                    items-center stacks the two and horizontally centres the
                    narrower of them on the wider by construction (same
                    "flow does the centring, not a manual offset" posture the
                    old inline comment already called out for the vertical
                    case) — whichever of Ready/the portrait is wider, the
                    other lands centred under/over it with no hand-measured
                    offset either could drift from. Gap is the spec's own
                    6*mu, replacing the old fixed gap-3. */}
                <div className="flex flex-col items-center" style={{ gap: 6 * mu }}>
                    {showInlineReady && (
                        /* Ready: enlarged for a bigger tap target, sized down at
                            narrow (~400 CSS px) widths via the sm: breakpoint
                            rather than a single fixed size — px-16/py-5/text-3xl
                            read as oversized on a phone but are the right scale
                            again once the viewport is wide enough (~740 px) not
                            to look undersized. The looping pulse lives on a
                            WRAPPING div, not the button itself — animating the
                            button's own transform would fight active:scale-95's
                            tap feedback (both target the same property; the
                            keyframe would win every frame and the press would
                            never visibly register). Locked (visibly, via
                            disabled + dimmed styling, not just inert) for
                            BACKDROP_LOCK_S while a real block transition
                            crossfades — actions.ts's startWave() is the real
                            gate, same one-gate posture as every other FTUE wall
                            in this file; disabled also suspends the pulse, since
                            animating "tap me" on a button that currently can't
                            be tapped would be its own small lie. Round 7 item 4:
                            hidden for the one build phase PostBossPanel owns
                            instead (its own READY takes over); the panel's own
                            visibility already implies backdropTransitioning is
                            false for that wave (the dialogue-then-panel sequence
                            runs well after the crossfade lock expires), so no
                            extra check is needed here for that overlap. */
                        <div className={backdropTransitioning ? '' : 'motion-safe:animate-ready-pulse'}>
                            <button
                                type="button"
                                disabled={backdropTransitioning}
                                className={
                                    'pointer-events-auto rounded-2xl px-10 py-4 text-2xl font-bold shadow-lg transition-transform active:scale-95 sm:px-16 sm:py-5 sm:text-3xl ' +
                                    (backdropTransitioning ? 'bg-white/20 text-white/40' : 'bg-primary text-black')
                                }
                                onClick={() => { sfx.startWave(); startWave(); }}
                            >
                                Ready!
                            </button>
                        </div>
                    )}
                    <ChefPortraitIdle />
                </div>

                {/* Row 2: Kitchen Actions — the coin sink. One wave's effect,
                    bought here, gone after. Deliberately minimal/provisional
                    (round 3 restyles this area) — a plain row of three
                    buttons, each showing its live price (sim/engine.ts's
                    kitchenActionCost) and disabling once bought for this wave
                    or unaffordable. Hidden for the same waves Ready would
                    show on (ftueBeat === null can be true mid-FTUE, between
                    forced beats) — the scripted intro keeps the coin sink out
                    of the player's hands until wave 4. Round 7 item 4: stays
                    usable even while PostBossPanel owns Ready (bottomBandActive
                    doesn't check bossPanel.visible, unlike showInlineReady). */}
                {bottomBandActive && !ftueActive && (
                    <div className="pointer-events-auto flex justify-center gap-2">
                        {(['freeze', 'heat', 'slow'] as const).map((kind) => {
                            const bought = getEngine()?.state.kitchenActions[kind] ?? false;
                            const price = kitchenActionPrice(kind);
                            const label = kind === 'freeze' ? 'Deep Freeze' : kind === 'heat' ? 'Turn Up The Heat' : 'Slow Service';
                            const disabled = bought || coins < price;
                            return (
                                <button
                                    key={kind}
                                    type="button"
                                    disabled={disabled}
                                    className="rounded-xl bg-black/55 px-2 py-1.5 text-center text-[0.7rem] font-bold leading-tight text-white disabled:opacity-45"
                                    onClick={() => { sfx.click(); buyKitchenAction(kind); }}
                                >
                                    <span className="block">{label}</span>
                                    <span className="block">{bought ? '✓ bought' : `${price}c`}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <PostBossPanel state={bossPanel} />

            {/* Round 1 (docs/Ideas.md §1/§6d): mounted here per the
                handover, at the top of Hud's own render order so its z-20
                bottom bar draws above the Ready column it's mutually
                exclusive with (both z-20; later in DOM order wins ties). */}
            <DialogueBox />

            {/* Shift menu — Round 10 Part 7: the "look A" card shell (same
                one Settings.tsx uses), no Name row, scrim tap = Continue
                (not Back — Continue IS this card's safe/default action). */}
            {menuOpen && (
                <CardScrim onTap={closeMenu} zIndex={20}>
                    <Card mu={mu}>
                        <CardTitle mu={mu}>Shift paused</CardTitle>
                        <div className="flex flex-col" style={{ gap: 10 * mu }}>
                            <Slider theme="cream" mu={mu} label="🎵 Music" value={musicVol} onChange={(v) => applyVolumes(v, sfxVol)} />
                            <Slider
                                theme="cream"
                                mu={mu}
                                label="🔊 Sound"
                                value={sfxVol}
                                onChange={(v) => { applyVolumes(musicVol, v); sfx.click(); }}
                            />
                        </div>
                        <CardDivider />
                        <CardCredit mu={mu} />
                        <div className="flex flex-col items-stretch" style={{ gap: 7 * mu }}>
                            <button
                                type="button"
                                className="font-bold shadow-lg transition-transform active:scale-95"
                                style={{
                                    padding: `${12 * mu}px ${6 * mu}px`,
                                    fontSize: 12 * mu,
                                    borderRadius: 10 * mu,
                                    backgroundColor: '#22c55e',
                                    color: 'var(--color-chocolate)',
                                    border: `${2 * mu}px solid var(--color-chocolate)`,
                                }}
                                onClick={closeMenu}
                            >
                                Continue
                            </button>
                            <button
                                type="button"
                                className="font-bold transition-transform active:scale-95"
                                style={{
                                    padding: `${8 * mu}px ${6 * mu}px`,
                                    fontSize: 10 * mu,
                                    borderRadius: 10 * mu,
                                    backgroundColor: 'var(--color-cream)',
                                    color: '#ef4444',
                                    border: `${2 * mu}px solid #ef4444`,
                                }}
                                onClick={() => {
                                    sfx.click();
                                    switchCue('menu');
                                    setMenuOpen(false);
                                    store.patch({ paused: false, phase: 'menu', selectedPad: null });
                                }}
                            >
                                Main Menu
                            </button>
                        </div>
                    </Card>
                </CardScrim>
            )}

            {/* The kit's plain paused card, suppressed while the shift menu owns the screen */}
            {paused && !menuOpen && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <p className="text-2xl font-bold">Paused</p>
                </div>
            )}
        </div>
    );
}
