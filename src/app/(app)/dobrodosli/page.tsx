"use client";

/**
 * /dobrodosli — kratak onboarding za nove korisnike.
 * Prikazuje se jednom, odmah posle registracije (umesto direktnog bacanja na QR).
 * Kasnije dostupan iz "?" u headeru.
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Korak {
  oznaka: string;
  naslov: string;
  pasusi: string[];
}

const KORACI: Korak[] = [
  {
    oznaka: "Dobrodošli",
    naslov: "Dobrodošao/la u KOLO",
    pasusi: [
      "KOLO je zajednica zasnovana na uzajamnosti i doprinosu — ne na novcu.",
      "Ovde se beleži šta doprinosiš i šta razmenjuješ sa drugima, a poverenje se gradi tako što te ljudi koji te poznaju potvrde kao stvarnu osobu.",
      "Provešćemo te kroz osnovno za 30 sekundi.",
    ],
  },
  {
    oznaka: "Šta je POEN",
    naslov: "Šta je POEN",
    pasusi: [
      "POEN je zapis tvog doprinosa zajednici — kao upis u knjigu, a ne novac u novčaniku.",
      "Nije novac, ne kupuje se i ne menja se za dinare, i nema vrednost van sistema. Njime se evidentira ono što uradiš, daš ili razmeniš unutar KOLO.",
      "Ne moraš ništa da uplatiš da bi učestvovao.",
    ],
  },
  {
    oznaka: "Verifikacija",
    naslov: "Kako te mreža prihvata",
    pasusi: [
      "Da bi dobio pun pristup, treba da te potvrdi neko ko je već u KOLO i ko te lično poznaje — bez ijednog dokumenta. To zovemo lanac jemstva.",
      "Poznaješ nekog u KOLO? Pokaži mu svoj kod i potvrdiće te za par sekundi.",
      "Ne poznaješ nikog? Predstavi se mreži na Tabli zahteva za jemstvo — tu te neko može upoznati i potvrditi.",
    ],
  },
  {
    oznaka: "Šta možeš odmah",
    naslov: "Šta možeš odmah",
    pasusi: [
      "I pre verifikacije možeš da: razgledaš ponudu na Pijaci, čitaš vesti Fondacije i pratiš zajednicu.",
      "Posle verifikacije se otključava sve ostalo — objava oglasa, poruke, pisanje u zajednici i učešće u sistemu.",
      "Spreman/na?",
    ],
  },
];

export default function DobrodosliPage() {
  const router = useRouter();
  const [korak, setKorak] = useState(0);

  // Jednokratni flag iz registracije/OAuth-a — očisti čim se welcome prikaže
  useEffect(() => {
    try { sessionStorage.removeItem("kolo-welcome"); } catch { /* nedostupan */ }
  }, []);

  const trenutni = KORACI[korak];
  const prvi = korak === 0;
  const poslednji = korak === KORACI.length - 1;

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      {/* Preskoči */}
      <div className="flex justify-end">
        <button
          onClick={() => router.push("/sistem")}
          className="text-sm text-kolo-muted hover:text-kolo-text transition-colors"
        >
          Preskoči
        </button>
      </div>

      {/* Indikator koraka */}
      <div className="flex items-center justify-center gap-2">
        {KORACI.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === korak ? "w-8 bg-kolo-green-500" : "w-2 bg-kolo-border"
            }`}
          />
        ))}
      </div>

      {/* Kartica */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-7 md:p-9">
        <p className="text-xs font-semibold uppercase tracking-wider text-kolo-green-700">
          {`Korak ${korak + 1} / ${KORACI.length} · ${trenutni.oznaka}`}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-kolo-text">{trenutni.naslov}</h1>
        <div className="mt-4 space-y-3">
          {trenutni.pasusi.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-kolo-muted">
              {p}
            </p>
          ))}
        </div>

        {/* Završni CTA-ovi na poslednjem koraku */}
        {poslednji && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/verifikacija")}
              className="flex-1 px-4 py-3 bg-kolo-green-700 hover:bg-kolo-green-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Poznajem nekog → pokaži kod
            </button>
            <button
              onClick={() => router.push("/tabla-jemstva")}
              className="flex-1 px-4 py-3 bg-white border border-kolo-green-700 text-kolo-green-700 hover:bg-kolo-green-100 text-sm font-semibold rounded-xl transition-colors"
            >
              Ne poznajem nikog → Tabla jemstva
            </button>
          </div>
        )}
      </div>

      {/* Navigacija */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setKorak((k) => Math.max(0, k - 1))}
          disabled={prvi}
          className="px-4 py-2 text-sm font-medium text-kolo-muted hover:text-kolo-text disabled:opacity-0 transition-colors"
        >
          ← Nazad
        </button>
        {!poslednji && (
          <button
            onClick={() => setKorak((k) => Math.min(KORACI.length - 1, k + 1))}
            className="px-5 py-2.5 bg-kolo-green-700 hover:bg-kolo-green-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Dalje →
          </button>
        )}
      </div>
    </div>
  );
}
