"use client";

import { useCallback, useEffect, useState } from "react";

type Ponuda = { id: string; ponudjac: string; cena: number; izabrana: boolean; napomena: string | null };
type Nabavka = {
  id: string;
  naziv: string;
  status: string;
  dobavljac: string | null;
  nabavnaCena: number | null;
  maloprodajna: number | null;
  brojDelova: number | null;
  velicinaDela: number | null;
  poenPoDelu: number | null;
  brojJedinica: number | null;
  jedinicaMere: string | null;
  prijaveDo: string | null;
  preuzimanjeOd: string | null;
  preuzimanjeDo: string | null;
  placenoRSD: number | null;
  brojPrijava: number;
  ponude: Ponuda[];
};
type Sredstva = {
  saldoRSD: number;
  trosakPrethodnogMesecaRSD: number;
  rezervaRSD: number;
  raspolozivoRSD: number;
  vetoAktivan: boolean;
};
type Registar = { nazivId: string; naziv: string; brojKorisnika: number };

const rsd = (n: number | null) => (n === null ? "—" : `${Math.round(n).toLocaleString("sr-RS")} RSD`);

/**
 * Admin tab „Nabavke" — sprovođenje kolektivne nabavke (Pravilnik o projektima i
 * kolektivnim nabavkama).
 *
 * Nije moderacija (tab „Pijaca"), nije prigovor (tab „Prigovori") i nije odluka o
 * prepisu POEN-a (tab „Razmene"). Ovde se troše dinarska sredstva i gasi POEN po
 * iskorišćenju — zaseban posao, zaseban tab.
 *
 * Sve što ekran računa dolazi sa servera: kalkulacija se snima na zapis pri objavi
 * (čl. 20 st. 2), pa se posle ne menja.
 */
export default function NabavkeTab({ onDone }: { onDone?: () => void }) {
  const [sredstva, setSredstva] = useState<Sredstva | null>(null);
  const [registar, setRegistar] = useState<Registar[]>([]);
  const [nabavke, setNabavke] = useState<Nabavka[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const [radi, setRadi] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const [poruka, setPoruka] = useState<string | null>(null);

  // Obrasci
  const [ponudjac, setPonudjac] = useState("");
  const [cena, setCena] = useState("");
  const [cene, setCene] = useState(["", "", ""]);
  const [izvori, setIzvori] = useState("");
  const [jedinica, setJedinica] = useState("");
  const [mesto, setMesto] = useState("");
  const [odKad, setOdKad] = useState("");
  const [iznosPlacanja, setIznosPlacanja] = useState("");
  const [kod, setKod] = useState("");

  const ucitaj = useCallback(async () => {
    const res = await fetch("/api/admin/nabavke", { cache: "no-store" });
    if (res.ok) {
      const d = await res.json();
      setSredstva(d.sredstva);
      setRegistar(d.registar ?? []);
      setNabavke(d.nabavke ?? []);
    }
    setUcitava(false);
  }, []);

  useEffect(() => {
    void ucitaj();
  }, [ucitaj]);

  async function posalji(putanja: string, telo?: unknown, metod = "POST") {
    setRadi(true);
    setGreska(null);
    setPoruka(null);
    try {
      const res = await fetch(putanja, {
        method: metod,
        headers: { "Content-Type": "application/json" },
        body: telo ? JSON.stringify(telo) : undefined,
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreska(d.greska ?? d.error ?? "Radnja nije uspela.");
        return null;
      }
      await ucitaj();
      onDone?.();
      return d;
    } finally {
      setRadi(false);
    }
  }

  if (ucitava) return <p className="text-sm text-kolo-muted">Učitavanje…</p>;

  const uToku = nabavke.find((n) => n.status !== "ZAVRSENA" && n.status !== "OBUSTAVLJENA");

  return (
    <div className="space-y-5">
      {/* ── Sredstva (čl. 5) ───────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-kolo-border bg-white p-5">
        <h3 className="font-semibold">Sredstva raspoloživa za projekte</h3>
        <dl className="mt-2 divide-y divide-kolo-border text-sm">
          {sredstva &&
            [
              ["Saldo Fondacije", rsd(sredstva.saldoRSD)],
              ["Operativni trošak prethodnog meseca", rsd(sredstva.trosakPrethodnogMesecaRSD)],
              ["Operativna rezerva (3×)", `− ${rsd(sredstva.rezervaRSD)}`],
              ["Raspoloživo za projekte", rsd(sredstva.raspolozivoRSD)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-1.5">
                <dt className="text-kolo-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
        </dl>
        {sredstva?.vetoAktivan && (
          <p className="mt-2 rounded-xl border border-kolo-danger p-2 text-sm text-kolo-danger">
            Zaštitni veto je na snazi — nabavka se ne sprovodi (čl. 7).
          </p>
        )}
        <p className="mt-2 text-xs text-kolo-muted">
          Projektni odliv se vodi odvojeno od operativnog: prag za gašenje veta meri operativu, pa
          nabavka upisana kao operativni trošak podigla bi taj prag.
        </p>
      </section>

      {greska && <p className="rounded-xl border border-kolo-danger p-3 text-sm text-kolo-danger">{greska}</p>}
      {poruka && <p className="rounded-xl border border-kolo-green-700 p-3 text-sm text-kolo-green-800">{poruka}</p>}

      {/* ── Registar i otvaranje nabavke (čl. 12) ──────────────────────────── */}
      {!uToku && (
        <section className="rounded-2xl border border-kolo-border bg-white p-5">
          <h3 className="font-semibold">Registar predloga</h3>
          <p className="mt-1 text-sm text-kolo-muted">
            Rangira se po broju različitih članova. Pre otvaranja nabavke proverite da izabrano dobro
            ne nudi član na Pijaci (čl. 11).
          </p>
          {registar.length === 0 ? (
            <p className="mt-3 text-sm text-kolo-muted">Registar je prazan.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {registar.map((r) => (
                <li key={r.nazivId} className="flex items-center justify-between gap-3 rounded-xl bg-kolo-bg px-3 py-2">
                  <span className="truncate">
                    {r.naziv} <span className="text-kolo-muted">— {r.brojKorisnika} članova</span>
                  </span>
                  <button
                    onClick={() => posalji("/api/admin/nabavke", { nazivId: r.nazivId })}
                    disabled={radi}
                    className="shrink-0 rounded-full bg-kolo-green-700 px-3 py-1 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Otvori nabavku
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ── Nabavka u toku ─────────────────────────────────────────────────── */}
      {uToku && (
        <section className="rounded-2xl border border-kolo-border bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">{uToku.naziv}</h3>
            <span className="text-sm text-kolo-muted">{uToku.status}</span>
          </div>
          <p className="mt-1 text-sm text-kolo-muted">Prijavljenih: {uToku.brojPrijava}</p>

          {/* Ponude (čl. 15) */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold">Ponude ({uToku.ponude.length}/3 najmanje)</h4>
            <ul className="mt-2 space-y-1 text-sm">
              {uToku.ponude.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-kolo-bg px-3 py-1.5">
                  <span>
                    {p.izabrana ? "✓ " : ""}
                    {p.ponudjac} — {rsd(p.cena)}
                  </span>
                  {uToku.status === "NACRT" && (
                    <button
                      onClick={() => posalji(`/api/admin/nabavke/${uToku.id}/ponuda`, { ponudaId: p.id }, "DELETE")}
                      disabled={radi}
                      className="text-xs text-kolo-danger disabled:opacity-50"
                    >
                      obriši
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {uToku.status === "NACRT" && (
              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  value={ponudjac}
                  onChange={(e) => setPonudjac(e.target.value)}
                  placeholder="Ponuđač"
                  className="min-w-[10rem] flex-1 rounded-xl border border-kolo-border px-3 py-1.5 text-sm"
                />
                <input
                  value={cena}
                  onChange={(e) => setCena(e.target.value)}
                  placeholder="Cena po jedinici"
                  inputMode="decimal"
                  className="w-40 rounded-xl border border-kolo-border px-3 py-1.5 text-sm"
                />
                <button
                  onClick={async () => {
                    const r = await posalji(`/api/admin/nabavke/${uToku.id}/ponuda`, {
                      ponudjac,
                      cena: Number(cena),
                    });
                    if (r) {
                      setPonudjac("");
                      setCena("");
                    }
                  }}
                  disabled={radi || !ponudjac || !cena}
                  className="rounded-full bg-kolo-green-700 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Dodaj
                </button>
              </div>
            )}
          </div>

          {/* Objava kalkulacije (čl. 17, 20) */}
          {uToku.status === "NACRT" && uToku.ponude.length >= 3 && (
            <div className="mt-4 rounded-xl bg-kolo-bg p-3">
              <h4 className="text-sm font-semibold">Objava kalkulacije</h4>
              <p className="mt-1 text-xs text-kolo-muted">
                Bira se NAJPOVOLJNIJA ponuda. Maloprodajna referenca je prosek tačno tri javne cene na dan
                objave; izvori se objavljuju uz kalkulaciju. Posle objave se kalkulacija ne menja.
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {cene.map((c, i) => (
                  <input
                    key={i}
                    value={c}
                    onChange={(e) => setCene(cene.map((x, j) => (j === i ? e.target.value : x)))}
                    placeholder={`Maloprodajna cena ${i + 1}`}
                    inputMode="decimal"
                    className="rounded-xl border border-kolo-border px-3 py-1.5 text-sm"
                  />
                ))}
              </div>
              <input
                value={izvori}
                onChange={(e) => setIzvori(e.target.value)}
                placeholder="Izvori tri cene (prodavci / linkovi)"
                className="mt-2 w-full rounded-xl border border-kolo-border px-3 py-1.5 text-sm"
              />
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <input
                  value={jedinica}
                  onChange={(e) => setJedinica(e.target.value)}
                  placeholder="Jedinica mere (npr. vreća 25 kg)"
                  className="rounded-xl border border-kolo-border px-3 py-1.5 text-sm"
                />
                <input
                  value={mesto}
                  onChange={(e) => setMesto(e.target.value)}
                  placeholder="Mesto preuzimanja"
                  className="rounded-xl border border-kolo-border px-3 py-1.5 text-sm"
                />
                <input
                  type="date"
                  value={odKad}
                  onChange={(e) => setOdKad(e.target.value)}
                  className="rounded-xl border border-kolo-border px-3 py-1.5 text-sm"
                />
              </div>
              <button
                onClick={async () => {
                  const najjeftinija = [...uToku.ponude].sort((a, b) => a.cena - b.cena)[0];
                  const r = await posalji(`/api/admin/nabavke/${uToku.id}/objavi`, {
                    ponudaId: najjeftinija?.id,
                    cene: cene.map(Number),
                    izvoriCena: izvori,
                    jedinicaMere: jedinica,
                    mestoPreuzimanja: mesto,
                    preuzimanjeOd: odKad,
                  });
                  if (r) setPoruka("Kalkulacija je objavljena, prijave su otvorene.");
                }}
                disabled={radi || cene.some((c) => !c) || !izvori || !jedinica || !mesto || !odKad}
                className="mt-2 w-full rounded-full bg-kolo-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Objavi kalkulaciju i otvori prijave
              </button>
            </div>
          )}

          {/* Kalkulacija posle objave */}
          {uToku.maloprodajna !== null && (
            <dl className="mt-4 divide-y divide-kolo-border text-sm">
              {[
                ["Dobavljač", uToku.dobavljac ?? "—"],
                ["Nabavna cena", rsd(uToku.nabavnaCena)],
                ["Maloprodajna referenca", rsd(uToku.maloprodajna)],
                ["Jedinica", `${uToku.brojJedinica ?? "—"} × ${uToku.jedinicaMere ?? ""}`],
                ["Delova × veličina", `${uToku.brojDelova ?? "—"} × ${uToku.velicinaDela ?? "—"}`],
                ["POEN po delu", (uToku.poenPoDelu ?? 0).toLocaleString("sr-RS")],
                ["Plaćeno", rsd(uToku.placenoRSD)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 py-1.5">
                  <dt className="text-kolo-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* Zatvaranje prijava (čl. 22) */}
          {uToku.status === "OBJAVLJENA" && (
            <button
              onClick={() => posalji(`/api/admin/nabavke/${uToku.id}/zatvori-prijave`)}
              disabled={radi}
              className="mt-3 w-full rounded-full border border-kolo-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              Zatvori prijave i utvrdi red
            </button>
          )}

          {/* Plaćanje (čl. 25) */}
          {uToku.status === "RED_UTVRDJEN" && (
            <div className="mt-3 flex flex-wrap gap-2">
              <input
                value={iznosPlacanja}
                onChange={(e) => setIznosPlacanja(e.target.value)}
                placeholder="Plaćeno dobavljaču (RSD)"
                inputMode="decimal"
                className="min-w-[12rem] flex-1 rounded-xl border border-kolo-border px-3 py-1.5 text-sm"
              />
              <button
                onClick={() => posalji(`/api/admin/nabavke/${uToku.id}/plati`, { iznosRSD: Number(iznosPlacanja) })}
                disabled={radi || !iznosPlacanja}
                className="rounded-full bg-kolo-green-700 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                Zabeleži plaćanje
              </button>
            </div>
          )}

          {/* Preuzimanje uz kod (čl. 26, 27) */}
          {uToku.status === "PLACENA" && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                <input
                  value={kod}
                  onChange={(e) => setKod(e.target.value)}
                  placeholder="Kod za preuzimanje"
                  className="min-w-[12rem] flex-1 rounded-xl border border-kolo-border px-3 py-1.5 font-mono text-sm"
                />
                <button
                  onClick={async () => {
                    const r = await posalji(`/api/admin/nabavke/${uToku.id}/preuzimanje`, { kod });
                    if (r) {
                      setKod("");
                      setPoruka(`Preuzeto — ${r.pseudonim}, poništeno ${r.poen} POEN.`);
                    }
                  }}
                  disabled={radi || !kod}
                  className="rounded-full bg-kolo-green-700 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Potvrdi preuzimanje
                </button>
              </div>
              <p className="mt-1 text-xs text-kolo-muted">
                POEN se poništava tek ovde, ne pri potvrdi. Dobavljaču se šalje samo spisak kodova.
              </p>
            </div>
          )}

          <button
            onClick={() => {
              const razlog = window.prompt("Razlog obustave (obavezno):") ?? "";
              if (razlog.trim().length >= 10) void posalji(`/api/admin/nabavke/${uToku.id}/obustavi`, { razlog });
            }}
            disabled={radi}
            className="mt-4 text-sm text-kolo-danger disabled:opacity-50"
          >
            Obustavi nabavku
          </button>
        </section>
      )}

      {/* ── Ranije nabavke ─────────────────────────────────────────────────── */}
      {nabavke.filter((n) => n.status === "ZAVRSENA" || n.status === "OBUSTAVLJENA").length > 0 && (
        <section className="rounded-2xl border border-kolo-border bg-white p-5">
          <h3 className="font-semibold">Ranije nabavke</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {nabavke
              .filter((n) => n.status === "ZAVRSENA" || n.status === "OBUSTAVLJENA")
              .map((n) => (
                <li key={n.id} className="flex justify-between gap-3">
                  <span>{n.naziv}</span>
                  <span className="text-kolo-muted">
                    {n.status} · {rsd(n.placenoRSD)}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
}
