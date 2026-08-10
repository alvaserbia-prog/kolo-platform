/**
 * Doprinosi razmeni — sklopiv red ispod kartice Novčanika (Pravilnik čl. 40b).
 *
 * Vidi ga SAMO vlasnik naloga (čl. 67) — tuđ napredak se ne prikazuje. Zabeležen
 * korak se namerno ne sabira sa stanjem računa: do okidača to nije zapis POEN-a
 * (čl. 40a st. 3), pa stoji odvojeno, isto kao zabeležen doprinos.
 *
 * Zatvoren po podrazumevanju: Novčanik je ekran za stanje i istoriju, a putanja
 * je nešto što se pogleda povremeno. `<details>` umesto `useState` — komponenta
 * time ostaje serverska i ne šalje ni bajt JavaScripta za otvaranje reda.
 */
import { getTranslations } from "next-intl/server";
import { IZNOS_KORAKA, KAPA, dohvatiPutanju, korakIspunjen } from "@/lib/protokol/doprinos-razmeni";

export function PutanjaSkeleton() {
  return <div className="h-14 rounded-2xl border border-kolo-border bg-white animate-pulse" />;
}

export default async function PutanjaRazmene({ userId }: { userId: string }) {
  const [t, tc, putanja] = await Promise.all([
    getTranslations("novcanik"),
    getTranslations("common"),
    dohvatiPutanju(userId),
  ]);

  const { ucinak, koraci, evidentirano } = putanja;

  return (
    <details className="group/put rounded-2xl border border-kolo-border bg-white overflow-hidden">
      <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-kolo-bg transition-colors">
        <span className="text-sm font-semibold text-kolo-text">{t("putanja_naslov")}</span>
        <span className="flex items-center gap-2 text-kolo-muted">
          <span className="text-xs tabular-nums">
            {t("putanja_ukupno", {
              evidentirano: evidentirano.toLocaleString("sr-RS"),
              kapa: KAPA.toLocaleString("sr-RS"),
            })}
          </span>
          <svg
            className="transition-transform group-open/put:rotate-90"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </summary>

      <div className="px-5 pb-5">
        <p className="text-xs text-kolo-muted">{t("putanja_opis")}</p>

        <ol className="mt-3 space-y-2">
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
    </details>
  );
}
