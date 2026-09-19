"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

/**
 * Kontrole Upravnog odbora nad usvojenom odlukom koja čeka sprovođenje (čl. 51
 * Pravilnika, čl. 17 Gornjeg Kola).
 *
 * 🔴 Tri različite radnje, namerno razdvojene:
 *  - „sproveo" traži OZNAKU AKTA UO — Gornje Kolo nije organ Fondacije, pa se
 *    odluka sprovodi aktom UO i taj akt mora ostati u registru;
 *  - „ne sprovodi" traži razlog sa ZATVORENE liste iz čl. 51 (zakon, Statut,
 *    van nadležnosti) uz obrazloženje;
 *  - „zaštitni veto" je zaseban institut (čl. 48) — privremen, gasi se po čl. 49.
 */
type Razlog = "ZAKON" | "STATUT" | "VAN_NADLEZNOSTI";
const RAZLOZI: Razlog[] = ["ZAKON", "STATUT", "VAN_NADLEZNOSTI"];

export default function IzvrsenjeKontrole({ id }: { id: string }) {
  const t = useTranslations("glasanje");
  const router = useRouter();
  const [radnja, setRadnja] = useState<"izvrsi" | "veto" | "odbij" | null>(null);
  const [forma, setForma] = useState<"akt" | "veto" | "odbij" | null>(null);
  const [akt, setAkt] = useState("");
  const [obrazlozenje, setObrazlozenje] = useState("");
  const [razlog, setRazlog] = useState<Razlog>("ZAKON");
  const [greska, setGreska] = useState<string | null>(null);

  function zatvori() {
    setForma(null); setAkt(""); setObrazlozenje(""); setRazlog("ZAKON");
  }

  async function posalji(put: string, telo: unknown, koja: "izvrsi" | "veto" | "odbij") {
    setRadnja(koja); setGreska(null);
    const res = await fetch(`/api/admin/glasanje/${id}/${put}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(telo),
    });
    setRadnja(null);
    if (res.ok) { zatvori(); router.refresh(); }
    else setGreska((await res.json().catch(() => ({}))).error ?? t("greska_generic"));
  }

  const dugme = "px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-60";

  return (
    <div className="pt-2 border-t border-kolo-border space-y-2">
      {forma === null && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setForma("akt")} disabled={radnja !== null}
            className={`${dugme} bg-kolo-green-700 text-white hover:bg-kolo-green-900`}>
            {t("oznaci_izvrseno")}
          </button>
          <button onClick={() => setForma("odbij")} disabled={radnja !== null}
            className={`${dugme} border border-kolo-border text-kolo-muted hover:bg-kolo-bg`}>
            {t("ne_sprovodi")}
          </button>
          <button onClick={() => setForma("veto")} disabled={radnja !== null}
            className={`${dugme} border border-kolo-danger/40 text-kolo-danger hover:bg-kolo-danger-light`}>
            {t("zastitni_veto")}
          </button>
        </div>
      )}

      {forma === "akt" && (
        <div className="space-y-2">
          <input value={akt} onChange={(e) => setAkt(e.target.value)}
            placeholder={t("izvrsenje_akt_placeholder")}
            className="w-full px-3 py-2 rounded-lg border border-kolo-border text-xs outline-none focus:border-kolo-green-700" />
          <p className="text-xs text-kolo-muted">{t("izvrsenje_akt_napomena")}</p>
          <div className="flex gap-2">
            <button onClick={() => posalji("izvrsi", { akt: akt.trim() }, "izvrsi")}
              disabled={radnja !== null || akt.trim().length < 3}
              className={`${dugme} bg-kolo-green-700 text-white`}>
              {radnja === "izvrsi" ? "..." : t("potvrdi_izvrseno")}
            </button>
            <button onClick={zatvori} className={`${dugme} bg-kolo-bg text-kolo-muted font-medium`}>
              {t("otkazi_veto")}
            </button>
          </div>
        </div>
      )}

      {forma === "odbij" && (
        <div className="space-y-2">
          <select value={razlog} onChange={(e) => setRazlog(e.target.value as Razlog)}
            className="w-full px-3 py-2 rounded-lg border border-kolo-border text-xs outline-none focus:border-kolo-green-700">
            {RAZLOZI.map((r) => (
              <option key={r} value={r}>{t(`odbijanje_razlog_${r.toLowerCase()}`)}</option>
            ))}
          </select>
          <textarea rows={2} value={obrazlozenje} onChange={(e) => setObrazlozenje(e.target.value)}
            placeholder={t("odbijanje_obrazlozenje_placeholder")}
            className="w-full px-3 py-2 rounded-lg border border-kolo-border text-xs outline-none focus:border-kolo-green-700 resize-none" />
          <div className="flex gap-2">
            <button onClick={() => posalji("ne-sprovedi", { razlog, obrazlozenje: obrazlozenje.trim() }, "odbij")}
              disabled={radnja !== null || obrazlozenje.trim().length < 10}
              className={`${dugme} bg-kolo-muted text-white`}>
              {radnja === "odbij" ? "..." : t("potvrdi_ne_sprovodi")}
            </button>
            <button onClick={zatvori} className={`${dugme} bg-kolo-bg text-kolo-muted font-medium`}>
              {t("otkazi_veto")}
            </button>
          </div>
        </div>
      )}

      {forma === "veto" && (
        <div className="space-y-2">
          <textarea rows={2} value={obrazlozenje} onChange={(e) => setObrazlozenje(e.target.value)}
            placeholder={t("veto_obrazlozenje_placeholder")}
            className="w-full px-3 py-2 rounded-lg border border-kolo-border text-xs outline-none focus:border-kolo-green-700 resize-none" />
          <div className="flex gap-2">
            <button onClick={() => posalji("veto", { obrazlozenje: obrazlozenje.trim() }, "veto")}
              disabled={radnja !== null || obrazlozenje.trim().length < 10}
              className={`${dugme} bg-kolo-danger text-white`}>
              {radnja === "veto" ? "..." : t("potvrdi_veto")}
            </button>
            <button onClick={zatvori} className={`${dugme} bg-kolo-bg text-kolo-muted font-medium`}>
              {t("otkazi_veto")}
            </button>
          </div>
        </div>
      )}

      {greska && <p className="text-xs text-kolo-danger">{greska}</p>}
    </div>
  );
}
