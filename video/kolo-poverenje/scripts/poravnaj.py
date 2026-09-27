"""Vremena reči (trilogija „Poverenje“). Upotreba: python3 scripts/poravnaj.py v1

Početak svake reči uzima se iz tokena Parakeet-a (audio/vN/parakeet.json) poravnanjem na nivou reči;
nepogođene reči se interpoliraju po slogovima. Izlaz: src/vN/timing.json {trajanje, scene: [{id, tekst, reci}]}.
Precizna vremena potom daje scripts/poravnaj_ctc.py.
"""
import json, re, sys, difflib
import soundfile as sf

V = sys.argv[1]
# Tekst prati ono što je izgovoreno (snimci My_recording_58/59/60, 27.09.2026), ne scenario.
TEKSTOVI = {
    "v1": {
        1: "Čiji si ti? Nekada je to pitanje vredelo više od lične karte.",
        2: "Selo je bilo malo i svi su se znali. Lična karta nikom nije trebala.",
        3: "Kad prođe neko mlađi, pitaju ga: čiji si ti? Kad kaže čiji je, odmah se zna ko je.",
        4: "A kad dođe neko nov iz drugog sela, nađe se neko koga zna. „To je Stevin zet. Radili smo zajedno žetvu.“ I to je bilo dovoljno.",
        5: "Tako je nastajalo poverenje i novo poznanstvo. Preko nekoga koga već znaš. Veza po veza, selo po selo.",
        6: "KOLO radi isto. Ne tražimo ličnu kartu, ne tražimo ni pravo ime. Dovoljno je da te potvrdi neko ko te lično zna.",
        7: "Pa, čiji si ti? Ko tebe zna? Uđi u KOLO. ekolo.rs",
    },
    "v2": {
        1: "Ne poznaješ nikoga u KOLU? Nije problem.",
        2: "Jovana poznaje komšinicu Veru, koja je već u KOLU. Jovana joj pokaže svoj kod, Vera je potvrdi i Jovana je unutra.",
        3: "Dragan ne poznaje nikoga, zato prvo postavi oglas. Cepa drva. Javi mu se Sofija iz susedne ulice.",
        4: "Dragan joj iscepa drva, ona mu prepiše POENE. On joj pokaže svoj kod i ona ga potvrdi.",
        5: "Jedne poznaješ od ranije, druge upoznaš kroz razmenu. I tako postaješ deo KOLA.",
        6: "Pridruži se besplatno i postavi prvi oglas. Neko iz tvog kraja će ti se javiti. ekolo.rs",
    },
    "v3": {
        1: "Bunar koji smo zajedno iskopali može da se zamuti.",
        2: "KOLO je taj bunar. Iz njega pije svako i svako ga čuva.",
        3: "Kad potvrdiš nekoga koga ne znaš ili nekoga ko ne postoji, otvaraš vrata prevari i zloupotrebi. Bunar se muti. Za sve nas.",
        4: "Ako nekoga potvrdiš, puštaš ga do našeg bunara. Kažeš: „Znam ga lično.“",
        5: "Nisi odgovoran za sve što on kasnije uradi. Ali odgovaraš za jedno: da ga lično poznaješ.",
        6: "Potvrdi samo one koje znaš. Tako bunar ostaje čist za sve koji su pošteni. ekolo.rs",
    },
}
TEKST = TEKSTOVI[V]
IZGOVOR = {"ekolo.rs": "ekolors", "KOLO": "kolo", "KOLU": "kolu", "KOLA": "kola", "POENE": "poene", "POENE,": "poene"}


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
