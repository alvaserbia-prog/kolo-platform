"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Dete = {
  id: string;
  pseudonim: string;
  avatar: string | null;
  godine: number | null;
  clanOd: string;
  balans: number;
  dozvolaOdrasli: boolean;
};

type Oglas = {
  id: string;
  naslov: string;
  cena: number | null;
  cenaTip: string;
  imaSliku: boolean;
};

export default function DeteProfil({ dete, oglasi }: { dete: Dete; oglasi: Oglas[] }) {
  const t = useTranslations("deca");
  const router = useRouter();
  const [dozvola, setDozvola] = useState(dete.dozvolaOdrasli);
  const [radi, setRadi] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const [skinuti, setSkinuti] = useState<Set<string>>(new Set());

  async function prebaciDozvolu() {
    setRadi(true);
    setGreska(null);
    const nova = !dozvola;
    try {
      const res = await fetch(`/api/deca/${dete.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dozvolaOdrasli: nova }),
      });
      if (!res.ok) throw new Error();
      setDozvola(nova);
    } catch {
      setGreska(t("greska_slanje"));
    } finally {
      setRadi(false);
    }
  }

  async function ukloniOglas(oglasId: string) {
    if (!confirm(t("potvrdi_uklanjanje"))) return;
    try {
      const res = await fetch(`/api/deca/${dete.id}/oglas/${oglasId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSkinuti((s) => new Set(s).add(oglasId));
    } catch {
      setGreska(t("greska_slanje"));
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Zaglavlje — isto kao na svakom drugom profilu. */}
      <section className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {dete.avatar ? (
            <Image src={dete.avatar} alt="" width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-kolo-bg text-xl font-semibold text-kolo-muted">
              {dete.pseudonim.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-kolo-text">{dete.pseudonim}</h1>
            <p className="text-sm text-kolo-muted">
              <span className="mr-2 inline-flex items-center rounded-full bg-kolo-bg px-2 py-0.5 text-xs font-medium text-kolo-muted">
                {t("status_dete")}
              </span>
              {dete.godine !== null && t("godina", { broj: dete.godine })}
            </p>
          </div>
          <p className="ml-auto shrink-0 text-right text-lg font-semibold tabular-nums text-kolo-text">
            {dete.balans.toLocaleString("sr-RS")}
            <span className="ml-1 text-xs font-normal text-kolo-muted">POEN</span>
          </p>
        </div>
      </section>

      {greska && <p className="text-sm text-kolo-danger">{greska}</p>}

      {/* Prekidač iz čl. 10 st. 2 — jedina saglasnost koju roditelj daje posle
          otvaranja naloga. Stoji na vrhu, jer menja krug ljudi sa kojima dete
          sme da razgovara. */}
      <section className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-semibold text-kolo-text">{t("prekidac_naslov")}</h2>
            <p className="mt-1 text-sm text-kolo-muted">{t("prekidac_opis")}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={dozvola}
            aria-label={t("prekidac_naslov")}
            disabled={radi}
            onClick={prebaciDozvolu}
            className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${
              dozvola ? "bg-kolo-green-700" : "bg-kolo-border"
            } disabled:opacity-60`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                dozvola ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Oglasi — jedino što roditelj može da ukloni (čl. 10 st. 1). */}
      <section className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-kolo-text">{t("oglasi_naslov")}</h2>
        {oglasi.length === 0 ? (
          <p className="mt-2 text-sm text-kolo-muted">{t("oglasi_prazno")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {oglasi.map((o) => (
              <li
                key={o.id}
                className={`flex items-center justify-between gap-3 rounded-xl border border-kolo-border px-4 py-3 ${
                  skinuti.has(o.id) ? "opacity-50" : ""
                }`}
              >
                <Link href={`/pijaca/${o.id}`} className="min-w-0 flex-1 truncate text-sm text-kolo-text hover:underline">
                  {o.naslov}
                </Link>
                {skinuti.has(o.id) ? (
                  <span className="shrink-0 text-xs text-kolo-muted">{t("oglas_uklonjen")}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => ukloniOglas(o.id)}
                    className="shrink-0 rounded-lg border border-kolo-border px-3 py-1.5 text-xs font-medium text-kolo-danger transition hover:bg-kolo-bg"
                  >
                    {t("dugme_ukloni")}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-kolo-muted">{t("oglasi_napomena")}</p>
      </section>

      <BrisanjeNaloga deteId={dete.id} pseudonim={dete.pseudonim} onGotovo={() => router.push("/profil")} />
    </div>
  );
}

/**
 * Brisanje naloga deteta (čl. 17). Traži da roditelj OTKUCA pseudonim — klik ne sme
 * da promaši red u spisku, a radnja poništava sav POEN i uklanja sve oglase.
 * Posledica piše na samoj potvrdi, ne sitnim slovima ispod.
 */
function BrisanjeNaloga({
  deteId,
  pseudonim,
  onGotovo,
}: {
  deteId: string;
  pseudonim: string;
  onGotovo: () => void;
}) {
  const t = useTranslations("deca");
  const [otvoreno, setOtvoreno] = useState(false);
  const [uneto, setUneto] = useState("");
  const [radi, setRadi] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);

  async function obrisi() {
    setRadi(true);
    setGreska(null);
    try {
      const res = await fetch(`/api/deca/${deteId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudonim: uneto }),
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
    <section className="rounded-2xl border border-kolo-danger/30 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-kolo-danger">{t("brisanje_naslov")}</h2>
      {!otvoreno ? (
        <button
          type="button"
          onClick={() => setOtvoreno(true)}
          className="mt-3 rounded-xl border border-kolo-danger px-4 py-2 text-sm font-medium text-kolo-danger transition hover:bg-kolo-bg"
        >
          {t("brisanje_dugme")}
        </button>
      ) : (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-kolo-text">{t("brisanje_posledica")}</p>
          <label className="block text-sm">
            <span className="font-medium text-kolo-text">{t("brisanje_otkucaj", { pseudonim })}</span>
            <input
              className="mt-1 w-full rounded-xl border border-kolo-border px-3 py-2 text-sm"
              value={uneto}
              onChange={(e) => setUneto(e.target.value)}
              autoComplete="off"
            />
          </label>
          {greska && <p className="text-sm text-kolo-danger">{greska}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={radi || uneto.trim().toLowerCase() !== pseudonim.toLowerCase()}
              onClick={obrisi}
              className="rounded-xl bg-kolo-danger px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50"
            >
              {t("brisanje_potvrdi")}
            </button>
            <button
              type="button"
              onClick={() => setOtvoreno(false)}
              className="rounded-xl border border-kolo-border px-4 py-2 text-sm font-medium text-kolo-text transition hover:bg-kolo-bg"
            >
              {t("dugme_odustani")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
