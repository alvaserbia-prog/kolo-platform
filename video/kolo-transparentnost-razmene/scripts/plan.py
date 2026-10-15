"""Vremenski plan videa 20 „Kako da sprečimo krađu?“: gde počinje koja scena i gde je koji deo glasa.

Naracija je jedan snimak (audio/final/glas.wav). Seče se na trinaest klipova u sredini pauze
između scena, pa se između scena može dodati vazduh (EXTRA) .
Ulaz src/timing.json, izlaz src/plan.json. Isti plan čitaju Remotion i miks.
"""
import json

FPS = 30
# Muzika (scripts/muzika.py) ima prvi ponovni ulaz ritma posle prekida na 25,37 s, a glas „Ali“ na 21,89 s
# snimka: razlika 3,48 s = UVOD 1,8 (naslov i muzika pre glasa) + vazduh pre scena 2–4 (1,68).
# Posle obrta 3,4 s vazduha raspoređeno je po pauzama tako da poslednji udarac (88,71 s) padne ~0,5 s
# posle „ekolo.rs“ (kraj govora 81,30 s snimka -> 88,18 s u videu).
UVOD = 1.8
PRE_SCENE = 0.30    # kadar kreće malo pre glasa
PRE = {}
EXTRA = {2: 0.5, 3: 0.5, 4: 0.68, 7: 0.6, 9: 0.4, 10: 0.5, 11: 0.4, 12: 0.8, 13: 0.7}
KRAJ = 90.28  # kraj numere (audio/muzika.wav): poslednji udarac 88,71 s, zvonjenje do kraja
# Koliko slika i tekst idu ispred glasa. Pravilo „1 s ispred“ ukinuto je 03.10.2026 (tekst je žurio,
# video/README.md): slika i tekst idu uz izgovorenu reč.
PREDNOST_S = 0.0

t = json.load(open("src/timing.json"))
sc = t["scene"]
# tačke reza u snimku: sredina između kraja poslednje reči i početka sledeće scene
rez = [0.0]
for i in range(1, len(sc)):
    rez.append(round((sc[i - 1]["reci"][-1]["e"] + sc[i]["reci"][0]["s"]) / 2, 3))
rez.append(t["trajanje"])
scene, pomak = [], UVOD
for i, s in enumerate(sc):
    pomak += EXTRA.get(s["id"], 0.0)
    a, b = rez[i], rez[i + 1]
    glasOd = pomak + a
    reci = [{"w": w["w"], "s": round(w["s"] - a, 3), "e": round(w["e"] - a, 3)} for w in s["reci"]]
    od = 0.0 if i == 0 else glasOd + reci[0]["s"] - PRE.get(s["id"], PRE_SCENE) - PREDNOST_S
    scene.append({"id": s["id"], "klipOd": a, "klipDo": b, "glasOd": round(glasOd, 3),
                  "glasDo": round(glasOd + reci[-1]["e"], 3), "od": round(od, 3), "reci": reci, "tekst": s["tekst"]})
for i, s in enumerate(scene):
    s["do"] = round(scene[i + 1]["od"] if i + 1 < len(scene) else KRAJ, 3)
    s["odF"] = round(s["od"] * FPS)
    s["doF"] = round(s["do"] * FPS)
    s["glasOdF"] = round(s["glasOd"] * FPS)
plan = {"fps": FPS, "prednost": PREDNOST_S, "trajanje": KRAJ, "frejmova": round(KRAJ * FPS), "scene": scene}
json.dump(plan, open("src/plan.json", "w"), ensure_ascii=False, indent=1)
for s in scene:
    print(f"scena {s['id']}: {s['od']:6.2f}–{s['do']:6.2f} s ({s['do']-s['od']:.2f}), glas {s['glasOd']+s['reci'][0]['s']:6.2f}–{s['glasDo']:6.2f}")
print("ukupno", KRAJ, "s")
