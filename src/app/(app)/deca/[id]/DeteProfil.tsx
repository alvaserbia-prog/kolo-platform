"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MIN_LOZINKA } from "@/lib/deca-pravila";

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

      <Pregled deteId={dete.id} />

      <Razgovori deteId={dete.id} />

      <NovaLozinka deteId={dete.id} />

      <BrisanjeNaloga deteId={dete.id} pseudonim={dete.pseudonim} onGotovo={() => router.push("/profil")} />
    </div>
  );
}

type Razgovor = {
  id: string;
  drugi: string;
  poslednja: string;
  poruke: { id: string; tekst: string; odDeteta: boolean; createdAt: string }[];
};

/**
 * Razgovori deteta SA PUNOLETNIM LICIMA (čl. 9 st. 3) — roditelj ih ČITA.
 *
 * 🔴 Razgovore između dece roditelj VIŠE NE ČITA. Nadzor nad dečjim razgovorom
 * dodiruje i tuđe dete, kome njegov roditelj ovaj uvid nije dao; kad roditelj ne
 * čita, taj problem nestaje ceo. Umesto sadržaja stoji „ko i koliko" (v. `Pregled`).
 *
 * 🔴 Nema polja za pisanje. Sa druge strane je odrastao čovek, a taj odnos otvara
 * isključivo prekidač iz čl. 10 — pa bi ubacivanje roditelja u razgovor bilo
 * obraćanje trećem licu iz tuđeg naloga. Punoletnom sagovorniku u razgovoru stoji
 * vidljiv natpis da razgovor čita roditelj.
 */
function Razgovori({ deteId }: { deteId: string }) {
  const t = useTranslations("deca");
  const [razgovori, setRazgovori] = useState<Razgovor[] | null>(null);
  const [otvoren, setOtvoren] = useState<string | null>(null);
  const [greska, setGreska] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/deca/${deteId}/razgovori`, { cache: "no-store" });
        if (!res.ok) throw new Error();
        setRazgovori((await res.json()).razgovori);
      } catch {
        setGreska(t("greska_ucitavanje"));
      }
    })();
  }, [deteId, t]);

  return (
    <section className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-kolo-text">{t("razgovori_naslov")}</h2>
      <p className="mt-1 text-sm text-kolo-muted">{t("razgovori_opis")}</p>

      {greska && <p className="mt-2 text-sm text-kolo-danger">{greska}</p>}
      {razgovori === null && !greska && (
        <p className="mt-2 text-sm text-kolo-muted">{t("ucitavanje")}</p>
      )}
      {razgovori?.length === 0 && (
        <p className="mt-2 text-sm text-kolo-muted">{t("razgovori_prazno")}</p>
      )}

      <ul className="mt-3 space-y-2">
        {razgovori?.map((r) => (
          <li key={r.id} className="rounded-xl border border-kolo-border">
            <button
              type="button"
              onClick={() => setOtvoren((o) => (o === r.id ? null : r.id))}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <span className="min-w-0 truncate text-sm font-medium text-kolo-text">{r.drugi}</span>
              <span className="shrink-0 text-xs text-kolo-muted">
                {new Date(r.poslednja).toLocaleDateString("sr-RS")}
              </span>
            </button>
            {otvoren === r.id && (
              <div className="max-h-64 space-y-2 overflow-y-auto border-t border-kolo-border bg-kolo-bg p-3">
                {r.poruke.length === 0 && (
                  <p className="text-center text-xs text-kolo-muted">{t("razgovori_prazno")}</p>
                )}
                {r.poruke.map((p) => (
                  <div key={p.id} className={p.odDeteta ? "text-right" : ""}>
                    <p
                      className={`inline-block max-w-[85%] rounded-2xl px-3 py-1.5 text-sm ${
                        p.odDeteta ? "bg-kolo-green-700 text-white" : "bg-white text-kolo-text"
                      }`}
                    >
                      {p.tekst}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
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
      if (!res.ok) throw new Error(data?.error ?? t("greska_slanje"));
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

type Pregledi = {
  prijatelji: { pseudonim: string; od: string; poenIsplacen: boolean }[];
  razgovori: { id: string; drugi: string; poruka: number; poslednja: string }[];
};

/**
 * „Ko i koliko" (čl. 9 st. 2) — ono što roditelj dobija UMESTO sadržaja razgovora
 * među decom: spisak prijatelja sa datumima i spisak razgovora bez ijedne poruke.
 *
 * 🔴 Sadržaja ovde nema i nema rute koja bi ga vratila. To nije propust nego mera:
 * razgovor deteta sa drugim detetom dodiruje i tuđe dete.
 */
function Pregled({ deteId }: { deteId: string }) {
  const t = useTranslations("deca");
  const [podaci, setPodaci] = useState<Pregledi | null>(null);
  const [greska, setGreska] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/deca/${deteId}/pregled`, { cache: "no-store" });
        if (!res.ok) throw new Error();
        setPodaci(await res.json());
      } catch {
        setGreska(t("greska_ucitavanje"));
      }
    })();
  }, [deteId, t]);

  return (
    <section className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-kolo-text">{t("pregled_naslov")}</h2>
      <p className="mt-1 text-sm text-kolo-muted">{t("pregled_opis")}</p>

      {greska && <p className="mt-2 text-sm text-kolo-danger">{greska}</p>}
      {podaci === null && !greska && <p className="mt-2 text-sm text-kolo-muted">{t("ucitavanje")}</p>}

      {podaci && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-kolo-text">{t("pregled_prijatelji")}</h3>
            {podaci.prijatelji.length === 0 ? (
              <p className="mt-1 text-sm text-kolo-muted">{t("pregled_prijatelji_prazno")}</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm">
                {podaci.prijatelji.map((p) => (
                  <li key={p.pseudonim} className="flex justify-between gap-2">
                    <span className="truncate text-kolo-text">{p.pseudonim}</span>
                    <span className="shrink-0 text-xs text-kolo-muted">
                      {new Date(p.od).toLocaleDateString("sr-RS")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-kolo-text">{t("pregled_razgovori")}</h3>
            {podaci.razgovori.length === 0 ? (
              <p className="mt-1 text-sm text-kolo-muted">{t("pregled_razgovori_prazno")}</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm">
                {podaci.razgovori.map((r) => (
                  <li key={r.id} className="flex justify-between gap-2">
                    <span className="truncate text-kolo-text">{r.drugi}</span>
                    <span className="shrink-0 text-xs text-kolo-muted">
                      {t("pregled_poruka", { broj: r.poruka })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}


/**
 * Nova lozinka detetu (čl. 10 st. 1).
 *
 * 🔴 Stara lozinka se ne traži — roditelj je ne zna, i baš zato ovo postoji.
 * Nalog maloletnog korisnika po pravilu nema imejl, pa mu tok „zaboravljena
 * lozinka" ne stoji na raspolaganju: bez ovog dugmeta zaboravljena lozinka znači
 * trajno zaključan nalog, sa svim prijateljstvima i POEN-om u njemu.
 *
 * Lozinka se prikazuje dok se kuca. Roditelj je smišlja za dete i mora da je
 * pročita naglas — sakriveno polje bi ovde radilo protiv svrhe.
 */
function NovaLozinka({ deteId }: { deteId: string }) {
  const t = useTranslations("deca");
  const [lozinka, setLozinka] = useState("");
  const [radi, setRadi] = useState(false);
  const [poruka, setPoruka] = useState<{ tekst: string; greska: boolean } | null>(null);

  async function postavi() {
    setRadi(true);
    setPoruka(null);
    try {
      const res = await fetch(`/api/deca/${deteId}/lozinka`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lozinka }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setPoruka({ tekst: data?.error ?? t("greska_slanje"), greska: true });
        return;
      }
      setPoruka({ tekst: t("lozinka_uspeh"), greska: false });
      setLozinka("");
    } catch {
      setPoruka({ tekst: t("greska_slanje"), greska: true });
    } finally {
      setRadi(false);
    }
  }

  return (
    <section className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-kolo-text">{t("lozinka_naslov")}</h2>
      <p className="mt-1 text-sm text-kolo-muted">{t("lozinka_opis")}</p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          placeholder={t("lozinka_polje")}
          autoComplete="new-password"
          className="w-full rounded-xl border border-kolo-border px-3 py-2 text-sm outline-none focus:border-kolo-green-500"
        />
        <button
          type="button"
          onClick={postavi}
          disabled={radi || lozinka.length < MIN_LOZINKA}
          className="shrink-0 rounded-xl bg-kolo-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-kolo-green-900 disabled:opacity-50"
        >
          {t("lozinka_dugme")}
        </button>
      </div>

      <p className="mt-2 text-xs text-kolo-muted">{t("lozinka_pravilo", { broj: MIN_LOZINKA })}</p>

      {poruka && (
        <p className={`mt-2 text-sm ${poruka.greska ? "text-kolo-danger" : "text-kolo-green-700"}`}>
          {poruka.tekst}
        </p>
      )}
    </section>
  );
}
