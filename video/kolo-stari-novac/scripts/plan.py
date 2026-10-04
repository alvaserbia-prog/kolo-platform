"""Vremenski plan videa „Stari oblici novca“: gde počinje koja scena i gde je koji deo glasa.

Naracija je jedan snimak (audio/final/glas.wav). Seče se na šesnaest klipova u sredini pauze
između scena, pa se između scena može dodati vazduh (EXTRA) .
Ulaz src/timing.json, izlaz src/plan.json. Isti plan čitaju Remotion i miks.
"""
import json

FPS = 30
UVOD = 0.5          # prvi kadar i muzika pre prvog glasa (kuka u prve 3 s: glas kreće odmah)
PRE_SCENE = 0.30    # kadar kreće malo pre glasa
PRE = {}
EXTRA = {9: 0.2, 13: 0.5, 15: 0.25, 16: 0.15}  # dah pre „Ali su imala…“, pre obrta „POEN ne kruži“, pred zapis i pred poziv
KRAJ_POSLE_GLASA = 3.2  # završni akord numere (~0,45 s posle „ekolo.rs“) i njegov odjek
# Koliko slika i tekst idu ispred glasa. Pravilo „1 s ispred“ ukinuto je 03.10.2026 (tekst je žurio,
# video/README.md): slika i tekst idu uz izgovorenu reč.
PREDNOST_S = 0.0

# Reči koje stoje u titlu iako nisu izgovorene (odluka vlasnika, 04.10.2026: „fali kocke soli u tekstu“).
# Reč dobija drugu polovinu trajanja prethodne reči; glas se ne menja.
DODAJ_U_TITL = {4: ("kocke", "soli")}

t = json.load(open("src/timing.json"))
for s in t["scene"]:
    if s["id"] in DODAJ_U_TITL:
        posle, nova = DODAJ_U_TITL[s["id"]]
        i = next(k for k, w in enumerate(s["reci"]) if w["w"] == posle)
        w = s["reci"][i]
        sled = s["reci"][i + 1]["s"]
        sred = round(w["s"] + (sled - w["s"]) * 0.5, 3)
        w["e"] = sred
        s["reci"].insert(i + 1, {"w": nova, "s": sred, "e": sled})
        s["tekst"] = s["tekst"].replace(f"{posle} ", f"{posle} {nova} ", 1)
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
