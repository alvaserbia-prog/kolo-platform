> **Nem hivatalos fordítás.** A magyar változat kizárólag a könnyebb megértés célját szolgálja. Jogilag a szerb eredeti szöveg kötelező érvényű; bármilyen eltérés esetén a szerb változat az irányadó.

# Szabályzat a valóságbizonyítékról

*Ez a szabályzat a valóságbizonyíték operatív mechanikáját rendezi — a KOLO rendszer felhasználói hitelesítésének személyes ismeretségen alapuló modelljét. A KOLO rendszerről szóló szabályzat 32. cikkének (4) bekezdése és 15. cikkének 2. pontja alapján kerül elfogadásra.*

## I — Általános rendelkezések

### 1. cikk

*A szabályzat tárgya*

E szabályzat rendezi a valóságindexet, a kezességi láncot, a hitelesítési bejegyzést, a hitelesítésért járó POEN nyilvántartását, a hitelesítési kapacitást és a felügyeletet, a körkörösség elleni szabályt, a kezdeti mechanizmust, a státusz megszűnésének a hitelesítésekre gyakorolt következményeit, valamint a hamis hitelesítés megállapításának eljárását.

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

*A hitelesítési bejegyzés*

Minden hitelesítés hitelesítési bejegyzéssel kerül nyilvántartásba, amely öt adatot tartalmaz:

— a hitelesítő azonosítója (álnév);

— a hitelesítő hitelesítésének sorszáma — hányadik hitelesítés ez, amelyet a hitelesítő elvégzett;

— a hitelesített azonosítója (álnév);

— a hitelesítés időbélyege;

— a felügyelő azonosítója (álnév), vagy üres mező, ha a hitelesítés nem esik felügyelet alá.

A hitelesítési bejegyzés a kollektív javak nyilvántartásának része. A hitelesítési bejegyzések alkotják a hitelesítési gráfot a KOLO rendszerről szóló szabályzat 32. cikke értelmében.

### 7. cikk

*A hitelesítésért járó POEN nyilvántartása*

A hitelesítési bejegyzés nyilvántartásba vételét követően a Protokoll automatikusan új POEN-bejegyzéseket ír be: a hitelesítőnek 1.000 POEN-t, a hitelesítettnek 1.000 POEN-t.

Ha a hitelesítés felügyelet alá esik, a Protokoll 500 POEN-t ír be a felügyelőnek abban a pillanatban, amikor a felügyelő megerősíti a hitelesítést (11. cikk), nem pedig a hitelesítés pillanatában. A felügyelet megerősítéséig felügyelő nincs is kijelölve.

Ha a hitelesítés nem esik felügyelet alá, a teljes nyilvántartott összeg 2.000 POEN. Ha felügyelet alá esik, a felügyelet lezárultával a teljes nyilvántartott összeg 2.500 POEN.

A hitelesítésért járó POEN nyilvántartásba vétele a Protokoll automatikus aktusa a KOLO rendszerről szóló szabályzat 15. cikkének 2. pontja értelmében.

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

A rendes hitelesített felhasználók által végzett hitelesítések felügyelet alá esnek. A kezdeti felhasználók és a ZRNO-tulajdonosok által végzett hitelesítések nem esnek felügyelet alá.

Felügyelő az 1. fázisban az Alapítvány Igazgatótanácsának minden tagja, a 2. fázisban pedig minden ZRNO-tulajdonos. A felügyeleti funkció automatikusan a státuszból ered, kinevezés nélkül.

A felügyelő ellenőrzi az elvégzett hitelesítés jogszerűségét, és feltölti a hitelesítő felhasznált kapacitáshelyét. A felügyelő az elvégzett felügyeletért 500 POEN-t kap a jelen szabályzat 7. cikkével összhangban.

### 11. cikk

*A felügyelet eljárása*

A felügyeletre a hitelesítés után kerül sor. A hitelesítés a hitelesítési bejegyzés nyilvántartásba vételével lép hatályba. A felügyelő utólag ellenőrzi a hitelesítést, és kitölti a felügyelői mezőt a hitelesítési bejegyzésben.

Az elvégzett felügyeletig a hitelesítő kapacitáshelye felhasználva marad. A hely feltöltése csak a hitelesítési bejegyzés felügyelői mezőjének kitöltésekor következik be.

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

A tiltott zóna szimmetrikusan kerül megállapításra. A hitelesítéssel a hitelesítő tartósan saját tiltott zónájába veszi a hitelesített felhasználót és annak teljes tiltott zónáját, ideértve annak későbbi bővüléseit is. Senki nem hitelesíthet olyan felhasználót, aki az ő tiltott zónájában szerepel, sem olyat, akinek tiltott zónájában ő maga szerepel. A más felhasználók hitelesítéséből keletkezett zónabővülések nem szállnak át a kezdeti felhasználókra; a kezdeti felhasználó tiltott zónája kizárólag az általa végzett hitelesítésekkel bővül.

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

## VIII — Hamis hitelesítés

### 18. cikk

*A hamis hitelesítés megállapítása*

Hamis hitelesítés az, amellyel a hitelesítő olyan felhasználó valóságát erősítette meg, aki természetes személyként nem létezik, aki nem egyedi (másik fiókja van a rendszerben), vagy akinek folytonossága nem biztosított.

A hamis hitelesítést az 1. fázisban az Alapítvány Igazgatótanácsa, a 2. fázisban a Felső Kolo állapítja meg.

### 19. cikk

*A megállapított hamis hitelesítés következményei*

A hamis hitelesítés megállapítását követően valamennyi hitelesítés érvényét veszti, amelyet a hamis hitelesítő elvégzett. Azon felhasználók indexe, akiket a hamis hitelesítő hitelesített, minden érvénytelenített hitelesítés után 10 százalékponttal csökken.

### 20. cikk

*Az érvénytelenítés kaszkádja*

Az a felhasználó, akinek indexe az érvénytelenítés után 0 %-ra esik, elveszíti a platform funkcióihoz való hozzáférést, de megtartja hitelesített felhasználói státuszát. Valamennyi hitelesítés, amelyet az adott felhasználó elvégzett, szintén érvényét veszti.

Az eljárás rekurzívan ismétlődik: minden olyan felhasználó esetében, akinek indexe 0 %-ra esik, érvénytelenítésre kerülnek az általa végzett hitelesítések, ami további felhasználók indexének esését okozhatja. A kaszkád akkor áll meg, amikor egyetlen új érvénytelenítés sem vezet többé az index 0 %-ra eséséhez.

Azon felhasználók POEN-bejegyzései, akiknek indexe a kaszkádban 0 %-ra esett, a KOLO rendszerről szóló szabályzat 34. cikkével összhangban érvényüket vesztik.

### 21. cikk

*A hamis hitelesítő státusza*

A hamis hitelesítővel szemben a Felhasználási feltételekben a státusz megszűnésére és felfüggesztésére megállapított szabályok szerinti intézkedések alkalmazandók.

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
