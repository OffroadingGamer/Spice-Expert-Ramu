/**
 * Thin CDN wrapper — same posture as analytics.ts: guarded by sdkReady(),
 * swallowed on failure. In dev the SDK's MockCdnApi serves fetchAsset()
 * from public/cdn-assets/ through the Vite dev server, so this path is
 * testable on localhost even though production CDN sits behind App Check.
 */
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';
import { sdkReady } from './runSdk.ts';

/** Fetch a file from public/cdn-assets/ (relative path, no leading slash).
 *  Returns null on any failure — missing SDK, 404, timeout, network error —
 *  never throws. Callers fall back to their own default behavior. */
export async function fetchCdnAsset(path: string, timeoutMs = 15000): Promise<ArrayBuffer | null> {
    if (!sdkReady()) return null;
    try {
        const blob = await RundotGameAPI.cdn.fetchAsset(path, { timeout: timeoutMs });
        return await blob.arrayBuffer();
    } catch {
        return null;
    }
}
