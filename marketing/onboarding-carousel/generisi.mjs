// Generator KOLO onboarding karusela.
// Pravi 9 HTML slajdova (1080x1350, IG 4:5) u ./slajdovi i pripremni je za render u ./png.
// Pokretanje iz korena repoa:  node marketing/onboarding-carousel/generisi.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const b64 = (p) => readFileSync(join(ROOT, p)).toString("base64");
const logoLight = `data:image/png;base64,${b64("public/kolo-logo.png")}`; // zeleni wordmark za svetle slajdove
const icon = `data:image/png;base64,${b64("public/kolo-icon.png")}`;      // rounded app-badge za tamne slajdove

// ── Brend ──────────────────────────────────────────────────────────
const C = {
  g900: "#0F3D20", g700: "#1B6B3A", g500: "#2E9D54", g100: "#E8F5EC",
  gold400: "#F5B842", gold600: "#D99520", gold100: "#FDF4E0",
  bg: "#FAFAF8", surface: "#FFFFFF", border: "#E8E6E1",
  text: "#1A1A17", muted: "#6B6860",
};

const base = (inner, { dark = false } = {}) => `<!doctype html><html lang="sr"><head><meta charset="utf-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px}
body{font-family:Inter,'Segoe UI',system-ui,-apple-system,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  color:${dark ? "#F4FAF5" : C.text};
  background:${C.bg};
  position:relative;overflow:hidden}
${dark ? `body{background:${C.g900}}` : ""}
.slide{position:absolute;inset:0;display:flex;flex-direction:column;
  padding:96px 90px 88px}
.dots{position:absolute;inset:0;opacity:${dark ? .10 : .55};pointer-events:none;
  background-image:radial-gradient(circle, ${dark ? "#ffffff" : "#d1cfc9"} 1.4px, transparent 1.4px);
  background-size:30px 30px}
.kicker{display:inline-flex;align-items:center;gap:14px;font-weight:700;
  font-size:25px;letter-spacing:.14em;text-transform:uppercase;
  color:${dark ? C.gold400 : C.g700}}
.kicker .pip{width:14px;height:14px;border-radius:50%;background:${C.gold400};
  box-shadow:0 0 0 6px ${dark ? "rgba(245,184,66,.18)" : "rgba(245,184,66,.22)"}}
h1{font-weight:800;letter-spacing:-.02em;line-height:1.04;
  font-size:104px;color:${dark ? "#ffffff" : C.g900}}
h1 .gold{color:${C.gold400}}
.lead{font-size:42px;line-height:1.42;font-weight:400;
  color:${dark ? "rgba(244,250,245,.92)" : C.muted};max-width:880px}
.lead b{font-weight:700;color:${dark ? "#fff" : C.g700}}
.emojis{font-size:78px;letter-spacing:18px;line-height:1}
.spacer{flex:1}
.badge{display:inline-flex;align-items:center;gap:14px;align-self:flex-start;
  padding:18px 30px;border-radius:999px;font-size:30px;font-weight:700;
  background:${dark ? "rgba(255,255,255,.12)" : C.g100};
  color:${dark ? "#fff" : C.g700};border:1px solid ${dark ? "rgba(255,255,255,.18)" : "rgba(46,157,84,.22)"}}
.foot{display:flex;align-items:center;justify-content:space-between;
  font-size:28px;color:${dark ? "rgba(244,250,245,.7)" : C.muted}}
.foot img{height:54px;width:auto}
.stepno{font-weight:800;color:${C.gold600};font-size:30px;letter-spacing:.04em}
.swipe{display:inline-flex;align-items:center;gap:16px;font-size:30px;font-weight:700;
  color:${dark ? C.gold400 : C.g700}}
.bigurl{font-size:92px;font-weight:800;color:${C.gold400};letter-spacing:-.01em}
.pill{display:inline-block;padding:14px 28px;border-radius:999px;font-weight:700;
  font-size:28px;background:${C.gold400};color:${C.g900}}
.note{font-size:30px;line-height:1.45;color:${dark ? "rgba(244,250,245,.82)" : C.muted}}
.card{background:${dark ? "rgba(255,255,255,.08)" : C.surface};
  border:1px solid ${dark ? "rgba(255,255,255,.16)" : C.border};
  border-radius:32px;padding:46px 52px;
  box-shadow:${dark ? "none" : "0 4px 20px rgba(0,0,0,.06)"}}
</style></head><body><div class="dots"></div>${inner}</body></html>`;

// helper sa zaglavljem (logo + paginacija) + content + footer
const page = ({ n, kicker, body, foot, dark = false, headLogo }) => base(`
<div class="slide">
  <div class="foot" style="margin-bottom:64px">
    <img src="${headLogo || (dark ? logoDark : logoLight)}" alt="KOLO">
    <span style="font-size:28px;font-weight:700;opacity:.85">${n} / 9</span>
  </div>
  ${kicker ? `<div class="kicker"><span class="pip"></span>${kicker}</div>` : ""}
  <div style="height:${kicker ? 40 : 0}px"></div>
  ${body}
  <div class="spacer"></div>
  ${foot || ""}
</div>`, { dark });

// ── 9 slajdova ─────────────────────────────────────────────────────
const slides = [];

// 1 — COVER
slides.push(base(`
<div class="slide" style="justify-content:center;align-items:flex-start">
  <div class="dots"></div>
  <img src="${icon}" alt="KOLO" style="height:150px;width:auto;border-radius:34px;margin-bottom:64px">
  <div class="kicker"><span class="pip"></span>VODIČ ZA NOVE ČLANOVE</div>
  <h1 style="margin-top:40px">Kako da uđeš<br>u <span class="gold">KOLO</span></h1>
  <p class="lead" style="margin-top:40px">Mreža razmene rada, dobara i znanja u tvom kraju — <b>bez novca i posrednika.</b></p>
  <div class="spacer"></div>
  <div class="foot">
    <span class="pill">ekolo.rs · besplatno</span>
    <span class="swipe">prevuci&nbsp;&nbsp;→</span>
  </div>
</div>`, { dark: true }));

// 2 — ŠTA JE KOLO
slides.push(page({
  n: 2, kicker: "ŠTA JE KOLO?",
  body: `
    <h1>Mreža razmene<br>u tvom kraju</h1>
    <p class="lead" style="margin-top:44px">Med iz komšiluka, popravka koju neko ume, časovi, zimnica, ručni rad. Sve to postoji oko tebe — <b>samo nije povezano.</b></p>
    <div class="emojis" style="margin-top:60px">🍯 🔧 📚 🥫 🧶</div>`,
  foot: `<p class="note">Razmenjuješ sa ljudima oko sebe — bez provizije.</p>`,
}));

// 3 — POEN
slides.push(page({
  n: 3, kicker: "VAŽNO ODMAH",
  body: `
    <h1>POEN <span style="color:${C.gold600}">nije</span><br>novac</h1>
    <p class="lead" style="margin-top:44px">POEN nije kripto, nije valuta i <b>ne menja se za dinare.</b> To je samo zapis o tome šta si dao zajednici. Ništa se ne kupuje parama.</p>`,
  foot: `<div class="card"><p class="note" style="color:${C.text}">📖 Detaljnije: <b style="color:${C.g700}">ekolo.rs/kako-funkcionise</b></p></div>`,
}));

// 4 — KORAK 1 REGISTRACIJA
slides.push(page({
  n: 4, kicker: "KORAK 1 · REGISTRACIJA",
  body: `
    <h1>Napravi nalog</h1>
    <p class="lead" style="margin-top:44px">Treba ti samo <b>pseudonim, email i lozinka.</b> Bez dokumenata, bez lične karte, bez JMBG-a.</p>`,
  foot: `<div class="badge">✅&nbsp; Traje 1–2 minuta · nalog je besplatan</div>`,
}));

// 5 — KORAK 2 PSEUDONIM
slides.push(page({
  n: 5, kicker: "KORAK 2 · PRIVATNOST",
  body: `
    <h1>Biraš<br>pseudonim</h1>
    <p class="lead" style="margin-top:44px">U celom sistemu javno stoji <b>samo tvoj pseudonim.</b> Pravo ime i podaci ostaju zaštićeni — i nisu uslov za učlanjenje.</p>`,
  foot: `<p class="note">🔒 Tvoj identitet ostaje kod tebe.</p>`,
}));

// 6 — KORAK 3 VERIFIKACIJA
slides.push(page({
  n: 6, kicker: "KORAK 3 · VERIFIKACIJA",
  body: `
    <h1>Potvrde te<br>ljudi koji te<br>poznaju</h1>
    <p class="lead" style="margin-top:44px">Verifikacija ide <b>uživo</b>: član koji te lično poznaje skenira tvoj QR kod. Mreža raste na poverenju — ne na dokumentima.</p>`,
  foot: `<div class="badge">🤝&nbsp; Verifikacija = pun pristup razmeni</div>`,
}));

// 7 — TABLA JEMSTVA
slides.push(page({
  n: 7, kicker: "NE ZNAŠ NIKOG U KOLU?",
  body: `
    <h1>Predstavi se na<br>tabli jemstva</h1>
    <p class="lead" style="margin-top:44px">Ostaviš kratko predstavljanje i kontakt — <b>verifikovani članovi ti se jave.</b> U zatvorenoj beti prvu grupu ljudi povezujemo lično. Tu smo da te uvedemo. 🤝</p>`,
  foot: `<p class="note">Nisi sam — mreža ti izlazi u susret.</p>`,
}));

// 8 — KORAK 4 PRVA RAZMENA
slides.push(page({
  n: 8, kicker: "KORAK 4 · PRVA RAZMENA",
  body: `
    <h1>Tvoja prva<br>razmena</h1>
    <p class="lead" style="margin-top:44px">Kad si verifikovan: <b>postaviš oglas na Pijaci</b>, dogovoriš razmenu i upišeš POEN. Svaki doprinos se beleži — i tvoj.</p>`,
  foot: `<div class="emojis" style="margin-top:0">🛒 💬 ✍️</div>`,
}));

// 9 — CTA
slides.push(base(`
<div class="slide" style="justify-content:center">
  <div class="dots"></div>
  <img src="${icon}" alt="KOLO" style="height:128px;width:auto;border-radius:30px;margin-bottom:52px">
  <div class="kicker"><span class="pip"></span>OTVORI NALOG BESPLATNO</div>
  <div class="bigurl" style="margin-top:40px">ekolo.rs</div>
  <p class="lead" style="margin-top:36px">Trenutno smo u <b>zatvorenoj BETA fazi</b> — okuplja se prva grupa članova i tvoj utisak direktno oblikuje platformu.</p>
  <div class="spacer"></div>
  <div class="foot" style="border-top:1px solid rgba(255,255,255,.18);padding-top:40px">
    <span style="font-size:38px;font-weight:800;color:#fff">KOLO se gradi sa tobom,<br>ne za tebe.</span>
    <img src="${icon}" alt="" style="height:96px">
  </div>
</div>`, { dark: true }));

slides.forEach((html, i) => {
  const name = String(i + 1).padStart(2, "0");
  writeFileSync(join(HERE, "slajdovi", `slajd-${name}.html`), html);
});
console.log(`Napravljeno ${slides.length} slajdova u slajdovi/`);
