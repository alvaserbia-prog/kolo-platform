"use client";

/**
 * Levak — gde ljudi otpadaju na putu od registracije do objavljenog oglasa.
 *
 * Grupisano po nedelji registracije (kohorta), uz zbirni red „ukupno". Koraci
 * se broje kao „da li je taj čovek to ikad uradio", pa se red nedelje dopunjava
 * i kasnije — prati se sudbina ljudi, ne nedeljni promet.
 *
 * Računanje je u `src/lib/levak.ts` (čiste funkcije, testovi), ovde je samo prikaz.
 */

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface Korak {
  korak: string;
  broj: number;
  prolaz: number | null;
}

interface Grupa {
  oznaka: string;
  koraci: Korak[];
  danaDoVerifikacije: number | null;
  danaDoPrvogOglasa: number | null;
}

function formatNedelja(oznaka: string): string {
  const d = new Date(`${oznaka}T00:00:00Z`);
  const kraj = new Date(d.getTime() + 6 * 24 * 60 * 60 * 1000);
  const dan = (x: Date) =>
    `${x.getUTCDate()}.${x.getUTCMonth() + 1}.`;
  return `${dan(d)}–${dan(kraj)}`;
}

export default function LevakTab() {
  const t = useTranslations("admin");
  const [grupe, setGrupe] = useState<Grupa[] | null>(null);
  const [aktivnostOd, setAktivnostOd] = useState<string | null>(null);
  const [izabrana, setIzabrana] = useState("ukupno");
  const [greska, setGreska] = useState(false);

  useEffect(() => {
    let otkazano = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/levak");
        if (!res.ok) throw new Error();
        const d = await res.json();
        if (otkazano) return;
        setGrupe(d.grupe);
        setAktivnostOd(d.aktivnostOd);
      } catch {
        if (!otkazano) setGreska(true);
      }
    })();
    return () => {
      otkazano = true;
    };
  }, []);

  if (greska) return <p className="text-sm text-kolo-danger">{t("levak_greska")}</p>;
  if (!grupe) return <p className="text-sm text-kolo-muted">{t("levak_ucitavanje")}</p>;

  const grupa = grupe.find((g) => g.oznaka === izabrana) ?? grupe[grupe.length - 1];
  const polazna = grupa.koraci[0]?.broj ?? 0;

  // Najveći pad u lancu — na njemu je čep, pa ga bojimo.
  let najgoriIndeks = -1;
  let najgoriPad = 0;
  grupa.koraci.forEach((k, i) => {
    if (i === 0 || k.prolaz === null) return;
    const pad = 100 - k.prolaz;
    if (pad > najgoriPad) {
      najgoriPad = pad;
      najgoriIndeks = i;
    }
  });

  return (
    <div className="space-y-5">
      <p className="text-sm text-kolo-muted">{t("levak_opis")}</p>

      {/* Izbor perioda: zbirno + poslednje nedelje registracije */}
      <div className="flex flex-wrap gap-2">
        {grupe
          .slice()
          .sort((a, b) => (a.oznaka === "ukupno" ? -1 : b.oznaka === "ukupno" ? 1 : 0))
          .map((g) => (
            <button
              key={g.oznaka}
              onClick={() => setIzabrana(g.oznaka)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                g.oznaka === grupa.oznaka
                  ? "bg-kolo-green-700 text-white"
                  : "bg-kolo-bg border border-kolo-border text-kolo-muted hover:bg-kolo-border"
              }`}
            >
              {g.oznaka === "ukupno" ? t("levak_ukupno") : formatNedelja(g.oznaka)}
            </button>
          ))}
      </div>

      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-kolo-border text-xs text-kolo-muted">
              <th className="text-left font-medium px-4 py-2.5">{t("levak_kolona_korak")}</th>
              <th className="text-right font-medium px-4 py-2.5 w-20">{t("levak_kolona_ljudi")}</th>
              <th className="text-right font-medium px-4 py-2.5 w-24">{t("levak_kolona_prolaz")}</th>
            </tr>
          </thead>
          <tbody>
            {grupa.koraci.map((k, i) => (
              <tr key={k.korak} className="border-b border-kolo-border last:border-0">
                <td className="px-4 py-2.5">
                  <span className="text-kolo-text">{t(`levak_k_${k.korak}`)}</span>
                  {/* Traka širine srazmerne polaznom broju — levak se vidi na prvi pogled */}
                  <span className="block mt-1 h-1.5 rounded-full bg-kolo-green-500/70" style={{
                    width: polazna > 0 ? `${Math.max(2, Math.round((k.broj / polazna) * 100))}%` : "2%",
                  }} />
                </td>
                <td className="px-4 py-2.5 text-right font-semibold text-kolo-text align-top">{k.broj}</td>
                <td
                  className={`px-4 py-2.5 text-right align-top ${
                    i === najgoriIndeks ? "text-kolo-danger font-semibold" : "text-kolo-muted"
                  }`}
                >
                  {k.prolaz === null ? "—" : `${k.prolaz}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border px-4 py-3">
          <p className="text-xs text-kolo-muted">{t("levak_dana_verifikacija")}</p>
          <p className="text-lg font-semibold text-kolo-text">
            {grupa.danaDoVerifikacije ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border px-4 py-3">
          <p className="text-xs text-kolo-muted">{t("levak_dana_oglas")}</p>
          <p className="text-lg font-semibold text-kolo-text">
            {grupa.danaDoPrvogOglasa ?? "—"}
          </p>
        </div>
      </div>

      {/* Dva koraka se čitaju iz dnevnika aktivnosti, koji ne seže pre ovog
          datuma — bez ove napomene bi se stare kohorte čitale kao „niko nije
          ni otvorio stranicu". */}
      {aktivnostOd && (
        <p className="text-xs text-kolo-muted">
          {t("levak_napomena_dnevnik", {
            datum: new Date(aktivnostOd).toLocaleDateString("sr-RS"),
          })}
        </p>
      )}
    </div>
  );
}
