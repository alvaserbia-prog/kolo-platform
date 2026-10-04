"""Vremenski plan videa „Trampa“: gde počinje koja scena i gde je koji deo glasa.

Naracija je jedan snimak (audio/final/glas.wav). Seče se na jedanaest klipova (scene 6 i 7 scenarija su podeljene: 6a, 6b, 7a, 7b, 7c → id 6–10, završnica id 11) u sredini pauze
između scena, pa se između scena može dodati vazduh (EXTRA) .
Ulaz src/timing.json, izlaz src/plan.json. Isti plan čitaju Remotion i miks.
"""
import json

FPS = 30
UVOD = 0.5          # prvi kadar i muzika pre prvog glasa (kuka u prve 3 s: glas kreće odmah)
PRE_SCENE = 0.30    # kadar kreće malo pre glasa
PRE = {2: 0.12}  # scena 1 traje do kraja „cipele“ (palac kroz rupu), pa sunđer kreće kasnije
EXTRA = {5: 0.3, 8: 0.2, 11: 0.8}  # dah pre „Ljudi su…“ (muzika menja deo), pre „Drugi način“, i pre završnice (završni akord posle „ekolo.rs“)
KRAJ_POSLE_GLASA = 3.5  # završni udarac pesme (~1,5 s posle adrese) i kratko zamiranje
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
KRAJ = round(scene[-1]["glasDo"] + KRAJ_POSLE_GLASA, 2)
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
