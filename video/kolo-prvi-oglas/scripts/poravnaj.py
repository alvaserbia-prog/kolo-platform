"""Vremena reči za video „Registracija i prvi oglas“ (jedan snimak naracije).

Tekst prati ono što je izgovoreno (snimak My_recording_53).
Početak svake reči uzima se iz tokena Parakeet-a (audio/parakeet.json) poravnanjem po
slovima; nepogođene reči se interpoliraju. Vremena su u sekundama od početka audio/final/glas.wav.
Izlaz: src/timing.json {trajanje, scene: [{id, tekst, reci}]}.
"""
import json, re, difflib
import soundfile as sf

TEKST = {
    1: "Ana je u KOLO ušla sa jednom teglom meda. A evo kako ti da uđeš u KOLO.",
    2: "Na ekolo.rs klikneš „Pridruži se“. Izabereš pseudonim, upišeš mejl i lozinku. Za minut si unutra, bez podataka iz lične karte.",
    3: "Onda na Pijaci postaviš svoj prvi oglas, recimo: domaći med. Jedna fotografija i mesto, a po želji i broj telefona. Iznos u POENIMA određuješ sam.",
    4: "Kad Fondacija pregleda tvoj prvi oglas, upisuje ti se hiljadu POENA. To je zapis da si nešto doprineo zajednici.",
    5: "Tvoj oglas vide ljudi iz tvog kraja. Neko od njih se javi i obavite razmenu. Kad te upozna, može da te potvrdi. Sa prvom potvrdom postaješ redovan član i sam možeš da se javljaš na tuđe oglase.",
    6: "Šta ti imaš da ponudiš? Med, popravku, čas matematike, pomoć u bašti? Uđi na ekolo.rs i postavi svoj prvi oglas. Treba ti dva minuta.",
}
IZGOVOR = {"ekolo.rs": "ekolors", "mejl": "mail"}  # izgovoreno „ekolo rs"; Parakeet piše „mail"


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
    for i in range(1, 7):
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
    out = {"trajanje": round(len(a) / sr, 3), "scene": []}
    for s in range(1, 7):
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
