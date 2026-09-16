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
 * Round 5 (playtest of 1.75.0): four fixes folded in, each noted at its own
 * site below —
 *   A. Trigger icons grew 24 -> 40px, each with its recipe name underneath.
 *   B. The submenu is a closed-by-default GRID (not an always-open list):
 *      one cell per recipe (icon/name/pips·bounty·count), 1 cell left-
 *      anchored / 2 side by side / 3+ wraps to two columns — and blocks 6-9
 *      (two dishes per archetype) collapse to ONE cell with both icons and
 *      one shared count, since pips/bounty/count all come from the
 *      archetype's own wave entry, not from either dish individually. Also
 *      fixes the "open on wave 4 build with no tap" report — see
 *      useWaveBubble's own doc on the render-time reset below.
 *   C. (StationRail's upgrade preview bubble — towerScene.ts, not this file.)
 *   D. (The wave-1 top-right overlap — Hud.tsx's coin-toast fix, not this
 *      file.)
 *
 * Data path, exactly §7's: waveAt(index).entries[].enemy -> archetype ->
 * blockForLevel(level).dishes[archetype] slugs -> dish-<slug> aliases
 * already in the manifest, deduped by archetype for the grid / by slug for
 * the trigger. store.wave already equals the UPCOMING level during a build
 * phase (actions.ts's syncStore mirrors engine.state.waveIndex + 1
 * regardless of phase), so none of this needs towerScene.ts's engine
 * instance directly.
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

/** One distinct dish, for the trigger's small icon strip. */
interface TriggerDish {
    slug: string;
    name: string;
    icon: string | undefined;
}

/** One archetype's worth of the wave roster, for a submenu grid cell.
 *  `icons`/`names` carry ONE entry for blocks 1-5 (one dish per archetype)
 *  and TWO for blocks 6-9 (double-dish) — pips/bounty/count are per-
 *  ARCHETYPE (from the wave entry itself), so a double-dish archetype is
 *  still exactly one cell, never two. */
interface DishCell {
    key: string;
    icons: string[];
    names: string[];
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
    triggerDishes: TriggerDish[];
    cells: DishCell[];
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

    // Round 5 playtest fix: a new build phase (a new upcoming wave) always
    // starts fresh — "stays until the wave starts or the player taps it," so
    // the previous wave's tap/dismiss must never bleed into the next one.
    // The ORIGINAL fix for this was a `useEffect(() => {...}, [wave])` —
    // correct eventually, but an effect runs AFTER the wave-change render
    // has already committed and painted, so a screenshot (or a frame of
    // real playback) taken in that single window could still catch the
    // PREVIOUS wave's isOpen=true submenu on screen for wave 4's build —
    // exactly the reported "open on wave 4 build with no tap." Comparing a
    // ref during RENDER and calling the setters right here is React's own
    // documented pattern for "derived state that must reset when an input
    // changes" (see react.dev, "Adjusting state when a prop changes") — it
    // forces an immediate re-render before paint, so there's no frame left
    // in which the stale value could ever be shown.
    const prevWaveRef = useRef(wave);
    let dismissedNow = dismissed;
    let isOpenNow = isOpen;
    if (prevWaveRef.current !== wave) {
        prevWaveRef.current = wave;
        dismissedNow = false;
        isOpenNow = false;
        setDismissed(false);
        setIsOpen(false);
    }

    const level = wave;
    const waveData = waveAt(level - 1);
    const block = blockForLevel(level);
    const bountyMult = bountyMultAt(level);
    const effectiveHp = (e: WaveEntry) => enemyDef(e.enemy).hp * (e.hpMult ?? waveData.hpMult ?? 1);
    const maxEffectiveHp = Math.max(...waveData.entries.map(effectiveHp));

    const seenSlugs = new Set<string>();
    const triggerDishes: TriggerDish[] = [];
    const seenArchetypes = new Set<string>();
    const cells: DishCell[] = [];
    for (const entry of waveData.entries) {
        const slugs = block.dishes[entry.enemy] ?? [];
        for (const slug of slugs) {
            if (seenSlugs.has(slug)) continue;
            seenSlugs.add(slug);
            triggerDishes.push({ slug, name: titleCase(slug), icon: ASSET_SRC.get(`dish-${slug}`) });
        }
        if (seenArchetypes.has(entry.enemy)) continue;
        seenArchetypes.add(entry.enemy);
        const pips = Math.min(5, Math.max(1, Math.ceil((5 * effectiveHp(entry)) / maxEffectiveHp)));
        cells.push({
            key: entry.enemy,
            icons: slugs.map((s) => ASSET_SRC.get(`dish-${s}`)).filter((s): s is string => !!s),
            names: slugs.map(titleCase),
            pips,
            bounty: Math.round(enemyDef(entry.enemy).bounty * bountyMult),
            count: entry.count,
        });
    }
    const totalCount = waveData.entries.reduce((s, e) => s + e.count, 0);

    // Dialogue wins: waiting (not permanently dismissed) behind an open box
    // — "the bubble waits until the box closes." Wave start (tdPhase leaves
    // 'build') also hides both halves; the wave-keyed reset above starts
    // everything fresh for the NEXT build phase. baseVisible gates BOTH
    // halves; dismissedNow/isOpenNow then split which of the two (if
    // either) is showing.
    const baseVisible = tdPhase === 'build' && dialogue === null;

    return {
        showTrigger: baseVisible && !dismissedNow && !isOpenNow,
        showSubmenu: baseVisible && isOpenNow,
        triggerDishes,
        cells,
        totalCount,
        open: () => setIsOpen(true),
        close: () => { setIsOpen(false); setDismissed(true); },
    };
}

/** The chat bubble over Ramu — up to 3 distinct dish icons (then a +n
 *  badge), each with its recipe name underneath, and the wave's total unit
 *  count. Mounted inline right after #chef-head-button in Hud.tsx's own row
 *  2, so "anchored to the right of #chef-head-button" falls out of plain DOM
 *  flow — no runtime measurement (the arrow-round lesson StationRail.tsx's
 *  own doc argues from: getBoundingClientRect/ResizeObserver cue positioning
 *  has failed on device three rounds running). Round 5 Part A: icons grew
 *  24 -> 40px with a name label under each — row 2 may grow taller as a
 *  result (the handover's own allowance); it can't overlap the speed row
 *  because both are ordinary flex children of the same row, not
 *  independently positioned. */
export function WaveBubbleTrigger({ state }: { state: WaveBubbleState }) {
    if (!state.showTrigger) return null;
    const shown = state.triggerDishes.slice(0, MAX_BUBBLE_ICONS);
    const extra = state.triggerDishes.length - shown.length;
    return (
        <button
            type="button"
            aria-label="Upcoming wave"
            onClick={state.open}
            className="pointer-events-auto relative flex shrink-0 items-end gap-1.5 rounded-2xl bg-black/80 py-1.5 pr-2.5 pl-3 active:scale-95"
        >
            {/* Tail toward #chef-head-button, on the bubble's own left edge. */}
            <span
                aria-hidden="true"
                className="absolute top-1/2 -left-[5px] h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-black/80"
            />
            {shown.map((d) => (
                <span key={d.slug} className="flex flex-col items-center gap-0.5">
                    <img
                        src={d.icon}
                        alt=""
                        className="h-10 w-10 rounded-full border border-black/40 bg-surface object-contain"
                    />
                    <span className="max-w-[2.75rem] truncate text-[0.55rem] font-bold text-white/85">{d.name}</span>
                </span>
            ))}
            {extra > 0 && <span className="pb-2.5 text-[0.68rem] font-bold text-white/80">+{extra}</span>}
            <span className="pb-2.5 ml-0.5 text-[0.72rem] font-bold text-white">{state.totalCount}</span>
        </button>
    );
}

/** Round 5 Part B: the scroll submenu — closed until tapped (see
 *  useWaveBubble's render-time reset above for why it can no longer be
 *  caught open on its own), a GRID of one cell per recipe (two columns once
 *  there's more than one), inside a 3-sliced ui-scroll panel (CSS
 *  border-image: the LEFT/RIGHT `border-image-slice` bands are the rolled
 *  ends, the `fill` keyword paints the source's own centre strip — already
 *  clear of both rolls — stretched across the content+padding box as the
 *  parchment background; no separate middle asset, and the rolls never
 *  smear because they're never stretched, only the parchment is). Its own
 *  row directly under the WAVE/RUSH + speed row (Round 4 Part D vacates the
 *  ServiceGauge bar's old slot there).
 *
 *  Round 5: dropped `pointer-events-auto` — this panel has nothing
 *  interactive inside it (no buttons, just text/images), so leaving it
 *  `pointer-events-none` (inherited from Hud's root wrapper) means a tap
 *  physically landing on the panel's own screen area passes straight
 *  through to whatever's underneath (the canvas, for pad selection) instead
 *  of being captured by this DOM element first — "never blocks pad
 *  placement," now true for a pad that happens to render BEHIND the panel
 *  too, not just one tapped outside its bounds. The outside-tap close below
 *  is unaffected: the document-level listener still receives the bubbled
 *  event and reads its real target regardless of this element's own
 *  pointer-events value. */
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
            className="relative min-h-[132px] transition-[clip-path] duration-[350ms] ease-out motion-reduce:duration-[0ms]"
            style={{
                borderStyle: 'solid',
                borderColor: 'transparent',
                borderWidth: '0 30px',
                borderImageSource: `url(${ASSET_SRC.get('ui-scroll')})`,
                borderImageSlice: '0 11% fill',
                borderImageRepeat: 'stretch',
                // Round 5: 10px felt tight against the scroll art's own
                // baked-in border lines at a single row (icon/pips nearly
                // touching them) -- 16px gives real breathing room without
                // meaningfully growing the panel for the common multi-row case.
                padding: '16px 14px',
                clipPath: unrolled ? 'inset(0)' : 'inset(0 100% 0 0)',
            }}
        >
            <div
                className="grid gap-x-3 gap-y-2"
                style={{ gridTemplateColumns: 'repeat(2, max-content)', justifyContent: 'start' }}
            >
                {state.cells.map((cell) => (
                    <div key={cell.key} className="flex flex-col items-center gap-1 text-black">
                        <span className="flex -space-x-2">
                            {cell.icons.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt=""
                                    className="h-12 w-12 rounded-full border border-black/30 bg-white/70 object-contain"
                                />
                            ))}
                        </span>
                        <span className="max-w-[6rem] truncate text-center text-[0.68rem] font-bold">
                            {cell.names.join(' / ')}
                        </span>
                        <span className="flex items-center gap-1 text-[0.65rem] font-bold tabular-nums tracking-tighter">
                            <span aria-label={`toughness ${cell.pips} of 5`}>
                                {'●'.repeat(cell.pips)}{'○'.repeat(5 - cell.pips)}
                            </span>
                            <span>· 🪙{cell.bounty}</span>
                            <span>· ×{cell.count}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
