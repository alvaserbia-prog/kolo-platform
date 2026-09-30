"""Poravnanje reči sa govorom (vremena reči) + sečenje naracije.

Whisper large-v3 (sherpa-onnx) daje tačan tekst, ali ne i vremena reči, a
HuggingFace modeli sa word-timestamps nisu dostupni iz ovog okruženja.
Zato se vremena izvode iz samog signala:

1. energija po 10 ms -> ostrva govora i pauze (>= 60 ms);
2. dinamičko programiranje raspoređuje reči po ostrvima: grupa uzastopnih
   reči pokriva grupu uzastopnih ostrva, trajanje se očekuje srazmerno broju
   slogova, granica na interpunkciji je jeftinija, a progutana duga pauza
   skupa;
3. unutar grupe reči se raspoređuju po slogovima, preko ZVUČNOG vremena
   (pauze unutar grupe se preskaču).

Kad postoji audio/parakeet.json (scripts/vremena_parakeet.py, NeMo Parakeet
TDT v3 nad već isečenim klipovima), početak svake reči uzima se iz tokena
tog modela poravnanjem po slovima — to je tačnije od gornje procene, koja
tada ostaje samo rezerva.

Izlaz: audio/final/scenaN.wav (početak skraćen na 0,25 s pre prvog glasa)
i src/timing.json (reči sa početkom i krajem u sekundama, relativno na klip).
"""
import json, re, subprocess
import numpy as np, soundfile as sf

# Tekst prati ono što je stvarno izgovoreno (Whisper), pravopis ispravljen ručno.
TEKST = {
    1: "U Somboru svako nešto ume, a svakome nešto treba.",
    2: "Baka Mara peče najbolju pitu u ulici. Pera popravlja bicikle. Ana ima višak paradajza, ali nema ko da joj prekopa baštu.",
    3: "Šta ako bismo mogli da pomognemo jedni drugima, bez novca?",
    4: "To je KOLO. Ponudiš ono što umeš ili imaš. Kad nekome pomogneš, upisuju ti se POEN-i. A kad tebi nešto zatreba, neko pomogne tebi.",
    5: "Nije kupovina i nije prodaja. Samo komšije koje se razmenjuju. I KOLO koje je sve jače.",
    6: "Uđi na sajt ekolo.rs i ponudi svoju prvu razmenu. Ja sam Nikola, i čekam te u KOLU.",
}

SAMOGLASNICI = set("aeiouAEIOU")


def slogovi(rec):
    r = re.sub(r"[^\wčćšžđČĆŠŽĐ]", "", rec)
    if r.lower() == "ekolors":  # „e-kolo-tačka-er-es"
        return 6
    n = sum(1 for c in r if c in SAMOGLASNICI)
    # slogotvorno r (npr. „prvu", „vrt")
    n += len(re.findall(r"(?i)(?<![aeiou])r(?![aeiou])", r))
    return max(1, n)


def ostrva(a, sr):
    hop = sr // 100
    n = len(a) // hop
    db = 20 * np.log10(np.array([np.sqrt(np.mean(a[k * hop:(k + 1) * hop] ** 2)) for k in range(n)]) + 1e-9)
    prag = np.percentile(db, 90) - 28
    v = db > prag
    # zatvori rupe kraće od 60 ms
    isl = []
    k = 0
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
    # odbaci mrvice kraće od 40 ms (klik, dah)
    return [x for x in spojeno if x[1] - x[0] >= 0.04]


def poravnaj(reci, isl):
    W, P = len(reci), len(isl)
    syl = [slogovi(r) for r in reci]
    kraj_fraze = [bool(re.search(r"[.,?!]$", r)) for r in reci]
    ukupno_glas = sum(e - s for s, e in isl)
    rate = ukupno_glas / sum(syl)
    cs = np.concatenate([[0], np.cumsum(syl)])
    INF = 1e18
    # dp[w][p] = najmanji trošak da prvih w reči pokrije prvih p ostrva
    dp = np.full((W + 1, P + 1), INF)
    back = {}
    dp[0][0] = 0
    for w in range(1, W + 1):
        for p in range(1, P + 1):
            for w0 in range(0, w):
                for p0 in range(0, p):
                    if dp[w0][p0] >= INF:
                        continue
                    glas = sum(isl[k][1] - isl[k][0] for k in range(p0, p))
                    ocek = (cs[w] - cs[w0]) * rate
                    c = (glas - ocek) ** 2 / max(ocek, 0.05)
                    # progutane pauze unutar grupe
                    for k in range(p0, p - 1):
                        pauza = isl[k + 1][0] - isl[k][1]
                        c += 4.0 * max(0, pauza - 0.08)
                    if w < W and not kraj_fraze[w - 1]:
                        c += 0.03
                    t = dp[w0][p0] + c
                    if t < dp[w][p]:
                        dp[w][p] = t
                        back[(w, p)] = (w0, p0)
    # rekonstrukcija
    grupe = []
    w, p = W, P
    while w > 0:
        w0, p0 = back[(w, p)]
        grupe.append((w0, w, p0, p))
        w, p = w0, p0
    grupe.reverse()
    out = []
    for w0, w1, p0, p1 in grupe:
        segs = isl[p0:p1]
        glas = sum(e - s for s, e in segs)
        tot = cs[w1] - cs[w0]

        def u_vreme(x):  # x = udeo zvučnog vremena grupe -> apsolutno vreme
            ostalo = x * glas
            for s, e in segs:
                if ostalo <= (e - s) + 1e-9:
                    return s + ostalo
                ostalo -= e - s
            return segs[-1][1]

        acc = 0
        for i in range(w0, w1):
            s = u_vreme(acc / tot)
            acc += syl[i]
            e = u_vreme(acc / tot)
            out.append({"w": reci[i], "s": round(s, 3), "e": round(e, 3)})
    return out


def norm(c):
    return c.lower() if c.isalpha() else ""


def iz_parakeeta(reci, pk, isl):
    """Reči dobijaju početak iz tokena Parakeet-a, poravnanjem po slovima."""
    import difflib
    pk_slova, pk_t = [], []
    for tok, t in zip(pk["tokens"], pk["ts"]):
        for c in tok:
            if norm(c):
                pk_slova.append(norm(c)); pk_t.append(t)
    moja, vlasnik = [], []
    for wi, r in enumerate(reci):
        for c in r:
            if norm(c):
                moja.append(norm(c)); vlasnik.append(wi)
    sm = difflib.SequenceMatcher(None, "".join(moja), "".join(pk_slova), autojunk=False)
    t_slova = [None] * len(moja)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            t_slova[a + k] = pk_t[b + k]
    pocetak = [None] * len(reci)
    for i, wi in enumerate(vlasnik):
        if pocetak[wi] is None and t_slova[i] is not None:
            # prvo pogođeno slovo reči; ako nije prvo slovo, pomeri malo unazad
            prvo = vlasnik.index(wi)
            pocetak[wi] = max(0.0, t_slova[i] - 0.06 * (i - prvo))
    # nepogođene reči: interpolacija po slogovima između suseda
    for i in range(len(reci)):
        if pocetak[i] is None:
            j0 = i - 1
            j1 = next((j for j in range(i + 1, len(reci)) if pocetak[j] is not None), None)
            t0 = pocetak[j0] if j0 >= 0 else 0.0
            t1 = pocetak[j1] if j1 is not None else isl[-1][1]
            pocetak[i] = t0 + (t1 - t0) * 0.5 if j1 is not None else t0 + 0.3
    kraj_glasa = isl[-1][1]
    out = []
    for i, r in enumerate(reci):
        s = pocetak[i]
        nxt = pocetak[i + 1] if i + 1 < len(reci) else kraj_glasa
        e = min(nxt, s + 0.12 + 0.2 * slogovi(r))
        if i + 1 == len(reci):
            e = max(e, min(kraj_glasa, s + 0.2 * slogovi(r)))
        out.append({"w": r, "s": round(s, 3), "e": round(max(e, s + 0.1), 3)})
    return out


def main():
    import os
    pk = json.load(open("audio/parakeet.json")) if os.path.exists("audio/parakeet.json") else None
    rez = {}
    for i in range(1, 7):
        a, sr = sf.read(f"audio/clean/scena{i}.wav", dtype="float32")
        isl = ostrva(a, sr)
        pocetak = max(0.0, isl[0][0] - 0.25)
        kraj = min(len(a) / sr, isl[-1][1] + 0.30)
        reci = TEKST[i].split()
        wts = poravnaj(reci, isl)
        for x in wts:
            x["s"] = round(x["s"] - pocetak, 3)
            x["e"] = round(x["e"] - pocetak, 3)
        if pk:  # tačnija vremena (klipovi su već isečeni, pa su vremena relativna na klip)
            isl_klip = [[a0 - pocetak, b0 - pocetak] for a0, b0 in isl]
            wts = iz_parakeeta(reci, pk[f"scena{i}"], isl_klip)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"audio/clean/scena{i}.wav",
                        "-ss", f"{pocetak:.3f}", "-to", f"{kraj:.3f}",
                        "-af", "afade=t=in:d=0.02,areverse,afade=t=in:d=0.08,areverse",
                        f"audio/final/scena{i}.wav"], check=True)
        rez[f"scena{i}"] = {"trajanje": round(kraj - pocetak, 3), "tekst": TEKST[i], "reci": wts}
        print(i, round(kraj - pocetak, 2), " ".join(f"{x['w']}@{x['s']}" for x in wts))
    json.dump(rez, open("src/timing.json", "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
