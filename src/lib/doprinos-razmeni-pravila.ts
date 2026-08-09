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

/** Korak 3: koliko oglasa i koliko njih sa upitom različitih korisnika. */
export const PRAG_OGLASA = 3;
export const PRAG_OGLASA_SA_UPITOM = 2;

/**
 * Koraci 4 i 5: koliko različitih sagovornika van lanca.
 *
 * 🟡 Korak 5 traži deset realizovanih razmena sa deset različitih ljudi van
 * lanca. U zatečenom obimu sistema (nekoliko desetina transakcija) to je vrh
 * putanje koji će praktično stajati mesecima — lestvica će se u početku
 * zaustavljati na koraku 3. Ako treba da radi odmah, spušta se OVDE, na jednom
 * mestu, bez ijedne druge izmene.
 */
export const PRAG_SAGOVORNIKA_KORAK_4 = 5;
export const PRAG_SAGOVORNIKA_KORAK_5 = 10;

/**
 * Rok povratnog toka POEN-a. Ako se POEN vrati istoj osobi u ovom roku,
 * sagovornik ispada iz brojača — to je razmena koja je u evidenciji zatvorila
 * krug sama sa sobom, a lestvica plaća širenje mreže, ne vrtenje u mestu.
 */
export const POVRATNI_ROK_DANA = 60;
export const POVRATNI_ROK_MS = POVRATNI_ROK_DANA * 24 * 60 * 60 * 1000;

/** Jedna realizovana razmena, iz ugla korisnika za koga se broji. */
export type RazmenaZapis = {
  sagovornikId: string;
  /**
   * Da li su strane bile van međusobnog lanca jemstva. Vrednost je SNIMLJENA u
   * trenutku razmene i ovde se samo čita — kasniji rast lanca ne poništava
   * izbrojane sagovornike.
   */
  vanLanca: boolean;
  /**
   * Da li je sagovornik verifikovan. Razmena sa neverifikovanim korisnikom se
   * beleži, a u brojač ulazi tek kad on bude verifikovan — zato je ovo TEKUĆE
   * stanje sagovornika, a ne snimak.
   */
  sagovornikVerifikovan: boolean;
};

/** Jedan tok POEN-a između korisnika i sagovornika. `KA` = ka sagovorniku. */
export type PoenTok = { drugiId: string; smer: "KA" | "OD"; kada: Date };

/**
 * Da li je POEN između korisnika i ovog sagovornika zatvorio krug u roku.
 * Traži se par tokova u SUPROTNIM smerovima čiji su trenuci najviše
 * `POVRATNI_ROK_DANA` dana razmaknuti; smer prvog nije bitan (i „vratio mi je"
 * i „vratio sam mu" zatvaraju isti krug).
 */
export function postojiPovrat(tokovi: PoenTok[], drugiId: string): boolean {
  const ka = tokovi.filter((t) => t.drugiId === drugiId && t.smer === "KA");
  const od = tokovi.filter((t) => t.drugiId === drugiId && t.smer === "OD");
  for (const a of ka) {
    for (const b of od) {
      if (Math.abs(a.kada.getTime() - b.kada.getTime()) <= POVRATNI_ROK_MS) return true;
    }
  }
  return false;
}

/**
 * Sagovornici koji ulaze u brojač lestvice. Tri sita, sva tri iz pravila brojača:
 *  - razmena mora biti van lanca (utvrđeno u trenutku razmene, trajno);
 *  - sagovornik mora biti verifikovan (do tada je razmena samo zabeležena);
 *  - između njih dvoje ne sme biti povratnog toka POEN-a u roku od 60 dana.
 *
 * Svaki sagovornik broji se JEDNOM za celu lestvicu — otud skup, ne broj razmena.
 */
export function sagovorniciUBrojacu(
  razmene: RazmenaZapis[],
  tokovi: PoenTok[],
): Set<string> {
  const skup = new Set<string>();
  for (const r of razmene) {
    if (!r.vanLanca || !r.sagovornikVerifikovan) continue;
    if (postojiPovrat(tokovi, r.sagovornikId)) continue;
    skup.add(r.sagovornikId);
  }
  return skup;
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
  /** Korak 2 — postoji sagovornik iz brojača kome je korisnik upisao POEN. */
  poslaoPoenSagovorniku: boolean;
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
    poslaoPoenSagovorniku: false,
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
      return u.poslaoPoenSagovorniku;
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

/** Šta korisniku još nedostaje za sledeći korak — za prikaz putanje. */
export function opisNapretka(u: Ucinak): {
  dostignut: number;
  sledeci: number | null;
  /** Postignuto/potrebno za sledeći korak; `null` kad je lestvica završena. */
  napredak: { imam: number; treba: number } | null;
} {
  const dostignut = dostignutKorak(u);
  if (dostignut >= POSLEDNJI_KORAK) return { dostignut, sledeci: null, napredak: null };
  const sledeci = dostignut + 1;
  const napredak =
    sledeci === 1 || sledeci === 2
      ? { imam: 0, treba: 1 }
      : sledeci === 3
        ? { imam: Math.min(u.brojOglasa, PRAG_OGLASA), treba: PRAG_OGLASA }
        : {
            imam: u.brojSagovornika,
            treba: sledeci === 4 ? PRAG_SAGOVORNIKA_KORAK_4 : PRAG_SAGOVORNIKA_KORAK_5,
          };
  return { dostignut, sledeci, napredak };
}
