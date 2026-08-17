/**
 * Prijava poruke iz Pričaonice — SERVISNE funkcije (odluka Fondacije).
 *
 * Čista pravila i šifarnik su u `prijava-poruke-pravila.ts` (uvozi ih i ekran u
 * pretraživaču); ovde je sve što dira bazu. Re-eksportuje pravila, pa server ima
 * jedan ulaz.
 *
 * Dve odluke, obe uz obavezno obrazloženje koje ide čoveku:
 *  - **ukloni poruku** — poruka se meko uklanja (`ChatMessage.uklonjenoAt`), autor
 *    dobija obaveštenje sa razlogom (Uslovi čl. 25 st. 2 traži „uz navođenje
 *    razloga"), a SVE otvorene prijave nad tom porukom se zatvaraju;
 *  - **odbaci prijavu** — poruka ostaje, prijavilac dobija obrazloženje.
 *
 * 🔴 Uklanjanje, NIKAD prepravka tuđe poruke — isto pravilo kao za oglase: akti
 * daju pravo uklanjanja, ne izmene, a prepravkom bi Fondacija postala koautor
 * sadržaja i izgubila zaštitu iz čl. 25 st. 1.
 *
 * 🔴 Odluka NE sankcioniše nalog. Suspenzija i isključenje su zasebne odluke po
 * Uslovima čl. 27 i 28 i donose se u tabu Korisnici — ovde se odlučuje samo o
 * sadržaju. Grupisanje po prijavljenom postoji da bi se obrazac VIDEO, ne da bi
 * sistem sam kaznio.
 */
import { prisma } from "./prisma";
import { obavesti } from "./notifikacije";
import { logAdminAkcija } from "./audit";
import { tekstObavestenjaPoruka } from "./moderacija";

export * from "./prijava-poruke-pravila";

type Ishod = { ok: true } | { ok: false; razlog: string };

/**
 * Fondacija uklanja prijavljenu poruku.
 *
 * Zatvara **sve** otvorene prijave nad tom porukom, ne samo onu na koju je
 * pritisnuto: poruke više nema, pa ostale prijave nad njom nemaju o čemu da se
 * odlučuje. Svaki prijavilac dobija obaveštenje — ko je digao ruku, ima pravo da
 * zna šta je od toga bilo.
 */
export async function ukloniPoPrijavi(prijavaId: string, adminId: string, odluka: string): Promise<Ishod> {
  const prijava = await prisma.prijavaPoruke.findUnique({
    where: { id: prijavaId },
    select: {
      id: true,
      status: true,
      porukaId: true,
      poruka: { select: { userId: true, uklonjenoAt: true, user: { select: { pseudonim: true } } } },
    },
  });
  if (!prijava) return { ok: false, razlog: "Prijava nije pronađena." };
  if (prijava.status !== "OTVORENA") return { ok: false, razlog: "Prijava je već rešena." };

  const sada = new Date();

  if (!prijava.poruka.uklonjenoAt) {
    await prisma.chatMessage.update({
      where: { id: prijava.porukaId },
      data: { uklonjenoAt: sada, uklonjenRazlog: odluka, uklonioId: adminId },
    });
    await logAdminAkcija(
      adminId,
      "CHAT_PORUKA_UKLONJENA",
      prijava.porukaId,
      `${prijava.poruka.user.pseudonim}: ${odluka}`,
    );
    // Sadržaj poruke se NE prepisuje u audit log ni u obaveštenje — log nosi
    // pseudonim i razlog (konvencije u `audit.ts`).
    await obavesti(prijava.poruka.userId, {
      tip: "CHAT_PORUKA_UKLONJENA",
      kljuc: "notifikacije.chat_uklonjena",
      parametri: { razlog: odluka },
      naslov: "Poruka uklonjena iz Pričaonice",
      tekst: tekstObavestenjaPoruka(odluka),
      link: "/pocetna",
    });
  }

  const otvorene = await prisma.prijavaPoruke.findMany({
    where: { porukaId: prijava.porukaId, status: "OTVORENA" },
    select: { id: true, prijaviocId: true },
  });

  await prisma.prijavaPoruke.updateMany({
    where: { porukaId: prijava.porukaId, status: "OTVORENA" },
    data: { status: "RESENA", odluka, resioId: adminId, resenAt: sada },
  });

  await logAdminAkcija(adminId, "PRIJAVA_PORUKE_RESENA", prijava.id, odluka);

  for (const p of otvorene) {
    await obavesti(p.prijaviocId, {
      tip: "PRIJAVA_PORUKE_RESENA",
      kljuc: "notifikacije.prijava_poruke_resena",
      parametri: { odluka },
      naslov: "Prijavljena poruka je uklonjena",
      tekst: `Fondacija je uklonila poruku koju si prijavio/la. Obrazloženje: ${odluka}`,
      link: "/pocetna",
    });
  }

  return { ok: true };
}

/**
 * Fondacija odbacuje prijavu — poruka ostaje.
 *
 * Odbacuje se **samo ta** prijava. Druga prijava nad istom porukom može imati
 * drugu šifru i drugog prijavioca, pa se ceni zasebno.
 */
export async function odbaciPrijavuPoruke(prijavaId: string, adminId: string, odluka: string): Promise<Ishod> {
  const prijava = await prisma.prijavaPoruke.findUnique({
    where: { id: prijavaId },
    select: { id: true, status: true, prijaviocId: true },
  });
  if (!prijava) return { ok: false, razlog: "Prijava nije pronađena." };
  if (prijava.status !== "OTVORENA") return { ok: false, razlog: "Prijava je već rešena." };

  await prisma.prijavaPoruke.update({
    where: { id: prijava.id },
    data: { status: "ODBACENA", odluka, resioId: adminId, resenAt: new Date() },
  });

  await logAdminAkcija(adminId, "PRIJAVA_PORUKE_ODBACENA", prijava.id, odluka);

  await obavesti(prijava.prijaviocId, {
    tip: "PRIJAVA_PORUKE_ODBACENA",
    kljuc: "notifikacije.prijava_poruke_odbacena",
    parametri: { odluka },
    naslov: "Prijava poruke je razmotrena",
    tekst: `Fondacija je razmotrila tvoju prijavu i poruka ostaje. Obrazloženje: ${odluka}`,
    link: "/pocetna",
  });

  return { ok: true };
}
