"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Osnivac = {
  id: string;
  redniBroj: number;
  udeoBrojilac: number;
  udeoImenilac: number;
  napomena: string | null;
  user: { pseudonim: string; email?: string };
};

type Status = {
  ukupnoEvidentirano: number;
  brojKoraka: number;
  zatvoren: boolean;
  poslednjiPrag: number;
  gornjaGranica: number;
  preostalo: number;
  procenatIskoriscenja: number;
  ukupanPoenUSistemu: number;
  sledeciPrag: number;
};

const fmt = (n: number) => n.toLocaleString("sr-RS");

export default function OsnivaciTab({
  verifikovaniKorisnici,
  onDone,
}: {
  verifikovaniKorisnici: { id: string; pseudonim: string }[];
  onDone: () => void;
}) {
  const t = useTranslations("admin");
  const [osnivaci, setOsnivaci] = useState<Osnivac[]>([]);
  const [status, setStatus] = useState<Status | null>(null);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [radnja, setRadnja] = useState<string | null>(null);

  // Forma za dodavanje
  const [userId, setUserId] = useState("");
  const [brojilac, setBrojilac] = useState("");
  const [imenilac, setImenilac] = useState("");
  const [redniBroj, setRedniBroj] = useState("");
  const [napomena, setNapomena] = useState("");
  const [greska, setGreska] = useState("");

  const ucitaj = useCallback(async () => {
    setUcitavanje(true);
    const [oRes, sRes] = await Promise.all([
      fetch("/api/admin/osnivaci"),
      fetch("/api/javno/osnivacki-doprinos"),
    ]);
    if (oRes.ok) setOsnivaci((await oRes.json()).osnivaci ?? []);
    if (sRes.ok) setStatus((await sRes.json()).status ?? null);
    setUcitavanje(false);
  }, []);

  useEffect(() => { ucitaj(); }, [ucitaj]);

  const aktiviran = (status?.brojKoraka ?? 0) > 0;
  const zbirBrojilaca = osnivaci.reduce((s, o) => s + o.udeoBrojilac, 0);
  const zajednickiImenilac = osnivaci[0]?.udeoImenilac ?? 0;
  const sviIstiImenilac = osnivaci.every((o) => o.udeoImenilac === zajednickiImenilac);
  const udeliValidni = osnivaci.length > 0 && sviIstiImenilac && zbirBrojilaca === zajednickiImenilac;

  async function dodaj() {
    setGreska("");
    setRadnja("dodaj");
    const res = await fetch("/api/admin/osnivaci", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        udeoBrojilac: Number(brojilac),
        udeoImenilac: Number(imenilac),
        redniBroj: Number(redniBroj),
        napomena: napomena.trim() || undefined,
      }),
    });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    if (res.ok) {
      setUserId(""); setBrojilac(""); setImenilac(""); setRedniBroj(""); setNapomena("");
      await ucitaj();
    } else {
      setGreska(d.error ?? t("osnivaci_greska_dodavanja"));
    }
  }

  async function obrisi(id: string) {
    if (!confirm(t("osnivaci_obrisi_confirm"))) return;
    setRadnja(id);
    const res = await fetch(`/api/admin/osnivaci/${id}`, { method: "DELETE" });
    setRadnja(null);
    if (res.ok) await ucitaj();
    else { const d = await res.json().catch(() => ({})); alert(d.error ?? t("greska_generalna")); }
  }

  async function evidentiraj() {
    if (!confirm(t("osnivaci_evidentiraj_confirm"))) return;
    setRadnja("triger");
    const res = await fetch("/api/admin/osnivacki/triger", { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    alert(res.ok ? (d.poruka ?? "Gotovo.") : (d.error ?? t("greska_generalna")));
    if (res.ok) { await ucitaj(); onDone(); }
  }

  if (ucitavanje) return <p className="text-sm text-kolo-muted">{t("osnivaci_ucitavanje")}</p>;

  return (
    <div className="space-y-6">
      {/* Status kanala */}
      {status && (
        <div className="bg-white rounded-2xl border border-kolo-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-kolo-text">{t("osnivaci_kanal_naslov")}</h2>
            {status.zatvoren && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-kolo-bg text-kolo-muted">{t("osnivaci_trajno_zatvoren")}</span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Stat label={t("osnivaci_stat_koraka")} value={`${status.brojKoraka} / 120`} />
            <Stat label={t("osnivaci_stat_evidentirano")} value={`${fmt(status.ukupnoEvidentirano)} POEN`} />
            <Stat label={t("osnivaci_stat_preostalo")} value={`${fmt(status.preostalo)} POEN`} />
            <Stat label={t("osnivaci_stat_iskoriscenos")} value={`${status.procenatIskoriscenja}%`} />
            <Stat label={t("osnivaci_stat_poen_u_sistemu")} value={fmt(status.ukupanPoenUSistemu)} />
            <Stat label={t("osnivaci_stat_sledeci_prag")} value={fmt(status.sledeciPrag)} />
          </div>
          <div className="mt-4 h-2 rounded-full bg-kolo-bg overflow-hidden">
            <div className="h-full bg-kolo-green-700" style={{ width: `${Math.min(100, status.procenatIskoriscenja)}%` }} />
          </div>
          <button
            onClick={evidentiraj}
            disabled={radnja === "triger" || status.zatvoren}
            className="mt-4 px-4 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
          >
            {radnja === "triger" ? t("osnivaci_evidentiraj_loading") : t("osnivaci_evidentiraj_btn")}
          </button>
          <p className="mt-2 text-xs text-kolo-muted">
            {t("osnivaci_evidentiraj_napomena")}
          </p>
        </div>
      )}

      {/* Lista osnivaca */}
      <div className="bg-white rounded-2xl border border-kolo-border p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-kolo-text">{t("osnivaci_lista_naslov")}</h2>
          <span className={`text-xs font-semibold ${udeliValidni ? "text-kolo-green-700" : "text-kolo-danger"}`}>
            {t("osnivaci_zbir_udela", { zbir: zbirBrojilaca, imenilac: zajednickiImenilac || "—", valid: udeliValidni ? "✓" : "(mora biti 1/1)" })}
          </span>
        </div>

        {osnivaci.length === 0 ? (
          <p className="text-sm text-kolo-muted">{t("osnivaci_nema")}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-kolo-muted border-b border-kolo-border">
                <th className="py-2 font-medium">{t("osnivaci_tbl_rb")}</th>
                <th className="py-2 font-medium">{t("osnivaci_tbl_pseudonim")}</th>
                <th className="py-2 font-medium">{t("osnivaci_tbl_udeo")}</th>
                <th className="py-2 font-medium">{t("osnivaci_tbl_napomena")}</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {osnivaci.map((o) => (
                <tr key={o.id} className="border-b border-kolo-border last:border-0">
                  <td className="py-2">{o.redniBroj}</td>
                  <td className="py-2 font-medium text-kolo-text">{o.user.pseudonim}</td>
                  <td className="py-2">
                    {o.udeoBrojilac}/{o.udeoImenilac}
                    <span className="text-kolo-muted"> ({Math.round((o.udeoBrojilac / o.udeoImenilac) * 1000) / 10}%)</span>
                  </td>
                  <td className="py-2 text-kolo-muted">{o.napomena ?? "—"}</td>
                  <td className="py-2 text-right">
                    {!aktiviran && (
                      <button onClick={() => obrisi(o.id)} disabled={radnja === o.id}
                        className="px-2.5 py-1 bg-kolo-danger-light text-kolo-danger text-xs font-semibold rounded-lg disabled:opacity-60">
                        {t("osnivaci_obrisi_btn")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {aktiviran && (
          <p className="mt-3 text-xs text-kolo-muted">
            {t("osnivaci_kanal_zakljucan")}
          </p>
        )}
      </div>

      {/* Forma za dodavanje */}
      {!aktiviran && (
        <div className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
          <h2 className="text-base font-semibold text-kolo-text">{t("osnivaci_dodaj_naslov")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-kolo-muted mb-1">{t("osnivaci_korisnik_label")}</label>
              <select value={userId} onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700">
                <option value="">{t("osnivaci_korisnik_placeholder")}</option>
                {verifikovaniKorisnici.map((k) => (
                  <option key={k.id} value={k.id}>{k.pseudonim}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-kolo-muted mb-1">{t("osnivaci_redni_broj_label")}</label>
              <input type="number" value={redniBroj} onChange={(e) => setRedniBroj(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-kolo-muted mb-1">{t("osnivaci_brojilac_label")}</label>
              <input type="number" value={brojilac} onChange={(e) => setBrojilac(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-kolo-muted mb-1">{t("osnivaci_imenilac_label")}</label>
              <input type="number" value={imenilac} onChange={(e) => setImenilac(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-kolo-muted mb-1">{t("osnivaci_napomena_label")}</label>
            <input type="text" value={napomena} onChange={(e) => setNapomena(e.target.value)} maxLength={200}
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
          </div>
          {greska && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>}
          <button
            onClick={dodaj}
            disabled={radnja === "dodaj" || !userId || !brojilac || !imenilac || !redniBroj}
            className="px-5 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
          >
            {radnja === "dodaj" ? t("osnivaci_dodajem") : t("osnivaci_dodaj_btn")}
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-kolo-muted">{label}</p>
      <p className="font-semibold text-kolo-text">{value}</p>
    </div>
  );
}
