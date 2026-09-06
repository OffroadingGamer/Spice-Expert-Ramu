/**
 * TEST MODE — private, menu-gated grey-box belt (build-order item 4,
 * sim/kitchen.ts). Answers one question on real device: does the belt's
 * 1,600-unit serpentine travel read as runway or as waiting.
 *
 * Additive and isolated: owns its own Pixi app + local state, never reads or
 * writes the shared AppState beyond leaving the phase, never calls
 * leaderboard.ts (the belt's boards don't exist), ships no art.
 *
 * The TEST MODE entry button (MainMenu.tsx) is unconditional for now, by
 * instruction — remove or flag it before the next public deploy.
 */
import { useEffect, useRef, useState } from 'react';
import type { Application } from 'pixi.js';
import { createPixiApp } from '../game/pixiApp.ts';
import { createStage, type Stage } from '../game/stage.ts';
import { createKitchenScene, type Scene } from '../game/kitchenScene.ts';
import { KITCHEN_CONFIG } from '../game/kitchenConfig.ts';
import type { KitchenState } from '../game/sim/kitchen.ts';
import { store } from '../state/store.ts';

export default function TestBelt() {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const appRef = useRef<Application | null>(null);
    const [runId, setRunId] = useState(0);
    const [state, setState] = useState<KitchenState | null>(null);

    useEffect(() => {
        let disposed = false;
        let scene: Scene | null = null;
        let stage: Stage | null = null;
        (async () => {
            const app = await createPixiApp(hostRef.current!);
            if (disposed) {
                app.destroy({ removeView: true }, { children: true });
                return;
            }
            appRef.current = app;
            stage = createStage(app);
            scene = createKitchenScene(app, stage, (s) => setState({ ...s, dishes: s.dishes }));
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

    const remaining = state ? KITCHEN_CONFIG.shiftDishCount - state.served - state.walkouts - state.dishes.length : 0;

    return (
        <div className="absolute inset-0 bg-surface">
            <div key={runId} ref={hostRef} className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-3 pt-safe-top">
                <div className="rounded-xl bg-black/55 px-3 py-2 text-lg font-bold tabular-nums">
                    Served {state?.served ?? 0} · Walkouts {state?.walkouts ?? 0}/{KITCHEN_CONFIG.walkoutsAllowed}
                </div>
                <button
                    type="button"
                    className="pointer-events-auto rounded-xl bg-black/55 px-4 py-2 text-lg font-bold"
                    onClick={() => store.patch({ phase: 'menu' })}
                >
                    Exit
                </button>
            </div>
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
                            onClick={() => store.patch({ phase: 'menu' })}
                        >
                            Main Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
