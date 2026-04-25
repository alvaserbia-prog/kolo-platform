"use client";

import Link from "next/link";
import ClanPretraga from "@/components/ClanPretraga";
import { useTranslations } from "next-intl";

interface Krug {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  balance: number;
  clanovi: number;
}

interface Props {
  krugovi: Krug[];
  mojaKrug: { id: string; name: string; isAdmin: boolean } | null;
  imaOsnivanjeZahtev: boolean;
  isVerified: boolean;
}

export default function KrugKlijent({ krugovi, mojaKrug, imaOsnivanjeZahtev, isVerified }: Props) {
  const t = useTranslations("krug");
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="kolo-naslov">{t("naslov")}</h1>
        {isVerified && !mojaKrug && !imaOsnivanjeZahtev && (
          <Link
            href="/krug/osnivanje"
            className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
          >
            {t("osnuj_krug")}
          </Link>
        )}
      </div>

      {/* Pretraga članova */}
      <ClanPretraga />

      {/* Status mog članstva */}
      {mojaKrug && (
        <div className="bg-kolo-green-100 border border-kolo-green-100 rounded-2xl px-5 py-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-kolo-green-900">{t("clan_krugovi_naslov")}</p>
            <p className="text-sm text-kolo-green-700 mt-0.5">{mojaKrug.name}
              {mojaKrug.isAdmin && <span className="ml-2 text-xs bg-kolo-green-100 text-kolo-green-900 px-2 py-0.5 rounded font-medium">{t("clan_admin_badge")}</span>}
            </p>
          </div>
          <Link
            href={`/krug/${mojaKrug.id}`}
            className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
          >
            {t("moja_krug_dugme")}
          </Link>
        </div>
      )}

      {imaOsnivanjeZahtev && !mojaKrug && (
        <div className="bg-kolo-gold-100 border border-kolo-gold-100 rounded-2xl px-5 py-4 text-sm text-kolo-gold-600">
          {t("osnivanje_na_cekanju")}
        </div>
      )}

      {/* Lista krug */}
      {krugovi.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-10 text-center text-sm text-kolo-muted">
          {t("nema_krug")}
          {isVerified && (
            <> <Link href="/krug/osnivanje" className="text-kolo-green-700 hover:underline ml-1">{t("osnujte_prvu")}</Link></>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {krugovi.map((z) => (
            <Link
              key={z.id}
              href={`/krug/${z.id}`}
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
                  <p className="text-xs text-kolo-muted text-center">{z.clanovi} {z.clanovi === 1 ? t("clan_count_1") : t("clan_count_vise")}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
