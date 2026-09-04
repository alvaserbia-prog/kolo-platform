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

Megerősítést csak az adhat, akinek magának is van valóságigazolása, és mindig közvetlen személyes ismeretség alapján — soha nem pusztán a platformon küldött üzenet alapján.

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

Mások megerősítése. Amikor megerősítesz valakit, akit valóban ismersz, 1.000-1.000 POEN rögzül neked is, neki is — személyenként egyszer. Csak azt erősíted meg, hogy ez a személy létezik, és nincs másik fiókja, ezért megerősítést kizárólag olyan emberekre adj, akiket tényleg ismersz.

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

Adj fel egy hirdetést, amellyel kínálsz valamit — az első ilyen hirdetés 1.000 POEN-t hoz neked a cseréhez való hozzájárulás csatornáján. A hirdetésnek címet, leírást, fényképet, kategóriát és helységet kell tartalmaznia. A hirdetés azonnal felkerül a Piacra, a POEN pedig akkor rögzül neked, amikor az Alapítvány jóváhagyja a hirdetést. A cseréhez való hozzájárulás fiókonként egyszer nyílik meg, és nem ismétlődik.

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

Ha a csere meghiúsul. Jelentsd az esetet az Alapítványnak — a gomb magánál az átírásnál van, a POEN-előzményeidben. Az átírás nem visszafordíthatatlan: ha az Alapítvány a bejelentésed alapján érvényteleníti, a teljes összeg visszakerül hozzád, akkor is, ha a másik fél nyilvántartása ezzel mínuszba megy. A döntés az Alapítványé, tehát a bejelentés nem automatikus visszatérítés.

A minőségért, a teljesítésért és a megállapodás betartásáért te felelsz a másik féllel együtt, a kötelmi jog általános szabályai szerint; az Alapítvány és a Protokoll nem részese ennek a viszonynak. A kezdeti szakaszban kérheted az Alapítvány önkéntes közvetítését is — az nem kötelező erejű, de gyakran elegendő.

A legjobb, ha személyesen találkoztok, és a cserét szemtől szemben bonyolítjátok le. Így csökken a kockázat, és megszületik az az ismeretség is, amelyből megerősítés jöhet.`,
      },
      {
        id: 83,
        pitanje: `Hány hirdetést adhatok fel megerősítés előtt?`,
        odgovor: `Három aktív hirdetést, és csak ajánlatot — olyasmit, amit kínálsz. Az első ilyen hirdetés 1.000 POEN-t hoz neked: a hirdetés azonnal fent van a Piacon, a POEN pedig akkor rögzül, amikor az Alapítvány jóváhagyja.

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
        pitanje: `Mi az a POEN, és van-e pénzben kifejezett értéke?`,
        odgovor: `A POEN a Protokoll nyilvántartásában szereplő bejegyzés arról, hogy értékeset adtál a közösségnek — más tagokkal folytatott csere, a valóság megerősítése, működési hozzájárulás, szociális program, adomány vagy patronálás útján.

A POEN csak a Protokollban létezik. A bejegyzést a Protokoll vezeti, és nem vihető ki a rendszerből — a POEN-nek nincs olyan formája, amelyben azon kívül létezne. Nem tartod a kezedben, és nem adhatod át senkinek a KOLO-n kívül.

A POEN nem pénz. Nem fizetőeszköz, nem elektronikus pénz, nem digitális vagyon, nem pénzügyi eszköz, és nem az Alapítvány feléd fennálló tartozása. A rendszeren kívül nincs értéke: nem váltható dinárra, nem adható tovább, és az Alapítvány nem vásárolja vissza.

Van-e akkor pénzben kifejezett értéke? Árfolyam nincs. De hogy te és a másik fél meg tudjatok állapodni abban, mi mennyit ér, a rendszerben az összegeket olyan arányban fejezzük ki, amelyben 1 POEN 1 dinárnak felel meg. Ez a rendszeren belüli összehasonlítás mérőskálája — ahogy a súlyt kilogrammban fejezed ki —, nem pedig árfolyam, amelyen valamit pénzre váltanak. Az Alapítvány a POEN semmilyen értékét nem szavatolja.`,
      },
      {
        id: 2,
        pitanje: `Készpénzre válthatom vagy eladhatom a POEN-t?`,
        odgovor: `Nem. A POEN nem váltható dinárra, külföldi valutára, sem semmilyen más fizetőeszközre. Az Alapítvány nem vásárolja vissza és nem váltja be.

A POEN a Protokollon kívül nem is létezik — nincs olyan formája, amelyben kiléphetne a rendszerből.

Amit megtehetsz: átírhatod egy másik tagnak egy lebonyolított javak-, szolgáltatás- vagy tudáscseréért — a Piacot is beleértve —, vagy ZRNO-t jegyezhetsz be vele.

A POEN pénzért való eladása nem része a rendszernek. A POEN-nek nincs ára, és nincs olyan csatorna, amelyen keresztül az Alapítvány egy ilyen megállapodást elismerne, nyilvántartana vagy védene. Aki így jár el, azt a rendszeren kívül és saját felelősségére teszi — és minden átírás tartósan rögzítve marad a nyilvántartásban.`,
      },
      {
        id: 3,
        pitanje: `Lejár-e a POEN?`,
        odgovor: `Nem. A POEN a nyilvántartásodban marad, amíg át nem írod egy másik tagnak, vagy amíg nem törlöd a fiókodat.

A lejárat nincs örökre kizárva: a POEN „öregedésének" mechanizmusa, amely a felhalmozás helyett a forgást ösztönözné, a rendszer lényegi módosítása lenne. Erről a Felső Kolo döntene szavazással — az Alapítvány ezt önmagában nem vezetheti be.`,
      },
      {
        id: 4,
        pitanje: `Mi az a ZRNO, és mire való?`,
        odgovor: `A ZRNO a POEN-től elkülönült bejegyzés. Míg a POEN azt rögzíti, mit adtál a közösségnek, a ZRNO azt mutatja, ebből mennyit fektettél vissza bele — és ebből a részesedésből ered a szavad a rendszer szabályairól szóló döntésekben.

Hogyan szerezhető. A ZRNO-t a már meglévő POEN-eddel jegyzed be. Hogy egy ZRNO hány POEN-be kerül, azt a koefficiens mutatja. A ZRNO le is írható.

Hogyan ad szavazatot. A bejegyzett ZRNO-t lezárod, hogy aktívvá váljon — csak az aktív ZRNO hordoz szavazóerőt. A szavazat nem egyenes vonalban nő: a szavazatok száma az aktív ZRNO-k négyzetgyöke, így akinek százszor több ZRNO-ja van, annak tízszer több szavazata van, nem százszor. Így senki nem veheti át a döntéshozatalt felhalmozással.

Mi nem a ZRNO. Nem üzletrész, nem részvény, nem digitális vagyon, nem pénzügyi eszköz. Nem hoz kamatot és osztalékot, senki nem fizet ki rá semmit, és nem írható át másik tagnak. Azt mutatja, mennyit fektettél a közösségbe, nem azt, hogy az mennyivel tartozik neked.`,
      },
      {
        id: 5,
        pitanje: `Mi a helyzet az adóval és a nyugtaadással?`,
        odgovor: `Az Alapítvány nem számol el helyetted adót, és nem állít ki a nevedben adóügyi nyugtát. A POEN nem pénz és nem törvényes fizetőeszköz, a POEN átírása pedig nem pénzforgalmi művelet a pénzforgalmi szolgáltatásokra vonatkozó szabályok értelmében.

A POEN nem pénzbeli jövedelem. Nem kerül kifizetésre, nem váltható dinárra, és nem hagyhatja el a Protokollt. Az 1 POEN = 1 dinár arány a rendszeren belüli mérőskála, nem ár és nem árfolyam — a POEN-nek nincs piaca, amelyen a rendszeren kívüli érték kialakulna.

De a KOLO nem szünteti meg a meglévő kötelezettségeidet. Ha alkalmanként továbbadod a feleslegedet vagy segítesz valakinek, semmi nem változik. Ha áruk értékesítéséből vagy szolgáltatásnyújtásból élsz, ugyanazok a szabályok érvényesek, mint a KOLO-n kívül — függetlenül attól, hogy a megállapodás POEN-ben van-e rögzítve.

Az Alapítvány nem ad adótanácsot, és a saját adókötelezettségeidért te felelsz. Ha rendszeresen nyújtasz árut vagy szolgáltatást, kérj tanácsot könyvelőtől.`,
      },
      {
        id: 38,
        pitanje: `Mit jelent a két különálló aktus elve?`,
        odgovor: `Azt jelenti, hogy a POEN sohasem ellenszolgáltatás azért, amit adtál. Ez két különálló esemény, nem csere.

Első aktus — teszel valamit. Hozzájárulsz a közös jóhoz, vagy olyan státuszod van, amelyet a rendszer elismer: adományozol, elvégzel egy működési hozzájárulási feladatot, megerősíted egy új tag valódiságát, megfelelsz egy szociális program feltételeinek, vagy patronálási kérelmet nyújtasz be.

Második aktus — a Protokoll POEN-t rögzít. Automatikusan, a Szabályzatban előre lefektetett szabály szerint. Bárki döntése nélkül, szerződés nélkül és ellenszolgáltatás nélkül.

Miért fontos ez. A két aktus között nincs szerződés. Nincs olyan megállapodás, amely szerint X elvégzéséért Y POEN járna, és nincs követelésed az Alapítvánnyal szemben arra, hogy POEN-t rögzítsen neked. Ezért az adomány nem POEN-vásárlás: azért adományozol, mert támogatni akarod a közösséget, a POEN pedig azért rögzül, mert a szabályok így szólnak — nem azért, mert kifizetted.`,
      },
      {
        id: 40,
        pitanje: `Valamiféle piramisjáték vagy kripto ez?`,
        odgovor: `Egyik sem.

Miért nem piramisjáték. A piramisjáték úgy működik, hogy az új tagok fizetnek, hogy a korábbiak keressenek. A KOLO-ban a belépés ingyenes, a POEN nem vásárolható pénzért, és nincs alattad szint. Amikor megerősítesz valakit, 1.000-1.000 POEN rögzül neked is, neki is — egyszeri alkalommal és mindkettőtöknek azonos összegben. Abból, amit az illető később csinál, neked semmi nem jár; mások hozzájárulásaiból nincs jutalék.

Miért nem kripto. A kriptovaluta blokklánc-hálózaton létezik, piaci ára van, és tőzsdén adják-veszik. A POEN nem token, a Protokollon kívül nem létezik, nem váltható dinárra, és nincs piaci ára.

Honnan jön a POEN. Senki nem rögzíthet magának POEN-t. Csak úgy keletkezik, hogy a Protokoll előre lefektetett szabály szerint rögzíti, és minden rögzített POEN-nek ugyanakkora mínusza van a Protokoll nyilvántartásában. Ezért a forgalomban lévő POEN mennyisége mindig pontosan egyenlő a rögzített hozzájárulások összegével — semmi nem keletkezik a semmiből.

A POEN annak bejegyzése, mit adtál a közösségnek, közelebb áll egy könyvelési tételhez, mint a pénzhez. Az érték a munkát, javakat és tudást cserélő emberek hálózatában van, nem a spekulációban.`,
      },
      {
        id: 51,
        pitanje: `Mi van, ha a rendszer megbukik vagy az Alapítvány megszűnik — mindent elveszítek?`,
        odgovor: `Legyünk őszinték: ha a rendszer egy nap megáll, a nyilvántartásod megszűnik értéket jelenteni mint cserelehetőség. Ez veszteség. De nem pénzbeli veszteség, és íme, miért.

Nincs pénzbeli követelésed — sem most, sem akkor. A POEN és a ZRNO nem a nevedre álló pénz, és nem is az Alapítvány feléd fennálló tartozása. Ezek bejegyzések arról, mennyit járultál hozzá és mennyit cseréltél a közösségben. Ezért nincs olyan összeg, amellyel bárki tartozna neked — sem amíg a rendszer működik, sem ha megáll.

Amit már elcseréltél, a tiéd marad. A kézről kézre került munka, javak és tudás valóban megtörténtek, és ezeket senki nem érvényteleníti. Ugyanez áll azokra az emberekre is, akiket megismertél.

Az Alapítványból senki nem húzhat hasznot. Az Alapszabály szerint megszűnés esetén a megmaradt vagyon nem az alapítókat és nem is bárkit magánszemélyként illet, hanem azonos vagy hasonló célú másik alapítványnak, közhasznú alapítványnak vagy egyesületnek adják át, elsőbbséget adva azoknak, akik a szolidáris gazdaság szellemében dolgoznak. A rendszer megszüntetésével senki nem gazdagodhat.

A rendszer nélkülünk is folytatódhat. A kód, amelyen a KOLO fut, nyilvános és a GitHubon elérhető — bárki elviheti, elindíthatja és folytathatja. A szoftver AGPL-3.0 licenc alatt áll, a tartalom CC BY-SA alatt. Ha ez a konkrét szervezet eltűnik, az eszköz és a tudás megmarad. A közös jó nem szűnik meg egyetlen szervezet megszűnésével.`,
      },
      {
        id: 52,
        pitanje: `Mire jó az 1.000.000 ZRNO felső korlát, ha a ZRNO-val nem lehet kereskedni? Van staking vagy hozam?`,
        odgovor: `Mire jó a korlát. Összesen 1.000.000 ZRNO létezik, és ez a szám sem nem növelhető, sem nem csökkenthető. Így a döntéshozatal nem hígítható fel: senki nem hozhat létre utólag új ZRNO-t, és nem értéktelenítheti el azok szavazatát, akik már itt vannak. Minden bejegyzéssel csökken a Protokollban rendelkezésre álló ZRNO száma, így a koefficiens magasabb.

A ZRNO-val nem kereskednek. Nem írható át másik tagnak, és nem hagyja el a Protokollt. A közös jóban elfoglalt helyzetedet rögzíti, amelyből a Felső Kolóban való szavazatod ered.

A lezárás nem staking. A bejegyzett ZRNO-t csak azért zárod le, hogy a szavazatod beszámítson — csak az aktív ZRNO hordoz szavazóerőt. A lezárás nem hoz neked sem POEN-t, sem kamatot, sem semmilyen díjazást. A koefficiens ugyanúgy nő, akár le van zárva a ZRNO-d, akár szabad — a lezárással a szavazaton kívül semmit nem nyersz.

A leírás nem ugyanazt az összeget adja vissza — ezt is nyíltan megmondjuk. A leírás az adott pillanatban érvényes koefficiens szerint történik. Mivel a koefficiens a rendszerrel együtt nő, a leírásnál rendszerint több POEN-t kapsz, mint amennyit a bejegyzéskor beletettél. Ez a különbözet nem garantált, senki nem ígéri, és senki nem fizeti ki.

De ez nem jövedelem. A különbözet kizárólag POEN-ben áll fenn, amelynek a rendszeren kívül nincs értéke, nem váltható dinárra, és nem hagyhatja el a Protokollt. Nincs nyereséged és nincs pénzbeli jövedelmed — nagyobb bejegyzésed van a hozzájárulások nyilvántartásában. Ezért a ZRNO-t nem azért jegyzed be, mert megéri, hanem mert szavad akar lenni a döntésekben.`,
      },
      {
        id: 53,
        pitanje: `A megerősítéskor rögzülő 1.000 POEN toborzási jutalék vagy farmolható airdrop?`,
        odgovor: `Nem. Ez nem toborzási jutalék, nem airdrop, és nem farmolható.

A bejegyzés szimmetrikus. Amikor valaki megerősít téged, a Protokoll 1.000-1.000 POEN-t rögzít neked is, neki is — egyszeri alkalommal és azonos összegben. Nincs szint sem feletted, sem alattad, és semmi nem áramlik felfelé egy olyan hálózaton, amely a te megerősítésedből húzna hasznot.

A bejegyzés nem díjazás. Sem a munkádért, sem az adataidért. A Protokoll automatikus aktusa előre lefektetett szabály szerint: amint létrejön a megerősítés bejegyzése, a POEN szerződés és alkudozás nélkül rögzül.

Miért nincs értelme a farmolásnak:

• A POEN nem váltható készpénzre — nincs mit kivenni a rendszerből.

• Az elv: egy ember — egy fiók, a megerősítés pedig személyes ismeretségen nyugszik. Embereket nem lehet kitalálni.

• Aki olyasvalakit erősít meg, aki nem valódi személy, elveszíti azt az 1.000 POEN-t, visszaélés esetén pedig a mások megerősítéséhez való jogát és a hálózatban való részvétel jogát is.

• A cseréhez való hozzájárulás fiókonként egyszer nyílik meg, és nem ismétlődik.

• Minden rögzített POEN-nek ugyanakkora mínusza van a Protokollban — senki nem teremt értéket a semmiből.

A hamis megerősítés érvénytelenítésre kerül, és vele mindazok a kapcsolatok, amelyek belőle következtek.`,
      },
      {
        id: 54,
        pitanje: `Az alapítói csatorna akár 2.400.000 POEN-t rögzít az „alapítóknak" — nem a csúcs írja ez magának a pénzt?`,
        odgovor: `Nem. Az alapítói csatorna nem pénzt rögzít — a POEN nem pénz, az összeg pedig sem tulajdont, sem hatalmat nem ad a rendszer felett.

Mit rögzít. A platform létezése előtt elvégzett munkát: a rendszer megtervezését, a szabályok megírását, a jogi és szervezeti előkészítést, a dokumentáció elkészítését. Ezzel együtt mindazokat a pénzügyi és egyéb költségeket, amelyek az Alapítvány számlájának megnyitásáig merültek fel — ezeket az alapítók személyesen viselték, mert az Alapítvány akkor még nem is létezett olyan jogalanyként, amely fizethetett volna. Mindez akkor zajlott, amikor nem volt hol rögzíteni, ezért utólag rögzül — mint minden más hozzájárulás.

Ugyanaz a státusz, mint bármely más POEN-é. Nem konvertálható, a rendszeren kívül értéktelen, az Alapítvánnyal szemben követelést nem alapoz meg. A költségeket nem térítik meg: az alapítók egyetlen dinárt sem kaptak vissza abból, amit beletettek, hanem bejegyzést ugyanabban a nyilvántartásban, amelyben minden más hozzájárulás is szerepel.

Öt alapító van, és a kör zárt. Előre meghatározta őket az Alapítvány belső aktusa, és semmilyen későbbi döntés nem bővítheti ezt a kört.

A tempó nem önkényes. Egy 24.000 POEN-es lépés csak akkor rögzül, amikor a rendszerben lévő POEN összmennyisége újabb 100.000-rel nő — és ebbe a küszöbbe maga az alapítói bejegyzés is beleszámít. Ez azt jelenti, hogy amíg a csatorna tart, az alapítói hozzájárulás minden újonnan rögzített POEN 24%-át teszi ki. Mire a csatorna kimerül 2.400.000-nél, a rendszer 10.000.000 POEN-nel nőtt, a csatorna pedig véglegesen és visszavonhatatlanul bezárul. Onnantól az alapítók részesedése csak csökken, mert a rendszer tovább nő, a csatorna viszont már nem működik.

A nagyobb egyenleg nem ad arányosan több hatalmat. A Felső Koloban a szavazás négyzetes: a szavazatok száma az aktív ZRNO-k négyzetgyöke. Akinek százszor több ZRNO-ja van, annak tízszer több szavazata van, nem százszor — így a legnagyobb POEN-egyenleg sem ad ellenőrzést a döntések felett.

Mit ellenőrizhetsz. A rögzített teljes összeg, a végrehajtott lépések száma és a korlátig hátralévő rész az Alapítói hozzájárulás oldalon elérhető. Az alapítók álnevekkel és részesedésekkel felsorolt jegyzéke — beleértve azt is, kinek mennyi került rögzítésre — a rendes tagok számára hozzáférhető.`,
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
        pitanje: `Hogyan kapok megerősítést, és mit nyerek vele?`,
        odgovor: `A megerősítés nem kötelező, de a fiók nélküle többnyire csak nézelődik. A legtöbb funkció csak az első megerősítéssel nyílik meg.

Hogyan szerezhető. A megerősítést olyan rendes tag adja, aki személyesen ismer téged, és aki ezzel a cselekedettel azt állítja, hogy valódi ember vagy. A kérést magad küldöd, a Megerősítés kérése gombbal. Az ismeretségnek nem kell réginek lennie: a lebonyolított cseréből született is elegendő.

Dokumentumot senkitől nem kérünk. Sem személyi igazolványt, sem útlevelet, sem személyi azonosító számot, sem fényképet. Aki megerősít téged, egyetlen adatodat sem viszi be; azt erősíti meg, amit tud.

Mi változik ezzel. Minden megerősítés 10 százalékponttal emeli a valóságindexedet. Összesen tízet kaphatsz, így a legmagasabb index 100%.

Már az első megerősítés, tehát a 10%-os index, megnyitja a fő funkciókat: a POEN rögzítését adományon és patronáláson keresztül, a ZRNO bejegyzését, a Programokban való részvételt, a teljes Piacot és a többi taggal folytatott kommunikációt. Ezzel rendes taggá válsz, és magad is megerősíthetsz másokat.

Mi rögzül. Amikor a megerősítés bejegyzésre kerül, a Protokoll 1.000 POEN-t rögzít neked és 1.000-et annak, aki megerősített. Ha a megerősítés felügyelet alá esik, az első felügyelő, aki rögzíti a kimenetelt, 500 POEN-t kap.

Miért ér valamit a megerősítés. Aki olyan személyt erősít meg, aki nem valódi, elveszíti azt az 1.000 POEN-t — és ha időközben elköltötte, pótlás marad a nyilvántartásán. Ezen felül szankció következik: elveszíti a jogot, hogy másokat megerősítsen, és — mivel a hamis megerősítést a Felhasználási feltételek kifejezetten súlyos jogsértésként nevezik meg — elveszíti a hálózatban való részvétel jogát is. A megerősítés ezért felelősséget hordoz más ember személyazonosságáért, és nem adják könnyelműen.`,
      },
      {
        id: 8,
        pitanje: `Mi van, ha külföldi vagyok — lehetek tag?`,
        odgovor: `Lehetsz. Az állampolgárság és a lakóhely nem feltétel, és sehol nem kerül rögzítésre. A regisztrációnál álnevet választasz, és megadsz egy e-mail-címet és egy jelszót; dokumentumot nem kérünk.

Az egyetlen valódi feltétel, hogy valaki megerősítsen téged valódi emberként, és ez a valaki bárhol lehet. Ha a hálózatban még senkit nem ismersz, a lebonyolított cseréből született ismeretség is teljes értékű alap a megerősítéshez.

A Szabályzat, a Felhasználási feltételek és a többi kötelező erejű aktus szerb nyelven került elfogadásra, és az a változat az irányadó. A fordítások az olvasó segítésére szolgálnak.`,
      },
      {
        id: 9,
        pitanje: `Lehet több fiókom vagy több álnevem?`,
        odgovor: `Nem. A szabály: egy ember — egy fiók, és ez a használat feltétele. Aki második fiókot nyit, kizárható a rendszerből.

A második fióknak többnyire azelőtt sincs értelme, hogy bárki észrevenné. A megerősítés nélküli fiók szinte semmit nem csinál, a megerősítést pedig olyan ember adja, aki azt állítja, hogy személyesen ismer téged, és aki a valótlan megerősítésért felel.

Az a fiók, amelyet a szülő nyit a gyerekének, nem kivétel e szabály alól.

Az álnév egy van, és a többi tag ez alatt lát téged. A megváltoztatásáról a következő kérdésben.`,
      },
      {
        id: 10,
        pitanje: `Megváltoztathatom az álnevemet?`,
        odgovor: `Megváltoztathatod, legfeljebb harmincnaponta egyszer.

A változás azonnal érvényes. Amint megerősíted, a teljes fiókod új álnéven jelenik meg a többiek számára, az előzményekkel együtt; a régi már nem látszik.

Az álnév tartalmazhat latin betűket, számjegyeket és a _ . - jeleket, szóköz nélkül, valamint a č, ć, š, ž és đ betűk nélkül. Latin betűs marad akkor is, ha az oldalt cirill betűkkel olvasod. Ott áll a profilod címében is.

A korábban megosztott hivatkozások továbbra is működnek: a régi cím a változás után is a profilodra vezet, az elhagyott álnevet pedig más nem veheti el — különben egy már megosztott hivatkozás csendben más emberhez vezetne.

Maga a fiók ezzel nem változik: a megerősítési lánc, a valóságindex és a hozzájárulások nyilvántartása ugyanaz marad, mert csak az a név változott, amely alatt látszanak.`,
      },
      {
        id: 75,
        pitanje: `Milyen nyelven működik a rendszer?`,
        odgovor: `A honlap és az alkalmazás öt nyelven működik: szerbül, angolul, oroszul, horvátul és magyarul. A szerb olvasható latin vagy cirill betűkkel. Mindkettőt a fejlécben lévő kapcsolóval választod ki, és bármikor módosítható.

A Szabályzat, a Felhasználási feltételek és a többi kötelező erejű aktus szerb nyelven került elfogadásra, és az a változat az irányadó. A többi nyelvre készült fordítások nem hivatalos segítségként szolgálnak az olvasónak; ha valahol eltérnek a szerb szövegtől, a szerb az irányadó.`,
      },
    ],
  },
  {
    id: "deca",
    naslov: "Gyerekek és szülők",
    pitanja: [
      {
        id: 84,
        pitanje: `Regisztrálhatnak-e kiskorúak?`,
        odgovor: `Igen, hét éves kortól, de nem teljesen önállóan. A kiskorú fiókja mindig szülő mellett áll: vagy a szülő nyitja meg a saját fiókjából, vagy a gyerek nyitja meg és megadja a szülő e-mail-címét, a szülő pedig átveszi a fiókot.

A hét évnél fiatalabb gyereknek nincs fiókja. Ha a gyerek tévedésből a felnőtt űrlapon ment végig, a fiók nem törlődik — kérésre az Alapítvány gyerekfiókká alakítja és szülőhöz köti.

Minden egyéb a gyerekfiókokról a Gyerekek és szülők szakaszban áll.`,
      },
      {
        id: 85,
        pitanje: `Hány éves kortól lehet a gyereknek fiókja, és hogyan nyílik meg?`,
        odgovor: `Az alsó határ hét év. A fiók kétféleképpen nyitható meg.

Az első: te nyitod meg a saját fiókodból. A fiók azonnal működik, és te felelsz azért, amit a gyerek közzétesz.

A második: a gyerek maga nyitja meg, és megadja a te e-mail-címedet. Ekkor üzenet érkezik hozzád, amelyben átveheted a fiókot, jelezheted, hogy nem a te gyereked, vagy törölheted a fiókot. Az utóbbi két művelet a platformra való belépés nélkül is elvégezhető, mert a címedet bárki beírhatja. Az üzenetben csak a gyerek álneve szerepel, név soha.

Az üzenetben lévő hivatkozás hét napig érvényes. Ha a fiókot tizennégy napon belül senki nem veszi át, törlődik. Ha az üzenet nem érkezett meg, a gyereknek a profiljában van egy hatjegyű kód, amelyet a hivatkozás helyett megadhatsz.

A születési dátumot te írod be, az átvételkor. Ellenőrizd megerősítés előtt, mert a beírás után nem módosítható, és tőle függ, mikor válik a fiók nagykorúvá.

Amíg átvételre vár, a gyereknek van profilja és köthet barátságokat, de nincs Csevegőszobája, üzenetei és hirdetései. Az átvétel után mindez működik.`,
      },
      {
        id: 101,
        pitanje: `A gyerek nagykorúként regisztrált — helyre lehet ezt hozni?`,
        odgovor: `Igen. A fiók nem törlődik: kérésre az Alapítvány gyerekfiókká alakítja, és hozzád köti mint szülőhöz. Írj nekünk a kontakt@ekolo.rs címre a fiókodhoz tartozó címről, és add meg a gyerek álnevét.

A fiók így megkapja a gyerekrend minden védelmét — zárt profil, a te kapcsolót a nagykorú tagokkal való érintkezésre és cserére, barátságok és a gyerekek csevegőszobája. Elveszíti azt, ami e rend szerint gyereket nem illet meg: a kapott és adott megerősítések elesnek, a ZRNO leírásra kerül, és a POEN, amelyet a Protokoll a csatornákon keresztül jegyzett fel neki (megerősítések, tartalomhoz és cseréhez való hozzájárulás, adományok, programok), semmissé válik. A POEN, amelyet mások írtak át rá, megmarad — az átírás nem hoz létre új POEN-t, hanem a bejegyzést mozgatja, és gyerek is birtokolhatja. A hirdetések, üzenetek és az előzmények megmaradnak.

A bejegyzés eközben mínuszba mehet, mégpedig mindkét oldalon: a gyereknél, aki a POEN-t már elköltötte, és annál is, aki megerősítette őt, és akinek most ez a megerősítése semmissé válik. A mínusz nem tartozás, és nem hajtják be — az első beérkező POEN feltölti.

A lépés visszafordíthatatlan. Nagykorú fiókká magától válik, a tizennyolcadik születésnap napján, az akkor megadott születési dátum szerint.`,
      },
      {
        id: 86,
        pitanje: `Nem vagyok a KOLO tagja. Átvehetem a gyerekem fiókját?`,
        odgovor: `Átveheted. Az eljárás három lépésből áll.

1. Nyisd meg a saját fiókodat. Az üzenetben lévő hivatkozás egyenesen a regisztrációhoz vezet.

2. Vedd át a gyereket. Ettől a pillanattól a gyereknek minden működik: a Csevegőszoba, az üzenetek, a hirdetések és a barátságok. Te és a gyerek ettől kezdve átírtok egymásnak POEN-t.

3. Kérd meg azt, aki személyesen ismer, hogy erősítsen meg téged. A megerősítést a saját fiókodból kéred, és egy is elég.

A harmadik lépésig a gyereknek nem rögzül POEN a barátságokból. A barátságok addig is létrejönnek és rögzülnek, a bejegyzés pedig azon a napon hajtódik végre, amikor rendes taggá válsz.`,
      },
      {
        id: 100,
        pitanje: `A gyerek elfelejtette a jelszavát — most mi lesz?`,
        odgovor: `Két út van.

Ha a gyerek megadta a profiljában a saját e-mail-címét, és megerősítette az arra a címre küldött hivatkozásra kattintva, egyszerűen új jelszót kér, mint bármely más tag. Ez a cím kizárólag erre szolgál — értesítéseket nem küldünk rá.

Ha a gyereknek nincs saját címe, az új jelszót te állítod be a saját profilodból. A régit nem kell tudnod, a gyerek pedig értesítést kap arról, hogy megváltoztattad.`,
      },
      {
        id: 87,
        pitanje: `Mindkét szülőnek lehet hozzáférése?`,
        odgovor: `Lehet. A második szülő ugyanazon az úton lép be, mint az első, és ugyanazokat a jogosultságokat kapja: ugyanazt a betekintést, ugyanazt a törlést és ugyanazokat a kapcsolókat. Ez azt is jelenti, hogy kettejük közül bármelyik egyedül törölheti a gyerek fiókját.

A gyereknek elég, ha az egyik szülő rendes tag, hogy POEN rögzüljön neki.`,
      },
      {
        id: 88,
        pitanje: `Megközelítheti-e felnőtt a gyerekemet?`,
        odgovor: `A beállításaidtól függetlenül a következő érvényes. A gyerek profilját be nem jelentkezett látogató nem látja. A gyerek nem jelenik meg sem a hírfolyamban, sem a tagkeresésben. Barátság kizárólag QR-kód személyes beolvasásával jön létre, a kód öt percig él, és nincs olyan száma, amelyet telefonon be lehetne diktálni, így barátság távolról nem köthető.

A felnőttekkel folytatott beszélgetést kizárólag a gyerek profiljában lévő szülői kapcsoló nyitja meg. Amíg ki van kapcsolva, felnőtt nem írhat a gyereknek.

Ha bekapcsolod, három szabály érvényes:

• te olvasod azt a beszélgetést, de nem írsz bele;

• a nagykorú beszélgetőpartner számára látható felirat jelzi, hogy a beszélgetést szülő olvassa;

• értesítés az új beszélgetés első megkeresésekor érkezik hozzád, nem minden üzenetnél.

A gyerek más gyerekekkel folytatott beszélgetéseit nem olvasod. Erről a következő kérdésben.`,
      },
      {
        id: 89,
        pitanje: `Mit látok a gyerekem fiókjából?`,
        odgovor: `A betekintésed kiterjed:

• a barátok listájára, a barátságkötés dátumaival;

• a beszélgetések listájára, tehát kivel és mennyit, az üzenetek tartalma nélkül;

• a POEN-átírások teljes előzményére;

• minden hirdetésre, amelyet a gyerek közzétett.

A gyerekek egymás közötti beszélgetéseit nem olvasod. Ennek oka, hogy minden ilyen beszélgetésben más gyereke is részt vesz, akinek a szülője a betekintéshez nem járult hozzá. Kivétel a gyerek és nagykorú személy beszélgetése, amelyet olvasol.

A barátságokat nem hagyod jóvá. Személyesen, kód beolvasásával jönnek létre, te pedig értesítést kapsz és látod a listát.

Bármikor eltávolíthatsz hirdetést, kikapcsolhatod a felnőttekkel folytatott beszélgetés kapcsolóját, és törölheted a fiókot.`,
      },
      {
        id: 90,
        pitanje: `Mi van, ha a gyerek nem megfelelő üzenetet kap?`,
        odgovor: `Mondd meg a gyereknek, hogy azonnal szóljon neked. Hozzád fordul először, nem a platformhoz.

A Csevegőben a gyerek csak a barátai üzeneteit látja. Ezért a leggyorsabb lépés a barátság felbontása — amint a gyerek felbontja, azokat az üzeneteket többé nem látja. Felbontani csak a gyerek tudja, és mindkét gyerek elveszít 500 POEN-t.

Ha az üzenetet látnunk kellene, írj nekünk a kontakt@ekolo.rs címre a gyerek álnevével és az üzenet idejével. Az Alapítvány el tudja távolítani az üzenetet, és le tudja zárni a fiókot, ahonnan küldték.`,
      },
      {
        id: 91,
        pitanje: `Felelek-e azért, amit a gyerek tesz?`,
        odgovor: `Igen. Azért, amit a gyerek a platformon közzétesz és tesz, te felelsz.

A felelősség arra terjed ki, ami nyilvános és amit láthatsz: a hirdetésekre, a POEN-átírásokra, a másokkal szembeni viselkedésre. Mindehhez van betekintésed és gombod is. Két gyerek magánbeszélgetése nem a te tereped, mert nem is csak a te gyerekedé.

Bármikor eltávolíthatsz hirdetést, kikapcsolhatod a felnőttekkel folytatott beszélgetést, vagy törölheted a fiókot.`,
      },
      {
        id: 92,
        pitanje: `Hogyan szerez a gyerek POEN-t?`,
        odgovor: `Háromféleképpen.

Barátság. Minden megkötött barátságért 500-500 POEN rögzül mindkét gyereknek. A bejegyzés megvárja, hogy mindkét fiók aktív legyen, a fiók pedig akkor aktív, ha legalább az egyik szülő rendes tag. Amíg vár, mindkettőjüknél a „500 függőben" felirat áll. Ugyanazon szülő két gyerekének barátsága a szokásos módon jön létre és látszik a Csevegőszobában, de POEN-t nem hoz.

Piac. A gyerek ugyanolyan feltételekkel ad fel hirdetéseket, mint a többi tag, és a cseréből származó POEN ugyanúgy rögzül neki.

Átírás a szülőtől. Te és a gyerek mindkét irányban átírtok egymásnak POEN-t, feltétel és korlát nélkül; elég, hogy átvetted a fiókot. Az átírás nem hoz létre új POEN-t, hanem a meglévőt mozgatja.

A POEN nem pénz, és a rendszeren kívül nincs értéke.`,
      },
      {
        id: 99,
        pitanje: `Mi az iskolaválasztás, és mit hoz a rangsor?`,
        odgovor: `A gyerek a profiljában kiválasztja az iskolát, amelybe jár, a szerbiai iskolák listájáról. A választás nem feltétele a fiók használatának — a fiók enélkül is működik.

A választásokból három lista áll össze: két országos — a részt vevő gyerekek száma szerint, illetve a beiratkozott tanulókhoz viszonyított arány szerint, külön az általános és a középiskolákra —, valamint egy az iskolán belül, a POEN aktuális állása szerint. A számításba csak az a gyerek kerül be, akinek legalább az egyik szülője rendes tag.

A listán elfoglalt hely nem hoz POEN-t. Sem az iskolaválasztás, sem az első hely, sem bármi más a listán. A lista megmutatja, ki hol áll, és ennél többet nem.

Az iskola legfeljebb harminc naponta egyszer változtatható. Az első beállítás nem változtatás, és nem indítja el ezt a határidőt. A korábbi választások előzménye nem marad meg, az iskola pedig a nagykorúsággal és a fiók megszüntetésekor törlődik.`,
      },
      {
        id: 93,
        pitanje: `Mi történik, ha egy barátság megszűnik?`,
        odgovor: `A barátságot csak gyerek bontja fel, a kettő közül bármelyik. Neked mint szülőnek ez a művelet nincs meg; marad a hirdetés eltávolítása, a felnőttekkel folytatott beszélgetés kapcsolója és a fiók törlése.

Felbontáskor 500-500 POEN íródik le mindkét oldalról — attól is, aki felbontja, és attól is, aki nem. A megerősítés előtt figyelmeztetés áll erről, így a felbontás nem történik véletlenül.

Ha ezt a POEN-t időközben elköltötték, a nyilvántartás mínuszba megy. Ez nem tartozás: semmit nem hajtanak be és nem követelnek vissza, az első beérkező POEN pedig feltölti.

Ha a gyerekek később újra barátságot kötnek, a POEN újra rögzül.`,
      },
      {
        id: 94,
        pitanje: `Mi történik a tizennyolcadik születésnapon?`,
        odgovor: `Az átmenetről egy hónappal korábban érkezik értesítés, a gyereknek és minden barátjának is. Magán a napon a következő történik.

Érvénytelenné válik a barátságokkal szerzett POEN, barátságonként 500, amelyeknél a bejegyzés végrehajtásra került. A harminc ilyen barátsággal rendelkező gyerek 15.000 POEN-t veszít. A leírás a másik oldalt is érinti: mindegyik barátnál 500 íródik le azért a barátságért, és ezért nekik is megy értesítés. A felbontáshoz hasonlóan a nyilvántartás mínuszba mehet, és ez nem tartozás.

A barátságok törlődnek. Helyüket a megerősítési lánc veszi át.

A szülők megerősítik a gyereket a megerősítési láncban, fejenként egy megerősítéssel, illetve eggyel, ha mindketten ugyanabban a láncban vannak. A fiók ezzel nagykorúvá válik és teljes hozzáférést kap.

A többi érintetlen marad: a POEN, amelyet a gyereknek átírtál, a Piacon folytatott cseréből származó POEN, a hirdetések és az előzmények megmaradnak.`,
      },
      {
        id: 95,
        pitanje: `Hogyan törlöm a gyerekem fiókját?`,
        odgovor: `A gyerek fiókját bármikor törölheted a saját fiókodból.

A törlés ugyanúgy hat, mint a barátság felbontása, csak egyszerre mindre. A törölt fiók minden barátjánál 500 POEN íródik le azért a barátságért. A felbontáshoz hasonlóan az ő nyilvántartásuk mínuszba mehet, és ez nem tartozás.

Ha a saját fiókodat törlöd, és a gyereknek nincs bejegyzett második szülője, a gyerek fiókja is törlődik, ugyanazzal a következménnyel a barátaira nézve. Ha van második szülő, a gyerek fiókja megmarad, és hozzá kötődik.

Ha olyan fiókról kaptál üzenetet, amelyet nem te nyitottál, és a gyerek nem a tiéd, abban az üzenetben két olyan művelet áll rendelkezésedre, amely nem igényel belépést a platformra: jelezni, hogy nem a te gyereked, és törölni a fiókot. A jelzés törlés nélkül meghagyja, hogy a fiók a határidő lejártáig továbbra is a te címedet használja, ezért a törlés biztonságosabb.

Az a fiók, amelyet senki nem vesz át, tizennégy nap múlva magától törlődik.

Minderről részletesebben a gyermekek részvételéről szóló szabályzat rendelkezik, a Szabályzat oldalon.`,
      },
    ],
  },
  {
    id: "programi",
    naslov: "A Protokoll programjai",
    pitanja: [
      {
        id: 16,
        pitanje: `Mik a Protokoll programjai, és melyek léteznek?`,
        odgovor: `A részvétel egyes formái nem rögzíthetők egyedi cserékként, ezért vannak rájuk a Protokoll programjai.

A szociális programok azokat a csoportokat fedik le, amelyek részvétele a közösségben állandó és szétszórt: Anyák Támogatása (és más elsődleges gondviselőké), Idősek Támogatása, Különleges Gondoskodás (fogyatékossággal élők) és Tanulás. Amint a kérelmedet megerősítik, a Protokoll napi szinten, automatikusan rögzít neked POEN-t, az egyes tevékenységek bejelentése nélkül. Ez nem szociális segély és nem juttatás — ez az a mód, ahogyan az ilyen részvétel is egyenrangú helyet kap a rendszerben.

Rajtuk kívül a Programokhoz tartoznak a hozzájárulások is: a cseréhez való hozzájárulás (ötlépcsős út a cserébe való bekapcsolódáshoz), a működési hozzájárulás (munka a közös jóért közzétett feladatokon keresztül) és a gyerekhozzájárulás (a gyerekek részvétele a gyerektérben, lásd a „Gyerekek és szülők" szakaszt). Mindegyiket külön kérdés magyarázza.

A szociális programokra a rendes tagok jelentkezhetnek.`,
      },
      {
        id: 17,
        pitanje: `Ki jelentkezhet az Anyák Támogatására?`,
        odgovor: `Az anya vagy a gyerek más elsődleges gondviselője — a program a gyerekről való gondoskodást követi, nem kizárólag az anyaságot.

Az összeg a gyerekek számától és korától függ: a gyerekenkénti alap csökken, ahogy a gyerek nő, a szorzó pedig minden további gyerekkel emelkedik, így a nagyobb családok arányosan nagyobb támogatást kapnak. A pontos összegek és példák az Anyák Támogatásának összegeiről szóló külön kérdésben szerepelnek.

A kérelem a platformon keresztül megy — a gyerekek adatait űrlapon adod meg, dokumentumok csatolása nélkül.`,
      },
      {
        id: 79,
        pitanje: `Naponta hány POEN-t hoz gyerekenként az Anyák Támogatása, és hogyan hat az összegre a gyerekek száma és kora?`,
        odgovor: `Minden gyerekre a kiinduló napi alap 2.000 POEN, csökkentve 100 POEN-nel a gyerek életkorának minden éve után — a támogatás fokozatosan csökken, ahogy a gyerek nő, és megszűnik, amikor a gyerek betölti a 20. évét.

A gyerekek száma növeli a teljes összeget, de nem egyszerű összeadással: minden további gyerek nagyobb szorzót hordoz. Az első gyerek ×1,00, a második ×1,20, a harmadik ×1,50, a negyedik ×2,00, az ötödik ×3,00, a hatodik ×4,50, a hetedik ×6,00, a nyolcadik ×8,00, a kilencedik ×10,00. Így a nagyobb családok arányosan nagyobb támogatást kapnak.

Példa: egy hároméves gyerek — (2.000 − 300) × 1,00 = 1.700 POEN naponta. Ugyanez a gyerek harmadikként — (2.000 − 300) × 1,50 = 2.550 POEN naponta.

A támogatás automatikusan, napi szinten rögzül, amíg a státusz tart, az egyes tevékenységek bejelentése nélkül. A többi szociális programhoz hasonlóan a közös napi keretet osztja, így a sok hozzájárulást hozó napokon az összegek arányosan csökkenhetnek. A paramétereket a támogatási programokról szóló szabályzat állapítja meg, és annak módosításával változtathatók.`,
      },
      {
        id: 61,
        pitanje: `Mi az „Idősek Támogatása" — ki jogosult és hogyan jelentkezem?`,
        odgovor: `Az Idősek Támogatása szociális program az 50 éves és idősebb tagoknak.

A napi összeg a korral nő: 1.000 POEN a betöltött 50. évtől, minden további évre 100 POEN-nel emelve — a 65 éves tagnak napi 2.500 POEN jár, a 80 évesnek napi 4.000 POEN.

A jelentkezés a platformon keresztül megy, és a rendes tagok előtt áll nyitva; a POEN ezután automatikusan rögzül, napi szinten, az egyes tevékenységek bejelentése nélkül. A többi szociális programhoz hasonlóan ez sem szociális segély és nem juttatás — a Protokoll ezzel ismeri el azt a részvételt, amely az egyedi cseréken keresztül nem látszik. A közelebbi feltételeket és az életkor igazolásának módját a támogatási programokról szóló szabályzat rendezi.`,
      },
      {
        id: 18,
        pitanje: `Mi a Különleges Gondoskodás és hogyan lehet jelentkezni?`,
        odgovor: `A Különleges Gondoskodás a fogyatékossággal élők programja.

A jelentkezéskor csak a rokkantsági határozatra vonatkozó adatot kérjük — nem orvosi dokumentációt, nem diagnózist, nem kórtörténetet. A lehető legkevesebbet vesszük el, mert érzékeny adatokról van szó, és még ez a kevés is kizárólag a kifejezett hozzájárulásoddal kerül feldolgozásra.

Az összeg fix, napi 2.000 POEN, amíg a státusz tart.`,
      },
      {
        id: 96,
        pitanje: `Mi a Tanulás program, és kikre vonatkozik?`,
        odgovor: `A Tanulás szociális program azoknak, akik tanulnak — az általános és középiskolai tanulóknak és a hallgatóknak.

A napi összeg fix, 2.000 POEN, amíg a státusz tart. A státuszt évente egyszer ellenőrzik; ha a felülvizsgálatkor nem igazolódik, a rögzítés megszűnik.

A jelentkezés ugyanazok szerint a szabályok szerint megy, mint a többi szociális programnál: a platformon keresztül, az adatok űrlapon való megadásával — ennél a programnál a beiratkozott osztállyal, illetve évfolyammal —, dokumentumok csatolása nélkül. Kiskorú tag esetén a kérelmet a szülő nyújtja be.`,
      },
      {
        id: 62,
        pitanje: `Mi a „státusz igazolása" a szociális programnál — be kell nyújtanom anyakönyvi kivonatot vagy a gyerek dokumentumát?`,
        odgovor: `Egyetlen dokumentumot sem nyújtasz be — semmit nem szkennelünk és nem küldünk.

Az adatokat a platform űrlapján adod meg: az Anyák Támogatásánál például a gyerek nevét és születési dátumát. A neked rögzülő összeg a gyerekek számától és korától függ.

A kérelmet ezután — a megadott adatok ismerete nélkül — a láncod tagjai erősítik meg, azok, akik a valódiságodat megerősítették, teljes felelősséggel, majd az Alapítvány hagyja jóvá. A megadott adatok nem nyilvánosak: csak az látja őket, aki a kérelmet feldolgozza. Érzékeny adatokról van szó, ezért kizárólag a kifejezett hozzájárulásoddal kerülnek feldolgozásra, a hozzájárulást pedig bármikor visszavonhatod — ekkor a POEN automatikus rögzítése is megszűnik.

A közelebbi feltételeket, amelyekkel az egyes csoportok státusza igazolható, a támogatási programokról szóló szabályzat rendezi, amely az oldalon közzé van téve.`,
      },
      {
        id: 20,
        pitanje: `Lehetek egyszerre több programban?`,
        odgovor: `Igen, ha több program feltételeinek is megfelelsz — az az anya, aki tanul, lehet az Anyák Támogatásában és a Tanulásban is. Minden programra külön kell jelentkezni.

A szociális programok és a működési hozzájárulás közös napi keretet osztanak, amely a rendszerben lévő POEN teljes mennyiségének 10%-a, hogy ne rögzüljön túl sok POEN egyszerre — ha több a hozzájárulás, mint amennyit a keret befogad, a napi összegek arányosan csökkennek. A cseréhez való hozzájárulás és a gyerekhozzájárulás nem tartozik ebbe a keretbe.`,
      },
      {
        id: 97,
        pitanje: `Mi a cseréhez való hozzájárulás, és hogyan lehet végigmenni az öt lépésen?`,
        odgovor: `A cseréhez való hozzájárulás ötlépcsős út, amelyen a Protokoll POEN-t rögzít a cserébe való tényleges bekapcsolódásért — lépésenként 1.000 POEN-t, összesen legfeljebb 5.000 POEN-t.

Első lépés: közzéteszed az első rendben lévő hirdetést, amellyel javakat vagy szolgáltatást kínálsz (új tagnál a POEN akkor rögzül, amikor az Alapítvány jóváhagyja a hirdetést). Második: először írsz POEN-t olyasvalakinek, aki az ismeretségi körödön kívül van. Harmadik: három közzétett hirdetésed van, amelyek közül kettő két különböző tagtól kapott érdeklődést. Negyedik: cserék öt különböző, az ismeretségi körödön kívüli emberrel. Ötödik: cserék tíz különböző emberrel.

A lépések sorrendben teljesülnek, a másodiktól kezdve pedig rendes tagnak kell lenned. Tranzakciónként legalább 1.000 POEN értékű cserék számítanak, az ismeretségi körödön kívüli rendes tagokkal, és minden ember egyszer számít az egész útra. Semmit nem kell bejelentened — a Protokoll maga követi az előrehaladást, és rögzíti a POEN-t, amint egy lépés teljesült.`,
      },
      {
        id: 19,
        pitanje: `Hogyan működik a működési hozzájárulás?`,
        odgovor: `A működési hozzájárulás azt a közös jóért végzett munkát rögzíti, amely különben láthatatlan maradna — az önkéntességet, az idősekről való gondoskodást, a közös tevékenységekben végzett munkát, az alkotó hozzájárulásokat.

Minden közzétett feladaton keresztül zajlik: valaki közzéteszi, egy rendes tag jelentkezik rá és elvégzi, a teljesítést megerősítik — és a Protokoll csak ekkor rögzít POEN-t. A kezdeti szakaszban a feladatokat az Alapítvány teszi közzé és a teljesítést is az erősíti meg; a közösségi irányítás aktiválása után feladatot a Felső Kolo és a ZRNO-tartók is közzétesznek, a teljesítést pedig ZRNO-tartók erősítik meg.

Órabér nincs. A feladat mellett javasolt POEN áll, de ez súlyozási iránymutató, nem ár — a ténylegesen rögzített összeg attól függ, hány hozzájárulás osztja aznap a közös napi keretet, így az összegek arányosan oszlanak el.`,
      },
      {
        id: 63,
        pitanje: `Van program a munkanélkülieknek vagy általános anyagi szükséghelyzetre?`,
        odgovor: `Jelenleg nincs külön program a munkanélküliségre vagy általános anyagi szükséghelyzetre.

A szociális programok pontosan meghatározott csoportokat fednek le, amelyek részvétele a közösségben állandó és szétszórt, ezért egyedi cseréken keresztül nem rögzíthető: az anyákat és az elsődleges gondviselőket, az időseket, a fogyatékossággal élőket és azokat, akik tanulnak. Sem a munkanélküliség, sem a szegénység nincs e csoportok között — a szociális programok nem szociális segélyek és nem juttatások, hanem azt szolgálják, hogy a szétszórt részvétel egyenrangú helyet kapjon a rendszerben, nem pedig az anyagi helyzet miatti támogatás formái.

Ha anyagi szükséghelyzetben vagy, a POEN-hez vezető út ugyanaz, mint mindenki másnak: javak és szolgáltatások cseréje másokkal, a cseréhez való hozzájárulás — a cserébe való bekapcsolódás öt lépése, amelyek együtt legfeljebb 5.000 POEN-t hoznak — és a működési hozzájárulás, vagyis munka a közös jóért közzétett feladatokon keresztül.

Új jogosult csoportok később hozzáadhatók: az első szakaszban erről az Alapítvány dönt, a közösségi irányítás aktiválása után pedig a Felső Kolo. Konkrét jövőbeli programok még nincsenek kidolgozva.`,
      },
      {
        id: 64,
        pitanje: `Munka ez? Van jövedelmem, szerződésem vagy garantált havi összegem?`,
        odgovor: `Nem. Ez nem munka munkaviszony értelmében, és garantált összeged sincs.

Te döntöd el, jelentkezel-e egy feladatra, hogyan végzed el és milyen ütemben — és bármikor visszaléphetsz, következmények nélkül. Senki nem parancsol neked, és nincs munkavégzési kötelezettséged. Ezért ez nem munkaviszony: nincs felettes, nincs munkavégzési kötelezettség, nincs bér.

Nincs olyan szerződés sem, amely szerint az elvégzett X-ért pontosan Y POEN rögzülne. A hozzájárulásod és a POEN rögzítése két különálló aktus: te hozzájárulsz, a Protokoll pedig ezt követően a szabályok szerint rögzít POEN-t. Ebből nem keletkezik követelés az Alapítvánnyal szemben — nincs kitől „behajtanod".

A POEN nem bér és nem díjazás. A közzétett feladat mellett javasolt POEN áll, de ez súlyozási iránymutató, nem garantált összeg: az, hogy mennyi rögzül ténylegesen, attól függ, hány hozzájárulás került aznap a közös napi keretbe, amely arányosan oszlik el. Ami aznap nem fér bele a keretbe, nem vihető át holnapra, és nem keletkeztet kötelezettséget a rendszer részéről feléd.

Ez a közösségnek nyújtott önkéntes hozzájárulás, amely rögzítésre kerül — nem pedig garantált havi keresettel járó munka.`,
      },
    ],
  },
  {
    id: "pijaca-donacije",
    naslov: "Piac, adományok és patrónusok",
    pitanja: [
      {
        id: 39,
        pitanje: `Adásvétel-e a Piacon zajló csere?`,
        odgovor: `A KOLO rendszer szabályzata szerint a javak és szolgáltatások tagok közötti cseréje a Piacon nem klasszikus adásvételként van felépítve. Két tag megállapodásáról van szó: az egyik javakat vagy szolgáltatást ad, a másik POEN-t ír át neki, a POEN pedig nem pénz, hanem a közös jóhoz való hozzájárulás nyilvántartása.

A POEN átírása ebben a cserében sem pénzbeli fizetés, sem fizetőeszköz a pénzforgalmi szolgáltatásokra vonatkozó szabályok értelmében. A cserével kapcsolatos viszonyokat — a teljesítést, a felelősséget, a kockázatot — a kötelmi jog általános szabályai rendezik; a Protokoll a cserében nem közvetít.

Ha a Piacon keresztül tevékenységet folytatsz, az általános szabályok szerinti adó- és számlaadási kötelezettségeid megmaradnak — itt semmi nem szünteti meg őket.`,
      },
      {
        id: 60,
        pitanje: `Hogyan határozom meg a termékeim árát és mennyiségét, és ki értékeli őket?`,
        odgovor: `A javaidért és szolgáltatásaidért járó POEN-összeget magad határozod meg, szabadon. A platform nem állapítja meg, nem korlátozza és nem ellenőrzi, és senki nem értékeli helyetted az árudat — te tudod a legjobban, mit kínálsz és mennyit ér.

Csak egy iránymutató van: egy POEN nagyjából egy dinárnak felel meg. Ez mérőskála, amely segít eligazodni az összeg meghatározásakor, de semmire nem kötelez, és nem hivatalos árfolyam.

Amit elvárunk, az a tisztesség: a javak vagy a szolgáltatás pontos és világos leírása, valós mennyiség és valós POEN-összeg, valamint a csere minden feltétele. Nem megengedett a hamis vagy megtévesztő tartalom, amely tévesen mutatja be a kínált dolog jellegét, minőségét vagy mennyiségét.

Minden mást — a szállítást, a határidőt, a további feltételeket — közvetlenül a másik féllel egyeztetsz.

Megjegyzés: ez a Piacon zajló cserére vonatkozik. A működési hozzájárulás más csatorna — ott az összeg nem szabad megállapodás, hanem javasolt POEN, súlyozási iránymutató a napi elosztásban.`,
      },
      {
        id: 41,
        pitanje: `Nyilvánosan látható-e a hirdetésem a Piacon?`,
        odgovor: `Igen. A hirdetés tartalma — a leírás, a POEN-összeg, a helység és az álneved — minden látogató számára látható, a nem regisztráltaknak is, hogy a csere elérhető és könnyen megtalálható legyen. Amíg új tag vagy, a hirdetés fényképén látható „Új tag" jelzés is áll.

Ami nem nyilvános: az elérhetőséged és az a lehetőség, hogy valaki írjon neked vagy cseréljen veled — ez csak a rendes tagoké. A nem regisztráltak és az új tagok számára a hirdetésen szereplő álneved nem vezet sem a profilodhoz, sem a tranzakciós előzményeidhez.`,
      },
      {
        id: 58,
        pitanje: `Cserélhetek a szomszédommal munkát munkáért vagy szerszámot terményért, egyetlen POEN nélkül (cserekereskedelem)?`,
        odgovor: `Cserélhetsz. A közvetlen cserekereskedelem — a te munkád az ő munkájáért, a te szerszámod az ő terményéért — magánmegállapodás közted és a szomszédod között, és a KOLO ezt nem tiltja.

Az ilyen csere a rendszeren kívül zajlik: ha mellé nem frissítitek a POEN-nyilvántartást, a személyes megállapodásotok marad, és sehol nem rögzül a te hozzájárulásodként.

Márpedig épp ez a KOLO értelme: hogy az a csere, amelyet amúgy is „kézből kézbe" bonyolítanátok, bejegyzést kapjon. Amikor a csere mellé frissítitek a nyilvántartást, a POEN átkerül annak a bejegyzéséről, aki a javakat vagy a szolgáltatást kapta, annak a bejegyzésére, aki adta — és nyoma marad, ki mennyit adott a közösségnek.

A minőségért, a szállításért és a megállapodás teljesítéséért ti ketten feleltek az általános szabályok szerint — az Alapítvány és a Protokoll ebbe nem avatkozik bele, és ezért nem felel.`,
      },
      {
        id: 21,
        pitanje: `Piac — ki felel, ha a csere nem sikerül?`,
        odgovor: `A Piacon zajló csere két tag közvetlen viszonya, és magánjogi természetű. Az Alapítvány és a Protokoll nem felel a minőségért, a szállításért, sem a kötelezettségek teljesítéséért — mindent a kötelmi jog általános szabályai rendeznek.

Ha a csere nem sikerül, először közvetlenül a másik féllel próbálkozz; a kezdeti szakaszban kérheted az Alapítvány önkéntes, nem kötelező erejű közvetítését, és rendelkezésre áll a bírói út is.`,
      },
      {
        id: 59,
        pitanje: `Ki felel, ha a munkának rejtett hibája van, az áru elromlik, vagy a vevő nem veszi át? Jótállás, reklamáció és a POEN visszatérítése?`,
        odgovor: `A minőségért, a hibátlanságért és a szállításért a cserélő tagok felelnek — az, aki a javakat vagy a szolgáltatást adja, és az, aki átveszi. Az Alapítvány és a Protokoll nem részese a cserének és nem közvetít benne; mindent a kötelmi jog általános szabályai rendeznek, mint bármely két ember közötti beszerzésnél.

A jótállást, a határidőt és a feltételeket közvetlenül a másik féllel egyezteted a csere előtt — minél világosabban állapodtok meg az áru állapotáról, a határidőről és arról, mi van, ha valami nem stimmel, annál könnyebben oldjátok meg a gondot később. Ha olyasvalakivel cserélsz, aki az árut vagy a szolgáltatást tevékenysége körében kínálja, a fogyasztóvédelmi jog is érvényes; két magánszemély között a kötelmi jog általános szabályai érvényesek.

A rendszerben nincs automatikus csere-visszavonás. Ha megállapodtok, hogy valami visszajár, az új, önkéntes POEN-nyilvántartás-frissítésként történik ellenkező irányban — mint új, visszafelé irányuló csere.

Ha valami rosszul sül el, először próbáld közvetlenül a másik féllel megoldani. A kezdeti szakaszban kérheted az Alapítvány önkéntes, nem kötelező erejű közvetítését is; ha nem születik megállapodás, marad a bírói út az általános szabályok szerint. Magánál az átírásnál, a POEN-előzményeidben ott a gomb is, amellyel az esetet bejelented az Alapítványnak — ha a bejelentés alapján érvényteleníti az átírást, a POEN teljes egészében visszakerül hozzád.`,
      },
      {
        id: 23,
        pitanje: `Hogyan működik az Alapítványnak nyújtott adomány, és mennyi POEN-t kapok?`,
        odgovor: `Adományt minden rendes tag adhat, dinárban történő befizetéssel az Alapítvány számlájára — közvetlenül vagy a platformon keresztül, ahol elérhető a bankkártyás fizetés és az IPS QR-kód is.

Amint a befizetés megerősítést nyer, a Protokoll POEN-t rögzít neked: az adomány összege × az adományok nyilvántartási koefficiense. A koefficiens az adományaid teljes (halmozott) összegével nő, 11 szinten át, 1,00-tól 2,00-ig (a legmagasabb szint 5.000.000 RSD halmozott összegnél). Amikor egy adománnyal átléped a küszöböt, az új szint koefficiense az egész adományra vonatkozik. Az elért szint tartós, és a POEN felhasználásával nem csökken. Az adományok nyilvántartási koefficiense sem nem „árfolyam", sem nem a ZRNO elszámolási koefficiense.

Az adomány visszavonhatatlan — ez a rendszer megváltoztathatatlan elveinek egyike. Az adományok az Alapítvány működésének alapköltségeit fedezik (szerver, eszközök, fejlesztés, jogász, könyvelés), és amint a bevételek meghaladják a működési költségeket, a többlet közösségi beszerzésekbe kerül.`,
      },
      {
        id: 74,
        pitanje: `Milyen pénznemben adományozok — küldhetek eurót külföldről?`,
        odgovor: `Küldhetsz — az adomány az Alapítvány számlájára történő befizetéssel adható, dinárban vagy más pénznemben, tehát euróban is külföldről. A platformon keresztüli bankkártyás fizetés és az IPS QR-kód csak dinárban működik.

A POEN ugyanazok szerint a szabályok szerint rögzül, mint bármely adománynál: összeg × az adományok nyilvántartási koefficiense, amely a halmozott összeggel nő 11 szinten át (részletesen az adományokról szóló kérdésben). A külföldi pénznemben lévő összeg a dináregyenértéken számít.

Kérésre az Alapítvány a törvénnyel összhangban igazolást állít ki az adományról.`,
      },
      {
        id: 24,
        pitanje: `Kik a Patrónusok, és miben különböznek az adományozóktól?`,
        odgovor: `A patrónusok jogi személyek és egyéni vállalkozók, akik az Alapítvány munkáját támogatják — nem csak pénzzel, hanem áruval vagy szolgáltatással is.

A patrónusnak nincs saját fiókja: a POEN-bónusz annak a tulajdonosnak vagy társtulajdonosnak a fiókjára rögzül, aki rendes tag, illetve magának az egyéni vállalkozónak, egy 7 szintből álló fix táblázat szerint (10.000-től 1.000.000 RSD-ig).

Minden patrónus nyilvánosan szerepel a Patrónusok oldalon — az átláthatóság és a hozzájárulás nyilvános elismerése végett.`,
      },
      {
        id: 25,
        pitanje: `Lehet-e egy cég közvetlen tag?`,
        odgovor: `Nem. Közvetlen tagok kizárólag természetes személyek lehetnek.

A cégek és az egyéni vállalkozók a Patronálás útján vesznek részt: támogatják az Alapítványt, a tulajdonos, a társtulajdonos vagy maga az egyéni vállalkozó pedig rendes tagként POEN-bónuszt kap.`,
      },
    ],
  },
  {
    id: "porezi-legalnost",
    naslov: "Adók és jogszerűség",
    pitanja: [
      {
        id: 47,
        pitanje: `Megerősítette-e bármelyik szabályozó (a Nemzeti Bank, az Adóhivatal, a Biztos), hogy ez jogszerű, vagy csak az Alapítvány állítja?`,
        odgovor: `Nem. Jelenleg nincs olyan írásos szabályozói állásfoglalás, amely a jogszerűséget megerősítené — sem a Nemzeti Bank, sem az Adóhivatal, sem a Biztos nem adott ki ilyen igazolást.

Amin a rendszer nyugszik, az nem valakinek az engedélye, hanem a saját jogi felépítése. A szabályok szerint a POEN nem pénz, nem valuta, nem elektronikus pénz, nem fizetőeszköz, nem pénzügyi eszköz és nem digitális vagyon, és nem alakítható át olyasmivé, aminek a rendszeren kívül értéke van. A POEN-nyilvántartás frissítése a tagok között nem pénzforgalmi művelet a pénzforgalmi szolgáltatásokra vonatkozó szabályok értelmében. Magára a javak és szolgáltatások cseréjére a kötelmi jog általános szabályai vonatkoznak, a jogvitákat pedig az illetékes bíróság tárgyalja. A rendszer jogi helyzete tehát abból következik, ahogyan a rendszer fel van építve, nem pedig külső jóváhagyásból.

Ami az adókat illeti, e cserék adó- és számlaadási megítélése nem szünteti meg a meglévő kötelezettségeidet, ha tevékenységet folytatsz. Az Alapítvány nem ad adótanácsot — az adókötelezettségeidet te viseled.

A személyes adatok védelme ügyében mindig jogod van a közérdekű információkért és a személyes adatok védelméért felelős Biztoshoz fordulni.

A jogszabályok változása vagy a szabályozó új értelmezése olyan kockázat, amelyet érdemes szem előtt tartani, mielőtt csatlakozol.`,
      },
      {
        id: 50,
        pitanje: `Miben különbözik a POEN az elektronikus pénztől, és nem rejtett POEN-vásárlás-e valójában az adomány?`,
        odgovor: `Az elektronikus pénznek három ismérve van: akkor kapod, ha pénzt fizetsz be, a kibocsátóval szembeni követelésedet testesíti meg, és bármikor visszaadhatod, hogy visszakapd a pénzed. A POEN egyiknek sem felel meg.

A POEN nem pénz befizetésére rögzül, hanem a közösséghez való hozzájárulásra vagy valamelyik program megerősített jogállására. Az Alapítvány a POEN alapján semmivel nem tartozik neked, és nem is vásárolja vissza. A POEN-t nem alakíthatod dinárrá, sem a rendszeren kívüli bármely fizetőeszközzé.

Az adomány azért nem rejtett POEN-vásárlás, mert ez két jogilag független aktus. Az első a te visszavonhatatlan adományod az Alapítványnak. A második a POEN automatikus rögzítése, amelyet a Protokoll előre közzétett szabályok szerint végez.

Az adományból nem keletkezik követelésed — sem az a jog, hogy az Alapítványtól POEN rögzítését követeld, sem az, hogy visszakérd a pénzt. A POEN rögzítése nem ellenszolgáltatás az adományért.

Tájékozódás végett nagyjából 1 POEN = 1 dinár mérőskála használatos, de az Alapítvány ezt az értéket nem szavatolja, és a POEN-t nem váltja pénzre.`,
      },
      {
        id: 98,
        pitanje: `Digitális vagyon-e a POEN — virtuális valuta vagy digitális token — a digitális vagyonról szóló törvény szerint?`,
        odgovor: `Nem az. A digitális vagyonról szóló törvény a digitális vagyon két fajtáját ismeri — a virtuális valutát és a digitális tokent —, és a POEN egyiknek az ismérveit sem teljesíti.

A virtuális valuta olyan digitális értékfeljegyzés, amelyet adnak-vesznek és átruháznak, és amellyel fizetnek vagy befektetnek. A POEN sem meg nem vásárolható, sem el nem adható: nem pénzért szerezhető meg, hanem előre közzétett szabályok szerinti bejegyzéssel keletkezik, a hozzájárulás feljegyzéseként. A rendszeren kívül nincs értéke, nincs piaca és ára, nem vihető ki a Protokollból, és az Alapítvány nem vásárolja vissza. Az adomány nem POEN-vásárlás — ez két jogilag független aktus, külön kérdésben kifejtve.

A digitális token olyan feljegyzés, amely valamilyen vagyoni jogot hordoz: részesedést, követelést, hozamhoz vagy szolgáltatáshoz való jogot. A POEN egyiket sem hordozza: sem az Alapítvánnyal, sem bárki mással szemben nem keletkezik belőle követelés, nem ad részesedést, kamatot és hozamot, és senkit — sem az Alapítványt, sem a tagokat — nem kötelez arra, hogy érte bármit nyújtson neked. A hozzájárulás tényét rögzíti, mint egy anyakönyvi bejegyzés — a könyvbe tett bejegyzés pedig nem vagyon.

Ugyanezen okokból a POEN pénzügyi eszköznek sem minősül. Ugyanez áll a ZRNO-ra: nem írható át másik tagnak, nincs piaca és nem hordoz vagyoni jogot — erről bővebben a „POEN és ZRNO" szakaszban.

Mint minden itt, ez is a rendszer jogi felépítése, nem szabályozói megerősítés — a jogszabályok vagy értelmezésük változásának kockázatát e szakasz első kérdése írja le.`,
      },
      {
        id: 48,
        pitanje: `Rendszeresen eladom a feleslegemet (méz, pálinka, befőttek), vagy kézműves szolgáltatást nyújtok — kell-e számla, áfa vagy bejegyzett tevékenység? Ki viseli az adót?`,
        odgovor: `A KOLO nem számol el helyetted adót, és nem állít ki a nevedben adóügyi nyugtát, de nem is szünteti meg azokat a kötelezettségeidet, amelyek az általános szabályok szerint már fennállnak.

A javak és szolgáltatások tagok közötti cseréje nem klasszikus adásvételként épül fel, a POEN átírása pedig nem pénzbeli fizetés a pénzforgalmi szolgáltatásokra vonatkozó szabályok értelmében — a POEN a hozzájárulás nyilvántartása, nem pénz. Ezért a Protokoll frissíti a POEN-nyilvántartást, de nem vezeti az adókönyveidet és nem állít ki számlát.

Ez azonban nem jelenti azt, hogy mentesülnél a szabályok alól. Ha az árut vagy a szolgáltatást rendszeresen és tevékenységre emlékeztető mértékben nyújtod, ugyanúgy vonatkoznak rád az általános szabályok, mint a platformon kívül. Egyes javakra — például az alkoholtartalmú italokra vagy az élelmiszerre — külön előállítási és forgalmazási szabályok is vonatkoznak, és azok itt is érvényesek.

Az Alapítvány nem ad adótanácsot, és nem részese a cserédnek: a teljesítésért, a minőségért és a kockázatért te és a másik fél feleltek a kötelmi jog általános szabályai szerint, az adókötelezettségeidet pedig te viseled.`,
      },
      {
        id: 49,
        pitanje: `Hat-e a KOLO-ban való részvétel / a POEN a nyugdíjamra vagy a szociális juttatásaimra?`,
        odgovor: `A rendszer felől nézve — nem. A POEN nem pénz, nem kereset és nem jövedelem: belső nyilvántartási bejegyzés arról, mit adtál a közösségnek, és nem alakítható át a rendszeren kívül értékkel bíró eszközzé. Az Alapítvány semmilyen pénzbeli juttatást nem fizet neked, és a POEN-t sehol nem jelenti be a jövedelmedként.

Ha a POEN valamelyik szociális programon keresztül rögzül neked (például elsődleges gondviselőként, idősebb tagként vagy a Tanulás révén), az sem szociális segély és nem juttatás, hanem a nyilvántartás automatikus frissítése, amely az ilyen részvételnek egyenrangú helyet ad a rendszerben.

Meg kell azonban különböztetni a POEN-t attól, amit a rendszeren kívül csinálsz. Mindaz, amiért pénzt kérsz, a te tevékenységed, amelyre az általános szabályok vonatkoznak — és ennek következményei lehetnek a jogállásodra nézve, attól függően, mit és milyen mértékben csinálsz.

Az Alapítvány sem adó-, sem jogi tanácsot nem ad. Ha nyugdíjat vagy valamilyen szociális juttatást kapsz, és nem vagy biztos benne, hogyan fér össze azzal, amit csinálsz, a legbiztosabb, ha az illetékes hivatalnál (a nyugdíjpénztárnál) vagy könyvelőnél ellenőrzöd.`,
      },
      {
        id: 77,
        pitanje: `Az Alapítvány a pénzmosás megelőzéséről szóló szabályok (AML/KYC) kötelezettje-e, és azonosítja-e az adományozókat?`,
        odgovor: `Az Alapítvány nem pénzügyi intézmény, és nem kezeli a tagok pénzét — a POEN nem pénz, a tagok közötti csere pedig nem pénzforgalmi művelet. Tevékenysége szerint az Alapítvány nincs azon kötelezettek között, amelyeket a pénzmosás és a terrorizmus finanszírozása megelőzéséről szóló szabályok felsorolnak.

Az adományokat ettől függetlenül nem fogadjuk névtelenül. A banki rendszeren keresztül érkeznek — az Alapítvány számlájára történő befizetéssel vagy bankkártyával —, olyan számláról, amelynek tulajdonosa azonosított, így a befizető azonosítását és a pénzeszközök eredetének ellenőrzését a bank végzi a saját szabályai szerint. A patrónusok jogi személyek és egyéni vállalkozók, akiket szerződés azonosít.

Az adományok adatait az Alapítvány a pénzügyi beszámolásra vonatkozó szabályokkal összhangban őrzi, és hozzáférhetővé teszi az illetékes hatóságok — köztük az Adóhivatal és a pénzmosás megelőzéséért felelős hivatal — számára, ha a törvény ezt előírja.`,
      },
    ],
  },
  {
    id: "zastite",
    naslov: "Védelmek és irányítás",
    pitanja: [
      {
        id: 26,
        pitanje: `Ki irányítja a KOLO-t?`,
        odgovor: `Jelenleg (1. fázis) minden döntést a KOLO Alapítvány hoz meg az Igazgatóságon keresztül.

Amint a rögzített POEN összmennyisége eléri az 1.000.000-t, aktiválódik a Felső Kolo — az összes ZRNO-tartó irányító testülete, amely a kulcsfontosságú rendszerkérdésekről négyzetes szavazással dönt.

Az Alapítvány ettől a pillanattól szuverén testületből végrehajtó testületté válik — végrehajtja a Felső Kolo döntéseit, nem maga hozza őket.`,
      },
      {
        id: 27,
        pitanje: `Mi akadályozza meg az adminisztrátor vagy az alapítók visszaélését?`,
        odgovor: `Több szerkezeti védelem működik egyszerre.

A nulla összegű elv — a POEN minden rögzítése mélyíti a Protokoll mínuszát, így senki nem teremthet POEN-t a semmiből.

A programok napi kerete — a szociális programok és a működési hozzájárulás együtt naponta nem rögzíthet többet a rendszerben lévő POEN teljes mennyiségének 10%-ánál.

Determinisztikus bejegyzések — a Protokollnak nincsenek mérlegelési döntései: minden a kódban van, előre közzétett szabályok szerint, a kód pedig nyilvános, és bárki ellenőrizheti.

Átláthatóság — a hozzájárulások nyilvántartása álneves, a bejegyzések előzményeit nem írjuk át (minden helyesbítés új bejegyzésként kerül be), a rendes tagok látják, a nem regisztráltak pedig csak összesített számokat.

És végül a Felső Kolo aktiválása — a hatáskör átszáll a tagokra.`,
      },
      {
        id: 28,
        pitanje: `Mi a Felső Kolo, és mikor aktiválódik?`,
        odgovor: `A Felső Kolo az összes ZRNO-tartó irányító testülete — a rendszer legfőbb döntéshozó szerve. Nem választott közgyűlés, hanem dinamikus összetétel: azok alkotják, akiknek az adott pillanatban van ZRNO-juk.

Automatikusan aktiválódik, amint a rögzített POEN összmennyisége eléri az 1.000.000-t — a Protokoll nyilvántartásában ez −1.000.000 egyenleg —, ami azt jelzi, hogy a rendszer elég aktív, és a tagok jelentős kollektív felelősséget viselnek.

Ez előtt minden döntést az Alapítvány hoz; ezt követően a kulcsfontosságú rendszerdöntéseket (a Szabályzat módosítása, új programok, egy program felfüggesztése) a Felső Kolo hozza, négyzetes szavazással.`,
      },
      {
        id: 29,
        pitanje: `Mi az a négyzetes szavazás?`,
        odgovor: `Olyan szavazási mód, amelyben a szavazóerő a ZRNO-k számának négyzetgyökeként nő: 1 ZRNO — 1 szavazat, 100 ZRNO — 10 szavazat, 10.000 ZRNO — 100 szavazat.

A cél, hogy senki ne dönthesse el a kérdést pusztán a ZRNO mennyiségével: a befolyás sokkal lassabban nő, mint a ZRNO száma, így a döntést inkább a részvétel szélessége viszi el, mint a hatalom koncentrációja.`,
      },
      {
        id: 30,
        pitanje: `Mi az Alapítvány védelmi vétója?`,
        odgovor: `Amíg az Alapítvány nem pénzügyileg önálló, megtagadhatja a Felső Kolo olyan döntésének végrehajtását, amely veszélyeztetné a működési és pénzügyi fenntarthatóságát — mindenekelőtt a források elköltéséről szóló döntésekét (a közösségi beszerzéseket is beleértve), amelyek aláásnák az Alapítvány képességét az alapköltségek fedezésére és a rendszer fenntartására.

A vétó nem mérlegelési jogkör: konkrét fenntarthatósági fenyegetésre hivatkozva meg kell indokolni, az indokolás nélküli vétó pedig önmagában visszaélés. Ez nem politikai ellenőrzés, hanem a rendszer folytonosságának védelme.

A vétó véglegesen és egy irányban szűnik meg, amint az Alapítvány forrásai elérik a pénzügyi önállóság küszöbét — az előző havi működési költség háromszorosát, amelyet a Felső Koloról szóló szabályzat állapít meg.`,
      },
      {
        id: 72,
        pitanje: `Mit változtatnak pontosan a tagok a „teljes önigazgatásban", és mikor kezdődik ez?`,
        odgovor: `Két külön küszöb van, és könnyű összekeverni őket.

Az első küszöb — a Felső Kolo aktiválása. Amint a rendszerben rögzített POEN összmennyisége eléri az 1.000.000-t (ami a Protokoll nyilvántartásában −1.000.000 egyenlegnek felel meg), automatikusan megnyílik a ZRNO bejegyzése, és létrejön a Felső Kolo — az összes ZRNO-tartó irányító testülete. Ettől a pillanattól a tagok négyzetes szavazással döntenek a rendszer szabályairól: a Szabályzat módosításairól, a programokról és a közös jót érintő egyéb kérdésekről. Az Alapítvány szuverén testületből végrehajtó és szolgáltató testületté válik — végrehajtja a döntéseket, nem maga hozza őket.

A második küszöb — a védelmi vétó megszűnése. Amíg az Alapítvány nem pénzügyileg önálló, védelmi vétója van: megtagadhatja a Felső Kolo olyan döntésének végrehajtását, amely veszélyeztetné a működési fenntarthatóságát — mindenekelőtt a források elköltéséről szóló döntésekét, például a közösségi beszerzésekét, mielőtt a fenntarthatóság biztosított volna. A vétót meg kell indokolni, nem önkényes. Véglegesen és egy irányban csak akkor szűnik meg, ha az Alapítvány forrásai elérik a pénzügyi önállóság küszöbét — az előző havi működési költség háromszorosát, amelyet a Felső Koloról szóló szabályzat állapít meg.

A Felső Kolo aktiválásáig (1. fázis) minden döntést az Alapítvány hoz az Igazgatóságon keresztül.`,
      },
    ],
  },
  {
    id: "tehnika",
    naslov: "Technika és nyílt forráskód",
    pitanja: [
      {
        id: 71,
        pitanje: `Milyen a biztonsági modell? Blokklánc ez? Mi akadályozza meg, hogy valaki POEN-t „verjen" vagy átírja az előzményeket?`,
        odgovor: `Nem blokklánc. A KOLO központosított nyilvántartást használ, amelyet a Protokoll vezet az Alapítvány kezében lévő infrastruktúrán. A decentralizáció itt nem technikai, hanem irányítási: a döntéshozatal idővel az alapítóktól a közösséghez kerül át.

A POEN „verése" elleni védelem a nulla összegű szabályon nyugszik: minden létező POEN ugyanakkora mínuszként van bejegyezve a Protokoll nyilvántartásában. Senki nem rögzíthet POEN-t a semmiből, mert az azonnal megbontaná azt az egyensúlyt, amelyet a rendszer folyamatosan ellenőriz. Ráadásul a Protokoll minden művelete determinisztikus, mérlegelés nélküli — még az adminisztrátor sem adhat valakinek „kézzel" POEN-t a meghatározott csatornákon kívül.

Ami az előzményeket illeti, minden bejegyzés időbélyeget kap, és az előzményeket nem írjuk át: a helyesbítések új, ellentétes irányú bejegyzésként kerülnek be, sosem a régi törlésével vagy módosításával. Az adminisztrátori műveleteket ellenőrzési napló rögzíti, a rendszeres automatikus ellenőrzések pedig igazolják, hogy az összes bejegyzés összege minden pillanatban nulla — bármilyen eltérés azonnal látszik.

A korlátokról: ez a megváltoztathatatlanság tervezési szabály, amelyet a szoftverarchitektúra biztosít, nem pedig olyan kriptográfiai „trustless" garancia, amilyet a nyilvános blokklánc ad. Az integritás a helyesen megírt kódon, a hozzáférés-ellenőrzésen és az átláthatóságon nyugszik, nem azon, hogy a matematika lehetetlenné teszi a csalást. Ezért vannak további intézkedések is — az adatok titkosítása átvitel közben és nyugalmi állapotban, rendszeres, külön helyre készülő biztonsági mentések, és nyílt kód, amelyet bárki függetlenül átnézhet.`,
      },
      {
        id: 80,
        pitanje: `Hol van a nyilvános kódtár? Letölthetem és futtathatom magam (self-host)?`,
        odgovor: `A platform teljes forráskódja nyilvánosan elérhető a GitHubon: https://github.com/alvaserbia-prog/kolo-platform

Szabadon átnézheted, letöltheted és futtathatod a saját másolatodat. A szoftver AGPL-3.0 licenc alatt áll, amely ezt kifejezetten megengedi — egyetlen feltétellel: ha a másolatodat nyilvános internetes szolgáltatásként üzemelteted, neked is elérhetővé kell tenned a saját forráskódodat, minden módosítással együtt, a felhasználóid számára, ugyanazon licenc alatt. Így marad a kód tartósan nyitott.

A futtatáshoz Node.js környezet és PostgreSQL adatbázis szükséges; az alapvető útmutatás (telepítés, indítás, környezeti változók) a kódtár README és .env.example fájljaiban található. A kódhoz való hozzájárulásokat a hozzájárulás eredetéről szóló DCO-aláírással fogadjuk, amelyet a CONTRIBUTING fájl ír le.

A dokumentáció és a rendszer szövegei CC BY-SA 4.0 licenc alatt állnak — szabadon használhatók és átdolgozhatók a szerzőség feltüntetésével és ugyanazon licenc alatt.`,
      },
      {
        id: 69,
        pitanje: `Ha PR-t küldök (kódhozzájárulást) — kapok POEN-t? Működési hozzájárulás ez? Kell, hogy valaki megerősítsen?`,
        odgovor: `A kódhozzájárulás a működési hozzájárulás körébe tartozik — ugyanabba a csatornába, amelyen keresztül a közös jóért végzett minden munka rögzül.

A kód és a tartalom közös jó: a szoftver AGPL-3.0, a tartalom CC BY-SA 4.0 licenc alatt áll. A kódhozzájárulást a DCO elve szerint fogadjuk (a „Signed-off-by" aláírással) — ez a hozzájárulás eredetének igazolása, nem a szerzői jogok átruházása az Alapítványra. A hozzájáruláson szereplő névfeltüntetésed tartós, és akkor is megmarad, ha később törlöd a fiókodat.

Ahhoz, hogy POEN rögzüljön neked, rendes tagnak kell lenned, a hozzájárulás pedig közzétett feladaton keresztül megy: a kezdeti szakaszban a feladatokat az Alapítvány teszi közzé és a teljesítést is az erősíti meg, a közösségi irányítás aktiválása után pedig a Felső Kolo és a ZRNO-tartók is tesznek közzé feladatot, a teljesítést pedig ZRNO-tartók erősítik meg. Te jelentkezel, elvégzed a feladatot, a teljesítést megerősítik — és ekkor rögzül a POEN.`,
      },
      {
        id: 70,
        pitanje: `Van nyilvános vagy fejlesztői API? Építhetek integrációkat vagy botokat?`,
        odgovor: `Jelenleg nincs nyilvános fejlesztői API integrációk vagy botok építéséhez.

Ami van, az a saját adataid exportja: bármikor kérheted az összes adatodat strukturált, géppel olvasható formátumban (JSON) — ez a hordozhatósághoz való törvényes jogod. De ez a személyes adataid exportja, nem az egész rendszer feletti programozói felület.

Az is számít, miért: a rendszernek fokozatos láthatósága van — az álneveket és az egyes tranzakciókat csak a rendes tagok látják, a nem regisztráltak pedig csak összesített számokat. Bármely jövőbeli API-nak ugyanezt a szabályt kellene tiszteletben tartania, különben megkerülné a magánélet védelmét.`,
      },
    ],
  },
  {
    id: "sporovi",
    naslov: "Jogviták és a szabályok megsértése",
    pitanja: [
      {
        id: 31,
        pitanje: `Hogyan rendezik a tagok közötti jogvitákat?`,
        odgovor: `A tagok közötti, cserével kapcsolatos jogvitát a kötelmi jog általános szabályai szerint, az illetékes bíróság rendezi — az Alapítvány nem részese ennek a viszonynak.

A kezdeti szakaszban kérheted az Alapítvány önkéntes, nem kötelező erejű közvetítését. Ha a jogvita közted és maga az Alapítvány között áll fenn, először egyezséget keresünk; ennek hiányában a zombori bíróság illetékes.

A személyes adatok védelme ügyében jogod van panaszt tenni a közérdekű információkért és a személyes adatok védelméért felelős Biztosnál.

Külön belső vitarendezési mechanizmusok később hozhatók létre, külön szabályzattal vagy a Felső Kolo döntésével; egyelőre nincsenek.`,
      },
      {
        id: 32,
        pitanje: `Mi történik, ha valaki nem tartja be a szabályokat?`,
        odgovor: `A rendszernek tartós emlékezete van — a nyilvántartás minden frissítése álnév alatt tartósan rögzítve marad, és a rendes tagok látják, így a rossz magatartás látható marad azok számára, akik részt vesznek a rendszerben.

Az Alapítvány ideiglenesen felfüggesztheti a fiókot — legfeljebb 30 napra, a tag jogával együtt, hogy tájékoztassák az okokról és hogy nyilatkozhasson —, vagy a szabályok súlyosabb megsértése esetén kizárhatja a tagot.

A kizárt tag elveszíti a hozzáférést, a POEN és a ZRNO a Protokollnak íródik le, az álnevet pedig anonimizáljuk.`,
      },
      {
        id: 33,
        pitanje: `Élhetek kifogással az Alapítvány döntése ellen?`,
        odgovor: `Igen. Minden rendes tag hivatalos kifogást nyújthat be a platformon keresztül — megerősítés, felfüggesztés, programról szóló döntés vagy bármely más döntés ellen.

Az Alapítványnak 30 napon belül, indokolással kell elbírálnia a kifogást.

Egyszerre legfeljebb három nyitott kifogásod lehet.`,
      },
    ],
  },
  {
    id: "privatnost-izlazak",
    naslov: "Magánélet és kilépés",
    pitanja: [
      {
        id: 34,
        pitanje: `Ki látja az álnevemet és a tranzakcióimat?`,
        odgovor: `A láthatóság a rendszerbeli státuszodtól függ — a hozzáférés fokozatos.

A nem regisztrált látogató csak a rendszer összesített számait látja: a tagok számát, a nyilvántartás-frissítések számát, a forgalomban lévő POEN-t. Sem az egyes tranzakciókat, sem az álneveket nem látja.

Az új tag látja a nyilvántartás-frissítések összegeit és időbélyegeit, de a felek álnevei és az egyenlegek nélkül.

A rendes tag (legalább 10%-os valóságindex) látja az összes tag álnevét, az összes tranzakciót a felek álneveivel, az egyenlegeket és a profilokat.

A valódi neved és a telefonszámod önkéntes, és nem feltétele a használatnak. Az Alapítvány nem vezet olyan nyilvántartást, amely az álnevedet a személyazonosságodhoz kötné — magad döntöd el, felfeded-e őket és kinek (csak a rendes tagoknak), és a felfedést vissza is vonhatod.

Kivétel a Piac: a hirdetéseid (leírás, POEN-összeg, helység és álnév) mindenki számára nyilvánosan láthatók, de az elérhetőségedet és az előzményekkel való összekapcsolást csak a rendes tagok látják.`,
      },
      {
        id: 55,
        pitanje: `Használhatom a rendszert név és telefonszám nélkül? Mit veszítek?`,
        odgovor: `Igen, használhatod. A regisztrációnál csak az álnév (a név, amelyet magad választasz), az e-mail-cím és a jelszó kötelező — semmi több.

A valódi név és a telefonszám teljesen önkéntes. Nem feltétele annak, hogy a megerősítési láncban megerősítsenek, és nem feltétele a rendszer egyetlen funkciójához való hozzáférésnek sem. Az Alapítvány nem vezet olyan nyilvántartást, amely az álnevedet a személyazonosságodhoz kötné.

Mit veszítesz, ha nem adod meg őket? Gyakorlatilag csak a könnyebb kapcsolatfelvételt: a Piacon nehezebben érnek el, és nehezebben beszéltek meg személyes cserét.

Ha mégis megadod őket, magad döntöd el, láthatók lesznek-e a rendes tagok számára — és ezt a felfedést bármikor visszavonhatod, ezután az adatok többé nem jelennek meg.

Az e-mail-címed soha nem látható nyilvánosan.`,
      },
      {
        id: 56,
        pitanje: `Beazonosíthat-e valaki az összegek, az időpontok és a tranzakciók gyakorisága alapján?`,
        odgovor: `Igen. Az álnevesség nem ugyanaz, mint a névtelenség.

A tranzakcióid álnév alatt futnak, nem a neveden. De az összegek, az időpontok és a nyilvántartás-frissítések gyakoriságának együttese egyes esetekben közvetve rámutathat arra, ki vagy — különösen kis közösségben, ahol az emberek ismerik egymást. A regisztrációval elfogadod, hogy az álneves nyilvántartás nyilvánossága be van építve a rendszerbe, és nem kapcsolható ki.

Néhány dolog azért véd téged.

Az Alapítvány nem vezet olyan táblázatot, amely az álnevet a személyazonosságodhoz kötné — ez a kapcsolat egyszerűen nincs a birtokunkban. A valódi név és a telefonszám önkéntes; magad döntöd el, felfeded-e őket és kinek (csak a rendes tagoknak), és a felfedést bármikor visszavonhatod.

A láthatóság fokozatos: a nem regisztráltak csak összesített számokat látnak, az egyes tranzakciókat álnevekkel pedig csak a rendes tagok. Az e-mail-cím, a technikai naplók és a megerősítési háló soha nem nyilvánosak.

Rajtad is múlik, hogy olyan álnevet válassz, amely nem tartalmaz téged eláruló személyes adatokat.`,
      },
      {
        id: 35,
        pitanje: `Hogyan védik a magánéletemet?`,
        odgovor: `Az adattakarékosság a rendszer négy megváltoztathatatlan elvének egyike — a platform csak azt gyűjti, ami a működéséhez szükséges.

A megerősítés a megerősítési láncban történik: rendes tagok személyes ismeretség alapján erősítik meg a valódiságodat, személyes okiratok gyűjtése vagy benyújtása nélkül. A platform eközben csak technikailag rögzíti, hogy a megerősítés megtörtént — nem gyűjt személyes adatot arról, akit megerősítenek.

Az adminisztrátori műveleteket olyan ellenőrzési napló rögzíti, amelyet nem írunk át. Az Alapítvány nem ad el adatokat, és nem osztja meg őket harmadik felekkel azok saját céljaira: kizárólag az infrastruktúra-szolgáltatók dolgozzák fel őket az Alapítvány nevében (leírásuk az Adatvédelmi szabályzatban), az illetékes hatóságoknak pedig csak akkor adjuk ki, ha a törvény előírja.

Bármikor kérheted az összes adatod exportját JSON formátumban, vagy a fiók törlésével anonimizálhatod őket.`,
      },
      {
        id: 78,
        pitanje: `Hol vannak a szerverek, és átlépik-e az adataim Szerbia határát?`,
        odgovor: `A platformot elismert infrastruktúra-szolgáltatóknál üzemeltetjük, amelyek szerverei az Európai Unióban és az Amerikai Egyesült Államokban találhatók. Ez azt jelenti, hogy az adataidat Szerbián kívül is kezelhetik.

Az ilyen továbbítás megengedett, és a személyes adatok védelméről szóló törvény rendezi. Az Alapítvány megfelelő védelmi intézkedéseket biztosít — általános szerződési feltételeket vagy más jogalapot, amely a hazaival összemérhető védelmi szintet garantál —, és a szolgáltatókat a szerverek elhelyezkedésére és joghatóságuk jogi keretére figyelemmel választja ki.

Függetlenül attól, hol vannak fizikailag a szerverek, ugyanazok a technikai intézkedések érvényesek: az adatok titkosítása átvitel közben és tárolt állapotban, az azonosító és az elszámolási adatok szétválasztása, valamint a szükséges minimum elvén alapuló hozzáférés.

A jogaid — hozzáférés, helyesbítés, törlés, adathordozhatóság és panasz a Biztosnál — a szerverek elhelyezkedésétől függetlenül ugyanazok maradnak.`,
      },
      {
        id: 73,
        pitanje: `Kaphatok megerősítést távolról, külföldről?`,
        odgovor: `Igen. A valóság megerősítése közvetlen személyes ismeretségen alapul — az a rendes tag, aki személyesen ismer téged, megerősíti a valódiságodat, és felel ennek az állításnak az igazságáért. A Szabályzat nem kívánja meg a fizikai jelenlétet a megerősítés pillanatában, így az távolról is megtörténhet, amíg az, aki megerősít, valóban eléggé ismer téged.

A rendszer védelme nem azon nyugszik, hogy egy szobában vagytok, hanem a személyes ismeretségen, a megerősítő felelősségén (a hamis megerősítés a megerősítések érvénytelenítését és szankciókat von maga után) és a háló szerkezetén — a teljes valóságindexhez az kell, hogy a háló több független részéből ismerjenek téged.

Ezért nem vagy kizárva, ha külföldön vagy: regisztrálhatsz, választhatsz álnevet és követheted a rendszert, a funkciókhoz való teljes hozzáférés pedig akkor nyílik meg, amint megerősít valaki, aki ismer téged — személyesen vagy távolról.

Az állampolgárság nem feltétel — az számít, hogy valódi ember vagy.`,
      },
      {
        id: 36,
        pitanje: `Hogyan lépek ki a rendszerből?`,
        odgovor: `A fiók törlése bármikor elérhető a profilbeállításokból.

A törlés előtt kezdeményezheted a POEN-nyilvántartás frissítését egy másik tag javára. A jogállás megszűnésekor az összes ZRNO a Protokollnak íródik le — ez a leírás nem vált ki POEN-rögzítést —, a megmaradó POEN pedig érvénytelenné válik és visszakerül a Protokollhoz.

A személyes adataidat anonimizáljuk, az álnevet pedig semleges jelölés váltja fel; a tranzakciók számszerű előzményei megmaradnak, a rendszer matematikai helyessége miatt.

A nyílt licencek alatt közzétett hozzájárulások (kód, tartalom) megtartják tartós névfeltüntetésüket.`,
      },
      {
        id: 37,
        pitanje: `Mi lesz a POEN-nel halál esetén — örökölhető?`,
        odgovor: `Nem. A POEN és a ZRNO nem örökölhető vagyon, és nem is követelés az Alapítvánnyal szemben.

A tag halálakor a fiók deaktiválódik, a POEN és a ZRNO pedig a Protokollnak íródik le. Az örökösöknek, a családnak és harmadik személyeknek nincs rájuk vagyoni joguk.

Ez a lényegi különbség a POEN és a pénzügyi vagyon között — és egyik oka annak, hogy a POEN jogi értelemben nem pénz.`,
      },
    ],
  },
];
