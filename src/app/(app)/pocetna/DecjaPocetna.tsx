"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { KarticaSkole } from "@/lib/skola";
import PrijaviPoruku from "@/components/PrijaviPoruku";
import { RAZLOZI_DECA } from "@/lib/prijava-poruke-pravila";

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
  poenNaCekanju,
  stanje,
  kod,
  mojihOglasa,
  oglasi,
  chatInicijalno,
  skola,
}: {
  pseudonim: string;
  mojId: string;
  poen: number;
  brojPrijatelja: number;
  poenNaCekanju: number;
  stanje: "NA_CEKANJU" | "POVEZANO" | "AKTIVNO";
  /** Šestocifreni kod za roditelja; postoji samo dok nalog čeka. */
  kod: string | null;
  mojihOglasa: number;
  oglasi: Oglas[];
  chatInicijalno: Poruka[];
  /** Kartica škole (čl. 7). `null` dok dete nije izabralo školu. */
  skola: KarticaSkole | null;
}) {
  const t = useTranslations("decjaPocetna");
  const tDeca = useTranslations("deca");
  const tSkole = useTranslations("skole");
  const [pretraga, setPretraga] = useState("");
  const cekaRoditelja = stanje === "NA_CEKANJU";

  const vidljivi = pretraga.trim()
    ? oglasi.filter((o) =>
        `${o.naslov} ${o.opis}`.toLowerCase().includes(pretraga.trim().toLowerCase()),
      )
    : oglasi;

  /**
   * Ekran deteta koje čeka roditelja (čl. 4c).
   *
   * 🔴 Poruka mora da bude KONKRETNA. POEN je apstraktan sedmogodišnjaku; ne moći
   * odgovoriti drugu koji ti je upravo skenirao kod — to je konkretno. Zato se broj
   * prijatelja koji čekaju stavlja u samu rečenicu.
   */
  if (cekaRoditelja) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <SareniNaslov tekst={t("naslov")} />
        <section
          className="rounded-3xl bg-white p-6 text-center shadow-sm"
          style={{ border: `4px solid ${BOJE[1]}` }}
        >
          <p className="text-sm text-kolo-muted">{t("pozdrav", { pseudonim })}</p>
          <h2 className="mt-2 text-xl font-extrabold" style={{ color: BOJE[0] }}>
            {t("ceka_naslov")}
          </h2>
          <p className="mt-2 text-sm text-kolo-text">
            {t("ceka_opis", { broj: brojPrijatelja })}
          </p>
          <p className="mt-3 text-sm text-kolo-muted">{t("ceka_uputstvo")}</p>
          {kod && (
            <div className="mt-4 rounded-2xl bg-kolo-bg p-4">
              <p className="text-xs text-kolo-muted">{t("kod_naslov")}</p>
              <p className="mt-1 text-3xl font-extrabold tracking-widest tabular-nums" style={{ color: BOJE[5] }}>
                {kod}
              </p>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Dugme href="/prijatelji" naslov={t("dugme_prijatelji")} broj={brojPrijatelja} boja={BOJE[6]} />
          <Dugme href="/profil" naslov={t("dugme_profil")} boja={BOJE[4]} />
        </div>
      </div>
    );
  }

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
        {/* „500 na čekanju" stoji uz sam broj: dete tako vidi koliko mu prijatelja
            još nema roditelja koji je redovan član (čl. 14b st. 2). */}
        {poenNaCekanju > 0 && (
          <p className="mt-2 text-sm font-semibold" style={{ color: BOJE[3] }}>
            {t("na_cekanju", { iznos: poenNaCekanju })}
          </p>
        )}
        {/* Prepis stoji uz sam broj, jer dete traži POEN tu — ne u meniju. Uslov
            je da je roditelj preuzeo nalog (čl. 4c); potvrda roditelja se čeka
            samo za UPIS iz prijateljstava, ne i za prepis (čl. 14). */}
        {!cekaRoditelja && (
          <Link
            href="/novcanik"
            className="mt-3 inline-block rounded-full px-5 py-2 text-sm font-bold text-white"
            style={{ backgroundColor: BOJE[6] }}
          >
            {t("dugme_prepis")}
          </Link>
        )}
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Dugme href="/pijaca/novi-oglas" naslov={t("dugme_nov_oglas")} boja={BOJE[0]} />
        <Dugme href="/profil/oglasi" naslov={t("dugme_moji_oglasi")} broj={mojihOglasa} boja={BOJE[3]} />
        <Dugme href="/prijatelji" naslov={t("dugme_prijatelji")} broj={brojPrijatelja} boja={BOJE[6]} />
        <Dugme href="/poruke" naslov={t("dugme_poruke")} boja={BOJE[4]} />
      </div>

      {/* Kartica škole — ovo je mesto na kome ceo mehanizam uspeva ili pada.
          Ne tabela od hiljadu redova nego JEDNA rečenica koju dete prepričava kod
          kuće: „našoj školi fali troje do šestog mesta". Ranglista deci ne daje
          ništa novo — ona postojećoj želji da pripadaju daje pravac. */}
      <SkolaKartica skola={skola} boje={BOJE} t={tSkole} />

      {/* 🔴 Roditelj VIŠE NE ČITA razgovore među decom (čl. 9 st. 2) — vidi samo sa
          kim i koliko. Zato tekst ne sme da ostane onakav kakav je bio; dete koje
          misli da ga niko ne čita, a čita ga, dobija pogrešnu sliku, i obrnuto. */}
      <p className="rounded-xl border border-kolo-border bg-kolo-bg px-4 py-2 text-center text-xs text-kolo-muted">
        {tDeca("uvid_obavestenje")}
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
 *
 * Jedna soba za svu decu, ali **svako vidi samo poruke svojih prijatelja**
 * (čl. 18 st. 3). Posledica koja se dobija besplatno: kad su svi učesnici međusobno
 * prijatelji, sam od sebe nastaje grupni razgovor.
 *
 * 🔴 NEMA odgovora sa citatom. Citat bi pokazao tekst osobe koju čitalac ne poznaje
 * i time zaobišao filter. Ne dodavati citiranje.
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
            {/* Prijava (čl. 18a) traži ŠIFRU razloga: roditelj razgovore ne čita,
                pa je dete jedino koje signalizira — a bez šifre se obrazac
                (mamljenje, laž o uzrastu) ne bi mogao prepoznati kroz više prijava. */}
            {p.userId !== mojId && (
              <span className="ml-2 inline-block align-bottom">
                <PrijaviPoruku porukaId={p.id} sifre={RAZLOZI_DECA} malo />
              </span>
            )}
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

/**
 * Kartica škole na dečjoj početnoj.
 *
 * 🔴 Namerno JEDNA rečenica, ne tabela. Nacionalna lista je apstraktna („sedmi smo
 * u Srbiji") i služi ponosu; ono što tera na akciju je koliko FALI do sledećeg
 * mesta — i to je jedini broj koji dete odnese kući. Tabela sa hiljadu škola živi
 * na `/skole`, iza klika.
 *
 * Dete bez izabrane škole vidi poziv da je izabere: bez ovoga polje ostaje
 * neotkriveno, jer se profil retko otvara.
 */
function SkolaKartica({
  skola,
  boje,
  t,
}: {
  skola: KarticaSkole | null;
  boje: string[];
  t: (kljuc: string, vrednosti?: Record<string, string | number>) => string;
}) {
  if (!skola) {
    return (
      <section
        className="rounded-2xl bg-white p-5 text-center"
        style={{ border: `3px solid ${boje[4]}` }}
      >
        <p className="text-sm text-kolo-muted">{t("kartica_bez_skole")}</p>
        <Link
          href="/profil"
          className="mt-3 inline-block rounded-full px-5 py-2 text-sm font-bold text-white"
          style={{ backgroundColor: boje[4] }}
        >
          {t("kartica_dugme")}
        </Link>
      </section>
    );
  }

  return (
    <section
      className="rounded-2xl bg-white p-5"
      style={{ border: `3px solid ${boje[4]}` }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-kolo-muted">
        {t("kartica_naslov")}
      </p>
      <Link
        href={`/skole/${encodeURIComponent(skola.sifra)}`}
        className="mt-1 block text-lg font-extrabold text-kolo-text hover:underline"
      >
        {skola.naziv}
      </Link>
      <p className="text-sm text-kolo-muted">{skola.mesto}</p>

      {/* Škola ulazi na listu tek sa prvim uključenim detetom (vidi `samoSaDecom`).
          Dok čeka roditelja, dete gleda svoju školu van poretka — a ta rečenica je
          upravo poziv da roditelja dovede. */}
      {skola.mestoSkole === null ? (
        <p className="mt-3 text-sm font-semibold" style={{ color: boje[0] }}>
          {t("kartica_nije_na_listi")}
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm font-semibold" style={{ color: boje[0] }}>
            {t("mesto_po_broju", { mesto: skola.mestoSkole })}{" "}
            <span className="font-normal text-kolo-muted">
              {t("od_ukupno", { ukupno: skola.ukupnoSkola })}
            </span>
          </p>

          {skola.doSledecegMesta === null ? (
            <p className="mt-1 text-sm font-bold" style={{ color: boje[6] }}>{t("prvo_mesto")}</p>
          ) : (
            <p className="mt-1 text-sm font-bold" style={{ color: boje[6] }}>
              {t("fali_do", { broj: skola.doSledecegMesta, mesto: skola.mestoSkole - 1 })}
            </p>
          )}
        </>
      )}

      {skola.mojeMesto !== null && (
        <p className="mt-1 text-sm text-kolo-muted">
          {t("kartica_ti", { mesto: skola.mojeMesto })}
        </p>
      )}
    </section>
  );
}
