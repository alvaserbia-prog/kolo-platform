// Generator karusela — ČISTO PRAKTIČNO UPUTSTVO "kako da se registruješ", korak po korak.
// Pravi ekrani sa zaokruženom akcijom; telefon naizmenično levo/desno, tekst pored.
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

const TOTAL = 7;

const shell = (inner, { dark = false } = {}) => `<!doctype html><html lang="sr"><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px}
body{font-family:Inter,'Segoe UI',system-ui,-apple-system,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  color:${dark ? "#F4FAF5" : C.text};background:${dark ? C.g900 : C.bg};position:relative;overflow:hidden}
.dots{position:absolute;inset:0;opacity:${dark ? .10 : .5};pointer-events:none;
  background-image:radial-gradient(circle, ${dark ? "#ffffff" : "#d1cfc9"} 1.4px, transparent 1.4px);background-size:30px 30px}
.slide{position:absolute;inset:0;display:flex;flex-direction:column;padding:96px 90px}
.kicker{display:inline-flex;align-items:center;gap:13px;font-weight:700;font-size:25px;
  letter-spacing:.13em;text-transform:uppercase;color:${dark ? C.gold400 : C.g700}}
.kicker .pip{width:13px;height:13px;border-radius:50%;background:${C.gold400}}
h1{font-weight:800;letter-spacing:-.02em;line-height:1.03;color:${dark ? "#fff" : C.g900}}
h1 .gold{color:${C.gold400}}
.lead{line-height:1.4;color:${dark ? "rgba(244,250,245,.9)" : C.muted}}
.lead b{font-weight:700;color:${dark ? "#fff" : C.g700}}
/* korak-broj krug */
.stepnum{display:flex;align-items:center;justify-content:center;width:62px;height:62px;border-radius:50%;
  background:${C.gold400};color:${C.g900};font-weight:800;font-size:34px;flex:none}
.steprow{display:flex;align-items:center;gap:20px}

.corner-logo{position:absolute;top:60px;left:70px;z-index:3}
.corner-logo img{height:48px;width:auto;border-radius:12px}
.corner-pg{position:absolute;top:66px;right:74px;z-index:3;font-size:26px;font-weight:700;
  opacity:.8;color:${dark ? "#F4FAF5" : C.text}}
.row{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  gap:50px;padding:118px 66px 78px}
.row.right{flex-direction:row-reverse}
.col-text{flex:1;display:flex;flex-direction:column;justify-content:center}
.col-text .kicker{font-size:23px;letter-spacing:.12em}
.col-text h1{font-size:54px;margin-top:16px}
.col-text .lead{font-size:30px;margin-top:22px}
.phone{flex:none;width:498px;aspect-ratio:402/860;background:#0c0c0c;border-radius:50px;
  padding:14px;box-shadow:0 34px 80px rgba(0,0,0,${dark ? .55 : .24}),0 0 0 2px ${dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)"}}
.phone .scr{width:100%;height:100%;border-radius:38px;overflow:hidden;background:#fff;position:relative}
.phone .scr img{width:100%;height:100%;object-fit:cover;object-position:top}
.notch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:140px;height:30px;
  background:#0c0c0c;border-radius:0 0 20px 20px;z-index:2}
.ring{position:absolute;border:6px solid ${C.gold400};border-radius:50%;
  box-shadow:0 0 0 3px rgba(15,61,32,.25),0 6px 20px rgba(0,0,0,.25);transform:rotate(-3deg);z-index:4}
.alabel{position:absolute;z-index:5;background:${C.gold400};color:${C.g900};font-weight:800;
  font-size:24px;padding:10px 20px;border-radius:999px;white-space:nowrap;
  box-shadow:0 8px 22px rgba(0,0,0,.3);transform:rotate(-3deg)}
</style></head><body><div class="dots"></div>${inner}</body></html>`;

// praktičan korak: telefon sa strane + broj koraka + tekst; opcioni circle
const step = ({ n, num, kicker, title, lead, shot, dark = false, side = "left", circle }) => shell(`
<div class="corner-logo"><img src="${dark ? icon : logoLight}" alt="KOLO"></div>
<div class="corner-pg">${n} / ${TOTAL}</div>
<div class="row ${side === "right" ? "right" : ""}">
  <div class="phone"><div class="scr"><div class="notch"></div><img src="${shotImg(shot)}" alt="">
    ${circle ? `<div class="ring" style="top:${circle.top};height:${circle.height};left:${circle.left};right:${circle.right}"></div>` : ""}
    ${circle && circle.label ? `<div class="alabel" style="left:50%;top:${circle.labelTop};transform:translateX(-50%) rotate(-3deg)">${circle.label}</div>` : ""}
  </div></div>
  <div class="col-text">
    <div class="steprow">
      <div class="stepnum">${num}</div>
      <div class="kicker" style="margin:0">${kicker}</div>
    </div>
    <h1>${title}</h1>
    <p class="lead">${lead}</p>
  </div>
</div>`, { dark });

const slides = [];

// 1 — NASLOVNICA (grafika)
slides.push(shell(`
<div class="slide" style="justify-content:center;align-items:flex-start">
  <img src="${icon}" alt="KOLO" style="height:144px;border-radius:32px;margin-bottom:54px">
  <div class="kicker"><span class="pip"></span>PRAKTIČNO UPUTSTVO</div>
  <h1 style="font-size:96px;margin-top:30px">Registruj se<br>u <span class="gold">KOLO</span></h1>
  <p class="lead" style="font-size:40px;margin-top:30px;max-width:920px">Korak po korak, za par minuta. Treba ti samo <b>email</b> i <b>pristupni kod</b>.</p>
  <div style="flex:1"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
    <span style="display:inline-block;padding:18px 30px;border-radius:999px;font-weight:700;font-size:30px;background:${C.gold400};color:${C.g900}">ekolo.rs · besplatno</span>
    <span style="font-size:30px;font-weight:700;color:${C.gold400}">prevuci&nbsp;→</span>
  </div>
</div>`, { dark: true }));

// 2 — KORAK 1: pristupni kod
slides.push(step({ n: 2, num: "1", side: "left", kicker: "PRISTUPNI KOD", title: "Unesi svoj<br>kod", shot: "rani-pristup",
  lead: `Otvori <b>ekolo.rs</b>, ukucaj kod koji si dobio/la i pritisni <b>„Uđi"</b>.`,
  circle: { top: "56%", height: "9%", left: "10%", right: "10%", labelTop: "47%", label: "✏️ unesi kod" } }));

// 3 — KORAK 2: registracija
slides.push(step({ n: 3, num: "2", side: "right", dark: true, kicker: "REGISTRACIJA", title: "Popuni i<br>registruj se", shot: "registracija",
  lead: `Upiši <b>email</b>, izmisli <b>pseudonim</b> (tvoje javno ime) i lozinku, čekiraj uslove i klikni <b>„Registruj se"</b>.`,
  circle: { top: "87.5%", height: "8%", left: "9%", right: "9%", labelTop: "79%", label: "👆 pritisni" } }));

// 4 — KORAK 3: nalog napravljen (dobrodošli)
slides.push(step({ n: 4, num: "3", side: "left", kicker: "NALOG JE NAPRAVLJEN", title: "Ulogovan/a<br>si!", shot: "dobrodosli",
  lead: `Čestitamo — nalog je tvoj. <b>„Dobrodošlica"</b> te provede kroz osnovno za 30 sekundi.` }));

// 5 — KORAK 4: verifikacija
slides.push(step({ n: 5, num: "4", side: "right", dark: true, kicker: "VERIFIKACIJA", title: "Postani<br>pun član", shot: "verifikacija",
  lead: `Pokaži svoj kod nekome ko te <b>lično poznaje</b> — skenira ga i dobijaš pun pristup razmeni.`,
  circle: { top: "35.5%", height: "6.5%", left: "4%", right: "4%" } }));

// 6 — (ako ne znaš nikog): tabla jemstva
slides.push(step({ n: 6, num: "★", side: "left", kicker: "NE ZNAŠ NIKOG?", title: "Tabla<br>jemstva", shot: "tabla-jemstva",
  lead: `Ostavi kratko predstavljanje na <b>tabli jemstva</b> — verifikovani članovi ti se jave. U test fazi te uvodimo lično. 🤝` }));

// 7 — POZIV NA AKCIJU (grafika)
slides.push(shell(`
<div class="slide" style="justify-content:center">
  <img src="${icon}" alt="KOLO" style="height:128px;border-radius:30px;margin-bottom:50px">
  <div class="kicker"><span class="pip"></span>SPREMAN/NA SI?</div>
  <div style="font-size:92px;font-weight:800;color:${C.gold400};margin-top:32px;letter-spacing:-.01em">ekolo.rs</div>
  <p class="lead" style="font-size:38px;margin-top:28px;max-width:900px">Javi nam se za <b>pristupni kod</b> i kreni. Platforma je u test fazi — uvodimo te lično.</p>
  <div style="flex:1"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;width:100%;border-top:1px solid rgba(255,255,255,.18);padding-top:38px">
    <span style="font-size:36px;font-weight:800;color:#fff">KOLO se gradi sa tobom,<br>ne za tebe.</span>
    <img src="${icon}" alt="" style="height:90px;border-radius:22px">
  </div>
</div>`, { dark: true }));

slides.forEach((html, i) => {
  writeFileSync(join(HERE, "slajdovi", `slajd-${String(i + 1).padStart(2, "0")}.html`), html);
});
console.log(`Napravljeno ${slides.length} slajdova (praktično uputstvo) u slajdovi/`);
