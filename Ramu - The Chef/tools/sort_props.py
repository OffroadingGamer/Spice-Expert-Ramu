# -*- coding: utf-8 -*-
"""Sort props/ by family then tier, renumber 01..NN.

FAMILY_PREFIX handles families whose members carry different descriptors -- e.g.
the five Cooktops, which alphabetically would scatter ("& Tandoor", "only oven",
"with Oven", "without flames"). Anything whose base name starts with a listed
prefix is grouped under that prefix and ordered by tier.
"""
import hashlib, io, os, re, sys

BASE = (r"D:\Jobs and Corporate\Portfolio Projects\Game Design\Projects"
        r"\September GameJam\Ramu - The Chef\Art\_sliced\01 - Kitchen Essentials")
D = os.path.join(BASE, "props")
SHEETS = ("sheet1", "sheet2", "sheet3")
SID = {"sheet1": "S1", "sheet2": "S2", "sheet3": "S3"}

# families whose members are named differently but belong together
FAMILY_PREFIX = [u"Cooktop"]

NUM = re.compile(r"^0*(\d+)(?:[-. ].*)?\.png$", re.IGNORECASE)
BARE = re.compile(r"^0*(\d+)\.png$", re.IGNORECASE)
# separator after the number is optional - tolerates "41Cooktop with Oven(...)"
NAMED = re.compile(r"^0*(\d+)[-. ]?\s*(\D.*)\.png$", re.IGNORECASE)
TIER = re.compile(r"^(.*?)\s*\(\s*(?:Level\s*(\d+)|(Small)|(Large))\s*\)\s*$",
                  re.IGNORECASE)


def h(p):
    with open(p, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()


def family_of(base):
    low = base.lower()
    for pref in FAMILY_PREFIX:
        if low.startswith(pref.lower()):
            return pref.lower()
    return low


# ---- recover sheet ids by content -------------------------------------------
src, dupes = {}, set()
for sh in SHEETS:
    for fn in os.listdir(os.path.join(BASE, sh)):
        m = NUM.match(fn)
        if not (fn.lower().endswith(".png") and m):
            continue
        d = h(os.path.join(BASE, sh, fn))
        if d in src:
            dupes.add(d)
        src[d] = (sh, int(m.group(1)))

named, unnamed = [], []
for fn in os.listdir(D):
    if not fn.lower().endswith(".png"):
        continue
    d = h(os.path.join(D, fn))
    sid = u"?" if (d in dupes or d not in src) else \
        u"%s-%02d" % (SID[src[d][0]], src[d][1])

    b = BARE.match(fn)
    if b:
        unnamed.append((int(b.group(1)), fn, sid))
        continue
    m = NAMED.match(fn)
    if not m:
        print("ABORT: cannot parse %r" % fn); sys.exit(1)
    label = m.group(2)
    t = TIER.match(label)
    if t:
        base = t.group(1)
        tier = int(t.group(2)) if t.group(2) else (1 if t.group(3) else 2)
    else:
        base, tier = label, 0
    named.append((family_of(base), tier, base.lower(), label, fn, sid))

total = len(named) + len(unnamed)
named.sort(key=lambda r: (r[0], r[1], r[2]))
unnamed.sort(key=lambda r: r[0])

plan, i = [], 0
for _, _, _, label, fn, sid in named:
    i += 1
    plan.append((fn, u"%02d-%s.png" % (i, label), sid))
for _, fn, sid in unnamed:
    i += 1
    plan.append((fn, u"%02d.png" % i, sid))

if len(set(n for _, n, _ in plan)) != total:
    print("ABORT: duplicate target names"); sys.exit(1)

for k, (fn, _, _) in enumerate(plan):
    os.rename(os.path.join(D, fn), os.path.join(D, u"__t%03d__" % k))
for k, (_, new, _) in enumerate(plan):
    os.rename(os.path.join(D, u"__t%03d__" % k), os.path.join(D, new))

lines = [u"# props/ map - Kitchen Essentials, Prop category, sorted by family+tier",
         u"# Written Sep 5 2026. Docs refer to sprites by sheet id (S1-20 etc.);",
         u"# this folder is numbered 01..%02d. Keep this file with the folder." % total,
         u"new_number,sheet_id,filename"]
for n, (_, new, sid) in enumerate(plan, start=1):
    lines.append(u"%02d,%s,%s" % (n, sid, new))
with io.open(os.path.join(D, u"_props_map.csv"), "w",
             encoding="utf-8", newline="\n") as f:
    f.write(u"\n".join(lines) + u"\n")

print(u"sorted and renumbered %d files\n" % total)
for n, (fn, new, sid) in enumerate(plan, start=1):
    mark = u"  <-- " if fn != new else u"      "
    print(u"  %-42s%s%-40s  %s" % (new, mark, fn, sid))
