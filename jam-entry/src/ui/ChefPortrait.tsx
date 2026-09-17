/**
 * Ramu's layered sprite (docs/Ideas.md §6b/§6d Round 2): body + face, each a
 * separate 320x320 PNG composited at inset-0 (no offsets — the source art is
 * aligned by construction, see manifest.ts's Rounds 0+1 comment). Two mount
 * points, one component:
 *   - 'dialogue' — 160px, inside DialogueBox.tsx's reserved slot (also
 *     reused by EndScreen.tsx's Ramu line — Round 7 item 6 — with an
 *     explicit `face` override, see ChefPortraitProps below).
 *   - 'idle'     — Round 7 item 4 (docs/Ideas.md §6d): fixed 120px,
 *     bottom-CENTRE now, a plain flex child of Hud.tsx's bottom band next
 *     to Ready — retiring the old device-dependent left-gutter sizing
 *     (useLeftGutterPx, deleted; see that round's own report for why the
 *     bottom band existing on every phone made it unnecessary). Still only
 *     ever warm/worried, still hidden whenever the dialogue portrait is
 *     already showing.
 *
 * Costume = blockForLevel(wave) via data/blocks.ts's chefBodyAliasForBlock
 * (shared with towerScene.ts's own prefetch — one slug function, not two).
 * Face, in priority order: the open dialogue's voice > worried under 30%
 * lives > warm. The 30% read is independent of actions.ts's own
 * highTensionLatched (a private, one-way-latched module variable that also
 * drives audio) — this reads store.lives directly and un-latches naturally
 * if lives are restored (the FTUE's wave-1-3 safety net, or a Retry).
 *
 * Round 3 (docs/Ideas.md §6d amendment): the idle mount is also one of the
 * two un-mute tap targets (the other is Hud.tsx's chef-head button, for
 * devices where the idle gutter is too narrow to show it at all — see
 * useLeftGutterPx below) — tapping it calls dialogueController.ts's
 * unmuteDialogue(), a no-op while not muted. Only the idle variant is
 * clickable; the dialogue portrait never is, there being no reason to tap
 * the chef while its own box is already open. A brief warm->wry->warm cue
 * plays on a successful un-mute, riding the same face-crossfade plumbing
 * below rather than a new animation (see unmuteCueNonce in the component).
 * This file also exports ChefHeadIcon, the ~44px cropped-to-head icon
 * Hud.tsx's always-present chef-head button uses — a cosmetic crop (object-
 * position + scale) centred on the face band's own alignment (§6b), not a
 * pixel-measured one.
 */
import { useEffect, useRef, useState } from 'react';
import { Assets } from 'pixi.js';
import { MANIFEST } from '../assets/manifest.ts';
import { CONFIG } from '../game/config.ts';
import { blockForLevel, chefBodyAliasForBlock } from '../game/data/blocks.ts';
import { BACKDROP_FADE_S } from '../game/towerScene.ts';
import { unmuteDialogue } from '../game/dialogueController.ts';
import { sfx } from '../audio/audio.ts';
import { useStore } from '../state/store.ts';

// Reuses the manifest's own alias->src entries (PropPicker.tsx/TestBelt.tsx's
// own pattern) rather than hard-coding image paths a second time here.
const ASSET_SRC = new Map(
    MANIFEST.bundles.flatMap((b) => b.assets).map((a) => [a.alias as string, a.src as string])
);

const FACE_CROSSFADE_MS = 400;
const BODY_FALLBACK_FADE_MS = 400; // block change with no real transition (late load / game start)
const BODY_BACKDROP_FADE_MS = BACKDROP_FADE_S * 1000;
/** How long a body-alias load is allowed to sit pending before it's worth a
 *  console warning — should never fire in practice (towerScene.ts's
 *  ensureBlockAssets already warms every costume a block early). */
const SLOW_LOAD_WARN_MS = 3000;

/** Round 7 item 4: fixed now — the bottom band is DOM flow on every phone
 *  (Hud.tsx), so there's no device-dependent gutter left to size against
 *  (the old IDLE_MARGIN_PX/IDLE_SIZE_MAX/IDLE_SIZE_FLOOR/useLeftGutterPx
 *  machinery this replaced is gone). 104, not the handover's literal
 *  "~120" — measured live against stage.ts's own contain-fit at 403x874
 *  (the tightest tested viewport, same one that round C's BOTTOM_BAND was
 *  originally calibrated against): 120 pushed the row high enough to clip
 *  the path's own exit corner under Ready (screenshotted, not guessed).
 *  104 (still ~2x the old idle sprite's 72-100px range) clears it with
 *  real margin alongside BOTTOM_BAND's own bump — see that constant's doc. */
const IDLE_SIZE = 104;

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

/**
 * What was last actually SHOWN, per layer — module-scoped, not component-
 * state. Both mount points (idle/dialogue) are two DIFFERENT React trees
 * that mount and unmount independently (DialogueBox.tsx only renders
 * ChefPortrait while `dialogue !== null`, so the 'dialogue' instance is torn
 * down and rebuilt fresh every time a beat opens/closes) — a per-instance
 * ref would forget the transition the moment either one unmounts, so a
 * freshly-mounted portrait would always pop straight to its target with no
 * fade. This is the one piece of state that must outlive both instances.
 */
const lastShown: { body: string; face: string } = { body: 'chef-body-cafe', face: 'chef-face-a' };

/**
 * One layer (body OR face): renders the current alias as a static, fully
 * opaque <img>, and — while a change is mid-fade — the PREVIOUS alias
 * stacked on top of it, opacity animating 1 -> 0 over durationMs ("previous
 * fading out over the new one," per the handover). durationMs === 0
 * (reduced motion, or a caller that wants an instant swap) skips the fade
 * layer entirely — never pop mid-transition-setup, just replace outright.
 * A second alias change before the first fade finishes cancels it (the
 * in-flight fade layer is simply replaced by a fresh one) and restarts from
 * opacity 1 — no accumulated/stuck partial fades. Compares against — and
 * updates — the module-level `lastShown` tracker (not a local ref) so a
 * freshly-mounted instance still fades from whatever was last on screen,
 * even one rendered by the OTHER mount point.
 */
function CrossfadeLayer({ alias, durationMs, trackerKey, className }: { alias: string | null; durationMs: number; trackerKey: 'body' | 'face'; className: string }) {
    const [current, setCurrent] = useState(alias);
    const [fadingOut, setFadingOut] = useState<{ alias: string; ms: number } | null>(null);
    const [fadeStarted, setFadeStarted] = useState(false);

    useEffect(() => {
        if (!alias) return;
        const prior = lastShown[trackerKey];
        if (alias === prior) return;
        lastShown[trackerKey] = alias;
        setCurrent(alias);
        if (durationMs <= 0) {
            setFadingOut(null);
            return;
        }
        setFadingOut({ alias: prior, ms: durationMs });
        setFadeStarted(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alias, durationMs]);

    // Second frame after the fade-out layer mounts at opacity 1: flip to 0
    // so the CSS transition actually animates (a same-frame opacity:0 would
    // never transition — there'd be nothing for the browser to interpolate
    // from).
    useEffect(() => {
        if (!fadingOut || fadeStarted) return;
        const raf = requestAnimationFrame(() => setFadeStarted(true));
        return () => cancelAnimationFrame(raf);
    }, [fadingOut, fadeStarted]);

    const src = current ? ASSET_SRC.get(current) : undefined;
    return (
        <>
            {src && <img src={src} alt="" className={className} />}
            {fadingOut && (
                <img
                    src={ASSET_SRC.get(fadingOut.alias)}
                    alt=""
                    aria-hidden="true"
                    className={className}
                    style={{ transition: `opacity ${fadingOut.ms}ms linear`, opacity: fadeStarted ? 0 : 1 }}
                    onTransitionEnd={() => setFadingOut(null)}
                />
            )}
        </>
    );
}

/**
 * Resolves an alias actually safe to display: lags `targetAlias` while its
 * texture isn't in Assets.cache yet (a still-loading deferred bundle entry —
 * true of 8 of the 9 bodies AND three of the four faces, b/c/w) so a broken
 * image never renders; the previous alias stays up until the new one is
 * ready. `computeDurationMs` is called once, at the moment the change is
 * first REQUESTED (so callers can read live state like
 * backdropTransitioning then), not when the load resolves — matching
 * towerScene.ts's own posture: the transition kind is decided once, at the
 * boundary, independent of how long the asset takes to arrive. Generic over
 * body/face — one hook, not two near-duplicates.
 */
function useResolvedAlias(targetAlias: string, computeDurationMs: () => number, warnLabel: string) {
    const [resolved, setResolved] = useState(() => (Assets.cache.has(targetAlias) ? targetAlias : null));
    // Lazy-initialized the SAME way as `resolved` (not left at a plain 0 for
    // the effect to fill in later): a plain 0 default meant the ALREADY-
    // CACHED case (by far the common one — every costume is prefetched a
    // block early) resolved the alias synchronously on mount but only
    // learned the real duration one render later, once this hook's own
    // effect ran — and CrossfadeLayer's effect (a child, committed BEFORE
    // this one) had already consumed that first, duration-still-0 pass
    // against the module tracker, marking the change "seen" with no fade
    // ever started. Computing both together here closes that gap.
    const [durationMs, setDurationMs] = useState(() => (Assets.cache.has(targetAlias) ? computeDurationMs() : 0));
    // Seeded to null (never a valid alias) so the very first effect run is
    // ALWAYS treated as a genuine request, mount included — an earlier bug
    // seeded this to targetAlias itself, which made the mount's own request
    // a same-value no-op that silently skipped computing durationMs at all.
    const lastRequested = useRef<string | null>(null);
    const warnedRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (targetAlias === lastRequested.current && Assets.cache.has(targetAlias)) return;
        lastRequested.current = targetAlias;
        const ms = computeDurationMs();
        if (Assets.cache.has(targetAlias)) {
            setDurationMs(ms);
            setResolved(targetAlias);
            return;
        }
        let cancelled = false;
        const warnTimer = setTimeout(() => {
            if (!cancelled && !warnedRef.current.has(targetAlias)) {
                warnedRef.current.add(targetAlias);
                console.warn(`[ChefPortrait] ${warnLabel} alias "${targetAlias}" still loading after ${SLOW_LOAD_WARN_MS}ms`);
            }
        }, SLOW_LOAD_WARN_MS);
        Assets.load(targetAlias)
            .then(() => {
                clearTimeout(warnTimer);
                if (cancelled || lastRequested.current !== targetAlias) return;
                setDurationMs(ms);
                setResolved(targetAlias);
            })
            .catch(() => clearTimeout(warnTimer));
        return () => { cancelled = true; clearTimeout(warnTimer); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetAlias]);

    return { resolvedAlias: resolved, durationMs };
}

export interface ChefPortraitProps {
    size: number;
    variant: 'dialogue' | 'idle';
    /** Round 7 item 6 (EndScreen.tsx's Ramu line): overrides the normal
     *  dialogue/lives-driven face priority below outright — the end screen
     *  picks a face from its own outcome table (new best/near best/held/
     *  early), which has nothing to do with whatever store.dialogue or
     *  store.lives happen to hold at that instant. Omitted everywhere else,
     *  leaving the existing priority untouched. */
    face?: 'a' | 'b' | 'c' | 'w';
}

export default function ChefPortrait({ size, variant, face }: ChefPortraitProps) {
    const wave = useStore((s) => s.wave);
    const dialogue = useStore((s) => s.dialogue);
    const lives = useStore((s) => s.lives);
    const backdropTransitioning = useStore((s) => s.backdropTransitioning);
    const unmuteCueNonce = useStore((s) => s.unmuteCueNonce);
    const reducedMotion = usePrefersReducedMotion();

    // Round 3: a successful unmuteDialogue() bumps this nonce — 'b' (wry)
    // for one crossfade window, then falls back through the normal priority
    // below. §6b's own measured finding says wry doesn't read at idle size
    // (only warm/worried do) — accepted here anyway because the amendment
    // asks for this exact sequence and the cue is transient (400ms, riding
    // the existing crossfade, not a sustained expression the player needs to
    // parse) rather than a UI state meant to be read.
    const [cueing, setCueing] = useState(false);
    useEffect(() => {
        if (unmuteCueNonce === 0) return;
        setCueing(true);
        const t = setTimeout(() => setCueing(false), FACE_CROSSFADE_MS);
        return () => clearTimeout(t);
    }, [unmuteCueNonce]);

    const block = blockForLevel(wave);
    const bodyAlias = chefBodyAliasForBlock(block);
    const faceLetter = face
        ?? (cueing
            ? 'b'
            : dialogue
                ? dialogue.voice === 'A' ? 'a' : dialogue.voice === 'B' ? 'b' : 'c'
                : lives < CONFIG.economy.startLives * 0.3 ? 'w' : 'a');
    const faceAlias = `chef-face-${faceLetter}`;

    // Hooks run unconditionally, before the idle/dialogue-open early return
    // below (rules of hooks) — harmless when the result goes unused (the
    // idle variant simply won't render this pass).
    const { resolvedAlias: bodyResolved, durationMs: bodyDurationMs } = useResolvedAlias(
        bodyAlias,
        () => (reducedMotion ? 0 : backdropTransitioning ? BODY_BACKDROP_FADE_MS : BODY_FALLBACK_FADE_MS),
        'body',
    );
    const { resolvedAlias: faceResolved, durationMs: faceDurationMs } = useResolvedAlias(
        faceAlias,
        () => (reducedMotion ? 0 : FACE_CROSSFADE_MS),
        'face',
    );

    // Idle never shows b/c (illegible at this size — §6b's sizing finding)
    // and hides outright while the dialogue portrait owns the screen.
    if (variant === 'idle' && dialogue !== null) return null;
    if (!bodyResolved || !faceResolved) return null; // nothing has ever loaded yet (boot race guard)

    // Round 3: the idle mount is one of the two un-mute tap targets (Hud.tsx's
    // chef-head button is the other) — pointer-events-auto on just this
    // instance, inside the HUD overlay's own pointer-events-none tree, is
    // the same "opt back in individually" pattern every other HUD control
    // uses, and it's what keeps the tap from ever reaching the canvas
    // underneath (the DOM overlay sits above it and consumes the event).
    const idleClickable = variant === 'idle';
    return (
        <div
            data-chef-portrait={variant}
            data-chef-body={bodyResolved}
            data-chef-face={faceResolved}
            className={
                'relative shrink-0 overflow-hidden ' +
                (idleClickable ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none')
            }
            style={{ width: size, height: size }}
            onClick={idleClickable ? () => { sfx.click(); unmuteDialogue(); } : undefined}
        >
            <CrossfadeLayer alias={bodyResolved} durationMs={bodyDurationMs} trackerKey="body" className="absolute inset-0 h-full w-full object-contain" />
            <CrossfadeLayer alias={faceResolved} durationMs={faceDurationMs} trackerKey="face" className="absolute inset-0 h-full w-full object-contain" />
        </div>
    );
}

/**
 * Round 3: the ~44px chef-head icon for Hud.tsx's always-present un-mute
 * button (needed because the idle portrait above hides itself under
 * IDLE_SIZE_FLOOR on narrow-gutter phones — the 403x874 reference included).
 * Reuses the same ASSET_SRC lookup as the rest of this file rather than a
 * second alias->path map. "Cropped to the head": object-position centres on
 * the face band's own alignment point (§6b: (329,296)-(750,585) on the
 * 1024^2 source), scaled up enough to fill a round icon with it — a cosmetic
 * crop tuned by eye, not measured to the pixel, since nothing here is a tap
 * target boundary that needs to be exact. Always chef-body-cafe/chef-face-a
 * (block 1, warm) — a static icon, not a live-costume one; Round 4 is what
 * turns this into a real anchor (see this round's own report).
 */
export function ChefHeadIcon() {
    const bodySrc = ASSET_SRC.get('chef-body-cafe');
    const faceSrc = ASSET_SRC.get('chef-face-a');
    if (!bodySrc || !faceSrc) return null;
    const layerStyle = {
        position: 'absolute' as const,
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        objectPosition: '50% 42%',
        transform: 'scale(3.2)',
        transformOrigin: '50% 42%',
    };
    return (
        <div className="relative h-full w-full overflow-hidden rounded-full">
            <img src={bodySrc} alt="" style={layerStyle} />
            <img src={faceSrc} alt="" style={layerStyle} />
        </div>
    );
}

/**
 * The idle mount point. Round 7 item 4: a plain, fixed-size (IDLE_SIZE)
 * flex child now — no absolute positioning, no gutter measurement, no
 * ResizeObserver. Hud.tsx mounts this as the first element of its bottom
 * band's row 1, immediately left of Ready during the build phase and alone
 * during the wave phase; being ordinary DOM flow inside that row is what
 * makes "never overlapping D1 or the path" true by construction (the row
 * lives entirely within stage.ts's reserved BOTTOM_BAND), the same
 * argument the rest of Hud.tsx's bottom band already relies on. z-index
 * intentionally omitted, matching every other plain-flow HUD element.
 */
export function ChefPortraitIdle() {
    return (
        <div id="chef-portrait-idle" className="pointer-events-none shrink-0">
            <ChefPortrait size={IDLE_SIZE} variant="idle" />
        </div>
    );
}
