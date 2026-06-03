"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Admin (UO) kontrole nad usvojenom odlukom koja čeka izvršenje (čl. 17, 18).
export default function IzvrsenjeKontrole({ id }: { id: string }) {
  const router = useRouter();
  const [radnja, setRadnja] = useState<"izvrsi" | "veto" | null>(null);
  const [vetoForma, setVetoForma] = useState(false);
  const [obrazlozenje, setObrazlozenje] = useState("");
  const [greska, setGreska] = useState<string | null>(null);

  async function izvrsi() {
    setRadnja("izvrsi"); setGreska(null);
    const res = await fetch(`/api/admin/glasanje/${id}/izvrsi`, { method: "POST" });
    setRadnja(null);
    if (res.ok) router.refresh();
    else setGreska((await res.json().catch(() => ({}))).error ?? "Greška.");
  }

  async function veto() {
    setRadnja("veto"); setGreska(null);
    const res = await fetch(`/api/admin/glasanje/${id}/veto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ obrazlozenje: obrazlozenje.trim() }),
    });
    setRadnja(null);
    if (res.ok) { setVetoForma(false); setObrazlozenje(""); router.refresh(); }
    else setGreska((await res.json().catch(() => ({}))).error ?? "Greška.");
  }

  return (
    <div className="pt-2 border-t border-kolo-border space-y-2">
      {!vetoForma ? (
        <div className="flex gap-2">
          <button onClick={izvrsi} disabled={radnja !== null}
            className="px-3 py-1.5 rounded-lg bg-kolo-green-700 text-white text-xs font-semibold hover:bg-kolo-green-900 disabled:opacity-60">
            {radnja === "izvrsi" ? "..." : "Označi izvršeno"}
          </button>
          <button onClick={() => setVetoForma(true)} disabled={radnja !== null}
            className="px-3 py-1.5 rounded-lg border border-kolo-danger/40 text-kolo-danger text-xs font-semibold hover:bg-kolo-danger-light disabled:opacity-60">
            Zaštitni veto
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea rows={2} value={obrazlozenje} onChange={(e) => setObrazlozenje(e.target.value)}
            placeholder="Obrazloženje veta — konkretna pretnja održivosti (čl. 18)"
            className="w-full px-3 py-2 rounded-lg border border-kolo-border text-xs outline-none focus:border-kolo-green-700 resize-none" />
          <div className="flex gap-2">
            <button onClick={veto} disabled={radnja !== null || obrazlozenje.trim().length < 10}
              className="px-3 py-1.5 rounded-lg bg-kolo-danger text-white text-xs font-semibold disabled:opacity-60">
              {radnja === "veto" ? "..." : "Potvrdi veto"}
            </button>
            <button onClick={() => { setVetoForma(false); setObrazlozenje(""); }}
              className="px-3 py-1.5 rounded-lg bg-kolo-bg text-kolo-muted text-xs font-medium">
              Otkaži
            </button>
          </div>
        </div>
      )}
      {greska && <p className="text-xs text-kolo-danger">{greska}</p>}
    </div>
  );
}
