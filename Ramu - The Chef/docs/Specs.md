# Specs — Spice Expert: Ramu

> **Technical specification.** How the thing is actually built: environment,
> architecture, contracts, tuning surfaces, commands.
> Companion docs: [GDD.md](GDD.md) (what the game is) · [Plan.md](Plan.md) (when) ·
> [Retro.md](Retro.md) (what happened).
>
> **Update rule:** revise on every iteration, progressive *or* regressive. When a
> contract below is broken or a version changes, update it here **and** log the
> reason in [Retro.md](Retro.md).

**Last updated:** Sep 5 2026, 00:10 IST (read from the system clock)
**Implementation status:** ▶ **LIVE — v1.2.3 public + approved.**
https://w.run/puneetmakes/spice-expert-ramu · game `PpB5gECS0AMU49mGYAKM`

### Live state snapshot

| | |
|---|---|
| Public version | **v1.2.3** (verified on Private/Review/Public via `rundot game info`) |
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
| ~~**2a**~~ | ➖ **cut Sep 4** | ~~Pre-rendered sprites from user-owned KayKit 3D props~~ — superseded by the art direction in [PropSpriteIndex.md](PropSpriteIndex.md) §5: **Props for the room, Essentials for the line.** A third source rendered from 3D would be a fourth resolution and technique in one frame. Original row: **Pre-rendered sprites from user-owned KayKit 3D props** — Blender, fixed angle + light rig, transparent PNG, one atlas | **0** |
| 2b | Sep 10–12 | `rundot generate image --prompt "…" --reference-image <user art> --remove-background --out <file>.png` — backgrounds, Ramu, marketing | From the 126,100 balance |

### Phase 2a — 3D → sprite pipeline (decided Sep 3, 14:45 PT) — ➖ **CUT Sep 4, 22:05 IST**

> ➖ **This whole subsection is retired.** The art direction settled on **two 2D packs at two scales** — Kitchen Props as isometric background set-dressing behind the belt, Kitchen Essentials on the line — with depth doing the separating ([PropSpriteIndex.md](PropSpriteIndex.md) §5). Adding KayKit renders would put a **third** art source at a fourth resolution and a fourth drawing technique into the same frame, which is the exact incoherence the decision was made to avoid. The licence gate below stays cleared and simply no longer matters. Kept for the reasoning, which still applies to any future pre-render.

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
| Format | ⚠️ **Revised Sep 4 2026, 15:20 IST → MP3, one file per cue.** The original rule said `.ogg`/`.m4a` *sprites*. Changed for two reasons. (1) `.ogg` is unsupported on older iOS Safari and fails **silently** inside `decodeAudioData`; with 26 of 35 players on mobile-web, a format that can go quiet on an unidentified device is the wrong trade for the few KB it saves. MP3 decodes everywhere. (2) The sprite guidance exists to cap *decoded buffer count*, and at three buffers that cap is already met — sprite offset bookkeeping would be complexity with nobody paying for it. **Revisit at ~8 cues**, which is where the original reasoning starts to bite |

> ✅ **NCS licence gate CLEARED — user, Sep 4 2026, 06:00 PT: "license allows."**
> The concern was that NCS's standard free permission is written for **video** content
> and directs interactive use to separate licensing; the jam rules require no third-party
> infringement and the prize terms make the entrant warrant it. The user has confirmed
> their licence covers this use. **Attribution remains a standing NCS condition** — track
> titles go on the credits screen (Plan §7 item 19). `rundot generate music` / `sfx`
> stays available as a first-party fallback for any track the user does not clear.

> ✅ **Supplied-SFX licence gate CLEARED — user, Sep 4 2026, 15:20 IST: CC0.**
> The five WAVs delivered at 13:10 IST are dedicated to the public domain. CC0 waives
> attribution outright, so — unlike NCS — **nothing is owed on the credits screen** and
> RUN's originality requirement is satisfied with no residual obligation. The source is
> still unnamed, so `Ramu - The Chef/Audio/` stays gitignored: the repo should not carry
> masters whose licence it cannot cite in a file beside them. Plan §7 item 27.

### 8a.1 Sampled SFX — shipped v1.2.2, corrected v1.2.3

Three of the eight cues are live. The architecture is the one the kit's own `audio.ts`
header comment proposed, and it is the part worth keeping:

| Element | Detail |
|---|---|
| Files | `public/audio/{ah,level-up,level-complete}.mp3` — mono, 44.1 kHz, 64 kbps, peak-normalised −3 dBFS |
| Payload | **42,793 B total.** Critical bundle unchanged at 667,292 B — audio is deliberately **not** in `manifest.ts` |
| Load | Fetched + decoded on the first-gesture unlock, fire-and-forget. Never awaited by boot, so no cue can delay first paint (§8a's Loading rule holds) |
| **Fallback** | **The synth stays, permanently.** Fetch failure, decode failure, or a buffer not yet ready → `playSample()` returns false and the original `tone()`/`noise()` body runs. A player on a flaky connection hears exactly what v1.2.1 played |
| Voices | One per sample; a retrigger stops the previous voice. Prevents overlap mush on repeated cues |
| Bus | Routed through `sfxBus`, so the Settings volume slider keeps working unchanged |
| Gains | `lose` 0.5 · `upgrade` 0.45 · `wave-clear` 0.5 — peak-matched to the synth cues they replace. Un-auditioned; Plan §7 item 43 |

**Mapping:** `Ah` → `sfx.lose()` (game over, as the try-again overlay appears) · `Level Up`
→ `sfx.upgrade()` · `Level Complete` → `sfx.waveClear()`. `sfx.leak()` and `sfx.win()`
stay pure synth — `leak` fires 4–10 times a run and needs a short cue, which a 2.25 s
vocal is not.

### 8a.2 🔒 BGM must be CDN-served — this is arithmetic, not preference

A 30 s stereo loop at a usable bitrate is **~360 KB against a 667 KB game**: one track
would be 54% of everything we ship. Music therefore goes to `public/cdn-assets/` and is
fetched at runtime via `RundotGameAPI.cdn.fetchAsset()`, per the `audio.ts` ADAPT note.
**That path has never been implemented** — Plan §7 item 42, and it gates the music pass.

**Generation toolchain (decided Sep 4, 16:19 IST):** Meta **MusicGen** via Hugging Face
`transformers` — not `audiocraft`, whose torch 2.1.0 + xformers pins fight Python 3.11 on
Windows. `musicgen-stereo-large` fits the 4090's 24 GB. Env lives **outside the repo**.
Prompts are written by a scoped agent that may touch only `docs/AudioGenPrompts.md`.
Every track is generated at **112 BPM, A minor, 4/4, instrumental** so rush-stage layers
can crossfade — §8a's "reports pressure rather than decorating it" only works if tempo
and key are shared. **MusicGen is music-only:** the five unpicked SFX cues need AudioGen
or CC0 packs.

### 8a.3 MusicGen toolchain — installed and verified Sep 4 2026, 16:56 IST · **SUPERSEDED by §8a.5**

> **Kept as a working fallback, no longer the primary route.** RUN's own `audioGen`
> reached parity on cost and beats it on quality — see §8a.5. Nothing below is wrong;
> it is simply not what BGM ships from. Do not uninstall: it is the only route that
> works with no credits and no network.

Local BGM generation. **The environment lives entirely outside the repo** at
`D:\AudioGen` — a venv and ~15 GB of model weights must never land near a public
repository.

| | |
|---|---|
| Location | `D:\AudioGen` — `.venv`, `gen.py`, `requirements.txt`, `hf-cache/` |
| Python | **3.11.9** (the only interpreter on the machine; `py -3.11 -m venv`) |
| Model cache | `HF_HOME=D:\AudioGen\hf-cache`, persisted with `setx`. Keeps ~15 GB off C: |
| GPU | RTX 4090, 24 GB — headroom for the largest checkpoint |
| Runner | `D:\AudioGen\gen.py` — argparse, seeded, prints every parameter so takes are reproducible and loggable |

**Why `transformers` and not Meta's `audiocraft`.** AudioCraft pins torch 2.1.0 with
`xformers` and officially targets Python 3.9; on Windows with 3.11 that combination is a
long dependency fight for no gain here. Hugging Face `transformers` carries MusicGen
natively, loads the same Meta checkpoints, and needs no xformers. What is given up is the
MultiBandDiffusion decoder, which BGM does not use. **AudioGen — Meta's *sound-effect*
model — is audiocraft-only**, so the five unpicked SFX cues cannot come from this
environment; they need CC0 packs or a separate install (Plan §7 item 13).

**Pinned versions** (`pip freeze` → `D:\AudioGen\requirements.txt`, 39 packages; the ones
that matter):

| Package | Version |
|---|---|
| `torch` | **2.5.1+cu121** |
| `torchaudio` | **2.5.1+cu121** |
| `transformers` | **5.16.1** |
| `huggingface_hub` | 1.30.0 |
| `tokenizers` | 0.23.2 |
| `safetensors` | 0.8.0 |
| `numpy` | 2.4.6 |
| `scipy` | 1.17.1 |
| `soundfile` | 0.14.0 |

Install order matters: **torch from the CUDA index first**
(`--index-url https://download.pytorch.org/whl/cu121`), then the rest from PyPI. Installing
`transformers` first pulls a CPU-only torch.

**Verified end to end, not assumed.** `facebook/musicgen-small`, 5 s, seed 1 →
**4.94 s @ 32 kHz mono, generated in 4.0 s**, read back at **peak 0.94 / RMS 0.175** — real
audio, not a silent file. At that rate a 30 s take costs roughly 25 s of GPU time, so
iterating on prompts is cheap. `facebook/musicgen-stereo-large` is the working model.

**Benign warnings, recorded so they are not re-investigated:**

- `pad_token_id`/`bos_token_id` reported as 2048 against a 2047 vocab — a known MusicGen
  config quirk in `transformers` 5.x. Output is correct.
- *"cache-system uses symlinks by default … your machine does not support them"* — the
  cache falls back to copies and uses more disk. 978 GB free; ignore.
- *"unauthenticated requests to the HF Hub"* — rate limits only. No token needed for
  public checkpoints.

**Output contract.** MusicGen writes **32 kHz WAV**. That is a master, not a shippable
asset: it must be compressed and then streamed from `public/cdn-assets/` per §8a.2. A
30 s stereo loop is ~360 KB against a 667 KB game — music never enters the bundle.


### 8a.4 Music streaming architecture — Phase 4, handed over Sep 4 2026, 17:10 IST

Design decisions, recorded because they are the reusable part. **In flight at time of
writing** — the implementation agent holds it; not yet built, not yet deployed.

| Decision | Why |
|---|---|
| **CDN call lives in `src/sdk/cdn.ts`**, not in `audio.ts` | `audio.ts` has zero SDK imports today and keeps it that way. Mirrors the `analytics.ts` precedent: `src/sdk/` wraps the SDK, consumers call the wrapper. Signature `fetchCdnAsset(path, timeoutMs) → Promise<CdnResult>` where `CdnResult = {ok:true, data:ArrayBuffer} \| {ok:false, reason:CdnFailure}`, guarded by `sdkReady()`, never throws. **Revised in Phase 4.1** — the original `ArrayBuffer \| null` collapsed every failure into one value, which made the `timeout` telemetry reason unreachable |
| **`musicBus` splits into `seqGain` + `trackGain`** | The master bus keeps carrying the Settings volume slider untouched; the two children make a crossfade possible. Only two lines move — `env.connect(musicBus)` at `audio.ts:309` and `:331` |
| **Sequencer starts first, track crossfades in over 1.2 s** | The fetch is async and may take seconds. Starting the procedural loop immediately and fading to the real track means music is never absent, and a slow network degrades to "the synth played longer" rather than to silence |
| **`clearInterval(musicTimer)` only *after* the fade** | Otherwise a slow ramp leaves a gap, and `startMusic()` could double-start later |
| **`loopStart` / `loopEndTrim` constants** | MP3 carries encoder padding at both ends, so `loop = true` clicks audibly. Default ±0.026 s (~1152 samples @ 44.1 k). These are the lever for tuning the seam by ear once a real track exists — a known limitation of the format choice in §8a, not a defect |
| **`music_track_loaded` / `music_track_failed` telemetry** | The App Check wall means **neither agent can verify the production CDN path by playing it.** Telemetry is the only route to ever knowing it works. `reason` is one of `unavailable` / `timeout` / `fetch` (from `cdn.ts`) or `decode` (thrown by `decodeAudioData`). **`unavailable` is deliberately unreportable** — it means the SDK never came up, and `track()` is itself `sdkReady()`-guarded, so the event is dropped rather than logged as a misleading `fetch`. That asymmetry is intended, not the unreachable-enum bug it superficially resembles |
| **Timeout is classified by our own timer, not the SDK's** | `cdn.ts` races a local `setTimeout` against the SDK call and hands the SDK a deadline `SDK_TIMEOUT_SLACK_MS` (5 s) *longer* than its own, so our timer reliably wins a hang and any earlier SDK rejection is a genuine fetch failure. The slack does not extend the caller's effective deadline. The `.catch()` is attached at the promise's definition site, not after the `await` — otherwise a rejection arriving after the timer won would be an unhandled rejection, which per `runSdk.ts` crashes the game |
| **⚠️ `vite dev` misreports a missing track** | Vite's SPA history fallback answers an unknown `/cdn-assets/*` with **200 `text/html`** (index.html), which then fails to decode. So locally a missing file reports `decode`; in production it reports `fetch` — **inverted.** Found during Phase 4 verification. Never read local telemetry as if it matched production |
| **Phase 4 does not deploy** | The track it carries does not exist yet, so deploying would burn a review cycle to test nothing. The committed state points at a missing file; the loader catches the 404 and the sequencer plays — which *is* the fallback path. Production never sees it because the next phase, which adds the real MP3, is what deploys |

**Verified before the handover was written, not assumed:** `fetchAsset(assetPath, { timeout? })
→ Promise<Blob>` from the SDK typings; the dev-mode `MockCdnApi` serves the same call from
`public/cdn-assets/` through the Vite dev server, so the whole path is testable on
localhost; and `rundot deploy` uploads and versions `public/cdn-assets/` automatically.


---

### 8a.5 🔒 Audio generation — RUN `audioGen` via the CLI, verified Sep 4 2026, 18:25 IST

**This is how audio is made.** Discovered Sep 4 while verifying `fetchAsset` typings
(Retro lesson 22). No in-game SDK call and no local model is needed — the CLI generates
to a file directly.

```
rundot generate music --prompt "..." --duration 30 --out bgm-service-low.mp3
rundot generate sfx   --description "..." --duration 2 --out sizzle.mp3
rundot generate estimate music --duration 30      # costs nothing, run it first
```

`--duration` is **3–300 s** for music, **0.5–30 s** for sfx. `--provider` defaults to
`elevenlabs`. `--client-ref` tags the job so takes stay traceable to a brief.

| Generation | Credits | Notes |
|---|---|---|
| music, 30 s | **113** | ~3.8 credits/s, linear — 60 s costs 225 |
| sfx, 2 s | **6** | ~3 credits/s. All five thematic cues ≈ 30 credits total |

Against a **132,561** balance this is effectively free: ten 30 s takes is 0.85% of it.
That is what settled MusicGen vs `audioGen` — MusicGen's only advantage was cost.

**Output, measured not assumed.** `--out x.mp3` writes **44.1 kHz stereo MP3 at 128 kbps**;
a 30 s track is ~480 KB. It also writes a sidecar **`x.mp3.json`** containing
`generationId`, `prompt`, `type`, `durationSec`. Unlike the image sidecars (§ the
`*.png.json` rule) **it carries no account id**, so it is safe to keep — it is the cheapest
provenance record we have of what prompt made a track.

**480 KB is too heavy to stream as-is** on a build where 26 of 35 plays are mobile-web.
Re-encode through `npm run audio:convert` before it reaches `public/cdn-assets/`; §8a.2's
~360 KB budget assumed ~96 kbps stereo.

**Take 1 of `bgm-service-low` verified as real audio:** 30.04 s, mean −15.1 dB, peak
−0.5 dB, and head/tail means within 0.3 dB of each other — i.e. **no fade at either end**,
which is what makes `loopStart`/`loopEndTrim` (§8a.4) able to close the seam. Prompting
for *"no build, no drop, no fade in or out"* is what produced that; keep it in every BGM
prompt.


### 8a.6 🔒 The BGM prompt set — issued Sep 4 2026, 20:1x IST

Handed to the audio generation agent (Plan item 49 — **it is the only producer of music
files**). Recorded here because a handover that lives only in chat is lost on the next
compaction; Retro lesson 18.

**Fixed constants across every cue, so stages crossfade:** **112 BPM · A minor · 4/4 ·
instrumental · no vocals.**

**🔒 Every BGM prompt ends with the no-shape clause:**

> *"Consistent energy and instrumentation throughout with no build, no drop, no fade in or
> out. No vocals."*

This is not stylistic. It is what made take 1 loopable — measured head and tail means
landed **within 0.3 dB** of each other, so `loopStart`/`loopEndTrim` (§8a.4) have a seam
they can actually close. A track that fades cannot be looped by trimming.

| Cue | Takes | Purpose |
|---|---|---|
| `bgm-menu` | 2 | Main menu. Sparse: bansuri over tanpura drone, finger cymbals, minimal percussion. *A kitchen before service* |
| `bgm-service-low` | 2 | Early waves. Tabla + dholak, bansuri melody, tanpura, santoor. Focused, not dramatic. **Take 1 already exists** — these are alternates |
| `bgm-service-high` | 2 | Peak rush. Tighter sixteenth-note tabla/dholak, urgent sarangi and bansuri, low percussive pulse. Tense but controlled, never chaotic. Same key and tempo as `service-low` **so the two crossfade** |

Full prompt text is logged per take by the agent in
[AudioGenPrompts.md](AudioGenPrompts.md), which is the running record.

**Batch economics:** 6 generations at 30 s = **678 credits** (~0.5% of the 132,448
balance). Twelve CLI calls — each generation is preceded by a free `estimate`, which meters
as a call at zero cost. Agent cap is **10 generations**, deliberately 4 above the plan so a
faded or off-key take can be retried without another round trip.


## 8b. 🔒 Billboard ingredient row — the overflow rule and its ceiling

Added Sep 4 2026, 19:49 IST, from the new game-view proposal (Plan item 48). The lower
billboard panel renders a recipe as `[img 01] + [img 02] + …`, **images only, no dish
name**, centred, and it **must never overflow** — it shrinks image scale to fit instead.

```
slot  = (innerWidth - (n - 1) * plusWidth - 2 * pad) / n
scale = min(1, slot / nativeIngredientWidth)
```

Scale changes **tween** on recipe change so the row settles rather than snapping.

### The ceiling: 5 comfortable, 6 hard maximum

Worked in design units against a billboard that spans most of the 720-unit width
(`innerWidth ≈ 520`, `plusWidth ≈ 28`, native ingredient ≈ 128 — the packs draw items at
roughly 100–150 px, not 16):

| Ingredients | Slot | Scale | Verdict |
|---|---|---|---|
| 3 | 155 | 1.00 | full size, room to spare |
| 4 | 109 | 0.85 | comfortable |
| **5** | **82** | **0.64** | **working target** — confirmed 20:24 IST against the L5 thali, RecipeList §3 |
| **6** | **63** | **0.49** | **at the floor — last usable** |
| 7 | 50 | 0.39 | below floor, reject |

**Floor is `MIN_INGREDIENT_SCALE = 0.45`.** A recipe that would render below it is
**rejected at authoring time**, not squeezed — an illegible row is worse than a
rejected level.

**Why the floor is that high.** These are detailed cartoon sprites with dark outlines and
interior shading, not flat icons. At 0.45 a 128-unit item lands near 58 units on screen
and the shading collapses into mud well before a flat icon would. The number is a
property of *this* art, and moves if the art style does.

> **Recipes are written against this ceiling, not discovered to violate it.**
> Five ingredients is the design target. Six is the wall. See [RecipeList.md](RecipeList.md).

The exact numbers move with the final billboard width — re-derive from the formula once
`Art/Billboard.png` is styled and its inner panel measured. The **shape** of the result
(a hard cap in the 5–6 range) does not move.

---

## 8b′. Kitchen mode — second-mode architecture

Settled Sep 4 2026, 23:10 IST in **[KitchenMode.md](KitchenMode.md)**, which is the source of truth for the belt game view's architecture. The two things a reader of this file needs to know:

- **The leaderboard gains two board modes**, `orders` and `shifts`, rather than reusing `waves`. Config resolves from the published `public` tag, so **deploy the config before any belt run can submit**, or those submissions fail silently.
- **The save gains a `kitchen` branch additively and `SAVE_KEY` does not change.** `save.ts` `parse()` defaults every missing field, so re-nesting the existing `bestWave` / `meta` under a `td:` branch — or bumping the key to `:v2` — would silently wipe live players' gems and best wave. The resulting flat-TD / nested-kitchen asymmetry is deliberate and is not to be tidied during the jam.

---

### 8a.7 🔒 Take QA — measured Sep 4 2026, 21:03 IST

Seven takes exist. The audio agent reported it could not judge fade, key drift or
vocals from its side; those are **measurable without listening**, so they were measured.
Reproduce with `tools/qa_bgm.py` (needs `soundfile`; libsndfile 1.2+ decodes MP3).

| Take | peak | rms | head Δ | tail Δ | seam | bpm | verdict |
|---|---|---|---|---|---|---|---|
| `bgm-menu-take1` | −4.3 | −17.8 | −0.8 | −1.0 | **0.6** | **112** | ✅ **clean on every measure** |
| `bgm-menu-take2` | −2.9 | −16.6 | **−4.0** | **−3.4** | 1.8 | 110 | ❌ fades both ends |
| `bgm-service-high-take1` | −4.7 | −20.7 | −0.4 | **−6.0** | 5.5 | **75** | ❌ fade-out |
| `bgm-service-high-take2` | −1.9 | −16.3 | +1.3 | −2.8 | 4.6 | **75** | ⚠️ no fade, but tempo is wrong |
| `bgm-service-low-take1` | −2.0 | −15.5 | −2.6 | −2.4 | 4.5 | **112** | ✅ best of the low takes |
| `bgm-service-low-take2` | −6.1 | −24.0 | +0.8 | **−3.1** | **11.2** | 112 | ❌ fade-out, worst seam |
| `bgm-service-low-take3` | −1.5 | −19.9 | +0.1 | −2.6 | 6.2 | **75** | ⚠️ tempo is wrong |

**head Δ / tail Δ** — level of the first / last 0.5 s against the whole track, dB. **A
fade is fatal**: it cannot be looped, and `loopStart` / `loopEndTrim` do not fix it, they
only trim encoder padding. Under about −3 dB is a real fade.
**seam** — level step between the last and first 0.25 s. This is what a listener hears as
a click or a lurch each time the loop wraps.

**Three findings the agent could not have seen, and one it should have.**

| Finding | Detail |
|---|---|
| 🔒 **Three takes came back near 75 BPM against a prompt that says 112 nine times** | `service-high` take 1 *and* 2, plus `service-low` take 3. The tempo figure is a crude onset-autocorrelation estimate and 75 ≈ 112 × ⅔, so a triplet feel could be fooling it — **but both high-intensity takes measuring slower than the low-intensity ones is the wrong direction for the cue that exists to raise tension.** Needs a listen before a re-roll is bought |
| ⚠️ **The three cues are not loudness-matched** | RMS spans −15.5 to −24.0 dB — **8.5 dB**. Crossfading between cues at these levels is an audible volume jump. Normalise to a common target in Phase 5, before `MUSIC.gain` is tuned by ear, or the gain figure will be fitted to whichever take was loudest |
| ✅ **All 7 takes are genuinely distinct** | 7 distinct sha256 and 7 distinct `generationId`. Six files share a byte size to the byte, which looks alarming and is not — constant 128 kbps × an identical 30.04 s duration gives an identical size |
| ✅ **Spend verified independently** | `rundot credits` reports **131,770** and audiogen at **8 calls / 791 credits**. Before the batch it was 2 calls / 113. Delta is exactly **6 calls / 678 credits** — so the four rate-limited attempts really were never charged |

**What ships — all three cues, decided Sep 4 2026, 22:35 IST. No re-roll, no credits.**

| Cue | File | Plays | Why this take |
|---|---|---|---|
| **menu** | `bgm-menu-take1` | Menu and between runs | **0.6 dB seam**, seven times tighter than anything else in the set — and a menu is exactly where the loop wraps with no SFX to mask it. **Zero energy below 200 Hz** and a 5493 Hz centroid: light and airy |
| **service_low** | `bgm-service-low-take1` | From run start | **The sparsest track in the set, 154 onsets/min**, with hard attacks (crest 44.4). It leaves room for the sizzle / bubble / grind SFX that carry this game's feedback |
| **service_high** | `bgm-service-high-take2` | **When walkouts remaining < 3** | No fade (+1.3 / −2.8), so it loops — which take 1 could not. **432 onsets/min**, the second-busiest take, which is what a tension cue should be |

> 🔒 **How the "wrong tempo" objection was resolved without a re-roll.** Take 2 measured
> ~75 BPM against a prompt specifying 112 nine times, and that killed it as a *service-high*
> cue by the reasoning of the day. The user proposed re-purposing it as the **menu** track,
> since 75 BPM is not wrong for a menu. The reasoning was right and the direction was
> backwards: **onset density says take 2 is the second-busiest file we have at 432
> onsets/min**, so it is not a slow track at all — the 75 BPM figure is the triplet artifact
> the original note warned about. Once density replaces tempo as the measure, take 2 is
> obviously the *high-intensity* cue it was generated to be. **The defect was in the
> estimator, not the audio.** Item 50 closed at zero cost.

### 8a.7a Cue fit — measuring "menu or gameplay" without listening

Tempo cannot answer it. These can, and they are what settled the assignment above:

| Take | onsets/min | attack crest | loudness range | centroid | bass <200 Hz |
|---|---|---|---|---|---|
| `menu-take1` | 210 | 17.5 | 11.9 dB | **5493 Hz** | **0%** |
| `menu-take2` | 463 | 13.1 | 13.9 dB | 3119 Hz | 1% |
| `service-high-take1` | 336 | 20.2 | 18.7 dB | 3091 Hz | 22% |
| **`service-high-take2`** | **432** | 16.6 | 12.4 dB | 2539 Hz | 16% |
| **`service-low-take1`** | **154** | **44.4** | 16.5 dB | 2274 Hz | 4% |
| `service-low-take2` | 200 | 20.5 | 16.3 dB | 3540 Hz | 22% |
| `service-low-take3` | 248 | 28.0 | 14.8 dB | 2924 Hz | 23% |

Reproduce with `tools/cue_fit.py`. **onsets/min** counts rising edges in the frame-energy
envelope above a noise floor — how busy the track is, and the one number that separates a
menu bed from a gameplay bed. **attack crest** is the peak-to-mean of that onset envelope:
high means sparse hard hits, low means a continuous wash.

### 8a.7b Per-cue gain trim — so switching does not step in volume

The three cues span **2.3 dB of RMS**, which is an audible jump across a crossfade.
Reference is `service_low`, because it is what ships today at `gain: 1.0` and it is the cue
the player hears longest — so the by-ear tune in Plan item 43 stays valid against it.

| Cue | rms | peak | trim | **`gain`** | peak after trim |
|---|---|---|---|---|---|
| `menu` | −17.8 | −4.3 | +2.33 dB | **1.308** | −2.0 dBFS |
| `service_low` | −15.5 | −2.0 | 0 | **1.000** | −2.0 dBFS |
| `service_high` | −16.3 | −1.9 | +0.84 dB | **1.101** | −1.1 dBFS |

Every peak stays under −1 dBFS after the trim, so nothing clips. Reproduce with
`tools/cue_gains.py`.

### 8a.7c The intensity trigger — `lives < 3`

**Walkouts are `state.lives`**, `CONFIG.economy.startLives = 10`
(`src/game/config.ts:133`). The switch to `service_high` fires when **fewer than 3 remain**,
i.e. the last 20% of the budget.

Three properties of the counter make this cheap to implement correctly:

1. **Lives only ever fall.** `state.lives` is assigned once at run start and thereafter only
   `state.lives -= e.def.livesCost` (`sim/engine.ts:430`), clamped to 0 on loss. **Nothing
   restores a life anywhere in the codebase.** So the switch is one-way inside a run —
   **no hysteresis, no debounce, no flapping possible.** Latch it and never look back.
2. **It must reset on run start**, since a new run restores lives to 10. Tie the latch to
   the same place `registerEngine` resets the run.
3. ⚠️ **The Full Thali costs 3 lives in one leak** (`data/enemies.ts:27`, `livesCost: 3`).
   Two consequences: the cue can arrive in the same instant as a big loss, which is good
   drama; but **from exactly 3 lives a Thali leak ends the run at 0 without the cue ever
   playing.** That is acceptable — a run that ends instantly does not need a build-up — but
   it is why the trigger is `< 3` and not `<= 3`, which would fire on a state the player
   can sit in comfortably.

### 8a.8 The API rate limit — discovered Sep 4 2026, during the batch

**Four of six generations returned `VenusServerApiException: Rate limited; retry in 300
seconds` on first attempt.** Confirmed via `rundot credits` each time that **a rate-limited
call is never charged**; waiting out the cooldown and retrying the prompt unchanged
succeeded every time.

Budget **~5 minutes per generation after the first**, not the couple of minutes the
handover assumed — the six-take batch took ~25 minutes. Worth knowing before any batch
is scheduled against a deadline.

> Also: `--game-id` auto-detect fails from `Ramu - The Chef/`, because `jam-entry/` is a
> **sibling** of it under the git root, not a child. Pass `PpB5gECS0AMU49mGYAKM`
> explicitly. Same directory-shape trap that cost the planning agent time on Sep 4.


## 9. Deploy pipeline

### 9.0 ⚠️ `rundot deploy` bumps the MINOR version, every time

Observed twice on Sep 4: **1.2.3 → 1.3.0 → 1.4.0**. Two consecutive deploys, the second
a three-line UI fix, and both took a whole minor version. There is no patch-level bump
and **no way to influence the number** — it is rundot's own counter, entirely separate
from `package.json`, which stays untouched.

Consequences worth holding:

- **Never write an expected version into a handover.** A Phase 5.1 handover asked for
  "v1.3.1" and got v1.4.0; the agent was right to flag the mismatch rather than assume
  it had done something wrong.
- **The number carries no meaning about the size of a change.** A typo fix and a
  subsystem rewrite look identical in the version history, so the *tag* (private /
  review / public) and the commit are the only real record of what shipped.
- Deploying to the private tag does **not** disturb `public` or `review`. Verified: with
  private on 1.4.0, both stayed on 1.2.3 across two deploys.


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
| **`textGen` auto-enabled with a 500k credit/day cap** | **Med** → remedy corrected Sep 4, 22:05 IST | `rundot/textGen.config.json` was **created automatically by the first deploy** with `dailyCreditCap: 500000`, `perUserDailyCreditCap: 10000`. The game does not use textGen. A ceiling, not a spend, so nothing is charged, but it is an open AI surface on a public game. ~~Tighten to 0 or delete the file~~ — **both wrong.** RUN's bundled `rundot/docs/…/api/AI.md` §Configuration: the service is *default-bounded*, so with **no** config file it runs under platform defaults of ~\$500/game/day and ~\$10/user/day — **deleting the file opens the surface wider than the 500k cap it replaces**, and `rundot deploy` recreates it regardless. **Correct fix: `{"disabled": true}`**, which fails every call with `AI_POLICY_DENIED`. Policy resolves from the published `public` tag, so it takes effect only on the next deploy that publishes. Re-check after each deploy since it self-created once. Plan item 17 |
| Reskin reads as off-theme to judges | **High** | The kit's own guide lists example towers, enemies, waves, board layout, palette and names as content to replace. Only names and palette are done. **Phases 1 and 2 exist to close this**, and it is currently the largest threat to both prize tracks |
