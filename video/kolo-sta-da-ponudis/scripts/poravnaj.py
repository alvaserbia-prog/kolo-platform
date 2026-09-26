"""Vremena reči za video 5 „Šta da ponudiš“ (jedan snimak naracije, My_recording_55).

Parakeet i Whisper na srpskom daju nepouzdana vremena pojedinačnih reči, ali pauze u snimku su
jasne. Zato: snimak se deli na govorne komade (tišina ≥ 0,12 s), svaka fraza teksta vezuje se
za svoj komad (proverom Whisper-om, vidi README), a unutar komada reči se raspoređuju srazmerno
broju slogova. Tekst prati ono što je izgovoreno („ne možeš da se javljaš“, „Pali svetlo“).
Izlaz: src/timing.json {trajanje, scene: [{id, tekst, reci}]}.
"""
import json
import numpy as np
import soundfile as sf

# (scena, fraza, komad [od, do] u s u audio/final/glas.wav)
FRAZE = [
    (1, "Misliš da nemaš šta da ponudiš?", (0.24, 2.24)),
    (1, "Hajde da prošetamo kroz tvoju kuću.", (2.66, 4.94)),
    (2, "Kuhinja.", (5.77, 6.34)),
    (2, "Ajvar,", (6.76, 7.53)),
    (2, "pekmez, kolači za slavu.", (7.69, 9.61)),
    (3, "Dvorište.", (10.43, 11.20)),
    (3, "Jaja, paradajz iz bašte.", (11.62, 13.74)),
    (3, "Košenje trave.", (13.88, 14.95)),
    (3, "Mesto u autu za grad.", (15.44, 16.96)),
    (4, "Dnevna soba.", (17.76, 18.70)),
    (4, "Šiješ,", (19.15, 19.81)),
    (4, "pomažeš detetu oko matematike,", (19.94, 21.82)),
    (4, "pokazuješ nekome kako radi telefon.", (22.25, 24.66)),
    (5, "Ono što tebi deluje obično,", (25.46, 27.43)),
    (5, "nekome je baš ono što traži.", (27.77, 29.63)),
    (6, "Napravi svoj prvi oglas.", (30.43, 32.25)),
    (6, "Dodaj sliku, šta nudiš i gde si.", (32.43, 34.91)),
    (6, "Iznos u POENIMA predlažeš ti.", (35.30, 37.36)),
    (7, "Za prvi oglas, kad", (38.05, 39.34)),
    (7, "prođe pregled, upisuje ti se hiljadu POENA.", (39.70, 42.80)),
    (8, "KOLO prima samo ljude koji su stvarni.", (43.41, 45.81)),
    (8, "Dok te niko ne potvrdi, ne možeš da se javljaš na tuđe oglase,", (46.21, 50.03)),
    (8, "ali drugi mogu da se jave tebi.", (50.45, 52.46)),
    (8, "Zato je tvoj prvi oglas ulaz u KOLO.", (52.88, 55.66)),
    (9, "Pali svetlo u svojoj kući.", (56.48, 58.45)),
    (9, "Uđi u KOLO,", (58.85, 59.82)),
    (9, "registracija je besplatna.", (60.17, 61.70)),
    (9, "ekolo.rs", (62.31, 63.79)),
]
IZGOVOR = {"ekolo.rs": "ekolo tačka rs", "POENIMA": "poenima", "POENA.": "poena"}


def slogovi(r):
    r = IZGOVOR.get(r, r).lower()
    n = sum(1 for c in r if c in "aeiou")
    if n == 0 and "r" in r:
        n = 1
    return max(1, n) + 0.6  # konstanta: početak/kraj reči


def main():
    a, sr = sf.read("audio/final/glas.wav")
    out = {"trajanje": round(len(a) / sr, 3), "scene": []}
    po_sceni = {}
    for sc, tekst, (od, do) in FRAZE:
        reci = tekst.split()
        tez = np.array([slogovi(r) for r in reci])
        granice = od + np.concatenate([[0], np.cumsum(tez)]) / tez.sum() * (do - od)
        lista = po_sceni.setdefault(sc, {"tekst": [], "reci": []})
        lista["tekst"].append(tekst)
        for i, r in enumerate(reci):
            lista["reci"].append({"w": r, "s": round(float(granice[i]), 3), "e": round(float(granice[i + 1]), 3)})
    for sc in sorted(po_sceni):
        s = po_sceni[sc]
        out["scene"].append({"id": sc, "tekst": " ".join(s["tekst"]), "reci": s["reci"]})
        print(sc, " ".join(f"{x['w']}@{x['s']:.2f}" for x in s["reci"]))
    json.dump(out, open("src/timing.json", "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
