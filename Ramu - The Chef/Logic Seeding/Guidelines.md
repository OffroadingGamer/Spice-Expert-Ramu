# September Jam 2026 — Guidelines & Reference

**Verification status:** re-verified **3 September 2026, 19:25 UTC (12:25 PT)** — the jam is **LIVE**.
Building opened Sep 3 at 12:00 PT. **Theme revealed: "Back to Work."** Page phase: `live`.

**Sources (all fetched and read directly)**
- Event page: https://events.run.world/events/september-2026-jam/
- Official Rules (binding legal doc): https://policy.run.world/september-2026-jam-rules.html
- CLI setup guide: https://events.run.world/events/cli-setup/
- Agent instructions: https://events.run.world/events/cli-setup/agent.md
- Leaderboard: https://run.world/jams/september-2026-jam
- Discord: https://discord.gg/XY2ynd3gn3

All times are Pacific Time (PT) unless marked UTC.

---

## 1. At a glance

| Item | Detail |
|---|---|
| Event | **September Jam** — a RUN creator jam |
| Sponsor | Series Entertainment Inc., 3031 Stanford Ranch Road, Ste 2 #1034, Rocklin, CA 95765, USA |
| Format | Online, 11-day creator jam |
| **Theme** | **Back to Work** — "any job, and the real story behind it" |
| Build window | Sep 3, 12:00 PT → Sep 14, 12:00 PT (11 days) |
| Judging | Sep 14, 12:00 PT → Sep 18, 12:00 PT |
| Winners announced | Live, after judging closes Sep 18, 12:00 PT |
| Cost | Free — $0 to enter and build |
| Credits | 100,000 free AI credits (promo code emailed when the jam opens) |
| Prize pool | **$3,000 across 9 prizes** |
| Tracks | Game (plays-ranked) · Editor's Pick · Story & Video Editor's Picks |
| Submission form | **None** — publishing publicly to RUN enters you automatically |

---

## 2. Theme — REVEALED

> ## Back to Work
> **"Back to Work: any job, and the real story behind it"**
>
> *"Every job has a story worth telling. Pick one, real or invented, ordinary or
> bizarre, and build something about the person who clocks in and does it."*

**The brief, verbatim from the rules section:**

> "Your entry must fit the theme: a job, real or fictional, common or uncommon,
> and the real human story behind it. **Weird is welcome but not required. Show us
> a day on the clock and the person who works it.**"

> "Lean into the theme: a job and the real human story behind it. Show us a day on
> the clock, **the tools of the trade**, and the person who works it."

**Example jobs RUN themselves used:** Flavor Architect · Conspiracy Analyst ·
Reality Collector · barista · line cook. The range is deliberate — an ordinary job
told well is as valid as an invented one.

**Design implication:** the theme must be legible in what the player *does*, not
just in the skin. A reskin reads as off-theme. Build the *job* as the mechanic —
the tasks, the tools, the day on the clock.

### Official starter kits (now published)

| Kit | Best for | CLI command |
|---|---|---|
| **September Jam Tower Defense** | "A tower-defense kit already wired in, ready for a job worth defending against the daily grind." | `rundot jam init september-jam-tower-defense <dir>` |
| **September Jam Bare Bones** | "A blank, minimally wired RUN project, best if you want to build the job's gameplay loop from scratch." | `rundot jam init september-jam-bare-bones <dir>` |

Kits are "small templates already wired for RUN, so you start with a working
project and spend your time on the job, not the plumbing."

> **Note on the earlier discrepancy:** the Official Rules page names the kits
> "Narrative Job Sim Kit" and "Barebones Kit." The **event page and the CLI slugs
> above are what actually work** — use those.

**Discord channel for this jam:** `#back-to-work`
**Leaderboard:** the "Back to Work leaderboard" — https://run.world/jams/september-2026-jam

---

## 3. Schedule (as published on the event page)

| When (PT) | Milestone | Detail |
|---|---|---|
| **Sep 3 · 12:00** | **Theme reveal & building opens** | The theme drops and the jam officially opens. Check the jam Discord channel for the full reveal and starter kits, then build. |
| Sep 3 – Sep 14 | 11-day build | Build your entry into a game, story, or video. Drop-in office hours all week. |
| **Sep 14 · 12:00** | **Pencils down** | Submissions close. Anything published after this won't count. |
| Sep 14 – Sep 18 | Judging period | Entries are played. **Unique plays keep counting toward the leaderboard through judging.** |
| **Sep 18 · 12:00** | Judging closes | All winners announced live after this. |

---

## 4. Eligibility (Official Rules §4)

A participant must:
- Be at least **18**, or the age of majority in their jurisdiction, whichever is older, as of the start of the Entry Period.
- **Reside in a country where the Sponsor's payment processor (Tipalti) can legally issue payouts.** Residents of certain sanctioned or restricted countries are not eligible.
- Own a valid email address (emails must match an active URL registration to win prizes).
- Never have been banned or suspended — nor had an account banned or suspended — for hacking or similar ToS/EULA violations on any Sponsor product or service.

Excluded: employees, officers and directors of the Sponsor and its affiliated companies/agents, their immediate family (parents, children, siblings, spouse), and anyone domiciled with them.

Also: automated entries are prohibited (automated devices = disqualification); void where prohibited; no purchase necessary; participation constitutes full agreement to the Rules, and Sponsor decisions are final and binding.

---

## 5. Tracks

### Game track (main track — plays-ranked)
Qualifies only via an official route:
1. An **official jam starter kit** in **Game Studio** (browser), **or**
2. The same kit via the **`rundot` CLI** on your own computer, **or**
3. **Adventure Studio** — counts as a game entry, on the same Game leaderboard.

> ⚠️ **"A game built outside the provided templates isn't eligible, even if it's public and on-theme."**
> The two eligible kits are **September Jam Tower Defense** and **September Jam Bare Bones** (§2).

### Story & Video track (editorially judged)
- Built in **Story Studio** or **Video Studio**.
- **No kit required** — just publish to RUN before submissions close.
- Competes only for the three Story & Video Editor's Picks, *not* the plays leaderboard.

### Multiple entries
**You may publish as many entries as you want; each one competes on its own.**

---

## 6. Build tooling — corrected and precise

There are **two build paths, and they publish differently.** This is the part most worth getting right.

### Path A — Game Studio (all in the browser)
- Build and publish entirely at https://run.world/studio. Nothing to install.
- Describe what you want in plain English; the AI writes the code, you steer and test.
- Attach your own art/references with the paperclip button — **max 10 files**.
- **Publishing:** hit **Publish Game** (rocket button, top-right of the Studio toolbar) → choose visibility. Publish **private** first to playtest, then **public** ("Yes, make it public") to compete.

### Path B — Your own AI agent on your own computer (the CLI path)
**You use a pre-existing AI coding agent you already pay for.** RUN does not supply the agent. Supported apps, per the setup guide:

| App | Requirement noted by RUN |
|---|---|
| **Claude Desktop** (Code tab) | macOS, Windows, Linux. *"Needs a paid Claude plan with Claude Code."* |
| **Cursor** (Agent panel, **Agent mode** — Ask mode is read-only and cannot do the setup) | macOS, Windows, Linux. Free Hobby plan works; paid plans have higher limits. |
| **ChatGPT with Codex** | macOS and Windows. ChatGPT Free can try short tasks; paid plans give full build room. |

RUN's own framing of why you'd choose this path: *"More powerful — the AI gets your whole computer and the newest models."* · *"A great deal — your own Claude, ChatGPT, or Cursor plan."* · **"Nothing lost — games publish to the same RUN.world account. Keep using Studio too."**

**Publishing on this path does NOT go through Game Studio.** It goes through the **`rundot` CLI**, which deploys to the same RUN.world account:

```
rundot deploy            # prints a PRIVATE share URL + QR code
rundot game set-public   # submits for review
```
> RUN's exact wording: *"deploy prints a private share URL + QR. `rundot game set-public` submits for review; **public + approved counts for jam leaderboards**."*

**Guided setup (~15–20 min, no terminal needed):** open the [CLI quickstart](https://events.run.world/events/cli-setup/), choose "An AI app," pick your app, make **one** empty folder (e.g. `My RUN Game` on the Desktop), open that folder in the app, and paste:

> `Set me up to build games on RUN.world by following the instructions at https://events.run.world/events/cli-setup/agent.md. Work inside the folder I selected. Then build me: [describe your game]`

The agent will ask permission for exactly four things — **allow only these**: open your game folder · check for Node.js · install the RUN publishing tool · open the RUN sign-in page.

**Manual setup (terminal, ~5 min).** Requires **Node 20+**, and open a **fresh shell** after installing.

```
# 1. Install the RUN CLI
# macOS / Linux
curl -fsSL https://github.com/series-ai/rundot-cli-releases/releases/latest/download/install.sh | bash
# Windows (PowerShell)
irm https://github.com/series-ai/rundot-cli-releases/releases/latest/download/install.ps1 | iex

# 2. Log in (opens the RUN.world sign-in in your browser)
rundot login

# 3. Scaffold, then ship
npx rundot-sdk-setup                 # SDK docs -> rundot/docs/  (agent.md's `rundot download-docs` is stale)
rundot init --name "My Game"
npm run build
rundot deploy                        # private share URL
rundot deploy --bump patch|minor|major   # iterate
rundot update                        # keep the CLI current
```

- **General RUN templates** (distinct from the unannounced *jam* kits): 2D Phaser · 3D React/Three.js · 2D UI React. Clone, then `npm install`.
- **Bring your own project:** the build must output to **`./dist`** with **relative asset paths** (Vite: `base: './'`).
- SDK docs: series-1.gitbook.io · agent instructions: [agent.md](https://events.run.world/events/cli-setup/agent.md)

> ⚠️ **Jam caveat on "bring your own project":** the CLI guide permits arbitrary projects for *general* RUN building, but the **jam rule is stricter** — a Game-track entry must start from an official jam template (or Adventure Studio). Don't let the general CLI flexibility talk you out of the jam kit.

### Path C — Adventure Studio
https://run.world/run.team/adventure-studio — counts as a **game** entry on the Game leaderboard.

### Path D — Story Studio / Video Studio
- https://run.world/run.team/story-studio · https://run.world/run.team/video-studio
- No kit needed; publish to RUN before submissions close.

### Common to every path
- **The entry must be published to the RUN.world platform.** That is the one non-negotiable.
- Publish **private** to playtest, **public** to compete. Public entries go through a **quick review by the RUN.world team**; only **public + approved** entries enter the leaderboard.
- Entries appear on the leaderboard **automatically, ~5 minutes after approval**. No form, no submission step.
- **No coding knowledge required** on any path.

---

## 7. Rules, verbatim from the event page

1. **To enter:** build an original entry and publish it to RUN before **September 14 at noon PT**. Games must start from one of the official jam templates, in Game Studio or with the `rundot` CLI, or be built in the Adventure Studio (all count as a game entry). Every published, on-theme entry is entered automatically, with no separate submission form.
2. **Your entry must fit the theme, which drops September 3. Full eligibility details land with the theme reveal.**
3. **Building opens September 3 at noon PT. Anything started before then is disqualified.** Original ideas only: **no 1:1 clones, no copyrighted character names or art.**
4. **Solo or team, no team-size cap, but every team member must be credited.**
5. **Submissions close Monday September 14 at noon PT. Late means disqualified.**
6. **Scoring:** Game-track winners are decided by total unique plays per player, counted from the moment your entry is published through judging close (**Sep 18, noon PT**). Publishing earlier gives your entry more time on the board. **Updates never reset your entry or its play count.** Editor's Pick is chosen by the RUN team. Winners announced live after judging closes.
7. **Story/Video** entries compete separately for the Story & Video Editor's Picks (three awards, RUN team's choice), not the plays-based Game leaderboard.

---

## 8. Scoring — the precise definition

The event page says "total unique plays per player." The **Official Rules §1** define it exactly, and the difference matters:

> **"Total Unique Daily Plays"** means, with respect to a given Entry, **the sum across each calendar day within that Entry's Scoring Period of the number of unique players who played that Entry on that day**, such that a player who plays an Entry on more than one day is counted once for each such day.

> **"Scoring Period"** = from when the Entry is **first published** to RUN (but no earlier than Sep 3, 12:00 PT) until **Sep 18, 12:00 PT**.

**Two consequences:**
1. **A returning player scores you again each day they come back.** Multi-day retention compounds; a single-day traffic spike does not.
2. **Your scoring clock starts when you publish.** Publishing on day 1 buys ~15 days of counting; publishing on day 10 buys ~8. Updates never reset the entry or its count, so there is no reason to hold back a rough build.

### Editorial awards
- **Editor's Pick (Game track):** RUN's editorial team, sole and absolute discretion, independent of play counts. An entry can place on the leaderboard **and** take Editor's Pick.
- **Story & Video Editor's Picks:** selected exclusively from story- and video-format entries. Final and binding.

### Anti-gaming
Sponsor **reserves the right to audit play counts and disqualify** entries gaming plays — bots, click-farms, proxy servers, incentivized clicking, self-play farming, or other deceptive practices. Per §7 this **voids all** of that participant's entries.

---

## 9. Prizes — $3,000 across 9 prizes

### Game track — 5 winners · $2,200 (by Total Unique Daily Plays)
| Place | Prize |
|---|---|
| 1st | **$1,000** |
| 2nd | $600 |
| 3rd | $300 |
| 4th | $200 |
| 5th | $100 |

### Editor's Pick — 1 winner · $300
### Story & Video Editor's Picks — 3 winners · $500 ($300 / $100 / $100)

**Prize terms**
- Paid via **Tipalti**, the Sponsor's third-party payment processor.
- No cash or other substitution except by Sponsor, who may substitute a prize of equal or greater value.
- Non-transferable, non-refundable, accepted as awarded. Winners cover all other costs.
- Winners are responsible for payment and reporting of **all applicable taxes**; Sponsor may report prize receipt to taxing agencies.
- **A winner who cannot be contacted, fails to respond within 7 days of notification, or fails to sign and return the Affidavit/Declaration within 7 days is disqualified and forfeits the prize.** An alternate may be selected. Undeliverable notification or prize = disqualification.
- Accepting a prize permits the Sponsor to use the winner's name, likeness and biographical information for announcing winners, without further compensation or right of approval (unless prohibited by law).
- Winners published on or after **September 18, 2026**.

---

## 10. Content guidelines (Official Rules §8)

Every entry must:
- Be **original** and **built during the Entry Period**. Entries started before it began, or that are **1:1 clones or use copyrighted character names or art**, are not eligible.
- Not violate or infringe another's rights — privacy, publicity, or intellectual property; no copyright or trademark infringement.
- Not contain text or imagery that is inappropriate, indecent, obscene, hateful, tortious, defamatory, slanderous or libelous (Sponsor's sole discretion).
- Not include threats, expressed or implied, to any person, place, business, or group.
- Not violate the privacy or any other rights of any person, business, or group.
- **Not name or depict any real-life third party without their permission.**
- Not promote bigotry, racism, hatred or harm against any group or individual, or discrimination based on race, gender, religion, nationality, disability, sexual orientation or age.
- Not be unlawful or contrary to laws in any jurisdiction where it is created.
- Not be spam or found to be gaming the system.

Violating entries are **not eligible to be judged or awarded a prize**.

---

## 11. Cost, credits, and what RUN provides

- **$0 to enter and build.**
- AI generation has a real cost to RUN, so usage is tracked in **credits**. RUN emails a promo code for **100,000 free credits when the jam opens** — sign up via "Email me the code" on the event page.
- **Run low before submissions close? Ping them on Discord and they top you up.**
- Note: on the CLI path, your *own* agent subscription (Claude/Cursor/ChatGPT) is a separate cost you already bear — RUN's credits cover RUN-side generation.
- Prewired by the platform: accounts & leaderboards (sign-in, scores, personal bests) · multiplayer & physics (real-time play without server code) · analytics (who plays, watches, reads, returns).
- Publish targets: **iOS, Android, Web** live; **Steam** and **Smart TV** coming soon.
- Published entries can earn **revenue share** outside the jam context.

---

## 12. Pre-jam checklist (what to do in the hours before noon PT)

1. **Sign up for the credit code** on the event page so it lands when the jam opens.
2. **Join Discord** (https://discord.gg/XY2ynd3gn3) — the theme, the starter kits, and office hours are announced there.
3. **Complete the CLI setup now if you're taking Path B** — it takes ~15–20 min the first time and you do it only once. Install Node 20+, install `rundot`, run `rundot login`. Do this *before* the clock starts so you spend all 11 days building.
4. **Test-drive your chosen studio with a throwaway project.** Explicitly encouraged: *"Use the wait to get comfortable... with a throwaway project."*
5. **Line up collaborators.** No team-size cap; just credit everyone.
6. **Do not start the real entry.** Anything started before Sep 3, 12:00 PT is disqualified.
7. **Be at your desk at noon PT** — the theme and the kit commands drop together, and the scoring clock rewards early publication.

---

## 13. Strategy notes (derived strictly from the published rules)

1. **Publish on day one, even rough.** The Scoring Period begins at publication; updates never reset the entry or its count. Holding back a build costs score with no upside.
2. **Design for repeat-day return, not a launch spike.** Scoring counts unique players *per calendar day* — daily reasons to come back are worth more than a one-off surge.
3. **Distribution is half the score.** Share the entry link in the jam Discord channel, Reddit, X, group chats; point people at the leaderboard.
4. **Two independent shots at money.** Editor's Pick ignores plays entirely, so a well-crafted entry can win without the biggest audience — and can win both.
5. **Multiple entries are allowed**, each competing on its own. A game plus a Story/Video entry reaches two separate prize pools.
6. **The kit rule is the sharpest disqualification risk.** Confirm the official kit the moment it's announced; a great game built outside the templates scores nothing.
7. **Credit every collaborator** — an explicit requirement, not a courtesy.

---

## 14. Legal & administrative summary (Official Rules)

- **Sponsor:** Series Entertainment Inc., Rocklin, California, USA.
- **Entry Period:** Sep 3, 2026 12:00 noon PT → Sep 14, 2026 12:00 noon PT. **Viewing Period:** Sep 14 → Sep 18, 12:00 noon PT.
- Entries submitted **before or after** the Entry Period are disqualified. **The Sponsor's computer is the official timekeeping device**; participants are responsible for calculating time-zone differences.
- Incomplete entries, or those not adhering to the rules/specifications, may be disqualified at the Sponsor's sole discretion.
- **Sponsor is not responsible for:** late/incomplete/incorrect entries; missed prize notices due to spam/junk/security settings or wrong contact info; technical, hardware, software or network malfunctions; damaged or defective prizes; human error in processing entries; shipping errors or delays; theft, tampering, destruction, unauthorised access to or alteration of entries; typographical, technological or other errors in publishing, administration, or announcement.
- On detecting an error, suspected tampering, or technical difficulty compromising integrity, the Sponsor may **cancel or modify** the promotion, or **suspend and resume** it, or **award prizes from submissions received up to the impairment**.
- **Identity disputes:** the authorised account holder of the email address used is deemed the participant.
- If more prizes are claimed than exist due to error, a **random drawing** among valid claims awards the advertised number.
- **Participant warranties:** eligible to enter; entry infringes no third-party IP/privacy/publicity rights; violates no law or rule; has read and understood the Rules; has complied and will continue to comply fully.
- **Privacy:** handled per the Sponsor's Privacy Policy; participation consents to processing personal information as necessary to conduct the promotion.
- **Liability release:** participants unconditionally release and hold harmless the Sponsor, affiliates, officers, directors, employees, representatives, agents and contractors from all claims arising from participation, the prize, or use of provided data — **including where caused solely by the Released Parties' own recklessness, negligence or fault**. Jury trial waived. California residents expressly waive Civil Code **§1542**.
- **Disputes:** resolved individually, **no class actions**, exclusively in the appropriate court in **Sacramento, California**, under **California law**, without regard to conflict-of-law rules.
- **Not affiliated with social platforms:** not sponsored, endorsed or administered by Twitter/X, Twitch, Instagram, Facebook, Discord, YouTube or similar; those platforms are expressly released. Direct all questions to Series Entertainment.

---

## 15. FAQ (from the event page, current "upcoming" phase)

**Is this just for games?**
No. Games are the main track and compete on the plays-based Game leaderboard. Story Studio and Video Studio entries are welcome and compete separately for the three Story & Video Editor's Picks. You can publish as many entries as you want; each competes on its own.

**Can I start building before September 3?**
"Practice and plan all you like, but your entry must be built during the jam, which opens September 3 at noon PT, the same moment the theme drops. Anything started earlier won't count." Use the wait to get comfortable in the studios with a throwaway project.

**How does my entry get on the leaderboard?**
Automatically, the moment it's public and approved — usually within ~5 minutes. One requirement: games must start from an official jam template (the kits drop with the theme on Sep 3), used in Game Studio or with the CLI, or be built in Adventure Studio. A game built outside the provided templates isn't eligible even if public and on-theme.

**What counts as a qualifying entry?**
Game track: any original game built during the jam that fits the theme once revealed, from an official starter kit, Adventure Studio, or the CLI. Story & Video: any original Story/Video Studio entry made during the jam and published before submissions close, no kit required. **"Full theme and eligibility details drop with the reveal on September 3."**

**Does an Adventure Studio project count as a game?** Yes — same Game leaderboard as kit-built entries.

**What's Editor's Pick?** One Game-track award, $300, chosen by the RUN team rather than by plays. Separate from the leaderboard, so an entry can place *and* take it. Story/Video entries have their own set: $300 / $100 / $100.

**I published. Now what?** Gather plays. Share the link in the jam Discord channel, Reddit, X, group chats; point people at the leaderboard; keep refining — updates never reset your entry or its play count.

**Do I need to know how to code?** No. Describe what you want in plain English; the AI writes the code, you steer and test.

**Can I work with a team?** Yes. Solo or team, no size cap. Credit every member on the entry.

**Will I be charged to enter or build?** No. $0 to enter and build. 100,000 free credits emailed when the jam opens; ping Discord if you run low.

**When does it all end?** Pencils down Monday Sep 14 at noon PT. Judging runs through Sep 18 at noon PT; winners announced live after it closes.

---

## 16. Key links

| Purpose | Link |
|---|---|
| Event page | https://events.run.world/events/september-2026-jam/ |
| Official Rules | https://policy.run.world/september-2026-jam-rules.html |
| Live leaderboard | https://run.world/jams/september-2026-jam |
| Discord | https://discord.gg/XY2ynd3gn3 |
| Game Studio | https://run.world/studio |
| Story Studio | https://run.world/run.team/story-studio |
| Video Studio | https://run.world/run.team/video-studio |
| Adventure Studio | https://run.world/run.team/adventure-studio |
| CLI quickstart | https://events.run.world/events/cli-setup/ |
| Agent instructions (`agent.md`) | https://events.run.world/events/cli-setup/agent.md |
| RUN SDK docs | https://series-1.gitbook.io |
| `rundot` CLI releases | https://github.com/series-ai/rundot-cli-releases |

---

## 17. Re-check after the reveal

At **Sep 3, 12:00 PT** the page swaps to its live phase. Re-verify and update this document with:
- [ ] The actual theme and its full brief
- [ ] Official starter kit names and their exact `rundot jam init …` commands
- [ ] Any theme-specific eligibility details ("full eligibility details land with the theme reveal")
- [ ] The Discord channel name for this jam
- [ ] Whether the Official Rules §7 kit names match the announced kits
