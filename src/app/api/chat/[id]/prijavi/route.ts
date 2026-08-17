import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { obavesti } from "@/lib/notifikacije";
import { jeHitno, proveriPrijavu } from "@/lib/prijava-poruke-pravila";

/**
 * POST /api/chat/[id]/prijavi  { razlogKod, opis? }
 *
 * Prijava poruke iz Pričaonice (Pravilnik o učešću dece čl. 18a; Uslovi čl. 25).
 *
 * 🔴 Postoji zato što roditelj razgovore dece VIŠE NE ČITA. Dete je jedino koje
 * može da signalizira, pa se moderacija Fondacije kači na njegovu prijavu. Bez ovog
 * dugmeta bi dečja soba bila jedini prostor na platformi bez ijednog puta do
 * Fondacije.
 *
 * Prijava NE uklanja poruku — uklanja je Fondacija, istim putem kao svaki drugi
 * sadržaj (`DELETE /api/admin/chat/[id]`). Uklanjanje je odluka, prijava je signal.
 *
 * Otvorena je svakome ko poruku vidi, i detetu i odraslom: sporan sadržaj se
 * prijavljuje tamo gde se vidi, a prijava nije komunikacija sa autorom.
 *
 * 🔴 Upisuje se I PORUKA I AUTOR. Poruka je dokaz (bez nje bi moderator morao da
 * pročita celu sobu — nadzor koji je ovaj model skinuo), a autor je subjekt: tri
 * prijave iz tri razgovora nad istim nalogom su signal koji nijedna od tih poruka
 * sama ne nosi. Šifra razloga ide sa zatvorene liste, jer sedmogodišnjak neće
 * napisati obrazloženje, a obrazac mamljenja se bez šifre ne može prepoznati.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const provera = proveriPrijavu(body?.razlogKod, body?.opis ?? body?.razlog);
  if (!provera.ok) return await greska(provera.greska, 400);

  const poruka = await prisma.chatMessage.findUnique({
    where: { id },
    select: { id: true, userId: true, soba: true, uklonjenoAt: true, content: true },
  });
  if (!poruka || poruka.uklonjenoAt) return await greska("Poruka nije pronađena.", 404);
  if (poruka.userId === session.user.id) {
    return await greska("Svoju poruku ne prijavljuješ — obriši je ili je ostavi.", 400);
  }

  try {
    await prisma.prijavaPoruke.create({
      data: {
        porukaId: poruka.id,
        prijaviocId: session.user.id,
        prijavljeniId: poruka.userId,
        razlogKod: provera.kod,
        razlog: provera.opis,
      },
    });
  } catch (e) {
    // P2002 = već si prijavio/la ovu poruku. Ponovljen pritisak nije nov podatak,
    // pa se odgovara isto kao prvi put — da se ne odaje da li si već prijavio.
    if (e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P2002") {
      return NextResponse.json({ ok: true });
    }
    throw e;
  }

  // Koliko RAZLIČITIH ljudi je prijavilo ovaj nalog — u alertu, da se obrazac vidi
  // pre nego što se otvori admin ekran. Broje se prijavioci, ne prijave: jedan
  // čovek koji pritisne tri puta nije obrazac nego jedan čovek.
  const [autor, prijavioci] = await Promise.all([
    prisma.user.findUnique({ where: { id: poruka.userId }, select: { pseudonim: true } }),
    prisma.prijavaPoruke.findMany({
      where: { prijavljeniId: poruka.userId },
      select: { prijaviocId: true },
      distinct: ["prijaviocId"],
    }),
  ]);

  void posaljiAdminAlert(
    `${jeHitno(provera.kod) ? "🔴 " : ""}Prijavljena poruka u Pričaonici (${poruka.soba})`,
    `Prijavio/la: ${session.user.pseudonim}\nAutor: ${autor?.pseudonim ?? "?"}\n` +
      `Šifra: ${provera.kod}\nOpis: ${provera.opis ?? "(nije naveden)"}\n` +
      `Različitih prijavilaca za ovaj nalog: ${prijavioci.length}\n` +
      `Poruka: ${poruka.content.slice(0, 300)}\n\n/admin?tab=prijave`
  );

  // Zvonce adminima, da red čekanja ne živi samo u mejlu. Isti obrazac kao kod
  // prvih oglasa: bez javljanja red postoji a niko ne zna da postoji.
  const admini = await prisma.user.findMany({
    where: { admin: { in: ["ADMIN", "SUPERADMIN"] }, deaktiviranAt: null },
    select: { id: true },
  });
  for (const a of admini) {
    void obavesti(a.id, {
      tip: "PRIJAVA_PORUKE",
      kljuc: "notifikacije.prijava_poruke_admin",
      naslov: "Prijavljena poruka u Pričaonici",
      tekst: "Prijavljena je poruka u Pričaonici. Pogledaj tab \u201ePrijave\u201c.",
      link: "/admin?tab=prijave",
      email: false,
    });
  }

  return NextResponse.json({ ok: true });
}
