/**
 * Round 11 Part 2.3 (docs/Ideas.md §6d, "Playtest of 1.82.0"): the ranks
 * overlay rebuilt as "the service board" — chocolate ground (matching the
 * menu's own palette, not the kit's dark bg-surface this used before),
 * period pills (Today / All time — Today opens first, per-session only,
 * never persisted), the board pair renamed to "Rushes held" / "Pests
 * cleared" (display copy only — the underlying mode keys stay `waves`/
 * `kills` everywhere else: board instance ids, submitRunScores, etc — see
 * sdk/leaderboard.ts's own BOARD_LABELS comment), a top-3 podium, the
 * existing row list below it, and a sticky bottom bar showing the player's
 * own rank/score and how far they are from the rank above.
 *
 * All dimensions here are in `mu` (useMenuUnit.ts) — this overlay is a menu
 * surface, not gameplay HUD, so it follows Settings.tsx/MainMenu.tsx's own
 * unit rather than stage.ts's design units.
 *
 * Two boards (`waves`/`kills`) x two periods (`alltime`/`daily`) = four
 * independent fetches, cached per (mode, period) for the session in a ref
 * (switching tabs back and forth doesn't re-fetch). A failed daily read
 * gets its OWN error state — it must never silently fall back to rendering
 * the (differently-cached) alltime data under the Today tab's own label,
 * which would show a stale/wrong "today" board.
 *
 * Leaderboards only exist inside the RUN host, so plain-browser dev shows
 * the offline state, same as before.
 */
import { useEffect, useRef, useState } from 'react';
import { sfx } from '../audio/audio.ts';
import { scriptedRunStart } from '../game/actions.ts';
import { store, useStore } from '../state/store.ts';
import {
    BOARD_LABELS,
    BOARD_MODES,
    BOARD_PERIODS,
    fetchBoard,
    leaderboardsAvailable,
    type BoardEntry,
    type BoardMode,
    type BoardPeriod,
    type BoardView,
} from '../sdk/leaderboard.ts';
import NameDialog from './NameDialog.tsx';
import { useMenuUnit } from './useMenuUnit.ts';

const CHOCOLATE = 'var(--color-chocolate)';
const CREAM = 'var(--color-cream)';
const ORANGE = '#f97316';

/** Unit word for the sticky bar's score readout — the mode's own renamed
 *  label, lowercased and pluralized to match ("Rushes held" -> "rushes",
 *  "Pests cleared" -> "pests"). Not specified verbatim in the handover
 *  (its own worked example only wrote "rushes", the waves-mode word) — kept
 *  mode-aware since the board pair itself was just renamed for exactly this
 *  reason (one generic "score" word would read oddly under Pests Cleared). */
const BAR_UNIT: Record<BoardMode, string> = { waves: 'rushes', kills: 'pests' };

function Avatar({ entry, size }: { entry: BoardEntry; size: number }) {
    const style = { width: size, height: size };
    if (entry.avatarUrl) {
        return (
            <img
                src={entry.avatarUrl}
                alt=""
                draggable={false}
                className="shrink-0 rounded-full object-cover"
                style={{ ...style, backgroundColor: 'rgba(253,250,231,0.15)' }}
            />
        );
    }
    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-full font-black"
            style={{ ...style, backgroundColor: 'rgba(253,250,231,0.15)', color: CREAM }}
        >
            {(entry.displayName || '?').charAt(0).toUpperCase()}
        </div>
    );
}

function Row({ entry, highlight, mu }: { entry: BoardEntry; highlight: boolean; mu: number }) {
    return (
        <div
            className="flex items-center"
            style={{
                gap: 10 * mu,
                borderRadius: 10 * mu,
                padding: `${8 * mu}px ${12 * mu}px`,
                backgroundColor: highlight ? 'rgba(249,115,22,0.22)' : 'rgba(253,250,231,0.08)',
                border: highlight ? `2px solid ${ORANGE}` : '2px solid transparent',
            }}
        >
            <span
                className="shrink-0 text-right font-black tabular-nums"
                style={{ width: 26 * mu, fontSize: Math.max(11, 13 * mu), color: 'rgba(253,250,231,0.6)' }}
            >
                {entry.rank ?? '–'}
            </span>
            <Avatar entry={entry} size={30 * mu} />
            <span
                className="min-w-0 flex-1 truncate font-bold"
                style={{ fontSize: Math.max(11, 13 * mu), color: CREAM }}
            >
                {entry.displayName}
                {highlight && (
                    <span className="ml-2 font-semibold" style={{ fontSize: Math.max(11, 12 * mu), color: ORANGE }}>
                        you
                    </span>
                )}
            </span>
            <span className="shrink-0 font-black tabular-nums" style={{ fontSize: Math.max(11, 13 * mu), color: ORANGE }}>
                {entry.score}
            </span>
        </div>
    );
}

/** One podium card. `heightMu` is the spec's own per-rank height (78/66/58);
 *  rank 1 gets the orange fill+outline treatment, 2/3 a plain cream-tinted
 *  card matching this overlay's own row styling. */
function PodiumCard({ entry, rank, heightMu, highlight, mu }: {
    entry: BoardEntry; rank: 1 | 2 | 3; heightMu: number; highlight: boolean; mu: number;
}) {
    const isFirst = rank === 1;
    return (
        <div
            className="flex flex-col items-center justify-end"
            style={{
                width: 62 * mu,
                height: heightMu * mu,
                borderRadius: 12 * mu,
                padding: `${8 * mu}px ${4 * mu}px`,
                backgroundColor: isFirst ? 'rgba(249,115,22,0.25)' : 'rgba(253,250,231,0.10)',
                border: isFirst
                    ? `${2 * mu}px solid ${ORANGE}`
                    : highlight
                        ? `${2 * mu}px solid ${ORANGE}`
                        : `${1 * mu}px solid rgba(253,250,231,0.25)`,
            }}
        >
            <span className="font-black" style={{ fontSize: Math.max(11, 12 * mu), color: 'rgba(253,250,231,0.7)' }}>
                #{rank}
            </span>
            <Avatar entry={entry} size={34 * mu} />
            <span
                className="mt-1 w-full truncate text-center font-bold"
                style={{ fontSize: Math.max(11, 11 * mu), color: CREAM }}
            >
                {entry.displayName}
            </span>
            <span className="font-black tabular-nums" style={{ fontSize: Math.max(11, 13 * mu), color: ORANGE }}>
                {entry.score}
            </span>
        </div>
    );
}

/** The entry with rank === (you.rank - 1), searched across every neighbor
 *  bucket the fetch already returned (top/before/after) rather than assuming
 *  it lives in one specific bucket — true whether the player sits inside the
 *  top list or well outside it. */
function neighborAbove(board: BoardView | null): BoardEntry | null {
    if (!board?.you || board.you.rank === null || board.you.rank <= 1) return null;
    const wantRank = board.you.rank - 1;
    const all = [...board.top, ...board.before, ...board.after];
    return all.find((e) => e.rank === wantRank) ?? null;
}

/** Time left until the next UTC midnight (= 05:30 IST) — the daily period's
 *  own reset boundary — formatted as "Xh Ym". */
function formatResetCountdown(nowMs: number): string {
    const now = new Date(nowMs);
    const nextUtcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0);
    const totalMin = Math.max(0, Math.floor((nextUtcMidnight - nowMs) / 60000));
    return `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;
}

type LoadState = 'loading' | 'ready' | 'offline' | 'error';

export default function Leaderboard() {
    const isGuest = useStore((s) => s.isGuest);
    const playerName = useStore((s) => s.playerName);
    const mu = useMenuUnit();
    const [mode, setMode] = useState<BoardMode>('waves');
    // Round 11 Part 2.3: Today opens first — a per-session default, never
    // persisted (re-opening this overlay, or the app, always starts here).
    const [period, setPeriod] = useState<BoardPeriod>('daily');
    const [board, setBoard] = useState<BoardView | null>(null);
    const [state, setState] = useState<LoadState>(leaderboardsAvailable() ? 'loading' : 'offline');
    const [showNameDialog, setShowNameDialog] = useState(false);
    const [nowTick, setNowTick] = useState(() => Date.now());
    // Per-(mode,period) session cache — switching tabs back and forth reuses
    // whatever was already fetched instead of re-hitting the host each time.
    const cacheRef = useRef(new Map<string, BoardView>());

    useEffect(() => {
        const id = setInterval(() => setNowTick(Date.now()), 30000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (!leaderboardsAvailable()) { setState('offline'); return; }
        const key = `${mode}:${period}`;
        const cached = cacheRef.current.get(key);
        if (cached) { setBoard(cached); setState('ready'); return; }
        let alive = true;
        setState('loading');
        setBoard(null);
        fetchBoard(mode, period).then((b) => {
            if (!alive) return;
            if (b) { cacheRef.current.set(key, b); setBoard(b); setState('ready'); }
            else setState('error');
        });
        return () => { alive = false; };
    }, [mode, period]);

    const beginShift = () => {
        store.patch({ ranksOpen: false, phase: 'playing', ...scriptedRunStart() });
    };
    const handleStartShift = () => {
        sfx.click();
        if (isGuest && playerName === null) { setShowNameDialog(true); return; }
        beginShift();
    };

    const youId = board?.you?.profileId ?? null;
    const top = board?.top ?? [];
    const hasPodium = top.length >= 3;
    const podiumEntries = hasPodium ? top.slice(0, 3) : [];
    const restEntries = hasPodium ? top.slice(3) : top;
    const youInTop = !!(youId && top.some((e) => e.profileId === youId));
    const boardEmpty = state === 'ready' && board !== null && top.length === 0;

    const you = board?.you ?? null;
    const rank = you?.rank ?? null;
    const score = you?.score ?? 0;
    const above = neighborAbove(board);
    const gap = above ? Math.max(0, above.score - score) : null;
    const noRunToday = state === 'ready' && period === 'daily' && !you;
    const unranked = state === 'ready' && period !== 'daily' && !you;

    let barLeft: string;
    let barRight: string;
    let barTappable = false;
    if (state === 'loading') { barLeft = 'Loading…'; barRight = ''; }
    else if (state === 'offline') { barLeft = 'Ranks need the RUN app'; barRight = ''; }
    else if (state === 'error') { barLeft = 'Could not load your rank'; barRight = ''; }
    else if (noRunToday) { barLeft = 'No shift yet today — start one'; barRight = ''; barTappable = true; }
    else if (unranked) { barLeft = 'Unranked · play a shift'; barRight = ''; }
    else {
        const unit = BAR_UNIT[mode];
        barLeft = period === 'daily' ? `#${rank} today · ${score} ${unit}` : `#${rank} all time · ${score} ${unit}`;
        const parts: string[] = [];
        if (gap !== null) parts.push(`${gap} to #${(rank ?? 1) - 1}`);
        if (period === 'daily') parts.push(`resets ${formatResetCountdown(nowTick)}`);
        barRight = parts.join(' · ');
    }

    return (
        <div className="absolute inset-0 z-10 flex flex-col pt-safe-top" style={{ backgroundColor: CHOCOLATE }}>
            <div className="flex items-center justify-between" style={{ padding: 12 * mu }}>
                <button
                    type="button"
                    className="font-bold transition-transform active:scale-95"
                    style={{
                        padding: `${8 * mu}px ${14 * mu}px`,
                        borderRadius: 10 * mu,
                        fontSize: Math.max(11, 16 * mu),
                        backgroundColor: 'rgba(253,250,231,0.15)',
                        color: CREAM,
                    }}
                    onClick={() => { sfx.click(); store.patch({ ranksOpen: false }); }}
                >
                    ←
                </button>
                <h2
                    className="text-center font-black tracking-wide uppercase"
                    style={{ fontSize: Math.max(11, 20 * mu), color: CREAM }}
                >
                    Ranks
                </h2>
                <div style={{ width: 44 * mu }} />
            </div>

            {/* Period pills: Today / All time. */}
            <div className="flex justify-center" style={{ gap: 8 * mu, paddingInline: 12 * mu, paddingBottom: 10 * mu }}>
                {BOARD_PERIODS.map((p) => (
                    <button
                        key={p}
                        type="button"
                        className="font-bold transition-transform active:scale-95"
                        style={{
                            padding: `${7 * mu}px ${16 * mu}px`,
                            borderRadius: 999,
                            fontSize: Math.max(11, 13 * mu),
                            backgroundColor: period === p ? ORANGE : 'rgba(253,250,231,0.12)',
                            color: period === p ? CHOCOLATE : CREAM,
                        }}
                        onClick={() => { sfx.click(); setPeriod(p); }}
                    >
                        {p === 'daily' ? 'Today' : 'All time'}
                    </button>
                ))}
            </div>

            {/* Board pair — underlined text tabs, not filled buttons; mode
                keys (waves/kills) unchanged, only the shown label renamed. */}
            <div className="flex justify-center" style={{ gap: 20 * mu, paddingBottom: 12 * mu }}>
                {BOARD_MODES.map((m) => (
                    <button
                        key={m}
                        type="button"
                        className="font-bold transition-opacity active:opacity-70"
                        style={{
                            fontSize: Math.max(11, 14 * mu),
                            color: mode === m ? ORANGE : 'rgba(253,250,231,0.55)',
                            textDecoration: mode === m ? 'underline' : 'none',
                            textUnderlineOffset: `${3 * mu}px`,
                        }}
                        onClick={() => { sfx.click(); setMode(m); }}
                    >
                        {BOARD_LABELS[m]}
                    </button>
                ))}
            </div>

            <div
                className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain pb-safe-bottom"
                style={{ paddingInline: 12 * mu, paddingTop: 4 * mu, display: 'flex', flexDirection: 'column', gap: 10 * mu }}
            >
                {state === 'offline' && (
                    <div className="rounded-2xl text-center" style={{ padding: '40px 24px', backgroundColor: 'rgba(253,250,231,0.08)' }}>
                        <p style={{ fontSize: Math.max(11, 14 * mu), color: CREAM }}>Leaderboards are available in the RUN app.</p>
                    </div>
                )}
                {state === 'loading' && (
                    <p className="text-center" style={{ padding: '40px 0', fontSize: Math.max(11, 13 * mu), color: 'rgba(253,250,231,0.6)' }}>
                        Loading…
                    </p>
                )}
                {state === 'error' && (
                    <div className="rounded-2xl text-center" style={{ padding: '40px 24px', backgroundColor: 'rgba(253,250,231,0.08)' }}>
                        <p style={{ fontSize: Math.max(11, 14 * mu), color: CREAM }}>Could not load this board.</p>
                        <p className="mt-2" style={{ fontSize: Math.max(11, 12 * mu), color: 'rgba(253,250,231,0.55)' }}>
                            Check your connection and try again.
                        </p>
                    </div>
                )}
                {boardEmpty && (
                    <div className="rounded-2xl text-center" style={{ padding: '40px 24px', backgroundColor: 'rgba(253,250,231,0.08)' }}>
                        <p style={{ fontSize: Math.max(11, 14 * mu), color: CREAM }}>
                            {period === 'daily' ? 'Nobody has clocked in today.' : 'No runs on the board yet. Be the first!'}
                        </p>
                    </div>
                )}
                {state === 'ready' && board && top.length > 0 && (
                    <>
                        {hasPodium && (
                            <div className="flex items-end justify-center" style={{ gap: 8 * mu, paddingBottom: 4 * mu }}>
                                <PodiumCard entry={podiumEntries[1]} rank={2} heightMu={66} highlight={podiumEntries[1].profileId === youId} mu={mu} />
                                <PodiumCard entry={podiumEntries[0]} rank={1} heightMu={78} highlight={podiumEntries[0].profileId === youId} mu={mu} />
                                <PodiumCard entry={podiumEntries[2]} rank={3} heightMu={58} highlight={podiumEntries[2].profileId === youId} mu={mu} />
                            </div>
                        )}
                        <div className="flex flex-col" style={{ gap: 6 * mu }}>
                            {restEntries.map((e) => (
                                <Row key={e.profileId} entry={e} highlight={e.profileId === youId} mu={mu} />
                            ))}
                        </div>
                        {board.you && !youInTop && (
                            <>
                                <p className="text-center font-black" style={{ color: 'rgba(253,250,231,0.3)' }}>···</p>
                                <div className="flex flex-col" style={{ gap: 6 * mu }}>
                                    {board.before.map((e) => (
                                        <Row key={e.profileId} entry={e} highlight={false} mu={mu} />
                                    ))}
                                    <Row entry={board.you} highlight mu={mu} />
                                    {board.after.map((e) => (
                                        <Row key={e.profileId} entry={e} highlight={false} mu={mu} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Sticky bar — ≥44px tall, orange, always present ("the bar
                still works" even against an empty/errored board). */}
            <button
                type="button"
                disabled={!barTappable}
                className="flex w-full items-center justify-between text-left"
                style={{
                    minHeight: 44,
                    padding: `${10 * mu}px ${16 * mu}px`,
                    paddingBottom: `calc(${10 * mu}px + env(safe-area-inset-bottom, 0px))`,
                    backgroundColor: ORANGE,
                    cursor: barTappable ? 'pointer' : 'default',
                }}
                onClick={barTappable ? handleStartShift : undefined}
            >
                <span className="font-bold" style={{ fontSize: Math.max(11, 13 * mu), color: CHOCOLATE }}>
                    {barLeft}
                </span>
                {barRight && (
                    <span className="font-bold" style={{ fontSize: Math.max(11, 12 * mu), color: CHOCOLATE }}>
                        {barRight}
                    </span>
                )}
            </button>

            {showNameDialog && (
                <NameDialog onDone={() => { setShowNameDialog(false); beginShift(); }} />
            )}
        </div>
    );
}
