"""Muzika trilogije „Poverenje“, komponovana i sintetisana u kodu. Upotreba: python3 scripts/muzika.py v1

v1 „Čiji si ti“ (linorez): frula solo u e-molu, rubato, preko burdona samice (sećanje, selo);
   od scene 6 („KOLO radi isto“) samica ulazi u 2/4 kolo u G-duru, pa frula, bas i def;
   završni udarac pada tačno na „ekolo.rs“.
v2 „Poznaješ li nekoga“ (naiva): harmonika. Scena 1 je pitanje (staccato koje ostane
   visiti), od „Nije problem“ vedra polka u C-duru; scena 5 kolo, brže i punije; kraj na „ekolo.rs“.
v3 „Potvrda nosi odgovornost“ (tuš): gudači. Visok ton violine i čelo na d; na „zamuti“ disonanca;
   scena 2 toplo F-dur; scena 3 napetost (d–B–g–A, tremolo čela), na „muti“ klaster; scena 4
   razrešenje u D-dur na „lično“; scene 5–6 pizzicato i tema, kraj na „ekolo.rs“.
Izlaz: audio/vN/muzika.wav
"""
import sys
import numpy as np
from zvuk import SR, Traka, bas_zica, def_udarac, frula, gudalo, harmonika, pizz, rec, samica, ucitaj_plan

V = sys.argv[1]
plan, SC = ucitaj_plan(V)
T = plan["trajanje"]
tr = Traka(T, seed={"v1": 11, "v2": 22, "v3": 33}[V])
rng = tr.rng

AK = {
    "C": [0, 4, 7], "F": [5, 9, 0], "G": [7, 11, 2], "G7": [7, 11, 2, 5], "D": [2, 6, 9], "D7": [2, 6, 9, 0], "Am": [9, 0, 4],
    "Em": [4, 7, 11], "Dm": [2, 5, 9], "Bb": [10, 2, 5], "Gm": [7, 10, 2], "A": [9, 1, 4], "A7": [9, 1, 4, 7], "B7": [11, 3, 6, 9],
}


def glasovi(ak, dno, vrh):
    return [x for x in range(dno, vrh + 1) if x % 12 in AK[ak]]


def koren(ak, dno):
    k = AK[ak][0]
    return dno + ((k - dno) % 12)


def strum(ak, t, g, instr, dno=55, vrh=67, pan=-0.3, gore=False):
    gl = glasovi(ak, dno, vrh)[:4]
    if gore:
        gl = gl[::-1]
    for j, m in enumerate(gl):
        tr.dodaj(instr(m, 0.3), t + j * 0.01 + rng.normal(0, 0.003), g * rng.uniform(0.85, 1), pan)


kraj_glasa = SC[max(SC)]["glasDo"]

if V == "v1":
    s6 = SC[6]["od"]
    beat = 0.78
    # burdon: e i h na samici, ponovljeno svaka dva takta, tiho
    t = 0.2
    while t < s6 - 0.5:
        tr.dodaj(bas_zica(40, 2.0), t, 0.22, 0.0)
        tr.dodaj(samica(59, 1.6), t + 0.02, 0.07, -0.3)
        tr.dodaj(samica(64, 1.6), t + 0.04, 0.06, 0.3)
        t += beat * 4
    A = [(0, 1, 71), (1, 1, 76), (2, 2, 79), (4, 1, 78), (5, 1, 76), (6, 2, 74), (8, 1, 76), (9, 3, 71)]
    B = [(0, 1, 74), (1, 1, 76), (2, 1, 78), (3, 1, 79), (4, 2, 81), (6, 1, 79), (7, 1, 78), (8, 4, 76)]
    C = [(0, 2, 83), (2, 1, 81), (3, 1, 79), (4, 2, 78), (6, 2, 76), (8, 1, 74), (9, 1, 76), (10, 2, 71)]
    t = 0.5
    for fraza, g in [(A, 0.32), (B, 0.3), (A, 0.27), (C, 0.3), (B, 0.27), (A, 0.3)]:
        for b, d, m in fraza:
            tt = t + b * beat + rng.normal(0, 0.02)
            if tt + d * beat > s6 - 0.2:
                continue
            tr.dodaj(frula(m, d * beat * 0.95, rng), tt, g, 0.1)
            if d >= 2 and rng.random() < 0.6:  # ukras pre dugog tona
                tr.dodaj(frula(m + 2, 0.07, rng, vib=0), tt - 0.08, g * 0.7, 0.1)
        t += 13 * beat
    # kolo: rešetka od kraja unazad, završni udarac na kraju „ekolo.rs“
    t_kraj = kraj_glasa + 0.1
    takt = 1.14
    n = int((t_kraj - s6) / takt)
    t0 = t_kraj - n * takt
    KOLO = [
        ("G", [(0, .5, 79), (.5, .5, 81), (1, .5, 83), (1.5, .5, 81)]),
        ("G", [(0, .5, 79), (.5, .5, 78), (1, 1, 76)]),
        ("C", [(0, .5, 76), (.5, .5, 79), (1, .5, 84), (1.5, .5, 83)]),
        ("D7", [(0, 1, 81), (1, 1, 78)]),
        ("G", [(0, .5, 83), (.5, .5, 81), (1, .5, 79), (1.5, .5, 83)]),
        ("Em", [(0, .5, 81), (.5, .5, 79), (1, .5, 78), (1.5, .5, 76)]),
        ("Am", [(0, .5, 74), (.5, .5, 76), (1, .5, 78), (1.5, .5, 79)]),
        ("D7", [(0, 1, 78), (1, 1, 74)]),
    ]
    s7 = SC[7]["od"]
    for i in range(n):
        tb = t0 + i * takt
        ak, mel = KOLO[i % 8]
        puno = tb >= s7 - 0.3
        g = 0.55 + 0.45 * min(1, i / max(1, n - 1))
        tr.dodaj(bas_zica(koren(ak, 40), takt / 2), tb, 0.55 * g)
        tr.dodaj(bas_zica(koren(ak, 40) + 7, takt / 2), tb + takt / 2, 0.45 * g)
        for k in (0.25, 0.75):
            strum(ak, tb + k * takt, 0.14 * g, samica, gore=k > 0.5)
        if puno or i >= 4:
            for b, d, m in mel:
                tr.dodaj(frula(m, d * takt / 2 * 0.9, rng, vib=0.6), tb + b * takt / 2, 0.45 * g, 0.12)
                tr.dodaj(samica(m - 12, d * takt / 2), tb + b * takt / 2 + 0.01, 0.12 * g, -0.2)
        if puno:
            tr.dodaj(def_udarac(rng), tb, 0.35)
            tr.dodaj(def_udarac(rng, 0.4), tb + takt / 2, 0.22)
    tz = t_kraj
    strum("G", tz, 0.3, samica, dno=55, vrh=74)
    tr.dodaj(bas_zica(43, 2.5), tz, 0.7)
    tr.dodaj(def_udarac(rng, 1.2), tz, 0.5)
    tr.dodaj(frula(83, T - tz - 0.4, rng), tz + 0.02, 0.4, 0.1)
    tr.soba(0.3, 1.8)

elif V == "v2":
    beat_q = 0.3
    # sc. 1: pitanje — tri staccato tona i jedan koji ostane da visi
    for i, m in enumerate([72, 76, 79, 83]):
        tr.dodaj(harmonika(m, 0.14 if i < 3 else 0.9, rng), 0.4 + i * 0.32, 0.5, 0.1)
    t_nije = rec(SC, 1, "nije")
    for m in [60, 64, 67, 72]:
        tr.dodaj(harmonika(m, 0.8, rng), t_nije + 0.05, 0.28, -0.1)
    t_kraj = kraj_glasa + 0.1
    takt = 1.12
    s2 = SC[2]["od"]
    n = int((t_kraj - s2) / takt)
    t0 = t_kraj - n * takt
    POLKA = [
        ("C", [(0, .5, 72), (.5, .5, 76), (1, .5, 79), (1.5, .5, 76)]),
        ("G7", [(0, .5, 77), (.5, .5, 76), (1, .5, 74), (1.5, .5, 72)]),
        ("G7", [(0, .5, 74), (.5, .5, 77), (1, .5, 81), (1.5, .5, 77)]),
        ("C", [(0, 1, 79), (1, 1, 76)]),
        ("C", [(0, .5, 72), (.5, .5, 76), (1, .5, 79), (1.5, .5, 84)]),
        ("F", [(0, .5, 81), (.5, .5, 77), (1, .5, 81), (1.5, .5, 84)]),
        ("G7", [(0, .5, 83), (.5, .5, 81), (1, .5, 79), (1.5, .5, 77)]),
        ("C", [(0, 1, 76), (1, 1, 72)]),
    ]
    s5 = SC[5]["od"]
    for i in range(n):
        tb = t0 + i * takt
        if tb < s2 - 0.1:
            continue
        ak, mel = POLKA[i % 8]
        kolo = tb >= s5 - 0.2
        g = 0.75 if not kolo else 1.0
        tr.dodaj(harmonika(koren(ak, 36), 0.22, rng, jezicci=(0,)), tb, 0.42 * g, -0.1)
        tr.dodaj(harmonika(koren(ak, 36) + 7, 0.22, rng, jezicci=(0,)), tb + takt / 2, 0.36 * g, -0.1)
        for k in (0.25, 0.75):
            for m in glasovi(ak, 55, 67)[:3]:
                tr.dodaj(harmonika(m, 0.13, rng, jezicci=(0,), sjaj=0.8), tb + k * takt, 0.1 * g, -0.25)
        for b, d, m in mel:
            dd = d * takt / 2 * (0.85 if d < 1 else 0.95)
            tr.dodaj(harmonika(m + (12 if kolo and i % 2 else 0), dd, rng, sjaj=1.1), tb + b * takt / 2, 0.36 * g, 0.15)
        if kolo:
            tr.dodaj(def_udarac(rng, 0.8, praporci=True), tb, 0.2)
    for m in [48, 60, 64, 67, 72, 76]:
        tr.dodaj(harmonika(m, T - t_kraj - 0.3, rng), t_kraj, 0.28, 0.0)
    tr.soba(0.22, 1.2)

else:  # v3
    rngv = rng
    def pad(ak, t0, t1, g, dno=50, vrh=69, napad=0.8):
        for m in glasovi(ak, dno, vrh)[:4]:
            tr.dodaj(gudalo(m, max(0.3, t1 - t0), rngv, napad=napad, pust=0.8), t0, g, rngv.uniform(-0.4, 0.4))
        tr.dodaj(gudalo(koren(ak, 36), max(0.3, t1 - t0), rngv, napad=napad, pust=0.8, svetlo=2500), t0, g * 1.4, 0.0)

    s = {i: SC[i]["od"] for i in SC}
    t_zamuti = rec(SC, 1, "zamuti")
    tr.dodaj(gudalo(81, t_zamuti - 0.2, rngv, napad=1.2, pust=0.6, sekcija=2), 0.3, 0.16, 0.3)
    tr.dodaj(gudalo(38, s[2] + 0.5, rngv, napad=1.0, pust=0.8, svetlo=2000), 0.2, 0.3, 0.0)
    for m in (75, 80, 44):  # disonanca na „zamuti“
        tr.dodaj(gudalo(m, s[2] - t_zamuti + 0.2, rngv, napad=0.15, pust=0.8, sekcija=2), t_zamuti, 0.14, rngv.uniform(-0.3, 0.3))
    # sc. 2 — toplo F-dur, tema violine
    pad("F", s[2], s[3], 0.13)
    for i, (b, d, m) in enumerate([(0, 1, 72), (1, 1, 74), (2, 2, 77), (4, 1, 76), (5, 2, 72)]):
        tr.dodaj(gudalo(m, d * 0.62, rngv, napad=0.12, pust=0.3, sekcija=2), s[2] + 0.4 + b * 0.62, 0.2, 0.2)
    # sc. 3 — napetost
    t_muti = rec(SC, 3, "muti")
    t_za = rec(SC, 3, "za")
    delovi = [("Dm", s[3], s[3] + 2.8), ("Bb", s[3] + 2.8, s[3] + 5.4), ("Gm", s[3] + 5.4, t_muti - 0.3), ("A7", t_muti - 0.3, s[4])]
    for ak, a, b in delovi:
        pad(ak, a, b, 0.12, napad=0.5)
    tt = s[3]
    while tt < t_muti:  # tremolo čela
        tr.dodaj(gudalo(38, 0.07, rngv, napad=0.01, pust=0.03, sekcija=1, svetlo=1800), tt, 0.1)
        tt += 0.075
    for m in (37, 38, 44, 45):
        tr.dodaj(gudalo(m, t_za - t_muti + 1.2, rngv, napad=0.3, pust=1.2, svetlo=1600), t_muti - 0.1, 0.16)
    # sc. 4 — razrešenje na „lično“
    t_licno = rec(SC, 4, "lično")
    pad("Dm", s[4], t_licno - 0.2, 0.1, napad=0.6)
    pad("D", t_licno - 0.2, s[5] + 0.5, 0.17, napad=0.35)
    for b, d, m in [(0, 1, 74), (1, 1, 78), (2, 3, 81)]:
        tr.dodaj(gudalo(m, d * 0.6, rngv, napad=0.1, pust=0.5, sekcija=2), t_licno + b * 0.6, 0.2, 0.2)
    # sc. 5–6 — pizzicato puls i tema, kraj na „ekolo.rs“
    t_kraj = kraj_glasa + 0.1
    takt = 1.2
    n = int((t_kraj - s[5]) / takt)
    t0 = t_kraj - n * takt
    PROG = ["F", "C", "Dm", "Bb", "F", "C", "Bb", "C"]
    TEMA = [[(0, 1, 72), (1, 1, 77)], [(0, 2, 76)], [(0, 1, 74), (1, 1, 77)], [(0, 2, 74)], [(0, 1, 72), (1, 1, 81)], [(0, 1, 79), (1, 1, 76)], [(0, 1, 77), (1, 1, 74)], [(0, 2, 72)]]
    s6 = s[6]
    for i in range(n):
        tb = t0 + i * takt
        ak = PROG[i % 8]
        tr.dodaj(pizz(koren(ak, 38)), tb, 0.45)
        tr.dodaj(pizz(koren(ak, 38) + 7), tb + takt / 2, 0.32)
        for k, m in enumerate(glasovi(ak, 60, 72)[:3]):
            tr.dodaj(pizz(m, 0.5), tb + takt / 4 + k * 0.06, 0.12, 0.3)
        if tb >= s6 - 0.3:
            pad(ak, tb, tb + takt, 0.07, napad=0.3)
            for b, d, m in TEMA[i % 8]:
                tr.dodaj(gudalo(m, d * takt / 2 * 0.95, rngv, napad=0.1, pust=0.3, sekcija=2), tb + b * takt / 2, 0.18, 0.2)
    pad("F", t_kraj, T - 0.2, 0.2, napad=0.05)
    tr.dodaj(pizz(41, 2.5), t_kraj, 0.6)
    tr.soba(0.35, 2.4, svetlo=4500)

tr.sacuvaj(f"audio/{V}/muzika.wav")
