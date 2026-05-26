"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Zadatak {
  id: string;
  naslov: string;
  opis: string;
  cilj: string;
  izvor: string;
  mod: "PO_SATU" | "U_CELOSTI";
  stopaPoSatu: number | null;
  maxSati: number | null;
  iznosUCelosti: number | null;
  predlozeniPoen: number;
  brojIzvrsilaca: number;
  minIndeks: number;
  saOdobravanjem: boolean;
  rokPrijave: string | null;
  rokIzvrsenja: string | null;
  status: string;
  createdByPseudonim: string;
  krugName: string | null;
  primljeniIzvrsioci: number;
  createdAt: string;
  mojaPrijava: "PODNETA" | "PRIMLJENA" | "ODBIJENA" | "ODUSTAO" | null;
}

const izvorLabel: Record<string, string> = { FONDACIJA: "Fondacija", KRUG: "Krug", PROJEKAT: "Projekat" };
const izvorCls: Record<string, string> = {
  FONDACIJA: "bg-kolo-green-100 text-kolo-green-700",
  KRUG: "bg-kolo-info-light text-kolo-info",
  PROJEKAT: "bg-purple-50 text-purple-700",
};

const prijavaStatusLabel: Record<string, string> = {
  PODNETA: "Prijava podneta — čeka odobravanje",
  PRIMLJENA: "Prijavljen/a",
  ODBIJENA: "Prijava odbijena",
  ODUSTAO: "Odustali ste",
};
const prijavaStatusCls: Record<string, string> = {
  PODNETA: "bg-kolo-gold-100 text-kolo-gold-600",
  PRIMLJENA: "bg-kolo-green-100 text-kolo-green-700",
  ODBIJENA: "bg-kolo-danger-light text-kolo-danger",
  ODUSTAO: "bg-kolo-bg text-kolo-muted",
};

function modLabel(z: Zadatak): string {
  if (z.mod === "PO_SATU") return `Po satu (${(z.stopaPoSatu ?? 0).toLocaleString("sr-RS")} POEN/sat)`;
  return `U celosti (${(z.iznosUCelosti ?? 0).toLocaleString("sr-RS")} POEN)`;
}

export default function ZadaciKlijent({ isVerified }: { isVerified: boolean }) {
  const [zadaci, setZadaci] = useState<Zadatak[]>([]);
  const [loading, setLoading] = useState(true);
  const [otvoreniForm, setOtvoreniForm] = useState<string | null>(null);

  const ucitaj = useCallback(async () => {
    const res = await fetch("/api/zadaci");
    if (res.ok) {
      const data = await res.json();
      setZadaci(data.zadaci ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { ucitaj(); }, [ucitaj]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-kolo-text">Operativni doprinos</h1>
        <p className="text-sm text-kolo-muted mt-1">Zadaci za zajedničko dobro — prijavi se, izvrši i evidentiraj doprinos.</p>
      </div>

      {!isVerified && (
        <div className="bg-kolo-gold-100 border border-kolo-gold-100 rounded-2xl px-5 py-4 text-sm text-kolo-gold-600">
          Pregled zadataka je dostupan, ali za prijavu i izvršenje potrebna je verifikacija.
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">Učitavanje...</div>
      ) : zadaci.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">Trenutno nema objavljenih zadataka.</div>
      ) : (
        <div className="space-y-3">
          {zadaci.map((z) => (
            <ZadatakKartica
              key={z.id}
              z={z}
              isVerified={isVerified}
              formOpen={otvoreniForm === z.id}
              onToggleForm={() => setOtvoreniForm(otvoreniForm === z.id ? null : z.id)}
              onPrijavljen={() => { setOtvoreniForm(null); ucitaj(); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ZadatakKartica({ z, isVerified, formOpen, onToggleForm, onPrijavljen }: {
  z: Zadatak;
  isVerified: boolean;
  formOpen: boolean;
  onToggleForm: () => void;
  onPrijavljen: () => void;
}) {
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function prijaviSe() {
    setError("");
    if (plan.trim().length < 10) { setError("Plan izvršenja mora imati najmanje 10 znakova."); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/zadaci/${z.id}/prijavi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planIzvrsenja: plan.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Greška."); return; }
      setPlan("");
      onPrijavljen();
    } finally {
      setLoading(false);
    }
  }

  const mozePrijaviti = isVerified && (z.status === "OBJAVLJEN" || z.status === "U_IZVRSENJU") && (z.mojaPrijava === null || z.mojaPrijava === "ODUSTAO" || z.mojaPrijava === "ODBIJENA");

  return (
    <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${izvorCls[z.izvor] ?? "bg-kolo-bg text-kolo-muted"}`}>{izvorLabel[z.izvor] ?? z.izvor}</span>
          {z.krugName && <span className="text-xs text-kolo-muted">{z.krugName}</span>}
          <span className="text-xs px-2 py-0.5 rounded bg-kolo-bg text-kolo-muted">{z.status}</span>
        </div>
        <Link href={`/zadaci/${z.id}`} className="font-semibold text-kolo-text hover:text-kolo-green-700 transition-colors">
          {z.naslov}
        </Link>
        <p className="text-sm text-kolo-muted mt-1 line-clamp-2">{z.opis}</p>
        <p className="text-xs text-kolo-muted mt-2">
          {modLabel(z)} · procena {z.predlozeniPoen.toLocaleString("sr-RS")} POEN · {z.primljeniIzvrsioci}/{z.brojIzvrsilaca} izvršilaca
        </p>
        <div className="flex gap-3 text-xs text-kolo-muted mt-1 flex-wrap">
          {z.rokPrijave && <span>Rok prijave: {new Date(z.rokPrijave).toLocaleDateString("sr-RS")}</span>}
          {z.rokIzvrsenja && <span>Rok izvršenja: {new Date(z.rokIzvrsenja).toLocaleDateString("sr-RS")}</span>}
          <span>Postavio/la: {z.createdByPseudonim}</span>
        </div>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <Link href={`/zadaci/${z.id}`} className="text-xs px-3 py-1.5 border border-kolo-border text-kolo-muted rounded-xl hover:bg-kolo-bg transition-colors">
            Detalji
          </Link>
          {z.mojaPrijava && z.mojaPrijava !== "ODUSTAO" && z.mojaPrijava !== "ODBIJENA" ? (
            <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${prijavaStatusCls[z.mojaPrijava]}`}>
              {prijavaStatusLabel[z.mojaPrijava]}
            </span>
          ) : mozePrijaviti ? (
            <button onClick={onToggleForm}
              className="text-xs px-3 py-1.5 bg-kolo-green-700 text-white font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors">
              {formOpen ? "Zatvori" : z.mojaPrijava === "ODBIJENA" ? "Pokušaj ponovo" : "Prijavi se"}
            </button>
          ) : !isVerified ? (
            <span className="text-xs text-kolo-muted">Potrebna verifikacija za prijavu</span>
          ) : z.mojaPrijava ? (
            <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${prijavaStatusCls[z.mojaPrijava]}`}>
              {prijavaStatusLabel[z.mojaPrijava]}
            </span>
          ) : null}
        </div>
      </div>

      {formOpen && mozePrijaviti && (
        <div className="border-t border-kolo-border px-5 py-4 space-y-3">
          <label className="block text-xs font-semibold text-kolo-muted">Plan izvršenja (min. 10 znakova)</label>
          <textarea rows={3} value={plan} onChange={(e) => setPlan(e.target.value)}
            placeholder="Opišite kako planirate da izvršite zadatak..."
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none" />
          {error && <p className="text-xs text-kolo-danger">{error}</p>}
          <div className="flex gap-2">
            <button onClick={onToggleForm} className="flex-1 py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium">Otkaži</button>
            <button onClick={prijaviSe} disabled={loading || plan.trim().length < 10}
              className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold disabled:opacity-60">
              {loading ? "..." : "Pošalji prijavu"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
