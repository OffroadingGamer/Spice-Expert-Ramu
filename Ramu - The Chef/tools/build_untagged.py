# -*- coding: utf-8 -*-
"""Copy every non-Prop sprite into Untagged/, numbered and category-tagged."""
import io, os, re, shutil, sys

BASE = (r"D:\Jobs and Corporate\Portfolio Projects\Game Design\Projects"
        r"\September GameJam\Ramu - The Chef\Art\_sliced\01 - Kitchen Essentials")
DEST = os.path.join(BASE, "Untagged")
SHEET = {"S1": "sheet1", "S2": "sheet2", "S3": "sheet3"}

# Category -> sheet ids.  Order here is the order they are numbered.
CATS = [
    (u"Ingredient", """S2-02 S2-16 S2-18 S2-19 S2-23 S2-24 S2-26 S2-28
        S3-01 S3-03 S3-04 S3-07 S3-09 S3-10 S3-13 S3-15 S3-16 S3-23 S3-24
        S3-33 S3-43 S3-49 S3-50"""),
    (u"Midway",      "S1-07 S1-28 S2-10 S3-08 S3-51"),
    (u"Finished",    "S1-27 S1-31 S1-32 S3-34"),
    (u"Condiment", """S1-08 S1-09 S1-10 S1-11 S1-26 S2-04 S2-09 S2-13 S2-14
        S2-15 S2-29 S3-05 S3-06 S3-17 S3-18 S3-21 S3-22 S3-25 S3-26 S3-27
        S3-28 S3-29 S3-31 S3-38 S3-44 S3-48"""),
    (u"Cooking oil", "S3-19 S3-20"),
    (u"UI prop",     "S3-14 S3-32 S3-35"),
    (u"Effects prop", "S1-34 S2-03 S2-27 S3-36 S3-37 S3-47"),
    (u"Pending",     "S1-23 S1-33 S2-25 S3-02 S3-39 S3-40 S3-41 S3-45 S3-46"),
]

# Prop, for the completeness check only
PROPS = """S1-04 S1-05 S2-38 S2-31 S2-30 S1-17 S1-01 S1-14 S1-20 S2-05 S1-29
    S2-01 S1-03 S2-08 S2-07 S2-06 S2-21 S1-12 S1-18 S1-13 S2-22 S3-12 S1-21
    S2-17 S2-33 S3-11 S1-19 S3-42 S2-20 S2-12 S2-11 S2-32 S2-37 S2-40 S3-30
    S1-15 S1-16 S1-36 S1-02 S2-35 S2-34 S2-36 S1-35 S1-24""".split()
OMIT = "S1-06 S1-22 S1-25 S1-30 S1-37 S2-39".split()

NAMED = re.compile(r"^0*\d+[-. ]?\s*(\D.*)\.png$", re.IGNORECASE)


def source_file(sid):
    sh, num = SHEET[sid[:2]], int(sid[3:])
    pat = re.compile(r"^0*%d(?:[-. ]?\D.*)?\.png$" % num, re.IGNORECASE)
    hits = [f for f in os.listdir(os.path.join(BASE, sh)) if pat.match(f)]
    if len(hits) != 1:
        print("ABORT: %s -> %d matches %s" % (sid, len(hits), hits)); sys.exit(1)
    return sh, hits[0]


# ---- completeness -----------------------------------------------------------
all_ids = []
for _, blob in CATS:
    all_ids += blob.split()
everything = all_ids + PROPS + OMIT
if len(everything) != 128 or len(set(everything)) != 128:
    print("ABORT: %d ids, %d distinct - expected 128/128"
          % (len(everything), len(set(everything))))
    from collections import Counter
    print("dupes:", [k for k, v in Counter(everything).items() if v > 1])
    sys.exit(1)

if os.path.isdir(DEST):
    for f in os.listdir(DEST):
        os.remove(os.path.join(DEST, f))
else:
    os.makedirs(DEST)

rows, n = [], 0
for cat, blob in CATS:
    for sid in blob.split():
        n += 1
        sh, fn = source_file(sid)
        m = NAMED.match(fn)
        label = m.group(1) if m else u""
        out = (u"%02d-%s-%s.png" % (n, cat, label)) if label else \
              (u"%02d-%s.png" % (n, cat))
        shutil.copy2(os.path.join(BASE, sh, fn), os.path.join(DEST, out))
        rows.append((n, cat, sid, fn, out))

lines = [u"# Untagged/ map - every Kitchen Essentials sprite that is NOT a Prop.",
         u"# Numbered 01..%d, grouped by current category. Names carry the" % n,
         u"# category so it can be re-sorted by hand. Keep this file with the folder.",
         u"number,category,sheet_id,source_filename,filename"]
for r in rows:
    lines.append(u"%02d,%s,%s,%s,%s" % r)
io.open(os.path.join(DEST, u"_untagged_map.csv"), "w",
        encoding="utf-8", newline="\n").write(u"\n".join(lines) + u"\n")

print(u"copied %d files into Untagged/\n" % n)
last = None
for num, cat, sid, fn, out in rows:
    if cat != last:
        print(u"\n  -- %s --" % cat); last = cat
    print(u"  %s   (%s)" % (out, sid))
