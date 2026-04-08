"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OglasItem {
  id: string;
  title: string;
  description: string;
  source: string;
  hourlyRate: number;
  maxHoursPerDay: number;
  positions: number;
  deadline: string | null;
  createdByPseudonim: string;
  zadrugaName: string | null;
  odobreniClanovi: number;
  createdAt: string;
  mojaPrijava: string | null;
}

const sourceLabel: Record<string, string> = {
  FONDACIJA: "Fondacija",
  ZADRUGA: "Zadruga",
  PROJEKAT: "Projekat",
};

const sourceCls: Record<string, string> = {
  FONDACIJA: "bg-kolo-green-100 text-kolo-green-700",
  ZADRUGA: "bg-kolo-info-light text-kolo-info",
  PROJEKAT: "bg-purple-50 text-purple-700",
};

const prijavaStatusBadge: Record<string, { label: string; cls: string }> = {
  PENDING:  { label: "Prijava na čekanju", cls: "bg-kolo-gold-100 text-kolo-gold-600 border-kolo-gold-100" },
  APPROVED: { label: "Prijava odobrena",   cls: "bg-kolo-green-100 text-kolo-green-700 border-kolo-green-100" },
  REJECTED: { label: "Prijava odbijena",   cls: "bg-kolo-danger-light text-kolo-danger border-kolo-danger/20" },
};

export default function ZaposljavanjeKlijent({ oglasi, isVerified }: { oglasi: OglasItem[]; isVerified: boolean }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-kolo-text">Zapošljavanje</h1>
        <p className="text-sm text-kolo-muted mt-1">Aktivni oglasi za angažovanje u sistemu</p>
      </div>

      {!isVerified && (
        <div className="bg-kolo-gold-100 border border-kolo-gold-100 rounded-2xl px-5 py-4 text-sm text-kolo-gold-600">
          Za prijavu na oglase potrebna je verifikacija identiteta.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-kolo-border p-4 grid grid-cols-3 gap-3 text-center text-sm">
        <div>
          <p className="text-lg font-bold text-kolo-text">{oglasi.length}</p>
          <p className="text-xs text-kolo-muted mt-0.5">aktivnih oglasa</p>
        </div>
        <div>
          <p className="text-lg font-bold text-kolo-text">1.000 – 2.500</p>
          <p className="text-xs text-kolo-muted mt-0.5">POEN/sat</p>
        </div>
        <div>
          <p className="text-lg font-bold text-kolo-text">max 8h</p>
          <p className="text-xs text-kolo-muted mt-0.5">po danu</p>
        </div>
      </div>

      {oglasi.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-12 text-center text-sm text-kolo-muted">
          Trenutno nema aktivnih oglasa.
        </div>
      ) : (
        <div className="space-y-3">
          {oglasi.map((oglas) => (
            <OglasKartica key={oglas.id} oglas={oglas} isVerified={isVerified} />
          ))}
        </div>
      )}
    </div>
  );
}

function OglasKartica({ oglas, isVerified }: { oglas: OglasItem; isVerified: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  const badge = oglas.mojaPrijava ? prijavaStatusBadge[oglas.mojaPrijava] : null;
  const mozePrijaviti = isVerified && !oglas.mojaPrijava;

  async function prijavi() {
    setLoading(true); setPoruka(null);
    const res = await fetch(`/api/zaposljavnje/${oglas.id}/prijavi`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    setPoruka({ text: res.ok ? "Prijava podneta! Čekajte odobrenje." : (data.error ?? "Greška."), ok: res.ok });
    if (res.ok) setTimeout(() => router.refresh(), 1200);
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
      <div className="px-5 py-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${sourceCls[oglas.source] ?? "bg-kolo-bg text-kolo-muted"}`}>
                {sourceLabel[oglas.source] ?? oglas.source}
              </span>
              {oglas.zadrugaName && (
                <span className="text-xs text-kolo-muted">{oglas.zadrugaName}</span>
              )}
              {badge && (
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${badge.cls}`}>
                  {badge.label}
                </span>
              )}
            </div>
            <Link href={`/zaposljavnje/${oglas.id}`} className="font-semibold text-kolo-text hover:text-kolo-green-700 transition-colors">
              {oglas.title}
            </Link>
            <p className="text-xs text-kolo-muted mt-1 line-clamp-2">{oglas.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-kolo-green-700">{oglas.hourlyRate.toLocaleString("sr-RS")} P/h</p>
            <p className="text-xs text-kolo-muted mt-0.5">max {oglas.maxHoursPerDay}h/dan</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-xs text-kolo-muted">
            <span>{oglas.positions} {oglas.positions === 1 ? "mesto" : "mesta"} · {oglas.odobreniClanovi} odobreno</span>
            {oglas.deadline && (
              <span>Rok: {new Date(oglas.deadline).toLocaleDateString("sr-RS", { day: "2-digit", month: "short" })}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/zaposljavnje/${oglas.id}`}
              className="text-xs text-kolo-muted hover:text-kolo-green-700 transition-colors">
              Detalji →
            </Link>
            {mozePrijaviti && (
              <button onClick={prijavi} disabled={loading}
                className="px-3 py-1.5 bg-kolo-green-700 text-white text-xs font-semibold rounded-xl hover:bg-kolo-green-800 transition-colors disabled:opacity-60">
                {loading ? "..." : "Prijavi se"}
              </button>
            )}
            {oglas.mojaPrijava === "APPROVED" && (
              <Link href={`/zaposljavnje/${oglas.id}`}
                className="px-3 py-1.5 bg-kolo-green-700 text-white text-xs font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors">
                Unesi sate
              </Link>
            )}
          </div>
        </div>

        {poruka && (
          <p className={`mt-3 text-xs px-3 py-2 rounded-xl ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>
            {poruka.text}
          </p>
        )}
      </div>
    </div>
  );
}
