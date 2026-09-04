# Retro — Spice Expert: Ramu

> **Backward-looking.** What actually happened, including the things that went wrong.
> Companion docs: [GDD.md](GDD.md) (what the game is) · [Plan.md](Plan.md) (what we
> intend) · [Specs.md](Specs.md) (how it is built).
>
> **Update rule:** append on every iteration, **progressive or regressive**. A day
> where nothing shipped is still an entry — the reason it did not ship is the most
> valuable thing in this document. Never rewrite history to look tidier.

**Last updated:** Sep 4 2026, 13:24 IST (read from the system clock)

---

## 0. Standing exclusions — READ BEFORE ANY DEPLOY OR AUDIT

Two games exist on the RUN account `offroadinggamedev@gmail.com`. **Neither is the jam
entry. Both stay unlisted. Ignore both.**

| Game ID | Name | Created (IST) | Why it exists | Disposition |
|---|---|---|---|---|
| `eN9j…lpwb` *(redacted — public repo)* | 2D Starter Kit (pixi.js) | 03-09-2026 21:52 | Platform exploration before the jam opened. The guidelines explicitly encourage a throwaway project during the wait | **Ignore. Stays unlisted.** |
| `HDsv…NBjJ` *(redacted — public repo)* | September Jam Bare Bones | 04-09-2026 01:29 | Placeholder created accidentally while validating the toolchain | **Ignore. Stays unlisted.** |

**Why this is recorded here rather than assumed:**

- The first project was created at **09:22 PT on Sep 3 — ~2h38m before the jam opened
  at 12:00 PT.** Anything begun before the open is disqualified, and it is not built
  from a jam kit either. It could never be the entry, on two independent grounds.
- Both will appear in every future `rundot list-games`, and both look like candidate
  entries at a glance. Without this note, a later session — or a tired human at 2am on
  day 9 — could deploy to the wrong game ID, which would publish the jam build onto an
  ineligible entry and hand it a scoring clock that starts late.

**Operating rules that follow:**

1. The jam entry is a **fresh scaffold** in `jam-entry/` with its own `game.config.json`.
   It has **no relationship** to either game above.
2. Neither game is ever made public. Public + approved is what enters the leaderboard;
   leaving them unlisted keeps them out of it entirely.
3. **Before every deploy:** confirm the target game ID is the jam entry's, and confirm
   `rundot whoami` prints `offroadinggamedev@gmail.com`.
4. When the jam entry is created, add its Game ID to the table below so the three are
   never confused again.

| Game ID | Name | Role |
|---|---|---|
| **`PpB5gECS0AMU49mGYAKM`** | **Spice Expert: Ramu** | ✅ **THE JAM ENTRY** — public at **https://w.run/puneetmakes/spice-expert-ramu** · `kitId: september-jam-tower-defense` |

---

## 0a. 🔒 Standing process rule — the human gate (set by user, Sep 4 2026, 08:05 PT)

**A return handover is never answered with another handover.**

The loop is:

```
implementation agent  →  PHASE N REPORT
planning agent        →  verify + BRIEF THE USER          ← stops here
user                  →  approval to proceed
planning agent        →  PHASE N+1 handover                ← only now
```

| Step | Who | Output |
|---|---|---|
| 1 | Implementation agent | `PHASE N REPORT` returned in chat |
| 2 | Planning agent | Independently verifies the claims, then **briefs the user**: what landed, what was found, what it costs, what the options are |
| 3 | **User** | **Human gate. Explicit approval to move ahead.** |
| 4 | Planning agent | *Only then* writes the next phase handover |

**Why.** The planning agent is the project's central brain, not its autopilot. Writing
the next handover immediately after a return handover quietly makes the sequencing
decision on the user's behalf — which phase comes next, what gets deprioritised, what
the newly-discovered work outranks. Those are the decisions with the most leverage in a
15-day jam, and they belong to the user. A brief that ends in a recommendation preserves
that; a brief that ends in an already-issued handover does not.

It also gives the user the only chance to redirect before implementation effort is
spent. Once a handover is out, the parallel agent starts working, and reversing it
costs real hours out of a fixed budget.

**Applies to:** every phase from Phase 2 onward. The Phase 1.5 handover was issued
before this rule existed — it stands or is withdrawn at the user's word.

**Does not apply to:** the brief itself, which the planning agent always writes
unprompted after a return handover. Silence is not the gate; the brief is what the gate
acts on.

---

## 0b. 🔒 Document roles — what belongs where (set by user, Sep 4 2026, 12:30 IST)

**[Tasks.md](Tasks.md) is an overview only.** It shows *where we are and where we are
headed*, at a glance. It carries task titles, phase tags and status marks — nothing more.

> **Detailed insights are not for Tasks.md.** No findings, no measurements, no rationale,
> no history. Anything explanatory belongs in the companion document that owns it.

**Tracking method: agile sprints and phases**, chosen by the user as the most convenient
way to follow the project.

| Axis | Meaning |
|---|---|
| **Sprint (S0–S5)** | A **time box**. Each day's work falls under a sprint |
| **Phase (P0–P9)** | A **category of work**. Each task falls under a phase |

Every task is annotated with both, so a task is locatable by *when* and by *what kind*.

| Document | Owns |
|---|---|
| **Tasks.md** | Status at a glance. Sprint × phase board, check marks |
| [GDD.md](GDD.md) | What the game is. Frozen design |
| [Plan.md](Plan.md) | What we intend to do, in what order, by when. Open items |
| [Specs.md](Specs.md) | How it is built. Contracts, budgets, risks |
| [Retro.md](Retro.md) | What actually happened. Findings, corrections, lessons |

**Rule of thumb:** if a line in Tasks.md needs a "because", the because goes elsewhere
and Tasks.md keeps only the line.

---

## 1. Log

### Sep 3 · **Day 0** — pre-production

*(Renumbered Sep 4 to the user's scheme: Sep 3 = Day 0. Dates are authoritative — see [Plan.md](Plan.md) §2.)*

**Shipped:** nothing yet. Production is gated on explicit GDD approval.

**What happened**

| Time (PT) | Event |
|---|---|
| 12:00 | Theme reveals: *"Back to Work: any job, and the real story behind it."* |
| ~12:30 | Handover received. All five source docs read (`Guidelines`, `GDD Guidelines`, `GDD Template`, `Jam-Day-Runbook`, `RUN-CLI-Setup`) |
| 12:34 | Toolchain check. `rundot whoami` **failed** — "No 'prod' session found" |
| ~12:40 | User ran `rundot login`. Auth verified: `offroadinggamedev@gmail.com` |
| 12:45 | Full CLI surface audited. All runbook commands confirmed present |
| ~12:50 | Scoping answered: <1 h tonight, 40–60 h total, solo, tense tone, design/systems strength |
| 12:55 | Job chosen: **line cook (Ramu)** from four pitched candidates |
| 13:05 | GDD filled and frozen pending approval. **65 minutes after the reveal — inside the 90-minute target** |
| 13:20 | Credits validated: **126,100** (100k promo redeemed) |
| 13:25 | `docs/` created; GDD moved; Plan, Specs, Retro created |

**Decisions and why**

| Decision | Reason |
|---|---|
| Kit = `september-jam-tower-defense` | Under 1 h available tonight. TD gives a working loop at hour one — the only way to reach public + approved today. Bare Bones killed on hours, not merit |
| Job = line cook over pest controller | Higher plays ceiling. Plays are $2,200 across 5 places; Editor's Pick is $300 at 1. When the two ceilings conflict, take plays |
| Pest controller retained as the Day 8 Story/Video hedge | Its aversive share card costs plays but costs nothing in an editorially judged field |
| Vertical rail, portrait | Lane direction agrees with the phone's long axis, and the pass sits under the thumb. Portrait is a design win here, not a mobile concession |
| Art Phase 1 = CSS/vector, zero credits | Phase 1 must not depend on a promo code arriving. It arrived anyway — the decision still stands, because it also means zero load time and nothing to draw tonight |
| Skin-layer swap contract promoted to **P0** | Retrofitting it during the Day 9–11 craft pass would cost 3–4× more than building it tonight |

**What went wrong**

| Issue | Impact | Resolution |
|---|---|---|
| Docs were in `Logic Seeding/`, not the `docs/` path the handover named | ~1 min | Found by listing the tree. Non-issue |
| `rundot whoami` not authenticated at handover, despite the setup record marking login "pending" | Would have blocked deploy | Flagged immediately and surfaced as the first line of the first reply, rather than discovered at deploy time |
| Credits were 25,100, not the promised 100,000 | Would have blocked the Day 9–11 art pass | Caught during the audit. User redeemed the promo → 126,100 |
| GDD heredoc exceeded the Windows command-length limit (`ENAMETOOLONG`) | ~2 min | Wrote the file with the Write tool instead. **Lesson: files over ~8 KB do not go through a shell heredoc on this machine** |
| Placeholder game created accidentally on the account | None, if never published | Recorded in §0. Stays unlisted |

**What went right**

- Concept frozen 65 minutes after the reveal, inside the runbook's 90-minute target.
- Toolchain audited **before** design rather than at deploy time, so both blockers
  (auth, credits) were found while they were still cheap.
- Four candidate concepts run through elimination, with two auto-killed on
  day-1-shippability. Nothing was skipped straight to one idea.
- The killed pest-controller concept was **repurposed** rather than discarded — it
  became the hedge entry, so the elimination produced two assets instead of one.

**Open risk going into tonight:** the entire plan depends on reaching CP3 —
public + approved — before sleep. Under an hour, of which ~20 minutes is plumbing.
The MVP was deliberately scoped *below* what that hour allows, not at it.

---

### Sep 3, 14:10 PT · Scope change — the cuisine level run

**Shipped:** nothing. Still pre-approval. This entry records a design change made
*before* production, which is the cheapest possible moment for one.

**What happened.** The user proposed adapting PvZ2's world / sub-level structure
(four reference images in `references/`) — cuisines as worlds, each with a path of
authored sub-levels, ticket loop unchanged. Two options were costed against the 40–60 h
budget.

| | Option A — full PvZ2 map | Option B — the linear run |
|---|---|---|
| Level schema + loader | 2 h | 1.5 h |
| Level runner + stars | 3 h | 2 h |
| **Map / navigation UI** | **8 h** (nodes, winding path, pan) | **2 h** (vertical strip) |
| World-select screen | 3 h | — |
| Per-world art | 4 h | — |
| Unlock + save state | 2 h | 0.5 h |
| Authoring levels | 5 h (~40) | 2.5 h (~18) |
| Integration | 3 h | — |
| **Total** | **~30 h** | **~8.5 h** |

**Decision: Option B adopted, Option A rejected.**

| Decision | Reason |
|---|---|
| Reject Option A | ~30 h is the *entire* remaining build budget (32–48 h, of which ~33 h was already committed). Affording it meant cutting the return loop — the one thing the trigger rules forbid cutting, and the thing the scoring metric rewards most. It also could not exist tonight, so it would have delayed the day-1 publish or been bolted on later anyway |
| Adopt Option B | ~8.5 h. Keeps the progression, cuts the cartography. Lands the project near 55 h of the 40–60 h range |
| Gate it behind the return loop | Finite content has a hard ceiling on this metric: a player who finishes 18 levels on day 3 gives 3 scoring days. The daily rotation gives up to 15. Levels may never be paid for with return-loop hours |
| Trim the craft pass 8 h → 5 h | The only place the 8.5 h could come from without touching the return loop or distribution |
| Cuisines as the unlock unit | Each cuisine hands over one real tool — tandoor, wok. That answers the theme's "tools of the trade" demand *better* than the original generic grill/fryer/prep set |

**Why this was worth doing at all — the agent's original design had a real gap.**
The daily rotation is a strong retention *floor* but a weak day-1-to-3 *pull*: "beat
your score" is a much weaker hook than "level 7 is right there." The level run covers
precisely the window the daily loop is worst at, which is also the window in which a
curious stranger decides whether this becomes a habit. Neither system covers all 15
scoring days alone. **The user found this gap, not the agent.**

**Explicitly cut, and recorded so it is not re-argued on day 9:** the world map,
floating islands, winding paths, camera pan, world-select screen, per-world art,
branching paths, boss nodes, treasure nodes, and any hard-blocking gate. Added to the
GDD cut list as items 9–11.

**No frozen item was broken.** Core loop (§10.1), theme expression (§10.2), primary
mechanics (§10.3) and return loop (§10.9) are all unchanged. The level run is additive,
lives at §10.10, and is subordinate to §10.9 by an explicit trigger rule. Nothing was
added to §3 of this document because nothing frozen moved.

**Docs updated:** GDD §10.5, §10.10 (new), §14, §15.2, §15.3, §15.5, cut list, trigger
rules, decision log · Specs §6 and §6a (new — level data contract) · Plan §2 timeline
and §4 day-by-day.

**Still not written: a single line of game code.** Awaiting explicit APPROVED.

---

### Sep 3, 14:45 PT · GDD review pass — six user corrections

**Shipped:** nothing. Still pre-approval. Six items raised on review; all six resolved
into the docs. **Two were corrections to agent errors, not preferences.**

| # | Change | Verdict |
|---|---|---|
| 1 | **SFX promoted from ⏭ DEFER to P1** | **Agent error, corrected.** Deferring audio was wrong for a cooking game — the genre runs on sizzle, bell, ping. Each station now gets its own working sound so the line can be *heard* without being watched. Core loop stays non-dependent on audio; mute parity is an accessibility floor, not a ranking |
| 2 | **Title → *Spice Expert: Ramu*** | **User call, correctly reasoned.** *In the Weeds* is authentic trade slang but niche — a general audience does not know it means "overwhelmed in a rush," and a title needing explanation loses players at the tap. The agent's original name check weighed authenticity and under-weighted comprehension |
| 3 | **Session length split into level vs session** | **Agent conflation, corrected.** The scoring metric is indifferent to session length — it counts unique players *per calendar day*. Level 60–120 s scaling by cuisine; session uncapped, emergent, player-chosen by chaining levels. Recipe diversity, not clock time, justifies longer later levels |
| 4 | Difficulty scaling authored via level design | Confirmed. Already "Scaling"; ownership now explicitly the user's |
| 5 | FTUE and Platform | **Approved unchanged.** No edits |
| 6 | **3D assets → pre-rendered 2D sprites** | User owns KayKit Restaurant Bits and asked whether it could be used. Yes — rendered offline, never at runtime |

**On the 3D question specifically.** The user's draw-call instinct was right, but the
deeper problems sit elsewhere: a ~600 KB runtime shipped to a phone, model loading before
first paint, fighting a 2D kit, and a 3D camera that adds nothing to a flat vertical rail
in portrait. Pre-rendering in Blender at a fixed angle and light rig gives **real 3D
lighting at one draw call**, more set-cohesion than generated art can manage, and **zero
credit cost** — which redirects the 126,100 balance to backgrounds, Ramu, and marketing,
where generation genuinely wins. The skin-layer contract needed **no change** to absorb
this, which is the first concrete payoff from making it P0 on day one.

**Two licensing risks surfaced — neither assumed either way, both logged:**

- **NCS tracks.** NCS's free permission is written for video content with attribution;
  interactive/game use is generally outside it. Jam rules require no third-party
  infringement and prize terms make the entrant warrant it, so this is not small on an
  entry that could place. Verify per track, or use `rundot generate music`/`sfx`.
- **KayKit via Unity Asset Store.** KayKit is typically CC0 from the creator's own site,
  but the Asset Store EULA licenses assets for Unity-based products and this is a web
  build. Confirm the CC0 terms travel with the user's copy; else re-source directly.

**Level design confirmed user-owned.** Structure is not yet defined and is the user's to
author. The agent ships placeholder levels so the system is testable immediately, and
supplies a fill-in **Level Design Sheet** at level-design stage. Binding test: the
placeholder set must be discardable wholesale — different cuisines, counts, and dish
vocabulary — **with no edit outside the data file.**

**No frozen item was broken.** §10.1 core loop, §10.2 theme expression, §10.3 primary
mechanics and §10.9 return loop are all untouched. Every change landed in §1, §5, §7,
§11, §11a (new), §12, §10.10 and §15.1 — none of which are frozen.

**Lesson recorded:** the agent's two errors here were both *category* errors, not detail
errors — deferring audio in a genre built on audio feedback, and treating session length
as a design target when the metric ignores it. Both were caught by the user on review.
**Genre-normal expectations deserve an explicit check against the scoring rule, rather
than inheriting the generic jam heuristic "polish is deferrable."**

**Still not written: a single line of game code.**

---

### Sep 3, 15:00–14:48 PT · APPROVED → scaffolded, built, deployed, submitted

**Shipped: the entry is live and in review.** Game ID `PpB5gECS0AMU49mGYAKM`.

| Time (PT) | Event |
|---|---|
| 15:00 | User replied **APPROVED**. GDD frozen |
| ~15:05 | `rundot jam init september-jam-tower-defense jam-entry` — **kit slug confirmed real** (Plan open item #5 closed) |
| ~15:10 | `npm install` clean · `npx rundot-sdk-setup -y` → 90+ SDK docs into `rundot/docs/` |
| ~15:15 | Read kit `CLAUDE.md`, `rundot-sdk` skill, and the SDK notes before touching any SDK code |
| ~15:25 | Retheme applied: dishes, stations, rushes, UI copy, palette, identity keys |
| 14:40 | `npx tsc --noEmit` clean |
| 14:44 | Thumbnail generated (120 credits) and resized to exactly 512×512 JPG |
| 14:42 | `npm run build` **CP2 passed** — 21 files, ~1.1 MB |
| 14:46 | `rundot init` → game `PpB5gECS0AMU49mGYAKM`, orientation set to `portrait` |
| 14:47 | `rundot deploy` — **failed once**, retried, succeeded |
| 14:48 | `rundot game set-public` accepted. **Status: Review** |

**Kit discovery — this changes the Sep 8–10 estimate.** The tower-defense kit is far
richer than assumed: a **pure deterministic sim engine** (`src/game/sim/engine.ts`), a
headless balance verifier (`npm run balance`), per-player cloud saves, a gem meta-economy,
two leaderboards, rewarded ads on a trusted clock, procedural audio, and Like/Comments
prompts — all already wired. **Plan open item #7 answered: yes, `src/game/data/waves.ts`
already ships an authored-wave system plus deterministic endless generation.** Levels are
therefore much cheaper than the ~9 h costed; re-estimate before Sep 8.

The kit's model mapped onto the frozen design almost 1:1, with **no frozen item bent**:

| Kit concept | Our design |
|---|---|
| Enemies | **Tickets/dishes** — `hp` = cooking still needed, `speed` = crawl toward the pass |
| Towers | **Stations** — the tools of the trade |
| Path (already serpentine, top→bottom, 9:16) | **The rail** |
| Lives | **Walkouts** |
| Gold / gems | **Cash / tips** |
| Waves / endless | **Rushes / Overtime** |

**Deliberate scope call: names and copy changed, internal IDs left alone.** Every `id`
(`fox`, `beetle`, …) is wired through `textures.ts`, `towerScene.ts`, `towerIcons.ts`,
`audio.ts` and `CONFIG.sizes`. Renaming them is a documented multi-file operation, and
taking that risk at hour one with a deploy deadline was not worth it. The player reads
`name`, never `id`. Content mapping: Grill / Prep Board / Tandoor / Fryer; Dal Tadka,
Masala Chai, Biryani, Masala Dosa, and **Full Thali** as the 3-walkout boss ticket.

**What went wrong**

| Issue | Impact | Resolution |
|---|---|---|
| `npx rundot-sdk-setup` needs `-y` in a non-TTY shell, and rewrites `CLAUDE.md` | Would have clobbered the kit's own agent guide | Backed it up to `CLAUDE.kit.md` first; the setup appended rather than replaced |
| `rundot generate image` refused: no `gameId` yet | ~2 min | Ran `rundot init` first. Correct ordering: **`init` before `generate`** |
| No PIL/sharp for image resizing | ~3 min | Resized via .NET `System.Drawing` in PowerShell. Thumbnail must be **exactly 512×512** or deploy fails |
| A `Remove-Item` cleanup was blocked by a path guard | none | Re-ran without it; `thumb-raw.png` left in the project root, harmless (not in `dist`) |
| **`rundot deploy` failed with a signed-URL 500** | ~1 min | **Server-side, transient.** Immediate retry succeeded. Expect this again; retry before debugging |

**Not done tonight, deliberately:** `npm run balance` (no tuning numbers were changed,
only names and six hex colours) and any real phone test — handed to the user with the
private URL at the moment of publishing rather than blocking the submission on it.

**Lesson:** reading the kit's own `CLAUDE.md` before touching anything was the single
highest-value ten minutes of the night. It documented the removal recipes, the invariants,
the art spec, and the exact rename checklist, which is why the retheme landed typecheck-
clean on the first attempt.

---

### Sep 3, ~15:05 PT · ✅ CP3 PASSED — public and approved · v1.0.1 UI fixes

**v1.0.0 was approved and is live: https://w.run/puneetmakes/spice-expert-ramu**
The scoring clock is running, with ~15 calendar days to Sep 18, 12:00 PT. This is the
checkpoint the whole plan was shaped around, and it landed on day one.

**First real-device test (user), two bugs filed with screenshots in `references/Errors/`:**

| # | Bug | Cause | Fix (v1.0.1) |
|---|---|---|---|
| 1 | Menu title overflowed both screen edges | Kit's `whitespace-nowrap` at `calc(--game-w * 0.1)` was sized for "TOWER DEFENSE" (13 ch); "SPICE EXPERT: RAMU" is 18 | Two lines, each `min(calc(...), rem-cap)`, `max-w-full` + centre. RAMU set larger and white for hierarchy |
| 2 | Game screen cluttered, speed row cut off at the right edge | Row 2 held rush counter + "Fire it" + four speed buttons; the counter and button both wrapped to two lines, pushing `4x` off-screen | HUD rebuilt to a layout contract: row 1 status + hamburger, row 2 rush + speed (both `whitespace-nowrap`, speed `shrink-0`), **"Ready!" moved to bottom centre** |

**Also fixed, unreported but clearly wrong:** the menu tips still read *"Tap a stone pad
to place a tower / Start each wave when you are ready / Do not let the bugs through"* —
kit copy the first retheme pass missed entirely. Now reads in the game's own language.
And the palette was still the kit's green (`#8bd450`); moved to the GDD's hot pass
orange `#ff6b1a` on kitchen dark `#14141a`, which is why the buttons now read as a
kitchen rather than a lawn.

**New shift menu (user-specified):** hamburger opens a translucent overlay that **pauses
the run** (`store.paused` stops the Pixi ticker), with circular Music and Sound mute
toggles, "Back to shift", and **Main Menu at bottom centre**. Icons are inline SVG rather
than emoji, because emoji glyphs render inconsistently across Android and iOS. Mutes
remember the previous level so unmuting restores it rather than jumping to a default.

**Two collisions caught before they shipped, not after:**

1. `BuildSheet` is also `inset-x-0 bottom-0`, so a bottom-centre "Ready!" would have sat
   on top of it. Ready is now hidden while a pad is selected — which is also correct UX,
   since you are not starting a rush while choosing a station.
2. The kit renders its own plain "Paused" card on `store.paused`. Setting `paused` for
   the shift menu would have stacked two overlays. The kit's card is now suppressed
   while the shift menu is open.

**🔴 OPERATIONAL FACT — carry this to Sep 14.** `rundot deploy` lands every new version
as **private**, even when a previous version is already public. The output says so
explicitly: *"Deployed v1.0.1 as 'private'"*. **`rundot game set-public` must be re-run
after every deploy**, and each version goes through review again. The public channel
keeps serving the last approved version meanwhile, so players are never interrupted.

Practical consequence for pencils-down: the Sep 14 sequence is **build → deploy →
set-public → verify the Public channel shows the new version**, finished by **11:00 PT**,
because approval is not instant. Confirming "deployed" is not confirming "public".

**Lesson:** the first retheme pass was done by grepping for terms I expected to find.
It missed the menu tips block entirely, because that copy used none of the words I
searched for. **Reading the rendered screens beats grepping for known strings** — a real
device screenshot found in one glance what a targeted search had missed.

---

### Sep 3, ~16:00 PT · Working model split · originality debt named · pre-compaction audit

**Shipped:** nothing new to players. v1.0.1 remains the live public build, user-verified
on device: HUD, shift menu, mutes and the bottom-centre **Ready!** all confirmed working.

**Two user findings, both correct, one of them serious.**

**1. The title fix failed again.** Verified `rundot game info` first — v1.0.1 *is* on the
Public channel, so the fix was live and genuinely wrong rather than unshipped. Root
cause: `--game-w` is `100vw`, so `calc(var(--game-w) * 0.115)` ≈ 44.85px on a 390px
phone; twelve uppercase bold characters at ~0.68em advance ≈ 366px, plus `px-4` padding,
overflows a 390px frame. **I estimated glyph widths by hand and got it wrong twice.**
The replacement spec uses SVG `textLength` + `lengthAdjust`, which forces an exact width
regardless of font metrics. **Lesson: never size text by arithmetic on glyph estimates;
use a layout primitive that cannot overflow.**

**2. "No iota of original work apart from text body variation."** This is the important
one and it is fair. The kit's own `CLAUDE.md` states plainly that the example towers,
enemies, waves, board layout, palette and on-screen names are EXAMPLE CONTENT to be
replaced. I replaced **names and palette only**, and stopped. Players are still watching
beetles and wasps crawl past owls and bears, which is precisely the "reskin reads as
off-theme" failure the jam guidelines warn about — and it damages both prize tracks at
once. Phase 1 (art) and Phase 2 (board layout) exist to repay this debt.

**Root cause of the miss:** publishing on day one was correctly prioritised, but once
CP3 passed I treated the retheme as finished because the *text* was finished. **The kit
told me exactly what "replace the example content" meant and I read it as a copy task.**

**Working model changed at user's direction:** planning and implementation split across
two agents. Recorded in [Plan.md](Plan.md) §1a with the protocol and the standing
guardrails every handover must restate. Phase 1 handover issued; Phase 2 (board layout →
ticket rail) being specified.

### Pre-compaction security audit — clean

| Surface | Result |
|---|---|
| `docs/` — share keys, `tag=private`, `tag=review` | ✅ **None.** Private share URLs carry a `k=` access key and were deliberately kept out of the documents; only the public URL is recorded |
| `docs/` — api keys, secrets, tokens, bearer, `rk_`/`pk_` | ✅ None. All "token" matches are design vocabulary (skin-layer tokens) |
| `jam-entry/src`, `public/` | ✅ No credentials |
| `.gitignore` | ✅ Covers `.env*`, `node_modules/`, `dist/`, `rundot/docs/` |
| `game.config.prod.json` | ✅ `gameId` + `kitId` only. `gameId` is public (it is in the share URL); not a secret |
| CLI credentials | ✅ Live in `%USERPROFILE%\.rundot_cli`, outside the repo |

**⚠️ One finding — financial exposure, not a leak.** `rundot/textGen.config.json` was
**auto-created by the first deploy** with `dailyCreditCap: 500000` and
`perUserDailyCreditCap: 10000` (~$500/game/day, ~$10/user/day). The game does **not use
textGen**. The caps are a ceiling rather than a spend, so nothing has been charged, but
an unused AI surface sitting open on a public game with a 500k daily ceiling is worth
closing. **Action for a later phase: tighten both caps to 0 or remove the file**, and
re-verify after each deploy since it was created automatically once already.

---

### Sep 4, ~06:00 PT · **Day 1** — three open decisions closed · Day 0 numbers in

**Context.** Session resumed after a context compaction. The three decisions that had
been blocking Phases 1 and 2a came back answered in one message.

| # | Question | Answer | Effect |
|---|---|---|---|
| 15 | Art source — generate now vs wait for KayKit | **Generate now.** Phase 1 handover already passed to the implementation agent; return handover pending | Phase 1 is running. No planning-side action until the return handover arrives |
| 10 / 11 / 18 | NCS + KayKit licences | **"License allows."** | Both gates retired in [Specs.md](Specs.md) §5 and §8a; both risk rows struck in §10. Phase 2a render pipeline unblocked |
| 14 | Distribution | **"Elaborate distribution and what you mean by it."** — not a decision, a request for the missing explanation | [Plan.md](Plan.md) §5 rewritten in full: what the word means, the day-1 numbers, the three surfaces, cadence, and a split-launch recommendation |

**Planning-side read on the licence answer.** The user owns the assets and is the
authority on their own licence, so the gates are recorded as cleared on their word
rather than on an independent check — which is the correct division of authority here.
One obligation survives clearance and is easy to forget: **NCS attribution is a
standing condition even where use is permitted.** Logged as Plan §7 item 19 (a credits
screen carrying track titles and a KayKit credit) so it does not get discovered on
Sep 18.

**Day-1 numbers, pulled for the first time.** `rundot analytics export daily_activity_30d`:

| day | sessions | unique_players | median_duration_s | p95_duration_s |
|---|---|---|---|---|
| 2026-09-03 | 2 | 2 | 122 | 359 |

`rundot jam promo` reports **rank #3 on 2 plays**. Both of those players were us.
**Actual distribution to date is zero** — the entry has been public for ~15 hours and
nobody has been told. This is the single largest gap in the project right now, and it
is larger than the art gap: the art gap costs quality per player, the distribution gap
costs players.

The rank reading cuts the other way and is worth noting: #3 off two plays means the
board is small and early, so a handful of real plays moves rank materially, and rank
feeds board discovery. That is a compounding window that is open now and narrows as
entries accumulate.

**A publishing action deliberately not taken.** `rundot socials prepare` looked like a
harmless local packet generator until its own flag list gave it away — `--force`
reads *"re-post to Discord even if already auto-posted for this version."* Prepare
therefore **posts**. It was not run. Recorded here because the naming is genuinely
misleading and a future session will meet the same trap.

> **Lesson.** Read a CLI's *flag descriptions*, not just its command description,
> before running anything on a public game. `prepare` sounded local; its own `--force`
> flag proved it is outward-facing.

---

### Sep 4, ~07:20 PT · Phase 1 shipped — v1.1.0 · first return handover reviewed

**What landed.** The originality debt named on Sep 3 is substantially repaid. The build
now carries 15 generated assets — stations, ticket sprites, projectiles, pads, the pass
— in place of the kit's procedural bugs and animals, and the title bug that survived two
attempts is structurally fixed.

| | |
|---|---|
| Version | **v1.1.0**, confirmed on Private / Review / Public |
| Title | SVG `textLength` + `lengthAdjust`, verified at 320 / 390 / 430 px |
| Assets | 15 of 15, `grass-tile` correctly excluded per spec |
| Credits | 2,325 across 17 `imagegen` calls |
| Deviations | none |

**The title fix worked because the spec changed the primitive, not the number.** Two
earlier attempts failed by hand-estimating glyph widths against `--game-w`. The third
succeeded by choosing a primitive that *cannot* overflow — SVG text with an explicit
`textLength` inside a `viewBox`. Recorded as a general lesson, not a CSS one: when a fix
fails twice, the next attempt should change the class of solution rather than retune the
same one.

**Two behaviours the implementation agent discovered and reported — both worth keeping.**

1. `rundot game set-public` did **not** flip the Public channel immediately this time.
   It went through an automated review lasting a few minutes. The agent polled
   `rundot game info` until all three channels read v1.1.0 rather than trusting the
   command's own success output. That is the correct instinct and is now the standing
   procedure.
2. `rundot generate image` hit a **per-creator rate limit** after roughly 4–5 calls and
   needed retry with backoff to finish the batch. Budget wall-clock for this on any
   future art batch; it is not a failure state.

**What the review pass found that the handover did not.** The report read
*"broken / uncertain: none"*, and within the envelope the implementation agent was
checking — does it compile, does it run, does it look right — that was accurate. Two
defects sat outside that envelope. Full detail in [Plan.md](Plan.md) §1c and
[Specs.md](Specs.md) §5a; in brief:

| | Finding | Why it was invisible to a correctness check |
|---|---|---|
| 🔴 | **16.30 MB blocking preload.** All 15 assets shipped at the generator's native 1024×1024; all sit in the `critical` bundle. 27 s on 5 Mbps, 60 MB decoded texture memory, against sprites that draw at 64–96 px | On a desktop dev machine with a warm cache it loads instantly and looks perfect. The defect only exists for the phone player arriving cold from a link — which is every player distribution is about to send |
| 🟠 | **15 `*.png.json` generation sidecars deployed**, carrying prompts, seeds, model, and a storage URL embedding the game id and a creator account id | They are inert files. Nothing references them, nothing breaks, no test fails |

Neither is a criticism of the implementation work, and both are cheap to fix — the
downscale costs zero credits. They are the specific reason an independent review pass
exists in the two-agent model: **"it builds and it looks right" and "it works for a
stranger on a phone" are different questions**, and only the second one scores.

**Sequencing consequence.** A new **Phase 1.5** now sits ahead of the board-layout work
and ahead of the distribution push. Sending traffic to a 27-second preload would convert
the distribution effort into nothing, so payload lands first. This is the one case so far
where fixing something has been allowed to outrank shipping something.

**Unexplained, and logged as such.** Credits went ~125,980 → **132,275** while 2,325 was
being spent — a net **+8,620** from an unidentified source, most likely a jam
participation grant. Written down as an open question (Plan §7 item 23) rather than
quietly absorbed as income.

> **Lesson.** A subagent's "no issues" is scoped to the checks it ran. Ask what envelope
> was checked, then independently measure the axes outside it — here, payload weight and
> what ends up inside `dist/`. Both were one shell command away and neither was in
> anyone's definition of done.

---

### Sep 4, ~08:05 PT · Process correction — the human gate

**User instruction, verbatim in effect:** on receiving a return handover from the
implementation agent, a **briefing** must happen, which the user intercepts as a human
gate, *instead of* writing another handover. Only after explicit approval to move ahead
is the next handover written.

Recorded as a standing rule in §0a above, ahead of the log, because it governs every
future cycle rather than describing one.

**What triggered it.** On the Phase 1 return handover the planning agent verified the
report, found two defects, and — in the same message — issued a Phase 1.5 handover that
reordered the queue: payload work was promoted ahead of both the board layout and the
distribution push. That reordering was defensible on the merits, but it was a
sequencing decision made without being asked for, and sequencing is where nearly all the
leverage in a 15-day jam sits.

**The failure mode it closes.** Verification and analysis are the planning agent's job;
choosing what the project does next is not. Bundling them makes the analysis read as a
justification for a decision already taken, which is exactly the shape that stops a user
from disagreeing with it.

> **Lesson.** Being right about the next step is not authorisation to take it. Deliver
> the finding and the recommendation, then stop. The gap between "here is what I would
> do" and "here is what I have done" is the entire difference between an analyst and an
> autopilot.

---

### Sep 4, ~21:40 IST (09:10 PT) · Clock realigned to IST

**User instruction:** align goals to **GMT+5:30** henceforth. All planning times are now
IST-first, with PT in brackets because the jam publishes its deadlines in PT.

**The non-obvious part, and the reason this was worth doing properly.** A scoring day is
not the user's calendar day. **IST = PT + 12:30**, so if RUN's day boundary is PT
midnight, the scoring day flips at **12:30 IST — midday** — and the user's working day
straddles two scoring days. Every "today's tasks" conversation up to now was ambiguous
without an anchor.

**Verified against data rather than assumed.** The two Sep 3 sessions ran at
**02:30–04:00 IST on Sep 4**, and `rundot analytics export daily_activity_30d` buckets
them as **2026-09-03**. So the boundary is definitively **not IST**.

**What is still unknown, stated as unknown.** PT midnight and UTC midnight both put
those sessions on Sep 3, so the sample cannot separate them — and the gap between them is
large in IST terms (12:30 vs 05:30). Recorded as an open question with a concrete test:
a session logged between **05:30 and 12:30 IST** will resolve it. Planning proceeds on
**PT midnight**, the later of the two and therefore the assumption that can never cause a
missed deadline.

**Deadlines restated in the user's clock:**

| Gate | Published | **IST** |
|---|---|---|
| Scoring ends | Sep 18, 12:00 PT | **Sep 19, 00:30 IST** |
| CP8 final deploy verified | Sep 14, 11:00 PT | **Sep 14, 23:30 IST** |

**Carried into Phase 3.** The return loop's daily rollover fires on RUN's server
boundary. The user cannot test it by sleeping and waking — their new day begins at
12:30 IST. CP5 verification has to be planned around that.

> **Lesson.** When a user gives their timezone, converting the deadlines is the easy
> half. The half that matters is asking *which* clock the scoring metric itself runs on
> — and that one was answerable from data already on disk.

---

### Sep 4, 12:14 IST · Clock resolved by measurement · real players arrive · two corrections

**Two corrections to earlier entries in this document. Both changed decisions.**

#### Correction 1 — the timestamps before this entry are wrong by ~12 hours

Every "PT" time written before now was **computed from an assumed anchor**, never read
from a clock. Checked against the system clock for the first time today:

| | |
|---|---|
| System timezone | **India Standard Time, UTC+05:30** |
| Actual moment | **Sep 4, 12:14 IST = Sep 3, 23:44 PT = Sep 4, 06:44 UTC** |

So entries stamped "Sep 4 morning PT" describe moments that were really **Sep 3 night
PT**. **Read earlier entries by their dates, not their clock times.** All times from here
are read from the system clock, IST-first.

#### Correction 2 — the scoring-day boundary is not PT (open item #24, resolved)

Planning had been running on the conservative assumption of PT midnight (= 12:30 IST).
**Measurement rules that out.** At Sep 4, 12:14 IST the PT clock read **Sep 3, 23:44** —
yet `daily_activity_30d` already carried a populated **`2026-09-04`** row with 31
sessions. A PT day that has not begun cannot hold sessions.

**UTC is the working assumption** (fits every observation, and is the platform default).
IST midnight is not strictly excluded by today's sample, but nothing buckets in IST.

> **The scoring day runs 05:30 IST → 05:29 IST.** Materially better than the assumed
> 12:30 midday split: the user's entire waking day now sits inside a single scoring day,
> so "today" needs no arithmetic. It also means the Phase 3 daily rollover *can* be
> observed across a normal night's sleep, which the earlier assumption had ruled out.

Deadlines are unaffected — they were fixed instants published in PT: scoring ends
**Sep 19, 00:30 IST**; CP8 **Sep 14, 23:30 IST**.

#### Real players arrived, with zero distribution done

| Scoring day (UTC) | Sessions | **Unique players** | Median |
|---|---|---|---|
| Sep 3 | 17 | **9** | 301 s |
| Sep 4 (~7 h elapsed) | 31 | **26** | 118 s |
| **Cumulative** | | **35** | |

Board: rank #3, 13 plays. **Nothing has been shared anywhere** — this is organic jam-board
discovery alone.

**Platform mix is the finding that matters:**

| Platform | Unique players |
|---|---|
| **mobile-web** | **26** |
| web | 7 |
| android | 2 |

**Three quarters of real players are on phones** — exactly the population paying the full
cost of the **16.30 MB blocking preload** shipped in v1.1.0. Phase 1.5 stops being
hygiene and becomes the highest-value work available: roughly 26 phone players a day are
currently meeting a 27-second grey screen before the game appears.

#### And a third correction: "2 plays, both of them us" was wrong

Sep 3 first exported as **2** unique players. It has since settled at **9**. The export
lags. The argument built on that number — that distribution had produced nothing — held
up, but the magnitude was understated more than four-fold, and a weaker claim was made
than the data supported.

> **Lessons.**
> 1. **Read the clock; never compute it.** Half a day of timestamps were wrong because a
>    timezone was assumed rather than measured, and the check was one command.
> 2. **A metric's day boundary is a measurable fact, not a guess.** #24 sat open as
>    "unresolvable without more data" when the data to resolve it was already on disk.
> 3. **Same-day analytics rows are partial.** Never close an argument on today's numbers,
>    and re-pull before repeating yesterday's.
> 4. **Platform mix reframes priorities.** "16 MB is heavy" is an abstraction;
>    "26 of 35 real players are on phones" is a decision.

---

### Sep 4, 12:30 IST · Tasks.md created · agile sprint/phase tracking adopted

**User instruction.** Track the project with an **agile sprint and phase breakdown** in a
new `docs/Tasks.md`, written **high-level only**, with a status mark against each task.
Days roll up into sprints; task categories roll up into phases. Explicitly: **detailed
insights are not for Tasks.md** — that document exists to give a glimpse of where we are
and where we are headed, nothing more.

Recorded as a standing rule in §0b above rather than only as a log entry, because it
governs how all five documents are written from here on.

**Structure adopted.**

| | |
|---|---|
| Sprints | **S0** Sep 3 Foundation & Ship · **S1** Sep 4–5 First Contact · **S2** Sep 6–8 Return Loop · **S3** Sep 9–11 Depth & Identity · **S4** Sep 12–14 Lock & Verify · **S5** Sep 15–18 Sustain & Share |
| Phases | **P0** Pipeline · **P1** Art & Identity · **P1.5** Performance & Hygiene · **P2** Board & Core Loop · **P3** Return Loop · **P4** Level Run & Content · **P5** Audio · **P6** Distribution · **P7** Telemetry · **P8** Craft Pass · **P9** Hedge Entry |
| Marks | `[x]` done · `[~]` in progress · `[ ]` not started · `[!]` blocked on user · `[-]` deferred |

**Why the split is worth keeping honest.** The four existing documents had begun to
double as a status board, and status was scattered across all of them — phase queue in
Plan §1b, checkpoint ledger in Retro §2, live snapshot in Specs. None of them answered
"what is left" in one view. Tasks.md answers only that, and answers nothing else; the
discipline that keeps it useful is the discipline of leaving the reasoning out of it.

> **Lesson.** A status document that starts explaining itself stops being scannable.
> One document per question: *what is it* (GDD), *what will we do* (Plan), *how is it
> built* (Specs), *what happened* (Retro), *where are we* (Tasks).

---

### Sep 4, ~13:00 IST · Version control established

**Scope decision: one repository at `September GameJam/`**, the parent of both trees,
rather than one per folder. The docs and the code move together — a Retro entry cites a
deployed version, a Specs budget constrains an asset that lives in `jam-entry/` — and
under the two-agent model the implementation agent's commits and the planning agent's
document changes now land in a single history instead of two that have to be
cross-referenced by hand.

| | |
|---|---|
| Root | `September GameJam/` |
| Branch | `main` |
| Identity | `OffroadingGamedev <offroadinggamedev@gmail.com>` — already matched the jam account, no override needed |
| Baseline | 121 files, 19.65 MB |
| Remote | **none** — not created; that is a publishing decision and belongs to the user |

**Verified before committing, not after.**

| Check | Result |
|---|---|
| `node_modules/`, `dist/` excluded | ✅ 351 MB and 18 MB left untracked |
| `.env` in any form present anywhere | ✅ none exist in the tree |
| Staged secret scan — keys, tokens, bearer, webhooks, private share keys (`k=…`) | ✅ clean; the only hits were the word "secret" in the new `.gitignore` comment and the audit table in this document |
| CLI credentials | ✅ in `%USERPROFILE%\.rundot_cli`, outside the repo |

`.gitattributes` normalises line endings to LF and marks image and audio formats binary,
so the Windows checkout does not produce spurious whole-file diffs.

**One cost accepted knowingly.** 16.3 MB of the baseline is the fifteen 1024×1024 PNGs
that Phase 1.5 will downscale. Git keeps them for the life of the repository even after
they are replaced. Committed anyway: they are what is live right now, and rewriting
history to remove them later would cost more than the megabytes do. LFS is not worth
introducing for a 15-day project.

**Deliberately not done: no remote was added.** Pushing publishes — and the tracked
`*.png.json` sidecars carry the art prompts and a creator account identifier, which is
tolerable in a local or private repository and not in a public one. The choice of host
and visibility is the user's.

**Published Sep 4, ~12:50 IST** — user chose a public repository:
<https://github.com/OffroadingGamer/Spice-Expert-Ramu>

**Scrubbed before the first push, not after.** A public repo publishes history as well as
files, so three redactions and one history rewrite happened while nothing was pushed yet:

| Action | Reason |
|---|---|
| Untracked 16 `*.png.json` sidecars | Carry art prompts and a storage URL embedding the creator account id. Kept on disk as provenance |
| Redacted the RUN UserId from Specs §1 | Internal account identifier |
| Redacted both unlisted game ids from §0 above | Both games stay unlisted; publishing the ids would make them findable |
| Rewrote to a single root commit | Redacting in a *second* commit leaves the values readable in `git log -p`. Verified the tree hash was byte-identical before and after |

Root README added. 106 files published; final scan of `origin/main` for identifiers and
private share keys came back clean.

The user reviewed and accepted the two remaining disclosures knowingly: the RUN email
appears throughout the documents, and the documents publish credit balance, daily play
counts and full strategy.

> **Lessons.**
> 1. `git init` is reversible; `git push` is not. Set up, verify what is staged, and stop
>    at the point where the next action makes it visible to someone else.
> 2. **Redaction in a later commit is not redaction.** A public repo publishes every
>    commit. The only cheap moment to rewrite history is before the first push.

---

### Sep 4, 13:24 IST · Phase 1.5 shipped — v1.2.0 · the payload defect closed

The first return handover written *after* the human gate was installed, and the first one
where the report survived independent verification without a correction.

**What shipped.** Every generated asset downscaled from its 1024×1024 generation size to
the ship size in Specs §5a. The `critical` bundle went from **16.30 MB to 0.64 MB** — a
96% cut — and decoded texture memory from ~60 MB to ~3.9 MB. On the 5 Mbps connection the
budget was written against, that is roughly 27 seconds of blocking preload reduced to
about one. Given that 26 of our 35 players to date arrived on mobile-web, this was the
difference between a link that opens and a link that gets closed.

**What I verified rather than accepted**, and how:

| Claim | Check | Result |
|---|---|---|
| 0.64 MB bundle | `du -sb public/images` | 667,292 bytes — exact |
| Ship sizes correct | IHDR bytes of all 16 PNGs | every one matches §5a |
| Alpha preserved | IHDR colour type / bit depth | 6 / 8 — RGBA, no flatten |
| Masters preserved | IHDR of `art-source/` files | still 1024², 17 MB, gitignored |
| Zero sidecars in build | `ls public/images/*.png.json` | 0 |
| Nothing sensitive tracked | `git ls-files \| grep png.json` | 0 |
| v1.2.0 on all three channels | `rundot game info` | Private / Review / Public all 1.2.0 |
| Correct account | `rundot whoami` | offroadinggamedev@gmail.com |
| Zero credits spent | `rundot credits` | still 2,325 / 17 calls |

The one thing worth naming as good practice: the agent did not write a throwaway resize
command. It installed `sharp` as a devDependency and committed `scripts/resize-art.mjs`
with the size table as data and a guard that throws if a master is missing. When Phase 2b
regenerates the art, the downscale runs by name. That is the difference between fixing a
defect and closing it.

**The deviation, and why it stands.** The build shipped as **v1.2.0**, not the v1.1.1 the
handover specified — `rundot deploy` defaults to a minor bump and no `--bump patch` was
passed. The agent chose not to re-deploy for a cosmetic version number, which was the
right call: a second upload of identical content would leave a dangling version for no
gain. Accepted. The lesson is mine, not the agent's — **the handover specified a target
version without specifying the flag that produces it.** A handover that names an outcome
the tool does not produce by default has to name the flag too.

**A number that moved on its own again.** Credit balance went 132,275 → **132,575** with a
spend column unchanged at 2,325 across 17 calls. That is the second unexplained rise; the
first was +8,620. Two data points make it a pattern rather than an anomaly, so item 23 is
rewritten to say so. Still not counted on in any budget.

**Found while verifying, not reported by the agent** (it was outside their scope, and
correctly so): five SFX `.wav` files appeared in `Ramu - The Chef/Audio/SFX/` at 13:10
IST, with an empty `BGM/` folder beside them — the user's own contribution. Three
observations, all now open items. They are uncompressed WAV totalling 3.0 MB, which would
give back a third of the payload we just won. Their provenance is unknown, and nothing
with unknown provenance can ship into a jam that audits originality. And the folder is
untracked but not ignored, so it would land in the next commit as-is.

**Traffic, read at 13:24 IST:** unchanged from the 12:14 pull — Sep 4 still 26 uniques
across 31 sessions, 35 cumulative. Seventy minutes, no new arrivals. Nothing has been
shared yet, so this is the natural ceiling of discovery-only traffic, and it is the
argument for item 20 stated as a measurement rather than an opinion.

---

## 2. Checkpoint ledger

Runbook checkpoints. Update as each passes, with the actual time.

| CP | Gate | Target | Actual | State |
|---|---|---|---|---|
| 0 | `rundot whoami` prints the email | Pre-jam | Sep 3, ~12:40 PT | ✅ (late — was marked pending in the setup record) |
| 1 | Theme captured, kit chosen, one-sentence pitch written | Sep 3 +90 m | Sep 3, 13:05 PT | ✅ 65 min |
| 2 | `npm run build` succeeds, `./dist` exists, from a kit scaffold | Sep 3 | **Sep 3, 14:42 PT** | ✅ 21 files, ~1.1 MB |
| 3 | **Public + approved, visible on the leaderboard** | **Sep 3, before sleep** | **APPROVED ~15:05 PT** | ✅ **PASSED.** Public at `w.run/puneetmakes/spice-expert-ramu`. **Scoring clock running, ~15 days to Sep 18** |
| — | **Day 0 (Sep 3) closed** — all 11 steps of [Plan.md](Plan.md) §3, CP0–CP3 | Sep 3 | Sep 3 | ✅ **Complete.** v1.0.1 and v1.1.0 shipped beyond the Day 0 list |
| 4 | First-timer reaches the fun in <30 s on a phone, unaided | Sep 5 | — | ⬜ |
| 5 | Reopening tomorrow is visibly different and rewarding; a notification invites it | Sep 8 | — | ⬜ |
| 6 | Shared on ≥3 surfaces; daily uniques trending up, not decaying | Sep 7 | — | ⬜ |
| 7 | A stranger can name one distinctive thing ("it's polished" doesn't count) | Sep 11 | — | ⬜ |
| 8 | Verified public + approved before 12:00 PT | **Sep 14, 11:00 PT** | — | ⬜ |
| 9 | Still sharing on Sep 17 | Sep 18 | — | ⬜ |

---

## 3. Frozen-item breaks

Per GDD Guidelines §9 and the handover standing rules: every time a **frozen** item —
core loop (§10.1), theme expression (§10.2), primary mechanics (§10.3), return loop
(§10.9) — is deliberately broken, it gets a row here *and* in the GDD decision log.

| Date | Frozen item | What changed | Why | Downstream impact |
|---|---|---|---|---|
| — | — | *(none yet — nothing frozen has been broken)* | — | — |

---

## 4. Metrics

Filled from `rundot analytics` and `rundot leaderboard` once the entry is live. Daily
uniques are the score; the trend matters more than any single day.

| Date | Daily uniques | Cumulative | Board position | Shipped that day | Shared on |
|---|---|---|---|---|---|
| Sep 3 | **9** (first reported as 2 — export lag) | 9 | #3 | v1.0.0 public, v1.0.1 UI fixes | — **nowhere** |
| Sep 4 | **26** at both 12:14 and 13:24 IST, day still open | **35** | #3 (13 plays) | **v1.1.0** title fix + 15 assets · **v1.2.0** payload 16.30 → 0.64 MB | — **still nowhere.** All organic |

---

## 5. Lessons — carried forward

1. **Audit the toolchain before designing anything.** Both real blockers tonight (auth,
   credits) were environmental and invisible from the design side. Found at 12:34;
   found at deploy time they would have cost the day-1 publish.
2. **Files over ~8 KB do not go through a shell heredoc on Windows.** Use the Write tool.
3. **A killed concept is an asset, not a loss** — if the reason it was killed does not
   apply in a different track. Pest controller lost the plays board and won the hedge slot.
4. **A CLI's flags describe it better than its description does.** `rundot socials
   prepare` reads as local packet generation; its `--force` flag says it re-posts to
   Discord. Check the flag list before running anything against a public game.
5. **When a fix fails twice, change the primitive, not the number.** Two title fixes
   died hand-estimating glyph widths; the third used SVG `textLength`, which cannot
   overflow by construction.
6. **"No issues" is scoped to the checks that were run.** Measure the axes outside a
   subagent's envelope yourself — payload size and `dist/` contents caught two live
   defects that every correctness check passed.
7. **Pull the numbers before arguing about the work.** One `analytics export` turned
   "we should probably share it" into "2 players, both of them us" — which is an
   argument nobody has to have twice.
8. **A handover that names an outcome must name the flag that produces it.** Phase 1.5
   asked for v1.1.1 and got v1.2.0, because `rundot deploy` bumps minor by default and
   the handover never said `--bump patch`. Specify the mechanism, not just the target.
9. **Verify the report against the artefact, not against itself.** Phase 1.5's numbers
   were all correct — but they were only *known* to be correct after reading IHDR bytes,
   `du`, `git ls-files` and `rundot game info`. The gate is worth nothing if the briefing
   is a paraphrase of the report.
10. **Record what to ignore, not just what to do.** Two unlisted games on the account
   look exactly like entry candidates in `list-games`. §0 exists so a tired future
   session cannot deploy to the wrong game ID.
