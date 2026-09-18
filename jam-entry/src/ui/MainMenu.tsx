/**
 * Main menu — Round 8b scale correction (docs/Ideas.md §9's own numbers were
 * mock-frame px, not device px: on a real 739x1315 phone the stack rendered
 * at 18% of the width instead of the approved mock's 54%). Every dimension
 * below is `value * mu`, where `mu = clamp(1, min(innerWidth/240,
 * innerHeight/520), 3)` — the mock frame was 240x520, so mu is "how many
 * mock-pixels fit in one device pixel," recomputed on resize/orientation
 * (useMenuUnit(), lifted to ./useMenuUnit.ts in Round 9 Part 2 — Settings.tsx
 * needs the same unit now, so it stopped being a single-file concern).
 * Nothing about Round 8's actual design changed, only the units it was
 * expressed in — see that round's own report for the measured ratios
 * against the approved mock.
 *
 * The wordmark switched from SVG-with-textLength (which force-stretched the
 * glyphs to an exact width) to plain sized text: only the font-size is
 * specified now, and the rendered width is whatever the browser's own glyph
 * metrics produce — "let the width fall out," per the handover.
 *
 * Round 9 Part 4 (docs/Ideas.md §6d, "Playtest of 1.80.0" items 2/6): a
 * greeting speech bubble over Ramu's portrait ("Welcome, {name}") and the
 * guest name-entry dialog. Round 9 gated the dialog on the Start shift tap
 * and flagged a wrinkle: main.tsx's boot step 6 starts a brand-new session
 * straight into 'playing' without ever routing through this button, so a
 * first-ever guest saw no dialog on their actual first run. Round 10 Part 3
 * fixes this at the source — the dialog now opens at the START of the
 * scripted run itself (main.tsx step 6, App.tsx mounts it off
 * store.bootNameDialogOpen) — so `handleStartShift`'s own guard below is now
 * a rare fallback (a guest who somehow still has no name by the time they
 * reach the menu) rather than the primary trigger.
 *
 * Round 10 Part 6: the greeting bubble is now also a BUTTON — tapping it
 * (guests) opens the rename card (RenameDialog.tsx, via store.renameOpen);
 * for a RUN account it shows a brief toast instead ("Your name comes from
 * your RUN profile.") since the game never overrides a RUN username.
 */
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { MANIFEST } from '../assets/manifest.ts';
import { sfx } from '../audio/audio.ts';
import { scriptedRunStart } from '../game/actions.ts';
import { blockForLevel } from '../game/data/blocks.ts';
import { openComments, promptLike } from '../sdk/engagement.ts';
import { trackFunnelStep } from '../sdk/analytics.ts';
import { devModeEnabled } from '../state/devMode.ts';
import { t } from '../i18n/index.ts';
import { store, useStore } from '../state/store.ts';
import ChefPortrait from './ChefPortrait.tsx';
import GemCounter from './GemCounter.tsx';
import NameDialog from './NameDialog.tsx';
import { useMenuUnit } from './useMenuUnit.ts';

// Reuses the manifest's own alias->src entries — ChefPortrait.tsx's own
// established pattern (this codebase duplicates this tiny map per file
// rather than sharing one module for it; see that file's own ASSET_SRC).
const ASSET_SRC = new Map(
    MANIFEST.bundles.flatMap((b) => b.assets).map((a) => [a.alias as string, a.src as string])
);

const ARTIST_INSTAGRAM_URL = 'https://www.instagram.com/arc_inmotion';

/**
 * Open the backdrop artist's Instagram profile. Researched against the
 * bundled RUN SDK (dist .d.ts + the ATTRIBUTION/CREDITS/NAVIGATION/SHARING
 * docs, node_modules/@series-inc/rundot-game-sdk): there is no generic
 * "open this arbitrary URL" surface. The closest candidate,
 * `RundotGameAPI.social.openInstagramFollowMeLinkAsync()`, takes NO url —
 * it opens the GAME's own dashboard-configured creator link, not a
 * per-credit artist handle, so it can't be pointed at @arc_inmotion. The
 * SDK's OWN mock for a related call (composeSocialPostAsync's X/Reddit
 * composer, chunk-SORKLYIC.js) falls back to plain
 * `window.open(url, '_blank', 'noopener,noreferrer')` when there's nothing
 * more specific to call — the same fallback used here, guarded exactly
 * like every other SDK-adjacent call in this codebase (try/catch, never
 * throws). This is NOT a bare `<a target=_blank>`: it's a script-driven
 * call from a real click handler, matching the SDK's own internal pattern
 * for "open an external social profile".
 */
function openArtistCredit(): void {
    try {
        window.open(ARTIST_INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
    } catch (err) {
        console.warn('[MainMenu] could not open artist credit link', err);
    }
}

/** Ghost-button style (The Kitchen / Ranks / the dev-only test-mode
 *  button) — one formula, three call sites. Border stays a literal 1px
 *  (not 1*mu) below mu 1.5: the handover's own hairline note — a
 *  sub-1.5px border renders as anti-aliased blur, not a crisp line, so
 *  it's pinned to a real pixel in that low range instead of scaling it
 *  into blur. */
function ghostButtonStyle(mu: number): CSSProperties {
    return {
        padding: `${9 * mu}px ${6 * mu}px`,
        fontSize: `${11 * mu}px`,
        borderRadius: `${10 * mu}px`,
        borderWidth: mu < 1.5 ? 1 : 1 * mu,
        borderStyle: 'solid',
        borderColor: 'rgba(253,250,231,0.9)',
        color: 'var(--color-cream)',
        backgroundColor: 'rgba(42,29,16,0.35)',
        fontWeight: 700,
    };
}

function GhostButton({ mu, onClick, children }: { mu: number; onClick: () => void; children: ReactNode }) {
    return (
        <button
            type="button"
            className="transition-transform active:scale-95"
            style={ghostButtonStyle(mu)}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default function MainMenu() {
    const bestWave = useStore((s) => s.bestWave);
    const likeAvailable = useStore((s) => s.likeAvailable);
    const commentsAvailable = useStore((s) => s.commentsAvailable);
    const isLiked = useStore((s) => s.isLiked);
    const isGuest = useStore((s) => s.isGuest);
    const runUsername = useStore((s) => s.runUsername);
    const playerName = useStore((s) => s.playerName);
    // Round A2, task 4: Test Mode is unfinished — gated behind ?test=1
    // (devMode.ts). Styled as a ghost, ABOVE Start shift — the spec's
    // "only filled button" rule applies regardless of dev flags, and this
    // is a QA affordance nobody outside the team ever sees.
    const showTestMode = devModeEnabled();
    const backdropSrc = ASSET_SRC.get('menu-backdrop');
    const costumeBlock = blockForLevel(Math.max(1, bestWave));
    const mu = useMenuUnit();
    // Round 9 Part 4: gates Start shift — see NameDialog.tsx and this
    // round's own report for the discovered wrinkle (main.tsx's boot-time
    // auto-start bypasses this button entirely on a brand-new session).
    const [showNameDialog, setShowNameDialog] = useState(false);
    // Round 10 Part 6: the RUN-account toast on a bubble tap — local,
    // ephemeral, same shape as Hud.tsx's own ftueGrant toast (a plain
    // useState timeout, not a shared toast system this codebase doesn't have).
    const [showRunNameToast, setShowRunNameToast] = useState(false);
    const greetingName = isGuest ? (playerName ?? t('menu.greeting.fallback')) : (runUsername ?? t('menu.greeting.fallback'));

    const beginShift = () => {
        // GDD §10.11 (round D): the scripted three-wave FTUE is persistent —
        // every run enters scripted, not just the player's first.
        store.patch({ phase: 'playing', ...scriptedRunStart() });
    };

    const handleStartShift = () => {
        sfx.click();
        if (isGuest && playerName === null) {
            setShowNameDialog(true);
            return;
        }
        beginShift();
    };

    /** Round 10 Part 6: the greeting bubble's own tap — guests open the
     *  rename card; a RUN account (whose username the game never overrides)
     *  gets an informational toast instead. */
    const handleBubbleTap = () => {
        sfx.click();
        if (isGuest) {
            store.patch({ renameOpen: true });
        } else {
            setShowRunNameToast(true);
            setTimeout(() => setShowRunNameToast(false), 2600);
        }
    };

    // fires once per mount, i.e. every time phase transitions into 'menu'
    useEffect(() => {
        trackFunnelStep(1, 'menu_shown', 'run', 2);
    }, []);

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Backdrop — full-bleed, object-fit cover, CENTRE crop (Round
                8b: the approved mock has dark grass under the stack, not
                the path — Round 8's 78%/82% bias was corrected here). */}
            {backdropSrc && (
                <img
                    src={backdropSrc}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: 'center' }}
                />
            )}
            {/* Gradient overlay — unchanged from round 8: transparent ->
                chocolate 88%, 55% to 100% of the height. */}
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(42,29,16,0.88) 100%)' }}
            />

            {/* Gems (top-left) / Settings (top-right). min-height 44px is a
                FLOOR under the padding/font formula, not a replacement for
                it: at mu>=~1.55 the formula alone already clears 44px
                (≈48px at 403 wide, matching the spec's own note); below
                that (e.g. mu=1.5 at 360 wide) the padding+font math lands
                just under 44px, and the acceptance criterion ("≥44
                everywhere") is the harder constraint of the two, so it
                wins. */}
            <div
                className="absolute"
                style={{ top: `calc(${10 * mu}px + var(--safe-top))`, left: 10 * mu }}
            >
                <GemCounter chocolate mu={mu} />
            </div>
            <button
                type="button"
                aria-label={t('menu.settings.aria')}
                className="absolute flex items-center justify-center text-cream transition-transform active:scale-95"
                style={{
                    top: `calc(${10 * mu}px + var(--safe-top))`,
                    right: 10 * mu,
                    padding: `${7 * mu}px ${11 * mu}px`,
                    fontSize: 14 * mu,
                    borderRadius: 9 * mu,
                    minHeight: 44,
                    backgroundColor: 'rgba(42, 29, 16, 0.85)',
                }}
                onClick={() => {
                    sfx.click();
                    store.patch({ settingsOpen: true });
                }}
            >
                ⚙
            </button>

            {/* Wordmark — top 19% of height, centred, natural glyph width
                (no textLength/lengthAdjust — round 8's SVG forced an exact
                width, which round 8b's own acceptance rule against glyph
                stretching rules out). SPICE EXPERT's font-size is 21.8*mu,
                not the handover's literal 20 — this project declares no
                custom font-family (plain system sans-serif, which varies
                by OS/browser), so the handover's own "font 20 -> ≈62% of
                vw" pairing (presumably measured against whatever font
                their mock tool used) didn't hold here: 20*mu measured
                56.8% at 403 wide, 1.2 points outside the ±4 acceptance
                band. Scaled by the same ratio (62/56.8) needed to land
                mid-band — verified by re-measuring the rendered screen,
                not assumed. */}
            <div className="absolute inset-x-0 text-center" style={{ top: '19%', lineHeight: 0.9 }}>
                <div style={{ display: 'inline-block', fontSize: 21.8 * mu, fontWeight: 900, color: 'var(--color-chocolate)' }}>
                    {t('menu.wordmark.top')}
                </div>
                <br />
                <div
                    style={{
                        display: 'inline-block',
                        fontSize: 40 * mu,
                        fontWeight: 900,
                        color: 'var(--color-cream)',
                        WebkitTextStroke: `${2.5 * mu}px var(--color-chocolate)`,
                        paintOrder: 'stroke fill',
                    } as CSSProperties}
                >
                    {t('menu.wordmark.name')}
                </div>
            </div>

            {/* Ramu, bottom-left, at his in-game size — costume from the
                player's BEST run (not the live `wave`, meaningless here),
                always warm (face a). bottom is the safe-area inset alone
                (no added offset) — the stack below adds its own 14*mu on
                top of the same inset, which is what keeps Ramu sitting
                lower than the stack's own baseline. */}
            <div
                className="absolute"
                style={{ bottom: 'env(safe-area-inset-bottom, 0px)', left: 4 * mu }}
            >
                <ChefPortrait size={120 * mu} variant="dialogue" face="a" block={costumeBlock} />
            </div>

            {/* Round 9 Part 4 (docs/Ideas.md §6d item 2): the greeting
                bubble over Ramu's head. Anchored ABOVE the portrait (portrait
                height 120*mu + a gap) rather than to a fixed top offset, so
                it tracks the portrait at every mu.
                Width: the spec's own ceiling is 120*mu, but at 360 wide
                (mu 1.5) that's 180px — measured against the real stack
                (which right-anchors starting at x=147 at that width), a
                bubble anywhere near that cap genuinely overlapped it
                (measured overlap: 31.9px, with 37.3px of shared vertical
                range — a real defect, not a near-miss). 85*mu keeps the
                bubble's right edge left of the stack's own left edge at
                every measured width (403/360/739/768) with several px of
                clearance to spare — chosen from the actual numbers, not
                the spec's ceiling. A very long typed/assigned name (up to
                16 chars, two words) wraps rather than overflowing, since
                width is 'fit-content' capped by this maxWidth, not a
                fixed box.
                Round 10 Part 6: the bubble body is now a real <button> —
                tapping it opens the rename card for a guest, or shows the
                RUN-account toast just below the stack. */}
            <div
                className="absolute"
                style={{
                    left: 8 * mu,
                    bottom: `calc(${120 * mu}px + env(safe-area-inset-bottom, 0px) + ${14 * mu}px)`,
                    maxWidth: 85 * mu,
                }}
            >
                <div className="relative">
                    <button
                        type="button"
                        onClick={handleBubbleTap}
                        className="text-left transition-transform active:scale-95"
                        style={{
                            width: 'fit-content',
                            maxWidth: 85 * mu,
                            backgroundColor: 'var(--color-cream)',
                            color: 'var(--color-chocolate)',
                            border: `${mu < 1.5 ? 1 : 1 * mu}px solid var(--color-chocolate)`,
                            borderRadius: 8 * mu,
                            padding: `${5 * mu}px ${8 * mu}px`,
                            fontSize: 9 * mu,
                            fontWeight: 700,
                        }}
                    >
                        {t('menu.greeting', { name: greetingName })}
                    </button>
                    {showRunNameToast && (
                        <div
                            className="absolute whitespace-nowrap"
                            style={{
                                left: 0,
                                top: `calc(100% + ${6 * mu}px)`,
                                backgroundColor: 'rgba(42,29,16,0.9)',
                                color: 'var(--color-cream)',
                                borderRadius: 8 * mu,
                                padding: `${5 * mu}px ${8 * mu}px`,
                                fontSize: 8 * mu,
                                fontWeight: 700,
                            }}
                        >
                            {t('menu.runNameToast')}
                        </div>
                    )}
                    {/* tail, pointing down toward the portrait: a slightly
                        larger chocolate triangle behind a smaller cream one
                        gives the tail the same 1*mu-ish outline as the
                        bubble body. */}
                    <div
                        style={{
                            position: 'absolute',
                            left: 14 * mu,
                            bottom: -6 * mu,
                            width: 0,
                            height: 0,
                            borderLeft: `${6 * mu}px solid transparent`,
                            borderRight: `${6 * mu}px solid transparent`,
                            borderTop: `${7 * mu}px solid var(--color-chocolate)`,
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            left: 15 * mu,
                            bottom: -4.5 * mu,
                            width: 0,
                            height: 0,
                            borderLeft: `${5 * mu}px solid transparent`,
                            borderRight: `${5 * mu}px solid transparent`,
                            borderTop: `${6 * mu}px solid var(--color-cream)`,
                        }}
                    />
                </div>
            </div>

            {/* The single right-hand action stack. Order per the spec:
                BEST . RUSH n -> Start shift (the only filled button) ->
                The Kitchen -> Ranks -> Backdrop credit -> Like/Comments.
                Right-anchored against Ramu's left-anchored position is
                what keeps them apart by construction at any width — see
                this round's own report for the measured gap (against the
                sprite's real opaque extent, not the transparent box). */}
            <div
                className="absolute flex flex-col items-stretch"
                style={{
                    right: 12 * mu,
                    bottom: `calc(${14 * mu}px + env(safe-area-inset-bottom, 0px))`,
                    width: 130 * mu,
                    gap: 7 * mu,
                }}
            >
                {showTestMode && (
                    <GhostButton mu={mu} onClick={() => { sfx.click(); store.patch({ phase: 'testbelt' }); }}>
                        {t('menu.testMode')}
                    </GhostButton>
                )}

                <p
                    className="text-center uppercase"
                    style={{
                        fontSize: 8 * mu,
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        color: 'var(--color-cream)',
                        WebkitTextStroke: `${1 * mu}px var(--color-chocolate)`,
                        paintOrder: 'stroke fill',
                    } as CSSProperties}
                >
                    {t('menu.best', { n: bestWave })}
                </p>

                <button
                    type="button"
                    className="font-bold shadow-lg transition-transform active:scale-95"
                    style={{
                        padding: `${12 * mu}px ${6 * mu}px`,
                        fontSize: 12 * mu,
                        borderRadius: 10 * mu,
                        backgroundColor: '#f97316',
                        color: 'var(--color-chocolate)',
                        border: `${1 * mu}px solid var(--color-chocolate)`,
                    }}
                    onClick={handleStartShift}
                >
                    {t('menu.startShift')}
                </button>

                <GhostButton mu={mu} onClick={() => { sfx.click(); store.patch({ metaOpen: true }); }}>
                    {t('menu.kitchen')}
                </GhostButton>

                <GhostButton mu={mu} onClick={() => { sfx.click(); store.patch({ ranksOpen: true }); }}>
                    {t('menu.ranks')}
                </GhostButton>

                <button
                    type="button"
                    className="text-right underline transition-opacity active:opacity-70"
                    style={{ fontSize: 7 * mu, marginTop: 2 * mu, color: 'rgba(253,250,231,0.75)' }}
                    onClick={() => { sfx.click(); openArtistCredit(); }}
                >
                    {t('menu.backdropCredit')}
                </button>

                {(likeAvailable || commentsAvailable) && (
                    <div className="flex justify-end" style={{ gap: 5 * mu, marginTop: 2 * mu }}>
                        {likeAvailable && (
                            isLiked ? (
                                <span
                                    className="font-semibold text-primary"
                                    style={{ padding: `${3 * mu}px ${7 * mu}px`, fontSize: 8 * mu, borderRadius: 8 * mu, backgroundColor: 'rgba(42,29,16,0.7)' }}
                                >
                                    {t('menu.liked')}
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    className="font-semibold transition-transform active:scale-95"
                                    style={{ padding: `${3 * mu}px ${7 * mu}px`, fontSize: 8 * mu, borderRadius: 8 * mu, backgroundColor: 'rgba(42,29,16,0.7)', color: 'var(--color-cream)' }}
                                    onClick={() => { sfx.click(); promptLike(); }}
                                >
                                    {t('menu.like')}
                                </button>
                            )
                        )}
                        {commentsAvailable && (
                            <button
                                type="button"
                                className="font-semibold transition-transform active:scale-95"
                                style={{ padding: `${3 * mu}px ${7 * mu}px`, fontSize: 8 * mu, borderRadius: 8 * mu, backgroundColor: 'rgba(42,29,16,0.7)', color: 'var(--color-cream)' }}
                                onClick={() => { sfx.click(); openComments(); }}
                            >
                                {t('menu.comments')}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {showNameDialog && (
                <NameDialog onDone={() => { setShowNameDialog(false); beginShift(); }} />
            )}
        </div>
    );
}
