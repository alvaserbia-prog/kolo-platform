"""Muzika videa 13 „Ušteda“, komponovana i sintetisana u kodu. Upotreba: python3 scripts/muzika.py v1

Vedra tamburica (samica, harmonika, bas, def), G-dur, 2/4 ~110 BPM; opis aranžmana u kodu ispod.
Izlaz: audio/vN/muzika.wav
"""
import sys
import numpy as np
from zvuk import SR, Traka, bas_zica, def_udarac, frula, gudalo, harmonika, pizz, rec, samica, ucitaj_plan

V = sys.argv[1]
plan, SC = ucitaj_plan(V)
T = plan["trajanje"]
tr = Traka(T, seed=13)
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

# Vedro i ritmično od prvog kadra (video/README.md: muzika nikad tužna). Tamburaški sastav:
# samica (prim) nosi temu, harmonika je tiho udvaja, kontra na samici, bas i def sa praporcima;
# G-dur, 2/4 ~110 BPM. Priča kroz aranžman: scena 1 (more) puna i sunčana; scena 2 (troškovi)
# bez teme, samo ritam, a na „ništa“ šaljiv silazak i takt tišine; od oglasa tema se vraća, od
# scene 6 (sve više posla) tema oktavu više i jača; scena 8 (more) pun sastav; kraj na „ekolo.rs“.
t_nista = rec(SC, 2, "ništa")
t_kraj = kraj_glasa + 0.1
TEMA = [
    ("G", [(0, .5, 79), (.5, .5, 83), (1, .5, 86), (1.5, .5, 83)]),
    ("G", [(0, .5, 81), (.5, .5, 79), (1, 1, 76)]),
    ("C", [(0, .5, 76), (.5, .5, 79), (1, .5, 84), (1.5, .5, 79)]),
    ("D7", [(0, 1, 81), (1, .5, 78), (1.5, .5, 74)]),
    ("G", [(0, .5, 79), (.5, .5, 83), (1, .5, 86), (1.5, .5, 91)]),
    ("C", [(0, .5, 88), (.5, .5, 84), (1, .5, 88), (1.5, .5, 91)]),
    ("D7", [(0, .5, 90), (.5, .5, 86), (1, .5, 84), (1.5, .5, 81)]),
    ("G", [(0, 1, 79), (1, .5, 83), (1.5, .5, 86)]),
]
takt = 1.09
n = int((t_kraj - 0.3) / takt)
t0 = t_kraj - n * takt
for i in range(n):
    tb = t0 + i * takt
    ak, mel = TEMA[i % 8]
    bez_teme = SC[2]["od"] - 0.2 <= tb < SC[3]["od"] - 0.3     # troškovi: samo ritam
    stanka = t_nista + 0.35 <= tb < t_nista + 0.35 + takt      # takt posle „ništa“
    if stanka:
        continue
    jace = tb >= SC[6]["od"] - 0.3
    pun = tb >= SC[8]["od"] - 0.3
    g = 0.72 if bez_teme else (0.95 if pun else (0.88 if jace else 0.8))
    tr.dodaj(bas_zica(koren(ak, 38), takt / 2), tb, 0.5 * g)
    tr.dodaj(bas_zica(koren(ak, 38) + 7, takt / 2), tb + takt / 2, 0.42 * g)
    for k in (0.25, 0.75):
        strum(ak, tb + k * takt, 0.15 * g, samica, dno=55, vrh=67, pan=-0.3, gore=k > 0.5)
    tr.dodaj(def_udarac(rng, 1.0 if pun else 0.75), tb, 0.27 * g)
    tr.dodaj(def_udarac(rng, 0.35), tb + takt / 2, 0.18 * g)
    tr.dodaj(def_udarac(rng, 0.25), tb + takt * 0.75, 0.12 * g)
    if bez_teme:
        continue
    okt = 12 if jace and i % 2 else 0
    for b, d, m in mel:
        dd = d * takt / 2
        tt = tb + b * takt / 2
        tr.dodaj(samica(m + okt, dd * 0.9), tt, 0.24 * g, 0.2)
        if d >= 1:  # dug ton prima se trza tremolom, kao na tamburici
            for r in range(1, int(dd / 0.09)):
                tr.dodaj(samica(m + okt, 0.12), tt + r * 0.09, 0.12 * g, 0.2)
        tr.dodaj(harmonika(m + okt - 12, dd * 0.75, rng, jezicci=(0,), sjaj=0.9), tt, (0.12 if pun else 0.08) * g, 0.25)
# „ništa“: šaljiv silazak samice, pa takt tišine
for k, m in enumerate([79, 76, 72, 67, 62]):
    tr.dodaj(samica(m, 0.25), t_nista + 0.05 + k * 0.09, 0.26, 0.2)
tr.dodaj(bas_zica(43, 0.6), t_nista + 0.5, 0.5)
# kraj na „ekolo.rs“
strum("G", t_kraj, 0.32, samica, dno=55, vrh=79)
for m in (55, 67, 71, 74, 79):
    tr.dodaj(harmonika(m, T - t_kraj - 0.3, rng), t_kraj, 0.16, 0.1)
for r in range(int((T - t_kraj - 0.8) / 0.09)):
    tr.dodaj(samica(91, 0.12), t_kraj + 0.03 + r * 0.09, 0.14 * (1 - r * 0.09 / (T - t_kraj)), 0.2)
tr.dodaj(bas_zica(43, 2.5), t_kraj, 0.75)
tr.dodaj(def_udarac(rng, 1.3), t_kraj, 0.55)
tr.soba(0.22, 1.3)

tr.sacuvaj(f"audio/{V}/muzika.wav")
