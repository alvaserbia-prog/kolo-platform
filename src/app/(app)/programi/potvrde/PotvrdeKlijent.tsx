"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Pseudonim from "@/components/Pseudonim";

type Stavka = {
  id: string;
  program: string;
  podnosilacId: string;
  podnosilacPseudonim: string;
};

export default function PotvrdeKlijent({ stavke }: { stavke: Stavka[] }) {
  const t = useTranslations("programi");
  const [lista, setLista] = useState(stavke);
  const [poruka, setPoruka] = useState<{ id: string; text: string; ok: boolean } | null>(null);

  function ukloni(id: string) {
    setLista((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-5">
      <div>
        <h1 className="kolo-naslov">{t("potvrde_naslov")}</h1>
        <p className="text-sm text-kolo-muted mt-1">
          {t("potvrde_opis")}
        </p>
      </div>

      {lista.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border px-5 py-8 text-center text-sm text-kolo-muted">
          {t("potvrde_prazno")}
        </div>
      ) : (
        <div className="space-y-3">
          {lista.map((s) => (
            <PotvrdaKartica
              key={s.id}
              stavka={s}
              poruka={poruka?.id === s.id ? poruka : null}
              onGotovo={(text, ok) => {
                setPoruka({ id: s.id, text, ok });
                if (ok) setTimeout(() => ukloni(s.id), 1200);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PotvrdaKartica({
  stavka,
  poruka,
  onGotovo,
}: {
  stavka: Stavka;
  poruka: { text: string; ok: boolean } | null;
  onGotovo: (text: string, ok: boolean) => void;
}) {
  const t = useTranslations("programi");
  const [odbijam, setOdbijam] = useState(false);
  const [obrazlozenje, setObrazlozenje] = useState("");
  const [loading, setLoading] = useState(false);

  async function posalji(potvrdi: boolean) {
    if (!potvrdi && obrazlozenje.trim().length === 0) {
      onGotovo(t("potvrda_obrazlozenje_obavezno"), false);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/programi/potvrde/${stavka.id}/odgovori`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ potvrdi, obrazlozenje: obrazlozenje.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      onGotovo(potvrdi ? t("potvrda_potvrdeno") : t("potvrda_odbijeno"), true);
    } else {
      onGotovo(data.error ?? t("potvrda_greska"), false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border px-5 py-4 space-y-3">
      <div>
        <p className="font-semibold text-kolo-text">{stavka.program}</p>
        <p className="text-sm text-kolo-muted">
          {t("potvrda_podnosilac")}{" "}
          <Link href={`/profil/${stavka.podnosilacId}`} className="text-kolo-green-700 hover:underline">
            @<Pseudonim>{stavka.podnosilacPseudonim}</Pseudonim>
          </Link>
        </p>
      </div>

      {!odbijam ? (
        <div className="flex gap-2">
          <button
            onClick={() => posalji(true)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "..." : t("potvrda_dugme_potvrdi")}
          </button>
          <button
            onClick={() => setOdbijam(true)}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-kolo-danger/30 text-kolo-danger text-sm font-medium"
          >
            {t("potvrda_dugme_odbij")}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            rows={2}
            value={obrazlozenje}
            onChange={(e) => setObrazlozenje(e.target.value)}
            placeholder={t("potvrda_obrazlozenje_placeholder")}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setOdbijam(false)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium"
            >
              {t("potvrda_nazad")}
            </button>
            <button
              onClick={() => posalji(false)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-kolo-danger text-white text-sm font-semibold disabled:opacity-60"
            >
              {loading ? "..." : t("potvrda_posalji_odbijanje")}
            </button>
          </div>
        </div>
      )}

      {poruka && (
        <p
          className={`text-sm px-4 py-2 rounded-xl ${
            poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"
          }`}
        >
          {poruka.text}
        </p>
      )}
    </div>
  );
}
