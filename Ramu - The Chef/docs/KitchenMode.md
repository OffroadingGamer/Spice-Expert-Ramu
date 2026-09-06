# KitchenMode — the belt game view as a second mode

**Last updated:** Sep 6 2026, 17:25 IST (read from the system clock)
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

### 8.7 The v3 retrain — planned Sep 6 2026, not yet run

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

⬜ **Chai and Coffee are excluded** — blocked on the vessel, RecipeList §7.0.

🟡 **Four dishes may cost nothing**, pending a look: Naan →
`Final Recipe/02-Bread` · Coconut Chutney → `Container/07-Chutney-Coconut` ·
Pesto → `Container/08-Chutney-Green` · Sticky Rice →
`Ingredient/20-Secondary-Rice`.
