/**
 * Settings overlay (store.settingsOpen): music and sound volume sliders.
 * Sliders apply to the audio buses immediately; persistence is debounced
 * in save.setAudioVolumes so dragging does not hammer storage.
 */
import { setMusicVolume, setSfxVolume, sfx } from '../audio/audio.ts';
import { setAudioVolumes } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';
import Slider from './Slider.tsx';

export default function Settings() {
    const musicVol = useStore((s) => s.musicVol);
    const sfxVol = useStore((s) => s.sfxVol);

    const apply = (music: number, sound: number) => {
        setMusicVolume(music);
        setSfxVolume(sound);
        setAudioVolumes(music, sound);
        store.patch({ musicVol: music, sfxVol: sound });
    };

    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 bg-surface px-10">
            <h2 className="text-3xl font-bold text-primary">Settings</h2>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Slider label="Music" value={musicVol} onChange={(v) => apply(v, sfxVol)} />
                <Slider
                    label="Sound"
                    value={sfxVol}
                    onChange={(v) => {
                        apply(musicVol, v);
                        sfx.click(); // hear the new level while dragging
                    }}
                />
            </div>
            {/* Round 8 (docs/Ideas.md §9): mandatory backdrop-art credit.
                There was no credits screen and no existing credit text
                anywhere in this codebase to append to (KayKit/SFX credits
                the handover assumed existed were not found — see this
                round's own report) — this IS the credits screen, minimal,
                until a real one exists. */}
            <p className="max-w-sm text-center text-[0.85rem] text-white/50">
                Backdrop art — Archita Sharma (@arc_inmotion)
            </p>
            <button
                type="button"
                className="w-64 rounded-2xl bg-white/15 px-12 py-4 text-xl font-bold text-white shadow-lg transition-transform active:scale-95"
                onClick={() => {
                    sfx.click();
                    store.patch({ settingsOpen: false });
                }}
            >
                Back
            </button>
        </div>
    );
}
