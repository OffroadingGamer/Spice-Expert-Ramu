/**
 * Round 4 Part E (docs/Ideas.md §6d/§7, Sep 16 2026): a chat bubble over
 * Ramu carrying the upcoming wave's dish icons, tap -> a scroll-styled
 * submenu with the full roster (name/toughness/bounty/count). Two
 * presentational halves (WaveBubbleTrigger, WaveBubbleSubmenu) sharing one
 * hook (useWaveBubble) so Hud.tsx can mount them in two different places —
 * the trigger inline next to #chef-head-button (row 2), the submenu in its
 * own row between that row and the speed row — without lifting this into
 * the global store.
 *
 * Data path, exactly §7's: waveAt(index).entries[].enemy -> archetype ->
 * blockForLevel(level).dishes[archetype] slugs -> dish-<slug> aliases
 * already in the manifest, deduped by slug. store.wave already equals the
 * UPCOMING level during a build phase (actions.ts's syncStore mirrors
 * engine.state.waveIndex + 1 regardless of phase), so none of this needs
 * towerScene.ts's engine instance directly.
 */
import { useEffect, useRef, useState } from 'react';
import { MANIFEST } from '../assets/manifest.ts';
import { CONFIG } from '../game/config.ts';
import { blockForLevel } from '../game/data/blocks.ts';
import { enemyDef } from '../game/data/enemies.ts';
import { waveAt, type WaveEntry } from '../game/data/waves.ts';
import { useStore } from '../state/store.ts';

// Reuses the manifest's own alias->src entries (ChefPortrait.tsx/
// PropPicker.tsx/TestBelt.tsx's own pattern) rather than hard-coding image
// paths a second time here. Plain <img>/background-image consumers, so —
// unlike ChefPortrait's Pixi-cache-gated layers — no readiness check is
// needed: the browser loads the URL on its own schedule.
const ASSET_SRC = new Map(
    MANIFEST.bundles.flatMap((b) => b.assets).map((a) => [a.alias as string, a.src as string])
);

const MAX_BUBBLE_ICONS = 3;

interface DishRow {
    slug: string;
    name: string;
    icon: string | undefined;
    pips: number;
    bounty: number;
    count: number;
}

function titleCase(slug: string): string {
    return slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

/** Mirrors sim/engine.ts:628's bountyMult rule — sealed, never imported
 *  (the handover's own instruction) — the per-kill payout cut that kicks in
 *  from CONFIG.economy.lateEconomy.fromLevel. */
function bountyMultAt(level: number): number {
    return level < CONFIG.economy.lateEconomy.fromLevel ? 1 : CONFIG.economy.lateEconomy.bountyMult;
}

export interface WaveBubbleState {
    /** The small icon+count trigger next to #chef-head-button. */
    showTrigger: boolean;
    /** The unrolled scroll panel. */
    showSubmenu: boolean;
    rows: DishRow[];
    totalCount: number;
    /** Trigger tap: opens the submenu. */
    open: () => void;
    /** Submenu outside-tap: closes it AND dismisses the bubble for the rest
     *  of this build phase — "the player taps it" (the handover's own
     *  bubble-dismiss condition) covers a tap that opened the submenu, so
     *  closing it again must not resurrect the trigger. */
    close: () => void;
}

export function useWaveBubble(): WaveBubbleState {
    const tdPhase = useStore((s) => s.tdPhase);
    const wave = useStore((s) => s.wave);
    const dialogue = useStore((s) => s.dialogue);
    const [dismissed, setDismissed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // A new build phase (a new upcoming wave) always starts fresh — "stays
    // until the wave starts or the player taps it," so the previous wave's
    // tap/dismiss must never bleed into the next one.
    useEffect(() => {
        setDismissed(false);
        setIsOpen(false);
    }, [wave]);

    const level = wave;
    const waveData = waveAt(level - 1);
    const block = blockForLevel(level);
    const bountyMult = bountyMultAt(level);
    const effectiveHp = (e: WaveEntry) => enemyDef(e.enemy).hp * (e.hpMult ?? waveData.hpMult ?? 1);
    const maxEffectiveHp = Math.max(...waveData.entries.map(effectiveHp));

    const seen = new Set<string>();
    const rows: DishRow[] = [];
    for (const entry of waveData.entries) {
        for (const slug of block.dishes[entry.enemy] ?? []) {
            if (seen.has(slug)) continue;
            seen.add(slug);
            const pips = Math.min(5, Math.max(1, Math.ceil((5 * effectiveHp(entry)) / maxEffectiveHp)));
            rows.push({
                slug,
                name: titleCase(slug),
                icon: ASSET_SRC.get(`dish-${slug}`),
                pips,
                bounty: Math.round(enemyDef(entry.enemy).bounty * bountyMult),
                count: entry.count,
            });
        }
    }
    const totalCount = waveData.entries.reduce((s, e) => s + e.count, 0);

    // Dialogue wins: waiting (not permanently dismissed) behind an open box
    // — "the bubble waits until the box closes." Wave start (tdPhase leaves
    // 'build') also hides both halves; the wave-keyed effect above resets
    // everything fresh for the NEXT build phase. baseVisible gates BOTH
    // halves; dismissed/isOpen then split which of the two (if either) is
    // showing — dismissed must never suppress the submenu itself (only the
    // trigger returning after a close), which is what an earlier version of
    // this hook got wrong by folding both into one visible flag.
    const baseVisible = tdPhase === 'build' && dialogue === null;

    return {
        showTrigger: baseVisible && !dismissed && !isOpen,
        showSubmenu: baseVisible && isOpen,
        rows,
        totalCount,
        open: () => setIsOpen(true),
        close: () => { setIsOpen(false); setDismissed(true); },
    };
}

/** The chat bubble over Ramu — up to 3 distinct dish icons (then a +n
 *  badge) and the wave's total unit count. Mounted inline right after
 *  #chef-head-button in Hud.tsx's own row 2, so "anchored to the right of
 *  #chef-head-button" falls out of plain DOM flow — no runtime measurement
 *  (the arrow-round lesson StationRail.tsx's own doc argues from: getBoundingClientRect/
 *  ResizeObserver cue positioning has failed on device three rounds running). */
export function WaveBubbleTrigger({ state }: { state: WaveBubbleState }) {
    if (!state.showTrigger) return null;
    const shown = state.rows.slice(0, MAX_BUBBLE_ICONS);
    const extra = state.rows.length - shown.length;
    return (
        <button
            type="button"
            aria-label="Upcoming wave"
            onClick={state.open}
            className="pointer-events-auto relative flex shrink-0 items-center gap-1 rounded-2xl bg-black/80 py-1.5 pr-2.5 pl-3 active:scale-95"
        >
            {/* Tail toward #chef-head-button, on the bubble's own left edge. */}
            <span
                aria-hidden="true"
                className="absolute top-1/2 -left-[5px] h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-black/80"
            />
            <span className="flex -space-x-1.5">
                {shown.map((row) => (
                    <img
                        key={row.slug}
                        src={row.icon}
                        alt=""
                        className="h-6 w-6 rounded-full border border-black/40 bg-surface object-contain"
                    />
                ))}
            </span>
            {extra > 0 && <span className="text-[0.68rem] font-bold text-white/80">+{extra}</span>}
            <span className="ml-0.5 text-[0.72rem] font-bold text-white">{state.totalCount}</span>
        </button>
    );
}

/** The scroll submenu — its own row directly under the WAVE/RUSH + speed
 *  row (Round 4 Part D vacates the ServiceGauge bar's old slot there), one
 *  row per distinct dish. Closes on tap outside WITHOUT consuming the tap
 *  (a document-level pointerdown check, not a modal backdrop) — "never
 *  blocks pad placement or the rail" means the same tap that dismisses this
 *  must still land on whatever pad/rail button is underneath it. */
export function WaveBubbleSubmenu({ state }: { state: WaveBubbleState }) {
    const panelRef = useRef<HTMLDivElement>(null);
    const [unrolled, setUnrolled] = useState(false);

    useEffect(() => {
        if (!state.showSubmenu) { setUnrolled(false); return; }
        const raf = requestAnimationFrame(() => setUnrolled(true));
        return () => cancelAnimationFrame(raf);
    }, [state.showSubmenu]);

    useEffect(() => {
        if (!state.showSubmenu) return;
        const onPointerDown = (e: PointerEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                state.close();
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.showSubmenu]);

    if (!state.showSubmenu) return null;

    return (
        <div
            ref={panelRef}
            className="pointer-events-auto relative overflow-hidden rounded-xl transition-[clip-path] duration-[350ms] ease-out motion-reduce:duration-[0ms]"
            style={{
                backgroundImage: `url(${ASSET_SRC.get('ui-scroll')})`,
                backgroundSize: '100% 100%',
                clipPath: unrolled ? 'inset(0)' : 'inset(0 100% 0 0)',
            }}
        >
            <div className="flex flex-col gap-1 p-3">
                {state.rows.map((row) => (
                    <div key={row.slug} className="flex items-center gap-2 text-[0.72rem] font-bold text-black">
                        <img src={row.icon} alt="" className="h-7 w-7 shrink-0 object-contain" />
                        <span className="min-w-0 flex-1 truncate">{row.name}</span>
                        <span aria-label={`toughness ${row.pips} of 5`} className="shrink-0 tracking-tighter">
                            {'●'.repeat(row.pips)}{'○'.repeat(5 - row.pips)}
                        </span>
                        <span className="shrink-0 tabular-nums">🪙{row.bounty}</span>
                        <span className="shrink-0 tabular-nums">×{row.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
