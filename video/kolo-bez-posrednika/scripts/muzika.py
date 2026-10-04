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
# kraj (vlasnik 04.10.2026: „neka svetli deo nastavi do kraja … kraj na svetlom delu na kraju celine“):
# svetli deo svira bez prekida posle poslednje reči, do kraja fraze na 65,16 s u pesmi; tu se pušta prvi
# udarac sledeće fraze i muzika se stišava za SMIRAJ s. Bez skoka na završetak pesme (prelaz je bio izražen).
KRAJ_FRAZE = 65.16
SMIRAJ = 1.3
kf = udarac(na_dobi(KRAJ_FRAZE))
t_kraj = (j - s0) + (kf - jl)
delovi = [(s0, j), (jl, kf + SMIRAJ + 0.5)]
print("sunce", round(mk, 2), "s0", round(s0, 2), "delovi", [(round(x, 2), round(y, 2)) for x, y in delovi])
print("sunce u videu", round((j - s0) + (mk - jl), 2), "reč KOLO", round(K, 2),
      "kraj fraze u videu", round(t_kraj, 2), "kraj glasa", round(KRAJ_GLASA, 2), "kraj videa", round(T, 2))
assert t_kraj + SMIRAJ <= T + 0.05, (t_kraj, T)

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
i0, fo = int(t_kraj * sr), int(SMIRAJ * sr)
out[i0:i0 + fo] *= np.linspace(1, 0, len(out[i0:i0 + fo]))[:, None] ** 1.5
out[i0 + fo:] = 0
fi = int(0.05 * sr)
out[:fi] *= np.linspace(0, 1, fi)[:, None]
sf.write("audio/muzika.wav", out.astype(np.float32), sr, subtype="PCM_24")
print("gotovo: audio/muzika.wav", round(len(out) / sr, 2))
