"""Muzika za video 17 „Stari oblici zapisa“: numera vlasnika sa Suno-a „Quarter in the Dryer (2)“
(audio/raw/muzika-suno-2.mp3, 3:14,8; zamenila je prvu verziju po nalogu vlasnika 05.10.2026:
„promenimo skroz muzičku numeru… da bude u pozadini i uklopi je najbolje što možeš“), složena po glasu
-> audio/muzika.wav.

Izmereno (onset udaraljki, autokorelacija, hroma): takt 1,983 s, udar takta na 140,55 + 1,983k s.
Mirni uvod bez ritma do ~38 s, ritmični deo od 38 s, pun deo od ~57 s; PREKID (bez ritma) 157,8–161,4 s,
pa ponovni ulaz predudarom na 161,61 s (udar takta 162,36 s); proređen deo sa dva udarca 174–181 s;
završnica 181,5–189,4 s (poslednji udarci 188,25 i 189,3 s) i zvonjenje do ~194 s.

Raspored:
  A  90,98 → 158,50   kreće na udar takta, u punom ritmičnom delu, ispod cele istorije; prekid u numeri
                      počinje na „…ko je šta dao.“
  B 160,483 → 172,28  iz prekida izbačen jedan takt (1,983 s), pa tišina traje ~1,8 s, ne 3,6 (vlasnik je
                      kod prve numere tražio kraću tišinu pred tamburicu); rez u tihom delu ide preklapanjem
                      od 150 ms. PONOVNI ULAZ (predudar 161,61 s) pada na „KOLU“
  C 184,18 → 192,90   rez od 6 taktova (11,90 s): 172,28 → 184,18 s ima najveću sličnost hrome (0,93) i
                      spektra od osam mogućih mesta; izbacuje proređen deo, pa završni udarci (188,25 s)
                      dolaze odmah posle „ekolo.rs“, a numera zvoni do kraja videa uz stišavanje od 0,8 s.
"""
import subprocess, numpy as np, soundfile as sf

DELOVI = [(90.980, 158.500), (160.483, 172.280), (184.180, 192.900)]
PREKLOP = 0.040
PREKLOP_TIHO = 0.150  # rez u prekidu (158,5 → 160,48 s) ide dužim preklapanjem, jer tu nema udara
ULAZ = 161.610        # predudar ponovnog ulaza posle prekida
ZAVRSNI = 188.250     # napad završnih udaraca

subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/raw/muzika-suno-2.mp3", "-ar", "48000", "-ac", "2",
                "-c:a", "pcm_f32le", "/tmp/claude-0/suno2_48.wav"], check=True)
a, sr = sf.read("/tmp/claude-0/suno2_48.wav", dtype="float32")
f = int(PREKLOP * sr)
out = None
for t0, t1 in DELOVI:
    k = int((PREKLOP_TIHO if t0 == 160.483 else PREKLOP) * sr)
    # deo počinje (k − f) uzoraka ranije, da duže preklapanje ne pomeri ostatak numere
    d = a[int(t0 * sr) - (k - f if out is not None else 0): int(t1 * sr) + f]
    if out is None:
        out = d
    else:
        r = np.linspace(0, 1, k, dtype=np.float32)[:, None]
        out = np.concatenate([out[:-k], out[-k:] * (1 - r) + d[:k] * r, d[k:]])
out = out[: int(sum(t1 - t0 for t0, t1 in DELOVI) * sr)]
# početak: numera kreće usred svog punog dela, pa ulazi blagim pojačavanjem od 0,4 s; kraj: stišavanje 0,8 s
n = int(0.4 * sr)
out[:n] *= np.linspace(0, 1, n, dtype=np.float32)[:, None]
n = int(0.8 * sr)
out[-n:] *= np.linspace(1, 0, n, dtype=np.float32)[:, None]
sf.write("audio/muzika.wav", out, sr, subtype="PCM_24")


def u_videu(t):
    v = 0.0
    for t0, t1 in DELOVI:
        if t0 <= t <= t1:
            return v + t - t0
        v += t1 - t0
    raise ValueError(t)


print(f"trajanje {len(out)/sr:.3f} s; ulaz u videu {u_videu(ULAZ):.3f} s; završni udarci {u_videu(ZAVRSNI):.3f} s")
