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
 * Locale: only 'en' has a real table this round (hi.ts/ta.ts land in a
 * later round per Ideas.md §10.2's own sequencing) — setLocale/getLocale
 * and the save-backed persistence exist now so that later table doesn't
 * need any plumbing changes, only a new entry in TABLES.
 */
import { en, type TranslationEntry } from './en.ts';
import { getSave, setSaveLocale } from '../state/save.ts';

export type Locale = 'en';

const TABLES: Record<Locale, Record<string, TranslationEntry>> = { en };
const KNOWN_LOCALES: readonly Locale[] = ['en'];

function coerceLocale(raw: string): Locale {
    return (KNOWN_LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : 'en';
}

let currentLocale: Locale = 'en';

export function getLocale(): Locale {
    return currentLocale;
}

/** Switches the live locale AND persists it (state/save.ts's setSaveLocale)
 *  — every later t()/tn() call reflects it immediately, no reload needed. */
export function setLocale(locale: Locale): void {
    currentLocale = coerceLocale(locale);
    setSaveLocale(currentLocale);
}

/** Call once at boot, after loadSave() resolves (main.tsx step 2) — restores
 *  whatever locale the save recorded without a redundant flushSave() write
 *  (setLocale() would re-persist a value that's already there). */
export function initLocaleFromSave(): void {
    currentLocale = coerceLocale(getSave().locale);
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
