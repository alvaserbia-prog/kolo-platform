import { continueRender, delayRender, staticFile } from "remotion";

// Noto Sans i Caveat: oba imaju latin-ext, pa rade č, ć, š, ž, đ.
// Svaki rez se učitava kao dva fajla (latin + latin-ext) sa unicode-range.
const LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT = "U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";

const REZOVI: [string, string, number][] = [
  ["Noto Sans", "noto-sans", 400],
  ["Noto Sans", "noto-sans", 700],
  ["Noto Sans", "noto-sans", 800],
  ["Noto Sans", "noto-sans", 900],
  ["Caveat", "caveat", 600],
  ["Caveat", "caveat", 700],
];

let ucitano = false;
export const ucitajFontove = () => {
  if (ucitano || typeof document === "undefined") return;
  ucitano = true;
  const h = delayRender("fontovi");
  const sve: Promise<FontFace>[] = [];
  for (const [ime, fajl, tezina] of REZOVI) {
    for (const [podskup, opseg] of [["latin", LATIN], ["latin-ext", LATIN_EXT]]) {
      const ff = new FontFace(ime, `url(${staticFile(`fonts/${fajl}-${podskup}-${tezina}-normal.woff2`)}) format("woff2")`, {
        weight: String(tezina),
        unicodeRange: opseg,
      });
      document.fonts.add(ff);
      sve.push(ff.load());
    }
  }
  Promise.all(sve).then(() => continueRender(h)).catch((e) => {
    console.error(e);
    continueRender(h);
  });
};

export const SANS = "'Noto Sans', sans-serif";
export const RUKOPIS = "'Caveat', 'Noto Sans', cursive";
