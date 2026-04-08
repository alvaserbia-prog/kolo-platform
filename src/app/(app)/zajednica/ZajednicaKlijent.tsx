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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Zajednica</h1>
        {isVerified && !mojaZadruga && !imaOsnivanjeZahtev && (
          <Link
            href="/zajednica/osnivanje"
            className="px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors"
          >
            + Osnuj zadrugu
          </Link>
        )}
      </div>

      {/* Pretraga članova */}
      <ClanPretraga />

      {/* Status mog članstva */}
      {mojaZadruga && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-green-800">Član ste zadruge</p>
            <p className="text-sm text-green-700 mt-0.5">{mojaZadruga.name}
              {mojaZadruga.isAdmin && <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded font-medium">Admin</span>}
            </p>
          </div>
          <Link
            href={`/zajednica/${mojaZadruga.id}`}
            className="px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors"
          >
            Moja zadruga →
          </Link>
        </div>
      )}

      {imaOsnivanjeZahtev && !mojaZadruga && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-700">
          Zahtev za osnivanje zadruge je na čekanju. Admin UO pregleda zahtev.
        </div>
      )}

      {/* Lista zadruga */}
      {zadruge.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-sm text-gray-400">
          Još nema registrovanih zadruga.
          {isVerified && (
            <> <Link href="/zajednica/osnivanje" className="text-green-700 hover:underline ml-1">Osnujte prvu!</Link></>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {zadruge.map((z) => (
            <Link
              key={z.id}
              href={`/zajednica/${z.id}`}
              className="block bg-white rounded-2xl border border-gray-200 p-5 hover:border-green-300 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{z.name}</p>
                  {z.description && (
                    <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">{z.description}</p>
                  )}
                  {z.location && (
                    <p className="text-xs text-gray-400 mt-1">{z.location}</p>
                  )}
                </div>
                <div className="shrink-0 text-right space-y-1">
                  <div className="bg-green-50 rounded-xl px-3 py-1.5 text-center">
                    <p className="text-sm font-bold text-green-700">{z.balance.toLocaleString("sr-RS")}</p>
                    <p className="text-xs text-green-600">POEN</p>
                  </div>
                  <p className="text-xs text-gray-400 text-center">{z.clanovi} {z.clanovi === 1 ? "član" : "članova"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
