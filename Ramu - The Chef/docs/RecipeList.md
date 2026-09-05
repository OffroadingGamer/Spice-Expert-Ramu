# RecipeList — dishes, and the ingredients they call for

**Last updated:** Sep 5 2026, 21:19 IST (read from the system clock)
**Status:** 🟡 Inventory done, **recipes proposed Sep 4, 20:24 IST** — awaiting sign-off (⬜ §3)

Companion to [PropList.md](PropList.md). A recipe drives two things on screen at once:

- **The scroll (§5 of the layout proposal)** — dish *name* as one sentence, top-aligned
  and centred, with the finished-dish sprite below it.
- **The lower billboard (§2)** — the ingredient row, `[img 01] + [img 02] + …`,
  **images only, never the dish name.**

---

## 1. Ingredients we own

> 🛑 **SUPERSEDED by [SpriteIndex.md](SpriteIndex.md), Sep 4 20:24 IST.** All three
> sheets have been sliced into **129 individually numbered, named items** with contact
> pages you can read at full size. The eyeballed table below is kept only to explain
> older references. **Use `S3-24` style ids.**

All from `Art/01 - Kitchen Essentials/`, sheet **`No-3-51.png`** unless noted. Identified
by eye from the art — superseded, see above.

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

## 3. Proposed recipes — Sep 4 2026, 20:24 IST · ⬜ awaiting your sign-off

Five levels, built from the interaction graph in [PropList.md](PropList.md) §4. **Every
ingredient and every finished state is a sprite we already own** — this progression is
buildable without one generation job.

| # | The scroll reads | Row | Raws that spawn on the belt | Props needed | Gate |
|---|---|---|---|---|---|
| **1** | *"One dal chawal, jaldi"* | 3 | `dal-raw`, `rice-raw`, `coriander` | **Handi** | — |
| **2** | *"Naan and bhindi, table four"* | 3 | `dough`, `okra`, `coriander` | Tandoor, Kadhai, Grinder | — |
| **3** | *"Naan and dal, from scratch"* | 3 | `flour`, `dal-raw`, `coriander` | Prep, Tandoor, Handi | 🔒 `kneaded` |
| **4** | *"Dal tadka, extra masala"* | 4 | `dal-raw`, `rice-raw`, `dough`, `coriander` | Handi, Dabba, Tandoor, Grinder | 🔒 `simmered` |
| **5** | *"Thali, full"* | 5 | `dough`, `dal-raw`, `rice-raw`, `okra`, `coriander` | Tandoor, Handi, Kadhai, Grinder | — |

The billboard rows in full — *italic* means the item is wanted **raw**:

1. `dal-cooked` + `rice-cooked` + *`coriander`*
2. `naan` + `bhindi-fry` + `green-chutney`
3. `naan` + `dal-cooked` + *`coriander`*
4. `dal-tadka` + `rice-cooked` + `naan` + `green-chutney`
5. `naan` + `dal-cooked` + `rice-cooked` + `bhindi-fry` + `green-chutney`

### What each level teaches

- **L1 — one prop, two jobs.** The Handi cooks both the dal and the rice, so the first
  thing learned is that a prop is worth more than one ingredient. The coriander is wanted
  **raw**: buy the Grinder anyway and it turns to chutney and the dish fails. That is the
  over-processing lesson (PropList §5.2), delivered in level 1, for free.
- **L2 — three props, three chains, no gate.** A pure checklist, which is exactly what
  GDD §10.3a promised an ungated level would feel like.
- **L3 — the gate arrives.** Flour spawns instead of dough. Put the Tandoor *before* the
  prep counter on the belt and the flour sails past it untouched, gets kneaded too late,
  and arrives as dough. **Nothing explains this; the belt does.**
- **L4 — the second gate, and a subtle one.** `dal-cooked → dal-tadka` is a small sprite
  change, so the player has to read the row rather than the belt.
- **L5 — the capstone.** Five ingredients, four props, every slot full and no room for a
  mistaken purchase. The row renders at **scale 0.64** (Specs §8b) — the working target,
  now verified against a real recipe rather than assumed.

### ⬜ Still yours to decide

1. **Confirm or correct the §1 identifications.** Still the real blocker — an id is
   forever once level data references it.
2. **The names.** *"One dal chawal, jaldi"* is my ear, not yours, and the scroll is where
   the game's voice lives. These five lines carry more character than anything else in
   the build.
3. **Whether five levels is the jam scope**, or the first act of something longer.

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

---

## 5. 🔒 Authoring validation — three checks before a level ships

Derived in PropList §5. All three are cheap static checks over the recipe JSON, and all
three are expensive to discover in playtest.

1. **Distinct props required ≤ slots available.** Not ingredient count — *distinct
   props*. All five recipes above pass at 4 slots.
2. **No ingredient appears both raw and processed in one recipe.** The Λ-belt cannot
   route around a prop, so such a level is unsolvable by construction.
3. **Row length ≤ 5** (Specs §8b). Six renders at scale 0.49, on the legibility floor.

Worth writing as a script the day the recipe data exists, not the day a level feels
wrong.

---

## 6. 🔒 The recipe format and the node run — Sep 5 2026, 21:19 IST

### 6.1 The format — the user's, recorded verbatim

```
Dish = "Ingredient" + "Oil" + "Secondary ingredient" + Spices (which ones)
       + Utensil (Skillet / Pressure Cooker / Container / Tandoor / Oven /
                  Saucepan / Fry Pan / Wok)
```

The two worked examples given:

```
Kaddu Curry     = Pumpkin      + Ghee         + Spices           + Cooker
Karela Bhujiya  = Bitter Gourd + Mustard oil  + Onion  + Spices  + Skillet
```

**Recipes are written in their simplest form that still tastes right** — no dish earns
a step it does not need. A secondary ingredient is left blank where the dish genuinely has
none, as Kaddu Curry does.

Two amendments from [KitchenMode.md](KitchenMode.md) §6:

- **`Container` leaves the utensil slot** — it is an ingredient. Where a dish needs
  assembly rather than cooking, the utensil is the **Dough Making Counter**.
- **`Wok` means Fry Pan at Level 4 or above**, not a separate station.

### 6.2 🔒 The row arithmetic finally closes

The billboard row caps at **5 cells** ([Specs.md](Specs.md) §8b). Under decisions 7
and 8:

| Cell | Carries |
|---|---|
| 1 | Primary ingredient |
| 2 | Oil |
| 3 | Secondary ingredient |
| 4 | **The node's masala** — one container, however many spices went into it |
| 5 | *spare* — a garnish, or a second secondary |

**Four cells against a ceiling of five, with one spare.** This was the tightest constraint
in the whole design and it is now comfortable, entirely because a masala is ground *once
per node* and then carried as a single object.

### 6.3 The container list — 24 items

Everything needing a labelled vessel drawn off `S3-50`, at 2–5 min each. Roughly
**1–2 hours of Aseprite**, and it covers every recipe in all five nodes.

| Group | Items | # |
|---|---|---|
| **Masalas** — one per node, the output of its grinding levels | Chai Masala · Garam Masala · Sambar Podi · Rasam Podi · North-Eastern blend · Italian herb blend | 6 |
| **Oils** — mustard `S3-19` and sunflower `S3-20` already exist | Ghee · Sesame · Coconut · Olive | 4 |
| **Grains and pulses** | Flour · Rice · Arborio rice · Toor dal · Chickpeas · Kidney beans · Semolina · Spaghetti · Noodles | 9 |
| **Beverage dry goods** | Tea leaf · Sugar · Coffee extract | 3 |
| **Wet** — milk `S3-03` and cream `S3-04` already exist | Mozzarella · Tamarind | 2 |
| | **Total** | **24** |

Fresh produce — pumpkin, potato, aubergine, tomato, onion, cabbage, bamboo shoot,
coconut, green beans, peanut — are **loose sprites, not containers**, and most are
probably already among the 23 Ingredient and 9 Pending items. ⬜ **Blocked on the
`Untagged/` hand-sort**: until those are named, which recipes are already fully covered
cannot be answered.

### 6.4 Node order

**Beverages (FTUE, Chai → High-Tea)** → **North Indian** → **South Indian**
→ **Italian** → **North Eastern**. Candidate dish lists per node were put to the
user Sep 5, 21:19 IST; ⬜ selection pending, and asset requirements follow from it.

