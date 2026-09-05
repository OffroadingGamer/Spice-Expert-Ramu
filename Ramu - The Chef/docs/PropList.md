# PropList — stations that sit in the prop slots

**Last updated:** Sep 6 2026, 01:51 IST (read from the system clock)
**Status:** 🟡 Inventory done, **picks proposed Sep 4, 20:24 IST** — awaiting sign-off (⬜ §3)

Companion to [RecipeList.md](RecipeList.md). Props are what the old build called
towers. They do **not** shoot. A prop reacts to an ingredient passing it on the belt:
sizzle SFX, a VFX puff, a shake/tween — and, if the prop's recipe interaction matches
the ingredient, **the ingredient sprite hot-swaps in place without changing its
momentum along the belt.**

---

## 1. What we own

### 1a. Front-facing props — `Art/01 - Kitchen Essentials/`

Three sheets, **128 items total**, hand-drawn cartoon with dark outlines, muted
brown/grey/cream palette. **Front-facing, not isometric** — which is exactly what §3 of
the layout proposal asks for.

> ⚠️ **"16x16" in the filename is the tile grid, not the item size.** Sheet 1 is
> 1920×1916 at 120 columns of 16 px. Each *item* spans many tiles — roughly 100–150 px
> square. Slicing is per-item by hand or by bounding box, not a uniform 16 px grid.

| Sheet | Items | Contains |
|---|---|---|
| `No-1-37.png` | 37 | **Appliances and cookware.** The richest prop source |
| `No-2-40.png` | 40 | Cookware, pots, a few raw ingredients |
| `No-3-51.png` | 51 | Mostly ingredients and jars — see RecipeList |

> 🛑 **The `P-xx` table below is SUPERSEDED by [SpriteIndex.md](SpriteIndex.md), Sep 4 20:24 IST.** Those labels were eyeballed off the whole sheet at once. Every sheet has since been sliced on its alpha channel into individually numbered, named items — use `S1-12` style ids. Three of the old picks turned out to be **dishes, not stations**, so §3 was re-pinned. Kept here only to explain the older references.

**Prop candidates read off sheet 1** (superseded — see above):

| # | Reads as | Natural interaction |
|---|---|---|
| P-01 | Countertop microwave / small oven | reheat |
| P-02 | Stacked pots on a stand | steam |
| P-03 | Wooden shelf, mugs + bread | serve / hold |
| P-04 | Espresso machine (two variants) | brew — chai |
| P-05 | Wooden cabinet | storage, decorative |
| P-06 | Full gas range with oven | the workhorse cook |
| P-07 | Produce sacks (two variants) | raw ingredient source |
| P-08 | Wooden counter with built-in oven | bake |
| P-09 | Rice cooker | boil rice |
| P-10 | Large white stockpot | simmer / dal |
| P-11 | Covered dish with ladle | plating |
| P-12 | Water dispenser | liquid |
| P-13 | Glass storage jars ×2 | dry goods |
| P-14 | Wooden barrel / canister ×2 | storage |
| P-15 | Basket of bread | bread station |
| P-16 | Pan of chillies/carrots | fry |
| P-17 | Dark grinder / urn | grind — masala |
| P-18 | Colour-coded spice bowls (yellow/green/red) | season |

**And from sheet 2, the single best one:**

| # | Reads as | Why it matters |
|---|---|---|
| P-19 | **Wood-fired oven, visible flames** | The only prop that already reads as a tandoor. Strong candidate for the signature station |

### 1b. Isometric set — `Art/02 - Kitchen Props/`

Muted pink/mauve/cream isometric pack. Contains long **counter/cabinet run modules**
that tile — the intended source for the conveyor belt (§4) — plus stoves, tables,
plates, pots, crates, plants, chairs.

> ⚠️ **Palette clash to resolve.** This pack is light pastel pink/cream. The shipped
> game ground is `#14141a` kitchen dark with `#ff6b1a` accents, and the Essentials
> props are muted brown/grey. Three palettes in one frame. Cheapest fix is a colour
> pass on the belt modules toward the dark ground; decide before art time is spent.

---

## 2. Schema — what a prop needs

Proposed JSON, one entry per prop. Lives beside the level data, not in `sim/`.

```json
{
  "id": "tandoor",
  "name": "Tandoor",
  "sprite": "props/tandoor.png",
  "slot": "any",
  "feedback": { "sfx": "sizzle", "vfx": "ember-puff", "shake": 3, "tweenMs": 220 },
  "interactions": [
    { "in": "dough", "out": "naan", "after": "kneaded", "tags": ["baked"] }
  ]
}
```

- **`interactions`** is the whole mechanic. An ingredient whose id matches an `in`
  swaps to `out` as it passes. No match → the prop still plays its feedback, but the
  ingredient continues unchanged.
- **🔒 `after` is the gate — decided Sep 4, 20:05 IST (GDD §10.3a).** Optional. When
  present, the swap only fires if the ingredient has already been through a step with
  that tag. Arriving early plays the feedback and **visibly leaves the sprite alone** —
  which is the failure message, at no build cost.
- **Omit `after` and the prop is order-free.** A level with no gates anywhere plays
  exactly as a checklist, so levels 1–2 ship ungated and gates start at level 3.
  Difficulty is an authoring dial, not a code change.
- **Momentum is never touched.** The swap is a texture change on a moving sprite.
- **`slot`** reserved for later, if some props only fit certain slots.

---

## 3. Proposed picks — Sep 4 2026, 20:24 IST · ⬜ awaiting your sign-off

You asked to work these out rather than hand back a questionnaire, so this is a
**complete proposal, not a menu.** One constraint shaped all of it:

> 🔒 **Every `out` state below has a sprite we already own.** Not one transform in
> this proposal is a generation job. That is why the verbs are *knead, grind, fry,
> simmer, bake, season* and not *chop* — a chopped onion has no sprite in either pack,
> so chopping cannot be a visible state in v1.

### 3a. The first four — enough for levels 1–5

**Re-pinned Sep 4, 20:24 IST** against [SpriteIndex.md](SpriteIndex.md). Three of my
earlier picks were **dishes, not stations** — the old "P-16, pan of chillies" I wanted as
the fry station is S1-31, a *bowl of cooked chillies*. Slicing the sheets caught that.

| Prop | Sprite | Verb | Feedback |
|---|---|---|---|
| **Kadhai** | **S1-14** gas range with oven | fry | `sizzle` · oil-splatter · shake 4 · 200 ms |
| **Handi** | **S1-12** footed cauldron | simmer / boil | `bubble` · steam-plume · shake 2 · 320 ms |
| **Masala grinder** | **S1-36** dark urn on a pedestal | grind | `grind` · dust-puff · shake 5 · 260 ms |
| **Tandoor** | 🔥 **S2-05** wood-fired range, lit | bake / char | `roar` · ember-puff · shake 3 · 220 ms |

**Why these four:** they carry every chain in the level 1–5 recipes between them. S2-05 is
the signature — **the only lit, flaming station in either pack**, and the only one that
reads Indian without a repaint. S1-12 is a near-perfect handi as drawn.

### 3b. Two more, from level 3

| Prop | Sprite | Verb | Why it arrives late |
|---|---|---|---|
| **Prep counter** | **S1-17** wooden counter | knead | The **gate producer** — the only prop that tags an ingredient `kneaded`. Introducing it *is* the gate tutorial |
| **Masala dabba** | **S2-13/14/15** the three spice bowls | season | Second gate. A trio of bowls, so the colour can match what is being added |

> ✅ **The P-08 worry is resolved.** Seen at full size as S1-17, the wooden top dominates
> the sprite and already carries two pans; the oven is a small inset panel underneath. It
> reads as a counter. **No crop needed.**

### 3c. Stretch — only if time allows

| Prop | Sprite | Verb | Note |
|---|---|---|---|
| **Rice cooker** | **S1-19** copper rice cooker | boil rice | Deliberately *worse* than the handi: one job instead of two, so it should cost far less. That is the whole economy lesson in one pair of props |
| **Chai urn** | **S1-04** espresso machine | brew | `milk → chai`. The strongest thematic beat we are not using — but **`chai` has no sprite**, so it is the first generation job, not a pack item |

---

## 4. The interaction graph — every transform, pinned to a real sprite

`after` is what the ingredient must already carry; `tags` is what it carries onward.
Every `in` and `out` below is a numbered item in [SpriteIndex.md](SpriteIndex.md).

| Prop | `in` | `out` | `after` | Container changes? |
|---|---|---|---|---|
| Prep counter | `flour` **S1-15** | `dough` **S1-28** | — | sack → bowl |
| Prep counter | `mango` **S3-01** | `mango-pickle` **S3-06** | — | fruit → jar |
| Tandoor | `dough` **S1-28** | `naan` **S1-32** | `kneaded` | ✅ **no — bowl to bowl** |
| Handi | `dal-raw` **S3-16** | `dal-cooked` **S2-30** | — | jar → pan |
| Handi | `rice-raw` **S2-26** | `rice-cooked` **S1-07** | — | jar → pan |
| Masala dabba | `dal-cooked` **S2-30** | `dal-tadka` **S2-31** | `simmered` | ✅ **no — pan to pan** |
| Kadhai | `okra` **S3-24** | `bhindi-fry` **S1-31** | — | loose → bowl |
| Kadhai | `tomato` **S3-10** | `tomato-gravy` **S3-32** | — | loose → pan |
| Kadhai | `cabbage` **S2-02** | `pakora` **S3-34** | — | ✅ **no — loose to loose** |
| Grinder | `whole-spices` **S2-09** | `garam-masala` **S2-15** | — | sticks → bowl |
| Grinder | `coriander` **S3-43** | `green-chutney` **S2-14** | — | ✅ **no — bowl to bowl** |

> ⚠️ **A hot-swap works best when only the food changes, not the container.** A dish
> that jumps from a sack to a bowl mid-belt reads as *substitution*; one that stays in the
> same vessel and only changes colour reads as *cooking*. Four pairs above already have
> this. **The tandoor's `dough → naan` is one of them** — which is lucky, because it is
> the signature interaction of the whole game. The weak pairs are the raw-produce ones,
> and those are the least surprising: a tomato genuinely does go into a pan.

Tags produced: Prep counter → `kneaded`; Handi → `simmered`; Grinder → `ground`;
Kadhai → `fried`; Tandoor → `baked`.

> ⚠️ **A spawn may carry initial tags, and it has to.** Levels 2, 4 and 5 spawn `dough`
> ready-made rather than `flour`, and ready-made dough *is* kneaded — so its spawn entry
> declares `"tags": ["kneaded"]` and the tandoor accepts it. Without this the `after` gate
> would reject every pre-made ingredient, which is not what a gate is for. **A gate asks
> what has happened to an ingredient, not which prop did it.**

Note how much the props double up. The **handi covers dal and rice**, the **kadhai covers
three ingredients**, the **grinder covers two**. That is not tidiness — it is the reason
four slots are enough, which §5 makes precise.

---

## 5. 🔒 Two authoring invariants that fall out of the Λ-belt

These are the load-bearing findings from this pass. Both are cheap to check at authoring
time and expensive to discover in playtest.

### 5.1 Solvability — distinct props ≤ slot count

Every item passes **every** slot exactly once, so a recipe is solvable only if the set of
*distinct* props its chains require fits the level's slot count. **Ingredients per recipe
is the wrong number to watch; distinct props is the right one.**

All five proposed recipes land inside **4 slots**, including the five-ingredient thali,
precisely because props double up. A sixth distinct prop would need a fifth slot.

> This meets Specs §8b from the other side. That ceiling is about *legibility* and says
> **5 ingredients comfortable, 6 at the floor**. This one is about *solvability* and says
> **5 ingredients fit 4 slots, 6 usually will not.** Two unrelated derivations landing on
> the same number is a good sign the layout is honest. **Design the row for 5.**

### 5.2 A level may never want one ingredient both raw and processed

The belt cannot route around a prop, so placing the Grinder turns **every** coriander
into chutney. A recipe asking for both fresh coriander *and* green chutney is unsolvable,
and the validator should reject it.

The flip side is the best mechanic to come out of this pass, and it costs zero art:

> 🔒 **The over-processing fail.** Some ingredients are *correct raw* — fresh
> coriander, a green chilli garnish. Placing the wrong prop ruins them. So a prop is not
> a strictly good purchase, and the player's question stops being *"can I afford it"* and
> becomes *"do I want it on this belt at all."* Level 1 teaches it for free.

---

## 6. Answers to the open questions

| Question | Proposed answer | Why |
|---|---|---|
| Bought with coins, or fixed per level? | **Bought with coins**, as towers were | Keeps the shipped economy, the tap-to-place UX and the sell refund. §5.2 gives a purchase a real downside, which a fixed loadout would throw away |
| Can a prop be upgraded? | **No — sell and replace only, in v1** | Upgrade tiers cost art we do not have, and the tension already lives in slot scarcity. Revisit after the jam |
| What happens at the tray if the dish is incomplete? | **Wrong state → walkout −1, and the billboard row does not tick** | Wrong *is* the fail. It also makes the row a live readout: you can see a dish is doomed while it is still on the belt, which is what turns the dustbin skip into a decision rather than a panic button |
| Can two props act on one ingredient in one pass? | **Yes — that is the point** | The Λ passes all slots. `flour → dough → naan` is two props in one pass, and it is the level-3 lesson |

---

## 7. 🔄 Corrections — Sep 5 2026, 21:19 IST

Three entries above are now wrong. They are left in place because other documents cite
them; this section is what supersedes them.

### 7.1 §6 — "Can a prop be upgraded? **No**" is **reversed**

The reason recorded for that answer was *"upgrade tiers cost art we do not have."* The
rename pass ([SpriteIndex.md](SpriteIndex.md) §6.14, §6.18) found **39 of 44 props
tiered across 13 families**, Cooktop and Fry pan five deep. The stated reason no longer
exists.

**The replacement is not the same mechanic.** Props are *not* upgraded in place:

> A tier is **unlocked permanently** by earning stars, and then **placed at a higher
> cost** on any level whose theme allows that family. The lower tier stays placeable, so
> the choice is a live one every round: one strong station, or two weak ones.

This also fixes a cosmetic bug in the shipped tower defence, where pressing upgrade never
changed the sprite — in the belt, a different tier *is* a different sprite.

### 7.2 §3b — the Prep counter points at the wrong sprite

§3b assigns **knead** to `S1-17`, described as a wooden counter. After the rename pass
`S1-17` is `props/06-Cooktop only oven(Level1)`. **The role had quietly lost its sprite.**

Knead — and now assembly — belong to the **Dough making counter** family:

| props/ | Sheet id | Tier |
|---|---|---|
| 11 | S1-29 | Level 1 |
| 12 | S2-01 | Level 2 |
| 13 | S1-03 | Level 3 |

It carries two verbs: **knead** (`flour → dough`, the `kneaded` gate producer) and
**assemble** (no-cook dishes, which have no other station now that Container has left the
prop vocabulary). Assembly feedback: a generated cloud scale-tweening above the counter,
and a chopping-knife SFX.

### 7.3 §1a / §3 — Wok and Container are no longer props

- **Wok** was retired by absorption; `S2-21` is `props/17-Fry pan(Level4)`. A recipe that
  says *Wok* means **Fry pan at Level 4 or above** — a tier requirement, reachable
  through the loaner rule ([KitchenMode.md](KitchenMode.md) §6, decision 6).
- **Container** is an **ingredient**, not a station. Labelled vessels are drawn off
  `S3-50` (`Untagged/23`) at 2–5 minutes each. See
  [RecipeList.md](RecipeList.md) §6.3.

### 7.4 ⚠️ The §4 interaction graph needs re-pinning wholesale

Three of the eleven rows in §4 point at sprites that changed meaning during the rename
pass:

| §4 says | Actually is now |
|---|---|
| Prep counter, `S1-17` | `props/06-Cooktop only oven(Level1)` — §7.2 |
| `flour` **S1-15** | `props/36-Spice grinder(Level2)` — flour has **no sprite** |
| `tomato-gravy` **S3-32** | `Untagged/62 — UI prop, Serving tray(Curry)` |

All three are the same error: ids pinned before the sheets were sliced and named. **Do not
patch these row by row.** The graph is re-pinned in one pass once the `Untagged/`
hand-sort names the ingredient sprites — until then any individual fix is a guess against
the same unnamed set that produced the mistakes.

