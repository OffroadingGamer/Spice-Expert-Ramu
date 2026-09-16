/**
 * Round 4 Part D (docs/Ideas.md §6d, "user picked B", Sep 16 2026): the
 * service gauge becomes a ring around the 44px chef-head button instead of
 * a bar under the WAVE chip (Round 3's ServiceGauge.tsx — deleted this
 * round). Same store.gauge and towerScene.ts's syncGauge(), unchanged; only
 * the renderer moves. Mounted by Hud.tsx as a 52px absolute layer behind
 * the (44px) #chef-head-button, inside a shared wrapper that sizes both.
 *
 * SVG <circle> with stroke-dasharray/dashoffset for the fill arc, drawn
 * clockwise from 12 o'clock by rotating the whole circle -90deg (SVG draws
 * a plain circle starting at 3 o'clock). Two states only — amber below
 * SAFE, green at or above (the same "red pulse when unreachable is dead
 * logic" finding ServiceGauge.tsx's own doc established still holds; §6a).
 * The SAFE tick is a short radial line at safe/units of the way around,
 * hidden when safe is 0 (nothing to mark — any single kill already
 * guarantees survival at that point).
 *
 * Muted overrides both fill colours with a flat grey regardless of
 * served/safe — dialogueController.ts's own isDialogueMuted() is a plain
 * module read, invisible to React, so store.dialogueMuted (added this
 * round, kept in sync by mute/unmuteDialogue) is what makes this reactive.
 */
import { useStore } from '../state/store.ts';

const SIZE = 52;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

const TRACK_COLOR = 'rgba(0,0,0,.45)';
const AMBER = '#fbbf24';
const GREEN = '#34d399';
const GREY = '#6b6b70';
const TICK_COLOR = 'rgba(255,255,255,.9)';

export default function ServiceRing() {
    const gauge = useStore((s) => s.gauge);
    const muted = useStore((s) => s.dialogueMuted);

    const units = gauge?.units ?? 0;
    const served = gauge?.served ?? 0;
    const safe = gauge?.safe ?? 0;
    const fillFrac = units > 0 ? Math.min(1, served / units) : 0;
    const safeFrac = units > 0 ? Math.min(1, safe / units) : 0;
    const isSafe = served >= safe;
    const fillColor = muted ? GREY : isSafe ? GREEN : AMBER;
    const dashOffset = CIRCUMFERENCE * (1 - fillFrac);

    const safeAngle = safeFrac * 2 * Math.PI - Math.PI / 2;
    const tickInner = RADIUS - STROKE / 2 - 1;
    const tickOuter = RADIUS + STROKE / 2 + 1;

    return (
        <svg
            aria-hidden="true"
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="pointer-events-none absolute inset-0"
        >
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke={TRACK_COLOR} strokeWidth={STROKE} />
            {/* gauge === null (no engine yet, or tdPhase 'lost') -> track
                only, per the handover. Build phase's forecast (served: 0)
                still renders this circle, just at 0% fill — visually
                indistinguishable from track-only, functionally correct. */}
            {gauge && (
                <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke={fillColor}
                    strokeWidth={STROKE}
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="butt"
                    transform={`rotate(-90 ${CENTER} ${CENTER})`}
                    className="transition-[stroke] duration-200"
                />
            )}
            {gauge && safe > 0 && (
                <line
                    x1={CENTER + tickInner * Math.cos(safeAngle)}
                    y1={CENTER + tickInner * Math.sin(safeAngle)}
                    x2={CENTER + tickOuter * Math.cos(safeAngle)}
                    y2={CENTER + tickOuter * Math.sin(safeAngle)}
                    stroke={TICK_COLOR}
                    strokeWidth={2}
                />
            )}
        </svg>
    );
}
