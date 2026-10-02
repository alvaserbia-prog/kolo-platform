"""Sklapanje naracije iz dva snimka vlasnika (odluka vlasnika 02.10.2026).

Osnova je snimak 63 (audio/raw/snimak63.m4a). Iz njega se izbacuju ponovljeni pokušaji, a dve reči
koje su u snimku 63 izgovorene nejasno uzimaju se iz snimka 62 (audio/raw/snimak62.m4a), izjednačene
po jačini sa okolinom: „Hteo je“ (u 63 se čulo „Htela je“) i „domaći pekmez“ (u 63 se zaplelo).
Vremena su u sekundama snimka iz kog se seče. Na svakom spoju fade 10 ms.
Izlaz: audio/rez/glas.wav (44,1 kHz, mono, float).
"""
import subprocess, os, numpy as np, soundfile as sf

os.makedirs("audio/rez", exist_ok=True)
for ime in ("snimak62", "snimak63"):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"audio/raw/{ime}.m4a", "-ac", "1", "-c:a", "pcm_f32le", f"audio/rez/{ime}.wav"], check=True)
a, sr = sf.read("audio/rez/snimak63.wav", dtype="float32")
b, sr2 = sf.read("audio/rez/snimak62.wav", dtype="float32")
assert sr == sr2

# 1) snimak 63 bez ponovljenih pokušaja: prvi „Ove jeseni… stavila teglu“ (bez „i“),
#    prekinuto „Piše Radi sutradan, dolazi po…“, prvo „Šta bi ti prvo ponudio u KOLO? ekolo.rs“
DELOVI_63 = [(2.0, 11.0), (17.7, 49.6), (52.3, 77.5), (81.1, None)]
# 2) zamene iz snimka 62, u koordinatama rezultata koraka 1: (od, do) u 63 -> (od, do) u 62, uzorak jačine
ZAMENE = [((34.45, 34.93), (40.38, 41.16), (35.0, 36.6), (41.2, 42.8)),    # „Hteo je“
          ((57.40, 58.49), (69.22, 70.28), (55.3, 57.3), (67.1, 69.1))]    # „domaći pekmez“


def fade(x, ms=10):
    f = int(ms / 1000 * sr)
    x = x.copy()
    x[:f] *= np.linspace(0, 1, f)
    x[-f:] *= np.linspace(1, 0, f)
    return x


seg = lambda x, s, e: x[int(s * sr):(int(e * sr) if e is not None else len(x))]
rms = lambda x: np.sqrt(np.mean(x ** 2))
n63 = np.concatenate([fade(seg(a, s, e)) for s, e in DELOVI_63])
delovi, p = [], 0.0
for (o0, o1), (z0, z1), (u0, u1), (v0, v1) in ZAMENE:
    delovi.append(fade(seg(n63, p, o0)))
    delovi.append(fade(seg(b, z0, z1) * rms(seg(n63, u0, u1)) / rms(seg(b, v0, v1))))
    p = o1
delovi.append(fade(seg(n63, p, None)))
out = np.concatenate(delovi)
sf.write("audio/rez/glas.wav", out, sr, subtype="FLOAT")
for ime in ("snimak62", "snimak63"):
    os.remove(f"audio/rez/{ime}.wav")
print(f"gotovo: audio/rez/glas.wav, {len(out) / sr:.2f} s")
