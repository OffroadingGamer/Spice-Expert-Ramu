# 01 Tool Notes — Story/Video Studio, as observed

Status key: ✅ observed in a screenshot · ❓ unknown, need a screenshot · 🧠 inferred, unverified

## The big finding (19:25) — this is a scripted visual novel, not a video generator ✅

Source: the "Writing chapters in Ink" reference page (26 screenshots, 19:25). A chapter is a **text script in Ink** (Inkle's narrative language: scenes = knots, diverts, choices, gathers, variables) and the studio adds `@DIRECTIVE` lines for everything seen and heard. The player renders it as a **portrait-stage** visual novel: background art, character portrait sprites left/right, a dialogue box with typewriter text, choices as buttons, floating toasts, optional phone-chat mode. **Autoplay exists** ("Autoplay stops at a hold=tap card the way it stops at a choice") — that is the "video".

Consequences for this entry:

- **No render step, no per-shot generation gamble.** The script is plain text; it compiles instantly. Wall-clock risk moves entirely to *art assets* (portraits, backgrounds, items) and whatever they cost.
- **Duration is authored, not generated.** We control pacing with typewriter speed, `@CARD hold=`, `@PAN duration=`, `@FADE duration=`. A 60–90 s piece is roughly 20–30 short lines plus a few cards and pans (🧠 typewriter speed unknown — measure in the test).
- **Consistency across shots is solved by the tool.** One portrait set per character, one image per location — the same art is reused everywhere. "Consistency by repetition" in prompts now applies only to generating each character's *emotion set* and each location.
- **Credits go to assets**, 🧠 probably per generated image: character portraits (× emotions), locations, items, icons. Cost per image ❓ — the single most important unknown left.
- **Text is silent.** No voice/TTS seen anywhere in the reference. Narration is italic text; `# vo` and `(…)` only mark a line as thought. Audio = looping music bed + one-shot SFX + ambience loops, all picked from the Music / SFX insert pickers (catalog). Whether own music can be generated/uploaded ❓.
- For a judged, video-like entry: **linear or near-linear, no `hold=tap`, no choices** (both stop autoplay). One choice would be defensible as a "story" beat but it's a tap the judge must make — keep zero unless the pick argues for it.
- "Choices catalog assets" = RUN's licensed catalog of backgrounds, music and sound (the Choices visual-novel library — catalog backgrounds "put the subject hard left or right"). RUN-provided, so jam-safe to use. 🧠 Unlikely to contain an Indian kitchen; generated locations more likely for Ramu.

## CORRECTION (19:32) — there are TWO tools ✅

- **Story Studio** = the "Create a series" form + the Ink scripting reference above. Scripted visual novel, autoplay. Everything in "The script format" section applies to it only.
- **Video Studio ("Viddy Go", BETA)** = a separate app: "What video will you create? … turn a simple idea into a complete episode. Describe your idea and we'll help you turn it into a great show." Projects → New show. Free-text idea box (placeholder: "A detective walks through a neon city in the rain while drones fly overhead…") with a "+" attach button (🧠 reference images); six inspiration cards (Detective Mystery, Romance Story, Action Thriller, Fantasy Adventure, Sci-Fi Journey, Surprise Me — all photoreal-painterly); **Continue →**. Header: credit balance **144k** ✅, "Import world" (🧠 pulls a Story Studio world — characters/locations — into a video), Discord link. Footer: "Your ideas are private and secured end-to-end."
- The track accepts either. Video Studio is the real video generator and the one the user is in now — so the cost/duration/render/publish unknowns are all back on the table for it. Story Studio is the fallback if Video Studio turns out too slow or too expensive: its cost is art-only and its script is instant.
- Test pitch given at 19:32 is concept A (Ramu) so that a successful test is not thrown away.

## Video Studio flow ✅ (19:40) — 7 steps, balance unchanged at 144k through step 2

| Step | Screen | Observed |
|---|---|---|
| 1 | Idea | Free-text pitch → Continue → modal **"Portrait or landscape?"** — Portrait 9:16 "phones, short-form" / Landscape 16:9 "film, wide screens". "This applies to every shot in the project. **This can't be changed once your project is created.**" User picked Landscape for the test. |
| 2 | Show Overview | "The show bible in one place: title, genre, synopsis, cast, and locations, all drafted from your idea. This is the foundation every episode reuses, so it is worth getting right before you generate art." Drafted for us: title **The Last Ticket**, genre Drama, synopsis (good — see below), 1 character (Ramu, Protagonist, with a physical description), 2 locations (The Line, Kaveri Kitchen; The Pass, Kaveri Kitchen). Pencil-edit inline, add/remove cast & locations, or reshape via the AI Assistant chat. "Big rewrites warn you first if they cascade into cast or art." Removing a character doesn't rewrite prose that names them — "Update prompts on the notice banner strips the name, **free, without rendering anything**" → so rendering is the paid part. Auto-saves. Continue to Style → |
| 3 | Style | ❓ next |
| 4–7 | ❓ | 🧠 portraits/locations art → script/shots → generate/render → publish. A **Notify** button in the header suggests generation is long-running and async. |

Balance shows rounded (144k) — the exact figure is needed to detect sub-1k costs; ask user to hover/click it.

Drafted synopsis (keep): "On his first night back after the restaurant nearly closed, line cook Ramu battles an unrelenting order rail alone, refusing to let a single ticket die. As the rush ends, he wipes down the pass and pins tomorrow's first ticket, bracing to do it all again."
Drafted Ramu: "A wiry Indian man in his early thirties with a lean, hard-worked build and medium height, his face marked by a strong jaw, deep…" (truncated — need the full text at the art step; must add bandana, greyed chef's whites, sweat).

Orientation decision (open): project is Landscape. Cost so far 0, so recreating as Portrait is free *now* and expensive after art. See question batch 19:40.

## Screen 1 — "Create a series" (STORY STUDIO) ✅ (19:12)

- Header: "A series holds your chapters and the chat that builds them. Fill form drafts the rest from your pitch — edit anything before you create."
- Fields: one-line pitch (Surprise me / Fill form from pitch — 🧠 LLM call, cost ❓); Name; Genre dropdown; Setting = world name + world description ("Its characters and locations live here" — the World holds Locations, Items, Icons, Characters); ☐ Also browse Choices catalog assets ("Keeps your art style. Add catalog backgrounds, music, and sound later."); Art style — Illustrated · Anime · Comic · Stylized · Realistic · 3D Render · Upload your own, each with an editable descriptor string ("Anchors the look of every character and location in this series").
- Illustrated descriptor: "polished digital painting, semi-realistic idealized features, softly blended skin shading, crisp defined contours with no heavy outlines, painted hair strands, richly rendered fabric and ornament detail, glossy specular highlights, smooth color transitions, softly defocused background depth, high detail".
- No cost shown on the form ❓.
- 🧠 Ramu's game look ("clean stylized cartoon, bold silhouette, high contrast") → **Comic** or **3D Render** preset with an edited descriptor, or **Upload your own** from the RUN-generated ad squares. Decide in Phase 2.

## The script format — what we will actually use ✅

Structure
- First line `-> start`; scenes `=== name ===` (letters/numbers/underscores); every path ends in `-> END` (or diverts). Unknown divert = the #1 compile error.
- `Name (emotion): line` = dialogue; emotions exactly `normal|happy|sad|angry|shocked` (omit for normal). A line with no `Name:` = italic narration. Narration containing an early colon → prefix `Narrator:`.
- `Name (emotion): (whole line in parentheses)` = thought. `// comment` ignored (so never put a URL in a directive).
- Speaking a character puts them on stage automatically; `@CHARACTER_UPDATE: id="Name", side=left|right` to control the side, placed at the entrance not the top of the scene; `@HIDE_CHARACTER: id="Name"` on departure. Cast is declared in the series sidebar, must have portrait art, name must match exactly.
- `@PRIMARY_CHARACTER: id="Name"` sets the player-side role.

Stage
- `@SCENE_UPDATE: background="Location Name"` — locations by NAME, quoted if multi-word. Options: `music="Cue"`, `musicFade=`, `lighting=` (a hint), `align=left|right|center` (which side of a wide image the portrait crop keeps), `transition=fade|fadewhite|crossfade`, `duration=` (default 1). `backgroundColor=CLR_BLACK|CLR_WHITE|CLR_RED|#rrggbb` for a flat colour.
- `@PAN: to=left|right|center, duration=2 (max 10), ease=` — story waits for it; must come AFTER the `@SCENE_UPDATE`; needs an anchored wide image to have room. `@SCENE_UPDATE: align=right, glide=1.5` = same thing in side terms.
- `@CARD: title="…" (≤60), subtitle="…" (≤90), position=center|top|bottom, background="Location", backgroundColor=, hold=2.5 (max 30, min ~1.5 for legibility; tap stops autoplay), transition=, duration=` — full-screen title card, dialogue box hidden. Set the background on the card itself. A card that changes background clears characters.
- `@DIALOGUE_BOX: position=top|bottom|hidden, once=true` — hide the box for a clean visual beat (`once=true` so it comes back).
- `@FADE: direction=out|in, color=black|white, duration=` (cap 10) — always pair out with in.
- `@EFFECT: shake|flash|heartbeat`, optionally `target="Name"`. Inline: `<shake target="portrait"/>`, `<jiggle>…</jiggle>`.
- `@ITEM: id="Item Name"` / `@ITEM_HIDE` — a prop drawn large over the scene (needs a portrait; one at a time; never auto-cleared).
- `@HAPTIC: id=light|medium|heavy|success|warning|error`.

Audio
- `@MUSIC: play="Cue", fade=1.5` (loop) · `loop=false` for a once-through sting · `@MUSIC_STOP: fade=`.
- `@SFX: play="Clip"` one-shot · `@SFX: play="Rain", loop=true, id=rain` ambience · `@SFX_STOP: id=rain, fade=1`.
- Names must match the Music / SFX pickers exactly — insert them from the editor, don't type from memory.

Text
- `<i>`, `<b>`, `<red>`/`<salmon>`/`<aqua>`, `<br/>`, `<slow/>…<normal/>` typewriter speed, `<pause/>` mid-line beat.
- Toasts: `@MAJOR_TOAST: title="…", text="…"`, `@MINOR_TOAST: text="…"`.

Things that bite
- Multi-word directive values MUST be double-quoted or only the first word registers.
- Inline conditionals `{a: b|c}` on ONE line. Never `VAR playerName`.
- A misspelt directive is not an error — it prints to the reader as prose. Pre-publish checks catch the common ones.
- Backgrounds are wide art on a portrait stage: the middle survives, edges are cropped. Anchor with `align=`.
- Choices, `hold=tap` cards and `@INPUT` stop autoplay.
- Chapters can also be built through a **chat** and the editor has an **Insert helper…** dropdown that writes directives with real asset names filled in — I'll write the script; the user pastes it and fixes names via the picker.

## Still to establish ❓

| Item | Status |
|---|---|
| Cost to create a series; cost of "Fill form from pitch" | ❓ |
| **Cost per generated image** (character portrait set, location, item) — and whether one portrait generation gives all five emotions | ❓ critical |
| Whether locations/characters can be generated from a text prompt with the series style, and how long one takes | ❓ |
| Chapter count/length limits | ❓ (🧠 none visible; one chapter is probably enough) |
| Typewriter speed / autoplay pacing → seconds per line | ❓ measure in test |
| Music/SFX: catalog only, or generate/upload own? Cost? | ❓ |
| Publish: public vs private, review queue, latency; edit/unpublish after; jam association | ❓ |
| Balance display in the Studio | ❓ |

## Credits

Budget cap: _not yet asked — waiting on cost per image._

## Log

- 19:12 — Create-a-series screenshot. Asked for a test series.
- 19:25 — Ink reference (26 screenshots). Rewrote this file: the tool is a scripted visual novel with autoplay; risk moves to art assets.
- 19:32 — Video Studio landing screenshot: a separate tool. Balance 144k. Gave the user the concept-A test pitch.
- 19:40 — Steps 1–2 of Video Studio seen. Balance 144k unchanged. Orientation locked per project. Asked orientation + concept pick + exact balance.
- 20:02 — Portrait project "Twelve Glasses" created from the expanded pitch (step 2 reached). Balance reads **193.8k** (was 144k) — unexplained ~+50k; asked user. Bible drafted 3 characters (2 supporting — cutting) and 5 locations; "Grand Meridian" renamed (real chain). Fixes sent via AI Assistant. Landscape "The Last Ticket" abandoned at zero spend.
- 20:06 — Step-2 AI Assistant (1000-char input) stages edits as a yellow "N changes ready to apply" diff with Apply all / Discard all — free (balance unchanged), reversible. Applied: cast → Ramu Prasad only; hotel renamed "The Grand Hotel Kitchen, Delhi"; trattoria → "City Trattoria Kitchen"; Ramu description replaced.
- 20:12 — Step 3 Style: 22 presets (Cinematic, Natural Realism, Vintage, Black and White, Comic, Digital Illustration ×2, Painterly Art, Storybook Illustration, Modern Anime, Cel-Shaded, 3D Anime, Cyberpunk, Fantasy, Sci-Fi, Gothic Horror, 3D Render, CGI, Claymation, Animal People, Cat People, Fruit People) + "Upload your own Style image". Picked **Cinematic** (photoreal, low-key, shallow DOF; skews cool — counter with warm-light prompt words). Ad squares NOT uploaded (cartoon would pull away from photoreal). Balance 193.8k. Step 4 = Episode Overview.
- 20:16 — Step 4 Summary: episode summary + 3-beat structure, pencil-editable, AI assistant. Balance 193.8k → **193.7k**: drafting the summary cost ~100 credits (first spend). Step 5 = Characters (🧠 portrait generation, first real cost).
- 20:20 — Summary edited (pencil → textarea, 1200-char cap, Cmd-Enter saves). Step 5 Characters: card per character, "NEEDS ART — Planned but never generated — generate the missing art to continue. **This uses your generation quota.**" (quota ≠ credits? ❓). **Voice: Assign / Assign No Voice per character** → TTS exists ✅. Header now shows a **Library** ("Every asset generated for your show appears here. You can also upload your own images or generate new ones with AI"). Balance 193.7k.
- 20:26 — Characters "About" page: **backend = Seedance (video) + ElevenLabs (voices)** ✅. Character portrait = locked reference attached to every storyboard/shot ("a name in the prompt is not the same as a reference image attached" — check the shot's References block). Editor fields: Name, Role, Gender, Personality (drives speech/voice; 0/200), Visual description (drives look + continuity; 0/500), Upload character image (no generation spent; then "Use AI to fill in character details"), Revert last upload, Regenerate (re-rolls from prompt). Voice: Browse (audition = exact clone sample) / Auto-assign; an unvoiced character still speaks — Seedance invents a voice per render, so assign one for consistency. Extras/props/set dressing go in the world asset library and attach to shots as references. The image provider's moderation filter can flag ordinary portraits, can't be disabled. Renaming cascades to text but not to already-generated art.
- 20:30 — Voice picker: Library (734 voices, search + category filters, audition play, Auto-assign) / Design / Upload tabs; "Use no voice". Indian male options: Aashish (corporate), Manav (husky, conversational), Parveen (stories, relaxing). Recommended Manav, fallback Parveen.
- 20:42 — User recorded Manav's sample to "References and Logs/Recording 2026-09-14 204047.mp4" (I can't play audio; user judges). Parveen turned out Hindi-spoken; sample player sometimes fails to play. Decision: Manav. Still no art generated — behind schedule; portrait next.
- 20:50 — Portrait generated with **Nano Banana Pro** (dropdown: Nano Banana 2 / Nano Banana Pro / GPT Image 2; Pro = "Highest Gemini fidelity, honors 2K/4K output"). Cost **~200 credits** (193.7k→193.5k). Output is a turnaround sheet (front/profile/back + 2 close-ups), ~1 min. Image cost is negligible; video cost still unknown.
- 21:02 — Locations: editor = name, visual description (500 cap, "Enhance with AI", "Use AI to fill in location details"), image model (defaults **Nano Banana 2**, "fast and inexpensive — hi-res renders upgrade to Pro"), Upload location image, Regenerate. ~120 credits each, ~1 min. Location subtitle auto-derived (e.g. "roadside tea stall, small town, early morning"). Next step = **Props** (then Scenes). Balance 192.9k.
- 21:24 — **Style Check** step: "Your show's master style image. Every storyboard is generated against it as a style reference." Generate from cast + style / Edit Prompt / Upload style check image; archive keeps previous versions (revert). Balance 190.8k. Flow so far: Idea → Show Overview → Style → Summary → Characters → Locations → Props → Style Check → Scenes (the "step N/7" badge is inaccurate).
- 21:28 — Style Check editor: it's a **production bible board** (16:9 lookbook: full-body character panels on a shared ground line, one establishing frame per location, three story stills, no text) generated by Gemini (Nano Banana) with up to **9 reference assets** (slot 1 = locked style anchor); 2299-char default prompt, editable; "Additional details" = one-shot steering, or "Refine prompt" folds it into the prompt. Default model Nano Banana 2 → switched to Pro. Added 4 more assets.
- 21:48 — **Storyboard Review** (Step 5/7): episode = scenes (default 3: Hook / Development / Payoff, from the 3 beats; add/remove freely, **ceiling = 2-minute episode runtime**). Each scene = one **six-panel storyboard sheet** (3×2) — "the sheet is what the video model animates". **120 credits per sheet** (NB2 default; Pro selectable). Editor: Scene Context (also goes to the video prompt), Composition Prompt (numbered panel lines, free to edit, "say what a camera could photograph"), References (defaults: character + first location + Style Check — must be fixed per scene), AI assistant (rewrites panels, can swap refs), Advanced Prompting (write the whole prompt + pick refs), archive of takes. Then "Continue to Videos" → shots page; "nothing renders there until you ask". Balance 186,606 (exact number shown in the banner).
- 22:12 — **Video Shots** (Step 6/7): one shot per scene (3), **6,827 credits per shot, 20,481 for all**, "expect about 6–7 minutes per clip", rendered one at a time in order, "each one uses the last frame of the previous shot as a reference". Runtime counter **0:45 / 2:00** → 15 s per shot. Click a tile to write its prompt and attach references. Footer: Create soundtrack · Download all · View Episode Ready →. Balance 185,233 (spent ≈ 8.5k so far).
- 22:22 — Shot editor: Motion Prompt (auto-drafted: style header + [Scene] + Shot 1–3 from panels 1–3 ONLY + [Audio] line; editable; "Reset to AI version"); Advanced Prompting; Edit-with-AI + Refine; **Video model**: Seedance 2.0 Fast (default, 6,827 for 15 s) · Seedance 2.5 · Wan 2.1 · Wan 3.0 · Minimax H3 (Hailuo) — prices/times of the others not checked; **Length slider 5–15 s**; Assets shipped to video gen (refs + "Scene storyboard"; "Update Prompt" tile weaves an unmentioned asset in); **Voice slots @audio1–3 (free)**, "Add speaker → Shot N +" inserts a speaker into that sub-shot; Generation history. Auto style header is teal/blue-hour — replaced. **Credit cap set by user: 45,000 total.**
- 22:35 — "Add speaker → Shot N +" = the Nth *sub-shot inside this clip*, not the Nth tile. It opens a popup (Speaker dropdown "Ramu Prasad · claims @audio1", LINE, Preview, Save) and appends `RAMU PRASAD @audio1 says: "…"` to that sub-shot's line; the voice slot then shows "@audio1 → Ramu Prasad". The "Update Prompt with AI" banner about unmentioned assets is advisory, not a gate.
- 22:52 — Installed `imageio-ffmpeg` (user approved) so frames can be extracted from downloaded clips: ffmpeg at `C:\Users\RR Builders\AppData\Local\Programs\Python\Python311\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe`. Audio still can't be judged by the agent.
- 23:33 — **Episode soundtrack** overlay: "Preview the cut · add background music · 3 scenes · ~45s total · **ElevenLabs Music**". Text brief → Generate (instrumental only, trimmed to episode length), or Upload own track, or Close to skip. Preview plays the scenes back-to-back with the music. Approve soundtrack to attach.
- 00:00 Sep 15 — **Episode Ready** (Step 7/7): Show title · Keyword tags (0/30; hint "summer-jam, comedy" → tags likely = jam association) · Series description (185 cap, auto-drafted, "shown on your show's page on RUN.tv", Refresh) · Cover (Edit cover / Generate cover; "Not generated") · Final episode preview 9:16 (compiles: "Concatenating scenes + mixing soundtrack"; Recompile / Upload Final / Revert) · footer: Lock episode · Download · **Publish to RunTV**. Balance 184.8k.
