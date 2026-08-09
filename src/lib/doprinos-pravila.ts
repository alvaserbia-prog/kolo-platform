/**
 * Pravila doprinosa razmeni na platformi — ČISTE funkcije, bez baze.
 * Osnov: Pravilnik o KOLO sistemu 4.2.0 čl. 15 t. 7 i čl. 40a, Uslovi korišćenja 4.2.0.
 * (Do 4.1.0 kanal se zvao „doprinos sadržaju platforme" i bio je tačka 8 — spisak
 * kanala je u 4.2.0 pao sa osam na sedam, brisanjem rasta kolektivnih oblika.)
 *
 * Izdvojeno iz `src/lib/protokol/doprinos-sadrzaju.ts` (koji radi sa Prismom) zato
 * što ova pravila koristi i FORMA OGLASA u pretraživaču. Da su u istom modulu,
 * `import` iz klijentske komponente povukao bi Prisma klijent u browser bundle.
 * Servisni modul ih re-eksportuje, pa server ima jedan ulaz.
 */

/** Iznos jednokratnog doprinosa (čl. 40a st. 2). */
export const IZNOS = 1000;

/** Sadržinski minimum oglasa — najmanja dužina opisa (Uslovi 4.2.0). */
export const MIN_OPIS = 40;

/** Najviše aktivnih oglasa za neverifikovanog korisnika (Uslovi 4.2.0). */
export const MAX_AKTIVNIH_OGLASA = 3;

/**
 * `status` razdvaja dve vrste odbijanja, jer nisu ista stvar:
 *  - 400 — oglas ne ispunjava sadržinski minimum (popravlja se dopunom oglasa);
 *  - 403 — korisniku to nije dozvoljeno (potražnja, prekoračen broj oglasa).
 */
export type Provera = { ok: true } | { ok: false; razlog: string; status: 400 | 403 };

/** Polja oglasa od kojih zavisi sadržinski minimum. */
export type OglasMinimum = {
  tip: string;
  description: string;
  category: string;
  location: string | null;
  images: string[];
};

/**
 * Sadržinski minimum iz Uslova: bar jedna fotografija, opis od najmanje 40
 * znakova, kategorija i mesto.
 *
 * Minimum ima dve uloge i one se ne poklapaju:
 *  - USLOV ZA OBJAVU važi samo za neverifikovanog korisnika (vidi `smeDaPostaviOglas`);
 *  - USLOV ZA DOPRINOS važi za svakoga (čl. 40a st. 2), pa i za verifikovanog.
 * Verifikovanom se, dakle, oglas ispod minimuma i dalje objavljuje — samo mu se
 * povodom njega ne beleži doprinos.
 */
export function oglasIspunjavaMinimum(oglas: OglasMinimum): Provera {
  if (oglas.images.length === 0)
    return { ok: false, razlog: "Oglas mora imati bar jednu fotografiju.", status: 400 };
  if ((oglas.description ?? "").trim().length < MIN_OPIS)
    return { ok: false, razlog: `Opis mora imati najmanje ${MIN_OPIS} znakova.`, status: 400 };
  if (!oglas.category)
    return { ok: false, razlog: "Kategorija je obavezna.", status: 400 };
  if (!oglas.location)
    return { ok: false, razlog: "Mesto je obavezno.", status: 400 };
  return { ok: true };
}

/**
 * Sme li korisnik da objavi ovaj oglas.
 *
 * Verifikovan korisnik — bez ograničenja (zatečeno ponašanje se ne dira).
 * Neverifikovan korisnik — samo PONUDA (čl. 16 st. 5, čl. 28 st. 2), uz sadržinski
 * minimum i najviše tri aktivna oglasa. Potražnja mu ostaje zatvorena: oglas kojim
 * se nešto traži poziva druge da mu se obrate, a taj smer traži verifikaciju.
 */
export function smeDaPostaviOglas(input: {
  verifikovan: boolean;
  brojAktivnihOglasa: number;
  oglas: OglasMinimum;
}): Provera {
  if (input.verifikovan) return { ok: true };

  if (input.oglas.tip !== "PONUDA")
    return {
      ok: false,
      razlog: "Dok nisi verifikovan/a možeš da objaviš samo ponudu — oglas kojim nudiš dobro ili uslugu.",
      status: 403,
    };
  if (input.brojAktivnihOglasa >= MAX_AKTIVNIH_OGLASA)
    return {
      ok: false,
      razlog: `Dok nisi verifikovan/a možeš imati najviše ${MAX_AKTIVNIH_OGLASA} aktivna oglasa.`,
      status: 403,
    };
  return oglasIspunjavaMinimum(input.oglas);
}

/**
 * Sme li korisnik da inicira ažuriranje evidencije POEN-a u korist drugog
 * (čl. 28 st. 2 — neverifikovani učestvuje isključivo kao primalac).
 *
 * Vezuje se za TIP NALOGA, ne za indeks stvarnosti: ko je jednom verifikovan sme
 * da upisuje POEN i ako mu indeks kasnije padne ispod funkcionalnog praga.
 */
export function smeDaSalje(tipKorisnika: string): boolean {
  return tipKorisnika !== "NEVERIFIKOVAN";
}
