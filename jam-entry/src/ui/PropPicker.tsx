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
 */
import { sfx } from '../audio/audio.ts';
import { KITCHEN_CONFIG } from '../game/kitchenConfig.ts';
import { MANIFEST } from '../assets/manifest.ts';

// Reuses the manifest's own alias->src entries rather than re-typing the
// image paths here — one place lists what a prop's icon file actually is.
const ASSET_SRC = new Map(
    MANIFEST.bundles.flatMap((b) => b.assets).map((a) => [a.alias as string, a.src as string])
);

export default function PropPicker({
    onPick,
    onClose,
}: {
    onPick: (propIndex: number) => void;
    onClose: () => void;
}) {
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
                    {KITCHEN_CONFIG.levelProps.map((prop, i) => (
                        <button
                            key={prop.alias}
                            type="button"
                            className="flex flex-col items-center gap-1 rounded-xl bg-white/10 p-3 transition-transform active:scale-95"
                            onClick={() => {
                                sfx.place();
                                onPick(i);
                            }}
                        >
                            <img src={ASSET_SRC.get(prop.alias)} alt="" className="h-14 w-14 object-contain" />
                            <span className="text-lg font-bold text-white">{prop.name}</span>
                            <span className="text-[1.1rem] text-white/60">Level {prop.level}</span>
                        </button>
                    ))}
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
