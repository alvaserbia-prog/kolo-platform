"use client";

/**
 * Dugme „prijavi" uz poruku u Pričaonici — zajedničko za dečju sobu i sobu odraslih.
 *
 * Prijava traži ŠIFRU sa zatvorene liste (`prijava-poruke-pravila.ts`), a slobodan
 * tekst samo uz „nešto drugo". Razlog: sedmogodišnjak neće napisati obrazloženje,
 * ali ume da pritisne dugme — a obrazac (mamljenje, laž o uzrastu) se bez šifre ne
 * može prepoznati kroz više prijava.
 *
 * Prijava NE uklanja poruku. Uklanja je Fondacija, i tek posle odluke; ovde se samo
 * diže ruka. Zato posle slanja piše da je prijava poslata, a ne da je poruka
 * uklonjena — obećanje koje ekran ne može da ispuni gore je od ćutanja.
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { kljucRazloga, MAX_OPIS, type RazlogKod } from "@/lib/prijava-poruke-pravila";

export default function PrijaviPoruku({
  porukaId,
  sifre,
  malo,
}: {
  porukaId: string;
  sifre: RazlogKod[];
  /** Sitniji prikaz, za gustu listu poruka. */
  malo?: boolean;
}) {
  const t = useTranslations("prijavaPoruke");
  const [otvoreno, setOtvoreno] = useState(false);
  const [kod, setKod] = useState<RazlogKod | null>(null);
  const [opis, setOpis] = useState("");
  const [salje, setSalje] = useState(false);
  const [poslato, setPoslato] = useState(false);
  const [greska, setGreska] = useState("");

  async function posalji(izabran: RazlogKod) {
    setSalje(true);
    setGreska("");
    try {
      const res = await fetch(`/api/chat/${porukaId}/prijavi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razlogKod: izabran, opis: opis.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setGreska(data.error ?? t("greska"));
        return;
      }
      setPoslato(true);
      setOtvoreno(false);
    } catch {
      setGreska(t("greska"));
    } finally {
      setSalje(false);
    }
  }

  if (poslato) {
    return <span className={`${malo ? "text-[10px]" : "text-[11px]"} text-kolo-muted`}>{t("poslato")}</span>;
  }

  if (!otvoreno) {
    return (
      <button
        type="button"
        onClick={() => setOtvoreno(true)}
        className={`${malo ? "text-[10px]" : "text-[11px]"} text-kolo-muted underline hover:text-kolo-danger`}
      >
        {t("dugme")}
      </button>
    );
  }

  return (
    <div className="mt-1 rounded-xl border border-kolo-border bg-white p-2 text-left">
      <p className="text-xs font-medium text-kolo-text">{t("naslov")}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {sifre.map((s) => (
          <button
            key={s}
            type="button"
            disabled={salje}
            onClick={() => {
              setKod(s);
              // „Nešto drugo" traži rečenicu — bez nje prijava ne kaže ništa, pa je
              // server odbija. Ostale šifre same nose podatak i idu odmah.
              if (s !== "OSTALO") void posalji(s);
            }}
            className={`rounded-full border px-2.5 py-1 text-[11px] ${
              kod === s
                ? "border-kolo-green-700 bg-kolo-green-700 text-white"
                : "border-kolo-border text-kolo-text"
            } disabled:opacity-50`}
          >
            {t(kljucRazloga(s))}
          </button>
        ))}
      </div>

      {kod === "OSTALO" && (
        <div className="mt-2 space-y-1.5">
          <textarea
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            rows={2}
            maxLength={MAX_OPIS}
            placeholder={t("opis_placeholder")}
            className="w-full rounded-xl border border-kolo-border px-2 py-1.5 text-xs"
          />
          <button
            type="button"
            disabled={salje || opis.trim().length < 3}
            onClick={() => void posalji("OSTALO")}
            className="rounded-xl bg-kolo-green-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            {t("posalji")}
          </button>
        </div>
      )}

      {greska && <p className="mt-1.5 text-xs text-kolo-danger">{greska}</p>}

      <button
        type="button"
        onClick={() => { setOtvoreno(false); setKod(null); setOpis(""); setGreska(""); }}
        className="mt-1.5 text-[11px] text-kolo-muted underline"
      >
        {t("odustani")}
      </button>
    </div>
  );
}
