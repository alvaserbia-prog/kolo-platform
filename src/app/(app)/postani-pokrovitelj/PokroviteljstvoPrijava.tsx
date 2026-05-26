"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Prijava = {
  id: string;
  naziv: string;
  pib: string;
  vrstaDonacije: "NOVAC" | "ROBA" | "USLUGE";
  vrednostRsd: number;
  ugovorTekst: string;
  status: "CEKA_POTPIS" | "POTPISANA" | "POTVRDJENA" | "ODBIJENA";
  odbijenoRazlog: string | null;
  createdAt: string;
};

const STATUS_LABEL: Record<Prijava["status"], string> = {
  CEKA_POTPIS: "Čeka vaš potpis",
  POTPISANA: "Potpisana — čeka potvrdu Fondacije",
  POTVRDJENA: "Potvrđena",
  ODBIJENA: "Odbijena",
};
const VRSTA_LABEL: Record<Prijava["vrstaDonacije"], string> = { NOVAC: "Novac", ROBA: "Roba", USLUGE: "Usluge" };
const MAX_BYTES = 3_000_000;

export default function PokroviteljstvoPrijava() {
  const [prijave, setPrijave] = useState<Prijava[]>([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [radnja, setRadnja] = useState<string | null>(null);
  const [otvoreniUgovor, setOtvoreniUgovor] = useState<string | null>(null);

  const [naziv, setNaziv] = useState("");
  const [pib, setPib] = useState("");
  const [vrsta, setVrsta] = useState<Prijava["vrstaDonacije"]>("NOVAC");
  const [vrednost, setVrednost] = useState("");
  const [cenovnik, setCenovnik] = useState<string | null>(null);
  const [greska, setGreska] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const ucitaj = useCallback(async () => {
    setUcitavanje(true);
    const res = await fetch("/api/pokroviteljstvo/prijava");
    if (res.ok) setPrijave((await res.json()).prijave ?? []);
    setUcitavanje(false);
  }, []);

  useEffect(() => { ucitaj(); }, [ucitaj]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setGreska("");
    if (!f) { setCenovnik(null); return; }
    if (f.size > MAX_BYTES) { setGreska("Cenovnik je prevelik (maks. ~3MB)."); if (fileRef.current) fileRef.current.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => setCenovnik(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(f);
  }

  async function posalji() {
    setGreska("");
    if ((vrsta === "ROBA" || vrsta === "USLUGE") && !cenovnik) {
      setGreska("Za robu i usluge priložite maloprodajni cenovnik.");
      return;
    }
    setRadnja("posalji");
    const res = await fetch("/api/pokroviteljstvo/prijava", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ naziv: naziv.trim(), pib: pib.trim(), vrstaDonacije: vrsta, vrednostRsd: Number(vrednost), cenovnikSlika: cenovnik }),
    });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    if (res.ok) {
      setNaziv(""); setPib(""); setVrsta("NOVAC"); setVrednost(""); setCenovnik(null);
      if (fileRef.current) fileRef.current.value = "";
      await ucitaj();
    } else setGreska(d.error ?? "Greška pri slanju.");
  }

  async function potpisi(id: string) {
    if (!confirm("Potpisati ugovor o donaciji u ime pravnog lica?")) return;
    setRadnja(id);
    const res = await fetch(`/api/pokroviteljstvo/prijava/${id}/potpisi`, { method: "POST" });
    setRadnja(null);
    if (res.ok) await ucitaj();
    else { const d = await res.json().catch(() => ({})); alert(d.error ?? "Greška."); }
  }

  const trebaCenovnik = vrsta === "ROBA" || vrsta === "USLUGE";

  return (
    <div className="space-y-6 mb-8">
      {/* Forma */}
      <div className="bg-kolo-surface border border-kolo-border rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-kolo-text">Pokreni pokroviteljstvo</h2>
        <p className="text-sm text-kolo-muted">
          Podnesite prijavu u ime pravnog lica. Platforma generiše ugovor o donaciji koji potpisujete;
          po potvrdi prijema od strane Fondacije, evidentira se bonus POEN.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-kolo-muted mb-1">Naziv pravnog lica</label>
            <input value={naziv} onChange={(e) => setNaziv(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-kolo-muted mb-1">PIB</label>
            <input value={pib} onChange={(e) => setPib(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-kolo-muted mb-1">Vrsta donacije</label>
            <select value={vrsta} onChange={(e) => setVrsta(e.target.value as Prijava["vrstaDonacije"])}
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700">
              <option value="NOVAC">Novac</option>
              <option value="ROBA">Roba</option>
              <option value="USLUGE">Usluge</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-kolo-muted mb-1">Vrednost (RSD)</label>
            <input type="number" value={vrednost} onChange={(e) => setVrednost(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
          </div>
        </div>
        {trebaCenovnik && (
          <div>
            <label className="block text-sm font-medium text-kolo-muted mb-1">Maloprodajni cenovnik (slika/PDF)</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="text-sm" />
            <p className="mt-1 text-xs text-kolo-muted">Obavezno za robu i usluge — služi za utvrđivanje dinarske vrednosti.</p>
          </div>
        )}
        {greska && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>}
        <button onClick={posalji}
          disabled={radnja === "posalji" || !naziv.trim() || !pib.trim() || !vrednost || Number(vrednost) <= 0}
          className="px-5 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50">
          {radnja === "posalji" ? "Šaljem…" : "Podnesi prijavu"}
        </button>
      </div>

      {/* Moje prijave */}
      <div>
        <h2 className="font-semibold text-kolo-text mb-3">Moje prijave</h2>
        {ucitavanje ? (
          <p className="text-sm text-kolo-muted">Učitavanje…</p>
        ) : prijave.length === 0 ? (
          <div className="bg-kolo-surface border border-kolo-border rounded-2xl p-6 text-center text-sm text-kolo-muted">
            Nemate podnetih prijava.
          </div>
        ) : (
          <div className="space-y-3">
            {prijave.map((p) => (
              <div key={p.id} className="bg-kolo-surface border border-kolo-border rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-kolo-text">{p.naziv} <span className="text-kolo-muted font-normal">· PIB {p.pib}</span></p>
                    <p className="text-sm text-kolo-muted mt-0.5">{VRSTA_LABEL[p.vrstaDonacije]} · {p.vrednostRsd.toLocaleString("sr-RS")} RSD</p>
                    <p className="text-xs mt-1 font-semibold text-kolo-gold-600">{STATUS_LABEL[p.status]}</p>
                    {p.status === "ODBIJENA" && p.odbijenoRazlog && (
                      <p className="text-xs text-kolo-danger mt-0.5">Razlog: {p.odbijenoRazlog}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button onClick={() => setOtvoreniUgovor(otvoreniUgovor === p.id ? null : p.id)}
                      className="px-2.5 py-1 bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold rounded-lg">
                      {otvoreniUgovor === p.id ? "Sakrij ugovor" : "Prikaži ugovor"}
                    </button>
                    {p.status === "CEKA_POTPIS" && (
                      <button onClick={() => potpisi(p.id)} disabled={radnja === p.id}
                        className="px-2.5 py-1 bg-kolo-green-700 text-white text-xs font-semibold rounded-lg disabled:opacity-60">
                        {radnja === p.id ? "…" : "Potpiši"}
                      </button>
                    )}
                  </div>
                </div>
                {otvoreniUgovor === p.id && (
                  <pre className="mt-3 text-xs text-kolo-text whitespace-pre-wrap font-sans bg-kolo-bg rounded-xl p-4">{p.ugovorTekst}</pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
