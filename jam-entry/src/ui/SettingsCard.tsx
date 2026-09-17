/**
 * Round 10 Part 5 (docs/Ideas.md §6d, "Playtest of 1.81.0" item 2, "Settings
 * look A · Order ticket"): the shared visual shell three cards now use —
 * Settings.tsx, Hud.tsx's rebuilt "SHIFT PAUSED" pause card (Part 7), and
 * NameDialog.tsx's rename mode (Part 6). All three are "cream card 200 mu,
 * chocolate outline 2, radius 12, padding 14, gap 9" per the spec table;
 * they differ only in title, body rows, and footer buttons — which stay in
 * each caller, not here. Extracted once three call sites needed the exact
 * same shell (KitchenMode.md §2.5's accepted-duplication rule stops
 * applying once a third consumer shows up — same threshold Slider.tsx's own
 * header comment already documents for itself).
 *
 * `CardScrim`'s tap-to-primary-action posture is shared too (Settings: tap
 * = Back; Pause: tap = Continue; rename: tap = Cancel) — every caller wants
 * "tapping outside resolves to the safe/default action", just a different
 * one, so `onTap` is the only thing that varies.
 */
import type { CSSProperties, ReactNode } from 'react';

export function CardScrim({ onTap, zIndex = 10, children }: { onTap?: () => void; zIndex?: number; children: ReactNode }) {
    return (
        <div
            // Round 10 bug fix (caught testing the pause card): Hud.tsx's
            // own root wrapper is pointer-events-none (every interactive
            // control there opts back in individually — see that file's
            // header comment), and this card is mounted INSIDE it for the
            // pause case. Without an explicit pointer-events-auto here, the
            // scrim silently let every tap fall through to the canvas
            // underneath instead of ever calling onTap — Settings.tsx and
            // RenameDialog.tsx aren't nested under a pointer-events-none
            // ancestor, so they didn't need this, but it's harmless there
            // too and keeps this shell correct regardless of where it's
            // mounted.
            className="pointer-events-auto absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(42,29,16,0.6)', zIndex }}
            onClick={onTap}
        >
            {children}
        </div>
    );
}

export function Card({ mu, children }: { mu: number; children: ReactNode }) {
    return (
        <div
            className="flex flex-col items-stretch"
            style={{
                width: 200 * mu,
                backgroundColor: 'var(--color-cream)',
                color: 'var(--color-chocolate)',
                borderRadius: 12 * mu,
                padding: 14 * mu,
                gap: 9 * mu,
                border: `${2 * mu}px solid var(--color-chocolate)`,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );
}

export function CardTitle({ mu, children }: { mu: number; children: ReactNode }) {
    return (
        <h2 className="text-center uppercase" style={{ fontSize: 16 * mu, fontWeight: 900 }}>
            {children}
        </h2>
    );
}

/** Dashed row divider — chocolate 30%, 2 wide (per spec, not mu-scaled: a
 *  dashed rule reads the same regardless of card scale, and a thicker dash
 *  at high mu would start competing with the 2*mu solid card outline). */
export function CardDivider() {
    return <div style={{ borderTop: '2px dashed rgba(42,29,16,0.3)' }} />;
}

export function CardCredit({ mu }: { mu: number }) {
    return (
        <p className="text-center" style={{ fontSize: Math.max(11, 8 * mu), color: 'rgba(42,29,16,0.7)' }}>
            Backdrop art — Archita Sharma (@arc_inmotion)
        </p>
    );
}

/** Chocolate-outline-on-cream ghost button — Settings' Back, the rename
 *  dialog's Cancel. Pause's own Continue/Main Menu buttons are NOT ghosts
 *  (they're filled, per Part 7's own colours) so they don't use this. */
export function CardGhostButton({ mu, onClick, style, children }: {
    mu: number;
    onClick: () => void;
    style?: CSSProperties;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            className="font-bold transition-transform active:scale-95"
            style={{
                padding: `${9 * mu}px ${6 * mu}px`,
                fontSize: 11 * mu,
                borderRadius: 10 * mu,
                border: `${2 * mu}px solid var(--color-chocolate)`,
                backgroundColor: 'transparent',
                color: 'var(--color-chocolate)',
                ...style,
            }}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
