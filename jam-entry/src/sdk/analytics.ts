/**
 * Thin analytics wrapper — same posture as every other SDK call in this repo
 * (see runSdk.ts): guarded by sdkReady(), fire-and-forget, swallowed on
 * failure. Centralized here only to avoid repeating the try/catch/guard at
 * every call site; the pattern itself matches main.tsx's original inline
 * boot event exactly.
 */
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';
import { sdkReady } from './runSdk.ts';

/** Record a custom event. Numeric payload values must be top-level (never
 *  nested) — that's what makes them readable as percentiles. */
export function track(eventName: string, payload?: Record<string, number | string>): void {
    if (!sdkReady()) return;
    try {
        RundotGameAPI.analytics.recordCustomEvent(eventName, payload).catch(() => {});
    } catch (err) {
        console.warn('[analytics] recordCustomEvent failed', eventName, err);
    }
}

/** Register one step of a named funnel. Step numbers and funnelOrder are
 *  fixed once shipped — never renumber. */
export function trackFunnelStep(step: number, name: string, funnel: string, funnelOrder: number): void {
    if (!sdkReady()) return;
    try {
        RundotGameAPI.analytics.trackFunnelStep(step, name, funnel, funnelOrder).catch(() => {});
    } catch (err) {
        console.warn('[analytics] trackFunnelStep failed', name, err);
    }
}
