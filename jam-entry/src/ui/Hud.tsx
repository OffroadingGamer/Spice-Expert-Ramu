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
 *   bottom       "Ready!" centred, hidden while the build sheet is open
 *                (BuildSheet is also inset-x-0 bottom-0, so they must never
 *                coexist) and hidden while the shift menu is open — this is
 *                stage.ts's reserved BOTTOM_BAND
 * Every edge uses px-3 plus safe-area padding: nothing touches a screen
 * edge, and the speed row shrinks rather than overflowing.
 *
 * The hamburger opens the shift menu, which pauses the run (store.paused
 * stops the Pixi ticker) and offers continuous music/sound sliders plus
 * Main Menu. The kit's plain "Paused" card is suppressed while it is open
 * so the two overlays never stack.
 *
 * Round A (Challenge-mode FTUE, GDD §10.11): an objective banner fires per
 * run (keyed on runId — Retry counts as a new run), and the 🚪 chip is
 * labelled.
 *
 * Round D: the FTUE is a persistent, walled script through wave 3
 * (store.ftueBeat drives the walls — see actions.ts/towerScene.ts). Two
 * cue kinds, never both at once (one voice):
 *   - Canvas cues (the picker-beat arrow, and the empty-pad pulse) are
 *     positioned via stage.ts's designToScreen() — the same contain-fit
 *     transform stage.ts and towerScene.ts use internally, read here but
 *     never written, and never re-derived by hand (round C, task 2).
 *   - The Upgrade-button arrow (forced-upgrade beat) is a DOM cue anchored
 *     to BuildSheet's own button by getBoundingClientRect() instead — it
 *     lives in BuildSheet.tsx, not here.
 *
 * Round E: the picker-beat arrow's pad is store.ftueBeatPad, not a
 * hardcoded pad — see store.ts/towerScene.ts. The empty-pad pulse
 * (store.pulsePads) also stops being FTUE-exclusive: it fires after every
 * wave clear from wave 3 on (towerScene.ts's applyPostWavePulse).
 */
import { useEffect, useState } from 'react';
import { setMusicVolume, setSfxVolume, sfx, switchCue } from '../audio/audio.ts';
import { startWave } from '../game/actions.ts';
import { CONFIG } from '../game/config.ts';
import { designToScreen } from '../game/stage.ts';
import { setAudioVolumes } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';
import Slider from './Slider.tsx';

/** Live screen positions of a set of pads, tracking the canvas's own
 *  contain-fit + board-centering transform — stage.ts's designToScreen() is
 *  the one source of truth for this (round C, task 2: a hand-rolled second
 *  copy of this formula here caused a near-miss review). Round D extends
 *  this from one pad (the original FTUE arrow) to several (the empty-pad
 *  pulse) rather than writing a second copy. */
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
    const ftueBeatPad = useStore((s) => s.ftueBeatPad);
    const pulsePads = useStore((s) => s.pulsePads) ?? [];
    const ftueGrantAmount = useStore((s) => s.ftueGrantAmount);
    const ftueGrantNonce = useStore((s) => s.ftueGrantNonce);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showObjective, setShowObjective] = useState(true);
    const [showMilestone, setShowMilestone] = useState(false);
    const [showGrant, setShowGrant] = useState(false);
    // The picker beats (place0/place2) get the canvas arrow; the
    // forced-upgrade beat's cue lives inside BuildSheet instead (its own
    // Upgrade button, not a pad) — never both cue kinds at once. Round E:
    // place2's target is ftueBeatPad, not a hardcoded pad 2 (store.ts) — it
    // may be any empty pad once the board isn't wide open.
    const canvasArrowPad = ftueBeat === 'place0' ? 0 : ftueBeat === 'place2' ? ftueBeatPad : null;
    // Only show the cue while its pad is STILL the selection — however the
    // player dismisses the sheet (Close, re-tapping the pad on the canvas,
    // the backdrop), the arrow disappears with it instead of lingering into
    // the next wave pointed at a pad that's no longer relevant.
    const activeArrowPad = canvasArrowPad !== null && selectedPad === canvasArrowPad ? canvasArrowPad : null;
    const arrowPos = usePadsScreenPos(activeArrowPad !== null ? [activeArrowPad] : [])[0] ?? null;
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
                        {/* Two opaque chips, not one translucent pill: the
                            number the player most needs (lives) was losing
                            to the board behind it. Lives turn red and pulse
                            below LIVES_DANGER; motion-safe: respects
                            prefers-reduced-motion for free. */}
                        <div
                            className={
                                'rounded-xl px-3 py-2 text-xl font-bold tabular-nums whitespace-nowrap ' +
                                (lives <= LIVES_DANGER
                                    ? 'bg-red-900 text-red-200 motion-safe:animate-pulse'
                                    : 'bg-surface text-white')
                            }
                        >
                            🚪 {lives}
                        </div>
                        <div className="rounded-xl bg-surface px-3 py-2 text-xl font-bold tabular-nums whitespace-nowrap text-white">
                            💵 {coins}
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

                {/* row 2: rush counter + speed, both shrink-proof */}
                <div className="flex items-center justify-between gap-2">
                    <div className="rounded-xl bg-black/55 px-3 py-1.5 text-[1.1rem] font-semibold tabular-nums whitespace-nowrap">
                        {wave > waveCount ? `Rush ${wave} · Overtime` : `Rush ${wave}/${waveCount}`}
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

            {/* Objective banner: states the goal and the fail consequence
                once per run, then fades — tap to dismiss early. Suppressed
                for as long as ANY forced FTUE beat is active — ftueBeat is
                the single source for this, covering all three cue kinds
                (canvas arrow, the pulse, AND BuildSheet's own Upgrade-button
                arrow, which Hud.tsx has no other visibility into) — plus
                the milestone banner and (round E) the general post-wave
                pulse, which by definition fires with ftueBeat already null,
                so only one thing speaks at a time (round 19's belt mistake:
                two cues teaching the same moment). In practice the
                objective banner's own 4s timer has long since expired by
                the time any beat past run start, or the earliest possible
                general pulse (wave 3+), fires in real play, but this keeps
                the guarantee exact rather than timing-dependent — a forced
                state-jump (or a future faster FTUE) shouldn't be able to
                stack them. */}
            {showObjective && ftueBeat === null && pulsePads.length === 0 && !showMilestone && (
                <div
                    className="pointer-events-auto absolute inset-x-0 top-20 flex justify-center px-6"
                    onClick={() => setShowObjective(false)}
                >
                    <p className="max-w-xs rounded-xl bg-black/70 px-4 py-2 text-center text-[1.05rem] font-semibold leading-snug">
                        Survive {waveCount} rushes. Run out of lives (🚪) and the shift ends.
                    </p>
                </div>
            )}

            {/* Campaign-milestone banner: the reward for reaching overtime,
                not an instruction — primary colour, not bg-black/70, so it
                reads distinct from the objective banner above. Suppressed
                while any forced FTUE beat is active (ftueBeat !== null) or
                the general post-wave pulse is showing, for the same
                one-voice rule; in practice unreachable together since the
                FTUE always completes well before wave 11 and a pulse clears
                the instant the next wave starts, but the guard is exact
                rather than timing-dependent. */}
            {showMilestone && ftueBeat === null && pulsePads.length === 0 && (
                <div
                    className="pointer-events-auto absolute inset-x-0 top-20 flex justify-center px-6"
                    onClick={() => setShowMilestone(false)}
                >
                    <p className="max-w-xs rounded-xl bg-primary px-4 py-2 text-center text-[1.05rem] font-semibold leading-snug text-black">
                        Full shift held. Everything from here is overtime — how far can you push it?
                    </p>
                </div>
            )}

            {/* Ready: bottom centre, out of the way of the build sheet. The
                real gate against starting a wave mid-beat is actions.ts's
                startWave() (one place); ftueBeat === null here just keeps
                this display rule in sync with it — without it Ready would
                flash visible during the post-wave-2 pulse, where
                selectedPad is briefly null before pad 2 auto-selects. */}
            {tdPhase === 'build' && selectedPad === null && ftueBeat === null && !menuOpen && (
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-safe-bottom">
                    {/* Round D: the FTUE now scripts every run through wave
                        3 (not just the first), so ftueActive covers waves
                        1-2 entirely and this hint's old wave 2-3 range is
                        dead — it can only ever fire once, at wave 4, the
                        first build phase after the script lets go. Kept:
                        it's a real reminder for a genuinely new mechanic
                        (upgrading) at the first moment nothing else is
                        cueing it. */}
                    {wave === 4 && (
                        <p className="mb-2 rounded-xl bg-black/55 px-3 py-2 text-lg font-bold">
                            Tap a cook to upgrade
                        </p>
                    )}
                    <button
                        type="button"
                        className="pointer-events-auto mb-3 rounded-2xl bg-primary px-14 py-4 text-2xl font-bold text-black shadow-lg transition-transform active:scale-95"
                        onClick={() => { sfx.startWave(); startWave(); }}
                    >
                        Ready!
                    </button>
                </div>
            )}

            {/* FTUE canvas arrow cue: points at the pad the script just
                forced a selection onto (pad 0 at run start, pad 2 after the
                wave-2 pulse). The forced-upgrade beat's cue is inside
                BuildSheet instead — see this file's header comment. */}
            {arrowPos && (
                <div
                    className="pointer-events-none absolute z-10 flex flex-col items-center"
                    style={{ left: arrowPos.x, top: arrowPos.y - 84, transform: 'translateX(-50%)' }}
                >
                    <span className="motion-safe:animate-bounce text-5xl leading-none">⬇️</span>
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
