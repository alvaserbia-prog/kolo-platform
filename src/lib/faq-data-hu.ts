import type { FaqSekcija } from "./faq-data";

/**
 * Magyar GYIK-fordítás.
 *
 * A szóhasználat a messages/hu.json-ban már meghonosodott alakokat követi:
 * POEN, ZRNO, Protokoll, Alapítvány, Kör, Felső Kolo, Piac,
 * megerősítés, valóságindex, patrónus, Igazgatóság.
 *
 * ⚠️ A szakaszok és kérdések `id` értékeinek EGYEZNIÜK KELL a szerb eredetivel
 * (faq-data.ts) — ezekre épül a `getFaqPoBrojevima`, amely egyes kérdéseket más
 * oldalakra emel be.
 */
export const FAQ_SEKCIJE_HU: FaqSekcija[] = [
  {
    id: "pocetnici",
    naslov: "Kezdőknek",
    pitanja: [
      {
        id: 42,
        pitanje: `Senkit nem ismerek a KOLO-ban — megerősíthet-e engem bárki?`,
        odgovor: `Igen. A valóság megerősítése azon alapul, hogy valaki személyesen megismer téged — és ez az ismeretség még csak most fog kialakulni.

A belépéshez nem kell megerősítés. A regisztráció ingyenes. Azonnal elolvashatod a szabályokat, megnézheted a rendszer nyilvános áttekintését és a Piac kínálatát, és feladhatsz legfeljebb három hirdetést, amellyel kínálsz valamit (a hirdetést bármikor leveheted).

Az ismeretség a cseréből születik. Adj fel egy hirdetést, és várd meg, hogy valaki jelentkezzen. Amikor a cserét személyesen lebonyolítjátok, az a személy valóban megismert téged — és ha rendes tag, megadhatja neked a valóság megerősítését. A legtöbb ember így jut valóságigazoláshoz.

Megerősítést csak az adhat, akinek magának is van valóságigazolása, és mindig személyes találkozó után — soha nem a platformon küldött üzenet alapján.

Ha senkit nem ismersz, a legrövidebb út, ha írsz nekünk a kontakt@ekolo.rs címre, vagy eljössz egy helyi találkozóra. Az ismeretséget nem előre kérjük — az menet közben jön létre.`,
      },
      {
        id: 43,
        pitanje: `Tényleg ingyenes — be kell fizetnem vagy adományoznom valamit?`,
        odgovor: `Igen. A KOLO használata ingyenes, és nincsenek fizetős funkciók. A regisztráció semmibe sem kerül: választasz egy álnevet, megadsz egy e-mail-címet és egy jelszót.

Nincs előfizetés, nincs jutalék, és nincs külön megvásárolható csomag. A teljes hozzáférést nem befizetés nyitja meg, hanem a valóság megerősítése — azt pedig ember adja, nem pénz.

Az adomány önkéntes, és semminek sem feltétele. Vele az Alapítvány költségeit fedezed: a szervert, az eszközöket, a fejlesztést, a jogi és könyvelési szolgáltatásokat.

Az adomány és a POEN két külön aktus. Az adomány egyoldalú és visszavonhatatlan — nem vásárolsz vele semmit. Ettől függetlenül a Protokoll a rendszer szabályai szerint POEN-t rögzít a nyilvántartásodban. A POEN-nek a rendszeren kívül nincs értéke, nem adható tovább és nem váltható vissza pénzre.

POEN egyetlen dinár nélkül is rögzül neked — megerősítéssel és valóságigazolással, működési hozzájárulással és cserével, amelyben egy másik tag POEN-t ír át neked. A döntésekben pedig pénzért szavazatot sem lehet venni: a szavazatot a ZRNO hordozza, nem a POEN.`,
      },
      {
        id: 44,
        pitanje: `Mi az első lépésem, és hogyan gyűjtök POEN-t utána?`,
        odgovor: `Az első lépés a valóság megerősítése. Valaki, aki személyesen ismer téged és magának is van valóságigazolása, megerősíti, hogy valódi ember vagy — ennek az ismeretségnek az alapján, egyetlen dokumentum nélkül. A Protokoll ekkor 1.000-1.000 POEN-t rögzít neked is, neki is, egyszeri alkalommal és mindkettőtöknek azonos összegben.

Addig sem zárul el előled semmi lényeges: az első hirdetés, amellyel kínálsz valamit, már hoz neked POEN-t.

Amikor megszerzed a valóságigazolást, négy út nyílik meg előtted.

Csere. Nem kell semmit eladnod. A csere a szolgáltatásokra és a tudásra is kiterjed — segíthetsz valakinek egy munkában, taníthatod, vigyázhatsz a gyerekére. A másik fél ekkor POEN-t ír át neked azért, amit tettél.

Mások megerősítése. Amikor megerősítesz valakit, akit valóban ismersz, 1.000-1.000 POEN rögzül neked is, neki is — személyenként egyszer. A megerősítéssel azt vállalod, hogy ez a személy létezik, és nincs másik fiókja, ezért megerősítést csak olyan emberekre adj, akiket tényleg ismersz.

Működési hozzájárulás. Munka a közös jóért, közzétett feladat alapján. A feladatokat a kezdeti szakaszban az Alapítvány tűzi ki, aktiválás után pedig a ZRNO-tartók és a Felső Kolo. Amikor teljesíted a feladatot, és egy ZRNO-tartó megerősíti a teljesítést, POEN rögzül neked.

Szociális programok. Ha a programok által lefedett csoportok valamelyikébe tartozol — anyák és más elsődleges gondviselők, idősek, különleges gondoskodás, tanulás —, kérelmet nyújtasz be. Miután az Alapítvány jóváhagyja, a Protokoll napi szinten rögzít neked POEN-t, az egyes tevékenységek bejelentése nélkül.`,
      },
      {
        id: 45,
        pitanje: `Mennyi időmet veszi el — állandóan aktívnak kell lennem?`,
        odgovor: `Nem kell. Nincs olyan minimum belépés, hozzájárulás vagy csere, amelyet teljesítened kellene ahhoz, hogy tag maradj.

Annyit és akkor kapcsolódsz be, amennyit és amikor szeretnél. A működési hozzájárulás, a Piacon folytatott csere és a ZRNO-bejegyzés lehetőségek, nem kötelezettségek. Nincs minimális tagsági idő és nincs felmondási idő.

Ha szünetet tartasz, a nyilvántartásod megvár. A POEN-ed nem jár le — a nyilvántartásodban marad, amíg át nem írod másnak, vagy amíg be nem zárod a fiókodat. A POEN lejárati idejének bevezetése a rendszer lényegi módosítása lenne, amelyről a Felső Kolo döntene, nem az Alapítvány önmagában.

A rendszerből bármelyik pillanatban kilépsz, a profilbeállításokból.`,
      },
      {
        id: 46,
        pitanje: `Mi az az álnév — fel kell fednem a valódi nevemet vagy be kell küldenem a személyi igazolványomat?`,
        odgovor: `Az álnév olyan név, amelyet magad választasz, és amely alatt látható vagy a rendszerben és a hozzájárulások nyilvános nyilvántartásában. Ez a nyilvános neved a KOLO-ban, és semmi köze nem kell hogy legyen a valódi nevedhez.

A valódi név nem kötelező. A regisztrációnál csak álnevet, e-mail-címet és jelszót kérünk. Nem kérünk személyi azonosító számot, személyi igazolványt, útlevelet vagy bármilyen más dokumentumot, és soha nem kérjük, hogy magadról vagy az irataidról fényképet küldj.

A megerősítés sem kér dokumentumot. A valódiságodat olyan tag erősíti meg, aki személyesen ismer téged, és magának is van valóságigazolása. A megerősítés az ismeretségen nyugszik, nem a papíron.

A profilod nem viseli a nevedet. Az Alapítvány nem vezet olyan nyilvántartást, amely az álnevet a személyi igazolványban szereplő névhez kötné, a többi tag pedig csak azt látja, amit magad választottál megmutatni. A nevedet és a telefonszámodat később, önkéntesen megadhatod — akkor csak a rendes tagok látják, és ezt a közzétételt bármikor visszavonhatod.

Hol kerül mégis szóba a személyazonosság. Ha bankon keresztül adományozol, a neved ott áll a kivonaton. Ha szociális programra vagy patronálásra jelentkezel, a kérelem adatait az Alapítvány tekinti át. Ezek az adatok nem nyilvánosak, nem jelennek meg a profilod mellett, és csak az látja őket, aki a kérelmet feldolgozza.

Megjegyzés: olyan álnevet válassz, amely nem tartalmazza a személyes adataidat. Kis közösségben az álnév, a helység és a tevékenység együttese közvetve rámutathat arra, ki vagy — légy ennek tudatában.`,
      },
      {
        id: 76,
        pitanje: `Hogyan ismerem fel a csalást — mit nem fog tőlem a KOLO soha kérni?`,
        odgovor: `Ha valaki bármit kér ebből a listából, az nem az Alapítvány — az valaki, aki az Alapítványnak adja ki magát.

Soha nem kérünk pénzt a hozzáférésért. A regisztráció és a használat ingyenes. Az adomány és a patronálás önkéntes, és kizárólag az ekolo.rs hivatalos csatornáin keresztül fizethető be — soha nem magánszámlára, és soha nem olyan üzenet alapján, amely sürget téged.

Soha nem kérjük a jelszavadat, a PIN-kódodat vagy a bankkártyád számát. Az Alapítványtól senki nem fog jelszót vagy üzenetből származó kódot kérni tőled. A jelszavadat csak az ekolo.rs oldalon add meg — soha ne olyan oldalon, ahová üzenetben vagy e-mailben kapott hivatkozásról jutottál.

Sem a regisztrációhoz, sem a megerősítéshez nem kérünk dokumentumot. Sem személyi azonosító számot, sem személyi igazolványról vagy útlevélről készült fényképet. A valóság megerősítése személyes ismeretségen nyugszik.

A POEN nem váltható készpénzre. Nem cserélhető dinárra, nem adható tovább, és az Alapítvány nem vásárolja vissza. Minden ajánlat, amely keresetet, pénzvisszatérítést vagy a POEN dinárra váltását ígéri, csalási kísérlet — bárki küldte is neked.

A Piacon csak akkor írd át a POEN-t, ha már megkaptad az árut vagy a szolgáltatást. Ha valaki sürget, hogy előre írd át, állj el a cserétől.

Ha bármelyikkel találkozol: ne oszd meg az adataidat, ne kattints a hivatkozásra, és írj nekünk a kontakt@ekolo.rs címre.`,
      },
      {
        id: 81,
        pitanje: `Hogyan jutok az első POEN-hez, amíg még senki nem erősített meg?`,
        odgovor: `Ahhoz, hogy az első POEN rögzüljön neked, sem termék, sem megerősítés nem kell.

Adj fel egy hirdetést, amellyel kínálsz valamit — az első ilyen hirdetés 1.000 POEN-t hoz neked a cseréhez való hozzájárulás csatornáján. A hirdetésnek címet, leírást, fényképet, kategóriát és helységet kell tartalmaznia. A cseréhez való hozzájárulás fiókonként egyszer nyílik meg, és nem ismétlődik.

POEN akkor is rögzül neked, ha valaki egy lebonyolított cseréért átírja neked. Amíg nincs valóságigazolásod, kaphatod, de magad nem írhatod át másnak.

Amint megkapod a valóság megerősítését, keresési hirdetést is közzétehetsz — azt, amire neked van szükséged —, hogy jelentkezzen az, akinek megvan.`,
      },
      {
        id: 82,
        pitanje: `Olyan taggal cserélek, akit senki nem erősített meg — mekkora a kockázat?`,
        odgovor: `A kockázatot te viseled: ha átírod a POEN-t, és nem kapod meg azt, amiben megállapodtatok, az átírás nem áll vissza automatikusan.

Ezért csak akkor írd át a POEN-t, ha már megkaptad az árut vagy a szolgáltatást. Ez az egyetlen szabály, amely valóban megvéd téged.

Mit jelent a megerősített, és mit nem. A rendes tag olyasvalaki, akinek a valódiságát más megerősítette — neked ismeretlen, a hálózatnak nem. Az új tag olyasvalaki, akinek a valódiságát még senki nem erősítette meg, és a hirdetése ezt jelzi.

Mi dolgozik a javadra. A rendszer tartósan emlékszik. A nyilvántartás minden frissítése álnév alatt rögzítve marad, és a rendes tagok látják — a rossz magatartás nem törlődik a fiókról.

Ha a csere meghiúsul. Jelentsd az esetet az Alapítványnak. Az átírás nem visszafordíthatatlan, és bejelentés alapján érvényteleníthető — de ez nem jelent garanciát a visszatérítésre.

A minőségért, a teljesítésért és a megállapodás betartásáért te felelsz a másik féllel együtt, a kötelmi jog általános szabályai szerint; az Alapítvány és a Protokoll nem részese ennek a viszonynak. A kezdeti szakaszban kérheted az Alapítvány önkéntes közvetítését is — az nem kötelező erejű, de gyakran elegendő.

A legjobb, ha személyesen találkoztok, és a cserét szemtől szemben bonyolítjátok le. Így csökken a kockázat, és megszületik az az ismeretség is, amelyből megerősítés jöhet.`,
      },
      {
        id: 83,
        pitanje: `Hány hirdetést adhatok fel megerősítés előtt?`,
        odgovor: `Három aktív hirdetést, és csak ajánlatot — olyasmit, amit kínálsz. Az első ilyen hirdetés 1.000 POEN-t hoz neked.

Minden hirdetésnek címet, leírást, fényképet, kategóriát és helységet kell tartalmaznia. Előírt legkisebb hossz nincs — annyit írj, amennyi kell ahhoz, hogy az ember megértse, mit kínálsz.

A valóság megerősítésével a korlát eltűnik, és megnyílik a többi is:

• korlátlan számú aktív hirdetés

• keresési hirdetés — amellyel azt keresed, amire neked van szükséged

• a hirdetésen szereplő elérhetőség

• a beszélgetés kezdeményezése

Egyvalami megerősítés előtt is működik: ha valaki a hirdetésed kapcsán keres meg, válaszolhatsz neki.`,
      },
    ],
  },
  {
    id: "poen-zrno",
    naslov: "POEN és ZRNO",
    pitanja: [
      {
        id: 1,
        pitanje: `Mi az a POEN, és van-e dinárban kifejezett értéke?`,
        odgovor: `A POEN nyilvántartási bejegyzés arról, hogy értékeset adtál a közösségnek — más felhasználókkal folytatott cserével, megerősítési láncbeli megerősítéssel, a közösségért végzett munkával, adománnyal vagy patronálással.

A POEN jogi értelemben nem pénz — nem fizetőeszköz, nem elektronikus pénz, nem digitális vagyon, és nem jelent az Alapítvány részéről fennálló tartozást feléd.

Az „1 POEN ≈ 1 RSD" arány csupán tájékoztató támpont, hogy tudd, milyen nagyságrendről van szó — az Alapítvány ezt az értéket nem garantálja, és a POEN-t nem váltja pénzre.`,
      },
      {
        id: 2,
        pitanje: `Pénzzé tehetem-e a POEN-t, vagy eladhatom-e pénzért?`,
        odgovor: `Nem. A POEN nem cserélhető dinárra, külföldi valutára vagy bármilyen más fizetőeszközre. Az Alapítvány nem vásárolja vissza a POEN-t.

Átadhatod más felhasználónak javak és szolgáltatások cseréje során — a Piacon is —, vagy ZRNO-t jegyezhetsz be általa.

Maga a POEN-átadás mindig rögzül a nyilvántartásban; ha pedig emellett valaki magánúton pénzben állapodik meg, azt saját felelősségére teszi: az Alapítvány az ilyen megállapodást nem támogatja, nem részese, és megakadályozni sem tudja.`,
      },
      {
        id: 3,
        pitanje: `Lejár-e a POEN?`,
        odgovor: `Jelenleg nem. A POEN nyilvántartva marad a bejegyzésedben mindaddig, amíg át nem adod másoknak, vagy amíg nem inaktiválod a fiókodat.

A POEN „öregedési" mechanizmusának esetleges bevezetése (amely a felhalmozás helyett a körforgást ösztönözné) a rendszer lényegi megváltoztatása volna, és a Felső Kolo szavazását igényelné — az Alapítvány ezt önmagában nem hozhatja meg.`,
      },
      {
        id: 4,
        pitanje: `Mi az a ZRNO, és mire szolgál?`,
        odgovor: `A ZRNO a második bejegyzés, amelyet a rendszer vezet rólad, a POEN-től elkülönítve. Míg a POEN a hozzájárulásodat rögzíti — azt, amit a közösségnek adtál —, a ZRNO a helyzetedet, a közösségben való tartósabb részvételed mértékét. Ebből a helyzetből két dolog következik: szavazat a rendszer szabályairól szóló döntésekben, valamint egy nyilvántartott helyzet, amely a rendszerbeli tevékenységgel változik. A ZRNO nem részesedés, nem részvény és nem digitális vagyon, és nem hoz sem kamatot, sem hozamot — azt mutatja, mennyit fektettél vissza a hozzájárulásodból a közösségbe, nem pedig azt, hogy a közösség mennyivel tartozik neked.`,
      },
      {
        id: 5,
        pitanje: `Hogyan viszonyul mindez az adózáshoz és a számlaadáshoz?`,
        odgovor: `A POEN nem pénz és nem törvényes fizetőeszköz, a POEN-ben történő csere pedig nem pénzforgalmi művelet a pénzforgalmi szolgáltatásokról szóló szabályok értelmében. A KOLO nem számol adót, és nem állít ki adóügyi számlát a nevedben. Ugyanakkor a javak és szolgáltatások cseréjének lehetnek adójogi következményei számodra, attól függően, mit és milyen mértékben teszel — erre az általános szabályok vonatkoznak. Az Alapítvány nem ad adótanácsot; a saját adókötelezettségeiért a felhasználó felel. Ha rendszeresen nyújtasz árut vagy szolgáltatást, kérd könyvelő tanácsát.`,
      },
      {
        id: 38,
        pitanje: `Pontosan mit jelent a két különálló aktus elve?`,
        odgovor: `A két különálló aktus elve a Protokoll általi minden egyes POEN-rögzítés jogi természetét írja le.

1. aktus: a felhasználó hozzájárul a közjóhoz, vagy olyan státusza van, amely ezt igazolja (adományoz, működési programon keresztül járul hozzá, új felhasználót megerősít a megerősítési láncban, szociális programot indító státusza van, vagy patronálási kérelmet nyújt be).

2. aktus: a Protokoll algoritmikusan és determinisztikusan rögzíti a POEN-t a Szabályzat szerint — mérlegelés nélkül, szerződés nélkül, ellenszolgáltatás nélkül.

E két aktus jogilag független egymástól — nincs olyan szerződés a felhasználó és az Alapítvány között, amely szerint az elvégzett X-ért Y POEN járna, és a felhasználónak nincs követelése az Alapítvánnyal szemben a POEN rögzítésére.`,
      },
      {
        id: 40,
        pitanje: `Ez valamiféle piramisjáték vagy kripto?`,
        odgovor: `Egyik sem.

A piramisjáték úgy működik, hogy az új tagok fizetnek azért, hogy a korábbiak keressenek — a KOLO-ban nincs alattad szint, nincs jutalék mások hozzájárulásából, és a POEN nem vásárolható meg pénzért. Az összeg mindig nulla: minden létező POEN ugyanakkora mínuszként szerepel a Protokoll nyilvántartásában, így senki sem hozhat létre POEN-t a semmiből.

A kriptovaluta blokklánc-hálózaton létezik, piaci ára van, és tőzsdén vehető-eladható — a POEN nem token, a KOLO-n kívül nem létezik, nem váltható dinárra, és nincs piaci ára.

A POEN egyszerűen bejegyzés arról, mit adtál a közösségnek: közelebb áll egy könyvelési tételhez, mint a pénzhez. Az érték az emberek hálózatában van, akik munkát, javakat és tudást cserélnek egymással, nem a spekulációban.`,
      },
      {
        id: 51,
        pitanje: `Mi történik, ha a rendszer megbukik, vagy az Alapítvány beszünteti a működését — mindent elveszítek?`,
        odgovor: `A POEN és a ZRNO nem a nevedre szóló pénz, és nem is olyan tartozás, amellyel az Alapítvány neked tartozik — bejegyzések arról, mennyivel járultál hozzá a közösséghez, és mennyit cseréltél benne. Ezért sem a rendszer működése alatt, sem ha az egy nap megszűnne, nincs olyan pénzkövetelésed, amelyet érvényesíthetnél.

Az az érték, amelyet a KOLO-n keresztül szereztél, nem a képernyőn látható számok, hanem a javak és szolgáltatások valóságos, már megtörtént cseréi. Ezek a te tapasztalatodként és a te kapcsolati hálódként megmaradnak, a platform sorsától függetlenül.

Ha az Alapítvány beszüntetné a működését, a szabályai egyértelműek: a megmaradt vagyon nem az alapítókat és nem is bárkit magánszemélyként illet, hanem azonos vagy hasonló célú másik alapítványnak, közalapítványnak vagy egyesületnek adják át, előnyben részesítve azokat, akik a szolidáris gazdaság szellemében működnek. A rendszer megszűnéséből senki sem gazdagodhat meg.

A szoftver, amelyen a KOLO fut, nyílt licenc (AGPL-3.0) alatt jelent meg, a tartalom pedig ugyancsak nyílt licenc alatt. Ha egy konkrét szervezet meg is szűnik, az eszköz és a tudás elérhető marad — a közösség folytathatja, vagy ugyanezeken az alapokon újra felépítheti a rendszert. A közjó nem szűnik meg egyetlen szervezet megszűnésével.`,
      },
      {
        id: 52,
        pitanje: `Miért van 1 000 000 ZRNO felső határ, ha a ZRNO nem kereskedhető? Van staking vagy hozam?`,
        odgovor: `A határ rögzített, előre meghatározott szám — összesen 1 000 000 ZRNO, amely sem nem növelhető, sem nem csökkenthető. A ZRNO nem kereskedhető és nem ruházható át más felhasználóra; a közjóban elfoglalt helyzetedet rögzíti, amelyből a Felső Kolo-beli szavazat következik.

Bár nem kereskednek vele, a ZRNO-nak van POEN-ben kifejezett elszámolási értéke: az elszámolási együttható mutatja, mennyi POEN szükséges egy ZRNO bejegyzéséhez. Ez az együttható idővel nő — ahogy a rendszerben lévő POEN összmennyisége növekszik, a Protokollban rendelkezésre álló ZRNO mennyisége pedig minden bejegyzéssel csökken.

Staking, kamat és hozam nincs. A ZRNO nem jár osztalékkal, kamattal vagy a felszámolási maradványra vonatkozó joggal. Az elszámolási érték kizárólag az együtthatón keresztül változik, ahogy a rendszer növekszik — de ez a változás nem garantált hozam, nem fizeti ki senki, és kizárólag POEN-ben valósul meg, amelynek a rendszeren kívül nincs értéke.`,
      },
      {
        id: 53,
        pitanje: `A megerősítési bejegyzés (1000 POEN) toborzási jutalék, vagy airdrop, amelyet farmolhatok?`,
        odgovor: `Nem. Ez nem toborzási jutalék, nem airdrop, és nem farmolható.

Amikor valaki megerősít téged, a Protokoll 1000-1000 POEN-t ír be neked is és annak is, aki megerősített — egyszeri alkalommal és szimmetrikusan, mindkettőtöknek azonos összeget. Nincsenek fölötted vagy alattad „szintek", és semmi sem „folyik felfelé" olyan emberhálózaton át, amely a te megerősítésedből hasznot húzna. Ez nem jutalékos marketing.

A bejegyzés nem is az adataidért járó ellenszolgáltatás — a Protokoll automatikus aktusa szabály alapján: amikor megerősítési bejegyzés rögzül, a rendszer determinisztikusan POEN-t ír be, mindenféle szerződés vagy alku nélkül.

A farmolásnak több okból sincs értelme. A POEN nem tehető pénzzé — nem váltod dinárra, sem a rendszeren kívüli bármi másra, tehát nincs mit „kivenni" belőle. Az elv: egy ember — egy fiók, a megerősítés pedig személyes ismeretségen és a megerősítő felelősségén nyugszik, aki megerősítésével felel az állítás igazságáért; nem létező embereket nem találhatsz ki. Ezenfelül minden bejegyzés összege mindig nulla: minden beírt POEN-nek ugyanakkora mínusza van a Protokoll nyilvántartásában, így senki sem hoz létre értéket a semmiből.

Ha valaki mégis hamisan megerősít — nem létező személyt, vagy olyat, akinek már van másik fiókja —, azt hamis megerősítésként állapítják meg és semmisítik meg, minden ilyen kapcsolatra kiterjedő, továbbgyűrűző következményekkel.`,
      },
      {
        id: 54,
        pitanje: `Az alapítói csatorna 2 400 000 POEN-ig ír be „alapítóknak" — nem a csúcs írja be magának a pénzt?`,
        odgovor: `Nem. Az alapítói csatorna nem pénzt ír be — a POEN nem pénz, az összeg pedig sem tulajdont, sem hatalmat nem ad a rendszer felett.

A csatorna utólag rögzíti azt a munkát, amely a platform létrejötte előtt folyt: a rendszer megtervezését, a szabályok megírását, a jogi és szervezési előkészítést, a dokumentáció elkészítését. Ez a munka akkor zajlott, amikor nem volt hol rögzíteni, ezért rögzül később — mint minden más hozzájárulás.

Az alapítói POEN státusza ugyanaz, mint bármely másiké: nem konvertibilis, a rendszeren kívül nincs értéke, és nem keletkeztet követelést az Alapítvánnyal szemben.

Az alapítók köre zárt. Az e státuszú személyeket az Alapítvány belső aktusa előre meghatározta és közzétette; semmilyen későbbi döntés nem bővítheti ezt a kört.

Az ütem sem önkényes. Egy 24 000 POEN-es lépés csak akkor rögzül, amikor a rendszerben lévő POEN összmennyisége további 100 000-rel nő. Az alapítói hozzájárulás így csak annyival nő, amennyivel az egész rendszer; a 100. lépés elérésekor (összesen 2 400 000 POEN) a csatorna véglegesen és visszavonhatatlanul bezárul.

A nagyobb egyenleg nem jelent nagyobb hatalmat. A Felső Kolo-beli szavazás négyzetes — a szavazóerő a ZRNO-mennyiség négyzetgyökeként nő, így a nagy POEN-egyenleg nem ad ellenőrzést a rendszer felett.

Minden adat nyilvános: az összes rögzített összeg, a lépések száma, a határig hátralévő mennyiség és az egyes alapítók részesedése.`,
      },
    ],
  },
  {
    id: "ukljucivanje",
    naslov: "Csatlakozás",
    pitanja: [
      {
        id: 6,
        pitanje: `Regisztrálhatnak-e kiskorúak?`,
        odgovor: `Nem. A platform jelenleg kizárólag nagykorú személyeknek szól. A kiskorú felhasználókat külön modul fogja lefedni, szigorúbb követelményekkel és a szülő vagy törvényes képviselő hozzájárulásával; ez a modul később indul.`,
      },
      {
        id: 7,
        pitanje: `Hogyan megerősíttethetem magam, és mit nyerek vele?`,
        odgovor: `A megerősítés választható, de előfeltétele a platform funkcióinak teljes elérésének.

A megerősítés a megerősítési láncon keresztül történik: olyan rendes tag, aki személyesen ismer téged, ezen ismeretség alapján megerősíti a valódiságodat. A platform olyan technikai hozzájárulási és fiókazonosítási mechanizmust biztosít, amely nem gyűjt személyes adatot a megerősítettről. A megerősítő nem kér és nem gyűjt iratokat.

Minden megerősítés 10 százalékponttal növeli a valóságindexedet (0%-tól 100%-ig). A platform funkcióinak teljes elérése a 10%-os küszöbnél nyílik meg.

A megerősítési bejegyzés rögzítésekor a Protokoll automatikusan 1000 POEN-t ír be neked, 1000 POEN-t a megerősítőnek és 500 POEN-t a felügyelőnek.

A megerősítés minden fő funkció előfeltétele: POEN rögzítése adományokon és patronáláson keresztül, ZRNO bejegyzése, részvétel a Programokban, valamint a Piac és a tagokkal folytatott kommunikáció teljes elérése.`,
      },
      {
        id: 8,
        pitanje: `Mi van, ha külföldi vagyok — lehetek tag?`,
        odgovor: `Igen. Az állampolgárság nem feltétel. Az számít, hogy valós személy legyél — ezt pedig nem irattal bizonyítod, hanem a megerősítési láncon keresztül: olyan rendes tag, aki személyesen ismer, megerősíti a valódiságodat. A regisztrációkor nem kérünk sem útlevelet, sem személyi igazolványt, sem személyi számot — választasz álnevet, megadsz egy e-mail-címet és egy jelszót.

A rendszer szerb és angol nyelven működik.`,
      },
      {
        id: 9,
        pitanje: `Lehet több fiókom vagy több álnevem?`,
        odgovor: `Nem. Az elv: „egy ember — egy fiók". Több fiók létrehozása sérti a felhasználási feltételeket, és a rendszerből való kizáráshoz vezethet.

A rendszer nyilvános felületén egy álneved van.`,
      },
      {
        id: 10,
        pitanje: `Megváltoztathatom az álnevemet?`,
        odgovor: `Igen, de legfeljebb 30 naponta egyszer.

Amikor álnevet váltasz, az előzményekben szereplő összes tranzakciód az új álnév alatt jelenik meg — a régi sehol többé nem látszik. Az egyetlen állandó és megváltoztathatatlan elem a belső felhasználói azonosítód, amelyet más felhasználók nem látnak.`,
      },
      {
        id: 75,
        pitanje: `Milyen nyelven működik a rendszer? Van angol változat?`,
        odgovor: `A felület szerbül (latin és cirill betűvel) és angolul működik — a nyelvet a fejlécben lévő kapcsolóval választod ki. A Szabályzat, a Feltételek és a többi jogilag kötelező szöveg szerb nyelven készült, és a szerb változat az irányadó; a más nyelvű fordításaik nem hivatalos, az olvasót segítő szövegek.`,
      },
    ],
  },
  {
    id: "programi",
    naslov: "A Protokoll programjai",
    pitanja: [
      {
        id: 16,
        pitanje: `Mik azok a Programok, és melyek léteznek?`,
        odgovor: `A közösségi részvétel egyes formái állandóak és szétszórtak — a gyermekekről, az idősekről való gondoskodás —, ezért nem rögzíthetők egyedi cserékként. Erre szolgálnak a szociális programok: édesanyák mint elsődleges gondviselők, idős felhasználók, különleges gondoskodás és tanulás. Ha igazolod, hogy ilyen csoportba tartozol, a Protokoll napi szinten automatikusan POEN-t ír be neked, az egyes tevékenységek bejelentése nélkül. Ez nem szociális segély és nem juttatás — ez az a mód, ahogyan az ilyen részvétel is egyenrangú helyet kap a rendszerben.`,
      },
      {
        id: 17,
        pitanje: `Ki jelentkezhet az Édesanyák támogatására?`,
        odgovor: `Édesanyák vagy a gyermek más elsődleges gondviselője.

A neked rögzülő összeg a gyermekek számától függ — minél több gyermek, annál nagyobb a teljes összeg, de gyermekenként enyhén csökkenő mértékben (képlet szerint alkalmazott együtthatóval).

A jelentkezés a platformon keresztül történik, a státusz igazolásával.`,
      },
      {
        id: 18,
        pitanje: `Mi a Különleges gondoskodás, és hogyan lehet jelentkezni?`,
        odgovor: `A Különleges gondoskodás a fogyatékossággal élő személyek programja.

Az egyetlen szükséges irat a fogyatékosságot megállapító határozat — nem kérünk sem orvosi dokumentációt, sem diagnózist, sem „krónikus betegség igazolását", mert az különleges adatok kezelése volna, amelyet a törvény rendkívül szigorúan korlátoz.

Az összeg fix, és napi szinten rögzül, amíg a státusz fennáll.`,
      },
      {
        id: 19,
        pitanje: `Hogyan működik a működési hozzájárulás?`,
        odgovor: `A működési hozzájárulás olyan, a közjóért végzett munkaformákat rögzít, amelyek egyébként láthatatlanok maradnának (önkéntes munka, idősek gondozása, közös tevékenységekben való részvétel, alkotói hozzájárulások).

A hozzájárulás meghirdetett feladaton keresztül folyik: a feladatot az Alapítvány tűzi ki (a kezdeti szakaszban), illetve az aktiválás után a ZRNO-tartók és a Felső Kolo. Rendes tag jelentkezik rá és elvégzi, a teljesítést pedig az arra jogosult megerősítő erősíti meg, mielőtt a Protokoll rögzítené a POEN-t.

Nincs fix „órabér" — a javasolt POEN csak súlyozási támpont, a ténylegesen rögzített összeg pedig a napi rögzítési kereten belül oszlik el.`,
      },
      {
        id: 20,
        pitanje: `Lehetek egyszerre több programban?`,
        odgovor: `Igen, ha több program feltételeinek is megfelelsz. Például az az édesanya, aki tanul, egyszerre lehet az Édesanyák támogatásában és a Tanulásban is.

Minden programra külön kell jelentkezni, de mindegyikre közös napi rögzítési korlát vonatkozik: a rendszer aktuális forgalmának 10%-a (hogy ne kerüljön egyszerre túl sok POEN a nyilvántartásba).`,
      },
      {
        id: 61,
        pitanje: `Mi az „Idősek támogatása" — ki jogosult, és hogyan jelentkezem?`,
        odgovor: `Az Idősek támogatása az egyik szociális program. Az idős felhasználók a jogosult csoportok egyike — olyan csoport, amelynek közösségi részvételét a Protokoll akkor is elismeri, ha az nem egyedi cserékben nyilvánul meg.

Amikor igazolod az e csoporthoz tartozásodat bizonyító adatokat, a Protokoll automatikusan POEN-t ír be neked, az egyes tevékenységek bejelentése nélkül. Ez nem szociális segély és nem juttatás — ez az a mód, ahogyan az ilyen részvétel is egyenrangú helyet kap a rendszerben.

A jelentkezés a platformon keresztül történik, és rendes tagok előtt áll nyitva.

Az 50 éves és idősebb felhasználók jogosultak. A napi összeg a korral nő: 1000 POEN a betöltött 50. évtől, minden további évért 100 POEN-nel több. Így a 65 éves felhasználónál ez napi 2500 POEN, a 80 évesnél napi 4000 POEN. A részletes feltételeket és az életkor igazolásának módját programszabályzat rendezi.`,
      },
      {
        id: 62,
        pitanje: `Mi a „státuszigazolás" a szociális programhoz — fel kell töltenem anyakönyvi kivonatot vagy a gyermek iratát?`,
        odgovor: `Semmilyen iratot nem kell feltöltened.

Az Édesanyák támogatásánál például te magad írod be a gyermek nevét és születési dátumát a platform űrlapján — semmit nem kell beszkennelni vagy csatolni. A neked rögzülő összeg a gyermekek számától függ.

A jelentkezésedet ezután az Alapítvány vizsgálja meg és hagyja jóvá, mielőtt a Protokoll automatikusan POEN-t kezdene beírni neked. Az általad megadott adatok nem nyilvánosak — csak az látja őket, aki a kérelmet feldolgozza, mivel különleges adatokról van szó, amelyeket kizárólag a kifejezett hozzájárulásoddal kezelünk, és ezt a hozzájárulást bármikor visszavonhatod (ekkor az automatikus POEN-rögzítés is megszűnik).

Az egyes csoportok státuszigazolásának részletes feltételeit a honlapon közzétett, támogatási programokról szóló Szabályzat rendezi.`,
      },
      {
        id: 63,
        pitanje: `Van program munkanélkülieknek vagy általános anyagi szükséghelyzetre?`,
        odgovor: `Jelenleg nincs külön program sem a munkanélküliségre, sem az általános anyagi szükséghelyzetre.

A szociális programok pontosan meghatározott csoportokat fednek le, amelyek közösségi részvétele állandó és szétszórt, ezért nem rögzíthető egyedi cseréken keresztül: édesanyákat, idős felhasználókat, különleges gondoskodást (fogyatékossággal élő személyek) és tanulást. Sem a munkanélküliség, sem a szegénység nem tartozik e csoportok közé.

Fontos az is, hogy a szociális programok nem szociális segélyek és nem juttatások — azért léteznek, hogy a szétszórt részvétel is egyenrangú helyet kapjon a rendszerben, nem pedig az anyagi helyzet miatti támogatási formaként.

Ha anyagi szükséghelyzetben vagy, a POEN-hez vezető út ugyanaz, mint mindenki másnál: a másokkal folytatott áru- és szolgáltatáscsere, valamint a működési hozzájárulás — a közjóért végzett munka, amelyet feladatként hirdetnek meg, és amelynek elvégzéséért POEN kerül a nyilvántartásodba.

Új jogosult csoportok később hozzáadhatók: az első szakaszban erről az Alapítvány dönt, a közösségi önkormányzás aktiválása után pedig a Felső Kolo. Konkrét jövőbeli programok még nincsenek kidolgozva.`,
      },
      {
        id: 64,
        pitanje: `Ez munka? Van jövedelmem, szerződésem vagy garantált havi összegem?`,
        odgovor: `Nem, ez nem munka munkaviszony értelmében, és nincs garantált összeged.

Amikor a közjóért teszel valamit, magad döntöd el, jelentkezel-e, hogyan és milyen ütemben végzed el a feladatot — és bármikor visszaléphetsz, következmények nélkül. Senki sem utasít, és nincs munkavégzési kötelezettséged. Ezért ez nem munkaviszony: nincs felettes, nincs munkavégzési kötelezettség, nincs bér.

Nincs olyan szerződés sem, amely szerint az elvégzett X-ért pontosan Y POEN járna. A hozzájárulásod és a POEN rögzítése két különálló aktus: te hozzájárulsz, a Protokoll pedig ezt követően a szabályok szerint rögzíti a POEN-t. Ebből nem keletkezik követelés az Alapítvánnyal szemben — nincs kitől „behajtanod".

A POEN nem bér és nem juttatás. Amikor feladatot hirdetnek meg, javasolt POEN tartozik hozzá, de ez nem garantált összeg — csupán a feladat súlya. Hogy valójában mennyi kerül a nyilvántartásodba, attól függ, aznap mennyi hozzájárulás került a közös napi keretbe, amely arányosan oszlik el. Egyetlen megerősített bejegyzés sem vihető át a következő napra, és nem keletkeztet kötelezettséget a rendszer részéről feléd.

Ez a közösségnek nyújtott önkéntes hozzájárulás, amelyet rögzítenek, nem pedig garantált havi keresetű munka.`,
      },
      {
        id: 79,
        pitanje: `Hány POEN jár naponta gyermekenként az Édesanyák támogatásából, és hogyan hat a gyermekek száma és életkora?`,
        odgovor: `Minden gyermek után a kiinduló napi alap 2000 POEN. Ebből az alapból a gyermek életkorának minden évéért 100 POEN-t vonnak le, így a támogatás fokozatosan csökken, ahogy a gyermek nő, és megszűnik, amikor a gyermek betölti a 20. életévét.

A gyermekek száma növeli a teljes összeget, de nem egyszerű összeadással — minden további gyermek nagyobb szorzót hoz, mégpedig progresszíven: 1. gyermek ×1,00, 2. ×1,20, 3. ×1,50, 4. ×2,00, 5. ×3,00, 6. ×4,50, 7. ×6,00, 8. ×8,00, 9. ×10,00, a 10. gyermektől kezdve pedig minden további gyermekért ×2,00-del nő tovább. Így a nagyobb családok arányosan nagyobb támogatást kapnak.

Példa: egy hároméves gyermek esetében ez (2000 − 300) × 1,00 = 1700 POEN naponta. Ugyanez a gyermek harmadikként (2000 − 300) × 1,50 = 2550 POEN naponta.

A támogatás automatikusan, napi szinten rögzül, amíg a státusz fennáll, az egyes tevékenységek bejelentése nélkül. Mint a többi programnál, minden napi rögzítés a rendszer közös napi keretén osztozik, ezért nagy forgalmú napokon az összegek arányosan csökkenhetnek. E paramétereket programszabályzat rendezi, és annak módosításával változtathatók.`,
      },
    ],
  },
  {
    id: "pijaca-donacije",
        // Pokroviteljstvo je privremeno ugašeno (vidi `lib/moduli.ts`) — kad kanal krene,
    // u naslov se vraća i pomen pokrovitelja, a pitanja 24 i 25 se otključavaju sama.
    naslov: "Piac és adományok",
    pitanja: [
      {
        id: 21,
        pitanje: `Piac — ki felel, ha a csere meghiúsul?`,
        odgovor: `A piaci csere két felhasználó közvetlen, magánjogi jellegű viszonya. Az Alapítvány és a Protokoll nem felel sem a minőségért, sem a szállításért, sem a kötelezettségek teljesítéséért — mindezt a kötelmi jog általános szabályai rendezik.

Ha a csere meghiúsul, először próbáld meg közvetlenül a másik féllel rendezni; a kezdeti szakaszban kérheted az Alapítvány önkéntes, nem kötelező erejű közvetítését, és rendelkezésre áll a bírói út is.`,
      },
      {
        id: 22,
        pitanje: `Kérhetek-e a Piacon részben dinárban ellenértéket?`,
        odgovor: `A Piac elsősorban POEN-alapon működik.

A vegyes cserék (részben POEN, részben RSD) lehetségesek a te és a vevő közötti magánmegállapodásként, de ez a rendszeren kívül esik — az Alapítvány ezt a részt nem rögzíti és nem fedezi.

A teljes dináros rész a te magánfelelősséged az adójogi szabályok szerint.`,
      },
      {
        id: 23,
        pitanje: `Hogyan működik az Alapítványnak adott adomány, és mennyi POEN-t kapok?`,
        odgovor: `Adományt bármely rendes tag adhat, dinárban, az Alapítvány számlájára történő utalással.

Az utalás beérkezésekor a Protokoll automatikusan POEN-t rögzít: a POEN mennyisége = az adomány összege × az adományrögzítési együttható. Az együttható a halmozott összeggel 11 szinten át nő — 1,00-tól (1. szint, 5000 RSD alatti adomány) 2,00-ig (halmozott 5 000 000 RSD-nél). A szint állandó, és a POEN felhasználásával nem csökken. (Az adományrögzítési együttható nem „árfolyam" és nem a ZRNO elszámolási együtthatója.)

Az adományok segítik az Alapítványt a működés alapköltségeinek fedezésében (szerver, eszközök, fejlesztés, jogász, könyvelés). Ha a bevételek meghaladják a működési költségeket, a többlet a rendszer programjaiba kerül.`,
      },
      {
        id: 24,
        pitanje: `Kik a Patrónusok, és miben különböznek az adománytól?`,
        odgovor: `A patrónusok olyan jogi személyek és egyéni vállalkozók, akik támogatják az Alapítvány működését. A magánszemély adományához képest a fő különbség az, hogy a patrónus nemcsak pénzzel, hanem áruval vagy szolgáltatással is hozzájárulhat.

A patrónusnak nincs saját fiókja — a POEN-bónusz annak a tulajdonosnak vagy résztulajdonosnak a fiókjában rögzül, aki rendes tag, illetve magának az egyéni vállalkozónak a fiókjában, egy 7 szintből álló fix táblázat szerint (10 000 RSD-től 1 000 000 RSD-ig).

Minden patrónus nyilvánosan látható a Patrónusok oldalon — az átláthatóság és a hozzájárulás nyilvános elismerése érdekében.`,
      },
      {
        id: 25,
        pitanje: `Lehet-e egy cég közvetlen tag?`,
        odgovor: `Nem. Közvetlen tagok kizárólag természetes személyek lehetnek.

A cégek a Patronáláson keresztül vesznek részt — támogatják az Alapítványt, a tulajdonos vagy résztulajdonos pedig rendes tagként POEN-bónuszt kap.`,
      },
      {
        id: 39,
        pitanje: `A piaci csere adásvételnek minősül?`,
        odgovor: `A KOLO rendszer Szabályzata szerint a felhasználók közötti áru- és szolgáltatáscsere a Piacon nem klasszikus adásvételként van felépítve. Két felhasználó kölcsönös megállapodásáról van szó — az egyik árut vagy szolgáltatást ad, a másik POEN-t ad át, amely nem pénz, hanem a közjóhoz való hozzájárulás nyilvántartása.

Maga a POEN átadása ebben a cserében nem pénzbeli fizetés és nem fizetőeszközzel történő fizetés a pénzforgalmi szolgáltatásokról szóló törvény értelmében. A felhasználók közötti, a cserével kapcsolatos viszonyokat — beleértve a teljesítés, a felelősség és a kockázat kérdéseit — a kötelmi jog általános szabályai rendezik; a Protokoll ebben a cserében nem közvetít.

E cserék adójogi és számlaadási minősítése nem szünteti meg a tevékenységet folytató felhasználó általános szabályok szerinti kötelezettségeit.`,
      },
      {
        id: 41,
        pitanje: `Nyilvánosan látható a hirdetésem a Piacon?`,
        odgovor: `Igen. A hirdetés tartalma — a leírás, a POEN-ben megadott ár, a helység és az álneved — nyilvánosan látható minden látogató számára, a nem regisztráltak számára is, hogy a csere elérhetőbb és könnyebben megtalálható legyen.

Ami NEM nyilvános: az elérhetőséged (telefonszám), valamint az a lehetőség, hogy valaki írjon neked vagy cseréljen veled — ez csak rendes tagok számára érhető el. A nem regisztráltak és a nem megerősítettek számára a hirdetésen szereplő álneved sem a profilodhoz, sem a tranzakciós előzményeidhez nem vezet.`,
      },
      {
        id: 58,
        pitanje: `Cserélhetek a szomszéddal munkát munkáért vagy szerszámot terményért, egyetlen POEN nélkül (barter)?`,
        odgovor: `Cserélhetsz. A közvetlen barter — a te munkád az ő munkájáért, a te szerszámod az ő terményéért — magánmegállapodás közted és a szomszédod között, és a KOLO ezt nem tiltja.

Az ilyen csere a rendszeren kívül zajlik. Ha mellette nem frissül a POEN-nyilvántartás, akkor a ti személyes megállapodásotok marad, és sehol nem rögzül a hozzájárulásodként.

Márpedig épp ez a KOLO értelme: hogy az a csere, amelyet egyébként „kézből kézbe" bonyolítanátok, bejegyzést kapjon. Amikor a csere mellett frissítitek a nyilvántartást, az adó fél bejegyzése csökken, a kapó félé pedig ugyanannyival nő — és nyoma marad annak, ki mennyit adott a közösségnek.

Kombinálhatod is: egy részt tiszta barterként végeztek, egy részt pedig POEN-ben írtok át. Ekkor csak az a rész rögzül, amelyre a nyilvántartást frissítettétek; az ezen felüli tiszta barter nyilvántartatlan marad.

Mindenesetre a minőségért, a szállításért és a megállapodás teljesítéséért ti ketten feleltek az általános szabályok szerint — az Alapítvány és a Protokoll ebbe nem avatkozik bele, és ezért nem is felel.`,
      },
      {
        id: 59,
        pitanje: `Ki felel, ha a munkának rejtett hibája van, az áru megromlik, vagy a vevő nem veszi át? Jótállás, reklamáció és a POEN visszatérítése?`,
        odgovor: `Mindenért, ami a minőséget, a hibátlanságot és a szállítást illeti, maguk a cserélő felhasználók felelnek — az, aki a javakat vagy a szolgáltatást adja, és az, aki átveszi. Az Alapítvány és a Protokoll nem részese ennek a cserének, és nem közvetít benne; mindent a kötelmi jog általános szabályai rendeznek, mint bármely más, két ember közötti beszerzésnél.

A jótállást, a határidőt és a feltételeket közvetlenül a másik féllel egyeztetd a csere előtt — minél világosabban állapodtok meg mindenben (az áru állapota, a határidő, mi történik, ha valami nem jó), annál könnyebben rendezhető egy esetleges probléma később. Ha olyan áruról vagy szolgáltatásról van szó, amelynél törvény szerint fogyasztóvédelem áll fenn, az itt is érvényes, a megállapodásotoktól függetlenül.

A rendszerben nincs automatikus „sztornó". Ha megállapodtok valaminek a visszaadásáról, az új, önkéntes POEN-nyilvántartás-frissítésként történik ellenkező irányban — mintha új, visszafelé irányuló cserét bonyolítanátok.

Ha valami rosszul sül el, először próbáld meg közvetlenül a másik féllel rendezni. A kezdeti szakaszban kérheted az Alapítvány önkéntes, nem kötelező erejű közvetítését is. Ha a megállapodás nem sikerül, az általános szabályok szerinti bírói út áll rendelkezésedre.`,
      },
      {
        id: 60,
        pitanje: `Hogyan határozom meg a termékeim árát és mennyiségét, és ki értékeli azokat?`,
        odgovor: `A javaid és szolgáltatásaid árát magad határozod meg, szabadon, POEN-ben. A platform nem állapítja meg, nem korlátozza és nem ellenőrzi, és senki sem értékeli helyetted az árudat. Te tudod a legjobban, mit kínálsz, és mennyit ér.

Csak egy támpont létezik: egy POEN nagyjából egy dinárnak felel meg. Ez tájékoztató érték, amely segít eligazodni az árképzésnél, de semmire sem kötelez, és nem hivatalos árfolyam. Figyelembe veheted, vagy nem.

Amit elvárunk tőled, az a tisztesség: köteles vagy pontos és világos leírást adni a javakról vagy a szolgáltatásról, valós mennyiséget és valós POEN-összeget megjelölni, valamint a csere minden feltételét közölni. Nem megengedett hamis vagy megtévesztő tartalom közzététele, amely helytelenül mutatja be a kínált dolog jellegét, minőségét vagy mennyiségét.

Minden mást — a szállítás módját, a határidőt, a további feltételeket — közvetlenül a másik féllel egyeztetsz.

Megjegyzés: ez a piaci cserére vonatkozik. A működési hozzájárulás másik csatorna, és ott az összeg nem szabad megállapodás tárgya, hanem a javasolt POEN súlyozási együtthatóként szolgál a napi keret elosztásában.`,
      },
      {
        id: 74,
        pitanje: `Milyen pénznemben adományozhatok — küldhetek eurót külföldről?`,
        odgovor: `Adományozhatsz dinárban vagy más pénznemben — tehát eurót is külföldről. Az adomány az Alapítvány számlájára történő utalással történik.

Az utalás beérkezésekor a Protokoll automatikusan POEN-t ír be neked: az adomány összegét megszorozva az adományrögzítési együtthatóval. Ez az együttható a halmozott adományoddal 11 szinten át nő — 1,00-tól (a legalsó szinten, 5000 RSD alatti adomány) 2,00-ig (a legfelsőn). Az elért szint állandó, és nem csökken, ahogy a POEN-t felhasználod.

(Az adományrögzítési együttható nem „árfolyam" és nem a ZRNO elszámolási együtthatója — külön, kizárólag az adományokhoz kötődő mennyiség.)

Adományozni bármely rendes tag tud. Kérésre az Alapítvány a törvénynek megfelelő igazolást állít ki az adományról.`,
      },
    ],
  },
  {
    id: "porezi-legalnost",
    naslov: "Adók és jogszerűség",
    pitanja: [
      {
        id: 47,
        pitanje: `Megerősítette-e bármelyik szabályozó hatóság (Nemzeti Bank, Adóhivatal, Biztos), hogy ez jogszerű, vagy csak az Alapítvány állítja ezt?`,
        odgovor: `Nem. Jelenleg nincs olyan írásbeli szabályozói állásfoglalás, amely megerősítené a jogszerűséget — sem a Nemzeti Bank, sem az Adóhivatal, sem a Biztos nem adott ki ilyen igazolást.

Amin a rendszer nyugszik, az nem valakinek az engedélye, hanem a saját jogi felépítése. A POEN a szabályok szerint nem pénz, nem valuta, nem elektronikus pénz, nem fizetőeszköz és nem digitális vagyon, és nem alakítható át semmivé, aminek a rendszeren kívül értéke volna. A POEN-nyilvántartás felhasználók közötti frissítése nem pénzforgalmi művelet a pénzforgalmi szolgáltatásokról szóló szabályok értelmében. Magára az emberek közötti áru- és szolgáltatáscserére a kötelmi jog általános szabályai vonatkoznak, a vitákat pedig az illetékes bíróság rendezi. A rendszer jogi helyzete tehát abból következik, ahogyan a rendszer szerkezetileg fel van építve, nem pedig külső jóváhagyásból.

Ami az adókat illeti: az, ahogyan e cseréket adójogi és számlaadási szempontból kezelni fogják, nem szünteti meg a meglévő kötelezettségeidet, ha tevékenységet folytatsz. Az Alapítvány nem ad adótanácsot, és a saját adókötelezettségeidért te felelsz.

A személyes adatok védelme ügyében mindig jogod van a közérdekű információkkal és a személyes adatok védelmével foglalkozó Biztoshoz fordulni.

A szabályok vagy a szabályozói értelmezések változása olyan kockázat, amelyet érdemes figyelembe venned, mielőtt csatlakozol.`,
      },
      {
        id: 48,
        pitanje: `Rendszeresen árulom a felesleget (méz, pálinka, befőtt), vagy kézműves szolgáltatást nyújtok — kell-e számla, áfa vagy bejegyzett tevékenység? Ki viseli az adót?`,
        odgovor: `A KOLO nem számol neked adót, és nem állít ki adóügyi számlát a nevedben, de nem is szünteti meg azokat a kötelezettségeidet, amelyek az általános szabályok szerint már fennállnak.

A felhasználók közötti áru- és szolgáltatáscsere nem klasszikus adásvételként van felépítve, maga a POEN átadása pedig nem pénzbeli fizetés a pénzforgalmi szabályok értelmében — a POEN hozzájárulás-nyilvántartás, nem pénz. Ezért a Protokoll frissíti a POEN-nyilvántartást, de nem vezeti az adókönyveidet, és nem állít ki számlákat.

Ez azonban nem jelenti azt, hogy mentesülnél a szabályok alól. Ha árut vagy szolgáltatást rendszeresen és tevékenységre emlékeztető mértékben nyújtasz, rád ugyanúgy vonatkoznak az általános szabályok, mint a platformon kívül. Az Alapítvány nem ad adótanácsot, és nem részese a cserédnek — a teljesítésért, a minőségért és a kockázatért te és a másik fél feleltek a kötelmi jog általános szabályai szerint, a saját adókötelezettségeidért pedig te felelsz.`,
      },
      {
        id: 49,
        pitanje: `Hat-e a KOLO-ban való részvétel / a POEN a nyugdíjamra vagy a szociális juttatásaimra?`,
        odgovor: `A POEN nem hat sem a nyugdíjadra, sem a szociális juttatásaidra.

A POEN nem pénz, nem kereset és nem jövedelem — belső nyilvántartási bejegyzés arról, mit adtál a közösségnek, és nem alakítható át a rendszeren kívül értékkel bíró eszközzé. Az Alapítvány semmilyen pénzbeli juttatást nem fizet neked, és a POEN-t sehol nem jelenti be a jövedelmedként.

Ha valamelyik szociális programon keresztül kapsz POEN-t (például szülő-gondviselőként, idős felhasználóként vagy tanulásban), az sem szociális segély és nem juttatás — csupán automatikus POEN-nyilvántartás-frissítés, amely egyenrangúbb részvételt tesz lehetővé a rendszerben.

Különbséget kell azonban tenned a POEN és aközött, amit a rendszeren kívül teszel. Ha valakivel úgy állapodsz meg, hogy a csere egy része dinárban történik, az a dináros tevékenység a tiéd, és arra az általános szabályok vonatkoznak — mint minden más áru- és szolgáltatáscserére. Ennek lehetnek következményei a státuszodra nézve, attól függően, mit és milyen mértékben teszel.

Az Alapítvány sem adó-, sem jogi tanácsot nem ad. Ha nyugdíjat vagy valamilyen szociális juttatást kapsz, és nem vagy biztos abban, hogyan fér ez össze a tevékenységeddel, a legbiztosabb, ha az illetékes szervnél (nyugdíjbiztosító) vagy könyvelőnél érdeklődsz.`,
      },
      {
        id: 50,
        pitanje: `Miben különbözik a POEN az elektronikus pénztől, és nem rejtett POEN-vásárlás-e az adomány?`,
        odgovor: `Az elektronikus pénznek három ismérve van: akkor kapod, ha pénzt fizetsz be; a kibocsátóval szembeni követelésedet testesíti meg; és bármikor visszaválthatod, hogy pénzt kapj vissza. A POEN e három közül egyiknek sem felel meg.

A POEN nem azért kerül a nyilvántartásba, mert pénzt fizettél be, hanem azért, mert hozzájárultál a közösséghez, vagy olyan státuszod van, amely ezt igazolja. Az Alapítvány a POEN alapján semmivel sem tartozik neked, és nem is vásárolja vissza. A POEN nem alakítható át sem dinárrá, sem a rendszeren kívüli bármely fizetőeszközzé.

Az adomány azért nem rejtett POEN-vásárlás, mert ez két jogilag független esemény. Az első a te visszavonhatatlan adományod az Alapítványnak. A második a POEN automatikus rögzítése, amelyet a Protokoll előre meghatározott szabályok szerint végez.

Nincs olyan szerződés, amely szerint a befizetett X dinárért Y POEN-t kapsz. Az adomány nem ad jogot arra, hogy az Alapítványtól POEN rögzítését követeld, sem arra, hogy a pénzt visszakérd. A POEN rögzítése nem ellenszolgáltatás az adományért.

Hogy tudd, milyen nagyságrendről van szó, támpontként az szolgál, hogy 1 POEN körülbelül 1 dinár, de az Alapítvány ezt az értéket nem garantálja, és a POEN-t nem váltja pénzre.`,
      },
      {
        id: 77,
        pitanje: `Az Alapítvány a pénzmosás elleni szabályok (AML/KYC) hatálya alá tartozik-e, és azonosítja-e az adományozókat?`,
        odgovor: `Az Alapítvány nem pénzügyi intézmény, és nem a felhasználók pénzével gazdálkodik — a POEN nem pénz, a felhasználók közötti csere pedig nem pénzforgalmi művelet. Tevékenysége szerint az Alapítvány nem tartozik a pénzmosás és a terrorizmus finanszírozása elleni szabályok hatálya alá.

Az adományozókat mindazonáltal nem fogadja névtelenül. A magánszemélyek adományai az Alapítvány számlájára, ellenőrzött bankszámlákról érkező utalással érkeznek — így a befizető azonosítását és a pénzeszközök eredetének ellenőrzését maga a bankrendszer végzi el, a saját szabályai szerint. A patrónusok olyan jogi személyek és egyéni vállalkozók, akiket az adományozási szerződés azonosít.

Az adományokra vonatkozó adatokat az Alapítvány a pénzügyi beszámolási szabályoknak megfelelően őrzi, és az illetékes szervek — köztük az Adóhivatal és a pénzmosás elleni hatóság — rendelkezésére bocsátja, amikor azt törvény írja elő.`,
      },
    ],
  },
  {
    id: "zastite",
    naslov: "Védelmek és irányítás",
    pitanja: [
      {
        id: 26,
        pitanje: `Ki felügyeli a KOLO-t?`,
        odgovor: `Jelenleg (1. szakasz) minden döntést a KOLO Alapítvány hoz meg az Igazgatóságon keresztül.

Amikor a rögzített POEN összmennyisége eléri az 1 000 000-t, aktiválódik a Felső Kolo — az összes ZRNO-tartó irányító testülete, amely a kulcsfontosságú rendszerkérdésekről négyzetes szavazással dönt.

Az Alapítvány ettől a pillanattól kezdve szuverén szervből végrehajtó szervvé válik — a Felső Kolo döntéseit hajtja végre, nem maga hozza meg őket.`,
      },
      {
        id: 27,
        pitanje: `Mi akadályozza meg az adminisztrátorok vagy az alapítók visszaéléseit?`,
        odgovor: `Több szerkezeti védelem működik párhuzamosan.

A nulla összegű elv — minden POEN-bejegyzés növeli a Protokoll mínuszát, senki sem hozhat létre POEN-t a semmiből.

A programok napi korlátja — az összes program együttes napi rögzítése nem haladhatja meg a forgalom 10%-át.

Determinisztikus algoritmikus bejegyzések — a Protokollnak nincsenek mérlegelési döntései, minden a kódban van.

Átláthatóság — a hozzájárulások nyilvántartása álnevesített és megváltoztathatatlan; a rendes tagok látják (státusz szerint fokozatosan), míg a nem regisztráltak csak az összesített adatokat.

Végül pedig a Felső Kolo aktiválása, amely a hatáskört a tagokra ruházza át.`,
      },
      {
        id: 28,
        pitanje: `Mi a Felső Kolo, és mikor aktiválódik?`,
        odgovor: `A Felső Kolo az összes ZRNO-tartó irányító testülete — a rendszerrel kapcsolatos döntéshozatal legfelső szerve. Nem választott közgyűlés, hanem dinamikus összetételű testület: azok alkotják, akiknek az adott pillanatban ZRNO-juk van.

Automatikusan aktiválódik, amikor a Protokoll mínusza eléri a −1 000 000 POEN-t (jelezve, hogy a rendszer kellően aktív, és a tagok jelentős közös felelősséget viselnek).

Addig minden döntést az Alapítvány hoz; azt követően a kulcsfontosságú rendszerdöntéseket (a Szabályzat módosítása, új Programok, Programok felfüggesztése) a Felső Kolo hozza meg, ZRNO-val történő négyzetes szavazással.`,
      },
      {
        id: 29,
        pitanje: `Mi az a négyzetes szavazás?`,
        odgovor: `Ez olyan szavazási mód, amelynél a szavazóerő a ZRNO-mennyiség négyzetgyökeként nő. Ha 1 ZRNO-d van — 1 szavazat, 100 ZRNO — 10 szavazat, 10 000 ZRNO — 100 szavazat.

A cél az, hogy vagyonos egyének ne „vásárolhassanak meg" egy döntést pusztán azzal, hogy sok ZRNO-juk van — a tényleges befolyás lassan nő, ami a hatalom összpontosítása helyett a szélesebb részvételt ösztönzi.`,
      },
      {
        id: 30,
        pitanje: `Mi az Alapítvány Védelmi vétója?`,
        odgovor: `Amíg az Alapítvány nem pénzügyileg önálló, megtagadhatja a Felső Kolo olyan döntésének végrehajtását, amely veszélyeztetné a működési és pénzügyi fenntarthatóságát — mindenekelőtt az olyan, forráselköltésről szóló döntésekét (a közös beszerzéseket is beleértve), amelyek aláásnák az Alapítvány képességét az alapköltségek fedezésére és a rendszer fenntartására.

A vétó nem mérlegelési jogkör — konkrét fenntarthatósági fenyegetésre hivatkozva meg kell indokolni; az indokolás nélküli vétó maga a visszaélés. Ez nem politikai ellenőrzés, hanem az Alapítvány folytonosságának és fenntarthatóságának védelme.

A vétó véglegesen és egyirányúan megszűnik, amikor az Alapítvány eszközei elérik a pénzügyi önállóság küszöbét — az előző havi működési költség háromszorosát, amelyet a Felső Kolóról szóló Szabályzat állapít meg. Ekkor a fenntarthatóság már nincs veszélyben.`,
      },
      {
        id: 72,
        pitanje: `Pontosan mit változtatnak a tagok a „teljes önkormányzásban", és mikor áll be ez?`,
        odgovor: `Két különálló küszöb létezik, és könnyű őket összekeverni.

Első küszöb — a Felső Kolo aktiválása. Amikor a rendszerben rögzített POEN összmennyisége eléri az 1 000 000-t (ami a Protokoll nyilvántartásában a −1 000 000 állapotnak felel meg), automatikusan megnyílik a ZRNO bejegyzése, és létrejön a Felső Kolo — az összes ZRNO-tartó irányító testülete. Ettől kezdve a tagok aktív ZRNO-val, négyzetes szavazással döntenek a rendszer szabályairól: a Szabályzat módosításairól, a Programokról és más, a közjót érintő kérdésekről. Az Alapítvány szuverén szervből végrehajtó és szolgáltató szervvé válik — végrehajtja a döntéseket, nem maga hozza meg őket.

Második küszöb — a védelmi vétó megszűnése. Amíg az Alapítvány nem pénzügyileg önálló, védelmi vétója van: megtagadhatja a Felső Kolo olyan döntésének végrehajtását, amely veszélyeztetné a működési fenntarthatóságát — mindenekelőtt a forráselköltésről szóló döntésekét (például közös beszerzések), mielőtt a fenntarthatóság biztosított volna (a vétót meg kell indokolni, nem önkényes). Ez a vétó véglegesen és egyirányúan csak akkor szűnik meg, amikor az Alapítvány pénzeszközei elérik a pénzügyi önállóság küszöbét — az előző havi működési költség háromszorosát, amelyet a Felső Kolóról szóló Szabályzat állapít meg.

A Felső Kolo aktiválásáig (1. szakasz) minden döntést az Alapítvány hoz meg az Igazgatóságon keresztül.`,
      },
    ],
  },
  {
    id: "tehnika",
    naslov: "Technika és nyílt forráskód",
    pitanja: [
      {
        id: 69,
        pitanje: `Ha PR-t küldök (kóddal járulok hozzá) — kapok POEN-t? Ez működési hozzájárulás? Megerősítettnek kell lennem?`,
        odgovor: `A kóddal való hozzájárulás a működési hozzájárulás körébe tartozik — ugyanaz a csatorna, amelyen keresztül a közjóért végzett munka rögzül.

A kód és a tartalom közjó: a szoftver AGPL-3.0, a tartalom CC BY-SA 4.0 licenc alatt áll. A kóddal való hozzájárulást a DCO elve szerint fogadjuk el („Signed-off-by" aláírás) — ez a hozzájárulás eredetének igazolása, nem a szerzői jogok átruházása az Alapítványra (nem CLA). Az e hozzájárulásra vonatkozó feltüntetésed állandó, és akkor is megmarad, ha később törlöd a fiókodat.

Ahhoz, hogy POEN kerüljön a nyilvántartásodba, rendes tagnak kell lenned, legalább 10%-os valóságindexszel.

A mechanizmus a következő: a feladatot az Alapítvány hirdeti meg (a kezdeti szakaszban), illetve az aktiválás után a ZRNO-tartók és a Felső Kolo; te jelentkezel rá és elvégzed, a teljesítést pedig az arra jogosult megerősítő erősíti meg, mielőtt a POEN rögzülne.`,
      },
      {
        id: 70,
        pitanje: `Van nyilvános vagy fejlesztői API? Építhetek integrációkat vagy botokat?`,
        odgovor: `Jelenleg nincs nyilvános fejlesztői API integrációk vagy botok építéséhez.

Ami létezik, az a saját adataid exportja: bármikor kérheted az összes adatodat strukturált, géppel olvasható formátumban (JSON) — ez a törvényes adathordozhatósági jogod. De ez a személyes adataid exportja, nem pedig nyílt programozói felület az egész rendszerhez.

Fontos tudnod azt is, miért: a rendszerben fokozatos láthatóság működik — az álneveket és az egyes tranzakciókat csak a rendes tagok látják, a nem regisztráltak pedig csak az összesített mutatókat. Bármely jövőbeli API-nak ugyanezt a szabályt kellene tiszteletben tartania, különben megkerülné az adatvédelmet.`,
      },
      {
        id: 71,
        pitanje: `Milyen a biztonsági modell? Blokklánc ez? Mi akadályozza meg, hogy valaki POEN-t „verjen" vagy átírja az előzményeket?`,
        odgovor: `Nem blokklánc. A KOLO központosított nyilvántartást használ, amelyet a Protokoll vezet az Alapítvány tulajdonában lévő infrastruktúrán. A decentralizáció itt nem technikai, hanem irányítási jellegű — a döntéshozatal idővel az alapítóktól a közösséghez kerül át.

A POEN „verése" elleni védelem a nulla összegű szabályon nyugszik: minden létező POEN ugyanakkora mínuszként szerepel a Protokoll bejegyzésében. Senki sem írhat be POEN-t a semmiből, mert az azonnal felborítaná az egyensúlyt, amelyet a rendszer folyamatosan ellenőriz. Ezenfelül a Protokoll minden művelete determinisztikus és algoritmikus, mérlegelés nélkül — a Protokoll nem járhat el a szabályokon kívül, így az adminisztrátor sem adhat „kézzel" senkinek POEN-t a meghatározott csatornákon kívül.

Ami az előzményeket illeti: a nyilvántartás minden bejegyzése időbélyeggel van ellátva és az előző állapothoz kötött, így a korábbi állapotok utólag nem írhatók át csendben az egész lánc megsértése nélkül. Emellett minden adathozzáférés olyan védett formátumban rögzül, amely visszamenőleg nem módosítható, a rendszeres konzisztenciaellenőrzések pedig igazolják, hogy a nyilvántartás minden pillanatban megfelel a szabályoknak.

A korlátokról: ez a megváltoztathatatlanság tervezési szabály, amelyet a szoftverarchitektúra biztosít, nem pedig olyan kriptográfiai, „bizalommentes" garancia, amilyet a nyilvános blokklánc nyújt. Más szóval az integritás a helyesen megírt kódon, a hozzáférés-ellenőrzésen és az átláthatóságon nyugszik, nem azon, hogy a matematika bárki bizalma nélkül lehetetlenné teszi a csalást. Ezért vannak további intézkedések is — az adatok titkosítása átvitel közben és tárolt állapotban, rendszeres, külön helyszínekre készülő biztonsági mentések, és nyílt kód, amelyet bárki függetlenül átnézhet.`,
      },
      {
        id: 80,
        pitanje: `Hol van a nyilvános kódtár? Letölthetem és futtathatom magam (self-host)?`,
        odgovor: `A platform teljes forráskódja nyilvánosan elérhető a GitHubon:

https://github.com/alvaserbia-prog/kolo-platform

Szabadon átnézheted, letöltheted (klónozhatod), és futtathatod a saját másolatodat. A szoftver AGPL-3.0 licenc alatt áll, amely ezt kifejezetten megengedi — egy feltétellel: ha a másolatodat nyilvános internetes szolgáltatásként futtatod, neked is elérhetővé kell tenned a saját forráskódodat, minden módosítással együtt, a felhasználóid számára, ugyanezen licenc alatt. Így a kód tartósan nyílt marad.

A futtatáshoz Node.js környezetre és PostgreSQL adatbázisra van szükséged. Az alapvető útmutatók (telepítés, indítás, szükséges környezeti változók) magában a kódtárban, a README és a .env.example fájlban találhatók. A kódhoz való hozzájárulásokat a hozzájárulás eredetéről szóló nyilatkozat (DCO) aláírásával fogadjuk el, amelyet a CONTRIBUTING fájl ír le.

A rendszer dokumentációja és szövegei CC BY-SA 4.0 licenc alatt állnak — szabadon felhasználhatók és átdolgozhatók a szerzőség feltüntetésével és ugyanazon licenc alatt.`,
      },
    ],
  },
  {
    id: "sporovi",
    naslov: "Viták és a szabályok megsértése",
    pitanja: [
      {
        id: 31,
        pitanje: `Hogyan rendeződnek a tagok közötti viták?`,
        odgovor: `A tagok közötti, cserével kapcsolatos vita a kötelmi jog általános szabályai szerint, az illetékes bíróság előtt rendeződik — az Alapítvány nem részese ennek a viszonynak.

A kezdeti szakaszban kérheted az Alapítvány önkéntes (nem kötelező erejű) közvetítését. Ha a vita egy tag és maga az Alapítvány között áll fenn, először a megegyezéses rendezést kell keresni, egyébként a zombori bíróság illetékes.

A személyes adatok védelme ügyében jogod van panaszt tenni a közérdekű információkkal és a személyes adatok védelmével foglalkozó Biztosnál.

Külön belső vitarendezési mechanizmusok később hozhatók létre (külön szabályzattal vagy a Felső Kolo döntésével); egyelőre nincsenek.`,
      },
      {
        id: 32,
        pitanje: `Mi történik, ha valaki nem tartja be a szabályokat?`,
        odgovor: `A rendszernek tartós emlékezete van — minden nyilvántartás-frissítés véglegesen rögzül álnév alatt, és látható a rendes tagok számára, így a rossz magatartás látható marad azok előtt, akik részt vesznek a rendszerben.

Az Alapítvány ideiglenesen felfüggesztheti a fiókot (legfeljebb 30 napra, a felhasználó azon jogával, hogy tájékoztassák az okokról és nyilatkozhasson), vagy súlyosabb szabálysértés esetén kizárhatja a felhasználót.

A kizárt felhasználó elveszíti a hozzáférését, a POEN és a ZRNO visszakerül a Protokollhoz, az álnév pedig anonimizálódik.`,
      },
      {
        id: 33,
        pitanje: `Benyújthatok kifogást az Alapítvány döntése ellen?`,
        odgovor: `Igen. Minden rendes tag benyújthat hivatalos kifogást a platformon keresztül — megerősítés, felfüggesztés, programdöntés vagy bármely más döntés ellen.

Az Alapítványnak 30 napon belül, indokolással kell elbírálnia a kifogást.

Egyszerre legfeljebb 3 nyitott kifogásod lehet.`,
      },
    ],
  },
  {
    id: "privatnost-izlazak",
    naslov: "Adatvédelem és kilépés",
    pitanja: [
      {
        id: 34,
        pitanje: `Ki látja az álnevemet és a tranzakcióimat?`,
        odgovor: `A láthatóság a rendszerbeli státuszodtól függ (a hozzáférés fokozatos):

A nem regisztrált látogató csak a rendszer általános mutatóit (összesített adatokat) látja — a tagok számát, a nyilvántartás-frissítések számát, a forgalomban lévő POEN-t. Egyedi tranzakciókat és álneveket nem lát.

A regisztrált, de nem rendes tag látja a nyilvántartás-frissítések összegeit és időbélyegeit, de a felek álnevei és a számlaegyenlegek nélkül.

A rendes tag (valóságindex ≥ 10%) látja az összes felhasználó álnevét, minden tranzakciót a felek álnevével, a számlaegyenlegeket és a profilokat.

A valódi neved és a telefonszámod önkéntes, és nem feltétele a használatnak. Az Alapítvány nem vezet olyan nyilvántartást, amely az álnevedet a személyazonosságodhoz kapcsolná — magad döntöd el, felfeded-e a nevedet és a telefonszámodat, és kinek (csak megerősítetteknek), a megosztást pedig visszavonhatod.

Kivétel a Piac: a hirdetéseid (leírás, ár, helység és álnév) nyilvánosan láthatók mindenki számára, de az elérhetőségedet és az előzményekhez kapcsolást csak a rendes tagok látják.`,
      },
      {
        id: 35,
        pitanje: `Hogyan védik az adataimat?`,
        odgovor: `Az adattakarékosság a rendszer négy alapelvének egyike — a platform csak a rendszer működéséhez szükséges adatokat gyűjti.

A megerősítés a megerősítési láncban zajlik: más rendes tagok személyes ismeretség alapján erősítik meg a valódiságodat, személyes iratok gyűjtése vagy benyújtása nélkül. A platform olyan technikai hozzájárulási és fiókazonosítási mechanizmust biztosít, amely nem gyűjt személyes adatot a megerősítettről.

Az esetleges személyes adatokhoz való hozzáférés minden adminisztrátori művelete tartós naplóban rögzül. Az Alapítvány nem oszt meg adatokat harmadik felekkel, kivéve az illetékes hatóság rendelkezésére.

Bármikor kérheted az összes adatod exportját JSON formátumban, vagy anonimizálhatod őket a fiók törlésével.`,
      },
      {
        id: 36,
        pitanje: `Hogyan lépek ki a rendszerből?`,
        odgovor: `A fiók törlése bármikor elérhető a profilbeállításokban.

A deaktiválás előtt kezdeményezheted a POEN-nyilvántartás frissítését egy másik felhasználó javára. A ZRNO-k a státusz megszűnésekor mind visszaíródnak a Protokollhoz — ez a visszaírás nem indít POEN-rögzítést. A megmaradt POEN szintén érvénytelenítésre kerül és visszaszáll a Protokollra.

A személyes adataid anonimizálódnak (az álnév semleges felhasználó-azonosítóvá válik), de a tranzakciók számszerű előzményei megmaradnak a rendszer matematikai helyességének megőrzése érdekében.

A közjó licencei alatt tett hozzájárulások (kód, nyílt felhasználásra licencelt tartalom) állandó feltüntetéssel bírnak.`,
      },
      {
        id: 37,
        pitanje: `Mi lesz a POEN-nel halál esetén — örökölhető?`,
        odgovor: `Nem. A POEN és a ZRNO nem örökölhető vagyon, és nem az Alapítvánnyal szembeni követelés.

A felhasználó halála esetén a fiók inaktiválódik, a POEN és a ZRNO visszaszáll a Protokollra. Az örökösöknek, a családnak és harmadik személyeknek nincs rájuk vagyoni joguk.

Ez lényegi különbség a POEN és a pénzügyi vagyon között, és egyike azoknak az okoknak, amelyek miatt a POEN jogi értelemben nem „pénz".`,
      },
      {
        id: 55,
        pitanje: `Használhatom a rendszert név és telefonszám nélkül? Mit veszítek?`,
        odgovor: `Igen, használhatod. A regisztrációkor csak az álnév (az általad választott felhasználónév), az e-mail-cím és a jelszó kötelező — semmi más.

A valódi név és a telefonszám teljesen önkéntes. Nem feltétele sem a megerősítési láncon keresztüli megerősítésnek, sem a rendszer bármely funkciójához való hozzáférésnek. Az Alapítvány nem vezet olyan nyilvántartást, amely az álnevedet a személyazonosságodhoz kapcsolná.

Mit veszítesz, ha nem adod meg őket? Gyakorlatilag csak a másokkal való könnyebb kapcsolatfelvételt. A csere terén (Piac) például e nélkül nehezebben tudnak megkeresni és személyes cserét egyeztetni veled.

Ha mégis megadod őket, magad döntöd el, láthatóak lesznek-e a neved és a telefonszámod a rendes tagok számára — és ezt a megosztást bármikor visszavonhatod, ami után az adatok többé nem jelennek meg mások előtt.

Az e-mail-címed soha nem nyilvános, függetlenül mindentől.`,
      },
      {
        id: 56,
        pitanje: `Deanonimizálhat-e valaki az összegek, az időpontok és a tranzakciók gyakoriságának összevetésével?`,
        odgovor: `Igen. Az álnevesség nem ugyanaz, mint a névtelenség.

A tranzakcióid álnév alatt szerepelnek a nyilvántartásban, nem a neveden. De az összegek, az időpontok és a nyilvántartás-frissítések gyakoriságának együttese bizonyos esetekben közvetve utalhat arra, ki vagy — különösen kis településen, ahol az emberek ismerik egymást. A regisztrációval elfogadod, hogy az álnevesített nyilvántartás nyilvánossága be van építve a rendszerbe, és nem kapcsolható ki.

Több dolog mégis véd téged:

Az Alapítvány nem vezet olyan táblázatot, amely az álnevet a személyazonosságodhoz kötné — ez a kapcsolat egyszerűen nincs a birtokunkban. A valódi neved és a telefonszámod önkéntes; magad döntöd el, felfeded-e őket és kinek (csak megerősítetteknek), és a megosztás bármikor visszavonható.

A láthatóság fokozatos: a nem regisztráltak csak összesített adatokat látnak, az egyedi tranzakciókat álnevekkel pedig csak a rendes tagok. Az e-mail, a technikai naplók és a megerősítési hálózat soha nem nyilvános.

Azért is te felelsz, hogy az álneved ne tartalmazzon olyan személyes adatot, amely elárul téged.

Ez az álnevesített rendszerek ismert korlátja. Elkülönítjük az azonosító és az elszámolási adatokat, és nem tartunk fenn központi kapcsolatot közöttük, de az összekapcsolásos támadások elleni további technikai intézkedések még nincsenek külön kidolgozva — ha kis településen használod a rendszert, tartsd ezt szem előtt.`,
      },
      {
        id: 73,
        pitanje: `Megerősíttethetem magam távolról, külföldről?`,
        odgovor: `Igen. A megerősítés (valóságigazolás) közvetlen személyes ismeretségen alapul — olyan rendes tag, aki személyesen ismer téged, megerősíti a valódiságodat, és saját felelősségére felel ezért a megerősítésért. A Szabályzat nem követeli meg a fizikai jelenlétet a megerősítés pillanatában, így az távolról is elvégezhető, amíg a megerősítő valóban eléggé ismer téged ahhoz, hogy megerősítse a valódiságodat.

A rendszer védelme nem azon nyugszik, hogy egy helyiségben vagytok, hanem a személyes ismeretségen, a megerősítő felelősségén (a hamis megerősítés a megerősítések megsemmisítését és szankciókat von maga után) és a hálózat szerkezetén — a teljes valóságindex eléréséhez a hálózat több független részéből származó embereknek kell ismerniük téged.

Ezért nem vagy kizárva, ha külföldön vagy: regisztrálhatsz, választhatsz álnevet és követheted a rendszert, a funkciók teljes elérése pedig akkor nyílik meg, amint valaki, aki ismer téged, megerősít — akár személyesen, akár távolról.

Az állampolgárság nem feltétel — az számít, hogy valós személy legyél.`,
      },
      {
        id: 78,
        pitanje: `Hol vannak a szerverek, és átlépik-e az adataim Szerbia határát?`,
        odgovor: `A platformot elismert infrastruktúra-szolgáltatóknál üzemeltetjük, amelyek szerverei az Európai Unióban és az Amerikai Egyesült Államokban találhatók. Ez azt jelenti, hogy az adataidat Szerbián kívül is kezelhetik.

Az ilyen továbbítás megengedett, és a személyes adatok védelméről szóló törvény rendezi. Az Alapítvány megfelelő védelmi intézkedéseket biztosít — általános szerződési feltételeket vagy más jogalapot, amely a hazaival összemérhető védelmi szintet garantál —, és a szolgáltatókat a szerverek elhelyezkedésére és joghatóságuk jogi keretére figyelemmel választja ki.

Függetlenül attól, hol vannak fizikailag a szerverek, ugyanazok a technikai intézkedések érvényesek: az adatok titkosítása átvitel közben és tárolt állapotban, az azonosító és az elszámolási adatok szétválasztása, valamint a szükséges minimum elvén alapuló hozzáférés.

A jogaid — hozzáférés, helyesbítés, törlés, adathordozhatóság és panasz a Biztosnál — a szerverek elhelyezkedésétől függetlenül ugyanazok maradnak.`,
      },
    ],
  },
];
