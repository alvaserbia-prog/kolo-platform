"""Precizna vremena reči: prisilno CTC poravnanje (Omnilingual ASR 300M CTC, sherpa-onnx izvoz).

Parakeet daje vreme kad model „izgovori“ token, a ne kad reč počne, i ume da spoji dve reči
(„teglu ajvara“ → „gavajra“) ili da preskoči kratku reč; titl je tada kasnio i po pola sekunde.
Ovde se poznat tekst (iz poravnaj.py, ono što je stvarno izgovoreno) poravna sa verovatnoćama
slova po frejmu (20 ms) Viterbijem: početak reči = prvi frejm njenog prvog slova.

Tekst se pre poravnanja prevodi u ćirilicu, jer model srpski najbolje zna tako.
Ulaz: audio/final/glas.wav, src/timing.json (reči i grube granice scena iz poravnaj.py).
Izlaz: src/timing.json sa preciznim s/e po reči.
Upotreba: python3 scripts/poravnaj_ctc.py [folder modela]
"""
import json, sys
import numpy as np
import onnxruntime as ort
import soundfile as sf
from scipy.signal import resample_poly

M = sys.argv[1] if len(sys.argv) > 1 else "/tmp/claude-0/m/sherpa-onnx-omnilingual-asr-1600-languages-300M-ctc-int8-2025-11-12"
KORAK = 0.02  # s po frejmu

LAT = [("lj", "љ"), ("nj", "њ"), ("dž", "џ"), ("a", "а"), ("b", "б"), ("c", "ц"), ("č", "ч"), ("ć", "ћ"), ("d", "д"), ("đ", "ђ"),
       ("e", "е"), ("f", "ф"), ("g", "г"), ("h", "х"), ("i", "и"), ("j", "ј"), ("k", "к"), ("l", "л"), ("m", "м"), ("n", "н"),
       ("o", "о"), ("p", "п"), ("r", "р"), ("s", "с"), ("š", "ш"), ("t", "т"), ("u", "у"), ("v", "в"), ("z", "з"), ("ž", "ж")]
IZGOVOR = {"ekolo.rs": "ekolo rs", "KOLU": "kolu", "POENE,": "poene", "POENIMA": "poenima"}


def cir(rec):
    w = IZGOVOR.get(rec, rec).lower()
    out, i = "", 0
    while i < len(w):
        for l, c in LAT:
            if w.startswith(l, i):
                out += c
                i += len(l)
                break
        else:
            i += 1  # interpunkcija
    return out


def main():
    tok = [l.rstrip("\n").rsplit(" ", 1)[0] for l in open(f"{M}/tokens.txt", encoding="utf-8")]
    idx = {t: i for i, t in enumerate(tok)}
    ses = ort.InferenceSession(f"{M}/model.int8.onnx")
    a, sr = sf.read("audio/final/glas.wav", dtype="float32")
    if a.ndim > 1:
        a = a.mean(1)
    a16 = resample_poly(a, 1, sr // 16000) if sr != 16000 else a
    t = json.load(open("src/timing.json"))
    sc = t["scene"]
    # granice scena u snimku: sredina pauze između scena (kao u plan.py)
    rez = [0.0] + [(sc[i - 1]["reci"][-1]["e"] + sc[i]["reci"][0]["s"]) / 2 for i in range(1, len(sc))] + [len(a) / sr]
    for k, s in enumerate(sc):
        t0, t1 = rez[k], rez[k + 1]
        x = a16[int(t0 * 16000): int(t1 * 16000)]
        x = (x - x.mean()) / (x.std() + 1e-7)
        lp = ses.run(None, {"x": x[None]})[0][0]
        lp = lp - np.log(np.exp(lp - lp.max(-1, keepdims=True)).sum(-1, keepdims=True)) - lp.max(-1, keepdims=True)
        # niz oznaka: slova reči, razmak između reči; beleži gde počinje/završava svaka reč
        lab, poc_rec, kraj_rec = [], [], []
        for wi, w in enumerate(s["reci"]):
            c = [idx[ch] for ch in cir(w["w"]) if ch in idx]
            if wi:
                lab.append(idx[" "])
            poc_rec.append(len(lab))
            lab += c
            kraj_rec.append(len(lab) - 1)
        # CTC Viterbi (proširen niz sa praznim simbolom 0)
        ext = [0]
        for c in lab:
            ext += [c, 0]
        T, S = lp.shape[0], len(ext)
        NEG = -1e9
        D = np.full((T, S), NEG)
        B = np.zeros((T, S), dtype=np.int8)
        D[0, 0] = lp[0, 0]
        D[0, 1] = lp[0, ext[1]]
        for f in range(1, T):
            e = lp[f, ext]
            p0 = D[f - 1]
            p1 = np.concatenate([[NEG], D[f - 1, :-1]])
            p2 = np.concatenate([[NEG, NEG], D[f - 1, :-2]])
            dozv = np.array([j >= 2 and ext[j] != 0 and ext[j] != ext[j - 2] for j in range(S)])
            p2 = np.where(dozv, p2, NEG)
            st = np.stack([p0, p1, p2])
            B[f] = st.argmax(0)
            D[f] = st.max(0) + e
        j = S - 1 if D[-1, S - 1] > D[-1, S - 2] else S - 2
        put = np.zeros(T, dtype=int)
        for f in range(T - 1, -1, -1):
            put[f] = j
            j -= int(B[f, j])
        # frejm u kom se prvi put emituje svaka oznaka (neprazna pozicija 2i+1)
        prvi = {}
        posl = {}
        for f, j in enumerate(put):
            if j % 2 == 1:
                li = (j - 1) // 2
                prvi.setdefault(li, f)
                posl[li] = f
        stare = []
        for wi, w in enumerate(s["reci"]):
            ps = prvi.get(poc_rec[wi])
            pe = posl.get(kraj_rec[wi])
            if ps is None:
                continue
            ns = round(t0 + ps * KORAK - 0.03, 3)
            ne = round(t0 + (pe + 1) * KORAK + 0.04, 3) if pe is not None else w["e"]
            stare.append((w["w"], w["s"], ns))
            w["s"], w["e"] = ns, max(ne, ns + 0.1)
        # kraj reči ne sme preći početak sledeće
        for wi in range(len(s["reci"]) - 1):
            s["reci"][wi]["e"] = round(min(s["reci"][wi]["e"], s["reci"][wi + 1]["s"]), 3)
        print(s["id"], " ".join(f"{w}@{n:.2f}({n - o:+.2f})" for w, o, n in stare))
    json.dump(t, open("src/timing.json", "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
