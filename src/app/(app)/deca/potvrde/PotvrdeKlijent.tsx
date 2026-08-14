"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ROK_POTVRDE_DANA, danaDoIsteka } from "@/lib/deca-pravila";

type Potvrda = { id: string; roditelj: string; godine: number; rokDo: string };

export default function PotvrdeKlijent() {
  const t = useTranslations("deca");
  const [potvrde, setPotvrde] = useState<Potvrda[] | null>(null);
  const [greska, setGreska] = useState<string | null>(null);

  const ucitaj = useCallback(async () => {
    try {
      const res = await fetch("/api/deca/potvrde", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setPotvrde((await res.json()).potvrde);
    } catch {
      setGreska(t("greska_ucitavanje"));
    }
  }, [t]);

  useEffect(() => {
    void ucitaj();
  }, [ucitaj]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-kolo-text">{t("potvrde_naslov")}</h1>
        <p className="mt-1 text-sm text-kolo-muted">{t("potvrde_opis", { dana: ROK_POTVRDE_DANA })}</p>
      </div>

      {greska && <p className="text-sm text-kolo-danger">{greska}</p>}
      {potvrde === null && !greska && <p className="text-sm text-kolo-muted">{t("ucitavanje")}</p>}
      {potvrde?.length === 0 && <p className="text-sm text-kolo-muted">{t("potvrde_prazno")}</p>}

      {potvrde?.map((p) => (
        <Kartica key={p.id} potvrda={p} onGotovo={ucitaj} />
      ))}
    </div>
  );
}

function Kartica({ potvrda, onGotovo }: { potvrda: Potvrda; onGotovo: () => void }) {
  const t = useTranslations("deca");
  const [osporava, setOsporava] = useState(false);
  const [obrazlozenje, setObrazlozenje] = useState("");
  const [radi, setRadi] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const preostalo = danaDoIsteka(new Date(potvrda.rokDo), new Date());

  async function posalji(odgovor: "POTVRDIO" | "OSPORIO") {
    setRadi(true);
    setGreska(null);
    try {
      const res = await fetch(`/api/deca/potvrde/${potvrda.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ odgovor, obrazlozenje }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.greska ?? t("greska_slanje"));
      onGotovo();
    } catch (e) {
      setGreska(e instanceof Error ? e.message : t("greska_slanje"));
    } finally {
      setRadi(false);
    }
  }

  return (
    <section className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-medium text-kolo-text">
        {t("pitanje", { pseudonim: potvrda.roditelj, godine: potvrda.godine })}
      </h2>
      <p className="mt-2 text-sm text-kolo-muted">{t("pitanje_opis", { pseudonim: potvrda.roditelj })}</p>
      <p className="mt-1 text-sm font-medium text-kolo-text">{t("rok_preostalo", { dana: preostalo })}</p>

      {greska && <p className="mt-2 text-sm text-kolo-danger">{greska}</p>}

      {!osporava ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={radi}
            onClick={() => posalji("POTVRDIO")}
            className="rounded-xl bg-kolo-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-kolo-green-800 disabled:opacity-60"
          >
            {t("dugme_ima")}
          </button>
          <button
            type="button"
            disabled={radi}
            onClick={() => setOsporava(true)}
            className="rounded-xl border border-kolo-border px-4 py-2 text-sm font-medium text-kolo-text transition hover:bg-kolo-bg disabled:opacity-60"
          >
            {t("dugme_nema")}
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          <label className="block text-sm">
            <span className="font-medium text-kolo-text">{t("obrazlozenje_naslov")}</span>
            <textarea
              className="mt-1 w-full rounded-xl border border-kolo-border px-3 py-2 text-sm"
              rows={3}
              maxLength={1000}
              value={obrazlozenje}
              onChange={(e) => setObrazlozenje(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={radi || !obrazlozenje.trim()}
              onClick={() => posalji("OSPORIO")}
              className="rounded-xl bg-kolo-danger px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50"
            >
              {t("dugme_posalji")}
            </button>
            <button
              type="button"
              onClick={() => setOsporava(false)}
              className="rounded-xl border border-kolo-border px-4 py-2 text-sm font-medium text-kolo-text transition hover:bg-kolo-bg"
            >
              {t("dugme_odustani")}
            </button>
          </div>
        </div>
      )}

      {/* 🔴 „Nemam saznanja" NIJE dugme koje šalje odgovor: po pravilniku je to isto
          što i ćutanje, pa bi čovek mislio da je posao završio a potvrda bi mu ipak
          pala. Zato ovde stoji samo objašnjenje šta se dešava ako se ne izjasni. */}
      <p className="mt-4 border-t border-kolo-border pt-3 text-xs text-kolo-muted">
        {t("ako_ne_znas")}
      </p>
    </section>
  );
}
