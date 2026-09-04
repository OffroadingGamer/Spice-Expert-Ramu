# RecipeList — dishes, and the ingredients they call for

**Last updated:** Sep 4 2026, 20:14 IST (read from the system clock)
**Status:** 🟡 Ingredient inventory done, recipes pending — **user input required** (⬜ below)

Companion to [PropList.md](PropList.md). A recipe drives two things on screen at once:

- **The scroll (§5 of the layout proposal)** — dish *name* as one sentence, top-aligned
  and centred, with the finished-dish sprite below it.
- **The lower billboard (§2)** — the ingredient row, `[img 01] + [img 02] + …`,
  **images only, never the dish name.**

---

## 1. Ingredients we own

All from `Art/01 - Kitchen Essentials/`, sheet **`No-3-51.png`** unless noted. Identified
by eye from the art — **please correct any I've misread before these become ids.**

### 1a. Produce — the clearly readable ones

| Reads as | Sheet | Indian-kitchen fit |
|---|---|---|
| Mango / papaya (orange, green stem) | 3 | ★★★ |
| Okra / green chillies (3 pods) | 3 | ★★★ |
| Cherry tomatoes (cluster of 3) | 3 | ★★★ |
| Tomatoes (2, orange-red) | 3 | ★★★ |
| Peas in pod ×2 groupings | 3 | ★★ |
| Green / long beans, bundled | 3 | ★★ |
| Coriander or spinach leaves in a bowl | 3 | ★★★ |
| Guava / pear (green) | 3 | ★★ |
| Fried pieces — reads as pakora | 3 | ★★★ |
| Mushroom (single, tan) | 3 | ★ |
| Cabbage / lettuce head | 2 | ★★ |
| Broccoli / leafy greens | 2 | ★ |
| Spring onions or leeks, bundled | 2 | ★★ |
| Chillies + peppers in a basket | 2 | ★★★ |
| Potted herb | 2 | ★★ |
| Dried bundles, hanging ×2 | 2 | ★★ |

### 1b. Pantry, jars and staples

| Reads as | Sheet |
|---|---|
| Lentils / dal in glass jars — **3 colour variants** | 3 |
| Grain or flour jars ×2 | 2 |
| Ghee or oil jars, yellow ×2 | 3 |
| Oil bottle, amber | 2 |
| Spice shakers, orange ×3 | 3 |
| Pepper grinder + salt shaker | 3 |
| Pickle jars, green ×2 | 3 |
| Milk bottle | 3 |
| Berry or jam jar, purple | 3 |
| Bread / naan slabs in tins ×3 | 3 |
| Dough in a tin | 3 |
| Rice or grain in a pot | 2 |
| Cinnamon sticks / spice rolls | 2 |
| Spice bowls — yellow, green, red, teal | 1, 2 |

### 1c. Prepared dishes — usable as **finished-dish sprites** on the scroll

| Reads as | Sheet |
|---|---|
| Tomato curry in a pan | 3 |
| Curry / dal in pans ×2 | 2 |
| Bowl of rice or porridge | 1 |
| Bread loaf in a dish | 1 |
| Bread in a basket | 1 |
| Sauce bowl | 2 |
| Chillies / carrots in a pan | 1 |

> **Read on coverage:** strong on produce, jars and staples; genuinely strong on the
> Indian side (okra, chillies, dal, ghee, coriander, mango). Thin on **meat, paneer,
> eggs and rotis as raw items** — if a recipe needs those, they are generation jobs
> (`rundot generate image`), not pack items.

---

## 2. Schema

```json
{
  "id": "chana-masala",
  "name": "One chana masala, hot",
  "dishSprite": "dishes/chana-masala.png",
  "ingredients": ["chickpeas", "tomato", "onion", "garam-masala"],
  "requires": ["stockpot", "grinder"]
}
```

- **`name`** is the single sentence on the scroll. Write it as a pass call, not a menu
  label — *"One chana masala, hot"* beats *"Chana Masala"*.
- **`ingredients`** is the billboard row, in order, joined by `+`. **That order is
  display order.** Whether it is also *required* order is decided per interaction by
  `after` in [PropList.md](PropList.md), not here — see GDD §10.3a.
- **🔒 The row doubles as the progress readout.** Each image lights up or ticks off as
  its step is satisfied, so a player can see a doomed dish in time to spend the dustbin
  skip on it. Required, not polish.
- **`requires`** is derived from PropList interactions; keep it explicit so a level can
  be validated as solvable with the props it offers.

### The overflow rule (§2 of the proposal)

The ingredient row must fit the lower billboard with **no overflow**, shrinking image
scale to fit. Concretely:

```
slot = (billboardInnerWidth - (n - 1) * plusWidth - 2 * pad) / n
scale = min(1, slot / nativeIngredientWidth)
```

Scale-tween on recipe change so the row settles rather than snapping. **Set a floor**
(~0.45) below which a recipe is rejected at authoring time rather than rendered
illegibly — at phone widths that lands around **5–6 ingredients max**. Worth knowing
before the recipes are written.

---

## 3. ⬜ Awaiting your input

1. **Confirm or correct the identifications in §1** — my names come from looking at
   cartoon art, and an id is forever once level data references it.
2. **The recipe list itself** — dish name, ingredient sequence, finished-dish sprite.
3. **How many ingredients per recipe**, and whether that grows with difficulty.
4. ~~Does ingredient order matter?~~ ✅ **Answered Sep 4, 20:05 IST: gated order**
   (GDD §10.3a). Author levels 1–2 with no gates; introduce them from level 3. What is
   still needed from you is **which chains are gated** — e.g. knead → bake, marinate →
   grill.

---

## 4. Billboard states — recorded from your spec

`Art/Billboard.png` is a dual hanging board: thin upper panel, deep lower panel, two
struts, two hanging rods. Currently line art only — no fill, no styling.

| Panel | Content | States |
|---|---|---|
| **Upper (thin)** | Walk-outs left, centred | `WALK-OUTS LEFT: n` · `WALK-OUTS LEFT: ∞` (endless bonus rounds) · `FAILED` on wave loss · **`READY?` as a button** during the build phase |
| **Lower (deep)** | Ingredient images only, centred, `+`-joined | Scale-tweens to fit; never overflows |

> The upper panel is a **button in one state and a readout in three others.** Worth
> making the READY? state visually unmistakable — a player who does not notice it is a
> player who thinks the game has stalled.
