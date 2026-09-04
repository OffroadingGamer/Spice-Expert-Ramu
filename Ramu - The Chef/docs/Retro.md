# Retro — Spice Expert: Ramu

> **Backward-looking.** What actually happened, including the things that went wrong.
> Companion docs: [GDD.md](GDD.md) (what the game is) · [Plan.md](Plan.md) (what we
> intend) · [Specs.md](Specs.md) (how it is built).
>
> **Update rule:** append on every iteration, **progressive or regressive**. A day
> where nothing shipped is still an entry — the reason it did not ship is the most
> valuable thing in this document. Never rewrite history to look tidier.

**Last updated:** Sep 5 2026, 00:35 IST (read from the system clock)

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

### Sep 4, 13:36 IST · Distribution opened · the surface list shrank the strategy

User chose distribution over telemetry as the next move, then answered the surface
question: **LinkedIn and Discord. Nothing else.**

**The packet.** `rundot socials prepare --platforms x,reddit` ran clean. The Discord
auto-post I had warned about in §5.3 could not have fired — it requires a webhook on the
creator profile and `socials profile show` still returns none — but the platform list was
restricted anyway on the principle that a guard costs nothing. Packet
`cabeeb7e-ad5c-4b69-bfc1-0458e145b0a3`, two tracked links minted.

**The generated copy was unusable, and the way it failed is worth recording.** The CLI
produced three caption variants per platform, all of them *patch notes about load times*,
written in corporate first-person plural, for a game that has never been announced. One
opened "We just dropped an update for Spice Expert: Ramu that you NEED to know about" and
went on to explain asset downscaling to strangers. It had faithfully summarised the most
recent commit and mistaken that for a reason to click. Generated marketing copy takes its
subject from the changelog; a launch post's subject is the game. Rewrote both by hand.

**The surface answer mattered more than the copy.** Two consequences I did not have to
reason about while the funnel was hypothetical:

*Discord reciprocity is now the whole engine.* LinkedIn is one spike that decays inside
48 hours — a professional network does not return to a game daily. Playing and commenting
on other jam entries is the only repeatable source of new players in the project. §5.5 had
it as one line in a table of six surfaces; it is now the plan.

*The return loop moves up the ranking.* An audience reachable in the low hundreds cannot
win a summed-daily-uniques score on arrivals. It has to win on the same people coming back
across many days. That was always true and always second-order; with two surfaces it is
first-order, and it outranks the craft pass and further art work. Logged as item 31, to be
settled alongside the D1 retention re-check tomorrow.

*And r/KitchenConfidential is gone.* It was the highest-upside single post available to
this concept — real cooks, and "this game knows what the job is actually like" is a post
that travels on its own. There is no substitute for it on the remaining surfaces. Recording
it as a loss rather than quietly re-planning around it, because the reason the concept was
chosen was partly that audience.

**Link policy set:** vote page on the RUN Discord, where the audience votes as well as
plays; plain play link on LinkedIn, where a tracking shortlink reads as spam. `prepare`
has no `linkedin` platform, so per-platform attribution is lost there — acceptable, since
with two surfaces the split is readable from post timing alone.

**Still zero shared.** 35 cumulative players, all organic, as of this entry. Rank #3 on
15 plays. The drafts are written; the posting is the user's.

---

### Sep 4, 14:00 IST · First post shipped · telemetry re-diagnosed, and a play count that does not add up

**Distribution began.** The `#back-to-work` post went up; the LinkedIn post is scheduled.
After a day and a half live and 35 players arriving entirely on their own, this is the
first time anyone has been told the game exists.

**Telemetry was mis-diagnosed yesterday, and the correction is good news.** I recorded
item 25 as "the game emits ZERO gameplay telemetry" on the evidence that
`core_loop_events_30d` and `session_end_summary_30d` both exported empty. Two queries I
had not run say otherwise:

| Query | Result |
|---|---|
| `top_custom_events_30d` | `game_loaded` — 62 events, 47 unique players · `game_heartbeat` — 1,252 events, 44 players |
| `funnel_steps_30d` | `boot` / step 1 / `game_loaded` — 62 events, 100% conversion |

So the pipe works end to end. `main.tsx` step 8 fires one `recordCustomEvent('game_loaded')`
and one `trackFunnelStep`, and both arrive. The core-loop and session-end queries are empty
because **the game sends nothing to put in them** — not because delivery is broken. That is
a wiring job, not an investigation. **Two empty exports were enough to make me say "zero"
when a third and fourth query said "one event, delivered reliably."** An absence in one
report is a fact about that report until a second one agrees.

**A number that does not add up, and it is the score.** Summed daily uniques are 9 + 26 =
**35**. But `game_loaded` counts **47 unique players** and `game_heartbeat` 44 across the
same 30-day window. Distinct players over a window cannot exceed the sum of per-day
uniques — the sum double-counts anyone who returns, so it should be the *larger* number.
It is smaller by twelve. `daily_activity_30d` already revised Sep 3 from 2 to 9 once, so
lag is the leading explanation and the true count is probably higher than anything written
in these documents so far. Logged as item 32 and to be re-read tomorrow, when Sep 4 has
settled. Nothing is decided on it today, but no play-count figure here should be quoted as
final.

**The taxonomy is not documented.** `ANALYTICS.md` gives exactly two methods and no
mapping from event name to query bucket; the analytics catalogue describes
`core_loop_events_30d` as "core-loop event counts" without saying what qualifies. The
handover therefore treats the reserved names as a hypothesis to be tested in production
rather than a fact to be coded against — with `top_custom_events_30d` as the safety net,
since it catches every custom event regardless of name. Worst case we learn the routing
rule and rename; no data is lost either way.

**Traffic at 14:00 IST:** unchanged at 26 for Sep 4, 35 cumulative, rank #3 on 15 plays.
The Discord post is minutes old — too early to read, and the export lag means it will not
be readable today with any confidence.

---

### Sep 4, 14:41 IST · Phase 2 shipped — v1.2.1 · the game can finally be watched

Nine custom events and a six-step funnel, live. The determinism guarantee held: `npm run
balance` hashes **310e6e7a…c7b411b** before and after, and `src/game/sim/` and
`src/game/data/` contain no reference to the SDK. The engine still surfaces `EngineEvent[]`
and the consumer still does the emitting, which is the whole reason the balance verifier
survived a telemetry pass.

**The report's headline conclusion was wrong, and it was wrong in the exact way the
handover predicted.** It stated: *"None of ours — every custom event lands only in
`top_custom_events_30d`, NOT in `core_loop_events_30d` or `session_end_summary_30d`."*
Forty minutes later:

```
session_end_summary_30d
screen,trigger,event_count,unique_sessions,unique_players,avg_duration_s
playing,pause,1,1,1,0.0
playing,visibilitychange,1,1,1,0.0
```

`screen` and `trigger` carry exactly the values the game sends. **`session_end` routes
correctly; the taxonomy for that bucket is solved.** The agent had *itself* flagged
`session_end` as inconclusive-by-lag two paragraphs earlier, then wrote the categorical
version in the summary section. Both statements were in the same report, and the confident
one was the false one. The lesson is not about this agent — a summary line written from a
snapshot outlives the caveat attached to the snapshot, and a reader takes the summary.
**Where a caveat applies, it belongs in the conclusion, not beside it.**

`core_loop_events_30d` is genuinely still empty, and that one is now well-evidenced:
`level_start` (17 events) and `level_complete` (14) are demonstrably landing and are
verbatim the names `ANALYTICS.md` uses in its own example. So the bucket wants something
else — a registration step, or a narrower reserved vocabulary. The agent's recommendation
to stop guessing and ask RUN Operators is right, and renaming live events that are already
collecting real data would be the wrong trade.

**A third thing, found by not stopping at the first answer.** `session_end_summary_30d`
reports `avg_duration_s` **0.0**. The value actually sent, read back from
`custom_event_metrics_30d`, is **505.45 seconds** — a real 8.4-minute mobile session. So
two of the three columns map and one does not; the query reads some other field name for
duration. Purely cosmetic, since the true durations are intact one query over, but it would
have been easy to read that 0.0 as a bug in our own payload and go fix working code.

**First behavioural data in the project's history.** Tiny sample — v1.2.1 is minutes old
— and stated here only so tomorrow has a baseline:

| Funnel step | Sessions | Conversion |
|---|---|---|
| `menu_shown` | 3 | — |
| `run_start` | 2 | 66.7% |
| `first_tower_placed` | 2 | 100% |
| `first_wave_started` | 2 | 100% |
| `wave_1_cleared` | 2 | 100% |
| `run_end` | 1 | 50% |

Everyone who started a run placed a station and cleared the first wave. That is the
opposite of the failure I had been most worried about — an onboarding that does not
communicate that stations must be placed — and if it survives contact with a real sample,
§1d's ranking changes: the board would be failing to feel like a kitchen without failing
to be playable. **Two sessions prove nothing.** Re-read tomorrow.

One real gap in the instrumentation: `boot` and `run` are separate funnels, so
`funnel_steps_30d` cannot show `game_loaded` → `menu_shown`, which is the single most
valuable drop-off we have — it is the one the 16 MB preload was destroying. Logged as
item 36.

**The 14-credit charge was mine, not Phase 2's.** Three `llm` calls appeared against the
account; the agent guessed "platform/deploy overhead." They are `rundot socials prepare`
generating caption variants at 13:40. The agent spent nothing, as specified. Worth naming
because an unexplained charge on a shared account is exactly the kind of thing that gets
attributed to whoever touched the account last.

**Also reported, correctly out of scope and correctly not fixed:** the live host page
serves a Firebase App Check *"App Integrity check failed"* wall to automated browsers,
which is why no verification sessions could be played against production. Expected for
headless Chromium. The open question is whether it ever catches a *real* player behind a
privacy browser or a corporate proxy — that would be a silently lost play, and plays are
the score. Item 35, one hour, tomorrow.

---

### Sep 4, 14:55 IST · Design conformance audit — the build fails its own anti-reskin test

User asked how close the build is to the proposed gameplay. Audited GDD §10 against source
rather than against memory, and the answer is less comfortable than the last two days of
green checkmarks suggested.

**The GDD wrote its own pass/fail and the build scores 2 of 4.** §10.2's anti-reskin test:
a timed queue ✅, a hard boundary ✅, **parallel stations specialised by dish type** ❌, **a
manual expedite** ❌. Strip the kitchen art off today and what remains describes a tower
defence. That is the exact failure the concept was frozen to avoid.

**Core loop: two of five steps shipped.** Missing are step 1 (tickets showing the components
they need — `EnemyDef` has one `hp` field) and step 3 ("Hands!"). Step 4 is partial and has
drifted: the GDD freezes **five** walkouts, the build ships **ten**.

**One of two primary mechanics exists.** §10.3 caps primary mechanics at two and freezes
both. Station placement shipped on day one; "Hands!" was budgeted at *one evening, Day 2*
and has not been started. The GDD's own line about it: *"converts watching into playing; it
is the skill ceiling."* Right now a player sets a line and watches it work.

**The shift is 5–10× too long.** §10.1 specifies a 90-second shift; a measured `run_end`
shows 102 seconds for *two* waves out of thirteen plus endless. A 90-second shift and a
ten-minute run are different games, and the daily-rotation return loop in §10.9 assumes the
former — something you finish on a break.

**The correction that matters most is to my own §1d.** I ranked *"damage → doneness (~1 h,
pure presentation)"* as the top theme-conversion item yesterday. That is the cosmetic
version of §10.1 step 1, which actually asks for **component pips** — a ticket made of parts,
each serviced by a station *type*. Mechanical, not presentational, and it is the thing that
satisfies anti-reskin criterion 2. **I had ranked the cheap imitation of the frozen
requirement above the requirement.** §1e revises it: "Hands!" and component pips first, lane
rail last — the lane rail is the most visible change and the least load-bearing.

**What is genuinely close.** Naming and theming are coherent throughout (Heat, Fast Hands,
Reach; Dal Tadka through Full Thali). Art shipped. Economy, build phase and persisted meta
progression mean §10.1 step 5 is real. And today's funnel says everyone who started a run
placed a station and cleared wave 1 — the thing works, it just is not yet the thing that was
designed.

**Method note worth keeping:** this audit only exists because someone asked a question the
status board could not answer. Tasks.md tracks *what we said we would do*; nothing was
tracking *whether what we built matches what we froze*. Green checkmarks against a task list
are not conformance to a design. That is a gap in the process, not in anyone's diligence,
and §1e now closes it.

---

### Sep 4, 15:20 IST · Audio unblocked (CC0) · the handover that shrank on inspection

User cleared the five supplied WAVs as **CC0** and named three placements: `Ah` at the
game-over/try-again moment, `Level Up` on any upgrade, `Level Complete` after a wave
clears. Item 27 closes; item 19's credits screen is **ungated for SFX** — CC0 waives
attribution outright, so nothing is owed. NCS attribution still stands if BGM ever ships,
which is a separate obligation and stays open.

**Conversion was never optional, and the number says so.** The three named clips are
**1,433,008 bytes raw — 2.15× the entire shipped game** (667,292 B). Shipping them as
delivered would have undone Phase 1.5 twice over, thirteen hours after Phase 1.5 landed.
`Ah.wav` is a 24-bit/48 kHz stereo export carrying a broadcast `bext` chunk — a pro-audio
master handed to a browser — and four of the five overstate their RIFF size by 4 bytes.
Harmless individually; collectively the reason re-encoding is the job rather than copying.

**The handover shrank once I read the file it targeted.** I opened this expecting to
design a sample-playback system. `src/audio/audio.ts` already had the swap-in path written
into its header comment by the kit's author — *"SFX: fetch + decodeAudioData small files
(public/audio/) at boot, then have each named sfx.* function play its AudioBufferSourceNode
into sfxBus — call sites never change."* And all three requested moments already existed as
single-meaning named functions:

| Clip | Function | Fires at |
|---|---|---|
| `Ah` | `sfx.lose()` | `towerScene.ts:432` on the `lost` event — and `EndScreen` renders on `tdPhase === 'lost'`, so it already lands **exactly** as the try-again window appears |
| `Level Up` | `sfx.upgrade()` | 4 sites: in-run upgrade, two meta-upgrade buttons, end-screen ad bonus |
| `Level Complete` | `sfx.waveClear()` | `towerScene.ts:430` |

**Zero call sites move.** The whole change is one file. `sfx.win()` is separate, so "Ah"
correctly cannot fire on the campaign milestone — a bug I would have written by hand if I
had built the mapping before reading the seam.

**The design decision worth keeping is the fallback posture.** The synth stays, permanently,
underneath every one of the three functions. If the fetch fails, if `decodeAudioData`
throws, if the buffer has not arrived yet, the player hears exactly what they hear today.
Three sound cues are not worth any probability of a silent game on a device we cannot test
— and with the App Check wall blocking headless verification against production, "we cannot
test it" is the honest description of most of the audience.

**A frozen-item drift caught before it happened, not after.** Specs §8a froze the audio
format as `.ogg`/`.m4a` **sprites**; the handover specifies **MP3, three separate files**.
Rather than let that drift silently — which is the precise failure §1e diagnosed yesterday
— §8a now carries the revision with its reasons: `.ogg` fails *silently* on older iOS
Safari and 26 of 35 players are mobile-web, and the sprite rule exists to cap decoded
buffer count, which three buffers already satisfies. Flagged to revisit at ~8 cues. This
belongs in Specs rather than §3 below, because §3 is scoped to **GDD** frozen items and
this is a Specs decision — worth stating so the distinction survives.

**What no agent in this project can verify: how it sounds.** Mixing the samples against the
music bed and the remaining synth SFX is a human listening test. The handover says so
explicitly and requires the three gain constants to sit in one table at the top of the file
so retuning is a one-line edit. An implementation report claiming the balance is good would
be a claim neither agent is equipped to make.

**Still only 3 of 8 cues.** The five unpicked ones — sizzle, plate-up bell, ticket-print,
station-placed, walkout thud — are the *thematic* ones, the ones GDD §12 argues do the
theme's work. The three picked today are generic arcade feedback: welcome, cheap, and not
the same job. `Power Up` and `Pouring Water` sit unused and are logged as item 41 rather
than quietly dropped.

---

### Sep 4, 16:19 IST · Audio shipped (v1.2.2 → v1.2.3) · and a misattribution I have to correct

Three sampled cues are live at **42,793 B** — 46% of the budget — with the critical bundle
unchanged at 667,292 B and the balance hash still `310e6e7a…c7b411b` across two more
phases. The architecture is good and is recorded in Specs §8a.1: the synth stays as a
**permanent** fallback under every sampled cue, so a failed fetch or an unsupported decode
degrades to exactly what v1.2.1 played rather than to silence.

**v1.2.2 shipped with `Ah` on the wrong function**, and the correction matters more than
the bug. It was wired to `sfx.leak()` — which fires 4–10 times a run — instead of
`sfx.lose()`, so a 2.25 s vocal stuttered against the single-voice retrigger on every
walkout while game-over stayed silent. v1.2.3 fixed it.

**I told the user the handover had specified the mapping and the agent had ignored it.
That was wrong, and it was wrong in my favour.** The mapping table naming `sfx.lose()`
with its file:line was in the *analysis I wrote to the user*, above the `# HANDOVER`
heading. Inside the handover body, Step 2 read:

> Then the three functions become `if (playSample('…')) return;` followed by their
> untouched existing bodies.

An ellipsis. The handover never named which function got which clip. The agent inferred
`leak` from the clip's name — a defensible reading of "an *ah, no* moment" — and reported
the inference honestly as a deviation, which is exactly the behaviour the process wants.
**The omission was mine.** This is lesson 8 wearing a different costume: I had already
written *"a handover that names an outcome must name the flag that produces it"* after
Phase 1.5 shipped the wrong version number, and then shipped a handover that named the
objective but not the mapping.

Two parts of the critique do survive, and separating them from the part that does not is
the point of writing this down:

- The report claimed the MP3s were **committed**. They were untracked — v1.2.2 was live
  with no commit behind it. That is a checkable claim asserted without the check.
- The corroboration offered for the mapping was circular: the 1.74 s duration match spoke
  to `level-up`, which was never in question, and said nothing about `ah → leak` versus
  `ah → lose`. Confident-sounding evidence that does not bear on the choice.

**Phase 3.1 was the first zero-deviation report in the project**, and the agent named why
in its own words: this phase's instructions were *prescriptive, not interpretive*. That is
the whole finding. Where I specified exact edits and exact values, execution was exact.
Where I described an objective and left the mapping implicit, it drifted. The variable was
the handover, not the agent.

Both report notes were also honoured: the "committed" claim came back backed by pasted
`git log` and `git status` output. The one thing 3.1 reasoned about rather than checked
was the credit balance — correctly, as it happens; **132,561, verified unchanged**. But
"deploy is flat-cost, so I did not look" is an inference, and the 14-credit charge earlier
today is what that inference costs when it is wrong.

**The gains were arithmetic, not taste.** v1.2.2 ran all three samples at gain 1.0 against
synth cues peaking at 0.35/0.30/0.35 — the MP3s are normalised to −3 dBFS ≈ 0.708, so
they were +5 to +7.5 dB hotter than everything around them. That is calculable without
hearing it. What is *not* calculable is the last few dB, and that stays an open item.

**BGM has nowhere to live.** A 30 s stereo loop is ~360 KB against a 667 KB game — 54% of
the whole entry for one track. Specs §8a and `audio.ts`'s own ADAPT comment have always
said music streams from `cdn-assets/` via `fetchAsset()`, and **that path has never been
written.** Found while scoping the MusicGen pipeline, which is the good kind of accident:
the alternative was four generated tracks and no home for them. Item 42, and it gates the
music pass.

---

### Sep 4, 16:50 IST · A handover sent to the wrong agent — and the agent caught it

The Phase 4 handover (CDN music streaming) was written for the **implementation agent** and
reached the **MusicGen Prompt Agent** instead. That agent refused, correctly, and said why:
its scope is append-only writes to `docs/AudioGenPrompts.md`, never source, never git —
and Phase 4 asked it to edit `audio.ts`, run `npm run balance`, generate and delete test
audio, and commit. It offered the two possible explanations, asked which, and **declined to
guess.** That is exactly the behaviour a scoped agent should have, and it is worth logging
as a success rather than only as an incident.

**The routing error is structural, and it is mine.** This project now has *two* agents
taking instructions out of this one chat:

| Agent | Scope |
|---|---|
| Implementation agent | The `jam-entry/` codebase, builds, deploys, git |
| MusicGen Prompt Agent | One file, append-only. No source, no git, no follow-up questions |

Every handover I have written since Phase 1.5 opens `# HANDOVER — PHASE N · <topic>` and
**names no recipient.** That was unambiguous while exactly one agent existed. The moment a
second one appeared it became ambiguous by construction — and I proved it myself in the
same session: the MusicGen brief was addressed (*"BRIEF 1 — for the MusicGen Prompt
Agent"*) and Phase 4 was not. I addressed one and not the other, then relied on the user to
route correctly by inference.

**Fix, effective immediately:** every handover heading names its recipient, and carries a
one-line scope stamp under it saying what that agent may touch. A handover with no
addressee is not a handover, it is a note.

This is the same failure family as lesson 18 — Phase 3's mapping lived above the handover
heading instead of inside it. Both are cases of relying on context that surrounds a
handover rather than putting what matters inside the block that gets handed over. **The
block travels; the conversation around it does not.**

Also worth naming: the prompt agent was given the constraint *"you cannot ask follow-up
questions"* and still asked one. It was right to. That constraint exists so it resolves
*ambiguities of musical taste* with a stated default rather than stalling — it was never
meant to make it execute work outside its scope silently. A rule written for one axis
should not bind on a different one, and an agent that recognises the difference is more
useful than one that obeys literally.

---

### Sep 4, 18:02 IST · I declared a capability missing without checking the platform we ship on

Phase 4.1 closed cleanly — the implementation agent applied both replacements verbatim,
every gate re-verified, second zero-deviation report running. The interesting failure that
session was mine, and I found it by accident.

I opened the SDK typings to confirm `fetchAsset`'s options before writing a handover that
depended on them. Two interfaces away sat **`RundotGameAPI.audioGen`** — first-party
generation for `sfx`, `music` and `tts`, backed by ElevenLabs, Lyria 3 and MiniMax.

I had already told the user, in writing and twice, that the five thematic SFX cues
(item 13) could not be generated because *"AudioGen is audiocraft-only."* That statement
is true about **Meta's** AudioGen and completely irrelevant, because the question was never
"can Meta's tool do this" — it was "can we get these sounds." I answered a narrower
question than the one asked and reported the answer as if it settled the broader one. The
same reasoning also sent the user into a 22 GB local MusicGen install for BGM that the
platform may well do better and with no install at all.

What makes it a real lesson rather than bad luck: **I had read this SDK's typings four
times this project** — for `fetchAsset`, for the analytics surface, for the CDN options,
for the credits API. Each time I grepped for exactly the symbol I wanted and stopped. A
capability I never thought to name was therefore invisible no matter how often I looked at
the file containing it.

**Rule:** before recording *"X is not possible"*, enumerate the platform's own surface for
X. Grep the whole API for the domain — `audio`, `gen` — not the one symbol already in mind.
A negative claim needs a wider search than a positive one, because a positive claim fails
loudly when wrong and a negative one just quietly costs you the feature.

The cost here was small and recoverable: an install that still works and a parked task that
turns out not to be blocked. It would not have been if the jam had ended first.

---

### Sep 4, 20:15 IST · One agent owns music generation, and nothing else may produce a track

**Standing rule, effective now:** *no music file enters this project from any source
except the audio generation agent.* Not from me, not from the implementation agent, not
from a stray local `python gen.py` run. One producer, one log, one folder.

**Why it needed saying.** By this evening there were **three** live routes to a music
file: `rundot generate music` through the CLI, the local MusicGen venv at `D:\AudioGen`,
and me — I generated take 1 myself while proving the pipeline worked. Three producers means
takes with no prompt logged, no seed, no credit record, and no way to answer *"how did we
get this one?"* a week later. The provenance sidecar only helps if every file has one.

**What the agent now owns**, expanded from prompt-writing only:

| Before | Now |
|---|---|
| Write a prompt, log it to `AudioGenPrompts.md` | Same, **plus** run the generation itself |
| No file access beyond that one doc | Read/write `Ramu - The Chef/Audio/BGM/` — gitignored, so no repo risk |
| — | Spends **real credits**, so: `estimate` first, log the number, hard cap per batch |

Hard limits unchanged: no source, no git, no deploy, no `public/cdn-assets/`. Masters
only — converting a master into a shippable asset stays the implementation agent's job.

**The part worth remembering beyond this project:** the moment a second producer of the
same artifact exists, provenance stops being automatic and starts being a discipline. It
is cheaper to name the single owner than to reconstruct history later — the same shape as
lesson 20, where a second *recipient* broke routing. Adding a second anything to a
pipeline is what breaks the assumptions built when there was one.

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
| Sep 4 | **26** at 12:14, 13:24, 14:00 and 16:19 IST, day still open. ⚠️ `game_loaded` says **47 distinct players** — see item 32 | **35** (probably low) | #3 (15 plays) | **v1.1.0** title fix + 15 assets · **v1.2.0** payload 16.30 → 0.64 MB · **v1.2.1** telemetry · **v1.2.2** sampled SFX · **v1.2.3** SFX mapping fix | **RUN Discord `#back-to-work` — first post ever.** LinkedIn scheduled |

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
9. **Generated marketing copy summarises the changelog and calls it a reason to click.**
   `socials prepare` wrote launch posts about asset downscaling for a game that had never
   been announced. The tool's tracked links are the valuable output; treat its captions as
   a first draft of the wrong document.
10. **Ask what surfaces exist before planning the distribution.** §5 was written across six
   channels; two of them were real. The plan was not wrong so much as unasked — and the
   answer changed which *build* work ranks highest, not just which posts get written.
11. **An absence in one report is a fact about that report.** Two empty analytics exports
   became "the game emits zero telemetry" in the open-items list. A third query showed one
   event delivered 62 times to 47 players. Before writing *nothing is happening*, find the
   report that would show it if it were.
12. **Verify the report against the artefact, not against itself.** Phase 1.5's numbers
   were all correct — but they were only *known* to be correct after reading IHDR bytes,
   `du`, `git ls-files` and `rundot game info`. The gate is worth nothing if the briefing
   is a paraphrase of the report.
13. **Put the caveat in the conclusion, not beside it.** A report flagged `session_end`
   as inconclusive-by-lag, then summarised it as "none of our events routed." Forty
   minutes later it had routed. Summaries are what get read and acted on; a hedge two
   paragraphs up does not travel with them.
14. **Don't stop at the first thing the query explains.** `avg_duration_s` read 0.0. The
   value sent was 505.45. Reading the reserved query alone would have sent someone to fix
   correct code.
15. **A task list cannot tell you whether you built the right thing.** Fifteen green
   checkmarks and a frozen GDD coexisted with a build that fails the GDD's own
   anti-reskin test 2–4. Audit the artefact against the design, on a schedule, not only
   when someone asks.
16. **Beware ranking the cheap imitation of a requirement above the requirement.** §1d put
   "damage → doneness, pure presentation, ~1 h" first. The frozen design asked for
   component pips — mechanical, structural, and the actual point. Cheap and adjacent is
   not the same as cheap and sufficient.
17. **Read the seam before designing one.** The audio job looked like "build a sample
   system." The target file already documented the swap-in path in its header comment, and
   all three requested moments were already single-meaning named functions with
   `sfx.lose()` firing exactly where the end screen mounts. The handover collapsed to one
   file and zero moved call sites — and reading first also avoided wiring the clip into
   `sfx.win()`, where it must not fire.
18. **The handover is what sits under the handover heading.** Phase 3's `ah → sfx.lose()`
   mapping lived in the analysis written *above* the handover; the handover body said
   `playSample('…')`. The agent inferred `leak`, shipped it, and I told the user the
   handover had specified otherwise. It had not. Everything an implementer needs must be
   inside the block they are handed — a table two sections up is context for the reader,
   not instruction for the doer.
19. **Prescriptive instructions get executed; described objectives get interpreted.** The
   first zero-deviation report in the project was the one that listed exact edits and
   exact values. Every drift so far has come from a handover that named a goal and left
   the mechanism implicit. Where the outcome matters, write the line, not the intent.
20. **Name the recipient in the handover heading.** Once more than one agent takes
   instructions from the same chat, an unaddressed handover is ambiguous by construction.
   Phase 4 was written for the implementation agent and reached the prompt agent, which
   refused correctly. In the very same session I *had* addressed the MusicGen brief and
   not the handover — the inconsistency was mine, not the router's. Heading names the
   agent; a one-line scope stamp sits under it.
21. **Record what to ignore, not just what to do.** Two unlisted games on the account
   look exactly like entry candidates in `list-games`. §0 exists so a tired future
   session cannot deploy to the wrong game ID.
23. **Name the single producer of any artifact that carries provenance.** Three routes
   to a music file existed at once — the RUN CLI, a local MusicGen venv, and me. Only one
   agent generates music now, and every take is logged with its prompt, parameters and
   credit cost. A second producer does not halve the work, it destroys the audit trail.
   Same family as lesson 20: adding a second anything breaks assumptions built for one.
22. **Before recording that something is impossible, search the platform's whole surface
   for it.** I parked the five thematic SFX cues as ungeneratable because Meta's AudioGen
   is audiocraft-only — true, and irrelevant: the RUN SDK ships `audioGen.generate()` for
   `sfx`, `music` and `tts`. I had read those typings four times, each time grepping only
   the symbol I already had in mind. A negative claim needs a wider search than a positive
   one: a wrong positive fails loudly, a wrong negative silently costs you the feature.
24. **Let the inventory choose the verbs.** Designing the prop set, the obvious first
   verb was *chop* — and a chopped onion has no sprite in either pack, so it could never
   be a visible state. Checking which `out` states already had art *before* choosing the
   verbs turned a wish-list into an eleven-transform graph that is buildable today, with
   the one genuinely missing sprite (`chai`) named as the single generation job rather
   than discovered mid-build. On a 14-day clock the asset inventory is a design input,
   not a procurement step that happens afterwards.
25. **A tool that writes into a directory it did not clear reports a mix of every run
   it has ever done.** The sprite slicer wrote `01.png … 66.png` on a bad pass, then
   `01.png … 52.png` on the corrected one — and left 53–66 sitting there, visually
   indistinguishable from real results. The user found them before I did, because I
   checked the *count the script printed* rather than the *files on disk*. **Verify the
   artifact, not the log line**; the log describes what the code believed it did, and
   those are different claims. Fix is one line: purge the output directory first.

26. **When one cut rule has to serve two different kinds of object, ask what actually
   distinguishes them — not what is easiest to measure.** Slicing the isometric props
   sheet, sixteen cabinets shared their edges as one 512px blob and the obvious fix was
   to cut at the column with the least ink. It worked on the cabinets and it also cut
   **every chair in half at the waist** and separated **every plant from its pot**,
   because a chair has a narrow middle too. Depth of valley does not distinguish them.
   *Periodicity* does: the cabinet run autocorrelates at 0.84, a chair at 0.19, and
   nothing sits in between. The rule that fires only on genuine repetition needs no
   exceptions list, and every split it made across four sheets landed on the same 32px
   pitch — which is an external check the earlier rule could never have offered.
27. **A palette can be transferred; a resolution cannot.** The recolour of the props
   pack worked exactly as measured — b\* +2.3 → +12.3 against the target's +17.4, chroma
   12.1 → 21.3 against 22.1, 57 colours in and 57 distinct out. And it does not make the
   two packs usable together, because Essentials items are a median **94×124 px** of
   painterly art and Props items are **32×32 px** of flat isometric pixels. I spent the
   colour work before checking the scale, and the colour work was the part I could
   measure. **Check the difference you cannot fix before spending effort on the one you
   can.** The finding is still worth having — it turns "make them match" into a real
   choice between three options — but it should have been the first hour, not the third.
