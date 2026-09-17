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
}

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

/** Round 9 Part 4: records the guest's chosen or Skip-assigned name.
 *  Idempotent — same posture as setFtueFirstTower above — the name is
 *  "shown once", so a later call (there shouldn't be one this round, no
 *  rename UI) can never overwrite it. */
export function setPlayerName(name: string): void {
    if (data.playerName !== null) return;
    const trimmed = name.trim().slice(0, 16);
    if (trimmed.length === 0) return;
    data = { ...data, playerName: trimmed };
    flushSave();
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
