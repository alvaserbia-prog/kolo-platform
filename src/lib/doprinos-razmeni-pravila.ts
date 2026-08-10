/**
 * Doprinos razmeni — putanja prvog kruga. ČISTE funkcije, bez baze.
 * Osnov: Pravilnik o KOLO sistemu čl. 40a (kanal doprinosa sadržaju platforme).
 *
 * Lestvica od pet koraka, svaki 1.000 POEN, doživotna kapa 5.000 POEN po čoveku:
 *
 *   1. prvi oglas sa sadržinskim minimumom + prva razmena u kojoj ti neko
 *      evidentira POEN u korist
 *   2. prva razmena u kojoj TI evidentiraš POEN korisniku van svog lanca
 *   3. tri oglasa, od kojih su dva dobila upit od RAZLIČITIH korisnika
 *   4. razmene sa 5 različitih osoba van tvog lanca
 *   5. razmene sa 10 različitih osoba van tvog lanca
 *
 * 🔴 „Razmena" je ovde UPIS POEN-a od najmanje `MIN_IZNOS_TRANSAKCIJE`, ništa
 * drugo. Nema ručnog označavanja razmene i nema zapisa o njoj: broje se same
 * transakcije. Razlog je što upis POEN-a već jeste izjava obe strane — jedan ga
 * je poslao, drugi ga je zadržao — pa dodatna potvrda ne bi donela nijedan
 * podatak koji transakcija sama ne nosi.
 *
 * Koraci se otključavaju REDOM — korak 4 ne može pre koraka 3, čak i kad je broj
 * sagovornika odavno dovoljan. Korak 1 je ZATEČENI doprinos sadržaju (čl. 40a) i
 * ovde se samo očitava; njegov iznos i odloženo evidentiranje se ne diraju.
 *
 * Izdvojeno iz servisnog modula iz istog razloga kao `doprinos-pravila.ts`: ova
 * pravila prikazuje i klijentska komponenta u pretraživaču, pa ne smeju da povuku
 * Prisma klijent u bundle.
 */

/** Iznos jednog koraka lestvice. */
export const IZNOS_KORAKA = 1000;

/** Prvi i poslednji korak lestvice. */
export const PRVI_KORAK = 1;
export const POSLEDNJI_KORAK = 5;

/** Doživotna kapa po korisniku — zbir svih pet koraka. */
export const KAPA = IZNOS_KORAKA * POSLEDNJI_KORAK;

/**
 * Najmanji upis POEN-a koji brojač prihvata kao pravu razmenu.
 *
 * Bez praga bi lestvica prolazila upisima od jednog POEN-a: deset ljudi, deset
 * simboličnih upisa, 4.000 POEN. Prag je namerno jednak iznosu jednog koraka —
 * razmena mora vredeti bar onoliko koliko korak nosi.
 *
 * Meri se PO TRANSAKCIJI, ne po zbiru sa istim čovekom: pet upisa od po 200 POEN
 * nisu razmena od 1.000, nego pet sitnih. Ko razmenjuje nešto što vredi manje,
 * i dalje to radi normalno — samo ne pomera lestvicu.
 */
export const MIN_IZNOS_TRANSAKCIJE = 1000;

/** Korak 3: koliko oglasa i koliko njih sa upitom različitih korisnika. */
export const PRAG_OGLASA = 3;
export const PRAG_OGLASA_SA_UPITOM = 2;

/**
 * Koraci 4 i 5: koliko različitih sagovornika van kruga poznanstava.
 *
 * 🟡 Korak 5 traži deset ljudi van lanca. U zatečenom obimu sistema (nekoliko
 * desetina transakcija) to je vrh putanje koji će praktično stajati mesecima —
 * lestvica će se u početku zaustavljati na koraku 3. Ako treba da radi odmah,
 * spušta se OVDE, na jednom mestu, bez ijedne druge izmene.
 */
export const PRAG_SAGOVORNIKA_KORAK_4 = 5;
export const PRAG_SAGOVORNIKA_KORAK_5 = 10;

/**
 * Jedan čovek sa kojim je korisnik razmenio POEN, sa svime što brojač o njemu
 * treba da zna. Više transakcija sa istim čovekom daje JEDAN ovakav zapis —
 * sagovornik se za celu lestvicu broji jednom.
 */
export type PoenSagovornik = {
  drugiId: string;
  /**
   * Da li je između njih dvoje prošao bar jedan upis od `MIN_IZNOS_TRANSAKCIJE`
   * ili više. Sitniji upisi postoje, ali brojač ih ne prihvata kao razmenu.
   */
  pravaTransakcija: boolean;
  /**
   * Da li je van kruga poznanstava: nijedno od njih dvoje nije u zabranjenoj
   * zoni onog drugog (graf verifikacija). Ista tabela po kojoj se sudi ko koga
   * sme da verifikuje.
   */
  vanLanca: boolean;
  /**
   * Da li je sagovornik verifikovan. Razmena sa neverifikovanim korisnikom se
   * beleži, a u brojač ulazi tek kad on bude verifikovan — inače bi se lestvica
   * prolazila upisima u prazne naloge.
   */
  verifikovan: boolean;
  /**
   * Da li je korisnik NJEMU upisao POEN u pravoj transakciji (bar jednom) —
   * uslov koraka 2. Smer se gleda samo tu; koracima 4 i 5 smer nije bitan.
   */
  jaSamUpisao: boolean;
};

/** Tri sita brojača: prava transakcija, van kruga poznanstava, verifikovan. */
function ulaziUBrojac(s: PoenSagovornik): boolean {
  return s.pravaTransakcija && s.vanLanca && s.verifikovan;
}

/**
 * Sagovornici koji ulaze u brojač lestvice. Smer upisa nije bitan za korake 4 i
 * 5 — bitno je da je POEN prošao između dvoje ljudi koje graf ne povezuje.
 */
export function sagovorniciUBrojacu(sagovornici: PoenSagovornik[]): Set<string> {
  const skup = new Set<string>();
  for (const s of sagovornici) {
    if (ulaziUBrojac(s)) skup.add(s.drugiId);
  }
  return skup;
}

/** Korak 2: postoji li sagovornik iz brojača kome je korisnik upisao POEN. */
export function upisaoSagovorniku(sagovornici: PoenSagovornik[]): boolean {
  return sagovornici.some((s) => ulaziUBrojac(s) && s.jaSamUpisao);
}

/**
 * Koliko se oglasa može pripisati upitima RAZLIČITIH korisnika (korak 3).
 *
 * Nije isto što i „broj oglasa koji su dobili bar jedan upit": isti čovek koji se
 * javio na tri tvoja oglasa daje jedan, ne tri. Traži se najveće uparivanje
 * oglas ↔ pošiljalac gde se svaki pošiljalac troši jednom (Kuhnov algoritam nad
 * dvodelnim grafom) — pri pragu od dva oglasa razlika je vidljiva odmah.
 */
export function brojOglasaSaRazlicitimUpitima(
  upiti: Array<{ oglasId: string; posiljacId: string }>,
): number {
  const poOglasu = new Map<string, string[]>();
  for (const u of upiti) {
    const lista = poOglasu.get(u.oglasId);
    if (lista) {
      if (!lista.includes(u.posiljacId)) lista.push(u.posiljacId);
    } else {
      poOglasu.set(u.oglasId, [u.posiljacId]);
    }
  }

  const uparen = new Map<string, string>(); // posiljacId → oglasId
  const probaj = (oglasId: string, videli: Set<string>): boolean => {
    for (const p of poOglasu.get(oglasId) ?? []) {
      if (videli.has(p)) continue;
      videli.add(p);
      const zauzeo = uparen.get(p);
      if (zauzeo === undefined || probaj(zauzeo, videli)) {
        uparen.set(p, oglasId);
        return true;
      }
    }
    return false;
  };

  let n = 0;
  // Sortirano radi determinizma — veličina uparivanja je invarijantna, ali neka i
  // put do nje bude isti pri svakom pozivu.
  for (const oglasId of [...poOglasu.keys()].sort()) {
    if (probaj(oglasId, new Set())) n += 1;
  }
  return n;
}

/** Zbirni učinak korisnika, iz koga se čita dokle je stigao na lestvici. */
export type Ucinak = {
  /** Korak 1 — postoji zabeležen ili evidentiran doprinos sadržaju (čl. 40a). */
  prviOglasZabelezen: boolean;
  /** Korak 2 — korisnik je upisao POEN nekome iz brojača. */
  upisaoSagovorniku: boolean;
  /** Korak 3 — broj oglasa korisnika (uklonjeni zbog povrede Uslova se ne broje). */
  brojOglasa: number;
  /** Korak 3 — oglasi uparivi sa upitima različitih korisnika. */
  oglasaSaRazlicitimUpitima: number;
  /** Koraci 4 i 5 — broj sagovornika u brojaču. */
  brojSagovornika: number;
};

export function prazanUcinak(): Ucinak {
  return {
    prviOglasZabelezen: false,
    upisaoSagovorniku: false,
    brojOglasa: 0,
    oglasaSaRazlicitimUpitima: 0,
    brojSagovornika: 0,
  };
}

/** Da li je pojedinačni korak ispunjen — bez obzira na to da li je otključan. */
export function korakIspunjen(korak: number, u: Ucinak): boolean {
  switch (korak) {
    case 1:
      return u.prviOglasZabelezen;
    case 2:
      return u.upisaoSagovorniku;
    case 3:
      return u.brojOglasa >= PRAG_OGLASA && u.oglasaSaRazlicitimUpitima >= PRAG_OGLASA_SA_UPITOM;
    case 4:
      return u.brojSagovornika >= PRAG_SAGOVORNIKA_KORAK_4;
    case 5:
      return u.brojSagovornika >= PRAG_SAGOVORNIKA_KORAK_5;
    default:
      return false;
  }
}

/**
 * Dokle je korisnik stigao — najviši korak do koga su SVI prethodni ispunjeni.
 * Koraci se otključavaju redom, pa preskakanje ne postoji: ko ima deset
 * sagovornika a nije objavio tri oglasa, stoji na koraku 2.
 */
export function dostignutKorak(u: Ucinak): number {
  let k = 0;
  while (k < POSLEDNJI_KORAK && korakIspunjen(k + 1, u)) k += 1;
  return k;
}
