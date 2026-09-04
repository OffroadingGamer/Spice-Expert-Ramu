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
