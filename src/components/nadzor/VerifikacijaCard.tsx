"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pseudonim from "@/components/Pseudonim";

type Props = {
  id: string;
  verifikator: { id: string; pseudonim: string; slotoviPotroseni: number };
  verifikovani: { id: string; pseudonim: string };
  datum: string;
};

export default function VerifikacijaCard({
  id,
  verifikator,
  verifikovani,
  datum,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function potvrdi() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nadzor/${id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Greška");
        return;
      }
      router.refresh();
    } catch {
      setError("Mreža nije dostupna");
    } finally {
      setLoading(false);
    }
  }

  const datumLepo = new Date(datum).toLocaleString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-2xl border border-kolo-border bg-white p-4 shadow-sm flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="text-sm">
          <Link
            href={`/profil/${verifikator.id}`}
            className="font-semibold hover:underline"
          >
            @<Pseudonim>{verifikator.pseudonim}</Pseudonim>
          </Link>
          <span className="text-kolo-muted"> → </span>
          <Link
            href={`/profil/${verifikovani.id}`}
            className="font-semibold hover:underline"
          >
            @<Pseudonim>{verifikovani.pseudonim}</Pseudonim>
          </Link>
        </div>
        <div className="mt-1 text-xs text-kolo-muted">
          {datumLepo} · verifikator potrošio {verifikator.slotoviPotroseni}{" "}
          {verifikator.slotoviPotroseni === 1 ? "slot" : "slota"}
        </div>
        {error && <div className="mt-1 text-xs text-kolo-danger">{error}</div>}
      </div>
      <button
        onClick={potvrdi}
        disabled={loading}
        className="px-3 py-1.5 rounded-xl bg-kolo-green-700 text-white text-sm font-medium hover:bg-kolo-green-900 disabled:opacity-50"
      >
        {loading ? "Šaljem..." : "Potvrdi nadzor"}
      </button>
    </div>
  );
}
