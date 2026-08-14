"use client";

import { useState } from "react";

export type KomeKartica = {
  ikona: string;
  naslov: string;
  opis: string;
  poenta: string;
};

/**
 * Kartice „Za koga je KOLO?" — prvih `vidljivo` stoji otvoreno, ostatak se
 * otkriva dugmetom.
 *
 * Skrivene kartice se ISCRTAVAJU i samo sakriju CSS-om, ne izbacuju iz DOM-a:
 * tako ceo spisak ostaje u HTML-u koji server pošalje, pa ga pretraživač
 * indeksira i bez klika na dugme.
 *
 * Emodži je dekoracija (`aria-hidden`) — čitač ekrana bi inače pre naslova
 * kartice izgovorio ime slike („kuća sa baštom"), što ne nosi nikakav podatak.
 */
export default function KomeKartice({
  kartice,
  vidljivo = 6,
  labelJos,
  labelManje,
}: {
  kartice: KomeKartica[];
  vidljivo?: number;
  labelJos: string;
  labelManje: string;
}) {
  const [prosireno, setProsireno] = useState(false);
  const imaSkrivenih = kartice.length > vidljivo;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {kartice.map((seg, i) => (
          <div
            key={seg.naslov}
            className={`bg-white rounded-2xl card-shadow p-4 flex flex-col gap-2${
              i >= vidljivo && !prosireno ? " hidden" : ""
            }`}
          >
            <span className="text-2xl" aria-hidden="true">{seg.ikona}</span>
            <h3 className="font-semibold text-kolo-text text-sm leading-snug">{seg.naslov}</h3>
            <p className="text-xs text-kolo-muted leading-relaxed">{seg.opis}</p>
            <p className="text-xs font-medium text-kolo-green-700 leading-relaxed mt-auto ml-auto text-right text-balance whitespace-pre-line max-w-[70%]">
              {seg.poenta}
            </p>
          </div>
        ))}
      </div>

      {imaSkrivenih && (
        <button
          type="button"
          onClick={() => setProsireno((v) => !v)}
          aria-expanded={prosireno}
          className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors"
        >
          {prosireno ? labelManje : labelJos} {prosireno ? "↑" : "↓"}
        </button>
      )}
    </>
  );
}
