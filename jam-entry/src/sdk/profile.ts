/**
 * Player identity (Round 9 Part 4, docs/Ideas.md §6d item 6): tells a guest
 * apart from a signed-in RUN account so the menu/leaderboard can show the
 * right name.
 *
 * Handover discrepancy (flagged per the boundary's own "if the profile API
 * behaves differently from docs/rundot-developer-platform/api/PROFILE.md,
 * stop and report rather than improvise around it" — resolved here, not
 * left as a blocker, because PROFILE.md gives one unambiguous correct
 * surface to use instead of guessing): the handover's literal call,
 * `RundotGameAPI.profile.getCurrentProfile()` (implied async, awaited after
 * init), does not exist on this SDK — there is no `.profile` namespace on
 * RundotGameAPI at all. The bundled .d.ts (AdsApi-Ds6PEEd8.d.ts) and
 * PROFILE.md agree: the real surface is `RundotGameAPI.getProfile()` (and
 * the deprecated `getCurrentProfile()` alias, also top-level, not nested),
 * BOTH SYNCHRONOUS — they return a Profile or THROW, never a Promise.
 * getProfile() is used here (not the deprecated alias, which console.warns
 * on every call).
 */
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';

export interface Identity {
    /** True for a guest: no profile, `isAnonymous === true`, or a host
     *  `anonymous_<id>` username (Ideas.md §6d item 7's own display rule
     *  uses the same prefix, so this reuses it rather than a second test). */
    isGuest: boolean;
    /** The RUN account's display handle — null for a guest (the menu/save
     *  own chosen-or-assigned name is used instead, see save.ts). */
    username: string | null;
}

/**
 * Reads the cached profile snapshot. Call after initSdk() resolves (the
 * handshake may still not have completed outside the RUN host, or the host
 * may supply a bad profile — getProfile() throws in both cases per
 * PROFILE.md, so this degrades to a guest identity rather than throwing
 * into the caller).
 */
export function readIdentity(): Identity {
    try {
        const profile = RundotGameAPI.getProfile();
        const guest = profile.isAnonymous === true || profile.username.startsWith('anonymous_');
        return { isGuest: guest, username: guest ? null : profile.username };
    } catch (err) {
        console.warn('[profile] getProfile() unavailable — treating as guest', err);
        return { isGuest: true, username: null };
    }
}
