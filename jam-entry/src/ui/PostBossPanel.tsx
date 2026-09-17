/**
 * Round 7 item 4 (docs/Ideas.md §6d, playtest of 1.77.0): the post-boss
 * "Congratulations" panel. Fires for exactly the build phase entered right
 * after a boss level clears — isBossLevel(wave - 1) (data/waves.ts, sealed;
 * only imported here, never edited) — which is the SAME boundary
 * towerScene.ts's block-transition code fires the district dialogue box on
 * (block.id changes at levels 11/21/…/81, the tick after a boss wave's
 * waveIndex increments). "Dialogue wins, panel on its close" needs no
 * separate plumbing because of that shared boundary: this hook's own
 * visibility already requires store.dialogue === null, so the panel simply
 * cannot show until any queued district box has been dismissed.
 *
 * Same render-time reset pattern as WaveBubble.tsx's useWaveBubble (see that
 * file's own doc comment for why a useEffect-keyed reset would leave a
 * one-frame window a screenshot could still catch stale state in): comparing
 * a ref to `wave` during render and calling the setter synchronously in that
 * branch, so a fresh wave always starts un-dismissed before anything paints.
 */
import { useEffect, useRef, useState } from 'react';
import { MANIFEST } from '../assets/manifest.ts';
import { sfx } from '../audio/audio.ts';
import { startWave } from '../game/actions.ts';
import { blockForLevel } from '../game/data/blocks.ts';
import { isBossLevel } from '../game/data/waves.ts';
import { useStore } from '../state/store.ts';

// Reuses the manifest's own alias->src entries — WaveBubble.tsx's own
// pattern, duplicated per file rather than shared (see that file's comment).
const ASSET_SRC = new Map(
    MANIFEST.bundles.flatMap((b) => b.assets).map((a) => [a.alias as string, a.src as string])
);

function titleCase(slug: string): string {
    return slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

export interface PostBossPanelState {
    visible: boolean;
    /** The block just finished — the one the boss just cleared belonged to. */
    finishedLabel: string;
    /** The block just entered — whose dishes are previewed below. */
    upcomingLabel: string;
    dishes: Array<{ slug: string; name: string; icon: string | undefined }>;
    /** READY inside the panel: closes it AND starts the wave. */
    ready: () => void;
    /** Tap outside: closes the panel, inline Ready takes over. */
    dismiss: () => void;
}

export function usePostBossPanel(): PostBossPanelState {
    const wave = useStore((s) => s.wave);
    const tdPhase = useStore((s) => s.tdPhase);
    const dialogue = useStore((s) => s.dialogue);
    const selectedPad = useStore((s) => s.selectedPad);
    const ftueBeat = useStore((s) => s.ftueBeat);
    const [dismissed, setDismissed] = useState(false);

    const prevWaveRef = useRef(wave);
    let dismissedNow = dismissed;
    if (prevWaveRef.current !== wave) {
        prevWaveRef.current = wave;
        dismissedNow = false;
        setDismissed(false);
    }

    const visible = isBossLevel(wave - 1)
        && tdPhase === 'build'
        && selectedPad === null
        && ftueBeat === null
        && dialogue === null
        && !dismissedNow;

    const upcoming = blockForLevel(wave);
    // blockForLevel(0) (wave 1, run start — never a boss-follow wave, so
    // never actually shown) would index BLOCKS[-1] and throw; clamp to 1
    // rather than let a value only ever read while invisible crash render.
    const finished = blockForLevel(Math.max(1, wave - 1));
    const seen = new Set<string>();
    const dishes: PostBossPanelState['dishes'] = [];
    for (const slugs of Object.values(upcoming.dishes)) {
        for (const slug of slugs) {
            if (seen.has(slug)) continue;
            seen.add(slug);
            dishes.push({ slug, name: titleCase(slug), icon: ASSET_SRC.get(`dish-${slug}`) });
        }
    }

    return {
        visible,
        finishedLabel: finished.label,
        upcomingLabel: upcoming.label,
        dishes,
        ready: () => { sfx.startWave(); startWave(); setDismissed(true); },
        dismiss: () => setDismissed(true),
    };
}

export default function PostBossPanel({ state }: { state: PostBossPanelState }) {
    const panelRef = useRef<HTMLDivElement>(null);

    // Same outside-tap-closes pattern as WaveBubbleSubmenu (WaveBubble.tsx):
    // a document-level listener, not an onPointerDown on the (pointer-events-
    // none) overlay wrapper itself, which a real tap would never reach.
    useEffect(() => {
        if (!state.visible) return;
        const onPointerDown = (e: PointerEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                state.dismiss();
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.visible]);

    if (!state.visible) return null;

    return (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-3">
            {/* Dialogue-box styling: rounded-2xl bg-black/80, no new art. */}
            <div ref={panelRef} className="pointer-events-auto w-full max-w-md rounded-2xl bg-black/80 p-5 text-center">
                <h3 className="text-xl font-bold text-primary">Congratulations!</h3>
                <p className="mt-1 text-[0.95rem] text-white/80">
                    {state.finishedLabel} shift complete. {state.upcomingLabel} awaits.
                </p>
                <p className="mt-4 text-[0.68rem] font-bold tracking-wide text-white/55 uppercase">Upcoming dishes</p>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                    {state.dishes.map((d) => (
                        <span key={d.slug} className="flex flex-col items-center gap-1">
                            <img
                                src={d.icon}
                                alt=""
                                className="h-12 w-12 rounded-full border border-black/40 bg-surface object-contain"
                            />
                            <span className="max-w-[4rem] truncate text-[0.62rem] font-semibold text-white/85">{d.name}</span>
                        </span>
                    ))}
                </div>
                <button
                    type="button"
                    className="mt-5 w-full rounded-2xl bg-primary px-10 py-4 text-xl font-bold text-black shadow-lg transition-transform active:scale-95"
                    onClick={state.ready}
                >
                    Ready!
                </button>
            </div>
        </div>
    );
}
