/**
 * In-game HUD: a React overlay above the Pixi canvas.
 *
 * Pattern to keep: the overlay itself is pointer-events-none so taps fall
 * through to the canvas (pad selection lives there); each interactive
 * control opts back in with pointer-events-auto.
 *
 * LAYOUT CONTRACT (portrait, phone-first):
 *   row 1        lives chip + coins chip left, hamburger right — this is
 *                stage.ts's reserved TOP_BAND; keep row 1+2 within it
 *   row 2        rush counter left, speed buttons right, both nowrap
 *   bottom       "Ready!" centred, hidden while a pad is selected (the rail
 *                shows its build/manage panel instead) and hidden while the
 *                shift menu is open — this is stage.ts's reserved BOTTOM_BAND
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
 * Round A (Challenge-mode FTUE, GDD §10.11): an objective banner fires per
 * run (keyed on runId — Retry counts as a new run), and the lives chip is
 * labelled (Round 3: relabelled again, ESCAPES LEFT — see docs/LevelBlocks.md §11).
 *
 * Round D: the FTUE is a persistent, walled script through wave 4
 * (onboarding-balance round: was wave 3, before a third forced placement
 * extended the script by one wave — store.ftueBeat drives the walls, see
 * actions.ts/towerScene.ts). Two cue kinds, never both at once (one voice):
 *   - The empty-pad pulse is a canvas cue, positioned via stage.ts's
 *     designToScreen() — the same contain-fit transform stage.ts and
 *     towerScene.ts use internally, read here but never written, and never
 *     re-derived by hand (round C, task 2).
 *   - Every forced-beat arrow (upgrade0, and — final round — placeFirst/
 *     place2/place3 too) is a DOM cue anchored to a live element inside
 *     StationRail.tsx by getBoundingClientRect() instead, and lives entirely
 *     there. Final round: the picker beats used to point a canvas arrow at
 *     the target pad here, redundant with the selected-pad ring (which
 *     already shows which pad) and pointing at the wrong place besides —
 *     the player still has to tap a card in the rail, not the pad again.
 *
 * Round E: the picker-beat arrow's pad is store.ftueBeatPad, not a
 * hardcoded pad — see store.ts/towerScene.ts. The empty-pad pulse
 * (store.pulsePads) also stops being FTUE-exclusive: it fires after every
 * wave clear from wave 4 on (towerScene.ts's applyPostWavePulse).
 */
import { useEffect, useState } from 'react';
import { setMusicVolume, setSfxVolume, sfx, switchCue } from '../audio/audio.ts';
import { buyKitchenAction, getEngine, kitchenActionPrice, startWave } from '../game/actions.ts';
import { blockForLevel } from '../game/data/blocks.ts';
import { CONFIG } from '../game/config.ts';
import { designToScreen } from '../game/stage.ts';
import { setAudioVolumes } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';
import Slider from './Slider.tsx';

/** Live screen positions of a set of pads, tracking the canvas's own
 *  contain-fit + board-centering transform — stage.ts's designToScreen() is
 *  the one source of truth for this (round C, task 2: a hand-rolled second
 *  copy of this formula here caused a near-miss review). Used for the
 *  empty-pad pulse below; the FTUE arrow moved off canvas entirely (final
 *  round, task 1 — see the header comment) so this no longer also serves it. */
function usePadsScreenPos(padIndices: number[]): Array<{ x: number; y: number }> {
    const key = padIndices.join(',');
    const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([]);
    useEffect(() => {
        const frame = document.getElementById('app-frame');
        if (!frame || padIndices.length === 0) { setPositions([]); return; }
        const compute = () => {
            const rect = frame.getBoundingClientRect();
            setPositions(padIndices.map((i) => {
                const pad = CONFIG.pads[i];
                return designToScreen(pad.x, pad.y, rect.width, rect.height);
            }));
        };
        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(frame);
        return () => ro.disconnect();
        // padIndices is re-created every render; `key` is its stable identity.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);
    return positions;
}

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
    const pulsePads = useStore((s) => s.pulsePads) ?? [];
    const ftueActive = useStore((s) => s.ftueActive);
    const backdropTransitioning = useStore((s) => s.backdropTransitioning);
    const ftueGrantAmount = useStore((s) => s.ftueGrantAmount);
    const ftueGrantNonce = useStore((s) => s.ftueGrantNonce);
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
    // Final round, task 1: every forced-beat arrow (placeFirst/place2/
    // place3 included) lives inside StationRail.tsx — see this file's
    // header comment.
    const pulsePositions = usePadsScreenPos(pulsePads);

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

    const applyVolumes = (music: number, sound: number) => {
        setMusicVolume(music);
        setSfxVolume(sound);
        setAudioVolumes(music, sound);
        store.patch({ musicVol: music, sfxVol: sound });
    };

    const openMenu = () => { sfx.click(); store.patch({ paused: true }); setMenuOpen(true); };
    const closeMenu = () => { sfx.click(); store.patch({ paused: false }); setMenuOpen(false); };

    return (
        <div className="pointer-events-none absolute inset-0 pt-safe-top">
            <div className="flex flex-col gap-2 px-3">
                {/* row 1: status + hamburger */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 gap-2">
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
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col items-start rounded-xl bg-black/55 px-3 py-1 leading-tight whitespace-nowrap">
                        <span className="text-lg font-bold tabular-nums">WAVE {wave}</span>
                        <span className="text-[0.68rem] font-semibold text-white/70">
                            RUSH: {blockForLevel(wave).label}
                        </span>
                    </div>
                    <div className="pointer-events-auto flex shrink-0 overflow-hidden rounded-xl bg-black/55">
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
                    grow. Objective and milestone are mutually exclusive
                    (each guards on !showMilestone / the FTUE/pulse state so
                    only one ever speaks at once — round 19's belt mistake
                    was two cues teaching the same moment), so at most one of
                    these two slots is ever occupied. Copy round: the
                    objective banner now reads the live `lives` count instead
                    of a fixed number, so it stays accurate even if it's
                    still on screen when the player takes an early hit. */}
                {showObjective && ftueBeat === null && pulsePads.length === 0 && !showMilestone && (
                    <div className="pointer-events-auto flex justify-center" onClick={() => setShowObjective(false)}>
                        <p className="max-w-xs rounded-xl bg-black/70 px-4 py-2 text-center text-[1.05rem] font-semibold leading-snug">
                            Don't miss an order — you only have {lives} ❤️🏃 before you lose.
                        </p>
                    </div>
                )}
                {showMilestone && ftueBeat === null && pulsePads.length === 0 && (
                    <div className="pointer-events-auto flex justify-center" onClick={() => setShowMilestone(false)}>
                        <p className="max-w-xs rounded-xl bg-primary px-4 py-2 text-center text-[1.05rem] font-semibold leading-snug text-black">
                            Full shift held. Everything from here is overtime — how far can you push it?
                        </p>
                    </div>
                )}
            </div>

            {/* Coin top-up toast (round D, task 3): the exact shortfall a
                forced beat just granted, shown briefly near the coins chip
                — a different screen region from the canvas/sheet arrow
                cues below, so it never competes with "where do I tap". */}
            {showGrant && (
                <div className="pointer-events-none absolute left-3 top-24 z-10 rounded-lg bg-primary px-3 py-1 text-[1.05rem] font-bold text-black">
                    +{ftueGrantAmount} 🪙 shift float
                </div>
            )}

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
                (see its own comment below) in favour of the same flow. */}
            {tdPhase === 'build' && selectedPad === null && ftueBeat === null && !menuOpen && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 px-3 pb-safe-bottom">
                    {/* Round D: the FTUE now scripts every run through wave 4
                        (onboarding-balance round: was wave 3, before a third
                        forced placement extended the script by one wave), so
                        ftueActive covers waves 1-3 entirely and this hint's
                        old wave 2-3 range is dead — it can only ever fire
                        once, at wave 4, the first build phase where the
                        forced beats have all resolved (ftueBeat is null
                        again, even though ftueActive/Kitchen Actions don't
                        fully let go until Ready starts wave 4). Kept: it's a
                        real reminder for a genuinely new mechanic (upgrading)
                        at the first moment nothing else is cueing it.
                        Mobile layout round, task 2: used to float at a fixed
                        bottom-48 with no z-index, so a z-10 pad pulse
                        (below) could paint over it — z-index alone doesn't
                        reach across siblings reliably once one of them wins
                        the stacking-context tiebreak, so this column also
                        carries z-20 (below) to make the whole block win.
                        Living in this flex column (instead of its own
                        absolute offset) also means it always sits exactly
                        one gap above Ready, whatever Ready's own height
                        ends up being at this viewport. */}
                    {wave === 4 && (
                        <p className="rounded-xl bg-black/55 px-3 py-2 text-lg font-bold">
                            Tap a cook to upgrade
                        </p>
                    )}

                    {/* Ready: enlarged for a bigger tap target, sized down at
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
                        be tapped would be its own small lie. */}
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

                    {/* Round I Task 9: Kitchen Actions — the coin sink. One
                        wave's effect, bought here, gone after. Deliberately
                        minimal/provisional (round 3 restyles this area) — a
                        plain row of three buttons, each showing its live
                        price (sim/engine.ts's kitchenActionCost) and
                        disabling once bought for this wave or unaffordable.
                        Hidden for the same waves Ready still shows on
                        (ftueBeat === null can be true mid-FTUE, between
                        forced beats) — the scripted intro keeps the coin
                        sink out of the player's hands until wave 4. */}
                    {!ftueActive && (
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
            )}

            {/* Empty-pad pulse: during the FTUE, a beat over every empty pad
                right after wave 2 clears, before it resolves to the target
                pad (towerScene.ts's applyFtueWaveEnd). Round E generalises
                the same field/render to fire after EVERY wave clear once
                the FTUE is done, persisting for the whole build phase
                (towerScene.ts's applyPostWavePulse) — a continuous
                animate-ping read as too noisy sustained that long, so this
                uses the gentler animate-pulse (a slow opacity breathe)
                instead; motion-safe: still applies either way. */}
            {pulsePositions.map((pos, i) => (
                <div
                    key={pulsePads[i]}
                    className="pointer-events-none absolute z-10 rounded-full bg-primary/60 motion-safe:animate-pulse"
                    style={{ left: pos.x - 24, top: pos.y - 24, width: 48, height: 48 }}
                />
            ))}

            {/* Shift menu. Backdrop tap closes it. */}
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
                            onClick={(e) => {
                                e.stopPropagation();
                                sfx.click();
                                switchCue('menu');
                                setMenuOpen(false);
                                store.patch({ paused: false, phase: 'menu', selectedPad: null });
                            }}
                        >
                            Main Menu
                        </button>
                    </div>
                </div>
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
