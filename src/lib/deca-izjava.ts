/**
 * Izjava roditelja o postojanju deteta (Pravilnik o učešću dece, čl. 6 st. 1).
 * ČISTA funkcija — bez Prisme, jer tekst prikazuje i obrazac u pretraživaču.
 *
 * ─── Zašto ovaj dokument postoji ────────────────────────────────────────────
 *
 * Do seta 4.5.2 je postupak iz čl. 6 pitao SAMO potvrđivače roditelja. Tvrdnja
 * „ovaj čovek ima dete tog uzrasta" time je počivala isključivo na ljudima koji
 * to znaju posredno, dok je onaj koji jedini zna pouzdano — sam roditelj — u
 * postupku ćutao. Uz to je izostanak izjašnjenja obarao vezu u grafu, dakle
 * pogađao OBA njena člana, a izjašnjenje se tražilo samo od jednog.
 *
 * Sada potvrda opstaje samo ako su se izjasnile obe strane veze: potvrđivač
 * odgovorom, roditelj ovom izjavom. Roditelj je po pravilu daje u trenutku u kome
 * preuzima odgovornost za nalog — pri otvaranju naloga (čl. 4) ili pri njegovom
 * preuzimanju (čl. 4b) — pa mu rok ne teče.
 *
 * 🔴 Tekst se SNIMA na vezu roditelj–dete (`Roditeljstvo.izjavaTekst`) i posle
 * toga se ne menja — isti razlog kao kod ugovora o donaciji i izjave izvršioca:
 * dokument mora da govori ono što je govorio u trenutku davanja, bez obzira na
 * kasnije izmene pravilnika. Ne generisati ga ponovo pri čitanju.
 *
 * 🔴 Tekst je na SRPSKOM na svim jezicima: to je izjava pod punom odgovornošću
 * po srpskom pravu, a merodavan je srpski original.
 */

export type UlazIzjaveRoditelja = {
  /** Pseudonim naloga maloletnog korisnika na koji se izjava odnosi. */
  pseudonimDeteta: string;
  /** Uzrast deteta u godinama, izveden iz datuma rođenja koji roditelj navodi. */
  godine: number;
};

export function generisiIzjavuRoditelja(p: UlazIzjaveRoditelja): string {
  return [
    `Pod punom odgovornošću izjavljujem da sam roditelj odnosno zakonski zastupnik ` +
      `deteta uzrasta ${p.godine} godina, za koje je otvoren nalog „${p.pseudonimDeteta}".`,
    "",
    "Izjavljujem da dete stvarno postoji, da je navedeni uzrast tačan i da " +
      "pristajem na obradu njegovih podataka u obimu utvrđenom Pravilnikom o " +
      "učešću dece i Politikom privatnosti.",
    "",
    "Znam da za radnje deteta na Platformi odgovaram ja, i da se ova izjava " +
      "proverava kod lica koja su potvrdila moju stvarnost. Znam da će mi se " +
      "potvrda stvarnosti poništiti ako se o postojanju deteta ne izjasni ni to " +
      "lice ni ja, i da tada svako od nas vraća ono što mu je povodom te potvrde " +
      "bilo evidentirano, i kada zapis time postane negativan.",
    "",
    "Znam da neistinita izjava povlači mere iz Uslova korišćenja i poništenje " +
      "zapisa evidentiranih na osnovu naloga tog deteta.",
    "",
    "Izjavu dajem u skladu sa članom 6 Pravilnika o učešću dece.",
  ].join("\n");
}
