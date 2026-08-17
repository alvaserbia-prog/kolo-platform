"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import DatumRodjenja from "@/components/DatumRodjenja";
import { UZRAST_MIN, UZRAST_PUNOLETSTVO } from "@/lib/deca-pravila";

type Poziv = {
  pseudonim: string;
  istekao: boolean;
  iskoriscen: boolean;
  odbijen: boolean;
  brisanjeDo: string;
};

/**
 * Stranica na koju vodi link iz poruke roditelju (Modul Deca, čl. 4b).
 *
 * Tri radnje, kao i u poruci: **preuzmi nalog**, **ovo nije moje dete**, **obriši
 * nalog**. Preuzimanje traži prijavu (veza mora da stoji na nečijem nalogu) i datum
 * rođenja deteta; druge dve rade bez prijave — onaj ko drži link je jedina osoba
 * koju sistem u tom trenutku može da pita.
 *
 * 🔴 Na stranici stoji SAMO pseudonim deteta. Adresu je uneo neko treći i niko je
 * nije proverio, pa svaki dodatni podatak može da završi kod osobe koja sa detetom
 * nema veze.
 */
export default function DetePozivPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const t = useTranslations("detePoziv");
  const router = useRouter();

  const [poziv, setPoziv] = useState<Poziv | null>(null);
  const [ucitava, setUcitava] = useState(true);
  const [datum, setDatum] = useState("");
  const [greska, setGreska] = useState("");
  const [radi, setRadi] = useState(false);
  const [ishod, setIshod] = useState<"preuzet" | "odbijen" | "obrisan" | null>(null);

  // Granice se računaju iz istih konstanti kao na serveru — polje ne prihvata
  // datum koji bi server odbio.
  const danas = new Date();
  const najranije = new Date(danas.getFullYear() - UZRAST_PUNOLETSTVO, danas.getMonth(), danas.getDate() + 1)
    .toISOString()
    .slice(0, 10);
  const najkasnije = new Date(danas.getFullYear() - UZRAST_MIN, danas.getMonth(), danas.getDate())
    .toISOString()
    .slice(0, 10);

  const ucitaj = useCallback(async () => {
    setUcitava(true);
    try {
      const res = await fetch(`/api/deca/poziv/${token}`, { cache: "no-store" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? t("nepostoji"));
      setPoziv(await res.json());
      setGreska("");
    } catch (e) {
      setGreska(e instanceof Error ? e.message : t("nepostoji"));
    } finally {
      setUcitava(false);
    }
  }, [token, t]);

  useEffect(() => {
    void ucitaj();
  }, [ucitaj]);

  async function akcija(vrsta: "preuzmi" | "odbij" | "obrisi") {
    setGreska("");
    setRadi(true);
    try {
      const res = await fetch(`/api/deca/poziv/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ akcija: vrsta, datumRodjenja: datum || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        // Nije prijavljen — preuzimanje traži nalog. Vraća se ovde posle prijave.
        router.push(`/login?callbackUrl=${encodeURIComponent(`/dete-poziv/${token}`)}`);
        return;
      }
      if (!res.ok) throw new Error(data?.error ?? t("greska"));
      setIshod(vrsta === "preuzmi" ? "preuzet" : vrsta === "odbij" ? "odbijen" : "obrisan");
    } catch (e) {
      setGreska(e instanceof Error ? e.message : t("greska"));
    } finally {
      setRadi(false);
    }
  }

  const okvir = "w-full max-w-md rounded-2xl border border-kolo-border bg-white p-6 card-shadow";

  if (ucitava) {
    return <div className={okvir}><p className="text-sm text-kolo-muted">{t("ucitavanje")}</p></div>;
  }

  if (ishod) {
    return (
      <div className={`${okvir} space-y-4`}>
        <h1 className="text-xl font-bold text-kolo-text">{t(`ishod_${ishod}_naslov`)}</h1>
        <p className="text-sm text-kolo-muted">{t(`ishod_${ishod}_opis`)}</p>
        {ishod === "preuzet" && (
          <Link
            href="/profil"
            className="block w-full rounded-xl bg-kolo-green-700 py-3 text-center text-sm font-semibold text-white"
          >
            {t("na_profil")}
          </Link>
        )}
      </div>
    );
  }

  if (!poziv) {
    return <div className={okvir}><p className="text-sm text-kolo-danger">{greska || t("nepostoji")}</p></div>;
  }

  if (poziv.iskoriscen) {
    return (
      <div className={`${okvir} space-y-3`}>
        <h1 className="text-xl font-bold text-kolo-text">{t("vec_preuzet_naslov")}</h1>
        <p className="text-sm text-kolo-muted">{t("vec_preuzet_opis", { pseudonim: poziv.pseudonim })}</p>
      </div>
    );
  }

  return (
    <div className={`${okvir} space-y-5`}>
      <div>
        <h1 className="text-xl font-bold text-kolo-text">{t("naslov")}</h1>
        <p className="mt-1 text-sm text-kolo-muted">
          {t("opis", { pseudonim: poziv.pseudonim })}
        </p>
      </div>

      {poziv.istekao ? (
        <p className="rounded-xl bg-kolo-bg px-4 py-3 text-sm text-kolo-muted">{t("istekao")}</p>
      ) : (
        <>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-kolo-text">
              {t("datum_rodjenja")}
            </label>
            <DatumRodjenja
              value={datum}
              onChange={setDatum}
              min={najranije}
              max={najkasnije}
              porukaGreske={t("datum_raspon")}
            />
            {/* Datum se posle upisa NE menja (čl. 7) — to mora da piše pre unosa, ne posle. */}
            <p className="mt-1 text-xs text-kolo-muted">{t("datum_opis")}</p>
          </div>

          <button
            onClick={() => akcija("preuzmi")}
            disabled={radi || !datum}
            className="w-full rounded-xl bg-kolo-green-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-kolo-green-500 disabled:opacity-50"
          >
            {t("dugme_preuzmi")}
          </button>

          {/* 🔴 Uputstvo za roditelja koji NIJE na platformi. Dugme iznad ga vodi
              na prijavu, a on nalog nema — bez ova tri koraka poruka traži radnju
              koju čovek ne ume da izvrši. Drugi i treći korak se ne dešavaju istog
              dana, ali dete zbog toga nije zaustavljeno. */}
          <div className="rounded-xl bg-kolo-bg px-4 py-3 text-xs text-kolo-muted space-y-1">
            <p className="font-semibold text-kolo-text">{t("nisam_clan_naslov")}</p>
            <p>{t("nisam_clan_korak1")}</p>
            <p>{t("nisam_clan_korak2")}</p>
            <p>{t("nisam_clan_korak3")}</p>
            <p className="pt-1">{t("nisam_clan_poen")}</p>
          </div>

          <div className="space-y-2 border-t border-kolo-border pt-4">
            <p className="text-xs text-kolo-muted">{t("nije_moje_uvod")}</p>
            <button
              onClick={() => akcija("odbij")}
              disabled={radi}
              className="w-full rounded-xl border border-kolo-border py-2.5 text-sm font-medium text-kolo-text transition-colors hover:bg-kolo-bg disabled:opacity-50"
            >
              {t("dugme_nije_moje")}
            </button>
            <button
              onClick={() => {
                if (confirm(t("potvrda_brisanja"))) void akcija("obrisi");
              }}
              disabled={radi}
              className="w-full rounded-xl border border-kolo-danger py-2.5 text-sm font-medium text-kolo-danger transition-colors hover:bg-kolo-danger-light disabled:opacity-50"
            >
              {t("dugme_obrisi")}
            </button>
          </div>
        </>
      )}

      {greska && (
        <p className="rounded-lg bg-kolo-danger-light px-3 py-2 text-sm text-kolo-danger">{greska}</p>
      )}
    </div>
  );
}
