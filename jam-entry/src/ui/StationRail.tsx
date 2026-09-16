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
 * design units, run through getFit()'s own scale via useRailFit() below —
 * it no longer feeds getFit() itself, since the board doesn't reserve space
 * for it. The same scale also drives the rail's label font sizes (label-
 * overflow round, below).
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
 * returns once wave 4 begins (onboarding-balance round: was wave 3, before
 * the third forced placement extended the script by one wave).
 *
 * Arrow round: the forced-beat cue (placeFirst, place2, place3, upgrade0) is
 * a sideways arrow pointing at this panel from its left edge — CSS layout
 * only. getBoundingClientRect()/ResizeObserver/refs/fixed-position measuring
 * the real DOM already failed on a real device three separate rounds (each
 * one passed locally first); this rewrite deletes that entire approach
 * rather than debug it a fourth time. The arrow is `position: absolute`
 * against the rail's own outer wrapper (already `position: absolute` itself,
 * so no extra positioning context is needed) — `right-full` puts it just
 * outside the panel's left edge, and vertical placement is plain CSS:
 * centred against the panel for placeFirst/place2/place3 (the station list
 * roughly fills it), nudged up toward the Upgrade button's fixed spot in the
 * occupied-tower panel's content order for upgrade0 (UPGRADE_ARROW_LIFT_PX
 * below — eyeballed against that panel's own fixed layout, never measured at
 * runtime; that panel's content shape doesn't vary while this beat is
 * active, so a fixed offset stays accurate every time it shows).
 */
import { useEffect, useState } from 'react';
import { sfx } from '../audio/audio.ts';
import { FTUE_FIRST_PAD, getEngine, placeTower, sellTower, setTargeting, upgradeTower } from '../game/actions.ts';
import { CONFIG } from '../game/config.ts';
import { getFit, RAIL_WIDTH_UNITS } from '../game/stage.ts';
import { TARGETING_DESCRIPTIONS, TARGETING_LABELS, TARGETING_MODES } from '../game/data/targeting.ts';
import { TOWERS } from '../game/data/towers.ts';
import { store, useStore } from '../state/store.ts';

/** Rail-width round: on a narrow phone (~403 CSS px wide), scale × 140
 *  design units bottoms out around 53px — not a font-size problem, a
 *  floor-space problem: even the font-size floor below can't make
 *  "Upgrade" fit inside a 33px text budget. The rail's CSS width is capped
 *  to this MINIMUM independent of the board's own zoom, same as a
 *  min-width would read in plain CSS — the board is free to keep shrinking
 *  below it, the rail just stops shrinking with it. 88px leaves ~68px of
 *  text space after the panel's own p-1.5 and a button's px-1 (88 - 12 - 8),
 *  which is what actually fits "Upgrade" at a readable size — not a round
 *  number, a measured one. Below the design's own board proportions this
 *  necessarily overlaps the (274px-wide, centred) board by design — the
 *  panel is opaque and only mounts while a pad is selected, so that's an
 *  accepted tradeoff, not a bug. Exported for this file's own use below;
 *  Round 2b (docs/Ideas.md §6d amendment) briefly gave DialogueBox.tsx's own
 *  beat 3 a reason to read this too (the one run where the dialogue box and
 *  this rail were both on screen at once) — Round 4 retired that window
 *  entirely (the box now closes before the rail ever opens for beat 3), so
 *  this export is StationRail-only again. */
export const RAIL_MIN_PX = 88;

/** The rail's own overlay width in CSS px, AND the board's design→screen
 *  scale that produces it, tracking #app-frame's size the same way
 *  Hud.tsx's usePadsScreenPos does. Only StationRail.tsx itself needs this
 *  now — the board no longer reserves layout space for it. `scale` is what
 *  the label-overflow round below derives its font sizes from — the same
 *  number that already sizes this panel's own width, so a label can never
 *  drift out of sync with how much room the rail actually has. */
function useRailFit(): { railPx: number; scale: number } {
    const [fit, setFit] = useState({ railPx: 0, scale: 0 });
    useEffect(() => {
        const frame = document.getElementById('app-frame');
        if (!frame) return;
        const compute = () => {
            const rect = frame.getBoundingClientRect();
            const { scale } = getFit(rect.width, rect.height);
            setFit({ railPx: Math.max(scale * RAIL_WIDTH_UNITS, RAIL_MIN_PX), scale });
        };
        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(frame);
        return () => ro.disconnect();
    }, []);
    return fit;
}

/**
 * Label-overflow round: Upgrade/Sell/Max/station-name/targeting-mode labels
 * used a fixed rem size against a rail whose own CSS width is ITSELF
 * derived from getFit()'s scale (RAIL_WIDTH_UNITS above) — a fixed size
 * against a variable-width panel is exactly what overflowed on a narrow
 * device, and break-words papered over it with an ugly mid-word "Upgra/de"
 * split instead of a real fix. Deriving font size from the SAME scale that
 * already sizes the rail fixes the whole class at once and stays
 * deterministic: no runtime measurement of the text itself, ever —
 * getBoundingClientRect/refs/ResizeObserver on these elements specifically
 * has failed on device three rounds running (see this file's arrow-round
 * comment above). RAIL_LABEL_FONT_UNITS is a design-unit font size, exactly
 * like anything else scale multiplies; retune this one constant if labels
 * ever need to run bigger or smaller.
 *
 * Rail-width round: shrinking the font further on a narrow rail turned out
 * to have a floor — "Upgrade" simply needs more space than any legible size
 * could buy back, which is what RAIL_MIN_PX above actually fixes. This
 * clamp is what it sounds like: a floor so the font never becomes
 * unreadable on a still-narrow-but-now-min-width rail, and a ceiling so an
 * unusually wide/tall desktop window doesn't blow labels up past what
 * "desktop size" has always looked like. railLabelFontPx() returns
 * undefined before the first real measurement lands (scale 0), so the
 * className's own fixed-rem size is what shows briefly instead of a
 * zero-size flash — same `|| undefined` fallback pattern the rail's own
 * width style already uses.
 */
const RAIL_LABEL_FONT_UNITS = 21;
const RAIL_LABEL_FONT_MIN_PX = 11;
const RAIL_LABEL_FONT_MAX_PX = 18;
function railLabelFontPx(scale: number): number | undefined {
    if (scale <= 0) return undefined;
    return Math.min(Math.max(scale * RAIL_LABEL_FONT_UNITS, RAIL_LABEL_FONT_MIN_PX), RAIL_LABEL_FONT_MAX_PX);
}

/** How far above the panel's own vertical centre the upgrade0 arrow sits,
 *  in CSS px — eyeballed against the occupied-tower panel's fixed content
 *  order (name/level, dmg/rate, then Upgrade), never measured at runtime.
 *  That panel's shape doesn't change while this beat is active (the beat
 *  never arms unless a real Upgrade button is showing, not "Max"), so one
 *  fixed offset stays accurate every time it appears. Retune this one
 *  constant if the content above Upgrade ever changes. */
const UPGRADE_ARROW_LIFT_PX = 70;

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
    const { railPx, scale: railScale } = useRailFit();
    const railLabelFontSize = railLabelFontPx(railScale);

    // a new selection always starts with both popups closed
    useEffect(() => {
        setConfirmSell(false);
        setShowTargetHelp(false);
    }, [selectedPad]);

    const engine = getEngine();
    const tower = selectedPad !== null ? engine?.state.towers.find((t) => t.padIndex === selectedPad) : undefined;
    const showUpgradeArrow = ftueBeat === 'upgrade0' && selectedPad === FTUE_FIRST_PAD;
    // placeFirst/place2/place3 point at the station picker (the buyable
    // cards) — the selected-pad ring already shows which pad, so the
    // arrow's only job is "tap here," and "here" is the rail, not the board.
    const showPlaceArrow = (ftueBeat === 'placeFirst' || ftueBeat === 'place2' || ftueBeat === 'place3') && selectedPad !== null && !tower;
    const showRailArrow = showUpgradeArrow || showPlaceArrow;

    if (selectedPad === null || tdPhase === 'lost' || !engineReady) return null;

    const refund = tower ? Math.floor(tower.spent * CONFIG.economy.sellRefund) : 0;

    return (
        <>
            <div
                className="pointer-events-none absolute inset-y-3 right-3 flex items-center"
                style={{ width: railPx || undefined }}
            >
                {/* Arrow round: sideways cue, positioned purely against this
                    (already `position: absolute`) wrapper — `right-full`
                    lands it just outside the panel's own left edge (the
                    wrapper shrink-wraps its one child, so its left edge IS
                    the panel's left edge), motion-safe: gated same as every
                    other Hud.tsx animation. placeFirst/place2/place3 centre against the
                    wrapper's full height, which is also the panel's own
                    centre (the panel is itself centred in this same
                    wrapper) — correct for the station picker, which fills
                    most of the panel. upgrade0 shifts up from that same
                    centre by a fixed, eyeballed amount (see
                    UPGRADE_ARROW_LIFT_PX) toward where Upgrade always sits
                    in that panel's fixed content order. */}
                {showRailArrow && (
                    // Two elements, not one: the outer div's inline transform
                    // holds the (static) vertical offset, the inner span's
                    // animate-nudge-right class holds the (moving)
                    // horizontal one. A CSS animation overrides an inline
                    // transform on the SAME element for as long as it runs,
                    // so combining both into one transform would silently
                    // lose the vertical placement the instant the animation
                    // started — splitting them onto parent/child means each
                    // transform composes independently instead of fighting.
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute right-full top-1/2 mr-2"
                        style={{ transform: showUpgradeArrow ? `translateY(calc(-50% - ${UPGRADE_ARROW_LIFT_PX}px))` : 'translateY(-50%)' }}
                    >
                        <span className="motion-safe:animate-nudge-right block text-4xl leading-none">➡️</span>
                    </div>
                )}
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
                        <div className="flex flex-col gap-1.5 pt-1">
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
                                        {/* Rail-width round: no whitespace-nowrap here, unlike
                                            Upgrade/Sell/Max/targeting below — those are single,
                                            unbreakable words where any wrap is a mid-word break;
                                            "Pressure Cooker" is two real words, and forcing it onto
                                            one line at the font floor overflowed the button (83px
                                            of text in a ~64-76px box). A natural wrap at the space
                                            ("Pressure"/"Cooker") is a clean two-line label, not the
                                            defect this round exists to fix — the button is a plain
                                            flex column with no fixed height, so it just grows.
                                            w-full is what actually lets that wrap happen: the
                                            button's items-center otherwise shrink-wraps this span to
                                            its own unwrapped content width (a flex child with no
                                            explicit width sizes to fit, not to the container), so
                                            without a definite width the browser never has a reason
                                            to break the line at all. */}
                                        <span className="w-full text-center text-[0.62rem] leading-tight font-bold" style={{ fontSize: railLabelFontSize }}>{def.name}</span>
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
                                            type="button"
                                            disabled={!affordable}
                                            className={
                                                'w-full rounded-lg px-1 py-2 text-center text-[0.62rem] leading-tight font-bold whitespace-nowrap transition-transform active:scale-95 ' +
                                                (affordable ? 'bg-primary text-black' : 'bg-white/10 text-white/40')
                                            }
                                            style={{ fontSize: railLabelFontSize }}
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
                                <span
                                    className="w-full rounded-lg bg-white/10 px-1 py-2 text-center text-[0.62rem] font-bold whitespace-nowrap text-white/50"
                                    style={{ fontSize: railLabelFontSize }}
                                >
                                    Max
                                </span>
                            )}

                            {/* Disabled (not hidden) for the whole onboarding, not just
                                the forced beats — it returns once wave 3 begins. */}
                            <button
                                type="button"
                                disabled={ftueActive}
                                className={
                                    'w-full rounded-lg px-1 py-2 text-center text-[0.62rem] font-bold whitespace-nowrap text-white transition-transform active:scale-95 ' +
                                    (ftueActive ? 'bg-red-500/30 opacity-40' : 'bg-red-500/80')
                                }
                                style={{ fontSize: railLabelFontSize }}
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
                                            'min-w-0 rounded-md px-1 py-1.5 text-center text-[0.6rem] leading-tight font-semibold whitespace-nowrap transition-colors ' +
                                            (tower.targeting === mode
                                                ? 'bg-primary text-black'
                                                : 'bg-white/10 text-white/70')
                                        }
                                        style={{ fontSize: railLabelFontSize }}
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
