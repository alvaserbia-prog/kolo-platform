"use client";

import { useState } from "react";
import { intlTag } from "@/lib/format";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { formatCenaGlavni, prikaziJedinicuCene } from "@/lib/cena-oglas";
import { kategorijaKljuc } from "@/lib/kategorije";

interface Oglas {
  id: string;
  title: string;
  cenaTip: string;
  price: number | null;
  cenaDo: number | null;
  category: string;
  status: string;
  slike: number;
  createdAt: string;
  razmenjenoAt: string | null;
  /** Razlog uklanjanja od strane Fondacije (Uslovi čl. 25 st. 2). */
  uklonjenRazlog: string | null;
}

/** U arhivi je sve što nije aktivno: oglasi koje je oglašivač sklonio (EXPIRED),
 *  zatečeni razmenjeni (RAZMENJEN) i oni koje je uklonila Fondacija (UKLONJEN).
 *  Vratiti se mogu samo prva dva — uklanjanje je odluka Fondacije. */
const MOZE_DA_SE_AKTIVIRA = new Set(["EXPIRED", "RAZMENJEN"]);

export default function MojiOglasiKlijent({ listings }: { listings: Oglas[] }) {
  const locale = useLocale();
  const t = useTranslations("profil");
  const tPijaca = useTranslations("pijaca");
  const router = useRouter();
  const [tab, setTab] = useState<"aktivni" | "arhiva">("aktivni");
  const [radim, setRadim] = useState<string | null>(null);
  const [greske, setGreske] = useState<Record<string, string>>({});

  const aktivni = listings.filter((l) => l.status === "ACTIVE");
  const arhiva = listings.filter((l) => l.status !== "ACTIVE");
  const prikazani = tab === "aktivni" ? aktivni : arhiva;

  async function promeni(id: string, akcija: "deaktiviraj" | "aktiviraj") {
    setRadim(id);
    setGreske((g) => ({ ...g, [id]: "" }));
    const res = await fetch(`/api/pijaca/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ akcija }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setGreske((g) => ({ ...g, [id]: data.error ?? t("akcija_greska") }));
    }
    setRadim(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Nazad (krug bez natpisa) i naslov — jedan red */}
      <div className="flex items-center gap-3">
        <Link
          href="/profil"
          aria-label={t("nazad_na_profil")}
          title={t("nazad_na_profil")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-kolo-border bg-white text-kolo-muted hover:text-kolo-text hover:border-kolo-text transition-colors"
        >
          <span aria-hidden>←</span>
        </Link>
        <h1 className="kolo-naslov truncate">{t("moji_oglasi")}</h1>
      </div>

      {/* Tabovi levo, Novi oglas desno — jedan red */}
      <div className="flex items-center gap-2">
        {([
          ["aktivni", t("filter_aktivni"), aktivni.length],
          ["arhiva", t("filter_arhiva"), arhiva.length],
        ] as ["aktivni" | "arhiva", string, number][]).map(([val, lab, broj]) => (
          <button
            key={val}
            onClick={() => setTab(val)}
            className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              tab === val ? "bg-kolo-text text-white" : "bg-white border border-kolo-border text-kolo-muted"
            }`}
          >
            {lab} <span className="opacity-70 tabular-nums">{broj}</span>
          </button>
        ))}
        <Link
          href="/pijaca/novi-oglas"
          className="ml-auto whitespace-nowrap px-3 py-2 bg-kolo-green-700 text-white text-xs font-semibold rounded-lg hover:bg-kolo-green-900 transition-colors"
        >
          + {t("novi_oglas")}
        </Link>
      </div>

      {/* Lista */}
      {prikazani.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          {listings.length === 0 ? (
            <>
              {t("nema_oglasa_jos")}{" "}
              <Link href="/pijaca/novi-oglas" className="text-kolo-green-700 hover:underline">{t("objavite_prvi")}</Link>
            </>
          ) : tab === "aktivni" ? t("nema_aktivnih_oglasa") : t("nema_oglasa_arhiva")}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden divide-y divide-gray-100">
          {prikazani.map((l) => (
            <div key={l.id} className="px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <Link href={`/pijaca/${l.id}`} className="font-semibold text-kolo-text text-sm hover:text-kolo-green-700 transition-colors line-clamp-2">
                    {l.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs">
                    <span className="text-kolo-muted">{tPijaca(`kategorija_${kategorijaKljuc(l.category)}`)}</span>
                    <span className="text-kolo-border">·</span>
                    <span className="font-semibold text-kolo-green-700">{formatCenaGlavni(l, t("cena_po_dogovoru"))}{prikaziJedinicuCene(l) ? " POEN" : ""}</span>
                    {l.status === "UKLONJEN" && (
                      <span className="px-1.5 py-0.5 rounded-md font-medium bg-kolo-danger-light text-kolo-danger">{tPijaca("oglas_uklonjen")}</span>
                    )}
                    {tab === "arhiva" && l.status !== "UKLONJEN" && (
                      <span className="text-kolo-muted">· {new Date(l.razmenjenoAt ?? l.createdAt).toLocaleDateString(intlTag(locale))}</span>
                    )}
                  </div>
                  {/* Razlog uklanjanja — vlasnik mora da zna zašto (Uslovi čl. 25 st. 2). */}
                  {l.status === "UKLONJEN" && l.uklonjenRazlog && (
                    <div className="mt-1.5 text-xs text-kolo-danger">
                      {tPijaca("oglas_uklonjen_razlog", { razlog: l.uklonjenRazlog })}
                    </div>
                  )}
                </div>
                {l.status === "ACTIVE" && (
                  <button
                    onClick={() => promeni(l.id, "deaktiviraj")}
                    disabled={radim === l.id}
                    className="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg border border-kolo-border text-xs font-medium text-kolo-muted hover:text-kolo-text hover:border-kolo-text transition-colors disabled:opacity-50"
                  >
                    {radim === l.id ? "…" : t("arhiviraj")}
                  </button>
                )}
                {MOZE_DA_SE_AKTIVIRA.has(l.status) && (
                  <button
                    onClick={() => promeni(l.id, "aktiviraj")}
                    disabled={radim === l.id}
                    className="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg bg-kolo-green-700 text-xs font-semibold text-white hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
                  >
                    {radim === l.id ? "…" : t("aktiviraj")}
                  </button>
                )}
              </div>
              {greske[l.id] && <p className="mt-1.5 text-xs text-kolo-danger">{greske[l.id]}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
