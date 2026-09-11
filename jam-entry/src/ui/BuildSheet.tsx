/**
 * Bottom sheet for the selected pad: pick a tower for an empty pad, or
 * manage the one standing there (upgrade top-right, sell beside it with a
 * confirmation dialog, and a Target row to pick the tower's targeting mode).
 * Engine state is read synchronously via actions.getEngine(); re-renders
 * ride on store changes (coins, selection, padVersion). Selling keeps the
 * pad selected, so the sheet flips straight to the build options.
 *
 * Round D (FTUE walls, GDD §10.11): Close is hidden for the duration of a
 * forced beat (store.ftueBeat !== null — actions.ts is the real gate, this
 * is just the display rule), and Sell stays disabled for the whole
 * onboarding (store.ftueActive), not only inside the forced beats — it
 * returns once wave 3 begins. The forced-upgrade beat's arrow cue is a DOM
 * cue anchored to the Upgrade button's own rect (no stage.ts transform —
 * this button lives inside the sheet's normal DOM layout, not the canvas).
 */
import { useEffect, useRef, useState } from 'react';
import { sfx } from '../audio/audio.ts';
import { getEngine, placeTower, sellTower, setTargeting, upgradeTower } from '../game/actions.ts';
import { CONFIG } from '../game/config.ts';
import { TARGETING_DESCRIPTIONS, TARGETING_LABELS, TARGETING_MODES } from '../game/data/targeting.ts';
import { TOWERS, type TowerDef } from '../game/data/towers.ts';
import { store, useStore } from '../state/store.ts';

/** Player-facing label for a gold pad's bonus. */
function bonusLabel(bonus: NonNullable<(typeof CONFIG.pads)[number]['bonus']>): string {
    const pct = Math.round((bonus.mult - 1) * 100);
    const stat = bonus.stat === 'damage' ? 'damage' : bonus.stat === 'fireRate' ? 'fire rate' : 'radius';
    return `${pct}% ${stat} bonus!`;
}

function BonusBadge({ padIndex }: { padIndex: number }) {
    const bonus = CONFIG.pads[padIndex].bonus;
    if (!bonus) return null;
    return (
        <div className="flex items-center justify-center gap-2">
            <span className="text-xl">⭐</span>
            <span className="text-[1.1rem] font-bold text-primary">{bonusLabel(bonus)}</span>
        </div>
    );
}

/** One-word build-card tag for what makes each tower special. */
function tagFor(def: TowerDef): string {
    if (def.attack.kind === 'beam') return 'Batches';
    if (def.status?.type === 'slow') return 'Holds';
    if (def.status?.type === 'poison') return 'Marinates';
    if (def.status?.type === 'burn') return 'Sears';
    if (def.status?.type === 'frozen') return 'Chills';
    if (def.status?.type === 'knockback') return 'Sends back';
    if (def.attack.kind === 'projectile' && def.attack.splash > 0) return 'Wide heat';
    return 'Fast hands';
}

export default function BuildSheet() {
    const selectedPad = useStore((s) => s.selectedPad);
    const coins = useStore((s) => s.coins);
    const tdPhase = useStore((s) => s.tdPhase);
    const towerIcons = useStore((s) => s.towerIcons);
    const ftueActive = useStore((s) => s.ftueActive);
    const ftueBeat = useStore((s) => s.ftueBeat);
    useStore((s) => s.padVersion); // re-render on coin-free engine mutations
    const [confirmSell, setConfirmSell] = useState(false);
    const [showTargetHelp, setShowTargetHelp] = useState(false);
    const upgradeBtnRef = useRef<HTMLButtonElement>(null);
    const [upgradeArrowPos, setUpgradeArrowPos] = useState<{ x: number; y: number } | null>(null);

    // a new selection always starts with both popups closed
    useEffect(() => {
        setConfirmSell(false);
        setShowTargetHelp(false);
    }, [selectedPad]);

    const engine = getEngine();
    const tower = selectedPad !== null ? engine?.state.towers.find((t) => t.padIndex === selectedPad) : undefined;
    const showUpgradeArrow = ftueBeat === 'upgrade0' && selectedPad === 0;

    // Anchor the arrow to the Upgrade button's own rect — viewport (fixed)
    // coords, no stage.ts transform, since this button is normal DOM layout
    // inside the sheet, not something positioned on the canvas.
    useEffect(() => {
        if (!showUpgradeArrow) { setUpgradeArrowPos(null); return; }
        const compute = () => {
            const btn = upgradeBtnRef.current;
            if (!btn) return;
            const r = btn.getBoundingClientRect();
            setUpgradeArrowPos({ x: r.left + r.width / 2, y: r.top });
        };
        compute();
        window.addEventListener('resize', compute);
        return () => window.removeEventListener('resize', compute);
    }, [showUpgradeArrow, tower?.level]);

    if (selectedPad === null || !engine) return null;
    if (tdPhase === 'lost') return null;

    const refund = tower ? Math.floor(tower.spent * CONFIG.economy.sellRefund) : 0;

    return (
        <>
            <div className="absolute inset-x-0 bottom-0 pb-safe-bottom">
                {/* Visual round, task 5: was bg-black/80 (20% see-through) with
                    no scrim behind it, so the belt and the D-row pads read
                    straight through the sheet — not a z-order bug, the panel
                    let the board through by construction. bg-surface is the
                    same fully-opaque dark the rest of the HUD's chips use. */}
                <div className="mx-3 mb-3 rounded-2xl bg-surface p-4">
                    {!tower ? (
                        <div className="grid grid-cols-3 gap-2">
                            {TOWERS.map((def) => {
                                const affordable = coins >= def.cost;
                                return (
                                    <button
                                        key={def.id}
                                        type="button"
                                        disabled={!affordable}
                                        className={
                                            'flex w-full flex-col items-center gap-1 rounded-xl p-3 transition-transform active:scale-95 ' +
                                            (affordable ? 'bg-white/10' : 'bg-white/5 opacity-40')
                                        }
                                        onClick={() => {
                                            sfx.place();
                                            placeTower(selectedPad, def.id);
                                            store.patch({ selectedPad: null });
                                        }}
                                    >
                                        {towerIcons[def.id] && (
                                            // object-contain: real prop art (Round 3) isn't square like
                                            // the old procedural icons — never stretch it to fill the box.
                                            <img src={towerIcons[def.id]} alt="" className="h-12 w-12 object-contain" />
                                        )}
                                        <span className="text-xl font-bold">{def.name}</span>
                                        <span className="text-[1.1rem] text-white/70 tabular-nums">🪙 {def.cost}</span>
                                        <span className="text-[1.1rem] text-white/50">{tagFor(def)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 px-1">
                            {/* header: name + stats left; sell, then upgrade, in the top-right */}
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xl font-bold">
                                        {tower.def.name} · Lv {tower.level}
                                    </p>
                                    <p className="text-[1.1rem] text-white/60 tabular-nums">
                                        {Math.round(tower.damage)} dmg · {tower.fireRate.toFixed(1)}/s
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Disabled (not hidden) for the whole onboarding, not just
                                        the forced beats — it returns once wave 3 begins. */}
                                    <button
                                        type="button"
                                        disabled={ftueActive}
                                        className={
                                            'rounded-xl px-5 py-3 text-[1.1rem] font-bold text-white transition-transform active:scale-95 ' +
                                            (ftueActive ? 'bg-red-500/30 opacity-40' : 'bg-red-500/80')
                                        }
                                        onClick={() => { sfx.click(); setConfirmSell(true); }}
                                    >
                                        Sell
                                    </button>
                                    {tower.level <= tower.def.upgrades.length ? (
                                        (() => {
                                            const cost = tower.def.upgrades[tower.level - 1].cost;
                                            const affordable = coins >= cost;
                                            return (
                                                <button
                                                    ref={upgradeBtnRef}
                                                    type="button"
                                                    disabled={!affordable}
                                                    className={
                                                        'rounded-xl px-5 py-3 text-[1.1rem] font-bold transition-transform active:scale-95 ' +
                                                        (affordable ? 'bg-primary text-black' : 'bg-white/10 text-white/40')
                                                    }
                                                    onClick={() => {
                                                        sfx.upgrade();
                                                        upgradeTower(selectedPad);
                                                    }}
                                                >
                                                    Upgrade 🪙 {cost}
                                                </button>
                                            );
                                        })()
                                    ) : (
                                        <span className="rounded-xl bg-white/10 px-5 py-3 text-[1.1rem] font-bold text-white/50">
                                            Max
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* targeting: label + help, then one button per mode, active lit */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-[1.1rem] font-semibold text-white/60">Target:</p>
                                    <button
                                        type="button"
                                        aria-label="What do the targeting options mean?"
                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[1.1rem] font-bold text-white/70 transition-transform active:scale-95"
                                        onClick={() => { sfx.click(); setShowTargetHelp(true); }}
                                    >
                                        ?
                                    </button>
                                </div>
                                <div className="mt-1 flex gap-1">
                                    {TARGETING_MODES.map((mode) => (
                                        <button
                                            key={mode}
                                            type="button"
                                            className={
                                                'flex-1 rounded-lg px-1 py-2 text-center text-[1.1rem] font-semibold transition-colors ' +
                                                (tower.targeting === mode
                                                    ? 'bg-primary text-black'
                                                    : 'bg-white/10 text-white/70')
                                            }
                                            onClick={() => {
                                                sfx.click();
                                                setTargeting(selectedPad, mode);
                                            }}
                                        >
                                            {TARGETING_LABELS[mode]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* the gold pad's perk, under the target row */}
                            <BonusBadge padIndex={selectedPad} />
                        </div>
                    )}
                    {/* on an empty pad, show the perk just above Close */}
                    {!tower && (
                        <div className="mt-3">
                            <BonusBadge padIndex={selectedPad} />
                        </div>
                    )}
                    {/* Hidden (not just disabled) for the duration of a forced beat —
                        the real gate is the canvas tap-wall (towerScene.ts's onTap)
                        and startWave()'s own guard; this only keeps the escape
                        hatch out of sight. */}
                    {!ftueBeat && (
                        <button
                            type="button"
                            className="mt-3 w-full rounded-xl bg-white/10 py-2 text-[1.1rem] font-semibold text-white/70 transition-transform active:scale-95"
                            onClick={() => { sfx.click(); store.patch({ selectedPad: null }); }}
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
            {upgradeArrowPos && (
                <div
                    className="pointer-events-none fixed z-10 flex flex-col items-center"
                    style={{ left: upgradeArrowPos.x, top: upgradeArrowPos.y - 60, transform: 'translateX(-50%)' }}
                >
                    <span className="motion-safe:animate-bounce text-5xl leading-none">⬇️</span>
                </div>
            )}
            {showTargetHelp && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-8">
                    <div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl bg-black/90 p-6">
                        <p className="text-center text-xl font-bold">Targeting</p>
                        <p className="text-[1.1rem] text-white/60">
                            Who this tower attacks when several bugs are in range:
                        </p>
                        <div className="flex flex-col gap-2">
                            {TARGETING_MODES.map((mode) => (
                                <p key={mode} className="text-[1.1rem] leading-6">
                                    <span className="font-bold text-primary">{TARGETING_LABELS[mode]}:</span>
                                    <span className="text-white/80"> {TARGETING_DESCRIPTIONS[mode]}</span>
                                </p>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="mt-2 w-full rounded-xl bg-primary py-3 text-[1.1rem] font-bold text-black transition-transform active:scale-95"
                            onClick={() => { sfx.click(); setShowTargetHelp(false); }}
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
            {confirmSell && tower && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-10">
                    <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-black/90 p-6">
                        <p className="text-center text-xl font-bold">
                            Sell {tower.def.name} for 🪙 {refund}?
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className="flex-1 rounded-xl bg-white/10 py-3 text-[1.1rem] font-bold text-white/80 transition-transform active:scale-95"
                                onClick={() => { sfx.click(); setConfirmSell(false); }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="flex-1 rounded-xl bg-red-500/80 py-3 text-[1.1rem] font-bold text-white transition-transform active:scale-95"
                                onClick={() => {
                                    sfx.sell();
                                    setConfirmSell(false);
                                    sellTower(selectedPad);
                                }}
                            >
                                Sell +{refund}c
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
