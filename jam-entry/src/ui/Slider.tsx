/**
 * Round A2, task 3: shared by Settings.tsx, Hud.tsx and TestBelt.tsx's pause
 * menus. This is a named exception to KitchenMode.md §2.5's accepted-
 * duplication rule (explicit user ruling) — §2.5 still stands everywhere
 * else. `compact` only changes sizing; neither existing caller's appearance
 * changes (Settings: default, Hud: compact, both pre-dating this file).
 */
export default function Slider({ label, value, onChange, compact }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    compact?: boolean;
}) {
    return (
        <div className={compact ? 'flex w-56 flex-col gap-1' : 'flex flex-col gap-2'}>
            <div className="flex items-center justify-between">
                <span className={compact ? 'text-lg font-bold' : 'text-xl font-bold'}>{label}</span>
                <span className="text-[1.1rem] tabular-nums text-white/60">{Math.round(value * 100)}%</span>
            </div>
            <input
                type="range"
                min={0}
                max={100}
                value={Math.round(value * 100)}
                className="h-3 w-full accent-[#ff6b1a]"
                onChange={(e) => onChange(Number(e.target.value) / 100)}
            />
        </div>
    );
}
