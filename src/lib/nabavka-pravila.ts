/**
 * Kolektivna nabavka — ČISTE funkcije, bez Prisme.
 *
 * Zaseban fajl zato što ovu aritmetiku čita i pretraživač: ekran nabavke prikazuje
 * istu kalkulaciju koju server snima na zapis, a admin ekran je računa pre objave.
 * Da pravila žive uz servisne funkcije (koje uvoze Prismu), klijent bi morao da
 * drži SOPSTVENU prepisanu kopiju — a takva kopija je u ovom repou već jednom
 * odlutala (tabela donacija u admin panelu nosila je nivoe pokroviteljstva).
 *
 * `src/lib/protokol/nabavka.ts` sve ovo re-eksportuje, pa server ima jedan ulaz.
 *
 * Osnov: Pravilnik o projektima i kolektivnim nabavkama (set 4.4.1), čl. 5, 8,
 * 15, 17, 18, 19, 21, 22, 23 i 26; Pravilnik o KOLO sistemu čl. 14a i 51a.
 *
 * 🔴 Brojevi iz ovog fajla stoje DOSLOVNO u aktu i zaključani su testom
 * `pravni-dokumenti.test.ts`. Izmena konstante ovde bez izmene akta razilazi normu
 * i primenu — isto pravilo kao kapa i prag iz čl. 40b.
 */

// ─── Konstante iz akta ────────────────────────────────────────────────────────

/** Čl. 8 st. 2 — koeficijent trošenja. 1,00 = „potroši sve iznad rezerve". */
export const KOEFICIJENT_TROSENJA = 1.0;

/** Čl. 5 st. 3 — operativna rezerva = tri operativna troška prethodnog meseca. */
export const MESECI_REZERVE = 3;

/**
 * Čl. 18 st. 2 — niz iz kog se IZVODI broj delova, od većeg ka manjem.
 * Bira se najveće N pri kome svako dobija bar jednu celu jedinicu, dakle
 * maksimizuje se broj opsluženih ljudi.
 */
export const NIZ_DELOVA = [100, 50, 20] as const;

/** Čl. 15 st. 1 — najmanje toliko ponuda pre izbora najpovoljnije. */
export const NAJMANJE_PONUDA = 3;

/** Čl. 17 — maloprodajna referenca je prosek tačno toliko javnih cena. */
export const BROJ_CENA_ZA_REFERENCU = 3;

/** Čl. 21 st. 2 — rok za prijavu, u danima od objave kalkulacije. */
export const ROK_PRIJAVE_DANA = 3;

/** Čl. 23 st. 3 — rok za odgovor na poziv, u danima od upućivanja poziva. */
export const ROK_POTVRDE_DANA = 3;

/** Čl. 26 st. 2 — period preuzimanja, u danima. */
export const PERIOD_PREUZIMANJA_DANA = 3;

/** Čl. 32 — predlog se briše najkasnije po isteku toliko meseci od upisa. */
export const ROK_PREDLOGA_MESECI = 12;

/** Najveća dužina naziva dobra. Predlog je jedna reč ili kratak izraz, ne opis. */
export const MAX_DUZINA_NAZIVA = 40;
export const MIN_DUZINA_NAZIVA = 2;

// ─── Rečnik naziva ────────────────────────────────────────────────────────────

/**
 * Ključ za poklapanje naziva bez obzira na veličinu slova i višak razmaka.
 * Isti obrazac kao `User.pseudonimLower` — jedinstvenost drži baza nad ovim
 * poljem, pa se „Đubrivo", „đubrivo" i „  ĐUBRIVO " svode na jedan zapis.
 *
 * 🔴 Dijakritika se NE skida. „Djubrivo" i „đubrivo" su za sistem različiti nazivi,
 * i to je namerno: skidanjem kvačica bi se spojili i nazivi koji to nisu (npr.
 * „cep" i „ćep"), a rečnik ionako nudi postojeće nazive pri kucanju.
 */
export function normalizujNaziv(naziv: string): string {
  return naziv.trim().replace(/\s+/g, " ").toLocaleLowerCase("sr-RS");
}

/** Prikazni oblik: skraćen i sa jednostrukim razmacima, ali bez menjanja slova. */
export function ociscenNaziv(naziv: string): string {
  return naziv.trim().replace(/\s+/g, " ");
}

export function validanNaziv(naziv: string): boolean {
  const n = ociscenNaziv(naziv);
  if (n.length < MIN_DUZINA_NAZIVA || n.length > MAX_DUZINA_NAZIVA) return false;
  // Naziv dobra, ne rečenica: slova, brojevi, razmak i nekoliko spojnica.
  return /^[\p{L}\p{N}][\p{L}\p{N} .,%\-/]*$/u.test(n);
}

// ─── Sredstva (čl. 5 i 8) ─────────────────────────────────────────────────────

/**
 * Čl. 5 — sredstva raspoloživa za projekte.
 *
 * Rezerva je isti reper po kome se trajno gasi zaštitni veto (Gornje Kolo čl. 19),
 * pa nije proizvoljna cifra nego mera održivosti koju akti već priznaju.
 * Negativna razlika se svodi na nulu — nabavka se tada ne sprovodi (st. 4).
 */
export function raspolozivoZaProjekte(saldoRSD: number, trosakPrethodnogMesecaRSD: number): number {
  const rezerva = trosakPrethodnogMesecaRSD * MESECI_REZERVE;
  return Math.max(0, saldoRSD - rezerva);
}

/** Čl. 8 st. 1 — iznos nabavke. */
export function iznosNabavke(raspolozivoRSD: number): number {
  return raspolozivoRSD * KOEFICIJENT_TROSENJA;
}

// ─── Kalkulacija (čl. 17, 18, 19) ─────────────────────────────────────────────

/**
 * Čl. 17 — maloprodajna referenca: prosek tri javne cene, zaokružen na ceo dinar.
 *
 * 🔴 Ovaj broj JESTE kurs, jer je POEN po jedinici jednak njemu (paritet 1:1).
 * Zato akt traži tačno tri cene i objavljene izvore — bez toga bi jedan čovek
 * određivao koliko POEN-a nestaje iz sistema.
 */
export function maloprodajnaReferenca(cene: number[]): number | null {
  if (cene.length !== BROJ_CENA_ZA_REFERENCU) return null;
  if (cene.some((c) => !Number.isFinite(c) || c <= 0)) return null;
  return Math.round(cene.reduce((a, b) => a + b, 0) / cene.length);
}

/** Čl. 18 st. 1 — najveći broj jedinica koji iznos nabavke pokriva. */
export function najveciBrojJedinica(iznosRSD: number, nabavnaCenaPoJedinici: number): number {
  if (!Number.isFinite(nabavnaCenaPoJedinici) || nabavnaCenaPoJedinici <= 0) return 0;
  return Math.floor(iznosRSD / nabavnaCenaPoJedinici);
}

export interface Podela {
  brojDelova: number;
  velicinaDela: number;
  /** Koliko se jedinica stvarno kupuje = velicinaDela × brojDelova. */
  jedinicaSeKupuje: number;
}

/**
 * Čl. 18 st. 2 i 3 — broj delova se NE bira nego izvodi.
 *
 * Uzima se najveće N iz niza pri kome veličina dela iznosi bar jednu celu jedinicu.
 * Time se maksimizuje broj ljudi koji dobiju, uz uslov da svako dobije upotrebljivu
 * količinu; ostatak jedinica se ne kupuje, pa nema viška ni deljenja na komade.
 *
 * Vraća `null` kad ni pri N = 20 deo ne dostiže jednu jedinicu — nabavka se tada
 * ne sprovodi, a sredstva ostaju za narednu (st. 4).
 */
export function izvediPodelu(najviseJedinica: number): Podela | null {
  for (const brojDelova of NIZ_DELOVA) {
    const velicinaDela = Math.floor(najviseJedinica / brojDelova);
    if (velicinaDela >= 1) {
      return { brojDelova, velicinaDela, jedinicaSeKupuje: velicinaDela * brojDelova };
    }
  }
  return null;
}

/**
 * Čl. 19 — broj POEN-a po delu, u odnosu jedan prema jedan sa maloprodajnom
 * referencom.
 *
 * 🔴 NE izvodi se iz nabavne cene. POEN se ne razmenjuje za dobra i ne dolazi do
 * dobavljača; dobra su kupljena dinarima, a POEN se poništava kao zapis o
 * iskorišćenom učešću.
 */
export function poenPoDelu(velicinaDela: number, maloprodajnaRef: number): number {
  return velicinaDela * maloprodajnaRef;
}

/**
 * Merilo po kome se nabavka ocenjuje: koliko POEN-a nestane iz sistema po
 * potrošenom dinaru. Što je nabavna cena niža, to je odnos veći — jedan broj koji
 * poravnava interes Fondacije (jeftinije) i interes sistema (više poništenog POEN-a).
 */
export function odnosPonistenja(maloprodajnaRef: number, nabavnaCena: number): number | null {
  if (!Number.isFinite(nabavnaCena) || nabavnaCena <= 0) return null;
  return maloprodajnaRef / nabavnaCena;
}

export interface UlazKalkulacije {
  saldoRSD: number;
  trosakPrethodnogMesecaRSD: number;
  nabavnaCena: number;
  cene: number[];
}

export interface Kalkulacija {
  rezervaRSD: number;
  raspolozivoRSD: number;
  iznosNabavkeRSD: number;
  maloprodajna: number;
  najviseJedinica: number;
  brojDelova: number;
  velicinaDela: number;
  brojJedinica: number;
  poenPoDelu: number;
  ukupnoPoena: number;
  procenjenoPlacanjeRSD: number;
  odnosPonistenja: number;
}

/**
 * Ceo lanac iz čl. 5 → 19 u jednom pozivu. Vraća `null` kad nabavka nije moguća
 * (nema sredstava, nevažeće cene, ili deo ne dostiže jednu jedinicu).
 */
export function izracunajKalkulaciju(ulaz: UlazKalkulacije): Kalkulacija | null {
  const rezervaRSD = ulaz.trosakPrethodnogMesecaRSD * MESECI_REZERVE;
  const raspolozivoRSD = raspolozivoZaProjekte(ulaz.saldoRSD, ulaz.trosakPrethodnogMesecaRSD);
  if (raspolozivoRSD <= 0) return null;

  const iznosNabavkeRSD = iznosNabavke(raspolozivoRSD);
  const maloprodajna = maloprodajnaReferenca(ulaz.cene);
  if (maloprodajna === null) return null;

  const najviseJedinica = najveciBrojJedinica(iznosNabavkeRSD, ulaz.nabavnaCena);
  const podela = izvediPodelu(najviseJedinica);
  if (!podela) return null;

  const poenDela = poenPoDelu(podela.velicinaDela, maloprodajna);
  const odnos = odnosPonistenja(maloprodajna, ulaz.nabavnaCena);
  if (odnos === null) return null;

  return {
    rezervaRSD,
    raspolozivoRSD,
    iznosNabavkeRSD,
    maloprodajna,
    najviseJedinica,
    brojDelova: podela.brojDelova,
    velicinaDela: podela.velicinaDela,
    brojJedinica: podela.jedinicaSeKupuje,
    poenPoDelu: poenDela,
    ukupnoPoena: poenDela * podela.brojDelova,
    procenjenoPlacanjeRSD: podela.jedinicaSeKupuje * ulaz.nabavnaCena,
    odnosPonistenja: odnos,
  };
}

// ─── Red (čl. 22) ─────────────────────────────────────────────────────────────

export interface StavkaReda {
  userId: string;
  /** Broj POEN-a u trenutku isteka roka za prijavu. */
  poen: number;
  /** Kada se korisnik prijavio. */
  prijavljenoAt: Date;
  /** Kada je nalog otvoren — poslednje merilo pri potpunoj izjednačenosti. */
  nalogOd: Date;
}

/**
 * Čl. 22 — red po broju POEN-a, od većeg ka manjem.
 *
 * 🔴 Nije „rang" u smislu statusa nego prosto količina: mesto u redu ne proizvodi
 * dejstvo izvan te nabavke (st. 4). Izjednačenost se razrešava do kraja — ranija
 * prijava, pa stariji nalog — jer bi neodređen redosled bio svađa nad javnim
 * spiskom.
 */
export function poredjajRed<T extends StavkaReda>(stavke: T[]): T[] {
  return [...stavke].sort((a, b) => {
    if (b.poen !== a.poen) return b.poen - a.poen;
    const p = a.prijavljenoAt.getTime() - b.prijavljenoAt.getTime();
    if (p !== 0) return p;
    return a.nalogOd.getTime() - b.nalogOd.getTime();
  });
}

// ─── Rokovi (čl. 21, 23, 26) ──────────────────────────────────────────────────

/**
 * Kraj dana koji pada `plusDana` posle datog trenutka, u ponoć.
 *
 * Rokovi se mere do kraja dana, ne na sat tačno: nabavka objavljena u 14 časova
 * daje svakome pune tri dana, a ne dva i po. Isti obračunski ritam kao ostatak
 * sistema (ponoć do ponoći).
 */
export function krajDana(od: Date, plusDana: number): Date {
  const d = new Date(od);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + plusDana + 1);
  return d;
}

/** Čl. 21 st. 2 — rok za prijavu ističe krajem trećeg dana od objave. */
export function rokPrijave(objavljenoAt: Date): Date {
  return krajDana(objavljenoAt, ROK_PRIJAVE_DANA);
}

/** Čl. 23 st. 3 — rok za odgovor na poziv ističe krajem trećeg dana od poziva. */
export function rokPotvrde(pozvanAt: Date): Date {
  return krajDana(pozvanAt, ROK_POTVRDE_DANA);
}

/** Čl. 26 st. 2 — period preuzimanja traje tri dana od prvog dana preuzimanja. */
export function krajPeriodaPreuzimanja(preuzimanjeOd: Date): Date {
  return krajDana(preuzimanjeOd, PERIOD_PREUZIMANJA_DANA - 1);
}

/**
 * Čl. 23 st. 2 — upisan dan preuzimanja mora pasti unutar objavljenog perioda.
 * Bez te granice lanac poziva ne bi imao kraj: neko bi upisao datum za pola godine
 * i time zauvek zauzeo deo.
 */
export function danJeUPeriodu(dan: Date, od: Date, doDatuma: Date): boolean {
  const d = new Date(dan);
  d.setHours(0, 0, 0, 0);
  const o = new Date(od);
  o.setHours(0, 0, 0, 0);
  return d.getTime() >= o.getTime() && d.getTime() < doDatuma.getTime();
}

/** Čl. 32 — najkasniji trenutak brisanja predloga koji niko nije osvežio. */
export function predlogIstice(upisanAt: Date): Date {
  const d = new Date(upisanAt);
  d.setMonth(d.getMonth() + ROK_PREDLOGA_MESECI);
  return d;
}

// ─── Ko učestvuje (čl. 4) ─────────────────────────────────────────────────────

export interface UcesnikProvera {
  maloletan: boolean;
  deaktiviranAt: Date | null;
  status: string;
}

/**
 * Čl. 4 — u nabavci učestvuju punoletni korisnici sa aktivnim nalogom.
 *
 * 🔴 Maloletni nalog je isključen izričito, a ne posredno preko indeksa: dete sme
 * da ima POEN i ušlo bi u red, a ne sme da bude strana u preuzimanju robe.
 */
export function smeUcestvovati(u: UcesnikProvera): boolean {
  if (u.maloletan) return false;
  if (u.deaktiviranAt) return false;
  return u.status === "ACTIVE";
}

// ─── Izborno glasanje (Gornje Kolo čl. 8 st. 4, čl. 9 st. 2) ──────────────────

export interface MogucnostIzbora {
  /** Id naziva dobra. */
  kljuc: string;
  /** Zbir glasačke moći datih glasova. */
  moc: number;
  /** Broj različitih korisnika koji su taj naziv predložili (prvo merilo pri izjednačenosti). */
  brojPredlagaca: number;
  /** Kada je naziv unet u registar (drugo merilo pri izjednačenosti). */
  unetAt: Date;
}

/**
 * Utvrđuje izabranu mogućnost pri izbornom glasanju.
 *
 * Pobeđuje najveći zbir glasačke moći. Izjednačenost razrešava merilo iz čl. 13
 * st. 2 posebnog pravilnika: veći broj različitih predlagača, pa raniji upis u
 * registar. Bez tog razrešenja izbor bi ostao neodređen, a glasanje bi se
 * ponavljalo bez ijednog razloga.
 *
 * Vraća `null` kad nema nijedne mogućnosti ili nijedan glas nije dat.
 */
export function utvrdiIzbor(mogucnosti: MogucnostIzbora[]): MogucnostIzbora | null {
  const sa = mogucnosti.filter((m) => m.moc > 0);
  if (sa.length === 0) return null;
  return [...sa].sort((a, b) => {
    if (b.moc !== a.moc) return b.moc - a.moc;
    if (b.brojPredlagaca !== a.brojPredlagaca) return b.brojPredlagaca - a.brojPredlagaca;
    return a.unetAt.getTime() - b.unetAt.getTime();
  })[0];
}
