"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Oglas = {
  id: string;
  naslov: string;
  opis: string;
  cena: number | null;
  cenaTip: string;
  imaSliku: boolean;
  oglasivac: string;
};

type Poruka = {
  id: string;
  userId: string;
  pseudonim: string;
  avatar: string | null;
  content: string;
  createdAt: string;
};

/**
 * Boje dečjeg prostora.
 *
 * Zelena je boja sistema odraslih; ovde je namerno nema kao vodeće. Dete je svoj
 * ekran nacrtalo bojicama, sa naslovom u kome je svako slovo druge boje — paleta
 * je odatle, ne iz teme platforme. Vrednosti su upisane doslovno jer žive samo na
 * ovom ekranu i nemaju šta da traže u temi celog sajta.
 */
const BOJE = ["#E4572E", "#F4A259", "#F2C14E", "#8FC93A", "#4CB5AE", "#3D7EA6", "#8E6FBF", "#E56399"];

/** Naslov u kome svako slovo ima svoju boju — kao na crtežu. */
function SareniNaslov({ tekst }: { tekst: string }) {
  return (
    <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl">
      {[...tekst].map((slovo, i) => (
        <span key={i} style={{ color: BOJE[i % BOJE.length] }}>
          {slovo}
        </span>
      ))}
    </h1>
  );
}

/**
 * Dečja početna — sve na JEDNOM ekranu, po skici koju je nacrtalo dete.
 *
 * 🔴 Radnje stoje na stranici, ne u meniju. Za sedmogodišnjaka meni iza hamburgera
 * ne postoji — postoji ono što vidi pred sobom. Zato su i POEN i dugmad i oglasi i
 * soba ovde, a sidebar je samo rezerva.
 */
export default function DecjaPocetna({
  pseudonim,
  mojId,
  poen,
  brojPrijatelja,
  mojihOglasa,
  oglasi,
  chatInicijalno,
}: {
  pseudonim: string;
  mojId: string;
  poen: number;
  brojPrijatelja: number;
  mojihOglasa: number;
  oglasi: Oglas[];
  chatInicijalno: Poruka[];
}) {
  const t = useTranslations("decjaPocetna");
  const tDeca = useTranslations("deca");
  const [pretraga, setPretraga] = useState("");

  const vidljivi = pretraga.trim()
    ? oglasi.filter((o) =>
        `${o.naslov} ${o.opis}`.toLowerCase().includes(pretraga.trim().toLowerCase()),
      )
    : oglasi;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <SareniNaslov tekst={t("naslov")} />

      {/* POEN kao veliki broj — ne iza klika. Dete pita „koliko imam", a ne „gde je
          moj zapis"; odgovor mora da stoji na ekranu. */}
      <section
        className="rounded-3xl bg-white p-6 text-center shadow-sm"
        style={{ border: `4px solid ${BOJE[2]}` }}
      >
        <p className="text-sm text-kolo-muted">{t("pozdrav", { pseudonim })}</p>
        <p className="mt-1 text-6xl font-extrabold tabular-nums" style={{ color: BOJE[0] }}>
          {poen.toLocaleString("sr-RS")}
        </p>
        <p className="text-sm font-bold" style={{ color: BOJE[5] }}>POEN</p>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Dugme href="/pijaca/novi-oglas" naslov={t("dugme_nov_oglas")} boja={BOJE[0]} />
        <Dugme href="/profil/oglasi" naslov={t("dugme_moji_oglasi")} broj={mojihOglasa} boja={BOJE[3]} />
        <Dugme href="/prijatelji" naslov={t("dugme_prijatelji")} broj={brojPrijatelja} boja={BOJE[6]} />
        <Dugme href="/poruke" naslov={t("dugme_poruke")} boja={BOJE[4]} />
      </div>

      {/* Obaveštenje stoji uz same poruke, ne u sitnim slovima: roditelj čita
          razgovore (čl. 9), pa dete to mora znati pre nego što napiše prvu reč. */}
      <p className="rounded-xl border border-kolo-border bg-kolo-bg px-4 py-2 text-center text-xs text-kolo-muted">
        {tDeca("uvid_upozorenje")}
      </p>

      <div>
        <input
          value={pretraga}
          onChange={(e) => setPretraga(e.target.value)}
          placeholder={t("pretraga")}
          style={{ borderColor: BOJE[4] }}
          className="w-full rounded-full border-[3px] bg-white px-5 py-3 text-sm outline-none"
        />
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold text-kolo-text">{t("oglasi_naslov")}</h2>
        {vidljivi.length === 0 ? (
          <p className="rounded-2xl border border-kolo-border bg-white p-6 text-center text-sm text-kolo-muted">
            {t("oglasi_prazno")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {vidljivi.map((o, i) => (
              <Link
                key={o.id}
                href={`/pijaca/${o.id}`}
                style={{ border: `3px solid ${BOJE[i % BOJE.length]}` }}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-40 items-center justify-center bg-kolo-bg">
                  {o.imaSliku ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/pijaca/slika/${o.id}/0`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-kolo-muted">{t("bez_slike")}</span>
                  )}
                </div>
                <div className="space-y-1 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 truncate font-medium text-kolo-text">{o.naslov}</p>
                    {o.cena !== null && (
                      <span className="shrink-0 rounded-full bg-kolo-bg px-2 py-0.5 text-xs font-semibold tabular-nums text-kolo-text">
                        {o.cena.toLocaleString("sr-RS")}
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 text-xs text-kolo-muted">{o.opis}</p>
                  <p className="text-xs text-kolo-muted">{o.oglasivac}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <DecjaPricaonica mojId={mojId} inicijalno={chatInicijalno} />
    </div>
  );
}

function Dugme({
  href,
  naslov,
  broj,
  boja,
}: {
  href: string;
  naslov: string;
  broj?: number;
  boja: string;
}) {
  return (
    <Link
      href={href}
      style={{ backgroundColor: boja }}
      className="flex flex-col items-center justify-center gap-1 rounded-3xl px-3 py-5 text-center text-sm font-bold text-white shadow-sm transition hover:brightness-110 active:scale-[0.98]"
    >
      <span>{naslov}</span>
      {broj !== undefined && <span className="text-2xl font-extrabold tabular-nums">{broj}</span>}
    </Link>
  );
}

/**
 * Dečja Pričaonica.
 *
 * Ista ruta `/api/chat` kao kod odraslih — soba se izvodi iz toga ko je prijavljen,
 * ne bira se parametrom. Zato dete ovde ne može da vidi sobu odraslih ni da napiše
 * u nju, bez obzira šta pošalje.
 */
function DecjaPricaonica({ mojId, inicijalno }: { mojId: string; inicijalno: Poruka[] }) {
  const t = useTranslations("decjaPocetna");
  const [poruke, setPoruke] = useState<Poruka[]>(inicijalno);
  const [tekst, setTekst] = useState("");
  const [salje, setSalje] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const dno = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/chat?limit=50", { cache: "no-store" });
        if (res.ok) setPoruke(await res.json());
      } catch {
        /* tiho — soba se osvežava sledeći put */
      }
    }, 10_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    dno.current?.scrollIntoView({ block: "end" });
  }, [poruke.length]);

  async function posalji(e: React.FormEvent) {
    e.preventDefault();
    const sadrzaj = tekst.trim();
    if (!sadrzaj) return;
    setSalje(true);
    setGreska(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: sadrzaj }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? t("greska_slanje"));
      setTekst("");
      setPoruke((p) => [...p, data]);
    } catch (err) {
      setGreska(err instanceof Error ? err.message : t("greska_slanje"));
    } finally {
      setSalje(false);
    }
  }

  return (
    <section className="rounded-2xl border border-kolo-border bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-kolo-text">{t("pricaonica_naslov")}</h2>
      <p className="mt-0.5 text-xs text-kolo-muted">{t("pricaonica_opis")}</p>

      <div className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-xl bg-kolo-bg p-3">
        {poruke.length === 0 && (
          <p className="py-6 text-center text-sm text-kolo-muted">{t("pricaonica_prazno")}</p>
        )}
        {poruke.map((p) => (
          <div key={p.id} className={p.userId === mojId ? "text-right" : ""}>
            <span className="text-xs text-kolo-muted">{p.pseudonim}</span>
            <p
              className={`inline-block max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                p.userId === mojId ? "text-white" : "bg-white text-kolo-text"
              }`}
              style={p.userId === mojId ? { backgroundColor: BOJE[6] } : undefined}
            >
              {p.content}
            </p>
          </div>
        ))}
        <div ref={dno} />
      </div>

      {greska && <p className="mt-2 text-sm text-kolo-danger">{greska}</p>}

      <form onSubmit={posalji} className="mt-3 flex gap-2">
        <input
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          maxLength={1000}
          placeholder={t("pricaonica_placeholder")}
          className="min-w-0 flex-1 rounded-xl border border-kolo-border px-4 py-2 text-sm outline-none focus:border-kolo-green-700"
        />
        <button
          type="submit"
          disabled={salje || !tekst.trim()}
          style={{ backgroundColor: BOJE[0] }}
          className="shrink-0 rounded-full px-5 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {t("posalji")}
        </button>
      </form>
    </section>
  );
}
