# LevelEconomy — the source of truth for every currency value, per level

**Last updated:** Sep 8 2026, 05:10 IST
**Status:** 🟡 **FTUE level 1 finalised. Every other level is deliberately empty.**
**Tracked in git** — this file is *not* gitignored and must never be. It carries no
credentials; it is design data, and it is meant to be read alongside the code.

Two currencies and one derived award, and this document is the only place their
per-level values are settled:

| | |
|---|---|
| 🪙 **Coins** | Earned **during** a round, spent **during** it, **never carried forward**. Buys slot unlocks and props. Every level opens with a fixed starting float. |
| 👨‍🍳 **Chef Hat** | Awarded **at the end** of a level. Replaces gems as the persistent meta currency. Spent in the main-menu shop. |
| ⭐ **Stars** | Not a currency — derived from **coins earned** during the level (§7.3a). Stars unlock prop tiers, so they sit upstream of §7.1 pricing. |

🔁 **This document updates on every value change.** A number that lives in
`kitchenConfig.ts` but not here is undocumented; a number here that the code contradicts
is a bug in one of the two. When they disagree, **this file states the intent and the
code states the fact** — reconcile explicitly, do not assume.

---

## 1. Status roll-up

| | **Node 0** | **Node 1** | **Node 2** | **Node 3** | **Node 4** |
|---|---|---|---|---|---|
| Cuisine | Beverages *(FTUE)* | North Indian | South Indian | Italian | North Eastern |
| Masala | — *(no grinding level)* | Garam Masala | Sambar podi **+** Rasam podi | Italian herb blend | The paste *(ginger · garlic · bhut jolokia)* |
| Levels | **4** | 8 | **9** | 8 | 8 |
| Economy defined | **1 of 4** | 0 of 8 | 0 of 9 | 0 of 8 | 0 of 8 |

**37 levels total · 1 defined.** Level counts follow [RecipeList.md](RecipeList.md) §9.2
(six dishes + one grinding level + one boss = 8) with node 2 the stated exception at 9
(two podis), and node 0 the stated exception at 4 (§7.0 — a tutorial node, and it has no
grinding level at all).

---

## 2. Node 0 — Beverages (FTUE)

[RecipeList.md](RecipeList.md) §7.0. Props available: Water Dispenser `43–44` ·
Kettle `19–21` · Beverage Dispenser `01–02`. The boss unlocks Brazier `03` and
Tandoor `09–10`.

| | **L1 · Chai** | **L2 · Coffee** | **L3 · Chai & Coffee** | **L4 · Boss** |
|---|---|---|---|---|
| Teaches | one chain, one prop | a second, independent chain | both chains on one belt | pressure |
| Ingredients per recipe | **3** | ⬜ | ⬜ | ⬜ |
| Dish target | **12** | ⬜ | ⬜ | **none — endless** |
| Walkouts allowed | **5** | ⬜ | ⬜ | ⬜ |
| Round length (est.) | **~1m 25s – 1m 40s** | ⬜ | ⬜ | ⬜ |
| 🪙 Starting float | **100** | ⬜ | ⬜ | **100** · tier 1 only, §2.1 |
| 🪙 Per grab | **+3** | ⬜ | ⬜ | ⬜ |
| 🪙 Per dish completed | **+20** | ⬜ | ⬜ | ⬜ |
| 🪙 Total earnable (flawless) | **348** | ⬜ | ⬜ | ⬜ |
| 🪙 Total available | **448** | ⬜ | ⬜ | ⬜ |
| 🪙 Full build cost | **360** | ⬜ | ⬜ | ⬜ |
| 🪙 Spare at full build | **88** | ⬜ | ⬜ | ⬜ |
| 🪙 Hard floor (unplayable below) | **90** | ⬜ | ⬜ | ⬜ |
| 👨‍🍳 Flawless run | **465** | ⬜ | ⬜ | ⬜ |
| 👨‍🍳 Cleared, 4 walkouts | **365–381** | ⬜ | ⬜ | ⬜ |
| 👨‍🍳 Loss floor (2 dishes) | **40** | ⬜ | ⬜ | ⬜ |
| ⭐⭐⭐ at coins earned ≥ | **340** | ⬜ | ⬜ | — **no stars** |
| ⭐⭐ at coins earned ≥ | **295** | ⬜ | ⬜ | — **no stars** |

✅ **The boss awards no stars at all** — settled Sep 7. It never "clears", so no threshold
could apply. Its coins earned go to a **leaderboard** instead ([KitchenMode.md](KitchenMode.md)
§6.9), which is also where its Chef Hats come from.

### 2.1 🔒 The boss (L4) already has rules — from before this document existed

The user described L4 as an *"endless round"* (Sep 7), and
[KitchenMode.md](KitchenMode.md) §6's node table already agrees. **Three of its values
are therefore not open questions — they are prior decisions this document must respect:**

> *"Every node ends in a **boss**: all props unlocked for that node available across the
> 4 slots, **starting cash covering tier 1 only**, waves accelerating until the walkout
> limit. **Chef hats scale with waves cleared.**"*
>
> ⚠️ *"The boss terminates on **walkouts**, not on a ticket count."*

| Boss value | Already decided | Consequence for this document |
|---|---|---|
| Ends on | **Walkouts** — endless until the budget runs out | ✅ Confirms "endless"; there is **no dish target** |
| 🪙 Starting float | **Enough for tier 1 only** | A rule, not a number. For node 0 it resolves to **90–119**: at least `50 + 40` to open one Level-1 station, and strictly under `50 + 70` = **120**, or a Level-2 opener becomes affordable. ➡️ **Recommend 100**, the same as FTUE L1 |
| 👨‍🍳 Chef Hat | **Scales with waves cleared** | ✅ Formula written — **§7.3b**. A wave is **4 dishes**; hats are `Σ(wave × 30)` |
| Belt speed cap | **Half the ordinary floor** (user, Sep 7) | ✅ `minTraverse` **10.0 → 5.0s** = 390 u/s, a **1.11s** reaction window. §7.3b |

✅ **§7.3's ordinary formula does not work here and has been replaced, not patched.** Two
of its four terms assume a finite target: `dishes × 20` is unbounded on an endless round,
and `+100 if cleared` is meaningless when a boss is *survived* rather than cleared — the
walkout term is likewise always 0, because walkouts are how a boss ends. See **§7.3b**.

---

## 3. Node 1 — North Indian

⬜ **Entire node undefined.** Level order is not fixed; columns are placeholders.

Six dishes ([RecipeList.md](RecipeList.md) §7.1): Baingan Bharta · **Naan** · Rajma ·
Jeera Rice · Gobhi Masala · Palak Aloo. Plus one grinding level (Garam Masala) and one
boss.

🔒 **Naan — settled Sep 7, and it is this document's first pre-placed prop.** The Naan
level opens with `09-Cooktop only tandoor` **already placed in the top-right slot,
irreplaceable and unsellable** (§7.2a). Three consequences for pricing that level:

1. Its float must be sized against **three** buyable slots, not four. Full build drops
   from `4×50 + 4×40` = **360** to `3×50 + 3×40` = **270** — **90 less** than an
   equivalent level with no pre-placed prop.
2. The Tandoor costs **0 coins** and its slot costs **0** — but it consumes a quarter of
   the board, which is the real price.
3. The player never needs to have unlocked Cooktop L4, so §7.5's "ladder met backwards"
   objection does not apply here at all.

| | L1 | L2 | L3 | L4 | L5 | L6 | L7 · grind | L8 · boss |
|---|---|---|---|---|---|---|---|---|
| Dish | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Ingredients per recipe | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Dish target | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Walkouts allowed | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 🪙 Starting float | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 🪙 Total earnable | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 🪙 Full build cost | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 👨‍🍳 Flawless run | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## 4. Node 2 — South Indian

⬜ **Entire node undefined.** Nine levels, not eight — Rasam podi and Sambar podi are
different blends and neither substitutes for the other (§7.2).

Six dishes: Coconut Chutney · Upma · Rasam · Idli · Beans Poriyal · Sambar.
Plus **two** grinding levels and one boss.

| | L1 | L2 | L3 | L4 | L5 | L6 | L7 · grind | L8 · grind | L9 · boss |
|---|---|---|---|---|---|---|---|---|---|
| Dish | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Ingredients per recipe | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Dish target | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Walkouts allowed | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 🪙 Starting float | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 🪙 Total earnable | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 🪙 Full build cost | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 👨‍🍳 Flawless run | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

⚠️ A universal tadka (mustard seed + curry leaf + urad dal) appears in five of six
dishes and **must be one container, not three cells** — it changes the ingredient count
per recipe, which is the input to both currency formulas.

---

## 5. Node 3 — Italian

⬜ **Entire node undefined.**

Six dishes: Pesto · Aglio e Olio · Minestrone · Bruschetta · Arrabbiata · Risotto.
Plus one grinding level (Italian herb blend) and one boss.

| | L1 | L2 | L3 | L4 | L5 | L6 | L7 · grind | L8 · boss |
|---|---|---|---|---|---|---|---|---|
| Dish | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Ingredients per recipe | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Dish target | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Walkouts allowed | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 🪙 Starting float | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 🪙 Total earnable | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 🪙 Full build cost | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 👨‍🍳 Flawless run | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

✅ Every dish lands at exactly 4 cells with one spare — the cleanest node, so this is
likely the easiest to price once node 0 is proven.

---

## 6. Node 4 — North Eastern

⬜ **Entire node undefined.**

Six dishes: Xaak Bhaji · Bamboo Shoot Fry · Veg Thukpa · Sticky Rice · Ooti · Veg Momo.
Plus one grinding level (the paste) and one boss.

| | L1 | L2 | L3 | L4 | L5 | L6 | L7 · grind | L8 · boss |
|---|---|---|---|---|---|---|---|---|
| Dish | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Ingredients per recipe | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Dish target | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Walkouts allowed | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 🪙 Starting float | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 🪙 Total earnable | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 🪙 Full build cost | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 👨‍🍳 Flawless run | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

🔒 Node 4 introduces no new prop family — its new tool is a **tier** (the Wok is Fry Pan
L4). So node 4's costs are driven entirely by §7's tier ladder, not by new props.

---

## 7. Global constants — the same on every level

These are **not** per-level. A level tunes its float, target and walkout budget; it does
not tune these.

### 7.1 🪙 Coin costs

| | Cost |
|---|---|
| Slot unlock | **50**, flat, all four |
| Prop — Level 1 | **40** |
| Prop — Level 2 | **70** |
| Prop — Level 3 | **120** |
| Prop — Level 4 | **200** |
| Prop — Level 5 | **320** |
| Sell refund | **0.75×** the prop's cost — **prop only, the slot stays unlocked** |

**Why ~1.7× per tier.** One Level 3 (120) costs exactly three Level 1s (120), and one
Level 2 (70) is a shade *under* two Level 1s (80). That makes
[PropList.md](PropList.md) §7.1's stated trade — *"one strong station, or two weak
ones"* — true at the till: going wide is marginally cheaper, so going tall has to earn
it on power. A flat step per tier would make high tiers strictly better; a 2.5× step
would make them ornamental.

**Why the refund is 0.75 and not 1.0.** Swapping a placed Level 1 for a Level 2 costs
`40 + 70 − 30` = **80**, against **70** for committing to Level 2 up front. A 10-coin
premium for changing your mind, which is exactly what `config.ts` says the number is
for: *"low values make placement a commitment."*

### 7.2 🔴 The unlock guard

**A second slot cannot be unlocked while zero props are placed.** Attempting it shows:

> **"You must place an Utensil to unlock!"**

Without this, a player at the FTUE float can spend `50 + 50` on two unlocks, hold **0
coins and no props**, and be permanently unable to act:
[kitchenScene.ts](../../jam-entry/src/game/kitchenScene.ts)'s slot handler routes an
**empty** slot to the picker and only a **filled** slot to `sim.tapSlot`, so no prop
means no collection, which means no income, which means no prop. **The round becomes
unwinnable and reports nothing** — the belt simply runs past until the walkout budget
expires. See [Retro.md](Retro.md) item 53.

### 7.2a ✅ The loaner rule — settled Sep 7: **pre-placed, locked, unpriced**

[KitchenMode.md](KitchenMode.md) §6, decision 6: *"**Loaner for the round.** A level
needing an unearned tier lends it; keeping it requires the star."* This satisfies GDD
§10.10's *"no hard block, ever"*.

**In plain terms:** some levels need a tool the player has not earned yet. Node 1's Naan
needs a Tandoor, which is **Cooktop Level 4** — and a player arriving at node 1 has
climbed no further than Level 1. Without a loaner they would be stuck on a level the game
gave them.

**Why pricing it was the wrong question.** Three options existed and *all three break*,
because tiers are priced per-placement rather than per-unlock:

| Option | What happens |
|---|---|
| Lend it **free** | The under-progressed player gets a 200-coin tool for nothing while a player who *earned* Level 4 pays 200 for the same tool. **Not unlocking becomes the better play.** |
| Lend it at **full price** (200) | Unaffordable against a float sized for tier 1 — a hard block, which is the exact thing decision 6 exists to prevent. |
| Lend it at the player's **own** tier price (40) | Same inversion as free, only smaller. |

✅ **The user's Sep 7 ruling dissolves the question:** the required prop is
**pre-placed at the launch of the round, in a fixed slot, and cannot be sold or
replaced.** Their words, of the Naan level: *"that round will have an irreplaceable prop
from the launch of the round on the top right prop slot, `09-Cooktop only tandoor`."*

So a loaner is **never purchased**, and therefore never priced:

| Rule | |
|---|---|
| Cost | **0 coins** — it is placed by the level, not bought |
| Slot | Occupies one of the four; that slot is **already unlocked** and no 50 is charged |
| Refund | **None.** It cannot be sold, so §7.1's 0.75 refund cannot be farmed against it |
| Real cost to the player | **A slot.** Three buyable slots remain instead of four |

**What unlocking a tier is still worth**, given loaners are free: permission to place it on
levels that *don't* require it, and to keep it after the round. A loaner is permission for
one level, not a discount.

➡️ **A level's float must be sized against three buyable slots, not four**, wherever a
prop is pre-placed. Node 0 has no pre-placed props, which is why FTUE level 1 could be
settled before this rule existed.

### 7.3 👨‍🍳 The Chef Hat formula

```
Chef Hat = (dishes delivered × 20)
         + (leftover ingredients × 2)
         + ((walkoutsAllowed − walkouts) × 25)
         + 100 if the shift was cleared
```

Player-facing, the third term reads simply: **every walkout costs you 25 hats.**

**Why the score sits in the walkout term.** A level ends at its dish target, so **every
winner delivers exactly the target** — `dishes × 20` is a constant for anyone who wins,
and the only axis a winner can still move is how cleanly they hit it. A formula that
does not weight walkouts cannot tell winners apart at all.

**Why leftovers are worth only 2.** Completion is *involuntary* — the moment a full set
is held, `sim/kitchen.ts` consumes it — so a player cannot hoard, and the leftover count
is the incidental surplus of over-represented kinds at the final completion: **0–4
almost regardless of skill.** It is also redundant with the walkout term (both reward
grabbing more). It is kept as flavour — nothing you caught was wasted — not as a score
term. **The real home for leftovers is currency conversion, once that exists.**

⬜ **Recipe-length multiplier — proposed, NOT adopted.** `× (1 + 0.1 × (n − 3))` would
pay 1.0 / 1.1 / 1.2 for 3 / 4 / 5-ingredient recipes. Without it, a node-4 dish taking 5
grabs pays **exactly the same** as chai taking 3. Revisit when node 1 is priced.

### 7.3a ⭐ Stars — awarded on **coins earned**

Settled Sep 7 (corrected same day: **earned**, not remaining). Stars are what unlock prop
tiers ([RecipeList.md](RecipeList.md) §9.2), so this is the rule that feeds §7.1's ladder.

| Stars | Condition as given |
|---|---|
| ⭐⭐⭐ | Coins earned **≥ total earnable ÷ 3**, and anything beyond |
| ⭐⭐ | *(not specified)* |
| ⭐ | **Cleared** the round |
| — | Not cleared — **no stars at all** |

✅ **Spending no longer costs stars.** Measuring *earned* rather than *remaining* removes
the inversion where buying stations lowered your score. Building is now free of scoring
penalty, and — with a walkout term (§7.3a.2) — actively rewarded, because stations reduce
walkouts.

### 7.3a.1 🔴 But coins earned is *maximised by the worst legal run*

On a target-capped level, coins earned decomposes into a constant and a term that **rises
with mistakes**:

```
earned = 3 × grabs + 20 × dishes
       = 3 × (36 + leftover) + 240          (every winner delivers exactly 12)
       = 348 + 3 × leftover
```

And leftover is *caused by* walkouts. Missing an ingredient does not remove it from the
requirement — the belt must keep spawning until you have twelve of that kind, and every
extra lap hands you extra grabs of the **other** two kinds:

| Walkouts | Laps spawned | Grabs | Leftover | **Coins earned** |
|---|---|---|---|---|
| **0** — flawless | 12 | 36 | 0 | **348** |
| 1 | 13 | 38 | 2 | **354** |
| 2 | 14 | 40 | 4 | **360** |
| 3 | 15 | 42 | 6 | **366** |
| **4** — scraped home | 16 | 44 | 8 | **372** |

The table above assumes the misses **concentrate on one ingredient**, which is the worst
case for lap count. Misses spread evenly across all three kinds cost no extra laps and
earn the same 348 as a flawless run. So precisely: **earned is `348 + 6 × (misses of the
most-missed kind)`.**

🔴 **Either way the flawless player is tied for the LOWEST earned score any winner can
post, and the maximum belongs to the player who plays as badly as possible without
losing.** A skill measure that its best possible performance can never top is not a skill
measure — any threshold on raw earned coins ranks winners backwards or not at all.

🔴 **And `earnable ÷ 3` cannot discriminate at all.** With earnable at 348, the 3-star bar
is **116** — but *every* cleared run earns at least 348, three times the bar. Under the
rule as written, **every clear is three stars** and the ⭐/⭐⭐ bands are unreachable.

### 7.3a.2 ✅ The fix: charge coins for walkouts — **adopted Sep 7**

One term restores the ordering, and it mirrors the Chef Hat's *"a walkout costs 25"*
exactly — one number to remember across both currencies:

```
earned = max(100, 3 × grabs + 20 × dishes − 25 × walkouts)
```

🔒 **Three rules the user set with it, Sep 7:**

1. **The starting float is never counted as earned.** `earned` is what the *round*
   paid you. FTUE level 1's opening 100 is a grant, not income.
2. **The 100 floor holds only until the first prop is placed — then it lifts.**
   The user, Sep 7: *"If a prop is placed then there's no 100 cap."*
3. After that the charge is real: it comes off the wallet as well as the tally, and
   the wallet bottoms out at 0.

✅ **Why the floor is exactly the right shape.** Dishes spawn and run off the end
whether or not the player has placed anything, so **walkouts can accrue before the
first prop exists** — during the opening seconds, or while a hesitant player reads the
picker. And with no prop placed there is **no way to grab, therefore no way to earn
back what those walkouts take**. Unfloored, a slow start could drop the wallet under
the 90 needed to open a station at all and leave the round **unwinnable with no way to
report why** — exactly [Retro.md](Retro.md) item 53's failure. Once one prop is down,
income exists, so the charge is fair and the floor is no longer needed. **It protects
the player from a decision they have not made yet, and nothing after that.**

One deduction, two visible consequences: the wallet is `100 + earned − spent`, so a
walkout costs the player **spending power and stars at once**, not twice over.

| Walkouts | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| **Coins earned** | **348** | 329 | 310 | 291 | **272** |

Monotonic, flawless on top, and a **1.28×** spread across winners — the same spread §7.3
produces for hats, which is not a coincidence: **walkouts are the only thing that varies
between two winners**, so any star rule on any quantity collapses to counting them.

**Bands — settled Sep 7, stated in coins.** The user chose coins over walkout counts
deliberately: *"keep it so that it's not so easy to just speedrun a 3 star
achievement."* A visible number to beat is a target; a visible walkout count is a
budget, and a budget invites spending it.

| Stars | Threshold | Reaches |
|---|---|---|
| ⭐⭐⭐ | earned **≥ 340** | **0 walkouts only** |
| ⭐⭐ | earned **≥ 300** | 1–2 walkouts |
| ⭐ | cleared | 3–4 walkouts |
| — | not cleared | — |

⭐⭐⭐ is reachable **only** by a flawless run — 348 against a 340 bar, with the next
rung down at 329. There is no way to buy it with speed or with spending; the only
route is not dropping anything.

📺 **End screen, on a clear:** show **coins earned**, and print each star's
threshold beneath it — `340 / 300 / cleared`. The user's reason: *"it'll encourage
retries."* A player who sees **329** against a **340** bar knows exactly what one more
attempt is worth; a player shown only two filled stars learns nothing.

### 7.3a.3 ✅ Prop cooldown — **2.0s on USE, adopted Sep 7**

✅ **Settled: a prop that takes an ingredient cannot take another for 2.0 seconds.**
The reasoning that produced the number is kept below.

As built, **a prop has no cooldown** — `sim/kitchen.ts`'s `tapSlot` can fire every frame, and throughput is capped
by `spawnInterval` (2.2s), not by station count. One station sits in reach of a dish for
~3.1s at opening speed, so it can take **every dish that passes**. Extra stations give a
second chance on run 2; they do not raise capacity.

So §7.1's prices currently buy *reliability*, not *rate*. With the walkout charge in place
that is coherent — fewer walkouts is worth real coins and real stars.

**If a cooldown is added, it is on USE, not on placement.** Placement is a one-off
purchase; a delay there would only add a pause to a menu. The rule would be: *after a
prop takes an ingredient, that prop cannot take another for N seconds.*

**And N should be 2.0s, not the 3.0s first proposed.** The spawn rate is
`1 ÷ 2.2` = **0.455 dishes/s**, and one prop's rate is `1 ÷ N`:

| N | One prop | vs spawn rate | FTUE opening, one station |
|---|---|---|---|
| **3.0s** | 0.333/s | ❌ **27% short** | ~2 walkouts spent before station 2 is affordable at ~18s |
| **2.0s** | 0.500/s | ✅ 10% margin | Survivable but tight — no slack for a fumble |
| none (today) | uncapped | ✅ | One station takes every dish that passes |

3.0s would burn two of the five walkouts before the player can afford a second station,
which punishes the FTUE float rather than the player. **2.0s makes one station tight,
two comfortable and four insurance at speed** — and it stops binding at the boss's floor
anyway, where dishes arrive every 2.2s and the 1.11s reach window is the real limit. It
also reads naturally: the kettle is busy.

### 7.3a.3 ✅ The bands survive rounds 12–13 untouched — and they generalise

Recorded Sep 8 2026, after **three briefs of mine wrongly flagged them as invalidated.**

🔴 **The error.** Rounds 12 and 13 changed station acceptance — `slotReach` 260 → 180,
then radial reach replaced by belt zones entirely — and I recorded in each handover that
the flawless **348 / 465** baseline and the ⭐ **340 / 295** bands were "derived at
`slotReach: 260`" and had to be re-earned by play. **They were not, and they do not.**
`earned` reads `3 × grabs + 20 × dishes − 25 × walkouts`. There is no distance term, no
reach term, no zone term. Rounds 12 and 13 changed how *hard* it is to reach a given
walkout count and changed the resulting score by exactly zero. The round 13 agent said so
plainly in its report; I repeated the stale claim into the round 14 brief anyway.

✅ **Robustness check the bands had never been given.** `leftover` is bounded by the bag
at `2 × walkouts`, so each walkout count is a **band, not a point**:

| Walkouts | Earned range | Gap to the next band |
|---|---|---|
| 0 | **348** | 19 |
| 1 | 323 – 329 | 13 |
| 2 | 298 – 310 | **7** |
| 3 | 273 – 291 | **1** |
| 4 | 248 – 272 | — |

**340 sits inside the 329→348 gap; 295 sits inside the 291→298 gap.** Both discriminate
correctly across the whole leftover range, which is the property that actually matters
and had not been verified before. 295 is the exact midpoint of its gap.

✅ **Generalised, so none of the remaining 36 levels needs hand-tuning.** With `F` the
flawless earned total, `C` the walkout charge and `G` the per-grab coin:

```
F = perGrab x target x ingredients + perDish x target
threshold at boundary k = midpoint( F - (k+1)C + 2G(k+1) ,  F - kC )

3 stars -> k = 0            2 stars -> k = floor(walkoutsAllowed / 2)
```

On FTUE L1 this yields **339 and 295** — validating what already ships rather than
replacing it. The mechanism stays **coins**, per the user's Sep 7 reasoning above; only
the derivation of the two numbers is now mechanical.

🔴 **The constraint that must be asserted, not assumed.** Band separation holds only
while:

```
walkoutCharge > 2 x perGrab x (k + 1)
```

At the 3/4 boundary that is **25 > 24 — true by a single coin.** Any future level that
raises `perGrab` or `walkoutsAllowed` without raising the walkout charge collapses its
top bands into each other and silently stops discriminating. Cheap to assert now;
expensive to discover at level 30.

⚠️ **Structural note, Sep 8:** the user has settled that **rounds are not linear** —
each level carries its own wave target and each node its own level count, with **boss
mode as the last level of each node**. The formula above already takes a per-level
target, so it survives that restructure; the single-fixed-12-dish framing elsewhere in
this document does not, and is next session's work.

### 7.3b 👨‍🍳 The boss formula — the ordinary one cannot score an endless round

§7.3 assumes a finite target and a "cleared" state. A boss has neither: it ends on
walkouts, so `(walkoutsAllowed − walkouts)` is **always 0**, and there is no target to
hit. The boss gets its own formula, built on §2.1's prior rule *"Chef hats scale with
waves cleared."*

**A wave is 4 completed dishes.** ~26–30s each at `spawnInterval` 2.2 and 3 grabs per
dish — long enough to read as a stage, short enough that a player about to lose still
banks one.

**The belt keeps the ramp it already has and only drops its floor.** `perCompletion`
stays **0.5**; `minTraverse` goes **10.0 → 5.0** — half the ordinary cap, per the user's
Sep 7 ruling. The boss is not a different ramp, it is the same ramp with the brakes off,
so nothing the player learned stops applying.

| After wave | Dishes | Traverse | Speed | Reaction window |
|---|---|---|---|---|
| — | 0 | 16.0s | 122 | 3.54s |
| 1 | 4 | 14.0s | 139 | 3.10s |
| 2 | 8 | 12.0s | 163 | 2.65s |
| **3** | 12 | **10.0s** | 195 | 2.21s |
| 4 | 16 | 8.0s | 244 | 1.77s |
| 5 | 20 | 6.0s | 325 | 1.33s |
| **5.5+** | 22 | **5.0s** floor | **390** | **1.11s** |

🔥 **Wave 3 is where the boss passes the fastest any ordinary level ever gets.**
Everything after it is territory the player has never been in.

```
Boss Chef Hat = Σ (wave number × 30) for every wave cleared
              + leftover ingredients × 2
```

| Waves survived | 1 | 3 | 5 | 8 | 10 | 12 |
|---|---|---|---|---|---|---|
| Cumulative hats | 30 | 180 | **450** | 1,080 | 1,650 | 2,340 |

**Calibration:** surviving **5 waves ≈ 450 hats ≈ one flawless ordinary level** (465).
Reaching wave 8 (~1,080) is worth about a whole meta track (§7.4). At ~2.2s per grab the
hat *rate* is close to an ordinary level's up to wave 5 and pulls ahead after — so the
boss is not a farm exploit, it is the same rate with far higher variance and a much
higher ceiling. That is what makes it *difficult and rewarding* rather than merely long.

### 7.3b.1 🔴 The belt ramp alone would plateau at dish 22 — so a second ramp takes over

`minTraverse` 5.0s is reached at **dish 22**. Every dish after that would be identical,
and reaching 50 would be **endurance, not escalation** — which contradicts the brief:
*"the pacing factor is same but it keeps getting tighter and tighter."*

The belt also gets **emptier** as it speeds up: at 5.0s traverse and a 2.2s spawn only
~2.3 dishes are ever in flight. So phase 1's pressure is **precision**, and it is spent
by dish 22. Phase 2 changes the *kind* of pressure rather than more of the same:

| Phase | Dishes | What tightens | Pressure |
|---|---|---|---|
| **1** | 0 → 22 | `traverse` 16.0 → 5.0s, at −0.5/dish | **Precision** — the window shrinks 3.54s → 1.11s |
| **2** | 22 → 52 | `spawnInterval` 2.2 → 0.7s, at −0.05/dish | **Density** — the belt refills faster than it empties |

🔒 **`spawnInterval` is validated at 2.2 and ordinary levels never touch it.** The
boss ramps it exactly the way phase 1 ramps traverse — boss-only, from the validated
opening value, never replacing it as a constant.

### 7.3b.2 Why **50 dishes** is the wall

The ceiling is arithmetic. Four props at a **2.0s cooldown** (§7.3a.3) can take at most
`4 ÷ 2.0` = **2.0 grabs/s**, and the two top slots reach run 1 while the two bottom
slots reach run 2 — so only **1.0 grabs/s** is available on either run alone.

| Dish | Traverse | Speed | Spawn | In flight | **Grabs/s needed** | vs the 2.0/s ceiling |
|---|---|---|---|---|---|---|
| 0 | 16.0s | 122 | 2.20s | 7.3 | 0.45 | 23% |
| 12 | 10.0s | 195 | 2.20s | 4.5 | 0.45 | 23% |
| **22** | **5.0s** floor | 390 | 2.20s | 2.3 | 0.45 | 23% |
| 30 | 5.0s | 390 | 1.80s | 2.8 | 0.56 | 28% |
| 40 | 5.0s | 390 | 1.30s | 3.8 | 0.77 | 38% |
| **50** | 5.0s | 390 | **0.80s** | **6.3** | **1.25** | **63%** |
| 52+ | 5.0s | 390 | **0.70s** floor | 7.1 | **1.43** | **71%** |

**63% utilisation of a theoretically perfect kitchen, against 1.11-second windows, with
six dishes on the belt at once.** That is what dish 50 asks for, and it asks for it
while every prop is on a 2-second lockout, so the player must also be routing *which*
station takes *which* dish. The 0.70s floor at dish 52 is a deliberate asymptote just
past the target: the round never becomes literally impossible, it becomes a wall.

**Proposed config**, boss-only:

```
bossRamp: {
    minTraverse: 5.0,           // phase 1 floor, half the ordinary 10.0
    spawnRampFromDish: 22,      // where phase 2 begins == where phase 1 ends
    spawnPerDish: 0.05,         // seconds removed per completed dish
    minSpawnInterval: 0.7,      // the wall, reached at dish 52
}
```

### 7.3b.3 The boss economy — you buy your way up during the round

Float **100**, tier 1 only (§2.1), and the same income as any level: **+3 per grab,
+20 per dish**. Upgrading means **sell and replace** at §7.1's 0.75 refund, so a
Level 1 → Level 3 climb costs `40 + (70−30) + (120−52)` = **148** per station.

| By dish | Coins earned | Fully-kitted spend | |
|---|---|---|---|
| 20 | 580 | 4 slots (200) + 4 × L1 (160) = 360 | ✅ comfortable |
| **30** | **870** | + all four climbed to L3 (592 total) = **792** | ✅ **fully kitted — 178 spare** |
| 50 | 1,450 | — | ✅ nothing left to buy |

🔥 **So the boss has three acts, and they fall out of the numbers rather than being
authored:** dishes 0–22 you are buying a kitchen while the belt accelerates; 22–30 you
finish kitting out; **30–50 there is nothing left to buy and nothing left but skill**,
against a spawn rate that tightens every single dish. Money stops being the answer
exactly when the density ramp starts to bite.

**Hats at the wall:** a wave is 4 dishes, so dish 48 completes **wave 12** —
`Σ(w × 30)` = **2,340 hats**, and wave 13 pays **2,730**. Against §7.4's ~1,100 per meta
track, **crossing 50 dishes buys roughly two full upgrade tracks in one run.** Difficult
and rewarding, in the ratio the brief asked for.

### 7.4 👨‍🍳 Chef Hat ↔ gem parity — the shop side

🔴 **The formula and the shop cannot be chosen separately.**

| Live game (gems) | Belt (hats) |
|---|---|
| 1 gem/wave · **55 per full run** | **~465 per flawless run** |
| Meta track to L10 = **130 gems ≈ 2.36 runs** | **~1,100 hats** to hold the same pacing |

Individual meta levels price around **35 → 190** on the same `costBase + costStep`
curve, scaled ~8.5×. If hats pay ~465 and the shop keeps gem-era prices (4, 6, 8…), a
single round buys the entire meta tree.

### 7.5 Belt constants the economy depends on

From `jam-entry/src/game/kitchenConfig.ts` — see [KitchenMode.md](KitchenMode.md) §6.7.

| | |
|---|---|
| Belt length | **1952** design units |
| Opening traverse | **16.0s** → speed **122** u/s |
| Ramp | **−0.5s** traverse per dish completed, floor **10.0s** |
| Spawn interval | **2.2s** — validated, not a tuning value |
| Slot reach | **260** — validated |

🔒 **The ramp and a 12-dish target are exactly matched.** `16.0 − 0.5 × 12 = 10.0` —
the belt reaches `minTraverse` precisely on the final dish. **A level that changes its
dish target must re-derive `perCompletion`**, or the ramp either plateaus early (target
> 12) or never reaches its floor (target < 12).

---

## 8. FTUE level 1 — the full derivation

The only level with settled numbers. Everything here is arithmetic from §7's constants
plus the three level-tuned values (float 100, target 12, walkouts 5).

### 8.1 Round shape

| | |
|---|---|
| Ingredients consumed | 12 × 3 = **36** |
| Ingredients spawned | ~40–44 (misses raise it) |
| Spawning time | 35 × 2.2 = **77s** minimum |
| Round length | **~1m 25s – 1m 40s** |
| Walkout tolerance | 5 of ~40 = **12.5%** |

### 8.2 🪙 The coin curve

Income is **+3 per grab, +20 per completed chai** = **29 coins per chai**. The split
matters: the first chai lands ~7s in, and without the per-grab drip the coin counter
would sit dead through the opening while the player watches a belt they cannot afford to
work.

| | |
|---|---|
| Start | **100** |
| Earned — 36 grabs × 3 + 12 dishes × 20, flawless | **348** |
| **Total available** | **448** |
| Slot unlocks — 4 × 50 | 200 |
| Props — 4 × Level 1 | 160 |
| **Full build** | **360** |
| **Spare** | **88** |

**100 buys exactly one station** (50 + 40 = 90, 10 left) — and
[RecipeList.md](RecipeList.md) §7.0 says level 1 teaches *"one chain, one prop."*
The float enforces the lesson. It also means a Level-2 opener is unaffordable
(50 + 70 = 120), so level 1 forces a Level-1 start. Both are deliberate.

**Build pacing** at ~4.4 coins/s once one station works:

| t | State |
|---|---|
| 0s | 1 station |
| ~18s | 2nd station |
| ~39s | 3rd station |
| ~59s | 4th station |
| ~90s | ~88 spare |

Building occupies the first two-thirds; the last third runs at full capacity while the
belt hits its speed floor.

**What 448 actually buys**, after the mandatory 200 in unlocks leaves 248 for props:

| Loadout | Cost | |
|---|---|---|
| 4 × Level 1 | 160 | ✅ 88 spare |
| 2 × L1 + 2 × L2 | 220 | ✅ 28 spare |
| 3 × L1 + 1 × **Level 3** | 240 | ✅ 8 spare — the ceiling |
| 1 × L1 + 3 × L2 | 250 | ❌ short by 2 |
| 4 × Level 2 | 280 | ❌ short by 32 |

### 8.3 👨‍🍳 The Chef Hat spread

| Run | Dishes | Walkouts | Leftover | **Hats** |
|---|---|---|---|---|
| Flawless | 12 | 0 | **0** | **465** |
| Strong | 12 | 1 | 0–2 | 440–444 |
| Good | 12 | 2 | 0–4 | 415–423 |
| Shaky | 12 | 3 | 0–6 | 390–402 |
| Scraped home | 12 | 4 | 0–8 | 365–381 |
| Lost late | 9 | 5 | 1 | **182** |
| Lost mid | 6 | 5 | 1 | **122** |
| Lost early | 2 | 5 | 0 | **40** |

🔴 **Corrected Sep 8 2026.** This table previously gave the flawless run
**leftover 2 → 469 hats** — a stale row left behind when §7.3a.1's grab count was
corrected from 38 to 36. A flawless run grabs every spawn, and the bag deals one of each
kind per lap, so 36 grabs make exactly 12 sets with **nothing left over**:
`12×20 + 0×2 + 5×25 + 100` = **465**. The round 9 agent found this by computing the
formula instead of trusting the handover — see [Retro.md](Retro.md) 54.

⚠️ **Leftover is a range, not a value.** The bag in `sim/kitchen.ts` deals one of each
kind per lap, so a walkout of kind K forces the belt round again for another K — and the
other two kinds spawn alongside it, to be grabbed or walk out in turn. Each walkout
therefore adds **0 to 2** leftovers depending where K falls in the replacement lap, so
`leftover ≤ 2 × walkouts` and every winning row above is a band, not a point. The same
fact drives the coin bands in §7.3a.2 and is why ⭐⭐ had to move off 300.

Spread flawless to worst win **465 → 365 = 1.27×** · best win vs worst loss **11.6×**.

🔴 **`walkoutsAllowed` is load-bearing in two systems.** At 5 it sets a 12.5% difficulty
tolerance **and** it is the denominator of 27% of a flawless Chef Hat score. If 5 proves
too tight on review, **difficulty and scoring must be retuned together** — moving one
alone silently moves the other.

---

## 9. Not yet decided

| | |
|---|---|
| ⬜ **Boss phase-2 numbers** | §7.3b.2 — `spawnPerDish` 0.05 and `minSpawnInterval` 0.7 are proposed against a 50-dish target, never played. The whole phase is untested |
| ⬜ **Whether every node's boss shares one ramp** | §7.3b assumes node 0's. A 5-cell recipe needs 5 grabs per dish, so the same spawn ramp bites ~67% harder |
| ⬜ Node 0 levels 2–3 | Every value |
| ⬜ Node 0 level 4 (boss) | Formula settled (§7.3b); the **starting float** is still only a rule ("tier 1 only"), not a number |
| ⬜ Nodes 1–4 | Every value, 33 levels — the delivery gate ([KitchenMode.md](KitchenMode.md) §6.8) commits to all of them by Sep 19 |
| ⬜ Level order within nodes 1–4 | Dishes are listed; their sequence is not fixed |
| ⬜ Which levels pre-place a prop | Only Naan is decided (§3). Each one drops its level's full build cost by 90 |
| ⬜ Meta shop prices in hats | §7.4 gives the target (~1,100/track); no price list exists |
| ⬜ Leftover → currency conversion | The parked reason leftovers are tracked at all |
| ⬜ Recipe-length multiplier | §7.3 — proposed, not adopted |
