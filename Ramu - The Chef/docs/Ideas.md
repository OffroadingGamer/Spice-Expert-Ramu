# Ideas — parked until the game is live and stable

🛑 **NOTHING IN THIS FILE IS A WORK ITEM.** User's instruction, Sep 12 2026:

> *"The following prompt is to be only done after going live once with the updated game
> version. Once we are live next time, we can start with this, until then log them in a
> document 'Ideas.md'. Not to be acted upon until we go live."*

✅ **The gate — UPDATED Sep 13 2026.** Originally: *"the current build ships, reaches
`public`, goes stable, and the marketing agent's ads are running."*

- ✅ **Shipped and public:** v1.69.0 on all three tags since Sep 12.
- ✅ **Stable:** the iOS boot race (v1.68.0) and the block-1 onboarding cliff (v1.69.0) are
  both closed.
- 🔴 **Ads are NOT running, and may never run.** RUN's `run` cross-promo network is wired
  but **not live in production for any account**, which killed the campaign's whole thesis.
  See the record's *"What RUN's marketing system actually costs"* section.

⚠️ **So the ads clause can no longer gate this file** — it is waiting on something outside
our control that may not arrive. **Two of three conditions are met; treat the gate as open
for scheduling purposes, and confirm with the user before starting any item below.** Do not
let a handover quietly pull one in unasked.

---

## 1. Narrative polish — Ramu's story (dialogue-box pass)

### The premise, in the user's words

A young aspiring Indian chef who must overcome the culinary rush while upgrading his arsenal
by earning more. **Every walk-out is money wasted, and Ramu wouldn't want it that way.**
He starts at a tapri/cafe selling beverages and works his way up to a fortune, stacking
overtime.

✅ **Why this fits the game that already exists rather than being pasted on:** the lose
condition is already *escapes*, not damage — a dish that walks out is literally lost income.
The premise gives the existing fail state a reason, which is the cheapest kind of narrative.

### Presentation

Two-part dialogue box, **tap to proceed**. Ramu's portrait on the **right**; the text box
spans **left to centre**.

### The beat inventory — derived from the code, not estimated

`blockForLevel()` puts **10 levels in every block**, blocks 1–8 covering levels 1–80, with
**level 81+ falling into block 9, whose label is already `OVERTIME`**. `isBossLevel()` is
`(level - 1) % 10 === 9`, so bosses sit at **10, 20, 30, 40, 50, 60, 70, 80** — eight of them.

| # | Beat | Trigger | Boxes |
|---|---|---|---|
| 1 | Opening — low on funds, still hopeful | cold boot, before the `place0` beat | **2** |
| 2 | First rush survived | wave 1 cleared, before the upgrade beat | **1** |
| 3 | First upgrade bought | after the `upgrade0` beat | **1** |
| 4 | New district | entering blocks 2–8, i.e. after bosses 10/20/30/40/50/60/70 | **7** |
| 5 | Overtime reached | after boss 80, entering level 81 | **1** |
| | | **Total** | **12** |

⚠️ The user's points 4 and 5 are **one mechanism**, not two: "after wave 10 when 11 loads"
is simply the first of the seven district transitions. The eighth boss (level 80) leads into
Overtime, which gets its own distinct thank-you beat instead.

### 🔥 Design notes worth keeping

✅ **The district beat already has a home.** The final round built a **2.5 s backdrop
crossfade with Ready locked** at exactly the block boundary (`towerScene.ts`,
`BACKDROP_FADE_S` / `BACKDROP_LOCK_S`, gated on a tracked block-id change). A dialogue box
there costs **no new dead time** — it occupies a pause that already exists. Any
implementation should reuse that trigger rather than inventing a second one, and the three
situations that trigger distinguishes (game start / real change / late load) are already
exactly the distinction a dialogue needs.

⚠️ **The opening two boxes sit in front of first play.** The jam metric is unique plays,
and the entry now boots straight into Challenge Mode specifically to remove friction before
the first tap. Two taps of dialogue put some of it back. Worth measuring rather than
assuming — and worth considering making the opening skippable while the district beats are
not.

⚠️ **Weight the writing toward the early beats.** Most players will never see block 5+.
Beats 1–3 and the first two district lines carry nearly all the actual player-facing value;
the later lines are for the few who go deep.

⚠️ **Avoid the standalone word "Stockpot"/"Saucepot" split.** RUN's moderation filter
rejects the bare three-letter word for a cooking vessel; it is already a known trap for
changelog text. Dialogue ships inside the bundle rather than through moderation, but keeping
the vocabulary clear of it costs nothing and removes a whole class of surprise.

✅ **Each district line can name its own cuisine.** `blocks.ts` already labels them:
CAFE, NORTH INDIAN, SOUTH INDIAN, ITALIAN, NORTH EAST, NE FUSION, ITALIAN FUSION,
DESI FUSION, OVERTIME. Seven lines that each name a real cuisine read as progression;
seven interchangeable hopeful lines read as filler.

### ✅ Chosen dialogue — SELECTED Sep 12 2026

Three voices were drafted per beat — **A warm & plain**, **B wry & light**, **C lyrical**.
The user selected **A as the spine, with B at two deliberate points and C for the finale**.
**12 boxes.**

| # | When | Voice | Line |
|---|---|---|---|
| 1 | Opening | A | "Some days the tin is empty. Today's one of them." |
| 2 | Opening | A | "But the stove still lights. That's enough to start." |
| 3 | Wave 1 cleared | A | "They came back for seconds. Did you see that?" |
| 4 | First upgrade bought | **B** | "New gear, same nerves. Let's find out." |
| 5 | → Block 2 NORTH INDIAN | A | "A real dhaba. Tandoor and all. I'm not dreaming?" |
| 6 | → Block 3 SOUTH INDIAN | A | "They want dosa now. My wrist is ready." |
| 7 | → Block 4 ITALIAN | **B** | "They want Italian. I watched one video. We're fine." |
| 8 | → Block 5 NORTH EAST | **B** | "Smoked chilli. I'll cry through this whole shift." |
| 9 | → Block 6 NE FUSION | A | "I stopped copying recipes. I'm writing them." |
| 10 | → Block 7 ITALIAN FUSION | A | "Two kitchens, one plate. Nobody taught me this." |
| 11 | → Block 8 DESI FUSION | A | "This one's mine. Every bit of it." |
| 12 | → Overtime (level 81) | **C** | "Every plate tonight had two pairs of hands. Thank you." |

Box 5 fires after the boss at level 10, box 6 after 20, and so on to box 11 after level 70;
box 12 follows the level-80 boss.

#### 🔴 The tonal breaks are deliberate — do not normalise them

⚠️ **Rows 7 and 8 are wry on purpose, sitting among warm ones.** Seven earnest boxes in a
row is exactly where sincerity curdles into syrup, and blocks 4–5 (Italian, North East) are
where Ramu is most plainly out of his depth — so the self-deprecation is *characterisation*
at the one moment it's true, not an inconsistency. Anyone later "fixing" 7 and 8 to match
the surrounding voice will flatten the arc. Same for **row 4**: "same nerves" keeps him human
at the beat where he could tip into triumphant, immediately after his first win.

✅ **The A-voice arc is doing work across rows 9–11**: *copying* recipes → *writing* them →
*owning* the menu. Those three must stay in that order even if individual wording changes.

✅ **Row 3 turns to the player** — "did you see that?" — which is what makes row 12's
thank-you land 80 levels later. They are a matched pair; changing one without the other
costs the payoff.

➕ Row 12 is the only line reaching for something, and it earns it: "two pairs of hands"
says the thing without stating it.

---

## 2. Main menu revamp — background art + clean UI behaviours

User request, Sep 13 2026. Same gate as everything else in this file: **after the build is
live and stable.**

The menu is now a screen players reach **after** a run rather than before one — the entry
boots straight into Challenge Mode (`main.tsx`), and Main Menu is only reachable by exiting,
winning or losing. That changes what it is for: it is no longer a front door, it is the
**between-runs hub**, and it is where Leaderboard and Meta Upgrades live (they are reachable
from nowhere else, so a first-time player has no gem-spend path until they exit once).

- **Background art** — the nine block backdrops already exist at 720×1280 under
  `jam-entry/public/` (`bg-block-*`). A menu treatment could reuse one rather than commission
  new art, which also visually promises the cuisines the player has not reached yet.
- **Clean UI behaviours** — the current menu is a plain vertical button stack. Worth
  revisiting: entry/exit transitions, what the primary action should be for a returning
  player (Retry the last run? Continue? Meta Upgrades?), and surfacing gems earned so the
  spend path is discoverable.
- ⚠️ **Do not regress the boot flow.** Booting straight into Challenge Mode exists to remove
  friction before the first tap, which is the jam metric's whole funnel. Any menu work must
  leave that path untouched.

➕ Sensible pairing with §1's dialogue pass — both are presentation-layer work on screens
the player sees between runs, and the same art direction serves both.

---

## 3. Prop game feel — proposed Sep 13 2026, no option chosen yet

User: *"Props are lacking game feel, propose ideas that can be implemented that would make
them feel more robust and functioning."* Six proposals were put to the user; **none has been
selected**, so this is a menu, not a plan.

| # | Idea | Cost | Why it works |
|---|---|---|---|
| 1 | **Fire recoil** — a brief scale/offset punch away from the target on each `shot` event | Low | The single biggest "is this thing alive" signal; props currently fire with no body movement at all |
| 2 | **Muzzle puff** — a steam/sizzle wisp at the fire point, fading over ~200 ms | Low | The cooking-native version of a muzzle flash; sells *kitchen* rather than *turret* |
| 3 | **Idle simmer** — a slow 2–3 px bob or drifting steam when not firing | Low | Static sprites read as scenery; motion at rest reads as staffed |
| 4 | **Placement thunk** — squash-and-settle plus a dust/flour ring on place | Low | `sfx.place()` already fires with no visual partner |
| 5 | **Upgrade surge** — a one-off flare and a held brighter tint as the level pips increment | Medium | Upgrades currently change numbers more than they change the object |
| 6 | **Target-lock tell** — the prop leans/turns toward its current target | Med–High | Strongest "it's thinking" cue, but needs facing art or rotation that may fight the top-down look |

✅ **Recommendation: 1, 2 and 4 first.** All cheap, all hooked to events that already fire
(`{ type: 'shot' }`, placement), and together they cover the three moments a player actually
looks at a prop. **3** is the best value after that. ⚠️ **Hold 6** — it risks fighting the
top-down illustration style, which is a bigger conversation than a polish round.

---

## 4. Progressive pad unlocking — 🔴 CHANGES THE BALANCE BASELINE

User's rule, Sep 13 2026: rows 3 and 4 locked until the block-1 boss clears → row 3 unlocks
→ row 4 stays locked until wave 20 clears → everything open from wave 21. Must reset on
retry / loss / exit / win so no state leaks between runs.

**The pad rows, from `config.ts`'s `PADS` array** (this mapping is not written down anywhere
else):

| Row | y | Pad indices | Bonuses | User's rule |
|---|---|---|---|---|
| A | 195 | **0, 1** | none | always open |
| B | 485 | **2, 3, 4** | fireRate / range / damage | always open |
| **C** | 795 | **5, 6, 7** | damage / range / fireRate | locked until wave 10 |
| **D** | 1090 | **8, 9** | none | locked until wave 20 |

🔴 **Why this is not a UI change.** `scripts/simulate.ts:29` states its own build priority:
*"the six bonused center pads (B/C rows) first"* — so **every profile places on row C from
wave 1**, and `maxed-meta` (the primary case, all ten pads, which must lose between levels
85–110) would have 5 pads for waves 1–10 and 8 for 11–20. It will lose **earlier**. The
**35 / 36 / 11 / 4 / 90** baseline (v1.69.0; it was 35/34/6/4/90 before the block-1 retune) becomes invalid and must be re-derived, not re-asserted.

✅ **`sim/engine.ts` does NOT need unsealing.** Put the unlock rule in `config.ts` and enforce
it in the two non-sealed callers — `actions.ts::placeTower` and `simulate.ts::nextFreePad`.
One rule, two consumers, so the simulator and the game cannot drift apart. ⚠️ A UI-only lock
would be worse than nothing: the sim would then be validating a game nobody plays.

⚠️ **Budget tuning iterations for this, not a single round.** It was deliberately held back
from the launch build for exactly that reason.

---

➕ **Retention note (Sep 17):** RUN notifications are **local** — `scheduleAsync()` runs on the
player's device while they play; there is no server push and no way to reach players who
have already left. A reminder shipped now reaches only players who open the new build, and
only in the RUN app (web no-ops). Worth building post-jam for the campaign's installs; it
cannot recover the jam's departed players.

## 5. Small hardening debts — carried from the launch rounds

- 🔴 **`registerEngine(null)` sits late inside `towerScene.ts`'s `destroy()`** — after
  `trackRunEnd`, two `clearTimeout`s, a `store.patch` and `app.ticker.remove`. `GameCanvas`'s
  cleanup wraps `scene.destroy()` in `try/catch`, so **if anything above that line throws,
  `engineReady` stays `true`**, the next registration is a `true → true` no-op rather than a
  real transition, and **the v1.62.0 blocker returns**. Moving the call to the top of
  `destroy()` makes the teardown half unconditional. Cheap; worth doing.
- **`store.ts`'s phase comment is stale** — it still claims the build must stay private until
  Kitchen Mode is complete. Round A2 gated that mode behind `devModeEnabled()` (`?test=1`),
  and the game shipped public on Sep 13 regardless.
- ✅ **`67c5452`'s swept-in rename is CLOSED, no action.** The zero-content
  `BuildSheet → StationRail` rename riding in a docs commit was left as-is. Rewriting
  published history after launch has no upside, and `git log --follow` traverses it correctly.

---

## 6. Progression gauge + Chef Ramu — proposed Sep 13 2026, for speculation

User, after playtesting 1.69.0: *"There's no visual progression system."* Three parts,
**decoupled so each can ship alone.** Sequencing across §6 and §7: **scroll → gauge →
chef** — cheapest first, and each owns a different screen region.

### 6a · The service gauge

A hollow vertical cylinder, bottom-left, filling with **dishes served this wave**; resets
each wave. Two marks:

- **SAFE line** = minimum served to survive = `units − (lives − 1)`. Derived, not authored;
  it moves with lives. Boss waves weight by `livesCost` (stag = 3), so use lives-weighted
  units, not headcount.
- **Top** = every unit in the wave.

Amber → green as fill crosses SAFE; red pulse if the remaining units can no longer reach
it. ✅ **No engine change** — `towerScene` already counts deaths per substep for the coin
popups. ⚠️ **Label it SAFE, not CLEAR**: it is a survive line, not a no-damage line, and
that distinction is the whole lesson of the walkout system.

🔴 **Measure the left gutter before designing.** `Hud.tsx`'s bottom column and the 88px
rail own the bottom and right. On a 403px phone the gauge lives in whatever horizontal slack
the height-fit board leaves — real on tall phones, near zero on short ones. Retro 99.

### 6b · Chef Ramu (UI sprite)

Bottom-left, in front of the gauge's base; dialogue along the bottom. ⚠️ **Supersedes
§1's "portrait on the right, text left-to-centre."**

🔥 **Layered sprite — body and face as separate images.** The spec implies 9 costumes ×
3 voices × 2 moods = 54 sprites. Layered it is **9 bodies + 4 faces = 13 assets**, and the
face is the same image every time: consistency by construction, not by prompt discipline.

**Faces:** A-warm (default idle), B-wry, C-moved — shown while a dialogue line of that
voice is up — and **W-worried**, the idle when `highTensionLatched` fires (`actions.ts:158`,
lives under 30%; the trigger already exists and already drives `service_high`). Crossfade
~400 ms on any change.

**Costumes, one per block** (rides `blockForLevel` directly):

| Block | Label | Attire |
|---|---|---|
| 1 | CAFE | cafe worker, worn — the rags |
| 2 | NORTH INDIAN | dhaba |
| 3 | SOUTH INDIAN | local chef — veshti, shoulder towel |
| 4 | ITALIAN | Indian-Italian — toque over kurta |
| 5 | NORTH EAST | dhoti and vest |
| 6 | NE FUSION | NE base, elements carried forward |
| 7 | ITALIAN FUSION | Italian base, Indian elements |
| 8 | DESI FUSION | the composite — everything earned |
| 9 | OVERTIME | royal — the maharaja chef |

**Swap slot: the existing 2.5 s backdrop crossfade with Ready locked** (`BACKDROP_FADE_S`).
The body layer crossfades in the same window — zero new dead time, the same argument §1
makes for dialogue.

**Art route:** one canonical character sheet first (front three-quarter, neutral), then
costumes and faces derived against it through `Art/_lora`. Ramu is original art — no
third-party licence question — but consistency needs a locked reference, not nine
independent prompts. **Effort: two art rounds, one to two implementation rounds.**

✅ **ART DONE — Sep 14 2026.** `Art/_gen/chef-final/`: **9 bodies + 4 faces + `scroll.png`**, 14
files, 7,003 credits, all 1024² RGBA with corners at alpha 0. Verified by Central: same
person across all nine bodies; head pixel-locked (bbox identical on cafe / north-indian /
north-east; the toque and turban bodies extend the bbox upward only).

🔥 **How the layering actually works:** each face is a **1024² canvas with an eyebrow-to-jaw
band at (329, 296)–(750, 585)** and nothing else — no hair, no headwear. Composite it at
(0, 0) over any body and it lands. Full-bust faces were tried first and broke on the
Overtime turban; the band crop is the fix and it must not be widened.

⚠️ **Sizing finding — measured, and it changes the spec:** at **160 px** all four faces are
distinguishable; at **96 px only W-worried reads** against A-warm — wry and moved collapse
into warm at that size (the face band is ~27 px tall there). So: the **idle sprite by the
gauge** may draw at ~96–120 px because it only ever switches warm ↔ worried; the
**dialogue portrait** (§1 / §6c) must draw at **≥ 160 px, or as a head-only crop** — which
the aligned faces make a one-line crop. Do not ship a 96 px portrait expecting three
expressions to carry.

➕ Known gaps, not blocking: Desi Fusion lacks the NE vest its prompt asked for (dropped in
both takes; still coherent). `rundot generate` has **no reference-strength flag**; expression
range came from explicit brow/mouth/eye prompting.

### 6c · Dialogue

Already specified in §1 (12 boxes, voices locked). The chef sprite *is* the portrait — no
separate asset. Opening two boxes skippable; district beats not.

---

### 6d · Implementation plan — APPROVED Sep 14 2026

🔒 **Promotion rule (user, Sep 14):** every round below deploys to **Private only**. Nothing
reaches Review or Public until **Round 4 has succeeded**, and then **human verification
decides** whether the result goes public at all. The jam entry (1.69.0) stays live and
untouched throughout; git and Private deploys do not affect it.

🔒 **Every round:** `npm run balance` must still print **35 / 36 / 11 / 4 / 90** — all of
this is UI and the simulator must not notice · typecheck clean · device check at 403 px ·
no `.png.json` sidecars in `public/` · sealed files untouched.

| Round | Scope | Hooks that already exist | Acceptance |
|---|---|---|---|
| **0** Asset prep | 1024² sources → **320²** (160 px draw × 2 DPR), **uniform scale, no crop** so body/face alignment survives by construction. `body-cafe` + `face-warm` in `critical`; the other 8 + 3 in `deferred`, warmed by `ensureBlockAssets()` | `manifest.ts` bundles, `ensureBlockAssets` prefetch | byte sizes recorded (~1 MB total); sidecars absent; `Assets.cache.has('body-north-indian')` before block 2 |
| **1** Dialogue | `data/dialogue.ts` with the 12 lines of §1; store `dialogue`; `DialogueBox.tsx`, tap to advance, Ready hidden while open, 160 px portrait slot left empty; `CONFIG.narrative.enabled`; `dialogue_shown` / `dialogue_skipped` events | opening: `scriptedRunStart()` · wave-1: `towerScene.ts` `e.cleared === 1` · upgrade: `actions.ts` `upgrade0` resolution · districts + overtime: the `priorBlockId > 0` branch inside the 2.5 s `backdropTransitioning` lock | all 12 fire in order in one run; FTUE pulse only after the opening is dismissed; block lock still exactly 2.5 s |
| **2** Chef portrait | `ChefPortrait.tsx`, two stacked `<img>`; body = `blockForLevel`, face = open line's voice → else worried while `lives < startLives × 0.3` → else warm; 400 ms face crossfade; body swaps inside the backdrop fade; **160 px in dialogue, ~100 px idle** (§6b sizing finding) | `trackedBlockId` change; lives in store | 🔴 first task: measure the left gutter at 403 px — idle sprite must not cover pad 8; costume changes at every boundary with no mismatched frame; in-game contact sheet of all 9 |
| **3** Service gauge | per-wave `units = Σ count × livesCost`, `served = kills − killsAtWaveStart`, **SAFE = units − (lives − 1)**; cylinder behind the idle portrait | `waveAt(level).entries`, `engine.state.kills` via `syncStore` | crosses to green on the exact kill where a leak no longer loses the wave — check against the simulator's `balanced` rows for levels 4 and 10 |
| **4** Wave-intro scroll | §7 as written; dialogue wins when both queue | `blocks.ts` slug map, `entry.hpMult`, `bountyMult` | → then **human verification** for public |

⚠️ **Gauge simplification found while planning:** §6a's "red pulse when SAFE is unreachable"
is dead logic — remaining units always equal `units − served − leaked`, so SAFE becomes
unreachable only at the instant the run is lost. **Two states: amber below SAFE, green at
or above.**

⚠️ **Repeat policy (assumption, Round 1):** `ftueActive` is true on *every* run, boot and
Retry alike, so beats 1–4 would replay each run. Spec: **beats 1–4 once per player**
(persisted with the existing save layer), **beats 5–12 once per run.** Override in the
handover if wrong.

**Sequencing:** Round 0 + 1 handed over together (Sep 15), Round 2 Sep 16, Round 3 Sep 17,
Round 4 after judging. Promotion, if approved, as **v1.70.0**.

#### ✏️ Amendment — user playtest of Private 1.71.0, Sep 15 2026

Six annotated screenshots. These override the rows above where they conflict.

**Round 2b (inserted before Round 3) — the dialogue box becomes the FTUE's Ready button.**

| Beat | Was | Now |
|---|---|---|
| 1 | once per player | **every run**, at boot, before `placeFirst`. Visible **Skip** |
| 2 | with beat 1 | **after the first prop is placed** (`placeFirst` resolved). **Tap = start wave 1.** Ready hidden |
| 3 | on wave-1 cleared | on wave-1 cleared, line becomes *"They came back for seconds. Did you see that? **It's time to upgrade.**"* **Stays open through the `upgrade0` purchase** (must not cover the rail); once bought, **tap = start wave 2** |
| 4 | on first upgrade | **wave 4's build phase**, after `place3` resolves — *"New gear, same nerves. Let's find out."* **Tap = start wave 4.** The "Tap a cook to upgrade" toast stays |
| 5–12 | once per run | unchanged; add a visible **Skip** (top-right) and a **"tap to continue ▸"** hint (bottom-right) to every box |

The `dialogueSeen` persistence goes: beats 1–4 ride `ftueActive`, which is already every run.
Ready's own button hides whenever a box owns the moment; the box calls the same `startWave()`.

⚠️ Why the opening didn't show on the user's device: almost certainly `dialogueSeen`
persisted from an earlier Private session — the once-per-player assumption, working as
specified and wrong as a product. Removed.

**Round 2c (user playtest of 1.72.0, Sep 15) — three fixes:**
1. **"Tap a cook to upgrade" toast removed everywhere.** Replaced by a **`Lv↑` marker above
   each placed prop whose next upgrade is affordable** (`coins >= def.upgrades[level-1].cost`,
   the rail's own test), live as cash changes, hidden for the selected pad (the rail shows it)
   and at max level. Every wave, not just wave 4.
2. Dialogue text **moved up** — vertically centred against the portrait, not bottom-hugging.
3. **Skip inside the box**, top-right, legible — it was rendering outside, faint.

**Folded into Round 3 (user playtest of 1.73.0, Sep 15):**
1. **Beat 3's narrowed box must keep the portrait and Skip** — the line wraps inside the
   reduced width; never a one-line strip. (Portrait may drop to ~100 px there.)
2. **Skip = mute.** One Skip silences every later box for the run; **tapping the chef**
   re-enables from the next wave. While muted, beats 2/3/4 fall back to the plain Ready.
   ⚠️ Central's proposal, pending user override: because the idle sprite is hidden on the
   reference phone (39 px gutter), add a **~44 px chef-head button in the HUD top-left,
   always present** — the un-mute tap on every device and Round 4's bubble anchor. Mute
   persists in the save (a player who muted stays muted across Retry).

**Playtest of 1.74.0 (Sep 16) — two decisions, two proposal sets:**
1. ✅ **Dialogue box moves to screen centre.** Same Skip and continue hint; **a tap anywhere
   inside the box advances.**
2. ✅ **Beat 3 first, dock after.** The box opens alone; tapping it shut opens the upgrade dock
   on pad 4. **While the dock is open for a prop, green text above that prop shows the
   post-upgrade values** (`damage × damageMult`, `rate × fireRateMult` from the upgrade step).
   After the purchase, the plain Ready. Beat 3 no longer stays open through the purchase.
3. 📋 **Chef-in-HUD options** (drawn for the user): **A** head as a badge inside the WAVE chip
   (bar stays) · **B** *recommended* — **the service gauge becomes a ring around the 44 px
   head**, amber arc → green past the SAFE tick, bar removed, mute = grey ring, Round 4's
   bubble grows from Ramu · **C** speech tab docked to the board's top-left corner (must be
   measured against the A row). ✅ **User picked B (Sep 16).**
4. 📋 **Prop feedback proposals** (props read as inert): 1 recoil squash on fire (80 ms,
   1.08×0.90) · 2 heat flash, tinted per archetype · 3 projectile trail · 4 idle bob + steam
   only during a wave · 5 dish hit-flash on HP drop · 6 target-lock ring. All scene-side
   (new-projectile diff, `shot` events, HP deltas); no engine change, no art.
   ✅ **User picked bundle 1 + 2 + 3 + 4 as Round 5 (Sep 16)**; 5 and 6 parked.

**Playtest of 1.75.0 (Sep 16) — folded into Round 5 with the prop bundle:**
1. **Bubble trigger icons are too small** (24 px). Dish icons **≥ 40 px with the recipe name
   below each**, left-anchored next to the ring.
2. **The scroll submenu is a grid, closed by default.** Opens only on a bubble tap. One cell
   per recipe: **icon on top, name below**, then pips · bounty · count. **Two columns:** one
   recipe = one cell left-anchored; two = side by side; more = 2×N rows. The scroll art is
   **3-sliced** (left roll · stretched parchment · right roll) so the ends never smear; the
   panel is as tall as its rows, never a thin strip. Blocks 6–9: one cell per archetype with
   both icons and one count.
3. **Upgrade preview goes in a translucent dark bubble** (rounded, `rgba(0,0,0,.7)`), so it
   reads over dishes and projectiles; text colour chosen for contrast against that bubble,
   not against the board.
4. **Something overlaps the top-right speed row on wave 1** (`1x` half-covered by an orange
   element; user reports an FTUE "Shift" float overlapping the WAVE chip). Reproduce at 403
   wide, name the element, fix the layout or z-order.

**Playtest of 1.76.0 (Sep 16) — Round 6, user chose Type 2:**
1. 🔴 **Recoil squash inflated props ~16× and left them there.** `sprite.width = size` gives a
   base scale ≈ 0.06; the tween wrote **absolute** `scale.set(1.08, 0.9)` … `set(1, 1)`. Fix,
   structural: **every tower sprite lives in a wrapper `Container`; all FX tween the wrapper
   (always 1-based); nothing tweens the sprite.** Acceptance rule from now on: **the resting
   state is measured** — scale before first shot == scale after, numerically.
2. **Wave bubble: icons 56 px, persists for the whole wave** (until the next build phase),
   with a **live remaining count per dish** ("Naan 4/9") from the enemy alive-set diff — only
   if the per-archetype attribution is a straight read; otherwise size + persistence alone.

**Playtest of 1.77.0 (Sep 17) — Round 7:**
1. Bubble: **remaining count under each dish icon**, not one collective total.
2. **District dialogue boxes larger, with a `RUSH: <BLOCK>` header line**; portrait nudged up.
3. **More than three dishes → the trigger pans across all of them in a slow loop** (no `+N`).
4. **Bottom band re-laid:** chef sprite at **bottom-centre** (this also ends the gutter
   problem — the bottom band exists on every phone), **Ready to his right**, the three kitchen
   actions in a row **below him**. **After a boss wave**, a centre panel: *Congratulations* ·
   *Upcoming dishes* (next block's, icons + names) · **READY** inside it. User chose "Ready
   beside the chef" over a per-wave panel (Sep 17).
5. **BGM default 50 %** (`musicVol 0.6 → 0.5`); existing saves keep their own value.
6. **End screen → "Ramu's debrief" (user chose B of three, Sep 17).** Analysis: the ad
   offer was the largest, brightest element and sat where a reflexive post-death tap lands,
   above Retry (interface interference); a 100-rush run rendered as body text; `+400 💎`
   unexplained with no path to the gem sink; no Ramu. Spec: Ramu at 160 px with **one
   outcome line** (new best / near best / held / early → faces C / B / A / A), an **order-ticket
   card** with count-up and best-run delta and the gem breakdown, **Retry as the only filled
   button** with a **600 ms input lock**, `Upgrade kitchen` · `Menu` as ghosts, and the **ad
   offer demoted to an opt-in card below** — same gate, same reward, same claim path.
   Alternatives not taken: A (report card, no Ramu) and C (B + a "next affordable upgrade"
   strip — parked as a follow-up).

**Playtest of 1.78.0 (Sep 17) — Round 8 (fixes) + an art round:**
1. **Bottom band out of bounds** (wave 66): the chef and Ready overflow the bottom edge and
   the kitchen-actions row overlaps Ready. Must sit inside the safe area; measure at 403×874
   with a real inset.
2. **End screen, tie case:** `rushes == previousBest` fired the near-best branch → *"0 short
   of the record"*. Add a **matched-record line** (*"Matched the record. Next time it falls."*,
   face B). **"Held" threshold 10 → 20** (*"10 rushes held. Nobody at the tapri would believe
   it"* oversells 10).
3. **Two Ramus:** the bottom-band idle portrait stays visible under the end screen. Hide it
   while `tdPhase === 'lost'`.
4. **Entry hatch, exit hatch and the belt read as placeholders** against the Overtime kitchen
   (wave 106). **Art round** (art agent, `Art\` only): entry = the pass window, exit = the
   walkout door, belt = a rail with a subtle conveyor pattern. One neutral set first; per-block
   variants only if the neutral set earns it. Implementation follows in a later round.
5. **Main menu rework** → §9 below.

**Playtest of 1.80.0 (Sep 17) — main menu accepted; six notes for Rounds 9–11:**
1. **Settings is a dialog, not a screen.** Same three rows (Music, Sound, credit line) in a
   centred box over the dimmed menu; Back closes it. Applies to every sub-section that is a
   short form.
2. **Ramu greets the player on the menu:** a speech bubble over the bottom-left portrait,
   *"Welcome, ‹name›"* — the name from item 6.
3. **Boss meter:** a **vertical bar on the left of the playfield** that rises level by level to
   the block's boss (every 10th level, `isBossLevel`). The board's left 67 design units are
   free (path edge at 67, first pad at 205). **Picked Sep 17: B · Heat gauge** (over A ticket
   spike, C service bell) — a segmented tube at x 12–52, y 470–1270 in board units, ten
   28 × 70 segments filling orange → red bottom-up (`(level − 1) % 10`), flame cap r 40 at
   (32, 440) that shows the boss face while the boss is on the belt, `n/10` label at 26 units,
   segment 9 breathes (alpha .7 ↔ 1, 1.2 s; resting state measured), 300 ms drain at the
   block boundary, full in Overtime. FTUE beat after the first rush: *"See the heat on the
   left? Every rush you survive turns it up a notch. When it hits the flame — the big one
   walks in. Be ready."* Drawn in the private proposals page (not the spec of record).
4. **FTUE teaches four things it does not teach today:** the recipe widget (wave bubble), the
   boss meter, upgrades, and prop placement. One beat each, in the existing dialogue system.
5. **Empty pads need a cue.** Today a ghost slot is near-invisible. Decided: a **concentric
   circle with an inward arrow** on every empty pad — **green** when the cheapest prop is
   affordable, **red** when it is beyond the current coins, and a red pad **does not respond to
   taps** until the coins reach the cheapest price (no picker opens; a coin-shortfall toast is
   fine).
6. **Name entry at the start of the FTUE** (⚠️ Round 9 put it on Start shift, which a first-ever session never sees — boot enters the scripted run directly; Round 10 moves it to the start of that run, before the opening beat)**:** *"What do they call you?"* with a text field and a
   **Skip** that auto-assigns a `FirstName LastName` name (no digits, no symbols). The name
   shows in the menu bubble and goes on the leaderboard. **RUN account players keep their RUN
   username** (`profile.isAnonymous !== true`); guests get the chosen/assigned name, carried
   in the score's `metadata.displayName` and rendered by the board in place of the host's
   anonymous username.
7. **Leaderboard revamp with a Daily tab that opens first**, All-time second. The SDK's
   `daily` period (UTC rollover) is added to `rundot/leaderboard.config.json` — additive; the
   two all-time boards must be read back before and after the deploy to prove they did not
   reset. Each run submits to both periods. **Picked Sep 17: B · Service board** (over A
   order tickets, C rota sheet): chocolate ground; header "RANKS"; period pills **Today ·
   All time** (Today opens first, not persisted); board pair as underlined text **Rushes
   held · Pests cleared** (renamed from Waves Cleared / Enemies Defeated); **podium** for the
   top three (cards 62 mu wide, heights 78/66/58; #1 orange 25 % + outline; fewer than three
   entries → plain rows); the current `Row` below; a **sticky orange bar**: "#n today · s
   rushes" left, "d to #(n−1) · resets hh mm" right (All time: no clock; no run today: "No
   shift yet today — start one" and the bar is Start shift). Daily rollover is UTC midnight =
   05:30 IST.
   **Anonymous entries (decided Sep 17):** the live boards are ~75 % `anonymous_<id>` (101
   players on waves/all-time). Display rule, client-side only: strip `anonymous_`, show the
   id's **first two characters, an ellipsis, and its last three** (`u2…Bq1` style). A guest
   with a chosen name (item 6) shows that name instead. Server entries untouched.
8. The Kitchen (meta upgrades) sub-section also needs changes — the user will annotate it
   separately.

**Playtest of 1.81.0 (Sep 17) — decided, for Round 10:**
1. **The orange pad pulse goes entirely** — both `applyPostWavePulse()` and the FTUE's
   place2/place3 pulse. The green/red concentric cue is the pad signal now, in the FTUE too.
   The FTUE keeps its auto-select of the target pad (the timer still fires; only the pulse
   visuals and the `pulsePads` channel go). The Hud conditions that hid objective/milestone
   text during a pulse simplify accordingly.
2. **Settings look A · Order ticket** (over B kitchen pass, C stove dials): cream card,
   chocolate outline 2, dashed rules; sliders = styled range inputs — track 8 chocolate 15 %,
   orange fill, cream knob 16 with chocolate stroke 2.5, ≥ 44 px touch target; icon + label
   rows with a value chip; **Name row** (`‹name› ✎`, opens the rename dialog; RUN accounts show
   the name with no ✎); credit line; Back ghost. Mock units. Drawn in the private proposals
   page (not the spec of record).
3. **Rename**: tapping the greeting bubble or the Name row opens "Your name" in the same
   card — field prefilled, Save (orange primary), Cancel (ghost); letters/spaces/`.`/`'`, max
   16; empty or unchanged = Cancel; never during a run. Save writes `playerName`, redraws the
   bubble, and **re-submits the current best to both modes with the new
   `metadata.displayName`** (the board is keep-best; whether an equal-score resubmit refreshes
   metadata is undocumented — tested once in Round 10 with the user's own 106; if the server
   ignores it the public row updates on the next accepted score, the "you" row at once).
   **RUN accounts**: the bubble is still a button; it shows a toast *"Your name comes from your
   RUN profile."* The game never overrides a RUN username.
4. **Pause ("Shift paused") uses the same card as Settings** (look A) — title, the two
   sliders, credit line — but **no Name row**; instead **Continue** (green `#22c55e` fill,
   chocolate text + outline, the larger button: padding 12 × 6, font 12) above **Main Menu**
   (red: `#ef4444` outline + text on cream, padding 8 × 6, font 10). Scrim tap = Continue.
   Main Menu still abandons the run without a confirm (as today) — flagged, not changed.

**Round 3 — decided: horizontal fill under the wave chip**, not a bar in the gutter. Same
maths (SAFE = units − (lives − 1)), amber → green, resets per wave. Top-left, directly under
`WAVE n / RUSH: …`, width of that chip group.

**Round 4 — redesigned:** a **chat bubble over the idle chef** at each wave start carrying
the **final-dish icons** of the wave; **tap → a small scroll-styled submenu in the top band
between the WAVE chip and the speed buttons** (name, toughness pips, bounty). ⚠️ On
phones where the idle chef is hidden (gutter < 72 px — the 403×874 reference), the bubble
anchors to the **wave chip** instead. §7's data path is unchanged.


## 7. Wave-intro scroll — proposed Sep 13 2026, for speculation

**Trigger:** wave start, only when no dialogue box is queued. Dialogue wins; the scroll
follows on dismiss or skips that wave.

**Content:** the wave's incoming dishes. ✅ **Data path is entirely existing** —
`waveAt(level).entries[].enemy` → `blocks.ts`'s archetype-to-dish-slug map (line ~20) →
the `dish-<slug>` icon already in the manifest. Name, large icon, and:

- 🔴 **HP must be the effective value, `hp × entry.hpMult`**, and bounty must apply
  `bountyMult` from level 11. Base numbers would lie about the thing the card exists to say.
- Raw HP is opaque. **Recommend 1–5 toughness pips** against a reference shot, plus bounty
  as coins.

Multiple dish types → carousel (swipe or tap, dot indicator), deduped by slug.

**Art: one asset** — an Indian scroll with rolled ends. Unroll = mask reveal ~350 ms;
everything inside is DOM text plus existing icons.

**Layout: top-centre band** under the wave chip and coins — not the bottom (Ready) and not
the right (rail). Auto-dismiss ~3 s or on tap. **Never blocks placement.**

➕ On boss waves this *is* the boss card — Ooti, three walkouts — for free.

**Effort: one art asset, one implementation round. Low risk.** ⚠️ The only one of these
that could fit inside the jam window — and only by a Sep 15 ship with a device playtest.
Central agent's recommendation (Sep 13) was to freeze 1.69.0 and not take even this before
judging.

---

## 9. Main menu — approved design, Sep 17 2026

**Backdrops:** five gouache landscapes by **Archita Sharma**, received Sep 12 (files in
`Art\03 - Main Menu\Backgrounds\`, WhatsApp exports). 🔒 **Consent recorded 17 Sep 2026** — verbal, on her own suggestion and by mutual
understanding; terms filed at `Art - Main Menu\CONSENT - Archita Sharma.md` (gitignored). **Credit is mandatory**: on the
menu itself and on the credits screen (with KayKit and the SFX credits, Specs.md §…).
Pick: **#1 — dawn field with a path** (the walk to work; the path leads the eye into the
button column). Alternate with no layout change: **#4 — golden grass** (lowest detail behind
UI). Not used: lighthouse (off-theme), barn (green fights the wordmark), swan (competes with
the title).

**Layout — "A · Dawn shift"** (chosen over B "order ticket" and C "kitchen pass"; drawn Sep 17):
full-bleed backdrop; wordmark kept in the top third; **Ramu bottom-left at his in-game size**,
costume = the block of the player's best run; a **single right-hand stack** in the thumb zone:
`BEST · RUSH n` → **Start shift** (the only filled button; renamed from "Challenge Mode") →
The Kitchen → Ranks → `Backdrop: @ArchitaSharma` (link to
`https://www.instagram.com/arc_inmotion`, opened through the SDK's external-link path, never a
bare anchor) → **♥ Like · 💬 Comments**.

⚠️ **Units — corrected in Round 8b (1.80.0).** The first issue of this section said "the stack
is 130 px wide, Ramu 120 px": those were pixels of the **240 × 520 mock frame**, not device
pixels, and Round 8 built them literally (stack 18 % of the width on the user's screen; the
mock has 54 %). The menu is now laid out in **mock units**: `mu = clamp(1, min(vw / 240,
vh / 520), 3)`, recomputed on resize/orientation, and every dimension is `mock value × mu`
— stack width 130, Ramu 120, stack right 12 / bottom 14, gap 7, Start shift padding 12 × 6
font 12, ghosts 9 × 6 font 11, credit 7, chips 8, top chips 7 × 11 font 12 (44 px floor),
wordmark top 19 % of height with SPICE EXPERT 21.8 (system sans is narrower than the mock's
face; measured to 62 % of vw) and RAMU 40 with a 2.5 stroke; crop `center`. Height-clamped,
so the composition can never be wider than the mock: Ramu's visible shoulder clears the
ghosts by 7 px at 403 and 360 wide, as in the mock. **Accepted by the user Sep 17** ("Main
Menu is acceptable"). **Gems and settings chips at
44 px tap height.** The two tutorial hint lines are removed (the FTUE teaches). Bottom gradient
transparent → chocolate 88 % from **55 % to 100 %** of the height — the sky and path stay
untouched.

**Palette by element — measured against backdrop 1** (contrast = element vs the painting's
average in its zone; large bold text ≥ 3:1, small text ≥ 4.5:1):

| Element | Colour | Ratio | Why |
|---|---|---|---|
| SPICE EXPERT | **chocolate `#2a1d10`** | 5.4 | orange was **1.1** — the same hue as the dawn sky |
| RAMU | **cream `#fdfae7`** + 2.5 px chocolate stroke | stroke carries it | the chef-hat idiom: cream body, dark outline |
| BEST · RUSH n | cream + **1.5 px chocolate stroke**, `paint-order: stroke fill` | stroke carries it | reads even where the gradient is thin |
| Start shift | **orange `#f97316`** fill, chocolate text, 2 px chocolate outline | 5.0 | keeps the in-game Ready identity |
| The Kitchen · Ranks | cream outline + text, 35 % chocolate fill | > 6 | ghosts don't compete |
| Gems · settings | chocolate 85 % surface, cream text, **44 px** | self-contained | tap targets, not labels |
| Credit link | cream 75 %, underlined | > 5 | reads, doesn't compete |
| Like · Comments | chocolate 70 % chips, cream text | self-contained | foot of the stack |

⚠️ **The rule underneath:** orange is reserved for the action; never for type on the sky.

**Asset prep:** backdrop 1 to 720 wide (≈150 KB JPEG), `deferred` bundle is wrong here — it's the
first screen; put it in `critical` and measure the cost.

---

## 10. Six post-jam studies — proposed Sep 17 2026, for speculation (no picks yet)

Three proposals each, one recommended. Facts read from the SDK docs and `config.ts` on Sep 17:
rewarded ads exist (`ads.showRewardedAdAsync()`, this game already runs a game-over gem
placement, `maxPerDay 15`); `environment.browserInfo.language` gives `hi-IN` / `ta-IN`; RUN IAP is
**RunBucks** (platform hard currency, SKUs on the dashboard, `iap.spendCurrency`, `openStore`;
subscriptions exist; no direct fiat); meta economy = 4 gems/wave, 130 gems to max one stat,
390 for all three, and meta is raw power (+50 % damage at max); the Access Gate blocks TextGen
for anonymous players. The readable version with the option cards is a private page; this
section is the spec of record.

**10.1 Animated belt.** A *scrolling tread* (animate the texture matrix; one direction for the
whole belt — motion, not conveyance). B *per-segment conveyor* (7 masked TilingSprites + 6
corner patches; a round of its own, corners are the risk). **C — recommended: chevrons riding
the belt** — a Graphics layer redrawing ~40 cream 25 % chevrons (18 × 12 units, every 60 units)
at distances along the polyline via the bugs' own path function, moving toward the exit at the
base bug speed, **paused in build phase**, fading 300 ms at the boss level's last leak. Corners
free; direction always right; the belt shows the wave state. Belt-tile re-pass becomes optional.

**10.2 Localisation (Hindi, Tamil).** **A — recommended: full i18n, curated** —
`i18n/{en,hi,ta}.ts`, `t(key)` in React *and* Pixi text (~250 strings incl. 39 dish names,
enemy/prop/upgrade names, HUD, beats, end-screen lines); Settings language row (English ·
हिन्दी · தமிழ்); first launch with `hi`/`ta`/`-IN` → the name step asks *"Which language for
the kitchen?"*; persisted; instant switch. Agent drafts, **native reviewer signs off** (the user
for Hindi; Tamil needs a reader). OS fonts on Android/iOS; Noto Sans Devanagari/Tamil as deferred
web fallback (~150 KB each). Two rounds: table + English first (no visible change), then Hindi;
Tamil when reviewed. Test RUN's moderation on non-Latin text in Private. B *UI only* (dialogue
stays English — the wrong half). C *runtime machine translation* (credits per player, gated off
for guests — non-starter).

**10.3 Continue after losing.** **A — recommended: one rewarded continue per run**: loss →
*"Continue the shift? ▶ Watch"* → +10 walkouts, −15 % prop damage for 5 waves, once; the run
submits normally with `metadata.continues: 1` and Ranks shows ⟳ (a continued run's score is
that player's best forever — the marker is not optional). The nerf needs one engine hook
(`handicap {damageMult, untilLevel}`, three lines, sim unaffected) → 🔒 **unseal decision for
`engine.ts`**; the non-engine alternative is +6 walkouts and no nerf. B *ladder* (ad, then 50
gems, no third). C *unlimited escalating* (keep-best boards become "who continued most"; one
player burns the 15/day budget).

**10.4 Recipe shards → recipe scrolls (Kitchen content, board untouched).** **B — recommended:
full service** — at wave clear, if every dish on the order was served (no leak), **+1 shard for
each recipe on that order**; **8 shards per scroll**; **or 150 gems** (≈ one good run's whole gem
yield = one meta level foregone). Levels 1–12 are full serves by design (block-1 criterion) →
~10 chai shards in run 1 → **first scroll during run 1**, then one new recipe every 1–2 runs;
39 dishes at ~1.5 runs/day ≈ 2 months. Shown on the wave bubble after a full-service clear
(*"+1 ✦"*), redeemed in the Kitchen on a scroll card that also offers the gem price. A *drip* (1
shard per dish served, 100/scroll; rare dishes never come). C *boss drops* (3 shards of the
block dish per boss kill, 6/scroll, 200 gems; first unlock run 2–3, top players only) — keep as a
later sweetener (+2 on a boss kill).

**10.5 "Start shift" → Play; unlock notice.** **Play** (over Start): one syllable, localises
cleanly (खेलें / விளையாடு), no object needed. **B — recommended: badge + Ramu says it** — a 16-mu
orange "+n" chip top-right of The Kitchen (count = unlockable scrolls + claimable rewards,
cleared when the Kitchen opens) and the greeting bubble carries the notice: *"Welcome back,
‹name› — the ‹dish› scroll is ready in the kitchen."*; more than two: *"Rewards are waiting in
the kitchen."* A *badge + host toast* (`popups.showToast`; competes with RUN's own toasts). C
*badge + door glow* (reintroduces a pulse).

**10.6 IAP.** **B — recommended: content, not power** — recipe scroll SKU, shard packs, Ramu
costumes (the nine block bodies as menu/portrait skins), an ad-free continue token. A *gem packs*
(390 gems maxes meta → paid runs outrank free on both boards — pay-to-rank; only if purchased gems
are capped below meta level 5 or boards split). C *Chef's Pass* subscription (daily shard bonus,
one free continue/day, a costume) — after the daily loop exists. Sequence: shards → continue →
Play/badge → IAP; all post-jam, Private first.

---

## 8. Previously held, still parked

- **Wave roster panel** (GDD §8) — held.
- **Regenerating the other eight backdrops** — held.
