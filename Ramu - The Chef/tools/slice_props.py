# -*- coding: utf-8 -*-
"""Recolour the Kitchen Props pack onto the Kitchen Essentials palette, then
slice its four sheets into individually numbered items.

Companion to tools/slice_sheets.py, which does the same job for Kitchen
Essentials. Two things make this pack a different problem:

  RECOLOUR. Props is a strict 57-colour palette with binary alpha; Essentials
  has ~450k distinct colours, so there is no discrete palette to quantise onto
  and the transfer has to be statistical. See build_lut() -- the mapping is one
  colour in, one colour out, so every sprite keeps its exact shading and its
  crisp pixel edges.

  SEGMENTATION. Props is 32px isometric art laid out as *runs of touching
  tiles*. Sixteen cabinets share their edges and label as one 512px component,
  with no empty column to cut on. See split_runs() -- runs are found by the
  periodicity of the ink profile, not by the depth of its valleys, because
  valley-cutting also slices chairs in half at the waist.

Output lands in Art/_sliced/02 - Kitchen Props/, inside the gitignored Art/
tree, so none of it is committed.

    python tools/slice_props.py                       # pass 1, numbers only
    python tools/slice_props.py tools/prop-names.json # pass 2, names baked in
"""
import io
import json
import os
import sys
import glob

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    "Art")
ESS_DIR = os.path.join(ROOT, "01 - Kitchen Essentials")
SRC = os.path.join(ROOT, "02 - Kitchen Props")
OUT = os.path.join(ROOT, "_sliced", "02 - Kitchen Props")

SHEETS = [
    ("kp1", "pack props.png", "the pack proper -- every atomic prop"),
    ("kp2", "CombinationsAsset.png", "pre-assembled combinations"),
    ("kp3", "Combination Kitchen Counter.png", "counter assembly diagram"),
    ("kp4", "Combination Tables.png", "table assembly diagram"),
]

# ----------------------------------------------------------------- recolour
HUE_KEEP = 1.35          # gain on a colour's hue offset from its own pack norm
L_LO, L_HI = 6.0, 90.0   # target lightness span (props spans ~9.8 .. 87.3)

# ------------------------------------------------------------- segmentation
MIN_AREA = 25       # a mug is about 10x12; below this is a speck
MIN_PERIOD = 10     # no tile in this pack is narrower than this
AC_MIN = 0.55       # autocorrelation a profile needs to count as a tile run
K_TOL = 0.10        # box length must be within this of a whole number of tiles
MERGE_OVERLAP = 0.30
PAD = 0             # binary alpha, so no antialiasing bleed to pad for


# ======================================================================= LAB
_M = np.array([[0.4124564, 0.3575761, 0.1804375],
               [0.2126729, 0.7151522, 0.0721750],
               [0.0193339, 0.1191920, 0.9503041]])
_MI = np.linalg.inv(_M)
_WP = np.array([0.95047, 1.00000, 1.08883])
_D = 6.0 / 29.0


def rgb2lab(rgb):
    c = np.asarray(rgb, float) / 255.0
    lin = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    xyz = lin @ _M.T / _WP
    f = np.where(xyz > _D ** 3, np.cbrt(xyz), xyz / (3 * _D * _D) + 4.0 / 29.0)
    return np.stack([116 * f[..., 1] - 16,
                     500 * (f[..., 0] - f[..., 1]),
                     200 * (f[..., 1] - f[..., 2])], -1)


def lab2rgb(lab):
    fy = (lab[..., 0] + 16) / 116.0
    f = np.stack([fy + lab[..., 1] / 500.0, fy, fy - lab[..., 2] / 200.0], -1)
    xyz = np.where(f > _D, f ** 3, 3 * _D * _D * (f - 4.0 / 29.0)) * _WP
    lin = np.clip(xyz @ _MI.T, 0.0, 1.0)
    s = np.where(lin <= 0.0031308, lin * 12.92,
                 1.055 * (lin ** (1 / 2.4)) - 0.055)
    return np.clip(s * 255.0, 0, 255)


def _opaque(path):
    a = np.array(Image.open(path).convert("RGBA"))
    return a[a[..., 3] > 200][:, :3].astype(float)


_GRID = np.arange(0, 101, 2.0)


def _neutral_ramp(lab):
    """Mean a, b and chroma of the LOW-CHROMA half of `lab` at each lightness.

    Using every pixel skews a* negative in the highlights, because the sage
    greens of the Essentials pack live up there, and that tints white ceramic a
    sickly green. Neutral has to mean neutral.
    """
    L = lab[:, 0]
    C = np.hypot(lab[:, 1], lab[:, 2])
    out = np.zeros((len(_GRID), 3))
    for i, x in enumerate(_GRID):
        m = np.where(np.abs(L - x) < 9.0)[0]
        if len(m) < 30:
            m = np.argsort(np.abs(L - x))[:400]
        keep = m[C[m] <= np.median(C[m])]
        out[i] = lab[keep, 1].mean(), lab[keep, 2].mean(), C[keep].mean()
    return out


def build_lut(verbose=True):
    """A colour-for-colour map carrying Props onto the Essentials character.

    What gets matched is Essentials' lightness -> hue ramp: near-neutral darks
    warming to b* +14 at the highlights. Props ships the opposite convention,
    blue-purple shadows at b* -9.7, and that is the single biggest mismatch
    between the two packs.

    Lightness gets only a gentle monotone stretch, never a histogram match. A
    full match drags the props midtones far darker, because Essentials is small
    outlined objects (lots of dark pixels) while Props is large furniture faces.
    That is a difference of content, not of palette.
    """
    ess_lab = rgb2lab(np.concatenate(
        [_opaque(p) for p in sorted(glob.glob(os.path.join(ESS_DIR, "*.png")))]))

    counts = {}
    for p in sorted(glob.glob(os.path.join(SRC, "*.png"))):
        u, c = np.unique(_opaque(p).astype(int).reshape(-1, 3), axis=0,
                         return_counts=True)
        for t, n in zip(map(tuple, u), c):
            counts[t] = counts.get(t, 0) + int(n)
    pal = np.array(sorted(counts), float)
    w = np.array([counts[tuple(map(int, c))] for c in pal], float)
    pal_lab = rgb2lab(pal)

    ess_ramp = _neutral_ramp(ess_lab)
    prp_ramp = _neutral_ramp(pal_lab)
    at = lambda r, L, k: np.interp(L, _GRID, r[:, k])

    spread = np.repeat(pal_lab[:, 0], np.maximum(w // 20, 1).astype(int))
    lo, hi = np.percentile(spread, [1, 99])
    Lnew = np.clip(L_LO + (pal_lab[:, 0] - lo) * (L_HI - L_LO) / (hi - lo), 0, 100)

    # each colour keeps its hue *identity* -- its offset from its own pack's
    # neutral norm -- so plants stay green and jars stay blue; only the base
    # they sit on moves.
    da = pal_lab[:, 1] - at(prp_ramp, pal_lab[:, 0], 0)
    db = pal_lab[:, 2] - at(prp_ramp, pal_lab[:, 0], 1)
    na = at(ess_ramp, Lnew, 0) + HUE_KEEP * da
    nb = at(ess_ramp, Lnew, 1) + HUE_KEEP * db

    new = np.round(lab2rgb(np.stack([Lnew, na, nb], -1))).astype(int)
    if verbose:
        print("palette: %d colours -> %d distinct (%d collisions)"
              % (len(pal), len(set(map(tuple, new))),
                 len(pal) - len(set(map(tuple, new)))))
    return pal.astype(int), new


def recolour(im, src, dst):
    """Exact colour-for-colour substitution -- no nearest-neighbour, no dither."""
    a = np.array(im.convert("RGBA"))
    rgb = a[..., :3].astype(np.int32)
    key = np.full(1 << 24, -1, np.int32)
    key[(src[:, 0] << 16) | (src[:, 1] << 8) | src[:, 2]] = np.arange(len(src))
    idx = key[(rgb[..., 0] << 16) | (rgb[..., 1] << 8) | rgb[..., 2]]
    hit = idx >= 0
    a[..., :3][hit] = dst[idx[hit]].astype(np.uint8)
    miss = int((~hit & (a[..., 3] > 0)).sum())
    return Image.fromarray(a), miss


# ============================================================== segmentation
def components(mask, dilate=1):
    grown = (ndimage.binary_dilation(mask, np.ones((dilate, dilate), bool))
             if dilate > 1 else mask)
    lab, n = ndimage.label(grown, structure=np.ones((3, 3), int))
    if n == 0:
        return []
    lab = np.where(mask, lab, 0)
    areas = ndimage.sum(mask, lab, range(1, n + 1))
    out = []
    for i, sl in enumerate(ndimage.find_objects(lab)):
        if sl is None or areas[i] < MIN_AREA:
            continue
        ys, xs = sl
        out.append([xs.start, ys.start, xs.stop, ys.stop, float(areas[i])])
    return out


def _period(profile):
    """(period, tile count, score) if the profile is a run of tiles, else None."""
    n = len(profile)
    if n < 2 * MIN_PERIOD:
        return None
    x = profile - profile.mean()
    ac = np.correlate(x, x, "full")[n - 1:]
    if ac[0] <= 0:
        return None
    ac = ac / ac[0]
    best = None
    for p in range(MIN_PERIOD, n // 2 + 1):
        k = n / float(p)
        if abs(k - round(k)) > K_TOL or round(k) < 2 or ac[p] < AC_MIN:
            continue
        if best is None or ac[p] > best[2]:
            best = (p, int(round(k)), float(ac[p]))
    return best


def _seams(profile, k):
    """Even divisions on the detected grid -- deliberately NOT nudged to the
    nearest ink minimum.

    Two isometric tiles interlock diagonally, so their bounding boxes overlap
    and the column with the least ink is a few pixels off the grid line.
    Snapping to it shifts every cut, and each crop then carries a 4px sliver of
    its neighbour. These runs are tilesets on an exact 32px pitch, so the grid
    line is the right cut and the minimum is a decoy.
    """
    n = len(profile)
    return [int(round(i * n / float(k))) for i in range(1, k)]


def _tighten(mask, x0, y0, x1, y1, axis=None):
    """Shrink a box to its ink. `axis` pins the split axis to the grid cell:
    a tile's own art may lean past the cell edge, but the pixels out there
    belong to the neighbour, so the cell boundary has to hold."""
    sub = mask[y0:y1, x0:x1]
    if not sub.any():
        return None
    ys = np.where(sub.any(axis=1))[0]
    xs = np.where(sub.any(axis=0))[0]
    nx0 = x0 if axis == "x" else x0 + xs[0]
    nx1 = x1 if axis == "x" else x0 + xs[-1] + 1
    ny0 = y0 if axis == "y" else y0 + ys[0]
    ny1 = y1 if axis == "y" else y0 + ys[-1] + 1
    return [nx0, ny0, nx1, ny1, float(sub.sum())]


def split_runs(mask, boxes, log=None):
    """Split every box whose ink profile is a periodic run of tiles.

    A generic "cut at the deepest valley" rule fails on this pack: it also cuts
    chairs in half at the waist between seat and legs, and separates plants
    from their pots. What tells a run of tiles from one tall object is not the
    depth of the valley but the periodicity of the profile:

        run of 16 cabinets   columns  p=32 k=16  ac=0.84   -> split
        4 sink counters      columns  p=32 k=4   ac=0.75   -> split
        3 stacked tables     rows     p=32 k=3   ac=0.64   -> split
        one chair            columns             ac=0.19   -> left alone
        one chair            rows                ac=-0.08  -> left alone

    a wide enough separation that the threshold can sit at 0.55.
    """
    out = []
    for b in boxes:
        x0, y0, x1, y1 = b[:4]
        sub = mask[y0:y1, x0:x1]
        colp = sub.sum(axis=0).astype(float)
        rowp = sub.sum(axis=1).astype(float)
        pc, pr = _period(colp), _period(rowp)
        if pc and pr:
            pick = ("x", pc) if pc[2] >= pr[2] else ("y", pr)
        elif pc:
            pick = ("x", pc)
        elif pr:
            pick = ("y", pr)
        else:
            out.append(b)
            continue
        axis, (p, k, score) = pick
        if log is not None:
            log.append("%dx%d -> %2d tiles on %s (period %d, ac %.2f)"
                       % (x1 - x0, y1 - y0, k, axis, p, score))
        prof = colp if axis == "x" else rowp
        end = (x1 - x0) if axis == "x" else (y1 - y0)
        edges = [0] + _seams(prof, k) + [end]
        parts = []
        for a, c in zip(edges, edges[1:]):
            t = (_tighten(mask, x0 + a, y0, x0 + c, y1, "x") if axis == "x"
                 else _tighten(mask, x0, y0 + a, x1, y0 + c, "y"))
            if t is None or t[4] < MIN_AREA:
                parts = None
                break
            parts.append(t)
        out.extend(parts if parts else [b])
    return out


def merge_overlapping(boxes):
    """Fragments of one composition overlap heavily; tiles in a run only clip
    each other by slivers. Runs after splitting, so it also repairs a bad cut."""
    boxes = [list(b) for b in boxes]
    changed = True
    while changed:
        changed = False
        for i in range(len(boxes)):
            for j in range(i + 1, len(boxes)):
                a, b = boxes[i], boxes[j]
                ox = min(a[2], b[2]) - max(a[0], b[0])
                oy = min(a[3], b[3]) - max(a[1], b[1])
                if ox <= 0 or oy <= 0:
                    continue
                mn = min((a[2] - a[0]) * (a[3] - a[1]),
                         (b[2] - b[0]) * (b[3] - b[1]))
                if float(ox * oy) / mn < MERGE_OVERLAP:
                    continue
                a[0], a[1] = min(a[0], b[0]), min(a[1], b[1])
                a[2], a[3] = max(a[2], b[2]), max(a[3], b[3])
                a[4] += b[4]
                boxes.pop(j)
                changed = True
                break
            if changed:
                break
    return boxes


def drop_annotations(im, boxes, max_colors=2, max_area=1200, max_L=30.0):
    """Two of the four sheets are assembly *diagrams*: they carry the words
    PACK / SINGLE / FOR THIS and arrows alongside the tiles. Glyphs and arrows
    are drawn flat in the single dark outline colour; every real sprite is
    shaded and uses at least three.

    Small-and-flat alone is not enough to identify them. It also catches the
    glass window panes on `pack props`, which are one flat colour too -- but a
    pale one, L 86 against the glyphs' L 6. Requiring the flat colour to be
    *dark* separates the two cleanly with nothing in between.
    """
    arr = np.array(im.convert("RGBA"))
    kept, dropped = [], []
    for b in boxes:
        x0, y0, x1, y1 = b[:4]
        sub = arr[y0:y1, x0:x1]
        px = sub[sub[..., 3] > 8][:, :3]
        u = np.unique(px.reshape(-1, 3), axis=0) if len(px) else np.zeros((0, 3))
        flat = 0 < len(u) <= max_colors
        dark = flat and rgb2lab(u.astype(float))[:, 0].max() <= max_L
        if flat and dark and (x1 - x0) * (y1 - y0) <= max_area:
            dropped.append(b)
        else:
            kept.append(b)
    return kept, dropped


def reading_order(boxes):
    """Top-to-bottom in rows, then left-to-right inside each row.

    Rows are grouped by vertical *overlap*, not by centre distance against a
    median-height band. This sheet mixes 12px mugs with 96px chairs, so no
    single band width works: in one row a 52px oven stands beside 96px
    fridges, and a centre-distance rule files them as two rows and numbers
    them out of order.
    """
    if not boxes:
        return []
    rows = []
    for b in sorted(boxes, key=lambda b: b[1]):
        placed = False
        for r in rows:
            top = min(x[1] for x in r)
            bot = max(x[3] for x in r)
            ov = min(bot, b[3]) - max(top, b[1])
            if ov > 0.45 * min(bot - top, b[3] - b[1]):
                r.append(b)
                placed = True
                break
        if not placed:
            rows.append([b])
    rows.sort(key=lambda r: min(x[1] for x in r))
    return [b for r in rows for b in sorted(r, key=lambda b: b[0])]


# ============================================================ contact sheets
def load_font(size):
    for name in ("arialbd.ttf", "seguisb.ttf", "arial.ttf", "segoeui.ttf"):
        try:
            return ImageFont.truetype(os.path.join(r"C:\Windows\Fonts", name), size)
        except Exception:
            pass
    return ImageFont.load_default()


def contact_sheets(tag, crops, names=None, cols=6, rows=5, cell=190, label_h=30):
    """Paged contact sheets. These tiles are 20-60px, so they are upscaled
    NEAREST -- LANCZOS would blur exactly the pixel grid you need to read."""
    font_n, font_t = load_font(20), load_font(16)
    per = cols * rows
    pages = []
    for start in range(0, len(crops), per):
        chunk = crops[start:start + per]
        W = cols * cell
        H = ((len(chunk) + cols - 1) // cols) * (cell + label_h)
        page = Image.new("RGB", (W, H), (238, 236, 232))
        d = ImageDraw.Draw(page)
        for i, (num, img) in enumerate(chunk):
            cx = (i % cols) * cell
            cy = (i // cols) * (cell + label_h)
            d.rectangle([cx, cy, cx + cell - 1, cy + cell + label_h - 1],
                        outline=(198, 194, 188))
            k = max(1, min((cell - 30) // max(img.width, 1),
                           (cell - 30) // max(img.height, 1)))
            th = img.resize((img.width * k, img.height * k), Image.NEAREST)
            page.paste(th, (cx + (cell - th.width) // 2,
                            cy + (cell - th.height) // 2), th)
            d.text((cx + 7, cy + 5), "%02d" % num, font=font_n, fill=(180, 60, 20))
            if names:
                d.text((cx + 7, cy + cell + 6), names.get(num, "")[:24],
                       font=font_t, fill=(30, 30, 34))
        p = os.path.join(OUT, "CONTACT_%s_%02d.png" % (tag, len(pages) + 1))
        page.save(p)
        pages.append(p)
    return pages


# ======================================================================= main
def main():
    names_by_sheet = {}
    if len(sys.argv) > 1:                      # pass 2: bake names in
        with io.open(sys.argv[1], encoding="utf-8") as f:
            names_by_sheet = json.load(f)

    rec_dir = os.path.join(OUT, "_recoloured")
    for d in (OUT, rec_dir):
        if not os.path.isdir(d):
            os.makedirs(d)

    # Purge previous output first. Without this a run that produces FEWER items
    # than the last leaves the extras on disk, and they look like real results.
    stale = glob.glob(os.path.join(OUT, "CONTACT_*.png"))
    stale += glob.glob(os.path.join(rec_dir, "*.png"))
    for tag, _, _ in SHEETS:
        stale += glob.glob(os.path.join(OUT, tag, "*.png"))
    for f in stale:
        os.remove(f)
    if stale:
        print("purged %d file(s) from the previous run" % len(stale))

    src, dst = build_lut()
    manifest = {"palette": {"%02x%02x%02x" % tuple(a): "%02x%02x%02x" % tuple(b)
                            for a, b in zip(src, dst)}, "sheets": {}}

    for tag, fn, blurb in SHEETS:
        im, miss = recolour(Image.open(os.path.join(SRC, fn)), src, dst)
        im.save(os.path.join(rec_dir, fn))
        arr = np.array(im)
        mask = arr[..., 3] > 8

        log = []
        boxes = components(mask, 1)
        n_raw = len(boxes)
        boxes = merge_overlapping(split_runs(mask, boxes, log))
        boxes, dropped = drop_annotations(im, boxes)
        boxes = reading_order(boxes)

        d = os.path.join(OUT, tag)
        if not os.path.isdir(d):
            os.makedirs(d)

        crops, entries = [], []
        # zero-pad to the sheet's own width, so a plain glob sorts correctly
        # even on the sheets that run past 99
        wid = max(2, len(str(len(boxes))))
        for i, b in enumerate(boxes, 1):
            x0, y0 = max(0, b[0] - PAD), max(0, b[1] - PAD)
            x1, y1 = min(im.width, b[2] + PAD), min(im.height, b[3] + PAD)
            crop = im.crop((x0, y0, x1, y1))
            crop.save(os.path.join(d, "%0*d.png" % (wid, i)))
            crops.append((i, crop))
            entries.append({"n": i, "box": [int(x0), int(y0), int(x1), int(y1)],
                            "w": int(x1 - x0), "h": int(y1 - y0)})

        nm = {int(k): v for k, v in names_by_sheet.get(tag, {}).items()} or None
        pages = contact_sheets(tag, crops, names=nm)
        manifest["sheets"][tag] = {"source": fn, "note": blurb,
                                   "count": len(boxes), "unmapped_px": miss,
                                   "items": entries}
        print("%s  %-32s %3d components -> %3d items  (%d annotations dropped,"
              " %d contact pages)" % (tag, fn, n_raw, len(boxes), len(dropped),
                                      len(pages)))
        for line in log:
            print("      split %s" % line)

    with io.open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
        f.write(json.dumps(manifest, indent=1))
    print("manifest written -> %s" % os.path.join(OUT, "manifest.json"))


main()
