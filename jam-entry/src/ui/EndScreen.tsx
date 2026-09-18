/**
 * Run-over overlay — Round 7 item 6 (docs/Ideas.md §6d, "Ramu's debrief",
 * user's pick B): rewritten from a plain stat dump + a bright ad button
 * sitting above Retry (interface interference — a reflexive post-death tap
 * landed on the ad offer, not the button the player actually wanted) into:
 * Ramu's one-line reaction (outcome-driven face/line, ChefPortrait.tsx) →
 * an order-ticket card (count-up stats, a delta against the player's own
 * best, the gem breakdown spelled out) → Retry as the ONLY filled button,
 * behind a 600ms input lock → two ghost secondaries → the ad offer demoted
 * to its own opt-in card below everything, same gate/reward/claim path as
 * before (no economics change, presentation only).
 *
 * There is no win: after the authored waves, endless waves keep coming, so
 * every run ends here on a loss. Retry bumps runId, remounting GameCanvas
 * into a fresh engine. Mounts on tdPhase === 'lost' exactly as before.
 *
 * TODO: surface the Like/Comments prompts (src/sdk/engagement.ts) here
 * after a strong run — the SDK recommends asking after a satisfying beat.
 * They currently live on the main menu only.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { sfx, switchCue } from '../audio/audio.ts';
import { scriptedRunStart } from '../game/actions.ts';
import { CONFIG } from '../game/config.ts';
import { t, tn } from '../i18n/index.ts';
import { adsSystem } from '../sdk/ads.ts';
import { track } from '../sdk/analytics.ts';
import { addGems } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';
import ChefPortrait from './ChefPortrait.tsx';

const INPUT_LOCK_MS = 600;
const COUNT_UP_MS = 600;

type OutcomeId = 'new_best' | 'matched' | 'near_best' | 'held' | 'early';
interface Outcome {
    id: OutcomeId;
    face: 'a' | 'b' | 'c';
    line: string;
}

/** The five outcome rows, in the handover's own priority order — checked
 *  top to bottom, first match wins. `previousBest` is store.previousBestWave
 *  (captured by towerScene.ts's checkEnd BEFORE it overwrote bestWave with
 *  this run's result — see that field's own doc comment for why reading
 *  the live bestWave here would make "new best" unreachable).
 *
 * Round 8 fix 2 (docs/Ideas.md §6d, "Playtest of 1.78.0" item 2): a tie
 * (`survived === previousBest`) used to fall through into near_best's
 * `gap <= ...` check (0 always satisfies it) and render "0 short of the
 * record" — a real record equalled, described as a miss. `matched` is
 * checked here, between new_best and near_best, so a tie can never reach
 * that branch. "Held" 10 -> 20: 10 rushes "nobody would believe" oversold a
 * routine result; early is now anything short of 20, not 10. */
function computeOutcome(survived: number, previousBest: number): Outcome {
    if (survived > previousBest) {
        return { id: 'new_best', face: 'c', line: t('end.outcome.newBest') };
    }
    if (survived === previousBest) {
        return { id: 'matched', face: 'b', line: t('end.outcome.matched') };
    }
    const gap = previousBest - survived;
    if (gap <= Math.max(3, previousBest * 0.1)) {
        return { id: 'near_best', face: 'b', line: tn('end.outcome.nearBest', gap, { gap }) };
    }
    if (survived >= 20) {
        return { id: 'held', face: 'a', line: tn('end.outcome.held', survived, { n: survived }) };
    }
    return { id: 'early', face: 'a', line: t('end.outcome.early') };
}

function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(() => {
        try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
    });
    useEffect(() => {
        let mql: MediaQueryList;
        try { mql = window.matchMedia('(prefers-reduced-motion: reduce)'); } catch { return; }
        const onChange = () => setReduced(mql.matches);
        mql.addEventListener?.('change', onChange);
        return () => mql.removeEventListener?.('change', onChange);
    }, []);
    return reduced;
}

/** Animates 0 -> target once per `resetKey` (a fresh run's runId), over
 *  durationMs; reduced motion skips straight to the target. A target change
 *  AFTER that one animation has played (the ad bonus lifting gemsEarned
 *  mid-screen) snaps directly to the new value instead of replaying the
 *  intro count-up from zero — an update, not a re-trigger. */
function useCountUp(target: number, resetKey: unknown, durationMs: number, reducedMotion: boolean): number {
    const [value, setValue] = useState(reducedMotion ? target : 0);
    const lastResetKey = useRef(resetKey);
    const playedRef = useRef(false);
    useEffect(() => {
        if (lastResetKey.current !== resetKey) {
            lastResetKey.current = resetKey;
            playedRef.current = false;
        }
        if (reducedMotion) {
            playedRef.current = true;
            setValue(target);
            return;
        }
        if (playedRef.current) {
            setValue(target);
            return;
        }
        playedRef.current = true;
        let raf = 0;
        const t0 = performance.now();
        const tick = (now: number) => {
            const u = Math.min(1, (now - t0) / durationMs);
            setValue(Math.round(target * u));
            if (u < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, resetKey, reducedMotion]);
    return value;
}

/** One row of the order ticket: a label, a big value, and an optional
 *  right-aligned sub-line (the rushes-held delta, or the gems breakdown). */
function TicketRow({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
    return (
        <div className="flex items-baseline justify-between gap-3">
            <span className="text-[0.68rem] font-bold tracking-wide text-black/55 uppercase">{label}</span>
            <span className="flex flex-col items-end">
                <span className="text-xl font-bold tabular-nums text-black">{value}</span>
                {sub && <span className="text-[0.62rem] text-black/50 tabular-nums">{sub}</span>}
            </span>
        </div>
    );
}

export default function EndScreen() {
    const tdPhase = useStore((s) => s.tdPhase);
    const wave = useStore((s) => s.wave);
    const waveCount = useStore((s) => s.waveCount);
    const previousBestWave = useStore((s) => s.previousBestWave);
    const gemsEarned = useStore((s) => s.gemsEarned);
    const adBonusClaimed = useStore((s) => s.adBonusClaimed);
    const runKills = useStore((s) => s.runKills);
    const runId = useStore((s) => s.runId);
    const [confirmAd, setConfirmAd] = useState(false);
    const [busy, setBusy] = useState(false);
    const [locked, setLocked] = useState(true);
    const [claimedBonus, setClaimedBonus] = useState<number | null>(null);
    const shownAtRef = useRef<number | null>(null);
    const reducedMotion = usePrefersReducedMotion();

    const survived = wave - 1; // waves fully cleared before the fall
    const outcome = computeOutcome(survived, previousBestWave);

    // a fresh run-end always starts outside the confirm dialog
    useEffect(() => {
        setConfirmAd(false);
        setBusy(false);
        setClaimedBonus(null);
    }, [tdPhase]);

    // The 600ms input lock + end_screen_shown, both keyed on the same
    // "just arrived at the lost screen" transition — re-armed on every
    // loss (tdPhase cycles 'lost' -> 'build' -> ... -> 'lost' again on
    // Retry), never on an unrelated re-render (tdPhase only changes value
    // at those edges).
    useEffect(() => {
        if (tdPhase !== 'lost') { shownAtRef.current = null; setLocked(true); return; }
        shownAtRef.current = performance.now();
        setLocked(true);
        track('end_screen_shown', { outcome: outcome.id });
        const t = setTimeout(() => setLocked(false), INPUT_LOCK_MS);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tdPhase]);

    const survivedDisplay = useCountUp(survived, runId, COUNT_UP_MS, reducedMotion);
    const killsDisplay = useCountUp(runKills, runId, COUNT_UP_MS, reducedMotion);
    const gemsDisplay = useCountUp(gemsEarned, runId, COUNT_UP_MS, reducedMotion);

    if (tdPhase !== 'lost') return null;

    const beatCampaign = survived >= waveCount;
    const bonus = Math.ceil(gemsEarned * CONFIG.ads.gemBonusFactor);
    const ads = adsSystem();
    const offerBonus = bonus > 0 && !adBonusClaimed && !ads.capReached();
    const headerLine = beatCampaign
        ? t('end.header.overtime', { n: survived - waveCount + 1 })
        : t('end.header.lost');
    const deltaVsBest = Math.max(0, previousBestWave - survived);

    const handleRetryTap = () => {
        const ms = shownAtRef.current !== null ? performance.now() - shownAtRef.current : 0;
        track('end_retry_tapped', { ms_since_shown: Math.round(ms) });
        if (locked) return;
        sfx.click();
        switchCue('service_low');
        // Round D: the FTUE is persistent, so Retry always restarts the
        // whole script from beat 1 — whether this run died mid-FTUE
        // (unfinished) or well past it (ftueActive was already false; a
        // fresh run scripts again regardless). Same payload as MainMenu's
        // Challenge Mode button and main.tsx's cold boot (actions.ts's
        // scriptedRunStart) — already on 'playing', so only tdPhase needs
        // resetting here.
        store.patch({ tdPhase: 'build', ...scriptedRunStart() });
    };

    const claimBonus = () => {
        sfx.click();
        setBusy(true);
        void ads
            .grantReward({
                productId: 'bonus_gameover_gems',
                description: tn('ad.description', bonus, { n: bonus }),
                trigger: 'gameover_gems',
                name: t('ad.name'),
                onReward: () => {
                    const save = addGems(bonus);
                    // Captured here (not recomputed from the post-claim
                    // gemsEarned below) — `bonus` recalculated AFTER the
                    // patch would be derived from the now-inflated total
                    // and overstate itself on every future render.
                    setClaimedBonus(bonus);
                    store.patch({
                        gems: save.gems,
                        gemsEarned: gemsEarned + bonus,
                        adBonusClaimed: true,
                    });
                    sfx.upgrade();
                },
            })
            .finally(() => {
                setBusy(false);
                setConfirmAd(false);
            });
    };

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-y-auto bg-black/55 px-6 pt-safe-top pb-safe-bottom">
            {/* Ramu's line — dialogue-box styling, no Skip/continue hint:
                there's nothing to advance, it's one static line. */}
            <div className="flex w-full max-w-md items-center gap-3 rounded-2xl bg-black/80 p-3">
                <ChefPortrait size={160} variant="dialogue" face={outcome.face} />
                <p className="flex-1 self-center text-[1.05rem] leading-snug font-semibold text-white">{outcome.line}</p>
            </div>

            {/* Order ticket — cream card, the ticket idiom's own colour
                (data/levels.ts's ing-cream: #f3ead2). WaveBubbleSubmenu's
                3-sliced ui-scroll border-image was tried here first and
                dropped: border-image's `fill` slice does not reliably
                stretch to a THREE-row box's full height in this browser
                (measured: the fill and the rolled-end art both cut off
                partway down, leaving GEMS EARNED rendering with no card
                behind it at all) — that component's own boxes are shorter,
                so the same bug never showed there. A solid colour has no
                such failure mode at any height. */}
            <div className="w-full max-w-md rounded-2xl p-4" style={{ backgroundColor: '#f3ead2' }}>
                <p className="text-center text-[0.65rem] font-semibold text-black/55">{headerLine}</p>
                <div className="mt-2 flex flex-col gap-2">
                    <TicketRow
                        label={t('end.rushesHeld')}
                        value={survivedDisplay}
                        sub={
                            outcome.id === 'new_best'
                                ? <span className="font-bold text-primary">{t('end.newBest')}</span>
                                : outcome.id === 'matched'
                                    ? t('end.bestEq', { n: previousBestWave })
                                    : t('end.bestDelta', { n: previousBestWave, d: deltaVsBest })
                        }
                    />
                    <TicketRow label={t('end.dishesServed')} value={killsDisplay.toLocaleString()} />
                    <TicketRow
                        label={t('end.gemsEarned')}
                        value={t('end.gemsValue', { n: gemsDisplay })}
                        sub={
                            tn('end.gemsBreakdown', survived, { n: survived, g: CONFIG.meta.gemsPerWave }) +
                            (claimedBonus !== null ? t('end.gemsBonus', { n: claimedBonus }) : '')
                        }
                    />
                </div>
            </div>

            {/* Retry — primary, the only filled button. */}
            <button
                type="button"
                className="w-full max-w-md rounded-2xl bg-primary px-10 py-4 text-2xl font-bold text-black shadow-lg transition-transform active:scale-95"
                onClick={handleRetryTap}
            >
                {t('end.retry')}
            </button>

            {/* Secondary ghosts — outlined, no fill, same size. */}
            <div className="flex w-full max-w-md gap-3">
                <button
                    type="button"
                    className="flex-1 rounded-2xl border border-white/30 px-4 py-3 text-[1.05rem] font-bold text-white/85 transition-transform active:scale-95"
                    onClick={() => {
                        if (locked) return;
                        sfx.click();
                        store.patch({ metaOpen: true });
                    }}
                >
                    {t('end.upgradeKitchen')}
                </button>
                <button
                    type="button"
                    className="flex-1 rounded-2xl border border-white/30 px-4 py-3 text-[1.05rem] font-bold text-white/85 transition-transform active:scale-95"
                    onClick={() => {
                        if (locked) return;
                        sfx.click();
                        switchCue('menu');
                        store.patch({ phase: 'menu', selectedPad: null });
                    }}
                >
                    {t('end.menu')}
                </button>
            </div>

            {/* Ad offer — demoted to its own opt-in card, no colour of its
                own; same gate/reward/claim path as before. */}
            {claimedBonus !== null ? (
                <p className="text-[0.9rem] font-semibold text-primary">{t('end.bonusClaimed', { n: claimedBonus })}</p>
            ) : offerBonus ? (
                <button
                    type="button"
                    className="w-full max-w-md rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-3 text-[0.95rem] font-semibold text-white/85 transition-transform active:scale-95"
                    onClick={() => {
                        if (locked) return;
                        sfx.click();
                        setConfirmAd(true);
                    }}
                >
                    {t('end.doubleIt', { n: bonus })}
                </button>
            ) : null}

            {confirmAd && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-10">
                    <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-black/90 p-6">
                        <p className="text-center text-xl font-bold">
                            {tn('end.adConfirm', bonus, { n: bonus })}
                        </p>
                        <p className="text-center text-[1.1rem] text-white/60 tabular-nums">
                            {tn('end.adsLeft', ads.remainingToday(), { r: ads.remainingToday(), max: ads.maxPerDay })}
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className="flex-1 rounded-xl bg-white/10 py-3 text-[1.1rem] font-bold text-white/80 transition-transform active:scale-95"
                                onClick={() => {
                                    sfx.click();
                                    setConfirmAd(false);
                                }}
                            >
                                {t('end.adCancel')}
                            </button>
                            <button
                                type="button"
                                disabled={busy}
                                className={
                                    'flex-1 rounded-xl py-3 text-[1.1rem] font-bold transition-transform active:scale-95 ' +
                                    (busy ? 'bg-white/10 text-white/40' : 'bg-amber-500 text-black')
                                }
                                onClick={() => { if (!locked) claimBonus(); }}
                            >
                                {busy ? t('end.adLoading') : t('end.adWatch')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
