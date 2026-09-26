// Stil 2 — UI mockup telefona „Demo u ruci".
// Telefon u kadru, na ekranu (pojednostavljena) aplikacija ekolo.rs: Pijaca → nov oglas →
// poruka komšije → zapis POEN-a → potvrda. Prst tapka, ekrani klize. POEN je broj u redu, ne novčić.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { P } from "./paleta";
import { Muzika, Natpis, Znak, clamp01, ease } from "./zajednicko";

const SANS = "'Noto Sans', sans-serif";
const SW = 700; // širina ekrana telefona
const SH = 1400;

const Zaglavlje: React.FC<{ naslov: string }> = ({ naslov }) => (
  <div style={{ height: 150, background: P.zelena900, display: "flex", alignItems: "flex-end", padding: "0 36px 26px", gap: 20 }}>
    <div style={{ borderRadius: 14, overflow: "hidden" }}>
      <Znak velicina={64} />
    </div>
    <div style={{ color: P.belo, fontSize: 44, fontWeight: 800 }}>{naslov}</div>
  </div>
);

const Kartica: React.FC<{ naslov: string; mesto: string; boja: string; istaknuta?: number; oznaka?: string }> = ({ naslov, mesto, boja, istaknuta = 0, oznaka }) => (
  <div
    style={{
      margin: "22px 28px 0",
      background: P.belo,
      borderRadius: 26,
      padding: 20,
      display: "flex",
      gap: 22,
      alignItems: "center",
      boxShadow: `0 4px 14px rgba(0,0,0,0.08), 0 0 0 ${6 * istaknuta}px ${P.zlatna400}`,
    }}
  >
    <div style={{ width: 130, height: 130, borderRadius: 18, background: boja, flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 36, fontWeight: 800, color: P.tekst }}>{naslov}</div>
      <div style={{ fontSize: 28, color: P.siva, marginTop: 6 }}>{mesto}</div>
      {oznaka && (
        <div style={{ display: "inline-block", marginTop: 10, fontSize: 22, fontWeight: 800, color: P.zelena700, background: P.zelena100, borderRadius: 10, padding: "4px 12px" }}>
          {oznaka}
        </div>
      )}
    </div>
  </div>
);

const Pijaca: React.FC<{ novi: number; f: number }> = ({ novi, f }) => (
  <div style={{ background: P.pozadina, height: "100%" }}>
    <Zaglavlje naslov="Pijaca" />
    <div style={{ display: "flex", gap: 14, padding: "26px 28px 4px" }}>
      {["Sve", "Hrana", "Usluge", "Alat"].map((k, i) => (
        <div key={k} style={{ fontSize: 26, fontWeight: 700, padding: "10px 22px", borderRadius: 30, background: i === 0 ? P.zelena700 : P.ivica, color: i === 0 ? P.belo : P.tekst }}>
          {k}
        </div>
      ))}
    </div>
    <div style={{ height: novi * 196, overflow: "hidden" }}>
      <Kartica naslov="Domaća jaja" mesto="Sombor · Bezdanski put" boja={P.sunce} istaknuta={novi > 0 ? Math.max(0, Math.sin(f / 5)) : 0} oznaka="NOV OGLAS" />
    </div>
    <Kartica naslov="Popravka bicikla" mesto="Sombor · Venac" boja={P.nebo} />
    <Kartica naslov="Časovi gitare" mesto="Sombor · Centar" boja={P.slezova} />
    <Kartica naslov="Med od bagrema" mesto="Stanišić" boja={P.zlatna400} />
    <Kartica naslov="Sadnice paradajza" mesto="Bački Monoštor" boja={P.trava} />
    {/* dugme + Oglas */}
    <div
      style={{
        position: "absolute",
        right: 40,
        bottom: 60,
        background: P.zlatna600,
        color: P.belo,
        fontSize: 38,
        fontWeight: 900,
        padding: "26px 40px",
        borderRadius: 60,
        boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
      }}
    >
      + Oglas
    </div>
  </div>
);

const Obrazac: React.FC<{ f: number }> = ({ f }) => {
  const tekst = "Domaća jaja";
  const n = Math.floor(clamp01((f - 48) / 26) * tekst.length);
  const kursor = Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{ background: P.pozadina, height: "100%" }}>
      <Zaglavlje naslov="Nov oglas" />
      <div style={{ padding: 36 }}>
        <div style={{ fontSize: 28, color: P.siva, fontWeight: 700 }}>Šta nudiš?</div>
        <div style={{ marginTop: 12, fontSize: 44, fontWeight: 800, border: `4px solid ${P.zelena500}`, borderRadius: 18, padding: "22px 24px", background: P.belo, color: P.tekst }}>
          {tekst.slice(0, n)}
          <span style={{ opacity: kursor ? 1 : 0, color: P.zelena500 }}>|</span>
        </div>
        <div style={{ marginTop: 36, fontSize: 28, color: P.siva, fontWeight: 700 }}>Mesto</div>
        <div style={{ marginTop: 12, fontSize: 36, border: `3px solid ${P.ivica}`, borderRadius: 18, padding: "20px 24px", background: P.belo, color: P.tekst }}>Sombor</div>
        <div style={{ marginTop: 36, fontSize: 28, color: P.siva, fontWeight: 700 }}>Slika</div>
        <div style={{ marginTop: 12, height: 260, borderRadius: 18, background: P.sunce, opacity: clamp01((f - 70) / 8) }} />
        <div style={{ marginTop: 40, textAlign: "center", fontSize: 40, fontWeight: 900, color: P.belo, background: P.zelena700, borderRadius: 60, padding: "26px 0" }}>Objavi</div>
      </div>
    </div>
  );
};

const Zapis: React.FC<{ f: number; od: number }> = ({ f, od }) => {
  const t = clamp01((f - od - 8) / 14);
  const puls = Math.max(0, Math.sin(clamp01((f - od - 20) / 20) * Math.PI));
  return (
    <div style={{ background: P.pozadina, height: "100%" }}>
      <Zaglavlje naslov="POEN" />
      <div style={{ margin: 28, background: P.zelena900, borderRadius: 30, padding: 36, color: P.belo }}>
        <div style={{ fontSize: 28, opacity: 0.8 }}>Na tvom zapisu</div>
        <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: -2 }}>
          {Math.round(interpolate(t, [0, 1], [0, 1200])).toLocaleString("de-DE")} <span style={{ fontSize: 44 }}>POENA</span>
        </div>
      </div>
      <div style={{ margin: "10px 28px", fontSize: 28, fontWeight: 800, color: P.siva }}>ZAPISI</div>
      <div
        style={{
          margin: "0 28px",
          background: P.belo,
          borderRadius: 22,
          padding: 26,
          borderLeft: `12px solid ${P.zelena500}`,
          boxShadow: `0 0 0 ${10 * puls}px rgba(46,157,84,0.35)`,
          transform: `translateY(${(1 - ease(clamp01((f - od - 4) / 10))) * 60}px)`,
          opacity: clamp01((f - od - 4) / 6),
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 800, color: P.tekst }}>Stana → ti</div>
        <div style={{ fontSize: 30, color: P.siva, marginTop: 6 }}>domaća jaja · danas</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: P.zelena500, marginTop: 8 }}>+1.200 POENA</div>
      </div>
    </div>
  );
};

const Potvrde: React.FC<{ f: number; od: number }> = ({ f, od }) => {
  const t = ease(clamp01((f - od - 12) / 16));
  const kv = clamp01((f - od - 6) / 8);
  return (
    <div style={{ background: P.pozadina, height: "100%" }}>
      <Zaglavlje naslov="Potvrde" />
      <div style={{ padding: 36, textAlign: "center" }}>
        <div
          style={{
            margin: "40px auto 0",
            width: 220,
            height: 220,
            borderRadius: 110,
            background: P.zelena500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${spring({ frame: f - od - 6, fps: 30, config: { damping: 9 } })})`,
          }}
        >
          <svg width={130} height={130} viewBox="0 0 100 100">
            <path d="M18 52 L42 74 L84 28" stroke={P.belo} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - kv} />
          </svg>
        </div>
        <div style={{ fontSize: 46, fontWeight: 900, color: P.tekst, marginTop: 40 }}>Stana te je potvrdila</div>
        <div style={{ fontSize: 30, color: P.siva, marginTop: 10 }}>Poznaje te lično.</div>
        <div style={{ marginTop: 70, fontSize: 30, fontWeight: 800, color: P.siva, textAlign: "left" }}>Indeks stvarnosti</div>
        <div style={{ marginTop: 14, height: 40, borderRadius: 20, background: P.ivica, overflow: "hidden" }}>
          <div style={{ width: `${10 * t}%`, minWidth: t > 0 ? 40 : 0, height: "100%", background: P.zelena500, borderRadius: 20 }} />
        </div>
        <div style={{ textAlign: "right", fontSize: 40, fontWeight: 900, color: P.zelena700, marginTop: 10 }}>{Math.round(10 * t)}%</div>
      </div>
    </div>
  );
};

/** Obaveštenje koje sklizne s vrha ekrana. */
const Obavestenje: React.FC<{ f: number; od: number; do: number }> = ({ f, od, do: dok }) => {
  if (f < od || f > dok) return null;
  const ul = spring({ frame: f - od, fps: 30, config: { damping: 13 } });
  const iz = clamp01((dok - f) / 8);
  return (
    <div
      style={{
        position: "absolute",
        left: 20,
        right: 20,
        top: 30,
        transform: `translateY(${(1 - ul) * -220 - (1 - iz) * 220}px)`,
        background: "rgba(255,253,247,0.97)",
        borderRadius: 30,
        padding: "24px 28px",
        display: "flex",
        gap: 20,
        alignItems: "center",
        boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ width: 84, height: 84, borderRadius: 42, background: P.roze, color: P.belo, fontSize: 44, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>S</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: P.siva }}>Nova poruka · Stana</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: P.tekst }}>Jesu li jaja još tu?</div>
      </div>
    </div>
  );
};

/** Prst: krug koji se spusti i ostavi talas. */
const Tap: React.FC<{ f: number; kad: number; x: number; y: number }> = ({ f, kad, x, y }) => {
  const d = f - kad;
  if (d < -12 || d > 14) return null;
  const pritisak = d < 0 ? 1 - Math.abs(d) / 12 : 1;
  const talas = clamp01(d / 14);
  return (
    <>
      <div style={{ position: "absolute", left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: 50, background: "rgba(26,26,23,0.28)", transform: `scale(${d < 0 ? 1.4 - 0.4 * pritisak : 1})`, opacity: d < 0 ? pritisak : 1 - talas }} />
      {d >= 0 && <div style={{ position: "absolute", left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: 50, border: `6px solid ${P.belo}`, transform: `scale(${1 + talas * 1.8})`, opacity: 1 - talas }} />}
    </>
  );
};

const EKRANI = [
  { od: 0, do: 40 },
  { od: 40, do: 92 },
  { od: 92, do: 150 },
  { od: 150, do: 200 },
  { od: 200, do: 300 },
];

export const Telefon: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ulaz = spring({ frame: f, fps, config: { damping: 14, stiffness: 90 } });
  const kraj = ease(clamp01((f - 248) / 18));
  const skala = 1 - 0.85 * kraj;
  const disanje = Math.sin(f / 40) * 2;
  const idx = EKRANI.findIndex((e) => f >= e.od && f < e.do);
  // prelaz ekrana: novi klizi s desna prvih 8 frejmova
  const kl = (od: number) => (1 - ease(clamp01((f - od) / 8))) * SW;

  const ekran = (i: number) => {
    switch (i) {
      case 0:
        return <Pijaca novi={0} f={f} />;
      case 1:
        return <Obrazac f={f} />;
      case 2:
        return <Pijaca novi={ease(clamp01((f - 96) / 10))} f={f} />;
      case 3:
        return <Zapis f={f} od={150} />;
      default:
        return <Potvrde f={f} od={200} />;
    }
  };

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${P.zelena100} 0%, ${P.zlatna100} 100%)`, fontFamily: SANS }}>
      {/* telefon */}
      <div
        style={{
          position: "absolute",
          left: (1080 - SW - 40) / 2,
          top: 420,
          width: SW + 40,
          height: SH + 40,
          transform: `translateY(${(1 - ulaz) * 1500 - kraj * 250}px) rotate(${disanje * (1 - kraj)}deg) scale(${skala})`,
          transformOrigin: "50% 40%",
          opacity: 1 - clamp01((f - 262) / 6),
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "#1A1A17", borderRadius: 90, boxShadow: "0 40px 90px rgba(15,61,32,0.35)" }} />
        <div style={{ position: "absolute", left: 20, top: 20, width: SW, height: SH, borderRadius: 72, overflow: "hidden", background: P.pozadina }}>
          {idx > 0 && f - EKRANI[idx].od < 8 && <div style={{ position: "absolute", inset: 0, transform: `translateX(${kl(EKRANI[idx].od) - SW}px)` }}>{ekran(idx - 1)}</div>}
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${idx > 0 ? kl(EKRANI[idx].od) : 0}px)` }}>{ekran(Math.max(0, idx))}</div>
          <Obavestenje f={f} od={108} do={148} />
          <Tap f={f} kad={32} x={560} y={1290} />
          <Tap f={f} kad={86} x={350} y={1250} />
          <Tap f={f} kad={140} x={350} y={110} />
          {/* ostrvo kamere */}
          <div style={{ position: "absolute", left: SW / 2 - 90, top: 22, width: 180, height: 50, borderRadius: 25, background: "#1A1A17" }} />
        </div>
      </div>

      <Natpis f={f} od={4} do={40} boja={P.zelena900}>Imaš nešto viška?</Natpis>
      <Natpis f={f} od={40} do={92} boja={P.zelena900}>Oglas za minut.</Natpis>
      <Natpis f={f} od={100} do={150} boja={P.zelena900}>Komšija se javi.</Natpis>
      <Natpis f={f} od={150} do={200} boja={P.zelena900}>Doprinos se beleži.</Natpis>
      <Natpis f={f} od={200} do={250} boja={P.zelena900}>Poverenje raste.</Natpis>

      {/* kraj */}
      {f >= 258 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ borderRadius: 70, overflow: "hidden", transform: `scale(${spring({ frame: f - 258, fps, config: { damping: 10 } })})`, boxShadow: "0 20px 60px rgba(15,61,32,0.35)" }}>
            <Znak velicina={340} />
          </div>
          <div style={{ fontSize: 140, fontWeight: 900, color: P.zelena900, marginTop: 50, letterSpacing: -4, opacity: clamp01((f - 266) / 6) }}>ekolo.rs</div>
          <div style={{ fontSize: 56, fontWeight: 700, color: P.zelena700, opacity: clamp01((f - 274) / 6) }}>Probaj u svom komšiluku.</div>
        </div>
      )}
      <Muzika fajl="muzika2.mp3" odSekunde={10} />
    </AbsoluteFill>
  );
};
