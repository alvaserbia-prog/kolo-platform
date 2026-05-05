import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PRIVREMENI test endpoint — direktno zove Resend API i vraća sve detalje.
// Admin-only. Ne koristi naš kod za reset — testira čistu komunikaciju sa Resend-om.
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen — samo admin." }, { status: 403 });
  }

  const toEmail = req.nextUrl.searchParams.get("to") ?? "alva.serbia@gmail.com";

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const RESEND_FROM = process.env.RESEND_FROM ?? "KOLO <noreply@ekolo.rs>";

  if (!RESEND_KEY) {
    return NextResponse.json({ greska: "RESEND_API_KEY nije postavljen na Vercel-u" }, { status: 500 });
  }

  const start = Date.now();
  let resendStatus: number | null = null;
  let resendBody: unknown = null;
  let networkGreska: string | null = null;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: toEmail,
        subject: "TEST — KOLO dijagnostika",
        html: "<p>Ovo je test email iz KOLO dijagnostičkog endpointa. Ako ga vidiš, Resend radi.</p>",
      }),
    });

    resendStatus = res.status;
    const text = await res.text();
    try {
      resendBody = JSON.parse(text);
    } catch {
      resendBody = text;
    }
  } catch (err) {
    networkGreska = err instanceof Error ? err.message : String(err);
  }

  const trajanje = Date.now() - start;

  return NextResponse.json({
    test: {
      to: toEmail,
      from: RESEND_FROM,
      apiKey: `${RESEND_KEY.slice(0, 6)}...${RESEND_KEY.slice(-4)}`,
      trajanje_ms: trajanje,
      resendStatus,
      resendOdgovor: resendBody,
      networkGreska,
      ishod: networkGreska
        ? "❌ Mreža/connection greška — fetch ka Resend-u nije uspeo"
        : resendStatus === 200
        ? "✅ Resend prihvatio zahtev — email bi trebalo da stigne"
        : `⚠️ Resend odbio (HTTP ${resendStatus}) — pogledaj 'resendOdgovor' za razlog`,
    },
  });
}
