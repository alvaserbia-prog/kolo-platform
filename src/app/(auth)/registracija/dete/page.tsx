"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PrikaziLozinkuDugme from "@/components/PrikaziLozinkuDugme";
import { MODUL_DECA_AKTIVAN } from "@/lib/moduli";

/**
 * Registracija deteta (Modul Deca, čl. 4a).
 *
 * 🔴 Zaseban obrazac, ne prekidač u obrascu za odrasle. Traži se drugačiji skup
 * podataka (imejl RODITELJA umesto svog, bez mesta, bez datuma rođenja), a rečenice
 * su pisane detetu. Jedan obrazac koji se granа bio bi duži i za odraslog i za dete.
 *
 * Dete NE unosi datum rođenja — upisuje ga roditelj pri preuzimanju (čl. 7), jer je
 * roditeljska izjava jedina provera godina kojom sistem raspolaže.
 */
export default function RegistracijaDetetaPage() {
  const router = useRouter();
  const t = useTranslations("registracijaDeteta");
  const [pseudonim, setPseudonim] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [prikaziLozinku, setPrikaziLozinku] = useState(false);
  const [roditeljEmail, setRoditeljEmail] = useState("");
  const [greska, setGreska] = useState("");
  const [salje, setSalje] = useState(false);
  const [kod, setKod] = useState<string | null>(null);

  if (!MODUL_DECA_AKTIVAN) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-kolo-border bg-white p-6 text-sm text-kolo-muted">
        {t("ugaseno")}
      </div>
    );
  }

  async function posalji(e: React.FormEvent) {
    e.preventDefault();
    setGreska("");
    setSalje(true);
    try {
      const res = await fetch("/api/deca/registracija", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudonim, lozinka, roditeljEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? t("greska"));
      // Kod se prikazuje ODMAH, pre prijave: to je rezervni put do roditelja ako
      // poruka ne stigne, a dete ga sa ovog ekrana može odmah pročitati naglas.
      setKod(data.kod);
      await signIn("credentials", { email: pseudonim, password: lozinka, redirect: false });
    } catch (err) {
      setGreska(err instanceof Error ? err.message : t("greska"));
    } finally {
      setSalje(false);
    }
  }

  if (kod) {
    return (
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-kolo-border bg-white p-6 card-shadow">
        <h1 className="text-xl font-bold text-kolo-text">{t("uspeh_naslov")}</h1>
        <p className="text-sm text-kolo-muted">{t("uspeh_opis", { email: roditeljEmail })}</p>
        <div className="rounded-xl bg-kolo-bg p-4 text-center">
          <p className="text-xs text-kolo-muted">{t("kod_naslov")}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-widest tabular-nums text-kolo-text">
            {kod}
          </p>
          <p className="mt-1 text-xs text-kolo-muted">{t("kod_opis")}</p>
        </div>
        <button
          onClick={() => router.push("/pocetna")}
          className="w-full rounded-xl bg-kolo-green-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-kolo-green-500"
        >
          {t("dalje")}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="card-shadow rounded-2xl border border-kolo-border bg-white p-6">
        <h1 className="text-xl font-bold text-kolo-text">{t("naslov")}</h1>
        <p className="mt-1 text-sm text-kolo-muted">{t("podnaslov")}</p>

        <form onSubmit={posalji} noValidate className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-kolo-text">
              {t("pseudonim")}
            </label>
            <input
              value={pseudonim}
              onChange={(e) => setPseudonim(e.target.value)}
              maxLength={30}
              autoComplete="username"
              placeholder={t("pseudonim_placeholder")}
              className="w-full rounded-xl border border-kolo-border px-4 py-3 text-sm outline-none transition-colors focus:border-kolo-green-700"
            />
            <p className="mt-1 text-xs text-kolo-muted">{t("pseudonim_opis")}</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-kolo-text">{t("lozinka")}</label>
            <div className="relative">
              <input
                type={prikaziLozinku ? "text" : "password"}
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl border border-kolo-border px-4 py-3 pr-11 text-sm outline-none transition-colors focus:border-kolo-green-700"
              />
              <PrikaziLozinkuDugme
                prikazan={prikaziLozinku}
                onToggle={() => setPrikaziLozinku((v) => !v)}
                prikaziLabel={t("prikazi_lozinku")}
                sakrijLabel={t("sakrij_lozinku")}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-kolo-text">
              {t("email_roditelja")}
            </label>
            <input
              type="email"
              value={roditeljEmail}
              onChange={(e) => setRoditeljEmail(e.target.value)}
              placeholder="mama@primer.rs"
              className="w-full rounded-xl border border-kolo-border px-4 py-3 text-sm outline-none transition-colors focus:border-kolo-green-700"
            />
            <p className="mt-1 text-xs text-kolo-muted">{t("email_roditelja_opis")}</p>
          </div>

          {greska && (
            <p className="rounded-lg bg-kolo-danger-light px-3 py-2 text-sm text-kolo-danger">
              {greska}
            </p>
          )}

          <button
            type="submit"
            disabled={salje || !pseudonim.trim() || lozinka.length < 8 || !roditeljEmail.includes("@")}
            className="w-full rounded-xl bg-kolo-green-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-kolo-green-500 disabled:opacity-50"
          >
            {salje ? t("dugme_salje") : t("dugme")}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-kolo-muted">
          {t("odrastao")}{" "}
          <Link href="/registracija" className="font-medium text-kolo-green-700 hover:underline">
            {t("odrastao_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
