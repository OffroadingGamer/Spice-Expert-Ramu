/**
 * Right-edge rail for the selected pad — replaces BuildSheet.tsx's bottom
 * sheet. Same two jobs, same engine calls, relocated: pick a tower for an
 * empty pad, or manage the one standing there (upgrade, sell with
 * confirmation, Target row). Engine state is read synchronously via
 * actions.getEngine(); re-renders ride on store changes (coins, selection,
 * padVersion, engineReady). Selling keeps the pad selected, so the rail
 * flips straight back to build options.
 *
 * Blocker round: getEngine() is a plain module read, not store state — by
 * itself it's invisible to React. createTowerScene's setup is async
 * (createPixiApp awaits), so this component's FIRST render after mounting
 * always sees engine === null; recovering requires an actual re-render,
 * which useSyncExternalStore only grants when a SUBSCRIBED value changes.
 * On Main Menu -> Challenge Mode with no tower ever placed, every other
 * field this component reads (coins/selectedPad/tdPhase/...) is already
 * back at the exact value the new run re-establishes, so nothing else was
 * forcing that re-render — the rail simply never appeared and no prop
 * could be selected. store.engineReady (set only by registerEngine(), see
 * its own doc) exists specifically to make "the engine became ready" a
 * real, subscribed transition; `useStore((s) => s.engineReady)` below is
 * why `getEngine()` is safe to call plainly the rest of this component.
 *
 * Retractable, not persistent: the rail renders nothing (returns null)
 * while no pad is selected. A first attempt made this panel a permanent
 * fixture that reserved a strip of screen width even when empty — reverted
 * in the final round because that reservation had no purpose to serve most
 * of the time. Selecting a pad now overlays the panel on the right edge of
 * the board (absolutely positioned, above the canvas, outside layout flow)
 * instead of occupying space the board had to shrink to make room for.
 *
 * Width: RAIL_WIDTH_UNITS (stage.ts) is this panel's own overlay width in
 * design units, run through getFit()'s own scale via useRailWidthPx()
 * below — it no longer feeds getFit() itself, since the board doesn't
 * reserve space for it.
 *
 * Final round: the panel is content-height, not h-full — it used to stretch
 * the full viewport, leaving a large empty column below its (short)
 * contents with Close stranded at the bottom. It's now vertically centred
 * on the right edge (inset-y-3 + items-center) and sized to its own
 * content, for both the station picker and the (taller) occupied-tower
 * panel. max-h-full + overflow-y-auto is a backstop for a screen too short
 * to fit either state — it scrolls inside itself; the page never does.
 *
 * Round D (FTUE walls, GDD §10.11): Close is hidden for the duration of a
 * forced beat (store.ftueBeat !== null — actions.ts is the real gate, this
 * is just the display rule), and Sell stays disabled for the whole
 * onboarding (store.ftueActive), not only inside the forced beats — it
 * returns once wave 3 begins.
 *
 * Final round, task 1: every forced-beat arrow lives here now, anchored to
 * a live getBoundingClientRect() (no stage.ts transform — these are normal
 * DOM layout inside the rail, never something positioned on the canvas).
 * upgrade0 points at the Upgrade button, same as before; place0/place2 now
 * point at the station list (the buyable cards) instead of Hud.tsx pointing
 * a canvas arrow at the target pad — the selected-pad ring already shows
 * which pad, so the arrow's only job left is "tap here," and "here" is the
 * rail, not the board.
 */
import { useEffect, useRef, useState } from 'react';
import { sfx } from '../audio/audio.ts';
import { getEngine, placeTower, sellTower, setTargeting, upgradeTower } from '../game/actions.ts';
import { CONFIG } from '../game/config.ts';
import { getFit, RAIL_WIDTH_UNITS } from '../game/stage.ts';
import { TARGETING_DESCRIPTIONS, TARGETING_LABELS, TARGETING_MODES } from '../game/data/targeting.ts';
import { TOWERS } from '../game/data/towers.ts';
import { store, useStore } from '../state/store.ts';

/** The rail's own overlay width in CSS px, tracking #app-frame's size the
 *  same way Hud.tsx's usePadsScreenPos does. Only StationRail.tsx itself
 *  needs this now — the board no longer reserves layout space for it. */
function useRailWidthPx(): number {
    const [px, setPx] = useState(0);
    useEffect(() => {
        const frame = document.getElementById('app-frame');
        if (!frame) return;
        const compute = () => {
            const rect = frame.getBoundingClientRect();
            setPx(getFit(rect.width, rect.height).scale * RAIL_WIDTH_UNITS);
        };
        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(frame);
        return () => ro.disconnect();
    }, []);
    return px;
}

/** Player-facing label for a gold pad's bonus. */
function bonusLabel(bonus: NonNullable<(typeof CONFIG.pads)[number]['bonus']>): string {
    const pct = Math.round((bonus.mult - 1) * 100);
    const stat = bonus.stat === 'damage' ? 'damage' : bonus.stat === 'fireRate' ? 'fire rate' : 'radius';
    return `${pct}% ${stat}!`;
}

function BonusBadge({ padIndex }: { padIndex: number }) {
    const bonus = CONFIG.pads[padIndex].bonus;
    if (!bonus) return null;
    return (
        <div className="flex flex-col items-center gap-0.5 text-center">
            <span className="text-base leading-none">⭐</span>
            <span className="text-[0.6rem] leading-tight font-bold text-primary">{bonusLabel(bonus)}</span>
        </div>
    );
}

export default function StationRail() {
    const selectedPad = useStore((s) => s.selectedPad);
    const coins = useStore((s) => s.coins);
    const tdPhase = useStore((s) => s.tdPhase);
    const towerIcons = useStore((s) => s.towerIcons);
    const ftueActive = useStore((s) => s.ftueActive);
    const ftueBeat = useStore((s) => s.ftueBeat);
    const engineReady = useStore((s) => s.engineReady);
    useStore((s) => s.padVersion); // re-render on coin-free engine mutations
    const [confirmSell, setConfirmSell] = useState(false);
    const [showTargetHelp, setShowTargetHelp] = useState(false);
    const upgradeBtnRef = useRef<HTMLButtonElement>(null);
    const stationListRef = useRef<HTMLDivElement>(null);
    const [ftueArrowPos, setFtueArrowPos] = useState<{ x: number; y: number } | null>(null);
    const railPx = useRailWidthPx();

    // a new selection always starts with both popups closed
    useEffect(() => {
        setConfirmSell(false);
        setShowTargetHelp(false);
    }, [selectedPad]);

    const engine = getEngine();
    const tower = selectedPad !== null ? engine?.state.towers.find((t) => t.padIndex === selectedPad) : undefined;
    const showUpgradeArrow = ftueBeat === 'upgrade0' && selectedPad === 0;
    // Final round, task 1: place0/place2 point here instead of at the pad
    // on canvas (Hud.tsx used to) — matches exactly when the station-list
    // branch below actually renders (selectedPad set, no tower yet).
    const showPlaceArrow = (ftueBeat === 'place0' || ftueBeat === 'place2') && selectedPad !== null && !tower;

    // Anchor to whichever DOM element the active beat cares about —
    // viewport (fixed) coords, no stage.ts transform, since these are
    // normal DOM layout inside the rail, never something positioned on the
    // canvas. One mechanism, two possible targets, since the two beats are
    // mutually exclusive (never both at once). `engineReady` is in the deps
    // for a real race, not paranoia: on the very FIRST render of a fresh
    // run (final round, task 3 — cold boot can now land here before
    // GameCanvas's effect has called registerEngine()), `engine` is still
    // null, the early return below fires, and the ref never attaches to a
    // DOM node THIS render. showPlaceArrow was already true on that same
    // render (it doesn't depend on engine), so without `engineReady` here the
    // effect's inputs look unchanged on the very next render — the first
    // one where the ref'd element actually exists — and never re-fires.
    //
    // A ResizeObserver on the target element (not just a window 'resize'
    // listener) matters for the same reason useRailWidthPx below tracks
    // #app-frame the same way: the station list's own height — and
    // therefore its centred top position — changes when towerIcons
    // resolves asynchronously after mount (main.tsx's generateTowerIcons)
    // and the cards gain their <img> art. That's neither a window resize
    // nor a change to this effect's own deps, so only observing the
    // element itself catches it; caught live (a station-list rect that
    // measurably drifted with a stale window-resize-only arrow, then held
    // steady once switched to ResizeObserver).
    useEffect(() => {
        if (!showUpgradeArrow && !showPlaceArrow) { setFtueArrowPos(null); return; }
        const el = showUpgradeArrow ? upgradeBtnRef.current : stationListRef.current;
        if (!el) { setFtueArrowPos(null); return; }
        const compute = () => {
            const r = el.getBoundingClientRect();
            setFtueArrowPos({ x: r.left + r.width / 2, y: r.top });
        };
        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(el);
        window.addEventListener('resize', compute);
        return () => { ro.disconnect(); window.removeEventListener('resize', compute); };
    }, [showUpgradeArrow, showPlaceArrow, tower?.level, engineReady]);

    if (selectedPad === null || tdPhase === 'lost' || !engineReady) return null;

    const refund = tower ? Math.floor(tower.spent * CONFIG.economy.sellRefund) : 0;

    return (
        <>
            <div
                className="pointer-events-none absolute inset-y-3 right-3 flex items-center"
                style={{ width: railPx || undefined }}
            >
                {/* Visual round, task 5 (carried from the old sheet): opaque
                    bg-surface, not a see-through tint — the belt and D-row
                    pads must not read straight through the panel. Only
                    mounted while a pad is selected (the guard above), so
                    this overlays the board rather than sitting empty.
                    Final round: content-height, not h-full — the panel used
                    to stretch the whole viewport, leaving a large empty dark
                    column below four station cards (or below the shorter
                    Sell/Upgrade/Target panel) with Close stranded at the
                    bottom. max-h-full caps it against the inset-y-3 parent
                    (so it's always short of the real viewport) and
                    overflow-y-auto only engages if content genuinely doesn't
                    fit on a short screen — the page itself never scrolls. */}
                <div className="pointer-events-auto flex max-h-full w-full flex-col gap-1.5 overflow-y-auto rounded-2xl bg-surface p-1.5">
                    {selectedPad !== null && !tower && (
                        <div ref={stationListRef} className="flex flex-col gap-1.5 pt-1">
                            {TOWERS.map((def) => {
                                const affordable = coins >= def.cost;
                                return (
                                    <button
                                        key={def.id}
                                        type="button"
                                        disabled={!affordable}
                                        className={
                                            'flex w-full flex-col items-center gap-0.5 rounded-lg p-1.5 transition-transform active:scale-95 ' +
                                            (affordable ? 'bg-white/10' : 'bg-white/5 opacity-40')
                                        }
                                        onClick={() => {
                                            sfx.place();
                                            placeTower(selectedPad, def.id);
                                            store.patch({ selectedPad: null });
                                        }}
                                    >
                                        {towerIcons[def.id] && (
                                            <img src={towerIcons[def.id]} alt="" className="h-8 w-8 object-contain" />
                                        )}
                                        <span className="text-center text-[0.62rem] leading-tight font-bold">{def.name}</span>
                                        <span className="text-[0.6rem] text-white/70 tabular-nums">🪙{def.cost}</span>
                                    </button>
                                );
                            })}
                            <BonusBadge padIndex={selectedPad} />
                        </div>
                    )}

                    {selectedPad !== null && tower && (
                        <div className="flex flex-col gap-1.5 pt-1">
                            <p className="text-center text-[0.68rem] leading-tight font-bold">
                                {tower.def.name}
                                <br />
                                Lv {tower.level}
                            </p>
                            <p className="text-center text-[0.6rem] leading-tight text-white/60 tabular-nums">
                                {Math.round(tower.damage)} dmg
                                <br />
                                {tower.fireRate.toFixed(1)}/s
                            </p>

                            {tower.level <= tower.def.upgrades.length ? (
                                (() => {
                                    const cost = tower.def.upgrades[tower.level - 1].cost;
                                    const affordable = coins >= cost;
                                    return (
                                        <button
                                            ref={upgradeBtnRef}
                                            type="button"
                                            disabled={!affordable}
                                            className={
                                                'w-full rounded-lg py-2 text-[0.68rem] leading-tight font-bold transition-transform active:scale-95 ' +
                                                (affordable ? 'bg-primary text-black' : 'bg-white/10 text-white/40')
                                            }
                                            onClick={() => {
                                                sfx.upgrade();
                                                upgradeTower(selectedPad);
                                            }}
                                        >
                                            Upgrade
                                            <br />
                                            🪙{cost}
                                        </button>
                                    );
                                })()
                            ) : (
                                <span className="w-full rounded-lg bg-white/10 py-2 text-center text-[0.68rem] font-bold text-white/50">
                                    Max
                                </span>
                            )}

                            {/* Disabled (not hidden) for the whole onboarding, not just
                                the forced beats — it returns once wave 3 begins. */}
                            <button
                                type="button"
                                disabled={ftueActive}
                                className={
                                    'w-full rounded-lg py-2 text-[0.68rem] font-bold text-white transition-transform active:scale-95 ' +
                                    (ftueActive ? 'bg-red-500/30 opacity-40' : 'bg-red-500/80')
                                }
                                onClick={() => { sfx.click(); setConfirmSell(true); }}
                            >
                                Sell
                            </button>

                            <div className="flex items-center justify-center gap-1">
                                <p className="text-[0.6rem] font-semibold text-white/60">Target</p>
                                <button
                                    type="button"
                                    aria-label="What do the targeting options mean?"
                                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[0.6rem] font-bold text-white/70 transition-transform active:scale-95"
                                    onClick={() => { sfx.click(); setShowTargetHelp(true); }}
                                >
                                    ?
                                </button>
                            </div>
                            {/* Final round Tier 2, task 2: a 2-column grid clipped
                                "Strong"/"Weak" etc — CSS grid items don't shrink
                                below their text's intrinsic width by default, so
                                a ~20px-wide cell let the label overflow into its
                                neighbour instead of wrapping. A single column
                                gives each label the rail's full width; min-w-0
                                is kept as a safety net against the same failure
                                mode reappearing at a narrower device width. */}
                            <div className="grid grid-cols-1 gap-1">
                                {TARGETING_MODES.map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        className={
                                            'min-w-0 rounded-md px-1 py-1.5 text-center text-[0.6rem] leading-tight font-semibold transition-colors ' +
                                            (tower.targeting === mode
                                                ? 'bg-primary text-black'
                                                : 'bg-white/10 text-white/70')
                                        }
                                        onClick={() => {
                                            sfx.click();
                                            setTargeting(selectedPad, mode);
                                        }}
                                    >
                                        {TARGETING_LABELS[mode]}
                                    </button>
                                ))}
                            </div>

                            <BonusBadge padIndex={selectedPad} />
                        </div>
                    )}

                    {/* Hidden (not just disabled) for the duration of a forced beat —
                        the real gate is the canvas tap-wall (towerScene.ts's onTap)
                        and startWave()'s own guard; this only keeps the escape
                        hatch out of sight. */}
                    {/* Final round: no longer mt-auto -- the panel is content-height
                        now, so this sits directly under the content above it
                        (the parent's own gap-1.5) rather than being pushed to
                        a viewport bottom that no longer exists. */}
                    {selectedPad !== null && !ftueBeat && (
                        <button
                            type="button"
                            className="w-full rounded-lg bg-white/10 py-2 text-[0.62rem] font-semibold text-white/70 transition-transform active:scale-95"
                            onClick={() => { sfx.click(); store.patch({ selectedPad: null }); }}
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
            {ftueArrowPos && (
                <div
                    className="pointer-events-none fixed z-10 flex flex-col items-center"
                    style={{ left: ftueArrowPos.x, top: ftueArrowPos.y - 60, transform: 'translateX(-50%)' }}
                >
                    <span className="motion-safe:animate-bounce text-5xl leading-none">⬇️</span>
                </div>
            )}
            {showTargetHelp && tower && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-8">
                    <div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl bg-black/90 p-6">
                        <p className="text-center text-xl font-bold">Targeting</p>
                        <p className="text-[1.1rem] text-white/60">
                            Who this tower attacks when several bugs are in range:
                        </p>
                        <div className="flex flex-col gap-2">
                            {TARGETING_MODES.map((mode) => (
                                <p key={mode} className="text-[1.1rem] leading-6">
                                    <span className="font-bold text-primary">{TARGETING_LABELS[mode]}:</span>
                                    <span className="text-white/80"> {TARGETING_DESCRIPTIONS[mode]}</span>
                                </p>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="mt-2 w-full rounded-xl bg-primary py-3 text-[1.1rem] font-bold text-black transition-transform active:scale-95"
                            onClick={() => { sfx.click(); setShowTargetHelp(false); }}
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
            {confirmSell && tower && selectedPad !== null && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-10">
                    <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-black/90 p-6">
                        <p className="text-center text-xl font-bold">
                            Sell {tower.def.name} for 🪙 {refund}?
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className="flex-1 rounded-xl bg-white/10 py-3 text-[1.1rem] font-bold text-white/80 transition-transform active:scale-95"
                                onClick={() => { sfx.click(); setConfirmSell(false); }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="flex-1 rounded-xl bg-red-500/80 py-3 text-[1.1rem] font-bold text-white transition-transform active:scale-95"
                                onClick={() => {
                                    sfx.sell();
                                    setConfirmSell(false);
                                    sellTower(selectedPad);
                                }}
                            >
                                Sell +{refund}c
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
