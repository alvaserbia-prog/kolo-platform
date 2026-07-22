"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Pseudonim from "@/components/Pseudonim";

type Osnivac = {
  id: string;
  redniBroj: number;
  udeoBrojilac: number;
  udeoImenilac: number;
  napomena: string | null;
  user: { pseudonim: string; email?: string };
};

type Kanal = {
  brojKoraka: number;
  zatvoren: boolean;
  osnivaciZakljucani: boolean;
};

type Status = {
  ukupnoEvidentirano: number;
  brojKoraka: number;
  ukupnoKoraka?: number;
  zatvoren: boolean;
  poslednjiPrag: number;
  gornjaGranica: number;
  preostalo: number;
  procenatIskoriscenja: number;
  ukupanPoenUSistemu: number;
  sledeciPrag: number;
  osnivaciZakljucani?: boolean;
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
  // Dva odvojena upita: pad statusa kanala ne sme da sakrije listu osnivača
  // (inače lista deluje prazno i admin duplira unos → P2002 na serveru).
  const { data: listaData, isLoading: ucitavanje, error: greskaListe, refetch: refetchLista } = useQuery({
    queryKey: ["admin-osnivaci"],
    queryFn: async (): Promise<{ osnivaci: Osnivac[]; kanal: Kanal | null }> => {
      const res = await fetch("/api/admin/osnivaci");
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error ?? t("osnivaci_greska_ucitavanja"));
      return { osnivaci: d.osnivaci ?? [], kanal: d.kanal ?? null };
    },
  });
  const { data: statusData, error: greskaStatusa, refetch: refetchStatus } = useQuery({
    queryKey: ["admin-osnivacki-status"],
    queryFn: async (): Promise<Status | null> => {
      const res = await fetch("/api/javno/osnivacki-doprinos");
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error ?? t("osnivaci_greska_ucitavanja"));
      return d.status ?? null;
    },
  });
  const refetch = () => Promise.all([refetchLista(), refetchStatus()]);
  const osnivaci = listaData?.osnivaci ?? [];
  const kanal = listaData?.kanal ?? null;
  const status = statusData ?? null;
  const [radnja, setRadnja] = useState<string | null>(null);

  // Forma za dodavanje
  const [userId, setUserId] = useState("");
  const [brojilac, setBrojilac] = useState("");
  const [imenilac, setImenilac] = useState("");
  const [redniBroj, setRedniBroj] = useState("");
  const [napomena, setNapomena] = useState("");
  const [greska, setGreska] = useState("");

  // Inline izmena reda
  const [izmenaId, setIzmenaId] = useState<string | null>(null);
  const [izRedniBroj, setIzRedniBroj] = useState("");
  const [izBrojilac, setIzBrojilac] = useState("");
  const [izImenilac, setIzImenilac] = useState("");
  const [izNapomena, setIzNapomena] = useState("");
  const [greskaIzmene, setGreskaIzmene] = useState("");

  const aktiviran = (kanal?.brojKoraka ?? status?.brojKoraka ?? 0) > 0;
  const zakljucano = kanal?.osnivaciZakljucani ?? status?.osnivaciZakljucani ?? false;
  const izmeneDozvoljene = !aktiviran && !zakljucano;
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
      await refetch();
    } else {
      setGreska(d.error ?? t("osnivaci_greska_dodavanja"));
    }
  }

  function pocniIzmenu(o: Osnivac) {
    setGreskaIzmene("");
    setIzmenaId(o.id);
    setIzRedniBroj(String(o.redniBroj));
    setIzBrojilac(String(o.udeoBrojilac));
    setIzImenilac(String(o.udeoImenilac));
    setIzNapomena(o.napomena ?? "");
  }

  async function sacuvajIzmenu() {
    if (!izmenaId) return;
    setGreskaIzmene("");
    setRadnja("izmena");
    const res = await fetch(`/api/admin/osnivaci/${izmenaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        udeoBrojilac: Number(izBrojilac),
        udeoImenilac: Number(izImenilac),
        redniBroj: Number(izRedniBroj),
        napomena: izNapomena.trim() || undefined,
      }),
    });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    if (res.ok) {
      setIzmenaId(null);
      await refetch();
    } else {
      setGreskaIzmene(d.error ?? t("osnivaci_greska_izmene"));
    }
  }

  async function obrisi(id: string) {
    if (!confirm(t("osnivaci_obrisi_confirm"))) return;
    setRadnja(id);
    const res = await fetch(`/api/admin/osnivaci/${id}`, { method: "DELETE" });
    setRadnja(null);
    if (res.ok) await refetch();
    else { const d = await res.json().catch(() => ({})); alert(d.error ?? t("greska_generalna")); }
  }

  async function zakljucaj() {
    if (!confirm(t("osnivaci_zakljucaj_confirm"))) return;
    setRadnja("zakljucaj");
    const res = await fetch("/api/admin/osnivaci/zakljucaj", { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    if (res.ok) await refetch();
    else alert(d.error ?? t("greska_generalna"));
  }

  async function otkljucaj() {
    if (!confirm(t("osnivaci_otkljucaj_confirm"))) return;
    setRadnja("otkljucaj");
    const res = await fetch("/api/admin/osnivaci/zakljucaj", { method: "DELETE" });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    if (res.ok) await refetch();
    else alert(d.error ?? t("greska_generalna"));
  }

  async function evidentiraj() {
    if (!confirm(t("osnivaci_evidentiraj_confirm"))) return;
    setRadnja("triger");
    const res = await fetch("/api/admin/osnivacki/triger", { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    alert(res.ok ? (d.poruka ?? "Gotovo.") : (d.error ?? t("greska_generalna")));
    if (res.ok) { await refetch(); onDone(); }
  }

  if (ucitavanje) return <p className="text-sm text-kolo-muted">{t("osnivaci_ucitavanje")}</p>;

  const inputCls = "w-full px-2 py-1 rounded-lg border border-kolo-border text-sm outline-none focus:border-kolo-green-700";

  return (
    <div className="space-y-6">
      {(greskaListe || greskaStatusa) && (
        <div className="text-sm text-kolo-danger bg-kolo-danger-light rounded-xl px-4 py-3 space-y-1">
          {greskaListe && <p>{t("osnivaci_greska_liste")}: {(greskaListe as Error).message}</p>}
          {greskaStatusa && <p>{t("osnivaci_greska_statusa")}: {(greskaStatusa as Error).message}</p>}
        </div>
      )}

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
            <Stat label={t("osnivaci_stat_koraka")} value={`${status.brojKoraka} / ${status.ukupnoKoraka ?? 100}`} />
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
            disabled={radnja === "triger" || status.zatvoren || !zakljucano}
            className="mt-4 px-4 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
          >
            {radnja === "triger" ? t("osnivaci_evidentiraj_loading") : t("osnivaci_evidentiraj_btn")}
          </button>
          <p className="mt-2 text-xs text-kolo-muted">
            {zakljucano ? t("osnivaci_evidentiraj_napomena") : t("osnivaci_evidentiraj_treba_zakljucati")}
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
          <p className="text-sm text-kolo-muted">
            {greskaListe ? t("osnivaci_lista_nedostupna") : t("osnivaci_nema")}
          </p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[30rem]">
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
                izmenaId === o.id ? (
                  <tr key={o.id} className="border-b border-kolo-border last:border-0 bg-kolo-bg/50">
                    <td className="py-2 pr-2 w-16">
                      <input type="number" value={izRedniBroj} onChange={(e) => setIzRedniBroj(e.target.value)} className={inputCls} />
                    </td>
                    <td className="py-2 font-medium text-kolo-text"><Pseudonim>{o.user.pseudonim}</Pseudonim></td>
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-1">
                        <input type="number" value={izBrojilac} onChange={(e) => setIzBrojilac(e.target.value)} className={`${inputCls} w-16`} />
                        <span className="text-kolo-muted">/</span>
                        <input type="number" value={izImenilac} onChange={(e) => setIzImenilac(e.target.value)} className={`${inputCls} w-16`} />
                      </div>
                    </td>
                    <td className="py-2 pr-2">
                      <input type="text" value={izNapomena} onChange={(e) => setIzNapomena(e.target.value)} maxLength={200} className={inputCls} />
                    </td>
                    <td className="py-2 text-right whitespace-nowrap">
                      <button onClick={sacuvajIzmenu} disabled={radnja === "izmena" || !izRedniBroj || !izBrojilac || !izImenilac}
                        className="px-2.5 py-1 bg-kolo-green-700 text-white text-xs font-semibold rounded-lg disabled:opacity-60">
                        {t("osnivaci_sacuvaj_btn")}
                      </button>
                      <button onClick={() => setIzmenaId(null)} disabled={radnja === "izmena"}
                        className="ml-1 px-2.5 py-1 bg-kolo-bg text-kolo-muted text-xs font-semibold rounded-lg disabled:opacity-60">
                        {t("osnivaci_otkazi_btn")}
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={o.id} className="border-b border-kolo-border last:border-0">
                    <td className="py-2">{o.redniBroj}</td>
                    <td className="py-2 font-medium text-kolo-text"><Pseudonim>{o.user.pseudonim}</Pseudonim></td>
                    <td className="py-2">
                      {o.udeoBrojilac}/{o.udeoImenilac}
                      <span className="text-kolo-muted"> ({Math.round((o.udeoBrojilac / o.udeoImenilac) * 1000) / 10}%)</span>
                    </td>
                    <td className="py-2 text-kolo-muted">{o.napomena ?? "—"}</td>
                    <td className="py-2 text-right whitespace-nowrap">
                      {izmeneDozvoljene && (
                        <>
                          <button onClick={() => pocniIzmenu(o)} disabled={radnja !== null}
                            className="px-2.5 py-1 bg-kolo-bg text-kolo-text text-xs font-semibold rounded-lg disabled:opacity-60">
                            {t("osnivaci_izmeni_btn")}
                          </button>
                          <button onClick={() => obrisi(o.id)} disabled={radnja === o.id}
                            className="ml-1 px-2.5 py-1 bg-kolo-danger-light text-kolo-danger text-xs font-semibold rounded-lg disabled:opacity-60">
                            {t("osnivaci_obrisi_btn")}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
          </div>
        )}

        {greskaIzmene && <p className="mt-3 text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greskaIzmene}</p>}

        {aktiviran ? (
          <p className="mt-3 text-xs text-kolo-muted">
            {t("osnivaci_kanal_zakljucan")}
          </p>
        ) : zakljucano ? (
          <div className="mt-4 flex items-center justify-between gap-3 bg-kolo-bg rounded-xl px-4 py-3">
            <p className="text-sm text-kolo-text font-medium">🔒 {t("osnivaci_zakljucano_info")}</p>
            <button onClick={otkljucaj} disabled={radnja === "otkljucaj"}
              className="px-3 py-1.5 rounded-lg bg-white border border-kolo-border text-kolo-text text-xs font-semibold disabled:opacity-60">
              {t("osnivaci_otkljucaj_btn")}
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <button
              onClick={zakljucaj}
              disabled={radnja === "zakljucaj" || !udeliValidni || !!greskaListe}
              className="px-4 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
            >
              🔒 {t("osnivaci_zakljucaj_btn")}
            </button>
            {!udeliValidni && (
              <p className="mt-2 text-xs text-kolo-muted">{t("osnivaci_zakljucaj_uslov")}</p>
            )}
          </div>
        )}
      </div>

      {/* Forma za dodavanje */}
      {izmeneDozvoljene && (
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
            disabled={radnja === "dodaj" || !!greskaListe || !userId || !brojilac || !imenilac || !redniBroj}
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
