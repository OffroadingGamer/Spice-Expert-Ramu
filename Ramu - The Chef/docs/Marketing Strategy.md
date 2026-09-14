# Marketing Strategy

**Last updated:** Sep 15 2026
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

### 2026-09-10 — RUN.creators Discord `#showcase` — Tier 1, channel 2 fired
**Drafted:** §8.1 block 2 (short, standings-free copy).
**Posted by user:** ✅ 2026-09-10
**Outcome:** User posted in their own voice rather than the drafted block —
substantially longer, first-person post covering today's community-lounge
playtest, feature-creep self-correction, onboarding/FTUE work, the BGM/SFX
slider miss, and an open ask for playtests/suggestions. Only the play link
was included (no vote link) — consistent with §8's policy that RUN-native
surfaces don't need the play-vs-vote distinction enforced, since votes are as
frictionless as plays there. First post/application on RUN.creators for this
account. Not measurable against DUP yet — too soon after posting; check next
board pull for movement attributable to this channel specifically.

### 2026-09-12 (approx.) — RUN Discord `#showcasing` + personal WhatsApp/Snapchat + gamedev WhatsApp group — Tier 1, channel 1 fired
**Drafted:** nothing specific — user posted in their own words around the
1.69.0 launch.
**Posted by user:** ✅ reported 2026-09-13 in answer to a batched question;
exact date not given, user's answer ties it to the Sep 12 spike.
**Outcome:** Sep 12 unique players **47** (96 sessions, median 119 s) against
a ~20/day run-rate on Sep 10–11 — same shape as the Sep 4 RUN-Discord spike
(117). Friends re-shared on WhatsApp/Snapchat to their own circles. Sep 13
partial at 17 by evening IST, so the lift decays inside ~1 day, as Sep 4's
did. This is the repeatable engine; it is not a daily one.

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

## 7. Channel intelligence & ranked distribution plan — Sep 9 2026

**Context this round:** we dropped 2nd → 3rd (~$600 → ~$300). SHIFT is two days old,
running 151 DUP/day — faster than the leader — and sits 57 DUP behind us. Our
plays/user (1.37) beats every entry ahead of us; SHIFT's is 1.07. **This is a
distribution gap, not a retention or quality problem.** No product changes proposed
here — only where and how we reach people.

### 7.1 The answers, as given

**Per-platform account status:**

| Platform | State |
|---|---|
| X (Twitter) | Freshly made account (`@PuneetMakes`) — no existing audience |
| Reddit | Exists, thin: **15 karma, 17 days old** — real silent-removal risk on larger/gated subs |
| Discord (beyond RUN's own server) | Active member of ten servers/subs — see 7.1.1 below |
| LinkedIn | Already active — covered by §1, unchanged |
| WhatsApp/Telegram | Yes — dev/gamer group chats exist, not just personal |
| TikTok | Dormant, freshly made (`PuneetMakes`) — **and the app itself is inaccessible**: banned in India, no non-VPN access, web-only |
| YouTube (Shorts) | Dormant, freshly made (`@puneetmakes`) |
| Instagram | Dormant (`puneetmakes`) |

**Posting identity:** comfortable posting under personal accounts everywhere — no
brand-only constraint.

**Capacity:** **4+ hours/day** available through Sep 19, schedulable around whichever
hours suit the target audience best (explicitly including Indian-audience timing,
given the game's theme) — not boxed into a fixed IST window. Can record video: has
an OBS setup with a vertical-layout camera rig, edits in the Instagram Edits app.
Can actively reply to comments through the day, not post-and-leave.

**7.1.1 Communities (the highest-value answer):**

| Community | Type | Size | Note |
|---|---|---|---|
| RUN's own jam Discord | Already covered by §1 | — | Existing repeatable engine |
| RUN.creators Discord (`#showcase`) | RUN in-house, separate from the jam server | 1,650 members | Not previously in the posting cadence |
| r/GameDevelopersOfIndia | Dev-facing, India | 3.9k visitors / 479 contributions/wk | No external-link rule; must be a genuine post, not a bare link |
| SoloDevelopment Discord (`#promo`) | Dev-facing | 11,307 members | Must participate as a community member first, not drop-and-run |
| Backstage Pass Discord (`#Showcase-Your-Game`) | Dev-facing | 318 members | Small but zero-cost to include |
| Indie Game Academy Discord (`#help-each-other`) | Dev-facing | 6,894 members | Explicitly allows disclosing competition/ranking/voting |
| Funsmith Club Discord (`#share-cool-games`) | Dev-facing, playtest+critique | 10,842 members | Good fit for genuine feedback framing |
| GameDev India Discord (`#games-from-india`) | Dev-facing, India | 9,794 members | Has a posting-format template to follow |
| GameDev.tv Discord (`#project-showcase`) | Dev-facing | 65,700 members | Largest single community on the list; strict template (title, store page, release date, art style, genre, team info, description, trailer, screenshots) |
| r/SoloDevelopment | Dev-facing | 108k members / 6k contributions/wk | Rules require a max of 2 posts/week and genuine context — not pure promo |
| r/Indiangamers | **Gamer-facing**, India | 110k members / 3.8k online | Rule 8: promotional dev content needs **Modmail pre-clearance** before posting |

**Constraint flagged by the user:** TikTok is functionally out — banned in India,
no app access without a VPN, web-only upload path. Treated as a hard skip, not a
low-priority item.

### 7.2 Ranked plan — by DUP per hour of the user's time, not by credits

**Tier 1 — free, low-effort (≤15 min each), fire today/tomorrow, no gating risk:**

| # | Channel | Effort | Cost | Timing |
|---|---|---|---|---|
| 1 | WhatsApp/Telegram dev & gamer groups | ~10 min | Free | Immediately — warmest, lowest-friction reach available |
| 2 | RUN.creators Discord `#showcase` | ~10 min | Free | Immediately — in-network, primed audience, currently unused |
| 3 | Funsmith Club Discord `#share-cool-games` | ~10 min | Free | Today |
| 4 | Indie Game Academy Discord `#help-each-other` | ~10 min | Free | Today — explicitly welcomes the jam/ranking framing |
| 5 | GameDev India Discord `#games-from-india` | ~15–20 min | Free | Today/tomorrow — follow the posted template |
| 6 | Backstage Pass Discord `#Showcase-Your-Game` | ~5 min | Free | Whenever convenient — zero-cost add-on |

**Tier 2 — free but needs real prep, fire within 2–3 days:**

| # | Channel | Effort | Cost | Timing |
|---|---|---|---|---|
| 7 | One vertical gameplay video (OBS + Instagram Edits) cross-posted to **Instagram Reels + YouTube Shorts** (not TikTok) | ~60–90 min | Free | By Sep 11–12 — matches the user's actual stated capability, evergreen/discoverable unlike a static post |
| 8 | GameDev.tv Discord `#project-showcase` | ~30–40 min (reuses the video from #7 as the trailer asset) | Free | Sep 11–12, once the video exists |
| 9 | SoloDevelopment Discord `#promo` | ~20 min + a few genuine participation messages first | Free | Sep 10–12 |
| 10 | r/GameDevelopersOfIndia | ~20–30 min, thoughtful devlog-style post | Free | Sep 10 — treat as the test case for whether the thin (15 karma/17d) account survives without a silent removal, before risking bigger subs |
| 11 | r/SoloDevelopment | ~30 min, devlog-style, max 2×/week | Free | Sep 11–12, **only after** #10 confirms the account isn't being silently filtered |

**Tier 3 — start the clock now, execution depends on someone else's approval:**

| # | Channel | Effort | Cost | Timing |
|---|---|---|---|---|
| 12 | r/Indiangamers (110k members, gamer-facing — likely the single best-converting audience on this whole list, since it's players, not devs) | ~10 min to send the Modmail request | Free | **Send the Modmail request today** — approval turnaround is unknown and is the actual risk here, not the post itself. Don't wait on it before doing Tiers 1–2. |

**Tier 4 — skip:**

- **X (`@PuneetMakes`):** brand-new, zero-follower account. A cold post here moves
  nothing on its own; not worth the user's time this round. Revisit only as a
  free cross-post once other creative exists — not ranked as a real lever.
- **TikTok:** hard skip per the user's own constraint — banned in India, no app
  access, brand-new dormant account. Web/VPN friction isn't worth it in the time
  remaining.
- **Static Instagram post (no video):** a picture on a dormant, zero-follower
  account won't move numbers. The one Instagram lever worth using is the Tier 2
  video cross-post, not a standalone static post.

### 7.3 What the user's answers make impossible or risky (read this before assuming the full list executes)

- **Reddit's thin account (15 karma, 17 days) is a real ceiling, not a formality.**
  Large subreddits (r/SoloDevelopment 108k, r/Indiangamers 110k) commonly run
  Automod filters that silently remove posts from new/low-karma accounts —
  independent of the written sub rules, which don't mention a threshold. Don't
  fire all Reddit channels at once on the assumption they'll all land; test small
  (r/GameDevelopersOfIndia) before the two large subs.
- **TikTok is not merely deprioritized — it's excluded.** No VPN-based workaround
  is proposed here.
- **r/Indiangamers' reach is gated behind a human moderator's Modmail approval**
  of unknown turnaround. It cannot be counted on landing inside this window with
  certainty; it's included because starting the request costs nothing and the
  upside (110k gamer-facing members) is the largest on the list.
- **None of the answers ruled out video, a fixed low-hours constraint, or a dead
  Reddit account outright** — capacity turned out to be generous (4+ hrs/day) and
  video capability real (OBS + vertical rig + Edits app), which is why Tier 2 exists
  at all; this plan would look very different (thinner, static-image-only) if the
  answers had gone the other way.

### 7.4 Recommended campaign shape within the $70–80 envelope (analysis/proposal only — not submitted, not funded)

Given assets already exist (`rundot jam promo`'s share links; `rundot socials
status` shows an X/Reddit packet ready and untouched) and the organic plan above
covers eleven free channels, the paid leg is best used to **amplify traffic once
the organic wave has actually started** rather than to substitute for it:

- Hold the paid leg until Tier 1 has fired (~24–48h) so it boosts real referral
  traffic instead of starting cold.
- Shape: `--network run` (in-app house cross-promo, mobile-web — see §6, Q3),
  sized at the lower end of the envelope (~$50–60), leaving headroom in the
  $70–80 total for the `$25` asset-generation reserve. **That reserve may not be
  needed at all** — the Tier 2 video is being produced with the user's own OBS/Edits
  pipeline for free, so the $25 could either go unspent (refunded per the
  end-of-campaign settlement rule in §6, Q2) or extend the flight window instead.
- Fire within a day or two of the organic wave, leaving runway before the Sep 15
  BACK-TO-WORK lot expiry — consistent with §6's existing finding that FEEDBACK05
  (Sep 13) is already the higher-risk lot regardless of what's prepared now.
- **This is a proposal only.** It still requires a second, separate approval
  before `rundot marketing prepare`/`submit` is run — no change to that standing
  rule.

### 7.5 ⚠️ Two amendments from the planning side — Sep 9 2026

§7.1–7.4 stand as written and the channel research is adopted whole. Two changes:

**🔴 Amendment 1 — do NOT hold the paid leg 24–48h. Submit it alongside Tier 1.**

§7.4 argues the paid leg should wait so it amplifies real referral traffic instead of
starting cold. That is sound advertising practice and **it does not apply to this network.**
`--network run` is RUN's **in-app house cross-promo** (§6 Q3) — it surfaces the game to
people already browsing RUN. It has no retargeting pool to warm up, so there is nothing for
organic traffic to amplify.

Against that theoretical benefit sit three concrete costs: **FEEDBACK05's 10,000 credits
expire Sep 13**, campaign review turnaround is **unknown and unresolvable** (§6 Q1), and
**DUP is counted daily** — a play today compounds across more scoring days than the same
play on the 11th. Waiting 48 hours spends half the nearer lot's runway to buy an effect this
network cannot produce.

➕ **A budget note, not a reopening.** Credits not committed to a campaign simply expire;
credits committed and unspent are refunded. So under-committing is the only option that
*guarantees* waste. The approved envelope stands — but the gap between committing $80 and
the full expiring ~$102 is the difference between certain loss and possible refund.
✅ **The $25 generation reserve is almost entirely free to redeploy**: the Tier 2 video uses
the user's own OBS pipeline, and the only art needing generation is **3 customer sprites at
120 credits each — about $0.36 total.**

**⚠️ Amendment 2 — the Tier 2 video has a dependency §7 could not have known.**

Item #7 (vertical gameplay video → Reels/Shorts) is **evergreen** — it keeps being
discovered long after posting. 🔴 **Do not shoot it against the current build.** The enemies
are still drawn as **insects** while being named as dishes (Dal Tadka, Masala Chai,
Biryani …), and the dish-sprite round replaces them with the 30 tray sprites already baked
and deployed. Shooting now produces permanent content showing the weakest version of the art
we will ever ship.

✅ **The dates already line up** — the dish-sprite round lands Sep 10, §7 schedules the video
Sep 11–12. **Keep that order.** It also improves item #8 (GameDev.tv, 65,700 members), whose
template wants a trailer asset.

**Everything else fires today**: Tier 1's six channels, and — most urgently — the
**r/Indiangamers Modmail request**, whose 110k gamer-facing members are the best-converting
audience on the list and whose approval clock only starts when it is sent.

### 7.6 🔴 Board read, Sep 9 evening — we are 4th

| # | Entry | Days | DUP | Gain | DUP/day |
|---|---|---|---|---|---|
| 1 | 9 to Thrive | 6 | 752 | +9 | 125 |
| 2 | Back That Thing Up! | 5 | 445 | **+2** | 89 |
| 3 | SHIFT | 3 | **371** | **+69** | **124** |
| 4 | **Spice Expert: Ramu** | 6 | **368** | **+9** | 61 |
| 5 | The Good Life | 6 | 318 | +4 | 53 |

**SHIFT passed us by 3 DUP**, exactly as projected one window earlier. $600 → $200.

🔥 **But the two entries above SHIFT have stalled** — Back That Thing Up! gained **+2** and
9 to Thrive **+9**. Only SHIFT is still moving. **Third place is three plays away**, and
second is a real target if SHIFT's surge is a one-off push rather than a durable channel.

⚠️ **Nothing has been posted yet.** The socials packet has read `ready` on X and Reddit for
hours, eleven free channels are researched and unfired, and the user has 4+ hrs/day
available. **The plan is not the bottleneck; execution is.**

## 8. Tier 1 ready-to-paste copy + r/Indiangamers Modmail structure — Sep 9 2026

§7 stands and is not restated here. This round pulls the real links via `rundot jam
promo` and turns Tier 1 into copy the user can paste with no editing, plus a
guidance structure (not finished prose) for the r/Indiangamers Modmail request.

**Live links, pulled fresh this round (`rundot jam promo --game-id
PpB5gECS0AMU49mGYAKM`) — do not hand-write these:**

| Link | URL |
|---|---|
| Vote (points at the jam entry, one click short of a play) | `https://run.world/jams/september-2026-jam?game=PpB5gECS0AMU49mGYAKM` |
| **Play** (this is what DUP counts — DUP is Total Unique Daily *Plays*, not votes) | `https://w.run/puneetmakes/spice-expert-ramu` |

Board read at pull time: **rank #4, 507 plays** — consistent with §7.6's evening
read (368 DUP, +9 gain). No `?k=` key appeared in this output; nothing withheld.

### 8.1 Tier 1 copy blocks — six channels, six different angles

⚠️ Written deliberately different from each other. Several of these communities
overlap; the same paragraph landing in two of them reads as spam. 🔴 **Corrected
this round:** DUP is Total Unique Daily *Plays*, not votes — the vote link lands
on the jam page, one click short of the only action that scores. **§2's rule is
the correct one and §8 now agrees with it: the play link leads everywhere,
except RUN-native surfaces (RUN.creators Discord, RUN's own jam Discord), where
the audience votes as easily as it plays and either link works as the lead.**

---

**1. WhatsApp / Telegram — dev & gamer group chats**
**Copy:**
> Hey — entered a game jam this month and made a little arcade game, Spice Expert:
> Ramu (you play the chef defending the kitchen 🌶️). Would genuinely mean a lot if
> you gave it a quick play, that's the bit that actually counts for me: [play link]
> (and if you enjoy it, a vote here helps too: [vote link])

**Why this angle:** this is personal contacts, not an audience. It should read as
a favour asked of a friend, not copy — no hashtags, no "check out my game," just
the ask and the link that matters.

---

**2. RUN.creators Discord `#showcase` (1,650 members)**
**Copy:**
> Spice Expert: Ramu — my entry for the September Jam. Chef-vs-kitchen arcade
> action. Vote here (that's what counts toward the board): [vote link]
> Playable here too: [play link]

**Why this angle:** in-house RUN audience, already jam-literate — no need to
explain what a jam or a vote link is. Straight to the ask.

---

**3. Funsmith Club Discord `#share-cool-games` (10,842 members)**
**Copy:**
> Would love a couple of fresh eyes on this — Spice Expert: Ramu, my entry for
> RUN's September Jam. Genuinely after feedback on the first few minutes
> especially: [play link]
> (If you're up for voting too, that's here: [vote link])

**Why this angle:** this channel's own norm is playtest-and-critique, not
drop-a-link promo. Leading with a feedback ask fits how the community wants to
be approached — the vote link rides along as a secondary line, not the headline.

---

**4. Indie Game Academy Discord `#help-each-other` (6,894 members)**
**Copy:**
> Sitting in 4th place in RUN's September Jam right now, trying to climb before
> it ends — my entry is Spice Expert: Ramu. If a play sounds like something
> you're up for: [play link]
> (a vote helps too, same entry: [vote link])

**Why this angle:** this is the one channel that explicitly welcomes the
competition/ranking framing — lead with the standings instead of softening the
ask, since here that's the actual hook.

---

**5. GameDev India Discord `#games-from-india` (9,794 members)** — 🔒 posted
template, filled exactly rather than freestyled:
> **Game Title:** Spice Expert: Ramu
> **Play Link:** [play link]  (vote: [vote link])
> **Release Date:** In active development — this build is my entry for RUN's
> September Jam, submissions open through Sep 19
> **Art Style:** 2D, illustrated spice-market / kitchen art
> **Genre:** Arcade / action
> **Team Info:** Solo developer
> **Description:** You play the kitchen's chef, defending it in a spice-themed
> arcade run. Built for RUN's September Jam.
> **Media:** *(attach one gameplay screenshot or short clip — not supplied here.
> 🔴 The build now shows real dish sprites as of v1.43.0 — any screenshot taken
> before tonight still shows insects standing in for dishes and must not be
> used. Take a fresh one.)*

**Why this angle:** this channel gates on a fixed post format. Matching it
exactly is the whole point — a post that ignores the template reads as not
having read the room.

---

**6. Backstage Pass Discord `#Showcase-Your-Game` (318 members)**
**Copy:**
> Dropping my jam entry here — Spice Expert: Ramu, a chef-vs-kitchen arcade game
> for RUN's September Jam. Play here if you're up for it: [play link]
> (vote too, if you enjoy it: [vote link])

**Why this angle:** small, low-traffic channel — a short drop-in is
proportionate. No elaborate pitch needed or wanted here.

### 8.2 r/Indiangamers Modmail — structure only, not copy

⚠️ **The user rewrites this in their own words and sends it themselves.** A
moderator can smell a template; what follows is what each section needs to
*do*, not sentences to paste. Order matters — this is the order a mod reading
cold will want the information in.

1. **Who you are.** One or two sentences: Indian, solo/indie developer, this is
   a personal project. Establishes you're not an outside marketer cold-emailing
   subreddits.
2. **What the game is — one line.** Name plus a one-phrase hook. Resist
   over-selling here; that's not this message's job.
3. **Why this subreddit specifically.** Say plainly that it's an Indian-food
   restaurant game and this is an Indian gaming audience — that's the actual
   reason for asking this sub and not a generic dev-facing one, so name it
   directly rather than implying it.
4. **What it is and isn't.** Free, browser-playable, no monetisation, no ads,
   no signup wall. Pre-empts the mod's likely first question before they have
   to ask it.
5. **Honest jam context.** State plainly that it's a game jam entry, made under
   jam constraints, and that the ask is partly for genuine feedback from real
   Indian gamers — not only a numbers push.
6. **The exact ask.** Name precisely what permission is being requested: one
   promotional post, in one specific place (name the sub's flair/format if one
   exists), roughly when.
7. **Defer to their format.** Close by offering to follow whatever structure,
   flair, or timing the mods prefer, and mean it.

**⚠️ Flagged plainly, not softened:** the account sending this is **15 karma,
17 days old**. Some subreddits' Modmail filters gate on account age the same
way post-Automod does — there's a real chance this doesn't reach a human at
all. **If there's no reply within roughly 24 hours, treat that as a signal that
it was likely filtered, not as silence to keep waiting on.** Worth having a
fallback in mind (e.g. a little genuine participation in the sub first to build
tenure) rather than treating this as the only route to that audience.

## 9. Direct user update — Sep 10 2026

No new handover this round — the user replied directly to the agenda; logged
per the same pattern as the Sep 9 01:30 IST correction entry.

**Modmail already sent to r/Indiangamers.** Full text as sent (no `?k=` key,
no UserId — only the public play link):

> Hi mods!
> I'm a solo game dev from New Delhi India. I'm looking for gamers opinion on a
> tower defence game that I'm building in a gamejam. My Reddit account is new
> because I decided to have a new common identity for all social media
> platforms so that promoting my game becomes easier. I am willing to verify
> with a photo or something if required.
> I've learned that playtesting is where the game gets refined. I want this
> project to eventually outlive the gamejam so I was hoping to get it
> playtested and possibly reviewed. It's a culinary tower defence game where
> achievements are kitchen tools and unlocking actual recipes for various
> cuisines ranging from North Indian to north East Indian recipes.
> Here's my game's url : Spice Expert: Ramu
> https://w.run/puneetmakes/spice-expert-ramu
> I'm currently at graybox stage and wanted to run it by you guys before I
> plan on posting it as I'll be updating the core loop with first iteration on
> Polish soon. By then hopefully I'll be ready to get it playtested.

⚠️ **Worth flagging, not correcting (it's sent, not editable):** this asks for
playtest/feedback permission, not the explicit "may I post promotional content,
here, in this format" ask that §8.2's structure was built around. If a mod
replies favourably to *this* message, that may only clear the playtest ask —
a second, explicit ask for permission to post the jam-promo content itself
could still be needed before the user posts anything there. Noting this so
it isn't assumed cleared when the reply lands.

**Status:** awaiting reply. Per §8.2, no reply within ~24h from send time is a
signal (likely filtered on account age), not silence to keep waiting on.

**Board reread, Sep 10 2026 (user-supplied screenshot, `run.world/jams/september-2026-jam`):**

| Rank | Entry | Total plays | DUP | Prize |
|---|---|---|---|---|
| 1 | 9 to Thrive | 1,192 | 767 | $1,000 |
| 2 | Back That Thing Up! | 602 | 537 | $600 |
| 3 | SHIFT | 511 | 482 | $300 |
| 4 | **Spice Expert: Ramu** | **517** | **375** | $200 |
| 5 | The Good Life | 434 | 323 | $100 |

🔴 **The gap to 3rd has widened, not narrowed.** §7.6 (Sep 9 evening) had SHIFT
3 DUP ahead of us (371 vs 368); this pull has it **107 DUP ahead** (482 vs
375). SHIFT is still the entry moving fastest. Nothing in Tiers 1–3 has fired
publicly yet as of this pull.

**Two items gated on a central-agent handover, per the user — not actioned
here:**
- **The paid `--network run` campaign (§7.4/§7.5)** — user's direction: hold
  until Challenge Mode is "slightly more balanced and polished," and only on
  an explicit handover from the central agent. Not proposed as ready this
  round.
- **The Review/Public tag decision for v1.43.0 (agenda item 7)** — same:
  waits for a central-agent handover before any tag action is even discussed.

**Reddit karma target (user asked for a safe number before re-attempting
r/GameDevelopersOfIndia):** there's no documented Automod threshold for these
specific subs — this is a heuristic, not a confirmed rule. A commonly-cited
safe buffer on gaming/dev subreddits is roughly **100+ combined karma and
30+ days account age**; current state is 15 karma / 17 days (now 18). Better
spent as **genuine participation** — real comments on other threads — than
karma farming, since r/SoloDevelopment and r/GameDevelopersOfIndia both
explicitly want genuine context over promo-only accounts, and a visibly
farmed karma history is its own red flag to a moderator reviewing a Modmail.

## 10. Finance re-check — Sep 11 2026, credit expiry vs. spend pace

**New standing rule this round (direct user instruction):** the paid ad plan
only executes on a handover *from* the central agent, and this agent asks
permission *before* drafting any handover — including the one that would ask
the central agent for its requirements. Not drafted yet; permission asked in
chat, not assumed.

**Fresh Finances screenshot (user-supplied).** Balance reconciles cleanly this
time — no repeat of §6's Sep 9 "100 credits short" gap:

| Lot | Amount | Expires | Days left (from Sep 11) |
|---|---|---|---|
| FEEDBACK05 (event) | 7,820 | Sep 13, 2026 | **2** |
| BACK-TO-WORK (event) | 92,047 | Sep 15, 2026 | **4** |
| Starter | 25,000 | Aug 2029 | ~3 yrs |
| Quest rewards (6 items) | 12,200 | Dec 3–6, 2026 | ~3 months |
| Grant | 15,000 | Dec 8, 2026 | ~3 months |
| **Sum of dated lots** | **152,067** | — | matches the Finances page's "152,067 converted & granted" exactly |
| Daily free credits | +100/day | resets daily | not a pool |

**152,167 available now = 152,067 in lots + today's 100 daily.** Durable pool
(Starter + Quest + Grant) is still **52,200**, unchanged from §6.

🔴 **99,867 credits — 65.6% of the current balance — expire inside the next 4
days.** FEEDBACK05 has dropped 10,000→7,820 since the Sep 9 check (2,180 drawn
down since then); BACK-TO-WORK is untouched at 92,047.

**This month's usage pace, for scale:** studio-side (dev tooling) 10,633
credits / 89 calls + runtime AI (in-game features, players) 7,498 credits /
70 calls = **18,131 credits total this period.** Burning the remaining 99,867
organically in 2–4 days would need roughly **5.5× this month's entire usage
rate, in a quarter of the time** — not realistic without a deliberate spend
decision.

**Three ways this plays out — not this agent's call which:**

1. The `--network run` campaign already proposed in §6/§7.4/§7.5 ($70–90,
   sized specifically to land inside the BACK-TO-WORK window) — this is the
   marketing ad plan now gated behind a central-agent handover per this
   round's new rule. If it's going to run, the approval-and-flight window
   before Sep 13/15 is closing.
2. Central/implementation-side deliberate spend on `rundot generate
   image/music/sfx` for remaining asset needs — outside this agent's remit,
   their call to make.
3. Let it lapse — keep the durable $52,200 for later, accept ~$92–100
   (FEEDBACK05 + most of BACK-TO-WORK) going unused.

**Board note (same user-supplied screenshot, `run.world/jams/september-2026-jam`,
top of list this time):** Spice Expert: Ramu is now **3rd place, $300 tier**
— 577 total plays / 410 DUP, up from 4th (375 DUP) at the §9 pull. SHIFT, the
entry that was closing fast in §9, no longer appears in the top 12. Cushion to
4th widened, see §11 for the next-day reading.

## 11. Handover drafted for Central Agent — Sep 12 2026, 10:30 IST

**Trigger:** direct user instruction — analyse fresh board/finance screenshots,
ask clarifying MCQs, then draft the ask for Central Agent. Permission to draft
was requested last round (§10) and this round's instruction is the explicit
go-ahead for this specific handover, not a standing reversal of "ask before
drafting."

**Board re-pull (84 games, DUP-sorted):** Spice Expert: Ramu holds **3rd,
$300 tier** — 615 total plays, **422 DUP** (up from 410). 4th place (The Good
Life) grew to 372 DUP. Cushion is **+50**, essentially flat day-over-day (+12
us vs +14 them) — not eroding, not widening much either.

**Finance re-pull — FEEDBACK05's runway is now critical:**

| Lot | Amount | Expires | Days left |
|---|---|---|---|
| FEEDBACK05 | 6,372 (was 7,820) | Sep 13, 2026 | **1** |
| BACK-TO-WORK | 92,047 (untouched) | Sep 15, 2026 | **3** |

Combined studio+runtime usage this month is now 12,181 + 9,046 = 21,227
credits — still far below the ~98,419 at risk.

**New input this round: the build is in Review now, and RUNStudio is pushing
Review→Public on its own schedule** — user's estimate, ~2–3 hours from this
entry. That's a materially different situation from §10's "wait for a handover"
holding pattern: the polish gate and the tag-promotion gate (§9) are both
being resolved by forces outside this agent's or even the user's direct
control, on a clock shorter than BACK-TO-WORK's.

**Three MCQ answers, direct from the user (not this agent's judgment):**

1. **Polish gate:** *"It's balanced and polished enough now, further
   polishing will be additive, crucial stage has been passed."* Treating the
   Challenge Mode polish hold from §9 as cleared, per the user — the handover
   asks Central Agent to confirm against its own tracking rather than
   asserting this as settled fact on this agent's authority.
2. **FEEDBACK05:** user's read is *"run ads with the bigger picture in
   mind... game is ready, in review and within 2-3 hours public. We can just
   start running ads now!"* — reads as: don't spend effort chasing the
   1-day lot, keep focus on BACK-TO-WORK, and lean toward firing soon. This
   agent is not treating "start running ads now" as authorization to execute
   directly — the standing rule (only run the campaign on a returned
   handover from Central Agent) stands unless the user says otherwise. The
   urgency is carried into the handover as a timing recommendation, not
   acted on.
3. **Budget:** confirmed **$70–90**, the figure already sized in §6/§7.

⚠️ **Correction carried into the handover, not left standing uncorrected:**
the user's framing assumed ad-spend debits are "direct and refund-based."
Checked against §6 Q2 — only the **end-of-campaign unspent-remainder refund**
is confirmed by RUN's CLI docs. Whether the debit at `submit` reserves the
full budget upfront or meters it during flight is **still unresolved**, exactly
as it was Sep 9. Not blocking on this — the standing safety procedure
(submit → recheck `rundot credits` → confirm the drop → only then pause)
covers both possibilities — but the belief itself needed correcting before it
propagated into Central Agent's own log.

**Handover text (verbatim, as given to the user in chat and logged in full in
[Social Media Handover Record.md](Social%20Media%20Handover%20Record.md)):**
see that file's 2026-09-12 10:30 IST entry for the complete text delivered to
the user for hand-off to Central Agent.

**Status:** drafted only. Not delivered, not executed. No `prepare`/`submit`/
`generate` run, no tag touched, no campaign funded — this agent will not act
on the campaign until a handover comes back from Central Agent saying so, per
the standing rule reaffirmed this round.

## 12. Central Agent's return, and this agent's read — Sep 12 2026, 11:30 IST

**What came back (full text in [Social Media Handover
Record.md](Social%20Media%20Handover%20Record.md)):** $90 approved, but
`--network run` doesn't exist in production for anyone — it's backend-only,
never enabled, not a tier/config gap. That kills §11's entire thesis: the
budget was sized against an in-app one-tap surface that never existed as an
option. The four live networks (meta, google, reddit, unity) are all
external, multi-step deeplink funnels with a **zero-row conversion baseline**
— no campaign has ever run for this game on any of them.

Two of this agent's own numbers were corrected:
- **Budget sizing was 8% over.** $90 costs 99,500 credits after the 1.05×
  markup and the flat 5,000-credit flight fee — 7,450 over BACK-TO-WORK's
  92,047. $82 is the actual ceiling ((92,047−5,000)/1,050 ≈ $82.9).
- **"+50 cushion, flat" understated a real collapse.** Central Agent's
  daily DUP series (Sep 4→12: 117·54·59·60·38·41·19·20·4) shows acquisition
  cratering, not holding steady — this agent's framing compared snapshot
  totals day-over-day rather than true daily inflow, and missed it.

**Root cause, checked against this file's own §4 action log rather than
guessed:** of the six Tier-1 "free, ≤15 min, fire today/tomorrow" channels
planned Sep 9 (§7.2), **only one — RUN.creators Discord — has actually
fired**, and that was two days ago in the user's own voice, not the drafted
copy. WhatsApp/Telegram, Funsmith Club, Indie Game Academy, GameDev India,
and Backstage Pass are all still unfired. That gap lines up with the DUP
crater far better than any "organic just dies" explanation — it's an
execution gap, not a demand-side collapse, and it's fixable in hours.

**Also material:** the build is now on v1.69.0 across all three tags
(Private/Review/Public) — v1.68.0 fixed an iOS boot-race black-screen and
v1.69.0 fixed the tutorial, which had been opening on an unbonused pad and
teaching a strategy that dies at wave 4. `version_mix_30d` shows almost all
historical play sat on the old, broken versions (1.7.0, 1.42.0) — meaning
every DUP number logged in this file to date reflects a worse game than the
one live right now. This is genuine, honest news content, not recycled
promo — a real hook the Tier-1 re-fire should use.

**Licensing narrowed:** only Kitchen Essentials (toxiccolors) is cleared as
generator *input* (written seller consent); Kitchen Props (hoshiixs) and
dobo_ui may ship in the build but may not be fed to `rundot generate` as
reference material. Noted for any future creative ask — none planned by
this agent right now.

**This agent's read, given directly since Central Agent asked for it rather
than instructing it:**

1. **Paid — worth a cheap, expectation-free attempt, not a plan to lean on.**
   The credits expire worthless either way and nothing is charged until
   flighting, so there's no downside to trying beyond the sunk 843-credit
   creative spend that already happened. But the upside case is weak: zero
   conversion baseline on every live network, a collapsing organic backdrop
   to compare against, and no audience-targeting exposed by the CLI (can't
   point it at Indian or gaming-interest audiences specifically).
   **Recommended shape: Reddit, $82, submitted today** rather than waiting —
   Reddit is the only enabled network the existing 3-square creative set
   fits natively with zero rework; $82 respects the BACK-TO-WORK ringfence
   exactly where $90 didn't; submitting today maximises runway against both
   Sep 15 and the open submit→flighting SLA ticket. Flagged the $41/day
   pacing sits under the ~$50/day warning threshold — expected to warn, not
   block.
2. **Free channels are the real lever for the remaining 6 days**, precisely
   because the gap there is execution, not time or demand. Plan: fire the
   five unfired Tier-1 channels today with the tutorial/iOS-fix hook folded
   into the existing §8.1 copy; treat r/Indiangamers as stalled (48h+ past
   the 24h signal threshold, no reply); shoot the still-outstanding vertical
   video now, built around the tutorial fix specifically since it's the most
   concrete proof the game changed; and unblock r/GameDevelopersOfIndia
   immediately rather than waiting on r/Indiangamers's unrelated Modmail.

Full reply text delivered to the user for hand-off to Central Agent is
logged verbatim in [Social Media Handover
Record.md](Social%20Media%20Handover%20Record.md)'s 2026-09-12 11:30 IST
entry.

**Status:** analysis and reply only. No `prepare`/`submit`/`generate` run,
no post made, no tag touched by this agent this round.

## 13. Final-five-days proposal — Sep 13 2026, 20:30 IST

**Trigger:** formal handover from Central Agent (full text in [Social Media
Handover Record.md](Social%20Media%20Handover%20Record.md)). Analysis only;
nothing executes until the user approves. `whoami` confirmed
`offroadinggamedev@gmail.com` before any CLI read.

### 13.1 Data pulled (read-only, exported to the session scratch folder, not `jam-entry/`)

`daily_activity_30d`, `platform_mix_30d`, `version_mix_30d`,
`retention_by_platform_30d`, `funnel_steps_30d`, `session_end_summary_30d`,
`share_channels_30d`, `core_loop_events_30d`, `crash_free_summary_30d`,
`rundot credits`, `rundot marketing list`. `share_funnel_30d` returned
"Analytics backend unavailable" twice — not retried further.

| Day | Unique players | Sessions | Median s |
|---|---|---|---|
| Sep 3 | 9 | 17 | 301 |
| Sep 4 | 117 | 148 | 116 |
| Sep 5 | 54 | 69 | 80 |
| Sep 6 | 59 | 72 | 0 |
| Sep 7 | 60 | 87 | 96 |
| Sep 8 | 38 | 54 | 117 |
| Sep 9 | 41 | 76 | 116 |
| Sep 10 | 19 | 34 | 6 |
| Sep 11 | 20 | 35 | 242 |
| Sep 12 | **47** | 96 | 119 |
| Sep 13 (partial, evening IST) | 17 | 23 | 25 |

Sum = 481, which reconciles to the board's 489 DUP within the partial day —
**so DUP is the sum of daily unique players.** Every day is scored fresh.

### 13.2 What the data says

- **The prize tier is not movable by anything in this proposal.** 2nd (9 to
  Thrive) is 1,008 and grew ~80 yesterday — 519 ahead, out of reach. 4th
  (The Good Life) is 394 at ~+22/day → ~495 by close. The live threat is
  **Employment Crisis: 211 in 3 days (~70/day)** → ~526 by close if it holds
  (new entries usually decelerate). Ramu at even 17/day finishes ~565; at
  30/day ~625. **3rd is defendable at organic pace and unreachable-upward.**
  Paid is therefore judged as a baseline purchase and credit salvage, not a
  rank play.
- **Retention is ~zero, so DUP ≈ fresh arrivals.** D1 mobile-web 1.4% (5 of
  357), web 3.0%. No compounding base exists; the score is bought daily.
- **Mobile-web is 73%** (360 of 495 players). Every link should say "plays in
  your phone browser, no install."
- **~24% of loaded sessions never reach the menu** (`game_loaded` 619 →
  `menu_shown` 487 sessions; 433 → 343 players) on top of the 4% load
  timeout Central Agent reported. Mostly old-build data (1.7.0 dominates the
  30-day mix), but it is the number to price into any CPI: roughly **3 in 4
  arrivals see the menu.** Flagged for Central, not this agent's to fix.
- Once at the menu the loop holds: 95.7% start a run, 87% place a tower,
  74% clear wave 1, 55% of those reach `run_end`.
- **1.69.0 players replay more**: 2.04 sessions/player on Sep 12 vs 1.26 on
  Sep 4. n = 37 players — a direction, not a result.
- **The Sep 12 spike is attributed.** User posted in RUN Discord
  `#showcasing`, to personal WhatsApp/Snapchat (friends re-shared), and to a
  gamedev WhatsApp group. Same engine as Sep 4 (RUN Discord → 117). It decays
  inside a day both times. Repeatable per *real update*, not per day.
- **Zero in-game shares in 30 days** (`share_channels_30d` empty). Flag only.
- Crash-free on 1.69.0: 100% mobile-web/web/ios; one Android crash Sep 13
  (1 of 1 sessions). Flag only.

### 13.3 ⚠️ Discrepancy that gates the paid option

`rundot marketing --help` (with `RUNDOT_BETA_FEATURES=1`) embeds the creative
guide, which states: *"Meta and Google are live; Reddit is wired and remains
flight-gated."* Central Agent's Sep 12 return says enabled networks are
meta, google, reddit, unity. One of these is stale. **This is the exact
failure mode that consumed the first plan** — the CLI accepted a network the
server could never flight. Reddit must be confirmed flightable for this
account, from the server side, before anything is submitted. If it is gated,
paid is a no-go: Meta/Google at $82 fund one creative family by the tool's
own heuristic and won't clear Meta's learning phase; Unity needs a portrait
video and a native mobile platform.

Also confirmed from the same help text: `rundot marketing cancel --name`
exists, is **owner-only**, and works on a submitted campaign; campaign names
are single-use; Reddit's floor is **$65/leg**, so $82 supports exactly one
leg; budget range $50–$25,000; `prepare` warns at ≤ ~$50/day pacing.

### 13.4 Paid — conditional go: Reddit or nothing, $82, one leg, 2 days

**Go only if all four hold at submit time; otherwise no-go:**

1. Reddit confirmed flightable for this account (13.3).
2. The cancel deadline is staffed. User's answer: **Implementation/Central
   Agent owns it.** Proposed hard cutoff: **Sep 14, 23:00 IST** — if
   `rundot marketing status` does not show the campaign flighted, run
   `rundot marketing cancel --name <name>`. Rationale: the lot "expires Sep
   15" with no hour or timezone shown; worst case is 00:00 UTC Sep 15 =
   05:30 IST, leaving 6.5 h margin. Nothing is charged pre-flight, so a
   cancel costs nothing.
3. `rundot credits` shows BACK-TO-WORK intact (balance ≥ 91,100 with the lot
   still listed) immediately before submit, and is re-checked immediately
   after flighting to confirm the debit came from that lot — the standing
   procedure from §6.
4. Platform leg = `web` only (mobile-web is where 73% of players are; Reddit
   ad → phone browser → play link, no install step).

**Submit before RUN answers the ticket?** Yes — *because* condition 2 is
staffed. Waiting for a weekend ticket burns the only runway the lot has; the
cancel deadline converts "unknown flighting latency" from a durable-pool risk
into a bounded one. If condition 2 can't be met, don't submit.

**Sizing:** $82 × 1.05 × 1,000 + 5,000 = 91,100 credits; 947 spare in the
lot. `--days 2`. $41/day will trigger the ≤$50/day warning — advisory.

**Expected yield — an estimate, not data:** $82 on Reddit at $0.40–0.80 per
click → ~100–200 clicks; deeplink + load-timeout + load→menu losses ≈ 50% →
50–100 sessions → ~40–80 unique players across two days = **+20–40 DUP/day**,
roughly doubling organic for the flight. It does not change rank. It buys the
first conversion baseline this game has ever had on a paid network, which
matters for its life after the jam (the user's stated goal in the Modmail).

**Judge by:** `campaign_attribution_funnel_30d` game session starts. **≥ 55
attributed starts (≤ $1.50/start) = worth it.** < 20 = the channel is dead for
this game; never route durable credits to paid afterward.

### 13.5 Organic — the plan for Sep 13 evening → Sep 18 12:00 PT (4+ h/day confirmed)

**Engine, named:** RUN Discord + the user's personal network. Fires once per
real update, lifts for a day. Repeats without news get tuned out — so the
cadence below spreads *different* audiences across the days rather than
hammering one.

| Day (IST) | Fire | Why this day |
|---|---|---|
| Sep 13 (tonight) | Funsmith Club `#share-cool-games` — playtest framing: "new tutorial, tell me if wave 4 still kills you" | Genuine-feedback community; zero prep; tonight's post lifts Sep 14's number |
| Sep 14 | Indie Game Academy `#help-each-other` (ranking framing allowed) · **shoot the vertical video**: tutorial → wave-1 clear, 20–30 s portrait, OBS + Edits | IGA is the second zero-prep Discord; the video is the asset three later channels reuse |
| Sep 15 | GameDev India `#games-from-india` (their template) · Reels + Shorts post of the video · r/GameDevelopersOfIndia devlog: the tutorial-fix story | Paid flight (if go) also lands Sep 15–16 — stacking organic on the same days makes the judge number harder to read, but the calendar doesn't allow otherwise; attribute paid via the funnel query, not DUP |
| Sep 16 | GameDev.tv `#project-showcase` (strict template, uses the video) · Backstage Pass `#Showcase-Your-Game` | Largest single community on the list; video makes the template fillable |
| Sep 17 | r/SoloDevelopment (only if r/GDoI survived without silent removal) · **second RUN Discord post only if Central ships something announceable** | Don't repost RUN Discord without news |
| Sep 18 morning IST | Final personal-network push: "judging closes tonight, last chance to play" | The one day a "last day" ask is honest |

**Copy rules for all of it:** play link leads (§8 policy); add "plays in your
phone browser, no install"; say the tutorial and iOS fixes plainly; no
standings claims outside communities that permit them. **Dropped:**
r/Indiangamers (Modmail silent 72 h+); TikTok (hard skip). **Never:** bots,
incentivized clicks, self-play, asking friends to replay for numbers — RUN
audits and voids. Friends re-sharing to their own circles, as happened Sep
12, is exactly the right kind of spread.

### 13.6 The numbers to judge by

- **Organic:** **≥ 30 unique players/day on at least 3 of the 5 remaining
  days** — holding the 1.69.0 launch-day level, not the pre-launch 20. That
  finishes Ramu ≥ ~620, above any plausible Employment Crisis line. Fail
  state: < 20/day on 3+ days.
- **Paid:** ≥ 55 attributed session starts (13.4). Secondary: Sep 15–16
  daily uniques ≥ +20 over the surrounding organic-only days.
- **Rank:** hold 3rd. Escalation trigger: Employment Crisis > 60/day for two
  consecutive days → add a RUN Discord post with whatever real update exists,
  not more paid.

### 13.7 Flags for Central Agent (not this agent's to act on)

24% load→menu loss (13.2); zero in-game shares; one Android crash on 1.69.0
Sep 13; `share_funnel_30d` backend unavailable; Reddit flight-gate
discrepancy (13.3) is blocking.

**Status:** proposal only. Nothing submitted, generated, posted, tagged, or
funded. Analytics CSVs live in the session scratch folder, outside the repo.
4th (The Good Life, 358 DUP) is now +52, not a deficit.

## 14. Reddit campaign — status correction, Sep 14 2026, 09:00 IST

The proposal in §13 was adopted and submitted (by Implementation Agent, per
Central's handover to it — not by this agent). The user relayed a correction
to what its state actually is; verified live before writing it down here:

```
rundot marketing status --name kitchen-rush-reddit
  Status               pending-review
  Submitted            2026-09-13T15:40:22.423Z
  Budget               $82.00 total · spent $0.00
  reddit/web leg       pending-network-approval (blocked)
```

**Not flighting, not approved, not spending.** This is the flight-gate risk
flagged in §13.3 playing out as a pending approval rather than an outright
rejection — the CLI creative guide's "Reddit remains flight-gated" line was
closer to true than Central's "enabled: meta, google, reddit, unity" table.

**Amendment — Sep 14 2026, 22:30 IST, per Central Agent's correction:** the
"table was wrong" framing above overstates it. `submit` was accepted
server-side and created a real Reddit provider leg — a genuinely disabled
network can't do that, so the enablement table wasn't false. There are
three independent gates: the CLI's own hardcoded allowlist (what `prepare`
checks), server-side enablement (what let `submit` through), and whether
the provider actually works (what only a flight attempt proves). Reddit
cleared the first two and failed the third. Central logged this as Retro
109. The practical takeaway stands unchanged: ask RUN "which paths are
working today," in those words, before sizing a campaign around any one
network's stated status.

**Cancel-check deadline moved:** Sep 14 23:00 IST → **Sep 16 morning**
(owner unchanged — Implementation/Central). A cron job (`0077a76a`) tied to
the old deadline was to be deleted; it is not in this agent's session cron
list (`CronList` → none), so it was scheduled from Central's or
Implementation's own thread and can only be removed there. Flagged back,
not actioned here.

**Standing task:** continue pulling `rundot marketing status`; report the
first day spend goes non-zero (currently $0.00, Sep 14). No action taken
beyond verification — nothing to submit, cancel, or fund from this side.

**Superseded same day — see §15.** The pending state above resolved to an
outright rejection a few hours later; the standing "watch for non-zero
spend" task is moot for this campaign.

## 15. RUN support ticket response — Sep 14 2026, 12:00 IST

The user raised a ticket earlier (unclear exact date; answered today).
RUN's reply, relayed verbatim by the user:

> the RUN network ads are not yet available. This functionality isnt live yet.
> this is a side effect of some networks being still in beta/not working
> ad budget does use credits!
> reddit ads are not currently working
> there is currently not audience targeting other than geo.
> we appreciate the detailed feedback on trying this out — im going to send
> you some credits for what you might have lost trying to prepare creatives
> for networks that dont yet work
> if you are trying to get a campaign up today i recommend doing meta / android

**Verified against the campaign, live:**

```
rundot marketing status --name kitchen-rush-reddit
  Status               rejected
  Rejected reason       reddit not yet working
  Budget                $82.00 total · spent $0.00
```

Matches exactly. `run` was already known dead (§12); this closes Reddit the
same way. **Correction, Sep 14 22:30 IST — see §14's amendment:** the
"table was stale" framing below was itself an overstatement; Central
clarified it's a three-gate problem (allowlist → server enablement →
provider actually working), not a wrong table. **Zero credits lost to ad
spend** either way — the campaign never left "pending." Whatever RUN is
crediting back is for the imagegen/audiogen spend on creative prep, not ad
budget.

**What this changes about the paid read, and what it doesn't:**

- **Confirms:** paid was never going to move the prize tier (§13.1/13.2 —
  DUP is daily-fresh, no compounding; the tier gap is a rate problem, not a
  reach problem). That doesn't change with the network.
- **New, and worth weighing:** the existing creatives (3 squares + 3 logos
  in `kitchen-rush-crosspromo/`) are very likely reusable as-is for Meta —
  Meta takes a flat asset pool of the same image kinds the Reddit prep used
  (creative guide: "Meta ships the selected image kinds through the
  campaign's delivery mode"). The creative-prep spend may not be wasted.
- **New, and a real mismatch to flag:** RUN's recommendation is `--network
  meta --platforms android` — an **app-install leg** (deep-links into the
  RUN app), not the web-traffic objective the original plan assumed. 73%
  of players are mobile-**web** (§13.2). An Android app-install campaign
  is optimizing for a different funnel than the one the DUP data describes;
  it may reach a narrower or different slice of "Android users with the RUN
  app" rather than "anyone who taps a link."
- **Timing is tight either way.** BACK-TO-WORK (the lot that funds this)
  expires ~Sep 15, exact hour unknown. RUN's own phrasing — "if you are
  trying to get a campaign up **today**" — reads as a same-day-or-not
  window, not one this agent can extend by analysing longer.

**This agent's read:** worth a same-day attempt only if Central/the user
can get a fresh `prepare` → `generate` (or reuse) → `preview` → `submit`
through **today**, sized the same way as §13.4 ($82, `--days 2`, floor
trivially clears at $5/leg for one `android` leg), with the same cancel
discipline if it doesn't clear review before the lot expires. Sitting on
it another day to "think it over" most likely means the lot expires unused
— at which point the right call is to let it go and not chase a second
scramble; organic (§13.5) was always the real lever and is unaffected by
any of this.

**Status: analysis only.** Nothing prepared, generated, or submitted. User
gave permission to draft a return handover; drafted 12:15 IST, logged in
the companion Record, delivered to the user for their Central Agent thread.
Holding for Central's return.

## 16. Central's return — campaign submitted, credits refreshed, two new tracks — Sep 14 2026, late evening IST

The recommendation in §15 was taken: user gave the second funding approval,
Implementation submitted on RUN's exact recommended path. Verified live,
not taken from the return:

```
rundot marketing status --name kitchen-rush-meta
  Status               pending-review
  Setup                traffic-install · default geo · asset-pool
  Submitted            2026-09-14T15:58:12.904Z
  Budget               $82.00 total · spent $0.00
  Android (Meta) leg   $82.00 total (spent: $0.00)
  Meta Campaign ID     120254295998880523
```

Matches Central's numbers exactly. Creatives: the 3 squares + 3 logos from
`kitchen-rush-reddit` reused via `--reuse-from` (free, no regeneration) as
§15 flagged might be possible, plus 2 vertical + 2 landscape generated for
1,962 credits. Cutoff unchanged in substance, restated by Central: cancel
if not flighted by **23:00 IST Sep 15**, owner Implementation, user
triggers the check.

**Credits:** live balance now **188,804** (checked 2026-09-14T16:20 UTC),
consistent with Central's "193,756 before today's spend" once the video
track's and art track's own generation (§4 of the return) are accounted
for — those draw the same shared balance, not something to reconcile
line-by-line here. The material change: RUN sent **50,000 credits**
(landed Sep 14) as compensation for creative-prep spend on dead networks.
This retires the scarcity framing this whole analysis was built on — a
late flight is no longer refused by the billing rule, it would simply debit
durable credits instead. **That is why the Sep 15 23:00 IST cutoff is real
money protection now, not hygiene**, and why it stays firm regardless of
the new balance. The new lot's own expiry is unverified — treat as unknown
until the user reads the studio page directly.

**Two tracks opened today, noted for awareness, not this agent's to act
on:**
- **Story & Video track** — a separate judged award, a dedicated video
  agent producing a piece in `VideoGen Leg\`, submissions close 00:30 IST
  Sep 15 (tonight). If it publishes, its URL becomes a legitimate organic
  post for Sep 15+ — not planning around it until it exists.
- **Chef Ramu art** — a layered sprite set + wave-intro scroll for
  post-jam, canonical in `Art_gen\chef-final\`. Not a marketing asset and
  nothing ships before judging; if a consistent Ramu portrait is wanted for
  future socials, that folder is where one will exist — ask before taking.

**What's this agent's going forward, unchanged from §13.5/13.6:** the
organic calendar continues as approved (Sep 15 GameDev India / Reels /
r/GameDevelopersOfIndia; Sep 16 GameDev.tv; Sep 17 r/SoloDevelopment; Sep 18
AM personal push). Own the first read of stats against the §13.6 criteria
(paid ≥ 55 attributed starts; organic ≥ 30 uniques/day on 3 of 5 days) once
spend goes non-zero — Implementation runs the daily pull, this agent reads
it, not duplicates it.

**On a possible Google leg if the Meta campaign is cancelled at cutoff:**
agree with Central's prior — **done, not worth it.** Both networks tried
so far sat in `pending-review` for hours before resolving; a Google attempt
started at or after the Sep 15 23:00 IST cutoff would face the same review
lag against a Sep 18 12:00 PT judging close, with real odds of never
clearing review at all. The downside (more prep credits, more surface area
for a fourth flight-gate surprise) isn't worth the small, non-rank-moving
upside paid was always going to deliver. Recording this now so it doesn't
need re-litigating at the cutoff.

**Status:** §14 amended per Central's request (three-gate framing, dated
paragraph above). Nothing prepared, generated, submitted, posted, or tagged
by this agent. Handing back for Central to sync.

## 17. Twelve Glasses published — added to the organic calendar — Sep 15 2026

**Trigger:** short relayed update, no timestamp given, informal (not a full
handover): the Story & Video track entry teased in §16.4 published overnight
and closed the loop — confirmed by RUN as an entry in the Story & Video
track. Share link: `https://w.run/s/UvNAAno`. Instruction: fold it into the
remaining organic calendar (Sep 15–18) alongside the game link; RUN
specifically suggested `#back-to-work` on Discord, Reddit, and X. Same
standing rule applies — draft, don't post.

**Verified before drafting:** the share link redirects through
`run-world.onelink.me` (RUN's own deep-link redirector — same domain
pattern as the game's own `w.run` share links) to
`run.world/catalog/game/5u4uBHrkmLc8bG0OOaS9`, a different catalog id from
the game's own (`PpB5gECS0AMU49mGYAKM`), consistent with this being a
separate Video Studio catalog entry rather than a typo or dead link. The
catalog page itself renders client-side and returned no fetchable content —
same known limitation already logged for the jam board (§2). Title, jam
attribution and Story & Video track status are taken on the relay's word,
consistent with the video track's own docs already syncing this
independently (visible in recent commit history, outside this agent's
remit to inspect further).

**Surface note — Reddit and X vs. §1's "decided" surface list:** §1 states
"The user has LinkedIn and Discord. Nothing else. No X, no Reddit," dated
Sep 8. That line has already been superseded in practice, not just now:
§7.1 (Sep 9) recorded real X (`@PuneetMakes`) and Reddit accounts, and the
organic calendar since §8/§13.5 has run Reddit posts
(r/GameDevelopersOfIndia, r/SoloDevelopment) as a matter of course. X was
never forbidden outright — §7.2 Tier 4 marked it "skip," explicitly
**"revisit only as a free cross-post once other creative exists."** That
condition is exactly what just happened: real creative (the video) exists,
and RUN itself is suggesting the cross-post. Drafting for X here is that
tier's own exception firing, not an override of §1.

**Drafted — RUN Discord `#back-to-work`:**
> Small extra from the jam — made a 45s short, *Twelve Glasses*, for RUN's
> Story & Video track. Watch it here: https://w.run/s/UvNAAno
> And if you haven't yet, Spice Expert: Ramu (chef-vs-kitchen arcade,
> my main jam entry) is playable here: https://w.run/puneetmakes/spice-expert-ramu
> #back-to-work

**Drafted — Reddit** (subreddit is the user's call — r/GameDevelopersOfIndia
or r/SoloDevelopment fit the existing calendar; note r/SoloDevelopment's
max-2-posts/week rule if it's already been used this week):
> Side entry for RUN's September Jam's Story & Video track — a 45s short
> called *Twelve Glasses*: https://w.run/s/UvNAAno
> It ties into my main jam entry, Spice Expert: Ramu, a chef-vs-kitchen
> arcade game (plays in your phone browser, no install):
> https://w.run/puneetmakes/spice-expert-ramu
> #back-to-work

**Drafted — X (`@PuneetMakes`):**
> Made a 45s short for RUN's September Jam Story & Video track —
> *Twelve Glasses*. https://w.run/s/UvNAAno
> Main entry is Spice Expert: Ramu, a chef-vs-kitchen arcade game:
> https://w.run/puneetmakes/spice-expert-ramu
> #back-to-work

**Caveat carried forward, not dropped:** X is still a cold, zero-follower
account (§7.1/§7.2) — this post won't move numbers on its own and isn't
being counted toward either the paid or organic judging criteria in §13.6.
Including it because it's free, RUN suggested it by name, and the creative
now exists — not because the account's reach changed.

**Calendar fold-in — §13.5, Sep 15 row:** the three blocks above run
alongside today's already-planned GameDev India / Reels+Shorts /
r/GameDevelopersOfIndia activity, not instead of it. No change to Sep
16–18's plan.

**Status:** drafted only, per the standing rule. Nothing posted by this
agent. Awaiting the user to post under their own name and relay back.
