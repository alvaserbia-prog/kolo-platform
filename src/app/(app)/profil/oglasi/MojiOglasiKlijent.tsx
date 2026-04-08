"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Oglas {
  id: string;
  title: string;
  price: number;
  category: string;
  status: string;
  slike: number;
  createdAt: string;
  soldAt: string | null;
}

const statusBoja: Record<string, string> = {
  ACTIVE:  "bg-green-50 text-green-700",
  SOLD:    "bg-blue-50 text-blue-700",
  EXPIRED: "bg-gray-100 text-gray-500",
};
const statusLabela: Record<string, string> = {
  ACTIVE: "Aktivan", SOLD: "Prodat", EXPIRED: "Istekao",
};

export default function MojiOglasiKlijent({ listings }: { listings: Oglas[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("sve");
  const [deaktivacija, setDeaktivacija] = useState<string | null>(null);

  const filtrirani = listings.filter((l) => {
    if (filter === "aktivni") return l.status === "ACTIVE";
    if (filter === "prodati") return l.status === "SOLD";
    return true;
  });

  async function deaktiviraj(id: string) {
    setDeaktivacija(id);
    await fetch(`/api/pijaca/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ akcija: "deaktiviraj" }),
    });
    setDeaktivacija(null);
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/profil" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">← Profil</Link>
          <h1 className="text-2xl font-semibold text-gray-900">Moji oglasi</h1>
        </div>
        <Link
          href="/pijaca/novi-oglas"
          className="px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors"
        >
          + Novi oglas
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[["sve", "Svi"], ["aktivni", "Aktivni"], ["prodati", "Prodati"]].map(([val, lab]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === val ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500"
            }`}
          >
            {lab}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtrirani.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-400">
          {listings.length === 0 ? (
            <>
              Još nemate oglasa.{" "}
              <Link href="/pijaca/novi-oglas" className="text-green-700 hover:underline">Objavite prvi!</Link>
            </>
          ) : "Nema oglasa u ovom filteru."}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          {filtrirani.map((l) => (
            <div key={l.id} className="px-5 py-4 flex justify-between items-center gap-4">
              <div className="flex-1 min-w-0">
                <Link href={`/pijaca/${l.id}`} className="font-semibold text-gray-900 text-sm hover:text-green-700 transition-colors line-clamp-1">
                  {l.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{l.category}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs font-semibold text-green-700">{l.price.toLocaleString("sr-RS")} P</span>
                  {l.soldAt && (
                    <>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">Prodato: {new Date(l.soldAt).toLocaleDateString("sr-RS")}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusBoja[l.status] ?? "bg-gray-100 text-gray-500"}`}>
                  {statusLabela[l.status] ?? l.status}
                </span>
                {l.status === "ACTIVE" && (
                  <button
                    onClick={() => deaktiviraj(l.id)}
                    disabled={deaktivacija === l.id}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                  >
                    {deaktivacija === l.id ? "..." : "Ukloni"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
