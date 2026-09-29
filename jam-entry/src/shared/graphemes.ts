/**
 * Round 20 Part 3/4 (docs/Ideas.md §10.2 pick A): grapheme-cluster helpers.
 * `slice(0, 16)` and `maxLength={16}` both count UTF-16 code units, not
 * characters — fine for Latin (1 unit/char) but wrong for Devanagari, whose
 * base+matra+virama conjuncts spend 1.6-3.0 units per visible character
 * (measured on device, see this round's own report). A 16-unit cap bought a
 * conjunct-heavy Devanagari name as few as ~5 visible characters against an
 * English speaker's 16, and truncating mid-cluster at a raw code-unit index
 * can strand a combining mark (a dotted-circle glyph) at the cut.
 *
 * `Intl.Segmenter` (grapheme granularity) is the correct primitive — it
 * agrees with what a human calls "one character" for any script, not just
 * Devanagari. It has been available in every evergreen browser since 2021-
 * 2022 (Chrome/Edge 87+, Safari 14.1+, Firefox 125+), which this Vite/React
 * 19 target already assumes elsewhere. The regex fallback below (one base
 * code point, `\P{M}`, plus any trailing combining marks, `\p{M}` repeated)
 * is kept ONLY for an engine without Intl.Segmenter, so neither call site
 * throws.
 */

function segmentGraphemes(s: string): string[] {
    if (typeof Intl !== 'undefined' && typeof (Intl as unknown as { Segmenter?: unknown }).Segmenter === 'function') {
        const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        return Array.from(seg.segment(s), (x) => x.segment);
    }
    // Fallback: base code point + any combining marks (Mn/Mc) that follow it.
    return s.match(/\P{M}\p{M}*/gu) ?? [];
}

/** Number of grapheme clusters ("characters" as a human counts them) in `s`. */
export function graphemeLength(s: string): number {
    return segmentGraphemes(s).length;
}

/** Keeps at most `limit` grapheme clusters — never splits a base character
 *  from its own combining marks, so a cut can't strand a dotted-circle
 *  matra at the boundary the way a raw `.slice(0, n)` can. */
export function clampToGraphemes(s: string, limit: number): string {
    const graphemes = segmentGraphemes(s);
    return graphemes.length <= limit ? s : graphemes.slice(0, limit).join('');
}

/** The first grapheme cluster of `s` (or '' for an empty string) — e.g. the
 *  leaderboard avatar-initial fallback. `.charAt(0)` on "पुनीत" returns just
 *  प (the base consonant, one UTF-16 unit), stranding the ुmatra and
 *  reading as "Pa" instead of "Pu"; this returns "पु" intact. */
export function firstGrapheme(s: string): string {
    return segmentGraphemes(s)[0] ?? '';
}
