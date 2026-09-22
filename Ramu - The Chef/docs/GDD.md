# GDD — September Jam Entry
# SPICE EXPERT: RAMU

> Working document for this project. Governed by
> [GDD Guidelines.md](../Logic%20Seeding/GDD%20Guidelines.md); scoped per **§6**
> (streamlined outline) and **§5** (write it down to eliminate bad ideas *before*
> spending effort). Rules: [Guidelines.md](../Logic%20Seeding/Guidelines.md) ·
> Production: [Jam-Day-Runbook.md](../Logic%20Seeding/Jam-Day-Runbook.md)

**Status:** ⬜ Draft ✅ **FROZEN — approved by user Sep 3 2026, 15:00 PT**
**Shipped:** ▶ **LIVE since Sep 3, ~15:05 PT.** **v1.1.0** public + approved ·
game `PpB5gECS0AMU49mGYAKM` · <https://w.run/puneetmakes/spice-expert-ramu>
Current build state and open debt: [Specs.md](Specs.md) · phase queue: [Plan.md](Plan.md) §1b

> ⚠️ **Design/build gap, MEASURED — anti-reskin test 2 of 4, Plan §1e.** The frozen design below describes a vertical
> ticket rail with dish tickets and station art.
> **Closed in v1.1.0 (Phase 1):** dish and station art — 15 generated assets replaced the
> kit's procedural bugs and animals, and the title renders correctly at every phone width.
> **Still open:** the board is the kit's example **serpentine path and pad layout**, not a
> vertical rail. Phase 2 closes it. Phase 1.5 first fixes a 16.30 MB preload the art pass
> introduced — [Plan.md](Plan.md) §1c.
> Read this document as the target, not as a description of what players see today.
**Filled on:** Sep 3 2026, 13:05 PT (Sep 4, 01:35 IST) · **Author:** Solo — `offroadinggamedev@gmail.com`

---

# Part 0 — Jam constraints (the box you must build inside)

### Fixed (verified, do not re-litigate)

| Constraint | Value |
|---|---|
| Build window | Sep 3, 12:00 PT → Sep 14, 12:00 PT (11 days) |
| Scoring window | From **your publish moment** → Sep 18, 12:00 PT |
| Score metric | **Total Unique Daily Plays** — unique players summed *per calendar day* |
| Platform | RUN — iOS, Android, Web (**phone-first**) |
| Eligibility | Must start from an official jam kit or Adventure Studio |
| Team | Solo or any size; **every member must be credited** |
| Originality | No 1:1 clones, no copyrighted characters/art, no real people without permission |

### Revealed Sep 3, 12:00 PT — now fixed

| Item | Value |
|---|---|
| **Theme (verbatim)** | **"Back to Work: any job, and the real story behind it"** |
| Theme sub-brief | *"Show us a day on the clock and the person who works it."* Weird welcome, not required. Real or fictional, common or uncommon. Include **the tools of the trade**. |
| Theme-specific eligibility | Entry must be built **around a job**; original only |
| Jam Discord channel | `#back-to-work` |
| Official kit chosen | ✅ `september-jam-tower-defense` ⬜ `september-jam-bare-bones` ⬜ Adventure Studio |
| Kit init command | `rundot jam init september-jam-tower-defense jam-entry` |
| Second entry? (Story/Video hedge) | ✅ **Yes** — planned for ~Day 8 |

> **Why Tower Defense:** under one hour available on day one. TD gives a working
> loop at hour one, which is the only way to reach public + approved tonight. The
> job justifies it exactly — a rush is a line you hold against something that will
> not stop coming. Bare Bones was killed on hours, not on merit.

### Personal constraints

| Constraint | Value |
|---|---|
| Realistic hours across 11 days | **40–60 h** |
| Hours available on **day one** | **< 1 h** — pipeline-only budget |
| Team members + credited names | **Solo** — credited under the `offroadinggamedev@gmail.com` RUN handle |
| Skills present | **Design / systems** (primary) — owns level design, recipe lists, difficulty curve, and audio selection. Art direction via supplied reference inputs, validated for format before use. Owns **KayKit Restaurant Bits** (3D props) and can convert/render as required. |
| Skills absent → bought, faked, or designed around | **Production art** → CSS/vector first, then pre-rendered sprites from user-owned 3D props, with `rundot generate image` for backgrounds and Ramu. **Audio** → *not* designed around; **SFX is a core hook (§12)**, sourced from asset packs and user-picked tracks. **Deep code** → agent-implemented, with tuning surfaces exposed as named constants and levels as editable data. |

---

# Part 1 — Idea elimination (Guidelines §5)

### Candidate table

| # | One-line concept | Fits theme? | Day-1 shippable? | Reason to return **tomorrow**? | 10-sec explainable? | Verdict |
|---|---|---|---|---|---|---|
| A | **Ramu, line cook** — tickets crawl a vertical rail toward the pass; your stations cook them before they arrive | ✅ | ✅ | ✅ new shift daily | ✅ | ✅ **Keep** |
| B | **Pest controller, night shift** — hold a shuttered restaurant against vermin with bait stations and a UV torch | ✅ | ✅ | ✅ | ✅ | ⬜ Kill |
| C | **Wildfire lookout** — spot smoke from the tower, direct crews against a spreading fire front | ✅ | ❌ | ✅ | ✅ | ⬜ **Kill (auto)** |
| D | **Ramu, free-form kitchen sim** — same job, built from Bare Bones with its own bespoke loop | ✅ | ❌ | ✅ | ⬜ | ⬜ **Kill (auto)** |

**Any "no" in columns 1 or 2 is an automatic kill.**

### Elimination notes

```
C — Wildfire lookout. KILLED ON COLUMN 2. A spreading fire FRONT is not a lane; it
    is a cellular-automaton spread over a grid, which the tower-defense kit does not
    ship and which cannot be written in the <1h available tonight. Best visuals of
    the four and it genuinely hurt to cut, but publishing tonight is worth ~15
    scoring days and this costs 2-3 of them before it is playable at all.
    Do NOT resurrect on day 6 — the cost does not shrink later, and by then the
    return loop is the priority.

D — Ramu on Bare Bones. KILLED ON COLUMN 2, same reason: no kit loop to inherit.
    Also fails column 5 — "kitchen sim" without a visible fail-state rail is much
    harder for a stranger to read while scrolling. The ticket rail is precisely what
    makes concept A legible in four seconds. Note A and D are the SAME JOB: we did
    not lose the job, only the more expensive shell.

B — Pest controller. Survived every column; killed on EXPECTED VALUE, not quality.
    Higher Editor's Pick ceiling (nobody has made this game) but a lower plays
    ceiling — swarming vermin is an aversive share card and loses players at the
    thumbnail. Editor's Pick is $300 at one place; the plays board is $2,200 across
    five. When the two ceilings conflict, take plays.
    KEPT ON FILE as the Story/Video hedge subject (~Day 8) — the aversion that costs
    plays costs nothing in an editorially judged field.
```

### 🔒 FREEZE — Selected concept

**One sentence:**

```
You are Ramu, a short-order line cook: order tickets crawl down the rail toward the
pass, and you place and work your stations — grill, fryer, prep — to finish every
dish before it gets there, because a ticket that reaches the pass is a walkout.
```

**Why this one beats the others:**

```
It wins on the only two things that actually score.

1. LEGIBILITY -> plays. A stranger scrolling a leaderboard understands "cook the
   food before the order runs out" in about four seconds, with no tutorial and no
   genre literacy. Concepts C and D need a sentence of explanation; on a
   plays-ranked board, a sentence is a lost player.

2. DAILY RESET -> return days. "A day on the clock" is the theme's own phrase, and
   it is also, for free, the most natural daily-content premise available: every
   real calendar day is one shift, with its own menu, rush shape and disaster. That
   is the score multiplier, and here it is the premise rather than a feature bolted
   on afterwards. A player returning across 8 days scores 8x.

And it satisfies the theme MECHANICALLY rather than cosmetically: the towers ARE the
tools of the trade. You do not shoot the tickets, you cook them. The verb is the job.
```

---

# Part 2 — The GDD

## 1. Packaging

| Field | Value |
|---|---|
| **Title** | **Spice Expert: Ramu** |
| **Tagline** (≤ 10 words) | *Nine years on the line. Don't let a ticket die.* |
| Splash art / key image | Vertical ticket rail, four paper tickets caught mid-crawl under a hot orange pass-light, Ramu's silhouette and forearms at the bottom edge. High contrast, near-black kitchen, one warm light source. |
| Name check | ✅ **Changed Sep 3, 14:45 PT** from *Ramu: In the Weeds*. "In the weeds" is authentic kitchen slang, but it is **niche** — a general audience scrolling a leaderboard does not know it means "overwhelmed during a rush," and a title that needs explaining costs players at the tap. *Spice Expert: Ramu* states the job and names the person in three words, needs no glossary, and leads with the descriptor for scroll legibility. Trade language stays where it belongs: **inside** the game, in ticket text and Ramu's shift-end line. |

## 2. Table of Contents

⏭ **DEFER** — not needed at jam length (Guidelines §2 applies to detailed GDDs).

## 3. Introduction / General Overview

**Elevator pitch** — also the `rundot init --description` and the share caption:

```
Tickets crawl down the rail. Set your grill, fryer and prep station along it and
finish every dish before it reaches the pass — because anything that gets there is a
walkout. A 90-second shift, a new menu every day, and one cook who has never let a
ticket die.
```

## 4. Inspirations

| Source | What exactly to borrow | Not borrowing |
|---|---|---|
| Classic lane tower defense | Lane legibility, place-then-watch rhythm, between-wave economy | Its combat framing, its fiction, its landscape grid |
| Real kitchen expediting | The ticket rail as a literal countdown, "all day" counts, the pass as a hard boundary | Simulationist depth — no inventory, no supply chain |
| Papers, Please | The dignity of tedious work; a job that costs the worker something | Its bureaucratic verb, its document-inspection loop, its art |
| Overcooked / Diner Dash | **Nothing mechanical** — named to define what we are NOT | Movement-based co-op; tap-routing of customers. **We are a rail, not a restaurant.** |

Non-game / real-world inspiration:

```
Kitchen Confidential on the line as a place with its own physics of time. The real
observation the game is built on: a cook does not experience a rush as cooking, but
as a queue that is beating them. That is a tower defense.
```

## 5. Player Experience (UX)

**The player should feel:** competent hands under rising pressure — the specific
satisfaction of a line that is *just* holding, and the clean sting when it isn't.

| Axis | Choice |
|---|---|
| Tone | ⬜ Cozy ✅ **Tense** ⬜ Funny ⬜ Melancholy — with a melancholy undertow in the shift-end text, never in the play |
| Pace | ⬜ Twitch ✅ **Considered** (place under pressure) ⬜ Idle/ambient |
| **Level** length | **60–120 s, scaling by cuisine** — Counter 60–75 s · Tandoor 90–110 s · Wok 100–120 s |
| **Session** length | **Uncapped — emergent, player-chosen.** Levels chain; nothing gates how many you play |
| Difficulty posture | ⬜ Forgiving ⬜ Punishing ✅ **Scaling** — the rush accelerates within a level; the curve across levels is **authored by the user** via level design; the daily modifier varies the daily shift |

> **Why the atomic unit stays short (revised Sep 3, 14:45 PT).** The scoring metric is
> *indifferent to session length* — unique players **per calendar day**, so a 90-second
> player and a 20-minute player score identically that day. Length matters only through
> two second-order effects: a short commitment raises the odds of returning tomorrow
> ("I have 90 seconds" is an easier yes than "I have 15 minutes"), and a long session
> burns finite level content faster.
>
> The resolution is to **keep the level short and let the session run as long as the
> player wants.** A level is a complete unit finishable on a bus; nothing stops a player
> chaining eight of them. Session length is emergent, not designed.
>
> **Recipe diversity is what buys the extra seconds, not the clock.** A 110-second
> tandoor level with eight distinct dishes reads as a real menu; the same 110 seconds
> with three dishes on repeat reads as padding. Owned by the user at level-design stage.

**First 30 seconds — beat by beat:**

```
1. 0-3s   Cold open, no menu. The rail is already on screen and ONE ticket is
          already crawling. A single pulsing slot beside it reads "GRILL — TAP".
2. 3-8s   Player taps. The grill drops in and immediately starts working the ticket.
          Sizzle, sparks, the patty pip fills. Nothing was explained and the player
          has already performed the entire verb.
3. 8-15s  The ticket completes before the pass. Bell. Cash ticks up. SERVED slams on
          screen. First win inside 15 seconds.
4. 15-30s Two tickets now, one needing the fryer. Second slot pulses. The player
          places it with no prompt, because the pattern is already learned. The rush
          indicator starts filling. Pressure begins.
```

> This is the highest-leverage block in the document. Most drop-off is here.

## 6. Platform

| Decision | Value |
|---|---|
| Orientation | ✅ **Portrait** ⬜ Landscape |
| Primary input | ✅ **Single tap** ⬜ Drag ⬜ Multi-touch |
| One-handed playable? | ✅ **Yes** |

> The rail runs **vertically**, tickets crawling top → bottom toward the pass at the
> bottom edge. Portrait is not a compromise here: the lane direction and the phone's
> long axis agree, and the pass — the thing under threat — sits directly under the
> player's thumb. Station slots flank the rail within thumb arc.

## 7. Software

| Role | Tool |
|---|---|
| Build path | ⬜ Game Studio ✅ **rundot CLI + Claude Code (VSCode)** ⬜ Adventure Studio |
| Kit / stack | `september-jam-tower-defense` (kit-defined; Vite → `./dist`, relative paths) |
| Art | **2D rendering throughout.** Phase 1: CSS/vector + type, zero image assets. Phase 2: **pre-rendered sprites from user-owned 3D props** (KayKit Restaurant Bits, rendered to PNG in Blender), plus `rundot generate image` for backgrounds and Ramu. **No runtime 3D** — see §11 |
| Audio | **SFX is a core hook, not deferred** (revised Sep 3, 14:45 PT). Sourced from asset packs and user-picked tracks; agent requests specific cues when needed. **The game must still be fully playable muted** — that is an accessibility floor, not a statement about SFX's importance |
| SDK features used | `appStorage` (save), trusted server time (daily rollover), local notifications, analytics |

## 8. Genre

| Field | Value |
|---|---|
| Genre | Single-lane tower defense |
| Dimension | ✅ **2D** |
| Sub-genre / modifier | Job sim / arcade shift-runner; 90-second daily-rotating sessions |
| Closest comparable title | Lane TD in structure; nothing close in framing — the reframe *is* the differentiator |

## 9. Target Audience / Market Research

| Field | Value |
|---|---|
| Who is this for | Phone players who want a complete thing in 90 seconds; anyone who has worked food service and will recognise the language instantly; jam voters scrolling a board |
| Where they'll find it | Jam Discord `#back-to-work` · Reddit (r/KitchenConfidential, r/WebGames, r/incremental_games) · X · RUN showcase |
| Why they'd share it | **The recognition hook.** Ex-restaurant workers share things that get the job right. "In the weeds", "all day", "behind" — trade language is the share trigger, and r/KitchenConfidential is ~800k people who have all lived this shift. |

## 10. Concept — the core of this document

### 10.1 🔒 Core loop

```
1. READ THE RAIL   — tickets enter at the top; each shows the components it needs
                     (patty = grill, fries = fryer, garnish = prep).
2. SET THE LINE    — tap a slot beside the rail to place or upgrade a station.
                     Stations work any ticket passing within their reach.
3. WORK THE PASS   — tap a ticket to call "hands" — a limited-charge push that
                     finishes one component instantly. The active save when the line
                     is losing.
4. SERVE OR LOSE   — a fully-cooked ticket at the pass = SERVED (cash + rep). An
                     unfinished one = WALKOUT. Five walkouts ends the shift.
5. BETWEEN RUSHES  — spend the shift's cash on another station or an upgrade. Then
                     the next rush, faster.
```

### 10.2 🔒 Themes — expressed *mechanically*, not cosmetically

```
The theme is in the VERB, and it is checkable against the brief's own three demands:

"A DAY ON THE CLOCK"      -> The shift IS the session, and the calendar day IS the
                             content unit. Every real day is a new shift with its own
                             menu, rush shape and disaster. Not a framing device — the
                             literal content rotation.

"THE TOOLS OF THE TRADE"  -> The towers ARE the tools. Grill, fryer, prep board,
                             salamander. You do not place weapons, you set your line.
                             The upgrade tree is mise en place, not damage numbers.

"THE PERSON WHO WORKS IT" -> Ramu is present in the failure and in the shift-end
                             text, never in a cutscene. The stat that persists across
                             every shift is TICKETS SERVED — nine years of them. What
                             the game is quietly about is what that number costs him.

THE ANTI-RESKIN TEST: strip the kitchen art off and the mechanics still describe a
kitchen — a timed queue, parallel stations specialised by dish type, a hard boundary,
a manual expedite. It is not a tower defense wearing an apron.
```

### 10.3 🔒 Primary mechanics — **capped at 2**

| # | Mechanic | Player verb | Build cost |
|---|---|---|---|
| 1 | **Station placement & upgrade** along the rail — each station type services one component type | *Set the line* | **Low** — the kit's native placement loop, reskinned and re-typed. Ships tonight. |
| 2 | **"Hands!" expedite** — tap a ticket to instantly finish one component; limited charges, refills between rushes | *Save the ticket* | **Medium** — ~1 evening (Day 2). Converts watching into playing; it is the skill ceiling. |

### 10.3a 🔒 Gated order — decided Sep 4 2026, 20:05 IST

**Supersedes mechanic 1 above if the new game view ships** (Plan item 48). §10.3 stays
frozen and unedited because the shipped v1.2.3 still runs it; this records what replaces
it, and why this shape and not the two obvious ones.

**The model.** Ingredients ride a reverse-V belt past four front-facing prop slots. A prop
does not shoot — it **hot-swaps the ingredient sprite in place**, momentum untouched.
Most swaps are order-free. A few declare a prerequisite:

```json
{ "in": "dough", "out": "naan", "after": "kneaded" }
```

An ingredient that reaches the tandoor before it has been kneaded **visibly does not
transform.** That is the entire failure message, and it costs nothing to build.

**Why gated, and not the two obvious options.**

| | Verdict |
|---|---|
| **Set only** — any prop, any time | Rejected. Slot position goes decorative, the Λ belt becomes a picture, and the real decision moves to the shop. That is the same thinness the conformance audit already failed us on |
| **Full order** — strict sequence | Rejected *for now*. Slot position becomes the game, which is right — but it needs per-step failure UI, and every level needs solvability proving across 4 slots with **no simulator**, since `npm run balance` does not survive this pivot |
| **🔒 Gated order** | **Chosen.** Solvability is a linear check, not a permutation search. Most ingredients stay order-free so recipes stay quick to author. And it **degrades to "set only" with zero gates** — so it ships simple and the depth turns up later as *data*, not code |

**The property that decided it:** difficulty becomes an authoring dial, not a rewrite.
Levels 1–2 ship with no gates and play as a checklist. Gates appear from level 3. Nothing
in the build changes.

**🔒 The billboard row is the progress readout.** Each ingredient image on the lower
billboard lights up or ticks off as its step is satisfied. Without this, an ingredient
arriving at the tray *wrong* is invisible — and the dustbin skip (−1 walk-out) can only be
a real decision if the player can see the dish is already doomed. **This is not optional
polish; it is what makes the mechanic legible**, and it carries whichever gating depth a
level uses. Row ceiling and scale floor: Specs §8b.

**🔒 Two invariants every level must satisfy** — derived Sep 4 2026, 20:24 IST from
the Λ-belt itself, and both cheap to check before a level ships:

1. **Distinct props required ≤ slots available.** Every item passes every slot exactly
   once, so solvability turns on the number of *distinct* props a recipe's chains need —
   not on its ingredient count. Props that carry several interactions are what make four
   slots enough; the proposed five-ingredient thali fits because the handi cooks both the
   dal and the rice.
2. **A recipe may never want one ingredient both raw and processed.** The belt cannot
   route around a prop, so placing the grinder turns *every* coriander into chutney.

The second one's flip side is the mechanic that justifies the pivot: **some ingredients
are correct raw**, so the wrong prop *ruins* them. A prop stops being a strictly good
purchase, and the player's question moves from "can I afford it" to "do I want it on this
belt at all." It costs no art and level 1 teaches it for free. Full graph and the five
proposed recipes: [PropList.md](PropList.md) §4–§5, [RecipeList.md](RecipeList.md) §3.

### 10.4 Secondary mechanics — **all cuttable on day 8**

| # | Mechanic | Cut if behind? |
|---|---|---|
| 1 | **Daily modifier** — one per shift: "fryer's down", "delivery surge", "inspector at table 4" | ⬜ No — cheap, and it is the visible daily difference |
| 2 | **Station synergy** — adjacent grill + prep serve combo tickets faster | ✅ Yes |
| 3 | **Rep meter** — consecutive serves raise a multiplier; one walkout resets it | ✅ Yes |
| 4 | **Shift-end line** — one sentence in Ramu's voice, drawn from the day's performance | ⬜ No — near-zero cost, and it carries the entire "real story" for editors |

### 10.5 Tertiary mechanics

⏭ **DEFER — build nothing.**

```
Second station row (double rail) · named regulars whose tickets recur across days ·
a weekly "Saturday night" super-shift · cosmetic aprons · dish encyclopedia ·
branching level paths · per-cuisine map art · boss levels.
```

### 10.6 Combat / Puzzle / Quest system

```
N/A — no combat. The "enemy" is the queue and the clock. The only adversarial system
is the rush curve: arrival rate and component complexity both rise on a tuned curve
within a 90-second shift, with the daily seed shifting its shape.
```

### 10.7 Mockups

```
PORTRAIT, thumb-first:

 ┌─────────────────────────┐
 │ SHIFT 1   ●●●○○   $240  │  <- walkouts (5 max), cash
 │ ▓▓▓▓▓░░░░░░░  RUSH      │  <- rush progress
 ├─────────────────────────┤
 │        ┌───────┐        │
 │        │  #14  │        │  <- ticket, crawls DOWN
 │        │ ▣ ▢ ▢ │        │     3 component pips,
 │        └───────┘        │     filled = cooked
 │  [GRILL]        [  +  ] │  <- station slots flank
 │        ┌───────┐        │     the rail
 │        │  #15  │        │
 │        │ ▢ ▢   │        │
 │  [FRYER]        [  +  ] │
 │                         │
 │ ═══════ THE PASS ══════ │  <- hard boundary, bottom
 │  HANDS!  ●●○            │  <- thumb rests here
 └─────────────────────────┘

Phase 1 renders entirely in CSS/vector: tickets are rounded rects with type, stations
are flat coloured tiles with an icon glyph, the pass is a hot bar.
```

### 10.8 Story — a premise, not a script

```
Ramu has worked the same twelve-hour line for nine years and has never, not once, let
a ticket die. The game is not about the food; it is about what it costs a man to be
the one who never lets the line break.
```

### 10.9 🔒 Return loop — *the score multiplier*

| Question | Answer |
|---|---|
| Why open it tomorrow? | **A new shift exists.** Menu, rush shape and daily modifier all reroll on the calendar day. Yesterday's shift is gone and cannot be replayed. |
| What is different tomorrow? | Dish mix (which components dominate → which stations you should set), the rush curve, and one named modifier. Plus the day's quests and the next step on the pay track. |
| What carries over between sessions? | **Ramu's ledger** — lifetime tickets served, lifetime walkouts, best shift, days worked. Permanent kitchen upgrades bought with shift pay. Nothing resets, ever. |
| What pulls them back? | Local notification in Ramu's voice: *"Shift starts in ten. Rail's already filling."* Plus an unclaimed-pay badge. |

Mechanics to install (copy-in TypeScript, don't hand-build):

- ✅ `rundot-feature-daily-rewards` — **shift pay**; forgiving track, no streak reset, local-midnight rollover on a trusted server clock
- ✅ `rundot-feature-daily-quests` — **the day's prep list** ("serve 40 tickets", "zero walkouts through rush 2"), seeded deterministic day roll
- ✅ `rundot-feature-notifications` — the shift-call reminder; cancel-first dedupe, clean opt-out
- ✅ `rundot-feature-save` — versioned `appStorage` blob; upgrades and ledger persist
- ✅ `rundot-feature-stats` — the ledger itself; long-horizon goal is a lifetime tickets-served number that only ever rises

> The trusted server clock is not optional: it stops device-clock farming, which
> keeps us clear of the anti-gaming rule that voids **all** entries.

### 10.10 Progression — cuisines and the level run

> **Added Sep 3, 14:10 PT.** User proposal, adapted from PvZ2's world/sub-level
> structure (see `references/`). Adopted as **Option B — the linear run**: the
> progression is kept, the cartography is cut. Full analysis in [Retro.md](Retro.md).

**Why it exists.** The daily rotation (§10.9) is a strong retention *floor* but a weak
day-1-to-3 *pull*. "Beat your score" is a much weaker hook than "level 7 is right
there." The level run covers exactly the window the daily loop is worst at — the first
three days, when a curious stranger is deciding whether this becomes a habit. Neither
system covers all 15 scoring days alone.

**A level** is one shift with fixed, authored rules identical for every player: an exact
ticket count and mix, an arrival curve, an allowed station set, starting cash, and a
walkout limit. Because the content is fixed, a level can *teach* — a scripted burst of
five fryer tickets guarantees the "one fryer isn't enough" lesson that a random shift
can only offer by chance.

**A cuisine** is a run of ~6 levels that introduces exactly **one new tool of the
trade**. This is the theme's own demand expressed as progression rather than as skin.

| Levels | Cuisine | New tool | Design idea it teaches |
|---|---|---|---|
| 1–6 | **The Counter** — burgers, fries | Grill, Fryer | The base verb: equipment placed where tickets pass |
| 7–12 | **The Tandoor** — kebabs, naan | **Tandoor** — slow, but fills 2 dots at once | Commit early; slow tools are placed before they are needed |
| 13–18 | **The Wok Line** — noodles, stir-fry | **Wok** — very fast, very short rail reach | Placement precision under speed |

**Stars.** Three per level: *finish it* · *2 or fewer walkouts* · *serve 8 in a row
clean*. Stars gate the next cuisine, so a player stuck on level 6 can go back and clean
up level 2 instead. **No hard block, ever** — the most common quit-point in gated mobile
progression is a wall with no alternate route.

**Presentation.** A single scrollable vertical strip of numbered nodes in portrait. No
map, no winding path, no per-world art, no camera pan — those are where Option A's cost
lived, and they are cut. `references/` art is structural inspiration only.

**Interaction with the daily shift.** Today's Shift draws its ticket mix from **whatever
cuisines the player has unlocked**, so level progress makes the daily rotation richer.
The level run feeds the daily loop rather than competing with it.

**Levels are data, not code.** Authored as a JSON array so the user — whose strength is
design and systems — can retune the entire difficulty curve without touching game code.
Schema in [Specs.md](Specs.md) §6a.

**Level design is user-owned and not yet defined (confirmed Sep 3, 14:45 PT).** The
cuisines, recipe lists, level count and difficulty curve below are **placeholders**. The
agent ships placeholder levels so the system is testable from day one; the user replaces
them with real level data at level-design stage, and the agent supplies a fill-in
**Level Design Sheet** at that point. Binding requirement: **replacing level data must
never require a code change**, so the placeholder curve can be discarded wholesale
without touching anything else.

**Art varies with cuisine.** Each cuisine swaps station art — tandoor instead of grill,
wok instead of fryer — plus its own ticket dish icons. This costs nothing structurally:
station art is already token-driven through the skin layer (§11a, [Specs.md](Specs.md)
§5), so a new cuisine is **new tokens and new PNGs, never new rendering code**. Each
cuisine also brings its own working SFX (§12), which is why a player can hear which line
is running without looking.

**Binding constraints on this feature:**

1. **The return loop (§10.9) ships first.** If it is not live by Sep 9, the level run is
   cut — not the return loop. Finite content must never eat the content that never runs out.
2. **A first-time player never sees the strip.** The game cold-opens into level 1; the
   progression screen appears only after the first shift ends. The 30-second FTUE rule
   (§5) outranks the level structure.
3. **Structure only — no PvZ specifics.** Genre convention is not copyrightable, but PvZ
   art, names, lawn/plant/zombie framing, or a 1:1 level layout is a disqualification
   risk under the originality rule. Cuisines and a numbered strip are ours.
4. **Cost is ~8–9 h**, placing the project near 55 h of the user's 40–60 h range.
   Affordable, not free. Craft pass trims 8 h → 5 h to absorb it.

### 10.11 🔒 Challenge-mode FTUE and Warrior achievements — Sep 9 2026

**Source: a live playtest session on the RUN Discord.** Not inference — real players, six
findings. This section records the two features that answer them; the raw feedback is
[Plan.md](Plan.md) item 58.

✅ **This is cut-list item 8 being honoured, not broken.** *"Tutorial text screens. The
FTUE is the first 30 seconds of play, or it does not exist."* The current onboarding is a
sentence — `TestBelt.tsx:525`'s *"Tap a locked station to unlock it"* on the belt, and
nothing at all on Challenge mode. A scripted, visually-cued first three waves **replaces**
text with play.

#### 10.11a The script — user's spec, Sep 9, mapped to real entities

Every element already exists; nothing here needs new game systems.

| Beat | What happens | Code entity |
|---|---|---|
| Pre-start | A counter is **pre-selected** and the build dialogue opens on it | ⚠️ **v1.69.0: pad 4** (B3, `damage ×1.5`), was pad 0 — `FTUE_FIRST_PAD` |
| | Player picks a counter, presses **Ready** | existing Ready button |
| Wave 1 | plays normally | |
| Wave 1 end | **Ready hides.** The same counter re-selects, with an **arrow** pointing at it, to teach *upgrade* | ⚠️ **v1.69.0: pad 4 again**, was pad 0 |
| | Dialogue closes → Ready returns → **Wave 2** | |
| Wave 2 end | The **centre of the three platforms below** auto-selects, prompting a **second** counter | ⚠️ **v1.69.0: pad 3** (B2, `range ×1.5`), was pad 2 |
| | Placed → Ready returns → **Wave 3** | |
| Wave 3 end | **Achievement unlocks**, named for the counter placed **first** | §10.11b |
| ➕ **v1.69.0** | A **third** placement is prompted before wave 4 | pad **2** (B1, `fireRate ×1.5`) — beat `place3` |
| ➕ **v1.69.0** | While `ftueActive`, lives are restored each build phase — losing the tutorial is not possible | `towerScene.ts` |

🔴 **SUPERSEDED Sep 13 2026 — this paragraph was wrong, and the error was
load-bearing.** It read: *"pad 0 carries a `damage × 1.5` bonus — the strongest pad on the
board. The FTUE therefore puts a new player's first counter on the best square by
construction. Do not 'fix' this later."*

⚠️ **Pad 0 carries no bonus at all.** `config.ts`'s `PADS` array has pads 0 and 1 (row A)
and pads 8 and 9 (row D) at **`bonus: null`**; every bonus lives on rows B (2,3,4) and
C (5,6,7). **Round H Task 3 moved the only `damage` bonus off pad 0** — `config.ts`'s own
header comment records that change — and this paragraph was never updated. The cited
`config.ts:116` no longer points at a pad.

🔥 **The consequence, measured Sep 12 2026.** The FTUE kept opening on pad 0 on the
authority of this paragraph, which also instructed future readers *not to fix it*. Pad 0 with
one tower is exactly the simulator's `pad0-rush` profile — **which had been reporting death
at level 4 every single run.** A player following the tutorial was being taught the worst
opening on the board. Fixed in **v1.69.0**: the script now opens on `FTUE_FIRST_PAD = 4`
(B3, `damage × 1.5`) and fills B2 and B1 after waves 2 and 3. See the record's v1.69.0 entry
and [Retro.md](Retro.md) §103.

✅ **The intent behind the original line still stands** — the FTUE *should* put a new
player's first counter on the strongest square. It simply has to name a pad that is
actually bonused, and be re-checked whenever `PADS` changes.

**Runs once**, gated on a save flag — see the ⚠️ note below.

#### 10.11b Warrior achievements

Four, one per counter, named for it. **The names already exist in `data/towers.ts`** — no
renaming needed:

| Achievement | Tower id | Display name |
|---|---|---|
| **Grill Warrior** | `fox` | Grill |
| **Pressure Cooker Warrior** | `owl` | Pressure Cooker |
| **Tandoor Warrior** | `bear` | Tandoor |
| **Sauce Pot Warrior** | `squirrel` | Sauce Pot |

**Settled by the user, Sep 9:**

1. **10 levels each**, keyed to that tower's **total meta spend**, so it reads as one ladder.
2. **Meta upgrades drive it, never in-run upgrades.** Only meta persists (`MetaLevels`);
   an achievement that resets every run is not an achievement.
3. **Main-menu screen**, reached by a **medium trophy button carrying a notification
   count of unclaimed trophies** — the same vocabulary as §10.9's *"unclaimed-pay badge"*.

⚠️ **No achievements API exists.** Verified Sep 9: nothing in our code, and **nothing in
the RUN SDK** — the apparent `quest` hits in its typings are `Request` substrings. This is
built from scratch: save fields, unlock rules, a screen, and an unlock toast. Per §10.9's
own posture, **check `rundot skills` for a copy-in feature template before hand-building.**

✅ **CLOSED — two tabs, one currency each. User, Sep 9.** The achievement screen carries
**a Challenge-mode tab paying gems** and **a Belt-mode tab paying chef hats**.

🔥 **This is a better answer than paying everything in gems**, which is what was
originally proposed here. KitchenMode §6 decision 12 keeps the two currencies **fully
separate** — *"belt boosts never touch `MetaLevels`"* — and a single-currency achievement
screen would have been the one place they met. Splitting by tab means each mode's
achievements pay into the economy that unlocked them, so **the separation holds by
construction rather than by discipline**, and the belt stays promotable later without
unpicking the tower game's economy.

The trophy button's badge sums both tabs; each tab carries its own count.

✅ **CLOSED — the Belt tab is one achievement per prop family. User, Sep 9.** Challenge
mode has four towers, hence four Warrior achievements; the belt has **15 prop families with
tier ladders** ([PropList.md](PropList.md) §8.1), carrying the identical pattern — own and
upgrade this thing — with **chef hats** as the currency.

⚠️ **The Belt tab is still blocked where the Challenge tab is not, but less than it was.**
Round A already added `SaveData.kitchen` with `hats` and a per-level `clears` map, so the
**persistence shape exists**; what is missing is anything that *writes* them. `level.props`
is still unconsumed until the catalogue-wiring round. **The screen should ship with the
Challenge tab live and the Belt tab present but empty**, filling in as those land.

#### ⚠️ One sequencing constraint, and it matters more than either feature

Both this FTUE (a "played before" flag) and the belt's round 28 (`kitchen`) change
**`save.ts`** — the file holding live players' gems, best wave and meta levels on a build
that is public and scoring **right now**. **Make the shape change ONCE**, in whichever
round lands first, covering every new field at the same time. Two migrations on that file
is twice the chance of the one mistake that actually costs players progress. KitchenMode
§2.2's rules apply unchanged: additive only, never bump `SAVE_KEY`, never move an existing
field.


### 10.11c ✅ Rounds A and A2 landed — the FTUE ships, Sep 9 2026

Commits `4297240` (A, private **v1.38.0**) and `3e15c9d` (A2, private **v1.39.0**),
plus `accc4df`. §10.11a's script is built; §10.11b's achievements are **not** — round A
only records `firstTowerId`.

**Round A — the script, and the two things the playtest asked for.** Pad 0 pre-selects at
run start (gated on `!save.ftue.challengeDone`), an arrow cue replaces the "Tap a cook to
upgrade" text at wave-1-end, pad 2 auto-selects after wave 2, and wave-3-end retires the
script for good. 🔥 **Pad 2 is `(360, 485)` — the true centre of the row `(250/360/520)`**,
as specified. Challenge mode's lives chip is labelled and a run-start banner states the fail
condition; the belt billboard finally renders `Served completed/target` (or `/bossClearAt`
on a boss) — **`level.target` had never been rendered anywhere**, the single highest-value
fix from the RUN Discord session.

🔒 **The save migration, verified independently and not on report.** The real `save.ts`
was bundled and run headless against a hand-written v1 blob carrying **no `v`, no `ftue`,
no `kitchen`**: **30 of 30 checks pass.** `bestWave`, `gems`, all four `meta` tracks,
`audio` at non-boundary 0.37/0.82 and both `ads` fields survive load, flush and reload
byte-intact; both new branches default; a corrupt blob still falls back without throwing.
`SAVE_KEY` untouched at `save.ts:19`. **This was the criterion that outranked everything
else in the round, and it holds.**

**Round A2 — what made the build promotable.** Three things: the campaign-milestone banner,
sliders on the last pause screen that still had mute icons (`TestBelt.tsx`), and the
**dev gate**. `MainMenu.tsx`'s *primary* orange "Play Game" button (Sep 8 naming; the button became "Start shift" in the Sep 17 menu, Ideas.md §9, and is decided to become "Play" — §10.5) routed straight to
`phase: 'testbelt'` — the public menu's main call to action dropped every player into an
unfinished Test Mode belt. `devMode.ts` latches `?test=1` to `localStorage` (so it survives
the host stripping the query string) and Challenge Mode takes primary styling when the belt
entry is hidden. ⚠️ **`import.meta.env.DEV` was deliberately rejected**: `rundot deploy`
runs a production build, so DEV is false in the *private* build too and the belt would have
become untestable on device.

#### 🔥 Challenge mode is endless by design — do not "fix" this

`TdPhase` is `'build' | 'wave' | 'lost'`. There is **no won state**, and adding one would
delete the overtime score-chase — `bestWave` is the leaderboard metric, so capping every
run at `WAVES.length` flattens the board to a tie and removes the reason to play twice,
the exact opposite of what playtest finding 6 asked for. The milestone was never missing;
it was only never *shown*. `towerScene.ts:454` already fired `sfx.win()` and `Hud.tsx`
already switched the chip to `Rush N · Overtime`. Round A2 added the visible half.

⚠️ **`WAVES.length` is 10, not 13.** A brace-line grep said 13; deriving it from the
bundled module gives **10**. Anything keyed to the campaign length must be derived from
`waves.ts`, never counted by eye — [Retro.md](Retro.md) lesson 79's trap, caught in time.

#### ⬜ What these rounds did NOT do

- **Belt pause sliders exist now, but the belt FTUE does not** — N0 L1's ~22s opening
  traverse and the hidden walkout counter are still unwritten.
- **§10.11b's Warrior achievements are unbuilt.** Round A records `firstTowerId` and
  nothing consumes it yet.
- **The Belt achievements tab is settled but unbuilt:** one achievement per **prop family**
  ([PropList.md](PropList.md) §8.1), hats as its currency, mirroring the four Warriors.


### 10.11d ✅ Round D landed — the FTUE has walls, Sep 9 2026

Commit `b0e5c22`, private **v1.41.0**. Seven files, 316+/88−. 🔒 **`config.ts` and
`save.ts` diffs are empty** — persistence here means *ignoring* `challengeDone` on read,
not storing anything new, so round A's migration stays the only one.

**What round A had wrong.** Its script was run-once and escapable in one tap: `Close` was
always present, and `startWave()` had **no guard at all**, so Close-then-Ready began wave 1
on an empty board. It also retired permanently via `challengeDone`, which is why the
onboarding appeared broken on a device that had already seen it — the save was doing
exactly what it was built to do.

**The walls, verified from source.**

| Wall | Where |
|---|---|
| Ready gated | `actions.ts:146` — `if (store.get().ftueBeat !== null) return;` **one gate**, not a hidden button |
| Canvas taps walled | `towerScene.ts:312` — blocks re-tapping the forced pad, tapping another pad, and backdrop deselect in a single guard |
| `Close` hidden | `BuildSheet.tsx:235` — hidden, not merely disabled, for a beat's duration |
| `Sell` disabled | `BuildSheet.tsx:149` — `disabled={ftueActive}`, the **whole** onboarding, not just inside beats |
| Beats release | `actions.ts:103` (place) and `:121` (upgrade) — the single place each can resolve |

🔥 **The FTUE now retires when wave 3 BEGINS, not when it clears** (`actions.ts:157`) — a
deliberate change from round A. Freedom arrives with the wave the player is meant to
exercise it on.

#### 🔒 The soft-lock, and how it was closed

**The trap was real, deterministic, and visible to the player as a dead button.** Buying the
Tandoor at beat 1 leaves `140 − 110 = 30`; wave 1 pays at most `6 × 5 + 15 = 45`; the forced
upgrade costs **90** against **75** — short with *flawless play*, and
`BuildSheet.tsx:166` renders Upgrade `disabled` behind a hidden Close.

`grantFtueShortfall(requiredCost)` tops up **exactly** `Math.max(0, requiredCost - coins)`
and never more, shown to the player as a shift-float toast. ⚠️ **Both call sites derive
their requirement** — the upgrade's own cost, and `Math.min(...TOWERS.map(d => d.cost))` —
so neither is a typed number. It is reachable **only** from `towerScene.ts`'s FTUE logic.

✅ **The agent exercised the real trap rather than a hypothetical**: it bought the Tandoor,
lost one beetle past its range, and hit **70 coins against a 90 upgrade → grant +20**. That
reconciles exactly with the model above (perfect play 75 → shortfall 15; one leak costs 5
of bounty → 70 → shortfall 20). **The user's ruling stands honoured**: a grant, not a free
upgrade, so the player still pays full price and the economy lesson lands.

⬜ **Carried forward:** the `wave >= 2 && wave <= 4` upgrade hint was narrowed to
`wave === 4`, since a persistent FTUE covers waves 1–2 of every run and the 2–3 cases could
never fire again.


### 10.11e ✅ Round E landed — the hard-lock, and the pulse generalised, Sep 9 2026

Commit `366e77d`, private **v1.42.0**. 🔴 **A hotfix**: the defect it closes was live on
the public build (v1.41.0) when it was written.

#### The lock, and why it was total

Place at pad 0, then place a **second** tower at **pad 2 before pressing Ready**. At
wave-2-end the script set `ftueBeat: 'place2'` **unconditionally**, targeting a hardcoded
pad 2 that now held a tower. `sim/engine.ts:536` rejects a placement on an occupied pad, so
`actions.ts`'s release — which fires *inside* `placeTower`'s success branch — could never
run. `upgradeTower` only released `upgrade0`. Ready was gated, Close hidden, taps walled:
**no exit.** A second route reached the same state — fill every pad and there is nowhere to
force a placement at all.

🔥 **Root cause, stated generally: beat targets were constants, but the world they act on
is mutable.** `place2` named a pad at author time; whether that pad was placeable is a
runtime fact nobody checked. ✅ **Mitigation that limited the damage:** `ftueBeat` lives in
the store, never the save, so a reload always escaped. Players lost a run, not the game.

#### The fix — three layers

1. **Targets are chosen at fire time from live state**, carried in a new `ftueBeatPad`.
   Prefer pad 2; otherwise the geometrically nearest empty pad; **if no pad is empty,
   retire the FTUE rather than wall the player behind an impossible beat.** `upgrade0` got
   the same pre-set guard — safe today only because a wave-1 tower is Lv1 of max 3, which
   was luck rather than design.
2. **`isFtueBeatResolvable()`**, a pure predicate evaluated inside `syncStore()` (already
   running every frame and after every action — no timer). If a live beat stops being
   resolvable, `retireFtue()` drops every wall. **This is the layer that fixes states nobody
   enumerated.**
3. **`retireFtue()` is the single release point** — wave 3 starting, a pre-set guard, or the
   predicate all funnel through it. Previously four files read `ftueBeat` independently to
   arm four walls, which is why one missing check produced a total lock instead of a glitch.

⚠️ **The agent's own first pass still locked, and it found that by testing rather than
assuming.** `placeTower`/`upgradeTower` called `syncStore()` **before** their own release
check — and the target pad becoming occupied is *simultaneously* what resolves a beat and
what the predicate reads as "gone unresolvable". Reordering so the intentional release runs
first makes the ambiguity unreachable. The ordering is load-bearing and commented as such
in both functions; **do not reorder it.**

#### ⬜ Open: fallback-vs-skip at beat 5

What shipped: pad 2 occupied → **fall back to the nearest empty pad**, forcing a *third*
placement. 🔴 **This contradicts what was proposed to the user in chat**, which was to
**skip the beat and retire** on the grounds that a player who already placed a second
counter unprompted has demonstrated the lesson, and that forcing a third triggers
`grantFtueShortfall` for a purchase they never needed. **The handover said fallback; the
chat proposal said skip; the agent correctly implemented the handover.** Not a defect —
nothing locks either way — but the user's call, and it is one branch to change. See
[Retro.md](Retro.md) lesson 84.

#### Task 2 — the pulse, generalised

`ftuePulsePads` → **`pulsePads`**, now firing after **every** wave clear, persisting through
the build phase, cleared when the next wave starts, and dropping a pad the instant it fills.
Two suppressions, both load-bearing: **never while `ftueActive`** (enforced at the call
site — `applyFtueWaveEnd` *or* `applyPostWavePulse`, never both), and **never when the
cheapest tower is unaffordable**, since a pulse inviting an impossible action is worse than
none. `animate-ping` → `animate-pulse`: the ping's repeating scale-and-fade read as noisy
once sustained for a whole build phase. The objective and milestone banners now also
suppress on `pulsePads`, closing a one-voice gap the new cue opened.


## 11. Art

| Field | Value |
|---|---|
| **Style** | High-contrast flat vector. Near-black kitchen, one hot light over the pass, paper-white tickets, one hot accent (rail orange). Type-forward — tickets carry real order text. |
| Why this style is *fast* | Phase 1 is **zero image assets** — pure CSS/vector shapes and web type. Nothing to draw, nothing to load, nothing to break on a slow phone. |
| Colour palette | `#0B0B0D` kitchen · `#F5F1E8` ticket paper · `#FF6B1A` pass light / rail · `#3DDC84` served · `#E23B3B` walkout · `#8A8A93` cold station |
| Accessibility (colour-blind safe?) | ✅ **Checked** — served/walkout are never distinguished by colour alone; each carries a distinct glyph (✓ / ✗) and a distinct motion. Component pips differ in **shape** as well as hue. |
| **VFX** | Sizzle burst on component completion · ticket slam + bell flash on SERVE · desaturate-and-drop on WALKOUT · rail pulse as the rush accelerates · screen-edge heat vignette at high pressure |
| **Lighting** | ⏭ DEFER — 2D unlit. The "one hot light over the pass" is a painted gradient, not a light. |
| Asset source | **Phase 1** ✅ CSS/vector, zero credits. **Phase 2 (Sep 10–12)** ✅ **Pre-rendered sprites from user-owned 3D props** + `rundot generate image` for backgrounds, Ramu, and marketing. |

### 11a. 3D source art → 2D sprites (decided Sep 3, 14:45 PT)

The user owns **KayKit Restaurant Bits** (3D props) and asked whether it can be used.
**Yes — rendered to sprites, never as runtime 3D.**

| Runtime 3D (rejected) | Pre-rendered sprites (adopted) |
|---|---|
| three.js runtime (~600 KB) shipped to a phone | Zero extra runtime |
| Model + texture load before first paint | PNGs in one atlas |
| Draw calls require instancing discipline | **One draw call for the whole atlas** |
| Fights the 2D tower-defense kit | Native to the kit |
| **Does not fit the design** — the rail is a flat vertical lane in portrait; a 3D camera adds nothing | Fits exactly |

**Pipeline:** render each prop once in Blender at a fixed angle and light rig → export
transparent PNG → it becomes a token in the skin layer (§5 of [Specs.md](Specs.md)).

**Two advantages over generated art.** Cohesion — every prop shares one renderer, one
light rig, one palette, which is precisely what generated art struggles with across a
set. And **zero credit cost**, leaving the 126,100 balance for backgrounds, Ramu
himself, and marketing assets, where generation is genuinely the better tool.

The skin layer needs **no change** to accommodate this: a pre-rendered PNG and a
generated PNG are the same thing to it.

> ⚠️ **License check required before shipping.** KayKit is typically CC0 from the
> creator's own site, but the **Unity Asset Store EULA** licenses assets for use in
> Unity-based products and this is a web build. Confirm the creator's CC0 terms travel
> with the user's copy; if it is Asset-Store-EULA-only, re-source the pack directly from
> KayKit. Logged in §15.1.

> **🔒 Swap contract (technical, enforced from tonight):** every visual renders
> through a single skin layer. A station is a component that takes a *token*, not a
> hard-coded shape, so a CSS tile and a transparent PNG are interchangeable at one
> point in the code. No layout is tuned against geometry an image cannot reproduce.

## 12. Audio

**Revised Sep 3, 14:45 PT — SFX promoted from deferred to a core hook.** Cooking games
run on audio feedback: the sizzle, the bell, the ping. The original "defer audio" call
was wrong for this genre, and is reversed. The core loop remains **non-dependent** on
audio — that is an accessibility floor, not a ranking of importance.

| Field | Value |
|---|---|
| **SFX** — priority | **P1, not deferred.** Ships alongside the mobile/FTUE pass, not in the craft pass |
| **SFX** — core set | **Sizzle** (grill working) · **bell** (SERVED) · **ticket-print chatter** (arrival) · **tap/place ping** (station placed) · **thud** (WALKOUT) · **fryer basket drop** · **tandoor whoosh** · **wok toss**. The last three arrive with their cuisines |
| **SFX** — design rule | Every station has its **own** working sound, so a player can hear their line running without looking at it. This is the feedback hook, and it is why SFX is P1 |
| **Music** | Theme- and pace-matched. Calm during setup, thickening through the rush. Layered or crossfaded by rush stage so the track *reports the pressure* rather than just decorating it |
| Audio sourcing | **Asset packs + user-picked tracks.** The user selects; the agent requests specific cues by name and timing when a moment needs one. `rundot generate sfx` / `generate music` as the licence-safe fallback (see below) |
| Voice / vocal | ⏭ DEFER — Ramu never speaks aloud. His voice is the shift-end line, in text |
| Mute control present? | ✅ **Required.** Every audio cue keeps a visual twin and the game stays fully winnable in silence — most phone players play muted, and they must not be playing a worse game |

> ⚠️ **NCS licence check required before shipping any NCS track.** NCS's standard free
> permission is written for **video** content — YouTube, Twitch, TikTok — with
> attribution. **Interactive/game use is generally outside it**, and NCS directs it to
> separate licensing. The jam rules require entries not infringe third-party IP, and
> prize terms make the entrant warrant exactly that, so this is not a small risk on an
> entry that could place. Verify per track, or use a licence-safe source:
> `rundot generate music` / `rundot generate sfx` (first-party, credit-funded, 126,100
> available) or a pack with an explicit interactive/game licence. Logged in §15.1.

## 13. Game Experience

### 13.1 UI

| Question | Answer |
|---|---|
| What will the UI look like? | Diegetic-leaning: the HUD is kitchen furniture. Walkouts are dockets on a spike, cash is the register readout, the rush meter is the pass light heating up. |
| Required elements | Walkout counter (5) · cash · rush progress · station slots · HANDS! charges · shift number |
| 🔒 **Recipe row ceiling** | The billboard ingredient row caps at **5 ingredients comfortably, 6 absolutely** — below 0.45 scale these sprites stop reading. **Recipes are authored against this cap, not squeezed into it.** Full derivation in Specs §8b; picks in [RecipeList.md](RecipeList.md) |
| Available at all times? | Yes — a 90-second shift never hides state. No pause-to-read, no submenus during play. |
| Placement — avoiding overload | Status pinned **top** (out of the thumb arc), action pinned **bottom** (inside it). The middle third is pure rail and stays clean. |
| Diegetic or overlay? | Diegetic where free, overlay where clarity wins. **Clarity always wins a tie.** |

Screens needed: ✅ Title (skippable — cold-opens into play) ✅ Game ⬜ Pause ✅ Shift-end ✅ Shift pay / rewards ✅ Ledger (stats)

### 13.2 Controls & Feel

| Field | Value |
|---|---|
| Input scheme | **Single tap only.** Tap a slot to place/upgrade. Tap a ticket to expedite. Nothing else. |
| Button/gesture count | **1 gesture, 2 targets.** No drag, no pinch, no long-press, no swipe. |
| Game feel notes | Every tap lands in <100ms with a visible response. The bell on serve is the reward beat and gets the most juice in the game. Haptic tick on place and on serve. Rush acceleration is felt through tempo, not read off a number. |
| Safe-area / thumb-reach checked | ⬜ **Day 2** — safe-area insets and a thumb-arc pass with `rundot-mobile-ux` |

### 13.3 Integration

- ✅ Share button surfacing the entry link — placed post-shift, when the player has just felt something
- ⬜ Score/leaderboard surfacing — **Day 5+**, best-shift only, deferred until the return loop is live
- ⬜ Localization — ⏭ DEFER

## 14. Market Requirements

| ID | Requirement | Rating |
|---|---|---|
| 1 | Built from an official jam kit / Adventure Studio | **M** |
| 2 | Playable on a phone, portrait, one hand | **M** |
| 3 | Public + approved **on day one** | **M** |
| 4 | Fun reached within 30 seconds, unaided | **M** |
| 5 | A reason to return tomorrow | **M** |
| 6 | All team members credited (solo — the account handle) | **M** |
| 7 | Works with sound off | **S** |
| 8 | A shift completes in under 90 seconds | **M** |
| 9 | Progress survives closing the app | **S** |
| 10 | Art swappable to generated assets without layout rework | **S** |
| 11 | Every SDK call wrapped — no unhandled rejection can crash the game | **M** |
| 12 | Story/Video hedge entry published (~Day 8) | **C** |
| 13 | Level run — 3 cuisines, ~18 authored levels, stars, no hard block | **C** |
| 14 | Levels authorable as data without touching game code | **S** |
| 15 | First-time player cold-opens into level 1, never a menu | **M** |

**MVP — the smallest thing worth publishing tonight:**

```
Portrait. One vertical rail. Tickets crawl top -> bottom. TWO station types (grill,
fryer) placeable in flanking slots. Components cook when a ticket is in range of a
station that serves that type. Reaching the pass finished = SERVED +cash; unfinished
= WALKOUT. Five walkouts ends the shift, shows tickets served, offers retry.
CSS/vector only. No audio, no save, no daily anything.

That is it. It is a complete 90-second thing, it is unmistakably a cook holding a
line, and it starts the scoring clock ~15 days before that clock closes.
```

**Stretch goals** (only after every M is green):

```
Named regulars recurring across days · Saturday-night super-shift · second rail ·
generated art pass · kitchen room-tone audio · best-shift leaderboard
```

**Marketing** — where and how often:

```
DAILY, 15 minutes, non-negotiable — it is 20% of the effort allocation, and the third
failure mode in the runbook is building something nobody is ever told about.

- Every day: `rundot jam promo`; post in Discord #back-to-work; play and comment on
  other entries (reciprocity is the largest early traffic source).
- Day 2:     r/WebGames + X launch post.
- Day 4:     r/KitchenConfidential — the recognition-hook post, written as a cook and
             not as a marketer. The single highest-upside post available to this
             concept.
- Days 5-14: progress posts, not launch posts. A visible changelog is itself a reason
             to return, and returns are worth full points.
```

| Field | Value |
|---|---|
| **Delivery** — target first public deploy | **Sep 3, tonight, before sleep** (early hours Sep 4 IST) |
| **Post-launch** — Sep 14–18 judging plan | No code changes possible. Keep posting daily; fire the re-engagement notifications; play and comment on other entries; watch the board. Four more calendar days = four more full scoring days. **Most entrants quit here — that is the free score.** |

## 15. Technical Requirements

### 15.1 Known issues / risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| **`set-public` review is not instant; tonight's publish slips past sleep** | Med | Deploy and `set-public` the moment the MVP is playable — do not wait for it to be *good*. Review runs while you sleep. |
| Kit's TD structure resists a vertical single lane | Med | Fall back to the kit's native lane orientation and rotate the framing. **Never fight the kit on day 1.** |
| Credits: 25,100, not the promised 100,000 | **High** | Promo code sits unredeemed in the `offroadinggamedev@` inbox — redeem it. Discord tops up on request. Phase 1 needs **zero** credits, so this cannot block tonight. |
| Pre-jam throwaway game mistaken for the entry | Low | `2D Starter Kit (pixi.js)`, created 09:22 PT Sep 3 — **before the jam opened**, and not from a kit. It stays private. The entry is a fresh scaffold with its own `game.config.json`. |
| Unhandled SDK promise rejection crashes the game | Med | Every SDK call in try/catch, per `rundot-sdk`. The game must run fully even with the SDK unavailable. |
| Reads as an Overcooked / Diner Dash clone | Low | It is a rail, not a restaurant. No movement, no customers, no plating minigame. Art direction reinforces "rail". |
| Solo dev, 11 days, sub-1h day-one budget | **High** | The MVP above is deliberately *below* what is achievable in the time, not at it. |
| **NCS track licence does not cover interactive/game use** | **Med** | NCS's free permission is written for video content with attribution; games are generally outside it. **Verify per track before shipping.** Licence-safe fallbacks: `rundot generate music` / `generate sfx` (126,100 credits) or a pack with an explicit game licence. Jam rules require no third-party infringement, and prize terms make the entrant warrant it |
| **KayKit pack licensed under Unity Asset Store EULA rather than creator CC0** | **Med** | The Asset Store EULA licenses assets for Unity-based products; this is a web build. Confirm the creator's CC0 terms travel with the user's copy; if not, re-source directly from KayKit. **Check before the art pass, not after** |
| Audio promoted to P1 crowds the Sep 4–5 block | Low | SFX is ~8 cues from packs, not composition. If it slips, the mute-parity rule means nothing is unplayable — it ships Sep 6 instead |
| Placeholder levels mistaken for final design | Low | Marked as placeholder in §10.10 and [Specs.md](Specs.md) §6a; replacing them requires no code change |

### 15.2 Systems

| System | Owner | Priority |
|---|---|---|
| Rail + ticket spawner + rush curve | agent | **P0 — tonight** |
| Station placement, typing, service resolution | agent | **P0 — tonight** |
| Serve / walkout resolution + shift end | agent | **P0 — tonight** |
| Skin layer (token-based rendering; the art swap contract) | agent | **P0 — tonight** (cheap now, expensive later) |
| HANDS! expedite | agent | P1 — Day 2 |
| Mobile safe-area + thumb-arc pass | agent | P1 — Day 2 |
| FTUE cold-open (the 30-second beat sheet) | agent | P1 — Day 2–3 |
| Save + ledger (`-save`, `-stats`) | agent | P2 — Day 3–4 |
| Daily shift roll (`-daily-quests` seeded roll) | agent | P2 — Day 4 |
| Shift pay (`-daily-rewards`) + notification | agent | P2 — Day 4–5 |
| **Level loader + star evaluation** | agent | **P2b — Sep 8–10** |
| **Progression strip (portrait, no map art)** | agent | **P2b — Sep 8–10** |
| **Cuisine unlocks → Today's Shift ticket mix** | agent | **P2b — Sep 8–10** |
| **Level authoring + curve tuning (~18 levels)** | **user** | **P2b — Sep 8–10** |
| Craft pass + generated art | agent + user art direction | P3 — Sep 10–12 |

### 15.3 Work packages

| # | Package | Days | Runbook CP | Done |
|---|---|---|---|---|
| 1 | Scaffold + clean build | Sep 3 | CP2 | ⬜ |
| 2 | **Rough playable → public** | Sep 3 | **CP3** | ⬜ |
| 3 | Mobile + FTUE + stability | 2–3 | CP4 | ⬜ |
| 4 | Return loop | 3–5 | CP5 | ⬜ |
| 5 | Distribution cadence | 4–14 | CP6 | ⬜ |
| 5b | **Level run — 3 cuisines, ~18 levels** | **Sep 8–10** | — | ⬜ |
| 6 | Craft pass (Editor's Pick) — trimmed 8 h → 5 h | Sep 10–12 | CP7 | ⬜ |
| 6b | Story/Video hedge entry | ~8 | — | ⬜ |
| 7 | Final deploy verified | Sep 14 | CP8 | ⬜ |
| 8 | Judging-window sharing | 14–18 | CP9 | ⬜ |

### 15.4 Tasks & owners

| Person | Domain | Accountable for |
|---|---|---|
| **User (solo)** | Design / systems · art direction · distribution | Tuning the rush curve and daily variance; supplying and validating art references; the daily 15-minute sharing habit |
| **Agent** | Implementation · SDK · deploy | Kit scaffold, all code, the art swap contract, build/deploy pipeline, feature-skill installation |

### 15.5 Activities

```
Sep 3  (<1h)   scaffold -> MVP -> deploy -> phone test -> set-public -> verify
Sep 4-5        HANDS!, mobile pass, FTUE cold-open, SDK try/catch hardening
Sep 6-8        save + ledger + daily shift roll + shift pay + notification
Sep 8          Story/Video hedge entry (pest controller, night shift)
Sep 8-10       LEVEL RUN: loader, stars, strip, cuisine unlocks, ~18 levels
Sep 10-12      craft pass (trimmed): generated art, SFX, shift-end voice
Sep 12-13      tuning, buffer, final polish
Sep 14 <11:00  final deploy, verify public + approved
Sep 14-18      share daily; do not stop
DAILY          15 min distribution, every single day, from Sep 4
```

---

# Part 3 — Scope contract

### 🔒 The cut list — explicitly NOT in this game

```
1. Multiple venues, restaurants, or a chain to manage. One kitchen. One rail.
2. Cutscenes, dialogue trees, or any narrative that stops play. Ramu speaks in ONE
   line at shift end and nowhere else.
3. Ingredient inventory, ordering, spoilage, or any supply-chain economy.
4. Co-op or any multiplayer.
5. Custom dish / recipe creation by the player.
6. Character movement. Ramu is never a controllable avatar — that is Overcooked, and
   it is the fastest way to make this unbuildable.
7. Ads and IAP. Irrelevant to jam scoring and a net negative on retention here.
8. Tutorial text screens. The FTUE is the first 30 seconds of play, or it does not
   exist.
9. The PvZ2 world map. No floating islands, no winding path, no camera pan, no
   per-world art, no world-select screen. This is where Option A's ~30 hours lived
   and it is cut on purpose — a numbered strip does the same job for a quarter of
   the cost and reads better in portrait. (Added Sep 3, 14:10 PT.)
10. Branching level paths, boss nodes, treasure nodes, level gates that hard-block.
    Star gating with a replay route only — a wall with no alternate path is the most
    common quit-point in gated mobile progression.
11. More than 3 cuisines / ~18 levels for the jam window. Level count is a content
    treadmill and the daily shift is the thing that never runs out.
```

> Re-read this list on day 6 and day 9. Feature creep arrives disguised as a good idea.

### Trigger rules — decided in advance, executed without debate

| If… | Then… |
|---|---|
| Not publishable by end of Sep 3 | Cut to **one** station type and **three** walkouts, and publish anyway |
| The kit resists a vertical rail | Take the kit's native orientation tonight; re-orient on Day 2 |
| A **primary** mechanic isn't fun by day 3 | Replace the mechanic, keep the shell — the rail and the pass survive everything |
| Behind on day 8 | Cut §10.4 secondary mechanics 2 and 3. Keep the daily modifier and the shift-end line; both are near-free and carry the theme |
| Return loop not live by day 6 | **Drop the craft pass and the Story/Video hedge.** Return loop outranks polish, and outranks the second entry |
| **Return loop not live by Sep 9** | **Cut the level run entirely.** Finite content must never eat the content that never runs out |
| **Level run slipping on Sep 10** | Ship **one** cuisine (6 levels) rather than three. A short complete run beats a long broken one |
| **Progression strip costing more than ~2 h** | Replace it with a plain numbered list. The strip is navigation, not gameplay |
| Sharing slips two days running | Stop building. Ship nothing that day and only distribute |
| Credits block generated art | Ship Phase 1 CSS/vector as the final art. It was designed to be sufficient, not provisional |

### 🔒 FREEZE (Guidelines §9)

Locked: **core loop (§10.1), theme expression (§10.2), primary mechanics (§10.3),
return loop (§10.9)**. Everything else stays living.

| Field | Value |
|---|---|
| Frozen on | **Sep 3 2026, 15:00 PT — APPROVED by user.** Concept locked 13:05 PT (65 min after reveal); revised 14:10 and 14:45 PT pre-approval |
| Frozen by | `offroadinggamedev@gmail.com` (solo) |
| Target: within **90 minutes** of the theme reveal | ✅ **Met** — reveal 12:00 PT, frozen 13:05 PT (65 min) |

---

# Appendix — Decision log

| Date | Decision | Reason | Impact |
|---|---|---|---|
| Sep 3, 12:50 PT | Kit = `september-jam-tower-defense`, not Bare Bones | <1h available on day one; TD ships a working loop at hour one, and a day-1 publish is worth ~15 scoring days | Design must justify holding a line — satisfied by framing the rush as the enemy |
| Sep 3, 12:55 PT | Job = line cook (Ramu) over pest controller | Higher plays ceiling; plays are $2,200 across 5 places vs Editor's Pick $300 at 1 | Pest controller retained as the Story/Video hedge subject |
| Sep 3, 13:00 PT | Art Phase 1 = CSS/vector, zero credits | Credits at 25,100 not 100,000; Phase 1 must not depend on a promo code arriving | Skin-layer swap contract becomes a P0 system, built tonight rather than retrofitted |
| Sep 3, 13:05 PT | Vertical rail, portrait | Lane direction agrees with the phone's long axis; the pass sits under the thumb | Portrait is a design win here, not a mobile concession |
| Sep 3, 14:10 PT | **Added §10.10 — cuisine level run (Option B)** | User proposal from PvZ2 references. The daily loop is a strong retention *floor* but a weak day-1-to-3 *pull*; the level run covers exactly that window. Cuisines also express "tools of the trade" better than the original generic station set | **No frozen item broken** — §10.1 core loop, §10.2 theme, §10.3 primary mechanics and §10.9 return loop are all unchanged. This is additive, sits at §10.10, and is gated behind the return loop shipping first |
| Sep 3, 14:10 PT | **Rejected Option A — the full PvZ2 world map** | ~30 h, i.e. the entire remaining build budget. Would have required cutting the return loop, delayed the day-1 publish, and put a menu in front of the fun. Most of that cost produces navigation, not gameplay | Map, winding path, world select and per-world art added to the cut list (items 9–11) |
| Sep 3, 14:45 PT | **Title → *Spice Expert: Ramu*** (from *Ramu: In the Weeds*) | User call. "In the weeds" is authentic but niche; a general audience does not know it, and a title needing explanation loses players at the tap on a plays-ranked board | §1 packaging, `rundot init --name`, share captions. Trade language moves inside the game where it reads as flavour instead of as a barrier |
| Sep 3, 14:45 PT | **SFX promoted from ⏭ DEFER to P1** | The original defer was wrong for this genre. Cooking games run on audio feedback — sizzle, bell, ping — and each station having its own working sound lets a player hear their line without looking. Core loop stays non-dependent on audio | §12 rewritten; §7 updated; Sep 4–5 block gains an audio task. Mute-parity rule unchanged as an accessibility floor |
| Sep 3, 14:45 PT | **Session length split into *level* length vs *session* length** | The scoring metric is indifferent to session length — it counts unique players per calendar day. Level 60–120 s scaling by cuisine; session uncapped and player-chosen by chaining levels | §5 revised. Recipe diversity, not clock time, is what justifies longer later levels — user-owned at level-design stage |
| Sep 3, 14:45 PT | **3D assets adopted as pre-rendered 2D sprites; runtime 3D rejected** | User owns KayKit Restaurant Bits. Runtime 3D ships a ~600 KB renderer, fights the 2D kit, and adds nothing to a flat vertical rail in portrait. Pre-rendering gives real 3D lighting at one draw call, more cohesion than generated art, and zero credit cost | New §11a. Skin layer needs **no change** — a pre-rendered PNG and a generated PNG are identical to it. Credits redirect to backgrounds, Ramu, and marketing |
| Sep 3, 14:45 PT | Level design confirmed **user-owned; agent ships placeholders** | Level structure is not yet defined and is the user's to author. Placeholders make the system testable from day one without pre-empting the design | §10.10. Binding: replacing level data must never require a code change. Agent supplies a Level Design Sheet at that stage |
| Sep 3, 14:45 PT | Craft pass trimmed 8 h → 5 h | Absorbs the level run's ~8–9 h and keeps the project inside the 40–60 h budget, at ~55 h | Editor's Pick odds marginally reduced; plays ceiling raised. Plays are $2,200 across 5 places vs $300 at 1 — same trade already made on Sep 3, 12:55 |
| Sep 4, 22:05 IST | **Art direction: Kitchen Props for the room, Kitchen Essentials for the line; KayKit Phase 2a cut** | Both purchased 2D packs were sliced and the Props pack recoloured onto the Essentials palette, which worked as measured (b\* +2.3 → +12.3, chroma 12.1 → 21.3) and still left them unusable side by side: Essentials items are a median **94×124 px** of painterly front-elevation art, Props items **32×32 px** of flat **isometric** pixels. A palette can be transferred; a resolution cannot. Rather than discard \$4 of art, the two registers are separated **by depth** — Props behind the belt as set-dressing at its own scale, Essentials on the belt | **§11a is retired.** KayKit renders would have been a *third* source at a fourth resolution and technique. §10.1–10.3 core loop, §10.9 return loop and the [PropList.md](PropList.md) §4 interaction graph are **all unchanged** — the graph is built entirely on Essentials ingredient sprites, and Props has no ingredients at all. Frees the Sep 10–12 craft pass of a Blender render job. Detail and the two rejected options: [PropSpriteIndex.md](PropSpriteIndex.md) §5 |
| Sep 4, 23:10 IST | **The belt game view ships as a second mode, not a replacement** | The live v1.2.3 is scoring at rank #3 on a plays-ranked board, and the belt rewrites the sim rather than re-skinning it — replacing it in place would bet the entry on untested work with 15 days left. Eight architecture calls were taken in one pass rather than discovered during the build | Primary `Play` is **unchanged**, so §7's CP4 (*first-timer to the fun in 30 s*) is untouched; a secondary `Kitchen (beta)` sits beneath it. The belt carries the GDD's frozen **five** walkouts while the tower defence keeps its shipped ten. 🛑 A stop rule was set in the same pass: **playable end to end by Sep 10 or cut**, because the return loop is unbuilt and is what the scoring metric rewards. Full record and the rejected alternatives: [KitchenMode.md](KitchenMode.md) |

---

## 16. Post-jam progression pass — Sep 13–17 2026 (addendum)

Everything below shipped **Private-only** (1.70.0 → 1.81.0) while Public stays at 1.69.0 through judging;
the design of record is [Ideas.md](Ideas.md) §6d (every playtest decision, dated), §9 (main menu) and
§10 (the six post-jam studies, all picked Sep 17). This section is the index, not the spec.

| Rounds | Build | What |
|---|---|---|
| 0–1 | 1.70.0 | Chef Ramu (9 block costumes × 4 faces, RUN-generated) and the dialogue system: 12 beats, queue, Skip = mute |
| 2–2c | 1.71–1.73 | FTUE flow — the box is the Ready button; beat 3 first, upgrade dock after; Lv↑ markers; legibility rule (403×874) |
| 3–4 | 1.74–1.75 | Service ring gauge in the HUD; prop feedback bundle (recoil, flash, trail, steam); wave bubble with per-dish counts |
| 5–7 | 1.76–1.78 | Scroll-grid wave bubble; tween wrapper containers (Retro 110); bottom band 340 with the chef at centre; post-boss panel; end-screen "Ramu's debrief"; BGM 50 % |
| 8–8b | 1.79–1.80 | Main menu on Archita Sharma's dawn backdrop, layout A, laid out in **mock units** (Retro 111); four playtest fixes |
| 9 | 1.81.0 | Pass hatches + belt tread; Settings dialog; empty-pad green/red cue; guest name + greeting; anonymous rows shortened |
| 10 | 1.82.0 | Heat gauge (boss meter), four FTUE beats, name at boot, pulse removed, Settings look A, rename, pause card |
| 11 | 1.83.0 | Ranks service board with a Daily tab (daily period added); heat gauge centred in the visible gap; block-clear card ×1.15; scroll chips readable; card alpha 0.9 |
| 12–12c | 1.84–1.86 | Ranks look B (pass counter), Dishes served / Waves held, portrait ×1.5 with Ready above; HUD bands reserved in measured pixels |
| 13 | 1.87.0 | Chevrons riding the belt; i18n string table (English only, 244 keys); wave-bubble submenu as a scrimmed popover |
| 14 | 1.88.0 | Board scale static across HUD states; Kitchen-Actions icon chips; recipe shards (+1 per recipe on a full-service clear, 8 per scroll or 150 gems) and scroll cards in the Kitchen |
| 15 | 1.89.0 | One rewarded continue per run (+6 escapes, engine untouched); ⟳ marker on continued board entries; continue sting |
| 16 | 1.90.0 | Closing the order scroll reverts to the chip; "Start shift" → "Play"; Kitchen unlock badge (+n) and greeting notice |
| 17+ (queued) | — | Hindi · IAP (content, not power) |

**Naming today:** the menu's primary is *Start shift* (→ *Play*), the meta screen is *The Kitchen*, the boards are *Ranks*; the
tower game is the only public mode (the belt/Kitchen Mode of §10.3a stays behind `?test=1`).
