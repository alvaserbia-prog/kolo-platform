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
import { glasackaMoc } from "./zrno";

export type FazaPredloga = "NAJAVLJEN" | "U_TOKU" | "ZATVOREN";

export class GlasanjeGreska extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/** Period zabrane ponovnog predlaganja iste sadržine (čl. 22). */
export const DANA_PONOVNO_PREDLAGANJE = 30;

/** Normalizacija naslova za poređenje „suštinski istovetne sadržine" (čl. 22). */
export function normalizujNaslov(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Da li postoji neusvojen predlog iste (normalizovane) sadržine zatvoren u
 * poslednjih 30 dana — tada je ponovno predlaganje nedopušteno (čl. 22).
 */
export async function postojiSkoroOdbijen(title: string, now: Date = new Date()): Promise<boolean> {
  const granica = new Date(now.getTime() - DANA_PONOVNO_PREDLAGANJE * 24 * 60 * 60 * 1000);
  const norm = normalizujNaslov(title);
  const odbijeni = await prisma.glasanjePredlog.findMany({
    where: { status: "CLOSED", ishodUsvojen: false, deadline: { gte: granica } },
    select: { title: true },
  });
  return odbijeni.some((o) => normalizujNaslov(o.title) === norm);
}

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
    vrsta: o.vrsta,
    izvrsenjeStatus: o.izvrsenjeStatus,
    vetoObrazlozenje: o.vetoObrazlozenje,
    uoOdgovor: o.uoOdgovor,
    uoObrazlozenje: o.uoObrazlozenje,
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
    include: { glasovi: { select: { za: true, glasackaGlasova: true, userId: true } } },
  });

  // M2: ZRNO se otključava u ponoć, a glas zadržava zamrznutu moć — pa se na zatvaranju
  // moć svakog glasa OGRANIČAVA na trenutno ZAKLJUČANO (aktivno) ZRNO glasača. Ko je u
  // međuvremenu otključao ZRNA, gubi taj deo težine; ko ga je zadržao — nije pogođen.
  // Prvo razreši trenutno stanje ZRNA svih glasača, pa onda preračunaj zbirove.
  const sviGlasaci = [...new Set(istekli.flatMap((p) => p.glasovi.map((g) => g.userId)))];
  const stanja = sviGlasaci.length
    ? await prisma.zrnoStanje.findMany({
        where: { userId: { in: sviGlasaci } },
        select: { userId: true, aktivno: true },
      })
    : [];
  const aktivnoMap = new Map(stanja.map((s) => [s.userId, s.aktivno]));
  const trenutnaMoc = (g: { userId: string; glasackaGlasova: number }) =>
    Math.min(g.glasackaGlasova, glasackaMoc(aktivnoMap.get(g.userId) ?? 0));

  for (const p of istekli) {
    const zaZbir = p.glasovi.filter((g) => g.za).reduce((s, g) => s + trenutnaMoc(g), 0);
    const protivZbir = p.glasovi.filter((g) => !g.za).reduce((s, g) => s + trenutnaMoc(g), 0);
    const usvojen = utvrdiIshod(zaZbir, protivZbir); // izjednačeno = neusvojeno (čl. 9)
    await prisma.glasanjePredlog.update({
      where: { id: p.id },
      data: {
        status: "CLOSED",
        zaZbir,
        protivZbir,
        ishodUsvojen: usvojen,
        // Usvojena ODLUKA je obavezujuća → izvršenje Fondacije (čl. 17).
        // Usvojena DINARSKA_PREPORUKA nije obavezujuća → čeka obrazložen odgovor UO (čl. 20).
        izvrsenjeStatus: usvojen && p.vrsta === "ODLUKA" ? "ZA_IZVRSENJE" : null,
      },
    });
  }
}

/** Fondacija (UO) beleži da je usvojena odluka izvršena (čl. 17). */
export async function izvrsiOdluku(id: string): Promise<void> {
  const p = await prisma.glasanjePredlog.findUnique({ where: { id }, select: { izvrsenjeStatus: true } });
  if (!p) throw new GlasanjeGreska("Predlog nije pronađen.", 404);
  if (p.izvrsenjeStatus !== "ZA_IZVRSENJE")
    throw new GlasanjeGreska("Izvršenje je moguće samo za usvojenu odluku koja čeka izvršenje.");
  await prisma.glasanjePredlog.update({
    where: { id },
    data: { izvrsenjeStatus: "IZVRSENO", izvrsenoAt: new Date() },
  });
}

/**
 * UO daje obrazložen odgovor na usvojenu dinarsku preporuku (čl. 20).
 * Preporuka nije obavezujuća — UO je prihvata ili odbija, uvek uz obrazloženje.
 */
export async function odgovoriNaPreporuku(
  id: string,
  odgovor: "PRIHVACENO" | "ODBIJENO",
  obrazlozenje: string
): Promise<void> {
  const o = (obrazlozenje ?? "").trim();
  if (odgovor !== "PRIHVACENO" && odgovor !== "ODBIJENO")
    throw new GlasanjeGreska("Neispravan odgovor.");
  if (o.length < 10)
    throw new GlasanjeGreska("Odgovor UO mora biti obrazložen (čl. 20).");
  const p = await prisma.glasanjePredlog.findUnique({
    where: { id },
    select: { vrsta: true, status: true, ishodUsvojen: true, uoOdgovor: true },
  });
  if (!p) throw new GlasanjeGreska("Predlog nije pronađen.", 404);
  if (p.vrsta !== "DINARSKA_PREPORUKA" || p.status !== "CLOSED" || p.ishodUsvojen !== true)
    throw new GlasanjeGreska("Odgovor je moguć samo na usvojenu dinarsku preporuku.");
  if (p.uoOdgovor) throw new GlasanjeGreska("UO je već odgovorio na ovu preporuku.");
  await prisma.glasanjePredlog.update({
    where: { id },
    data: { uoOdgovor: odgovor, uoObrazlozenje: o, uoOdgovorAt: new Date() },
  });
}

/**
 * Fondacija (UO) obustavlja izvršenje odluke zaštitnim vetom (čl. 18).
 * Veto mora biti obrazložen — bez obrazloženja predstavlja zloupotrebu.
 */
export async function vetoNaIzvrsenje(id: string, obrazlozenje: string): Promise<void> {
  const o = (obrazlozenje ?? "").trim();
  if (o.length < 10)
    throw new GlasanjeGreska("Zaštitni veto mora imati obrazloženje koje upućuje na konkretnu pretnju održivosti (čl. 18).");
  const p = await prisma.glasanjePredlog.findUnique({ where: { id }, select: { izvrsenjeStatus: true } });
  if (!p) throw new GlasanjeGreska("Predlog nije pronađen.", 404);
  if (p.izvrsenjeStatus !== "ZA_IZVRSENJE")
    throw new GlasanjeGreska("Veto je moguć samo na odluku koja čeka izvršenje.");
  await prisma.glasanjePredlog.update({
    where: { id },
    data: { izvrsenjeStatus: "VETO_OBUSTAVLJENO", vetoObrazlozenje: o, vetoAt: new Date() },
  });
}
