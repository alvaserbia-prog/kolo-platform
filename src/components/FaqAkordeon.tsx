"use client";
import { useState } from "react";

const pitanja = [
  {
    pitanje: "Kako se rešavaju sporovi između članova?",
    odgovor:
      "Pravilnik predviđa trostepeni mehanizam. Nivo 1: posredovanje unutar Kruga — sistem beleži sve transakcije, pa se greška lako identifikuje, a članovi Kruga ili ovlašćena lica mogu pomoći u predlaganju rešenja. Nivo 2: prigovor Fondaciji — svaki verifikovani član može podneti formalni prigovor koji Fondacija mora da reši u roku od 30 dana. Nivo 3: žalba Gornjem Kolu — kada se aktivira skupština verifikovanih članova. Pravo na sudsku zaštitu ostaje neotuđivo — nadležan je Osnovni sud u Somboru.",
  },
  {
    pitanje: "Kako izlazim iz sistema?",
    odgovor:
      "Brisanje naloga je uvek dostupno iz podešavanja profila. Pre brisanja, POEN koji imaš možeš preneti drugom članu ili ga vratiti Protokolu. ZRNO se automatski prodaje Protokolu po tekućem kursu. Lični podaci se anonimizuju — tvoje ime se briše, ali transakcioni zapisi ostaju jer su deo kolektivne evidencije sistema (sa anonimizovanim pseudonimom). Doprinosi pod licencama zajedničkog dobra (kod, sadržaj) imaju trajnu atribuciju i ne anonimizuju se. Precizna pravila opisana su u Politici privatnosti i Uslovima korišćenja.",
  },
  {
    pitanje: "Kakav je odnos prema porezu i fiskalizaciji?",
    odgovor:
      "POEN nije novac u pravnom smislu — nije zakonsko sredstvo plaćanja, nije elektronski novac po Zakonu o platnim uslugama, nije digitalna imovina po Zakonu o digitalnoj imovini, niti potraživanje prema Fondaciji. Pravno se konstruiše kao doprinos zajedničkom dobru i emisija POEN-a kao evidencija tog doprinosa — to su dva odvojena akta. Ne postoji prodaja, ne postoji trampa, ne postoji PDV, ne postoji obaveza fiskalnog računa. Fondacija je dokumentaciju proaktivno podnela Poreskoj upravi i zatražila zvanično mišljenje.",
  },
  {
    pitanje: "Šta sprečava zloupotrebu od strane admina ili osnivača?",
    odgovor:
      "Tri strukturne zaštite. Prva: zero-sum princip — svaka emisija POEN-a uvećava minus Protokola, a kroz Socijalne i Operativni program ne može se emitovati više od 10% dnevnog opticaja. Nije moguće stvoriti POEN iz ničega i rasporediti ga mimo dozvoljenih programa. Druga: javni audit log — sve admin akcije se beleže i biće javno vidljive. Treća: Gornje Kolo — aktivira se kada minus Protokola dostigne prag od −1.000.000 POEN; tada skupština verifikovanih članova glasa kroz ZRNO i ima nadležnost nad ključnim odlukama. Osnivač time postaje izvršni, ne suvereni organ.",
  },
  {
    pitanje: "Šta se dešava kada se neko ne pridržava dogovora?",
    odgovor:
      "Sistem ima kolektivno pamćenje — svaka transakcija je trajno zabeležena sa pseudonimom. Loše ponašanje ostaje vidljivo. Krug može uskratiti pristup unutrašnjim aktivnostima u okviru sopstvenih internih pravila. Fondacija može suspendovati nalog (najviše 30 dana, uz javno obrazloženje) ili isključiti korisnika iz sistema ako su prekršena Pravila. Isključen korisnik gubi pravo korišćenja platforme, ali POEN koji je zaradio ostaje zabeležen kao istorijski podatak.",
  },
  {
    pitanje: "Kako Krug postaje deo KOLO sistema?",
    odgovor:
      "Potrebno je najmanje 5 verifikovanih članova KOLO platforme (4 pored tebe) koji se okupljaju oko zajedničkog interesa. Inicijator podnosi zahtev za osnivanje kroz platformu, uz opis interesa, interna pravila i ovlašćena lica (1–3). Fondacija proverava formalnu ispravnost prijave i evidentira Krug. Činom osnivanja, KOLO Protokol emituje 50.000 POEN na zajednički račun Kruga kao startni kapital. Krug nema pravni subjektivitet — ovlašćena lica imaju isključivo tehničku funkciju iniciranja transakcija sa zajedničkog računa. Svaki Krug autonomno donosi sopstvena interna pravila, prihvata ili odbija pristupnice i pokreće sopstvene aktivnosti.",
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
            <span className="font-semibold text-kolo-text text-base leading-snug">
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
                <p className="text-base text-kolo-muted leading-relaxed" style={{ lineHeight: "1.75" }}>
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
