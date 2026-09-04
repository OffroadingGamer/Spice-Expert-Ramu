# Jam-Day Runbook — from empty folder to leaderboard

A start-to-finish tutorial for **September Jam** (RUN), written to be followed
under time pressure. Companion docs: [Guidelines.md](Guidelines.md) (rules) ·
[RUN-CLI-Setup.md](RUN-CLI-Setup.md) (toolchain state).

**The single rule that shapes everything below:**
Score = **Total Unique Daily Plays** — unique players summed *per calendar day*,
counted from **the moment you publish** until **Sep 18, 12:00 PT**.
So: publish early, and give people a reason to return on a *new day*.

Deadline: **Sep 14, 12:00 PT** (pencils down). Plays keep counting to **Sep 18**.

---

## Step 0 — Before the theme drops (do this now)

```powershell
# In a FRESH terminal (PATH change only applies to newly-started shells)
rundot login          # browser sign-in; once only
rundot whoami         # must print your email — this is the gate
rundot --version      # expect 7.14.3 or newer
```

Also:
- Restart Claude Code so the 24 RUN skills load (they load at session start).
- Join Discord: https://discord.gg/XY2ynd3gn3 — the theme, kit names, and office
  hours are announced there first.
- Sign up for the **100,000 free credits** code on the event page.
- **Do not start the entry.** Anything begun before Sep 3, 12:00 PT is disqualified.

> ✅ **Checkpoint 0 passes when `rundot whoami` prints your email.**

---

## Step 1 — T+0 · Theme drops (Sep 3, 12:00 PT)

Read the reveal on the event page and Discord. Capture three things:

1. The **exact theme wording** (paste it into a `THEME.md` in your project).
2. The **official kit names** — the positional arg for `rundot jam init`.
3. Any **theme-specific eligibility** ("full eligibility details land with the reveal").

**Concept lock: give yourself 60–90 minutes, no more.** Judge candidate ideas
against the scoring rule, not against ambition:

| Ask | Why it matters |
|---|---|
| Can a stranger understand it in 10 seconds? | Drives share-through and play conversion |
| Is there a reason to open it **tomorrow**? | Every return day is another point |
| Can I ship a rough playable **today**? | Day-1 publish is worth ~15 scoring days |
| Does it fit the theme unambiguously? | Off-theme = ineligible |

Write the one-sentence pitch down. If you can't, the idea is too vague.

> ✅ **Checkpoint 1: theme captured verbatim, kit chosen, one-sentence pitch written.**

---

## Step 2 — Scaffold a fresh project folder

Keep the game **out of** the notes folder. Sibling folder, no spaces is safest:

```powershell
cd "d:\Jobs and Corporate\Portfolio Projects\Game Design\Projects\September GameJam"

# Kit name is a positional argument; get the exact string from the reveal
rundot jam init <kit-name> jam-entry

cd jam-entry
npm install
npx rundot-sdk-setup        # copies full SDK docs into rundot/docs/ + indexes CLAUDE.md
                            # (NOT `rundot download-docs` - removed in CLI 7.14.3)
```

Then **open `jam-entry` as its own VSCode window and start Claude Code there**, so
the agent works on the game and not on your notes.

First thing to tell the agent in that session:

> Read `rundot/docs/` and the `rundot-sdk` skill before writing any SDK code.
> Then build: *[your one-sentence pitch]*. Keep the first version small and playable.

```powershell
npm run build               # must succeed, and ./dist must exist
```

> ✅ **Checkpoint 2: `npm run build` succeeds and `./dist` exists, from a kit-scaffolded folder.**

---

## Step 3 — Ship a rough playable **on day one**

This is the highest-leverage act of the entire jam. Do not polish first.

```powershell
rundot init --name "Your Game" --description "one-line hook"
npm run build
rundot deploy               # → PRIVATE share URL + QR code
```

Open the share URL on your **phone** and play it. Fix only what makes it
unplayable — not what makes it unimpressive.

Then go public:

```powershell
rundot game set-public      # submits for review
```

Verify it actually landed:

```powershell
rundot list-games           # confirm visibility/approval state
```

Entries appear on the leaderboard **~5 minutes after approval**. Keep
`game.config.json` — it identifies the game for every later deploy.

> ✅ **Checkpoint 3 (target: before you sleep on Sep 3): status is public + approved,
> and the entry is visible on the leaderboard.** Every hour before this is score you cannot recover.

**Why rough-and-early beats polished-and-late:** publishing Sep 3 buys ~15 scoring
days; publishing Sep 10 buys ~8. Updates never reset your entry or its play count,
so there is no penalty for shipping early and improving in place.

---

## Step 4 — Days 2–3 · Make it survive first contact

Now polish, in this order. Iterate with:

```powershell
npm run build
rundot deploy --bump Patch     # Patch | Minor | Major
```

**Priority 1 — mobile.** Most plays arrive on phones. Use the `rundot-mobile-ux`
skill: portrait-first, anchored responsive layout, safe-area insets, touch-safe
hit targets. A game that feels wrong on a phone loses plays at the door.

**Priority 2 — FTUE.** Use `rundot-ftue-onboarding`, and `rundot-feature-tutorial`
for the implementation. Target: **fun within 30 seconds, no wall of text.** Teach
by doing. Most drop-off happens in the first session.

**Priority 3 — stability.** Per the `rundot-sdk` skill: every SDK call can reject,
and an unhandled rejection crashes the game. Wrap them.

> ✅ **Checkpoint 4: a first-time player on a phone reaches the fun in under 30 seconds
> without being told anything.** Test on someone who has not seen it.

---

## Step 5 — Days 3–5 · Build the return loop (the score multiplier)

Scoring counts each player **once per day they play**. A player who returns on 8
days is worth 8× one who plays once. This is where the leaderboard is won.

Install the mechanics rather than inventing them — these ship copy-in TypeScript:

| Skill | What it gives you |
|---|---|
| `rundot-feature-daily-rewards` | Forgiving reward track, local-midnight rollover on a **trusted server clock**, claim popup, badge, come-back reminder |
| `rundot-feature-daily-quests` | Day-rolled quest slots, seeded deterministic rolls, engagement-scaled targets |
| `rundot-feature-notifications` | Re-engagement reminders with cancel-first dedupe and a clean opt-out |
| `rundot-feature-save` | Versioned save blob on `appStorage` — progress persists, so returning feels earned |
| `rundot-feature-stats` | Lifetime counters and a records screen — long-horizon goals |

The server clock matters: rewards can't be farmed by changing device time, which
also keeps you clear of the anti-gaming rules.

> ✅ **Checkpoint 5: closing the game and reopening it tomorrow produces a visibly
> different, rewarding experience — and a notification invites it.**

---

## Step 6 — Days 4–14 · Distribution, every single day

Plays don't arrive on their own. Make sharing a daily habit, not a launch event.

```powershell
rundot jam promo     # shareable play links, a caption, and social share URLs
rundot socials       # launch packets and tracked links
```

Daily rhythm (15 min):
- Post the share link in the **jam Discord channel** — swap plays with other jammers.
- Post to Reddit, X, group chats. Each post is a fresh wave of *that day's* uniques.
- Post **progress updates**, not just the launch. A visible changelog gives people
  a reason to return, and returns are worth full points.
- Point people at the leaderboard — watching standings move pulls in more attention.

Track it:

```powershell
rundot analytics     # who plays, where they drop
rundot leaderboard   # standings
rundot credits       # balance — top up on Discord before it bites
```

> ⚠️ **Never** use bots, click-farms, incentivized clicking, or self-play farming.
> RUN audits play counts, and it voids **all** your entries.

> ✅ **Checkpoint 6: you have shared on at least 3 surfaces, and daily uniques are
> non-zero and trending up rather than decaying to zero after launch day.**

---

## Step 7 — Days 8–10 · The Editor's Pick hedge

**$300, chosen by the RUN team, completely independent of play counts** — and an
entry can win the leaderboard *and* Editor's Pick. This is a second, uncorrelated
shot at money, so spend a couple of days on craft:

- One striking, memorable visual or mechanical idea — not generic polish
- Cohesive art and audio direction
- A clean, confident first 30 seconds (editors will play briefly)
- An entry page that reads well: sharp name, sharp description

**Optional second entry — the cheapest expected value on the board:** a Story
Studio or Video Studio entry competes for a **separate $500 pool** (3 awards,
$300/$100/$100), judged editorially, **needs no kit**, and is a much smaller field
than the Game track. If you have a spare evening around Day 8, publish one.
Multiple entries are explicitly allowed and each competes on its own.

> ✅ **Checkpoint 7: someone who has never played can name one thing that makes it
> distinctive.** If the answer is "it's polished", that's not enough for Editor's Pick.

---

## Step 8 — Sep 14, before 12:00 PT · Pencils down

```powershell
npm run build
rundot deploy --bump Minor
rundot list-games          # CONFIRM: public + approved
```

Final checks:
- [ ] Public **and approved** — not merely deployed
- [ ] **Every team member credited** on the entry (explicit rule)
- [ ] On-theme, original, no copyrighted characters or art, no real people depicted
      without permission
- [ ] Built from an official kit / Adventure Studio
- [ ] Plays correctly from the public link on a phone you've never used it on

> ✅ **Checkpoint 8: verified public + approved before 12:00 PT.** Late = disqualified,
> and review is not instant — finish by **11:00 PT**, not 11:59.

---

## Step 9 — Sep 14–18 · Judging period (do not stop)

**Most people quit here. This is free score.** Plays keep counting through **Sep 18,
12:00 PT** — four more calendar days, each one a fresh chance for every player to
count again.

You can't ship changes, but you can:
- Keep posting the share link daily
- Fire the re-engagement notifications you built in Step 5
- Play and comment on other entries — reciprocity is real in jam communities
- Watch the leaderboard and push when you're close to a placement

> ✅ **Checkpoint 9: you were still sharing on Sep 17.**

---

## The balanced allocation

Roughly how the 11 days should divide if you want the best expected outcome
across *both* prize pools:

| Phase | Days | Share of effort |
|---|---|---|
| Concept lock | Sep 3, ~1.5h | 2% |
| Rough playable → **public** | Sep 3 | 15% |
| Mobile + FTUE + stability | Days 2–3 | 20% |
| Return loop (daily rewards/quests/notifications) | Days 3–5 | 25% |
| Distribution (daily, ongoing) | Days 4–14 | 20% |
| Craft pass for Editor's Pick | Days 8–10 | 15% |
| Story/Video hedge entry | 1 evening | 3% |

**The three failure modes that lose this jam**, in order of how often they happen:
1. Publishing late because it "wasn't ready" — the single most expensive mistake.
2. Building a one-session experience with no reason to return on day two.
3. Building something excellent that nobody is ever told about.

---

## Command reference

```powershell
rundot login / whoami            # auth
rundot jam init <kit> <dir>      # scaffold from official kit
npx rundot-sdk-setup             # SDK docs -> rundot/docs/ for the agent
rundot init --name "X" --description "Y"
npm run build                    # must output ./dist
rundot deploy                    # private share URL + QR
rundot deploy --bump Patch|Minor|Major
rundot game set-public           # submit for review
rundot game set-private          # reverse it
rundot list-games                # visibility + approval state
rundot jam promo                 # share links, caption, social URLs
rundot socials                   # launch packets, tracked links
rundot analytics / leaderboard / credits
rundot skills list               # the installed Claude Code skills
rundot update                    # if the CLI misbehaves
```

**Troubleshooting:** `command not found` → fresh shell · auth failed → `rundot login`
· `Game dist folder does not exist` → fix build output or `relativePathToBuildFolder`
in `game.config.json` · `No changes detected in build folder` → rebuild before deploying.

Help: https://discord.gg/XY2ynd3gn3 · SDK docs: https://series-1.gitbook.io
