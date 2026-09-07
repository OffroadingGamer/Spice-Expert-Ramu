/**
 * TEST MODE — private, menu-gated grey-box belt (build-order item 4,
 * sim/kitchen.ts). Answers one question on real device: does the belt's
 * 1,600-unit serpentine travel read as runway or as waiting.
 *
 * Additive and isolated: owns its own Pixi app + local state, never reads or
 * writes the shared AppState beyond `phase`/`paused`/the audio volumes
 * (already-existing fields), never calls leaderboard.ts (the belt's boards
 * don't exist), ships grey-box art plus five demo-tier UI sprites
 * (KitchenMode.md §2.6 — private-build only, licence not cleared for public).
 *
 * The TEST MODE entry button (MainMenu.tsx) is unconditional for now, by
 * instruction — remove or flag it before the next public deploy.
 *
 * The shift menu below is a DUPLICATE of Hud.tsx's — extracting it would
 * violate "move nothing that already exists" (Hud.tsx's menu is inline
 * markup, not a component). A fix to one does not automatically reach the
 * other; note it in any future change that touches both (same accepted
 * pattern as the duplicated engine tick loop, KitchenMode.md §2.5).
 */
import { useEffect, useRef, useState } from 'react';
import type { Application } from 'pixi.js';
import { setMusicVolume, setSfxVolume, sfx, switchCue } from '../audio/audio.ts';
import { createPixiApp } from '../game/pixiApp.ts';
import { createKitchenStage, type KitchenStage } from '../game/kitchenStage.ts';
import { createKitchenScene, type Scene } from '../game/kitchenScene.ts';
import { KITCHEN_CONFIG } from '../game/kitchenConfig.ts';
import type { KitchenState } from '../game/sim/kitchen.ts';
import { setAudioVolumes } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';

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

let lastMusic = 0.6;
let lastSfx = 0.8;

export default function TestBelt() {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const appRef = useRef<Application | null>(null);
    const [runId, setRunId] = useState(0);
    const [state, setState] = useState<KitchenState | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const paused = useStore((s) => s.paused);
    const musicVol = useStore((s) => s.musicVol);
    const sfxVol = useStore((s) => s.sfxVol);
    const musicMuted = musicVol <= 0;
    const sfxMuted = sfxVol <= 0;

    useEffect(() => {
        let disposed = false;
        let scene: Scene | null = null;
        let stage: KitchenStage | null = null;
        (async () => {
            const app = await createPixiApp(hostRef.current!);
            if (disposed) {
                app.destroy({ removeView: true }, { children: true });
                return;
            }
            appRef.current = app;
            stage = createKitchenStage(app);
            scene = await createKitchenScene(app, stage, (s) => setState(s));
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
            try { scene?.destroy(); } catch { /* scene already torn down */ }
            try { stage?.destroy(); } catch { /* stage already torn down */ }
            if (appRef.current) {
                appRef.current.destroy({ removeView: true }, { children: true });
                appRef.current = null;
            }
        };
    }, [runId]);

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
    const toggleMusic = () => {
        sfx.click();
        if (musicMuted) applyVolumes(lastMusic || 0.6, sfxVol);
        else { lastMusic = musicVol; applyVolumes(0, sfxVol); }
    };
    const toggleSfx = () => {
        if (sfxMuted) { applyVolumes(musicVol, lastSfx || 0.8); sfx.click(); }
        else { lastSfx = sfxVol; applyVolumes(musicVol, 0); }
    };
    const openMenu = () => { sfx.click(); store.patch({ paused: true }); setMenuOpen(true); };
    const closeMenu = () => { sfx.click(); store.patch({ paused: false }); setMenuOpen(false); };
    const toMainMenu = () => {
        sfx.click();
        switchCue('menu');
        setMenuOpen(false);
        store.patch({ paused: false, phase: 'menu' });
    };

    const remaining = state
        ? KITCHEN_CONFIG.shiftDishCount - state.served - state.walkouts - state.dishes.length
        : 0;

    return (
        <div className="absolute inset-0 bg-surface">
            <div key={runId} ref={hostRef} className="absolute inset-0" />

            {/* Hamburger: centre bottom, replaces the old Exit button. */}
            {!menuOpen && (
                <button
                    type="button"
                    aria-label="Shift menu"
                    className="pointer-events-auto absolute left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-xl bg-black/55 transition-transform active:scale-95"
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

            {state && state.phase !== 'running' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/70">
                    <p className="text-3xl font-bold">
                        {state.phase === 'won' ? 'Shift cleared' : 'Too many walkouts'}
                    </p>
                    <p className="text-lg text-white/70">
                        {remaining} pending · {state.served} served · {state.walkouts} walked out
                    </p>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="rounded-2xl bg-primary px-8 py-3 text-xl font-bold text-black"
                            onClick={() => setRunId((n) => n + 1)}
                        >
                            Run Again
                        </button>
                        <button
                            type="button"
                            className="rounded-2xl bg-white/15 px-8 py-3 text-xl font-bold text-white"
                            onClick={toMainMenu}
                        >
                            Main Menu
                        </button>
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
