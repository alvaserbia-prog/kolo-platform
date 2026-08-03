"use client";

import Pseudonim from "@/components/Pseudonim";
import type { KarticaPrikaz as Kartica } from "@/lib/jemstvo-kartica";

/**
 * Prikaz kartice prepoznavanja.
 *
 * Ime, prezime i nadimak idu kroz <Pseudonim> (data-no-cyr) — vlastita imena se
 * NE transliterišu u ćirilicu, isto kao korisnički pseudonimi. Mesto se pušta
 * kroz transliteraciju: naselja su iz srpskog šifarnika i preslikavaju se tačno.
 *
 * Telefon i link se ovde NIKAD ne prikazuju — nisu ni u podacima koje server
 * vraća za karticu.
 */
export default function KarticaPrikaz({
  kartica,
  kompaktno = false,
}: {
  kartica: Kartica;
  kompaktno?: boolean;
}) {
  const naslov = kartica.puna
    ? [kartica.ime, kartica.prezime].filter(Boolean).join(" ")
    : kartica.inicijali;

  const godina = kartica.puna ? kartica.godiste : kartica.decenija;

  return (
    <div className={kompaktno ? "space-y-1" : "space-y-1.5"}>
      <p className={kompaktno ? "font-semibold text-kolo-text" : "text-lg font-semibold text-kolo-text"}>
        {naslov ? <Pseudonim>{naslov}</Pseudonim> : <span className="text-kolo-muted">—</span>}
        {godina && <span className="ml-2 text-sm font-normal text-kolo-muted">{godina}.</span>}
      </p>

      {(kartica.nadimak || kartica.mesto) && (
        <p className="text-sm text-kolo-muted">
          {kartica.nadimak && (
            <>
              „<Pseudonim>{kartica.nadimak}</Pseudonim>"
            </>
          )}
          {kartica.nadimak && kartica.mesto && <span className="mx-1.5">·</span>}
          {kartica.mesto}
        </p>
      )}

      {kartica.cimeSeBavi && (
        <p className="text-sm text-kolo-text italic">{kartica.cimeSeBavi}</p>
      )}

      {/* Legacy objava (slobodan tekst pre redizajna) — stoji dok vlasnik ne dopuni. */}
      {kartica.legacyTekst && (
        <p className="text-sm text-kolo-muted whitespace-pre-wrap border-l-2 border-kolo-border pl-3 mt-2">
          {kartica.legacyTekst}
        </p>
      )}
    </div>
  );
}
