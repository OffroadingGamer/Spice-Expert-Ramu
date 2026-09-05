# KitchenMode — the belt game view as a second mode

**Last updated:** Sep 6 2026, 00:47 IST (read from the system clock)
**Status:** 🟢 **Architecture settled.** Eight decisions taken Sep 4, 23:10 IST — all
eight went to the recommended option. ⬜ Nothing built yet.
**🛑 Hard gate: playable end to end by Sep 10, or it is cut.** §5.

The belt-and-props game view ([PropList.md](PropList.md), [RecipeList.md](RecipeList.md))
ships as a **second mode beside the live tower defence**, not in place of it. The live
v1.2.3 is scoring at rank #3 and is not touched. On the user's approval the belt is
promoted to primary; until then it is a clearly-labelled beta.

---

## 1. The eight decisions

| # | Decision | Chosen | Why it went that way |
|---|---|---|---|
| **1** | 🔒 Leaderboard | **Two new board modes for the belt** | The only option that keeps each game comparable to itself, and the only one that stays correct if the belt is promoted. Boards start empty, which is a cost worth paying once |
| **2** | 🔒 Save shape | **Nest per mode** — see §2.2, the shape changed on contact with the source | The return loop (S2 `rundot-feature-save`) is unbuilt, so this is the one moment to pick a shape that already knows two modes exist |
| **3** | Menu | **Primary `Play` unchanged, secondary `Kitchen (beta)` beneath** | CP4 is *"first-timer reaches the fun in under 30 s, unaided."* Two equal buttons puts a decision in front of the fun — the objection that killed the PvZ2 world map on Sep 3 |
| **4** | Telemetry | **One funnel, a `mode` property on run events** | Items 33/34 are already waiting on RUN Operators over event-name shapes. Adding more names while that is unresolved makes it worse |
| **5** | Simulation | **A new `sim/kitchen.ts` beside `sim/engine.ts`, sharing only types** | Extracting a shared core first means refactoring working, deployed, *scoring* code as the opening task with 15 days left |
| **6** | Art order | **Grey-box on procedural fallbacks; swap sprites in one at a time** | `textures.ts` already falls back procedurally, so the mechanic is provable before a sprite is baked — and if §5 cuts the belt, no art time was spent on it |
| **7** | Walkouts | **Belt uses 5 (GDD-frozen), tower defence keeps 10** | The belt is GDD-conformant from its first run; the live game's balance is not disturbed while it is scoring. ⚠️ Has a consequence already in flight — §4 |
| **8** | Stop rule | **Playable end to end by Sep 10 or cut** | The return loop is what the scoring metric actually rewards, and it is unbuilt. A rule set now is worth more than the same argument on Sep 14 with sunk cost in the way |

**Explicitly rejected**, so they are not drifted into later:

- **Reusing the `waves` board** for belt levels. Permanently mixes two incomparable games
  on one all-time board and may trip `enableZScoreDetection` (threshold 4) for real
  players. Unrecoverable once written.
- **Reusing the 16 shipped PNGs** as belt stand-ins. A belt of beetles and owls reads as
  neither game, and legibility judged from it would be judged wrong.
- **Belt as "Level 6" inside the existing run.** Two incompatible sims in one run, one
  save, one score — the hardest to build and the hardest to back out of.

---

## 2. What each decision means concretely

### 2.1 Leaderboard — two new modes

`rundot/leaderboard.config.json`, `modes` block. Add beside the existing two:

```json
"orders":  { "displayName": "Orders Served" },
"shifts":  { "displayName": "Shifts Completed" }
```

`src/sdk/leaderboard.ts` widens `BoardMode` to
`'kills' | 'waves' | 'orders' | 'shifts'` and `BOARD_MODES` gains the two. **`submitRunScores`
must submit only the two boards belonging to the mode that just ran** — a belt run
submitting a zero to `waves` still counts as a submission against
`minTimeBetweenSubmissionsSec`.

> Config resolves from the published `public` tag, so the new boards do not exist until a
> deploy publishes. Deploy the config **before** the first belt run can submit, or those
> submissions fail silently.

### 2.2 Save shape — additive, and **do not bump the key**

⚠️ **This refines what was approved, because the source contradicts the plan.**
`save.ts` line 15 says *"new optional fields with defaults do NOT need a bump; parse()
fills them in"*, and `parse()` is genuinely defensive — it clamps and defaults every field.

That makes the tidy version of option A actively harmful. Moving `bestWave` and `meta`
under a `td:` branch would leave every existing player's blob without those keys, `parse()`
would default them, and **live players would lose their gems and best wave.** Bumping
`SAVE_KEY` to `:v2` does the same thing more thoroughly.

**So: additive.** Leave the current fields exactly where they are and add one branch:

```ts
export interface SaveData {
    v: number;                    // 2 from this change on; absent means 1
    bestWave: number;             // tower defence  (unchanged, do not move)
    gems: number;                 // shared         (unchanged)
    meta: MetaLevels;             // tower defence  (unchanged)
    audio: { music: number; sfx: number };   // shared (unchanged)
    ads: AdsState;                // shared         (unchanged)
    kitchen: {                    // NEW - absent on every existing blob
        bestLevel: number;
        propsOwned: string[];
        shiftsCompleted: number;
    };
}
```

`SAVE_KEY` stays `spice-expert-ramu:save:v1`. An old blob parses, gets
`kitchen` defaulted, and loses nothing.

The asymmetry is real and deliberate: tower-defence fields sit flat for historical
reasons, kitchen fields nest. **Do not tidy it during the jam.** If the belt is promoted
later, that is the moment to migrate in two phases — write both shapes for one release,
then drop the flat ones.

### 2.3 Menu — secondary, and labelled

`MainMenu.tsx` keeps `Play` as the primary action, visually dominant and unchanged. A
secondary `Kitchen (beta)` sits beneath it. `AppState` gains
`mode: 'td' | 'kitchen'`, set when the button is pressed and read by `App.tsx` to choose
which canvas and HUD to mount inside the existing `phase === 'playing'` branch.

The word **beta** is doing real work: it sets the expectation that lets a rough build be
public without costing the entry's reputation.

### 2.4 Telemetry — one property, not one funnel

`actions.ts` `registerEngine` already fires
`trackFunnelStep(2, 'run_start', 'run', 2)` and `track('run_start', {...})`. Add
`mode` to the **payload** of `run_start`, `run_end` and the core-loop events. The funnel
name stays `run`.

**The discipline this buys is also the discipline it demands:** every play-count and
retention figure in these docs is now a *blend* until filtered by `mode`. Items 26 (D1
retention 0.0%) and 32 (35 vs 47) are open and must be resolved **before** the belt starts
carrying traffic, or their numbers become two unknowns instead of one.

### 2.5 Simulation — a new file

`src/game/sim/kitchen.ts`, new. Shares `TdPhase`-style types and nothing else.
`sim/engine.ts` is **not edited**. What does not carry over, and is not imported:

| Not reused | Lines |
|---|---|
| `data/towers.ts`, `enemies.ts`, `waves.ts`, `targeting.ts`, `status.ts` | 502 |
| `towerScene.ts`, `towerIcons.ts` | 452 |
| `ui/BuildSheet.tsx` | 259 |
| **Total tower-specific** | **1,213 of 3,972** |

The duplicated tick loop and lives handling are the accepted cost. **A fix to one sim does
not automatically reach the other** — note it in any bug fix that touches both.

### 2.6 Art — grey-box first

`textures.ts` resolves each alias from `assets/manifest.ts` **or** draws a procedural
placeholder. The belt therefore runs at zero art cost: name the aliases
(`ing-flour`, `prop-tandoor`, …), ship nothing, and the placeholders draw.

Sprites arrive one at a time from `Art/_sliced/01 - Kitchen Essentials/`, each a PNG into
`public/images/` plus one manifest line. **No code change per sprite.** The v1 graph needs
about 11 of the 128 sliced items ([PropList.md](PropList.md) §4).

Kitchen Props furniture is a **background layer at its own scale** and never a belt
sprite — [PropSpriteIndex.md](PropSpriteIndex.md) §5.

### 2.7 Walkouts — 5 in the belt, 10 in tower defence

`CONFIG.economy.startLives` stays **10** for tower defence. The belt sim carries its own
**5**, matching the frozen GDD §10 (*"Five walkouts ends the shift"*).

---

## 3. Build order

Derived from the decisions, cheapest irreversible work first:

1. **Leaderboard config + deploy** — the boards must exist before anything can submit.
2. **`SaveData.kitchen` branch + `v: 2`** — additive, no key bump, no migration.
3. **`AppState.mode` + the menu button + the `App.tsx` branch** — the shell, still empty.
4. **`sim/kitchen.ts` grey-box** — belt, slots, one recipe, walkouts, win/lose. Procedural
   textures throughout. **This is the Sep 10 gate.**
5. `mode` on the run events.
6. Levels 2–5 from [RecipeList.md](RecipeList.md) §3.
7. Sprites, one manifest line at a time.
8. Kitchen Props background layer.

---

## 4. ⚠️ Consequence already in flight

The Phase 5 music handover, given to the implementation agent Sep 4, triggers the
high-intensity cue at **`lives < 3`**. That was calibrated as 20% of `startLives: 10`.

With the belt on **5** walkouts, a literal `3` is **60% remaining** — it would fire almost
immediately and mean nothing. **Amendment to relay:**

> In `switchCue`'s trigger, use `lives < startLives * 0.3` rather than the literal `3`.
> Reads as 3 of 10 in tower defence and 1.5 → 1 of 5 in the belt, which is the same
> dramatic position in both.

Everything else in that handover is mode-agnostic.

🚩 **And carry item 54's warning into the belt's own tension trigger.** In the tower defence a Full Thali costs 3 walkouts in one leak, so a player at exactly 3 crosses the threshold and dies in the same step — the danger cue starts *on the game-over screen*. The belt has the same shape of hazard wherever one mistake can cost more than one walkout. Guard the trigger with `lives > 0` from the start rather than rediscovering it by ear.

---

## 5. 🛑 The stop rule

**Playable end to end by Sep 10, or the belt is cut** and the remaining days go to the
return loop (S2), which is what the scoring metric — Total Unique Daily Plays — actually
rewards. D1 retention currently reads 0.0%.

**"Playable end to end" means, precisely:**

- One recipe runs from spawn to tray without a crash, ten runs in a row.
- Walkouts decrement, the shift ends, the end screen shows.
- The belt is reachable from the menu and returns to it.
- Procedural textures are acceptable. **Art is explicitly not part of this gate.**

Anything short of that on **Sep 10** and the belt stops. Not paused — stopped, with the
menu button removed, so the live entry carries nothing half-built into the final week.

> The rule exists because it is being written on Sep 4, when it costs nothing. On Sep 14,
> with six days of work sunk into the belt, the same call is much harder to make well.

---

## 6. 🔒 The belt design decisions — Sep 5 2026, 21:19 IST

Fourteen decisions taken in one pass: ten compatibility questions raised against the
user's node/level proposal, plus four follow-ups. **Three of them reverse earlier frozen
answers** — flagged below and mirrored in [PropList.md](PropList.md) §7.

| # | Question | Decision |
|---|---|---|
| 1 | Do prop upgrades ship? | 🔄 **Unlock a tier, then place it at a higher cost.** *Not* upgrade-in-place. **Reverses [PropList.md](PropList.md) §6** |
| 2 | Tier = purchase or unlock? | **Both.** Permanently unlocked in The Kitchen, paid for again on every placement |
| 3 | Do unlocks trivialise replays? | **Cost absorbs it.** Starting cash is authored for the level's intended tier, so a returning player brings a higher tier and affords fewer props — power traded for slots |
| 4 | Wok — own family or a tier? | **Fry pan L4+, tier-gated.** "Wok" in a recipe *means* the tier, so the recipe is the reason to upgrade |
| 5 | What is a Container? | 🔄 **An ingredient, not a utensil.** Labelled vessels drawn off `S3-50` (`Untagged/23`), 2–5 min each in Aseprite. **Container leaves the prop vocabulary** |
| 6 | How is a tier requirement reached? | **Loaner for the round.** A level needing an unearned tier lends it; keeping it requires the star. Satisfies GDD §10.10's *"no hard block, ever"* |
| 7 | Is oil a belt item or a station property? | **Belt ingredient**, one row cell. Oil is the sharpest cuisine signal in the set |
| 8 | How do spices reach the dish? | 🔥 **Ground once per node into a named masala**, then carried as a *single* container cell in every later level of that node — the way Kadhai Masala and Shahi Masala exist in a real kitchen |
| 9 | Chai has no sprite | **Drawn in Aseprite** in the pack's outline style, not generated |
| 10 | Jam scope | **All five nodes.** Each: 1–2 grinding levels → recipe levels → one boss |
| 11 | What does the boss escalate? | **Speed.** Same node recipes, faster each wave |
| 12 | Do boosts cross between modes? | **Fully separate.** Belt currency is the **chef hat** (generated later); belt boosts never touch `MetaLevels` |
| 13 | Where do no-cook dishes resolve? | **Dough Making Counter is the assembly station.** VFX: a generated cloud scale-tweening above it. SFX: chopping knife |
| 14 | Does the Sep 10 gate hold? | 🔄 **Narrowed to the FTUE node** — §6.3 |

### 6.1 Node structure

**FTUE is the Beverage node, and it runs all the way to High-Tea** — it is not one
tutorial level. Then four cuisine nodes in this order:

| Order | Node | Opens with |
|---|---|---|
| 0 | **Beverages** — Chai → High-Tea | The FTUE. Teaches placement, then unlocking, then placing the unlocked tier |
| 1 | **North Indian** | 1–2 spice-grinding levels producing its masala |
| 2 | **South Indian** | ditto |
| 3 | **Italian** | ditto |
| 4 | **North Eastern** | ditto |

Every node ends in a **boss**: all props unlocked *for that node* available across the 4
slots, starting cash covering **tier 1 only**, waves accelerating until the walkout limit.
Chef hats scale with waves cleared.

> ⚠️ **The boss terminates on walkouts, not on a ticket count.**
> [Specs.md](Specs.md) §6a's level object ends when its authored `tickets` have all
> resolved; the boss needs the other loop. [RecipeList.md](RecipeList.md) §4 already
> reserved the billboard's `WALK-OUTS LEFT: ∞` state for endless rounds, written
> before this mode existed.

### 6.2 🔒 Save shape — this **amends §2.2**, and it is still free to change

§2.2's `kitchen` branch was written before tiers, masalas, stars and a second currency
existed. Four decisions push against it. **The branch is still unbuilt, so this costs
nothing today and costs a migration after the first belt player saves.**

```ts
kitchen: {                              // NEW - absent on every existing blob
    bestLevel: number;
    propTiers: Record<string, number>;  // prop id -> highest tier unlocked
                                        // (was propsOwned: string[])
    masalas: string[];                  // node masalas ground so far
    levels: Record<string, number>;     // level id -> stars, 0-3
    hats: number;                       // belt-only currency, the chef hat
    boosts: Record<string, number>;     // belt-only; NEVER MetaLevels
    shiftsCompleted: number;
}
```

🔒 **`gems` and `MetaLevels` are not touched.** That is exactly what decision 12
buys: the live scoring game is never rebalanced around a currency earned in a mode it has
not seen. `propsOwned: string[]` could not have held a tier — that is the load-bearing
change.

### 6.3 The Sep 10 gate, narrowed — **amends §5**

The rule in §5 was written on Sep 4 to stop a half-finished belt damaging the live
entry. Two things have since changed: the belt now lives on **its own git branch behind a
private build and the human gate**, so that damage is no longer possible; and scope grew
from one recipe to five nodes.

**The gate is now: Chai runs spawn-to-tray, walkouts count, the shift ends — ten times,
no crash.** Everything else in §5 stands, including *"procedural textures are
acceptable, art is explicitly not part of this gate."*

| Gate needs | Gate does **not** need |
|---|---|
| `sim/kitchen.ts`, belt, 4 slots, one recipe, walkouts, end screen, menu branch | The chai glass · the 24 containers · the chef hat · any node past Beverages |

➡️ **So the Aseprite queue and the Sep 10 gate run in parallel and neither blocks
the other.** That is the useful consequence of narrowing it rather than dropping it.

### 6.4 Release workflow

The belt is built on **its own branch**, published as a **private** build, and reaches
`public` only through the standing human gate. `main` keeps carrying the live scoring
entry untouched.

### 6.5 Still open

- **`Untagged/` hand-sort.** The produce sprites are probably among the 23 Ingredient and
  9 Pending items, but none are named — so which recipes are already fully covered
  cannot be answered yet.
- **Recipe-level counts per node** — grinding levels and the boss are fixed; the levels
  between them are not.
- **The boost list** beyond Fast Hands, Reach and per-prop traits.
- **The live tower defence's upgrade-does-not-change-sprite behaviour** — fix, or leave
  as superseded by the belt.

---

## 7. 🛑 Scope read against Sep 19 — Sep 6 2026, 00:47 IST

Written the moment the last node was picked, so it costs nothing to act on. Deadline is
**Sep 19, 00:30 IST — 13 days from now.**

### 7.1 What the full design now weighs

| | Amount |
|---|---|
| Nodes | 5 |
| Dishes | 28 — 24 picked ([RecipeList.md](RecipeList.md) §7) + ~4 beverages |
| **Levels** | **~38** — Beverages ~5, node 1 × 8, node 2 × **9**, nodes 3–4 × 8 |
| Art | ~6–7 h — 19 containers, 4 loose sprites, 12 dishes drawn, 9 recoloured, chai glass |
| **Systems still unbuilt** | `sim/kitchen.ts` · level loader + schema · star evaluation · The Kitchen hub · tier placement + cost · the loaner rule · masala carry-over within a node · boss mode (endless, speed ramp, walkout terminate) · chef hats + boosts · the amended save shape · leaderboard config · `mode` telemetry |

### 7.2 🔴 The honest read: five nodes do not fit, and two do

Four days go to the Sep 10 gate (§6.3) — belt, slots, one recipe, walkouts, end screen.
That leaves **nine days** for twelve unbuilt systems, 38 levels of authored data, seven
hours of art, *and* the daily promotion the scoring metric actually depends on.

**And the metric is the argument.** The jam scores **Total Unique Daily Plays**. The belt
does not feed that — the return loop does, and the return loop (`rundot-feature-save`,
daily rewards, quests, notifications) is **still unbuilt** with 13 days left. §5's original
reasoning was right even though its deadline has moved.

➡️ **Recommended jam scope: Beverages + North Indian.** Two nodes, ~13 levels, and the
art narrows from 6–7 h to about **2 h** — 4 container labels, 5 plated dishes, the chai
glass. That is enough to prove the node structure end to end: FTUE, grinding level, tier
unlock, loaner, boss. Nodes 2–4 are fully designed and recorded; they are built after the
jam with no clock on them.

⬜ **User decision.** Recorded here rather than argued later.

### 7.3 What ships in which order

1. **Sep 6–10** — the gate: `sim/kitchen.ts`, belt, 4 slots, Chai, walkouts, end screen,
   menu branch. Procedural textures throughout.
2. **In parallel, any time** — the Aseprite queue. Art is not on the gate's critical path.
3. **Sep 10–13** — save shape, level loader, stars, tier placement, The Kitchen hub.
4. **Sep 13–16** — node 1 authored; boss mode; chef hats.
5. **Throughout** — the return loop and the daily posts, which are what the metric rewards.

### 7.4 The custom-LoRA question — ⚠️ licence first, and not during the jam

Raised Sep 6: train a style LoRA on the sprite sheets (Kohya_ss / OneTrainer) so new
ingredients and dishes can be generated in-style, futureproofing the art dependency.

**The idea is sound and the timing is wrong. Three reasons, in order of weight:**

1. 🔴 **Licence.** These are **purchased itch.io packs**, already gitignored as
   non-redistributable. Most asset licences permit use *in a game*; using them as
   **training data to produce more assets** is a different grant and many licences now
   forbid it explicitly. **This must be read before any training happens, jam or not.**
2. 🟡 **It does not save time on this batch.** The whole remaining art queue is ~6–7 h
   of Aseprite, and ~2 h under §7.2's scope. Dataset prep, captioning, training and
   iteration will not beat that, and diffusion output is weakest at exactly what sprites
   need — clean alpha edges, consistent outline weight at small size, palette discipline.
   The cleanup lands back in Aseprite anyway.
3. ℹ️ **Fooocus is an inference UI, not a trainer.** It can *use* a LoRA; Kohya_ss and
   OneTrainer are the right tools to *make* one.

✅ **The version worth doing, post-jam:** by the end of this art pass there will be
**~30 sprites the user drew** in the pack's style — 19 containers, 4 loose items, the
plated dishes. **Train on those.** The licence question disappears entirely, the style is
already the user's own, and a set that size is a workable style-LoRA dataset. That is the
futureproofing, without the exposure.

