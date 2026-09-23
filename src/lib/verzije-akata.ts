/**
 * Verzije akata koje sistem trenutno servira — JEDAN izvor istine.
 *
 * ČISTA datoteka, bez ijednog `import`-a: uvozi je i server (stranice `/uslovi` i
 * `/privatnost`, zapis pristanka) i pretraživač (prikaz verzije uz kvačicu pri
 * registraciji).
 *
 * ─── Zašto postoji ──────────────────────────────────────────────────────────
 *
 * Do seta 4.6.3 verzija Uslova i Politike nije postojala nigde u kodu — ime fajla
 * je bilo otkucano u samoj stranici (`ucitajPravniDokument("politika_4_6_1.md")`),
 * a broj verzije živeo je odvojeno u `messages` labelama. Zapis pristanka mora da
 * kaže NA KOJU verziju je čovek pristao, pa bi treća prepisana kopija istog broja
 * bila treće mesto koje se razilazi — isti kvar koji je u CLAUDE.md već tri puta
 * opisan („ne prepisivati tabele u ekrane").
 *
 * 🟢 Zašto je dovoljno snimiti broj, a ne ceo tekst akta: pravilo bumpovanja
 * obezbeđuje da objavljen fajl nikad ne promeni sadržaj — šifra u imenu fajla JESTE
 * objava. `politika_4_6_3.md` zato i za deset godina govori ono što je govorio na
 * dan davanja pristanka.
 *
 * 🔴 Pri svakom bumpu Uslova ili Politike menja se i ovo. Zaključano testom
 * `pristanak-izvor.test.ts`, koji traži da fajl sa ovim imenom postoji na svih pet
 * jezika i da se broj verzije poklapa sa imenom fajla.
 */

export type Akt = {
  /** Broj verzije, kako se upisuje u zapis pristanka. */
  verzija: string;
  /** Ime fajla u `dokumentacija 4.1/` (i u svakom `<jezik>/` podfolderu). */
  fajl: string;
};

export const AKT_USLOVI: Akt = {
  // 4.6.6 — R-01: čl. 14 — prepis POEN-a otvoren članu sa utvrđenim identitetom
  // 4.6.4 — R-07: čl. 18 („iznos u POEN-ima" umesto „cena"), nov stav u čl. 20
  // (obaveze onoga ko nudi), dva nova stava u čl. 21 (dobra čiji je promet
  // ograničen; zabrana za maloletnog korisnika) i nov čl. 22b (odnos prema
  // propisima o zaštiti potrošača).
  verzija: "4.6.6",
  fajl: "uslovi_koriscenja_4_6_6.md",
};

export const AKT_POLITIKA: Akt = {
  verzija: "4.6.3",
  fajl: "politika_4_6_3.md",
};

/**
 * Verzija teksta kojim se traži pristanak na analitičke kolačiće.
 *
 * 🔴 Nije verzija akta nego samog obaveštenja u banneru. Podiže se kad se tekst
 * promeni ili kad se promeni ono na šta se pristaje (drugi alat, druga svrha) —
 * i tada se svi koji su odlučivali po starom tekstu pitaju ponovo. Bez toga
 * „pristao je" prestaje da znači išta posle prve izmene.
 */
export const VERZIJA_PRISTANKA_KOLACICI = "1";
