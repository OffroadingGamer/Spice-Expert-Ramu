# -*- coding: utf-8 -*-
"""Does a take suit a MENU or a GAMEPLAY slot?

Tempo alone cannot answer that. A menu cue should be calmer: fewer onsets per
minute, less percussive attack, a narrower loudness range, and less high-end
bite. These are all measurable without listening.
"""
import glob, os
import numpy as np
import soundfile as sf

BGM = os.path.join("Audio", "BGM")
HOP = 512


def analyse(path):
    x, sr = sf.read(path, always_2d=True)
    m = x.mean(axis=1)
    n = (len(m) // HOP) * HOP
    fr = m[:n].reshape(-1, HOP)
    env = np.sqrt((fr ** 2).mean(axis=1))
    fps = sr / float(HOP)

    # onset density: rising edges above a noise floor, per minute
    d = np.diff(env, prepend=env[0]).clip(min=0)
    thr = d.mean() + 1.2 * d.std()
    peaks = (d[1:-1] > thr) & (d[1:-1] >= d[:-2]) & (d[1:-1] >= d[2:])
    onsets = int(peaks.sum()) * 60.0 / (len(m) / float(sr))

    # attack sharpness: how spiky the onset envelope is (crest factor)
    crest = float(d.max() / (d.mean() + 1e-12))

    # loudness range: 95th minus 10th percentile of frame level, dB
    lvl = 20 * np.log10(np.maximum(env, 1e-9))
    lr = float(np.percentile(lvl, 95) - np.percentile(lvl, 10))

    # spectral balance over the whole track
    w = np.hanning(len(m))
    mag = np.abs(np.fft.rfft(m * w))
    f = np.fft.rfftfreq(len(m), 1.0 / sr)
    tot = mag.sum() + 1e-12
    cen = float((f * mag).sum() / tot)
    low = float(mag[f < 200].sum() / tot)
    high = float(mag[f > 4000].sum() / tot)
    return dict(onsets=onsets, crest=crest, lr=lr, cen=cen, low=low, high=high)


rows = []
for p in sorted(glob.glob(os.path.join(BGM, "*.mp3"))):
    rows.append((os.path.basename(p)[4:-4], analyse(p)))

print("%-20s %8s %7s %8s %8s %7s %7s" % (
    "take", "onset/m", "attack", "lrange", "centre", "low%", "high%"))
print("-" * 72)
for name, r in rows:
    print("%-20s %8.0f %7.1f %7.1f dB %7.0f Hz %6.0f%% %6.0f%%" % (
        name, r["onsets"], r["crest"], r["lr"], r["cen"],
        100 * r["low"], 100 * r["high"]))

print()
print("onset/m  = rhythmic events per minute -- how busy it is")
print("attack   = crest factor of the onset envelope -- how percussive the hits are")
print("lrange   = 95th - 10th percentile frame level -- dynamic range within the loop")
print("centre   = spectral centroid -- perceived brightness")
