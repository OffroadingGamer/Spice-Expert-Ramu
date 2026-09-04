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
 * stops the Pixi ticker) and offers music/sound mutes plus Main Menu. The
 * kit's plain "Paused" card is suppressed while it is open so the two
 * overlays never stack.
 */
import { useState } from 'react';
import { setMusicVolume, setSfxVolume, sfx, switchCue } from '../audio/audio.ts';
import { startWave } from '../game/actions.ts';
import { setAudioVolumes } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';

/** Levels restored when unmuting (seeded from the store defaults). */
let lastMusic = 0.6;
let lastSfx = 0.8;

function IconMusic({ muted }: { muted: boolean }) {
    return (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 17V4l11-2v13" />
            <circle cx="6" cy="17" r="3" />
            <circle cx="17" cy="15" r="3" />
            {muted && <line x1="3" y1="3" x2="21" y2="21" />}
        </svg>
    );
}

function IconSpeaker({ muted }: { muted: boolean }) {
    return (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4z" />
            {muted ? <line x1="3" y1="3" x2="21" y2="21" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7" />}
        </svg>
    );
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
    const [menuOpen, setMenuOpen] = useState(false);

    const musicMuted = musicVol <= 0;
    const sfxMuted = sfxVol <= 0;

    const applyVolumes = (music: number, sound: number) => {
        setMusicVolume(music);
        setSfxVolume(sound);
        setAudioVolumes(music, sound);
        store.patch({ musicVol: music, sfxVol: sound });
    };

    const toggleMusic = () => {
        if (musicMuted) applyVolumes(lastMusic || 0.6, sfxVol);
        else { lastMusic = musicVol; applyVolumes(0, sfxVol); }
    };

    const toggleSfx = () => {
        if (sfxMuted) { applyVolumes(musicVol, lastSfx || 0.8); sfx.click(); }
        else { lastSfx = sfxVol; applyVolumes(musicVol, 0); }
    };

    const openMenu = () => { sfx.click(); store.patch({ paused: true }); setMenuOpen(true); };
    const closeMenu = () => { sfx.click(); store.patch({ paused: false }); setMenuOpen(false); };

    return (
        <div className="pointer-events-none absolute inset-0 pt-safe-top">
            <div className="flex flex-col gap-2 px-3">
                {/* row 1: status + hamburger */}
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 rounded-xl bg-black/55 px-3 py-2 text-lg font-bold tabular-nums whitespace-nowrap">
                        🚪 {lives} · 💵 {coins}
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

            {/* Ready: bottom centre, out of the way of the build sheet */}
            {tdPhase === 'build' && selectedPad === null && !menuOpen && (
                <div className="absolute inset-x-0 bottom-0 flex justify-center px-3 pb-safe-bottom">
                    <button
                        type="button"
                        className="pointer-events-auto mb-3 rounded-2xl bg-primary px-14 py-4 text-2xl font-bold text-black shadow-lg transition-transform active:scale-95"
                        onClick={() => { sfx.startWave(); startWave(); }}
                    >
                        Ready!
                    </button>
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
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={musicMuted ? 'Unmute music' : 'Mute music'}
                                    aria-pressed={!musicMuted}
                                    className={
                                        'flex h-20 w-20 items-center justify-center rounded-full transition-transform active:scale-95 ' +
                                        (musicMuted ? 'bg-white/10 text-white/40' : 'bg-primary text-black')
                                    }
                                    onClick={toggleMusic}
                                >
                                    <IconMusic muted={musicMuted} />
                                </button>
                                <span className="text-[1.1rem] text-white/70">Music</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={sfxMuted ? 'Unmute sound' : 'Mute sound'}
                                    aria-pressed={!sfxMuted}
                                    className={
                                        'flex h-20 w-20 items-center justify-center rounded-full transition-transform active:scale-95 ' +
                                        (sfxMuted ? 'bg-white/10 text-white/40' : 'bg-primary text-black')
                                    }
                                    onClick={toggleSfx}
                                >
                                    <IconSpeaker muted={sfxMuted} />
                                </button>
                                <span className="text-[1.1rem] text-white/70">Sound</span>
                            </div>
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
