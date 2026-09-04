# PropList — stations that sit in the prop slots

**Last updated:** Sep 4 2026, 20:24 IST (read from the system clock)
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

**Prop candidates read off sheet 1** (my identification from the art — correct me where
I've misread):

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

| Prop | Art | Verb | Feedback |
|---|---|---|---|
| **Kadhai** | P-16, sheet 1 | fry | `sizzle` · oil-splatter · shake 4 · 200 ms |
| **Handi** | P-10, sheet 1 | simmer / boil | `bubble` · steam-plume · shake 2 · 320 ms |
| **Masala grinder** | P-17, sheet 1 | grind | `grind` · dust-puff · shake 5 · 260 ms |
| **Tandoor** | P-19, sheet 2 | bake / char | `roar` · ember-puff · shake 3 · 220 ms |

**Why these four:** between them they carry nine interactions and cover every chain in
the level 1–5 recipes. The Tandoor is the signature — it is the only prop in either
pack that already reads Indian without a repaint.

### 3b. Two more, from level 3

| Prop | Art | Verb | Why it arrives late |
|---|---|---|---|
| **Prep counter** | P-08, sheet 1 | knead | It is the **gate producer** — the only prop that tags an ingredient `kneaded`. Introducing it *is* the gate tutorial |
| **Masala dabba** | P-18, sheet 1 | season | Second gate. Tiny sprite change, so it teaches that a gate can be subtle |

> ⚠️ **P-08 is the identification I am least sure of.** I read it as a wooden counter
> with a built-in oven; I want it as a plain prep counter. If the oven detail is
> unmistakable this becomes a crop job, or we borrow a counter module from the isometric
> pack and repaint it. Worth your eye before it becomes an id.

### 3c. Stretch — only if time allows

| Prop | Art | Verb | Note |
|---|---|---|---|
| **Rice cooker** | P-09, sheet 1 | boil rice | Deliberately *worse* than the Handi: one job instead of two, so it should cost far less. That is the whole economy lesson in one pair of props |
| **Chai urn** | P-04, sheet 1 | brew | `milk → chai`. The strongest thematic beat we are not using — but **`chai` has no sprite**, so it is the first generation job, not a pack item |

---

## 4. The interaction graph — every transform, all sprite-backed

`after` is what the ingredient must already carry; `tags` is what it carries onward.

| Prop | `in` | `out` | `after` | Sprite for `out` |
|---|---|---|---|---|
| Prep counter | `flour` | `dough` | — | dough in a tin, sheet 3 |
| Prep counter | `mango` | `mango-pickle` | — | green pickle jar, sheet 3 |
| Tandoor | `dough` | `naan` | `kneaded` | naan slabs in tins, sheet 3 |
| Handi | `dal-raw` | `dal-cooked` | — | dal in a pan #1, sheet 2 |
| Handi | `rice-raw` | `rice-cooked` | — | bowl of rice, sheet 1 |
| Masala dabba | `dal-cooked` | `dal-tadka` | `simmered` | dal in a pan #2, sheet 2 |
| Kadhai | `okra` | `bhindi-fry` | — | chillies/carrots in a pan, sheet 1 |
| Kadhai | `tomato` | `tomato-gravy` | — | tomato curry in a pan, sheet 3 |
| Kadhai | `cabbage` | `pakora` | — | fried pieces, sheet 3 |
| Grinder | `whole-spices` | `garam-masala` | — | spice bowl, sheet 1/2 |
| Grinder | `coriander` | `green-chutney` | — | sauce bowl, sheet 2 |

> ⚠️ **A spawn may carry initial tags, and it has to.** Levels 2, 4 and 5 spawn
> `dough` ready-made rather than `flour`, and ready-made dough *is* kneaded — so its
> spawn entry declares `"tags": ["kneaded"]` and the tandoor accepts it. Without this the
> `after` gate would reject every pre-made ingredient, which is not what a gate is for.
> **A gate asks what has happened to an ingredient, not which prop did it.**

Tags produced: Prep counter → `kneaded`; Handi → `simmered`; Grinder → `ground`;
Kadhai → `fried`; Tandoor → `baked`.

Note how much the props double up. The **Handi covers dal and rice**, the **Kadhai
covers three ingredients**, the **Grinder covers two**. That is not tidiness — it is
the reason four slots are enough, which §5 makes precise.

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
