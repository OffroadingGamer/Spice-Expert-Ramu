# Plan — Spice Expert: Ramu

> **Forward-looking.** What we intend to do, in what order, by when.
> Companion docs: [Tasks.md](Tasks.md) (status at a glance) · [GDD.md](GDD.md) (what the game is) ·
> [Specs.md](Specs.md) (how it is built) · [Retro.md](Retro.md) (what actually happened).
>
> **Update rule:** revise on every iteration, progressive *or* regressive. When a
> plan item slips or is cut, do not silently delete it — strike it, move it, and
> log the reason in [Retro.md](Retro.md).

**Last updated:** Sep 4 2026, 12:57 IST (read from the system clock)
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
| **5** | **SFX** — sizzle on entering a grill's range, bell on plate-up, ticket-printer chatter on rush start | Sound does more thematic work per hour than art | ~2 h · blocked on cue picks |
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

> ⚠️ **`rundot socials prepare` may auto-post to Discord.** Its own `--force` flag
> reads *"re-post to Discord even if already auto-posted for this version."* It has
> **not** been run. It is a publishing action, so it waits on an explicit go-ahead.

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
| 13 | Pick SFX set — 8 cues, see GDD §12 | User | Sep 5 | ⬜ Agent requests specific cues by name and timing |
| 7 | Does the TD kit already ship a level/wave system? | Agent | Tonight | ✅ **YES** — `data/waves.ts` has authored waves + deterministic endless, plus a headless balance sim. **Re-estimate the ~9 h level run down before Sep 8** |
| 8 | Author ~18 levels (3 cuisines × 6) | **User** | Sep 10 | ⬜ Schema in [Specs.md](Specs.md) §6a — data only, no code |
| 9 | Cuisine 4+ beyond `counter` / `tandoor` / `wok` | User | — | ⏭ Deferred. Cut-list item 11 — level count is a treadmill |
| 14 | **Distribution: `rundot jam promo` + `#back-to-work` post** | User decision | **Today** | 🟡 **Elaborated Sep 4 — §5 rewritten in full.** Two answers still needed: (a) which channels the user posts on personally, (b) go/no-go on `rundot socials prepare`, which may auto-post to Discord. Day-1 reality: **2 unique players, both of them us** |
| 15 | Art source: generate now vs wait for KayKit renders | User decision | Phase 1 | ✅ **Decided Sep 4, 06:00 PT — generate now, swap KayKit in later.** Phase 1 handover is with the implementation agent; awaiting the return handover |
| 21 | **Downscale the 15 assets — 16.30 MB → target <1 MB** | Implementation agent | **NOW** | 🔴 Phase 1.5. **26 of 35 real players are mobile-web** and meet a 27 s preload. No longer hypothetical. §1c, §2.1 |
| 22 | **Exclude `*.png.json` generation sidecars from `dist/`** | Implementation agent | Phase 1.5 | 🟠 15 files publishing prompts, seeds, and a creator account id on a public build. §1c |
| 23 | Explain the +8,620 credit rise (125,980 → 132,275) | Planning agent | Low priority | 🟡 Likely a jam grant; logged as unexplained, not counted on |
| 24 | Determine RUN's scoring-day boundary | Planning agent | — | ✅ **Resolved Sep 4, 12:14 IST — PT ruled out by measurement; UTC is the working assumption. Rollover = 05:30 IST.** §2.0 |
| 25 | **The game emits ZERO gameplay telemetry** | Implementation agent | **Today** | 🔴 `core_loop_events_30d` and `session_end_summary_30d` both export **empty**. We can see arrivals but nothing about what players do — every fix is a guess. Skill: `rundot-feature-analytics`. Cheap; fold into Phase 1.5 |
| 26 | D1 retention reads 0.0% across all platforms | Planning agent | Re-check Sep 5 | 🟡 Cohort is too young to call (26 of 35 players are from today). **If it holds, CP5 return loop becomes the single highest-value work in the project** |
| 16 | Re-cost the level run (Phase 4) | Planning agent | Before Sep 8 | ⬜ ~9 h is stale; the kit ships authored waves, deterministic endless, and a balance sim |
| 17 | Close the auto-enabled `textGen` credit cap | Implementation agent | Phase 2 | ⬜ 500k/day ceiling on an unused surface; see [Specs.md](Specs.md) §10 |
| 18 | Verify NCS + KayKit licences before either ships | User | Before Phase 2 art | ✅ **Closed Sep 4** — see items 10 and 11 |
| 19 | Credits/attribution screen — NCS track titles + KayKit credit | Implementation agent | Before any audio ships | ⬜ Cheap safeguard even where the licence permits use; NCS attribution is a standing condition |
| 20 | Answer the §5 distribution questions (channels + Discord go/no-go) | User | **Today** | 🔴 The only thing standing between the entry and its first real players |
