/**
 * Round 9 Part 4 (docs/Ideas.md §6d item 6): the guest name-entry dialog —
 * "What do they call you?" — opened by MainMenu.tsx's Start shift button the
 * FIRST time a guest has no playerName saved (state/save.ts). Same visual
 * language as Settings.tsx's new dialog card (Part 2): centred card over a
 * dimmed scrim, cream fill, chocolate text/border, scaled by the menu's own
 * mu unit (useMenuUnit.ts). Unlike Settings, the scrim does NOT dismiss this
 * one — it's a one-time gate the player must resolve (type a name or Skip),
 * not a screen they can back out of and leave unresolved.
 *
 * Skip (and an empty/whitespace-only typed name — "empty = Skip", per the
 * handover) assigns a random "FirstName LastName" from the two lists below:
 * plain, kitchen-appropriate names, no digits or symbols, none intended to
 * read as a specific real public figure.
 */
import { useState } from 'react';
import { sfx } from '../audio/audio.ts';
import { setPlayerName } from '../state/save.ts';
import { store } from '../state/store.ts';
import { useMenuUnit } from './useMenuUnit.ts';

const FIRST_NAMES = [
    'Meera', 'Arjun', 'Kabir', 'Ananya', 'Rohan', 'Priya', 'Devika', 'Aarav',
    'Ishaan', 'Kavya', 'Neha', 'Vikram', 'Diya', 'Karan', 'Tara', 'Aditi',
    'Rahul', 'Sana', 'Yash', 'Riya', 'Nikhil', 'Pooja', 'Varun', 'Simran',
    'Aryan', 'Zoya', 'Dev', 'Anika', 'Rishi', 'Maya',
];

const LAST_NAMES = [
    'Pillai', 'Nair', 'Sethi', 'Rao', 'Kapoor', 'Iyer', 'Menon', 'Gupta',
    'Reddy', 'Bhat', 'Chawla', 'Desai', 'Joshi', 'Kulkarni', 'Malhotra',
    'Shah', 'Verma', 'Kaur', 'Bose', 'Chatterjee', 'Mehta', 'Nambiar',
    'Oberoi', 'Pandey', 'Qureshi', 'Sane', 'Thakur', 'Ubale', 'Varma', 'Wagh',
];

/** letters, spaces, '.', "'" only — the handover's own allowed charset. */
const NAME_PATTERN = /^[A-Za-z .']*$/;

function assignName(): string {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    return `${first} ${last}`;
}

export default function NameDialog({ onDone }: { onDone: (name: string) => void }) {
    const mu = useMenuUnit();
    const [value, setValue] = useState('');

    const commit = (typed: string) => {
        const trimmed = typed.trim().slice(0, 16);
        const finalName = trimmed.length > 0 ? trimmed : assignName();
        setPlayerName(finalName);
        store.patch({ playerName: finalName });
        onDone(finalName);
    };

    return (
        <div
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(42,29,16,0.6)' }}
        >
            <div
                className="flex flex-col items-stretch"
                style={{
                    width: 200 * mu,
                    backgroundColor: 'var(--color-cream)',
                    color: 'var(--color-chocolate)',
                    borderRadius: 12 * mu,
                    padding: 14 * mu,
                    gap: 10 * mu,
                }}
            >
                <h2 className="text-center font-black" style={{ fontSize: 15 * mu }}>
                    What do they call you?
                </h2>
                <input
                    type="text"
                    value={value}
                    maxLength={16}
                    placeholder="Type your name"
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
                    <button
                        type="button"
                        className="flex-1 font-bold transition-transform active:scale-95"
                        style={{
                            padding: `${8 * mu}px 0`,
                            borderRadius: 9 * mu,
                            border: `${1 * mu}px solid var(--color-chocolate)`,
                            backgroundColor: 'transparent',
                            color: 'var(--color-chocolate)',
                            fontSize: 12 * mu,
                        }}
                        onClick={() => { sfx.click(); commit(''); }}
                    >
                        Skip
                    </button>
                    <button
                        type="button"
                        className="flex-1 font-bold shadow-lg transition-transform active:scale-95"
                        style={{
                            padding: `${8 * mu}px 0`,
                            borderRadius: 9 * mu,
                            border: `${1 * mu}px solid var(--color-chocolate)`,
                            backgroundColor: '#f97316',
                            color: 'var(--color-chocolate)',
                            fontSize: 12 * mu,
                        }}
                        onClick={() => { sfx.click(); commit(value); }}
                    >
                        That's me
                    </button>
                </div>
            </div>
        </div>
    );
}
