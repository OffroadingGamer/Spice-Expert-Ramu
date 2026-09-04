# RUN pipeline in VSCode + Claude Code — setup record

**Machine:** Windows 11 · **Set up:** 3 Sep 2026, before the jam opened.
Canonical agent instructions: https://events.run.world/events/cli-setup/agent.md
(`run.world/studio/cli-quickstart` is the same flow, rendered as an SPA.)

---

## Status

| Step | State |
|---|---|
| Node.js 20+ | ✅ **v24.16.0** — `C:\Program Files\nodejs\node.exe` |
| npm | ✅ 11.13.0 |
| git | ✅ 2.48.1 |
| `rundot` CLI | ✅ **7.14.3** — `%LOCALAPPDATA%\Programs\Rundot\rundot.exe` |
| PATH | ✅ added to **user** PATH |
| RUN AI skills for Claude Code | ✅ 24 skills → `~/.claude/skills/` (global scope) |
| **RUN sign-in** | ⬜ **Pending — run `rundot login` yourself (needs a browser)** |
| Jam kit scaffold | ⬜ Blocked until kits are announced (Sep 3, 12:00 PT) |

---

## The one manual step

In the VSCode integrated terminal (**Ctrl+`**), run:

```powershell
rundot login
```

Your browser opens the RUN.world sign-in — Google, Apple, or email all work, and
the same screen creates the account if you don't have one. Credentials persist to
`%USERPROFILE%\.rundot_cli\`. You only do this once.

Verify with:

```powershell
rundot whoami
```

> If `rundot` isn't recognised, open a **fresh** terminal — the PATH change only
> applies to newly-started shells.

---

## Why this setup beats the generic guide

`agent.md` assumes a bare agent. The CLI ships **RUN's own Claude Code skills**,
installed here at global scope so they work in whatever game folder gets created:

- `rundot-new-game` — scaffolds a full app shell (Vite + Pixi.js v8 + React 19 +
  Tailwind v4) with correct SDK boot order
- `rundot-sdk` — SDK reference: `initializeAsync` boot order, lifecycle events,
  `appStorage` limits, trusted server time, error-handling rules
- `rundot-deploy` — build + deploy with a preflight checklist
- `rundot-mobile-ux`, `rundot-ftue-onboarding`, `rundot-retention` — directly
  relevant to jam scoring (see below)
- `rundot-feature-*` — drop-in TypeScript for save systems, stats, daily rewards,
  daily quests, tutorials, notifications, analytics, localization, ads, IAP

**Skills load at session start** — restart Claude Code (or open the game folder
in a new session) before expecting them to fire.

Manage them with `rundot skills list` · `rundot skills update <skill>` ·
`rundot skills uninstall <skill>`.

---

## Jam-day sequence (Sep 3, 12:00 PT)

```powershell
# 1. Get the kit name from the event page / Discord when the theme drops
rundot jam init <kit> <directory>     # exact syntax, kit name is positional

# 2. In the new folder
npm install
npx rundot-sdk-setup                  # SDK docs -> rundot/docs/  (replaces removed `rundot download-docs`)

# 3. Open THAT folder in VSCode, start Claude Code there, describe the game

# 4. Ship
rundot init --name "My Game" --description "one-liner"
npm run build
rundot deploy                         # → private share URL + QR
rundot game set-public                # → submits for review; public+approved counts for the leaderboard
```

Iterate with `rundot deploy --bump Patch|Minor|Major`. Keep `game.config.json`.

> **Publishing does not go through Game Studio on this path.** `rundot deploy`
> publishes to the same RUN.world account. Only **public + approved** entries
> reach the jam leaderboard.

---

## Retention-relevant CLI surface

Scoring is **Total Unique Daily Plays** — unique players summed *per calendar
day*, so a player returning on a new day scores again. These map straight onto it:

- `rundot-feature-daily-rewards` / `rundot-feature-daily-quests` — day-rolled
  content on a **trusted server clock** (can't be faked by changing device time)
- `rundot-feature-notifications` — re-engagement reminders to pull players back
  on later days
- `rundot socials` / `rundot-marketing-social` — launch packets and tracked share
  links; `rundot jam promo` prints shareable play links, a caption, and social
  share URLs for a jam entry
- `rundot leaderboard`, `rundot analytics`, `rundot credits` — standings,
  telemetry, and credit balance

---

## Troubleshooting (from `agent.md`)

| Symptom | Fix |
|---|---|
| `command not found` after install | Open a fresh shell / refresh PATH |
| Session expired, auth failed | `rundot login` again |
| Unexpected CLI behaviour | `rundot update`, then retry |
| `Game dist folder does not exist` | Fix build output, or `relativePathToBuildFolder` in `game.config.json` |
| `No changes detected in build folder` | Rebuild before deploying |

SDK docs: https://series-1.gitbook.io · Help: https://discord.gg/XY2ynd3gn3

---

## Custom project requirements (if not using a kit)

Production build outputs to **`./dist`**, all asset paths **relative**
(Vite: `base: './'`), HTML/JS/TS that runs in a sandboxed iframe on web and
mobile webviews.

> ⚠️ For the **jam Game track** this is not enough — entries must start from an
> official jam kit or Adventure Studio. See [Guidelines.md](Guidelines.md) §5.
