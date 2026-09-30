"""Vremena reči za video „Bunar koji kopamo zajedno“ (jedan snimak naracije, My_recording_56).

Tekst prati ono što je izgovoreno (posle izbacivanja tri pogrešna početka u tempo.py), ne scenario:
sc. 5 je izgovorena kao niz „kad … , kad … , kad …“, a sc. 9 kao jedna rečenica posle „KOLO je jedan takav bunar“.
Početak svake reči uzima se iz tokena Parakeet-a (audio/parakeet.json) poravnanjem po
rečima; nepogođene reči se interpoliraju. Precizna vremena daje potom poravnaj_ctc.py.
Izlaz: src/timing.json {trajanje, scene: [{id, tekst, reci}]}.
"""
import json, re, difflib
import soundfile as sf

TEKST = {
    1: "Nekada je priroda bila zajedničko dobro.",
    2: "Seoski pašnjak, bunar, šuma, reka. Svi su ih koristili, a niko ih nije imao samo za sebe.",
    3: "Dugo se verovalo da zajedničko uvek propada. Svako uzme malo više, dok ne ostane ništa.",
    4: "Ali sela širom sveta pokazuju da ne mora biti tako. Elinor Ostrom ih je proučavala i za to dobila Nobelovu nagradu.",
    5: "Zajedničko dobro opstaje kad se zna ko je unutra, kad su pravila poštena, kad o njima odlučuju oni koji ga koriste. Kad svi vide ko šta radi. I kad svako ko prekrši za to odgovara.",
    6: "Propada kad svako uzima, a niko ne odgovara, i kad niko ne može da spreči zloupotrebu.",
    7: "Zajednički pašnjaci u švajcarskim Alpima traju već vekovima. Kanali za navodnjavanje u Španiji takođe.",
    8: "A danas je gotovo sve nečije. Privatno ili državno.",
    9: "Ali i dalje imamo pravo da se udružimo. KOLO je jedan takav bunar, mesto gde razmenjujemo i pomažemo jedni drugima, gde sve što uradimo ostaje zapisano, kao svedočanstvo da smo već nešto dali.",
    10: "Ovaj bunar kopamo zajedno. Pridruži nam se na ekolo.rs.",
}
IZGOVOR = {"ekolo.rs": "ekolotačkars", "KOLO": "kolo"}


def slogovi(r):
    r = IZGOVOR.get(r, r)
    n = sum(1 for c in r.lower() if c in "aeiou")
    return max(1, n)


def norm(c):
    return c.lower() if c.isalpha() else ""


def main():
    pk = json.load(open("audio/parakeet.json"))
    a, sr = sf.read("audio/final/glas.wav")
    kraj_glasa = len(a) / sr - 0.3
    reci, scena_od = [], []
    for i in range(1, 11):
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
    for s in range(1, 11):
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
    json.dump(out, open("src/timing.json", "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
