/**
 * Putanja doprinosa razmeni — prikaz lestvice od pet koraka (Pravilnik čl. 40a).
 *
 * Vidi je SAMO vlasnik naloga (čl. 67) — tuđ napredak se ne prikazuje. Zabeležen
 * korak se namerno ne sabira sa stanjem računa: do okidača to nije zapis POEN-a
 * (čl. 40a st. 3), pa stoji kao zaseban red, isto kao zabeležen doprinos.
 */
import { getTranslations } from "next-intl/server";
import { IZNOS_KORAKA, KAPA, dohvatiPutanju, korakIspunjen } from "@/lib/protokol/doprinos-razmeni";

export function PutanjaSkeleton() {
  return <div className="h-40 rounded-2xl border border-kolo-border bg-white animate-pulse" />;
}

export default async function PutanjaRazmene({ userId }: { userId: string }) {
  const [t, tc, putanja] = await Promise.all([
    getTranslations("novcanik"),
    getTranslations("common"),
    dohvatiPutanju(userId),
  ]);

  const { ucinak, koraci, evidentirano } = putanja;

  return (
    <div className="rounded-2xl border border-kolo-border bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-kolo-text">{t("putanja_naslov")}</h2>
        <p className="text-xs text-kolo-muted tabular-nums">
          {t("putanja_ukupno", {
            evidentirano: evidentirano.toLocaleString("sr-RS"),
            kapa: KAPA.toLocaleString("sr-RS"),
          })}
        </p>
      </div>
      <p className="mt-1 text-xs text-kolo-muted">{t("putanja_opis")}</p>

      <ol className="mt-4 space-y-2">
        {koraci.map((k) => {
          const ispunjen = korakIspunjen(k.korak, ucinak);
          // Tri stanja koja se razlikuju i pravno, ne samo bojom:
          //  EVIDENTIRAN — zapis POEN-a postoji;
          //  ZABELEZEN   — korak je pređen, zapis čeka okidač (čl. 40a st. 4);
          //  bez zapisa  — korak još nije otključan (redosled se poštuje).
          const oznaka =
            k.status === "EVIDENTIRAN"
              ? t("putanja_evidentiran")
              : k.status === "ZABELEZEN"
                ? t("putanja_zabelezen")
                : ispunjen
                  ? t("putanja_na_redu")
                  : t("putanja_zakljucan");

          return (
            <li
              key={k.korak}
              className="flex items-start justify-between gap-3 rounded-xl bg-kolo-bg px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-kolo-text">
                  {k.korak}. {t(`putanja_korak_${k.korak}`)}
                </p>
                <p className="text-[11px] text-kolo-muted mt-0.5">{oznaka}</p>
              </div>
              <span
                className={`shrink-0 text-xs font-bold tabular-nums ${
                  k.status === "EVIDENTIRAN" ? "text-kolo-green-700" : "text-kolo-muted"
                }`}
              >
                {IZNOS_KORAKA.toLocaleString("sr-RS")} {tc("poen")}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-3 text-[11px] text-kolo-muted leading-relaxed">
        {t("putanja_pravila", { sagovornika: ucinak.brojSagovornika })}
      </p>
    </div>
  );
}
