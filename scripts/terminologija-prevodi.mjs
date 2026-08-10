/**
 * Terminologija „verifikacija → potvrda" u prevodima (hr, en, ru, hu)
 * i u pripadajućim FAQ fajlovima.
 *
 * Srpski je urađen zasebno (`terminologija-sr.mjs`) jer je izvorni jezik i
 * jer je za njega tekst pisan iznova, ne prevođen.
 *
 * Za svaki jezik: prvo POSEBNO (izrazi gde doslovna zamena ne valja ili gde
 * reč znači nešto drugo — npr. bankarska „verifikacija računa"), pa OBLICI
 * (najduži oblik prvi, jer kraći inače pojede deo dužeg).
 *
 * Pokretanje:  node scripts/terminologija-prevodi.mjs [jezik...] [--suvo]
 */
import fs from "node:fs";

const PRAVILA = {
  hr: {
    fajlovi: ["messages/hr.json", "src/lib/faq-data-hr.ts"],
    trag: /verifik|verificir/i,
    posebno: [
      ["graf verifikacija", "mreža potvrda"],
      ["Graf verifikacija", "Mreža potvrda"],
      ["s verificiranih bankovnih računa", "s bankovnih računa čiji je vlasnik identificiran"],
      ["verifikacija identiteta", "potvrda stvarnosti"],
      ["Verifikacija identiteta", "Potvrda stvarnosti"],
      ["NEVERIFICIRAN", "BEZ POTVRDE"],
      ["verifikacijski slot", "slobodno mjesto"],
      ["Reverifikacija", "Ponovna provjera"], ["reverifikacija", "ponovna provjera"],
      // Zatečeni srpski stringovi koje prijevod nikad nije pokrio.
      ["Verifikuj nekoga", "Potvrdi nekoga koga poznaješ"],
      ["Verifikuj još nekoga", "Potvrdi još nekoga"],
      ["Neko ih verifikovao", "Netko ih potvrdio"],
      ["Još nikog nisi verifikovao", "Još nikoga nisi potvrdio"],
      ["Nemate verifikatore koji mogu da potvrde prijavu.", "U vašem lancu nema nikoga tko može potvrditi prijavu."],
      ["Predlagač zadatka ne može verifikovati izvršenje na svom zadatku.", "Predlagatelj zadatka ne može potvrditi izvršenje na svom zadatku."],
    ],
    oblici: [
      ["neverificiranima", "onima bez potvrde"], ["neverificiranim", "onima bez potvrde"],
      ["neverificiranih", "onih bez potvrde"], ["neverificirani", "oni bez potvrde"],
      ["neverificirane", "one bez potvrde"], ["neverificiran", "bez potvrde"],
      ["neverificirana", "bez potvrde"], ["neverificirano", "bez potvrde"],
      ["neverifikovanih", "onih bez potvrde"], ["neverifikovani", "oni bez potvrde"],
      ["neverifikovan", "bez potvrde"],
      ["verificiranima", "potvrđenima"], ["verificiranim", "potvrđenim"],
      ["verificiranih", "potvrđenih"], ["verificiranog", "potvrđenog"],
      ["verificiranom", "potvrđenom"], ["verificiranoj", "potvrđenoj"],
      ["verificiranu", "potvrđenu"], ["verificirani", "potvrđeni"],
      ["verificirane", "potvrđene"], ["verificirana", "potvrđena"],
      ["verificirano", "potvrđeno"], ["verificiran", "potvrđen"],
      ["verifikovanim", "potvrđenim"], ["verifikovanih", "potvrđenih"],
      ["verifikovani", "potvrđeni"], ["verifikovane", "potvrđene"],
      ["verifikovan", "potvrđen"],
      ["verificiranje", "potvrđivanje"], ["verificirati", "potvrditi"],
      ["verificiraju", "potvrđuju"], ["verificirali", "potvrdili"],
      ["verificirale", "potvrdile"], ["verificirala", "potvrdila"],
      ["verificirao", "potvrdio"], ["verificiraš", "potvrdiš"],
      ["verificiram", "potvrđujem"], ["verificira", "potvrđuje"],
      ["verifikovao", "potvrdio"], ["verifikovala", "potvrdila"],
      ["verifikovati", "potvrditi"], ["verifikuješ", "potvrđuješ"],
      ["verifikuje", "potvrđuje"], ["verifikuju", "potvrđuju"],
      ["verifikacijama", "potvrdama"], ["verifikacijom", "potvrdom"],
      ["verifikacije", "potvrde"], ["verifikaciji", "potvrdi"],
      ["verifikaciju", "potvrdu"], ["verifikacija", "potvrda"],
      ["verifikatorima", "onima koji potvrđuju"], ["verifikatora", "onoga tko potvrđuje"],
      ["verifikatoru", "onome tko potvrđuje"], ["verifikatori", "oni koji potvrđuju"],
      ["verifikator", "onaj tko potvrđuje"],
    ],
  },

  en: {
    fajlovi: ["messages/en.json", "src/lib/faq-data-en.ts"],
    trag: /verif/i,
    posebno: [
      // Imenica za ulogu: engleski „confirmer" ne postoji u upotrebi — ide opis.
      ["the verifier", "the person who confirmed you"],
      ["The verifier", "The person who confirms you"],
      ["a verifier", "someone who confirms you"],
      ["your verifiers", "the people in your chain"],
      ["Your verifiers", "The people in your chain"],
      ["all verifiers", "everyone in your chain"],
      ["All verifiers", "Everyone in your chain"],
      ["verifiers", "the people in your chain"],
      ["verifier", "the person who confirmed you"],
      ["Identity verification", "Proof of reality"],
      ["identity verification", "proof of reality"],
      ["Verification graph", "Confirmation network"],
      ["verification graph", "confirmation network"],
      ["from verified bank accounts", "from bank accounts with an identified holder"],
      ["Verification chain", "Chain of confirmations"],
      ["verification chain", "chain of confirmations"],
      ["my ten the people in your chain", "the ten people in my chain"],
      ["UNVERIFIED", "NOT CONFIRMED"],
      ["Verifier", "The person who confirmed"],
      // Zatečeni srpski stringovi koje prijevod nikad nije pokrio.
      ["Neverifikovan", "Not confirmed"], ["neverifikovan", "not confirmed"],
      ["Verifikovani", "Confirmed"], ["Verifikovan", "Confirmed"],
      ["Verifikacija", "Confirmation"],
      ["za verifikaciju", "for confirmation"],
      ["Lažni verifikator", "False confirmation"],
      ["Vlasnik (verifikovan član) *", "Owner (confirmed member) *"],
      ["Nadzor integriteta verifikacija", "Confirmation integrity supervision"],
      ["Otvorili verifikaciju ili tablu", "Opened Confirmations"],
      ["Neko ih verifikovao", "Someone confirmed them"],
      ["Prosečno dana od registracije do verifikacije", "Average days from signup to confirmation"],
      ["Prosečno dana od verifikacije do prvog oglasa", "Average days from confirmation to first listing"],
    ],
    oblici: [
      ["unverified", "unconfirmed"], ["Unverified", "Unconfirmed"],
      ["verifications", "confirmations"], ["verification", "confirmation"],
      ["Verifications", "Confirmations"], ["Verification", "Confirmation"],
      ["verifying", "confirming"], ["verifies", "confirms"],
      ["verified", "confirmed"], ["verify", "confirm"],
      ["Verifying", "Confirming"], ["Verifies", "Confirms"],
      ["Verified", "Confirmed"], ["Verify", "Confirm"],
    ],
  },

  hu: {
    fajlovi: ["messages/hu.json", "src/lib/faq-data-hu.ts"],
    trag: /hitelesít|verifik/i,
    posebno: [
      ["hitelesítési gráf", "megerősítési hálózat"],
      ["Hitelesítési gráf", "Megerősítési hálózat"],
      ["személyazonosság hitelesítése", "valódiság megerősítése"],
      ["Személyazonosság hitelesítése", "Valódiság megerősítése"],
      ["hitelesítő lánc", "megerősítési lánc"],
      ["Hitelesítő lánc", "Megerősítési lánc"],
      ["verifikovan", "megerősített"], ["verifikator", "megerősítő"],
      ["NEM HITELESÍTETT", "NINCS MEGERŐSÍTVE"],
    ],
    // Magyar: mindkét szó -és képzős főnév, ezért a toldalékok változatlanul
    // átvihetők (hitelesítés → megerősítés, hitelesített → megerősített).
    // Az összes alak a „hitelesít" tőből képződik, ezért a tövet cseréljük:
    // a toldalékok (-és, -ett, -ve, -eni, -hető…) változatlanul átmennek.
    tocseCela: true,
    oblici: [["hitelesít", "megerősít"], ["Hitelesít", "Megerősít"]],
  },

  ru: {
    fajlovi: ["messages/ru.json", "src/lib/faq-data-ru.ts"],
    trag: /верифи|verifik/i,
    posebno: [
      ["граф верификаций", "сеть подтверждений"],
      ["Граф верификаций", "Сеть подтверждений"],
      ["верификация личности", "подтверждение реальности"],
      ["Верификация личности", "Подтверждение реальности"],
      ["цепочка верификаций", "цепочка подтверждений"],
      ["Цепочка верификаций", "Цепочка подтверждений"],
      ["verifikovan", "подтверждён"], ["verifikovani", "подтверждённые"],
      ["verifikator", "подтвердивший"], ["verifikaciju", "подтверждение"],
      ["verifikacija", "подтверждение"], ["potvrdi", "подтвердить"],
      ["potvrđeno", "подтверждено"],
    ],
    // Русский: «верификация» женского рода, «подтверждение» — среднего,
    // поэтому согласование меняется; частые связки перечислены отдельно.
    tocseCela: true,
    oblici: [
      ["верифицированному", "подтверждённому"], ["верифицированного", "подтверждённого"],
      ["Верифицированный", "Подтверждённый"], ["верифицированный", "подтверждённый"],
      ["верифицированным", "подтверждённым"], ["верифицированных", "подтверждённых"],
      ["верифицированные", "подтверждённые"], ["верифицированы", "подтверждены"],
      ["верифицирована", "подтверждена"], ["верифицировано", "подтверждено"],
      ["верифицируетесь", "получите подтверждение"], ["верифицируете", "подтверждаете"],
      ["Верифицировать", "Подтвердить"], ["верифицировать", "подтвердить"],
      ["верифицировали", "подтвердили"], ["верифицировал", "подтвердил"],
      ["верифицирует", "подтвердит"], ["Верифицирован", "Подтверждён"],
      ["верифицирован", "подтверждён"],
      ["верификаций", "подтверждений"], ["Верификатор", "Подтвердивший"],
      ["Ваша верификация", "Ваше подтверждение"], ["ваша верификация", "ваше подтверждение"],
      ["новая верификация", "новое подтверждение"], ["Новая верификация", "Новое подтверждение"],
      ["каждая верификация", "каждое подтверждение"], ["Каждая верификация", "Каждое подтверждение"],
      ["ложная верификация", "ложное подтверждение"], ["Ложная верификация", "Ложное подтверждение"],
      ["неверифицированный", "неподтверждённый"], ["Неверифицированный", "Неподтверждённый"],
      ["неверифицированных", "неподтверждённых"], ["неверифицированные", "неподтверждённые"],
      ["неверифицирован", "не подтверждён"], ["Неверифицирован", "Не подтверждён"],
      ["верификациями", "подтверждениями"], ["верификациях", "подтверждениях"],
      ["верификацией", "подтверждением"], ["верификации", "подтверждения"],
      ["верификацию", "подтверждение"], ["верификация", "подтверждение"],
      ["Верификации", "Подтверждения"], ["Верификацию", "Подтверждение"],
      ["Верификация", "Подтверждение"], ["Верификацией", "Подтверждением"],
      ["верификаторами", "подтвердившими"], ["верификаторов", "подтвердивших"],
      ["верификатору", "подтвердившему"], ["верификатора", "подтвердившего"],
      ["верификаторы", "подтвердившие"], ["верификатор", "подтвердивший"],
      ["верифицированных", "подтверждённых"], ["верифицированным", "подтверждённым"],
      ["верифицированные", "подтверждённые"], ["верифицированный", "подтверждённый"],
      ["верифицирован", "подтверждён"], ["Верифицирован", "Подтверждён"],
      ["верифицировать", "подтвердить"], ["верифицирует", "подтверждает"],
    ],
  },
};

const argv = process.argv.slice(2);
const SUVO = argv.includes("--suvo");
const jezici = argv.filter((a) => !a.startsWith("--"));
const izabrani = jezici.length ? jezici : Object.keys(PRAVILA);

function primeni(tekst, pravila) {
  let out = tekst;
  for (const [a, b] of pravila.posebno) out = out.split(a).join(b);
  for (const [a, b] of pravila.oblici) {
    if (pravila.tocseCela) {
      // Ćirilica i mađarski: \b se oslanja na ASCII \w, pa ne radi — a kod
      // aglutinativnog jezika granica reči ionako nije tamo gde treba.
      out = out.split(a).join(b);
      continue;
    }
    out = out.replace(new RegExp("\\b" + a + "\\b", "g"), b);
    const veliko = a[0].toUpperCase() + a.slice(1);
    if (veliko !== a) {
      out = out.replace(new RegExp("\\b" + veliko + "\\b", "g"), b[0].toUpperCase() + b.slice(1));
    }
  }
  return out;
}

for (const jezik of izabrani) {
  const pravila = PRAVILA[jezik];
  console.log(`\n── ${jezik} ─────────────────────────────`);

  for (const put of pravila.fajlovi) {
    const sirovo = fs.readFileSync(put, "utf-8");
    let izmenjeno = 0;
    let novo;

    if (put.endsWith(".json")) {
      const json = JSON.parse(sirovo);
      (function hodaj(c) {
        for (const k of Object.keys(c)) {
          const v = c[k];
          if (typeof v === "string") {
            if (pravila.trag.test(v)) {
              const n = primeni(v, pravila);
              if (n !== v) { c[k] = n; izmenjeno++; }
            }
          } else if (v && typeof v === "object") hodaj(v);
        }
      })(json);
      novo = JSON.stringify(json, null, 2) + "\n";
    } else {
      novo = primeni(sirovo, pravila);
      izmenjeno = novo === sirovo ? 0 : 1;
    }

    const ostalo = (novo.match(new RegExp(pravila.trag.source, "gi")) || []).length;
    console.log(`   ${put}: izmenjeno ${izmenjeno}, ostalo tragova ${ostalo}`);
    if (!SUVO) fs.writeFileSync(put, novo);
  }
}
console.log(SUVO ? "\n(suvi hod — ništa nije upisano)" : "\n✓ upisano");
