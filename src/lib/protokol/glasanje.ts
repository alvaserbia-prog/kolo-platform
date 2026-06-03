/**
 * Glasanje Gornjeg Kola — obračunski period i utvrđivanje ishoda
 * (Pravilnik o Gornjem Kolu 3.7.6, čl. 8, 9, 11, 13).
 *
 * Obračunski period = ponoć do ponoći (lokalno, konvencija sistema). Predlog
 * otvoren u periodu N stavlja se na glasanje u narednom periodu N+1 i zatvara se
 * na kraju tog perioda. Predlagač ne određuje rok (čl. 11). Ishod se utvrđuje
 * prostom većinom datih glasova; izjednačeno = neusvojeno (čl. 9).
 */
import { prisma } from "@/lib/prisma";

export type FazaPredloga = "NAJAVLJEN" | "U_TOKU" | "ZATVOREN";

/**
 * Granice glasanja za predlog otvoren u trenutku `od`:
 * glasanje počinje u ponoć narednog obračunskog perioda i traje tačno jedan period.
 */
export function granicePeriodaGlasanja(od: Date): { glasanjePocetak: Date; deadline: Date } {
  const pocetak = new Date(od);
  pocetak.setHours(0, 0, 0, 0);
  pocetak.setDate(pocetak.getDate() + 1); // ponoć narednog obračunskog perioda (N+1)
  const deadline = new Date(pocetak);
  deadline.setDate(deadline.getDate() + 1); // kraj tog perioda (N+2 ponoć)
  return { glasanjePocetak: pocetak, deadline };
}

/** Ishod po prostoj većini datih glasova; izjednačeno = neusvojeno (čl. 8, 9). */
export function utvrdiIshod(zaZbir: number, protivZbir: number): boolean {
  return zaZbir > protivZbir;
}

/** Faza predloga u datom trenutku (NAJAVLJEN pre početka, U_TOKU tokom perioda, inače ZATVOREN). */
export function fazaPredloga(
  p: { glasanjePocetak: Date; deadline: Date; status: string },
  now: Date = new Date()
): FazaPredloga {
  if (p.status === "CLOSED") return "ZATVOREN";
  if (now < p.glasanjePocetak) return "NAJAVLJEN";
  if (now >= p.deadline) return "ZATVOREN"; // isteklo, biće zatvoreno u bazi
  return "U_TOKU";
}

/**
 * Registar odluka (čl. 21) — nepromenljiv pregled svih zatvorenih predloga sa
 * ishodom i zbirovima glasačke moći. Zatvoreni zapisi se ne menjaju retroaktivno
 * (status CLOSED se postavlja jednom u `zatvoriIstekleIObjaviIshod` i ne dira se).
 */
export async function dohvatiRegistarOdluka() {
  await zatvoriIstekleIObjaviIshod();
  const odluke = await prisma.glasanjePredlog.findMany({
    where: { status: "CLOSED" },
    orderBy: { deadline: "desc" },
    include: {
      author: { select: { pseudonim: true } },
      _count: { select: { glasovi: true } },
    },
  });
  return odluke.map((o) => ({
    id: o.id,
    title: o.title,
    description: o.description,
    authorPseudonim: o.author.pseudonim,
    rok: o.deadline.toISOString(),
    ishodUsvojen: o.ishodUsvojen,
    zaZbir: o.zaZbir ?? 0,
    protivZbir: o.protivZbir ?? 0,
    brGlasova: o._count.glasovi,
  }));
}

/**
 * Zatvara sve predloge kojima je istekao rok i beleži ishod (prosta većina).
 * Idempotentno — bezbedno za pozivanje pri svakom čitanju.
 */
export async function zatvoriIstekleIObjaviIshod(now: Date = new Date()): Promise<void> {
  const istekli = await prisma.glasanjePredlog.findMany({
    where: { status: "ACTIVE", deadline: { lte: now } },
    include: { glasovi: { select: { za: true, glasackaGlasova: true } } },
  });

  for (const p of istekli) {
    const zaZbir = p.glasovi.filter((g) => g.za).reduce((s, g) => s + g.glasackaGlasova, 0);
    const protivZbir = p.glasovi.filter((g) => !g.za).reduce((s, g) => s + g.glasackaGlasova, 0);
    await prisma.glasanjePredlog.update({
      where: { id: p.id },
      data: {
        status: "CLOSED",
        zaZbir,
        protivZbir,
        ishodUsvojen: utvrdiIshod(zaZbir, protivZbir), // izjednačeno = neusvojeno (čl. 9)
      },
    });
  }
}
