# Marketing Strategy

**Last updated:** Sep 9 2026, 01:45 IST
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
