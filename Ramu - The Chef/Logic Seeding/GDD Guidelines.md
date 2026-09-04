# GDD Guidelines

> Briefing, rules, and conventions that govern this project.
> Part 1 defines what a GDD *is* here, and exists to impose a constraint structure that limits overscoping and analysis paralysis.

---

## Part 1 — Foundational Definitions

### 1. What is a GDD?

A guiding vision, used throughout the game development process.

### 2. What is the purpose of a GDD?

To unambiguously describe the game's selling points, target audience, gameplay, art, level design, story, characters, UI, assets, etc.

Every game part requiring development should be included by the developers in enough detail for the respective developers to implement it.

### 3. Why is a GDD referred to as a living document?

Because it needs to be able to grow and change over time as the need arises.

### 4. When to use a GDD?

A GDD allows all members of the team to be on the same page with respect to expectations and scope, so maintaining a good one is almost mandatory.

Even for solo devs, a GDD is an important tool for organizing thoughts and scoping out the project.

Ultimately, the GDD guides every stage of the game's life cycle — from *pre-production planning* through *post-launch updates*. It keeps the vision consistent and ensures future work serves the original intent.

### 5. Should a GDD be used in game jams?

Yes. Taking the time to write a GDD can actually *speed up* production of a jam entry by getting ideas out of the head and onto paper.

By writing things out, ideas can be A/B tested to decide what works and what doesn't **before** overspending time, energy and resources (writing code / making assets) — since some ideas can be eliminated outright as either not fitting the theme, being too ambitious, or not being interesting enough to pursue.

### 6. What becomes of the GDD for smaller and simpler projects?

A streamlined, back-of-the-envelope outline suffices — something far shorter that can be filled out in around an hour. Once there is something to work with, progress can continue apart from the shortened GDD, and faster.

### 7. What key factors matter for GDD formulation on larger projects?

More thought, attention and care — so that all the major details are fleshed out.

The key factors are everything from **§10 (Concept) onwards** in Part 2 — Concept, Art, Audio, Game Experience, Market Requirements and Technical Requirements. On a large project these are the sections that must be genuinely worked through rather than sketched.

### 8. Why use a GDD?

1. **Risk management** — Anticipate upcoming challenges early, leaving time to solve them or recruit someone who can, well before core development begins.
2. **Communication tool** — Every team member, from artists to programmers to marketers, understands the game the same way. Crucial to a cohesive project and team.
3. **Scope limitation** — Defines what *is* in the game and what is *not*, keeping the project focused and free of feature creep.

### 9. When should a GDD be frozen?

**Trigger: end of pre-production.**

First, to be clear: a freeze does **not** make it an untouchable document forever — that's a lie. It only means the major elements of the game are no longer subject to change, e.g. *core mechanics*, *story arcs*, *primary features*.

Setting these boundaries is crucial, because constant changes to the "core" cause a ripple effect: delays, increased costs, scope creep, and impact on every other area of development.

> *"Measure twice, cut once."*

---

## Part 2 — GDD Structure

The canonical section order for a GDD on this project. Smaller projects collapse this into the streamlined outline described in §6; larger ones expand each heading.

### 1. Packaging

The **header / hook** — the barest of bare-bones packaging for the game: *title*, *tagline*, *splash art*.

It gives the first impression to anyone who looks at the document or the game, and must convey exactly what's going on **at a glance**.

### 2. Table of Contents

Required for a detailed GDD. It keeps things organized, showcases all the different sections within the GDD, and allows quick navigation.

### 3. Introduction / General Overview

A summary of the game acting as its **elevator pitch** — the same job as the back of a book, a Steam page description, or social media copy.

> **Pro-tip:** Short descriptions are about explaining things that aren't story and aren't mood. The main priority is to highlight the **gameplay**.

### 4. Inspirations

Other game references that could be emulated when making the game — existing titles with features or systems that already work, to be studied or replicated. Not necessarily games; real-world inspirations such as pop culture also belong here.

This isn't exhaustive, and newer inspirations can be added progressively during production — but it must serve as a baseline that frames the vision and direction of the game.

### 5. Player Experience (UX)

How the player is expected to **feel** as they play. Comparable UX decisions:

1. Horror game vs. cozy game
2. Action-adventure vs. puzzle
3. Immersive sim — controller vs. keyboard & mouse vs. AR/VR
4. Child-safe vs. souls-like
5. Length of gameplay — a few hours vs. a couple of weeks

### 6. Platform

A generic disclosure of the target audience's platform — PC vs. mobile, itch.io vs. Steam, etc.

### 7. Software

A list of the tools and engines used across the project. E.g. Unity / Unreal / Godot, Photoshop, Blender, Audacity.

### 8. Genre

The category or specific genre the project caters to. Decisions like 2D / 2.5D / 3D, normal / VR / AR, or cozy / horror are defined here to stick to a baseline target expectancy.

### 9. Target Audience / Market Research

Answers the important question: **who is the game for?**

Knowing what people like by tapping into the cultural *zeitgeist* helps figure out what to make. Research analysis here determines what kind of games people are looking for. The game is optimized against market research on likes and dislikes, while structuring a category to fit into — which helps overall discoverability.

### 10. Concept

1. **Core loop** — What the gameplay loop is when broken down to its essence: the things the player does over and over again, every session. Essential to the identity of the game; it laser-focuses on the aspects that are absolutely essential and cannot be reduced or taken away.
2. **Themes** — The concepts, ideas or symbols that recur throughout the work. It may not have every last detail figured out, but it defines goals, parameters and a plan of action for what needs to be worked on — specific and focused.
3. **Primary mechanics** — The main mechanics through which the player achieves and progresses through the core loop. Must leave room for the prototyping stage to hone in on actual feel, since some things are only realized during A/B testing.
4. **Secondary mechanics** — Things that augment the primary mechanics but aren't strictly critical to achieving the goal. E.g. consumables, special rooms built around a secondary mechanic.
5. **Tertiary mechanics** — Similar to secondary but further removed. Nice to have, not critical.
6. **Combat / Puzzle / Quest** — Combat system, AI/NPC behaviour, puzzle system, quest system. Tends to get updated during production as systems and enemies are designed, but initially gives a high-level sense of direction for these systems.
7. **Mockups** — Temporary or placeholder art (spritesheets, GIFs, videos) that put the information into a concise yet descriptive perspective. At this stage the idea is purely to clarify vision and direction as much as possible.
8. **Story** — Where the game's story (if any) lives. A fully-fledged story isn't expected here, but more clarification is better. Sections here act as the outline of a novel; a complex story requires a separate file — hopefully with concept art — so the big picture can be nailed down quickly.

### 11. Art

1. **Design** — Overall direction of the art: art style (pixel / vector graphics), shader preferences (cel-shaded / hyper-realistic). The same basic mechanics under different art styles can produce two very different games. Depending on genre, accessibility factors such as colour blindness must be considered. Concept art references and mockups help convey what is being aimed for.
2. **VFX** — Visual effects; contributes to the game's overall juice — particle effects, flashes, squash & stretch. Generally effects for interaction, pickup or state change. Some VFX bleeds into UI; depending on its nature it may live under UI instead.
3. **Lighting** — Decisions around lighting. Not always applicable — e.g. 2D games on a lit/unlit shader approach — but 3D games generally include it. Post-processing data, especially lighting data, goes here too. These are the design constraints to scope for before real-world limitations take effect.

### 12. Audio

1. **Music** — Crucial not just for the soundtrack or overall vibe, but for **how and when** that music plays a role in the game itself.
2. **SFX** — Sound effects. Without them the audio-side feedback feels hollow and dead by comparison. They sometimes go viral and so warrant extra emphasis. Requirements vary from game to game, but omitting them is almost never a good idea.
3. **Voice acting / cinematic cutscenes** — Much more of a subjective requirement. Ranges from full dialogue to SFX voiceovers or something as simple as screams or a vocalist solo.

### 13. Game Experience

A detailed breakdown of the player's experience.

1. **UI** — The meta information and the feedback it provides to players, often as a HUD. May sit in corners (HP/MP), along borders (hot bar), or centre-screen (scopes). UI elements may also appear in the game world itself, e.g. hit counters above an entity. Menu and start screens fall under UI too.
   *Diegetic UI* is a fancy way of saying it exists seamlessly as part of the in-game world rather than as an abstract overlay — something the character interacts with rather than just the player.
   Questions this segment must answer:
   - What will the UI look like?
   - What elements are required?
   - Will the player have access to it at all times?
   - Where should it be placed to avoid information overload?
   - Should elements be disabled during cutscenes?

   Good UI requires a lot of testing and tweaking during production, but it is not something to discount from the GDD — good UI can make or break the game.
2. **Controls & Feel** — Includes game juice and feel, but also something as simple as controls. Input mechanisms (keyboard & mouse, gamepad, touchscreen, motion, VR) are specified here, along with button mapping and remapping — fewer buttons implies tighter UX constraints. Menu design also lives here: start screen, pause screen, game-over screen. Menus serve a dual purpose: conveying information *and* being a visual hook. Oddball or unique diegetic methods fall here as well, where applicable.
3. **Integration** — Plans to extend playability: streamer modes, randomizers, one-life runs, chaos mode, speedrun auxiliaries (timers), skip cutscenes, Twitch & YouTube integrations, localization. These are optional luxuries dependent on core-loop development, but scoping them out early from a design perspective is a good habit. Trending examples include races, bingo, and hide & seek.

### 14. Market Requirements

Top-level ideals, characterized by the following standards:

*Example table:*

| ID | Market Requirement                | Rating |
| -- | --------------------------------- | ------ |
| 1  | Playable on PC                    | M      |
| 2  | Integrated support for controller | M      |
| 3  | Playable on console               | C      |
| 4  | Local co-op                       | W      |

1. **Must have (M)** — Items/tasks that need to be present to hit the market.
2. **Should have (S)** — Items/tasks that ensure the game is of expected quality amongst its peers.
3. **Could have (C)** — Items/tasks that increase the attractiveness of the product.
4. **Would have / want (W)** — Items/tasks that would be great to have but could carry disproportionate cost.
5. **MVP** — Minimum viable product. A genuine baseline target of a successful prototype/game.
6. **Stretch goals** — Goals which might be applicable to delay expectancy.
7. **Marketing** — The strategic approach to marketing the game, from demo plans through streamers to running an ad campaign.
8. **Delivery** — Estimated launch date and predictions, including pre-order benefits and wishlist checkpoints.
9. **Post-launch** — Planning for after the product ships: feedback, bug fixing, etc.

### 15. Technical Requirements

Systems, work packages, activities and tasks. These ensure the game is not only desirable but also **viable and technically feasible**, creating a robust framework for success. They form the *what*, *who* and *how* of the project.

1. **Known issues** — Existing problems, bugs, limitations and challenges.
2. **Systems** — Complex macro elements that need to be built and therefore require further depth and planning. Discrete modules built in isolation that can be swapped in or out like components.
3. **Work packages** — Discrete milestones/phases of the project. Progressive: each is tested and overlaid before moving on to the next. E.g. pre-production pass, gameplay pass, story pass.
4. **Tasks** — Individual domains assigned to each team member: scopes and specializations, accountability, metrics, target goals and requirements.
5. **Activities** — Daily/weekly goals within each task; helps outline the production timeline.

**Project variables** — Time, Cost, Quality, Scope, Risk, Benefits, People.

```text
Value = (Benefits / Cost) × floating Risk
```

**Project management flow:**

| Layer      | Stages                                   |
| ---------- | ---------------------------------------- |
| Direction  | Initiate → Escalation / Governance       |
| Management | Planning → Measures & Compliance → Close |
| Delivery   | Development & Testing                    |

---

## Part 3 — Project Brief

*TBD*

## Part 4 — Project Rules

*TBD*

## Part 5 — Conventions

*TBD*
