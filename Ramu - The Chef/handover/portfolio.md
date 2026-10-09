# Spice Expert: Ramu — design decisions and what they returned

**Solo project · RUN's September Jam 2026 · tower defence · ▶ [play it](https://w.run/puneetmakes/spice-expert-ramu)**

> Tickets come down the rail toward the pass. Set your grill, tandoor and fryer along it and finish
> every dish before it arrives, because anything that reaches the pass is a walkout.

**Result: 6th of 100 entries — 638 daily unique players, 942 plays across 15 days in jam.**
Shipped and still live: **104 deployed versions**, 25 build rounds, 100% crash-free.

This document is the design reasoning, not the feature list — each decision with why it was made
and what actually happened. The uncomfortable half is at the end, because that's the half with the
transferable lessons in it.

---

## Part 1 — Quantitative

### 1.1 A five-number balance baseline, treated as a regression test

The most useful thing I built wasn't a mechanic. It was a single command that simulates five
scripted play styles against the real engine and prints the level each one dies on:

```
fox-spam 35 · balanced 36 · miser 11 · pad0-rush 4 · maxed-meta 90
```

Each number is a **contract**, not an observation:

| Scenario | Contract | Why it exists |
|---|---|---|
| `balanced` | must show `lives 10 (leaked 0)` on **every** level 1–12 | the first twelve levels must be winnable by a reasonable player, not just survivable |
| `miser` | must still **lose** | under-spending has to be punished, or the economy is decorative |
| `pad0-rush` | must die early (4) | the opening pad choice must matter |
| `maxed-meta` | must lose between **85 and 110** | a fully-upgraded player needs a ceiling, and it must not be the level cap |
| `fox-spam` | 35 | a single-unit-type counter-check |

**It held byte-identical across 24 consecutive build rounds.** Any change that moved a number I
hadn't intended to move showed up in one line. ✅ **The design value: it let me say "this is
balanced" as a falsifiable claim rather than a feeling**, and it made it safe to let other people
(and agents) touch gameplay code.

Paired with a **sealed-file list** — the simulation core and the four data tables no routine change
may touch — this is the piece of process I'd rebuild first on any future project.

### 1.2 The economy, and the shape I chose for it

| Parameter | Value | Reasoning |
|---|---|---|
| Starting coins | 200 | enough for two real decisions, not three |
| Starting lives | 10 | a walkout should sting without ending the run |
| Wave bonus, levels 1–10 | 25 | front-load generosity so the FTUE can't soft-lock |
| Wave bonus, level 11+ | **6** | a deliberate cliff — the mid-game must become about placement, not income |
| Bounty multiplier, 11+ | **0.55** | the same cliff applied to kill income |
| Meta gems per wave | 4 | linear, so meta progression spans many runs rather than one |

**The decision worth defending is the cliff at level 11.** Income drops ~76% in one step. It reads
as harsh on a spreadsheet, and the simulation showed it was the only thing that stopped a
competent player from out-earning the difficulty curve and flattening the back half. **The
`maxed-meta` scenario dying at 90 rather than at the cap is that cliff working.**

### 1.3 The real funnel, measured rather than assumed

From 824 instrumented sessions:

| Step | Sessions | Of boots |
|---|---|---|
| Game loaded | 824 | 100% |
| Run started | 670 | **81%** |
| First tower placed | 567 | 69% |
| First wave started | 570 | 69% |
| **Wave 1 cleared** | **449** | **54%** |
| Run ended | 232 | 28% |

✅ **54% of everyone who loads the game clears the first wave.** For a jam entry with no tutorial
video and no onboarding gate, that's the number I'm most satisfied with — it says the opening
teaches itself.

⚠️ **19% never start a run at all.** That's the real top-of-funnel loss, and I only found it after
first mis-measuring it as 34% by comparing two steps that belonged to **different** registered
funnels. The lesson is in Part 3.

### 1.4 Retention — the number that says the most and flatters least

| Platform | Cohort | D1 | D7 |
|---|---|---|---|
| mobile-web | 443 | **1.1%** | 0.9% |
| web | 95 | 3.2% | 1.1% |
| android | 46 | 0.0% | 2.2% |
| **Overall** | **594** | **≈1.5%** | **≈1.0%** |

**Nine returning players out of 594.** Casual mobile floors sit around 25–35%, so this isn't "below
target", it's effectively zero — and the cause was structural rather than mysterious: a `grep` of
the shipped jam build found **no notification scheduling, no daily reward, no streak, nothing that
ever brought a player back.** The game had a reason to return (progression) and no reminder.

⚠️ **The honest caveat, which matters for reading the number:** this measures the *jam* build. The
post-jam build added the entire meta-progression layer, and only 29 players have seen it. **Its
true D1 is unknown.**

### 1.5 Localisation, done properly rather than gestured at

**395 string keys in English and Hindi — symmetric difference 0, 11 plural rows in each, zero
interpolation-token mismatches**, verified by executing the real modules rather than grepping the
text.

Three sub-decisions:

- **Three keys stay in Latin on purpose** (`Lv↑`, `{b} dmg`, `{b}/s`). They're drawn by the game's
  renderer rather than the DOM, and the renderer has no Devanagari fallback — it would render tofu.
  ✅ **Shipping three untranslated strings beats shipping three broken ones.**
- **Player names are capped by grapheme cluster, not by character.** A Devanagari name can spend
  several code points on one visible glyph; a naive 16-character cap truncates mid-glyph and
  produces a mark with nothing to attach to. The cap counts what the player sees.
- **First-boot language detection for Indian locales**, with a Settings row to override. The
  language question gets asked once, at the only moment it isn't an interruption.

### 1.6 Scope, as a measured quantity

| | Before | After |
|---|---|---|
| Asset manifest entries | 165 | **123** |
| Shipped asset weight | — | **−906 kB** |
| Game modes | 2 | **1** |
| Source files deleted | — | **7** |

### 1.7 Instrumentation and stability

**32 telemetry events across two registered funnels** (a 1-step `boot` funnel, a 6-step `run`
funnel). **100.00% crash-free sessions on every analytics row of the current build**, across
android, iOS, web and mobile-web.

Two live leaderboards, server-side anti-cheat: **113 players** on waves (best: **106**) and
**107** on kills (best: **6,231**).

### 1.8 Paid acquisition — the experiment and its verdict

| | |
|---|---|
| Spend | $80.96 of $82 |
| Installs | 22 |
| **CPI** | **$3.68** |
| **ROAS** | **0.00x** |
| Attributed installs | **0** |

A second campaign was rejected and spent nothing. ✅ **The finding: for a game at this stage, free
organic distribution outperformed paid by a wide margin.** The 638 jam players did not come from
ads. I'd rather have a document that says this plainly than one that omits a failed experiment.

---

## Part 2 — Qualitative

### 2.1 Theme expressed mechanically, not cosmetically

The jam theme was *"Back to Work: any job, and the real story behind it."* The easy read is a
kitchen skin on a generic game. **The decision was to make the theme the failure condition.**

A customer who reaches the pass is a **walkout** — not a life lost, not damage taken. The thing the
game punishes is the thing the job punishes. **Towers are stations, enemies are tickets, the path is
the rail, and the win condition is a clean service.** Nothing in the loop needed renaming because
nothing was a metaphor laid on top.

### 2.2 Two primary mechanics, capped, in writing, on day one

The design document fixed **a hard cap of two primary mechanics** before any code existed, and
recorded the gated order between them. Everything else was explicitly filed as secondary and marked
**cuttable**.

✅ **This is the decision that made the jam deadline survivable.** When time ran out, the cuts were
already identified and pre-authorised, so cutting was bookkeeping rather than an argument.

### 2.3 Boot straight into play — and the cost of it

The game has a main menu, and **a cold boot does not go there.** It drops the player directly into
a scripted opening run.

**The reasoning:** every screen between launch and the first interesting decision is a place to
leave. For a jam entry reached by a shared link from someone with no investment, the first fifteen
seconds are the entire pitch. **54% wave-1 clear suggests this was right.**

🔴 **It also caused the project's worst bug, which I'll put plainly because the pairing is the
point.** When I later added a daily reward, it went on the main menu — the screen the game never
boots into. It is reachable only by finishing or abandoning a run and then declining the emphasised
Retry button. **Across 29 players, its "popup opened" event has fired zero times.**

**Both halves came from the same design instinct.** Removing friction from the opening was correct
and measurable. Forgetting that the removed screen was where I'd later put things was not. ✅ **The
lesson I'd carry: a decision about where the player *starts* is also a standing constraint on
everywhere you can later put something.**

### 2.4 Cutting a finished-looking mode

The game carried a second mode — a conveyor-belt kitchen sim with its own five-node progression,
its own economy document, its own UI pack dependency. Weeks went into it. It was never fun enough
to be the reason anyone played.

**It was deleted:** seven source files, an entire data layer, 906 kB of art.

✅ **The game got better the same afternoon.** The remaining mode stopped being "one of two things"
and became the thing. A side effect: deleting its assets also removed the last third-party licence
dependency in the build, which had been an open question for three weeks.

**What I'd tell myself at the start:** the cost of a second mode isn't the time it takes, it's that
neither mode gets to be finished. **One mode, finished, beats two half-done.**

### 2.5 Progression the player can see on the character

Meta-progression is numeric — station levels, recipe unlocks, a shard economy, Toque Badges. The
decision was that **none of it should only exist as a number**.

The chef's portrait is assembled from a **body that changes with the cuisine district** and a
**face that changes with run state**, over a **backdrop keyed to the current block**, with **dish
trays showing the actual recipes in play**. Crossing from the café into the North Indian district
visibly re-costumes him mid-run.

✅ **The intent: let a player who never opens a menu still feel the run moving.** The composition is
built from dynamically-constructed asset keys, which is also why a careless cleanup pass nearly
destroyed it — see Part 3.

### 2.6 Narrative as beats that fire once

Story is delivered as dialogue beats at specific moments — not a cutscene, not a codex. The
mechanism distinguishes **beats that fire every run** from **beats that fire once ever**, persisted
in the save.

**Why it matters:** the same line that establishes character on run one is an obstacle on run four.
A line worth reading once is worth suppressing afterwards, and that needs to be a property of the
line rather than a thing the player has to dismiss.

### 2.7 Let the platform own anti-cheat

Both leaderboards submit through a single run-end path, with server-side z-score detection, a
submission rate limit and trust-score decay — **all configured, none implemented.**

**Reasoning:** a solo developer cannot win an arms race against a browser devtools console, and any
time spent trying is taken from the game. The three debug handles the build *does* ship exist so
singletons survive hot-reload, and I decided consciously to keep them: the leaderboard can't be
reached except at a genuine run end, and the platform referees the rest.

✅ **The decision was to make the cheating boring rather than impossible.**

### 2.8 A daily reward sized against the game, not against engagement targets

The reward track is 7 days: **8 / 10 / 12 / 15 / 18 / 22 / 40 gems**, day 7 flagged as a milestone.

**125 gems a week. At 4 gems per wave cleared, that's about one 31-wave run** — against a live best
of 106. ✅ **Deliberately below what playing well pays.** A login bonus that outpaces the game
teaches players to log in instead of play.

It also **never resets**. Not calling it a streak was a copy decision following a design one: a
streak punishes a missed day, and punishing absence is a strange way to invite someone back.

### 2.9 Fixing the right version of a problem

Two small decisions that stand in for a habit:

- A recipe card clipped its description text. The obvious fix is a bigger card. **The chosen fix was
  a line clamp** — but I specified the clamp value from counting characters, and the implementation
  measured the actual box and found **12 of 22 cases still overflowed**. It shipped one line looser
  than I asked for. ✅ **The measurement beat my estimate, and the right call was to take it.**
- A telemetry event I named `recipe_completed` actually fired on every shard award, usually with a
  completion count of zero. **It was renamed while the build was still private**, because event
  names freeze the moment they ship. **Naming something for its rare case is a bug with a long
  tail.**

---

## Part 3 — What went wrong, and what it's worth

The genuinely useful part of a portfolio entry.

### 3.1 I shipped a retention feature nobody could reach

Covered in 2.3, and worth isolating because of **how** it got through. The implementation was
correct. The live verification passed. The acceptance criteria were met. **The test asked "is this
reachable from the main menu?" and the answer was yes.** Nobody asked whether the main menu was
reachable from a cold boot — a fact I had personally verified, from source, and written down days
earlier in the same document that announced the feature as shipped.

✅ **The transferable rule: when you add something for a player to find, the acceptance test starts
where the player starts.** "Is it reachable?" isn't a test until the starting point is named.

### 3.2 A config file in the repo is not the config in production

A daily leaderboard period was added to the config file, the client shipped a "Today" tab in two
languages and submitted scores to it, and **the period never existed on the service** — because the
live tags still pointed at a server config uploaded twelve days earlier. **Zero submissions in
thirteen days**, and the file passed its integrity check every single round, because the file had
never changed. It just wasn't the one running.

✅ **An integrity check proves a file didn't change. It says nothing about whether it's in force.**

### 3.3 A cleanup pass that would have destroyed the art

An orphaned-asset scan returned **62** assets to delete. The correct answer was **44**. The extra
18 were the chef portrait system and every district backdrop — addressed by keys built from
template literals, so a literal search for their names finds nothing.

✅ **Caught before it shipped, by asking what else could construct an asset key.** It's the clearest
case I have of a measurement being precise and wrong.

### 3.4 Losing fifth place in the last 24 hours

We trailed 5th by **16** daily players on day 13 and by **112** at the close — the game ahead took
121 players on the final day to our 25. **The ranking metric rewarded sustained promotion and I
spent the final days polishing.** For a metric-ranked jam, the last 48 hours of *distribution* are
worth more than the last 48 of *craft*.

---

## Part 4 — How it was built

Solo, with AI agents in specialist roles — implementation, art, audio, marketing — coordinated
through a planning layer, with every decision committed to the repository alongside the code.

**The process rules that mattered**, and the reason the artefacts are trustworthy:

- **Every agent report is recorded verbatim before anyone evaluates it**, so the record is the
  agent's own words rather than a summary of them.
- **Claims are verified from source, never from the report.** Published builds were checked by
  hashing the live bundle against the local one, not by trusting a deploy message.
- **Sealed files and a five-number regression baseline**, diffed every round.
- **A secret scan with a planted positive control** before every commit — if the control doesn't
  trip, the scan didn't run.
- **153 recorded lessons**, the majority of them my own errors, kept in a file written to be useful
  rather than flattering.

✅ **That last one is the part I'd point at.** The repository contains the mistakes, with dates, and
what each one cost. A clean history would have been easier to produce and worth considerably less.

---

**Live:** <https://w.run/puneetmakes/spice-expert-ramu> · **Source and full design record:**
[github.com/OffroadingGamer/Spice-Expert-Ramu](https://github.com/OffroadingGamer/Spice-Expert-Ramu)
