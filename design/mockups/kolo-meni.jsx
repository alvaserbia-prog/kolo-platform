import { useState } from "react";

const C = {
  green900: "#14532d", green700: "#15803d", green600: "#16a34a",
  green500: "#22c55e", green100: "#dcfce7", green50: "#f0fdf4",
  amber500: "#f59e0b", amber400: "#fbbf24", amber100: "#fef3c7", amber50: "#fffbeb",
  red500: "#ef4444", red50: "#fef2f2",
  gray900: "#111827", gray700: "#374151", gray500: "#6b7280",
  gray400: "#9ca3af", gray300: "#d1d5db", gray200: "#e5e7eb",
  gray100: "#f3f4f6", gray50: "#f9fafb", white: "#ffffff",
};

// Prilog 1 — rang donacija
const donationRanks = [
  { level: 1,  threshold: 0,           rate: 1.00 },
  { level: 2,  threshold: 2000,        rate: 1.10 },
  { level: 3,  threshold: 5000,        rate: 1.20 },
  { level: 4,  threshold: 10000,       rate: 1.30 },
  { level: 5,  threshold: 20000,       rate: 1.40 },
  { level: 6,  threshold: 50000,       rate: 1.50 },
  { level: 7,  threshold: 100000,      rate: 1.60 },
  { level: 8,  threshold: 200000,      rate: 1.70 },
  { level: 9,  threshold: 500000,      rate: 1.80 },
  { level: 10, threshold: 1000000,     rate: 1.90 },
  { level: 11, threshold: 2000000,     rate: 2.00 },
  { level: 12, threshold: 5000000,     rate: 2.20 },
  { level: 13, threshold: 10000000,    rate: 2.40 },
  { level: 14, threshold: 20000000,    rate: 2.70 },
  { level: 15, threshold: 50000000,    rate: 3.00 },
  { level: 16, threshold: 100000000,   rate: 3.50 },
  { level: 17, threshold: 200000000,   rate: 4.00 },
  { level: 18, threshold: 500000000,   rate: 5.00 },
];

// Prilog 1 — rang preporuka
const referralRanks = [
  { from: 0,   to: 0,   bonus: 0 },
  { from: 1,   to: 5,   bonus: 1000 },
  { from: 6,   to: 10,  bonus: 2000 },
  { from: 11,  to: 15,  bonus: 3000 },
  { from: 16,  to: 20,  bonus: 4000 },
  { from: 21,  to: 30,  bonus: 5000 },
  { from: 31,  to: 40,  bonus: 6000 },
  { from: 41,  to: 50,  bonus: 7000 },
  { from: 51,  to: 70,  bonus: 8000 },
  { from: 71,  to: 100, bonus: 9000 },
  { from: 101, to: null, bonus: 10000 },
];

const myDonations = [
  { date: "28. mar 2026", amountRsd: 3000, amountPoen: 3600, rank: 2, status: "confirmed" },
  { date: "15. mar 2026", amountRsd: 1000, amountPoen: 1100, rank: 1, status: "confirmed" },
];

const myReferrals = [
  { pseudo: "AnaVojvodina",  date: "30. mar 2026", status: "verified",   bonus: 1000 },
  { pseudo: "NenadZrenjanin", date: "25. mar 2026", status: "verified",  bonus: 1500 },
  { pseudo: "MajaSuBotica",  date: "20. mar 2026", status: "registered", bonus: null },
];

// --- Donacije ekran ---
function DonacijeScreen({ onBack }) {
  const [showTable, setShowTable] = useState(false);
  const [copied, setCopied] = useState(false);
  const currentRank = 2;
  const totalDonated = 4000;
  const currentRate = donationRanks[currentRank - 1].rate;
  const nextRank = donationRanks[currentRank];
  const progressToNext = nextRank
    ? ((totalDonated - donationRanks[currentRank - 1].threshold) / (nextRank.threshold - donationRanks[currentRank - 1].threshold)) * 100
    : 100;

  return (
    <div style={{ minHeight: "100vh", background: C.gray50 }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, background: C.white, borderBottom: `1px solid ${C.gray100}` }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>←</button>
        <h2 style={{ fontFamily: "sans-serif", fontSize: 18, color: C.gray900, margin: 0 }}>Donacije</h2>
      </div>
      <div style={{ padding: 16 }}>
        {/* Rang kartica */}
        <div style={{ background: `linear-gradient(135deg, ${C.green700}, ${C.green900})`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0 }}>Moj rang donacija</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 32, fontWeight: 800, color: C.white, margin: "4px 0" }}>Rang {currentRank}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0 }}>Kurs: {currentRate.toFixed(2)} POEN/RSD</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "rgba(255,255,255,0.5)", margin: 0 }}>Ukupno</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 700, color: C.white, margin: "2px 0 0" }}>{totalDonated.toLocaleString()}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "rgba(255,255,255,0.5)", margin: 0 }}>RSD</p>
            </div>
          </div>
          {nextRank && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Do ranga {currentRank + 1}</span>
                <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{nextRank.threshold.toLocaleString()} RSD</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3 }}>
                <div style={{ height: "100%", borderRadius: 3, width: `${Math.min(progressToNext, 100)}%`, background: C.amber400 }} />
              </div>
            </div>
          )}
        </div>

        {/* Instrukcije za uplatu */}
        <div style={{ background: C.white, borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray900, margin: "0 0 12px" }}>Instrukcije za uplatu</p>
          {[
            { label: "Primalac", value: "KOLO Fondacija" },
            { label: "Racun", value: "265-1234567-89" },
            { label: "Poziv na broj", value: "97 42-0003721" },
            { label: "Svrha", value: "Donacija" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? `1px solid ${C.gray100}` : "none" }}>
              <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray400 }}>{row.label}</span>
              <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: C.gray900 }}>{row.value}</span>
            </div>
          ))}
          <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ width: "100%", padding: 12, marginTop: 14, background: copied ? C.green50 : C.gray50, border: `1.5px solid ${copied ? C.green500 : C.gray200}`, borderRadius: 10, cursor: "pointer", fontFamily: "sans-serif", fontSize: 14, color: copied ? C.green700 : C.gray700 }}>
            {copied ? "✓ Kopirano!" : "Kopiraj podatke za uplatu"}
          </button>
        </div>

        {/* Tabela rangova */}
        <button onClick={() => setShowTable(!showTable)} style={{ width: "100%", padding: 12, marginBottom: 12, background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, color: C.gray500 }}>
          {showTable ? "Sakrij tabelu rangova ↑" : "Prikaži sve rangove ↓"}
        </button>
        {showTable && (
          <div style={{ background: C.white, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
            {donationRanks.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "50px 1fr 80px", padding: "10px 14px", alignItems: "center", background: r.level === currentRank ? C.green50 : C.white, borderBottom: i < donationRanks.length - 1 ? `1px solid ${C.gray100}` : "none" }}>
                <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: r.level === currentRank ? 700 : 400, color: r.level === currentRank ? C.green700 : C.gray700 }}>{r.level} {r.level === currentRank && "←"}</span>
                <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray700 }}>{r.threshold.toLocaleString()} RSD</span>
                <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: C.gray900, textAlign: "right" }}>{r.rate.toFixed(2)}×</span>
              </div>
            ))}
          </div>
        )}

        {/* Moje donacije */}
        <div style={{ background: C.white, borderRadius: 14, padding: 16 }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray900, margin: "0 0 12px" }}>Moje donacije</p>
          {myDonations.map((d, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < myDonations.length - 1 ? `1px solid ${C.gray100}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray900, margin: 0 }}>{d.amountRsd.toLocaleString()} RSD</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.gray400, margin: "2px 0 0" }}>{d.date} · Rang {d.rank}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, color: C.green600, margin: 0 }}>+{d.amountPoen.toLocaleString()} POEN</p>
                <span style={{ fontSize: 11, fontFamily: "sans-serif", color: C.green600, background: C.green50, padding: "2px 8px", borderRadius: 4 }}>✓ Potvrdjeno</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Preporuke ekran ---
function PreporukeScreen({ onBack }) {
  const [copied, setCopied] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const currentRefRank = 2; // 6-10 preporučenih => bonus 2000
  const nextBonus = referralRanks[currentRefRank + 1]?.bonus || referralRanks[currentRefRank].bonus;

  return (
    <div style={{ minHeight: "100vh", background: C.gray50 }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, background: C.white, borderBottom: `1px solid ${C.gray100}` }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>←</button>
        <h2 style={{ fontFamily: "sans-serif", fontSize: 18, color: C.gray900, margin: 0 }}>Preporuke</h2>
      </div>
      <div style={{ padding: 16 }}>
        {/* Link za deljenje */}
        <div style={{ background: C.white, borderRadius: 16, padding: 20, marginBottom: 16, textAlign: "center" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray500, margin: "0 0 14px" }}>Podelite link i zaradite POENE za svaku preporuku</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.gray50, borderRadius: 10, padding: "10px 14px" }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray700, flex: 1 }}>ekolo.rs/m/a7x3k9</span>
            <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: copied ? C.green600 : C.green700, color: C.white, fontFamily: "sans-serif", fontSize: 12, fontWeight: 600 }}>
              {copied ? "✓ Kopirano" : "Kopiraj"}
            </button>
          </div>
        </div>

        {/* Rang kartice */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div style={{ background: C.white, borderRadius: 14, padding: 16, textAlign: "center" }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gray400, margin: 0 }}>Rang preporuka</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 28, fontWeight: 800, color: C.green700, margin: "4px 0 2px" }}>{currentRefRank}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gray400, margin: 0 }}>od 10</p>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${C.amber50}, ${C.amber100})`, borderRadius: 14, padding: 16, textAlign: "center", border: `1px solid ${C.amber400}33` }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, color: C.amber500, margin: 0 }}>Sledeci bonus</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 28, fontWeight: 800, color: C.amber500, margin: "4px 0 2px" }}>{nextBonus.toLocaleString()}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, color: C.amber500, margin: 0 }}>POEN</p>
          </div>
        </div>

        {/* Tabela rangova */}
        <button onClick={() => setShowTable(!showTable)} style={{ width: "100%", padding: 12, marginBottom: 12, background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, color: C.gray500 }}>
          {showTable ? "Sakrij tabelu rangova ↑" : "Prikaži sve rangove ↓"}
        </button>
        {showTable && (
          <div style={{ background: C.white, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
            {referralRanks.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr", padding: "10px 14px", background: i === currentRefRank ? C.green50 : C.white, borderBottom: i < referralRanks.length - 1 ? `1px solid ${C.gray100}` : "none" }}>
                <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: i === currentRefRank ? 700 : 400, color: i === currentRefRank ? C.green700 : C.gray700 }}>
                  {r.from}{r.to ? `–${r.to}` : "+"} {i === currentRefRank && "←"}
                </span>
                <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: C.gray900, textAlign: "right" }}>{r.bonus.toLocaleString()} POEN</span>
              </div>
            ))}
          </div>
        )}

        {/* Moje preporuke */}
        <div style={{ background: C.white, borderRadius: 14, padding: 16 }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray900, margin: "0 0 12px" }}>Moje preporuke</p>
          {myReferrals.map((r, i) => (
            <div key={i} style={{ padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < myReferrals.length - 1 ? `1px solid ${C.gray100}` : "none" }}>
              <div>
                <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.green700, margin: 0 }}>{r.pseudo}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.gray400, margin: "2px 0 0" }}>{r.date}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                {r.status === "verified" ? (
                  <>
                    <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, color: C.green600, margin: 0 }}>+{r.bonus?.toLocaleString()} POEN</p>
                    <span style={{ fontSize: 11, fontFamily: "sans-serif", color: C.green600, background: C.green50, padding: "2px 8px", borderRadius: 4 }}>✓ Verifikovan</span>
                  </>
                ) : (
                  <span style={{ fontSize: 11, fontFamily: "sans-serif", color: C.amber500, background: C.amber50, padding: "4px 10px", borderRadius: 4 }}>Registrovan</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function KoloMeni() {
  const [screen, setScreen] = useState("menu");

  return (
    <div style={{ maxWidth: 430, margin: "0 auto" }}>
      {screen === "menu" && (
        <div style={{ minHeight: "100vh", background: C.gray50 }}>
          <div style={{ padding: "16px 20px", background: C.white, borderBottom: `1px solid ${C.gray100}` }}>
            <h2 style={{ fontFamily: "sans-serif", fontSize: 20, color: C.gray900, margin: 0, fontWeight: 700 }}>Meni</h2>
          </div>
          <div style={{ padding: 16 }}>
            {[
              { id: "donacije", title: "Donacije", desc: "Donirajte dinare, dobijte POENE" },
              { id: "preporuke", title: "Preporuke", desc: "Pozovite ljude, zaradite bonus" },
            ].map(item => (
              <button key={item.id} onClick={() => setScreen(item.id)} style={{ width: "100%", padding: 16, marginBottom: 10, background: C.white, border: `1px solid ${C.gray100}`, borderRadius: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: C.green50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {item.id === "donacije" ? "🎁" : "📤"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, color: C.gray900, margin: 0 }}>{item.title}</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.gray400, margin: "2px 0 0" }}>{item.desc}</p>
                </div>
                <span style={{ fontFamily: "sans-serif", fontSize: 10, padding: "3px 8px", borderRadius: 6, background: C.green50, color: C.green700, fontWeight: 600 }}>Beta</span>
                <span style={{ color: C.gray300 }}>›</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {screen === "donacije" && <DonacijeScreen onBack={() => setScreen("menu")} />}
      {screen === "preporuke" && <PreporukeScreen onBack={() => setScreen("menu")} />}
    </div>
  );
}
