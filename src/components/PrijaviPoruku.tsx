"use client";

/**
 * Dugme „prijavi" uz poruku u Pričaonici.
 *
 * 🔴 **Samo soba ODRASLIH (odluka vlasnika, 04.09.2026).** Do tada je stajalo i u
 * dečjoj sobi; uklonjeno je i sa tog ekrana i sa rute, jer red čekanja u admin tabu
 * „Prijave" nema ko da rešava. Otud je otpao i prop `dete`, koji je posle slanja
 * dodavao uputstvo da se kaže roditelju.
 *
 * Prijava traži ŠIFRU sa zatvorene liste (`prijava-poruke-pravila.ts`), a slobodan
 * tekst samo uz „nešto drugo" — ko je izabrao šifru već je rekao šta prijavljuje.
 *
 * Prijava NE uklanja poruku. Uklanja je Fondacija, i tek posle odluke; ovde se samo
 * diže ruka. Zato posle slanja piše da je prijava poslata, a ne da je poruka
 * uklonjena — obećanje koje ekran ne može da ispuni gore je od ćutanja.
 *
 * 🔴 Veličina nije stvar ukusa (izmena 31.08.2026). Dugme je bilo `text-[10px]`
 * podvučeni sivi tekst bez ijednog piksela padinga — meta oko 12 × 30 px, dakle
 * šest puta manja od minimuma. Prop `malo` je uklonjen: nije postojala veličina
 * ispod ove koja bi bila ispravna.
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { kljucRazloga, MAX_OPIS, type RazlogKod } from "@/lib/prijava-poruke-pravila";

export default function PrijaviPoruku({
  porukaId,
  sifre,
}: {
  porukaId: string;
  sifre: RazlogKod[];
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

  /**
   * Posle slanja se ranije ispisivala jedna reč — „prijavljeno" — i ništa više.
   * Ishod se objavljuje (`role="status"`), inače ga čitač ekrana ne pročita, a
   * upravo je to trenutak u kome potvrda znači najviše.
   */
  if (poslato) {
    return (
      <span role="status" className="inline-block rounded-xl bg-kolo-green-100 px-3 py-2 text-sm text-kolo-green-800">
        {t("poslato")}
      </span>
    );
  }

  if (!otvoreno) {
    return (
      <button
        type="button"
        onClick={() => setOtvoreno(true)}
        className="meta-dete gap-1 rounded-full border border-kolo-border px-3 text-sm font-semibold text-kolo-muted transition hover:border-kolo-danger hover:text-kolo-danger"
      >
        {/* Zastavica: oblik sam ne nosi značenje — uz njega uvek stoji i reč. */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
          <path d="M4 21V4" />
          <path d="M4 4h13l-2 4 2 4H4" />
        </svg>
        {t("dugme")}
      </button>
    );
  }

  return (
    <div className="mt-1 rounded-xl border border-kolo-border bg-white p-3 text-left">
      <p className="text-base font-medium text-kolo-text">{t("naslov")}</p>
      <div className="mt-2 flex flex-wrap gap-2">
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
            className={`meta-dete rounded-full border px-4 text-sm ${
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
        <div className="mt-2 space-y-2">
          <label htmlFor={`prijava-opis-${porukaId}`} className="sr-only">
            {t("opis_placeholder")}
          </label>
          <textarea
            id={`prijava-opis-${porukaId}`}
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            rows={2}
            maxLength={MAX_OPIS}
            placeholder={t("opis_placeholder")}
            className="w-full rounded-xl border border-kolo-border px-3 py-2 text-base"
          />
          <button
            type="button"
            disabled={salje || opis.trim().length < 3}
            onClick={() => void posalji("OSTALO")}
            className="meta-dete rounded-xl bg-kolo-green-700 px-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {t("posalji")}
          </button>
        </div>
      )}

      {greska && (
        <p role="alert" className="mt-2 text-sm text-kolo-danger">
          {greska}
        </p>
      )}

      <button
        type="button"
        onClick={() => { setOtvoreno(false); setKod(null); setOpis(""); setGreska(""); }}
        className="meta-dete mt-1 px-2 text-sm text-kolo-muted underline"
      >
        {t("odustani")}
      </button>
    </div>
  );
}
