# PropList — stations that sit in the prop slots

**Last updated:** Sep 4 2026, 20:15 IST (read from the system clock)
**Status:** 🟡 Inventory done, picks pending — **user input required** (marked ⬜ below)

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
    { "in": "dough",  "out": "naan",         "after": "kneaded" },
    { "in": "paneer", "out": "paneer-tikka" }
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

## 3. ⬜ Awaiting your picks

1. **Which props ship?** The sketch has 4 slots. Name 4–8 from §1a so there is a
   choice to make when building.
2. **Each prop's interactions** — the `in → out` pairs. This is the design work; it
   defines what the game actually is.
3. **Whether props are bought with coins** as towers were, or are fixed per level.
4. **Whether a prop can be upgraded**, or replaced only.

---

## 4. Open questions I'd want answered before this is built

- ~~Does an ingredient need props in order?~~ ✅ **Answered Sep 4, 20:05 IST: gated
  order.** Optional `after` prerequisites, most interactions order-free. GDD §10.3a.
- **What happens at the tray if the recipe isn't complete?** Presumably a walkout —
  worth stating.
- **Can two props act on one ingredient in one pass?** The belt is Λ-shaped, so an
  ingredient passes the upper slots once each.
