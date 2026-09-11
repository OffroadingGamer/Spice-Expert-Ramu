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

#### Return

_Pending._
