// Naslovna (sličica za mreže): lik i sukob iz svakodnevice, bez logoa na početku (video/README.md,
// „Prvo problem iz života“): Sava u praznoj štali i pitanje.
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { ucitajFontove, OBLO } from "./fontovi";
import { Kadar, N } from "./naiva";
import { Lutka, SAVA } from "./lutke";
import { StalaUnutra } from "./okolina";

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: N.bela }}>
    <AbsoluteFill style={{ filter: "saturate(0.55)" }}>
      <Kadar>
        <StalaUnutra>
          <Lutka {...SAVA} x={540} y={1290} s={0.8} izraz="zamisljena" glavaNagib={-6} />
        </StalaUnutra>
      </Kadar>
    </AbsoluteFill>
    <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: 0.3, backgroundImage: `url(${staticFile("platno.png")})`, backgroundSize: "512px 512px" }} />
    <div style={{ position: "absolute", top: 1340, left: 60, right: 60, textAlign: "center", fontFamily: OBLO, fontWeight: 700, fontSize: 104, lineHeight: 1.08, color: N.bela, textShadow: "0 6px 0 #3B2A1E, 0 0 24px rgba(0,0,0,0.6)" }}>
      Zašto je Sava prodao poslednje krave?
    </div>
  </AbsoluteFill>
);
