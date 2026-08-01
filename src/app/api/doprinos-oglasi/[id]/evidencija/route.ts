import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { imaFunkcionalniPristup } from "@/lib/protokol/pristup";
import { sacuvajNaR2, r2Konfigurisan } from "@/lib/skladiste";

const DOKAZ_MAX_SIZE = 5 * 1024 * 1024; // 5MB, isto kao slike na Pijaci
const DOKAZ_TIPOVI = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// POST /api/doprinos-oglasi/[id]/evidencija — unos dnevnog izvršenja.
// Prima multipart/form-data (dokaz = screenshot koji ide na R2) ili JSON
// (legacy, dokaz kao tekstualni link).
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });
  if (!(await imaFunkcionalniPristup(session.user.id)))
    return NextResponse.json({ error: "Potreban je indeks stvarnosti od najmanje 10%." }, { status: 403 });

  const { id: oglasId } = await params;

  let date: unknown, predlozeniPoen: unknown, description: unknown, dokaz: unknown;
  let dokazSlika: File | null = null;
  if ((req.headers.get("content-type") ?? "").includes("multipart/form-data")) {
    const fd = await req.formData().catch(() => null);
    if (!fd) return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
    date = fd.get("date");
    predlozeniPoen = fd.get("predlozeniPoen");
    description = fd.get("description");
    const f = fd.get("dokazSlika");
    if (f instanceof File && f.size > 0) dokazSlika = f;
  } else {
    const body = await req.json().catch(() => ({}));
    ({ date, predlozeniPoen, description, dokaz } = body);
  }

  if (dokazSlika) {
    if (dokazSlika.size > DOKAZ_MAX_SIZE)
      return NextResponse.json({ error: "Screenshot dokaza može biti najviše 5MB." }, { status: 400 });
    if (!DOKAZ_TIPOVI.includes(dokazSlika.type))
      return NextResponse.json({ error: "Dozvoljeni formati dokaza: JPG, PNG, WebP." }, { status: 400 });
    if (!r2Konfigurisan())
      return NextResponse.json({ error: "Skladište slika nije konfigurisano — dokaz trenutno nije moguće priložiti." }, { status: 503 });
  }

  // Validacije
  if (!date || !predlozeniPoen || !description) return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
  const predlozeni = Number(predlozeniPoen);
  if (!Number.isInteger(predlozeni) || predlozeni < 1) return NextResponse.json({ error: "Predloženi POEN mora biti pozitivan ceo broj." }, { status: 400 });
  if (typeof description !== "string" || description.trim().length < 10) return NextResponse.json({ error: "Opis mora imati najmanje 10 karaktera." }, { status: 400 });

  // Datum — max 3 dana unazad
  const datumEv = new Date(String(date));
  datumEv.setHours(0, 0, 0, 0);
  const danas = new Date(); danas.setHours(0, 0, 0, 0);
  const razlikaMs = danas.getTime() - datumEv.getTime();
  const razlikaDana = Math.floor(razlikaMs / (1000 * 60 * 60 * 24));
  if (razlikaDana < 0 || razlikaDana > 3) return NextResponse.json({ error: "Evidencija moguća max 3 dana unazad." }, { status: 400 });

  // Oglas i primljena prijava
  const oglas = await prisma.doprinosOglas.findUnique({ where: { id: oglasId } });
  if (!oglas || oglas.status !== "ACTIVE") return NextResponse.json({ error: "Zadatak nije aktivan." }, { status: 400 });

  // Predloženi POEN pojedinačnog dnevnog izvršenja ne sme premašiti predloženi POEN
  // celog zadatka (čl. 26 — gornja granica po dnevnom izvršenju). Zadatak sa
  // predlozeniPoen = 0 nema ograničenje — važi samo zdravorazumska granica unosa.
  if (predlozeni > 10_000_000)
    return NextResponse.json({ error: "Predloženi POEN dnevnog izvršenja ne može preći 10.000.000." }, { status: 400 });
  if (oglas.predlozeniPoen > 0 && predlozeni > oglas.predlozeniPoen)
    return NextResponse.json({ error: `Predloženi POEN dnevnog izvršenja ne može preći ${oglas.predlozeniPoen.toLocaleString("sr-RS")} (maksimalni POEN zadatka).` }, { status: 400 });

  const prijava = await prisma.oglasPrijava.findUnique({
    where: { oglasId_userId: { oglasId, userId: session.user.id } },
  });
  if (!prijava || prijava.status !== "APPROVED") return NextResponse.json({ error: "Vaša prijava za ovaj zadatak nije primljena." }, { status: 403 });

  // Provera duplikata za isti dan
  const postoji = await prisma.oglasEvidencija.findUnique({
    where: { userId_oglasId_date: { userId: session.user.id, oglasId, date: datumEv } },
  });
  if (postoji) return NextResponse.json({ error: "Evidencija za taj dan je već uneta." }, { status: 400 });

  // Kumulativni predloženi POEN svih dnevnih izvršenja (osim odbijenih) ne sme preći
  // predloženi POEN zadatka (čl. 11 — raspodela predloženog POEN-a po dnevnim izvršenjima).
  // Zadatak sa predlozeniPoen = 0 nema kumulativno ograničenje.
  if (oglas.predlozeniPoen > 0) {
    const agg = await prisma.oglasEvidencija.aggregate({
      where: { userId: session.user.id, oglasId, status: { not: "REJECTED" } },
      _sum: { predlozeniPoen: true },
    });
    const dosadasnji = agg._sum.predlozeniPoen ?? 0;
    if (dosadasnji + predlozeni > oglas.predlozeniPoen)
      return NextResponse.json({ error: `Zbir predloženog POEN-a po dnevnim izvršenjima (${(dosadasnji + predlozeni).toLocaleString("sr-RS")}) prelazi maksimalni POEN zadatka (${oglas.predlozeniPoen.toLocaleString("sr-RS")}).` }, { status: 400 });
  }

  // Dokaz: screenshot → R2 (javni URL u bazu), ili legacy tekstualni link.
  let dokazUrl: string | null = typeof dokaz === "string" && dokaz.trim() ? dokaz.trim() : null;
  if (dokazSlika) {
    const ext = dokazSlika.type === "image/png" ? ".png" : dokazSlika.type === "image/webp" ? ".webp" : ".jpg";
    const buffer = Buffer.from(await dokazSlika.arrayBuffer());
    dokazUrl = await sacuvajNaR2(`dokazi/${oglasId}/${randomUUID()}${ext}`, buffer, dokazSlika.type);
  }

  await prisma.oglasEvidencija.create({
    data: {
      userId: session.user.id,
      oglasId,
      prijavaId: prijava.id,
      date: datumEv,
      predlozeniPoen: predlozeni,
      dokaz: dokazUrl,
      description: description.trim(),
    },
  });

  void posaljiAdminAlert(
    "Novo dnevno izvršenje (operativni doprinos)",
    `Zadatak: ${oglas.title}\nKorisnik: ${session.user.pseudonim}\nPredloženi POEN: ${predlozeni.toLocaleString("sr-RS")}`
  );

  return NextResponse.json({ ok: true, predlozeniPoen: predlozeni });
}
