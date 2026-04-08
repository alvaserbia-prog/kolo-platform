import { useState } from "react";

const C = {
  green900: "#14532d", green700: "#15803d", green600: "#16a34a",
  green500: "#22c55e", green100: "#dcfce7", green50: "#f0fdf4",
  amber500: "#f59e0b", amber400: "#fbbf24", amber100: "#fef3c7", amber50: "#fffbeb",
  red500: "#ef4444", red100: "#fee2e2", red50: "#fef2f2",
  blue500: "#3b82f6", blue50: "#eff6ff",
  gray900: "#111827", gray700: "#374151", gray500: "#6b7280",
  gray400: "#9ca3af", gray300: "#d1d5db", gray200: "#e5e7eb",
  gray100: "#f3f4f6", gray50: "#f9fafb", white: "#ffffff",
};

const mockPending = [
  { id: 1, pseudo: "NoviKorisnik1", email: "n***@gmail.com", date: "2025-01-15", docs: true },
  { id: 2, pseudo: "StefanNS", email: "s***@yahoo.com", date: "2025-01-14", docs: false },
  { id: 3, pseudo: "MarijaKG", email: "m***@gmail.com", date: "2025-01-13", docs: true },
];

const mockUsers = [
  { id: 1, pseudo: "MilanPetrovic", role: "ZADRUGAR", balance: 1250, verified: true, zadruga: "Novi Sad" },
  { id: 2, pseudo: "JelenaM", role: "FIZICKO_LICE", balance: 430, verified: true, zadruga: null },
  { id: 3, pseudo: "MarkoSombor", role: "ZADRUGAR", balance: 880, verified: true, zadruga: "Sombor" },
  { id: 4, pseudo: "AnaVojvodina", role: "FIZICKO_LICE", balance: 200, verified: true, zadruga: null },
  { id: 5, pseudo: "NenadZrenjanin", role: "FIZICKO_LICE", balance: 0, verified: false, zadruga: null },
];

const mockEmissions = [
  { id: 1, type: "EMISIJA_DONACIJA", recipient: "MilanPetrovic", amount: 500, date: "2025-01-15 08:00" },
  { id: 2, type: "EMISIJA_PREPORUKA", recipient: "JelenaM", amount: 100, date: "2025-01-14 23:59" },
  { id: 3, type: "EMISIJA_POKROVITELJ", recipient: "MarkoSombor", amount: 250, date: "2025-01-14 23:59" },
  { id: 4, type: "EMISIJA_DONACIJA", recipient: "AnaVojvodina", amount: 350, date: "2025-01-13 08:00" },
];

const mockJobs = [
  { id: 1, title: "Popravka ograde", zadruga: "Novi Sad", poen: 200, apps: 3, status: "OTVORENO" },
  { id: 2, title: "Prevoz starih lica", zadruga: "Sombor", poen: 150, apps: 1, status: "U_TOKU" },
  { id: 3, title: "Casovi matematike", zadruga: "Novi Sad", poen: 300, apps: 5, status: "ZAVRSENO" },
];

const mockAuditLog = [
  { id: 1, admin: "admin1", action: "Verifikovao korisnika MilanPetrovic", date: "2025-01-15 10:22" },
  { id: 2, admin: "admin1", action: "Odbio korisnika TestUser99", date: "2025-01-15 09:11" },
  { id: 3, admin: "admin2", action: "Izmenio feature flag: pijaca=true", date: "2025-01-14 16:45" },
  { id: 4, admin: "admin1", action: "Manuelna emisija donacije 500 POEN -> MilanPetrovic", date: "2025-01-14 08:03" },
];

const emissionTypeLabel = {
  EMISIJA_DONACIJA: "Donacija",
  EMISIJA_PREPORUKA: "Preporuka",
  EMISIJA_POKROVITELJ: "Pokrovitelj",
};

const emissionTypeColor = {
  EMISIJA_DONACIJA: C.green700,
  EMISIJA_PREPORUKA: C.blue500,
  EMISIJA_POKROVITELJ: C.amber500,
};

function Badge({ label, color, bg }) {
  return (
    <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontFamily: "sans-serif", fontWeight: 600, color, background: bg }}>
      {label}
    </span>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, padding: "14px 16px", flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 700, color: color || C.gray900 }}>{value}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 12, color: C.gray500, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gray400, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────────────────────

function TabPregled() {
  return (
    <div style={{ padding: "0 16px 24px" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <StatCard label="Ukupno clanova" value="47" />
        <StatCard label="Cekaju verifikaciju" value="3" color={C.amber500} />
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Opticaj (POEN)" value="12 400" sub="minus Banke" color={C.green700} />
        <StatCard label="Dnevni limit" value="1 240" sub="10% opticaja" />
      </div>

      <h3 style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray700, margin: "0 0 10px" }}>Poslednje aktivnosti</h3>
      <div style={{ background: C.white, borderRadius: 14, overflow: "hidden" }}>
        {mockAuditLog.slice(0, 3).map((entry, i) => (
          <div key={entry.id} style={{ padding: "12px 14px", borderBottom: i < 2 ? `1px solid ${C.gray100}` : "none" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray900 }}>{entry.action}</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gray400, marginTop: 3 }}>{entry.date} · {entry.admin}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabKorisnici() {
  const [subTab, setSubTab] = useState("pending");
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div style={{ padding: "0 16px 24px" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[["pending", `Na cekanju (${mockPending.length})`], ["all", "Svi korisnici"]].map(([key, label]) => (
          <button key={key} onClick={() => setSubTab(key)} style={{ padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, border: "none", background: subTab === key ? C.green700 : C.gray100, color: subTab === key ? C.white : C.gray700 }}>
            {label}
          </button>
        ))}
      </div>

      {subTab === "pending" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mockPending.map(u => (
            <div key={u.id} style={{ background: C.white, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}>
                <div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray900 }}>{u.pseudo}</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 12, color: C.gray400, marginTop: 2 }}>{u.email} · {u.date}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Badge label={u.docs ? "Dokument" : "Bez dok."} color={u.docs ? C.green700 : C.amber500} bg={u.docs ? C.green50 : C.amber50} />
                  <span style={{ color: C.gray400, fontSize: 16 }}>{expandedId === u.id ? "▲" : "▼"}</span>
                </div>
              </div>
              {expandedId === u.id && (
                <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${C.gray100}` }}>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button style={{ flex: 1, padding: "10px 0", background: C.red50, color: C.red500, border: `1px solid ${C.red100}`, borderRadius: 10, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600 }}>
                      Odbij
                    </button>
                    <button style={{ flex: 1, padding: "10px 0", background: `linear-gradient(135deg, ${C.green600}, ${C.green700})`, color: C.white, border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600 }}>
                      Verifikuj
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {subTab === "all" && (
        <div style={{ background: C.white, borderRadius: 14, overflow: "hidden" }}>
          {mockUsers.map((u, i) => (
            <div key={u.id} style={{ padding: "12px 14px", borderBottom: i < mockUsers.length - 1 ? `1px solid ${C.gray100}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: C.gray900 }}>{u.pseudo}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gray400, marginTop: 2 }}>{u.role}{u.zadruga ? ` · ${u.zadruga}` : ""}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: C.green700 }}>{u.balance.toLocaleString()} P</span>
                <Badge label={u.verified ? "Ver." : "Nev."} color={u.verified ? C.green700 : C.gray400} bg={u.verified ? C.green50 : C.gray100} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabEmisija() {
  const dailyUsed = 620;
  const dailyLimit = 1240;
  const pct = Math.round((dailyUsed / dailyLimit) * 100);

  return (
    <div style={{ padding: "0 16px 24px" }}>
      <div style={{ background: C.white, borderRadius: 14, padding: "16px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray700, fontWeight: 600 }}>Dnevni limit emisije</span>
          <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray900, fontWeight: 700 }}>{dailyUsed.toLocaleString()} / {dailyLimit.toLocaleString()} POEN</span>
        </div>
        <div style={{ height: 10, background: C.gray100, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? C.red500 : C.green600, borderRadius: 6, transition: "width 0.3s" }} />
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gray400, marginTop: 6 }}>{pct}% iskorisceno · opticaj 12 400 POEN</div>
      </div>

      <h3 style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray700, margin: "0 0 10px" }}>Evidencija emisija</h3>
      <div style={{ background: C.white, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
        {mockEmissions.map((e, i) => (
          <div key={e.id} style={{ padding: "12px 14px", borderBottom: i < mockEmissions.length - 1 ? `1px solid ${C.gray100}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: C.gray900 }}>{e.recipient}</span>
                <Badge label={emissionTypeLabel[e.type]} color={emissionTypeColor[e.type]} bg={C.gray50} />
              </div>
              <div style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gray400, marginTop: 2 }}>{e.date}</div>
            </div>
            <span style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, color: C.green700 }}>+{e.amount}</span>
          </div>
        ))}
      </div>

      <h3 style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray700, margin: "0 0 10px" }}>Manuelna emisija donacije</h3>
      <div style={{ background: C.white, borderRadius: 14, padding: 16 }}>
        <input placeholder="Pseudonim primaoca" style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: 10, fontFamily: "sans-serif", fontSize: 14, marginBottom: 10, outline: "none" }} />
        <input type="number" placeholder="Iznos (POEN)" style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: 10, fontFamily: "sans-serif", fontSize: 14, marginBottom: 10, outline: "none" }} />
        <button style={{ width: "100%", padding: 14, background: `linear-gradient(135deg, ${C.green600}, ${C.green700})`, color: C.white, border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600 }}>
          Emituj POEN
        </button>
      </div>
    </div>
  );
}

function TabPoslovi() {
  const [expandedId, setExpandedId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const statusColor = { OTVORENO: C.green700, U_TOKU: C.amber500, ZAVRSENO: C.gray400 };
  const statusBg = { OTVORENO: C.green50, U_TOKU: C.amber50, ZAVRSENO: C.gray100 };

  return (
    <div style={{ padding: "0 16px 24px" }}>
      <button onClick={() => setShowCreate(!showCreate)} style={{ width: "100%", padding: "12px 0", background: showCreate ? C.gray100 : `linear-gradient(135deg, ${C.green600}, ${C.green700})`, color: showCreate ? C.gray700 : C.white, border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
        {showCreate ? "Zatvori" : "+ Novi posao"}
      </button>

      {showCreate && (
        <div style={{ background: C.white, borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <input placeholder="Naziv posla *" style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: 10, fontFamily: "sans-serif", fontSize: 14, marginBottom: 10, outline: "none" }} />
          <input placeholder="Zadruga" style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: 10, fontFamily: "sans-serif", fontSize: 14, marginBottom: 10, outline: "none" }} />
          <input type="number" placeholder="Iznos (POEN) *" style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: 10, fontFamily: "sans-serif", fontSize: 14, marginBottom: 10, outline: "none" }} />
          <textarea placeholder="Opis" rows={3} style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: 10, fontFamily: "sans-serif", fontSize: 14, resize: "vertical", outline: "none", marginBottom: 10 }} />
          <button style={{ width: "100%", padding: 14, background: `linear-gradient(135deg, ${C.green600}, ${C.green700})`, color: C.white, border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600 }}>
            Objavi posao
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mockJobs.map(job => (
          <div key={job.id} style={{ background: C.white, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "13px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}>
              <div>
                <div style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray900 }}>{job.title}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 12, color: C.gray400, marginTop: 2 }}>{job.zadruga} · {job.apps} prijava</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, color: C.green700 }}>{job.poen} P</span>
                <Badge label={job.status} color={statusColor[job.status]} bg={statusBg[job.status]} />
              </div>
            </div>
            {expandedId === job.id && (
              <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${C.gray100}` }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 12, color: C.gray500, marginTop: 12, marginBottom: 10 }}>Prijave:</div>
                {["JelenaM", "MarkoSombor", "AnaVojvodina"].slice(0, job.apps).map((app, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < job.apps - 1 ? `1px solid ${C.gray100}` : "none" }}>
                    <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray900 }}>{app}</span>
                    {job.status === "ZAVRSENO" ? (
                      <Badge label="Odobren rad" color={C.green700} bg={C.green50} />
                    ) : (
                      <button style={{ padding: "6px 12px", background: C.green50, color: C.green700, border: `1px solid ${C.green100}`, borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, fontWeight: 600 }}>
                        Odobri
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabSistem() {
  const [flags, setFlags] = useState({ pijaca: true, zajednica: false, zrno: false, pokrovitelji: false });
  const toggle = key => setFlags(f => ({ ...f, [key]: !f[key] }));

  const flagLabels = { pijaca: "Pijaca (marketplace)", zajednica: "Modul zajednica", zrno: "ZRNO glasanje", pokrovitelji: "Pokrovitelji" };

  return (
    <div style={{ padding: "0 16px 24px" }}>
      <h3 style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray700, margin: "0 0 10px" }}>Feature flags</h3>
      <div style={{ background: C.white, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
        {Object.entries(flagLabels).map(([key, label], i, arr) => (
          <div key={key} style={{ padding: "14px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${C.gray100}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "sans-serif", fontSize: 14, color: C.gray900 }}>{label}</div>
            </div>
            <div onClick={() => toggle(key)} style={{ width: 44, height: 24, borderRadius: 12, background: flags[key] ? C.green600 : C.gray300, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
              <div style={{ position: "absolute", top: 2, left: flags[key] ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: C.white, boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray700, margin: "0 0 10px" }}>Admin log</h3>
      <div style={{ background: C.white, borderRadius: 14, overflow: "hidden" }}>
        {mockAuditLog.map((entry, i) => (
          <div key={entry.id} style={{ padding: "12px 14px", borderBottom: i < mockAuditLog.length - 1 ? `1px solid ${C.gray100}` : "none" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray900 }}>{entry.action}</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gray400, marginTop: 3 }}>{entry.date} · {entry.admin}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "pregled", label: "Pregled" },
  { key: "korisnici", label: "Korisnici" },
  { key: "emisija", label: "Emisija" },
  { key: "poslovi", label: "Poslovi" },
  { key: "sistem", label: "Sistem" },
];

export default function KoloAdmin() {
  const [tab, setTab] = useState("pregled");

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.gray50 }}>
      <div style={{ padding: "16px 20px 0", background: C.white, borderBottom: `1px solid ${C.gray100}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontFamily: "sans-serif", fontSize: 20, color: C.gray900, margin: 0, fontWeight: 700 }}>Admin panel</h2>
          <Badge label="Fondacija" color={C.green700} bg={C.green50} />
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "10px 14px", background: "none", border: "none", borderBottom: tab === t.key ? `2px solid ${C.green700}` : "2px solid transparent", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: tab === t.key ? 600 : 400, color: tab === t.key ? C.green700 : C.gray500, whiteSpace: "nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ paddingTop: 16 }}>
        {tab === "pregled" && <TabPregled />}
        {tab === "korisnici" && <TabKorisnici />}
        {tab === "emisija" && <TabEmisija />}
        {tab === "poslovi" && <TabPoslovi />}
        {tab === "sistem" && <TabSistem />}
      </div>
    </div>
  );
}
