"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import IndeksSekcija from "@/components/profil/IndeksSekcija";
import Pseudonim from "@/components/Pseudonim";
import { useTranslations } from "next-intl";

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
  price: number;
  category: string;
  createdAt: string;
}

interface ProfilData {
  id: string;
  pseudonim: string;
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
}

export default function JavniProfilPage() {
  const t = useTranslations("profil");
  const params = useParams();
  const id = params.id as string;

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

  const [profil, setProfil] = useState<ProfilData | null>(null);
  const [greska, setGreska] = useState("");
  const [ucitavam, setUcitavam] = useState(true);
  const [ucitavamJos, setUcitavamJos] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [sveTrx, setSveTrx] = useState<Transakcija[]>([]);

  useEffect(() => {
    let aktivno = true;
    fetch(`/api/profil/${id}`)
      .then(async (r) => {
        const body = await r.json().catch(() => ({}));
        if (!r.ok) {
          // Bez tvrdog redirecta (router.push) — to je ranije bacalo korisnika
          // na /tabla-jemstva i prikazivalo treperenje stanja te stranice.
          // Umesto toga prikaži jasnu poruku na samoj profil stranici.
          if (aktivno) {
            setGreska(
              r.status === 403 ? t("pristup_samo_verifikovani")
                : r.status === 404 ? t("profil_nije_pronadjen")
                : (body.error ?? t("greska_ucitavanja"))
            );
            setUcitavam(false);
          }
          return null;
        }
        return body;
      })
      .then((data) => {
        if (!data || !aktivno) return;
        setProfil(data);
        setSveTrx(data.transakcije);
        setCursor(data.nextCursor);
        setUcitavam(false);
      })
      .catch(() => { if (aktivno) { setGreska(t("greska_ucitavanja")); setUcitavam(false); } });
    return () => { aktivno = false; };
  }, [id, t]);

  const ucitajJos = useCallback(async () => {
    if (!cursor || ucitavamJos) return;
    setUcitavamJos(true);
    const res = await fetch(`/api/profil/${id}?cursor=${cursor}`);
    const data = await res.json();
    setSveTrx((prev) => [...prev, ...data.transakcije]);
    setCursor(data.nextCursor);
    setUcitavamJos(false);
  }, [cursor, id, ucitavamJos]);

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

  if (greska || !profil) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <p className="text-kolo-muted text-sm">{greska || t("profil_nije_pronadjen")}</p>
      </div>
    );
  }

  const inicijali = profil.pseudonim.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-4">
      {/* Naslov */}
      <div className="text-sm font-medium text-kolo-text">
        <Pseudonim>{profil.pseudonim}</Pseudonim>
      </div>

      {/* Gornji raspored: levo manja pseudonim kartica, desno statistike + indeks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* LEVO — pseudonim kartica (ista visina kao lanac/transakcije) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-kolo-border p-5 flex flex-col lg:h-[560px]">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            {profil.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profil.avatar}
                alt={profil.pseudonim}
                className="w-16 h-16 rounded-full object-cover border-2 border-kolo-border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-kolo-green-100 flex items-center justify-center border-2 border-kolo-border">
                <span className="text-xl font-bold text-kolo-green-700">{inicijali}</span>
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
            <div className="flex justify-between gap-2">
              <dt className="text-kolo-muted">{t("clan_od")}</dt>
              <dd className="text-kolo-muted">
                {new Date(profil.createdAt).toLocaleDateString("sr-RS", { year: "numeric", month: "long" })}
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
          <div className="mt-auto pt-4 flex gap-2">
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
          {/* Gornji deo: ZRNO (levo) i POEN (desno) — velike kartice u liniji */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="bg-white rounded-2xl border border-kolo-border p-6 text-center flex flex-col justify-center">
              <p className="text-base font-medium text-kolo-muted mb-1">ZRNO</p>
              <p className="text-5xl font-bold text-kolo-text tabular-nums">
                {profil.zrno !== null ? profil.zrno.toLocaleString("sr-RS") : "—"}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-kolo-border p-6 text-center flex flex-col justify-center">
              <p className="text-base font-medium text-kolo-muted mb-1">POEN</p>
              <p className="text-5xl font-bold text-kolo-text tabular-nums">
                {profil.bilans !== null ? profil.bilans.toLocaleString("sr-RS") : "—"}
              </p>
            </div>
          </div>

          {/* Donji deo: indeks stvarnosti (status badge levo, indeks desno) */}
          <IndeksSekcija korisnikId={profil.id} prikaziStablo={false} indeksKaoBadge ispuniVisinu />
        </div>
      </div>

      {/* Red 50/50: levo lanac verifikacija, desno transakcije */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* LEVO — lanac verifikacija (mini stablo) */}
        <IndeksSekcija korisnikId={profil.id} prikaziIndeks={false} ispuniVisinu />

        {/* DESNO — transakcije (fiksna visina + skrol) */}
        <div className="bg-white rounded-2xl border border-kolo-border flex flex-col lg:h-[560px]">
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
                        <Link href={`/profil/${drugaStrana.id}`} className="text-kolo-green-700 hover:underline">
                          <Pseudonim>{drugaStrana.pseudonim}</Pseudonim>
                        </Link>
                      ) : t("protokol"))}
                    </p>
                    <p className="text-xs text-kolo-muted mt-0.5">
                      {new Date(trx.createdAt).toLocaleString("sr-RS", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold shrink-0 ${jeIzlaz ? "text-kolo-danger" : "text-kolo-green-700"}`}>
                    {jeIzlaz ? "−" : "+"}{trx.amount.toLocaleString("sr-RS")}
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
                    <p className="text-xs text-kolo-muted mt-0.5">{oglas.category}</p>
                  </div>
                  <span className="text-sm font-semibold text-kolo-green-700 shrink-0 ml-4">
                    {oglas.price.toLocaleString("sr-RS")} P
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
    if (res.ok && data.id) {
      router.push(`/poruke?konverzacija=${data.id}`);
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
