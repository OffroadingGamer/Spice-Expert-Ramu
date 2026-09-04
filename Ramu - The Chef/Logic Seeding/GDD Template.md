# GDD — September Jam Entry

> Fill-in-the-blank working document for this project.
> Governed by [GDD Guidelines.md](GDD%20Guidelines.md); scoped per **§6** (streamlined
> outline, fillable in ~1 hour) and **§5** (write it down to eliminate bad ideas
> *before* spending effort). Rules: [Guidelines.md](Guidelines.md) ·
> Production: [Jam-Day-Runbook.md](Jam-Day-Runbook.md)

**Status:** ⬜ Draft ⬜ Frozen  **Filled on:** `[ date / time ]`  **Author(s):** `[ ]`

---

## How to use this document

| Convention | Meaning |
|---|---|
| `[ ... ]` | Fill in. Empty brackets = undecided. |
| ⬜ / ✅ | Decision checkbox |
| **🔒 FREEZE** | Locked at end of pre-production (Guidelines §9). Changing it after ripples through everything. |
| **⏭ DEFER** | Deliberately not decided now. Revisit only if the core survives contact. |
| ⏱ | Time box. **Exceeding it is the failure mode this document exists to prevent.** |

**Total fill time: 75 minutes.** If a block stalls you for more than its time box,
write `[ TBD ]` and move on — an unfilled block is cheaper than a late publish.

**Fill order:** Part 0 → Part 1 → §1, §3, §10 → §5, §13 → everything else → Part 3 freeze.

---

# Part 0 — Jam constraints (the box you must build inside)

⏱ **5 min** — mostly transcription, not decisions.

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
| Official kit chosen | ⬜ `september-jam-tower-defense` ⬜ `september-jam-bare-bones` ⬜ Adventure Studio |
| Kit init command | `rundot jam init [ kit-slug ] jam-entry` |
| Second entry? (Story/Video hedge) | ⬜ Yes ⬜ No |

> **Which kit?** Tower Defense = a working defend-the-thing loop on day one, fastest
> path to publish, but the job must justify defending something. Bare Bones = full
> freedom to build the job's own loop, costs you hours you may not have.
> **Job first, kit second** — pick the job, then the kit that carries it.

### Personal constraints

| Constraint | Value |
|---|---|
| Realistic hours available across 11 days | `[ ]` |
| Hours available on **day one** (drives publish time) | `[ ]` |
| Team members + credited names | `[ ]` |
| Skills present | `[ ]` |
| Skills absent → must be bought, faked, or designed around | `[ ]` |

---

# Part 1 — Idea elimination (Guidelines §5)

⏱ **20 min.** Generate at least 3 candidates. **Do not skip to one idea.** The point
is to kill ideas on paper, where killing them is free.

### Candidate table

| # | One-line concept | Fits theme? | Day-1 shippable? | Reason to return **tomorrow**? | 10-sec explainable? | Verdict |
|---|---|---|---|---|---|---|
| A | `[ ]` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ Keep ⬜ Kill |
| B | `[ ]` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ Keep ⬜ Kill |
| C | `[ ]` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ Keep ⬜ Kill |

**Any "no" in columns 1 or 2 is an automatic kill.** Off-theme is ineligible;
not-day-1-shippable costs scoring days you can never recover.

### Elimination notes
Why each killed idea died — so it doesn't get resurrected at 2am on day 6:

```
[ ]
```

### 🔒 FREEZE — Selected concept

**One sentence, plain language. If you can't write it, it isn't an idea yet:**

```
[ ]
```

**Why this one beats the others:**

```
[ ]
```

---

# Part 2 — The GDD

*Canonical section order from Guidelines Part 2. Jam scope noted per section.*

## 1. Packaging ⏱ 5 min

| Field | Value |
|---|---|
| **Title** | `[ ]` |
| **Tagline** (≤ 10 words, appears on your entry card) | `[ ]` |
| Splash art / key image concept | `[ ]` |
| Name check — searchable? not taken? | ⬜ |

> Title and tagline are what a scroller sees before deciding to play. They are
> distribution assets, not decoration.

## 2. Table of Contents

⏭ **DEFER** — not needed at jam length (Guidelines §2 applies to detailed GDDs).

## 3. Introduction / General Overview ⏱ 5 min

**Elevator pitch — lead with gameplay, not story or mood** (Guidelines §3 pro-tip).
This becomes your `rundot init --description` and your share caption.

```
[ ]
```

## 4. Inspirations ⏱ 5 min

| Source | What exactly to borrow | Not borrowing |
|---|---|---|
| `[ ]` | `[ ]` | `[ ]` |
| `[ ]` | `[ ]` | `[ ]` |

Non-game / real-world inspiration (pop culture, mechanics from life):

```
[ ]
```

> Borrow *solved* problems. A jam is the wrong place to invent a control scheme.

## 5. Player Experience (UX) ⏱ 5 min

**The player should feel:** `[ ]`

| Axis | Choice |
|---|---|
| Tone | ⬜ Cozy ⬜ Tense ⬜ Funny ⬜ Melancholy ⬜ `[ ]` |
| Pace | ⬜ Twitch ⬜ Considered ⬜ Idle/ambient |
| Session length | `[ ]` seconds/minutes — **target: short enough to replay daily** |
| Difficulty posture | ⬜ Forgiving ⬜ Punishing ⬜ Scaling |

**First 30 seconds — what happens, beat by beat:**

```
1. [ ]
2. [ ]
3. [ ]
```

> This is the highest-leverage block in the document. Most drop-off is here.

## 6. Platform ⏱ 1 min

Fixed by the jam: **RUN — web + iOS + Android.** Design decision that follows:

| Decision | Value |
|---|---|
| Orientation | ⬜ Portrait (recommended — phone-first) ⬜ Landscape |
| Primary input | ⬜ Single tap ⬜ Drag ⬜ Multi-touch ⬜ `[ ]` |
| One-handed playable? | ⬜ Yes ⬜ No |

## 7. Software ⏱ 2 min

| Role | Tool |
|---|---|
| Build path | ⬜ Game Studio (browser) ⬜ **rundot CLI + Claude Code (VSCode)** ⬜ Adventure Studio |
| Kit / stack | `[ ]` (kit-dependent; `rundot-new-game` shell = Vite + Pixi.js v8 + React 19 + Tailwind v4) |
| Art | `[ ]` |
| Audio | `[ ]` |
| SDK features used | `[ ]` |

## 8. Genre ⏱ 2 min

| Field | Value |
|---|---|
| Genre | `[ ]` |
| Dimension | ⬜ 2D ⬜ 2.5D ⬜ 3D |
| Sub-genre / modifier | `[ ]` |
| Closest comparable title | `[ ]` |

## 9. Target Audience / Market Research ⏱ 3 min

| Field | Value |
|---|---|
| Who is this for | `[ ]` |
| Where they'll find it | Jam Discord · Reddit · X · `[ ]` |
| Why they'd share it | `[ ]` |

> Jam-specific: your audience is **other jammers and the RUN community first.**
> Reciprocal play is the largest early traffic source.

## 10. Concept ⏱ 15 min — the core of this document

### 10.1 🔒 Core loop
The 3–5 actions repeated every session. If it needs more than 5 steps, it's too big.

```
1. [ ]
2. [ ]
3. [ ]
4. [ ]
```

### 10.2 🔒 Themes
How the jam theme is expressed *mechanically*, not just cosmetically:

```
[ ]
```

> A reskin reads as off-theme to judges. The theme should be legible in what the
> player *does*.

### 10.3 🔒 Primary mechanics
Must exist for the core loop to function. **Cap at 2 for a jam.**

| # | Mechanic | Player verb | Build cost |
|---|---|---|---|
| 1 | `[ ]` | `[ ]` | `[ ]` |
| 2 | `[ ]` | `[ ]` | `[ ]` |

### 10.4 Secondary mechanics
Augment but aren't critical. **Everything here is cuttable on day 8.**

| # | Mechanic | Cut if behind? |
|---|---|---|
| 1 | `[ ]` | ⬜ |
| 2 | `[ ]` | ⬜ |

### 10.5 Tertiary mechanics
⏭ **DEFER** — list only, build nothing before the return loop works.

```
[ ]
```

### 10.6 Combat / Puzzle / Quest system
Only if the core loop demands it. Otherwise write `N/A` and move on.

```
[ ]
```

### 10.7 Mockups
Placeholder art / paper sketch / screenshot reference clarifying the vision:

```
[ ]
```

### 10.8 Story
Jam scope: a premise, not a script. Two sentences maximum.

```
[ ]
```

### 10.9 🔒 Return loop — *jam-critical addendum*

> Not in Guidelines Part 2, added because it is **the score multiplier**: a player
> returning across 8 days scores 8×. This block is worth more than §11–13 combined.

| Question | Answer |
|---|---|
| Why open it tomorrow? | `[ ]` |
| What is different tomorrow? | `[ ]` |
| What carries over between sessions? | `[ ]` |
| What pulls them back (notification hook)? | `[ ]` |

Mechanics to install (copy-in TypeScript, don't hand-build):

- ⬜ `rundot-feature-daily-rewards` — trusted server clock, forgiving track
- ⬜ `rundot-feature-daily-quests` — day-rolled objectives
- ⬜ `rundot-feature-notifications` — re-engagement reminders
- ⬜ `rundot-feature-save` — progress persistence
- ⬜ `rundot-feature-stats` — long-horizon goals

## 11. Art ⏱ 5 min

| Field | Value |
|---|---|
| **Style** | `[ ]` |
| Why this style is *fast* to produce | `[ ]` |
| Colour palette | `[ ]` |
| Accessibility (colour-blind safe?) | ⬜ Checked |
| **VFX** — juice on interaction/pickup/state change | `[ ]` |
| **Lighting** / post-processing | `[ ]` or ⏭ DEFER |
| Asset source | ⬜ AI-generated (`rundot generate`) ⬜ Hand-made ⬜ Licensed `[ ]` |

> Choose a style you can produce at volume, not the one you most admire.

## 12. Audio ⏱ 3 min

| Field | Value |
|---|---|
| **Music** — what plays, and *when* it matters | `[ ]` |
| **SFX** — minimum viable set | `[ ]` |
| Voice / vocal | ⏭ DEFER unless core to the hook |
| Mute control present? | ⬜ (phone players often play muted — **the game must work silently**) |

## 13. Game Experience ⏱ 8 min

### 13.1 UI
| Question (Guidelines §13.1) | Answer |
|---|---|
| What will the UI look like? | `[ ]` |
| Required elements | `[ ]` |
| Available at all times? | `[ ]` |
| Placement — avoiding overload | `[ ]` |
| Diegetic or overlay? | `[ ]` |

Screens needed: ⬜ Title ⬜ Game ⬜ Pause ⬜ Game-over ⬜ Rewards ⬜ `[ ]`

### 13.2 Controls & Feel
| Field | Value |
|---|---|
| Input scheme | `[ ]` |
| Button/gesture count (fewer = better on phone) | `[ ]` |
| Game feel notes (juice, screenshake, haptics) | `[ ]` |
| Safe-area / thumb-reach checked | ⬜ |

### 13.3 Integration
⏭ **DEFER** most. Jam-relevant only:

- ⬜ Share button surfacing the entry link
- ⬜ Score/leaderboard surfacing
- ⬜ `[ ]`

## 14. Market Requirements ⏱ 8 min

**MoSCoW scope contract.** Pre-filled rows are jam-mandatory — the rest is yours.

| ID | Requirement | Rating |
|---|---|---|
| 1 | Built from an official jam kit / Adventure Studio | **M** |
| 2 | Playable on a phone, portrait, one hand | **M** |
| 3 | Public + approved **on day one** | **M** |
| 4 | Fun reached within 30 seconds, unaided | **M** |
| 5 | A reason to return tomorrow | **M** |
| 6 | All team members credited | **M** |
| 7 | Works with sound off | **S** |
| 8 | `[ ]` | `[ ]` |
| 9 | `[ ]` | `[ ]` |
| 10 | `[ ]` | `[ ]` |

**MVP definition — the smallest thing worth publishing on day one:**

```
[ ]
```

**Stretch goals** (only after every M is green):

```
[ ]
```

**Marketing** — where and how often you post:

```
[ ]
```

| Field | Value |
|---|---|
| **Delivery** — target first public deploy | `[ ]` (**target: Sep 3, before sleep**) |
| **Post-launch** — Sep 14–18 judging-window plan | `[ ]` |

## 15. Technical Requirements ⏱ 5 min

### 15.1 Known issues / risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| `[ ]` | `[ ]` | `[ ]` |
| Credits run out | Med | Ping Discord for a top-up |
| Kit constrains the design | `[ ]` | `[ ]` |

### 15.2 Systems
Discrete swappable modules to build:

| System | Owner | Priority |
|---|---|---|
| `[ ]` | `[ ]` | `[ ]` |

### 15.3 Work packages
Mapped to [Jam-Day-Runbook.md](Jam-Day-Runbook.md) checkpoints:

| # | Package | Days | Runbook CP | Done |
|---|---|---|---|---|
| 1 | Scaffold + clean build | Sep 3 | CP2 | ⬜ |
| 2 | **Rough playable → public** | Sep 3 | **CP3** | ⬜ |
| 3 | Mobile + FTUE + stability | 2–3 | CP4 | ⬜ |
| 4 | Return loop | 3–5 | CP5 | ⬜ |
| 5 | Distribution cadence | 4–14 | CP6 | ⬜ |
| 6 | Craft pass (Editor's Pick) | 8–10 | CP7 | ⬜ |
| 7 | Final deploy verified | Sep 14 | CP8 | ⬜ |
| 8 | Judging-window sharing | 14–18 | CP9 | ⬜ |

### 15.4 Tasks & owners
| Person | Domain | Accountable for |
|---|---|---|
| `[ ]` | `[ ]` | `[ ]` |

### 15.5 Activities
Daily goals:

```
[ ]
```

---

# Part 3 — Scope contract

⏱ **5 min.** The section that does the actual work (Guidelines §8.3).

### 🔒 The cut list — explicitly NOT in this game

Write these down now, while thinking is cheap. Anything not listed in §10.3 or
marked **M** in §14 is a candidate.

```
1. [ ]
2. [ ]
3. [ ]
4. [ ]
5. [ ]
```

> Re-read this list on day 6 and day 9. Feature creep arrives disguised as a good idea.

### Trigger rules — decided in advance, executed without debate

| If… | Then… |
|---|---|
| Not publishable by end of Sep 3 | Cut to the smallest playable thing and publish anyway |
| A **primary** mechanic isn't fun by day 3 | Replace the mechanic, keep the shell |
| Behind on day 8 | Cut all §10.4 secondary mechanics |
| Return loop not live by day 6 | Drop the craft pass; return loop outranks polish |
| `[ ]` | `[ ]` |

### 🔒 FREEZE (Guidelines §9)

Locked at end of pre-production: **core loop (§10.1), theme expression (§10.2),
primary mechanics (§10.3), return loop (§10.9)**.

Everything else stays living. Changing a frozen item ripples through every
downstream area — that is the cost being avoided.

| Field | Value |
|---|---|
| Frozen on | `[ date / time ]` |
| Frozen by | `[ ]` |
| Target: within **90 minutes** of the theme reveal | ⬜ Met ⬜ Missed |

---

# Appendix — Decision log

Living record. Add a row whenever a frozen item is deliberately broken, so the
reason survives the sleep deprivation.

| Date | Decision | Reason | Impact |
|---|---|---|---|
| `[ ]` | `[ ]` | `[ ]` | `[ ]` |
