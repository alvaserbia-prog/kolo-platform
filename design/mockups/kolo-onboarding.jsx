import { useState, useEffect } from "react";

const C = {
  green900: "#14532d", green700: "#15803d", green600: "#16a34a",
  green500: "#22c55e", green100: "#dcfce7", green50: "#f0fdf4",
  amber500: "#f59e0b", amber400: "#fbbf24", amber100: "#fef3c7", amber50: "#fffbeb",
  red500: "#ef4444", red100: "#fee2e2", red50: "#fef2f2",
  gray900: "#111827", gray700: "#374151", gray500: "#6b7280",
  gray400: "#9ca3af", gray300: "#d1d5db", gray200: "#e5e7eb",
  gray100: "#f3f4f6", gray50: "#f9fafb", white: "#ffffff",
};

// Ekrani: register -> email -> verify -> pending -> (approved | rejected)

function PasswordStrength({ password }) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  const labels = ["", "Slaba", "OK", "Dobra", "Odlicna"];
  const colors = ["", C.red500, C.amber500, C.green500, C.green700];
  if (!password) return null;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? colors[strength] : C.gray200 }} />
        ))}
      </div>
      <span style={{ fontFamily: "sans-serif", fontSize: 11, color: colors[strength] }}>{labels[strength]}</span>
    </div>
  );
}

function RegistrationScreen({ onRegister, onGoLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [tos, setTos] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [pseudoStatus, setPseudoStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const takenPseudos = ["MilanPetrovic", "JelenaM", "MarkoSombor", "Admin"];

  useEffect(() => {
    if (pseudo.length < 3) { setPseudoStatus(null); return; }
    setPseudoStatus("checking");
    const timer = setTimeout(() => {
      setPseudoStatus(takenPseudos.some(p => p.toLowerCase() === pseudo.toLowerCase()) ? "taken" : "available");
    }, 600);
    return () => clearTimeout(timer);
  }, [pseudo]);

  const canSubmit = email && password.length >= 8 && password === confirm && pseudo.length >= 3 && pseudoStatus === "available" && tos && privacy;

  const handleSubmit = () => {
    if (canSubmit) onRegister(email);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.gray50 }}>
      <div style={{ padding: "20px 20px 16px", background: `linear-gradient(180deg, ${C.green700} 0%, ${C.green600} 100%)`, borderRadius: "0 0 24px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 4px" }}>Dobrodosli u</p>
        <h1 style={{ fontFamily: "sans-serif", fontSize: 28, color: C.white, margin: 0, fontWeight: 800 }}>KOLO</h1>
        <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "8px 0 0" }}>Kreirajte nalog i pridruzite se zajednici</p>
      </div>
      <div style={{ padding: "20px 16px" }}>
        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 500, color: C.gray700, display: "block", marginBottom: 6 }}>Email adresa</label>
          <input type="email" placeholder="vas@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${errors.email ? C.red500 : C.gray200}`, outline: "none", fontSize: 15, fontFamily: "sans-serif", color: C.gray900 }} />
        </div>
        {/* Lozinka */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 500, color: C.gray700, display: "block", marginBottom: 6 }}>Lozinka</label>
          <div style={{ position: "relative" }}>
            <input type={showPw ? "text" : "password"} placeholder="Minimum 8 karaktera" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "14px 48px 14px 16px", borderRadius: 12, border: `1.5px solid ${C.gray200}`, outline: "none", fontSize: 15, fontFamily: "sans-serif", color: C.gray900 }} />
            <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.gray400 }}>👁</button>
          </div>
          <PasswordStrength password={password} />
        </div>
        {/* Potvrda */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 500, color: C.gray700, display: "block", marginBottom: 6 }}>Potvrda lozinke</label>
          <input type={showPw ? "text" : "password"} placeholder="Ponovite lozinku" value={confirm} onChange={e => setConfirm(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${confirm && confirm === password ? C.green500 : C.gray200}`, outline: "none", fontSize: 15, fontFamily: "sans-serif" }} />
          {confirm && confirm === password && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.green600, margin: "4px 0 0" }}>✓ Lozinke se poklapaju</p>}
        </div>
        {/* Pseudonim */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 500, color: C.gray700, display: "block", marginBottom: 6 }}>Pseudonim</label>
          <div style={{ position: "relative" }}>
            <input type="text" placeholder="Vase korisnicko ime" value={pseudo} onChange={e => setPseudo(e.target.value.replace(/\s/g, ""))} style={{ width: "100%", padding: "14px 44px 14px 16px", borderRadius: 12, border: `1.5px solid ${pseudoStatus === "available" ? C.green500 : pseudoStatus === "taken" ? C.red500 : C.gray200}`, outline: "none", fontSize: 15, fontFamily: "sans-serif" }} />
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
              {pseudoStatus === "available" && "✓"}
              {pseudoStatus === "taken" && "✗"}
              {pseudoStatus === "checking" && "…"}
            </span>
          </div>
          {pseudoStatus === "taken" && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.red500, margin: "4px 0 0" }}>Ovaj pseudonim je zauzet</p>}
          {pseudoStatus === "available" && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.green600, margin: "4px 0 0" }}>Pseudonim je slobodan</p>}
        </div>
        {/* Checkboxes */}
        {[
          { checked: tos, onChange: () => setTos(!tos), label: "Prihvatam Uslove koriscenja" },
          { checked: privacy, onChange: () => setPrivacy(!privacy), label: "Prihvatam Politiku privatnosti" },
        ].map((cb, i) => (
          <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
            <div onClick={cb.onChange} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${cb.checked ? C.green600 : C.gray300}`, background: cb.checked ? C.green600 : C.white, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 14 }}>
              {cb.checked && "✓"}
            </div>
            <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray700 }}>{cb.label}</span>
          </label>
        ))}
        <button onClick={handleSubmit} disabled={!canSubmit} style={{ width: "100%", padding: 16, marginTop: 12, background: canSubmit ? `linear-gradient(135deg, ${C.green600}, ${C.green700})` : C.gray200, color: canSubmit ? C.white : C.gray400, border: "none", borderRadius: 14, cursor: canSubmit ? "pointer" : "default", fontFamily: "sans-serif", fontSize: 16, fontWeight: 600 }}>
          Registruj se
        </button>
        <p style={{ textAlign: "center", marginTop: 16, fontFamily: "sans-serif", fontSize: 14, color: C.gray400 }}>
          Vec imate nalog?{" "}
          <button onClick={onGoLogin} style={{ background: "none", border: "none", cursor: "pointer", color: C.green700, fontWeight: 600, fontSize: 14, fontFamily: "sans-serif" }}>Prijavite se</button>
        </p>
      </div>
    </div>
  );
}

function EmailConfirmScreen({ email, onConfirm }) {
  return (
    <div style={{ minHeight: "100vh", background: C.gray50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ width: 88, height: 88, borderRadius: "50%", background: C.green50, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 40 }}>📧</div>
      <h2 style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 700, color: C.gray900, margin: "0 0 8px" }}>Proverite email</h2>
      <p style={{ fontFamily: "sans-serif", fontSize: 14, color: C.gray500, margin: "0 0 4px" }}>Poslali smo vam link za potvrdu na</p>
      <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, color: C.gray900, margin: "0 0 32px" }}>{email}</p>
      <button onClick={onConfirm} style={{ padding: "14px 32px", background: `linear-gradient(135deg, ${C.green600}, ${C.green700})`, color: C.white, border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600 }}>
        Simuliraj klik na link ✉️
      </button>
      <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.gray400, marginTop: 16 }}>Link važi 24 sata</p>
    </div>
  );
}

function VerificationScreen({ onSubmit, onSkip }) {
  const [frontPhoto, setFrontPhoto] = useState(false);
  const [backPhoto, setBackPhoto] = useState(false);
  const [jmbg, setJmbg] = useState("");
  const [jmbgError, setJmbgError] = useState("");

  const validateJmbg = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 13);
    setJmbg(clean);
    if (clean.length > 0 && clean.length < 13) setJmbgError("JMBG mora imati 13 cifara");
    else setJmbgError("");
  };

  const canSubmit = frontPhoto && backPhoto && jmbg.length === 13;

  return (
    <div style={{ minHeight: "100vh", background: C.gray50 }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.white, borderBottom: `1px solid ${C.gray100}` }}>
        <h2 style={{ fontFamily: "sans-serif", fontSize: 18, color: C.gray900, margin: 0 }}>Verifikacija identiteta</h2>
        <button onClick={onSkip} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, color: C.gray400 }}>Preskoči</button>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ background: C.green50, borderRadius: 14, padding: "14px 16px", marginBottom: 20, border: `1px solid ${C.green100}` }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 13, color: C.green900, margin: 0, lineHeight: 1.5 }}>
            Verifikacijom identiteta dobijate pristup celom sistemu i bonus od <strong>1.000 POEN</strong>.
          </p>
        </div>
        <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray700, margin: "0 0 10px" }}>Fotografija licne karte</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Prednja strana", done: frontPhoto, onClick: () => setFrontPhoto(true) },
            { label: "Zadnja strana", done: backPhoto, onClick: () => setBackPhoto(true) },
          ].map((item, i) => (
            <button key={i} onClick={item.onClick} style={{ padding: "24px 12px", borderRadius: 14, cursor: "pointer", background: item.done ? C.green50 : C.white, border: `2px dashed ${item.done ? C.green500 : C.gray300}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              {item.done ? (
                <span style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 500, color: C.green700 }}>✓ Dodato</span>
              ) : (
                <>
                  <span style={{ fontSize: 24 }}>📷</span>
                  <span style={{ fontFamily: "sans-serif", fontSize: 12, color: C.gray400 }}>{item.label}</span>
                </>
              )}
            </button>
          ))}
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: C.gray700, display: "block", marginBottom: 6 }}>JMBG</label>
          <input type="text" inputMode="numeric" placeholder="13 cifara" value={jmbg} onChange={e => validateJmbg(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${jmbgError ? C.red500 : jmbg.length === 13 ? C.green500 : C.gray200}`, outline: "none", fontSize: 18, fontFamily: "sans-serif", letterSpacing: 2, textAlign: "center" }} />
          {jmbgError && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.red500, margin: "4px 0 0" }}>{jmbgError}</p>}
          {jmbg.length === 13 && !jmbgError && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.green600, margin: "4px 0 0" }}>✓ Format ispravan</p>}
        </div>
        <button onClick={() => canSubmit && onSubmit()} disabled={!canSubmit} style={{ width: "100%", padding: 16, background: canSubmit ? `linear-gradient(135deg, ${C.green600}, ${C.green700})` : C.gray200, color: canSubmit ? C.white : C.gray400, border: "none", borderRadius: 14, cursor: canSubmit ? "pointer" : "default", fontFamily: "sans-serif", fontSize: 16, fontWeight: 600 }}>
          Pošalji na verifikaciju
        </button>
      </div>
    </div>
  );
}

function PendingScreen({ onApprove, onReject }) {
  return (
    <div style={{ minHeight: "100vh", background: C.gray50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ width: 88, height: 88, borderRadius: "50%", background: C.amber50, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 40 }}>⏰</div>
      <h2 style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 700, color: C.gray900, margin: "0 0 8px" }}>Zahtev poslat</h2>
      <p style={{ fontFamily: "sans-serif", fontSize: 14, color: C.gray500, margin: "0 0 4px" }}>Direktor Fondacije ce pregledati vas zahtev.</p>
      <p style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray400, margin: "0 0 32px" }}>Obicno traje 1–3 dana</p>
      <div style={{ padding: 16, background: C.white, borderRadius: 14, border: `1px dashed ${C.gray300}`, width: "100%", maxWidth: 280 }}>
        <p style={{ fontFamily: "sans-serif", fontSize: 11, color: C.gray400, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Demo: simuliraj odluku</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onApprove} style={{ flex: 1, padding: 10, borderRadius: 10, cursor: "pointer", background: C.green50, border: `1px solid ${C.green500}`, fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: C.green700 }}>✓ Odobri</button>
          <button onClick={onReject} style={{ flex: 1, padding: 10, borderRadius: 10, cursor: "pointer", background: C.red50, border: `1px solid ${C.red500}`, fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: C.red500 }}>✗ Odbij</button>
        </div>
      </div>
    </div>
  );
}

function ApprovedScreen({ onContinue }) {
  return (
    <div style={{ minHeight: "100vh", background: C.gray50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ width: 96, height: 96, borderRadius: "50%", background: C.green50, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 48 }}>⭐</div>
      <h2 style={{ fontFamily: "sans-serif", fontSize: 24, fontWeight: 800, color: C.gray900, margin: "0 0 8px" }}>Verifikovani ste!</h2>
      <p style={{ fontFamily: "sans-serif", fontSize: 14, color: C.gray500, margin: "0 0 16px" }}>Dobrodosli u KOLO zajednicu</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
        <span style={{ fontFamily: "sans-serif", fontSize: 44, fontWeight: 800, color: C.green700 }}>+1.000</span>
        <span style={{ fontFamily: "sans-serif", fontSize: 18, color: C.gray400 }}>POEN</span>
      </div>
      <p style={{ fontFamily: "sans-serif", fontSize: 13, color: C.gray400, margin: "0 0 36px" }}>Bonus za verifikaciju dodat na vas racun</p>
      <button onClick={onContinue} style={{ padding: "16px 48px", background: `linear-gradient(135deg, ${C.green600}, ${C.green700})`, color: C.white, border: "none", borderRadius: 14, cursor: "pointer", fontFamily: "sans-serif", fontSize: 16, fontWeight: 600 }}>
        Nastavi na Dashboard
      </button>
    </div>
  );
}

function RejectedScreen({ onRetry }) {
  return (
    <div style={{ minHeight: "100vh", background: C.gray50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ width: 88, height: 88, borderRadius: "50%", background: C.red50, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 48 }}>✗</div>
      <h2 style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 700, color: C.gray900, margin: "0 0 8px" }}>Zahtev odbijen</h2>
      <div style={{ background: C.red50, borderRadius: 12, padding: "12px 16px", margin: "0 0 24px", border: `1px solid ${C.red100}`, maxWidth: 300 }}>
        <p style={{ fontFamily: "sans-serif", fontSize: 13, color: C.red500, margin: 0 }}>Razlog: Fotografija necitka, posaljite ponovo</p>
      </div>
      <button onClick={onRetry} style={{ padding: "14px 32px", background: `linear-gradient(135deg, ${C.green600}, ${C.green700})`, color: C.white, border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600 }}>
        Pošalji ponovo
      </button>
    </div>
  );
}

export default function KoloOnboarding() {
  const [screen, setScreen] = useState("register");
  const [email, setEmail] = useState("");

  return (
    <div style={{ maxWidth: 430, margin: "0 auto" }}>
      {screen === "register" && <RegistrationScreen onRegister={em => { setEmail(em); setScreen("email"); }} onGoLogin={() => setScreen("register")} />}
      {screen === "email" && <EmailConfirmScreen email={email} onConfirm={() => setScreen("verify")} />}
      {screen === "verify" && <VerificationScreen onSubmit={() => setScreen("pending")} onSkip={() => setScreen("register")} />}
      {screen === "pending" && <PendingScreen onApprove={() => setScreen("approved")} onReject={() => setScreen("rejected")} />}
      {screen === "approved" && <ApprovedScreen onContinue={() => setScreen("register")} />}
      {screen === "rejected" && <RejectedScreen onRetry={() => setScreen("verify")} />}
    </div>
  );
}
