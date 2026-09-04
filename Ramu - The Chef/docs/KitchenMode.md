# KitchenMode — the belt game view as a second mode

**Last updated:** Sep 4 2026, 23:10 IST (read from the system clock)
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
