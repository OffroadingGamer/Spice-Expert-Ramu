# -*- coding: utf-8 -*-
"""Read-only: what is actually in props/ now, matched back to source by content."""
import hashlib, os, re, sys

BASE = (r"D:\Jobs and Corporate\Portfolio Projects\Game Design\Projects"
        r"\September GameJam\Ramu - The Chef\Art\_sliced\01 - Kitchen Essentials")
D = os.path.join(BASE, "props")
SHEETS = ("sheet1", "sheet2", "sheet3")
SID = {"sheet1": "S1", "sheet2": "S2", "sheet3": "S3"}
NUM = re.compile(r"^0*(\d+)(?:[-. ].*)?\.png$", re.IGNORECASE)

# what props/ held after the last sort, as sheet ids
PREV = """S1-04 S1-05 S2-38 S2-31 S2-30 S1-17 S1-20 S1-03 S2-08 S2-07 S1-18 S2-22
S3-12 S1-21 S2-17 S2-33 S3-11 S1-19 S3-42 S2-20 S2-12 S2-11 S2-32 S2-37 S2-40
S2-06 S1-15 S1-16 S1-02 S2-35 S2-34 S2-36 S2-05 S1-14 S1-01 S1-24 S2-21 S1-12
S1-13 S1-23 S1-29 S1-33 S1-35 S1-36 S2-01 S2-25 S2-39 S3-02 S3-39 S3-40 S3-41
S3-45 S3-46""".split()


def h(p):
    with open(p, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()


src, dupes = {}, set()
for sh in SHEETS:
    for fn in os.listdir(os.path.join(BASE, sh)):
        m = NUM.match(fn)
        if not (fn.lower().endswith(".png") and m):
            continue
        d = h(os.path.join(BASE, sh, fn))
        if d in src:
            dupes.add(d)
        src[d] = (sh, int(m.group(1)), fn)

files = sorted(f for f in os.listdir(D) if f.lower().endswith(".png"))
rows, unmatched = [], []
for fn in files:
    d = h(os.path.join(D, fn))
    if d in dupes:
        rows.append((fn, u"AMBIGUOUS", u""))
    elif d in src:
        sh, num, srcfn = src[d]
        rows.append((fn, u"%s-%02d" % (SID[sh], num), srcfn))
    else:
        rows.append((fn, u"NO-MATCH", u""))
        unmatched.append(fn)

print("props/ holds %d png files\n" % len(files))
print("%-46s  %-10s  %s" % ("file", "sheet id", "source name"))
print("-" * 110)
for fn, sid, srcfn in rows:
    print("%-46s  %-10s  %s" % (fn, sid, srcfn))

now = set(r[1] for r in rows if r[1] not in ("NO-MATCH", "AMBIGUOUS"))
prev = set(PREV)
print("\nADDED since last sort   : %s" % (sorted(now - prev) or "none"))
print("REMOVED since last sort : %s" % (sorted(prev - now) or "none"))
if unmatched:
    print("\nNO SOURCE MATCH (pixels differ from every sheet file):")
    for fn in unmatched:
        print("   %s" % fn)

extras = [f for f in os.listdir(D) if not f.lower().endswith(".png")]
print("\nnon-png files present: %s" % (extras or "none"))
