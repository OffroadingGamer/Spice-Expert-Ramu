# Audio Gen Prompts

Log of MusicGen prompts generated for Spice Expert: Ramu. Append-only — a superseding entry states what it supersedes and why, prior entries are never edited or deleted.

## Log

## bgm-service-low — 2026-09-04 16:19
**Input brief:** Track id: bgm-service-low. Base layer — sets groove, key, palette, production character for mid/high to extend and menu to strip back. Plays during early rush: line busy and coping, competent/repetitive/warm, not tense or triumphant, nobody behind yet. Rhythm-forward, tabla and dholak carry it, steady-hands/repeated-motions feel. Leave headroom — sparse-to-medium, least dense of the three service layers. Minimal melody, short repeating figure at most. Production dry, close-mic'd, a little lo-fi — working kitchen not concert hall. Register: the job, not the destination — no serene meditation, no fanfare, no travelogue. Non-negotiables: 112 BPM, A minor, 4/4, instrumental, steady and non-resolving throughout, no intro/build/climax/ending/fade.
**Output prompt:** Dry, close-mic'd instrumental groove at 112 BPM in A minor, 4/4: tabla and dholak lock into a steady, repetitive rhythm like practiced hands working a line, with sparse kanjira accents and a light plucked santoor figure. Warm, unhurried, sparse-to-medium density, minimal melody, continuous and non-resolving, no build, no climax, no fade.
**Params:** model=stereo-large, duration=30s, guidance=3.0, seed=4271
**Assumptions:** File did not exist yet — created it with this entry as the first Log item, using the template given in the handover. Instrument palette drawn from the project default list (tabla, dholak, kanjira, santoor), narrowed to a sparse-to-medium subset per the brief's headroom note; harmonium, bansuri and upright bass held back for mid/high to add density on top. Seed chosen arbitrarily (4271) and stated for reproducibility, since bgm-service-low is the base take other stages will extend.
---

## bgm-menu — take 1 — 2026-09-04 20:17
**Input brief:** Handover "audio generation agent" (2026-09-04): scope widened from prompt-writing to running generation via `rundot generate music`, writing masters to Audio/BGM/, logging every take. Cue 1 of 3, prompt run verbatim as given in the handover (fixed constants 112 BPM / A minor / 4/4 / instrumental, no-shape clause for loopability). Two takes requested.
**Output prompt:** Instrumental menu loop for a cooking game set in an Indian restaurant kitchen. 112 BPM, A minor, 4/4. Sparse and inviting: soft bansuri flute over a gentle tanpura drone, light finger-cymbal accents, minimal percussion. Warm, patient, unhurried — a kitchen before service. Consistent energy and instrumentation throughout with no build, no drop, no fade in or out. No vocals.
**Params:** provider=elevenlabs (default, not overridden), duration=30s, client-ref=bgm-menu-t1, game-id=PpB5gECS0AMU49mGYAKM
**Cost:** estimate=113 credits, actual=113 credits, balance after=132,335
**Output file:** Audio/BGM/bgm-menu-take1.mp3 (+ .mp3.json sidecar, generationId efc3137f-1334-45f5-9bcd-d379d251b923)
**Assumptions:** No jam-entry/ or game config folder found in this repo root, so --game-id auto-detect had no target; resolved by running `rundot list-games` and passing the matching "Spice Expert: Ramu" id explicitly. Provider left at CLI default (elevenlabs) since the handover named no provider.
---

## bgm-menu — take 2 — 2026-09-04 20:17
**Input brief:** Same as take 1 — second of two requested takes for bgm-menu, prompt unchanged.
**Output prompt:** Instrumental menu loop for a cooking game set in an Indian restaurant kitchen. 112 BPM, A minor, 4/4. Sparse and inviting: soft bansuri flute over a gentle tanpura drone, light finger-cymbal accents, minimal percussion. Warm, patient, unhurried — a kitchen before service. Consistent energy and instrumentation throughout with no build, no drop, no fade in or out. No vocals.
**Params:** provider=elevenlabs (default, not overridden), duration=30s, client-ref=bgm-menu-t2, game-id=PpB5gECS0AMU49mGYAKM
**Cost:** estimate=113 credits, actual=113 credits, balance after=132,222
**Output file:** Audio/BGM/bgm-menu-take2.mp3 (+ .mp3.json sidecar)
**Assumptions:** First attempt at this take failed with `VenusServerApiException: Rate limited; retry in 300 seconds` — confirmed via balance check that no credits were charged for the failed call, waited out the cooldown, re-ran unchanged, succeeded on retry.
---

## bgm-service-low — take 2 — 2026-09-04 20:24
**Input brief:** Same handover as above, cue 2 of 3. bgm-service-low-take1.mp3 already existed (from the earlier prompt-only session); this and the next take are alternates numbered around it, per the handover's instruction.
**Output prompt:** Instrumental background loop for a fast-paced cooking game set in an Indian restaurant kitchen. 112 BPM, A minor, 4/4. Warm unhurried groove: light tabla and dholak percussion, soft bansuri flute melody, gentle tanpura drone, subtle santoor accents. Focused and steady, not dramatic. Consistent energy and instrumentation throughout with no build, no drop, no fade in or out. No vocals.
**Params:** provider=elevenlabs (default), duration=30s, client-ref=bgm-service-low-t2, game-id=PpB5gECS0AMU49mGYAKM
**Cost:** estimate=113 credits, actual=113 credits, balance after=132,109
**Output file:** Audio/BGM/bgm-service-low-take2.mp3 (+ .mp3.json sidecar, generationId c211d7ab-eec0-44ff-bb32-6646a2ff85a0)
**Assumptions:** None beyond those already stated for bgm-menu.
---

## bgm-service-low — take 3 — 2026-09-04 20:29
**Input brief:** Same handover, cue 2 of 3, second alternate take (prompt unchanged from take 2).
**Output prompt:** Instrumental background loop for a fast-paced cooking game set in an Indian restaurant kitchen. 112 BPM, A minor, 4/4. Warm unhurried groove: light tabla and dholak percussion, soft bansuri flute melody, gentle tanpura drone, subtle santoor accents. Focused and steady, not dramatic. Consistent energy and instrumentation throughout with no build, no drop, no fade in or out. No vocals.
**Params:** provider=elevenlabs (default), duration=30s, client-ref=bgm-service-low-t3, game-id=PpB5gECS0AMU49mGYAKM
**Cost:** estimate=113 credits, actual=113 credits, balance after=131,996
**Output file:** Audio/BGM/bgm-service-low-take3.mp3 (+ .mp3.json sidecar, generationId d60edd60-355c-4bbc-b225-fc01b74abb08)
**Assumptions:** First attempt at this take also hit the same rate limit as bgm-menu take 2 — no charge, waited out cooldown, succeeded on retry.
---

## bgm-service-high — take 1 — 2026-09-04 20:36
**Input brief:** Same handover, cue 3 of 3. Two takes requested, prompt run verbatim as given.
**Output prompt:** Instrumental background loop for a fast-paced cooking game set in an Indian restaurant kitchen at peak rush. 112 BPM, A minor, 4/4 — same key and tempo as the calmer service track so the two can crossfade. Driving tabla and dholak with tighter sixteenth-note patterning, urgent sarangi and bansuri lines, santoor accents, low percussive pulse underneath. Tense and busy but controlled, never chaotic. Consistent energy and instrumentation throughout with no build, no drop, no fade in or out. No vocals.
**Params:** provider=elevenlabs (default), duration=30s, client-ref=bgm-service-high-t1, game-id=PpB5gECS0AMU49mGYAKM
**Cost:** estimate=113 credits, actual=113 credits, balance after=131,883
**Output file:** Audio/BGM/bgm-service-high-take1.mp3 (+ .mp3.json sidecar, generationId 7eadab98-f60e-40f0-95e4-73a2ca06baf3)
**Assumptions:** First attempt hit the same 300s rate limit pattern as the prior two — no charge, waited out cooldown, succeeded on retry.
---

## bgm-service-high — take 2 — 2026-09-04 20:44
**Input brief:** Same handover, cue 3 of 3, second of two requested takes (prompt unchanged from take 1). Final generation of the six-generation batch.
**Output prompt:** Instrumental background loop for a fast-paced cooking game set in an Indian restaurant kitchen at peak rush. 112 BPM, A minor, 4/4 — same key and tempo as the calmer service track so the two can crossfade. Driving tabla and dholak with tighter sixteenth-note patterning, urgent sarangi and bansuri lines, santoor accents, low percussive pulse underneath. Tense and busy but controlled, never chaotic. Consistent energy and instrumentation throughout with no build, no drop, no fade in or out. No vocals.
**Params:** provider=elevenlabs (default), duration=30s, client-ref=bgm-service-high-t2, game-id=PpB5gECS0AMU49mGYAKM
**Cost:** estimate=113 credits, actual=113 credits, balance after=131,770
**Output file:** Audio/BGM/bgm-service-high-take2.mp3 (+ .mp3.json sidecar, generationId c739a5ca-0370-44ec-a86b-0cc7e70738b4)
**Assumptions:** First attempt hit the same 300s rate limit pattern as every other generation in this batch except take 1 of each cue — no charge, waited out cooldown, succeeded on retry. Batch complete: 6 of 6 planned generations run, 678 credits spent, well under the 10-generation cap.
---
## 🔴 Music regeneration effort — 2026-09-11 to 09-12 — NOT SHIPPED

The three cues live in production are still the **Sep 4 masters** (14 bars, ~30 s,
480,698 B each). Everything below was generated, measured, and held. Recorded because two
rounds of it failed in instructive ways.

### Round A4 — `rundot generate music` — REJECTED: seconds of dead air

Three cues at 68.571 s (32 bars @ 112 BPM), 1,548 credits, 6 generations. Bar-exact pair,
clean measurements, and **unusable**: roughly **four seconds of silence at the head and
several more at the tail** of both service cues.

🔥 **Two causes, and both were mine.** The prompt I specified asked the generator to
*"ease back down toward a hush so the very last moment is quiet"* — it requested the
defect. And seam quality was scored as **RMS in a 5 ms window at each edge**, a proxy that
**silence maximises**. It rejected the take that was correct: `service_high`'s first
attempt ended *live* at −31.6 dBFS, which is what a real loop sounds like. ✅ Recorded as
[Retro.md](Retro.md) lesson 94 — third recurrence of proving a property on a metric that
excludes or inverts the thing that matters.

### Round A5 — local ComfyUI / MiniMax Music 3 — REJECTED: "too crowded and jumpy"

Route: `MiniMaxMusic3TextEncode` + `EmptyMiniMaxMusic3LatentAudio` + KSampler +
`VAEDecodeAudio`, then `TrimAudioDuration` and `SaveAudioMP3`. Local, no credits, runs
parallel to the code rounds. ✅ **`lyrics` left empty is what makes it instrumental.**

✅ **The dead air was fixed, and the method is worth keeping:** generate long, then
*jointly* search for a quiet 20 ms pocket at both ends of a fixed-length window (not the
take's own edges), snap to a zero crossing, and cut. Verified by cross-correlating each
final against its source — which caught a real bug where a one-word caption difference
silently triggered a fresh generation instead of a cache hit.

| | service_low | service_high | menu |
|---|---|---|---|
| Duration | 34.7133 s | 34.7133 s | 18.4192 s |
| Tempo | 93.96 BPM | 90.67 BPM | ~115–117 |
| RMS | −18.69 | −17.34 | −20.57 dBFS |
| Peak | −1.52 | −0.49 | 🔴 **+0.19 dBFS** |

🔴 **The menu is clipped** — peak above full scale. RMS-matching needs gain **1.24** on
it, which would push it to **+2.07 dBFS**. Not a constant to retune; it cannot ship.

⚠️ **112 BPM is a demonstrated model limit.** Across 12 generations sweeping `cfg_scale`
2.5–4.5 and `top_k` 50/120, measured tempo ranged **90.7–178.2 BPM** and never landed
within tolerance. The pair ended **3.6% apart** from each other — and they crossfade
mid-run, which is the one property that had to hold.

❌ **Rejected by the user on listening: "a bit too crowded and jumpy."** 🔥 **Both traced to
my prompts, not the execution** — they asked for six simultaneous layers (tabla *and*
dholak *and* continuous sixteenth shaker *and* sustained lead *and* dense harmonium *and*
plucked bed) and for a *"pronounced"* sidechain pump. A pump is amplitude modulation; under
repetition it reads as lurching rather than driving. ✅ **The distinction for next time:
momentum comes from an even pulse, not from ducking the level.**

### Round A6 — in flight

Corrections: a **hard cap on simultaneous elements** (3 / 4 / 3, counted and reported), **no
pumping or ducking of any kind**, no sixteenth layers, shakers, fills or syncopation, peak
**≤ −1.5 dBFS** with zero samples at full scale, the pair **within 1% of each other** rather
than chasing 112, within-take tempo drift measured, and longer loops (pair ≥ 45 s, menu
≥ 30 s). Round A5's files are kept as the fallback.

🔴 **Gate: end of Sep 13.** If nothing is chosen and wired by the freeze, the Sep 4
masters ship unchanged. The new menu is out either way.
### Round A7 — local ComfyUI — REJECTED: vocals, again

✅ **The best-measured round by far**, and still unusable. `service_low` and
`service_high` landed at **161.499 BPM each — an exact tempo match**, the property two
earlier rounds hunted for and never got (round 2: 3.5% apart; round 3: 5.0% after 51
generations). Density fell 46% on `service_high`. Peaks, live edges, lengths and
within-take stability all passed.

✅ **The 2×2 vocal probe is worth keeping as a finding.** One cue, one seed, four takes
crossing {caption mentions voice / doesn't} × {`lyrics` empty / `[instrumental]`}, scored on
formant-band concentration, voiced fraction and vibrato energy:

| variant | formant ratio | voiced fraction |
|---|---|---|
| **A — neutral caption, `lyrics` empty** | **0.457** ✅ | 0.763 |
| B — negated caption, `lyrics` empty | 0.626 | 0.701 |
| C — neutral caption, `lyrics` = `[instrumental]` | **0.991** 🔴 | 0.914 |
| D — negated caption, `[instrumental]` | 0.634 | 0.801 |

🔥 **Putting `[instrumental]` in the `lyrics` field makes vocalisation WORSE, not
better** — the worst variant on two of three metrics. Empty is correct. ⚠️ Writing
*"no vocals"* into the caption also scored worse than not mentioning voice at all: a
negation puts the token into the positive conditioning.

❌ **The user still heard vocals.** Variant A was used for every final take.

### 🔴 VERDICT — MiniMax Music 3 is unusable for instrumental game BGM

Four rounds, four rejections on the same defect. **The empty `lyrics` field does not gate
vocalisation**, and no caption phrasing tested suppresses it. ✅ **Do not spend another
round on it.** If generation is ever revisited, `SoniloTextToMusic` is installed as a
different provider (a *partner* node, so it likely bills rather than running locally).

✅ **Two things learned that outlive the model**, both verified in `audio/audio.ts` source:

1. **`MUSIC.fadeSeconds` (1.2 s) does NOT cover the loop seam.** It appears only inside
   `startCueBuffer` — it is a gain ramp applied when a cue *starts or switches*. Playback
   is `src.loop = true` on the buffer, so **the wrap is heard raw, every cycle.** A round
   report claiming the crossfade masks a wrap discontinuity was wrong on this point.
2. **The engine loops between `0.026 s` and `duration − 0.026 s`** — it never plays the
   file's first or last sample. A wrap discontinuity measured at the file's edges
   describes a join the player never hears. 🔥 Both rounds measured the wrong points.
3. ✅ **ComfyUI's encoder padding matches the tuned `loopStart`/`loopEndTrim = 0.026`
   constants** — confirmed by ear: no tick at the loop point on round A7's files.

---

## 🔒 Licensed source tracks — Pixabay, Sep 11 2026 — the shipping plan

Generation abandoned. The user selected three tracks by ear from Pixabay, all by the same
creator (`alex-morgan`), all verified vocal-free by listening.

`Ramu - The Chef/Audio/Pixabay/` — all 48 kHz stereo, ~256 kbps:

| cue | file | duration | size | peak | body RMS | tempo (est.) |
|---|---|---|---|---|---|---|
| `bgm-menu` | `...indian-classical-raga-537491` | 274.8 s | 8.79 MB | **+0.00 dBFS** | −12.11 | 140.6 |
| `bgm-service-high` | `...sitar-indian-instrumental-music-583288` | 195.0 s | 6.24 MB | **+0.14 dBFS** | −12.34 | 187.5 |
| `bgm-service-low` | `...india-drums-tabla-sitar-ethnic-mood-587419` | 173.5 s | 5.55 MB | **+0.01 dBFS** | −11.23 | 130.8 |

🔴 **All three fade in and out** — heads and tails measure 30–57 dB below body level, so
looped as-is the player hears a hole every cycle. **All three are at or above full scale.**
Total payload 20.6 MB against 1.4 MB today.

#### The processing contract

1. Cut an **interior window** (~60 s) with edges at body level — no intro, no outro, no rest.
2. **Bake an equal-power crossfade (≥ 1 s) across the wrap into the file itself**, since the
   engine does a hard loop. ⚠️ Account for the 26 ms trim at each end — the seam played is
   `duration − 0.026` → `0.026`, not the file edges.
3. Attenuate to peak **≤ −1.5 dBFS**, attenuation only.
4. Resample **44.1 kHz**, encode **128 kbps CBR**, gameplay pair identical in length.
5. Measure RMS per file → the `CUES` gain table.

⚠️ The two gameplay tracks are different compositions at different tempos and will not
beat-match at a cue switch. **Accepted; do not time-stretch.**

#### 🔒 Licence position — decided by the user, Sep 12 2026

Pixabay Content License, licensee **PuneetMakes**, certificates on file for two of the
three. ✅ **The third has no certificate available; all three are the same creator on the
same platform, and the user's decision is to treat them as the same licence.**

🔴 **Correction I owe the record:** I told the user Pixabay content could be
redistributed. **That was wrong, and they acted on it.** The licence permits use in
projects — including commercial ones — and needs no attribution, but it restricts
redistributing the files **as standalone assets**, and committing an `.mp3` to a public
GitHub repository does exactly that.

✅ **Resolution, costing nothing:** the three files are **gitignored**. `rundot deploy`
ships the built `dist/`, and Vite copies `public/` into it — **git is not the delivery
path**. The game ships identically; the public repo simply does not host the raw assets.
The same pattern already governs `Art/` and `Audio/`.

⚠️ **One operational trap for whoever performs the swap.** The three current
`jam-entry/public/cdn-assets/bgm-*.mp3` are **already tracked by git**, and `.gitignore`
does not untrack a tracked file. Overwriting them with the Pixabay-derived loops would
show them as *modified tracked files* and they would be committed — redistributing them
in the public repo, which is exactly what must not happen. ✅ **The swap must be:
`git rm --cached` the three paths, add the ignore rule, then copy the new files in.**
Verify afterwards with `git status` that the three mp3s appear nowhere.
---

## ✅ Pixabay loop round — 2026-09-12 — VERIFIED, HELD (not yet swapped)

Three licensed tracks cut to seamless 60 s loops. **No generation** — the MiniMax route is
abandoned (see the round A7 verdict above). Deliverables in `Audio/_gen/music-pixabay-final/`.

**Agent method:** find the region clear of each track's head/tail fades, search 60 s windows
inside it, build an equal-power (sqrt) crossfade from a 3 s tail-continuation folded over the
window start, then select on the join discontinuity **measured with the engine's 0.026 s trim
already applied** — not the raw file edges — because that is the seam `audio.ts`'s
`loopStart`/`loopEndTrim` actually plays. ✅ Good instinct, and verified by simulation rather
than assumed.

### Independent verification — measured from the files

| | service_low | service_high | menu |
|---|---|---|---|
| Duration | **60.0000 s** | 60.0000 s | 60.0000 s |
| Peak | −2.81 | −2.69 | −2.69 dBFS |
| RMS | −14.46 | −15.77 | −15.49 dBFS |
| Samples at full scale | **0** | **0** | **0** |

All three 44.1 kHz stereo, **128.1 kbps CBR**, 960,887 B. ✅ **Peaks match the agent's report
to 0.00 dB**, RMS to within 0.02–0.20 dB.

🔴 **My first pass disagreed by a constant ≈0.45 dB on every RMS — that was my error**,
not theirs: I measured through librosa's mono downmix `(L+R)/2`. Recorded as
[Retro.md](Retro.md) lesson 98.

### The seam, checked a different way

Their metric is an RMS delta across the join, which measures **level match** and is
structurally blind to a click — a click is a sample-level **step**. Measuring the wrap step
per channel against the distribution of ordinary sample-to-sample steps in the same music:

| | worst channel | vs 99.9th-percentile body step |
|---|---|---|
| service_low | exceeds **84.5%** of body steps | body step ~5× larger |
| service_high | **83.4%** | ~8× larger |
| menu | **74.4%** | ~12× larger |

✅ **No click mechanism** — the wrap discontinuity sits inside ordinary waveform motion on
every channel of every file. Two different metrics, same conclusion.
⚠️ `service_low` has the weakest level match across the join (**2.21 dB** over 50 ms); small,
but it is the one to listen for.

### The gains, derived from measurement

RMS-matched to `service_low`, which is `audio.ts`'s stated convention:

```ts
menu:         { path: 'bgm-menu.mp3',         gain: 1.125 },   // was 1.308
service_low:  { path: 'bgm-service-low.mp3',  gain: 1.000 },   // unchanged
service_high: { path: 'bgm-service-high.mp3', gain: 1.162 },   // was 1.101
```

✅ **Nothing clips** — worst post-gain peak **−1.39 dBFS**. (Round A5's menu would have hit
**+2.07**; this is that failure not recurring.)
✅ **Effective loudness lands within ~1 dB of what ships today**, so `MUSIC_BASE` needs no
change. Today's effective levels: low −15.15, high −14.00, menu −15.28 dBFS.
⚠️ **Payload doubles, 1.44 MB → 2.88 MB** — 60 s loops instead of 30 s. These stream from
`cdn-assets/`, so it is not bundle size.

🔒 **Sidecars scanned — clean** (no UserId, no game ids), with a **positive control**:
`Art/_gen/backdrops/bg-block-1-take1.png.json` *does* contain the UserId, so the scanner
matches. Sidecars still never go into `public/`.

### ⏸ Held, and why

**Nobody has listened.** The agent cannot hear; neither can I. Every one of rounds A4–A7
passed its measurements and failed on listening — vocals four times running, which no metric
in play detected. Licensed human recordings remove that specific failure, but the principle
stands: **measurement has never been what decides this.**

The swap, when approved: `git rm --cached` the three tracked
`jam-entry/public/cdn-assets/bgm-*.mp3` → add ignore rules → copy the new files (**sidecars
stay out**) → set the three gains → build → deploy private.

---

## 📤 SFX round — 2026-09-12 — DISPATCHED, pending

Two one-shots. No BGM changes.

### Task 1 — wave-clear service bell

`Audio/Pixabay/SFX/freesound_community-service-bell-ring-14610.mp3` → `wave-clear-bell.mp3`,
replacing `audio/level-complete.mp3` on the `wave-clear` cue.

| | |
|---|---|
| Source | 8.904 s, **24 kHz**, stereo, 160 kbps, 178,080 B |
| Silence block | **0 → 0.311 s**, RMS −64.5 dBFS — the part to cut |
| Strike onset | **0.311 s**, peak 0.336 s |
| Decay | −25 dB at **1.28 s** from onset · −30 dB at **2.09 s** · −40 dB at 7.36 s |
| Replaces | 1.894 s, mono, peak −0.63, RMS −15.66, gain `0.72` → **effective peak −3.48, RMS −18.51** |

🔴 **The finding: the channels are out of phase — correlation −0.706.**

| over the cue region | RMS | peak |
|---|---|---|
| Left only | −20.60 | **−0.50 dBFS** |
| Right only | −22.13 | −3.03 |
| **(L+R)/2 — what a phone speaker hears** | **−29.47** | **−11.35 dBFS** |

🔥 **A naive mono downmix costs 8.87 dB** and drops the peak by nearly 11. A phone speaker
mono-sums, so the bell would sound thin and weak on exactly the devices most players use,
while sounding fine on headphones — invisible to desktop testing. ✅ **Fix: take the LEFT
channel as the mono source** (stronger, and it sidesteps the cancellation). Stereo width on
a 2 s bell on a phone speaker buys nothing. Alternative offered: flip the right channel's
polarity and keep stereo.

Spec: cut ~10 ms before onset at a zero crossing; **~2.1 s from onset** (matching the 1.894 s
it replaces); ~120 ms tail fade; **keep 24 kHz** (source is band-limited to 12 kHz, so
upsampling adds bytes and no information); report measured peak/RMS so the `SAMPLES` gain is
derived, not guessed.

✅ **Code side is a drop-in.** `audio.ts:106` is the only entry; `sfx.waveClear()`
(`audio.ts:302`) and its synth fallback are untouched, trigger at `towerScene.ts:919`.

### Task 2 — map-transition sting

`Audio/Pixabay/SFX/grumpynora-bombay-nights-8-sec-edit-551802.mp3` → `bombay-transition.mp3`,
for the block-change transition (Task 4 of the implementation round).

Measured: 8.777 s, stereo, 44.1 kHz, 256 kbps, 280,868 B, peak **−1.44 dBFS**, **attack at
0.000 s** (no head silence — it must stay instant). Musical body ends **~4.0 s**; −40 dB
under peak by 5.8 s; last sample above −60 dBFS at **7.10 s**.

Spec: trim to **~4.6 s** (everything past it is masked under BGM), 150–250 ms fade at the
cut, **no loop**, 44.1 kHz / 128 kbps (~74 KB, down from 281 KB), peak ≤ −3.0 dBFS.
⚠️ **Channel correlation to be reported here too** — same cancellation risk as Task 1, not
to be assumed away.

🔒 **Licence — both files.** Pixabay terms forbid redistributing standalone and the repo
is **public**. Verified: `jam-entry/public/audio/` is **tracked, not ignored**, so ignore
rules are needed before either file lands there — the same trap as the three `bgm-*.mp3`.
`rundot deploy` ships `dist/`, so git was never the delivery path.
