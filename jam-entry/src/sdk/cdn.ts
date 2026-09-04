/**
 * Thin CDN wrapper — same posture as analytics.ts: guarded by sdkReady(),
 * swallowed on failure. In dev the SDK's MockCdnApi serves fetchAsset()
 * from public/cdn-assets/ through the Vite dev server, so this path is
 * testable on localhost even though production CDN sits behind App Check.
 * Never throws — returns a classified result; callers switch on `reason`
 * and fall back to their own default behavior.
 */
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';
import { sdkReady } from './runSdk.ts';

/** Why a CDN fetch failed. 'unavailable' means the SDK isn't up (off-host
 *  local dev); 'timeout' means our own deadline fired first; 'fetch' is
 *  everything else — 404, network error, malformed response. */
export type CdnFailure = 'unavailable' | 'timeout' | 'fetch';

export type CdnResult =
    | { ok: true; data: ArrayBuffer }
    | { ok: false; reason: CdnFailure };

/** Give the SDK a deadline this much longer than ours, so our timer is the
 *  one that classifies a hang. Any SDK rejection that lands first is then a
 *  genuine fetch failure rather than a race we misread as one. */
const SDK_TIMEOUT_SLACK_MS = 5000;

/** Fetch a file from public/cdn-assets/ (relative path, no leading slash).
 *  Never throws — callers switch on `reason` and fall back themselves. */
export async function fetchCdnAsset(path: string, timeoutMs = 15000): Promise<CdnResult> {
    if (!sdkReady()) return { ok: false, reason: 'unavailable' };

    let timer: ReturnType<typeof setTimeout> | undefined;

    // .catch() is attached HERE rather than awaited below: if the timer wins
    // the race, this promise is still in flight, and a later rejection with
    // no handler is an unhandled rejection — which crashes the game (see the
    // posture note at the top of runSdk.ts).
    const fetching = RundotGameAPI.cdn
        .fetchAsset(path, { timeout: timeoutMs + SDK_TIMEOUT_SLACK_MS })
        .then((blob) => blob.arrayBuffer())
        .then((data): CdnResult => ({ ok: true, data }))
        .catch((): CdnResult => ({ ok: false, reason: 'fetch' }));

    const timing = new Promise<CdnResult>((resolve) => {
        timer = setTimeout(() => resolve({ ok: false, reason: 'timeout' }), timeoutMs);
    });

    try {
        return await Promise.race([fetching, timing]);
    } finally {
        clearTimeout(timer);
    }
}
