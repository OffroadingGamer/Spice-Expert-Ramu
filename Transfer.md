# Transfer — what the September jam taught, for the October one

**Written Oct 9 2026, at the close of *Spice Expert: Ramu*.**
**For: whoever starts the October jam — the developer and the agents working with them.**

This is not a retrospective. It is the subset of a 153-lesson retrospective that will still be
true on a different game: platform behaviour that cost real time to discover, process that earned
its keep, and the specific mistakes worth not repeating.

**How to use it:** read Part 1 before the first deploy, Part 5 before writing any plan. Parts 2–4
are worth one pass now and a re-read at the midpoint.

---

## Part 1 — RUN platform facts, and what each one cost to learn

Every item here was established from the CLI or from source, not from documentation.

### 1.1 🔴 Tags: moving Review moves Public

**This is the single most important platform fact in this document, and it was discovered on the
last day.**

RUN has three tags — `private`, `review`, `public`. The intuitive model is three gates you advance
through deliberately. **That model is wrong.**

```
rundot game update-tag review --version X
   → Review's label drops its "(Approved)" parenthetical while moderation re-reviews
   → on approval, the label returns to "(Approved)"
   → and PUBLIC SILENTLY FOLLOWS to the same version, within minutes
```

Verified by moving Review and then taking three `list-tags` reads ~200s apart **with nothing else
run in between**. `update-tag public` was never issued. Public moved anyway.

⚠️ **So `update-tag review` is a production deploy on a short delay.** Treat it as one. Twice on
this project a tag change was attributed to an agent that had not made it, because nobody knew the
platform does this.

- A **bare `Review`** label (no parenthetical) means *awaiting moderation*. It is not an error.
- `set-public` / `set-private` are a **different axis**: they control only whether the game appears
  on the **explore page**. A private game *"will still be accessible via its share link."*
  🔴 **Never run `set-private` on a game with traffic — it delists a live game.**
- Nothing in `list-versions` carries an approval status. The tag label is the only moderation
  signal the CLI exposes.

### 1.2 Changelogs are deploy-time only

`--changelog` and `--changelog-file` exist **only on `rundot deploy`**. `rundot game configure`
cannot set release notes, and there is no retroactive path. A build deployed without a changelog
has no About-tab notes **forever**, unless you redeploy and mint a new version number.

✅ **So: decide the changelog before the deploy, every time.** Use `--changelog-file` from an agent
— the flag exists precisely so prose doesn't go on a command line.

Without one, `rundot socials prepare` **invents** patch notes. It will confidently describe
features that do not exist.

### 1.3 ⚠️ Server configs are versioned independently of builds — and the repo file is not the config in force

A tag carries a **Version** *and* a **Server Config Id**, and they move independently. A tag can
advance three versions while keeping a server config uploaded weeks earlier.

**This cost us a feature for thirteen days without anyone noticing.** A `daily` leaderboard period
was added to `rundot/leaderboard.config.json`, the client shipped a "Today" tab in two languages
and submitted scores to it — and the period **never existed on the service**, because Public and
Review still pointed at a server config predating it. Zero submissions in thirteen days.

🔴 **A seal check or a diff proves a file did not change. It says nothing about whether the service
is running it.** Those are different claims.

✅ **Rule: for anything uploaded rather than bundled — server configs, runtime configs, leaderboard
definitions, tag pointers — verify by reading it back FROM the service.** The repo is the intent;
the service is the fact.

### 1.4 Leaderboards

- Instances are named `<gameId>_<mode>_<period>` and are created from the **deployed server
  config**. A period absent from that config simply does not exist; writes to it no-op silently.
- `rundot leaderboard config` reports the **active** config and lists every real instance. Run it
  after any deploy that touches leaderboards. If an instance you expect isn't listed, it isn't real.
- `stats <id>` gives players, score range, shadow-bans and last submission — a cheap, honest health
  check.
- 🔴 **`remove`, `reset` and `ban` are irreversible and destroy other people's scores.** On this
  project they were permanently forbidden. Keep that rule.
- Anti-cheat is server-side and configurable (`minTimeBetweenSubmissionsSec`, z-score detection,
  trust decay). You do not need to build your own.

### 1.5 Moderation is real, and it rejects specific strings

Two concrete rejections on this project:

- the **standalone word "Pot"**
- a **changelog containing the artist's surname**

Neither is documented anywhere. ⚠️ **Budget for a moderation rejection in your schedule**, and keep
proper nouns out of changelogs.

### 1.6 Analytics — what exists, and the trap

`rundot analytics queries` lists ~25 pre-approved exports; `rundot analytics export <key> --output
f.csv` is read-only, instant and free. The useful ones:

| Export | Use it for |
|---|---|
| `version_mix_30d` | **Which build your data actually describes.** Check this first, always |
| `funnel_steps_30d` | step counts and conversion |
| `retention_by_platform_30d` | D1 / D7 / D30 by platform |
| `top_custom_events_30d` | whether your events fire at all |
| `crash_free_summary_30d` | stability by version and platform |
| `daily_activity_30d` | sessions, uniques, median and p95 duration |
| `error_breakdown_7d`, `crash_sessions_7d` | stack traces |

🔴 **The trap that cost me a wrong diagnosis: `funnel_steps_30d` prints MULTIPLE funnels in one
table, under a `funnel_name` column.** I compared step 1 of the `boot` funnel against step 1 of the
`run` funnel, called the difference a 34% drop, and briefed it as the headline problem. They are
not consecutive steps. **Before treating two rows as consecutive, check they share a funnel.**

Two more:

- **A boot-only funnel is not instrumentation.** `game_loaded` alone proves the app loaded and
  nothing else. Register ≥3 steps: loaded → first action → first completion.
- **If step N+1 has more sessions than step N, your ordering is wrong**, not your game. That is a
  reliable signal of a mis-numbered step.

✅ **Instrumentation is ~15 minutes with a thin wrapper. Do it on day one.** Every later diagnosis
needs it, and you cannot retrofit the history.

**Payload rule:** numeric values must be **top-level, never nested**, or the percentile exports
can't see them. **Event names freeze the moment they ship** — so name an event for its *common*
case. I shipped `recipe_completed` for an event that fired on every shard award with
`completed: 0`, and had to rename it while the build was still private.

### 1.7 Credits and billing

`rundot credits` breaks spend into **exactly four service rows**: `llm`, `imagegen`, `audiogen`,
and **`unknown`**.

⚠️ **`unknown` is not an error row and can be your largest line.** On this account it was **7 calls
for 91,101 credits — 76% of September's entire spend**, almost certainly Video Studio work, and
unlabelled. If a dashboard panel claims "N AI features" for your game, that is likely **this
breakdown mis-filed as runtime AI**, not per-player inference. We confirmed zero AI SDK calls in
the shipped bundle.

Also: a credit **balance is not a budget until you know its expiry**, and balances can go **up**
without warning (a grant landed between Oct 2 and Oct 9 on this account).

### 1.8 SDK gotchas worth knowing before you write code

- **`await RundotGameAPI.initializeAsync()` once at boot, before any other SDK call.**
- **Every SDK call can reject, and an unhandled rejection crashes the game.** Wrap everything.
  A fire-and-forget wrapper guarded by a `sdkReady()` check is the right shape.
- 🔴 **Never fire a fresh SDK RPC from `onSleep` or `onQuit`.** A hard close tears down the runtime
  before it lands. Persist there; do everything else while the app is alive. (For notifications,
  schedule at boot, on resume, and at end-of-run.)
- **`onQuit` may not fire at all.** Treat `onSleep` as the reliable one.
- ⚠️ **`notifications.scheduleAsync` is DEPRECATED.** The SDK's own types say:
  *"Use `submitMessageAsync({ channels: ['local'], ... })` instead."* It still works, but the SDK
  emits an `sdk_deprecated_schedule_async` telemetry event roughly once per player per day. 🔴 **The
  bundled `rundot-feature-notifications` skill still ships the deprecated call** — so if you use
  that skill, fix this as you copy it in.
- **Trusted server time** (`getFutureTimeAsync` / `requestTimeAsync`) exists. Use it for anything
  day-based — daily caps, rollovers — and use **one** clock, not one per feature.
- ⚠️ **App Check / reCAPTCHA Enterprise flags headless browsers** and can 403-throttle for 24h.
  Automated QA against *production* will trip it. Test on Private, or accept the throttle.

### 1.9 Assets

- 🔴 **`.png.json` / `.mp3.json` sidecars must never be copied into `public/`.** Generator output
  carries them; they are not web assets.
- ⚠️ **Pixi v8 has no Devanagari fallback** — it falls back to Arial and renders tofu. Any string
  drawn by Pixi rather than the DOM must stay Latin. We kept three (`Lv↑`, `{b} dmg`, `{b}/s`)
  deliberately untranslated for this reason.
- **Dynamically-constructed asset keys look orphaned to a literal grep.** On this project five
  families were built from template literals — `` `bg-block-${id}` ``, `` `chef-body-${label}` ``,
  `` `chef-face-${letter}` ``, `` `dish-${slug}` ``, `` `district-${id}` ``. My first orphan scan
  returned 62 assets to delete; **the correct answer was 44**, and the extra 18 would have destroyed
  the entire chef portrait system. ✅ **Before deleting any asset, grep for template-literal
  construction of its key prefix.**

### 1.10 `rundot socials` — free, and never skippable

Commands: `prepare`, `status`, `open`, `next`, `promo`, `mark-posted`, `verify`, `profile`.
**There is no `cancel`** — a fresh `prepare` supersedes the previous packet rather than replacing
it, so always confirm with `status` which packet you are editing.

🔴 **Never run bare `prepare` and post the output.** Without a profile and a changelog it produces
generic "cherished adventurer" filler that echoes your game description. The CLI's real value is
**tracked links, prefilled composer URLs and a posting checklist** — the captions are a draft to
steer. The path is: `profile set` → changelog on deploy → `prepare --update <version>` →
**rewrite every caption** → post → `mark-posted` → `verify` → Discord `#showcase`.

⚠️ `socials profile` is **account-wide**, shared across all your games. Write reusable values.

🔒 **Share URLs: `private` and `review` links carry a `?k=<32-hex>` secret.** Never post one, never
commit one. Only the bare public URL and `prepare`'s `?s=` tracked links are safe.

---

## Part 2 — Jam strategy: what actually moved the needle

**Result: 6th of 100. 638 daily unique players, 942 total plays, 15 days in jam. No prize.**
Behind 5th by **112 DUP** — a gap that opened in the final 24 hours (the game ahead took 121 that
day to our 25).

### 2.1 The ranking metric is daily unique players, and it is a marathon

Prizes went to 2,063 / 1,770 / 1,280 / 976 / 750 DUP. ⚠️ **The decisive movement happened on the
last day**, when we had stopped pushing. If the jam ranks on DUP, the final 48 hours are worth more
attention than the final 48 hours of polish.

### 2.2 🔴 Paid acquisition lost, and organic won

| | Result |
|---|---|
| Spend | **$80.96 of $82** |
| Installs | **22** |
| CPI | **$3.68** |
| ROAS | **0.00x** |
| Attribution | **never credited a single install** |

A second campaign was rejected outright and spent $0. ✅ **For a jam, free organic distribution —
Discord `#showcase`, a devlog, a tracked share link — is where the players came from.** Do not
spend money to validate a build that hasn't been shown to a community first.

### 2.3 A 45-second video, published 20 minutes before the deadline, was automatically in
consideration for Editor's Picks

No form, no submission. ⚠️ Editor's Picks is **judged, not metric-based** — a game with **159 DUP**
won $300 while we placed 6th on 638. **So a strong, specific hook beats raw numbers for the judged
awards.** Make something showable, and make it early enough to use in the posts.

### 2.4 🔴 Scope: two modes was the project's biggest mistake

The game shipped a tower-defence mode *and* a half-finished conveyor "Kitchen" mode. The second
one gated a five-node progression, pulled in a third-party UI pack, and absorbed weeks. **It was
deleted on Sep 30** — seven source files, a whole data layer, and 906 kB of assets.

✅ **One mode, finished, beats two modes half-done.** The deletion made the game better in an
afternoon. Decide the single mode on day one and refuse the second.

---

## Part 3 — The process that earned its keep

This project ran a developer plus a central planning agent plus specialist agents
(implementation / art / audio / marketing). **These are the rules that paid off, and they are worth
carrying over verbatim.**

1. 🔒 **Every agent return is pasted VERBATIM into a ledger before anyone verifies it.** Agents are
   compacted after each task; the ledger is the only durable copy of their own words. Paste first,
   then verify — otherwise you verify your memory of the report.
2. 🔒 **Verify from source, never from the report.** Not because agents lie — they rarely did — but
   because the honest ones are confidently wrong about the same things you are.
3. 🔒 **Sealed files.** A short list of files no implementation round may touch (simulation core,
   balance data tables, lockfiles). Diff them after every round. Seven entries here, byte-identical
   every time for 24 rounds.
4. 🔒 **A balance baseline as a regression test.** Five scenario outcomes printed by one command
   (`35 / 36 / 11 / 4 / 90`). Unchanged for 24 rounds. ✅ **Any gameplay change that moves a number
   you did not intend to move is caught in one line.** This was the highest-value piece of tooling
   on the project.
5. 🔒 **A secret scan with a three-line positive control before every commit.** The control plants
   known secrets and the scan must find them. **If the control doesn't print, the scan didn't run.**
   Catches the failure mode where a regex silently matches nothing.
6. 🔒 **Handovers are delivered as text to the developer, never executed by the planner.** The
   human gate is the point.
7. 🔒 **A handover's record entry is written when the handover is written**, not when it returns.
   A round with no entry has not been handed over.
8. **Verify by execution, not by regex, wherever possible.** For parity checks I bundled a real
   checker with the project's own esbuild and read actual `Object.keys()`. Twice a grep gave me a
   wrong count I then briefed as fact.
9. **Stage commits by explicit path, never by directory.** A `git add <dir>` swept 255 lines of an
   agent's unread work into a commit whose message described something else.

---

## Part 4 — The mistakes most likely to repeat

Distilled from 153 recorded lessons. These are the patterns, not the incidents.

### On verification

- ⚠️ **"No issues" is scoped to the checks that were run.** Say which checks.
- 🔴 **Before trusting a negative result, prove the scan can find a positive.** My scaffolding scan
  searched `window.__` and `globalThis.__`; the codebase writes
  `(globalThis as typeof globalThis & {…}).__name__`, so the pattern could never match. It passed
  for the wrong reason.
- **A claim carried through a summary or a compaction is a claim, not a status.** Re-read the source
  before repeating it.
- **A state change plus a plausible actor is not evidence of who acted.** Twice a tag move was
  attributed to an agent that hadn't made it. The platform had.
- **Verify against the artefact, not the document describing it.**
- **A disclosed number is still a claim.** Recompute it.

### On measurement

- 🔴 **Measure the thing, don't infer it from a proxy.** I sized a CSS fix from character counts
  without ever measuring the box; the agent measured and found 12 of 22 cases still overflowed.
- **A day still in progress is not a data point.**
- **Name what a threshold is a threshold OF.**
- **The wrong instrument can invert the answer and still look like a result.**

### On briefs and handovers

- 🔴 **Scope a blocker to the deliverable it blocks, never to the round.** I labelled a six-part
  round "blocked" when one part was. A literal reading was "do nothing."
- 🔴 **When a round adds a player-facing surface, state which screen a COLD BOOT lands on, and
  require the acceptance check to start there.** This is the one that bit hardest — see Part 6.
- **A handover outlives the state it describes.** Date it and name the version.
- **Prescriptive instructions get executed; described objectives get interpreted.** Choose
  deliberately.
- **If you propose something in chat after the handover is written, revise the handover.**
- **Sample code and expected-value tables in a brief are claims** — derive them or don't include
  them.

### On agents specifically

- ✅ **When an agent contradicts a caution you keep repeating, check the caution.** Three times this
  project an agent was right and the standing warning was stale.
- ✅ **When an agent re-derives a bug to a different place than your brief named, believe the agent
  and re-check the brief.**
- ⚠️ **An agent's account of its own environment can be confidently wrong.** Verify independently.
- ✅ **A good agent flags its own uncertainty.** One inferred a Discord handle from a public URL and
  said so three times rather than letting it pass. Reward that; it is the behaviour you want.

---

## Part 5 — October jam: a checklist

**Before writing any plan:**

- [ ] `rundot whoami` — confirm the right account before anything else.
- [ ] Decide **one mode**. Write down what you are refusing to build.
- [ ] Decide the **ranking metric** and whether it rewards a sprint or a marathon.
- [ ] Set up the **balance/regression one-liner** before the first mechanic lands.
- [ ] Set up the **sealed-file list** and the **secret scan with its control**.
- [ ] Start the **verbatim agent-return ledger** on day one, not day eight.

**Day one, in code:**

- [ ] `await initializeAsync()` first; every SDK call wrapped.
- [ ] **Analytics with ≥3 funnel steps** — loaded → first action → first completion. ~15 minutes.
- [ ] Numeric event payloads **top-level**. Names chosen for the common case.
- [ ] Lifecycle: persist on `onSleep`, never RPC from it, don't rely on `onQuit`.
- [ ] One trusted server clock.

**Before the first public deploy:**

- [ ] Changelog written — it cannot be added later.
- [ ] `rundot leaderboard config` read back from the service, confirming every expected instance.
- [ ] No sidecars under `public/`.
- [ ] Remember: **`update-tag review` will promote Public within minutes.**

**Throughout:**

- [ ] Check `version_mix_30d` before drawing any conclusion from analytics.
- [ ] `socials profile set` early; post on every meaningful ship, not just launch.
- [ ] Watch the **last 48 hours** if ranking is DUP-based.
- [ ] Don't spend on paid UA to answer a question a community post answers free.

---

## Part 6 — Ramu's open items, so they aren't lost

The game is **live at 1.99.0** and in good health: **100% crash-free** on every analytics row,
two live leaderboards, real players. Four things remain, all documented in
`Ramu - The Chef/docs/Ideas.md`:

1. 🔴 **§5d — the daily reward is unreachable, and an announcement is parked behind it.**
   `dailyRewardsOpen` is patched at exactly one site, `MainMenu.tsx:501`, and the game boots
   straight to `phase: 'playing'` — the Main Menu is only reachable after a run.
   **`daily_reward_shown` has fired zero times across 29 players.** A verified social packet
   (`9e9146e2`) is written and held because its captions advertise that reward.
   **⚠️ This is the lesson of the whole project in one bug: the feature works, the test passed, and
   nobody asked where the player actually starts.**
2. **§5d — swap `scheduleAsync` for `submitMessageAsync({ channels: ['local'] })`.**
3. **§5b — the `daily` leaderboard period still doesn't exist on the service.** The fix is a
   server-config repoint, which is *not* verified safe with 113 and 107 real scores behind it.
4. **§5c — the daily-reward claim persists only because `addGems()` uses a shallow spread.** A
   future deep-clone there breaks claims **silently**.

**Two user-side items:** the socials profile's Discord handle is an inferred guess, and
r/SoloDevelopment posting cadence has never been checked.

---

**The one-line version:** the platform's defaults will surprise you, so read it back from the
service instead of the repo; one finished mode beats two unfinished ones; and when you add
something for a player to find, start the test where the player starts.
