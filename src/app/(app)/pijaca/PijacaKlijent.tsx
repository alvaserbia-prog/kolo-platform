"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    <div className="max-w-3xl space-y-5">
      {/* Zaglavlje */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Pijaca</h1>
        {isVerified ? (
          <Link
            href="/pijaca/novi-oglas"
            className="px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors"
          >
            + Novi oglas
          </Link>
        ) : (
          <span className="text-xs text-gray-400">Verifikujte nalog da biste objavili oglas</span>
        )}
      </div>

      {/* Pretraga + filteri */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Pretraži oglase..."
          value={pretraga}
          onChange={(e) => setPretraga(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {["Sve", ...KATEGORIJE].map((kat) => (
            <button
              key={kat}
              onClick={() => setFilterKat(kat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterKat === kat
                  ? "bg-green-700 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
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
            className="w-28 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-green-600 transition-colors"
          />
          <span className="text-gray-300 text-xs">—</span>
          <input
            type="number"
            min={0}
            placeholder="Max POEN"
            value={maxCena}
            onChange={(e) => setMaxCena(e.target.value)}
            className="w-28 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-green-600 transition-colors"
          />
          {(minCena || maxCena) && (
            <button onClick={() => { setMinCena(""); setMaxCena(""); }} className="text-xs text-gray-400 hover:text-gray-600">
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
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {lab}
            </button>
          ))}
        </div>
      </div>

      {/* Lista oglasa */}
      {filtrirani.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-sm text-gray-400">
          {listings.length === 0 ? "Još nema oglasa. Budite prvi!" : "Nema oglasa koji odgovaraju pretrazi."}
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Potvrdi kupovinu</h3>
              <p className="text-sm text-gray-500 mt-1">{kupiOglas.title}</p>
            </div>
            <div className="bg-green-50 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-green-700">{kupiOglas.price.toLocaleString("sr-RS")} POEN</p>
              <p className="text-xs text-green-600">biće prebačeno prodavcu</p>
            </div>
            {poruka && (
              <p className={`text-sm px-3 py-2 rounded-lg ${poruka.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {poruka.text}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => { setKupiOglas(null); setPoruka(null); }}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Otkaži
              </button>
              <button
                onClick={handleKupi}
                disabled={loading || !!poruka?.ok}
                className="flex-1 py-3 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-60"
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
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
      {/* Slika ili placeholder */}
      <div className="relative w-full h-36 bg-gray-50 flex items-center justify-center">
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
        <span className="absolute top-2 left-2 bg-white/90 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-md">
          {oglas.category}
        </span>
      </div>

      {/* Sadržaj */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/pijaca/${oglas.id}`} className="font-semibold text-gray-900 text-sm hover:text-green-700 transition-colors line-clamp-2">
              {oglas.title}
            </Link>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{oglas.description}</p>
          </div>
          <div className="shrink-0 bg-green-50 rounded-lg px-2.5 py-1.5 text-center">
            <p className="text-base font-bold text-green-700 leading-none">{oglas.price.toLocaleString("sr-RS")}</p>
            <p className="text-[10px] text-green-600">POEN</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {isVerified ? oglas.sellerPseudonim : "Član KOLO zajednice"}
            {oglas.location && <span className="ml-1">· {oglas.location}</span>}
          </span>
          {isVerified ? (
            <button
              onClick={onKupi}
              className="px-3 py-1.5 bg-green-700 text-white text-xs font-semibold rounded-lg hover:bg-green-800 transition-colors"
            >
              Plati
            </button>
          ) : (
            <Link href="/verifikacija" className="text-xs text-amber-600 hover:underline">
              Verifikuj →
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
