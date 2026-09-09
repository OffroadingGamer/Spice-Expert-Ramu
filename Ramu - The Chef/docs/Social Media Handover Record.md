# Social Media Handover Record

**Last updated:** Sep 9 2026, 01:30 IST
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
