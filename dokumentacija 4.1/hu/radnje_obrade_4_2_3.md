> **Nem hivatalos fordítás.** A magyar változat kizárólag a könnyebb megértés célját szolgálja. Jogilag a szerb eredeti szöveg kötelező érvényű; bármilyen eltérés esetén a szerb változat az irányadó.

# Az adatkezelési tevékenységek nyilvántartása

*E nyilvántartás a személyes adatok védelméről szóló törvény (Zakon o zaštiti podataka o ličnosti, „SZK Hivatalos Közlönye”, 87/2018. szám, a továbbiakban: ZZPL) 47. cikke, a KOLO rendszerről szóló szabályzat (4.2.3 verzió) 62. és 63. cikke, valamint a KOLO rendszer aktusainak hierarchiájáról szóló szabályzat 9. cikke alapján kerül elfogadásra. A KOLO platform adatvédelmi szabályzatával (4.2.3 verzió) és a támogatási programokról szóló szabályzattal (4.2.3 verzió) együtt alkalmazandó.*

**AZ ADATKEZELŐ ADATAI**

| **Adatkezelő** | KOLO Alapítvány |
| --- | --- |
| **Székhely** | Šetalište 16, 25000 Zombor (Sombor), Szerb Köztársaság |
| **Törzsszám** | 28836627 |
| **Adószám (PIB)** | 115840443 |
| **E-mail** | privatnost@ekolo.rs |
| **Adatvédelmi tisztviselő** | Nikola Šarić, alva.serbia@gmail.com |

**1. sz. adatkezelési tevékenység — Regisztráció és a felhasználói fiók kezelése**

| **Az adatkezelés célja** | A rendszer működése, a felhasználó azonosítása a rendszerben, kommunikáció, a fiók hitelesítése és a hozzáférés biztonsága. |
| --- | --- |
| **Az érintettek kategóriái** | A KOLO platform felhasználói. |
| **Az adatok kategóriái** | Álnév (felhasználónév), e-mail-cím, jelszó (kizárólag kivonatolt /hash/ formában tárolva), a rendszerhez való csatlakozás dátuma. |
| **Jogalap** | Szerződéses jogviszony teljesítése (ZZPL 12. cikk 1. bek. 2. pont) — a felhasználó a rendszerhez csatlakozással elfogadja a felhasználási szabályokat. |
| **Címzettek / adatfeldolgozók** | Vercel Inc. (tárhely) és Neon Inc. (adatbázis), Amerikai Egyesült Államok, a törvénnyel összhangban kötött adatfeldolgozási szerződés alapján. |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói az USA-ban találhatók (lásd az adatvédelmi szabályzat 9. cikkét). |
| **Megőrzési idő** | Amíg a felhasználói fiók aktív marad. A jogállás megszűnésével az e-mail-cím törlődik, a fennmaradó adatok pedig anonimizálásra kerülnek a szabályzat 34. cikkével és az adatvédelmi szabályzat 11. cikkével összhangban. |
| **Védelmi intézkedések** | Jelszókivonatolás, TLS titkosítás az átvitelben (legalább 1.2 verzió), nyugalmi állapotú titkosítás a tárhely-infrastruktúra szintjén, a minimális szükségesség elve szerinti hozzáférés-ellenőrzés, többtényezős hitelesítés az adminisztratív hozzáféréshez. |

**2. sz. adatkezelési tevékenység — Valóságbizonyíték (a felhasználó hitelesítése)**

| **Az adatkezelés célja** | Az egy személy — egy felhasználó elv biztosítása és a közjó nyilvántartásának integritása. |
| --- | --- |
| **Az érintettek kategóriái** | A platform hitelesítési eljáráson áteső felhasználói. |
| **Az adatok kategóriái** | Hitelesítési gráf (nyilvántartás arról, ki kit hitelesített, álneves formában), valóságindex (a hitelesítettség fokának számszerű értéke), hitelesítési bejegyzések (a hitelesítő álneve, a hitelesítés sorszáma, a hitelesített álneve, időbélyeg, a felügyelő álneve). |
| **Jogalap** | Szerződéses jogviszony teljesítése (ZZPL 12. cikk 1. bek. 2. pont). |
| **Címzettek / adatfeldolgozók** | Vercel Inc. (tárhely) és Neon Inc. (adatbázis), Amerikai Egyesült Államok, adatfeldolgozási szerződés alapján. |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói az USA-ban találhatók (lásd az adatvédelmi szabályzat 9. cikkét). |
| **Megőrzési idő** | Amíg a felhasználói fiók aktív marad. A jogállás megszűnésével a hitelesítési gráf kapcsolatai anonimizálásra kerülnek; az azonosítást lehetővé nem tevő azonosító alatt maradó bejegyzések megszűnnek személyes adatnak lenni a ZZPL értelmében. |
| **Védelmi intézkedések** | Álnevesítés, az azonosító adatok elkülönítése az elszámolási adatoktól, TLS titkosítás, nyugalmi állapotú titkosítás, hozzáférés-ellenőrzés. |
| **Megjegyzés** | A hitelesítési gráf — még álneves formában is — személyes adatok kezelését jelenti a ZZPL értelmében. |

**3. sz. adatkezelési tevékenység — Önkéntesen megadott adatok**

| **Az adatkezelés célja** | A platform könnyebb használata és a felhasználók közötti kommunikáció, a felhasználó választása szerint. |
| --- | --- |
| **Az érintettek kategóriái** | A platform azon felhasználói, akik önkéntesen adnak meg további adatokat. |
| **Az adatok kategóriái** | Vezeték- és keresztnév, telefonszám, cím, egyéb elérhetőségi adatok, profilkép (avatár) és leírás, a hirdetésekhez csatolt képek. |
| **Jogalap** | A felhasználó hozzájárulása (ZZPL 12. cikk 1. bek. 1. pont). A hozzájárulás önkéntes, és bármikor visszavonható. Ezen adatok megadása nem feltétele sem a valóságbizonyítéknak, sem a rendszer funkcióihoz való hozzáférésnek. |
| **Címzettek / adatfeldolgozók** | Vercel Inc. (tárhely) és Neon Inc. (adatbázis), Amerikai Egyesült Államok, adatfeldolgozási szerződés alapján. A képeket (avatár és hirdetésképek) a Cloudflare, Inc. adatfeldolgozó tárolja (Cloudflare R2 szolgáltatás, USA); az adatbázisba csak a kép internetcíme (URL) kerül. Azok az adatok, amelyeket a felhasználó láthatóra állít (név, vezetéknév, telefon), a platform hitelesített felhasználói számára hozzáférhetők. |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói az USA-ban találhatók (lásd az adatvédelmi szabályzat 9. cikkét). |
| **Megőrzési idő** | A hozzájárulás visszavonásáig vagy a felhasználó általi törlésig. A felhasználói jogállás megszűnésével teljes egészében törlődnek. |
| **Védelmi intézkedések** | TLS titkosítás, nyugalmi állapotú titkosítás, hozzáférés-ellenőrzés, a felhasználó általi bármikori törlés lehetősége. |

**4. sz. adatkezelési tevékenység — Tevékenységi nyilvántartás (POEN-tranzakciók)**

| **Az adatkezelés célja** | A közjó nyilvántartásának vezetése és a rendszer elszámolási keretének működése. |
| --- | --- |
| **Az érintettek kategóriái** | A platform azon felhasználói, akik cserékben és hozzájárulásokban vesznek részt. |
| **Az adatok kategóriái** | A POEN-nyilvántartás frissítésének összege, a frissítés időpontja, a nyilvántartásba vett csere feleinek álnevei. |
| **Jogalap** | Szerződéses jogviszony teljesítése (ZZPL 12. cikk 1. bek. 2. pont) mindaddig, amíg a felhasználó részt vesz a rendszerben. A jogállás megszűnése és az anonimizálás után a bejegyzések megszűnnek személyes adatnak lenni. |
| **Címzettek / adatfeldolgozók** | Vercel Inc. (tárhely) és Neon Inc. (adatbázis), Amerikai Egyesült Államok, adatfeldolgozási szerződés alapján. A nyilvántartás álneves formában nyilvános — a hitelesített felhasználók láthatják az összegeket, az időbélyegeket és a felek álneveit. |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói az USA-ban találhatók (lásd az adatvédelmi szabályzat 9. cikkét). |
| **Megőrzési idő** | A keletkezéstől számított 10 év, az adó- és számviteli előírásokkal összhangban, álneves formában. A felhasználói jogállás megszűnésével az azonosító adatok törlődnek, a számszerű előzmény pedig azonosítást lehetővé nem tevő azonosító alatt marad meg. |
| **Védelmi intézkedések** | Álnevesítés, a nyilvántartás integritása (zéró összegű invariáns automatikus ellenőrzéssel, atomi bejegyzés és a bejegyzések időbélyegzése), TLS titkosítás, nyugalmi állapotú titkosítás a tárhely-infrastruktúra szintjén. |

**5. sz. adatkezelési tevékenység — Természetes személyek adományai**

| **Az adatkezelés célja** | A pénzügyi beszámolásra vonatkozó jogszabályi kötelezettség teljesítése. |
| --- | --- |
| **Az érintettek kategóriái** | Adományozók — az Alapítványnak eszközt adományozó természetes személyek. |
| **Az adatok kategóriái** | Az adomány összege, az adomány dátuma, az adományozó személyazonossága (a bankrendszeren keresztül biztosított — az Alapítvány hitelesített bankszámlákról fogad adományt). |
| **Jogalap** | Jogszabályi kötelezettség (ZZPL 12. cikk 1. bek. 3. pont). |
| **Címzettek / adatfeldolgozók** | Az Alapítvány (közvetlenül őrzi az adatokat), a bankintézet, a könyvvizsgáló (ha alkalmazandó). |
| **Harmadik országba történő továbbítás** | Nem — a banki dokumentáció az Alapítvány keretein belül marad. |
| **Megőrzési idő** | A keletkezéstől számított 10 év, a számviteli törvénnyel és az adóelőírásokkal összhangban. A felhasználónak nincs joga a törvényes határidő letelte előtt törlést kérni. |
| **Védelmi intézkedések** | A dokumentáció fizikai és logikai védelme, hozzáférés-ellenőrzés, a platform adataitól elkülönített tárolás. |

**6. sz. adatkezelési tevékenység — Jogi személyek pártfogása**

| **Az adatkezelés célja** | A pártfogás nyilvántartása és a pénzügyi beszámolási kötelezettség teljesítése. |
| --- | --- |
| **Az érintettek kategóriái** | A pártfogó jogi személyek kapcsolattartói, azok a felhasználók, akiknek a bejegyzésébe a hozzájárulás kerül. |
| **Az adatok kategóriái** | A jogi személy hozzájárulására vonatkozó adatok, a pártfogó jogi személy és azon felhasználó közötti kapcsolat, akinek a bejegyzésébe a hozzájárulás kerül. |
| **Jogalap** | Az Alapítvány jogos érdeke (ZZPL 12. cikk 1. bek. 6. pont) és a pénzügyi nyilvántartás vezetésére vonatkozó jogszabályi kötelezettség. |
| **Címzettek / adatfeldolgozók** | Az Alapítvány (közvetlenül őrzi az adatokat), a könyvvizsgáló (ha alkalmazandó). |
| **Harmadik országba történő továbbítás** | Nem. |
| **Megőrzési idő** | 10 év, a számviteli törvénnyel összhangban. |
| **Védelmi intézkedések** | Hozzáférés-ellenőrzés, fizikai és logikai védelem. |
| **Megjegyzés** | Ez a rendszer egyetlen pontja, ahol az Alapítvány olyan adatot őriz, amely a külső és a belső nyilvántartást összekapcsolja. A jogos érdek arányossági vizsgálata: az adatkezelés szükséges a pártfogás nyilvántartásához és a jogszerű pénzügyi beszámoláshoz; az Alapítvány érdekei elsőbbséget élveznek, mivel az adatok a nyilvántartáshoz szükséges minimumra korlátozódnak, a felhasználó pedig előzetesen tájékoztatást kap. |

**7. sz. adatkezelési tevékenység — Technikai adatok és naplók**

| **Az adatkezelés célja** | A platform biztonsága, a visszaélések megelőzése, a jogosulatlan hozzáférés felderítése, technikai támogatás. |
| --- | --- |
| **Az érintettek kategóriái** | A platform valamennyi felhasználója és látogatója. |
| **Az adatok kategóriái** | IP-cím, eszköz- és böngészőadatok, a hozzáférés ideje és dátuma, hozzáférési napló (ki fért hozzá, mikor, mely adatokhoz, milyen eszközről). |
| **Jogalap** | Jogos érdek (ZZPL 12. cikk 1. bek. 6. pont). |
| **Címzettek / adatfeldolgozók** | Vercel Inc. (tárhely) és Neon Inc. (adatbázis), Amerikai Egyesült Államok, adatfeldolgozási szerződés alapján. |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói az USA-ban találhatók (lásd az adatvédelmi szabályzat 9. cikkét). |
| **Megőrzési idő** | 12 hónap. |
| **Védelmi intézkedések** | Az adminisztratív cselekmények és az elérhetőségi adatok feltárása auditnaplóban kerül rögzítésre, a hozzáférés az adatvédelmi tisztviselőre és a biztonsági adminisztrátorokra korlátozódik, TLS titkosítás. |

**8. sz. adatkezelési tevékenység — Automatizált döntéshozatal**

| **Az adatkezelés célja** | POEN-kibocsátás, az elszámolási együttható kiszámítása, automatikus nyilvántartásba vétel a szociális programokban (a 3. modul aktiválását követően). |
| --- | --- |
| **Az érintettek kategóriái** | A platform felhasználói. |
| **Az adatok kategóriái** | A hozzájárulásokra vonatkozó adatok, az elszámolási keret paraméterei, a minősített csoportokhoz való tartozásra vonatkozó adatok (a 3. modul aktiválását követően). |
| **Jogalap** | Szerződéses jogviszony teljesítése (ZZPL 12. cikk 1. bek. 2. pont); a szociális programok esetében — kifejezett hozzájárulás (ZZPL 17. cikk 2. bek. 1. pont). |
| **Címzettek / adatfeldolgozók** | Vercel Inc. (tárhely) és Neon Inc. (adatbázis), Amerikai Egyesült Államok, adatfeldolgozási szerződés alapján. |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói az USA-ban találhatók (lásd az adatvédelmi szabályzat 9. cikkét). |
| **Megőrzési idő** | Mint a 4. sz. adatkezelési tevékenységnél (10 év). |
| **Védelmi intézkedések** | Determinisztikusan meghatározott nyilvános képlet az elszámolási együtthatóra, a felhasználó joga a logika magyarázatára, emberi felülvizsgálat és kifogás (ZZPL 38. cikk). |
| **Megjegyzés** | Ezek az automatizált adatkezelések a ZZPL 38. cikke értelmében jogilag vagy jelentős mértékben érinthetik az érintettet. |

**9. sz. adatkezelési tevékenység — A nem hitelesített felhasználó hirdetésében szereplő adatok**

| **Az adatkezelés célja** | Ajánlat közzététele javak és szolgáltatások cseréje céljából, valamint kapcsolatfelvétel a nem hitelesített felhasználó és a lehetséges hitelesítők között a valóságbizonyítékról szóló szabályzat szerinti hitelesítés lefolytatása érdekében. |
| --- | --- |
| **Az érintettek kategóriái** | A platform nem hitelesített felhasználói, akik javat vagy szolgáltatást kínáló hirdetést tesznek közzé. |
| **Az adatok kategóriái** | A hirdető álneve, a jószág vagy szolgáltatás címe és leírása, kategória, ár, hely (a településjegyzékből választott település), a felhasználó által csatolt fényképek, valamint saját választása szerint a telefonszám. |
| **Jogalap** | A felhasználó hozzájárulása (ZZPL 12. cikk 1. bek. 1. pont), amelyet a hirdetés közzétételével ad meg, azzal a figyelmeztetéssel, hogy a hirdetés nyilvánosan látható. A hozzájárulás önkéntes, és bármikor visszavonható a hirdetés eltávolításával, a felhasználó rendszerbeli jogállására nézve következmények nélkül. |
| **Címzettek / adatfeldolgozók** | Vercel Inc. (tárhely), Neon Inc. (adatbázis) és Cloudflare Inc. (fényképtár), Amerikai Egyesült Államok, adatfeldolgozási szerződés alapján. A hirdetés a platform valamennyi látogatója számára nyilvánosan hozzáférhető, ideértve a be nem jelentkezett személyeket is, és a keresőmotorok indexelik. A hirdető telefonszáma kizárólag hitelesített felhasználók számára hozzáférhető. |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói az USA-ban találhatók (lásd az adatvédelmi szabályzat 9. cikkét). |
| **Megőrzési idő** | Amíg a felhasználó el nem távolítja a hirdetést, vagy amíg a hirdetés a felhasználási feltételekkel összhangban eltávolításra nem kerül. A felhasználói jogállás megszűnésével az adatok teljes egészében törlődnek. |
| **Védelmi intézkedések** | Tartalmi minimum azonosító adatok kérése helyett (arckép, vezeték- és keresztnév nem kért és nem szükséges), a telefonszám nem nyilvános, látható jelzés arról, hogy a hirdető nem hitelesített, három aktív hirdetésre való korlátozás, TLS titkosítás, hozzáférés-ellenőrzés. |
| **Megjegyzés** | E nyilvántartási változattal megszűnt a korábbi „a kezességkérő táblán közzétett adatok” adatkezelési tevékenység (felismerési kártya: vezetéknév, keresztnév, születési év, hely, becenév, foglalkozás leírása, telefonszám és a hívásra vonatkozó hozzájárulás). Ez a mechanizmus megszűnt létezni, és az ezen az úton gyűjtött valamennyi adat törlésre került. Az új adatkezelés terjedelmében szűkebb, és nem kér azonosító adatokat. |

**10. sz. adatkezelési tevékenység — Az adatok különleges kategóriái (3. modul — Szociális programok)**

| **Állapot** | AKTÍV — a 3. modul a szabályzat 57. cikkével és a támogatási programokról szóló szabályzattal (4.2.3 v.) összhangban aktiválódik; az aktiválást a DPIA frissítése kíséri (4.2.3 v.). |
| --- | --- |
| **Az adatkezelés célja** | A minősített csoportokhoz tartozó felhasználók hozzájárulásának automatikus nyilvántartásba vétele POEN-ben, a kérelmező hitelesítőinek a feltételek teljesülésére vonatkozó megerősítésével (a programok integritásának védelme a valótlan kérelmekkel szemben). |
| **Az érintettek kategóriái** | A minősített csoportokhoz tartozó felhasználók (szülők, idősebb személyek, fogyatékossággal élő személyek, hallgatók) és hitelesítőik. |
| **Az adatok kategóriái** | Szülői jogállás, életkor, fogyatékosság (az illetékes hatóság rokkantsági határozata — nem orvosi dokumentáció és nem diagnózis), hallgatói jogállás vagy más minősített csoporthoz való tartozás, a jogállás igazolásának dátuma. Az Alapítvány nem őrzi a benyújtott dokumentáció másolatait — a rendszerben csak a csoporthoz tartozásról szóló minimális bejegyzés marad. A megerősítési eljárásban a hitelesítők előtt feltárul az az adat, hogy a kérelmező (álnév) egy meghatározott programra jelentkezett — ami különleges kategóriához való tartozásra utalhat —, de a megadott adatok tartalma nem. |
| **Jogalap** | A felhasználó kifejezett hozzájárulása (ZZPL 17. cikk 2. bek. 1. pont), külön megadva a kérelemre és külön a hitelesítőktől való megerősítés kérésére. A hozzájárulás bármikor visszavonható, aminek következménye az eljárás, illetve az automatikus nyilvántartásba vétel megszűnése. |
| **Címzettek / adatfeldolgozók** | Vercel Inc. (tárhely) és Neon Inc. (adatbázis), Amerikai Egyesült Államok, adatfeldolgozási szerződés alapján. A kérelmet az Alapítványnál feldolgozó személy betekinthet a megadott adatokba. A kérelmező hitelesítői kizárólag megerősítési kérést kapnak (a program megnevezése és az általuk személyesen ismert kérelmező álneve) — a megadott adatokba való betekintés nélkül. |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói az USA-ban találhatók (lásd az adatvédelmi szabályzat 9. cikkét). |
| **Megőrzési idő** | A felhasználó általi hozzájárulás visszavonásáig. A hitelesítői megerősítésekről szóló bejegyzések (megerősítve/elutasítva, az elutasítás indokolása) a kérelem mellett maradnak, amíg a jogállás fennáll. |
| **Védelmi intézkedések** | Az adatok álnevesítve kezelendők, és csak a kérelmet az Alapítványnál feldolgozó személy számára hozzáférhetők; a hitelesítők és a többi felhasználó nem tekinthet be a megadott adatokba. Adattakarékosság: csak dátumok kerülnek nyilvántartásba (a gyermekek születési dátuma név nélkül, a rokkantsági határozat dátuma szám/diagnózis nélkül). A kérelem teljes valóságindexet (100 %) és kifejezett hozzájárulást igényel. Kemény zárolás: a kérelem nem hagyható jóvá, amíg valamennyi hitelesítő meg nem erősítette; az elutasítás indokolást igényel. A hitelesítők értesítése kizárólag a platformon belül (in-app), külső csatornák nélkül. Adattakarékosság: a hitelesítő nem látja a kérelem tartalmát. |

**11. sz. adatkezelési tevékenység — Kiskorúak adatai (4. modul — Gyermekek)**

| **Állapot** | NEM AKTÍV — a 4. modul a szabályzat 58. cikkével összhangban történő elindításakor aktiválódik. Az aktiválás a DPIA előzetes frissítését és külön szabályzat elfogadását igényli. |
| --- | --- |
| **Az adatkezelés célja** | A kiskorú felhasználók rendszerbeli részvételének lehetővé tétele különleges korlátozási rend mellett. |
| **Az érintettek kategóriái** | A platform kiskorú felhasználói. |
| **Az adatok kategóriái** | A kiskorú felhasználókra vonatkozó adatok, a szülő vagy törvényes képviselő beleegyezése, a kiskorú felhasználóra vonatkozó korlátozások. |
| **Jogalap** | A szülő vagy törvényes képviselő hozzájárulása (ZZPL 16. cikk), a tizenöt évnél fiatalabb személyekre vonatkozó további korlátozásokkal. |
| **Címzettek / adatfeldolgozók** | Vercel Inc. (tárhely) és Neon Inc. (adatbázis), Amerikai Egyesült Államok, adatfeldolgozási szerződés alapján. |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói az USA-ban találhatók (lásd az adatvédelmi szabályzat 9. cikkét). |
| **Megőrzési idő** | Külön szabályzatban kerül megállapításra, szigorúbb követelmények mellett. |
| **Védelmi intézkedések** | A beleegyezés elkülönített tárolása, fokozott hozzáférés-ellenőrzés, fokozott védelmi intézkedések a ZZPL 16. cikkével összhangban. |

**12. sz. adatkezelési tevékenység — A hitelesítési rendszer integritásának felügyelete (a visszaélések megelőzése)**

| **Az adatkezelés célja** | A valóságbizonyíték és a közjó nyilvántartásának integritásvédelme — a visszaélésre utaló minták felderítése (hamis vagy „farmolt” hitelesítések, fióksokszorozás, POEN-összeterelés) a hitelesítések, a nyilvántartás és a szavazás hitelességének megőrzése érdekében. |
| --- | --- |
| **Az érintettek kategóriái** | A platform felhasználói (a hitelesítési gráfon és a hozzájárulási nyilvántartáson keresztül). |
| **Az adatok kategóriái** | Új adatok gyűjtése nélkül. A meglévő, álneves adatok kerülnek kezelésre: hitelesítési gráf (ki kit hitelesít, felügyelet, időbélyegek), a fiók létrejöttének ideje, a POEN-nyilvántartás metaadatai (típus, összeg, idő), tevékenységi mutatók (üzenetek/hirdetések/cserék megléte — igen/nem formában, tartalom nélkül), felhasználótípus, valóságindex. Származtatott bejegyzés: kockázati megállapítás (álnév vagy álnévcsoport, a megsértett szabályok jelölései, számszerű pontszám, állapot). |
| **Jogalap** | Az Alapítvány jogos érdeke (ZZPL 12. cikk 1. bek. 6. pont) — a rendszer védelme a visszaéléstől, valamint a nyilvántartás és a szavazás integritásának megőrzése. |
| **Címzettek / adatfeldolgozók** | Kizárólag a szuperadminisztrátorok (az Alapítvány Igazgatótanácsa). Infrastruktúra: Vercel Inc. (tárhely) és Neon Inc. (adatbázis), USA. A riasztási csatorna (Telegram, e-mail/Resend) csak összesített számokat kap, személyes adatok nélkül. |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói (Vercel, Neon) és a riasztási csatorna (Telegram, Resend) az USA-ban találhatók; a továbbítás védelmi intézkedések mellett történik (az adatvédelmi szabályzat 9. cikke). |
| **Megőrzési idő** | Nyitott megállapítás — amíg emberi felülvizsgálattal meg nem oldódik. A megoldott vagy elvetett megállapítások — legfeljebb 12 hónap (mint a technikai naplók), majd törlés. A felhasználói jogállás megszűnésével a hozzá kapcsolódó megállapítások törlésre, illetve anonimizálásra kerülnek. |
| **Védelmi intézkedések** | A hozzáférés a szuperadminisztrátorokra korlátozódik; a megállapítás kapcsán tett valamennyi cselekmény auditnaplóban kerül rögzítésre; álnevesítés; új adatok gyűjtése nélkül. **A rendszer nem hoz automatikus döntést a ZZPL 38. cikke értelmében — csak megjelöli a fiókokat/csoportokat, az intézkedést pedig felhatalmazott személy hozza meg.** A szabályok a tényleges tevékenység hiányát („üregességet”) helyezik előtérbe, nem a kapcsolatok sűrűségét, elkerülendő a sűrű szövésű valós közösségek téves kezelését. A megállapítás elvetésének lehetősége és a kifogás joga (ZZPL 37. cikk). |
| **Megjegyzés — a jogos érdek arányossági vizsgálata** | Az adatkezelés szükséges az olyan visszaélés megelőzéséhez, amely elértéktelenítené a nyilvántartást és a szavazást; arányos, mivel nem vezet be új adatokat, álneveken dolgozik, nem hoz automatikus döntést, és emberi felülvizsgálat, valamint kifogás alá esik. Az Alapítvány és a tisztességes felhasználók érdeke elsőbbséget élvez az érintett jogaiba való minimális beavatkozással szemben. |

**13. sz. adatkezelési tevékenység — Az adományozók nevének közzététele az adományok listáján**

| **Az adatkezelés célja** | Átláthatóság és a nyilvános adományok nyilvános elismerése. |
| --- | --- |
| **Az érintettek kategóriái** | Azok a természetes személy adományozók, akik a nyilvános adományozást választották. |
| **Az adatok kategóriái** | Vezeték- és keresztnév, az adomány összege és dátuma, álnév. |
| **Jogalap** | Hozzájárulás (ZZPL 12. cikk 1. bek. 1. pont), amelyet a nyilvános adományozás választásával ad meg a POEN nyilvántartásba vétele érdekében. Névtelen adomány esetén a név nem kerül közzétételre, és POEN sem kerül nyilvántartásba. |
| **Címzettek / adatfeldolgozók** | Vercel Inc. (tárhely) és Neon Inc. (adatbázis), Amerikai Egyesült Államok, adatfeldolgozási szerződés alapján. A platform hitelesített felhasználói (az adományok listája). |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói az USA-ban találhatók (lásd az adatvédelmi szabályzat 9. cikkét). |
| **Megőrzési idő** | Mint az adományokra vonatkozó adatoknál — 10 év, az adó- és számviteli előírásokkal összhangban. |
| **Védelmi intézkedések** | A választás önkéntes és adományonként történik; egyértelmű figyelmeztetés a nyilvános adományozás előtt; alternatívaként POEN nélküli névtelen lehetőség; a szabály csak a jövőre nézve alkalmazandó; TLS titkosítás, hozzáférés-ellenőrzés. |
| **Megjegyzés** | A név adománnyal való nyilvános összekapcsolása lehetővé teszi az adományozó álneves bejegyzésének összekapcsolását a személyazonosságával; a feltárás önkéntes, és feltétele a POEN adomány alapján történő nyilvántartásba vételének. |

**14. adatkezelési tevékenység — Felügyeleti ügy (a hitelesítés felügyeletének eredménye)**

| **Az adatkezelés célja** | A hitelesítés feletti felügyelet eredményének rögzítése és a felügyeleti ügy vezetése abból a célból, hogy az Igazgatótanács megállapíthassa a hamis hitelesítést (a valóság bizonyításáról szóló szabályzat 4.2.3, 11., 11a. és 18. cikk). A 4.2.1 verzióig a felügyelő csak megerősíthette a hitelesítést; a gyanúnak nem volt hova rögzülnie, ezért nem is került kivizsgálásra. |
| --- | --- |
| **Érintetti kategóriák** | A felügyelt hitelesítés hitelesítője és hitelesített felhasználója; az eredményt rögzítő felügyelő. |
| **Adatkategóriák** | A felhasználóktól új adat nem kerül begyűjtésre. A meglévő hitelesítési bejegyzés a következőkkel egészül ki: a felügyelet eredménye (rendben / ellenőrzésre / vitatott), a gyanú alanya (hitelesítő, hitelesített, mindkettő, a hálózat egy része), zárt listáról választott indokkód, valamint — kizárólag az „egyéb“ indok esetén — a felügyelő által beírt rövid szabadszöveges leírás. A felügyeleti ügy ugyanezeket az adatokat tartalmazza a hitelesítési bejegyzés megjelölésével és a döntéshez fűzött feljegyzéssel együtt. |
| **Jogalap** | Szerződéses jogviszony teljesítése (ZZPL 12. cikk 1. bek. 2. pont) — a felügyelet a hitelesítési mechanizmus szerves része, amelyen keresztül a felhasználó hozzáfér a rendszerhez, és a hitelesítési kapacitás visszaállításának feltétele. |
| **Címzettek / adatfeldolgozók** | A felügyelet eredménye: a felügyelők (ZRNO-birtokosok), az ugyanazon bejegyzés további felügyeletéhez szükséges mértékben. A felügyeleti ügy: kizárólag a szuperadminisztrátorok (az Alapítvány Igazgatótanácsa). Nem hozzáférhető a hitelesítő, a hitelesített felhasználó, sem a nyilvánosság számára. Infrastruktúra: Vercel Inc. (tárhely) és Neon Inc. (adatbázis), USA. A riasztási csatorna (Telegram, email/Resend) az álnevet és az indokkódot kapja meg, a szabadszöveges leírás nélkül. |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói és a riasztási csatorna az USA-ban találhatók; a továbbítás védelmi intézkedések mellett történik (az Adatvédelmi szabályzat 9. cikke). |
| **Megőrzési idő** | Az alap hiányának megállapításával lezárt ügy a lezárástól számított 90 nap elteltével törlésre kerül. A felügyelet eredménye osztozik a hitelesítési bejegyzés sorsában: a hitelesítés érvénytelenítésével az is törlődik. A felhasználó jogállásának megszűnésekor a rá vonatkozó adatok a hitelesítési gráffal együtt törlésre, illetve anonimizálásra kerülnek. |
| **Védelmi intézkedések** | Az indokok listája zárt — szabadszöveg kizárólag az „egyéb“ indok mellett lehetséges. Felügyeletet nem végezhet az, aki a hitelesítésben részt vett. Az ügy nem jár joghatással a felhasználóra nézve és nem hoz döntést — az intézkedést kizárólag az Igazgatótanács hozza (a ZZPL 38. cikke értelmében vett automatizált döntéshozatal nincs). Az üggyel kapcsolatos minden cselekmény az auditnaplóban rögzül. A ZZPL 37. cikke szerinti tiltakozási jog, valamint a döntés elleni kifogás útja. A be nem igazolódott gyanú határidő szerinti törlése, az érintett kérelme nélkül. |
| **Megjegyzés** | A felügyelő POEN-nyilvántartása a munkához kötődik, nem az eredményhez: 500 POEN-t az a felügyelő kap, aki elsőként rögzít bármilyen eredményt. A juttatás megerősítő eredményhez kötése az elnézésre, s ezzel a rögzítetlen gyanúra ösztönözne. |

**15. sz. adatkezelési tevékenység — A hirdetés kapcsán tett megkeresés és a cseréhez való hozzájárulás útja**

| **Az adatkezelés célja** | Annak megállapítása, hogy teljesülnek-e a platform tartalmához való hozzájárulás csatornáján keresztüli hozzájárulás nyilvántartásba vételének feltételei; e hozzájárulás a 4.2.1 verziótól öt lépésből álló úton keresztül kerül nyilvántartásba (a KOLO rendszerről szóló szabályzat 4.2.3, 15. cikk 8. pont és 40.b cikk). Járulékos cél: annak megelőzése, hogy a hozzájárulás valódi csere nélkül legyen megszerezhető. |
| --- | --- |
| **Az érintettek kategóriái** | Az a felhasználó, akinek az úton elért haladását megállapítjuk; az a felhasználó, aki a hirdetés kapcsán jelentkezett; az a felhasználó, akivel a POEN-nyilvántartás frissült. |
| **Az adatok kategóriái** | A hirdetés kapcsán tett megkeresés: a jelentkező felhasználó álneve, a hirdetés azonosítója és az időpont. Az üzenet tartalmát e célból nem kezeljük. A többit nem gyűjtjük újra, hanem a meglévő adatkezelési tevékenységekből olvassuk ki: a POEN-nyilvántartás frissítéseinek bejegyzéseiből (4. sz. tevékenység) és a hitelesítési gráfból (2. sz. tevékenység), annak megállapítása céljából, hogy a másik fél az ismeretségi körön kívül van-e. |
| **Jogalap** | Szerződéses jogviszony teljesítése (a ZZPL 12. cikk (1) bekezdés 2. pontja) — a hozzájárulás nyilvántartásba vétele annak a jogviszonynak a tartalma, amely alapján a felhasználó a rendszert használja. |
| **Címzettek / adatfeldolgozók** | Az úton elért haladást kizárólag maga a felhasználó látja. A hirdető magából a beszélgetésből értesül arról, hogy valaki megkereste, de más haladását nem látja. Az adatokat nem tesszük közzé, és nem kerülnek be a nyilvános összesítésekbe. Infrastruktúra: Vercel Inc. (tárhely) és Neon Inc. (adatbázis), USA. |
| **Harmadik országba történő továbbítás** | Igen — az infrastruktúra adatfeldolgozói az USA-ban találhatók; a továbbítás védelmi intézkedésekkel történik (az Adatvédelmi szabályzat 9. cikke). |
| **Megőrzési idő** | A megkeresés bejegyzését azzal a hirdetéssel együtt töröljük, amelyre vonatkozik. A felhasználói jogállás megszűnésekor a fiók többi adatával együtt töröljük, illetve anonimizáljuk. A nyilvántartásba vett lépések bejegyzései a hozzájárulás nyilvántartásának sorsát osztják (4. sz. tevékenység). |
| **Védelmi intézkedések** | Nem az üzenetek tartalmát gyűjtjük, hanem kizárólag a jelentkezés tényét. Az ugyanazon hirdetéshez való ismételt jelentkezés nem hoz létre új bejegyzést. Az úton elért haladás nem nyilvános (a szabályzat 67. cikke). A ZZPL 38. cikke értelmében nincs automatizált döntéshozatal: a nyilvántartásba vétel a nyilvánosan közzétett szabályok alkalmazása, és nem jár következménnyel a felhasználó jogállására nézve. A ZZPL 37. cikke szerinti tiltakozási jog. |
| **Megjegyzés** | Az egyes bejegyzésekre vonatkozó 1.000 POEN-es küszöb és az a feltétel, hogy a másik fél az ismeretségi körön kívül legyen, azért van, hogy a csatorna a hálózat tényleges bővülését fizesse meg. Ezek nélkül az utat ugyanazon emberkörön belüli jelképes bejegyzésekkel lehetne teljesíteni, és az adatkezelés olyan célt szolgálna, amelyet nem érne el. |

**ZÁRÓ RENDELKEZÉSEK**

E nyilvántartás az adatkezelési tevékenységek minden változásakor, a rendszer új moduljainak aktiválásakor vagy a technikai és szervezési védelmi intézkedések változásakor frissítésre kerül. A nyilvántartás frissítése az adatkezelő kötelezettsége a ZZPL 47. cikkével összhangban.

A nyilvántartás kérésre hozzáférhető a közérdekű információkkal és a személyes adatok védelmével foglalkozó biztos számára.

Kelt Zomborban (Sombor), 2026.06.06. napján.

**AZ IGAZGATÓTANÁCS NEVÉBEN**

Az Igazgatótanács elnöke

_________________________

Jelena Stijepović
