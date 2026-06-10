"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Admin (UO) obrazložen odgovor na usvojenu dinarsku preporuku (čl. 20).
export default function PreporukaOdgovor({ id }: { id: string }) {
  const t = useTranslations("glasanje");
  const router = useRouter();
  const [odgovor, setOdgovor] = useState<"PRIHVACENO" | "ODBIJENO">("PRIHVACENO");
  const [obrazlozenje, setObrazlozenje] = useState("");
  const [salje, setSalje] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);

  async function posalji() {
    setSalje(true); setGreska(null);
    const res = await fetch(`/api/admin/glasanje/${id}/odgovor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ odgovor, obrazlozenje: obrazlozenje.trim() }),
    });
    setSalje(false);
    if (res.ok) router.refresh();
    else setGreska((await res.json().catch(() => ({}))).error ?? t("greska_generic"));
  }

  return (
    <div className="pt-2 border-t border-kolo-border space-y-2">
      <p className="text-xs font-medium text-kolo-muted">{t("preporuka_odgovor_naslov")}</p>
      <div className="flex gap-2">
        <select value={odgovor} onChange={(e) => setOdgovor(e.target.value as "PRIHVACENO" | "ODBIJENO")}
          className="px-2 py-1.5 rounded-lg border border-kolo-border text-xs outline-none focus:border-kolo-green-700">
          <option value="PRIHVACENO">{t("uo_prihvaceno")}</option>
          <option value="ODBIJENO">{t("uo_odbijeno")}</option>
        </select>
      </div>
      <textarea rows={2} value={obrazlozenje} onChange={(e) => setObrazlozenje(e.target.value)}
        placeholder={t("preporuka_obrazlozenje_placeholder")}
        className="w-full px-3 py-2 rounded-lg border border-kolo-border text-xs outline-none focus:border-kolo-green-700 resize-none" />
      <button onClick={posalji} disabled={salje || obrazlozenje.trim().length < 10}
        className="px-3 py-1.5 rounded-lg bg-kolo-green-700 text-white text-xs font-semibold hover:bg-kolo-green-900 disabled:opacity-60">
        {salje ? "..." : t("posalji_odgovor")}
      </button>
      {greska && <p className="text-xs text-kolo-danger">{greska}</p>}
    </div>
  );
}
