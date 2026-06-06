"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageOpis from "@/components/PageOpis";

const KATEGORIJE = ["Hrana", "Usluge", "Zanati", "Elektronika", "Odeća", "Ostalo"];

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  slike: number;
  location: string | null;
  createdAt: string;
  sellerPseudonim: string;
  sellerVerified: boolean;
}

interface Props {
  listings: Listing[];
  isVerified: boolean;
}

export default function PijacaKlijent({ listings, isVerified }: Props) {
  const router = useRouter();
  const [filterKat, setFilterKat] = useState("Sve");
  const [pretraga, setPretraga] = useState("");
  const [sort, setSort] = useState("novo");
  const [minCena, setMinCena] = useState("");
  const [maxCena, setMaxCena] = useState("");
  const [kupiOglas, setKupiOglas] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  const filtrirani = listings
    .filter((l) => {
      if (filterKat !== "Sve" && l.category !== filterKat) return false;
      if (pretraga && !l.title.toLowerCase().includes(pretraga.toLowerCase())) return false;
      if (minCena && l.price < Number(minCena)) return false;
      if (maxCena && l.price > Number(maxCena)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "jeftino") return a.price - b.price;
      if (sort === "skupo") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  async function handleKupi() {
    if (!kupiOglas) return;
    setLoading(true);
    setPoruka(null);
    const res = await fetch(`/api/pijaca/${kupiOglas.id}/kupi`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setPoruka({ text: `Kupovina uspešna! Prebačeno ${kupiOglas.price.toLocaleString("sr-RS")} POEN.`, ok: true });
      setTimeout(() => { setKupiOglas(null); setPoruka(null); router.refresh(); }, 2000);
    } else {
      setPoruka({ text: data.error ?? "Greška.", ok: false });
    }
  }

  return (
    <div className="space-y-5">
      {/* Zaglavlje */}
      <div className="flex justify-between items-center">
        <h1 className="kolo-naslov" style={{ letterSpacing: "-0.02em" }}>Pijaca</h1>
        {isVerified ? (
          <Link
            href="/pijaca/novi-oglas"
            className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
          >
            + Novi oglas
          </Link>
        ) : (
          <span className="text-xs text-kolo-muted">Zatražite verifikaciju da biste objavili oglas</span>
        )}
      </div>
      <PageOpis>
        Mesto gde članovi nude i traže dobra i usluge. Ponudu može da razgleda
        svako; za objavu oglasa i kontakt sa prodavcem potrebna je verifikacija.
      </PageOpis>

      {/* Pretraga + filteri */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Pretraži oglase..."
          value={pretraga}
          onChange={(e) => setPretraga(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-kolo-border bg-white text-sm outline-none focus:border-kolo-green-700 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {["Sve", ...KATEGORIJE].map((kat) => (
            <button
              key={kat}
              onClick={() => setFilterKat(kat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterKat === kat
                  ? "bg-kolo-green-700 text-white"
                  : "bg-white border border-kolo-border text-kolo-muted hover:border-kolo-green-700 hover:text-kolo-green-900"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min={0}
            placeholder="Min POEN"
            value={minCena}
            onChange={(e) => setMinCena(e.target.value)}
            className="w-28 px-3 py-1.5 rounded-lg border border-kolo-border bg-white text-xs outline-none focus:border-kolo-green-700 transition-colors"
          />
          <span className="text-kolo-border text-xs">—</span>
          <input
            type="number"
            min={0}
            placeholder="Max POEN"
            value={maxCena}
            onChange={(e) => setMaxCena(e.target.value)}
            className="w-28 px-3 py-1.5 rounded-lg border border-kolo-border bg-white text-xs outline-none focus:border-kolo-green-700 transition-colors"
          />
          {(minCena || maxCena) && (
            <button onClick={() => { setMinCena(""); setMaxCena(""); }} className="text-xs text-kolo-muted hover:text-kolo-text">
              ×
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {[["novo", "Najnovije"], ["jeftino", "Najjeftinije"], ["skupo", "Najskuplje"]].map(([val, lab]) => (
            <button
              key={val}
              onClick={() => setSort(val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sort === val
                  ? "bg-kolo-green-700 text-white border border-kolo-green-700"
                  : "bg-white border border-kolo-border text-kolo-muted hover:border-kolo-green-700 hover:text-kolo-green-900"
              }`}
            >
              {lab}
            </button>
          ))}
        </div>
      </div>

      {/* Lista oglasa */}
      {filtrirani.length === 0 ? (
        <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-10 flex flex-col items-center text-center gap-2">
          <div className="text-kolo-green-500">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-kolo-text">
            {listings.length === 0 ? "Još nema oglasa" : "Nema oglasa koji odgovaraju pretrazi"}
          </p>
          <p className="text-sm text-kolo-muted">
            {listings.length === 0 ? "Budite prvi koji objavljuje na Pijaci!" : "Pokušajte sa drugačijim filterima."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtrirani.map((l) => (
            <OglasKartica
              key={l.id}
              oglas={l}
              isVerified={isVerified}
              onKupi={() => { setKupiOglas(l); setPoruka(null); }}
            />
          ))}
        </div>
      )}

      {/* Modal kupovine */}
      {kupiOglas && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 w-full max-w-sm mx-auto space-y-4">
            <div>
              <h3 className="text-lg font-bold text-kolo-text">Potvrdi kupovinu</h3>
              <p className="text-sm text-kolo-muted mt-1">{kupiOglas.title}</p>
            </div>
            <div className="bg-kolo-green-100 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-kolo-green-700">{kupiOglas.price.toLocaleString("sr-RS")} POEN</p>
              <p className="text-xs text-kolo-green-700 opacity-70">biće prebačeno prodavcu</p>
            </div>
            {poruka && (
              <p className={`text-sm px-4 py-3 rounded-xl ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>
                {poruka.text}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => { setKupiOglas(null); setPoruka(null); }}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-kolo-bg border border-kolo-border text-kolo-muted text-sm font-semibold hover:bg-kolo-border transition-colors"
              >
                Otkaži
              </button>
              <button
                onClick={handleKupi}
                disabled={loading || !!poruka?.ok}
                className="flex-1 py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
              >
                {loading ? "Obrađujem..." : "Plati"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Kartica oglasa ─────────────────────────────────────────────────────────────

function OglasKartica({
  oglas,
  isVerified,
  onKupi,
}: {
  oglas: Listing;
  isVerified: boolean;
  onKupi: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl card-shadow border border-kolo-border overflow-hidden flex flex-col">
      {/* Slika ili placeholder */}
      <div className="relative w-full h-[180px] bg-kolo-bg flex items-center justify-center">
        {oglas.slike > 0 ? (
          <Image
            src={`/api/pijaca/slika/${oglas.id}/0`}
            alt={oglas.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="text-4xl">{kategorijaEmoji(oglas.category)}</span>
        )}
        <span className="absolute top-2 left-2 bg-white/90 text-kolo-muted text-xs font-medium px-2 py-0.5 rounded-lg">
          {oglas.category}
        </span>
      </div>

      {/* Sadržaj */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/pijaca/${oglas.id}`} className="font-semibold text-kolo-text text-sm hover:text-kolo-green-700 transition-colors line-clamp-2">
              {oglas.title}
            </Link>
            <p className="text-xs text-kolo-muted mt-0.5 line-clamp-1">{oglas.description}</p>
          </div>
          <div className="shrink-0 bg-kolo-green-100 rounded-xl px-2.5 py-1.5 text-center">
            <p className="text-base font-bold text-kolo-green-700 leading-none">{oglas.price.toLocaleString("sr-RS")}</p>
            <p className="text-[10px] text-kolo-green-700 opacity-70">POEN</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-2 border-t border-kolo-border">
          <span className="text-xs text-kolo-muted">
            {oglas.sellerPseudonim}
            {oglas.location && <span className="ml-1">· {oglas.location}</span>}
          </span>
          {isVerified ? (
            <button
              onClick={onKupi}
              className="px-3 py-1.5 bg-kolo-green-700 text-white text-xs font-semibold rounded-lg hover:bg-kolo-green-900 transition-colors"
            >
              Plati
            </button>
          ) : (
            <Link href="/tabla-jemstva" className="text-xs text-kolo-gold-600 hover:underline">
              Zatraži verifikaciju →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function kategorijaEmoji(kat: string) {
  const map: Record<string, string> = {
    Hrana: "🥗", Usluge: "🤝", Zanati: "🔧", Elektronika: "💻", Odeća: "👕", Ostalo: "📦",
  };
  return map[kat] ?? "📦";
}
