// SAM KLIP — crna pozadina + jedan red belog teksta na sredini.
//
// Ovo je "obična" React komponenta. Remotion je pozove jednom za SVAKI frejm
// videa. Pošto je ovaj klip statičan (ništa se ne pomera), svaki frejm izgleda
// isto — kasnije ćemo dodati animaciju koja se menja kroz vreme.

import { AbsoluteFill, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

// 1) UČITAVANJE FONTA (lokalno, NE sa interneta)
// Font fajl stoji u public/fonts/. staticFile() pravi putanju do njega
// koja radi i u Studiju i pri renderu. Ovo je pouzdanije od skidanja sa
// Google Fonts-a: render ne zavisi od mreže i uvek je identičan.
//
// Koristimo "variable" Montserrat — jedan fajl koji sadrži SVE težine
// (100–900) i SVA pisma (latinica, latin-ext sa č/ć/ž/š/đ, i ćirilica
// za "Сомбор"). Težinu (Bold = 700) biramo dole preko fontWeight.
//
// Ime "Montserrat" koje ovde damo je ono koje posle koristimo u CSS-u
// (fontFamily: "Montserrat").
const fontFamily = "Montserrat";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Montserrat-Variable.ttf"),
});

export const SomborKlip: React.FC = () => {
  return (
    // AbsoluteFill = <div> koji popunjava CEO kadar (1080×1920),
    // sa position:absolute i inset:0. Idealan kao pozadinski sloj.
    // Ovde ga koristimo da: (a) obojimo pozadinu u crno i
    // (b) centriramo sadržaj po sredini (flexbox).
    <AbsoluteFill
      style={{
        backgroundColor: "black",
        justifyContent: "center", // vertikalno centriranje
        alignItems: "center", // horizontalno centriranje
      }}
    >
      <div
        style={{
          fontFamily, // Montserrat koji smo gore učitali
          fontWeight: 700, // Bold
          // Kod VARIABLE fonta fontWeight ne mora da "uhvati" — pa osu
          // debljine (wght) postavljamo eksplicitno na 700 (Bold).
          fontVariationSettings: '"wght" 700',
          fontSize: 160, // veličina slova (px na platnu 1080×1920)
          color: "white", // beli tekst
          // Crna senka: x=0, y=8px, blur=24px, providna crna.
          // Daje tekstu "dubinu" i čitljivost na bilo kojoj pozadini.
          textShadow: "0px 8px 24px rgba(0, 0, 0, 0.9)",
          // letterSpacing malo "otvara" naslov da deluje urednije.
          letterSpacing: 2,
        }}
      >
        Сомбор
      </div>
    </AbsoluteFill>
  );
};
