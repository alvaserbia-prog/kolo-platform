"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Izvrsenje {
  id: string;
  datum: string;
  sati: number | null;
  dokaz: string;
  tezina: number;
  status: "PODNETO" | "POTVRDJENO" | "USLOVNO" | "ODBIJENO" | "EVIDENTIRANO";
  obrazlozenje: string | null;
  evidentiraniPoen: number | null;
  createdAt: string;
}

interface MojaPrijava {
  id: string;
  status: "PODNETA" | "PRIMLJENA" | "ODBIJENA" | "ODUSTAO";
  planIzvrsenja: string;
  odbijenaRazlog: string | null;
  izvrsenja: Izvrsenje[];
}

interface Zadatak {
  id: string;
  naslov: string;
  opis: string;
  cilj: string;
  kriterijumi: string;
  izvor: string;
  mod: "PO_SATU" | "U_CELOSTI";
  stopaPoSatu: number | null;
  maxSati: number | null;
  iznosUCelosti: number | null;
  gornjaGranica: number | null;
  predlozeniPoen: number;
  brojIzvrsilaca: number;
  minIndeks: number;
  saOdobravanjem: boolean;
  kvalFilter: string | null;
  rokPrijave: string | null;
  rokIzvrsenja: string | null;
  status: string;
  createdByPseudonim: string;
  krugName: string | null;
  primljeniIzvrsioci: number;
  createdAt: string;
}

const izvorLabel: Record<string, string> = { FONDACIJA: "Fondacija", KRUG: "Krug", PROJEKAT: "Projekat" };

const izvrsenjeStatus: Record<string, { label: string; cls: string }> = {
  PODNETO: { label: "Na verifikaciji", cls: "text-kolo-gold-600" },
  POTVRDJENO: { label: "Potvrđeno", cls: "text-kolo-green-700" },
  USLOVNO: { label: "Uslovno", cls: "text-kolo-info" },
  ODBIJENO: { label: "Odbijeno", cls: "text-kolo-danger" },
  EVIDENTIRANO: { label: "Evidentirano — POEN emitovan", cls: "text-kolo-green-700" },
};

function modLabel(z: Zadatak): string {
  if (z.mod === "PO_SATU") return `Po satu (${(z.stopaPoSatu ?? 0).toLocaleString("sr-RS")} POEN/sat${z.maxSati ? `, max ${z.maxSati}h` : ""})`;
  return `U celosti (${(z.iznosUCelosti ?? 0).toLocaleString("sr-RS")} POEN)`;
}

export default function ZadatakDetaljKlijent({ id, isVerified }: { id: string; isVerified: boolean }) {
  const [zadatak, setZadatak] = useState<Zadatak | null>(null);
  const [mojaPrijava, setMojaPrijava] = useState<MojaPrijava | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const ucitaj = useCallback(async () => {
    const res = await fetch(`/api/zadaci/${id}`);
    if (res.ok) {
      const data = await res.json();
      setZadatak(data.zadatak);
      setMojaPrijava(data.mojaPrijava);
    } else if (res.status === 404) {
      setNotFound(true);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { ucitaj(); }, [ucitaj]);

  async function odustani() {
    if (!confirm("Da li ste sigurni da želite da odustanete od ovog zadatka?")) return;
    const res = await fetch(`/api/zadaci/${id}/odustani`, { method: "POST" });
    if (res.ok) ucitaj();
    else { const d = await res.json(); alert(d.error ?? "Greška."); }
  }

  if (loading) return <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">Učitavanje...</div>;
  if (notFound || !zadatak) return (
    <div className="space-y-4">
      <Link href="/zadaci" className="text-sm text-kolo-green-700 hover:underline">← Nazad na zadatke</Link>
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">Zadatak nije pronađen.</div>
    </div>
  );

  const mozePodnetiIzvrsenje = isVerified && mojaPrijava?.status === "PRIMLJENA" && zadatak.status === "U_IZVRSENJU";
  const cekaOdobravanjePlana = zadatak.saOdobravanjem && mojaPrijava?.status === "PODNETA";

  return (
    <div className="space-y-5">
      <Link href="/zadaci" className="text-sm text-kolo-green-700 hover:underline">← Nazad na zadatke</Link>

      <div className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-kolo-green-100 text-kolo-green-700">{izvorLabel[zadatak.izvor] ?? zadatak.izvor}</span>
          {zadatak.krugName && <span className="text-xs text-kolo-muted">{zadatak.krugName}</span>}
          <span className="text-xs px-2 py-0.5 rounded bg-kolo-bg text-kolo-muted">{zadatak.status}</span>
        </div>
        <h1 className="text-2xl font-semibold text-kolo-text">{zadatak.naslov}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-kolo-bg rounded-xl px-3 py-2">
            <p className="text-sm font-bold text-kolo-text">{zadatak.predlozeniPoen.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-kolo-muted">procena POEN</p>
          </div>
          <div className="bg-kolo-bg rounded-xl px-3 py-2">
            <p className="text-sm font-bold text-kolo-text">{zadatak.primljeniIzvrsioci}/{zadatak.brojIzvrsilaca}</p>
            <p className="text-xs text-kolo-muted">izvršilaca</p>
          </div>
          <div className="bg-kolo-bg rounded-xl px-3 py-2">
            <p className="text-sm font-bold text-kolo-text">{zadatak.minIndeks}%</p>
            <p className="text-xs text-kolo-muted">min. indeks</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-kolo-muted uppercase tracking-wider mb-1">Način obračuna</p>
          <p className="text-sm text-kolo-text">{modLabel(zadatak)}{zadatak.gornjaGranica ? ` · gornja granica ${zadatak.gornjaGranica.toLocaleString("sr-RS")} POEN` : ""}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-kolo-muted uppercase tracking-wider mb-1">Opis</p>
          <p className="text-sm text-kolo-text whitespace-pre-wrap">{zadatak.opis}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-kolo-muted uppercase tracking-wider mb-1">Cilj</p>
          <p className="text-sm text-kolo-text whitespace-pre-wrap">{zadatak.cilj}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-kolo-muted uppercase tracking-wider mb-1">Kriterijumi</p>
          <p className="text-sm text-kolo-text whitespace-pre-wrap">{zadatak.kriterijumi}</p>
        </div>
        {zadatak.kvalFilter && (
          <div>
            <p className="text-xs font-semibold text-kolo-muted uppercase tracking-wider mb-1">Kvalifikacioni filter</p>
            <p className="text-sm text-kolo-text">{zadatak.kvalFilter}</p>
          </div>
        )}

        <div className="flex gap-4 text-xs text-kolo-muted flex-wrap">
          {zadatak.rokPrijave && <span>Rok prijave: {new Date(zadatak.rokPrijave).toLocaleDateString("sr-RS")}</span>}
          {zadatak.rokIzvrsenja && <span>Rok izvršenja: {new Date(zadatak.rokIzvrsenja).toLocaleDateString("sr-RS")}</span>}
          <span>Postavio/la: {zadatak.createdByPseudonim}</span>
        </div>
      </div>

      {/* Moja prijava */}
      {mojaPrijava && (
        <div className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
          <div className="flex justify-between items-start gap-3">
            <h2 className="text-base font-semibold text-kolo-text">Moja prijava</h2>
            {(mojaPrijava.status === "PODNETA" || mojaPrijava.status === "PRIMLJENA") && (
              <button onClick={odustani}
                className="text-xs px-3 py-1.5 border border-kolo-danger/20 text-kolo-danger rounded-xl hover:bg-kolo-danger-light transition-colors">
                Odustani
              </button>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-kolo-muted uppercase tracking-wider mb-1">Plan izvršenja</p>
            <p className="text-sm text-kolo-text whitespace-pre-wrap">{mojaPrijava.planIzvrsenja}</p>
          </div>

          {cekaOdobravanjePlana && (
            <div className="bg-kolo-gold-100 border border-kolo-gold-100 rounded-xl px-4 py-3 text-sm text-kolo-gold-600">
              Plan izvršenja čeka odobravanje.
            </div>
          )}

          {mojaPrijava.status === "ODBIJENA" && mojaPrijava.odbijenaRazlog && (
            <div className="bg-kolo-danger-light rounded-xl px-4 py-3 text-sm text-kolo-danger">
              Prijava odbijena: {mojaPrijava.odbijenaRazlog}
            </div>
          )}

          {/* Forma za izvršenje */}
          {mozePodnetiIzvrsenje && (
            <IzvrsenjeForma zadatakId={id} mod={zadatak.mod} maxSati={zadatak.maxSati} onSuccess={ucitaj} />
          )}

          {/* Lista mojih izvršenja */}
          {mojaPrijava.izvrsenja.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-kolo-muted uppercase tracking-wider">Moja izvršenja</p>
              {mojaPrijava.izvrsenja.map((iz) => {
                const st = izvrsenjeStatus[iz.status] ?? { label: iz.status, cls: "text-kolo-muted" };
                return (
                  <div key={iz.id} className="bg-kolo-bg rounded-xl px-4 py-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-kolo-muted">
                          {new Date(iz.datum).toLocaleDateString("sr-RS", { day: "2-digit", month: "short", year: "numeric" })}
                          {iz.sati != null && ` · ${iz.sati}h`}
                          {` · težina ${iz.tezina}`}
                        </p>
                        <p className="text-sm text-kolo-text mt-1 whitespace-pre-wrap">{iz.dokaz}</p>
                        {iz.obrazlozenje && <p className="text-xs text-kolo-muted mt-1">Obrazloženje: {iz.obrazlozenje}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-xs font-medium ${st.cls}`}>{st.label}</p>
                        {iz.evidentiraniPoen != null && (
                          <p className="text-sm font-semibold text-kolo-green-700 mt-0.5">{iz.evidentiraniPoen.toLocaleString("sr-RS")} P</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function IzvrsenjeForma({ zadatakId, mod, maxSati, onSuccess }: {
  zadatakId: string;
  mod: "PO_SATU" | "U_CELOSTI";
  maxSati: number | null;
  onSuccess: () => void;
}) {
  const [sati, setSati] = useState("");
  const [dokaz, setDokaz] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function posalji() {
    setError("");
    if (dokaz.trim().length < 10) { setError("Dokaz mora imati najmanje 10 znakova."); return; }
    const body: { sati?: number; dokaz: string } = { dokaz: dokaz.trim() };
    if (mod === "PO_SATU") {
      const s = Number(sati);
      const max = maxSati ?? 8;
      if (!sati || s < 1 || s > max) { setError(`Sati moraju biti između 1 i ${max}.`); return; }
      body.sati = s;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/zadaci/${zadatakId}/izvrsenje`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Greška."); return; }
      setSati(""); setDokaz("");
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t border-kolo-border pt-4 space-y-3">
      <p className="text-xs font-semibold text-kolo-muted uppercase tracking-wider">Podnesi izvršenje</p>
      {mod === "PO_SATU" && (
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">Sati (1–{maxSati ?? 8})</label>
          <input type="number" min={1} max={maxSati ?? 8} value={sati} onChange={(e) => setSati(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-kolo-muted mb-1">Dokaz izvršenja (min. 10 znakova)</label>
        <textarea rows={3} value={dokaz} onChange={(e) => setDokaz(e.target.value)}
          placeholder="Opišite šta je urađeno, priložite reference..."
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none" />
      </div>
      {error && <p className="text-xs text-kolo-danger">{error}</p>}
      <button onClick={posalji} disabled={loading || dokaz.trim().length < 10}
        className="w-full py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold disabled:opacity-60">
        {loading ? "..." : "Pošalji izvršenje"}
      </button>
    </div>
  );
}
