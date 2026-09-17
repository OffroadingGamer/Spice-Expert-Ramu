# Shard cadence projection

Read-only projection. No `src` edits, no git action taken. Checks Ideas.md
§10.4's picked rule — "**+1 shard for each recipe on that order** if every
dish on the order was served (no leak)"; 8 shards/scroll — against the
`balanced` and `fox-spam` stock profiles from `npm run balance`
(`scripts/simulate.ts`), plus the noted-but-unshipped sweetener ("boss drop
+2 later ... **+2 on a boss kill**").

## Sources and method

- **Per-level leak/clear data:** `npm run balance` output (`fox-spam` and
  `balanced` blocks). Both are read verbatim; nothing here re-simulates
  combat.
- **Per-level "dishes on the order":** derived, not simulated. For each
  level, `waves.ts`'s composed `Wave` gives the set of archetypes
  (beetle/wasp/snail/hornet/stag) actually present; `blocks.ts`'s
  `Block.dishes` maps each archetype to its 1 slug (2 for a fusion block,
  alternating per spawn — both count as "on the order" for that level). This
  was read via a temporary bundle-and-run of `waves.ts`/`blocks.ts` exactly
  as authored (esbuild + node, same toolchain as `npm run balance`); the
  temp script was deleted immediately after and nothing under `src/` was
  touched.
- **Full-service clear** = the balance report's `leaked 0` for that level.
  Shards for that level = 0 if any leak occurred, else the count of
  **unique** dish slugs on that level's order (block 1's stag levels carry
  both chai and coffee at once, so a full clear there is worth 2, not 1).
- **Boss-drop sweetener** (not yet shipped — Ideas.md flags it as "later"):
  read as **+2 shards to the block's boss dish** (the stag archetype's own
  dish) on a full-service clear of a boss level (ladder position W10, i.e.
  every level ending in 0). Block 1's teaching boss carries two dishes
  (chai, coffee — §6b) rather than one; split **+1/+1** there since the doc
  doesn't specify a tie-break and the two are treated identically everywhere
  else in block 1. This is an interpretation of a one-line note, not a
  spec — flagged wherever it changes a result.
- Both scenarios stay inside block 1-4 territory (fox-spam LOST on level 35,
  balanced LOST on level 36), so only blocks CAFE / NORTH INDIAN / SOUTH
  INDIAN / ITALIAN and boss levels 10/20/30 are in scope. Level 40 (ITALIAN's
  boss) is never reached by either run.

## fox-spam — per-level ledger (LOST on level 35)

| Level | Dishes on order | Leaked | Full service? | Boss? | Shards (base) | Shards (+sweetener) |
|---:|---|---:|:---:|:---:|---:|---:|
| 1 | chai | 0 | Yes | | 1 | 1 |
| 2 | coffee | 0 | Yes | | 1 | 1 |
| 3 | chai, coffee | 0 | Yes | | 2 | 2 |
| 4 | chai | 0 | Yes | | 1 | 1 |
| 5 | coffee | 0 | Yes | | 1 | 1 |
| 6 | chai, coffee | 0 | Yes | | 2 | 2 |
| 7 | chai, coffee | 0 | Yes | | 2 | 2 |
| 8 | chai, coffee | 0 | Yes | | 2 | 2 |
| 9 | chai, coffee | 0 | Yes | | 2 | 2 |
| 10 | chai, coffee | 0 | Yes | **Boss** | 2 | 4 (+1 chai, +1 coffee) |
| 11 | naan | 0 | Yes | | 1 | 1 |
| 12 | jeera-rice | 0 | Yes | | 1 | 1 |
| 13 | jeera-rice, naan | 0 | Yes | | 2 | 2 |
| 14 | palak-aloo | 0 | Yes | | 1 | 1 |
| 15 | gobhi-masala | 0 | Yes | | 1 | 1 |
| 16 | gobhi-masala, palak-aloo | 0 | Yes | | 2 | 2 |
| 17 | gobhi-masala, rajma | 0 | Yes | | 2 | 2 |
| 18 | jeera-rice, naan, rajma | 0 | Yes | | 3 | 3 |
| 19 | gobhi-masala, palak-aloo, rajma | 0 | Yes | | 3 | 3 |
| 20 | gobhi-masala, jeera-rice, naan, palak-aloo, rajma | 0 | Yes | **Boss** | 5 | 7 (+2 rajma) |
| 21 | coconut-chutney | 0 | Yes | | 1 | 1 |
| 22 | idli | 0 | Yes | | 1 | 1 |
| 23 | coconut-chutney, idli | 0 | Yes | | 2 | 2 |
| 24 | upma | 0 | Yes | | 1 | 1 |
| 25 | sambar | 0 | Yes | | 1 | 1 |
| 26 | sambar, upma | 0 | Yes | | 2 | 2 |
| 27 | beans-poriyal, sambar | 0 | Yes | | 2 | 2 |
| 28 | beans-poriyal, coconut-chutney, idli | 0 | Yes | | 3 | 3 |
| 29 | beans-poriyal, sambar, upma | 0 | Yes | | 3 | 3 |
| 30 | beans-poriyal, coconut-chutney, idli, sambar, upma | 0 | Yes | **Boss** | 5 | 7 (+2 beans-poriyal) |
| 31 | pesto | 0 | Yes | | 1 | 1 |
| 32 | minestrone | 0 | Yes | | 1 | 1 |
| 33 | minestrone, pesto | 0 | Yes | | 2 | 2 |
| 34 | arrabbiata | 9 | **No** (leak) | | 0 | 0 |
| 35 | aglio-e-olio | 1 | **No** (leak) | | 0 | 0 — run ends here |

## balanced — per-level ledger (LOST on level 36)

Identical to fox-spam through level 24 (both stock profiles clear every
level 1-24 with 0 leaks — same dish orders, same result). Diverges at three
levels:

| Level | Dishes on order | Leaked | Full service? | Boss? | Shards (base) | Shards (+sweetener) |
|---:|---|---:|:---:|:---:|---:|---:|
| 1-24 | *(same as fox-spam above)* | 0 | Yes | (10/20 boss) | *(same as above)* | *(same as above)* |
| 25 | sambar | **2** | **No** (leak) | | 0 | 0 |
| 26 | sambar, upma | 0 | Yes | | 2 | 2 |
| 27 | beans-poriyal, sambar | 0 | Yes | | 2 | 2 |
| 28 | beans-poriyal, coconut-chutney, idli | 0 | Yes | | 3 | 3 |
| 29 | beans-poriyal, sambar, upma | 0 | Yes | | 3 | 3 |
| 30 | beans-poriyal, coconut-chutney, idli, sambar, upma | 0 | Yes | **Boss** | 5 | 7 (+2 beans-poriyal) |
| 31 | pesto | 0 | Yes | | 1 | 1 |
| 32 | minestrone | 0 | Yes | | 1 | 1 |
| 33 | minestrone, pesto | 0 | Yes | | 2 | 2 |
| 34 | arrabbiata | 0 | Yes | | 1 | 1 |
| 35 | aglio-e-olio | **7** | **No** (leak) | | 0 | 0 |
| 36 | aglio-e-olio, arrabbiata | 1 | **No** (leak) | | 0 | 0 — run ends here |

The one point where the two runs actually differ in outcome: `balanced`
leaks level 25 (sambar denied there — it still reaches 8 later, see below),
where `fox-spam` doesn't; both then leak out on their block-4 finish (level
34-35 for fox-spam, 35-36 for balanced) before ever reaching level 40's
boss.

## Cumulative shards per dish (base rule, +1/recipe/full-service-level)

Both scenarios reach the same cumulative total for every dish that
completes its run of levels before either scenario's first leak (chai,
coffee, naan, jeera-rice, palak-aloo, gobhi-masala, rajma, coconut-chutney,
idli, beans-poriyal, pesto, minestrone — all fully resolved by level 24 or
by level 30's boss, before the two runs diverge). `sambar`, `arrabbiata`,
`upma`, and `aglio-e-olio` differ because they touch a leaked level.

| Dish | Block | Appears on order at levels | fox-spam total (by loss) | balanced total (by loss) | Level reaching 8 |
|---|---|---|---:|---:|---|
| **chai** | CAFE | 1,3,4,6,7,8,9,10 | **8** | **8** | **Level 10 (both)** |
| **coffee** | CAFE | 2,3,5,6,7,8,9,10 | **8** | **8** | **Level 10 (both)** |
| naan | NORTH INDIAN | 11,13,18 | 3 | 3 | not reached |
| jeera-rice | NORTH INDIAN | 12,13,18,20 | 4 | 4 | not reached |
| palak-aloo | NORTH INDIAN | 14,16,19,20 | 4 | 4 | not reached |
| gobhi-masala | NORTH INDIAN | 15,16,17,19,20 | 5 | 5 | not reached |
| rajma | NORTH INDIAN | 17,18,19,20 | 4 | 4 | not reached |
| coconut-chutney | SOUTH INDIAN | 21,23,28,30 | 4 | 4 | not reached |
| idli | SOUTH INDIAN | 22,23,28,30 | 4 | 4 | not reached |
| upma | SOUTH INDIAN | 24,26,29,30 | 4 | 4 | not reached |
| sambar | SOUTH INDIAN | 25,26,27,29,30 | 5 | 4 (L25 leaked) | not reached |
| beans-poriyal | SOUTH INDIAN | 27,28,29,30 | 4 | 4 | not reached |
| pesto | ITALIAN | 31,33 | 2 | 2 | not reached |
| minestrone | ITALIAN | 32,33 | 2 | 2 | not reached |
| arrabbiata | ITALIAN | 34 (leaked in fox-spam) / 34 (clean in balanced), 36 (leaked) | 0 | 1 | not reached |
| aglio-e-olio | ITALIAN | 35 (leaked, both) | 0 | 0 | not reached |

**Only chai and coffee ever reach 8** in either run, and they reach it
**together, at level 10** — block 1's boss level, the last level chai/coffee
appear on before the CAFE block hands off to NORTH INDIAN. No other dish
gets past 5 before its run ends.

## With the boss-drop sweetener (+2 on a boss kill)

The sweetener adds to rajma (+2 at L20) and beans-poriyal (+2 at L30) in
both runs, and splits +1/+1 onto chai/coffee at L10 — but chai/coffee
already hit 8 from the base rule alone at L10, so the sweetener changes
**totals**, not the **first-scroll level**:

| Dish | fox-spam total w/ sweetener | balanced total w/ sweetener | First reaches 8 |
|---|---:|---:|---|
| chai | 9 | 9 | Level 10 (unchanged — base rule alone already hits 8 there) |
| coffee | 9 | 9 | Level 10 (unchanged) |
| rajma | 6 | 6 | not reached |
| beans-poriyal | 6 | 6 | not reached |
| all others | unchanged from base-rule table | unchanged | not reached |

## Does "first scroll during run 1" hold?

**Yes — confirmed in both scenarios, and pinned to an exact level: level
10**, the end of block 1 (CAFE). Chai and coffee both accumulate 1 shard on
every level they're the boss's teaching dish for (levels 1, 3, 4, 6-10 for
chai; 2, 3, 5-10 for coffee), each hitting the 8-shard/scroll threshold the
moment level 10 (block 1's boss, a full-service clear in both `fox-spam` and
`balanced`) resolves. This holds identically whether or not the boss-drop
sweetener ships, and it holds for both a stock-tower profile (`balanced`)
and a rush profile (`fox-spam`) — it isn't sensitive to which one a real
player follows through block 1.

One correction to Ideas.md §10.4's own estimate: it projected "**~10** chai
shards in run 1" — the measured number is **8** (exactly the scroll
threshold, not past it), and it's a **tie with coffee**, not a chai-only
lead — both teaching dishes complete their block-1 appearances at the same
count since block 1 pairs them 1-for-1 across every wave. No other dish
gets remotely close (max 5, on gobhi-masala/sambar) inside either run's
lifetime — the second scroll is block-1-only content until a full clear of
level 20 or 30 (NORTH INDIAN's / SOUTH INDIAN's boss) starts moving rajma or
beans-poriyal, and even the boss sweetener only gets those to 6 within
either run's observed length.
