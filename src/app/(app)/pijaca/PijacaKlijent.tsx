"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Pseudonim from "@/components/Pseudonim";
import CategoryChips from "@/components/CategoryChips";
import { formatCenaGlavni, prikaziJedinicuCene } from "@/lib/cena-oglas";
import { KATEGORIJE, kategorijaKljuc, kategorijaEmoji } from "@/lib/kategorije";

interface Listing {
  id: string;
  title: string;
  description: string;
  tip: string;
  cenaTip: string;
  price: number | null;
  cenaDo: number | null;
  category: string;
  slike: number;
  location: string | null;
  createdAt: string;
  sellerId: string;
  sellerPseudonim: string;
  sellerVerified: boolean;
}

interface Props {
  listings: Listing[];
  isVerified: boolean;
  // Predizabrane kategorije iz URL-a (?kat=slug1,slug2) — validirane na serveru.
  initialKat?: string[];
  // Kategorije koje ulogovani korisnik prati (za čip „Samo praćene").
  pracene?: string[];
}

export default function PijacaKlijent({ listings, isVerified, initialKat = [], pracene = [] }: Props) {
  const t = useTranslations("pijaca");
  const router = useRouter();
  const [tipPrikaza, setTipPrikaza] = useState<"PONUDA" | "POTRAZNJA">("PONUDA");
  const [selektovaneKat, setSelektovaneKat] = useState<string[]>(initialKat);
  const [pretraga, setPretraga] = useState("");
  const [sort, setSort] = useState("novo");
  const [minCena, setMinCena] = useState("");
  const [maxCena, setMaxCena] = useState("");
  const [showCena, setShowCena] = useState(false);
  const [showKat, setShowKat] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [kontaktLoadingId, setKontaktLoadingId] = useState<string | null>(null);

  // Stanje filtera živi u URL-u (?kat=slug1,slug2) — link je deljiv, a SSR
  // otvara stranicu sa predizabranim čipovima. replaceState ne okida novu
  // server navigaciju (filtriranje je ionako klijentsko).
  const azurirajKategorije = useCallback((next: string[]) => {
    setSelektovaneKat(next);
    const params = new URLSearchParams(window.location.search);
    if (next.length > 0) params.set("kat", next.join(","));
    else params.delete("kat");
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, []);

  // „Samo praćene" je aktivno kad je izbor identičan skupu praćenih kategorija.
  const samoPraceneAktivno =
    pracene.length > 0 &&
    selektovaneKat.length === pracene.length &&
    pracene.every((k) => selektovaneKat.includes(k));

  // Filtriranje + sortiranje se računa SAMO kad se promene ulazi — ne na svaki
  // render (npr. otvaranje dropdown-a `showKat`/`showCena` ili kontakt-loading
  // više ne preračunava i ne presortirava celu listu).
  // Brojači za prekidač Ponude | Potražnja (nezavisno od ostalih filtera).
  const brojPonuda = useMemo(() => listings.filter((l) => l.tip !== "POTRAZNJA").length, [listings]);
  const brojPotraznja = useMemo(() => listings.filter((l) => l.tip === "POTRAZNJA").length, [listings]);
  const jePotraznja = tipPrikaza === "POTRAZNJA";

  // Brojači po kategoriji za čipove — aktivni oglasi tekućeg taba (Ponude/Potražnja).
  const brojaciKat = useMemo(() => {
    const brojaci: Record<string, number> = Object.fromEntries(KATEGORIJE.map((k) => [k, 0]));
    for (const l of listings) {
      if (jePotraznja ? l.tip !== "POTRAZNJA" : l.tip === "POTRAZNJA") continue;
      brojaci[l.category] = (brojaci[l.category] ?? 0) + 1;
    }
    return brojaci;
  }, [listings, jePotraznja]);

  const filtrirani = useMemo(() => {
    return listings
      .filter((l) => {
        // Kod potražnje oglasi imaju tip POTRAZNJA; ponude su sve ostalo (uklj. legacy bez tip-a).
        if (jePotraznja ? l.tip !== "POTRAZNJA" : l.tip === "POTRAZNJA") return false;
        // Multi-select kategorije, OR logika: prazan izbor = sve kategorije.
        if (selektovaneKat.length > 0 && !selektovaneKat.includes(l.category)) return false;
        if (pretraga && !l.title.toLowerCase().includes(pretraga.toLowerCase())) return false;
        // „Po dogovoru" (price = null) ne ulazi u numerički filter cene.
        if (minCena && (l.price == null || l.price < Number(minCena))) return false;
        if (maxCena && (l.price == null || l.price > Number(maxCena))) return false;
        return true;
      })
      .sort((a, b) => {
        // „Po dogovoru" oglasi idu na kraj pri sortiranju po ceni.
        if (sort === "jeftino") return (a.price ?? Infinity) - (b.price ?? Infinity);
        if (sort === "skupo") return (b.price ?? -Infinity) - (a.price ?? -Infinity);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [listings, jePotraznja, selektovaneKat, pretraga, sort, minCena, maxCena]);

  // Razmenu članovi dogovaraju međusobno (obligaciono pravo); Protokol ne posreduje.
  // Pijaca samo povezuje kupca i prodavca — otvara 1-na-1 razgovor.
  // useCallback: stabilna referenca → memo-izovane kartice se ne re-renderuju
  // samo zato što se roditelj iznova iscrtao.
  const handleKontakt = useCallback(async (oglasId: string, sellerId: string) => {
    setKontaktLoadingId(oglasId);
    const res = await fetch("/api/poruke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: sellerId }),
    });
    if (!res.ok) { setKontaktLoadingId(null); return; }
    const data = await res.json();
    router.push(`/poruke?k=${data.konverzacijaId}`);
  }, [router]);

  return (
    <div className="space-y-5">
      {/* Zaglavlje */}
      <div className="flex justify-between items-center">
        <h1 className="kolo-naslov" style={{ letterSpacing: "-0.02em" }}>{t("naslov")}</h1>
        {isVerified ? (
          <Link
            href={jePotraznja ? "/pijaca/novi-oglas?tip=potraznja" : "/pijaca/novi-oglas"}
            className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
          >
            {jePotraznja ? t("nova_potraznja") : t("novi_oglas")}
          </Link>
        ) : (
          <span className="text-xs text-kolo-muted">{t("zatrazi_verifikaciju_oglas")}</span>
        )}
      </div>

      {/* Prekidač: Ponude | Potražnja */}
      <div className="inline-flex rounded-xl border border-kolo-border bg-white p-1">
        {([
          { val: "PONUDA" as const, label: t("tab_ponude"), broj: brojPonuda },
          { val: "POTRAZNJA" as const, label: t("tab_potraznja"), broj: brojPotraznja },
        ]).map(({ val, label, broj }) => (
          <button
            key={val}
            type="button"
            onClick={() => setTipPrikaza(val)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              tipPrikaza === val
                ? "bg-kolo-green-700 text-white"
                : "text-kolo-muted hover:text-kolo-text"
            }`}
          >
            {label} <span className="opacity-70">({broj})</span>
          </button>
        ))}
      </div>

      {/* Čip filter kategorija — ispod tabova Ponude/Potražnja, iznad grida.
          Multi-select sa OR logikom; stanje u URL-u (?kat=). Bez padajućeg menija. */}
      <CategoryChips
        mode="multi"
        selected={selektovaneKat}
        onChange={azurirajKategorije}
        counts={brojaciKat}
        leadingChip={
          pracene.length > 0
            ? {
                label: t("samo_pracene"),
                active: samoPraceneAktivno,
                onClick: () => azurirajKategorije(samoPraceneAktivno ? [] : [...pracene]),
              }
            : undefined
        }
      />

      {/* Filteri: levo padajuci meniji (cena + sortiranje), desno pretraga (pola sirine) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* LEVO — padajuci meniji */}
          <div className="flex gap-2 flex-wrap items-center">
            {/* Kategorija — padajući meni (isti dizajn kao Cena/Sortiranje).
                Deli isto multi-select stanje sa čipovima: klik na stavku
                uključuje/isključuje kategoriju, „Sve kategorije" briše izbor. */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowKat((v) => !v)}
                className={`px-3 py-2 rounded-xl border bg-white text-sm transition-colors ${
                  selektovaneKat.length > 0
                    ? "border-kolo-green-700 text-kolo-green-900 font-medium"
                    : "border-kolo-border text-kolo-text hover:border-kolo-green-700"
                }`}
              >
                {selektovaneKat.length === 0
                  ? t("sve_kategorije")
                  : `${t("kategorija_filter")} (${selektovaneKat.length})`}
              </button>
              {showKat && (
                <div className="absolute z-20 left-0 mt-1 min-w-[13rem] max-h-72 overflow-y-auto bg-white rounded-xl border border-kolo-border shadow-lg p-1">
                  <button
                    onClick={() => { azurirajKategorije([]); setShowKat(false); }}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selektovaneKat.length === 0 ? "bg-kolo-green-100 text-kolo-green-900 font-medium" : "text-kolo-text hover:bg-kolo-bg"
                    }`}
                  >
                    {t("sve_kategorije")}
                  </button>
                  {KATEGORIJE.map((kat) => {
                    const aktivna = selektovaneKat.includes(kat);
                    return (
                      <button
                        key={kat}
                        onClick={() =>
                          azurirajKategorije(
                            aktivna ? selektovaneKat.filter((k) => k !== kat) : [...selektovaneKat, kat]
                          )
                        }
                        className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          aktivna ? "bg-kolo-green-100 text-kolo-green-900 font-medium" : "text-kolo-text hover:bg-kolo-bg"
                        }`}
                      >
                        {aktivna ? "✓ " : ""}{t(`kategorija_${kategorijaKljuc(kat)}`)}
                        <span className="opacity-60"> ({brojaciKat[kat] ?? 0})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cena — dropdown sa min/max. Kod potražnje nema iznosa, pa se sakriva. */}
            {!jePotraznja && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCena((v) => !v)}
                className={`px-3 py-2 rounded-xl border bg-white text-sm transition-colors ${
                  minCena || maxCena
                    ? "border-kolo-green-700 text-kolo-green-900 font-medium"
                    : "border-kolo-border text-kolo-text hover:border-kolo-green-700"
                }`}
              >
                {t("cena_filter")}
                {minCena || maxCena ? ` (${minCena || "0"}–${maxCena || "∞"})` : ""}
              </button>
              {showCena && (
                <div className="absolute z-20 left-0 mt-1 bg-white rounded-xl border border-kolo-border shadow-lg p-3 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder={t("min_poen")}
                    value={minCena}
                    onChange={(e) => setMinCena(e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-lg border border-kolo-border bg-white text-xs outline-none focus:border-kolo-green-700 transition-colors"
                  />
                  <span className="text-kolo-border text-xs">—</span>
                  <input
                    type="number"
                    min={0}
                    placeholder={t("max_poen")}
                    value={maxCena}
                    onChange={(e) => setMaxCena(e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-lg border border-kolo-border bg-white text-xs outline-none focus:border-kolo-green-700 transition-colors"
                  />
                  {(minCena || maxCena) && (
                    <button onClick={() => { setMinCena(""); setMaxCena(""); }} className="text-xs text-kolo-muted hover:text-kolo-text">
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>
            )}

            {/* Sortiranje — dropdown (isti dizajn kao Cena), default Najnovije. Kod potražnje nema sortiranja po ceni. */}
            {!jePotraznja && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSort((v) => !v)}
                className={`px-3 py-2 rounded-xl border bg-white text-sm transition-colors ${
                  sort !== "novo"
                    ? "border-kolo-green-700 text-kolo-green-900 font-medium"
                    : "border-kolo-border text-kolo-text hover:border-kolo-green-700"
                }`}
              >
                {t(`sort_${sort}`)}
              </button>
              {showSort && (
                <div className="absolute z-20 left-0 mt-1 min-w-[10rem] bg-white rounded-xl border border-kolo-border shadow-lg p-1">
                  {(["novo", "jeftino", "skupo"] as const).map((val) => (
                    <button
                      key={val}
                      onClick={() => { setSort(val); setShowSort(false); }}
                      className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        sort === val ? "bg-kolo-green-100 text-kolo-green-900 font-medium" : "text-kolo-text hover:bg-kolo-bg"
                      }`}
                    >
                      {t(`sort_${val}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            )}
          </div>

          {/* DESNO — pretraga (pola sirine, pomerena desno) */}
          <input
            type="text"
            placeholder={t("pretrazi_placeholder")}
            value={pretraga}
            onChange={(e) => setPretraga(e.target.value)}
            className="w-full sm:w-1/2 sm:ml-auto px-4 py-2 rounded-xl border border-kolo-border bg-white text-sm outline-none focus:border-kolo-green-700 transition-colors"
          />
        </div>
      </div>

      {/* Lista oglasa */}
      {filtrirani.length === 0 ? (
        <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-10 flex flex-col items-center text-center gap-2">
          <div className="text-kolo-green-500">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-kolo-text">
            {(jePotraznja ? brojPotraznja : brojPonuda) === 0
              ? t(jePotraznja ? "nema_potraznja_naslov" : "nema_oglasa_naslov")
              : t("nema_rezultata_naslov")}
          </p>
          <p className="text-sm text-kolo-muted">
            {(jePotraznja ? brojPotraznja : brojPonuda) === 0
              ? t(jePotraznja ? "nema_potraznja_opis" : "nema_oglasa_opis")
              : t("nema_rezultata_opis")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrirani.map((l, i) => (
            <OglasKartica
              key={l.id}
              oglas={l}
              isVerified={isVerified}
              kontaktLoading={kontaktLoadingId === l.id}
              onKontakt={handleKontakt}
              t={t}
              prioritet={i < 2}
            />
          ))}
        </div>
      )}

      {/* Plutajuće dugme za novi oglas — uvek dostupno bez skrolovanja na vrh.
          Na mobilnom samo krug sa plusom, na širim ekranima plus + tekst. */}
      {isVerified && (
        <Link
          href={jePotraznja ? "/pijaca/novi-oglas?tip=potraznja" : "/pijaca/novi-oglas"}
          aria-label={jePotraznja ? t("nova_potraznja") : t("novi_oglas")}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-kolo-green-700 text-white rounded-full shadow-lg hover:bg-kolo-green-900 active:scale-95 transition-all p-4 sm:py-3 sm:px-5"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="hidden sm:inline text-sm font-semibold">
            {jePotraznja ? t("nova_potraznja") : t("novi_oglas")}
          </span>
        </Link>
      )}
    </div>
  );
}

// ── Kartica oglasa ─────────────────────────────────────────────────────────────

type TFunction = ReturnType<typeof useTranslations<"pijaca">>;

const OglasKartica = memo(function OglasKartica({
  oglas,
  isVerified,
  kontaktLoading,
  onKontakt,
  t,
  prioritet,
}: {
  oglas: Listing;
  isVerified: boolean;
  kontaktLoading: boolean;
  onKontakt: (oglasId: string, sellerId: string) => void;
  t: TFunction;
  prioritet: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl card-shadow border border-kolo-border overflow-hidden flex flex-col">
      {/* Slika ili placeholder — ceo blok vodi na oglas */}
      <Link href={`/pijaca/${oglas.id}`} className="relative w-full h-[180px] bg-kolo-bg flex items-center justify-center">
        {oglas.slike > 0 ? (
          // `unoptimized` UKLONJEN: Next sad servira sliku u pravoj veličini (WebP/AVIF),
          // ne original ~1600px za okvir od 180px — glavni krivac za LCP 8.8s na mobilnom.
          // `sizes` opisuje stvarnu širinu (1 kolona mobilno, 2 desktop). Prve 2 kartice
          // (iznad pregiba) dobijaju `priority` da browser odmah povuče LCP sliku.
          <Image
            src={`/api/pijaca/slika/${oglas.id}/0`}
            alt={oglas.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-contain"
            priority={prioritet}
          />
        ) : (
          <span className="text-4xl">{kategorijaEmoji(oglas.category)}</span>
        )}
        <span className="absolute top-2 left-2 bg-white/90 text-kolo-muted text-xs font-medium px-2 py-0.5 rounded-lg">
          {t(`kategorija_${kategorijaKljuc(oglas.category)}`)}
        </span>
      </Link>

      {/* Sadržaj */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/pijaca/${oglas.id}`} className="font-semibold text-kolo-text text-sm hover:text-kolo-green-700 transition-colors line-clamp-2">
              {oglas.title}
            </Link>
            <p className="text-xs text-kolo-muted mt-0.5 line-clamp-1">{oglas.description}</p>
          </div>
          {oglas.tip === "POTRAZNJA" ? (
            <span className="shrink-0 bg-kolo-gold-100 text-kolo-gold-600 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide self-start">
              {t("trazi_se")}
            </span>
          ) : (
            <div className="shrink-0 bg-kolo-green-100 rounded-xl px-2.5 py-1.5 text-center">
              <p className="text-base font-bold text-kolo-green-700 leading-none">
                {formatCenaGlavni(oglas, t("cena_po_dogovoru"))}
              </p>
              {prikaziJedinicuCene(oglas) && (
                <p className="text-[10px] text-kolo-green-700 opacity-70">
                  POEN
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center gap-2 mt-auto pt-2 border-t border-kolo-border">
          <span className="text-xs text-kolo-muted truncate min-w-0">
            <Pseudonim>{oglas.sellerPseudonim}</Pseudonim>
            {oglas.location && <span className="ml-1">· {oglas.location}</span>}
          </span>
          {isVerified ? (
            <button
              onClick={() => onKontakt(oglas.id, oglas.sellerId)}
              disabled={kontaktLoading}
              className="shrink-0 px-3 py-1.5 bg-kolo-green-700 text-white text-xs font-semibold rounded-lg hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
            >
              {kontaktLoading ? "..." : oglas.tip === "POTRAZNJA" ? t("javi_se") : t("kontaktiraj")}
            </button>
          ) : (
            <Link href="/tabla-jemstva" className="shrink-0 text-xs text-kolo-gold-600 hover:underline">
              {t("zatrazi_verifikaciju_link")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
});
