import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Pokreni protiv PROD baze:
//   DATABASE_URL=$(grep -E '^PROD_DATABASE_URL=' .env.prod.db | cut -d= -f2-) npx tsx scripts/dodaj-vest-vodic.ts
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const NASLOV = "Vodič kroz platformu";
const SADRZAJ = `Kroz platformu se krećete preko menija sa leve strane. Na Početnoj vas čekaju vesti Fondacije i zajednička soba za razgovor.
Vaš Novčanik je mesto gde pratite stanje i istoriju POEN-a i odakle upisujete POEN drugom korisniku. Na Pijaci se objavljuju oglasi i razmenjuju dobra i usluge među članovima.
Verifikacija povezuje zajednicu kroz lanac jemstva: osoba koja vas poznaje potvrđuje vas putem QR koda. Ako tek ulazite, na Tabli jemstva se predstavljate kako bi neko iz zajednice mogao da vas poveže i potvrdi.
Zajednicu možete podržati i kroz Donacije, kao fizičko lice, ili kroz Pokroviteljstvo, namenjeno pravnim licima i preduzetnicima.
U grupi Zajedničko dobro nalaze se četiri celine. Sistem prikazuje pokazatelje zajednice — broj članova, evidentirane doprinose i opticaj. ZRNO beleži vaš položaj u zajednici i iz njega proizlazi glas u Gornjem Kolu. Kroz Doprinos preuzimate i izvršavate operativne zadatke zajednice. Programi okupljaju vidove podrške — majkama i starateljima, starijima, posebnu brigu i školovanje.`;
const OBJAVLJENO = new Date("2026-06-12T11:02:00.000Z");

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
    console.log(`• Vest „${NASLOV}" već postoji (id ${postoji.id}) — preskačem.`);
    return;
  }

  const v = await prisma.blogPost.create({
    data: { title: NASLOV, content: SADRZAJ, authorId: autor.id, publishedAt: OBJAVLJENO, createdAt: OBJAVLJENO },
  });
  console.log(`✓ Dodata vest „${NASLOV}" (id ${v.id}, ${SADRZAJ.length} znakova).`);
}

main().finally(() => prisma.$disconnect());
