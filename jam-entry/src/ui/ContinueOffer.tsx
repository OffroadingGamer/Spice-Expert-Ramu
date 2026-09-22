/**
 * Round 15 Part 1 (docs/Ideas.md §10.3 pick A, no-nerf variant): the "Continue
 * the shift?" card — offered once per run, on the first loss, when a
 * rewarded ad actually exists to show (EndScreen.tsx does the availability
 * check and only mounts this when it resolved true). Built on the shared
 * SettingsCard.tsx shell (same "cream card 200mu" posture as the pause card
 * and Settings), not a bespoke layout.
 *
 * Owns exactly one outcome each for its two buttons:
 *   - Watch: ads.grantReward() (the same three-path ad/subscription/RunBucks
 *     chokepoint EndScreen.tsx's own gem-bonus offer already uses, sharing
 *     ITS SAME daily cap — systems/ads.ts's one game-wide budget, not two).
 *     onReward only fires once the player actually paid (watched, or
 *     skipped-as-subscriber, or spent RunBucks) — that's this round's
 *     "showRewardedAdAsync() resolves true" gate, routed through the
 *     established chokepoint rather than the raw SDK call. A false/failed/
 *     cancelled resolve is "anything else" — straight to onClose (the normal
 *     end screen).
 *   - Close the kitchen: declines outright, same onClose.
 *
 * onClose never itself decides between "offer was declined" and "ad
 * unavailable" — EndScreen.tsx already only mounts this component when an ad
 * IS available, so the only way onClose fires from in here is a decline or a
 * failed/cancelled watch, both of which want the identical "reveal the
 * normal end screen" behavior.
 */
import { useEffect, useState } from 'react';
import { sfx } from '../audio/audio.ts';
import { applyContinueGrant } from '../game/actions.ts';
import { t, tn } from '../i18n/index.ts';
import { adsSystem } from '../sdk/ads.ts';
import { track } from '../sdk/analytics.ts';
import { Card, CardGhostButton, CardScrim, CardTitle } from './SettingsCard.tsx';
import { useMenuUnit } from './useMenuUnit.ts';

export default function ContinueOffer({ onClose }: { onClose: () => void }) {
    const mu = useMenuUnit();
    const [busy, setBusy] = useState(false);
    const ads = adsSystem();

    useEffect(() => {
        track('continue_offer_shown', { ads_left: ads.remainingToday() });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const decline = () => {
        if (busy) return;
        sfx.click();
        track('continue_offer_declined', {});
        onClose();
    };

    const watch = () => {
        if (busy) return;
        sfx.click();
        setBusy(true);
        track('continue_offer_watch_tapped', {});
        void ads
            .grantReward({
                productId: 'continue_run',
                description: t('continue.adDescription'),
                trigger: 'continue_run',
                name: t('continue.adName'),
                // Fires ONLY on an actual grant (Part 2's own gate) — every
                // engine/store/dialogue/sfx side effect of a continue lives
                // in this one function, never duplicated here.
                onReward: () => applyContinueGrant(),
            })
            .then((granted) => {
                if (!granted) onClose();
            })
            .finally(() => setBusy(false));
    };

    return (
        <CardScrim onTap={decline} zIndex={15}>
            <Card mu={mu}>
                <CardTitle mu={mu}>{t('continue.title')}</CardTitle>
                <p className="text-center" style={{ fontSize: Math.max(11, 12 * mu) }}>
                    {t('continue.body')}
                </p>
                <p className="text-center" style={{ fontSize: Math.max(11, 10 * mu), opacity: 0.7 }}>
                    {tn('continue.adsLeft', ads.remainingToday(), { n: ads.remainingToday() })}
                </p>
                <div className="flex flex-col items-stretch" style={{ gap: 7 * mu }}>
                    <button
                        type="button"
                        disabled={busy}
                        className="font-bold shadow-lg transition-transform active:scale-95"
                        style={{
                            minHeight: 44,
                            padding: `${12 * mu}px ${6 * mu}px`,
                            fontSize: 12 * mu,
                            borderRadius: 10 * mu,
                            backgroundColor: busy ? 'rgba(34,197,94,0.5)' : '#22c55e',
                            color: 'var(--color-chocolate)',
                            border: `${2 * mu}px solid var(--color-chocolate)`,
                        }}
                        onClick={watch}
                    >
                        {busy ? t('continue.loading') : t('continue.watch')}
                    </button>
                    <CardGhostButton
                        mu={mu}
                        onClick={decline}
                        style={{ minHeight: 44, color: '#ef4444', border: `${2 * mu}px solid #ef4444` }}
                    >
                        {t('continue.close')}
                    </CardGhostButton>
                </div>
            </Card>
        </CardScrim>
    );
}
