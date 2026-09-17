# Localisation inventory — Spice Expert: Ramu

**Snapshot:** `jam-entry/src` working tree at commit `591031d` **plus Round 12's uncommitted edits**, read 18 Sep 2026 ~00:30 IST. Round 12 (Private 1.84.0) was being written in parallel: `ui/Leaderboard.tsx`, `ui/Hud.tsx`, `sdk/leaderboard.ts`, `state/save.ts`, `ui/ChefPortrait.tsx` changed under this sweep, and §5 and §16 were re-read against the tree as it stood at ~00:32. Line numbers in those two sections are the ones most likely to have moved by the time Round 12 lands; re-check them before R13 builds the table. Read-only sweep; no source was edited.
**Feeds:** R13 (string table, English only, no visible change) and R17 (Hindi). Tamil column left blank until a reader exists (Ideas.md §10.2).

## How to read this

| Column | Meaning |
|---|---|
| **key** | Proposed dot-namespaced id for the R13 table. Namespaces: `boot` `menu` `name` `settings` `hud` `rail` `targeting` `station` `meta` `bubble` `boss` `block` `dish` `enemy` `beat` `dialogue` `end` `ad` `ranks` `board` `engage` `pixi` `test`. |
| **English** | Verbatim from source. `{n}` marks a live value (the source uses JS template literals / JSX, not a `{}` syntax). |
| **file:line** | Relative to `jam-entry/src`. Line numbers are for the snapshot above. |
| **context** | Where it shows; tight limits noted. `mu` = the menu scale unit (`useMenuUnit.ts`, 1–3). |
| **flags** | `{}` interpolation · `pl` needs plural handling · `fmt` number/format-only (nothing to translate but locale digits/separators) · `a11y` screen-reader only · `host` rendered by the RUN host, not the game · `derived` computed from a slug/label, not a literal · `dev` Test Mode only (`?test=1`) |
| **Hindi draft** | Devanagari, spoken Hindustani, Ramu's register (warm, tapri cook, no Sanskritised words). Dish names stay the Hindi dish name. Latin numerals kept throughout. No em dashes in Ramu's lines (Ideas.md §6d rule), a `।` or comma instead. **Unreviewed** until the user signs off. |
| **Tamil** | Blank. |

Pluralisation: English source has **no** plural branching anywhere. Every count string reads the same at 1 (`1 rushes held`, `1 ads left today`). Rows flagged `pl` are the places a table with plural forms would need them; Hindi drafts are written to read naturally at any count where the grammar allows.

---

## 1. Boot and loading

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 1 | `boot.title` | Spice Expert: Ramu | `../index.html:10` | browser/host tab title | | स्पाइस एक्सपर्ट: रामू | |
| 2 | `boot.loadingTitle` | SPICE EXPERT: RAMU | `ui/LoadingScreen.tsx:82` | loading screen wordmark, 3xl | | स्पाइस एक्सपर्ट: रामू | |
| 3 | `boot.progress` | Firing up the line… {pct}% | `ui/LoadingScreen.tsx:95` | under the progress bar | `{}` | लाइन गरम हो रही है… {pct}% | |

## 2. Main menu

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 4 | `menu.wordmark.top` | SPICE EXPERT | `ui/MainMenu.tsx:246` | wordmark line 1, 21.8·mu, width falls out of the glyphs; ±4 % of 62 % vw acceptance band | | स्पाइस एक्सपर्ट | |
| 5 | `menu.wordmark.name` | RAMU | `ui/MainMenu.tsx:259` | wordmark line 2, 40·mu with 2.5·mu chocolate stroke | | रामू | |
| 6 | `menu.settings.aria` | Settings | `ui/MainMenu.tsx:212` | aria-label on the ⚙ button | `a11y` | सेटिंग्स | |
| 7 | `menu.gems` | 💎 {n} | `ui/GemCounter.tsx:136,142` | gem chip, `toLocaleString()` | `fmt` `{}` | 💎 {n} | |
| 8 | `menu.greeting` | Welcome, {name} | `ui/MainMenu.tsx:321` | bubble over Ramu, maxWidth 85·mu, 9·mu font, wraps; {name} ≤ 16 chars | `{}` | स्वागत है, {name} | |
| 9 | `menu.greeting.fallback` | chef | `ui/MainMenu.tsx:141`, `ui/Settings.tsx:50` | {name} fallback when no name is saved | | शेफ | |
| 10 | `menu.runNameToast` | Your name comes from your RUN profile. | `ui/MainMenu.tsx:337` | toast under the bubble, `whitespace-nowrap`, 8·mu font, 2.6 s | | तुम्हारा नाम RUN प्रोफ़ाइल से आता है। | |
| 11 | `menu.testMode` | Play Game | `ui/MainMenu.tsx:389` | ghost button, only with `?test=1` | `dev` | गेम खेलो | |
| 12 | `menu.best` | Best · Rush {n} | `ui/MainMenu.tsx:404` | above Start shift, CSS uppercase, 8·mu | `{}` | बेस्ट · रश {n} | |
| 13 | `menu.startShift` | Start shift | `ui/MainMenu.tsx:420` | the only filled button, 130·mu wide, 12·mu font | | शिफ्ट शुरू करो | |
| 14 | `menu.kitchen` | The Kitchen | `ui/MainMenu.tsx:424` | ghost button → upgrades | | रसोई | |
| 15 | `menu.ranks` | Ranks | `ui/MainMenu.tsx:428` | ghost button → leaderboard | | रैंक | |
| 16 | `menu.backdropCredit` | Backdrop: @ArchitaSharma | `ui/MainMenu.tsx:437` | credit link, 7·mu; handle stays Latin | | बैकड्रॉप: @ArchitaSharma | |
| 17 | `menu.liked` | ♥ Liked | `ui/MainMenu.tsx:448` | chip after liking | | ♥ लाइक किया | |
| 18 | `menu.like` | ♥ Like | `ui/MainMenu.tsx:457` | button, 8·mu | | ♥ लाइक | |
| 19 | `menu.comments` | 💬 Comments | `ui/MainMenu.tsx:468` | button, 8·mu | | 💬 कमेंट्स | |

## 3. Name dialogs

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 20 | `name.title` | What do they call you? | `ui/NameDialog.tsx:219` | first-run card title, 200·mu card, 15·mu | | लोग तुम्हें क्या बुलाते हैं? | |
| 21 | `name.placeholder` | Type your name | `ui/NameDialog.tsx:225` | input placeholder. ⚠ `NAME_PATTERN` (`:182`, `RenameDialog.tsx:308`) is `A-Za-z .'` only: a Devanagari name is rejected keystroke by keystroke | | अपना नाम लिखो | |
| 22 | `name.skip` | Skip | `ui/NameDialog.tsx:254` | ghost button; skip = random name | | छोड़ो | |
| 23 | `name.confirm` | That's me | `ui/NameDialog.tsx:269` | filled button | | हाँ, मैं ही हूँ | |
| 24 | `name.rename.title` | Your name | `ui/RenameDialog.tsx:334` | card title, CSS uppercase | | तुम्हारा नाम | |
| 25 | `name.rename.cancel` | Cancel | `ui/RenameDialog.tsx:355` | ghost button | | रहने दो | |
| 26 | `name.rename.save` | Save | `ui/RenameDialog.tsx:370` | filled button, 11·mu | | सेव करो | |

## 4. Settings and the shared card

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 27 | `settings.title` | Settings | `ui/Settings.tsx:55` | card title, CSS uppercase, 16·mu | | सेटिंग्स | |
| 28 | `settings.music` | 🎵 Music | `ui/Settings.tsx:57`, `ui/Hud.tsx:529` | slider label | | 🎵 म्यूज़िक | |
| 29 | `settings.sound` | 🔊 Sound | `ui/Settings.tsx:61`, `ui/Hud.tsx:533` | slider label | | 🔊 आवाज़ | |
| 30 | `settings.pct` | {pct}% | `ui/Slider.tsx:73,76` | value chip | `fmt` `{}` | {pct}% | |
| 31 | `settings.name` | Name | `ui/Settings.tsx:80,97` | row label, 12·mu | | नाम | |
| 32 | `settings.nameEdit` | {name} ✎ | `ui/Settings.tsx:92` | dashed box, guests only | `fmt` `{}` | {name} ✎ | |
| 33 | `settings.credit` | Backdrop art — Archita Sharma (@arc_inmotion) | `ui/SettingsCard.tsx:87` | credit line in Settings and the pause card, floor 11 px | | बैकड्रॉप आर्ट — अर्चिता शर्मा (@arc_inmotion) | |
| 34 | `settings.back` | Back | `ui/Settings.tsx:119` | ghost button | | वापस | |

## 5. HUD (in-run)

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 35 | `hud.escapesLeft` | ❤️🏃 Escapes left | `ui/Hud.tsx:205` | lives chip label, 0.62 rem uppercase, **must stay one line at 360 px** | | ❤️🏃 वॉकआउट बाकी | |
| 36 | `hud.cash` | 💰 Cash | `ui/Hud.tsx:210` | coins chip label | | 💰 कैश | |
| 37 | `hud.shiftMenu.aria` | Shift menu | `ui/Hud.tsx:216` | aria-label on the hamburger | `a11y` | शिफ्ट मेन्यू | |
| 38 | `hud.shiftFloat` | +{n} 🪙 shift float | `ui/Hud.tsx:242` | coin top-up toast, 2.6 s | `{}` | +{n} 🪙 शिफ्ट का गल्ला | |
| 39 | `hud.wave` | WAVE {n} | `ui/Hud.tsx:286` | wave chip, lg bold | `{}` | वेव {n} | |
| 40 | `hud.rush` | RUSH: {label} | `ui/Hud.tsx:288`, `ui/DialogueBox.tsx:158` | chip sub-label and district-beat header; {label} = §10 block label | `{}` | रश: {label} | |
| 41 | `hud.chefHead.aria` | Ramu — tap to un-mute his dialogue | `ui/Hud.tsx:313` | aria-label on the chef head | `a11y` | रामू, उसकी बातें फिर सुनने के लिए टैप करो | |
| 42 | `hud.speed` | {n}x | `ui/Hud.tsx:335` | 1x–4x speed buttons | `fmt` `{}` | {n}x | |
| 43 | `hud.objective` | Don't miss an order — you only have {lives} ❤️🏃 before you lose. | `ui/Hud.tsx:374` | banner, 4 s, `max-w-xs`; {lives} is live | `{}` `pl` | कोई ऑर्डर मत छोड़ना — बस {lives} ❤️🏃 बचे हैं, फिर शिफ्ट गई। | |
| 44 | `hud.milestone` | Full shift held. Everything from here is overtime — how far can you push it? | `ui/Hud.tsx:381` | banner at wave `waveCount+1`, 4.5 s | | पूरी शिफ्ट निकाल ली। अब से सब ओवरटाइम है — कितना और खींच पाओगे? | |
| 45 | `hud.ready` | Ready! | `ui/Hud.tsx:471`, `ui/PostBossPanel.tsx:150` | the big build-phase button, 2xl/3xl | | तैयार! | |
| 46 | `hud.action.freeze` | Deep Freeze | `ui/Hud.tsx:494` | Kitchen Actions row, three buttons side by side, 0.7 rem | | डीप फ़्रीज़ | |
| 47 | `hud.action.heat` | Turn Up The Heat | `ui/Hud.tsx:494` | same row; longest of the three | | आँच तेज़ करो | |
| 48 | `hud.action.slow` | Slow Service | `ui/Hud.tsx:494` | same row | | धीमी सर्विस | |
| 49 | `hud.action.bought` | ✓ bought | `ui/Hud.tsx:505` | under the action name once bought | | ✓ ले लिया | |
| 50 | `hud.action.price` | {n}c | `ui/Hud.tsx:505` | price line; `c` = coins suffix | `fmt` `{}` | {n} 🪙 | |
| 51 | `hud.pause.title` | Shift paused | `ui/Hud.tsx:527` | pause card title, CSS uppercase | | शिफ्ट रुकी है | |
| 52 | `hud.pause.continue` | Continue | `ui/Hud.tsx:554` | filled green | | जारी रखो | |
| 53 | `hud.pause.mainMenu` | Main Menu | `ui/Hud.tsx:574` | red-outline ghost | | मेन मेन्यू | |
| 54 | `hud.paused` | Paused | `ui/Hud.tsx:584` | kit fallback card (paused without the shift menu) | | रुका है | |

## 6. Station rail

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 55 | `rail.bonus` | {pct}% {stat}! | `ui/StationRail.tsx:171` | gold-pad badge, 0.6 rem | `{}` | {pct}% {stat}! | |
| 56 | `rail.stat.damage` | damage | `ui/StationRail.tsx:170` | {stat} value | | डैमेज | |
| 57 | `rail.stat.fireRate` | fire rate | `ui/StationRail.tsx:170` | {stat} value | | रफ़्तार | |
| 58 | `rail.stat.radius` | radius | `ui/StationRail.tsx:170` | {stat} value | | पहुँच | |
| 59 | `rail.cost` | 🪙{n} | `ui/StationRail.tsx:307,348` | station price / upgrade price | `fmt` `{}` | 🪙{n} | |
| 60 | `rail.level` | Lv {n} | `ui/StationRail.tsx:320` | under the station name | `{}` | लेवल {n} | |
| 61 | `rail.dmg` | {n} dmg | `ui/StationRail.tsx:323` | stat line, 0.6 rem | `{}` | {n} डैमेज | |
| 62 | `rail.rate` | {n}/s | `ui/StationRail.tsx:325` | stat line | `fmt` `{}` | {n}/से | |
| 63 | `rail.upgrade` | Upgrade | `ui/StationRail.tsx:346` | button, `whitespace-nowrap`, rail min 88 px, font 11–18 px: **~68 px of text** | | अपग्रेड | |
| 64 | `rail.max` | Max | `ui/StationRail.tsx:357` | replaces Upgrade at max level | | मैक्स | |
| 65 | `rail.sell` | Sell | `ui/StationRail.tsx:373` | red button, nowrap | | बेचो | |
| 66 | `rail.target` | Target | `ui/StationRail.tsx:377` | row label, 0.6 rem | | निशाना | |
| 67 | `rail.targetHelp.aria` | What do the targeting options mean? | `ui/StationRail.tsx:380` | aria-label on the `?` | `a11y` | निशाने के विकल्पों का क्या मतलब है? | |
| 68 | `rail.close` | Close | `ui/StationRail.tsx:435` | bottom of the rail | | बंद करो | |
| 69 | `rail.targeting.title` | Targeting | `ui/StationRail.tsx:443` | help popup title | | निशाना | |
| 70 | `rail.targeting.intro` | Who this tower attacks when several bugs are in range: | `ui/StationRail.tsx:445` | help popup lead. ⚠ pre-reskin words (“tower”, “bugs”) | | जब कई डिशें पहुँच में हों, ये स्टेशन किस पर पहले लगेगा: | |
| 71 | `rail.targeting.row` | {label}: {desc} | `ui/StationRail.tsx:450-451` | one row per mode | `fmt` `{}` | {label}: {desc} | |
| 72 | `rail.gotIt` | Got it | `ui/StationRail.tsx:460` | help popup button | | समझ गया | |
| 73 | `rail.sellConfirm` | Sell {name} for 🪙 {n}? | `ui/StationRail.tsx:469` | confirm title | `{}` | {name} को 🪙 {n} में बेचें? | |
| 74 | `rail.sellCancel` | Cancel | `ui/StationRail.tsx:477` | | | रहने दो | |
| 75 | `rail.sellConfirmBtn` | Sell +{n}c | `ui/StationRail.tsx:488` | red confirm button | `{}` | बेचो +{n} 🪙 | |

### 6a. Targeting modes (`game/data/targeting.ts`)

Labels must fit one rail button at 11 px (≈68 px of text). Descriptions show only in the help popup.

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 76 | `targeting.first` | First | `:37` | rail button | | पहला | |
| 77 | `targeting.last` | Last | `:38` | rail button | | आख़िरी | |
| 78 | `targeting.closest` | Close | `:39` | rail button | | पास वाला | |
| 79 | `targeting.strongest` | Strong | `:40` | rail button | | मज़बूत | |
| 80 | `targeting.weakest` | Weak | `:41` | rail button | | कमज़ोर | |
| 81 | `targeting.highestHp` | Hi HP | `:42` | rail button | | ज़्यादा HP | |
| 82 | `targeting.lowestHp` | Lo HP | `:43` | rail button | | कम HP | |
| 83 | `targeting.first.desc` | enemy furthest along the path | `:48` | help popup | | जो रास्ते में सबसे आगे हो | |
| 84 | `targeting.last.desc` | enemy closest to the start | `:49` | help popup | | जो शुरुआत के सबसे पास हो | |
| 85 | `targeting.closest.desc` | enemy closest to this tower | `:50` | help popup | | जो इस स्टेशन के सबसे पास हो | |
| 86 | `targeting.strongest.desc` | enemy with highest max HP | `:51` | help popup | | जिसकी कुल HP सबसे ज़्यादा हो | |
| 87 | `targeting.weakest.desc` | enemy with lowest max HP | `:52` | help popup | | जिसकी कुल HP सबसे कम हो | |
| 88 | `targeting.highestHp.desc` | enemy with highest health remaining | `:53` | help popup | | जिसकी HP अभी सबसे ज़्यादा बची हो | |
| 89 | `targeting.lowestHp.desc` | enemy with lowest health remaining | `:54` | help popup | | जिसकी HP अभी सबसे कम बची हो | |

## 7. Stations and persistent upgrades (`game/data/towers.ts`, sealed)

Names render in the rail (11–18 px, two-word names wrap at the space), the sell confirm, and the Upgrades list.

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 90 | `station.fox` | Stock Pot | `:71` | rail card / upgrades header | | पतीला | |
| 91 | `station.owl` | Pressure Cooker | `:92` | rail card (wraps to two lines) | | प्रेशर कुकर | |
| 92 | `station.bear` | Cooktop | `:117` | rail card | | चूल्हा | |
| 93 | `station.squirrel` | Sauce Pot | `:139` | rail card | | सॉस पॉट | |
| 94 | `station.fox.unique` | Sharp Knife | `:86` | signature track name, Upgrades | | तेज़ छुरी | |
| 95 | `station.fox.unique.desc` | Perfect sear chance (does 2x the work) | `:87` | Upgrades sub-line | | परफ़ेक्ट सियर का मौका (दुगना काम) | |
| 96 | `station.owl.unique` | Deep Chill | `:111` | | | गहरी ठंडक | |
| 97 | `station.owl.unique.desc` | Tickets hold on the pass longer | `:112` | | | टिकट पास पर ज़्यादा देर रुकते हैं | |
| 98 | `station.bear.unique` | Wider Burner | `:133` | | | चौड़ा बर्नर | |
| 99 | `station.bear.unique.desc` | Cooks more of the rail at once | `:134` | | | एक बार में रेल का ज़्यादा हिस्सा पकाता है | |
| 100 | `station.squirrel.unique` | Longer Ladle | `:154` | | | लंबी कड़छी | |
| 101 | `station.squirrel.unique.desc` | Serves more tickets at once | `:155` | | | एक बार में ज़्यादा टिकट निपटाता है | |

## 8. Upgrades screen (`ui/MetaUpgrades.tsx`)

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 102 | `meta.title` | Upgrades | `:39` | screen title, 3xl | | अपग्रेड | |
| 103 | `meta.stat.damage` | Heat | `:15` | stat row name | | आँच | |
| 104 | `meta.stat.speed` | Fast Hands | `:16` | stat row name | | फुर्तीले हाथ | |
| 105 | `meta.stat.range` | Reach | `:17` | stat row name | | पहुँच | |
| 106 | `meta.statValue` | +{n}% | `:73` | after the stat name | `fmt` `{}` | +{n}% | |
| 107 | `meta.level` | Level {n}/{max} | `:76` | under each stat | `{}` | लेवल {n}/{max} | |
| 108 | `meta.uniqueRow` | {desc} · Level {n}/{max} | `:111` | signature track sub-line | `{}` | {desc} · लेवल {n}/{max} | |
| 109 | `meta.unique.pct` | +{n}% | `:23` | crit track value | `fmt` `{}` | +{n}% | |
| 110 | `meta.unique.plain` | +{n} | `:24,25,27,28` | chains/splash/status-damage/knockback value | `fmt` `{}` | +{n} | |
| 111 | `meta.unique.seconds` | +{n}s | `:26` | status-duration value | `fmt` `{}` | +{n} से | |
| 112 | `meta.max` | Max | `:98,133` | button at max level, min-w-24 | | मैक्स | |
| 113 | `meta.cost` | 💎 {n} | `:98,133` | buy button | `fmt` `{}` | 💎 {n} | |
| 114 | `meta.back` | Back | `:148` | full-width bottom button | | वापस | |

## 9. Wave bubble and scroll (`ui/WaveBubble.tsx`)

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 115 | `bubble.aria` | Upcoming wave | `:368` | aria-label on the trigger | `a11y` | अगली वेव | |
| 116 | `bubble.count` | {remaining}/{count} | `:398`, `:508` | under each dish icon, 12 px | `fmt` `{}` | {remaining}/{count} | |
| 117 | `bubble.more` | ··· | `:405`, `ui/Leaderboard.tsx:577` | overflow marker (reduced motion) / rank gap | `fmt` | ··· | |
| 118 | `bubble.names` | {a} / {b} | `:497` | double-dish cell, `max-w-[7.5rem]` truncate, 11 px | `fmt` `{}` | {a} / {b} | |
| 119 | `bubble.toughness.aria` | toughness {n} of 5 | `:500` | aria on the pip row | `a11y` `{}` | मज़बूती 5 में से {n} | |
| 120 | `bubble.bounty` | · 🪙{n} | `:503` | cell bounty | `fmt` `{}` | · 🪙{n} | |
| 121 | `bubble.remaining.aria` | {remaining} of {count} remaining | `:507` | aria on the count | `a11y` `{}` `pl` | {count} में से {remaining} बाकी | |

## 10. Post-boss panel (`ui/PostBossPanel.tsx`)

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 122 | `boss.title` | Congratulations! | `:128` | 23 px title | | बधाई हो! | |
| 123 | `boss.body` | {finished} shift complete. {upcoming} awaits. | `:130` | 17.5 px; both values are block labels (§11) | `{}` | {finished} शिफ्ट पूरी। अब {upcoming} की बारी। | |
| 124 | `boss.upcoming` | Upcoming dishes | `:132` | 12.5 px uppercase | | अगली डिशें | |
| 125 | `boss.dishName` | {name} | `:141` | `max-w-[4.6rem]` truncate, 11.4 px; dish names §12 | `derived` `{}` | {name} | |

## 11. Block labels (`game/data/blocks.ts`)

Render as `RUSH: {label}` (HUD chip, dialogue header), in the post-boss body, and drive the menu costume.

⚠ **Implementation hazard:** `chefBodyAliasForBlock()` (`:166-168`) derives the chef-body asset alias from the *English label* (`'NORTH INDIAN'` → `chef-body-north-indian`). If the label is translated in place, the costume lookup breaks. The table must key display labels on `block.id` and leave the alias derivation on an untranslated slug.

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 126 | `block.1` | CAFE | `:27` | | | कैफ़े | |
| 127 | `block.2` | NORTH INDIAN | `:44` | | | नॉर्थ इंडियन | |
| 128 | `block.3` | SOUTH INDIAN | `:57` | | | साउथ इंडियन | |
| 129 | `block.4` | ITALIAN | `:70` | | | इटैलियन | |
| 130 | `block.5` | NORTH EAST | `:83` | | | नॉर्थ ईस्ट | |
| 131 | `block.6` | NE FUSION | `:96` | | | NE फ़्यूज़न | |
| 132 | `block.7` | ITALIAN FUSION | `:109` | | | इटैलियन फ़्यूज़न | |
| 133 | `block.8` | DESI FUSION | `:122` | | | देसी फ़्यूज़न | |
| 134 | `block.9` | OVERTIME | `:135` | also the milestone wording in HUD/end screen | | ओवरटाइम | |

`theme` strings (`:28,45,…`) are data only; nothing renders them. Not inventoried.

## 12. Dish names

**There is no dish-name literal in the source.** Every displayed dish name is `titleCase(slug)` (`ui/WaveBubble.tsx:138`, `ui/PostBossPanel.tsx:33`) over the slugs in `blocks.ts` `dishes`. The table needs one `dish.<slug>` entry per slug and both `titleCase` call sites replaced by a lookup. Slugs below are the 22 that reach the screen; `file:line` is the first `blocks.ts` occurrence. Display limits: bubble trigger `max-w-[4rem]` at 11 px, scroll cell `max-w-[7.5rem]` at 11 px (two names joined by ` / `), post-boss `max-w-[4.6rem]` at 11.4 px, all `truncate`.

| # | key | English (as rendered) | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 135 | `dish.chai` | Chai | `:35` | block 1 | `derived` | चाय | |
| 136 | `dish.coffee` | Coffee | `:36` | block 1 | `derived` | कॉफ़ी | |
| 137 | `dish.naan` | Naan | `:47` | block 2, 8, 9 | `derived` | नान | |
| 138 | `dish.jeera-rice` | Jeera Rice | `:48` | block 2, 8, 9 | `derived` | जीरा राइस | |
| 139 | `dish.palak-aloo` | Palak Aloo | `:49` | block 2, 8, 9 | `derived` | पालक आलू | |
| 140 | `dish.gobhi-masala` | Gobhi Masala | `:50` | block 2, 8, 9 | `derived` | गोभी मसाला | |
| 141 | `dish.rajma` | Rajma | `:51` | block 2, 8, 9 (boss) | `derived` | राजमा | |
| 142 | `dish.coconut-chutney` | Coconut Chutney | `:60` | block 3, 7, 8, 9 | `derived` | नारियल चटनी | |
| 143 | `dish.idli` | Idli | `:61` | block 3, 7, 8, 9 | `derived` | इडली | |
| 144 | `dish.upma` | Upma | `:62` | block 3, 7, 8, 9 | `derived` | उपमा | |
| 145 | `dish.sambar` | Sambar | `:63` | block 3, 7, 8, 9 | `derived` | सांभर | |
| 146 | `dish.beans-poriyal` | Beans Poriyal | `:64` | block 3, 7, 8, 9 (boss) | `derived` | बीन्स पोरियल | |
| 147 | `dish.pesto` | Pesto | `:73` | block 4, 6, 7 | `derived` | पेस्तो | |
| 148 | `dish.minestrone` | Minestrone | `:74` | block 4, 6, 7 | `derived` | मिनेस्त्रोने | |
| 149 | `dish.arrabbiata` | Arrabbiata | `:75` | block 4, 6, 7 | `derived` | अराबियाता | |
| 150 | `dish.aglio-e-olio` | Aglio E Olio | `:76` | block 4, 6, 7. ⚠ `titleCase` capitalises the `E`; a lookup can spell it *Aglio e Olio* | `derived` | आल्यो ए ओल्यो | |
| 151 | `dish.risotto` | Risotto | `:77` | block 4, 6, 7 (boss) | `derived` | रिज़ोतो | |
| 152 | `dish.veg-thukpa` | Veg Thukpa | `:86` | block 5, 6 | `derived` | वेज थुकपा | |
| 153 | `dish.bamboo-shoot-fry` | Bamboo Shoot Fry | `:87` | block 5, 6; longest name, 16 chars | `derived` | बाँस की कोंपल फ्राई | |
| 154 | `dish.veg-momo` | Veg Momo | `:88` | block 5, 6 | `derived` | वेज मोमो | |
| 155 | `dish.sticky-rice` | Sticky Rice | `:89` | block 5, 6 | `derived` | स्टिकी राइस | |
| 156 | `dish.ooti` | Ooti | `:90` | block 5, 6 (boss) | `derived` | ऊटी | |

Manifest-only dish aliases (`assets/manifest.ts`), never reached by any block and therefore never shown: `baingan-bharta`, `bhindi-fry`, `bruschetta`, `dal-cooked`, `dal-tadka`, `rasam`, `tomato-gravy`, `xaak-bhaji`. Reserve keys if R13 wants the table complete (बैंगन भरता · भिंडी फ्राई · ब्रुस्केटा · दाल · दाल तड़का · रसम · टमाटर ग्रेवी · ज़ाक भाजी); not counted below.

## 13. Enemy archetype names (`game/data/enemies.ts`, sealed)

Defined but **never rendered**: every consumer reads `hp`/`bounty`/`speed`, and the on-screen name is the block's dish (§12). Listed because the brief asks; a table need not include them until something shows them.

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 157 | `enemy.beetle` | Chai | `:23` | not rendered | | चाय | |
| 158 | `enemy.wasp` | Bhindi Fry | `:24` | not rendered | | भिंडी फ्राई | |
| 159 | `enemy.snail` | Rajma | `:25` | not rendered | | राजमा | |
| 160 | `enemy.hornet` | Beans Poriyal | `:26` | not rendered | | बीन्स पोरियल | |
| 161 | `enemy.stag` | Ooti | `:27` | not rendered | | ऊटी | |

## 14. Dialogue beats (`game/data/dialogue.ts`)

All shown in the centred box (`max-w-md`, 1.05 rem, next to a 160 px portrait, so roughly 2–4 lines of text width). One line per beat; the `lines` array is the interpolation-free string. No em dashes (Ideas.md §6d).

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 162 | `beat.opening` | Some days the tin is empty. Today's one of them. | `:49` | run start, voice A | | कुछ दिन डिब्बा खाली रहता है। आज वही दिन है। | |
| 163 | `beat.propPlacement` | Green ring means you can afford it. Tap one and pick a prop. Red means save up. | `:55` | once ever, when the first pad cue arms | | हरा घेरा मतलब पैसे पूरे हैं। एक पर टैप करो और सामान चुनो। लाल मतलब अभी बचत करो। | |
| 164 | `beat.stoveLit` | But the stove still lights. That's enough to start. | `:61` | after first placement; the box IS Ready here | | पर चूल्हा अब भी जलता है। शुरुआत के लिए इतना काफ़ी है। | |
| 165 | `beat.recipeWidget` | That scroll up top is the order. Every dish on it walks in this rush. Count them off as you serve. | `:67` | once ever, wave 1 build | | ऊपर वाला कागज़ ऑर्डर है। उस पर लिखी हर डिश इस रश में आएगी। परोसते जाओ, गिनते जाओ। | |
| 166 | `beat.heatGaugeIntro` | See the heat on the left? Every rush you survive turns it up a notch. When it hits the flame, the big one walks in. Be ready. | `:73` | once ever, before wave1-cleared; longest beat | | बाईं तरफ़ आँच दिख रही है? हर रश जो तुम निकालोगे, एक निशान ऊपर चढ़ेगी। लपट तक पहुँची, तो बड़ा वाला अंदर आएगा। तैयार रहना। | |
| 167 | `beat.wave1Cleared` | They came back for seconds. Did you see that? It's time to upgrade. | `:79` | wave 1 cleared; closing opens the upgrade dock | | दोबारा माँगने आए। देखा तुमने? अब अपग्रेड का वक़्त है। | |
| 168 | `beat.wave4Ready` | New gear, same nerves. Let's find out. | `:85` | wave 4 build, voice B; the box IS Ready | | नया सामान, वही घबराहट। चलो देखते हैं। | |
| 169 | `beat.district2` | A real dhaba. Tandoor and all. I'm not dreaming? | `:91` | level 11, header RUSH: NORTH INDIAN | | असली ढाबा। तंदूर भी। मैं सपना तो नहीं देख रहा? | |
| 170 | `beat.district3` | They want dosa now. My wrist is ready. | `:97` | level 21 | | अब डोसा चाहिए इन्हें। मेरी कलाई तैयार है। | |
| 171 | `beat.district4` | They want Italian. I watched one video. We're fine. | `:103` | level 31, voice B | | इटैलियन चाहिए इन्हें। मैंने एक वीडियो देखा है। हो जाएगा। | |
| 172 | `beat.district5` | Smoked chilli. I'll cry through this whole shift. | `:109` | level 41, voice B | | भुनी मिर्च। पूरी शिफ्ट आँसू बहेंगे। | |
| 173 | `beat.district6` | I stopped copying recipes. I'm writing them. | `:115` | level 51 | | अब मैं रेसिपी नक़ल नहीं करता। खुद लिखता हूँ। | |
| 174 | `beat.district7` | Two kitchens, one plate. Nobody taught me this. | `:121` | level 61 | | दो रसोई, एक थाली। ये मुझे किसी ने नहीं सिखाया। | |
| 175 | `beat.district8` | This one's mine. Every bit of it. | `:127` | level 71 | | ये वाला मेरा है। पूरा का पूरा। | |
| 176 | `beat.overtime` | Every plate tonight had two pairs of hands. Thank you. | `:133` | level 81, voice C | | आज रात हर थाली पर दो जोड़ी हाथ थे। शुक्रिया। | |

### 14a. Dialogue box chrome (`ui/DialogueBox.tsx`)

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 177 | `dialogue.continue.aria` | Continue | `:212` | aria-label on the whole box | `a11y` | आगे | |
| 178 | `dialogue.skip` | Skip | `:262` | top-right pill, 0.7 rem. ⚠ Skip = **mute all dialogue for the run and after** (Round 3) | | छोड़ो | |
| 179 | `dialogue.hint` | tap to continue ▸ | `:265` | bottom-right, 0.6 rem, white/40 | | आगे के लिए टैप करो ▸ | |

## 15. End screen (`ui/EndScreen.tsx`)

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 180 | `end.outcome.newBest` | Best shift this kitchen has ever seen. Write it on the wall. | `:56` | Ramu's line, face c | | इस रसोई की सबसे बढ़िया शिफ्ट। दीवार पर लिख दो। | |
| 181 | `end.outcome.matched` | Matched the record. Next time it falls. | `:59` | Ramu's line, face b | | रिकॉर्ड की बराबरी। अगली बार टूटेगा। | |
| 182 | `end.outcome.nearBest` | {gap} short of the record. The record's getting nervous. | `:63` | Ramu's line, face b | `{}` `pl` | रिकॉर्ड से {gap} कम। रिकॉर्ड घबराने लगा है। | |
| 183 | `end.outcome.held` | {n} rushes held. Nobody at the tapri would believe it. | `:66` | Ramu's line, face a, n ≥ 20 | `{}` `pl` | {n} रश निकाल दिए। टपरी पर कोई यक़ीन नहीं करेगा। | |
| 184 | `end.outcome.early` | Rough start. The stove still lights tomorrow. | `:68` | Ramu's line, face a | | शुरुआत कड़वी रही। कल चूल्हा फिर जलेगा। | |
| 185 | `end.header.overtime` | Full shift held. Overtime rush {n} got you. | `:189` | ticket header, 0.65 rem | `{}` | पूरी शिफ्ट निकाल ली। ओवरटाइम रश {n} ने पकड़ लिया। | |
| 186 | `end.header.lost` | No escapes left — every dish that slipped past was a customer out the door. | `:190` | ticket header | | वॉकआउट ख़त्म — जो भी डिश निकल गई, वो एक ग्राहक था जो दरवाज़े से बाहर चला गया। | |
| 187 | `end.rushesHeld` | Rushes held | `:262` | ticket row label, 0.68 rem uppercase | | रश निकाले | |
| 188 | `end.newBest` | NEW BEST | `:266` | row sub-line, bold orange | | नया रिकॉर्ड | |
| 189 | `end.bestEq` | best {n} · = | `:268` | row sub-line on a tie | `fmt` `{}` | बेस्ट {n} · = | |
| 190 | `end.bestDelta` | best {n} · −{d} | `:269` | row sub-line | `fmt` `{}` | बेस्ट {n} · −{d} | |
| 191 | `end.dishesServed` | Dishes served | `:272` | ticket row label | | डिशें परोसीं | |
| 192 | `end.gemsEarned` | Gems earned | `:274` | ticket row label | | जेम कमाए | |
| 193 | `end.gemsValue` | +{n} 💎 | `:275` | row value | `fmt` `{}` | +{n} 💎 | |
| 194 | `end.gemsBreakdown` | {n} rushes × {g} 💎 each | `:276` | row sub-line | `{}` `pl` | {n} रश × {g} 💎 हर एक | |
| 195 | `end.gemsBonus` |  + {n} bonus | `:276` | appended to the breakdown after an ad | `{}` | + {n} बोनस | |
| 196 | `end.retry` | Retry | `:287` | the only filled button, 2xl | | फिर से | |
| 197 | `end.upgradeKitchen` | Upgrade kitchen | `:301` | ghost, half width | | रसोई अपग्रेड करो | |
| 198 | `end.menu` | Menu | `:313` | ghost, half width | | मेन्यू | |
| 199 | `end.bonusClaimed` | Bonus claimed · +{n} 💎 | `:320` | replaces the ad card | `{}` | बोनस मिल गया · +{n} 💎 | |
| 200 | `end.doubleIt` | Double it: +{n} 💎 · Watch an ad | `:331` | opt-in ad card, 0.95 rem | `{}` | दुगना करो: +{n} 💎 · एक ऐड देखो | |
| 201 | `end.adConfirm` | Watch an ad to earn {n} bonus gems? | `:339` | confirm dialog title, xl | `{}` `pl` | {n} बोनस जेम के लिए ऐड देखोगे? | |
| 202 | `end.adsLeft` | {r}/{max} ads left today | `:342` | confirm dialog sub-line | `{}` `pl` | आज {max} में से {r} ऐड बाकी | |
| 203 | `end.adCancel` | Cancel | `:353` | | | रहने दो | |
| 204 | `end.adLoading` | Loading… | `:364` | button while the ad loads | | लोड हो रहा… | |
| 205 | `end.adWatch` | Watch | `:364` | amber confirm button | | देखो | |
| 206 | `ad.name` | Game over gem bonus | `:217` | passed to `showRewardedAd({ name })`; the RUN host may show it | `host` | गेम ओवर जेम बोनस | |
| 207 | `ad.description` | {n} bonus gems | `:215` | passed to the RunBucks spend-confirm the host renders on no-ads platforms | `host` `{}` `pl` | {n} बोनस जेम | |

## 16. Ranks (`ui/Leaderboard.tsx`, `sdk/leaderboard.ts`)

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 208 | `ranks.title` | Ranks | `Leaderboard.tsx:459` | header, 20·mu uppercase, gold with chocolate drop | | रैंक | |
| 209 | `ranks.back` | ← | `Leaderboard.tsx:443` | back button glyph | `fmt` | ← | |
| 210 | `ranks.period.today` | Today | `Leaderboard.tsx:483` | period pill | | आज | |
| 211 | `ranks.period.alltime` | All time | `Leaderboard.tsx:483` | period pill | | अब तक | |
| 212 | `board.dishesServed` | Dishes served | `leaderboard.ts:42` | board tab (`kills` mode) | | डिशें परोसीं | |
| 213 | `board.wavesHeld` | Waves held | `leaderboard.ts:43` | board tab (`waves` mode) | | वेव निकालीं | |
| 214 | `ranks.you` | you | `Leaderboard.tsx:173` | tomato tag after the player's own row | | तुम | |
| 215 | `ranks.podiumRank` | #{n} | `Leaderboard.tsx:259` | rank number on the brass step face | `fmt` `{}` | #{n} | |
| 216 | `ranks.bar.loading` | Loading… | `Leaderboard.tsx:395,543` | sticky bar / list | | लोड हो रहा… | |
| 217 | `ranks.bar.offline` | Ranks need the RUN app | `Leaderboard.tsx:396` | sticky bar, plain browser | | रैंक के लिए RUN ऐप चाहिए | |
| 218 | `ranks.bar.error` | Could not load your rank | `Leaderboard.tsx:397` | sticky bar | | तुम्हारी रैंक लोड नहीं हो पाई | |
| 219 | `ranks.bar.noRunToday` | No shift yet today — start one | `Leaderboard.tsx:398` | sticky bar, tappable → Start shift | | आज अभी कोई शिफ्ट नहीं — एक शुरू करो | |
| 220 | `ranks.bar.unranked` | Unranked · play a shift | `Leaderboard.tsx:399` | sticky bar | | रैंक नहीं · एक शिफ्ट खेलो | |
| 221 | `ranks.bar.today` | #{rank} today · {score} {unit} | `Leaderboard.tsx:402` | sticky bar left; {score} is `toLocaleString()` | `{}` | #{rank} आज · {score} {unit} | |
| 222 | `ranks.bar.alltime` | #{rank} all time · {score} {unit} | `Leaderboard.tsx:402` | sticky bar left | `{}` | #{rank} अब तक · {score} {unit} | |
| 223 | `ranks.unit.waves` | waves held | `Leaderboard.tsx:101` | {unit} for the waves board (the tab label, lowercased) | `pl` | वेव निकालीं | |
| 224 | `ranks.unit.kills` | dishes served | `Leaderboard.tsx:101` | {unit} for the kills board | `pl` | डिशें परोसीं | |
| 225 | `ranks.bar.gap` | {gap} to #{rank} | `Leaderboard.tsx:404` | sticky bar right | `{}` | #{rank} तक {gap} और | |
| 226 | `ranks.bar.resets` | resets {t} | `Leaderboard.tsx:405` | sticky bar right, daily only | `{}` | {t} में रीसेट | |
| 227 | `ranks.resetFormat` | {h}h {m}m | `Leaderboard.tsx:300` | {t} above | `fmt` `{}` | {h} घं {m} मि | |
| 228 | `ranks.offline` | Leaderboards are available in the RUN app. | `Leaderboard.tsx:537` | message ticket, plain browser | | लीडरबोर्ड RUN ऐप में मिलेगा। | |
| 229 | `ranks.error` | Could not load this board. | `Leaderboard.tsx:548` | message ticket | | ये बोर्ड लोड नहीं हो पाया। | |
| 230 | `ranks.errorHint` | Check your connection and try again. | `Leaderboard.tsx:550` | under the error | | कनेक्शन देखो और फिर कोशिश करो। | |
| 231 | `ranks.emptyToday` | Nobody has clocked in today. | `Leaderboard.tsx:557` | empty daily board | | आज अभी तक कोई काम पर नहीं आया। | |
| 232 | `ranks.emptyAll` | No runs on the board yet. Be the first! | `Leaderboard.tsx:557` | empty all-time board | | बोर्ड पर अभी कोई रन नहीं। पहले तुम बनो! | |
| 233 | `ranks.rankMissing` | – | `Leaderboard.tsx:158` | row rank when null | `fmt` | – | |
| 233a | `ranks.rankDelta` | ▲{n} / ▼{n} | `Leaderboard.tsx:165` | Round 12 delta arrow beside the player's own row, green up / red down, 11·mu | `fmt` `{}` | ▲{n} / ▼{n} | |

## 17. Engagement toasts (`sdk/engagement.ts`, shown via `RundotGameAPI.popups.showToast`)

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 234 | `engage.likeThanks` | Thanks for the like! | `:73` | host toast after a like | `host` | लाइक के लिए शुक्रिया! | |
| 235 | `engage.likeUnavailable` | Not available right now, try again in a moment. | `:79,84` | host toast on like failure | `host` | अभी नहीं हो पा रहा, थोड़ी देर में फिर कोशिश करो। | |
| 236 | `engage.commentsUnavailable` | Comments are not available right now. | `:103` | host toast | `host` | कमेंट्स अभी नहीं खुल रहे। | |
| 237 | `engage.commentsRetry` | Comments are not available right now, try again in a moment. | `:113,118` | host toast | `host` | कमेंट्स अभी नहीं खुल रहे, थोड़ी देर में फिर कोशिश करो। | |

## 18. Pixi text on the board (`game/towerScene.ts`)

Pixi `Text` objects need the table too (`t(key)` in Pixi as Ideas.md §10.2 says), and Devanagari needs a font that Pixi can rasterise (OS font on device; Noto Sans Devanagari as the web fallback).

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 238 | `pixi.coinPopup` | +{n} | `:405` | rising coin popup, 22 design units | `fmt` `{}` | +{n} | |
| 239 | `pixi.gauge` | {n}/10 | `:785,889` | heat gauge label, 32 design units (~12 px at 403 wide) | `fmt` `{}` | {n}/10 | |
| 240 | `pixi.lvUp` | Lv↑ | `:1956` | upgrade-affordable pill over a station, 24 units; pill width follows label width | | लेवल↑ | |
| 241 | `pixi.preview.dmgFrom` | {a} →  | `:2081` | upgrade preview line 1, white part | `fmt` `{}` | {a} →  | |
| 242 | `pixi.preview.dmgTo` | {b} dmg | `:2082` | upgrade preview line 1, green part | `{}` | {b} डैमेज | |
| 243 | `pixi.preview.rateFrom` | {a} →  | `:2083` | line 2, white | `fmt` `{}` | {a} →  | |
| 244 | `pixi.preview.rateTo` | {b}/s | `:2084` | line 2, green | `fmt` `{}` | {b}/से | |

## 19. Test Mode (dev-gated behind `?test=1`, never in the public menu)

Inventoried for completeness; R13 can skip these without visible effect. Same columns, Hindi drafted at lower care.

| # | key | English | file:line | context | flags | Hindi draft | Tamil |
|---|---|---|---|---|---|---|---|
| 245 | `test.hint.unlock` | Tap a locked station to unlock it — {n} 🪙 | `ui/TestBelt.tsx:493` | first-level hint | `dev` `{}` | बंद स्टेशन खोलने के लिए टैप करो — {n} 🪙 | |
| 246 | `test.hint.place` | Tap an empty station to set it up. | `ui/TestBelt.tsx:501` | hint | `dev` | खाली स्टेशन पर टैप करके उसे सजाओ। | |
| 247 | `test.ready` | Ready | `ui/TestBelt.tsx:510` | start button | `dev` | तैयार | |
| 248 | `test.shiftMenu.aria` | Shift menu | `ui/TestBelt.tsx:565` | aria | `dev` `a11y` | शिफ्ट मेन्यू | |
| 249 | `test.end.won` | Shift cleared | `ui/TestBelt.tsx:635` | end card title | `dev` | शिफ्ट पार | |
| 250 | `test.end.lost` | Too many walkouts | `ui/TestBelt.tsx:635` | end card title | `dev` | बहुत ग्राहक चले गए | |
| 251 | `test.end.completed` | {n} {recipe} completed | `ui/TestBelt.tsx:659` | one per recipe | `dev` `{}` `pl` | {n} {recipe} बने | |
| 252 | `test.end.collected` | {n} ingredients collected | `ui/TestBelt.tsx:661` | | `dev` `{}` `pl` | {n} सामग्री जमा | |
| 253 | `test.end.walkedOut` | {n} walked out | `ui/TestBelt.tsx:662` | | `dev` `{}` `pl` | {n} चले गए | |
| 254 | `test.end.discarded` | {n} ingredients discarded | `ui/TestBelt.tsx:663` | | `dev` `{}` `pl` | {n} सामग्री फेंकी | |
| 255 | `test.end.short` | {n} short of target | `ui/TestBelt.tsx:672` | loss only | `dev` `{}` | लक्ष्य से {n} कम | |
| 256 | `test.end.earned` | earned = {n} | `ui/TestBelt.tsx:686` | coins line | `dev` `{}` | कमाए = {n} | |
| 257 | `test.end.clear` | clear | `ui/TestBelt.tsx:703` | third star threshold label | `dev` | पार | |
| 258 | `test.end.hats` | {n} Chef Hats | `ui/TestBelt.tsx:709` | | `dev` `{}` `pl` | {n} शेफ टोपी | |
| 259 | `test.end.next` | Next Level | `ui/TestBelt.tsx:723` | | `dev` | अगला लेवल | |
| 260 | `test.end.again` | Run Again | `ui/TestBelt.tsx:731` | | `dev` | फिर से | |
| 261 | `test.end.mainMenu` | Main Menu | `ui/TestBelt.tsx:738,858` | | `dev` | मेन मेन्यू | |
| 262 | `test.ok` | OK | `ui/TestBelt.tsx:783` | message dismiss | `dev` | ठीक है | |
| 263 | `test.sell.title` | Sell {name}? | `ui/TestBelt.tsx:800` | | `dev` `{}` | {name} बेचें? | |
| 264 | `test.sell.refund` | Refund: {n} coins | `ui/TestBelt.tsx:801` | | `dev` `{}` `pl` | वापसी: {n} सिक्के | |
| 265 | `test.sell.confirm` | Sell | `ui/TestBelt.tsx:812` | | `dev` | बेचो | |
| 266 | `test.sell.cancel` | Cancel | `ui/TestBelt.tsx:819` | | `dev` | रहने दो | |
| 267 | `test.pause.title` | Shift paused | `ui/TestBelt.tsx:833` | | `dev` | शिफ्ट रुकी है | |
| 268 | `test.pause.music` | Music | `ui/TestBelt.tsx:835` | | `dev` | म्यूज़िक | |
| 269 | `test.pause.sound` | Sound | `ui/TestBelt.tsx:838` | | `dev` | आवाज़ | |
| 270 | `test.pause.back` | Back to shift | `ui/TestBelt.tsx:848` | | `dev` | शिफ्ट पर वापस | |
| 271 | `test.picker.title` | Pick a station | `ui/PropPicker.tsx:87` | | `dev` | एक स्टेशन चुनो | |
| 272 | `test.picker.level` | Level {n} | `ui/PropPicker.tsx:121` | | `dev` `{}` | लेवल {n} | |
| 273 | `test.picker.cancel` | Cancel | `ui/PropPicker.tsx:135` | | `dev` | रहने दो | |
| 274 | `test.prop.kettle` | Kettle | `game/kitchenConfig.ts:272` | prop name, picker + board label | `dev` | केतली | |
| 275 | `test.prop.waterDispenser` | Water Dispenser | `game/kitchenConfig.ts:273` | prop name | `dev` | पानी का डिस्पेंसर | |
| 276 | `test.prop.lvSuffix` |  - Lv {n} | `game/kitchenScene.ts:802` | board label suffix, name truncates before it | `dev` `{}` | - लेवल {n} | |
| 277 | `test.slot.unlockFor` | Unlock for | `game/kitchenScene.ts:927` | locked-slot line 1, fit-to-width | `dev` | खोलो, | |
| 278 | `test.msg.cantPlace` | Not enough coins to place {name} ({n} needed). | `game/kitchenScene.ts:1048` | modal message | `dev` `{}` | {name} रखने के लिए सिक्के कम हैं ({n} चाहिए)। | |
| 279 | `test.board.count` | ×{n} | `game/kitchenScene.ts:1384` | dish board count | `dev` `fmt` `{}` | ×{n} | |
| 280 | `test.hud.walkouts` | Walkouts Left : {n} | `game/kitchenScene.ts:1546` | banner, fit-to-width 26→14 | `dev` `{}` | वॉकआउट बाकी : {n} | |
| 281 | `test.hud.served` |   ·  Served {a}/{b} | `game/kitchenScene.ts:1543-1544` | appended to the banner | `dev` `{}` | · परोसे {a}/{b} | |
| 282 | `test.msg.unlockLeavesNothing` | Unlocking now would leave nothing for a utensil — place one first. | `game/kitchenScene.ts:1631` | modal | `dev` | अभी खोला तो बर्तन के लिए कुछ नहीं बचेगा — पहले एक रखो। | |
| 283 | `test.msg.cantUnlock` | Not enough coins to unlock ({n} needed). | `game/kitchenScene.ts:1635` | modal | `dev` `{}` | खोलने के लिए सिक्के कम हैं ({n} चाहिए)। | |
| 284 | `test.ing.milk` | Milk | `game/data/levels.ts:70` | ingredient label; also sliced to a 2-letter tile code at `kitchenScene.ts:1137` | `dev` `derived` | दूध | |
| 285 | `test.ing.ginger` | Ginger | `game/data/levels.ts:71` | | `dev` | अदरक | |
| 286 | `test.ing.teaLeaf` | Tea Leaf | `game/data/levels.ts:72` | | `dev` | चायपत्ती | |
| 287 | `test.ing.coffeeExtract` | Coffee Extract | `game/data/levels.ts:73` | | `dev` | कॉफ़ी अर्क | |
| 288 | `test.ing.cream` | Cream | `game/data/levels.ts:74` | | `dev` | मलाई | |
| 289 | `test.ing.rice` | Rice | `game/data/levels.ts:75` | | `dev` | चावल | |
| 290 | `test.ing.ghee` | Ghee | `game/data/levels.ts:76` | | `dev` | घी | |
| 291 | `test.recipe.chai` | Masala Chai | `game/data/levels.ts:104` | billboard heading, end card | `dev` | मसाला चाय | |
| 292 | `test.recipe.coffee` | Coffee | `game/data/levels.ts:110` | | `dev` | कॉफ़ी | |
| 293 | `test.recipe.jeeraRice` | Jeera Rice | `game/data/levels.ts:120` | | `dev` | जीरा राइस | |
| 294 | `test.level.n0l1` | First Pour | `game/data/levels.ts:178` | level name (billboard) | `dev` | पहली प्याली | |
| 295 | `test.level.n0l2` | Second Order | `game/data/levels.ts:199` | | `dev` | दूसरा ऑर्डर | |
| 296 | `test.level.n0l3` | Two Tickets | `game/data/levels.ts:217` | | `dev` | दो टिकट | |
| 297 | `test.level.n0l4` | Morning Rush | `game/data/levels.ts:242` | | `dev` | सुबह की भीड़ | |
| 298 | `test.level.n1l1` | Open the Dhaba | `game/data/levels.ts:263` | | `dev` | ढाबा खोलो | |

---

## Count

| Bucket | Rows |
|---|---|
| Live game (sections 1–18) | **245** (rows 1–244 plus 233a; row 11 is the dev-only menu button) |
| of which format-only (`fmt`, nothing to translate) | 30 |
| of which screen-reader only (`a11y`) | 8 |
| of which host-rendered (`host`) | 6 |
| of which defined but not rendered (enemy names, §13) | 5 |
| of which interpolated (`{}`) | 60 |
| of which need plural forms (`pl`) | 10 |
| Test Mode, dev-gated (section 19) | 54 (rows 245–298) |
| **Total inventoried** | **299** |

Counts above were re-derived from the written rows with grep, not carried from the sweep. Translatable rows in the live game (245 minus 30 `fmt`, minus the 5 unrendered enemy names, minus row 11): **209**; about **200** once the repeated literals below collapse to one key each. Ideas.md §10.2 estimated ~250 including 39 dish names; the real figure is 22 rendered dish names (31 in the manifest, 8 never shown), and the total lands near the estimate only once Test Mode is included.

Repeated literals worth one key each, not several (sites, across all sections): *Cancel* ×5 (rows 25, 74, 203, 266, 273), *Main Menu* ×3 sites (rows 53, 261), *Loading…* ×3 sites (rows 204, 216), *Back* ×2, *Ready!* ×2 sites (row 45), *Shift paused* ×2, *Shift menu* ×2, *Max* ×2, *Dishes served* ×2 (rows 191, 212). Keys above are per-site so file:line stays exact; R13 can collapse them.

## Ten strings I was least sure about

1. **`hud.escapesLeft` — “❤️🏃 Escapes left” → वॉकआउट बाकी.** “Escapes” is the game's own coined term (a customer walking out). “वॉकआउट” is English loan; a purer “बचे ग्राहक” reads as *customers left* which is the opposite meaning. Also the hardest fit: one line at 360 px.
2. **`hud.shiftFloat` — “shift float” → शिफ्ट का गल्ला.** *Float* is till-cash jargon; गल्ला (the till) is the closest kitchen word, but a player may read it as “sack”. Alternative: शुरुआती कैश.
3. **`menu.greeting` — “Welcome, {name}” → स्वागत है, {name}.** Correct but slightly formal for Ramu. आओ, {name} is warmer but reads as a command. Wants the user's ear.
4. **All *Cancel* buttons → रहने दो.** Chosen for voice over the standard रद्द करें, which is form-Hindi. If the user prefers the neutral register everywhere, swap all five.
5. **`station.fox` / `station.squirrel` — Stock Pot → पतीला, Sauce Pot → सॉस पॉट.** The four stations carry a dish-equipment metaphor; पतीला is the everyday word for a stock pot, but there is no everyday Hindi word for a *sauce* pot, so one name is translated and one transliterated, which reads uneven next to प्रेशर कुकर and चूल्हा.
6. **`board.wavesHeld` / `ranks.unit.waves` — “Waves held” → वेव निकालीं.** The game says *rush* everywhere a player reads it (`Best · Rush`, `RUSH:` chip, every Ramu line, the end ticket's *Rushes held*) and *wave* only on the WAVE chip and this board tab. Hindi has no reason to keep two words for one thing; वेव is a bare loan. If the user prefers one term, रश (or भीड़) across the board is the consistent pick and this tab's draft changes with it.
7. **`beat.district5` — “Smoked chilli. I'll cry through this whole shift.” → भुनी मिर्च।** भुनी is *roasted*, not *smoked*; Hindi has no common one-word *smoked* (धुएँ वाली मिर्च is accurate but clumsy). Bhut jolokia context makes भुनी acceptable, but the joke shifts slightly.
8. **`dish.bamboo-shoot-fry` → बाँस की कोंपल फ्राई.** The NE dish has no pan-Indian Hindi name; this is a description, and at 19 characters it will truncate in every one of the three 11 px boxes. A shorter बैम्बू फ्राई loses the *shoot*.
9. **`dish.aglio-e-olio` / `dish.minestrone` / `dish.arrabbiata` — Italian names in Devanagari.** Transliteration choices (आल्यो ए ओल्यो, मिनेस्त्रोने, अराबियाता) follow Italian pronunciation, not how a Hindi menu usually spells them (often एग्लियो ओलियो). Menu spelling may be what players recognise.
10. **`pixi.lvUp` — “Lv↑” → लेवल↑.** Doubles the label width inside a Pixi pill sized 60 % of the station sprite; may need to stay “Lv↑” or shrink to “ऊपर↑”. Also the one place Pixi must rasterise Devanagari at 24 design units, so it is the font-fallback test case.

## Things R13 should know before building the table

- **Name input rejects Devanagari.** `NAME_PATTERN = /^[A-Za-z .']*$/` in both name dialogs (rows 21, 24). A Hindi-first player cannot type their name in Hindi. Either widen the charset (`\p{L}`) or accept Latin-only names as a known limit; the RUN board's moderation on non-Latin text is also untested (Ideas.md §10.2).
- **Block label → asset alias coupling** (section 11 note). Translate by `id`, not by mutating `label`.
- **Dish names are derived, not stored** (section 12). Two `titleCase` call sites become lookups; the enemy-archetype names in the sealed `enemies.ts` are not the source of any on-screen name and need no unseal.
- **No plural forms anywhere.** Ten strings show a bare count; English already reads “1 rushes”. Hindi mostly tolerates this (रश, ऐड, जेम are invariant), Tamil will not.
- **Numerals kept Latin** in every draft. Devanagari digits (१२३) are a policy choice for the user, not a per-string one; every `fmt` row would flip together.
- **Host-rendered copy** (rows 206–207, 234–237) goes through the RUN SDK; whether the host localises its own chrome around them is unknown.
- **Pixi fonts.** Rows 238–244 render inside the canvas; Devanagari needs an OS font on device and a bundled fallback on web (Noto Sans Devanagari, ~150 KB per Ideas.md §10.2). Nothing in `styles/app.css` declares a font-family today, so the React side inherits system fonts and will “just work”; Pixi `TextStyle` has no fallback chain set.
- **Untouched by this sweep:** `sim/engine.ts`, `data/waves.ts`, `data/levels.ts` beyond its names, `audio/audio.ts`, `assets/*`, `sdk/*` other than the toasts and board labels above. None of them holds a rendered string.
