/**
 * React ↔ Pixi boundary. React owns WHEN the game exists (mount/unmount with
 * the 'playing' phase); Pixi owns everything inside the canvas. No React
 * state flows in per-frame — game → UI communication goes through the store.
 *
 * StrictMode-safe: dev double-mount is handled by the `disposed` flag (the
 * first mount's async init resolves, sees it was cancelled, and destroys its
 * app before the second mount's app appears).
 *
 * Cold-boot blocker round: this used to await createPixiApp() in a plain
 * async IIFE with no .catch() — a rejected app.init() (WebGL context
 * creation racing a host that hasn't settled its size yet: an iframe in the
 * RUN host, or dvw/dvh still resolving on mobile) was swallowed completely.
 * No scene, no registerEngine(), no error — just a permanently black canvas,
 * on the ONE path every mobile player takes (boot lands straight in
 * Challenge Mode). attempt() below retries a few times with a growing delay
 * (the host is often just not ready YET, not broken) and, if every attempt
 * still fails, surfaces a visible retry affordance instead of a silent dead
 * canvas. Every failure is also tracked so it shows up in analytics rather
 * than only a console nobody on a phone ever opens.
 */
import { useEffect, useRef, useState } from 'react';
import type { Application } from 'pixi.js';
import { createPixiApp } from './pixiApp.ts';
import { createStage, type Stage } from './stage.ts';
import { createTowerScene, type Scene } from './towerScene.ts';
import { store, useStore } from '../state/store.ts';
import { track } from '../sdk/analytics.ts';

/** Retry schedule for a failed app.init(): short and growing, on the theory
 *  that the host just isn't sized yet rather than being truly broken. Both
 *  retunable in one place. */
const MAX_INIT_ATTEMPTS = 4;
const INIT_RETRY_DELAYS_MS = [300, 600, 1200];

export default function GameCanvas() {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const appRef = useRef<Application | null>(null);
    const paused = useStore((s) => s.paused);
    const [initFailed, setInitFailed] = useState(false);
    const [retryNonce, setRetryNonce] = useState(0);

    useEffect(() => {
        let disposed = false;
        let scene: Scene | null = null;
        let stage: Stage | null = null;
        let retryTimer: ReturnType<typeof setTimeout> | null = null;
        let resizeObserver: ResizeObserver | null = null;

        const attempt = async (n: number) => {
            try {
                // hostRef is always attached by the time the effect runs.
                const app = await createPixiApp(hostRef.current!);
                if (disposed) {
                    app.destroy({ removeView: true }, { children: true });
                    return;
                }
                appRef.current = app;
                // Design-resolution stage: scenes position in design units, not
                // pixels, so layout is proportional on every device (stage.ts).
                stage = createStage(app);
                scene = createTowerScene(app, stage);
                // Respect a pause that landed while the canvas was initializing.
                if (store.get().paused) app.ticker.stop();
                setInitFailed(false);

                // Cold-boot blocker: Pixi's resizeTo only reacts to WINDOW
                // resize events (see pixiApp.ts / stage.ts's own comment),
                // never to the host element's own later resize — an iframe
                // host that settles its size after this point would
                // otherwise stay locked to whatever (possibly zero) size it
                // had at init. Same ResizeObserver-on-the-host pattern
                // StationRail.tsx's useRailWidthPx uses; app.resize() feeds
                // the renderer's own 'resize' event, which stage.ts's
                // layout() is already subscribed to.
                resizeObserver = new ResizeObserver(() => app.resize());
                resizeObserver.observe(hostRef.current!);
                app.resize();
            } catch (err) {
                if (disposed) return;
                console.error(`[GameCanvas] init failed (attempt ${n + 1}/${MAX_INIT_ATTEMPTS})`, err);
                track('error_occurred', { source: 'game_canvas_init', attempt: n + 1 });
                if (n + 1 < MAX_INIT_ATTEMPTS) {
                    const delay = INIT_RETRY_DELAYS_MS[n] ?? INIT_RETRY_DELAYS_MS[INIT_RETRY_DELAYS_MS.length - 1];
                    retryTimer = setTimeout(() => { if (!disposed) void attempt(n + 1); }, delay);
                } else {
                    setInitFailed(true);
                }
            }
        };
        void attempt(0);

        return () => {
            disposed = true;
            if (retryTimer) clearTimeout(retryTimer);
            resizeObserver?.disconnect();
            try { scene?.destroy(); } catch { /* scene already torn down */ }
            try { stage?.destroy(); } catch { /* stage already torn down */ }
            if (appRef.current) {
                appRef.current.destroy({ removeView: true }, { children: true });
                appRef.current = null;
            }
        };
    }, [retryNonce]);

    // Host lifecycle pause/resume → freeze/unfreeze the whole ticker.
    useEffect(() => {
        const app = appRef.current;
        if (!app) return;
        if (paused) app.ticker.stop();
        else app.ticker.start();
    }, [paused]);

    return (
        <div ref={hostRef} className="absolute inset-0">
            {initFailed && (
                <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface px-8 text-center">
                    <p className="text-lg font-bold text-white">The kitchen didn't load.</p>
                    <button
                        type="button"
                        className="rounded-2xl bg-primary px-8 py-3 text-lg font-bold text-black transition-transform active:scale-95"
                        onClick={() => { setInitFailed(false); setRetryNonce((v) => v + 1); }}
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
