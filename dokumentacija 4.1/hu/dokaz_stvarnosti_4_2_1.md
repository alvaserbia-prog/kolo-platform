> **Nem hivatalos fordítás.** A magyar változat kizárólag a könnyebb megértés célját szolgálja. Jogilag a szerb eredeti szöveg kötelező érvényű; bármilyen eltérés esetén a szerb változat az irányadó.

# Szabályzat a valóságbizonyítékról

*Ez a szabályzat a valóságbizonyíték operatív mechanikáját rendezi — a KOLO rendszer felhasználói hitelesítésének személyes ismeretségen alapuló modelljét. A KOLO rendszerről szóló szabályzat 32. cikkének (4) bekezdése és 15. cikkének 2. pontja alapján kerül elfogadásra.*

## I — Általános rendelkezések

### 1. cikk

*A szabályzat tárgya*

E szabályzat rendezi a valóságindexet, a kezességi láncot, a hitelesítési bejegyzést, a hitelesítésért járó POEN nyilvántartását, a hitelesítési kapacitást, a felügyeletet és a felügyelet eredményét, a felügyeleti ügyet, a körkörösség elleni szabályt, a kezdeti mechanizmust, a státusz megszűnésének a hitelesítésekre gyakorolt következményeit, a hamis hitelesítés megállapításának eljárását, valamint a hálózatból kivont POEN-bejegyzések megtérítését.

Azok a kifejezések, amelyeket e szabályzat nem határoz meg, a KOLO rendszerről szóló szabályzatban megállapított jelentéssel bírnak.

### 2. cikk

*Viszony a KOLO rendszerről szóló szabályzathoz*

Ez a szabályzat a KOLO rendszerről szóló szabályzat V. fejezetének rendelkezéseit dolgozza ki. Eltérés esetén a KOLO rendszerről szóló szabályzat rendelkezései élveznek elsőbbséget.

## II — A valóságindex

### 3. cikk

*Fogalom és kiszámítás*

A valóságindex olyan számérték, amely a felhasználó kezességi láncban való hitelesítettségének fokát fejezi ki. Minden hitelesítés 10 százalékponttal növeli a hitelesített felhasználó indexét. Az index tartománya 0 %-tól 100 %-ig terjed.

Az a felhasználó, akinek indexe eléri a 100 %-ot, tovább nem hitelesíthető. A 100 % feletti hitelesítések nem kerülnek nyilvántartásba.

### 4. cikk

*Az index funkcionális hatása*

A rendes hitelesített felhasználók esetében a valóságindexnek két funkciója van: feltételül szabja a rendszer funkcióihoz való hozzáférést, és meghatározza a hitelesítési kapacitást.

A legalább 10 %-os indexszel rendelkező felhasználó teljes hozzáféréssel bír a platform valamennyi funkciójához — a cseréhez, a hozzájárulás nyilvántartásához, a Körökben, szövetkezetekben és szociális programokban való részvételhez, valamint más felhasználók valóságának megerősítéséhez. Az a hitelesített felhasználó, akinek indexe 10 %-nál alacsonyabb, megtartja hitelesített felhasználói státuszát, de nem fér hozzá a platform funkcióihoz mindaddig, amíg indexe ismét el nem éri a 10 %-ot.

A kezdeti felhasználók és a ZRNO-tulajdonosok esetében a valóságindex funkcionális hatás nélküli nyilvántartás — a kapacitás és a hozzáférés a státuszukból ered, nem az indexből.

## III — A kezességi lánc

### 5. cikk

*A hitelesítés mechanizmusa*

A hitelesítés a kezességi láncban történik: a hitelesített felhasználó közvetlen ismeretség alapján erősíti meg az új felhasználó valóságát. A hitelesítő három dolgot erősít meg: a valóságot (a felhasználó természetes személyként létezik), az egyediséget (nincs másik fiókja a rendszerben) és a folytonosságot (ugyanaz a személy fér hozzá a rendszerhez).

A hitelesítés a személyes ismeretség aktusa, nem pedig okmányellenőrzés. A hitelesítő nem gyűjti és nem továbbítja a hitelesített személyes okmányait.

A hitelesítés olyan közvetlen személyes ismeretségen alapul, amely elegendő ahhoz, hogy a hitelesítő saját felelősségére kezeskedjen a hitelesített felhasználó valóságáért, egyediségéért és folytonosságáért. E szabályzat nem írja elő ezen ismeretség megszerzésének módját, és nem követeli meg a fizikai jelenlétet a hitelesítés pillanatában; a hitelesítő maga ítéli meg, hogy eléggé ismeri-e a felhasználót ahhoz, hogy érte kezeskedjen.

A Platform technikai mechanizmust biztosít a hozzájárulásra és a fiók összekapcsolására: a hitelesítést kérő felhasználó egyszeri kódot generál, amellyel hozzájárul a hitelesítéshez és fiókját ehhez az aktushoz köti, az őt ismerő hitelesítő pedig e kóddal folytatja le a hitelesítést. Ez a mechanizmus nem gyűjti a hitelesített személyes adatait, és nem a jelenlét bizonyítéka, hanem a hitelesített hozzájárulásának és a fiók azonosságának megerősítése.

A hitelesített felhasználó értesítést kap a lefolytatott hitelesítésről, és bejelentheti azt, ha a hitelesítőt nem ismeri.

A hitelesítő felel a hitelesítés valóságtartalmáért. Az a hitelesítés, amellyel olyan személy valóságát erősítették meg, aki természetes személyként nem létezik, aki nem egyedi, vagy akinek folytonossága nem biztosított, hamis hitelesítésnek minősül, és a jelen szabályzat VIII. fejezete szerinti következményeket vonja maga után.

### 6. cikk

*Hitelesítési bejegyzés*

Minden hitelesítés hitelesítési bejegyzésben kerül nyilvántartásba, amely öt adatot tartalmaz:

— a hitelesítő azonosítója (álnév);

— a hitelesítő hitelesítésének sorszáma — hányadik hitelesítés ez a hitelesítő által elvégzettek sorában;

— a hitelesített azonosítója (álnév);

— a hitelesítés időbélyege;

— a felügyelő azonosítója (álnév), vagy üres mező, ha a hitelesítés nem esik felügyelet alá.

A felügyelet alá eső hitelesítés a felügyeleti eredmény rögzítésekor kiegészül a felügyeleti adatokkal is: a felügyelet eredményével, az „ellenőrzésre“ és „vitatott“ eredmények mellett pedig a gyanú alanyával és az e szabályzat 11. cikke szerinti indokkóddal. A felügyeleti adatokat minden olyan felügyelőre nézve vezetni kell, aki eredményt rögzített.

A felügyeleti adatok nem nyilvánosak. A hitelesítési gráf részét képezik, és rájuk a KOLO rendszerről szóló szabályzat 67. cikkének láthatósági szabályai alkalmazandók; sem a hitelesítőnek, sem a hitelesített felhasználónak nem jelennek meg.

A hitelesítési bejegyzés a közös jó nyilvántartásának része. A hitelesítési bejegyzések a KOLO rendszerről szóló szabályzat 32. cikke értelmében vett hitelesítési gráfot alkotják.

### 7. cikk

*A hitelesítésért járó POEN nyilvántartása*

A hitelesítési bejegyzés rögzítésével a Protokoll automatikusan új POEN-bejegyzéseket ír be: a hitelesítőnek 1.000 POEN-t, a hitelesítettnek 1.000 POEN-t.

Ha a hitelesítés felügyelet alá esik, a Protokoll 500 POEN-t ír be annak az első felügyelőnek, aki felügyeleti eredményt rögzít (11. cikk), függetlenül attól, melyik eredményt rögzítette. A beírás az eredmény rögzítésének pillanatában történik, nem a hitelesítés pillanatában; addig felügyelő nincs is kijelölve.

Annak a felügyelőnek, akihez a bejegyzést az „ellenőrzésre“ eredmény nyomán továbbították, POEN nem kerül beírásra. Hitelesítésenként legfeljebb egy 500 POEN összegű beírás kerül nyilvántartásba.

Ha a hitelesítés nem esik felügyelet alá, az összes nyilvántartás 2.000 POEN. Ha felügyelet alá esik, az első felügyeleti eredmény rögzítésével az összes nyilvántartás 2.500 POEN.

A felügyelő munkája kerül nyilvántartásba, nem a hitelesítéssel való egyetértése. Az a felügyelő, aki megállapítja, hogy valami nincs rendben, ugyanazt a munkát végzi, mint az, aki semmi kifogásolhatót nem talál, ezért a nyilvántartás is azonos; a nyilvántartás megerősítő eredményhez kötése az elnézésre ösztönözne.

A hitelesítésért járó POEN nyilvántartásba vétele a Protokoll automatikus aktusa a KOLO rendszerről szóló szabályzat 15. cikk 2. pontja értelmében.

## IV — Hitelesítési kapacitás és felügyelet

### 8. cikk

*A rendes felhasználók hitelesítési kapacitása*

A rendes hitelesített felhasználó hitelesítési kapacitása a valóságindex tízzel osztott értéke, lefelé kerekített egész számban kifejezve. A 10 %-os indexszel rendelkező felhasználó kapacitása 1; a 30 %-os indexszel rendelkezőé 3; a 100 %-os indexszel rendelkezőé 10.

Minden elvégzett hitelesítés egy kapacitáshelyet használ fel. Az a felhasználó, aki valamennyi helyét felhasználta, nem végezhet új hitelesítést mindaddig, amíg a felügyelő fel nem tölti a kapacitását.

### 9. cikk

*A kezdeti felhasználók és a ZRNO-tulajdonosok kapacitása*

A kezdeti felhasználók és a ZRNO-tulajdonosok kapacitása hitelesítéskor nem fogy. Ők kapacitáskorlát nélkül végezhetnek hitelesítéseket.

### 10. cikk

*Felügyelet*

A rendes hitelesített felhasználók által végzett hitelesítések felügyelet alá esnek. A kezdeti felhasználók és a ZRNO birtokosai által végzett hitelesítések nem esnek felügyelet alá.

Felügyelő minden ZRNO-birtokos. A felügyeleti funkció automatikusan a státuszból következik, kinevezés nélkül, és nem függ a rendszer fázisától.

A felügyelő megvizsgálja az elvégzett hitelesítés jogszerűségét, és e szabályzat 11. cikkének megfelelően rögzíti a felügyelet eredményét. A felügyelő e szabályzat 7. cikkének megfelelően 500 POEN-t kap.

Felügyeletet nem végezhet az a felhasználó, aki a felügyelt hitelesítésben részt vett — sem hitelesítőként, sem hitelesítettként. Ugyanaz a felügyelő nem rögzíthet kétszer eredményt ugyanazon hitelesítési bejegyzés felett.

### 11. cikk

*A felügyelet eljárása és eredménye*

A felügyeletre a hitelesítés után kerül sor. A hitelesítés a hitelesítési bejegyzés rögzítésével lép hatályba. A felügyelő utóbb megvizsgálja a hitelesítést, és a hitelesítési bejegyzésben rögzíti a felügyelet eredményét.

A felügyelet eredménye három közül az egyik:

— **rendben** — a felügyelő semmi kifogásolhatót nem talál; a hitelesítő felhasznált kapacitáshelye visszaáll, és a hitelesítő tovább hitelesíthet;

— **ellenőrzésre** — a felügyelő számára valami nem világos, és kéri, hogy a bejegyzést még egy felügyelő nézze meg; a kapacitáshely nem áll vissza, a bejegyzés pedig a többi felügyelő számára elérhető marad. Ez az eredmény nem állítás arról, hogy a hitelesítés hamis, hanem felhívás, hogy más is megnézze;

— **vitatott** — a felügyelő úgy véli, hogy a hitelesítés nem valós; a kapacitáshely nem áll vissza.

Az „ellenőrzésre“ és „vitatott“ eredmények mellett a felügyelő köteles megadni a gyanú alanyát — a hitelesítőt, a hitelesített felhasználót, mindkét felhasználót vagy a hálózat egy részét —, valamint az e cikk 4. bekezdése szerinti listáról az indokkódot. A „rendben“ eredmény nem igényel indokolást.

Az indokkódok a következők:

— *nem ismerik egymást* — alapos okkal feltehető, hogy a hitelesítő és a hitelesített felhasználó nem ismerik egymást közvetlenül;

— *a fiók nem mutatja a valóság jeleit* — a hitelesített felhasználó fiókja nem mutatja jelét annak, hogy mögötte valós személy áll;

— *kettős fiók* — alapos okkal feltehető, hogy a hitelesített felhasználónak már van fiókja a rendszerben;

— *hitelesítési minta* — a hitelesítések eloszlása vagy gyakorisága összehangolt eljárásra utal;

— *a hitelesített bejelentése* — a hitelesített felhasználó bejelentette, hogy nem ismeri a hitelesítőt (5. cikk 5. bekezdés);

— *egyéb* — az előző pontokban nem szereplő indok, rövid leírással.

A „rendben“ eredmény rögzítéséig a hitelesítő kapacitáshelye felhasznált marad. A felügyeleti eredmény rögzítésére határidő nincs előírva.

A felügyeleti eredmény rögzítése nem változtatja meg a hitelesítés hatályát. A hitelesítés a hitelesítési bejegyzés rögzítésétől hatályos, és kizárólag e szabályzat VIII. fejezete szerinti eljárásban érvényteleníthető.

### 11a. cikk

*Felügyeleti ügy*

Az „ellenőrzésre“ vagy „vitatott“ eredmény rögzítésével automatikusan felügyeleti ügy keletkezik. Az ügy tartalmazza a hitelesítési bejegyzés megjelölését, a rögzített eredményeket, a gyanú alanyát és az indokkódot.

A felügyeleti ügy az Alapítvány Igazgatótanácsa számára hozzáférhető. Nem hozzáférhető a többi felügyelő, a hitelesítő, a hitelesített felhasználó, sem a nyilvánosság számára.

A felügyeleti ügy nyilvántartás, nem szerv. Az ügy keletkezése önmagában nem jár joghatással a felhasználóra nézve, és nem jelenti azt, hogy a hitelesítés hamis. Hamis hitelesítést kizárólag a 18. cikkben megjelölt szerv állapít meg, a VIII. fejezet szerinti eljárásban.

Az ügy hamis hitelesítés megállapításával vagy azzal a megállapítással zárul, hogy a gyanúnak nincs alapja. Az alap hiányának megállapításával lezárt ügy a lezárástól számított 90 nap elteltével törlésre kerül. A be nem igazolódott gyanú nem marad tartós bejegyzésként a felhasználóról.

Ha az „ellenőrzésre“ eredményt követően egyetlen másik felügyelő sem jelentkezik, az ügy nyitva marad. Ez a felhasználóra nézve nem jár következménnyel, de a hitelesítő kapacitáshelye felhasznált marad, amíg a „rendben“ eredmény nem kerül rögzítésre.

## V — A körkörösség elleni szabály

### 12. cikk

*A hitelesítő tiltott zónája*

A felhasználónak rendszerint több hitelesítője van — legfeljebb tíz, valóságindexével arányosan. A tiltott zóna a felhasználó minden egyes hitelesítőjére külön kerül megállapításra, uniójuk pedig a felhasználó teljes tiltott zónáját képezi.

A hitelesítő nem hitelesítheti:

— egyetlen saját hitelesítőjét sem (kölcsönös tilalom);

— senkit bármely saját hitelesítőjének felmenő láncából — abból a sorból, amelyet az adott hitelesítőtől kiindulva az ő hitelesítői, azok hitelesítői, és így tovább felfelé, a hitelesítési gráf gyökeréig alkotnak;

— senkit bármely saját hitelesítőjének részfájából — abból a halmazból, amelyet mindazok a felhasználók alkotnak, akiket az adott hitelesítő hitelesített, akiket ők hitelesítettek, és így tovább lefelé; ez a halmaz magában foglalja a felhasználó testvéreit is (azokat a további felhasználókat, akiket ugyanaz a hitelesítő hitelesített) és valamennyi leszármazottjukat;

— senkit a saját leszármazási láncából — azokat a felhasználókat, akiket maga hitelesített, akiket ők hitelesítettek, és így tovább lefelé.

A hitelesítő kizárólag olyan felhasználókat hitelesíthet, akik a felsorolt zónák egyikében sem szerepelnek — a hitelesítési gráf független ágaiból származó felhasználókat.

A tiltott zóna szimmetrikusan kerül megállapításra. A hitelesítéssel a hitelesítő saját tiltott zónájába veszi a hitelesített felhasználót és annak teljes tiltott zónáját, ideértve annak későbbi bővüléseit is. Senki nem hitelesíthet olyan felhasználót, aki az ő tiltott zónájában szerepel, sem olyat, akinek tiltott zónájában ő maga szerepel. A más felhasználók hitelesítéséből keletkezett zónabővülések nem szállnak át a kezdeti felhasználókra; a kezdeti felhasználó tiltott zónája kizárólag az általa végzett hitelesítésekkel bővül. A tiltott zóna nem külön bejegyzés, hanem minden pillanatban a hatályos hitelesítésekből kerül megállapításra; a hitelesítés érvénytelenítésével megszűnnek az abból eredő korlátozások is.

E cikk előző bekezdéseitől eltérően azok a felhasználók, akiket ugyanaz a kezdeti felhasználó közvetlenül hitelesített, hitelesíthetik egymást (kivétel az első generációra). A kivétel nem érvényes azon felhasználók között, akiket a hitelesítés pillanatában a hitelesítési gráf felmenő vagy lemenő vonala már összeköt — ideértve a kölcsönös tilalmat is —, és nem terjed ki további leszármazottjaikra. Az e kivétel alapján elvégzett hitelesítés minden egyébben rendes joghatást vált ki: az előző bekezdés szerinti szimmetrikus zónaátvétel, valamint a 22. cikk szerinti átmeneti korlátozás változatlanul alkalmazandó.

### 13. cikk

*A körkörösség elleni szabály célja*

A körkörösség elleni szabály biztosítja, hogy a bizalmi háló oldalirányban, független ágakon keresztül növekedjen. Minden hitelesítő teljes részfájának és teljes felmenő láncának kizárásával biztosított, hogy egyetlen felhasználó se halmozhasson fel hitelesítéseket a hálónak abból a részéből, amelyből ő maga is származik. Annak a felhasználónak, aki 100 %-os indexet kíván elérni, több különböző, egymástól független hálórészből származó felhasználók előtt kell ismertnek lennie. Ez szerkezeti gát az összehangolt manipuláció ellen: egy nem létező személy nem lehet ismert elegendő különböző társas körben ahhoz, hogy tíz független hitelesítést gyűjtsön. A zóna szimmetriája biztosítja, hogy a háló ugyanazon részén belüli minden hitelesítés csökkenti a további hitelesítések lehetőségét azon a részen, aminek folytán az ugyanazon társas körben ismételt hitelesítések hozama csökken.

Az első generációra vonatkozó kivétel (12. cikk (5) bekezdés) figyelembe veszi azon felhasználók sajátos helyzetét, akiket ugyanaz a kezdeti felhasználó közvetlenül hitelesített: a kezdeti időszakban a hálónak még nincsenek független ágai, amelyekben e felhasználók ismertek lehetnének, így a szabály teljes alkalmazása tartósan korlátozná őket pusztán azért, mert elsőként csatlakoztak. Mivel a kivétel alapján elvégzett minden hitelesítés olyan vonalat hoz létre, amely az összekapcsolt felhasználók közötti további hitelesítéseket kizárja, az ismételt hitelesítések hozama e kivételen belül is csökken.

## VI — A kezdeti mechanizmus

### 14. cikk

*Kiinduló felhasználók*

A rendszer kezdeti felhasználói azok a személyek, akik az Alapítvány alapító magját alkotják: a Gazdasági Nyilvántartási Ügynökség (APR) nyilvántartásába az Alapítvány alapítójaként vagy szerveinek tagjaként bejegyzett személyek, valamint azok a személyek, akiket az Igazgatótanács a rendszer létrehozásakor határozattal kijelöl, személyazonosságuk platformon való nyilvános közzététele mellett.

A kezdeti felhasználók valóságindexe a fiók létrehozásától 100 %, és nem a kezességi láncból ered. Az APR nyilvántartásában szereplő személyek valósága a nyilvános nyilvántartásból ered; az Igazgatótanács határozatával kijelölt személyek valóságát az Igazgatótanács közvetlenül erősíti meg, nyilvánosan közzétett személyazonosság mellett.

A kezdeti felhasználók a kezességi láncban nem hitelesíthetők.

### 15. cikk

*A kezdeti felhasználók jogai*

A kezdeti felhasználókat a hitelesítés tekintetében a ZRNO-tulajdonosokkal azonos jogok illetik meg: a kapacitás hitelesítéskor nem fogy, és a hitelesítések nem esnek felügyelet alá.

## VII — A státusz megszűnésének következményei a hitelesítésekre

### 16. cikk

*A hitelesítő státuszának megszűnése*

Ha az a felhasználó, akinek státusza megszűnt (kilépés, kizárás, halál), más felhasználók hitelesítője volt, az általa hitelesített felhasználók 10 százalékpontot veszítenek a valóságindexükből.

Az indexveszteség nem terjed tovább — azok a felhasználók, akiket az érintett felhasználók hitelesítettek, semmilyen hatást nem szenvednek el.

### 17. cikk

*Az index nullára esése*

Az a felhasználó, akinek indexe a hitelesítő státuszának megszűnése folytán 0 %-ra esik, megtartja hitelesített felhasználói státuszát. A felhasználó elveszíti a platform funkcióihoz való hozzáférést, de megtartja fiókját, és a kezességi láncon keresztül ismét hitelesíthető.

Az a felhasználó, aki ZRNO-tulajdonos, nem szenvedi el az indexesés funkcionális hatását — a hozzáférés és a kapacitás a ZRNO-tulajdonosi státuszból ered, nem az indexből.

## VIII — Hamis hitelesítés és megtérítés

### 18. cikk

*A hamis hitelesítés megállapítása*

Hamis hitelesítés az a hitelesítés, amellyel a hitelesítő olyan felhasználó valóságát erősítette meg, aki természetes személyként nem létezik, aki nem egyedi (más fiókkal rendelkezik a rendszerben), vagy akinek folytonossága nem biztosított.

A hamis hitelesítést az 1. fázisban az Alapítvány Igazgatótanácsa, a 2. fázisban a Felső Kör állapítja meg.

Az eljárás a 11a. cikk szerinti felügyeleti ügy alapján, az 5. cikk 5. bekezdése szerinti, hitelesített felhasználótól származó bejelentés alapján, vagy más módon szerzett tudomás alapján indul. A megállapítás minden hitelesítésre külön történik.

### 19. cikk

*A megállapított hamis hitelesítés következményei*

A hamis hitelesítés megállapításával az a hitelesítés érvénytelenné válik. A hitelesített felhasználó valóságindexe 10 százalékponttal csökken.

Egy hamis hitelesítés megállapítása elindítja ugyanazon hitelesítő többi hitelesítésének felülvizsgálatát, de önmagában nem érvényteleníti azokat. Ezek mindegyike kizárólag akkor válik érvénytelenné, ha maga is hamisnak minősül a 18. cikk alapján.

Annak a felhasználónak a hitelesítése, aki természetes személyként létezik, egyedi, és akinek folytonossága biztosított, akkor is hatályban marad, ha ugyanaz a hitelesítő más esetben hamis hitelesítést végzett. A valósságot ahhoz a felhasználóhoz mérten kell megítélni, akire a hitelesítés vonatkozik, nem a hitelesítőhöz mérten.

Egy hitelesítő valamennyi hitelesítésének érvénytelenítése valós emberektől venné el a státuszt olyan cselekmény miatt, amelyet nem ők követtek el, és amelyre nem lehettek befolyással. Az ártatlanokat sújtó intézkedés nem a hálózat védelme, hanem kár a hálózatnak.

### 20. cikk

*Az érvénytelenítés kaszkádja*

A hitelesítés érvénytelenítése kizárólag olyan fiókokon keresztül terjed tovább, amelyekről megállapítást nyert, hogy mögöttük nem áll valós személy, vagy hogy nem egyediek.

Az ilyen fiók senkit sem ismerhet közvetlenül, és őt sem ismerheti senki valós személyként. A megállapítás ezért érvényteleníti mindazokat a hitelesítéseket, amelyeket a fiók érint — mind az általa végzetteket, mind az általa kapottakat —, anélkül, hogy mindegyikre külön megállapítás születne a 18. cikk szerint.

A kaszkád az első olyan felhasználónál áll meg, akiről nem állapították meg, hogy nem létező vagy nem egyedi: nála csak az ilyen fióktól kapott hitelesítés válik érvénytelenné, míg az általa végzett hitelesítések hatályban maradnak.

A kitalált fiókok hálózata úgy dől meg, hogy minden egyes fiókjára megállapítás születik. Minden megállapításnál az adott fiók valamennyi kapcsolata megszűnik, így a megállapítások sorrendje nem befolyásolja az eredményt.

Az index 0 %-ra esése önmagában nem indít kaszkádot. Az a felhasználó, akinek indexe 0 %-ra esik, megtartja a hitelesített felhasználói státuszt és az e szabályzat 17. cikke szerinti helyzetet.

A kaszkád a nemlétezést követi, nem a hitelesítőt. A kitalált fiókok hálózata teljes egészében megdől, mert egyikük sem ismer senkit; a tisztességesen bevezetett valós ember nem veszíti el státuszát amiatt, hogy az, aki bevezette, máshol hazudott.

### 20a. cikk

*A POEN-bejegyzések érvénytelenítésének terjedelme*

A hitelesítés érvénytelenítésével kizárólag azok a POEN-bejegyzések válnak érvénytelenné, amelyek e hitelesítésből e szabályzat 7. cikke szerinti csatornán keletkeztek: a hitelesítőnek 1.000 POEN, a hitelesített felhasználónak 1.000 POEN, a felügyelőnek pedig 500 POEN, ha a rögzített felügyeleti eredmény „rendben“ volt.

Annak a felügyelőnek, aki e hitelesítésnél „ellenőrzésre“ vagy „vitatott“ eredményt rögzített, a nyilvántartott POEN nem válik érvénytelenné. Az a felügyelő, aki a gyanút bejelentette, és igaza lett, nem viseli más cselekményének következményét.

A KOLO rendszerről szóló szabályzat 15. cikke szerinti egyéb nyilvántartási csatornákon keletkezett POEN-bejegyzések — csere, működési hozzájárulás, pénzügyi hozzájárulás, támogatói szerep, kollektív formák növekedése, alapítói hozzájárulás vagy a platform tartalmához való hozzájárulás — nem válnak érvénytelenné.

A POEN-bejegyzések e cikk szerinti érvénytelenítésére nem alkalmazandó a KOLO rendszerről szóló szabályzat 34. cikke. Az kerül érvénytelenítésre, ami a hitelesítésből keletkezett, nem a felhasználó teljes nyilvántartása; a pénzügyi hozzájárulás a KOLO rendszerről szóló szabályzat 73. cikke alapján visszafordíthatatlan, és közvetve sem érvényteleníthető.

A POEN-bejegyzés minden érvénytelenítését a Protokoll azonos összegű ellenbejegyzése kíséri. A KOLO rendszerről szóló szabályzat 14. cikke szerinti zéró összegű invariáns fennmarad.

### 20b. cikk

*Megtérítés*

Ha annak a felhasználónak, akinek POEN-bejegyzései érvénytelenítésre kerülnek, nincs elegendő nyilvántartott POEN-je az érvénytelenítés fedezésére, bejegyzése a fedezetlen rész erejéig negatív értékbe fordul. Ez a negatív érték a megtérítés.

A hitelesített felhasználót és a felügyelőt érintő érvénytelenítés fedezetlen része átszáll az adott hitelesítés hitelesítőjére, és annak bejegyzése ugyanazzal az összeggel csökken. A magát a hitelesítőt érintő érvénytelenítés fedezetlen része az ő bejegyzésén marad.

Negatív POEN-bejegyzés kizárólag hitelesítőnél keletkezhet. A hitelesített felhasználó és a felügyelő bejegyzése legfeljebb nulláig eshet.

Az összes megtérítés összege megfelel azon javak és szolgáltatások értékének, amelyeket hamis hitelesítések alapján ténylegesen kivontak a hálózatból. A megtérítés ezért nem büntetés, hanem ezen érték kiegyenlítése, és nincs felső határa.

A megtérítés nem tartozás. Az Alapítványnak a megtérítés alapján nincs követelése a felhasználóval szemben, azt nem hajthatja be, nem engedményezheti és nem érvényesítheti kényszerrel, továbbá vagyonként sem mutatja ki. A megtérítés hatálya kizárólag a rendszeren belül áll fenn.

A megtérítés nem akadályozza a felhasználót javak és szolgáltatások cseréjében. A felhasználóhoz beérkező POEN először a megtérítést tölti fel; a felhasználó a POEN-bejegyzés felett csak a megtérítés kiegyenlítése után rendelkezik. A megtérítést a hálózatnak való adással kell ledolgozni.

A megtérítés nem jelent kizárást. A felfüggesztés és a kizárás önálló intézkedések, amelyeket a Felhasználási feltételekben megállapított külön eljárásban szabnak ki; a megtérítés ezeket nem helyettesíti, nem vonja maga után és nem zárja ki.

A megtérítés a felhasználó jogállásának megszűnése után is fennmarad. A KOLO rendszerről szóló szabályzat 34. cikkétől eltérően a negatív bejegyzés a jogállás megszűnésekor nem semmisül meg, és nem száll át a Protokollra; ellenkező esetben a rendszerből való kilépés törölné a megtérítést, a terhet pedig a többi felhasználó viselné.

Az e cikk szerinti negatív POEN-bejegyzés az egyetlen kivétel a KOLO rendszerről szóló szabályzat 14. cikk 3. bekezdésében foglalt tilalom alól.

### 20c. cikk

*Az önhibáján kívül érvénytelenített hitelesítésű felhasználó helyzete*

Annak a felhasználónak, akinek hitelesítése érvénytelenítésre került, és akiről nem állapították meg, hogy nem létező vagy nem egyedi, a valóságindexe 10 százalékponttal csökken, az e hitelesítésből eredő, 7. cikk szerinti POEN-bejegyzései érvénytelenné válnak, és felszabadul egy hely a kezességi láncban.

Az ilyen felhasználó POEN-bejegyzéseinek érvénytelenítését az egyenlege korlátozza — a bejegyzés legfeljebb nulláig eshet. A fedezetlen rész a 20b. cikk szerinti megtérítésként átszáll a hitelesítőre, és nem terheli a felhasználót. Aki semmit nem vétett, nem marad negatív értékben.

Az ilyen felhasználó e szabályzat általános szabályai szerint újra hitelesíthető. Az újbóli hitelesítéssel indexe 10 százalékponttal nő, és a 7. cikk szerinti POEN nyilvántartásba kerül nála, így ezen a jogcímen nem szenved tartós veszteséget.

Az ilyen felhasználó tiltott zónája a hatályos hitelesítésekből kerül megállapításra (12. cikk 4. bekezdés). Az érvénytelenített hitelesítésből eredő korlátozások megszűnnek, így őt a hálózat azon részéből származó felhasználók is hitelesíthetik, amely az érvénytelenített hitelesítés miatt zárva volt előtte.

### 21. cikk

*A hamis hitelesítő jogállása*

A hamis hitelesítővel szemben a Felhasználási feltételekben megállapított, a jogállás megszűnésére és felfüggesztésére vonatkozó szabályok szerinti intézkedések alkalmazandók.

A 20b. cikk szerinti megtérítés magával az érvénytelenítéssel áll be, és nem e cikk 1. bekezdése szerinti intézkedés. A felfüggesztés, illetve a kizárás kiszabása vagy annak elmaradása nem érinti a megtérítést, és a megtérítés sem helyettesíti ezeket az intézkedéseket.

## IX — Átmeneti és záró rendelkezések

### 22. cikk

*A hitelesítések számának átmeneti korlátozása*

Amíg a teljes forgalomban lévő mennyiség el nem éri a 100.000 POEN-t, a felhasználó legfeljebb egy hitelesítést fogadhat a kezességi láncban. A forgalomban lévő mennyiség a rendszerben nyilvántartott POEN-ek teljes száma — a Protokoll ellenbejegyzésének abszolút értéke.

Az (1) bekezdés szerinti korlátozás a forgalomban lévő mennyiség hitelesítéskori állapota szerint alkalmazandó. A korlátozás hatálya alatt kapott hitelesítések érvényben maradnak; a 100.000 POEN forgalom elérésekor a valóságindex e szabályzat általános szabályai szerint növekszik, ideértve az V. fejezet szerinti tiltott zónát is.

A korlátozás célja, hogy a kezdeti időszakban a háló kizárólag új felhasználók csatlakozásával bővüljön, ne pedig a háló ugyanazon részén belüli hitelesítések ismétlésével.

### 23. cikk

*A szabályzat módosítása*

E szabályzatot a KOLO Alapítvány Igazgatótanácsa alkotja és módosítja, a KOLO rendszerről szóló szabályzatban megállapított eljárás szerint.

### 24. cikk

*Hatálybalépés*

E szabályzat a KOLO Alapítvány Igazgatótanácsa általi elfogadásának napján lép hatályba.
