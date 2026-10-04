"""Muzika za video „Bez posrednika“: pesma „Od mraka do sunca (1)“ (Suno, nalog vlasnika, 04.10.2026),
složena po glasu. Prethodna pesma („Od mraka do sunca“, audio/raw/muzika-suno.mp3) zamenjena je ovom.

Pesma (3:01.6), ceo tok ~133 BPM (četvrtina 0,4496 s, takt 1,798 s): tamni uvod do ~13 s, pa gradnja,
proređen deo (pauza) 36,5–42,8 s, **svetli deo („sunce“) od udara ~43,2 s**, završni udarac 177,25 s,
posle njega zvoni do ~180,8 s. Sve po merenju (jačina, spektar, ritam), ne slušanjem.

Raspored: do izgovorenog „KOLO“ treba ~11 s više nego što pesma ima do sunca, pa se gradnja jednom
ponovi za 8 taktova (22,56 s ≈ 8,17 s po spektru), a pesma počinje u 3,4 s. Tako proređen deo pada pod
„Ako se na kraju meseca pitaš…“, a sunce na „KOLO“. Svetli deo traje dok traje glas, pa se na udarcu
skače na završni udarac pesme, koji pada odmah posle „ušteda“.
Ulaz audio/raw/muzika-suno-2.mp3 + src/plan.json -> audio/muzika.wav (48 kHz, stereo).
"""
import json, subprocess
import numpy as np, soundfile as sf

FAJL = "audio/raw/muzika-suno-2.mp3"
plan = json.load(open("src/plan.json"))
sc = {s["id"]: s for s in plan["scene"]}
rec = lambda i, w: sc[i]["glasOd"] + next(x["s"] for x in sc[i]["reci"] if x["w"] == w)
K = rec(8, "KOLO.")
KRAJ_GLASA = sc[11]["glasDo"]
T = plan["trajanje"]

DOBA = 60 / 133.45
FAZA = 14.35                    # jedan udarac na mreži doba
J, L = 22.56, 8 * 4 * DOBA      # skok nazad za 8 taktova
MK = 43.2                       # približan početak sunca
E0 = 168.57                     # ulaz u prirodan završetak pesme (stišavanje 170–177 s, pa završni udarac)
UDARAC = 177.25                 # završni udarac pesme

subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", FAJL, "-ar", "48000", "-ac", "2", "-c:a", "pcm_f32le", "/tmp/_suno2.wav"], check=True)
a, sr = sf.read("/tmp/_suno2.wav")
m = a.mean(1)
hop = 256
e = np.array([np.sum(m[i:i + hop] ** 2) for i in range(0, len(m) - hop, hop)])
onset = np.maximum(0, np.diff(np.log(e + 1e-9), prepend=0))


def udarac(t, prozor=0.2):
    i0, i1 = int((t - prozor) * sr / hop), int((t + prozor) * sr / hop)
    return (i0 + int(np.argmax(onset[i0:i1]))) * hop / sr


def na_dobi(t):
    return FAZA + round((t - FAZA) / DOBA) * DOBA


mk = udarac(MK)
j = udarac(na_dobi(J))
jl = udarac(na_dobi(J - L))
s0 = j - (K - (mk - jl))          # početak u pesmi, da sunce padne na „KOLO“
assert s0 >= 0, s0
# kraj: pesma se ne seče na sam završni udarac (tako je zvučalo odsečeno), nego se ~8,7 s ranije, na udarcu,
# prelazi u njen prirodan završetak (stišava se pod „ekolo.rs, čista ušteda“), a završni udarac pada ~0,45 s
# posle poslednje reči
e0 = udarac(na_dobi(E0))
t_skoka = (KRAJ_GLASA + 0.45) - (UDARAC - e0)
kraj = udarac(na_dobi(t_skoka - (j - s0) + jl))
delovi = [(s0, j), (jl, kraj), (e0, len(m) / sr)]
print("sunce", round(mk, 2), "s0", round(s0, 2), "delovi", [(round(x, 2), round(y, 2)) for x, y in delovi])
print("sunce u videu", round((j - s0) + (mk - jl), 2), "reč KOLO", round(K, 2),
      "završni udarac u videu", round((j - s0) + (kraj - jl) + (UDARAC - e0), 2), "kraj glasa", round(KRAJ_GLASA, 2))

f = int(0.06 * sr)
out = None
for x0, x1 in delovi:
    d = a[int((x0 - 0.02) * sr): int((x1 - 0.02) * sr)]
    if out is None:
        out = d
    else:
        r = np.linspace(0, 1, f)[:, None]
        out = np.concatenate([out[:-f], out[-f:] * (1 - r) + d[:f] * r, d[f:]])
n = int(T * sr)
out = out[:n] if len(out) >= n else np.concatenate([out, np.zeros((n - len(out), 2))])
fo = int(1.0 * sr)
out[-fo:] *= np.linspace(1, 0, fo)[:, None]
fi = int(0.05 * sr)
out[:fi] *= np.linspace(0, 1, fi)[:, None]
sf.write("audio/muzika.wav", out.astype(np.float32), sr, subtype="PCM_24")
print("gotovo: audio/muzika.wav", round(len(out) / sr, 2))
