# Marketing Strategy

**Last updated:** Sep 9 2026, 14:15 IST
**Owner:** Social Media Agent · **written to by that agent only**
**Companion:** [Social Media Handover Record.md](Social%20Media%20Handover%20Record.md)

---

## What this file is

**Every action the Social Media Agent takes, logged with its date and outcome.**
Handovers received go in the companion file. The reasoning behind the strategy — why
these surfaces, why this cadence — lives in [Plan.md](Plan.md) §5 and is **read-only** to
this agent.

## 1. 🔒 The surfaces — decided, not a gap to work around

**The user has LinkedIn and Discord. Nothing else.** No X, no Reddit
([Plan.md](Plan.md) §5.6).

| Surface | Shape | Cadence |
|---|---|---|
| **RUN Discord `#back-to-work`** | Jam-native, highest-intent, reciprocal | **Daily** — the only repeatable source of new players |
| **LinkedIn** | Professional network, portfolio artefact | One spike, then decay. Save it for something genuinely notable |

**Link policy.** The score is plays, not votes, so the play link wins everywhere *except*
the RUN Discord, where the audience votes as well as plays:

| Surface | Link |
|---|---|
| RUN Discord | `https://run.world/jams/september-2026-jam?game=PpB5gECS0AMU49mGYAKM` |
| LinkedIn | `https://w.run/puneetmakes/spice-expert-ramu` |

## 2. Where the numbers stand — Sep 8 2026, 23:15 IST pull

| | Rank #1 | **Us (rank #2)** |
|---|---|---|
| Total plays | 989* | **421** |
| **Daily Unique Plays** ← *the scored metric* | 645* | **320** |

\* Rank #1's figures are Plan §5.7's Sep 8 morning read and are **not refreshed this
pull** — the jam board renders client-side and isn't fetchable from here; per Plan
§5.7 it's a manual browser read off `run.world/jams/september-2026-jam`, next due
Sep 10.

Daily uniques: Sep 3 **9** · Sep 4 **117** · Sep 5 **54** · Sep 6 **59** · Sep 7 **60**
· Sep 8 **21 so far** (day not yet rolled — was partial **9** at the last pull, still
climbing).
**Three flat days at 54–60 with no post** — a stable floor, not a decaying spike.
Full analysis in [Plan.md](Plan.md) §5.7.

## 3. 🛑 Standing rules

- ⛔ **Never post.** Draft only. Posts go out under the user's own name.
- ⛔ **Never bots, click-farms, incentivized clicking, proxies or self-play farming.**
  RUN audits play counts and it voids **all** entries — including the rank already held.
- 🔒 **Only describe what is live on the PUBLIC build as done.** Public is **v1.7.0**
  while private is far ahead; Kitchen Mode is **not** publicly playable. A post about a
  belt nobody can reach is a false claim.
- 🔒 **Never write a `?k=` share URL, the RUN UserId, or either unlisted game id into
  any tracked file.** The repo is public. The live game id `PpB5gECS0AMU49mGYAKM` and the
  play link above are already public and safe.

## 4. Action log

```
### YYYY-MM-DD — <surface> — <what>
**Drafted:** <copy or a pointer to it>
**Posted by user:** ⬜ not yet | ✅ YYYY-MM-DD
**Outcome:** <daily uniques before/after, or "not measurable">
```

### 2026-09-08 — Agent initialised
**Drafted:** nothing yet.
**Posted by user:** —
**Outcome:** — baseline recorded in §2 above.

### 2026-09-08 — baseline refresh — no draft (per charter, first-run round)
**Drafted:** nothing — this round is read + baseline only, per charter.
**Posted by user:** —
**Outcome:** §2 refreshed from `rundot jam promo` + `rundot analytics export daily_activity_30d`.
Total plays 417→421, rank #2 unchanged. Sep 8 closed the partial 9 up to 21 so far
(day still open at pull time). Rank #1's figures could not be refreshed — the jam
board page renders client-side and isn't fetchable from here; still the Sep 8 morning
read, next manual check due per Plan §5.7 on Sep 10.

### 2026-09-09 — attribution correction — no draft
**Drafted:** nothing — correction only, per user reply logged in the companion record.
**Posted by user:** —
**Outcome:** Sep 4's 117-unique spike is attributable to the **Discord post inside the
RUNGAMESTUDIO Discord server**, not LinkedIn — LinkedIn's own post landed **Sep 5**.
Plan §5.7 labels the Sep 4 number "the LinkedIn spike"; that line is now known to be
inaccurate, but Plan.md is read-only to this agent, so it isn't corrected here — flagged
back verbally for whoever maintains Plan.md. Strategic read is unchanged either way:
Discord is still the repeatable engine, LinkedIn still gets saved for the Kitchen Mode
public launch. Private-version-number mismatch (v1.24.0 vs v1.26.0 across docs) noted
as expected churn during active build — not treated as a discrepancy to chase.

## 5. Build promotion log — Sep 9 2026

Scope expanded this round (user-confirmed) to include `rundot game list-tags` /
`update-tag` from `jam-entry/`, for one handover: promote `review` to the version the
user is about to hand-test. **Never `set-public`/`set-private` — visibility is untouched
throughout.**

**Tag state before:**

| Tag | Version |
|---|---|
| Private | 1.41.0 |
| Review | 1.7.0 (Approved) |
| Public | 1.7.0 |

**Action:** `rundot game update-tag review --version 1.41.0` (identity confirmed
`offroadinggamedev@gmail.com` first via `whoami`).

**Tag state after:**

| Tag | Version |
|---|---|
| Private | 1.41.0 |
| Review | 1.41.0 (approval cleared by the version change) |
| Public | 1.7.0 — unchanged |

**Outcome:** Review now serves v1.41.0 for the user's hand-test. The review share URL
(carries a `?k=` key) was reported in chat only, never written here. 🛑 **Full stop per
the handover** — task 3 (promote public) does **not** run this session. It waits for
the user to play the unbreakable-tutorial build and approve explicitly, in a fresh
round.

## 6. Credit position & campaign analysis — Sep 9 2026

**Balance check:** `rundot credits --period all_time` reports **154,347 credits**
(~$154.35), matching the figure given in the handover. ⚠️ **The itemized lot table
does not reconcile to that total** — no CLI command lists individual credit lots by
expiry, so this is checked by arithmetic only, not against the Finances page directly:

| Lot | Amount | Expires |
|---|---|---|
| FEEDBACK05 | 10,000 | Sep 13 |
| BACK-TO-WORK | 92,047 | Sep 15 |
| Starter | 25,000 | Aug 2029 |
| Quest rewards | 12,200 | Dec 3–6 |
| Grant | 15,000 | Dec 8 |
| **Sum of lots** | **154,247** | — |

Sum of lots (154,247) is **100 credits short** of the confirmed balance (154,347) —
and "Durable ≈ $52" (stated 52,300) is the same 100 short of Starter + Quest + Grant
(25,000 + 12,200 + 15,000 = 52,200). Both gaps are the identical 100 credits, which
points to one un-itemized lot rather than two unrelated rounding errors. Recommend
checking the Finances page directly for a missing small lot before treating the
expiring-vs-durable split as final — it doesn't change which lot is most urgent
(BACK-TO-WORK, 92,047, Sep 15), but a missing lot could carry its own expiry.

**The three questions:**

1. **RUN's review-to-flight lead time — unknown, not documented.** `rundot marketing
   prepare/submit/status/stats --help` (full text, including the embedded creative
   guide) contains no mention of an approval SLA, review turnaround, or time from
   `submit` to a leg actually flighting. This can't be resolved from local tooling —
   it needs either a direct question to RUN Operators or an empirical test (submitting
   a minimal campaign and timing it), and this handover authorizes neither. **Treat it
   as the binding risk on the Sep 13 lot**: if it's unknown, the safe assumption is that
   FEEDBACK05 (10,000, 4 days out) may not clear review in time regardless of what gets
   prepared today, and BACK-TO-WORK (92,047, 6 days out) carries the same risk on a
   shorter margin than it looks.
2. **Debit at submit vs. flight — not stated explicitly.** The only relevant line in
   the CLI docs: *"When spend reaches the total or the window ends, the campaign
   concludes itself — legs pause and the unspent remainder is refunded."* That describes
   end-of-campaign settlement, not what happens at `submit` — it's consistent with
   either the full budget being reserved at submit (with the unspent part refunded
   later) or credits being metered out only as real spend occurs during flight. Not
   resolvable from documentation; this handover forbids submitting a campaign, so it
   isn't resolved this round either. **The standing rule in the handover is the correct
   procedure for whoever does run it:** submit → immediately re-check `rundot credits`
   → confirm the balance actually dropped → only then pause. Never pause on an
   assumption that the debit already happened.
3. **`--network run` — the in-app house cross-promo network.** Confirmed directly from
   `rundot marketing prepare --help`: *"run is the in-app house cross-promo network
   (mobile-web)."* Unlike Meta/Google/Reddit (external paid ad buys), this promotes
   inside RUN's own house of games, and defaults to the web platform half when
   `--platforms` is omitted (mobile-web, matching its description). `docs/marketing-deep-links.md`,
   referenced in the CLI help for app deep-links, does not exist anywhere in this
   repository — likely a platform-side doc, not a project one.

**Proposal (analysis only — not submitted, not funded):** Given the jam is scored on
plays and ends Sep 19, and BACK-TO-WORK (92,047 ≈ $92, expiring Sep 15) is the credit
lot actually worth rescuing, the shape worth considering once Q1 is answered is a
**minimal-budget `--network run` (mobile-web) campaign, $50–90, over the shortest
flight window the review lead time allows** — spending directly toward the scored
metric rather than a generic install campaign. FEEDBACK05 (10,000 ≈ $10, Sep 13) is
likely already lost to review-lead-time risk regardless of what's prepared now; don't
spend effort chasing it before confirming Q1. The durable pool (52,200–52,300,
non-expiring until Dec 2029 at the earliest) has no urgency and is deliberately left
untouched. **This proposal requires a second approval before `prepare`/`generate` even
begins spending image-generation credits, per the handover's standing rule.**
