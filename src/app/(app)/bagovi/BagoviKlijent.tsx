"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Pseudonim from "@/components/Pseudonim";

type BugStatus = "PRIJAVLJEN" | "U_RADU" | "RESENO" | "ODBIJENO";

interface Bag {
  id: string;
  naslov: string;
  opis: string;
  status: BugStatus;
  odgovor: string | null;
  resenoAt: string | null;
  createdAt: string;
  prijavio: string;
  mojBag: boolean;
}

const STATUS_REDOSLED: Record<BugStatus, number> = {
  U_RADU: 0,
  PRIJAVLJEN: 1,
  RESENO: 2,
  ODBIJENO: 3,
};

const STATUS_STIL: Record<BugStatus, string> = {
  PRIJAVLJEN: "bg-kolo-gold-100 text-kolo-gold-600",
  U_RADU: "bg-blue-100 text-blue-700",
  RESENO: "bg-kolo-green-100 text-kolo-green-700",
  ODBIJENO: "bg-kolo-bg text-kolo-muted",
};

const SVI_STATUSI: BugStatus[] = ["PRIJAVLJEN", "U_RADU", "RESENO", "ODBIJENO"];

export default function BagoviKlijent() {
  const t = useTranslations("bagovi");
  const tc = useTranslations("common");
  const { data: session } = useSession();
  const jeAdmin = session?.user.admin === "ADMIN" || session?.user.admin === "SUPERADMIN";

  const [bagovi, setBagovi] = useState<Bag[] | null>(null);
  const [naslov, setNaslov] = useState("");
  const [opis, setOpis] = useState("");
  const [slanje, setSlanje] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const [uspeh, setUspeh] = useState(false);

  const ucitaj = useCallback(() => {
    fetch("/api/bagovi")
      .then((r) => r.json())
      .then((d) => setBagovi(Array.isArray(d) ? d : []))
      .catch(() => setBagovi([]));
  }, []);

  useEffect(() => {
    ucitaj();
  }, [ucitaj]);

  async function posalji(e: React.FormEvent) {
    e.preventDefault();
    setGreska(null);
    setUspeh(false);
    if (naslov.trim().length < 3 || opis.trim().length < 10) {
      setGreska(t("validacija"));
      return;
    }
    setSlanje(true);
    try {
      const r = await fetch("/api/bagovi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ naslov, opis }),
      });
      const j = await r.json();
      if (!r.ok) {
        setGreska(j.error ?? tc("greska_ucitavanja"));
        return;
      }
      setNaslov("");
      setOpis("");
      setUspeh(true);
      ucitaj();
    } catch {
      setGreska(tc("greska_ucitavanja"));
    } finally {
      setSlanje(false);
    }
  }

  async function promeniStatus(id: string, status: BugStatus) {
    setBagovi((prev) =>
      prev ? prev.map((b) => (b.id === id ? { ...b, status } : b)) : prev
    );
    await fetch(`/api/admin/bagovi/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
    ucitaj();
  }

  const sortirani = bagovi
    ? [...bagovi].sort(
        (a, b) =>
          STATUS_REDOSLED[a.status] - STATUS_REDOSLED[b.status] ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="kolo-naslov" style={{ letterSpacing: "-0.02em" }}>
          {t("naslov")}
        </h1>
        <p className="text-sm text-kolo-muted mt-1">{t("uvod")}</p>
      </div>

      {/* Forma za prijavu */}
      <form onSubmit={posalji} className="bg-white rounded-2xl card-shadow border border-kolo-border p-5 space-y-3">
        <p className="text-sm font-semibold text-kolo-text">{t("forma_naslov")}</p>
        <input
          type="text"
          value={naslov}
          onChange={(e) => setNaslov(e.target.value)}
          placeholder={t("placeholder_naslov")}
          maxLength={200}
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm focus:outline-none focus:ring-2 focus:ring-kolo-green-500/40"
        />
        <textarea
          value={opis}
          onChange={(e) => setOpis(e.target.value)}
          placeholder={t("placeholder_opis")}
          rows={4}
          maxLength={4000}
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm focus:outline-none focus:ring-2 focus:ring-kolo-green-500/40 resize-y"
        />
        {greska && <p className="text-xs text-red-500">{greska}</p>}
        {uspeh && <p className="text-xs text-kolo-green-700">{t("poslato")}</p>}
        <button
          type="submit"
          disabled={slanje}
          className="px-5 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 transition-colors disabled:opacity-50"
        >
          {slanje ? tc("saljem") : t("prijavi_btn")}
        </button>
      </form>

      {/* Lista prijava */}
      <div>
        <h2 className="text-base font-semibold text-kolo-text mb-3">{t("lista_naslov")}</h2>
        {bagovi === null ? (
          <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 text-center text-sm text-kolo-muted">
            {tc("ucitavanje")}
          </div>
        ) : sortirani.length === 0 ? (
          <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 text-center text-sm text-kolo-muted">
            {t("nema_prijava")}
          </div>
        ) : (
          <div className="space-y-3">
            {sortirani.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl card-shadow border border-kolo-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-kolo-text break-words">{b.naslov}</p>
                    <p className="text-xs text-kolo-muted mt-0.5">
                      <Pseudonim>{b.prijavio}</Pseudonim>
                      {b.mojBag && <span className="text-kolo-green-700"> · {t("ti")}</span>}
                      {" · "}
                      {new Date(b.createdAt).toLocaleDateString("sr-RS")}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg ${STATUS_STIL[b.status]}`}
                  >
                    {t(`status_${b.status}`)}
                  </span>
                </div>

                <p className="text-sm text-kolo-text mt-2 whitespace-pre-wrap break-words">{b.opis}</p>

                {b.odgovor && (
                  <div className="mt-3 rounded-xl bg-kolo-bg border border-kolo-border p-3">
                    <p className="text-xs font-semibold text-kolo-muted">{t("odgovor_naslov")}</p>
                    <p className="text-sm text-kolo-text mt-0.5 whitespace-pre-wrap break-words">{b.odgovor}</p>
                  </div>
                )}

                {jeAdmin && (
                  <div className="mt-3 pt-3 border-t border-kolo-border flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-kolo-muted">{t("admin_promeni_status")}</span>
                    {SVI_STATUSI.map((s) => (
                      <button
                        key={s}
                        onClick={() => promeniStatus(b.id, s)}
                        disabled={b.status === s}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                          b.status === s
                            ? `${STATUS_STIL[s]} opacity-100 cursor-default`
                            : "bg-kolo-bg text-kolo-muted hover:bg-kolo-border/40"
                        }`}
                      >
                        {t(`status_${s}`)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
