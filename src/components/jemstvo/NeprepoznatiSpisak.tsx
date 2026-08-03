"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Pseudonim from "@/components/Pseudonim";

/**
 * Spisak za UO Fondacije: ljudi koji su objavili karticu, dali saglasnost za
 * poziv, a niko od članova ih nije prepoznao.
 *
 * Izolovanog čoveka ne odbijamo — član UO ga pozove, upozna se sa njim i, ako
 * oceni, verifikuje ga U SVOJE IME, kao član u lancu jemstva (redovna
 * verifikacija sa zida). Fondacija time ne postaje verifikator.
 *
 * Spisak se ne otvara sam: brojevi telefona se prikazuju tek na izričit klik, i
 * taj pristup se loguje na serveru.
 */
type Kandidat = {
  id: string;
  pseudonim: string;
  ime: string | null;
  prezime: string | null;
  godiste: number | null;
  mesto: string | null;
  nadimak: string | null;
  cimeSeBavi: string | null;
  telefon: string | null;
  odgovoreno: number;
  createdAt: string;
};

export default function NeprepoznatiSpisak() {
  const t = useTranslations("tablaJemstva");
  const [otvoren, setOtvoren] = useState(false);

  const { data: kandidati = [], isLoading } = useQuery({
    queryKey: ["jemstvo-neprepoznati"],
    enabled: otvoren,
    queryFn: async (): Promise<Kandidat[]> => {
      const res = await fetch("/api/admin/tabla-jemstva/neprepoznati");
      if (!res.ok) throw new Error("neprepoznati");
      const d = await res.json();
      return d.kandidati ?? [];
    },
  });

  if (!otvoren) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-kolo-text">{t("uo_naslov")}</p>
          <p className="text-sm text-kolo-muted mt-0.5">{t("uo_opis")}</p>
        </div>
        <button
          onClick={() => setOtvoren(true)}
          className="px-4 py-2 rounded-xl bg-kolo-bg border border-kolo-border text-kolo-muted text-sm font-semibold hover:bg-kolo-border transition-colors shrink-0"
        >
          {t("uo_dugme_prikazi")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-semibold text-kolo-text">{t("uo_naslov")}</p>
        <button
          onClick={() => setOtvoren(false)}
          className="text-xs text-kolo-muted hover:text-kolo-text transition-colors shrink-0"
        >
          {t("dugme_sakrij")}
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-kolo-muted">{t("ucitavanje")}</p>
      ) : kandidati.length === 0 ? (
        <p className="text-sm text-kolo-muted">{t("uo_prazno")}</p>
      ) : (
        <div className="space-y-2">
          {kandidati.map((k) => (
            <div key={k.id} className="rounded-xl border border-kolo-border p-3 text-sm">
              <p className="font-medium text-kolo-text">
                <Pseudonim>{[k.ime, k.prezime].filter(Boolean).join(" ") || k.pseudonim}</Pseudonim>
                {k.godiste && <span className="ml-2 font-normal text-kolo-muted">{k.godiste}.</span>}
              </p>
              <p className="text-xs text-kolo-muted mt-0.5">
                {[k.nadimak && `„${k.nadimak}"`, k.mesto, k.cimeSeBavi].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <a
                  href={`tel:${k.telefon}`}
                  className="font-semibold text-kolo-green-700 hover:underline"
                >
                  {k.telefon}
                </a>
                <span className="text-xs text-kolo-muted">
                  {t("uo_odgovoreno", { broj: k.odgovoreno })}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
