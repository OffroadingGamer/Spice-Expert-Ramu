/**
 * Round 10 Part 6 (docs/Ideas.md §6d, "Playtest of 1.81.0" item 3): "Your
 * name" — opened by tapping the menu's greeting bubble or Settings' Name
 * row (MainMenu.tsx / Settings.tsx, both guests-only call sites — a RUN
 * account never reaches this component, it gets a toast instead). Same
 * Settings-card shell as Settings.tsx/Hud.tsx's pause card
 * (SettingsCard.tsx), field prefilled with the current name, same
 * letters/spaces/./' + 16-char validation as the boot NameDialog.tsx.
 *
 * Empty or UNCHANGED (trimmed value equals the current name) both count as
 * Cancel — an unchanged "save" would still be correct behaviour, but firing
 * a resubmit for a no-op rename wastes the 5s-spaced submit budget
 * (leaderboard.ts) on nothing, so it's treated as a cancel rather than a
 * same-value save. Never mounted during a run (App.tsx only renders it
 * alongside Settings/rename from the menu — see this round's own report for
 * why "never during a run" needed no extra guard here).
 *
 * On a real save, playerName updates immediately (the bubble/row redraw
 * off the store, not off this component) and the player's current best is
 * fire-and-forget re-submitted to both boards with the new
 * metadata.displayName (leaderboard.ts's resubmitBestWithName) — never a
 * new score.
 */
import { useState } from 'react';
import { sfx } from '../audio/audio.ts';
import { resubmitBestWithName } from '../sdk/leaderboard.ts';
import { renamePlayer } from '../state/save.ts';
import { store } from '../state/store.ts';
import { Card, CardGhostButton, CardScrim, CardTitle } from './SettingsCard.tsx';
import { useMenuUnit } from './useMenuUnit.ts';

/** letters, spaces, '.', "'" only — same charset as the boot dialog. */
const NAME_PATTERN = /^[A-Za-z .']*$/;

export default function RenameDialog() {
    const mu = useMenuUnit();
    const currentName = store.get().playerName ?? '';
    const [value, setValue] = useState(currentName);

    const close = () => store.patch({ renameOpen: false });

    const cancel = () => { sfx.click(); close(); };

    const save = () => {
        sfx.click();
        const trimmed = value.trim().slice(0, 16);
        if (trimmed.length === 0 || trimmed === currentName) { close(); return; }
        if (!renamePlayer(trimmed)) { close(); return; }
        store.patch({ playerName: trimmed });
        close();
        // Fire-and-forget: never a new score, only the display name on
        // whatever the player's current best already is.
        void resubmitBestWithName(trimmed);
    };

    return (
        <CardScrim onTap={cancel} zIndex={20}>
            <Card mu={mu}>
                <CardTitle mu={mu}>Your name</CardTitle>
                <input
                    type="text"
                    value={value}
                    maxLength={16}
                    autoFocus
                    onChange={(e) => {
                        const v = e.target.value;
                        if (NAME_PATTERN.test(v)) setValue(v);
                    }}
                    style={{
                        fontSize: 13 * mu,
                        padding: `${6 * mu}px ${9 * mu}px`,
                        borderRadius: 8 * mu,
                        border: `${1 * mu}px solid var(--color-chocolate)`,
                        color: 'var(--color-chocolate)',
                        backgroundColor: '#ffffff',
                    }}
                />
                <div className="flex" style={{ gap: 8 * mu }}>
                    <CardGhostButton mu={mu} onClick={cancel} style={{ flex: 1, textAlign: 'center' }}>
                        Cancel
                    </CardGhostButton>
                    <button
                        type="button"
                        className="flex-1 font-bold shadow-lg transition-transform active:scale-95"
                        style={{
                            padding: `${9 * mu}px 0`,
                            borderRadius: 10 * mu,
                            border: `${2 * mu}px solid var(--color-chocolate)`,
                            backgroundColor: '#f97316',
                            color: 'var(--color-chocolate)',
                            fontSize: 11 * mu,
                        }}
                        onClick={save}
                    >
                        Save
                    </button>
                </div>
            </Card>
        </CardScrim>
    );
}
