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

## 8. Previously held, still parked

- **Wave roster panel** (GDD §8) — held.
- **Regenerating the other eight backdrops** — held.
