# Specs — Spice Expert: Ramu

> **Technical specification.** How the thing is actually built: environment,
> architecture, contracts, tuning surfaces, commands.
> Companion docs: [GDD.md](GDD.md) (what the game is) · [Plan.md](Plan.md) (when) ·
> [Retro.md](Retro.md) (what happened).
>
> **Update rule:** revise on every iteration, progressive *or* regressive. When a
> contract below is broken or a version changes, update it here **and** log the
> reason in [Retro.md](Retro.md).

**Last updated:** Sep 4 2026, 15:03 IST (read from the system clock)
**Implementation status:** ▶ **LIVE — v1.2.1 public + approved.**
https://w.run/puneetmakes/spice-expert-ramu · game `PpB5gECS0AMU49mGYAKM`

### Live state snapshot

| | |
|---|---|
| Public version | **v1.2.1** (verified on Private/Review/Public via `rundot game info`) |
| Live audience | **35 summed daily uniques** (Sep 3: 9 · Sep 4: 26). **26 of 35 on mobile-web.** ⚠️ `game_loaded` reports **47 distinct players** over the same window — the two disagree and the daily figure is probably low; Plan §7 item 32 |
| Repo | `September GameJam/jam-entry` (sibling of the docs folder) |
| Stack | Vite + Pixi.js v8 + React 19 + Tailwind v4, from `september-jam-tower-defense` |
| Art | **15 generated assets live**, all in the `critical` bundle. ✅ **Downscaled in v1.2.0: 16.30 MB → 0.64 MB, ~60 MB → ~3.9 MB decoded.** 1024px masters kept out of `public/` in `art-source/`; `npm run art:resize` reproduces the ship sizes. See §5a |
| Board | Still the kit's example serpentine path and pad layout. **Phase 2 replaces this** |
| Credits | **132,561** (2,325 spent on 17 `imagegen` calls in Phase 1; Phase 1.5 spent **0**). The balance has now risen **twice** with no spend — unexplained, Plan §7 item 23 |
| Thumbnail | Real, generated, exactly 512×512 JPG |
| Title | ✅ Fixed — SVG `textLength` + `lengthAdjust`, verified 320/390/430 |

**Content mapping in place (names only, kit IDs untouched):** stations Grill / Prep Board
/ Tandoor / Fryer (`fox` / `owl` / `bear` / `squirrel`); tickets Dal Tadka / Masala Chai /
Biryani / Masala Dosa / **Full Thali** (`beetle` / `wasp` / `snail` / `hornet` / `stag`,
the last costing 3 walkouts). Renaming an `id` touches `textures.ts`, `towerScene.ts`,
`towerIcons.ts`, `audio.ts` and `CONFIG.sizes` — a deliberate multi-file operation, not
a rename-in-place.

---

## 1. Environment — verified

| Component | Version / value | Verified | State |
|---|---|---|---|
| OS | Windows 11 Pro 10.0.26200 | Sep 3 | ✅ |
| Shell | PowerShell 5.1 (primary), Git Bash available | Sep 3 | ✅ |
| Node.js | **v24.16.0** | Sep 3, 20:15 UTC | ✅ (≥20 required) |
| npm | 11.13.0 | Sep 3 | ✅ |
| git | 2.48.1.windows.1 | Sep 3 | ✅ |
| `rundot` CLI | **7.14.3** — `%LOCALAPPDATA%\Programs\Rundot\rundot.exe`, on user PATH | Sep 3 | ✅ |
| RUN auth | `offroadinggamedev@gmail.com` · UserId *(redacted — public repo)* | Sep 3, 20:23 UTC | ✅ `whoami` exit 0 |
| Credits | **126,100** (100k promo redeemed; was 25,100) | Sep 3, 20:23 UTC | ✅ |
| RUN Claude Code skills | 20+ at global scope `~/.claude/skills/` | Sep 3 | ✅ |

> ⚠️ **Account guard.** Before *any* deploy, `rundot whoami` must print
> `offroadinggamedev@gmail.com`. Entry ownership and Tipalti payouts follow that
> account. If it prints anything else, stop and re-run `rundot login` — do not deploy.

### CLI surface confirmed present
`login` · `whoami` · `init` · `create` · `import` · `deploy` · `game` · `list-games` ·
`jam init <kit> <dir>` · `jam promo` · `socials` · `generate` · `analytics` ·
`leaderboard` · `credits` · `skills` · `storage` · `liveops` · `profile` · `assets`

`marketing` and `ugc` are beta-hidden behind `RUNDOT_BETA_FEATURES=1`. Not needed —
paid UA is out of scope for the jam.

---

## 2. Project layout

```
Ramu - The Chef/            <- notes + docs only, never the game
├── docs/
│   ├── GDD.md              <- design, frozen sections
│   ├── Plan.md             <- forward-looking schedule
│   ├── Specs.md            <- this file
│   └── Retro.md            <- what actually happened
└── Logic Seeding/          <- source rules, runbook, templates (read-only)

September GameJam/
└── jam-entry/              <- THE GAME. Sibling folder, no spaces. Created tonight.
    ├── game.config.json    <- identifies the game for every later deploy. NEVER delete
    ├── rundot/docs/        <- SDK docs (npx rundot-sdk-setup)
    ├── dist/               <- build output. Required by deploy
    └── src/
```

> The game lives **outside** the notes folder and is opened as its own VSCode window,
> so the agent works on the game and not on the documentation.

---

## 3. Build contract

| Requirement | Value |
|---|---|
| Kit (eligibility-critical) | `september-jam-tower-defense` |
| Scaffold command | `rundot jam init september-jam-tower-defense jam-entry` |
| Build output | **`./dist`** — non-negotiable, `deploy` reads it |
| Asset paths | **Relative** (Vite `base: './'`) |
| Runtime | Sandboxed iframe: web + mobile webviews |
| Orientation | Portrait, one-handed |

Kit list is fetched from the server at runtime, so the slug cannot be validated
offline. `september-jam-bare-bones` is confirmed real (it resolved when a placeholder
was created accidentally); the tower-defense slug is confirmed only from the event
page and remains **unverified until `jam init` runs**. If it fails, get the exact
string from `#back-to-work` before improvising.

---

## 4. SDK rules — non-negotiable

Source: `rundot-sdk` skill + `rundot/docs/`. **Both must be read before the first line
of SDK code.**

1. **Every SDK call can reject, and an unhandled rejection crashes the game.** Every
   call is wrapped. No exceptions, including fire-and-forget analytics.
2. **The game must run fully with the SDK unavailable.** SDK features are additive;
   the core shift loop never depends on a network round-trip.
3. **`initializeAsync` boot order** is fixed — follow the skill, do not improvise.
4. **Trusted server time** governs every daily rollover. Never `Date.now()` for
   anything that gates a reward, quest, or day roll. Device-clock farming would put
   the entry inside the anti-gaming rule that voids **all** entries.
5. **`appStorage` has size limits.** The save blob is versioned with ordered
   migrations and additive back-fill — never a raw dump of game state.

---

## 5. 🔒 The skin-layer swap contract

**Frozen. Built tonight, not retrofitted.** This is the single architectural decision
that keeps the Day 9–11 art pass cheap.

**Rule:** every visual renders through one skin layer. A station, ticket, or pip is a
component that takes a **token** (an identifier), never a hard-coded shape. Resolving a
token to a CSS/vector shape or to a texture happens at exactly one point in the code.

**Consequences, binding on production:**

- No layout may be tuned against geometry an image cannot reproduce.
- Every skinnable element declares a fixed aspect ratio and anchor box up front; art is
  produced to fit that box, not the other way round.
- Phase 1 (CSS/vector) and Phase 2 (generated PNG) must be swappable **without touching
  layout code**.

| Phase | Dates | Source | Credit cost |
|---|---|---|---|
| 1 | Tonight → Sep 9 | CSS/vector + web type, zero image assets | 0 |
| **2a** | Sep 10–12 | **Pre-rendered sprites from user-owned KayKit 3D props** — Blender, fixed angle + light rig, transparent PNG, one atlas | **0** |
| 2b | Sep 10–12 | `rundot generate image --prompt "…" --reference-image <user art> --remove-background --out <file>.png` — backgrounds, Ramu, marketing | From the 126,100 balance |

### Phase 2a — 3D → sprite pipeline (decided Sep 3, 14:45 PT)

**Runtime 3D is rejected.** No three.js, no glTF loading, no runtime meshes. Rationale
in [GDD.md](GDD.md) §11a: a ~600 KB renderer on a phone, model loading before first
paint, instancing discipline for draw calls, and a 3D camera that adds nothing to a flat
vertical rail in portrait.

**Adopted instead:** render once offline, ship pixels.

1. User renders each KayKit prop in Blender — **fixed camera angle and light rig across
   the whole set**, which is what buys cohesion.
2. Export transparent PNG at 2× the declared anchor-box size.
3. Pack into **one atlas** → **one draw call for every prop in the game**.
4. Register as skin-layer tokens. **No rendering code changes** — a pre-rendered PNG and
   a generated PNG are identical to the skin layer.

**Per-cuisine art swaps ride this for free.** Tandoor instead of grill, wok instead of
fryer, plus each cuisine's dish icons: new tokens and new PNGs in the same atlas, never
new code.

**Agent validates before anything ships:** transparency, aspect ratio against the
declared anchor box, atlas budget, and mobile decode cost.

> ✅ **Licence gate CLEARED — user, Sep 4 2026, 06:00 PT: "license allows."**
> The concern was that the **Unity Asset Store EULA** licenses assets for Unity-based
> products while this is a web build. The user owns the pack and has confirmed their
> licence permits this use; Phase 2a is unblocked. Credit KayKit on the credits screen
> regardless — Plan §7 item 19.


### 5a. 🔒 Asset payload budget — added Sep 4, 07:20 PT

**Rule: author at 2× the on-screen size, ship at 2×, never at generation size.**

Phase 1 shipped every asset at the generator's native 1024×1024. Result: a **16.30 MB
`critical` bundle**, a **27-second blocking preload on a 5 Mbps connection**, and
**60 MB of decoded texture memory** on devices that are mostly phones. Sprites draw at
64–96 px on screen, so the shipped art was 10–16× oversampled.

This matters more here than in a normal project because the score *is* arrivals. A
preload that long loses players between the tap and the first frame — it converts
distribution spend directly into nothing.

| Asset class | On-screen | **Ship at** | Rationale |
|---|---|---|---|
| `proj-*` | ~16–24 px | **64×64** | Projectiles are in motion and never inspected |
| `enemy-*` | ~48–64 px | **192×192** | Ticket art must stay readable; the boss may take 256 |
| `tower-*` | ~64–80 px | **256×256** | Stations are the most-looked-at objects on the board |
| `pad`, `pad-gold`, `burrow` | ~64–96 px | **256×256** | Board furniture, always visible |

**Budget: the `critical` bundle stays under 1 MB.** Anything that cannot fit moves to
`deferred`, which loads after boot and blocks nothing.

Keep the 1024 originals as masters **outside** `public/`, so a later re-scale never
needs regeneration and never costs credits.

> **Also excluded from `dist/`:** `rundot generate image` writes a `<asset>.png.json`
> sidecar next to every PNG, carrying the prompt, model, seed, generation id, and a
> storage URL that embeds the game id and a creator account identifier. Fifteen of them
> shipped in v1.1.0. They are not credentials, but they publish the art prompts and an
> account id for no benefit. Keep them locally as provenance; keep them out of the build.
>
> ✅ **Closed in v1.2.0.** Masters and sidecars moved to `jam-entry/art-source/` — outside
> `public/`, so Vite cannot copy them, and gitignored, so they cannot be pushed. `dist/`
> verified to contain zero `*.png.json`.

**Measured result of the v1.2.0 downscale** — every file verified against its IHDR, not
its reported size:

| | Before (v1.1.0) | After (v1.2.0) |
|---|---|---|
| `critical` bundle | 16.30 MB | **0.64 MB** (667,292 bytes) |
| Largest asset | ~1.53 MB | **95.6 KB** (`enemy-stag`, 256²) |
| Decoded texture memory | ~60 MB | **~3.9 MB** |
| Preload @ 5 Mbps | ~27 s | **~1 s** |

All 15 stayed in `critical`; nothing needed deferring. Colour type 6 / 8-bit — alpha
intact, no background flatten.

---

### Phase 2b — generated art (backgrounds, Ramu, marketing)

Credits go where generation genuinely beats pre-rendering: environment backdrops, Ramu
himself, and share/marketing imagery. Props stay on Phase 2a.

`--reference-image` accepts up to 10 local files, HTTPS URLs, data URIs, or creator
storage keys, so the user's supplied art **steers** generation rather than being
replaced by it. `--remove-background` yields transparent PNGs (`bria` fast /
`birefnet` high quality). `--seed` gives reproducibility across a consistent set.

**Asset intake:** the user supplies references; the agent validates format, aspect
ratio, and transparency against the declared anchor boxes **before** anything ships.

---

## 6. Game systems

Priorities: **P0 = tonight**, P1 = Sep 4–5, P2 = Sep 6–8, P3 = Sep 9–11.

| System | Responsibility | Pri |
|---|---|---|
| Rail | Vertical lane; spawns tickets top, advances them toward the pass at the bottom | **P0** |
| Ticket | 1–3 typed components (`grill` / `fryer` / `prep`); each cooks independently | **P0** |
| Station | Placed in a flanking slot; services one component type for tickets in range | **P0** |
| Service resolution | Ticket in a station's range → that station's component type progresses | **P0** |
| Pass | Hard boundary. Complete → SERVED (+cash). Incomplete → WALKOUT | **P0** |
| Shift | 5 walkouts ends it. ~60–90 s. Rush curve raises arrival rate and complexity | **P0** |
| Skin layer | Token → visual. §5 above | **P0** |
| HANDS! expedite | Tap a ticket to finish one component. Limited charges, refill between rushes | P1 |
| Mobile layout | Safe-area insets, edge/corner anchoring, thumb-arc targets | P1 |
| FTUE | Cold-open beat sheet, GDD §5. No text screens | P1 |
| Save | Versioned `appStorage` blob, migrations, debounced + lifecycle flush | P2 |
| Ledger (stats) | Lifetime tickets served, walkouts, best shift, days worked | P2 |
| Daily shift roll | Menu + rush curve + one named modifier, seeded on the server calendar day | P2 |
| Shift pay | Forgiving daily track, no streak reset | P2 |
| Notification | Re-engagement, cancel-first dedupe, clean opt-out | P2 |
| Level loader | Reads the authored level array; runs a fixed shift instead of a random one | **P2b** |
| Star evaluation | 3 conditions per level; reuses the daily-quest progress machinery | **P2b** |
| Progression strip | Scrollable vertical node list, portrait. **No map, no path, no pan** | **P2b** |
| Cuisine unlocks | Star-gated tool unlocks; unlocked set feeds Today's Shift ticket mix | **P2b** |
| Audio + VFX polish | Bell, sizzle, ticket-print, thud, tap | P3 |

**P2b = Sep 8–10.** Strictly after P2. See §6a.

### Feature skills — copy-in, never hand-built

| Skill | Maps to |
|---|---|
| `rundot-feature-save` | Save |
| `rundot-feature-stats` | Ledger |
| `rundot-feature-daily-quests` | Daily shift roll / prep list |
| `rundot-feature-daily-rewards` | Shift pay |
| `rundot-feature-notifications` | Shift-call reminder |
| `rundot-feature-tutorial` | FTUE (SDK-free) |

---

## 6a. Level run — data contract

**Added Sep 3, 14:10 PT.** Design rationale in [GDD.md](GDD.md) §10.10; the
Option A / Option B cost analysis is in [Retro.md](Retro.md) §1.

**Contract: levels are data, not code.** The whole difficulty curve is retunable by
editing one JSON file, with no game code touched. Ownership of that file is the
**user's** — it is the tuning surface that matches their stated strength.

### Level object

```json
{
  "id": 9,
  "cuisine": "tandoor",
  "name": "Friday Kebab Rush",
  "tickets": 16,
  "duration_seconds": 80,
  "allowed_stations": ["grill", "fryer", "tandoor"],
  "starting_cash": 80,
  "max_walkouts": 5,
  "ticket_mix": { "kebab": 0.5, "naan": 0.3, "fries": 0.2 },
  "arrival_curve": "slow_then_burst",
  "stars": { "finish": true, "walkouts_under": 2, "streak": 8 }
}
```

| Field | Meaning | Notes |
|---|---|---|
| `id` | Level number | Sequential; drives strip order |
| `cuisine` | Which run it belongs to | `counter` · `tandoor` · `wok` |
| `tickets` | Total tickets in the level | The level ends when all have resolved |
| `duration_seconds` | Soft length target | Tune toward 60–90 s |
| `allowed_stations` | Station types placeable | Gates tools per cuisine |
| `ticket_mix` | Weighted dish distribution | Must sum to 1.0 — validated on load |
| `arrival_curve` | Named pacing shape | `steady` · `ramp` · `slow_then_burst` · `waves` |
| `stars` | The 3 conditions | See below |

### Star conditions

| Star | Condition | Field |
|---|---|---|
| 1 | Complete the level | `finish` |
| 2 | Finish with ≤ N walkouts | `walkouts_under` |
| 3 | Serve N consecutively with no walkout | `streak` |

Evaluation reuses the `rundot-feature-daily-quests` progress machinery (stat-baseline
deltas) rather than a second bespoke system.

### Cuisines

| Run | `cuisine` | Levels | Unlocks | Gate |
|---|---|---|---|---|
| 1 | `counter` | 1–6 | Grill, Fryer | Open from the start |
| 2 | `tandoor` | 7–12 | **Tandoor** — slow cook, fills 2 dots at once | 12 stars |
| 3 | `wok` | 13–18 | **Wok** — very fast, `STATION_RANGE_ROWS` = 1 | 26 stars |

### ⚠️ The level data above is a PLACEHOLDER

**Level design is user-owned and not yet defined** (confirmed Sep 3, 14:45 PT). The
cuisines, level counts, ticket mixes and curve values in this section exist so the
system is **testable from day one** — they are not the design.

| | Owner |
|---|---|
| Schema, loader, runner, validation | Agent |
| **Cuisines, recipe lists, level count, curve, star thresholds** | **User** |
| Level Design Sheet (fill-in template) | Agent, delivered at level-design stage |

**Binding: replacing level data must never require a code change.** The placeholder set
must be discardable wholesale — different cuisine names, different level counts,
different dish vocabulary — with no edit outside the data file. Anything that would break
under that test is a bug in the loader, not in the data.

Level length target: **60–120 s, scaling by cuisine** (GDD §5). Session length is
uncapped and emergent — levels chain, and nothing gates how many are played.

### Binding rules

1. **Ships strictly after the return loop (P2).** If P2 is not live by Sep 9, this
   entire section is cut. Trigger rule, not a judgement call.
2. **No hard block.** Star gates must always be clearable by replaying earlier levels.
   Validate at load: total stars available before a gate ≥ that gate's requirement.
3. **Cold-open into level 1.** The strip renders only after the first level resolves.
   `hasSeenStrip` persists in the save blob.
4. **Unlocked cuisines feed the daily shift.** Today's Shift draws `ticket_mix` from the
   union of unlocked cuisines, so progression enriches the daily loop rather than
   competing with it.
5. **Structure only.** No PvZ art, names, framing, or 1:1 level layouts — originality
   rule, disqualification risk. `references/` is structural inspiration only.
6. **Save impact:** adds `levels: { id: { stars, best } }`, `unlockedCuisines[]`, and
   `hasSeenStrip` to the versioned blob. Counters only, never event history — see §4.5.

---

## 7. Tuning surfaces

Exposed as **named constants in one file**, because the user's strength is design and
systems. No magic numbers buried in logic.

| Constant | Purpose | Start value |
|---|---|---|
| `SHIFT_TARGET_SECONDS` | Session length | 90 |
| `MAX_WALKOUTS` | Shift-end threshold | 5 |
| `RAIL_TRAVEL_SECONDS` | Top → pass at rush 1 | 12 |
| `RUSH_ACCEL_PER_WAVE` | Arrival-rate multiplier per rush | 1.25 |
| `COMPONENT_COOK_SECONDS` | Base cook time per component | 3.0 |
| `STATION_RANGE_ROWS` | Rail rows a station reaches | 2 |
| `TICKET_COMPONENT_MIN/MAX` | Complexity range | 1 / 3 |
| `HANDS_CHARGES_PER_RUSH` | Expedite budget | 3 |
| `CASH_PER_SERVE` | Economy rate | 20 |
| `STATION_COST` / `UPGRADE_COST` | Economy sinks | 60 / 100 |

All provisional — tuned from Sep 12–13, and against real play data from `rundot analytics`.

---

## 8. Design tokens

| Token | Hex | Use |
|---|---|---|
| `--kitchen` | `#0B0B0D` | Background |
| `--paper` | `#F5F1E8` | Tickets |
| `--pass` | `#FF6B1A` | Rail, pass light, accent |
| `--served` | `#3DDC84` | Success |
| `--walkout` | `#E23B3B` | Failure |
| `--cold` | `#8A8A93` | Unplaced slots, inactive |

**Accessibility contract:** served and walkout are never distinguished by colour alone
— each carries a distinct glyph (✓ / ✗) *and* a distinct motion. Component pips differ
in **shape** as well as hue.

**🔒 Text-sizing rule (added Sep 3, 16:10 PT after two failed fixes).** Never size text
by arithmetic on estimated glyph widths. `--game-w` is `100vw`, so
`calc(var(--game-w) * 0.115)` ≈ 44.85px on a 390px phone, and twelve uppercase bold
characters overflow the frame. Use a primitive that **cannot** overflow: SVG `<text>`
with `textLength` + `lengthAdjust="spacingAndGlyphs"` inside a `viewBox`, which forces an
exact width regardless of the font. Verify every text block at **320 / 390 / 430px**.

**Silent-play contract:** every audio cue has a visual twin. The game is fully winnable
muted, which is how most phone players will play it. This is an **accessibility floor,
not a statement that audio is optional** — see §8a.

---

## 8a. Audio contract (revised Sep 3, 14:45 PT — SFX promoted to P1)

SFX ships in the **Sep 4–5 block**, not the craft pass. Cooking games run on audio
feedback, and the original defer was wrong for the genre.

| Rule | Detail |
|---|---|
| **Per-station working sound** | Every station type has its **own** loop, so a player can *hear* their line running without watching it. This is the feedback hook |
| Cue set (8) | `sizzle` (grill) · `bell` (SERVED) · `ticket_print` (arrival) · `place_ping` (station placed) · `thud` (WALKOUT) · `fryer_drop` · `tandoor_whoosh` · `wok_toss` — the last three arrive with their cuisines |
| Music | Layered or crossfaded **by rush stage**, so the track reports pressure rather than decorating it |
| **Mute parity** | Every cue keeps a visual twin. Muted play is never a worse game |
| Sourcing | User selects from asset packs and their own picks; **agent requests specific cues by name and timing** when a moment needs one |
| Loading | Audio decodes **after** first paint. No cue may delay the cold-open into level 1 |
| Format | Prefer compressed (`.ogg`/`.m4a`) sprites over many small files — mobile webviews handle few decoded buffers better than many |

> ✅ **NCS licence gate CLEARED — user, Sep 4 2026, 06:00 PT: "license allows."**
> The concern was that NCS's standard free permission is written for **video** content
> and directs interactive use to separate licensing; the jam rules require no third-party
> infringement and the prize terms make the entrant warrant it. The user has confirmed
> their licence covers this use. **Attribution remains a standing NCS condition** — track
> titles go on the credits screen (Plan §7 item 19). `rundot generate music` / `sfx`
> stays available as a first-party fallback for any track the user does not clear.

---

## 9. Deploy pipeline

```powershell
# First publish (tonight)
rundot jam init september-jam-tower-defense jam-entry
cd jam-entry
npm install
npx rundot-sdk-setup                    # SDK docs -> rundot/docs/
npm run build                           # must succeed; ./dist must exist   [CP2]
rundot init --name "Spice Expert: Ramu" --description "<GDD §3 pitch>"
rundot deploy                           # -> PRIVATE share URL + QR
# ... test on a real phone ...
rundot game set-public                  # submits for review
rundot list-games                       # confirm public + approved          [CP3]

# Every iteration after
npm run build
rundot deploy --bump Patch              # Patch | Minor | Major
rundot game set-public                  # REQUIRED AGAIN, see below
```

### 🔴 Every deploy lands PRIVATE. `set-public` is not once-and-done.

`rundot deploy` prints *"Deployed vX.Y.Z as 'private'"* even when an earlier version is
already public. **Every new version must be re-submitted with `rundot game set-public`
and goes through review again.** The Public channel keeps serving the last approved
version in the meantime, so live players are never interrupted.

`rundot game info` shows three channels; read the **Public** one to know what players
actually get:

```
 Private   Version: 1.0.1     <- what you just deployed
 Review    Version: 1.0.1     <- awaiting approval
 Public    Version: 1.0.0     <- WHAT PLAYERS ARE PLAYING
```

**Pencils-down consequence (Sep 14):** the sequence is build → deploy → **set-public** →
verify the *Public* channel shows the new version, finished by **11:00 PT**, because
approval is not instant. "Deployed" is not "public".

**Keep `game.config.json`.** It identifies the game for every later deploy. Losing it
means a new entry and a reset scoring clock.

### Troubleshooting

| Symptom | Fix |
|---|---|
| `command not found` | Fresh shell — PATH applies only to newly started shells |
| Auth failed / session expired | `rundot login`, then re-verify the account guard in §1 |
| `Game dist folder does not exist` | Fix build output, or `relativePathToBuildFolder` in `game.config.json` |
| `No changes detected in build folder` | Rebuild before deploying |
| Unexpected CLI behaviour | `rundot update`, retry |

---

## 10. Known technical risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| TD kit resists a vertical single lane | Med | Take the kit's native orientation tonight; re-orient Day 2. Never fight the kit on day 1 |
| Kit slug `september-jam-tower-defense` does not resolve | Low | Get the exact string from `#back-to-work` before improvising. Do **not** substitute a non-jam template — that is an eligibility failure |
| Unhandled SDK rejection crashes the game | Med | §4 rule 1, enforced on every call |
| `appStorage` limit exceeded as the ledger grows | Low | Versioned blob, counters only — never event history |
| Skin layer skipped under time pressure tonight | **Med** | It is **P0**. Skipping it makes the Day 9–11 art pass 3–4× more expensive. This is the one piece of tonight's architecture that is not negotiable |
| Sandboxed-iframe restriction breaks an assumption | Low | No external hosts, no downloads initiated by the page |
| ~~NCS licence does not cover interactive/game use~~ | — | ✅ **Retired Sep 4** — user confirmed the licence allows this use. Residual obligation: attribution on the credits screen. §8a |
| ~~KayKit under Unity Asset Store EULA rather than creator CC0~~ | — | ✅ **Retired Sep 4** — user confirmed the licence allows this use. Phase 2a rendering may proceed. §5 |
| Sprite atlas exceeds mobile texture budget | Low | One atlas, 2× anchor-box size, validated at intake. Split by cuisine if it grows |
| Audio decode delays the cold-open | Low | Decode after first paint; no cue blocks level 1 (§8a) |
| Placeholder levels mistaken for final design | Low | Flagged in §6a; replacing them requires no code change, which is itself the test |
| **`textGen` auto-enabled with a 500k credit/day cap** | **Med** | `rundot/textGen.config.json` was **created automatically by the first deploy** with `dailyCreditCap: 500000`, `perUserDailyCreditCap: 10000`. The game does not use textGen. A ceiling, not a spend, so nothing is charged, but it is an open AI surface on a public game. **Tighten to 0 or delete the file, and re-check after each deploy** since it self-created once |
| Reskin reads as off-theme to judges | **High** | The kit's own guide lists example towers, enemies, waves, board layout, palette and names as content to replace. Only names and palette are done. **Phases 1 and 2 exist to close this**, and it is currently the largest threat to both prize tracks |
