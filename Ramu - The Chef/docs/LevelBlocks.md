# Level Block Spec — the 8 blocks of Challenge Mode

**Status:** complete as of Sep 10 2026 except §5c's Overtime numbers, which are a
**proposal awaiting approval**. Dish assignments, wave ladder and glow tiers are
all set by the user.

🔒 **Decided Sep 10 2026:** *one belt, eight themes.* All 8 blocks share a single
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
| 2 | `RUSH:` label | ⬜ pending |
| 3 | Dish set | ✅ §5a |
| 4 | Wave ladder | ✅ §5b — **identical for all blocks** |
| 5 | Slot bonuses | ✅ §5d — **identical for all blocks** |
| 6 | Background | ✅ §5a themes; art generation pending (§7) |
| 7 | ~~NPCs~~ | 🚫 **Not in Challenge Mode.** Decided Sep 10 2026: NPCs belong to the belt rounds. |

🔴 **There is no "mix" parameter.** Decided Sep 10: blocks differ by node and
theme only. ⚠️ **Consequence, accepted knowingly:** with one belt, one curve and
one wave ladder, the eight blocks are mechanically identical — the variety is
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

## 5d. Slot bonuses — identical in every block

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
board (10 maxed Tandoors, full meta), this is the strongest defence yet tested:

| Board | Deepest any enemy reached, levels 1–120 |
|---|---|
| 8 slots, 1 bonus (post-Round-H) | 14% of the path |
| 10 slots, 2 range bonuses | 12% |
| **10 slots, 6 bonuses (approved)** | **10%** |

Every step of the level design has made the defence stronger. **The balance round
must size its curve against this board, not against Round H's.**

---

## 5b. The wave ladder — identical in every block

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

## 5c. Overtime (block 9, levels 81+) — 🔒 STRUCTURE APPROVED Sep 10 2026

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
- ⚠️ **Payload is the risk.** Nine detailed 720×1650 images could be several MB
  against a current *total* image payload well under 300 KB. *Estimate, not
  measured.* Ship JPEG not PNG, keep all in `deferred`, prefetch block N+1 during
  block N.
- The `TilingSprite` at `towerScene.ts:88` becomes a plain `Sprite` fitted to the
  playfield, with a crossfade between blocks.

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

## 10. Tower prop reskin — proposal, Sep 10 2026

The user asked me to propose the sequencing. **The answer turned out to be much
cheaper than expected: no art needs generating at all.**

`textures.ts` sources the four stations through `art('tower-fox' | 'tower-owl' |
'tower-bear' | 'tower-squirrel')` against the Sep 4 insect kit's animal PNGs —
**256 KB, all in `critical`.** Meanwhile **44 Kitchen Essentials props are already
deployed** in `public/images/` as `prop-*` aliases, sitting in `deferred`, licence
cleared (toxiccolors).

**So this is Round G's move again**, exactly: repoint four `art()` calls, move the
chosen aliases `deferred` → `critical`, drop the four `tower-*.png` entries.

🔥 **And it buys something the current towers don't have: visible upgrades.** Most
prop families ship `l1/l2/l3` variants, and a tower has exactly three levels. The
mockup already labels them LVL 1 / 2 / 3 — this makes the sprite match the badge.

| Station | id | Proposed family | Levels available |
|---|---|---|---|
| Grill | `fox` | `prop-cooktop` | l1–l5 |
| Prep Board | `owl` | `prop-dough-counter` | l1–l3 |
| Tandoor | `bear` | `prop-stock-pot` *or* `prop-sauce-pot` | l1–l3 |
| Fryer | `squirrel` | `prop-fry-pan` | l1–l5 |

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
