# KitchenMode — the belt game view as a second mode

**Last updated:** Sep 8 2026, 19:40 IST
**Status:** 🟢 **Architecture settled.** Eight decisions taken Sep 4, 23:10 IST — all
eight went to the recommended option. ✅ **Built and running privately** — eight Test Mode rounds, `c043804`, **v1.15.0 private-only**; §6.7. This line read *"Nothing built yet"* until Sep 7 while §6.7 below recorded the opposite.
**🛑 Hard gate: playable end to end by Sep 10, or it is cut.** §5.

The belt-and-props game view ([PropList.md](PropList.md), [RecipeList.md](RecipeList.md))
ships as a **second mode beside the live tower defence**, not in place of it. The live
v1.7.0 is scoring at rank #3 and is not touched (public since Sep 5, 14:10:21 IST — [Specs.md](Specs.md) §8a.11; this line read v1.2.3 until Sep 7 and was two releases stale). On the user's approval the belt is
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

> 🔄 **SUPERSEDED Sep 7 2026 — read §6.8 first.** The Sep 10 date below was replaced by a **delivery gate**: all four cuisine nodes shipped, or the live build carries the jam. §5's *definition* of playable still stands and its four clauses were all met by round 8; only the date and the consequence changed.

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
| 14 | Does the Sep 10 gate hold? | 🔄 **Narrowed to the FTUE node** (§6.3), then **replaced Sep 7 by a delivery gate** — §6.8 |
| 15 | Which way does the belt run? | ✅ **Left to right, serpentine — two runs with the station row between them.** Tested on device Sep 7 and confirmed as runway, §6.6 |

### 6.1 Node structure

**FTUE is the Beverage node, and it runs all the way to High-Tea** — it is not one
tutorial level. Then four cuisine nodes in this order:

| Order | Node | Opens with |
|---|---|---|
| 0 | **Beverages** — Chai → Coffee → both → boss | The FTUE, **four levels**. Teaches placement, then unlocking, then placing the unlocked tier. ⚠️ This cell read *"Chai → High-Tea"* until Sep 7; High-Tea was dropped Sep 6 — [RecipeList.md](RecipeList.md) §9.1, §7.0 |
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
| `sim/kitchen.ts`, belt, 4 slots, one recipe, walkouts, end screen, menu branch | The chai glass · the 23 containers · the chef hat · any node past Beverages |

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

### 6.6 ✅ The belt reads as runway — measured on device, Sep 7 2026

🔒 **Verdict: `runway`.** The user's one-word call after playing private
**v1.8.0** on a phone. That closes the only question the Test Mode build existed to
answer, and decision 15 above is settled on it.

**Why the question existed.** GDD Sep 3, 13:05 PT chose a *vertical* lane deliberately:
*"Lane direction agrees with the phone's long axis."* A left-to-right belt in portrait
gives a dish **720 units of travel instead of 1280** — 56% of the runway, so 56% of the
reaction time at the same speed. Folding the path into a serpentine recovers it:

| Path | Travel | vs the rail's 1280 |
|---|---|---|
| Straight left→right | 720 | 0.56 |
| **Serpentine, 2 runs + the drop** | **1,600** | **1.25** |

**The station row sits between the two runs**, so each dish passes it twice — once from
below on run 1, once from above on run 2. That is what the serpentine is *for*; it is not
a way to buy travel distance. One row of four slots covers the whole path.

**Numbers under test** (`jam-entry/src/game/kitchenConfig.ts`): belt speed **100 u/s**,
spawn interval **2.2 s**, slot reach **260**, dishes per shift **20**, walkouts **5**.
Travel is 570 + 460 + 570 = **1,600 units**, so a dish crosses in **16 s** and about
**7 are in flight** at once.

⚠️ **The end-screen counters are not a difficulty signal.** `sim/kitchen.ts` serves
the nearest in-reach dish on a single tap — no recipe steps, no cook time — so the
observed *"20 served, 0 walked out"* could not have gone otherwise. The verdict above is a
judgement from watching the belt, which is the only thing this build could measure.

🔴 **Open — 150 design units are cropped off the bottom.** Measured from the
v1.8.0 screenshot: the RUN host header takes 114 px, leaving a **952×1486** viewport at
aspect **0.641** against the design's 0.563. The board scales to fit *width* (×1.312),
needs 1,692 px of height, has 1,486, and is anchored to the top — so design y
**1130–1280 is off-screen**, which is **54% of the prop tray band**. The belt is
unaffected: run 2 at y=930 and the PASS point are both comfortably visible, which is why
the test still stands. `stage.ts`'s rule centres the board when a screen is *taller* than
9:16; **this device was shorter, and that case is unhandled.**

✅ **Everything else rendered to spec**, measured from the same screenshot rather than
eyeballed: slot centres at design x **150.9 / 291.5 / 432.9 / 573.9** against 150/290/430/570,
slot y **701** against 700, dish **106×70** exactly, band edges at **400 / 540 / 860**.

### 6.7 🔒 Test Mode rounds 2–8 — the built state, Sep 7 2026

§6.6 describes **v1.8.0**. Seven rounds followed it; this is where the build actually is.
All private-only, `set-public` never run, public untouched at **v1.7.0** throughout —
re-verified independently at round 8 via `rundot game list-tags`: private **1.15.0**,
review **1.7.0**, public **1.7.0**.

| Round | Commit | Version | What it settled |
|---|---|---|---|
| 2 | `3517e91` | v1.9.0 | Billboard becomes the whole HUD · 2×2 slot grid · fit-to-height stage |
| 3 | `577e4c7` | v1.10.0 | Belt drawn as a path · props in slots · ingredients on the belt · final-dish area |
| 4 | `bc78d05` | v1.11.0 | One sprite + ×N per dish type · prop labels · fridge anchoring both belt ends |
| 5 | `fdc03ee` | v1.12.0 | Chai only · fridge to a true 2.25× · empty slots + `PropPicker` · end-screen fix |
| 6 | `2907f0e` | v1.13.0 | Label containment against the slot's inner well · belt-segment interaction rules · chai to 3 ingredients |
| 7 | `e6fd8ab` | v1.14.0 | Ingredient cell fixed at the n=5 cap · music and SFX |
| **8** | **`c043804`** | **v1.15.0** | 🔒 **The recipe gate** · badge counters · belt speed ramp · `Level` → `Lv` |

**Geometry as built** — `jam-entry/src/game/kitchenConfig.ts` is the source of truth:

| | |
|---|---|
| Bands | billboard **0–400** · run 1 400–540 · stations 540–860 · run 2 860–1000 · finalDishContent 1000–1160 · **hamburgerReserve 1160–1280** |
| Billboard | 640×400 at x40 · panels inner x57 w**607** · upper 20–100, gap 100–132, lower **132–380** |
| Slots | 2×2 at x **240/480**, y **615/785** · box 139×150 |
| Fridge | **72×108** at x39 y646 — 2.25× native, aspect preserved |
| Belt | **1952** units: 176 / 570 / 460 / 570 / 176 · `beltSpeed` **122** · traverse **16.0000s** |
| Ingredients | milk · ginger · tea-leaf · bag shuffle, longest drought **2n−2 = 4** |
| Badges (r8) | **36×37.7** at each cell's top-right, `(cx+39.1, 257.8)` · digit `#FDFAE7` fitted to **19.7** units · measured clearances: **132** from the panel edge, **30** from the recipe name, **20** from the `+`, **14** into the 28-unit gap |
| Prop label (r8) | budget **97** units unchanged · suffix `" - Lv 1"` **40.6px** (was `" - Level 1"`, 58.6px) → name gets **56.4** units, was 38.4 (**+47%**) |

🔒 **`beltPath` and `beltSpeed` are load-bearing together.** 122 is not a tuning
value — it is `1952 ÷ 16.0`, chosen to hold the traverse identical to the run §6.6
validated. Change the path and recompute the speed, or the "runway" verdict no longer
describes what ships.

🔓 **Round 8 amends that, and the lock survives the amendment.** The belt now
*accelerates* — `beltRamp { baseTraverse 16.0, perCompletion 0.5, minTraverse 10.0 }`,
in **traverse seconds, never u/s**. Speed is `BELT_LENGTH ÷ target`, recomputed every
tick, so what the lock actually protects still holds: **nobody types a speed without
knowing its traverse.** 16.0s became where a shift *starts* rather than where it stays,
and `beltSpeed: 122` is now the opening value, guarded by a dev-time check that warns if
it ever stops equalling `BELT_LENGTH / baseTraverse`.

| chai | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| traverse (s) | **16.0** | 15.5 | 15.0 | 14.5 | 14.0 | 13.5 | **13.0** |
| speed (u/s) | **122** | 126 | 130 | 135 | 139 | 145 | **150** |
| reaction window (s) | **3.54** | 3.43 | 3.32 | 3.21 | 3.10 | 2.99 | **2.88** |

Linear in *traverse*, deliberately: a linear speed increase would give a decelerating
loss of reaction time, so the ramp would feel strong early and fade. This way each cup
costs the same half-second of thinking time. Dishes already in flight accelerate too —
that is what "the belt got faster" physically means.

⬜ **The curve itself is UNSETTLED.** The user deferred it to a play review rather than
answer it up front. All three numbers live in `beltRamp` so a retune is a one-number
edit; **do not inline them.**

✅ **Five findings worth keeping:**

1. **The 2×2 grid changed the reach mapping and kept the property.** At `slotReach` 260
   each row is 145 from its own run and 315 from the other, so the **top row serves run 1
   and the bottom row run 2** — where one row served both. A dish still meets **all four**
   slots, two per pass, so the serpentine's purpose survives. **Do not raise `slotReach` to
   restore both-runs-from-either-row.**
2. **Padding must be measured from the slot art's inner well, not its bounds.**
   `ItemSlot1.png` is 137×148 with the well at x 14–122, y 18–127 — a border ~20 units
   deep at the bottom on a 139×150 box. Round 5 padded 8 units from the sprite edge and
   the label landed *on the border*. Now `slotWell` + `labelGap`, giving a 97-unit text
   budget and aggressive ellipsis.
3. **Props reach only the three working runs.** The two fridge connectors (segments 0 and
   4, `dist` outside 176–1776) are untouchable — an ingredient there is in transit,
   neither servable nor shown as tappable. Gated on **segment**, not distance: `slotReach`
   reaches the left stub geometrically, and shrinking it would break finding 1.
4. ✅ **RESOLVED Sep 7 — chai masala is gone from the project entirely.**
   [RecipeList.md](RecipeList.md) §6.3 lists Chai Masala under *"Masalas — one per node,
   the output of its grinding levels"*, but §7.0 gives Node 0 four levels — Chai, Coffee,
   both, boss — and **no grinding level**. It has no production step in the FTUE. Chai is
   **milk · ginger · tea leaf**, decided Sep 7. The user's ruling, same day: *"Chai Masala
   needs to be completely omitted — we are using tea leaves and ginger instead, chai masala
   is redundant."* §6.3's masala row is now **five** entries, and the ingredient total
   drops 24 → **23**.
5. 🔴 **A greedy bot cannot produce a walkout, so a bot run says nothing about
   difficulty.** Round 8's verification drove a bot that taps any slot with an eligible
   dish in reach, every tick, across four slots covering both runs — it *structurally*
   cannot miss, so "6 chai, 0 walked out" was the only reachable outcome. That is
   [Retro.md](Retro.md) lesson 50 recurring one round later on a different harness, and
   it matters more now than it did then: **the ramp has never met a player who drops
   ingredients**, which is the exact interaction it was tuned against. Everything
   structural about round 8 is verified; nothing about how it *plays* is.

**Audio** mirrors the live game and adds nothing to `audio.ts`: `service_low` +
`prefetchCue('service_high')` on entry; `service_high` latched once when
`remaining > 0 && remaining < walkoutsAllowed * 0.3` — the belt's **own 5**, per §4's
amendment, firing with one left; `menu` on exit. SFX are procedural, so the pass cost no
assets. `sfx.shot('kitchen')` was a **deliberate stand-in** — an unknown id gets the
documented default thud — *"and wants its own cue once serving means completing a
recipe"*. ✅ **Round 8 resolved it:** serving now means completing a recipe, so pickup
keeps the thud and completion calls `sfx.upgrade()` (a rising 660→880→1320 square
arpeggio) — two moments, two sounds. `audio.ts` is still untouched, verified absent from
`c043804`'s file list. A bespoke completion cue stays a follow-up for the audio thread.

✅ **The gate is built — round 8, `c043804`.** For seven rounds serving was round 3's:
tap a slot, the nearest in-reach ingredient resolves, `served++`. **One ingredient in,
one chai out** — milk, ginger and tea leaf were three interchangeable tokens that each
independently became a full cup, and the recipe printed on the billboard was dressing the
sim did not enforce. §6.3's gate is *"Chai runs **spawn-to-tray**, walkouts count, the
shift ends"*; spawn, walkouts and shift-end worked from round 1, and **spawn-to-tray is
now the fourth.**

`sim/kitchen.ts` carries `held` (one count per `ingredientKinds` key, every key
initialised to 0, never undefined) and `completed`. A tap increments `held[kind]` and
`served`; **only** when every key in `recipe.ingredients` is > 0 does it consume one of
each, increment `completed`, and emit `'completed'` — which is what now drives the
final-dish ×N and the speed ramp.

🔒 **Two invariants to preserve if this is ever touched again:**

1. **One tap can never complete two dishes — a single `if`, never a `while`.** A tap adds
   exactly 1 to exactly one counter, and completion is checked-and-consumed on every tap,
   so no second set can ever be sitting there waiting. A `while` that iterated twice
   would be hiding corrupt state, not handling a case.
2. **`served` was deliberately NOT repurposed.** It still means *ingredients picked up*,
   which is the only reason `TestBelt.tsx`'s `shiftPending`
   (`shiftDishCount − served − walkouts − dishes.length`) still computes correctly.
   🔴 **That expression dies with the 12-chai target.** It works only while
   `shiftDishCount` bounds spawning; once spawning is open-ended the four buckets stop
   summing to a known total and it prints a **negative number on every run** — including
   wins (`20 − 36 − 0 − 0 = −16`). It must become *"N chai short"*,
   `max(0, target − completed)`, in the same round that changes the win condition.
   Chai made is `completed`, a separate number. Collapsing the two would silently break
   the pending count.

🔄 **SUPERSEDED Sep 7, 21:0x IST — the round is capped by dishes, not spawns.**
As built, `shiftDishCount: 20` caps *spawns* and a perfect run makes 6 chai with 2
orphans (20 ÷ 3 kinds = 6 complete sets + 2). The user reversed this: **the round ends
at 12 completed chai**, spawning runs open-ended until then, and `shiftDishCount` stops
being a spawn budget at all. Leftovers stay a parked currency hook either way. Full
per-level values now live in **[LevelEconomy.md](LevelEconomy.md)**, which is the source
of truth for every currency number; this section keeps only what the belt itself does.

🔒 **PARKED — leftover ingredients become currency**, via a condition-based
multiplier, once a scoring system exists. It does not exist yet, so at shift end they are
**discarded silently**: not scored, not converted. The end screen's *"N ingredients
discarded"* line is a **diagnostic only**, there so the size of the remainder can be read
from real play before the currency design is written. **Do not invent a score for them.**

⬜ **Open, measured, not shipped:** dropping the `" - "` before `Lv` would give the prop
name **64.4** units instead of 56.4. `"Water … - Lv 1"` still truncates today. The
dashed form ships; the user decides on review.

⚠️ **Licences unread** on the UI pack (dobo_ui demo tier), the props, the ingredients
and the dish sprites. Fine for a private build; **not cleared for any public deploy.**

### 6.8 🛑 The delivery gate — **replaces §5's Sep 10 stop rule**, Sep 7 2026

The user, Sep 7: *"We can upgrade that gate to all 4 nodes delivered. If not, the current
last stable live version sustains for the rest of jam duration."*

| | §5's rule (Sep 4) | §6.8's rule (Sep 7) |
|---|---|---|
| Test | Playable end to end | **All four cuisine nodes delivered** |
| Date | Sep 10 | **Sep 19, 00:30 IST** — the jam deadline |
| If it fails | Menu button removed, belt cut | **Nothing is removed.** Public stays on the last stable build for the rest of the jam |

✅ **§6.3's narrowed gate was met.** *"Chai runs spawn-to-tray, walkouts count, the shift
ends — ten times, no crash."* Spawn, walkouts and shift-end have worked since round 1;
spawn-to-tray landed in round 8 (`c043804`), and ten clean runs were reported. ⚠️ Those ten
runs were driven by a **bot**, not played on a device — structurally they could not fail
(§6.7 finding 5), so the gate is met on construction, not on feel.

⚠️ **The scope this commits to, stated plainly.** Four cuisine nodes is **33 levels** on
top of node 0's four — 37 total — against **12 days**. Exactly **one** level has settled
economy values ([LevelEconomy.md](LevelEconomy.md)), and FTUE level 1 alone took eight Test
Mode rounds to reach its current state. That is roughly three levels a day, every day,
including the art, the recipes and the tuning.

✅ **But the downside is bounded, and that is what makes it a reasonable bet.** The belt
has never been public — `set-public` has never been run on it — so failure costs the
entry **nothing**: v1.7.0 keeps scoring at rank #3 exactly as it does today. This is an
all-or-nothing wager on a protected base, not a gamble with the entry.

🔴 **What the old rule bought that this one does not.** Sep 10 forced a decision while
nine days remained to redirect. A gate that resolves on the deadline cannot be acted on —
if the four nodes are not there on Sep 19, there is no time left to do anything about it.

⬜ **A mid-flight checkpoint around Sep 13–14 was proposed and DECLINED**, Sep 7: *"keep
it 10 only. No other checkpoint for now."* So **Sep 10 stands as the only checkpoint**, and
it has already been met (above). The delivery gate resolves on the deadline with nothing
between. Recorded here because the risk it leaves open was raised and answered, not missed.

🔥 One mitigation survives regardless: **the return loop is no longer deferred behind the
nodes.** §6.9's daily boss leaderboard *is* [Plan.md](Plan.md) item 12, so the work that
Total Unique Daily Plays actually rewards now sits inside the belt rather than after it.

### 6.9 🔒 Three leaderboard modes — and the return loop, Sep 7 2026

Decision 1 (§6) reserved *"two new board modes for the belt"*. This is what they are, and
the naming settled Sep 7:

| Mode | Board | Status |
|---|---|---|
| **Challenge mode** | The **existing live board** — the tower defence | ✅ Live, rank #3, **untouched** |
| **Play Game** | The belt's ordinary levels | ⬜ Named now, promoted to primary only before going public |
| *(boss board)* | **Coins earned in boss rounds** | ⬜ New. Bosses award no stars — [LevelEconomy.md](LevelEconomy.md) §2.1 — their score goes here instead |

🔒 **The live board and the live gameplay are not touched, and that is the point.**
The user's reason, verbatim: *"We don't want to discourage current user base."* The belt's
boards run **parallel** to the shipped one; nobody's rank moves, nothing is reset, and the
tower defence keeps its own board under a name that describes it rather than demoting it.

🔥 **This is the return loop, and it is the first concrete version of it.**
[Plan.md](Plan.md) item 12 has sat open as *"daily rewards, quests, notifications"* — the
thing the jam metric (**Total Unique Daily Plays**) actually rewards, and the reason §5's
original stop rule existed at all. The mechanic, as set Sep 7:

> **Placing top 3 on the daily boss leaderboard pays Chef Hats, collected on the next
> daily login.**

Three properties worth naming, because they are what make it a *return* loop rather than a
score display:

1. **The reward is claimed tomorrow, not today.** A player who ranks has a reason to open
   the game again, which is exactly the behaviour the metric counts.
2. **It is daily, so it resets.** Yesterday's rank does not protect today's.
3. **It pays the meta currency**, so it feeds §7.4's shop rather than being a vanity badge.

⚠️ **Rank-gated rewards create a farming incentive — the one line that must not be
crossed.** Competing for a daily top 3 is legitimate; manufacturing plays to reach it is
not, and RUN audits for it. Nothing about this mechanic may reward *number of plays*, only
*best score*, and no reward may ever depend on a player's own alt accounts or repeated
sessions. This is the standing no-faked-plays rule applied to a feature that is unusually
close to it.

### 6.10 ✈️ In flight — two handovers issued Sep 7, ~22:40 IST

Both were **delivered as chat text for the user to relay**, never executed here. Neither
has returned. This section exists so their returns can be checked against what was
actually asked for rather than against memory.

#### Round 9 — implementation agent · *"a level, economically complete"*

Target **v1.16.0**, private. Nine tasks, in this order:

| # | Task | The number that matters |
|---|---|---|
| 1 | Round ends at **12 completed chai**, spawning open-ended | `shiftChaiTarget: 12`, `maxSpawns: 200` safety cap |
| 2 | `shiftPending` → **"N chai short"** | the old expression prints **−16 on a clean win** |
| 3 | Coin wallet + `coinsEarned` tally | 100 float · +3/grab · +20/dish · −25/walkout |
| 4 | **Ready gate** — nothing spawns until pressed | cues move off scene creation |
| 5 | Slots start **locked**; 50 to unlock; the guard | *"You must place an Utensil to unlock!"* |
| 6 | Tier costs + 0.75 sell refund | `[40, 70, 120, 200, 320]` |
| 7 | **Prop cooldown 2.0s on USE** | 0.500/s against a 0.455/s spawn rate |
| 8 | Coins on the billboard's upper panel | centres x **208.75** / **512.25**, y 60 |
| 9 | End screen: coins, stars **with thresholds printed**, hats | ⭐ 340 / 300 / clear · flawless = 469 hats 🔴 wrong, see §6.11 |

✅ **Acceptance figures to check the report against** — all derived in
[LevelEconomy.md](LevelEconomy.md) §8:

| Run | Coins earned | Stars | Hats |
|---|---|---|---|
| Flawless — 12 chai, 36 grabs, 0 walkouts | **348** | ⭐⭐⭐ | **469** 🔴 → 465 |
| 2 walkouts | **310** | ⭐⭐ | 419 |
| 4 walkouts | **272** | ⭐ | 365 |

⚠️ **This round is materially larger than rounds 2–8**, each of which changed one or two
files. A mid-way check-in from the agent is reasonable and was offered.

🔴 **Not in round 9, deliberately:** the boss. Endless mode, the two-phase ramp,
wave hats and the leaderboard are **round 10** — §6.9 and [LevelEconomy.md](LevelEconomy.md)
§7.3b.

#### Chef Hat icon — art agent · `rundot generate image`

**Prompt-only, no `--reference-image`.** 🔒 The dobo_ui UI pack and Kitchen Props both
have **unread licences**, and feeding a licensed asset into a generator is exactly the use
an unread licence might prohibit. The icon has no counterpart in any pack, so a reference
buys nothing. Style is described in words instead: chunky flat-colour toque, thick
`#70243A` outline, cream `#FDFAE7` body, two or three bold pleats.

Operational facts, measured Sep 7 22:38 IST rather than assumed:

| | |
|---|---|
| Cost | **147 credits** per image with `--remove-background` — `rundot generate estimate image --remove-background`, *"exact at current pricing"* |
| Balance | **134,370** credits. September so far: imagegen 17 calls / 2,325, audiogen 8 / 791 |
| Cap given | **3 generations**, because [Retro.md](Retro.md) records a per-creator rate limit after ~4–5 calls — the cap is about the limit, not affordability |
| ⚠️ `--game-id` | Auto-detect **fails** from `Ramu - The Chef\` because `jam-entry/` is a *sibling*, not a child. **Verified working** by running from `jam-entry/` with no flag; `--out` takes an absolute path back into `Art\` |

Deliverables: takes at `Art\_gen\ui\chef-hat-take<N>.png` with their `.png.json`
sidecars, the pick copied to `Art\_gen\ui-final\chef-hat.png`. **The agent does not bake
into `jam-entry/public/images/` and does not touch `manifest.ts`** — that is a later
implementation round, per the art boundary (`Art\` only, no git, no `docs\`).

✅ **Acceptance:** dimensions measured not eyeballed · corner pixels at **alpha 0** · a
clean alpha edge · and **the 32 px test** — downscaled to 32×32 the toque must still be
recognisable. A fail there is a reject, not a nitpick: the end screen shows this icon at
roughly that size.

---

### 6.11 ✅ Rounds 9–11 landed — a level became economically complete, Sep 8 2026

§6.10 recorded two handovers in flight. Both returned, plus two more asset rounds. This
section is what actually shipped, and the numbers that were wrong in the asking.

#### What is deployed

| Round | Commit | Private | What it made true |
|---|---|---|---|
| 9 | `ed8501d` | v1.16.0 | 12-chai win condition, coin wallet, locked slots, tier costs, cooldown, Ready gate, end screen |
| 10 | `c8aeade` | v1.17.0 | The **setup phase** — the board is live before Ready · ⭐⭐ 300 → **295** |
| 11 | ✈️ issued | v1.18.0 | The recovery floor + baking four generated assets |

Review and public stayed at **v1.7.0** throughout. `set-public` has never run.

#### 🔴 Three numbers were wrong in the asking, not in the building

**469 hats was never reachable.** §6.10's acceptance table paired *348 coins* with *469
hats*, which cannot both be true — 348 implies 36 grabs and zero leftover, 469 implies
two. The round 9 agent computed the formula instead of trusting it and reported **465**.
Corrected in [LevelEconomy.md](LevelEconomy.md) §8.3.

**The ⭐⭐ bar at 300 sat inside a live range.** A walkout nets between −25 and −19
depending on bag order, so a 2-walkout run earns **298–310**. Identical play scored ⭐⭐
or ⭐ on shuffle luck. Moved to **295**, which sits in the 292–297 gap between the
2-walkout floor (298) and the 3-walkout ceiling (291) — a gap no run can land in.

**The Ready gate froze the whole board, not just the belt.** Built as a full-screen scrim,
so setup was impossible: an FTUE player spent the 16.0s first traverse unlocking and
reading the picker, dropped a dish, and put ⭐⭐⭐ out of reach before their first grab.
Round 10 made the board live and left `tick()`'s guard as the only freeze. That guard is
now load-bearing alone — verified safe because `tapSlot` returns at `bestIdx < 0` on an
empty belt, mutating nothing and emitting no event.

#### 🔴 The trap round 10 made easier to reach — fixed in round 11

`hasEverPlacedProp` is one-way: it records that a prop was *ever* placed and permanently
lifts the 100-coin floor. Unlock (100→50), place (50→10), **sell** (10→**40**), press
Ready with an empty board — the floor is gone, one walkout takes you to **15**, a utensil
costs 40, and with no station there is no way to grab and therefore no way to earn. The
round runs out to five walkouts and loses, silently.

It existed in round 9 too. Round 10 changed the odds: the setup phase is exactly where
players are invited to experiment with buying and placing. **The flag records history; the
deadlock is a property of the present.** Round 11 replaces it with a floor derived from
current state — 0 with a prop placed, `propTierCost[0]` with a slot unlocked and nothing
in it, `startingFloat` before any unlock.

#### 🎨 Assets generated — all four still unbaked at time of writing

| Asset | Round | Takes | Credits | Note |
|---|---|---|---|---|
| `chef-hat.png` | A2 | 3 | 441 | Takes 2–3 rejected on **enclosed holes** |
| `coin.png` | A4 | 1 of 3, seed 2201 | 147 | Passed first time; 294 credits unspent |
| `kettle-boil.mp3` | A3 | 3 | 15 | ⚠️ fatigue test still needs a human ear |
| `water-pour.mp3` | A3 | 3 | 15 | |

Session spend **618 credits**, balance **133,752**.

⚠️ **The two icons do not fill their canvases equally** — coin content is 83.7% of its
canvas, the hat 64.7%. Drawn at one size the coin looks ~29% taller. Round 11 normalises
on the alpha bounding box at bake, not on texture size; both files are 1024×1024, so
nothing looks wrong until they sit side by side.

🔒 The `.png.json` / `.mp3.json` sidecars embed the **RUN UserId and the live game id**.
Their source folders are gitignored; `public/` is not. They must never be copied in.

#### 📏 Station reach, measured — and the imbalance it exposes

Derived from `beltPath`, `slotReach: 260` and `isEligibleDist` (eligible = dist
[176, 1776) of 1952). Each station can take a dish only from the stretch of belt that
falls inside its reach:

| Station | Belt stretch | Share of belt | Tap window, round start → full speed |
|---|---|---|---|
| Top-left | 176–557 | 23.8% | 3.12s → **1.95s** |
| **Top-right** | 365–1092 | **45.4%** | 5.96s → **3.72s** |
| **Bottom-right** | 860–1587 | **45.4%** | 5.96s → **3.72s** |
| Bottom-left | 1395–1776 | 23.8% | 3.12s → **1.95s** |

🔴 **The right-hand slots are worth 1.91× the left-hand ones and cost the same 50.**
They reach the vertical drop as well as their own run. It is worse late: the prop cooldown
is **2.0s** and a left station's window at full speed is **1.95s** — shorter than its own
cooldown, so it cannot take two dishes in a row by the end of a round.

The four zones chain together and their union is the whole eligible belt, with the left
slots covering exactly the entry and exit stretches the right ones miss — so a full
four-station build genuinely needs all four. The imbalance only bites when you can afford
one, which is precisely the FTUE case, and nothing currently communicates it.

✈️ **Round 12 (proposed, on hold):** a translucent band along the belt showing each
placed prop's reach. It teaches the tap timing and, more importantly, converts this hidden
trap into a visible choice. The ranges must be **derived at runtime** from `beltPath` /
`slotReach` / `isEligibleDist`, never hardcoded from the table above.

---

### 6.12 ✈️ Round 11 in flight — what to check its return against, Sep 8 2026

Issued as chat text, so it exists nowhere else. Target private **v1.18.0**. Two
independent parts; a regression in either is attributable on sight.

#### Part A — the recovery floor

Replaces the one-way `hasEverPlacedProp` (§6.11) with a floor read from current state,
values taken from `KITCHEN_CONFIG` and never hardcoded:

| State | Floor |
|---|---|
| A prop currently placed (`filledSlotCount > 0`) | **0** — income exists, the charge is fair |
| No prop, a slot unlocked | **`propTierCost[0]`** = 40 |
| No prop, nothing unlocked | **`coins.startingFloat`** = 100 |

Applied in **two** places — the walkout branch and the end of `sellProp`. The sell case
matters: someone at 0 who sells their last prop lands on 30, below the 40 they need, and
without it there they would wait for a walkout to become solvent.

⚠️ **Deliberate, will look like a regression in a diff:** unlocking a slot and placing
nothing now floors at **40** where it floored at 100. Intended — 50 remains after the
unlock and 40 buys the utensil.

#### Part B — the bake

| Source (gitignored) | Destination (tracked) | Alias / SampleId |
|---|---|---|
| `Art\_gen\ui-final\chef-hat.png` | `public/images/ui-chef-hat.png` | `ui-chef-hat` |
| `Art\_gen\ui-final\coin.png` | `public/images/ui-coin.png` | `ui-coin` |
| `Audio\_gen\sfx-final\kettle-boil.mp3` | `public/audio/kettle-boil.mp3` | `kettle-boil` |
| `Audio\_gen\sfx-final\water-pour.mp3` | `public/audio/water-pour.mp3` | `water-pour` |

Manifest is `jam-entry/src/assets/manifest.ts` — **not** `src/game/` — and both icons go
in the **`deferred`** bundle beside the other `ui-*` entries. Aliases resolve through
`art(alias, fallback)` in `src/game/textures.ts`.

**Icon normalisation:** trim to the alpha bounding box, pad to a square so content height
is **80% of canvas**, then downscale to **256×256**. Both sources are 1024×1024 and ~935 KB;
without this the coin renders ~29% taller than the hat (§6.11).

🔓 **Narrow exemption to the lock on `src/audio/audio.ts`** — exactly two changes and
nothing else: add the two ids to the `SampleId` union, and their two rows to `SAMPLES`.
Starting `gain` **0.65** for both, explicitly a **human retune by ear**, one line each,
exactly as `lose` / `upgrade` / `wave-clear` were tuned. Measured peaks are −6.78 dBFS
(kettle) and −5.53 dBFS (water), already quieter than the existing samples.

**Where the SFX fire:** a grab currently plays `sfx.shot('kitchen')` from the `'served'`
event, which does not know which slot acted. The per-grab sound moves into
`attemptUseOrSell`, in the branch where `served > before` — the slot index and the
cooldown both live there — selecting `prop-kettle-l1` → `kettle-boil` and
`prop-water-dispenser-l1` → `water-pour`. Only those two props exist, so no fallback is
needed. **Exactly one sound per grab**; the old `sfx.shot('kitchen')` must stop firing.
`sfx.upgrade()` on completion stays where it is.

#### ✅ Acceptance

**Floor** — (1) unlock → place → sell → Ready → one walkout: `wallet === 40`, then a
tier-1 prop places successfully. (2) Ready with nothing unlocked, three walkouts:
`wallet === 100`. (3) Prop placed, wallet 200, one walkout: `wallet === 175`, full charge.
(4) Two props, sell one: a later walkout still charges 25. (5) `coinsEarned` unaffected
by the floor in every case.

**Bake** — (6) `Assets.cache.has('ui-coin')` and `'ui-chef-hat'` true after the deferred
bundle resolves, so the manifest art wins over the procedural fallback. (7) The two baked
PNGs have equal content height within 2%. (8) HUD banner: icon + number centred on design
x **512.25**, inside `HUD_MAX_W`, no overlap with the walkouts readout at x 208.75.
(9) End screen on a clear shows the coin icon with `earned = 348` on a flawless run, and
the hat icon beside 465. (10) Kettle grab plays `kettle-boil`, dispenser plays
`water-pour`, exactly one sound per grab. (11) No `.json` sidecar anywhere under
`public/` — they carry the UserId and live game id.

**Regression** — (12) flawless = 12 chai / 36 grabs / 0 walkouts / **348 coins / ⭐⭐⭐ /
465 hats**. (13) A 2-walkout run scores ⭐⭐ at both **298** and **310**; a 3-walkout run
at **291** does not. (14) Run Again returns to setup — wallet 100, slots locked, Ready
shown. (15) Ten runs, zero console exceptions.

🔎 **Already confirmed in passing** while the agent was still working: both icons
baked to 256×256 at **80.5% content height each** (items 7 and part of 6), 52 KB and
55 KB against 935 KB sources, and **no sidecars** under `public/` (item 11).

#### Still open, not in round 11

- ⚠️ **The kettle SFX fatigue test needs a human ear.** No agent in this pipeline can
  listen. 56% of its energy sits in a narrow band at ~518 Hz — essentially C5, which is
  consonant with the score's A minor, but whether it reads as *boiling* rather than a hum,
  and whether it nags by the 30th play of a round, is unanswered.
- ✈️ **Round 12, the reach overlay** — on hold pending a look at round 11. Spec and the
  measured windows are in §6.11.

---

### 6.13 ✅ Rounds 11–12 landed · the belt geometry, measured · round 13 in flight, Sep 8 2026

§6.12 recorded round 11's spec while it was still in flight. It returned, round 12
followed, and three smaller fixes went out directly from the main thread. Private is at
**v1.22.0**; review and public have not moved off **v1.7.0** and `set-public` has never run.

#### What is deployed

| Commit | Private | What it made true |
|---|---|---|
| `c12404b` | v1.18.0 | Round 11 — the state-derived wallet floor, four generated assets baked |
| `8840401` | v1.19.0 | Round 12 — the reach overlay, derived at runtime from `tapSlot`'s own predicate |
| `3e9674b` | v1.20.0 | HUD coin readout right-anchored (was centred on the panel's right quarter) |
| `74fbfb0` | v1.21.0 | Overlay stroke: `butt` cap at `pathWidth` (was `round` at `pathWidth+14`) |
| `dc5050a` | v1.22.0 | `slotReach` **260 → 180** — station bands halved |

Round 11 passed all fifteen of §6.12's acceptance items on independent re-verification.
One correction to §6.12's own note: the baked icons are **82.0% content height each**, not
the 80.5% recorded there — that figure was measured off a pre-final bake while the agent
was still working. Equal to a tenth of a percent between the two, which is the property
that governs how they look side by side; the absolute target was 80% ±2.

#### 🔴 A trap that did not exist, and a working rule loosened for it

I reported a double-unlock deadlock: unlock twice from the 100 float, land on 0 with two
open slots and no prop, stuck until a walkout floors you back to 40. **It was not
reachable.** Round 9 already carried this guard, and round 12's brief was written as
though it did not exist:

```ts
if (unlockedCount >= 1 && filledSlotCount === 0) {
    onMessage('You must place an Utensil to unlock!');
```

The cause was mine and it is worth naming precisely: I read `attemptUnlock` with a range
extract anchored on the first `slotUnlockCost` match, which **silently began below the
guard** and cut four lines off the top of the function. I then quoted the truncation as
the whole function.

Round 12 replaced that rule with `wallet >= slotUnlockCost + propTierCost[0]`. The two are
**indistinguishable on the FTUE path** — with no prop placed you cannot earn, so the wallet
is exactly 100 until you place one, and both rules refuse the second unlock. They diverge
only with an empty board and a fat wallet, reachable only by earning and then selling
everything. Neither can strand a player. What was lost is round 9's teaching rhythm
(unlock → place → unlock → place), which was deliberate enough to be documented in
`kitchenConfig.ts`'s `slotUnlockCost` comment — **that comment now describes a rule that
no longer exists**.

⏸️ **Parked by the user on Sep 8** — *"It's inconsequential right now, ignore for now."*
Restoring round 9's guard, and the stale comment, both wait.

#### 📏 The belt geometry, measured — and what each number is a threshold OF

| Number | What it actually bounds |
|---|---|
| **145** | 🔴 **HARD.** The perpendicular distance from a slot row to its own belt run (y615→y470, y785→y930). Below it a station reaches no belt at all and is inert. |
| **219.66** | The tightest reach keeping 100% of the eligible belt inside some station's reach *at every instant*. Distance from the nearest slot to four points — belt entry, belt exit, and **both** right-hand corners (645,470)/(645,930) — all four identical, by the layout's symmetry. |
| **~186** | Below this, station bands stop overlapping **at all**. At 260 the overlap was 38.5% of the eligible belt. |

🔴 **I first presented 219.66 as the floor for a winnable round. It is not.** A coverage
gap does not make a dish uncatchable: a dish travels the whole eligible run and only needs
to be in *some* band at *some* moment, and it still crosses several. Gaps cost
**opportunities**, not reachability. Going below 219.66 is therefore a difficulty choice,
not a correctness one — which is what made `slotReach: 180` available at all.

#### The overlay was drawing band that did not accept

Round 12 stroked the bands at `pathWidth + 14` with `cap: 'round'`. **A round cap extends a
stroke by half its width past each endpoint** — at width 86 that painted 43 units of band
beyond both ends of every station, 86 units of fiction each (**+23%** on the left
stations), and made the drawn right-hand overlap read 318 units against a true 232. The
overlay's entire justification is that it cannot disagree with `tapSlot`, and a decorative
cap was doing exactly that, in the direction that most misleads: inviting taps just
outside the real window. Fixed in v1.21.0 — `butt` at exactly `pathWidth`. `join` stays
round: that shapes the belt's own corners, which are mid-band, not band ends.

#### `slotReach` 260 → 180, and what it invalidates

Sanctioned by the constant's **own** comment — *"do not raise; narrow the station band
instead if it ever reads as generous"* — so this is the permitted direction, not a lift of
the file header's validation lock.

| | 260 | 180 |
|---|---|---|
| Left / right band | 381 / 726 units | **213 / 356** |
| Total overlap | 38.5% | **0%** |
| Belt covered | 100% | 71.3% |
| Tap window, full speed | 1.95s / 3.72s | **1.09s / 1.82s** |

🛑 The flawless **348 coins / 465 hats** figures and the **⭐ 340 / 295** thresholds in
[LevelEconomy.md](LevelEconomy.md) §8 were all derived at 260. **They do not carry over**
and must be re-earned by play, not by arithmetic. Recorded in `kitchenConfig.ts` beside
the constant as well as here.

---

### 6.14 ✈️ Round 13 in flight — what to check its return against, Sep 8 2026

Issued as chat text, so it exists nowhere else. Target private **v1.23.0**. Origin: a
screenshot the user annotated with four bracketed areas, saved to
`Ramu - The Chef/references/Errors/`.

**The change: radial reach is replaced by an assigned stretch of belt per station.**
`slotReach`'s circle goes; each of the four slots owns one contiguous zone, zones never
overlap, and a seam separates neighbours.

Boundaries sit at the **midpoint of each working run**, from `cumLengths`; a new
`KITCHEN_CONFIG.slotBandSeam: 40` opens ±20 either side; the outer ends are the eligible
bounds themselves. **Derived at runtime, never pasted** — the table is reference only:

| Zone | Slot | Range | Length |
|---|---|---|---|
| #1 top-left | `slots[0]` | 176 → 441 | 265 |
| #2 top-right | `slots[1]` | 481 → 956 | 475 |
| #3 bottom-right | **`slots[3]`** | 996 → 1471 | 475 |
| #4 bottom-left | **`slots[2]`** | 1511 → 1776 | 265 |

Coverage 92.5% of the eligible belt, overlap **zero**. Windows 1.36s (left) and 2.43s
(right) at full speed, against the 2.0s prop cooldown.

⚠️ **`slots` is ordered TL, TR, BL, BR**, so zone #3 is `slots[3]` and zone #4 is
`slots[2]`. Swapping the bottom two still looks plausible on screen. The brief asks for
the mapping to be *derived* — nearest slot to `posAt(zone midpoint)` — which yields
exactly this table.

`tapSlot`'s membership test becomes zone containment; `Math.hypot` survives only as the
tie-break for which dish to take. `isEligibleDist` stays, though the zones imply it.
**`slotReach` is not deleted** — it is under the header's validation lock; readers are
removed and it is marked superseded. The overlay reads the **same** exported zones, never
a second derivation.

✅ **Acceptance:** (1) derived zones match the table; (2) #3→`slots[3]`, #4→`slots[2]`;
(3) no overlap, nothing outside [176, 1776); (4) a dish in a seam serves for neither
neighbour; (5) **a dish spatially close to a station but in another station's zone does
not serve** — this is what proves the radial rule is gone; (6) drawn band and accepting
range coincide at both ends; (7) overlay live during setup; (8) `slotReach` present, no
readers, marked superseded; (9) ten runs, zero exceptions; (10) review/public still 1.7.0.

🛑 The agent is told **not** to assert the 348/465/340/295 figures still hold, and to
report what a flawless run actually scores instead. Retuning the thresholds is the user's
call.

#### Also open, not in round 13

- ⏸️ Round 9's unlock guard and the stale `slotUnlockCost` comment — parked by the user.
- ✅ The kettle SFX fatigue question is **closed**: the user confirmed it reads fine.

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

🔄 **DECIDED Sep 6 2026 — full scope. The recommendation above is declined.**
User's reason, recorded: *"We will go for full scope now that art can be generated
locally, art barrier has shortened multifolds."*

The recommendation rested on art being the binding constraint at 6–7 hours. **It is
not any more.** The tray-inpaint pipeline produced 12 plated dishes in a single afternoon
(§8.2), and the remaining 18 are one more batch of roughly the same length. The
argument that survives is the *other* half of §7.2 — the metric is Total Unique
Daily Plays and the return loop is what feeds it — and that is a scheduling
constraint on **engineering**, not on art. Track it there, not here.

### 7.3 What ships in which order

1. **Sep 6–10** — the gate: `sim/kitchen.ts`, belt, 4 slots, Chai, walkouts, end screen,
   menu branch. Procedural textures throughout.
2. **In parallel, any time** — the Aseprite queue. Art is not on the gate's critical path.
3. **Sep 10–13** — save shape, level loader, stars, tier placement, The Kitchen hub.
4. **Sep 13–16** — node 1 authored; boss mode; chef hats.
5. **Throughout** — the return loop and the daily posts, which are what the metric rewards.

### 7.4 The custom-LoRA question — 🔄 **SUPERSEDED Sep 6 by §8**

*Kept for the reasoning. Three of its conclusions were reversed: the licence cleared, the jam-scope call flipped to production, and Fooocus was dropped. Read §8 instead.*

#### 7.4a The original answer (Sep 6, 00:47)

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

---

## 8. The LoRA + inpaint pathway — as built, Sep 6

Supersedes §7.4. Everything here was **measured**, not assumed; the numbers are
reproducible from `Art\_sliced\`.

### 8.1 The two packs are two different art forms

| | **01 - Kitchen Essentials** | **02 - Kitchen Props** |
|---|---|---|
| Unique opaque colours | **460,584** | **57** |
| Horizontal runs of length 1 | **93.6%** | 43.5% |
| What it actually is | smooth-shaded illustration | true flat pixel art |

⚠️ **Kitchen Essentials is not pixel art.** The `16x16` in its filenames is the
seller's design-grid label, not the delivered format — 93.6% of pixel runs are a single
pixel long, so there is no grid, no flat fill, no hard palette. Median sliced sprite is
**124 px**; these are multi-tile props, not 32×32 icons.

Three consequences, each of which reversed an earlier decision:

1. **SDXL, not SD 1.5.** SD 1.5's advantage was its pixel-art ecosystem; that does not
   apply to art which is not pixel art, and 460k colours of smooth shading is what SDXL
   is best at.
2. **Lanczos, not nearest-neighbour.** Nearest preserves a pixel grid. There is none, so
   nearest only injects blocky aliasing into smooth art. *(Nearest stays correct for the
   Props profile.)*
3. **Never one LoRA across both packs.** 57 colours vs 460,584 is not a variation in
   style; a single model would learn the average of two art forms and serve neither.

### 8.2 The method: inpaint, not text-to-image

**`Art\_sliced\01 - Kitchen Essentials\sheet3\32-Serving tray(Curry).png`**
— 212×141 canvas, 206×134 trimmed — is the **only plated dish among 153 named
sprites**. Everything else is cooktops, pans, grinders, dispensers.

A style LoRA on that set learns *"this pack renders hard-surfaced kitchen equipment."*
Asking it to text2img a Baingan Bharta takes the subject entirely from base SDXL while the
LoRA pulls toward metal props — subject contamination, and at 152:1 it is the likely
outcome, not the risk case.

✅ **So the dishes are not generated. They are inpainted into that sprite.** Fixed tray,
fixed pan, fixed 3/4 perspective and lighting; mask only the food. Four problems collapse:

- **Consistency** — tray, handle, rim and lighting identical across all 12. On a belt
  where dishes sit side by side this outranks any single image.
- **Alpha** — the silhouette never changes, so the original's alpha channel is reused.
  The no-alpha limit of diffusion stops applying.
- **Style** — real pack pixels are kept rather than reinvented.
- **Scale** — output is already correct size; no downsample-and-snap pass.

**The LoRA's job changes rather than disappearing:** from *"generate sprites"* to *"make
the inpainted food look painted by the same hand."* Run at weight **0.5–0.7**, never
1.0.

### 8.3 🔒 Dataset invariants — load-bearing, and outside version control

`Art\` is gitignored (`.gitignore:63`), so **both prep scripts live outside git**. These
five rules are the reasoning; the code is reconstructible from them, and has been once.

1. **Resample filter must match the art.** Lanczos for smooth, nearest for flat pixel art.
2. **One upscale factor for the whole set.** Fitting each sprite to the target individually
   produced factors from 2× to 9× — eight pixel sizes in one dataset. Pad every
   sprite into a uniform cell first, then scale once. `--cell 208 --target 1024` = 4×.
3. **Flat background, baked in and named in the caption** — no alpha in training images.
4. **Templated captions, never BLIP/WD14** — automatic captioners are trained on photos
   and would caption this pack as pixel art, which it is not.
5. ⚠️ **Only STYLE words may be constant across captions.** Whatever text repeats in
   every caption becomes what the trigger token means. Captioning 163 images
   *"kitchen equipment"* taught `ramuess` to mean *a kitchen appliance* rather than
   *this pack's rendering* — which then fights every request for food. The subject
   noun varies per image, so it stays bound to the image. **Both the agent's template and
   mine carried this bug and both were fixed.**

### 8.4 Toolchain

**OneTrainer** (Python 3.10–3.13, so 3.11.9 works as-is) → **ComfyUI Desktop**.

❌ **Fooocus was dropped.** It is SDXL-*exclusive* and its README declares limited
long-term support. §7.4's claim that it is merely "an inference UI" understated the
problem: an SD 1.5 LoRA would not have loaded in it at all.

❌ **Kohya_ss was dropped** — it routes through `uv`/`pip` doc files and still
references Python 3.10, i.e. a second Python install for no gain.

### 8.5 State at compaction

| Item | State |
|---|---|
| `ess-v1` LoRA | ✅ trained — 395 MB, 41:42, ~1.0 it/s, loss ~0.017, KOHYA_LORA |
| `ess-v1` captions | ❌ carried the §8.3.5 bug |
| `ess-v2` dataset | ✅ 163 pairs, captions corrected |
| `ess-v2` LoRA | ✅ trained Sep 6 13:38 — 15 epochs, 43:43, loss 0.0172 |
| ComfyUI | ✅ rebuilt, Desktop **0.34.5**, zero custom nodes |
| SDXL checkpoint | ✅ `sd_xl_base_1.0` complete, 6.94 GB |
| The gate | ✅ **PASSED Sep 6** — 12 dishes produced, see §8.6 |

⛔ **The gate, unchanged:** one dish end to end with the v2 LoRA, judged beside
`32-Serving tray(Curry).png`. *Is it usable, and does it look like the same artist drew
it?* Fallback if not: **12 dishes hand-drawn in Aseprite, ~6 h**, already costed
([RecipeList.md](RecipeList.md) §8).

### 8.6 ✅ The gate — passed Sep 6 2026, and the two bugs on the way

**Outcome: 12 plated dishes, style-consistent, alpha bit-exact to the source sprite.**
The Aseprite fallback (12 dishes, ~6 h) was not needed.

#### The first bug was resolution, not the host

The pipeline failed twice with saturated neon smear, and the second failure — on a
clean ComfyUI 0.34.5 with zero custom nodes — fired the stop-and-hand-back trigger for
a **host-level fault**. It was not host-level.

The diagnostic fed SDXL a **212×141** image, which is a **26×17 latent** against
SDXL's native 128×128. That produces neon smear on any machine. The earlier
*"txt2img clean, img2img corrupt"* isolation had run txt2img at 1024 and img2img at the
sprite's native size — **it varied resolution and code path together and attributed
the result to the code path.**

🔒 **The fix was one file.** Inference must mirror training: feed the
**1024×1024 padded canvas that already exists in the training set**
(`Art\_lora\datasets\ess-v2\sheet3_32-Serving_tray_Curry_.png`), not the raw sprite.
§8.3's *"one upscale factor, pad into a uniform cell"* invariant was written for the
dataset and never carried across to inference. **It applies to both.**

⚠️ The rebuild that preceded this changed node environment *and* version at once,
so it proves nothing; the same failure signature appears in the pre-rebuild sample at the
same resolution. The rebuild was probably unnecessary.

#### The second bug was the mask, and it was the interesting one

First pass: 7 of 12 dishes came out as brown chunky curry regardless of prompt. The
diagnosis offered was a LoRA colour attractor. **It was the mask.**

The food mask covered **27.8%** of the sprite — a conservative ellipse leaving a ring
of the *original curry's gravy* all around it. That brown is **source pixels, composited
back in by us**; the model never had the chance to paint it.

✅ **Fix: segment the cream rim and flood-fill the bowl interior** rather than scaling
an ellipse — the bowl is not elliptical. Coverage went 27.8% → 45.3%, and every
colour-blocked dish improved.

🔒 **And composite from source, never round-trip.** `SetLatentNoiseMask` steers
denoising; it does **not** preserve unmasked pixels — the whole frame still goes
through VAE encode → decode → downsample. Building the output as
`where(mask, generated, source)` with the source's own alpha makes tray, rim, handle and
silhouette **bit-exact by construction** instead of something to re-verify twelve times.

#### What remains true

⚠️ **The LoRA renders warm tones and cannot paint white or green.** 7 of 7
warm-target dishes landed; **0 of 5** pale targets did (Idli, Veg Momo, Beans Poriyal,
Palak Aloo, Risotto). Enlarging the mask gave the model the whole bowl and it filled every
one of them warm anyway. Untried levers: LoRA weight at 0.30–0.40 for pale dishes, or
a retrain on the now-larger 241-image set. **User's call: accepted as-is, recolour
later.**

### 8.7 🔄 The v3 retrain — **RUN, and its colour premise was wrong**

*Kept for the reasoning. The retrain happened and fixed two real dataset defects; the colour claim it also carried did not survive measurement — see §8.8. The "four dishes may cost nothing" note at the end proved wrong too: none of the four were usable.*

**Why, and why not.** Not for more data — the image count does not change
([RecipeList.md](RecipeList.md) §8.5). For **captions**: ~78 of 163 carry a bare
number as their subject noun, so half the set teaches the trigger nothing but "warm
kitchen object."

⚠️ **It will not fix the colour bias.** Measured across the current dataset:

| | green | white/pale | warm |
|---|---|---|---|
| `ess-v2` training pixels | **3.6%** | 5.3% | 56.9% |

The model has already seen 3.6% green and still cannot paint green. **Re-captioning
changes no pixels.** Expect better subject/style separation, not better colour.

🔒 **One blocker in the tooling.** `Art\_lora\tools\lora_prep.py` line 34 is
`SUBDIRS = ["sheet1", "sheet2", "sheet3", "props"]` — hardcoded, and the typed folders
are not in it. A naive re-run rebuilds **the same numeric captions**. Two fixes needed:
point it at `Ingredient/`, `Container/`, `Cooking Oil/`, `Utensil/`, `Final Recipe/`,
`props/` (**never** the sheets — they are duplicates now and would double every image),
and make the name parser strip both the `NN-` prefix **and** the subcategory segment, so
`14-Primary-Okra.png` captions as `Okra`.

**The plan, in order:**

| Phase | What | Time |
|---|---|---|
| 1 | LoRA weight test at **0.30–0.40** on one pale dish — the untried lever, and it targets the actual defect | 10 min |
| 2 | Fix `SUBDIRS` + name parser, rebuild as `ess-v3` | 15 min |
| 3 | Train `ramuess-ess-v3` | ~45 min, unattended |
| 4 | Verify four dishes that may already exist | 10 min |
| 5 | Generate **24** dishes with v3 | ~90 min |

**24 = 12 regenerated + 8 new cuisine + 4 from [PropList.md](PropList.md) §4.** All 12
existing dishes are regenerated deliberately: **a belt row must come from one model.** The
tray is bit-exact regardless, but the food would drift, and that is the part players look
at.

~~⬜ **Chai and Coffee are excluded** — blocked on the vessel.~~ ✅ **Resolved Sep 6, 22:45 IST** — both drawn by hand, RecipeList §7.0 and §8.9a.

🟡 **Four dishes may cost nothing**, pending a look: Naan →
`Final Recipe/02-Bread` · Coconut Chutney → `Container/07-Chutney-Coconut` ·
Pesto → `Container/08-Chutney-Green` · Sticky Rice →
`Ingredient/20-Secondary-Rice`.

### 8.8 ✅ Colour — four levers, four measurements, and the answer was in the prompt

The v3 LoRA trained clean (2,445 steps, matching v2 exactly via a `balancing` correction
from 2.0 to 2.91 against a 112-image set). It fixed two real defects: ~78 captions whose
subject noun was a bare number, and a **27% duplicate-equipment set** — all 44
`props/` sprites also existed in the sheets, so `ess-v2` trained on them twice.

⚠️ **It did not move colour at all**, and neither did anything else:

| Lever | Range tested | Result |
|---|---|---|
| LoRA weight | 0.30 – 0.60 | mean ΔRGB 38–54, **median hue moved 0°** |
| Denoise | 0.70 – 1.00 | desaturates, but into a **bimodal mottle** — half the pieces flip, half don't |
| Captions (`ess-v3`) | full retrain | pale% 1.2 / 8.9 / 28.7 vs v2's 1.9 / 12.7 / 26.9 — **noise** |
| Explicit colour words | — | **already in the prompt the whole time, and ignored** |

That last row settled it. Recovered from ComfyUI metadata on the raw frames:

```
ramuess, Serving tray (Idli), three white steamed rice cakes, smooth domed discs,
matte white, smooth shaded game asset, ...
```

**The prompt says "white" twice and the output is orange.** This was never a conditioning
gap; it is an explicit instruction being overridden. Final generated set: **28 of 28 with
median hue in the warm band, 9–27°.**

✅ **So colour was moved off the generation path entirely.** `Art\_gen\tools\recolour.py`
applies a deterministic HSV transform to the food region only — region derived
empirically as *pixels differing from the source tray*, which by the composite rule **is**
the inpainted set, so it needs no mask-alignment arithmetic. Value is **median-anchored**
(`v' = target + (v - median) * contrast`) so shading survives; strength is feathered across
the same 2px as the mask; parameters live in `recolour_params.json`, not in code.

⚠️ **Known limit, accepted deliberately:** one region, one transform. A dish whose
garnish contrasts with its base (Coconut Chutney, Veg Momo, Risotto) washes the garnish
toward the base colour, and no parameter fixes it — it needs region segmentation.
Declined four days from the FTUE gate: it shows on 3 of 28 at sprite scale, and the fix is
new code with a new failure mode.

🔥 **The parameter lesson:** the first table set the *leafy* dishes highest
(`sat_scale` 0.85 / 0.80) and they came out neon, while Beans Poriyal at 0.75 read
naturally. Spinach dishes are the **darkest, most muted** greens on the list — the
table had it backwards. Retuned to 0.55 / 0.58 with `median_target` 0.40 / 0.42.

### 8.9 🔒 Four folders hold servings — only one is canonical

⚠️ **Read this before touching anything under `Art\_gen\`.** Four folders hold
servings — 80 files between them — and the names do not say which one ships.

| Folder | Files | Status |
|---|---|---|
| **`dishes-final\`** | **30** | ✅ **CANONICAL — this is the deliverable.** 18 straight from `dishes-v3\`, 10 palette-corrected, **2 hand-drawn drinks** |
| `dishes-v3\` | 28 | 🗃️ Archive — pre-recolour generation output |
| `dishes-v3-recolour\` | 10 | 🗃️ Archive — the corrected 10 only, before assembly |
| `dishes\` | 12 | 🔒 **READ-ONLY.** The batch accepted Sep 6 afternoon, from `ess-v2`. Superseded, kept as fallback |

🛑 **`Art\_gen\dishes\` is never an output target.** Two separate sessions
independently mistook its contents for corruption and prepared scripts to overwrite it;
neither ran, but the second one only stopped because a permission prompt intervened. The
guard is now **structural, not documentary**: `run_dish.py` and `recolour.py` each define
`PROTECTED` and refuse that path, exiting before any generation work. **Any new tool that
writes sprites must define its own — the guard does not inherit.**

⬜ **Nothing outside `Art\` references any of these yet.** Wiring the belt to
`dishes-final\` is [Plan.md](Plan.md) item 11's job, and until it happens the canonical
folder is canonical only by this table.

**Tool inventory, `Art\_gen\tools\`:** `run_dish.py` (now with `--lora-weight`,
`--denoise`, and a **required** `--out-dir` — it previously defaulted to the protected
folder) · `recolour.py` + `recolour_params.json` · `composite_check.py` ·
`gate_workflow_template.json`, still at its committed 0.6/0.6 and 0.7 because both new
flags patch the in-memory dict only.

#### 8.9a ✅ The cup — hand-drawn, and the one asset with no way back

The FTUE drinks are **not generated**. The pack contains no cup, glass or mug, and
generating one would have broken every tool in the pipeline at once — the reasoning is
in [RecipeList.md](RecipeList.md) §7.0 and it is the useful half of this entry. The two
sprites were drawn by hand and padded to the dish canvas.

| | |
|---|---|
| Canvas | **212×141**, matching all 28 generated dishes |
| Solid silhouette | x 68–142, y 43–97 — **identical in both files** |
| Anchoring | **centre-centre**, on the pans' own centre (105.0, 70.0) |
| Difference between them | **226 px**, x 81–109 y 57–66 — the liquid ellipse, nothing else |
| Scale | solid width 75 px against the pan's 203 — about **37%** |

⚠️ **The cup's base is at y=97; the pans' is at y=136.** That is what centre-centre
anchoring means for a small object beside a large one, and it is correct for a
centre-pivot renderer. **If the belt seats sprites on a surface line instead, the cup
will read as hovering** and needs a per-item vertical offset in code — one value, not an
art change. [Plan.md](Plan.md) item 11 owns that call.

✅ **`getbbox()` now equals the silhouette — it did not before.** Both cups carried
strays at **alpha ≤ 16**: invisible, and in `tray-coffee` separated from the real art by
an entirely empty row. The first padding pass anchored the contact line to that dust and
landed the cup 4 px high and 5 px right. Anchoring is now measured at **alpha > 32**, the
same threshold the pans are measured at.

The dust was then removed — **42 px from chai, 55 from coffee** — by a rule about
**detachment, not faintness**: a pixel goes only if it is ≤ 32 *and* has no 8-neighbour
above 32. Every pixel above alpha 32 is byte-identical to the drawing, the liquid region
is untouched at 226 px, and the two cups now differ on **4 alpha pixels**, down from 81.

⚠️ **Never run that rule over the generated dishes.** A flat threshold, or a rule
about faintness, would eat their edges: the pans carry a full antialiasing ramp with
**638 of their 727** low-alpha pixels touching solid, against the cups' **1 of 43**. That
ratio is the test for whether low alpha is an edge or debris — not the alpha value.

⚠️ **There is no empty-cup sprite, deliberately.** A third drawing existed
briefly as `sources\cup-empty.png`, but it was brimful of dark liquid with no interior
wall showing — not the same vessel state as the pair, and a mask derived from it would
have covered the rim. It was deleted Sep 6 2026, 22:54 IST along with the `sources\`
folder, rather than left as a file whose name lied. **Nothing needs it:** both drinks are
finished sprites, so no vessel has to be inpainted into. If an empty cup is ever wanted
on screen, it is `tray-chai.png` with the cream ellipse left as bare ceramic.

🔴 **There is no editable source.** The `.aseprite` was deleted after export. Unlike
the 28 generated dishes, which can be rebuilt from their raw ComfyUI frames, these two
PNGs are the only copy of the work — in a tree that is gitignored.

### 6.15 ✅ Rounds 13–14 landed · the zones and the price label, Sep 8 2026

**Round 13 — radial reach replaced by four assigned belt zones.** Commit `69c6970`,
private **v1.23.0**. `slotReach`'s radial test is gone; acceptance is membership of one
assigned, non-overlapping stretch of belt per station. Verified by independent
recomputation from `beltPath`, not by trusting the agent's table:

| Zone | Range | Length | Resolves to | Margin over next-nearest slot |
|---|---|---|---|---|
| #1 top-left | 176 → 441 | 265 | `slots[0]` | 148.6 vs 308.7 |
| #2 top-right | 481 → 956 | 475 | `slots[1]` | 199.8 vs 343.7 |
| #3 bottom-right | 996 → 1471 | 475 | **`slots[3]`** | 199.8 vs 343.7 |
| #4 bottom-left | 1511 → 1776 | 265 | **`slots[2]`** | 148.6 vs 316.7 |

Coverage 92.5%, zero overlap, seams exactly 40 wide, outer ends landing on 176 and 1776
so nothing spills onto a fridge stub. **The bottom-two swap was handled by derivation,
not by pasting the table** — `slots` is ordered TL, TR, BL, BR while the belt visits
bottom-right first, and nearest-slot-to-`posAt(midpoint)` gets this right on its own.

🔑 **The strongest evidence is structural, not behavioural.** `tapSlot` no longer holds a
radius bound of any kind: `bestDist` seeds at `Infinity` and `Math.hypot` survives only
as a tie-break *among dishes already inside the zone*. There is no radial term left in
the acceptance path to fail.

⚠️ **The agent found a second reader of `slotReach` that the handover did not know
existed** — `syncSlots`' filled-highlight. Left alone it would have lit a station
"filled" for a dish `tapSlot` would then refuse. Switched to the same zone test.

**Round 14 — the locked slot shows its price.** Commit `222cffc`, private **v1.24.0**.
The bare centred padlock becomes a raised padlock (fontSize 40 → 22) over a two-line
"Unlock for" / "<n>[coin]" label, contained against ItemSlot1.png's inner well.

`LOCK_CONTENT` is derived at runtime from `slotBox`/`slotWell`/`labelGap`, not
hardcoded — independently recomputed as left −48.5, right +48.5, top −50, bottom +48,
i.e. **97 × 98 with `centerY` −1**. The well is asymmetric top-to-bottom, so the stack
centres on the content rect, not on the slot. Measured slack 14.39 left/right and 14.00
top/bottom; line 1 is the widest element at 68.2. Verified at a forced 3-digit cost
(125 → line 2 grew to 42.5, no overflow) and reverted.

⚠️ **What round 14's measurement could NOT settle.** The stack centres using
`lock.height`/`line1.height` — Pixi `Text` **bounds**, which include ascent and descent.
The open hypothesis was that the emoji's *ink* sits low inside its *box*; a bounding-box
measurement cannot see that. "No discrepancy survived" is true of the geometry and
silent on the hypothesis. The offset scales with font size and the padlock shrank
40 → 22, so whatever it was is now under half — and the user confirmed live that
everything reads correctly. Closed by observation, not by that measurement.

**Two latent holes, neither reachable today, both routed to round 15:**

1. `SLOT_ZONES`' `bySlot[bestSlot] = zone` has **no bijection check**. A slot
   *reposition* (not the reorder the comment covers) could put two zones on one slot,
   leaving another index `undefined` while TypeScript still types it `SlotZone` — a
   mid-round `TypeError` on the first tap of that station.
2. Round 14's `totalHeight` is **never clamped** to `LOCK_CONTENT.height` (70 against
   98 today). A later font-size raise overflows the well silently, breaking round 6's
   containment rule with no error anywhere.

### 6.16 ✈️ Round 15 in flight — what to check its return against, Sep 8 2026

Scope: **Kitchen Mode becomes the primary play action.** Not a mechanic round.

The user's decisions, Sep 8: Kitchen Mode ships public once the **FTUE node and Node 1**
are complete; TEST MODE becomes **Play Game**, the tower game becomes **Challenge Mode**
and keeps its leaderboard statistics without losing them; **boss mode is the last level
of each node**; **rounds are not linear** — each level carries its own wave target and
each node its own level count.

Acceptance items for the return:

1. `Play Game` primary and topmost, `Challenge Mode` below it, `The Kitchen` and `Ranks`
   untouched, **no TEST MODE button anywhere**.
2. Both buttons reach their modes live; the tower game plays to its end screen unchanged.
3. Guard A fires at **module load** with a message naming the colliding slot — proven by
   a temporary forced collision, then reverted to an empty `git diff`.
4. Guard B shrinks the padlock to fit rather than overflowing — proven by a temporary
   oversize, then reverted. Slack still ~14 on all four sides at cost 50.
5. `slotUnlockCost`'s comment matches `attemptUnlock`'s real behaviour. **Comment only —
   the round 9 guard is NOT restored this round.**
6. The agent's reading of the menu footer copy, reported and not silently rewritten.
7. `tsc --noEmit` and `vite build` clean; ten runs, zero exceptions.
8. Review and public **both still 1.7.0**.

⚠️ **`'testbelt'` stays as the phase string** — a rename buys nothing player-visible and
touches three files on the critical path. `store.ts`'s comment calling it *"never
deployed public-facing content"* becomes false with this round and is corrected in place.

🔒 **Explicitly not in this round:** leaderboard config (irreversible, separately
sequenced), analytics `mode` properties, the FTUE cold-open, and restoring round 9's
unlock guard.
