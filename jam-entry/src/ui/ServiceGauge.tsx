/**
 * Round 3 (docs/Ideas.md §6a/§6d amendment, "decided: horizontal fill under
 * the wave chip"): a plain DOM bar, not a Pixi element — it lives in Hud.tsx
 * directly under the WAVE/RUSH chip, sized to match the ESCAPES+CASH row's
 * own rendered width (the widest element of that group), which Hud.tsx
 * measures live and passes down as `widthPx` rather than this component
 * re-deriving it.
 *
 * Two states only (amber below SAFE, green at or above — §6a's own
 * "red pulse when unreachable is dead logic" finding): a plain colour swap,
 * transition-colors handles the 200ms crossfade at the crossing, and
 * motion-reduce:transition-none drops that to 0ms — the same Tailwind
 * variant this codebase already uses for its animate- utilities
 * (Hud.tsx's motion-safe:animate-pulse), just the transition-property form
 * of the same idea, so no separate matchMedia hook is needed here.
 *
 * No text anywhere on this bar — the handover is explicit that a label here
 * is a sign to stop, not a hint to add one.
 */
import { useStore } from '../state/store.ts';

export default function ServiceGauge({ widthPx }: { widthPx: number }) {
    const gauge = useStore((s) => s.gauge);
    if (!gauge || widthPx <= 0) return null;

    const { units, served, safe } = gauge;
    const fillPct = units > 0 ? Math.min(1, served / units) : 0;
    const safePct = units > 0 ? Math.min(1, safe / units) : 0;
    const isSafe = served >= safe;

    return (
        <div
            id="service-gauge"
            aria-hidden="true"
            className="pointer-events-none self-start overflow-hidden rounded-full bg-black/40"
            style={{ width: widthPx, height: 8 }}
        >
            <div className="relative h-full w-full">
                <div
                    className={
                        'h-full transition-colors duration-200 motion-reduce:transition-none ' +
                        (isSafe ? 'bg-emerald-500' : 'bg-amber-400')
                    }
                    style={{ width: `${fillPct * 100}%` }}
                />
                {safe > 0 && (
                    <div
                        className="absolute top-0 h-full w-[2px] bg-white/70"
                        style={{ left: `${safePct * 100}%` }}
                    />
                )}
            </div>
        </div>
    );
}
