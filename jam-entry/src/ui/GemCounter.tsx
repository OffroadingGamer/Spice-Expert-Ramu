/**
 * The gem balance chip, shared by the main menu (top-left) and the upgrades
 * screen header.
 */
import { useStore } from '../state/store.ts';

export interface GemCounterProps {
    /** Round 8 (docs/Ideas.md §9 palette table): the menu's own chip surface
     *  ("chocolate 85% surface, cream text") — opt-in so MetaUpgrades'
     *  header (the other caller) keeps its existing look. */
    chocolate?: boolean;
    /** Round 8b: the menu's scale unit (MainMenu.tsx's useMenuUnit —
     *  mock-frame px * mu = device px). Required when `chocolate` is true;
     *  meaningless otherwise, since the non-menu variant has no mu concept. */
    mu?: number;
}

export default function GemCounter({ chocolate, mu = 1 }: GemCounterProps = {}) {
    const gems = useStore((s) => s.gems);
    if (chocolate) {
        return (
            <div
                className="flex items-center font-semibold tabular-nums text-cream"
                style={{
                    padding: `${7 * mu}px ${11 * mu}px`,
                    fontSize: 12 * mu,
                    borderRadius: 9 * mu,
                    // Round 8b's own acceptance rule ("≥44px tall
                    // everywhere") is the harder constraint of the two: the
                    // padding/font formula alone already clears it above
                    // mu~1.55 (≈48px at 403 wide, the spec's own number),
                    // but dips just under 44px at the mu floor (360 wide) —
                    // this is a floor UNDER that formula, not a replacement.
                    minHeight: 44,
                    backgroundColor: 'rgba(42, 29, 16, 0.85)',
                }}
            >
                💎 {gems.toLocaleString()}
            </div>
        );
    }
    return (
        <div className="flex h-12 items-center rounded-xl bg-black/40 px-4 text-[1.1rem] font-semibold tabular-nums text-white/90">
            💎 {gems.toLocaleString()}
        </div>
    );
}
