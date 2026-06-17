import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Test:  npx tsx scripts/azuriraj-vodic-nadzor.ts
// Prod:  DATABASE_URL=$(grep -E '^PROD_DATABASE_URL=' .env.prod.db | cut -d= -f2-) npx tsx scripts/azuriraj-vodic-nadzor.ts
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const NASLOV = "Vodič kroz platformu";
const SADRZAJ = `Kretanje
Kroz platformu se krećete preko menija sa leve strane. Na Početnoj vas čekaju vesti Fondacije i zajednička soba za razgovor.

Novčanik i Pijaca
Vaš Novčanik je mesto gde pratite stanje i istoriju POEN-a i odakle upisujete POEN drugom korisniku. Na Pijaci se objavljuju oglasi i razmenjuju dobra i usluge među članovima.

Verifikacija
Verifikacija povezuje zajednicu kroz lanac jemstva: osoba koja vas poznaje potvrđuje vas putem QR koda. Ako tek ulazite, na Tabli jemstva se predstavljate kako bi neko iz zajednice mogao da vas poveže i potvrdi.

Nadzor
Nadzor čuva integritet tog lanca: posmatra verifikacije i obeležava sumnjive obrasce, dok odluku o svakoj meri uvek donosi čovek.

Podrška zajednici
Zajednicu možete podržati kroz Donacije, kao fizičko lice, ili kroz Pokroviteljstvo, namenjeno pravnim licima i preduzetnicima.

Zajedničko dobro
U grupi Zajedničko dobro nalaze se četiri celine. Sistem prikazuje pokazatelje zajednice — broj članova, evidentirane doprinose i opticaj. ZRNO beleži vaš položaj u zajednici i iz njega proizlazi glas u Gornjem Kolu. Kroz Doprinos preuzimate i izvršavate operativne zadatke zajednice. Programi okupljaju vidove podrške — majkama i starateljima, starijima, posebnu brigu i školovanje.`;

async function main() {
  const host = (process.env.DATABASE_URL ?? "").replace(/:\/\/[^@]*@/, "://***@");
  console.log("DB:", host);
  const v = await prisma.blogPost.findFirst({ where: { title: NASLOV } });
  if (!v) { console.warn(`⚠ Vest „${NASLOV}" ne postoji — preskačem.`); return; }
  if (v.content === SADRZAJ) { console.log("• Sadržaj već ažuriran — preskačem."); return; }
  await prisma.blogPost.update({ where: { id: v.id }, data: { content: SADRZAJ } });
  console.log(`✓ Ažuriran „${NASLOV}" — dodata rečenica o Nadzoru (${SADRZAJ.length} znakova).`);
}

main().finally(() => prisma.$disconnect());
