import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ucitajPravniDokument } from "@/lib/pravni-dokument";
import { pageMetadata } from "@/lib/seo";

/**
 * Fajl i verzija po slug-u. Naziv i opis NISU ovde — čitaju se iz prevoda
 * (`pravne.rb.<slug>.naziv` / `.opis`), pa postoje na svih pet jezika. Ranije
 * su stajali i ovde, u srpskoj kopiji koju nijedna linija nije čitala; ta
 * kopija je zaostala na staroj terminologiji („verifikacija korisnika") i
 * čekala da je neko prepiše kao tačnu.
 */
const PRAVILNICI: Record<string, { fajl: string; verzija: string }> = {
  // 4.4.6 — položaj Gornjeg Kola (R-09): telo obrazovano na osnovu Statuta, nije
  // organ Fondacije; odluku sprovodi UO svojim aktom i dužan je da ga donese osim
  // po zatvorenoj listi razloga (čl. 51). Brisano „izvršna, ne upravljačka".
  // 4.5.2 — čl. 14 st. 3 dobija ČETVRTI izuzetak od zabrane negativnog zapisa:
  // otpis po poništenju potvrde zbog neaktivnosti (čl. 6 Pravilnika o učešću dece).
  // Bez izmene ovog člana taj otpis ne bi imao osnov — st. 6 izričito kaže da se
  // drugi osnov ne može ustanoviti nijednim drugim aktom.
  "kolo-sistem": {
    fajl: "Pravilnik_4_5_4.md",
    verzija: "4.5.4",
  },
  // 4.4.6 — čl. 12 st. 4 više ne prenosi nadležnost za opšte akte na Gornje Kolo
  // (akt nižeg ranga to ne može po sopstvenom čl. 8 st. 2); nov st. 6.
  "hijerarhija": {
    fajl: "hijerarhija_4_4_6.md",
    verzija: "4.4.6",
  },
  "dokaz-stvarnosti": {
    fajl: "dokaz_stvarnosti_4_4_1.md",
    verzija: "4.4.1",
  },
  // 4.4.3 — obrazloženje koeficijenta evidencije (čl. 4) i definicija koeficijenta
  // bez jedinične formulacije „po jednom dinaru" (čl. 2).
  // 4.4.7 — donacija ne daje pravo na dobra iz kolektivne nabavke ni mesto u redu
  // (čl. 4). Petlja donacija → POEN → red za robu vidi se iz OVOG akta, pa brana
  // mora stajati i ovde, ne samo u pravilniku o nabavkama.
  "pokroviteljstvo-donacije": {
    fajl: "donacije_4_5_5.md",
    verzija: "4.5.5",
  },
  // 4.4.4 — pravna priroda operativnog doprinosa (čl. 27): nema naručioca, nema
  // naknade, rezultat ide u zajedničko dobro pod licencama iz Glave II. Brisan
  // vremenski ekvivalent (čl. 6), upozorenje verifikatora (čl. 13) i gornja
  // granica predloženog POEN-a (raniji čl. 26).
  "operativni": {
    fajl: "operativni_4_4_4.md",
    verzija: "4.4.4",
  },
  // 4.4.5 — osnov gornje granice (čl. 5): utrošena sopstvena sredstva i vreme, uz
  // aritmetički razlog zašto taj rad operativni kanal ne može da evidentira (limit
  // je 10% opticaja, a opticaj je bio nula). Čl. 8 više ne tvrdi da udeo opada —
  // opada uticaj JEDNOG koraka, a zbirni udeo stoji na ~19–24%. Čl. 4: rezultat
  // ulazi u zajedničko dobro pod licencama iz Glave II.
  "osnivacki": {
    fajl: "osnivacki_4_4_5.md",
    verzija: "4.4.5",
  },
  // 4.4.6 — statutarni osnov (čl. 2), dinamičan sastav bez imenovanja (čl. 4),
  // sprovođenje odluke aktom UO (čl. 17), izmenu pravilnika donosi UO (čl. 23).
  "gornje-kolo": {
    fajl: "gornje_kolo_4_4_6.md",
    verzija: "4.4.6",
  },
  "programi-podrske": {
    fajl: "programi_podrske_4_5_0.md",
    verzija: "4.5.0",
  },
  // Usvojen 4.3.0 — do tada je stajao kao nacrt u `docs/pravilnik-modul-deca.md`.
  // 4.5.2 — postupak potvrde postojanja deteta (R-15, čl. 6 prepisan): izjašnjavaju
  // se OBE strane veze, rok je 60 dana uz podsetnike svima koje bi poništenje
  // oštetilo, svako vraća isključivo svoje (bez nadoknade iz čl. 20b), poništenje
  // nije kvalifikacija neistinite potvrde i protiv njega stoji prigovor.
  // 4.5.3 — uzrasne grupe 7–14 i 15–17 (R-17, čl. 12): do 15 nema ni razmene ni
  // razgovora sa punoletnima i saglasnost to ne otvara; nov čl. 12a (razmena male
  // vrednosti, poslovna sposobnost); čl. 14 — prepis iznad praga čeka roditelja;
  // čl. 10 — roditeljska lozinka samo dok dete nema sopstvenu adresu.
  "ucesce-dece": {
    fajl: "ucesce_dece_4_5_3.md",
    verzija: "4.5.3",
  },
  // Nov akt uz set 4.4.1 — osnov u čl. 14a i 51a Pravilnika o KOLO sistemu.
  // 4.4.3 — broj POEN-a po delu je parametar odluke o nabavci (čl. 17), a ne izvod
  // iz maloprodajne vrednosti dobra (čl. 19). Maloprodajna referenca je brisana.
  // 4.4.7 — priroda nabavke (R-10): program iz čl. 7 t. c) Statuta, nije privredna
  // delatnost, zabranjena naknada za ustupljeno dobro (nov čl. 3a); oslobođen deo
  // ide sledećem u redu i ne prodaje se (čl. 29); godišnji zbir projekata (čl. 31).
  "projekti-nabavke": {
    fajl: "projekti_nabavke_4_5_4.md",
    verzija: "4.5.4",
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = PRAVILNICI[slug];
  if (!p) return { title: "KOLO" };
  const t = await getTranslations("pravne");
  const naziv = t(`rb.${slug}.naziv`);
  return pageMetadata({
    title: `${naziv} — KOLO`,
    description: `${naziv} ${p.verzija}. ${t(`rb.${slug}.opis`)}`,
    path: `/pravilnik/${slug}`,
  });
}

export async function generateStaticParams() {
  return Object.keys(PRAVILNICI).map((slug) => ({ slug }));
}

export default async function PravilnikSlugPage({ params }: Props) {
  const { slug } = await params;
  const p = PRAVILNICI[slug];
  if (!p) notFound();

  const locale = await getLocale();
  const t = await getTranslations("pravne");
  const sadrzaj = await ucitajPravniDokument(p.fajl, locale);

  return (
    <div className="max-w-[800px] mx-auto pb-16">

      <div className="mb-8">
        <p className="text-xs text-kolo-muted mb-1">
          <Link href="/pravilnik" className="hover:text-kolo-green-700 transition-colors">{t("pravilnik.pravilnici")}</Link>
          {" / "}
          <span>{t(`rb.${slug}.naziv`)}</span>
        </p>
        <h1 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
          {t(`rb.${slug}.naziv`)}
        </h1>
        <p className="text-sm text-kolo-muted mt-2">{t("verzija")} {p.verzija}</p>
      </div>

      <article
        className="
          text-sm text-kolo-text leading-relaxed text-body
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-kolo-green-900 [&_h1]:mb-6 [&_h1]:mt-8
          [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-kolo-green-900 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:pt-4 [&_h2]:border-t [&_h2]:border-kolo-border
          [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-kolo-green-900 [&_h3]:mb-3 [&_h3]:mt-6
          [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-kolo-text [&_h4]:mb-2 [&_h4]:mt-4
          [&_p]:mb-3
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:space-y-1
          [&_li]:leading-relaxed
          [&_strong]:font-semibold [&_strong]:text-kolo-text
          [&_em]:italic
          [&_a]:text-kolo-green-700 [&_a]:underline
          [&_hr]:my-6 [&_hr]:border-kolo-border
          [&_blockquote]:border-l-4 [&_blockquote]:border-kolo-green-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-kolo-muted [&_blockquote]:my-4
          [&_code]:bg-kolo-bg [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
          [&_table]:w-full [&_table]:my-4 [&_table]:text-sm
          [&_th]:text-left [&_th]:font-semibold [&_th]:p-2 [&_th]:border-b [&_th]:border-kolo-border [&_th]:bg-kolo-bg
          [&_td]:p-2 [&_td]:border-b [&_td]:border-kolo-border [&_td]:align-top
        "
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{sadrzaj}</ReactMarkdown>
      </article>

      <div className="mt-10 pt-6 border-t border-kolo-border flex flex-wrap gap-4 text-sm text-kolo-muted">
        <Link href="/pravilnik" className="text-kolo-green-700 hover:underline">
          {t("pravilnik.sviPravilnici")}
        </Link>
        <Link href="/" className="hover:text-kolo-green-700 transition-colors">
          {t("nazadNaPocetnu")}
        </Link>
      </div>
    </div>
  );
}
