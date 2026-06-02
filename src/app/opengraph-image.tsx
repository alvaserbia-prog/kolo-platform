import { ImageResponse } from "next/og";

/**
 * Dinamička Open Graph slika (1200×630) — prikazuje se kad se sajt deli na
 * društvenim mrežama. Next.js je automatski servira na /opengraph-image.
 *
 * Font Inter (latin-ext) se učitava lokalno radi pune srpske latinice
 * (č/ć/š/ž/đ). `new URL(..., import.meta.url)` natera Next da bundluje .woff
 * kao asset, pa radi i u serverless i u edge okruženju.
 */
export const runtime = "edge";
export const alt = "KOLO — Sistem uzajamnosti zasnovan na doprinosu zajednici";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [interRegular, interBold] = await Promise.all([
    fetch(new URL("./_fonts/Inter-400.woff", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("./_fonts/Inter-700.woff", import.meta.url)).then((r) => r.arrayBuffer()),
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
        {/* Kružni motiv (kolo) — dekorativni prsten u pozadini */}
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
        <div
          style={{
            position: "absolute",
            bottom: "-220px",
            right: "120px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            border: "28px solid rgba(46, 157, 84, 0.35)",
            display: "flex",
          }}
        />

        {/* Gornji red: oznaka */}
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
            ZAJEDNIČKO DOBRO
          </span>
        </div>

        {/* Glavni naziv + tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "180px",
              fontWeight: 700,
              letterSpacing: "-4px",
              lineHeight: 1,
              display: "flex",
            }}
          >
            KOLO
          </div>
          <div
            style={{
              fontSize: "44px",
              marginTop: "24px",
              color: "#E8F5EC",
              maxWidth: "820px",
              lineHeight: 1.25,
              display: "flex",
            }}
          >
            Sistem uzajamnosti zasnovan na doprinosu zajednici
          </div>
        </div>

        {/* Donji red: domen + besplatno */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "32px",
          }}
        >
          <span style={{ color: "#F5B842", fontWeight: 700 }}>ekolo.rs</span>
          <span style={{ color: "#E8F5EC" }}>Članstvo je besplatno</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
      ],
    },
  );
}
