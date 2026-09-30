"""Vremenski plan videa: gde počinje koja scena i koji glas.

Ulaz:  src/timing.json (trajanja klipova i vremena reči, relativno na klip)
Izlaz: src/plan.json  (sve u sekundama i frejmovima, 30 fps)

Isti plan čitaju i Remotion (animacija, titlovi) i miks (scripts/mix.py),
pa se glas i slika ne mogu razići.
"""
import json

FPS = 30
UVOD = 0.6        # muzika i kuće pre prvog glasa
RAZMAK = 0.45     # tišina između dva klipa naracije
PRE_SCENE = 0.25  # scena kreće malo pre glasa (elementi uskaču)
ODJAVA = 3.0      # logo i adresa posle poslednje reči

t = json.load(open("src/timing.json"))
scene = []
glas = UVOD
for i in range(1, 7):
    k = t[f"scena{i}"]
    pocetak = 0.0 if i == 1 else glas - PRE_SCENE
    scene.append({"id": i, "glasOd": round(glas, 3), "glasDo": round(glas + k["trajanje"], 3),
                  "od": round(pocetak, 3), "reci": k["reci"], "tekst": k["tekst"]})
    glas += k["trajanje"] + RAZMAK
ukupno = scene[-1]["glasDo"] + ODJAVA
for i, s in enumerate(scene):
    s["do"] = round(scene[i + 1]["od"] if i + 1 < len(scene) else ukupno, 3)
    s["odF"] = round(s["od"] * FPS)
    s["doF"] = round(s["do"] * FPS)
    s["glasOdF"] = round(s["glasOd"] * FPS)
plan = {"fps": FPS, "trajanje": round(ukupno, 3), "frejmova": round(ukupno * FPS), "scene": scene}
json.dump(plan, open("src/plan.json", "w"), ensure_ascii=False, indent=1)
for s in scene:
    print(f"scena {s['id']}: {s['od']:6.2f}–{s['do']:6.2f} s, glas od {s['glasOd']:6.2f} s")
print("ukupno", round(ukupno, 2), "s,", plan["frejmova"], "frejmova")
