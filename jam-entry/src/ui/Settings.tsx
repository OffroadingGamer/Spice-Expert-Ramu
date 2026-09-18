/**
 * Settings overlay (store.settingsOpen): music and sound volume sliders,
 * plus (Round 10) the Name row. Sliders apply to the audio buses
 * immediately; persistence is debounced in save.setAudioVolumes so
 * dragging does not hammer storage.
 *
 * Round 9 Part 2 (docs/Ideas.md §6d, "Playtest of 1.80.0" item 1): rebuilt
 * as a CENTRED DIALOG CARD over the dimmed menu, not a full screen. Sizing
 * rides the menu's own mu unit (useMenuUnit.ts).
 *
 * Round 10 Part 5 (docs/Ideas.md §6d, "Playtest of 1.81.0" item 2, "Settings
 * look A · Order ticket"): the card gains a chocolate outline, an uppercase
 * title, value-chip sliders (Slider.tsx's fully re-skinned theme="cream"),
 * dashed row dividers, and a Name row — all via the shared SettingsCard.tsx
 * shell now also used by Hud.tsx's pause card and RenameDialog.tsx. Still
 * mounted unconditionally by App.tsx whenever store.settingsOpen is true —
 * only ever opened from the menu, unchanged this round.
 */
import { setMusicVolume, setSfxVolume, sfx } from '../audio/audio.ts';
import { t } from '../i18n/index.ts';
import { setAudioVolumes } from '../state/save.ts';
import { store, useStore } from '../state/store.ts';
import { Card, CardCredit, CardDivider, CardGhostButton, CardScrim, CardTitle } from './SettingsCard.tsx';
import Slider from './Slider.tsx';
import { useMenuUnit } from './useMenuUnit.ts';

export default function Settings() {
    const musicVol = useStore((s) => s.musicVol);
    const sfxVol = useStore((s) => s.sfxVol);
    const isGuest = useStore((s) => s.isGuest);
    const runUsername = useStore((s) => s.runUsername);
    const playerName = useStore((s) => s.playerName);
    const mu = useMenuUnit();

    const apply = (music: number, sound: number) => {
        setMusicVolume(music);
        setSfxVolume(sound);
        setAudioVolumes(music, sound);
        store.patch({ musicVol: music, sfxVol: sound });
    };

    const close = () => { sfx.click(); store.patch({ settingsOpen: false }); };

    /** Round 10 Part 6: the Name row's own tap — same guest/RUN split as
     *  the menu's greeting bubble (MainMenu.tsx's handleBubbleTap), but a
     *  RUN account gets a toast there instead of here (the spec only asks
     *  for "no ✎, no tap" on this row for a RUN account — a disabled-
     *  looking, unclickable row communicates that on its own without a
     *  second toast implementation). */
    const openRename = () => { sfx.click(); store.patch({ renameOpen: true }); };
    const displayName = isGuest ? (playerName ?? t('menu.greeting.fallback')) : (runUsername ?? t('menu.greeting.fallback'));

    return (
        <CardScrim onTap={close} zIndex={10}>
            <Card mu={mu}>
                <CardTitle mu={mu}>{t('settings.title')}</CardTitle>
                <div className="flex flex-col" style={{ gap: 10 * mu }}>
                    <Slider theme="cream" mu={mu} label={t('settings.music')} value={musicVol} onChange={(v) => apply(v, sfxVol)} />
                    <Slider
                        theme="cream"
                        mu={mu}
                        label={t('settings.sound')}
                        value={sfxVol}
                        onChange={(v) => {
                            apply(musicVol, v);
                            sfx.click(); // hear the new level while dragging
                        }}
                    />
                </div>
                <CardDivider />
                {/* Round 10 Part 5: Name row — `‹name› ✎` in a dashed box,
                    guests only tappable (opens RenameDialog.tsx); a RUN
                    account shows its username with no pencil and isn't a
                    button at all (spec: "no ✎, no tap"). */}
                {isGuest ? (
                    <button
                        type="button"
                        onClick={openRename}
                        className="flex items-center justify-between transition-transform active:scale-95"
                    >
                        <span style={{ fontSize: 12 * mu, fontWeight: 700 }}>{t('settings.name')}</span>
                        <span
                            className="flex items-center"
                            style={{
                                gap: 4 * mu,
                                border: '2px dashed rgba(42,29,16,0.4)',
                                borderRadius: 8 * mu,
                                padding: `${4 * mu}px ${8 * mu}px`,
                                fontSize: 11 * mu,
                                fontWeight: 700,
                            }}
                        >
                            {t('settings.nameEdit', { name: displayName })}
                        </span>
                    </button>
                ) : (
                    <div className="flex items-center justify-between">
                        <span style={{ fontSize: 12 * mu, fontWeight: 700 }}>{t('settings.name')}</span>
                        <span
                            style={{
                                border: '2px dashed rgba(42,29,16,0.4)',
                                borderRadius: 8 * mu,
                                padding: `${4 * mu}px ${8 * mu}px`,
                                fontSize: 11 * mu,
                                fontWeight: 700,
                                opacity: 0.8,
                            }}
                        >
                            {displayName}
                        </span>
                    </div>
                )}
                <CardDivider />
                {/* Round 8 (docs/Ideas.md §9): mandatory backdrop-art credit.
                    Every label in this card must stay >= 11px at 360 wide
                    (this round's own acceptance bar) — CardCredit already
                    applies the Math.max(11, 8*mu) floor Round 9 measured. */}
                <CardCredit mu={mu} />
                <CardGhostButton mu={mu} onClick={close} style={{ textAlign: 'center' }}>
                    {t('settings.back')}
                </CardGhostButton>
            </Card>
        </CardScrim>
    );
}
