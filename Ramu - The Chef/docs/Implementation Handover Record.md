# Implementation Handover Record

**Started:** Sep 10 2026 — at Round I, which is late.
**Owner:** the planning agent (this thread). The implementation agent does not write
this file; it is the record kept *about* the handovers, on both sides of the gate.

---

## What this file is

Every round given to the implementation agent, and every return, logged here.
The counterpart to [Social Media Handover Record.md](Social%20Media%20Handover%20Record.md),
which has done the same job for the marketing agent since Sep 8 2026.

🔴 **Why it exists.** The human gate is: *agent returns → the planning agent verifies
independently from source → briefs the user → full stop → user approves.* That
verification is only meaningful against **what was actually authorised**. Before this
file, that lived exclusively in a chat thread — so it survived exactly as long as the
thread did.

⚠️ **Round I proved the cost on the day this file was created.** Its handover was
written, the thread was compacted, and the return then had to be verified against a
*summary* of the criteria rather than the criteria. It happened to work, because the
summary was hours old. **The full verbatim list of Round I's twelve acceptance
criteria is gone.** The nine tasks below were recovered by grepping `Round I Task N`
out of the source comments — not from any document.

✅ **The rule going forward: an entry is written when the handover is written, not
when the return arrives.** A round with no entry here has not been handed over.

---

## 📌 CURRENT STATE — last updated Sep 13 2026

🔴 **Read this before grepping the round entries below.** Everything after this block is a
**dated log**: each entry was true when written and is deliberately never rewritten. Numbers
quoted inside a round entry are historical. **This block is the only authoritative statement
of the present.**

| | |
|---|---|
| **Live version** | **Private 1.91.0** (Rounds 0–17) — playtest-ready. Review and Public stay at **1.69.0**, the jam build. Nothing is in flight. |
| **Jam — FINAL** | Closed 00:30 IST Sep 19 2026. **6th of 100 — 638 daily uniques, 942 total plays, 15 days in jam. No prize.** Winners: The Grind 2,063 DUP ($1,000) · Back That Thing Up! 1,770 ($600) · 9 to Thrive 1,280 ($300) · GT Rush 976 ($200) · Pest Control Tycoon 750 ($100). **Editor's Pick $300 → Don't Let Him Die (159 DUP)** — a judged award, not metric-based. Behind 5th by **112 DUP** (was 16 at the Sep 17 21:50 reading — Pest Control took 121 in the final day to our 25). |
| **In flight** | **Nothing with an agent.** Waiting on the user's pick of card option A / B / C (drawn, §6d) and on the four §6d decisions, which together make **Round 18 → 1.92.0**: the 44 step strings, the rail fixes, the chai/coffee 2.75× zoom, the card restyle, the plural key, Coffee Decoction. **Round 19 is Hindi**, and it must follow R18 because it translates R18's own new English. |
| **Repo** | `origin/main` = **`66c12c2`**, tree clean apart from Round 17's in-progress edits. Pushed continuously since Sep 18; `backdrop-dawn.jpg` (Archita Sharma's painting, consented and credited) is in the public repo. Every push preceded by the secret scan with its 3-line positive control. ⚠️ `references/Errors/The kitchen upgrades refix.mp4` (3 MB) is untracked and **not** committed — no other reference video is tracked; the user's call. |
| **Returns ledger** | `docs/Agent Returns.md` — every agent return **verbatim** (agents are compacted after each task; this is the only durable copy). Started Sep 18 with R10 onward; earlier returns exist only as summaries here. Rule: paste the return into the ledger *before* verifying it. |
| **Balance baseline** | **35 / 36 / 11 / 4 / 90** (fox-spam / balanced / miser / pad0-rush / maxed-meta) |
| **Block-1 criterion** | `balanced` must show `lives 10 (leaked 0)` on **every level 1–12** |
| **Endgame criterion** | `maxed-meta` must lose between levels **85–110** (currently 90) |
| **`miser` contract** | must still **lose** (currently 11) |
| **Early economy** | `startCoins 200` · `startLives 10` · `waveBonus 25` (levels 1–10) |
| **Late economy** | from level 11: `waveBonus 6`, `bountyMult 0.55` |
| **FTUE opening pad** | **`FTUE_FIRST_PAD = 4`** (B3, `damage ×1.5`), then pads 3 and 2 |
| **Sealed files** | `sim/engine.ts` · `data/enemies.ts` · `data/towers.ts` |
| **`data/waves.ts`** | ⚠️ **RE-SEALED.** Unsealed for the v1.69.0 block-1 retune only |
| **Credits (Sep 22)** | **197,868** after art round 4 (−441 = 3 × 147, verified against `rundot credits`). The 198,309 it came down from was fully reconciled from the studio Finances page: 25,000 starter + 616 + 1,500 quest rewards + grants 15,000 / 50,000 / 5,000 / 1,093 / **100,000** + 100 daily. The **+100,000** (expires Dec 18) is RUN's compensation for the broken marketing module; the old **+6,093** mystery was the 5,000 + 1,093 grants. ✅ **Both credit watch items closed — nothing unexplained.** 616 credits expire Dec 3; plan Free, 100/day, no rollover. |
| **Paid campaign** | ✅ **`kitchen-rush-meta` COMPLETE** (ended Sep 16). **$70.05 of $82 spent · 4,228 impr · 171 clicks · 4.04 % CTR · 18 installs · CPI $3.66.** Unspent remainder refunds on completion per RUN's rule — verify on the studio page. Paid is done for this jam (marketing agent's prior, Sep 14) |
| **Art round 2 (Sep 17)** | ✅ **DONE** — `Art/_gen/pass-final/`: `pass-entry.png`, `pass-exit.png` (1024², take 1 each), `belt-tile.png` (128², procedural, `#3a3a44`, seamless both axes). **561 credits.** Awaiting the hatch-wiring implementation round |
| **Art leg (Sep 14)** | ✅ **DONE** — `Art/_gen/chef-final/`: 9 bodies + 4 faces + scroll, **7,003 credits**, verified. Faces are aligned eyebrow-to-jaw bands. ⚠️ Expressions read at **≥ 160 px, not 96** — spec amended in Ideas.md §6b. Nothing ships before judging |
| **Video leg (Sep 14)** | ✅ **PUBLISHED** — *Twelve Glasses*, 45 s portrait, Video Studio, live ~00:08 IST Sep 15, ~20 min before the close. Share `https://w.run/s/UvNAAno`. Agent-reported ≈43k credits; ⚠️ **not visible in `rundot credits`** (balance 184,274 reconciles without it) — Studio may bill a separate pool. Docs tracked in `VideoGen Leg/`; media gitignored. ✅ **RUN support confirmed Sep 15: automatically in consideration** — no form, no listing; Editor's Picks $300/$100/$100. Share link handed to the marketing agent for the organic calendar |

⚠️ **The old baseline `35 / 34 / 6 / 4 / 90` appears twelve times below.** Every one of
those is a historical round entry and correct in context. **It is not the current
baseline.** It changed in v1.69.0 when the block-1 difficulty spike was retuned.

🔥 **And read the per-level rows, not just these five numbers.** The five end-of-run
figures hid a wave 4–5 cliff that was in `npm run balance`'s own output for rounds — see
[Retro.md](Retro.md) §103. An aggregate holding steady is not evidence that what it
aggregates is healthy.

---

## Entry format

```
### YYYY-MM-DD — Round <X> — <one-line scope stamp>
```

The scope stamp is already required by [Plan.md](Plan.md) item 45. Each entry carries:

| Field | Why |
|---|---|
| **Tasks as authorised** | The verification baseline. Numbered, because the code cites them. |
| **Acceptance criteria as authorised** | What "done" was defined as, *before* seeing the result. |
| **File table + 🛑 sealed list** | What the round was allowed and forbidden to touch. |
| **Commit · version · tag** | Where it landed. |
| **Return** | Passed / disclosed / boundary crossed. |
| **Verdict** | The planning agent's verification result, and the date. |

---

## Log

### Rounds A – H — stub rows only

⚠️ **Reconstructed from `git log` on Sep 10 2026, not from records.** These rounds
pre-date this file. Their task lists and acceptance criteria were never written down
and are **not recoverable** — the threads holding them are gone. Listed so the
commits are locatable; nothing here should be treated as a verification baseline.

| Round | Handover commit | Landed | Notes |
|---|---|---|---|
| **A** | `4297240` | `346defc` | Challenge-mode FTUE, stated win/lose, audio sliders. v1.39.0 — first promotable build since v1.7.0 |
| **A2** | `3e15c9d` | `346defc` | Campaign milestone, sliders everywhere, the dev gate |
| **B** | — | — | 🔴 **Never written.** Warrior achievements, [GDD.md](GDD.md) §10.11b. Still queued — round 4 in [LevelBlocks.md](LevelBlocks.md) §13 |
| **C** | `ee4d043` | `d9c72aa` | Fit the Challenge playfield to the viewport, readable HUD |
| **D** | `b0e5c22` | `1c1863a` | Persistent, walled Challenge FTUE through wave 3 |
| **E** | `366e77d` | `bcc32b7` | Fix the FTUE hard-lock, generalise the empty-pad pulse |
| **F** | — | — | 🔴 **Never existed.** No commit, no document reference. The letter was skipped; G follows E |
| **G** | `797142c` | `797142c` | Enemies draw real dish sprites; three placeholder ticket names retired |
| **H** | `004c4b8` | `004c4b8` | 80-level threat curve, pad-0 bonus stripped, FTUE early exit. ✅ Verified — [Plan.md](Plan.md) item 62 |

---

### 2026-09-10 — Round I — Challenge Mode is losable: splash falloff, the fixed nine-block curve, 10 slots, the coin sink

**Commit** `ed2ef78` · **private v1.45.0** · public unchanged at v1.42.0
10 files, +1102 / −415.

#### Tasks as authorised

⚠️ Recovered from `Round I Task N` comments in the source, not from the handover text.
Wording is therefore descriptive, not verbatim.

| # | Task | Landed in |
|---|---|---|
| 1 | **Splash distance falloff** — splash dealt full damage to every enemy in radius, making density the *defender's* damage stat | `sim/engine.ts` |
| 2 | **Simulator models a real player** — `createEngine(meta)` not `createEngine()`; horizon 80 → 120; `maxed-meta` becomes the primary case | `scripts/simulate.ts` |
| 3 | **Restore per-entry `hpMult` / `speedMult`** — Round H deleted these, which reduced "strictly increasing threat" to a weighted headcount | `data/waves.ts` |
| 4 | **Concurrent spawn entries** — one cursor per entry, replacing strictly-serial scheduling that prevented a wave from ever occupying the belt | `sim/engine.ts` |
| 5 | **Uniform enemy size 44** (was 36–84) **+ glow tiers** — 🔴 red for snail/hornet, 🟡 light-gold for stag, replacing the boss-hat/size idea | `config.ts`, `textures.ts` |
| 6 | **The nine level blocks** — `BLOCKS` container; one texture per (archetype, dish) pair rather than a fixed five | `data/blocks.ts`, `textures.ts` |
| 7 | **Belt geometry + 10 slots** — right leg narrows x610 → x540; pad order `A1 A2 B1 B2 B3 C1 C2 C3 D1 D2`; old pad 2 becomes B2, **index 3** | `config.ts`, `waves.ts`, `towerScene.ts`, `store.ts` |
| 8 | **Retire Round H's `level ≤ 5` life restore** | `sim/engine.ts` |
| 9 | **Kitchen Actions — the non-tower coin sink** | `sim/engine.ts`, `actions.ts`, `config.ts`, `Hud.tsx` |

#### Acceptance criteria

🔴 **The verbatim twelve are lost with the compacted thread.** Recorded below are the
criteria that were actually checked at verification, with their results. Criterion 1's
target window (85–110) was flagged at handover time as **the planning agent's judgement
call**; the user never ruled on it, and it was not raised again.

| # | Criterion | Result |
|---|---|---|
| 1 | `maxed-meta` loses somewhere in **levels 85–110** | ✅ **86** |
| 2 | Enemies reach **≥ 60% of the belt by level 40** | ❌ **11%** for `maxed-meta` — see disclosure below |
| 3 | No level 1–120 exceeds **120 units or 90 s** of spawning | ✅ PROVEN (max count anywhere: **80**) |
| 4 | Block 1: `balanced` finishes level 10 with **5–8 lives** | ✅ **7/10**, leaking at W4 and W5 |
| 5 | `miser` loses around **levels 4–8** | ✅ **6** |
| 6 | Threat **strictly increasing** across every level 1–120 | ✅ PROVEN |
| 7 | Every decade's breather floor (21–80) exceeds the previous decade's ceiling | ✅ PROVEN |
| 8 | **No pad overlaps** another pad or any belt segment | ✅ PROVEN — all 10, every segment |
| 9 | Composition of all 10 waves of every block printed by the sim | ✅ |
| 10 | 🛑 `data/enemies.ts` and `data/towers.ts` diffs **empty** | ✅ **0 lines** |
| 11 | `SAVE_KEY` unchanged; a real v1.44.0 save round-trips | ✅ `'spice-expert-ramu:save:v1'` intact |
| 12 | `tsc --noEmit` and `vite build` clean | ✅ exit 0 |

#### Boundaries

🛑 **Sealed:** `data/enemies.ts`, `data/towers.ts` — both verified empty.
🚫 **Not to be touched:** `state/save.ts`, `stage.ts`, `GameCanvas.tsx`, `audio/audio.ts`,
`sdk/leaderboard.ts` — all verified untouched.
🚫 **Never run:** `rundot set-public` / `set-private` / `update-tag` — none called.
**UI allowance:** minimal sink buttons only, no restyle. The HUD rename
([LevelBlocks.md](LevelBlocks.md) §11) was explicitly deferred to visual round 3.

#### Return — disclosed by the agent

1. 🔴 **Criterion 2 not reached, not forced.** `maxed-meta` holds enemies to ~11% depth
   at level 40. Diagnosis: ten maxed Tandoors converge `first`-targeting on one lead
   enemy for ~1300 combined single-target DPS, and splash falloff discounts only
   *secondary* victims — the primary target always takes 100%
   ([`engine.ts:587`](../../jam-entry/src/game/sim/engine.ts)). Three alternative fixes
   were tried and each broke monotonicity, the 120-unit/90 s ceiling, or the 85–110
   window.

   ⚠️ **CORRECTED Sep 10 2026, after this entry was first written.** The falloff
   *formula* is as described — `v === target ? 1 : …` — but **the convergence
   diagnosis is measurably false**, and this entry originally endorsed it. Instrumenting
   the maxed board (per-tower shot counts, sampled from `cooldown` resets):

   | Level | Towers that fire | Idle | Total shots | Peak alive | Depth |
   |---|---|---|---|---|---|
   | 20 | **2 / 10** | 8 | 23 | 9 | 7% |
   | 40 | **3 / 10** | 7 | 18 | 12 | 11% |
   | 60 | 5 / 10 | 5 | 53 | 20 | 23% |
   | 71 | 8 / 10 | 2 | 124 | 17 | 54% |
   | 80 | **10 / 10** | 0 | 162 | 25 | 100% |

   🔴 **At level 40, seven of the ten towers never fire a single shot, and the wave
   is killed by essentially one tower** (pad 0, 10 of the wave's 18 shots). There is no
   ~1300 DPS concentration: there is ~130 DPS from one Tandoor, killing a **12-enemy**
   wave before it reaches the second tower. The belt is not defended, it is *empty*.

   ✅ **Which means criterion 2 is achievable, and the `waves.ts` comment claiming it
   needs ~30,000 HP on one unit is wrong** — it reasons from a premise that does not
   hold. Tower participation and belt depth rise together, monotonically, as headcount
   rises: that is the lever. Ordinary builds reach 43–55% at level 40 for the same
   reason — weaker towers let more enemies through, which engages more towers.
   Round J acts on this.
2. ⚠️ **`sim/engine.ts` edited for Task 8**, which the file table enumerated under
   tasks 1, 4 and 9 only. Cites Round H's disclosure pattern as precedent — a
   precedent that, before this file, existed nowhere in writing.

#### Verdict — ✅ ACCEPTED, verified Sep 10 2026, user-approved same day

Verified independently from source. **All five simulator results reproduce exactly**
(fox-spam 49 · balanced 52 · pad0-rush 5 · miser 6 · maxed-meta 86). All four `PROVEN`
assertions present and passing. `tsc` exit 0.

**The two files outside the authorised table are both legitimate**, not drift:
`state/store.ts` is one line — `ftueBeatPad: 2 → 3` — which *is* Task 7's remap and
without which Task 7 is incomplete. `ui/Hud.tsx` is the three sink buttons, the
explicit UI allowance, self-labelled provisional and gated `!ftueActive` so it cannot
collide with the tutorial. The HUD rename was correctly **not** done.

🔴 **One finding the return did not raise — carried into the next round.**
**Difficulty is carried entirely by stags; the "more enemies" half of the playtest fix
contributes nothing.** Across the whole 86-level `maxed-meta` run, every life lost comes
from a **38–40 unit stag wave**, while every boss wave — levels 20, 30, 40, 50, 60, 70,
at **42–71 units** — is a **zero-leak shutout**. The resulting shape is a cliff, not a
slope: `balanced` holds 7/10 lives for **44 consecutive levels** (6 → 50), then loses 6
at 51 and dies at 52; `fox-spam` is at full lives through 43, loses 5 at 44, leaks
**zero** at 46–48, and dies at 49.

The mechanism is **HP inflation, not density** — block 8 level 71 is *21 beetles at
44.1× HP* — and the 120-unit ceiling is never approached (highest count anywhere:
**80**). There was headroom to add enemies and the curve spent it on hit points. This
re-creates the Sep 10 playtest's points 3 and 5 in a new form.

**Proposed remedy (not yet authorised):** a tuning pass, not a round — shift the
non-stag waves' growth out of `hpMult` and into count, using the unused ~40 units of
headroom.

---

### 2026-09-10 — Round J — Density, not hit points: spend the curve's growth on headcount

**Status:** ✅ **RETURNED, VERIFIED, ACCEPTED** — commit `8a0cfab`, private **v1.46.0**,
user-approved Sep 11 2026.

**Scope stamp:** a tuning pass over wave *data*, not a feature round. 🛑 **The engine is
sealed** — if a task appears to need an engine change, it is out of scope; hand back.

#### Why

Round I made Challenge Mode losable but difficulty is carried entirely by stags. Every
life lost in the 86-level maxed run comes from a 38–40 unit stag wave; every boss wave
at 42–71 units is a zero-leak shutout. `targetCount()` caps beetle/wasp at **30** and
snail/hornet at **22**, growing 0.17–0.22 per level — so a level-71 single-archetype
wave is **21 units** absorbing **1571 threat**, forcing `hpMult` to **44×**. The
120-unit ceiling is never approached: the highest count anywhere in 120 levels is **80**.

This re-creates the Sep 10 playtest's points 3 and 5, which asked for pressure from
quantity.

#### Tasks as authorised

| # | Task |
|---|---|
| 1 | **Delete the false diagnosis** in `waves.ts`'s `targetCount` doc comment — the "~30,000 hp on a single unit" paragraph. Replace it with the measured participation table above. |
| 2 | **Give each wave a unit budget that grows with level**, exactly as threat already does — ramping toward (not past) the 120-unit ceiling by the late blocks. Stag keeps its own cap; the non-stag archetypes present split the remainder. |
| 3 | **Raise or retire the per-archetype count caps** so the budget can actually be spent. |
| 4 | **Re-tune `T1` / `DECADE_GROWTH`** so `maxed-meta` still loses inside **85–110** once counts absorb the budget. |
| 5 | **Add a participation probe to `simulate.ts`** — per-level "towers that fired / idle / peak alive", so criteria 2 and 3 below are measurable in-repo and never regress silently. |

#### Acceptance criteria

| # | Criterion | Today |
|---|---|---|
| 1 | `maxed-meta` loses in **85–110** | 86 |
| 2 | **≥ 8 of 10 towers fire on level 40** | 🔴 **3** |
| 3 | **Peak concurrent enemies ≥ 40 on level 40** | 🔴 **12** |
| 4 | **Depth ≥ 60% by level 40** (Round I's missed criterion) | 🔴 **11%** |
| 5 | **No entry's `hpMult` exceeds 8×** anywhere in 1–120 | 🔴 **44.1×** |
| 6 | No level exceeds **120 units or 90 s** of spawning | ✅ holds (max 80) |
| 7 | Block 1: `balanced` finishes level 10 with **5–8 lives** | 7 |
| 8 | `miser` loses around **4–8** | 6 |
| 9 | Threat strictly increasing 1–120 | ✅ |
| 10 | Every decade's breather floor exceeds the previous decade's ceiling | ✅ |
| 11 | 🛑 `enemies.ts`, `towers.ts` **and `sim/engine.ts`** diffs empty | — |
| 12 | `tsc --noEmit` and `vite build` clean | ✅ |

⚠️ **Criteria 2–4 are expected to move together.** If depth rises while participation
does not, the curve has been made harder rather than denser — that is the failure mode
to watch for, and it is what criterion 5 exists to catch.

#### Files

**Primary:** `src/game/data/waves.ts` · `scripts/simulate.ts`
**Permitted if needed:** `src/game/config.ts` (curve constants only)
🛑 **Sealed:** `data/enemies.ts` · `data/towers.ts` · **`sim/engine.ts`**
🚫 **Not to be touched:** `state/save.ts` · `stage.ts` · `GameCanvas.tsx` ·
`audio/audio.ts` · `sdk/leaderboard.ts` · `ui/` (no UI work in this pass)
🚫 **Never run:** `rundot set-public` / `set-private` / `update-tag`

#### Return — verified from source Sep 11 2026

✅ **Boundary held completely.** `enemies.ts`, `towers.ts` **and `sim/engine.ts`** all
**0 lines** changed. Only `data/waves.ts` and `scripts/simulate.ts` touched.

✅ **The diagnosis correction is right, and it corrects the record again.** `pickTarget`
only considers enemies already inside a given tower's own range — there is no global
lead enemy for ten towers to converge on. Emptiness was the cause, as the participation
probe showed.

| # | Criterion | Result | Verified |
|---|---|---|---|
| 1 | `maxed-meta` loses 85–110 | **105** | ✅ |
| 2 | ≥ 8/10 towers fire @L40 | **7/10** | ❌ missed, disclosed |
| 3 | Peak alive ≥ 40 @L40 | **18** | ❌ missed, disclosed |
| 4 | Depth ≥ 60% @L40 | **42%** | ❌ missed, disclosed |
| 5 | `hpMult` ≤ 8× anywhere | **8.00×** at L41 | ✅ proven |
| 6 | ≤ 120 units / 90 s | max **120 u / 23 s** | ✅ proven |
| 7 | Block 1 `balanced` 5–8 lives | **6/10** | ✅ |
| 8 | `miser` loses 4–8 | **6** | ✅ |
| 9 | Threat strictly increasing | proven — **but hollow, see below** | ⚠️ |
| 10 | Breather floors | proven | ✅ |
| 11 | Sealed diffs empty | 0 lines × 3 | ✅ |
| 12 | `tsc` / build clean | exit 0 | ✅ |

Criteria 2–4 conflict with criterion 1 and the agent demonstrated it: every
configuration reaching them dragged the loss level below 85, sometimes to 39.
Movement was still large — 3/10 → 7/10 fired, 12 → 18 peak, 11% → 42% depth.

🔴 **Undisclosed but material: ordinary builds now die 15–17 levels earlier.**
`fox-spam` 49 → **35**, `balanced` 52 → **35**. Neither strategy appears in the return
report. ✅ **Accepted by the user Sep 11** — it widens the meta-progression range from
52→86 to **35→105**, giving upgrades more room to matter, at the cost that a competent
first-time player sees **three of the nine blocks**.

🔴 **Criterion 9 passes on a metric that excludes the deciding lever — the third time
this has happened.** `waveThreat` calls `unitThreat(e.enemy, hpMult, 1)`: **`speedMult`
is hardcoded to 1**, while the round's own report calls the speed lever *"what makes the
game losable at all"*. Measured across levels 1–120:

| Metric | Decreases |
|---|---|
| Bookkeeping threat (the proven one) | **0** |
| Effective threat, speed included | **24** |

Worst: L44 −23.7% · L34 −23.5% · L54 −19.9% · L41 −18.3%. The cause is that the speed
boost applies only to wasp and hornet, so difficulty sawtooths on whether a ladder
position happens to contain them — W1 (beetle) and W4 (snail) get none, W2 and W5 get
all of it.

⚠️ **This is [Plan.md](Plan.md) item 62 recurring.** Round H deleted HP scaling, so
"strictly increasing threat" proved only *more enemies*; Round J excludes speed, so it
proves only *more hp × count*. 🔥 **The pattern: we keep proving monotonicity on a
metric that excludes whatever lever is currently doing the work.** Decided Sep 11 — no
further tuning pass; **retire the guarantee instead of re-tuning to it**, since the
build deadline is Sep 14.

⚠️ Minor: the report's L20 participation row (3/5 fired, 8 peak, 18%) does not match a
clean run (4/9, 10 peak, 16%). Every other row matches. Likely captured mid-iteration.

---

### 2026-09-11 — Dish-art race — Challenge Mode must not race its own art

Ran **in parallel with Round J** (different files, no conflict).
⚠️ **This entry was written on the round's RETURN, not at handover time — a lapse
against this file's own rule**, recorded rather than quietly backdated. Same for the
art-generation round, which is logged in [LevelBlocks.md](LevelBlocks.md) §7 instead.

**Commit** `8d7802a` · not deployed — deliberately folded into the visual round's deploy
rather than spending a version of its own.

#### Why

`textures.ts`'s `artSquare` returns the drawn **insect silhouette** whenever a `dish-*`
alias misses `Assets.cache` at first request, and `makeEnemyTexture` caches that per
`(archetype, dish)` for the run's whole life — **a miss never recovers**. All 22 dish
PNGs are registered, but in the **`deferred`** bundle, which `preload.ts` background-
loads. `kitchenScene.ts:374` awaits its deferred aliases explicitly; `towerScene.ts`
awaited nothing. **Cold caches lose the race — exactly the first-time players Daily
Unique Plays counts.**

#### Task and acceptance

One task: mirror Kitchen Mode's on-demand load in `towerScene.ts`, prefetching block
N+1 during block N. Accepted on: cold cache + throttled network shows real dish art on
block 1 wave 1; no fallback anywhere a dish PNG exists; no visible first-wave stall;
Round J's files untouched; `tsc` and build clean.

#### Return — verified from source Sep 11 2026

✅ **Better than the shape specified.** Rather than an `await` that would stall the
scene, it gates the **engine stepping loop** on `readyBlocks`: `stepSpawning` is only
reachable from inside `engine.step()`, so holding stepping back is what prevents an
enemy of a not-yet-loaded block from ever being composed. Verified in source — the gate
wraps `engine.step()` entirely, and `stepSpawning` has exactly one call site.

✅ Current block's load starts at scene mount, before the first tick. Block N+1 warms as
soon as block N becomes active, so from block 2 on the gate is a no-op.
✅ Aliases filtered through `MANIFEST_ALIASES`, so an unregistered dish cannot throw.
✅ A failed load marks ready anyway and falls back for that one alias — art never bricks
a run, matching `preload.ts`'s posture.
✅ Only `towerScene.ts` changed (+108). `enemies.ts`, `towers.ts`, `sim/engine.ts` and
`data/waves.ts` all **0 lines**. `tsc` exit 0, `vite build` clean.

✅ **Checked for a soft-lock and found none.** `ensureBlockAssets` returns early
*without* marking ready when `blockId` is out of range — which would gate stepping
forever. Not reachable: `blockForLevel` clamps to `level <= 80 ? … : 9` and `BLOCKS`
holds exactly 9 ids.

✅ **Live cold-cache verification was done by the agent** — production bundle, headless
Chrome CDP, `Network.setCacheDisabled(true)` with slow-3G on a wiped profile, frame-by-
frame from the first enemy leaving the burrow: chai tray art immediately, no silhouette,
no pop, and the wave advanced 1/80 → 2/80 without stalling. **This is the one criterion
that cannot be checked from source**, so it rests on the agent's report — stated here as
such.

#### Verdict — ✅ ACCEPTED, Sep 11 2026

---

### 2026-09-11 — Visual round — put the finished art on screen before the freeze

**Status:** 📤 **HANDED OVER, not yet returned.** Written at handover time, per this
file's rule.

**Scope stamp:** the last build round. Backdrops wired, tower props, HUD wording.
🔴 **Tiered, because it may not all fit** — finish a tier cleanly rather than leaving
one half-built; the effective code freeze is **end of Sep 13** (CP8 is *deploy verified
public* at Sep 14 23:30 IST, and RUN's approval lead is unmeasured).

#### Tasks as authorised

**Tier 1 — must ship**
1. **Wire the nine backdrops** (720×1280, committed `fe7e89d`). Register `bg-block-1–9`
   in `manifest.ts` **`deferred`** — 🔴 never `critical` — loaded through the
   `ensureBlockAssets` gate with the same block N+1 prefetch. Replace the `grass`
   `TilingSprite` with a `Sprite` scaled to **cover**; crossfade on block change.
2. **Tower prop reskin** — §10's mapping, 🔴 **fit per FAMILY not per sprite**.
3. **HUD rename** — §11. WAVE and RUSH stop being the same counter.
4. ➕ **Ghost slots** — *promoted from tier 2 on Sep 11* after the user flagged pad art
   as ambiguous in a playtest screenshot.
5. ➕ **`BuildSheet` is see-through** — *added Sep 11 from the same screenshot.*
   [`BuildSheet.tsx:102`](../../jam-entry/src/ui/BuildSheet.tsx) is `bg-black/80` with no
   scrim, so the belt and pads read straight through the build menu. **Not a z-order
   bug** — the panel is 20% transparent by construction. Make it opaque, or add a scrim.

**Tier 2** — build sidebar (the 140-unit rail from the `002` schematic).
**Tier 3** — wave roster panel (§8), only if 1 and 2 are finished and verified.

#### Acceptance criteria

1. Cold cache, throttled: block 1 opens on its backdrop **and** dish sprites.
2. Block boundary crossfades with no stall.
3. `critical` bundle size **unchanged** — verified, not assumed.
4. All four stations show kitchen props; upgrades visibly grow within a station, and
   every Lv3 reads at the same nominal size across stations.
5. HUD shows ESCAPES LEFT / CASH / WAVE + RUSH with the right block label; no wrap at
   360 px.
6. **No board element is visible through the build menu.**
7. FTUE plays end to end on a real device.
8. 🛑 `data/enemies.ts`, `data/towers.ts`, `data/waves.ts`, `sim/engine.ts` diffs
   **empty** — Round J's balance is settled.
9. `SAVE_KEY` unchanged; a real v1.47.0 save round-trips.
10. `tsc --noEmit` and `vite build` clean.

#### Boundaries

🛑 Sealed: `enemies.ts` · `towers.ts` · `waves.ts` · `sim/engine.ts`.
🚫 Not to be touched: `save.ts` · `stage.ts` · `GameCanvas.tsx` · `audio.ts` ·
`leaderboard.ts`. Outside `jam-entry/` → hand back.
🚫 `rundot whoami` before any deploy; **private only**; never `set-public` /
`set-private` / `update-tag`. Kill processes **by PID only**.

#### Return — tier 1, verified from source Sep 11 2026 · commit `45cb996`

✅ **Tier 1 complete; tiers 2 and 3 not started — stopped cleanly at a shipped tier, as
instructed.** Sealed diffs (`enemies.ts`, `towers.ts`, `waves.ts`, `sim/engine.ts`) are
**0 lines** each; changed files are exactly `manifest.ts`, `textures.ts`,
`towerIcons.ts`, `towerScene.ts`, `BuildSheet.tsx`, `Hud.tsx`. `tsc` and build clean.

| Bundle | Before | After | Backdrop bytes |
|---|---|---|---|
| `critical` | 15 files / 491,669 B | 23 files / **522,711 B** | **0** |
| `deferred` | 88 files / 1,676,409 B | 85 files / 2,486,460 B | 1,095,341 |

⚠️ **Acceptance criterion 3 was mis-written by the planning agent**, not violated.
It said *"`critical` unchanged"*; §10 explicitly costs the reskin at **+31 KB**, and the
round landed **+31,042 B** — to the byte. The criterion was stricter than the document it
existed to enforce. Its intent, no backdrop bytes in `critical`, is met exactly.

✅ `bg-surface` was checked rather than assumed — `#14141a`, opaque, rule present in the
built CSS. A class that failed to resolve would have left the sheet *fully* transparent,
worse than the original bug.

🔴 **The Fryer art finding is correct and understated** — see §10's remap note. Acted
on Sep 11: Fryer moves to Sauce pot 32/33/34.

⚠️ **Two criteria could not be verified and are disclosed as such:** the block-boundary
crossfade (needs a real playthrough to level 11; the scripted bot could not survive
block 1 solo) and real-device FTUE (headless Chrome only). Both fall to the user's
device test. The crossfade reuses the already-proven `ensureBlockAssets` cache-poll
path, so this is code-review confidence, not observation.

#### Verdict — ✅ TIER 1 ACCEPTED, Sep 11 2026

---

### 2026-09-11 — Visual round, part 2 — the Fryer remap, then whatever else fits

**Status:** 📤 **HANDED OVER, not yet returned.** Written at handover time.

**Scope stamp:** the last build round before the freeze. One decided fix, one carried-over
verification, then tier 2 and 3 only if they fit.

🔴 **Effective code freeze: end of Sep 13.** CP8 is *deploy verified **public*** at
Sep 14 23:30 IST, and RUN's approval lead is unmeasured. **Priorities 1–2 alone are a
shippable round** — stop cleanly rather than half-building 3 or 4.

#### Tasks as authorised

| # | Task |
|---|---|
| 1 | **Remap the Fryer to Sauce pot** — `prop-sauce-pot-l1/l2/l3` (32/33/34), replacing `prop-fry-pan-l2/l3/l4`. §10 is updated. Retire the three fry-pan aliases from `critical` if nothing else uses them. |
| 2 | **Verify the block 1→2 backdrop crossfade**, carried over from tier 1 where the scripted bot could not survive block 1 solo. Seed a save with meta upgrades, or drive the engine directly, so play legitimately reaches level 11. |
| 3 | **Build sidebar** — the 140-unit vertical rail from the `002` schematic, replacing the bottom sheet. |
| 4 | **Wave roster panel** — §8. During a wave the Ready space hot-swaps to that wave's named dish list, boss floating and glowing. |

#### Acceptance criteria

1. All four stations draw equipment, none draws food — **no tower resembles an enemy**.
2. Fryer Lv1→Lv2→Lv3 fits per family, bottom-anchored, consistent with the other three.
3. The block 1→2 crossfade is **observed**, not reasoned about — screenshot or frame capture.
4. `critical` does not grow beyond the §10-approved reskin cost; report before/after.
5. If task 3 lands: no board element visible through the sidebar, and the Ready button still reachable one-handed at 360 px.
6. If task 4 lands: every dish in the wave is named from `EnemyDef.name` — the field that is currently rendered nowhere.
7. 🛑 `enemies.ts`, `towers.ts`, `waves.ts`, `sim/engine.ts` diffs **empty**.
8. `SAVE_KEY` unchanged; `tsc` and `vite build` clean.

#### Boundaries

🛑 Sealed: `enemies.ts` · `towers.ts` · `waves.ts` · `sim/engine.ts`.
🚫 Not to be touched: `save.ts` · `stage.ts` · `GameCanvas.tsx` · `audio.ts` ·
`leaderboard.ts`. Outside `jam-entry/` → hand back.
🚫 `rundot whoami` before any deploy · **private only** · never `set-public` /
`set-private` / `update-tag` · kill processes **by PID only**.

#### Return — verified from source Sep 11 2026 · commit `918b1f8` · private **v1.48.0**

✅ **Priorities 1–2 complete; 3–4 handed back cleanly, as instructed.** Diff confined to
`manifest.ts` and `textures.ts`. All four sealed files **and** all five boundary files
(`save.ts`, `stage.ts`, `GameCanvas.tsx`, `audio.ts`, `leaderboard.ts`) are **0 lines**.
`tsc` and build clean. `TOWER_PROP_LEVELS.squirrel` → `prop-sauce-pot-l1/l2/l3`;
sauce-pot 3-in-`critical`/0-in-`deferred`, fry-pan 0/5 — the only surviving `fry-pan`
mention in `src/` is a comment explaining the swap.

✅ **Crossfade observed, not inferred** — a maxed-meta save seeded into `localStorage`
under `save.ts`'s own shape (the file itself untouched) let a legitimate run clear block
1 solo and reach level 11. Captured: frame 0 café backdrop with `WAVE 11 / RUSH: NORTH
INDIAN` already in the HUD, frame 1 a genuine alpha-blended double exposure, frame 2
fully North Indian. This closes the one tier-1 mechanism that had shipped on
code-review confidence.

⚠️ **`critical` is +49,035 B (+10.0%) over the pre-visual-round baseline** — 491,669 →
540,704. Tier 1's reskin was +31,042 (§10-approved); the sauce-pot swap added another
+17,993, since sauce-pot's three files are 50,933 B against fry-pan's 32,940 B. The
agent flagged it rather than letting it pass, which was right. **Accepted** — criterion
4 was a guardrail against unbounded growth, not a hard cap on a swap decided after it
was written.

🔥 **But measuring it surfaced something much larger.** The 12 station props are
**RGBA truecolour and were never palette-quantised**, while the dish trays were
(§10's note: sharp/imagequant, quality 40). `dish-chai.png` is 212×141 at **7,914 B**;
`prop-sauce-pot-l1.png` is 107×117 at **18,195 B** — a quarter the pixels, more than
twice the bytes. Test-quantising every `critical` PNG at 128 colours:

| | Bytes |
|---|---|
| `critical` now | 540,704 |
| `critical` quantised | **~138,469** |
| Saving | **402,235 B (74%)** |

Inspected side by side at board scale: indistinguishable, bar faint banding in one
gradient. 🔴 **That would make first paint roughly a quarter of what it was before the
visual round even started** — paid straight back to the first-time players Daily Unique
Plays counts. Proposed as the last pre-freeze task.

#### Verdict — ✅ ACCEPTED, Sep 11 2026. Tiers 3–4 (build sidebar, wave roster panel) are
**dropped** — no room before the freeze.

---

### 2026-09-11 — Playtest round — sprite fit, prop scale, bare pads, and a spawn safe zone

**Status:** 📤 **HANDED OVER, not yet returned.** From a device playtest of v1.48.0.

🔴 **Last round before the freeze.** Effective code freeze **end of Sep 13**; CP8 is
*deploy verified **public*** at Sep 14 23:30 IST.

#### Tasks

| # | Task | Files |
|---|---|---|
| 1 | **Chai and coffee render ~a third the size of every other dish.** Every dish file is 212×141, but chai/coffee's *content* bbox is **75×55 (35% of canvas)** against 205×134 (97%) for all 28 others. `artSquare` scales by the **file** bounds, so identical scale → wildly different apparent size. Fit on the **alpha content bbox** instead. ✅ `artSquare` has exactly one caller (`makeEnemyTexture`) — no blast radius. | `textures.ts` |
| 2 | **Station props +1.25×** on the board, and the build-menu icons with them. | `textures.ts` / `towerScene.ts` / `BuildSheet.tsx` |
| 3 | **Remove the solid pad decal under a PLACED tower** — `makePadTexture`'s ellipse reads as an odd table beneath the prop. Ghost slots stay on empty pads. Pairs with task 2: losing the decal is what makes room for bigger props. | `towerScene.ts` |
| 4 | 🔴 **Spawn safe zone** — towers may not damage anything still on the **first vertical leg**: `(170,90)→(170,330)`, **240 units, 9.8%** of the 2440-unit path. Exclude from **both** `pickTarget` and splash victim selection. Derive the threshold from `CONFIG.path`'s first segment, never a literal. | ⚠️ **`sim/engine.ts` — UNSEALED for this task only** |
| 5 | **Palette-quantise the `critical` PNGs.** The 12 props are RGBA truecolour and were never quantised, unlike the dish trays. Measured at 128 colours: **540,704 → ~138,469 B, a 74% cut**, indistinguishable at board scale. | assets + `manifest.ts` |

#### ⚠️ Task 4 changes the balance, and Round J was tuned without it

Every enemy becomes invulnerable for the first 9.8% of its journey, so the pads nearest
spawn lose most of their value and the whole defence weakens. Round J's numbers —
`maxed-meta` 105, `balanced` 35, `fox-spam` 35 — **will move earlier**.

🔴 **`data/waves.ts` stays sealed. Do not re-tune the curve to compensate.** Run
`npm run balance` and **report the new loss levels**. If `maxed-meta` leaves 85–110, or
`balanced` drops below ~25, say so and stop — that is a decision for the user, not a
tuning exercise to be absorbed silently one day before the freeze.

#### Acceptance criteria

1. Chai and coffee render at the same apparent size as every other dish, measured not eyeballed.
2. No dish is clipped or distorted by the new fit; all 22 block dishes checked.
3. Props are visibly larger; nothing overflows its slot or collides with a neighbour.
4. No table-like decal under a placed tower; ghost slots still mark empty pads and still distinguish bonused from plain.
5. Nothing takes damage on the first vertical leg — including splash. Verified in play, not only in code.
6. `npm run balance` re-run and the five strategies' loss levels reported against Round J's.
7. If task 5 lands: `critical` before/after, and a visual check of each changed asset.
8. 🛑 `data/enemies.ts`, `data/towers.ts`, `data/waves.ts` diffs **empty**. `SAVE_KEY` unchanged. `tsc` and build clean.

#### Return — verified from source Sep 11 2026 · commit `c9fa483`

✅ **All four tasks landed, nothing handed back.** Sealed (`enemies.ts`, `towers.ts`,
`waves.ts`) and all five boundary files **0 lines**. `sim/engine.ts` touched only for
task 4 (+13). `tsc` and build clean.

✅ **Safe zone derived, not hardcoded** — `SPAWN_SAFE_ZONE_LEN = segLengths[0]`, applied
in `pickTarget` **and** splash victim selection. Balance re-run and reported rather than
compensated for, as instructed:

| Strategy | Round J | Now |
|---|---|---|
| `maxed-meta` | 105 | **90** — inside 85–110 |
| `balanced` | 35 | **34** |
| `fox-spam` | 35 | 35 |
| `miser` | 6 | 6 |
| Block 1 `balanced` @L10 | 7/10 | **6/10** — inside 5–8 |

All five `PROVEN` assertions still pass.

🔥 **Unlooked-for win: the safe zone hit the participation target Round J could not.**
At level 40, `maxed-meta` now fires **8/10 towers** (was 7/10) with **51% depth** (was
42%) and 20 peak alive. Round J's criterion 2 — ≥ 8/10 firing at L40 — was missed after
three tuning attempts and is now met as a side effect of letting enemies survive the
first leg. ⚠️ **Which confirms the Round J diagnosis was right**: the belt was empty
because the first towers killed everything before it could spread, not because of
targeting convergence.

🔥 **Payload, measured independently: `critical` 540,704 → 115,885 B (−78.6%).** That
is **−375,784 B against the pre-visual-round baseline of 491,669** — first paint is now
under a quarter of what it was *before* this work started, while having gained nine
backdrops and real per-level station art. `pad`/`pad-gold` retired entirely (0 refs).

🔴 **Outstanding — self-flagged by the agent, confirmed real and NOT theoretical.**
`fireBeam`'s chain loop iterates `state.enemies` with only a `hit.includes` and distance
test — **no safe-zone check**. The Fryer's 2nd/3rd hits can therefore reach back into the
zone. With `chainRange` 120 and combat now starting exactly at the corner, an enemy at
path distance ~250 sits ~40 units from one still inside the zone, so this fires
routinely, not at an edge. The handover named `pickTarget` and splash only, so leaving
it was correct scope discipline — but it defeats the rule's intent and is one line in
the same loop with the same constant.

#### Verdict — ✅ ACCEPTED, Sep 11 2026. Beam-chain gap outstanding.

---

### 2026-09-11 — Beam-chain safe zone — close the last gap, then ship

**Status:** 📤 **HANDED OVER, not yet returned.**

**Scope stamp:** one line, then deploy. 🔴 **The last code change before the freeze.**

#### Task

`fireBeam`'s chain-selection loop ([`sim/engine.ts`](../../jam-entry/src/game/sim/engine.ts))
iterates `state.enemies` filtering only on `hit.includes(e)` and `chainRange`. It has
**no safe-zone check**, so the Fryer's 2nd and 3rd hits reach back into the spawn safe
zone that `pickTarget` and splash both respect.

Add `if (e.dist < SPAWN_SAFE_ZONE_LEN) continue;` to that loop — same constant, same
shape as the other two sites.

⚠️ **Not an edge case.** `chainRange` is 120 and combat now begins at the first corner,
so an enemy at path distance ~250 sits ~40 units from one still inside the zone. Any
Fryer covering that corner chains backwards on most shots.

#### Acceptance criteria

1. Nothing inside the first vertical leg takes damage from **any** source — direct,
   splash, or beam chain. Verified in play with a Fryer placed to cover the first corner.
2. `npm run balance` re-run; report whether the five loss levels move from
   `maxed-meta` 90 / `balanced` 34 / `fox-spam` 35 / `miser` 6 / `pad0-rush` 4.
3. 🛑 `data/enemies.ts`, `data/towers.ts`, `data/waves.ts` diffs **empty**;
   `sim/engine.ts` is the only engine file touched.
4. `SAVE_KEY` unchanged. `tsc --noEmit` and `vite build` clean.
5. Deployed **private**, with `rundot whoami` confirmed first and `rundot game info`
   confirming Review and Public still read **1.42.0**.

#### Boundaries

🛑 Sealed: `enemies.ts` · `towers.ts` · `waves.ts`. ⚠️ **Do not re-tune the curve** —
if the loss levels move, report them.
🚫 Not to be touched: `save.ts` · `stage.ts` · `GameCanvas.tsx` · `audio.ts` ·
`leaderboard.ts`. Outside `jam-entry/` → hand back.
🚫 Never `set-public` / `set-private` / `update-tag`. Kill processes **by PID only**.

#### Return — verified from source Sep 11 2026 · commit `b3bec13` · private **v1.49.0**

✅ **Exactly one line**, in `fireBeam`'s chain-hop loop, matching `pickTarget` and splash.
`enemies.ts` / `towers.ts` / `waves.ts` **0 lines**; `sim/engine.ts` the only file touched.
`tsc` and build clean. `rundot game info`: Private **1.49.0**, Review **1.42.0
(Approved)**, Public **1.42.0** — untouched.

✅ **Balance reproduced independently — all five identical**: `fox-spam` 35, `balanced`
34, `miser` 6, `pad0-rush` 4, `maxed-meta` 90.

🔥 **The verification method deserves recording.** The agent built a harness on the real
`createEngine`, placed an actual squirrel tower, and seeded two enemies at dist 245 and
200 — then **reverted the fix and re-ran it** to prove the harness actually reports chain
damage into the zone without the guard. A test that is never seen to fail proves nothing;
this one was.

#### Verdict — ✅ ACCEPTED, Sep 11 2026. **Challenge Mode's build is complete.**

---

### 🔴 Standing hazard — `PATH_LENGTH` is stated twice and only one is derived

[`waves.ts:60`](../../jam-entry/src/game/data/waves.ts) holds `const PATH_LENGTH = 2440;`
**hand-derived**, its own comment warning it *"is NOT frozen … there is no standing
guarantee this constant can't go stale"*. [`engine.ts:129`](../../jam-entry/src/game/sim/engine.ts)
**computes** its own from `CONFIG.path`.

⚠️ **So any belt-geometry change must edit a sealed file, or the two silently
disagree** — every threat number would be wrong while the simulator still printed
`PROVEN`. This is why the Sep 11 belt-shrink proposal was answered with a render-space
scale rather than new path coordinates: see [LevelBlocks.md](LevelBlocks.md) §7.

---

### 2026-09-11 — Final polish round — board scale, station renames, sprite sizes, overlaps

**Status:** 📤 **HANDED OVER, not yet returned.** 🔴 **Last code change before the
freeze (end of Sep 13).** Seven items from four playtest screenshots, audited with the
user before dispatch.

#### Decisions taken at audit

| Question | Answer |
|---|---|
| Station naming | **Literal prop names** — Stock Pot / Pressure Cooker / Cooktop / Sauce Pot |
| Chai & coffee size | **×2, block 1 only**, first pass; scale the rest later only if it feels right |
| Pad–belt overlap | **Shrink the ghost ellipse** (not move pads — pad moves have a balance effect) |
| Board scale | **0.85** |
| 🔴 Unseal `stage.ts` | **Approved** — see below |

#### 🔴 Audit findings that changed the plan

1. **The board scale cannot live in `towerScene`.** `Hud.tsx:70` positions the FTUE
   picker-beat arrow and empty-pad pulse via `designToScreen()`, which reads `getFit()`
   in `stage.ts`. Those cues are **DOM, outside `boardRoot`** — so a scale applied only
   to `boardRoot` desyncs them and the FTUE points at the wrong pads. ⚠️ `Hud.tsx:56`
   records that *"a hand-rolled second copy of this formula here caused a near-miss
   review"* in round C. ✅ **`stage.ts` unsealed for this one change**, user-approved, so
   board and overlay keep a single transform.
2. **"Wider Tandoor" breaks under the rename** — it names a station that would no longer
   exist. → **"Wider Burner"**. "Bigger Basket" on a sauce pot → **"Longer Ladle"**.
   "Sharp Knife" and "Deep Chill" stay.
3. **×2 chai/coffee = 88 units on a 72-unit belt**, overhanging ~8 units each side.
   Confirmed chai and coffee appear **only** in block 1, so this is block-1-only by
   construction. Sizes are cosmetic — targeting and splash use centre points — so **no
   balance impact**. Disclosed to the user, who chose to see it on device first.
4. **Board scale does NOT fix the pad-on-belt look** — pads and belt are both inside
   `boardRoot` and scale together. It *does* fix pad-vs-backdrop collision, since the
   backdrop is a sibling layer that stays full-bleed. The user's note assumed the former;
   corrected before dispatch.

#### Tasks

1. Board to **0.85**, factored into `getFit()` in `stage.ts`; re-centre both axes.
2. Rename the four stations + two meta upgrades (`towers.ts`, **`name` fields only**).
3. Tandoor Lv1 ×1.25 via a per-family minimum (it fills 48% of its box; others 96–100%).
4. Chai/coffee enemy sprites ×2, per-dish not per-archetype.
5. Ghost ellipse `0.48` → ~`0.38` of pad width.
6. Pause overlay full-bleed.
7. "Tap a cook to upgrade" moved clear of the Kitchen Actions row.

#### Acceptance criteria

1. 🔴 **FTUE plays end to end with cues landing on the correct pads at 0.85** — the one
   that can break silently.
2. No ghost slot visually touches the belt.
3. Tandoor Lv1 clearly larger; upgrades still visibly grow within every station.
4. Chai/coffee visibly larger than other blocks' dishes.
5. No pause-overlay edge leak; toast never overlaps the actions row.
6. `npm run balance` **unchanged: 35 / 34 / 6 / 4 / 90**.
7. 🛑 `enemies.ts` and `waves.ts` diffs empty; `towers.ts` diff is **names only**.
8. `SAVE_KEY` unchanged; `tsc` and `vite build` clean; deployed **private**.

#### Return — verified from source Sep 11 2026 · commit `99e1530` · private **v1.54.0**

✅ **All seven landed, nothing handed back.** Sealed `enemies.ts`, `waves.ts` **and**
`sim/engine.ts` all **0 lines**. `tsc` and build clean. Balance **identical**: 35 / 34 /
6 / 4 / 90. `game info`: Private **1.54.0**, Review **1.42.0 (Approved)**, Public
**1.42.0**.

✅ **`towers.ts` is names-only, verified line by line** — the entire diff is six `name:`
lines. No stat, cost, range or rate moved.

✅ **The board scale went where it had to.** `BOARD_SCALE = 0.85` multiplies inside
`getFit()` itself, so `scale`, `offsetX`, `designHeight` and `boardY` all derive from one
reduced number and the Pixi canvas cannot drift from `Hud.tsx`'s DOM cues. The agent's own
comment states the failure mode it avoids.

✅ **Cooktop Lv1 was solved generically** — a per-level minimum-fill floor, not a
special case. Checked against all four families' real dimensions: only Cooktop Lv1 crosses
it (~50% → ~63%); nothing else moves.

⚠️ **Task 6 could not be reproduced.** No left-edge scrim leak at any viewport tried via
CDP; the scrim rect matched `#app-frame` pixel for pixel. The agent applied the standard
cause — `--game-w` now uses `100dvw` instead of `100vw`, matching the file's existing
`100dvh` for height — and said so rather than claiming a fix. **Needs re-checking on the
real device where it was seen.**

🔴 **Correctly flagged, out of scope, still open:** `towers.ts:155` reads
`desc: 'Fryer works more tickets at once'` — the only `desc` naming a retired station.
Outside a names-only diff, so leaving it was right. Queued below.

#### Verdict — ✅ ACCEPTED, Sep 11 2026

---

### 🔴 Operational finding — RUN's profanity filter rejects the word "Pot"

The v1.54.0 changelog was **rejected twice** by RUN's moderation, isolated to the
standalone word **"Pot"** — almost certainly drug-slang false-positive matching. Deployed
clean by writing **"Stockpot" / "Saucepot"** as single words.

⚠️ **This will recur**, because two stations are now named *Stock Pot* and *Sauce Pot*
and every future changelog describing them hits it. ✅ **Workaround: one word in changelog
prose.** The in-game names are unaffected — moderation applies to submitted release notes,
not to strings inside the bundle.

➕ It also explains the version jump **1.49.0 → 1.54.0**: the rejected attempts consumed
bumps. Tags are clean, so this cost nothing but numbers.

---

### 2026-09-11 — The final round — gem economy, sprite scale, decorations, mobile overlay, bumping

**Status:** ✅ **TIER A RETURNED, VERIFIED FROM SOURCE, DEPLOYED** — commit `f7b1344`,
private **v1.55.0**, Sep 11 2026. 🔴 **Tier B (tasks 1–2) HANDED BACK, not dropped** —
the user queued it as the **next and final round**, to be attempted after playtesting
v1.55.0. **Freeze: end of Sep 13.**

⚠️ The round was dispatched as two tiers under a standing *"stop cleanly at a finished
tier"* instruction: **Tier A = tasks 3–11** (independent, shippable alone), **Tier B =
tasks 1–2** (the build rail and the board re-anchor, one architecture change).

#### For the implementation agent

| # | Task |
|---|---|
| 1 | 🔒 **The 140-unit build rail** (`002` schematic) — the four stations for placement **and** the selected-tower panel (Sell / Upgrade / Target), replacing the bottom `BuildSheet`. ✅ **The board is already built for it**: Round I narrowed the belt's right leg x610→x540 precisely to clear 180 units, which is a 140-unit rail plus margin. That reserved strip sitting empty is what makes the current layout read as off-balance. |
| 2 | **Re-anchor the board** — left-aligned in the remaining **580** units (≈ **0.80**), correcting the polish round's *centred* 0.85. Still via `getFit()` in `stage.ts`, one transform only. |
| 3 | 🔴 **Deflate the gem economy.** `recordRunEnd` in `state/save.ts` pays the **triangular sum** `N(N+1)/2 × gemsPerWave` — wave 102 pays **5,253**, and the ad placement adds `ceil(×0.5)` = **2,627**. Both match the end screen exactly. 🔥 **The entire meta tree costs 1,968 gems**, so one deep run pays **2.7× everything** (4× with the ad), and the crossover is **wave 62** — a single run that deep buys the whole tree. Even a wave-34 death pays 595, more than one tower's full stat line (520). The tree is exhausted in ~2 runs. **Fix: make the payout linear** — `gemsEarned = N × gemsPerWave` with `gemsPerWave: 4`. Gives 136 gems at wave 34 (≈15 runs to max) and 408 at wave 102 (≈5 runs), so progression lasts the event instead of ending on day one. ⚠️ **`state/save.ts` unsealed for this formula ONLY** — `SAVE_KEY`, the schema and every other function stay untouched. |
| 4 | **Rework the end-screen copy.** `EndScreen.tsx:75` still reads *"Out of lives — every **bug** that got past you cost one"* — insect-era language the dish reskin left behind, and it contradicts the HUD, which now says **ESCAPES LEFT**. Proposed: *"No escapes left — every dish that slipped past was a customer out the door."* |
| 5 | **`EndScreen.tsx:83`: "Tickets served" → "Dishes served"** (the `runKills` counter). ✅ Safe: `submitRunScores` sends raw `kills`/`waves` values under fixed mode names, so the label is decoupled from the two live leaderboards and `sdk/leaderboard.ts` is not touched. |
| 6 | **`towers.ts:155`: `desc: 'Fryer works more tickets at once'`** → rename off the retired station (e.g. *"Serves more tickets at once"*). The last stale station reference; flagged by the agent as outside its names-only scope. |
| 7 | 🆕 **Enlarge ALL dish sprites.** `CONFIG.sizes.enemy` is **44** for every archetype — 61% of the 72-unit belt. Block 1's ×2 landed well, so the rest follow. Proposed base **64** (89% of belt width), with `DISH_SIZE_MULT` for chai/coffee dropping **2 → 1.375** so block 1 stays at its current, approved 88. ✅ Sizes are cosmetic — targeting and splash use centre points — so **no balance impact**. ⚠️ **Trade-off, stated:** at level 80 spacing puts beetles ~43 units apart, so 64-unit sprites overlap more than 44-unit ones. That is the very overlap the held **bumping separation** task exists to fix, so this makes the case for it stronger. |
| 8 | 🆕 **Shrink block 1's shadow — by deriving it from the BASE size, not the scaled one.** Every decoration in `towerScene.ts` derives from `size = baseSize × DISH_SIZE_MULT`, so doubling chai/coffee doubled the shadow too: `shadow.ellipse(0, size*0.42, size*0.4, size*0.14)` at size 88 is **70.4 units wide on a 72-unit belt — 98% of it**. Deriving the shadow from `baseSize` instead pins it at ~51 units regardless of the dish multiplier. ✅ **That is "smaller, exclusively for block 1" by construction**, since block 1 is the only place a multiplier applies — a rule rather than a special case, and it stays correct when task 7 changes the base. Consider the same for `ice` (currently `size*1.25` → 110 units at block 1). |
| 9 | 🆕 **Finish the pause-overlay fix, and verify it on a device.** The polish round could not reproduce the left-edge leak headless and shipped the standard cause speculatively — but **only half of it**. `app.css:25` now uses `100dvw` for portrait; `app.css:37`'s landscape branch still reads `min(100vw, calc(100dvh * 9 / 16))` — the exact unit the fix exists to avoid. The agent's "landscape" test was desktop CDP at 900×500, which does not exhibit the mobile-chrome drift that causes this. **Fix the landscape branch too, and verify on a real phone in both orientations.** |
| 10 | 🆕 **Same-archetype bumping separation.** Enemies take engine coordinates verbatim (`v.node.position.set(e.x, e.y)`), so identical `dist` means identical pixels — overlap is the absence of any separation step, not a bug. 🔴 **Render-level only:** after positioning, run a short relaxation pass — for each pair **of the same archetype** whose sprites are closer than a minimum, push each back along the line between them by half the shortfall. Two iterations is plenty at 120 enemies. ✅ `dist` is never modified, so **zero balance risk**, and "different types can cross" falls out because the pass only compares like with like. ⚠️ Clamp the push (≈ ≤ 0.35 × sprite size) or a dense cluster shoves a dish off the belt edge. 🔥 **More relevant now, not less** — task 7 takes dishes from 44 to 64 while level-80 spacing puts beetles ~43 units apart. |
| 11 | **Shrink the glow** — `towerScene.ts`'s `glow.width = size * 1.9` → **~1.2**, and re-weight `makeGlowTexture`'s falloff so alpha peaks near the **rim** instead of the centre. Today it's a halo; it should be a rim-light. 🔴 Urgent because ×2 chai/coffee makes block-1 glows **167 units on a 72-unit belt**. |

#### For the art agent

✅ **Nothing — block 9 is already done.** Entry/exit were reversed (dishes arrived at the
serving table and left at the spices). 🔒 **The user chose a vertical flip over
regeneration, Sep 11**, and it shipped that way: re-derived from the retained
`bg-block-9-take1.png` with the flip applied, so the JPEG is encoded once rather than
twice (720×1280, 121,380 B, q70).

⚠️ **The trade-off was measured and accepted, not missed.** A flip puts the chandelier
at the bottom and inverts the lighting gradient against the other eight blocks. In
isolation that reads wrong; at board scale, under the belt and towers, it reads as a
corner light fixture. Recorded so nobody "fixes" it later as a bug.

⚠️ **Why the payout and not the costs.** Raising `costBase`/`costStep` would fix the
ratio too, but the user's standing rule is *"as long as the current leaderboard doesn't
reset and player earnings aren't reset."* Players hold banked gems: **lowering the payout
leaves those untouched, while raising costs silently devalues them.** The payout is the
safe lever.

#### 🚫 Deliberately NOT in this round

- **Wave roster panel** (§8) — left out cleanly rather than attempted as a stretch. A
  half-built panel at the freeze is worse than none. Its unique value is that it is the
  only thing that would ever render `EnemyDef.name`.
- ~~Same-archetype bumping separation~~ → ✅ **moved INTO the round, Sep 11.** The user's
  hold was *"until the current round returns"*; the polish round returned and was
  accepted, so the condition expired. It is task 10 above. ⚠️ **Recorded because I nearly
  lost it** — the glow, held under the same sentence, was carried forward while this was
  left sitting in a "held" list. A conditional hold needs re-checking when its condition
  is met, not just when someone asks.
- **Regenerating the other eight backdrops.** Every one was generated before the
  generator was told where the belt enters and exits; block 9 is simply where it shows,
  being the only backdrop with explicit entry/exit furniture.

#### Return — Tier A, verified from source Sep 11 2026 · commit `f7b1344` · private **v1.55.0**

✅ **Seven files changed, none of them sealed:** `config.ts`, `data/towers.ts`,
`textures.ts`, `towerScene.ts`, `state/save.ts`, `styles/app.css`, `ui/EndScreen.tsx`.

| Check | Result |
|---|---|
| `enemies.ts` / `waves.ts` / `sim/engine.ts` untouched | ✅ absent from the changed-file list |
| `save.ts` diff is the payout formula only | ✅ the loop → `n * gemsPerWave`, plus its doc comment |
| `gemsPerWave` 1 → 4 contained | ✅ **exactly one consumer** (`save.ts:197`); `config.ts` was never sealed, so in scope |
| Balance unmoved | ✅ re-run independently: **35 / 34 / 6 / 4 / 90** |
| End-screen copy | ✅ matches this record's proposed wording **verbatim**, both lines |
| Last stale `desc` | ✅ gone; remaining "Fryer"/"Tandoor" hits are code comments, not player-facing |
| Dishes 44 → 64, `DISH_SIZE_MULT` 2 → 1.375 | ✅ block 1 holds at its approved 88 units |
| Shadow / glow / ice from `baseSize` | ✅ — and `sprite.width` / `hpBar` correctly **still** follow `size` |
| Landscape branch on `100dvw` | ✅ both branches now agree |
| Bumping is render-only | ✅ grouped by archetype, nodes re-set from engine state every frame, no drift |

✅ **The glow was re-implemented, not re-tuned, and the agent's reason is correct.**
Nested filled discs composite brightest at the centre no matter how each ring's alpha is
weighted, because every smaller disc paints over every larger one — that shape *cannot*
become a rim-light by tuning alpha. Stroked thin rings let each radius carry its own
alpha; the peak now sits at ~82% of the radius.

#### 🔴 Four findings the return report did not raise

1. **The ice overlay is now smaller than the chai/coffee sprite** — ice `64 × 1.25` =
   **80** against an **88**-unit sprite, where it was 110 vs 88 before. A frozen block-1
   dish may show its edges outside the frost. Task 8 named *the shadow* and merely said
   *"consider the same for `ice`"*; the agent applied it. Defensible, but it is the one
   change here that trades a working behaviour for consistency.
2. **Enemy textures now rasterise at 64, not 44** — `textures.ts:425` also reads
   `CONFIG.sizes.enemy`. This is a **quality gain** (chai was a 44 px texture upscaled
   ×2; now 64 px upscaled ×1.375) at a small runtime VRAM cost. No bundle bytes. Not a
   defect — an uncosted consequence.
3. **Perfectly coincident pairs never separate** — the guard is
   `dist >= minSep || dist < 0.0001`, so sprites on *identical* pixels are skipped.
   Near-overlap, the actual photographed symptom, is handled. Low severity.
4. **The glow's outermost ring is clipped at the texture edge** — it sits at exactly
   `r = cx` with a ~7.4 px stroke, so half falls outside the 128 px texture, leaving a
   hard circular cut at alpha ≈ 0.32 outside the bright rim (alpha 0.6, r ≈ 52).

⚠️ **Unverifiable from here, and shipped deliberately unresolved for the user's device
playtest:** all four above plus FTUE cue alignment in both orientations. The agent
root-caused the tab-visibility rAF throttling that blocked automated runs
(`Page.setWebLifecycleState` + `Emulation.setFocusEmulationEnabled`) and cleared waves
1–3 end-to-end at 390×844 — real tooling progress — but a resized desktop browser still
cannot reproduce mobile Chrome's address-bar collapse, **which is the entire symptom the
`dvw` fix targets**.

#### ⚠️ A verification hazard found while checking this round

Twice, a `git diff -- <pathspec>` of mine matched **nothing** and returned "0 lines",
which reads identically to "no changes" — a **false pass on the sealed-file check**. The
cause: `jam-entry/` is a **sibling** of `Ramu - The Chef` at the repository root, not a
child of it, and the repo root is the parent `September GameJam` folder. 🔥 **A check
whose failure mode is silent success is not a check.** The zeros recorded above instead
come from the changed-file list, which cannot fail that way. ✅ **Rule: when a
verification passes by returning nothing, first prove it can return something.**

#### Deploy — verified independently Sep 11 2026

`rundot whoami` → **offroadinggamedev@gmail.com**. `rundot game list-tags` → **Private
1.55.0 · Review 1.42.0 · Public 1.42.0**. No `set-public` / `set-private` / `update-tag`
run. ✅ **The changelog cleared moderation on the first attempt** — the "Stockpot" /
"Saucepot" one-word workaround holds.

#### Verdict — ✅ **TIER A ACCEPTED**, Sep 11 2026 — verified from source, then
playtested on device. 🔴 The playtest found the bumping separation shipped here was
**pushing dishes off the belt**; that became Tier 1 below.

---

### 2026-09-11 — Final round, Tier 1 — the belt escape and the glow

**Status:** ✅ **RETURNED, VERIFIED, DEPLOYED, PLAYTESTED, ACCEPTED** — commit `2a05da0`,
private **v1.56.0**, Sep 11–12 2026. Two files: `textures.ts`, `towerScene.ts`.

#### Why

v1.55.0's same-archetype separation was **free 2D**, with `minSep = (a.size + b.size) * 0.5`
— **88 units for chai/coffee against a 72-unit belt**, which is unsatisfiable, so the pass
pushed outward every frame until dishes stood on the floorboards. Block 2 at 64 had 4
units of margin, which a corner ate. 🔥 **Arithmetic, not tuning.** The push being a 2D
vector made it worst exactly at corners, where it points across the belt rather than along
it. The jitter had the same cause: the pass recomputed from raw positions every frame and
was pair-order dependent.

Separately, the glow was a **circle sized from one scalar** while dishes are wide, short
and differently proportioned per block — chai/coffee draw 88×64.5, block-2 dishes 64×41.8.
One circle cannot hug both.

#### Return — verified from source

✅ **The belt fix is structurally right, not merely clamped.** Every enemy position now
comes from `posAt(clamp(e.dist + distOffset, 0, PATH_LENGTH))`, and `relaxEnemyPositions()`
is the **sole writer** of enemy node positions — nothing else in the file reads or sets
them, so no hit-testing depends on the old coordinates. On-belt is true **by
construction**; the agent's 45,066-sample sweep confirms rather than establishes it.
Separation is 1D along the path, decayed 0.88/frame, clamped 6 units per pair per
iteration and ±20 accumulated. `e.dist`/`e.x`/`e.y` are never written.

✅ Sealed files absent from the commit. ✅ Balance re-run independently: **35 / 34 / 6 / 4 / 90**.
✅ Glow ellipse verified against the measured art: block 1 → 101×74, block 2 → 74×48.

#### 🔴 Four findings the return did not raise

1. **The glow's hard outer edge is only half-fixed.** The ring is no longer clipped, but
   the outermost ring is drawn at `r = cx - strokeWidth/2` with a 7.4-wide stroke, so its
   outer boundary lands at **exactly `cx` again**, at alpha ≈ 0.32 rather than tapering to
   zero. ✅ **The user inspected it and accepted it** — `makeGlowTexture` is now closed.
2. **`zIndex` still derives from `e.y`**, not the relaxed position, so depth order between
   separated dishes can be marginally wrong. Cosmetic; offsets cap at 20 units.
3. **Acceptance criterion 6 — "no oscillation" — was unreported.** The 45k sweep proves
   criterion 4 (on-belt), not convergence. ✅ **Closed by the playtest: no jitter.**
4. **Enemies within 20 units of the burrow clamp to `d = 0`** and can re-overlap at the
   mouth. Minor, brief, spawn-only.

#### ⚠️ A property of the 1D fix worth writing down

**Separating along the path does not separate on screen at a corner.** Two dishes 70 units
apart *along the belt* but straddling a 90° turn can be nearly coincident in straight-line
distance. Not a defect — the alternative is the 2D scheme that walked dishes off the belt
— but it is why glows can still visually pile up at a corner, and it is the leading
explanation for a block-1 halo that measured 1.15× the cup yet photographed much larger.

#### Playtest — v1.56.0, Sep 12 2026

| # | Watched for | Result |
|---|---|---|
| 1 | Jitter | ✅ **gone** |
| 2 | Block-2 glow | screenshot returned; not objected to |
| 3 | Block-1 cup glow | ❌ **"too loose"** — user requires **at least half** the radius |
| 4 | Faint hard edge at the glow boundary | ✅ **accepted as-is** |
| 5 | Dishes leaving the belt | ✅ **"they follow the path properly"** |

#### Verdict — ✅ **ACCEPTED**, Sep 12 2026, with the glow size carried into Tier 2.

---

### 2026-09-12 📤 Final round, Tier 2 — the station rail, the board re-anchor, and the glow

**Status:** 📤 **HANDED OVER Sep 12 2026, not yet returned.** Written at handover time, per
this file's own rule. 🔴 **Last code round before the freeze — end of Sep 13.**

| # | Task | Files |
|---|---|---|
| 1 | **Halve the chai/coffee glow.** A `DISH_GLOW_MULT` beside `DISH_SIZE_MULT`, chai/coffee **0.5**, applied to both axes. Block 2 and later unchanged — the user confirmed those read correctly. | `towerScene.ts` |
| 2 | 🔒 **The 140-unit station rail** (`002` schematic) — four stations for placement **and** the selected-tower panel (Sell / Upgrade / Target), replacing the bottom `BuildSheet`. ✅ The board is already built for it: Round I narrowed the belt x610→x540 to clear 180 units, and that reserved strip is the empty band in every screenshot. | `BuildSheet.tsx`, `Hud.tsx` |
| 3 | **Re-anchor the board** — `BOARD_SCALE` 0.85 → **0.80**, `offsetX` left-aligned rather than centred, both in `getFit`. | `stage.ts` |

⚠️ **A prediction recorded before the return, so it can be checked rather than argued.**
The cup's drawn content measures ~88×64.5 and the glow draws *behind* the sprite, so at
0.5× (**~51×37**) it may be **fully occluded and effectively invisible**. My arithmetic puts
the current glow at only **1.15×** the cup, which does not match how large it photographs.
🔴 **The user reaffirmed "at least half" twice, so it ships as instructed** — and the return
must report what it actually observes rather than silently choosing a different number.
If it disappears, that is one constant to retune and it also tells us the size model was
right and something else explains the photograph (see the corner note above).

✅ **`makeGlowTexture` is explicitly out of scope** — the user accepted its outer edge.

🔴 **Sealed:** `enemies.ts`, `waves.ts`, `sim/engine.ts`, `towers.ts`. Reading `posAt` /
`PATH_LENGTH` is not a modification. Balance must stay **35 / 34 / 6 / 4 / 90**.

---

### 🔒 The two deadlines — CP8 is OUR gate, not the jam's, Sep 12 2026

⚠️ **These are different instants and I had been collapsing them into one.**

| | Published (PT) | **IST** | What it is |
|---|---|---|---|
| **CP8 — final deploy verified public** | Sep 14, **11:00 PT** | **Sep 14, 23:30** | 🔒 **Ours.** [Plan.md](Plan.md) § Deadlines |
| **Jam submissions close** | Sep 14, **12:00 PT** | **Sep 15, 00:30** | 🔴 **Theirs.** The hard stop |
| Judging closes / scoring ends | Sep 18, 12:00 PT | Sep 19, 00:30 | 🔴 Theirs |

✅ **The hour between CP8 and the jam's close is deliberate margin**, and it exists
because shipping is not on our clock: only RUN writes the public tag, by approving
`review`, with **no CLI to request approval** and a lead time measured at a sample of one.

🔴 **I spent days telling the user "the build deadline is CP8, Sep 14 23:30 IST."** CP8 is
not the build deadline — it is an internal checkpoint holding an hour in reserve. Then,
asked to re-derive it from the jam's own page, I found *noon PT*, concluded the documents
were an hour wrong, and **very nearly rewrote four accurate references** — which would have
deleted the margin while appearing to be a correction. `Plan.md` had recorded CP8 as
**11:00 PT** the whole time; 11:00 PT → 23:30 IST is correct arithmetic. Recorded as
[Retro.md](Retro.md) lesson 97.

#### 🔥 And the deadline is the wrong thing to optimise for anyway

Quoted from the jam page: the metric is *"total unique plays per player, counted from the
moment you publish through judging closes September 18 at noon PT"*, and — explicitly —
**"Publishing earlier gives your entry more time on the board."**

🔴 **The entry has been public at v1.42.0, the Sep 4 build, the entire time**, while every
improvement since sits in `private`. This is not a deadline to hit; it is a race to get the
better build in front of players. **Promote as soon as a build verifies, not when the clock
runs out.**

---

### 2026-09-12 — Final round Tier 2 — returned, then REJECTED on playtest

**Status:** ❌ **REJECTED** — commit `78c2be4`, private **v1.57.0**. Superseded by the
retract round below. Tasks 1–3 all landed and verified; the *design* was wrong.

✅ **Verified from source:** `DISH_GLOW_MULT` applied on both axes; `RAIL_WIDTH_UNITS = 140`
exported from `stage.ts` and run through `getFit()`'s own scale with `Hud.tsx` consuming
the same hook; `BOARD_SCALE` 0.80 and `offsetX = 0` inside `getFit` only. Balance
**35 / 34 / 6 / 4 / 90**. Sealed files absent.

✅ **A prediction recorded before the return, and it FAILED — marked rather than
forgotten.** The Tier 2 entry predicted the halved cup glow might be fully occluded behind
the 88-wide sprite. It was not: it renders as a visible tight ring. 🔥 **My size model
said the glow was only 1.15× the cup, which never matched how large it photographed — the
model was wrong somewhere and the failed prediction is the evidence.**

🔴 **Why it was rejected:** the rail was built as a **persistent column that permanently
reserved screen width**. Three things made it so — `StationRail.tsx` returned null only on
`lost`/no-engine; `Hud.tsx` applied `paddingRight: railPx` unconditionally; and `getFit`
reserved the strip via `BOARD_SCALE 0.80` + `offsetX = 0`. The user's verdict: the reserved
area *"shouldn't exist"*, and the board *"breaks away"* — `offsetX = 0` pinned it flush to
the left edge with no margin where it had been centred.

➕ **Quantified, and it argued against the design too:** because `FIT_HEIGHT` is 1650,
**height binds on real phones**, leaving 38 px (390×844) to 52 px (360×740) of dead space
past the rail — 10–14% of screen width doing nothing beside a rail whose buttons measured
38–45 px, under the ~44 px touch-target guideline.

---

### 2026-09-12 — Retract the rail, restore the centred board

**Status:** ✅ **RETURNED, VERIFIED, DEPLOYED, ACCEPTED** — commit `183343e`, private
**v1.58.0**. Three files: `stage.ts`, `Hud.tsx`, `StationRail.tsx`.

The user's design, and it is **simpler** than what it replaced: the panel **retracts when
not required and expands on prop placement or upgrade**, overlaying the board rather than
reserving layout. All three tasks were reverts.

| # | Task | Verified in source |
|---|---|---|
| 1 | `BOARD_SCALE` → **0.85**, `offsetX` → centred | ✅ `stage.ts:105`, `:124` — the exact v1.56.0 fit |
| 2 | Panel conditional again | ✅ `StationRail.tsx:118` — `selectedPad === null` guard restored |
| 3 | HUD padding removed | ✅ no `paddingRight`/`railPx` left in `Hud.tsx` |

✅ Balance **35 / 34 / 6 / 4 / 90**. Sealed files absent. `DISH_GLOW_MULT` untouched.
Board measured centred with equal margins (38.48/38.48 px at 390×844; 42.76/42.76 at
360×740).

🔥 **The FTUE ran end to end for the first time** — place0 → wave 1 → upgrade0 with Sell
disabled → wave 2 → place2 with the empty-pad pulse → wave 3 → retired, zero runtime
errors, Upgrade arrow measured on the button's own rect. That was the outstanding gap from
two rounds running, and it is now closed.

#### Verdict — ✅ **ACCEPTED**, Sep 12 2026, with one follow-up: the panel is too tall.

---

### 2026-09-12 📤 Panel height — content-height, vertically centred

**Status:** 📤 **HANDED OVER Sep 12 2026, not yet returned.** Written at handover time.
🔴 **Final round before the freeze.**

The panel retracts correctly but **fills the entire viewport height**, leaving a large dead
dark column between the four station cards and a `Close` button pinned to the very bottom.
User's words: *"it retracts but it's too long."*

| # | Task |
|---|---|
| 1 | Height **`auto`** — no `h-full`, no `inset-y-0`, no `bottom-0` stretch. |
| 2 | **Vertically centred** on the right edge, roughly a third of the viewport tall. |
| 3 | `Close` sits **directly beneath the content**, inside the panel. |
| 4 | Inset from the right edge, rounded corners, background stays **opaque** (`bg-surface`). |
| 5 | Width unchanged. |

⚠️ The occupied-pad panel (Sell / Upgrade / Target) is taller than the station picker —
auto height must hold for both, both stay centred. If content ever exceeds a short
viewport it scrolls **inside the panel**; the page never scrolls.

🔴 Sealed: `enemies.ts`, `data/waves.ts`, `sim/engine.ts`, `data/towers.ts`. Balance must
stay **35 / 34 / 6 / 4 / 90**. `DISH_GLOW_MULT` and `BOARD_SCALE = 0.85` untouched.
Deploy private **v1.59.0**.

#### Return — Sep 12 2026, verified from source

✅ **ACCEPTED.** Commit `c1c0ba1`, private **v1.59.0**. One file, `StationRail.tsx`,
+24/−4 — of which only **three lines are functional**; the rest are comments.

| | Before | After |
|---|---|---|
| wrapper | `absolute inset-y-0 right-0` | `absolute inset-y-3 right-3 flex items-center` |
| panel | `flex h-full … px-1.5 pt-safe-top pb-safe-bottom` | `flex max-h-full w-full … rounded-2xl p-1.5` |
| `Close` | `mt-auto mb-1 w-full …` | `w-full …` |

**Verified independently:** sealed files absent from the changed-file list (with a positive
control proving the check *can* match — [Retro.md](Retro.md) lesson 93); `npm run balance`
re-run → **35 / 34 / 6 / 4 / 90**; `tsc --noEmit` exit 0; `BOARD_SCALE 0.85`, centred
`offsetX`, `DISH_GLOW_MULT {chai: 0.5, coffee: 0.5}` and `GLOW_PAD 1.15` untouched; the
retract guard intact at `StationRail.tsx:126`; secret scan clean across all 9 unpushed
commits, positive control matching 40 lines; `rundot whoami` → the entry account; tags read
back **private 1.59.0 / review 1.42.0 / public 1.42.0**.

⚠️ **The mechanism was verified, not the pixels.** The wrapper is a *row* flex with
`items-center`, so the cross axis is vertical and the child centres; dropping `h-full` is
what produces content height; `max-h-full` caps against the `inset-y-3` parent, so
`overflow-y-auto` can only ever engage *inside* the panel. The live figures
(370 / 421 / 435 px) are the agent's measurements and were **not** reproduced here.

🔍 **One unreported change, chased and cleared.** The panel lost
`pt-safe-top pb-safe-bottom`. That is correct rather than an oversight: the padding existed
because the panel was `inset-y-0 h-full`, flush against the notch. Content-height and
centred, its top edge sits ~237 px down at 390×844, and `max-h-full` only reaches the
notch on a portrait viewport under **~460 px tall** — not a real device. ➕ Worth keeping:
an absolutely positioned child takes its containing block from the **padding box**, so
`Hud.tsx:180`'s own `pt-safe-top` never offset this wrapper in the first place.

---

### 2026-09-12 — Pushed: 9 commits, `334f54c..c1c0ba1`

Everything through v1.59.0 is on `origin/main`. ⚠️ **The push foreclosed the `67c5452`
cleanup** described below — it was offered and then made expensive in the same exchange,
because the two were presented as independent when the ordering mattered.

#### 🟡 Open, user's call — the rename in `67c5452`

`67c5452` ("Record Tier 1's return…") swept in the `BuildSheet.tsx → StationRail.tsx`
rename (**R100, zero content**) alongside three docs. Now **pushed**, with **4 commits on
top**, and **3 of their SHAs cited in this file** (`2a05da0` §:953, `78c2be4` §:1082,
`183343e` §:1112) — a rewrite invalidates all three.

| | Involves | Cost |
|---|---|---|
| **A — leave it** | nothing | `git log` shows the rename under a docs commit; `--follow` still traverses |
| **B — forward-only note** ⭐ | one line in this file | zero risk; history explains itself |
| **C — rewrite** | `rebase --onto` + cherry-picks (no `-i` in this environment), `push --force-with-lease` **to a public repo**, then patch 3 stale SHAs | 5 new SHAs, a force-push inside the final 48 h, anyone who cloned diverges |

✅ **B recommended.** C buys a cosmetic attribution fix and pays with a force-push to a
public repo two days from the deadline.

---

### 2026-09-12 📤 Final round — FTUE cues, Ready button, boot flow, map transition

**Status:** 📤 **DISPATCHED Sep 12 2026, not yet returned.** Written at handover time,
per this file's own rule. Sources: three annotated playtest screenshots plus a flow
instruction.

| # | Task | Files |
|---|---|---|
| 1 | **Point the FTUE placement arrow at the station rail, not the pad.** The selected-pad ring already says *which* pad; the arrow must say *where to tap*. Applies to `place0` and `place2`; **`upgrade0` is already correct.** Reuse `StationRail.tsx:110-124`'s live-`getBoundingClientRect()` anchoring rather than a board-space position. Dead `arrowPos` plumbing to be removed, not orphaned. | `Hud.tsx`, `StationRail.tsx` |
| 2 | **Ready button: move up, enlarge, add a looping `motion-safe:` scale pulse** whenever available. | `Hud.tsx` |
| 3 | **Boot straight into Challenge Mode** with the FTUE armed. `main.tsx:73`'s `phase: 'menu'` becomes the scripted-run payload `MainMenu.tsx:88-94` already builds. | `main.tsx`, `audio.ts` |
| 4 | **Slower backdrop crossfade (~2.5 s) + a transition sting**, with **Ready disabled for the visual transition**. | `towerScene.ts`, `audio.ts` |

⚠️ **Task 2 has a collision the mockup cannot show.** The Kitchen Actions row sits at
`bottom-24` and the wave-4 "Tap a cook to upgrade" toast at `bottom-40`, but the screenshot
was taken with `ftueActive` true, which **hides the actions row**. `Hud.tsx:355-368` already
documents this exact overlap biting once. Must be verified at **wave 4+ with the FTUE
finished**, not only during it.

🔴 **Task 3's hidden breakage:** `audio.ts:83` hard-codes `switchCue('menu')` in the
**audio-unlock handler**. Booting into gameplay means the player's first tap starts *menu
music over Challenge Mode*. It must become phase-aware. ➕ Unavoidable and merely noted:
autoplay policy needs a gesture, so with no menu tap the BGM stays silent until the first
in-game tap.

✅ **Task 3 is mostly already true.** `MainMenu.tsx:84` records that the scripted FTUE is
*persistent* — **every** run enters scripted, and `save.ftue.challengeDone` no longer gates
entry — so "always starts with FTUE" already holds per run. Only the boot destination was
missing, and both exits (`Hud.tsx:453`, `EndScreen.tsx:136`) already reach Main Menu.
⚠️ Consequence accepted by the user: Leaderboard and Meta Upgrades are Main-Menu-only, so
a first-time player has no gem-spend path until they exit once.

🔴 **Task 4's real design problem.** `updateBackdrop` (`towerScene.ts:283`) fires on
*"the art became available"*, not *"the map changed"*, and runs **every tick**. Three
situations reach it and only one may sting:

| | Situation | Required |
|---|---|---|
| 1 | Game start — grass fallback → block 1 art | crossfade **silently** |
| 2 | **Block change, art cached** | ✅ sting + Ready lock |
| 3 | Late load — art lands mid-wave, arbitrary timing | crossfade **silently** |

So a **tracked block-id change** is required, held separately from the sprite crossfade;
triggering off `backdropSprites.length > 1` is wrong. There are **9 blocks → 8 transitions
per run**. The Ready lock covers the **visual** crossfade (~2.5 s), not the sting's full
length — the tail rings out under the resumed BGM. Both durations are named constants.

🔴 **Sealed:** `enemies.ts`, `data/waves.ts`, `sim/engine.ts`, `data/towers.ts`.
Balance must stay **35 / 34 / 6 / 4 / 90**; `BOARD_SCALE 0.85` and `DISH_GLOW_MULT`
untouched.

#### Return — v1.60.0, Sep 12 2026 — ⚠️ ACCEPTED WITH TWO REGRESSIONS

Commit `a507e51`, 10 files. All four tasks landed and the agent reported honestly, including
two bugs it found and fixed while wiring task 1 (an `!!engine` effect-deps omission that made
the arrow never appear on a fresh run's first render, and a 68 px drift once `towerIcons`
resolved async — fixed with a `ResizeObserver`, matching `useRailWidthPx`'s own precedent).

✅ **Verified from source:** sealed files absent from the changed-file list (control:
10 files); balance **35 / 34 / 6 / 4 / 90**; `tsc` exit 0; `BOARD_SCALE 0.85` and
`DISH_GLOW_MULT` untouched; `__verify_hooks.ts` scaffold cleaned up by the agent itself.
The backdrop trigger was checked **in the code, not the commit message**: `trackedBlockId`
starts at 0, `priorBlockId > 0` excludes the game-start swap, and `Assets.cache.has()` is
tested **at the boundary tick**, held apart from the per-tick poll that performs the
crossfade — so a late load cannot retroactively qualify. The Ready lock is a **real gate**
(`actions.ts:224` early-returns), not just a `disabled` attribute.

#### 🔴 The playtest found two regressions the harness could not

| # | Finding | Outcome |
|---|---|---|
| 1 | **No FTUE arrow at all** — `place0` *and* `upgrade0`, on the deployed build | 🔴 still open, see v1.61.0 |
| 4 | **Music: menu track carried into gameplay**; FTUE played the synth, not a cue | ✅ fixed in v1.61.0 |

🔥 **Finding 4's root cause, found by reading rather than guessing.** `fetchCueBuffer`
stored its in-flight promise in `cueFetches` and **never removed it when that promise
resolved `null`** — so one failed fetch poisoned that cue for the whole session. The new
boot flow then *systematically caused* that first failure: `registerEngine()` called
`switchCue('service_low')` at mount, **before any user gesture**, when `ctx` was still null.
One defect explained all three of the user's observations exactly — synth during FTUE
(service_low poisoned), correct menu track (fresh id, `ctx` now exists), and the menu track
continuing into Challenge Mode (cached null promise returned, so no switch happened). A
second, independent blocker sat behind it: `switchCue` assigns `activeCue = id` *before*
fetching, so the unlock handler's own call hit `if (activeCue === id) return` and could never
recover it.

⚠️ **The new BGM had therefore never actually played in-game** at the point the user
approved it — the approval was on the files and on the menu cue only.

---

### 2026-09-12 — Delivered audio wired; two regressions, coin popups, burrow holes

**Status:** ✅ **RETURNED, VERIFIED, SOUND-CHECKED** — commit `1816ef1`, private **v1.61.0**.
Four files, +200/−17.

| # | Task | Outcome |
|---|---|---|
| 1 | Wire all five delivered audio entries | ✅ — confirmed by ear |
| 2 | 🔴 Music never switches back to gameplay | ✅ — confirmed by ear |
| 3 | 🔴 FTUE arrow missing | ⚠️ **NOT REPRODUCED; instrumented instead** |
| 4 | Coin popup per kill | ✅ |
| 5 | Entry/exit holes enlarged | ✅ |

✅ **Verified from source:** sealed clean (control: 4 files); balance **35 / 34 / 6 / 4 / 90**;
`tsc` exit 0. Both music defects genuinely closed —
`p.then((buffer) => { if (!buffer) cueFetches.delete(id); })` stops the poisoning, and
`if (isAudioUnlocked()) switchCue('service_low')` stops causing it. ➕ The assumption the
second fix rests on was checked rather than taken on trust: `ctx` is only ever created
inside `ensureCtx()`, which is called from the unlock handler, so `isAudioUnlocked()` is
genuinely false before the first gesture.

✅ **The leak exclusion is stricter than the handover asked for**, and right:
`if (leakCount !== 0 || missing.length !== deathCount) return;` — it credits **nothing** when
any leak occurred in the substep, or when the missing-uid count doesn't exactly match the
death count. It errs toward showing nothing over showing something wrong. ⚠️ Trade-off: a
kill coinciding with a leak in one frame shows no popup. Correct direction.

✅ **The burrow was sized from measurement:** a round line cap extends the stroke half its
width past each endpoint, `(pathWidth + 14) / 2 = 43` units, against the old hole's 32 — an
11-unit protrusion at both ends. Height `86`, width `147.8`, original aspect preserved.

#### ✅ Sound check PASSED — Sep 12 2026

User, on device: *"All BGMs are smoothly transitioned. SFX works properly as well."* This is
the acceptance that could not be reached from any agent environment, and it closes the audio
thread that began at round A4 — see [AudioGenPrompts.md](AudioGenPrompts.md).

#### 🔴 BLOCKER — debug instrumentation must be stripped before the `review` tag

`StationRail.tsx`'s `logArrow()` calls `RundotGameAPI.log()` **and** `console.log()` on every
effect run, **ungated** — no `import.meta.env.DEV`, no debug flag. Correct for a private
diagnostic build; unacceptable in a shipped one, where every player's FTUE would write into
RUN's host-side support log and any judge opening devtools sees `[ftue-arrow]` spam. It leaks
nothing sensitive — this is noise and polish, not security.

🔥 **Consequence for the endgame: v1.61.0 cannot be the promoted build.** Either the
arrow log reveals the cause and one round fixes it *and* strips the logging, or the arrow
behaves on device and a one-line strip is the only thing between this and `review`.

#### Return — ❌ the arrow was still missing on device

The instrumentation round did its job: it proved the arrow was not the only thing wrong.
The playtest that followed found a **second, fatal symptom of the same underlying defect**
— returning to the main menu and starting Challenge Mode left the player unable to select
any prop. See v1.62.0 below.

---

### 2026-09-13 — v1.62.0 🔴 BLOCKER: engine readiness was not store state

**Status:** ✅ **FIXED AT THE ROOT**, commit `763899b`.

**Repro:** cold boot → FTUE → **place nothing** → Main Menu → Challenge Mode → the station
rail never appears. Unplayable. ⚠️ Placing a tower first *hid* the bug, which is what made
it look intermittent.

🔥 **Mechanism.** `StationRail` read the engine via `getEngine()` — a plain module call,
**not a store subscription** — and gated its entire render on it. `createPixiApp` is
`async`, so `registerEngine()` **always** lands after the first render; the first render
therefore always returned `null`. Recovery depended on a later re-render, which requires a
**subscribed value to actually change**, because `useStore` is `useSyncExternalStore` and
bails on `Object.is`-equal snapshots. On the no-placement Menu → Challenge path,
`coins`/`lives`/`wave`/`tdPhase`/`selectedPad` were **all already at the values the new run
re-establishes**, so `syncStore()`'s diff guard failed, nothing was patched, and the
component never re-rendered. Placing a tower first spent coins — which made `coins` differ,
which forced a re-render, which fixed it by accident.

✅ **Fix:** `store.engineReady`, patched in `registerEngine()` and nowhere else. ➕ The
subtlety that matters, and that the implementing agent called out unprompted: it is patched
**unconditionally on BOTH registration and teardown**. The teardown half is what guarantees
the next registration is a genuine `false → true` transition rather than a no-op re-patch of
an already-true value that a freshly mounted component would never observe.

⚠️ A second non-reactive `getEngine()` render-path read was found in `Hud.tsx`'s Kitchen
Actions row by the requested audit — not the reported repro, same latent class, fixed too.

---

### 2026-09-13 — v1.63.0 — the arrow, by deletion; and music ducking

**Status:** ✅ **ACCEPTED**, commit `8c9920d`.

🔥 **The FTUE arrow was fixed by deleting the approach, not debugging it.** Three rounds
had failed on device using `getBoundingClientRect()` → viewport coords → `position: fixed`
→ `ResizeObserver`. The user's own reframing — *a sideways arrow pointing at the panel* —
made the measuring unnecessary: the arrow is now laid out **inside the rail panel's own box**
(`absolute`, `right-full`), so nothing measures anything and there is nothing to go stale,
land off-screen, or be clipped. ✅ **Confirmed working on device at all three beats** after
three consecutive failures. The lesson generalises: when a positioning bug survives three
fixes, the positioning *strategy* is the bug.

✅ **Music ducking** under the transition sting: a dedicated `duckGain` node between every
music source and `musicBus`. `musicBus` stays the volume-slider master, so the duck and the
slider multiply independently and cannot fight — which the literal "measure the current
volume and restore it" approach would have done the moment a player moved the slider
mid-duck. The envelope is scheduled up front and **self-restoring**, and `resetMusicDuck()`
runs at both run start and scene destroy, so it can never latch ducked.

⚠️ The agent could not verify the audible curve: headless Chrome's `AudioContext` never
leaves `suspended` and `currentTime` stays frozen at 0, so scheduled ramps never execute.
It verified call ordering instead and said which was which. Confirmed by ear by the user.

---

### 2026-09-13 — v1.64.0 — sting level, and what `set-keywords` actually does

**Status:** ✅ **ACCEPTED**, commits `df66c31` (gain) + `f047888` (keywords config).

Sting gain **0.5 → 0.75** (the top of the user's 1.25–1.5× range). Chosen at the top on
purpose: the failure mode is asymmetric — too quiet means it still cannot be heard and costs
another deploy cycle, too loud is merely less pleasant and is the same one-line change back.
Headroom checked through the whole chain rather than assumed: the file peaks at
**−3.148 dBFS**, so with `SFX_BASE 0.6` at maximum slider the output peaks at
**−10.08 dBFS**. Nothing in 0.5–0.75 approaches full scale.

🔴 **`rundot game set-keywords` does not write to the server.** It edits
`jam-entry/game.config.prod.json`, and the **deploy's own "Syncing keywords" step** is what
ships it. Reading the server back showed `Keywords:` empty through several attempts — the
value was on disk the whole time. ⚠️ Two consequences worth keeping:

1. It mutates a **tracked file**. Git still held `"keywords": null`, so a deploy from a clean
   checkout would have silently wiped all eight. It must be committed.
2. The CLI's success echo proves only that it parsed the input, not that anything persisted
   — a check whose failure mode is silent success ([Retro.md](Retro.md) lesson 93 again).

Keywords now live: `tower-defense, cooking, chef, kitchen, indian, strategy, cozy,
back-to-work`.

---

### 2026-09-13 — v1.65.0 — three mobile-only layout defects

**Status:** ✅ **ACCEPTED**, commit `ee6e291`.

All three only appeared on an iPhone, never in desktop emulation, and they shared a cause:
**HUD elements are sized in fixed CSS units while the board scales via `getFit()`.** The PC
screenshots were taken at a ~739 CSS px viewport and the phone is ~403 — so the same fixed
sizing is proportionally ~1.8× larger against the same board.

🔥 **The Ready/Kitchen-Actions overlap had an exact, nameable cause.** The actions row was
`bottom-0 pb-safe-bottom`, i.e. `padding-bottom: calc(0.5rem + env(safe-area-inset-bottom))`.
On a device with a home indicator that inset is **~34px**, so the row's *content* sits 34px
higher than in any desktop test. Ready sat at `bottom-16` with **no safe-area handling** and
did not move. The previous round had measured a **16.0px** gap at 390×844 — in a desktop
browser, where that inset is **0**. 16 − 34 = **−18px**. ⚠️ And Ready rendered later in the
DOM, so it painted on top: the Kitchen Actions were **partially untappable on iPhone**, a
functional loss of the coin sink, not merely an ugly overlap.

✅ **Fixed structurally, not with another number.** Ready, the Kitchen Actions row and the
wave-4 toast are now **one bottom-anchored flex column** with `gap-2` and `pb-safe-bottom`
applied exactly once. They are flex siblings, so they stack — overlap is impossible at any
viewport, inset or text scale. That pair had collided **three times** under independent
anchors. The container is `pointer-events-none` with `pointer-events-auto` on exactly the two
interactive children, so gaps do not swallow board taps.

Also: the wave-4 toast got `z-20` against the pad pulses' `z-10` (same parent, so an
unambiguous comparison), and the rail's `Upgrade`/`Sell`/`Max` labels got `text-center`,
`px-1` and a smaller size.

---

### 2026-09-13 — v1.66.0 🔴 BLOCKER: mobile cold boot rendered no game

**Status:** ✅ **FIXED**, commit `5d67bfb`. Confirmed on device by the user.

**Repro:** open the private link **on a phone**, cold. UI and music load; the game area is
black. Exiting to Main Menu and entering Challenge Mode fixes it for that session.

🔥 **Severity: this was the whole funnel.** The entry boots straight into Challenge Mode, so
every mobile player opening the link would have seen a black screen and bounced — on an
entry scored by unique plays.

🔴 **Two independent root causes, both real, both fixed:**

**1. The async init IIFE in `GameCanvas.tsx` had no `.catch()`.** A rejected `app.init()`
vanished as an unhandled rejection: no scene, no `registerEngine()`, no error anywhere.
✅ **The diagnosis came from the screenshot, not from guessing** — `CASH 0`, `ESCAPES 0` and
**no Ready button** prove `syncStore()` never ran and `tdPhase` was never set, i.e.
`createTowerScene` never *completed*. A merely zero-sized canvas would still have shown
cash 140. That single observation ruled out the whole "it rendered small" family.

**2. `stage.ts`'s `layout()` had no zero-size guard.** `getFit(0, 0)` yields `scale = 0`, and
committing that leaves the board permanently invisible. ⚠️ **Pixi's `resizeTo` only responds
to WINDOW resize events**, never to the host element's own later resize — so a host that
sizes itself after init (an iframe in the RUN host, `dvw`/`dvh` settling on mobile) would
never recover on its own.

✅ **Fixes:** retry with a growing delay, `console.error` + `track('error_occurred')`, and a
visible **"The kitchen didn't load." + Try Again** affordance when retries are exhausted; a
`ResizeObserver` **on the host element** driving `app.resize()`; and `layout()` now declines
to commit a non-finite or non-positive scale rather than guessing a fallback size.

🔥 **The agent caught its own false-negative repro, and this is the most valuable part of
the round.** Its first attempt resized an iframe — which fires a resize event *inside that
iframe's own window*, which Pixi already handles. The test therefore exercised a path that
was never broken and "passed". It re-ran the repro against the mechanism the handover
actually named — resizing the host `<div>` with **no** window resize event of any kind — and
reproduced it directly: pre-fix the canvas stayed at a stale 390×844 regardless of the host;
post-fix it tracked exactly. It also forced `createPixiApp` to reject via a temporary hook
(reverted, verified 0-diff) to exercise the failure path end to end.

⚠️ **It never reproduced the original device trigger, and said so plainly.** Recorded as
[Retro.md](Retro.md) lessons 101 and 102 — the fix is defensive, and its real value is that
the same failure can no longer be silent.

Also this round: the objective banner became **"Don't miss an order — you only have
`{lives}` ❤️🏃 before you lose."** using the live count, moved into the flex column so the
`top-20` magic number is gone; and rail label font sizes began deriving from `getFit()`'s own
scale instead of a fixed rem.

---

### 2026-09-13 — v1.67.0 — the rail was too narrow, and a flex-wrapping trap

**Status:** ✅ **ACCEPTED**, commit `137b067`. One file.

🔥 **The label kept breaking because the font size was never the problem.** `railPx` was
`getFit().scale × RAIL_WIDTH_UNITS`, and on a tall phone `scale` is driven by **height**
(740/1650), not width:

| Viewport | scale | board width | **rail width** | text budget |
|---|---|---|---|---|
| **403×740 (the phone)** | 0.381 | 274 px | **53.4 px** | **33 px** |
| 390×844 | 0.435 | 313 px | 60.9 px | 41 px |
| 739×1318 (desktop) | 0.679 | 489 px | **95.1 px** | 75 px |

Fitting "Upgrade" on one line in 33 px needs a font of **≤ 8.7 px** — unreadable. **No font
size was both legible and narrow enough.** ⚠️ The rail is a *screen-space overlay*; tying its
width to the *board's zoom* was the mistake, and desktop's 95 px is why it always looked fine
there.

✅ **Fix:** `RAIL_MIN_PX = 88` floors the rail's CSS width independent of board zoom (→ ~68 px
text budget), labels got `whitespace-nowrap`, and the scale-derived font is clamped to
**11–18 px**. The rail now legitimately overlaps the board on narrow phones, by design — it
is an opaque panel that only mounts while a pad is selected.

#### ➕ The flex-wrapping trap, worth keeping

Applying `whitespace-nowrap` to the **station names** as well made "Pressure Cooker" overflow
(83 px of text in a ~64–76 px box). The agent's finding:

> *a flex child with no definite width never wraps regardless of `white-space` — which is
> why it hadn't overflowed visibly in earlier testing that only used shorter names*

Correct and non-obvious: a flex item shrink-to-fits to its **max-content** size, so
`white-space` never gets a chance to act. ✅ The fix was `w-full` to give it a definite width
— **not** forcing `nowrap` on it. ✅ And the right judgement call was made alongside it: a
mid-word break (`Upgra/de`) is a defect, a two-word station name occupying two lines is
ordinary typography. The rule was applied where it belonged and not where it didn't.

Verified with real `scrollWidth`/`clientWidth` comparisons — a check that can actually fail —
across **360, 390, 403 and 739 px**, in both panel states. 403 is the width that had been
slipping through while the tested ones passed.

---

### 🔒 Pre-public readiness check — Sep 13 2026

Run before preparing the `review` tag, since going public is hard to undo:

| Check | Result |
|---|---|
| Account | ✅ `offroadinggamedev@gmail.com` |
| Private / Review / Public | 1.67.0 / 1.42.0 (Approved) / 1.42.0 |
| Balance · sealed · tsc/build | ✅ 35/34/6/4/90 · 0 diff · clean |
| Debug instrumentation in `src/` | ✅ none |
| Keywords | ✅ 8, live, including `back-to-work` |
| Licensed audio on GitHub | ✅ none — only the 5 CC0 SFX |
| **Unfinished Kitchen Mode** | ✅ **gated behind `?test=1`** (`devMode.ts`) |

⚠️ **`store.ts`'s comment claiming the build must stay private until Kitchen Mode is done is
STALE.** Round A2 task 4 gated that mode behind `devModeEnabled()`, which requires an explicit
`?test=1` and latches to localStorage. Public players cannot reach it, and Challenge Mode
takes the primary CTA when it is hidden.

🔒 **The release sequence.** `private` and `review` are creator-writable; **`public` is
written by RUN** on approving a review tag, so the public tag cannot be set directly.

✅ **SHIPPED Sep 13 2026.** `update-tag review --version 1.67.0` at **16:44:21 IST**; RUN
moved Public to 1.67.0 by **16:56:09 IST** — **11 m 48 s**. ➕ That is the second measurement
of RUN's approval latency (the first was only "under an hour"), and it is the number to plan
with until a third contradicts it.

### 🔴 CORRECTION — what `rundot game set-public` actually is

⚠️ **An earlier version of this section described `set-public` as a separate "Explore-page
visibility" toggle to run AFTER RUN moves the public tag. That was wrong, and following it
produced a guaranteed failure.** The real behaviour, from the command itself:

- it accepts **`--version <version>`**, defaulting to `latest`;
- its own output line is **"Submitting game for review..."**;
- run with Public already at 1.67.0 it returns **400**:
  `"Version 1.67.0 is not newer than the public version 1.67.0. Bump the version, deploy it,
  and submit that one for review."`

🔥 So it is a **version-submission** command requiring a version **strictly newer than the
current public version** — not a visibility switch. Running it after the public tag has
already moved is precisely the state in which it cannot succeed. The most parsimonious
reading of that error is that `set-public` and the `update-tag review` → RUN → public route
are **two paths to the same destination**, and taking one closes the other.

⚠️ **Unverified, deliberately:** whether the game is Explore-listed could not be confirmed
from the CLI — `rundot game info` exposes no visibility field. The authoritative surface is
RUN's own web UI / Explore page. 🔴 **Do not bump-and-deploy to satisfy `set-public`
speculatively**: the public tag is currently correct, that is the valuable state, and a
speculative bump risks it to buy something that may already be true.

➕ The root mistake was asserting a command's semantics from its **help text** (*"Sets your
game visible in the `explore` page"*) rather than from its behaviour. The help text is not
wrong about the destination; it says nothing about the precondition, and the precondition is
what mattered.
---

### 2026-09-12 — v1.68.0: the boot race behind the mobile black screen

**Status:** ✅ **RETURNED, VERIFIED** — commit `63eda16`, private **v1.68.0**. Two files.

🔥 **Found in RUN's own error telemetry, which nobody had checked.**
`rundot analytics export error_breakdown_7d` was carrying the answer the whole time:

```
RUNTIME_ERROR - handleError - non-fatal
"Cannot access 'WebGLRenderer' before initialization."
1.65.0 - ios - 3 occurrences / 3 sessions / 1 player
```

`crash_sessions_7d` was empty — caught, never fatal.

#### The mechanism

Pixi 8 code-splits the renderer into its own lazily-imported chunk
(`dist/assets/WebGLRenderer-*.js`, 68 KB). **Two independent consumers first-touched that
chunk concurrently at boot:**

1. `main.tsx` step 6 patches `phase: 'playing'`, mounting `GameCanvas`, whose effect calls
   `createPixiApp()` → `app.init()`.
2. `main.tsx` step 8 fires `generateTowerIcons()` → `autoDetectRenderer()`, fire-and-forget,
   microseconds later.

Concurrent first-touch of a chunk with an internal cycle yields that TDZ error. ✅ It
explains everything the earlier diagnosis did not: the intermittency, the iOS skew (slower
parse widens the window), UI and music loading while the canvas stayed black, and why a
retry clears it.

🔴 **A correction to the v1.66.0 entry.** That round's two named root causes — the
unhandled `app.init()` rejection and the `scale 0` commit — were **not what threw**.
v1.66.0's `.catch()` + retry is genuinely the right shape of fix for a race, which is why
the symptom cleared on device, but it was reached without identifying the mechanism, and it
left the trigger in place.

#### The fix

`generateTowerIconsWhenSafe()` gates the icon renderer on `store.engineReady` — set only by
`registerEngine()`, which runs after `createTowerScene()`, by which point the chunk is fully
evaluated and a second `autoDetectRenderer()` is a cache hit. **8 s fallback** so a broken
canvas never leaves the UI permanently icon-less; GameCanvas's own retries fire at
0/+300/+900/+2100 ms, so the fallback sits clear of the whole window. Both previously silent
catch sites now `console.warn` + `track('error_occurred')`.

✅ **Acceptance was structural, by instruction.** This defect cannot be reproduced in
`vite dev`, and the round was explicitly forbidden from closing on "could not reproduce" —
the failure mode that cost v1.60 and v1.61. The agent argued the ordering guarantee from the
code and exercised both exit paths.

---

### 2026-09-12 — v1.69.0: block-1 onboarding, the FTUE's opening pad, and an unloseable tutorial

**Status:** ✅ **RETURNED, VERIFIED** — commit `6d39595`, private **v1.69.0**. Seven files.

**Field report:** three props placed, `CASH 30`, wave 4, still losing. *"FTUE should be so
that losing is impossible."*

#### 🔴 The simulator had been reporting this since before launch

The per-level rows said it plainly; only the summary line was ever read.

| Profile | L4 | L5 | Died |
|---|---|---|---|
| fox-spam (4 props) | held, 81% depth, 36 s | — | 35 |
| balanced (3) | **leaked 2** | **leaked 2** | 34 |
| miser (2) | **leaked 4** | **leaked 4** | **6** |
| pad0-rush (1) | **dead** | — | **4** |

🔥 **And the FTUE *was* `pad0-rush`.** The tutorial hardcoded **pad 0**, which is A-row
and carries **`bonus: null`** — the single worst opening on the board. The profile modelling
what the tutorial teaches had been reporting death at level 4 for rounds, logged as a
"floor case carried for continuity".

#### The cause

`data/waves.ts`'s `composeLevel`, block-1 final `else` (levels 4–10):
`spacingMult = 0.15` with `hpBoost = 2.1` — five tanky units inside one second, 36–47 s to
clear, immediately after level 3's 17 chaff. Its own comment records that it was tuned to
make onboarding "a real test" — validated against `maxed-meta`, the declared primary case,
where it is invisible.

✅ **Ruled out, not assumed:** `lateEconomy.bountyMult: 0.55` starts at level 11
(`fromLevel`), so the early economy was never implicated.

#### The four changes

| | Change | File |
|---|---|---|
| **C** | `spacingMult 0.15→0.45`, `hpBoost 2.1→1.35` | `data/waves.ts` 🔓 unsealed for this round only |
| **D** | `startCoins 140→200`, `waveBonus 15→25` | `config.ts` |
| **E** | FTUE opens on `FTUE_FIRST_PAD = 4` (B3, damage ×1.5); beats `placeFirst → upgrade0 → place2 → place3` fill B3/B2/B1 | `actions.ts` |
| **F** | While `ftueActive`, restore lives to `startLives` at each build phase | `towerScene.ts` |

**140 coins bought exactly two props** — the third was bounty-funded and a fourth was never
affordable, which is what the screenshot showed. 200 makes three the intended opening.

#### New baseline: **35 / 36 / 11 / 4 / 90**

✅ `balanced` now shows `lives 10 (leaked 0)` on **every level 1–12**. ✅ `maxed-meta`
unchanged at **90**, inside its 85–110 criterion. ✅ `miser` still loses, as its contract
requires. The endgame tuning was not disturbed.

#### ⚠️ What F is, and is not

F restores on wave **clear**, so it cannot catch a single wave that drains all ten lives at
once — level 3 is 17 units at 1 `livesCost`, and `stag` costs 3. A true floor belongs at the
decrement site in `sim/engine.ts` (`state.lives -= e.def.livesCost`), still sealed. 🔴 **F
is also invisible to `npm run balance`** — the simulator drives the engine directly and has
no FTUE. C and D are data and stay modelled; F is not, and must never become load-bearing
for the acceptance numbers. If it ever fires *visibly*, that is a signal C/D need retuning,
not that F needs widening.

➕ **Beyond spec, and right:** `grantFtueShortfall()` tops up coins so the forced upgrade
beat can never be unaffordable — closing a dead-end the old code documented but never fixed.

✅ **The agent self-caught a bug its own edit introduced:** `towerScene.ts`'s scene-mount
reset still hardcoded pad 0, clobbering the pad-4 selection at boot. It did not match the
search pattern this handover named — see Retro 105.
---

## 2026-09-12 — What RUN's marketing system actually costs, and why `run` never flew

🛑 **No campaign was ever submitted. Nothing was spent on ads.** This section exists
because three rounds of attempts established facts about the platform that are expensive to
re-learn, and none of them are in the public docs. ⚠️ Marketing *strategy* belongs to the
marketing agent's own two documents — this is the platform mechanics only.

### 🔴 The `run` network is wired but not live — for anyone

The original campaign was designed around **`--network run`**: RUN's own in-house
cross-promotion, a native *sponsored* unit inside the RUN app's discovery drawer. No
external ad platform, no third-party attribution. When live it is **web-only**,
**traffic-install only**, **square creatives only**, passive slot only.

It is **deliberately not enabled in production for any account.** This is not a tier gate, an
opt-in, or a config gap on this account — there is nothing to request. 🔥 **This killed the
campaign's entire thesis**, which was that in-app traffic puts a player one tap from a play;
every remaining network is external traffic through a multi-step deeplink funnel.

### 🔴 `prepare` validates locally; `submit` validates server-side

`rundot marketing prepare` checks the network name against a **hardcoded allowlist compiled
into the CLI binary** and never contacts the server. `run` is on that list. So `prepare`
accepted the campaign, wrote `campaign.json`, and gave no warning — and **843 credits of
creatives were generated against a network that could never fly.** `submit` uploaded all
four assets and only then returned:

```
network "run" is not available (enabled: meta, google, reddit, unity)
```

✅ **The failure was clean** — no server-side campaign, no reservation, balance unchanged.
That is worth knowing: **an attempted submit is a safe probe.** See [Retro 106].

### Two independent gates, neither visible from the client

1. **Per-environment network enablement.** Production has meta, google, reddit, unity.
   Reddit is production-only *by design* — excluded from staging because its minimum spend
   floor would make smoke tests costly.
2. **A global `flights` kill switch**, fail-closed, set in RUN's own deploy configuration.
   If absent, **every** submission is blocked regardless of network. A creator cannot inspect
   it.

### 🔥 The real cost model — the part that changed the decision

| Mechanic | Value |
|---|---|
| Charged at `submit` | **nothing** — a human on the RUN team approves and *flights* it first |
| Charged at flighting | the **entire budget, up front** — not paced daily |
| Flight fee | flat **5,000 credits, non-refundable** |
| Ad-spend conversion | **1,000 credits per $1 USD × 1.05 markup**, markup applied to the USD first |
| Top-up rate | **$1 = 500 credits** — a *different* rate; never use it to estimate a debit |
| Refunds | only a **terminal stop** (cancel, or completion) refunds the remainder. **Pause refunds nothing** |
| Pacing warning | `prepare` warns when budget ÷ days ÷ legs is at or below **~$50/day** |

⚠️ **Funding is from creator credits**, confirmed — so an expiring credit lot is a real
budget, but only if the campaign is *flighted* before it expires. Since the charge lands at
flighting and flighting is a human step of unknown latency, **an expiring lot cannot be
relied on**.

### The arithmetic, worked — and the formula to reuse

The $70–90 budget was sized against the BACK-TO-WORK lot (**92,047 credits**) before anyone
had read the billing model. With the markup and the fee:

```
$90 x 1.05 x 1,000 = 94,500  +  5,000 fee  =  99,500 credits
                                  BACK-TO-WORK =  92,047 credits
                                  overshoot    =  ~7,450  -> hits the ringfenced durable pool
```

🔴 **A sizing that looked comfortable was 8% over**, and the overshoot landed on exactly
the pool the brief had protected. ✅ **Size from credits backward, never from dollars
forward:**

```
max_usd = (lot_credits - 5000) / 1050
```

For BACK-TO-WORK: `(92,047 - 5,000) / 1050` = **$82.90** → **$82 fits** (91,100 credits,
947 spare); **$83 does not** (92,150, over by 103).

### Creative requirements, measured

- **Reddit** creates **one ad per square image**; `square` defaults to **4** on non-Meta/Google
  networks — so four squares is exactly right and needs no rework.
- **Meta/Google** use creative *families*, sized `clamp(floor(budget / legs / days / 15), 1, 10)`,
  and `generate` warns below three. At $90 over 3 days that solves to **2** — under-funded by
  the tool's own heuristic.
- **Unity** needs a mobile platform, a 15-second portrait MP4 and a target CPI. Wrong shape
  for a web entry.
- **`--kind vertical` is rejected outright by the `run` network** (allowed: square, logo).
  The multi-network creative guide in `prepare --help` describes **Meta and Google** slots and
  must not be generalised to other networks.
- **No audience targeting is exposed** — no subreddit, geo or interest flags. Targeting lives
  inside each provider adapter.

⚠️ **`prepare --help` is out of date**: it names Meta and Google as live and Reddit as
*"flight-gated"*, omits Unity entirely, and does not list `run` as a network even though
`prepare` accepts it. Reported upstream.
---

### 2026-09-12 — v1.69.0 promoted to `review` → `public`

Route used: **`rundot game update-tag review --version 1.69.0`**. `set-public` was **not**
run — it is a version-submission, not a visibility toggle, and the two paths appear to reach
the same destination, so taking one closes the other.

**📊 Approval latency — third sample, and an outlier.** Submitted 19:44:48 IST; a 60-second
poll caught Review reading `1.69.0 (Approved)` at **19:45:40 IST — under a minute**, against
**11m 48s** and **~12m** for the two prior samples.

⚠️ **Recorded honestly rather than flatly: treat this as "landed in under a minute", not as
a measurement.** The submit timestamp was captured *before* the call ran and the poller had
its own startup lag, so both ends carry slop. Two clustered samples and one outlier is not a
trend. ✅ **The working estimate stays ~11–12 minutes**; the most plausible reading is an
empty review queue, which is a property of *when* you submitted, not of the service.
✅ The ~20-minute escalation threshold held — it resolved unaided.

RUN wrote the `public` tag automatically on approval. Final state, reconfirmed at 19:46:08
IST and verified independently: **Private · Review · Public all 1.69.0**.
---

### 2026-09-13 — Marketing proposal verified; paid approved; execution dispatched

**Status:** ✅ **APPROVED BY USER** (*"Go ahead with the marketing"*) — the second approval on
funding. Paid leg handed to the implementation agent; organic calendar approved to the
marketing agent as written. ⚠️ Nothing had flighted at the time of writing.

#### The proposal (verbatim in the marketing agent's own record)

Reddit or nothing · **$82** · one `--platforms web` leg · **2 days** · submit before RUN answers
the ticket · cancel staffed at **23:00 IST Sep 14** if not flighted. Organic: one fresh
audience per day Sep 13–18, vertical video shot Sep 14, RUN Discord only with news. Judge
paid by **≥ 55 attributed session starts**; organic by **≥ 30 uniques/day on 3 of 5 days**.
Position: 3rd place is defendable at organic pace; paid is credit salvage, not a rank play.

#### ✅ Verified independently

D1 retention **1.4%** mobile-web (exact) · loaded→menu **619→487** (arithmetic exact) · DUP
**487** to its 489 · Reddit floor **$65/leg** (verbatim in help) · budget range **$50–$25,000**
· names single-use after cancel (verbatim). **Board standings are the agent's claim** — the
jam page is not reachable from the CLI.

#### 🔴 Three corrections — none changed the decision

1. **"24% never reach the menu" names the wrong mechanism for the current build.**
   `menu_shown` fires only on `MainMenu.tsx` mount, and since **v1.60.0 the game boots
   straight into Challenge Mode** — a 1.69.0 player can finish a run without triggering it.
   The 30-day window is dominated by pre-1.60 versions where the menu *was* first, so the
   number is historically real; the current proxy is loaded→`run_start` = **619→466 = 75%**,
   the same loss by a different route. Price ~25% in; do not call it "menu loss". See
   [Retro 108].
2. **"Cancel costs nothing pre-flight — confirmed in help text"** is an inference. The help
   describes cancel on *running* campaigns; the pre-flight case rests on RUN's own
   *"nothing is charged at submit"*, which is the stronger source anyway.
3. **Two execution details the proposal skipped:** a Reddit campaign needs a **fresh
   `prepare --network reddit`** under a **new name** (the old folder is `network: run`; one
   campaign is one network; names are single-use). Creatives copy over — the 3 kept squares
   and 3 logos, `square/2.png` stays dropped.

#### 🔥 The billing finding that de-risked "submit before RUN answers"

The rule is *"if your balance can't cover the budget plus the fee, flighting is blocked."*
If RUN flights **after** BACK-TO-WORK expires, the balance (52,300) cannot cover 91,100 and
**flighting is refused.** A late flight cannot drain the durable pool because it cannot
afford itself. The 23:00 cancel is therefore **hygiene** (no dangling submission), not money
protection. ⚠️ One assumption underneath: ad spend uses the same soonest-expiring-first
ledger as generation. One data point supports it (FEEDBACK05 absorbed the 843 creative
credits to the exact credit); nothing contradicts it.

#### Credits, from the studio page (Sep 13)

- **`rundot socials` is not advertising and spends no credits** — launch packet, composer
  links, checklist. Only `socials promo` (an image) meters. **There is exactly one way to
  turn credits into players: a paid campaign.** Everything else turns credits into assets.
- **"Durable 52,200" was two things:** 27,200 expiring December, plus **25,000 starter credits
  labelled "Expires Aug 29"** — a past date, still counted. Treat **27,200** as the truly
  durable figure.
- **Runtime AI usage: 9,889 credits / 85 calls attributed to the game.** ✅ The game code
  calls **no** AI surface (verified: `popups`, `analytics`, `leaderboard`, `iap`, `cdn`,
  `appStorage`, `ads`, `system`, timing, lifecycle — nothing generative). Most likely our own
  `--game-id` generations categorised under the game. Every listed lot is intact at full
  value, so all usage came out of the expired FEEDBACK05. ⚠️ **Watch item:** if this line
  grows next month with no generations from us, raise a ticket.
- Image generation is **120 credits, exact** (`generate estimate image`).

#### Pending at compaction

The implementation agent's return (campaign ID, post-submit balance, `status`), then the
**23:00 IST Sep 14** cancel-or-debit report. The marketing agent's organic calendar is
running. The RUN ticket on flighting turnaround is still unanswered. ➡️ Resolved in the next entry.
---

### 2026-09-13 — `kitchen-rush-reddit` submitted; not flighted; cancel check moved to Sep 16

**Status:** 📤 **SUBMITTED, PENDING** — by the implementation agent at **21:10 IST Sep 13**
(`2026-09-13T15:40:22Z`). Verified from RUN directly, not from the return.

| | |
|---|---|
| Campaign | `kitchen-rush-reddit` · submission `1a2453fe-556f-4d67-919b-8a88d27cfe70` |
| Provider leg | `reddit/web` `2590245924283741321` |
| Definition | `network: reddit` · `lifetimeBudgetCents: 8200` · `flightDays: 2` · `platforms: [web]` — matches the approval exactly |
| `status` | **`pending-review`** · `spent $0.00` · leg **`pending-network-approval (blocked)`** |
| Balance | **143,984** — today's spend 363 = 3 squares (360) + one 3-credit LLM call; 144,347 − 363 exact |
| Creatives | **3 regenerated squares** + 3 existing logos. Viewed: same cook in all three, text-free, no creatures, readable at thumbnail. Folder gitignored |

#### 🔴 Two corrections to the implementation agent's return

1. **"Live and flighting"** — it is not. Flighting charges the full 91,100 up front; the
   balance is unchanged and `status` says `pending-review`. Nothing has been charged.
2. **"Leg reddit/web approved (ready)"** — RUN reports `pending-network-approval (blocked)`.

So there are **two gates still ahead, not one**: RUN's human flighting *and* Reddit's own
network approval. Neither has cleared. ⚠️ The agent also regenerated the squares (360
credits) rather than copying the kept ones as the proposal specified — a small, sensible
deviation (the old set was prompted for `run`'s slot), but it was not called out.

#### ✅ Decision: cancel check moved to **Sep 16 morning**, timer dropped

The agent's 23:00 IST Sep 14 check was a session-local cron — it fires only if that
terminal is still open. Rather than replace the timer, the user moved the check past the
lot's expiry. Reasoning: a flight **before** BACK-TO-WORK expires on Sep 15 debits the
expiring lot and finishes before judging — the outcome we want. A flight **after** expiry is
refused by RUN's billing rule (52,300 < 91,100). A Sep 14 cancel therefore forecloses a day
of upside and protects nothing; on Sep 16 it is pure hygiene, run by whoever opens the
next session, with no timer to miss. **Owner: the implementation agent** (cancel is a
`marketing` command; the central agent runs only `status` and `credits`).

➕ Read-only `rundot marketing status` and `rundot credits` are now established as the
central agent's verification surface for campaign returns — they round-trip to the server
(Retro 106) and cost nothing.
---

### 2026-09-14 — Reddit rejected; RUN refunds 50,000; two new legs; Meta/Android pending

**Status:** ❌ Reddit closed · ✅ credits verified · ⏳ Meta/Android awaiting the user's second
funding approval · 🎬🎨 video and art legs dispatched.

#### Reddit, verified live

```
Status           rejected
Rejected reason  reddit not yet working
Budget           $82.00 total · spent $0.00
reddit/web leg   pending-network-approval (blocked)   ← never advanced
```

RUN support's ticket reply (via the marketing agent, verbatim): *"the RUN network ads are not
yet available… ad budget does use credits! reddit ads are not currently working. there is
currently not audience targeting other than geo… im going to send you some credits for what
you might have lost trying to prepare creatives for networks that dont yet work. if you are
trying to get a campaign up today i recommend doing meta / android."*

🔴 **Enabled ≠ working.** The marketing agent read this as "the `enabled: meta, google,
reddit, unity` table was wrong". It wasn't: `submit` was accepted server-side and a Reddit
provider leg was created, which a disabled network cannot do. There are **three gates**, not
two — the CLI allowlist (Retro 106), server-side enablement, and **provider reality** — and
only a flight proves the third. See [Retro 109].

#### Credits

`rundot credits`: **193,756**, up from 143,984. Today's spend 328 (12 LLM calls — the video
agent's Studio chat). So the refund is **50,000 + 100 daily**, to the credit. ⚠️ Its expiry
is not visible from the CLI; the studio page must be read before relying on it.

This dissolves yesterday's collision: video (≤ 25k) + art (≤ 10k) + a Meta flight (91,100)
≈ 126k against 193k, durable pool untouched. ⚠️ It also **reverses the cancel logic**: a
late flight is no longer refused by the billing rule, so a cutoff is money protection again.

#### Meta/Android — recommendation made, decision pending

The marketing agent recommended a conditional go on RUN's suggested path. Central concurs:
**go, same terms** (`meta` / `android` / $82 / 2 days), because RUN named the path and said
"today", and credits are no longer binding. Weighed against it, honestly: an app-install
funnel for a 73%-mobile-web audience; Meta's own creative heuristic wants ≥ 3 families and
$82 / 2 days yields 2; Reddit's "approved" sat 18 hours before rejection. Hence the **hard
cutoff — cancel if not flighted by 23:00 IST Sep 15.** Handover to the implementation agent
is written and waits on the user's word; nothing has been prepared or submitted.

#### Two legs opened today

- **Video** (`VideoGen Leg\`, video agent, folder-only access): the jam's Story & Video track
  is a separate, judged award ($300/$100/$100, RUN team picks). Submissions close **Sep 14
  12:00 PT = 00:30 IST Sep 15**; the handover targets publish by 22:30 IST. Video Studio is
  series → chapters built through a chat; cost, length and publish mechanics are the agent's
  Phase 1 to establish from the user's screenshots — the Studio is an app shell and the
  docs do not cover it.
- **Art** (`Art\`, art agent): Chef Ramu sprite set (Ideas.md §6b) + wave-intro scroll
  (§7). Route is `rundot generate image --reference-image` against the RUN-generated ad
  creatives, copied to `Art\_gen\ref\ramu-ads\` for the agent's reach. Layered (13) vs flat
  (12) is decided by a two-image probe, not assumed. Cap 10,000. Nothing ships before judging.
---

### 2026-09-14 — `kitchen-rush-meta` submitted; the creative estimate was wrong by 4×

**Status:** 📤 **SUBMITTED, PENDING** — user gave the second funding approval; implementation
agent ran `prepare → generate → submit` on RUN support's recommended path.

| | |
|---|---|
| Campaign | `kitchen-rush-meta` · submission `b0d2615e-4a2d-45af-8f6e-5835fd5b3fe8` · Meta campaign `120254295998880523` · leg `meta/android` |
| Definition | `network: meta` · `platforms: [android]` · `lifetimeBudgetCents: 8200` · `flightDays: 2` — verified on disk |
| `status` | **`pending-review`** · `spent $0.00` · submitted `2026-09-14T15:58:12Z` — verified live |
| Creatives | 3 squares + 3 logos **reused free** via `--reuse-from kitchen-rush-reddit`; **2 vertical (1242×2208) + 2 landscape (1200×628) generated for 1,962 credits.** All four viewed: same Ramu, title text only, bottom quarter of verticals clear, landscapes off-centre for square re-crop |
| Balance | agent-reported 190,802 (192,911 → 190,949 generation → 190,802). The "unexplained −147" is one art-agent generation landing between reads — both agents draw from one balance. ⚠️ Not yet verified: `rundot credits` was returning **502** at the time |
| Submit warning | reused squares lack `creativeFamilies` metadata; server fell back to legacy family IDs. Non-fatal |

#### 🔴 Two errors in Central's brief, both the same class

1. **`rundot marketing generate estimate` does not exist.** The brief named it as the
   pre-spend gate. `estimate` is a subcommand of the generic `rundot generate`, not of
   `marketing generate` — the agent checked both `--help` outputs and **stopped rather than
   guess**, which was exactly right.
2. **"120 credits/image, fixed" was true of the generic generator at default size and false
   of Meta creatives.** 4 images cost **1,962 ≈ 490 each**. The 2,000-credit cap held by 38
   credits — luck, not design. The replacement gate ("stop if more than 12 images") was
   sized from the wrong unit price and would have allowed ~5,900.

Both are [Retro 106] again: a fact read off one surface (`rundot generate`) applied to a
neighbouring one (`rundot marketing generate`) without checking it transfers. ✅ The rule
that would have worked: **when no estimate exists, generate the smallest unit first, read
the actual debit, then size the batch.**

#### The cutoff is now money protection

Balance covers 91,100 well past BACK-TO-WORK's expiry, so a late flight **would** debit
durable credits. **Cancel if not flighted by 23:00 IST Sep 15.** The implementation agent's
cron is session-local; the user triggers the check.
---

### 2026-09-14 — Art leg returned: Chef Ramu layered set + scroll, 7,003 credits

**Status:** ✅ **RETURNED, VERIFIED** — `Art/_gen/chef-final/`, 14 files. Nothing in
`jam-entry/`; nothing ships before judging. Spec home: [Ideas.md](Ideas.md) §6b/§7.

| | |
|---|---|
| Delivered | `body-{cafe, north-indian, south-indian, italian, north-east, ne-fusion, italian-fusion, desi-fusion, overtime}.png` · `face-{warm, wry, moved, worried}.png` · `scroll.png` (1584×672) |
| Measured | all 1024² RGBA, corners alpha 0; face bands identical at (329, 296)–(750, 585); body bboxes identical where headwear allows |
| Cost | **7,003** (23 generate calls at 147; 2 rate-limit hits free; 1 probe reused). Under the 8,000 report line |
| Stops honoured | canonical pick (take 3) → probe (head Δ 0 px; layered chosen) → batch. Three stops, three waits |

#### What the agent got right that the brief didn't ask for

- **Rejected full-bust faces on evidence** — overlay-tested on the Overtime body, saw the
  bandana-over-turban hybrid, re-cropped all four to a bare eyebrow-to-jaw band, re-tested on
  three bodies. That crop is now the spec.
- **Rejected B-wry take 1 at 96 px** ("still smiling") and retook with explicit asymmetry.
- Found that naive head-position checks (topmost opaque pixel, skin-tone mask) **false-positive
  on toques, turbans and gold trim**; verified those three by fixed-crop overlay instead.
- Excluded the four `crosspromo-square-*.png` references before generating — they depict the
  `run`-network fox, not Ramu. Central copied them in without looking.

#### 🔴 Facts Central's brief got wrong

1. `Art/_gen/final/` named as the in-game style reference is **empty**; the real references
   are `Art/_gen/dishes-final/` and `Art/_gen/ui-final/chef-hat.png`.
2. No `--reference-strength` flag exists; the "lower it for faces" instruction was unusable.
3. Four of seven reference images weren't Ramu (above).

#### ⚠️ The finding that changes the spec

Central composited each face on the cafe body at 96 and 160 px. **At 96 px only
W-worried is distinguishable from A-warm**; at 160 px all four read. Not an art defect —
the band is 27 px tall at that scale. Ideas.md §6b now says: idle sprite at ~96–120 px is
fine (it only switches warm ↔ worried); the **dialogue portrait must be ≥ 160 px or a
head-only crop.**
---

### 2026-09-15 — Video leg returned: *Twelve Glasses* published 20 minutes before the close

**Status:** ✅ **PUBLISHED** (video agent, `VideoGen Leg/06 Return Handover.md`). Verified by
Central: return handover complete; docs secret-scanned clean; `kitchen-rush-meta` unaffected.
🔴 **Not verifiable from the CLI:** the jam-page listing and the share link are client-rendered
shells — the user confirms in a browser on Sep 15, Discord before noon PT if missing.

| | |
|---|---|
| Entry | *Twelve Glasses* · Story & Video track · 45 s, 3 clips × 3 sub-shots, Seedance 2.0 Fast · ElevenLabs voice + in-tool score |
| Arc | dawn pour → stall → tandoor → pasta → rain → dawn walk-off → the pass → silent kitchen → twelve glasses + bandana |
| Retakes | shot 3 × 2, both for real defects (floating glass; a stray spoken "hello") |
| Rights | Pixabay sitar track **rejected** — not original, not made during the jam. Correct |
| Spend | agent-reported ≈ 43k against the user's 45k cap: 5 renders × 6,827 + ≈ 8.5k images/drafting |

#### ⚠️ The ledger discrepancy

`rundot credits` on Sep 15 morning: **184,274**, which reconciles to Sep 14's 193,756 minus
Meta creatives (1,962), art (7,003) and LLM calls — with **no video line and no 34k missing**.
So Video Studio's renders either bill a **separate pool** or post late. The agent read
"184.8k" off the Studio's own banner at Episode Ready, which matches the CLI figure — so
the Studio was showing the same balance *after* the renders. Most likely reading: **the
video did not draw from the creator-credit balance at all.** Unresolved; the studio page
decides. No decision depends on it — Meta's 91,100 is covered either way.

#### Tool facts worth keeping (full detail in `VideoGen Leg/01 Tool Notes.md`)

Video Studio and Story Studio are different tools, both accepted by the track · orientation
locks at project creation · **6,827 credits per 15-s shot**, ~6–7 min each, sequential, each
shot seeded from the previous last frame · every image is a locked reference, a name in a
prompt is not · auto-drafted motion prompts use only panels 1–3 of a six-panel sheet and
default to a teal grade — always rewrite.

Sync: seven `.md` files tracked; `References and Logs/` (73 MB of MP4/PNG) gitignored.

✅ **Closed Sep 15 morning.** Search on run.world shows *Ramu: Twelve Glasses* as a public Show
next to the game; the Event podium lists games only. RUN support, verbatim: *"a qualifying entry
is any original Story Studio or Video Studio piece made during the jam and published to RUN
before submissions close — that's it. No submission form, no extra steps. Since Twelve Glasses
is a Video Studio entry published before the deadline, it's automatically in consideration."*
RUN also suggested posting the share link widely before Sep 18 — that is the marketing
agent's remit and has been passed to it. The studio balance (184,274) matches the CLI, so the
video's renders did not draw from creator credits.
---

### 2026-09-15 — Rounds 0+1: chef assets + dialogue system → Private v1.70.0

**Status:** ✅ **RETURNED, VERIFIED, COMMITTED** — Private **1.70.0**; Review and Public
**1.69.0**, untouched (verified via `list-tags`). Nine files changed, three new, 243 insertions.
Spec: [Ideas.md](Ideas.md) §1 / §6b / §6d.

| Checked by Central | Result |
|---|---|
| Sealed files | `git diff` on `engine.ts`, `enemies.ts`, `towers.ts`, `waves.ts` — empty |
| `npm run balance` | **35 / 36 / 11 / 4 / 90** — the agent reports byte-identical output |
| `tsc --noEmit` | clean |
| Assets | `public/images/chef/` = **821,257 bytes** (critical 142,426: `body-cafe` + `face-a`; deferred 678,831). Four bodies quantised. **No `.png.json` under `public/`** |
| Hooks | opening armed in the `scriptedRunStart()` patch · `e.cleared === 1` · `upgrade0` resolution · block-boundary branch inside the `backdropTransitioning` lock · Ready hidden on `dialogue === null` · `dialogueSeen` persisted in `save.ts` · `CONFIG.narrative.enabled` |
| Lines | 12, verbatim against §1 on three spot-checks |

#### Acceptance, as the agent evidenced it
All eleven `dialogue_shown` ids in order in one run (district beats driven by `waveIndex`
jumps — legitimate, the trigger reads live state each tick) · Retry: opening did not re-fire,
district-2 did · pad-4 cue withheld until the opening closed, `placeFirst` still resolved on
pad 4 · block lock measured **2,492 ms** with a box open — dialogue neither extends nor
shortens `BACKDROP_LOCK_S` · flag off = today's behaviour · 403×874 screenshots of opening
and district beats.

#### 🔴 What the handover got wrong
1. **"FTUE pad-4 pulse (`pulsePads`)"** — `placeFirst`'s cue was never `pulsePads` (that is
   `place2`/`place3`); it is `selectedPad` auto-opening the rail's picker. Intent implemented;
   terminology wrong.
2. **"1.70.0-private.1"** — no such scheme exists; `rundot deploy` auto-bumps clean semver
   to Private. Deployed as plain 1.70.0.
3. **Unlisted hook:** `towerScene.ts`'s scene-mount reset (`selectedPad: ftueActive ?
   FTUE_FIRST_PAD : null` — the same line Retro 105 is about) needed `&& !dialogue`, or the
   mount would clobber the opening's picker suppression. The agent found it; the handover
   should have named it, given Retro 105.

**Left for Round 2:** `ChefPortrait.tsx` into the reserved 160×160 slot; the 160/100 px
sizing split; body/face crossfade inside `BACKDROP_FADE_S`; the left-gutter measurement first.
---

### 2026-09-15 — Round 2 handed over: Chef Ramu portrait

**Status:** 📤 **ISSUED** (user dispatched Sep 15). 🔒 **Private only** — restated by the
user at dispatch; nothing reaches Review or Public until Round 4 succeeds and a human decides.

**Scope:** `ChefPortrait.tsx` — two stacked `<img>` (body + face, same 320² canvas, `inset-0`)
in two mounts: **160 px** inside the slot `DialogueBox.tsx` reserved, and **~100 px idle**
bottom-left showing only warm/worried. Costume = `blockForLevel`, via the existing
`chefBodyAliasForBlock()` (no second copy). Face = open line's voice → else worried while
`lives < startLives × 0.3` (store read, not `actions.ts`'s latch) → else warm. Face fade
400 ms; body fade 2.5 s when `backdropTransitioning`, else 400 ms; reduced-motion 0 ms; never
render an uncached body.

🔴 **Task 1 is a measurement:** the left gutter at 403×874 and 375×667, against pad D1 at
design (225, 1090). Idle portrait ships at ~100 px if it fits, down to 72 px, else hidden on
that device. Overlap is not an outcome (Retro 99).

**Acceptance (8):** gutter numbers · costume change at every boundary with no wrong-face
frame · 2.5 s vs 400 ms fades measured · worried below 3 lives and back · voice faces on
beats 4/7/12 · in-game contact sheet of all 9 costumes at 160 px · no D1 overlap, taps pass
through · balance / tsc / sidecars / Private deploy with `list-tags`.
---

### 2026-09-15 — Round 2 returned: Chef Ramu portrait → Private v1.71.0

**Status:** ✅ **RETURNED, VERIFIED, COMMITTED.** Private **1.71.0**; Review/Public **1.69.0**.
Five files (four modified, `ChefPortrait.tsx` new). Sealed untouched; balance **35 / 36 / 11 /
4 / 90**; `tsc` clean; no sidecars.

#### 🔴 The measurement that changes Rounds 2 and 3

| Device | Left gutter | Idle portrait |
|---|---|---|
| **403×874** (reference) | **39.4 px** | hidden |
| 375×667 | 63.8 px | hidden |
| 480×800 | 91.6 px | 75.6 px |
| 768×1024 | 194.1 px | 100 px |

Central recomputed all four from `stage.ts` (`min(w/720, h/FIT_HEIGHT) × 0.85`) — exact
match. The handover's "≥ ~110 px at 403×874" had the geometry backwards: a tall narrow phone
is *closer* to the board's own aspect and letterboxes *less*. So **on typical phones only the
dialogue portrait ships**; the idle sprite exists for tablets and wide phones. Acceptable by
the handover's own decision tree; overlap was the outcome ruled out, and none occurs.

⚠️ **Consequence for Round 3:** the gauge was specified "behind the idle portrait,
bottom-left". There is no bottom-left on the reference phone. 39 px *is* enough for a slim
vertical bar (~20 px) running the board's height in the letterbox — the gauge survives as a
bar; the "cylinder behind the chef" composition does not. Round 3's handover must start from
that number.

#### Verified
Costume at every boundary 1→2 … 8→9 with the face constant mid-fade · body fade **2,490 ms**
riding `backdropTransitioning`, **~406–432 ms** without · worried below 3 lives, un-latched
back to warm · voice faces on `first-upgrade` (b) and `overtime` (c) · in-game contact sheet
of all nine at 160 px · taps pass through the idle sprite · load-safety hook covers faces
too (b/c/w are deferred, same risk as the bodies — the agent extended it unasked, correctly).

#### A bug the agent found in its own first pass, worth keeping
`DialogueBox.tsx` mounts `ChefPortrait` fresh on every beat, so a component-local "fade from"
ref reset each time and the dialogue portrait **popped instead of fading** — invisible to a
correctness check because the final frame was right. Fixed by tracking "last shown" at module
scope across both mount points, plus a one-render lag between alias resolution and duration.
Same shape as Retro 105: the artefact under test is the running system, over time.
---

### 2026-09-15 — Round 2b issued and returned: the dialogue box is the FTUE's Ready → Private v1.72.0

**Issued** after the user's playtest of 1.71.0 (six annotated screenshots — decisions in
[Ideas.md](Ideas.md) §6d *Amendment*). **Returned the same day; verified; committed.** Private
**1.72.0**, Review/Public **1.69.0**. Seven files. Sealed untouched; balance **35 / 36 / 11 /
4 / 90**; `tsc` clean; no sidecars.

| Beat | Now |
|---|---|
| 1 `opening` | every run at boot (Retry included), Skip visible |
| 2 `stove-lit` | on `placeFirst` resolved; **tap = `startWave()`**; suppressed if 1 was skipped |
| 3 `wave1-cleared` | *"… It's time to upgrade."* Stays open through `upgrade0`; **narrows to `calc(100% − 100px)`, left-anchored, portrait dropped** while the rail is up (88 px floor + 12 gutter at scale 0.450); no-op tap before purchase; tap = wave 2 after |
| 4 `wave4-ready` | wave 4 build after `place3`, toast above it; tap = wave 4; FTUE retires |
| 5–12 | unchanged; Skip + "tap to continue ▸" on every box |

`dialogueSeen` removed (save parse never spread the raw object, so old saves load). Flag off
reproduces 1.69.0's flow exactly — the flag now gates the gate.

#### 🔴 A gap in Central's amendment, found by the agent
"Skip skips beats 1 and 2 together" — but beat 2 fires from `placeTower()`, a different call
site, not from the queue. Queued naively it would replay after a Skip. Fixed with a run-scoped
`openingSkipped` flag in `dialogueController.ts` (module scope, not the store), checked at
the placement site. Verified live. The amendment described the *experience* and left the
*mechanism* to inference across two triggers — the same shape as Retro 105's "written
differently" instance.

✅ Also right, unasked: `RAIL_MIN_PX` exported from `StationRail.tsx` rather than copied, so
the box and the rail can never disagree about the floor.
---

### 2026-09-15 — Round 2c issued: toast → `Lv↑` markers; box text and Skip placement

**Issued** after the user's playtest of 1.72.0 (four screenshots). Decisions in
[Ideas.md](Ideas.md) §6d *Amendment → Round 2c*. 🔒 Private only. Scope: remove the "Tap a
cook to upgrade" toast (Hud + DialogueBox copies); Pixi `Lv↑` pill above each affordable-
upgrade prop, driven by the rail's affordability test, hidden for the selected pad and at max
level; dialogue text vertically centred; Skip inside the box top-right.
---

### 2026-09-15 — Round 2c returned → Private v1.73.0

**Status:** ✅ **RETURNED, VERIFIED, COMMITTED.** Private **1.73.0**; Review/Public **1.69.0**.
Three files. Sealed untouched; balance **35 / 36 / 11 / 4 / 90**; `tsc` clean; no sidecars;
`grep "Tap a cook to upgrade"` → 0.

- **`Lv↑` markers:** `markerLayer` between `world` and `popupLayer`; `syncUpgradeMarkers()`
  after `syncTowers()` each tick, rail's affordability test, allocation only on visibility
  flips. Sequence verified live: cash 10 → none; 55 → fox only; select → hides; deselect →
  back; fox maxed at 500 → gone while owl/bear show.
- **Box:** now a `<div>` wrapping the Continue `<button>` — the agent's first pass nested a
  button in a button (invalid HTML) and it caught its own error. Text centre-Y delta vs
  portrait **0 px**; Skip `absolute top-2 right-2` inside, white/85; skip fires
  `dialogue_skipped`, not the advance path.
- 🔴 **Found live, not in the brief:** `fontSize: 15` rendered at ~7 CSS px at scale 0.45 —
  the ↑ smudged. Fixed at **24** (the coin popup's proven size) and the pill width is
  `max(60 % sprite, measured label)` so it cannot clip. The brief said "~60 % of a tower
  sprite's width" and nothing about type size — a size that was never going to survive the
  reference phone's scale. Legibility at scale is an acceptance item from now on.
---

### 2026-09-15 — Round 3 issued: service gauge + beat-3 wrap + Skip-as-mute

**Issued** with two playtest fixes from 1.73.0 folded in (user: "no need for a small separate
handover"). Spec: [Ideas.md](Ideas.md) §6d *Amendment*. 🔒 Private only. Gauge: horizontal
fill under the top-left chip group, `SAFE = units − (lives − 1)` with lives-weighted units,
amber → green, tick at SAFE, resets per wave. Beat 3 keeps portrait + Skip at reduced width.
Skip mutes all later boxes (persisted); chef tap un-mutes; chef-head HUD button proposed as
the always-present tap target.
---

### 2026-09-15 — Round 3 returned → Private v1.74.0

**Status:** ✅ **RETURNED, VERIFIED, COMMITTED.** Private **1.74.0**; Review/Public **1.69.0**.
Nine files (`ServiceGauge.tsx` new). Sealed untouched; balance **35 / 36 / 11 / 4 / 90**;
`tsc` clean; no sidecars.

| Part | Verified |
|---|---|
| A gauge | `syncGauge()` samples lives-weighted `units` and `SAFE` at the wave-start transition; forecast during build; width live-measured from the ESCAPES+CASH row (0 px delta at 403 and 768). Level 4: `units 5, safe 0` — green from kill 0, matching the simulator's row. Level 10: `units 10` with the stag weighted, `safe 1`, tick at 1/10 |
| B beat 3 | portrait 100 px, text wraps (92 px tall), Skip inside, box 279 px at 403 wide; Upgrade tapped live 1→2 with the box open |
| C mute | `dialogueMuted` persisted; Skip on any box mutes; survives Retry; `#chef-head-button` (44 px, next to the WAVE chip, always present) and the idle portrait un-mute; wry cue rides the existing crossfade |

#### Four judgment calls the agent flagged — Central's rulings
1. **"`calc(100% − 100px)`" kept as the live `useRailClearancePx()` formula, not a literal.**
   ✅ Right — 100 was the value at one scale; a literal would break at 768.
2. **Skip now also on beats 2 and 4** (the Ready-substitutes), reversing Round 2b's "tapping
   *is* the action". Skip there mutes and closes, revealing the plain Ready. ✅ Accepted —
   the user's rule was "Skip works over all the dialogue boxes"; the reveal is coherent.
3. **Un-mute cue uses face B (wry)** at idle size, where §6b says B doesn't read. ✅ Accepted
   as motion feedback, not an expression to parse; 400 ms, transient.
4. **Chef-head crop by eye**, not measured. ✅ Cosmetic; not a tap boundary. Re-measure only
   if Round 4's bubble needs a precise anchor point.

**Left for Round 4:** bubble anchors to `#chef-head-button` on phones where the idle sprite
is hidden, to the idle portrait where it isn't.
---

### 2026-09-15 — Meta flighted on the lot's last day; the board says 4th, 21 behind 3rd

**Verified live 17:45 IST.** `kitchen-rush-meta`: `Status: flighted`, `Flighted by U05RZL2DR2N`,
`spent $25.52`, `ends 2026-09-16`. Day-1 `stats`: **1,466 impressions · 1,121 reach · 49
clicks · 3.34 % CTR · 6 conversions · 7 installs · CPI $2.72 · CPA $4.25.**

#### The reconciliation
| | |
|---|---|
| Balance before | 184,274 (Sep 15 morning) |
| Flight debit | **91,100** = $82 × 1.05 × 1,000 + 5,000 fee — the formula from Retro 107, to the credit |
| Balance after | 93,174 + 100 daily = **93,273** — matches the studio page exactly |
| Lot drawn | BACK-TO-WORK's remaining ~91,000 (soonest-expiring-first, confirmed: the lot no longer appears; every other lot is intact at full value) |

✅ **The expiring lot funded the campaign on the last day it could.** The Sep 13 decision
("submit before RUN answers; a late flight can't drain the durable pool") and the Sep 14
re-sizing both held. The studio page's *"Studio model 86,101 / 5 calls"* and *"5,000 / 2
calls"* are the ad spend and the flight fee under a generic label.

✅ **Watch item closed:** *"Runtime AI usage: Spice Expert: Ramu 106,390 / 132 calls"* is
every credit billed against the game id — campaign, creatives, chef art — not player AI use.
The game calls no AI surface (verified Sep 13). Attribution label; not a leak.

#### The board (jam page, 17:45 IST, **3d 6h 46m** to close)
| # | Entry | Daily uniques | Prize |
|---|---|---|---|
| 1 | Back That Thing Up! | 1,276 | $1,000 |
| 2 | 9 to Thrive | 1,122 | $600 |
| 3 | The Grind | **562** | $300 |
| **4** | **Spice Expert: Ramu** | **541** (793 total plays) | **$200** |
| 5 | GT Rush: Coastal Life | 512 | $100 |
| 6 | The Good Life | 434 | — |

⚠️ **Prizes go five deep**, not three — Central had carried "three" from the prize-pool
line. 3rd is **21 ahead**; 5th is 29 behind. Remaining Meta spend ~$56 ≈ 20 installs at
day-1 CPI; three organic posting days remain. The read is the marketing agent's.
---

### 2026-09-16 — Round 4 issued: centre box, beat 3 → dock, upgrade preview, ring gauge, wave bubble + scroll

**Issued.** Decisions from the 1.74.0 playtest plus the user's picks: **chef HUD option B** (the
service gauge becomes a ring around the 44 px head; bar removed) and **prop-feedback bundle
1 + 2 + 3 + 4 as Round 5**. 🔒 Private only. Round 4 is the last before **human
verification decides public** (Ideas.md §6d rule) — Round 5 is queued behind it as UI polish.
Scope: dialogue box to screen centre, tap-anywhere; beat 3 closes → dock opens on pad 4;
green post-upgrade preview above the selected prop; `ServiceGauge` bar → ring; wave bubble
on the head with dish icons → scroll submenu in the top band (§7 data path; `scroll.png`
prepped at 720 wide).
---

### 2026-09-16 — Round 4 returned → Private v1.75.0 — the plan's last build round

**Status:** ✅ **RETURNED, VERIFIED, COMMITTED.** Private **1.75.0**; Review/Public **1.69.0**.
Twelve files (`ServiceRing.tsx`, `WaveBubble.tsx` new; `ServiceGauge.tsx` deleted;
`public/images/ui/scroll.png` 720×305, 144,106 B). Sealed untouched; balance **35 / 36 / 11 / 4 /
90**; `tsc` and `vite build` clean; no sidecars.

| Part | Verified |
|---|---|
| A centre box | dead-centre at 403 and 768 (rect 160–608 × 420–604 on 768×1024); portrait/text/padding all advance; Skip doesn't |
| B beat 3 → dock | `{null,null,build}` → tap → `{4,'upgrade0',build}` → purchase → `{null,null,build}` → plain Ready → wave 2. `openUpgrade0Beat()` lifted out of `applyFtueWaveEnd` so it runs on the close, not the clear |
| C preview | Stock Pot Lv1: `18 → 25 dmg` / `1.6 → 1.8/s`, equal to the rail's post-purchase display |
| D ring | level 3 `{17, 0, 8}` amber with tick; level 1 `{6, 0, 0}` green, no tick; muted `#6b6b70`. Needed a `store.dialogueMuted` mirror — the controller's flag was invisible to React |
| E bubble + scroll | trigger inline after the ring; submenu at `x 12, y 128, w 379, h 52` under the WAVE row, chip (y 73–101) and speed buttons clear; `Coffee ●●●●● 🪙 5 ×6`; outside-tap close via a non-blocking `pointerdown` listener |

⚠️ **One item not landed live:** a pad tap *through* the open submenu. Verified architecturally
(no backdrop, no `preventDefault`), not by screenshot. **First thing to poke in the human pass.**

#### Three flags for the human verification pass — Central's position
1. **Blocks 6–9 have two dishes per archetype;** each submenu row shows the entry's full count,
   not a split. The spec gave no split rule. Position: show the count **once per archetype row**
   with both icons, rather than twice — a Round 5 nit if the user agrees.
2. **`safe = 0` → green from the start of the wave.** Intended: it means "this wave cannot end
   the run" (Central, Sep 15). Leave.
3. Row 2 has no wrap fallback if a RUSH label runs long. Pre-existing; noted.

✅ The agent followed the handover over two stale lines in Ideas.md (the wave-chip fallback,
the 3 s auto-dismiss) and said so. Both lines are superseded by §6d's amendment.

**Next:** Round 5 (prop bundle 1 + 2 + 3 + 4), then the user plays 1.7x end-to-end and decides
public.
---

### 2026-09-16 — Round 5 issued: prop feedback bundle + four 1.75.0 playtest fixes

**Issued.** 🔒 Private only. Prop bundle **1 + 2 + 3 + 4** (recoil squash, tinted heat flash,
projectile trail, idle bob + steam during waves) from the Sep 16 proposals; plus the 1.75.0
playtest fixes (Ideas.md §6d amendment): bubble icons ≥ 40 px with names, scroll submenu as
a closed-by-default 2-column grid with 3-sliced art, upgrade preview in a translucent bubble,
and the wave-1 top-right overlap. After Round 5 returns: **the user plays end-to-end and
decides public.**
---

### 2026-09-16 — Round 5 returned → Private v1.76.0 — build rounds complete; human verification next

**Status:** ✅ **RETURNED, VERIFIED, COMMITTED.** Private **1.76.0**; Review/Public **1.69.0**.
Five files, +632/−108. Sealed untouched; balance **35 / 36 / 11 / 4 / 90**; `tsc` clean; no
sidecars; no new art.

| Part | Verified |
|---|---|
| Prop bundle | `syncTowerFx()`: recoil (80/60/60 ms, base-anchored), heat flash (pooled additive glow, tinted per archetype, 1-frame under reduced motion), projectile trails (pooled, destroyed in the same alive-set diff as the projectile), wave-only bob + steam. Shot detection by diffing projectile origins against tower launch points — the sealed `shot` event carries no position |
| FPS | frame-count over 5 s, production build, CPU-throttled Chromium: 4× 60.0→60.1 · 12× 58.9→58.6 · 20× 36.0→37 — no regression. ⚠️ **Desktop proxy, not a phone** |
| Bubble | 40 px icons with names; row 2 grows in flow, no speed-row overlap |
| Scroll | closed-by-default across levels 1/6/11/21/51/61 (`strayOpenCount 0`, fixed by a render-time reset); 1 / 2 / 2×3 grids at levels 1 / 51 / 81; **3-slice via CSS `border-image`** on the existing asset; **pad 0 tapped through the open panel and placed a prop** — the item Round 4 verified only architecturally |
| Preview | translucent bubble, white/85 current → green new, legible over dishes |
| Overlap | named: the **coin-shortfall toast** (`grantFtueShortfall`), `absolute top-24` — now flows in the HUD column, 21 px clear of the WAVE chip |

#### For the human verification pass
1. **FPS on a real mid phone** — the one budget item without device evidence.
2. **Recoil squash by eye** — 80–160 ms is too short for a screenshot; indirect proof only.
3. Merged double-dish names ("Idli / Dosa") truncate at `6rem`; not stress-tested across all
   block 6–9 pairings.
4. `safe = 0` → green from the first kill: intended, unchanged.

**The plan's build rounds are complete.** Per Ideas.md §6d: the user plays 1.76.0 end-to-end
and decides whether it goes to Review → Public, as **v1.70.0**'s successor.
---

### 2026-09-16 — Round 6 issued: the recoil scale bug (Type 2) + persistent wave bubble

🔴 **Defect in 1.76.0, found by the user's playtest, missed by Central's verification.** The
recoil tween wrote absolute scale on sprites whose base scale is ~0.06; one shot inflated a
prop to full texture size and "restored" it to scale 1. The agent's evidence for the item
was *"`scaledSprites` climbing during combat"* — **a metric that counted the defect** — and
Central checked the claim against the tree, not the running game. See [Retro 110].

**Issued:** wrapper `Container` per tower, FX tween the wrapper only (user chose Type 2 of
three); bubble icons 56 px, persists through the wave, live per-dish remaining count if the
alive-set diff attributes by archetype. 🔒 Private only.
---

### 2026-09-17 — Round 6 returned → Private v1.77.0; Meta campaign complete

**Round 6 — ✅ RETURNED, VERIFIED, COMMITTED.** Private **1.77.0**; Review/Public **1.69.0**.
Three files. Sealed untouched; balance **35 / 36 / 11 / 4 / 90**; `tsc` clean; no sidecars.
The only `fx.sprite.scale.set` left in `towerScene.ts` is the comment describing the bug.

| | Measured |
|---|---|
| Base sprite scale | **0.678** (Central had estimated ~0.06 — mechanism right, magnitude wrong; the inflation was ~1.5× on the sprite's own scale, larger on screen because the texture is larger than its display box) |
| Resting state | wrapper `(1,1) → (1.067, 0.917) → (1,1)`; sprite `0.67797` constant across 3 s |
| Fired vs never-fired | pixel-identical; both upgrade to `63.73 × 79.32` |
| Anchors mid-squash | `node.y 213.00`, preview `y 125.00` — one value each across 541–962 frames |
| Reduced motion | wrapper deviation from (1,1) over 721 frames: **0** |
| Bubble | 56 px; persists through the wave; `Chai 6 → 5` on the first kill; resets at build; level 81 shows 5 cells / 10 icons / `54/54` |
| Steam puff tween (line ~958) | **correct as written** — `Sprite(tex.steamPuff)` never has width set, base is (1,1) |

**Next:** the user plays 1.77.0 end-to-end and decides Review → Public.

#### Meta campaign, final (verified live Sep 17)
`Status: flighted`, ended 2026-09-16. **$70.05 of $82 spent · 4,228 impressions · 2,833 reach ·
171 clicks · 4.04 % CTR · 10.53 % CVR · 18 installs · CPI $3.66 · CPA $4.38.** Day 1 alone was
7 installs at $2.72; day 2 added 11 at a higher CPI. Against the marketing agent's criterion
(≥ 55 attributed session starts) the paid leg **did not meet its bar**; against the credit
question it did what it was for — the expiring lot became 18 Android installs instead of
nothing. Unspent ~$12 refunds on completion per RUN's billing rule; confirm on the studio
page. Paid is done for this jam.
---

### 2026-09-17 — Round 7 issued: per-dish counts, district headers, dish loop, bottom band + post-boss panel, BGM 50 %

**Issued** from the user's playtest of 1.77.0 (four screenshots + a note). Decisions in
[Ideas.md](Ideas.md) §6d *Amendment → Playtest of 1.77.0*. 🔒 Private only. The bottom-band
change moves the chef to bottom-centre — which retires the left-gutter constraint from Round
2 — with Ready beside him and the kitchen actions below; a post-boss *Congratulations* panel
carries its own READY.
---

### 2026-09-17 — Round 7 re-issued with the end-screen rewrite ("Ramu's debrief")

The earlier Round 7 text is superseded. Added item 6: `EndScreen.tsx` rewritten to the
user's pick (B) — Ramu's outcome line, order-ticket stats with count-up and delta, Retry
primary with a 600 ms input lock, ghost secondaries, the ad offer demoted to an opt-in card
with unchanged economics; two new analytics events (`end_screen_shown`, `end_retry_tapped`).
Decision and analysis in [Ideas.md](Ideas.md) §6d amendment item 6. 🔒 Private only.
---

### 2026-09-17 — Round 7 returned → Private v1.78.0

**Status:** ✅ **RETURNED, VERIFIED, COMMITTED.** Private **1.78.0**; Review/Public **1.69.0**.
Ten files (`PostBossPanel.tsx` new). Sealed untouched; balance **35 / 36 / 11 / 4 / 90**; `tsc`
clean; no sidecars.

| Item | Verified |
|---|---|
| Per-dish counts + pan | independent per-archetype ticking (`{wasp:3, hornet:1, beetle:3}`), reset on wave change; 3-wide window steps through 5 dishes; reduced motion static + `···` |
| District headers | `RUSH: NORTH INDIAN` / `RUSH: OVERTIME`; box 184 → 212 px (+15.2 %); portrait top on the header; beat 1 no header |
| Bottom band | chef 104 px bottom-centre, Ready centred beside, actions below; wave phase keeps the chef only; un-mute via `#chef-portrait-idle`. **First pass clipped the path exit under Ready — fixed by `BOTTOM_BAND` 180 → 340 and portrait 120 → 104**, ~14 px clearance at 403 wide |
| Post-boss panel | after level 10: district beat → *Congratulations! CAFE shift complete. NORTH INDIAN awaits.* + 5 dishes + its own READY (exactly one Ready in the DOM); outside-tap restores inline Ready; after level 9: none. A `BLOCKS[-1]` boot crash at wave 1 in the first draft was caught by the agent's own harness before deploy |
| BGM | fresh 0.5; stored 0.8 stays 0.8 |
| End screen | four outcomes screenshotted with the right face and line; Retry the only filled button; ad card demoted, hidden when `bonus = 0`; lock: 215 ms ignored, 884 ms accepted; count-up resting state equals store values; **gem formula surfaced: `rushes × CONFIG.meta.gemsPerWave (4)`** from `save.ts`'s `recordRunEnd` |

#### ⚠️ Two things the return under-stated
1. **`BOTTOM_BAND` 180 → 340 shrinks the whole board**, not just the bottom row: `FIT_HEIGHT`
   grows, so at 403×874 the board is **324 → 296 px wide (−9 %)**, pads and props with it. The
   honest fix for the clip, but a global size change — **the user judges it on device.**
2. The 3-slice `ui-scroll` parchment fails on a three-row card (`border-image` fill cuts off)
   — the ticket is a solid cream card instead. `WaveBubble`'s boxes never got tall enough to
   show it; a limit of that technique, now known.

Minor: end-screen copy lives in `EndScreen.tsx`, not `data/dialogue.ts` as asked. Not bounced.

**Rounds 0–7 complete. The user plays 1.78.0 end-to-end; the public decision follows.**
---

### 2026-09-17 — Pre-compact sweep: 1.78.0 playtest, main-menu design approved, art request, open items

**Playtest of 1.78.0** (six screenshots) → Round 8 fixes and an art round, listed in
[Ideas.md](Ideas.md) §6d *Playtest of 1.78.0*. **Main menu design approved** — layout A on
Archita Sharma's dawn backdrop with a measured per-element palette — fully specified in
**Ideas.md §9** (the spec of record; the drawn proposals live in a private page and are not
the source of truth).

🔒 **Licensing — Archita Sharma.** Five backdrops in `Art\03 - Main Menu\Backgrounds\`;
**consent recorded 17 Sep 2026, filed at `Art - Main Menu\CONSENT - Archita Sharma.md`** (gitignored). Credit mandatory on the menu (link to
`instagram.com/arc_inmotion`) and on the credits screen. Ship-in-build only; **not** generator
input unless she is asked.

**Open, carried into the compaction:**
- Round 8 handover (menu + four fixes) and the entry/exit/belt art handover — to be issued.
- The marketing agent needs a **current board screenshot** to finish §19; neither agent can
  read the jam page. Judging closes **Sep 18 12:00 PT = 00:30 IST Sep 19**.
- Public promotion is **post-jam** and waits on the user's end-to-end play of the build that
  contains Round 8.
- The ~$12 unspent Meta budget: refund not yet visible in the balance (93,273).

**Retention fact recorded** in Ideas.md §5: RUN notifications are local; they cannot reach
players who already left.
---

### 2026-09-17 — Board at ~14:10 IST; Round 8 and the hatch/belt art round dispatched

**Board (user's screenshot, jam page, 1d 10h 22m to close — i.e. 00:30 IST Sep 19):**

| # | Entry | Daily uniques | Prize |
|---|---|---|---|
| 1 | Back That Thing Up! | 1,324 | $1,000 |
| 2 | The Grind | 1,254 | $600 |
| 3 | 9 to Thrive | 1,208 | $300 |
| 4 | GT Rush: Coastal Life (3D) | **868** (+356 in two days) | $200 |
| **5** | **Spice Expert: Ramu** | **605** (888 total plays) | **$100** |
| 6 | Pest Control Tycoon | 474 | — |

Down from 4th to 5th: GT Rush pushed hard. 3rd is out of reach; 6th is 131 behind. The last
two organic posts defend the $100 tier. ⚠️ Central had said the deadline was "tonight" twice
on Sep 17 — it is tomorrow night IST. Forwarded to the marketing agent for §19.

**Dispatched by the user:** the **Round 8** handover (menu + four fixes) and the **art round**
(entry hatch, exit hatch, belt tile; cap 4,000). Independent — run in parallel; the hatch
wiring is a later implementation round, started only after both have returned.

**Licensing closed:** Archita Sharma's consent (verbal, 17 Sep 2026; ship + promote, credit required, never generator input) is filed at `Art - Main Menu\CONSENT - Archita Sharma.md` — gitignored, not in the public repo.
---

### 2026-09-17 — Round 8 returned → Private v1.79.0; menu built to a spec in the wrong unit

**Status:** ✅ returned and verified (balance 35/36/11/4/90, tsc clean, sealed files untouched,
no sidecars, Private 1.79.0 with Review/Public 1.69.0) — **but the menu was visibly wrong** on
the user's screen: stack 18 % of the width, Start shift 3 % of the height, Ramu 16 %, against
54 / 7.3 / 50 % in the approved mock. Root cause: **Ideas.md §9 carried the mock's frame pixels
(240-wide frame: "130 px stack, 120 px Ramu") as device pixels** — Central's error, built
faithfully by the agent. Retro **111**. The four fixes landed as asked: `BOTTOM_BAND 340 → 460`
with `IDLE_SIZE 104 → 88` (a real −19.8 px overlap under a 34 px safe inset, now +12.8);
end-screen `matched` outcome and held threshold 20; idle portrait hidden on `lost`; credit line
in Settings (no credits screen existed). Two agent findings kept: no SDK external-link surface
exists (`window.open` from a click handler, the SDK's own fallback pattern); RUN's release-notes
filter rejects a changelog containing the artist's surname (substring false-positive) — omit
the surname in changelogs.

### 2026-09-17 — Round 8b issued and returned → Private v1.80.0; main menu accepted

Handover: **mock units** (`mu = clamp(1, min(vw/240, vh/520), 3)`), every dimension `value × mu`,
centre crop, no `textLength`, ratio acceptance against the mock. Return verified from source:
`useMenuUnit()` in MainMenu.tsx with resize/orientation listeners; measured 54.16 % / 50.00 % /
8.30 % / 19.00 % / 97.31 % at 403×874 and 360×780 (height-clamped at 739×1315 and 768×1024,
reported not forced); SPICE EXPERT at 21.8 × mu (system sans narrower than the mock face);
44 px floor on the chips; Ramu-to-stack gap +7 px at both phone sizes by per-row isolation (the
agent's first two bounding-box measurements were wrong and it said so). Balance/tsc/sealed/
sidecars/tags all confirmed. **User: "Main Menu is acceptable."** Ideas.md §9 rewritten in
mock units. Rounds 8 and 8b committed together (they share files).

### 2026-09-17 — Art round returned: entry hatch, exit hatch, belt tile — 561 credits

Stop 1: entry take 1 (pass window, ticket rail, warm-lit opening) and exit take 1 (walkout door,
porthole, kick plate) approved at 72 px as-is. Belt: Central checked the code — the belt is a
**two-pass stroked polyline** (`pathEdge` orange at 86 units, `pathDirt` charcoal at 72; seven
alternating segments, round joins), so a 1-D cross-section tile would need rotated
`TilingSprite`s per segment plus six corner patches. Redirected to a **2D-tileable tread with no
rims** — the rim stays the code's own edge stroke; the tile replaces only the inner fill (Pixi 8
`stroke({ texture, textureSpace: 'global' })`). Stop 2: the agent built the tile
**procedurally** (`(x − y) mod period`) rather than cropping a diffusion take, so the numbers are
exact — verified by Central: 128², dominant `#3a3a44`, luminance 56–59 (inside ±10 %, at the
faint end — the wiring round screenshots it at 52 px; if invisible, one more pass at the band
edge), wrap-seam difference 0.25 on both axes vs 0.19 between interior neighbours. Files in
`Art/_gen/pass-final/`, no sidecars there. `rundot credits` → **98,805**. Noted for the wiring
round: the burrow decal slot is landscape 110:64 at both path ends; size the new hatches by
height and keep aspect. Cost fact: a generate without `--remove-background` is 120, with it 147.

### 2026-09-17 — Playtest of 1.80.0: six notes → Ideas.md §6d; two proposals owed

Two screenshots (Settings as a full screen → "just a dialogue box"; a greeting bubble over Ramu
on the menu) and six notes: boss meter (vertical, left of the playfield — **proposal owed**),
FTUE to teach the recipe widget / boss meter / upgrades / prop placement, empty-pad cue
(green/red concentric arrow, red pads inert), leaderboard revamp with a **Daily tab first**
(**three styles owed**), sub-section changes (leaderboard, settings, kitchen), and **name entry
at the start of the FTUE** with Skip → auto `FirstName LastName`. Research recorded in §6d:
SDK `daily` period is additive to the config; `profile.isAnonymous` separates guests from RUN
accounts; `metadata.displayName` carries a guest's name onto the board. Proposed split:
**Round 9** hatch wiring + settings dialog + pad cues + name entry/greeting; **Round 10** boss
meter + FTUE beats; **Round 11** leaderboard tabs + daily period.
---

### 2026-09-17 — Picks: boss meter **B · Heat gauge**, Ranks **B · Service board**; anonymous-name rule; Round 9 issued

The user picked both recommendations (specs now in Ideas.md §6d items 3 and 7) and added a
display rule for the existing `anonymous_<id>` entries: first two characters of the id, an
ellipsis, last three. Central read the live board first (`rundot leaderboard scores
…_waves_alltime`, read-only): 101 public players, ~75 % anonymous, top score 106 (the user's
own), last submission Sep 16 15:42 UTC — so the rule affects most rows and is worth doing; it
is client-side only, nothing on the server changes.

**Round 9 issued** (implementation agent, Private → **1.81.0**): hatch wiring (`pass-entry`,
`pass-exit` replace the burrow decals; `belt-tile` becomes a texture stroke on the inner path
pass, rim stroke unchanged), Settings as a dialog, empty-pad cue (green affordable / red inert,
cheapest cost read from `towers.ts`), name entry at the start of the FTUE with Skip → auto
`FirstName LastName`, the menu greeting bubble, guest names to the board via
`metadata.displayName`, and the anonymous display rule. Rounds 10 (heat gauge + four FTUE
beats) and 11 (Ranks + daily period) follow. Commit `0281d7d` (Rounds 8/8b) is local, **not
pushed** — the backdrop JPEG entering the public repo is the user's call.
---

### 2026-09-17 — Round 9 returned → Private v1.81.0 (hatches + belt, settings dialog, pad cues, name)

**Status:** ✅ returned, verified from source, committed. Balance 35/36/11/4/90, tsc clean, no
sidecars, sealed files + `kitchenScene.ts` untouched, Review/Public 1.69.0.

**Landed.** Hatches sized from opaque bounds (entry 216×213, exit 128×183 on the 1024 canvas;
scale = 86 / opaque height; on-board opaque widths 87 and 60 units, cap 160), road caps covered
at 403×874 and 768×1024. Belt inner pass is a Pixi texture stroke (`textureSpace: 'global'`,
`addressMode: 'repeat'`). Settings is a 200-mu cream dialog; `useMenuUnit()` lifted to
`ui/useMenuUnit.ts`; `Slider` gained a theme prop; the credit line got an 11 px floor
(`Math.max(11, 8 × mu)` — 7 × mu would have been 10.5 px at the mu floor). Pad cue: green at
coins ≥ cheapest (`Math.min` over `TOWERS`, = 60), red and inert below, bonus pads keep the gold
outer ring; verified by pixel clusters at 200 → 20 coins. FTUE pads reasoned from code:
`grantFtueShortfall` funds the target pad before the pulse, so the cue is always green there.
Name: `sdk/profile.ts` `readIdentity()`; guest = null profile / `isAnonymous` / `anonymous_`
prefix; dialog on Start shift, Skip → two plain words; persisted; RUN accounts skip it.
Greeting bubble narrowed 120 → 85 mu after a measured 31.9 px overlap with the stack at 360
wide; now 7.5 px clear there, 8.4 at 403. Board rows: `metadata.displayName` → `u2…x9z` rule
→ username.

**Central's handover errors, both caught by the agent:** `RundotGameAPI.profile.getCurrentProfile()`
does not exist on the public surface (it is a host-class method in the d.ts); the real call is
`RundotGameAPI.getProfile()`, synchronous, throws. And **the name dialog is in the wrong place**:
`main.tsx` boot step 6 sends a first-ever session straight into the scripted run, so a new
guest never sees Start shift before the FTUE — the user's note said the FTUE *starts* with the
name; Central put it on the button. Moves to the start of the scripted run in **Round 10**
(FTUE round anyway).

**Open for the user:** the belt tread renders but is barely perceptible (belt strip luminance
43–80, σ 3.9 vs the floor grain's 14.5). The tile is procedural, so a bolder pass costs no
credits — Central recommends asking the art agent for a second tile at roughly double the rib
contrast and swapping the file, no code change.
---

### 2026-09-17 — Playtest of 1.81.0: pulse out, Settings A, rename, pause card; Round 10 issued

Decisions in Ideas.md §6d *Playtest of 1.81.0*: the orange pad pulse is removed entirely (the
cue carries the FTUE too); Settings takes look **A · Order ticket**; rename via the greeting
bubble / Name row with a keep-best resubmit; the pause screen is the same card with green
Continue over red Main Menu. Central checked first: the pulse has two sources
(`applyPostWavePulse` after every wave; the FTUE's place2/place3 beats) sharing one
`pulsePads` channel rendered by Hud.tsx; the pause card's Main Menu abandons the run with no
confirm today (kept, flagged). Still open: the belt-tile contrast re-pass (user has not said).

**Round 10 issued** (implementation agent, Private → **1.82.0**): heat gauge (§6d item 3 spec),
four FTUE beats, name dialog moved to the start of the scripted run, pulse removal, Settings A
+ Name row, rename dialog + RUN toast, pause card.
---

### 2026-09-17 — Six post-jam studies written (Ideas.md §10): belt motion, languages, continues, shards, Play/badge, IAP

Facts read first (rewarded ads + existing 15/day budget; `browserInfo.language`; RunBucks IAP;
gem economy 4/wave, 130/stat, 390/all; meta = raw power; Access Gate blocks TextGen for
guests). Recommendations: chevrons riding the belt; full curated i18n, Hindi first; one rewarded
continue per run with a board marker (🔒 engine unseal needed for the damage nerf); full-service
shards, 8 per scroll or 150 gems, first unlock in run 1; "Play" with a +n badge and the greeting
bubble as the notice; content-not-power IAP. No picks yet; nothing scheduled. Round 10 is in
flight.
---

### 2026-09-17 — All six studies picked as recommended; round order R11–R16 set

Ideas.md §10 marked picked. Open: the 10.3 damage nerf needs an explicit **unseal** of
`engine.ts` from the user; default is +6 walkouts / no nerf, engine sealed. Round 10 in flight;
nothing new dispatched until it returns. Eight local commits unpushed (backdrop JPEG question).

---

### 2026-09-17 — Board at ~21:50 IST: dropped to 6th; docs audit applied

Screenshot from the user: **6th, 613 daily uniques** (901 total plays) at ~21:50 IST Sep 17 — out of the money by 16: 5th Pest Control Tycoon 629 ($100), 4th GT Rush 902 ($200), 7th The Good Life 479. Judging closes **Sep 18 12:00 PT = 00:30 IST Sep 19** (1d 02h 37m at the reading). Down from 5th (605) at 14:10 — Pest Control gained 155 in the
afternoon to our 8. Forwarded to the marketing agent for §19 by the user.

**Docs audit** (Central, all 18 docs + READMEs): Tasks.md header rewritten to the present (Sep 10
header kept inside a details block); Retro §4 metrics rows Sep 9–17 added with a not-kept-daily
note; Specs.md status line retired and an attribution-position note added (no credits screen; no
NCS shipped; Archita's credit is the only live obligation, met); Ideas.md §2/3/6/7 headers marked
superseded/shipped, the chef-head 'pending' line resolved, §8 moved last; this block gained Jam /
In flight / Repo rows; GDD.md gained a post-jam addendum and corrected menu naming; Plan.md and
`jam-entry/CLAUDE.md` gained closure/divergence banners. Reference docs (KitchenMode, LevelBlocks,
LevelEconomy, PropList, RecipeList, both sprite indexes, AudioGenPrompts) verified current for what
they cover.

**Proposal pages (private, not the spec of record):** heat gauge + Ranks `https://claude.ai/artifact/QSnf1MtvwnKG7xdcMwDHgh` · Settings + rename `https://claude.ai/artifact/N4NFRyujvZteqrYqCCnsqV` · six studies `https://claude.ai/artifact/Ccn4SSMfuFLJAVC7Lr3UKY` · (earlier) menu `…/6Hwx18NsmYEyhxDbhnskjn`, chef/prop `…/24TCNvib7mWLhmyWTFhfwh`.
---

### 2026-09-17 ~22:40 IST — Round 10 returned and verified: Private **1.82.0**

**Verified from source:** `rundot game list-tags` Private 1.82.0 / Review 1.69.0 / Public 1.69.0 ·
`npm run balance` 35 / 36 / 11 / 4 / 90 · `tsc --noEmit` and `npm run build` clean · no `.json`
under `public/` · `engine.ts`, `enemies.ts`, `towers.ts`, `waves.ts`, `kitchenScene.ts`,
`package*.json`, `rundot/leaderboard.config.json` unchanged · both live all-time boards unchanged
(last submission still Sep 16 15:42 UTC; PuneetMakes 106 / 6,231 on top). Committed `6d7779f`.

**What shipped (checked in the tree):**
- **Heat gauge** (`towerScene.ts` ~606–830): tube x 12–52, y 470–1270; 10 segments 28 × 70, gap
  10, margin (800 − 790) / 2 = 5 each end; orange → red per segment; fill 200 ms, drain 300 ms,
  breath 1.2 s. `filled = (level − 1) % 10`; boss on belt = `!inOvertime && isBossLevel && phase
  === 'wave'` forces full and swaps the flame for the block's boss sprite; Overtime (block 9) is
  always full, flame only, never breathing — a boolean short-circuit, not a per-level test.
  Breathing only when segment 9 is *settled* (`gaugeAnimT >= duration`), so the resting-state
  rule (Retro 110) holds by construction; the agent also sampled resting frames 500 ms apart.
  Agent's judgment call, accepted: "9 (breathing)" = level 10's build phase (the formula never
  yields 9 during level 9). Two bugs the agent caught pre-deploy: boss cap first rendered
  smaller than the flame (a speck); swapping the whole cap lost the backing circle — restructured
  as persistent circle + toggled flame/boss content layer.
- **Four FTUE beats:** `queueDialogueOnce(id)` (`dialogueController.ts:120`) backed by
  `save.seenBeats` — `recipe-widget`, `prop-placement`, `heat-gauge-intro` are once-per-save;
  `opening`, `stove-lit`, `wave1-cleared` stay every-run. Fresh-save order observed by the agent:
  name → opening → recipe-widget → prop-placement → stove-lit → heat-gauge-intro → wave1-cleared
  → upgrade0.
- **Name at boot:** `main.tsx:101` `needsBootNameDialog = identity.isGuest && save.playerName ===
  null` → `bootNameDialogOpen: true, paused: true`; NameDialog un-pauses on Skip / That's me.
- **Pulse removed:** `applyPostWavePulse` and `pulsePads` gone from every call site (one
  historical comment remains); FTUE place2/place3 still auto-select their pad.
- **SettingsCard.tsx** shared shell (scrim/card/title/divider/credit/ghost button; card 200 × mu;
  credit `max(11, 8 × mu)`; scrim `pointer-events-auto` — the second pre-deploy bug: inside
  Hud's `pointer-events-none` root the pause scrim tap did nothing). Native range inputs
  re-skinned as `.slider-cream` (`app.css:133`), 44 px touch height. Pause card = same shell,
  "SHIFT PAUSED", no Name row, green filled **Continue** over red-outline **Main Menu**, scrim
  tap = Continue.
- **Rename:** bubble tap / Settings Name row (guests only; RUN accounts show plain name, no ✎)
  → `RenameDialog.tsx` (maxLength 16) → `resubmitBestWithName` (`sdk/leaderboard.ts:122`) reads
  the server's own `playerEntry` per mode via `getPodiumScores`, resubmits the **same score and
  duration** with `metadata.displayName`, 5 s apart (`MIN_SUBMIT_SPACING_MS = 5000` = the config's
  `minTimeBetweenSubmissionsSec`). Keep-best means the row can never worsen.

**Not verified — flagged, not faked:** the live resubmit on the real board (the user's 106).
Every headless path resolves to the mock identity and an empty sandbox board. **The user's
playtest of 1.82.0 is the test:** rename from the menu bubble, then Ranks should show the new
name on the 106 row; I read both boards before and after (read-only CLI) to confirm the score
and duration did not change.

**Docs:** marketing agent's §19 closure (6th, 613, 16 behind 5th; Meta flight closed at $70.05)
synced as `f56f2ef` after the secret scan. Nit for that agent: §19 now cites "the
588-through-Sep-16 figure above" but its own edit deleted the table that held it.

**Next:** user plays 1.82.0 → annotated screenshots → fixes fold into **Round 11** (Ranks
service board, Daily tab first, `daily` period added to `rundot/leaderboard.config.json`
additively; both all-time boards read before/after the config deploy).
---

### 2026-09-17 ~23:05 IST — Playtest of 1.82.0 decided (seven screenshots); Round 11 issued

Five annotations, two unannotated boards. Decisions in Ideas.md §6d "Playtest of 1.82.0":
scroll visible during the `recipe-widget` beat (root cause: `WaveBubble.tsx` hides the bubble
behind every dialogue); em dashes out of Ramu's lines; heat gauge centred in the visible
belt-to-edge gap (letterbox-aware via `getFit`); block-clear card ×1.15 with exact values;
order-scroll chips lifted to the 11 px floor (names were 8.8 px, counts 9.6 px); cream card at
90 % alpha. Boards accepted as rendered. The live rename resubmit stays open — the user's RUN
account can't rename; a guest session is the test.

**Round 11 handover** (→ Private 1.83.0) delivered in chat: Part 1 the six fixes; Part 2 the
Ranks service board per Ideas item 7 with the `daily` period added additively to
`rundot/leaderboard.config.json`. `SubmitScoreParams.period` is a single string per call, so
the agent first tests in Private whether omitting `period` fans out to every configured
period; if not, four spaced submissions per run end (2 modes × 2 periods, 5 s apart) and the
rename resubmit covers daily too. 🔒 Both all-time boards saved with `rundot leaderboard scores
--save` before and after the config deploy; a reset stops the round.
---

### 2026-09-18 ~00:10 IST — Round 11 returned and verified: Private **1.83.0**

**Verified from source:** tags Private 1.83.0 / Review 1.69.0 / Public 1.69.0 · balance 35 / 36 /
11 / 4 / 90 · `tsc --noEmit` and `npm run build` clean · no `.json` under `public/` · sealed
files, `kitchenScene.ts`, `package*.json` unchanged · `rundot/leaderboard.config.json` diff is
exactly one added line (`"daily": { "displayName": "Today", "type": "daily" }`) · **both
all-time boards read by me after the deploy: unchanged** (waves 101 players, kills 95, last
submission Sep 16 15:42 UTC, tops 106 / 6,231) · new instances
`PpB5gECS0AMU49mGYAKM_waves_daily` and `_kills_daily` exist and are empty. Committed `053cbcf`.

**Checked in the tree:** `WaveBubble.tsx:288` exempts only `dialogue.id === 'recipe-widget'`,
submenu still requires `dialogue === null` · no `—` left in any `lines:` array · gauge centre =
`max(visibleLeft + 16 + 20, (visibleLeft + 127) / 2)` with `visibleLeft = −root.x / scale`,
recomputed on `stage.onResize` (agent measured 118 / 56 / 49.5 / 139 px at 744 / 403 / 360 /
768 wide, resize moved it 83 px live) · `PostBossPanel.tsx` carries the exact ×1.15 values ·
scroll chips 64 px icons, 11 / 12 px text; Hud row 2 is one `flex-wrap` row with `ml-auto` on
the speed buttons (the agent found a −23.8 px overlap at 360 wide that shrinking alone could
not fix — the WAVE chip and ring/head already fill the row) · `SettingsCard` background
`rgba(253, 250, 231, 0.90)` · `BOARD_PERIODS = ['alltime', 'daily']`, submit loop per (mode,
period) through the 5 s queue; rename resubmit covers all four · `Leaderboard.tsx` rebuilt:
podium 62 mu × 78 / 66 / 58, pills Today / All time, bar min-height 44, countdown to UTC
midnight, daily fetch failure never falls back to all-time data.

**Handover error owned:** I wrote the belt's left edge as `170 − SZ.pathWidth/2` (= 134) while
every worked number used 127 = `170 − (pathWidth + 14) / 2`, the drawn outer edge. The agent
used 127 and said so.

**Unverified — flagged, not faked:** (a) whether a submit with `period` omitted fans out to
every configured period — untestable headlessly; the explicit-per-period path shipped, so the
question is moot unless we want fewer calls; (b) podium, row highlight and the bar's
rank / gap / countdown against non-empty data — the sandbox returns empty boards; **the user's
playtest of 1.83.0 is that test** (Ranks → Today after one run: their row, the countdown, and
the all-time podium with three real rows). (c) The live guest rename resubmit — still needs a
guest session. **Quirk:** `rundot leaderboard config` still echoes the alltime-only JSON after
the deploy though both daily instances answer — treat that command's output as possibly stale.

**Next:** user plays 1.83.0 → annotated screenshots → Round 12 (belt chevrons + i18n table).
---

### 2026-09-18 ~00:40 IST — Playtest of 1.83.0: four decisions + Ranks restyle proposals

Three screenshots. Decided (Ideas.md §6d "Playtest of 1.83.0"): Dishes served / Waves held;
podium rebuilt on a base line; idle portrait ×1.5 with Ready moving above it. The user called
the Ranks look "boring and bland" and asked for research + a beautified proposal with the
architecture kept. Web search done (UX Collective, Yu-kai Chou, UI Patterns, IxDF, Game UI
Database, Dribbble, Mobbin — article bodies 403'd, summaries used); the principles confirm the
shipped architecture (podium block, own row, Today first, delta to the rank above). Three looks
drawn on the private page `https://claude.ai/artifact/X1yHH4RhqEuBnnBH5kuXcX` (A chalkboard ·
**B pass counter, recommended** · C ticket rail); spec summary in Ideas. Round 12 waits on the
pick; belt chevrons + i18n table shift to Round 13.

---

### 2026-09-18 ~01:00 IST — Ranks restyle picked: **B, the pass counter**; Round 12 issued (→ 1.84.0)

Handover in chat: Part 1 the four 1.83.0 fixes; Part 2 the B look on the shipped
`menu-backdrop` (walnut board, brass rim, brass podium on a shelf, order-ticket rows, one orange
bar); Part 3 near-you slice + rank-delta arrow. No new art; no config change; no sealed files.

---

### 2026-09-18 ~02:00 IST — Four parallel dispatches beside Round 12

The user asked what could run beside Round 12; four handovers delivered in chat and fired up:
1. **Localisation inventory** (new thread, read-only on `jam-entry/src`): every user-facing
   string with key / English / file:line / context / Hindi draft → one new file
   `docs/i18n/strings.md`. Feeds R13 (table) and R17 (Hindi); the user's Hindi review is the
   long pole.
2. **Shard cadence projection** (new thread, read-only): `npm run balance` + `waves.ts` →
   `docs/shard-projection.md` — checks Ideas §10.4's "first scroll during run 1" claim per
   level for `balanced` and `fox-spam`. Feeds R14.
3. **Art round 3** (art agent): laurel, recipe scroll, shard glyph — 147 credits each with
   `--remove-background`, ≤ 882 budget, style lock `ui-final/chef-hat.png`, acceptance = a
   contact sheet at 64 px and 18 px. Output `Art/_gen/ranks-kitchen-final/`.
4. **Audio round 5** (thread `561638a3`): two SFX via `rundot generate sfx` (90 credits fixed,
   ≤ 540 budget) — `sfx-scroll-unlock` (1.2–1.8 s) and `sfx-continue` (0.8–1.2 s), A minor
   resolution, rejected on listening not measurement. Output `Audio/_gen/sfx-final/`.
None touches `jam-entry/src`; I commit the two doc outputs after review; art/audio outputs
reach `public/` only through an implementation round. Marketing holds until judging closes
(00:30 IST Sep 19).

---

### 2026-09-18 ~02:15 IST — Pushed `4858e3b..591031d` (17 commits)

User: "document up to now and push." Scan over the full unpushed range with the 3-line positive
control: no keys, no unlisted game ids, no UserId, no sidecars, no gitignored folders. Added
files entering the public repo: `board/{belt-tile,pass-entry,pass-exit}.png`,
`menu/backdrop-dawn.jpg`, and five new source files (`sdk/profile.ts`, `ui/NameDialog.tsx`,
`ui/RenameDialog.tsx`, `ui/SettingsCard.tsx`, `ui/useMenuUnit.ts`). `origin/main` = `591031d`.
Five threads in flight: Round 12 (1.84.0), localisation inventory, shard projection, art
round 3, audio round 5.

---

### 2026-09-18 ~02:40 IST — Art round 3 returned and accepted: laurel, recipe scroll, shard

`Art/_gen/ranks-kitchen-final/{laurel,recipe-scroll,shard}.png` (1024², RGBA, transparent
corners, opaque margins 10–32 %) + contact sheets at 64 px and 18 px; `Art/_gen/ranks-kitchen/
LOG.md` with the 147-credit gate and pre-flight. Four generate calls (laurel take 1 rejected —
paired leaflets blurred to a blob at 22 px; take 2 has ~5 single blades per side and reads as
an open ring). Checked by me from the files: sizes, alpha, margins, style against
`ui-final/chef-hat.png`, both contact sheets by eye. **Accepted, no retake** — 18 px is a
silhouette read by design. Boundary held (`Art\` only).
**For the round that ships them:** size the shard by its opaque bbox (37 % of canvas width),
not the canvas — same rule as the hatches. Laurel → Round 12's podium (#1 disc) via a manifest
entry; scroll + shard → R14 (Kitchen scroll card, "+1 ✦" pip). Credits 98,805 → 98,209.
Also visible in the tree now, untouched by me: `docs/i18n/` (localisation agent, in progress),
`docs/AudioGenPrompts.md` (audio agent, in progress), Round 12's src edits incl. a new
`ui/blurredBackdrop.ts`.

---

### 2026-09-18 ~03:00 IST — Audio round 5 returned: two stings, measured not heard

`Audio/_gen/sfx-final/sfx-scroll-unlock.mp3` (reported 1.480 s, peak −0.21 dBFS, 5 credits) and
`sfx-continue.mp3` (1.000 s, peak −5.91 dBFS, 3 credits); takes + sidecars stay in
`Audio/_gen/sfx/`; log appended to `docs/AudioGenPrompts.md`. Verified by me: files present, no
sidecars in `sfx-final`, sizes consistent with the durations, log complete, boundary held. Not
verifiable here: duration/pitch (no MP3 decoder on this machine) — **and nobody has listened**;
the user's ear is the acceptance (scroll: clean bell on A/E over the menu music; continue:
"back to work", not a win). ✅ **User listened Sep 18 ~04:50 IST: keep both.** They ship with R14 (`sfx-scroll-unlock`) and R15 (`sfx-continue`) via the implementation agent (masters → `public/audio/`, no sidecars).
**Handover error owned:** "90 credits fixed" came from an estimate run without `--duration`
(defaults to 30 s); SFX cost ≈ 3 credits/s. Rule: estimate with the exact parameters of the
call. Credits reconciled at **98,209**; the art log's −5 / −3 gaps were these two cues.

---

### 2026-09-18 ~03:30 IST — Localisation inventory returned: `docs/i18n/strings.md`

298 rows (244 live, 54 Test Mode sectioned off), 272 with a Hindi draft, keys unique, secret
scan clean; six file:line spot-checks — five resolve, `LoadingScreen.tsx:95` is stale (line 26).
Four findings confirmed in the tree and **now part of the R13 spec:**
1. Dish names are `titleCase(slug)` at two sites (`PostBossPanel.tsx:84`, `WaveBubble.tsx:238`)
   → `dish.<slug>` keys, both sites become lookups; sealed `enemies.ts` names never render, so
   no unseal is needed.
2. `chefBodyAliasForBlock` derives the costume alias from the English block label
   (`blocks.ts:167`) → alias keyed on block id before labels are translatable.
3. `NAME_PATTERN = /^[A-Za-z .']*$/` in NameDialog + RenameDialog rejects Devanagari/Tamil →
   widen to Unicode letters (`\p{L}`), then test RUN moderation on a Devanagari `displayName`
   in Private before R17.
4. No plural branching anywhere ("1 rushes held") → `t()` takes a count and the table carries
   one/other forms for the 10 `pl` rows.
Ten least-sure strings listed at the end of the doc for the user's Hindi review — that review
is the long pole for R17 and can start now. Committed as-is (the agent's file, my commit).

---

### 2026-09-18 ~03:45 IST — Shard projection returned: `docs/shard-projection.md`

Read-only sim pass, verified against my own `npm run balance`: block 1 is ten leak-free levels
in both `fox-spam` and `balanced`; chai on the order at 1,3,4,6,7,8,9,10 = **8 shards at level
10**, coffee identical → **two scrolls at the block-1 boss, run 1**. Ideas §10.4's "~10 chai" was
an estimate; corrected to the measured 8. Beyond the café nothing passes 5 in a run (gobhi 5,
jeera/palak 4, naan 3); the +2 boss sweetener pads rajma/beans to 6 without moving any
first-unlock level. **R14 consequence:** shards persist across runs (already the design), and
the lull after level 10 is where the "+1 ✦" pip and the Kitchen card's progress fraction have
to carry the feeling of progress. Committed as-is.

---

### 2026-09-18 ~04:15 IST — Round 12 returned and verified: Private **1.84.0** — with one blocker

**Verified:** tags 1.84.0 / 1.69.0 / 1.69.0 · balance 35/36/11/4/90 · tsc + build clean · no
sidecars · sealed files + leaderboard config untouched · labels Dishes served / Waves held with
no "pests"/"rushes" left · `IDLE_SIZE 132` · Ready stacked above the portrait (`flex-col`) ·
`contextAhead/Behind 3` · `rankMemory` + `diffAndRecordRank` in save · `blurredBackdrop.ts`
memoised data-URL (no new public file) · podium/rows use GOLD/BRASS/TOMATO/TURMERIC only, bar the
only orange. Committed `f88e0fc`.

🔴 **Blocker, flagged by the agent, confirmed by me:** stacking Ready above the 132-px portrait
made the bottom DOM column ~225 px; the agent cleared the belt overlap by raising `BOTTOM_BAND`
460 → 2400, which **halves the board** — 123 px wide at 360×780 (was 247), 208 px at 744×1315
(was 417). Structural cause, not a judgment error: `getFit` reserves the HUD bands in *design
units*, but the HUD is DOM and doesn't scale, so a bigger band shrinks the board, which shrinks
the band in pixels, which needs a bigger band. **Fix (Round 12b): reserve the bands in CSS
pixels** — `scale = min(W/720, (H − topPx − bottomPx)/1300) × BOARD_SCALE`, bands measured
from the DOM. Computed: 0.304 at 360×780 (1.83.0 had 0.344), **0.654 at 744×1315 (1.83.0 had
0.579 — better, the band no longer grows with the board)**.

**Handover errors owned:** (1) the own-row colour was named "turmeric" but given gold's hex
`#f4d68a` — the agent used turmeric `#d9a520` and said so; (2) "the game's display face" — the
project declares no custom font; the agent used the existing bold system stack.

**Not verifiable headlessly (as R10/R11):** podium and rows with real scores; the daily
rank-memory rollover branch (code-reviewed only). The laurel is a 🏵️ glyph — art round 3's
`laurel.png` arrived after this handover was issued; wired in 12b.

---

### 2026-09-18 ~04:40 IST — Returns ledger started (`docs/Agent Returns.md`)

User: "Record every return handover as these agents get compacted after every task." New
standing rule: each return is pasted verbatim into the ledger before verification; the record
keeps Central's verification and decisions and links to the ledger. Backfilled: R10, R11, art
round 3, audio round 5, localisation inventory, shard projection, R12. Pending returns at this
moment: **Round 12b** only (plus the marketing agent's post-close entry after 00:30 IST Sep 19).

---

### 2026-09-18 ~05:10 IST — Hindi review, first pass (15 rows) applied to `docs/i18n/strings.md`

User reviewed ahead of R17: rows 12, 20, 24, 35, 38, 64, 78, 81, 82, 92, 124, 162, 166, 186, 253
replaced with their wording (given in Roman, set in Devanagari by me, interpolations kept).
Rules extracted for the rest of the file: system UI = **आप**, Ramu = **तुम**; Escapes = **ग्राहक**;
shift float = **बौनी का उपहार**; Max = **सर्वश्रेष्ठ**; targeting नज़दीक / भारी / हल्का; Cooktop =
**अँगीठी**; dishes in headings = **पकवान**. Logged in the file's new "Review log" section. The bulk
review waits for the R16 re-inventory (R14–R16 add strings), then R17.

---

### 2026-09-18 ~05:30 IST — Round 12b returned and verified: Private **1.85.0** — loop fixed, board still short

**Verified:** tags 1.85.0 / 1.69.0 / 1.69.0 · balance 35/36/11/4/90 · tsc + build clean ·
`public/images/ui/laurel.png` 256² RGBA, opaque bbox (23,31)–(233,227), no sidecar · sealed files
+ config untouched · `getFit(screenW, screenH, topPx, bottomPx)`, `FALLBACK_TOP_PX 96` /
`FALLBACK_BOTTOM_PX 240`, `boardOffsetY()`, two ResizeObservers writing `hudTopPx` /
`hudBottomPx` to the store · emoji gone, `ui-laurel` in the manifest. Committed `76b7e8c`.
Return verbatim in `Agent Returns.md`.

**Result vs acceptance:** 138 / 182 / 403 px against 215 / 255 / 417. The mechanism is now
loop-free (the agent also found and fixed a real trap: the 4-second objective banner sat
inside the measured top block and would have reserved ~300 px). The shortfall is the HUD's
true height: `hudTopPx` 229 at phone widths because the **wave-bubble trigger is ~115 px tall**
(64-px icon with name and count stacked beneath it — Round 11 item 5, my spec) and row 2 is
161 px; `hudBottomPx` 257 with Ready enlarged at `sm:` plus the chips row under the portrait.

**Round 12c (issued):** reserve only what can collide — row 1 plus the WAVE-chip/ring block
(the entry hatch sits under them); the bubble and speed buttons may overhang the board's
top-right, which holds only backdrop until the belt's first horizontal run at design y 330;
wave-bubble trigger becomes a horizontal chip ≤ 72 px; Ready loses its `sm:` enlargement;
upgrade chips move beside the portrait. Computed at the three viewports: bands ≈ 307 / 308 /
330 px → scale 0.309 / 0.370 / 0.644 → board ≈ **223 / 266 / 464 px**; bubble bottom ≈ 28 px
clear of the belt at 360×780 even before the horizontal chip.

**Owned:** the tall bubble is my Round 11 spec (icon 64 + stacked text) meeting my Round 12b
spec ("reserve what the DOM occupies") — two correct instructions whose sum was wrong.

---

### 2026-09-18 ~06:20 IST — Round 12c returned and verified: Private **1.86.0** — playtest-ready

**Verified:** tags 1.86.0 / 1.69.0 / 1.69.0 · balance 35/36/11/4/90 · tsc + build clean · no
sidecars · sealed files + config untouched · diff is exactly `Hud.tsx` + `WaveBubble.tsx` ·
`waveRingGroupRef` measured, trigger and speed buttons not · Ready one size (`minHeight 44`,
8×mu / 12×mu, `min(14×mu, 20)`) · `IDLE_SIZE 132` intact. Committed `ca71b1b`. Return verbatim
in `Agent Returns.md`.

**Board width: 215.0 / 257.4 / 456.2 px** against 215 / 255 / 417 — every row met; on the user's
phone the board is now larger than in 1.83.0 (417). `hudTopPx` 120.4 (was 229), `hudBottomPx`
203–226 (was 257–275). The agent's `items-start` change (10 px back) is in scope and accepted.
Rotation clean.

**Two named shortfalls, both to Round 13 (not blockers for the playtest):**
1. 360×780 with three dishes on the order: the trigger wraps to a second line and sits 4.7 px
   above the first pad row (bar 8). Fix: at widths where three 64-px cells + speed buttons
   don't fit, the third cell folds into the existing "···" carousel.
2. The open wave-bubble submenu (2-column grid, up to 363 px tall at five archetypes) overlays
   the board at every width. Pre-existing since 1.83.0 — the design-unit band never covered it
   either; 12b's whole-block measurement absorbed it by accident. Fix: the submenu becomes a
   scrimmed popover (tap outside closes, pads under it are not tappable while open), which is
   what it already behaves like, made explicit.

**Handover facts corrected by the agent:** level 81 is a post-boss build phase (PostBossPanel,
not the inline Ready), so it is the wrong level for a Ready-gap test — use level 82.

**Next:** the user plays 1.86.0 (first real look at Ranks B with rows, the daily tab, the
laurel, the bigger portrait). Round 13 issued in parallel; playtest notes fold into R14.

---

### 2026-09-18 — Round 13 returned and verified: Private **1.87.0**; playtest of 1.86.0 diagnosed

**R13 verified:** tags 1.87.0 / 1.69.0 / 1.69.0 · balance 35/36/11/4/90 · tsc + build clean · no
sidecars · sealed files + config untouched · 22 files + `src/i18n/{en,index,towerKeys}.ts` ·
chevrons every 60 units at `enemyDef('stag').speed` (50 u/s) · `\p{L}\p{M}` in both name
dialogs · both dish sites on `t('dish.'+slug)` · block labels via `t('block.'+id)` at render
sites (alias untouched — a cleaner cut than my "static map") · trigger capped at two cells under
620 px · submenu scrim `rgba(42,29,16,.4)` + `60dvh` · "Escapes left" / "Upcoming dishes" /
"What do they call you?" each exactly once in the built bundle. Committed `4e44c01`. Return
verbatim in `Agent Returns.md`. Agent's interpretation of "stays on one line" (the trigger's own
row, not the WAVE chip's) accepted — clearance 25 / 44 / 194 px. **Handover fact corrected by
the agent:** level 82 has ten distinct dishes, not three.
**Still open:** the Devanagari `displayName` moderation test needs a real guest session (user).
Chevron fade tween not captured live (code-reviewed).

**Playtest of 1.86.0 (three screenshots):** root cause of "belt glitches out in size" found at
`Hud.tsx:245` — `bottomBandActive` unmounts Ready/chips on pad selection and in wave phase, the
measured bottom band shrinks, the fit re-runs. Decision: scale depends on viewport only; bands
reserved at maximum layout via hidden placeholders. The chips column is the user's "unwanted
UI structure"; three options offered, **A (icon chips inside the portrait's height)
recommended**; R14 issues on the pick. Decisions in Ideas §6d "Playtest of 1.86.0".

---

### 2026-09-18 — Chips pick: **A**; Round 14 issued (→ 1.88.0)

Handover in chat: Part 1 static scale (bands from always-mounted hidden placeholders); Part 2
icon chips; Part 3 recipe shards + Kitchen scroll cards per Ideas §10.4 B with the measured
cadence (8 chai + 8 coffee at level 10); Part 4 `sfx-scroll-unlock` + `recipe-scroll.png` /
`shard.png` wired (opaque-bbox sizing). No config change, no sealed edits, boards untouched.

---

### 2026-09-18 ~21:40 IST — Round 14 returned and verified: Private **1.88.0**; Round 15 issued

**Verified:** tags 1.88.0 / 1.69.0 / 1.69.0 · balance 35/36/11/4/90 · tsc + build clean ·
`public/images/ui/recipe-scroll.png` 256² (bbox 46,33–210,223) and `shard.png` 128² (bbox
38,19–91,109), `public/audio/sfx-scroll-unlock.mp3` = the 24,703-byte master, no sidecars ·
`save.shards / scrolls / scrollsBought` · `'scroll-unlock'` sample registered · Ready and chips
always mounted with `visibility` toggles (`Hud.tsx:602/657`) · `data/recipes.ts` + 22
`recipe.*.note` keys · sealed files + config untouched · no dev submissions (waves all-time now
105 players, last submission Sep 18 16:03 UTC — public play on 1.69.0). Committed `7db5735`.
Return verbatim in `Agent Returns.md`.

**Agent's evidence accepted:** scale byte-identical across seven HUD states at three
viewports; the level-10 cadence (8 chai + 8 coffee, both scrolls) and the one-leak run (7 / 7,
no scroll) reproduced on the real engine — the projection holds in the shipped build. Board
width 214.96 at 360 (0.04 px under the floor by float rounding — accepted). Chip row 291 px of
336. Not spy-verified: the `scrollUnlock()` call (module-instance duplication under Vite on
Windows — a known hazard here); code-verified instead. The user's playtest of 1.88.0 hears it.

**Next:** the user plays 1.88.0 (static scale, icon chips, first two scrolls at the level-10
boss). Round 15 issued in parallel; playtest notes fold into R16.

---

### 2026-09-22 — Round 15 returned and verified: Private **1.89.0**

**Verified:** tags 1.89.0 / 1.69.0 / 1.69.0 · balance 35/36/11/4/90 · tsc + build clean · no
sidecars · `public/audio/sfx-continue.mp3` = the 17,180-byte master · **`src/game/sim/` has zero
changes — the engine stayed sealed**: `applyContinueGrant()` (`actions.ts:437`) sets only
`engine.state.lives = 6` and `phase = 'wave'` · `runEndDecided` gate in store +
`towerScene.ts:2330` + `EndScreen.tsx` · `registerRunEndReArm` registered at `towerScene.ts:1056`
and nulled on destroy · `metadata.continues` always written and carried through rename
(`leaderboard.ts:196`), defaulting to 0 for old entries · ⟳ glyph at `Leaderboard.tsx:233` ·
`'continue'` sample registered. Committed `9794e4a`. Return verbatim in `Agent Returns.md`.

**Bug the agent caught before deploy:** `checkEnd()` fires the tick after `phase === 'lost'`, so
without a gate the run would have submitted *before* the offer could grant a continue — a real
double-submission. Gated on `runEndDecided`, set only when the offer resolves to "no grant".

**Live boards (read-only, Sep 22):** waves 108 players, kills 102, last submission Sep 20 23:47
UTC — growth from public play on 1.69.0; top three unchanged (PuneetMakes 106 / 6,231). No stray
dev entry from the agent's test run, which it flagged honestly as unproven.

**Not verifiable headlessly:** the real rewarded-ad watch (needs the RUN host overlay) — the
agent simulated both outcomes through `adsSystem().grantReward`. **The user's playtest is the
test.**

**Jam is over** (closed 00:30 IST Sep 19). Open: the final standing, the marketing results
entry, and the Public/Review promotion decision — all the user's calls.

---

### 2026-09-22 — Jam final standing, from the results page

**6th of 100 · 638 DUP · 942 total plays · 15 days in jam · no prize.** Full top of the board:
1 The Grind 2,063 DUP / 3,209 total ($1,000) · 2 Back That Thing Up! 1,770 / 2,398 ($600) ·
3 9 to Thrive 1,280 / 2,140 ($300) · 4 GT Rush: Coastal Life (3D) 976 / 1,592 ($200) ·
5 Pest Control Tycoon 750 / 833 ($100) · **6 Spice Expert: Ramu 638 / 942** · 7 The Good Life
499 / 695 · 8 Order Up 478 / 652 · 9 Employment Crisis 449 / 752. **Editor's Pick, $300:
Don't Let Him Die — 159 DUP**, ranked 20th on plays.

**Two facts worth carrying into any next jam** (also in Retro §4):
1. **The gap to the money closed in the wrong direction on the last day.** Sep 17 21:50: us 613,
   5th 629 — 16 apart. Final: us 638, 5th 750 — **112 apart**. They added 121 DUP in the final
   27 hours; we added 25. Whatever they did on the last day, we did not have a last-day lever.
2. **A $300 prize was decided by judgement, not plays** — the Editor's Pick went to an entry with
   a quarter of our daily uniques. We optimised the whole fortnight for the metric and never
   pitched the game to a human reader. Cheap to fix next time: one strong description, a good
   thumbnail, and a note to the organisers — a second, independent shot at a prize.

Retention, not reach, is what the entry actually has: **942 total plays over 638 daily uniques**
across 15 days, and the two all-time boards have kept growing since close (108 / 102 players,
last submission Sep 20 23:47 UTC) with **zero promotion** and a build 20 versions behind Private.

---

### 2026-09-22 — Marketing post-close analysis synced (§19 corrected, §20 written)

Return verbatim in `Agent Returns.md`; both docs committed after a secret scan (every `?k=`
hit in them is the rule text or a redaction note, no key, id or UserId).

🔴 **A number I carried was wrong.** The Meta flight's "final" figures in this record
(**$70.05, 18 installs, CPI $3.66**, from the Sep 17 reading) were not final — the agent
re-pulled and found **$80.96, 22 installs, CPI $3.68, status completed**. I confirmed it myself
with `rundot marketing list`. The agent was right to re-verify rather than trust the record;
the §13.6 verdict (paid failed its own bar) is unchanged either way. **Lesson for me: a figure
labelled "final" in a doc is still a claim — re-read the source before repeating it** (the
carried-claims rule applies to my own records, not only to blockers).

§20 covers: (a) our closing-day uniques 27 / 19 / 2 = +25 against 5th place's +121 — no lever
of that scale existed for us; (b) `campaign_attribution_funnel_30d` re-pulled six days after the
flight is **still flat zero**, which settles the open "lag or never lands?" question from §16 —
organic produced the entire scored result at $0; (c) the retention signal (108 / 102 board
players, last submission Sep 20, on a frozen build with no promotion) named as the strongest
argument for a real relaunch — taken from my reading, the agent has no leaderboard CLI;
(d) fresh launch copy for the 1.89.0+ build, judged/editorial attention pitched deliberately
(the $300 Editor's Pick went to a 159-DUP entry), paid held until attribution is proven live.
Nothing posted, prepared or funded.

---

### 2026-09-22 — Round 16 returned and verified: Private **1.90.0**

**Verified:** tags 1.90.0 / 1.69.0 / 1.69.0 · balance 35/36/11/4/90 · tsc + build clean · no
sidecars · sealed files + config untouched · `dismissed` survives only in three comments;
`showTrigger: baseVisible && !isOpenNow` (`WaveBubble.tsx:357`) · `'menu.play': 'Play'`, the only
"Start shift" strings left are comments · `scrollsSeenCount` + `computeKitchenBadge`
(`save.ts:575`) · greeting keys present. Committed `e35e147`. Return verbatim in
`Agent Returns.md`.

🔴 **My Part 3 formula was unbuildable and the agent caught it.** I specified the badge as
"dishes at ≥ 8 shards and not yet in `save.scrolls`" — but Round 14's `awardShards` grants the
scroll in the same call that crosses 8, so that state never exists in a healthy save and the
badge would have been dead code that always rendered 0. The agent replaced it with a **seen-count
diff**: `scrollsSeenCount` snapshots `scrolls.length` at each Kitchen open, badge =
`max(0, scrolls.length − scrollsSeenCount) + claimable`. It also handled the two edges I would
have missed — pre-1.90.0 saves default the field to **their own `scrolls.length`** (verified at
`save.ts:277`, clamped), so nobody's existing scrolls light the badge once; and `buyScroll`
marks itself seen, so buying never notifies you about your own purchase. **Lesson: a spec that
names a state must be checkable against the code that produces that state** — I wrote the
condition from the design, not from `awardShards`.

**Second bug, pre-existing, fixed on this round's acceptance line:** a dialogue beat hid the
bubble without clearing `isOpen`, so the scroll silently reopened when the beat ended and the
chip stayed hidden. Third render-time reset added, keyed on dialogue newly blocking.

**Also owned:** the badge sat 0.1 px from the Kitchen label at the corner offset I specified
(40 %) — widened to 50 %, now 2.5 px clear at 360×780.

---

### 2026-09-22 — Kitchen relayout and recipe sheet decided; art round 4 issued

The user's video of the Kitchen plus an annotated screenshot. Diagnosed: the screen runs two
unrelated jobs down one column (four station cards ≈ 1.5 screens, then a 22-card recipe wall),
and the recipe card paints text over `ui-recipe-scroll` with `truncate` on the name — the
"TEXT WRAPPING NEEDS FIX" annotation is a layering bug, not a wrapping one.

Three layouts drawn → **A (two tabs, Stations first)** picked, with the badge moving to the
Recipes tab. Three sheet designs drawn → the user asked for **B's parchment shell with A's
formatting and a side-scrolling ingredient row**; that hybrid was drawn and **approved as the
style**. Full spec in Ideas §6d "Kitchen relayout + recipe sheet".

**Sprite cross-reference (mine, from the files):** 30 ingredient sprites exist, all 30 map to a
recipe, 20 of 22 dishes have ≥ 3. Only naan and aglio e olio are thin → **art round 4 issued**
for flour, garlic, tomato (147 credits each, estimate confirmed with the exact call parameters
per Retro 112; ≤ 882 budget).

⚠️ **Credits rose to 198,309** from 98,209 on Sep 18 — +100,100 with no purchase I know of.
Second unexplained rise; recorded, not acted on.

---

### 2026-09-22 — Credit ledger reconciled; the shipped game makes **no** runtime AI calls

The user supplied the studio Finances page. The arithmetic closes exactly: the grant list sums
to **98,209** before the newest grant — the same balance read on Sep 18 — and **+100,000**
(expiring Dec 18) is compensation from RUN for the marketing module being broken. The earlier
**+6,093** was simply the 5,000 and 1,093 grants landing together. **Both watch items closed.**

**A finding worth keeping for the promotion decision.** That page reports "Runtime AI usage this
month — Spice Expert: Ramu, 107,547 credits, 4 AI features, 145 calls", which reads alarmingly
like players burning our credits. It isn't: `grep` across `jam-entry/src` finds **no** call to any
RUN generation API — the only `generate*` in the codebase is Pixi's own
`renderer.generateTexture` (`game/textures.ts:132/159/376`), which is local and free. The 145
calls are **our own CLI generation attributed to the game id** across this month's art and audio
rounds. **Going public therefore adds no per-player credit cost** — one less risk on the
promotion call. (Re-check this if a future round ever adds TextGen for dish names — Ideas §10.2
raised it and it was not taken.)

---

### 2026-09-22 — Art round 4 verified — flour, garlic, tomato

Return pasted verbatim into [Agent Returns.md](Agent%20Returns.md) before verification,
per the ledger rule.

**Verified independently from source, not from the report:**

| Check | Result |
|---|---|
| Credits | `rundot credits` → **197,868**. 198,309 − 197,868 = **441 = 3 × 147 exactly**. No summed-vs-balance gap, 0 of 3 retakes used, against a ≤ 882 budget. |
| Files | `Art/_gen/ingredients-r4-final/` — `flour.png`, `garlic.png`, `tomato.png` (1024² each) + `contact-sheet-26px.png` (2540×660). No `.json` sidecars anywhere in the folder. |
| Repo boundary | `git check-ignore` confirms `.gitignore:63` covers `Ramu - The Chef/Art/`. The agent made no tracked change and ran no git — boundary held. |
| Garlic's pad claim | Measured alpha bbox: **L 14.8% / T 11.5% / R 11.0% / B 12.0%** — the report said "11–15% all around". Exact. The 8% floor is met on every side; the mechanical pad did what it claimed and cost nothing. |
| Tomato | L 11.0 / T 9.2 / R 11.0 / B 9.2 — clears the floor. |
| Flour | L 10.1 / T 25.1 / R 19.2 / B 23.8 — clears the floor, but the report never gave flour's margins and these are the loosest of the three. See the note below. |
| Contact sheet, read directly | Flour's wheat grain is genuinely invisible at 26 px — the agent's self-correction is accurate, and the white triangular silhouette does carry it. Tomato is straight-on rather than three-quarter, as disclosed. All six read apart from one another; flour vs. garlic (the only two pale sprites) separate cleanly on silhouette, sharp triangle vs. round bulb. |
| Already shipped | Round 17's agent picked all three up into `jam-entry/public/images/` at 21:02:56, seven minutes after they landed, as 128² downscales — mean absolute difference from a LANCZOS downscale of the source is **< 1/255**, i.e. the same artwork. **All 33 `ing-*` sprites are now in the tree** (the pool of 30 + these three). No re-ship needed. |

**One observation the report didn't make, and what it isn't.** Flour's art fills 0.74 of
its tile against a 33-sprite median of 0.84, so it renders optically smaller than its
neighbours in a rail. That is *not* a flour defect: measured across all 33, the library
spans **0.72 (bay-leaf) to 0.96 (coffee-extract)** and was never optically normalised at
all. Flour sits third-smallest, beside bay-leaf and tea-leaf, both of which shipped long
ago. If the ingredient rail ever wants consistent optical weight it is a **set-wide
normalisation pass**, not a retake of this round — logged here so the option is costed
honestly rather than charged to flour.

**Verdict: accepted.** Both of the agent's disclosed deviations were checked and are
accurate; its one unreported number (flour's margins) passes. Art round 4 closes.

---

### 2026-09-22 — Recipe-writing pass verified — `docs/i18n/recipes.md`

Return pasted verbatim into [Agent Returns.md](Agent%20Returns.md) before verification.
The agent's brief was written when `recipes.ts` held 22 slugs and nothing else; Round 17
shipped `RECIPE_INGREDIENTS`, both helpers, all 33 `ingredient.*` names, the sheet chrome
and all 33 sprites *while it was writing*. It noticed, and rewrote the delivery around
that instead of handing back a brief that no longer fit. That is the right instinct and it
is why this return is worth more than the 44 strings it was asked for.

**Verified independently from source:**

| Check | Result |
|---|---|
| The file | 623 lines, one new file. `git status -- docs/` shows only `docs/i18n/recipes.md` — no other doc touched, no src edit, no git run. Boundary held. |
| The 44 step strings | Parsed all 44 out of §3. **Min 173, max 209** against the 240 cap — the claimed range exactly. **Every "Chars" column figure matches the real length.** Zero non-ASCII, zero em/en dashes, zero emoji. 22 distinct slugs, and none of the 44 keys is in `en.ts` yet. |
| The 22 note quotes | Compared against live `en.ts` — **all 22 match character-for-character, and every cited line number (458–479) is correct.** (My first extractor reported five mismatches; they were my bug — the five notes containing apostrophes are double-quoted TS strings.) |
| `.prep` / `.finish` really are the open slot | `grep` finds **zero** in `en.ts`, and `i18n/index.ts:85–96` says in as many words that they "are allowed to be absent until a later writing pass lands." `RecipeSheet.tsx:283–284` gates both sections on `hasTranslation()`. Accurate. |
| The two name differences | `en.ts:424` Tea Leaf, `:425` Coffee Extract. Exactly the two it names; the other 31 agree. |
| Its diagnosis of *why* the rails drifted | Confirmed from `recipes.ts`'s own header comment, which states both constraints: every one of the 33 aliases used at least once, and chai/sambar at 5, idli/sticky-rice at 2, ooti at 7 for the acceptance check. The agent read the cause correctly rather than just the symptom. |
| `ooti` | Rail is `rice · ghee · cardamom · clove · cumin-seed · bay-leaf · turmeric`, quoted correctly. **[RecipeList.md:398](RecipeList.md) does lock Ooti's primary as Peas**, oil mustard, secondary onion, Pressure Cooker. The citation is real. |
| `aubergine` | Used exactly once across all 22 rails, in minestrone. `baingan` is not in `RECIPE_SLUGS`. Both claims hold. |
| §4.6 counts | Cooking oil 12 dishes, pasta/noodle 4, cabbage 2 — recounted from its own lists, all three correct. RecipeList §7.4 does name cabbage the secondary for both momo and thukpa. |
| Tally | 2 identical + 10 agree + 1 shipped-is-better + 2 cosmetic + 7 wrong = 22. Sums. |

**One place the chat summary was looser than the document.** The return says
`Ingredients · 1` "is reachable". The shortest shipped rail is **2** (idli, sticky-rice),
and `RecipeSheet.tsx:187` passes `ingredients.length`, so it is **not** reachable today.
§0.2 of the doc itself says it correctly — "what sticky rice will render *under my rail*",
which was one tile. The plural entry is still right to write, as hygiene before Hindi,
where the plural question does not exist the way it does in English. Not an error in the
work; noted so the fix is not sold as a live bug.

**A finding of my own, which sharpens the rail question.** The sheet now renders the note
and the rail on the same page, so a rail that disagrees with its own note is visible in
one glance. Checking all 22 notes against all 22 shipped rails, **six dishes name in their
note something the rail does not contain**:

| Dish | Its shipped note names… | The rail has |
|---|---|---|
| `upma` | "Roast the **rava**…" | `flour` — a different grain entirely |
| `pesto` | "The blender lies about **basil**." | no basil; `parsley` stands in, plus `tomato` |
| `veg-thukpa` | "Broth first, **noodles** last." | no noodles at all |
| `beans-poriyal` | "Nobody wants mushy **beans**." | `peas`, which cannot be cut small |
| `palak-aloo` | "**Spinach** lies about how much it shrinks." | no spinach |
| `sambar` | "**Tamarind** first…" | no tamarind |

Four of those six are in the agent's wrong-as-food seven; `palak-aloo` and `sambar` it
classed as "agree", because its own rail could not reach them either — no sprite exists.
So the honest statement of the problem is not "seven rails are wrong": it is **the rail
can only draw what has a sprite, and seven dishes' primaries do not have one**, which
forces a choice between a wrong tile and a short rail. Round 17 chose the wrong tile every
time, because its acceptance check counted tiles.

**Verdict: accepted, and better than the brief asked for.** The 44 strings are ready to
paste as-is. Four decisions are now open with the user — recorded in
[Ideas.md](Ideas.md) §6d.

---

### 2026-09-22 — Round 17 verified — Private 1.91.0

Return pasted verbatim into [Agent Returns.md](Agent%20Returns.md) before verification.
The largest round since the jam: the Kitchen splits in two, the recipe card is rebuilt, a
new `RecipeSheet.tsx` lands, and 26 sprites ship.

**The gate, run from source:**

| Check | Result |
|---|---|
| Tags | `rundot game list-tags` — **Private 1.91.0**, Review 1.69.0, Public 1.69.0. Exactly the required end state; the frozen jam build is untouched. |
| Balance | `npm run balance` — fox-spam 35 · balanced 36 · miser 11 · pad0-rush 4 · maxed-meta 90. **Byte-identical to the baseline** for the eighteenth round running. |
| Sealed files | `git diff --stat` across `engine.ts`, `enemies.ts`, `towers.ts`, `waves.ts`, `kitchenScene.ts`, `package*.json`, `rundot/leaderboard.config.json` — **zero changes**. |
| Typecheck / build | `tsc --noEmit` exit 0. `npm run build` ✓ built, exit 0 (the 500 kB chunk notice is the pre-existing Pixi bundle warning, not an error). |
| Sidecars | `find public -name '*.json'` — empty. |
| The 26 sprites | Counted and measured myself: **26 new files, 394,702 bytes total — the reported figure to the byte**, every one 128² and RGBA with alpha intact. |
| Account | `rundot whoami` — `offroadinggamedev@gmail.com`. |

**Claims about its own code, checked:**

- `truncate` is **gone** from `MetaUpgrades.tsx` — the Round 16 card bug is structurally fixed, not masked.
- Tabs are real: `kitchen.tab.stations` / `.recipes`, both panes mounted, scroll offsets held in a **module-scope** object (`MetaUpgrades.tsx:284–285, 332, 438`) precisely because the component unmounts on Kitchen close. The design reason is sound and is written down in the file.
- **No Google Font anywhere in `index.html`** — the disclosed deviation is true, and declining to add the game's first network font dependency for one dish name was the right call. Worth revisiting only if the sheet's display face ever carries more weight than it does now.
- The dots-row bug it caught and fixed is documented in `RecipeSheet.tsx:256–262`, in the file, against the acceptance line it would have broken.

**Its dish-sprite measurement, re-measured independently.** I measured every
`dish-*.png` myself: **30 files, all on a 212×141 canvas. 28 of 30 cluster at 205–206 ×
134**; the only outliers are **chai and coffee at exactly 75×55**, the figure the agent
reported. (It measured the 22 recipe slugs and said 20 of 22; across all 30 sprites the
proportion is the same.) Its ~204×133 vs my 205×134 is an alpha-threshold difference of
one pixel and changes nothing. **So the two small dish icons in the sheet header are those
sprites' own art, not a scaling bug** — confirmed, and now on the record as an art-side
item rather than a layout one: chai and coffee are the FTUE dishes, so they are the first
two headers most players will ever see.

**One number in the report is wrong, harmlessly.** It says "6 (`kitchen.tab.*` /
`recipe.sheet.*`) + 33 ingredient names = 39" new i18n keys. The diff shows **7 chrome keys**
— 2 tab labels and **5** sheet keys (`ingredients`, `prepHeading`, `finishHeading`, `close`,
`closeAria`) — so **40**, not 39. The localisation agent's own §0.2 independently lists the
same five. Nothing depends on the count; recorded because a miscount in a handover is the
kind of thing that later gets quoted as fact.

**Not verified, and it should not be claimed.** `touch-action: pan-x` was exercised with
Chromium's wheel emulation, which proved the rail does not steal the sheet's vertical
scroll under a *mouse*. **A real touch drag on a real device is untested.** The agent said
so plainly rather than letting the wheel test stand in for it. This is the one item in
1.91.0 that wants a finger on glass, and it belongs in the user's end-to-end play.

**Verdict: accepted.** Private 1.91.0 is the playtest build.

---

### 2026-09-22 — Playtest of Private 1.91.0 — both faults are mine, and both are arithmetic

Three annotated screenshots. Full diagnosis and the three drawn card options in
[Ideas.md](Ideas.md) §6d; proposal page
`https://claude.ai/artifact/RBd4NYK4wDfW8kdCUhQLLr`.

- 🔴 **"Thumbnail still not neat & precise"** — banner **26 mu**, medallion **30 mu**, card
  `overflow: hidden`. The circle is sliced 2 mu at each end. **Both numbers are in my own Round 17
  handover, two sentences apart.** The agent built what was written. → **Retro 115**, which also
  records that this is the *second* time (Round 12b was the first) and that the lesson written then
  was not actionable enough to prevent it.
- 🔴 **Chai and coffee render at 36% of every other dish** — 75×55 of art on the shared
  212×141 canvas against 206×134 for the other 28, perfectly centred, and the sources in
  `Art/_gen/dishes-final/` are small too. Fixed by a per-slug `zoom = 206 / bboxWidth` on the
  `<img>` inside a clipping container — not a CSS `transform`, which would blur an
  already-rasterised layer. **Zero credits**, and the shared assets stay untouched so the wave
  bubble and the order chip do not move.
- ✅ **Accepted as working:** the two tabs, the parchment sheet, the rail, the dots, the count
  label. The user deferred the sheet review until the step text is in it — *"once the entire
  recipes are placed… reviewing them will allow for any fine tweaking"* — so **the sheet is not
  re-opened in Round 18 beyond filling it.**

**Agenda set from here:** Round 18 (→ 1.92.0) carries the 44 strings, the rail corrections, the
zoom, the chosen card option, the plural key and the name change. Round 19 is Hindi, which must
follow because it translates Round 18's own new English. Art round 5 (oil / pasta / cabbage,
441 credits) runs beside either. The user's end-to-end play still gates the Public promotion, and
the ingredient rail's **touch** drag is still untested on a device.
