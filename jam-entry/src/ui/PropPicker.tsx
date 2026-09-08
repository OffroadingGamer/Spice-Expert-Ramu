/**
 * TEST MODE — modal picker for an empty station slot (round 5, task 3): tap
 * an empty slot, pick one of KITCHEN_CONFIG.levelProps, it gets placed via
 * kitchenScene.ts's Scene.placeProp.
 *
 * DUPLICATE of BuildSheet.tsx's "pick something for an empty pad" pattern,
 * not an extraction of it — BuildSheet is tower-defence, this is the belt.
 * KitchenMode.md §2.5 accepts this cost and asks it be noted wherever the
 * pattern is copied (see TestBelt.tsx's shift-menu note for the other copy).
 *
 * Round 7: the pick button now plays sfx.place() instead of sfx.click(),
 * mirroring BuildSheet.tsx's own pick button exactly — placing a station is
 * the same kind of moment as placing a tower. Cancel keeps sfx.click().
 *
 * Round 22: three changes. Task 2 — the on-board fix (kitchenScene.ts's
 * PROP_FIT_SCALE) has a DOM twin here: `object-contain` on a fixed h-14/w-14
 * box let each icon fit ITS OWN box independently, which is the identical
 * defect one level up the stack. Icons are now sized from one shared
 * fit factor computed off every icon's real naturalWidth/naturalHeight
 * (recorded on load), so the same two props hold the same size ratio here
 * as they do on the board — the absolute size need not match the board's
 * (that's the DOM/Pixi seam elsewhere in this codebase), only the ratio
 * between props. `object-contain` + the fixed box stays as the fallback
 * for any icon that hasn't reported its natural size yet, so nothing jumps
 * or renders at zero while the shared factor is still unknown.
 * Task 3 — each entry now shows its tier's KITCHEN_CONFIG.propTierCost
 * next to the baked ui-coin icon (same ASSET_SRC lookup TestBelt.tsx's end
 * screen uses), under the level.
 * Task 4b/4c — `wallet` arrives as a one-time snapshot from
 * kitchenScene.ts's onSlotTapEmpty (TestBelt.tsx pauses the shift for the
 * modal's lifetime, so the snapshot never goes stale). An entry costing
 * more than `wallet` renders dimmed but stays tappable — no `disabled`,
 * because placeProp's own "Not enough coins" message is what explains the
 * refusal; a dim button that still responds lets the player find that out,
 * a dead one says nothing. Don't "finish the job" by disabling it later.
 */
import { useState } from 'react';
import { sfx } from '../audio/audio.ts';
import { KITCHEN_CONFIG } from '../game/kitchenConfig.ts';
import { MANIFEST } from '../assets/manifest.ts';

// Reuses the manifest's own alias->src entries rather than re-typing the
// image paths here — one place lists what a prop's icon file actually is.
const ASSET_SRC = new Map(
    MANIFEST.bundles.flatMap((b) => b.assets).map((a) => [a.alias as string, a.src as string])
);

// Round 22, task 2: the fixed box each icon fits into — Tailwind's h-14/w-14
// (3.5rem = 56px at the default root font size), matched to the className
// fallback below so neither reads a different box than the other.
const ICON_BOX = 56;

export default function PropPicker({
    onPick,
    onClose,
    wallet,
}: {
    onPick: (propIndex: number) => void;
    onClose: () => void;
    wallet: number;
}) {
    // Round 22, task 2: each icon's real pixel size, recorded once it loads.
    const [naturalSizes, setNaturalSizes] = useState<Record<number, { w: number; h: number }>>({});
    const allLoaded = KITCHEN_CONFIG.levelProps.every((_, i) => naturalSizes[i] !== undefined);
    // The minimum across every icon of min(box/naturalW, box/naturalH) — the
    // same "shared minimum, not a per-icon fit" rule as kitchenScene.ts's
    // PROP_FIT_SCALE, so the two props keep the same size ratio in both
    // places. null until every icon has reported in, per the fallback above.
    const pickerFitScale = allLoaded
        ? Math.min(
              ...KITCHEN_CONFIG.levelProps.map((_, i) => {
                  const { w, h } = naturalSizes[i];
                  return Math.min(ICON_BOX / w, ICON_BOX / h);
              })
          )
        : null;

    return (
        <div
            className="pointer-events-auto absolute inset-0 z-20 flex items-end justify-center bg-black/60"
            onClick={onClose}
        >
            <div
                className="mx-3 mb-3 w-full max-w-md rounded-2xl bg-black/85 p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="mb-3 text-center text-xl font-bold text-white">Pick a station</p>
                <div className="grid grid-cols-2 gap-2">
                    {KITCHEN_CONFIG.levelProps.map((prop, i) => {
                        const cost = KITCHEN_CONFIG.propTierCost[prop.level - 1];
                        const affordable = wallet >= cost;
                        const size = naturalSizes[i];
                        return (
                            <button
                                key={prop.alias}
                                type="button"
                                className="flex flex-col items-center gap-1 rounded-xl bg-white/10 p-3 transition-transform active:scale-95"
                                style={{ opacity: affordable ? 1 : 0.45 }}
                                onClick={() => {
                                    sfx.place();
                                    onPick(i);
                                }}
                            >
                                <img
                                    src={ASSET_SRC.get(prop.alias)}
                                    alt=""
                                    onLoad={(e) => {
                                        const { naturalWidth, naturalHeight } = e.currentTarget;
                                        setNaturalSizes((prev) =>
                                            prev[i] ? prev : { ...prev, [i]: { w: naturalWidth, h: naturalHeight } }
                                        );
                                    }}
                                    className={pickerFitScale === null ? 'h-14 w-14 object-contain' : ''}
                                    style={
                                        pickerFitScale !== null && size
                                            ? { width: size.w * pickerFitScale, height: size.h * pickerFitScale }
                                            : undefined
                                    }
                                />
                                <span className="text-lg font-bold text-white">{prop.name}</span>
                                <span className="text-[1.1rem] text-white/60">Level {prop.level}</span>
                                <span className="flex items-center gap-1 text-[1.1rem] text-white/80">
                                    <img src={ASSET_SRC.get('ui-coin')} alt="" className="h-4 w-4 object-contain" />
                                    {cost}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <button
                    type="button"
                    className="mt-3 w-full rounded-xl bg-white/10 py-2 text-[1.1rem] font-semibold text-white/70 transition-transform active:scale-95"
                    onClick={() => { sfx.click(); onClose(); }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
