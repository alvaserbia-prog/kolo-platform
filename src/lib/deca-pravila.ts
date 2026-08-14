/**
 * Pravila Modula Deca — ČISTE funkcije, bez baze.
 * Osnov: Pravilnik o Modulu Deca (prva verzija), Pravilnik o KOLO sistemu čl. 58.
 *
 * Izdvojeno iz `src/lib/protokol/deca.ts` (koji radi sa Prismom) zato što ista
 * pravila treba i pretraživaču — obrascu za otvaranje naloga, prekidaču na profilu
 * deteta i prikazu Pijace. Servisni modul ih re-eksportuje, pa server ima jedan ulaz.
 *
 * ─── Načelo koje nosi ceo modul ─────────────────────────────────────────────
 *
 * 🔴 U dečjem prostoru NE NASTAJE nijedan nov zapis POEN-a (čl. 14 st. 1). Sve što
 * u njemu kruži ušlo je prepisom od roditelja, a prepis je zero-sum. Zbog toga
 * dečji nalozi ne pomeraju opticaj — a preko njega ni osnivački korak od 24.000
 * POEN-a (prag na svakih 100.000), ni dnevni limit programa, ni obračunski
 * koeficijent ZRNA.
 *
 * Svaka izmena koja bi u dečji prostor uvela emisiju (dečji zadaci, doprinos
 * sadržaju, podsticaji) mora najpre izričito odstupiti od ove rečenice.
 */

/** Donja granica uzrasta za pristup modulu (čl. 2). */
export const UZRAST_MIN = 7;

/** Gornja granica — punoletstvom prestaje svojstvo maloletnog korisnika (čl. 2). */
export const UZRAST_PUNOLETSTVO = 18;

/** Rok u kome se potvrđivači roditelja izjašnjavaju o postojanju deteta (čl. 6 st. 2). */
export const ROK_POTVRDE_DANA = 30;

/**
 * `status` razdvaja dve vrste odbijanja:
 *  - 400 — podatak nije ispravan (uzrast van opsega, prazan pseudonim);
 *  - 403 — radnja nije dozvoljena po pravilima modula.
 */
export type Provera = { ok: true } | { ok: false; razlog: string; status: 400 | 403 };

/**
 * Najmanji oblik korisnika iz koga se izvodi svaka odluka ovog modula.
 * Punoletan korisnik je onaj kome je `maloletan === false`.
 */
export type Ucesnik = {
  id: string;
  maloletan: boolean;
  /** Prekidač iz čl. 10 st. 2. Kod punoletnog korisnika nema značenja. */
  dozvolaOdrasli: boolean;
  /** Roditelj koji je otvorio nalog. Kod punoletnog korisnika je `null`. */
  roditeljId: string | null;
};

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
  return dete.maloletan && dete.roditeljId === roditelj.id;
}

/**
 * Da li par sme da komunicira i razmenjuje (čl. 12).
 *
 * Maloletni korisnici čine jedinstvenu grupu bez razvrstavanja po uzrastu, pa
 * međusobno smeju uvek. Sa punoletnim korisnikom smeju samo uz saglasnost
 * roditelja — a saglasnost stoji na DETETU, jer je punoletni korisnik ne daje.
 *
 * Par dvoje punoletnih korisnika ovaj modul ne uređuje i propušta se dalje.
 */
export function smeDaKomunicira(a: Ucesnik, b: Ucesnik): Provera {
  if (!a.maloletan && !b.maloletan) return { ok: true };
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
 * Roditelj prepisuje svom detetu bez uslova (st. 2) — saglasnost iz čl. 10 uređuje
 * odnos sa TREĆIM punoletnim licima, ne odnos sa sopstvenim roditeljem. Van toga
 * važi isto pravilo kao za komunikaciju.
 */
export function smeDaPrepise(od: Ucesnik, ka: Ucesnik): Provera {
  if (jeMojeDete(od, ka) || jeMojeDete(ka, od)) return { ok: true };
  return smeDaKomunicira(od, ka);
}

/**
 * Da li posmatrač sme da vidi oglas (čl. 13).
 *
 * Oglas maloletnog korisnika nije javno dostupan: vide ga maloletni korisnici i
 * njegov roditelj, a uz saglasnost i punoletni korisnici. Gost ga ne vidi nikada.
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
  if (oglasivac.roditeljId === posmatrac.id) return true;
  if (posmatrac.maloletan) return true;
  return oglasivac.dozvolaOdrasli;
}

/**
 * Da li nalozi miruju (čl. 16).
 *
 * Mirovanje nastupa kada stvarnost roditelja više nije potvrđena u meri propisanoj
 * Pravilnikom o dokazu stvarnosti, i pogađa i roditeljev i detetov nalog. Nije mera
 * i ne teku rokovi propisani za suspenziju; ništa se ne briše.
 *
 * Prag se prosleđuje spolja da ovaj modul ne bi uvozio `dokaz-stvarnosti.ts`.
 */
export function jeUMirovanju(
  roditelj: { verified: boolean; indeksStvarnosti: number },
  pragIndeksa: number
): boolean {
  return !roditelj.verified || roditelj.indeksStvarnosti < pragIndeksa;
}

/** Trenutak isteka roka za izjašnjenje, računat od otvaranja naloga (čl. 6 st. 2). */
export function rokIzjasnjenja(otvorenAt: Date): Date {
  return new Date(otvorenAt.getTime() + ROK_POTVRDE_DANA * 24 * 60 * 60 * 1000);
}

/** Koliko je dana ostalo do isteka roka; 0 kad je rok prošao. */
export function danaDoIsteka(rokDo: Date, sada: Date): number {
  const ms = rokDo.getTime() - sada.getTime();
  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1000));
}
