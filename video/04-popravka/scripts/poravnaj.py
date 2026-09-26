"""Video 04 (popravka): sečenje naracije + vremena reči -> src/timing.json.

Naracija je iz ElevenLabs-a (audio/izvor/scenaN.mp3, već čista), pa se ne
čisti nego samo prevodi u 48 kHz WAV i seče na 0,25 s pre prvog glasa.

Vremena reči daje NeMo Parakeet TDT v3 (audio/parakeet.json, vidi
scripts/vremena_parakeet.py); početak svake reči se dobija poravnanjem
po slovima, isto kao u videu 1 (video/kolo-uvod/scripts/poravnaj.py).

Razlika od videa 1: titl ne piše uvek ono što se izgovara slovima. Broj se
izgovara „pet hiljada poena", a u titlu stoji „5.000 POENA". Zato reč u
TEKST-u može imati oblik  prikaz=izgovor_izgovor  — za poravnanje se koriste
slova izgovora, a u titl ide prikaz.
"""
import json, os, re, subprocess
import numpy as np, soundfile as sf

TEKST = {
    1: "Četvoro ljudi iz Sombora. Niko nikog ne poznaje.",
    2: "Milanu treba med. Ana ga pravi. Dogovore se za pet tegli, 5.000=pet_hiljada POENA=poena, i Milan joj ih prepiše.",
    3: "Ani se pokvari veš mašina. Lazar je popravi! Ana mu prepiše 4.000=četiri_hiljade POENA.=poena Nije dala nijedan dinar.",
    4: "Lazaru se jede burek. Marija ispeče tepsiju, a Lazar joj prepiše 1.000=hiljadu POENA.=poena Marija za njih uzme teglu Aninog meda.",
    5: "Na početku se nisu poznavali… A sad su u istom kolu. POEN=poen nije novac. To je zapis o tome šta je ko dao.",
    6: "Uhvati se i ti u kolo! Registracija traje oko minut. ekolo.rs=e_kolo_tačka_rs",
}

SAMOGLASNICI = set("aeiouAEIOU")


def reci(i):
    """[(prikaz, izgovor)] za scenu i."""
    out = []
    for tok in TEKST[i].split():
        if "=" in tok:
            prikaz, izg = tok.split("=", 1)
            out.append((prikaz, izg.replace("_", " ")))
        else:
            out.append((tok, tok))
    return out


def slogovi(rec):
    r = re.sub(r"[^\wčćšžđČĆŠŽĐ]", "", rec)
    n = sum(1 for c in r if c in SAMOGLASNICI)
    n += len(re.findall(r"(?i)(?<![aeiou])r(?![aeiou])", r))
    return max(1, n)


def ostrva(a, sr):
    hop = sr // 100
    n = len(a) // hop
    db = 20 * np.log10(np.array([np.sqrt(np.mean(a[k * hop:(k + 1) * hop] ** 2)) for k in range(n)]) + 1e-9)
    v = db > np.percentile(db, 90) - 30
    isl, k = [], 0
    while k < n:
        if v[k]:
            j = k
            while j < n and v[j]:
                j += 1
            isl.append([k / 100, j / 100])
            k = j
        else:
            k += 1
    spojeno = [isl[0]]
    for s, e in isl[1:]:
        if s - spojeno[-1][1] < 0.06:
            spojeno[-1][1] = e
        else:
            spojeno.append([s, e])
    return [x for x in spojeno if x[1] - x[0] >= 0.04]


def norm(c):
    return c.lower() if c.isalpha() else ""


def iz_parakeeta(rr, pk, kraj_glasa):
    import difflib
    pk_slova, pk_t = [], []
    for tok, t in zip(pk["tokens"], pk["ts"]):
        for c in tok:
            if norm(c):
                pk_slova.append(norm(c)); pk_t.append(t)
    moja, vlasnik = [], []
    for wi, (_, izg) in enumerate(rr):
        for c in izg:
            if norm(c):
                moja.append(norm(c)); vlasnik.append(wi)
    sm = difflib.SequenceMatcher(None, "".join(moja), "".join(pk_slova), autojunk=False)
    t_slova = [None] * len(moja)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            t_slova[a + k] = pk_t[b + k]
    pocetak = [None] * len(rr)
    for i, wi in enumerate(vlasnik):
        if pocetak[wi] is None and t_slova[i] is not None:
            prvo = vlasnik.index(wi)
            pocetak[wi] = max(0.0, t_slova[i] - 0.06 * (i - prvo))
    # nepogođene reči i reči koje bi išle unazad: interpolacija između suseda
    for i in range(len(rr)):
        if pocetak[i] is not None and i > 0 and pocetak[i - 1] is not None and pocetak[i] <= pocetak[i - 1]:
            pocetak[i] = None
    for i in range(len(rr)):
        if pocetak[i] is None:
            t0 = pocetak[i - 1] if i > 0 else 0.0
            j1 = next((j for j in range(i + 1, len(rr)) if pocetak[j] is not None), None)
            t1 = pocetak[j1] if j1 is not None else kraj_glasa
            n = (j1 - i + 1) if j1 is not None else 2
            pocetak[i] = t0 + (t1 - t0) / n
    out = []
    for i, (prikaz, izg) in enumerate(rr):
        s = pocetak[i]
        nxt = pocetak[i + 1] if i + 1 < len(rr) else kraj_glasa
        e = min(nxt, s + 0.12 + 0.2 * slogovi(izg))
        if i + 1 == len(rr):
            e = max(e, min(kraj_glasa, s + 0.2 * slogovi(izg)))
        out.append({"w": prikaz, "s": round(s, 3), "e": round(max(e, s + 0.1), 3)})
    return out


def pripremi():
    """mp3 -> audio/clean (48 kHz) i audio/clean16 (16 kHz, za model)."""
    os.makedirs("audio/clean", exist_ok=True)
    os.makedirs("audio/clean16", exist_ok=True)
    for i in range(1, 7):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"audio/izvor/scena{i}.mp3", "-ar", "48000", "-ac", "1",
                        f"audio/clean/scena{i}.wav"], check=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"audio/izvor/scena{i}.mp3", "-ar", "16000", "-ac", "1",
                        f"audio/clean16/scena{i}.wav"], check=True)


def main():
    import sys
    if "--pripremi" in sys.argv:
        pripremi()
        return
    pk = json.load(open("audio/parakeet.json"))
    rez = {}
    for i in range(1, 7):
        a, sr = sf.read(f"audio/clean/scena{i}.wav", dtype="float32")
        isl = ostrva(a, sr)
        pocetak = max(0.0, isl[0][0] - 0.25)
        kraj = min(len(a) / sr, isl[-1][1] + 0.30)
        rr = reci(i)
        # parakeet je radio nad celim (neisečenim) klipom -> pomeri na isečen
        p = pk[f"scena{i}"]
        p = {"tokens": p["tokens"], "ts": [t - pocetak for t in p["ts"]]}
        wts = iz_parakeeta(rr, p, isl[-1][1] - pocetak)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"audio/clean/scena{i}.wav",
                        "-ss", f"{pocetak:.3f}", "-to", f"{kraj:.3f}",
                        "-af", "afade=t=in:d=0.02,areverse,afade=t=in:d=0.08,areverse",
                        f"audio/final/scena{i}.wav"], check=True)
        tekst = " ".join(w for w, _ in rr)
        rez[f"scena{i}"] = {"trajanje": round(kraj - pocetak, 3), "tekst": tekst, "reci": wts}
        print(i, round(kraj - pocetak, 2), " ".join(f"{x['w']}@{x['s']}" for x in wts))
    json.dump(rez, open("src/timing.json", "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
