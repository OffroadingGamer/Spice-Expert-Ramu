/**
 * Round 11 Part 2.3 (docs/Ideas.md §6d, "Playtest of 1.82.0"): the ranks
 * overlay rebuilt as "the service board" — period pills (Today / All time —
 * Today opens first, per-session only, never persisted), a top-3 podium,
 * a row list below it, and a sticky bottom bar showing the player's own
 * rank/score and how far they are from the rank above.
 *
 * Round 12 Part 2 (docs/Ideas.md §6d, "Playtest of 1.83.0" item 5, pick B —
 * "the pass counter"): a visual restyle only — every mechanism above
 * (fetchBoard, periods, per-(mode,period) caching, the anonymous display
 * rule, the "you" detection, the sticky-bar logic, Today-first) is
 * unchanged. The chocolate-flat look is replaced by a blurred/darkened
 * backdrop ground, a walnut board panel with a brass rim, brass podium
 * steps on a shared shelf (bottoms aligned — Round 12 Part 1's own
 * playtest note called the old podium "floating, no base"), and rows
 * styled as cream order tickets with a dotted tear edge. Orange is now
 * reserved for the sticky bar alone — see BAR/PODIUM/ROW color choices
 * below, none of which use ORANGE.
 *
 * Round 12 Part 1.1: the board pair's display copy renamed again —
 * "Dishes served" / "Waves held" (still just copy; mode KEYS `waves`/
 * `kills` are unchanged everywhere else, see sdk/leaderboard.ts's own
 * BOARD_LABELS comment).
 *
 * Round 12 Part 3: two additions folded in per Central's recommendation —
 * 3.1 the near-you slice (board.before/board.after, already fetched with
 * contextAhead/Behind 3 — see sdk/leaderboard.ts) rendered as a "···"
 * divider plus neighbor rows; 3.2 a rank-delta arrow on the player's own
 * row, comparing against state/save.ts's rankMemory (persisted, additive,
 * migration-safe like seenBeats).
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
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { sfx } from '../audio/audio.ts';
import { scriptedRunStart } from '../game/actions.ts';
import { diffAndRecordRank } from '../state/save.ts';
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
import { getBlurredBackdrop } from './blurredBackdrop.ts';
import NameDialog from './NameDialog.tsx';
import { useMenuUnit } from './useMenuUnit.ts';

// Round 12 Part 2: the restyle's own palette (docs/Ideas.md §6d, "Playtest
// of 1.83.0" item 5, look B). CHOCOLATE/CREAM match this project's existing
// --color-chocolate/--color-cream tokens exactly (see styles/app.css) —
// named as plain hex here (not var()) so they can be composed into the
// gradient/box-shadow strings below, which var() can't do for individual
// channels the way these need.
const CHOCOLATE = '#2a1d10';
const CREAM = '#fdfae7';
const TICKET = '#fbf3df';
const GOLD = '#f4d68a';
const BRASS = '#c9963a';
const WALNUT_1 = '#7a4a24';
const WALNUT_2 = '#4e2c12';
const TOMATO = '#c8401f';
const ORANGE = '#f97316';
const ORANGE_DARK = '#d95a0a';
/** Round 12 Part 2.5: the handover's own row spec names this "turmeric
 *  paper" but pairs it with hex `#f4d68a` — which is this SAME handover's
 *  own hex for GOLD above (its separate palette line gives turmeric a
 *  distinct `#d9a520`). Read as a copy-paste slip (reusing gold's hex by
 *  mistake) rather than literal instruction: gold already means "the active
 *  pill/tab" everywhere else on this screen, so painting the player's own
 *  row the identical color would blur two different meanings that this
 *  restyle otherwise keeps visually distinct. Using the named color
 *  (turmeric, #d9a520) instead — flagged here per the established precedent
 *  (Round 11's gauge-formula discrepancy) of resolving a handover-internal
 *  numeric conflict transparently rather than silently picking one.
 */
const TURMERIC = '#d9a520';
const DELTA_UP = '#16a34a';
const DELTA_DOWN = '#dc2626';

/** Unit phrase for the sticky bar's score readout, matching the handover's
 *  own worked example verbatim ("... 6,231 dishes served" / "... 106 waves
 *  held") — the mode's own renamed board-pair label, lowercased. */
const BAR_UNIT: Record<BoardMode, string> = { waves: 'waves held', kills: 'dishes served' };

function Avatar({ entry, size, bg, color }: { entry: BoardEntry; size: number; bg: string; color: string }) {
    const style = { width: size, height: size };
    if (entry.avatarUrl) {
        return (
            <img
                src={entry.avatarUrl}
                alt=""
                draggable={false}
                className="shrink-0 rounded-full object-cover"
                style={{ ...style, backgroundColor: bg }}
            />
        );
    }
    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-full font-black"
            style={{ ...style, backgroundColor: bg, color }}
        >
            {(entry.displayName || '?').charAt(0).toUpperCase()}
        </div>
    );
}

/** Round 12 Part 2.5: one row, restyled as a cream order ticket — a dotted
 *  "tear edge" 5mu in from the left (a decorative absolutely-positioned
 *  line, since CSS border-left can't itself be inset from an edge), rank in
 *  70%-chocolate, a chocolate-background avatar, chocolate-800 name, tomato
 *  score. The player's own row swaps to turmeric paper with a tomato
 *  outline (see TURMERIC's own doc above) and — Round 12 Part 3.2 — carries
 *  the rank-delta arrow right after the rank number. */
function Row({ entry, highlight, mu, delta }: { entry: BoardEntry; highlight: boolean; mu: number; delta?: number | null }) {
    return (
        <div
            className="relative flex items-center"
            style={{
                minHeight: Math.max(44, 24 * mu),
                gap: 8 * mu,
                borderRadius: 1.5 * mu,
                paddingLeft: 15 * mu,
                paddingRight: 12 * mu,
                paddingBlock: 6 * mu,
                backgroundColor: highlight ? TURMERIC : TICKET,
                border: highlight ? `2px solid ${TOMATO}` : 'none',
                boxShadow: '0 1px 0 rgba(0,0,0,0.25)',
            }}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{ left: 5 * mu, top: 3 * mu, bottom: 3 * mu, borderLeft: '2px dotted #a08a66' }}
            />
            <span
                className="shrink-0 text-right font-black tabular-nums"
                style={{ width: 24 * mu, fontSize: Math.max(11, 13 * mu), color: 'rgba(42,29,16,0.7)' }}
            >
                {entry.rank ?? '–'}
            </span>
            {highlight && delta !== undefined && delta !== null && (
                <span
                    className="shrink-0 font-black"
                    style={{ fontSize: Math.max(11, 11 * mu), color: delta > 0 ? DELTA_UP : DELTA_DOWN }}
                >
                    {delta > 0 ? `▲${delta}` : `▼${Math.abs(delta)}`}
                </span>
            )}
            <Avatar entry={entry} size={16 * mu} bg={CHOCOLATE} color={CREAM} />
            <span className="min-w-0 flex-1 truncate" style={{ fontSize: Math.max(11, 13 * mu), color: CHOCOLATE, fontWeight: 800 }}>
                {entry.displayName}
                {highlight && (
                    <span className="ml-2 font-semibold" style={{ fontSize: Math.max(11, 12 * mu), color: TOMATO }}>
                        you
                    </span>
                )}
            </span>
            <span className="shrink-0 font-black tabular-nums" style={{ fontSize: Math.max(11, 13 * mu), color: TOMATO }}>
                {entry.score.toLocaleString()}
            </span>
        </div>
    );
}

/** Round 12 Part 2.5: offline/error/empty messages "sit on one ticket" —
 *  the same TICKET paper the rows use, chocolate text (not cream — the
 *  ticket is light). */
function MessageTicket({ children, mu }: { children: ReactNode; mu: number }) {
    return (
        <div
            className="text-center"
            style={{
                padding: `${20 * mu}px ${16 * mu}px`,
                borderRadius: 10 * mu,
                backgroundColor: TICKET,
                boxShadow: '0 1px 0 rgba(0,0,0,0.25)',
            }}
        >
            {children}
        </div>
    );
}

const STEP_HEIGHT_MU: Record<1 | 2 | 3, number> = { 1: 30, 2: 20, 3: 13 };
const DISC_SIZE_MU: Record<1 | 2 | 3, number> = { 1: 40, 2: 30, 3: 30 };

/** Round 12 Part 2.4: one brass step — avatar-on-a-disc, name, score above
 *  a physical step rectangle whose height is the spec's own per-rank number
 *  (30/20/13mu); the step's face carries the rank number in chocolate. The
 *  step is the LAST element in this column, so items-end on the parent row
 *  (Podium below) aligns every column's bottom edge to the same line — the
 *  shared shelf sits flush against that line, "bottoms on the shelf" by
 *  flex construction rather than a hand-picked offset (same posture Hud.tsx
 *  and WaveBubble.tsx already use elsewhere in this codebase for exactly
 *  this class of "must never float/overlap" requirement). */
function PodiumStep({ entry, rank, highlight, mu }: { entry: BoardEntry; rank: 1 | 2 | 3; highlight: boolean; mu: number }) {
    const discSize = DISC_SIZE_MU[rank] * mu;
    return (
        <div className="flex flex-col items-center" style={{ width: 62 * mu }}>
            {/* Round 12 Part 2.4: "a small laurel glyph" — Unicode has no
                dedicated laurel-wreath character; the rosette emoji is the
                closest available glyph to a wreath/medal shape, used here
                rather than shipping new art (this round's own "no new art"
                constraint). */}
            {rank === 1 && (
                <span aria-hidden="true" style={{ fontSize: Math.max(11, 14 * mu), lineHeight: 1, marginBottom: 2 * mu }}>
                    🏵️
                </span>
            )}
            <div
                className="flex shrink-0 items-center justify-center rounded-full"
                style={{
                    width: discSize,
                    height: discSize,
                    background: `radial-gradient(circle at 35% 30%, ${GOLD}, ${BRASS})`,
                    border: `2px solid ${highlight ? TOMATO : GOLD}`,
                }}
            >
                <Avatar entry={entry} size={discSize - 8 * mu} bg="transparent" color={CHOCOLATE} />
            </div>
            <span
                className="mt-1 w-full truncate text-center font-bold"
                style={{ fontSize: Math.max(11, 11 * mu), color: CREAM, maxWidth: 60 * mu }}
            >
                {entry.displayName}
            </span>
            <span className="font-black tabular-nums" style={{ fontSize: Math.max(11, 11 * mu), color: GOLD }}>
                {entry.score.toLocaleString()}
            </span>
            <div
                className="mt-1 flex w-full items-start justify-center"
                style={{
                    height: STEP_HEIGHT_MU[rank] * mu,
                    background: `linear-gradient(180deg, ${BRASS}, #a97c33)`,
                    borderTopLeftRadius: 4 * mu,
                    borderTopRightRadius: 4 * mu,
                }}
            >
                <span className="mt-1 font-black" style={{ fontSize: Math.max(11, 12 * mu), color: CHOCOLATE }}>
                    #{rank}
                </span>
            </div>
        </div>
    );
}

/** Order #2 · #1 · #3 left-to-right (the spec's own order); the shelf below
 *  the step row is one continuous brass bar spanning the panel's own
 *  content width, not just the three columns' width — "full board width"
 *  per the spec. */
function Podium({ entries, youId, mu }: { entries: BoardEntry[]; youId: string | null; mu: number }) {
    return (
        <div className="flex flex-col">
            <div className="flex items-end justify-center" style={{ gap: 3 * mu }}>
                <PodiumStep entry={entries[1]} rank={2} highlight={entries[1].profileId === youId} mu={mu} />
                <PodiumStep entry={entries[0]} rank={1} highlight={entries[0].profileId === youId} mu={mu} />
                <PodiumStep entry={entries[2]} rank={3} highlight={entries[2].profileId === youId} mu={mu} />
            </div>
            <div style={{ height: 2.5 * mu, width: '100%', backgroundColor: BRASS, borderRadius: 2 }} />
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
    // Round 12 Part 3.2: the rank-delta to show for THIS (mode,period) open,
    // computed once per successful load (cache hit or fresh fetch alike) by
    // diffAndRecordRank — see that function's own doc in state/save.ts for
    // why a cache-hit recompute is safe (idempotent: comparing against a
    // rank already written this session just yields "no change").
    const [rankDelta, setRankDelta] = useState<number | null>(null);
    // Per-(mode,period) session cache — switching tabs back and forth reuses
    // whatever was already fetched instead of re-hitting the host each time.
    const cacheRef = useRef(new Map<string, BoardView>());
    // Round 12 Part 2.1: the pre-blurred ground image, computed once
    // (module-memoized in blurredBackdrop.ts) and read here.
    const [blurredBg, setBlurredBg] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        getBlurredBackdrop().then((url) => { if (alive) setBlurredBg(url); });
        return () => { alive = false; };
    }, []);

    useEffect(() => {
        const id = setInterval(() => setNowTick(Date.now()), 30000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (!leaderboardsAvailable()) { setState('offline'); return; }
        const key = `${mode}:${period}`;
        const cached = cacheRef.current.get(key);
        if (cached) {
            setBoard(cached);
            setState('ready');
            setRankDelta(cached.you?.rank != null ? diffAndRecordRank(key, cached.you.rank, period === 'daily') : null);
            return;
        }
        let alive = true;
        setState('loading');
        setBoard(null);
        setRankDelta(null);
        fetchBoard(mode, period).then((b) => {
            if (!alive) return;
            if (b) {
                cacheRef.current.set(key, b);
                setBoard(b);
                setState('ready');
                setRankDelta(b.you?.rank != null ? diffAndRecordRank(key, b.you.rank, period === 'daily') : null);
            } else setState('error');
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
        barLeft = period === 'daily' ? `#${rank} today · ${score.toLocaleString()} ${unit}` : `#${rank} all time · ${score.toLocaleString()} ${unit}`;
        const parts: string[] = [];
        if (gap !== null) parts.push(`${gap.toLocaleString()} to #${(rank ?? 1) - 1}`);
        if (period === 'daily') parts.push(`resets ${formatResetCountdown(nowTick)}`);
        barRight = parts.join(' · ');
    }

    return (
        <div className="absolute inset-0 z-10 flex flex-col overflow-hidden pt-safe-top">
            {/* Round 12 Part 2.1: ground — the shipped menu backdrop,
                pre-blurred+desaturated (blurredBackdrop.ts), under a
                vertical darkening gradient. Solid CHOCOLATE first so there's
                never a flash of nothing while the blur pass resolves. */}
            <div className="absolute inset-0" style={{ backgroundColor: CHOCOLATE }}>
                {blurredBg && (
                    <img src={blurredBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to bottom, rgba(26,18,12,0.55) 0%, rgba(26,18,12,0.55) 40%, ' +
                            'rgba(26,18,12,0.82) 92%, rgba(26,18,12,0.82) 100%)',
                    }}
                />
            </div>

            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                <div className="flex items-center justify-between" style={{ padding: 12 * mu }}>
                    <button
                        type="button"
                        className="font-bold transition-transform active:scale-95"
                        style={{
                            padding: `${8 * mu}px ${14 * mu}px`,
                            borderRadius: 10 * mu,
                            fontSize: Math.max(11, 16 * mu),
                            backgroundColor: 'rgba(253,250,231,0.14)',
                            color: CREAM,
                        }}
                        onClick={() => { sfx.click(); store.patch({ ranksOpen: false }); }}
                    >
                        ←
                    </button>
                    {/* Round 12 Part 2.2: gold, 1px chocolate drop, 0.08em
                        tracking — "the game's display face" is this
                        project's own existing bold system-sans stack (it
                        declares no custom font-family; see MainMenu.tsx's
                        own doc on why), so font-black is already that face. */}
                    <h2
                        className="text-center font-black uppercase"
                        style={{
                            fontSize: Math.max(11, 20 * mu),
                            color: GOLD,
                            letterSpacing: '0.08em',
                            textShadow: `1px 1px 0 ${CHOCOLATE}`,
                        }}
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
                                minHeight: 44,
                                fontSize: Math.max(11, 10 * mu),
                                backgroundColor: period === p ? GOLD : 'transparent',
                                color: period === p ? CHOCOLATE : CREAM,
                                border: period === p ? 'none' : '2px solid rgba(253,250,231,0.14)',
                                boxShadow: period === p ? 'inset 0 -3px 4px rgba(0,0,0,0.3)' : 'none',
                            }}
                            onClick={() => { sfx.click(); setPeriod(p); }}
                        >
                            {p === 'daily' ? 'Today' : 'All time'}
                        </button>
                    ))}
                </div>

                {/* Board pair — underlined text tabs; mode keys (waves/
                    kills) unchanged, only the shown label renamed. */}
                <div className="flex justify-center" style={{ gap: 20 * mu, paddingBottom: 12 * mu }}>
                    {BOARD_MODES.map((m) => (
                        <button
                            key={m}
                            type="button"
                            className="font-bold uppercase transition-opacity active:opacity-70"
                            style={{
                                fontSize: Math.max(11, 10 * mu),
                                color: CREAM,
                                textDecorationLine: 'underline',
                                textDecorationColor: mode === m ? GOLD : 'rgba(244,214,138,0.55)',
                                textDecorationThickness: '2px',
                                textUnderlineOffset: `${3 * mu}px`,
                            }}
                            onClick={() => { sfx.click(); setMode(m); }}
                        >
                            {BOARD_LABELS[m]}
                        </button>
                    ))}
                </div>

                {/* Round 12 Part 2.3: the walnut board panel, inset 5mu from
                    the sides. It scrolls internally; header/pills/tabs above
                    and the sticky bar below stay put — ordinary flex flow
                    (this panel is the one flex-1/min-h-0 child, everything
                    else is fixed-height) rather than an absolute "top: 50mu"
                    offset, so the panel can never overlap the rows above it
                    even if their own height changes (same "flow, not a
                    magic offset" posture this codebase already leans on —
                    see Hud.tsx's Round 11 WaveBubble fix). */}
                <div className="min-h-0 flex-1" style={{ paddingInline: 5 * mu, paddingBottom: 6 * mu }}>
                    <div
                        className="flex h-full touch-pan-y flex-col overflow-y-auto overscroll-contain"
                        style={{
                            borderRadius: 6 * mu,
                            border: `${1.5 * mu}px solid ${BRASS}`,
                            boxShadow: `inset 0 0 0 ${1 * mu}px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.6)`,
                            background:
                                `repeating-linear-gradient(94deg, rgba(0,0,0,.06) 0 3px, transparent 3px 11px), ` +
                                `linear-gradient(180deg, ${WALNUT_1}, ${WALNUT_2})`,
                            padding: 12 * mu,
                            gap: 10 * mu,
                        }}
                    >
                        {state === 'offline' && (
                            <MessageTicket mu={mu}>
                                <p style={{ fontSize: Math.max(11, 14 * mu), color: CHOCOLATE, fontWeight: 700 }}>
                                    Leaderboards are available in the RUN app.
                                </p>
                            </MessageTicket>
                        )}
                        {state === 'loading' && (
                            <p className="text-center" style={{ padding: '40px 0', fontSize: Math.max(11, 13 * mu), color: 'rgba(253,250,231,0.7)' }}>
                                Loading…
                            </p>
                        )}
                        {state === 'error' && (
                            <MessageTicket mu={mu}>
                                <p style={{ fontSize: Math.max(11, 14 * mu), color: CHOCOLATE, fontWeight: 700 }}>Could not load this board.</p>
                                <p className="mt-2" style={{ fontSize: Math.max(11, 12 * mu), color: 'rgba(42,29,16,0.7)' }}>
                                    Check your connection and try again.
                                </p>
                            </MessageTicket>
                        )}
                        {boardEmpty && (
                            <MessageTicket mu={mu}>
                                <p style={{ fontSize: Math.max(11, 14 * mu), color: CHOCOLATE, fontWeight: 700 }}>
                                    {period === 'daily' ? 'Nobody has clocked in today.' : 'No runs on the board yet. Be the first!'}
                                </p>
                            </MessageTicket>
                        )}
                        {state === 'ready' && board && top.length > 0 && (
                            <>
                                {hasPodium && <Podium entries={podiumEntries} youId={youId} mu={mu} />}
                                <div className="flex flex-col" style={{ gap: 4 * mu }}>
                                    {restEntries.map((e) => (
                                        <Row
                                            key={e.profileId}
                                            entry={e}
                                            highlight={e.profileId === youId}
                                            mu={mu}
                                            delta={e.profileId === youId ? rankDelta : null}
                                        />
                                    ))}
                                </div>
                                {board.you && !youInTop && (
                                    <>
                                        <p className="text-center font-black" style={{ color: 'rgba(253,250,231,0.5)' }}>···</p>
                                        <div className="flex flex-col" style={{ gap: 4 * mu }}>
                                            {board.before.map((e) => (
                                                <Row key={e.profileId} entry={e} highlight={false} mu={mu} />
                                            ))}
                                            <Row entry={board.you} highlight mu={mu} delta={rankDelta} />
                                            {board.after.map((e) => (
                                                <Row key={e.profileId} entry={e} highlight={false} mu={mu} />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Round 12 Part 2.6: sticky bar — unchanged logic, restyled to
                an orange gradient (the ONLY orange left on this screen —
                every other prior ORANGE use above is now GOLD/BRASS/TOMATO,
                per the spec). marginTop negative + z-index tucks the
                walnut panel's rounded bottom corner behind the bar's top
                edge instead of leaving a visible seam. */}
            <button
                type="button"
                disabled={!barTappable}
                className="relative z-10 flex w-full items-center justify-between text-left"
                style={{
                    minHeight: 44,
                    marginTop: -8 * mu,
                    padding: `${10 * mu}px ${16 * mu}px`,
                    paddingBottom: `calc(${10 * mu}px + env(safe-area-inset-bottom, 0px))`,
                    background: `linear-gradient(180deg, ${ORANGE}, ${ORANGE_DARK})`,
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
