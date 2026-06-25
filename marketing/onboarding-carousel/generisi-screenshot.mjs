// Generator karusela sa PRAVIM screenshotovima ekrana u telefonskom okviru.
// Layout: veliki telefon SA STRANE (naizmenično levo/desno), tekst pored njega.
// Slajdovi 1 i 9 su brendirana grafika; 2–8 nose screenshot (iz ./screenshots).
// Pokretanje iz korena:  node marketing/onboarding-carousel/generisi-screenshot.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const b64 = (p) => readFileSync(p).toString("base64");
const asset = (p) => `data:image/png;base64,${b64(join(ROOT, p))}`;
const shotImg = (n) => `data:image/png;base64,${b64(join(HERE, "screenshots", `${n}.png`))}`;
const logoLight = asset("public/kolo-logo.png");
const icon = asset("public/kolo-icon.png");

const C = {
  g900: "#0F3D20", g700: "#1B6B3A", g500: "#2E9D54", g100: "#E8F5EC",
  gold400: "#F5B842", gold600: "#D99520",
  bg: "#FAFAF8", surface: "#FFFFFF", border: "#E8E6E1",
  text: "#1A1A17", muted: "#6B6860",
};

const shell = (inner, { dark = false } = {}) => `<!doctype html><html lang="sr"><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px}
body{font-family:Inter,'Segoe UI',system-ui,-apple-system,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  color:${dark ? "#F4FAF5" : C.text};background:${dark ? C.g900 : C.bg};position:relative;overflow:hidden}
.dots{position:absolute;inset:0;opacity:${dark ? .10 : .5};pointer-events:none;
  background-image:radial-gradient(circle, ${dark ? "#ffffff" : "#d1cfc9"} 1.4px, transparent 1.4px);background-size:30px 30px}

/* ── grafički slajd (cover/cta) ── */
.slide{position:absolute;inset:0;display:flex;flex-direction:column;padding:96px 90px}
.kicker{display:inline-flex;align-items:center;gap:13px;font-weight:700;font-size:25px;
  letter-spacing:.13em;text-transform:uppercase;color:${dark ? C.gold400 : C.g700}}
.kicker .pip{width:13px;height:13px;border-radius:50%;background:${C.gold400}}
h1{font-weight:800;letter-spacing:-.02em;line-height:1.03;color:${dark ? "#fff" : C.g900}}
h1 .gold{color:${C.gold400}}
.lead{line-height:1.4;color:${dark ? "rgba(244,250,245,.9)" : C.muted}}
.lead b{font-weight:700;color:${dark ? "#fff" : C.g700}}

/* ── screenshot slajd: telefon sa strane + tekst pored ── */
.corner-logo{position:absolute;top:60px;left:70px;z-index:3}
.corner-logo img{height:48px;width:auto;border-radius:12px}
.corner-pg{position:absolute;top:66px;right:74px;z-index:3;font-size:26px;font-weight:700;
  opacity:.8;color:${dark ? "#F4FAF5" : C.text}}
.row{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  gap:50px;padding:118px 66px 78px}
.row.right{flex-direction:row-reverse}
.col-text{flex:1;display:flex;flex-direction:column;justify-content:center}
.col-text .kicker{font-size:23px;letter-spacing:.12em}
.col-text h1{font-size:56px;margin-top:20px}
.col-text .lead{font-size:30px;margin-top:24px}
.phone{flex:none;width:498px;aspect-ratio:402/860;background:#0c0c0c;border-radius:50px;
  padding:14px;box-shadow:0 34px 80px rgba(0,0,0,${dark ? .55 : .24}),0 0 0 2px ${dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)"}}
.phone .scr{width:100%;height:100%;border-radius:38px;overflow:hidden;background:#fff;position:relative}
.phone .scr img{width:100%;height:100%;object-fit:cover;object-position:top}
.notch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:140px;height:30px;
  background:#0c0c0c;border-radius:0 0 20px 20px;z-index:2}
</style></head><body><div class="dots"></div>${inner}</body></html>`;

// screenshot slajd: side = "left" | "right" (na kojoj strani je telefon)
const sShot = ({ n, kicker, title, lead, shot, dark = false, side = "left" }) => shell(`
<div class="corner-logo"><img src="${dark ? icon : logoLight}" alt="KOLO"></div>
<div class="corner-pg">${n} / 9</div>
<div class="row ${side === "right" ? "right" : ""}">
  <div class="phone"><div class="scr"><div class="notch"></div><img src="${shotImg(shot)}" alt=""></div></div>
  <div class="col-text">
    <div class="kicker"><span class="pip"></span>${kicker}</div>
    <h1>${title}</h1>
    <p class="lead">${lead}</p>
  </div>
</div>`, { dark });

const slides = [];

// 1 — COVER (grafika)
slides.push(shell(`
<div class="slide" style="justify-content:center;align-items:flex-start">
  <img src="${icon}" alt="KOLO" style="height:144px;border-radius:32px;margin-bottom:58px">
  <div class="kicker"><span class="pip"></span>VODIČ ZA NOVE ČLANOVE</div>
  <h1 style="font-size:104px;margin-top:34px">Kako da uđeš<br>u <span class="gold">KOLO</span></h1>
  <p class="lead" style="font-size:40px;margin-top:34px;max-width:900px">Mreža razmene rada, dobara i znanja u tvom kraju — <b>bez novca i posrednika.</b></p>
  <div style="flex:1"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
    <span style="display:inline-block;padding:18px 30px;border-radius:999px;font-weight:700;font-size:30px;background:${C.gold400};color:${C.g900}">ekolo.rs · besplatno</span>
    <span style="font-size:30px;font-weight:700;color:${C.gold400}">prevuci&nbsp;→</span>
  </div>
</div>`, { dark: true }));

// 2–8 screenshot slajdovi (telefon naizmenično levo/desno)
slides.push(sShot({ n: 2, side: "left", kicker: "ŠTA JE KOLO?", title: "Razmena u<br>tvom kraju",
  lead: "Rad, dobra i znanje sa ljudima oko sebe — <b>bez posrednika i provizije.</b>", shot: "landing" }));

slides.push(sShot({ n: 3, side: "right", kicker: "POEN NIJE NOVAC", title: "Zapis o<br>doprinosu",
  lead: "U novčaniku vidiš svoje POEN-e — <b>evidenciju, ne pare.</b> Ne menja se za dinare.", shot: "novcanik" }));

slides.push(sShot({ n: 4, side: "left", dark: true, kicker: "KORAK 1 · REGISTRACIJA", title: "Napravi<br>nalog",
  lead: "Pseudonim, email, lozinka — <b>bez dokumenata.</b> Javno se vidi samo pseudonim.", shot: "registracija" }));

slides.push(sShot({ n: 5, side: "right", kicker: "KORAK 2 · VERIFIKACIJA", title: "Potvrde te<br>ljudi",
  lead: "Verifikuje te neko ko te <b>lično poznaje</b>. Indeks ≥ 10% = pun pristup.", shot: "verifikacija" }));

slides.push(sShot({ n: 6, side: "left", dark: true, kicker: "NE ZNAŠ NIKOG?", title: "Tabla<br>jemstva",
  lead: "Predstaviš se mreži, <b>verifikovani članovi ti se jave.</b> U beti te uvodimo lično. 🤝", shot: "tabla-jemstva" }));

slides.push(sShot({ n: 7, side: "right", kicker: "KORAK 3 · PRVA RAZMENA", title: "Pijaca",
  lead: "Postaviš oglas, dogovoriš razmenu, <b>upišeš POEN.</b> Cena je u POEN-ima.", shot: "pijaca" }));

slides.push(sShot({ n: 8, side: "left", dark: true, kicker: "ZAJEDNICA", title: "Uvek u<br>toku",
  lead: "Vesti Fondacije i Pričaonica — <b>KOLO se gradi sa tobom.</b>", shot: "pocetna" }));

// 9 — CTA (grafika)
slides.push(shell(`
<div class="slide" style="justify-content:center">
  <img src="${icon}" alt="KOLO" style="height:128px;border-radius:30px;margin-bottom:52px">
  <div class="kicker"><span class="pip"></span>OTVORI NALOG BESPLATNO</div>
  <div style="font-size:92px;font-weight:800;color:${C.gold400};margin-top:34px;letter-spacing:-.01em">ekolo.rs</div>
  <p class="lead" style="font-size:38px;margin-top:30px;max-width:900px">Trenutno smo u <b>zatvorenoj BETA fazi</b> — tvoj utisak direktno oblikuje platformu.</p>
  <div style="flex:1"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;width:100%;border-top:1px solid rgba(255,255,255,.18);padding-top:38px">
    <span style="font-size:36px;font-weight:800;color:#fff">KOLO se gradi sa tobom,<br>ne za tebe.</span>
    <img src="${icon}" alt="" style="height:90px;border-radius:22px">
  </div>
</div>`, { dark: true }));

slides.forEach((html, i) => {
  writeFileSync(join(HERE, "slajdovi", `slajd-${String(i + 1).padStart(2, "0")}.html`), html);
});
console.log(`Napravljeno ${slides.length} slajdova (screenshot sa strane) u slajdovi/`);
