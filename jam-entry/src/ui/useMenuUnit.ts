/**
 * The menu's scale unit (Round 8b, docs/Retro.md lesson 111): a mock drawn
 * in a 240x520 phone frame has its own pixels, not device pixels — `mu`
 * converts one to the other. `mu = clamp(1, min(innerWidth/240,
 * innerHeight/520), 3)`, recomputed on resize/orientation. Every menu-style
 * dimension is `value * mu`.
 *
 * Round 9 Part 2: lifted out of MainMenu.tsx (which was the only consumer
 * through Round 8b) into its own file per the handover — Settings.tsx's new
 * dialog card needs the same unit, and duplicating this small a hook per
 * file (Round 8b's own posture, matching usePrefersReducedMotion elsewhere)
 * stops making sense once a SECOND file needs it.
 */
import { useEffect, useState } from 'react';

const MOCK_W = 240;
const MOCK_H = 520;
const MU_MIN = 1;
const MU_MAX = 3;

function computeMu(): number {
    try {
        const raw = Math.min(window.innerWidth / MOCK_W, window.innerHeight / MOCK_H);
        return Math.min(MU_MAX, Math.max(MU_MIN, raw));
    } catch {
        return MU_MIN;
    }
}

export function useMenuUnit(): number {
    const [mu, setMu] = useState(computeMu);
    useEffect(() => {
        const onResize = () => setMu(computeMu());
        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
        };
    }, []);
    return mu;
}
