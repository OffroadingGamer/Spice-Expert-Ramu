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

#### Return

_Pending._
