/**
 * Ramu's layered sprite (docs/Ideas.md §6b/§6d Round 2): body + face, each a
 * separate 320x320 PNG composited at inset-0 (no offsets — the source art is
 * aligned by construction, see manifest.ts's Rounds 0+1 comment). Two mount
 * points, one component:
 *   - 'dialogue' — 160px, inside DialogueBox.tsx's reserved slot.
 *   - 'idle'     — ~72-100px (device-dependent — see useLeftGutterPx below
 *     and the round's report), bottom-left, only ever warm/worried, hidden
 *     whenever the dialogue portrait is already showing.
 *
 * Costume = blockForLevel(wave) via data/blocks.ts's chefBodyAliasForBlock
 * (shared with towerScene.ts's own prefetch — one slug function, not two).
 * Face, in priority order: the open dialogue's voice > worried under 30%
 * lives > warm. The 30% read is independent of actions.ts's own
 * highTensionLatched (a private, one-way-latched module variable that also
 * drives audio) — this reads store.lives directly and un-latches naturally
 * if lives are restored (the FTUE's wave-1-3 safety net, or a Retry).
 */
import { useEffect, useRef, useState } from 'react';
import { Assets } from 'pixi.js';
import { MANIFEST } from '../assets/manifest.ts';
import { CONFIG } from '../game/config.ts';
import { blockForLevel, chefBodyAliasForBlock } from '../game/data/blocks.ts';
import { BACKDROP_FADE_S } from '../game/towerScene.ts';
import { getFit } from '../game/stage.ts';
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

/** Task 1 (this round's report has the measured numbers): the idle sprite
 *  lives in the horizontal letterbox slack stage.ts's contain-fit leaves
 *  outside the board — never inside it — so it structurally cannot reach
 *  pad D1 (design x:225), which sits well inside the board's own left edge.
 *  IDLE_MARGIN_PX is pure cosmetic clearance from the screen edge and the
 *  board edge, not a D1-safety margin. */
const IDLE_MARGIN_PX = 8;
const IDLE_SIZE_MAX = 100;
const IDLE_SIZE_FLOOR = 72;

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
}

export default function ChefPortrait({ size, variant }: ChefPortraitProps) {
    const wave = useStore((s) => s.wave);
    const dialogue = useStore((s) => s.dialogue);
    const lives = useStore((s) => s.lives);
    const backdropTransitioning = useStore((s) => s.backdropTransitioning);
    const reducedMotion = usePrefersReducedMotion();

    const block = blockForLevel(wave);
    const bodyAlias = chefBodyAliasForBlock(block);
    const faceLetter = dialogue
        ? dialogue.voice === 'A' ? 'a' : dialogue.voice === 'B' ? 'b' : 'c'
        : lives < CONFIG.economy.startLives * 0.3 ? 'w' : 'a';
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

    return (
        <div
            data-chef-portrait={variant}
            data-chef-body={bodyResolved}
            data-chef-face={faceResolved}
            className="pointer-events-none relative shrink-0 overflow-hidden"
            style={{ width: size, height: size }}
        >
            <CrossfadeLayer alias={bodyResolved} durationMs={bodyDurationMs} trackerKey="body" className="absolute inset-0 h-full w-full object-contain" />
            <CrossfadeLayer alias={faceResolved} durationMs={faceDurationMs} trackerKey="face" className="absolute inset-0 h-full w-full object-contain" />
        </div>
    );
}

/** Task 1: the live left-letterbox width (CSS px) — stage.ts's getFit() is
 *  the one source of truth (same formula layout() and Hud.tsx's
 *  usePadsScreenPos already use), read here, never re-derived by hand.
 *  Tracks #app-frame's size via ResizeObserver, same pattern as
 *  usePadsScreenPos. */
function useLeftGutterPx(): number {
    const [gutter, setGutter] = useState(0);
    useEffect(() => {
        const frame = document.getElementById('app-frame');
        if (!frame) return;
        const compute = () => setGutter(getFit(frame.getBoundingClientRect().width, frame.getBoundingClientRect().height).offsetX);
        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(frame);
        return () => ro.disconnect();
    }, []);
    return gutter;
}

/**
 * The idle mount point: bottom-left, sized off the live gutter (Task 1).
 * ~100px when the gutter is generous (>= ~116px after clearance), scaling
 * down as it shrinks, hidden outright once even a 72px sprite wouldn't fit
 * clear of both screen edges — never overlapping pad D1 by construction
 * (the gutter is OUTSIDE the board; D1 is well inside it — see the
 * component doc above). z-index intentionally omitted (mounted before the
 * Ready column / rail / DialogueBox in Hud.tsx's DOM order) so Round 3's
 * service gauge — sharing this same bottom-left region — can sit BEHIND it
 * at an even lower z-index without a fight; this leaves the full gutter
 * width and a z:auto slot for that.
 */
export function ChefPortraitIdle() {
    const gutter = useLeftGutterPx();
    const size = Math.min(gutter - IDLE_MARGIN_PX * 2, IDLE_SIZE_MAX);
    if (size < IDLE_SIZE_FLOOR) return null;
    return (
        <div
            id="chef-portrait-idle"
            className="pointer-events-none absolute left-2"
            style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
        >
            <ChefPortrait size={size} variant="idle" />
        </div>
    );
}
