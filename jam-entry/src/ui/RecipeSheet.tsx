/**
 * Round 17 Part 3 (docs/Ideas.md §6d "Kitchen relayout + recipe sheet",
 * approved visual https://claude.ai/artifact/QrmaTewse8CEL4KNtchdV7, "B
 * shell + A formatting"): the unlocked-scroll detail sheet — parchment
 * between two walnut rollers, opened from an unlocked card in
 * ui/MetaUpgrades.tsx's Recipes tab. Locked cards buy, never open — this
 * component is only ever mounted for a slug already in save.scrolls, so it
 * never itself checks the unlock state.
 *
 * "Display face": the mock's Fraunces headline face isn't loaded anywhere
 * in this game (no Google Fonts link exists — menu.wordmark.top's own
 * §9 note is that the RAMU wordmark deliberately stays system sans rather
 * than add one). Rather than introduce the first network font dependency
 * for one dish name, the sheet's name uses Tailwind's `font-serif` system
 * stack at weight 900 — same "display" READ (a serif at heavy weight beside
 * a sans body) without the extra request. Flag if this reads wrong.
 */
import { useEffect, useRef, useState } from 'react';
import { MANIFEST } from '../assets/manifest.ts';
import { ingredientNameKey, recipeIngredients, recipeNoteKey } from '../game/data/recipes.ts';
import { hasTranslation, t } from '../i18n/index.ts';
import { useMenuUnit } from './useMenuUnit.ts';

// Same per-file duplicated alias->src lookup MetaUpgrades.tsx/WaveBubble.tsx/
// PostBossPanel.tsx each keep (those files' own doc comments).
const ASSET_SRC = new Map(
    MANIFEST.bundles.flatMap((b) => b.assets).map((a) => [a.alias as string, a.src as string])
);

/** dish-<slug>.png's own opaque bbox on its shared 212x141 canvas — measured
 *  offline across all 22 shipped dishes (same "shipped PNG's own opaque
 *  bbox" posture as Leaderboard.tsx's laurel / MetaUpgrades.tsx's shard
 *  constants). 20 of 22 land at 204-205 x 133-134 (~96%w/~94%h, a ~4px
 *  canvas-padding convention: naan/palak-aloo/rajma/coconut-chutney/upma/
 *  beans-poriyal/risotto/veg-momo at 205x134, the other 12 at 204x133) —
 *  204x133 (the more common of the two, within 1px of the other) is used
 *  below as the one canonical measurement. chai/coffee are real outliers at
 *  75x55 (~35%w/~39%h — the two FTUE/Kitchen-Mode placeholder glyphs, a
 *  different asset lineage) and render smaller here as a direct result:
 *  that's their own drawn content genuinely being smaller, not a scaling
 *  bug. Width-based (not height, like the shard) to match Leaderboard's own
 *  laurel treatment, since this canvas — like the laurel's — is wider than
 *  tall. At the target 46mu opaque width, the full padded image renders
 *  46*(212/204) ≈ 47.8mu wide x 47.8*(141/212) ≈ 31.8mu tall, putting an
 *  opaque bbox of ~46 x ~29.9mu safely inside the 60mu plate disc (worst-
 *  case corner-to-centre ≈ 27.4mu < the plate's 30mu radius). */
const DISH_CANVAS_W = 212;
const DISH_CANVAS_H = 141;
const DISH_OPAQUE_W = 204;
const DISH_TARGET_OPAQUE_W_MU = 46;
const DISH_FULL_W_MU = DISH_TARGET_OPAQUE_W_MU * (DISH_CANVAS_W / DISH_OPAQUE_W);
const DISH_FULL_H_MU = DISH_FULL_W_MU * (DISH_CANVAS_H / DISH_CANVAS_W);

const TILE_W_MU = 42;
const TILE_H_MU = 44;
const TILE_GAP_MU = 5;
const TILES_PER_PAGE = 4;

const TOMATO = '#c8401f';

function prefersReducedMotion(): boolean {
    try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
        return false;
    }
}

/** The rollers' shared walnut-with-brass-caps look — top and bottom are
 *  visually identical, so one component draws both. */
function Roller({ mu }: { mu: number }) {
    return (
        <div
            style={{
                flex: `0 0 ${13 * mu}px`,
                borderRadius: 7 * mu,
                position: 'relative',
                background: 'linear-gradient(180deg, #a06c39, #6d431f 58%, #4f3014)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.55)',
            }}
        >
            <span
                aria-hidden="true"
                style={{
                    position: 'absolute', left: -5 * mu, top: -2.5 * mu, bottom: -2.5 * mu, width: 8 * mu,
                    borderRadius: 4 * mu, background: 'linear-gradient(180deg, #e0b45c, #8a6420)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
                }}
            />
            <span
                aria-hidden="true"
                style={{
                    position: 'absolute', right: -5 * mu, top: -2.5 * mu, bottom: -2.5 * mu, width: 8 * mu,
                    borderRadius: 4 * mu, background: 'linear-gradient(180deg, #e0b45c, #8a6420)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
                }}
            />
        </div>
    );
}

/** The tomato small-caps section heading — "Ingredients · n" and the two
 *  step headings all share this treatment (the handover's own words:
 *  "tomato small-caps headings"). `trailing` is the optional right-aligned
 *  bit (only Ingredients uses it, for the fade/chevron room). */
function SectionLabel({ mu, children }: { mu: number; children: string }) {
    return (
        <div className="flex items-center" style={{ gap: 6 * mu, marginBottom: 5 * mu }}>
            <span
                className="font-black tracking-widest uppercase"
                style={{ fontSize: Math.max(9, 7 * mu), color: TOMATO, whiteSpace: 'nowrap' }}
            >
                {children}
            </span>
            <span aria-hidden="true" style={{ flex: 1, height: 1, backgroundColor: 'rgba(200,64,31,0.28)' }} />
        </div>
    );
}

function StepRow({ mu, n, text }: { mu: number; n: number; text: string }) {
    return (
        <div className="flex items-start" style={{ gap: 6 * mu, marginTop: 5 * mu }}>
            <span
                aria-hidden="true"
                className="flex shrink-0 items-center justify-center font-black"
                style={{
                    width: 13 * mu, height: 13 * mu, borderRadius: '50%', marginTop: mu,
                    backgroundColor: TOMATO, color: '#fff8ec', fontSize: Math.max(9, 7.5 * mu),
                }}
            >
                {n}
            </span>
            <p className="m-0" style={{ fontSize: Math.max(11, 8 * mu), lineHeight: 1.42, color: '#33251a' }}>
                {text}
            </p>
        </div>
    );
}

/**
 * The ingredient rail — a single row that scrolls sideways and never wraps,
 * so a dish's sheet height never depends on its ingredient count (the
 * handover's own acceptance line). Affordances (edge fade + chevron, page
 * dots) render only when there's more than one page (>4 tiles) AND, for the
 * fade/chevron specifically, only on the side there's actually more to
 * scroll to — mirrored fade appears on the left only once the rail has
 * actually been scrolled away from its start.
 */
function IngredientRail({ mu, ingredients }: { mu: number; ingredients: string[] }) {
    const railRef = useRef<HTMLDivElement>(null);
    const [scrollState, setScrollState] = useState({ canLeft: false, canRight: false, page: 0 });
    const showAffordances = ingredients.length > TILES_PER_PAGE;
    const dotsCount = Math.ceil(ingredients.length / TILES_PER_PAGE);

    const updateScrollState = () => {
        const el = railRef.current;
        if (!el) return;
        const canRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
        const canLeft = el.scrollLeft > 1;
        const pageWidth = (TILE_W_MU + TILE_GAP_MU) * mu * TILES_PER_PAGE;
        const page = pageWidth > 0 ? Math.round(el.scrollLeft / pageWidth) : 0;
        setScrollState({ canLeft, canRight, page });
    };

    // Re-measure whenever the tile set or scale changes — a fresh mount
    // (new dish opened) always starts scrolled to the left edge, so this
    // also correctly clears any stale canLeft/page from a previously
    // rendered dish.
    useEffect(() => {
        updateScrollState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ingredients, mu]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        const el = railRef.current;
        if (!el) return;
        const delta = (TILE_W_MU + TILE_GAP_MU) * mu * (e.key === 'ArrowRight' ? 1 : -1);
        el.scrollBy({ left: delta, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    };

    const activeDot = Math.min(dotsCount - 1, Math.max(0, scrollState.page));

    return (
        <div style={{ padding: `0 ${10 * mu}px` }}>
            <SectionLabel mu={mu}>{t('recipe.sheet.ingredients', { n: ingredients.length })}</SectionLabel>
            <div style={{ position: 'relative', margin: `0 -${10 * mu}px 0 0` }}>
                <div
                    ref={railRef}
                    role="list"
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    onScroll={updateScrollState}
                    className="recipe-rail motion-safe:scroll-smooth flex snap-x snap-mandatory overflow-x-auto"
                    style={{ gap: TILE_GAP_MU * mu, paddingBottom: 2 * mu, touchAction: 'pan-x' }}
                >
                    {ingredients.map((alias, i) => (
                        <div
                            key={alias + i}
                            role="listitem"
                            className="flex shrink-0 snap-start flex-col items-center justify-center text-center"
                            style={{
                                width: TILE_W_MU * mu, height: TILE_H_MU * mu,
                                backgroundColor: 'rgba(255,253,245,0.75)',
                                border: '1px solid rgba(122,74,36,0.3)',
                                borderRadius: 7 * mu,
                                padding: `${4 * mu}px ${2 * mu}px ${3 * mu}px`,
                                boxShadow: '0 1px 2px rgba(120,90,40,0.18)',
                            }}
                        >
                            <img
                                src={ASSET_SRC.get(alias)}
                                alt=""
                                className="object-contain"
                                style={{ width: 26 * mu, height: 26 * mu }}
                            />
                            <span
                                className="line-clamp-2 font-extrabold"
                                style={{ fontSize: Math.max(11, 6.5 * mu), color: '#5a4630', marginTop: 2 * mu, lineHeight: 1.14 }}
                            >
                                {t(ingredientNameKey(alias))}
                            </span>
                        </div>
                    ))}
                </div>
                {showAffordances && scrollState.canRight && (
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute', top: 0, bottom: 2 * mu, right: 0, width: 26 * mu, pointerEvents: 'none',
                            background: 'linear-gradient(90deg, rgba(243,230,200,0), rgba(240,224,188,0.96))',
                        }}
                    >
                        <span style={{ position: 'absolute', right: 3 * mu, top: '50%', transform: 'translateY(-62%)', fontSize: 15 * mu, fontWeight: 900, color: '#a07a42' }}>
                            ›
                        </span>
                    </div>
                )}
                {showAffordances && scrollState.canLeft && (
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute', top: 0, bottom: 2 * mu, left: 0, width: 26 * mu, pointerEvents: 'none',
                            background: 'linear-gradient(270deg, rgba(243,230,200,0), rgba(240,224,188,0.96))',
                        }}
                    >
                        <span style={{ position: 'absolute', left: 3 * mu, top: '50%', transform: 'translateY(-62%)', fontSize: 15 * mu, fontWeight: 900, color: '#a07a42' }}>
                            ‹
                        </span>
                    </div>
                )}
            </div>
            {/* Always reserves this row's own height (marginTop + 3*mu),
                whether or not any dot renders inside it — a >4-ingredient
                dish's dots row and a <=4-ingredient dish's empty one must
                take the same vertical space, or the sheet's overall height
                would depend on ingredient count, exactly the thing the
                sideways-scrolling rail exists to prevent (the handover's own
                acceptance line: identical height for a 2- and a
                7-ingredient dish). Caught by testing chai/ooti (7mu of dots
                row) against idli (2 ingredients, no dots) at 360/403/744 —
                first draft only rendered this div when showAffordances,
                which broke exactly that check by ~9px. */}
            <div className="flex justify-center" style={{ gap: 3 * mu, marginTop: 3 * mu, height: 3 * mu }}>
                {showAffordances &&
                    Array.from({ length: dotsCount }).map((_, i) => (
                        <span
                            key={i}
                            aria-hidden="true"
                            style={{
                                width: i === activeDot ? 9 * mu : 3 * mu, height: 3 * mu, borderRadius: 99,
                                backgroundColor: i === activeDot ? 'rgba(122,74,36,0.72)' : 'rgba(122,74,36,0.3)',
                            }}
                        />
                    ))}
            </div>
        </div>
    );
}

export default function RecipeSheet({ slug, onClose }: { slug: string; onClose: () => void }) {
    const mu = useMenuUnit();
    const ingredients = recipeIngredients(slug);
    const dishIcon = ASSET_SRC.get(`dish-${slug}`);
    const name = t(`dish.${slug}`);
    const epigraph = t(recipeNoteKey(slug));
    const prepKey = `recipe.${slug}.prep`;
    const finishKey = `recipe.${slug}.finish`;
    // Part 3's own "Data" note: recipe.<slug>.prep/.finish may not exist yet
    // (the writing pass is a later round) — omit the section entirely
    // rather than render t()'s missing-key echo as a fake placeholder.
    const hasPrep = hasTranslation(prepKey);
    const hasFinish = hasTranslation(finishKey);

    return (
        <div
            className="pointer-events-auto absolute inset-0 z-20 flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(42,29,16,0.4)' }}
            onClick={onClose}
        >
            <div className="flex max-h-[86%] flex-col" style={{ width: 220 * mu }} onClick={(e) => e.stopPropagation()}>
                <Roller mu={mu} />
                <div
                    className="recipe-rail min-h-0 flex-1 overflow-y-auto"
                    style={{
                        color: 'var(--color-chocolate)',
                        padding: `${9 * mu}px 0 ${8 * mu}px`,
                        background:
                            'repeating-linear-gradient(93deg, rgba(150,115,60,0.045) 0 2px, transparent 2px 10px),' +
                            'radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.5), transparent 60%),' +
                            'linear-gradient(162deg, #f7efd8, #e9d7b0)',
                        boxShadow: 'inset 0 0 24px rgba(150,110,50,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
                    }}
                >
                    <div className="text-center" style={{ padding: `0 ${10 * mu}px` }}>
                        <div
                            style={{
                                width: 60 * mu, height: 60 * mu, margin: '0 auto', borderRadius: '50%',
                                background: 'radial-gradient(circle at 38% 32%, #fffdf6, #efe3c8)',
                                boxShadow: '0 2px 6px rgba(90,60,20,0.4), inset 0 0 0 1.5px rgba(122,74,36,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <img
                                src={dishIcon}
                                alt=""
                                className="object-contain"
                                style={{ width: DISH_FULL_W_MU * mu, height: DISH_FULL_H_MU * mu }}
                            />
                        </div>
                        <p className="font-serif font-black" style={{ fontSize: 15 * mu, marginTop: 5 * mu, letterSpacing: '0.01em' }}>
                            {name}
                        </p>
                        <p className="italic" style={{ fontSize: Math.max(11, 7.5 * mu), color: '#6d5b46', marginTop: 2 * mu, lineHeight: 1.32 }}>
                            {epigraph}
                        </p>
                    </div>
                    <div
                        aria-hidden="true"
                        style={{
                            height: 2, margin: `${7 * mu}px ${10 * mu}px 0`,
                            background: 'linear-gradient(90deg, transparent, rgba(122,74,36,0.45) 18%, rgba(122,74,36,0.45) 82%, transparent)',
                        }}
                    />
                    <div style={{ marginTop: 8 * mu }}>
                        <IngredientRail mu={mu} ingredients={ingredients} />
                    </div>
                    {hasPrep && (
                        <div style={{ padding: `0 ${10 * mu}px`, marginTop: 8 * mu }}>
                            <SectionLabel mu={mu}>{t('recipe.sheet.prepHeading')}</SectionLabel>
                            <StepRow mu={mu} n={1} text={t(prepKey)} />
                        </div>
                    )}
                    {hasFinish && (
                        <div style={{ padding: `0 ${10 * mu}px`, marginTop: 8 * mu }}>
                            <SectionLabel mu={mu}>{t('recipe.sheet.finishHeading')}</SectionLabel>
                            <StepRow mu={mu} n={1} text={t(finishKey)} />
                        </div>
                    )}
                </div>
                <Roller mu={mu} />
                <button
                    type="button"
                    aria-label={t('recipe.sheet.closeAria')}
                    className="font-black transition-transform active:scale-95"
                    style={{
                        marginTop: 10 * mu,
                        borderRadius: 7 * mu,
                        backgroundColor: 'var(--color-chocolate)',
                        color: 'var(--color-cream)',
                        fontSize: Math.max(11, 9.5 * mu),
                        padding: `${8 * mu}px 0`,
                        boxShadow: '0 3px 8px rgba(0,0,0,0.45)',
                        minHeight: 44,
                    }}
                    onClick={onClose}
                >
                    {t('recipe.sheet.close')}
                </button>
            </div>
        </div>
    );
}
