# Tasks — Spice Expert: Ramu

> **Overview only.** This document is a glimpse of where we are and where we are headed.
> It carries task titles, phase tags and status marks — **nothing else**.
> Reasoning, measurements, findings and history live in the companion docs:
> [GDD.md](GDD.md) · [Plan.md](Plan.md) · [Specs.md](Specs.md) · [Retro.md](Retro.md).

**Last updated:** Sep 5 2026, 14:15 IST
**Live:** **v1.7.0 public** · <https://w.run/puneetmakes/spice-expert-ramu> — went public Sep 5 2026 with the full audio layer; was v1.2.3 from Sep 4
**Deadline:** Sep 19, 00:30 IST · **Scoring day rolls 05:30 IST**

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
| **🛑 Gate** | **Sep 10 — belt playable end to end, or it is cut.** [KitchenMode.md](KitchenMode.md) §5 — ⚠️ its stated justification (D1 at 0.0%) is now **measured at 2.2%**, which strengthens the cut case |
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
- [ ] Sprites — one PNG + one manifest line at a time, no code change per sprite
- [ ] Kitchen Props background layer at its own scale

### P6 · Distribution
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
