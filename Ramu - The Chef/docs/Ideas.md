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

## 2. Main menu revamp — background art + clean UI behaviours — ➡️ superseded by §9 (shipped 1.79.0–1.80.0)

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

## 3. Prop game feel — proposed Sep 13 2026 — ✅ bundle 1+2+3+4 picked Sep 16, shipped 1.75.0 (Type 2 wrapper fix 1.77.0)

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

## 6. Progression gauge + Chef Ramu — proposed Sep 13 2026 — ✅ shipped as Rounds 0–9 (1.70.0–1.81.0); §6d holds every decision

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
   ✅ (built in Rounds 2–3 as `#chef-head-button`, then the idle chef moved to bottom-centre in Round 7) — the original proposal: because the idle sprite is hidden on the
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
   reset. Each run submits to both periods. ✅ **Shipped 1.83.0 (Round 11, Sep 18)** — boards
   read before/after, unchanged; `SubmitScoreParams.period` is per call, so four spaced submits
   per run end. **Picked Sep 17: B · Service board** (over A
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
   metadata is undocumented — Round 10 could not test it headlessly (mock identity only); the
   user's first rename on 1.82.0 with their own 106 is the test; if the server
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


**Playtest of 1.82.0 (Sep 17, ~23:00 IST) — decided, for Round 11 — ✅ shipped 1.83.0 (Sep 18):**

1. **The order scroll must stay visible during the `recipe-widget` beat.** Today
   `WaveBubble.tsx` hides the bubble behind any open dialogue ("dialogue wins", `baseVisible =
   … && dialogue === null`), so the beat that says *"That scroll up top is the order"* points
   at nothing. Fix: the trigger bubble stays visible while `dialogue?.id === 'recipe-widget'`
   (submenu still closed; every other beat keeps hiding it).
2. **No em dashes in Ramu's lines.** `heat-gauge-intro` → *"When it hits the flame, the big one
   walks in."* The same rule applied to `recipe-widget` (*"…walks in this rush. Count them off
   as you serve."*) — the user marked the heat line; the second is the same voice rule, flagged.
3. **Heat gauge moves into the middle of the visible gap between the belt and the screen's
   left edge.** The stage is contain-fit and letterboxed (`stage.ts getFit`), so design x = 12
   sits ~24 % in from the left on a 744-wide screen while the gap is empty. Spec: gauge centre
   x = midpoint of `visibleLeft` (= −offsetX / scale in design units, ≤ 0) and the belt's
   leftmost edge (170 − pathWidth/2 = **127**), clamped so the tube's left edge ≥ visibleLeft +
   16; recomputed on every layout/resize; cap, tube and "n/10" label move together. At 744 ×
   1315 that is ≈ 118 px from the left edge; with no letterbox it is centre 63.5 (tube 43–84).
4. **Block-clear card (`PostBossPanel.tsx`) ×1.15 — the box and every element inside it.**
   Exact: max-width 28 → 32.2 rem; padding 20 → 23 px; title 20 → 23 px; body 15.2 → 17.5;
   eyebrow 10.9 → 12.5; dish icons 48 → 55 px; dish names 9.9 → **11.4 px** (over the 11 px
   floor; max-width 4 → 4.6 rem); gaps 12 → 14; Ready button padding 16 → 18 px vertical, font
   20 → 23. Still `w-full` inside the 12 px side gutters at phone width; ten dishes (Overtime)
   must wrap to two rows without clipping at 360 × 780.
5. **Both the order scroll and the card's dish list must be readable by mobile-web players.**
   The scroll's chips today: icon 56 px, name **8.8 px**, count **9.6 px** — both under the 11 px
   floor. Spec: icon 64 px, name ≥ 11 px, count ≥ 12 px, submenu text ≥ 11 px; overflow keeps
   using the existing carousel; the bubble must not collide with the speed buttons at 360 × 780
   with three dishes on the order (level 81: Naan · Idli · Jeera Rice). Card side covered by 4.
6. **The cream card (shared `SettingsCard.tsx` shell) is not opaque:** background
   `rgba(253, 250, 231, 0.90)`; scrim, text, sliders and buttons unchanged. Applies to Settings,
   pause and rename alike (one shell).
7. **Ranks (both boards, unannotated):** the anonymous rule (`b4…1L2`) and the "you" tag render
   as specified — accepted as-is; Round 11's service board replaces the layout anyway.
8. ⚠️ **The live rename test is still open:** the user plays on a RUN account (PuneetMakes, "you"
   row), and RUN accounts cannot rename — the resubmit path only runs for guests. It gets tested
   the first time a guest renames on 1.82.0+; I read the boards after.

**Playtest of 1.83.0 (Sep 18, ~00:40 IST) — decided, for Round 12:**

1. **Board nouns:** "Pests cleared" → **Dishes served**; "Rushes held" → **Waves held**. Bar:
   *"#1 all time · 6,231 dishes served"* / *"… · 106 waves held"*; Today: *"#n today · …"*.
   Mode keys `kills` / `waves` unchanged.
2. **Podium placement is broken** (cards float at three heights with no base; #1 barely taller).
   Replaced, not patched: the three stand on **one base line, bottoms aligned, stepped heights**
   — the exact treatment comes with the restyle pick below.
3. **Idle chef portrait bigger:** `IDLE_SIZE` 88 → **132** (×1.5); the narrow-gutter floor rule
   and hidden-on-lost stay.
4. **Inline Ready button moves above the portrait** (centred on it) once the portrait is
   rescaled — not beside it; the three upgrade chips stay below the portrait.
5. **Ranks restyle — the user finds the orange-on-chocolate look bland; architecture stays.**
   Three drawn looks with a recommendation (private page, not spec of record): **A** specials
   chalkboard (slate + walnut frame, chalk hand for header/pills, chalk-outlined podium steps
   on a shelf line) · **B — recommended: the pass counter** (the shipped `menu-backdrop`
   blurred 3 px and darkened ~85 % as ground; a walnut board with a 1.5-mu brass rim; brass
   podium steps 30 / 20 / 13 mu on a brass shelf, avatars on brass discs 40 / 30 mu, laurel on
   #1; rows as cream **order tickets** with a dotted tear edge, tomato scores, own row on
   turmeric paper with a red outline; the bar stays orange and becomes the only orange on the
   screen) · **C** ticket rail (steel rail, top three as clipped tickets, receipt monospace).
   Research adds two cheap items for the pick: a **"near you" slice** (three rows above/below
   when off the first page) and a **rank-delta arrow** on the own row since the last visit.
   ✅ **Picked Sep 18 ~01:00 IST: B, the pass counter.** Near-you slice and delta arrow folded in as
   Round 12 Part 3 (Central's recommendation; strike if unwanted).

**Playtest of 1.86.0 (Sep 18) — decided, for Round 14:**

1. **Board scale is a function of viewport size only.** Selecting a pad (or any build→wave
   transition) unmounts Ready and the chips (`Hud.tsx` `bottomBandActive`), the measured bottom
   column shrinks, the pixel-band fit (12b) re-fits and the belt visibly changes size — "belt
   glitches out in size". Fix: the top and bottom bands are reserved at their **maximum
   build-phase layout** (row 1 + WAVE/ring group; Ready + gap + portrait + safe-area) via
   always-mounted, visibility-hidden placeholders, measured once per resize; no HUD state may
   change `hudTopPx` / `hudBottomPx`. Acceptance: scale identical across build, pad selected,
   wave, dialogue, pause, post-boss at a fixed viewport.
2. **The Kitchen-Actions chip column beside the portrait is unwanted** — it is taller than the
   portrait's lower half and becomes the bottom band's height. Three options offered: **A —
   recommended:** icon chips (❄ / 🔥 / 🐌, 44 × 44, cost beneath, label on tap-and-hold) beside the
   portrait inside its 132-px height; B: a fourth cluster on HUD row 2 (row is full at 360);
   C: behind Ramu — tap the portrait for a scrimmed popover (retarget the upgrade cue).
   ✅ **Picked Sep 18: A** — icon chips inside the portrait's height.
3. Screenshot 1 (wave 3, chevrons, horizontal bubble, Ready above portrait): no annotation —
   accepted as rendered.

**Playtest of 1.89.0 (Sep 22) — decided, for Round 16:**

1. 🔴 **Closing the order scroll must not hide the order chip.** `WaveBubble.tsx:339`
   `close: () => { setIsOpen(false); setDismissed(true); }` — the outside tap closes the submenu
   *and* dismisses the trigger for the rest of the build phase, so the player loses the order
   display entirely until the next wave (screenshots 2–4, wave 44). That dismissal was a Round 5
   rule ("a tap that opened the submenu counts as the bubble-dismiss tap") and is now wrong:
   **closing the scroll reverts to the chip**, always. The chip stays visible through build and
   wave as it does today; nothing dismisses it.
2. Screenshots otherwise accepted: heat gauge at 3/10, chips beside the portrait, static scale
   across states, Ready above the portrait, chevrons — all as specified at wave 44.

**Kitchen relayout + recipe sheet — decided Sep 22 2026, for Round 17:**

Source: the user's video `references/Errors/The kitchen upgrades refix.mp4` and an annotated
screenshot. Proposal pages (private, not spec of record): layouts
`https://claude.ai/artifact/FxVRqjr5UzmxHhgLsVuACY`, sheet designs
`https://claude.ai/artifact/LbAWwou5GEgBkVmB5KZ9N7`, the approved hybrid
`https://claude.ai/artifact/QrmaTewse8CEL4KNtchdV7`.

1. 🔴 **Recipe card text sits on the art.** `MetaUpgrades.tsx:199` paints
   `ui-recipe-scroll` as `absolute inset-0 object-cover` with the name and note laid over it,
   plus `truncate` on the name — unreadable at every size. **Fixed card:** parchment becomes a
   **26-mu banner** with the dish medallion on it; name and note sit on solid chocolate below;
   name **wraps to two lines** (no truncate); note clamped to two lines; locked = the same card
   desaturated with the shard bar and the 150 💎 button.
2. **The Kitchen screen splits into two tabs (option A, picked).** Segmented control under the
   title, 2 × 44 px: **Stations** (selected on open — the stations must not be buried under a
   22-card wall) and **Recipes**. Each tab scrolls independently and keeps its offset for the
   session. The `computeKitchenBadge` count moves onto the **Recipes tab** and clears when that
   tab opens, not when the Kitchen does. Recipes grid: 2 columns at mu ≤ 1.5, 3 above; unlocked
   first, then locked by progress descending.
3. **Recipe sheet — approved style: parchment shell with a prep-bench layout** (B's shell, A's
   formatting). Parchment `#f7efd8 → #e9d7b0` with a fibre pattern between two walnut rollers
   with brass caps; **ink on flat parchment with 10-mu padding, never over art**. Centred header:
   60-mu plate, dish sprite **46 mu** sized by its opaque bbox, name 15 mu, epigraph italic,
   2-mu rule. Then **Ingredients → Prep → Garnish & cooking** in that fixed order for all 22.
   **Ingredient rail:** tiles **42 × 44 mu**, gap 5, sprite 26 mu, label 6.5 mu (two lines max),
   one line that **scrolls sideways** — never wraps, so every dish's sheet is the same height.
   4 tiles visible + a peek at every viewport; `scroll-snap-type: x mandatory`, snap-start per
   tile, `touch-action: pan-x` so a sideways drag can't steal the sheet's vertical scroll;
   right-edge fade + chevron and page dots render **only** when more tiles exist; the label
   carries the count ("Ingredients · 7"). Steps: tomato numbered discs, 8-mu body, ≤ 240
   characters each. Dismiss: 40 % chocolate scrim, tap outside or Close; locked cards never open.
4. **Ingredient sprites — cross-referenced Sep 22:** 30 exist (7 shipping as `ing-*`, 23 finished
   in `Art/_gen/ingredients/`). **Every one maps to at least one recipe**; 20 of 22 dishes have
   ≥ 3 sprites, 16 have ≥ 4. Thin: **naan** (ghee, cumin) and **aglio e olio** (chilli flakes,
   parsley) — art round 4 adds **flour, garlic, tomato** to close both and strengthen arrabbiata,
   minestrone, risotto, pesto and veg momo.
5. **Content:** `data/recipes.ts` gains an ordered `ingredients: string[]` per slug (cook's order,
   not alphabetical); strings `recipe.<slug>.prep` / `.finish` (44) plus `ingredient.<key>` names
   (~33, translated once each, not per dish). Hindi picks them all up in R17's own pass.

**✏️ Amendment — recipe-writing pass returned, Sep 22 2026.**
[docs/i18n/recipes.md](i18n/recipes.md) delivers the 44 `‹slug›.prep` / `.finish` strings
(173–209 chars, all verified against the 240 cap) ready to paste. It also reports back on
item 5 above, and four decisions fall out of it.

**The structural finding, which is not the agent's framing but follows from it:** the rail
can only show what has a sprite. Seven dishes' *primary* ingredient has none — rava, green
beans, basil, noodles, spinach, bamboo shoot, tamarind — and Round 17's acceptance check
counted tiles, so a wrong sprite went in each empty slot rather than the rail being left
short. The sheet renders the dish's note directly above the rail, so **six dishes will show
a note naming something the rail does not contain**: `upma` (rava → flour), `pesto` (basil
→ parsley + tomato), `veg-thukpa` (noodles → none), `beans-poriyal` (beans → peas),
`palak-aloo` (spinach → none), `sambar` (tamarind → none). That contradiction in one glance
is the actual cost, not culinary pedantry.

1. 🔴 **Rails: fix the seven, and let a rail be short.** `coffee` (drop `cream`),
   `upma`, `beans-poriyal`, `pesto` (drop `tomato`), `veg-thukpa` and `veg-momo` (drop
   `coriander-seed`), and above all **`ooti`** — the boss dish, whose rail
   (`rice · ghee · cardamom · clove · cumin-seed · bay-leaf · turmeric`) describes a pulao,
   while [RecipeList.md:398](RecipeList.md) locks its primary as **Peas**. Replace with
   `peas · onion · ginger · garlic · dried-red-chilli`. **Two constraints in `recipes.ts`'s
   header comment must be dropped to allow this:** "every one of the 33 aliases is used at
   least once" (it is what put `aubergine` in minestrone — aubergine was drawn for Baingan
   Bharta, a *level* dish, not one of the 22 slugs) and the fixed tile counts. Keep chai/
   sambar at 5 and idli/sticky-rice at 2 for the sheet-height check; **move the 7-tile case
   off `ooti`** to any dish that honestly reaches seven.
2. **`ingredient.coffee-extract`: "Coffee Extract" → "Coffee Decoction"** (recommended).
   Extract is the filename; decoction is the drink, and it tells the Hindi/Tamil translator
   which beverage this is. `ingredient.tea-leaf` stays **"Tea Leaf"** — the agent conceded
   its own "Tea Leaves". The other 31 names agree. Decide **before** Hindi translates them.
3. **`recipe.sheet.ingredients` becomes a plural entry.** It shipped flat as
   `'Ingredients · {n}'`; `tn()` already exists. Not reachable today — the shortest shipped
   rail is 2 — but any corrected rail that lands on one tile renders "Ingredients · 1", and
   the plural must be right before Hindi, where it behaves differently. One-line fix.
4. **Art round 5 ask, ranked by dishes served (§4.6 of the doc):** cooking oil (**12
   dishes** — ghee is the only fat with a sprite, and RecipeList assigns a different oil to
   four of five nodes), a pasta/noodle (**4**, two of them locked primaries), cabbage (**2**,
   the secondary for both momo and thukpa per §7.4). Three sprites = **441 credits** at the
   measured 147 each. Ten dishes are flagged in §4.3 as needing a cook's eye rather than a
   guess — the user's call, not an agent's.

---

**✏️ Amendment — user playtest of Private 1.91.0, Sep 22 2026.**
Three annotated screenshots of the Kitchen's Recipes tab and two open chai/sambar sheets.
Proposal page (private, not spec of record): `https://claude.ai/artifact/RBd4NYK4wDfW8kdCUhQLLr`.

**Accepted as working:** the two-tab split, the scroll structure, the rail, the page dots, the
count label, Close. The user's words: *"Recipe scroll structure feels promising, once the entire
recipes are placed in their respective recipe scrolls then reviewing them will allow for any fine
tweaking."* **So the sheet is not re-litigated until the 44 step strings are in it** — that review
is deferred to after Round 18, deliberately.

1. 🔴 **"Thumbnail still not neat & precise" — the medallion is bigger than the banner.**
   `MetaUpgrades.tsx:167–193` sets the banner to **26 mu** and the medallion inside it to
   **30 mu**, and the card wrapper carries `overflow: hidden`. A 30 mu circle centred in a 26 mu
   strip overflows 2 mu at each end: the top is sliced flat by the card's own edge, the bottom
   spills onto the chocolate. **The disc is never a circle.** ⚠️ **Both numbers are mine** — the
   Round 17 spec in the block above says "26-mu banner" and "30mu white medallion" in consecutive
   sentences. The agent built exactly what was written. Same failure class as Round 12b: two
   instructions that are each correct and whose sum is not. The banner also paints the parchment
   with `background-size: cover`, cropping a 256² texture into a 26 mu slot at an arbitrary
   offset — the stray diagonal edge visible in the top row.
2. 🔴 **Chai and coffee are small in the file, not on screen.** Measured: every `dish-*.png`
   shares a **212×141** canvas; 28 of 30 fill it to **206×134**, while **chai and coffee carry
   75×55** centred (left 68 / right 69, top 43 / bottom 43 — dead centre). `object-contain` fits
   the *canvas*, so those two render at **36% of every other dish**. The sources in
   `Art/_gen/dishes-final/tray-chai.png` / `tray-coffee.png` are **also 75×55**, so there is no
   sharper original to re-export — **and none is needed.** Fix: a per-slug
   `zoom = 206 / bboxWidth` (**2.75×** for these two, 1.0 for the other 28) applied by sizing the
   `<img>` itself inside a clipping container — **not** a CSS `transform`, which would scale an
   already-rasterised layer and blur it. 75 source px rendered into ~18 mu is still a *downscale*,
   so it stays sharp. **Zero credits, no regeneration.**
   🔒 **The shared `dish-chai` / `dish-coffee` assets are not re-exported.** They feed the wave
   bubble's scroll grid and the order chip (`manifest.ts:41, 165`); re-cropping the files would
   silently change every one of those surfaces. The zoom lives in the two recipe surfaces only.
3. **Card restyle — three options drawn, recommendation A.**
   **A · Contained medallion (recommended):** banner **26 → 34 mu**, medallion **30 → 26 mu**
   (4 mu clear at both ends, nothing clipped); parchment **`100% auto` centred** so the fibre runs
   straight and all 22 crop identically; disc gains a **1.5 mu walnut ring** and loses the heavy
   drop shadow, reading as a plate rim rather than a sticker; dish icon **18 mu × zoom**.
   **B · Plate, no disc:** 38 mu banner, dish straight on the parchment over a cast shadow,
   rhyming with the sheet's own 60 mu plate — but idli and coconut chutney are cream on cream.
   **C · Recipe list:** one column, 34 mu rounded-square thumbs on a cream tile, parchment leaves
   the grid entirely. The most literally neat, and it matches the Stations tab — but it trades the
   shelf-of-scrolls look, and that is a taste call, not a defect fix.
   **Why A:** it answers exactly what was pointed at. B and C both settle the larger question
   *"should the grid carry parchment at all?"*, which deserves to be asked once the sheets are
   full of text — not decided as a side effect of fixing a clipping bug.

---

**✏️ Amendment — card option A approved, and the rail is keyboard-only on desktop. Sep 22 2026.**

**Option A is approved**, with the parchment staying in the grid. B and C are closed, not parked —
the "should the grid carry parchment at all" question was asked and answered.

🔴 **New defect, found by the user in the same session: the ingredient rail cannot be scrolled by
mouse at all.** Reported as *"The drag doesn't work, I can scroll horizontally with the right and
left arrow keys. Not working with scroll or click and drag."* Read from
`RecipeSheet.tsx:150–196` and `app.css:204–209`, the rail is a native `overflow-x-auto` scroller
with **three of its four input paths missing**:

| Input | Status | Why |
|---|---|---|
| **Arrow keys** | ✅ works | An explicit `onKeyDown` at `:174` with `tabIndex={0}` at `:192`. This is the only handler on the element. |
| **Mouse click-drag** | 🔴 never worked | A native scroll container does not drag under a mouse. That is browser behaviour, not a bug in our code — but it means it needs JS we never wrote. |
| **Mouse wheel** | 🔴 never worked | There is **no `onWheel`** anywhere in the file. A mouse emits `deltaY`; Chromium's deltaY→horizontal fallback is unreliable against `snap-mandatory` and a scrollable ancestor, and empirically it does nothing here. |
| **Scrollbar** | 🔴 hidden by us | `app.css:204–209` sets `scrollbar-width: none` and hides the webkit scrollbar, so the last mouse affordance is gone too. |

**So on desktop the chevron and the page dots advertise content that no mouse gesture can reach.**
RUN games run in a browser, so desktop players are real players. **Touch is a separate question and
is still untested** — `touch-action: pan-x` on a native x-scroller is the correct setup and is
likely fine; do not assume this report condemns it.

⚠️ **Round 17 tested this and passed it.** The check was `wheel(220, 0)` — `deltaX: 220`, a
*horizontal* wheel event that an ordinary mouse cannot generate. It proved the container scrolls
when handed horizontal delta, which was never in doubt, rather than that any real input produces
that delta. → **Retro 117.** The agent was straight about what it could not test (touch); the gap
is that the thing it *did* test was synthetic.

**Round 18 fix, specified:**

1. **Wheel → horizontal.** Bind with `addEventListener('wheel', h, { passive: false })` inside a
   `useEffect`, **not** React's `onWheel` — React attaches wheel listeners passively at the root,
   so `preventDefault()` from a JSX handler is ignored. When `Math.abs(deltaY) > Math.abs(deltaX)`,
   add `deltaY` to `scrollLeft` and `preventDefault()` so the page behind does not scroll instead.
2. **Mouse drag.** `pointerdown` → `setPointerCapture`, record `startX` and `startScrollLeft`;
   `pointermove` → `scrollLeft = startScrollLeft - (x - startX)`; `pointerup` → release. **Guard on
   `e.pointerType === 'mouse'`** and let touch keep its native scrolling, which already works.
   Require a **4 px movement threshold** before it counts as a drag, and suppress the trailing
   `click` only when that threshold was crossed, so a plain click on a tile is unaffected.
3. **Snap fights the drag.** Set `scroll-snap-type: none` on `pointerdown` and restore
   `x mandatory` on `pointerup`, so the rail follows the cursor freely and then settles onto a tile.
4. **Say it is draggable.** `cursor: grab`, `cursor: grabbing` while held.
5. **Keep the keyboard path** and give `tabIndex={0}` a visible focus ring — it currently has none,
   so the one input that works is also invisible.

Acceptance: at 360, 403 and 744 wide, on ooti (7 tiles) — a mouse wheel over the rail moves
`scrollLeft` and leaves the sheet's `scrollTop` at 0; a click-drag of 120 px moves `scrollLeft` by
120 and then snaps to a tile edge; a 2 px click on a tile does not scroll; arrow keys still work
and the focused rail is visibly focused.

---

**✏️ Amendment — the four §6d decisions answered, Sep 23 2026.** User's words are quoted where
they set the rule.

1. **Short rails approved.** *"yes, we delete the wrong ones as per your recommendations."* The six
   wrong tiles go (`coffee` cream, `upma` flour, `beans-poriyal` peas, `pesto` tomato,
   `veg-thukpa` and `veg-momo` coriander-seed), `ooti` is replaced wholesale with
   `peas · onion · ginger · garlic · dried-red-chilli`, and `minestrone` drops `aubergine`.
   Resulting counts: coffee **2**, pesto **3**, veg-thukpa **3**, upma / beans-poriyal /
   veg-momo / minestrone **4**, ooti **5**. Nothing falls below 2. Chai, sambar, idli and
   sticky-rice are untouched. **Both constraints in `recipes.ts`'s header comment are dropped** —
   "every one of the 33 aliases is used at least once" and the fixed tile counts.
   ⚠️ **Consequence to handle in Round 18:** no dish has 7 tiles any more, so the sheet-height
   acceptance case becomes **2 vs 5**, not 2 vs 7. Ooti can honestly reach 7 only if bamboo shoot
   and greens are ever drawn.
2. **Coffee Decoction — labels only.** *"rename both labels, keep the internal id."*
   `en.ts:425` (live, the recipe rail tile) and `levels.ts:73` (`label: 'Coffee Extract'`, in the
   unmounted Kitchen Mode scene — renamed so it is correct if that scene ever ships). The id
   `coffee-extract`, the alias `ing-coffee-extract`, the PNG filename and the LoRA dataset file
   **all stay**, matching the accepted `tea-leaf` / "Tea Leaf" pattern. Docs to read
   "Coffee Decoction (id: `coffee-extract`)" so this is not re-opened.
3. **Plural key — deferred, not rejected.** *"Since it'll be samagri anyway I don't think this
   needs correction as of now, maybe once implemented we can check back on how it feels."*
   Correct call: the shortest rail after (1) is 2, so `Ingredients · 1` is unreachable, and Hindi
   needs no plural form here. Revisit after Hindi ships if the label reads oddly at any count.
4. **Art round 5 — credits route confirmed**, and **re-ranked by decision (1)**. Deleting wrong
   tiles fixes the lies and leaves the gaps: **six dishes still have a note naming something the
   rail cannot show** (upma/rava, veg-thukpa/noodles, pesto/basil, beans-poriyal/beans,
   palak-aloo/spinach, sambar/tamarind). The old ranking by "dishes served" put cooking oil first,
   which was right while the bar was *fill the tiles*; the bar is now *show true things*, so
   note-contradictions rank above coverage. **Nine sprites, 1,323 credits** (ceiling 1,764 with
   three retakes), in three tiers so the ask can be cut at any line:
   **T1 (6, closes every note contradiction):** noodles, rava, basil, green beans, spinach,
   tamarind. **T2 (1, missing locked primary):** spaghetti. **T3 (2, coverage):** cooking oil
   (12 dishes), cabbage (named secondary for momo and thukpa).
   🔴 **Named confusion risks, which are the substance of the brief:** rava vs the existing
   `flour`; basil vs `parsley`; spinach vs both; green beans vs `green-chilli`; tamarind vs
   `dried-red-chilli`; oil vs `milk`; cabbage vs `cauliflower`; noodles vs spaghetti. The round
   adds a **third and fourth green leaf** to a rail that already has parsley and curry leaf — if
   they cannot be separated at 26 px the agent is to **report that rather than force it**.
   Route reasoning: style continuity (all 33 shipped `ing-*` came from imagegen; the LoRA is
   trained on the licensed pack) and clean alpha, **not** the old "LoRA cannot paint white or
   green" limit, which `recolour.py` lifted (KitchenMode §8.8, Retro 67).
5. **Devanagari names — test first, build nothing.** *"Sure we can decide through testing."*
   The user's proposal (client shows Devanagari, server stores Latin) works only in a limited
   form: the board is shared, so other players always see the server value, and romanisation is
   not reversible. The workable version needs no round-trip — **the player's own row renders from
   their local save, every other row from the server** — but it means the player sees a name
   nobody else does. **If the test fails, the recommendation is the simpler one:** when the locale
   is Hindi, the name field carries *"Leaderboard names use English letters"* and the player
   chooses their own spelling, rather than an algorithm choosing it for them.

---

**✏️ Correction — art round 5 re-scoped before it was fired, Sep 23 2026.**
🔴 **Eight of the nine sprites I costed at 1,323 credits already exist as licensed art we own.**
Found by listing `Art/_sliced/01 - Kitchen Essentials/` when the user asked whether the handover
was ready to send.

| Ask | Already on disk |
|---|---|
| Cooking oil | **Four** — `Cooking Oil/02-Mustard Oil`, `03-Coconut Oil`, `06-Sesame Oil`, `07-Olive Oil` |
| Noodles | `Final Recipe/01-Cooked Noodles.png` |
| Rava | `Container/01-Semolina.png` |
| Tamarind | `Container/10-Tamarind.png` |
| Basil | `Ingredient/27-Primary-Basil Plant.png` |
| Green beans | `Ingredient/11-Primary-Green Beans.png` |
| Spinach | `Ingredient/16-Primary-Spinach.png` |
| Cabbage | `Ingredient/01-Primary-Cabbage.png` |
| **Spaghetti** | ❌ **nothing — the only genuine gap** |

All twelve candidates measured RGBA with real alpha and tight bboxes (fill 0.94–0.97).
**Bonus: `Ingredient/03-Primary-Bamboo Shoot.png` exists**, which serves bamboo-shoot-fry (a dish
named after an ingredient its rail cannot show) and lets **ooti honestly reach 7 tiles** —
restoring the sheet-height acceptance case that the short-rail decision was going to cost us.

**The pack already ships.** `ing-milk`, `ing-cream`, `ing-ginger`, `ing-rice` and
`ing-coffee-extract` are **byte-identical** to their pack files (mean difference 0.00/255) — five
of the 33 rail tiles are pack art today. toxiccolors' consent covers it, conditional on credit
attribution, which is in place. 🔒 This is *shipping* the pack, never using it as generator input.

**Revised round 5: export twelve files at 0 credits, generate `spaghetti` for 147** (ceiling 294
with one retake). Four oils rather than one generic bottle, because RecipeList §7 assigns a
different oil to four of the five nodes — free, and more truthful than the sprite I specified.
Two fit problems handed to the agent rather than assumed away: `basil` (64×179) and `olive-oil`
(63×141) are tall and narrow and will render thin in a 42×44 mu tile; `noodles` comes from
`Final Recipe/` and may read as a plated dish rather than an ingredient.

⚠️ **My style-continuity argument against the LoRA route was overstated** and is corrected here:
the rail has mixed pack art and imagegen art since before this round. Credits remain right for
spaghetti for the simpler reason that it is one sprite matching the other generated ones.

---

**✏️ Amendment — Round 18b's rail spec settled, Sep 23 2026.** Three decisions closed.

1. **Noodles — proposal B: generate a dried-noodle nest** (art round 6, one sprite, 147 credits).
   A was to hold it, leaving thukpa's note naming an absent ingredient. C was to ship the
   `spaghetti` art under a second alias — free, and defensible because a dry banded bundle really
   is how dried wheat noodles come and the two never share a sheet (node 3 vs node 4) — but it
   puts one picture under two names, and in Hindi under two more. B closes **the last
   note-vs-rail contradiction in the game** for 0.07% of the balance.
2. **All four oils ship**, no recolour. `oil-olive` (118, 79, 42) and `oil-sesame` (97, 55, 25)
   collide at 26 px — measured distance 36.1 against 61–106 for every other pair — but RecipeList
   §7 gives each cuisine node one oil, so **sesame (node 2) and olive (node 3) never appear in the
   same rail.** The collision exists only on a contact sheet.
3. **The fat gets a tile on every dish that has one**, taken from RecipeList §7's own Oil column.
   That column names a **bottled oil for exactly 12 dishes** — the same figure the writing pass
   gave — **ghee for five**, and a dash for five (chai, coffee, idli, sticky rice, veg momo:
   beverages and steamed things). Ghee already ships, so this costs no new art beyond the oils.

**The 22 rails as Round 18b must build them.** Sixteen change; `aubergine` stays at zero
references by design.

| Dish | Rail | n |
|---|---|---|
| Chai | tea-leaf · milk · ginger · cardamom · clove | 5 |
| Coffee | coffee-extract · milk | 2 |
| Naan | flour · ghee · cumin-seed | 3 |
| Jeera Rice | rice · ghee · cumin-seed · bay-leaf | 4 |
| Palak Aloo | potato · onion · garlic · turmeric · green-chilli · **spinach** · **ghee** | 7 |
| Gobhi Masala | cauliflower · onion · tomato · turmeric · coriander-seed · **oil-mustard** | 6 |
| Rajma | kidney-beans · onion · tomato · garlic · cumin-seed · **ghee** | 6 |
| Coconut Chutney | coconut-half · green-chilli · curry-leaf · mustard-seed · urad-dal · **oil-sesame** | 6 |
| Idli | rice · urad-dal | 2 |
| Upma | onion · mustard-seed · curry-leaf · green-chilli · **semolina** · **ghee** | 6 |
| Sambar | toor-dal · tomato · turmeric · curry-leaf · mustard-seed · **tamarind** · **oil-sesame** | 7 |
| Beans Poriyal | coconut-half · mustard-seed · curry-leaf · green-chilli · **green-beans** · **oil-coconut** | 6 |
| Pesto | pine-nut · garlic · parsley · **basil** · **oil-olive** | 5 |
| Minestrone | tomato · onion · potato · peas · **oil-olive** | 5 |
| Arrabbiata | tomato · garlic · dried-red-chilli · chilli-flakes · oregano · **oil-olive** | 6 |
| Aglio e Olio | garlic · chilli-flakes · parsley · **spaghetti** · **oil-olive** | 5 |
| Risotto | rice · onion · garlic · cream · **oil-olive** | 5 |
| Veg Thukpa | onion · garlic · green-chilli · **cabbage** · **noodles** · **oil-mustard** | 6 |
| Bamboo Shoot Fry | garlic · green-chilli · onion · turmeric · **bamboo-shoot** · **oil-mustard** | 6 |
| Veg Momo | flour · potato · onion · garlic · **cabbage** | 5 |
| Sticky Rice | rice · coconut-half | 2 |
| Ooti | peas · onion · ginger · garlic · dried-red-chilli · **bamboo-shoot** · **oil-mustard** | 7 |

**What this closes.** Every note-vs-rail contradiction: rava into upma, tamarind into sambar, basil
into pesto, green beans into poriyal, spinach into palak aloo, noodles into thukpa. **Bamboo Shoot
Fry finally shows bamboo shoot** — a dish named after an ingredient it has never been able to
display. Range becomes **2 to 7**, so the rail's constant-height invariant gets its 2-vs-7 case
back; note that after Round 18 the *sheet's* total height legitimately varies with prose length,
so the test is the **rail's own contribution**, not the sheet's.

---

**✏️ Amendment — the ingredient rail goes fully in-house, Sep 23 2026.**
User: *"We shouldn't be using the sprites from the pack for these anymore."* **Round 18b is held**
until art round 7 returns, so the rails ship once against final art rather than twice.

**Provenance, swept rather than recalled.** Every shipped `ing-*` and every round-5/6 delivery was
compared against all 563 pack files, normalising both sides to the alpha bbox first — the raw diff
gives a false negative on round 5's exports because `export.py` re-crops and re-centres them.

- **17 pack-sourced.** Shipped: `coffee-extract`, `cream`, `ghee`, `ginger`, `milk`, `rice`.
  Queued in 18b: `semolina`, `tamarind`, `basil`, `green-beans`, `spinach`, `cabbage`,
  `bamboo-shoot`, `oil-mustard`, `oil-coconut`, `oil-sesame`, `oil-olive`.
- **+1 on quality:** `green-chilli` — ours from round 3, but it reads as green blobs at 26 px and
  was one of the five the user flagged.
- **28 already in house style** and untouched. **18 + 28 = 46**, so after round 7 there is
  **zero pack art in the recipe rail**.

**🔒 This is not a licensing change and must not be recorded as one.** 44 `prop-*` sprites are
byte-identical pack art and still ship — verified on six of them — and the dish trays came from a
LoRA trained on that pack. **toxiccolors' credit stays mandatory.** Props and dish art are
deliberately out of scope: *"we will circle back on it once the game is stable and public."*

**Two things the round buys beyond consistency:**

1. **The oil collision dies for free.** The pack's olive and sesame bottles measured 36.1 apart in
   mean RGB against 61–106 for every other pair. Drawn ourselves we choose the colours — mustard
   golden amber, coconut near-white, sesame dark amber, **olive actually green** — so the pairing
   stops existing without recolouring licensed art.
2. **The container problem resolves as a by-product.** The user's objection was to jars where a
   loose ingredient was possible. `ginger`, `rice`, `semolina`, `tamarind`, `basil`, `spinach`,
   `bamboo-shoot` all become loose; `milk`, `cream`, `ghee` and the oils stay vessels because
   there is no honest way to draw loose milk — but they become *our* vessels.

🔴 **The risk this round turns on: seven green things, and it removes what was separating them.**
Basil, spinach, cabbage, green beans, green chilli, plus the existing parsley and curry leaf.
Round 5's basil separated **only because of its terracotta pot**, and this round removes pots — so
silhouette must now do work a prop was doing. Basil vs spinach is the hard pair. The brief
requires the agent to report failure rather than force it.

**18 sprites, 2,646 credits**, ceiling 3,381 (202,527 → 199,881 at plan).

---

**✏️ Amendment — user playtest of Private 1.92.0, Sep 23 2026.** Six annotated screenshots,
four observations. All four are closed in 1.93.0; recorded here because the pattern is that every
playtest gets its own entry, and this one was previously scattered across two other blocks.

1. **"Generate new & replace" on five sprites** — `ginger`, `coffee-extract`, `green-chilli`,
   `rice`, `cream`. A provenance sweep found **four of the five were licensed pack art** and the
   fifth (green-chilli) was ours from round 3. What they had in common was the fault: four are
   **containers**, and the user's line was sharper than "replace the pack stuff" — they picked the
   ones that *could* be drawn loose and weren't. This escalated into the decision to take the whole
   ingredient family in-house (art round 7, 18 sprites), recorded in its own block above.
2. 🔴 **"Upgrades → Recipes is only mouse scrollable."** Confirmed: `MetaUpgrades.tsx` had **no
   pointer handler and no wheel handler at all** — vertical wheel worked only because browsers
   scroll vertical containers natively. Fixed in Round 18b Part 4, which then turned up the
   `setPointerCapture` defect (Retro 124) that would have broken every button in both panes.
3. 🔴 **"The close button feels merged with the background."** Diagnosed as **three chocolates
   stacked**: the button is `var(--color-chocolate)`, the scrim behind it is `rgba(42,29,16,0.4)`
   — chocolate at 40 % — and the cards behind that are `#2a1118`, separated only by a drop shadow
   invisible on a dark ground. It had no material of its own. Fixed with a parchment fill, ink
   text and a 1.5 mu walnut border, so it reads as part of the scroll assembly.
4. **"Basil is missing in pesto"** — correct, and **already scheduled**: Round 18 only *removed*
   wrong tiles, and every addition was Round 18b. No change needed; the user's eye and the plan
   agreed.

✅ **Also confirmed by this playtest:** *"the ingredient bar inside each recipe is working with
drag"* — the first real-mouse confirmation that Round 18 Part 6 landed.

---

**✏️ Amendment — the Devanagari guest-name test, Sep 23 2026. ✅ The *rendering* half passes.
🔴 The half that was actually pending — RUN moderation — is still untested.**

The user ran it on Private 1.93.0 in a logged-out session: guest name **पुनीत**, opened on the
private tag. **The greeting bubble renders it correctly** — base consonants, the ु and ी matras all
attached in the right places, no boxes, no dotted circles, no fallback face. It also confirms
Round 13's widened `NAME_PATTERN` (`/^[\p{L}\p{M} .']*$/u`) accepts Devanagari on a real device,
which until now had only been checked against the regex itself.

🔴 **Central checked the item's own definition before claiming it closed, and the claim was too
broad.** What `Implementation Handover Record.md:3191` and `Agent Returns.md:342` actually leave
open is *"the Devanagari `displayName` **moderation** test"* — whether **RUN accepts the name on a
leaderboard submission**, verified by a guest-session submit plus a CLI readback. Rendering was
never the risk; **moderation is**, and this project has already been bitten by it twice (the
standalone word "Pot", and changelogs carrying the artist's surname). A name that draws perfectly
in the bubble can still be rejected or masked the moment it is submitted. **The test is half done.**

**🔴 Correction to Central's own framing of the test.** I had been describing it as "HUD, wave-end
card and leaderboard row". **The name is not drawn in the HUD or on the wave-end card at all** —
`grep` over `src/game/` finds `playerName` on exactly one line (`towerScene.ts:2344`), and it is
passed to leaderboard *metadata*, never to a Phaser text object. The complete set of surfaces that
render a player's name is five, all React DOM: `MainMenu` (the bubble), `Leaderboard` (the row and
the avatar initial), `NameDialog`, `RenameDialog`, `Settings`. That matters because **nothing draws
the name to canvas**, so there is no second shaping engine that could fail independently.

**Why the one pass generalises.** The project **declares no custom `font-family` anywhere** —
verified by grep, and documented in the code itself at `MainMenu.tsx:296` and `Leaderboard.tsx:556`.
Every name surface therefore resolves to the same system sans stack that just rendered the bubble
correctly. A per-surface font regression is not possible here, because there is only one font.

**Two Devanagari-specific risks were measured rather than assumed, and both came back smaller than
expected.**

1. 🔴 **The 16-character cap is a real fairness defect, and the user proved it on device.**
   The cap (`save.ts:248,396,409`, `NameDialog.tsx:86`, `RenameDialog.tsx:66`) counts **UTF-16 code
   units, not visible characters.** The user typed until the field stopped accepting input and got
   **पुनीतपुनीतपुनीतप — 16 code units, 10 visible characters.** Devanagari spends 1.6–3.0 units per
   character, so the same field that gives an English speaker 16 characters gives a Hindi speaker
   **10, and as few as ~5 for a conjunct-heavy name**: श्रीकान्त is 9 units for 3 characters (3.00),
   कृष्णमूर्ति 11 for 4 (2.75), प्रियदर्शिनी 12 for 5 (2.40). Common Hindi names still fit, so nothing
   is *blocked* — but the penalty is up to 3× and it lands on exactly the players the Hindi build is
   for. **Fix in Round 19: count grapheme clusters.** `maxLength` is a UTF-16 attribute and cannot
   express this, so the cap has to move into JS (`Intl.Segmenter`, or a `/\P{M}\p{M}*/gu` count).
   *Layout is not at risk either way* — 10 Devanagari characters are narrower than 16 Latin ones, and
   the bubble wrapped to two lines cleanly with no clipping or overflow.

   **Mid-cluster truncation did not occur and is nearly unreachable here.** The cut landed on प, a
   complete consonant. Because the cap is enforced on *input*, a cut can only ever strand a trailing
   virama (्), which renders as a visible halant stroke rather than a dotted circle — ugly, not broken.

   ⚠️ **Central's first cluster count was wrong and the user's screenshot is what corrected it.**
   The counter used `unicodedata.combining()`, which returns the combining *class* — **0 for
   Devanagari matras**, which are category `Mn`/`Mc` with class 0. It therefore counted पुनीत as 5
   characters instead of 3. Re-counted by category. → **Retro 126.**
2. **The leaderboard avatar initial** (`Leaderboard.tsx:174`) is `.charAt(0).toUpperCase()` — one
   UTF-16 code unit. For पुनीत it yields **प, not पु**: the matra is dropped, so the disc reads "pa"
   where the name is "Pu". It never produces a dotted circle (a name cannot begin with a combining
   mark, and in श्रीकान्त the virama is the *second* unit, so श survives alone cleanly), and
   `.toUpperCase()` is a harmless no-op on a script with no case. **Cosmetic and lossy, never broken.**
   Fix is one line — take the first grapheme cluster instead of the first code unit — and it belongs
   in Round 19, where the rest of the script work lives.

**Consequence for Round 19.** The font pipeline is cleared — the 90-odd Hindi strings can be
commissioned with no rendering risk hanging over them, because they run through the same single
system-font stack that just drew पुनीत. The only script-aware code defect found is the avatar
initial above.

**Still open, and it gates nothing in Round 19:** play one wave under a Devanagari guest name so a
score is submitted, then read the board back with the CLI and check the name survived RUN's
moderation intact rather than being rejected or masked. If it does not survive, §6d decision 5's
fallback applies — the Hindi locale tells the player *"Leaderboard names use English letters"* and
lets them choose their own spelling.

---

## 7. Wave-intro scroll — proposed Sep 13 2026 — ✅ shipped as the wave bubble's scroll grid, 1.76.0

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

## 10. Six post-jam studies — proposed and **picked** Sep 17 2026

✅ **Picked Sep 17 (all six recommendations, verbatim):** 10.1 **C** chevrons · 10.2 **A** full
i18n, Hindi first · 10.3 **A** one rewarded continue with the ⟳ board marker · 10.4 **B** full-service
shards (8 / scroll, 150 gems; boss drop +2 later) · 10.5 **Play** + **B** badge and bubble notice ·
10.6 **B** content-not-power IAP, no gem pack unless capped below meta level 5 or boards split.
Sequence as recommended: shards → continue → Play/badge → IAP; chevrons and the i18n table are
independent. All post-jam, all Private first.
⚠️ **10.3 nerf — undecided:** the pick quoted both variants. Until the user says **"unseal
engine.ts"** explicitly, the continue ships as **+6 walkouts, no nerf** (engine stays sealed).

**Round order (after Round 10 returns):** R11 Ranks + daily period (already planned) · R12 belt
chevrons + i18n string table (English only, no visible change) · R13 recipe shards + Kitchen
scroll card · R14 continue (rewarded ad, board marker) · R15 Play + unlock badge/bubble · R16 Hindi
(user reviews) · IAP after R13–R15 exist · Tamil when a reader exists.

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
Tamil when reviewed. Test RUN's moderation on non-Latin text in Private. **Inventory done Sep 18 (`docs/i18n/strings.md`, 244 live strings, Hindi drafts in place); four R13 constraints recorded in the handover record (dish keys by slug, costume alias by block id, name pattern to `\p{L}`, plural forms).** B *UI only* (dialogue
stays English — the wrong half). C *runtime machine translation* (credits per player, gated off
for guests — non-starter).

**10.3 Continue after losing.** ✅ **shipped 1.89.0 (Round 15, Sep 19)** — no-nerf variant, engine sealed; +6 escapes, ⟳ marker. **A — recommended: one rewarded continue per run**: loss →
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
**8 chai and 8 coffee shards by level 10** (measured, `docs/shard-projection.md`, Sep 18 — not the
~10 first estimated) → **two scrolls at the block-1 boss in run 1**; no other dish passes 5 in a
~35-level run (gobhi 5, jeera/palak 4, naan 3), so scroll 3+ needs shards to persist across runs
— roughly two North-Indian scrolls in run 2, then one to two per run; ✅ **shipped 1.88.0 (Round 14, Sep 18)** — cadence reproduced on the real engine;
39 dishes at ~1.5 runs/day ≈ 2 months. Shown on the wave bubble after a full-service clear
(*"+1 ✦"*), redeemed in the Kitchen on a scroll card that also offers the gem price. A *drip* (1
shard per dish served, 100/scroll; rare dishes never come). C *boss drops* (3 shards of the
block dish per boss kill, 6/scroll, 200 gems; first unlock run 2–3, top players only) — keep as a
later sweetener (+2 on a boss kill).

**10.5 "Start shift" → Play; unlock notice.** ✅ **shipped 1.90.0 (Round 16, Sep 22)** — badge built on a seen-count diff, not the shard threshold (Central's formula was unobservable). **Play** (over Start): one syllable, localises
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

## 11. Recipe shards — progressive difficulty + chef-hat icon — proposed Sep 23 2026

**User, on an annotated 1.93.0 Recipes screenshot:** *"Shards for the recipe will be progressively
difficult to attain!!"* and *"Each recipe's shard icon would be chef hats!!"* Captured on the
agenda, not scheduled — Round 19 (Hindi) is still next.

### 11.1 What ships today, verified from source

Both numbers are **single global constants**, so the 22 recipes are identical by construction:

| | |
|---|---|
| `SHARDS_PER_SCROLL = 8` | `state/save.ts:480` |
| `SCROLL_GEM_PRICE = 150` | `state/save.ts:481` |
| shard icon | one shared asset, `ui-shard` → `images/ui/shard.png` (`assets/manifest.ts:312`), drawn at `MetaUpgrades.tsx:331` |

`awardShards()` (`save.ts:492`) gives **+1 to each distinct dish served in a cleared wave**, and
skips any dish whose scroll already exists.

### 11.2 ⚠️ The flat 8 is already not flat — and the existing gradient is not monotonic

Because shards accrue per dish served, a recipe's real difficulty is **how many blocks serve that
dish**. From `data/blocks.ts` (blocks 6–9 re-serve earlier blocks rather than adding dishes):

| Cuisine | Dishes | Blocks that serve it | Levels | Farmable after L80? |
|---|---|---|---|---|
| Cafe (chai, coffee) | 2 | **1 only** | 1–10 | ❌ |
| North Indian | 5 | 2, 8, **9** | 11–20, 71–80, 81+ | ✅ **forever** |
| South Indian | 5 | 3, 7, 8, **9** | 21–30, 61–80, 81+ | ✅ **forever** |
| Italian | 5 | 4, 6, 7 | 31–40, 51–70 | ❌ ends L70 |
| North East | 5 | 5, 6 | 41–60 | ❌ ends L60 |

`blockForLevel()` sends **every level 81+ to block 9**, which serves only the North and South Indian
sets. So the two cuisines sitting *earliest* in the grid after the FTUE are the only ones a
late-game player can still farm, while **North-East — the last five cards, and the ones that read
as the end-game prize — stop accruing entirely at level 60.** The grid's visual order implies a
difficulty curve that the data does not have, and in places inverts.

**Consequence for the design:** raising the shard requirement per recipe is the smaller half of
this. If North-East stays unfarmable past L60, a higher requirement there is not "progressively
difficult", it is unreachable. **Any progressive-cost pass has to decide the block-9 dish set at
the same time**, or state explicitly that late recipes are meant to be bought with gems.

### 11.2b 🔴 CORRECTION to §11.2, Sep 24 — there is no level select, and it changes the conclusion

§11.2 above concluded that North/South Indian are *"farmable forever"* while North-East *"stops
accruing at level 60"*. **The exposure table is right; the conclusion drawn from it is wrong**, and
two facts from `TestBelt.tsx` settle it:

- `const [levelId, setLevelId] = useState(FIRST_LEVEL_ID)` (`:226`) — the current level is **React
  state seeded from level 1**, never restored from the save. **Every session restarts at level 1.**
  The only other writer is the Next Level button (`:418`), which advances linearly.
- `kitchen.bestLevel` and `kitchen.clears` are shaped and migrated in `save.ts` but **have no writers
  anywhere in `src/`**. There is no persistent level progress today at all.

So block 9 (levels 81+) is not a farm, it is nearly unreachable, and its dish set barely matters.
What actually governs acquisition is **how deep into an unbroken session a dish first appears**:
chai and coffee are served in every session that is ever played, while ooti requires surviving
**40 levels in one sitting, every time**. Acquisition difficulty is therefore **monotonic with block
depth, and steeply so** — which is exactly the curve the user asked for, and it already exists in
the data. The grid's order was never misleading; my reading of it was.

**This makes the design simpler, and it raises the real risk:** a steep *price* curve multiplies
with an already steep *rarity* curve. That product, not the price, is what the player feels.

### 11.2c Proposed ordering — by block, then by the enemy that carries the dish

`RECIPE_SLUGS` (`data/recipes.ts:10`) is what the grid renders in (`MetaUpgrades.tsx:418` only
floats unlocked cards to the front), so ordering is a one-line data change. It is **already grouped
by block**; only the within-block order needs to move, onto the archetype ladder from
`data/enemies.ts` — `wasp` 34 hp → `beetle` 46 → `hornet` 90 → `snail` 175 → `stag` 700 ×3 lives:

| # | Dish | Cuisine | Carried by | Rail |
|---|---|---|---|---|
| 1 | chai | Cafe | beetle · snail · stag | 5 |
| 2 | coffee | Cafe | wasp · hornet · stag | 2 |
| 3–7 | jeera-rice · naan · gobhi-masala · palak-aloo · **rajma** | North Indian | wasp→stag | 4,3,6,7,6 |
| 8–12 | idli · coconut-chutney · sambar · upma · **beans-poriyal** | South Indian | wasp→stag | 2,6,7,6,6 |
| 13–17 | minestrone · pesto · aglio-e-olio · arrabbiata · **risotto** | Italian | wasp→stag | 5,5,5,6,5 |
| 18–22 | bamboo-shoot-fry · veg-thukpa · sticky-rice · veg-momo · **ooti** | North East | wasp→stag | 6,6,2,5,7 |

Each cuisine therefore **ends on its boss dish**, and ooti — 7 ingredients, stag-carried, block 5 —
is the last card by every measure. **Chai is kept at #1 over coffee** although coffee's carriers are
the weaker pair: it is level 1's dish, the FTUE, and the game's signature. That one is taste, not data.

### 11.2d Three cost schemes, and why the literal sketch is the one to avoid

Today's totals to compare against: **176 shards** (22 × 8) and **3,300 gems** (22 × 150). Award rate
is `awardShards()`'s **+1 per dish per cleared wave**; gems are `gemsPerWave: 4` (`config.ts:224`).

| Scheme | Shape | chai → ooti | Total badges | vs today |
|---|---|---|---|---|
| **A — pure linear** (the sketch, 10/20/30…) | one step per card | 10 → 220 | **2,530** | **14.4×** |
| **B — flat per cuisine** | 5 prices | 10 → 52 | 680 | 3.9× |
| **C — cuisine base + step** | 5 bases, +2 within | 10 → 60 | 762 | 4.3× |

🔴 **A is the one to avoid, and it is worth being explicit about why**, because it is the user's
own sketch and it reads perfectly reasonably. Its top price is 220 badges on **ooti** — a dish that
appears only in levels 41–60, in a game with no level select, so every one of those 220 wave-clears
must come from a session already 40 levels deep. The price curve and the rarity curve multiply.
**A does not make ooti hard; it makes it decorative.**

**C is the recommendation.** Bases **10 / 16 / 26 / 38 / 52** with **+2 per archetype step**, gems at
**×10** (100 → 600):

| Cuisine | Badges | Gems |
|---|---|---|
| Cafe | 10, 12 | 100, 120 |
| North Indian | 16, 18, 20, 22, 24 | 160–240 |
| South Indian | 26, 28, 30, 32, 34 | 260–340 |
| Italian | 38, 40, 42, 44, 46 | 380–460 |
| North East | 52, 54, 56, 58, 60 | 520–600 |

Monotonic across all 22 with no collisions between tiers, every number legible on a card, a 6×
spread from chai to ooti rather than A's 22×, and the within-cuisine step encodes the enemy ladder
the player is already reading. Gems at ×10 keeps the shortcut honest: chai is 25 cleared waves'
worth, ooti 150.

⚠️ **Whatever scheme is picked, the award rate has to be set in the same pass.** Cost ÷ award is
what the player experiences, and `awardShards()`'s flat +1 was written against a flat 8. Leaving it
at +1 while the price climbs 6× is a decision, not a default — it should be made deliberately.

### 11.2e ✅ DECIDED Sep 24 — one Toque Badge sprite, value written beside it

*"Just one toque badge and write the value next to it."* One sprite, **147 credits**, read like the
gem counter: icon plus number, not N repeated pips. Settles §11.4.

### 11.2f Award rate under scheme C — recommendation: **+tier, not +1**

**The wave ladder makes this exact.** `LADDER` (`data/waves.ts:147`) is fixed and shared by every
block, and it is perfectly symmetric — **each of the five archetypes appears in exactly 4 of the 10
waves** (beetle W1/3/8/10, wasp W2/3/8/10, snail W4/6/9/10, hornet W5/6/9/10, stag W7/8/9/10). Block
1's FTUE override gives chai and coffee **8 of 10** each. Since blocks 2–5 map one dish per
archetype, **one full pass of a block pays each of its dishes +4** at today's flat +1.

🔴 **What the flat +1 does to scheme C.** Cost ÷ 4 per pass, times the levels a pass costs:

| Dish | Cost | Passes @ +1 | **Levels played** | Passes @ +tier | **Levels played** |
|---|---|---|---|---|---|
| chai | 10 | 1.3 | **12** | 1.3 | **12** |
| rajma | 24 | 6.0 | 120 | 3.0 | 60 |
| beans-poriyal | 34 | 8.5 | 255 | 2.9 | 85 |
| risotto | 46 | 11.5 | 460 | 2.9 | 115 |
| **ooti** | 60 | **15.0** | **750** | **3.0** | **150** |

At flat +1, **ooti costs 60× the levels chai does.** That is the two curves multiplying, measured:
the price climbs 6× *and* each unit of progress costs 5× more depth. Worse, it is **dead depth** —
`awardShards()` skips any dish whose scroll already exists, so a player who owns blocks 1–4 earns
nothing across the 46 levels of run-up and is playing purely to reach block 5's four stag/chaff
waves.

**Recommendation: award the dish's own cuisine tier, +1 / +2 / +3 / +4 / +5**, keyed to the dish's
home cuisine rather than the block being played — so fusion blocks 6–9 still pay a North-East dish
its +5. That flattens the grind to **1.3 → 3.0 passes across all 22 recipes**, while real difficulty
still climbs **12×** from chai to ooti, because a tier-5 pass means reaching level 50 and a tier-1
pass means reaching level 10. **Depth stays the difficulty; the price stays legible.** One number per
cuisine, and it is the same tier index the price table already uses — no second concept to explain.

**Full scheme C, both currencies, one table:**

| # | Dish | Cuisine | Badges | Gems | Award/wave |
|---|---|---|---|---|---|
| 1–2 | chai · coffee | Cafe | 10 · 12 | 100 · 120 | **+1** |
| 3–7 | jeera-rice · naan · gobhi-masala · palak-aloo · rajma | North Indian | 16 18 20 22 24 | 160–240 | **+2** |
| 8–12 | idli · coconut-chutney · sambar · upma · beans-poriyal | South Indian | 26 28 30 32 34 | 260–340 | **+3** |
| 13–17 | minestrone · pesto · aglio-e-olio · arrabbiata · risotto | Italian | 38 40 42 44 46 | 380–460 | **+4** |
| 18–22 | bamboo-shoot-fry · veg-thukpa · sticky-rice · veg-momo · ooti | North East | 52 54 56 58 60 | 520–600 | **+5** |

⚠️ **Caveat, corrected Sep 24.** Central first wrote that *"no run has ever been played to level
50 on any build"* and that the deep-tier figures were therefore unobserved. 🔴 **That was Central's
assumption, not a sourced fact, and it is wrong — the user has tested to level 100.** It was inferred
from the absence of any writer for `kitchen.bestLevel`, which shows only that depth is not
*recorded*, never that it was not *reached*. An empty telemetry field is not evidence about the
player.

What the level-100 run does and does not settle:

- ✅ **Depth is reachable.** Levels 41–60 (North East) and the whole Italian stretch are real play,
  not theory, so the tier-4/5 rows describe content people can get to.
- ✅ **Linear advance works** across all nine blocks without a level select, which is what the
  "every session restarts at level 1" reading predicted.
- ❓ **Still unmeasured, and it is the number the whole scheme rests on: how long one level takes.**
  Every figure in §11.2f is denominated in *levels played*, which only becomes a design judgement
  once it converts to minutes. At 20 s/level, ooti's 150 levels is ~50 minutes; at 90 s/level it is
  nearly four hours. **Get this from the user before the numbers are frozen.**
- ❓ **One cleared level = one cleared wave** is still only what `ladderPosition()`/`ladderFor()`
  imply structurally; a player who has been to 100 can confirm it in a sentence.

### 11.2g 📏 MEASURED Sep 24 — the stock-build playtest, and what it settles

**Source: `references/Errors/Playtest at stock maximum efficiency build.mp4`** (gitignored — 182 MB,
no LFS here). Duration read from the MP4 `mvhd` header: **402.6 s**. User: *"went all the way with
maximum efficiency … crossing 50 with stock utensils is almost impossible"*, finishing at **level 45**.

**⇒ 8.95 s/level**, and a full 45-level run costs **6.7 minutes**. That is the conversion every
number in §11.2f was waiting for.

🔴 **It also overturns Central's previous message.** On learning a level was ~9 s, Central said
tier-scaling was *"over-correction"* and the flat +1 was *"the better call"*. **That was computed
against 4 badges per block pass — a figure that assumes clearing all ten levels of the block, which
this very run shows a stock build cannot do.** Measuring the run-length and then reusing an
assumption the same run invalidates is the error; the two facts arrived together and only one was
applied. → **Retro 127.**

**What a stock build actually earns in block 5** (levels 41–50; the run ends at 45, so only ladder
positions 1–5 are ever cleared):

| NE dish | Carried by | Its waves | Per full pass | **Stock pass** | @+1 | @+5 |
|---|---|---|---|---|---|---|
| bamboo-shoot-fry | wasp | L42, 43, 48, 50 | 4 | 2 | 174 min | **35 min** |
| veg-thukpa | beetle | L41, 43, 48, 50 | 4 | 2 | 181 min | **36 min** |
| sticky-rice | hornet | L45, 46, 49, 50 | 4 | 1 | 376 min | **75 min** |
| veg-momo | snail | L44, 46, 49, 50 | 4 | 1 | 389 min | **78 min** |
| **ooti** | **stag** | **L47, 48, 49, 50** | 4 | **0** | ❌ | ❌ |

**✅ Tier-scaling is confirmed, on measurement rather than argument.** At flat +1 the last two
reachable North-East recipes cost **six and a half hours** apiece. At +5 they cost **just over an
hour**. The 4-per-pass symmetry that made flat +1 look survivable only exists for a player who can
already clear the block.

### 11.2h 🔴 Ooti cannot be earned at all on a stock build — decide this deliberately

Stag occupies ladder positions 7–10, so **ooti's only waves are levels 47–50** and a stock
max-efficiency run dies at 45. Not slow: **zero**. The same holds for any block-5 stag dish. Blocks
2–4's stag dishes (rajma L17–20, beans-poriyal L27–30, risotto L37–40) are all comfortably inside
reach, so **ooti alone sits behind the wall.**

This may well be *right* — the final recipe demanding a built-up board is a defensible capstone. But
it must be chosen, not inherited from a ladder position. Three ways:

1. **Accept it as the capstone.** Ooti is the reward for a maxed board, explicitly. Then its card
   should say so rather than showing an unmoving `0 / 60`.
2. **Bring its waves forward** so a stock build sees stag at least once (the block-1 FTUE override
   already proves per-block ladder overrides are supported).
3. **Pay on reach, not only on clear** — a badge for surviving to the wave, so a losing run at 47
   still advances ooti.

**➕ Two facts about these options, checked Sep 25, that change how they compare:**

- 🔴 **Option 2 touches a sealed file.** The ladder lives in `data/waves.ts`, which the record
  (`:55`, `:466`) lists as 🛑 **RE-SEALED** — unsealed once, for the v1.69.0 block-1 retune, and
  closed again. Moving stag earlier in block 5 therefore means an unseal, a balance re-run and a
  fresh baseline, because wave composition is exactly what the `35 / 36 / 11 / 4 / 90` baseline
  measures. **It is the cheapest-looking option and the most expensive one.**
- ⚠️ **Option 3 is a partial fix, not a general one.** `awardShards` is called from
  `towerScene.ts:1383` on wave clear — not a sealed file, so the change itself is cheap. But paying
  on *reach* only lowers the bar from "clear L47" to "reach L47", and the measured stock run ends at
  **45**. It closes a two-level gap, nothing more. Its real value is that progress becomes visible
  as a player approaches the wall instead of the card sitting at a flat zero — worth having, but it
  does not by itself make ooti earnable on a stock build.

**✅ That leaves option 1 as the recommendation**, since option 2 is expensive and option 3 does not
actually clear the wall on its own. Ooti as an explicit capstone costs no sealed-file risk and no
new system — only an honest card state. **Options 1 and 3 also compose**: name it a capstone *and*
pay on reach, so the player sees movement as they close in on it.

⚠️ **And the currency conflict is now concrete.** Reaching level 47 needs meta upgrades; meta
upgrades are bought with **gems** (`metaUpgradeCost`); §11.2f prices an ooti scroll at **600 gems**.
So the shortcut for the one recipe you cannot grind is also the thing that delays your ability to
grind it. **Recommendation: keep badges as the real path and treat gems as a deliberately steep
skip** — and price the tier-5 gem cost above, not below, a meaningful upgrade step, so buying the
scroll is never the efficient route to the scroll.

### 11.2i ✅ DECIDED Sep 25 — option 1, with the unlock level named on the card

*"The recipe shows 'Beat level n to unlock' where n is the first instance where that recipe shows
up. For FTUE level recipes … 'Complete training to unlock'."* This is what makes option 1 work: the
card stops showing a frozen `0 / 60` and states the one thing the player can act on.

🔴 **It also proves Central's §11.2c reorder wrong, and it should not be built.** §11.2c proposed
re-sorting each cuisine by enemy toughness (`wasp` 34 hp → `beetle` 46 → `hornet` 90 → `snail` 175
→ `stag` 700). But the ladder **introduces** archetypes in a different order — `beetle` W1, `wasp`
W2, `snail` W4, `hornet` W5, `stag` W7 — and the two disagree on two pairs (beetle/wasp,
snail/hornet). A card that prints its unlock level **must** be sorted by that level, or the grid
reads **L12, L11, L15, L14, L17** and looks broken. Sorting by a property the player cannot see,
when the design is about to print a property they can, was the error. → **Retro 128.**

✅ **And the order that is already shipped is exactly right.** `RECIPE_SLUGS` (`data/recipes.ts:10`)
matches introduction order for all 22 entries — verified by direct comparison, `True`. **No reorder
is needed; the file stays as it is.**

### 11.2j The breakdown table — final

Unlock level = first ladder position carrying that dish's archetype, plus its block offset.
Strictly increasing down the grid, and so are both prices. Stock ceiling is level 45 (§11.2g).

| # | Dish | Cuisine | Card says | Badges | Gems | Award | Stock build? |
|---|---|---|---|---|---|---|---|
| 1 | chai | Cafe | *Complete training to unlock* | 10 | 100 | +1 | ✅ |
| 2 | coffee | Cafe | *Complete training to unlock* | 12 | 120 | +1 | ✅ |
| 3 | naan | North Indian | Beat level **11** | 16 | 160 | +2 | ✅ |
| 4 | jeera-rice | North Indian | Beat level **12** | 18 | 180 | +2 | ✅ |
| 5 | palak-aloo | North Indian | Beat level **14** | 20 | 200 | +2 | ✅ |
| 6 | gobhi-masala | North Indian | Beat level **15** | 22 | 220 | +2 | ✅ |
| 7 | rajma | North Indian | Beat level **17** | 24 | 240 | +2 | ✅ |
| 8 | coconut-chutney | South Indian | Beat level **21** | 26 | 260 | +3 | ✅ |
| 9 | idli | South Indian | Beat level **22** | 28 | 280 | +3 | ✅ |
| 10 | upma | South Indian | Beat level **24** | 30 | 300 | +3 | ✅ |
| 11 | sambar | South Indian | Beat level **25** | 32 | 320 | +3 | ✅ |
| 12 | beans-poriyal | South Indian | Beat level **27** | 34 | 340 | +3 | ✅ |
| 13 | pesto | Italian | Beat level **31** | 38 | 380 | +4 | ✅ |
| 14 | minestrone | Italian | Beat level **32** | 40 | 400 | +4 | ✅ |
| 15 | arrabbiata | Italian | Beat level **34** | 42 | 420 | +4 | ✅ |
| 16 | aglio-e-olio | Italian | Beat level **35** | 44 | 440 | +4 | ✅ |
| 17 | risotto | Italian | Beat level **37** | 46 | 460 | +4 | ✅ |
| 18 | veg-thukpa | North East | Beat level **41** | 52 | 520 | +5 | ✅ |
| 19 | bamboo-shoot-fry | North East | Beat level **42** | 54 | 540 | +5 | ✅ |
| 20 | veg-momo | North East | Beat level **44** | 56 | 560 | +5 | ✅ |
| 21 | sticky-rice | North East | Beat level **45** | 58 | 580 | +5 | ⚠️ edge |
| 22 | **ooti** | North East | Beat level **47** | 60 | 600 | +5 | ❌ |

**Why each number is what it is.** The **level** is not invented — it is read straight out of
`LADDER`: beetle opens a block, wasp is second, snail fourth, hornet fifth, and the stag boss holds
position seven. So every cuisine hands out its five recipes on the same rhythm, ten levels later
each time. The **badge price** rises 2 per card inside a cuisine and jumps at each new cuisine, so
it tracks the unlock level without ever needing to mention it. The **award** is the cuisine's tier,
which is what keeps the grind at 2–3 passes everywhere (§11.2f) instead of ballooning to six hours
at the deep end (§11.2g).

**⚠️ Card states — three, not two.** *Locked* (never beaten that level) shows the sentence.
*Collecting* shows the badge bar. *Owned* shows Ramu's note, as today. Only the first is new.

**⚠️ A wording question worth one minute.** Strictly, beating level 17 does not *unlock* rajma — it
starts you **collecting** it. A player who beats 17, sees `0 / 24` appear and reads the earlier
promise as broken is a small but real cost. *"Beat level 17 to start collecting"* is accurate;
*"Beat level 17 to unlock"* is shorter and reads better. **User's call** — flagged, not decided.

**🔴 Round 19 dependency.** This adds **two new display strings** (`Beat level {n} to unlock`,
`Complete training to unlock`). Every display string belongs in `en.ts`, per `recipes.ts`'s own file
header. **They should land before the Hindi pass, not after**, or they miss the translation round
and Round 20 has to reopen it. Both are short and interpolation-safe; `{n}` is a numeral, which is
the one part of a Devanagari string that needs no translator judgement.

### 11.3 🔴 "Chef hats" is already a live currency with that exact name and icon

Belt mode already pays out **Chef Hats** and already ships the art:

- `KITCHEN_CONFIG.hats` — `perDish: 20`, `perLeftover: 2`, `perWalkoutAvoided: 25`,
  `clearBonus: 100` (`game/kitchenConfig.ts:648`)
- `kitchen.hats` is a persisted save field (`save.ts:48`)
- rendered as *"N Chef Hats"* next to the **`ui-chef-hat`** asset (`TestBelt.tsx:709`,
  `assets/manifest.ts:147`), on a screen reachable in the shipped build (`App.tsx:45`,
  `phase === 'testbelt'`)

A single shift pays **hundreds** of hats. If the recipe card also reads *"0 / 8 🎩"*, a player who
has just banked 340 Chef Hats will reasonably conclude those 340 should buy scrolls — and they do
not; the two are unrelated systems. **Two different quantities must not share a name and an icon.**
Three ways out, in order of preference:

1. **Unify them for real** — scrolls cost Chef Hats. Clean to explain, but hats are a flat shift
   score with no per-dish attribution, so per-recipe progress would have to be rebuilt.
2. **Keep both, give the shard its own identity** — the user's instinct with a different object
   (a *toque badge*, a *seal*, a *ladle pin*), so the icon still says "chef" without claiming the
   currency's name.
3. **Rename the belt currency** — cheapest in code, but it is the older system and renaming a
   currency a player has already banked is worse than renaming a new icon.

### 11.4 ❓ Open question before this can be costed

*"Each recipe's shard icon would be chef hats"* is ambiguous between **one hat shared by all 22
cards** and **22 distinct hats, one per recipe**. At imagegen's 147 credits/sprite that is the
difference between **147** and **~3,234 credits**, so it is the first thing to settle. The
progressive-cost half needs no art at all.

---

## 8. Previously held, still parked

- **Wave roster panel** (GDD §8) — held.
- **Regenerating the other eight backdrops** — held.
