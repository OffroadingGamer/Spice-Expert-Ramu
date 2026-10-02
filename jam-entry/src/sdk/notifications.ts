/**
 * Round 24: this game's return-notification instance — systems/notifications.ts
 * (the reusable core) wired to this game's settings toggle and locale.
 *
 * Reminder catalogue (derived from the game's own return-trigger moments —
 * see docs/Agent Returns.md Round 24 for why these two and not more):
 *   - 're-engagement': the generic "come back and keep cooking" nudge. Every
 *     game gets this one. Slides 24h past the last activity (boot, resume,
 *     end of run — see rescheduleReEngagement's call sites).
 *   - The daily reward's own come-back-tomorrow nudge is a SEPARATE id
 *     ('daily_reward'), scheduled directly by sdk/dailyRewards.ts against the
 *     systems/dailyRewards.ts machinery (its own README: "schedules its own
 *     daily_reward reminder directly against the SDK, without going through
 *     this factory"). Custom-id dedupe means the two can't stomp each other;
 *     this module's isOptedIn() gate is the thing BOTH route through (see
 *     that file's own scheduleReminderIfOptedIn).
 *
 * Deliberately NOT added: a reminder for the rewarded-ads daily cap
 * resetting. The ads cap (systems/ads.ts) is a soft throttle the player never
 * explicitly "consumes" and comes back to collect — unlike a cooldown-gated
 * reward, there's nothing concrete waiting for them, so a reminder for it
 * would be inventing a mechanic to have something to notify about (the
 * brief's own warning), not deriving one from an existing return-trigger.
 *
 * Lazy singleton, same posture as sdk/ads.ts's adsSystem().
 */
import { createNotifications, type NotificationsSystem } from '../systems/notifications.ts';
import { getSave } from '../state/save.ts';
import { t } from '../i18n/index.ts';

let _notifications: NotificationsSystem | null = null;

/** The game's own opt-out gate — pre-Round-24 saves have no field at all,
 *  so `!== false` defaults them to opted in (the same posture setSaveLocale
 *  and the other additive-save-field rounds use). Shared with
 *  sdk/dailyRewards.ts's own reminder, per this file's header doc. */
export function notificationsOptedIn(): boolean {
    return getSave().notificationsEnabled !== false;
}

export function notificationsSystem(): NotificationsSystem {
    if (_notifications) return _notifications;
    _notifications = createNotifications({
        isOptedIn: notificationsOptedIn,
        reminders: {
            're-engagement': {
                // Resolved at SCHEDULE time, not import time, so a language
                // switch mid-session (or between sessions) is reflected —
                // same reasoning systems/notifications.ts's own header gives
                // for Resolvable<T>.
                title: () => t('notif.reengagement.title'),
                body: () => t('notif.reengagement.body'),
                delaySeconds: 24 * 60 * 60,
            },
        },
    });
    return _notifications;
}
