# 05 Production Log — Twelve Glasses

One row per generation. Redo budget: one retake per asset/shot unless the user says otherwise.

| Time | Asset | Model | Prompt (or "as in 03/04") | Cost | Result | Keep? |
|---|---|---|---|---|---|---|
| 20:48 | Ramu Prasad portrait | Nano Banana Pro | Visual description in 03 Script.md (age-25 baseline) | ~200 (193.7k→193.5k) | Turnaround sheet: front/profile/back + 2 face close-ups; bandana, moustache, greyed whites, scars, sweat all present | KEEP |
| 20:58 | Sunrise Chai Stall | Nano Banana 2 | as sent 20:52 | ~120 | Symmetrical stall, kettle steaming, six glasses, road beyond | KEEP |
| 20:58 | Rashid's Highway Dhaba | Nano Banana 2 | as sent | ~120 | Tandoor glow, ORDERS board, string bulbs, highway streaks | KEEP |
| 20:58 | City Trattoria Kitchen | Nano Banana 2 | as sent | ~120 | Steel line, heat lamps, steam, blue flames | KEEP |
| 20:58 | Shuttered Trattoria Step | Nano Banana 2 | as sent | ~120 | CLOSED sign, grille, rain, one sodium lamp | KEEP |
| 20:58 | The Grand Hotel Kitchen, Delhi | Nano Banana 2 | as sent | ~120 | Symmetry perfect, but cold teal grade — ending needs warmth | RETAKE ×1 on Pro with warm-light prefix |
| 21:08 | The Grand Hotel Kitchen, Delhi (retake) | Nano Banana Pro | warm-light prefix + original | ~200 | Warm amber pendants, copper, symmetry kept, pass in foreground | KEEP |
| 21:14 | Prop: Knife Roll | Nano Banana Pro | as sent | — | Olive canvas roll, frayed cord, neutral bg | KEEP |
| 21:14 | Prop: Steel Tea Kettle and Glasses | Nano Banana Pro | as sent | — | Dented black kettle, two ribbed glasses, street bokeh bg (fine for a reference) | KEEP |

Balance after props + hotel retake: 191.2k (total spend so far ≈ 2.6k). Next: Style Check → Scenes.

Locations total ≈ 600 credits (193.5k → 192.9k).

Voice: Manav — Husky & Conversational (ElevenLabs library), assigned 20:45. Voice profile tags auto-derived: male, mid-low pitch, warm, stern.
| 21:34 | Style Check board (take 2) | Nano Banana Pro | default bible prompt, 8 refs, no additional details | ~200? | Ramu full-body solid; chai stall, kettle, knife roll fine; story stills = 1 dhaba + 2 duplicate empty kitchens; teal-heavy | RETAKE ×1 with warm steering + 3 distinct Ramu stills; archive keeps take 2 |
| 21:40 | Style Check board (take 3) | Nano Banana Pro | + warm steering, 3 distinct Ramu stills | ~200? | Ramu solid; stills: dhaba (Ramu), trattoria (empty), shuttered step (Ramu sitting, knife roll); chai stall still teal | KEEP — master style anchor |
| 22:00 | Storyboard Scene 1 (Hook) | Nano Banana Pro | six-panel composition from 04 (pencil-edited), refs Ramu·Chai Stall·Dhaba·Kettle·Style Check | ~1,000 (186.6k→185.6k) | 6 panels, identity consistent, warm; panels 2/4/5 strong; Ramu reads ~25 not 15; no silhouette/eyes | KEEP (no retake — time) |

**22:00 schedule reset:** publish target moved to **23:30**; hard close 00:30; nothing new rendering after 23:45. Narration: drop the word "fifteen" (image contradicts it).
| 22:06 | Storyboard Scene 2 (Development) | Nano Banana Pro | six-panel from 04, refs Ramu·Trattoria·Shuttered Step·Knife Roll·Style Check | ~1,000 | All six panels landed; step-in-rain, knife roll close-up, walking away at dawn — strongest sheet | KEEP |
| 22:06 | Storyboard Scene 3 (Payoff) | Nano Banana Pro | six-panel from 04, refs Ramu·Grand Hotel·Kettle·Style Check | ~1,000 | Pass at service, ticket close-up, symmetrical empty kitchen, pour into glasses, brigade wide; not visibly 35 | KEEP |

**Credit cap: 45,000 total (user, 22:20).** Video: Seedance 2.0 Fast, 15 s × 3, 6,827 each. Motion prompts as sent 22:22 (three sub-shots per clip; voiceover lines "I started with a glass." / "So I went back to work." / "Twenty years. Same glass." via @audio1 = Manav).
| 22:25 | Video shots 1–3 | Seedance 2.0 Fast | 22:22 prompts | 20,481 | pending | |
| 22:45 | Generate all started | Seedance 2.0 Fast | — | charged per shot on completion (balance 185,221 at start) | shot 1 rendering, 2–3 queued; ETA all three ~23:05 | |
| 22:58 | Video shot 1 (Hook) | Seedance 2.0 Fast | 22:22 prompt + @audio1 line on sub-shot 1 | 6,827 | 15.1 s, 720×1280, 24 fps, AAC. Frames checked (References and Logs/frames_shot1/contact.png): pour close-up → symmetrical stall wide → tandoor naan; warm, no teal, no extras, identity consistent; mouth barely moves on the line | KEEP |
| 23:06 | Video shot 2 (Development) | Seedance 2.0 Fast | 22:22 prompt + @audio1 line on sub-shot 3 | 6,827 | 15.1 s. Frames (frames_shot2/contact.png): pasta toss → crossfade → step in rain with knife roll, push-in to face → stands, shoulders roll, exits right, empty step. Best clip. | KEEP |
| 23:14 | Video shot 3 (Payoff) | Seedance 2.0 Fast | 22:22 prompt + @audio1 line on sub-shot 3 | 6,827 | 15.1 s. Frames (frames_shot3/contact.png): opens on the empty step (last-frame handoff) → pass at service → symmetrical copper kitchen, alone wiping → kettle pours into a row of glasses → drinks → ties bandana → looks into lens with the glass. | KEEP |

All three clips kept, no retakes. Video total 20,481. Audio: user confirms lines sit well ("a bit neutral but acceptable").
| 23:17 | Video shot 3 — CORRECTION | | | | User spotted: 9–12 s the glass floats mid-air while both hands tie the bandana. Retake ×1: sub-shot 3 rewritten so he sets the glass down on the pass before tying. | RETAKE |
| 23:18 | Video shot 3 (retake) | Seedance 2.0 Fast | sub-shot 3 line changed only | 6,827 | pending | |
| 23:28 | Video shot 3 (retake) result | | | 6,827 | Frames (frames_shot3b/contact.png): floating glass fixed — pours the first of a row of ~12 glasses overhead, drinks, sets it down, ties bandana. User reports a stray spoken "hello" at the start (sub-shot 1). Decision on a 2nd retake left to the user (audio). | KEEP visually |
| 23:35 | Video shot 3 (retake 2) | Seedance 2.0 Fast | + "Nobody speaks; mouths closed; no greeting" on sub-shot 1; "No speech anywhere in Shots 1 and 2" | 6,827 | pending — user found the stray "hello" off-putting; LAST render of the night | |
| 23:40 | Soundtrack | — | user chose a previously generated track of their own instead of the ElevenLabs result; approved | — | rights confirmation requested | APPROVED |
| 23:45 | Soundtrack — rights | — | The "previously generated" track is a Pixabay stock file ("Sitar Indian Instrumental Music", ID 583288, licensor alex-morgan-54692529, downloaded 2026-09-14 18:17 UTC; licence certificate in user's possession). Agent recommendation: DO NOT use — jam requires original work made during the jam; use the in-tool ElevenLabs track, or no music. User decides. | | |
| 23:52 | Video shot 3 (retake 2) result | | | 6,827 | Frames (frames_shot3c/contact.png): clean — pass at service, symmetrical kitchen, pour into the row, drinks, sets glass down, ties bandana with empty hands, final look into lens. User: audio clean, no "hello". | KEEP — FINAL |

Final video spend: 4 × 6,827 = 27,308. Project total ≈ 36k (under the 45k cap).
| ~00:08 Sep 15 | PUBLISHED | — | title "Twelve Glasses"; description "He goes back to work every dawn. From one glass of tea at a roadside stall to twelve poured for his own brigade — one bandana, five kitchens, twenty years. No words needed."; tags incl. back-to-work-jam / september-2026-jam | — | https://w.run/s/UvNAAno → run.world/catalog/game/5u4uBHrkmLc8bG0OOaS9 (RUN.tv). Public visibility + jam listing: user to confirm. | LIVE |
