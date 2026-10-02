"""Vremena reči (video 13 „Ušteda“). Upotreba: python3 scripts/poravnaj.py v1

Početak svake reči uzima se iz tokena Parakeet-a (audio/vN/parakeet.json) poravnanjem na nivou reči;
nepogođene reči se interpoliraju po slogovima. Izlaz: src/vN/timing.json {trajanje, scene: [{id, tekst, reci}]}.
Precizna vremena potom daje scripts/poravnaj_ctc.py.
"""
import json, re, sys, difflib
import soundfile as sf

V = sys.argv[1]
# Tekst prati ono što je izgovoreno (snimak My_recording_65 + umetak iz My_recording_66), ne scenario.
TEKSTOVI = {
    "v1": {
        1: "Zoran ove godine vodi porodicu na more. Plata mu je ista kao lane, a novac za more uštedeo je za šest meseci.",
        2: "Pre KOLA celu platu je trošio: pijaca, frizer, mehaničar, struja, gorivo, porez. Na kraju meseca nije mu ostajalo ništa.",
        3: "Onda je u KOLU postavio oglas: električarske popravke posle posla.",
        4: "Javili su se ljudi kojima je majstor trebao. Za taj posao prepisali su mu POENE, i dobili su ono što im je trebalo, bez dinara.",
        5: "Sa tim POENIMA Zoran sad u KOLU dobija povrće i šiša se kod komšije. Za to više ne troši dinare. I prvi put na kraju meseca ostane mu koja hiljada.",
        6: "Zovu ga sve više ljudi, a što više radi u KOLU, to više toga i dobije u KOLU.",
        7: "Dinare sada troši samo na ono čega u KOLU nema. Svakog meseca ostane mu više.",
        8: "Za šest meseci uštedeo je dovoljno, i cela porodica ide na more. Zoran sada radi više, dobija više i više dinara mu ostaje.",
        9: "Šta ti znaš da uradiš? Postavi svoj prvi oglas na ekolo.rs",
    },
}
TEKST = TEKSTOVI[V]
IZGOVOR = {"ekolo.rs": "ekolors", "KOLO": "kolo", "KOLU": "kolu", "KOLA": "kola", "KOLA.": "kola", "POENE": "poene", "POENE,": "poene"}


def slogovi(r):
    r = IZGOVOR.get(r, r)
    n = sum(1 for c in r.lower() if c in "aeiou")
    return max(1, n)


def norm(c):
    return c.lower() if c.isalpha() else ""


def main():
    pk = json.load(open(f"audio/{V}/parakeet.json"))
    a, sr = sf.read(f"audio/{V}/final/glas.wav")
    kraj_glasa = len(a) / sr - 0.3
    reci, scena_od = [], []
    for i in sorted(TEKST):
        for w in TEKST[i].split():
            reci.append(w); scena_od.append(i)
    # Parakeet reči sa vremenom prvog tokena (token sa razmakom započinje reč)
    pk_reci = []
    for tok, t in zip(pk["tokens"], pk["ts"]):
        if tok.startswith(" ") or not pk_reci:
            pk_reci.append([tok.strip(), t])
        else:
            pk_reci[-1][0] += tok
    cist = lambda x: "".join(c for c in x.lower() if c.isalpha())
    A = [cist(IZGOVOR.get(r, r)) for r in reci]
    B = [cist(w) for w, _ in pk_reci]
    # poravnanje na nivou REČI (Needleman–Wunsch): kratke reči („je“, „su“, „i“) se više
    # ne kače za slova u nekoj kasnijoj reči, što je ranije davalo kašnjenje titla
    n, m = len(A), len(B)
    sc = lambda i, j: (difflib.SequenceMatcher(None, A[i], B[j]).ratio() * 2 - 0.8)
    D = [[0.0] * (m + 1) for _ in range(n + 1)]
    P = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        D[i][0] = -0.4 * i; P[i][0] = 1
    for j in range(1, m + 1):
        D[0][j] = -0.4 * j; P[0][j] = 2
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            o = [D[i - 1][j - 1] + sc(i - 1, j - 1), D[i - 1][j] - 0.4, D[i][j - 1] - 0.4]
            k = max(range(3), key=lambda q: o[q])
            D[i][j], P[i][j] = o[k], k
    poc = [None] * n
    i, j = n, m
    while i > 0 and j > 0:
        k = P[i][j]
        if k == 0:
            if sc(i - 1, j - 1) > 0:
                poc[i - 1] = pk_reci[j - 1][1]
            i, j = i - 1, j - 1
        elif k == 1:
            i -= 1
        else:
            j -= 1
    # nepogođene reči: raspodela po slogovima između susednih pogođenih
    i = 0
    while i < n:
        if poc[i] is not None:
            i += 1
            continue
        j = i
        while j < n and poc[j] is None:
            j += 1
        t0 = poc[i - 1] if i else 0.0
        s0 = slogovi(reci[i - 1]) if i else 0
        t1 = poc[j] if j < n else t0 + 0.3 * (j - i + 1)
        tez = [s0] + [slogovi(reci[k]) for k in range(i, j)]
        uk = sum(tez)
        acc = tez[0]
        for k in range(i, j):
            poc[k] = t0 + (t1 - t0) * acc / uk
            acc += tez[k - i + 1]
        print("procenjeno:", " ".join(reci[i:j]))
        i = j
    out = {"trajanje": round(len(a) / sr, 3), "scene": []}
    for s in sorted(TEKST):
        lista = []
        for i, r in enumerate(reci):
            if scena_od[i] != s:
                continue
            nxt = poc[i + 1] if i + 1 < len(reci) else kraj_glasa
            e = min(nxt, poc[i] + 0.12 + 0.2 * slogovi(r))
            if i + 1 == len(reci):
                e = max(e, kraj_glasa)
            lista.append({"w": r, "s": round(poc[i], 3), "e": round(max(e, poc[i] + 0.1), 3)})
        out["scene"].append({"id": s, "tekst": TEKST[s], "reci": lista})
        print(s, " ".join(f"{x['w']}@{x['s']:.2f}" for x in lista))
    json.dump(out, open(f"src/{V}/timing.json", "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
