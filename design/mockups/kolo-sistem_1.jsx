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

const mockMembers = [
  { pseudo: "ZelenoDrvo42", rankDon: 4, rankRef: 3, balance: 1250, date: "28. mar" },
  { pseudo: "MilanPetrovic", rankDon: 6, rankRef: 5, balance: 3420, date: "25. mar" },
  { pseudo: "JelenaM", rankDon: 3, rankRef: 7, balance: 890, date: "22. mar" },
  { pseudo: "MarkoSombor", rankDon: 2, rankRef: 2, balance: 2100, date: "20. mar" },
  { pseudo: "AnaVojvodina", rankDon: 5, rankRef: 1, balance: 670, date: "18. mar" },
  { pseudo: "NenadZrenjanin", rankDon: 1, rankRef: 4, balance: 4200, date: "15. mar" },
  { pseudo: "MajaSuBotica", rankDon: 3, rankRef: 2, balance: 1580, date: "12. mar" },
];

const mockTransactions = [
  { id: 1, from: "Banka", to: "ZelenoDrvo42", amount: 1000, desc: "Bonus za verifikaciju", date: "31. mar", time: "14:15", type: "emisija" },
  { id: 2, from: "ZelenoDrvo42", to: "MilanPetrovic", amount: 250, desc: "Domaci med", date: "31. mar", time: "16:30", type: "p2p" },
  { id: 3, from: "JelenaM", to: "ZelenoDrvo42", amount: 500, desc: "casovi engleskog", date: "30. mar", time: "10:00", type: "p2p" },
  { id: 4, from: "Banka", to: "MilanPetrovic", amount: 1000, desc: "Bonus za verifikaciju", date: "30. mar", time: "09:00", type: "emisija" },
  { id: 5, from: "Banka", to: "JelenaM", amount: 2500, desc: "Preporuka: MarkoSombor", date: "29. mar", time: "14:15", type: "emisija" },
  { id: 6, from: "MarkoSombor", to: "AnaVojvodina", amount: 300, desc: "Prevoz", date: "29. mar", time: "11:20", type: "p2p" },
];

const mockSponsors = [
  { name: "Podrum Saric d.o.o.", amount: 150000 },
  { name: "Miodinamika", amount: 85000 },
  { name: "Pekara Centar", amount: 42000 },
  { name: "Auto Servis Jovic", amount: 25000 },
];

const mockJobs = [
  { id: 1, title: "Uredjivanje dvorista Fondacije", poenPerHour: 120, status: "open", applicants: 3, desc: "Kosenje trave, orezivanje zunja, ciscenje staza." },
  { id: 2, title: "Digitalizacija arhive", poenPerHour: 100, status: "open", applicants: 1, desc: "Skeniranje i organizovanje papirne dokumentacije." },
  { id: 3, title: "Prevodjenje manifesta na engleski", poenPerHour: 150, status: "assigned", assignee: "JelenaM", applicants: 4, desc: "Prevod manifesta KOLO sistema." },
];

// --- Tabs: Pregled, Clanovi, Transakcije, Programi ---

function PregledTab({ isVerified }) {
  const opticaj = 14150;
  const bankBalance = -14150;
  const dailyLimit = 1415;
  const todayEmitted = 3500;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Opticaj", value: opticaj.toLocaleString(), sub: "POEN", color: C.green700 },
          { label: "Clanovi", value: mockMembers.length, sub: "verif.", color: C.green700 },
          { label: "Zadruge", value: 0, sub: "u mrezi", color: C.gray400 },
        ].map((card, i) => (
          <div key={i} style={{ background: C.white, borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gray400, margin: 0 }}>{card.label}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 800, color: card.color, margin: "4px 0 2px" }}>{card.value}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 10, color: C.gray400, margin: 0 }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {isVerified && (
        <div style={{ background: C.white, borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray700 }}>Stanje Banke</span>
            <span style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, color: C.red500 }}>{bankBalance.toLocaleString()} POEN</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 12, color: C.gray500 }}>Dnevni limit emisije</span>
            <span style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, color: C.gray700 }}>{todayEmitted.toLocaleString()} / {dailyLimit.toLocaleString()}</span>
          </div>
          <div style={{ height: 8, background: C.gray100, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 4, width: `${Math.min((todayEmitted / dailyLimit) * 100, 100)}%`, background: todayEmitted > dailyLimit ? C.red500 : `linear-gradient(90deg, ${C.green500}, ${C.green600})` }} />
          </div>
          {todayEmitted > dailyLimit && <p style={{ fontFamily: "sans-serif", fontSize: 11, color: C.red500, margin: "6px 0 0" }}>Limit prekoracen — programi proporcionalno smanjeni</p>}
        </div>
      )}

      <div style={{ background: C.white, borderRadius: 14, padding: 16 }}>
        <p style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: C.gray700, margin: "0 0 12px" }}>Sponzori i donatori</p>
        {mockSponsors.map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < mockSponsors.length - 1 ? `1px solid ${C.gray100}` : "none" }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 500, color: C.gray900 }}>{s.name}</span>
            <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: C.green700 }}>{s.amount.toLocaleString()} RSD</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClanoviTab() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("balance");

  const sorted = [...mockMembers].sort((a, b) => {
    if (sortBy === "balance") return b.balance - a.balance;
    if (sortBy === "rankDon") return b.rankDon - a.rankDon;
    return b.rankRef - a.rankRef;
  });

  const filtered = search.length >= 2
    ? sorted.filter(m => m.pseudo.toLowerCase().includes(search.toLowerCase()))
    : sorted;

  return (
    <div style={{ padding: 16 }}>
      <input type="text" placeholder="Pretrazi po pseudonimu" value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "12px 16px", border: `1.5px solid ${C.gray200}`, borderRadius: 10, outline: "none", fontSize: 14, fontFamily: "sans-serif", marginBottom: 12 }} />
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[{ key: "balance", label: "Balans" }, { key: "rankDon", label: "Rang donacija" }, { key: "rankRef", label: "Rang preporuka" }].map(s => (
          <button key={s.key} onClick={() => setSortBy(s.key)} style={{ padding: "6px 12px", borderRadius: 8, background: sortBy === s.key ? C.green700 : C.white, color: sortBy === s.key ? C.white : C.gray500, border: `1px solid ${sortBy === s.key ? C.green700 : C.gray200}`, fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ background: C.white, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 50px 50px 80px", padding: "10px 14px", background: C.gray50, borderBottom: `1px solid ${C.gray200}` }}>
          {["Pseudonim", "Don", "Ref", "Balans"].map((h, i) => (
            <span key={i} style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 600, color: C.gray400, textTransform: "uppercase", textAlign: i > 0 ? "right" : "left" }}>{h}</span>
          ))}
        </div>
        {filtered.map((m, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 50px 50px 80px", padding: "12px 14px", gap: 8, alignItems: "center", borderBottom: i < filtered.length - 1 ? `1px solid ${C.gray100}` : "none" }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 500, color: C.green700 }}>{m.pseudo}</span>
            <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray700, textAlign: "right" }}>{m.rankDon}</span>
            <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray700, textAlign: "right" }}>{m.rankRef}</span>
            <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: C.gray900, textAlign: "right" }}>{m.balance.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransakcijeTab({ isVerified }) {
  const [filter, setFilter] = useState("sve");
  const filtered = filter === "sve" ? mockTransactions
    : filter === "emisije" ? mockTransactions.filter(t => t.type === "emisija")
    : mockTransactions.filter(t => t.type === "p2p");

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[{ key: "sve", label: "Sve" }, { key: "p2p", label: "P2P" }, { key: "emisije", label: "Emisije" }].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: "6px 14px", borderRadius: 8, background: filter === f.key ? C.green700 : C.white, color: filter === f.key ? C.white : C.gray500, border: `1px solid ${filter === f.key ? C.green700 : C.gray200}`, fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>
            {f.label}
          </button>
        ))}
      </div>
      <div style={{ background: C.white, borderRadius: 14, overflow: "hidden" }}>
        {filtered.map((tx, i) => (
          <div key={tx.id} style={{ padding: "12px 14px", borderBottom: i < filtered.length - 1 ? `1px solid ${C.gray100}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 500, color: C.gray900, margin: 0 }}>
                {isVerified ? tx.from : (tx.from === "Banka" ? "Banka" : "clan")} → {isVerified ? tx.to : "clan"}
              </p>
              <p style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gray400, margin: "2px 0 0" }}>{tx.desc || "Bez opisa"}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, color: C.green600, margin: 0 }}>+{tx.amount.toLocaleString()}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 10, color: C.gray400, margin: "2px 0 0" }}>{tx.date} {tx.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramiTab({ isVerified }) {
  const [expandedJob, setExpandedJob] = useState(null);

  return (
    <div style={{ padding: 16 }}>
      {mockJobs.map(job => {
        const isExpanded = expandedJob === job.id;
        return (
          <div key={job.id} style={{ background: C.white, borderRadius: 14, padding: 16, marginBottom: 10, border: `1px solid ${isExpanded ? C.green100 : C.gray100}` }}>
            <div onClick={() => setExpandedJob(isExpanded ? null : job.id)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, color: C.gray900, margin: 0 }}>{job.title}</p>
                <span style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, color: C.green700 }}>{job.poenPerHour} POEN/sat</span>
              </div>
              <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontFamily: "sans-serif", fontWeight: 600, background: job.status === "open" ? C.green50 : C.amber50, color: job.status === "open" ? C.green700 : C.amber500 }}>
                {job.status === "open" ? "Otvoren" : "Zauzet"}
              </span>
            </div>
            {isExpanded && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.gray100}` }}>
                <p style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray500, margin: "0 0 12px" }}>{job.desc}</p>
                {job.status === "open" && isVerified && (
                  <button style={{ width: "100%", padding: 12, background: `linear-gradient(135deg, ${C.green600}, ${C.green700})`, color: C.white, border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600 }}>
                    Prijavi se za ovaj posao
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function KoloSistem() {
  const [activeTab, setActiveTab] = useState("pregled");
  const [isVerified, setIsVerified] = useState(true);

  const tabs = [
    { id: "pregled", label: "Pregled" },
    { id: "clanovi", label: "Clanovi" },
    { id: "transakcije", label: "Transakcije" },
    { id: "programi", label: "Programi" },
  ];

  const visibleTabs = isVerified ? tabs : tabs.filter(t => t.id !== "clanovi");

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.gray50 }}>
      <div style={{ padding: "16px 20px 0", background: C.white, borderBottom: `1px solid ${C.gray100}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "sans-serif", fontSize: 20, color: C.gray900, margin: 0, fontWeight: 700 }}>Sistem</h2>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => setIsVerified(false)} style={{ padding: "4px 8px", borderRadius: 6, fontSize: 10, cursor: "pointer", fontFamily: "sans-serif", background: !isVerified ? C.amber100 : C.gray100, color: !isVerified ? C.amber500 : C.gray400, border: "none" }}>Neverif.</button>
            <button onClick={() => setIsVerified(true)} style={{ padding: "4px 8px", borderRadius: 6, fontSize: 10, cursor: "pointer", fontFamily: "sans-serif", background: isVerified ? C.green100 : C.gray100, color: isVerified ? C.green700 : C.gray400, border: "none" }}>Verif.</button>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {visibleTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 16px", background: "none", border: "none", cursor: "pointer", position: "relative", fontFamily: "sans-serif", fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 400, color: activeTab === tab.id ? C.green700 : C.gray400 }}>
              {tab.label}
              {activeTab === tab.id && <div style={{ position: "absolute", bottom: 0, left: 16, right: 16, height: 3, borderRadius: "3px 3px 0 0", background: C.green700 }} />}
            </button>
          ))}
        </div>
      </div>
      {activeTab === "pregled" && <PregledTab isVerified={isVerified} />}
      {activeTab === "clanovi" && isVerified && <ClanoviTab />}
      {activeTab === "transakcije" && <TransakcijeTab isVerified={isVerified} />}
      {activeTab === "programi" && <ProgramiTab isVerified={isVerified} />}
    </div>
  );
}
