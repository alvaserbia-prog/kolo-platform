import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { obavesti } from "@/lib/notifikacije";
import { jeHitno, proveriPrijavu } from "@/lib/prijava-poruke-pravila";
import { ChatSoba } from "@/generated/prisma/client";

/**
 * POST /api/chat/[id]/prijavi  { razlogKod, opis? }
 *
 * Prijava poruke iz Pričaonice — SAMO iz sobe odraslih (Uslovi čl. 25).
 *
 * 🔴 **Dečja soba je isključena (odluka vlasnika, 04.09.2026.)** Prijava je tamo
 * postojala od 17.08. i vodila u admin tab „Prijave"; taj red čekanja nema ko da
 * rešava, pa je dugme bilo obećanje koje se ne ispunjava. Ugašeno je i na ekranu
 * (`DecjaPocetna.tsx`) i OVDE — ekran nije poslednja reč, ruta je dostižna svakome
 * ko zna adresu, a prijava koja tiho nigde ne stiže gora je od dugmeta kog nema.
 *
 * 🔴 **Posledica koju treba znati:** roditelj razgovore između dece NE ČITA
 * (Pravilnik o učešću dece čl. 9 st. 2), pa dečja soba od ove izmene nema nijedan
 * put do Fondacije — ni preko deteta ni preko roditelja. Uz to čl. 18a istog
 * pravilnika maloletnom korisniku izričito daje pravo da prijavi poruku, pa akt i
 * kod od ove izmene govore različito. Ako se to ikad zatvara, zatvara se na jednom
 * od dva načina: vraćanjem prijave (ova ruta + dugme) ili izmenom čl. 18a — ne
 * trećim putem.
 *
 * Prijava NE uklanja poruku — uklanja je Fondacija, istim putem kao svaki drugi
 * sadržaj (`DELETE /api/admin/chat/[id]`). Uklanjanje je odluka, prijava je signal.
 *
 * 🔴 Upisuje se I PORUKA I AUTOR. Poruka je dokaz, a autor je subjekt: tri prijave
 * iz tri razgovora nad istim nalogom su signal koji nijedna od tih poruka sama ne
 * nosi. Šifra ide sa zatvorene liste, da se obrazac vidi kroz više prijava.
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
  // Dečja soba nema prijavu (vidi zaglavlje). 404, ne 403: poruka za ovu rutu ne
  // postoji, a odgovor „nije ti dozvoljeno" bi rekao da put postoji pa je zatvoren.
  if (poruka.soba === ChatSoba.DECA) {
    return await greska("Poruka nije pronađena.", 404);
  }
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
    // P2002 = ova poruka je već prijavljena s ovog naloga. Ponovljen pritisak nije nov podatak,
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
