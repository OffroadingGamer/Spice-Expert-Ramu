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
 * Round 6 Part B: two more folded in —
 *   - Icons 40 -> 56px (both the trigger and the grid — Round 5 only grew
 *     the trigger).
 *   - The bubble now PERSISTS through the whole wave (trigger only — the
 *     scroll grid still closes the moment the wave starts, see the second
 *     render-time reset below) instead of hiding the instant combat
 *     begins, and each cell now shows a LIVE remaining count
 *     (`remaining`/`count`, ticking down as that archetype is served),
 *     fed by towerScene.ts's store.waveDishServed — a straight read off
 *     the engine-event diff that already exists for coin popups, reset the
 *     instant `wave` changes (see store.ts's own doc on that field).
 *
 * Round 7 items 1 + 3 (playtest of 1.77.0), both in WaveBubbleTrigger only —
 * the grid cells already had a per-dish remaining/total (Round 6):
 *   1. The trigger's collective total is GONE — each icon now carries its
 *      OWN `remaining`/`count` (same numbers the grid cell for that
 *      archetype shows), so a double-dish archetype's two icons display the
 *      identical live count (there is nothing finer-grained to attribute:
 *      the engine only tracks archetype, not which of its two dish skins a
 *      given kill was).
 *   2. More than 3 distinct dishes: instead of the old static "+N" badge,
 *      the trigger shows a sliding 3-wide window that advances by one dish
 *      every PAN_STEP_MS, wrapping — over N steps every dish has been
 *      shown, "panning across all of them" per the handover, rather than a
 *      single jump-cut carousel. A short opacity fade (PAN_EASE_MS) softens
 *      each step. `prefers-reduced-motion` disables the interval outright
 *      (never starts panning) and falls back to a static first-3 plus a
 *      literal "···" marker — no animation, no badge count.
 *
 * Data path, exactly §7's: waveAt(index).entries[].enemy -> archetype ->
 * blockForLevel(level).dishes[archetype] slugs -> dish-<slug> aliases
 * already in the manifest, deduped by archetype for the grid / by slug for
 * the trigger. store.wave already equals the CURRENT level for both the
 * build AND wave phases of that same wave (actions.ts's syncStore mirrors
 * engine.state.waveIndex + 1 regardless of phase, and waveIndex only
 * advances on a wave-clear) — it changes exactly once per wave, at the
 * moment the NEXT build phase begins, which is what makes it the right key
 * for "reset for a new wave" below. None of this needs towerScene.ts's
 * engine instance directly.
 */
import { useEffect, useRef, useState } from 'react';
import { MANIFEST } from '../assets/manifest.ts';
import { CONFIG } from '../game/config.ts';
import { blockForLevel } from '../game/data/blocks.ts';
import { enemyDef } from '../game/data/enemies.ts';
import { waveAt, type WaveEntry } from '../game/data/waves.ts';
import { queueDialogueOnce } from '../game/dialogueController.ts';
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
/** Round 7 item 3: how long each panned window holds before advancing, and
 *  the opacity-fade duration of the step itself (handover: "~1.8s per step,
 *  300ms ease"). */
const PAN_STEP_MS = 1800;
const PAN_EASE_MS = 300;

/** One distinct dish, for the trigger's small icon strip. Round 7 item 1:
 *  `remaining`/`count` are the SAME numbers as the grid cell for this
 *  dish's archetype (see the loop below) — a double-dish archetype's two
 *  TriggerDish entries share identical values, since the engine can't
 *  attribute a kill to one specific dish skin over the other. */
interface TriggerDish {
    slug: string;
    name: string;
    icon: string | undefined;
    remaining: number;
    count: number;
}

/** Local duplicate of ChefPortrait.tsx's own hook — same small-utility
 *  duplication this file already does for ASSET_SRC (see its own comment). */
function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(() => {
        try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
    });
    useEffect(() => {
        let mql: MediaQueryList;
        try { mql = window.matchMedia('(prefers-reduced-motion: reduce)'); } catch { return; }
        const onChange = () => setReduced(mql.matches);
        mql.addEventListener?.('change', onChange);
        return () => mql.removeEventListener?.('change', onChange);
    }, []);
    return reduced;
}

/** One archetype's worth of the wave roster, for a submenu grid cell.
 *  `icons`/`names` carry ONE entry for blocks 1-5 (one dish per archetype)
 *  and TWO for blocks 6-9 (double-dish) — pips/bounty/count are per-
 *  ARCHETYPE (from the wave entry itself), so a double-dish archetype is
 *  still exactly one cell, never two. Round 6 Part B: `count` stays the
 *  wave's total for this archetype; `remaining` is `count` minus
 *  store.waveDishServed, ticking down as the wave is fought — count itself
 *  never changes mid-wave, so both are kept rather than mutating one. */
interface DishCell {
    key: string;
    icons: string[];
    names: string[];
    pips: number;
    bounty: number;
    count: number;
    remaining: number;
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
    const waveDishServed = useStore((s) => s.waveDishServed);
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

    // Round 6 Part B: the trigger now persists through the WHOLE wave (see
    // baseVisible below), but "the scroll still closes on wave start" — and
    // `wave` itself doesn't change at that moment (it only bumps at the
    // NEXT wave-clear, per this file's own doc above), so the wave-keyed
    // reset above can't catch it. A second render-time reset, same pattern,
    // keyed on tdPhase instead: the moment it leaves 'build', force the
    // submenu shut (dismissed is untouched — if the trigger was already
    // dismissed for this wave, it stays dismissed through combat, same as
    // any other mid-build dismiss).
    const prevPhaseRef = useRef(tdPhase);
    if (prevPhaseRef.current !== tdPhase) {
        prevPhaseRef.current = tdPhase;
        if (tdPhase !== 'build' && isOpenNow) {
            isOpenNow = false;
            setIsOpen(false);
        }
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
        const served = waveDishServed[entry.enemy] ?? 0;
        const remaining = Math.max(0, entry.count - served);
        // Round 7 item 1: each dish icon carries THIS archetype's own
        // remaining/count — both dishes of a double-dish archetype share
        // the same pair (see this file's header comment on why that's
        // correct, not a shortcut).
        for (const slug of slugs) {
            if (seenSlugs.has(slug)) continue;
            seenSlugs.add(slug);
            triggerDishes.push({ slug, name: titleCase(slug), icon: ASSET_SRC.get(`dish-${slug}`), remaining, count: entry.count });
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
            remaining,
        });
    }

    // Round 10 Part 2 (docs/Ideas.md §6d, "Playtest of 1.80.0" item 4): the
    // "recipe widget" FTUE beat — the first time this bubble is actually
    // populated during wave 1's build phase. queueDialogueOnce persists its
    // own once-ever-per-save flag (state/save.ts), so re-mounting this hook
    // on a later run (wave/tdPhase legitimately return to these same values
    // on every Retry, which wouldn't otherwise re-trigger a dep-keyed effect
    // anyway) can never fire it twice — the effect below is deliberately
    // "call it every time the condition is true" rather than "only on the
    // very first render", with queueDialogueOnce itself as the sole gate.
    useEffect(() => {
        if (wave === 1 && tdPhase === 'build' && triggerDishes.length > 0) {
            queueDialogueOnce('recipe-widget');
        }
    }, [wave, tdPhase, triggerDishes.length]);

    // Dialogue wins: waiting (not permanently dismissed) behind an open box
    // — "the bubble waits until the box closes." Round 6: the trigger no
    // longer hides at wave start — it now persists build phase through wave
    // end (both 'build' and 'wave' are visible), only 'lost' (and a
    // dialogue box) hide it. The wave-keyed reset above starts everything
    // fresh for the NEXT build phase; the phase-keyed reset above closes
    // just the submenu at wave start. baseVisible gates BOTH halves;
    // dismissedNow/isOpenNow then split which of the two (if either) is
    // showing.
    const baseVisible = (tdPhase === 'build' || tdPhase === 'wave') && dialogue === null;

    return {
        showTrigger: baseVisible && !dismissedNow && !isOpenNow,
        // Belt-and-suspenders on top of the phase-keyed reset above: the
        // submenu can never show outside 'build' even if isOpenNow were
        // somehow still true (e.g. a render this same tick that hasn't
        // committed the reset's setState yet — isOpenNow the LOCAL override
        // is already correct in that case, but this costs nothing extra).
        showSubmenu: baseVisible && isOpenNow && tdPhase === 'build',
        triggerDishes,
        cells,
        open: () => setIsOpen(true),
        close: () => { setIsOpen(false); setDismissed(true); },
    };
}

/** The chat bubble over Ramu — up to 3 distinct dish icons (then a +n
 *  badge), each with its recipe name underneath, and the wave's live
 *  remaining unit count. Mounted inline right after #chef-head-button in
 *  Hud.tsx's own row 2, so "anchored to the right of #chef-head-button"
 *  falls out of plain DOM flow — no runtime measurement (the arrow-round
 *  lesson StationRail.tsx's own doc argues from: getBoundingClientRect/
 *  ResizeObserver cue positioning has failed on device three rounds
 *  running). Round 5 Part A: icons grew 24 -> 40px with a name label under
 *  each; Round 6 Part B: 40 -> 56px, and the bubble (this trigger) now
 *  stays mounted through the whole wave, not just build — row 2 may grow
 *  taller as a result (the handover's own allowance); it can't overlap the
 *  speed row because both are ordinary flex children of the same row, not
 *  independently positioned. */
export function WaveBubbleTrigger({ state }: { state: WaveBubbleState }) {
    const reducedMotion = usePrefersReducedMotion();
    const dishes = state.triggerDishes;
    const overflow = dishes.length > MAX_BUBBLE_ICONS;
    const [panIndex, setPanIndex] = useState(0);
    const [panFading, setPanFading] = useState(false);

    // A new wave's dish set can differ in length from the last one (or this
    // trigger can simply remount) — start the window fresh each time rather
    // than carrying over an index that might now be out of range.
    useEffect(() => {
        setPanIndex(0);
        setPanFading(false);
    }, [dishes.length]);

    // Round 7 item 3: advance the window every PAN_STEP_MS, fading out for
    // PAN_EASE_MS before the content actually swaps (see the render below —
    // opacity, not the icons themselves, is what's mid-transition). Never
    // starts at all when there's nothing to pan past (<=3 dishes) or under
    // reduced motion — both render a static list instead (below).
    useEffect(() => {
        if (!overflow || reducedMotion) return;
        let innerTimeout: ReturnType<typeof setTimeout> | null = null;
        const id = setInterval(() => {
            setPanFading(true);
            innerTimeout = setTimeout(() => {
                setPanIndex((i) => (i + 1) % dishes.length);
                setPanFading(false);
            }, PAN_EASE_MS);
        }, PAN_STEP_MS);
        return () => {
            clearInterval(id);
            if (innerTimeout) clearTimeout(innerTimeout);
        };
    }, [overflow, reducedMotion, dishes.length]);

    if (!state.showTrigger) return null;

    const shown = !overflow
        ? dishes
        : reducedMotion
            ? dishes.slice(0, MAX_BUBBLE_ICONS)
            : Array.from({ length: MAX_BUBBLE_ICONS }, (_, i) => dishes[(panIndex + i) % dishes.length]);

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
            <span
                className="flex items-end gap-1.5 transition-opacity ease-out motion-reduce:transition-none"
                style={{ transitionDuration: `${PAN_EASE_MS}ms`, opacity: panFading ? 0 : 1 }}
            >
                {shown.map((d) => (
                    <span key={d.slug} className="flex flex-col items-center gap-0.5">
                        <img
                            src={d.icon}
                            alt=""
                            className="h-14 w-14 rounded-full border border-black/40 bg-surface object-contain"
                        />
                        <span className="max-w-[3.5rem] truncate text-[0.55rem] font-bold text-white/85">{d.name}</span>
                        {/* Round 7 item 1: this dish's own live remaining
                            count, replacing the old collective total. */}
                        <span className="text-[0.6rem] font-bold tabular-nums text-white/70">
                            {d.remaining}/{d.count}
                        </span>
                    </span>
                ))}
                {/* Reduced motion + more than 3 dishes: no pan, no "+N" —
                    a plain ellipsis says "more, not shown" without motion. */}
                {overflow && reducedMotion && (
                    <span aria-hidden="true" className="pb-2.5 text-[0.85rem] font-bold text-white/70">···</span>
                )}
            </span>
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
                                    className="h-14 w-14 rounded-full border border-black/30 bg-white/70 object-contain"
                                />
                            ))}
                        </span>
                        <span className="max-w-[7rem] truncate text-center text-[0.68rem] font-bold">
                            {cell.names.join(' / ')}
                        </span>
                        <span className="flex items-center gap-1 text-[0.65rem] font-bold tabular-nums tracking-tighter">
                            <span aria-label={`toughness ${cell.pips} of 5`}>
                                {'●'.repeat(cell.pips)}{'○'.repeat(5 - cell.pips)}
                            </span>
                            <span>· 🪙{cell.bounty}</span>
                            {/* Round 6 Part B: live remaining/total (e.g.
                                "4/9"), ticking down as this archetype is
                                served — replaces the old static "×count". */}
                            <span aria-label={`${cell.remaining} of ${cell.count} remaining`}>
                                · {cell.remaining}/{cell.count}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
