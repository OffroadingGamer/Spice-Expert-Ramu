# -*- coding: utf-8 -*-
"""Slice the three Kitchen Essentials sheets into individual numbered items,
and build numbered contact sheets for identification.

Output lands in Art/_sliced/, which is inside the gitignored Art/ tree.
"""
import io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

ROOT = r"D:\Jobs and Corporate\Portfolio Projects\Game Design\Projects\September GameJam\Ramu - The Chef\Art"
SRC = os.path.join(ROOT, "01 - Kitchen Essentials")
OUT = os.path.join(ROOT, "_sliced")

SHEETS = [
    ("sheet1", "kitchen sprite_16x16_No-1-37.png"),
    ("sheet2", "kitchen sprite_16x16_No-2-40.png"),
    ("sheet3", "kitchen sprite_16x16_No-3-51.png"),
]

MIN_PART_AREA = 60      # drop specks before merging
MIN_ITEM_AREA = 200     # drop merged boxes that are still tiny
MERGE_MARGIN = 10       # boxes within this many px of each other are one item
MAX_GAP_INK = 12        # a cut column with more ink than this is not a gap
PAD = 4                 # transparent padding kept around each crop


def boxes_from_mask(mask, dilate=3):
    """Connected components on a lightly dilated mask (to bridge antialiased
    gaps inside one item), with bounding boxes measured on the ORIGINAL mask so
    the crop is tight. No bbox merging -- that glued neighbours together."""
    if dilate > 1:
        grown = ndimage.binary_dilation(mask, np.ones((dilate, dilate), bool))
    else:
        grown = mask
    lab, n = ndimage.label(grown, structure=np.ones((3, 3), int))
    if n == 0:
        return []
    lab = np.where(mask, lab, 0)          # measure on the real pixels only
    objs = ndimage.find_objects(lab)
    areas = ndimage.sum(mask, lab, range(1, n + 1))
    boxes = []
    for i, sl in enumerate(objs):
        if sl is None or areas[i] < MIN_ITEM_AREA:
            continue
        ys, xs = sl
        boxes.append([xs.start, ys.start, xs.stop, ys.stop, float(areas[i])])
    return boxes


def split_wide(boxes, mask):
    """One box on sheet 1 glued two neighbouring items together -- and they
    physically touch, so there is no empty column to cut on. Cut unusually wide
    boxes at the thinnest column in their middle third instead."""
    import statistics
    if not boxes:
        return boxes
    med = statistics.median([b[2] - b[0] for b in boxes])
    out = []
    for b in boxes:
        w = b[2] - b[0]
        if w < med * 1.5:
            out.append(b); continue
        sub = mask[b[1]:b[3], b[0]:b[2]]
        cols = sub.sum(axis=0)
        lo, hi = int(w * 0.30), int(w * 0.70)
        cut_rel = lo + int(np.argmin(cols[lo:hi]))
        if cols[cut_rel] > MAX_GAP_INK:      # solid there -> one real object
            out.append(b); continue
        cut = b[0] + cut_rel
        parts = []
        for x0, x1 in ((b[0], cut), (cut, b[2])):
            part = mask[b[1]:b[3], x0:x1]
            if part.sum() < MIN_ITEM_AREA:
                parts = []; break
            ys = np.where(part.any(axis=1))[0]
            xs = np.where(part.any(axis=0))[0]
            parts.append([x0 + xs[0], b[1] + ys[0], x0 + xs[-1] + 1,
                          b[1] + ys[-1] + 1, float(part.sum())])
        if parts:
            print("    split a %dpx box at col %d (ink there: %d px)"
                  % (w, cut_rel, cols[cut_rel]))
            out.extend(parts)
        else:
            out.append(b)
    return out


def reading_order(boxes):
    """Sort top-to-bottom in row bands, then left-to-right inside each band."""
    if not boxes:
        return []
    heights = [b[3] - b[1] for b in boxes]
    band = max(24, int(np.median(heights) * 0.55))
    rows, cur = [], []
    for b in sorted(boxes, key=lambda b: (b[1] + b[3]) / 2.0):
        cy = (b[1] + b[3]) / 2.0
        if cur and cy - (cur[0][1] + cur[0][3]) / 2.0 > band:
            rows.append(cur); cur = []
        cur.append(b)
    if cur:
        rows.append(cur)
    ordered = []
    for r in rows:
        ordered.extend(sorted(r, key=lambda b: b[0]))
    return ordered


def load_font(size):
    for name in ("arialbd.ttf", "seguisb.ttf", "arial.ttf", "segoeui.ttf"):
        try:
            return ImageFont.truetype(r"C:\Windows\Fonts\\" + name, size)
        except Exception:
            pass
    return ImageFont.load_default()


def contact_sheets(tag, crops, names=None, cols=4, rows=5, cell=240, label_h=34):
    """Build paged contact sheets. names=None -> numbers only."""
    font_n = load_font(22)
    font_t = load_font(19)
    per = cols * rows
    pages = []
    for start in range(0, len(crops), per):
        chunk = crops[start:start + per]
        W = cols * cell
        H = ((len(chunk) + cols - 1) // cols) * (cell + label_h)
        page = Image.new("RGB", (W, H), (238, 236, 232))
        d = ImageDraw.Draw(page)
        for i, (num, img) in enumerate(chunk):
            cx, cy = (i % cols) * cell, (i // cols) * (cell + label_h)
            d.rectangle([cx, cy, cx + cell - 1, cy + cell + label_h - 1],
                        outline=(198, 194, 188))
            th = img.copy()
            th.thumbnail((cell - 24, cell - 24), Image.LANCZOS)
            page.paste(th, (cx + (cell - th.width) // 2,
                            cy + (cell - th.height) // 2), th)
            label = "%02d" % num
            d.text((cx + 8, cy + 6), label, font=font_n, fill=(180, 60, 20))
            if names:
                nm = names.get(num, "")
                d.text((cx + 8, cy + cell + 6), nm[:26], font=font_t,
                       fill=(30, 30, 34))
        p = os.path.join(OUT, "CONTACT_%s_%02d.png" % (tag, len(pages) + 1))
        page.save(p)
        pages.append(p)
    return pages


def main():
    names_by_sheet = {}
    if len(sys.argv) > 1:  # pass 2: bake names in
        with io.open(sys.argv[1], encoding="utf-8") as f:
            names_by_sheet = json.load(f)

    if not os.path.isdir(OUT):
        os.makedirs(OUT)
    manifest = {}
    for tag, fn in SHEETS:
        im = Image.open(os.path.join(SRC, fn)).convert("RGBA")
        arr = np.array(im)
        mask = arr[..., 3] > 8
        boxes = reading_order(split_wide(boxes_from_mask(mask), mask))

        d = os.path.join(OUT, tag)
        if not os.path.isdir(d):
            os.makedirs(d)

        crops, entries = [], []
        for i, b in enumerate(boxes, 1):
            x0 = max(0, b[0] - PAD); y0 = max(0, b[1] - PAD)
            x1 = min(im.width, b[2] + PAD); y1 = min(im.height, b[3] + PAD)
            crop = im.crop((x0, y0, x1, y1))
            crop.save(os.path.join(d, "%02d.png" % i))
            crops.append((i, crop))
            entries.append({"n": i, "box": [int(x0), int(y0), int(x1), int(y1)],
                            "w": int(x1 - x0), "h": int(y1 - y0)})

        nm = {int(k): v for k, v in names_by_sheet.get(tag, {}).items()} or None
        pages = contact_sheets(tag, crops, names=nm)
        manifest[tag] = {"source": fn, "count": len(boxes), "items": entries}
        print("%s: %d items -> %s  (%d contact pages)" % (
            tag, len(boxes), d, len(pages)))

    with io.open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
        f.write(json.dumps(manifest, indent=1))
    print("manifest written")


main()
