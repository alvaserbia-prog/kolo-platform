"use client";

import Link from "next/link";
import ClanPretraga from "@/components/ClanPretraga";

interface Zadruga {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  balance: number;
  clanovi: number;
}

interface Props {
  zadruge: Zadruga[];
  mojaZadruga: { id: string; name: string; isAdmin: boolean } | null;
  imaOsnivanjeZahtev: boolean;
  isVerified: boolean;
}

export default function ZajednicaKlijent({ zadruge, mojaZadruga, imaOsnivanjeZahtev, isVerified }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-kolo-text">Zajednica</h1>
        {isVerified && !mojaZadruga && !imaOsnivanjeZahtev && (
          <Link
            href="/zajednica/osnivanje"
            className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
          >
            + Osnuj zadrugu
          </Link>
        )}
      </div>

      {/* Pretraga članova */}
      <ClanPretraga />

      {/* Status mog članstva */}
      {mojaZadruga && (
        <div className="bg-kolo-green-100 border border-kolo-green-100 rounded-2xl px-5 py-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-kolo-green-900">Član ste zadruge</p>
            <p className="text-sm text-kolo-green-700 mt-0.5">{mojaZadruga.name}
              {mojaZadruga.isAdmin && <span className="ml-2 text-xs bg-kolo-green-100 text-kolo-green-900 px-2 py-0.5 rounded font-medium">Admin</span>}
            </p>
          </div>
          <Link
            href={`/zajednica/${mojaZadruga.id}`}
            className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
          >
            Moja zadruga →
          </Link>
        </div>
      )}

      {imaOsnivanjeZahtev && !mojaZadruga && (
        <div className="bg-kolo-gold-100 border border-kolo-gold-100 rounded-2xl px-5 py-4 text-sm text-kolo-gold-600">
          Zahtev za osnivanje zadruge je na čekanju. Admin UO pregleda zahtev.
        </div>
      )}

      {/* Lista zadruga */}
      {zadruge.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-10 text-center text-sm text-kolo-muted">
          Još nema registrovanih zadruga.
          {isVerified && (
            <> <Link href="/zajednica/osnivanje" className="text-kolo-green-700 hover:underline ml-1">Osnujte prvu!</Link></>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {zadruge.map((z) => (
            <Link
              key={z.id}
              href={`/zajednica/${z.id}`}
              className="block bg-white rounded-2xl border border-kolo-border p-5 hover:border-kolo-green-100 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-kolo-text">{z.name}</p>
                  {z.description && (
                    <p className="text-sm text-kolo-muted mt-0.5 line-clamp-2">{z.description}</p>
                  )}
                  {z.location && (
                    <p className="text-xs text-kolo-muted mt-1">{z.location}</p>
                  )}
                </div>
                <div className="shrink-0 text-right space-y-1">
                  <div className="bg-kolo-green-100 rounded-xl px-3 py-1.5 text-center">
                    <p className="text-sm font-bold text-kolo-green-700">{z.balance.toLocaleString("sr-RS")}</p>
                    <p className="text-xs text-kolo-green-700">POEN</p>
                  </div>
                  <p className="text-xs text-kolo-muted text-center">{z.clanovi} {z.clanovi === 1 ? "član" : "članova"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
