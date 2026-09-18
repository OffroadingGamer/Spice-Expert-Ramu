/**
 * Persistent upgrades menu (main-menu overlay, store.metaOpen): spend gems
 * on per-tower damage / attack speed / range, ten levels each. One list
 * item per tower. Levels apply to every future run (engine reads them at
 * scene creation).
 */
import { MANIFEST } from '../assets/manifest.ts';
import { sfx } from '../audio/audio.ts';
import { CONFIG } from '../game/config.ts';
import { RECIPE_SLUGS, recipeNoteKey } from '../game/data/recipes.ts';
import { TOWERS, type MetaUniqueDef } from '../game/data/towers.ts';
import { t } from '../i18n/index.ts';
import { stationUniqueDescKey, stationUniqueNameKey } from '../i18n/towerKeys.ts';
import { buyMetaUpgrade, buyScroll, metaUpgradeCost, SCROLL_GEM_PRICE, SHARDS_PER_SCROLL, type MetaStat } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';
import { useMenuUnit } from './useMenuUnit.ts';
import GemCounter from './GemCounter.tsx';

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

export default function MetaUpgrades() {
    const gems = useStore((s) => s.gems);
    const metaLevels = useStore((s) => s.metaLevels);
    const towerIcons = useStore((s) => s.towerIcons);
    const shards = useStore((s) => s.shards);
    const scrolls = useStore((s) => s.scrolls);
    const mu = useMenuUnit();
    // Unlocked cards sort first (spec); RECIPE_SLUGS' own order otherwise —
    // Array.prototype.sort is stable, so ties (both locked, or both
    // unlocked) keep RECIPE_SLUGS' order rather than shuffling.
    const sortedSlugs = [...RECIPE_SLUGS].sort((a, b) => Number(scrolls.includes(b)) - Number(scrolls.includes(a)));
    return (
        <div className="absolute inset-0 z-10 flex flex-col bg-surface px-5 pt-safe-top">
            <div className="flex items-center justify-between py-4">
                <h2 className="text-3xl font-bold text-primary">{t('meta.title')}</h2>
                <GemCounter />
            </div>
            <div className="flex-1 touch-pan-y overflow-y-auto pt-1">
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
                {/* Round 14 Part 3 (docs/Ideas.md §10.4 pick B): Recipe
                    scrolls — a new section under the three stat upgrades,
                    inside the same scroll container (so it scrolls with the
                    tower list, not a second independent scroller). Cards are
                    62*mu wide, wrapping in a plain flex row rather than a
                    fixed-column grid so the count-per-row adapts to mu the
                    same way the rest of this screen's spacing does. */}
                <div className="mt-2 border-t border-white/10 pt-4 pb-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-primary">{t('kitchen.scrolls.title')}</h3>
                        <span className="text-[0.95rem] font-semibold text-white/70">
                            {t('kitchen.scrolls.count', { n: scrolls.length, max: RECIPE_SLUGS.length })}
                        </span>
                    </div>
                    <div className="mt-3 flex flex-wrap justify-center gap-3">
                        {sortedSlugs.map((slug) => {
                            const unlocked = scrolls.includes(slug);
                            const dishIcon = ASSET_SRC.get(`dish-${slug}`);
                            const count = Math.min(SHARDS_PER_SCROLL, shards[slug] ?? 0);
                            const buyDisabled = gems < SCROLL_GEM_PRICE;
                            if (unlocked) {
                                return (
                                    <div
                                        key={slug}
                                        className="relative flex shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl text-center"
                                        style={{ width: 62 * mu, minHeight: 62 * mu, padding: 6 * mu }}
                                    >
                                        <img
                                            src={ASSET_SRC.get('ui-recipe-scroll')}
                                            alt=""
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                        <img
                                            src={dishIcon}
                                            alt=""
                                            className="relative h-10 w-10 rounded-full border border-black/30 bg-white/70 object-contain"
                                        />
                                        <span className="relative max-w-full truncate text-[11px] font-bold text-black">
                                            {t(`dish.${slug}`)}
                                        </span>
                                        <span className="relative text-[11px] leading-tight font-semibold text-black/80">
                                            {t(recipeNoteKey(slug))}
                                        </span>
                                    </div>
                                );
                            }
                            return (
                                <div
                                    key={slug}
                                    className="flex shrink-0 flex-col items-center gap-1.5 rounded-xl bg-[#1c2e22]"
                                    style={{ width: 62 * mu, padding: 6 * mu }}
                                >
                                    <img
                                        src={dishIcon}
                                        alt=""
                                        className="h-10 w-10 rounded-full object-contain"
                                        style={{ filter: 'grayscale(1)', opacity: 0.3 }}
                                    />
                                    <span className="max-w-full truncate text-[11px] font-bold">{t(`dish.${slug}`)}</span>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                                        <div
                                            className="h-full rounded-full bg-primary"
                                            style={{ width: `${(count / SHARDS_PER_SCROLL) * 100}%` }}
                                        />
                                    </div>
                                    <span className="flex items-center gap-1 text-[11px] font-bold text-white/70">
                                        {t('kitchen.scrolls.progress', { n: count, max: SHARDS_PER_SCROLL })}
                                        <img
                                            src={ASSET_SRC.get('ui-shard')}
                                            alt=""
                                            style={{ height: shardImgSize(12), width: shardImgSize(12) }}
                                        />
                                    </span>
                                    <button
                                        type="button"
                                        disabled={buyDisabled}
                                        className={
                                            'w-full rounded-lg text-[11px] font-bold transition-transform active:scale-95 ' +
                                            (buyDisabled ? 'bg-white/10 text-white/40' : 'bg-primary text-black')
                                        }
                                        style={{ minHeight: 44 }}
                                        onClick={() => {
                                            const result = buyScroll(slug);
                                            if (result) {
                                                sfx.upgrade();
                                                store.patch({ gems: result.gems, scrolls: result.scrolls, shards: result.shards });
                                            }
                                        }}
                                    >
                                        {t('kitchen.scrolls.buy', { n: SCROLL_GEM_PRICE })}
                                    </button>
                                </div>
                            );
                        })}
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
        </div>
    );
}
