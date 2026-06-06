"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface NadzorPravilo {
  kod: string;
  nivo: string;
  opis: string;
}
export interface NadzorNalaz {
  id: string;
  tip: string; // "NALOG" | "GRUPA"
  subjektId: string | null;
  pseudonim: string | null;
  clanovi: { id: string; pseudonim: string }[] | null;
  pravila: NadzorPravilo[];
  rizik: number;
  nivo: string; // "INFO" | "UPOZORENJE" | "HITNO"
  createdAt: string;
}

const NIVO_STIL: Record<string, string> = {
  HITNO: "bg-red-100 text-red-700 border-red-200",
  UPOZORENJE: "bg-amber-100 text-amber-700 border-amber-200",
  INFO: "bg-gray-100 text-gray-600 border-gray-200",
};
const NIVO_ZNAK: Record<string, string> = { HITNO: "🔴", UPOZORENJE: "🟠", INFO: "🟡" };

export default function NadzorTab({ nalazi }: { nalazi: NadzorNalaz[] }) {
  const router = useRouter();
  const [otvoren, setOtvoren] = useState<string | null>(null);
  const [radim, setRadim] = useState<string | null>(null);

  async function oznaciCisto(id: string) {
    if (!confirm("Označiti ovaj nalaz kao čistu (lažnu uzbunu)? Sklanja se sa spiska.")) return;
    setRadim(id);
    try {
      const res = await fetch(`/api/admin/nadzor/${id}/cisto`, { method: "POST" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j.error ?? "Greška.");
      } else {
        router.refresh();
      }
    } finally {
      setRadim(null);
    }
  }

  const hitno = nalazi.filter((n) => n.nivo === "HITNO").length;
  const upoz = nalazi.filter((n) => n.nivo === "UPOZORENJE").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-kolo-text">Nadzor integriteta verifikacija</h2>
          <p className="text-sm text-kolo-muted">
            Sistem samo posmatra i obeležava — nijedna radnja nije automatska. Gašenje povlači čovek.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="px-2.5 py-1 rounded-full border border-red-200 bg-red-100 text-red-700">🔴 {hitno}</span>
          <span className="px-2.5 py-1 rounded-full border border-amber-200 bg-amber-100 text-amber-700">🟠 {upoz}</span>
        </div>
      </div>

      {nalazi.length === 0 ? (
        <div className="rounded-lg border border-kolo-border bg-white p-8 text-center text-kolo-muted">
          Nema otvorenih nalaza. (Cron se pokreće noću — spisak je prazan dok prvi put ne odradi.)
        </div>
      ) : (
        <div className="divide-y divide-kolo-border rounded-lg border border-kolo-border bg-white">
          {nalazi.map((n) => {
            const naslov =
              n.tip === "GRUPA" ? `Grupa (${n.clanovi?.length ?? 0} naloga)` : n.pseudonim ?? n.subjektId ?? "—";
            const jeOtvoren = otvoren === n.id;
            return (
              <div key={n.id} className="p-3">
                <button
                  onClick={() => setOtvoren(jeOtvoren ? null : n.id)}
                  className="w-full flex items-center gap-3 text-left"
                >
                  <span className={`shrink-0 px-2 py-0.5 rounded border text-xs font-medium ${NIVO_STIL[n.nivo] ?? NIVO_STIL.INFO}`}>
                    {NIVO_ZNAK[n.nivo] ?? "🟡"} {n.rizik}
                  </span>
                  <span className="font-medium text-kolo-text">{naslov}</span>
                  <span className="flex gap-1 flex-wrap">
                    {n.pravila.map((p) => (
                      <span key={p.kod} className="px-1.5 py-0.5 rounded bg-kolo-bg text-xs text-kolo-muted border border-kolo-border">
                        {p.kod}
                      </span>
                    ))}
                  </span>
                  <span className="ml-auto text-kolo-muted text-sm">{jeOtvoren ? "▴" : "▾"}</span>
                </button>

                {jeOtvoren && (
                  <div className="mt-3 pl-1 space-y-3 text-sm">
                    <ul className="space-y-1">
                      {n.pravila.map((p) => (
                        <li key={p.kod} className="text-kolo-text">
                          <span className="font-medium">{NIVO_ZNAK[p.nivo] ?? "🟡"} {p.kod}</span> — {p.opis}
                        </li>
                      ))}
                    </ul>

                    {n.tip === "GRUPA" && n.clanovi && (
                      <div>
                        <div className="text-kolo-muted mb-1">Nalozi u grupi:</div>
                        <div className="flex flex-wrap gap-2">
                          {n.clanovi.map((c) => (
                            <Link key={c.id} href={`/profil/${c.id}`} className="text-kolo-green-700 hover:underline">
                              {c.pseudonim}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      {n.subjektId && (
                        <Link
                          href={`/profil/${n.subjektId}`}
                          className="px-3 py-1.5 rounded border border-kolo-border text-kolo-text hover:bg-kolo-bg"
                        >
                          Otvori profil
                        </Link>
                      )}
                      <button
                        onClick={() => oznaciCisto(n.id)}
                        disabled={radim === n.id}
                        className="px-3 py-1.5 rounded border border-kolo-border text-kolo-text hover:bg-kolo-bg disabled:opacity-50"
                      >
                        {radim === n.id ? "..." : "Označi kao čisto"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
