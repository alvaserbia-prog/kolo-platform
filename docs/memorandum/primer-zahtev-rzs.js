const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, BorderStyle,
} = require("docx");

const logo = fs.readFileSync(__dirname + "/kolo-logo-memorandum.png");

const FONT = "Arial";
const t = (text, opts = {}) => new TextRun({ text, font: FONT, size: 22, ...opts });

// memorandum: logo + naziv levo, podaci desno ispod, linija ispod zaglavlja
const headerBorder = {
  bottom: { style: BorderStyle.SINGLE, size: 6, space: 6, color: "444444" },
};

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 22 } } } },
  sections: [{
    properties: {
      page: { margin: { top: 1134, bottom: 1134, left: 1418, right: 1418 } }, // 2cm/2.5cm
    },
    children: [
      // ===== MEMORANDUM =====
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new ImageRun({ type: "png", data: logo, transformation: { width: 95, height: 95 } })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60 },
        children: [t("KOLO FONDACIJA", { bold: true, size: 30 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40 },
        children: [t("Šetalište 16, 25000 Sombor, Republika Srbija", { size: 20, color: "444444" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: headerBorder,
        spacing: { after: 360 },
        children: [t("Matični broj: 28836627  ·  PIB: 115840443  ·  Šifra delatnosti: 9499  ·  www.ekolo.rs", { size: 20, color: "444444" })],
      }),

      // ===== PRIMALAC =====
      new Paragraph({ children: [t("REPUBLIČKI ZAVOD ZA STATISTIKU", { bold: true })] }),
      new Paragraph({ children: [t("Registar jedinica razvrstavanja")] }),
      new Paragraph({ spacing: { after: 240 }, children: [t("Milana Rakića 5, 11050 Beograd")] }),

      new Paragraph({
        spacing: { after: 240 },
        children: [t("PREDMET: ", { bold: true }), t("Zahtev za izdavanje Obaveštenja o razvrstavanju po delatnostima", { bold: true })],
      }),

      new Paragraph({ spacing: { after: 160 }, children: [t("Poštovani,")] }),
      new Paragraph({
        spacing: { after: 160 },
        children: [t("Molimo da nam izdate Obaveštenje o razvrstavanju jedinice razvrstavanja prema Klasifikaciji delatnosti, koje nam je potrebno radi otvaranja platnog računa kod poslovne banke (Banka Poštanska štedionica a.d. Beograd).")],
      }),
      new Paragraph({ spacing: { after: 80 }, children: [t("Podaci o jedinici razvrstavanja:", { bold: true })] }),
      ...[
        ["Pun naziv: ", "KOLO FONDACIJA"],
        ["Oblik organizovanja: ", "fondacija"],
        ["Matični broj: ", "28836627"],
        ["PIB: ", "115840443"],
        ["Sedište i adresa: ", "Šetalište 16, 25000 Sombor"],
        ["Registrovana delatnost: ", "9499 – Delatnost ostalih organizacija na bazi učlanjenja"],
        ["Kontakt telefon: ", "+381 64 245 3710"],
        ["E-mail: ", "alva.serbia@gmail.com"],
      ].map(([k, v]) => new Paragraph({
        indent: { left: 360 },
        spacing: { after: 40 },
        children: [t(k, { bold: true }), t(v)],
      })),
      new Paragraph({
        spacing: { before: 200, after: 160 },
        children: [t("U prilogu dostavljamo kopiju Rešenja o upisu u Registar zadužbina i fondacija koji vodi Agencija za privredne registre (br. BZF 406/2026 od 21.07.2026. godine), ne starijeg od tri meseca.")],
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [t("Molimo da nam Obaveštenje dostavite elektronskim putem, na gore navedenu e-mail adresu.")],
      }),
      new Paragraph({
        spacing: { after: 400 },
        children: [t("Napomena: ", { bold: true }), t("Fondacija posluje bez pečata.")],
      }),

      new Paragraph({ spacing: { after: 480 }, children: [t("U Somboru, 03.08.2026. godine")] }),

      new Paragraph({ alignment: AlignmentType.RIGHT, children: [t("Za KOLO FONDACIJU")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 480 }, children: [t("Nikola Šarić, direktor")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, children: [t("___________________________")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, children: [t("(potpis)", { size: 18, color: "666666" })] }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(__dirname + "/Zahtev_RZS_obavestenje_o_razvrstavanju.docx", buf);
  console.log("OK");
});
