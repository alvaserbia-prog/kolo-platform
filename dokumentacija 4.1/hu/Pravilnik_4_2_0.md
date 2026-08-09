> **Nem hivatalos fordítás.** A magyar változat kizárólag a könnyebb megértés célját szolgálja. Jogilag a szerb eredeti szöveg kötelező érvényű; bármilyen eltérés esetén a szerb változat az irányadó.

# Szabályzat a KOLO rendszerről

*A KOLO a kölcsönös támogatás rendszere, amely azon a gondolaton alapul, hogy az emberek nyilvántartásba vehetik, mivel járulnak hozzá egymáshoz és a közösséghez. E szabályzat rendezi, hogyan működik ez a rendszer: kik a szereplői, mi az a közjó, amelyet együtt építenek, hogyan kerül nyilvántartásba a hozzájárulás, és hogyan születnek a döntések. A szabályzat kötelező érvényű aktus, amelynek rendelkezései a felhasználók jogait és kötelezettségeit rendezik.*

## I — Általános rendelkezések

### 1. cikk

E szabályzat rendezi a rendszer alapfogalmait, szerkezetét és működési szabályait, mégpedig:

— a közjót mint a rendszer célját — annak fogalmát, tartalmát, licencelését és a hozzájárulás szabályait — valamint a rendszer szereplőit és eszközeit: a KOLO Alapítványt, a KOLO Protokollt és a KOLO Közösséget;

— a POEN-t és a hozzájárulás nyilvántartását;

— a ZRNO-t, az elszámolási együtthatót és a rendszer elszámolási keretét;

— a felhasználói jogállásokat és a valóságbizonyítékot;

— a közjóhoz való hozzájárulást — az alapítói, pénzügyi, működési hozzájárulást és a pártfogást;

— a rendszer fejlődési szakaszait és a rendszer irányítását;

— a rendszer moduljait;

— az átláthatóságot és a személyes adatok védelmét;

— a KOLO rendszer jogi természetét és szerkezeti korlátait;

— a felhasználók felelősségét és kockázatait, valamint a jogviták rendezését;

— e szabályzat módosítását és a származtatott aktusok rendszerét.

E szabályzat a felsorolt területeket kereti szinten rendezi. A részletes paraméterek, táblázatok, eljárások és működési mechanika külön szabályzatokban kerülnek megállapításra, amelyek erre az aktusra hivatkoznak.

A platformhoz való hozzáférés szabályait, a javak és szolgáltatások cseréjére szolgáló tér használatát és a platform technikai használatának egyéb kérdéseit a Felhasználási feltételek rendezik.

### 2. cikk

E szabályzatban az egyes kifejezések a következő jelentéssel bírnak:

**KOLO rendszer** — a közjó részvételi rendszere; olyan funkcionális egész, amelyet a közjó, a rendszer szereplői és eszközei, valamint a felhasználók alkotnak, és amely a közjóhoz való hozzájárulás és az abban való részvétel nyilvántartása céljából szerveződik. A KOLO rendszer nem jogi személy, sem külön jogi kategória.

**Közjó** — valamennyi felhasználó kollektív java; a KOLO rendszer célja. Alkotja a rendszer szoftvere, a rendszer szabályai, a hozzájárulás és a részvétel nyilvántartása, valamint a rendszerben keletkezett tartalom.

**KOLO Alapítvány (Alapítvány)** — a zálogalapokról és alapítványokról szóló törvény alapján létrehozott nonprofit magánjogi személy, zombori (Sombor) székhellyel; a rendszer jogi eszköze és a közjó őrzője.

**KOLO Protokoll (Protokoll)** — a közjó technikai mechanizmusa, amely vezeti a nyilvántartást, kiszámítja az elszámolási együtthatót és alkalmazza a rendszer szabályait; nem rendelkezik jogalanyisággal.

**KOLO Közösség (Közösség)** — leíró fogalom a rendszer felhasználóinak összességére; nem jogi személy, és nem hoz döntéseket.

**Alaprendszer** — a KOLO rendszer elemeinek minimális köre, amely a működés kezdetétől fogva működik; magában foglalja a közjót, a Protokollt, az Alapítványt, a Közösséget, a felhasználókat, a POEN-t, a ZRNO-t, az elszámolási együtthatót, a valóságbizonyítékot és a hozzájárulás nyilvántartásba vételének csatornáit.

**Modul** — olyan bővítmény, amely funkcionalitást ad az alaprendszerhez anélkül, hogy megváltoztatná; saját előfeltételei szerint aktiválódik.

**POEN** — a rendszer belső elszámolási egysége; a Protokoll nyilvántartásában szereplő bejegyzés, amellyel a közjóhoz való hozzájárulás és az abban való részvétel egyéb formái kerülnek nyilvántartásba.

**ZRNO** — a rendszer belső elszámolási egysége, amellyel a Protokoll nyilvántartásában a felhasználó közjóban elfoglalt helyzete kerül nyilvántartásba.

**Elszámolási együttható** — a nyilvántartásba vett POEN-ek teljes számának és a Protokollban a beírásra rendelkezésre álló ZRNO-k számának számszerű aránya.

**Elszámolási időszak** — az az időintervallum, amelynek végén a Protokoll kiszámítja az elszámolási együtthatót, és alkalmazza a ZRNO beírásának és leírásának, valamint a ZRNO állapotváltozásainak szabályait.

**Zéró összegű invariáns** — a rendszer azon tulajdonsága, amely szerint valamennyi POEN-bejegyzés összege, ideértve a Protokoll bejegyzését is, minden pillanatban nulla.

**Valóságbizonyíték** — a felhasználók hitelesítésének személyes ismeretségen alapuló modellje, amellyel a felhasználó valódisága, egyedisége és folytonossága nyer megerősítést.

**Kezességi lánc** — a valóságbizonyíték azon mechanizmusa, amelyben a hitelesített felhasználók közvetlen ismeretség alapján erősítik meg az új felhasználók valódiságát.

**Valóságindex** — számszerű érték (0–100 %), amely kifejezi a felhasználó megerősítettségének fokát, és meghatározza a rendszer funkcióihoz való hozzáférés terjedelmét, valamint a hitelesítési kapacitást.

**Nem hitelesített felhasználó** — a platformon regisztrált személy, akinek valódisága nem nyert megerősítést a kezességi láncon keresztül.

**Hitelesített felhasználó** — az a személy, akinek valódisága a valóságbizonyítékra vonatkozó szabályokkal összhangban a kezességi láncon keresztül megerősítést nyert.

**ZRNO-tulajdonos** — az a hitelesített felhasználó, akinek a Protokollban ZRNO-t írtak be.

**Álnév** — az a felhasználónév, amely alatt a felhasználó látható a rendszerben és a nyilvános nyilvántartásban.

**Alapítói hozzájárulás** — a platform megnyitása előtt végzett munka, amelynek hozzájárulása utólag kerül nyilvántartásba POEN-ben; egyszeri és időben korlátozott.

**Pénzügyi hozzájárulás** — dináros bevétel az Alapítványba természetes személyek adományai, valamint jogi személyek és obrtnikok (egyéni vállalkozók) pártfogása alapján.

**Működési hozzájárulás** — a platformon kívüli tevékenység, amelynek hozzájárulása a végrehajtás hitelesítését követően kerül nyilvántartásba POEN-ben.

**Pártfogó** — az a jogi személy vagy egyéni vállalkozó, amely pénz, áru vagy szolgáltatás adományozásával támogatja az Alapítvány működését; nem felhasználója a rendszernek, és nem kap sem POEN-t, sem ZRNO-t.

**Automatikus nyilvántartásba vétel** — a POEN nyilvántartásba vétele a Protokoll automatikus aktusaként, amely a rendszer szabályai szerint hajtódik végre, bármely szereplő mérlegelési döntése nélkül.

**Kör (Krug)** — a rendszer szervezeti egysége, amely közös érdeken vagy tevékenységen alapul; nem rendelkezik jogalanyisággal.

**Szövetkezet** — a rendszer helyi szervezeti egysége területi elven, a szövetkezetekről szóló törvény szerint bejegyezve; teljes jogalanyisággal rendelkezik.

**Kollektív formák** — a rendszer azon szervezeti egységeinek gyűjtőneve, amelyek a felhasználókat tartósabb szerkezetekbe kapcsolják: a Körök és a Szövetkezetek.

**Felső Kolo** — a rendszer irányító testülete, amelyet valamennyi ZRNO-tulajdonos alkot; dönt a rendszer szabályairól.

**Igazgatótanács** — a KOLO Alapítvány testülete, amelynek összetételét, megbízatását és hatáskörét az Alapszabály rendezi.

**Védelmi vétó** — az Alapítvány joga, hogy megtagadja a Felső Kolo olyan határozatának végrehajtását, amely veszélyeztetné az Alapítvány működési és pénzügyi fenntarthatóságát a pénzügyi önállóság elérése előtt.

**Négyzetes szavazás** — a Felső Kolo döntéshozatali mechanizmusa, amelyben a szavazati erő az aktív ZRNO-k számából vont négyzetgyök egész értékével egyenlő.

**Whitepaper** — a KOLO rendszert leíró koncepcionális és nyilvános dokumentum.

Az e cikkben nem meghatározott kifejezések a szabályzat megfelelő fejezeteiben vagy a külön szabályzatokban megállapított jelentéssel bírnak.

### 3. cikk

E szabályzat a KOLO rendszer ernyőjellegű működési aktusa. A külön szabályzatoknak és egyéb származtatott aktusoknak összhangban kell lenniük e szabályzattal.

E szabályzatot a KOLO Alapítvány Igazgatótanácsa fogadja el és módosítja, az e szabályzatban külön rendezett eljárás szerint.

A rendszer nyelve a szerb.

## II — A közjó, a szereplők és az eszközök

### 4. cikk

A KOLO rendszert három elem alkotja: a közjó mint az, amit a felhasználók megosztanak és amihez hozzájárulnak; az Alapítvány mint jogi eszköz, amely biztosítja a rendszer működésének feltételeit; és a Protokoll mint szoftver, amely vezeti a nyilvántartást és alkalmazza a szabályokat. A felhasználók alkotják a Közösséget, de a Közösség nem testület és nem jogi személy — a felhasználók részvétele a rendszer irányításában a Felső Kolón keresztül valósul meg, e szabályzattal összhangban.

Ez a fejezet rendezi ezen elemek mindegyikét: mi a közjó és milyen feltételek mellett használható, mit tesz az Alapítvány és mit nem tehet, mire képes a Protokoll és mitől van megfosztva.

### 5. cikk

A közjó a KOLO rendszer célja. Alkotja a rendszer szoftvere, a rendszer szabályai, a hozzájárulás és a részvétel nyilvántartása, valamint a rendszerben keletkezett tartalom.

A közjó valamennyi felhasználó kollektív java. Egyetlen felhasználónak, sem az alapítónak, sem az Alapítványnak nincs tulajdonjoga a közjó felett, sem joga rendelkezni vele.

A közjó nem minősül kollektív tulajdonnak a hatályos vagyonjogi kategóriák értelmében. A felhasználók közjóhoz fűződő viszonya részvételi jellegű — a használat és a hozzájárulás joga, nem a rendelkezés joga.

A közjó kollektív jellegét a közjó licencei, az Alapítvány mint őrző jogi szerkezete és a rendszer négy elve biztosítja.

### 6. cikk

Az az infrastruktúra, amelyen a rendszer működik — kiszolgálók, adatbázisok, hálózati berendezések és egyéb technikai erőforrások — nem alkotórésze a közjónak. A nyilvántartás mint bejegyzés és a tartalom a közjóhoz tartozik; az adatbázis mint tárolóközeg az infrastruktúrához.

Az infrastruktúra a rendszer működésének működési előfeltétele. Biztosítása és fenntartása az Alapítvány szolgáltatási kötelezettsége.

Az Alapítványnak joga és kötelessége megválasztani, megváltoztatni és fejleszteni az infrastruktúrát. Semmilyen ilyen módosítás nem érinti a közjó jogállását vagy integritását.

### 7. cikk

A rendszer szoftvere a GNU Affero General Public License 3.0 (AGPL-3.0) licenc alatt kerül licencelésre.

A rendszerben keletkező tartalom a Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) licenc alatt kerül licencelésre.

A szoftver és a tartalom szerzőinek személyhez fűződő jogai érintetlenek maradnak, és nem ruházhatók át.

A közjó szoftvere és tartalma nem licencelhető újra korlátozóbb feltételek mellett; kizárólag egyenértékű copyleft, illetve share-alike rendszerű licenccel való felváltás megengedett.

A rendszer márkája — a „KOLO” megnevezés, a logó, a jelkép és a domainek — nem része a közjónak, és kizárólag az Alapítvány ellenőrzése alatt áll.

### 8. cikk

A szoftverhez való hozzájárulások a Developer Certificate of Origin (DCO) feltételei mellett kerülnek elfogadásra, amellyel a hozzájáruló megerősíti azon jogát, hogy a kódot a közjó licence alatt bocsássa rendelkezésre.

A tartalomhoz való hozzájárulások a közjó licencének elfogadása mellett kerülnek elfogadásra.

A hozzájárulások a közjóhoz tartoznak.

### 9. cikk

A KOLO Alapítvány a rendszer jogi eszköze és a közjó őrzője. Az Alapítvány nem tulajdonosa sem a rendszernek, sem a közjónak.

Az Alapítvány biztosítja és fenntartja az infrastruktúrát, fogadja a dináros adományokat, finanszírozza a rendszer költségeit és programjait, valamint képviseli a rendszert a jogforgalomban.

Az Alapítvány nem szerez POEN-t vagy ZRNO-t, és nem vesz részt a rendszer elszámolási keretében. Az Alapítvány rendszerhez fűződő viszonya kizárólag dináros eszközökben áll fenn.

Az Alapítvány belső szervezetét, testületeit, megbízatásait és döntéshozatali módját az Alapszabály rendezi.

### 10. cikk

A KOLO Protokoll a közjó technikai mechanizmusa. A Protokoll vezeti a nyilvántartást, kiszámítja az elszámolási együtthatót és alkalmazza a rendszer szabályait.

A Protokoll valamennyi művelete determinisztikus és algoritmikus, mérlegelés nélkül. A Protokoll nem járhat el a rendszer szabályain kívül.

A Protokoll nem rendelkezik jogalanyisággal. A Protokoll nem köt szerződéseket, nem vezet számlákat, nem lép jogviszonyba a felhasználókkal, és nem adatkezelő.

Azokat a szabályokat, amelyek szerint a Protokoll eljár, e szabályzattal összhangban kell megállapítani.

### 11. cikk

A KOLO Közösséget a rendszer valamennyi felhasználója alkotja, mint a közjó kollektív őrzői.

A Közösség nem jogi személy, nincsenek testületei vagy képviselői, és mint egész nem hoz döntéseket.

A felhasználók részvétele a rendszer irányításában a Felső Kolón keresztül valósul meg, e szabályzattal összhangban.

## III — POEN és a hozzájárulás nyilvántartása

### 12. cikk

A POEN az a mód, ahogyan a rendszer feljegyzi, ki mennyivel járult hozzá és ki mennyit kapott. Minden hozzájárulás, minden adomány, a felhasználók közötti minden javak- vagy szolgáltatáscsere — mind POEN-ben kerül nyilvántartásba. A POEN nem pénz, és nem alakítható pénzzé; belső bejegyzés a rendszerben.

Ez a fejezet rendezi, hogyan keletkezik a POEN, hogyan működik a nyilvántartás, mit jelent, hogy a rendszer egyensúlyban van (zéró összegű), és milyen módokon kerül nyilvántartásba a hozzájárulás.

### 13. cikk

A POEN a rendszer belső elszámolási egysége, amellyel a közjóhoz való hozzájárulás és az abban való részvétel egyéb formái kerülnek nyilvántartásba. A POEN azt szolgálja, hogy a felhasználók tudják, mennyivel járultak hozzá és mennyit cseréltek a rendszerben; a legközelebbi analógia az anyakönyvi bejegyzés — tényt rögzít, de önmagában nem olyan eszköz, amely a rendszeren kívül elkölthető.

Új POEN-bejegyzéseket kizárólag a Protokoll ír be a hozzájárulás nyilvántartásba vételének csatornáin keresztül.

A POEN-nek nincs birtokosa; kizárólag a Protokoll nyilvántartásában szereplő bejegyzésként létezik. A POEN összegei egész számokban fejezendők ki. A POEN nem minősül pénznek, valutának, elektronikus pénznek, fizetési eszköznek, digitális vagyonnak, pénzügyi eszköznek vagy értékpapírnak. A POEN nem konvertálható a rendszeren kívül értékkel bíró eszközzé.

### 14. cikk

A rendszerben szereplő valamennyi POEN-bejegyzés összege, ideértve a Protokoll bejegyzését is, minden pillanatban nulla. Ez a tulajdonság biztosítja, hogy POEN-t ne lehessen ellenbejegyzés nélkül létrehozni — minden nyilvántartásba vett hozzájárulásnak pontos ellenbejegyzése van a Protokoll nyilvántartásában.

A Protokoll olyan bejegyzést vezet, amely minden pillanatban negatív, és a felhasználóknál, valamint a szervezeti egységeknél nyilvántartásba vett valamennyi POEN ellenbejegyzését képezi.

Egyetlen felhasználónak vagy kollektív formának sem lehet negatív POEN-bejegyzése. Kivétel a hamis hitelesítés érvénytelenítése miatti megtérítés, amelyet a valóság bizonyításáról szóló szabályzat 20b. cikke rendez: ha az érvénytelenítés már elköltött POEN-bejegyzéseket von el, a fedezetlen rész negatív értékbe fordul, és átszáll arra a hitelesítőre, aki a fiókot bevezette. Ez az egyetlen jogalap, amely alapján a felhasználónak negatív POEN-bejegyzése lehet; a megtérítés semmilyen más eljárásba nem vezethető be, és más aktussal nem hozható létre.

A javak és szolgáltatások cseréje újraosztja a meglévő POEN-eket, és nem változtatja meg azok teljes számát a rendszerben. A POEN-ek teljes száma kizárólag a hozzájárulás nyilvántartásba vételének csatornáin keresztül történő új bejegyzésekkel változik.

### 15. cikk

Új POEN-bejegyzéseket a Protokoll a hozzájárulás nyilvántartásba vételének következő csatornáin keresztül ír be:

1) működési hozzájárulás;

2) más felhasználók hitelesítése a kezességi láncban;

3) pénzügyi hozzájárulás;

4) pártfogás;

5) a kollektív formák növekedése;

6) szociális programok;

7) alapítói hozzájárulás;

8) a platform tartalmához való hozzájárulás.

Az 1., 3., 4., 7. és 8. pont szerinti csatornákat e szabályzat VI. fejezete rendezi. A 2. pont szerinti csatornát a valóságbizonyítékról szóló szabályzat rendezi. Az 5. és 6. pont szerinti csatornákat a VIII. fejezet rendezi a rendszer moduljaiként. Az egyes csatornákra vonatkozó nyilvántartásba vételi paramétereket, feltételeket és korlátozásokat külön szabályzatok állapítják meg, különösen a működési hozzájárulásról szóló szabályzat, a valóságbizonyítékról szóló szabályzat, az adományokról szóló szabályzat, a pártfogásról szóló szabályzat, a kollektív formákról szóló szabályzat, a Támogatási Programok szabályzatai és az alapítói hozzájárulásról szóló szabályzat.

A pénzügyi hozzájárulás dinárban valósul meg. A pártfogás pénz, áru vagy szolgáltatás adományozásával valósul meg. A dináros eszközök az Alapítványba kerülnek, és nem lépnek be a rendszer elszámolási keretébe. Az adomány vagy a pártfogói hozzájárulás beérkezését követően a Protokoll a megfelelő felhasználó bejegyzésében nyilvántartásba veszi a hozzájárulást POEN-ben, a külön szabályzatban megállapított nyilvántartásba vételi paraméterek szerint. A POEN nyilvántartásba vétele a Protokoll automatikus aktusa, és nem hoz létre szerződéses jogviszonyt az adományozó és az Alapítvány között.

### 16. cikk

A felhasználók a rendszeren belül javakat és szolgáltatásokat cserélnek. Minden cserét a Protokoll a POEN-nyilvántartás frissítésével vesz nyilvántartásba: a javat vagy szolgáltatást nyújtó felhasználó bejegyzése növekszik, a fogadó felhasználó bejegyzése pedig ugyanazzal az összeggel csökken.

A csere újraosztja a meglévő POEN-eket a felhasználók között, és nem növeli azok teljes számát a rendszerben. A Protokoll akkor frissíti a nyilvántartást, amikor a felhasználók lebonyolítják a cserét.

A csere nem fizetési tranzakció. A POEN-nyilvántartás frissítése nem monetáris érték átutalása, és nem minősül fizetésnek a fizetési szolgáltatásokról szóló előírások értelmében.

A csere teljesítéséért, minőségéért, az azzal járó felelősségért és kockázatért az abban részt vevő felhasználók felelnek, a kötelmi jog általános szabályai szerint. Az Alapítvány és a Protokoll nem közvetít a cserében, és nem felel a felhasználók kötelezettségeinek teljesítéséért.

Valamennyi felhasználó cserélhet javakat és szolgáltatásokat. A POEN-nyilvántartás más felhasználó javára történő frissítésének kezdeményezése (csere mellett vagy ellenszolgáltatás nélkül) a hitelesített felhasználók számára elérhető, a 28. cikk szerinti feltételek mellett.

A platform hirdetési terében a hirdetések megtekintése — az ajánlat vagy kérés tartalma, ára, helye és a hirdető álneve — nyilvános és valamennyi látogató számára elérhető a csere hozzáférhetősége érdekében.

Javat vagy szolgáltatást kínáló hirdetés közzététele a nem hitelesített felhasználók számára is elérhető, a Felhasználási feltételekben megállapított feltételek és korlátozások mellett. Javat vagy szolgáltatást kereső hirdetés közzététele, a hirdető elérhetőségi adataihoz való hozzáférés és a hirdetés kapcsán történő kommunikáció kezdeményezése kizárólag hitelesített felhasználók számára elérhető. A nem hitelesített hirdető válaszolhat abban a beszélgetésben, amelyet hitelesített felhasználó indított a hirdetése kapcsán.

A nem hitelesített felhasználó hirdetése látható jelzést visel arról, hogy a hirdető nem hitelesített a kezességi láncban. A jelzés mindazok számára elérhető, akik számára maga a hirdetés is elérhető.

A hirdető álneve a hirdetési térben a be nem jelentkezett és nem hitelesített személyek számára nem kapcsolódik össze a hozzájárulási nyilvántartással, a számlaállással vagy a felhasználói profillal. A platform hirdetési terének szabályait a Felhasználási feltételek rendezik.

## IV — ZRNO és az elszámolási keret

### 17. cikk

A ZRNO a másik bejegyzés, amelyet a rendszer a felhasználóról vezet. Míg a POEN a hozzájárulást rögzíti, a ZRNO a helyzetet rögzíti — a felhasználó közjóban való tartósabb részvételének mértékét, amely alapján szavazatot szerez a rendszer szabályairól való döntéshozatalban. Az elszámolási együttható az a számszerű arány, amely a POEN-t és a ZRNO-t összeköti.

Ez a fejezet rendezi, mi a ZRNO, hogyan kerül beírásra és leírásra, milyen állapotai vannak, miért nem ruházható át, valamint hogyan kerül kiszámításra az elszámolási együttható, és mi az elszámolási időszak.

### 18. cikk

A ZRNO a rendszer belső elszámolási egysége, amellyel a Protokoll nyilvántartásában a felhasználó közjóban elfoglalt helyzete kerül nyilvántartásba. A helyzet a felhasználó hozzájárulásából ered, és szavazatot ad neki a rendszer szabályairól való döntéshozatalban. A ZRNO nem minősül üzletrésznek, részvénynek, értékpapírnak, kollektív befektetési egységnek, befektetési szerződésnek vagy digitális vagyonnak, és nem hordoz osztalékot, kamatot, hozamot vagy a felszámolási maradványhoz való jogot.

A ZRNO-k teljes száma 1.000.000, és sem nem növelhető, sem nem csökkenthető.

Minden pillanatban a ZRNO-k egy része a felhasználóknál van beírva, másik része pedig a Protokollban beírásra rendelkezésre áll; a beírt és a rendelkezésre álló ZRNO-k összege mindig egyenlő a teljes számmal.

A ZRNO-t kizárólag a Protokoll írja be és le, a felhasználó kérelmére és a rendszer szabályai szerint. Az irányítási funkció — a Felső Kolóban való szavazati jog — a beírt és aktivált ZRNO-ból ered; a ZRNO önmagában nem szavazati jog, hanem a helyzet nyilvántartása, amelyből az a jog ered.

### 19. cikk

A hitelesített felhasználó akkor ír be ZRNO-t, amikor teljesíti a rendszer szabályaiban megállapított feltételeket. A ZRNO beírásával a felhasználó ZRNO-tulajdonossá válik.

A ZRNO beírása legalább 20.000 nyilvántartásba vett POEN-t feltételez a felhasználó bejegyzésében. A felhasználó egy elszámolási időszakban ZRNO beírására legfeljebb nyilvántartásba vett POEN-jeinek 1 %-át fordíthatja.

Az e cikk szerinti feltétel alóli kivételt a rendszer indulásakor átmeneti rendelkezés rendezi (82. cikk).

A ZRNO beírását a felhasználó kezdeményezi. A Protokoll ellenőrzi a feltételek teljesülését, és végrehajtja a beírást, ha a feltételek teljesülnek. A beírás nem mérlegelési döntés, és azt a rendszer egyetlen szereplője sem hagyja jóvá vagy utasítja el.

A ZRNO beírásakor a Protokoll csökkenti a felhasználó nyilvántartásba vett POEN-jeit a folyó elszámolási időszakra érvényes elszámolási együttható szerint.

### 20. cikk

A beírt ZRNO-nak két állapota van: szabad és aktív.

A szabad ZRNO irányítási funkció nélküli beírt ZRNO. A szabad ZRNO tulajdonosa aktiválhatja vagy leírhatja azt.

Az aktív ZRNO olyan ZRNO, amelyet a tulajdonos az irányításban való részvétel céljából aktivált; az aktív ZRNO szavazati jogot ad a Felső Kolóban. Az aktív ZRNO nem írható le, amíg a tulajdonos vissza nem állítja szabad állapotba.

A ZRNO állapotai közötti átmenetek és azok hatálya az elszámolási időszak végén állnak be.

### 21. cikk

A ZRNO-tulajdonos leírhatja a szabad ZRNO-t — visszaadhatja a Protokollnak.

A leíráskor a Protokoll POEN-t vesz nyilvántartásba a tulajdonos javára a folyó elszámolási időszakra érvényes elszámolási együttható szerint.

Az aktív ZRNO nem írható le. Az a tulajdonos, aki aktív ZRNO-t kíván leírni, előbb köteles azt szabad állapotba visszaállítani.

Az a felhasználó, akinek ZRNO-ja teljes egészében leírásra került, ismét hitelesített felhasználói jogállással rendelkezik.

A beírás és a leírás pillanatában érvényes elszámolási együttható közötti különbség nem hozam. Az az egész rendszer nyilvántartási állapotának változásából eredő számtani következmény; egyetlen szereplő sem fizeti ki és nem szavatolja. A leírással nyilvántartásba vett POEN-ek ugyanolyan jogállással bírnak, mint minden más POEN.

### 22. cikk

A ZRNO nem ruházható át másik felhasználóra.

A ZRNO ahhoz a felhasználóhoz kötődik, akinek valódisága a kezességi láncon keresztül nyert megerősítést.

A ZRNO-ra nincs piac, nincs ZRNO-ár, és nincs lehetőség vele kereskedni.

### 23. cikk

Az elszámolási együttható a nyilvántartásba vett POEN-ek teljes számának és a Protokollban a beírásra rendelkezésre álló ZRNO-k számának számszerű aránya. Az elszámolási együttható megmutatja, hány POEN szükséges egy ZRNO beírásához az adott elszámolási időszakban.

Az elszámolási együtthatót a Protokoll számítja ki, automatikusan és mérlegelés nélkül.

Az elszámolási együttható a rendszerbeli tevékenységgel változik: az új POEN-bejegyzések beírása, valamint a ZRNO beírása és leírása elmozdítja az együtthatót. A felhasználók közötti javak- és szolgáltatáscsere nem változtatja meg az együtthatót.

Az elszámolási együttható igazgatási mennyiség. Nem ár, nem árfolyam és nem teljesítménymutató; nem fejezi ki a ZRNO vagy a POEN rendszeren kívüli értékét.

### 24. cikk

Az elszámolási időszak az az időintervallum, amelynek végén a Protokoll kiszámítja az elszámolási együtthatót.

Az elszámolási időszak végén alkalmazandók a ZRNO beírásának és leírásának szabályai, és beállnak a ZRNO állapotai közötti átmenetek.

Az elszámolási időszak huszonnégy óráig tart, éjféltől éjfélig.

### 25. cikk

A ZRNO-tulajdonos az elszámolási együtthatóval változó elszámolási rendszerben pozícióval rendelkezik, valamint joga van a Felső Kolón keresztül részt venni a rendszer irányításában.

A ZRNO-tulajdonos pozíciójának megváltozása kizárólag a rendszerbeli tevékenység és az elszámolási együttható változásának következményeként áll be. Ez a változás nem hozam, nem szavatolt, és egyetlen szereplő sem fizeti ki.

A pozícióból eredő hasznot a ZRNO-tulajdonos kizárólag a rendszeren belül realizálja. A ZRNO-nak és a POEN-nek nincs a rendszeren kívüli értéke, és nem konvertálhatók pénzzé.

Az a ZRNO-tulajdonos, aki nem vesz részt aktívan a rendszerben, megtartja nyilvántartásba vett helyzetét; e helyzet esetleges megváltozása más felhasználók rendszerbeli tevékenységének következménye, nem pedig a rendszer egyénre irányuló cselekménye.

## V — Felhasználói jogállások, valóságbizonyíték és a jogállás megszűnése

### 26. cikk

Ahhoz, hogy a felhasználó cserélhessen, hogy hozzájárulása nyilvántartásba kerülhessen vagy hogy a rendszert irányíthassa, a rendszernek tudnia kell, hogy valós és egyedi személyről van szó. Ez a fejezet rendezi a felhasználó lehetséges jogállásait, azt a módot, ahogyan megerősítést nyer, hogy a felhasználó valós személy, és azt, mi történik, amikor a felhasználó megszűnik a rendszer részének lenni.

A valóságbizonyíték működési elemeit és a jogállás megszűnésének mechanikáját külön szabályzat rendezi.

### 27. cikk

A KOLO rendszerben a felhasználó három jogállás egyikével rendelkezhet: nem hitelesített felhasználó, hitelesített felhasználó és ZRNO-tulajdonos.

A felhasználó akkor lép át egyik jogállásból a másikba, amikor teljesíti a rendszer szabályaiban megállapított feltételeket.

A jogállás meghatározza a felhasználó rendszerbeli jogainak és lehetőségeinek terjedelmét.

### 28. cikk

A nem hitelesített felhasználó a platformon regisztrált személy, akinek valódisága nem nyert megerősítést a kezességi láncon keresztül.

A nem hitelesített felhasználónak joga van megtekinteni a rendszer nyilvános tartalmát, ideértve a platform hirdetési terében szereplő hirdetéseket. Cserélhet javakat és szolgáltatásokat, és a platform hirdetési terében javat vagy szolgáltatást kínáló hirdetést tehet közzé, a Felhasználási feltételekből eredő korlátozások mellett.

A POEN-nyilvántartás frissítésében a nem hitelesített felhasználó kizárólag fogadóként vehet részt. A nyilvántartás más felhasználó javára történő frissítése a hitelesítést követően érhető el. A hitelesítés előtt nyilvántartásba vett POEN-bejegyzések érvényesek maradnak, és nem kerülnek megsemmisítésre.

A nem hitelesített felhasználó hozzájárulása kizárólag a platform tartalmához való hozzájárulás csatornáján keresztül vehető nyilvántartásba (15. cikk 8. pont és 40.a cikk). A többi csatornán keresztül hozzájárulása nem kerül nyilvántartásba, és ZRNO-t sem írhat be.

A nem hitelesített felhasználó nem férhet hozzá a hirdető elérhetőségi adataihoz, és nem kezdeményezhet kommunikációt a Platformon keresztül. Válaszolhat abban a beszélgetésben, amelyet hitelesített felhasználó indított a hirdetése kapcsán.

### 29. cikk

A hitelesített felhasználó az a személy, akinek valódisága a valóságbizonyítékra vonatkozó szabályokkal összhangban a kezességi láncon keresztül megerősítést nyert.

A hitelesített felhasználó cserélhet javakat és szolgáltatásokat, hozzájárulása POEN-ben nyilvántartásba vehető, részt vehet a kollektív formákban és a szociális programokban, valamint megerősítheti más felhasználók valódiságát a kezességi láncban.

A hitelesített felhasználó akkor ír be ZRNO-t, amikor teljesíti a beírás feltételeit, és ezzel ZRNO-tulajdonossá válik.

### 30. cikk

A ZRNO-tulajdonos az a hitelesített felhasználó, akinek a Protokollban ZRNO-t írtak be. Az első ZRNO-tulajdonosok a rendszer indulásakor e szabályzat átmeneti rendelkezésében megállapított módon kerülnek megállapításra (82. cikk).

A ZRNO-tulajdonost megilleti a hitelesített felhasználó valamennyi joga. Ezen túlmenően a ZRNO aktiválásával részt vesz a rendszer irányításában a Felső Kolón keresztül, pozícióval rendelkezik az elszámolási rendszerben, valamint tartós kapacitással bír más felhasználók valódiságának megerősítésére.

Az a ZRNO-tulajdonos, akinek ZRNO-ja teljes egészében leírásra került, ismét hitelesített felhasználói jogállással rendelkezik.

### 31. cikk

A valóságbizonyíték a felhasználók hitelesítésének személyes ismeretségen alapuló modellje. Ezzel nyer megerősítést, hogy a felhasználó valós személy, hogy egyedi — egy személy egy felhasználó —, és hogy folytonosan ugyanaz a személy.

A valóságbizonyíték nem igényli személyi okmányok vagy egységes polgári azonosító szám gyűjtését. A rendszerben nincs központi nyilvántartás, amely a felhasználó álnevét a személyazonosságához kapcsolná.

A valódiság hitelesítése személyes adatok kezelése. Ezen adatkezelés jogalapja a felhasználó és az Alapítvány közötti szerződéses jogviszony teljesítése.

### 32. cikk

A felhasználó valódisága a kezességi láncon keresztül nyer megerősítést: a hitelesített felhasználók közvetlen ismeretség alapján erősítik meg az új felhasználók valódiságát. Minden új felhasználó azért kerül a rendszerbe, mert valaki, aki már hitelesített, ismeri őt, és megerősíti, hogy létezik.

Minden felhasználó rendelkezik valóságindexszel — számszerű értékkel, amely kifejezi a felhasználó megerősítettségének fokát. A valóságindex meghatározza a rendszer funkcióihoz való hozzáférés terjedelmét, valamint a felhasználó kapacitását mások valódiságának megerősítésére.

A kezességi láncban tett megerősítések összessége alkotja a hitelesítési gráfot. A hitelesítési gráf személyes adatok nyilvántartása; azon az infrastruktúrán vezetendő, amelyen a Protokoll működik, adattakarékosság mellett. A gráf a felügyeleti adatokat is felöleli — a felügyelet eredményét, gyanú kifejezése esetén pedig a gyanú alanyát és az indok kódját is (a valóság bizonyításáról szóló szabályzat 11. cikke). Ezek az adatok nem nyilvánosak, és rájuk a jelen szabályzat 67. cikke alkalmazandó.

A hitelesítés lefolytatásához szükséges kapcsolatot a nem hitelesített felhasználó a platform hirdetési terén keresztül létesíti (16. cikk): javat vagy szolgáltatást kínáló hirdetés közzétételével bemutatkozik a meglévő hitelesített felhasználók hálózatának. E út megléte nem változtatja meg az e szabályzatban és a valóságbizonyítékról szóló szabályzatban megállapított hitelesítés természetét, eljárását vagy feltételeit. A közzététel, a tartalom és az adatkezelés szabályait a Felhasználási feltételek és az adatvédelmi szabályzat állapítják meg.

A valóságindex kiszámításának szabályait, a kezességi hálózat terjeszkedésének szabályait és a kezességi lánccal való visszaélés elleni intézkedéseket külön szabályzat állapítja meg.

### 33. cikk

A felhasználói jogállás kilépéssel, kizárással vagy halállal szűnik meg.

A kilépés a jogállás önkéntes megszűnése a felhasználó elektronikus nyilatkozata alapján, felmondási idő nélkül.

A kizárás a jogállás megszűnése az Alapítvány határozatával, a rendszer szabályainak súlyosabb megsértése miatt.

A felhasználó rendszerfunkciókhoz való hozzáférése felfüggesztéssel ideiglenesen korlátozható; a felfüggesztés ideje alatt a felhasználó megtartja jogállását, de nem használhatja azokat a funkciókat, amelyekre a felfüggesztés vonatkozik.

A jogállás megszűnésének és a felfüggesztésnek az okait, eljárását és mechanikáját minden módozat tekintetében a Felhasználási feltételek rendezik.

### 34. cikk

A jogállás megszűnésével a felhasználó aktív ZRNO-ja szabad állapotba kerül, majd a teljes szabad ZRNO leírásra kerül, és visszakerül a Protokoll rendelkezésre álló ZRNO-i közé. A ZRNO jogállás megszűnésekor történő leírása nem indítja el a POEN elszámolási együttható szerinti nyilvántartásba vételét.

A felhasználó POEN-bejegyzései megsemmisítésre kerülnek, a Protokoll megfelelő ellenbejegyzése pedig ugyanazzal az összeggel csökken. A zéró összegű invariáns fennmarad. A megtérítésként keletkezett negatív POEN-bejegyzés (a valóság bizonyításáról szóló szabályzat 20b. cikke) a jogállás megszűnésével nem semmisül meg, és nem száll át a Protokollra, hanem az e cikk szerinti anonimizált számszerű előzmény mellett marad; ellenkező esetben a rendszerből való kilépés törölné a megtérítést, a terhet pedig a többi felhasználó viselné.

A POEN-bejegyzések megsemmisítése és a ZRNO-k rendelkezésre állóvá tétele mindkét szinten megváltoztatja az elszámolási együtthatót — csökken a számláló (a nyilvántartásba vett POEN-ek összessége) és nő a nevező (a rendelkezésre álló ZRNO-k).

A felhasználó részére pénzbeli térítés nem kerül kifizetésre.

A jogállás megszűnésével megindul a felhasználó adatainak anonimizálása: törlésre kerül az elektronikus cím és az önkéntesen megadott adatok, anonimizálásra kerülnek a felhasználó kapcsolatai a hitelesítési gráfban, a számszerű előzmény pedig olyan azonosító alatt marad meg, amely már nem teszi lehetővé az azonosítást. Az így anonimizált bejegyzések megszűnnek személyes adatnak lenni.

A POEN- és ZRNO-bejegyzések nem öröklődnek vagyoni jogként. A nyilvántartással való eljárást a felhasználó halála esetén a Felhasználási feltételek részletezik.

## VI — Hozzájárulás a közjóhoz

### 35. cikk

A közjó nem keletkezik magától — hozzájárulásból keletkezik. A felhasználók közötti, a meglévő POEN-eket újraosztó javak- és szolgáltatáscserén túl a rendszer új POEN-eket vesz nyilvántartásba az e szabályzat 15. cikkében megállapított csatornákon keresztül. Ez a fejezet e csatornák közül ötöt fejt ki — a működési hozzájárulást, az adományokat, a pártfogást, az alapítói hozzájárulást és a platform tartalmához való hozzájárulást. Más felhasználók hitelesítését mint hozzájárulási formát a valóságbizonyítékról szóló szabályzat rendezi. A kollektív formák növekedésének és a szociális programoknak a csatornáit a VIII. fejezet rendezi a rendszer moduljaiként.

A nyilvántartásba vétel paramétereit, eljárásait és korlátozásait külön szabályzatok állapítják meg.

### 36. cikk

A működési hozzájárulás a platformon kívüli tevékenység, amelynek hozzájárulása a végrehajtás hitelesítését követően kerül nyilvántartásba POEN-ben.

Az Alapítvány, a Felső Kolo vagy a ZRNO-tulajdonosok olyan feladatot tesznek közzé, amelyet a közjó érdekében el kell végezni. A felhasználó önkéntesen jelentkezik a feladat végrehajtására. A végrehajtást követően a ZRNO-tulajdonosok a hozzájárulás nyilvántartásba vétele előtt hitelesítik a végrehajtást. Az 1. szakaszban, amíg a rendszerben nincsenek ZRNO-tulajdonosok, a hitelesítési funkciót az Alapítvány Igazgatótanácsának tagjai látják el. Valamennyi jelentkezés nyilvánosan látható a rendszer valamennyi felhasználója számára.

A működési hozzájárulás a tevékenységek széles körét ölelheti fel — a helyi rendezvény szervezésétől az infrastruktúrán végzett technikai munkán át a rendszer közösségbeli népszerűsítéséig.

A működési hozzájárulás nem hoz létre munkaviszonyt a munkatörvény 5. cikke értelmében — nincs alárendeltség, személyes munkavégzési kötelezettség vagy díjazás.

A működési hozzájárulás jelentkezési, végrehajtási és hitelesítési eljárását külön szabályzat állapítja meg.

### 37. cikk

Az alapítói hozzájárulás a platform megnyitása előtt végzett munka — a rendszer tervezése, a protokoll elkészítése, valamint a jogi és szervezési előkészítés —, amelynek hozzájárulása utólag kerül nyilvántartásba POEN-ben.

Az alapítói hozzájárulás természeténél fogva olyan működési hozzájárulás, amelyet még a rendszer létezése előtt végeztek el. A Protokoll ezt a hozzájárulást utólag, külön csatornán keresztül veszi nyilvántartásba.

Az alapítói hozzájárulás nyilvántartásba vétele fokozatos, rögzített összegű lépésekben, a POEN-ek teljes számának halmozott növekedéséhez kötve.

Az alapítói hozzájárulás korlátozott. Amikor a Protokoll az előre megállapított felső határig a teljes összeget nyilvántartásba veszi, a csatorna véglegesen bezárul.

Az e csatornán keresztül nyilvántartásba vett POEN-ek az alapítók — a platform megnyitása előtt munkát végző természetes személyek — bejegyzéseiben kerülnek rögzítésre, és ugyanolyan jogállással bírnak, mint minden más POEN. Az alapítói hozzájárulás önálló nyilvántartásba vételi csatorna, és nem érinti a működési hozzájárulás korlátját.

Az alapítói hozzájárulás felső határát, a nyilvántartásba vételi lépések összegét és ütemezését, valamint azt a pontot, amelyen a csatorna bezárul, külön szabályzat állapítja meg.

### 38. cikk

A pénzügyi hozzájárulás dináros bevétel az Alapítványba természetes személyek adományai, valamint jogi személyek és egyéni vállalkozók pártfogása alapján.

Mindkét forma ugyanazon az elven nyugszik: az Alapítványnak nyújtott vissza nem térítendő adomány, amelynek hozzájárulása a Protokoll automatikus aktusaként POEN-ben kerül nyilvántartásba. A dináros eszközök az Alapítványba kerülnek, és nem lépnek be a rendszer elszámolási keretébe.

Amikor a dináros bevételek meghaladják az Alapítvány működési költségeit, a többlet a rendszer programjaiba irányul. A többlet elosztásának szabályait az 1. szakaszban az alapító és az Alapítvány, a 2. szakaszban a Felső Kolo állapítja meg.

### 39. cikk

A természetes személy adománya adományozási szerződés alapján az Alapítványba érkező dináros bevétel.

Az adomány beérkezését követően a Protokoll nyilvántartásba veszi a hozzájárulást az adományozó bejegyzésében POEN-ben, a külön szabályzatban megállapított nyilvántartásba vételi paraméterek szerint. A POEN nyilvántartásba vétele a Protokoll automatikus aktusa, és a POEN tekintetében nem hoz létre szerződéses jogviszonyt az adományozó és az Alapítvány között.

Az Alapítvány az adományozó kérésére a törvénnyel összhangban igazolást állít ki az adományról. Az adomány adójogi kezelése az adományozó jogállásától, az Alapítvány bejegyzett jogállásától és az adományozás idején hatályos adóelőírásoktól függ.

Az adományok nyilvántartásba vételének paramétereit, ideértve az adományok nyilvántartási együtthatóját és az adományszinteket, külön szabályzat állapítja meg.

### 40. cikk

A pártfogó az a jogi személy vagy egyéni vállalkozó, amely pénz, áru vagy szolgáltatás adományozásával támogatja az Alapítvány működését. A pártfogó nem felhasználója a rendszernek, és nem kap sem POEN-t, sem ZRNO-t.

A pártfogási hozzájárulás annak a természetes személynek a bejegyzésében kerül nyilvántartásba, aki a rendszer hitelesített felhasználója — a jogi személy tulajdonosa, illetve maga az egyéni vállalkozó.

Az Alapítvány és a pártfogó közötti viszonyt adományozási szerződés rendezi. Minden adomány a beérkezés pillanatában kerül nyilvántartásba. Az Alapítvány nyilvántartást vezet a pártfogó és azon felhasználó közötti kapcsolatról, akinek a hozzájárulása nyilvántartásba kerül. A tényleges tulajdonos azonosításának eljárását és a többszörös, valamint közvetett tulajdonlás eseteire vonatkozó szabályokat külön szabályzat állapítja meg.

### 40.a cikk

*A platform tartalmához való hozzájárulás*

A felhasználók által a rendszerben létrehozott tartalom a közjó része, és e szabályzat 7. cikkével összhangban kerül licencelésre. A platform hirdetési tere tartalom nélkül nem tölti be rendeltetését; az a felhasználó, aki azt először tölti meg saját ajánlatával, ezt a hiányt szünteti meg, és ezzel hozzájárul a közjóhoz.

A felhasználó javára egyszeri alkalommal 1.000 POEN összegű hozzájárulás kerül nyilvántartásba az első olyan hirdetésért, amellyel javat vagy szolgáltatást kínál, és amely megfelel a Felhasználási feltételekben megállapított tartalmi minimumnak. A csatorna felhasználónként legfeljebb egyszer vehető igénybe, a közzétett hirdetések számától függetlenül.

Hitelesített felhasználó esetében a hozzájárulás a hirdetés közzétételének pillanatában kerül nyilvántartásba.

Nem hitelesített felhasználó esetében a hozzájárulás a hirdetés közzétételének pillanatában kerül feljegyzésre, a Protokollban pedig akkor kerül nyilvántartásba, amikor a következő események közül az első bekövetkezik: a felhasználó hitelesítése a kezességi láncban, vagy a POEN-nyilvántartás frissítése az adott felhasználó javára. A nyilvántartásba vételig a hozzájárulás nem minősül POEN-bejegyzésnek, és nem számít bele a rendszerben nyilvántartásba vett POEN-ek teljes számába.

Az előző két bekezdésben tett megkülönböztetés célja annak megakadályozása, hogy a valódiságukban meg nem erősített fiókok még azelőtt növeljék a nyilvántartásba vett POEN-ek teljes számát, hogy a rendszerben a tényleges részvétel nyoma megjelenne.

Ha a hirdetés a Felhasználási feltételek megsértése miatt eltávolításra kerül azelőtt, hogy a hozzájárulás nyilvántartásba került volna, a feljegyzett hozzájárulás megsemmisül.

A platform tartalmához való hozzájárulás nyilvántartásba vétele a Protokoll automatikus aktusa, és nem számít bele a működési hozzájárulásról szóló szabályzatban és a Támogatási Programok szabályzataiban megállapított napi korlátba.

Annak a felhasználónak, aki e bekezdés hatálybalépésének napján hitelesített, és akinek hozzájárulása feljegyzésre került, de nyilvántartásba nem, a hozzájárulás egyszeri alkalommal, azonos összegben kerül nyilvántartásba.

## VII — A rendszer irányítása

### 41. cikk

Minden rendszernek vannak szabályai, és valakinek meg kell alkotnia, módosítania és biztosítania kell azok alkalmazását.

A KOLO rendszer ezt a kérdést progresszív decentralizációval oldja meg — a centralizált irányítástól a decentralizált felé vezető strukturált pályával, mérhető átmeneti feltételekkel. Az irányítás az alapítónál és az Alapítványnál kezdődik, és fokozatosan átkerül a Közösséghez a Felső Kolón keresztül.

Ez a fejezet rendezi az irányítás két szakaszát, az egyikből a másikba való átmenet feltételeit, a Felső Kolo összetételét és döntéshozatali módját, a szavazatok delegálásának mechanizmusát, az Alapítvány védelmi vétóját és az irányítási hatalom korlátait. A szavazási eljárásokat és a Felső Kolo működésének operatív szabályait a Felső Koloról szóló szabályzat állapítja meg.

### 42. cikk

A rendszer irányítása két szakaszban zajlik.

Az 1. szakaszban a Protokoll szabályait az alapító állapítja meg az Alapítvánnyal együttműködve. Az 1. szakasz addig tart, amíg a rendszerben nyilvántartásba vett POEN-ek teljes száma el nem éri az 1.000.000-t.

A 2. szakaszban a Felső Kolo válik a rendszer irányító testületévé. Az Alapítvány megtartja szolgáltatási és végrehajtói szerepét.

Az 1. szakaszból a 2. szakaszba való átmenet a küszöb elérésekor automatikusan áll be, és nem igényel külön határozatot.

### 43. cikk

Az 1. szakaszban az alapító mérlegelési jogkörrel rendelkezik a rendszer szabályainak módosítására és a paraméterek első tapasztalatok alapján történő kiigazítására.

Az alapító mérlegelési jogköre nem korlátlan. Az alapító nem módosíthatja a négy elvet, nem változtathatja meg azokat a licenceket, amelyek alatt a közjó közzétételre került, és nem sajátíthatja ki a közjót.

Az alapító mérlegelési jogkörének korlátai e szabályzatba mint az Alapítvány normatív aktusába, és egyidejűleg a rendszer technikai architektúrájába is beépítettek.

### 44. cikk

Az 1. szakaszból a 2. szakaszba való átmenet küszöbe 1.000.000 nyilvántartásba vett POEN a rendszerben.

A küszöb elérése egyidejűleg aktiválja a ZRNO beírásának lehetőségét, és létrehozza a Felső Kolót.

Az elszámolási logikában az egymillió nyilvántartásba vett POEN küszöbe a Protokoll bejegyzésének −1.000.000-s állásának felel meg.

### 45. cikk

A Felső Kolo a rendszer irányító testülete, amelyet valamennyi ZRNO-tulajdonos alkot.

A Felső Kolo automatikusan jön létre a ZRNO aktiválásával — amint az első felhasználók a rendszer szabályai szerint beírják a ZRNO-t, ők alkotják a Felső Kolót.

A Felső Kolo dönt a Protokoll szabályairól, a modulok aktiválásáról és deaktiválásáról, valamint minden olyan kérdésről, amely a közjót érinti, kivéve azokat a kérdéseket, amelyek e szabályzattal összhangban ki vannak véve hatásköréből.

A Felső Kolo nem jogi személy.

### 46. cikk

A Felső Kolo négyzetes szavazással hoz döntéseket — olyan mechanizmussal, amelyben a szavazati erő a felhasználó aktív ZRNO-inak számából vont négyzetgyök lefelé kerekített egész értékével egyenlő.

A szabad ZRNO nem ad szavazati erőt. Az a tulajdonos, aki szavazni kíván, köteles aktiválni a ZRNO-t, amivel lemond a leírás lehetőségéről, amíg azt szabad állapotba vissza nem állítja.

A ZRNO nem fogy el a szavazással. A szavazati erő a nyilvántartásba vett ZRNO-ból ered, nem a POEN-ek számából és nem a dináros adományokból.

A döntések fajtáit, a döntéshozatali küszöböket, a határozatképességet és a szavazási eljárást a Felső Koloról szóló szabályzat állapítja meg.

### 47. cikk

Azok a ZRNO-tulajdonosok, akik nem kívánnak vagy nem tudnak részt venni a szavazásban, szavazataikat más ZRNO-tulajdonosra delegálhatják.

A delegálás általános — a delegált a delegáló nevében valamennyi kérdésben szavaz, amíg a delegálás tart.

A delegált szavazatok összeadódnak a delegált saját szavazataival.

A delegálás szabályait, ideértve a visszavonás hatásait és a delegálás korlátait, a Felső Koloról szóló szabályzat állapítja meg.

### 48. cikk

Az Alapítványnak joga van megtagadni a Felső Kolo olyan határozatának végrehajtását, amely veszélyeztetné az Alapítvány működési és pénzügyi fenntarthatóságát azelőtt, hogy elérné a pénzügyi önállóságot — különösen a dináros eszközök elköltéséről szóló határozatokét (ideértve a kollektív beszerzéseket), amelyek rontanák az Alapítvány képességét az alapvető költségek fedezésére és a rendszer infrastruktúrájának fenntartására.

A védelmi vétó nem mérlegelési jellegű. Az Alapítvány köteles minden vétót az Alapítvány fenntarthatóságát fenyegető konkrét veszélyre hivatkozva megindokolni. Az indokolás nélküli vétó olyan visszaélés, amely e szabályzattal összhangban felelősséget von maga után.

### 49. cikk

A védelmi vétó véglegesen és egyirányúan megszűnik, amikor az Alapítvány pénzügyi eszközei elérik a külön szabályzatban megállapított pénzügyi önállósági küszöböt.

A vétó megszűnése visszafordíthatatlan.

A vétó megszűnése nem szünteti meg az Igazgatótanács jogszabályi kötelezettségeit.

### 50. cikk

A Felső Kolo hatalma nem korlátlan. Három korlát van beépítve a rendszerbe.

Az első korlát a négy elv. A Felső Kolo egyetlen határozata sem szüntetheti meg a nem konvertálhatóságot, nem vezethet be vagyoni jogot a bejegyzések felett, nem teheti visszatéríthetővé az adományokat, és nem hagyhatja el az adattakarékosság elvét.

A második korlát az Alapítvány védelmi vétója, amíg hatályban van, valamint az Igazgatótanács jogszabályi kötelezettségei a vétó megszűnése után.

A harmadik korlát a közjó licencei. A Felső Kolo nem cserélheti fel az AGPL-3.0 és a CC BY-SA 4.0 licenceket korlátozóbbakra.

### 51. cikk

A 2. szakaszban az Alapítvány megtartja szolgáltatási szerepét — biztosítja és fenntartja az infrastruktúrát, képviseli a rendszert a jogforgalomban, és alkalmazza a Felső Kolo határozatait. Az Alapítvány szerepe végrehajtói, nem irányítói, az Igazgatótanács jogszabályi felelősségeinek fenntartása mellett.

A dináros eszközök elosztása tekintetében a Felső Kolo ajánlásokat intéz az Alapítvány Igazgatótanácsához. Az Igazgatótanács megvizsgálja az ajánlásokat, és a zálogalapokról és alapítványokról szóló törvény szerinti jogszabályi hatáskörén belül alkalmazza őket, minden ajánlásra indokolt választ adva.

### 52. cikk

Az Alapítvány megszűnése esetén a közjó nem szűnik meg létezni. A szoftver és a tartalom a licencek feltételei szerint hozzáférhető marad.

A nyilvántartás és az infrastruktúra arra a jogutódra száll át, amely elfogadja a rendszer elveit és a közjó őrzőjének kötelezettségeit.

Az átruházás szabályait az Alapszabály és az Alapítvány külön aktusa állapítja meg.

## VIII — A rendszer moduljai

### 53. cikk

A KOLO rendszer elválasztja az alaprendszert a moduloktól. Az alapot azon elemek minimális köre alkotja, amelyek nélkül a rendszer nem létezik. A modulok olyan bővítmények, amelyek funkcionalitást adnak az alaphoz, és saját előfeltételeik szerint aktiválódnak.

Ez a fejezet kereti szinten rendezi a modulokat — az egyes modulok operatív szabályait külön szabályzatok állapítják meg.

A modulok között megkülönböztetendők a kollektív formák — a Kör és a Szövetkezet — mint a felhasználókat tartósabb szerkezetekbe kapcsoló szervezeti egységek, valamint a többi modul, amely a részvétel különleges rendjeit rendezi.

### 54. cikk

A modul olyan bővítmény, amely funkcionalitást ad az alaprendszerhez.

A modulok aktiválásának sorrendje a Közösség szükségleteitől függ, és nincs előre megállapítva.

Új modulok az 1. szakaszban az Alapítvány, a 2. szakaszban a Felső Kolo határozatával adhatók hozzá, feltéve hogy nem sértik a rendszer elveit.

### 55. cikk

A Kör közös érdeken vagy tevékenységen alapuló kollektív forma.

A Körök a felhasználók társulásával jönnek létre. A hatályos törvények szerint bejegyzett meglévő egyesületek és szövetkezetek átvihetik szerkezetüket olyan körbe, amely leképezi összetételüket és szervezetüket.

A Körök ösztönző funkcióval bírnak a növekedési mechanizmuson keresztül — a Protokoll új POEN-eket vesz nyilvántartásba a kör tagjainak számával és a meghatározott küszöbök elérésével összhangban. Az e mechanizmussal keletkezett POEN-ek a kör mint szervezeti egység bejegyzésében kerülnek nyilvántartásba.

A Kör nem rendelkezik jogalanyisággal. Az a egyesület vagy szövetkezet, amely kört alakít, a körtől függetlenül megtartja jogalanyiságát.

A körök alapításának, működésének és megszűnésének szabályait külön szabályzat állapítja meg.

### 56. cikk

A Szövetkezet területi elven alapuló kollektív forma, a szövetkezetekről szóló törvény szerint bejegyezve, teljes jogalanyisággal.

A Szövetkezetnek a rendszeren belül két funkciója van. Az első a helyi koordináció — az a szerkezet, amelyen keresztül az általa lefedett területen zajlik a csere, a kommunikáció és a tevékenységek szervezése. A második a növekedési mechanizmus — a felhasználói létszámküszöbök elérése POEN-ben kerül nyilvántartásba a szövetkezet bejegyzésében, ugyanazon mechanizmus szerint, mint a Köröknél.

Az Alapítvány és a szövetkezet közötti viszonyt együttműködési szerződés szabályozza, miközben a szövetkezet független jogi személyként megtartja teljes önállóságát. A szövetkezet nem válik a közjó egyetlen részének tulajdonosává sem.

A szövetkezetnek mint a szövetkezetekről szóló törvény szerint bejegyzett jogi személynek saját jogszabályi kötelezettségei vannak — üzleti könyvek vezetése, éves beszámolás és a szövetkezeti elvek tiszteletben tartása. Az Alapítvány és a szövetkezetek közötti együttműködés szabályait külön szabályzat állapítja meg.

### 57. cikk

A szociális programok a POEN automatikus nyilvántartásba vételének mechanizmusát jelentik azon felhasználói csoportok számára, amelyeknek a közjóban való szerkezeti részvételét a Protokoll elismeri akkor is, ha az nem egyedi tevékenységekben nyilvánul meg.

Az új POEN-ek minősített csoportok javára történő automatikus nyilvántartásba vétele újraelosztó hatással bír: az új bejegyzések növelik a rendszerben nyilvántartásba vett POEN-ek teljes számát, amivel valamennyi felhasználó számára megváltoztatják az elszámolási együtthatót. Ez a hatás tudatos tervezési döntés — a rendszer elismeri, hogy a természeténél fogva folyamatos és szétterülő részvétel nem vehető nyilvántartásba egyedi tevékenységeken keresztül.

A kezdeti minősített csoportok az anyák (elsődleges gondviselők), az idősebb felhasználók, a különleges gondozási rendben lévő felhasználók és a tanulmányokat folytató felhasználók. Új csoportok az 1. szakaszban az Alapítvány, a 2. szakaszban a Felső Kolo határozatával adhatók hozzá.

A minősített csoporthoz tartozó felhasználó hitelesíti az e jogállást megerősítő adatokat. A hitelesítést követően a Protokoll automatikusan új POEN-bejegyzéseket ír be az adott felhasználó javára, konkrét tevékenység szükségessége nélkül.

A szociális programokban való automatikus nyilvántartásba vétel nem szociális segély és nem térítés — POEN-ben történő automatikus nyilvántartásba vétel, amely lehetővé teszi a felhasználók egyenrangúbb részvételét a rendszerben.

A szociális programok a személyes adatok különleges kategóriáinak hitelesítését igénylik a személyes adatok védelméről szóló törvény értelmében. Ezen adatok kezelésének jogalapja a szociális programban részt vevő felhasználó kifejezett hozzájárulása. A hozzájárulás bármikor visszavonható, aminek következménye a POEN automatikus nyilvántartásba vételének megszűnése.

A minősített csoportokat, a jogállás hitelesítésének feltételeit és a nyilvántartásba vétel paramétereit külön szabályzat állapítja meg. E modul aktiválása az adatvédelmi hatásvizsgálat frissítését igényli.

### 58. cikk

Ez a modul határozza meg a rendszer kiskorú felhasználóira vonatkozó jogok, korlátozások és védelem különleges rendjét, a tizenöt évnél fiatalabb személyekre vonatkozó további korlátozásokkal, a személyes adatok védelméről szóló törvény 16. cikkével összhangban.

A kiskorú felhasználó nem férhet hozzá önállóan a rendszerhez — a hozzáférés a szülő vagy törvényes képviselő beleegyezését igényli.

A kiskorú felhasználó rendszerbeli tevékenységének terjedelme korlátozott. A kiskorú felhasználó a tizennyolcadik életév betöltéséig nem írhat be ZRNO-t, és nem vehet részt az irányításban a Felső Kolón keresztül.

A kiskorúak adatainak kezelése fokozott követelmények alá esik. A szülő vagy törvényes képviselő beleegyezése az adatkezelés jogi előfeltétele.

A hozzáférés szabályait, az engedélyezett tevékenységek terjedelmét, a csere korlátait és a kiskorú felhasználók védelmére szolgáló intézkedéseket külön szabályzat állapítja meg. E modul aktiválása az adatvédelmi hatásvizsgálat frissítését igényli.

### 59. cikk

Az internacionalizáció a rendszer új régiókra való infrastrukturális kiterjesztése. A rendszer kiterjeszti infrastruktúráját, nyilvántartását és szabályait új területekre, megtartva az egységes Protokollt és a közjó egységes nyilvántartását.

Az új régiókra való terjeszkedés több dimenzióban igényel alkalmazkodást: a célországi joghatóság jogi kerete, a platform nyelvi lokalizációja, a helyi kezességi lánc kiépítése és esetlegesen helyi szövetkezetek létrehozása.

E modul aktiválásának előfeltétele a stabil, aktív Felső Kolóval rendelkező rendszer, elegendő tapasztalat a rendszer alaprégióban való működésével kapcsolatban, valamint a célországi joghatóságokra vonatkozó jogi elemzés. A terjeszkedésről a Felső Kolo dönt.

Az Európai Unió területére való terjeszkedés az általános adatvédelmi rendelettel való teljes összhangot igényel. A más joghatóságokra való terjeszkedés az adatvédelemre, a digitális vagyonra, az alapítványokra és a szövetkezetekre vonatkozó helyi előírások elemzését igényli.

## IX — Átláthatóság és a személyes adatok védelme

### 60. cikk

A KOLO rendszer természeténél fogva személyes adatokat kezel — hitelesítési gráf, hozzájárulási nyilvántartás, adományokra vonatkozó adatok, valamint egyes modulok összefüggésében az adatok különleges kategóriái. Ugyanakkor a rendszer az adattakarékosság elvén nyugszik, mint a négy elv egyikén.

Ez a fejezet rendezi, hogyan közelít a rendszer az adatvédelemhez: a védelem architektúráját formáló két tervezési döntést, az adatkezelés jogalapját és az Alapítvány adatkezelői helyzetét, a törléshez való jog és a nyilvántartás integritása közötti viszonyt, az Alapítvány kötelezettségeit és a felhasználók jogait. A rendszer a személyes adatok védelméről szóló törvényt alkalmazza.

A technikai és szervezési védelmi intézkedéseket, az adatvédelmi szabályzatot és a felhasználói jogok gyakorlásának eljárásait külön aktusok állapítják meg.

### 61. cikk

A rendszer adatvédelme a beépített és alapértelmezett adatvédelmen alapul.

Az első tervezési döntés a nyilvántartás álnevessége. A nyilvántartás bejegyzései álnevekhez kötődnek, nem személynevekhez. Nem létezik központi tábla, amely az álneveket a felhasználók személyazonosságához kötné. Az álnevesség nem anonimitás — az álnevesített adatok személyes adatok maradnak, mivel további információk birtokában azonosított személyhez köthetők.

A második tervezési döntés az adattakarékosság. A platform kizárólag a rendszer működéséhez szükséges adatokat gyűjti. A felhasználó önkéntesen megadhat további adatokat a platform könnyebb használata érdekében, de ez nem feltétele sem a valóságbizonyítéknak, sem a rendszer funkcióihoz való hozzáférésnek.

### 62. cikk

A rendszer kezeli a felhasználók személyes adatait — a platform felhasználóira vonatkozó adatokat, a valóságbizonyíték adatait, az önkéntesen megadott adatokat, a tevékenységi adatokat, az adományokra és a pártfogásra vonatkozó adatokat, valamint egyes modulok összefüggésében az adatok különleges kategóriáit és a kiskorúak adatait.

Az adatkategóriákat, azok terjedelmét, célját és kezelési rendjét az adatvédelmi szabályzat és az adatkezelési tevékenységek nyilvántartása állapítja meg.

### 63. cikk

A KOLO Alapítvány az adatkezelő — meghatározza az adatkezelés céljait és eszközeit. A Protokoll az adatkezelés technikai eszköze. A személyes adatok kezelése a törvényben megállapított jogalapokon nyugszik; az egyes adatkategóriákra vonatkozó jogalapot az adatvédelmi szabályzat és az adatkezelési tevékenységek nyilvántartása állapítja meg.

Ha az Alapítvány harmadik személyeket bíz meg az infrastruktúra fenntartásával, e személyek adatfeldolgozók. Az Alapítvány és az adatfeldolgozó közötti viszonyt a törvénnyel összhangban adatfeldolgozási szerződés rendezi.

### 64. cikk

A felhasználó személyes adatai törléséhez való joga és a közjó nyilvántartásának integritása az azonosító és az elszámolási adatok szétválasztásával kerül összehangolásra. Az anonimizálás mechanikáját a jogállás megszűnésekor e szabályzat 34. cikke rendezi.

### 65. cikk

Az Alapítvány köteles az adatkezelés megkezdése előtt adatvédelmi hatásvizsgálatot lefolytatni, adatvédelmi tisztviselőt kinevezni, és a kockázathoz igazodó technikai és szervezési védelmi intézkedéseket alkalmazni.

Az adatok különleges kategóriáinak vagy kiskorúak adatainak kezelését bevezető modulok aktiválása az aktiválás előtt a hatásvizsgálat frissítését igényli.

Ha a rendszer infrastruktúrája a Szerb Köztársaságon kívüli kiszolgálókat is magában foglal, a személyes adatok országon kívülre történő továbbítása a törvénnyel összhangban a határokon átnyúló továbbításra vonatkozó szabályok alá esik.

### 66. cikk

A rendszer felhasználóit megilleti minden jog, amelyet a törvény a személyes adatok védelmével kapcsolatban biztosít számukra. Az Alapítvány hozzáférhető mechanizmust biztosít a kérelmek benyújtására, és a törvényben megállapított határidőkben jár el.

A felhasználói jogok gyakorlásának eljárásait a KOLO rendszer adatvédelmi szabályzata állapítja meg.

### 67. cikk

A hozzájárulási nyilvántartás álneves formában nyilvános. Minden felhasználó ellenőrizheti a nyilvántartás bejegyzéseit és az elszámolási keret konzisztenciáját.

A nyilvántartás átláthatósága biztosítja a rendszer felhasználók általi felügyeletét, és csökkenti a manipuláció lehetőségét.

A nyilvántartás átláthatósága nem terjed ki azokra az adatokra, amelyek közzététele sértené a felhasználók magánéletét — a hitelesítési gráfra, az önkéntesen megadott adatokra és az adatok különleges kategóriáira. Az álneves hozzájárulási nyilvántartás a hitelesített felhasználók számára elérhető, míg a látogatók és a nem hitelesített felhasználók a 28. cikkel összhangban általános mutatókat (összesítéseket) látnak. A platform hirdetési terében a hirdetések megtekintése külön kerül rendezésre (16. cikk), és eltér a hozzájárulási nyilvántartástól. Az adatok nyilvános hozzáférhetőségének terjedelmét az adatvédelmi szabályzat állapítja meg.

A felhasználó minden pillanatban látja saját bejegyzéseit és saját feljegyzett, még nyilvántartásba nem vett hozzájárulását (40.a cikk 4. bekezdés). A feljegyzett hozzájárulás a többi felhasználó számára nem látható, és a nyilvántartásba vételig nem számít bele a nyilvános összesítésekbe.

## X — A KOLO rendszer jogi természete és a négy elv

### 68. cikk

A KOLO rendszert nem pénzügyi szolgáltatásnak, fizetési szolgáltatásnak vagy befektetési konstrukciónak szánták vagy tervezték. Ez a fejezet rendezi, mi a KOLO és mi nem, és megállapítja azt a négy elvet, amely védi a rendszer jogi helyzetét.

Az elvek biztosítják, hogy a rendszer elszámolási egységei ne válhassanak pénzzé vagy pénzügyi eszközzé, hogy a hozzájárulási nyilvántartás ne válhasson forgalomképes vagyonná, hogy az adományok ne válhassanak jogvásárlássá, és hogy a rendszer ne gyűjtsön olyan adatokat, amelyekre nincs szüksége.

Ezek az elvek nem olyan szabályok, amelyeket a rendszer maga megváltoztathat — ezek azok a határok, amelyeken belül a rendszer létezik. Módosításuk megváltoztatná a rendszer jogi természetét.

### 69. cikk

A KOLO rendszer a közjó részvételi rendszere, amely a szociális és szolidáris gazdaság, valamint a kölcsönösség elvein alapul. A KOLO rendszer nem jogi személy, sem külön jogi kategória.

A KOLO rendszer nem fizetési intézmény, nem digitális vagyon kibocsátója, nem kollektív befektetési konstrukció és nem munkáltató. A rendszer jogi minősítése az e szabályzatban megállapított szerkezeti tulajdonságaiból ered, különösen a négy elvből, valamint a POEN-re, a ZRNO-ra és a működési hozzájárulásra vonatkozó szabályokból.

A felhasználó és az Alapítvány közötti viszony a felhasználási szabályokkal rendezett szerződéses jogviszony. A POEN nyilvántartásba vétele nem ellenszolgáltatás a felhasználó Alapítvány felé fennálló bármely kötelezettségéért.

### 70. cikk

A KOLO rendszer jogi helyzete négy elven nyugszik: a nem konvertálhatóságon, a bejegyzések feletti vagyoni jog hiányán, az adományok és az automatikus nyilvántartásba vétel visszafordíthatatlanságán, valamint az adattakarékosságon.

A négy elv a rendszer szerkezeti korlátja. Ezek egyetlen irányítási döntéssel sem módosíthatók vagy szüntethetők meg, ideértve a Felső Kolo határozatát is.

E szabályzat olyan módosítása, amely a négy elv bármelyikét módosítaná vagy megszüntetné, nem megengedett. A négy elv bármelyikének megsértése megváltoztatja a rendszer jogi természetét.

A négy elvet e fejezet további rendelkezései fejtik ki.

### 71. cikk

A KOLO rendszer egyetlen elszámolási egysége sem konvertálható pénzzé, valutává, sem semmilyen, a rendszeren kívül értékkel bíró eszközzé, sem közvetlenül, sem közvetve.

A konverziós tilalom a közvetett konverziót is magában foglalja, ideértve az elszámolási egység utalványokra, ajándékkártyákra vagy külső értékkel bíró egyéb eszközökre való cseréjét.

Az Alapítvány nem vásárol vissza sem POEN-t, sem ZRNO-t, és nem biztosítja azok dinárra vagy más fizetési eszközre való átváltását.

### 72. cikk

A felhasználóknak nincs vagyoni joguk a rendszer nyilvántartásában szereplő POEN- és ZRNO-bejegyzések felett. A POEN- és ZRNO-bejegyzések a közjó nyilvántartásában szereplő adatok, nem pedig a felhasználó vagyonában lévő eszközök.

A POEN- és ZRNO-bejegyzések nem ruházhatók át és nem öröklődnek vagyoni jogként.

A nyilvántartásba vett hozzájárulás és a felhasználó nyilvántartásba vett helyzete nem képez követelést az Alapítvánnyal szemben, sem alapot vagyonjogi igényre.

### 73. cikk

Az Alapítványnak nyújtott pénz-, áru- vagy szolgáltatásadomány vissza nem térítendő. Az adományozó az adomány alapján nem szerez visszatérítéshez való jogot, irányítási jogot az Alapítványban, sem részesedést a rendszerben.

A POEN nyilvántartásba vétele a Protokoll automatikus aktusa, amely a rendszer szabályai szerint hajtódik végre. A POEN nyilvántartásba vétele nem ellenszolgáltatás az adományért, sem a felhasználó Alapítvány felé fennálló bármely más kötelezettségéért.

Nem létezik szerződés dinárok POEN-re való cseréjéről. Az adományozási szerződés nem tartalmaz rendelkezéseket a POEN-ről vagy annak nyilvántartásba vételéről.

Az adományozónak nincs szerződéses vagy egyéb követelése az Alapítvánnyal szemben a POEN nyilvántartásba vétele iránt. A POEN nyilvántartásba vétele kizárólag a rendszer szabályai szerint, az adományozás aktusától függetlenül történik.

### 74. cikk

A rendszerben kizárólag a rendszer működéséhez szükséges adatok kerülnek gyűjtésre és kezelésre.

Az Alapítvány a platform felhasználóinak személyes adatait nem saját adatbázisaiban tárolja; ezek az adatok azon az infrastruktúrán maradnak, amelyen a Protokoll működik.

Azokat az adatokat, amelyeket a felhasználó a platform könnyebb használata érdekében önkéntesen ad meg, a felhasználó módosíthatja vagy törölheti; megadásuk nem feltétele sem a valóságbizonyítéknak, sem a rendszer funkcióihoz való hozzáférésnek.

## XI — Felelősség, felhasználói kockázatok és a jogviták rendezése

### 75. cikk

A rendszer minden felhasználója bizonyos kockázatokat vállal és bizonyos felelősséget visel. Ez a fejezet rendezi, ki miért felel a rendszerben, mely kockázatokat kell a felhasználónak a részvétel előtt megértenie, és hogyan kerülnek rendezésre a jogviták.

### 76. cikk

Az Alapítvány felel az infrastruktúra biztosításáért és fenntartásáért, a személyes adatok törvénnyel összhangban történő védelméért, valamint a rendszer szabályainak a szabályzatban megállapított módon való alkalmazásáért.

Az Alapítvány nem felel a felhasználók javak- és szolgáltatáscserében vállalt kötelezettségeinek teljesítéséért. Az Alapítvány nem közvetít a cserében, és nem fél a javakat és szolgáltatásokat cserélő felhasználók közötti jogviszonyban.

Az Alapítvány nem szavatolja, hogy a rendszer megszakítás nélkül fog működni, hogy az infrastruktúrát nem érintik technikai problémák, vagy hogy a nyilvántartás minden biztonsági incidenstől védett lesz. Az Alapítvány köteles ésszerű technikai és szervezési védelmi intézkedéseket tenni.

### 77. cikk

A javak és szolgáltatások cseréjének teljesítéséért, minőségéért és kockázatáért az abban részt vevő felhasználók felelnek, a kötelmi jog általános szabályai szerint.

A felhasználó felel a rendszernek szolgáltatott adatok pontosságáért. A kezességi láncban részt vevő felhasználó felel a valódiság megerősítésének valóságtartalmáért, a valóságbizonyítékra vonatkozó szabályokkal összhangban.

Az a felhasználó, aki visszaél a rendszerrel, a jogállás megszűnésére és felfüggesztésére vonatkozó szabályokkal összhangban álló intézkedések alá esik.

### 78. cikk

A felhasználónak a rendszerben való részvétel előtt meg kell értenie a következő kockázatokat:

A POEN-nek és a ZRNO-nak nincs a rendszeren kívüli értéke, és nem konvertálhatók pénzzé. A nyilvántartásba vett hozzájárulás nem képez követelést az Alapítvánnyal szemben.

Az elszámolási együttható a rendszerbeli tevékenységgel változik. A ZRNO-tulajdonos helyzetének megváltozása nem hozam, és nem szavatolt.

Az Alapítvány megszűnhet létezni. Ebben az esetben a közjó őrzőjének szerepe és az infrastruktúráért való felelősség az Alapszabállyal összhangban a jogutódra száll, de a rendszer működésének folytonossága nem szavatolt.

A rendszert érinthetik technikai problémák, biztonsági incidensek vagy a működését befolyásoló szabályozási változások.

Az Alapítványnak nyújtott adományok vissza nem térítendők, függetlenül a rendszer további fejlődésétől.

A javak és szolgáltatások rendszeren belüli cseréje adóvonzatokkal járhat a felhasználó számára. Az Alapítvány nem nyújt adótanácsadást. A felhasználó felel saját adókötelezettségeiért.

### 79. cikk

A felhasználók közötti, cserékkel kapcsolatos jogviták a kötelmi jog általános szabályai szerint, az illetékes bíróság előtt kerülnek rendezésre.

A felhasználók és az Alapítvány közötti, a rendszer szabályainak alkalmazásával kapcsolatos jogviták, amikor csak lehetséges, megegyezéssel kerülnek rendezésre. Ha a megegyezés nem lehetséges, a jogvitát a zombori (Sombor) illetékes bíróság rendezi, kivéve ha a törvény a helyi illetékességet másként állapítja meg.

A személyes adatok védelmével kapcsolatos jogviták a törvénnyel összhangban kerülnek rendezésre, ideértve a felhasználó jogát a közérdekű információkkal és a személyes adatok védelmével foglalkozó biztoshoz benyújtott panaszra.

A jogviták rendezésének belső mechanizmusai külön szabályzattal vagy a Felső Kolo határozatával hozhatók létre.

## XII — Záró rendelkezések

### 80. cikk

E szabályzatot a KOLO Alapítvány Igazgatótanácsa fogadja el és módosítja.

Az 1. szakaszban az Igazgatótanács az alapító javaslatára vagy saját kezdeményezésére módosítja a szabályzatot. A 2. szakaszban az Igazgatótanács a Felső Kolo határozata alapján módosítja a szabályzatot, az e szabályzatban megállapított irányítási szabályokkal összhangban.

E szabályzat olyan módosítása, amely a négy elv bármelyikét módosítaná vagy megszüntetné, nem megengedett.

A szabályzat minden módosítása a hatálybalépés előtt olyan határidőben kerül közzétételre a rendszer felhasználói felé, amely lehetővé teszi a módosítások megismerését. A hatálybalépés előtti közzététel minimális határidejét külön szabályzat állapítja meg.

### 81. cikk

E szabályzat ernyőjellegű működési aktus. A külön szabályzatok az e szabályzat által hivatkozott egyes területeket fejtik ki, és összhangban kell lenniük e szabályzattal.

A külön szabályzatok ugyanazon eljárás szerint kerülnek elfogadásra és módosításra, mint e szabályzat, kivéve ha e szabályzat másként rendelkezik.

A Felhasználási feltételek a platformhoz való hozzáférés szabályait, a cseretér használatát és a technikai használat egyéb kérdéseit rendezik, és nem lehetnek ellentétesek e szabályzattal.

Az adatvédelmi szabályzat a felhasználói jogok személyes adatok védelmével kapcsolatos gyakorlásának eljárásait rendezi, és összhangban kell lennie e szabályzattal és a törvénnyel.

Az aktusok hierarchiáját, egymáshoz viszonyított rangjukat és az ellentmondások feloldásának szabályait az aktusok hierarchiájáról szóló szabályzat rendezi.

### 82. cikk — A rendszer indulása (átmeneti rendelkezés)

A rendszer üzembe helyezésekor nincsenek korábban hitelesített felhasználók, akik megerősíthetnék az első felhasználók valódiságát, sem nyilvántartásba vett POEN-ek, amelyekből ZRNO-t lehetne beírni. Ezért az első ZRNO-tulajdonosok — a kezdeti felhasználók, az Alapítvány Igazgatótanácsának tagjai — közvetlenül, az Alapítvány Igazgatótanácsának határozatával kerülnek megállapításra.

A kezdeti felhasználók a rendszer indulásának egyszeri eseményeként mentesülnek a ZRNO beírásának 19. cikk szerinti feltétele (a nyilvántartásba vett POEN-ek minimuma), valamint a 32. cikk és a valóságbizonyítékról szóló szabályzat azon kezességi lánc szabályai alól, amelyek korábbi hitelesítő létét feltételezik. Ők képezik a kezességi lánc kiindulópontját; kezdeti valóságindexüket, a felügyelet alóli mentességüket és az anticirkuláris szabály alóli mentességüket a valóságbizonyítékról szóló szabályzat rendezi (VI. fejezet — Kezdeti mechanizmus).

A kezdeti felhasználók nem képeznek külön jogállást a 27. cikk értelmében: ők a valóságbizonyítékról szóló szabályzatban megállapított jellemzőkkel bíró ZRNO-tulajdonosok, és egyidejűleg gyakorolhatják az Igazgatótanács operatív jogosítványait az 1. szakaszban. A rendszer megszilárdulását követően minden új ZRNO-tulajdonos rendes úton szerzi meg jogállását (19., 29. és 30. cikk).

A kezdeti felhasználók számát, alapítói hozzájárulásuk elosztását és operatív jogosítványaikat az alapítói hozzájárulásról szóló szabályzat és az Alapítvány Alapszabálya állapítja meg.

### 83. cikk

E szabályzat a KOLO Alapítvány Igazgatótanácsa általi elfogadás napján lép hatályba.
