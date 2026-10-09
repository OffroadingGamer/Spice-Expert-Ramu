# Spice Expert: Ramu

**A tower-defence game about a line cook, built solo for [RUN's September Jam 2026](https://run.world/jams/september-2026-jam).**
Theme: *"Back to Work: any job, and the real story behind it."*

▶ **Play it:** <https://w.run/puneetmakes/spice-expert-ramu>

**6th of 100 entries — 638 daily unique players, 942 plays, 15 days in jam.**
Still live: 104 deployed versions, 25 build rounds, 100% crash-free on the current build.

---

Tickets come down the rail. You set up stations — grill, prep board, tandoor, fryer —
to cook each dish before it reaches the pass. Let one through and a customer walks out.

The kitchen is the job, and the game is the part of it nobody puts on a menu: the
rush, the rail, and the arithmetic of keeping a line moving.

The theme isn't a skin. **A customer who reaches the pass is a walkout** — the thing the
game punishes is the thing the job punishes, so nothing in the loop needed renaming.

---

## Start here

| Read | For |
|---|---|
| **[portfolio.md](Ramu%20-%20The%20Chef/handover/portfolio.md)** | **The design decisions and what they returned** — the balance baseline as a regression test, the economy cliff at level 11, the measured funnel, and the three things that went wrong |
| **[Transfer.md](Ramu%20-%20The%20Chef/handover/Transfer.md)** | **Platform and jam learnings**, written to be carried into the next jam — RUN tag behaviour, SDK traps, analytics pitfalls, and a day-one checklist |
| [Retro.md](Ramu%20-%20The%20Chef/docs/Retro.md) | 153 dated lessons, most of them mistakes, kept in full |

---

## What is in this repository

This is a jam entry shipped in public, and the planning is committed alongside the
code — including the parts that went wrong.

| Path | Contents |
|---|---|
| `jam-entry/` | The game. Vite · Pixi.js v8 · React 19 · Tailwind v4, from RUN's `september-jam-tower-defense` kit |
| `Ramu - The Chef/docs/` | The working documents — design, plan, specs, retrospective, task board |
| `Ramu - The Chef/references/` | Layout references and bug screenshots |
| `Logic and DIscussions/` | Jam guidelines and the day-one runbook |

### The documents

| Doc | Answers |
|---|---|
| [GDD.md](Ramu%20-%20The%20Chef/docs/GDD.md) | What the game is — frozen design |
| [Plan.md](Ramu%20-%20The%20Chef/docs/Plan.md) | What we intend to do, in what order, by when |
| [Specs.md](Ramu%20-%20The%20Chef/docs/Specs.md) | How it is built — contracts, budgets, risks |
| [Ideas.md](Ramu%20-%20The%20Chef/docs/Ideas.md) | Proposals, the decision taken on each, and the open debts |
| [Retro.md](Ramu%20-%20The%20Chef/docs/Retro.md) | What actually happened — findings, corrections, lessons |
| [Tasks.md](Ramu%20-%20The%20Chef/docs/Tasks.md) | Where we are — sprint × phase board |
| [Implementation Handover Record.md](Ramu%20-%20The%20Chef/docs/Implementation%20Handover%20Record.md) | Every build round handed over, and every return verified |
| [Agent Returns.md](Ramu%20-%20The%20Chef/docs/Agent%20Returns.md) | Every agent's report, verbatim and unedited |

`Retro.md` is the interesting one. It is written to be useful rather than flattering,
and it keeps the mistakes: a title that overflowed twice because glyph widths were
estimated instead of constrained, a 16 MB preload shipped to an audience that turned
out to be three-quarters mobile, an art pass that replaced names and palette when
it was supposed to replace the content, and a retention feature placed on the one
screen the game never boots into.

---

## How it holds together

The simulation is a **pure deterministic engine kept separate from rendering**, which is
what makes the headless balance verifier possible:

```
npm run balance
→ fox-spam 35 · balanced 36 · miser 11 · pad0-rush 4 · maxed-meta 90
```

Five scripted play styles, five levels-died-on, each one a contract rather than an
observation — `balanced` must lose no lives before level 12, `miser` must still lose,
`maxed-meta` must die between 85 and 110. **The five numbers stayed byte-identical across
24 consecutive build rounds**, so any change that moved one unintentionally showed up in a
single line.

Paired with a short list of **sealed files** — the engine and the four data tables that no
routine change may touch — it is what made it safe to keep shipping quickly.

---

## Running it locally

```bash
cd jam-entry
npm install
npm run dev        # Vite dev server; RUN SDK calls are mocked
npm run build      # production build into dist/
npm run balance    # headless balance simulation over the wave data
npm run art:resize # re-derive public/images from the 1024px masters in art-source/
```

Deploying requires the `rundot` CLI and an authenticated RUN creator account.

---

## Built with

**[Pixi.js](https://pixijs.com/) v8** · **React 19** · **Vite** · **Tailwind CSS v4** ·
**TypeScript** · the **[RUN.world](https://run.world) SDK**, scaffolded from RUN's
official tower-defence kit.

English and **हिन्दी** throughout — 395 string keys in each table, symmetric difference
zero, verified by executing the real modules rather than searching the text.

---

## Credits

Solo entry by **[OffroadingGamedev](https://w.run/puneetmakes)**.
Planning and production assisted by Claude Code.

Game art generated with `rundot generate image`.
