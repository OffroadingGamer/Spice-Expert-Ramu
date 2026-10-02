/**
 * Round 24: this game's daily-reward instance — systems/dailyRewards.ts (the
 * reusable track) wired to this game's save and gem economy.
 *
 * Track (7 gems-only slots, no new currency/bonus type — the brief's own
 * warning against inventing progression systems this round): amounts scale
 * with CONFIG.meta.gemsPerWave (4 gems/wave clear) so a week of logins pays
 * out on the same order as one good run, never more. Day 7 is marked
 * `milestone: true` for the reference UI's bigger tile, but it's still a
 * plain gem grant — nothing permanent, nothing re-derived at bonus-compute
 * time, because this game doesn't have a global-multiplier bonus system to
 * hook into and inventing one would be exactly the "add progression
 * systems" the brief says not to do.
 *
 * No unlock gate (isUnlocked omitted => always unlocked): this game tracks
 * no "games played"-shaped stat to gate on (grepped — the closest is
 * bestWave, which only reflects a FINISHED run, not a count), and the
 * daily-rewards skill's own guidance is "default to always-unlocked rather
 * than adding a stat just for this."
 *
 * Lazy singleton, same posture as sdk/ads.ts's adsSystem().
 */
import { createDailyRewards, type DailyRewards, type RewardDef } from '../systems/dailyRewards.ts';
import { getSave, addGems } from '../state/save.ts';
import { notificationsOptedIn } from './notifications.ts';
import { track } from './analytics.ts';
import { t } from '../i18n/index.ts';

export interface GemReward extends RewardDef {
    day: number;
    amount: number;
}

export const DAILY_REWARDS: GemReward[] = [
    { day: 1, amount: 8 },
    { day: 2, amount: 10 },
    { day: 3, amount: 12 },
    { day: 4, amount: 15 },
    { day: 5, amount: 18 },
    { day: 6, amount: 22 },
    { day: 7, amount: 40, milestone: true },
];

let _dailyRewards: DailyRewards<GemReward> | null = null;

export function dailyRewardsSystem(): DailyRewards<GemReward> {
    if (_dailyRewards) return _dailyRewards;
    _dailyRewards = createDailyRewards<GemReward>({
        rewards: DAILY_REWARDS,
        getState: () => getSave().dailyRewards,
        applyReward(def) {
            // addGems() both mutates the save and flushes it — the single
            // flush that also persists claimNext()'s own in-place mutation
            // of this same save's `dailyRewards` field (see that function's
            // own doc: it mutates `state()` directly, which IS
            // getSave().dailyRewards, not a copy).
            addGems(def.amount);
        },
        notification: {
            // Resolved once here (not Resolvable<T> — systems/dailyRewards.ts
            // doesn't support a function form for this field), which is fine:
            // scheduleReminder() is always called fresh, right after a claim,
            // never at import time, so the CURRENT locale is already baked
            // into the string it schedules.
            title: t('notif.dailyReward.title'),
            body: t('notif.dailyReward.body'),
        },
    });
    return _dailyRewards;
}

/**
 * The claim chokepoint — DailyRewards.tsx's claim button calls this, not
 * dailyRewardsSystem().claimNext() directly, so the gem grant, telemetry,
 * and reminder re-arm can never be forgotten at a call site. Returns the
 * claimed def (for the UI's toast/animation), or null if claiming wasn't
 * allowed (stale double-tap — the button is disabled in that state, but this
 * never trusts the UI, same posture as save.ts's buyScroll/buyMetaUpgrade).
 */
export function claimDailyReward(): GemReward | null {
    const def = dailyRewardsSystem().claimNext();
    if (!def) return null;
    track('daily_reward_claimed', { day: def.day, amount: def.amount });
    void scheduleDailyReminderIfOptedIn();
    return def;
}

/** systems/dailyRewards.ts's scheduleReminder() has no opt-out gate of its
 *  own (it only takes isComplete() into account) — this wrapper is what
 *  makes the daily-reward reminder respect the SAME settings toggle as the
 *  re-engagement one (sdk/notifications.ts's header doc: "one rule spans
 *  systems"). cancelReminder() is intentionally NOT wrapped — cancel must
 *  always work regardless of opt-out (systems/notifications.ts's own
 *  cancel() posture). */
export function scheduleDailyReminderIfOptedIn(): Promise<void> {
    if (!notificationsOptedIn()) return Promise.resolve();
    return dailyRewardsSystem().scheduleReminder();
}
