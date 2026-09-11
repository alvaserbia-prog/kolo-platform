import { NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROK_NABAVKA_DANA, ROK_RAZMENA_DANA, rokOd } from "@/lib/prigovor-pravila";

/**
 * GET /api/prigovor/predmeti
 *
 * Šta korisnik sme da izabere kao PREDMET prigovora (Uslovi čl. 37a st. 3), i
 * koja izjašnjenja se od njega traže (Pravilnik čl. 16 st. 10).
 *
 * Spisak je već filtriran rokom, pa čovek ne bira nešto što će ruta odbiti —
 * ruta ipak proverava sve ponovo, jer ekran nije poslednja reč.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  const ja = session.user.id;
  const sada = new Date();
  const odRazmene = rokOd(sada, -ROK_RAZMENA_DANA);
  const odNabavke = rokOd(sada, -ROK_NABAVKA_DANA);

  const [poslati, ponisteni, delovi, izjasnjenja] = await Promise.all([
    // Prepisi koje sam ja učinio i koji još nisu prijavljeni.
    prisma.transaction.findMany({
      where: {
        type: "TRANSFER",
        createdAt: { gte: odRazmene },
        fromWallet: { userId: ja },
        prijavaRazmene: null,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true, amount: true, createdAt: true,
        toWallet: { select: { user: { select: { pseudonim: true } } } },
      },
    }),
    // Prepisi koji su MENI poništeni — prigovor na odluku Fondacije.
    prisma.transaction.findMany({
      where: {
        type: "TRANSFER",
        toWallet: { userId: ja },
        prijavaRazmene: { status: "PONISTENA", resenAt: { gte: odRazmene } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true, amount: true, createdAt: true,
        fromWallet: { select: { user: { select: { pseudonim: true } } } },
      },
    }),
    prisma.nabavkaPrijava.findMany({
      where: {
        userId: ja,
        status: "PREUZEO",
        ispravljenoAt: null,
        preuzetoAt: { gte: odNabavke },
      },
      orderBy: { preuzetoAt: "desc" },
      select: {
        id: true, preuzetoAt: true,
        nabavka: { select: { naziv: { select: { naziv: true } } } },
      },
    }),
    prisma.prijavaRazmene.findMany({
      where: { protivId: ja, status: "OTVORENA", odgovorProtivAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, opis: true, izjasnjenjeDo: true,
        prijavioc: { select: { pseudonim: true } },
        transakcija: { select: { amount: true, createdAt: true } },
      },
    }),
  ]);

  return NextResponse.json({
    razmena: [
      ...poslati.map((t) => ({
        id: t.id,
        iznos: t.amount,
        datum: t.createdAt,
        strana: t.toWallet?.user?.pseudonim ?? "?",
        smer: "poslao" as const,
      })),
      ...ponisteni.map((t) => ({
        id: t.id,
        iznos: t.amount,
        datum: t.createdAt,
        strana: t.fromWallet?.user?.pseudonim ?? "?",
        smer: "ponisten" as const,
      })),
    ],
    nabavka: delovi.map((d) => ({
      id: d.id,
      dobro: d.nabavka.naziv.naziv,
      datum: d.preuzetoAt,
    })),
    izjasnjenja: izjasnjenja.map((p) => ({
      id: p.id,
      pseudonim: p.prijavioc.pseudonim,
      opis: p.opis,
      iznos: p.transakcija.amount,
      datum: p.transakcija.createdAt,
      rokDo: p.izjasnjenjeDo,
    })),
  });
}
