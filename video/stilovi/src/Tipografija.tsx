// Stil 1 — Kinetička tipografija „Reč po reč".
// Krupne reči udaraju na takt (112 BPM ≈ 16 frejmova po udarcu), oštri rezovi, pozadina se
// menja na rezu. Nema likova: samo reči, podvlaka i na kraju znak.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { P } from "./paleta";
import { Muzika, Znak, clamp01, ease } from "./zajednicko";

const SANS = "'Noto Sans', sans-serif";
const RUKOPIS = "'Caveat', 'Noto Sans', cursive";

// udarci: 0, 32, 80, 129, 177, 225, 257
const KADROVI = [
  { od: 0, do: 32, pozadina: P.zelena900 },
  { od: 32, do: 80, pozadina: P.zelena900 },
  { od: 80, do: 129, pozadina: P.papir },
  { od: 129, do: 177, pozadina: P.korala },
  { od: 177, do: 225, pozadina: P.zelena700 },
  { od: 225, do: 257, pozadina: P.papir },
  { od: 257, do: 300, pozadina: P.zelena900 },
];

/** Reč koja tresne: krene iz velikog, odskoči na meru, kratko protrese kadar. */
const Udar: React.FC<{ f: number; od: number; children: React.ReactNode; style?: React.CSSProperties; iz?: number; rot?: number }> = ({
  f,
  od,
  children,
  style,
  iz = 2.2,
  rot = 0,
}) => {
  const { fps } = useVideoConfig();
  if (f < od) return null;
  const s = spring({ frame: f - od, fps, config: { damping: 11, stiffness: 180, mass: 0.7 } });
  const skala = iz + (1 - iz) * s;
  return (
    <div
      style={{
        transform: `scale(${skala}) rotate(${rot * (1 - s)}deg)`,
        opacity: clamp01((f - od) / 3),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Tipografija: React.FC = () => {
  const f = useCurrentFrame();
  const k = KADROVI.find((x) => f >= x.od && f < x.do) ?? KADROVI[KADROVI.length - 1];
  // potres kadra 5 frejmova posle svakog udarca
  const odUdara = f - k.od;
  const tres = odUdara < 6 ? (6 - odUdara) * 3 : 0;
  const tx = (random(`x${f}`) - 0.5) * tres;
  const ty = (random(`y${f}`) - 0.5) * tres;

  const centar: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: SANS,
    textAlign: "center",
  };

  return (
    <AbsoluteFill style={{ background: k.pozadina, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px)` }}>
        {/* 1 — KOMŠIJA */}
        {k.od === 0 && (
          <div style={centar}>
            <Udar f={f} od={0} iz={3}>
              <div style={{ fontSize: 210, fontWeight: 900, color: P.belo, letterSpacing: -6 }}>KOMŠIJA</div>
            </Udar>
          </div>
        )}

        {/* 2 — zna da popravi BICIKL. */}
        {k.od === 32 && (
          <div style={centar}>
            <div style={{ fontSize: 96, fontWeight: 700, color: P.zelenaSvetla, marginBottom: 10, opacity: clamp01((f - 32) / 4) }}>zna da popravi</div>
            <Udar f={f} od={48} rot={-8}>
              <div style={{ fontSize: 200, fontWeight: 900, color: P.zlatna400, letterSpacing: -6 }}>BICIKL.</div>
            </Udar>
          </div>
        )}

        {/* 3 — Ti mesiš HLEB. */}
        {k.od === 80 && (
          <div style={centar}>
            <Udar f={f} od={80} iz={1.6}>
              <div style={{ fontSize: 110, fontWeight: 800, color: P.zelena900 }}>A ti mesiš</div>
            </Udar>
            <Udar f={f} od={96} rot={6}>
              <div style={{ fontSize: 240, fontWeight: 900, color: P.korala, letterSpacing: -8, lineHeight: 1 }}>HLEB.</div>
            </Udar>
          </div>
        )}

        {/* 4 — Zašto se / ne znate? — dve linije se sudare */}
        {k.od === 129 && (
          <div style={centar}>
            {(() => {
              const t = ease(clamp01((f - 129) / 10));
              return (
                <>
                  <div style={{ fontSize: 150, fontWeight: 900, color: P.belo, transform: `translateX(${(1 - t) * -900}px)` }}>Zašto se</div>
                  <div style={{ fontSize: 150, fontWeight: 900, color: P.zelena900, transform: `translateX(${(1 - t) * 900}px)` }}>ne znate?</div>
                </>
              );
            })()}
          </div>
        )}

        {/* 5 — RAD / DOBRA / ZNANJE, po jedna na udarac */}
        {k.od === 177 && (
          <div style={centar}>
            {[
              ["RAD", 177, P.zlatna400],
              ["DOBRA", 193, P.belo],
              ["ZNANJE", 209, P.zelenaSvetla],
            ].map(([rec, od, boja], i) => (
              <Udar key={rec as string} f={f} od={od as number} rot={i % 2 ? 7 : -7}>
                <div style={{ fontSize: 190, fontWeight: 900, color: boja as string, letterSpacing: -5, lineHeight: 1.05 }}>{rec}</div>
              </Udar>
            ))}
          </div>
        )}

        {/* 6 — Svaki doprinos je zabeležen. (podvlaka se iscrta) */}
        {k.od === 225 && (
          <div style={centar}>
            <Udar f={f} od={225} iz={1.5}>
              <div style={{ fontSize: 100, fontWeight: 800, color: P.zelena900 }}>Svaki doprinos je</div>
            </Udar>
            <div style={{ position: "relative", marginTop: 6 }}>
              <Udar f={f} od={233} rot={-4}>
                <div style={{ fontSize: 170, fontWeight: 900, color: P.zelena700, letterSpacing: -5 }}>zabeležen.</div>
              </Udar>
              <svg width={820} height={60} style={{ position: "absolute", left: "50%", marginLeft: -410, bottom: -40 }}>
                <path
                  d="M10 38 C 200 18, 420 50, 810 22"
                  stroke={P.zelena500}
                  strokeWidth={16}
                  strokeLinecap="round"
                  fill="none"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - ease(clamp01((f - 240) / 12))}
                />
              </svg>
            </div>
          </div>
        )}

        {/* 7 — znak + ekolo.rs */}
        {k.od === 257 && (
          <div style={centar}>
            <Udar f={f} od={257} iz={0.2}>
              <div style={{ borderRadius: 70, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
                <Znak velicina={380} napredak={interpolate(f, [257, 275], [0, 1], { extrapolateRight: "clamp" })} />
              </div>
            </Udar>
            <Udar f={f} od={270} iz={1.8}>
              <div style={{ fontSize: 150, fontWeight: 900, color: P.belo, marginTop: 50, letterSpacing: -4 }}>ekolo.rs</div>
            </Udar>
            <div style={{ fontFamily: RUKOPIS, fontWeight: 700, fontSize: 84, color: P.zlatna400, opacity: clamp01((f - 280) / 6) }}>
              Upoznaj svoj komšiluk.
            </div>
          </div>
        )}
      </AbsoluteFill>
      <Muzika />
    </AbsoluteFill>
  );
};
