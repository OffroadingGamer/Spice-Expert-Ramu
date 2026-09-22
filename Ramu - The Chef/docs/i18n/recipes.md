# Recipe content — ingredients, prep, and garnish for the 22 recipe scrolls

**Written:** 22 Sep 2026 · **Author:** Spice Expert (Ramu voice) · **Status:** draft for review, not committed by me
**Covers:** `recipe.<slug>.prep`, `recipe.<slug>.finish` and `ingredient.<key>` for the recipe sheet specified in
[Ideas.md](../Ideas.md) §6d point 3 ("Kitchen relayout + recipe sheet", decided Sep 22 2026, for Round 17).

**Sources read, all read-only:** `jam-entry/src/game/data/recipes.ts` · `jam-entry/src/i18n/en.ts` (the 22
`recipe.*.note` voice references and the `dish.*` names) · `jam-entry/src/i18n/index.ts` ·
[Ideas.md](../Ideas.md) §6d · [RecipeList.md](../RecipeList.md) §7.0-7.4 (the locked primary / oil / secondary / utensil table per dish) ·
`Art/_gen/ingredients/` and `jam-entry/public/images/ing-*.png`.

⚠️ **Snapshot:** the working tree moved under me while I wrote this. At the start, `recipes.ts` held 22 slugs and
nothing more. By the end, Round 17 had shipped the ingredient map, the helpers, all 33 `ingredient.*` names and all
33 sprites. Every line number below was re-read against the tree **after** that landed. **§0 reconciles the two.**

**I wrote this file and nothing else.** No source was edited, no other doc was touched, no git was run.
Hindi and Tamil columns are deliberately absent: R17 takes its own pass over all 77 keys at once.

---

## How to read this

- **Keys** follow the existing scheme. `recipeNoteKey()` in `recipes.ts` already builds `recipe.<slug>.note`;
  `prep` and `finish` are the same shape, so a `recipeStepKey(slug, 'prep')` helper is the natural addition.
- **Char count** is the English string's length. Ideas.md §6d caps a step at **240**; the longest here is 209.
- **The ingredient rail is a shopping list, not a belt cell.** RecipeList §7.2's rule that mustard seed, curry leaf
  and urad dal must be *one* container is a Kitchen Mode authoring rule. On the sheet they are three tiles, because
  the sheet is telling a cook what to pick up.
- **The rail is capped at 7** and a step may name something that is not on it. Salt, oil and ground masala are
  assumed in every Indian kitchen; putting them on the rail would push a genuinely identifying ingredient off it.
  Where a step names something absent from the rail, the Notes column says so.
- **Ordering is a cook's reach order**, not alphabetical and not importance order: what goes in the pan first comes
  first. For dishes whose note fixes an order (gobhi masala chars first, sambar starts at the tamarind, thukpa
  builds broth before noodles) the rail and the steps both obey it.
- **Wanted** names an ingredient the dish genuinely needs that has no sprite. Nothing here was substituted to fill
  a gap, so several rails are short and a few are missing the dish's own primary. §4 and §5 say which.
- **Register rules applied:** no em dashes (Ideas.md line 581), no cup or gram measures, no brand names, no emoji,
  no numerals inside a step body. Timings are spelled out so the Hindi pass never mixes scripts mid-sentence.

---

## 0. Read this first: the sheet's data landed while I was writing this

When I started, `recipes.ts` held 22 slugs and nothing else. By the time I finished, **Round 17 had shipped**
`RECIPE_INGREDIENTS` (recipes.ts:71-92), the helpers `recipeIngredients()` and `ingredientNameKey()`, all 33
`ingredient.<key>` names (en.ts:422-454), the sheet's own chrome, `hasTranslation()` in `i18n/index.ts`, and all 33
`ing-*.png` sprites into `public/images/`. Flour, garlic and tomato are no longer "in production"; they are drawn
and shipping.

⚠️ **Line numbers in this file were read at the end of that, and the tree was still moving.** The `recipe.*.note`
block alone moved twice while I worked (it now sits at en.ts:458-479). Re-check any `:line` reference before acting on it;
the keys and the text are stable, the line numbers are not.

Three consequences, and none of them make this file redundant:

1. **The step text is still the open slot, and it is the bulk of this brief.** `i18n/index.ts:85-97` says so in as
   many words: `recipe.<slug>.prep` / `.finish` "are allowed to be absent until a later writing pass lands", and
   `RecipeSheet.tsx` omits the section rather than show a placeholder. There are **zero** `.prep` or `.finish` keys
   in `en.ts` today. §3's 44 strings are exactly that pass.
2. **The 33 ingredient names shipped, and mine agree on 31.** See §4.7 for the two that differ.
3. **The shipped ingredient rails were built to a different constraint than food.** The header comment on
   `RECIPE_INGREDIENTS` is explicit: every one of the 33 aliases had to be used at least once, and four dishes had
   to hit exact tile counts for an acceptance check (chai and sambar at 5, idli and sticky rice at 2, ooti at 7).
   Those are reasonable engineering constraints and they pushed seven dishes off the actual recipe.

§0.1 is the dish-by-dish comparison. I have not changed `recipes.ts` and will not; this is a reviewer's list.

### 0.1 My rail against the shipped `RECIPE_INGREDIENTS`

| Dish | Shipped (recipes.ts) | Mine (§2) | Verdict |
|---|---|---|---|
| **chai**<br>`:71` | tea-leaf · milk · ginger · cardamom · clove | ginger · cardamom · clove · tea-leaf · milk | ✅ same set · Same five, different order. Mine is reach order, the shipped list leads on the headline ingredient. Either is defensible. |
| **coffee**<br>`:72` | coffee-extract · milk · cream | coffee-extract · milk | 🔴 wrong as food · **`cream` does not belong.** South Indian filter coffee is decoction, milk and sugar. Cream is here because the sprite needed a home. |
| **naan**<br>`:73` | flour · ghee · cumin-seed | flour · milk · ghee · cumin-seed | ✅ agree · Shipped three are a subset of mine. I add `milk` for the dough; a dhaba would use yoghurt, which has no sprite. |
| **jeera-rice**<br>`:74` | rice · ghee · cumin-seed · bay-leaf | ghee · cumin-seed · bay-leaf · green-chilli · rice | ✅ agree · Subset of mine. I add `green-chilli`, which is standard in a dhaba jeera rice. |
| **palak-aloo**<br>`:75` | potato · onion · garlic · turmeric · green-chilli | potato · ghee · cumin-seed · onion · garlic · green-chilli · turmeric | ✅ agree · Near match. I add `ghee` and `cumin-seed`. Both lists are missing spinach, which is unavoidable. |
| **gobhi-masala**<br>`:76` | cauliflower · onion · tomato · turmeric · coriander-seed | cauliflower · onion · ginger · tomato · cumin-seed · coriander-seed · turmeric | ✅ agree · Near match. I add `cumin-seed` and `ginger`. |
| **rajma**<br>`:77` | kidney-beans · onion · tomato · garlic · cumin-seed | kidney-beans · ghee · onion · garlic · ginger · tomato · coriander-seed | ✅ agree · Near match. I carry `ghee`, `ginger` and `coriander-seed` where the shipped list carries `cumin-seed`. Both are right. |
| **coconut-chutney**<br>`:78` | coconut-half · green-chilli · curry-leaf · mustard-seed · urad-dal | coconut-half · green-chilli · ginger · mustard-seed · urad-dal · curry-leaf · dried-red-chilli | ✅ agree · Subset of mine. I add `ginger` and `dried-red-chilli` to complete the tadka. |
| **idli**<br>`:79` | rice · urad-dal | rice · urad-dal | ✅ identical · Identical. Rice and urad dal is the whole batter. |
| **upma**<br>`:80` | flour · onion · mustard-seed · curry-leaf · green-chilli | ghee · mustard-seed · urad-dal · curry-leaf · green-chilli · ginger · onion | 🔴 wrong as food · **`flour` is not rava.** Upma is semolina, and the dish's own note is about roasting it. Wheat flour makes a completely different thing. Semolina has no sprite, which is the real problem; see §4.1. |
| **sambar**<br>`:81` | toor-dal · tomato · turmeric · curry-leaf · mustard-seed | toor-dal · turmeric · onion · tomato · mustard-seed · curry-leaf · dried-red-chilli | ✅ agree · Subset of mine. I add `onion` and `dried-red-chilli`. Neither list has tamarind, which the note names first. |
| **beans-poriyal**<br>`:82` | peas · coconut-half · mustard-seed · curry-leaf · green-chilli | mustard-seed · urad-dal · dried-red-chilli · curry-leaf · green-chilli · coconut-half | 🔴 wrong as food · **`peas` is not a green bean.** Poriyal is named after the bean and cut fine, per its own note. Peas cannot be cut small and do not go mushy the way the note warns about. Green beans have no sprite; see §4.1. |
| **pesto**<br>`:83` | pine-nut · garlic · parsley · tomato | pine-nut · garlic | 🔴 wrong as food · **`tomato` does not belong in pesto genovese.** `parsley` as a stand-in for basil is defensible; tomato makes it a different sauce. Mine leaves the rail at two rather than fill it. |
| **minestrone**<br>`:84` | tomato · onion · potato · peas · aubergine | onion · garlic · tomato · potato · kidney-beans · peas · oregano | ⚠️ cosmetic · `aubergine` is not a minestrone vegetable, and it is here because this is the only rail that could absorb it. The dish's own note ("whatever's in the fridge") is the only thing that rescues it. See §4.4. |
| **arrabbiata**<br>`:85` | tomato · garlic · dried-red-chilli · chilli-flakes · oregano | garlic · chilli-flakes · tomato · parsley | ⚠️ cosmetic · `oregano` is not traditional and both chilli sprites appear at once. Harmless, and the double chilli arguably reads as the note's "one chilli too few". |
| **aglio-e-olio**<br>`:86` | garlic · chilli-flakes · parsley | garlic · chilli-flakes · parsley | ✅ identical · Identical. Garlic, chilli flakes, parsley, and the oil that has no sprite. |
| **risotto**<br>`:87` | rice · onion · garlic · cream | onion · rice · cream | ✅ agree · Near match. Both carry the `cream` stand-in, which is flagged in §4.2 either way. |
| **veg-thukpa**<br>`:88` | onion · garlic · coriander-seed · green-chilli | garlic · ginger · onion · green-chilli · tomato · peas | 🔴 wrong as food · **`coriander-seed` is wrong for this cuisine.** Ground dhania is a North Indian masala note and is not used in Himalayan or North East noodle soup. Mine uses `ginger`, `tomato` and `peas`. |
| **bamboo-shoot-fry**<br>`:89` | garlic · green-chilli · onion · turmeric | onion · garlic · ginger · dried-red-chilli · green-chilli · turmeric | ✅ agree · Subset of mine. I add `ginger` and `dried-red-chilli`. |
| **veg-momo**<br>`:90` | flour · potato · onion · garlic · coriander-seed | flour · onion · garlic · ginger · green-chilli · peas | 🔴 wrong as food · **`coriander-seed` again.** Momo filling is aromatics and vegetable, never ground dhania. `potato` is defensible (aloo momo is real), though RecipeList §7.4 names cabbage as the secondary. |
| **sticky-rice**<br>`:91` | rice · coconut-half | rice | 🔄 shipped is better · **The shipped list is better than mine.** I left this at one tile rather than invent a second; `coconut-half` is honest, because bora saul is genuinely eaten with coconut. Take the shipped pair and treat §4.5 as closed. |
| **ooti**<br>`:92` | rice · ghee · cardamom · clove · cumin-seed · bay-leaf · turmeric | peas · onion · ginger · garlic · dried-red-chilli | 🔴 wrong as food · **This is a pulao, not Ooti.** Rice, ghee, cardamom, clove, cumin, bay leaf and turmeric describe a North Indian rice dish. Ooti is an Angami Naga dish of ground dried peas cooked long with bamboo shoot and greens, and it contains no rice at all. RecipeList §7.4 locks its primary as **Peas** and its station as the Pressure Cooker. This is the boss dish and the most visible sheet in the game. |

**Tally:** 2 identical, 10 agree on content,
1 where the shipped list is better than mine, 2 cosmetic disagreements, and
**7 that are wrong as food**: `coffee`, `upma`, `beans-poriyal`, `pesto`, `veg-thukpa`, `veg-momo`, `ooti`.

**If only one is fixed, fix `ooti`.** It is the boss dish, its rail describes a pulao, and RecipeList §7.4 already
locks its primary as Peas. `peas · onion · ginger · garlic · dried-red-chilli` keeps five tiles; going to seven for
the acceptance check needs two of the wanted sprites in §4.6 (bamboo shoot and greens), or the check moves to
another dish. **`upma` and `beans-poriyal` are the next two**, and both are the same underlying problem: the dish's
primary has no sprite, so a wrong one was put in its place rather than the rail left short.

### 0.2 The sheet chrome shipped too, and it carries a plural the table cannot express

Five strings landed alongside the rest, and they are the sheet's own furniture rather than content:

| Key | English | Line |
|---|---|---|
| `recipe.sheet.ingredients` | Ingredients · {n} | `:412` |
| `recipe.sheet.prepHeading` | Prep | `:413` |
| `recipe.sheet.finishHeading` | Garnish & Cooking | `:414` |
| `recipe.sheet.close` | Close | `:415` |
| `recipe.sheet.closeAria` | Close recipe | `:416` |

`recipe.sheet.ingredients` is a **flat string with `{n}` in it**, not a `{ one, other }` entry, so "Ingredients · 1"
is what sticky rice will render under my rail. `tn()` already exists in `i18n/index.ts` and would take the plural
form; the key just has not been written as one. This is the eleventh key in that position and
[strings.md](strings.md) lists the other ten. Those five keys also postdate strings.md, so that inventory is now
five rows short. I have not touched it, per my brief.

---

## 1. Ingredient display names

All 33 sprite keys, named once each. All 33 sprites are now in `public/images/` and all 33 keys are now in `en.ts`
(lines 420-452), which landed during this pass. **My names agree with the shipped ones on 31 of 33**; §4.7 has the two
that differ and which I would keep. The table below is my pass, written before I could see theirs.
Tile labels are 6.5 mu over a 42 mu tile, **two lines maximum**, so nothing here runs past 16 characters.

| Key | English | Chars | Notes |
|---|---|---|---|
| `ingredient.aubergine` | Aubergine | 9 | Baingan. RecipeList §7.1 spells it Aubergine, so kept. Indian English would say Brinjal; if the game ever localises to Indian English, that is the swap. Serves no recipe slug (see §4). |
| `ingredient.bay-leaf` | Bay Leaf | 8 | Tej patta. Whole leaf, fished out before serving; say so if a tooltip is ever added. |
| `ingredient.cardamom` | Cardamom | 8 | Green cardamom (elaichi), not black. The sprite is green. |
| `ingredient.cauliflower` | Cauliflower | 11 | Gobhi. |
| `ingredient.chilli-flakes` | Chilli Flakes | 13 | Italian-node item; the grind in RecipeList §7.3's herb blend. |
| `ingredient.clove` | Clove | 5 | Laung. |
| `ingredient.coconut-half` | Coconut | 7 | Sprite is a split half. Label drops the 'half' because the cook says coconut. |
| `ingredient.coffee-extract` | Coffee Decoction | 16 | The South Indian filter decoction, not instant and not espresso. Two lines on a 42-mu tile. |
| `ingredient.coriander-seed` | Coriander Seed | 14 | Dhania. Ground, not leaf. Fresh coriander leaf has no sprite and is wanted by four dishes. |
| `ingredient.cream` | Cream | 5 | Only honest home among the 22 is risotto, and there it stands in for butter plus parmesan. Flagged in §4. |
| `ingredient.cumin-seed` | Cumin Seed | 10 | Jeera. |
| `ingredient.curry-leaf` | Curry Leaf | 10 | Kadi patta. Part of the universal tadka (RecipeList §7.2). |
| `ingredient.dried-red-chilli` | Dried Red Chilli | 16 | Sookhi lal mirch. Whole, for tadka, not powder. |
| `ingredient.ghee` | Ghee | 4 | The only fat with a sprite. Mustard, olive, sesame and coconut oil are all specified by RecipeList §7 and all missing; see §4. |
| `ingredient.ginger` | Ginger | 6 | Adrak. Also one third of node 4's fresh paste. |
| `ingredient.green-chilli` | Green Chilli | 12 | Hari mirch. |
| `ingredient.kidney-beans` | Kidney Beans | 12 | Rajma. Label says the English because the dish name already carries the Hindi. |
| `ingredient.milk` | Milk | 4 | Doodh. |
| `ingredient.mustard-seed` | Mustard Seed | 12 | Rai / kadugu. Tadka, not the oil. |
| `ingredient.onion` | Onion | 5 | Pyaaz. Used by 9 of the 22, the most of any sprite. |
| `ingredient.oregano` | Oregano | 7 | Exists for the Italian herb blend, a grinding level, not a dish. Placed on minestrone; see §4. |
| `ingredient.parsley` | Parsley | 7 | Flat leaf. Garnish, goes in off the flame. |
| `ingredient.peas` | Peas | 4 | Matar. Fresh peas in the Italian and momo lists; Ooti wants them dried and ground, which the sprite does not show. |
| `ingredient.pine-nut` | Pine Nut | 8 | Chilgoza. Pesto only. |
| `ingredient.potato` | Potato | 6 | Aloo. |
| `ingredient.rice` | Rice | 4 | One sprite doing three jobs: plain rice for jeera rice, idli rice, arborio for risotto. Sticky rice needs a fourth. See §4. |
| `ingredient.tea-leaf` | Tea Leaves | 10 | Plural reads better on the tile than the singular key. |
| `ingredient.toor-dal` | Toor Dal | 8 | Arhar. Sambar only. |
| `ingredient.turmeric` | Turmeric | 8 | Haldi. Powder. |
| `ingredient.urad-dal` | Urad Dal | 8 | Two different jobs: ground for idli batter, whole for tadka. Same sprite. |
| `ingredient.flour` | Flour | 5 | Art round 4. Atta for naan, maida for momo skins. One sprite, two flours; the step text names which. |
| `ingredient.garlic` | Garlic | 6 | Lehsun. Art round 4. Closes aglio e olio and pesto. |
| `ingredient.tomato` | Tomato | 6 | Art round 4. |

Longest label: **16 characters** (`ingredient.coffee-extract`, `ingredient.dried-red-chilli`). Both break cleanly
across two lines. Hindi will run longer than English on most of these, so R17 should re-measure against the 42 mu tile.

---

## 2. The ingredient rail, per dish

Ordered as a cook reaches for them. **Wanted** is what the dish really needs and no sprite covers.
Cross-checked against RecipeList.md §7.1-7.4, which locks each dish's primary, oil, secondary and utensil.

**This is my pass, not a replacement for the shipped `RECIPE_INGREDIENTS`.** §0.1 sets the two side by side and says
where they disagree. Nothing here was written to satisfy "every sprite used once" or an exact tile count.

| Dish | Slug | Tiles | Ingredient rail, in order | Wanted (no sprite) |
|---|---|---|---|---|
| Chai | `chai` | 5 | `ginger` · `cardamom` · `clove` · `tea-leaf` · `milk` | sugar, water |
| Coffee | `coffee` | 2 | `coffee-extract` · `milk` | sugar, coffee powder with chicory (the decoction sprite is the brewed result, not the grounds) |
| Naan | `naan` | 4 | `flour` · `milk` · `ghee` · `cumin-seed` | yoghurt, salt, yeast or baking soda, nigella seed (kalonji) |
| Jeera Rice | `jeera-rice` | 5 | `ghee` · `cumin-seed` · `bay-leaf` · `green-chilli` · `rice` | salt, fresh coriander leaf |
| Palak Aloo | `palak-aloo` | 7 | `potato` · `ghee` · `cumin-seed` · `onion` · `garlic` · `green-chilli` · `turmeric` | spinach (the primary, per RecipeList §7.1), salt, garam masala |
| Gobhi Masala | `gobhi-masala` | 7 | `cauliflower` · `onion` · `ginger` · `tomato` · `cumin-seed` · `coriander-seed` · `turmeric` | mustard oil, salt, garam masala |
| Rajma | `rajma` | 7 | `kidney-beans` · `ghee` · `onion` · `garlic` · `ginger` · `tomato` · `coriander-seed` | salt, garam masala |
| Coconut Chutney | `coconut-chutney` | 7 | `coconut-half` · `green-chilli` · `ginger` · `mustard-seed` · `urad-dal` · `curry-leaf` · `dried-red-chilli` | roasted gram (pottukadalai), sesame oil, tamarind or lemon, salt |
| Idli | `idli` | 2 | `rice` · `urad-dal` | fenugreek seed (methi), salt |
| Upma | `upma` | 7 | `ghee` · `mustard-seed` · `urad-dal` · `curry-leaf` · `green-chilli` · `ginger` · `onion` | semolina / rava (the primary, per RecipeList §7.2), salt, cashew, fresh coriander leaf |
| Sambar | `sambar` | 7 | `toor-dal` · `turmeric` · `onion` · `tomato` · `mustard-seed` · `curry-leaf` · `dried-red-chilli` | tamarind (named in the dish's own note), sambar podi, drumstick or mixed veg, sesame oil, salt |
| Beans Poriyal | `beans-poriyal` | 6 | `mustard-seed` · `urad-dal` · `dried-red-chilli` · `curry-leaf` · `green-chilli` · `coconut-half` | green beans (the primary, per RecipeList §7.2), coconut oil, salt |
| Pesto | `pesto` | 2 | `pine-nut` · `garlic` | basil (the primary, per RecipeList §7.3), olive oil, parmesan, salt |
| Minestrone | `minestrone` | 7 | `onion` · `garlic` · `tomato` · `potato` · `kidney-beans` · `peas` · `oregano` | celery, carrot, small pasta, stock, olive oil, salt |
| Arrabbiata | `arrabbiata` | 4 | `garlic` · `chilli-flakes` · `tomato` · `parsley` | olive oil, penne, salt |
| Aglio E Olio | `aglio-e-olio` | 3 | `garlic` · `chilli-flakes` · `parsley` | olive oil, spaghetti, salt |
| Risotto | `risotto` | 3 | `onion` · `rice` · `cream` | stock, white wine, butter, parmesan, olive oil, salt |
| Veg Thukpa | `veg-thukpa` | 6 | `garlic` · `ginger` · `onion` · `green-chilli` · `tomato` · `peas` | noodles (the primary, per RecipeList §7.4), cabbage, carrot, spring onion, stock, mustard oil, soy sauce |
| Bamboo Shoot Fry | `bamboo-shoot-fry` | 6 | `onion` · `garlic` · `ginger` · `dried-red-chilli` · `green-chilli` · `turmeric` | bamboo shoot (the primary), mustard oil, salt; bhut jolokia if node 4's paste is drawn |
| Veg Momo | `veg-momo` | 6 | `flour` · `onion` · `garlic` · `ginger` · `green-chilli` · `peas` | cabbage (the secondary, per RecipeList §7.4), carrot, spring onion, salt, oil |
| Sticky Rice | `sticky-rice` | 1 | `rice` | glutinous rice as its own sprite, banana leaf or bamboo tube, salt |
| Ooti | `ooti` | 5 | `peas` · `onion` · `ginger` · `garlic` · `dried-red-chilli` | fermented bamboo shoot (bastenga), colocasia or yam leaves, axone, mustard oil, salt |

**109 tile placements across 22 dishes**, 1 to 7 per dish, mean 5.0.
The rail shows 4 tiles plus a peek, so **14 of 22** sheets scroll sideways and the rest do not.
Ideas.md §6d says the fade, chevron and page dots render only when more tiles exist, which is exactly right for this spread.

---

## 3. The 44 step strings

Each dish shows its existing `note` first, quoted from `en.ts` at the line given, because the note is the voice
reference and the steps must not contradict it. All 22 were checked against the live file, character for character.

### 3.1 Chai · `chai`

> **Note** (`recipe.chai.note`, en.ts:458): *"Boil it twice. Trust me on this one."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.chai.prep` | Crush the ginger with the back of the knife, never a grater. Cardamom and clove go in whole. Water on a high flame, spices in first, and let it go dark before a single tea leaf touches it. | 188 | Sugar has no sprite, so it appears in the step text only. The knife-back crush is the tapri gesture; keep it in Hindi. |
| `recipe.chai.finish` | Milk in, sugar in, bring it up a second time. Once is tea. Twice is chai. Pull it high between two glasses so it sits down with a head on it, then strain it hot. Warm chai is an insult. | 185 | The dish note demands two boils and this line does two. A translation must not soften it to one. 'Pull it high' is the cutting-chai pour. |

### 3.2 Coffee · `coffee`

> **Note** (`recipe.coffee.note`, en.ts:459): *"Bitter first, sweet after. Like most mornings."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.coffee.prep` | Decoction first. Grounds packed tight in the filter, hot water on top, then leave it alone. An hour if you have one. Rush it and you get brown water, and the customer will know before you do. | 191 | Decoction, not instant and not espresso. If the sprite ever reads as a finished cup, this line needs rewording. |
| `recipe.coffee.finish` | Boil the milk, do not just warm it. Decoction in the tumbler, milk over, sugar last. Pour it between tumbler and davara until it froths. The bitter lands first and the sweet catches up. | 185 | Follows the note's bitter-then-sweet order; keep that order in Hindi and Tamil. 'Davara' is the tumbler's saucer, leave it as is. |

### 3.3 Naan · `naan`

> **Note** (`recipe.naan.note`, en.ts:460): *"Slap it, don't stroke it. The tandoor forgives noise."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.naan.prep` | Flour in the thali, warm milk into the middle, work it until the dough stops fighting back. Ghee on your palms at the end. Cover it and give it two hours. Dough has never once been in a hurry. | 192 | A dhaba leavens with yoghurt; milk is what has a sprite. See §4.3. |
| `recipe.naan.finish` | Pull it into shape by hand, press the cumin in, wet one side. Slap it onto the tandoor wall and let it make noise. Thirty seconds, no more. Off with the hook, ghee brushed on while it steams. | 191 | Cumin is standing in for kalonji, the seed actually pressed into naan. See §4.3. |

### 3.4 Jeera Rice · `jeera-rice`

> **Note** (`recipe.jeera-rice.note`, en.ts:461): *"Toast the cumin till it argues back."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.jeera-rice.prep` | Wash the rice until the water runs clear, then soak it twenty minutes. Ghee hot in the pot, cumin in, bay leaf, a slit green chilli. Wait for the cumin to crackle and darken. That is the dish talking. | 200 | Carries the note's 'argues back' as the doneness cue for the cumin. |
| `recipe.jeera-rice.finish` | Drained rice in, turned gently so the grains stay whole. Water at one and a half times, salt, lid on, flame low. When it is done, fork it loose and let the steam out. Coriander on top, nothing else. | 198 | 'One and a half times' is a ratio, not a cup measure. Fresh coriander leaf has no sprite. |

### 3.5 Palak Aloo · `palak-aloo`

> **Note** (`recipe.palak-aloo.note`, en.ts:462): *"Spinach lies about how much it shrinks. Buy more."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.palak-aloo.prep` | Potato in thick cubes, fried in ghee until the edges go gold, then lift them out. Cumin into the same ghee, onion after, garlic, green chilli. Turmeric goes in off the flame or it turns bitter. | 193 | Turmeric off the flame is real technique, not flavour text. Do not let a translation move it back onto the heat. |
| `recipe.palak-aloo.finish` | Spinach in by the fistful. It looks like far too much and it never is, so keep feeding it. When it collapses, potato back in, lid on, five minutes. Serve it loose. Dry palak aloo is a wasted bunch. | 197 | Carries the note's joke about shrinkage. The fistful image has to survive into Hindi. |

### 3.6 Gobhi Masala · `gobhi-masala`

> **Note** (`recipe.gobhi-masala.note`, en.ts:463): *"Char the cauliflower first. Sad florets, happy plate."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.gobhi-masala.prep` | Cauliflower in big florets. Dry skillet, no oil, no stirring, and let one side go black before you touch it. Char first, always. Out of the pan and set aside while you build the masala. | 185 | The note orders the char first and this step does it first. Prep and Garnish must not be reordered on this sheet. |
| `recipe.gobhi-masala.finish` | Oil, cumin, onion until the edges brown. Ginger, tomato, coriander and turmeric, cooked until the oil comes back up. Cauliflower in, coated, lid on low for five. It should still hold its shape. | 193 | The oil is mustard oil per RecipeList §7.1, which has no sprite, so the line just says oil. |

### 3.7 Rajma · `rajma`

> **Note** (`recipe.rajma.note`, en.ts:464): *"Soak overnight or don't bother starting."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.rajma.prep` | Beans into water the night before. Not two hours, not hot water, the night before. Next morning they should give way between two fingers before you have cooked anything at all. | 176 | The whole step is the soak, because the note refuses to start without it. |
| `recipe.rajma.finish` | Onion browned properly in ghee, garlic and ginger, tomato and coriander, until it leaves the oil at the sides. Beans in with their water, pressure cook, then mash a few against the pot. That is the gravy. | 204 | Mashing a few beans against the pot is the actual thickener; it is the one thing cooks leave out. |

### 3.8 Coconut Chutney · `coconut-chutney`

> **Note** (`recipe.coconut-chutney.note`, en.ts:465): *"Fresh coconut or none. The dried stuff is a rumor."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.coconut-chutney.prep` | Fresh coconut, split and grated. The dried stuff is not the same thing and I will not argue about it. Grind it coarse with green chilli, ginger, a little water and salt. Stop before it turns to paste. | 200 | The bluntest line in the set. Use it as R17's register anchor for how far Ramu's rudeness travels into Hindi. |
| `recipe.coconut-chutney.finish` | Tadka in a small pan. Mustard seed first, wait for the popping to finish, then urad dal until it goes gold, dried chilli, curry leaf. Pour it over hot and leave it sitting there. Let them see it. | 195 | The tadka order (mustard, then dal, then leaf) is technique, not style. A translation must not reorder it. |

### 3.9 Idli · `idli`

> **Note** (`recipe.idli.note`, en.ts:466): *"Steam hot, serve hotter. Cold idli is a crime."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.idli.prep` | Rice and urad dal soaked apart, four hours. Dal ground light and smooth, rice ground coarse, then mixed by hand and not by machine. Salt in, and leave it somewhere warm overnight. It rises or nothing happens. | 208 | Four hours and overnight are both real timings, neither is a measure. |
| `recipe.idli.finish` | Grease the plates, batter in, never filled to the brim. Twelve minutes in the steamer, then test it with a wet finger. Straight out of the mould onto the plate. Nobody has ever wanted a cold idli. | 196 | The note calls cold idli a crime; this says nobody ever wanted one. Same beat, no contradiction. |

### 3.10 Upma · `upma`

> **Note** (`recipe.upma.note`, en.ts:467): *"Roast the rava till the kitchen smells like Sunday."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.upma.prep` | Rava into a dry pan on a low flame and keep it moving. It goes from pale to smelling like a Sunday kitchen, and that smell is your mark. Off the heat before it takes colour. Burnt rava cannot be rescued. | 203 | Rava is the primary and has no sprite, so the rail opens on ghee, which is the wrong first thing to see. See §4.1. |
| `recipe.upma.finish` | Ghee, mustard seed, urad dal, curry leaf, green chilli, ginger, onion until soft. Water at twice the rava, salt, bring it up. Rava in with one hand while the other keeps stirring. Lid on, low, five minutes. | 206 | 'Twice the rava' is a ratio. The longest string in the set at 209 characters. |

### 3.11 Sambar · `sambar`

> **Note** (`recipe.sambar.note`, en.ts:468): *"Tamarind first, patience second."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.sambar.prep` | Tamarind into warm water before you do anything else, and let it sit. Toor dal with turmeric in the cooker until it falls apart on its own. Squeeze the tamarind out with your hand, throw the fibre away. | 202 | Tamarind is the note's first word and this step's first action, and it has no sprite. See §4.1. |
| `recipe.sambar.finish` | Tamarind water on the flame with onion and tomato until the raw smell goes. Dal in, sambar podi, salt, and let it come together slowly. Tadka of mustard, curry leaf and dried chilli over the top at the end. | 206 | Sambar podi is a grinding level in RecipeList §7.2, so the player already knows what it is. |

### 3.12 Beans Poriyal · `beans-poriyal`

> **Note** (`recipe.beans-poriyal.note`, en.ts:469): *"Cut small, cook fast. Nobody wants mushy beans."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.beans-poriyal.prep` | Beans cut fine and all the same size, the smaller the better. This is the entire job. Do it properly and the cooking takes four minutes. Do it lazily and no amount of cooking will save you. | 189 | The dish's own beans have no sprite; the rail is tadka only. See §4.1. |
| `recipe.beans-poriyal.finish` | Mustard seed, urad dal, dried chilli and curry leaf in hot oil. Beans in with salt and a splash of water, lid on, high, three minutes. Lid off, grated coconut in, off the flame. They should still bite back. | 206 | 'Bite back' answers the note's 'nobody wants mushy beans'. |

### 3.13 Pesto · `pesto`

> **Note** (`recipe.pesto.note`, en.ts:470): *"Crush, don't blend. The blender lies about basil."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.pesto.prep` | Mortar, not machine. Garlic and salt crushed to a paste first, pine nuts worked in after, then basil a handful at a time pressed against the side of the bowl. A blade heats it and the green dies. | 195 | Basil is named here and missing from the rail, which shows two tiles. See §4.1. |
| `recipe.pesto.finish` | Oil poured in slowly while the pestle keeps moving. Cheese grated in at the end by hand. It should look rough, not smooth. Loosen it with the water the pasta boiled in, never with more oil. | 189 | Pasta water, not plain water. A translation that drops 'the water the pasta boiled in' loses the technique. |

### 3.14 Minestrone · `minestrone`

> **Note** (`recipe.minestrone.note`, en.ts:471): *"Whatever's in the fridge. That's the whole recipe."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.minestrone.prep` | Onion, garlic, and whatever vegetable is sitting in the fridge, all cut small and all cut the same. Potato, peas, beans, it does not matter. This dish was invented to finish things off, not to start them. | 204 | The note says whatever is in the fridge, so the rail's seven are an example, not a fixed list. Worth saying in a tooltip. |
| `recipe.minestrone.finish` | Soften the onion and garlic, tomato in, then stock and the hard vegetables first. Pasta and peas only in the last ten minutes or they go to paste. Oregano early, in the pot. Serve it thick. | 189 | The only honest home for the oregano sprite among the 22. See §4.4. |

### 3.15 Arrabbiata · `arrabbiata`

> **Note** (`recipe.arrabbiata.note`, en.ts:472): *"One chili too few is still one chili too few."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.arrabbiata.prep` | Garlic sliced thin, not crushed. Cold oil, garlic in, low flame. Chilli flakes go in alongside it so the oil takes the heat properly. Put in more than you think. You will still be wanting more later. | 199 | The note insists on one chilli more, and so does the step. |
| `recipe.arrabbiata.finish` | Tomato in, salt, cooked down until a spoon leaves a clean line across the pan. Pasta straight out of the water into the sauce with a spoonful of that water. Parsley last, off the flame. | 185 | A spoon leaving a clean line across the pan is the real doneness test. |

### 3.16 Aglio E Olio · `aglio-e-olio`

> **Note** (`recipe.aglio-e-olio.note`, en.ts:473): *"Garlic gold, not garlic brown. Watch it like a customer."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.aglio-e-olio.prep` | Garlic sliced thin so every piece cooks at the same speed. Oil barely warm when it goes in, flame kept low, and your eyes on it. Gold is the target. Brown is bitter and there is no fixing bitter. | 195 | Gold not brown, taken straight from the note. |
| `recipe.aglio-e-olio.finish` | Chilli flakes in for ten seconds. A ladle of pasta water into the pan, swirled hard until the oil and water stop fighting each other. Pasta in, tossed, parsley, done. Four things and nowhere to hide. | 199 | Three tiles only, so the rail shows no scroll chevron at this length. |

### 3.17 Risotto · `risotto`

> **Note** (`recipe.risotto.note`, en.ts:474): *"Stir until your arm complains. Then stir more."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.risotto.prep` | Onion cut fine and softened without taking any colour. Rice in dry, turned until the grains go glassy at the edges. Keep the stock hot in a pot beside you. Cold stock hits the rice and stops it dead. | 199 | Arborio has no sprite of its own; the plain rice tile does the job. See §4.2. |
| `recipe.risotto.finish` | One ladle of stock, stir, wait until it is gone, next ladle. Twenty minutes of this and your arm will complain. Keep going. Off the flame, cream and cheese beaten in hard, then rest it two minutes. | 197 | Cream stands in for butter and parmesan, which is not the real finish. See §4.2. The note's stirring joke is carried through. |

### 3.18 Veg Thukpa · `veg-thukpa`

> **Note** (`recipe.veg-thukpa.note`, en.ts:475): *"Broth first, noodles last. Reverse it and regret it."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.veg-thukpa.prep` | Broth first and do not cut corners here. Garlic, ginger, onion and green chilli in hot oil, tomato after, then water, and let it sit on a low flame the whole time you are cutting vegetables. | 190 | Broth first, per the note. Noodles are the dish's primary and have no sprite. |
| `recipe.veg-thukpa.finish` | Vegetables and peas into the broth, salt, two minutes. Noodles at the very last moment, or boiled apart and sitting in the bowl with the broth poured over. Leave them in the pot and the second bowl is glue. | 206 | Noodles last, per the note, and the glue line is the reason why. |

### 3.19 Bamboo Shoot Fry · `bamboo-shoot-fry`

> **Note** (`recipe.bamboo-shoot-fry.note`, en.ts:476): *"Rinse it twice. The first rinse is a lie too."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.bamboo-shoot-fry.prep` | Rinse the shoot, drain it, rinse it again. The first rinse never takes the sourness off whatever the water looks like. Squeeze it dry in your fist, then slice it thin and even. | 176 | Two rinses, per the note. The shoot itself has no sprite. See §4.1. |
| `recipe.bamboo-shoot-fry.finish` | Mustard oil until it smokes, then onion, garlic, ginger and dried chilli. Shoot in on a high flame and keep it moving, five minutes, until the edges catch. Turmeric and salt, green chilli off the flame. | 202 | Mustard oil taken to smoking is the Assamese step; there is no oil sprite to put on the rail. |

### 3.20 Veg Momo · `veg-momo`

> **Note** (`recipe.veg-momo.note`, en.ts:477): *"Fold it ugly, it still steams the same."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.veg-momo.prep` | Flour and water into a stiff dough, rested half an hour. Filling chopped fine and squeezed dry, because water in the filling tears the skin every time. Onion, garlic, ginger, chilli, peas, salt. Raw is fine. | 207 | Squeezing the filling dry is the step everyone skips and the reason skins tear. |
| `recipe.veg-momo.finish` | Rolled thin at the edge and thick in the middle. Spoon it in, pleat it however your fingers manage. An ugly momo steams the same as a pretty one. Oiled basket, ten minutes, and do not lift the lid halfway. | 205 | An ugly momo, straight off the note. |

### 3.21 Sticky Rice · `sticky-rice`

> **Note** (`recipe.sticky-rice.note`, en.ts:478): *"Soak it, don't rush it. Rice remembers shortcuts."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.sticky-rice.prep` | Soak it. Six hours, overnight if the night is yours to spare. There is no fast version of this rice, and whoever told you there was has never sat down and eaten it properly. | 173 | One tile on the whole rail. See §4.1 and §4.5. |
| `recipe.sticky-rice.finish` | Drain it well, into the basket or the leaf, and steam it over a rolling boil. Twenty five minutes, no stirring, no lifting the lid to look. Turn it out and let the steam leave before you touch it. | 196 | 'Twenty five' is spelled out rather than 25, so the Hindi pass never has to mix Devanagari with Latin numerals mid-sentence. |

### 3.22 Ooti · `ooti`

> **Note** (`recipe.ooti.note`, en.ts:479): *"The boss dish. Serve it like you mean it."*

| Key | English | Chars | Notes |
|---|---|---|---|
| `recipe.ooti.prep` | Dried peas soaked overnight, then ground coarse, and the grinding is the part nobody wants to do. Bamboo shoot rinsed and chopped small. Everything after this is slow, and the cooker does most of it. | 199 | The peas here are dried and ground; the peas sprite shows them fresh in the pod. See §4.2. |
| `recipe.ooti.finish` | Peas, bamboo shoot, onion, ginger, garlic and dried chilli into the cooker with water. Cook it until it thickens enough to stand a spoon in. Greens at the end, salt last, and taste it twice before it goes out. | 209 | The boss dish. The note asks for it to be served like you mean it, so the step ends on tasting twice. |

---
## 4. What I am not sure of, and where the sprite pool does not reach

### 4.1 Seven dishes have no sprite for their own primary

RecipeList.md §7.1-7.4 locks a primary per dish. For these seven the primary does not exist as a sprite, so the rail
opens on a supporting ingredient and the dish's identity is carried entirely by the step text and the dish medallion.
I did not substitute anything.

| Dish | Primary, per RecipeList | Locked in | What the rail opens on instead |
|---|---|---|---|
| `palak-aloo` | Spinach | §7.1 | `potato` |
| `upma` | Semolina (rava) | §7.2 | `ghee` |
| `beans-poriyal` | Green beans | §7.2 | `mustard-seed` |
| `pesto` | Basil | §7.3 | `pine-nut` |
| `aglio-e-olio` | Spaghetti | §7.3 | `garlic` |
| `veg-thukpa` | Noodles | §7.4 | `garlic` |
| `bamboo-shoot-fry` | Bamboo shoot | §7.4 | `onion` |

Worst of these is **upma**: its note is entirely about roasting the rava, and the rail opens on ghee.
**Beans poriyal** is close behind, with a rail that is six tadka items and no bean.

### 4.2 Four sprites are standing in for something they are not

- **`rice` does four jobs.** Plain rice (jeera rice), idli rice, arborio (risotto) and glutinous rice (sticky rice)
  are four different grains and one sprite. Jeera rice and idli can share honestly; risotto and sticky rice cannot,
  and sticky rice's whole note is about the grain's behaviour.
- **`cream` in risotto.** A real risotto finishes with butter and parmesan beaten in off the heat. Cream is a
  shortcut, and I used it only because it is the sprite that exists and otherwise has no home among the 22.
  If a butter or parmesan sprite ever lands, drop cream from this rail and fix `recipe.risotto.finish`.
- **`cumin-seed` on naan.** Kalonji is the naan seed. Cumin is plausible enough that nobody will object, but it is
  not the same bread.
- **`peas` in ooti.** Ooti is built from dried peas ground to a powder. The sprite shows fresh peas in the pod,
  which is the wrong state, and the prep line has to do the explaining.

### 4.3 Ten dishes whose real recipe I would want checked

These are flagged rather than guessed. Each one is a decision I made that a cook could reasonably make differently.

1. **Ooti.** Written as an Angami Naga dish: dried peas ground coarse, cooked long with bamboo shoot and greens.
   Households vary on axone and anishi, and some add colocasia stems rather than leaves. This is the boss dish and
   the one I would most want corrected.
2. **Sticky rice.** I wrote plain steamed bora saul. If the intent is sunga saul cooked inside a bamboo tube, the
   finish line is wrong and the sheet should say so, because the tube is the whole point of that version.
3. **Bamboo shoot fry.** The note's "rinse it twice" implies the fermented or preserved shoot (khorisa), not fresh,
   and I wrote it that way. Fresh shoot needs boiling, not rinsing, and the step would change completely.
4. **Veg thukpa.** I wrote the North East dhaba version, which puts tomato in the broth. A Tibetan or Sikkimese cook
   would not, and would build the broth on bone or plain water with soy. Both are real; they are different dishes.
5. **Risotto.** See §4.2. The cream is technique I do not actually endorse.
6. **Coffee.** I assumed South Indian filter decoction throughout, which is what the `coffee-extract` sprite implies.
   If the game means a highway dhaba coffee (instant stirred into boiled milk), both steps are wrong from the first word.
7. **Upma.** I used ghee, following RecipeList §7.2. Plenty of South Indian kitchens use oil, and the tadka often
   carries chana dal and cashew, which I left out. Also unresolved: whether the rava is roasted fresh or bought roasted.
8. **Coconut chutney.** I left roasted gram off the rail and out of the steps rather than guess at the proportion.
   Cooks who use it consider it the difference between chutney and coconut paste.
9. **Naan.** Milk rather than yoghurt, cumin rather than kalonji, both forced by the sprite pool. See §4.1 and §4.2.
10. **Minestrone.** Its own note says whatever is in the fridge, which makes *any* fixed rail slightly false.
    The seven I chose are defensible; they are not the recipe, because there isn't one.

### 4.4 One sprite has no honest dish among the 22

Every sprite in my rails lands on at least one dish except **`aubergine`**, and that is not a mistake in the pool.
Aubergine was drawn for **Baingan Bharta** (RecipeList §7.1, Node 1 level 3, "Smoke & Ash"), which is a *level*
dish and is not one of the 22 recipe slugs in `recipes.ts`. The same is true of xaak bhaji, rasam and bruschetta.

Ideas.md §6d point 4 reads "Every one maps to at least one recipe". That claim holds against the wider dish list and
not against `RECIPE_SLUGS`, and the shipped `RECIPE_INGREDIENTS` turned it into a hard rule: its header comment
commits to using all 33 aliases at least once, so aubergine was placed in **minestrone**. It is not a minestrone
vegetable. The dish's own note ("whatever's in the fridge") is the only thing that makes it survivable.

There are three ways out and none of them is mine to pick: drop the use-every-sprite rule for this one alias, add
**Baingan Bharta** to `RECIPE_SLUGS` as a 23rd scroll so the sprite has its real home, or leave it in minestrone and
accept it. The middle option is the only one that makes the sprite earn its cost.

Two smaller placements of convenience, both honest but worth knowing:

- **`oregano`** exists for the Italian herb blend, which is a grinding level and not a dish. Its only defensible home
  among the 22 is minestrone, where dried herbs genuinely go into the pot. Arrabbiata and aglio e olio traditionally
  take none.
- **`coriander-seed`** is ground dhania, and it earns its place in gobhi masala and rajma. It is not the leaf, and
  the two garnish lines that want the leaf say "coriander" in the step text with no tile to match.

### 4.5 Sticky rice cannot reach two tiles, and the shipped list solved it better

The brief asks for 2 to 7 ingredients per dish. **My sticky rice has one.** It is rice, water and salt, steamed, and
RecipeList §7.4 confirms it: primary Rice, no oil, no secondary, Steam Cooktop. Padding it would have meant inventing
an ingredient, so I left it at one tile and flagged it.

**Round 17 got there first and got it right.** The shipped rail is `rice · coconut-half`, and that is honest: bora
saul is genuinely eaten with coconut, so the second tile is a real pairing rather than padding. Take the shipped
pair. This is the one place where the constraint I refused to bend produced a worse answer than bending it.

The underlying UI question still stands for any future one-item dish: a rail labelled "Ingredients · 1" beside a
seven-tile one needs a defined state, either a graceful single-tile layout or the whole section omitted.

### 4.6 Consolidated wanted list, ranked by dishes served

Everything named in §2's Wanted column, deduplicated. This is the art round 5 ask if the sheet is to stop leaning
on step text for things the player should be able to see.

| Wanted sprite | Dishes | Which | Why it matters |
|---|---|---|---|
| Cooking oil (mustard / olive / sesame / coconut) | 12 | gobhi-masala, coconut-chutney, beans-poriyal, pesto, minestrone, arrabbiata, aglio-e-olio, risotto, veg-thukpa, bamboo-shoot-fry, veg-momo, ooti | **The single biggest gap.** Ghee is the only fat with a sprite, and RecipeList §7 assigns a *different* oil to four of the five nodes. One generic oil bottle closes all twelve; four labelled bottles would also carry the node's identity. |
| Salt | 20 | every savoury dish | Possibly a deliberate omission, like water. If so, say so once in the sheet's chrome rather than per dish. |
| Pasta and noodles | 4 | aglio-e-olio, arrabbiata, minestrone, veg-thukpa | Two sprites minimum: a long strand and a short tube or a noodle nest. Spaghetti and noodles are both *primaries* per §7.3 and §7.4. |
| Carrot | 3 | minestrone, veg-thukpa, veg-momo | Cheap sprite, three dishes, and it makes the momo and thukpa fillings legible. |
| Stock | 3 | minestrone, risotto, veg-thukpa | Could reasonably be drawn as a pot rather than an ingredient, or left to the step text. |
| Cabbage | 2 | veg-thukpa, veg-momo | RecipeList §7.4 names it the secondary for both. Its absence is why both rails lean on peas. |
| Bamboo shoot | 2 | bamboo-shoot-fry, ooti | One of them is named after it. The fermented jar version would serve both. |
| Sugar | 2 | chai, coffee | The entire FTUE beverage node has no sweetener sprite. |
| Fresh coriander leaf | 2 | jeera-rice, upma | Garnish on far more than two in practice. The coriander *seed* sprite is a different thing and must not be reused. |
| Parmesan | 2 | pesto, risotto | Both finish on it. Without it, risotto's finish leans on the cream stand-in. |
| Spring onion | 2 | veg-thukpa, veg-momo | Low priority, cosmetic. |
| Spinach | 1 | palak-aloo | Also xaak-bhaji, which is a level dish but not a recipe slug. Two dishes across the wider list. |
| Semolina / rava | 1 | upma | The dish's primary, and its note is about roasting it. |
| Green beans | 1 | beans-poriyal | The dish's primary and half its name. |
| Basil | 1 | pesto | The dish's primary, named in its own note, and one of the Italian herb blend's grinds. |
| Tamarind | 1 | sambar | The first word of sambar's note. Also rasam, outside the 22. |
| Yoghurt | 1 | naan | What a dhaba actually leavens with. |
| Roasted gram (pottukadalai) | 1 | coconut-chutney | Many cooks treat it as non-negotiable for body. Left off the rail rather than guessed at. |
| Nigella (kalonji) | 1 | naan | The seed actually pressed into naan. Cumin is standing in. |
| Fenugreek seed (methi) | 1 | idli | Small but it is what makes the batter ferment properly. |
| Banana leaf or bamboo tube | 1 | sticky-rice | Not an ingredient. Lower priority now that the shipped rail pairs the rice with coconut, which is honest (§4.5), but it is what the dish is actually cooked in. |
| Colocasia or yam greens | 1 | ooti | Boss dish. Worth the sprite for that reason alone. |
| Bhut jolokia | 0 | node 4's paste | RecipeList §7.4 makes it the node's identity and the reason its container reads red-orange rather than green. No dish lists it directly because the paste is a grinding level. |

**If only three are drawn:** cooking oil, a pasta or noodle, and cabbage. Those close twelve, four and two dishes
respectively, and two of them are locked primaries.

### 4.7 Where my ingredient names differ from the shipped ones

All 33 `ingredient.*` keys landed in `en.ts` during this pass. I wrote §1 before I could see them and we agree on
**31 of 33**. The two that differ:

| Key | Shipped (en.ts) | Mine | Which I would keep |
|---|---|---|---|
| `ingredient.tea-leaf` | Tea Leaf (`:424`) | Tea Leaves | **Theirs.** The singular matches the key and a tile label is a noun, not a sentence. Mine reads better in isolation and that is not worth a divergence. |
| `ingredient.coffee-extract` | Coffee Extract (`:425`) | Coffee Decoction | **Mine.** "Extract" is what the file is called; "decoction" is what the thing is, and it is the word every South Indian kitchen uses. It also tells the translator which drink this is, which matters for §4.3 item 6. |

Neither is worth a code change on its own. Both are worth deciding before R17 translates them, because "extract"
and "decoction" do not have the same Hindi or Tamil word, and the plural question does not exist in Devanagari the
way it does in English.

---

## 5. Counts

| | Count |
|---|---|
| `ingredient.<key>` display names written | **33** |
| ... of those, already shipped in `en.ts` during this pass | 33 (31 identical to mine, 2 differ, §4.7) |
| `recipe.<slug>.prep` | **22** |
| `recipe.<slug>.finish` | **22** |
| **Keys that are genuinely new** | **44** (every `.prep` and `.finish`; `en.ts` has zero today) |
| Keys in total if the two name changes in §4.7 are taken | 46 |
| Existing `recipe.<slug>.note` keys, unchanged | 22 (en.ts:458-479, and it moved twice while I wrote) |
| Dishes where my rail disagrees with the shipped one on food | 7 of 22 (§0.1) |
| Ingredient tile placements across all rails | 109 |
| Rails that scroll sideways (5 or more tiles) | 14 of 22 |
| Dishes with 4 or more tiles | 16 of 22 |
| Dishes with 3 or more tiles | 18 of 22 |
| Dishes below 3 tiles | 4 (`coffee`, `idli`, `pesto`, `sticky-rice`) |
| Sprites with no honest dish among the 22 | 1 (`aubergine`; the shipped rail puts it in minestrone, §4.4) |
| Dishes whose RecipeList primary has no sprite | 7 of 22 |
| Distinct sprites wanted and missing | 23 |
| Step length, shortest to longest | 173 to 209 characters |
| Step cap per Ideas.md §6d | 240 |
| Longest ingredient label | 16 characters |
| Dishes flagged for the user's review | 10 (§4.3) |

Every number above is computed from the tables in this file, not tallied by hand. The 44 step strings were checked
programmatically for the 240 cap, for em dashes, for emoji and for any non-ASCII character: zero violations.
All 22 quoted notes were compared character for character against the live `en.ts` and all 22 match.

⚠️ **One number in Ideas.md §6d does not survive.** Point 4 says "20 of 22 dishes have ≥ 3 sprites, 16 have ≥ 4".
Against these rails, **16 of 22** have four or more, which matches, but only **18 of 22** reach three:
`coffee`, `idli`, `pesto`, `sticky-rice` fall short. The ≥ 4 figure is right and the ≥ 3 figure is two dishes optimistic.

---

## 6. What Round 17 needs from this

Not instructions, just the things that will bite whoever implements the sheet.

1. **The rail data and the helpers already exist**, shipped during this pass: `RECIPE_INGREDIENTS` at recipes.ts:70,
   `recipeIngredients()` at :98, `ingredientNameKey()` at :106. Nothing in §2 needs new plumbing. What §0.1 asks for
   is a content review of the seven rails that are wrong as food, and that is a data edit, not a code one.
2. **`recipeStepKey(slug, part)` is the one helper still missing**, to sit beside `recipeNoteKey` and build
   `recipe.<slug>.prep` / `.finish`. `RecipeSheet.tsx` would otherwise concatenate the same shape in two places.
3. **`hasTranslation()` already does the right thing.** `i18n/index.ts:85-97` omits a section whose key is absent
   rather than echo the key, which is why these 44 strings can land in one commit with no interim placeholder state.
   Once they land, every sheet renders all three sections for the first time.
4. **`recipe.sheet.ingredients` shipped as a flat `{n}` string, not a plural entry.** §0.2. `tn()` already exists
   and takes a `one` / `other` pair, so this is a one-line change, and "Ingredients · 1" is reachable today.
5. **A one-tile rail needs a defined state.** §4.5. No dish hits it under the shipped data, and my sticky rice does.
6. **Nothing here interpolates.** All 77 strings are literals, no `{n}` and no `{name}`, which makes this the
   easiest block in the table to translate and the only one where a translator can work without seeing the screen.
7. **Ordering is load-bearing for three dishes.** Gobhi masala chars before anything else, sambar starts at the
   tamarind, thukpa builds broth before noodles. If the sheet ever reorders Prep and Garnish, those three break
   their own notes.
8. **The steps and the rail have to agree, and today they would not.** `recipe.ooti.finish` names peas and bamboo
   shoot while the shipped rail shows rice, ghee and whole garam masala. `recipe.upma.prep` is about rava while the
   rail shows flour. Whichever way §0.1 is resolved, resolve it before both are on screen at the same time, because
   the sheet puts the rail directly above the steps.
9. **For R17's Hindi pass:** dish names stay as the Hindi dish name (नान, राजमा) per the convention already set in
   [strings.md](strings.md). Ingredient names should follow the same rule and use the kitchen word, not the
   dictionary one: जीरा not जीरक, हल्दी not हरिद्रा, कढ़ी पत्ता, उड़द दाल. The register anchor for the steps is
   `recipe.coconut-chutney.prep`, which is the bluntest line in the set; if that survives into Hindi without going
   polite, the other 43 will too.
