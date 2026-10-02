/**
 * Round 24: the daily-reward popup — opened from MainMenu's new button,
 * same "overlay card over the dimmed menu" shell Settings.tsx/RenameDialog.tsx
 * already use (SettingsCard.tsx). Pure state API underneath
 * (sdk/dailyRewards.ts / systems/dailyRewards.ts), consumed directly here per
 * that system's own "UI adaptation" guidance for a non-DOM-template host.
 *
 * Ticks once a second while open so the countdown counts down and a claim
 * becomes tappable the instant local midnight (trusted clock) passes,
 * without re-subscribing the whole app's store to a 1Hz field it would
 * otherwise never need.
 */
import { useEffect, useState } from 'react';
import { sfx } from '../audio/audio.ts';
import { t } from '../i18n/index.ts';
import { track } from '../sdk/analytics.ts';
import { claimDailyReward, dailyRewardsSystem, DAILY_REWARDS } from '../sdk/dailyRewards.ts';
import { formatCountdown, refreshServerTime } from '../shared/serverTime.ts';
import { store } from '../state/store.ts';
import { Card, CardDivider, CardGhostButton, CardScrim, CardTitle } from './SettingsCard.tsx';
import { useMenuUnit } from './useMenuUnit.ts';

export default function DailyRewards() {
    const mu = useMenuUnit();
    const sys = dailyRewardsSystem();
    // Bumped once a second (countdown) and after every claim — the system's
    // own state lives in the save, outside the React store, so nothing else
    // would tell this component to re-render on either event.
    const [tick, setTick] = useState(0);

    useEffect(() => {
        // Re-sample on EVERY open, not just boot — this is exactly where the
        // claim gate gets judged (systems/dailyRewards.ts's own header doc).
        void refreshServerTime();
        track('daily_reward_shown', { day: sys.nextIndex() + 1, claimable: sys.canClaimNow() ? 1 : 0 });
        const id = setInterval(() => setTick((n) => n + 1), 1000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const close = () => { sfx.click(); store.patch({ dailyRewardsOpen: false }); };

    const handleClaim = () => {
        sfx.click();
        claimDailyReward();
        setTick((n) => n + 1); // force the tile grid + CTA to re-read fresh state
    };

    const claimedCount = sys.nextIndex() === -1 ? DAILY_REWARDS.length : sys.nextIndex();
    const canClaim = sys.canClaimNow();
    const complete = sys.isComplete();

    return (
        <CardScrim onTap={close} zIndex={10}>
            <Card mu={mu}>
                <CardTitle mu={mu}>{t('dailyRewards.title')}</CardTitle>
                {/* `tick` isn't read for its value — it exists purely to
                    force this subtree to re-read the save-backed system
                    state (outside the React store) once a second and right
                    after a claim; keying on it documents that dependency
                    instead of leaving the setState call looking pointless. */}
                <div key={tick} className="grid grid-cols-4" style={{ gap: 6 * mu }}>
                    {DAILY_REWARDS.map((def, i) => {
                        const claimed = i < claimedCount;
                        const isNext = i === claimedCount;
                        const claimableTile = isNext && canClaim;
                        return (
                            <div
                                key={def.day}
                                className="flex flex-col items-center justify-center"
                                style={{
                                    gridColumn: def.milestone ? 'span 4' : undefined,
                                    padding: `${6 * mu}px ${4 * mu}px`,
                                    borderRadius: 8 * mu,
                                    border: `${mu < 1.5 ? 1 : 1 * mu}px solid var(--color-chocolate)`,
                                    backgroundColor: claimed
                                        ? 'rgba(42,29,16,0.15)'
                                        : claimableTile
                                            ? '#f97316'
                                            : 'rgba(42,29,16,0.05)',
                                    opacity: claimed ? 0.6 : 1,
                                }}
                            >
                                <span style={{ fontSize: 9 * mu, fontWeight: 700 }}>
                                    {t('dailyRewards.day', { n: def.day })}
                                </span>
                                <span style={{ fontSize: 13 * mu, fontWeight: 900 }}>
                                    +{def.amount} 💎
                                </span>
                                {claimed && (
                                    <span style={{ fontSize: 9 * mu }}>✓</span>
                                )}
                            </div>
                        );
                    })}
                </div>
                <CardDivider />
                {complete ? (
                    <p className="text-center" style={{ fontSize: 11 * mu, fontWeight: 700 }}>
                        {t('dailyRewards.complete')}
                    </p>
                ) : canClaim ? (
                    <button
                        type="button"
                        className="font-bold shadow-lg transition-transform active:scale-95"
                        style={{
                            padding: `${10 * mu}px ${6 * mu}px`,
                            fontSize: 12 * mu,
                            borderRadius: 10 * mu,
                            backgroundColor: '#f97316',
                            color: 'var(--color-chocolate)',
                            border: `${1 * mu}px solid var(--color-chocolate)`,
                        }}
                        onClick={handleClaim}
                    >
                        {t('dailyRewards.claim')}
                    </button>
                ) : (
                    <p className="text-center" style={{ fontSize: 11 * mu, fontWeight: 700 }}>
                        {t('dailyRewards.nextIn', { time: formatCountdown(sys.msUntilNextClaim()) })}
                    </p>
                )}
                <CardGhostButton mu={mu} onClick={close} style={{ textAlign: 'center' }}>
                    {t('settings.back')}
                </CardGhostButton>
            </Card>
        </CardScrim>
    );
}
