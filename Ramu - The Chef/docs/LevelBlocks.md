# Level Block Spec — the nine blocks of Challenge Mode

**Status:** ✅ **Complete.** Every parameter is decided; the only work left is
execution. §5d's Overtime step fractions are approved as a *structure* and get
tuned by `npm run balance`, not re-decided.

🔒 **Decided Sep 10 2026:** *one belt, nine themes.* All nine blocks share a single
path, a single slot array and a single `PATH_LENGTH`. Blocks differ by theme, by
dish set, and by nothing else mechanical.

---

## 1. Fixed for every block

| Constant | Value | Where |
|---|---|---|
| Belt path | one serpentine, entry top-left → exit bottom-right | `CONFIG.path` |
| Path length | ~2440 after the sidebar narrowing (was 2650) | `waves.ts` `PATH_LENGTH` |
| Build slots | 10 (8 current + row A right + row C centre) | `CONFIG.pads` |
| Sidebar | 140 design units, right edge; belt's right leg `x610 → x540` | 🔒 confirmed Sep 10 |
| Breather levels | ones digit 1–5 | `isBreatherLevel()` |
| Boss level | ones digit 0 | `isBossLevel()` |
| Enemy archetypes | 5, fixed stats | `data/enemies.ts` 🛑 sealed |

**The five archetypes never change — only which dish is painted on them.**

| id | role | hp | speed | walkouts | threat¹ | glow |
|---|---|---|---|---|---|---|
| `beetle` | grunt | 46 | 90 | 1 | 1.70 | none |
| `wasp` | rusher | 34 | 150 | 1 | 2.09 | none |
| `snail` | tank | 175 | 55 | 1 | 3.94 | 🔴 **red** |
| `hornet` | elite | 90 | 160 | 1 | 5.90 | 🔴 **red** |
| `stag` | boss | 700 | 50 | **3** | **43.03** | 🟡 **light gold** |

¹ `hp × speed × walkouts / 2440`.

---

## 2. Per-block parameters

| # | Parameter | Status |
|---|---|---|
| 1 | Levels | fixed decade |
| 2 | `RUSH:` label | ✅ §5a |
| 3 | Dish set | ✅ §5a |
| 4 | Wave ladder | ✅ §5c — **identical for all blocks** |
| 5 | Slot bonuses | ✅ §5b — **identical for all blocks** |
| 6 | Background | ✅ §5a themes; art generation pending (§7) |
| 7 | ~~NPCs~~ | 🚫 **Not in Challenge Mode.** Decided Sep 10 2026: NPCs belong to the belt rounds. |

🔴 **There is no "mix" parameter.** Decided Sep 10: blocks differ by node and
theme only. ⚠️ **Consequence, accepted knowingly:** with one belt, one curve and
one wave ladder, the nine blocks are mechanically identical — the variety is
visual. That is a legitimate jam-scope choice, recorded so nobody re-litigates it.

---

## 3. Constraints

- 🔒 **Block 1 is two dishes only — Chai and Coffee.** It is the FTUE, and a narrow
  roster *"will prevent beginner's fatigue and encourage the players to pursue."*
  Both dishes appear on **multiple archetypes**; the glow tier tells them apart.
- 🔴 **Dish count and archetype count are independent.** Block 1 is 2 dishes across
  5 archetypes; blocks 2–5 are 5 dishes across 5; blocks 6–8 are 10 across 5.
- 🔒 **The 4 Basics dishes are belt-mode only** — `dal-cooked`, `dal-tadka`,
  `bhindi-fry`, `tomato-gravy` appear in **no** Challenge Mode block.

---

## 4. The dish pool

All 30 at `Art\_gen\dishes-final\tray-*.png`, registered as `dish-*` in
`manifest.ts`.

| Group | n | Slugs |
|---|---|---|
| **N0 Beverages** | 2 | `chai` · `coffee` |
| ~~Basics~~ | 4 | 🚫 belt-mode only |
| **N1 North Indian** | 6 | `baingan-bharta` · `naan` · `rajma` · `jeera-rice` · `gobhi-masala` · `palak-aloo` |
| **N2 South Indian** | 6 | `coconut-chutney` · `upma` · `rasam` · `idli` · `beans-poriyal` · `sambar` |
| **N3 Italian** | 6 | `pesto` · `aglio-e-olio` · `minestrone` · `bruschetta` · `arrabbiata` · `risotto` |
| **N4 North East** | 6 | `xaak-bhaji` · `bamboo-shoot-fry` · `veg-thukpa` · `sticky-rice` · `ooti` · `veg-momo` |

---

## 5a. The nine blocks — dishes and themes

🔒 Set by the user Sep 10 2026.

| # | Levels | Node | Theme | `beetle` | `wasp` | `snail` 🔴 | `hornet` 🔴 | `stag` 🟡 | Omitted |
|---|---|---|---|---|---|---|---|---|---|
| **1** | 1–10 | N0 · FTUE | **Cafe** | chai | coffee | chai | coffee | chai **+** coffee | — |
| **2** | 11–20 | N1 | **North Indian Dhaba** | naan | jeera-rice | palak-aloo | gobhi-masala | rajma | baingan-bharta |
| **3** | 21–30 | N2 | **South Indian Dhaba** | coconut-chutney | idli | upma | sambar | beans-poriyal | rasam |
| **4** | 31–40 | N3 | **Italian Cookout** | pesto | minestrone | arrabbiata | aglio-e-olio | risotto | bruschetta |
| **5** | 41–50 | N4 | **North-East Indian Eatery** | veg-thukpa | bamboo-shoot-fry | veg-momo | sticky-rice | ooti | xaak-bhaji |
| **6** | 51–60 | N4 & N3 | **NE Indian & Italian Fusion Cafe** | B5 **+** B4 | B5 **+** B4 | B5 **+** B4 | B5 **+** B4 | B5 **+** B4 | — |
| **7** | 61–70 | N3 & N2 | **Italian & S. Indian Fusion Dhaba** | B4 **+** B3 | B4 **+** B3 | B4 **+** B3 | B4 **+** B3 | B4 **+** B3 | — |
| **8** | 71–80 | N2 & N1 | **S. Indian & N. Indian Fusion Dhaba** | B3 **+** B2 | B3 **+** B2 | B3 **+** B2 | B3 **+** B2 | B3 **+** B2 | — |
| **9** | 81+ | Overtime | **5-star Royal Indian Restaurant** | inherits block 8's double set | | | | | — |

**Blocks 6–8 carry a *double set*:** every archetype has two dishes, one from each
contributing block. 🔒 **They alternate per spawn** (decided Sep 10 2026), so both
cuisines are visible in every wave.

---

### The `RUSH:` labels

🔒 Approved Sep 10 2026 (the planning agent's defaults, accepted as proposed).
Blocks 6–8's full fusion names run past 30 characters, so the labels shorten them
rather than truncating at render time.

| Block | Theme | `RUSH:` label |
|---|---|---|
| 1 | Cafe | `CAFE` |
| 2 | North Indian Dhaba | `NORTH INDIAN` |
| 3 | South Indian Dhaba | `SOUTH INDIAN` |
| 4 | Italian Cookout | `ITALIAN` |
| 5 | North-East Indian Eatery | `NORTH EAST` |
| 6 | NE Indian & Italian Fusion Cafe | `NE FUSION` |
| 7 | Italian & South Indian Fusion Dhaba | `ITALIAN FUSION` |
| 8 | South Indian & North Indian Fusion Dhaba | `DESI FUSION` |
| 9 | 5-star Royal Indian Restaurant | `OVERTIME` |

---

## 5b. Slot bonuses — identical in every block

🔒 Set by the user Sep 10 2026. Rows A and D (single-leg coverage) carry nothing;
rows B and C carry all three stats, mirrored.

```
        A1      A2            A1 —            A2 —
    B1  B2  B3            B1 fireRate   B2 range   B3 damage
    C1  C2  C3            C1 damage     C2 range   C3 fireRate
    D1      D2            D1 —            D2 —
```

| Slot | Bonus | Slot | Bonus |
|---|---|---|---|
| A1 | — | C1 | `damage` ×1.5 |
| A2 | — | C2 | `range` ×1.5 |
| B1 | `fireRate` ×1.5 | C3 | `fireRate` ×1.5 |
| B2 | `range` ×1.5 | D1 | — |
| B3 | `damage` ×1.5 | D2 | — |

**B2 and C2's ×1.5 range is exactly the light-blue / dark-blue AoE drawn on
`001 - Challenge round - Level schematics.png`.**

🔴 **Six of ten slots are bonused — up from two.** Measured against a fully-maxed
board (10 maxed Tandoors, full meta).

⚠️ **The first three rows are PRE-Round-I and are kept only as history.** They were
measured against the flat-splash engine, where a Tandoor dealt full damage to every
enemy in its radius — the defect Round I fixed. **Do not size anything against them.**

| Board | Engine | Deepest any enemy reached |
|---|---|---|
| 8 slots, 1 bonus (post-Round-H) | flat splash | 14% — survived all 120 |
| 10 slots, 2 range bonuses | flat splash | 12% — survived all 120 |
| 10 slots, 6 bonuses (approved) | flat splash | 10% — survived all 120 |
| **10 slots, 6 bonuses (approved)** | **post-Round-I (`ed2ef78`)** | **100% — LOSES at level 86** |

✅ **The instruction that stood here — *"the balance round must size its curve against
this board"* — is retired: that round is Round I, and it landed on Sep 10 2026.** The
same board that held every enemy inside 10% of the belt across 120 levels now reaches
the end of the belt on four levels and loses at 86. See the
[Implementation Handover Record](Implementation%20Handover%20Record.md), Round I.

🔴 **Known gap, carried forward:** that board still holds enemies to **~11% at level
40** (ordinary builds reach 43–55%).

⚠️ **The reason is NOT convergent targeting**, which is what Round I reported and what
`waves.ts` still claims. Measured: **at level 40 only 3 of the 10 towers ever fire, 7 are
idle, and the whole wave is 12 enemies killed by essentially one Tandoor.** The belt is
empty, not contested. Tower participation and belt depth rise together as headcount
rises (2/10 towers at level 20 → 10/10 at level 80; 7% depth → 100%). **Density is the
lever** — Round J acts on it. See the
[Implementation Handover Record](Implementation%20Handover%20Record.md).

---

## 5c. The wave ladder — identical in every block

🔒 Set by the user Sep 10 2026. `W` is the wave's position inside its block
(level 34 → block 4, W4).

| W | Spawns | Reads as |
|---|---|---|
| 1 | `beetle` | the basic order |
| 2 | `wasp` | something faster |
| 3 | `beetle` + `wasp` | both at once |
| 4 | `snail` 🔴 | a tough one |
| 5 | `hornet` 🔴 | a tough one that's fast |
| 6 | `snail` + `hornet` 🔴 | both tough at once |
| 7 | `stag` 🟡 | the boss |
| 8 | `stag` + W3 | boss over chaff |
| 9 | `stag` + W6 | boss over elites |
| 10 | `stag` + W3 + W6 | everything |

**Block 1 varies W7–W9 only**, because it has two dishes on `stag`:
W7 = `stag`→chai · W8 = `stag`→coffee · W9 = both · W10 = mixture of W3, W6, W9.

🔒 **Block 1's balance target, in the user's words:** *"W10 is clearable and losing
is hard until W11 but winning also isn't exactly that easy, the sweet spot."*
See §6b for what that has to mean mechanically.

---

## 5d. Overtime (block 9, levels 81+) — 🔒 STRUCTURE APPROVED Sep 10 2026

🔒 **User's shape:** a repeating 10-level loop of **2 breathing · 5 amateur tough ·
3 brutal**, each loop scaling harder than the last.

Let `c = floor((level − 81) / 10)` (the loop index) and `p = (level − 81) mod 10`.

| `p` | Band | Step | Composition |
|---|---|---|---|
| 0–1 | **Breathing** | +4% of step base | W3 shape — `beetle` + `wasp` |
| 2–6 | **Amateur tough** | +15% | W6 shape — `snail` + `hornet`, one `stag` from p≥3 |
| 7–9 | **Brutal** | +35% | W10 shape — `stag`-led, count rising with `p` |

Step base = `13 × 1.7⁸ × 1.6ᶜ` — i.e. the authored curve's own growth continued,
then compounding **per loop** instead of per decade, which is what makes each loop
harder than the last.

**What that produces** (starting from level 80's authored 1760):

| Level | 81 | 82 | 83 | 85 | 87 | 88 | 90 | 100 | 110 |
|---|---|---|---|---|---|---|---|---|---|
| Threat | 1796 | 1832 | 1968 | 2240 | 2512 | 2829 | **3463** | **6189** | **10551** |

Loop 1 roughly doubles across its ten levels; each later loop is steeper. For
comparison, the pre-existing projection reached only 8604 at level 110.

⚠️ **Every number here is a starting point to be tuned by `npm run balance`, not a
result.** The bands and the loop structure are the decision; the fractions are not.

---

## 6a. Glow tiers — replaces the earlier "boss hat" idea

🔒 Decided Sep 10 2026. Enemy sprite size stays **uniform** — *"Boss sprites need
not be larger, just apply a glow effect."*

| Tier | Archetypes | Glow |
|---|---|---|
| 1 | `beetle` · `wasp` | none |
| 2 | `snail` · `hornet` | 🔴 red hue |
| 3 | `stag` | 🟡 light golden hue |

**The glow is a tier indicator, not a boss badge.** It is driven by archetype id,
so it is automatic in all nine blocks and needs no per-block art.

🔴 **Do NOT implement it with `sprite.tint`.** That channel is already owned by
status effects — `towerScene.ts` sets green for poison and orange for burn
(:419–429). A tint-based glow would fight them, and a poisoned `stag` would lose
its tier read. **Use a soft radial sprite behind the tray**, tinted per tier. That
also avoids adding `pixi-filters`, which is not a dependency today (`pixi.js`
core only).

---

## 6b. ⚠️ Block 1's "sweet spot" — the honest reading

The target is *cannot really lose, but winning isn't easy*. Those two pull apart,
and only one resolution is honest:

- ❌ **Restoring lives at level end** (Round H does this through level 5) makes
  losing impossible but also makes the tension theatrical — nothing the player
  does changes the outcome.
- ✅ **Tune W1–W10 so a competent build ends around 5–7 of 10 escapes.** Leaks are
  real and visible, the margin is wide, and a careless player can still be at 2.

🔒 **APPROVED Sep 10 2026 — the second, and the level-end restore is retired.**
Sim criterion: the `balanced` strategy leaks at least once in W4–W10 and finishes
block 1 with 5–8 lives; `miser` still dies.

🔒 **APPROVED — block 1's `stag` is a teaching boss**, at roughly ⅓ HP (~245 of
700). Same 3-escape cost, same golden glow, same ladder position. Without it,
block 1's W7 sits at 43 threat against a 21 budget and W9/W10 at 86 against 29/50
— all 2–3× over their own curve, which makes *"losing is hard until W11"*
impossible. With it, W7 lands at 15/21, W9 at 30, W10 at ~46/50.

🔥 **Framed as design, not patch: block 1's boss teaches what a boss is.** It looks
and costs exactly like every other block's, so the lesson transfers — it simply
cannot kill you.

---

## 7. Backgrounds

🔒 **Full-field illustrated backdrops, not tileable tiles.** The mockups place
bespoke props at fixed positions, which cannot tile.

- Nine images — one per block plus Overtime.
- The `TilingSprite` at `towerScene.ts:88` becomes a plain `Sprite` fitted to the
  playfield, with a crossfade between blocks.

### ✅ DELIVERED Sep 11 2026 — nine backdrops

`jam-entry/public/images/bg-block-1.jpg` … `bg-block-9.jpg`, **720×1280 JPEG**.
Generated with `gemini-3.1-flash-image-preview` at `--seed 4471`, one shared style
stanza plus a per-block theme clause. Sources and full prompts are retained in the
**gitignored** `Art/_gen/backdrops/`; block 2 ships its `take2` frame (`take1` baked in
faint belt/pad-shaped ghost outlines, fixed by negative-prompting them).
Verified: **117.6–119.5 KB each, 1,095,341 B for the nine.**

🔒 **Block 9 ships VERTICALLY FLIPPED, decided Sep 11 2026.** The belt enters top-left and exits bottom-right, but the generated Overtime scene put the **serving table at the top and the spice station at the bottom** — dishes arriving where they should be served and leaving where they should be prepped. The flip puts spices at the entry and the serving pass at the exit. ⚠️ **Known and accepted cost:** the chandelier ends up at the bottom and the lighting gradient runs opposite to the other eight blocks. Regenerating from the retained prompt was offered and declined; at board scale, beneath the belt and towers, the chandelier reads as a corner fixture. **Do not 'correct' this later.** Re-derived from `bg-block-9-take1.png` with the flip applied so the JPEG is encoded once, not twice.

➕ **The general point, for any future backdrop work:** all nine were generated before the generator was told where the belt enters and exits. Block 9 is only where it became visible, being the one scene with explicit entry/exit furniture.

✅ **The composition brief held** — low contrast through the belt corridor, detail at
the edges. Measured greyscale stdev, centre band vs left edge, is lower in **all nine**
(block 3: 21.2 vs 51.8; block 9: 33.3 vs 65.8).

✅ **ASPECT ERROR — found and fixed Sep 11 2026.** This section originally specified
**720×1650** (1 : 2.29), which was wrong: the board is `CONFIG.boardHeight = 1280`
against `DESIGN_WIDTH` 720 — **720×1280, exactly 9:16**, and `config.ts` notes it never
stretches. The first delivery obeyed the spec, so **370 px — 22% of every backdrop —
would have been cropped when fitted**, and the detail sits precisely in the top and
bottom fifths, which is exactly what that crop removes.

🔥 **The generator's native output was already correct: 768×1376 is the board's
ratio.** It had been centre-cropped to 1650 only to satisfy this section's number.
Re-derived from those retained uncropped frames at **720×1280**, losing **11 px of
height (0.8%)** instead of 22%.

✅ **No upscale was needed and none was spent.** 768×1376 → 720×1280 is a *downscale*
throughout; upscaling first cannot add detail that a later downscale below the source
resolution would only discard. Pure Lanczos resample, zero image-generation credits.
JPEG quality was solved per image against a ~120 KB budget (q61–75; the low end is
block 5's dense bamboo weave, inspected and artefact-free).

⚠️ **The payload figure this section carried — "a current total image payload well
under 300 KB" — was wrong**, and was flagged in-place as an estimate. Measured Sep 11:

| Bundle | Files | Bytes |
|---|---|---|
| `critical` (blocks first paint) | 15 | **491,669 B (0.47 MB)** |
| `deferred` (background-loaded) | 88 | 1,676,409 B (1.60 MB) |
| `public/images/` total, after the backdrops | — | 3,495,977 B (3.33 MB) |

🔴 **Which is why the backdrops MUST stay in `deferred` with block N+1 prefetched
during block N.** One backdrop promoted into `critical` would add ~120 KB to a 0.47 MB
first paint — a ~25% slower first load, paid by exactly the first-time players Daily
Unique Plays counts. ⚠️ **And `deferred` is background-loaded, which Challenge Mode
does not await** — see the dish-art race in [Tasks.md](Tasks.md); the same trap catches
backdrops unless the wiring awaits them.

---

## 8. The wave roster panel

🔒 Decided Sep 10 2026. Solves `EnemyDef.name` being rendered nowhere today.

- Between waves: bottom holds **READY FOR NEXT WAVE**, sidebar holds **BUILD TOWERS**.
- **During a wave**, that space hot-swaps to the **pre-disclosed recipe list** — the
  dishes this wave spawns, each named, boss floating and glowing.
- Wave ends → back to the Ready button.

✅ Costs no layout; reuses space a between-rounds feature already vacates.
➕ Makes the roster known in advance, turning building into an informed decision.

---

## 9. 🔒 Source schematics

**Path:** `Ramu - The Chef\references\Level Schematics\`

| File | What it is | Decisions it sourced |
|---|---|---|
| `001 …png` | The board, **annotated** — AoE overlays, "NEW PROP SLOT" callouts | 10-slot layout · centre-slot `range` bonuses · rows A–D |
| `002 …png` | The same board, **clean** — HUD, build rail, ghost slots, LVL badges | HUD relabel · 140-unit sidebar · ghost slots · §8's Ready space |
| `003 …jpg` | Six aesthetic variations | Themes for blocks 1–5 and Overtime |
| `004 …jpg` | Three fusion aesthetics, full HUD | Themes for blocks 6–8 |

⚠️ **Two notes, for the record.**

1. 🔒 **Committed Sep 10 2026** at the user's instruction (~1.95 MB across four
   files), alongside the rest of `references/`.
2. ⚠️ **The repo is public**, and `001`/`002` are a photobash over a third-party
   game's UI — branding blacked out, but its tower names (*Dart Gun, Spike Trap,
   Bomb Pot, Workbench*) and price chips remain legible. `003`/`004` are original.
   The user was told and chose to commit. **Nothing shipped derives from them** —
   our towers stay Grill / Prep Board / Tandoor / Fryer at 60–110.

---

## 10. Tower prop reskin — 🔒 mapping SET Sep 10 2026

The user asked me to propose the sequencing. **No art needs generating: 44 Kitchen
Essentials props are already deployed** in `public/images/` as `prop-*` aliases,
sitting in `deferred`, licence cleared (toxiccolors).

🔴 **CORRECTION, same day.** An earlier draft of this section said the four
stations still draw *"the Sep 4 insect kit's animal PNGs."* **That is wrong.**
`public/images/tower-bear.png` is a clay tandoor with glowing coals — the four
`tower-*.png` files were AI-generated on Sep 4 ([Plan.md](Plan.md) §1b, seed 4471)
and already depict grill / prep board / tandoor / fryer correctly.

⚠️ **So the reskin is a *style* change, not a correctness fix**, and that is the
better argument for it: the dish trays shipped in Round G are pixel art from the
Essentials pack, while the stations are smooth generated illustration. The two do
not sit in one frame — the same objection [SpriteIndex.md](SpriteIndex.md) §5
raises about mixing packs. The user's playtest note *"tower sprites still
original"* is that mismatch, not a wrong subject.

**So this is Round G's move again**, exactly: repoint four `art()` calls, move the
chosen aliases `deferred` → `critical`, drop the four `tower-*.png` entries.

🔥 **And it buys something the current towers don't have: visible upgrades.** Most
prop families ship `l1/l2/l3` variants, and a tower has exactly three levels. The
mockup already labels them LVL 1 / 2 / 3 — this makes the sprite match the badge.

🔒 **Set by the user Sep 10 2026**, from
`Art\_sliced\01 - Kitchen Essentials\props`. Verified: all twelve files exist and
are already deployed in `public/images/`.

| Station | id | Lv1 | Lv2 | Lv3 |
|---|---|---|---|---|
| **Grill** | `fox` | `prop-stock-pot-l1` **40** | `-l2` **41** | `-l3` **42** |
| **Prep Board** | `owl` | `prop-pressure-cooker-l1` **23** | `-l2` **24** | `-l3` **25** |
| **Tandoor** | `bear` | `prop-cooktop-l2` **07** | `prop-cooktop-l3` **08** | `prop-cooktop-l5` **10** |
| **Fryer** | `squirrel` | `prop-sauce-pot-l1` **32** | `-l2` **33** | `-l3` **34** | 🔴 **REMAPPED Sep 11** — see below |

⚠️ **The props/ numbers are sprite indices, not tier numbers**, so two families do
not map onto `-l1/-l2/-l3`. The Tandoor takes Cooktop **07/08/10** — *without
anything → with Oven → Cooktop & Tandoor* — deliberately skipping `06` and `09`.
The Fryer takes Fry pan **15/16/17**, skipping `14` and `18`.

➕ **Note for anyone reading belt-mode docs alongside this:** there, *"Tandoor"*
means Cooktop L4/L5 ([RecipeList.md](RecipeList.md) §7.5), and the Naan level
pre-places `09` specifically. Challenge Mode's Tandoor **tower** is a different
selection (07/08/10). The two modes share sprite `10`; nothing conflicts, but the
word means different things in each.

✅ **Payload: +31 KB.** The twelve props total 285 KB against the 254 KB of
`tower-*.png` they replace, and the swap is `critical`-neutral — the four old
files leave `critical` as the twelve enter it.

### 🔴 Sprite dimensions are inconsistent, and it will break the upgrade read

Measured:

| Station | Lv1 | Lv2 | Lv3 |
|---|---|---|---|
| Grill | 90×118 | 94×117 | 91×118 |
| Prep Board | **146×102** | 94×103 | 102×103 |
| **Tandoor** | **118×131** | **158×261** | **246×191** |
| Fryer | 66×91 | 80×69 | 99×87 |

Under a per-sprite contain-fit into the fixed 64-unit tower slot, the Tandoor
would appear **tall and narrow at Lv2, then short and wide at Lv3** — the upgrade
reads as a squash, and Prep Board Lv1 would look bigger than Lv2.

✅ **Fix: fit per FAMILY, not per sprite.** Compute one bounding box across a
station's three sprites, scale all three by that single factor, and anchor at the
bottom edge so they sit on the pad consistently. Then scale each family so its
largest tier fills the slot. Within a station the upgrade visibly grows; across
stations every Lv3 reads at the same nominal size.

**This is the same defect the user raised about enemy sprites** — *"the size
shouldn't variate, uniform fit model to be adopted"* — appearing again on the
tower side, and it needs the same answer.

---

📝 **A stale flag retracted.** An earlier draft of this section reported a naming
discrepancy — props `40–42` called *Stovetop* in
[SpriteIndex.md](SpriteIndex.md) §6.17/§6.18 but aliased `prop-stock-pot`. The
files on disk are `40-Stock pot(Level1)` … `42-Stock pot(Level3)`, **ascending and
correctly named**. SpriteIndex's warning about descending Stovetop tiers describes
a state that was already fixed. No discrepancy exists; the doc section is just out
of date.

🔴 **The Fryer was remapped Sep 11 2026 — the Fry pan art is not a fry pan.**
Opened during verification of the visual round: `prop-fry-pan-l2/l3/l4` (and `l1`/`l5`)
render **bowls of finished food** — greens in a bowl, a stew, an orange soup with a
spoon. 🔥 **That is the same category of object as the enemies**, so a Fryer tower
would have looked like the dishes it shoots at. A readability bug, not a naming quibble.

The three other untaken 3-tier families were opened rather than chosen by name:

| Family | Verdict |
|---|---|
| Sauce pan **29/30/31** | Three near-identical red pots that *shrink* (84×83 → 79×81 → 75×81). No upgrade read. |
| Rice cooker **26/27/28** | Covered pot → tan cooker → green box. Three different objects; reads as substitution. |
| **Sauce pot 32/33/34** | ✅ **Chosen.** Equipment, consistent silhouette, consistent size (107×117 / 99×117 / 98×118) so the per-family fit lands clean. |

⚠️ Sauce pot's Lv2→Lv3 progression is mild — accepted, because *equipment rather than
food* is the part that decides readability. ✅ **This is Retro 88 again, and it held:
every one of these was opened, not inferred from its filename.** The Fry pan family is
the second asset in this project whose name did not describe its contents.

⚠️ **Tandoor's dimensions are non-monotonic** (Lv2 158×261, Lv3 246×191) so no single
shared factor makes it grow *and* cap. Inspected and **accepted**: it reads as small
oven → tall range → wide flaming grill, and the flames carry the upgrade even though
Lv3 is shorter. Same for Prep Board (Lv1 146×102 vs Lv2/3 ~94–102×103).

⚠️ **Payload must be measured, not assumed** — 12 prop PNGs enter `critical` as
256 KB of tower art leaves. Round G's net was a win; this one needs checking.

**Proposed sequencing:**

1. **Balance round** — engine, curve, blocks data. No art dependency.
2. **Art generation** — the 9 backdrops only (§7). Runs in parallel with 1.
3. **Visual round** — tower reskin + backdrops + sidebar + ghost slots + HUD
   relabel + roster panel. ✅ **Tower reskin belongs here, not earlier**, because
   the build sidebar *displays tower art* — building those cards around sprites
   we're about to replace means laying them out twice.
4. **Round B** — Warrior achievements, once station naming is final.

---

## 11. 🔒 HUD nomenclature — the long-owed rename

Set by the user Sep 10 2026 via the `002` schematic. **This closes the
nomenclature brief owed since the Sep 10 playtest**, where the ask was recorded as
*"Rush 30 Overtime nomenclature needs to be modified."*

| Now (`Hud.tsx`) | Becomes | Why |
|---|---|---|
| `🚪 10` | ❤️🏃 **ESCAPES LEFT: 10** | Names what a lost life *is* — a customer walking out. `🚪` named nothing. |
| `💵 26599` | 💰 **CASH: 27,166** | Same reason; the icon alone was ambiguous. |
| `Rush 83 · Overtime` (:214) | **WAVE 84** large, **RUSH: OVERTIME** beneath | 🔥 **They stop being the same counter.** WAVE is the absolute level; **RUSH is the block label** (§5a). So level 34 reads `WAVE 34 / RUSH: SOUTH INDIAN`, and the old string's redundancy disappears. |

⚠️ **Prices are NOT rescaled.** The `$900–$2500` chips in the `002`/`004`
schematics are the source image's furniture. Our towers stay **60–110**
(decided Sep 10) — the consumable sink (§12) absorbs late-game cash instead.

---

## 12. 🔒 The coin sink — non-tower consumables

**The problem, measured:** 10 slots × 3 tower levels caps total possible spend at a
few thousand coins, against a player holding **27,166 at wave 84**. Round H cut
income; income was never the issue. **A ceiling cannot be fixed by a rate.**

🔒 **Decided Sep 10 2026: a non-tower sink**, chosen over more upgrade tiers, more
pads, or a wave re-roll.

✅ **It needs no new engine system.** [status.ts](../../jam-entry/src/game/data/status.ts)
already defines **slow, frozen, poison, burn and knockback**, and the engine applies
all five — a board-wide, one-wave effect bought in the build phase reuses that
pipeline whole. Only an application site and a button are new.

🔴 **Price must scale with level**, or a 27,000-coin bank buys the whole system out
at rush 30. Something of the form `base × threat(level) / threat(10)` keeps a
purchase costing a comparable share of income at level 20 and at level 80.

---

### ✅ SHIPPED in Round I (`ed2ef78`) — three Kitchen Actions

Bought in the build phase from a button row in the HUD; **one purchase per kind per
wave**, cleared when the wave ends ([`engine.ts:641`](../../jam-entry/src/game/sim/engine.ts)).
Price is `round(base × threat(level) / threat(10))`, as specified above.

| Action | Base | Effect | Applied at |
|---|---|---|---|
| **Deep Freeze** | 60 | `frozen` on every enemy on the belt | wave start (`engine.ts:305`) |
| **Turn Up The Heat** | 90 | `burn` added to every projectile hit, splash victims included | each hit (`engine.ts:478, 592, 599`) |
| **Slow Service** | 45 | `slow`, `factor 0.6`, `duration 4s` | wave start (`engine.ts:309`) |

✅ **Why three, and why these.** They are the three effects
[status.ts](../../jam-entry/src/game/data/status.ts) already implements that read
clearly as *kitchen* verbs — freezing, heating, slowing service. Poison and knockback
were left out: neither has a kitchen reading a player would guess from the name.

✅ **Why Heat costs double Slow.** Freeze and Slow are one-shot effects on the enemies
currently on the belt — their value is capped by that headcount. Heat is a **multiplier
on the whole board's output for the entire wave**, so it scales with tower count, fire
rate and splash radius; on a built-out board it is worth far more than the other two.
Slow is deliberately the cheapest so there is always something affordable.

🔴 **Why one purchase per kind per wave.** This is what makes it a *sink* rather than a
*stockpile*. Without the cap a 27,000-coin bank could be dumped into one hard wave and
trivialise exactly the levels the curve exists to make dangerous.

---

## 13. Round sequencing

🔒 Decided Sep 10 2026.

| # | Round | Contents | Depends on |
|---|---|---|---|
| 1 | **Balance** | splash falloff · sim runs full meta · restore `hpMult`/`speedMult` · concurrent spawn entries · uniform enemy size · glow tiers · belt geometry + 10 slots · all nine blocks' data · the ladder · Overtime loops · the sink | — |
| 2 | **Art generation** | the nine backdrops (§7), regenerated from the `003`/`004` thumbnails | runs in parallel with 1 |
| 3 | **Visual** | tower reskin (§10) · backdrops · build sidebar · ghost slots · HUD relabel (§11) · wave roster panel (§8) | 1 and 2 |
| ~~4~~ | ~~**Round B**~~ | ~~Warrior achievements, GDD §10.11b~~ | 🔴 **CUT Sep 11 2026** |

🔴 **Round B is cut.** Decided by the user Sep 11 2026, on discovering that the
build gate is **CP8 — final deploy verified public, Sep 14 23:30 IST** ([Plan.md](Plan.md)
§gates), not the Sep 19 scoring deadline. Sep 14–18 is the judging window: **no code
changes possible**. Warrior achievements are last in the queue, depend on the visual
round finishing, and contribute nothing to Daily Unique Plays. There is no room.

✅ **The tower reskin sits in round 3, not earlier**, because the build sidebar
*displays tower art*: laying those cards out around sprites we are about to replace
means doing it twice.
