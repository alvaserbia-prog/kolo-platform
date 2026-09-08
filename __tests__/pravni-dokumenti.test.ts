/**
 * Čuvar kanonskog seta akata.
 *
 * Javne pravne stranice učitavaju markdown po IMENU FAJLA, a ime nosi verziju
 * (`Pravilnik_4_4_1.md`, `uslovi_koriscenja_4_4_3.md`). Pri podizanju verzije lako je
 * repointovati jednu stranicu a drugu zaboraviti, ili preimenovati srpski original
 * a ostaviti prevod — loader tada tiho padne na srpski i čitalac na engleskom dobije
 * stari tekst, bez ijedne greške u logu.
 *
 * Ovaj test zato proverava tri stvari:
 *  1. svaki akt koji app traži postoji na SVA tri jezika (sr, en, ru);
 *  2. ključne odredbe seta su stvarno unutra, na svakom jeziku;
 *  3. ukinute odredbe (tabla zahteva za jemstvo) nisu preživele nigde.
 */
import { describe, it, expect } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import { ucitajPravniDokument } from "@/lib/pravni-dokument";

const BAZA = path.join(process.cwd(), "dokumentacija 4.1");
// hr i hu dodati 2026-08-10: prevodi postoje od 4.1.0, ali ih test nije gledao,
// pa su mogli da odlutaju bez ijedne crvene provere — isto kako su i nastali.
const JEZICI = ["sr", "en", "ru", "hr", "hu"] as const;

/** Svi akti koje javne stranice traže — mora se poklapati sa `page.tsx` referencama. */
const AKTI = [
  // Set je od 4.2.2 ponovo JEDINSTVEN: svi akti nose istu verziju, i kad su
  // sadržinski nepromenjeni. Mešovit set (4.2.0 uz 4.1.1) je proizvodio
  // reference na verziju koja kao dokument više ne postoji.
  "Pravilnik_4_4_1.md",
  "dokaz_stvarnosti_4_4_1.md",
  "DPIA_4_4_3.md",
  "radnje_obrade_4_4_2.md",
  "uslovi_koriscenja_4_4_3.md",
  "politika_4_4_2.md",
  "statut_4_1_0.md",
  "whitepaper_4_4_1.md",
  "rizici_4_4_3.md",
  "hijerarhija_4_4_1.md",
  "donacije_4_4_3.md",
  "operativni_4_4_1.md",
  "osnivacki_4_4_1.md",
  "gornje_kolo_4_4_1.md",
  "programi_podrske_4_4_1.md",
  // Usvojen 4.3.0 — do tada nacrt u `docs/pravilnik-modul-deca.md`.
  "ucesce_dece_4_4_2.md",
  // Usvojen 4.4.1 — sedamnaesti akt; osnov u čl. 14a i 51a Pravilnika.
  "projekti_nabavke_4_4_3.md",
];

/**
 * Ključne odredbe seta — po jeziku, da fallback na srpski ne prođe neopaženo.
 *
 * Drže se odredbe uvedene i u 4.1.0 (osmi kanal, oglas neverifikovanog), i u 4.2.0
 * (nadzorni predmet, nadoknada), i u 4.2.2 (doprinos naloga bez potvrde evidentira
 * se kad ga Fondacija odobri): sadržaj starije verzije nije nestao podizanjem broja.
 *
 * 🔴 Provera „kada Fondacija odobri oglas" nasleđuje ulogu ranije provere
 * „Verifikovanom korisniku doprinos": 4.2.0 dokumenta su nastala iz 4.1.0 osnove dok
 * je `main` u međuvremenu izdao 4.1.1, pa bi objava tiho poništila izmenu čl. 40a i
 * niko to ne bi primetio. Sada čuva odobrenje iz 4.2.2 — bez njega bi se akt vratio
 * na stanje u kome doprinos naloga bez potvrde nastaje bez ijedne ljudske odluke.
 */
const UVEDENO: Record<string, Record<string, string[]>> = {
  "Pravilnik_4_4_1.md": {
    sr: [
      "### Član 40a",
      "evidentira se u Protokolu kada Fondacija odobri oglas",
      // 4.3.0 — čl. 14 st. 3 nabraja izuzetke od zabrane negativnog zapisa
      // ISCRPNO. Traži se sva tri, jer je do 4.3.0 akt poznavao samo prvi, a kod
      // radio sa tri; ako iz teksta padne bilo koji, kod opet radi bez osnova.
      "20b Pravilnika o dokazu stvarnosti",
      "Izuzetaka je tri i navedeni su ovde iscrpno",
      "Drugi osnov za negativan zapis ne može se ustanoviti",
      // 4.3.0 — deveti kanal. Kanal koji ne stoji u čl. 15 ne postoji, a kod
      // upisuje POEN po njemu.
      "doprinos dece u dečjem prostoru",
      // 4.2.2 — putanja doprinosa razmeni. Kapa i prag su brojevi koje kod drži
      // u konstantama; ako se u aktu izmene a u kodu ne, ili obrnuto, razilaze se
      // norma i primena — pa se traže doslovno.
      "### Član 40b",
      // 4.4.1 — poništenje zapisa po ISKORIŠĆENJU (čl. 14a) je nov pravni osnov
      // gašenja POEN-a, odvojen od čl. 34 i Glave VIII; bez njega kod gasi POEN
      // pri preuzimanju robe bez ijednog osnova u aktima. Čl. 51a nosi delegaciju
      // na poseban pravilnik — bez nje sedamnaesti akt visi bez osnova.
      "### Član 14a",
      "### Član 51a",
      "ne može preći 5.000 POEN-a po korisniku",
      "najmanje 1.000 POEN-a",
    ],
    en: [
      "### Article 40a",
      "is recorded in the Protocol when the Foundation approves the listing",
      "Article 20b of the Rulebook on Proof of Reality",
      "There are three exceptions, and they are listed here exhaustively",
      "contribution of children in the children's space",
      "### Article 40b",
      "### Article 14a",
      "### Article 51a",
      "may not exceed 5,000 POENs per user",
    ],
    ru: [
      "### Статья 40a",
      "учитывается в Протоколе, когда Фонд одобрит объявление",
      "статьёй 20b Правил о доказательстве реальности",
      "Исключений три, и здесь они перечислены исчерпывающе",
      "вклад детей в детском пространстве",
      "### Статья 40b",
      "### Статья 14a",
      "### Статья 51a",
      "не может превышать 5 000 ПОЕН",
    ],
  },
  "dokaz_stvarnosti_4_4_1.md": {
    sr: ["### Član 11a", "### Član 20b", "### Član 20c"],
    en: ["### Article 11a", "### Article 20b", "### Article 20c"],
    ru: ["### Статья 11a", "### Статья 20b", "### Статья 20c"],
  },
  "radnje_obrade_4_4_2.md": {
    sr: ["Radnja obrade br. 14", "Radnja obrade br. 15", "Radnja obrade br. 16"],
    en: ["Processing activity No. 14", "Processing activity No. 15", "Processing activity No. 16"],
    ru: ["Операция обработки № 14", "Операция обработки № 15", "Операция обработки № 16"],
  },
  // 4.4.3 — ispravljen zbir u zaključku: tabela daje R5 = 4 (nizak), a zaključak ga
  // je vodio među srednjima i izostavljao R13 iz spiska najviših. Brojevi se traže
  // doslovno da se aritmetika procene ne raziđe sa sopstvenom tabelom rizika.
  "DPIA_4_4_3.md": {
    sr: ["R15 —", "## 5.10.", "R17 —", "## 5.12.", "Šest rizika je na srednjem nivou (R1, R2, R8, R11, R13, R16)"],
    en: ["R15 —", "## 5.10.", "R17 —", "## 5.12.", "Six risks are at the medium level (R1, R2, R8, R11, R13, R16)"],
    ru: ["R15 —", "## 5.10.", "R17 —", "## 5.12.", "Шесть рисков находятся на среднем уровне (R1, R2, R8, R11, R13, R16)"],
  },
  // 4.4.1 — izborno glasanje. Čl. 8 i 9 su pisani za dvočlani izbor („za"/„protiv");
  // izbor jedne mogućnosti između više njih nije prosta većina i bez ove odredbe kod
  // sprovodi glasanje koje akt ne poznaje.
  "gornje_kolo_4_4_1.md": {
    sr: ["glasa se izborno"],
    en: ["the vote is selective"],
    ru: ["голосование является выборным"],
  },
  // 4.4.1 — brojevi kolektivne nabavke žive i u kodu kao konstante (koeficijent
  // trošenja, niz 100/50/20, paritet 1:1, rokovi od tri dana). Traže se doslovno da
  // se norma i primena ne raziđu, isto kao kapa i prag iz čl. 40b.
  // 🔴 4.4.3 — paritet je ODVEZAN: broj POEN-a po delu utvrđuje odluka o nabavci i
  // NE izvodi se iz maloprodajne vrednosti dobra. Dok je stajao odnos „jedan prema
  // jedan", sistem je sam objavljivao koliko POEN vredi u dinarima, pa se tabela
  // koeficijenta donacija čitala kao cenovnik. Zato se sada traži suprotno:
  // odsustvo pariteta i prisustvo odredbe da broj nije cena dobra.
  "projekti_nabavke_4_4_3.md": {
    sr: [
      "### Član 27",
      "tri operativna troška Fondacije za prethodni mesec",
      "Koeficijent trošenja iznosi 1,00",
      "utvrđuje ukupnu količinu dobra koje se nabavlja",
      "Broj delova jednak je količniku ukupne količine i veličine dela",
      "utvrđuju se pre prikupljanja ponuda",
      "prelazi gornju granicu iz člana 8, nabavka se ne sprovodi",
      // 🔴 Nabavka je program pomoći sa ključem raspodele, ne prodaja: Fondacija po
      // osnovu poništenja ne prima nikakvu vrednost, a dobra se daju bez naknade.
      // Bez te odredbe se preuzimanje čita kao promet uz naknadu.
      "ne prima nikakvu vrednost",
      "ustupaju bez naknade",
      "nije protivčinidba",
      "navodi potrebu zajednice",
      // 🔴 Korisnik pri preuzimanju NE DAJE ništa — umanjuje se evidencija njegovog
      // ranijeg doprinosa. Uz to obavezno ide brana: raniji doprinos ne daje pravo
      // na dobro, inače se donacija čita kao unapred plaćena kupovina.
      "pri preuzimanju dela ne daje ništa",
      "ne daje pravo na dobro",
      "najmanje 20.000 evidentiranih POEN-a",
      "nije cena dobra",
      "ne mora stajati u srazmeri",
      "najmanje tri ponude",
      "Rok za prijavu iznosi tri dana",
      "Rok za odgovor na poziv iznosi tri dana",
      "Period preuzimanja iznosi tri dana",
    ],
    en: [
      "The spending coefficient is 1.00",
      "establishes the total quantity of the good to be acquired",
      "equals the quotient of the total quantity and the size of a share",
      "established before offers are collected",
      "exceeds the upper limit under Article 8, no procurement is carried out",
      "receives no value whatsoever",
      "free of charge",
      "not consideration for the good provided",
      "states the need of the community",
      "gives nothing when collecting a share",
      "confers no right to a good",
      "at least 20,000 recorded POEN",
      "is not a price of the good",
      "need not stand in proportion",
      "at least three offers",
      "The application period is three days",
      "The collection period is three days",
    ],
    ru: [
      "Коэффициент расходования составляет 1,00",
      "устанавливает общее количество приобретаемого блага",
      "равно частному общего количества и размера доли",
      "устанавливаются до сбора оферт",
      "превышают верхний предел по статье 8, закупка не проводится",
      "не получает никакой ценности",
      "безвозмездно",
      "не является встречным предоставлением за предоставленное благо",
      "указывается потребность сообщества",
      "пользователь ничего не даёт",
      "не даёт права на благо",
      "не менее 20 000 ПОЕН",
      "не является ценой блага",
      "не обязано находиться с ней в соотношении",
      "не менее трёх оферт",
      "Срок подачи заявки составляет три дня",
      "Период получения составляет три дня",
    ],
  },
  // 4.4.3 — zabrana prometa POEN-a i ZRNA van sistema (čl. 21 i 24). Bez nje je
  // nekonvertibilnost samo izjava o nameri: sivo tržište se ne bi moglo ni utvrditi
  // kao povreda ni sankcionisati, a odbrana da POEN nema vrednost van sistema
  // počiva upravo na tome da takav promet nije dopušten.
  "uslovi_koriscenja_4_4_3.md": {
    sr: [
      "Oglas neverifikovanog korisnika",
      "ne smatra se izmenom Uslova",
      "posreduje u prometu POEN-a ili ZRNA",
      "načelu nekonvertibilnosti",
      "ne stiče nivo donacija",
      // 🔴 Orijentacioni odnos 1 POEN ≈ 1 RSD OSTAJE, ali samo kao pomoć korisniku
      // pri postavljanju oglasa. Rečenica da ga Fondacija ne primenjuje ni u jednom
      // svom postupku je ono što ga razlikuje od kursa: bez nje sistem sam objavljuje
      // koliko POEN vredi u dinarima i primenjuje to na sopstvene radnje.
      "ne primenjuje ni u jednom svom postupku",
      "ne izvode se iz dinara",
      // 🔴 Nalog je neprenosiv. Bez ove zabrane se neprenosivost ZRNA (čl. 22
      // Pravilnika) zaobilazi u jednom potezu — proda se ceo nalog sa ZRNOM u njemu.
      "ustupi, iznajmi ili proda pristup svom nalogu",
      "nije prenosiv",
    ],
    en: [
      "Listing by an Unverified User",
      "is not deemed an amendment to the Terms",
      "brokering the transfer of POEN or ZRNO",
      "principle of non-convertibility",
      "acquires no donation tier",
      "does not apply the orientation ratio in any of its own procedures",
      "are not derived from dinars",
      "assigning, renting out, or selling access to their account",
      "is not transferable",
    ],
    ru: [
      "Объявление неверифицированного пользователя",
      "не считается изменением Условий",
      "посредничать в их обороте",
      "принципу неконвертируемости",
      "не получает уровня пожертвований",
      "не применяет ориентировочное соотношение ни в одной своей процедуре",
      "не выводятся из динаров",
      "уступать, сдавать в аренду или продавать доступ",
      "не является передаваемой",
    ],
  },
  // 4.4.3 — obrazloženje koeficijenta evidencije. Tabela nivoa (1,00–2,00) bez
  // obrazloženja čita se kao cenovnik; odredba da se donacijom NIŠTA ne pribavlja
  // je ono što razliku u koeficijentu drži izvan pojma popusta, pa se traži doslovno.
  "donacije_4_4_3.md": {
    sr: [
      "nije cena POEN-a i nije popust na donaciju",
      "Donacijom se ništa ne pribavlja",
      "veću meru priznanja doprinosa",
    ],
    en: [
      "is not a price of POEN and is not a discount on a donation",
      "Nothing is acquired by a donation",
      "greater measure of recognition of the contribution",
    ],
    ru: [
      "не является ценой ПОЕН и не является скидкой",
      "Пожертвованием ничего не приобретается",
      "большую меру признания вклада",
    ],
  },
  // 4.4.3 — upozorenje o pribavljanju POEN-a mimo sistema. Ekonomski deo (ne stiče
  // nivo, ne pomera koeficijent) je ono što zabranu iz Uslova čini samoodrživom.
  "rizici_4_4_3.md": {
    sr: [
      "ne pribavlja od drugih korisnika za novac",
      "ne pomera koeficijent evidencije",
      "a ne protivčinidbu za donaciju",
      // 🔴 ZRNO ne daje pravo na dinarska sredstva Fondacije. Odbrana „iza jedinice
      // nema imovine" je oslabljena kolektivnom nabavkom, u kojoj nosioci ZRNA
      // odlučuju o trošenju dinara — razgraničenje mora biti izričito.
      "nema pravo na dinarska sredstva Fondacije",
      "ne stvaraju imovinsko pravo nijednog nosioca ZRNA",
    ],
    en: [
      "not acquired from other users for money",
      "does not move the recording coefficient",
      "not consideration for the donation",
      "no right to the Foundation's dinar funds",
      "create no property right of any ZRNO Holder",
    ],
    ru: [
      "не приобретается у других пользователей за деньги",
      "не сдвигает коэффициент учёта",
      "а не встречное предоставление за пожертвование",
      "не имеет права на динарные средства Фонда",
      "не создают имущественного права ни одного держателя ЗРНО",
    ],
  },
  // Prihvatanje Politike NIJE pristanak za obrade čiji je osnov pristanak — bez te
  // odredbe bi gejt (zamrzavanje naloga do prihvatanja) obuhvatio i te obrade, pa
  // pristanak ne bi bio slobodno dat.
  // 4.3.4 — sopstvena elektronska adresa maloletnog korisnika (čl. 7a) i ovlašćenje
  // roditelja da postavi novu lozinku (čl. 10). Bez tih odredaba kod prikuplja nov
  // podatak o ličnosti maloletnika bez osnova u aktima, a roditelj menja tuđu
  // lozinku bez ovlašćenja — zato se traže doslovno.
  //
  // 4.3.3 — škola maloletnog korisnika i zatvoren profil. Zatvaranje profila je
  // SUŽAVANJE zatečenog obima: do 4.3.3 je profil maloletnog naloga bio dostupan
  // svakom potvrđenom članu. Ako ta odredba ispadne iz akta, kod nastavi da
  // zatvara profil bez osnova, a pregled po školama ostane bez ijednog pravila o
  // tome šta se sme objaviti — pa se traži doslovno, na sva tri jezika.
  "ucesce_dece_4_4_2.md": {
    sr: [
      "### Član 7a",
      "### Član 15a",
      "### Član 15b",
      "Profil maloletnog korisnika nije dostupan punoletnim korisnicima",
      // Prekidač iz čl. 10 profil NE otvara — da otvara, roditelj bi jednim
      // potezom otključao i ono što nikad nije razmatrao.
      "ne otvara pristup profilu",
      "najviše jednom u trideset dana",
      // Adresa se upisuje TEK po potvrdi sa same adrese — bez toga omaška u
      // kucanju predaje pristup dečjem nalogu nepoznatoj osobi.
      "tek pošto je maloletni korisnik potvrdi",
      "ne šalju obaveštenja",
      // Roditelj menja lozinku bez znanja stare — mora da stoji u aktu.
      "Prethodna lozinka se pri tom ne traži",
      // Mesto na listi ne sme da postane kanal evidentiranja (čl. 15 Pravilnika).
      "ne donosi POEN",
    ],
    en: [
      "### Article 7a",
      "### Article 15a",
      "### Article 15b",
      "profile of a minor user is not available to adult users",
      "does not open access to the profile",
      "once every thirty days",
      "only after the minor user has confirmed it",
      "No notifications",
      "The previous password is not required",
      "carries no POEN",
    ],
    ru: [
      "### Статья 7a",
      "### Статья 15a",
      "### Статья 15b",
      "Профиль несовершеннолетнего пользователя недоступен совершеннолетним пользователям",
      "не открывает доступ к профилю",
      "одного раза в тридцать дней",
      "только после того, как несовершеннолетний пользователь подтвердит его",
      "Уведомления и иная почта на этот адрес не отправляются",
      "Прежний пароль при этом не требуется",
      "не приносит ПОЕН",
    ],
  },
  "politika_4_4_2.md": {
    sr: ["nije pristanak za obrade čiji je pravni osnov pristanak"],
    en: ["is not consent for processing whose legal basis is consent"],
    ru: ["не является согласием на обработку"],
  },
  // 4.3.1 — prag za socijalni program je funkcionalnih 10% (jedna primljena
  // potvrda), ne pun indeks od 100%. Kod prag drži u konstanti
  // FUNKCIONALNI_PRAG_INDEKSA i propušta prijavu na 10%; da akt tiho sklizne
  // nazad na pun indeks, norma i primena bi se razišle bez ijednog traga.
  "programi_podrske_4_4_1.md": {
    sr: ["indeksom stvarnosti od najmanje 10%"],
    en: ["reality index of at least 10%"],
    ru: ["индексом реальности не менее 10 %"],
  },
};

/**
 * Ukinute odredbe — ne smeju da prežive ni u jednom aktu, ni na jednom jeziku.
 *
 * Provera je namerno na KORENU pojma, ne na celoj rečenici: prva verzija ovog
 * testa tražila je tačne fraze i zato je propustila definiciju pojma u čl. 2
 * Uslova („Tabla zahteva za jemstvo — mehanizam Platforme…"). Ko ukida institut,
 * mora da ga ukine i u rečniku pojmova, ne samo tamo gde se primenjuje.
 */
/**
 * Uz ukinutu tablu, ovde stoji i ukinuta TERMINOLOGIJA: od 4.2.2 institut se
 * zove „lanac potvrda", ne „lanac jemstva". Jemstvo je obavezivanje za tuđe
 * buduće ispunjenje, a verifikator tvrdi činjenicu koja u tom trenutku jeste
 * ili nije istinita — što potvrđuje i Glava VIII, koja obara verifikaciju zbog
 * NEISTINITE IZJAVE i nigde ne stavlja verifikatora na tuđe mesto.
 */
const UKINUTO: Record<string, RegExp[]> = {
  sr: [/tabl[aeiou]\s+zahteva\s+za\s+jemstvo/i, /kartic[aeiou]\s+prepoznavanja/i, /lanc[aeu]\s+jemstva/i],
  en: [/guarantee\s+board/i, /recognition\s+card/i, /vouching\s+chain/i],
  ru: [/доск[аеиуой]\s+запросов/i, /карточк[аеиуой]\s+узнавания/i, /цепочк[аеиуой]\s+поручительства/i],
  hr: [/ploč[aeiu]\s+zahtjeva\s+za\s+jamstvo/i, /kartic[aeiou]\s+prepoznavanja/i, /lanc[aeu]\s+jamstva/i],
  hu: [/kezességi\s+kérelmek\s+tábláj/i, /felismerési\s+kártya/i, /kezességi\s+lánc/i],
};

/** Napomene o izmeni namerno pominju ukinutu tablu — one se izuzimaju iz provere. */
function bezNapomenaOIzmeni(tekst: string): string {
  return tekst
    .split("\n")
    .filter(
      (red) =>
        !red.includes("Napomena o izmeni") &&
        !red.includes("Note on the amendment") &&
        !red.includes("Примечание об изменении") &&
        !red.includes("Napomena o izmjeni") &&
        !red.includes("Megjegyzés a módosításról") &&
        !red.startsWith("| **Napomena** |") &&
        !red.startsWith("| **Note** |") &&
        !red.startsWith("| **Примечание** |") &&
        !red.startsWith("| **Napomena** |") &&
        !red.startsWith("| **Megjegyzés** |"),
    )
    .join("\n");
}

describe("kanonski set akata 4.3.3", () => {
  it.each(AKTI)("%s postoji na svim jezicima", async (akt) => {
    for (const jez of JEZICI) {
      const pod = jez === "sr" ? "" : `${jez}/`;
      await expect(
        fs.access(path.join(BAZA, pod + akt)),
        `nedostaje ${pod}${akt}`,
      ).resolves.toBeUndefined();
    }
  });

  it.each(AKTI)("%s se učita i nije prazan", async (akt) => {
    for (const jez of JEZICI) {
      const tekst = await ucitajPravniDokument(akt, jez);
      expect(tekst.length, `${jez}/${akt} je prekratak`).toBeGreaterThan(500);
    }
  });

  it("ključne odredbe seta postoje na svakom jeziku", async () => {
    for (const [akt, poJeziku] of Object.entries(UVEDENO)) {
      for (const jez of JEZICI) {
        const tekst = await ucitajPravniDokument(akt, jez);
        // hr i hu nemaju svoje markere po aktu — za njih se drži postojanje,
        // dužina, terminologija i dve namenske provere ispod. Markeri po odredbi
        // za svih 14 akata × 2 jezika bili bi nagađanje formulacije prevoda.
        for (const odredba of poJeziku[jez] ?? []) {
          expect(tekst, `${jez}/${akt} nema „${odredba}"`).toContain(odredba);
        }
      }
    }
  });

  it("ukinuta tabla zahteva za jemstvo ne postoji ni u jednom aktu", async () => {
    for (const akt of AKTI) {
      for (const jez of JEZICI) {
        const tekst = bezNapomenaOIzmeni(await ucitajPravniDokument(akt, jez));
        for (const obrazac of UKINUTO[jez]) {
          expect(tekst, `${jez}/${akt} još sadrži ${obrazac}`).not.toMatch(obrazac);
        }
      }
    }
  });

  /**
   * 4.2.0 briše reč „trajno" iz čl. 12 dokaza stvarnosti. Nije kozmetika: dok je
   * preuzimanje zone trajno, poništenjem verifikacije bi korisniku ostao zatvoren
   * deo mreže, pa ga niko odatle ne bi mogao ponovo verifikovati — i pravo na
   * povratak iz čl. 20c ne bi radilo. Kod zonu ionako preračunava iz važećih veza.
   */
  it("zabranjena zona se više ne opisuje kao trajna", async () => {
    const TRAJNO: Record<string, RegExp> = {
      sr: /trajno preuzima/i,
      en: /permanently takes/i,
      ru: /навсегда принимает/i,
      hr: /trajno preuzima/i,
      hu: /véglegesen átveszi/i,
    };
    for (const jez of JEZICI) {
      const tekst = await ucitajPravniDokument("dokaz_stvarnosti_4_4_1.md", jez);
      expect(tekst, `${jez} još opisuje zonu kao trajnu`).not.toMatch(TRAJNO[jez]);
    }
  });

  /**
   * Kaskada više ne obara sve verifikacije jednog verifikatora (čl. 19). Ako se ta
   * rečenica vrati u tekst, stvarni ljudi ponovo gube status zbog tuđe radnje.
   */
  it("ne postoji više poništavanje SVIH verifikacija lažnog verifikatora", async () => {
    const STARO: Record<string, RegExp> = {
      sr: /poništavaju se sve verifikacije koje je lažni verifikator obavio/i,
      en: /all verifications performed by the false verifier are annulled/i,
      ru: /аннулируются все верификации, проведённые ложным верификатором/i,
      hr: /poništavaju se sve verifikacije koje je lažni verifikator obavio/i,
      hu: /a hamis hitelesítő által végzett összes hitelesítés érvénytelen/i,
    };
    for (const jez of JEZICI) {
      const tekst = await ucitajPravniDokument("dokaz_stvarnosti_4_4_1.md", jez);
      expect(tekst, `${jez} još obara sve verifikacije verifikatora`).not.toMatch(STARO[jez]);
    }
  });

  /**
   * Prva verzija putanje razmene imala je obostrano označavanje razmene (model
   * `Razmena`, dva klika). Vlasnik ga je uklonio: razmena je upis POEN-a i ništa
   * drugo. Ako se u akte vrati zahtev da korisnici razmenu označe, norma bi
   * tražila mehanizam koji u kodu ne postoji.
   */
  it("razmena se ne označava — akti to izričito kažu", async () => {
    const BEZ_OZNACAVANJA: Record<string, RegExp> = {
      sr: /ne traži od korisnika da razmenu posebno označe/i,
      en: /does not require users to separately mark/i,
      ru: /не требует от пользователей отдельно отмечать/i,
    };
    for (const jez of JEZICI) {
      const tekst = await ucitajPravniDokument("Pravilnik_4_4_1.md", jez);
      expect(tekst, `${jez} nema odredbu o neoznačavanju razmene`).toMatch(BEZ_OZNACAVANJA[jez]);
    }
  });

  it("unakrsne verzijske reference ne pokazuju na stari set", async () => {
    for (const akt of AKTI) {
      for (const jez of JEZICI) {
        const tekst = await ucitajPravniDokument(akt, jez);
        // Statut ima sopstvenu numeraciju (v4.1) i ne prati verziju seta.
        expect(tekst, `${jez}/${akt} upućuje na v4.0.x`).not.toMatch(/\(v(?:erzija |ersion |ерсия )?4\.0\.[01]\)/);
      }
    }
  });
});

/**
 * Hrvatski i mađarski prevod nastaju postupno — akt po akt. Ovaj blok zato
 * proverava SAMO one fajlove koji već postoje, pa nedovršen set ne obara test.
 *
 * Provera na curenje jezika nije teorijska: pri prvom mađarskom aktu se kroz
 * tekst provukla hrvatska reč „Zaklada" umesto „Alapítvány", pet puta. Kad se
 * isti dokument piše na dva bliska zadatka zaredom, takav propust je tih —
 * fajl je i dalje validan markdown i stranica se uredno prikaže.
 */
describe("prevodi u nastajanju (hr, hu)", () => {
  const U_NASTAJANJU = ["hr", "hu"] as const;

  const DISKLEJMER: Record<string, string> = {
    hr: "Neslužbeni prijevod",
    hu: "Nem hivatalos fordítás",
  };

  /** Reči koje u datom jeziku ne smeju da se pojave — znak da je tekst procurio iz drugog. */
  const TUDJE_RECI: Record<string, RegExp[]> = {
    hr: [/\bAlapítvány\b/, /\bfelhasználó/i, /\bhitelesít/i, /\bszabályzat/i],
    hu: [/\bZaklada\b/, /\bkorisnik/i, /\bverifikacij/i, /\bpravilnik/i],
  };

  async function postojeci(jez: string) {
    const nadjeni: string[] = [];
    for (const akt of AKTI) {
      try {
        await fs.access(path.join(BAZA, jez, akt));
        nadjeni.push(akt);
      } catch {
        // Prevod još nije napisan — preskače se.
      }
    }
    return nadjeni;
  }

  it.each(U_NASTAJANJU)("%s: svaki napisan prevod nosi disklejmer o merodavnom originalu", async (jez) => {
    for (const akt of await postojeci(jez)) {
      const tekst = await fs.readFile(path.join(BAZA, jez, akt), "utf-8");
      expect(tekst.slice(0, 400), `${jez}/${akt} nema disklejmer`).toContain(DISKLEJMER[jez]);
    }
  });

  it.each(U_NASTAJANJU)("%s: nijedan prevod ne sadrži reči drugog jezika", async (jez) => {
    for (const akt of await postojeci(jez)) {
      const tekst = await fs.readFile(path.join(BAZA, jez, akt), "utf-8");
      for (const obrazac of TUDJE_RECI[jez]) {
        expect(tekst, `${jez}/${akt} sadrži tuđu reč ${obrazac}`).not.toMatch(obrazac);
      }
    }
  });

  it.each(U_NASTAJANJU)("%s: loader servira prevod kad postoji, inače srpski original", async (jez) => {
    const napisani = await postojeci(jez);
    for (const akt of AKTI) {
      const tekst = await ucitajPravniDokument(akt, jez);
      if (napisani.includes(akt)) {
        expect(tekst, `${jez}/${akt} nije serviran`).toContain(DISKLEJMER[jez]);
      } else {
        expect(tekst, `${jez}/${akt} bez prevoda mora pasti na srpski`).not.toContain(DISKLEJMER[jez]);
        expect(tekst.length).toBeGreaterThan(500);
      }
    }
  });
});
