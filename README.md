# Spice Expert: Ramu

**A tower-defence game about a line cook, built solo for [RUN's September Jam 2026](https://run.world/jams/september-2026-jam).**
Theme: *"Back to Work: any job, and the real story behind it."*

▶ **Play it:** <https://w.run/puneetmakes/spice-expert-ramu>

---

Tickets come down the rail. You set up stations — grill, prep board, tandoor, fryer —
to cook each dish before it reaches the pass. Let one through and a customer walks out.

The kitchen is the job, and the game is the part of it nobody puts on a menu: the
rush, the rail, and the arithmetic of keeping a line moving.

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
| [Retro.md](Ramu%20-%20The%20Chef/docs/Retro.md) | What actually happened — findings, corrections, lessons |
| [Tasks.md](Ramu%20-%20The%20Chef/docs/Tasks.md) | Where we are — sprint × phase board |

`Retro.md` is the interesting one. It is written to be useful rather than flattering,
and it keeps the mistakes: a title that overflowed twice because glyph widths were
estimated instead of constrained, a 16 MB preload shipped to an audience that turned
out to be three-quarters mobile, and an art pass that replaced names and palette when
it was supposed to replace the content.

---

## Running it locally

```bash
cd jam-entry
npm install
npm run dev        # Vite dev server; RUN SDK calls are mocked
npm run build      # production build into dist/
npm run balance    # headless balance simulation over the wave data
```

Deploying requires the `rundot` CLI and an authenticated RUN creator account.

---

## Built with

**[Pixi.js](https://pixijs.com/) v8** · **React 19** · **Vite** · **Tailwind CSS v4** ·
**TypeScript** · the **[RUN.world](https://run.world) SDK**, scaffolded from RUN's
official tower-defence kit.

The simulation is a pure deterministic engine kept separate from rendering, which is
what makes the headless balance verifier possible.

---

## Credits

Solo entry by **[OffroadingGamedev](https://w.run/puneetmakes)**.
Planning and production assisted by Claude Code.

Game art generated with `rundot generate image`.
