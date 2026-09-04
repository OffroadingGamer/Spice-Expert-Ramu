# Audio Gen Prompts

Log of MusicGen prompts generated for Spice Expert: Ramu. Append-only — a superseding entry states what it supersedes and why, prior entries are never edited or deleted.

## Log

## bgm-service-low — 2026-09-04 16:19
**Input brief:** Track id: bgm-service-low. Base layer — sets groove, key, palette, production character for mid/high to extend and menu to strip back. Plays during early rush: line busy and coping, competent/repetitive/warm, not tense or triumphant, nobody behind yet. Rhythm-forward, tabla and dholak carry it, steady-hands/repeated-motions feel. Leave headroom — sparse-to-medium, least dense of the three service layers. Minimal melody, short repeating figure at most. Production dry, close-mic'd, a little lo-fi — working kitchen not concert hall. Register: the job, not the destination — no serene meditation, no fanfare, no travelogue. Non-negotiables: 112 BPM, A minor, 4/4, instrumental, steady and non-resolving throughout, no intro/build/climax/ending/fade.
**Output prompt:** Dry, close-mic'd instrumental groove at 112 BPM in A minor, 4/4: tabla and dholak lock into a steady, repetitive rhythm like practiced hands working a line, with sparse kanjira accents and a light plucked santoor figure. Warm, unhurried, sparse-to-medium density, minimal melody, continuous and non-resolving, no build, no climax, no fade.
**Params:** model=stereo-large, duration=30s, guidance=3.0, seed=4271
**Assumptions:** File did not exist yet — created it with this entry as the first Log item, using the template given in the handover. Instrument palette drawn from the project default list (tabla, dholak, kanjira, santoor), narrowed to a sparse-to-medium subset per the brief's headroom note; harmonium, bansuri and upright bass held back for mid/high to add density on top. Seed chosen arbitrarily (4271) and stated for reproducibility, since bgm-service-low is the base take other stages will extend.
---
