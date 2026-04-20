"use client";
import { useState } from "react";

const pitanja = [
  {
    pitanje: "Kako se rešavaju sporovi između članova?",
    odgovor:
      "Postoje tri nivoa. Prvo: direktan razgovor između strana — sistem beleži sve transakcije, pa se greška lako identifikuje. Drugo: posredovanje zadruge — starešina ili savet zadruge može da interveniše i predloži rešenje. Treće: prigovor Fondaciji — svaki verifikovani član može podneti formalni prigovor koji Fondacija mora da reši u roku od 30 dana. Ako ništa od toga ne zadovolji, pravo na sudsku zaštitu ostaje neotuđivo — nadležan je Osnovni sud u Somboru.",
  },
  {
    pitanje: "Kako izlazim iz sistema?",
    odgovor:
      "Brisanje naloga je uvek dostupno iz podešavanja profila. Pre brisanja, POEN koji imaš možeš preneti drugom članu ili ga vratiti Banci. ZRNO se automatski prodaje Banci po tekućem kursu. Lični podaci se anonimizuju — tvoje ime se briše, ali transakcioni zapisi ostaju jer su deo kolektivne evidencije zajednice (sa anonimizovanim pseudonimom). Precizna pravila su opisana u Politici privatnosti i Uslovima korišćenja.",
  },
  {
    pitanje: "Kakav je odnos prema porezu i fiskalizaciji?",
    odgovor:
      "POEN nije novac u pravnom smislu — nije zakonsko sredstvo plaćanja, nije elektronski novac po Zakonu o platnim uslugama, nije digitalna imovina po Zakonu o digitalnoj imovini. Svaka razmena je pravno konstruisana kao donacija dobra ili usluge mreži (donator → Fondacija) i emisija POEN-a kao evidencija tog doprinosa — to su dva odvojena akta. Ne postoji prodaja, ne postoji trampa, ne postoji PDV, ne postoji obaveza fiskalnog računa. Fondacija je dokumentaciju proaktivno podnela Poreskoj upravi i zatražila zvanično mišljenje.",
  },
  {
    pitanje: "Šta sprečava zloupotrebu od strane admina ili osnivača?",
    odgovor:
      "Tri strukturne zaštite. Prva: zero-sum princip — svaka emisija POEN-a uvećava minus Banke, a Banka ne može da emituje više od 10% dnevnog opticaja. Nije moguće stvoriti POEN iz ničega i rasporediti ga mimo dozvoljenih programa. Druga: javni audit log — sve admin akcije se beleže i biće javno vidljive. Treća: Gornje Kolo — kada donacije premaše operativne troškove, aktivira se skupština verifikovanih članova koja glasa kroz ZRNO i ima nadležnost nad Fondacijom. Osnivač time postaje izvršni, ne suvereni organ.",
  },
  {
    pitanje: "Šta se dešava kada se neko ne pridržava dogovora?",
    odgovor:
      "Sistem ima kolektivno pamćenje — svaka transakcija je trajno zabeležena sa pseudonimom. Loše ponašanje ostaje vidljivo. Zadruga može uskratiti pristup nekim uslugama u okviru svoje autonomije. Fondacija može suspendovati nalog ili isključiti korisnika iz sistema ako su prekršena Pravila. Isključen korisnik gubi pravo korišćenja platforme, ali POEN koji je zaradio ostaje zabeležen kao istorijski podatak.",
  },
  {
    pitanje: "Kako zadruga postaje deo KOLO sistema?",
    odgovor:
      "Potrebno je minimum 5 verifikovanih članova KOLO platforme (4 pored tebe). Inicijator podnosi zahtev za osnivanje kroz platformu, uz kratki opis zadruge. Fondacija pregleda zahtev i odobrava ga. Činom osnivanja, KOLO Banka emituje 50.000 POEN na račun zadruge kao startni kapital. Zadruga je od tog trenutka autonomna — određuje sopstvene programe, prihvata ili odbija pristupnice, upravlja projektima.",
  },
];

export default function FaqAkordeon() {
  const [otvoren, setOtvoren] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {pitanja.map((item, i) => (
        <div key={i} className="bg-white rounded-2xl card-shadow overflow-hidden">
          <button
            onClick={() => setOtvoren(otvoren === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-kolo-bg transition-colors"
          >
            <span className="font-semibold text-kolo-text text-sm leading-snug">
              {item.pitanje}
            </span>
            <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${otvoren === i ? "bg-kolo-green-700 text-white" : "bg-kolo-green-100 text-kolo-green-700"}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d={otvoren === i ? "M2 8L6 4L10 8" : "M2 4L6 8L10 4"}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          {otvoren === i && (
            <div className="px-5 pb-5">
              <div className="border-t border-kolo-border pt-4">
                <p className="text-sm text-kolo-muted leading-relaxed" style={{ lineHeight: "1.75" }}>
                  {item.odgovor}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
