"""Muzika trilogije „Poverenje“, komponovana i sintetisana u kodu. Upotreba: python3 scripts/muzika.py v1

v1 „Čiji si ti“: vedro od prvog kadra — frula, samica u kontri, bas i def sa praporcima,
   D-dur, 2/4 „šetnja“ ~100 BPM; od scene 6 („KOLO radi isto“) brže, puno kolo ~124 BPM;
   završni udarac pada tačno na „ekolo.rs“. (Prva verzija, frula solo u e-molu, bila je pretužna.)
v2 „Poznaješ li nekoga“ (naiva): harmonika. Scena 1 je pitanje (staccato koje ostane
   visiti), od „Nije problem“ vedra polka u C-duru; scena 5 kolo, brže i punije; kraj na „ekolo.rs“.
v3 „Potvrda nosi odgovornost“: vedro i ritmično od prvog kadra — violina i harmonika u uglas,
   samica, pizzicato bas, def; G-dur, 2/4 ~116 BPM. Priča kroz aranžman: pitanje bez melodije,
   proređena scena o zloupotrebi sa stankom pred „Zato nemoj“, pun sastav oktavu više od
   „najbitnije“; kraj na „ekolo.rs“. (Prva verzija, spori gudači sa disonancama, bila je tužna.)
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
    # Vedro od prvog kadra (odluka vlasnika, 27.09.2026: prva verzija u e-molu bila je pretužna).
    # D-dur, 2/4 „šetnja“ ~100 BPM (sc. 1–5), pa od scene 6 brže, puno kolo ~124 BPM do kraja.
    s6 = SC[6]["od"]
    t_kraj = kraj_glasa + 0.1
    SETNJA = [
        ("D", [(0, .5, 78), (.5, .5, 81), (1, .5, 83), (1.5, .5, 81)]),
        ("D", [(0, .5, 78), (.5, .5, 76), (1, 1, 74)]),
        ("G", [(0, .5, 79), (.5, .5, 83), (1, .5, 86), (1.5, .5, 83)]),
        ("A7", [(0, 1, 81), (1, .5, 79), (1.5, .5, 76)]),
        ("D", [(0, .5, 74), (.5, .5, 78), (1, .5, 81), (1.5, .5, 86)]),
        ("G", [(0, .5, 83), (.5, .5, 79), (1, .5, 83), (1.5, .5, 86)]),
        ("A7", [(0, .5, 85), (.5, .5, 83), (1, .5, 81), (1.5, .5, 79)]),
        ("D", [(0, 1, 78), (1, 1, 74)]),
    ]
    KOLO = [
        ("D", [(0, .25, 81), (.25, .25, 83), (.5, .5, 85), (1, .5, 86), (1.5, .5, 85)]),
        ("D", [(0, .5, 83), (.5, .5, 81), (1, .5, 78), (1.5, .5, 81)]),
        ("G", [(0, .5, 83), (.5, .5, 86), (1, .5, 91), (1.5, .5, 86)]),
        ("A7", [(0, .5, 85), (.5, .5, 81), (1, 1, 76)]),
        ("D", [(0, .25, 78), (.25, .25, 81), (.5, .5, 86), (1, .5, 85), (1.5, .5, 83)]),
        ("G", [(0, .5, 79), (.5, .5, 83), (1, .5, 86), (1.5, .5, 88)]),
        ("A7", [(0, .5, 88), (.5, .5, 85), (1, .5, 81), (1.5, .5, 79)]),
        ("D", [(0, 1, 78), (1, .5, 81), (1.5, .5, 86)]),
    ]

    def takt_muzike(tb, takt, ak, mel, g, def_jak, frula_g, oktava=0):
        tr.dodaj(bas_zica(koren(ak, 38), takt / 2), tb, 0.5 * g)
        tr.dodaj(bas_zica(koren(ak, 38) + 7, takt / 2), tb + takt / 2, 0.42 * g)
        for k in (0.25, 0.75):
            strum(ak, tb + k * takt, 0.15 * g, samica, dno=57, vrh=69, gore=k > 0.5)
        for b, d, m in mel:
            dd = d * takt / 2
            tr.dodaj(frula(m + oktava, dd * 0.85, rng, vib=0.4), tb + b * takt / 2, frula_g * g, 0.12)
            if d >= 1 and rng.random() < 0.5:  # kratak ukras ispred dužeg tona
                tr.dodaj(frula(m + oktava + 2, 0.06, rng, vib=0), tb + b * takt / 2 - 0.07, frula_g * g * 0.6, 0.12)
        tr.dodaj(def_udarac(rng, def_jak), tb, 0.28 * g)
        tr.dodaj(def_udarac(rng, def_jak * 0.45), tb + takt / 2, 0.2 * g)
        tr.dodaj(def_udarac(rng, def_jak * 0.25), tb + takt * 0.75, 0.12 * g)

    # šetnja: rešetka od početka, blagi ulaz (samo samica i bas prva dva takta)
    takt1 = 1.2
    tb = 0.3
    i = 0
    while tb + takt1 <= s6 - 0.2:
        ak, mel = SETNJA[i % 8]
        g = 0.7 if i < 2 else 0.85
        frula_g = 0.0 if i < 2 else 0.34
        takt_muzike(tb, takt1, ak, mel, g, 0.6, frula_g)
        tb += takt1
        i += 1
    # prelaz: kratak uspon samice do kola
    for k, m in enumerate([62, 66, 69, 74, 78, 81]):
        tr.dodaj(samica(m, 0.2), tb + k * (s6 - tb) / 6, 0.2, -0.2)
    # kolo: rešetka od kraja unazad, završni udarac na kraju „ekolo.rs“
    takt2 = 0.97
    n = int((t_kraj - s6) / takt2)
    t0 = t_kraj - n * takt2
    for i in range(n):
        ak, mel = KOLO[i % 8]
        g = 0.85 + 0.15 * i / max(1, n - 1)
        takt_muzike(t0 + i * takt2, takt2, ak, mel, g, 1.0, 0.36)
    strum("D", t_kraj, 0.32, samica, dno=57, vrh=78)
    tr.dodaj(bas_zica(38, 2.5), t_kraj, 0.75)
    tr.dodaj(def_udarac(rng, 1.3), t_kraj, 0.55)
    tr.dodaj(frula(86, T - t_kraj - 0.4, rng, vib=0.8), t_kraj + 0.03, 0.38, 0.1)
    tr.soba(0.22, 1.3)

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
    # Vedro i ritmično od prvog kadra (odluka vlasnika, 30.09.2026: prva verzija, spori gudači sa
    # disonancama, bila je tužna). G-dur, 2/4 ~116 BPM: violina i harmonika u uglas nose temu,
    # samica na kontri, pizzicato bas, def sa praporcima. Priča se čuje kroz aranžman, ne kroz mol
    # (tekst od 01.10.2026, principi potvrde): scena 1 je pitanje (ritam bez melodije, pizzicato
    # se penje na „znači“); od odgovora tema; scena 5 (zloupotreba) proređena, šaljiv silazak na
    # „zloupotrebi“ i stanka pred „Zato nemoj“; od „najbitnije“ pun sastav oktavu više; kraj na „ekolo.rs“.
    s = {i: SC[i]["od"] for i in SC}
    t_znaci = rec(SC, 1, "znači")
    t_zlo = rec(SC, 5, "zloupotrebi")
    t_zato = rec(SC, 5, "zato")
    t_najb = rec(SC, 6, "najbitnije")
    t_kraj = kraj_glasa + 0.1
    TEMA = [
        ("G", [(0, .5, 79), (.5, .5, 83), (1, .5, 86), (1.5, .5, 83)]),
        ("D7", [(0, .5, 81), (.5, .5, 78), (1, 1, 74)]),
        ("D7", [(0, .5, 78), (.5, .5, 81), (1, .5, 84), (1.5, .5, 81)]),
        ("G", [(0, 1, 83), (1, 1, 79)]),
        ("C", [(0, .5, 76), (.5, .5, 79), (1, .5, 84), (1.5, .5, 88)]),
        ("G", [(0, .5, 86), (.5, .5, 83), (1, .5, 79), (1.5, .5, 83)]),
        ("D7", [(0, .5, 81), (.5, .5, 84), (1, .5, 83), (1.5, .5, 81)]),
        ("G", [(0, 1, 79), (1, .5, 83), (1.5, .5, 86)]),
    ]
    AK["D7"] = [2, 6, 9, 0]
    takt = 1.03
    n = int((t_kraj - 0.3) / takt)
    t0 = t_kraj - n * takt
    for i in range(n):
        tb = t0 + i * takt
        ak, mel = TEMA[i % 8]
        uvod = tb < SC[2]["glasOd"] - 0.3                        # pitanje: ritam bez melodije
        predah = t_zlo + 0.25 <= tb < t_zlo + 0.25 + takt        # takt posle „zloupotrebi“
        retko = SC[5]["glasOd"] - 0.3 <= tb < t_najb - 0.6      # scena 5: bez melodije, tiše
        stanka = t_zato - 0.6 <= tb < t_zato + 0.2               # pred „Zato nemoj“: sve stane
        if stanka:
            continue
        pun = tb >= t_najb - 0.6
        g = 0.72 if retko else (0.8 if not pun else 0.95)
        tr.dodaj(pizz(koren(ak, 38), 0.6), tb, 0.55 * g, -0.05)
        tr.dodaj(pizz(koren(ak, 38) + 7, 0.6), tb + takt / 2, 0.45 * g, -0.05)
        for k in (0.25, 0.75):
            strum(ak, tb + k * takt, 0.15 * g, samica, dno=55, vrh=67, pan=-0.3, gore=k > 0.5)
        tr.dodaj(def_udarac(rng, 0.8 if not pun else 1.05), tb, 0.26 * g)
        tr.dodaj(def_udarac(rng, 0.35), tb + takt / 2, 0.18 * g)
        tr.dodaj(def_udarac(rng, 0.25), tb + takt * 0.75, 0.12 * g)
        if uvod or predah or retko:
            continue
        okt = 12 if pun and i % 2 else 0
        for b, d, m in mel:
            dd = d * takt / 2
            tr.dodaj(gudalo(m + okt, dd * 0.8, rng, napad=0.025, pust=0.12, vib=0.6, sekcija=1), tb + b * takt / 2, 0.2 * g, 0.2)
            tr.dodaj(harmonika(m + okt - 12, dd * 0.75, rng, jezicci=(0,), sjaj=1.0), tb + b * takt / 2, 0.13 * g, 0.25)
    # „znači?“: pizzicato se penje kao pitanje
    for k, m in enumerate([62, 67, 71, 76]):
        tr.dodaj(pizz(m, 0.3), t_znaci + 0.05 + k * 0.1, 0.3, 0.2)
    # „zloupotrebi“: šaljiv silazak pizzicata (pa takt bez melodije)
    for k, m in enumerate([74, 71, 67, 62, 55]):
        tr.dodaj(pizz(m, 0.3), t_zlo + 0.05 + k * 0.1, 0.3, 0.2)
    # „Zato nemoj“: posle stanke jedan dubok ton
    tr.dodaj(pizz(43, 0.8), t_zato - 0.05, 0.55)
    # „najbitnije“: uzlet do punog sastava
    for k, m in enumerate([67, 71, 74, 79, 83]):
        tr.dodaj(harmonika(m, 0.12, rng, jezicci=(0,)), t_najb - 0.55 + k * 0.1, 0.2, 0.2)
    # kraj na „ekolo.rs“
    strum("G", t_kraj, 0.3, samica, dno=55, vrh=79)
    for m in (55, 67, 71, 74, 79):
        tr.dodaj(harmonika(m, T - t_kraj - 0.3, rng), t_kraj, 0.18, 0.1)
    tr.dodaj(gudalo(91, T - t_kraj - 0.4, rng, napad=0.05, pust=0.6, sekcija=1), t_kraj + 0.02, 0.15, 0.2)
    tr.dodaj(pizz(43, 2.5), t_kraj, 0.6)
    tr.dodaj(def_udarac(rng, 1.3), t_kraj, 0.5)
    tr.soba(0.22, 1.3)

tr.sacuvaj(f"audio/{V}/muzika.wav")
