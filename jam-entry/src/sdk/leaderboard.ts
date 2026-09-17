/**
 * Leaderboard wrapper: TWO all-time boards as modes of one leaderboard —
 * 'kills' (most enemies defeated in a run) and 'waves' (highest wave cleared).
 * See rundot/leaderboard.config.json; the boards are created automatically
 * on `rundot deploy`. Simple security mode, server keeps each player's
 * best, so every run can be submitted.
 *
 * Posture: leaderboards only exist inside the RUN host. In plain-browser
 * dev every call resolves to null/no-op and the UI shows its offline
 * state. Nothing here ever throws.
 */
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';
import { sdkReady } from './runSdk.ts';

/** The all-time period key from rundot/leaderboard.config.json. */
const PERIOD = 'alltime';

/** `SdkLeaderboardEntry`/`SdkSubmitScoreResult` aren't re-exported from the `/api`
 *  entry point (only from a deeper, unstable chunk path) — derived here by
 *  inference off the live API surface instead of importing an unexported
 *  type name, so this stays correct if the SDK's own internal chunking
 *  ever changes. */
type SdkLeaderboardEntry = Awaited<ReturnType<typeof RundotGameAPI.leaderboard.getPodiumScores>>['context']['topEntries'][number];
type SdkSubmitScoreResult = Awaited<ReturnType<typeof RundotGameAPI.leaderboard.submitScore>>;

/** The two boards, as mode keys from rundot/leaderboard.config.json. */
export type BoardMode = 'kills' | 'waves';

export const BOARD_MODES: BoardMode[] = ['kills', 'waves'];

export const BOARD_LABELS: Record<BoardMode, string> = {
    kills: 'Enemies Defeated',
    waves: 'Waves Cleared',
};

/** True when the RUN host is present (boards can exist at all). */
export function leaderboardsAvailable(): boolean {
    return sdkReady();
}

/**
 * Round 10 Part 6: rundot/leaderboard.config.json's own antiCheat block sets
 * `minTimeBetweenSubmissionsSec: 5` — this is that real, documented number,
 * not a guess (the SDK's own `RateLimitedError` export gave no threshold on
 * its own). Space every submitScore call (across BOTH this function and
 * resubmitBestWithName below; one module-wide queue, not per-caller) at
 * least this far apart rather than ever firing two back-to-back. Reserving
 * `nextSlotAt` synchronously (before the only await) is what makes this
 * safe against two calls landing in the same tick — see spacedSubmitScore
 * below.
 */
const MIN_SUBMIT_SPACING_MS = 5000;
let nextSubmitSlotAt = 0;

async function spacedSubmitScore(params: Parameters<typeof RundotGameAPI.leaderboard.submitScore>[0]) {
    const now = Date.now();
    const slot = Math.max(now, nextSubmitSlotAt);
    nextSubmitSlotAt = slot + MIN_SUBMIT_SPACING_MS;
    const wait = slot - now;
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    try {
        return await RundotGameAPI.leaderboard.submitScore(params);
    } catch (err) {
        console.warn(`[leaderboard] ${params.mode ?? 'unknown'} submit failed`, err);
        return null;
    }
}

/**
 * Submit a finished run to both boards, fire-and-forget. The server keeps
 * each player's best per board, so every run can be submitted; zero scores
 * are skipped (the config's minScore is 1).
 *
 * Round 9 Part 4 (docs/Ideas.md §6d item 6): `guestDisplayName` — when
 * provided (a guest's chosen/assigned name only; callers pass undefined for
 * a RUN account, which submits exactly as before) — is attached as
 * `metadata: { displayName }` on BOTH board submissions, so a guest's host
 * `anonymous_<id>` username can be overridden on the board (Leaderboard.tsx
 * reads it back via toEntry's displayName below).
 */
export function submitRunScores(kills: number, wavesCleared: number, seconds: number, guestDisplayName?: string): void {
    if (!sdkReady()) return;
    const duration = Math.max(1, Math.round(seconds));
    const metadata = guestDisplayName ? { displayName: guestDisplayName } : undefined;
    const submit = (mode: BoardMode, score: number) => {
        if (score <= 0) return;
        void spacedSubmitScore({ score, duration, mode, period: PERIOD, metadata });
    };
    submit('kills', Math.floor(kills));
    submit('waves', Math.floor(wavesCleared));
}

/** Round 10 Part 6: one board's rename-resubmit outcome, for the report's
 *  before/after read. */
export interface RenameResubmitResult {
    mode: BoardMode;
    /** The player's entry on this board before resubmitting, or null if
     *  they have no ranked score on it yet (nothing to rename — skipped). */
    before: SdkLeaderboardEntry | null;
    /** The server's response to the resubmit, or null if it was skipped
     *  (no `before`) or the call itself failed. */
    after: SdkSubmitScoreResult | null;
}

/**
 * Round 10 Part 6: on rename, re-submit the player's CURRENT BEST on both
 * boards with the new `metadata.displayName` — never a new score (this must
 * never move a player's rank; it only refreshes what name their existing
 * rank shows under). "Current best" is read from the server itself
 * (getPodiumScores' own playerEntry), not derived from local save data —
 * the save only tracks bestWave, not best kills, and even bestWave is a
 * per-run local mirror that could in principle drift from whatever the
 * server actually accepted (keep-best, anti-cheat rejections, etc.) — the
 * server's own idea of "your best" is the only source that can't be wrong
 * about what's about to get relabelled. Resubmits the SAME score and
 * duration the server already has, changing only metadata — whether the
 * server refreshes metadata on an equal-score resubmit is undocumented,
 * which is exactly what this round's own live test (see the report)
 * checks. A board the player has no entry on yet is skipped outright
 * (nothing to rename).
 */
export async function resubmitBestWithName(displayName: string): Promise<RenameResubmitResult[]> {
    if (!sdkReady()) return [];
    const results: RenameResubmitResult[] = [];
    for (const mode of BOARD_MODES) {
        let before: SdkLeaderboardEntry | null = null;
        try {
            const r = await RundotGameAPI.leaderboard.getPodiumScores({
                mode, period: PERIOD, topCount: 0, contextAhead: 0, contextBehind: 0,
            });
            before = r.context.playerEntry ?? null;
        } catch (err) {
            console.warn(`[leaderboard] ${mode} rename read failed`, err);
        }
        if (!before || before.score <= 0) {
            results.push({ mode, before: null, after: null });
            continue;
        }
        const after = await spacedSubmitScore({
            score: before.score,
            duration: before.duration,
            mode,
            period: PERIOD,
            metadata: { displayName },
        });
        results.push({ mode, before, after });
    }
    return results;
}

/** One row of the board view. */
export interface BoardEntry {
    profileId: string;
    username: string;
    avatarUrl: string | null;
    rank: number | null;
    score: number;
    /** Round 9 Part 4: the name this row should actually SHOW — computed
     *  once here (not re-derived per render in Leaderboard.tsx) per the
     *  handover's own priority order: metadata.displayName (a guest who
     *  chose/was assigned a name via NameDialog.tsx) > the anonymous_<id>
     *  short form (Ideas.md §6d item 7's decided display rule — the same
     *  live-board reality the 75%-anonymous finding described) > the raw
     *  username unchanged. */
    displayName: string;
}

const ANONYMOUS_PREFIX = 'anonymous_';

/** Ideas.md §6d item 7: strip the prefix, show the id's first two chars, an
 *  ellipsis, and its last three (`u2…Bq1` style). */
function anonymousShortForm(username: string): string {
    const id = username.slice(ANONYMOUS_PREFIX.length);
    if (id.length <= 5) return id; // too short to usefully abbreviate — show as-is
    return `${id.slice(0, 2)}…${id.slice(-3)}`;
}

/** Exported for this round's own verification script (see the report) —
 *  Leaderboard.tsx never calls this directly, it reads BoardEntry.displayName. */
export function displayNameFor(username: string, metadata: Record<string, unknown> | null | undefined): string {
    const metaName = metadata?.displayName;
    if (typeof metaName === 'string' && metaName.trim().length > 0) return metaName;
    if (username.startsWith(ANONYMOUS_PREFIX)) return anonymousShortForm(username);
    return username;
}

/** Everything the leaderboard screen renders, in one shape. */
export interface BoardView {
    /** Top entries (up to 10). */
    top: BoardEntry[];
    /** The player's own entry (null if they have no ranked score yet). */
    you: BoardEntry | null;
    /** Neighbors around the player, when they are outside the top list. */
    before: BoardEntry[];
    after: BoardEntry[];
    totalPlayers: number;
}

function toEntry(e: {
    profileId: string; username: string; avatarUrl: string | null;
    rank: number | null; score: number; metadata?: Record<string, unknown> | null;
}): BoardEntry {
    return {
        profileId: e.profileId,
        username: e.username,
        avatarUrl: e.avatarUrl,
        rank: e.rank,
        score: e.score,
        displayName: displayNameFor(e.username, e.metadata),
    };
}

/**
 * Fetch one board: top 10 plus the player's surroundings, in one host
 * call. Null on failure or outside the host (UI shows offline/error).
 */
export async function fetchBoard(mode: BoardMode): Promise<BoardView | null> {
    if (!sdkReady()) return null;
    try {
        const r = await RundotGameAPI.leaderboard.getPodiumScores({
            mode,
            period: PERIOD,
            topCount: 10,
            contextAhead: 2,
            contextBehind: 2,
        });
        return {
            top: r.context.topEntries.map(toEntry),
            you: r.context.playerEntry ? toEntry(r.context.playerEntry) : null,
            before: r.context.beforePlayer.map(toEntry),
            after: r.context.afterPlayer.map(toEntry),
            totalPlayers: r.totalEntries,
        };
    } catch (err) {
        console.warn('[leaderboard] fetch failed', err);
        return null;
    }
}
