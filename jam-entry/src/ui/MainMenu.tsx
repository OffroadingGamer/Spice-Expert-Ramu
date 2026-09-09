/**
 * Main menu. The title is sized from the frame width so it always fits on
 * one line; buttons in a stack share one width. The Like/Comments row only
 * renders once the host confirms those prompts are available (engagement.ts).
 */
import { useEffect } from 'react';
import { sfx } from '../audio/audio.ts';
import { openComments, promptLike } from '../sdk/engagement.ts';
import { trackFunnelStep } from '../sdk/analytics.ts';
import { devModeEnabled } from '../state/devMode.ts';
import { store, useStore } from '../state/store.ts';
import GemCounter from './GemCounter.tsx';

export default function MainMenu() {
    const bestWave = useStore((s) => s.bestWave);
    const likeAvailable = useStore((s) => s.likeAvailable);
    const commentsAvailable = useStore((s) => s.commentsAvailable);
    const isLiked = useStore((s) => s.isLiked);
    // Round A2, task 4: Test Mode is unfinished and was the public menu's
    // primary CTA — gated behind ?test=1 (devMode.ts) until it's ready.
    // When hidden, Challenge Mode takes the primary styling so the public
    // menu still has one clear call to action.
    const showTestMode = devModeEnabled();

    // fires once per mount, i.e. every time phase transitions into 'menu'
    useEffect(() => {
        trackFunnelStep(1, 'menu_shown', 'run', 2);
    }, []);

    return (
        <div className="relative flex h-full flex-col items-center justify-center gap-4 px-10">
            <div
                className="absolute right-5 top-5 flex items-center gap-2"
                style={{ marginTop: 'var(--safe-top)' }}
            >
                <GemCounter />
                <button
                    type="button"
                    aria-label="Settings"
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl transition-transform active:scale-95"
                    onClick={() => {
                        sfx.click();
                        store.patch({ settingsOpen: true });
                    }}
                >
                    ⚙
                </button>
            </div>
            {/* ADAPT: game title + tagline. textLength forces exact glyph
                width in viewBox units so the title can never overflow. */}
            <svg viewBox="0 0 300 96" className="w-full max-w-[88%]" role="img" aria-label="Spice Expert: Ramu">
                <text x="150" y="34" textAnchor="middle" textLength="270" lengthAdjust="spacingAndGlyphs"
                      fontSize="34" fontWeight="800" fill="var(--color-primary)">SPICE EXPERT</text>
                <text x="150" y="86" textAnchor="middle" textLength="200" lengthAdjust="spacingAndGlyphs"
                      fontSize="52" fontWeight="800" fill="#ffffff">RAMU</text>
            </svg>
            {bestWave > 0 && (
                <div className="rounded-xl bg-white/5 px-6 py-3 text-[1.1rem] font-semibold text-white/80 tabular-nums">
                    Best shift: rush {bestWave}
                </div>
            )}
            {showTestMode && (
                <button
                    type="button"
                    className="w-64 rounded-2xl bg-primary px-12 py-4 text-xl font-bold text-black shadow-lg transition-transform active:scale-95"
                    onClick={() => {
                        sfx.click();
                        store.patch({ phase: 'testbelt' });
                    }}
                >
                    Play Game
                </button>
            )}
            <button
                type="button"
                className={
                    'w-64 rounded-2xl px-12 py-4 text-xl font-bold shadow-lg transition-transform active:scale-95 ' +
                    (showTestMode ? 'bg-slate-600 text-white' : 'bg-primary text-black')
                }
                onClick={() => {
                    sfx.click();
                    // GDD §10.11 (round D): the scripted three-wave FTUE is
                    // persistent — every run enters scripted, not just the
                    // player's first. save.ftue.challengeDone no longer
                    // gates entry (actions.ts's startWave still calls
                    // completeFtue() when wave 3 begins — it's the hook for
                    // a later behaviour-based toggle, not a gate today).
                    store.patch({
                        phase: 'playing',
                        selectedPad: 0,
                        runId: store.get().runId + 1,
                        ftueActive: true,
                        ftueBeat: 'place0',
                        pulsePads: null,
                    });
                }}
            >
                Challenge Mode
            </button>
            <button
                type="button"
                className="w-64 rounded-2xl bg-sky-600 px-12 py-4 text-xl font-bold text-white shadow-lg transition-transform active:scale-95"
                onClick={() => {
                    sfx.click();
                    store.patch({ metaOpen: true });
                }}
            >
                The Kitchen
            </button>
            <button
                type="button"
                className="w-64 rounded-2xl bg-violet-600 px-12 py-4 text-xl font-bold text-white shadow-lg transition-transform active:scale-95"
                onClick={() => {
                    sfx.click();
                    store.patch({ ranksOpen: true });
                }}
            >
                Ranks
            </button>
            <div className="text-center text-[1.1rem] leading-7 text-white/50">
                Tap a station to place a utensil
                <br />
                Don&apos;t let any walk-outs happen!
            </div>
            {(likeAvailable || commentsAvailable) && (
                <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3 pb-safe-bottom">
                    {likeAvailable && (
                        isLiked ? (
                            <span className="rounded-xl bg-white/5 px-5 py-3 text-[1.1rem] font-semibold text-primary">
                                ♥ Liked
                            </span>
                        ) : (
                            <button
                                type="button"
                                className="rounded-xl bg-white/10 px-5 py-3 text-[1.1rem] font-semibold text-white/85 transition-transform active:scale-95"
                                onClick={() => { sfx.click(); promptLike(); }}
                            >
                                ♥ Like
                            </button>
                        )
                    )}
                    {commentsAvailable && (
                        <button
                            type="button"
                            className="rounded-xl bg-white/10 px-5 py-3 text-[1.1rem] font-semibold text-white/85 transition-transform active:scale-95"
                            onClick={() => { sfx.click(); openComments(); }}
                        >
                            💬 Comments
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
