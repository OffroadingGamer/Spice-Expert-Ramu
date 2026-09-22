# Tasks — Spice Expert: Ramu

> **Overview only.** This document is a glimpse of where we are and where we are headed.
> It carries task titles, phase tags and status marks — **nothing else**.
> Reasoning, measurements, findings and history live in the companion docs:
> [GDD.md](GDD.md) · [Plan.md](Plan.md) · [Specs.md](Specs.md) · [Retro.md](Retro.md).

**Last updated:** Sep 17 2026, ~22:00 IST — by Central. **The authoritative present is the CURRENT
STATE block of [Implementation Handover Record.md](Implementation%20Handover%20Record.md);** this
header mirrors it.

**Live:** **Public 1.69.0** (frozen through judging) · Review 1.69.0 · **Private 1.81.0** — Rounds 0–9 of
the post-jam progression pass (dialogue + Chef Ramu, ring gauge, wave scroll, prop FX, bottom band,
end-screen debrief, dawn-backdrop main menu in mock units, hatches + belt, settings dialog, pad
cues, player name). 🔒 Private-only until the user plays end-to-end and decides public; promotion
is post-jam via the implementation agent's `update-tag review`.

**Round 10 returned Sep 17 ~22:40 IST → Private 1.82.0** (heat gauge, four FTUE beats, name at
boot, pulse removed, Settings look A, rename, pause card) — verified and committed; the live
rename resubmit is untested until the user plays. **Round 11 returned Sep 18 ~00:10 IST → Private 1.83.0** (six playtest fixes + Ranks service board + daily period; both all-time boards unchanged). **Round 12 returned → 1.84.0** (Ranks B, fixes, near-you/delta) but ships a half-scale board (BOTTOM_BAND 2400). **Round 13 returned → 1.87.0** (chevrons, i18n table English-only, popover submenu). **Round 15 returned → 1.89.0** (rewarded continue, ⟳ marker, continue sting — playtest-ready). **In flight:** nothing — R16 (Play + unlock badge) waits on the user's playtest. **Jam closed 00:30 IST Sep 19; promotion to Public/Review is now unblocked.** **Queued:** R13 belt chevrons +
i18n table · R13 recipe shards · R14 rewarded continue · R15 Play + unlock badge · R16 Hindi · IAP
after — all picked Sep 17, Ideas.md §10.

**Jam:** **6th, 613 daily uniques** (901 total plays) at ~21:50 IST Sep 17 — out of the money by 16: 5th Pest Control Tycoon 629 ($100), 4th GT Rush 902 ($200), 7th The Good Life 479. Judging closes **Sep 18 12:00 PT = 00:30 IST Sep 19** (1d 02h 37m at the reading). Paid Meta flight complete ($70.05, 18 installs). *Twelve
Glasses* in consideration for Story & Video. Credits 98,805.

**Baseline:** balance **35 / 36 / 11 / 4 / 90**, sealed `sim/engine.ts` · `data/{enemies,towers,waves}.ts`.

<details><summary>Header as it stood on Sep 10–11 (kept as dated history)</summary>

**Last updated:** Sep 10 2026, evening IST
**Live:** **v1.7.0 public** · <https://w.run/puneetmakes/spice-expert-ramu> — went public Sep 5 2026 with the full audio layer; was v1.2.3 from Sep 4
**LIVE: v1.42.0 public** since Sep 9 — Challenge Mode only; the belt is gated behind `?test=1`. ✅ **The scripted FTUE, the visible win condition, the readable HUD and the hard-lock fix are all in front of real players.** Approval took well under an hour ([Specs.md](Specs.md) §9a).
**Private:** **v1.54.0** — Sep 11, identity confirmed `offroadinggamedev@gmail.com` before every deploy. Challenge Mode's build is **complete**: Round I (`ed2ef78`) · Round J stag tuning (`8a0cfab`) · dish-art race (`8d7802a`) · beam-chain safe zone (`b3bec13`) · visual tier 1 (`45cb996`) · Fryer remap + crossfade (`918b1f8`) · playtest round (`c9fa483`) · final polish (`99e1530`). ✅ **Every one verified from source and accepted** — [Implementation Handover Record](Implementation%20Handover%20Record.md). 🔒 **Review stays at v1.42.0 (Approved), Public at v1.42.0 — untouched.** No `set-public`/`set-private`/`update-tag` has ever been run.
✅ **The v1.42.0 hotfix is LIVE** — the wave-2 hard-lock is closed in production. 🔒 **We never promote directly**: the public tag rejects creator writes (400); RUN publishes on approving the review tag. [Specs.md](Specs.md) §9a
🔴 **Rank #4, down from #2 in a day** — $600 → $200. SHIFT (3 days old) passed us by **3 DUP**, 371 vs 368, gaining +69 to our +9. ➕ **The two entries above it have stalled** (+2 and +9), so **third place is three plays away**. 🔥 **Our plays/user (1.37) beats every entry ahead of us** — a distribution gap, not a quality or retention one. [Marketing Strategy.md](Marketing%20Strategy.md) §7.
✅ **The Challenge Mode level design is CLOSED and BUILT** — nine blocks, one belt, nine backdrops, real station art, the HUD rename, ghost slots, the coin sink: [LevelBlocks.md](LevelBlocks.md). ✅ **It is losable at every skill level** — `maxed-meta` loses at **90**, `balanced` at **34**, `fox-spam` at **35**, `miser` at **6**. ✅ **First paint is 115,885 B**, under a quarter of the pre-visual-round baseline, having *gained* nine backdrops and per-level station art.
🔴 **THE BUILD DEADLINE IS SEP 14, 23:30 IST — not Sep 19.** CP8 is *final deploy verified **public***; Sep 14–18 is the judging window with **no code changes possible**, and Sep 19 00:30 is only when scoring ends. ⚠️ **And shipping is not on our clock** — [Specs.md](Specs.md) §9a: only RUN writes the public tag, by approving `review`, with **no CLI to request approval** and an unmeasured lead time. Effective code freeze: **end of Sep 13**.
⏸️ **One round left, queued not yet dispatched** — the 140-unit build rail (§ the `002` schematic), the board re-anchored left in 580 units, the **gem-payout deflation** (triangular → linear; today one deep run pays 2.7× the entire meta tree), the end-screen copy still saying *"every **bug** that got past you"*, *"Tickets served"* → *"Dishes served"*, the last stale `desc`, and the glow shrink. Full task list and reasoning: [Implementation Handover Record](Implementation%20Handover%20Record.md). 🔴 **Held deliberately:** wave roster panel · same-archetype bumping · regenerating the other eight backdrops.
⚠️ **"Strictly increasing threat" is NOT a guarantee of increasing difficulty — retired Sep 11 2026.** `waveThreat` evaluates every entry at `speedMult = 1`, and speed is the lever that decides the loss window. Bookkeeping threat never falls across levels 1–120; **effective threat falls at 24 of them**, by up to 24%. Third recurrence of [Plan.md](Plan.md) item 62's pattern. Not re-tuned — the build deadline is Sep 14 — but **do not quote the proof as a difficulty guarantee**.
🔒 **Promotion is gated on assets, by the user Sep 11:** the review tag goes **only once the final dish art is actually placed** — not before. So: visual round lands → deploy → review → RUN approves → public, all before Sep 14 23:30.
🔴 **Challenge Mode races its own art, and new players lose the race.** `textures.ts`'s `artSquare` returns the drawn **insect silhouette** whenever a `dish-*` alias misses the cache at first request, and `makeEnemyTexture` then caches that silhouette for the whole run. All 22 dish PNGs exist and are registered — but in the **`deferred`** bundle, which is *background*-loaded. `kitchenScene.ts:374` awaits its deferred aliases explicitly (*"load on demand rather than trust background-load timing"*); **`towerScene.ts` awaits nothing.** Cold caches lose — which is exactly the first-time players DUP counts.
✅ **PROMOTABLE:** v1.39.0 is the **first public-deploy candidate since v1.7.0**. The Test Mode
entry is gated behind `?test=1` (`jam-entry/src/state/devMode.ts`), so Challenge Mode is the only
public route and it now has a scripted FTUE, stated win/lose and audio sliders.
🛑 **Promoting it is a separate, explicit decision** — `set-public` still must never run on a
Test Mode build, and the gate is what makes v1.39.0 not one. [GDD.md](GDD.md) §10.11c
**Jam board:** **rank #2** · 427 plays · **325 Daily Unique Plays** vs rank #1's **658** and rank #3's **279** — [Plan.md](Plan.md) §5.8 (full board read Sep 8 2026)
**Deadline:** Sep 19, 00:30 IST · **Scoring day rolls 05:30 IST** · 🛑 **Delivery gate: four cuisine nodes** — KitchenMode §6.8

</details>

---

## Status marks

| Mark | Meaning |
|---|---|
| `[x]` | Done |
| `[~]` | In progress / partial |
| `[ ]` | Not started |
| `[!]` | **Blocked — waiting on user** |
| `[-]` | Deferred or cut |

---

## Phases — task categories

| Phase | Category |
|---|---|
| **P0** | Pipeline & Setup |
| **P1** | Art & Identity |
| **P1.5** | Performance & Hygiene |
| **P2** | Board & Core Loop |
| **P3** | Return Loop |
| **P4** | Level Run & Content |
| **P5** | Audio |
| **P6** | Distribution |
| **P7** | Telemetry |
| **P8** | Craft Pass |
| **P9** | Hedge Entry |

---

## Sprints — time boxes

| Sprint | Days | Goal | State |
|---|---|---|---|
| **S0** | Sep 3 | Foundation & Ship | `[x]` Complete |
| **S1** | Sep 4–5 | First Contact | `[~]` **Active** |
| **S2** | Sep 6–8 | Return Loop | `[ ]` |
| **S3** | Sep 9–11 | Depth & Identity | `[ ]` |
| **S4** | Sep 12–14 | Lock & Verify | `[ ]` |
| **S5** | Sep 15–18 | Sustain & Share | `[ ]` |

---

## At a glance

| | |
|---|---|
| **Now** | 🔴 **P6 LinkedIn + daily reciprocity** — the only repeatable source of players, and still unposted · 📅 **Sep 6: measure the hint** (item 55) |
| **Next** | S2 return loop · P2 "Hands!" expedite — **both downstream of CP4**: a daily reward cannot retrieve a player who never understood the game |
| **Later** | Kitchen belt — **re-ranked down Sep 5**: it neither acquires nor retains (item 31) · S3 board layout + levels |
| **Decided** | Art direction — **Props for the room, Essentials for the line** (Sep 4, 22:05 IST). KayKit Phase 2a cut · **Kitchen mode ships as a second menu entry, 8 architecture calls settled** (Sep 4, 23:10 IST) |
| **🛑 Gate** | **Sep 10 — the FTUE node playable end to end, or it is cut.** 🔄 **Narrowed Sep 6** to Chai spawn-to-tray ([KitchenMode.md](KitchenMode.md) §6.3); the belt now sits on its own branch behind a private build, so it cannot damage the live entry. Art is **not** on this gate |
| **Live** | **v1.7.0 public** on all three tags since Sep 5, 14:10 IST — carries the upgrade hint |
| **📊 Measured** | **D1 retention 2.2%** (3 of 134) · **Sep 4 closed at 117 unique players from one Discord post** · wave-1→run-end **40%** |
| **Blocked on user** | Daily Discord reciprocity · the remaining 5 SFX cue picks · gain audition |

---

# S0 · Sep 3 · Foundation & Ship `[x]`

### P0 · Pipeline & Setup
- [x] Toolchain audit — `rundot` CLI verified
- [x] Account login — `offroadinggamedev@gmail.com`
- [x] Credits redeemed
- [x] Kit scaffolded — `september-jam-tower-defense`
- [x] Clean build — **CP2**
- [x] Game registered
- [x] Deployed
- [x] Public + approved — **CP3**

### P1 · Art & Identity
- [x] Content retheme — stations, tickets, palette, copy
- [x] Thumbnail — 512×512

### P2 · Board & Core Loop
- [x] MVP playable loop

### P0 · Fixes
- [x] HUD rebuild — hamburger, shift menu, Ready! button (v1.0.1)
- [x] Edge-constraint fixes (v1.0.1)

---

# S1 · Sep 4–5 · First Contact `[~]` **ACTIVE**

### P1 · Art & Identity
- [x] Title overflow fix — SVG `textLength` (v1.1.0)
- [x] 15 generated assets shipped + wired (v1.1.0)
- [x] **Art direction settled Sep 4, 22:05 IST — Props for the room, Essentials for the line.** Isometric furniture as background set-dressing behind the belt, at its own scale, with depth doing the separating. [PropSpriteIndex.md](PropSpriteIndex.md) §5
- [-] ~~KayKit 3D → sprite render pass~~ — **cut**, see Deferred

### P0 · Stability
- [~] App Check integrity wall — **no build action exists; it is a question, not a task.** The wall is Firebase-level on RUN's own hosting, served *before* our bundle loads, and the RUN platform docs never mention it — we cannot configure it, and probing it is disqualifying. Two legitimate moves: **(a)** fold it into the one Operators message that already carries items 33/34; **(b)** measure by subtraction — platform play count minus our `game_loaded` — which is **blocked until item 32 resolves**, because the platform's own two counters currently disagree 35 vs 47. Plan item 35

### P1.5 · Performance & Hygiene
- [x] Downscale 15 assets — 16.30 MB → 0.64 MB (v1.2.0)
- [x] Exclude `*.png.json` sidecars from `dist/` (v1.2.0)
- [x] Visual regression check after downscale
- [x] Repeatable `npm run art:resize` + masters kept in `art-source/`
- [x] **Closed the `textGen` surface** — v1.7.0. Original note: — **`jam-entry/rundot/textGen.config.json` → `{"disabled": true}`, then deploy.** One line. ⚠️ **Not** "cap to 0" and **not** "delete the file": RUN's own AI.md says deleting it falls back to *platform defaults* (~\$500/game/day), and `rundot deploy` recreates it anyway. `disabled` makes every call fail `AI_POLICY_DENIED`. Policy resolves from the **published `public` tag**, so it is inert until a deploy publishes. Plan item 17

### P7 · Telemetry
- [x] Diagnose — pipe works, only `game_loaded` is emitted
- [x] Wire core-loop events — 9 events live (v1.2.1)
- [x] Wire session-end events — `screen`/`trigger` confirmed routing
- [x] 6-step `run` funnel + determinism preserved
- [x] Verify events land in `analytics export`
- [~] Reserved bucket routing — `session_end` solved, `core_loop` open
- [ ] Ask RUN Operators the `core_loop_events_30d` name shape
- [ ] Join `game_loaded` → `menu_shown` for load-to-menu conversion

### P5 · Audio — ✅ **COMPLETE, live in v1.6.0**
- [x] 5 SFX WAVs supplied by user — **licence confirmed CC0, Sep 4**
- [x] First cue picks — 3 of 8 named by user
- [x] Convert to a web-shippable format — **42,793 B, v1.2.2**
- [x] Wire cues — `lose` / `upgrade` / `waveClear`, **corrected in v1.2.3**
- [x] **Gains auditioned against a real playthrough** — confirmed by ear on v1.5.0 Sep 5, 00:50 IST; the measured values held with no correction. Specs §8a.9
- [!] Remaining 5 cue picks — sizzle, plate-up bell, ticket-print, place, thud
- [x] **CDN plumbing for music** — Phases 4 + 4.1 landed, Specs §8a.4
- [x] MusicGen local pipeline — **installed + smoke-tested**, Specs §8a.3
- [x] **BGM tracks chosen Sep 4, 22:35 IST — all three, zero credits.** menu `bgm-menu-take1` · service_low `bgm-service-low-take1` · service_high `bgm-service-high-take2`. Specs §8a.7
- [x] **Phase 5 — three-cue music: convert, trim gains, wire the switch.** Shipped in v1.3.0. `MUSIC` is one `as const` with one `path` today ([audio.ts:109]) and `crossfadeToTrack` no-ops when a source exists, so this is a small feature, not a config edit. Gains **1.308 / 1.000 / 1.101** (Specs §8a.7b). Trigger: walkouts remaining **< 3**, one-way, reset on run start (Specs §8a.7c)
- [-] ~~mid-intensity cue~~ — dropped; three cues is the design, not four
- [x] **Phase 5.1 — cue exits.** `switchCue` on the three menu-return routes. Caught by ear, not by measurement: the danger cue carried into the main menu, and the pause-menu route had the same bug mid-run. Specs §8a.10
- [x] **Phase 5.3 — click feedback on 13 silent buttons.** Verified statically: 33 sounding handlers, exactly one with two `sfx` calls, and that one is correct. Specs §8a.10
- [x] **Phase 6 — `rundot game set-public`.** v1.6.0 on all three tags; review auto-approved. Tested live, no errors

### P2 · Kitchen mode — build order ([KitchenMode.md](KitchenMode.md) §3)
- [ ] **Leaderboard config + deploy** — `orders` / `shifts` board modes. 🔒 Irreversible; the boards must exist before anything submits
- [ ] **`SaveData.kitchen` branch + `v: 2`** — ⚠️ **additive, and do NOT bump `SAVE_KEY`**: `parse()` defaults missing fields, so moving `bestWave`/`meta` under a `td:` branch would wipe live players' gems. §2.2
- [ ] `AppState.mode` + `Kitchen (beta)` secondary button + the `App.tsx` branch
- [ ] **`sim/kitchen.ts` grey-box — this is the Sep 10 gate.** Belt, slots, one recipe, 5 walkouts, win/lose. Procedural textures throughout
- [ ] `mode` property on `run_start` / `run_end` / core-loop events
- [ ] Levels 2–5 from [RecipeList.md](RecipeList.md) §3
- [ ] **Tier placement + cost** — unlock a tier, place it dearer; lower tiers stay placeable. KitchenMode §6 decision 1
- [ ] **The loaner rule** — a level needing an unearned tier lends it for the round. Decision 6, and what keeps GDD §10.10's *no hard block* true
- [ ] **Masala carry-over** — a node's grinding level produces the container its later levels consume. Decision 8
- [ ] **Star evaluation + The Kitchen hub** — stars are 0 / ≤2 / cleared walkouts, and unlocks have to live somewhere
- [ ] **Boss mode** — terminates on walkouts, not on a ticket count; waves accelerate; chef hats scale with waves cleared. Decisions 10–12
- [ ] 🔒 **Re-pin the [PropList.md](PropList.md) §4 interaction graph in one pass** after the `Untagged/` sort — 3 of its 11 rows point at sprites that changed meaning in the rename pass. PropList §7.4
- [ ] Sprites — one PNG + one manifest line at a time, no code change per sprite
- [ ] Kitchen Props background layer at its own scale

### P6 · Distribution
- [x] **Posting schedule written Sep 5 — every post for the rest of the jam.** **LinkedIn 09:30 IST weekdays** (9 posts) · **RUN Discord 21:00 IST daily** (14 posts). 21:00 hits 11:30 ET and 17:30 CEST together, and leaves **8.5 h inside the scoring day**, which rolls at 05:30 IST. ⚠️ **The launch post waits for Monday Sep 7** — Sep 5 is a Saturday and LinkedIn weekend reach is ~half. Discord posts the same evening. Full copy + shot list: [Ramu's Service Rota](https://claude.ai/code/artifact/11d3ba93-9c72-4851-ae15-818e215a8446) (account-gated)
- [x] Choose posting channels — **LinkedIn + Discord only**
- [x] `rundot socials prepare` — launch packet + tracked links
- [x] Launch copy drafted for both surfaces
- [~] LinkedIn launch post — scheduled
- [x] First `#back-to-work` post — **posted Sep 4**
- [!] Daily reciprocal play-and-comment on other entries
- [ ] `socials mark-posted` for amplification
- [-] r/KitchenConfidential recognition post — no Reddit account

### P2 · Board & Core Loop
> Anti-reskin test (GDD §10.2) currently scores **2 of 4** — see Plan §1e.
- [ ] **"Hands!" expedite — primary mechanic 2 of 2, unstarted**
- [ ] **Component pips + station typing** — makes stations specialised
- [x] **Taught the second verb** — *"Tap a cook to upgrade"* on waves 2–4, v1.7.0, user-confirmed. ✅ **public since Sep 5, 14:10 IST**. Effect measured Sep 6. Item 55, Specs §8a.11
- [ ] Damage → doneness meter
- [ ] Walkout feedback — customer leaves, slip spiked
- [ ] Shift-end line in Ramu's voice
- [ ] Reconcile walkouts (10 vs frozen 5) and shift length
- [ ] Lane rail — deferred below the two above

### P0 · CP4 · Survive First Contact
- [~] Mobile pass — `rundot-mobile-ux`
- [ ] 🔴 **FTUE cold-open — 30-second beat sheet.** Promoted Sep 5: item 55 makes this the measured cause of 2.2% D1, not a polish task
- [ ] Stability — every SDK call in try/catch
- [ ] HANDS! expedite — primary mechanic 2
- [ ] 🔴 **CP4 gate** — first-timer reaches the fun in under 30 s, unaided. **Open since Sep 3; now the top build item** (items 31, 55)

### P0 · Pipeline
- [x] Git repository initialised — `main`, baseline commit
- [x] Public GitHub remote — `OffroadingGamer/Spice-Expert-Ramu`
- [ ] Add repo topics + website field

### P5 · Audio
- [!] Pick 8 SFX cues
- [ ] SFX implementation — per-station sounds
- [x] BGM track selection — **all three cues chosen Sep 4, 22:35 IST**, Specs §8a.7
- [ ] Credits/attribution screen — NCS + the two itch.io creators (KayKit dropped)

---

# S2 · Sep 6–8 · Return Loop `[ ]`

### P3 · Return Loop
- [ ] `rundot-feature-save` — versioned save blob
- [ ] `rundot-feature-stats` — Ramu's ledger
- [ ] `rundot-feature-daily-quests` — the day's prep list
- [ ] `rundot-feature-daily-rewards` — shift pay
- [ ] `rundot-feature-notifications` — comeback reminder
- [ ] Daily shift roll — seeded on the calendar day
- [ ] **CP5 gate** — reopening tomorrow is visibly different and rewarding

### P6 · Distribution
- [ ] Launch post — r/WebGames, X
- [ ] r/KitchenConfidential recognition post
- [ ] **CP6 gate** — shared on 3+ surfaces, uniques trending up

### P9 · Hedge Entry
- [ ] Story/Video entry — pest controller, night shift
- [ ] Publish hedge entry

---

# S3 · Sep 9–11 · Depth & Identity `[ ]`

### P2 · Board & Core Loop
- [ ] Lane rail — replace serpentine `CONFIG.path`
- [ ] Stations straddle the lane — `CONFIG.pads`
- [ ] `npm run balance` re-verification

### P4 · Level Run & Content
- [ ] Level data schema — format for user to fill
- [ ] Author ~18 levels — 3 cuisines × 6
- [ ] Cuisine progression + world select
- [ ] Re-cost Phase 4 against the kit's wave system

### P8 · Craft Pass
- [ ] Juice pass — feedback, transitions
- [ ] **CP7 gate** — a stranger can name one distinctive thing

---

# S4 · Sep 12–14 · Lock & Verify `[ ]`

### P8 · Craft Pass
- [ ] Final polish pass
- [ ] Cut-list execution — drop anything unfinished

### P0 · Release
- [ ] Final build + deploy
- [ ] `set-public` + poll all three channels
- [ ] **CP8 gate** — verified public + approved by **Sep 14, 23:30 IST**

---

# S5 · Sep 15–18 · Sustain & Share `[ ]`

### P6 · Distribution
- [ ] Daily share cadence
- [ ] Progress posts tied to visible changes
- [ ] **CP9 gate** — still sharing on Sep 18

### P0 · Monitoring
- [ ] Daily analytics pull
- [ ] Crash/error watch
- [ ] **Scoring ends — Sep 19, 00:30 IST**

---

## Deferred / cut

- [-] Cuisine 4+ beyond counter / tandoor / wok — level count is a treadmill
- [-] Runtime 3D rendering — pre-rendered sprites instead
- [-] **KayKit 3D → sprite render pass (Phase 2a)** — **cut Sep 4, 22:05 IST.** The art direction is now two 2D packs at two scales (Props behind the belt, Essentials on it). A third source, rendered from 3D at a fourth resolution and a fourth technique, is exactly the incoherence [PropSpriteIndex.md](PropSpriteIndex.md) §5 was written about. Also frees the Sep 10–12 craft pass: Phase 2a was a user-owned Blender render job that no longer has to happen
