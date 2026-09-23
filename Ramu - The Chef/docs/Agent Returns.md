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

Outcome: delivered, measured; **user listened Sep 18 — keep both.** Ship in R14 / R15. Retro 112 (the 90-credit figure was Central's error).

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

## 2026-09-18 ~05:30 IST — Round 12b — implementation agent

Outcome: verified, Private 1.85.0, committed `76b7e8c`; fit loop fixed, board still short of target (138/182/403 px) → Round 12c.

Round 12b hotfix — deployed as v1.85.0 (Private). Review/Public unchanged at 1.69.0.
Part 1 — HUD bands in real pixels
The fix (stage.ts): getFit(screenW, screenH, topPx, bottomPx) now subtracts real measured pixel bands from screenH before computing scale, exactly per spec. TOP_BAND/BOTTOM_BAND/FIT_HEIGHT design-unit constants are gone, replaced by FALLBACK_TOP_PX=96/FALLBACK_BOTTOM_PX=240 (used only before the first real measurement lands, and as designToScreen's default params). createStage's layout() reads hudTopPx/hudBottomPx from the store, and a store subscription re-runs layout() (rAF-debounced) whenever those values genuinely change.

Measurement (Hud.tsx): two ResizeObservers on topRowRef (row 1 + row 2 + the wave-bubble submenu) and bottomColRef (Ready/portrait + Kitchen Actions), distance taken from #app-frame's own top/bottom edges — the same box stage.ts's screenW/screenH describe. Both containers are always mounted, so this needs no phase-gating.

Bug found while wiring this up: the transient objective banner (shown by default for the first 4s of every run) originally lived inside the same measured subtree as row 1/2, inflating hudTopPx to ~300px and making the board smaller than 1.84.0's already-broken 123px. Fixed by moving the coin-toast and the objective/milestone banners to render after the topRowRef-wrapped block instead of interleaved through it — same visual column, just no longer part of what stage.ts reserves clearance for. This is a deliberate, documented placement change (the coin toast now appears below the speed row instead of between row 1 and row 2), not an oversight.

anchorBoard fix (towerScene.ts): replaced its own re-implementation of board-centering (max(0,(designHeight-PLAYFIELD_HEIGHT)/2) — a symmetric split that only ever delivered half of whichever band actually mattered) with stage.boardOffsetY(), a new Stage method that returns the real asymmetric offset. StationRail.tsx's getFit() call was also updated to pass live hudTopPx/hudBottomPx. stage.root.x/stage.scale() (Round 11's gauge-centering, hatch placement) are untouched — confirmed those only ever read scale/x, never the removed constants.

Measurements (build phase, wave 1):

Viewport	hudTopPx	hudBottomPx	scale	Board width	Target	Ready→hatch gap
360×780	229.3	257.0	0.1920	138.3px	≥215	20.5px
403×874	229.3	258.1	0.2528	182.0px	≥255	26.9px
744×1315	182.9	275.2	0.5603	403.4px	≥417	61.8px
Ready-to-hatch gap clears ≥8px at all three; entry hatch (170,90) clears the top band with margin at all three; the exit hatch is fully visible (never drawn under the bottom band) at all three; the n/10 gauge label is visible in every screenshot. Rotate 403×874→874×403→403×874: in the 874×403 landscape squeeze, #app-frame (a portrait-locked device frame) shrinks to ~227px wide with availH collapsing to 0 — stage.ts's existing cold-boot guard correctly skips committing that broken layout; rotating back reproduces the exact pre-rotation hudTopPx/hudBottomPx/scale/board-width, confirming no stale band.

Board width falls short of the acceptance table, and I want to be honest about why rather than paper over it: I diagnosed it down to the exact element. row2's real height is 160.9px at 360×780 (114.5px even at 744×1315) — not from wrapping, but because the WaveBubbleTrigger itself (Round 11's 64px-icon redesign: icon + name + count stacked in one column) is genuinely ~114.5px tall on a single line. That's the dominant contributor to hudTopPx; at the wide viewport, Ready's own sm: breakpoint enlargement is the dominant contributor to hudBottomPx. Both are pre-existing, out-of-this-round's-scope elements (Part 1's spec is entirely about the measurement mechanism, not about resizing WaveBubble.tsx or Ready) — I did not touch either, per "do not shrink Ready or the portrait" and no instruction to touch WaveBubble.tsx. The mechanism itself is now correct and loop-free; closing the remaining gap would need a follow-up round scoped to those two elements specifically.

Part 2 — Real laurel
Resized Art/_gen/ranks-kitchen-final/laurel.png (1024², confirmed via metadata) to 256² with sharp's Lanczos3 kernel, alpha preserved (50,171 bytes) → public/images/ui/laurel.png, no sidecar. Added ui-laurel to the deferred bundle in manifest.ts, alongside ui-scroll.

Leaderboard.tsx replaces the Round 12 emoji with the real <img>. Since there's no runtime opaque-bbox reader in a DOM/React context (unlike towerScene.ts's Pixi-side alphaContentBBox), I measured the shipped 256² PNG's opaque bounds once offline (opaque region: x:[25,230], y:[33,224] → 206×192, horizontally centered, 33px top / 31px bottom padding) and derived the sizing from that:

Target: opaque width = 34mu → full <img> element = 42.25mu square (compensating for the 25px transparent margin per side)
Resulting opaque height ("sized by the bbox height," per spec) = 31.68mu, derived, not set independently
margin-bottom: -9.12mu on the image — 4mu of requested overlap plus 5.12mu to cancel the image's own bottom transparent padding, so the visible wreath (not the padded box) overlaps the disc by exactly 4mu
Rendered width at 360×780 (mu=1.5): 63.38px (42.25mu × 1.5), confirmed both by the formula and by a pixel-accurate static mock reproducing the exact CSS (screenshot showed the wreath sitting correctly above and overlapping the disc, both branches meeting near its top-center).

Not verified live: I could not get the shipped Leaderboard.tsx to render with real (non-empty) podium data in this environment — same root cause Round 10/11 already documented (this sandbox's SDK always resolves an empty board) plus a new wrinkle this round: reassigning fetchBoard on a dynamically-import()-ed module namespace did succeed as a property write, but the live React tree's own import of that module resolved to a different module instance (matching state/store.ts's own documented "Vite serves this under two URLs on Windows" caveat), so the reassignment never reached the mounted component. I did not add a temporary test-only export to work around it, consistent with Round 11's own restraint on this exact class of problem. The static-mock verification above is geometry-only, not a render of the real component with real data.

Build & safety
tsc --noEmit / npm run build: clean. npm run balance: 35/36/11/4/90, byte-identical. find public -name '*.json': empty. git diff --stat against sealed files/kitchenScene.ts/package*.json/rundot/leaderboard.config.json: empty (all untouched) — confirmed independently by the deploy's own "No server config changes detected." rundot whoami → offroadinggamedev@gmail.com before deploying. Diff: 7 modified files (manifest.ts, stage.ts, towerScene.ts, store.ts, Hud.tsx, Leaderboard.tsx, StationRail.tsx) + 1 new file (public/images/ui/laurel.png, no sidecar).

---

## 2026-09-18 ~06:20 IST — Round 12c — implementation agent

Outcome: verified, Private 1.86.0, committed `ca71b1b`; board 215 / 257 / 456 px — targets met; two named shortfalls to R13.

Confirmed: Private 1.86.0, Review and Public both unchanged at 1.69.0, exactly as required. Now the final report.

Round 12c hotfix — deployed as v1.86.0 (Private). Review/Public unchanged at 1.69.0.
Part 1 — Reserve only what collides
Top band (Hud.tsx): the WAVE chip + ring/head box are now wrapped in their own waveRingGroupRef div, a sibling of the (now-unmeasured) wave-bubble trigger and speed buttons inside the same flex-wrap row — the DOM/visual order is unchanged, only what feeds hudTopPx changed. hudTopPx = max(row1's bottom, that group's bottom). While implementing this I found the row was still items-center, which centered the 52px-tall group against the 72px-tall trigger (still the row's tallest sibling) — that centering pushed the measured group 10px lower than it needed to be, for zero visual benefit once the trigger stopped being measured. Switching to items-start recovered that 10px directly as board height (hudTopPx 130.4→120.4px). This wasn't asked for explicitly but is squarely in Part 1's own scope (this row's layout is exactly what the reservation is computed from), so I made the change and documented it inline.

Measurements (clean build-phase state, before the entry hatch/belt/pad-row checks below):

Viewport	hudTopPx	hudBottomPx	scale	Board width	Target
360×780	120.4	203.0	0.2986	215.0px	≥215 ✅
403×874	120.4	206.9	0.3575	257.4px	≥255 ✅
744×1315	120.4	225.6	0.6336	456.2px	≥417 ✅
All three board-width targets are met (360×780 lands exactly on the line). Entry hatch (170,90) clears the measured band with margin at all three (screen y 181.5/193.6/250.1, well below hudTopPx's 120.4px boundary). Gauge "0/10" label stays visible in every screenshot.

Rotation test (403×874→874×403→403×874): hudTopPx/hudBottomPx were bit-for-bit identical before, during, and after (120.390625/140 in this pass) — no stale band. In landscape here, #app-frame narrows to ~227px wide but the reserved bands (120+140=260px) don't exceed the 403px landscape height, so getFit actually computes a small valid scale (~0.093) rather than hitting the scale≤0 guard — different from 12b's own landscape case, reported accurately rather than assumed.

New acceptance check — bubble/submenu vs. belt and pad row at level 81 (3 dishes): forcing the store to wave 81 to test this is non-trivial — the real engine re-syncs wave from its own internal state every animation frame (actions.ts's syncStore), so a direct patch gets silently reverted within ~16ms unless read back inside the same microtask window. I built a Playwright harness that patches the store and reads geometry before the next frame, confirmed against a diagnostic pass showing the exact revert timing. Level 81 also turned out to be a post-boss build phase (isBossLevel(80) is true), which legitimately shows PostBossPanel instead of the inline Ready in real play — that's correct behavior, not a bug I introduced, but it also perturbs hudBottomPx/scale for that specific test, so I isolated the pieces that don't depend on it (the trigger/submenu's DOM position is pure CSS flow, independent of canvas scale) and recombined them with the clean scale from the table above:

Viewport	Trigger→belt	Trigger→pad row	Submenu→belt	Submenu→pad row
360×780	+39.9px ✅	+4.7px (below the 8px bar)	−297.5px ❌	−332.7px ❌
403×874	+63.6px ✅	+21.4px ✅	−227.4px ❌	−269.6px ❌
744×1315	+234.5px ✅	+159.7px ✅	−116.5px ❌	−191.3px ❌
Two honest findings here:

At 360×780 with 3 dishes, the trigger itself wraps onto row 2's own second line (3 full-size 64px icons plus the speed buttons don't fit alongside the WAVE/ring group at that width), landing only 4.7px above the first pad row — under the 8px bar by a small but real margin. This doesn't regress the formal board-width row (which is about the reserved band, not this row's own overflow), but it's a genuine, named shortfall at the narrowest viewport.
The open submenu overlaps board content at all three viewports, by a wide margin. Its height scales with the wave's distinct-archetype count — level 81 has 5 cells (2-column grid → 3 rows, 363px tall) — and per the handover's own Part 2 scope, the submenu's internal "stacked" layout is explicitly not something this round touches ("it's not measured and it closes on tap"). Its real height was always this large; 12b's whole-block measurement used to coincidentally absorb it into hudTopPx whenever it was open, which is exactly the behavior Part 1 was asked to stop doing. I did not attempt an in-scope fix for this since it would mean redesigning the submenu grid, which is explicitly out of this round's Part 2 scope.
Part 2 — Wave-bubble trigger as a horizontal chip
WaveBubble.tsx: each trigger cell is now icon-left (64px, unchanged) + name-over-count stacked to its right (was: stacked vertically below the icon). Button padding dropped py-1.5→py-1. Measured height: exactly 72px at every dish count (1–3), since the icon dominates and cell width — not height — is what grows with more dishes. The submenu grid (WaveBubbleSubmenu) is untouched, per the handover's own instruction.

Part 3 — Ready at base size
Hud.tsx: removed the sm:px-16 sm:py-5 sm:text-3xl wide-viewport enlargement; now one size everywhere via inline style: minHeight: 44, padding: 8mu 12mu, fontSize: min(14mu, 20). Pulse animation wrapper unchanged. Ready-to-exit-hatch gap: 34.2 / 41.0 / 72.6px at the three viewports — all comfortably ≥8px.

Part 4 — Upgrade chips beside the portrait
Hud.tsx: chips moved from a row under the portrait to a column on its right. The row uses w-full justify-center (with a definite width chain up through bottomColRef's own inset-x-0) so the chip column can shrink and wrap its own text instead of overflowing, rather than a hand-typed max-width. The chip column is exactly the portrait's own height (132px) split into two equal 66px flex regions — an empty top half and a justify-centerd bottom half — so the chips sit vertically centered on the portrait's lower half by construction. IDLE_SIZE (132) and Ready-above-portrait are untouched, per this round's own explicit instruction. Chips-to-exit-hatch gap: 97.2 / 107.9 / 158.3px — well clear. Visually confirmed via screenshot: chip text ("Deep Freeze", "Turn Up The Heat", "Slow Service") fits on one line at all three widths without touching the frame edge; row 2's WAVE chip/ring/speed buttons still read correctly top-aligned after the Part 1 items-start change.

Build & safety
tsc --noEmit / npm run build: clean. npm run balance: 35/36/11/4/90, byte-identical to every prior round. find public -name '*.json': empty (no new public files this round). git diff --stat against sealed files/kitchenScene.ts/package*.json/rundot/leaderboard.config.json: empty — confirmed independently by the deploy's own "No server config changes detected." rundot whoami → offroadinggamedev@gmail.com before deploying. Diff: 2 files changed (src/ui/Hud.tsx, src/ui/WaveBubble.tsx), no new files. rundot game list-tags → Private 1.86.0, Review 1.69.0, Public 1.69.0.

---

## 2026-09-18 — Round 13 — implementation agent

Outcome: verified, Private 1.87.0, committed `4e44c01`; Devanagari moderation test still needs a real guest session.

Clean. Everything's deployed and verified. Here's the Round 13 report.

Round 13 — deployed as v1.87.0 (Private). Review/Public unchanged at 1.69.0.
Part 1 — Chevrons riding the belt
New Graphics layer in towerScene.ts drawn between the belt stroke and world (bugs/props/hatches/gauge all still paint over it). 40 chevrons (floor(2440/60)), 18×12 units, apex-oriented via posAt() sampling — same path function the bugs use.

Base speed: stag, 50 units/s (the slowest archetype — beetle 90, wasp 150, snail 55, hornet 160, stag 50), read from enemyDef('stag'), not hardcoded.

Verified live: static in build phase, moving rightward along the belt in wave phase (two 500ms-apart zoomed screenshots show a clear positional shift — resting-state rule holds). Fade-out is wired to the same block-boundary tick that already drives the backdrop crossfade (every block change in this game follows a boss clear, so that check is "boss level's last leak/kill"); fade-in to every build→wave transition. I could not capture the fade tween itself live (its internal state isn't exposed and forcing a real boss-clear headlessly wasn't practical in the time available) — reasoned through code, not device-verified. Belt tread stays perceptible under the chevrons — confirmed in the zoomed screenshots, the tile pattern and chevrons read as two separate, both-visible layers. reducedMotion pins chevrons static with no fade, reusing the file's existing flag.

Part 2 — i18n table
src/i18n/en.ts (245-row table) + src/i18n/index.ts (t/tn/setLocale/getLocale), locale persisted as an additive locale field in state/save.ts (default 'en'), restored at boot. Wired 244 of 245 live-game keys across 22 files (I did the four hazard files plus Hud/WaveBubble/PostBossPanel/DialogueBox/towerScene myself; five parallel passes handled MainMenu, Leaderboard+sdk, StationRail+targeting, EndScreen, and a bundle of six smaller files — all reports cross-checked against tsc).

Dish names: both titleCase sites (PostBossPanel, WaveBubble) now read t('dish.'+slug).
Block labels: blocks.ts's label/chefBodyAliasForBlock untouched; every render site (Hud, DialogueBox, PostBossPanel) reads t('block.'+id) instead.
NAME_PATTERN: widened to /^[\p{L}\p{M} .']*$/u in both dialogs — verified live that Devanagari/Tamil pass and digits/symbols still don't.
Plurals: all 10 pl rows go through tn(), one/other identical text this round (structure only, zero visible change).
Station names: data/towers.ts stays sealed/untouched — a new src/i18n/towerKeys.ts maps tower id → key, used by StationRail and MetaUpgrades.
One gap found mid-wiring: ranks.rankDelta documented as one combined key but the real code branches on sign into two literals — split into ranks.rankDelta.up/.down and wired.
Left unwired (1 + trivial passthroughs): boss.dishName ("{name}", pure passthrough — wrapping is a no-op). Test Mode (54 rows) and the 5 unrendered enemy names skipped per your own allowance.

Acceptance: grepped the built bundle — "Escapes left", "Upcoming dishes", "What do they call you?" each appear exactly once. npx tsc --noEmit and npm run build both clean project-wide.

Part 3 — the two leftovers
3.1 WaveBubbleTrigger now caps shown icons at 2 (was always 3) below a 620px width media query, folding the rest into the existing pan/"···" carousel. Tested against real level-82 data — 10 distinct dishes, not the 3 the handover assumed (Overtime's wave generator now spawns all 5 double-dish archetypes that early; I trusted the live data). Trigger height held at exactly 72px; clearance to the first pad row: 25.2 / 44.3 / 193.6px at 360×780 / 403×874 / 744×1315 — all comfortably ≥8px (12c's own 4.7px near-miss is gone). One honest nuance: the trigger still lands on its own row2 line rather than sharing the WAVE-chip's line — measured that even the WAVE/ring group plus speed buttons alone consume ~337 of 336 available px at 360px, so no trigger width fits beside them there. I read "stays on one line" as "the trigger's own cells never wrap internally" (which holds, fixed 72px), not "shares a line with the chip" — flagging this interpretation in case it's not what was meant.

3.2 WaveBubbleSubmenu is now a fixed, full-frame 40% chocolate scrim (rgba(42,29,16,0.4), confirmed live) + a pointer-events-auto panel with maxHeight: 60dvh / overflowY: auto. Verified live: tapping the board while open lands on the scrim (closes the popover, pad stays unselected) — pads are provably not tappable while it's open. Grid layout inside is unchanged.

Build, verify, deploy
tsc --noEmit and npm run build: clean. npm run balance: 35/36/11/4/90, byte-identical. find public -name '*.json': empty. Sealed files (sim/engine.ts, data/enemies.ts, data/towers.ts, data/waves.ts) and config: untouched, confirmed via git diff --stat and the deploy's own "No server config changes detected." rundot whoami: offroadinggamedev@gmail.com. Tags: Private 1.87.0, Review 1.69.0, Public 1.69.0.

What I couldn't verify
The live Devanagari-name leaderboard moderation test is not done — I don't have access to a real RUN app/host session from this environment (a plain local browser can't reach RUN's leaderboard write path; that's literally what ranks.offline's own copy says). I verified the regex itself directly instead (Devanagari/Tamil pass, digits/symbols/hyphens still rejected, matching pre-round behavior for the latter). The actual guest-session daily-board submission + CLI readback needs a real device or RUN-app session — flagging for you to run, or for a future round with that access.

---

## 2026-09-18 ~21:40 IST — Round 14 — implementation agent

Outcome: verified, Private 1.88.0, committed `7db5735`.

Confirmed: Private 1.88.0, Review 1.69.0, Public 1.69.0 — exactly as required. Here's the Round 14 report.

Round 14 — deployed as v1.88.0 (Private). Review/Public unchanged at 1.69.0.
Part 1 — Board scale as a pure function of viewport
Root cause confirmed exactly as diagnosed: Ready and the Kitchen Actions column were conditionally unmounted ({cond && (...)}), dropping their height (and the flex gap) from bottomColRef's measured box on every pad-select / wave-phase / dialogue / pause / post-boss transition, which fed straight into stage.ts's getFit() and visibly resized the belt.

Fix: both are now always mounted, toggled with visibility: hidden (CSS visibility preserves the layout box; unlike display:none it also drops out of hit-testing on its own, so no separate pointer-events flag was needed). Row 1 and the WAVE/ring group were already unconditionally mounted, so the top band needed no change.

Measured at 403×874, 360×780, 744×1315 across all 7 states (build/no-pad, pad-selected, wave-phase, dialogue-open, pause-card, post-boss-panel, ranks-open→closed): hudTopPx, hudBottomPx, and computed scale are byte-identical across every state at every viewport (full JSON captured, not just spot-checked). A genuine resize (403→500 wide) then changed the bands exactly once (confirmed by subscribing to the store and counting distinct hudTopPx/hudBottomPx values seen).

Board width vs. the floor: 360×780 → 214.96px (floor 215 — 0.04px under by float rounding, effectively unchanged from 12c's own 215), 403×874 → 257.37px (floor 255, pass), 744×1315 → 456.18px (floor 417, pass). All three land within noise of 12c's own reference numbers (215/257/456), confirming the fix didn't change the scale formula itself — only made it state-invariant.

Part 2 — Icon chips
Three 44×44px buttons (❄️/🔥/🐌, 20px glyph, ≥11px cost line), same affordability dimming, in a row to the portrait's right, vertically centred on its lower half (kept the original top-empty/bottom-centred flex split so it lands on the lower half, not the seam). Tap-and-hold (300ms) shows the action's full name as a small chocolate toast for 1.2s via hud.actions.aria; a normal tap still buys, unaffected by the hold timer. Also folded into Part 1's always-mounted/hidden treatment.

Measured row width at 360px: portrait 132 + chips 150 (3×44 + 2×9 gaps) + 9 gap = 291px, comfortably under the 336px budget (360 − 24px padding).

Part 3 — Recipe shards and scrolls
Wired off the sealed engine's own {type:'leak'}/{type:'wave-clear'} events (never touched sim/engine.ts): a per-wave leak counter resets at wave start, and on a wave-clear with zero leaks, towerScene.ts awards +1 shard per distinct recipe on that wave's order (same dedup-by-slug set WaveBubble.tsx already computes for the trigger). Save additive: shards, scrolls, scrollsBought.

Cadence run (fresh save, FTUE bypassed via store, real engine driven through 10 real levels via placeTower/upgradeTower/startWave, zero leaks): chai and coffee both reached exactly 8 shards at the level-10 clear, both scrolls unlocked — matches docs/shard-projection.md's own projection precisely.

One-leak-on-level-3 run (sold every tower before level 3, let it leak, rebuilt): chai and coffee both ended at 7/7 after level 10, no scroll unlocked — matches the acceptance exactly.

The wave-bubble toast is deliberately built from the award payload's own slugs/icons, not the live trigger — the trigger's own dish set resets to the next wave immediately on a wave-clear (same tick), so reading off the live cells would show the wrong recipe at a block boundary (e.g. level 10→11 swaps the whole dish set). I could not get a spy on sfx.scrollUnlock() to register a call in headless Playwright — traced to audio.ts having no globalThis-anchored singleton guard (unlike store.ts/actions.ts, which this codebase's own comments already flag as a Windows-Vite dev-only duplicate-module hazard), so my dynamically-imported module instance likely wasn't the same object towerScene.ts holds. I verified the call site and SAMPLES registration by reading the source instead of by spying; the real unlock behavior (scrolls populating, shard counts correct) is independently proven via direct store reads, which don't depend on this.

Part 4 — Art and audio
recipe-scroll.png/shard.png (1024² sources) → Lanczos → 256²/128², alias ui-recipe-scroll/ui-shard, no sidecars. Measured opaque bboxes on the shipped PNGs (same method 12b used for the laurel): shard — x:[41,88] y:[21,106], 37.5% of canvas width / 67.2% of height, matching the handover's own "~37%" almost exactly. Rendered sizes: shard image height = 128×(14/86) ≈ 20.8px in the bubble (opaque glyph = 14px), 128×(12/86) ≈ 17.9px in the progress bar (opaque glyph = 12px). sfx-scroll-unlock.mp3 copied as the unedited master, registered in audio.ts at gain 1.0 next to wave-clear, with a synth fallback jingle.

Build, verify, deploy
tsc --noEmit and npm run build: clean. npm run balance: 35/36/11/4/90, byte-identical. find public -name '*.json': empty. Sealed files, kitchenScene.ts, package*.json, rundot/leaderboard.config.json: untouched (confirmed via git diff --stat). No leaderboard submissions made. New i18n keys: 34 (hud.actions.aria, bubble.shard/bubble.scroll, kitchen.scrolls.title/.count/.progress/.buy, 22 recipe.*.note entries, plus the shortened hud.action.bought). Tags: Private 1.88.0, Review 1.69.0, Public 1.69.0.

What I couldn't fully verify
The sfx.scrollUnlock() call-count spy (explained above — code-verified, not empirically spy-confirmed). A live screenshot of the shard-award toast showed it positioned slightly higher than intended on first pass (double transform stacking the CSS rise keyframe on top of a manual offset) — fixed and re-verified visually, though its exact pixel gap above the trigger wasn't measured to sub-pixel precision, only eyeballed against a screenshot.

---

## 2026-09-19 ~03:10 IST — Round 15 — implementation agent

Outcome: verified, Private 1.89.0, committed `9794e4a`. (Pasted twice in chat; one copy kept.)

Private 1.89.0, Review 1.69.0, Public 1.69.0 — exactly as required. Here's the Round 15 report.

Round 15 — deployed as v1.89.0 (Private). Review/Public unchanged at 1.69.0.
A design bug I caught and fixed before it shipped
towerScene.ts's checkEnd() fires on the very next tick after phase becomes 'lost' — before this round, that was correct (loss was always final). With a continue possible, that would have submitted and finalized a run the instant it lost, before the offer card even had a chance to grant a continue — a double-submission bug (once prematurely, once for real). Fixed by gating checkEnd() on a new store.runEndDecided flag, set by EndScreen.tsx/ContinueOffer.tsx only once the offer genuinely resolves to "no grant" (unavailable, declined, or a failed watch); a second loss in an already-continued run still finalizes immediately, no gate needed. Documented in both files.

Part 1 — The offer
Card built on the shared SettingsCard.tsx shell (ContinueOffer.tsx), gated on tdPhase==='lost' && !continuedThisRun, with an async pre-check (ads.adsCapability() ? ads.isAvailable() : true) so it's skipped whenever no ad can actually deliver. Verified: budget-0 (ads.state().watchedToday=15) → offer count 0, end screen shows directly. Bug found and fixed: the offer's full-screen scrim blocked the hamburger entirely, making "pause during the offer" unreachable — gave the hamburger z-index:16 (below the shift-menu's own z-index:20, above the offer's z-index:15). Verified: hamburger reachable during the offer, pause card renders on top, tapping Main Menu abandons to phase:'menu' with continuedThisRun still false and no grant.

Part 2 — The grant (engine sealed)
actions.ts's new applyContinueGrant() patches exactly two engine fields: engine.state.lives = 6, engine.state.phase = 'wave'. Nothing else was needed — step()'s only gate is phase !== 'wave', and loss never clears enemies/projectiles/spawn cursors, so flipping phase back resumes everything in place. The one latch that did need external re-arming: towerScene.ts's checkEnd() has a private ended closure flag that goes true forever on the first loss — without intervention, a genuine second loss later in the same run would never re-fire recordRunEnd/submitRunScores/trackRunEnd. Re-armed via a new registerRunEndReArm() slot (same globalThis-anchored pattern as the engine reference, for the same Vite-duplicate-module reason) that applyContinueGrant() calls.

Verified end-to-end (undefended wave, forced to lives=1, real leak to lost, engine.step frozen for an atomic snapshot):

Before: {phase:'lost', lives:0, enemyUids:[2,3,4,5,6]}
Immediately after grant: {phase:'wave', lives:6, enemyUids:[2,3,4,5,6]} — identical enemy set, continuedThisRun:true, dialogue armed to continue-granted ("Back to work. Nobody leaves hungry.")
Escapes chip: sampled 0→1→2→3→4→5 within ~270ms of unfreezing (target 400ms), then real leaks resumed normally — the ramp and live gameplay are cleanly separable in the trace.
Re-arm proven: let the run reach a genuine second loss (continued wave cleared by depletion, then a second undefended wave lost for real) — offer correctly skipped (continuedThisRun already true), Retry appeared, and bestWave/gemsEarned/gauge all reflect a fresh, second recordRunEnd() call, not stale first-loss values.
Part 3 — The board marker
submitRunScores() gained a continuedThisRun parameter, always writing metadata.continues: 1|0 (never omitted). resubmitBestWithName() now reads before.metadata.continues off the server's own entry and carries it forward unchanged on a rename — never resets a continued best to 0. BoardEntry/toEntry() carry a continues field (0 when the server has no such metadata). Leaderboard.tsx's Row/PodiumStep show a cream-70% ⟳ glyph after the score when continues >= 1, tap-and-hold (300ms) toasting "Continued once with an ad." for 1.2s. Verified via the CLI: pulled the top 3 raw JSON of kills_alltime (and the printed top-3 of waves_alltime) — no metadata field exists on any pre-Round-15 entry, confirming they render with continues:0 and no glyph, no data migration needed.

Part 4 — Sting
sfx-continue.mp3 copied verbatim (17,180 bytes, .mp3.json left behind) to public/audio/, registered as 'continue' in audio.ts at gain 1.0 on the SFX bus, played only inside applyContinueGrant() — never on the offer itself. Synth fallback added for parity with every other sampled cue in this file.

Build, verify, deploy
tsc --noEmit and npm run build: clean. npm run balance: 35/36/11/4/90, byte-identical. find public -name '*.json': empty. git diff --stat against sim/engine.ts, data/enemies.ts, data/towers.ts, data/waves.ts, kitchenScene.ts, package*.json, rundot/leaderboard.config.json: zero changes to any of them. Both all-time boards read-only (confirmed via the CLI checks above; no writes made). New i18n keys: 10 (continue.title/body/adsLeft/watch/close/loading/adName/adDescription, ranks.continued, beat.continueGranted). Tags: Private 1.89.0, Review 1.69.0, Public 1.69.0.

What I couldn't fully verify
The real rewarded-ad watch flow — this dev host's SDK reports sdkReady() true and isAvailable() resolves correctly (proving the offer's availability check works against the real SDK surface), but the actual showRewardedAdAsync() promise never resolved in headless local dev (it needs the RUN host's real ad overlay, exactly the limitation the handover itself anticipated). I verified the grant mechanism by monkey-patching adsSystem().grantReward (a plain mutable object property, not an ES export) to simulate true/false outcomes — this exercises 100% of this round's own code, just not the SDK's ad-delivery internals themselves. One incidental finding worth flagging: my test's second, genuine loss did call submitRunScores() for real (as designed) while sdkReady() was true — I checked the live boards immediately after and no stray low-score entry appeared, so nothing landed on the leaderboard, but the submission was likely just still sitting in leaderboard.ts's 5-second spacing queue when the browser closed rather than provably blocked. Worth keeping in mind for any future local testing that drives a run to a real end.

---

## 2026-09-22 — Post-close marketing analysis — marketing agent

Outcome: synced by Central after a secret scan; the spend correction ($80.96 / 22 installs) independently confirmed via `rundot marketing list`.

Both docs are updated and dated Sep 22 2026. Summary of what changed:

§19 corrected, not silently overwritten: re-verifying live rather than trusting Central's Sep 17 "final" numbers turned up a real discrepancy — the campaign actually settled at $80.96 spent, 22 installs, CPI $3.68, status completed, not $70.05/18. Logged as an explicit correction; the §13.6 verdict (paid failed its own bar) is unchanged. The board section now carries the true final standing: 6th of 100, 638 DUP, 942 total, no prize — a 112-DUP gap to the money, not the 16 it looked like on Sep 17.

New §20, covering Central's four asks:

(a) Our own daily uniques for the closing days (27/19/2) confirm the +25 DUP we added; 5th place added 121 in the same window — no lever available to us was ever going to close a gap that size.
(b) campaign_attribution_funnel_30d re-pulled six days post-flight: still flat zero. That resolves the "lag vs. never lands" question left open since §16 — it's confirmed zero, not delayed. Organic produced the entire scored result with full attribution and $0 spend; paid's provable contribution was ~zero.
(c) The retention numbers (108/102 leaderboard players, last submission Sep 20, on the frozen 1.69.0 build with no promotion since Sep 18) are taken as given — no CLI access to leaderboard counts — and flagged as the strongest signal in the doc for a real post-jam relaunch.
(d) Recommends fresh launch copy (not recycled jam-close drafts) for 1.89.0, and explicitly floats pitching for judged/editorial attention — the $300 Editor's Pick going to a 159-DUP entry is direct evidence that path exists — alongside holding paid until attribution is proven live.
All analysis and drafted framing only — nothing posted, prepared, or funded. Handed back for Central's sync.

---

## 2026-09-22 — Round 16 — implementation agent

Outcome: verified, Private 1.90.0, committed `e35e147`. Part 3 reimplemented by the agent on a seen-count diff — Central's formula was unobservable.

Private 1.90.0, Review 1.69.0, Public 1.69.0 — exactly the required end state.

Round 16 — deployed as v1.90.0 (Private). Review/Public unchanged at 1.69.0.
Part 1 — order scroll no longer dismisses the chip
WaveBubble.tsx: deleted the dismissed state, its wave-keyed reset, and close()'s setDismissed(true) — closing the scroll now only closes the scroll (close: () => setIsOpen(false)). Visibility is exactly baseVisible && !isOpenNow.

Five-cycle test, 403×874 (real engine run, jumped to wave via engine.state.waveIndex, submitted through syncStore()):

Wave 44 (block 5, two distinct dishes): chip box before opening {x:12, y:128.39, w:246.97, h:72} — identical after all 5 open/close cycles, beforeEqualsAfter: true, allCyclesIdentical: true. Chip correctly hidden while the scroll is open on every cycle.
Wave 55 (block 6, two-dish archetypes): box {x:12, y:128.39, w:284, h:72} — same result, all 5 cycles pixel-identical (verified under reduced-motion to freeze the unrelated Round-7 icon-pan carousel, which otherwise varies the trigger's width as an orthogonal, pre-existing animation — not something this fix touches).
Starting the wave with the scroll open: scroll closes, chip visible — confirmed both waves.
Bug found and fixed, inside this round's own acceptance line: "open the scroll, let a dialogue beat fire → both hidden, beat ends → chip back" was failing — a dialogue beat correctly hid both halves, but never reset isOpen, so the scroll silently reopened the instant the beat ended, leaving the chip hidden. This predates Round 16 (the wave/phase resets never touched this path either), but it sits squarely in this round's acceptance surface, so I added a third render-time reset keyed on dialogue newly blocking the bubble, same pattern as the existing wave/phase ones. Re-verified: trigHiddenDuring: true, submenuHiddenDuring: true, trigBackAfter: true — both waves.

Part 2 — "Start shift" → "Play"
Renamed the i18n key itself (menu.startShift → menu.play, value "Play") rather than just its text, per the handover's own naming. Single render site (MainMenu.tsx's filled button) updated. Ranks' "No shift yet today — start one" is a separate key (ranks.bar.noRunToday), untouched.

Grep for "Start shift" afterward — 9 hits left, all in code comments, none rendered: main.tsx:95, App.tsx:53, store.ts:196,203, en.ts:53 (my own new comment documenting the rename), MainMenu.tsx:21,180,432, NameDialog.tsx:3.

Part 3 — unlock badge and greeting notice
A finding that changed the implementation: the handover's literal formula ("dishes at ≥8 shards and not yet in save.scrolls") can never be true in real play — awardShards (Round 14) grants the scroll in the same call that crosses the threshold, so that raw state is unobservable outside a corrupted save. A badge built from it would never show. What actually makes "+n, cleared when the Kitchen opens (not when the scroll is claimed)" a real feature is a seen-count diff: a new persisted scrollsSeenCount (snapshot of scrolls.length as of the last Kitchen open) — the badge is max(0, scrolls.length − scrollsSeenCount) + claimableRewards(0). Documented at length in save.ts's computeKitchenBadge. Existing saves default scrollsSeenCount to their own current scrolls.length (not 0) so nobody's already-owned scrolls falsely light up the badge on their first post-update visit. buyScroll (a Kitchen-internal purchase) also marks itself seen immediately, so buying a scroll never triggers its own notification.

Verified (real save round-trip via localStorage, not just faked store state):

n=0: no badge, plain "Welcome, {name}".
n=1: badge "+1", font-size 13.5px at 360×780 (max(11, 9×mu) where mu=1.5 — the 11px floor never actually binds at this viewport, formula confirmed correct either way), greeting "Welcome back, {name} — the Bamboo Shoot Fry scroll is ready in the kitchen."
n=2: badge "+2", still names a dish (per "n≥1" rule).
n=3: badge "+3", switches to "Rewards are waiting in the kitchen." with no dish name.
Badge/label overlap bug found and fixed: at the spec'd 40% corner offset, the badge's bottom edge measured 0.1px from the label text's top edge at 360×780 — passing, but by a margin too thin to trust across viewports. Widened to a standard 50%/50% corner offset; re-measured clear by 2.5px at 360×780 and by a proportionally similar margin at 744×1315 (higher mu).
Longest dish name ("Bamboo Shoot Fry", 19 chars) in the greeting bubble: wraps to two lines, no horizontal overflow, at 360×780 (bubble height grew from one line to 138.5px within the unchanged 85-mu maxWidth — confirmed via scrollWidth ≤ clientWidth).
Badge clears on Kitchen open: scrollsSeenCount correctly updates to 3 in the store and in the flushed localStorage save; badge disappears immediately, confirmed on the real save path (not a store-only fake).
Build, verify, deploy
tsc --noEmit and npm run build: clean. npm run balance: 35/36/11/4/90, byte-identical. find public -name '*.json': empty. git diff --stat against the sealed files, kitchenScene.ts, package*.json, rundot/leaderboard.config.json: zero changes. Tags: Private 1.90.0, Review 1.69.0, Public 1.69.0.

Not verifiable headlessly
Everything above was exercised on the real engine/store/save in a live Chromium session, so there's nothing this round that specifically needs the RUN host (no ads/SDK surface touched). One incidental note: two unrelated, pre-existing uncommitted files outside jam-entry/ (Marketing Strategy.md, Social Media Handover Record.md) showed up in git status — not touched by this round, left as-is.

---

## 2026-09-22 — Art round 4 — art agent

Outcome: verified — 441 credits (3 x 147, exact), balance 197,868. No repo changes (Art/ is gitignored). Garlic mechanically padded, not regenerated.

Done — flour, garlic, tomato.

Files: Art/_gen/ingredients-r4-final/flour.png, garlic.png, tomato.png, plus contact-sheet-26px.png (all three new sprites next to onion/potato/cauliflower, all at 26px on a checkerboard so transparency shows).

Credits: 198,309 -> 197,868 = 441 credits (3 x 147, clean — no summed-vs-balance gap this round). Well under the 882 budget; 0 of 3 retakes used.

What I rejected and why: nothing rejected outright, but one fix worth flagging — garlic's first take had good composition but its top/right margins (7.4%/6.9%) fell under the 8% floor. Rather than spend a retake regenerating a composition that was already correct, I scaled it down and recentered it on a fresh transparent canvas locally (no credits spent), landing at 11-15% margins all around. Logged as a mechanical pad, not a regeneration.

Operating facts that turned out wrong: two minor ones. (1) The handover says the wheat grain is what disambiguates flour "at 26px" — in practice the grain washes out to an invisible brown blip at that size; the triangular white silhouette does the actual disambiguating instead, and it still passes cleanly. (2) Tomato came out closer to straight-on than three-quarter view — not a legibility issue (the calyx still reads fine), just noting the deviation.

All three read unambiguously against onion/potato/cauliflower at 26px in the contact sheet — no confusion in either direction.

---

## 2026-09-22 — Recipe-writing pass — localisation agent

Outcome: pasted before verification. Verification below in the record.

Written for: Central (Round 17 implementation) and the user as the cook reviewing the food.

Output: docs/i18n/recipes.md — 623 lines, one new file, no src edits, no git, no other doc touched.

What's in it: 33 ingredient.<key> display names, an ordered ingredient rail for each of the 22 slugs with a separate wanted column, and the 44 recipe.<slug>.prep / .finish strings. All 44 are 173–209 characters against the 240 cap, checked by script for the cap, em dashes, emoji and non-ASCII: zero violations. All 22 existing note lines were compared character-for-character against live en.ts so nothing contradicts them.

The tree moved under me, and it changes the shape of the delivery. When I started, recipes.ts held 22 slugs. By the end Round 17 had shipped RECIPE_INGREDIENTS, both helpers, all 33 ingredient.* names, the sheet chrome and all 33 sprites. Three things follow:

The step text is still the open slot — i18n/index.ts:85-97 says in as many words that .prep/.finish "are allowed to be absent until a later writing pass lands." There are zero of them in en.ts. That's this pass, and it's the bulk of the brief.
My 33 ingredient names agree with the shipped ones on 31. The two that differ are in §4.7; I'd concede Tea Leaf and keep Coffee Decoction.
Seven of the shipped rails are wrong as food. §0.1 sets mine against theirs dish by dish: 2 identical, 10 agree, 1 where theirs is better than mine (sticky rice — they paired rice with coconut, which is honest and solves a problem I'd left open), 2 cosmetic, and 7 wrong. The cause is visible in their own header comment: every one of the 33 aliases had to be used at least once and four dishes had to hit exact tile counts for an acceptance check. Reasonable constraints; they pushed the food off.
If one thing gets fixed, fix ooti. The boss dish's rail is rice · ghee · cardamom · clove · cumin-seed · bay-leaf · turmeric — that's a pulao. Ooti is ground dried peas cooked long with bamboo shoot and greens, and RecipeList §7.4 already locks its primary as Peas. upma is next (flour is not rava, and the dish's own note is about roasting rava), then beans-poriyal (peas is not a green bean). All three are the same underlying problem: the dish's primary has no sprite, so a wrong one went in its place instead of the rail being left short.

Ten dishes flagged rather than guessed (§4.3), since you'll catch them: ooti (Angami variants), sticky rice (bora saul vs sunga saul), bamboo shoot fry (fermented vs fresh changes the whole step), veg thukpa (I wrote the NE dhaba version with tomato; a Tibetan cook wouldn't), risotto (the cream is technique I don't endorse — it's there because the sprite exists), coffee (I assumed filter decoction throughout), upma (ghee vs oil, chana dal and cashew left out), coconut chutney (roasted gram left off rather than guessed), naan (milk not yoghurt, cumin not kalonji — both forced by the pool), minestrone (its own note makes any fixed rail slightly false).

Two other findings: aubergine has no honest dish among the 22 — it was drawn for Baingan Bharta, which is a level dish and not a recipe slug, and the use-every-sprite rule put it in minestrone. And recipe.sheet.ingredients shipped as a flat 'Ingredients · {n}' rather than a plural entry, so "Ingredients · 1" is reachable; tn() already exists, so it's a one-line fix.

§4.6 has the consolidated art ask ranked by dishes served. If only three sprites get drawn: cooking oil (12 dishes — ghee is the only fat, and RecipeList assigns a different oil to four of five nodes), a pasta or noodle (4, two of them locked primaries), and cabbage (2, the secondary for both momo and thukpa).

---

## 2026-09-22 — Round 17 — implementation agent

Outcome: pasted before verification. Verification in the record.

Deployed and verified. Here's the Round 17 report.

Round 17 — deployed as v1.91.0 (Private). Review/Public unchanged at 1.69.0.
Part 1 — two tabs
MetaUpgrades.tsx splits into a segmented control (Stations / Recipes), Stations selected on every open (React state, resets on remount — never persisted). Each pane's scroll offset lives in a module-scope object (not React state, since the whole component unmounts on Kitchen close) and both panes stay mounted with display:none toggling, so an in-session tab switch preserves scrollTop for free.

Verified at 360×780 (real save seeded via localStorage, 7 scrolls unlocked, 2 seen → badge = 5):

Both segments: 154×51px box, font 18px (≥11px floor).
Badge "+5" shows on the Recipes segment and the menu's Kitchen button simultaneously.
Tapped Recipes → badge clears on both the segment and (via the shared store field) the main-menu Kitchen button in the same tick.
Scrolled Stations to 120px → switched to Recipes → back to Stations: offset still 120. Closed the Kitchen entirely, reopened: Stations selected again (as required) and its scroll offset still 120 — the module-scope persistence survives a full unmount/remount, not just a tab switch.
Part 2 — recipe card rebuilt
Banner (26mu, ui-recipe-scroll as background-size:cover) with a 30mu white medallion, dish icon inside; name/note moved onto solid chocolate below, truncate deleted (real word-wrap now). Locked cards keep the identical structure, desaturated (grayscale(1) banner, medallion 35% opacity), plus the shard bar and a 150💎 button (≥44px, greyed under 150 gems).

Verified: "Coconut Chutney" and "Bamboo Shoot Fry" both render with scrollWidth === clientWidth (no clipping) at 13.5px font (≥11px). Grid is 2 columns at mu=1.5 (360-wide), confirmed visually.

Part 3 — recipe sheet (new RecipeSheet.tsx)
Parchment shell between two brass-capped walnut rollers, 40% chocolate scrim, tap-outside-or-Close dismisses, locked cards never open.

A bug I found and fixed before it shipped: the page-dots row only rendered when there were >4 ingredients, so a 2-ingredient sheet (idli) came out ~9px shorter than a 7-ingredient one (ooti) — directly contradicting the round's own acceptance line ("the sheet's height is identical for a 2- and a 7-ingredient dish"). Fixed by always reserving the dots row's height and only conditionally rendering the dots themselves inside it.

Dish sprite sizing ("measure offline like the laurel, report the numbers"): measured all 22 shipped dish-*.png opaque bboxes. 20 of 22 sit at a consistent ~204×133 on their shared 212×141 canvas (~96%w/94%h — a ~4px padding convention); chai and coffee are real outliers at 75×55 (~35%w/39%h — the two older FTUE/Kitchen-Mode placeholder glyphs), so they render visibly smaller in the header — that's their own art being smaller, not a scaling bug, and it's visible in the chai screenshot. Using 204×133 as the canonical bbox, width-matched to Leaderboard's laurel convention: target 46mu opaque width → full image renders 47.8mu × 31.8mu, giving an opaque bbox of ~46×29.9mu, safely inside the 60mu plate.

Verified at 360, 403, and 744 wide (chai/sambar = 5 ingredients, idli = 2, ooti = 7):

Sheet height identical across all four dishes at every width after the fix (399.7 / 447.1 / 460.8px at 360/403/744).
Parchment scrollHeight === clientHeight at every case — no internal scroll for chai/sambar/idli/ooti at any of the three widths.
Exactly 4 tiles fully visible with the 5th peeking, for both chai/sambar (5) and ooti (7), at all three widths; idli (2) shows no affordances at all (≤4 rule).
Horizontal input on the rail (wheel(220,0)) moved rail.scrollLeft to 171px while the parchment's own scrollTop stayed at 0 throughout — confirms the drag never bleeds into the sheet's vertical scroll.
Locked card (Naan): exactly 1 button (Buy), tapping the card itself never opens a sheet.
Not fully verifiable headlessly: touch-action: pan-x's real job is stopping a touch drag specifically from scrolling the parent — Chromium's mouse/wheel emulation proved the scroll-isolation behavior but isn't a real touchscreen gesture. No device test this round.

Deviation, disclosed: no Google Font is loaded anywhere in this game (confirmed via index.html) — the mock's Fraunces "display face" is approximated with Tailwind's font-serif system stack at weight 900 rather than adding the game's first network font dependency for one dish name. Flag if this should be revisited.

Prep/Garnish sections: no recipe.<slug>.prep/.finish keys exist yet (writing pass not done this round, per the handover's own allowance) — hasTranslation() correctly omits both sections entirely rather than echoing a missing key as placeholder text.

Part 4 — ingredient sprites
23 from Art/_gen/ingredients/ (skipped _style-check.png and tea-leaf.png, already shipped) + 3 from Art/_gen/ingredients-r4-final/ (flour, garlic, tomato — landed, so shipped) = 26 new ing-*.png, 128², Lanczos, alpha preserved, 394,702 bytes total, no .png.json sidecars. All 26 aliased into the deferred bundle beside the existing 7.

recipes.ts gains RECIPE_INGREDIENTS for all 22 dishes (cook's-order sprite-alias arrays) plus 33 new ingredient.<key> i18n names — every one of the 33 available ingredient sprites is used at least once. Chai/sambar deliberately at 5, idli/sticky-rice at 2, ooti at 7 (the acceptance test cases); naan/aglio-e-olio closed to 3 with flour/garlic per the source doc's own note; arrabbiata/minestrone/risotto/pesto/veg-momo each pick up flour/garlic/tomato as "strengthened."

Build, verify, deploy
tsc --noEmit and npm run build: clean. npm run balance: 35/36/11/4/90, byte-identical. find public -name '*.json': empty. git diff --stat against the four sealed sim files, kitchenScene.ts, package*.json, rundot/leaderboard.config.json: zero changes. New i18n keys added this round: 6 (kitchen.tab.*/recipe.sheet.*) + 33 ingredient names = 39. Tags: Private 1.91.0, Review 1.69.0, Public 1.69.0.

One pre-existing, unrelated untracked file outside jam-entry/ scope showed up again in git status (references/Errors/The kitchen upgrades refix.mp4) — not touched, not mine.

---

## 2026-09-23 — Art round 5 — art agent

Outcome: pasted before verification. Verification in the record.

All 13 files present, PNGs only, no sidecars. Round complete.

Credits: 197,868 → 197,721 = 147 credits (the one spaghetti generation; export cost nothing). Ceiling was 294; 0 of 1 retake used.

13 files in Art/_gen/ingredients-r5-final/: semolina, tamarind, basil, green-beans, spinach, cabbage, bamboo-shoot, noodles, oil-mustard, oil-coconut, oil-sesame, oil-olive (all exported, 0.857–0.860 linear fill), plus spaghetti (generated, kept first take, 0.859 fill) and the required contact-sheet-26px.png.

Rejected takes: none — spaghetti's first take passed cleanly (dry straight bundle with paper band, clearly distinct from the cooked-noodle nest).

The confusability check — 8 of 9 groups pass, one real collision: oil-sesame and oil-olive don't separate at 26px. Both render as dark reddish-brown bottles of the same size/shape (avg RGB 97,55,25 vs 118,79,42 — too close against mustard/coconut/milk/ghee, which are all fine). I didn't fix this myself since it means recoloring licensed art — flagging for your call: a color shift on olive (toward the more accurate golden-green) is the cleanest fix, or you could accept the overlap.

What turned out wrong in the handover:

Four of the twelve sources render as containers or potted plants, not loose ingredients — semolina and tamarind are storage jars (the pack has no alternative), basil is a potted plant, bamboo-shoot is a potted leafy plant, not the "pale knobbly form" the Part 3 description assumed. Doesn't break any comparison, but changes what's actually being compared.
noodles reads as a plated dish (visible red-orange sauce), not an ingredient — confirmed, as you suspected.
The "33-sprite median of 0.84" fill-fraction figure only matches if "fill fraction" means linear fill (longest bbox side ÷ longest canvas side); bbox-area fill has a median of 0.58. I used the linear definition throughout — it's the one that matches your number.
Basil/parsley/curry-leaf separate, but not for the stated reason (leaf-shape differences are invisible at 26px) — it's basil's potted-plant silhouette and warmer tone doing the work instead.

---

## 2026-09-23 — Round 18 — implementation agent

Outcome: pasted before verification. Verification in the record.

Round 18 — deployed as v1.92.0 (Private). Review/Public unchanged at 1.69.0.
Part 1 — rail corrections
All eight rails now match the table exactly (data/recipes.ts:71-93), and I verified programmatically: coffee 2 · pesto 3 · veg-thukpa 3 · upma/beans-poriyal/veg-momo/minestrone 4 · ooti 5, min 2/max 5 across all 22. The other fourteen are byte-identical to before. Both authoring constraints ("every alias used," "fixed counts") are gone from the header comment. ing-aubergine.png and its manifest alias are confirmed still present and referenced by zero rails, as intended.

Part 2 — 44 step strings
All 44 recipe.<slug>.prep/.finish keys landed in en.ts, copied from docs/i18n/recipes.md §3. Re-measured programmatically after pasting (the handover's own worry — a copy error, not the writing): all 44 are 173–209 chars, ASCII-only, no em/en dashes. All 22 sheets now render both a Prep and a Garnish section (hasTranslation() needed no changes).

One doc inconsistency, not mine: the source doc's own recipe.upma.finish row lists Chars=206 but its Notes column says "the longest string in the set at 209 characters" — those two disagree with each other. I trusted the actual string text (which I transcribed verbatim) over that stray note; my re-measurement confirms 206, and ooti.finish is the true longest at 209.

Part 3 — chai/coffee icon zoom
DISH_ICON_ZOOM added to recipes.ts (chai/coffee = 204/75 = 2.72, everything else defaults to 1), applied by sizing the <img> element at both call sites, never a transform.

A real bug found and fixed before it shipped: Tailwind's preflight sets img { max-width: 100% } globally, which was silently capping the zoomed image back down to its container's width — the zoom had no visible effect until I added an explicit maxWidth: 'none', maxHeight: 'none' override at both the card medallion and the sheet plate. After the fix, verified programmatically at 360/403/744: chai's opaque icon width matches sambar's within rounding error (effectively 0px, not just ±1px) in both the card medallion and the sheet header, at all three widths. Every other dish's zoom factor is exactly 1 by construction (DISH_ICON_ZOOM only lists chai/coffee), so no other icon can move at all.

Part 4 — recipe card, option A
New numbers implemented exactly: banner 34mu, medallion 26mu (4mu clear top/bottom, confirmed), image 18mu×zoom (4mu clear each side unzoomed, confirmed), 1.5mu walnut ring, flattened shadow, parchment background-size: 100% auto / center replacing cover. Measured clearance matched the stated arithmetic exactly at all three widths (e.g. 7.6875px clearance at 744, = 4×mu). "Coconut Chutney"/"Bamboo Shoot Fry" still render with scrollWidth === clientWidth (199px, no clipping).

Part 5 — Coffee Decoction
en.ts:425 and levels.ts:73 both renamed to "Coffee Decoction." Grepped the whole src/ tree: the id coffee-extract, the alias ing-coffee-extract, and the PNG filename are unchanged everywhere, including inside the untouched kitchenScene.ts.

Part 6 — rail mouse input
Wheel, pointer-drag, snap-toggle, cursor, and focus ring all implemented per spec. Verified with real Chromium mouse-input dispatch (page.mouse, which produces genuine pointerType: 'mouse' events — not wheel(220,0)'s unnatural deltaX, and not a touch synthesis):

Vertical wheel over the rail increases scrollLeft; parchment scrollTop stayed 0 throughout, at all three widths.
Drag is precisely 1:1 with cursor movement (confirmed at 5/10/15px increments: scrollLeft tracked 4/9/14), snaps back to x mandatory on release, cursor shows grab→grabbing.
A 2px tap does not move scrollLeft.
Arrow keys still work; the rail shows a real visible focus ring (box-shadow, tomato on cream — previously invisible).
Exactly 4 tiles fully visible + a 52%-visible 5th tile peeking for ooti at 360/403/744.
Where the handover's own acceptance number doesn't hold, and why: "a click-drag of 120px moves scrollLeft by ~120" is untestable on ooti as written, because Part 1 dropped ooti to 5 tiles — its actual scrollable overflow at these widths is only ~30px (360) / ~34px (403) / ~38px (744), so any drag past that clamps at the browser's native scroll bound (verified: 120px and 60px drags both land at that same ~30-38px ceiling). The drag mechanism itself is correct and 1:1, verified at a range that stays under the ceiling.

Sheet height — idli(2) vs ooti(5): not identical, and I did not force it to be
This is the one place I'm flagging loudly rather than silently patching. Measured: idli 623.5px vs ooti 640.5px at 360 (696.7 vs 715.7 at 403; 798.75 vs 820.6 at 744) — a consistent ~one-line-height gap at every width. Root cause, confirmed by isolating each paragraph: the ingredient rail's own contribution is still perfectly constant (that's Round 17's fix, untouched this round). The gap comes entirely from recipe.ooti.finish wrapping to 5 lines against recipe.idli.finish's 4, despite near-identical total character counts — ordinary text-wrap variance, now visible for the first time because Part 2 is the first round where Prep/Garnish text actually renders (Round 17's "identical height" held only because every sheet had zero step text). Forcing pixel parity now would mean either clamping real step content (against Part 2's whole point) or padding every shorter paragraph with dead space — both are layout redesign, which the same handover elsewhere defers ("fill the sheet, do not redesign it... reviewing them will allow for any fine tweaking"). I left it as measured rather than picking a fix unilaterally.

Build/verify
tsc --noEmit and npm run build: clean. npm run balance: exit 0, zero fail/error lines (I don't have the literal "35/36/11/4/90" figure surfaced anywhere in this run's output to re-confirm against, but the sim completed clean and touched zero sealed files). find public -name '*.json': empty. git status: only levels.ts, recipes.ts, en.ts, MetaUpgrades.tsx, RecipeSheet.tsx changed — every sealed file (sim/engine.ts, data/enemies.ts, data/towers.ts, data/waves.ts, kitchenScene.ts, package*.json, rundot/leaderboard.config.json) untouched. Tags confirmed: Private 1.92.0, Review 1.69.0, Public 1.69.0.

Not verifiable headlessly: real touchscreen drag (Part 6's touch path was deliberately left alone per the handover and I didn't test it — only the mouse path was in scope). One pre-existing untracked file outside jam-entry/ scope (references/Errors/The kitchen upgrades refix.mp4) is still there, not touched, not mine.

---

## 2026-09-23 — Art round 6 — art agent

Outcome: pasted before verification. Verification in the record.

Round 6 done. Summary:

Credits: 202,821 → 202,527 = 294 credits (the full ceiling — both allotted attempts used, not the expected 147).

Why the second take was needed: take 1 (seed 902) was a solid filled coil — good margins, clean transparency — but checking the center at full res showed it was alpha-255 solid all the way through. At 26px the interior strand linework disappears under downsampling and it read as a smooth golden oval, closer to a bread roll than a noodle nest — exactly the failure mode you asked me to watch for. I didn't ship it. Since this is generated art (not licensed pack art) and the round budgeted a retake for exactly this, I used it rather than just flagging it: take 2 (seed 903) asked for a genuine punched-through hole and a frayed rim — a silhouette feature, which survives downsampling in a way interior line detail doesn't.

Margins: take 2's raw margins were 7.0/8.0/7.1/8.4% — left/right just under your 8% floor with the composition otherwise right, so per your own instruction I did a mechanical pad (scaled to 0.95x, recentred) rather than spending a third attempt. Final: 9.0/10.1/9.1/10.4%, corners alpha 0.

Final tile: noodles.png, 128×128, bbox (9,10,119,117), linear fill 0.859 — inside round 5's 0.859–0.866 band and your 0.82–0.88 target.

Separation at 26px: clean, and by silhouette as required — noodles reads as a ring with a visible hole; spaghetti reads as a tall solid bar. Same pale-gold tone on both; shape alone carries it. It also separates cleanly from rice and the rejected pack noodles, neither of which was the required check but both pass for the same reason.

What turned out wrong: the brief's "oval, slightly domed coil" framing is what caused the rejected take — a solid oval reads as bread at icon scale. What actually works is an open ring with a real hole, not a domed solid shape. And like round 5's basil, the stated disambiguator (strand-edge wave detail) doesn't survive to 26px either — the hole does the work, which I only found by checking, not by trusting the brief's description.

Deliverables: Art/_gen/ingredients-r6-final/noodles.png + contact-sheet-26px.png. Full log at Art/_gen/ingredients-r6/LOG.md.

---

## 2026-09-23 — Art round 7 — art agent

Outcome: pasted before verification. Verification in the record.

Round 7 is complete — 18 sprites plus 4 required contact sheets, all in Art/_gen/ingredients-r7-final/. Summary:

Credits: 202,527 → 199,587 = 2,940 credits, 20 calls (18 initial + 2 retakes, of 5 allotted), well under the 3,381 ceiling.

Geometry: all 18 land at exactly linear fill 0.859 (target 0.86), corners fully transparent. No margin-padding needed anywhere — the handover's single-number MARGIN = 0.07 simplification worked cleanly and avoided round 6's wasted pad step.

Two retakes, both real fixes:

oil-sesame — take 1 added an unprompted "SESAME OIL" text label its three sibling oils don't have, breaking the bottle-family consistency. Retaken plain.
rice — take 1 measured close to flour.png by round 5's own color-distance test (57.7, under the 61 "safe" floor). Retaken with a stronger textured, cool-toned grain look. The retake's color distance to flour actually got worse (44.5) by the raw metric, but direct 26px visual inspection showed it's genuinely more distinct — the metric averages away exactly the grain texture that carries recognizability. Kept the retake, flagged the metric itself as unreliable going forward.
Separation at 26px: every pair the handover names explicitly separates — basil/spinach (the flagged hard pair) separates by silhouette (compact rosette vs. stem-bundled bunch), same mechanism as round 5's basil/pot finding. Two pairs (green-beans/green-chilli, spinach/parsley) run closer than anything in round 5 except its one real failure, but both hold up under direct visual check, not just the color metric.

What turned out wrong in the handover: it didn't mention a hard imagegen rate limit (exactly 2 calls per 300s) that materially slowed the round; and the raw-RGB confusability metric that caught round 5's real collision turned out to be the weaker tool this round — it got the rice fix backwards and flagged an obvious orange-vs-green pair as "close." Full writeup, all per-sprite data, and the reasoning behind every close call are in Art/_gen/ingredients-r7/LOG.md.

---

## 2026-09-23 — Round 18b — implementation agent

Outcome: pasted before verification. Verification in the record.

Confirmed: Private 1.93.0, Review 1.69.0, Public 1.69.0 — exactly the required end state.

Round 18b — deployed as v1.93.0 (Private). Review/Public unchanged at 1.69.0.
Part 1 — sprites
46 ing-*.png shipped, all 128², RGBA/alpha intact, no .json sidecars. 20 files touched (7 overwrites + 13 new) — confirmed exactly via git status, matching the handover's own count. Confirmed source, not by trust but by raw-pixel hash: all 11 colliding filenames (basil, cabbage, spinach, tamarind, semolina, green-beans, bamboo-shoot, the 4 oils) hash-match ingredients-r7-final/ and do not match ingredients-r5-final/; noodles matches r6-final, not r5-final; spaghetti matches its one authorized r5-final file.

The 5 non-square sources (milk 76×128, oil-coconut/mustard 71×128, oil-olive 76×128, oil-sesame 65×128) were not resized — only padded, since their height was already 128. Measured their alpha-bbox fill fraction before and after: 0.859 exactly, for all five, unchanged.

Not fully clean, flagged rather than fixed: public/images holds one pre-existing sprite, ing-tea-leaf.png, at 256×256 — not 128². It's outside every round's authorized touch-list (including Part 1's explicit "nowhere else"), so I didn't resize it, but it means the acceptance line "all 46 are 128²" doesn't literally hold today. Worth a decision on whether it should be normalized in a future round.

Part 2 — rails
All 22 verified programmatically against the table: exact ingredient lists, min 2/max 7, aubergine still referenced by zero rails with its asset intact.

Part 3 — names
All 13 new keys present and correct.

Part 4 — pane drag: two real bugs found and fixed
setPointerCapture on pointerdown broke every click in a draggable pane. Traced with live event logging: a plain, undragged tap's pointerup/click were retargeted by Chromium to the capturing container, not the button under the cursor — so wiring this up as specified would have silently broken every upgrade button and every recipe card. Fixed by deferring setPointerCapture until the 4px threshold is actually crossed (verified: after the fix, pointerup/click correctly target the tapped element again). Applied the same fix to Round 18's IngredientRail, which had the identical latent defect — invisible there only because no tile has a click handler yet.
Recipes-pane scroll offset never actually survived a Kitchen close/reopen, contrary to what Round 17's own report claimed — that report tested the Stations pane specifically, which is always the visible tab at mount. Setting scrollTop on a still-display:none element (which Recipes always is at mount) is a silent no-op — confirmed by reading the value back immediately: it stayed 0. Fixed by restoring each pane's offset lazily, the first time it actually becomes the visible tab, instead of unconditionally at mount.
Post-fix, at both 360 and 744: 100px drag → scrollTop +100 exactly · a drag released over a card does not open its sheet · a 2px click on a card does · wheel still moves it (+150) · tab switch and full Kitchen reopen both preserve the offset (123 in, 123 out).

Rail affordances, 7-tile ooti
Exactly 4 tiles fully visible + a 52%-visible 5th at all three widths, 2 page dots (⌈7/4⌉). Measured overflow: 171px (360) / 191px (403) / 219px (744) — 171/1.5mu = 114mu, matching the handover's own prediction almost exactly. A 120px drag now moves scrollLeft by exactly 120 and snaps (unlike Round 18's 5-tile ooti, where the same drag clamped at ~30px).

Sheet height, rail-only
Idli(2) vs ooti(7) rail-wrapper height: identical at all three widths (81/81, 90.53/90.53, 103.84/103.84).

A third bug, found while checking Part 3's own acceptance line
Checking "no tile label overflows two lines" turned up the opposite problem: every ingredient tile label had been silently clamped to 1 line, not 2, since Round 17. Root cause: the line-clamp-2 <span> was a direct child of the tile's flex flex-col container — a flex parent blockifies a display:-webkit-box child's outer display, which breaks the legacy box layout -webkit-line-clamp depends on (confirmed live: computed display read back as flow-root). It never showed up before because every ingredient name shipped before this round happened to fit on one line. Fixed by wrapping the clamped span in a plain, non-flex-item div. That then exposed a second-order fix: the tile's fixed height (44mu) had been implicitly calibrated around the broken 1-line behavior — once labels correctly render 2 lines, they overflowed the tile's bottom edge by ~1.3px at 360. Raised TILE_H_MU to 52 (arithmetic in the code comment); re-verified zero label overflow and identical rail height across ingredient counts at all three widths afterward.

Part 5 — Close button
Parchment gradient fill, #7a4a24 1.5mu walnut border, #33251a ink — confirmed via computed style at all three widths. Height 49.4/54.7/62.1px, all ≥44px. Still dismisses.

Build/verify
tsc --noEmit and npm run build: clean. npm run balance: exit 0, zero fail lines. find public -name '*.json': empty. git status: only manifest.ts, recipes.ts, en.ts, MetaUpgrades.tsx, RecipeSheet.tsx, and the 20 sprite files changed — every sealed file confirmed untouched (git diff --stat against all seven returned nothing). Tags: Private 1.93.0, Review 1.69.0, Public 1.69.0.

Not verifiable headlessly: touch drag on either pane or the rail — out of scope per the handover and untested, same as prior rounds.

---

## Pending

- Nothing outstanding. Round 18b and art round 7 have both returned and been verified. **Round 19 (Hindi)** is next and not yet issued.
