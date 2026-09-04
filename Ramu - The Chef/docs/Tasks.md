# Tasks — Spice Expert: Ramu

> **Overview only.** This document is a glimpse of where we are and where we are headed.
> It carries task titles, phase tags and status marks — **nothing else**.
> Reasoning, measurements, findings and history live in the companion docs:
> [GDD.md](GDD.md) · [Plan.md](Plan.md) · [Specs.md](Specs.md) · [Retro.md](Retro.md).

**Last updated:** Sep 4 2026, 21:03 IST
**Live:** v1.2.3 public · <https://w.run/puneetmakes/spice-expert-ramu>
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
| **Now** | S1 · **P5 BGM (CDN plumbing + MusicGen)** · P6 LinkedIn + daily reciprocity · P2 core-loop read |
| **Next** | S1 · CP4 items · P2 core-loop read |
| **Later** | S2 return loop **(re-ranked up — two-surface audience)** · S3 board layout + levels |
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
- [ ] KayKit 3D → sprite render pass

### P0 · Stability
- [ ] Characterise the App Check integrity wall — can it hit real players?

### P1.5 · Performance & Hygiene
- [x] Downscale 15 assets — 16.30 MB → 0.64 MB (v1.2.0)
- [x] Exclude `*.png.json` sidecars from `dist/` (v1.2.0)
- [x] Visual regression check after downscale
- [x] Repeatable `npm run art:resize` + masters kept in `art-source/`
- [ ] Close `textGen` 500k/day credit cap

### P7 · Telemetry
- [x] Diagnose — pipe works, only `game_loaded` is emitted
- [x] Wire core-loop events — 9 events live (v1.2.1)
- [x] Wire session-end events — `screen`/`trigger` confirmed routing
- [x] 6-step `run` funnel + determinism preserved
- [x] Verify events land in `analytics export`
- [~] Reserved bucket routing — `session_end` solved, `core_loop` open
- [ ] Ask RUN Operators the `core_loop_events_30d` name shape
- [ ] Join `game_loaded` → `menu_shown` for load-to-menu conversion

### P5 · Audio
- [x] 5 SFX WAVs supplied by user — **licence confirmed CC0, Sep 4**
- [x] First cue picks — 3 of 8 named by user
- [x] Convert to a web-shippable format — **42,793 B, v1.2.2**
- [x] Wire cues — `lose` / `upgrade` / `waveClear`, **corrected in v1.2.3**
- [ ] Audition the three gains against a real playthrough
- [!] Remaining 5 cue picks — sizzle, plate-up bell, ticket-print, place, thud
- [x] **CDN plumbing for music** — Phases 4 + 4.1 landed, Specs §8a.4
- [x] MusicGen local pipeline — **installed + smoke-tested**, Specs §8a.3
- [ ] BGM tracks — menu / service-low / mid / high, all 112 BPM A minor

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
- [ ] Damage → doneness meter
- [ ] Walkout feedback — customer leaves, slip spiked
- [ ] Shift-end line in Ramu's voice
- [ ] Reconcile walkouts (10 vs frozen 5) and shift length
- [ ] Lane rail — deferred below the two above

### P0 · CP4 · Survive First Contact
- [~] Mobile pass — `rundot-mobile-ux`
- [ ] FTUE cold-open — 30-second beat sheet
- [ ] Stability — every SDK call in try/catch
- [ ] HANDS! expedite — primary mechanic 2
- [ ] **CP4 gate** — first-timer reaches the fun in under 30 s, unaided

### P0 · Pipeline
- [x] Git repository initialised — `main`, baseline commit
- [x] Public GitHub remote — `OffroadingGamer/Spice-Expert-Ramu`
- [ ] Add repo topics + website field

### P5 · Audio
- [!] Pick 8 SFX cues
- [ ] SFX implementation — per-station sounds
- [ ] BGM track selection
- [ ] Credits/attribution screen

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
