// Jednokratni seed: par realnih zahteva za jemstvo (da tabla nije prazna na screenshotu).
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const LJUDI = [
  { email: "ljubica@demo.rs", pseudonim: "Ljubica_M", hash: "tbl00001", location: "Sombor",
    tekst: "Zdravo! Iz Sombora sam, bavim se pčelarstvom i pravim domaći med i vosak. Tražim nekog ko bi me uveo u mrežu — rado ću prva ponuditi teglicu na poklon. 🍯",
    kontakt: "Mogu na poruke ovde ili na Viber, javite se slobodno." },
  { email: "rade@demo.rs", pseudonim: "Rade_T", hash: "tbl00002", location: "Apatin",
    tekst: "Majstor sam za sitne popravke u kući — struja, vodovod, montaža. Nov sam na platformi, ako me neko poznaje iz kraja neka se javi za verifikaciju.",
    kontakt: "Najlakše preko poruka; mogu da pošaljem i broj telefona u razgovoru." },
  { email: "sneza@demo.rs", pseudonim: "Snezana_K", hash: "tbl00003", location: "Kula",
    tekst: "Predajem matematiku i fiziku, nudim časove za osnovce i srednjoškolce u zamenu za pomoć oko bašte ili zimnice. Tražim jemca iz okoline Kule.",
    kontakt: "Pišite mi ovde na tabli, odgovaram svako veče." },
];

async function main() {
  const lozinka = await bcrypt.hash("demo1234", 12);
  const za30dana = new Date(Date.now() + 30 * 24 * 3600 * 1000);

  for (const p of LJUDI) {
    const u = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: {
        email: p.email, pseudonim: p.pseudonim, passwordHash: lozinka,
        memberHash: p.hash, location: p.location, tipKorisnika: "NEVERIFIKOVAN",
        wallet: { create: { type: "USER", balance: 0 } },
      },
    });
    const ima = await prisma.zahtevZaJemstvo.findFirst({ where: { userId: u.id, status: "AKTIVAN" } });
    if (!ima) {
      await prisma.zahtevZaJemstvo.create({
        data: { userId: u.id, tekstPredstavljanja: p.tekst, kontaktPodaci: p.kontakt,
          status: "AKTIVAN", expiresAt: za30dana },
      });
    }
    console.log("OK", p.pseudonim);
  }
  console.log("Gotovo.");
}

main().finally(() => prisma.$disconnect());
