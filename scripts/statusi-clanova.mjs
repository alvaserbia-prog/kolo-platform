/**
 * Statusi članova: „nov član" i „redovan član".
 *
 * Radnja ostaje „potvrda" (stranica Potvrde, glagol potvrditi, lanac potvrda) —
 * menja se samo kako se zove ČOVEK u svakom stanju:
 *
 *   posetilac → nov član → redovan član → nosilac ZRNA
 *
 * Zašto „redovan": u srpskom je to standardan izraz za člana sa svim pravima
 * (nasuprot pridruženom/vanrednom), a enum u bazi se već zove `REGULARNI` —
 * pa se oznaka na ekranu poklapa sa imenom u bazi.
 *
 * Zašto „nov" umesto negacije: „nepotvrđen"/„nepunopravan" imenuju manjak na
 * čoveku; „nov" imenuje trenutak koji prolazi. Nov član JESTE član — ima nalog,
 * objavljuje ponude, prima POEN, odgovara na poruke.
 *
 * 🔴 Pečat na Pijaci NAMERNO ostaje „BEZ POTVRDE". On radi zaštitni posao prema
 * kupcu — govori da iza oglašivača još niko nije stao. „NOV" bi rekao samo da je
 * skoro došao, a čovek može ostati bez potvrde godinu dana.
 *
 * 🔴 Ne diraju se mesta gde „potvrđeno" znači DRUGI institut: potvrda donacije,
 * potvrda pokroviteljstva, potvrda izvršenja zadatka, potvrda socijalnog
 * programa. Zato ovaj fajl radi po ključu, a ne po reči.
 */

/** Kratke oznake — pun tekst po jeziku. */
export const OZNAKE = {
  "common.verifikovan":            { sr: "Redovan član", hr: "Redovni član", en: "Full member", ru: "Действительный участник", hu: "Rendes tag" },
  "common.neverifikovan":          { sr: "Nov član",     hr: "Novi član",    en: "New member",  ru: "Новый участник",          hu: "Új tag" },
  "profil.status_verifikovan":     { sr: "Redovan član", hr: "Redovni član", en: "Full member", ru: "Действительный участник", hu: "Rendes tag" },
  "profil.status_ceka":            { sr: "Nov član",     hr: "Novi član",    en: "New member",  ru: "Новый участник",          hu: "Új tag" },
  "profil.tip_regularni":          { sr: "Redovan član", hr: "Redovni član", en: "Full member", ru: "Действительный участник", hu: "Rendes tag" },
  "profil.tip_neverifikovan":      { sr: "Nov član",     hr: "Novi član",    en: "New member",  ru: "Новый участник",          hu: "Új tag" },
  "verifikacija.tip_regularni":    { sr: "Redovan član", hr: "Redovni član", en: "Full member", ru: "Действительный участник", hu: "Rendes tag" },
  "verifikacija.tip_neverifikovan":{ sr: "Nov član",     hr: "Novi član",    en: "New member",  ru: "Новый участник",          hu: "Új tag" },
  "graf.tip_regularni":            { sr: "Redovan član", hr: "Redovni član", en: "Full member", ru: "Действительный участник", hu: "Rendes tag" },
  "graf.tip_neverifikovan":        { sr: "Nov član",     hr: "Novi član",    en: "New member",  ru: "Новый участник",          hu: "Új tag" },
  "admin.tip_regularni":           { sr: "Redovan član", hr: "Redovni član", en: "Full member", ru: "Действительный участник", hu: "Rendes tag" },
  "admin.tip_neverifikovan":       { sr: "Nov član",     hr: "Novi član",    en: "New member",  ru: "Новый участник",          hu: "Új tag" },
  "admin.dashboard_verifikovani":  { sr: "Redovni članovi", hr: "Redovni članovi", en: "Full members", ru: "Действительные участники", hu: "Rendes tagok" },
  "admin.korisnici_neverifikovan_badge": { sr: "nov", hr: "novi", en: "new", ru: "новый", hu: "új" },
  "sistem.lok_verifikovanih":      { sr: "redovnih",     hr: "redovnih",     en: "full members", ru: "действительных",         hu: "rendes tag" },
  "landing.statistike_clan":       { sr: "redovnih članova", hr: "redovnih članova", en: "full members", ru: "действительных участников", hu: "rendes tag" },
  "nadzor.subjekt_verifikovani":   { sr: "Onaj koga su potvrdili", hr: "Onaj koga su potvrdili", en: "The person who was confirmed", ru: "Тот, кого подтвердили", hu: "A megerősített személy" },
};

/**
 * Rečenice — zamena izraza, ali SAMO u ključevima navedenim u KLJUCEVI.
 * Time se ne dira „potvrđena donacija", „potvrđeno pokroviteljstvo" i slično.
 */
export const IZRAZI = {
  sr: [
    ["Dok te niko nije potvrdio možeš", "Dok si nov član, možeš"],
    ["Dok te niko nije potvrdio možete", "Dok si nov član, možete"],
    ["ponude onih bez potvrde", "ponude novih članova"],
    ["Preskočeno bez potvrde", "Preskočeno novih članova"],
    ["potvrđenim članovima", "redovnim članovima"],
    ["potvrđenim korisnicima", "redovnim članovima"],
    ["potvrđenih članova", "redovnih članova"],
    ["potvrđeni članovi", "redovni članovi"],
    ["potvrđeni korisnici", "redovni članovi"],
    ["Potvrđeni korisnici", "Redovni članovi"],
    ["potvrđenih korisnika", "redovnih članova"],
    ["Potvrđenim članovima", "Redovnim članovima"],
    ["potvrđenih ljudi", "redovnih članova"],
    ["Potvrđen korisnik", "Redovan član"],
    ["potvrđen korisnik", "redovan član"],
    ["potvrđenom vlasniku", "vlasniku koji je redovan član"],
    ["potvrđen član", "redovan član"],
    ["potvrđen/a si", "postao/la si redovan član"],
    ["Potvrđen/a si", "Postao/la si redovan član"],
    ["Potvrđeni ste!", "Sada ste redovan član!"],
    ["je potvrđen i dobio je pun pristup", "je postao redovan član i dobio pun pristup"],
    ["Time postaješ potvrđen član", "Time postaješ redovan član"],
    ["Kad si i sam jednom potvrđen", "Kad i sam postaneš redovan član"],
    ["Mora biti potvrđen.", "Mora biti redovan član."],
    ["Nije potvrđen.", "Nije redovan član."],
    ["mora biti potvrđen.", "mora biti redovan član."],
    ["Samo potvrđeni", "Samo redovni"],
    ["Samo potvrđen korisnik", "Samo redovan član"],
    ["moraju biti potvrđeni", "moraju biti redovni članovi"],
    ["mora biti potvrđen član", "mora biti redovan član"],
    ["5 potvrđenih", "5 redovnih"],
    // Kratki ostatak, poslednji jer bi inače pojeo duže izraze iznad.
    ["potvrđenih", "redovnih"], ["Potvrđenih", "Redovnih"],
  ],
  hr: [
    ["Dok te nitko nije potvrdio možeš", "Dok si novi član, možeš"],
    ["ponude onih bez potvrde", "ponude novih članova"],
    ["potvrđenim članovima", "redovnim članovima"],
    ["potvrđenim korisnicima", "redovnim članovima"],
    ["potvrđenih članova", "redovnih članova"],
    ["potvrđeni članovi", "redovni članovi"],
    ["potvrđeni korisnici", "redovni članovi"],
    ["potvrđen korisnik", "redovni član"],
    ["Potvrđen korisnik", "Redovni član"],
    ["potvrđen član", "redovni član"],
    ["Potvrđeni ste!", "Sada ste redovni član!"],
    ["Samo potvrđeni", "Samo redovni"],
    ["5 potvrđenih", "5 redovnih"],
    // Kratki ostatak, poslednji jer bi inače pojeo duže izraze iznad.
    ["potvrđenih", "redovnih"], ["Potvrđenih", "Redovnih"],
  ],
  en: [
    ["confirmed members", "full members"],
    ["confirmed member", "full member"],
    ["Confirmed members", "Full members"],
    ["Confirmed member", "Full member"],
    ["confirmed users", "full members"],
    ["confirmed user", "full member"],
    ["Confirmed users", "Full members"],
    ["Only confirmed", "Only full"],
    ["You are confirmed!", "You are now a full member!"],
  ],
  ru: [
    ["подтверждённым участникам", "действительным участникам"],
    ["подтверждённым пользователям", "действительным участникам"],
    ["подтверждённых участников", "действительных участников"],
    ["подтверждённые участники", "действительные участники"],
    ["подтверждённые пользователи", "действительные участники"],
    ["подтверждённый пользователь", "действительный участник"],
    ["Подтверждённый пользователь", "Действительный участник"],
    ["Только подтверждённые", "Только действительные"],
  ],
  hu: [
    ["megerősített tagok", "rendes tagok"],
    ["megerősített tag", "rendes tag"],
    ["Megerősített tagok", "Rendes tagok"],
    ["Megerősített tag", "Rendes tag"],
    ["megerősített felhasználók", "rendes tagok"],
    ["Csak megerősített", "Csak rendes"],
  ],
};

/**
 * Ključevi u kojima IZRAZI smeju da rade. Sve van ovog spiska ostaje netaknuto —
 * tu žive potvrde donacija, pokroviteljstva, izvršenja i socijalnih programa.
 */
export const KLJUCEVI = [
  "sistem.clanovi_pregled_blokiran", "sistem.lok_uvod", "sistem.lok_clanova",
  "sistem.donacije_pregled_blokiran",
  "verifikacija.vn_uspeh_opis", "verifikacija.qr_uspeh_naslov",
  "verifikacija.pijaca_verifikovan_opis",
  "graf.zakljucano_opis",
  "krug.osnivanje_info_uslov",
  "profil.pristup_samo_verifikovani",
  "poruke.neverifikovan_info",
  "novcanik.samo_primalac",
  "oNama.faza3_opis", "oNama.k1_tekst",
  "kakoFunkcionisePage.k3_opis", "kakoFunkcionisePage.k4_opis",
  "kakoFunkcionisePage.n1_opis", "kakoFunkcionisePage.n4_opis",
  "osnivackiDoprinosPage.registar_blokiran",
  "pocetna.chat_samo_verif",
  "dobrodosli.ekran2_p2",
  "admin.pokrovitelji_vlasnik_label", "admin.doprinos_zatecene_opis",
  "admin.doprinos_zatecene_confirm", "admin.doprinos_zatecene_gotovo",
  "notifikacije.verifikovan_naslov",
  "greske.inicijator_mora_biti_verifikovan", "greske.mora_biti_verifikovan",
  "greske.nije_verifikovan",
  "greske.pisanje_u_pricaonicu_je_dostupno_samo_verifikovanim_clanovima",
  "greske.samo_verifikovani_korisnici_mogu_podneti_pristupnicu",
  "greske.samo_verifikovani_korisnici_mogu_podneti_zahtev",
  "greske.samo_verifikovani_korisnici_mogu_pokrenuti_pokroviteljstvo",
  "greske.samo_verifikovani_korisnici_mogu_postavljati_oglase",
  "greske.samo_verifikovani_korisnik_moze_da_donira",
  "greske.svi_osnivaci_moraju_biti_verifikovani",
  "greske.vlasnik_mora_biti_verifikovan_clan",
  "greske.dok_nisi_verifikovan_a_mozes_samo_da_primas_poen_upis_u_tudju_evidenciju_otvara_",
  "greske.dok_nisi_verifikovan_a_mozes_da_objavis_samo_ponudu_oglas_kojim_nudis_dobro_ili_",
  "greske.dok_nisi_verifikovan_a_mozes_imati_najvise_3_aktivna_oglasa",
];
