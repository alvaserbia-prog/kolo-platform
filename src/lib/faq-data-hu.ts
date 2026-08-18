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

• Aki olyasvalakit erősít meg, aki nem valódi személy, elveszíti azt az 1.000 POEN-t, visszaélés esetén pedig a további megerősítés jogát is.

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
        id: 84,
        pitanje: `Regisztrálhatnak-e kiskorúak?`,
        odgovor: `Igen, hét éves kortól, de nem teljesen önállóan. A kiskorú fiókja mindig szülő mellett áll: vagy a szülő nyitja meg a saját fiókjából, vagy a gyerek nyitja meg és megadja a szülő e-mail-címét, a szülő pedig átveszi a fiókot.

A hét évnél fiatalabb gyereknek nincs fiókja. Ha kiderül, hogy egy felnőtt fiókot kiskorú nyitott meg, a fiók törlődik.

Minden egyéb a gyerekfiókokról a Gyerekek és szülők szakaszban áll.`,
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

Miért ér valamit a megerősítés. Aki olyan személyt erősít meg, aki nem valódi, elveszíti azt az 1.000 POEN-t — és ha időközben elköltötte, pótlás marad a nyilvántartásán. Ezen felül a Felhasználási feltételekben szereplő intézkedések vonatkoznak rá, a hálózatból való kizárásig. A megerősítés ezért felelősséget hordoz más ember személyazonosságáért, és nem adják könnyelműen.`,
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
        id: 86,
        pitanje: `Nem vagyok a KOLO tagja. Átvehetem a gyerekem fiókját?`,
        odgovor: `Átveheted. Az eljárás három lépésből áll.

1. Nyisd meg a saját fiókodat. Az üzenetben lévő hivatkozás egyenesen a regisztrációhoz vezet.

2. Vedd át a gyereket. Ettől a pillanattól a gyereknek minden működik: a Csevegőszoba, az üzenetek, a hirdetések és a barátságok. Te és a gyerek ettől kezdve átírtok egymásnak POEN-t.

3. Kérd meg azt, aki személyesen ismer, hogy erősítsen meg téged. A megerősítést a saját fiókodból kéred, és egy is elég.

A harmadik lépésig a gyereknek nem rögzül POEN a barátságokból. A barátságok addig is létrejönnek és rögzülnek, a bejegyzés pedig azon a napon hajtódik végre, amikor rendes taggá válsz.`,
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
        odgovor: `Minden üzenet mellett ott a bejelentés gombja. A gyerek maga nyomja meg, kérdezés és várakozás nélkül.

A bejelentés nem távolítja el az üzenetet. Jelzés az Alapítvány moderációjának, amely az üzenetet megvizsgálja, és eltávolítja, ha van rá alap. Ugyanazt az üzenetet minden felhasználó egyszer jelentheti be.`,
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
        odgovor: `A Tanulás szociális program a hallgatóknak — azoknak a tagoknak, akik felsőoktatási intézménybe vannak beiratkozva.

A napi összeg fix, 2.000 POEN, amíg a státusz tart. A státuszt évente egyszer, tanévenként ellenőrzik; ha a felülvizsgálatkor nem igazolódik, a rögzítés megszűnik.

A jelentkezés ugyanazok szerint a szabályok szerint megy, mint a többi szociális programnál: a platformon keresztül, az adatok űrlapon való megadásával — ennél a programnál a beiratkozott évfolyammal —, dokumentumok csatolása nélkül.`,
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
        odgovor: `Igen, ha több program feltételeinek is megfelelsz — az az anya, aki egyetemre jár, lehet az Anyák Támogatásában és a Tanulásban is. Minden programra külön kell jelentkezni.

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

A szociális programok pontosan meghatározott csoportokat fednek le, amelyek részvétele a közösségben állandó és szétszórt, ezért egyedi cseréken keresztül nem rögzíthető: az anyákat és az elsődleges gondviselőket, az időseket, a fogyatékossággal élőket és a hallgatókat. Sem a munkanélküliség, sem a szegénység nincs e csoportok között — a szociális programok nem szociális segélyek és nem juttatások, hanem azt szolgálják, hogy a szétszórt részvétel egyenrangú helyet kapjon a rendszerben, nem pedig az anyagi helyzet miatti támogatás formái.

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
