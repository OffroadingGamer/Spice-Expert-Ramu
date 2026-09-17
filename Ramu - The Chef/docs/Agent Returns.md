# Agent Returns — verbatim ledger

Every agent's return handover, as pasted by the user, unedited. Agents are compacted after each
task, so this file is the only durable copy of their own words. Central's verification of each
return lives in `Implementation Handover Record.md` under the matching dated entry; this file
never carries Central's commentary beyond the header line.

Started Sep 18 2026. Returns before Round 10 (Rounds 0–9, art rounds 1–2, audio rounds 1–4,
marketing) predate the ledger and exist only as summaries in the record.

Format: `## <date> — <round> — <agent>` · outcome line · the return, verbatim.

---

## 2026-09-17 ~22:10 IST — Round 10 — implementation agent

Outcome: verified, Private 1.82.0, committed `6d7779f`.

Round 10 — deployed as v1.82.0 (Private). Review/Public unchanged at 1.69.0.
Part 1 — Heat gauge
Segmented tube at x12–52/y470–1270, 10 segments (28×70, gap 10, margin split 5/5), cream 12%/35%-stroke tube, orange→red gradient fill, flame cap (procedural, chocolate circle + orange stroke + hand-drawn bezier flame). Verified with real pixel sampling at 403×874 and 768×1024:

Resting states (Retro 110): untriggered segment (level 1), settled-after-fill segment (level 7), and settled-after-drain segment (level 11) each sampled twice 500ms apart — all three matched exactly, pixel-for-pixel.
Breathing (level 10 build, 9 filled): segment 9 sampled 600ms apart — genuinely differs (confirmed real alpha oscillation, not a static frame). One judgment call: the spec's own formula ("filled = (level−1)%10") only reaches 9 at level 10's build, not level 9's (8/10) — the acceptance list's "9 (breathing)" is read as "the moment rush 9 finishes," i.e. level 10 build. Flagged, not silently assumed.
Boss on belt (level 10, wave running): tube forces full, cap swaps to the block's stag sprite. Caught and fixed a real bug here — my first pass sized the boss sprite smaller than the flame it replaces, rendering as a nearly-invisible speck; also caught that swapping the flame's whole cap graphic (not just the flame glyph) briefly meant "boss on belt" showed no backing circle at all. Restructured into a persistent circle + a toggled flame-vs-boss-sprite content layer, fixed the size, verified visually.
Overtime: always full, flame only, never breathes — this is a hard boolean short-circuit (bossOnBelt can't be true when inOvertime is true), so it holds even at Overtime's own boss levels (e.g. 100) by construction, not by testing every case.
Drain (300ms, block boundary): mid-drain and settled frames both captured and differ correctly.
Label "n/10" at 32 design-unit font ≈ 12.3px at 403 wide (measured via stage.ts's real fit math, comfortably over the 11px floor). Zero overlap with road/pads/hatches — visually confirmed.
Part 2 — Four FTUE beats
Wired via a new queueDialogueOnce (persists a seen-flag in save data, separate from the existing every-run beats). Live-tested fresh-save sequence, in order: name dialog → opening → recipe-widget → prop-placement → stove-lit → heat-gauge-intro → wave1-cleared → upgrade0 (DOM cue, confirmed still fires). Confirmed via a second boot on the same save that recipe-widget/prop-placement do not repeat.

Part 3 — Name dialog at boot
Moved from Start-shift to main.tsx step 6, paused via the real store.paused (verified it actually stops the Pixi ticker), name dialog visually layers over the already-armed opening beat via DOM order. Verified: dialog blocks first, Skip assigns a two-word name and unpauses, opening reveals immediately after.

Part 4 — Pad pulse removed
applyPostWavePulse() deleted outright (not gated); pulsePads removed from the store and every call site. grep -rn pulse src → 24 hits, all either historical comments explaining the removal or genuinely unrelated (animate-pulse lives-chip, ready-pulse Ready button). Live-verified: wave clears now render no glow, and FTUE place2/place3 still auto-select their target pad (place2 → pad 3, confirmed) with only the pulse visuals gone.

Part 5/7 — Settings & pause card (look A)
Built a shared SettingsCard.tsx shell (scrim/card/title/divider/credit/ghost-button) used by both. Native <input type=range> re-skinned via CSS custom properties (app.css's .slider-cream), mu-scaled. Measured at 360×780: card exactly 300px (200×mu), slider touch height exactly 44px, every label ≥11px (floor at 12.00px). Caught and fixed a real bug: the shared scrim was missing pointer-events-auto, so inside Hud's pointer-events-none root the pause card's scrim tap silently did nothing — fixed, then verified Continue actually resumes.

Part 6 — Rename
Guest flow (bubble/Name row → prefilled card → Save/Cancel → resubmit) verified locally: opens, saves, cancels correctly; RUN-account variant shows plain name, no pencil, not tappable. resubmitBestWithName reads the server's own current-best via getPodiumScores, resubmits the same score/duration with new metadata.displayName only — never a new score — spaced by a real, documented 5s (rundot/leaderboard.config.json's minTimeBetweenSubmissionsSec: 5, not a guess).

I could not complete the live production test ("score 106 on waves, resubmit, read metadata before/after") — every local/dev path (playground key included) resolves to a mock identity and an empty sandbox board, not the real leaderboard your 106 score lives on. That specific check needs the real RUN host session and is outside what I can drive headlessly. Flagging rather than faking a result.

Build health
tsc --noEmit clean · npm run build clean · npm run balance → 35/36/11/4/90, byte-identical · no .png.json sidecars · sealed files, kitchenScene.ts, package.json/package-lock.json all untouched (confirmed via git status) · playground key revoked after use.

No git commits made, per boundaries. Two real bugs were caught and fixed during testing (boss-cap sizing, scrim pointer-events) — both before deploy, not after.

---

## 2026-09-18 ~00:05 IST — Round 11 — implementation agent

Outcome: verified, Private 1.83.0, committed `053cbcf`.

Clean, exactly the intended file set. Now composing the final report.

Round 11 — deployed as v1.83.0 (Private). Review/Public unchanged at 1.69.0.
Part 1 — Playtest fixes of 1.82.0
1.1 — Recipe-widget bubble visibility (WaveBubble.tsx: baseVisible now only blocks on dialogue when dialogue.id !== 'recipe-widget'; showSubmenu still hard-requires dialogue === null so the scroll grid itself can never pop over the beat). Verified live at 360×874 and 403×874: bubble stays visible during that one beat, still hides during every other beat (checked stove-lit).

1.2 — Em dashes removed from heat-gauge-intro and recipe-widget in dialogue.ts. Grepped the whole file's lines: arrays for any other em dash — none found; nothing else changed.

1.3 — Heat gauge re-centered (towerScene.ts): tube/cap/label now compute gaugeCenterX() from the live stage.root.x/stage.scale() (the same offsetX/scale getFit() itself sets), recomputed on every stage.onResize. One correction to the handover's own formula: it wrote "belt's leftmost edge = 170 − SZ.pathWidth/2" but that arithmetic gives 134, not the 127 every one of its own worked numbers (centre 63.5, tube 43–84, ≈118px at 744×1315) was built from. 127 = 170 − (SZ.pathWidth+14)/2 — the same capRadius this file already derives for the belt's own drawn outer edge (edge-stroke included). Used that formula. Verified by pixel-sampling the cap's actual rendered position against the formula's prediction at four sizes:

744×1315: expected 118.5px, measured 118.0px
403×874: expected 55.9px, measured 56.0px
360×780: expected 50.0px, measured 49.5px
768×1024: expected 139.5px, measured 139.0px
Resize (403×874 → 768×1024, same live page, no reload): cap visibly moved 83px, confirming it's reactive, not baked in at boot.
1.4 — Block-clear card ×1.15 (PostBossPanel.tsx): every dimension arbitrary-valued to the spec's exact numbers. Measured live at 360×780, level 81 (10 dishes): card width 336px (=w-full inside the 12px gutters, since 32.2rem exceeds phone width), title 23px, body 17.5px, eyebrow 12.5px, icons 55px, names 11.4px, Ready padding 18px/font 23px — all exact. Ten dishes wrapped to 3 rows, no clipping (spec asked for ≤2 rows minimum; 3 is comfortably safe at this width).

1.5 — Order scroll readability: icons 56→64px, name/count moved off rem onto explicit px (11px/12px floors) in both the trigger and the submenu grid — confirmed via computed-style measurement, nothing under 11px. This surfaced a real layout bug: at 360px wide with 3 simultaneous dishes (level 81), the bigger icons made the trigger overlap the speed buttons by a measured -23.8px — and diagnosis showed the WAVE chip + ring/head box alone already consume nearly the row's full width at 360px, so no amount of shrinking the bubble alone could fix it. Fixed by flattening row 2 into one flex-wrap row (WAVE chip, ring/head, bubble, speed buttons as ordinary flow siblings, ml-auto on the speed row) instead of two rigid boxes — whatever doesn't fit wraps to its own line instead of overlapping, by construction. Re-verified: zero rectangle intersection at 360×780 and 403×874 (worst case: bubble/speed end up on separate lines with a real 8px gap), and the row still renders single-line at typical viewports with fewer dishes.

1.6 — Card alpha 0.9: SettingsCard.tsx's shared Card background → rgba(253,250,231,0.90). Confirmed identical on all three consumers: Settings, the pause card, and the rename dialog.

Part 2 — Ranks: service board + daily period
2.1 — Config: captured both all-time boards (50 rows each) before touching anything. Added "daily": {"displayName":"Today","type":"daily"} to rundot/leaderboard.config.json, additive only. Deployed. Re-read both all-time boards after — byte-identical, confirmed via diff. New instances: PpB5gECS0AMU49mGYAKM_waves_daily and PpB5gECS0AMU49mGYAKM_kills_daily — both queryable (return empty, as expected for a fresh daily board) via rundot leaderboard scores. One quirk worth flagging: rundot leaderboard config's own config dump still echoes the old alltime-only JSON even after this deploy — the instances work regardless, so this looks like that command reading a cached/published copy rather than Private's newly-deployed one; doesn't block anything, but worth knowing before trusting that command's output specifically.

2.2 — Submission path: I could not empirically test "does an omitted period land in both boards" — every attempt to submit through this local/headless environment (same limitation as Round 10's live-leaderboard finding) resolves against a mock, seemingly write-inert sandbox: reads always return an empty board regardless of what's submitted, with no errors surfacing either way. Given that, I shipped the verifiably-safe path: explicit submission per period (2 modes × 2 periods = up to 4 calls per run end), justified by the SDK's own SubmitScoreResult carrying a single periodInstance (never a list) — the type shape says one call resolves to one instance, and gambling on undocumented fan-out behavior risked shipping a daily board that silently never fills. All four calls share the existing module-scope 5s-spaced queue, so the tail survives leaving the end screen. resubmitBestWithName now covers all four (mode, period) pairs the same way. Please treat "period omitted lands in both" as unverified, not confirmed-false — it's simply untested from here.

2.3/2.4 — The board (Leaderboard.tsx, full rebuild): chocolate ground, RANKS header, Today/All-time pills (Today opens first, not persisted), underlined "Rushes held · Pests cleared" tabs (mode keys unchanged), top-3 podium (62mu wide, 78/66/58mu heights, #1 orange-filled) falling back to plain rows under 3 entries, sticky ≥44px orange bar with rank/score/gap-to-next/reset-countdown text, per-(mode,period) session cache, and a daily-fetch failure that shows its own message rather than ever falling back to alltime data. Verified live against this environment's real (though empty) SDK responses — confirmed: the offline/loading/ready state machine works, "No shift yet today — start one" appears and correctly starts a shift (or opens the name dialog first for a nameless guest), "Unranked · play a shift" is correctly non-tappable on the All-time tab, every text element measured ≥11px, bar height 59px. What I could not verify: podium rendering, row highlighting, and the actual rank/gap/countdown numbers against non-empty data — this sandbox never returns real entries, so those paths are verified by code/arithmetic review only (I hand-checked the gap-to-rank-above and UTC-midnight countdown formulas), not by seeing them render with real numbers.

Build health
tsc --noEmit clean · npm run build clean · npm run balance → 35/36/11/4/90, byte-identical · no sidecar JSONs · sealed files, kitchenScene.ts, package.json/package-lock.json all untouched (git status shows exactly 9 files: the ones listed above, no new files this round) · rundot whoami → offroadinggamedev@gmail.com.

Deploy
Private → v1.83.0. Review/Public confirmed unchanged at 1.69.0. No git commits, no set-public/set-private/update-tag, no leaderboard remove/reset/ban.

---

## 2026-09-18 ~02:30 IST — Art round 3 — art agent

Outcome: accepted, no retake; `Art/_gen/ranks-kitchen-final/`; credits 98,805 → 98,209 (incl. audio).

Done — laurel, recipe scroll, shard.

Files: Art/_gen/ranks-kitchen-final/laurel.png, recipe-scroll.png, shard.png, plus contact-sheet-64px.png and contact-sheet-18px.png.

Credits: 98,805 → 98,212 = 593 (4 generate calls summed to 588; a 5-credit gap opened up between calls 2 and 3 that the call-level numbers don't explain — likely other concurrent account activity, same pattern the pass-round log already flagged. Using the actual before/after balance, not the summed calls, as the spend figure.) Well under the 882-credit budget — only 1 of the 3 allotted retakes used.

What I rejected and why: laurel take1 — dense paired leaflets that collapsed into a fuzzy brown-gold blob at 22px, no wreath visible. Retook with ~5 large single-blade leaves per side and no inner detail; take2 reads as an open ring with visible leaf segmentation at 22px. Scroll and shard both passed on the first take, no retake spent.

Nothing from the handover's operating facts turned out wrong this round — 147-credit exact cost, sibling jam-entry, and no manifest naming conflicts all checked out as stated.

One open call for you: the 18px contact sheet shows all three are still distinguishable by color/silhouette (gold ring / cream+red-dot rectangle / orange blob), but individual leaf shapes and the scroll's wax-seal detail are gone at that size — expected at 14-18px, just flagging it's a silhouette-level read, not a detail-level one. If you want more margin at the smallest size, laurel is the one I'd take another pass at.

---

## 2026-09-18 ~02:55 IST — Audio round 5 — audio agent (thread 561638a3)

Outcome: delivered, measured, unheard — pending the user's listen; Retro 112 (the 90-credit figure was Central's error).

Both files generated, measured, and delivered. All boundaries verified — no git actions taken beyond read-only checks, nothing landed in public/, no src/ edits (the jam-entry/src/ changes showing in git status are the concurrent implementation agent's work, untouched by me).

Audio round 5 — two stings, report
Cost note (flag first): the handover's "expected 90 exact, fixed" didn't hold. rundot generate estimate sfx scales linearly with --duration (≈3 credits/sec) — 90 only appears at 30s or when --duration is omitted. At this round's actual lengths it was 5 and 3 credits. Not a blocker (nowhere near the 540 ceiling either way), just don't reuse "90" for future short-SFX rounds.

Cue 1 — sfx-scroll-unlock (1.2–1.8s target)

Prompt: paper unrolling → bright two-note lift on kitchen metal, ends on A/E.
Measured: 1.480s, 44.1kHz stereo, peak -0.21dBFS, RMS -25.0dBFS, 0 clipped samples, correlation +0.689 (no mono risk), tail decays cleanly to -48.2dBFS.
Cost: estimate 5, actual 5, balance after 98,653.
One take, passed on duration/clipping/tail — kept, no retake needed.
Cue 2 — sfx-continue (0.8–1.2s target)

Prompt: stove re-light whump → rising three-note motif in A minor, ends on A.
Measured: 1.000s, 44.1kHz stereo, peak -5.91dBFS, RMS -38.8dBFS, 0 clipped samples, correlation +0.998, tail decays to -55.8dBFS.
Cost: estimate 3, actual 3, balance after 98,209.
First attempt hit the usual 300s rate limit (confirmed no charge), succeeded on retry. One take, passed all checks — kept.
Delivered (masters, unedited, no normalization needed):

Audio/_gen/sfx-final/sfx-scroll-unlock.mp3
Audio/_gen/sfx-final/sfx-continue.mp3
Take-numbered candidates + CLI sidecars remain in Audio/_gen/sfx/ (sidecars didn't travel, per instruction).
I have not listened to either file — durations, peaks, clipping, and correlation are all I can verify; whether they sound right (paper/bell character, whump/motif character, resolving on the intended pitch) is your call. Logged in docs/AudioGenPrompts.md. No git, nothing touched outside the SFX dirs and that doc.

---

## 2026-09-18 ~03:20 IST — Localisation inventory — localisation agent

Outcome: accepted; `docs/i18n/strings.md` committed `933e318`; four R13 constraints recorded.

Done. One new file, nothing else touched, no git.

Written for: Central (R13 table build) and the user as Hindi reviewer.

Output: docs/i18n/strings.md

Count: 299 rows inventoried. 245 in the live game (30 format-only, 8 screen-reader, 6 host-rendered, 5 defined-but-never-shown enemy names, 60 interpolated, 10 needing plural forms); 54 more in Test Mode (?test=1, sectioned off so R13 can skip them). Net translatable in the live game: 209, ≈200 after collapsing repeated literals (Cancel ×5, Main Menu ×3, etc.). Counts were re-derived from the written rows with grep, not carried from my head; three of my first tallies were wrong and got corrected.

Ten least-sure strings are listed at the end of the doc. Headline ones: Escapes left (coined term, one-line-at-360px constraint), shift float (till jargon → गल्ला), Welcome, {name} (formality), all Cancel → रहने दो (voice over form-Hindi), Stock Pot/Sauce Pot (one translated, one transliterated), Waves held vs the game's own rush, Smoked chilli (no clean Hindi smoked), Bamboo Shoot Fry (no name, 19 chars, truncates everywhere), the Italian names in Devanagari, and Lv↑ inside a Pixi pill.

Things that surfaced beyond the ask, recorded in the doc, not acted on:

Dish names are not literals anywhere. All 22 are titleCase(slug) in two call sites; the table needs dish.<slug> keys and those two sites become lookups. 31 dish aliases in the manifest, 8 never reach a block. The sealed enemies.ts names are never rendered, so no unseal is needed.
Block label → asset alias coupling: chefBodyAliasForBlock derives the costume alias from the English label. Translate by id, or the costume breaks.
Name input rejects Devanagari (NAME_PATTERN is A-Za-z .' in both dialogs).
No plural handling anywhere in the source ("1 rushes held").
Caveat on line numbers: Round 12 was editing Leaderboard.tsx, Hud.tsx, leaderboard.ts, save.ts, ChefPortrait.tsx in parallel while I read (Leaderboard.tsx went 417 → 630 lines mid-sweep). I re-read §5 and §16 against the tree as it stood at ~00:32 and said so in the header; those two sections should be re-checked once Round 12 commits. The stale pests unit I first flagged was already fixed by Round 12's edit, so it's gone from the unsure list.

---

## 2026-09-18 ~03:40 IST — Shard cadence projection — projection agent

Outcome: accepted; `docs/shard-projection.md` committed `0a41a89`; Ideas §10.4 corrected (8, not ~10).

Clean — no repo changes beyond the new doc file, no git actions taken, and the temp script/cache are gone (those other modified files are pre-existing work, untouched by me).

Wrote docs/shard-projection.md. Key findings:

Ran npm run balance and cross-referenced waves.ts/blocks.ts (read-only) to map each level's composed wave to its dishes.
Both fox-spam (lost L35) and balanced (lost L36) hit 8 shards on chai and coffee simultaneously at level 10 — block 1's boss — confirming "first scroll during run 1," pinned to an exact level for the first time.
One correction to Ideas.md §10.4: it estimated "~10 chai shards in run 1," but the measured count is 8 exactly, tied with coffee (not a chai-only lead), since block 1 pairs the two dishes 1-for-1 on every wave.
No other dish gets past 5 shards within either run's lifetime; the unshipped +2 boss-drop sweetener (applied to rajma/beans-poriyal at levels 20/30) doesn't change the first-scroll level, only pads totals to 6.
balanced diverges from fox-spam only at levels 25/34-36 (extra leaks), which cost it sambar/arrabbiata shards but don't affect the scroll-1 conclusion.

---

## 2026-09-18 ~04:05 IST — Round 12 — implementation agent

Outcome: verified, Private 1.84.0, committed `f88e0fc`; 🔴 board at half scale (BOTTOM_BAND 2400) → Round 12b.

Round 12 — deployed as v1.84.0 (Private). Review/Public unchanged at 1.69.0.
Part 1 — Fixes from the 1.83.0 playtest
1.1 — Board nouns (sdk/leaderboard.ts BOARD_LABELS, Leaderboard.tsx BAR_UNIT): "Pests cleared"→Dishes served, "Rushes held"→Waves held; mode keys kills/waves untouched everywhere else. Bar text now reads #1 all time · 6,231 dishes served / #n today · … waves held, matching the worked example (added .toLocaleString() on scores to get the comma). Grepped the file afterward for "pests"/"rushes" — none left, doc comments included.

1.2 — Portrait ×1.5 (ChefPortrait.tsx IDLE_SIZE 88→132). Measured rendered height: exactly 132px at both viewports (it's a fixed DOM size, not canvas-scaled).

1.3 — Ready above the portrait (Hud.tsx): restructured to flex-col items-center with gap: 6*mu, so centring is flex-construction, not a manual offset. This surfaced a real bug: with the portrait now 132px and Ready stacked fully above it (instead of beside it), the reserved bottom band was no longer tall enough — screenshotted at 360×780, the belt's last vertical segment ran visibly behind the Ready button. Root cause: the DOM column's required height nearly tripled (single row ~88px → stacked ~206–225px) while stage.ts's BOTTOM_BAND was still tuned for the old layout. Fixed by raising BOTTOM_BAND 460→2400 (stage.ts), verified iteratively (900 and 1400 still showed a visible overlap; 2400 is the first value that clears it, confirmed both by the hatch-coordinate math and by screenshot). Measured clearance: 360×780 (tightest): ~20px margin (Ready top 521 vs. hatch screen-y 501); 403×874: ~52px; 744×1315: comfortable throughout.
⚠️ Cost worth flagging: this is a much bigger jump than any prior BOTTOM_BAND change, and unlike Round 8 there was no cheap second lever available this round (IDLE_SIZE couldn't be traded back down — that's the explicit ask — and Ready's own size wasn't part of this round's scope). Board scale at 360×780 drops from 0.343 to 0.171, roughly half. I did not shrink Ready's own padding/font to reduce this cost since the handover didn't ask for that; flagging it here as something Round 13 may want to revisit if the smaller board reads as a problem in practice.

1.4: no action — noted as superseded by Part 2.4, podium untouched under this heading.

Part 2 — Ranks look B: the pass counter (Leaderboard.tsx, full restyle)
2.1 Ground: blurredBackdrop.ts (new) does the resize+blur+desaturate pass once, on a 480px-wide canvas copy of the shipped menu-backdrop, memoized in module scope — not a live filter: blur() re-running every frame. Result is a data: URL, no new file under public/. Confirmed rendering live in both screenshots (visible blurred/darkened backdrop behind the panel).

2.2 Header: gold, 1px chocolate drop-shadow, 0.08em letter-spacing; back button at cream 14% fill. "The game's display face" = this project's existing bold system-sans stack (it declares no custom font-family — same finding MainMenu.tsx's own doc already recorded).

2.3 The board: walnut panel, brass rim + inner dark line + shadow, inset 5mu, internal scroll; pills (gold active w/ inset shadow, cream-14%-outline inactive, ≥44px); tabs (gold underline active, 55%-opacity inactive). Verified live: header/pills/tabs stay fixed, panel scrolls, all font sizes ≥11px (checked via computed style scan — zero elements under 11px at either viewport).

2.4 Podium: brass steps (30/20/13mu) on one shared shelf, order #2·#1·#3, gold discs (40/30mu) with a radial highlight and a 🏵️ "laurel" glyph on #1 (Unicode has no dedicated laurel-wreath character; this is the closest available glyph — no new art, per this round's own constraint). Verified the "bottoms on the shelf" claim empirically with an isolated static mock reproducing the exact CSS (screenshot below/attached in my working files): all three step-bottoms measured at the identical pixel value, confirming the flex-construction guarantee holds. ⚠️ Real non-empty leaderboard data could not be exercised through the shipped code path — this local/headless environment's RUN SDK resolves a sandboxed identity with an always-empty board (same limitation Round 10/11 already documented), so the podium/row visuals with live scores are verified by this parallel static mock and by code review, not by watching the shipped component render real data.

2.5 Rows: cream order tickets, dotted tear edge 5mu in from the left, chocolate rank/name, tomato score, 4mu gaps, ≥44px height. One resolved discrepancy: the spec's own text names the own-row color "turmeric paper" but pairs it with hex #f4d68a, which is this same handover's own hex for gold (turmeric is separately defined as #d9a520). Used the named color (turmeric) rather than the mismatched hex, since gold already means "active pill/tab" elsewhere on this screen — documented inline, same posture as Round 11's gauge-formula resolution.

2.6 Bar: orange gradient #f97316→#d95a0a, chocolate text, ≥44px, tucked behind the panel's bottom edge via a small negative margin. Ran an automated scan for #f97316/rgb(249,115,22) across every rendered element outside the bar — zero hits in the states this environment could render (offline/loading/empty/pills/tabs); the podium/row components were also checked by code — none of them reference ORANGE (they use GOLD/BRASS/TOMATO/TURMERIC only).

Part 3 — Two additions
3.1 Near-you slice: bumped contextAhead/contextBehind 2→3 in fetchBoard (sdk/leaderboard.ts). The "···" divider + before/after rows already existed from Round 11's own build and needed no further change.

3.2 Rank-delta arrow: new rankMemory field in state/save.ts (additive, migration-safe like seenBeats) plus diffAndRecordRank(), which reads the last-seen rank, writes the new one, and returns the signed delta (day-aware for the daily period). Rendered on the player's own row only, right after the rank number, ▲ green / ▼ red. Live-tested the pure logic in-browser: first-visit→null, improved(+10), worse(−15), unchanged→null, daily-first→null, daily-same-day-improved(+5) — all correct. The stale-daily-day rollover branch itself (comparing against yesterday's stored rank) was not exercised live — there's no public setter to backdate a stored day without adding a test-only export I didn't want to leave in shipped code — so that path is verified by code review only, not a live run.

Build & safety
tsc --noEmit / npm run build: clean. npm run balance: 35/36/11/4/90, byte-identical. No *.json under public/. git diff --stat confirms sealed files, kitchenScene.ts, package*.json, and rundot/leaderboard.config.json all untouched — and the deploy itself printed "No server config changes detected," independent confirmation of the same thing. rundot whoami → offroadinggamedev@gmail.com before deploying.

Bug fixed on the way: the Ready/portrait stacking (Part 1.3) broke the bottom-band clearance the belt's exit hatch relies on — a real, screenshotted overlap, fixed via BOTTOM_BAND, with the resulting board-scale cost flagged above rather than hidden.

---

## Pending

- **Round 12b** (implementation agent, → 1.85.0) — issued Sep 18 ~04:20 IST, not returned.
- **Marketing agent** — post-close results entry, after judging closes 00:30 IST Sep 19 (writes its own docs; Central syncs).
