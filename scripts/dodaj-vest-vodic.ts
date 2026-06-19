import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Dodaje/osvežava vest „Vodič kroz platformu" (BlogPost) — prikazuje se na Početnoj.
// Idempotentno: ako vest ne postoji → kreira; ako postoji i sadržaj se razlikuje → osvežava; inače preskače.
//
// Test:  DATABASE_URL=$(grep -E '^DATABASE_URL=' .env | cut -d= -f2- | tr -d '"') npx tsx scripts/dodaj-vest-vodic.ts
// Prod:  DATABASE_URL=$(grep -E '^PROD_DATABASE_URL=' .env.prod.db | cut -d= -f2-) npx tsx scripts/dodaj-vest-vodic.ts
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const NASLOV = "Vodič kroz platformu";

// Sadržaj prati trenutni izgled sajta i grupisani meni sa leve strane (Sidebar.tsx):
// Početna · Novčanik · Pijaca · Verifikacija · Donacije/Pokrovitelj · grupa „Zajedničko dobro"
// (Sistem, ZRNO, Doprinos, Programi, Tabla jemstva, Nadzor) · Admin. Renderuje se sa
// whitespace-pre-wrap, pa se naslovi sekcija i prazni redovi čuvaju.
const SADRZAJ = `Dobrodošli! Ovaj vodič vas ukratko provodi kroz svaki ekran platforme. Kroz aplikaciju se krećete preko menija sa leve strane (na telefonu preko dugmeta za meni gore levo). Stavke su grupisane po nameni, a grupa „Zajedničko dobro" se otvara i zatvara klikom.

Početna
Prvi ekran posle prijave. Levo su vesti Fondacije (poput ove koju upravo čitate), a desno Pričaonica — zajednička soba u kojoj svi prijavljeni prate razgovor, dok verifikovani članovi mogu i da pišu (do 1.000 znakova po poruci).

Novčanik
Vaše mesto za POEN. Vidite trenutno stanje i celu istoriju — ko je, kada i koliko evidentirao. Odavde upisujete POEN drugom korisniku: prenos je 1:1, bez provizije. POEN je interna obračunska jedinica kojom se beleži doprinos zajedničkom dobru — nije novac i ne unovčava se van sistema. Tu je i vaš QR kod, preko kog vas drugi lako pronalaze.

Pijaca
Prostor za razmenu dobara i usluga među članovima. Pregled oglasa je dostupan svima — naslov, opis, cena, lokacija i pseudonim oglašivača. Postavljanje oglasa, pristup kontaktu oglašivača i poruke rezervisani su za verifikovane članove. Za samu razmenu odgovaraju korisnici međusobno; Fondacija ne posreduje.

Verifikacija
Verifikacija povezuje zajednicu kroz lanac jemstva. Osoba koja vas lično poznaje potvrđuje vas skeniranjem vašeg QR koda — bez dokumenata i bez obaveznog fizičkog prisustva. Svaka verifikacija podiže vaš indeks poverenja; kada dostignete 10%, dobijate pun pristup platformi. Na svom profilu vidite indeks i mini-stablo veza. Ako vas još niko na platformi ne poznaje, krenite od Table jemstva (za nove članove istaknuta je odmah uz Verifikaciju) — tu se predstavljate zajednici.

Donacije
Ovde fizička lica podržavaju Fondaciju novčanim prilogom. Svaki prilog se beleži i prati kroz nivoe podrške.

Pokrovitelj
Namenjeno pravnim licima i preduzetnicima koji žele da podrže zajednicu — novcem, robom ili uslugama. Tok je jednostavan: prijava, ugovor, potpis i potvrda Fondacije.

Zajedničko dobro
Padajuća grupa koja okuplja celine vezane za zajednicu kao celinu:

— Sistem: pokazatelji zajednice — broj članova, evidentirani doprinosi, broj krugova i ukupan opticaj POEN-a. Brojevi su javni i zbirni.

— ZRNO: beleži vaš položaj u zajednici. Upisuje se iz evidentiranog POEN-a (najmanje 20.000), a iz aktiviranog ZRNA proizlazi vaš glas u Gornjem Kolu — telu kroz koje zajednica odlučuje.

— Doprinos: ovde preuzimate i izvršavate operativne zadatke koje zajednica objavi. Potvrđen rad se evidentira u POEN-ima.

— Programi: vidovi podrške — majkama i primarnim starateljima, starijima, posebna briga i školovanje. Otvoreni su svim verifikovanim članovima.

— Tabla jemstva: mesto na kom se novi članovi predstavljaju zajednici radi verifikacije. Verifikovanima služi i obrnuto — da pronađu nekoga za koga mogu da jemče.

— Nadzor: vidljiv samo nosiocima ZRNA. Čuva integritet lanca jemstva — obeležava sumnjive obrasce, dok odluku o svakoj meri uvek donosi čovek.

Profil i poruke
Svoj profil, podešavanja i privatne poruke otvarate iz zaglavlja i klikom na pseudonime kroz aplikaciju. Na profilu sami birate šta je javno, a šta privatno.

Admin
Vide ga samo članovi Upravnog odbora Fondacije; služi za vođenje sistema.

Prijatno korišćenje!`;

const OBJAVLJENO = new Date("2026-06-17T10:00:00.000Z");

async function main() {
  const host = (process.env.DATABASE_URL ?? "").replace(/:\/\/[^@]*@/, "://***@");
  console.log("DB:", host);

  // Autor: osnivač/SUPERADMIN (Nikola). Probamo email, pa fallback na bilo kog SUPERADMIN-a.
  let autor = await prisma.user.findUnique({ where: { email: "alva.serbia@gmail.com" }, select: { id: true, pseudonim: true } });
  if (!autor) autor = await prisma.user.findFirst({ where: { admin: "SUPERADMIN" }, select: { id: true, pseudonim: true } });
  if (!autor) { console.error("✗ Nema autora (SUPERADMIN) u bazi — prekidam."); return; }
  console.log("Autor:", autor.pseudonim);

  const postoji = await prisma.blogPost.findFirst({ where: { title: NASLOV } });
  if (postoji) {
    if (postoji.content === SADRZAJ) {
      console.log(`• Vest „${NASLOV}" već postoji i sadržaj je aktuelan (id ${postoji.id}) — preskačem.`);
      return;
    }
    await prisma.blogPost.update({ where: { id: postoji.id }, data: { content: SADRZAJ } });
    console.log(`✓ Osvežen sadržaj „${NASLOV}" (id ${postoji.id}, ${SADRZAJ.length} znakova).`);
    return;
  }

  const v = await prisma.blogPost.create({
    data: { title: NASLOV, content: SADRZAJ, authorId: autor.id, publishedAt: OBJAVLJENO, createdAt: OBJAVLJENO },
  });
  console.log(`✓ Dodata vest „${NASLOV}" (id ${v.id}, ${SADRZAJ.length} znakova).`);
}

main().finally(() => prisma.$disconnect());
