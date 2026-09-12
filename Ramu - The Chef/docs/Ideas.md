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

### ✅ Chosen dialogue — SELECTED Sep 12 2026

Three voices were drafted per beat — **A warm & plain**, **B wry & light**, **C lyrical**.
The user selected **A as the spine, with B at two deliberate points and C for the finale**.
**12 boxes.**

| # | When | Voice | Line |
|---|---|---|---|
| 1 | Opening | A | "Some days the tin is empty. Today's one of them." |
| 2 | Opening | A | "But the stove still lights. That's enough to start." |
| 3 | Wave 1 cleared | A | "They came back for seconds. Did you see that?" |
| 4 | First upgrade bought | **B** | "New gear, same nerves. Let's find out." |
| 5 | → Block 2 NORTH INDIAN | A | "A real dhaba. Tandoor and all. I'm not dreaming?" |
| 6 | → Block 3 SOUTH INDIAN | A | "They want dosa now. My wrist is ready." |
| 7 | → Block 4 ITALIAN | **B** | "They want Italian. I watched one video. We're fine." |
| 8 | → Block 5 NORTH EAST | **B** | "Smoked chilli. I'll cry through this whole shift." |
| 9 | → Block 6 NE FUSION | A | "I stopped copying recipes. I'm writing them." |
| 10 | → Block 7 ITALIAN FUSION | A | "Two kitchens, one plate. Nobody taught me this." |
| 11 | → Block 8 DESI FUSION | A | "This one's mine. Every bit of it." |
| 12 | → Overtime (level 81) | **C** | "Every plate tonight had two pairs of hands. Thank you." |

Box 5 fires after the boss at level 10, box 6 after 20, and so on to box 11 after level 70;
box 12 follows the level-80 boss.

#### 🔴 The tonal breaks are deliberate — do not normalise them

⚠️ **Rows 7 and 8 are wry on purpose, sitting among warm ones.** Seven earnest boxes in a
row is exactly where sincerity curdles into syrup, and blocks 4–5 (Italian, North East) are
where Ramu is most plainly out of his depth — so the self-deprecation is *characterisation*
at the one moment it's true, not an inconsistency. Anyone later "fixing" 7 and 8 to match
the surrounding voice will flatten the arc. Same for **row 4**: "same nerves" keeps him human
at the beat where he could tip into triumphant, immediately after his first win.

✅ **The A-voice arc is doing work across rows 9–11**: *copying* recipes → *writing* them →
*owning* the menu. Those three must stay in that order even if individual wording changes.

✅ **Row 3 turns to the player** — "did you see that?" — which is what makes row 12's
thank-you land 80 levels later. They are a matched pair; changing one without the other
costs the payoff.

➕ Row 12 is the only line reaching for something, and it earns it: "two pairs of hands"
says the thing without stating it.

---

## 2. Previously held, still parked

- **Wave roster panel** (GDD §8) — held.
- **Regenerating the other eight backdrops** — held.
