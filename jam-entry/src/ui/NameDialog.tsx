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
import { setLocale, t, type Locale } from '../i18n/index.ts';
import { clampToGraphemes } from '../shared/graphemes.ts';
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

/** Round 13 Part 2 (docs/i18n/strings.md's own R13 constraint #3): widened
 *  from `/^[A-Za-z .']*$/` to `\p{L}\p{M}` (any Unicode letter plus
 *  combining marks) so Devanagari/Tamil names don't get rejected keystroke
 *  by keystroke — the ASCII-only pattern was a hard blocker for anyone who
 *  wants to type their name in their own script, independent of which UI
 *  language they're playing in. Length limit (16, at the trim/slice call
 *  sites) is unchanged. */
const NAME_PATTERN = /^[\p{L}\p{M} .']*$/u;

function assignName(): string {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    return `${first} ${last}`;
}

/**
 * Round 20 Part 2 (docs/Ideas.md §10.2 pick A): the one-time language step —
 * only ever mounted when `askLanguage` is true (main.tsx's own first-ever-
 * guest-boot + suggestsHindi() gate, see App.tsx), so a returning guest or
 * an English-suggesting locale never sees this at all. Picking a language
 * calls setLocale() immediately (instant, same as the Settings row) and
 * advances straight to the name step in the SAME card — no separate dialog,
 * no second scrim flash.
 */
function LanguageStep({ mu, onPicked }: { mu: number; onPicked: () => void }) {
    const pick = (l: Locale) => { sfx.click(); setLocale(l); onPicked(); };
    return (
        <>
            <h2 className="text-center font-black" style={{ fontSize: 15 * mu }}>
                {t('name.language.title')}
            </h2>
            <div className="flex" style={{ gap: 8 * mu }}>
                {(['en', 'hi'] as const).map((l) => (
                    <button
                        key={l}
                        type="button"
                        className="flex-1 font-bold shadow-lg transition-transform active:scale-95"
                        style={{
                            padding: `${8 * mu}px 0`,
                            borderRadius: 9 * mu,
                            border: `${1 * mu}px solid var(--color-chocolate)`,
                            backgroundColor: l === 'hi' ? '#f97316' : 'transparent',
                            color: 'var(--color-chocolate)',
                            fontSize: 13 * mu,
                        }}
                        onClick={() => pick(l)}
                    >
                        {l === 'en' ? 'English' : 'हिन्दी'}
                    </button>
                ))}
            </div>
        </>
    );
}

export default function NameDialog({ onDone, askLanguage = false }: { onDone: (name: string) => void; askLanguage?: boolean }) {
    const mu = useMenuUnit();
    const [value, setValue] = useState('');
    const [step, setStep] = useState<'language' | 'name'>(askLanguage ? 'language' : 'name');

    const commit = (typed: string) => {
        const trimmed = clampToGraphemes(typed.trim(), 16);
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
                {step === 'language' ? (
                    <LanguageStep mu={mu} onPicked={() => setStep('name')} />
                ) : (
                <>
                <h2 className="text-center font-black" style={{ fontSize: 15 * mu }}>
                    {t('name.title')}
                </h2>
                <input
                    type="text"
                    value={value}
                    placeholder={t('name.placeholder')}
                    autoFocus
                    onChange={(e) => {
                        const v = e.target.value;
                        // Round 20 Part 3: maxLength is a UTF-16-code-unit
                        // attribute and would cap a Devanagari name at a
                        // fraction of 16 visible characters (or strand a
                        // combining mark mid-keystroke); the limit is
                        // enforced in JS by grapheme cluster count instead.
                        if (NAME_PATTERN.test(v)) setValue(clampToGraphemes(v, 16));
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
                        {t('name.skip')}
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
                        {t('name.confirm')}
                    </button>
                </div>
                </>
                )}
            </div>
        </div>
    );
}
