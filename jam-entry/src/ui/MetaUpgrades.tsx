/**
 * Persistent upgrades menu (main-menu overlay, store.metaOpen): spend gems
 * on per-tower damage / attack speed / range, ten levels each. One list
 * item per tower. Levels apply to every future run (engine reads them at
 * scene creation).
 */
import { sfx } from '../audio/audio.ts';
import { CONFIG } from '../game/config.ts';
import { TOWERS, type MetaUniqueDef } from '../game/data/towers.ts';
import { t } from '../i18n/index.ts';
import { stationUniqueDescKey, stationUniqueNameKey } from '../i18n/towerKeys.ts';
import { buyMetaUpgrade, metaUpgradeCost, type MetaStat } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';
import GemCounter from './GemCounter.tsx';

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
