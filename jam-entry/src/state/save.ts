/**
 * Persistence: the per-player save, written to RUN's appStorage when the
 * host is present and mirrored to localStorage always (so plain-browser dev
 * keeps progress too, and reads never wait on the host).
 *
 * Posture: loads happen once at boot (main.tsx step 2) into memory; writes
 * are write-through and fire-and-forget. Nothing here ever throws.
 */
import RundotGameAPI from '@series-inc/rundot-game-sdk/api';
import { CONFIG } from '../game/config.ts';
import { TOWERS } from '../game/data/towers.ts';
import { sdkReady } from '../sdk/runSdk.ts';
import type { AdsState } from '../systems/ads.ts';

// Bump the suffix if the shape ever changes incompatibly (new optional
// fields with defaults do NOT need a bump; parse() fills them in).
// ADAPT: your game's save key — two games scaffolded from this template
// must not share one, or their localStorage saves collide in dev.
const SAVE_KEY = 'spice-expert-ramu:save:v1';

export type MetaStat = 'damage' | 'speed' | 'range' | 'unique';

export interface MetaStatLevels {
    damage: number;
    speed: number;
    range: number;
    /** The tower's signature track (towers.ts metaUnique). */
    unique: number;
}

/** Persistent upgrade levels, keyed by tower id. */
export type MetaLevels = Record<string, MetaStatLevels>;

/** Challenge-mode scripted FTUE (GDD §10.11): runs once, gated on `challengeDone`. */
export interface FtueState {
    challengeDone: boolean;
    /** The tower id placed at the FTUE's pre-start beat (pad 0). Round B
     *  turns this into a Warrior achievement; this round only records it. */
    firstTowerId: string | null;
}

/** Belt-mode persistence (round 28 fills these in; this round only shapes
 *  and defaults them so the save migration happens once, not twice). */
export interface KitchenSaveState {
    bestLevel: number;
    propsOwned: string[];
    shiftsCompleted: number;
    hats: number;
    clears: Record<string, number>;
}

export interface SaveData {
    /** Shape version. 2 from this change on; absent (old saves) means 1.
     *  SAVE_KEY itself never bumps — see the module comment above. */
    v: number;
    /** Highest wave fully cleared across all runs. */
    bestWave: number;
    /** Meta currency, earned at the end of every run. */
    gems: number;
    /** Persistent per-tower upgrade levels. */
    meta: MetaLevels;
    /** Audio volumes, 0..1 per bus. */
    audio: { music: number; sfx: number };
    /** Rewarded-ads daily cap slice (systems/ads.ts mutates it in place). */
    ads: AdsState;
    /** Challenge-mode FTUE progress. */
    ftue: FtueState;
    /** Belt-mode progress. */
    kitchen: KitchenSaveState;
    /** Round 3 (docs/Ideas.md §6d): Skip on any dialogue box mutes every
     *  later one for the rest of the run AND every run after — persisted so
     *  a Retry (or a fresh tab on the same device) doesn't quietly re-arm
     *  dialogue a player explicitly turned off. */
    dialogueMuted: boolean;
    /** Round 9 Part 4 (docs/Ideas.md §6d item 6): the guest-chosen or
     *  Skip-assigned name, null until the name dialog has resolved once.
     *  Never written for a RUN account (their `username` is used live,
     *  never persisted here) — see setPlayerName below. Shown once; there
     *  is no rename UI this round, so once set this never changes again. */
    playerName: string | null;
    /** Round 10 Part 2 (docs/Ideas.md §6d, "Playtest of 1.80.0" item 4): ids
     *  of one-time-ever FTUE beats (data/dialogue.ts's 'recipe-widget',
     *  'heat-gauge-intro', 'prop-placement') already shown — same
     *  persistence shape as dialogueMuted above, checked by
     *  dialogueController.ts's queueDialogueOnce so none of these three can
     *  ever fire twice for one save, unlike beats 1-12 which reset every
     *  run. */
    seenBeats: string[];
    /** Round 12 Part 3.2 (docs/Ideas.md §6d, "Playtest of 1.83.0" item 5,
     *  pick B): the last-seen rank on each (mode, period) leaderboard,
     *  keyed `"<mode>:<period>"`, so Leaderboard.tsx can show a rank-delta
     *  arrow on re-open. Additive, migration-safe like seenBeats — an old
     *  save with no such field just starts with none recorded (every board
     *  reads as "first visit", not an error). */
    rankMemory: RankMemory;
    /** Round 13 Part 2 (docs/Ideas.md §10.2): the player's chosen language
     *  code ('en' | 'hi' | 'ta', though only 'en' has a real table this
     *  round — i18n/index.ts's own Locale type is the narrower source of
     *  truth for what's actually selectable today). Additive, migration-safe
     *  like seenBeats/rankMemory above: an old save with no such field just
     *  starts at 'en'. i18n/index.ts owns reading/writing this via
     *  setSaveLocale/getSave().locale — never patched directly by UI code. */
    locale: string;
}

/** One remembered rank plus the UTC day it was recorded on. `utcDay` is only
 *  read back for the daily period — see diffAndRecordRank below for why. */
export interface RankMemoryEntry {
    rank: number;
    utcDay: string;
}

export type RankMemory = Record<string, RankMemoryEntry>;

function emptyMeta(): MetaLevels {
    const meta: MetaLevels = {};
    for (const t of TOWERS) meta[t.id] = { damage: 0, speed: 0, range: 0, unique: 0 };
    return meta;
}

const DEFAULTS: SaveData = {
    v: 2,
    bestWave: 0,
    gems: 0,
    meta: emptyMeta(),
    // Round 7 item 5 (docs/Ideas.md §6d): default BGM 60% -> 50%. This is
    // the one that actually matters for "fresh installs boot at 50%" — a
    // save with no stored `audio.music` value falls back to this via
    // parse()'s `vol(rawAudio.music, DEFAULTS.audio.music)` below. A stored
    // value (any prior save, any volume) is read as-is and never touched.
    audio: { music: 0.5, sfx: 0.8 },
    ads: { watchedToday: 0, lastResetDay: null },
    ftue: { challengeDone: false, firstTowerId: null },
    kitchen: { bestLevel: 0, propsOwned: [], shiftsCompleted: 0, hats: 0, clears: {} },
    dialogueMuted: false,
    playerName: null,
    seenBeats: [],
    rankMemory: {},
    locale: 'en',
};

let data: SaveData = structuredClone(DEFAULTS);

/** Validate a raw stored blob. Unknown/corrupt input falls back to defaults.
 *  Round 2b (docs/Ideas.md §6d amendment) dropped `dialogueSeen` — an old
 *  save that still has it loads fine (this parse only ever copies the
 *  fields it explicitly maps below, so an extra JSON key is silently
 *  ignored, never rejected) and the field is simply never written again. */
function parse(raw: string | null): SaveData | null {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as Partial<SaveData>;
        const num = (v: unknown, min: number, max: number) => {
            const n = Math.floor(Number(v));
            return Number.isFinite(n) && n >= min ? Math.min(n, max) : 0;
        };
        const meta = emptyMeta();
        const rawMeta = (parsed.meta ?? {}) as Partial<MetaLevels>;
        for (const t of TOWERS) {
            const m = rawMeta[t.id];
            if (!m) continue;
            meta[t.id] = {
                damage: num(m.damage, 0, CONFIG.meta.maxLevel),
                speed: num(m.speed, 0, CONFIG.meta.maxLevel),
                range: num(m.range, 0, CONFIG.meta.maxLevel),
                unique: num(m.unique, 0, t.metaUnique.maxLevel),
            };
        }
        const vol = (v: unknown, fallback: number) => {
            const f = Number(v);
            return Number.isFinite(f) ? Math.min(1, Math.max(0, f)) : fallback;
        };
        const rawAudio = (parsed.audio ?? {}) as Partial<SaveData['audio']>;
        const rawFtue = (parsed.ftue ?? {}) as Partial<FtueState>;
        const ftue: FtueState = {
            challengeDone: rawFtue.challengeDone === true,
            firstTowerId: typeof rawFtue.firstTowerId === 'string' ? rawFtue.firstTowerId : null,
        };
        const rawKitchen = (parsed.kitchen ?? {}) as Partial<KitchenSaveState>;
        const rawClears = (rawKitchen.clears ?? {}) as Record<string, unknown>;
        const clears: Record<string, number> = {};
        for (const [k, v] of Object.entries(rawClears)) clears[k] = num(v, 0, Number.MAX_SAFE_INTEGER);
        const kitchen: KitchenSaveState = {
            bestLevel: num(rawKitchen.bestLevel, 0, Number.MAX_SAFE_INTEGER),
            propsOwned: Array.isArray(rawKitchen.propsOwned)
                ? rawKitchen.propsOwned.filter((s): s is string => typeof s === 'string')
                : [],
            shiftsCompleted: num(rawKitchen.shiftsCompleted, 0, Number.MAX_SAFE_INTEGER),
            hats: num(rawKitchen.hats, 0, Number.MAX_SAFE_INTEGER),
            clears,
        };
        return {
            v: 2, // this parse always produces the current (v2) shape
            bestWave: num(parsed.bestWave, 0, Number.MAX_SAFE_INTEGER),
            gems: num(parsed.gems, 0, Number.MAX_SAFE_INTEGER),
            meta,
            audio: {
                music: vol(rawAudio.music, DEFAULTS.audio.music),
                sfx: vol(rawAudio.sfx, DEFAULTS.audio.sfx),
            },
            ads: {
                watchedToday: num((parsed.ads as Partial<AdsState> | undefined)?.watchedToday, 0, 10000),
                lastResetDay:
                    typeof parsed.ads?.lastResetDay === 'string' ? parsed.ads.lastResetDay : null,
            },
            ftue,
            kitchen,
            dialogueMuted: parsed.dialogueMuted === true,
            playerName: typeof parsed.playerName === 'string' && parsed.playerName.trim().length > 0
                ? parsed.playerName.trim().slice(0, 16)
                : null,
            seenBeats: Array.isArray(parsed.seenBeats)
                ? parsed.seenBeats.filter((s): s is string => typeof s === 'string')
                : [],
            rankMemory: (() => {
                const raw = (parsed.rankMemory ?? {}) as Record<string, unknown>;
                const out: RankMemory = {};
                for (const [k, v] of Object.entries(raw)) {
                    const entry = v as Partial<RankMemoryEntry> | null | undefined;
                    if (entry && Number.isFinite(entry.rank) && typeof entry.utcDay === 'string') {
                        out[k] = { rank: Math.floor(entry.rank as number), utcDay: entry.utcDay };
                    }
                }
                return out;
            })(),
            locale: typeof parsed.locale === 'string' && parsed.locale.length > 0 ? parsed.locale : 'en',
        };
    } catch {
        return null;
    }
}

/** Load the save into memory. Call once at boot, after initSdk(). */
export async function loadSave(): Promise<SaveData> {
    let loaded: SaveData | null = null;
    if (sdkReady()) {
        try {
            loaded = parse(await RundotGameAPI.appStorage.getItem(SAVE_KEY));
        } catch {
            /* host storage unavailable — fall through to localStorage */
        }
    }
    if (!loaded) {
        try { loaded = parse(localStorage.getItem(SAVE_KEY)); } catch { /* blocked storage */ }
    }
    data = loaded ?? structuredClone(DEFAULTS);
    return data;
}

export function getSave(): SaveData {
    return data;
}

/** Write-through persist of the in-memory save. Fire-and-forget, never throws. */
export function flushSave(): void {
    const raw = JSON.stringify(data);
    try { localStorage.setItem(SAVE_KEY, raw); } catch { /* blocked storage */ }
    if (sdkReady()) {
        try {
            RundotGameAPI.appStorage.setItem(SAVE_KEY, raw).catch(() => { /* offline */ });
        } catch { /* non-fatal */ }
    }
}

/**
 * A run ended: record the best wave and pay out gems. Clearing wave N pays
 * N * gemsPerWave — linear, so the meta tree lasts across many runs instead
 * of being exhausted in two or three. Returns the gems earned for the end
 * screen.
 */
export function recordRunEnd(wavesCleared: number): { gemsEarned: number; save: SaveData } {
    const n = Math.max(0, Math.floor(wavesCleared));
    const gemsEarned = n * CONFIG.meta.gemsPerWave;
    data = {
        ...data,
        bestWave: Math.max(data.bestWave, n),
        gems: data.gems + gemsEarned,
    };
    flushSave();
    return { gemsEarned, save: data };
}

/** Grant bonus gems (rewarded-ad placement). Returns the new save. */
export function addGems(amount: number): SaveData {
    data = { ...data, gems: data.gems + Math.max(0, Math.floor(amount)) };
    flushSave();
    return data;
}

/** Record the tower placed at the FTUE's pre-start beat. Idempotent — only
 *  the first call (per save) sticks, so a later FTUE re-run never overwrites it. */
export function setFtueFirstTower(towerId: string): void {
    if (data.ftue.firstTowerId !== null) return;
    data = { ...data, ftue: { ...data.ftue, firstTowerId: towerId } };
    flushSave();
}

/** Mark the Challenge-mode FTUE complete — it never scripts a run again. */
export function completeFtue(): void {
    if (data.ftue.challengeDone) return;
    data = { ...data, ftue: { ...data.ftue, challengeDone: true } };
    flushSave();
}

/** Round 3 (docs/Ideas.md §6d): Skip on any dialogue box mutes every later
 *  one, persisted so it survives Retry/reload — same idempotent-write
 *  posture as completeFtue above. dialogueController.ts is the only caller
 *  (mute on Skip, un-mute on tapping the chef). */
export function setDialogueMuted(muted: boolean): void {
    if (data.dialogueMuted === muted) return;
    data = { ...data, dialogueMuted: muted };
    flushSave();
}

/** Round 10 Part 2: has this once-ever FTUE beat already been shown (any
 *  prior run, this save)? dialogueController.ts's queueDialogueOnce reads
 *  this before deciding whether to queue at all. */
export function hasSeenBeatOnce(id: string): boolean {
    return data.seenBeats.includes(id);
}

/** Marks a once-ever FTUE beat as shown — idempotent, same posture as
 *  setFtueFirstTower/completeFtue above. */
export function markBeatSeenOnce(id: string): void {
    if (data.seenBeats.includes(id)) return;
    data = { ...data, seenBeats: [...data.seenBeats, id] };
    flushSave();
}

/** Round 9 Part 4: records the guest's chosen or Skip-assigned name.
 *  Idempotent — the name is "shown once" for the initial dialog, so a
 *  second call from that flow can never overwrite it. Round 10 Part 6 adds
 *  a real rename flow (renamePlayer, below) for changing an already-set
 *  name — a SEPARATE function, not a flag on this one, so this function's
 *  own "first answer wins" contract for the initial dialog can't be
 *  weakened by a future caller passing some "allow overwrite" bit by
 *  mistake. */
export function setPlayerName(name: string): void {
    if (data.playerName !== null) return;
    const trimmed = name.trim().slice(0, 16);
    if (trimmed.length === 0) return;
    data = { ...data, playerName: trimmed };
    flushSave();
}

/** Round 10 Part 6: the rename flow (RenameDialog.tsx) — unlike
 *  setPlayerName above, this ALWAYS overwrites (that's the point of a
 *  rename). Guests only; RenameDialog.tsx never calls this for a RUN
 *  account (their username is never persisted here). Returns false for an
 *  empty/whitespace-only name so the caller can treat that as Cancel rather
 *  than silently clearing a real name. */
export function renamePlayer(name: string): boolean {
    const trimmed = name.trim().slice(0, 16);
    if (trimmed.length === 0) return false;
    data = { ...data, playerName: trimmed };
    flushSave();
    return true;
}

/** Round 13 Part 2: persists the player's chosen locale — idempotent write,
 *  same posture as setDialogueMuted above. i18n/index.ts's setLocale() is
 *  the only caller; this file never imports i18n (that would be a cycle),
 *  it just owns the storage half. */
export function setSaveLocale(locale: string): void {
    if (data.locale === locale) return;
    data = { ...data, locale };
    flushSave();
}

function utcDayKey(): string {
    const d = new Date();
    return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}

/**
 * Round 12 Part 3.2: compares `currentRank` on one (mode,period) board
 * against the rank recorded the last time this board was open, then
 * overwrites it with the current one — read-old/write-new in a single call,
 * so a caller can't accidentally read back its own fresh write as history.
 * Returns the signed delta (positive = improved/lower rank number, negative
 * = worse), or null when there's nothing meaningful to compare: a genuine
 * first-ever visit to this board, an unchanged rank (folded into null too —
 * the handover's own "same ... nothing" case), or — daily period only — a
 * stored rank left over from a PRIOR UTC day. That last case matters
 * because the daily board itself resets at UTC midnight: a rank from
 * yesterday's now-defunct board isn't a real "you moved" signal, it's an
 * apples-to-oranges comparison against a board that no longer exists.
 */
export function diffAndRecordRank(key: string, currentRank: number, isDaily: boolean): number | null {
    const today = utcDayKey();
    const prev = data.rankMemory[key];
    const staleDaily = isDaily && !!prev && prev.utcDay !== today;
    const comparable = prev && !staleDaily ? prev.rank : null;
    data = { ...data, rankMemory: { ...data.rankMemory, [key]: { rank: currentRank, utcDay: today } } };
    flushSave();
    if (comparable === null) return null;
    const delta = comparable - currentRank;
    return delta === 0 ? null : delta;
}

/** Cost in gems of buying INTO the next level, given the current level. */
export function metaUpgradeCost(currentLevel: number): number {
    return CONFIG.meta.costBase + CONFIG.meta.costStep * currentLevel;
}

let audioFlushTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Persist slider-driven volume changes, debounced 400ms so dragging a
 * slider does not hammer storage. Values apply to the buses immediately at
 * the call site; this only records them.
 */
export function setAudioVolumes(music: number, sfxVol: number): void {
    data = { ...data, audio: { music, sfx: sfxVol } };
    if (audioFlushTimer) clearTimeout(audioFlushTimer);
    audioFlushTimer = setTimeout(() => {
        audioFlushTimer = null;
        flushSave();
    }, 400);
}

/**
 * Buy one meta upgrade level for a tower's stat. Returns the new save, or
 * null if maxed or unaffordable (callers disable the button, but never
 * trust the UI).
 */
export function buyMetaUpgrade(towerId: string, stat: MetaStat): SaveData | null {
    const levels = data.meta[towerId];
    if (!levels) return null;
    const level = levels[stat];
    const cap = stat === 'unique'
        ? TOWERS.find((t) => t.id === towerId)?.metaUnique.maxLevel ?? 0
        : CONFIG.meta.maxLevel;
    if (level >= cap) return null;
    const cost = metaUpgradeCost(level);
    if (data.gems < cost) return null;
    data = {
        ...data,
        gems: data.gems - cost,
        meta: {
            ...data.meta,
            [towerId]: { ...levels, [stat]: level + 1 },
        },
    };
    flushSave();
    return data;
}
