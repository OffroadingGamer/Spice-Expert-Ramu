# -*- coding: utf-8 -*-
"""Per-cue gain trims so switching cues does not step in volume.

Reference is bgm-service-low-take1: it is what ships today at gain 1.0, and
it is the cue the player hears longest, so tuning MUSIC.gain by ear (Plan
item 43) stays valid against it.
"""
import os
import numpy as np
import soundfile as sf

BGM = os.path.join("Audio", "BGM")
CUES = [("menu", "bgm-menu-take1.mp3"),
        ("service_low", "bgm-service-low-take1.mp3"),
        ("service_high", "bgm-service-high-take2.mp3")]
REF = "service_low"

def stats(p):
    x, _ = sf.read(os.path.join(BGM, p), always_2d=True)
    m = x.mean(axis=1)
    r = 20 * np.log10(np.sqrt(np.mean(m ** 2)))
    pk = 20 * np.log10(np.abs(m).max())
    return float(r), float(pk)

s = {k: stats(f) for k, f in CUES}
ref_rms = s[REF][0]
print("%-14s %8s %8s %8s %10s %12s" % ("cue", "rms dB", "peak dB", "trim dB", "gain", "peak after"))
print("-" * 66)
for k, f in CUES:
    rms, pk = s[k]
    trim = ref_rms - rms
    g = 10 ** (trim / 20.0)
    print("%-14s %8.1f %8.1f %8.2f %10.3f %10.1f dB%s" % (
        k, rms, pk, trim, g, pk + trim, "   <-- reference" if k == REF else ""))
print()
print("Headroom check: every peak-after must stay below 0 dBFS.")
worst = max(s[k][1] + (ref_rms - s[k][0]) for k, _ in CUES)
print("loudest peak after trim: %.1f dBFS  ->  %s" % (
    worst, "OK" if worst < -0.2 else "TOO HOT"))
