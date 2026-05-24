"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import IndeksSekcija from "@/components/profil/IndeksSekcija";

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
  rangPreporuka: number | null;
  rangDonacija: number | null;
  transakcije: Transakcija[];
  nextCursor: string | null;
  oglasi: Oglas[];
}

const TIP_LABELA: Record<string, string> = {
  TRANSFER: "Transfer",
  EMISIJA: "Emisija",
  EMISIJA_VERIFIKACIJA: "Verifikacija",
  EMISIJA_PREPORUKA: "Preporuka",
  EMISIJA_DONACIJA: "Donacija",
  EMISIJA_POKROVITELJ: "Pokroviteljstvo",
  EMISIJA_PROGRAM: "Program",
  EMISIJA_PED: "Evidencija doprinosa",
  EMISIJA_KRUG: "Krug bonus",
  EMISIJA_KRUG_OSNIVANJE: "Osnivanje krugovi",
  UPIS_ZRNO: "Upis ZRNA",
  OTPIS_ZRNO: "Otpis ZRNA",
};

export default function JavniProfilPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [profil, setProfil] = useState<ProfilData | null>(null);
  const [greska, setGreska] = useState("");
  const [ucitavam, setUcitavam] = useState(true);
  const [ucitavamJos, setUcitavamJos] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [sveTrx, setSveTrx] = useState<Transakcija[]>([]);

  useEffect(() => {
    fetch(`/api/profil/${id}`)
      .then((r) => {
        if (r.status === 403) { router.push("/verifikacija"); return null; }
        if (r.status === 404) { router.push("/404"); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.error) { setGreska(data.error); }
        else {
          // redirect sopstveni profil
          setProfil(data);
          setSveTrx(data.transakcije);
          setCursor(data.nextCursor);
        }
        setUcitavam(false);
      })
      .catch(() => { setGreska("Greška pri učitavanju."); setUcitavam(false); });
  }, [id, router]);

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
        <p className="text-kolo-muted text-sm">{greska || "Profil nije pronađen."}</p>
      </div>
    );
  }

  const inicijali = profil.pseudonim.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-kolo-muted">
        <Link href="/krug" className="hover:text-kolo-green-700 transition-colors">Krug</Link>
        <span>/</span>
        <span className="text-kolo-text">{profil.pseudonim}</span>
      </div>

      {/* Hero kartica */}
      <div className="bg-white rounded-2xl border border-kolo-border p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="shrink-0">
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
          </div>

          {/* Ime i badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-kolo-text">{profil.pseudonim}</h1>
                {profil.punoIme && (
                  <p className="text-sm text-kolo-muted mt-0.5">{profil.punoIme}</p>
                )}
                {profil.lokacija && (
                  <p className="text-sm text-kolo-muted mt-0.5">{profil.lokacija}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {profil.verified ? (
                  <span className="text-xs font-semibold px-2.5 py-1 bg-kolo-green-100 text-kolo-green-700 rounded-full">
                    Verifikovan
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 bg-kolo-gold-100 text-kolo-gold-600 rounded-full">
                    Neverifikovan
                  </span>
                )}
                {profil.status === "SUSPENDED" && (
                  <span className="text-xs font-semibold px-2.5 py-1 bg-kolo-danger-light text-kolo-danger rounded-full">
                    Suspendovan
                  </span>
                )}
              </div>
            </div>
            {profil.opis && (
              <p className="text-sm text-kolo-muted mt-2 line-clamp-2">{profil.opis}</p>
            )}
          </div>
        </div>

        {/* Info red */}
        <dl className="mt-5 space-y-2.5 text-sm border-t border-kolo-border pt-4">
          {profil.krug && (
            <div className="flex justify-between">
              <dt className="text-kolo-muted">Krug</dt>
              <dd>
                <Link href={`/krug/${profil.krug.id}`} className="font-medium text-kolo-green-700 hover:underline">
                  {profil.krug.name}
                </Link>
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-kolo-muted">Član od</dt>
            <dd className="text-kolo-muted">
              {new Date(profil.createdAt).toLocaleDateString("sr-RS", { year: "numeric", month: "long" })}
            </dd>
          </div>
          {profil.telefon && (
            <div className="flex justify-between">
              <dt className="text-kolo-muted">Telefon</dt>
              <dd className="text-kolo-text">{profil.telefon}</dd>
            </div>
          )}
        </dl>

        {/* Akcijska dugmad */}
        <div className="mt-4 flex gap-3">
          <Link
            href={`/novcanik?prima=${profil.pseudonim}`}
            className="flex-1 py-2.5 text-center rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors"
          >
            Pošalji POEN
          </Link>
          <PorukaButton userId={profil.id} />
        </div>
      </div>

      {/* Indeks stvarnosti */}
      <IndeksSekcija korisnikId={profil.id} />

      {/* Statistike */}
      {(profil.bilans !== null || profil.zrno !== null || profil.rangPreporuka !== null || profil.rangDonacija !== null) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {profil.bilans !== null && (
            <div className="bg-white rounded-2xl border border-kolo-border p-4 text-center">
              <p className="text-xs text-kolo-muted mb-1">POEN balans</p>
              <p className="text-lg font-bold text-kolo-text">{profil.bilans.toLocaleString("sr-RS")}</p>
            </div>
          )}
          {profil.zrno !== null && (
            <div className="bg-white rounded-2xl border border-kolo-border p-4 text-center">
              <p className="text-xs text-kolo-muted mb-1">ZRNO</p>
              <p className="text-lg font-bold text-kolo-text">{profil.zrno.toLocaleString("sr-RS")}</p>
            </div>
          )}
          {profil.rangPreporuka !== null && (
            <div className="bg-white rounded-2xl border border-kolo-border p-4 text-center">
              <p className="text-xs text-kolo-muted mb-1">Rang preporuka</p>
              <p className="text-lg font-bold text-kolo-text">#{profil.rangPreporuka}</p>
            </div>
          )}
          {profil.rangDonacija !== null && (
            <div className="bg-white rounded-2xl border border-kolo-border p-4 text-center">
              <p className="text-xs text-kolo-muted mb-1">Rang donacija</p>
              <p className="text-lg font-bold text-kolo-text">#{profil.rangDonacija}</p>
            </div>
          )}
        </div>
      )}

      {/* Transakcije */}
      <div className="bg-white rounded-2xl border border-kolo-border">
        <div className="px-6 py-4 border-b border-kolo-border">
          <h2 className="text-sm font-semibold text-kolo-text">Transakcije</h2>
        </div>
        {sveTrx.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-kolo-muted">Nema transakcija.</p>
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
                          {drugaStrana.pseudonim}
                        </Link>
                      ) : "Protokol")}
                    </p>
                    <p className="text-xs text-kolo-muted mt-0.5">
                      {new Date(trx.createdAt).toLocaleDateString("sr-RS", { day: "numeric", month: "short", year: "numeric" })}
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
              {ucitavamJos ? "Učitavam..." : "Prikaži više"}
            </button>
          </div>
        )}
      </div>

      {/* Oglasi */}
      {profil.oglasi.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border">
          <div className="px-6 py-4 border-b border-kolo-border">
            <h2 className="text-sm font-semibold text-kolo-text">Aktivni oglasi</h2>
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
      {loading ? "..." : "Pošalji poruku"}
    </button>
  );
}
