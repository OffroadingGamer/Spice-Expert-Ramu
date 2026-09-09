/**
 * In-game HUD: a React overlay above the Pixi canvas.
 *
 * Pattern to keep: the overlay itself is pointer-events-none so taps fall
 * through to the canvas (pad selection lives there); each interactive
 * control opts back in with pointer-events-auto.
 *
 * LAYOUT CONTRACT (portrait, phone-first):
 *   row 1        status chip (walkouts, cash) left, hamburger right
 *   row 2        rush counter left, speed buttons right, both nowrap
 *   bottom       "Ready!" centred, hidden while the build sheet is open
 *                (BuildSheet is also inset-x-0 bottom-0, so they must never
 *                coexist) and hidden while the shift menu is open
 * Every edge uses px-3 plus safe-area padding: nothing touches a screen
 * edge, and the speed row shrinks rather than overflowing.
 *
 * The hamburger opens the shift menu, which pauses the run (store.paused
 * stops the Pixi ticker) and offers continuous music/sound sliders plus
 * Main Menu. The kit's plain "Paused" card is suppressed while it is open
 * so the two overlays never stack.
 *
 * Round A (Challenge-mode FTUE, GDD §10.11): a one-time objective banner
 * fires per run (keyed on runId — Retry counts as a new run), the 🚪 chip is
 * labelled, and while `ftueActive` the pad-0/pad-2 forced selections get an
 * arrow cue pointing at the live pad on the Pixi canvas below — computed
 * from CONFIG.pads + the same width-fit/board-centering transform stage.ts
 * and towerScene.ts use, read here but never written.
 */
import { useEffect, useState } from 'react';
import { setMusicVolume, setSfxVolume, sfx, switchCue } from '../audio/audio.ts';
import { startWave } from '../game/actions.ts';
import { CONFIG } from '../game/config.ts';
import { DESIGN_WIDTH } from '../game/stage.ts';
import { setAudioVolumes } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';
import Slider from './Slider.tsx';

/** Live screen position of a pad, tracking the canvas's own width-fit +
 *  board-centering transform (stage.ts / towerScene.ts's anchorBoard). */
function usePadScreenPos(padIndex: number | null): { x: number; y: number } | null {
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
    useEffect(() => {
        if (padIndex === null) { setPos(null); return; }
        const frame = document.getElementById('app-frame');
        if (!frame) return;
        const compute = () => {
            const rect = frame.getBoundingClientRect();
            const scale = rect.width / DESIGN_WIDTH;
            const designHeight = rect.height / scale;
            const boardRootY = Math.max(0, (designHeight - CONFIG.boardHeight) / 2);
            const pad = CONFIG.pads[padIndex];
            setPos({ x: pad.x * scale, y: (pad.y + boardRootY) * scale });
        };
        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(frame);
        return () => ro.disconnect();
    }, [padIndex]);
    return pos;
}

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
    const ftueActive = useStore((s) => s.ftueActive);
    const ftueArrowPad = useStore((s) => s.ftueArrowPad);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showObjective, setShowObjective] = useState(true);
    const [showMilestone, setShowMilestone] = useState(false);
    // Only show the cue while its pad is STILL the selection — however the
    // player dismisses the sheet (Close, re-tapping the pad on the canvas,
    // the backdrop), the arrow disappears with it instead of lingering into
    // the next wave pointed at a pad that's no longer relevant.
    const activeArrowPad = ftueArrowPad !== null && selectedPad === ftueArrowPad ? ftueArrowPad : null;
    const arrowPos = usePadScreenPos(activeArrowPad);

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
                    <div className="min-w-0 rounded-xl bg-black/55 px-3 py-2 text-lg font-bold tabular-nums whitespace-nowrap">
                        🚪 {lives} lives · 💵 {coins}
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

            {/* Objective banner: states the goal and the fail consequence
                once per run, then fades — tap to dismiss early. Suppressed
                once the FTUE arrow cue or the milestone banner is up, so
                only one thing speaks at a time (round 19's belt mistake:
                two cues teaching the same moment). In practice the arrow
                never appears this early (it only fires at wave-1-end) and
                the milestone never fires this early either (wave 1 !==
                waveCount + 1), but this keeps the guarantee exact rather
                than timing-dependent. */}
            {showObjective && activeArrowPad === null && !showMilestone && (
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
                while the FTUE arrow cue is up (activeArrowPad === null) for
                the same one-voice rule; in practice unreachable together
                since the FTUE always completes well before wave 11, but the
                guard is exact rather than timing-dependent. */}
            {showMilestone && activeArrowPad === null && (
                <div
                    className="pointer-events-auto absolute inset-x-0 top-20 flex justify-center px-6"
                    onClick={() => setShowMilestone(false)}
                >
                    <p className="max-w-xs rounded-xl bg-primary px-4 py-2 text-center text-[1.05rem] font-semibold leading-snug text-black">
                        Full shift held. Everything from here is overtime — how far can you push it?
                    </p>
                </div>
            )}

            {/* Ready: bottom centre, out of the way of the build sheet */}
            {tdPhase === 'build' && selectedPad === null && !menuOpen && (
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-safe-bottom">
                    {/* The FTUE's arrow cue replaces this hint outright — one
                        thing speaking at a time (round 19's belt mistake). */}
                    {wave >= 2 && wave <= 4 && !ftueActive && (
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

            {/* FTUE arrow cue: points at the pad the script just forced a
                selection onto (pad 0 after wave 1, pad 2 after wave 2). */}
            {arrowPos && (
                <div
                    className="pointer-events-none absolute z-10 flex flex-col items-center"
                    style={{ left: arrowPos.x, top: arrowPos.y - 84, transform: 'translateX(-50%)' }}
                >
                    <span className="animate-bounce text-5xl leading-none">⬇️</span>
                </div>
            )}

            {/* Shift menu. Backdrop tap closes it. */}
            {menuOpen && (
                <div
                    className="pointer-events-auto absolute inset-0 z-20 flex flex-col items-center justify-center gap-10 bg-black/75 px-6 pt-safe-top pb-safe-bottom"
                    onClick={closeMenu}
                >
                    <div className="flex flex-col items-center gap-8" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-primary">Shift paused</h2>
                        <div className="flex flex-col gap-5">
                            <Slider label="Music" value={musicVol} onChange={(v) => applyVolumes(v, sfxVol)} />
                            <Slider
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
