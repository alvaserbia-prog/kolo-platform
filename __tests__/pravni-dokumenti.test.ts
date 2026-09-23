/**
 * Čuvar kanonskog seta akata.
 *
 * Javne pravne stranice učitavaju markdown po IMENU FAJLA, a ime nosi verziju
 * (`Pravilnik_4_6_6.md`, `uslovi_koriscenja_4_6_6.md`). Pri podizanju verzije lako je
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
  "Pravilnik_4_6_6.md",
  "dokaz_stvarnosti_4_6_5.md",
  "DPIA_4_6_3.md",
  "radnje_obrade_4_6_3.md",
  "uslovi_koriscenja_4_6_6.md",
  "politika_4_6_3.md",
  "statut_4_1_0.md",
  "whitepaper_4_6_2.md",
  "rizici_4_6_0.md",
  "hijerarhija_4_4_6.md",
  "donacije_4_5_8.md",
  "operativni_4_6_0.md",
  "osnivacki_4_6_0.md",
  "gornje_kolo_4_4_6.md",
  "programi_podrske_4_6_1.md",
  // Usvojen 4.3.0 — do tada nacrt u `docs/pravilnik-modul-deca.md`.
  "ucesce_dece_4_6_4.md",
  // Usvojen 4.4.1 — sedamnaesti akt; osnov u čl. 14a i 51a Pravilnika.
  "projekti_nabavke_4_6_0.md",
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
  // 🔴 Whitepaper je dokument koji spoljni čitalac — i regulator — otvara prvi, pa
  // je uz R-04 morao uz Pravilnik. Do 4.6.1 je na dva mesta sam nazivao razliku u
  // koeficijentu PODSTICAJEM, a u odeljku 6.4 tvrdio da upis ZRNA diže koeficijent.
  "whitepaper_4_6_2.md": {
    sr: [
      "Upis i otpis ZRNA takođe ne pomeraju koeficijent",
      "Koeficijent, dakle, nije monoton i nije predodređen da raste",
      "a ne podsticaj za sticanje položaja",
      "Ta mogućnost nije podsticaj",
    ],
    en: [
      "The inscription and write-off of ZRNO likewise do not shift the coefficient",
      "not an incentive to acquire a position",
      "That option is not an incentive",
    ],
    ru: [
      "Запись и списание ЗРНО также не смещают коэффициент",
      "а не стимул к приобретению положения",
      "Эта возможность не является стимулом",
    ],
  },
  "Pravilnik_4_6_6.md": {
    sr: [
      // ═══ 4.6.1 (R-04 — ZRNO kao investicioni instrument, Komisija za HOV) ═══
      // 🔴 Čl. 23 st. 3 je do 4.6.1 tvrdio da „upis i otpis ZRNA pomeraju
      // koeficijent" — ARITMETIČKI NETAČNO. Pri upisu se u istoj srazmeri umanjuju
      // i brojilac (POEN se vraća Protokolu) i imenilac (raspoloživa ZRNA), pa je
      // količnik isti: (T − Z·k)/(R − Z) = k. Neutralnost je nosiv argument — bez
      // nje se koeficijent čita kao cena koju nosilac svojim potezima pomera.
      "Upis i otpis ZRNA ne pomeraju obračunski koeficijent",
      "Koeficijent nije predodređen da raste",
      // 🔴 Čl. 25: odbrana je do 4.6.1 bila ETIKETA („nije prinos", „nije cena") —
      // a etiketa ne pobija nijedan element testa investicionog ugovora. Sada akt
      // nabraja ELEMENTE KOJI NEDOSTAJU, isti obrazac kao čl. 13 uz R-01. Ako ovo
      // padne iz akta, od odbrane ostaje samo nekonvertibilnost.
      "Položaj nosioca ZRNA ne predstavlja ulaganje",
      "ZRNO se ne pribavlja ulaganjem sredstava",
      "ne postoji prinos koji bi se mogao ostvariti",
      "ne postoji napor drugog lica usmeren na stvaranje koristi za nosioca",
      "nosilac ZRNA nije odvojen od upravljanja",
      // ═══ 4.5.9 (R-02 — POEN kao prihod korisnika, Poreska uprava) ═══
      // Odbrana je do 4.5.9 pobijala pojam „naknade", a porez na dohodak oporezuje
      // PRIHODE iz svih izvora, uključujući prihod u naturi. Zato čl. 13 sada nabraja
      // elemente pojma prihoda koji nedostaju — isti obrazac kao odbrana od virtuelne valute.
      "u odnosu na pojam prihoda korisnika",
      // Čl. 36 st. 4 je do 4.5.9 pobijao SAMO radni odnos; opasna kvalifikacija je
      // ugovor o delu, kome subordinacija nije ni potrebna. Operativni čl. 27 je to
      // rešio još u 4.4.4, a glavni Pravilnik ga tek sada sustiže.
      "naročito ne ugovor o delu",
      // 🔴 Čl. 57: „nije socijalna pomoć" je BRISANO (vidi UKINUTO). Umesto poricanja
      // stoji statutarni cilj — bez njega akt sam sebi zatvara izuzeće iz čl. 9 ZPDG.
      "socijalne zaštite i solidarne podrške ranjivim društvenim grupama",
      // 4.5.9 — anonimna donacija ne utvrđuje identitet iz čl. 28 st. 6. Bez toga
      // je akt bio širi od koda: proširena prava bi po slovu akta pripala i
      // donatoru po čijoj donaciji se POEN uopšte ne evidentira.
      "Anonimna donacija identitet u smislu ovog stava ne utvrđuje",
      "identitet utvrđen povodom javne donacije",
      // ═══ 4.5.8 (R-01 — POEN kao virtuelna valuta) ═══
      // 🔴 Mera M-5: bez ovoga čl. 13 tvrdi da se POEN ne može pribaviti kupovinom,
      // a ćuti o tome da se do njega dolazi uplatom u realnom vremenu. Druga
      // rečenica je istinita SAMO uz meru M-4a (ljudska potvrda prijema) — ide
      // zajedno ili nikako.
      "Niko nije dužan da primi POEN",
      "POEN se ne može pribaviti radi izvršenja razmene",
      // 🔴 Mera M-4a: dve odluke su razdvojene — Fondacija utvrđuje ČINJENICU
      // prijema, Protokol bez diskrecije određuje IZNOS. Do 4.5.8 je kartični
      // callback banke upisivao POEN odmah, bez ijedne ljudske odluke između
      // uplate i upisa; to je slika pribavljanja digitalne imovine uz naknadu.
      "Dve odluke u tom postupku su razdvojene",
      "sam izveštaj platnog posrednika o izvršenoj naplati ne pokreće evidentiranje",
      // 🔴 Mera M-8: zabrana prometa POEN-a dobija uporište u PRAVILNIKU, ne samo
      // u Uslovima; uz to je iz čl. 16 st. 5 izbačena zagrada „(uz razmenu ili bez
      // protivusluge)", koja je prepis opisivala kao moguće samostalno davanje.
      "Takvo ažuriranje nije razmena dobara i usluga u smislu ovog člana",
      // 🔴 Odluka B: ZRNO se upisuje iz evidentiranog doprinosa, a glas traži
      // AKTIVIRANO ZRNO korisnika čija je stvarnost potvrđena. Ako iz akta padne,
      // ostaje da se glas u telu koje obavezujuće odlučuje o pravilima Protokola
      // dobija uplatom.
      "ZRNO se upisuje iz evidentiranog doprinosa u zapisu korisnika",
      "ne aktivira, ne otpisuje i ne delegira glas po osnovu njega",
      "nosioci aktiviranog ZRNA čija je stvarnost potvrđena",
      // 🔴 Mera M-9 i njena brana: obim prava identifikovanog člana i izričito da
      // donacija NIJE osnov za potvrdu stvarnosti. Bez brane se donatorski put
      // čita kao kupovina mesta u lancu potvrda.
      "Utvrđen identitet nije potvrda stvarnosti i ne zamenjuje je",
      "Učinjena donacija nije osnov za potvrdu stvarnosti",
      "ne obavezuje nijednog korisnika da potvrdi stvarnost donatora",
      // 🔴 4.5.6 (R-19, M-1) — čl. 13 ne sme ostati na goloj etiketi „nije digitalna
      // imovina". Odbrana koja pobija STATUS NOVCA ne odgovara na prigovor, jer
      // definicija virtuelne valute status novca izričito isključuje; nosivo je
      // nabrajanje elemenata koji NEDOSTAJU. Ako iz akta padne, ostaje nam samo
      // naziv, a to je ono što je R-19 ispravio.
      "ne ispunjava elemente po kojima se određuje digitalna imovina odnosno virtuelna valuta",
      "ne može se pribaviti kupovinom",
      "ne postoji izvan evidencije Protokola",
      "ne služi izmirenju novčanih obaveza",
      "ne pruža platne usluge, ne drži novčana sredstva korisnika i ne izvršava platne transakcije",
      "### Član 40a",
      "evidentira se u Protokolu kada Fondacija odobri oglas",
      // 4.3.0 — čl. 14 st. 3 nabraja izuzetke od zabrane negativnog zapisa
      // ISCRPNO. Traži se sva tri, jer je do 4.3.0 akt poznavao samo prvi, a kod
      // radio sa tri; ako iz teksta padne bilo koji, kod opet radi bez osnova.
      "20b Pravilnika o dokazu stvarnosti",
      "Izuzetaka je šest i navedeni su ovde iscrpno",
      // R-15 — četvrti izuzetak: otpis po poništenju potvrde zbog neaktivnosti
      // (čl. 6 Pravilnika o učešću dece). Bez njega taj otpis nema osnov, jer
      // st. 6 zabranjuje ustanovljavanje drugog osnova bilo kojim drugim aktom.
      "otpis po poništenju potvrde zbog neaktivnosti",
      "teret se ne prenosi na drugo lice",
      // 🔴 R-20 — PETI izuzetak: otpis po prevođenju punoletnog naloga u maloletni.
      // `prevod-u-maloletni.ts` pravi taj minus od 2026-08-23, i na samom nalogu i
      // na licima kojima potvrde padaju, a čl. 14 st. 6 zabranjuje osnov koji ovde
      // nije naveden. Dok je lista brojala četiri, kod je radio protiv akta — to je
      // bila jedina dokazana protivrečnost u setu. Ako tačka padne, vraća se.
      "otpis po prevođenju punoletnog naloga u maloletni",
      "Na negativan zapis po svakom od šest osnova",
      // 🔴 ŠESTI izuzetak: otpis po usklađivanju zatečenih potvrda (čl. 22a dokaza
      // stvarnosti). `potvrde-uskladjivanje.ts` od 17.09.2026. povlači PUN iznos i
      // pušta zapis u minus — kapiranje na nulu je odbačeno jer bi onoga ko je POEN
      // potrošio nagradilo u odnosu na onoga ko ga je sačuvao. Bez ove tačke ta
      // radnja nema osnov, a čl. 14 st. 7 zabranjuje osnov koji ovde nije naveden.
      "otpis po usklađivanju zatečenih potvrda",
      "22a Pravilnika o dokazu stvarnosti",
      // R-18 — ispravka poništenja izvršenog bez osnova (čl. 14a). Uvećava ukupan
      // broj POEN-a VAN kanala iz čl. 15, pa je čl. 14 morao da dobije izričit
      // osnov; bez njega bi poseban pravilnik probijao zatvorenu listu.
      "ispravkom poništenja izvršenog bez osnova",
      "Drugog osnova za uvećanje ukupnog broja POEN-a nema",
      "otklanjanje poništenja izvršenog bez osnova",
      "Ispravka nije povraćaj naknade",
      // R-18 — prigovor na prepis: rok, izjašnjenje druge strane pre odluke i
      // izričito da odlučivanje NIJE posredovanje u razmeni (čl. 16 st. 10).
      "u roku od trideset dana od ažuriranja",
      "ostavlja joj rok od sedam dana da se izjasni",
      "ne predstavlja posredovanje u razmeni",
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
      // 🔴 4.4.6 (R-09) — položaj Gornjeg Kola. Statut poznaje samo Upravni odbor i
      // Direktora, pa telo koje „odlučuje" a Fondacija ga „izvršava" izgleda kao
      // organ koji Statut ne poznaje. Traži se troje: da akt sam kaže da GK nije
      // organ, da odluku sprovodi UO svojim aktom, i da su razlozi za odbijanje
      // zatvorena lista. Ako iz teksta padne bilo šta od toga, vraća se prigovor.
      "ne ubraja se u organe Fondacije utvrđene Statutom",
      "Odluku Gornjeg Kola sprovodi Upravni odbor donošenjem odgovarajućeg akta",
      "Drugi razlozi za odbijanje ne postoje i ne mogu se ustanoviti",
      // Sastav bez imenovanja je ono što telo sa promenljivim brojem članova čini
      // dopuštenim — mora stajati u aktu, ne samo u kodu.
      "Sastav Gornjeg Kola ne utvrđuje se imenovanjem",
    ],
    en: [
      // 4.6.1 (R-04)
      "The inscription and write-off of ZRNO do not shift the accounting coefficient",
      "The position of a ZRNO Holder does not constitute an investment",
      "there is no return that could be realized",
      "bear on the notion of a user's income",
      "in particular not a contract for work",
      "social protection and solidarity support for vulnerable social groups",
      "An anonymous donation does not establish identity within the meaning of this paragraph",
      "No one is obliged to accept POEN",
      "POEN cannot be acquired for the purpose of performing an exchange",
      "Two decisions in that procedure are separate",
      "does not itself trigger recording",
      "is not an exchange of goods and services within the meaning of this Article",
      "ZRNO is inscribed from the contribution recorded in the user's record",
      "does not activate it, does not write it off, and does not delegate a vote on its basis",
      "the holders of activated ZRNO whose reality has been confirmed",
      "An established identity is not a confirmation of reality and does not replace it",
      "A donation made is not a ground for confirming reality",
      "does not oblige any user to confirm the donor's reality",
      "does not meet the elements by which digital assets, that is a virtual currency, are determined",
      "it cannot be acquired by purchase",
      "provides no payment services",
      "### Article 40a",
      "is recorded in the Protocol when the Foundation approves the listing",
      "through the correction of an annulment effected without grounds",
      "There is no further ground for increasing the total number of POENs",
      "the removal of an annulment effected without grounds",
      "The correction is neither a refund of consideration",
      "within thirty days of the record update",
      "allows it seven days to make a statement",
      "does not constitute mediation in the exchange",
      "Article 20b of the Rulebook on Proof of Reality",
      "There are six exceptions, and they are listed here exhaustively",
      "write-off upon the alignment of existing confirmations",
      // R-20 — peti izuzetak (vidi sr).
      "write-off upon the conversion of an adult account into a minor's account",
      "write-off upon annulment of a confirmation due to inactivity",
      "the burden is not transferred to another person",
      "contribution of children in the children's space",
      "### Article 40b",
      "### Article 14a",
      "### Article 51a",
      "may not exceed 5,000 POENs per user",
      "is not among the organs of the Foundation established by the Statute",
      "implemented by the Management Board through the adoption of a corresponding act",
      "No other grounds for refusal exist and none may be established",
      "The composition of the Upper Kolo is not established by appointment",
    ],
    ru: [
      // 4.6.1 (R-04)
      "Запись и списание ЗРНО коэффициент не смещают",
      "Положение держателя ЗРНО не является вложением",
      "не существует дохода, который можно было бы получить",
      "для понятия дохода пользователя",
      "не является договором подряда",
      "социальной защиты и солидарной поддержки уязвимых общественных групп",
      "Анонимное пожертвование личность в смысле настоящего пункта не устанавливает",
      "Никто не обязан принимать ПОЕН",
      "ПОЕН нельзя приобрести ради исполнения обмена",
      "Два решения в этой процедуре разделены",
      "учёт не запускает",
      "не является обменом товаров и услуг в смысле настоящей статьи",
      "ЗРНО вносится из учтённого вклада в записи пользователя",
      "не активирует его, не списывает и не делегирует голос по его основанию",
      "держатели активированного ЗРНО, реальность которых подтверждена",
      "Установленная личность не является подтверждением реальности и его не заменяет",
      "Сделанное пожертвование не является основанием для подтверждения реальности",
      "не обязывает ни одного пользователя подтвердить реальность жертвователя",
      "не отвечает элементам, по которым определяется цифровое имущество",
      "его нельзя приобрести покупкой",
      "не оказывает платёжных услуг",
      "### Статья 40a",
      "учитывается в Протоколе, когда Фонд одобрит объявление",
      "исправлением аннулирования, произведённого без основания",
      "Иного основания для увеличения общего количества ПОЕН нет",
      "устранением аннулирования, произведённого без основания",
      "Исправление не является ни возвратом вознаграждения",
      "в срок тридцати дней со дня обновления учёта",
      "предоставляет ей срок семи дней",
      "не является посредничеством в обмене",
      "статьёй 20b Правил о доказательстве реальности",
      "Исключений шесть, и здесь они перечислены исчерпывающе",
      "списание при согласовании ранее внесённых подтверждений",
      // R-20 — пятое исключение (vidi sr).
      "списание при переводе совершеннолетнего аккаунта в несовершеннолетний",
      "списание при аннулировании подтверждения из-за неактивности",
      "бремя не переносится на другое лицо",
      "вклад детей в детском пространстве",
      "### Статья 40b",
      "### Статья 14a",
      "### Статья 51a",
      "не может превышать 5 000 ПОЕН",
      "не относится к органам Фонда, установленным Уставом",
      "исполняет Правление принятием соответствующего акта",
      "Иных оснований для отказа не существует",
      "Состав Верхнего Коло определяется не назначением",
    ],
  },
  // 4.6.4 — čl. 7: POEN po potvrdi se BELEŽI, a upisuje kad potvrđeni korisnik
  // ostvari prvi potvrđen doprinos. Odredbe se traže doslovno zato što kod bez njih
  // radi nešto što akt ne propisuje — tačno onaj razred kvara koji je R-20 ispravljao
  // (kod je imao više izuzetaka od zabrane negativnog zapisa nego akt).
  //
  // Traži se i da je upis odvojen od PRAVA: indeks i pun pristup nastaju potvrdom i
  // ne čekaju ništa. Bez te rečenice bi se odlaganje POEN-a moglo pročitati kao
  // odlaganje članstva, što nije ni odlučeno ni sprovedeno.
  "dokaz_stvarnosti_4_6_5.md": {
    sr: [
      "### Član 11a", "### Član 20b", "### Član 20c",
      "prvi potvrđen doprinos zajedničkom dobru",
      "ne zavise od upisa POEN-a iz ovog člana",
      "Uslov iz stava 2 primenjuje se i na upis nadzorniku",
      "Fondacija može upisati zabeleženi doprinos i kad uslov iz stava 2 nije ispunjen",
      // 🔴 čl. 22a — usklađivanje zatečenih verifikacija. Bez njega prelazna radnja
      // iz `potvrde-uskladjivanje.ts` nema osnov, a minus koji ona pravi bio bi
      // šesti izuzetak bez odredbe — tačno ono što čl. 14 st. 7 glavnog Pravilnika
      // zabranjuje. Traži se i obrazloženje zašto se NE kapira na nulu.
      "### Član 22a",
      "Otpis se izvršava i kada zapis time postane negativan",
      "Zabeleženi doprinos usklađivanjem se ne gasi",
      "Usklađivanje nije mera prema korisniku",
    ],
    en: [
      "### Article 11a", "### Article 20b", "### Article 20c",
      "first confirmed contribution to the common good",
      "do not depend on the POEN entry under this Article",
      "also applies to the entry made to the supervisor",
      "may enter a noted contribution even where the condition under paragraph 2 is not met",
      "### Article 22a",
      "The write-off is executed even where the record thereby becomes negative",
      "The alignment does not extinguish the recorded contribution",
      "The alignment is not a measure against the user",
    ],
    ru: [
      "### Статья 11a", "### Статья 20b", "### Статья 20c",
      "первый подтверждённый вклад в общее благо",
      "не зависят от внесения ПОЕН по настоящей статье",
      "применяется и к внесению надзорному",
      "может внести отмеченный вклад и тогда, когда условие пункта 2 не выполнено",
      "### Статья 22a",
      "Списание производится и тогда, когда запись при этом становится отрицательной",
      "Согласование не погашает отмеченный вклад",
      "Согласование не является мерой в отношении пользователя",
    ],
  },
  "radnje_obrade_4_6_3.md": {
    sr: ["Radnja obrade br. 14", "Radnja obrade br. 15", "Radnja obrade br. 16", "Radnja obrade br. 17"],
    en: ["Processing activity No. 14", "Processing activity No. 15", "Processing activity No. 16", "Processing activity No. 17"],
    ru: ["Операция обработки № 14", "Операция обработки № 15", "Операция обработки № 16", "Операция обработки № 17"],
  },
  // 4.4.3 — ispravljen zbir u zaključku: tabela daje R5 = 4 (nizak), a zaključak ga
  // je vodio među srednjima i izostavljao R13 iz spiska najviših. Brojevi se traže
  // doslovno da se aritmetika procene ne raziđe sa sopstvenom tabelom rizika.
  // 4.4.8 — procena srazmernosti za obradu po legitimnom interesu. Bez nje R16
  // stoji na meri koja je opisivala nešto što sistem ne radi („nalog bez pristupa
  // funkcijama"), pa je rezidualna ocena od 8 počivala na netačnoj tvrdnji.
  // 4.4.9 — R8 pada na nizak nivo zato što se aplikacija i baza izvršavaju u EU
  // (`vercel.json` → regions: fra1, Neon endpoint u EU). Ako se region ikad vrati u
  // SAD, ocena i mere iz 5.13 postaju netačne — zato se traže doslovno, uz nov zbir
  // srednjih i niskih rizika.
  "DPIA_4_6_3.md": {
    sr: [
      "R15 —", "## 5.10.", "R17 —", "## 5.12.", "## 5.13.",
      "Pet rizika je na srednjem nivou (R1, R2, R11, R13, R16)",
      "Procena srazmernosti za obradu po legitimnom interesu",
      "Sopstveni izlaz maloletnog korisnika",
      "Mere za prekogranični prenos",
      "region Frankfurt",
      "najmanje jednom godišnje",
      // 4.6.1 (R-03, mera M-1) — R11 se vraća u krug verifikatora: pojedinačno
      // evidentiranje po programu izašlo je iz javnog pregleda i opis ne imenuje
      // program, pa verovatnoća pada sa 3 na 2 (ocena 6, i dalje srednji).
      // 🔴 Ocena od 9 (verovatnoća 3), uvedena uz R-13, počivala je upravo na tome
      // što krug primalaca NIJE bio ograničen na verifikatore. Traži se i razlog
      // izostavljanja SAMOG IZNOSA — bez njega bi uklonjen naziv ostavio podatak
      // koji se iz iznosa i dalje čita (godina rođenja, broj i uzrast dece).
      "| 2 | 3 | 6 |",
      "Izostavljanje pojedinačnog zapisa iz javnog pregleda",
      "Saglasnost roditelja za podatak o detetu",
      "## 5.14.",
      // R-06: registar dobija radnju br. 18 (dokaz pristanka), pa ih je osamnaest.
      "osamnaest radnji obrade",
      "Zatvaranje postupka",
    ],
    en: [
      "R15 —", "## 5.10.", "R17 —", "## 5.12.", "## 5.13.",
      "Five risks are at the medium level (R1, R2, R11, R13, R16)",
      "Balancing test for processing on the basis of legitimate interest",
      "The minor user's own way out",
      "Measures for Cross-Border Transfer",
      "Frankfurt region",
      "at least once a year",
      "| 2 | 3 | 6 |",
      "Omission of the individual record from the public overview",
      "Parental consent for data concerning a child",
      "## 5.14.",
      "eighteen processing activities",
      "Closing the procedure",
    ],
    ru: [
      "R15 —", "## 5.10.", "R17 —", "## 5.12.", "## 5.13.",
      "Пять рисков находятся на среднем уровне (R1, R2, R11, R13, R16)",
      "Оценка соразмерности обработки на основании законного интереса",
      "Собственный выход несовершеннолетнего пользователя",
      "Меры для трансграничной передачи",
      "регион Франкфурт",
      "не реже одного раза в год",
      "| 2 | 3 | 6 |",
      "Исключение отдельной записи из публичного обзора",
      "Согласие родителя на данные о ребёнке",
      "## 5.14.",
      "восемнадцать операций обработки",
      "Закрытие процедуры",
    ],
  },
  // 4.4.1 — izborno glasanje. Čl. 8 i 9 su pisani za dvočlani izbor („za"/„protiv");
  // izbor jedne mogućnosti između više njih nije prosta većina i bez ove odredbe kod
  // sprovodi glasanje koje akt ne poznaje.
  // 🔴 4.4.6 (R-09) — statutarni osnov i dinamičan sastav. Bez ovih odredaba akt
  // opisuje telo koje odlučuje umesto organa Fondacije, a to je oblik skupštine —
  // koju fondacija kao bezčlanska forma ne može imati.
  "gornje_kolo_4_4_6.md": {
    sr: [
      "glasa se izborno",
      "na osnovu ovlašćenja Upravnog odbora iz Statuta",
      "Sastav se ne utvrđuje imenovanjem",
      "Akt kojim se odluka sprovodi donosi Upravni odbor",
      "a izmenu donosi Upravni odbor Fondacije",
    ],
    en: [
      "the vote is selective",
      "on the basis of the Management Board's power under the Statute",
      "The composition is not established by appointment",
      "The act implementing the decision is adopted by the Management Board",
      "the amendment is adopted by the Foundation's Management Board",
    ],
    ru: [
      "голосование является выборным",
      "на основании полномочия Правления по Уставу",
      "Состав не определяется назначением",
      "Акт, которым решение исполняется, Правление принимает без промедления",
      "изменение принимает Правление Фонда",
    ],
  },
  // 🔴 4.4.6 (R-09) — čl. 12 st. 4 je do tada prenosio nadležnost za opšte akte na
  // Gornje Kolo, čime je akt obarao sopstveni čl. 8 st. 2 („akt nižeg ranga ne može
  // izmeniti ono što je uređeno aktom višeg ranga"). Jedini takav slučaj u setu.
  "hijerarhija_4_4_6.md": {
    sr: [
      "Izmenu donosi Upravni odbor Fondacije",
      "Opšte akte Fondacije, u smislu Statuta, u svim fazama donosi Upravni odbor",
    ],
    en: [
      "The amendment is adopted by the Foundation's Management Board",
      "are adopted in all phases by the Management Board",
    ],
    ru: [
      "Само изменение принимает Правление Фонда",
      "на всех этапах принимает Правление",
    ],
  },
  // 4.4.1 — brojevi kolektivne nabavke žive i u kodu kao konstante (koeficijent
  // trošenja, niz 100/50/20, paritet 1:1, rokovi od tri dana). Traže se doslovno da
  // se norma i primena ne raziđu, isto kao kapa i prag iz čl. 40b.
  // 🔴 4.4.3 — paritet je ODVEZAN: broj POEN-a po delu utvrđuje odluka o nabavci i
  // NE izvodi se iz maloprodajne vrednosti dobra. Dok je stajao odnos „jedan prema
  // jedan", sistem je sam objavljivao koliko POEN vredi u dinarima, pa se tabela
  // koeficijenta donacija čitala kao cenovnik. Zato se sada traži suprotno:
  // odsustvo pariteta i prisustvo odredbe da broj nije cena dobra.
  "projekti_nabavke_4_6_0.md": {
    sr: [
      // ═══ 4.5.9 (R-02) ═══
      // 🔴 Nosivo za kvalifikaciju davanja: zapis se GASI, ne prelazi Fondaciji, i nije
      // jedinica pribavljena radi preuzimanja nego evidencija ranije učinjenog doprinosa.
      // Bez te dve rečenice se preuzimanje čita kao razmena, a onda pada i odbrana iz
      // čl. 3a (nije privredna delatnost) zajedno sa pitanjem PDV-a.
      "Poništeni zapis ne prelazi Fondaciji",
      "evidencija doprinosa koji je zajedničkom dobru već učinio",
      // Čl. 20 — kalkulacija je do 4.5.9 u ISTOM dokumentu nosila broj POEN-a po delu i
      // ukupan dinarski trošak, pa se odnos POEN:RSD čitao deljenjem. Jedino preostalo
      // mesto na kome je Fondacija sama objavljivala kurs.
      "ne sme se čitati kao njen izraz",
      "Godišnja granica po korisniku",
      // 🔴 Granica se meri sa RAČUNA dobavljača, ne iz POEN-a — inače bi sama bila kurs.
      "granica nije odnos POEN-a prema novcu",
      // 🔴 4.5.8 (R-01, mera P-1) — nabavka traži POTVRĐENU STVARNOST. Bez toga je
      // prag od 20.000 POEN-a dostižan prepisom na svež nepotvrđen nalog, pa se
      // dobra raspodeljuju licu čije postojanje niko nije potvrdio.
      "čija je stvarnost potvrđena kroz lanac potvrda (indeks stvarnosti najmanje 10%)",
      "### Član 27",
      "tri operativna troška Fondacije za prethodni mesec",
      "Koeficijent trošenja iznosi 1,00",
      "utvrđuje ukupnu količinu dobra koje se nabavlja",
      "Broj delova jednak je količniku ukupne količine i veličine dela",
      "utvrđuju se pre prikupljanja ponuda",
      // R-18 — postupanje po prijavljenom nedostatku. Rok, put (prigovor), i
      // izričito da ispravka evidencije NIJE povraćaj naknade — na toj rečenici
      // stoji i odbrana iz čl. 3a i čl. 19 (davanje je besplatno).
      "### Član 30a",
      "u roku od sedam dana od obaveštenja o preuzimanju",
      "Ispravka evidencije nije povraćaj naknade",
      "Ponuda se prihvata isključivo od registrovanog pravnog lica",
      "ne odbija ga kao prethodni porez",
      "ostvaruje prava po osnovu nedostatka dobra u korist korisnika programa",
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
      // 🔴 4.4.7 (R-10) — priroda nabavke. Kad je nabavka redovna a ne izuzetna,
      // jedina odbrana od čitanja „privredna delatnost fondacije" je da se ništa ne
      // prima. Traži se troje: statutarni osnov (čl. 7 t. c Statuta ga imenuje),
      // izričita tvrdnja da nije privredna delatnost, i ZABRANA naplate — jer izjava
      // bez zabrane je isto što je nekonvertibilnost bila pre Uslova čl. 24.
      "### Član 3a",
      "nije privredna delatnost",
      "ne sme primiti naknadu u novcu ni u drugom obliku",
      "člana 7 tačka c) Statuta",
      // Nepreuzet deo ide sledećem u redu i nikad se ne prodaje.
      "nudi se sledećem korisniku u redu",
      "Nepreuzeti delovi se ne prodaju",
    ],
    en: [
      "The annulled record does not pass to the Foundation",
      "the record of a contribution they had already made",
      "must not be read as an expression of it",
      "Annual limit per user",
      "the limit is not a ratio of POEN to money",
      "whose reality has been confirmed through the chain of confirmations (a reality index of at least 10%)",
      "The spending coefficient is 1.00",
      "### Article 30a",
      "within seven days of the notification of collection",
      "The correction of the ledger is neither a refund of consideration",
      "An offer is accepted exclusively from a registered legal entity",
      "is not deducted as input tax",
      "exercises the rights arising from a defect in the goods for the benefit of the users",
      "establishes the total quantity of the good to be acquired",
      "equals the quotient of the total quantity and the size of a share",
      "established before offers are collected",
      "exceeds the upper limit under Article 8, no procurement is carried out",
      "receives no value whatsoever",
      "### Article 3a",
      "is not an economic activity",
      "may not receive consideration for a ceded good",
      "Uncollected shares are not sold",
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
      "Аннулированная запись не переходит Фонду",
      "учёт вклада, который он уже внёс",
      "не должно читаться как её выражение",
      "Годовой предел на одного пользователя",
      "предел не является соотношением ПОЕН к деньгам",
      "реальность которых подтверждена через цепь подтверждений (индекс реальности не менее 10%)",
      "Коэффициент расходования составляет 1,00",
      "### Статья 30a",
      "в срок семи дней со дня уведомления о получении",
      "Исправление учёта не является ни возвратом вознаграждения",
      "Оферта принимается исключительно от зарегистрированного юридического лица",
      "не принимает его к вычету в качестве входящего налога",
      "осуществляет права по основанию недостатка блага в пользу пользователей программы",
      "устанавливает общее количество приобретаемого блага",
      "равно частному общего количества и размера доли",
      "устанавливаются до сбора оферт",
      "превышают верхний предел по статье 8, закупка не проводится",
      "не получает никакой ценности",
      "### Статья 3a",
      "не является хозяйственной деятельностью",
      "не вправе принять встречное предоставление",
      "Неполученные доли не продаются",
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
  "uslovi_koriscenja_4_6_6.md": {
    sr: [
      // ── 4.6.4 — R-07 (nelojalna i obmanjujuća poslovna praksa) ──────────────
      // 🔴 Čl. 22b prvi put odgovara na PRETHODNO pitanje celog rizika: da li je
      // Fondacija uopšte trgovac. Propisi o nepoštenoj poslovnoj praksi obavezuju
      // trgovca; ako Fondacija prema korisnicima ne nastupa na tržištu, ZZP se na
      // nju formalno i ne primenjuje. Do ovog seta taj odgovor nije stajao ni u
      // jednom od sedamnaest akata, pa je podrazumevano čitanje išlo protiv nas.
      // Ista konstrukcija je već izdržala dvaput — nabavke čl. 3a i operativni
      // čl. 27.
      "### Član 22b — Odnos prema propisima o zaštiti potrošača",
      "ne nastupa na tržištu",
      "primenjuju se propisi o zaštiti potrošača",
      "ne utvrđuje u kom svojstvu korisnik nastupa",
      // Čl. 20 — obaveza je IMENOVANA i SMEŠTENA. Do 4.6.4 je postojala samo u
      // FAQ pitanju 837, što nije norma i ništa ne prebacuje.
      "propise o registraciji delatnosti",
      "ispunjenost tih uslova ne proverava",
      // 🔴 Čl. 21 — zabrana se vezuje za RADNJU, ne za oglas. Platforma vidi samo
      // prepis POEN-a i ne zna šta je razmenjeno; da zabrana važi samo za oglas,
      // pogađala bi jedino onoga ko ju je bio nespretan da napiše u oglas. Ovako
      // povreda postoji i kad oglasa nema, pa mere iz čl. 27 i 28 imaju osnov.
      "elektronske cigarete i tečnosti za njih",
      "bez obzira na saglasnost roditelja i bez obzira na to da li je razmena dogovorena putem oglasa",
      "zabranu davanja maloletnim licima i ograničenja oglašavanja",
      // 4.5.9 — javnost donacije VIŠE NIJE „uslov za evidentiranje POEN-a". Ta
      // formulacija je strukturu činila „platiš → dobiješ vidljivost" i pravila
      // pristanak neslobodnim; razlog nosi proverljivost (donacije čl. 5a).
      "Fondacija ga ne postavlja kao uslov pod kojim pristaje da evidentira doprinos",
      "izostanak evidentiranja nije posledica uskraćenog pristanka",
      // 4.5.9 — prošireni obim prava vezan je za JAVNU donaciju. Kod to sprovodi
      // od 13.09.2026 (`javno && uplatilac`), a akt je do tada bio širi od koda.
      "identitet utvrđen povodom javne donacije",
      "Anonimna donacija identitet u ovom smislu ne utvrđuje",
      "Oglas neverifikovanog korisnika",
      // R-18 — prigovor kao jedan institut sa svojim članom. Do 4.5.4 su ga
      // Uslovi pominjali samo uz isključenje, a razmena i nabavka nisu imale
      // nijedan put; bez ovog člana rokovi i kapa po vrsti nemaju osnov.
      "### Član 37a — Prigovor Fondaciji",
      "najviše tri otvorena prigovora po vrsti",
      "sedam dana od obaveštenja o preuzimanju",
      "ne smatra se izmenom Uslova",
      "posreduje u prometu POEN-a ili ZRNA",
      "načelu nekonvertibilnosti",
      "ne stiče nivo donacija",
      // 🔴 4.5.8 (R-01, mera M-7a) — BROJKA 1 POEN ≈ 1 RSD je izbrisana iz akta.
      // Nalaz koji je to pokrenuo: kurs je postojao, bio je objavljen, i držala ga
      // je sama Fondacija u svom tekstu — a to je najjači dokaz protiv tvrdnje da
      // POEN nije virtuelna valuta. Odnos se pri tome NE prećutkuje (mera M-7b je
      // odbijena, jer je prećutan odnos gori od imenovanog): akt priznaje da
      // korisnik pri određivanju iznosa polazi od vrednosti u novcu, ali to je
      // NJEGOVA procena, a Fondacija nijedan takav odnos ne objavljuje.
      "ne objavljuje odnos POEN-a prema dinaru",
      "to je njegova sopstvena procena",
      "nijedan odnos POEN-a prema novcu ne primenjuje ni u jednom svom postupku",
      "ne izvode se iz dinara",
      // R-01, mera M-9 — obim prava člana čiji je identitet utvrđen na donatorskom
      // putu. Bez ovoga kod otvara funkcije koje akt ne poznaje.
      "Utvrđen identitet nije verifikacija i ne zamenjuje je",
      "Donacija nije osnov za verifikaciju",
      // 🔴 Nalog je neprenosiv. Bez ove zabrane se neprenosivost ZRNA (čl. 22
      // Pravilnika) zaobilazi u jednom potezu — proda se ceo nalog sa ZRNOM u njemu.
      "ustupi, iznajmi ili proda pristup svom nalogu",
      "nije prenosiv",
      // 4.6.1 (R-03) — lista donacija se sužava na redovne članove (M-3a),
      // anonimna donacija ulazi samo iznosom (M-3c), a socijalni programi izlaze
      // iz pojedinačnog prikaza evidencije (M-1).
      "Lista donacija dostupna je verifikovanim korisnicima",
      "ulazi u listu isključivo iznosom i datumom",
      "ne prikazuju pojedinačno nego kao dnevni zbir po programu",
    ],
    en: [
      // 4.6.4 — R-07: vidi obrazloženje uz srpske odredbe iznad.
      "### Article 22b — Relation to Consumer Protection Rules",
      "does not act on the market towards users",
      "consumer protection rules apply",
      "does not establish in what capacity a user is acting",
      "rules on business registration",
      "electronic cigarettes and liquids for them",
      "regardless of parental consent",
      "does not set it as a condition on which it agrees to record a contribution",
      "An anonymous donation does not establish identity in this sense",
      "Listing by an Unverified User",
      "### Article 37a — Complaint to the Foundation",
      "A user may have at most three open complaints per type",
      "seven days from the notification of collection",
      "is not deemed an amendment to the Terms",
      "brokering the transfer of POEN or ZRNO",
      "principle of non-convertibility",
      "acquires no donation tier",
      "publishes no ratio of POEN to the dinar",
      "that is their own estimate",
      "applies no ratio of POEN to money in any of its own procedures",
      "are not derived from dinars",
      "An established identity is not verification and does not replace it",
      "A donation is not a ground for verification",
      "assigning, renting out, or selling access to their account",
      "is not transferable",
    ],
    ru: [
      // 4.6.4 — R-07: vidi obrazloženje uz srpske odredbe iznad.
      "### Статья 22b — Отношение к нормам о защите прав потребителей",
      "не выступает на рынке",
      "применяются нормы о защите прав потребителей",
      "не устанавливает, в каком качестве выступает пользователь",
      "нормы о регистрации деятельности",
      "электронные сигареты и жидкости для них",
      "независимо от согласия родителя",
      "не ставит её как условие, при котором соглашается учесть вклад",
      "Анонимное пожертвование личность в этом смысле не устанавливает",
      "Объявление неверифицированного пользователя",
      "### Статья 37a — Возражение Фонду",
      "не более трёх открытых возражений по каждому виду",
      "семь дней со дня уведомления о получении",
      "не считается изменением Условий",
      "посредничать в их обороте",
      "принципу неконвертируемости",
      "не получает уровня пожертвований",
      "не публикует соотношения ПОЕН к динару",
      "это его собственная оценка",
      "не применяет никакого соотношения ПОЕН к деньгам ни в одной своей процедуре",
      "не выводятся из динаров",
      "Установленная личность не является верификацией и её не заменяет",
      "Пожертвование не является основанием для верификации",
      "уступать, сдавать в аренду или продавать доступ",
      "не является передаваемой",
    ],
  },
  // 4.4.3 — obrazloženje koeficijenta evidencije. Tabela nivoa (1,00–2,00) bez
  // obrazloženja čita se kao cenovnik; odredba da se donacijom NIŠTA ne pribavlja
  // je ono što razliku u koeficijentu drži izvan pojma popusta, pa se traži doslovno.
  "donacije_4_5_8.md": {
    sr: [
      // 🔴 4.5.8 (R-01) — donirati sme i član koga niko nije potvrdio (M-9), a
      // evidentiranje NIJE trenutno: pokreće se tek pošto Fondacija utvrdi prijem
      // (M-4a). Bez te rečenice donacija je način da se POEN pribavi na zahtev.
      "Potvrđena stvarnost u lancu potvrda nije uslov za donaciju",
      "Automatizam se odnosi na iznos, ne na pokretanje",
      "Donacija zato nije način da se POEN pribavi u trenutku u kome je potreban",
      // Devizna doznaka: merodavan je iznos ODOBREN na računu, ne poslati iznos.
      "merodavan je dinarski iznos odobren na računu Fondacije",
      "nije cena POEN-a i nije popust na donaciju",
      "Donacijom se ništa ne pribavlja",
      "veću meru priznanja doprinosa",
      // 🔴 Ugovor o donaciji (čl. 5b) je JEDINO mesto na kome bezteretnost izjavljuje
      // i sam donator, a ne samo pravilnik koji piše Fondacija.
      "Fondacija sačinjava ugovor o donaciji i isporučuje ga donatoru kroz Platformu",
      "taj upis nije protivčinidba",
      "naknadnim izmenama ovog pravilnika se ne menja",
      // Nivo je priznanje za delo, ne kupljen status.
      "trajno priznanje za učinjeno delo, a ne stečen status",
      // 4.4.7 (R-10) — petlja donacija → POEN → red za robu vidi se iz OVOG akta,
      // pa brana mora stajati i ovde, ne samo u pravilniku o nabavkama.
      "ne daje pravo na dobra iz kolektivne nabavke",
      // 🔴 Javnost NIJE uslov za evidentiranje POEN-a (to bi bila struktura
      // „plati → dobij vidljivost"); razlog je proverljivost upisa.
      "bila bi upis koji se ne može proveriti",
      // 🔴 Pokroviteljstvo (čl. 6, 7, 10, 11, 13). Roba i usluge su UKINUTE —
      // iznos je kucao korisnik, cenovnik je bio slika bez stavki i primopredaje.
      // Koeficijent je izvod iz čl. 4 (× 1,20), pa se dve lestvice ne mogu razići.
      // Javno imenovanje sme, ali PRAVO na promociju je sponzorstvo.
      "donacija novca pravnog lica ili preduzetnika",
      "uvećanom za dvadeset odsto",
      "Najmanji iznos prijave pokroviteljstva je 10.000 dinara",
      "Tabela se nastavlja bez ograničenja",
      // Obrazloženje razlike od 20% (čl. 10). Bez njega je viši koeficijent
      // za pravno lice gola prednost po pravnoj formi.
      "nije podsticaj za određeni pravni oblik davaoca",
      "u meri u kojoj se po poreskim propisima ne priznaje kao rashod, na nju se plaća porez na dobit",
      "nije raspodela dobiti",
      "ne stiče pravo na objavljivanje logotipa",
      "Javno priznanje je akt Fondacije, a ne protivčinidba",
      // 🔴 4.5.5 (R-19) — uplatilac i donator moraju biti isto lice. Poziv na broj
      // je TRAJAN broj člana, pa bi bez ovoga bilo ko sa bilo kog računa uplatio na
      // tuđi poziv na broj, a sistem zapisao da je član donirao. Uz to: bez gotovine.
      "Fondacija ne prima gotovinu",
      "Doprinos se evidentira isključivo u zapis korisnika čijim je sredstvima uplata izvršena",
      "ne nosi evidentiranje POEN-a",
      // Glava IV — mere su dobrovoljne i to se kaže izričito, da propisivanje ne
      // bude pročitano kao priznanje svojstva obveznika.
      "Fondacija nije obveznik u smislu propisa o sprečavanju pranja novca",
      "ne predstavlja priznanje svojstva obveznika",
      // 🔴 Prag NE ide u akt (isto pravilo kao poreske stope) — utvrđuje ga odluka UO.
      "Prag se ne unosi u ovaj pravilnik",
      // 🔴 Glava IV ne sme da uvede nov osnov poništenja: čl. 14 Pravilnika zatvara
      // listu („po osnovima utvrđenim ovim pravilnikom"), pa bi poseban akt koji ga
      // uvodi oborio zatvorenu listu i tražio bump glavnog Pravilnika.
      "Ovim pravilnikom se nov osnov poništenja ne ustanovljava",
      // Izjava o poreklu se traži SAMO iznad praga (odluka vlasnika).
      "Za donaciju ispod praga ta izjava se ne traži",
    ],
    en: [
      "Reality confirmed in the chain of confirmations is not a condition for donating",
      "The automatism concerns the amount, not the initiation",
      "the dinar amount credited to the Foundation's account is authoritative",
      "is not a price of POEN and is not a discount on a donation",
      "Nothing is acquired by a donation",
      "greater measure of recognition of the contribution",
      "draws up a donation agreement and delivers it to the donor through the Platform",
      "this recording is not a counter-performance",
      "permanent recognition of a deed performed, not an acquired status",
      "recording that cannot be verified",
      "a donation of money by a legal entity",
      "increased by twenty percent",
      "minimum amount of a sponsorship application is 10,000 dinars",
      "The table continues without limit",
      "is neither an incentive for a particular legal form of the giver",
      "not recognised as an expense under tax regulations, tax on profit is payable on it",
      "is not a distribution of profit",
      "no right to the publication of a logo",
      "Public recognition is an act of the Foundation, not a counter-performance",
      "The Foundation does not accept cash",
      "The Foundation is not an obliged entity within the meaning of the regulations",
      "This Rulebook establishes no new ground for annulment",
    ],
    ru: [
      "Подтверждённая в цепи подтверждений реальность не является условием пожертвования",
      "Автоматизм относится к сумме, а не к запуску",
      "определяющей является динарская сумма, зачисленная на счёт Фонда",
      "не является ценой ПОЕН и не является скидкой",
      "Пожертвованием ничего не приобретается",
      "большую меру признания вклада",
      "составляет договор о пожертвовании и вручает его жертвователю через Платформу",
      "этот учёт не является встречным предоставлением",
      "постоянное признание совершённого дела, а не приобретённый статус",
      "записью, которую невозможно проверить",
      "денежное пожертвование юридическим лицом",
      "увеличенному на двадцать процентов",
      "Наименьшая сумма заявки на покровительство — 10 000 динаров",
      "Таблица продолжается без ограничения",
      "не является ни стимулом для определённой правовой формы дарителя",
      "не признаётся расходом, с него уплачивается налог на прибыль",
      "не является распределением прибыли",
      "не приобретает права на публикацию логотипа",
      "Публичное признание является актом Фонда, а не встречным предоставлением",
      "Фонд не принимает наличные",
      "Фонд не является обязанным лицом",
      "Настоящим регламентом новое основание аннулирования не устанавливается",
    ],
  },
  // 4.4.3 — upozorenje o pribavljanju POEN-a mimo sistema. Ekonomski deo (ne stiče
  // nivo, ne pomera koeficijent) je ono što zabranu iz Uslova čini samoodrživom.
  "rizici_4_6_0.md": {
    sr: [
      // 4.5.9 (R-02) — najjača poreska činjenica seli se iz čl. 11a (AML) u čl. 10.
      "ni po jednom osnovu ne isplaćuje novac",
      "ne pribavlja od drugih korisnika za novac",
      "ne pomera koeficijent evidencije",
      "a ne protivčinidbu za donaciju",
      // 🔴 ZRNO ne daje pravo na dinarska sredstva Fondacije. Odbrana „iza jedinice
      // nema imovine" je oslabljena kolektivnom nabavkom, u kojoj nosioci ZRNA
      // odlučuju o trošenju dinara — razgraničenje mora biti izričito.
      "nema pravo na dinarska sredstva Fondacije",
      "ne stvaraju imovinsko pravo nijednog nosioca ZRNA",
      // 4.4.4 — poreski rizik pokriva i operativni doprinos. Bez ovoga prebacivanje
      // rizika iz čl. 10 važi samo za razmenu, a ne i za kanale evidentiranja.
      "operativnog doprinosa i drugih kanala evidentiranja doprinosa",
      "nije naručilac posla ni korisnik činidbe",
      // 🔴 4.5.5 (R-19) — zabrana zloupotrebe i razlog zbog kog sistem za pranje
      // novca ne valja: izlaza u novcu nema ni po jednom osnovu.
      "ne isplaćuje novac",
      "ni u kom obliku ne mogu biti vraćena u novcu",
      "pranja novca, finansiranja terorizma ili prikrivanja porekla sredstava",
      // 4.4.5 — udeo osnivačkog doprinosa je OBJAVLJEN brojem. Do tada ga nijedan
      // akt nije pominjao, a izvodi se iz dva već objavljena broja (2.400.000 i
      // prag od 10.000.000). Ko ga sam izračuna dobija nalaz; ovako je izjava.
      "približno 24%",
      "krug osnivača je zatvoren i ne može se proširiti",
      // 4.4.6 — glas u Gornjem Kolu nije pravo da Fondacija donese određeni akt.
      "ne daje pravo da Fondacija donese određeni akt",
    ],
    en: [
      "pays no money to a user on any basis",
      "not acquired from other users for money",
      "does not move the recording coefficient",
      "not consideration for the donation",
      "no right to the Foundation's dinar funds",
      "create no property right of any ZRNO Holder",
      "operational contribution and other channels for recording contribution",
      "does not confer a right that the Foundation adopt a particular act",
      "neither the party commissioning work nor the beneficiary of a performance",
      "approximately 24%",
      "the circle of founders is closed and cannot be expanded",
    ],
    ru: [
      "ни по одному основанию не выплачивает деньги",
      "не приобретается у других пользователей за деньги",
      "не сдвигает коэффициент учёта",
      "а не встречное предоставление за пожертвование",
      "не имеет права на динарные средства Фонда",
      "не создают имущественного права ни одного держателя ЗРНО",
      "операционного вклада и иных каналов учёта вклада",
      "ни заказчиком работы, ни получателем исполнения",
      "примерно 24%",
      "круг учредителей закрыт и не может быть расширен",
      "не даёт права на принятие Фондом определённого акта",
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
  "ucesce_dece_4_6_4.md": {
    sr: [
      // 🔴 4.6.4 (R-07, mera M-5″) — čl. 12a. Oglas koji postavi dete vidi SAMO
      // druga deca (do 15. godine u celini; iznad toga i punoletni, i to samo uz
      // roditeljsku saglasnost). Publika je dakle pretežno ili isključivo maloletna,
      // a nijedan odrastao je pasivno ne nadgleda. Zabrana mora da vezuje RADNJU,
      // ne oglas: Platforma vidi samo prepis POEN-a i ne zna šta je razmenjeno, pa
      // bi zabrana vezana za oglas pogađala jedino onoga ko ju je napisao u oglas.
      "dobra koja maloletno lice po propisima sme da pribavi",
      "bez obzira na to da li je dogovorena putem oglasa na Platformi ili na drugi način",
      // 4.5.9 (R-02) — kanal iz čl. 15 t. 9 upisuje detetu; priroda upisa mora da stoji.
      "maloletni korisnik ne prima ni novac ni stvar",
      // 🔴 4.5.7 (R-20) — čl. 4d. Prevođenje je do ovog seta postojalo samo u kodu:
      // nalog je izlazio iz lanca potvrda, gubio ZRNO i emitovan POEN, a zapis je
      // išao u minus i njemu i trećim licima — bez ijedne odredbe. Peta tačka
      // čl. 14 st. 3 Pravilnika upućuje baš ovde, pa bez ovog člana upućivanje
      // ostaje prazno i minus opet nema osnov.
      "### Član 4d",
      "Prevođenje je ispravka pogrešno navedenog uzrasta",
      "ne pokreće postupak iz Glave VIII",
      // Prepisan POEN NIJE emisija i detetu ostaje — razlika koju kod pravi
      // merenjem neto emisije, a akt mora da je nosi.
      "prepis nije evidentiranje doprinosa nego promena nosioca zapisa",
      // Minus na obe strane (odluka vlasnika 2026-08-23) + izričito upućivanje na
      // osnov u glavnom Pravilniku.
      "u skladu sa članom 14 stav 3 tačka 5",
      "nadoknada iz člana 20b Pravilnika o dokazu stvarnosti se ne primenjuje",
      // Pogođeno treće lice mora da sazna i da ima put — minus se ne sme pojaviti
      // bez reči, a obrada koja dira status traži ljudski uvid.
      "obaveštava se o otpisu",
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
      // 4.4.8 — razdoblje pre pristanka. Akt je do tada tvrdio da se obrađuju
      // „samo pseudonim i elektronska adresa roditelja", a nalog u tom razdoblju
      // sklapa prijateljstva i ima lozinku. Osnov obrade (legitimni interes) i
      // sopstveni izlaz deteta traže se doslovno: bez osnova obrada u tom
      // razdoblju stoji bez ijednog pravnog naslova, a bez izlaza jedina protivteža
      // legitimnom interesu ostaje u rukama roditelja koji se još nije javio.
      "po osnovu legitimnog interesa",
      "obrađuje se i zapis o tom prijateljstvu sa datumom",
      "može sam obrisati nalog u svakom trenutku",
      // 4.5.2 (R-15) — postupak potvrde postojanja deteta. Do tada se izjašnjavao
      // SAMO potvrđivač, a poništenje je išlo kroz postupak za UTVRĐENU lažnu
      // verifikaciju: tuđi nepokriveni deo padao je na njega kao nadoknada, do
      // 2.500 POEN u minusu, uz zapis koji ga naziva davaocem lažne potvrde.
      // Sve četiri odredbe se traže doslovno; bez njih se kod vraća na staro
      // stanje a da nijedan test ne pukne.
      "izjasne oba člana veze",
      "šezdeset dana",
      "obaveštavaju se sva lica koja bi poništenjem bila pogođena",
      "nadoknada iz člana 20b Pravilnika o dokazu stvarnosti se ne primenjuje",
      "ima pravo prigovora",
      // 4.5.3 (R-17) — uzrasne grupe i granica prema punoletnima. Odredbe se traže
      // doslovno jer ih kod sprovodi na više mesta (poruke, oglasi, prepis), pa bi
      // tiho brisanje iz akta ostavilo kod bez osnova.
      "dve uzrasne grupe",
      "nije navršio petnaest godina sa punoletnim korisnicima ne komunicira i ne razmenjuje",
      "ne razvrstavaju se po uzrastu",
      "### Član 12a",
      "male vrednosti",
      "u granicama svoje poslovne sposobnosti",
      "5.000 POEN",
      "20.000 POEN",
      "u roku od sedam dana",
      "prestaje kada maloletni korisnik upiše i potvrdi sopstvenu elektronsku adresu",
      // 4.6.1 (R-03, mera M-4) — spisak dece jedne škole vidi samo punopravno dete
      // te iste škole; nalog koji čeka roditelja iza sebe nema nikoga.
      "čiji nalog ima stanje aktivnog naloga u smislu člana 4c",
      "maloletnom korisniku druge škole taj pregled se ne prikazuje",
    ],
    en: [
      // 4.6.4 — R-07 mera M-5″ (vidi sr).
      "goods which a minor is permitted by law to acquire",
      "the minor user receives neither money nor goods",
      // R-20 — cl. 4d (vidi sr).
      "### Article 4d",
      "correction of an incorrectly stated age",
      "a re-registration is not a recording of contribution but a change in the holder of the record",
      "in accordance with Article 14, paragraph 3, item 5",
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
      "on the basis of legitimate interest",
      "the record of that friendship with its date is processed as well",
      "may delete the account themselves at any time",
      "both parties to the link make a declaration",
      "sixty days",
      "all persons who would be affected by an annulment are notified",
      "restitution under Article 20b of the Rulebook on Proof of Reality does not apply",
      "the right to an appeal",
      "two age groups",
      "has not reached the age of fifteen neither communicates nor exchanges",
      "are not classified by age",
      "### Article 12a",
      "small value",
      "within the limits of their contractual capacity",
      "5,000 POEN",
      "20,000 POEN",
      "within seven days",
      "ceases once the minor user enters and confirms their own e-mail address",
    ],
    ru: [
      // 4.6.4 — R-07 mera M-5″ (vidi sr).
      "которые несовершеннолетнее лицо по нормам вправе приобрести",
      "несовершеннолетний пользователь не получает ни денег, ни вещи",
      // R-20 — ст. 4d (vidi sr).
      "### Статья 4d",
      "исправлением неверно указанного возраста",
      "переписывание не является учётом вклада",
      "со статьёй 14 пунктом 3 подпунктом 5",
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
      "на основании законного интереса",
      "обрабатывается также запись об этой дружбе с датой",
      "может удалить её сам в любой момент",
      "выскажутся обе стороны связи",
      "шестьдесят дней",
      "уведомляются все лица, которых аннулирование затронуло бы",
      "возмещение по статье 20b Правил о доказательстве реальности не применяется",
      "имеет право на возражение",
      "две возрастные группы",
      "не достигший пятнадцати лет, с совершеннолетними пользователями не общается и не обменивается",
      "по возрасту не разделяются",
      "### Статья 12a",
      "малой стоимости",
      "в пределах своей дееспособности",
      "5.000 ПОЕН",
      "20.000 ПОЕН",
      "в срок семь дней",
      "прекращается, когда несовершеннолетний пользователь укажет и подтвердит собственный электронный адрес",
    ],
  },
  "politika_4_6_3.md": {
    sr: [
      // 4.6.3 (R-06) — dokaz pristanka i dokaz zasnivanja ugovornog odnosa.
      // 🔴 Traži se i ono što se NE beleži: bez te rečenice bi se pri sledećoj
      // izmeni lako dopisao IP „radi jačeg dokaza", a to je proširenje obrade
      // suprotno čl. 3, gde minimizacija stoji kao strukturni princip.
      "### Član 4a — Pristanak i dokaz pristanka",
      "tekst koji je korisniku bio prikazan, na jeziku na kom mu je prikazan",
      "**ne beleže se** IP adresa, podaci o uređaju",
      "beleže se odvojeno, kao dve izjave",
      "ne uspostavlja se nikakav identifikator",
      // 🔴 DPO: opcija C — funkcija se ne određuje, ali se piše ZAŠTO i kada
      // obaveza nastaje. Bez procene bi ukidanje bilo prećutan potez.
      "nije odredila lice za zaštitu podataka",
      "član 56 stav 2 ZZPL-a",
      "nije obezbeđivao nezavisnost koju zahteva član 56 stav 6 ZZPL-a",
      // 4.5.9 — isto što i u Uslovima čl. 17: objavljivanje nije uslov koji
      // Fondacija postavlja, nego posledica proverljivosti upisa.
      "a ne zato što Fondacija objavljivanje postavlja kao uslov",
      "nije pristanak za obrade čiji je pravni osnov pristanak",
      // 4.4.8 — Politika je do tada opisivala razdoblje pre pristanka uže nego
      // što sistem radi („bez pristupa funkcijama", „samo pseudonim i adresa").
      // Traži se osnov obrade u tom razdoblju; bez njega opis ostaje bez naslova.
      "Pravni osnov u razdoblju do preuzimanja",
      "ima profil i može sklapati prijateljstva",
      // 4.4.9 — gde se podaci stvarno nalaze. Do tada je čl. 9 tvrdio da je CELA
      // infrastruktura u SAD, a hosting i baza su u Frankfurtu; uz to je čl. 9
      // OBEĆAVAO adekvatan nivo zaštite kao već postignut. Traži se opis stanja i
      // obaveza godišnje provere, jer se oboje lako izgubi pri sledećem bumpu.
      "region Frankfurt",
      "najmanje jednom godišnje",
      "Telegram Messenger Inc.",
      // 4.6.1 (R-03, mera M-1) — zapis više NE imenuje program i pojedinačno
      // evidentiranje izlazi iz javnog pregleda; umesto njega ide dnevni zbir.
      // 🔴 Traži se i razlog za izostavljanje SAMOG IZNOSA: kod podrške starijima
      // iznos je jednoznačno određen godinom rođenja, pa uklonjen naziv bez
      // uklonjenog iznosa ne bi sakrio ništa. Ranija formulacija („nije skriven",
      // uvedena uz R-13) zabranjena je u bloku UKINUTO.
      "Zapis o evidentiranom POEN-u ne imenuje program",
      "jednoznačno određen godinom rođenja korisnika",
      "dnevni zbir po programu",
      "saglasnost roditelja odnosno zakonskog zastupnika",
      "Izuzeci od prikaza pojedinačnih transakcija",
      // 4.5.1 (R-14) — prestanak statusa. Akt je obećavao brisanje oglasa koje
      // kod nije radio, a zadržane zapise je zvao anonimizovanima i iz toga
      // izvodio da prestaju da budu podaci o ličnosti. Traži se tačna
      // kvalifikacija, osnov ograničenja i izričit spisak onoga što ostaje.
      "pseudonimizacija, a ne anonimizacija",
      "čl. 30 st. 3 ZZPL-a",
      "oglasi se uklanjaju sa prostora za oglašavanje",
      "Poruke u razgovorima između korisnika brišu se kada bar jedna strana ugasi nalog",
      // 4.6.1 (R-03) — posle mere M-1 javan zapis više ne otkriva program, pa
      // jedino preostalo otkrivanje jesu sopstveni verifikatori. Rečenica o
      // alternativi seli se na to mesto; u DPIA 5.6 stoji i dalje.
      "jedino otkrivanje pripadnosti programu koje prijava nosi",
      "podaci koje ste uneli se brišu",
    ],
    en: [
      // 4.6.3 (R-06) — vidi srpski blok iznad.
      "### Article 4a — Consent and proof of consent",
      "are **not** recorded",
      "has not, at this time, appointed a data protection officer",
      "did not ensure the independence required by Art. 56 paragraph 6",
      "and not because the Foundation sets publication as a condition",
      "is not consent for processing whose legal basis is consent",
      "Legal basis in the period before takeover",
      "the account has a profile and may form friendships",
      "Frankfurt region",
      "at least once a year",
      "Telegram Messenger Inc.",
      "The record of POEN recorded does not name the program",
      "uniquely determined by the user's year of birth",
      "a daily total per program",
      "Exceptions to the display of individual transactions",
      "pseudonymization, not anonymization",
      "Art. 30 para. 3 LPDP",
      "the listings are removed from the advertising space",
      "Messages in conversations between users are deleted when at least one party closes their account",
      "the only disclosure of membership in a program that the application entails",
      "deletes the data you entered",
    ],
    ru: [
      // 4.6.3 (R-06) — vidi srpski blok iznad.
      "### Статья 4a — Согласие и доказательство согласия",
      "**не** фиксируются IP-адрес",
      "Фонд не назначил лицо по защите данных",
      "не обеспечивал независимость, которой требует статья 56 часть 6",
      "а не потому, что Фонд ставит публикацию условием",
      "не является согласием на обработку",
      "Правовое основание в период до принятия",
      "имеет профиль и может заключать дружбы",
      "регион Франкфурт",
      "не реже одного раза в год",
      "Telegram Messenger Inc.",
      "Запись об учтённых ПОЕН не называет программу",
      "однозначно определяется годом рождения пользователя",
      "дневная сумма по программе",
      "Исключения из отображения отдельных операций",
      "псевдонимизацией, а не анонимизацией",
      "ч. 3 ст. 30 ЗЗПЛ",
      "объявления снимаются с площадки для размещения",
      "Сообщения в переписках между пользователями удаляются",
      "единственное раскрытие принадлежности к программе, которое влечёт заявка",
      "внесённые Вами данные удаляются",
    ],
  },
  // 4.3.1 — prag za socijalni program je funkcionalnih 10% (jedna primljena
  // potvrda), ne pun indeks od 100%. Kod prag drži u konstanti
  // FUNKCIONALNI_PRAG_INDEKSA i propušta prijavu na 10%; da akt tiho sklizne
  // nazad na pun indeks, norma i primena bi se razišle bez ijednog traga.
  // 4.5.0 (R-13) — pristanak mora da imenuje ono što se zaista dešava. Do tada je
  // akt tvrdio da se verifikatori obaveštavaju „isključivo unutar platforme", a kod
  // je isti tekst slao i mejlom i push-om; pravo na povlačenje pristanka postojalo
  // je u normi a ne u kodu; a zapis o evidentiranom POEN-u sa nazivom programa
  // vidljiv je svim verifikovanim korisnicima, o čemu pristanak nije govorio ništa.
  // Traže se sva tri, jer bi se svako lako izgubilo bez ijednog vidljivog kvara.
  "programi_podrske_4_6_1.md": {
    sr: [
      // 4.5.9 (R-02) — nov čl. 6a. „Nije socijalna pomoć" je brisano iz čl. 2.
      "Priroda evidentiranja",
      "Korisnik programa nije zaposlen kod Fondacije",
      "indeksom stvarnosti od najmanje 10%",
      "koliko će lica biti zamoljeno da potvrdi",
      // 4.6.1 (R-03, mera M-1) — pristanak više ne saopštava javnost zapisa uz
      // pseudonim, nego da se objavljuje samo dnevni zbir po programu.
      "dnevni zbir po programu, bez imena i pseudonima korisnika",
      "Zapis o evidentiranom POEN-u po socijalnom programu ne imenuje program",
      "ne navode se ni naziv programa ni pseudonim podnosioca",
      "podaci uneti u prijavu se brišu",
      "Uneti podaci brišu se kada prijava prestane da važi",
    ],
    en: [
      "Nature of the recording",
      "A program beneficiary is not employed by the Foundation",
      "reality index of at least 10%",
      "how many persons will be asked to confirm",
      "a daily total per programme, without the names or pseudonyms of users",
      "does not name the programme and is not displayed individually",
      "states neither the name of the programme nor the applicant's pseudonym",
      "deletes the data entered in the application",
      "The entered data are deleted when the application ceases to be valid",
    ],
    ru: [
      "Природа учёта",
      "Участник программы не состоит в трудовых отношениях с Фондом",
      "индексом реальности не менее 10 %",
      "сколько лиц будет приглашено подтвердить",
      "дневная сумма по программе, без имён и псевдонимов пользователей",
      "не называет программу и не отображается отдельно",
      "не указываются ни название программы, ни псевдоним заявителя",
      "удаление данных, внесённых в заявку",
      "Внесённые данные удаляются, когда заявка перестаёт действовать",
    ],
  },
  // 4.4.4 — pravna priroda operativnog doprinosa (čl. 27). Do tada je akt branio
  // SAMO od radnog odnosa (čl. 5 Zakona o radu), a opasna kvalifikacija je ugovor
  // o delu, kome subordinacija i lična obaveza rada nisu ni potrebne. Nosivo je
  // odsustvo NARUČIOCA i naknade: zadatak se objavljuje povodom potrebe
  // zajedničkog dobra, zajednica nije pravno lice i ne može biti strana ugovora,
  // a Fondacija ne naručuje i ne prima ništa. Rezultat ide u zajedničko dobro pod
  // licencama iz Glave II — to je ono što obara protivprimer „rad na
  // infrastrukturi Fondacije".
  // 4.4.5 — osnov gornje granice (čl. 5) i ispravka tvrdnje o opadanju (čl. 8).
  // 🔴 Do 4.4.5 je akt kao jedinu odbranu nudio tvrdnju da uticaj opada — tačnu za
  // JEDAN korak, ali ne i za zbirni udeo, koji stoji na ~19–24% i blago RASTE.
  // Test čuva i obrazloženje granice: bez njega je najveća alokacija u sistemu
  // jedini krupan parametar bez ijedne rečenice razloga.
  "osnivacki_4_6_0.md": {
    sr: [
      // 4.5.9 (R-02) — jedini kanal koji sam sebe u aktu naziva „radom".
      "nije rad naručen od Fondacije",
      "Granica je mera doprinosa koji je prethodio sistemu",
      "uložili sopstvena novčana sredstva i sopstveno vreme",
      // Aritmetički razlog: dnevni limit operativnog kanala je 10% opticaja, pa je
      // pri opticaju nula i limit nula. To je najjači deo obrazloženja.
      "dok je taj broj nula, limit je takođe nula",
      "je druga veličina i ona ne opada",
      "približno 24%",
      "kakav god da je njegov tempo",
      // Rezultat osnivačkog rada je poklonjen svima — odgovor na „alokacija osnivačima".
      "ulazi u zajedničko dobro pod licencama",
    ],
    en: [
      "is not work commissioned by the Foundation",
      "The limit is a measure of the contribution that preceded the system",
      "invested their own monetary resources and their own time",
      "while that number is zero, the limit is likewise zero",
      "is a different quantity, and it does not decrease",
      "approximately 24%",
      "whatever its pace may be",
      "enters the common good under the licences",
    ],
    ru: [
      "не является работой, заказанной Фондом",
      "Предел является мерой вклада, предшествовавшего системе",
      "вложили в проектирование, создание и юридическую и организационную подготовку системы собственные денежные средства",
      "пока это число равно нулю, лимит также равен нулю",
      "иная величина, и она не убывает",
      "примерно 24%",
      "каким бы ни был его темп",
      "поступает в общее благо под лицензиями",
    ],
  },
  "operativni_4_6_0.md": {
    sr: [
      // 4.5.9 (R-02) — „nije naknada" je pobijalo pogrešan pojam; sada i elementi prihoda.
      "ne utvrđuje nijedan iznos izražen u novcu",
      "nema naručioca",
      "nije pravno lice, nema organe i ne može biti strana ugovora",
      "Fondacija nije naručilac dela i nije korisnik činidbe izvršioca",
      "niti predstavlja rad van radnog odnosa",
      "Rezultat operativnog doprinosa ulazi u zajedničko dobro",
      "Broj POEN-a nije cena rada",
      // Predloženi POEN se ne sme izraziti kao satnica — kod je model satnice
      // (`hourlyRate`/`hoursWorked`) uklonio, a akt je do 4.4.4 dozvoljavao da se
      // vrati odlukom UO kroz „vremenski ekvivalent".
      "ne izražava se kao vrednost jedinice vremena rada",
    ],
    en: [
      "determines no amount expressed in money",
      "there is no commissioning party",
      "is not a legal person, has no bodies, and cannot be a party to a contract",
      "The Foundation is not the party ordering a work",
      "nor does it constitute work outside an employment relationship",
      "The result of an operational contribution enters the common good",
      "The number of POEN is not a price of work",
      "is not expressed as a value per unit of working time",
    ],
    ru: [
      "не определяет никакой суммы, выраженной в деньгах",
      "отсутствует заказчик",
      "не является юридическим лицом, не имеет органов и не может быть стороной договора",
      "Фонд не является заказчиком работы",
      "не представляет собой работу вне трудовых отношений",
      "Результат операционного вклада поступает в общее благо",
      "Число ПОЕН не является ценой труда",
      "не выражается как величина за единицу рабочего времени",
    ],
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
  // 🔴 R-02: „nije socijalna pomoć" je uklonjeno iz Pravilnika čl. 57 i programa
  // podrške čl. 2. Ta rečenica je sama zatvarala izuzeće iz čl. 9 ZPDG (organizovana
  // socijalna i humanitarna pomoć) i protivrečila čl. 6 Statuta, koji socijalnu
  // zaštitu upisuje kao cilj Fondacije. „Nije naknada" OSTAJE i ne dira se.
  // 🔴 Zaostatak uz R-01: „uslov za evidentiranje POEN-a" — javnost donacije nije
  // uslov nego proverljivost; uslovljen pristanak po ZZPL-u nije slobodan pristanak.
  // 🔴 R-03 (mera M-1): „zapis nije skriven" je BRISANO. Ta rečenica je javnost
  // naziva socijalnog programa uz pseudonim opisivala kao meru proverljivosti, a
  // naziv je posebna kategorija po ZZPL čl. 17. Vraćena, obarala bi i meru M-1 i
  // ocenu R11 u DPIA, i to bez ijednog vidljivog kvara.
  sr: [/tabl[aeiou]\s+zahteva\s+za\s+jemstvo/i, /kartic[aeiou]\s+prepoznavanja/i, /lanc[aeu]\s+jemstva/i, /vremensk[aeiou]+\s+ekvivalent/i, /izvršna,?\s+ne\s+upravljačka/i, /nije\s+socijalna\s+pomoć/i, /uslov\s+za\s+evidentiranje\s+POEN/i, /zapis\s+o\s+evidentiranom\s+POEN-u\s+nije\s+skriven/i, /Po\s+evidentiranju\s+verifikacionog\s+zapisa,?\s+Protokol\s+automatski\s+upisuje/i],
  en: [/guarantee\s+board/i, /recognition\s+card/i, /vouching\s+chain/i, /time\s+equivalents?/i, /executive,?\s+not\s+governance/i, /is\s+not\s+social\s+assistance/i, /condition\s+for\s+the\s+recording\s+of\s+POEN/i, /record\s+of\s+POEN\s+recorded\s+is\s+not\s+hidden/i, /[Uu]pon\s+the\s+recording\s+of\s+a\s+verification\s+record,?\s+the\s+Protocol\s+automatically\s+enters/i],
  ru: [/доск[аеиуой]\s+запросов/i, /карточк[аеиуой]\s+узнавания/i, /цепочк[аеиуой]\s+поручительства/i, /временн[оы]́?й\s+эквивалент/i, /исполнительной,?\s+а\s+не\s+управленческой/i, /не\s+является\s+социальной\s+помощью/i, /услови[ем]\s+учёта\s+ПОЕН/i, /Запись\s+об\s+учтённых\s+ПОЕН\s+не\s+скрыта/i, /По\s+учёту\s+верификационной\s+записи\s+Протокол\s+автоматически\s+вносит/i],
  hr: [/ploč[aeiu]\s+zahtjeva\s+za\s+jamstvo/i, /kartic[aeiou]\s+prepoznavanja/i, /lanc[aeu]\s+jamstva/i, /vremensk[aeiou]+\s+ekvivalent/i, /izvršna,?\s+a\s+ne\s+upravljačka/i, /nije\s+socijalna\s+pomoć/i, /uvjet\s+za\s+evidentiranje\s+POEN/i, /zapis\s+o\s+evidentiranom\s+POEN-u\s+nije\s+skriven/i, /Po\s+evidentiranju\s+verifikacijskog\s+zapisa\s+Protokol\s+automatski\s+upisuje/i],
  hu: [/kezességi\s+kérelmek\s+tábláj/i, /felismerési\s+kártya/i, /kezességi\s+lánc/i, /időbeli\s+egyenérték/i, /végrehajtói,?\s+nem\s+irányítói/i, /nem\s+szociális\s+segély/i, /feltétele\s+a\s+POEN/i, /POEN\s+bejegyzése\s+nem\s+rejtett/i, /A\s+hitelesítési\s+bejegyzés\s+rögzítésével\s+a\s+Protokoll\s+automatikusan/i],
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
      const tekst = await ucitajPravniDokument("dokaz_stvarnosti_4_6_5.md", jez);
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
      const tekst = await ucitajPravniDokument("dokaz_stvarnosti_4_6_5.md", jez);
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
      const tekst = await ucitajPravniDokument("Pravilnik_4_6_6.md", jez);
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

/**
 * 🔴 Region izvršavanja je MERA ZAŠTITE, ne podešavanje performansi.
 *
 * Politika čl. 9, DPIA (ocena R8 = 3 i tačka 5.13) i svaki red „Prenos u treću
 * zemlju" u Registru radnji obrade počivaju na tome da se aplikacija izvršava u
 * Evropskoj uniji. Ko obriše ili promeni `regions` u `vercel.json`, oborio je
 * tačnost tri akta odjednom — i to bez ijednog traga, jer sajt nastavlja da radi.
 *
 * Region Neon baze se ovako ne može proveriti (živi u `DATABASE_URL`, koji je
 * tajna okruženja); on je zabeležen u `docs/obradjivaci-i-prenos.md`.
 */
describe("region izvršavanja", () => {
  it("vercel.json drži izvršavanje u EU (fra1)", async () => {
    const sirovo = await fs.readFile(path.join(process.cwd(), "vercel.json"), "utf-8");
    const config = JSON.parse(sirovo) as { regions?: string[] };
    expect(config.regions, "vercel.json nema `regions` — akti tvrde da je izvršavanje u EU").toBeDefined();
    expect(config.regions).toContain("fra1");
  });
});

/**
 * 🔴 Fallback na srpski original SME da postoji, ali NE SME da bude nem.
 *
 * `ucitajPravniDokument` pri nedostajućem prevodu vraća srpski original — pad bi
 * značio 500 na javnoj pravnoj stranici, što je za čitaoca gore. Ali do 2026-09-13
 * je taj fallback bio potpuno bez traga: čitalac na engleskom dobije srpski tekst
 * bez ijedne reči o tome. Upravo tako su hrvatski i mađarski posetioci mesecima
 * dobijali srpske akte, a polovičan bump (sr na novoj šifri, prevod na staroj) daje
 * isti ishod.
 *
 * Ovo je DRUGA brana, uz `fs.access` proveru postojanja iznad: ta traži da se
 * polovičan bump uopšte ne desi, ova da se vidi ako se desi.
 */
describe("fallback kad prevod akta nedostaje", () => {
  const PROBNI = "PROBA_bez_prevoda_0_0_0.md";
  const TELO = "# Probni akt\n\nOvo je probni srpski original.\n";

  /** Zvaničan disklejmer prevoda — po njemu se serviran prevod razlikuje od fallbacka. */
  const DISKLEJMER: Record<string, string> = {
    hr: "Neslužbeni prijevod",
    hu: "Nem hivatalos fordítás",
  };

  /** Napomena mora da bude na jeziku čitaoca — srpska rečenica ne bi rešila ništa. */
  const OCEKIVANO: Record<string, RegExp> = {
    en: /Translation not yet published/,
    ru: /Перевод ещё не опубликован/,
    hr: /Prijevod još nije objavljen/,
    hu: /A fordítás még nem jelent meg/,
  };

  it.each(Object.keys(OCEKIVANO))("%s: nedostajući prevod nosi napomenu, a original ostaje ispod", async (jez) => {
    await fs.writeFile(path.join(BAZA, PROBNI), TELO);
    try {
      const tekst = await ucitajPravniDokument(PROBNI, jez);
      expect(tekst, `${jez}: fallback je nem`).toMatch(OCEKIVANO[jez]);
      expect(tekst, `${jez}: original je izgubljen`).toContain("Ovo je probni srpski original.");
      // Napomena ne sme da liči na zvaničan disklejmer prevoda — inače bi provera
      // „loader servira prevod kad postoji" iznad počela da laže.
      if (DISKLEJMER[jez]) expect(tekst).not.toContain(DISKLEJMER[jez]);
    } finally {
      await fs.unlink(path.join(BAZA, PROBNI));
    }
  });

  it("srpski original se servira bez napomene", async () => {
    await fs.writeFile(path.join(BAZA, PROBNI), TELO);
    try {
      expect(await ucitajPravniDokument(PROBNI, "sr")).toBe(TELO);
    } finally {
      await fs.unlink(path.join(BAZA, PROBNI));
    }
  });
});
