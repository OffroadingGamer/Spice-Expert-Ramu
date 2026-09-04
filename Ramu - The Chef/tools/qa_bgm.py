# -*- coding: utf-8 -*-
"""Objective QA on the BGM takes. The thing that actually gates shipping is
whether a take fades at either end -- a fade cannot be looped, and no amount of
loopStart/loopEndTrim tuning fixes it."""
import glob, os
import numpy as np
import soundfile as sf

BGM = r"D:\Jobs and Corporate\Portfolio Projects\Game Design\Projects\September GameJam\Ramu - The Chef\Audio\BGM"

def db(x):
    return 20.0 * np.log10(max(float(x), 1e-9))

def rms(x):
    return float(np.sqrt(np.mean(np.square(x)))) if len(x) else 0.0

def centroid(x, sr):
    if len(x) < 512:
        return 0.0
    w = np.hanning(len(x))
    mag = np.abs(np.fft.rfft(x * w))
    f = np.fft.rfftfreq(len(x), 1.0 / sr)
    s = mag.sum()
    return float((f * mag).sum() / s) if s > 0 else 0.0

def tempo(x, sr):
    """Crude onset-autocorrelation tempo estimate, good to a few BPM."""
    hop = 512
    n = (len(x) // hop) * hop
    frames = x[:n].reshape(-1, hop)
    env = np.sqrt((frames ** 2).mean(axis=1))
    env = np.diff(env, prepend=env[0]).clip(min=0)      # onset strength
    env -= env.mean()
    ac = np.correlate(env, env, mode="full")[len(env) - 1:]
    fps = sr / float(hop)
    lo, hi = int(fps * 60 / 200.0), int(fps * 60 / 60.0)  # 60-200 BPM
    if hi >= len(ac):
        return 0.0
    lag = lo + int(np.argmax(ac[lo:hi]))
    return 60.0 * fps / lag if lag else 0.0

print("%-28s %6s %5s %7s %7s  %8s %8s  %7s %6s" % (
    "take", "sec", "ch", "peak", "rms", "head-d", "tail-d", "seam", "bpm"))
print("-" * 104)

rows = []
for p in sorted(glob.glob(os.path.join(BGM, "*.mp3"))):
    x, sr = sf.read(p, always_2d=True)
    mono = x.mean(axis=1)
    dur = len(mono) / float(sr)
    body = rms(mono)
    w = int(sr * 0.5)                     # half-second windows
    head, tail = rms(mono[:w]), rms(mono[-w:])
    # seam: how alike are the last and first quarter-second?
    q = int(sr * 0.25)
    a, b = mono[-q:], mono[:q]
    seam_db = abs(db(rms(a)) - db(rms(b)))
    seam_hz = abs(centroid(a, sr) - centroid(b, sr))
    bpm = tempo(mono, sr)
    rows.append((os.path.basename(p), dur, x.shape[1], db(np.abs(mono).max()),
                 db(body), db(head) - db(body), db(tail) - db(body),
                 seam_db, seam_hz, bpm))
    print("%-28s %6.2f %5d %7.1f %7.1f  %+8.1f %+8.1f  %7.1f %6.0f" % (
        rows[-1][0], dur, x.shape[1], rows[-1][3], rows[-1][4],
        rows[-1][5], rows[-1][6], seam_db, bpm))

print()
print("head-d / tail-d = first / last 0.5 s level relative to the whole track, dB.")
print("A fade shows as a large negative number. Anything under about -3 dB is")
print("a real fade and cannot be looped cleanly.")
print()
print("VERDICTS")
for r in rows:
    name, dur, ch, peak, body, hd, td, sdb, shz, bpm = r
    bad = []
    if hd < -3.0: bad.append("FADE-IN %.1f dB" % hd)
    if td < -3.0: bad.append("FADE-OUT %.1f dB" % td)
    if peak > -0.2: bad.append("near clipping %.1f dBFS" % peak)
    if abs(dur - 30.0) > 0.35: bad.append("duration %.2f s" % dur)
    if sdb > 4.0: bad.append("loud seam step %.1f dB" % sdb)
    print("  %-28s %s" % (name, "  |  ".join(bad) if bad
                          else "OK  (seam %.1f dB / %.0f Hz)" % (sdb, shz)))
