/**
 * Pravila Modula Deca — ČISTE funkcije, bez baze.
 * Osnov: Pravilnik o Modulu Deca (druga verzija), Pravilnik o KOLO sistemu čl. 58.
 *
 * Izdvojeno iz `src/lib/protokol/deca.ts` (koji radi sa Prismom) zato što ista
 * pravila treba i pretraživaču — obrascu za otvaranje naloga, prekidaču na profilu
 * deteta, ekranu deteta na čekanju i prikazu Pijace. Servisni modul ih re-eksportuje,
 * pa server ima jedan ulaz.
 *
 * ─── Načelo koje nosi ceo modul ─────────────────────────────────────────────
 *
 * Dete nema razloga da laže o uzrastu. Neverifikovan punoletni nalog ne dobija
 * ništa dok ga neko ne potvrdi u lancu potvrda; dete koje bi se lažno predstavilo
 * kao odraslo tražilo bi potvrdu koju nikad neće dobiti i ostalo bi prazan nalog.
 * Deklaracija „ja sam dete" vodi ka prijateljstvima i POEN-u. Sistem uzrast NE
 * proverava i ne mora — istina je jedini put ka onome što dete želi.
 *
 * 🔴 IZMENA U ODNOSU NA PRVU VERZIJU: u dečjem prostoru sada NASTAJU zapisi POEN-a
 * (500 po prijateljstvu, čl. 14b). Ranija rečenica „u dečjem prostoru ne nastaje
 * nijedan nov zapis POEN-a" (čl. 14 st. 1 prve verzije) više NE važi. Posledica koju
 * treba znati: emisija iz dečjeg prostora ulazi u opticaj, pa pomera prag osnivačkog
 * koraka (na svakih 100.000 POEN) i obračunski koeficijent ZRNA — u OBA smera, jer
 * se pri raskidu i pri punoletstvu POEN otpisuje.
 */

/** Donja granica uzrasta za pristup modulu (čl. 2). */
export const UZRAST_MIN = 7;

/** Gornja granica — punoletstvom prestaje svojstvo maloletnog korisnika (čl. 2). */
export const UZRAST_PUNOLETSTVO = 18;

/** Rok u kome se potvrđivači roditelja izjašnjavaju o postojanju deteta (čl. 6 st. 2). */
export const ROK_POTVRDE_DANA = 30;

/**
 * Koliko važi link iz poruke poslate roditelju (čl. 4b st. 3).
 *
 * Kraće od roka za brisanje namerno: link je jednokratan i putuje elektronskom
 * poštom, pa ne sme da leži upotrebljiv dve nedelje. Kad istekne, ostaje rezervni
 * put — šestocifreni kod iz profila deteta, koji važi do samog brisanja.
 */
export const ROK_TOKENA_DANA = 7;

/**
 * Koliko nalog deteta sme da postoji bez preuzimanja (čl. 4b st. 5).
 *
 * 🔴 Rok važi SAMO za preuzimanje naloga, ne i za drugi korak (da roditelj postane
 * redovan član). Razlog je pravni, ne tehnički: dete na čekanju je lice čiji se
 * podaci obrađuju PRE pribavljenog pristanka roditelja, i to ne sme da traje
 * neograničeno. Posle preuzimanja pristanak postoji, obrada je zakonita i ništa ne
 * visi — rok tu ne bi štitio ništa, samo bi ubijao naloge dece čiji roditelji nisu
 * bili spori nego bez veze u mreži.
 */
export const ROK_PREUZIMANJA_DANA = 14;

/** POEN po sklopljenom prijateljstvu, svakoj strani (čl. 14b st. 1). */
export const PRIJATELJSTVO_POEN = 500;

/** Koliko dana pre punoletstva ide najava o otpisu i zatvaranju prijateljstava (čl. 19 st. 6). */
export const NAJAVA_PUNOLETSTVA_DANA = 30;

/**
 * `status` razdvaja dve vrste odbijanja:
 *  - 400 — podatak nije ispravan (uzrast van opsega, prazan pseudonim);
 *  - 403 — radnja nije dozvoljena po pravilima modula.
 */
export type Provera = { ok: true } | { ok: false; razlog: string; status: 400 | 403 };

/**
 * Tri stanja naloga maloletnog korisnika (čl. 4c).
 *
 * Razlika između dva ulaza u modul je SAMO u tome na kom stanju nalog počinje:
 * dete koje se registrovalo samo počinje na `NA_CEKANJU`, a nalog koji je roditelj
 * otvorio iz svog profila ulazi odmah u `AKTIVNO`.
 *
 *  - `NA_CEKANJU` — nalog postoji, veza sa roditeljem ne. Ima profil, skenira QR
 *    kodove i sklapa prijateljstva. **Nema Pričaonicu.** POEN mu se ne upisuje.
 *  - `POVEZANO` — roditelj je preuzeo nalog, ali još nije redovan član. Pričaonica
 *    se otvara, oglasi i poruke rade. POEN i dalje čeka.
 *  - `AKTIVNO` — bar jedan roditelj je redovan član. Pun pristup, POEN se upisuje.
 */
export type StanjeDeteta = "NA_CEKANJU" | "POVEZANO" | "AKTIVNO";

/** Roditelj onako kako ga vidi ovaj modul — dovoljno da se odredi stanje deteta. */
export type RoditeljStanje = {
  /** Nalog roditelja radi (nije ugašen ni isključen). */
  aktivan: boolean;
  /** Redovan član: potvrđen u lancu potvrda, sa indeksom iznad funkcionalnog praga. */
  redovan: boolean;
};

/**
 * Najmanji oblik korisnika iz koga se izvodi svaka odluka ovog modula.
 * Punoletan korisnik je onaj kome je `maloletan === false`.
 */
export type Ucesnik = {
  id: string;
  maloletan: boolean;
  /** Prekidač iz čl. 10 st. 2. Kod punoletnog korisnika nema značenja. */
  dozvolaOdrasli: boolean;
  /** Roditelji (najviše dva, ista ovlašćenja). Kod punoletnog korisnika prazno. */
  roditeljIds: string[];
  /** Kod punoletnog korisnika uvek `AKTIVNO` — stanja se odnose samo na decu. */
  stanje: StanjeDeteta;
};

// ── Stanje naloga ─────────────────────────────────────────────────────────────

/**
 * Stanje naloga maloletnog korisnika po roditeljima koje ima (čl. 4c).
 *
 * 🔴 Dovoljan je JEDAN redovan roditelj. Dete sa dvoje roditelja ne sme da bude
 * u lošijem položaju od deteta sa jednim samo zato što drugi roditelj još nije
 * prošao lanac potvrda.
 */
export function stanjeDeteta(roditelji: RoditeljStanje[]): StanjeDeteta {
  const zivi = roditelji.filter((r) => r.aktivan);
  if (zivi.length === 0) return "NA_CEKANJU";
  return zivi.some((r) => r.redovan) ? "AKTIVNO" : "POVEZANO";
}

/**
 * Da li nalog sme u Pričaonicu (čl. 18 st. 2).
 *
 * 🔴 Bezbednosno pravilo, ne kazna. Iza deteta koje je roditelj uveo stoji potvrđen
 * odrastao čovek i svi koji su njega potvrdili. Iza deteta na čekanju ne stoji
 * niko — registrovalo se za dva minuta sa bilo kojim imejlom, pa bi se odrastao
 * čovek tako predstavio kao dvanaestogodišnjak bez ijedne prepreke. Ranije je taj
 * rizik hvatalo roditeljsko čitanje razgovora; pošto roditelj više ne čita,
 * Pričaonica bi ostala bez ijedne provere.
 *
 * Ovo je i najjači pritisak koji sistem vrši: POEN je apstraktan sedmogodišnjaku,
 * a ne moći odgovoriti drugu koji ti je upravo skenirao kod — to je konkretno.
 */
export function smeUPricaonicu(stanje: StanjeDeteta): boolean {
  return stanje !== "NA_CEKANJU";
}

/**
 * Da li se nalogu upisuje POEN iz dečjih kanala (čl. 14b st. 2).
 * Prepis od roditelja i razmena sa drugom decom nisu upis — oni su zero-sum.
 */
export function poenSeUpisuje(stanje: StanjeDeteta): boolean {
  return stanje === "AKTIVNO";
}

/**
 * Da li nalog sme da objavljuje oglase, piše poruke i prepisuje POEN.
 *
 * Sve to traži da iza naloga stoji neko ko je sam prošao registraciju — isti uslov
 * kao za Pričaonicu, iz istog razloga.
 */
export function nalogRadi(stanje: StanjeDeteta): boolean {
  return stanje !== "NA_CEKANJU";
}

/** Poruka koju vidi dete čiji nalog čeka roditelja. Jedna, na svim mestima. */
export const PORUKA_CEKA_RODITELJA =
  "Nalog čeka da ga preuzme roditelj. Do tada možeš da skupljaš prijatelje.";

// ── Uzrast ────────────────────────────────────────────────────────────────────

/**
 * Navršene godine na dati dan.
 *
 * 🔴 `danas` MORA biti beogradski dan (`beogradskiDan()` iz `obracunski-dan.ts`).
 * Golo `new Date()` u UTC-u pomera rođendan dva sata unazad u letnjem periodu —
 * dovoljno da uzrast pređe pre ponoći po lokalnom vremenu.
 */
export function uzrast(datumRodjenja: Date, danas: Date): number {
  let godine = danas.getUTCFullYear() - datumRodjenja.getUTCFullYear();
  const mesec = danas.getUTCMonth() - datumRodjenja.getUTCMonth();
  if (mesec < 0 || (mesec === 0 && danas.getUTCDate() < datumRodjenja.getUTCDate())) {
    godine -= 1;
  }
  return godine;
}

/** Dan kada nalog prelazi u punoletni (čl. 19 st. 1). */
export function datumPunoletstva(datumRodjenja: Date): Date {
  const d = new Date(datumRodjenja.getTime());
  d.setUTCFullYear(d.getUTCFullYear() + UZRAST_PUNOLETSTVO);
  return d;
}

/** Da li uzrast dopušta otvaranje naloga maloletnog korisnika (čl. 2). */
export function uzrastZaModul(godine: number): Provera {
  if (!Number.isInteger(godine)) {
    return { ok: false, razlog: "Datum rođenja nije ispravan.", status: 400 };
  }
  if (godine < UZRAST_MIN) {
    return {
      ok: false,
      razlog: `Nalog se otvara detetu koje je navršilo ${UZRAST_MIN} godina.`,
      status: 400,
    };
  }
  if (godine >= UZRAST_PUNOLETSTVO) {
    return {
      ok: false,
      razlog: "Osoba koja je navršila 18 godina otvara nalog sama.",
      status: 400,
    };
  }
  return { ok: true };
}

// ── Ko sa kim ─────────────────────────────────────────────────────────────────

/** Da li je `dete` upravo dete tog roditelja. */
export function jeMojeDete(roditelj: Ucesnik, dete: Ucesnik): boolean {
  return dete.maloletan && dete.roditeljIds.includes(roditelj.id);
}

/**
 * Braća i sestre — bar jedan zajednički roditelj (čl. 14b st. 4).
 *
 * 🔴 Njihovo prijateljstvo se sklapa normalno, samo ne nosi POEN. Bez toga bi
 * šestoro dece jednog čoveka dalo petnaest parova bez ijednog stranca.
 */
export function suBracaISestre(a: Ucesnik, b: Ucesnik): boolean {
  return a.roditeljIds.some((r) => b.roditeljIds.includes(r));
}

/**
 * Da li sklopljeno prijateljstvo nosi POEN (čl. 14b).
 *
 * Tri uslova, svi obavezni: obe strane su deca, obe su AKTIVNE i nisu braća.
 * Obostrano čekanje je i cela odbrana od farmovanja — lažni nalozi nikad ne postaju
 * aktivni, pa se POEN nikad ne upisuje i nema šta da se izvuče.
 */
export function prijateljstvoNosiPoen(a: Ucesnik, b: Ucesnik): boolean {
  if (!a.maloletan || !b.maloletan) return false;
  if (suBracaISestre(a, b)) return false;
  return poenSeUpisuje(a.stanje) && poenSeUpisuje(b.stanje);
}

/**
 * Da li par sme da komunicira i razmenjuje (čl. 12).
 *
 * Maloletni korisnici čine jedinstvenu grupu bez razvrstavanja po uzrastu, pa
 * međusobno smeju uvek — osim dok neki od naloga čeka roditelja. Sa punoletnim
 * korisnikom smeju samo uz saglasnost roditelja, a saglasnost stoji na DETETU, jer
 * je punoletni korisnik ne daje.
 *
 * Par dvoje punoletnih korisnika ovaj modul ne uređuje i propušta se dalje.
 */
export function smeDaKomunicira(a: Ucesnik, b: Ucesnik): Provera {
  if (!a.maloletan && !b.maloletan) return { ok: true };

  for (const u of [a, b]) {
    if (u.maloletan && !nalogRadi(u.stanje)) {
      return { ok: false, razlog: PORUKA_CEKA_RODITELJA, status: 403 };
    }
  }

  if (a.maloletan && b.maloletan) return { ok: true };

  const dete = a.maloletan ? a : b;
  if (dete.dozvolaOdrasli) return { ok: true };
  return {
    ok: false,
    razlog:
      "Razgovor između maloletnog i punoletnog korisnika otvara roditelj, na profilu svog deteta.",
    status: 403,
  };
}

/**
 * Da li je prepis POEN-a dopušten (čl. 14).
 *
 * Roditelj prepisuje svom detetu bez uslova, u oba pravca (st. 2) — saglasnost iz
 * čl. 10 uređuje odnos sa TREĆIM punoletnim licima, ne odnos sa sopstvenim
 * roditeljem. Van toga važi isto pravilo kao za komunikaciju.
 */
export function smeDaPrepise(od: Ucesnik, ka: Ucesnik): Provera {
  if (jeMojeDete(od, ka) || jeMojeDete(ka, od)) return { ok: true };
  return smeDaKomunicira(od, ka);
}

/**
 * Da li posmatrač sme da vidi oglas (čl. 13).
 *
 * Oglas maloletnog korisnika nije javno dostupan: vide ga maloletni korisnici i
 * njegovi roditelji, a uz saglasnost i punoletni korisnici. Gost ga ne vidi nikada.
 *
 * 🟡 Drugi smer — da li maloletni korisnik vidi oglase punoletnih — pravilnik ne
 * uređuje izričito. Vezan je za isti prekidač, jer je po čl. 12 odnos sa punoletnim
 * korisnicima u celini uslovljen saglasnošću; prikazivanje oglasa na koje dete ne
 * sme da se javi bilo bi i zbunjujuće i šire od dopuštenog kontakta.
 */
export function smeDaVidiOglas(
  posmatrac: (Ucesnik & { admin?: boolean }) | null,
  oglasivac: Ucesnik
): boolean {
  if (!oglasivac.maloletan) {
    // Oglas punoletnog korisnika: javan je svima, a maloletnom se prikazuje uz saglasnost.
    if (!posmatrac?.maloletan) return true;
    return posmatrac.dozvolaOdrasli;
  }
  if (!posmatrac) return false;
  if (posmatrac.id === oglasivac.id) return true;
  if (posmatrac.admin) return true;
  if (oglasivac.roditeljIds.includes(posmatrac.id)) return true;
  if (posmatrac.maloletan) return true;
  return oglasivac.dozvolaOdrasli;
}

/**
 * Da li posmatrač sme da otvori profil maloletnog korisnika.
 *
 * ─── Načelo ─────────────────────────────────────────────────────────────────
 *
 * 🔴 **Do deteta se dolazi samo kroz ono što je dete sámo objavilo.** Nikad kroz
 * profil, nikad kroz pretragu, nikad kroz spisak. Ranglista i knjiga zapisa
 * pokazuju da dete postoji — one nisu vrata ni u šta.
 *
 * Ovo je SUŽAVANJE u odnosu na zatečeno stanje: do sada je profil maloletnog naloga
 * bio dostupan svakom potvrđenom članu, i krio je samo indeks i lanac potvrda.
 *
 * ─── Šta zatvaranje stvarno štiti ───────────────────────────────────────────
 *
 * Ne krije detetove transakcije — knjiga zapisa je otvorena i tako ostaje, pa je
 * uporan čovek može prelistati. Krije sve ostalo SKUPLJENO NA JEDNOM MESTU: sliku,
 * opis, mesto, školu, prijateljstva i, najvažnije, ukupno stanje — a stanje je ono
 * što dete čini metom.
 *
 * ─── Ko ipak sme ────────────────────────────────────────────────────────────
 *
 *  - **Fondacija** — bez toga nema uklanjanja spornog oglasa ni postupanja po
 *    prijavi poruke; moderacija bi stala.
 *  - **Roditelj svog deteta** — uvid iz čl. 9, nepromenjen.
 *  - **Drugo dete, ali SAMO ako su prijatelji.** Dete iz iste škole koje mu nije
 *    prijatelj dobija isti zatvoren prikaz. Put do drugog deteta ostaje jedan:
 *    skeniran QR kod uživo.
 */
export function smeDaVidiProfilDeteta(
  posmatrac: (Ucesnik & { admin?: boolean }) | null,
  meta: Ucesnik,
  suPrijatelji: boolean
): boolean {
  // Profil punoletnog korisnika ovo pravilo ne dodiruje.
  if (!meta.maloletan) return true;
  if (!posmatrac) return false;
  if (posmatrac.id === meta.id) return true;
  if (posmatrac.admin) return true;
  if (meta.roditeljIds.includes(posmatrac.id)) return true;
  if (posmatrac.maloletan) return suPrijatelji;
  return false;
}

// ── Rokovi ───────────────────────────────────────────────────────────────────

/** Trenutak isteka roka za izjašnjenje, računat od otvaranja naloga (čl. 6 st. 2). */
export function rokIzjasnjenja(otvorenAt: Date): Date {
  return new Date(otvorenAt.getTime() + ROK_POTVRDE_DANA * 24 * 60 * 60 * 1000);
}

/** Trenutak do koga link iz poruke roditelju važi (čl. 4b st. 3). */
export function rokTokena(poslatoAt: Date): Date {
  return new Date(poslatoAt.getTime() + ROK_TOKENA_DANA * 24 * 60 * 60 * 1000);
}

/** Trenutak do koga nalog deteta sme da čeka preuzimanje (čl. 4b st. 5). */
export function rokPreuzimanja(registrovanAt: Date): Date {
  return new Date(registrovanAt.getTime() + ROK_PREUZIMANJA_DANA * 24 * 60 * 60 * 1000);
}

/** Koliko je dana ostalo do isteka roka; 0 kad je rok prošao. */
export function danaDoIsteka(rokDo: Date, sada: Date): number {
  const ms = rokDo.getTime() - sada.getTime();
  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1000));
}

// ── Punoletstvo (čl. 19) ─────────────────────────────────────────────────────

/**
 * Koliko se POEN-a otpisuje pri prelasku u punoletstvo.
 *
 * 🔴 Otpis pada na OBE strane: detetu `broj × 500`, i svakom od tih prijatelja po
 * 500. Ne broje se raskinuta prijateljstva (njihovih 500 je već otpisano — inače bi
 * isti POEN bio oduzet dvaput), prijateljstva sa braćom i sestrama (nikad nisu
 * nosila POEN) ni prijateljstva na čekanju (druga strana nikad nije postala
 * aktivna). Sve to nosi jedno polje: `Prijateljstvo.poenIsplacen`.
 *
 * Razlog za otpis je uravnoteženje kanala. Prijateljstvo nosi 500 za trideset
 * sekundi u istoj prostoriji; potvrda stvarnosti nosi 1.000, ali traži da tvrdiš
 * tuđi identitet i da izgubiš sopstvenu potvrdu ako slažeš. Bez poništenja bi onaj
 * ko krene sa 17 godina odradio godinu jeftinog kanala, ušao u 18. sa zalihom, i
 * povrh toga dobio ceo skupi kanal — isti čovek, godina razlike, trajno drugačija
 * pozicija.
 */
export function otpisPriPunoletstvu(brojIsplacenihPrijateljstava: number): number {
  return Math.max(0, brojIsplacenihPrijateljstava) * PRIJATELJSTVO_POEN;
}

/**
 * Da li nalog treba da bude obrađen kao punoletan na dati dan.
 * `null` datum rođenja znači dete na čekanju — uzrast još niko nije upisao.
 */
export function jePunoletan(datumRodjenja: Date | null, danas: Date): boolean {
  if (!datumRodjenja) return false;
  return uzrast(datumRodjenja, danas) >= UZRAST_PUNOLETSTVO;
}

/** Da li je vreme za najavu punoletstva (mesec dana ranije, čl. 19 st. 6). */
export function vremeZaNajavuPunoletstva(datumRodjenja: Date | null, danas: Date): boolean {
  if (!datumRodjenja) return false;
  const punoletstvo = datumPunoletstva(datumRodjenja);
  if (punoletstvo.getTime() <= danas.getTime()) return false;
  return danaDoIsteka(punoletstvo, danas) <= NAJAVA_PUNOLETSTVA_DANA;
}

// ── Mirovanje (istorijski pojam, čl. 16) ─────────────────────────────────────

/**
 * Da li roditelj svojim statusom drži dete van punog pristupa.
 *
 * 🟡 Pojam „mirovanje" iz prve verzije zamenjen je stanjem `POVEZANO`: kad
 * roditelju padne potvrda, dete ne staje nego se vraća korak unazad — Pričaonica,
 * oglasi i poruke rade, a upis POEN-a čeka. **Roditeljev sopstveni nalog se time ne
 * dira**; u prvoj verziji je i on mirovao, što u drugom ulazu nema smisla, jer
 * roditelj koji tek preuzme nalog i JESTE nov član.
 */
export function jeUMirovanju(
  roditelj: { verified: boolean; indeksStvarnosti: number },
  pragIndeksa: number
): boolean {
  return !roditelj.verified || roditelj.indeksStvarnosti < pragIndeksa;
}
