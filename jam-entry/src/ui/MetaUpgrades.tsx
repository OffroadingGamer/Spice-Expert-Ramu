/**
 * Persistent upgrades menu (main-menu overlay, store.metaOpen): spend gems
 * on per-tower damage / attack speed / range, ten levels each. One list
 * item per tower. Levels apply to every future run (engine reads them at
 * scene creation).
 *
 * Round 17 Part 1 (docs/Ideas.md §6d "Kitchen relayout + recipe sheet",
 * approved visual https://claude.ai/artifact/QrmaTewse8CEL4KNtchdV7): the
 * screen splits into two tabs, Stations (this file's original tower list)
 * and Recipes (the rebuilt scroll grid, Part 2). Stations is selected on
 * open every time — NOT persisted, so the 22-card Recipes wall never buries
 * the stat upgrades a returning player actually wants first. Each tab's own
 * scroll offset DOES persist for the session (module-scope `scrollOffsets`
 * below, not React state — this component fully unmounts on Kitchen close,
 * `{metaOpen && <MetaUpgrades/>}` in App.tsx, so anything that needs to
 * outlive one open/close cycle can't live in local state). Both panes stay
 * mounted the whole time (toggled via inline `display`, not a conditional
 * render) so an in-session tab switch preserves scrollTop for free, the
 * same way any hidden-but-not-unmounted DOM element does. The close/reopen
 * case the free case doesn't cover is handled by a separate effect (see
 * `restoredRef` below) that restores each pane's saved offset the first
 * time IT becomes the visible tab, not unconditionally at mount — setting
 * scrollTop on a still-`display:none` element (which the Recipes pane
 * always is at mount, since Stations opens first) is a silent no-op.
 */
import { useEffect, useRef, useState } from 'react';
import { MANIFEST } from '../assets/manifest.ts';
import { sfx } from '../audio/audio.ts';
import { CONFIG } from '../game/config.ts';
import { dishIconZoom, RECIPE_SLUGS, recipeNoteKey } from '../game/data/recipes.ts';
import { TOWERS, type MetaUniqueDef } from '../game/data/towers.ts';
import { t } from '../i18n/index.ts';
import { stationUniqueDescKey, stationUniqueNameKey } from '../i18n/towerKeys.ts';
import {
    buyMetaUpgrade,
    buyScroll,
    computeKitchenBadge,
    markScrollsSeen,
    metaUpgradeCost,
    SCROLL_GEM_PRICE,
    SHARDS_PER_SCROLL,
    type MetaStat,
} from '../state/save.ts';
import { store, useStore } from '../state/store.ts';
import { useMenuUnit } from './useMenuUnit.ts';
import GemCounter from './GemCounter.tsx';
import RecipeSheet from './RecipeSheet.tsx';

// Reuses the manifest's own alias->src entries — WaveBubble.tsx/
// PostBossPanel.tsx's own pattern (each file duplicates this small map
// rather than sharing one, per those files' own doc comments).
const ASSET_SRC = new Map(
    MANIFEST.bundles.flatMap((b) => b.assets).map((a) => [a.alias as string, a.src as string])
);

/** Round 14 Part 4: ui-shard's own opaque bbox on its 128^2 canvas (measured
 *  offline off the shipped PNG, same posture as Leaderboard.tsx's laurel
 *  constants) — opaque content spans ~37% of the canvas width, ~67% of its
 *  height. Rendering the full (padded) image at CANVAS*(target/OPAQUE_H)
 *  tall makes the OPAQUE glyph itself exactly `target`px tall. */
const SHARD_CANVAS = 128;
const SHARD_OPAQUE_H = 86;
function shardImgSize(targetOpaqueH: number): number {
    return SHARD_CANVAS * (targetOpaqueH / SHARD_OPAQUE_H);
}

const STATS: { key: MetaStat; name: string; perLevel: number }[] = [
    { key: 'damage', name: 'meta.stat.damage', perLevel: CONFIG.meta.damagePerLevel },
    { key: 'speed', name: 'meta.stat.speed', perLevel: CONFIG.meta.speedPerLevel },
    { key: 'range', name: 'meta.stat.range', perLevel: CONFIG.meta.rangePerLevel },
];

/** Player-facing value of a unique track at a given level. */
function uniqueValue(u: MetaUniqueDef, level: number): string {
    switch (u.kind) {
        case 'crit': return t('meta.unique.pct', { n: Math.round(level * u.perLevel * 1000) / 10 });
        case 'chains': return t('meta.unique.plain', { n: level * u.perLevel });
        case 'splash': return t('meta.unique.plain', { n: level * u.perLevel });
        case 'status-duration': return t('meta.unique.seconds', { n: (level * u.perLevel).toFixed(1) });
        case 'status-damage': return t('meta.unique.plain', { n: level * u.perLevel });
        case 'knockback': return t('meta.unique.plain', { n: level * u.perLevel });
    }
}

type Tab = 'stations' | 'recipes';

/**
 * Round 18b Part 4 ("upgrades -> Recipes is only mouse scrollable, make it
 * drag scrollable as well"): both panes are bare native vertical scrollers —
 * a mouse wheel works because browsers scroll a vertical container natively,
 * but a click-and-drag does not, same root cause Round 18 Part 6 fixed on
 * the ingredient rail (ported here, vertically, for both panes rather than
 * duplicated per pane). Guarded to pointerType === 'mouse'; touch already
 * scrolls natively and is left alone. The 4px move threshold matters MORE
 * here than it did on the rail: the Recipes pane is a grid of buttons that
 * open a sheet, so a drag that crosses the threshold must suppress its own
 * trailing click via onClickCapture, or dragging the pane open would also
 * open whatever card the cursor happened to lift over.
 *
 * setPointerCapture is deliberately called INSIDE onPointerMove, only once
 * the drag threshold is actually crossed — not in onPointerDown, which is
 * the obvious-looking place and what Round 18 Part 6's rail version did.
 * Found by testing: capturing the pointer on pointerdown makes Chromium
 * retarget the eventual pointerup/click of a plain, undragged tap to the
 * CAPTURING element (this pane's own div) instead of the button under the
 * cursor — confirmed via a live event trace (pointerdown target: the card's
 * <p>; pointerup and click targets: the pane div). That silently broke
 * every card and every upgrade button the instant this hook was wired in,
 * despite `d.moved` correctly staying false and onClickCapture doing
 * nothing wrong — the click had already been redirected before it got
 * there. Deferring the capture call until movement is confirmed leaves an
 * un-dragged tap's pointerup/click targeted exactly as it always was.
 */
function usePaneDrag(ref: { current: HTMLDivElement | null }) {
    const [dragging, setDragging] = useState(false);
    const dragState = useRef({ dragging: false, pointerId: -1, startY: 0, startScrollTop: 0, moved: false, captured: false });

    const onPointerDown = (e: React.PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const el = ref.current;
        if (!el) return;
        dragState.current = { dragging: true, pointerId: e.pointerId, startY: e.clientY, startScrollTop: el.scrollTop, moved: false, captured: false };
    };
    const onPointerMove = (e: React.PointerEvent) => {
        const d = dragState.current;
        if (!d.dragging || e.pointerId !== d.pointerId) return;
        const el = ref.current;
        if (!el) return;
        const dy = e.clientY - d.startY;
        if (!d.moved && Math.abs(dy) > 4) {
            d.moved = true;
            el.setPointerCapture(e.pointerId);
            d.captured = true;
            setDragging(true);
        }
        if (!d.moved) return;
        // Setting scrollTop fires the div's own native 'scroll' event, which
        // is what already writes scrollOffsets (each pane's onScroll below)
        // — a drag updates it exactly like a wheel scroll does, with no
        // separate plumbing needed.
        el.scrollTop = d.startScrollTop - dy;
    };
    const endDrag = (e: React.PointerEvent) => {
        const d = dragState.current;
        if (!d.dragging || e.pointerId !== d.pointerId) return;
        d.dragging = false;
        if (d.captured) ref.current?.releasePointerCapture(e.pointerId);
        setDragging(false);
    };
    const onClickCapture = (e: React.MouseEvent) => {
        if (dragState.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            dragState.current.moved = false;
        }
    };

    return { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, onClickCapture, dragging };
}

/** Module scope on purpose — see the file header. Mutated directly from
 *  each pane's onScroll (no re-render needed for a value nothing displays)
 *  and read once per mount to restore. */
const scrollOffsets: { stations: number; recipes: number } = { stations: 0, recipes: 0 };

/** The orange notification chip, same look as MainMenu.tsx's GhostButton
 *  badge (kept as a small duplicate rather than a shared import — one
 *  three-line span isn't worth a cross-file dependency for two call
 *  sites). Pinned at the segment's own top-right corner, half outside it. */
function SegmentBadge({ mu, n }: { mu: number; n: number }) {
    if (n <= 0) return null;
    return (
        <span
            aria-hidden="true"
            className="absolute flex items-center justify-center font-extrabold"
            style={{
                top: 0,
                right: 0,
                transform: 'translate(50%, -50%)',
                minWidth: 16 * mu,
                height: 16 * mu,
                borderRadius: 8 * mu,
                padding: `0 ${4 * mu}px`,
                backgroundColor: '#f97316',
                color: 'var(--color-chocolate)',
                fontSize: Math.max(11, 9 * mu),
                lineHeight: 1,
                border: `${mu < 1.5 ? 1 : 1 * mu}px solid var(--color-chocolate)`,
            }}
        >
            +{n}
        </span>
    );
}

function TabSegment({ mu, active, badge, onClick, children }: {
    mu: number;
    active: boolean;
    badge?: number;
    onClick: () => void;
    children: string;
}) {
    return (
        <button
            type="button"
            className="relative flex-1 font-bold transition-colors active:scale-95"
            style={{
                minHeight: 44,
                padding: `${8 * mu}px 0`,
                borderRadius: 10 * mu,
                fontSize: Math.max(11, 12 * mu),
                backgroundColor: active ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)',
                color: active ? '#000' : 'rgba(255,255,255,0.7)',
            }}
            onClick={onClick}
        >
            {children}
            {typeof badge === 'number' && <SegmentBadge mu={mu} n={badge} />}
        </button>
    );
}

/**
 * Round 17 Part 2: the rebuilt recipe card. The old card painted
 * ui-recipe-scroll as a full backdrop with text over it (unreadable at
 * every size, per the source doc's own 🔴) — now the scroll art is a
 * BANNER at the top with the dish medallion centred on it, and every
 * word sits on solid chocolate below. Locked keeps the exact same
 * structure (banner + medallion), just desaturated, with the shard bar and
 * buy button added beneath.
 *
 * Round 18 Part 4 ("thumbnail still not neat & precise"): the root cause was
 * a spec error, not an implementation one — Round 17's own handover gave a
 * 30mu medallion inside a 26mu banner, on a card with overflow: hidden, so
 * the circle was sliced 2mu off top and bottom. New numbers, arithmetic
 * kept in the comments so a future pass can check it: banner 34mu, medallion
 * 26mu (34-26=8, i.e. 4mu clear above/below), dish image 18mu*zoom inside
 * the medallion (26-18=8, i.e. 4mu clear each side before any zoom). The
 * medallion also gains a 1.5mu walnut ring and a flatter shadow (reads as a
 * plate rim, not a sticker), and the banner switches cover -> 100% auto so
 * all 22 cards crop the 256^2 scroll texture identically instead of a
 * cover-clipped strip at an arbitrary offset (the stray diagonal edge in the
 * user's screenshot).
 */
function RecipeCard({ mu, slug, unlocked, count, gems, onOpen, onBuy }: {
    mu: number;
    slug: string;
    unlocked: boolean;
    count: number;
    gems: number;
    onOpen: () => void;
    onBuy: () => void;
}) {
    const dishIcon = ASSET_SRC.get(`dish-${slug}`);
    const buyDisabled = gems < SCROLL_GEM_PRICE;
    const zoom = dishIconZoom(slug);

    const banner = (
        <div
            style={{
                height: 34 * mu,
                backgroundImage: `url(${ASSET_SRC.get('ui-recipe-scroll')})`,
                backgroundSize: '100% auto',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: unlocked ? undefined : 'grayscale(1)',
            }}
        >
            <div
                style={{
                    width: 26 * mu,
                    height: 26 * mu,
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `${1.5 * mu}px solid #7a4a24`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.45)',
                    opacity: unlocked ? 1 : 0.35,
                    overflow: 'hidden',
                }}
            >
                <img
                    src={dishIcon}
                    alt=""
                    className="object-contain"
                    draggable={false}
                    // maxWidth/maxHeight override Tailwind preflight's own
                    // `img { max-width: 100% }` reset, which otherwise caps
                    // a zoomed (chai/coffee) image back down to the 26mu
                    // medallion it's meant to overflow — found while
                    // verifying Part 3's zoom parity (chai rendered at the
                    // unzoomed size until this was added).
                    style={{ width: 18 * mu * zoom, height: 18 * mu * zoom, maxWidth: 'none', maxHeight: 'none' }}
                />
            </div>
        </div>
    );

    const body = (
        <div style={{ padding: 6 * mu }}>
            <p
                className="font-bold"
                style={{ fontSize: Math.max(11, 9 * mu), lineHeight: 1.2, wordBreak: 'break-word' }}
            >
                {t(`dish.${slug}`)}
            </p>
            {unlocked ? (
                <p
                    className="line-clamp-2"
                    style={{ fontSize: Math.max(11, 7.5 * mu), color: 'rgba(255,255,255,0.75)', marginTop: 2 * mu }}
                >
                    {t(recipeNoteKey(slug))}
                </p>
            ) : (
                <>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                        <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${(count / SHARDS_PER_SCROLL) * 100}%` }}
                        />
                    </div>
                    <span
                        className="flex items-center gap-1"
                        style={{ fontSize: Math.max(11, 7.5 * mu), color: 'rgba(255,255,255,0.7)', marginTop: 4 * mu }}
                    >
                        {t('kitchen.scrolls.progress', { n: count, max: SHARDS_PER_SCROLL })}
                        <img src={ASSET_SRC.get('ui-shard')} alt="" style={{ height: shardImgSize(12), width: shardImgSize(12) }} />
                    </span>
                    <button
                        type="button"
                        disabled={buyDisabled}
                        className={
                            'mt-2 w-full rounded-lg font-bold transition-transform active:scale-95 ' +
                            (buyDisabled ? 'bg-white/10 text-white/40' : 'bg-primary text-black')
                        }
                        style={{ minHeight: 44, fontSize: Math.max(11, 8 * mu) }}
                        onClick={(e) => { e.stopPropagation(); onBuy(); }}
                    >
                        {t('kitchen.scrolls.buy', { n: SCROLL_GEM_PRICE })}
                    </button>
                </>
            )}
        </div>
    );

    // "One tap target >= 44 px": unlocked cards are themselves the tap
    // target (opens the sheet) and are always well over 44px tall; locked
    // cards are never tappable themselves ("locked cards buy, never open")
    // — only the >=44px buy button inside is.
    if (unlocked) {
        return (
            <button
                type="button"
                className="block w-full text-left"
                style={{ borderRadius: 4 * mu, backgroundColor: '#2a1118', overflow: 'hidden' }}
                onClick={onOpen}
            >
                {banner}
                {body}
            </button>
        );
    }
    return (
        <div style={{ borderRadius: 4 * mu, backgroundColor: '#2a1118', overflow: 'hidden' }}>
            {banner}
            {body}
        </div>
    );
}

export default function MetaUpgrades() {
    const gems = useStore((s) => s.gems);
    const metaLevels = useStore((s) => s.metaLevels);
    const towerIcons = useStore((s) => s.towerIcons);
    const shards = useStore((s) => s.shards);
    const scrolls = useStore((s) => s.scrolls);
    const scrollsSeenCount = useStore((s) => s.scrollsSeenCount);
    const mu = useMenuUnit();
    const [activeTab, setActiveTab] = useState<Tab>('stations');
    const [openSlug, setOpenSlug] = useState<string | null>(null);
    const stationsRef = useRef<HTMLDivElement>(null);
    const recipesRef = useRef<HTMLDivElement>(null);
    const stationsDrag = usePaneDrag(stationsRef);
    const recipesDrag = usePaneDrag(recipesRef);

    // A pane's scrollTop restore is a no-op on a `display:none` element — no
    // layout box means no scrollable viewport to scroll into (found while
    // verifying Round 18b Part 4's own "reopening the Kitchen preserves the
    // scroll offset" line: it held for Stations, which is always the visible
    // tab at mount, but silently never worked for Recipes, since Stations is
    // ALWAYS the tab selected on open, making the Recipes pane hidden at the
    // exact moment this used to run — a real bug since Round 17, just never
    // exercised by that round's own tests, which only checked persistence on
    // whichever tab happened to be active). Fixed by restoring each pane's
    // offset lazily, the first time IT becomes the visible tab, rather than
    // unconditionally at mount.
    const restoredRef = useRef({ stations: false, recipes: false });
    useEffect(() => {
        if (activeTab === 'stations' && !restoredRef.current.stations && stationsRef.current) {
            stationsRef.current.scrollTop = scrollOffsets.stations;
            restoredRef.current.stations = true;
        }
        if (activeTab === 'recipes' && !restoredRef.current.recipes && recipesRef.current) {
            recipesRef.current.scrollTop = scrollOffsets.recipes;
            restoredRef.current.recipes = true;
        }
    }, [activeTab]);

    const kitchenBadge = computeKitchenBadge(scrolls.length, scrollsSeenCount);

    // Unlocked cards sort first (spec); RECIPE_SLUGS' own order otherwise —
    // Array.prototype.sort is stable, so ties (both locked, or both
    // unlocked) keep RECIPE_SLUGS' order rather than shuffling.
    const sortedSlugs = [...RECIPE_SLUGS].sort((a, b) => Number(scrolls.includes(b)) - Number(scrolls.includes(a)));
    const gridCols = mu <= 1.5 ? 2 : 3;

    return (
        <div className="absolute inset-0 z-10 flex flex-col bg-surface px-5 pt-safe-top">
            <div className="flex items-center justify-between py-4">
                <h2 className="text-3xl font-bold text-primary">{t('meta.title')}</h2>
                <GemCounter />
            </div>

            <div className="flex" style={{ gap: 8 * mu, marginBottom: 10 * mu }}>
                <TabSegment mu={mu} active={activeTab === 'stations'} onClick={() => { sfx.click(); setActiveTab('stations'); }}>
                    {t('kitchen.tab.stations')}
                </TabSegment>
                <TabSegment
                    mu={mu}
                    active={activeTab === 'recipes'}
                    badge={kitchenBadge}
                    onClick={() => {
                        sfx.click();
                        setActiveTab('recipes');
                        // Round 17 Part 1: the badge clears when the Recipes
                        // TAB opens, not when the Kitchen does (Round 16's
                        // rule) — MainMenu.tsx's Kitchen-button badge reads
                        // this same store field, so the two can never
                        // disagree. Idempotent (save.ts's markScrollsSeen
                        // doc) — harmless to call on every tap, not just the
                        // first.
                        const updated = markScrollsSeen();
                        store.patch({ scrollsSeenCount: updated.scrollsSeenCount });
                    }}
                >
                    {t('kitchen.tab.recipes')}
                </TabSegment>
            </div>

            <div className="relative min-h-0 flex-1">
                <div
                    ref={stationsRef}
                    onScroll={(e) => { scrollOffsets.stations = e.currentTarget.scrollTop; }}
                    onPointerDown={stationsDrag.onPointerDown}
                    onPointerMove={stationsDrag.onPointerMove}
                    onPointerUp={stationsDrag.onPointerUp}
                    onPointerCancel={stationsDrag.onPointerCancel}
                    onClickCapture={stationsDrag.onClickCapture}
                    className="absolute inset-0 touch-pan-y overflow-y-auto pt-1"
                    style={{ display: activeTab === 'stations' ? undefined : 'none', cursor: stationsDrag.dragging ? 'grabbing' : 'grab' }}
                >
                    <div className="flex flex-col gap-4 pb-4">
                        {TOWERS.map((tower) => {
                            const levels = metaLevels[tower.id] ?? { damage: 0, speed: 0, range: 0, unique: 0 };
                            const u = tower.metaUnique;
                            const uniqueMaxed = levels.unique >= u.maxLevel;
                            const uniqueCost = uniqueMaxed ? 0 : metaUpgradeCost(levels.unique);
                            const uniqueAffordable = !uniqueMaxed && gems >= uniqueCost;
                            return (
                                <div key={tower.id} className="rounded-2xl bg-[#1c2e22] p-4">
                                    <div className="flex items-center gap-3">
                                        {towerIcons[tower.id] && (
                                            <img
                                                src={towerIcons[tower.id]}
                                                alt=""
                                                className="h-14 w-14"
                                            />
                                        )}
                                        <p className="text-xl font-bold">{tower.name}</p>
                                    </div>
                                    <div className="mt-2 flex flex-col gap-2">
                                        {STATS.map((stat) => {
                                            const level = levels[stat.key];
                                            const maxed = level >= CONFIG.meta.maxLevel;
                                            const cost = maxed ? 0 : metaUpgradeCost(level);
                                            const affordable = !maxed && gems >= cost;
                                            return (
                                                <div key={stat.key} className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-[1.1rem] font-semibold">
                                                            {t(stat.name)}
                                                            <span className="text-white/50"> {t('meta.statValue', { n: Math.round(level * stat.perLevel * 100) })}</span>
                                                        </p>
                                                        <p className="text-[1.1rem] tabular-nums text-white/50">
                                                            {t('meta.level', { n: level, max: CONFIG.meta.maxLevel })}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        disabled={!affordable}
                                                        className={
                                                            'min-w-24 rounded-xl px-4 py-3 text-[1.1rem] font-bold transition-transform active:scale-95 ' +
                                                            (maxed
                                                                ? 'bg-white/10 text-white/40'
                                                                : affordable
                                                                    ? 'bg-primary text-black'
                                                                    : 'bg-white/10 text-white/40')
                                                        }
                                                        onClick={() => {
                                                            const result = buyMetaUpgrade(tower.id, stat.key);
                                                            if (result) {
                                                                sfx.upgrade();
                                                                store.patch({ gems: result.gems, metaLevels: result.meta });
                                                            }
                                                        }}
                                                    >
                                                        {maxed ? t('meta.max') : t('meta.cost', { n: cost })}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        {/* the tower's signature track */}
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[1.1rem] font-semibold text-primary">
                                                    {t(stationUniqueNameKey(tower.id))}
                                                    <span className="text-white/50"> {uniqueValue(u, levels.unique)}</span>
                                                </p>
                                                <p className="text-[1.1rem] tabular-nums text-white/50">
                                                    {t('meta.uniqueRow', { desc: t(stationUniqueDescKey(tower.id)), n: levels.unique, max: u.maxLevel })}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                disabled={!uniqueAffordable}
                                                className={
                                                    'min-w-24 rounded-xl px-4 py-3 text-[1.1rem] font-bold transition-transform active:scale-95 ' +
                                                    (uniqueMaxed
                                                        ? 'bg-white/10 text-white/40'
                                                        : uniqueAffordable
                                                            ? 'bg-primary text-black'
                                                            : 'bg-white/10 text-white/40')
                                                }
                                                onClick={() => {
                                                    const result = buyMetaUpgrade(tower.id, 'unique');
                                                    if (result) {
                                                        sfx.upgrade();
                                                        store.patch({ gems: result.gems, metaLevels: result.meta });
                                                    }
                                                }}
                                            >
                                                {uniqueMaxed ? t('meta.max') : t('meta.cost', { n: uniqueCost })}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div
                    ref={recipesRef}
                    onScroll={(e) => { scrollOffsets.recipes = e.currentTarget.scrollTop; }}
                    onPointerDown={recipesDrag.onPointerDown}
                    onPointerMove={recipesDrag.onPointerMove}
                    onPointerUp={recipesDrag.onPointerUp}
                    onPointerCancel={recipesDrag.onPointerCancel}
                    onClickCapture={recipesDrag.onClickCapture}
                    className="absolute inset-0 touch-pan-y overflow-y-auto pt-1"
                    style={{ display: activeTab === 'recipes' ? undefined : 'none', cursor: recipesDrag.dragging ? 'grabbing' : 'grab' }}
                >
                    <div className="pb-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-primary">{t('kitchen.scrolls.title')}</h3>
                            <span className="text-[0.95rem] font-semibold text-white/70">
                                {t('kitchen.scrolls.count', { n: scrolls.length, max: RECIPE_SLUGS.length })}
                            </span>
                        </div>
                        <div
                            className="mt-3 grid"
                            style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: 10 * mu }}
                        >
                            {sortedSlugs.map((slug) => {
                                const unlocked = scrolls.includes(slug);
                                const count = Math.min(SHARDS_PER_SCROLL, shards[slug] ?? 0);
                                return (
                                    <RecipeCard
                                        key={slug}
                                        mu={mu}
                                        slug={slug}
                                        unlocked={unlocked}
                                        count={count}
                                        gems={gems}
                                        onOpen={() => setOpenSlug(slug)}
                                        onBuy={() => {
                                            const result = buyScroll(slug);
                                            if (result) {
                                                sfx.upgrade();
                                                store.patch({ gems: result.gems, scrolls: result.scrolls, shards: result.shards, scrollsSeenCount: result.scrollsSeenCount });
                                            }
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-4 pb-safe-bottom">
                <button
                    type="button"
                    className="w-full rounded-2xl bg-white/15 py-4 text-xl font-bold text-white shadow-lg transition-transform active:scale-95"
                    onClick={() => { sfx.click(); store.patch({ metaOpen: false }); }}
                >
                    {t('meta.back')}
                </button>
            </div>

            {openSlug && <RecipeSheet slug={openSlug} onClose={() => setOpenSlug(null)} />}
        </div>
    );
}
