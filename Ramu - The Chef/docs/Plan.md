# Plan — Spice Expert: Ramu

> **Forward-looking.** What we intend to do, in what order, by when.
> Companion docs: [Tasks.md](Tasks.md) (status at a glance) · [GDD.md](GDD.md) (what the game is) ·
> [Specs.md](Specs.md) (how it is built) · [Retro.md](Retro.md) (what actually happened).
>
> **Update rule:** revise on every iteration, progressive *or* regressive. When a
> plan item slips or is cut, do not silently delete it — strike it, move it, and
> log the reason in [Retro.md](Retro.md).

**Last updated:** Sep 4 2026, 21:03 IST (read from the system clock)
**Status:** ▶ **LIVE — v1.1.0** at https://w.run/puneetmakes/spice-expert-ramu since ~15:05 PT Sep 3. Scoring clock running.
**Scope:** cuisine level run (GDD §10.10) · SFX at P1 (§12) · 3D→sprite art pipeline (§11a).

---

## 1. The rule that shapes the whole plan

Score = **Total Unique Daily Plays** — unique players summed *per calendar day*, from
the moment the entry is published until **Sep 18, 12:00 PT**.

Two consequences, and every date below follows from them:

1. **Publishing early is the highest-leverage act available.** Updates never reset the
   entry or its play count. Ship rough, improve in place.
2. **A player returning on 8 different days is worth 8× one who plays once.** The
   return loop outranks polish, and it outranks the second entry.

---

## 1a. Working model — two agents (adopted Sep 3, ~16:00 PT)

| Role | Owns | Never does |
|---|---|---|
| **Planning agent** (this context) | Strategy · phase definition · acceptance criteria · **all four `docs/` files** · analysis of return handovers | Does not write game code |
| **Implementation agent** (parallel) | All code in `jam-entry/` · asset generation · builds · deploys · device verification | **Never edits `docs/`**; never renames kit IDs without the full multi-file recipe |

**Protocol.** Planning agent issues a self-contained phase handover in chat (the
implementation agent has none of this context, so every handover restates identity,
paths, IDs, guardrails and acceptance criteria). Implementation agent completes the
phase and returns a fixed-format `PHASE N REPORT`. Planning agent verifies against
acceptance criteria and records outcomes here and in [Retro.md](Retro.md).

> 🔒 **The human gate (user, Sep 4, 08:05 PT). A return handover is never answered
> with another handover.** Verification is followed by a **brief to the user** — what
> landed, what was found, what it costs, what the options are — and then a **full
> stop**. The next phase handover is written *only* after explicit approval to proceed.
> Sequencing decisions belong to the user, not to the planning agent. Standing rule and
> rationale: [Retro.md](Retro.md) §0a.

**Standing guardrails included in every handover:** account guard
(`rundot whoami` = `offroadinggamedev@gmail.com`) · only game `PpB5gECS0AMU49mGYAKM` ·
keep `kitId` · engine stays pure · `tsc --noEmit` before deploy · **every deploy lands
private, `set-public` must be re-run** · retry a signed-URL 500 once · no em dashes in
player copy · minimum text size `1.1rem`.

---

## 1b. Phase queue

| Phase | Scope | State |
|---|---|---|
| **0** | Retheme, publish, HUD/shift-menu fixes | ✅ **Done** — v1.0.1 public + approved |
| **1** | **Title overflow fix + 15 real art assets** | ✅ **Done — v1.1.0 public.** Title fix verified at 320/390/430; 15/15 assets shipped and wired. **Two defects found in review — folded into Phase 2, see §1c** |
| **1.5** | **Payload + hygiene fixes from the Phase 1 review** (§1c) | 🔴 **Blocking, ship before any distribution push.** 16.30 MB preload and 15 metadata sidecars on a public build |
| 2 | **Board layout → an actual ticket rail** (`CONFIG.path` + `CONFIG.pads`) | ⬜ Spec in progress. The change that makes the theme structural rather than cosmetic; strongest remaining Editor's Pick lever. **Requires `npm run balance` after, since path length changes difficulty** |
| 3 | Return loop (the five `rundot-feature-*` skills) | ⬜ Sep 6–8, unchanged priority |
| 4 | Level run — cuisines + progression | ⬜ **Re-cost pending.** ~9 h estimate is stale: the kit already ships authored waves, deterministic endless generation, and a headless balance simulator |

### Phase 1 spec (issued, for the record)

**Task 1 — title overflow.** `src/ui/MainMenu.tsx`. Root cause: `--game-w` is `100vw`,
so `calc(var(--game-w) * 0.115)` ≈ 44.85px on a 390px phone, and 12 uppercase bold
characters overflow. **Two fixes failed because both hand-estimated glyph widths.** The
issued fix uses SVG `<text textLength="…" lengthAdjust="spacingAndGlyphs">` inside a
`viewBox`, which forces exact width regardless of font metrics, making overflow
structurally impossible. Verify at 320 / 390 / 430px.

**Task 2 — 15 art assets.** Generate with a fixed `--seed 4471` and an identical style
clause for cohesion; author at 2× display size; `--remove-background`. Aliases:
`enemy-beetle` (dal tadka), `enemy-wasp` (masala chai), `enemy-snail` (biryani handi),
`enemy-hornet` (masala dosa), `enemy-stag` (**full thali**, boss ticket), `tower-fox`
(grill), `tower-owl` (prep board), `tower-bear` (tandoor), `tower-squirrel` (fryer),
`proj-fox` / `proj-owl` / `proj-bear`, `pad`, `pad-gold`, `burrow`. Wire each into the
`critical` bundle in `src/assets/manifest.ts`. **Zero code changes** — listed art wins
over the procedural placeholder automatically.

**Excluded on purpose:** `grass-tile` (must tile seamlessly on both axes; AI generation
reliably fails that, and the procedural floor is already recoloured). **Kit IDs are not
renamed** in this phase.


### 1c. Phase 1 review — what the planning pass found (Sep 4, 07:20 PT)

The return handover reported *"broken / uncertain: none."* Build correctness was
indeed clean — `tsc` passes, the title fix is exactly the specced SVG `textLength`
primitive, 15/15 aliases are wired, and v1.1.0 is on all three channels. Independent
verification confirmed all of that.

Two defects sit **outside** the correctness envelope the implementation agent was
checking, which is why an independent review pass exists.

#### 🔴 Defect 1 — 16.30 MB of blocking preload

Every generated asset is **1024×1024**, and all 15 are in the `critical` bundle, which
is awaited *before first interaction*.

| Measure | Value |
|---|---|
| Critical bundle | **16.30 MB** across 15 PNGs |
| `dist/` total | 17.36 MB |
| Decoded texture memory | **60 MB** (RGBA, 15 × 1024×1024) |
| Blocking preload @ 5 Mbps | **27.3 s** |
| @ 10 Mbps | 13.7 s |
| @ 25 Mbps | 5.5 s |

On-screen these sprites draw at roughly 64–96 px. **1024 px is 10–16× oversampled.**

Why this is scored as blocking rather than as polish: the metric is *unique players*,
and most arrive on a phone by tapping a link. A 27-second grey screen before anything
is interactive is a player-loss defect — it fails precisely the people distribution
is about to bring in. **The fix must land before the distribution push, not after.**
It costs zero credits: a local downscale, with the 1024 masters kept as masters.

#### 🟠 Defect 2 — 15 generation sidecars published

`rundot generate image` writes a `<asset>.png.json` beside each PNG, and all 15 were
copied into `dist/` and deployed. Each contains the generation `prompt`, `model`,
`seed`, a `generationId`, and a storage URL embedding the game ID **and a creator
account identifier**.

These are not credentials and nothing is exploitable through them. They are internal
metadata with no reason to exist on a public site, and they publish the art prompts
verbatim. Exclude from the build; keep them locally, they are useful provenance.

#### 🟡 Unexplained, logged not assumed

Credits **rose** across the phase: ~125,980 → **132,275**, while 2,325 was spent on
17 `imagegen` calls (15 assets + 2 retries, consistent with the reported rate-limit
backoff). A net **+8,620** arrived from somewhere — most likely a jam participation
grant. Recorded as unexplained rather than as income until confirmed.

#### Verified true, for the record

| Claim | Verdict |
|---|---|
| v1.1.0 on Private/Review/Public | ✅ confirmed via `rundot game info` |
| Title fix at 320/390/430 | ✅ SVG `textLength` + `lengthAdjust`; screenshots read correctly |
| 15/15 assets, `grass-tile` excluded | ✅ manifest and `public/images/` both match |
| Credits used 2,325 | ✅ matches `rundot credits` exactly |
| No deviations from spec | ✅ true as written |
| Screenshots delivered | ✅ all six — in `jam-entry/references/`, not the docs-side `references/` |

---

## 1d. Theme conversion — making the loop read as a kitchen

*Analysis Sep 4, in answer to "is this going to end up looking like the current version
of tower defence, and what can we do to exhibit the core loop properly?"*

**Answer: yes, if we stop at v1.1.0.** Phase 1 changed the art; it did not change the
grammar. Three structural facts say "tower defence" louder than any texture, and each is
the opposite of how a kitchen works:

| The build says | A kitchen says |
|---|---|
| The path is a **maze** | A pass is a **line** |
| Stations sit **beside** the path and shoot at things going past | A dish passes **through** a station and comes out changed |
| Enemies have **health that drains** until they die | A dish has **doneness that fills** until it is ready |

The root of it is a verb mismatch: **shooting is not cooking.**

### Ranked by read-per-hour

| # | Change | Why it works | Cost |
|---|---|---|---|
| **1** | **Damage → doneness.** Flip the bar to *fill*. "Killed" becomes "plated" | Same numbers, opposite meaning. The single biggest reframe available, and it is pure presentation — no sim change, no balance re-run | **~1 h** |
| **2** | **Maze → lanes.** Straight vertical rail; tickets enter top, the pass is the bottom edge | A maze is a puzzle about routing; a line is a kitchen. PvZ is the reference, not Bloons | ~3 h · `CONFIG.path` · **needs `npm run balance` after** |
| **3** | **Stations straddle the lane** rather than sitting beside it | Even with the shooting sim untouched underneath, the read becomes preparation | folded into 2 · `CONFIG.pads` |
| **4** | **Walkout feedback** — a customer leaving and a slip spiked, not a life counter ticking down | The failure state is where theme lands hardest | ~1 h |
| **5** | **SFX** — sizzle on entering a grill's range, bell on plate-up, ticket-printer chatter on rush start | Sound does more thematic work per hour than art | ~2 h · **unblocked**; 3 non-thematic cues in flight (Phase 3), but *these three* still need picks — they are the ones that do the theme work |
| 6 | Projectiles → heat bursts and steam, or none for the tandoor | Lowest leverage; the sim expects projectiles | later |

### The shape that matters for sequencing

**Items 1, 4 and 5 are presentation, not structure.** They do not touch the sim, need no
balance re-run, and together cost roughly half a day — the "cheap reframe bundle". Item 2
is the structural change and is the real Phase 2.

**Standing tension, unresolved and the user's to call:** this competes for Sep 6–8 with the
return loop (CP5, 25 % of effort). **Theme conversion wins Editor's Pick; the return loop
wins Total Unique Daily Plays**, which is the prize actually being scored. Planning
recommendation on record: **Phase 1.5 → cheap reframe bundle (1, 4, 5) → return loop →
lane rail.**


### 1e. 🔒 Design conformance audit — how close is the build to the frozen GDD? (Sep 4, 14:55 IST)

*Written in answer to "how close are we getting towards the actual proposed gameplay?"
Every row was checked against source, not against memory.*

**Headline: the shell is nearly finished and the kitchen is barely started.** What is live
is a competent, well-themed tower defence. It is not yet the game GDD §10 describes, and
the gap is not art — it is two mechanics.

#### The anti-reskin test (GDD §10.2), scored

The GDD sets its own pass/fail: *"strip the kitchen art off and the mechanics still
describe a kitchen — a timed queue, parallel stations specialised by dish type, a hard
boundary, a manual expedite."*

| Criterion | Status | Evidence |
|---|---|---|
| A timed queue | ✅ | waves down a path, `data/waves.ts` |
| **Parallel stations specialised by dish type** | ❌ | `data/towers.ts` stats are damage / speed / range. Every station works every ticket |
| A hard boundary | ✅ | the pass, `livesCost` on leak |
| **A manual expedite** | ❌ | "Hands!" does not exist in any form |

**2 of 4. The build currently fails the test the GDD wrote for it.** Strip the art off
today and what remains describes a tower defence.

#### Core loop (GDD §10.1), step by step

| # | Step | Status | Where it stands |
|---|---|---|---|
| 1 | READ THE RAIL — tickets show the components they need | ❌ | `EnemyDef` has a single `hp`. A ticket is a health bar; you cannot read what it needs |
| 2 | SET THE LINE — tap a slot beside the rail | ✅ | kit-native placement, `actions.placeTower`. But pads sit around a serpentine path, not *beside a rail* |
| 3 | WORK THE PASS — tap a ticket to call "hands" | ❌ | not started |
| 4 | SERVE OR LOSE | ⚠️ | bounty-on-kill ✅, walkout-on-leak ✅ — but `startLives: 10`, and the GDD freezes **five** walkouts. "Served" is a kill, not a completion |
| 5 | BETWEEN RUSHES — spend the shift's pay | ✅ | build phase, `waveBonus`, meta upgrades, all persisted |

**Two of five shipped, one partial, two missing — and the two missing ones are the two that
make it a kitchen rather than a battlefield.**

#### Primary mechanics (GDD §10.3 — capped at 2, both frozen)

| # | Mechanic | Status |
|---|---|---|
| 1 | Station placement & upgrade | ✅ **shipped** |
| 2 | **"Hands!" expedite** | ❌ **not started** — GDD budget was *~1 evening, Day 2* |

**One of two.** The GDD's own note on the missing one: *"Converts watching into playing; it
is the skill ceiling."* Right now the player sets a line and then watches it work. That is
the single largest experiential gap in the project.

#### Secondary mechanics (§10.4) and return loop (§10.9)

Both §10.4 items marked *do not cut* — the **daily modifier** and the **shift-end line in
Ramu's voice** — are unbuilt. The second is near-zero cost and the GDD says it *"carries the
entire 'real story' for editors."*

Return loop, 1 of 5 installed: `save` ✅ (versioned, `state/save.ts`); `stats` ⚠️ (gems and
meta levels persist, but there is no lifetime **tickets-served ledger**, which is the
emotional spine of §10.8); `daily-rewards`, `daily-quests`, `notifications` all ❌.

#### Numbers that drifted from the frozen spec

| Spec | GDD | Build |
|---|---|---|
| Walkouts to end a shift | **5** | 10 (`economy.startLives`) |
| Shift length | **90 seconds** | ~8–10 min for a full run; one measured `run_end` was 102 s for *two* waves of 13 + endless |
| Station specialisation | one component type each | universal |

A 90-second shift and a 10-minute run are different games. The GDD's daily-rotation return
loop assumes a session you can finish on a break; the build assumes a sitting.

#### What this changes about §1d

§1d ranked **"damage → doneness (~1 h, pure presentation)"** first. That was the cheap
cosmetic version of GDD §10.1 step 1, which actually asks for **component pips** — a ticket
made of parts, each serviced by a station type. That is mechanical, not presentational, and
it is what makes stations specialised (anti-reskin criterion 2). §1d undersold its own top
item.

**Revised recommendation.** Two changes take the anti-reskin score from 2/4 to 4/4:

1. **"Hands!" expedite** — §10.3 mechanic 2. ~1 evening, no sim risk if it is an event on
   the consumer side. Converts watching into playing.
2. **Component pips + station typing** — §10.1 step 1 and §10.2 criterion 2. Touches
   `EnemyDef`, `towers.ts` and the engine's damage application, so it **needs
   `npm run balance`** and is the genuinely structural change.

Both are cheaper than the level run and worth more than any further art. **The lane rail
(§1d item 2) can wait — it is the most visible change and the least load-bearing one.**

> **Still open and still the user's call:** this competes with the return loop for Sep 6–8.
> Nothing in this audit resolves that tension; it only says that *if* theme work is chosen,
> "Hands!" and component pips outrank the board geometry that §1d put first.

---

## 2. Timeline

### 🔒 2.0 The clock — IST-first (set by user, Sep 4)

**All planning times are IST (GMT+5:30) from here on.** PT appears in brackets because
the jam's own deadlines are published in PT.

**IST = PT + 12:30.**

#### The fact that changes scheduling

A **scoring day is not your calendar day.** RUN buckets plays by a day boundary that is
*not* IST — confirmed from data: our two Sep 3 sessions ran at **02:30–04:00 IST on
Sep 4** and RUN logged them as **2026-09-03**.

**✅ PT midnight is ruled out — measured Sep 4, 12:14 IST.** At that moment the PT
clock read **Sep 3, 23:44** (PT is IST minus 12:30), yet `daily_activity_30d` already
held a populated **`2026-09-04`** row with 31 sessions. A PT-bucketed day that has not
started cannot contain sessions.

| Candidate boundary | Your scoring day flips at… | Status |
|---|---|---|
| **UTC midnight** | **05:30 IST** | ✅ **Working assumption** — fits all data; platform default |
| IST midnight | 00:00 IST | 🟡 Not excluded by today's sample, but no platform buckets in IST |
| PT midnight | 12:30 IST | ❌ **Ruled out** |

> **Practical rule: your scoring day runs 05:30 IST → 05:29 IST the next morning.**
> Which means your whole normal waking day sits inside **one** scoring day. This is far
> friendlier than the 12:30 IST midday split assumed earlier — and it means "today" needs
> no mental arithmetic: if you are awake and it is after 05:30, it is today.

**⚠️ Correction to earlier entries.** Timestamps written before Sep 4 12:14 IST were
*computed* from an assumed PT anchor and are wrong by roughly half a day — several read
"Sep 4 morning PT" for moments that were actually Sep 3 night PT. **Trust the dates, not
the clock times, in any entry stamped before this one.** All times from here are read
from the system clock.

### 2.1 📈 Traffic reality — measured Sep 4, 12:14 IST

**The entry is being played by real strangers, with zero distribution done.**

| Scoring day (UTC) | Sessions | **Unique players** | Median session |
|---|---|---|---|
| Sep 3 (Day 0) | 17 | **9** | 301 s |
| Sep 4 (Day 1, ~7 h elapsed) | 31 | **26** | 118 s |
| | | **35 cumulative** | |

Jam board: **rank #3, 13 plays.**

**Platform mix — the number that sets today's priority:**

| Platform | Sessions | Unique players |
|---|---|---|
| **mobile-web** | 31 | **26** |
| web | 15 | 7 |
| android | 2 | 2 |

**Three quarters of real players are on mobile-web** — precisely the population that
pays the full cost of the **16.30 MB blocking preload** shipped in v1.1.0. This converts
Phase 1.5 from a hygiene task into the highest-value work available: every hour it stays
unfixed, ~26 phone players a day meet a 27-second grey screen first.

> **⚠️ Analytics lag is real.** Sep 3 first reported **2** uniques and later settled at
> **9**. Do not treat a same-day export as final, and do not draw conclusions from the
> current day's partial row. The earlier "2 plays, both of them us" reading in this
> document's history was made on incomplete data — it was wrong in magnitude, though the
> conclusion it supported (nothing has been shared yet) still holds.

#### Deadlines in your time

| Gate | Published (PT) | **Your clock (IST)** |
|---|---|---|
| **Scoring ends / jam deadline** | Sep 18, 12:00 PT | **Sep 19, 00:30 IST** — half past midnight |
| **CP8 — final deploy verified public** | Sep 14, 11:00 PT | **Sep 14, 23:30 IST** |
| One scoring day, e.g. "Sep 5" | Sep 5, UTC | **Sep 5 05:30 → Sep 6 05:29 IST** |

#### Day numbering

**Dates are authoritative; day numbers are a convenience.** Where a document gives both,
the date wins.

| User's numbering | Scoring date | IST working window | What it is |
|---|---|---|---|
| **Day 0** | Sep 3 | Sep 3 05:30 → Sep 4 05:29 | Setup, MVP, publish. CP0–CP3. ✅ **Complete** — **9 unique players** |
| **Day 1** | Sep 4 | Sep 4 05:30 → Sep 5 05:29 | Survive first contact (CP4) + first distribution. **In progress — 26 uniques by 12:14 IST** |
| Day 2 | Sep 5 | Sep 5 05:30 → Sep 6 05:29 | ″ CP4 window closes |
| Days 3–5 | Sep 6–8 | ″ | Return loop (CP5) |

Earlier text in [Retro.md](Retro.md) and the frozen [GDD.md](GDD.md) used an off-by-one
scheme where Sep 3 was "Day 1", and expressed times PT-first. **Read every such
reference by its date.** The GDD is frozen and is not being rewritten for this.

#### One consequence worth carrying into Phase 3

The return loop's day rollover (daily quests, shift pay, the daily shift roll) will flip
on RUN's **server** boundary. For you that is **05:30 IST** — early morning, so a
rollover *can* be observed across a normal night's sleep. Keep using trusted server
time in the code, never `Date.now()`.

| Phase | Dates (PT) | Effort share | Checkpoint |
|---|---|---|---|
| Concept lock | Sep 3, ~1.5 h | 2 % | CP1 ✅ |
| **Rough playable → public** | **Sep 3, tonight** | 15 % | **CP3** ⬜ |
| Mobile + FTUE + stability | Sep 4–5 | 20 % | CP4 ⬜ |
| Return loop | Sep 6–8 | 25 % | CP5 ⬜ |
| Distribution (daily, ongoing) | Sep 4–18 | 20 % | CP6 ⬜ |
| **Level run — 3 cuisines, ~18 levels** | **Sep 8–10** | **~9 h** | — ⬜ |
| Craft pass (Editor's Pick) — trimmed 8 h → 5 h | Sep 10–12 | 10 % | CP7 ⬜ |
| Story/Video hedge entry | ~Sep 8, one evening | 3 % | — ⬜ |
| Final deploy verified | Sep 14, **by 11:00 PT** | — | CP8 ⬜ |
| Judging-window sharing | Sep 14–18 | — | CP9 ⬜ |

**Hours budget:** 40–60 h total · **< 1 h tonight** (pipeline-only).

---

## 3. Tonight — the only phase that is time-critical

Budget is under an hour, and ~20 minutes of that is pure plumbing. Sequence is fixed;
do not reorder, do not polish before `set-public`.

| # | Step | Command | Est. | Done |
|---|---|---|---|---|
| 1 | Scaffold from the official kit, sibling folder, no spaces | `rundot jam init september-jam-tower-defense jam-entry` | 2 m | ✅ |
| 2 | Install deps | `npm install` | 3 m | ✅ |
| 3 | Pull SDK docs for the agent | `npx rundot-sdk-setup` | 1 m | ✅ |
| 4 | Read `rundot/docs/` + `rundot-sdk` skill **before any SDK code** | — | 3 m | ✅ |
| 5 | Build the MVP (§14 of the GDD) | — | ~25 m | ✅ |
| 6 | Clean build, `./dist` exists | `npm run build` | 2 m | ✅ **CP2** |
| 7 | Register the game | `rundot init --name "Spice Expert: Ramu" --description "<pitch>"` | 1 m | ✅ |
| 8 | Deploy → private share URL + QR | `rundot deploy` | 3 m | ✅ |
| 9 | **Play it on a real phone.** Fix only what makes it *unplayable* | — | 5 m | ✅ User tested, filed 2 UI bugs, both fixed in v1.0.1 |
| 10 | Go public — submits for review | `rundot game set-public` | 1 m | ✅ |
| 11 | Verify it landed | `rundot list-games` | 1 m | ✅ **CP3 PASSED** — v1.0.0 approved and public ~15:05 PT |

> **CP3 is the checkpoint that decides the ceiling.** Review is not instant, so
> `set-public` runs while you sleep. Every hour before this is score that cannot be
> recovered.

**Tonight's definition of done:** status is public + approved, and the entry is on the
leaderboard (~5 min after approval).

---

## 4. Day-by-day

### Sep 4–5 · Survive first contact (CP4)
Priority order is fixed — mobile before FTUE before everything else, because a game
that feels wrong on a phone loses players at the door.

- [ ] **Mobile pass** — `rundot-mobile-ux`. Portrait-first, layout anchored to
      corners/edges (never absolute coordinates), safe-area insets, touch-safe hit targets
- [ ] **HANDS! expedite** (primary mechanic 2) — the thing that converts watching into playing
- [ ] **FTUE cold-open** — `rundot-ftue-onboarding` + `rundot-feature-tutorial`.
      The 30-second beat sheet in GDD §5. No wall of text; teach by doing
- [ ] **Stability** — every SDK call in try/catch. An unhandled rejection crashes the game
- [ ] **SFX pass (promoted to P1, GDD §12)** — 8 cues: sizzle, bell, ticket-print, place
      ping, thud, fryer drop, tandoor whoosh, wok toss. Every station gets its **own**
      working sound so the line can be heard without being watched. **User picks; agent
      requests specific cues by name and timing.** Mute parity holds — every cue keeps a
      visual twin
- [ ] Ship: `npm run build && rundot deploy --bump Patch`

**CP4 passes when** a first-time player on a phone reaches the fun in under 30 seconds
without being told anything. Test on someone who has not seen it.

### Sep 6–8 · The return loop (CP5) — the score multiplier
Install these; do not hand-build them. All ship copy-in TypeScript.

- [ ] `rundot-feature-save` — versioned `appStorage` blob. Everything below depends on it
- [ ] `rundot-feature-stats` — **Ramu's ledger**: lifetime tickets served, walkouts, days worked
- [ ] `rundot-feature-daily-quests` — **the day's prep list**, seeded deterministic day roll
- [ ] `rundot-feature-daily-rewards` — **shift pay**, forgiving track, no streak reset
- [ ] `rundot-feature-notifications` — *"Shift starts in ten. Rail's already filling."*
- [ ] Daily shift roll: menu + rush curve + one named modifier, seeded on the calendar day

**CP5 passes when** closing the game and reopening it *tomorrow* produces a visibly
different, rewarding experience — and a notification invites it.

> Trusted server clock is mandatory. Device-clock farming would put us inside the
> anti-gaming rule that voids **all** entries.

### Sep 8 · Story/Video hedge — one evening
Separate $500 pool, 3 awards, no kit required, editorially judged, much smaller field.
Subject: **pest controller, night shift** — the concept killed from the game track on
expected value, where its aversive share card costs nothing.

- [ ] Build in Story Studio or Video Studio · [ ] Publish · [ ] Credit solo

### Sep 8–10 · Level run — cuisines and progression (~9 h)

**Only starts once CP5 has passed.** See [GDD.md](GDD.md) §10.10 and
[Specs.md](Specs.md) §6a. If the return loop is not live by Sep 9, **this is cut**.

- [ ] Level data schema + loader (~1.5 h) — JSON array, validated on load
- [ ] Level runner + 3 star conditions (~2 h) — reuses the daily-quest progress machinery
- [ ] Progression strip (~2 h) — scrollable vertical node list, portrait. **No map, no
      winding path, no camera pan, no per-world art.** If it exceeds ~2 h, downgrade to
      a plain numbered list
- [ ] Cuisine unlocks + save fields (~0.5 h) — piggybacks the existing save blob
- [ ] **Author + tune ~18 levels (~2.5 h) — user-owned**, 3 cuisines × 6
- [ ] Verify: unlocked cuisines feed Today's Shift ticket mix
- [ ] Verify: no star gate can hard-block; every gate clearable by replay
- [ ] Verify: a first-time player cold-opens into level 1 and never sees the strip first

### Sep 10–12 · Craft pass (CP7) — Editor's Pick, $300, independent of plays

**Trimmed from 8 h to 5 h** to absorb the level run.

- [ ] **Art Phase 2a — pre-rendered 3D sprites (GDD §11a).** User renders KayKit props
      in Blender at a fixed angle + light rig → transparent PNG → one atlas → skin-layer
      tokens. **Zero credits, one draw call, no runtime 3D.** Licence verified first
- [ ] **Art Phase 2b — generated backgrounds, Ramu, marketing** via
      `rundot generate image --reference-image <user art> --remove-background`. Credits
      go here, where generation beats pre-rendering
- [ ] Music: theme- and pace-matched, layered by rush stage so the track reports pressure
      (SFX already shipped on Sep 4–5 — no longer part of this pass)
- [ ] Shift-end line in Ramu's voice, drawn from the day's performance
- [ ] Entry page: sharp name, sharp description, clean first 30 seconds

**CP7 passes when** someone who has never played can name one thing that makes it
distinctive. "It's polished" is not enough.

### Sep 12–13 · Tuning and buffer
- [ ] Rush-curve tuning · [ ] Daily-variance tuning · [ ] Deliberate slack for overrun

### Sep 14 · Pencils down — **finish by 11:00 PT, not 11:59**
- [ ] `npm run build` → `rundot deploy --bump Minor` → **`rundot game set-public`** → `rundot game info`
- [ ] **Every deploy lands private.** `set-public` must be re-run per version and review is not instant (Specs §9)
- [ ] `rundot game info` **Public** channel shows the new version, not just Private/Review
- [ ] Solo credit present on the entry
- [ ] On-theme, original, no copyrighted characters/art, no real people depicted
- [ ] Built from an official kit ✅
- [ ] Plays correctly from the public link on a phone never used for it

### Sep 14–18 · Judging window (CP9) — **most people quit here; this is free score**
No code changes possible. Four more calendar days, each a fresh scoring day.
- [ ] Post the share link daily · [ ] Fire re-engagement notifications
- [ ] Play and comment on other entries · [ ] Watch the board and push near a placement

---

## 5. Distribution — daily, 15 minutes, non-negotiable

*Expanded Sep 4, 06:05 PT, in answer to "elaborate distribution and what you mean by it."*

### 5.1 What the word means here

**Distribution = getting a human being to open the play link.** Nothing more exotic
than that. It is a separate job from building the game, and it is the job that
actually produces score.

The score is *unique players per calendar day, added up*. So there are exactly two
ways to raise it, and distribution is the first:

| Lever | What it does | Owned by |
|---|---|---|
| **Distribution** | Brings a **new** person to the link today | §5 (this section) |
| **Return loop** | Brings **yesterday's** person back tomorrow, for a second full point | GDD §10.9 |

One person who plays on 8 different days scores the same as 8 people who each play
once. Both levers are needed; neither substitutes for the other. A great game nobody
opens scores zero, and this is the runbook's third named failure mode.

### 5.2 Where the numbers actually are (Sep 4, 06:05 PT)

From `rundot analytics export daily_activity_30d` and `rundot jam promo`:

| Metric | Value |
|---|---|
| Sep 3 unique players | **2** (2 sessions, median 122 s, p95 359 s) |
| Sep 4 so far | no rows |
| Jam board rank | **#3** |
| Days live | 1 of ~15 |

Both Sep-3 players were us. **Real distribution to date is zero.** Rank #3 on two
plays says the board is still small and early — a handful of plays moves rank a lot
right now, and rank feeds board discovery, which feeds more plays. That compounding
window is open today and narrows as entries pile in.

### 5.3 The three surfaces, concretely

**1 · The RUN jam board — free, compounding, already working.**
`rundot jam promo` prints the vote link and pre-filled composer URLs:

- Vote: `https://run.world/jams/september-2026-jam?game=PpB5gECS0AMU49mGYAKM`
- Play: <https://w.run/puneetmakes/spice-expert-ramu>

**2 · RUN Discord `#back-to-work` — the jam's own channel.** The highest-intent
audience available: people who are there specifically to play jam entries, and who
expect rough builds. Reciprocity is the largest early traffic source — play and
comment on other entries and they play yours. This is the one surface where the
current build is not a liability.

> ✅ **Run Sep 4, 13:40 IST.** No auto-post occurred and none was possible — the
> Discord auto-post fires only against a webhook on the creator profile, and
> `socials profile show` returns *"No social profile configured yet."* The platform
> list was restricted to `x,reddit` as a second guard. Packet
> `cabeeb7e-ad5c-4b69-bfc1-0458e145b0a3`.

**3 · The user's own social reach** — X, Reddit, WhatsApp, Telegram, LinkedIn.
The CLI hands over pre-filled composer URLs; posts go out under the user's own name,
so the agent drafts copy and never posts.

### 5.4 Cadence beats any single post

One post produces one spike that decays inside ~24 h. The metric rewards **a post
every day or two, each tied to a visible change** — "the tandoor is in", "new cuisine
live". Every update is at once a fresh reason for a stranger to click and a fresh
reason for a past player to return, so a devlog cadence pays into both levers.

### 5.5 The split-launch recommendation

Real tension: the entry is public (good — the clock runs) but the build is still a
reskin (bad — a loud launch spends the one launch moment on the weakest version).
Resolution: **split the channels by their tolerance for rough.**

| Now, before Phase 1 lands | After Phase 1 + 2 land |
|---|---|
| Discord `#back-to-work` — rough is expected and feedback is the point | X, Reddit r/WebGames, LinkedIn |
| Reciprocal play-and-comment on other entries | **r/KitchenConfidential** — the recognition-hook post |

| When | Where | What |
|---|---|---|
| Every day | Discord `#back-to-work` | `rundot jam promo`; play and comment on other entries |
| After Phase 1 | r/WebGames, X | Launch post — held back deliberately until the art lands |
| Sep 6 | **r/KitchenConfidential** | The recognition-hook post, written as a cook and not as a marketer. **Highest-upside single post available to this concept** |
| Sep 5–18 | All surfaces | **Progress** posts, not launch posts. A visible changelog is itself a reason to return, and returns are worth full points |

Track with `rundot analytics export`, `rundot leaderboard`, `rundot socials status`.

> ⚠️ Never bots, click-farms, incentivized clicking, proxies, or self-play farming.
> RUN audits play counts and it voids **all** entries.

---


### 5.6 🔒 The surface list, decided — Sep 4, 13:36 IST

**User has LinkedIn and Discord. Nothing else.** No X, no Reddit. This is a decision,
not a gap to be worked around, and it changes the shape of the whole plan.

| Surface | What it is | Traffic shape |
|---|---|---|
| **RUN Discord `#back-to-work`** | Jam-native, highest-intent, reciprocal | **Daily, compounding** |
| **LinkedIn** | Professional network, portfolio artefact | **One spike, then decay** |

Three consequences, all of which outrank the copywriting:

**1 · Discord reciprocity is now the entire sustained-traffic engine.** LinkedIn produces
one spike and decays inside 48 hours; a professional network does not return to a game
daily. Every other surface in §5.5 assumed a broad public funnel that does not exist here.
Playing and commenting on other entries is therefore not a nice-to-have — it is the only
repeatable source of new players in the project, and it costs 20 minutes a day.

**2 · The return loop's value goes up sharply.** With a reachable audience in the low
hundreds rather than the thousands, the score cannot be won on new arrivals. It has to be
won on the same people returning across many days — one person on eight days scores what
eight people on one day do. **This escalates GDD §10.9 (return loop) above the craft pass
and above further art work.** If item 26 confirms D1 retention is genuinely near zero, the
return loop becomes the single highest-value work remaining, and the Sep 9 trigger rule in
§6 should be treated as already active.

**3 · r/KitchenConfidential is off the table**, and it was the highest-upside single post
available to this concept. Nothing replaces it. Noted as a real loss rather than
re-planned around.

**Link policy.** The score is plays, not votes, so the play link wins everywhere except
the RUN Discord, where the audience votes as well as plays and the extra click is free:

| Surface | Link | Why |
|---|---|---|
| RUN Discord | Vote page `run.world/jams/september-2026-jam?game=…` | Votes feed rank; rank feeds board discovery |
| LinkedIn | Plain play link `w.run/puneetmakes/spice-expert-ramu` | A raw tracking shortlink reads as spam on LinkedIn and depresses clicks |

`socials prepare` has no `linkedin` platform (`x,reddit,tiktok,instagram,discord` only),
so the two minted tracked links stay unused. They cost nothing and the packet is already
there if an account ever opens. Per-platform attribution is lost on LinkedIn, but with
only two surfaces it is trivially inferable from post timing against
`daily_activity_30d`.

**Cadence, revised.** §5.4's "post every day or two" holds, but the daily action is
Discord presence and reciprocity — not broadcast. LinkedIn gets the launch post once,
and at most one follow-up if something genuinely notable ships.

---

## 6. Trigger rules — decided in advance, executed without debate

| If… | Then… |
|---|---|
| Not publishable by end of Sep 3 | Cut to **one** station type and **three** walkouts, publish anyway |
| The kit resists a vertical rail | Take the kit's native orientation tonight; re-orient Day 2. **Never fight the kit on day 1** |
| A primary mechanic isn't fun by Sep 6 | Replace the mechanic, keep the shell — the rail and the pass survive everything |
| Behind on Sep 11 | Cut GDD §10.4 secondary mechanics 2 and 3 |
| Return loop not live by Sep 9 | **Drop the craft pass and the hedge entry.** Return loop outranks both |
| Sharing slips two days running | Stop building. Ship nothing that day and only distribute |
| Credits block generated art | Ship Phase 1 CSS/vector as final art — it was designed to be sufficient, not provisional |

---

## 7. Open items

| # | Item | Owner | Needed by | Status |
|---|---|---|---|---|
| 1 | Explicit APPROVED on the frozen GDD | User | Now | ✅ **Given Sep 3, 15:00 PT** |
| 2 | Redeem 100k credit promo | User | Sep 9 | ✅ Done — balance 126,100 |
| 3 | `rundot login` | User | Now | ✅ Done — `offroadinggamedev@gmail.com` |
| 4 | Art reference inputs for Phase 2 | User | Sep 9 | ⬜ Not yet needed |
| 5 | Confirm kit slug resolves at `jam init` | Agent | Tonight | ✅ `september-jam-tower-defense` scaffolded cleanly |
| 6 | Title | User | — | ✅ **Settled Sep 3, 14:45 PT — *Spice Expert: Ramu*** |
| 10 | **Verify NCS licence covers interactive/game use** | User | Before any track ships | ✅ **Cleared by user Sep 4, 06:00 PT — "license allows."** Gate removed. Carry the attribution line into a credits screen anyway (item 19) |
| 11 | **Verify KayKit licence — creator CC0 vs Unity Asset Store EULA** | User | Before the art pass | ✅ **Cleared by user Sep 4, 06:00 PT — "license allows."** The Phase 2a render pipeline is unblocked |
| 12 | Render KayKit props to transparent PNG sprites (fixed angle + light rig) | User | Sep 10 | ⬜ Feeds the skin layer; zero credit cost |
| 13 | Pick SFX set — 8 cues, see GDD §12 | User | Sep 5 | 🟡 **Unblocked Sep 4, 18:25 IST** — `rundot generate sfx` makes all five thematic cues for ~6 credits each (~30 total). The old "AudioGen is audiocraft-only" hold was wrong; see item 47 and Retro lesson 22. Still needs the *picks*. **3 of 8 picked Sep 4** — `Ah` → shift-over/try-again, `Level Up` → upgrade, `Level Complete` → rush cleared. Still unpicked, and these are the *thematic* five: sizzle, plate-up bell, ticket-print, station-placed, walkout thud |
| 7 | Does the TD kit already ship a level/wave system? | Agent | Tonight | ✅ **YES** — `data/waves.ts` has authored waves + deterministic endless, plus a headless balance sim. **Re-estimate the ~9 h level run down before Sep 8** |
| 8 | Author ~18 levels (3 cuisines × 6) | **User** | Sep 10 | ⬜ Schema in [Specs.md](Specs.md) §6a — data only, no code |
| 9 | Cuisine 4+ beyond `counter` / `tandoor` / `wok` | User | — | ⏭ Deferred. Cut-list item 11 — level count is a treadmill |
| 14 | **Distribution: `rundot jam promo` + `#back-to-work` post** | User decision | **Today** | 🟡 **Elaborated Sep 4 — §5 rewritten in full.** Two answers still needed: (a) which channels the user posts on personally, (b) go/no-go on `rundot socials prepare`, which may auto-post to Discord. Day-1 reality: **2 unique players, both of them us** |
| 15 | Art source: generate now vs wait for KayKit renders | User decision | Phase 1 | ✅ **Decided Sep 4, 06:00 PT — generate now, swap KayKit in later.** Phase 1 handover is with the implementation agent; awaiting the return handover |
| 21 | Downscale the 15 assets | Implementation agent | — | ✅ **Closed Sep 4, 13:24 IST in v1.2.0 — 16.30 MB → 0.64 MB, ~60 MB → ~3.9 MB decoded. Verified independently.** Specs §5a |
| 22 | Exclude `*.png.json` generation sidecars from `dist/` | Implementation agent | — | ✅ **Closed Sep 4 in v1.2.0** — moved to `art-source/`, outside `public/` and gitignored. `dist/` verified clean |
| 23 | Explain the credit rises — **now two**. *(Sep 4: the separate 14-credit `llm` charge is explained — it is `socials prepare` generating caption variants, billed to the planning agent's 13:40 run, not to Phase 2)* | Planning agent | Low priority | 🟡 +8,620 (125,980 → 132,275), then **+300 (132,275 → 132,575) on Sep 4 with zero spend**. Spend column unchanged at 2,325/17 calls both times. Reads like periodic top-up; still unexplained, still not counted on |
| 24 | Determine RUN's scoring-day boundary | Planning agent | — | ✅ **Resolved Sep 4, 12:14 IST — PT ruled out by measurement; UTC is the working assumption. Rollover = 05:30 IST.** §2.0 |
| 25 | The game emits almost no gameplay telemetry | Implementation agent | — | ✅ **Closed Sep 4, 14:41 IST in v1.2.1.** 9 custom events + a 6-step `run` funnel, all confirmed landing with correct payloads. `npm run balance` byte-identical, sim still free of any SDK import. Superseded detail below |
| 25a | *(superseded)* Original diagnosis | Implementation agent | — | 🔴 **Re-diagnosed Sep 4, 14:00 IST — the pipe works.** `top_custom_events_30d` shows `game_loaded` 62/47 players and the SDK's automatic `game_heartbeat` 1,252/44. The game emits exactly one event of its own, at boot. `core_loop_events_30d` and `session_end_summary_30d` are empty because nothing is *sent*, not because delivery is broken. Phase 2 |
| 32 | **`daily_activity_30d` undercounts — 47 distinct players, not 35** | Planning agent | Verify Sep 5 | 🟠 Summed daily uniques = 35, but `game_loaded` reports **47 unique players** and `game_heartbeat` 44 over the same window. Distinct-over-window cannot exceed the sum of dailies, so one of the two is wrong — most likely `daily_activity_30d` lag, which already revised Sep 3 from 2 to 9. **Every play-count figure in these docs may be low.** §2.1 |
| 33 | Reserved event taxonomy — **`session_end` solved, `core_loop` not** | Planning agent | Ask RUN Operators | 🟡 **`session_end` with `screen` + `trigger` routes correctly into `session_end_summary_30d`** — confirmed live. `core_loop_events_30d` stays empty even though `level_start` (17) and `level_complete` (14) are landing, so it wants names the docs' own examples do not supply. Not worth further guessing; ask Operators. No data is at risk — `top_custom_events_30d` and `custom_event_metrics_30d` hold everything |
| 34 | `session_end_summary_30d.avg_duration_s` reads 0.0 while the value sent is 505.45 s | Planning agent | Low | 🟡 `screen` and `trigger` map; `duration_s` does not — that column reads some other field name. Cosmetic only: the real durations are intact in `custom_event_metrics_30d`. Fold into the Operators question |
| 35 | **Firebase App Check wall on the live host page** | Planning agent | Investigate Sep 5 | 🟠 Every automated browser hitting the public URL is stopped by an *"App Integrity check failed"* screen (reCAPTCHA Enterprise / Play Integrity), throttled ~24 h after a failure. Expected against headless Chromium. **Unknown whether it ever catches real players** — privacy browsers, corporate proxies, or blockers that break reCAPTCHA would lose the play entirely and silently. Predates all our work; worth one hour to characterise, since the cost is a lost player |
| 36 | Wire the missing `menu_shown` → `game_loaded` join | Implementation agent | Low | ⬜ `boot` and `run` are separate funnels, so `funnel_steps_30d` cannot show load→menu conversion — the single most important drop-off we have. Either fold `game_loaded` in as `run` step 0 or read it manually across the two tables |
| 26 | D1 retention reads 0.0% across all platforms | Planning agent | Re-check Sep 5 | 🟡 Cohort is too young to call (26 of 35 players are from today). **If it holds, CP5 return loop becomes the single highest-value work in the project** |
| 37 | **Build “Hands!” expedite — primary mechanic 2 of 2** | Implementation agent | Sep 5–6 | 🔴 GDD §10.3, frozen, unstarted. *“Converts watching into playing; it is the skill ceiling.”* ~1 evening. §1e |
| 38 | **Component pips + station typing** | Implementation agent | Sep 6–7 | 🔴 GDD §10.1 step 1 + §10.2 criterion 2. The change that makes stations specialised. Structural — needs `npm run balance`. §1e |
| 39 | Reconcile walkouts (10 vs frozen 5) and shift length (~9 min vs frozen 90 s) | Planning agent | Before Sep 8 | 🟠 Both are frozen numbers in GDD §10.1. Either the build changes or the GDD takes a documented frozen-item break. §1e |
| 40 | Shift-end line in Ramu's voice | Implementation agent | Sep 7 | 🟠 GDD §10.4 marks it *do not cut*: near-zero cost, and it *“carries the entire ‘real story’ for editors.”* §1e |
| 41 | Two supplied clips left unused — `Power Up` (2.32 s) and `Pouring Water` (7.22 s) | Planning agent | With the next audio pass | 🟢 Deliberately outside Phase 3's scope, not forgotten. Natural homes: `Power Up` on a **meta** upgrade specifically, which would distinguish it from the in-run `Level Up`; `Pouring Water` as a chai/pour cue — the closest thing in the supplied set to GDD §12's `sizzle`. Both CC0 |
| 42 | **BGM has nowhere to live — the CDN path does not exist** | Implementation agent | — | ✅ **Closed Sep 4, 18:02 IST** — Phase 4 (`73d64db`) built the loader + crossfade, Phase 4.1 (`f37daf5`) classified its failures. Balance hash, `dist/images` (667,292 B) and `dist/audio` (42,793 B) all verified unchanged; committed, **not deployed** — the next phase adds the real track and deploys. Original note: Handed over Sep 4, 17:10 IST; design recorded in Specs §8a.4. Commit-only, no deploy. Original note: 🟠 A 30 s stereo loop is ~360 KB against a 667 KB game, so music cannot go in the bundle. Specs §8a and the `audio.ts` ADAPT comment both route it through `public/cdn-assets/` + `RundotGameAPI.cdn.fetchAsset()` — **that plumbing has never been written.** Generating tracks before it exists produces files with no home. Small task; must precede the music pass |
| 43 | Audition the three sample gains against a real playthrough | User | With the next play | 🟢 `lose` 0.5 · `upgrade` 0.45 · `wave-clear` 0.5, set by peak-matching the synth they replaced (−3 dBFS samples vs 0.35/0.30/0.35 synth peaks). Arithmetic got them close; the last few dB are an ear. One-line constants at `src/audio/audio.ts` — the SAMPLES table |
| 44 | MusicGen local pipeline for BGM | User + prompt agent | — | ⬜ **Superseded Sep 4, 18:25 IST by item 47** — kept installed as the no-credits/no-network fallback, not the shipping route. Original note: ✅ **Installed and verified Sep 4, 16:56 IST** — torch 2.5.1+cu121 / transformers 5.16.1, smoke test generated 4.94 s of real audio (peak 0.94) in 4.0 s on the 4090. Pinned versions and benign warnings in Specs §8a.3. Original note: HF `transformers` (not audiocraft — avoids the xformers/Python 3.11 fight on Windows), `musicgen-stereo-large` on the 4090's 24 GB, venv **outside** the repo at `D:\AudioGen`. A separate prompt agent writes prompts and logs to `docs/AudioGenPrompts.md` only. Fixed constants so stages crossfade: **112 BPM, A minor, 4/4, instrumental**. Note MusicGen is music-only — the 5 unpicked SFX cues need AudioGen or CC0 packs, not this |
| 45 | 🔒 **Every handover names its recipient** | Planning agent | Standing, from Sep 4 16:50 IST | ✅ Two agents now take instructions from one chat — the implementation agent (codebase, builds, deploys, git) and the MusicGen Prompt Agent (one file, append-only, no source, no git). Phase 4 reached the wrong one; it refused correctly. **Rule: the handover heading names the agent, and a one-line scope stamp sits under it.** Same family as lesson 18 — what matters must be inside the block that travels |
| 16 | Re-cost the level run (Phase 4) | Planning agent | Before Sep 8 | ⬜ ~9 h is stale; the kit ships authored waves, deterministic endless, and a balance sim |
| 17 | Close the auto-enabled `textGen` credit cap | Implementation agent | Phase 2 | ⬜ 500k/day ceiling on an unused surface; see [Specs.md](Specs.md) §10 |
| 18 | Verify NCS + KayKit licences before either ships | User | Before Phase 2 art | ✅ **Closed Sep 4** — see items 10 and 11 |
| 19 | Credits/attribution screen — NCS track titles + KayKit credit | Implementation agent | Before BGM or rendered props ship | ⬜ **Ungated Sep 4** — the five SFX are CC0 and owe nothing, so this no longer blocks Phase 3. Still live for **NCS** (attribution is a standing condition of that licence) and KayKit |
| 27 | Provenance and licence for the 5 user-supplied SFX | User | — | ✅ **Closed Sep 4, 15:20 IST — user attributes all five as CC0.** A public-domain dedication waives attribution entirely: nothing is owed on a credits screen and RUN's originality requirement is satisfied outright. The *source* is still unnamed, so the masters stay gitignored — the repo should not carry files whose licence it cannot cite. Audio unblocked |
| 28 | Convert supplied audio to a web-shippable format | Implementation agent | — | ✅ **Closed Sep 4 in v1.2.2, corrected in v1.2.3.** 3 cues live at **42,793 B total** (46% of the 90 KB budget); critical bundle unchanged at 667,292 B; synth kept as permanent fallback. Superseded detail below |
| 28a | *(superseded)* Original sizing | Implementation agent | — | 🟡 Handed over Sep 4, 15:10 IST. Measured: the three named clips are **1,433,008 B raw = 2.15× the entire shipped game** (667,292 B), so conversion is mandatory rather than tidying. `Ah.wav` is 24-bit/48 kHz with a broadcast `bext` chunk; the other four are 16-bit/44.1 kHz and carry a 4-byte-overstated RIFF size. Target: mono 44.1 kHz MP3, peak-normalised −3 dBFS, ≤ 30 KB/clip and ≤ 90 KB total |
| 20 | Answer the §5 distribution questions (channels + Discord go/no-go) | User | — | ✅ **Answered Sep 4, 13:36 IST — LinkedIn and Discord only.** Packet minted, copy drafted. See §5.6 |
| 29 | **Post the LinkedIn launch + first `#back-to-work` post** | User | **Today** | 🔴 Drafts written and waiting. Nothing has been shared anywhere yet; 35 players to date are all organic |
| 30 | **Daily Discord reciprocity — play and comment on 5 entries** | User | Daily from today | 🔴 With only two surfaces this is the *only* repeatable source of new players. 20 min/day. §5.6 |
| 31 | Re-rank the return loop against the craft pass | Planning agent | With item 26, Sep 5 | 🟠 A two-surface audience means the score must come from returns, not arrivals. §5.6 consequence 2 |
| 46 | 🔒 **Purchased art packs must not be republished** | User + planning agent | Before any art ships | ✅ **Closed Sep 4, 20:24 IST — user owns both packs (\$4 total) and elects to use them under the purchase.** That covers use *inside the game*, which is what ships. It is not a grant to redistribute the raw sheets, and neither vendor publishes terms — so the position is unchanged and now deliberate: `Art/` stays gitignored, only baked atlases ship, and both creators are credited on the jam page regardless. Original note: 🟡 Both vendor pages checked Sep 4, 18:2x IST — neither publishes licence terms at all.** toxiccolors (\$1+) and hoshiixs (\$3+, tagged *"No generative AI was used"*) both say only *"contact me"*. User confirms purchase and right to use in the game; **that is not a grant to redistribute the raw sheets, and silence is not permission** — so `Art/` stays ignored and only baked atlases ship. Credit both creators on the jam page regardless: it costs nothing and covers the common unstated "attribution appreciated". Original note: 🟠 Two commercial itch.io tilesets landed Sep 4 ~17:30 in `Ramu - The Chef/Art/` — toxiccolors *Kitchen Inventory Decoration* and hoshiixs *Kitchen Props*, 19 files / 2.8 MB with `.aseprite` sources and Tiled `.tsx`/`.tsj`. They were untracked **but not ignored**, one `git add -A` from a public repo. Gitignored in `2b8ec90`. **Still open:** paid packs typically licence use *inside* a game, not redistribution of raw sheets — read each pack's terms, confirm the jam permits third-party art, and record the attribution each vendor requires. Same gate as item 27 was for audio |
| 47 | **The RUN SDK generates audio — `RundotGameAPI.audioGen`** | Planning agent + user | — | ✅ **Chosen Sep 4, 18:25 IST.** Route is the CLI, not an in-game call: `rundot generate music\|sfx`. Verified end to end — a 30 s take cost 113 credits and came back as real, un-faded, loopable audio. Full workflow, costs and output format in Specs §8a.5. Original note: 🟠 Found Sep 4, 17:5x IST while verifying `fetchAsset`'s typings. `generate(params)` takes `{type:'sfx', description, durationSec 0.5–30}`, `{type:'music', prompt, durationSec 3–300, model: elevenlabs \| lyria3 \| lyria3-pro \| minimax-music-2.6}` or `{type:'tts', …}`, returning `{audioUrl, durationSec, generationId}`. **This unblocks item 13** — the five thematic cues were parked as "AudioGen is audiocraft-only", which was true of *Meta's* AudioGen and irrelevant, because RUN ships its own. It also makes MusicGen optional for BGM: Lyria 3 / MiniMax are stronger, but cost credits (132,561 available) where MusicGen costs only GPU time and is already wired to the prompt-agent workflow |
| 48 | 🔒 **New game-view proposal — belt + props, not towers** | User + planning agent | Scope call needed **now** | 🔴 Hand-drawn layout received Sep 4, 19:0x IST (`references/Errors/NewMapLayoutProposal.jpeg`) plus a written spec. Dual hanging billboard (walk-outs / READY? / FAILED above, ingredient row below), reverse-V conveyor, 4 front-facing prop slots, task scroll, dustbin skip at −1 walkout, hands + plate + tray. **This is not a re-skin: props do not shoot, they hot-swap the ingredient sprite as it passes.** No range, no HP, no damage — `sim/engine.ts`, `data/towers.ts`, `data/enemies.ts`, `data/waves.ts` and the pads/path in `config.ts` are all replaced, and the frozen balance hash stops meaning anything. **Ordering decided Sep 4, 20:05 IST — gated order (GDD §10.3a):** optional `after` prerequisites, most interactions order-free, ungated levels play as a checklist so difficulty is an authoring dial rather than a rewrite. The billboard row doubles as the progress readout, which is what makes failure legible and the dustbin skip a real decision. Inventories done in [PropList.md](PropList.md) and [RecipeList.md](RecipeList.md); **Picks proposed Sep 4, 20:24 IST** — 6 props + 2 stretch, 11 interactions, 5 recipes across 5 levels, **every `out` state backed by a sprite we already own** and every recipe solvable inside 4 slots. Two invariants fell out of the Λ-belt (PropList §5): *distinct props ≤ slots*, and *never both the raw and processed form of one ingredient* — whose flip side, the **over-processing fail**, is the best mechanic of the pass and costs no art. **Awaiting user sign-off on the identifications and the dish names.** **Live v1.2.3 is scoring at rank #3 right now — build alongside, never in place** |
| 49 | 🔒 **Only the audio agent generates music** | Audio generation agent | Standing, from Sep 4 20:15 IST | ✅ Three routes to a music file existed at once — `rundot generate music`, the local MusicGen venv at `D:\AudioGen`, and the planning agent (which made take 1 while proving the pipeline). **Rule: no music file enters this project from any other source.** The agent owns generation, naming, the `.mp3.json` provenance sidecar and the `AudioGenPrompts.md` log; it reads and writes `Ramu - The Chef/Audio/BGM/` only. Masters only — conversion to a shippable asset stays with the implementation agent. Credits are real money, so `estimate` first and a hard cap per batch. Retro lesson 23 |
