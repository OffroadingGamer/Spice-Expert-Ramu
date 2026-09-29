/**
 * Round 20 Part 2 (docs/Ideas.md §10.2 pick A): first-launch language
 * suggestion. `RundotGameAPI.system.getEnvironment().browserInfo?.language`
 * is synchronous and THROWS if called before initializeAsync() resolves —
 * same posture as profile.ts's getProfile(), so this degrades to "no
 * suggestion" (never Hindi) rather than throwing into main.tsx's boot.
 */
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';

/**
 * True when the browser/host locale suggests Hindi is the better default:
 * the language tag itself starts with "hi" (hi, hi-IN, ...), OR the region
 * is India regardless of language tag (e.g. en-IN) — an Indian-region guest
 * is worth asking even if their OS is set to English. Never throws; a
 * missing/unreadable environment reads as "no suggestion" (stays English).
 */
export function suggestsHindi(): boolean {
    try {
        const lang = RundotGameAPI.system.getEnvironment().browserInfo?.language;
        if (!lang) return false;
        const lower = lang.toLowerCase();
        return lower === 'hi' || lower.startsWith('hi-') || lower.endsWith('-in');
    } catch (err) {
        console.warn('[environment] getEnvironment() unavailable — no locale suggestion', err);
        return false;
    }
}
