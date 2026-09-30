"""Vremenski plan videa „Registracija i prvi oglas“: gde počinje koja scena i gde je koji deo glasa.

Naracija je jedan snimak (audio/final/glas.wav). Seče se na šest klipova u sredini pauze
između scena, pa se između scena može dodati vazduh (EXTRA) — dok se u svesci ispisuje red.
Ulaz src/timing.json, izlaz src/plan.json. Isti plan čitaju Remotion i miks.
"""
import json

FPS = 30
UVOD = 1.0          # muzika pre prvog glasa
PRE_SCENE = 0.30    # kadar kreće malo pre glasa
EXTRA = {2: 0.46, 3: 0.30, 4: 0.60, 5: 0.35, 6: 0.49}  # dodatna tišina pre scene
# Muzika (numera iz videa 2) ima dva sidra: udar na 17,14 s pada na „unutra“ (scena 2),
# a završni akord na 75,0 s ~0,6 s posle poslednje reči, kad uskoči završna kartica.
KRAJ = 79.0         # akord na 75,0 s odzvoni do ~78 s

t = json.load(open("src/timing.json"))
sc = t["scene"]
# tačke reza u snimku: sredina između kraja poslednje reči i početka sledeće scene
rez = [0.0]
for i in range(1, 6):
    rez.append(round((sc[i - 1]["reci"][-1]["e"] + sc[i]["reci"][0]["s"]) / 2, 3))
rez.append(t["trajanje"])
scene, pomak = [], UVOD
for i, s in enumerate(sc):
    pomak += EXTRA.get(s["id"], 0.0)
    a, b = rez[i], rez[i + 1]
    glasOd = pomak + a
    reci = [{"w": w["w"], "s": round(w["s"] - a, 3), "e": round(w["e"] - a, 3)} for w in s["reci"]]
    od = 0.0 if i == 0 else glasOd + reci[0]["s"] - PRE_SCENE
    scene.append({"id": s["id"], "klipOd": a, "klipDo": b, "glasOd": round(glasOd, 3),
                  "glasDo": round(glasOd + reci[-1]["e"], 3), "od": round(od, 3), "reci": reci, "tekst": s["tekst"]})
for i, s in enumerate(scene):
    s["do"] = round(scene[i + 1]["od"] if i + 1 < len(scene) else KRAJ, 3)
    s["odF"] = round(s["od"] * FPS)
    s["doF"] = round(s["do"] * FPS)
    s["glasOdF"] = round(s["glasOd"] * FPS)
plan = {"fps": FPS, "trajanje": KRAJ, "frejmova": round(KRAJ * FPS), "scene": scene}
json.dump(plan, open("src/plan.json", "w"), ensure_ascii=False, indent=1)
for s in scene:
    print(f"scena {s['id']}: {s['od']:6.2f}–{s['do']:6.2f} s ({s['do']-s['od']:.2f}), glas {s['glasOd']+s['reci'][0]['s']:6.2f}–{s['glasDo']:6.2f}")
print("ukupno", KRAJ, "s")
