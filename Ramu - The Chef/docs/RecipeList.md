# RecipeList — dishes, and the ingredients they call for

**Last updated:** Sep 6 2026, 17:14 IST (read from the system clock)
**Status:** 🟢 **Node selections locked** (§7, Sep 6) · FTUE fixed (§7.0) · asset inventory typed (§8.5). §3's early proposal is superseded by §7.

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

---

## 7. 🔒 The node selections — Sep 6 2026, 00:47 IST

Six dishes chosen per cuisine node by the user, one node at a time. **§6.4's
"selection pending" is closed.** Format is §6.1's; the masala occupies one cell in
every dish of its node, so it is written once per node rather than per row.

### 7.0 🔒 Node 0 — Beverages (FTUE) — fixed Sep 6 2026

**Two drinks, four levels.** The FTUE is the whole beverage node, not a single tutorial
level. Props: Water Dispenser (`props/43–44`), Kettle (`19–21`), Beverage
Dispenser (`01–02`).

| Level | Dish | What it teaches |
|---|---|---|
| 1 | **Chai** | one chain, one prop |
| 2 | **Coffee** | a second, independent chain |
| 3 | **Chai & Coffee** | both chains live on one belt |
| 4 | **Boss** | pressure — and it **unlocks Brazier `03` + Tandoor `09–10`** |

🔥 **The boss hands over two advanced stations early, deliberately.** The user's
reason, recorded verbatim: *"early unlock but helps people use advanced tool early on
sometimes make people latch onto gameplay more."* This is the decision that closes
§7.5 — see there.

⚠️ **Node 0 is four levels, not six.** §9.2's six-per-node reasoning is about
spice-union economics across a cuisine run and does not apply to a tutorial node.

**Art:** two new dish sprites (Chai, Coffee); level 3 reuses both. **Zero new props** —
Brazier and Tandoor already exist.

### 7.1 Node 1 — North Indian · masala: **Garam Masala**

| Dish | Primary | Oil | Secondary | Utensil |
|---|---|---|---|---|
| Baingan Bharta | Aubergine | Mustard oil | Onion | **Brazier** `03` |
| Naan / Roti | Dough | Ghee | — | Tandoor `09–10` ⚠️ §7.5 |
| Rajma | Kidney beans | Ghee | Tomato | Pressure Cooker `23–25` |
| Jeera Rice | Rice | Ghee | — | Rice Cooker `26–28` |
| Gobhi Masala | Cauliflower | Mustard oil | Onion | Cast Iron Skillet `04–05` |
| Palak Aloo | Spinach | Ghee | Potato | Fry Pan `14–18` |

Ground from cumin seed, coriander seed, black pepper, cardamom, clove, cinnamon, bay
leaf, red chilli, turmeric. **One grinding level.**

### 7.2 Node 2 — South Indian · masalas: **Sambar podi** *and* **Rasam podi**

| Dish | Primary | Oil | Secondary | Utensil |
|---|---|---|---|---|
| Coconut Chutney | Coconut | Sesame oil | Green chilli | **Spice Grinder** `35–38` |
| Upma | Semolina | Ghee | Onion | Sauce Pan `29–31` |
| Rasam | Tomato | Ghee | Tamarind | Sauce Pot `32–34` |
| Idli | Batter | — | — | **Steam Cooktop** `39` |
| Beans Poriyal | Green beans | Coconut oil | Coconut | Cast Iron Skillet `04–05` |
| Sambar | Toor dal | Sesame oil | Tomato | Pressure Cooker `23–25` |

⚠️ **The only node needing two grinding levels — 9 levels, not 8.** Rasam podi and
Sambar podi are different blends and neither can stand in for the other.

🔥 **A universal tadka.** Mustard seed + curry leaf + urad dal appears in five of
six dishes and **must be one container, not three cells.** Sambar and Rasam both land at
exactly 5 cells with it folded; split it and both become unauthorable.

🔥 The Spice Grinder grinds the node's podi **and** is Coconut Chutney's station —
the tool the node introduces is the tool its first recipe needs.

### 7.3 Node 3 — Italian · masala: **Italian herb blend**

| Dish | Primary | Oil | Secondary | Utensil |
|---|---|---|---|---|
| Pesto | Basil | Olive oil | Pine nut | **Spice Grinder** `35–38` |
| Aglio e Olio | Spaghetti | Olive oil | Garlic | Fry Pan `14–18` |
| Minestrone | Mixed veg | Olive oil | Beans | **Stock Pot** `40–42` — new family |
| Bruschetta | Bread | Olive oil | Tomato | **Oven** = Cooktop **L1** `06` |
| Arrabbiata | Tomato | Olive oil | Garlic | Sauce Pot `32–34` |
| Risotto | Arborio rice | Olive oil | Onion | Sauce Pan `29–31` |

Ground from oregano, basil, parsley, black pepper, chilli flakes, bay leaf.

✅ **Every dish lands at exactly 4 cells with one spare** — the cleanest node.
⚠️ **Every dish also uses olive oil**, so the oil cell carries no information for this
node. Either accept it as flavour or let a node declare a default oil.

### 7.4 Node 4 — North Eastern · masala: **the paste** (ginger, garlic, **bhut jolokia**)

| Dish | Primary | Oil | Secondary | Utensil |
|---|---|---|---|---|
| Xaak Bhaji | Spinach | Mustard oil | Garlic | Fry Pan `14–18` |
| Bamboo Shoot Fry | Bamboo shoot | Mustard oil | Onion | 🔒 **Wok** = Fry Pan **L4** `17` |
| Veg Thukpa | Noodles | Mustard oil | Cabbage | Stock Pot `40–42` |
| Sticky Rice | Rice | — | — | Steam Cooktop `39` |
| Ooti | Peas | Mustard oil | Onion | Pressure Cooker `23–25` |
| Veg Momo | Dough | — | Cabbage | Steam Cooktop `39` |

🔒 **Node 4 introduces no new prop family — its new tool is a *tier*.** The Wok is
Fry Pan L4, the top of a ladder the player has climbed since node 1. Four distinct
families across six dishes, which fits the 4 slots exactly: the boss can put all four on
the belt at once, which no other node can do.

🔥 **A fresh paste, not a dry blend — and bhut jolokia rather than green chilli.**
North Eastern cooking is defined by the *absence* of a dry masala; a
"North-Eastern garam masala" would be an invention. Bhut jolokia makes the paste
**specific rather than merely authentic** — it is the one NE ingredient a player anywhere
recognises — and it turns the container **red-orange**, so the node's most-seen cell stops
reading as another green chutney.

### 7.5 ⚠️ Naan needs Cooktop L4 in the *first* cuisine node

Tandoor is not its own prop — it is `09-Cooktop only tandoor(Level4)` /
`10-Cooktop & Tandoor(Level5)`. Bruschetta (§7.3) needs `06-Cooktop only oven(Level1)`.
**So under the current node order the player meets the Cooktop ladder at L4 in node 1 and
at L1 in node 3 — backwards.**

➡️ **Recommend Roti, not Naan, in node 1.** Roti is a tawa dish — Cast Iron Skillet,
tier 1. Cooktop is then introduced at L1 as the oven in node 3, climbs, and Naan at L4
becomes a late-run or boss dish the ladder has earned. Same bread, right place.

✅ **CLOSED Sep 6 2026 — Naan stays in node 1.** The recommendation above is
**declined, and the objection it rested on no longer exists.** §7.0's FTUE boss now
unlocks the Tandoor, so the player meets Cooktop L4 *before* node 1 begins. The ladder is
not encountered backwards by accident — the top tier is handed over on purpose, as a
hook. Naan is then a dish the player already owns the station for.

### 7.6 🔥 Build node 3 before node 4

Aglio e Olio and Veg Thukpa are the only two noodle dishes and **the pack has no noodle
form at all**, raw or cooked. Draw it once for Aglio e Olio and Thukpa is a recolour into
broth. Reverse the order and it is drawn twice.

🔄 **SUPERSEDED Sep 6 — the pack does have a noodle form.** The hand-sort found
it: `Final Recipe/01-Cooked Noodles` (was the unnamed sprite `S1-31`). **The build-order
constraint dissolves** — both dishes have a base, and node 3 no longer has to precede
node 4 on art grounds. Any remaining ordering argument has to stand on its own.

---

## 8. Asset requirements — all four cuisine nodes

### 8.1 Props — **zero new, across 24 dishes**

Every utensil in every selected dish is already in `props/`. The 44-sprite prop set was
sized correctly the first time. **The entire remaining art cost of the game is ingredients
and plated dishes.**

### 8.2 Container labels — 19, drawn off `S3-50`

| Node | New containers |
|---|---|
| 1 | Ghee · Kidney beans · Rice · **Garam Masala** |
| 2 | Sesame oil · Coconut oil · Semolina · Idli batter · Tamarind · **Sambar podi** · **Rasam podi** · **Tadka** |
| 3 | Olive oil · Spaghetti · Arborio rice* · White beans* · **Italian herb blend** |
| 4 | Noodles · **NE paste** |

\* recolours of containers made for node 1. Mustard oil `S3-19` and sunflower `S3-20` were
already in the pack; **mustard oil is node 4's signature and needed no work at all.**

### 8.3 🔄 Loose sprites — **2** genuinely absent, down from 4

✅ **Resolved Sep 6 by the hand-sort.** `Untagged/` is dissolved; every Essentials
sprite now sits in a typed folder (§8.5). Searching the named set settles this:

| Ingredient | Status |
|---|---|
| **Bamboo shoot** (node 4) | ✅ found — `Ingredient/03-Primary-Bamboo Shoot` |
| **Bhut jolokia** (node 4) | ✅ found — `Ingredient/04-Spices-Bhut Jolokia` |
| **Coconut** (node 2) | ❌ **still absent** — blocks Coconut Chutney, Beans Poriyal |
| **Pine nut** (node 3) | ❌ **still absent** — blocks Pesto |

⚠️ Both missing items are **loose produce**, which the tray-inpaint pipeline cannot
make — it repaints food *into a fixed vessel*, and a loose ingredient has no vessel.
They are hand-drawn, or generated some other way.

The rest — aubergine, cauliflower, spinach, potato, onion, tomato, garlic, ginger,
cabbage, peas, green beans, bread, basil — are ✅ **confirmed present** in
`Ingredient/`.

### 8.4 Finished dishes — the dominant cost

| | Count | Dishes |
|---|---|---|
| 🎨 **Draw** | **12** | Baingan Bharta, Rajma, Jeera Rice, Gobhi Masala, Palak Aloo, Idli, Rasam, Aglio e Olio, Risotto, Veg Momo, Veg Thukpa*, and one spare |
| 🎨 Recolour | **9** | Coconut Chutney, Beans Poriyal, Sambar, Minestrone, Arrabbiata, Bruschetta, Xaak Bhaji, Bamboo Shoot Fry, Ooti |
| 🟡 Possibly free | 4 | Naan `S1-32` · Upma `S1-27` · Pesto `S2-14` · Sticky Rice `S1-07` |

\* Thukpa becomes a recolour if node 3 ships first — §7.6.

Only **four** Finished sprites exist in the whole pack and one of them is already Naan.
Plated dishes scale linearly with the menu and are the single largest art line in the
project.

---

#### 8.4a 🔄 Actual state — Sep 6 2026, after the first generation batch

**12 of the 24 plated dishes now exist**, produced by the tray-inpaint pipeline
([KitchenMode.md](KitchenMode.md) §8.2), stored in `Art\_gen\dishes\`:

> Baingan Bharta · Rajma · Gobhi Masala · Palak Aloo · Upma · Idli ·
> Beans Poriyal · Aglio e Olio · Minestrone · Risotto · Bamboo Shoot Fry ·
> Veg Momo

⚠️ **The draw/recolour/free split above no longer describes the work.** The batch
took 8 from the *Draw* list, **3 that were classed as recolours** (Beans Poriyal,
Minestrone, Bamboo Shoot Fry) and **1 classed as possibly-free** (Upma). The distinction
has collapsed: every dish goes through the same pipeline at the same cost, so the only
number that matters is **how many dishes remain**.

| | Count | |
|---|---|---|
| ✅ Done | **12** | listed above |
| ⬜ Remaining, cuisine nodes | **12** | Naan, Jeera Rice, Coconut Chutney, Rasam, Sambar, Pesto, Bruschetta, Arrabbiata, Xaak Bhaji, Veg Thukpa, Sticky Rice, Ooti |
| ⬜ Remaining, FTUE | **2** | Chai, Coffee (§7.0) |
| ⬜ From the interaction graph | **4** | `dal-cooked`, `dal-tadka`, `bhindi-fry`, `tomato-gravy` — [PropList.md](PropList.md) §4 |

⚠️ **Six dishes do not read as their named dish** even though all 12 are stylistically
consistent: Idli, Veg Momo, Beans Poriyal, Palak Aloo, Risotto and Baingan Bharta. The
cause is measured, not guessed — **the LoRA renders warm brown/orange/gold reliably and
cannot paint white or green** (7 of 7 warm targets landed; 0 of 5 pale targets did). The
user's call, recorded: **accepted as-is, to be recoloured later.**

### 8.5 🔒 The asset folders — Sep 6 2026

`Untagged/` is **dissolved.** Every sliced Kitchen Essentials sprite now sits in exactly
one typed folder under `Art\_sliced - Kitchen Essentials\`:

| Folder | Count | Filename form |
|---|---|---|
| `Ingredient/` | 27 | `NN-Primary\|Secondary\|Spices-Name` |
| `Container/` | 34 | `NN-Chutney\|Pastes\|Spice Blends-Name` |
| `Cooking Oil/` | 7 | `NN-Name` |
| `Utensil/` | 12 | `NN-Name` |
| `Final Recipe/` | 4 | `NN-Name` |
| `props/` | 44 | unchanged — tool-derived, not hand-edited |

**84 + 44 = 128**, which is every sprite the slicer produced. Nothing is orphaned and
nothing is duplicated between folders. The map is `_asset_map.csv` in the pack root,
carrying folder, number, subcategory, name, old `Untagged/` number and original sheet id,
so any sprite traces back to its source.

⚠️ **`sheet1/`, `sheet2/`, `sheet3/` are now fully redundant** — verified by
content hash: zero sprites live only there. They are the slicer's raw output and are kept
as an archive, not as a source of truth. **Do not pin an id to a sheet path.**

⬜ **11 items remain `Pending`** — `Container/14, 18, 25, 26, 27, 28, 32, 33, 34` and
`Cooking Oil/04, 05`. All are generic jars and bottles with no distinguishing contents,
and §8.2 already expects four labels to be recolours, so these are the bases for them
rather than a gap.

🔄 **Side effect on the LoRA:** those 78 sprites were skipped by the dataset prep
because bare numbers produce no caption. They are all named now, so a retrain takes the
training set from **163 to ~241 images**.

---

## 9. The reserve pool — dishes proposed but not selected

Twenty-seven dishes were put up across the four cuisine nodes; **24 were picked**
(§7). The rest are kept here as the **swap list**: if a selected dish turns out too
expensive to draw, or a node needs rebalancing, these are already costed against the same
prop set and the same masala. Format is §6.1's.

| Node | Dish | Primary | Oil | Secondary | Utensil |
|---|---|---|---|---|---|
| **NI** | Kaddu Curry | Pumpkin | Ghee | — | Pressure Cooker |
| **NI** | Karela Bhujiya | Bitter gourd | Mustard oil | Onion | Cast Iron Skillet |
| **NI** | Aloo Jeera | Potato | Ghee | — | Fry Pan |
| **NI** | Dal Tadka | Toor dal | Ghee | Onion | Pressure Cooker |
| **NI** | Chana Masala | Chickpeas | Ghee | Tomato | Pressure Cooker |
| **SI** | Lemon Rice | Cooked rice | Sesame oil | Peanut | Fry Pan |
| **SI** | Kootu | Pumpkin | Coconut oil | Toor dal | Pressure Cooker |
| **SI** | Avial | Mixed veg | Coconut oil | Coconut | Sauce Pan |
| **SI** | Curd Rice | Cooked rice | Sesame oil | Curd | Dough Counter — assembly |
| **SI** | Medu Vada | Urad dal batter | Sunflower oil | — | Fry Pan |
| **IT** | Margherita | Dough | Olive oil | Tomato, Mozzarella | Tandoor — Cooktop L4 |
| **IT** | Focaccia | Dough | Olive oil | — | Oven — Cooktop L1 |
| **IT** | Caprese | Tomato | Olive oil | Mozzarella | Dough Counter — assembly |
| **IT** | Polenta | Cornmeal | Olive oil | — | Stock Pot |
| **NE** | Aloo Pitika | Potato | Mustard oil | Onion | Dough Counter — assembly |
| **NE** | Bilahi Anja | Tomato | Mustard oil | Onion | Sauce Pan |
| **NE** | Lau Bhaji | Bottle gourd | Mustard oil | — | Sauce Pan |
| **NE** | Kholar Curry | Kidney beans | Mustard oil | Tomato | Pressure Cooker |
| **NE** | Gundruk Soup | Fermented greens | Mustard oil | Tomato | Stock Pot |

**Two things the selection dropped that this pool still holds:**

- ⚠️ **No selected dish uses the assembly station.** Curd Rice, Caprese and Aloo
  Pitika were the three no-cook dishes, and all three went unpicked — so the Dough
  Counter's *assemble* verb, decision 13 and its cloud-VFX/chopping-SFX spec, currently has
  **nothing to do**. Either one of these three comes back in, or assembly is cut and the
  Dough Counter keeps only its knead verb.
- **Cheap swaps if art time runs short.** Kaddu Curry, Dal Tadka and Chana Masala are all
  Pressure Cooker dishes whose plated states are pan-of-curry recolours — materially
  cheaper than Baingan Bharta or Gobhi Masala, which must be drawn.

### 9.1 ✅ The Beverage node — **specified Sep 6**, see §7.0

Chai → Coffee → both together → boss. **Two drinks, not four.** The earlier
proposal (Chai → Masala Chai → Coffee → High-Tea) is dropped: High-Tea and
Masala Chai are gone, and the node teaches *chain composition* rather than a drinks
ladder. Full list in §7.0.

### 9.2 Why six per node

Recorded because the number will be questioned later. Six matches GDD §10.10's frozen
*"a run of ~6 levels"*; six dishes overlap enough that their spice union is **one**
grinding level rather than two (node 2 is the exception that proves it); and 6 × 3 stars
= 18 stars, enough to pace three or four tier unlocks across a node without starving the
player or handing everything over by level 3.

