/**
 * Centralne provere ovlašćenja (uloga).
 *
 * Razdvaja DVE nezavisne ose:
 *   1. Članski tip (TipKorisnika) — šta si u zajednici (zarađuje se).
 *   2. Admin rola (AdminRola)      — šta smeš operativno (dodeljuje se).
 *
 * Dve nezavisne ose:
 *   - Članski tip (TipKorisnika): NEVERIFIKOVAN → REGULARNI → NOSILAC_ZRNA.
 *   - Admin nivo (AdminNivo, kolona `admin`): NONE / ADMIN / SUPERADMIN.
 * `jeAdmin`/`jeSuperadmin` čitaju `admin`; `mozeNadzor`/`jeKorenJemstva`
 * kombinuju članski tip i admin nivo.
 *
 * Modul NE sme da uvozi Prisma client (koristi ga i proxy.ts u edge middleware-u),
 * zato se porede string literali, ne enum vrednosti.
 */

/** Minimalni oblik koji zadovoljavaju i session.user, i JWT token, i DB korisnik. */
export type KorisnikDozvole = {
  tipKorisnika?: string | null;
  admin?: string | null;
};

/**
 * Prošireni krug funkcija (R-01, mera M-9 i odluka B).
 *
 * Otvoren je potvrđenom članu i članu čiji je identitet utvrđen na donatorskom
 * putu — čoveku je neko poredio uplatioca iz izvoda sa nalogom, dakle iza naloga
 * stoji identitet koji je banka već identifikovala.
 *
 * 🔴 Ovo NIJE potvrda stvarnosti i ne zamenjuje je (čl. 32 Pravilnika, čl. 5
 * Pravilnika o dokazu stvarnosti). Otvara: oglas POTRAŽNJA i više od tri oglasa,
 * pokretanje razgovora, Pričaonicu, pretragu članova i sužen pregled tuđeg
 * profila, UPIS ZRNA i — od seta 4.6.6 — PREPIS POEN-a.
 *
 * 🔴 Ne otvara: aktiviranje i otpis ZRNA, glas i delegiranje u Gornjem Kolu,
 * nadzor verifikacija, potvrđivanje drugih, operativni doprinos, socijalne
 * programe, kolektivnu nabavku, pokroviteljstvo i kontakt oglašivača. Granica
 * je jedna: radnje učešća u razmeni i u obračunu jesu otvorene, radnje
 * UPRAVLJANJA i JEMČENJA za druge nisu.
 *
 * 🔴 Prepis se ne odlučuje ovde nego u `smeDaSalje` (`doprinos-pravila.ts`) —
 * jedno mesto za rutu, ekran i gašenje naloga. Ne uvoditi drugu proveru.
 *
 * 🟡 Zatečena zabrana prepisa (do 4.6.5) vodila se kao razlika između R-01 = 5
 * i R-01 = 9. Odluka vlasnika 23.09.2026: zabrana nije sprečavala ishod nego
 * samo redosled, jer oglašivač sme da potvrdi kupca na istom sastanku. Obe
 * ocene i obrazloženje stoje u `docs/sprovodjenje-rizika-2026-09.md`.
 */
export type KorisnikProsireni = {
  verified?: boolean | null;
  identitetUtvrdjen?: boolean | null;
};

export function smeProsireno(u?: KorisnikProsireni | null): boolean {
  return Boolean(u?.verified) || Boolean(u?.identitetUtvrdjen);
}

const NOSILAC_ZRNA = "NOSILAC_ZRNA";
const ADMIN = "ADMIN";
const SUPERADMIN = "SUPERADMIN";

/** Superadmin — vidi sve, nadzire admine, drži opasne/sistemske poluge. */
export function jeSuperadmin(u?: KorisnikDozvole | null): boolean {
  return u?.admin === SUPERADMIN;
}

/** Admin — svakodnevna operativa (uključuje i superadmina). */
export function jeAdmin(u?: KorisnikDozvole | null): boolean {
  return u?.admin === ADMIN || u?.admin === SUPERADMIN;
}

/** Nadzor verifikacija i druge distribuirane (kvorum) funkcije — nosioci ZRNA + admini. */
export function mozeNadzor(u?: KorisnikDozvole | null): boolean {
  return u?.tipKorisnika === NOSILAC_ZRNA || jeAdmin(u);
}

/**
 * Glas u Gornjem Kolu (R-01, odluka B).
 *
 * Traži DVOJE: aktivirano ZRNO i potvrđenu stvarnost. Član čiji je identitet
 * utvrđen na donatorskom putu ZRNO drži, ali ne glasa — novcem se dobija položaj
 * u zajedničkom dobru, ne glas. Uz to `verified` u sesiji već nosi i funkcionalni
 * prag indeksa (≥ 10%), pa glas gubi i onaj kome potvrda bude poništena.
 *
 * 🔴 Ne svoditi na „ima aktivno ZRNO": do ove mere je glasanje gledalo samo to,
 * pa bi ga zadržao i onaj ko je aktivirao ZRNO pre nego što mu je indeks pao.
 */
export function smeGlasati(
  u: KorisnikProsireni | null | undefined,
  aktivnoZrno: number,
): boolean {
  return aktivnoZrno > 0 && Boolean(u?.verified);
}

/** Koren lanca potvrda — bootstrap poverenja (superadmin verifikuje prve ljude). */
export function jeKorenJemstva(u?: KorisnikDozvole | null): boolean {
  return jeSuperadmin(u);
}
