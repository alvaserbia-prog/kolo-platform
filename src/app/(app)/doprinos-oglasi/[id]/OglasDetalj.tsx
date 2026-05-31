"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MojaPrijava {
  id: string;
  status: string;
  planIzvrsenja: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

interface EvidencijaItem {
  id: string;
  date: string;
  predlozeniPoen: number;
  amount: number;
  dokaz: string | null;
  description: string;
  status: string;
}

interface OglasData {
  id: string;
  title: string;
  description: string;
  source: string;
  predlozeniPoen: number;
  obrazlozenje: string | null;
  saOdobravanjem: boolean;
  positions: number;
  deadline: string | null;
  status: string;
  createdByPseudonim: string;
  krugName: string | null;
  odobreniClanovi: number;
  createdAt: string;
  mojaPrijava: MojaPrijava | null;
  mojeEvidencije: EvidencijaItem[];
}

const sourceLabel: Record<string, string> = { FONDACIJA: "Fondacija", KRUG: "Krug", PROJEKAT: "Projekat" };
const sourceCls: Record<string, string> = {
  FONDACIJA: "bg-kolo-green-100 text-kolo-green-700",
  KRUG: "bg-kolo-info-light text-kolo-info",
  PROJEKAT: "bg-purple-50 text-purple-700",
};
const evStatusBadge: Record<string, { label: string; cls: string }> = {
  PENDING:  { label: "Čeka verifikaciju", cls: "text-kolo-gold-600" },
  APPROVED: { label: "Potvrđeno — u raspodeli", cls: "text-kolo-info" },
  REJECTED: { label: "Odbijeno",   cls: "text-red-500" },
  EMITTED:  { label: "Evidentirano",  cls: "text-kolo-green-700" },
};

export default function OglasDetalj({ oglas, isVerified }: { oglas: OglasData; isVerified: boolean }) {
  const router = useRouter();
  const [loadingPrijava, setLoadingPrijava] = useState(false);
  const [plan, setPlan] = useState("");
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  const aktivan = oglas.status === "ACTIVE";
  const mozePrijaviti = isVerified && aktivan && !oglas.mojaPrijava;
  const imaPrimljenuPrijavu = oglas.mojaPrijava?.status === "APPROVED";
  const mestaPopunjena = oglas.odobreniClanovi >= oglas.positions;

  async function prijavi() {
    if (oglas.saOdobravanjem && plan.trim().length < 10) {
      setPoruka({ text: "Za ovaj zadatak je obavezan plan izvršenja (min. 10 karaktera).", ok: false });
      return;
    }
    setLoadingPrijava(true); setPoruka(null);
    const res = await fetch(`/api/doprinos-oglasi/${oglas.id}/prijavi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planIzvrsenja: plan.trim() || undefined }),
    });
    const data = await res.json();
    setLoadingPrijava(false);
    setPoruka({
      text: res.ok
        ? (data.primljen ? "Prijava primljena — postali ste izvršilac." : "Prijava podneta — čeka odobrenje plana od verifikatora.")
        : (data.error ?? "Greška."),
      ok: res.ok,
    });
    if (res.ok) setTimeout(() => router.refresh(), 1200);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/doprinos-oglasi" className="text-kolo-muted hover:text-kolo-muted text-sm transition-colors">← Operativni doprinos</Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${sourceCls[oglas.source] ?? "bg-kolo-bg text-kolo-muted"}`}>
                {sourceLabel[oglas.source] ?? oglas.source}
              </span>
              {oglas.krugName && <span className="text-xs text-kolo-muted">{oglas.krugName}</span>}
              {oglas.saOdobravanjem && <span className="text-xs bg-kolo-info-light text-kolo-info px-2 py-0.5 rounded">sa odobravanjem plana</span>}
              {!aktivan && <span className="text-xs bg-kolo-bg text-kolo-muted px-2 py-0.5 rounded">Zatvoren</span>}
            </div>
            <h1 className="text-xl font-bold text-kolo-text">{oglas.title}</h1>
            <p className="text-sm text-kolo-muted mt-2 leading-relaxed">{oglas.description}</p>
          </div>
          <div className="shrink-0 bg-kolo-green-100 rounded-2xl px-4 py-3 text-center">
            <p className="text-lg font-bold text-kolo-green-700">{oglas.predlozeniPoen.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-kolo-green-700">predloženi POEN</p>
          </div>
        </div>

        {oglas.obrazlozenje && (
          <div className="bg-kolo-bg rounded-xl p-3 text-sm text-kolo-muted">
            <span className="font-semibold text-kolo-text">Obrazloženje predloženog POEN-a: </span>{oglas.obrazlozenje}
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
          <div className="bg-kolo-bg rounded-xl p-3 text-center">
            <p className="font-semibold text-kolo-text">{oglas.odobreniClanovi}/{oglas.positions}</p>
            <p className="text-xs text-kolo-muted mt-0.5">izvršilaca</p>
          </div>
          <div className="bg-kolo-bg rounded-xl p-3 text-center">
            <p className="font-semibold text-kolo-green-700">{oglas.predlozeniPoen.toLocaleString("sr-RS")} P</p>
            <p className="text-xs text-kolo-muted mt-0.5">predloženi (težina)</p>
          </div>
        </div>

        <p className="text-xs text-kolo-muted leading-relaxed">
          Predloženi POEN nije garantovan iznos. Evidentirani POEN = predloženi × min(1, L/P), gde je L dnevni
          limit (10% opticaja), a P zbir predloženih POEN-a svih potvrđenih izvršenja u periodu (čl. 22–24).
        </p>

        {oglas.deadline && (
          <p className="text-xs text-kolo-muted">
            Rok za prijavu: <strong className="text-kolo-muted">{new Date(oglas.deadline).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" })}</strong>
          </p>
        )}

        {/* Status prijave */}
        {oglas.mojaPrijava && (
          <div className={`rounded-xl px-4 py-3 text-sm border ${
            oglas.mojaPrijava.status === "APPROVED" ? "bg-kolo-green-100 border-kolo-green-100 text-kolo-green-700" :
            oglas.mojaPrijava.status === "REJECTED" ? "bg-kolo-danger-light border-kolo-danger/20 text-kolo-danger" :
            "bg-kolo-gold-100 border-kolo-gold-100 text-kolo-gold-600"
          }`}>
            {oglas.mojaPrijava.status === "APPROVED" && "Primljeni ste kao izvršilac. Možete evidentirati dnevna izvršenja."}
            {oglas.mojaPrijava.status === "PENDING" && "Prijava je podneta i čeka odobrenje plana izvršenja od verifikatora."}
            {oglas.mojaPrijava.status === "REJECTED" && (
              <span>Prijava je odbijena.{oglas.mojaPrijava.rejectionReason ? ` Razlog: ${oglas.mojaPrijava.rejectionReason}` : ""}</span>
            )}
          </div>
        )}

        {/* Akcije */}
        <div className="pt-1 space-y-3">
          {!isVerified && aktivan && (
            <p className="text-sm text-kolo-gold-600">Za prijavu je potreban indeks stvarnosti od najmanje 10%.</p>
          )}
          {mozePrijaviti && mestaPopunjena && (
            <p className="text-sm text-kolo-muted">Sva mesta za izvršioce su popunjena.</p>
          )}
          {mozePrijaviti && !mestaPopunjena && (
            <>
              {oglas.saOdobravanjem && (
                <div>
                  <label className="block text-xs font-semibold text-kolo-muted mb-1">Plan izvršenja * (način, vremenski okvir, dokazivanje)</label>
                  <textarea rows={3} value={plan} onChange={(e) => setPlan(e.target.value)}
                    placeholder="Kako planirate da izvršite zadatak (min. 10 karaktera)..."
                    className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600 resize-none" />
                </div>
              )}
              <button onClick={prijavi} disabled={loadingPrijava}
                className="w-full py-3 rounded-xl bg-kolo-green-700 text-white font-semibold hover:bg-kolo-green-800 transition-colors disabled:opacity-60">
                {loadingPrijava ? "Šaljem prijavu..." : (oglas.saOdobravanjem ? "Prijavi se sa planom" : "Prijavi se za ovaj zadatak")}
              </button>
            </>
          )}
          {poruka && (
            <p className={`text-sm px-4 py-2 rounded-xl ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>
              {poruka.text}
            </p>
          )}
        </div>
      </div>

      {/* Forma za evidenciju dnevnog izvršenja */}
      {imaPrimljenuPrijavu && aktivan && (
        <EvidencijaForma
          oglasId={oglas.id}
          maxPredlozeni={oglas.predlozeniPoen}
          onSuccess={() => router.refresh()}
        />
      )}

      {/* Istorija izvršenja */}
      {oglas.mojeEvidencije.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          <div className="px-5 py-3 border-b border-kolo-border">
            <h3 className="text-sm font-semibold text-kolo-muted">Moja dnevna izvršenja</h3>
          </div>
          {oglas.mojeEvidencije.map((e, i) => {
            const badge = evStatusBadge[e.status];
            return (
              <div key={e.id} className={`px-5 py-3 flex justify-between items-center gap-3 ${i < oglas.mojeEvidencije.length - 1 ? "border-b border-kolo-border" : ""}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-kolo-text">{new Date(e.date).toLocaleDateString("sr-RS", { day: "2-digit", month: "short", year: "numeric" })}</p>
                  <p className="text-xs text-kolo-muted mt-0.5 line-clamp-1">{e.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-kolo-text">
                    {e.status === "EMITTED"
                      ? `${e.amount.toLocaleString("sr-RS")} P evidentirano`
                      : `${e.predlozeniPoen.toLocaleString("sr-RS")} P predloženo`}
                  </p>
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

// ── Forma za unos dnevnog izvršenja ─────────────────────────────────────────────

function EvidencijaForma({ oglasId, maxPredlozeni, onSuccess }: {
  oglasId: string;
  maxPredlozeni: number;
  onSuccess: () => void;
}) {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [predlozeniPoen, setPredlozeniPoen] = useState("");
  const [description, setDescription] = useState("");
  const [dokaz, setDokaz] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const predlozeni = Number(predlozeniPoen);

  // Max datum = danas, min datum = 3 dana unazad
  const maxDate = new Date().toISOString().split("T")[0];
  const minDateObj = new Date(); minDateObj.setDate(minDateObj.getDate() - 3);
  const minDate = minDateObj.toISOString().split("T")[0];

  async function handleSubmit() {
    setError("");
    if (!predlozeniPoen || !Number.isInteger(predlozeni) || predlozeni < 1) { setError("Predloženi POEN mora biti pozitivan ceo broj."); return; }
    if (predlozeni > maxPredlozeni) { setError(`Predloženi POEN dnevnog izvršenja ne može preći ${maxPredlozeni.toLocaleString("sr-RS")}.`); return; }
    if (!description.trim() || description.trim().length < 10) { setError("Opis mora imati najmanje 10 karaktera."); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/doprinos-oglasi/${oglasId}/evidencija`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, predlozeniPoen: predlozeni, description: description.trim(), dokaz: dokaz.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Greška."); return; }
      setSuccess(true);
      setDescription(""); setPredlozeniPoen(""); setDokaz("");
      setTimeout(onSuccess, 1200);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-kolo-green-100 border border-kolo-green-100 rounded-2xl px-5 py-4 text-sm text-kolo-green-700">
        Dnevno izvršenje podneto. Verifikator (nosilac ZRNA / UO) potvrđuje izvršenje.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-kolo-muted">Evidentiraj dnevno izvršenje</h3>
        {predlozeni > 0 && (
          <span className="text-sm font-bold text-kolo-green-700">{predlozeni.toLocaleString("sr-RS")} P predloženo</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">Datum</label>
          <input type="date" value={date} min={minDate} max={maxDate}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">Predloženi POEN (max {maxPredlozeni.toLocaleString("sr-RS")})</label>
          <input type="number" min={1} max={maxPredlozeni} step={1} value={predlozeniPoen}
            onChange={(e) => setPredlozeniPoen(e.target.value)}
            placeholder="npr. 5000"
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-kolo-muted mb-1">Opis izvršenja *</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Opišite šta ste uradili (min. 10 karaktera)..."
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600 resize-none" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-kolo-muted mb-1">Dokaz (link / referenca, opciono)</label>
        <input type="text" value={dokaz} onChange={(e) => setDokaz(e.target.value)}
          placeholder="Link na fotografiju, izveštaj, prilog..."
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600" />
      </div>

      {error && <p className="text-xs text-kolo-danger">{error}</p>}

      <button onClick={handleSubmit} disabled={loading}
        className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors disabled:opacity-60">
        {loading ? "Šaljem..." : "Pošalji dnevno izvršenje"}
      </button>
    </div>
  );
}
