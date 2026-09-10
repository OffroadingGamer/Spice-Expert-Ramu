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
   window. ✅ **Confirmed correct on verification** — the formula reads
   `v === target ? 1 : …`. Ordinary builds reach **43–55%** at level 40, so the belt
   geometry itself is sound; the concentration is a full-meta artefact.
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
