import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

/**
 * OG slika oglasa (1200×630) za deljenje linka u Viber/Messenger/WhatsApp.
 *
 * Zašto ne direktan R2 URL u `og:image` (raniji pristup): messengeri pri PRVOM
 * deljenju linka ne prikazuju sliku ako `og:image:width/height` nisu poznati
 * (Facebook/Messenger dovlače sliku asinhrono), a Viber ne ume WebP i ne prati
 * pouzdano redirect. File-convention slika rešava sve: fiksne, unapred
 * deklarisane dimenzije (Next emituje og:image:width/height/type), uvek PNG,
 * ista origin adresa bez redirecta.
 *
 * Node runtime (podrazumevano) — Prisma adapter-pg ne radi na edge-u.
 */
export const alt = "Oglas na Pijaci — KOLO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Prva slika oglasa kao data URI za satori. Vraća null kad slike nema, ne može
 * da se dovuče, ili je u formatu koji satori ne ume (WebP) — tada ide
 * brendirana kartica sa naslovom.
 */
async function ucitajFotografiju(images: string[]): Promise<string | null> {
  const prva = images[0];
  if (!prva) return null;
  try {
    let buffer: Buffer;
    let tip: string;
    if (/^https?:\/\//i.test(prva)) {
      const res = await fetch(prva, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return null;
      tip = res.headers.get("content-type") ?? "image/jpeg";
      buffer = Buffer.from(await res.arrayBuffer());
    } else {
      // Legacy putanja na lokalnom disku (dev fallback).
      buffer = await readFile(path.join(process.cwd(), prva));
      const ext = path.extname(prva).toLowerCase();
      tip = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    }
    // satori podržava PNG/JPEG/GIF — WebP bi oborio render cele slike.
    if (tip.includes("webp")) return null;
    return `data:${tip};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Brendirana kartica (kad oglas nema upotrebljivu fotografiju). */
async function brendiranaKartica(naslov: string) {
  // Literal putanje uz process.cwd() — tako ih @vercel/nft sigurno utrasira u
  // serverless bundle (uz outputFileTracingIncludes u next.config.ts kao pojas).
  const [interRegular, interBold] = await Promise.all([
    readFile(path.join(process.cwd(), "src/app/_fonts/Inter-400.woff")),
    readFile(path.join(process.cwd(), "src/app/_fonts/Inter-700.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "linear-gradient(135deg, #0F3D20 0%, #1B6B3A 100%)",
          color: "#FAFAF8",
          fontFamily: "Inter",
          padding: "80px",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-180px",
            right: "-180px",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            border: "40px solid rgba(245, 184, 66, 0.18)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "#F5B842",
              display: "flex",
            }}
          />
          <span style={{ fontSize: "30px", letterSpacing: "8px", color: "#E8F5EC", fontWeight: 700 }}>
            PIJACA
          </span>
        </div>
        <div
          style={{
            fontSize: naslov.length > 60 ? "56px" : "72px",
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: "1040px",
            display: "flex",
          }}
        >
          {naslov}
        </div>
        <div style={{ display: "flex", fontSize: "32px" }}>
          <span style={{ color: "#F5B842", fontWeight: 700 }}>ekolo.rs</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
      ],
    }
  );
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    select: { title: true, images: true },
  });

  const naslov = (listing?.title ?? "Pijaca").slice(0, 120);
  const foto = listing ? await ucitajFotografiju(listing.images) : null;
  if (!foto) return brendiranaKartica(naslov);

  // Fotografija preko cele kartice (cover — messengeri očekuju tačno 1200×630).
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={foto}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    ),
    size
  );
}
