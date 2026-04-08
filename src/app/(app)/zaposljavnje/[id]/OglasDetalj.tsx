"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MojaPrijava {
  id: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
}

interface EvidencijaItem {
  id: string;
  date: string;
  hoursWorked: number;
  amount: number;
  description: string;
  status: string;
}

interface OglasData {
  id: string;
  title: string;
  description: string;
  source: string;
  hourlyRate: number;
  maxHoursPerDay: number;
  positions: number;
  deadline: string | null;
  status: string;
  createdByPseudonim: string;
  zadrugaName: string | null;
  odobreniClanovi: number;
  createdAt: string;
  mojaPrijava: MojaPrijava | null;
  mojeEvidencije: EvidencijaItem[];
}

const sourceLabel: Record<string, string> = { FONDACIJA: "Fondacija", ZADRUGA: "Zadruga", PROJEKAT: "Projekat" };
const sourceCls: Record<string, string> = {
  FONDACIJA: "bg-kolo-green-100 text-kolo-green-700",
  ZADRUGA: "bg-blue-50 text-blue-700",
  PROJEKAT: "bg-purple-50 text-purple-700",
};
const evStatusBadge: Record<string, { label: string; cls: string }> = {
  PENDING:  { label: "Na čekanju", cls: "text-amber-600" },
  APPROVED: { label: "Odobreno",   cls: "text-blue-600" },
  REJECTED: { label: "Odbijeno",   cls: "text-red-500" },
  EMITTED:  { label: "Isplaćeno",  cls: "text-green-600" },
};

export default function OglasDetalj({ oglas, isVerified }: { oglas: OglasData; isVerified: boolean }) {
  const router = useRouter();
  const [loadingPrijava, setLoadingPrijava] = useState(false);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  const aktivan = oglas.status === "ACTIVE";
  const mozePrijaviti = isVerified && aktivan && !oglas.mojaPrijava;
  const imaOdobrenuPrijavu = oglas.mojaPrijava?.status === "APPROVED";

  async function prijavi() {
    setLoadingPrijava(true); setPoruka(null);
    const res = await fetch(`/api/zaposljavnje/${oglas.id}/prijavi`, { method: "POST" });
    const data = await res.json();
    setLoadingPrijava(false);
    setPoruka({ text: res.ok ? "Prijava podneta! Čekajte odobrenje admina." : (data.error ?? "Greška."), ok: res.ok });
    if (res.ok) setTimeout(() => router.refresh(), 1200);
  }

  const zaradaMin = oglas.maxHoursPerDay * oglas.hourlyRate;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/zaposljavnje" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">← Zapošljavanje</Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${sourceCls[oglas.source] ?? "bg-gray-100 text-gray-500"}`}>
                {sourceLabel[oglas.source] ?? oglas.source}
              </span>
              {oglas.zadrugaName && <span className="text-xs text-gray-400">{oglas.zadrugaName}</span>}
              {!aktivan && <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded">Zatvoren</span>}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{oglas.title}</h1>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{oglas.description}</p>
          </div>
          <div className="shrink-0 bg-green-50 rounded-2xl px-4 py-3 text-center">
            <p className="text-lg font-bold text-green-700">{oglas.hourlyRate.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-green-600">POEN/sat</p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="font-semibold text-gray-900">{oglas.positions}</p>
            <p className="text-xs text-gray-400 mt-0.5">{oglas.positions === 1 ? "mesto" : "mesta"}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="font-semibold text-gray-900">max {oglas.maxHoursPerDay}h</p>
            <p className="text-xs text-gray-400 mt-0.5">po danu</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="font-semibold text-green-700">{zaradaMin.toLocaleString("sr-RS")} P</p>
            <p className="text-xs text-gray-400 mt-0.5">max/dan</p>
          </div>
        </div>

        {oglas.deadline && (
          <p className="text-xs text-gray-400">
            Rok za prijavu: <strong className="text-gray-700">{new Date(oglas.deadline).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" })}</strong>
          </p>
        )}

        {/* Status prijave */}
        {oglas.mojaPrijava && (
          <div className={`rounded-xl px-4 py-3 text-sm border ${
            oglas.mojaPrijava.status === "APPROVED" ? "bg-green-50 border-green-200 text-green-700" :
            oglas.mojaPrijava.status === "REJECTED" ? "bg-red-50 border-red-200 text-red-600" :
            "bg-amber-50 border-amber-200 text-amber-700"
          }`}>
            {oglas.mojaPrijava.status === "APPROVED" && "Vaša prijava je odobrena. Možete unositi sate rada."}
            {oglas.mojaPrijava.status === "PENDING" && "Prijava je podneta i čeka odobrenje admina."}
            {oglas.mojaPrijava.status === "REJECTED" && (
              <span>Prijava je odbijena.{oglas.mojaPrijava.rejectionReason ? ` Razlog: ${oglas.mojaPrijava.rejectionReason}` : ""}</span>
            )}
          </div>
        )}

        {/* Akcije */}
        <div className="pt-1">
          {!isVerified && aktivan && (
            <p className="text-sm text-amber-600">Za prijavu je potrebna verifikacija identiteta.</p>
          )}
          {mozePrijaviti && (
            <button onClick={prijavi} disabled={loadingPrijava}
              className="w-full py-3 rounded-xl bg-kolo-green-700 text-white font-semibold hover:bg-kolo-green-800 transition-colors disabled:opacity-60">
              {loadingPrijava ? "Šaljem prijavu..." : "Prijavi se za ovaj oglas"}
            </button>
          )}
          {poruka && (
            <p className={`mt-3 text-sm px-4 py-2 rounded-xl ${poruka.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {poruka.text}
            </p>
          )}
        </div>
      </div>

      {/* Forma za evidenciju sati */}
      {imaOdobrenuPrijavu && aktivan && (
        <EvidencijaForma
          oglasId={oglas.id}
          maxHoursPerDay={oglas.maxHoursPerDay}
          hourlyRate={oglas.hourlyRate}
          onSuccess={() => router.refresh()}
        />
      )}

      {/* Istorija evidencija */}
      {oglas.mojeEvidencije.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Moja evidencija</h3>
          </div>
          {oglas.mojeEvidencije.map((e, i) => {
            const badge = evStatusBadge[e.status];
            return (
              <div key={e.id} className={`px-5 py-3 flex justify-between items-center gap-3 ${i < oglas.mojeEvidencije.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{new Date(e.date).toLocaleDateString("sr-RS", { day: "2-digit", month: "short", year: "numeric" })}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{e.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-gray-900">{e.hoursWorked}h · {e.amount.toLocaleString("sr-RS")} P</p>
                  <p className={`text-xs font-medium ${badge?.cls ?? ""}`}>{badge?.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Forma za unos sati ─────────────────────────────────────────────────────────

function EvidencijaForma({ oglasId, maxHoursPerDay, hourlyRate, onSuccess }: {
  oglasId: string;
  maxHoursPerDay: number;
  hourlyRate: number;
  onSuccess: () => void;
}) {
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [hoursWorked, setHoursWorked] = useState("8");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const sati = Number(hoursWorked);
  const iznos = !isNaN(sati) && sati > 0 ? sati * hourlyRate : 0;

  // Max datum = danas, min datum = 3 dana unazad
  const maxDate = new Date().toISOString().split("T")[0];
  const minDateObj = new Date(); minDateObj.setDate(minDateObj.getDate() - 3);
  const minDate = minDateObj.toISOString().split("T")[0];

  async function handleSubmit() {
    setError("");
    if (!hoursWorked || sati < 1 || sati > maxHoursPerDay) { setError(`Broj sati mora biti 1–${maxHoursPerDay}.`); return; }
    if (!description.trim() || description.trim().length < 10) { setError("Opis mora imati najmanje 10 karaktera."); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/zaposljavnje/${oglasId}/evidencija`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, hoursWorked: sati, description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Greška."); return; }
      setSuccess(true);
      setDescription(""); setHoursWorked("8");
      setTimeout(onSuccess, 1200);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 text-sm text-green-700">
        Evidencija podneta! Admin pregledava zahtev.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">Unesi sate rada</h3>
        {iznos > 0 && (
          <span className="text-sm font-bold text-green-700">{iznos.toLocaleString("sr-RS")} POEN</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Datum</label>
          <input type="date" value={date} min={minDate} max={maxDate}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-kolo-green-600" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Broj sati (1–{maxHoursPerDay})</label>
          <input type="number" min={1} max={maxHoursPerDay} step={1} value={hoursWorked}
            onChange={(e) => setHoursWorked(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-kolo-green-600" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Opis aktivnosti *</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Opišite šta ste radili (min. 10 karaktera)..."
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-kolo-green-600 resize-none" />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button onClick={handleSubmit} disabled={loading}
        className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors disabled:opacity-60">
        {loading ? "Šaljem..." : `Pošalji evidenciju · ${iznos.toLocaleString("sr-RS")} POEN`}
      </button>
    </div>
  );
}
