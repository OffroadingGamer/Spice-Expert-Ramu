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

    // ---- 19b. Kitchen tabs + recipe sheet (Round 17, docs/Ideas.md §6d
    // "Kitchen relayout + recipe sheet") -------------------------------------
    'kitchen.tab.stations': 'Stations',
    'kitchen.tab.recipes': 'Recipes',
    // "Ingredients · {n}" — the rail's own label, count appended live so it
    // can never drift from the tile count actually rendered.
    'recipe.sheet.ingredients': 'Ingredients · {n}',
    'recipe.sheet.prepHeading': 'Prep',
    'recipe.sheet.finishHeading': 'Garnish & Cooking',
    'recipe.sheet.close': 'Close',
    'recipe.sheet.closeAria': 'Close recipe',

    // ---- 19c. Ingredient names (game/data/recipes.ts's RECIPE_INGREDIENTS,
    // ui/RecipeSheet.tsx's rail tiles) — keyed on the bare ingredient key
    // (ingredientNameKey strips the ing- alias prefix), translated once each
    // regardless of how many dishes reference the same ingredient. --------
    'ingredient.milk': 'Milk',
    'ingredient.ginger': 'Ginger',
    'ingredient.tea-leaf': 'Tea Leaf',
    'ingredient.coffee-extract': 'Coffee Decoction',
    'ingredient.cream': 'Cream',
    'ingredient.rice': 'Rice',
    'ingredient.ghee': 'Ghee',
    'ingredient.aubergine': 'Aubergine',
    'ingredient.bay-leaf': 'Bay Leaf',
    'ingredient.cardamom': 'Cardamom',
    'ingredient.cauliflower': 'Cauliflower',
    'ingredient.chilli-flakes': 'Chilli Flakes',
    'ingredient.clove': 'Clove',
    'ingredient.coconut-half': 'Coconut',
    'ingredient.coriander-seed': 'Coriander Seed',
    'ingredient.cumin-seed': 'Cumin Seed',
    'ingredient.curry-leaf': 'Curry Leaf',
    'ingredient.dried-red-chilli': 'Dried Red Chilli',
    'ingredient.green-chilli': 'Green Chilli',
    'ingredient.kidney-beans': 'Kidney Beans',
    'ingredient.mustard-seed': 'Mustard Seed',
    'ingredient.onion': 'Onion',
    'ingredient.oregano': 'Oregano',
    'ingredient.parsley': 'Parsley',
    'ingredient.peas': 'Peas',
    'ingredient.pine-nut': 'Pine Nut',
    'ingredient.potato': 'Potato',
    'ingredient.toor-dal': 'Toor Dal',
    'ingredient.turmeric': 'Turmeric',
    'ingredient.urad-dal': 'Urad Dal',
    'ingredient.flour': 'Flour',
    'ingredient.garlic': 'Garlic',
    'ingredient.tomato': 'Tomato',

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

    // ---- 20b. Recipe steps (Round 18 Part 2, docs/i18n/recipes.md §3) —
    // Prep then Garnish & Cooking, one paragraph each, keyed on dish slug.
    // Copied verbatim from that doc's English column; RecipeSheet.tsx builds
    // the keys inline as `recipe.${slug}.prep`/`.finish` and hasTranslation()
    // already gates both sections on these existing, so no other wiring is
    // needed now that they're here.
    'recipe.chai.prep': 'Crush the ginger with the back of the knife, never a grater. Cardamom and clove go in whole. Water on a high flame, spices in first, and let it go dark before a single tea leaf touches it.',
    'recipe.chai.finish': 'Milk in, sugar in, bring it up a second time. Once is tea. Twice is chai. Pull it high between two glasses so it sits down with a head on it, then strain it hot. Warm chai is an insult.',
    'recipe.coffee.prep': 'Decoction first. Grounds packed tight in the filter, hot water on top, then leave it alone. An hour if you have one. Rush it and you get brown water, and the customer will know before you do.',
    'recipe.coffee.finish': 'Boil the milk, do not just warm it. Decoction in the tumbler, milk over, sugar last. Pour it between tumbler and davara until it froths. The bitter lands first and the sweet catches up.',
    'recipe.naan.prep': 'Flour in the thali, warm milk into the middle, work it until the dough stops fighting back. Ghee on your palms at the end. Cover it and give it two hours. Dough has never once been in a hurry.',
    'recipe.naan.finish': 'Pull it into shape by hand, press the cumin in, wet one side. Slap it onto the tandoor wall and let it make noise. Thirty seconds, no more. Off with the hook, ghee brushed on while it steams.',
    'recipe.jeera-rice.prep': 'Wash the rice until the water runs clear, then soak it twenty minutes. Ghee hot in the pot, cumin in, bay leaf, a slit green chilli. Wait for the cumin to crackle and darken. That is the dish talking.',
    'recipe.jeera-rice.finish': 'Drained rice in, turned gently so the grains stay whole. Water at one and a half times, salt, lid on, flame low. When it is done, fork it loose and let the steam out. Coriander on top, nothing else.',
    'recipe.palak-aloo.prep': 'Potato in thick cubes, fried in ghee until the edges go gold, then lift them out. Cumin into the same ghee, onion after, garlic, green chilli. Turmeric goes in off the flame or it turns bitter.',
    'recipe.palak-aloo.finish': 'Spinach in by the fistful. It looks like far too much and it never is, so keep feeding it. When it collapses, potato back in, lid on, five minutes. Serve it loose. Dry palak aloo is a wasted bunch.',
    'recipe.gobhi-masala.prep': 'Cauliflower in big florets. Dry skillet, no oil, no stirring, and let one side go black before you touch it. Char first, always. Out of the pan and set aside while you build the masala.',
    'recipe.gobhi-masala.finish': 'Oil, cumin, onion until the edges brown. Ginger, tomato, coriander and turmeric, cooked until the oil comes back up. Cauliflower in, coated, lid on low for five. It should still hold its shape.',
    'recipe.rajma.prep': 'Beans into water the night before. Not two hours, not hot water, the night before. Next morning they should give way between two fingers before you have cooked anything at all.',
    'recipe.rajma.finish': 'Onion browned properly in ghee, garlic and ginger, tomato and coriander, until it leaves the oil at the sides. Beans in with their water, pressure cook, then mash a few against the pot. That is the gravy.',
    'recipe.coconut-chutney.prep': 'Fresh coconut, split and grated. The dried stuff is not the same thing and I will not argue about it. Grind it coarse with green chilli, ginger, a little water and salt. Stop before it turns to paste.',
    'recipe.coconut-chutney.finish': 'Tadka in a small pan. Mustard seed first, wait for the popping to finish, then urad dal until it goes gold, dried chilli, curry leaf. Pour it over hot and leave it sitting there. Let them see it.',
    'recipe.idli.prep': 'Rice and urad dal soaked apart, four hours. Dal ground light and smooth, rice ground coarse, then mixed by hand and not by machine. Salt in, and leave it somewhere warm overnight. It rises or nothing happens.',
    'recipe.idli.finish': 'Grease the plates, batter in, never filled to the brim. Twelve minutes in the steamer, then test it with a wet finger. Straight out of the mould onto the plate. Nobody has ever wanted a cold idli.',
    'recipe.upma.prep': 'Rava into a dry pan on a low flame and keep it moving. It goes from pale to smelling like a Sunday kitchen, and that smell is your mark. Off the heat before it takes colour. Burnt rava cannot be rescued.',
    'recipe.upma.finish': 'Ghee, mustard seed, urad dal, curry leaf, green chilli, ginger, onion until soft. Water at twice the rava, salt, bring it up. Rava in with one hand while the other keeps stirring. Lid on, low, five minutes.',
    'recipe.sambar.prep': 'Tamarind into warm water before you do anything else, and let it sit. Toor dal with turmeric in the cooker until it falls apart on its own. Squeeze the tamarind out with your hand, throw the fibre away.',
    'recipe.sambar.finish': 'Tamarind water on the flame with onion and tomato until the raw smell goes. Dal in, sambar podi, salt, and let it come together slowly. Tadka of mustard, curry leaf and dried chilli over the top at the end.',
    'recipe.beans-poriyal.prep': 'Beans cut fine and all the same size, the smaller the better. This is the entire job. Do it properly and the cooking takes four minutes. Do it lazily and no amount of cooking will save you.',
    'recipe.beans-poriyal.finish': 'Mustard seed, urad dal, dried chilli and curry leaf in hot oil. Beans in with salt and a splash of water, lid on, high, three minutes. Lid off, grated coconut in, off the flame. They should still bite back.',
    'recipe.pesto.prep': 'Mortar, not machine. Garlic and salt crushed to a paste first, pine nuts worked in after, then basil a handful at a time pressed against the side of the bowl. A blade heats it and the green dies.',
    'recipe.pesto.finish': 'Oil poured in slowly while the pestle keeps moving. Cheese grated in at the end by hand. It should look rough, not smooth. Loosen it with the water the pasta boiled in, never with more oil.',
    'recipe.minestrone.prep': 'Onion, garlic, and whatever vegetable is sitting in the fridge, all cut small and all cut the same. Potato, peas, beans, it does not matter. This dish was invented to finish things off, not to start them.',
    'recipe.minestrone.finish': 'Soften the onion and garlic, tomato in, then stock and the hard vegetables first. Pasta and peas only in the last ten minutes or they go to paste. Oregano early, in the pot. Serve it thick.',
    'recipe.arrabbiata.prep': 'Garlic sliced thin, not crushed. Cold oil, garlic in, low flame. Chilli flakes go in alongside it so the oil takes the heat properly. Put in more than you think. You will still be wanting more later.',
    'recipe.arrabbiata.finish': 'Tomato in, salt, cooked down until a spoon leaves a clean line across the pan. Pasta straight out of the water into the sauce with a spoonful of that water. Parsley last, off the flame.',
    'recipe.aglio-e-olio.prep': 'Garlic sliced thin so every piece cooks at the same speed. Oil barely warm when it goes in, flame kept low, and your eyes on it. Gold is the target. Brown is bitter and there is no fixing bitter.',
    'recipe.aglio-e-olio.finish': 'Chilli flakes in for ten seconds. A ladle of pasta water into the pan, swirled hard until the oil and water stop fighting each other. Pasta in, tossed, parsley, done. Four things and nowhere to hide.',
    'recipe.risotto.prep': 'Onion cut fine and softened without taking any colour. Rice in dry, turned until the grains go glassy at the edges. Keep the stock hot in a pot beside you. Cold stock hits the rice and stops it dead.',
    'recipe.risotto.finish': 'One ladle of stock, stir, wait until it is gone, next ladle. Twenty minutes of this and your arm will complain. Keep going. Off the flame, cream and cheese beaten in hard, then rest it two minutes.',
    'recipe.veg-thukpa.prep': 'Broth first and do not cut corners here. Garlic, ginger, onion and green chilli in hot oil, tomato after, then water, and let it sit on a low flame the whole time you are cutting vegetables.',
    'recipe.veg-thukpa.finish': 'Vegetables and peas into the broth, salt, two minutes. Noodles at the very last moment, or boiled apart and sitting in the bowl with the broth poured over. Leave them in the pot and the second bowl is glue.',
    'recipe.bamboo-shoot-fry.prep': 'Rinse the shoot, drain it, rinse it again. The first rinse never takes the sourness off whatever the water looks like. Squeeze it dry in your fist, then slice it thin and even.',
    'recipe.bamboo-shoot-fry.finish': 'Mustard oil until it smokes, then onion, garlic, ginger and dried chilli. Shoot in on a high flame and keep it moving, five minutes, until the edges catch. Turmeric and salt, green chilli off the flame.',
    'recipe.veg-momo.prep': 'Flour and water into a stiff dough, rested half an hour. Filling chopped fine and squeezed dry, because water in the filling tears the skin every time. Onion, garlic, ginger, chilli, peas, salt. Raw is fine.',
    'recipe.veg-momo.finish': 'Rolled thin at the edge and thick in the middle. Spoon it in, pleat it however your fingers manage. An ugly momo steams the same as a pretty one. Oiled basket, ten minutes, and do not lift the lid halfway.',
    'recipe.sticky-rice.prep': 'Soak it. Six hours, overnight if the night is yours to spare. There is no fast version of this rice, and whoever told you there was has never sat down and eaten it properly.',
    'recipe.sticky-rice.finish': 'Drain it well, into the basket or the leaf, and steam it over a rolling boil. Twenty five minutes, no stirring, no lifting the lid to look. Turn it out and let the steam leave before you touch it.',
    'recipe.ooti.prep': 'Dried peas soaked overnight, then ground coarse, and the grinding is the part nobody wants to do. Bamboo shoot rinsed and chopped small. Everything after this is slow, and the cooker does most of it.',
    'recipe.ooti.finish': 'Peas, bamboo shoot, onion, ginger, garlic and dried chilli into the cooker with water. Cook it until it thickens enough to stand a spoon in. Greens at the end, salt last, and taste it twice before it goes out.',

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
