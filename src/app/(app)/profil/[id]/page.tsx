"use client";

import { useEffect, useState, useCallback, type CSSProperties } from "react";
import { intlTag } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import IndeksSekcija from "@/components/profil/IndeksSekcija";
import Pseudonim from "@/components/Pseudonim";
import { useTranslations, useLocale } from "next-intl";
import { formatCenaGlavni, prikaziJedinicuCene } from "@/lib/cena-oglas";
import { kategorijaKljuc } from "@/lib/kategorije";
import { profilHref } from "@/lib/profil-link";

interface Transakcija {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  createdAt: string;
  fromWallet: { user: { id: string; pseudonim: string } | null } | null;
  toWallet: { user: { id: string; pseudonim: string } | null } | null;
}

interface Oglas {
  id: string;
  title: string;
  cenaTip: string;
  price: number | null;
  cenaDo: number | null;
  category: string;
  createdAt: string;
}

/**
 * Zatvoren prikaz maloletnog naloga (Pravilnik o učešću dece — član o pristupu
 * profilu maloletnog korisnika). Kad server vrati ovo umesto profila, stranica
 * NE renderuje ništa od profila — vidi `ZatvorenProfil`.
 */
interface ZatvorenProfil {
  pseudonim: string;
  roditelji: { id: string; pseudonim: string }[];
  razlog: "PUNOLETAN" | "NIJE_PRIJATELJ";
}

interface ProfilData {
  id: string;
  pseudonim: string;
  /** Škola maloletnog korisnika (čl. 7). Punoletan nalog je nema. */
  skola: { sifra: string; naziv: string; mesto: string } | null;
  /** Veza roditelj–dete je javna u oba smera (odluka vlasnika, 18.08.2026). */
  roditelji: { id: string; pseudonim: string }[];
  deca: { id: string; pseudonim: string; avatar: string | null }[];
  zatvoren?: ZatvorenProfil;
  /** Maloletni korisnik (Modul Deca) — bez indeksa i bez lanca potvrda. */
  maloletan?: boolean;
  verified: boolean;
  verifiedAt: string | null;
  status: string;
  avatar: string | null;
  createdAt: string;
  krug: { id: string; name: string } | null;
  lokacija: string | null;
  opis: string | null;
  punoIme: string | null;
  telefon: string | null;
  bilans: number | null;
  zrno: number | null;
  rangDonacija: number | null;
  transakcije: Transakcija[];
  nextCursor: string | null;
  oglasi: Oglas[];
  adminOznake: {
    dolazne: { pseudonim: string; oznaka: string }[];
    odlazne: { pseudonim: string; oznaka: string }[];
  } | null;
}

export default function JavniProfilPage() {
  const locale = useLocale();
  const t = useTranslations("profil");
  const tPijaca = useTranslations("pijaca");
  const tc = useTranslations("common");
  const params = useParams();
  // U adresi stoji pseudonim (`/profil/Marko`); API prima i njega i interni id i
  // napušteni pseudonim, pa se ovde ništa ne razrešava — samo prosleđuje.
  const adresa = params.id as string;

  const TIP_LABELA: Record<string, string> = {
    TRANSFER: t("trx_transfer"),
    EMISIJA: t("trx_emisija"),
    EMISIJA_VERIFIKACIJA: t("trx_verifikacija"),
    EMISIJA_DONACIJA: t("trx_donacija"),
    EMISIJA_POKROVITELJ: t("trx_pokroviteljstvo"),
    EMISIJA_PROGRAM: t("trx_program"),
    EMISIJA_PED: t("trx_evidencija_doprinosa"),
    EMISIJA_KRUG: t("trx_krug_bonus"),
    EMISIJA_KRUG_OSNIVANJE: t("trx_osnivanje_krugovi"),
    UPIS_ZRNO: t("trx_upis_zrno"),
    OTPIS_ZRNO: t("trx_otpis_zrno"),
  };

  const [ucitavamJos, setUcitavamJos] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [sveTrx, setSveTrx] = useState<Transakcija[]>([]);

  const {
    data: profil = null,
    isLoading: ucitavam,
    error: upit_greska,
  } = useQuery({
    queryKey: ["profil", adresa],
    queryFn: async (): Promise<ProfilData> => {
      const r = await fetch(`/api/profil/${encodeURIComponent(adresa)}`);
      const body = await r.json().catch(() => ({}));
      if (!r.ok) {
        // Bez tvrdog redirecta (router.push) — to je ranije bacalo korisnika
        // na drugu stranicu i prikazivalo treperenje njenog stanja.
        // Umesto toga prikaži jasnu poruku na samoj profil stranici.
        throw new Error(
          r.status === 403 ? t("pristup_samo_verifikovani")
            : r.status === 404 ? t("profil_nije_pronadjen")
            : (body.error ?? t("greska_ucitavanja"))
        );
      }
      return body;
    },
    retry: false,
  });

  const greska = upit_greska ? (upit_greska as Error).message : "";

  // Adresu svedi na aktuelni pseudonim kad je otvorena preko internog id-a ili preko
  // ranijeg pseudonima. `replaceState` (a ne router) — samo prepisuje ono što piše u
  // traci, bez novog učitavanja i bez unosa u istoriju pregledača.
  useEffect(() => {
    if (!profil?.pseudonim) return;
    const kanonska = `/profil/${encodeURIComponent(profil.pseudonim)}`;
    if (window.location.pathname !== kanonska) {
      window.history.replaceState(null, "", kanonska);
    }
  }, [profil?.pseudonim]);

  // Iniciraj lokalnu listu transakcija/kursor iz učitanog profila (paginacija ih dalje proširuje).
  useEffect(() => {
    if (profil) {
      setSveTrx(profil.transakcije);
      setCursor(profil.nextCursor);
    }
  }, [profil]);

  const ucitajJos = useCallback(async () => {
    if (!cursor || ucitavamJos) return;
    setUcitavamJos(true);
    const res = await fetch(`/api/profil/${encodeURIComponent(adresa)}?cursor=${cursor}`);
    const data = await res.json();
    setSveTrx((prev) => [...prev, ...data.transakcije]);
    setCursor(data.nextCursor);
    setUcitavamJos(false);
  }, [adresa, cursor, ucitavamJos]);

  if (ucitavam) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-32 bg-kolo-border rounded animate-pulse" />
        <div className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full bg-kolo-border animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-40 bg-kolo-border rounded animate-pulse" />
              <div className="h-4 w-24 bg-kolo-border rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔴 Zatvoren prikaz ide PRE svake druge grane. Odluka je doneta na serveru
  // (`pristupProfiluDeteta`); ovde se samo iscrtava ono što je poslao. Ekran mora
  // da uradi tri stvari, inače izgleda kao kvar: kaže zašto, imenuje roditelja
  // kome se čovek obraća (čl. 10), i pokaže jedini dozvoljeni put — oglas.
  if (profil?.zatvoren) {
    const z = profil.zatvoren;
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-kolo-border bg-white p-8">
        <p className="text-lg font-semibold text-kolo-text">
          <Pseudonim>{z.pseudonim}</Pseudonim>
        </p>
        <p className="mt-1 text-sm text-kolo-muted">{t("zatvoren_naslov")}</p>

        <p className="mt-5 text-sm text-kolo-text">
          {z.razlog === "NIJE_PRIJATELJ" ? t("zatvoren_prijatelj") : t("zatvoren_opis")}
        </p>

        {z.razlog === "PUNOLETAN" && z.roditelji.length > 0 && (
          <p className="mt-4 text-sm text-kolo-text">
            {t("zatvoren_roditelj")}{" "}
            {z.roditelji.map((r, i) => (
              <span key={r.id}>
                {i > 0 && ", "}
                <Link href={profilHref(r)} className="font-medium text-kolo-green-700 hover:underline">
                  <Pseudonim>{r.pseudonim}</Pseudonim>
                </Link>
              </span>
            ))}
          </p>
        )}

        {z.razlog === "PUNOLETAN" && (
          <p className="mt-4 text-sm text-kolo-muted">{t("zatvoren_oglas")}</p>
        )}
      </div>
    );
  }

  if (greska || !profil) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <p className="text-kolo-muted text-sm">{greska || t("profil_nije_pronadjen")}</p>
      </div>
    );
  }

  const inicijali = profil.pseudonim.slice(0, 2).toUpperCase();

  // Veličina slova za ZRNO/POEN se izvodi iz dužine dužeg zapisa (vidi
  // `.broj-kartica` u globals.css) — inače „13.400" izlazi iz kartice na
  // telefonu, a jednocifreno „0" pored njega izgleda nesrazmerno veliko.
  const zrnoTekst = profil.zrno !== null ? profil.zrno.toLocaleString(intlTag(locale)) : "—";
  const poenTekst = profil.bilans !== null ? profil.bilans.toLocaleString(intlTag(locale)) : "—";
  const znakovaStil = {
    "--znakova": String(Math.max(zrnoTekst.length, poenTekst.length)),
  } as CSSProperties;

  return (
    <div className="space-y-4">
      {/* Naslov */}
      <div className="text-sm font-medium text-kolo-text">
        <Pseudonim>{profil.pseudonim}</Pseudonim>
      </div>

      {/* Gornji raspored: levo manja pseudonim kartica, desno statistike + indeks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* LEVO — pseudonim kartica (ista visina kao lanac/transakcije) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-kolo-border p-5 flex flex-col lg:h-[460px]">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            {profil.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profil.avatar}
                alt={profil.pseudonim}
                className="w-28 h-28 rounded-full object-cover border-2 border-kolo-border"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-kolo-green-100 flex items-center justify-center border-2 border-kolo-border">
                <span className="text-4xl font-bold text-kolo-green-700">{inicijali}</span>
              </div>
            )}

            <h1 className="text-lg font-bold text-kolo-text mt-3"><Pseudonim>{profil.pseudonim}</Pseudonim></h1>
            {profil.punoIme && (
              <p className="text-sm text-kolo-muted mt-0.5">{profil.punoIme}</p>
            )}
            {profil.lokacija && (
              <p className="text-sm text-kolo-muted mt-0.5">{profil.lokacija}</p>
            )}

            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              {profil.verified ? (
                <span className="text-xs font-semibold px-2.5 py-1 bg-kolo-green-100 text-kolo-green-700 rounded-full">
                  {t("status_verifikovan")}
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 bg-kolo-gold-100 text-kolo-gold-600 rounded-full">
                  {t("status_ceka")}
                </span>
              )}
              {profil.status === "SUSPENDED" && (
                <span className="text-xs font-semibold px-2.5 py-1 bg-kolo-danger-light text-kolo-danger rounded-full">
                  {t("status_suspendovan")}
                </span>
              )}
            </div>

            {profil.opis && (
              <p className="text-sm text-kolo-muted mt-2 line-clamp-3">{profil.opis}</p>
            )}
          </div>

          {/* Info red */}
          <dl className="mt-4 space-y-2.5 text-sm border-t border-kolo-border pt-4">
            {/* Škola maloletnog korisnika (čl. 7). Ovaj profil vide samo roditelj,
                prijatelj i Fondacija — punoletnom članu se uopšte ne otvara. */}
            {profil.skola && (
              <div className="flex justify-between gap-2">
                <dt className="text-kolo-muted">{t("skola")}</dt>
                <dd className="text-right">
                  <Link
                    href={`/skole/${encodeURIComponent(profil.skola.sifra)}`}
                    className="text-kolo-green-700 hover:underline"
                  >
                    {profil.skola.naziv}
                  </Link>
                  <span className="block text-xs text-kolo-muted">{profil.skola.mesto}</span>
                </dd>
              </div>
            )}
            {/* Veza roditelj–dete je javna u OBA smera (odluka vlasnika). Sa deteta
                se vidi roditelj, sa roditelja ko su mu deca. Klik na dete vodi na
                zatvoren prikaz — spisak nije vrata. */}
            {profil.roditelji.length > 0 && (
              <div className="flex justify-between gap-2">
                <dt className="text-kolo-muted">{t("roditelji")}</dt>
                <dd className="text-right">
                  {profil.roditelji.map((r, i) => (
                    <span key={r.id}>
                      {i > 0 && ", "}
                      <Link href={profilHref(r)} className="text-kolo-green-700 hover:underline">
                        <Pseudonim>{r.pseudonim}</Pseudonim>
                      </Link>
                    </span>
                  ))}
                </dd>
              </div>
            )}
            {profil.deca.length > 0 && (
              <div className="flex justify-between gap-2">
                <dt className="text-kolo-muted">{t("deca")}</dt>
                <dd className="text-right">
                  {profil.deca.map((d, i) => (
                    <span key={d.id}>
                      {i > 0 && ", "}
                      <Link href={profilHref(d)} className="text-kolo-green-700 hover:underline">
                        <Pseudonim>{d.pseudonim}</Pseudonim>
                      </Link>
                    </span>
                  ))}
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-2">
              <dt className="text-kolo-muted">{t("clan_od")}</dt>
              <dd className="text-kolo-muted">
                {new Date(profil.createdAt).toLocaleDateString(intlTag(locale), { year: "numeric", month: "long" })}
              </dd>
            </div>
            {profil.telefon && (
              <div className="flex justify-between gap-2">
                <dt className="text-kolo-muted">{t("telefon_label")}</dt>
                <dd className="text-kolo-text">{profil.telefon}</dd>
              </div>
            )}
            {profil.rangDonacija !== null && (
              <div className="flex justify-between gap-2">
                <dt className="text-kolo-muted">{t("toggle_rang_donacija")}</dt>
                <dd className="text-kolo-text font-medium">#{profil.rangDonacija}</dd>
              </div>
            )}
          </dl>

          {/* Akcijska dugmad */}
          <div className="mt-4 flex gap-2">
            <Link
              href={`/novcanik?prima=${profil.pseudonim}`}
              className="flex-1 py-2.5 text-center rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors"
            >
              {t("upisi_poen")}
            </Link>
            <PorukaButton userId={profil.id} />
          </div>
        </div>

        {/* DESNO — gore statistike (ZRNO levo, POEN desno), dole indeks stvarnosti */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Gornji deo: ZRNO (levo) i POEN (desno) — velike kartice u liniji.
              Obe vrednosti dobijaju ISTU veličinu slova (računa se po dužem od
              dva zapisa), da broj u jednoj kartici ne bi bio duplo veći od broja
              u drugoj. */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="broj-kartica bg-white rounded-2xl border border-kolo-border p-4 sm:p-6 text-center flex flex-col justify-center">
              <p className="text-base font-medium text-kolo-muted mb-1">{tc("zrno")}</p>
              <p className="broj-kartica-vrednost font-bold text-kolo-text" style={znakovaStil}>
                {zrnoTekst}
              </p>
            </div>
            <div className="broj-kartica bg-white rounded-2xl border border-kolo-border p-4 sm:p-6 text-center flex flex-col justify-center">
              <p className="text-base font-medium text-kolo-muted mb-1">{tc("poen")}</p>
              <p className="broj-kartica-vrednost font-bold text-kolo-text" style={znakovaStil}>
                {poenTekst}
              </p>
            </div>
          </div>

          {/* Donji deo: indeks stvarnosti (status badge levo, indeks desno).
              Kod maloletnog korisnika ga nema — nema ni indeks ni lanac potvrda
              (Modul Deca, čl. 15), pa bi kartica prikazivala nulu bez značenja. */}
          {!profil.maloletan && (
            <IndeksSekcija korisnikId={profil.id} prikaziStablo={false} indeksKaoBadge ispuniVisinu />
          )}
        </div>
      </div>

      {/* Red 50/50: levo lanac verifikacija, desno transakcije */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* LEVO — lanac potvrda (mini stablo). Dete u njemu ne postoji. */}
        {!profil.maloletan && (
          <IndeksSekcija korisnikId={profil.id} prikaziIndeks={false} ispuniVisinu />
        )}

        {/* DESNO — transakcije (fiksna visina + skrol) */}
        <div className="bg-white rounded-2xl border border-kolo-border flex flex-col lg:h-[460px]">
        <div className="px-6 py-4 border-b border-kolo-border shrink-0">
          <h2 className="text-sm font-semibold text-kolo-text">{t("transakcije_naslov")}</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
        {sveTrx.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-kolo-muted">{t("nema_transakcija")}</p>
        ) : (
          <ul className="divide-y divide-kolo-border">
            {sveTrx.map((trx) => {
              const jeIzlaz = trx.fromWallet?.user?.id === profil.id;
              const drugaStrana = jeIzlaz ? trx.toWallet?.user : trx.fromWallet?.user;
              return (
                <li key={trx.id} className="px-6 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-kolo-text truncate">
                      <span className="text-kolo-muted text-xs mr-2">{TIP_LABELA[trx.type] ?? trx.type}</span>
                      {trx.description ?? (drugaStrana ? (
                        <Link href={profilHref(drugaStrana)} className="text-kolo-green-700 hover:underline">
                          <Pseudonim>{drugaStrana.pseudonim}</Pseudonim>
                        </Link>
                      ) : t("protokol"))}
                    </p>
                    <p className="text-xs text-kolo-muted mt-0.5">
                      {new Date(trx.createdAt).toLocaleString(intlTag(locale), { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold shrink-0 ${!jeIzlaz && trx.type !== "TRANSFER" ? "text-blue-600" : jeIzlaz ? "text-kolo-danger" : "text-kolo-green-700"}`}>
                    {jeIzlaz ? "−" : "+"}{trx.amount.toLocaleString(intlTag(locale))}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        {cursor && (
          <div className="px-6 py-4 border-t border-kolo-border">
            <button
              onClick={ucitajJos}
              disabled={ucitavamJos}
              className="w-full py-2.5 text-sm text-kolo-green-700 font-semibold hover:bg-kolo-green-100 rounded-xl transition-colors disabled:opacity-60"
            >
              {ucitavamJos ? t("ucitavam") : t("prikazi_vise")}
            </button>
          </div>
        )}
        </div>
        </div>
      </div>

      {/* Oznake verifikatora — vidi samo UO Fondacije (admin). Nije javno. */}
      {profil.adminOznake &&
        (profil.adminOznake.dolazne.length > 0 || profil.adminOznake.odlazne.length > 0) && (
          <div className="bg-white rounded-2xl border border-kolo-gold-200 border-2">
            <div className="px-6 py-4 border-b border-kolo-border flex items-center gap-2">
              <h2 className="text-sm font-semibold text-kolo-text">Oznake verifikatora</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-kolo-gold-100 text-kolo-gold-600">
                samo UO Fondacije
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-kolo-border">
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-kolo-muted font-semibold mb-2">
                  Kako su ga označili verifikatori
                </p>
                {profil.adminOznake.dolazne.length === 0 ? (
                  <p className="text-sm text-kolo-muted">—</p>
                ) : (
                  <ul className="space-y-1.5">
                    {profil.adminOznake.dolazne.map((o, i) => (
                      <li key={i} className="text-sm text-kolo-text">
                        <span className="font-medium">„{o.oznaka}"</span>{" "}
                        <span className="text-kolo-muted text-xs">
                          — @<Pseudonim>{o.pseudonim}</Pseudonim>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-kolo-muted font-semibold mb-2">
                  Kako je on označio one koje je verifikovao
                </p>
                {profil.adminOznake.odlazne.length === 0 ? (
                  <p className="text-sm text-kolo-muted">—</p>
                ) : (
                  <ul className="space-y-1.5">
                    {profil.adminOznake.odlazne.map((o, i) => (
                      <li key={i} className="text-sm text-kolo-text">
                        <span className="text-kolo-muted text-xs">
                          @<Pseudonim>{o.pseudonim}</Pseudonim> —
                        </span>{" "}
                        <span className="font-medium">„{o.oznaka}"</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Oglasi */}
      {profil.oglasi.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border">
          <div className="px-6 py-4 border-b border-kolo-border">
            <h2 className="text-sm font-semibold text-kolo-text">{t("aktivni_oglasi")}</h2>
          </div>
          <ul className="divide-y divide-kolo-border">
            {profil.oglasi.map((oglas) => (
              <li key={oglas.id}>
                <Link
                  href={`/pijaca/${oglas.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-kolo-bg transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-kolo-text font-medium truncate">{oglas.title}</p>
                    <p className="text-xs text-kolo-muted mt-0.5">{tPijaca(`kategorija_${kategorijaKljuc(oglas.category)}`)}</p>
                  </div>
                  <span className="text-sm font-semibold text-kolo-green-700 shrink-0 ml-4">
                    {formatCenaGlavni(oglas, t("cena_po_dogovoru"))}{prikaziJedinicuCene(oglas) ? " P" : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PorukaButton({ userId }: { userId: string }) {
  const t = useTranslations("profil");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function otvoriPoruku() {
    setLoading(true);
    const res = await fetch("/api/poruke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (res.ok && data.konverzacijaId) {
      router.push(`/poruke?k=${data.konverzacijaId}`);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={otvoriPoruku}
      disabled={loading}
      className="flex-1 py-2.5 rounded-xl border border-kolo-border text-sm font-semibold text-kolo-text hover:bg-kolo-bg transition-colors disabled:opacity-60"
    >
      {loading ? "..." : t("posalji_poruku")}
    </button>
  );
}
