"use client";

/**
 * Veliki prikaz indeksa stvarnosti u formatu "X/Y%" ili "∞/Y%".
 * Pravilnik o dokazu stvarnosti v3.5.0.
 */
import { useTranslations } from "next-intl";
import Pojam from "@/components/Pojam";
import { FUNKCIONALNI_PRAG_INDEKSA } from "@/lib/protokol/dokaz-stvarnosti";

type Props = {
  prikaz: string; // "30/30%", "10/30%", "∞/10%", "0/0%"
  tip: string;
  /**
   * Indeks stvarnosti. Oznaka „Redovan član" tvrdi da čovek ima pun pristup, a
   * pristup ne zavisi od tipa naloga nego od indeksa (`imaPristupVerifikaciji`).
   * Ta dva se razilaze kad se poništi lažna potvrda: nalog ostaje REGULARNI, a
   * indeks padne ispod praga — bez ovoga bi ekran pisao pun status preko
   * zaključanog naloga.
   */
  indeks?: number;
  /** Početni korisnik (osnivač / UO Fondacije) — koren lanca potvrda. */
  jeOsnivac?: boolean;
  podnaslov?: string;
  /** Profil varijanta: status kao badge levo, indeks desno (centrirano). */
  statusKaoBadge?: boolean;
  /** Kartica popunjava punu visinu roditelja (h-full), sadržaj centriran. */
  ispuniVisinu?: boolean;
  /** Maloletni korisnik (Modul Deca) — oznaka statusa glasi „dete". */
  maloletan?: boolean;
  /**
   * Identifikovan član — javan donator čiji je uplatilac upoređen sa nalogom
   * (R-01, mera M-9). Nije status u bazi: nalog ostaje NEVERIFIKOVAN dok ga neko
   * iz mreže ne potvrdi. Oznaka postoji zato što „nov član“ imenuje trenutak koji
   * prolazi, a ovaj čovek je već učinio doprinos — i zato što mu je ime ionako
   * javno u listi donacija (Uslovi čl. 17). Anonimna donacija ovo svojstvo NE daje.
   */
  identitetUtvrdjen?: boolean;
};

export default function IndeksPrikaz({ prikaz, tip, indeks, jeOsnivac, podnaslov, statusKaoBadge, ispuniVisinu, maloletan, identitetUtvrdjen }: Props) {
  const t = useTranslations("verifikacija");
  const rootCls = `rounded-2xl border border-kolo-border bg-white p-6 shadow-sm${
    ispuniVisinu ? " h-full flex flex-col justify-center" : ""
  }`;
  const tipLabela: Record<string, string> = {
    REGULARNI: t("tip_regularni"),
    NOSILAC_ZRNA: t("tip_nosilac_zrna"),
    NEVERIFIKOVAN: t("tip_neverifikovan"),
  };

  const badgeStil: Record<string, string> = {
    REGULARNI: "bg-kolo-green-100 text-kolo-green-700",
    NOSILAC_ZRNA: "bg-kolo-gold-100 text-kolo-gold-600",
    NEVERIFIKOVAN: "bg-kolo-bg text-kolo-muted",
  };

  // Redovan član kome je indeks pao ispod praga (poništena lažna potvrda) i dalje
  // je REGULARNI, ali nema pristup — pa mu se ne sme prikazati pun status.
  const bezPristupa =
    tip === "REGULARNI" && indeks !== undefined && indeks < FUNKCIONALNI_PRAG_INDEKSA;

  // Osnivači (početni korisnici, UO Fondacije) su koren lanca potvrda — nemaju
  // nikoga iznad sebe, pa se njihov status prikazuje kao „Početni korisnik".
  // Maloletni korisnik nije „nov član" — ta oznaka znači „skoro je došao", a dete
  // može biti u sistemu godinama. U dečjem prostoru status ionako ne određuje ništa
  // (Modul Deca, čl. 15), pa oznaka imenuje samo ko je: dete.
  // Oznaka „donator“ stoji UMESTO „nov član“, i samo tu: potvrđenom članu se ne
  // prikazuje, jer je „redovan član“ jači podatak, a dete i osnivač imaju svoje.
  const jeDonator =
    Boolean(identitetUtvrdjen) && !maloletan && !jeOsnivac && tip === "NEVERIFIKOVAN";

  const labela = maloletan
    ? t("tip_dete")
    : jeOsnivac
      ? t("tip_pocetna")
      : jeDonator
        ? t("tip_donator")
        : bezPristupa
          ? t("tip_bez_pristupa")
          : (tipLabela[tip] ?? tip);
  const stil = maloletan
    ? "bg-kolo-bg text-kolo-muted"
    : jeOsnivac
      ? "bg-kolo-gold-100 text-kolo-gold-600"
      : jeDonator
        ? "bg-kolo-gold-100 text-kolo-gold-600"
        : bezPristupa
          ? "bg-kolo-bg text-kolo-muted"
          : (badgeStil[tip] ?? "bg-kolo-bg text-kolo-muted");

  const indeksBlok = (
    <div className="min-w-0 text-center">
      <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold">
        <Pojam
          termin={t("indeks_termin")}
          objasnjenje={t("indeks_objasnjenje")}
        />
      </div>
      <div className="mt-1 text-[clamp(1.75rem,7vw,3rem)] font-bold tabular-nums leading-none whitespace-nowrap text-kolo-green-700">{prikaz}</div>
      {podnaslov && <div className="mt-1 text-xs text-kolo-muted">{podnaslov}</div>}
    </div>
  );

  if (statusKaoBadge) {
    return (
      <div className={rootCls}>
        <div className="grid grid-cols-2 gap-4 items-center">
          {/* LEVO — status badge */}
          <div className="min-w-0 flex justify-center">
            <span
              className={`inline-flex items-center text-center px-3 py-1.5 rounded-full text-sm font-semibold ${stil}`}
            >
              {labela}
            </span>
          </div>
          {/* DESNO — indeks stvarnosti (centrirano) */}
          {indeksBlok}
        </div>
      </div>
    );
  }

  return (
    <div className={rootCls}>
      <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold">
        <Pojam
          termin={t("indeks_termin")}
          objasnjenje={t("indeks_objasnjenje")}
        />
      </div>
      <div className="mt-1 text-5xl font-bold tabular-nums text-kolo-green-700">{prikaz}</div>
      <div className="mt-2 text-sm text-kolo-muted">{labela}</div>
      {podnaslov && <div className="mt-1 text-xs text-kolo-muted">{podnaslov}</div>}
    </div>
  );
}
