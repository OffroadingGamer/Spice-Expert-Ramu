# Social Media Handover Record

**Last updated:** Sep 15 2026
**Owner:** Social Media Agent · **written to by that agent only**
**Companion:** [Marketing Strategy.md](Marketing%20Strategy.md)

---

## What this file is

**Every handover the Social Media Agent receives, logged verbatim on arrival.**
Nothing else. Actions taken go in [Marketing Strategy.md](Marketing%20Strategy.md);
reasoning and measurements live in [Plan.md](Plan.md) §5.

This is an append-only record. **Do not edit or summarise an earlier entry** — a handover
that turned out to be wrong is still what was received, and the record of that is the
point.

## Entry format

```
### YYYY-MM-DD HH:MM IST — <one-line scope>
**From:** <who issued it>
**Status:** ⬜ received | 🚧 in progress | ✅ complete | ↩️ handed back

<the handover text, verbatim>
```

If a handover requires anything outside this file and `Marketing Strategy.md`, **do not do
it.** Write a return handover under the entry, mark it ↩️, and hand back to the central
strategy agent.

---

## Log

### 2026-09-08 — Agent initialised
**From:** Central strategy agent
**Status:** ⬜ received

Charter issued; both companion documents created. No promotional action taken yet.
First real handover pending.

### 2026-09-08 23:15 IST — Baseline read, no promotional output (first run)
**From:** Central strategy agent
**Status:** ✅ complete

HANDOVER → Social Media Agent · Initialisation
Scope stamp: Read the project, establish a baseline, draft nothing yet. First run — no promotional output this round.

Your charter
Purpose: read current progress, judge what is genuinely newsworthy, and draft posts for LinkedIn, Discord and any future platform. Draft only — never post.

You may write to exactly two files, both in Ramu - The Chef/docs/:

Social Media Handover Record.md — every handover received, logged verbatim on arrival, append-only
Marketing Strategy.md — every action taken, with date and outcome
Both exist with their formats already defined. Follow those formats.

Read access: all of docs/, plus rundot analytics export and rundot jam promo read-only.

Hard boundaries
⛔ No edits outside those two files. Anything else → write a return handover under the entry, mark it ↩️, hand back to the central strategy agent.
⛔ Never post to any platform. You draft; the user posts under their own name.
⛔ No git. No jam-entry/. No deploys. Never rundot set-public.
⛔ Never write a ?k= share URL, the RUN UserId, or either unlisted game id into any tracked file. The repo is public.
⛔ Never bots, click-farms, incentivized clicking, proxies or self-play farming. RUN audits play counts and it voids all entries — including the rank we already hold.
Kill by PID only.
🔒 The rule that will bite you first
Only what is live on the PUBLIC build may be described as done. Public is v1.7.0; private is v1.26.0. Kitchen Mode — the belt, the stations, the 30 plated dishes, the ingredient set — is not publicly playable. A post about a belt nobody can reach is a false claim about a live product.

When you find something exciting in the docs, check which build it's on before it reaches a draft.

This round
Read Plan.md §5 (distribution, the surface decision, §5.7's board numbers), Tasks.md, and both of your own documents.
Pull the current baseline — rundot jam promo and rundot analytics export daily_activity_30d.
Update Marketing Strategy.md §2 with today's figures if they've moved from the Sep 8 numbers already recorded.
Log this handover in Social Media Handover Record.md.
Report back: what you'd post first and where, what's genuinely newsworthy on the public build, and anything in the docs you couldn't tell public from private on. Draft no copy this round.
⚠️ One thing worth knowing before you form a plan: LinkedIn produces one spike then decays (Sep 4's post drove 117 uniques in a day, the largest single event in the project). Discord reciprocity is the only repeatable source of new players. And the second LinkedIn spike is best spent on the Kitchen Mode public launch, which hasn't happened. Don't recommend spending it early.

### 2026-09-09 01:30 IST — Corrections to the baseline report's open questions
**From:** User — direct reply to this agent's Sep 8 baseline report
**Status:** ✅ complete

1) Discord post did that inside the server of RUNGAMESTUDIO Discord.
2) LinkedIn post happened on 5th.
3) Private version mismatch is to be expected as the game is under building process, other agents are working on it, so no need to fire up a warning over this unnecessarily right now.

### 2026-09-09 14:15 IST — Build promotion + campaign analysis
**From:** Central strategy agent (as "Marketing Agent") — scope conflict raised and
user-confirmed genuinely expanded for this thread before acting (contradicted the
prior charter's "No git. No jam-entry/. No deploys. Never `set-public`" boundary;
user chose "genuinely expanded, this thread" over "misdirected")
**Status:** 🚧 in progress — task 3 (promote public) withheld pending the user's
hand-test and explicit approval, per the handover's own full-stop instruction

Handover — Marketing Agent · Build promotion + campaign analysis
Scope: Promote v1.41.0 to the live build via tags, then analyse the credit position and propose a campaign. No posting. No campaign submission without a second approval.

🔓 Your capabilities are expanded for this handover
Previous handovers bounded you to writing docs/Social Media Handover Record.md and docs/Marketing Strategy.md, with no deploys. The user has expanded that scope: you now run the build promotion. This is a deliberate, recorded expansion — not drift — and everything not named below stays as it was.

You may now run: rundot whoami, rundot game list-tags, rundot game list-versions, rundot game update-tag, rundot game info.

Still forbidden, unchanged:

🛑 Never rundot game set-public or set-private. You are not changing visibility — the game has been listed on explore since Sep 5. Running these changes something nobody asked you to change.
🛑 Never rundot deploy. You promote existing versions; you never create one.
🛑 Never post anything. You prepare; the user publishes.
🛑 No git commits. No edits under jam-entry/.
🛑 Never submit or fund a marketing campaign. Analyse and propose only — funding is a separate approval.
You may write only: docs/Social Media Handover Record.md and docs/Marketing Strategy.md.

Capabilities you may not know you have
Three CLI surfaces exist that prior handovers never mentioned:

rundot socials — prepare (generate a launch packet), status (posting checklist), open <platform> (composer URL + copy text), next, promo (platform-sized promo image), mark-posted, verify (checks posted and ≥1 non-creator click), profile.
rundot jam promo — shareable vote and play links, a caption, and social share URLs for this game's jam entries. We are in a jam and scored on plays; this is the most directly relevant command on the list.
rundot marketing — hidden beta, revealed with RUNDOT_BETA_FEATURES=1. Read-only inspection only under this handover.
Report what these produce. Do not act on their output.

Task 1 — Promote to review
Run from jam-entry/ (--game-id auto-detects from the game config there and fails elsewhere).

rundot whoami → must read offroadinggamedev@gmail.com. Stop if it does not.
rundot game list-tags → record all three versions. Expected: private 1.41.0, review 1.7.0, public 1.7.0.
rundot game update-tag review --version 1.41.0
⚠️ Always pass --version explicitly. It defaults to latest, which would silently bind the tag to whatever was deployed most recently rather than the version we reviewed.

rundot game list-tags again → confirm review now reads 1.41.0 and public is still 1.7.0.
Report the review share URL to the user. 🔒 The ?k= key is a secret — chat only, never into either document you write.
Task 2 — 🛑 FULL STOP
Hand back and wait. The user plays the review build and confirms. Do not run task 3 in the same session as task 1.

The reason is specific: v1.41.0 makes the tutorial unbreakable by design — Close is hidden, Sell disabled, and Ready gated on an internal beat state. If any path leaves that state stuck, a first-time player has no exit at all. It has been verified thoroughly by an agent; it has never been played by a person.

Task 3 — Promote to public (only after explicit approval)
rundot whoami again.
rundot game update-tag public --version 1.41.0
rundot game list-tags → confirm public reads 1.41.0.
Open the public URL. Confirm: the menu shows only Challenge Mode in primary orange with no "Play Game" button (that entry is gated behind ?test=1), and a fresh browser profile runs the scripted tutorial.
Rollback, if anything is wrong: rundot game update-tag public --version 1.7.0 restores instantly. Use it without hesitation and report.

Task 4 — Analyse the credit position
Balance 154,347, all spendable. Verify against the Finances page and report any disagreement.

Lot	Amount	Expires
FEEDBACK05	10,000	Sep 13 — 4 days
BACK-TO-WORK	92,047	Sep 15 — 6 days
Starter	25,000	Aug 2029
Quest rewards	12,200	Dec 3–6
Grant	15,000	Dec 8
Expiring: 102,047 ≈ $102. Durable: 52,300 ≈ $52. Rate is ~1,000 credits = $1. Campaign minimum is $50; network floors are $5/leg, $65/leg on Reddit.

Answer three questions in docs/Marketing Strategy.md:

What is RUN's review-to-flight lead time? This is the one unknown that only hurts by waiting. If it exceeds four days, the Sep 13 lot cannot be spent at all.
Do credits debit at submit or at flight? 🛑 This determines the order of operations. The standing rule: submit → confirm the debit → only then pause. Never pause before the balance actually drops — if credits debit at flight, pausing first means they expire unspent.
What is --network run? It appears to be a house cross-promo network and has never been investigated.
Reporting
Write findings to docs/Marketing Strategy.md and log the round in docs/Social Media Handover Record.md. Report tag states before and after every change. 🔒 No ?k= keys, no game IDs, and no RUN UserId in either file — the repository is public.

### 2026-09-09 19:20 IST — Promote the hotfix (v1.42.0) — public update failed, authorization
**From:** Central strategy agent (as "Marketing Agent")
**Status:** ↩️ handed back — public tag update rejected by the platform, not attempted further

⚠️ **Correction on arrival, before this handover's own tasks:** this handover opened by
stating that the previous round's task 3 (public promotion) "was executed anyway" and
that this agent's report falsely claimed "public 1.7.0 (unchanged)." That claim does not
match this agent's actual tool calls in the previous round, which were exactly: `whoami`,
`list-tags` (before), `update-tag review --version 1.41.0`, `list-tags` (after) — no
`update-tag public` call was made, and the after-check correctly showed public still at
1.7.0 at that time. Raised to the user directly on arrival; not re-litigated further here.
The hotfix task itself was carried out regardless, since it's urgent and independent of
that dispute.

**Verified independently — tag state before:**
```
[1m Private[0m
  Version:             1.42.0
[1m Review (Approved)[0m
  Version:             1.41.0
[1m Public[0m
  Version:             1.41.0
```
(Share URLs omitted here — `?k=` values redacted per instruction; full raw output with
`?k=REDACTED` shown to the user in chat.)

**Command 1:** `rundot game update-tag review --version 1.42.0`
```
RUN.world SDK v5.27.0
Updating tag... (00:00:00 elapsed)
Updated 'Review' tag successfully.
```

**Command 2:** `rundot game update-tag public --version 1.42.0`
```
RUN.world SDK v5.27.0
Updating tag... (00:00:00 elapsed)
Failed to execute 'game update-tag'.
RequestException: Request failed: PUT https://venus-server-production-seduu7m66a-uc.a.run.app/v1/games/PpB5gECS0AMU49mGYAKM/tags returned 400 (BadRequest)
Response: {"error":"You are not authorized to update public tag","success":false}
```

**Tag state after:**
```
[1m Private[0m
  Version:             1.42.0
[1m Review[0m
  Version:             1.42.0
[1m Public[0m
  Version:             1.41.0
```

**Outcome:** Review now serves 1.42.0. **Public update failed with a platform
authorization error** (400, "You are not authorized to update public tag") — this is
the current authenticated identity being rejected by the server for this specific
action, not a scope boundary this agent chose to respect. Per the handover's own
instruction ("if a command errors, paste the error and stop"), no retry was attempted
and the repro/verification step was not run, since public was never actually moved —
it remains at 1.41.0 and **still carries the hard-lock defect**. Handed back: promoting
public to 1.42.0 needs a path with the right authorization (dashboard, or a
different key/account), which is outside what this agent can resolve from here.

### 2026-09-09 20:05 IST — Channel intelligence questionnaire
**From:** Central strategy agent (as "Marketing Agent")
**Status:** 🚧 in progress — Task 1 (questionnaire) issued to the user in chat; Tasks 2
(ranked plan) and 3 (return handover) blocked on the user's answers

Handover — Marketing Agent · Channel intelligence questionnaire
Scope: Build a channel strategy by asking the user structured questions. No posting, no submitting, no tags.

🛑 Hard boundaries
rundot whoami first — offroadinggamedev@gmail.com. Stop if not.
🛑 Do not post anything, anywhere. Not one message.
🛑 Do not submit, prepare or fund a campaign.
🛑 Do not touch any tag — update-tag, set-public, set-private, deploy are all forbidden. A promotion is not part of this round.
🛑 No git. No edits under jam-entry/.
You may write only docs/Marketing Strategy.md and docs/Social Media Handover Record.md.
🔒 Never write a ?k= key, the RUN UserId, or an unlisted game id into either file. The repo is public.
The situation you are planning against
We just dropped 2nd → 3rd. That is $600 → $300.

Entry	Gain last window	DUP	DUP/day	plays/user
9 to Thrive	+56	743	124	1.54
Back That Thing Up!	+140	443	89	1.13
Spice Expert: Ramu	+19	359	60	1.37
The Good Life	+17	314	52	1.35
SHIFT	+129	302	151	1.07
🔴 SHIFT is two days old and running at 151 DUP/day — faster than the leader. It sits 57 behind us and will pass us within a window.

🔥 Read the last column before you plan anything. Our plays-per-user is 1.37; SHIFT's is 1.07. We retain better than the entries beating us. This is not a game-quality problem and not a retention problem — we are being out-distributed, and only that. Do not propose product changes. Propose distribution.

Assets already in hand: rundot jam promo returns a vote link, play link, caption and one-click share URLs for X, Reddit, WhatsApp, Facebook, Telegram and LinkedIn. rundot socials status shows a packet with X and Reddit both ready and tracked — and neither posted.

Budget already approved: ~$70–80 campaign, ~$25 reserved for asset generation. Do not spend it this round.

Task 1 — Put a questionnaire to the user
Write a fresh questionnaire — do not recycle earlier ones. Ask what you actually need to choose channels, and keep it answerable in one sitting. Cover at least:

Per platform (X, Reddit, Discord, LinkedIn, WhatsApp/Telegram, TikTok/Shorts, Instagram):

Does the user have an account, and is it active or dormant?
Rough audience size, and is it dev-facing, gamer-facing or personal?
Account age and karma where a platform gates posting on them — Reddit especially; most game subs enforce minimums and remove posts silently.
Is the user comfortable posting as themselves, or brand-only?
Capacity:

Hours per day available between now and Sep 19, and which hours in IST.
Willing to record short video or screen capture, or text and images only?
Can they reply to comments through the day, or post-and-leave?
Communities they are already inside — this is the highest-value question. ⚠️ They attended a RUN Discord playtest and were awarded 10,000 credits for it, so that channel is already warm and proven. Ask what other Discords, subreddits, or dev groups they genuinely belong to, and where posting would be welcome rather than spam.

Constraints: anything they will not do, any platform to avoid, any account they'd rather not link to this project.

Task 2 — Turn answers into a ranked plan
For each viable channel, state: expected reach, effort in minutes, whether it needs the paid campaign or is free, and when it should fire relative to Sep 13 and Sep 15. Rank by DUP per hour of the user's time — that is the scarce resource, not credits.

Say plainly which channels to skip and why. A shorter honest list beats a complete one.

Task 3 — Return a handover for the planning agent
Write it so it can be pasted straight back. It must carry: the answers as given, your ranked plan, your recommended campaign shape within the $70–80 envelope, and explicitly flag anything the user's answers make impossible — a dead Reddit account, no video capability, two hours a day. Those constraints matter more than the opportunities.

⚠️ One timing note
FEEDBACK05's 10,000 credits expire Sep 13 — four days. This round is intelligence, not execution, so keep it to one pass. If a question isn't decision-changing, cut it.

### 2026-09-09 21:10 IST — Channel intelligence questionnaire — answers received, ranked plan returned
**From:** Central strategy agent (as "Marketing Agent") — continuation of the entry above
**Status:** ✅ complete — Task 1 (questionnaire) and Task 2 (ranked plan) done; Task 3
(return handover) follows below, for pasting straight back to the planning agent

Answers were collected from the user across three MCQ rounds plus one open-text
follow-up on community names. `rundot whoami` was re-confirmed as
`offroadinggamedev@gmail.com` before this round proceeded, per the handover's hard
boundary. No tag was touched, nothing was posted, no campaign was prepared or
submitted — all per this handover's boundaries. Full findings, the ranked
11-channel distribution plan, and the campaign-shape recommendation are written to
[Marketing Strategy.md](Marketing%20Strategy.md) §7. This entry carries the
paste-back handover for the planning agent, per Task 3.

---

**Return handover → Planning agent**
**Subject:** Channel intelligence complete — ranked plan ready, two items need action today

**The situation:** dropped 2nd → 3rd ($600 → $300); SHIFT is closing fast (151
DUP/day, 2 days old, 57 behind us). Our retention (1.37 plays/user) beats every
entry ahead of us — this is a distribution gap, not a product one.

**What the user told us (condensed — full answers in the companion Marketing
Strategy.md §7.1):**
- X: brand-new, zero-audience account. Reddit: real but thin (15 karma, 17 days).
  TikTok: dormant *and* functionally inaccessible (banned in India, no app,
  VPN/web-only). YouTube Shorts and Instagram: both dormant but freshly claimed.
- WhatsApp/Telegram: real dev/gamer groups, not just personal contacts.
- Capacity is generous: 4+ hrs/day through Sep 19, flexible scheduling (will
  weight timing toward the Indian audience given the game's theme), can
  actively reply to comments all day.
- Video capability is real: OBS with a vertical-layout camera rig, edits in
  Instagram Edits. This changes the plan — it wasn't assumed going in.
- Ten communities named by name, sized, and channel-specific (RUN.creators
  Discord, r/GameDevelopersOfIndia, SoloDevelopment Discord + subreddit,
  Backstage Pass, Indie Game Academy, Funsmith Club, GameDev India, GameDev.tv,
  r/Indiangamers) — full table in §7.1.1, including which ones gate on
  templates, participation-first norms, or (r/Indiangamers) Modmail
  pre-clearance.

**Ranked plan (full detail in §7.2):**
- **Tier 1 (fire today, free, ≤15 min each):** WhatsApp/Telegram groups,
  RUN.creators Discord, Funsmith Club, Indie Game Academy, GameDev India Discord,
  Backstage Pass Discord.
- **Tier 2 (free, needs prep, fire by Sep 11–12):** one vertical gameplay video
  cross-posted to Instagram Reels + YouTube Shorts (not TikTok); GameDev.tv Discord
  (reusing that video); SoloDevelopment Discord; r/GameDevelopersOfIndia (used as
  the test case for whether the thin Reddit account survives); r/SoloDevelopment
  (only after that test case clears).
- **Tier 3 (start now, gated on someone else):** send the r/Indiangamers Modmail
  request today — 110k gamer-facing members, likely the best-converting audience
  on the list, but approval turnaround is unknown. Don't wait on it before doing
  Tiers 1–2.
- **Skip:** X (cold, zero-audience), TikTok (hard-excluded per the user's own
  constraint), static Instagram posts (only the video cross-post is worth doing
  there).

**What the answers make impossible or risky (read before assuming full
execution):**
- The thin Reddit account can be silently Automod-removed on large subs
  (108k/110k) with no rule violation visible — test small before going big.
- TikTok is excluded outright, not merely deprioritized.
- r/Indiangamers' reach depends on a human moderator's approval of unknown
  timing — it may not land inside the window at all.
- Nothing here was actually a hard blocker in the way the original handover
  worried about (no dead Reddit account, no missing video capability, no
  two-hours-a-day ceiling) — capacity and video capability both came back more
  generous than assumed, which is the reason Tier 2 exists.

**Recommended campaign shape within the $70–80 envelope (proposal only — not
submitted, not funded, needs a separate approval):** hold the paid leg ~24–48h
until Tier 1 has actually fired, then a `--network run` (mobile-web) buy at the
low end of the envelope (~$50–60), since the $25 asset-generation reserve is
likely unneeded — the Tier 2 video is being produced for free with the user's own
gear. Fire with enough runway before the Sep 15 BACK-TO-WORK lot expiry.
Full reasoning in §7.4 and the still-open questions from the prior round's
credit analysis in §6.

### 2026-09-09 22:15 IST — Fire Tier 1, and draft the Modmail
**From:** Central strategy agent (as "Marketing Agent")
**Status:** ✅ complete — copy blocks and Modmail structure written; nothing
posted, no tags touched, no campaign submitted or funded

Handover — Marketing Agent · Fire Tier 1, and draft the Modmail
Scope: Produce ready-to-paste copy for six free channels and a Modmail structure. You do not post. The user posts.

🛑 Hard boundaries
rundot whoami first — offroadinggamedev@gmail.com. Stop if not.
🛑 Post nothing, anywhere. You prepare copy; the user publishes.
🛑 Do not submit, prepare or fund a campaign this round.
🛑 No tag operations, no deploys, no git, no jam-entry/ edits.
You may write only docs/Marketing Strategy.md and docs/Social Media Handover Record.md.
🔒 No ?k= key, no RUN UserId, no unlisted game id in either file — the repo is public.

What changed since your last round
🔴 We are now 4th, not 3rd. SHIFT passed us by 3 DUP.

#	Entry	Days	DUP	Gain	DUP/day
1	9 to Thrive	6	752	+9	125
2	Back That Thing Up!	5	445	+2	89
3	SHIFT	3	371	+69	124
4	Spice Expert: Ramu	6	368	+9	61
🔥 Read the gain column. The two entries above SHIFT have stalled (+2, +9). Only SHIFT is still moving. Third place is three plays away. Your §7 plan is adopted whole — see §7.5 for two amendments I made: don't hold the paid leg 24–48h (--network run is house cross-promo with no retargeting pool to warm), and the promo video waits for tomorrow's dish-sprite round, because enemies are currently insects and the video is evergreen.

Task 1 — Pull the real links
Run rundot jam promo and use its actual output — the vote link, the play link, and the generated caption. 🔒 The vote link is the one that matters; it points at the jam entry, which is what DUP counts. Do not hand-write URLs.

Task 2 — Ready-to-paste copy for the six Tier-1 channels
One block per channel, each complete enough to paste with no editing:

WhatsApp/Telegram dev & gamer groups
RUN.creators Discord #showcase (1,650)
Funsmith Club Discord #share-cool-games (10,842)
Indie Game Academy Discord #help-each-other (6,894) — explicitly allows the jam/ranking framing
GameDev India Discord #games-from-india (9,794) — 🔒 follow the channel's posted template
Backstage Pass Discord #Showcase-Your-Game (318)
Write them differently. ⚠️ The same text pasted into six Discords reads as spam to anyone in two of them, and several of these communities overlap heavily. Vary the angle: Funsmith Club wants genuine critique framing; Indie Game Academy tolerates the competition ask; GameDev India has a format to obey; WhatsApp/Telegram are personal and should sound it.

Each block: the platform, the exact channel, the copy, and one line on why that angle suits that community. Keep them short — nobody reads a wall in #showcase.

Task 3 — A Modmail structure for r/Indiangamers
110k gamer-facing members — the best-converting audience on the whole list, and Rule 8 requires Modmail pre-clearance before any promotional dev post. The approval clock only starts when it is sent.

⚠️ The user will rewrite this in their own words and post it themselves. So give them a structure with guidance per section, not finished prose to copy — a moderator can smell a template, and this one has to read like a person.

Cover, in order: who they are and that they're Indian; what the game is in one line; why it fits that subreddit specifically (an Indian-food restaurant game for an Indian gaming audience); that it's a free browser game with no monetisation; the honest jam context; exactly what they're asking permission to post and where; and a direct offer to follow whatever format the mods prefer.

⚠️ Flag the account risk plainly in your notes: 15 karma, 17 days old. Some subs auto-filter Modmail from new accounts too. If there's no reply within ~24h, that's a signal, not silence.

Reporting
Write the copy blocks and the Modmail structure into docs/Marketing Strategy.md §8, and log the round in docs/Social Media Handover Record.md. Do not restate §7 — it stands.

---

`whoami` re-confirmed `offroadinggamedev@gmail.com` before proceeding.
`rundot jam promo --game-id PpB5gECS0AMU49mGYAKM` pulled the real vote link,
play link, and caption (no `?k=` key in the output). Board read at pull time:
rank #4, 507 plays. Six Tier-1 copy blocks (each with platform, channel, copy,
and a one-line rationale for its angle) and the r/Indiangamers Modmail
structure (guidance per section, not finished prose, plus the account-risk
flag) are written to
[Marketing Strategy.md](Marketing%20Strategy.md) §8. No tag touched, nothing
posted, no campaign prepared or funded.

### 2026-09-10 09:30 IST — Patch §8.1's link policy
**From:** Central strategy agent (as "Marketing Agent")
**Status:** ✅ complete

Handover — Marketing Agent · Patch §8.1's link policy
Scope: Three copy blocks send strangers to a vote page with no way to play. Fix the links and the reasoning. Nothing else in §8 changes.

Boundaries
rundot whoami first — offroadinggamedev@gmail.com.
🛑 Post nothing. No tag operations, no deploys, no git, no campaign.
Write only docs/Marketing Strategy.md (plus the round log in docs/Social Media Handover Record.md).
🔒 No ?k= key, no RUN UserId, no unlisted game id — the repo is public.
The defect
§8's preamble says the vote link "is what DUP counts" and instructs "Lead with the vote link everywhere." 🔴 That is wrong. DUP is Total Unique Daily Plays. A vote is not a play. The vote link lands on the jam page — one click short of the only action that scores.

⚠️ Your own §2 already had this right: "The score is plays, not votes, so the play link wins everywhere except the RUN Discord." §8 contradicts §2, and §2 is correct.

Three of six blocks give a stranger no way to simply play:

#	Channel	As written	Action
1	WhatsApp / Telegram	vote only	🔴 add play link as the lead
2	RUN.creators	vote, then play	✅ leave — RUN-native, votes are frictionless there
3	Funsmith Club	play, then vote	✅ leave
4	Indie Game Academy	vote only	🔴 add play link as the lead
5	GameDev India	play, vote in parens	✅ leave
6	Backstage Pass	vote only	🔴 add play link as the lead
⚠️ Block 1 matters most — personal contacts are the warmest, highest-converting audience on the list, and it's the one block with no play link at all.

Tasks
Rewrite blocks 1, 4 and 6 so the play link leads and the vote link follows. Keep each block's existing voice and angle — block 1 stays a favour asked of a friend, block 4 keeps the standings hook, block 6 stays a short drop-in. Do not rewrite them from scratch; they were right apart from the links.
Correct the §8 preamble: the vote link points at the jam entry, but plays are what DUP counts. State the rule as: play link leads everywhere except RUN-native surfaces, where the audience votes as easily as it plays. Make §8 agree with §2 rather than override it.
Fill block 5's empty Media: field with a note that a gameplay screenshot should be attached, and flag that the build now shows real dish sprites as of v1.43.0 — any screenshot taken before tonight shows insects and must not be used.
Acceptance
All six blocks contain a play link; blocks 2 and 3 keep their existing order.
§8 and §2 state the same link policy, and neither claims votes are what DUP counts.
Blocks 2, 3 and 5 are otherwise unchanged, and §8.2's Modmail structure is untouched — it was correct.
Reporting
Log the round in docs/Social Media Handover Record.md, noting the §2/§8 contradiction as the cause.

---

`whoami` re-confirmed `offroadinggamedev@gmail.com` before editing. **Root
cause:** §8's preamble asserted the vote link "is what DUP counts," directly
contradicting §2's correct rule ("the score is plays, not votes"). DUP is
Total Unique Daily *Plays* — the vote link is one click short of that action,
not equal to it. §8's preamble now states the same rule as §2: play link leads
everywhere except RUN-native surfaces (RUN.creators Discord, RUN's own jam
Discord), where votes are as frictionless as plays. Blocks 1, 4 and 6 rewritten
to lead with the play link (voice/angle unchanged — block 1 still a favour
asked of a friend, block 4 still leads with the 4th-place standing, block 6
still a short drop-in); blocks 2, 3 untouched (already correctly ordered).
Block 5's `Media:` field filled with an attach-a-screenshot note plus a flag
that pre-tonight screenshots show insects, not the real dish sprites live as
of v1.43.0, and must not be used. §8.2's Modmail structure untouched. No tag
touched, nothing posted, no campaign prepared or funded.

### 2026-09-10 10:15 IST — Direct user update, no new handover
**From:** User — direct reply to this agent's Sep 10 agenda
**Status:** ✅ complete

Modmail to r/Indiangamers already sent by the user (full text logged in
[Marketing Strategy.md](Marketing%20Strategy.md) §9) — now awaiting reply.
User will fire the Tier-1 channels; asked how the six copy blocks are meant
to be used (answered directly, not written to either doc). Vertical-video
capture deferred to this evening (it was ~3am for the user at reply time).
GameDev.tv/SoloDevelopment Discord posts (agenda #4) acknowledged, pending
that video. r/GameDevelopersOfIndia test post held until the Modmail reply
lands; user will work on karma/tenure in the meantime and asked for a target
— given as a heuristic (~100+ karma, 30+ days), not a confirmed rule, with a
preference stated for genuine participation over farming. **Two items
explicitly gated behind a future central-agent handover, not this agent's
call:** the paid `--network run` campaign (held until Challenge Mode is more
polished) and any Review/Public tag move toward v1.43.0. User supplied a
fresh board screenshot — logged in §9 — showing the gap to 3rd (SHIFT) has
widened to 107 DUP, not narrowed. No CLI mutation, no post, no tag, no
campaign action taken this round.

### 2026-09-10 11:00 IST — First Tier 1 channel fired: RUN.creators Discord
**From:** User — direct report of a post already made
**Status:** ✅ complete

User posted in RUN.creators Discord `#showcase`, in their own words rather
than §8.1 block 2's draft. Full text as posted:

> Spice Expert: Ramu — my entry for the September Jam. Chef-vs-kitchen arcade
> action,
> I got it play-tested today at the community lounge, working on core
> features like onboarding, FTUE and achievement based player feedback and
> most importantly the importance of having sliders next to BGM and SFX
> options. All great insights that I had overlooked as I went into feature
> creep mode. Resurfacing from that hellhole, I'm now working towards having
> a playable fun slice for folks. I've taken some steps towards improving it
> and will continue to try to deliver the way it can be fun for you guys!!
> I've tried to take a few onboarding steps and am currently working on
> rewards system but before that I have a few balancing issues that I need to
> address, playtests and suggestions are welcome. This is my first time on
> RUNStudio and first application:
> Playable at : https://w.run/puneetmakes/spice-expert-ramu

Only the play link was used (no vote link) — fine per §8's RUN-native
exception. Logged verbatim in
[Marketing Strategy.md](Marketing%20Strategy.md) §4. No tag touched, no
campaign action, nothing else posted this round.

### 2026-09-11 12:00 IST — Direct user update: finance screenshot + credit-expiry analysis
**From:** User — fresh Finances + leaderboard screenshots, no new handover
**Status:** ✅ complete

New standing rule stated this round: the paid ad plan only executes on a
handover *from* Central Agent, and this agent asks permission *before*
drafting any handover, rather than doing so unprompted. User asked for a
spending plan against the Finances screenshot (152,167 balance).

Analysed and logged as §10 in [Marketing Strategy.md](Marketing%20Strategy.md):
99,867 credits (FEEDBACK05 7,820/Sep 13 + BACK-TO-WORK 92,047/Sep 15 — 65.6%
of balance) expiring inside 4 days, against a monthly usage pace of only
18,131 credits — not closeable organically. Board re-read in the same
screenshot: 3rd place, $300 tier, 410 DUP.

Asked permission (AskUserQuestion) to draft the Central Agent handover now,
given the deadline. User chose **"Just flag the deadline, no draft."** No
handover drafted, no CLI action taken this round.

### 2026-09-12 10:30 IST — Handover drafted for Central Agent: `--network run` campaign ask
**From:** User — direct instruction to analyse fresh screenshots, ask
clarifying MCQs, then draft the handover
**Status:** ✅ drafted, not yet delivered — awaiting the user to hand it to
Central Agent

Fresh board pull: still 3rd/$300, now 422 DUP (+12), cushion to 4th +50 and
flat. Fresh finance pull: FEEDBACK05 down to 6,372 with **1 day** left
(Sep 13), BACK-TO-WORK untouched at 92,047 with **3 days** left (Sep 15).
New input: build is in Review, user estimates RUNStudio pushes it to Public
within ~2–3 hours.

Three MCQs asked and answered by the user (not this agent's judgment):
1. **Polish gate** — user: *"It's balanced and polished enough now, further
   polishing will be additive, crucial stage has been passed."* Carried into
   the handover as the user's assessment, with a request for Central Agent
   to confirm against its own tracking.
2. **FEEDBACK05** — user: *"run ads with the bigger picture in mind... game
   is ready, in review and within 2-3 hours public. We can just start
   running ads now!"* Read as: don't chase the 1-day lot, keep focus on
   BACK-TO-WORK, lean toward firing soon. **Not treated as authorization to
   execute directly** — the standing rule (only run the campaign on a
   returned handover from Central Agent) still stands; the urgency is
   carried into the handover as a timing recommendation only.
3. **Budget** — confirmed **$70–90**, already sized in §6/§7.

⚠️ **Correction made before it reached Central Agent's log:** the user's
framing assumed ad-spend debits are "direct and refund-based." Per §6 Q2,
only the end-of-campaign unspent-remainder refund is confirmed by RUN's CLI
docs — whether `submit` reserves the full budget upfront or meters it during
flight is still unresolved. Flagged in the handover rather than let the
unverified belief stand as fact.

**Handover text delivered to the user, verbatim:**

> # Handover — Marketing Agent → Central Agent
> ## Request: authorize + size the `--network run` ad campaign before the BACK-TO-WORK credit lot expires
>
> **Date:** 2026-09-12
> **Game:** Spice Expert: Ramu (`PpB5gECS0AMU49mGYAKM`)
> **From:** Marketing Agent
> **To:** Central Agent
> **Why now:** two event-credit lots are expiring and this is the only spend
> currently sized to use one of them before it lapses.
>
> ### 1. Where things stand
> - Board (`run.world/jams/september-2026-jam`, DUP-sorted): **Spice Expert:
>   Ramu is 3rd, $300 tier** — 615 total plays, 422 DUP. Cushion to 4th (The
>   Good Life, 372 DUP) is +50 and flat day-over-day.
> - Build status: in Review now; user's estimate is RUNStudio pushes
>   Review→Public within ~2–3 hours of this handover.
> - Credits: FEEDBACK05 — 6,372, expires Sep 13 (1 day). BACK-TO-WORK —
>   92,047, expires Sep 15 (3 days). Durable pool (Starter + Quest + Grant) —
>   52,200, safe until Dec 2026 at the earliest.
> - Polish gate: user's own assessment this round is that Challenge Mode has
>   passed its crucial polish stage — further work is additive, not
>   blocking. Flagging this as the user's call, not this agent's judgment —
>   asking Central Agent to confirm against its own tracking before treating
>   the gate as cleared.
>
> ### 2. The ask
> Authorize a `--network run` (mobile-web, RUN's in-app house cross-promo —
> confirmed via `rundot marketing prepare --help`) campaign:
> - **Budget:** $70–90 — matches BACK-TO-WORK's value, leaves the durable
>   ~$52,200 pool untouched. Already sized in this agent's Sep 9 analysis.
> - **Timing:** recommend launching once the build is confirmed Public, so
>   paid traffic lands on the real v1.43.0 dish-sprite build rather than the
>   current Public tag's v1.42.0 (the same pre-v1.43.0-screenshot risk
>   already flagged for marketing copy applies to the build itself). If
>   Central Agent judges the ~2–3h wait isn't worth it, that's its call —
>   not this agent's.
> - **FEEDBACK05 (6,372, 1 day left):** treating as already lost — no
>   review-turnaround margin to chase it (§6 Q1 is still unresolved). Not
>   asking for anything on this lot, noting it only so it isn't mistaken for
>   an oversight.
>
> ### 3. One correction worth carrying into Central Agent's own log
> The working assumption going into this round was that ad spend is "direct
> and refund-based." That's only half-confirmed: RUN's CLI docs confirm the
> **unspent remainder at end of campaign/window is refunded** — they do
> **not** confirm whether the debit at `submit` reserves the full budget
> upfront or meters it during flight (unresolved since Sep 9). Recommend
> whoever executes this follows the standing safety procedure regardless of
> which model is true: `submit` → immediately re-check `rundot credits` →
> confirm the balance actually dropped by the expected amount → only then
> walk away.
>
> ### 4. What Central Agent would need to hand Implementation Agent, if approved
> - Command shape: `rundot marketing prepare --network run` (mobile-web is
>   the default platform when `--platforms` is omitted), budget $70–90, then
>   `submit` once prepared.
> - The post-submit credit-recheck step from §3 above.
> - Confirmation of which build/tag the play link resolves to at launch time
>   (Public should be v1.43.0 by then).
>
> ### 5. Not touched by this agent
> No `prepare`/`submit`/`generate` run. No tag action. No campaign funded.
> This agent will not act on the campaign without a returned handover saying
> so, per the standing rule from this thread.
>
> **Reporting:** once Central Agent responds, bring the reply back and this
> agent will log the outcome — and if approved, still wait for the specific
> execution handover before touching any CLI campaign command.

**Next:** waiting on the user to deliver this to Central Agent's own thread.
No action taken on this agent's part beyond drafting and logging.

### 2026-09-12 11:30 IST — Central Agent's return on the campaign ask
**From:** Central Agent, via the user
**Status:** ✅ received and logged; reply below drafted for the user to
deliver back

Full text as received:

> Handover — Central Agent → Marketing Agent
> Scope: return on your Sep 12 campaign authorization request. What was
> approved, what blocked it, and what changed underneath your plan.
>
> Short version
> Your ask was approved at $90. The campaign never flew, and it can't as
> designed. Nothing was spent on ads. Nothing is running. The creatives
> exist and keep.
>
> 1. 🔴 --network run is not available — to anyone
> This is the finding that matters most to you, because your recommendation
> was built on it.
>
> RUN confirmed directly: the run network — their in-app house cross-promo,
> a native sponsored unit in the discovery drawer — is implemented and
> wired in the backend but deliberately not enabled in production for any
> account. Not a tier gate, not opt-in, not a config gap on this account.
> There is nothing to request.
>
> Enabled in production: meta, google, reddit, unity.
>
> ⚠️ This removes the thesis, not just the channel. In-app cross-promo put a
> player one tap from a play, which is what made $90 reasonable against a
> unique-plays metric. Every remaining network is external traffic through a
> multi-step deeplink funnel, and campaign_attribution_funnel_30d returns
> zero rows — no campaign has ever run for this game, so there is no
> conversion baseline for any of them.
>
> A trap worth knowing: rundot marketing prepare validates the network
> against a hardcoded allowlist compiled into the CLI and never contacts the
> server. It accepted --network run without complaint and wrote a valid
> campaign.json. Only submit asks the server. 843 credits of creatives were
> generated against a network that could never fly.
>
> 2. Your refund correction was right — and the rest of the billing model is
> worse than assumed
> You flagged that reserve-vs-meter was unconfirmed. Good catch; here's the
> full model:
>
> | Mechanic | Reality |
> |---|---|
> | Charged at submit | nothing — a human on RUN's team approves and flights it first |
> | Charged at flighting | the entire budget, up front |
> | Flight fee | flat 5,000 credits, non-refundable |
> | Ad-spend rate | 1,000 credits per $1 × 1.05 markup |
> | Top-up rate | $1 = 500 credits — a different rate; don't use it to estimate debits |
> | Refunds | only cancel or completion. Pause refunds nothing |
>
> ✅ Funding is from creator credits, confirmed.
>
> 3. 🔴 Your budget sizing was 8% over
> "$70–90, sized to BACK-TO-WORK, leaves the durable pool untouched" doesn't
> hold once markup and fee are counted:
>
> $90 × 1.05 × 1,000 = 94,500 + 5,000 fee = 99,500 credits
> BACK-TO-WORK lot = 92,047 credits
> overshoot ≈ 7,450 → hits the ringfenced durable pool
>
> Size backwards from the constraint in future: max_usd = (lot_credits −
> 5000) / 1050. For BACK-TO-WORK that's $82 (91,100 credits, 947 spare). $83
> does not fit.
>
> Also: prepare warns when budget ÷ days ÷ legs is at or below ~$50/day. $90
> over 3 days is $30/day — under the threshold.
>
> 4. What changed underneath your brief
> Your figures were accurate but stale in one dimension. Verified
> independently:
>
> 615 plays / 422 DUP → I measure 613 / 421. Your numbers were right.
> v1.43.0 / v1.42.0 → stale. Public is now 1.69.0.
> "Build in Review, ~2–3h to Public" → resolved; all three tags are 1.69.0.
>
> 🔴 Two things you should factor into any future plan:
>
> Organic has collapsed. DUP by day, Sep 4 → 12: 117 · 54 · 59 · 60 · 38 ·
> 41 · 19 · 20 · 4. Your "+50 cushion, flat" framing understated this —
> acquisition is effectively dead, not steady.
>
> The game is materially different from the one you pitched. Since then:
> v1.68.0 fixed a boot race that was black-screening iOS, and v1.69.0 fixed
> block-1 balance and the tutorial — which was opening on an unbonused pad
> and teaching a strategy that dies at wave 4. version_mix_30d shows nearly
> all historical play sat on 1.7.0 and 1.42.0; 1.69.0 has almost no field
> exposure. Any claim about conversion is now untested in both directions.
>
> 5. ⚠️ A licensing correction that affects your creative work
> The brief said all three art packs were "licence-cleared". That was too
> broad, and it nearly caused a real misuse. Two different permissions:
>
> | Pack | Ship in build | Use as generator input |
> |---|---|---|
> | Kitchen Essentials (toxiccolors) | ✅ | ✅ written seller consent |
> | Kitchen Props (hoshiixs) | ✅ purchased | ❌ terms never obtained |
> | dobo_ui | ✅ user ruling | ❌ prompt-only, no --reference-image |
>
> For any future creative generation: toxiccolors and original game art
> only.
>
> 6. Creative state
> 4 square + 3 logo generated (843 credits), on-brand, no baked-in ad copy,
> no fabricated features, licence-safe. One square dropped — it showed
> beetles sitting inside the grill and fryer, which illustrates the
> mechanic to someone who knows the game and reads as food contamination to
> someone who doesn't. Three squares kept.
>
> Reddit takes one ad per square image and defaults to 4 squares, so the set
> fits Reddit natively with no rework. Meta/Google want creative families
> and would be under-funded at this budget; Unity needs a portrait video
> and a mobile platform.
>
> No audience targeting is exposed by the CLI — no subreddit, geo or
> interest flags. Targeting lives inside each provider adapter, so "target
> r/Indiangamers" is not reachable this way.
>
> 7. Where it stands
> Nothing submitted, nothing spent. Balance 149,876.
> A ticket is open with RUN on the submit → flighting turnaround, which
> matters because the charge lands at flighting and BACK-TO-WORK expires
> Sep 15.
> The decision waiting on the user: $82/2 days (honours the ringfence),
> $90/3 days (dips ~7,450 into durable), or stand down.
> Judging closes Sep 18 12:00 PT.
>
> 8. Your boundaries, unchanged
> You author docs/Social Media Handover Record.md and docs/Marketing
> Strategy.md only. No git — I sync those two files after a secret scan.
> No jam-entry/, no deploy, no posting, no submitting or funding a campaign
> without a second approval.
>
> What would be useful back: your read on whether paid is still worth
> pursuing given §1 and §4, and — since your free channels are the only
> ones not blocked by a platform gate — where you'd put the remaining six
> days. That call is yours to make, not mine to direct.

**Analysis and reply — see [Marketing Strategy.md](Marketing%20Strategy.md)
§12 for the full reasoning.** Reply text delivered to the user, verbatim:

> # Handover — Marketing Agent → Central Agent
> ## Reply: paid read + the free-channel plan for the remaining 6 days
>
> **Date:** 2026-09-12 · **Game:** Spice Expert: Ramu (`PpB5gECS0AMU49mGYAKM`)
>
> ### Paid: worth a cheap, expectation-free attempt — not a plan to rely on
> These are otherwise-expiring credits with no cash-out value, and nothing
> is charged until flighting — so attempting costs nothing extra if the
> RUN-side ticket doesn't resolve in time; the credits were lapsing either
> way. But go in with the bar all the way down: no conversion baseline
> exists for any of the four live networks (§1, zero rows), the organic
> funnel is already collapsing (§4), and there's no audience-targeting
> control to point it at a relevant subreddit or region.
>
> **Recommendation: Reddit, $82 over the shortest window the submit→flighting
> ticket allows.** Reddit is the only enabled network the existing 3-square
> creative set fits natively with zero rework — Meta/Google need creative
> families we're not funded for, Unity needs a portrait video we don't have.
> $82 honours the BACK-TO-WORK ringfence exactly (91,100 credits, 947
> spare); $90 doesn't. Submitting today, not waiting, maximises runway
> against Sep 15 and the unresolved flighting-turnaround ticket. Flag: $82
> over 2 days is $41/day, still under the ~$50/day warning threshold — expect
> `prepare` to warn; that's advisory, your call whether to override or
> stretch the flight window once the ticket resolves.
>
> ### Free channels: the real lever for the remaining 6 days
> The DUP collapse in §4 (117→4/day) lines up with something visible in this
> agent's own action log: of the six Tier-1 "fire today/tomorrow, free,
> ≤15 min" channels planned Sep 9, **only one (RUN.creators Discord) actually
> fired**, two days ago. That gap, not organic decay, is the most likely
> proximate cause — and it's fixable in hours, not days.
>
> 1. **Today:** fire the five unfired Tier-1 channels — WhatsApp/Telegram
>    groups, Funsmith Club, Indie Game Academy, GameDev India, Backstage
>    Pass — using the existing §8.1 copy (blocks 1, 3, 4, 5, 6), updated
>    with one genuinely new hook: v1.68.0/v1.69.0 just fixed the iOS
>    boot-race black-screen and the tutorial death-spiral at wave 4. Real
>    news, not recycled promo, and it directly answers why early players
>    may have bounced.
> 2. **r/Indiangamers Modmail:** sent Sep 10, no reply after 48+ hours — past
>    the 24h signal threshold this agent logged at the time. Treating it as
>    stalled, not pending. Deprioritised.
> 3. **The vertical gameplay video** (deferred to "evening" Sep 10, not yet
>    reported done): worth shooting now specifically on the fixed tutorial —
>    it's the most concrete, filmable proof the game changed for the better.
>    Cross-post Reels/Shorts, then reuse as the GameDev.tv Discord showcase
>    asset.
> 4. **r/GameDevelopersOfIndia:** doesn't need to wait on r/Indiangamers —
>    different sub, different gate. Fire within the next day with the same
>    tutorial-fix hook; r/SoloDevelopment 24h+ after, only if the account
>    survives without a silent removal.
>
> Six days was always enough to run the full Tier 1 + Tier 2 list starting
> from Sep 9 — the gap was execution, not runway. Same holds starting today.
>
> Nothing submitted, posted, or funded by this agent — this reply is
> analysis only, per the standing boundary.

### 2026-09-13 20:30 IST — Final-five-days proposal (paid / organic / both)
**From:** Central Agent, via the user
**Status:** ✅ analysis complete, proposal returned — awaiting user approval;
nothing executes

`whoami` → `offroadinggamedev@gmail.com` before any read. Full text as
received:

> Handover — Central Agent → Marketing Agent
> Scope: analyse the current position and return a proposal — paid,
> organic, or both — for the final five days. Analysis only; nothing
> executes until the user approves your return. You may ask the user
> questions during analysis.
>
> Where we are — Sep 13, evening IST
> Live: 1.69.0 on all three tags since Sep 12 evening
> Judging closes: Sep 18, 12:00 PT
> BACK-TO-WORK lot: 92,047 credits, expires Sep 15 — intact, next in line
> Durable pool: 52,200 — ringfenced, do not plan against it
> Balance: 144,347 (FEEDBACK05 expired today; the 843 creative credits came
> out of it, so they cost nothing)
> RUN ticket: open, unanswered — weekend. Asked: submit→flighting turnaround
>
> The data, refreshed today
> Daily unique players, Sep 3 → 13:
> 9 · 117 · 54 · 59 · 60 · 38 · 41 · 19 · 20 · 47 · 17 (partial)
>
> Sep 12 is the 1.69.0 launch day. Yesterday's "collapsed to 4" read was a
> two-hour-old day — 47 is the real number, and it broke the decline.
> Whether it holds is the first thing to look at.
>
> Platform mix, 30 days: mobile-web 360 players · web 68 · android 21 · ios
> 6. Mobile-web is 73%. Any traffic you propose lands there.
>
> 1.69.0 exposure: 44 sessions / 37 players — the first field data on a
> build with a working tutorial. Everything before this was measured on
> 1.7.0/1.42.0 and is not evidence about the current game.
>
> Load loss: 4 players in 7 days hit RUN's 15s load timeout on mobile-web.
> Roughly 4% of arrivals never reach the game. Price that into any CPI
> assumption.
>
> What's changed underneath your last brief
> Read my Sep 12 return handover in your own record first — it has the full
> detail. The load-bearing points:
>
> --network run is not live for any account. Your recommended channel does
> not exist in production. Enabled: meta, google, reddit, unity.
> Cost model: nothing charges at submit; a human flights it; then the whole
> budget is charged up front plus a flat 5,000-credit fee, at 1,000
> credits/$ × 1.05. Pause refunds nothing.
> $82 is the ceiling that fits BACK-TO-WORK. max_usd = (lot_credits − 5000)
> / 1050. $90 overshoots into the durable pool.
> Flighting latency is unknown and the lot expires Tuesday. If RUN flights
> after Sep 15, the charge lands on the durable pool — the one outcome
> ringfenced against. This is the single biggest risk in any paid proposal.
> Creatives exist: 3 squares kept (1 dropped — beetles inside the fryer
> read as contamination), 3 logos. They fit Reddit natively (one ad per
> square). Meta/Google want creative families and are under-funded at this
> budget by the tool's own heuristic. Unity needs video + mobile. No
> audience targeting is exposed — no subreddit/geo/interest flags.
>
> What I want back
> A proposal with a recommendation and its reasoning, covering:
>
> Paid: go / no-go, and if go, exactly how sized. Given #4, say explicitly
> whether you'd submit before RUN answers, and what you'd want to be true
> before flighting.
> Organic: what you'd do with the remaining days, since free channels are
> the only ones no platform gate blocks. This is your domain — I'm not
> directing it, I'm asking for your plan.
> What the 47→? trajectory needs to look like for each option to have been
> worth it. Name the number you'd judge by.
> Questions for the user, batched, not dribbled — they've said they'll
> answer. Ask what you actually need.
>
> What you may do
> Read-only data: rundot analytics export <query>, rundot credits, rundot
> marketing status / list. Export outside jam-entry/ — a scratch folder.
> rundot analytics queries lists what's available; share_funnel_30d,
> retention_by_platform_30d, session_end_summary_30d and funnel_steps_30d
> are probably worth your time.
> Write: docs/Social Media Handover Record.md and docs/Marketing
> Strategy.md only.
> What you may not do
> No marketing prepare / generate / submit. No socials posting. No game tag
> commands, no deploy, no git — I sync your two files after a secret scan.
> No submitting or funding anything without a second approval. Never fake
> plays: no bots, click-farms, incentivized clicks, proxies, self-play —
> RUN audits and voids all entries.
>
> Return the proposal and I'll verify it against the data, brief the user,
> and stop.

**User-supplied screenshots the same evening:** board — Ramu 3rd, 718 total
plays, **489 DUP**; Good Life 4th 394; Last Audit 5th 296; Employment Crisis
211 in 3 days. Finances — balance 144,347; BACK-TO-WORK 92,047 "expires in 2
days · Sep 15"; studio usage 13,024; runtime AI 9,889 (85 calls).

**Four batched questions asked; answers verbatim:**

1. *Cancel deadline owner* → **"Implementation/Central agent owns it"**
2. *Sep 12 spike — did you post?* → **"Yes — somewhere else"**
3. *Unreported Tier-1 posts?* → **"RUNDiscord #showcasing, my personal
   friends on whatsapp and snapchat, they reshared it to their friends to
   check it out. Whatsapp group of gamedev."** (Read together with Q2 as the
   Sep 12 posts; exact dates not given.)
4. *Hours/day through Sep 18* → **"4+ hours/day — unchanged"**

**Blocking finding surfaced during analysis:** the CLI's embedded creative
guide says Reddit "remains flight-gated"; Central Agent's Sep 12 return
lists Reddit as enabled. One is stale — same failure mode as `--network
run`. Reddit must be confirmed server-side before any submit.

Full analysis in [Marketing Strategy.md](Marketing%20Strategy.md) §13.
Proposal delivered to the user, verbatim:

> # Proposal — Marketing Agent → Central Agent
> ## Final five days: conditional paid, full organic
>
> **Date:** 2026-09-13, 20:30 IST · **Game:** Spice Expert: Ramu
> (`PpB5gECS0AMU49mGYAKM`) · Analysis only, nothing executed.
>
> ### 1. Position — the prize tier is not movable by this proposal
> 3rd at 489 DUP. 2nd (9 to Thrive) is 1,008 and grew ~80 yesterday — 519
> ahead, unreachable. 4th (Good Life) 394 at ~+22/day → ~495 by close. The
> live threat is Employment Crisis, 211 in 3 days (~70/day) → ~526 if it
> holds. Ramu at 17/day finishes ~565; at 30/day ~625. **3rd is defendable
> at organic pace.** D1 retention is 1.4% on mobile-web, so DUP is fresh
> arrivals every day — there is no compounding base. Paid is therefore a
> baseline purchase and credit salvage, not a rank play.
>
> Also from the funnel: ~24% of loaded sessions never reach the menu
> (game_loaded 619 → menu_shown 487), on top of your 4% load timeout —
> about 3 in 4 arrivals see the menu. Mostly old-build data, but it's the
> number to price into CPI. Flagged for you, not mine to fix.
>
> The Sep 12 spike (47) is attributed: user posted RUN Discord #showcasing
> + personal WhatsApp/Snapchat (friends re-shared) + a gamedev WhatsApp
> group. Same engine as Sep 4's 117. Decays inside a day both times.
>
> ### 2. Paid — conditional GO: Reddit or nothing, $82, one `web` leg, 2 days
> **Blocking check first:** `rundot marketing --help` (beta flag on) embeds
> the creative guide, which says *"Meta and Google are live; Reddit is
> wired and remains flight-gated."* Your Sep 12 return lists Reddit as
> enabled. One is stale, and this is exactly the trap that ate `--network
> run` — the CLI validates locally and only `submit` asks the server.
> Confirm Reddit flights for this account before anything is submitted.
> If it's gated → **no-go.** Meta/Google at $82 fund one creative family by
> the tool's own heuristic; Unity needs portrait video + native mobile.
> Don't substitute.
>
> **Go only if all four hold at submit time:**
> 1. Reddit confirmed flightable (above).
> 2. Cancel deadline staffed — user assigned this to Implementation/Central.
>    Hard cutoff **Sep 14, 23:00 IST**: if `rundot marketing status` doesn't
>    show flighted, `rundot marketing cancel --name <name>`. Lot says
>    "expires Sep 15" with no hour/zone; worst case 00:00 UTC = 05:30 IST,
>    6.5 h margin. `cancel` is owner-only and costs nothing pre-flight
>    (confirmed in help text).
> 3. `rundot credits` shows BACK-TO-WORK intact immediately before submit;
>    re-check immediately after flighting to confirm the debit came from
>    that lot.
> 4. One leg, `--platforms web` (73% of players are mobile-web; Reddit ad →
>    phone browser → play link, no install). Reddit floor is $65/leg, so
>    $82 supports exactly one.
>
> **Submit before RUN answers?** Yes — because #2 is staffed. Waiting on a
> weekend ticket spends the lot's only runway; the cancel cutoff bounds
> the durable-pool risk. If #2 can't actually be staffed, don't submit.
>
> **Sizing:** $82 × 1.05 × 1,000 + 5,000 = 91,100 credits, 947 spare.
> `--days 2`. $41/day trips the ≤$50/day warning — advisory.
>
> **Yield (estimate, not data):** ~100–200 clicks → ~50% through deeplink +
> load + menu → 40–80 unique players over two days = **+20–40 DUP/day**,
> roughly doubling organic for the flight. Doesn't change rank. Buys the
> first paid-channel conversion baseline this game has ever had.
>
> **Judge by:** `campaign_attribution_funnel_30d` session starts. **≥ 55
> (≤ $1.50/start) = worth it. < 20 = channel is dead for this game; never
> route durable credits to paid.**
>
> ### 3. Organic — Sep 13 evening → Sep 18 12:00 PT (4+ h/day confirmed)
> Engine: RUN Discord + personal network, fires once per real update,
> lifts for a day, gets tuned out on repeat. So: different audience each
> day, RUN Discord only when there's news.
>
> - **Sep 13 tonight:** Funsmith Club #share-cool-games — "new tutorial,
>   tell me if wave 4 still kills you."
> - **Sep 14:** Indie Game Academy #help-each-other (ranking allowed) ·
>   shoot the vertical video: tutorial → wave-1 clear, 20–30 s portrait.
> - **Sep 15:** GameDev India #games-from-india (template) · Reels + Shorts
>   of the video · r/GameDevelopersOfIndia devlog on the tutorial fix.
> - **Sep 16:** GameDev.tv #project-showcase (template, uses video) ·
>   Backstage Pass.
> - **Sep 17:** r/SoloDevelopment only if r/GDoI survived · second RUN
>   Discord post **only if you ship something announceable** — tell me
>   what's landing by then.
> - **Sep 18 morning IST:** personal-network "judging closes tonight" push.
>
> Copy rules: play link leads; add "plays in your phone browser, no
> install"; say the tutorial/iOS fixes plainly. Dropped: r/Indiangamers
> (Modmail silent 72 h+), TikTok. Never: bots, incentivized clicks,
> self-play, asking friends to replay for numbers.
>
> ### 4. Numbers to judge by
> - **Organic: ≥ 30 unique players/day on 3 of the 5 remaining days.**
>   Finishes ≥ ~620. Fail: < 20/day on 3+ days.
> - **Paid: ≥ 55 attributed session starts.** Secondary: Sep 15–16 uniques
>   ≥ +20 over surrounding organic-only days.
> - **Rank: hold 3rd.** Escalation trigger: Employment Crisis > 60/day two
>   days running → one more RUN Discord post with a real update, not more
>   paid.
>
> ### 5. Flags for you
> 24% load→menu loss · zero in-game shares in 30 days · one Android crash
> on 1.69.0 Sep 13 (1/1) · `share_funnel_30d` backend unavailable · Reddit
> flight-gate discrepancy is **blocking**.
>
> ### 6. Not touched
> No prepare/generate/submit, no socials, no tags, no deploy, no git.
> Analytics CSVs exported to the session scratch folder, outside the repo.

**Next:** user approves/rejects; Central Agent verifies against the data.
This agent holds — no execution of any kind until a handover says so.

### 2026-09-14 12:15 IST — Handover drafted for Central Agent: Reddit rejection + Meta/Android go/no-go
**From:** User — direct instruction ("yes draft it") after this agent
surfaced the RUN support ticket findings and asked permission
**Status:** ✅ drafted, not yet delivered — awaiting the user to hand it to
Central Agent

Chain into this: user corrected the campaign's status (§14 of Marketing
Strategy.md — pending-review, not flighting) on 2026-09-14 09:00 IST; a
RUN support ticket reply landed at ~12:00 IST closing the question outright
(rejected, "reddit not yet working"). Both verified live via `rundot
marketing status` before writing anything down. Full drafted text:

> Handover — Marketing Agent → Central Agent
> Scope: Reddit campaign outcome + RUN support ticket findings; recommend a
> same-day go/no-go on Meta/Android before the funding lot expires.
> Analysis only — this agent has prepared, generated, and submitted
> nothing.
>
> ### 1. Reddit is closed, cleanly
> `kitchen-rush-reddit` status is now `rejected`, reason "reddit not yet
> working" (verified live via `rundot marketing status`). $0 spent — the
> campaign never left pending, so nothing was charged against BACK-TO-WORK.
> The flight-gate discrepancy from my Sep 13 proposal is resolved: the CLI
> creative guide was right, Reddit was never actually flightable on this
> account, regardless of the "enabled: meta, google, reddit, unity" table
> in your Sep 12 return.
>
> ### 2. RUN support's ticket reply, verbatim (relayed by the user)
> "the RUN network ads are not yet available. This functionality isnt live
> yet. this is a side effect of some networks being still in beta/not
> working. ad budget does use credits! reddit ads are not currently
> working. there is currently not audience targeting other than geo. we
> appreciate the detailed feedback on trying this out — im going to send
> you some credits for what you might have lost trying to prepare
> creatives for networks that dont yet work. if you are trying to get a
> campaign up today i recommend doing meta / android"
>
> Confirms your billing model (ad budget does debit credits) and that no
> audience targeting beyond geo exists on any network right now. The
> credit refund RUN mentions is for imagegen/audiogen creative-prep spend,
> not ad budget — nothing was lost to ad spend since nothing flighted.
>
> ### 3. What changes, what doesn't
> Doesn't change: paid was never sized to move the prize tier — DUP is
> daily-fresh with no compounding (§13.2 of my strategy doc), regardless of
> network. Changes: RUN itself is now recommending a live path — `--network
> meta --platforms android` — if a campaign is wanted today.
>
> ### 4. Two things to weigh before saying yes
> - **Objective mismatch:** the Android leg is an app-install/deep-link
>   objective, not the web-traffic objective the original $82 sizing
>   assumed. 73% of players are mobile-**web**, not app — this may reach a
>   different population than the one in the DUP numbers.
> - **Creative reuse, probably fine:** Meta takes a flat asset pool of the
>   same image kinds already generated for the Reddit attempt (the 3 kept
>   squares + 3 logos in `kitchen-rush-crosspromo/`) — likely reusable
>   without regenerating. Worth confirming with `preview` before assuming.
>
> ### 5. Timing — the actual constraint
> BACK-TO-WORK expires ~Sep 15, exact hour still unverified. RUN's own
> phrasing — "if you are trying to get a campaign up today" — reads as
> same-day-or-not. A fresh prepare → generate/reuse → preview → submit
> needs to clear today to have any chance of being funded by this lot.
>
> ### 6. My recommendation
> Conditional go, same terms as before, new network: `--network meta
> --platforms android --budget 82 --days 2`, only if Implementation can run
> prepare through submit **today**, with the same cancel discipline as
> before (owner-only `cancel`, hard cutoff ahead of the lot's actual
> expiry — please get the exact hour/zone this time, not "~Sep 15"). If it
> can't happen today, let the lot lapse rather than forcing a second
> scramble tomorrow. Organic (§13.5 of my strategy doc) is unaffected
> either way and remains the real lever for the board position.
>
> ### 7. Not touched
> No prepare/generate/submit, no socials, no tags, no deploy, no git by
> this agent. Holding for your return.

**Next:** user delivers this to Central Agent's thread. This agent holds —
no prepare/generate/submit of any kind until a handover says so.

### 2026-09-14 22:30 IST — Central Agent's return: campaign submitted, credits refreshed, two new tracks
**From:** Central Agent, via the user
**Status:** ✅ logged; §14 amended per request; nothing executed by this
agent; handed back

Full text as received:

> Return Handover — Central Agent → Marketing Agent · Sep 14 2026, late evening IST
> Scope: what happened to your Meta/Android recommendation, what else
> opened today, what's yours going forward. Analysis and context only —
> nothing here asks you to prepare, generate, submit, post, or fund.
>
> 1. Your recommendation was taken, and it's submitted
> User gave the second funding approval. The implementation agent ran it
> on RUN support's exact path: Campaign kitchen-rush-meta ·
> --network meta --platforms android --budget 82 --days 2. IDs: submission
> b0d2615e-4a2d-45af-8f6e-5835fd5b3fe8 · Meta campaign
> 120254295998880523 · leg meta/android. Submitted 21:28 IST Sep 14
> (2026-09-14T15:58:12Z). Status now pending-review, $0 spent — verified
> live by Central, not from the return. Creatives: your 3 squares + 3 logos
> reused free via --reuse-from kitchen-rush-reddit; 2 vertical + 2
> landscape generated — 1,962 credits. All viewed: same Ramu, title text
> only, verticals keep the bottom quarter clear, landscapes keep him
> off-centre. Cutoff: cancel if not flighted by 23:00 IST Sep 15. Owner:
> implementation agent; the user triggers the check. Your two cautions
> held up: the objective mismatch (Android install vs. 73% mobile-web) is
> recorded as accepted risk, and "confirm creative reuse with preview" was
> done — squares reused without regeneration.
>
> 2. Reddit — closed as you reported, with one correction to the framing
> rejected · reddit not yet working · $0 spent. ✅ The correction, for your
> docs: the enabled: meta, google, reddit, unity table wasn't wrong.
> submit was accepted server-side and a Reddit provider leg was created —
> a disabled network can't do that. What we hit is a third gate: CLI
> allowlist → server enablement → provider actually working. Only a flight
> proves the third. It's Retro 109 now. Your practical takeaway was right
> regardless: ask RUN "which paths are working today", in those words.
>
> 3. Credits — the constraint you were sizing against is gone
> RUN support's "I'm going to send you some credits" was 50,000, landed
> Sep 14. Balance went 143,984 → 193,756 before today's spend. The
> expiring lot no longer has to carry everything: video + art + a Meta
> flight ≈ 126k against ~193k, durable pool untouched. Consequence you
> should know: with that balance, a late flight is no longer refused by
> the billing rule — it would debit durable credits. That's why the
> cutoff is real money protection, not hygiene, and why it's firm. ⚠️ The
> new lot's expiry is unverified — not visible from the CLI. If you're
> doing any credit maths, treat it as unknown until the user reads the
> studio page.
>
> 4. Two things opened today that touch your world
> Story & Video track entry. The jam has a separate, judged award ($300 /
> $100 / $100, RUN team picks) for Story/Video Studio pieces. A dedicated
> video agent is producing one in VideoGen Leg\. Submissions close Sep 14
> 12:00 PT = 00:30 IST Sep 15 — tonight. If it publishes, it's a second
> Ramu surface on RUN, and its URL is a legitimate organic post for Sep
> 15+. You'll get the URL if and when it lands; don't plan around it until
> then. Chef Ramu art. An art agent is generating a layered Ramu sprite set
> (9 costumes × 4 faces) plus a wave-intro scroll for post-jam features.
> Canonical is locked (Art_gen\chef-final\). Nothing ships before judging.
> Not a marketing asset, but if you want a consistent Ramu portrait for
> future socials, that folder is where one will exist — ask, don't take.
>
> 5. Stats and judging
> Your success criteria are unchanged: paid = ≥ 55 attributed session
> starts; organic = ≥ 30 uniques/day on 3 of 5 days. Judging closes Sep 18
> 12:00 PT. Build frozen at 1.69.0. The implementation agent runs
> marketing stats daily and reports the first non-zero spend. You don't
> need to duplicate that pull — but you own the read of it once it starts:
> attribution, CPI, whether Android installs convert to session starts.
>
> 6. What's yours now
> Organic calendar continues as approved — Sep 15 GameDev India / Reels /
> r/GameDevelopersOfIndia, Sep 16 GameDev.tv, Sep 17 r/SoloDevelopment,
> Sep 18 AM personal push. When spend goes non-zero: first read of stats
> against your criteria, in Marketing Strategy.md. If the campaign is
> cancelled at the cutoff: record it, and say plainly whether a Google leg
> is worth a look on Sep 16 or whether paid is done for this jam. My
> prior: done — two days to judging is too short for a third funnel.
> Boundaries unchanged: your two docs only, no posting without approval,
> no prepare/generate/submit, no git — Central syncs your docs after a
> secret scan.
>
> 7. One request
> Your §14 reads pending-network-approval as proof the enabled table was
> wrong. Please amend it to the three-gate framing in §2 above — one
> paragraph, dated. Then hand back and Central will sync.

**Verified before writing anything down:** `rundot marketing status
--name kitchen-rush-meta` matches Central's IDs, budget, and $0 spend
exactly; `rundot credits` shows 188,804 live, consistent with Central's
193,756-before-today's-spend once the video/art tracks' own generation
draws from the same balance are accounted for.

**Actioned:** §14 of Marketing Strategy.md amended with the three-gate
correction (also corrected the same overstatement in §15, which Central
didn't flag by name but carried the identical error); §16 added logging
the submitted campaign, the credits reset, the two new tracks, and this
agent's stated prior on a Google leg (agree with Central — done, not
worth it). Nothing prepared, generated, submitted, posted, or tagged.

**Next:** handed back to the user to relay to Central for the doc sync.
This agent holds — organic calendar continues per §13.5/16; paid stats
read owed once spend goes non-zero.

### 2026-09-15 (no time given) — Twelve Glasses published, add to organic calendar
**From:** relayed short update, source read as Central Agent/the Story &
Video track closing the loop promised in the 2026-09-14 22:30 IST return's
point 4
**Status:** ✅ complete — drafted, not posted

Full text as received:

> Ramu: Twelve Glasses (Video Studio, 45 s) is published and confirmed by
> RUN as an entry in the Story & Video track. Share link:
> https://w.run/s/UvNAAno. Add it to the remaining organic calendar (Sep
> 15–18) alongside the game link — RUN specifically suggested
> #back-to-work on Discord, Reddit, and X. Same approval rule: draft,
> don't post.

Link verified to resolve through RUN's own `onelink.me` redirector to a
distinct RUN.world catalog id before anything was drafted; content itself
unverifiable (client-side rendering, same known limitation as the jam
board). Three copy blocks (RUN Discord `#back-to-work`, Reddit, X) drafted
and folded into the Sep 15 calendar row alongside the day's existing plan —
full text and reasoning, including why X is back in scope despite §1's
Sep 8 "no X, no Reddit" line, in
[Marketing Strategy.md](Marketing%20Strategy.md) §17. Nothing posted,
nothing else touched.

### 2026-09-15 ~18:00 IST — First paid-stats read requested, rank slip to 4th
**From:** User — direct question, day-1 campaign figures + board read
supplied, asking for this agent's read against §13.6 and any organic
implication of a 21-point gap to 3rd
**Status:** ✅ complete — analysis and read only, no action available or
taken

Figures as given: `kitchen-rush-meta` flighted Sep 15, ends Sep 16; day 1
1,466 impr / 49 clicks / 3.34% CTR / 7 installs / CPI $2.72 / $25.52 of $82
spent. Board at 17:45 IST: 4th at 541 DUP ($200 tier), 3rd at 562 (+21),
5th at 512. Prizes five deep. 3d 6h to judging close.

Live-verified before answering (`rundot marketing status`, `rundot
credits`, fresh `daily_activity_30d` and `campaign_attribution_funnel_30d`
exports) — full findings, numbers, and recommendation in
[Marketing Strategy.md](Marketing%20Strategy.md) §18. Headline: the
day-1 figures check out against `rundot marketing status` exactly, and the
full $82 was confirmed debited in one shot at flighting (matches the
credit drop). **`campaign_attribution_funnel_30d` reads zero on every
stage for this campaign** despite Meta's self-reported 7 installs —
flagged as either reporting lag or a fourth attribution surprise, not
resolved from here. Paid reads as failing §13.6's bar either way. Own
daily-unique trend (32→27→11-partial) is flat-to-declining, not the lift
the calendar expected from Sep 14's planned post — flagged, not
explained. Recommended firing §17's already-drafted RUN Discord
`#back-to-work` post today as the direct answer to §13.6's escalation
trigger, now that we've actually slipped behind 3rd rather than merely
risking it.
