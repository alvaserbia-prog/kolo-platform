"""Vremena reči za video „Domaćice“ (jedan snimak naracije, Jelena).

Tekst prati ono što je izgovoreno (snimak My_recording_54), ne scenario: „vrsna je domaćica“,
„prisetio“, „Komšije ... došle su po dve, tri tegle i prepisale joj POENE“, „je dobila pomoć“.
Početak svake reči uzima se iz tokena Parakeet-a (audio/parakeet.json) poravnanjem po
slovima; nepogođene reči se interpoliraju. Vremena su u sekundama od početka audio/final/glas.wav.
Izlaz: src/timing.json {trajanje, scene: [{id, tekst, reci}]}.
"""
import json, re, difflib
import soundfile as sf

TEKST = {
    1: "Milica je celog života pravila zimnicu. A onda je prvi put bacila teglu ajvara.",
    2: "Milica to voli i zna, vrsna je domaćica. Njena porodica uživala je u najboljim delicijama: ajvar, turšija, pekmez, sokovi. Po bakinom receptu, bez konzervansa.",
    3: "Onda su deca otišla svojim putem. Velika porodica spala je na dva slova.",
    4: "Još nekoliko godina je pravila, misleći da će je dati deci i unucima. Ali oni su dolazili retko. Tegle su stajale, i Milica je počela da baca.",
    5: "Zato je jedne jeseni rekla: dosta. Više ne pravim.",
    6: "U KOLU zimnica ne mora da propadne. Tu se nađe neko ko bi se rado prisetio ukusa svog detinjstva.",
    7: "Milica je na KOLU objavila oglas. Komšije iz susedne ulice došle su po dve, tri tegle i prepisale joj POENE, onoliko koliko su se dogovorili.",
    8: "Tim POENIMA Milica je dobila pomoć u kući. Neko joj očisti oluke, neko pokosi travu.",
    9: "Milica ponovo pravi zimnicu, jer opet ima za koga.",
    10: "Znaš nešto da napraviš? Neko u tvom kraju baš to traži. Pridruži se besplatno na ekolo.rs.",
}
IZGOVOR = {"ekolo.rs": "ekolors"}


def slogovi(r):
    r = IZGOVOR.get(r, r)
    n = sum(1 for c in r.lower() if c in "aeiou")
    return max(1, n)


def norm(c):
    return c.lower() if c.isalpha() else ""


def main():
    pk = json.load(open("audio/parakeet.json"))
    a, sr = sf.read("audio/final/glas.wav")
    kraj_glasa = len(a) / sr - 0.3
    reci, scena_od = [], []
    for i in range(1, 11):
        for w in TEKST[i].split():
            reci.append(w); scena_od.append(i)
    pk_slova, pk_t = [], []
    for tok, t in zip(pk["tokens"], pk["ts"]):
        for c in tok:
            if norm(c):
                pk_slova.append(norm(c)); pk_t.append(t)
    moja, vlasnik = [], []
    for wi, r in enumerate(reci):
        for c in IZGOVOR.get(r, r):
            if norm(c):
                moja.append(norm(c)); vlasnik.append(wi)
    sm = difflib.SequenceMatcher(None, "".join(moja), "".join(pk_slova), autojunk=False)
    t_slova = [None] * len(moja)
    for x, y, n in sm.get_matching_blocks():
        for k in range(n):
            t_slova[x + k] = pk_t[y + k]
    poc = [None] * len(reci)
    for i, wi in enumerate(vlasnik):
        if poc[wi] is None and t_slova[i] is not None:
            prvo = vlasnik.index(wi)
            poc[wi] = max(0.0, t_slova[i] - 0.06 * (i - prvo))
    for i in range(len(reci)):
        if poc[i] is None:
            t0 = poc[i - 1] if i else 0.0
            j1 = next((j for j in range(i + 1, len(reci)) if poc[j] is not None), None)
            poc[i] = (t0 + poc[j1]) / 2 if j1 is not None else t0 + 0.3
    # ručne ispravke gde Parakeet nije čuo reč (interpolacija bi je stavila prerano)
    for i, r in enumerate(reci):
        if r == "Više" and scena_od[i] == 5:
            poc[i] = poc[i + 1] - 0.55
    out = {"trajanje": round(len(a) / sr, 3), "scene": []}
    for s in range(1, 11):
        lista = []
        for i, r in enumerate(reci):
            if scena_od[i] != s:
                continue
            nxt = poc[i + 1] if i + 1 < len(reci) else kraj_glasa
            e = min(nxt, poc[i] + 0.12 + 0.2 * slogovi(r))
            if i + 1 == len(reci):
                e = max(e, kraj_glasa)
            lista.append({"w": r, "s": round(poc[i], 3), "e": round(max(e, poc[i] + 0.1), 3)})
        out["scene"].append({"id": s, "tekst": TEKST[s], "reci": lista})
        print(s, " ".join(f"{x['w']}@{x['s']:.2f}" for x in lista))
    json.dump(out, open("src/timing.json", "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
