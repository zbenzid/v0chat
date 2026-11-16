"""Voix du chien, 100 % code : espeak-ng (synthese par formants) -> phrases calees sur la grille.
Ecrit audio/vo.wav, vo.json (segments en beats) et lipsync.json (enveloppe 100 Hz pour la machoire)."""
import json, subprocess, wave, sys
from pathlib import Path
import numpy as np

HERE = Path(__file__).parent
SR = 48000
BPM = 120.0
PERIOD = 60.0 / BPM
LINES = [
    ("intro", "Bonjour la France ! Ici Jean-Michel Wouf. C'est l'heure de la météo."),
    ("lyon", "À Lyon, il pleut du caca. Prenez un parapluie. Un gros."),
    ("marseille", "À Marseille, quarante-sept degrés, et averses de merguez."),
    ("lille", "À Lille, tornade de frites. Vigilance mayonnaise."),
    ("bretagne", "En Bretagne, il pleut. Voilà. C'est tout."),
    ("paris", "À Paris, brouillard de pigeons. Ressenti : nul."),
    ("outro", "Demain, skibidi sur tout le pays. Ouaf, ouaf ! Bisous."),
]

def say(key, text):
    f = HERE / "vo" / f"{key}.wav"
    subprocess.run(["espeak-ng", "-v", "fr+m3", "-s", "158", "-p", "72", "-a", "180", "-g", "2", "-w", str(f), text], check=True)
    with wave.open(str(f)) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
    n = int(len(x) * SR / sr)                      # resample to 48k (linear)
    x = np.interp(np.arange(n) * sr / SR, np.arange(len(x)), x)
    idx = np.nonzero(np.abs(x) > 0.02)[0]          # trim silence
    return x[idx[0]: idx[-1] + int(0.05 * SR)]

def colour(x):
    # un peu de "console 2002" : leger ecrasement + bitcrush doux melange a la voix propre
    y = np.tanh(2.2 * x) / np.tanh(2.2)
    hold = 3
    c = np.repeat(y[::hold], hold)[: len(y)]
    c = np.round(c * 48) / 48
    return 0.7 * y + 0.3 * c

segs, placed, beat = [], [], 2.0                  # 2 beats de jingle avant la premiere phrase
for key, text in LINES:
    x = colour(say(key, text))
    dur = len(x) / SR
    start = beat
    segs.append({"key": key, "text": text, "u0": start, "u1": start + dur / PERIOD, "t0": start * PERIOD, "dur": round(dur, 3)})
    placed.append((int(start * PERIOD * SR), x))
    beat = np.ceil((start + dur / PERIOD + 1.0) / 4) * 4   # phrase suivante sur un debut de mesure
total_beats = int(beat + 4)                       # une mesure de fin
total = total_beats * PERIOD
out = np.zeros(int(total * SR))
for i0, x in placed:
    out[i0: i0 + len(x)] += x
out *= 0.85 / np.max(np.abs(out))
with wave.open(str(HERE / "vo.wav"), "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
hop = SR // 100
env = np.sqrt(np.mean(out[: len(out) // hop * hop].reshape(-1, hop) ** 2, axis=1))
env = np.convolve(env, np.ones(3) / 3, mode="same")
env = np.clip(env / np.percentile(env[env > 0.01], 90), 0, 1)
(HERE / "lipsync.json").write_text(json.dumps({"rate": 100, "env": [round(float(v), 3) for v in env]}))
(HERE / "vo.json").write_text(json.dumps({"bpm": BPM, "beats": total_beats, "duration": total, "segments": segs}, indent=1, ensure_ascii=False))
for s in segs: print(f"{s['key']:10s} u {s['u0']:5.1f} -> {s['u1']:5.1f}  ({s['dur']} s)")
print("total", total_beats, "beats", total, "s")
