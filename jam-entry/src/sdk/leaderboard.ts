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
        try {
            RundotGameAPI.leaderboard
                .submitScore({ score, duration, mode, period: PERIOD, metadata })
                .catch((err) => console.warn(`[leaderboard] ${mode} submit failed`, err));
        } catch (err) {
            console.warn(`[leaderboard] ${mode} submit failed`, err);
        }
    };
    submit('kills', Math.floor(kills));
    submit('waves', Math.floor(wavesCleared));
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
