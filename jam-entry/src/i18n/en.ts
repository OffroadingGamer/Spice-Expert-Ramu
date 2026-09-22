/**
 * Round 13 Part 2 (docs/Ideas.md §10.2 pick A, "full i18n, curated" — English
 * table first, no visible change this round). Source of truth: docs/i18n/
 * strings.md (the R13 handover's own inventory, 244/245 live-game rows) —
 * every key below uses that doc's own dot-namespaced id and its own
 * "English (verbatim from source)" column, so this file is a transcription,
 * not a rewrite. `{n}`/`{name}`/etc. mark a live interpolated value, resolved
 * by index.ts's t()/tn() — same `{}` syntax the inventory itself documents
 * (the source used JS template literals, never a real `{}` runtime before
 * this table).
 *
 * Two value shapes:
 *   - a plain string — the common case.
 *   - `{ one, other }` — the ten rows strings.md flags `pl` (a bare count
 *     with no plural branching today, e.g. "1 rushes held"). Both forms are
 *     IDENTICAL to the current source text this round, on purpose: the
 *     handover's own acceptance is pixel parity against 1.86.0, so tn()'s
 *     one/other split exists structurally (ready for Hindi's real plural
 *     grammar in a later round) without changing a single rendered
 *     character now. tn() picks `one` at count===1, `other` otherwise.
 *
 * Skipped per the handover's own allowance ("skip section 19 Test Mode and
 * rows flagged fmt/a11y unless trivially wrapped"):
 *   - Section 19 (Test Mode, `?test=1` only) — not in this table at all.
 *   - Section 13 (enemy archetype names) — defined in enemies.ts but never
 *     rendered anywhere; no key needed until something shows them.
 *   - A handful of pure interpolation-only passthroughs where t() would be a
 *     literal no-op (e.g. `boss.dishName` = "{name}", nothing but the value
 *     itself) — see this round's own report for the exact list and why.
 * `fmt`/`a11y`/`host`-flagged rows ARE included below (wrapping them costs
 * nothing and keeps every render site consistent), except where noted.
 */

export type TranslationEntry = string | { one: string; other: string };

export const en: Record<string, TranslationEntry> = {
    // ---- 1. Boot and loading ----------------------------------------------
    'boot.title': 'Spice Expert: Ramu',
    'boot.loadingTitle': 'SPICE EXPERT: RAMU',
    'boot.progress': 'Firing up the line… {pct}%',

    // ---- 2. Main menu -------------------------------------------------------
    'menu.wordmark.top': 'SPICE EXPERT',
    'menu.wordmark.name': 'RAMU',
    'menu.settings.aria': 'Settings',
    'menu.gems': '💎 {n}',
    'menu.greeting': 'Welcome, {name}',
    'menu.greeting.fallback': 'chef',
    'menu.runNameToast': 'Your name comes from your RUN profile.',
    'menu.testMode': 'Play Game',
    'menu.best': 'Best · Rush {n}',
    // Round 16 Part 2 (docs/Ideas.md §10.5 pick "Play"): was menu.startShift
    // = "Start shift" — renamed key and value together since "Play" is a
    // different word, not a re-translation of the same one.
    'menu.play': 'Play',
    'menu.kitchen': 'The Kitchen',
    'menu.ranks': 'Ranks',
    'menu.backdropCredit': 'Backdrop: @ArchitaSharma',
    'menu.liked': '♥ Liked',
    'menu.like': '♥ Like',
    'menu.comments': '💬 Comments',
    // Round 16 Part 3 (docs/Ideas.md §10.5 pick B): the greeting bubble's
    // unlock-notice variants — see save.ts's kitchenBadgeCount doc for why
    // "ready" here means "unlocked since the Kitchen was last opened", not a
    // live shard-threshold check.
    'menu.greeting.scrollReady': 'Welcome back, {name} — the {dish} scroll is ready in the kitchen.',
    'menu.greeting.rewardsWaiting': 'Rewards are waiting in the kitchen.',

    // ---- 3. Name dialogs ------------------------------------------------
    'name.title': 'What do they call you?',
    'name.placeholder': 'Type your name',
    'name.skip': 'Skip',
    'name.confirm': "That's me",
    'name.rename.title': 'Your name',
    'name.rename.cancel': 'Cancel',
    'name.rename.save': 'Save',

    // ---- 4. Settings and the shared card ---------------------------------
    'settings.title': 'Settings',
    'settings.music': '🎵 Music',
    'settings.sound': '🔊 Sound',
    'settings.pct': '{pct}%',
    'settings.name': 'Name',
    'settings.nameEdit': '{name} ✎',
    'settings.credit': 'Backdrop art — Archita Sharma (@arc_inmotion)',
    'settings.back': 'Back',

    // ---- 5. HUD (in-run) --------------------------------------------------
    'hud.escapesLeft': '❤️🏃 Escapes left',
    'hud.cash': '💰 Cash',
    'hud.shiftMenu.aria': 'Shift menu',
    'hud.shiftFloat': '+{n} 🪙 shift float',
    'hud.wave': 'WAVE {n}',
    'hud.rush': 'RUSH: {label}',
    'hud.chefHead.aria': 'Ramu — tap to un-mute his dialogue',
    'hud.speed': '{n}x',
    'hud.objective': {
        one: "Don't miss an order — you only have {lives} ❤️🏃 before you lose.",
        other: "Don't miss an order — you only have {lives} ❤️🏃 before you lose.",
    },
    'hud.milestone': 'Full shift held. Everything from here is overtime — how far can you push it?',
    'hud.ready': 'Ready!',
    'hud.action.freeze': 'Deep Freeze',
    'hud.action.heat': 'Turn Up The Heat',
    'hud.action.slow': 'Slow Service',
    // Round 14 Part 2 (docs/Ideas.md §6d "Playtest of 1.86.0" item 2, pick
    // A): the three actions become 44x44 icon chips — 'hud.action.bought'
    // shortens from "✓ bought" (fit the old text chip) to a bare check (the
    // new chip's whole cost line is one glyph or the price, never both).
    'hud.action.bought': '✓',
    'hud.action.price': '{n}c',
    // hud.actions.* (Round 14 Part 2): the icon chip's own aria-label — the
    // visible button now carries only a glyph + price, so the full action
    // name (hud.action.freeze/heat/slow above) still needs to reach a
    // screen reader. Also the tap-and-hold name toast's content.
    'hud.actions.aria': '{label}',
    'hud.pause.title': 'Shift paused',
    'hud.pause.continue': 'Continue',
    'hud.pause.mainMenu': 'Main Menu',
    'hud.paused': 'Paused',

    // ---- 6. Station rail ----------------------------------------------------
    'rail.bonus': '{pct}% {stat}!',
    'rail.stat.damage': 'damage',
    'rail.stat.fireRate': 'fire rate',
    'rail.stat.radius': 'radius',
    'rail.cost': '🪙{n}',
    'rail.level': 'Lv {n}',
    'rail.dmg': '{n} dmg',
    'rail.rate': '{n}/s',
    'rail.upgrade': 'Upgrade',
    'rail.max': 'Max',
    'rail.sell': 'Sell',
    'rail.target': 'Target',
    'rail.targetHelp.aria': 'What do the targeting options mean?',
    'rail.close': 'Close',
    'rail.targeting.title': 'Targeting',
    'rail.targeting.intro': 'Who this tower attacks when several bugs are in range:',
    'rail.targeting.row': '{label}: {desc}',
    'rail.gotIt': 'Got it',
    'rail.sellConfirm': 'Sell {name} for 🪙 {n}?',
    'rail.sellCancel': 'Cancel',
    'rail.sellConfirmBtn': 'Sell +{n}c',

    // ---- 6a. Targeting modes (game/data/targeting.ts) ----------------------
    'targeting.first': 'First',
    'targeting.last': 'Last',
    'targeting.closest': 'Close',
    'targeting.strongest': 'Strong',
    'targeting.weakest': 'Weak',
    'targeting.highestHp': 'Hi HP',
    'targeting.lowestHp': 'Lo HP',
    'targeting.first.desc': 'enemy furthest along the path',
    'targeting.last.desc': 'enemy closest to the start',
    'targeting.closest.desc': 'enemy closest to this tower',
    'targeting.strongest.desc': 'enemy with highest max HP',
    'targeting.weakest.desc': 'enemy with lowest max HP',
    'targeting.highestHp.desc': 'enemy with highest health remaining',
    'targeting.lowestHp.desc': 'enemy with lowest health remaining',

    // ---- 7. Stations and persistent upgrades (data/towers.ts, sealed —
    // keyed on station id, never on the sealed file's own literals) --------
    'station.fox': 'Stock Pot',
    'station.owl': 'Pressure Cooker',
    'station.bear': 'Cooktop',
    'station.squirrel': 'Sauce Pot',
    'station.fox.unique': 'Sharp Knife',
    'station.fox.unique.desc': 'Perfect sear chance (does 2x the work)',
    'station.owl.unique': 'Deep Chill',
    'station.owl.unique.desc': 'Tickets hold on the pass longer',
    'station.bear.unique': 'Wider Burner',
    'station.bear.unique.desc': 'Cooks more of the rail at once',
    'station.squirrel.unique': 'Longer Ladle',
    'station.squirrel.unique.desc': 'Serves more tickets at once',

    // ---- 8. Upgrades screen (ui/MetaUpgrades.tsx) --------------------------
    'meta.title': 'Upgrades',
    'meta.stat.damage': 'Heat',
    'meta.stat.speed': 'Fast Hands',
    'meta.stat.range': 'Reach',
    'meta.statValue': '+{n}%',
    'meta.level': 'Level {n}/{max}',
    'meta.uniqueRow': '{desc} · Level {n}/{max}',
    'meta.unique.pct': '+{n}%',
    'meta.unique.plain': '+{n}',
    'meta.unique.seconds': '+{n}s',
    'meta.max': 'Max',
    'meta.cost': '💎 {n}',
    'meta.back': 'Back',

    // ---- 9. Wave bubble and scroll (ui/WaveBubble.tsx) ---------------------
    'bubble.aria': 'Upcoming wave',
    'bubble.count': '{remaining}/{count}',
    'bubble.more': '···',
    'bubble.names': '{a} / {b}',
    'bubble.toughness.aria': 'toughness {n} of 5',
    'bubble.bounty': '· 🪙{n}',
    'bubble.remaining.aria': {
        one: '{remaining} of {count} remaining',
        other: '{remaining} of {count} remaining',
    },
    // Round 14 Part 3 (docs/Ideas.md §10.4): the shard-award toast on a
    // full-service (zero-leak) wave clear — see WaveBubble.tsx's
    // ShardAwardToast. 'bubble.scroll' replaces 'bubble.shard' for whichever
    // slugs crossed 8 shards on THIS clear. No ✦ glyph baked into the string
    // — Part 4's ui-shard PNG renders as its own <img> beside this text (the
    // handover's own "the shard renders at 14px tall in the bubble"), not a
    // unicode character.
    'bubble.shard': '+1',
    'bubble.scroll': 'Scroll!',

    // ---- 10. Post-boss panel (ui/PostBossPanel.tsx) ------------------------
    'boss.title': 'Congratulations!',
    'boss.body': '{finished} shift complete. {upcoming} awaits.',
    'boss.upcoming': 'Upcoming dishes',
    // boss.dishName ("{name}") is a pure passthrough — see this round's own
    // report; not wired, t() there would be a no-op.

    // ---- 11. Block labels (game/data/blocks.ts) — keyed on block.id, NEVER
    // on the English label itself: chefBodyAliasForBlock() derives the chef
    // costume asset alias FROM block.label, so blocks.ts's own `label` field
    // stays English/untranslated forever — this table is the only place the
    // DISPLAY string changes. ------------------------------------------------
    'block.1': 'CAFE',
    'block.2': 'NORTH INDIAN',
    'block.3': 'SOUTH INDIAN',
    'block.4': 'ITALIAN',
    'block.5': 'NORTH EAST',
    'block.6': 'NE FUSION',
    'block.7': 'ITALIAN FUSION',
    'block.8': 'DESI FUSION',
    'block.9': 'OVERTIME',

    // ---- 12. Dish names — every displayed name used to be titleCase(slug);
    // this table replaces both titleCase call sites (WaveBubble.tsx,
    // PostBossPanel.tsx). Keyed on the manifest slug, not the archetype. ----
    'dish.chai': 'Chai',
    'dish.coffee': 'Coffee',
    'dish.naan': 'Naan',
    'dish.jeera-rice': 'Jeera Rice',
    'dish.palak-aloo': 'Palak Aloo',
    'dish.gobhi-masala': 'Gobhi Masala',
    'dish.rajma': 'Rajma',
    'dish.coconut-chutney': 'Coconut Chutney',
    'dish.idli': 'Idli',
    'dish.upma': 'Upma',
    'dish.sambar': 'Sambar',
    'dish.beans-poriyal': 'Beans Poriyal',
    'dish.pesto': 'Pesto',
    'dish.minestrone': 'Minestrone',
    'dish.arrabbiata': 'Arrabbiata',
    'dish.aglio-e-olio': 'Aglio E Olio',
    'dish.risotto': 'Risotto',
    'dish.veg-thukpa': 'Veg Thukpa',
    'dish.bamboo-shoot-fry': 'Bamboo Shoot Fry',
    'dish.veg-momo': 'Veg Momo',
    'dish.sticky-rice': 'Sticky Rice',
    'dish.ooti': 'Ooti',

    // ---- 14. Dialogue beats (game/data/dialogue.ts) — keyed on beat id;
    // dialogue.ts's own `lines` arrays stay as-is (every beat has exactly one
    // line today, so they're only ever used for the isLastLine length check,
    // never rendered directly any more — see DialogueBox.tsx). -------------
    'beat.opening': "Some days the tin is empty. Today's one of them.",
    'beat.propPlacement': 'Green ring means you can afford it. Tap one and pick a prop. Red means save up.',
    'beat.stoveLit': "But the stove still lights. That's enough to start.",
    'beat.recipeWidget': 'That scroll up top is the order. Every dish on it walks in this rush. Count them off as you serve.',
    'beat.heatGaugeIntro': 'See the heat on the left? Every rush you survive turns it up a notch. When it hits the flame, the big one walks in. Be ready.',
    'beat.wave1Cleared': "They came back for seconds. Did you see that? It's time to upgrade.",
    'beat.wave4Ready': "New gear, same nerves. Let's find out.",
    'beat.district2': "A real dhaba. Tandoor and all. I'm not dreaming?",
    'beat.district3': 'They want dosa now. My wrist is ready.',
    'beat.district4': "They want Italian. I watched one video. We're fine.",
    'beat.district5': "Smoked chilli. I'll cry through this whole shift.",
    'beat.district6': "I stopped copying recipes. I'm writing them.",
    'beat.district7': 'Two kitchens, one plate. Nobody taught me this.',
    'beat.district8': "This one's mine. Every bit of it.",
    'beat.overtime': 'Every plate tonight had two pairs of hands. Thank you.',
    'beat.continueGranted': 'Back to work. Nobody leaves hungry.',

    // ---- 14a. Dialogue box chrome (ui/DialogueBox.tsx) ---------------------
    'dialogue.continue.aria': 'Continue',
    'dialogue.skip': 'Skip',
    'dialogue.hint': 'tap to continue ▸',

    // ---- 15. End screen (ui/EndScreen.tsx) ---------------------------------
    'end.outcome.newBest': 'Best shift this kitchen has ever seen. Write it on the wall.',
    'end.outcome.matched': 'Matched the record. Next time it falls.',
    'end.outcome.nearBest': {
        one: "{gap} short of the record. The record's getting nervous.",
        other: "{gap} short of the record. The record's getting nervous.",
    },
    'end.outcome.held': {
        one: '{n} rushes held. Nobody at the tapri would believe it.',
        other: '{n} rushes held. Nobody at the tapri would believe it.',
    },
    'end.outcome.early': 'Rough start. The stove still lights tomorrow.',
    'end.header.overtime': 'Full shift held. Overtime rush {n} got you.',
    'end.header.lost': "No escapes left — every dish that slipped past was a customer out the door.",
    'end.rushesHeld': 'Rushes held',
    'end.newBest': 'NEW BEST',
    'end.bestEq': 'best {n} · =',
    'end.bestDelta': 'best {n} · −{d}',
    'end.dishesServed': 'Dishes served',
    'end.gemsEarned': 'Gems earned',
    'end.gemsValue': '+{n} 💎',
    'end.gemsBreakdown': {
        one: '{n} rushes × {g} 💎 each',
        other: '{n} rushes × {g} 💎 each',
    },
    'end.gemsBonus': ' + {n} bonus',
    'end.retry': 'Retry',
    'end.upgradeKitchen': 'Upgrade kitchen',
    'end.menu': 'Menu',
    'end.bonusClaimed': 'Bonus claimed · +{n} 💎',
    'end.doubleIt': 'Double it: +{n} 💎 · Watch an ad',
    'end.adConfirm': {
        one: 'Watch an ad to earn {n} bonus gems?',
        other: 'Watch an ad to earn {n} bonus gems?',
    },
    'end.adsLeft': {
        one: '{r}/{max} ads left today',
        other: '{r}/{max} ads left today',
    },
    'end.adCancel': 'Cancel',
    'end.adLoading': 'Loading…',
    'end.adWatch': 'Watch',
    'ad.name': 'Game over gem bonus',
    'ad.description': {
        one: '{n} bonus gems',
        other: '{n} bonus gems',
    },

    // ---- 16. Ranks (ui/Leaderboard.tsx, sdk/leaderboard.ts) ---------------
    'ranks.title': 'Ranks',
    'ranks.back': '←',
    'ranks.period.today': 'Today',
    'ranks.period.alltime': 'All time',
    'board.dishesServed': 'Dishes served',
    'board.wavesHeld': 'Waves held',
    'ranks.you': 'you',
    'ranks.podiumRank': '#{n}',
    'ranks.bar.loading': 'Loading…',
    'ranks.bar.offline': 'Ranks need the RUN app',
    'ranks.bar.error': 'Could not load your rank',
    'ranks.bar.noRunToday': 'No shift yet today — start one',
    'ranks.bar.unranked': 'Unranked · play a shift',
    'ranks.bar.today': '#{rank} today · {score} {unit}',
    'ranks.bar.alltime': '#{rank} all time · {score} {unit}',
    'ranks.unit.waves': {
        one: 'waves held',
        other: 'waves held',
    },
    'ranks.unit.kills': {
        one: 'dishes served',
        other: 'dishes served',
    },
    'ranks.bar.gap': '{gap} to #{rank}',
    'ranks.bar.resets': 'resets {t}',
    'ranks.resetFormat': '{h}h {m}m',
    'ranks.offline': 'Leaderboards are available in the RUN app.',
    'ranks.error': 'Could not load this board.',
    'ranks.errorHint': 'Check your connection and try again.',
    'ranks.emptyToday': 'Nobody has clocked in today.',
    'ranks.emptyAll': 'No runs on the board yet. Be the first!',
    'ranks.rankMissing': '–',
    // ranks.rankDelta ("▲{n} / ▼{n}") documents both branches as one row in
    // the inventory, but the actual render site (Leaderboard.tsx) branches
    // on sign and renders one literal or the other — split into two real
    // keys so each is unambiguous, added when Round 13 Part 2's Leaderboard
    // wiring pass found the single combined key couldn't be called correctly.
    'ranks.rankDelta.up': '▲{n}',
    'ranks.rankDelta.down': '▼{n}',
    // Round 15 Part 3 (docs/Ideas.md §10.3 pick A): the ⟳ glyph's tap-and-
    // hold toast, on any row/podium card whose entry.continues >= 1.
    'ranks.continued': 'Continued once with an ad.',

    // ---- 17. Engagement toasts (sdk/engagement.ts) -------------------------
    'engage.likeThanks': 'Thanks for the like!',
    'engage.likeUnavailable': 'Not available right now, try again in a moment.',
    'engage.commentsUnavailable': 'Comments are not available right now.',
    'engage.commentsRetry': 'Comments are not available right now, try again in a moment.',

    // ---- 18. Pixi text on the board (game/towerScene.ts) -------------------
    'pixi.coinPopup': '+{n}',
    'pixi.gauge': '{n}/10',
    'pixi.lvUp': 'Lv↑',
    // Round 13 Part 2 correction: strings.md's own table cell shows "→  "
    // (two trailing spaces) but the actual source template literal
    // (towerScene.ts) is `${a} → ` — exactly ONE trailing space. Matched to
    // the real source, not the doc, since pixel parity is what this round's
    // acceptance checks.
    'pixi.preview.dmgFrom': '{a} → ',
    'pixi.preview.dmgTo': '{b} dmg',
    'pixi.preview.rateFrom': '{a} → ',
    'pixi.preview.rateTo': '{b}/s',

    // ---- 19. Recipe scrolls (Round 14 Part 3, ui/MetaUpgrades.tsx) --------
    'kitchen.scrolls.title': 'Recipe scrolls',
    'kitchen.scrolls.count': '{n} / {max} scrolls',
    // No ✦ glyph baked in — same reasoning as bubble.shard above, the
    // ui-shard PNG renders beside this text at 12px (the progress-bar size).
    'kitchen.scrolls.progress': '{n} / {max}',
    'kitchen.scrolls.buy': '💎 {n}',

    // ---- 20. Recipe notes (game/data/recipes.ts) — keyed on dish slug, one
    // line of Ramu's voice, shown on an UNLOCKED scroll card only. ----------
    'recipe.chai.note': 'Boil it twice. Trust me on this one.',
    'recipe.coffee.note': 'Bitter first, sweet after. Like most mornings.',
    'recipe.naan.note': "Slap it, don't stroke it. The tandoor forgives noise.",
    'recipe.jeera-rice.note': 'Toast the cumin till it argues back.',
    'recipe.palak-aloo.note': 'Spinach lies about how much it shrinks. Buy more.',
    'recipe.gobhi-masala.note': 'Char the cauliflower first. Sad florets, happy plate.',
    'recipe.rajma.note': "Soak overnight or don't bother starting.",
    'recipe.coconut-chutney.note': 'Fresh coconut or none. The dried stuff is a rumor.',
    'recipe.idli.note': 'Steam hot, serve hotter. Cold idli is a crime.',
    'recipe.upma.note': 'Roast the rava till the kitchen smells like Sunday.',
    'recipe.sambar.note': 'Tamarind first, patience second.',
    'recipe.beans-poriyal.note': 'Cut small, cook fast. Nobody wants mushy beans.',
    'recipe.pesto.note': "Crush, don't blend. The blender lies about basil.",
    'recipe.minestrone.note': "Whatever's in the fridge. That's the whole recipe.",
    'recipe.arrabbiata.note': 'One chili too few is still one chili too few.',
    'recipe.aglio-e-olio.note': 'Garlic gold, not garlic brown. Watch it like a customer.',
    'recipe.risotto.note': 'Stir until your arm complains. Then stir more.',
    'recipe.veg-thukpa.note': 'Broth first, noodles last. Reverse it and regret it.',
    'recipe.bamboo-shoot-fry.note': 'Rinse it twice. The first rinse is a lie too.',
    'recipe.veg-momo.note': 'Fold it ugly, it still steams the same.',
    'recipe.sticky-rice.note': "Soak it, don't rush it. Rice remembers shortcuts.",
    'recipe.ooti.note': 'The boss dish. Serve it like you mean it.',

    // ---- 21. Continue offer (Round 15, ui/ContinueOffer.tsx) ---------------
    'continue.title': 'Continue the shift?',
    'continue.body': "Ramu's not done. Six more customers' worth of patience, one time only.",
    'continue.adsLeft': {
        one: '{n} ad left today',
        other: '{n} ads left today',
    },
    'continue.watch': '▶ Watch',
    'continue.close': 'Close the kitchen',
    'continue.loading': 'Loading…',
    'continue.adName': 'Continue the shift',
    'continue.adDescription': 'One rewarded continue',
};
