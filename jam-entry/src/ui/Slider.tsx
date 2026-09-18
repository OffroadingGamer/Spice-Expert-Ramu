import type { CSSProperties } from 'react';
import { t } from '../i18n/index.ts';

/**
 * Round A2, task 3: shared by Settings.tsx, Hud.tsx and TestBelt.tsx's pause
 * menus. This is a named exception to KitchenMode.md §2.5's accepted-
 * duplication rule (explicit user ruling) — §2.5 still stands everywhere
 * else. `compact` only changes sizing; TestBelt.tsx's own pause menu
 * (untouched this round, out of scope) keeps calling this with neither
 * `compact` nor `theme`, so its plain dark/native-range look is unaffected
 * by anything below.
 *
 * Round 9 Part 2: `theme` added — the percentage readout was hardcoded
 * `text-white/60`, invisible against Settings.tsx's new cream dialog card.
 *
 * Round 10 Part 5 (docs/Ideas.md §6d, "Playtest of 1.81.0" item 2, "Settings
 * look A · Order ticket"): `theme="cream"` now also fully re-skins the
 * native `<input type=range>` itself via app.css's `.slider-cream` rules
 * (track 8mu chocolate 15%, orange fill, 16mu cream knob with a 2.5
 * chocolate stroke) — this is a CSS-pseudo-element skin
 * (::-webkit-slider-thumb / ::-moz-range-thumb, etc.), which can't be
 * expressed as inline style or a Tailwind utility, hence the dedicated
 * app.css block. Sizing rides `mu` (the same unit as the rest of the "look
 * A" card) via CSS custom properties set inline here, not hardcoded in
 * app.css, so the skin scales with the card exactly like every other
 * dimension in it. `mu` defaults to 1 for TestBelt/Hud's plain 'dark' theme,
 * which never reads it. The percentage moves into a small pill ("value
 * chip") for theme="cream", replacing the old plain text-only readout.
 * Native drag/keyboard behaviour is untouched — only ::pseudo-element
 * *appearance* is overridden, never the underlying input's own interaction
 * model.
 */
export default function Slider({ label, value, onChange, compact, theme = 'dark', mu = 1 }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    compact?: boolean;
    theme?: 'dark' | 'cream';
    mu?: number;
}) {
    const pct = Math.round(value * 100);
    const trackH = 8 * mu;
    const knobH = 16 * mu;
    const knobStroke = 2.5 * mu;
    // Touch target >= 44px (the round's own floor) via vertical padding on
    // the input itself, not a taller track — the track stays 8mu, exactly
    // per spec, while the input's own layout box (appearance:none makes it
    // a plain block box, so padding works normally) grows to swallow the
    // difference. Never negative: a large mu can already clear 44 on its own.
    const touchPad = Math.max(0, (44 - trackH) / 2);
    const sliderStyle = theme === 'cream'
        ? ({
            '--slider-track-h': `${trackH}px`,
            '--slider-knob': `${knobH}px`,
            '--slider-knob-stroke': `${knobStroke}px`,
            '--slider-pct': `${pct}%`,
            '--slider-pad': `${touchPad}px`,
        } as CSSProperties)
        : undefined;
    return (
        <div className={compact ? 'flex w-56 flex-col gap-1' : 'flex flex-col gap-2'}>
            <div className="flex items-center justify-between">
                <span className={compact ? 'text-lg font-bold' : 'text-xl font-bold'}>{label}</span>
                {theme === 'cream' ? (
                    <span
                        className="rounded-full font-bold tabular-nums"
                        style={{
                            fontSize: 10 * mu,
                            padding: `${2 * mu}px ${7 * mu}px`,
                            backgroundColor: 'rgba(42,29,16,0.12)',
                            color: 'var(--color-chocolate)',
                        }}
                    >
                        {t('settings.pct', { pct })}
                    </span>
                ) : (
                    <span className="text-[1.1rem] tabular-nums text-white/60">{t('settings.pct', { pct })}</span>
                )}
            </div>
            <input
                type="range"
                min={0}
                max={100}
                value={pct}
                className={theme === 'cream' ? 'slider-cream w-full' : 'h-3 w-full accent-[#ff6b1a]'}
                style={sliderStyle}
                onChange={(e) => onChange(Number(e.target.value) / 100)}
            />
        </div>
    );
}
