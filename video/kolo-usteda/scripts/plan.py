"""Vremenski plan videa: gde počinje koja scena i gde je koji deo glasa. Upotreba: python3 scripts/plan.py v1

Naracija je jedan snimak (audio/vN/final/glas.wav). Seče se na klipove u sredini pauze između
scena, pa se između scena može dodati vazduh (EXTRA). Ulaz src/vN/timing.json, izlaz src/vN/plan.json.
Isti plan čitaju Remotion, muzika, efekti i miks.
"""
import json, sys

V = sys.argv[1]
FPS = 30
CFG = {
    # UVOD: slika i muzika pre prvog glasa; PRE: koliko ranije kreće kadar; EXTRA: vazduh pre scene
    "v1": dict(UVOD=1.4, PRE={}, EXTRA={2: 0.3, 3: 0.3, 4: 0.2, 5: 0.3, 6: 0.3, 7: 0.3, 8: 0.5, 9: 0.6}, KRAJ=3.8, PREDNOST=1.0),
}[V]
# Tekst, natpisi i pokret idu PREDNOST s ispred izgovorene reči (odluka vlasnika 28.09.2026,
# video/README.md); glas i muzika se ne pomeraju.
PREDNOST_S = CFG.get("PREDNOST", 0.0)
PRE_SCENE = 0.30

t = json.load(open(f"src/{V}/timing.json"))
sc = t["scene"]
rez = [0.0]
for i in range(1, len(sc)):
    rez.append(round((sc[i - 1]["reci"][-1]["e"] + sc[i]["reci"][0]["s"]) / 2, 3))
rez.append(t["trajanje"])
scene, pomak = [], CFG["UVOD"]
for i, s in enumerate(sc):
    pomak += CFG["EXTRA"].get(s["id"], 0.0)
    a, b = rez[i], rez[i + 1]
    glasOd = pomak + a
    reci = [{"w": w["w"], "s": round(w["s"] - a, 3), "e": round(w["e"] - a, 3)} for w in s["reci"]]
    od = 0.0 if i == 0 else glasOd + reci[0]["s"] - CFG["PRE"].get(s["id"], PRE_SCENE) - PREDNOST_S
    scene.append({"id": s["id"], "klipOd": a, "klipDo": b, "glasOd": round(glasOd, 3),
                  "glasDo": round(glasOd + reci[-1]["e"], 3), "od": round(od, 3), "reci": reci, "tekst": s["tekst"]})
KRAJ = round(scene[-1]["glasDo"] + CFG["KRAJ"], 2)
for i, s in enumerate(scene):
    s["do"] = round(scene[i + 1]["od"] if i + 1 < len(scene) else KRAJ, 3)
    s["odF"] = round(s["od"] * FPS)
    s["doF"] = round(s["do"] * FPS)
    s["glasOdF"] = round(s["glasOd"] * FPS)
plan = {"fps": FPS, "prednost": PREDNOST_S, "trajanje": KRAJ, "frejmova": round(KRAJ * FPS), "scene": scene}
json.dump(plan, open(f"src/{V}/plan.json", "w"), ensure_ascii=False, indent=1)
for s in scene:
    print(f"scena {s['id']}: {s['od']:6.2f}–{s['do']:6.2f} s ({s['do']-s['od']:.2f}), glas {s['glasOd']+s['reci'][0]['s']:6.2f}–{s['glasDo']:6.2f}")
print(V, "ukupno", KRAJ, "s")
