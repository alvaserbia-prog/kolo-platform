"""Vremena reči za video „KOLO raste sa nama“ (jedan snimak naracije, My_recording_57).

Tekst prati ono što je izgovoreno, a ne scenario.
Početak svake reči uzima se iz tokena Parakeet-a (audio/parakeet.json) poravnanjem po
slovima; nepogođene reči se interpoliraju. Vremena su u sekundama od početka audio/final/glas.wav.
Izlaz: src/timing.json {trajanje, scene: [{id, tekst, reci}]}.
"""
import json, re, difflib
import soundfile as sf

TEKST = {
    1: "Kolo je živo dok ga igramo, a raste svaki put kad se uhvati još neko.",
    2: "Tako je i sa našim KOLOM. Postoji da bi nam razmena bila lakša. A lakša je kad je ponuda raznovrsna.",
    3: "Svaki novi član donosi nešto novo. Novu uslugu, novo selo, novi grad. Nove mogućnosti za sve.",
    4: "Zato KOLO nagrađuje korake kojima raste. Prvi oglas. Potvrdu nekoga koga poznaješ. Dovođenje novih članova.",
    5: "Ima i drugih načina da doprineseš. Svi su zapisani u javnim pravilima, istim za sve.",
    6: "Što je KOLO veće, lakše nađeš ono što ti treba, i lakše tebe nađe onaj kome trebaš.",
    7: "Sledeća ruka koja se uhvati može da bude tvoja. Svaki tvoj doprinos se nagrađuje.",
    8: "Uhvati se u KOLO. Postavi svoj prvi oglas na ekolo.rs.",
}
IZGOVOR = {"ekolo.rs": "ekolors"}


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
    for i in range(1, len(TEKST) + 1):
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
    for s in range(1, len(TEKST) + 1):
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
