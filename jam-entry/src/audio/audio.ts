/**
 * Procedural audio: synthesized SFX and a sequenced woodland chiptune loop
 * via WebAudio — no audio files, matching the game's zero-asset approach.
 * Two buses (music, sfx) with independent volumes persisted in the save.
 *
 * Autoplay policy: the AudioContext is created/resumed on the first user
 * gesture (initAudio attaches one-time listeners); everything before that
 * is silently dropped.
 *
 * ADAPT — swapping in real audio files: keep the two buses and the volume
 * API, and only replace the sound-producing layer.
 *   - SFX: fetch + decodeAudioData small files (public/audio/) at boot,
 *     then have each named sfx.* function play its AudioBufferSourceNode
 *     into sfxBus — call sites never change.
 *   - Music: replace the sequencer in startMusic() with a looping buffer
 *     source (loop = true) into musicBus. Music files are big — serve them
 *     from public/cdn-assets/ via RundotGameAPI.cdn.fetchAsset().
 *   - Or just retune the synth: the music is data (TEMPO, BASS_ROOTS,
 *     MELODY note arrays) and each sfx.* is a couple of tone()/noise()
 *     calls.
 */
import { fetchCdnAsset } from '../sdk/cdn.ts';
import { track } from '../sdk/analytics.ts';
import { store } from '../state/store.ts';

let ctx: AudioContext | null = null;
let musicBus: GainNode | null = null;
let sfxBus: GainNode | null = null;
/** Arrow round, task 2: sits between every music source and musicBus —
 * seqGain/trackA/trackB all route through this, never straight to musicBus
 * — so ducking under the block-transition sting scales whatever's already
 * playing without ever touching musicBus itself. musicBus stays the
 * volume-slider's own master (setMusicVolume() writes it directly): moving
 * the slider mid-duck still multiplies against the CURRENT duck level
 * (GainNodes chain multiplicatively), so it never fights the duck or gets
 * clobbered by its restore, and the level is simply correct once the duck
 * finishes, no special-casing needed. See duckMusicForSting()/
 * resetMusicDuck() below. */
let duckGain: GainNode | null = null;
/** Children of duckGain: seqGain carries the procedural sequencer (the
 * permanent fallback), trackA/trackB carry CDN cues — two nodes, not one,
 * so switchCue() can crossfade between two music cues without cutting the
 * outgoing one first. */
let seqGain: GainNode | null = null;
let trackA: GainNode | null = null;
let trackB: GainNode | null = null;

let musicVolume = 0.6;
let sfxVolume = 0.8;

/** Base gains keep synthesized peaks comfortably below clipping. */
const MUSIC_BASE = 0.5;
const SFX_BASE = 0.6;

/** Arrow round, task 2: duckGain's two ramp targets — both named constants,
 *  each retunable in one line. DUCK_LOW ~0.25 dips the music without fully
 *  silencing it (a floor under the sting, not a cut); DUCK_HIGH 1.0 is
 *  "unducked", not the music's own volume (that's musicBus/musicVolume's
 *  job — duckGain only ever multiplies against whatever that already is). */
const DUCK_LOW = 0.25;
const DUCK_HIGH = 1.0;
/** Short ramps read as a dip, not a fade — ~200-300ms per the handover. */
const DUCK_RAMP_S = 0.25;
/** Sized to the STING's own length (audio/bombay-transition.mp3, 4.6s),
 *  not the 2.5s visual crossfade (BACKDROP_FADE_S, towerScene.ts) — a
 *  different duration for a different reason (audibility of the sting vs.
 *  how long the backdrop takes to swap), so this is its own constant, not
 *  derived from or coupled to that one. */
const DUCK_HOLD_S = 4.6;

function ensureCtx(): AudioContext | null {
    if (ctx) return ctx;
    try {
        ctx = new AudioContext();
        musicBus = ctx.createGain();
        musicBus.gain.value = musicVolume * MUSIC_BASE;
        musicBus.connect(ctx.destination);
        duckGain = ctx.createGain();
        duckGain.gain.value = DUCK_HIGH;
        duckGain.connect(musicBus);
        seqGain = ctx.createGain();
        seqGain.gain.value = 1.0;
        seqGain.connect(duckGain);
        trackA = ctx.createGain();
        trackA.gain.value = 0.0;
        trackA.connect(duckGain);
        trackB = ctx.createGain();
        trackB.gain.value = 0.0;
        trackB.connect(duckGain);
        sfxBus = ctx.createGain();
        sfxBus.gain.value = sfxVolume * SFX_BASE;
        sfxBus.connect(ctx.destination);
    } catch {
        return null; // no WebAudio — the game plays silently
    }
    return ctx;
}

/** Delivered-audio round, task 2: whether the AudioContext already exists
 *  (the player's first gesture already unlocked it). registerEngine()
 *  (actions.ts) reads this before calling switchCue('service_low') — on a
 *  cold boot into 'playing' (no menu tap first), that call used to fire
 *  with ctx still null, which set activeCue to 'service_low' without ever
 *  actually starting it (fetchCueBuffer bails with no ctx to decode into).
 *  The LATER, correct call from initAudio's unlock handler then no-op'd
 *  via switchCue's own `activeCue === id` guard, so the real track never
 *  played — the FTUE ran on the sequencer fallback all the way through.
 *  Deferring the initial cue entirely to the unlock handler (which reads
 *  the live phase at gesture time) avoids the premature call; once audio
 *  IS unlocked, registerEngine() switches immediately as before. */
export function isAudioUnlocked(): boolean {
    return ctx !== null;
}

/**
 * Call once at boot with the saved volumes. Attaches one-time gesture
 * listeners that unlock audio and start the music loop.
 */
export function initAudio(volumes: { music: number; sfx: number }): void {
    musicVolume = volumes.music;
    sfxVolume = volumes.sfx;
    const unlock = () => {
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        const c = ensureCtx();
        if (!c) return;
        if (c.state === 'suspended') c.resume().catch(() => {});
        startMusic();
        loadSamples();
        // Final round, task 3: this used to hard-code 'menu' — harmless
        // when the menu was always the first screen (the tap that unlocks
        // audio and the click that starts a run were two separate events).
        // Now that boot can land straight in 'playing' (main.tsx), the
        // player's first tap is often ALSO the first tap inside a run
        // already scored to 'service_low' by registerEngine() (actions.ts)
        // — a hard-coded switchCue('menu') here would override it out from
        // under the game with menu music. Ask the store what's actually on
        // screen instead. 'testbelt' (Kitchen Mode) starts its own
        // 'service_low' the same way (kitchenScene.ts) — same fix applies.
        const phase = store.get().phase;
        switchCue(phase === 'playing' || phase === 'testbelt' ? 'service_low' : 'menu');
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
}

// ---------------------------------------------------------------------------
// Sampled SFX — the synth stays the permanent fallback (see sfx.lose /
// sfx.upgrade / sfx.waveClear below). If loadSamples() never resolves, a
// decode fails, or a buffer just isn't ready yet, playSample() returns
// false and the caller falls through to the tone()/noise() synth exactly
// as before.
// ---------------------------------------------------------------------------

type SampleId = 'lose' | 'upgrade' | 'wave-clear' | 'kettle-boil' | 'water-pour' | 'block-transition' | 'scroll-unlock' | 'continue';

/** Playback gain per sample — peak-matched to the synth cues they replace
 * (MP3s normalise to -3dBFS ~= 0.708 peak; the synth peaks at 0.30-0.35),
 * biased slightly down for a recording's higher RMS at the same peak. Last
 * few dB are a human call — retune here, one line each. */
const SAMPLES: Record<SampleId, { url: string; gain: number }> = {
    lose: { url: 'audio/ah.mp3', gain: 0.5 },
    upgrade: { url: 'audio/level-up.mp3', gain: 0.35 },
    // Round 11 (TEST MODE): a Kettle/Water Dispenser grab, kitchenScene.ts's
    // attemptUseOrSell. Measured peaks -6.78dBFS (kettle) / -5.53dBFS
    // (water), already quieter than the -3dBFS the rest of this table
    // normalises to — 0.65 is a human retune by ear, not derived from that
    // measurement, same as every other gain here.
    'kettle-boil': { url: 'audio/kettle-boil.mp3', gain: 0.65 },
    'water-pour': { url: 'audio/water-pour.mp3', gain: 0.65 },
    // Delivered-audio round: a real bell replaces the old synth-derived
    // level-complete.mp3; 1.0 is the delivered gain (no clip — worst
    // post-gain music peak measured at -1.39dBFS, SFX_BASE 0.6 covers it).
    'wave-clear': { url: 'audio/wave-clear-bell.mp3', gain: 1.0 },
    // Final round, task 4/5: plays once per real block-to-block backdrop
    // transition (towerScene.ts's tick — situation 2 only, see its own
    // comment). Filename corrected in the delivered-audio round — the
    // final round's own guess (block-transition.mp3) never existed; the id
    // stays 'block-transition' (ids and filenames already differ
    // elsewhere, e.g. lose -> ah.mp3), only the url was wrong.
    'block-transition': { url: 'audio/bombay-transition.mp3', gain: 0.75 }, // 1.5x: user could not hear it under the ducked BGM at 0.5. Output peaks -10.08 dBFS, ample headroom.
    // Round 14 Part 4 (docs/Ideas.md §10.4): plays once per wave clear that
    // completes a recipe scroll — the master, unedited (its own .mp3.json
    // sidecar stays behind, same posture as every other SAMPLES entry here).
    'scroll-unlock': { url: 'audio/sfx-scroll-unlock.mp3', gain: 1.0 },
    // Round 15 Part 4 (docs/Ideas.md §10.3): plays once per granted continue
    // (actions.ts's applyContinueGrant), never on the offer itself — the
    // master, unedited, its own .mp3.json sidecar stays behind.
    continue: { url: 'audio/sfx-continue.mp3', gain: 1.0 },
};

/** The CDN-streamed music cues (see switchCue near the sequencer, below).
 * loopStart/loopEndTrim exist because MP3 carries encoder padding at both
 * ends (~1152 samples @ 44.1k), which makes loop = true click audibly — same
 * encoder, same padding, for all three masters, so one trim serves all of
 * them. gain is RMS-matched per cue to service_low (Specs §8a.7b) and is a
 * one-line retune; so is fadeSeconds. */
type CueId = 'menu' | 'service_low' | 'service_high';

const CUES: Record<CueId, { path: string; gain: number }> = {
    // Delivered-audio round: the new 60s Pixabay loops, RMS-matched to
    // service_low — filenames unchanged, gains retuned for the new masters.
    menu: { path: 'bgm-menu.mp3', gain: 1.125 },
    service_low: { path: 'bgm-service-low.mp3', gain: 1.0 },
    service_high: { path: 'bgm-service-high.mp3', gain: 1.162 },
};

const MUSIC = {
    loopStart: 0.026,
    loopEndTrim: 0.026,
    fadeSeconds: 1.2,
} as const;

const sampleBuffers = new Map<SampleId, AudioBuffer>();
const sampleVoices = new Map<SampleId, AudioBufferSourceNode>();

/**
 * Fire-and-forget decode of every SAMPLES entry. Called once, right after
 * the AudioContext unlocks. Never awaited by boot — a slow or failed fetch
 * just means playSample() keeps returning false a little longer (or
 * forever), and the synth keeps covering for it.
 */
function loadSamples(): void {
    const c = ctx;
    if (!c) return;
    for (const [id, { url }] of Object.entries(SAMPLES) as [SampleId, { url: string; gain: number }][]) {
        fetch(url)
            .then((res) => res.arrayBuffer())
            .then((data) => c.decodeAudioData(data))
            .then((buffer) => { sampleBuffers.set(id, buffer); })
            .catch(() => { /* decode/fetch failed — synth fallback covers it */ });
    }
}

/** Returns false (and plays nothing) if the sample isn't ready — the
 * caller is expected to fall through to its synth in that case.
 * Round 11 (TEST MODE): exported so kitchenScene.ts's attemptUseOrSell can
 * play 'kettle-boil'/'water-pour' directly — those two have no sfx.*
 * wrapper of their own, unlike lose/upgrade/wave-clear above. */
export function playSample(id: SampleId): boolean {
    const c = ctx;
    const buffer = sampleBuffers.get(id);
    if (!c || !sfxBus || !buffer) return false;

    sampleVoices.get(id)?.stop(); // single voice per sample — no overlapping mush

    const src = c.createBufferSource();
    src.buffer = buffer;
    const gainNode = c.createGain();
    gainNode.gain.value = SAMPLES[id].gain;
    src.connect(gainNode);
    gainNode.connect(sfxBus); // Settings volume slider keeps working unchanged
    src.addEventListener('ended', () => {
        if (sampleVoices.get(id) === src) sampleVoices.delete(id);
    });
    sampleVoices.set(id, src);
    src.start();
    return true;
}

export function setMusicVolume(v: number): void {
    musicVolume = v;
    if (musicBus) musicBus.gain.value = v * MUSIC_BASE;
}

export function setSfxVolume(v: number): void {
    sfxVolume = v;
    if (sfxBus) sfxBus.gain.value = v * SFX_BASE;
}

/**
 * Arrow round, task 2: dip the music under the block-transition sting, then
 * bring it back — towerScene.ts calls this at the exact same point it
 * calls playSample('block-transition'). Pure AudioParam automation (no
 * setTimeout for the ramp itself): setValueAtTime anchors the CURRENT gain
 * before ramping, so a re-trigger mid-ramp starts cleanly from wherever the
 * gain actually is instead of jumping; the flat setValueAtTime partway
 * through is what makes the middle a HOLD, not a straight ramp-down-then-
 * immediately-ramp-up triangle.
 */
export function duckMusicForSting(): void {
    const c = ctx;
    if (!c || !duckGain) return;
    const t0 = c.currentTime;
    duckGain.gain.cancelScheduledValues(t0);
    duckGain.gain.setValueAtTime(duckGain.gain.value, t0);
    duckGain.gain.linearRampToValueAtTime(DUCK_LOW, t0 + DUCK_RAMP_S);
    duckGain.gain.setValueAtTime(DUCK_LOW, t0 + DUCK_HOLD_S - DUCK_RAMP_S);
    duckGain.gain.linearRampToValueAtTime(DUCK_HIGH, t0 + DUCK_HOLD_S);
}

/** 🔴 The one guarantee that matters here: the duck can never latch.
 *  Cancels any in-flight ramp/hold and snaps back to DUCK_HIGH immediately
 *  — towerScene.ts calls this on scene destroy (quit or retry mid-duck)
 *  and defensively at every run's own start, the same two-call posture
 *  store.backdropTransitioning already uses for the same reason. */
export function resetMusicDuck(): void {
    const c = ctx;
    if (!c || !duckGain) return;
    duckGain.gain.cancelScheduledValues(c.currentTime);
    duckGain.gain.setValueAtTime(DUCK_HIGH, c.currentTime);
}

/** Host lifecycle: freeze all audio with the game. */
export function suspendAudio(): void {
    ctx?.suspend().catch(() => {});
}

export function resumeAudio(): void {
    ctx?.resume().catch(() => {});
}

// ---------------------------------------------------------------------------
// SFX synthesis helpers
// ---------------------------------------------------------------------------

/** One oscillator with a pitch sweep and an exponential-decay envelope. */
function tone(
    type: OscillatorType,
    freqStart: number,
    freqEnd: number,
    duration: number,
    volume: number,
    delay = 0
): void {
    const c = ctx;
    if (!c || !sfxBus) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const env = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + duration);
    env.gain.setValueAtTime(volume, t0);
    env.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.connect(env);
    env.connect(sfxBus);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
}

/** Short filtered noise burst (thuds, hats, crashes). */
function noise(duration: number, volume: number, filterHz: number, delay = 0): void {
    const c = ctx;
    if (!c || !sfxBus) return;
    const t0 = c.currentTime + delay;
    const length = Math.max(1, Math.floor(c.sampleRate * duration));
    const buffer = c.createBuffer(1, length, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterHz;
    const env = c.createGain();
    env.gain.setValueAtTime(volume, t0);
    env.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    src.connect(filter);
    filter.connect(env);
    env.connect(sfxBus);
    src.start(t0);
}

/** Game SFX. Safe to call anytime; silent before the first user gesture. */
export const sfx = {
    click(): void {
        tone('sine', 900, 700, 0.04, 0.35);
    },
    /** A tower takes its post. */
    place(): void {
        noise(0.07, 0.3, 500);
        tone('square', 380, 220, 0.09, 0.35, 0.02);
    },
    /** In-run or meta upgrade bought. */
    upgrade(): void {
        if (playSample('upgrade')) return;
        tone('square', 660, 660, 0.07, 0.3);
        tone('square', 880, 880, 0.07, 0.3, 0.07);
        tone('square', 1320, 1320, 0.12, 0.3, 0.14);
    },
    /** Tower sold: coins back. */
    sell(): void {
        tone('sine', 1320, 1320, 0.05, 0.4);
        tone('sine', 990, 990, 0.09, 0.4, 0.06);
    },
    /** The wave horn. */
    startWave(): void {
        tone('sawtooth', 220, 330, 0.18, 0.35);
        tone('sawtooth', 330, 440, 0.22, 0.35, 0.16);
    },
    /**
     * Per-tower shots, kept quiet: they fire constantly.
     * ADAPT: add a case per new tower id; unknown ids get the thud.
     */
    shot(towerId: string): void {
        if (towerId === 'fox') tone('square', 900, 1500, 0.05, 0.13);
        else if (towerId === 'owl') tone('sine', 700, 320, 0.11, 0.18);
        else if (towerId === 'squirrel') {
            tone('sawtooth', 2200, 400, 0.07, 0.14); // zap
            noise(0.03, 0.1, 4000);
        } else noise(0.07, 0.22, 320); // bear boulder (and the default thud)
    },
    /** A bug pops. */
    death(): void {
        tone('square', 600, 150, 0.08, 0.3);
        noise(0.04, 0.15, 1200);
    },
    /** A bug escaped: lose a life. */
    leak(): void {
        tone('sawtooth', 220, 80, 0.3, 0.4);
    },
    waveClear(): void {
        if (playSample('wave-clear')) return;
        tone('sine', 880, 880, 0.08, 0.35);
        tone('sine', 1100, 1100, 0.08, 0.35, 0.08);
        tone('sine', 1320, 1320, 0.16, 0.35, 0.16);
    },
    /** A recipe scroll unlocks (docs/Ideas.md §10.4). Synth fallback: a
     *  brighter three-note chime than upgrade()'s, so it doesn't read as the
     *  same event under the permanent-fallback path. */
    scrollUnlock(): void {
        if (playSample('scroll-unlock')) return;
        tone('sine', 990, 990, 0.09, 0.32);
        tone('sine', 1320, 1320, 0.09, 0.32, 0.09);
        tone('sine', 1760, 1760, 0.18, 0.32, 0.18);
    },
    /** A rewarded continue is granted (docs/Ideas.md §10.3), never on the
     *  offer itself. Synth fallback: a rising three-note flourish, brighter
     *  than scrollUnlock()'s so it doesn't read as the same event. */
    continueGranted(): void {
        if (playSample('continue')) return;
        tone('sawtooth', 440, 440, 0.08, 0.3);
        tone('sawtooth', 660, 660, 0.08, 0.3, 0.08);
        tone('sawtooth', 880, 880, 0.2, 0.3, 0.16);
    },
    win(): void {
        tone('square', 660, 660, 0.12, 0.35);
        tone('square', 880, 880, 0.12, 0.35, 0.12);
        tone('square', 1100, 1100, 0.12, 0.35, 0.24);
        tone('square', 1320, 1320, 0.3, 0.35, 0.36);
    },
    lose(): void {
        if (playSample('lose')) return;
        tone('sawtooth', 440, 440, 0.16, 0.35);
        tone('sawtooth', 330, 330, 0.16, 0.35, 0.16);
        tone('sawtooth', 220, 110, 0.45, 0.35, 0.32);
    },
};

// ---------------------------------------------------------------------------
// Music: a gentle woodland loop (Am - F - C - G, two melody passes)
// ---------------------------------------------------------------------------

const TEMPO = 112;
const STEP = 60 / TEMPO / 2; // 8th notes
const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// Chord roots (MIDI): A1, F1, C2, G1 — each held for 8 steps.
const BASS_ROOTS = [33, 29, 36, 31];

// Two 32-step melody passes (MIDI note or 0 = rest), A-minor pentatonic.
const MELODY: number[] = [
    // pass A: wandering through the underbrush
    69, 0, 72, 0, 74, 0, 72, 0, 76, 0, 74, 72, 0, 0, 69, 0,
    67, 0, 69, 0, 72, 0, 69, 0, 74, 72, 69, 0, 67, 0, 0, 0,
    // pass B: up the watchtower
    69, 0, 72, 0, 76, 0, 79, 0, 81, 0, 79, 76, 0, 0, 74, 0,
    76, 0, 74, 0, 72, 0, 69, 0, 72, 74, 72, 69, 67, 0, 0, 0,
];
const LOOP_STEPS = MELODY.length;

let musicTimer: ReturnType<typeof setInterval> | null = null;
let nextStepTime = 0;
let stepIndex = 0;

function scheduleMusicNote(type: OscillatorType, midi: number, t: number, dur: number, vol: number): void {
    const c = ctx;
    if (!c || !seqGain) return;
    const osc = c.createOscillator();
    const env = c.createGain();
    osc.type = type;
    osc.frequency.value = mtof(midi);
    env.gain.setValueAtTime(vol, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(env);
    env.connect(seqGain);
    osc.start(t);
    osc.stop(t + dur + 0.02);
}

function scheduleHat(t: number): void {
    const c = ctx;
    if (!c || !seqGain) return;
    const length = Math.floor(c.sampleRate * 0.03);
    const buffer = c.createBuffer(1, length, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    const env = c.createGain();
    env.gain.setValueAtTime(0.08, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    src.connect(filter);
    filter.connect(env);
    env.connect(seqGain);
    src.start(t);
}

function scheduleStep(step: number, t: number): void {
    const chord = Math.floor((step % 32) / 8);
    const root = BASS_ROOTS[chord];
    // Soft walking bass: root on the beat, a fifth up off the beat.
    scheduleMusicNote('triangle', step % 2 === 0 ? root : root + 7, t, STEP * 0.9, 0.45);
    // Sparse hat, every other off-beat.
    if (step % 4 === 3) scheduleHat(t);
    // Melody, mellow.
    const note = MELODY[step % LOOP_STEPS];
    if (note > 0) scheduleMusicNote('square', note, t, STEP * 1.6, 0.12);
}

function startMusic(): void {
    const c = ctx;
    if (!c || musicTimer) return;
    nextStepTime = c.currentTime + 0.1;
    stepIndex = 0;
    // Lookahead scheduler: wake every 100ms, schedule 250ms ahead — smooth
    // even when the tab hiccups.
    musicTimer = setInterval(() => {
        if (!ctx) return;
        while (nextStepTime < ctx.currentTime + 0.25) {
            scheduleStep(stepIndex, nextStepTime);
            stepIndex = (stepIndex + 1) % LOOP_STEPS;
            nextStepTime += STEP;
        }
    }, 100);
}

// ---------------------------------------------------------------------------
// CDN music cues — three named tracks (menu / service_low / service_high)
// crossfaded via switchCue(). The sequencer is the permanent fallback for
// the very first cue only: a 404, timeout, or decode failure on 'menu'
// just leaves the sequencer playing, same posture as the sampled-SFX layer
// above. Once any cue has started, later switches crossfade cue-to-cue —
// the sequencer never comes back.
// ---------------------------------------------------------------------------

const cueBuffers = new Map<CueId, AudioBuffer>();
const cueFetches = new Map<CueId, Promise<AudioBuffer | null>>();

/** activeSlot is null until the first cue starts playing — that's what
 * tells startCueBuffer() this is the one-time handoff off the sequencer. */
let activeSlot: 'A' | 'B' | null = null;
let activeCue: CueId | null = null;
let sourceA: AudioBufferSourceNode | null = null;
let sourceB: AudioBufferSourceNode | null = null;

/**
 * Fetch + decode one cue, caching the result so a later switchCue() or
 * prefetchCue() call for the same id is instant. Never rejects — failures
 * are reported via track() and resolve to null; callers just don't switch.
 */
function fetchCueBuffer(id: CueId): Promise<AudioBuffer | null> {
    const cached = cueBuffers.get(id);
    if (cached) return Promise.resolve(cached);
    const inFlight = cueFetches.get(id);
    if (inFlight) return inFlight;

    const path = CUES[id].path;
    const t0 = performance.now();
    const p = (async (): Promise<AudioBuffer | null> => {
        const res = await fetchCdnAsset(path);
        if (!res.ok) {
            // 'unavailable' is deliberately unreportable: track() is itself
            // sdkReady()-guarded, so off-host it drops this event rather than
            // logging a misleading 'fetch'. That asymmetry is intended.
            track('music_track_failed', { path, reason: res.reason });
            return null;
        }
        const c = ctx;
        if (!c) return null;
        let buffer: AudioBuffer;
        try {
            buffer = await c.decodeAudioData(res.data);
        } catch {
            // NOTE: in `vite dev` a MISSING file does not reach here as a
            // fetch failure — Vite's SPA history fallback answers 200 with
            // index.html, which then fails to decode. Locally a missing cue
            // reports 'decode'; in production it reports 'fetch'. Do not read
            // local telemetry as if it matched production.
            track('music_track_failed', { path, reason: 'decode' });
            return null;
        }
        track('music_track_loaded', {
            path,
            fetch_ms: Math.round(performance.now() - t0),
            duration_s: Number(buffer.duration.toFixed(2)),
        });
        cueBuffers.set(id, buffer);
        return buffer;
    })().catch(() => null); // last-resort net — the steps above already handle their own failures

    // Delivered-audio round, task 2: a failed attempt (network, ctx not
    // ready yet, decode) used to sit in cueFetches forever — the resolved
    // (to null) promise is immutable, so every later call for this id kept
    // returning that same permanently-failed promise instead of trying
    // again. Deleting the entry on failure is what lets a later, better-
    // timed call (ctx now exists, network back) actually retry.
    p.then((buffer) => { if (!buffer) cueFetches.delete(id); });
    cueFetches.set(id, p);
    return p;
}

/** Fire-and-forget: warm the cache for a cue before it's actually needed
 * (service_high, fetched at run start so it's ready well before lives < 3). */
export function prefetchCue(id: CueId): void {
    fetchCueBuffer(id);
}

/**
 * Switch the playing cue. Fetches (or reuses a cached/in-flight fetch of)
 * the buffer, then crossfades it in on the idle trackA/trackB slot while
 * ramping the previously-active slot to 0. No-ops if `id` is already
 * active or already the target of an in-flight switch.
 */
export function switchCue(id: CueId): void {
    if (activeCue === id) return;
    activeCue = id;
    fetchCueBuffer(id).then((buffer) => {
        // Bail if superseded by a later switchCue() call while this fetch
        // was in flight, or if the AudioContext is gone.
        if (!buffer || !ctx || activeCue !== id) return;
        startCueBuffer(id, buffer);
    });
}

/** Starts `buffer` looping into the idle trackA/trackB slot and crossfades
 * it in over MUSIC.fadeSeconds while the previously-active slot (a cue, or
 * — only the first time — the sequencer) ramps to 0, then stops whatever
 * was outgoing. */
function startCueBuffer(id: CueId, buffer: AudioBuffer): void {
    const c = ctx;
    if (!c || !trackA || !trackB) return;

    const outgoingSlot = activeSlot;
    const incomingSlot: 'A' | 'B' = outgoingSlot === 'A' ? 'B' : 'A';
    const incomingGain = incomingSlot === 'A' ? trackA : trackB;
    const outgoingGain = outgoingSlot === 'A' ? trackA : outgoingSlot === 'B' ? trackB : null;
    const outgoingSource = outgoingSlot === 'A' ? sourceA : outgoingSlot === 'B' ? sourceB : null;

    const src = c.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    src.loopStart = MUSIC.loopStart;
    src.loopEnd = Math.max(MUSIC.loopStart, buffer.duration - MUSIC.loopEndTrim);
    src.connect(incomingGain);
    src.start();
    if (incomingSlot === 'A') sourceA = src; else sourceB = src;
    activeSlot = incomingSlot;

    const t0 = c.currentTime;
    incomingGain.gain.setValueAtTime(0, t0);
    incomingGain.gain.linearRampToValueAtTime(CUES[id].gain, t0 + MUSIC.fadeSeconds);

    if (outgoingGain) {
        outgoingGain.gain.setValueAtTime(outgoingGain.gain.value, t0);
        outgoingGain.gain.linearRampToValueAtTime(0, t0 + MUSIC.fadeSeconds);
    }
    // The sequencer only fades on the very first cue — a one-time handoff,
    // not part of every switch.
    if (outgoingSlot === null && seqGain) {
        seqGain.gain.setValueAtTime(1, t0);
        seqGain.gain.linearRampToValueAtTime(0, t0 + MUSIC.fadeSeconds);
    }

    setTimeout(() => {
        outgoingSource?.stop();
        if (outgoingSlot === null && musicTimer) {
            clearInterval(musicTimer);
            musicTimer = null;
        }
    }, MUSIC.fadeSeconds * 1000);
}
