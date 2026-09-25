# 04 — Ana, Milan, Lazar i Marija

## Osnovno
- Trajanje: 54,2 s (određeno trajanjem naracije)
- Format: vertikalno 9:16 (Reels)
- Glavna poruka: Četvoro nepoznatih ljudi se kroz tri razmene poveže u kolo, bez ijednog dinara.
- Titlovi: obavezni, krupni, čitljivi bez zvuka
- Naracija: ElevenLabs, glas „ProVox – Wise & Gentle” (`F2kYsMGahtg8auErVXgY`), model `eleven_v3`

## Gotov video
- `04-ana-milan-lazar-marija.mp4` — 1080×1920, 30 fps, sa naracijom i titlovima
- Animacija: `animacija/scena.html` (crta se u pregledaču), snimanje: `animacija/render.cjs`

## Audio
- `audio/scena-1.mp3` … `audio/scena-6.mp3` — naracija po scenama (za montažu)
- `audio/naracija-cela.mp3` — starija verzija u jednom komadu, još sa „u istom krugu”; video je ne koristi

| Scena | Fajl | Trajanje | Vreme u videu |
|---|---|---|---|
| 1 | scena-1.mp3 | 4,5 s | 0,4–4,9 s |
| 2 | scena-2.mp3 | 8,9 s | 5,2–14,1 s |
| 3 | scena-3.mp3 | 9,8 s | 14,5–24,3 s |
| 4 | scena-4.mp3 | 11,3 s | 24,7–35,9 s |
| 5 | scena-5.mp3 | 9,4 s | 36,3–45,6 s |
| 6 | scena-6.mp3 | 6,4 s | 46,0–52,4 s |

## Vizuelna pravila
- POEN se NIKAD ne prikazuje kao novčić ni novčanica, samo kao red u knjizi evidencije.
- Format reda u knjizi: "Ime → Ime · N POENA"
- Stil: topla, jednostavna 2D animacija, lokalni ambijent (Sombor, vojvođanske kuće)
- Četiri lika imaju stalne boje kroz ceo video: Ana, Milan, Lazar, Marija
- Linije između likova se iscrtavaju postepeno; na kraju ih obuhvata zlatno kolo
- „Kolo”, ne „krug”: Krug je u sistemu poseban modul (lokalna grupa), pa bi reč zbunila

## Scene

### Scena 1 (0,4–4,9 s)
Slika: Mapa Sombora, četiri razmaknuta kružića sa licima i imenima (Ana, Milan, Lazar, Marija). Nema linija.
Naslov: Kako izgleda razmena u KOLU?
Naracija: Četvoro ljudi iz Sombora. Niko nikog ne poznaje.

### Scena 2 (5,2–14,1 s)
Slika: Ana kod tegli meda, Milan prilazi. Iscrtava se linija Milan–Ana. Otvara se knjiga evidencije, upisuje se red.
Knjiga: Milan → Ana · 5.000 POENA
Naracija: Milanu treba med. Ana ga pravi. Dogovore se za pet tegli, 5.000 POENA, i Milan joj ih prepiše.

### Scena 3 (14,5–24,3 s)
Slika: Pokvarena veš mašina (curi voda), Ana zabrinuta. Lazar sa alatom popravlja, mašina radi. Linija Ana–Lazar.
Knjiga: Ana → Lazar · 4.000 POENA
Naracija: Ani se pokvari veš mašina. Lazar je popravi! Ana mu prepiše 4.000 POENA. Nije dala nijedan dinar.

### Scena 4 (24,7–35,9 s)
Slika: Marija vadi tepsiju bureka i nosi je Lazaru (linija Lazar–Marija). Zatim uzima teglu meda kod Ane (linija Marija–Ana).
Knjiga: Lazar → Marija · 1.000 POENA / Marija → Ana · 1.000 POENA
Naracija: Lazaru se jede burek. Marija ispeče tepsiju, a Lazar joj prepiše 1.000 POENA. Marija za njih uzme teglu Aninog meda.

### Scena 5 (36,3–45,6 s)
Slika: Oko svo četvoro se iscrta zlatno kolo koje zasvetli, likovi se smeju i polako se okreću kao u kolu. Knjiga se zatvara.
Natpis: POEN nije novac. To je zapis o doprinosu.
Naracija: Na početku se nisu poznavali... A sad su u istom kolu. POEN nije novac. To je zapis o tome šta je ko dao.

### Scena 6 (46,0–52,4 s)
Slika: Kamera se odmiče, oko kola se pojavljuju nove prazne tačke. KOLO logo i veliko ekolo.rs.
Natpis: Pridruži se besplatno · registracija oko minut
Naracija: Uhvati se i ti u kolo! Registracija traje oko minut. ekolo.rs

## Tekst poslat u ElevenLabs (sa oznakama za ton)
Oznake u uglastim zagradama model ne izgovara, samo menja ton. Brojevi i domen su napisani slovima zbog izgovora („E-kolo tačka rs”).

```
S1: [warmly] Četvoro ljudi iz Sombora. [softly] Niko nikog ne poznaje.
S2: [curious] Milanu treba med. [smiling] Ana ga pravi. Dogovore se za pet tegli, pet hiljada poena, i Milan joj ih prepiše.
S3: [sighs] Ani se pokvari veš mašina. [relieved] Lazar je popravi! Ana mu prepiše četiri hiljade poena. [warmly] Nije dala nijedan dinar.
S4: [playfully] Lazaru se jede burek. Marija ispeče tepsiju, a Lazar joj prepiše hiljadu poena. [smiling] Marija za njih uzme teglu Aninog meda.
S5: [tender] Na početku se nisu poznavali... [happy] A sad su u istom kolu.
    [sincere] Poen nije novac. To je zapis o tome šta je ko dao.
S6: [inviting] Uhvati se i ti u kolo! Registracija traje oko minut. E-kolo tačka rs.
```

## Zabranjene reči (titlovi i natpisi)
kupi, prodaj, plati, zaradi, cena, vredi, vrednost u dinarima (u vezi sa POENOM)
