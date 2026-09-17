/**
 * Settings overlay (store.settingsOpen): music and sound volume sliders.
 * Sliders apply to the audio buses immediately; persistence is debounced
 * in save.setAudioVolumes so dragging does not hammer storage.
 *
 * Round 9 Part 2 (docs/Ideas.md §6d, "Playtest of 1.80.0" item 1): rebuilt
 * as a CENTRED DIALOG CARD over the dimmed menu, not a full screen — same
 * three rows (Music, Sound, credit line), Back as a ghost button, scrim tap
 * = Back. Sizing rides the menu's own mu unit (useMenuUnit.ts, lifted out
 * of MainMenu.tsx this round since this file is now a second consumer).
 * Still mounted unconditionally by App.tsx whenever store.settingsOpen is
 * true — only ever opened from the menu today (App.tsx / MainMenu.tsx),
 * unchanged this round.
 */
import { setMusicVolume, setSfxVolume, sfx } from '../audio/audio.ts';
import { setAudioVolumes } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';
import Slider from './Slider.tsx';
import { useMenuUnit } from './useMenuUnit.ts';

export default function Settings() {
    const musicVol = useStore((s) => s.musicVol);
    const sfxVol = useStore((s) => s.sfxVol);
    const mu = useMenuUnit();

    const apply = (music: number, sound: number) => {
        setMusicVolume(music);
        setSfxVolume(sound);
        setAudioVolumes(music, sound);
        store.patch({ musicVol: music, sfxVol: sound });
    };

    const close = () => { sfx.click(); store.patch({ settingsOpen: false }); };

    return (
        <div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(42,29,16,0.6)' }}
            onClick={close}
        >
            <div
                className="flex flex-col items-stretch"
                style={{
                    width: 200 * mu,
                    backgroundColor: 'var(--color-cream)',
                    color: 'var(--color-chocolate)',
                    borderRadius: 12 * mu,
                    padding: 14 * mu,
                    gap: 12 * mu,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-center font-black" style={{ fontSize: 16 * mu }}>Settings</h2>
                <div className="flex flex-col" style={{ gap: 10 * mu }}>
                    <Slider theme="cream" label="Music" value={musicVol} onChange={(v) => apply(v, sfxVol)} />
                    <Slider
                        theme="cream"
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
                    anywhere in this codebase to append to (KayKit/SFX
                    credits the handover assumed existed were not found —
                    see that round's own report) — this IS the credits
                    screen, minimal, until a real one exists. Every label in
                    this card must stay >= 11px at 360 wide (this round's own
                    acceptance bar) — at mu 1.5 (measured at 360 wide, Round
                    8b), a plain 7*mu would be 10.5px, under the floor, so
                    this is Math.max(11, 8*mu): the floor wins below mu
                    ~1.375, the formula wins above it. */}
                <p className="text-center" style={{ fontSize: Math.max(11, 8 * mu), color: 'rgba(42,29,16,0.7)' }}>
                    Backdrop art — Archita Sharma (@arc_inmotion)
                </p>
                <button
                    type="button"
                    className="font-bold transition-transform active:scale-95"
                    style={{
                        padding: `${9 * mu}px ${6 * mu}px`,
                        fontSize: 11 * mu,
                        borderRadius: 10 * mu,
                        border: `${mu < 1.5 ? 1 : 1 * mu}px solid var(--color-chocolate)`,
                        backgroundColor: 'transparent',
                        color: 'var(--color-chocolate)',
                    }}
                    onClick={close}
                >
                    Back
                </button>
            </div>
        </div>
    );
}
