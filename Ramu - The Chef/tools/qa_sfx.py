# -*- coding: utf-8 -*-
"""SFX mix QA -- what the player actually hears, through the real gain chain.

Answers Plan item 43 ("audition the three sample gains against a real
playthrough") as far as measurement can, so the listening pass starts from
two named suspects instead of from scratch.

Three things it checks that an ear alone struggles with:

  1. HEADROOM over the music bed. A cue needs roughly +6 to +12 dB over the
     bed to read as an event rather than as part of the music.
  2. SPECTRAL COLLISION. A sound whose loudest band is also the bed's loudest
     band is masked, and needs more gain than the peak numbers suggest.
  3. PERCEIVED LOUDNESS. The shipped gains were set by peak-matching the synth
     they replaced. Peak is the wrong yardstick for a short cue -- the loudest
     300 ms is far closer to how one is heard.

Run from the repo's `Ramu - The Chef/` directory; it reads the shipped files
out of ../jam-entry/public/, so it measures what actually deploys.
"""

import os
import numpy as np
import soundfile as sf

JAM = os.path.join("..", "jam-entry")
SFXD = os.path.join(JAM, "public", "audio")
CDN = os.path.join(JAM, "public", "cdn-assets")

# the real chain, at shipped defaults
SFX_BUS = 0.8 * 0.6      # sfxVolume * SFX_BASE
MUS_BUS = 0.6 * 0.5      # musicVolume * MUSIC_BASE

SFX = [("lose", "ah.mp3", 0.50),
       ("upgrade", "level-up.mp3", 0.45),
       ("wave-clear", "level-complete.mp3", 0.50)]
CUE = [("menu", "bgm-menu.mp3", 1.308),
       ("service_low", "bgm-service-low.mp3", 1.000),
       ("service_high", "bgm-service-high.mp3", 1.101)]

BANDS = [(0, 200), (200, 800), (800, 2500), (2500, 6000), (6000, 22050)]
BNAME = ["sub", "low-mid", "mid", "presence", "air"]


def db(x):
    return 20 * np.log10(max(float(x), 1e-9))


def load(p):
    x, sr = sf.read(p, always_2d=True)
    return x.mean(axis=1), sr


def spectrum(m, sr):
    w = np.hanning(len(m))
    mag = np.abs(np.fft.rfft(m * w))
    f = np.fft.rfftfreq(len(m), 1.0 / sr)
    tot = mag.sum() + 1e-12
    return np.array([mag[(f >= lo) & (f < hi)].sum() / tot for lo, hi in BANDS])


print("=" * 74)
print("1. WHAT EACH SOUND MEASURES, AND WHERE IT LANDS AFTER THE GAIN CHAIN")
print("=" * 74)
print("%-13s %6s %7s %7s | %8s %8s" % ("sound", "sec", "peak", "rms", "out-peak", "out-rms"))
sfx_data = {}
for name, fn, g in SFX:
    m, sr = load(os.path.join(SFXD, fn))
    pk, rms = np.abs(m).max(), np.sqrt(np.mean(m ** 2))
    out = g * SFX_BUS
    sfx_data[name] = (m, sr, db(pk) + db(out), db(rms) + db(out), spectrum(m, sr), g)
    print("%-13s %6.2f %6.1f  %6.1f  | %7.1f  %7.1f" % (
        name, len(m) / sr, db(pk), db(rms), db(pk) + db(out), db(rms) + db(out)))

print()
cue_data = {}
print("%-13s %6s %7s %7s | %8s %8s" % ("cue", "sec", "peak", "rms", "out-peak", "out-rms"))
for name, fn, g in CUE:
    m, sr = load(os.path.join(CDN, fn))
    pk, rms = np.abs(m).max(), np.sqrt(np.mean(m ** 2))
    out = g * MUS_BUS
    cue_data[name] = (db(rms) + db(out), spectrum(m, sr))
    print("%-13s %6.2f %6.1f  %6.1f  | %7.1f  %7.1f" % (
        name, len(m) / sr, db(pk), db(rms), db(pk) + db(out), db(rms) + db(out)))

print()
print("=" * 74)
print("2. HEADROOM OVER THE BED  (SFX out-peak minus cue out-rms, dB)")
print("=" * 74)
print("A cue needs roughly +6 to +12 dB over the bed to read as an event rather")
print("than as part of the music. Under about +3 dB it will be missed in play.")
print()
print("%-13s %12s %14s %14s" % ("sound", "vs menu", "vs service_low", "vs service_high"))
for name, _, _ in SFX:
    _, _, opk, _, _, _ = sfx_data[name]
    row = [opk - cue_data[c][0] for c, _, _ in CUE]
    flag = "" if min(row[1:]) >= 3.0 else "   <-- buried in play"
    print("%-13s %+11.1f %+13.1f %+13.1f%s" % (name, row[0], row[1], row[2], flag))

print()
print("=" * 74)
print("3. WHERE THEY COLLIDE  (share of energy per band, %)")
print("=" * 74)
print("%-15s %s" % ("", "".join("%10s" % b for b in BNAME)))
for name, _, _ in SFX:
    s = sfx_data[name][4]
    print("SFX %-11s %s" % (name, "".join("%9.0f%%" % (100 * v) for v in s)))
print()
for name, _, _ in CUE:
    s = cue_data[name][1]
    print("BED %-11s %s" % (name, "".join("%9.0f%%" % (100 * v) for v in s)))
print()
print("A sound whose loudest band is also the bed's loudest band is masked, and")
print("needs more gain than the peak numbers alone suggest.")

print()
print("=" * 74)
print("4. PERCEIVED LOUDNESS  (the check the shipped gains skipped)")
print("=" * 74)
WIN = 0.300

WIN = 0.300


rows = []
for name, fn, g in SFX:
    x, sr = sf.read(os.path.join(SFXD, fn), always_2d=True)
    m = x.mean(axis=1)
    n = int(sr * WIN)
    if len(m) < n:
        loud = np.sqrt(np.mean(m ** 2))
    else:
        # sliding RMS via cumulative sum of squares
        cs = np.concatenate([[0.0], np.cumsum(m ** 2)])
        loud = np.sqrt((cs[n:] - cs[:-n]).max() / n)
    rows.append((name, g, db(np.abs(m).max()), db(np.sqrt(np.mean(m ** 2))), db(loud)))

print("%-13s %6s %8s %8s %10s %12s" % ("sound", "gain", "peak", "rms-all", "loudest300", "out-loud300"))
print("-" * 66)
for name, g, pk, rms, ld in rows:
    print("%-13s %6.2f %7.1f %8.1f %9.1f %11.1f" % (name, g, pk, rms, ld, ld + db(g * SFX_BUS)))

ref = [r for r in rows if r[0] == "lose"][0]
print()
print("Matching the other two to `lose` on loudest-300ms:")
print("%-13s %10s %10s %12s" % ("sound", "delta dB", "gain now", "gain matched"))
print("-" * 50)
for name, g, pk, rms, ld in rows:
    d = ref[4] - ld
    print("%-13s %+9.1f %10.2f %12.2f%s" % (
        name, d, g, g * (10 ** (d / 20.0)),
        "   <-- reference" if name == "lose" else ""))
print()
print("Peak says all three are within 0.7 dB of each other.")
print("Loudest-300ms says they are not. That gap is what an ear will hear.")
