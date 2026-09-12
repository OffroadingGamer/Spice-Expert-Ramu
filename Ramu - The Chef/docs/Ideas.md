# Ideas — parked until the game is live and stable

🛑 **NOTHING IN THIS FILE IS A WORK ITEM.** User's instruction, Sep 12 2026:

> *"The following prompt is to be only done after going live once with the updated game
> version. Once we are live next time, we can start with this, until then log them in a
> document 'Ideas.md'. Not to be acted upon until we go live."*

✅ **The gate:** the current build ships, reaches `public`, goes stable, and the marketing
agent's ads are running. Only then does anything below become schedulable. Do not raise
these as actionable work before that, and do not let a handover quietly pull one in.

---

## 1. Narrative polish — Ramu's story (dialogue-box pass)

### The premise, in the user's words

A young aspiring Indian chef who must overcome the culinary rush while upgrading his arsenal
by earning more. **Every walk-out is money wasted, and Ramu wouldn't want it that way.**
He starts at a tapri/cafe selling beverages and works his way up to a fortune, stacking
overtime.

✅ **Why this fits the game that already exists rather than being pasted on:** the lose
condition is already *escapes*, not damage — a dish that walks out is literally lost income.
The premise gives the existing fail state a reason, which is the cheapest kind of narrative.

### Presentation

Two-part dialogue box, **tap to proceed**. Ramu's portrait on the **right**; the text box
spans **left to centre**.

### The beat inventory — derived from the code, not estimated

`blockForLevel()` puts **10 levels in every block**, blocks 1–8 covering levels 1–80, with
**level 81+ falling into block 9, whose label is already `OVERTIME`**. `isBossLevel()` is
`(level - 1) % 10 === 9`, so bosses sit at **10, 20, 30, 40, 50, 60, 70, 80** — eight of them.

| # | Beat | Trigger | Boxes |
|---|---|---|---|
| 1 | Opening — low on funds, still hopeful | cold boot, before the `place0` beat | **2** |
| 2 | First rush survived | wave 1 cleared, before the upgrade beat | **1** |
| 3 | First upgrade bought | after the `upgrade0` beat | **1** |
| 4 | New district | entering blocks 2–8, i.e. after bosses 10/20/30/40/50/60/70 | **7** |
| 5 | Overtime reached | after boss 80, entering level 81 | **1** |
| | | **Total** | **12** |

⚠️ The user's points 4 and 5 are **one mechanism**, not two: "after wave 10 when 11 loads"
is simply the first of the seven district transitions. The eighth boss (level 80) leads into
Overtime, which gets its own distinct thank-you beat instead.

### 🔥 Design notes worth keeping

✅ **The district beat already has a home.** The final round built a **2.5 s backdrop
crossfade with Ready locked** at exactly the block boundary (`towerScene.ts`,
`BACKDROP_FADE_S` / `BACKDROP_LOCK_S`, gated on a tracked block-id change). A dialogue box
there costs **no new dead time** — it occupies a pause that already exists. Any
implementation should reuse that trigger rather than inventing a second one, and the three
situations that trigger distinguishes (game start / real change / late load) are already
exactly the distinction a dialogue needs.

⚠️ **The opening two boxes sit in front of first play.** The jam metric is unique plays,
and the entry now boots straight into Challenge Mode specifically to remove friction before
the first tap. Two taps of dialogue put some of it back. Worth measuring rather than
assuming — and worth considering making the opening skippable while the district beats are
not.

⚠️ **Weight the writing toward the early beats.** Most players will never see block 5+.
Beats 1–3 and the first two district lines carry nearly all the actual player-facing value;
the later lines are for the few who go deep.

⚠️ **Avoid the standalone word "Stockpot"/"Saucepot" split.** RUN's moderation filter
rejects the bare three-letter word for a cooking vessel; it is already a known trap for
changelog text. Dialogue ships inside the bundle rather than through moderation, but keeping
the vocabulary clear of it costs nothing and removes a whole class of surprise.

✅ **Each district line can name its own cuisine.** `blocks.ts` already labels them:
CAFE, NORTH INDIAN, SOUTH INDIAN, ITALIAN, NORTH EAST, NE FUSION, ITALIAN FUSION,
DESI FUSION, OVERTIME. Seven lines that each name a real cuisine read as progression;
seven interchangeable hopeful lines read as filler.

### Chosen dialogue

_Pending._ Three variants per beat were drafted Sep 12 2026 and put to the user; the
selected set gets recorded here once chosen.

---

## 2. Previously held, still parked

- **Wave roster panel** (GDD §8) — held.
- **Regenerating the other eight backdrops** — held.
