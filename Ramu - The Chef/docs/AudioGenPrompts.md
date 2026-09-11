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
