/**
 * Round 13 Part 2 (docs/Ideas.md §10.2): the runtime half of the string
 * table — en.ts is data only, this file is the lookup/interpolation/locale
 * plumbing every React and Pixi call site imports.
 *
 * t(key, params?) — plain strings. tn(key, count, params?) — the ten `pl`
 * rows (en.ts's `{ one, other }` entries); count only SELECTS which form,
 * it is never auto-injected into the output — a caller that wants the
 * number to actually appear passes it in `params` itself (different pl rows
 * use different param names: {n}, {gap}, {r}/{max}, …), so tn() can't guess
 * one name for all of them.
 *
 * Locale: Round 20 (docs/Ideas.md §10.2 pick A, second half) adds 'hi' —
 * ta.ts still waits for a native reader per Ideas.md's own sequencing.
 * setLocale/getLocale and the save-backed persistence already existed from
 * Round 13, unchanged; this round only widens the Locale union and TABLES.
 */
import { en, type TranslationEntry } from './en.ts';
import { hi } from './hi.ts';
import { getSave, setSaveLocale } from '../state/save.ts';
import { store } from '../state/store.ts';

export type Locale = 'en' | 'hi';

const TABLES: Record<Locale, Record<string, TranslationEntry>> = { en, hi };
const KNOWN_LOCALES: readonly Locale[] = ['en', 'hi'];

function coerceLocale(raw: string): Locale {
    return (KNOWN_LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : 'en';
}

let currentLocale: Locale = 'en';

export function getLocale(): Locale {
    return currentLocale;
}

/** Switches the live locale AND persists it (state/save.ts's setSaveLocale)
 *  — every later t()/tn() call reflects it immediately, no reload needed.
 *  Round 20: also patches store.locale (a reactive mirror, see that field's
 *  own doc in state/store.ts) so React actually RE-RENDERS off the switch —
 *  every t()/tn() call already picks up the new table on its next
 *  invocation regardless, but nothing invoked React again without this. */
export function setLocale(locale: Locale): void {
    currentLocale = coerceLocale(locale);
    setSaveLocale(currentLocale);
    store.patch({ locale: currentLocale });
}

/** Call once at boot, after loadSave() resolves (main.tsx step 2) — restores
 *  whatever locale the save recorded without a redundant flushSave() write
 *  (setLocale() would re-persist a value that's already there). Still
 *  patches store.locale directly (same mirror setLocale keeps in sync) so
 *  the very first render already agrees with t()/tn(). */
export function initLocaleFromSave(): void {
    currentLocale = coerceLocale(getSave().locale);
    store.patch({ locale: currentLocale });
}

function interpolate(template: string, params?: Record<string, unknown>): string {
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (match, key: string) => {
        const v = params[key];
        return v === undefined ? match : String(v);
    });
}

function lookup(key: string): TranslationEntry {
    const entry = TABLES[currentLocale]?.[key] ?? en[key];
    if (entry === undefined) {
        console.warn(`[i18n] missing key "${key}"`);
        return key;
    }
    return entry;
}

/** Plain (non-plural) lookup + interpolation. */
export function t(key: string, params?: Record<string, unknown>): string {
    const entry = lookup(key);
    if (typeof entry !== 'string') {
        console.warn(`[i18n] "${key}" is a plural entry — use tn(), not t()`);
        return interpolate(entry.other, params);
    }
    return interpolate(entry, params);
}

/** Plural lookup — picks `one` at count === 1, `other` otherwise, then
 *  interpolates `params` same as t(). */
export function tn(key: string, count: number, params?: Record<string, unknown>): string {
    const entry = lookup(key);
    const str = typeof entry === 'string' ? entry : (count === 1 ? entry.one : entry.other);
    return interpolate(str, params);
}

/**
 * Round 17 Part 3 (docs/Ideas.md §6d): whether a key actually has a table
 * entry, WITHOUT the console.warn / key-echo fallback t() does for a missing
 * one. ui/RecipeSheet.tsx uses this to decide whether to render a Prep/
 * Garnish section at all — recipe.<slug>.prep/.finish are allowed to be
 * absent until a later writing pass lands (the handover's own words: "omit
 * a missing section entirely — never show an empty heading or a
 * placeholder"), so silently rendering t()'s echoed key as body text would
 * be exactly the placeholder the spec forbids.
 */
export function hasTranslation(key: string): boolean {
    return TABLES[currentLocale]?.[key] !== undefined || en[key] !== undefined;
}
