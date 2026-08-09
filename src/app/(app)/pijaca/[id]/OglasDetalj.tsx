"use client";

import { useState, useRef, useEffect } from "react";
import { intlTag } from "@/lib/format";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Pseudonim from "@/components/Pseudonim";
import CenaUnos from "@/components/CenaUnos";
import PodeliOglas from "@/components/PodeliOglas";
import { formatCenaGlavni, prikaziJedinicuCene, parsirajCenu, type CenaTip } from "@/lib/cena-oglas";
import { kategorijaKljuc, kategorijaEmoji } from "@/lib/kategorije";

interface OglasProps {
  id: string;
  title: string;
  description: string;
  tip: string;
  cenaTip: string;
  price: number | null;
  cenaDo: number | null;
  category: string;
  images: string[];
  location: string | null;
  phone: string | null;
  status: string;
  createdAt: string;
  sellerId: string;
  sellerPseudonim: string;
  sellerVerified: boolean;
  isMine: boolean;
  /** Broj pregleda — prikazuje se samo oglašivaču. */
  pregledi: number;
  /** Razlog uklanjanja — šalje se samo vlasniku (Uslovi čl. 25 st. 2). */
  uklonjenRazlog: string | null;
}

interface Props {
  oglas: OglasProps;
  isVerified: boolean;
  /** Prijavljen posetilac sme da prijavi sporan oglas; gost ne. */
  jePrijavljen: boolean;
}

export default function OglasDetalj({ oglas, isVerified, jePrijavljen }: Props) {
  const locale = useLocale();
  const t = useTranslations("pijaca");
  const tc = useTranslations("common");
  const router = useRouter();
  const [activeSlika, setActiveSlika] = useState(0);
  const [deaktiviranjeLoading, setDeaktiviranjeLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const jePotraznja = oglas.tip === "POTRAZNJA";

  // Zabeleži pregled oglasa — jednom po pretraživaču dnevno, da povratak na
  // isti oglas ne naduvava brojač. Sopstvene preglede odbija server.
  useEffect(() => {
    if (oglas.isMine) return;
    const kljuc = `pregled:${oglas.id}`;
    const danas = new Date().toISOString().slice(0, 10);
    try {
      if (localStorage.getItem(kljuc) === danas) return;
      localStorage.setItem(kljuc, danas);
    } catch {
      // Privatni režim / blokirano skladište — svejedno prijavi pregled.
    }
    void fetch(`/api/pijaca/${oglas.id}/pregled`, { method: "POST" }).catch(() => {});
  }, [oglas.id, oglas.isMine]);

  async function handleKontakt() {
    setChatLoading(true);
    const res = await fetch("/api/poruke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `oglasId` beleži upit povodom oglasa — uslov koraka 3 na putanji
      // doprinosa razmeni (Pravilnik čl. 40a). Razgovor se otvara i bez njega.
      body: JSON.stringify({ userId: oglas.sellerId, oglasId: oglas.id }),
    });
    setChatLoading(false);
    if (!res.ok) return;
    const data = await res.json();
    router.push(`/poruke?k=${data.konverzacijaId}`);
  }

  const imaSlika = oglas.images.length > 0;
  const dostupan = oglas.status === "ACTIVE";

  async function handleDeaktiviraj() {
    setDeaktiviranjeLoading(true);
    const res = await fetch(`/api/pijaca/${oglas.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ akcija: "deaktiviraj" }),
    });
    setDeaktiviranjeLoading(false);
    if (res.ok) router.push("/profil/oglasi");
  }

  if (editMode) {
    return (
      <IzmeniOglas
        oglas={oglas}
        onCancel={() => setEditMode(false)}
        onSuccess={() => { setEditMode(false); router.refresh(); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="/pijaca" className="text-kolo-muted hover:text-kolo-muted transition-colors text-sm">
          {t("nazad_pijaca")}
        </Link>
        <PodeliOglas naslov={oglas.title} />
      </div>

      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        {/* Slike */}
        {imaSlika ? (
          <div className="space-y-2">
            <div className="w-full bg-kolo-bg flex justify-center">
              {/* Običan <img> (ne next/image): browser uzima prave dimenzije slike,
                  pa okvir ima tačan oblik slike — bez kvadratnih/letterbox traka.
                  Uspravna ide po visini, položena po širini; identično mobilni i desktop. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/pijaca/slika/${oglas.id}/${activeSlika}`}
                alt={oglas.title}
                className="w-auto h-auto max-h-[70vh] max-w-full object-contain"
              />
            </div>
            {oglas.images.length > 1 && (
              <div className="flex gap-2 px-4 pb-2">
                {oglas.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlika(i)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeSlika === i ? "border-kolo-green-500" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={`/api/pijaca/slika/${oglas.id}/${i}`}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full aspect-[4/3] bg-kolo-bg flex items-center justify-center text-7xl">
            {kategorijaEmoji(oglas.category)}
          </div>
        )}

        {/* Detalji */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-xs text-kolo-muted font-medium uppercase tracking-wide">
                {t(`kategorija_${kategorijaKljuc(oglas.category)}`)}
              </span>
              <h1 className="text-xl font-bold text-kolo-text mt-0.5">{oglas.title}</h1>
            </div>
            <div className="shrink-0 text-right">
              {jePotraznja ? (
                <span className="inline-block bg-kolo-gold-100 text-kolo-gold-600 rounded-lg px-3 py-1.5 text-sm font-bold uppercase tracking-wide">
                  {t("trazi_se")}
                </span>
              ) : (
                <>
                  <p className="text-2xl font-bold text-kolo-green-700">{formatCenaGlavni(oglas, t("cena_po_dogovoru"))}</p>
                  {prikaziJedinicuCene(oglas) && <p className="text-sm text-kolo-green-700">{tc("poen")}</p>}
                </>
              )}
            </div>
          </div>

          {oglas.description && (
            <p className="text-sm text-kolo-muted leading-relaxed whitespace-pre-line">{oglas.description}</p>
          )}

          {/* Javna oznaka da oglašivač nije verifikovan (Uslovi 4.1.1). Vide je i
              neprijavljeni posetioci — pregled oglasa je javan, pa i upozorenje
              mora biti. Za razmenu odgovaraju sami korisnici (Pravilnik čl. 16). */}
          {!oglas.sellerVerified && (
            <p className="text-xs text-kolo-gold-600 bg-kolo-gold-100 border border-kolo-gold-100 rounded-xl px-3 py-2">
              {t("oznaka_neverifikovan_opis")}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-kolo-muted pt-1 border-t border-kolo-border">
            <span>{jePotraznja ? t("narucilac") : t("prodavac")}: <strong className="text-kolo-muted"><Pseudonim>{oglas.sellerPseudonim}</Pseudonim></strong></span>
            {oglas.location && <span>{t("lokacija")}: <strong className="text-kolo-muted">{oglas.location}</strong></span>}
            <span>{t("objavljeno")}: {new Date(oglas.createdAt).toLocaleDateString(intlTag(locale))}</span>
            {/* Brojač vidi samo oglašivač — povratna informacija njemu, a ne
                javna objava koliko je Pijaca (ne)posećena. */}
            {oglas.isMine && (
              <span>
                {t("pregleda")}: <strong className="text-kolo-muted">{oglas.pregledi}</strong>
              </span>
            )}
          </div>

          {oglas.phone && isVerified && (
            <div className="flex items-center gap-2 bg-kolo-bg rounded-xl px-4 py-3">
              <span className="text-xs text-kolo-muted">{t("kontakt_telefon_label")}</span>
              <a href={`tel:${oglas.phone}`} className="text-sm font-semibold text-kolo-green-700 hover:underline">
                {oglas.phone}
              </a>
            </div>
          )}

          {/* Status badge */}
          {oglas.status === "SOLD" && (
            <div className="bg-kolo-bg rounded-xl px-4 py-3 text-center text-sm font-semibold text-kolo-muted">
              {t("oglas_prodat")}
            </div>
          )}
          {oglas.status === "EXPIRED" && (
            <div className="bg-kolo-bg rounded-xl px-4 py-3 text-center text-sm font-semibold text-kolo-muted">
              {t("oglas_deaktiviran")}
            </div>
          )}
          {/* Uklonjen oglas — razlog vidi samo vlasnik (Uslovi čl. 25 st. 2). */}
          {oglas.status === "UKLONJEN" && (
            <div className="bg-kolo-danger-light rounded-xl px-4 py-3 text-sm text-kolo-danger space-y-1">
              <div className="font-semibold">{t("oglas_uklonjen")}</div>
              {oglas.isMine && oglas.uklonjenRazlog && (
                <>
                  <div>{t("oglas_uklonjen_razlog", { razlog: oglas.uklonjenRazlog })}</div>
                  <div className="text-xs opacity-80">{t("oglas_uklonjen_prigovor")}</div>
                </>
              )}
            </div>
          )}

          {/* Kupac → kontakt prodavca (razmenu članovi dogovaraju međusobno; Protokol ne posreduje) */}
          {dostupan && !oglas.isMine && (
            <div className="space-y-2">
              {!isVerified ? (
                <div className="bg-kolo-gold-100 border border-kolo-gold-100 rounded-xl px-4 py-3 text-sm text-kolo-gold-600">
                  <Link href="/verifikacija" className="font-semibold hover:underline">{t("zatrazi_verifikaciju_kupovina")}</Link>{" "}
                  {t("zatrazi_verifikaciju_kupovina_tekst")}
                </div>
              ) : (
                <button
                  onClick={handleKontakt}
                  disabled={chatLoading}
                  className="w-full py-3.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
                >
                  {chatLoading ? "..." : jePotraznja ? t("javi_se_narucilac") : t("kontaktiraj_prodavca")}
                </button>
              )}
            </div>
          )}

          {/* Prodavac — upravljanje */}
          {dostupan && oglas.isMine && (
            <div className="pt-2 border-t border-kolo-border flex gap-2">
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors"
              >
                {t("izmeni")}
              </button>
              <Link
                href="/profil/oglasi"
                className="flex-1 py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-semibold text-center hover:bg-kolo-border transition-colors"
              >
                {t("moji_oglasi")}
              </Link>
              <button
                onClick={handleDeaktiviraj}
                disabled={deaktiviranjeLoading}
                className="flex-1 py-2.5 rounded-xl border border-kolo-danger/20 text-kolo-danger text-sm font-semibold hover:bg-kolo-danger-light transition-colors disabled:opacity-60"
              >
                {deaktiviranjeLoading ? "..." : t("ukloni")}
              </button>
            </div>
          )}

          {/* Razmena povodom oglasa — obostrana potvrda (Pravilnik čl. 40a).
              Vidi je i oglašivač i sagovornik; uklonjen oglas je izuzet. */}
          {oglas.status !== "UKLONJEN" && jePrijavljen && (
            <RazmenaBlok oglasId={oglas.id} isMine={oglas.isMine} />
          )}

          {/* Prijava spornog oglasa (Uslovi čl. 25 st. 2). Otvorena svim
              prijavljenima — pregled oglasa je javan, pa i neverifikovani vidi
              sporan sadržaj i treba da može da ga prijavi. */}
          {dostupan && !oglas.isMine && jePrijavljen && (
            <PrijaviOglas oglasId={oglas.id} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Razmena povodom oglasa ─────────────────────────────────────────────────────

type RazmenaStavka = {
  sagovornikId: string;
  sagovornikPseudonim: string;
  status: "PREDLOZENA" | "REALIZOVANA" | "ODBIJENA";
  potvrdioOglasivac: boolean;
  potvrdioSagovornik: boolean;
  cekaMene: boolean;
};

/**
 * Obostrana potvrda razmene. Razmena ulazi u brojač putanje (čl. 40a) tek kad je
 * označe OBE strane — jednostrana tvrdnja ne vredi ništa, inače bi se lestvica
 * prolazila sama sa sobom. Fondacija ovim ne posreduje u razmeni (čl. 16).
 */
function RazmenaBlok({ oglasId, isMine }: { oglasId: string; isMine: boolean }) {
  const t = useTranslations("pijaca");
  const [razmene, setRazmene] = useState<RazmenaStavka[]>([]);
  const [upiti, setUpiti] = useState<Array<{ id: string; pseudonim: string }>>([]);
  const [ucitano, setUcitano] = useState(false);
  const [radiId, setRadiId] = useState<string | null>(null);
  const [greskaTekst, setGreskaTekst] = useState("");

  async function ucitaj() {
    const res = await fetch(`/api/pijaca/${oglasId}/razmena`);
    if (!res.ok) return setUcitano(true);
    const data = await res.json();
    setRazmene(data.razmene ?? []);
    setUpiti(data.upiti ?? []);
    setUcitano(true);
  }

  useEffect(() => {
    void ucitaj();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oglasId]);

  async function posalji(akcija: "potvrdi" | "odbij", sagovornikId?: string) {
    setRadiId(sagovornikId ?? "ja");
    setGreskaTekst("");
    try {
      const res = await fetch(`/api/pijaca/${oglasId}/razmena`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ akcija, sagovornikId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreskaTekst(data.error ?? t("razmena_greska"));
        return;
      }
      await ucitaj();
    } finally {
      setRadiId(null);
    }
  }

  if (!ucitano) return null;

  // Oglašivač bira među onima koji su mu se javili; sagovornik označava sebe.
  const mojaRazmena = isMine ? null : (razmene[0] ?? null);
  const bezRazmene = isMine
    ? upiti.filter((u) => !razmene.some((r) => r.sagovornikId === u.id))
    : [];

  if (isMine && upiti.length === 0 && razmene.length === 0) return null;

  return (
    <div className="pt-3 border-t border-kolo-border space-y-2">
      <div className="text-xs font-semibold text-kolo-text">{t("razmena_naslov")}</div>
      <p className="text-xs text-kolo-muted">
        {isMine ? t("razmena_opis_oglasivac") : t("razmena_opis_sagovornik")}
      </p>

      {razmene.map((r) => (
        <div
          key={r.sagovornikId}
          className="flex items-center justify-between gap-2 text-xs bg-kolo-bg rounded-xl px-3 py-2"
        >
          <span className="text-kolo-muted">
            {isMine ? <Pseudonim>{r.sagovornikPseudonim}</Pseudonim> : t("razmena_ja")}
          </span>
          {r.status === "REALIZOVANA" ? (
            <span className="font-semibold text-kolo-green-700">{t("razmena_realizovana")}</span>
          ) : r.status === "ODBIJENA" ? (
            <span className="text-kolo-muted">{t("razmena_odbijena")}</span>
          ) : r.cekaMene ? (
            <span className="flex gap-2">
              <button
                onClick={() => posalji("potvrdi", isMine ? r.sagovornikId : undefined)}
                disabled={radiId !== null}
                className="px-3 py-1 rounded-lg bg-kolo-green-700 text-white font-semibold disabled:opacity-50"
              >
                {t("razmena_oznaci")}
              </button>
              <button
                onClick={() => posalji("odbij", isMine ? r.sagovornikId : undefined)}
                disabled={radiId !== null}
                className="px-3 py-1 rounded-lg border border-kolo-border text-kolo-muted disabled:opacity-50"
              >
                {t("razmena_odbij")}
              </button>
            </span>
          ) : (
            <span className="text-kolo-muted">{t("razmena_ceka_drugu_stranu")}</span>
          )}
        </div>
      ))}

      {/* Oglašivač — oni koji su se javili, a razmena još nije ni predložena. */}
      {bezRazmene.map((u) => (
        <div
          key={u.id}
          className="flex items-center justify-between gap-2 text-xs bg-kolo-bg rounded-xl px-3 py-2"
        >
          <span className="text-kolo-muted">
            <Pseudonim>{u.pseudonim}</Pseudonim>
          </span>
          <button
            onClick={() => posalji("potvrdi", u.id)}
            disabled={radiId !== null}
            className="px-3 py-1 rounded-lg bg-kolo-green-700 text-white font-semibold disabled:opacity-50"
          >
            {t("razmena_oznaci")}
          </button>
        </div>
      ))}

      {/* Sagovornik koji još nije ništa označio. */}
      {!isMine && !mojaRazmena && (
        <button
          onClick={() => posalji("potvrdi")}
          disabled={radiId !== null}
          className="w-full py-2 rounded-xl border border-kolo-green-500 text-kolo-green-700 text-xs font-semibold hover:bg-kolo-green-100 transition-colors disabled:opacity-50"
        >
          {t("razmena_oznaci")}
        </button>
      )}

      {greskaTekst && <div className="text-xs text-kolo-danger">{greskaTekst}</div>}
    </div>
  );
}

// ── Prijava oglasa ─────────────────────────────────────────────────────────────

const RAZLOZI = ["ZABRANJENO_DOBRO", "OBMANA", "UVREDLJIVO", "LICNI_PODACI", "PREVARA", "DRUGO"] as const;

function PrijaviOglas({ oglasId }: { oglasId: string }) {
  const t = useTranslations("pijaca");
  const [otvoreno, setOtvoreno] = useState(false);
  const [razlog, setRazlog] = useState<(typeof RAZLOZI)[number]>("ZABRANJENO_DOBRO");
  const [opis, setOpis] = useState("");
  const [salje, setSalje] = useState(false);
  const [poslato, setPoslato] = useState(false);
  const [greska, setGreska] = useState("");

  async function posalji(e: React.FormEvent) {
    e.preventDefault();
    setSalje(true);
    setGreska("");
    try {
      const res = await fetch(`/api/pijaca/${oglasId}/prijavi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razlog, opis: opis.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreska(data.error ?? t("prijava_greska"));
        return;
      }
      setPoslato(true);
      setOtvoreno(false);
    } finally {
      setSalje(false);
    }
  }

  if (poslato) {
    return (
      <div className="pt-2 border-t border-kolo-border text-xs text-kolo-muted">
        {t("prijava_poslata")}
      </div>
    );
  }

  if (!otvoreno) {
    return (
      <div className="pt-2 border-t border-kolo-border">
        <button
          onClick={() => setOtvoreno(true)}
          className="text-xs text-kolo-muted hover:text-kolo-danger transition-colors"
        >
          {t("prijavi_oglas")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={posalji} className="pt-2 border-t border-kolo-border space-y-2">
      <div className="text-xs font-semibold text-kolo-text">{t("prijavi_oglas")}</div>
      <select
        value={razlog}
        onChange={(e) => setRazlog(e.target.value as (typeof RAZLOZI)[number])}
        className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm"
      >
        {RAZLOZI.map((r) => (
          <option key={r} value={r}>
            {t(`prijava_razlog_${r.toLowerCase()}`)}
          </option>
        ))}
      </select>
      <textarea
        value={opis}
        onChange={(e) => setOpis(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder={t("prijava_opis_placeholder")}
        className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm"
      />
      {greska && <div className="text-xs text-kolo-danger">{greska}</div>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={salje}
          className="flex-1 py-2 rounded-xl bg-kolo-danger text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {salje ? "..." : t("prijava_posalji")}
        </button>
        <button
          type="button"
          onClick={() => setOtvoreno(false)}
          className="flex-1 py-2 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-semibold hover:bg-kolo-border"
        >
          {t("odustani")}
        </button>
      </div>
    </form>
  );
}

// ── Forma za izmenu oglasa ─────────────────────────────────────────────────────

function IzmeniOglas({
  oglas,
  onCancel,
  onSuccess,
}: {
  oglas: OglasProps;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const t = useTranslations("pijaca");
  const jePotraznja = oglas.tip === "POTRAZNJA";
  const [title, setTitle] = useState(oglas.title);
  const [description, setDescription] = useState(oglas.description);
  const [cenaTip, setCenaTip] = useState<CenaTip>((oglas.cenaTip as CenaTip) ?? "FIKSNA");
  const [price, setPrice] = useState(oglas.price != null ? String(oglas.price) : "");
  const [cenaDo, setCenaDo] = useState(oglas.cenaDo != null ? String(oglas.cenaDo) : "");
  const [location, setLocation] = useState(oglas.location ?? "");
  const [phone, setPhone] = useState(oglas.phone ?? "");
  // indeksi postojećih slika koje treba zadržati
  const [keepIndices, setKeepIndices] = useState<number[]>(
    oglas.images.map((_, i) => i)
  );
  const [noveSlike, setNoveSlike] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const ukupnoSlika = keepIndices.length + noveSlike.length;

  function ukloniPostojecu(idx: number) {
    setKeepIndices((prev) => prev.filter((i) => i !== idx));
  }

  function handleNoveSlike(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const combined = [...noveSlike, ...files].slice(0, 5 - keepIndices.length);
    for (const f of combined) {
      if (f.size > 5 * 1024 * 1024) { setError(t("slika_prevelika")); return; }
    }
    setNoveSlike(combined);
    setError("");
  }

  function ukloniNovu(i: number) {
    setNoveSlike((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const titleVal = title.trim();
    if (titleVal.length < 3) { setError(t("naslov_greska")); return; }
    const cena = parsirajCenu(cenaTip, price, cenaDo);
    if (!cena.ok) { setError(cena.error ?? t("cena_greska")); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", titleVal);
      fd.append("description", description.trim());
      fd.append("cenaTip", cenaTip);
      fd.append("price", price);
      fd.append("cenaDo", cenaDo);
      fd.append("location", location.trim());
      fd.append("phone", phone.trim());
      fd.append("keepImages", JSON.stringify(keepIndices));
      noveSlike.forEach((f, i) => fd.append(`nova_slika_${i}`, f));

      const res = await fetch(`/api/pijaca/${oglas.id}`, { method: "PATCH", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? t("greska_generalna")); return; }
      onSuccess();
    } catch {
      setError(t("greska_cuvanje"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="text-kolo-muted hover:text-kolo-muted transition-colors text-sm">
          {t("nazad")}
        </button>
        <h1 className="text-2xl font-semibold text-kolo-text">{t("izmeni_oglas_naslov")}</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 bg-white rounded-2xl border border-kolo-border p-6">
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">{t("naslov_label")}</label>
          <input type="text" maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">{t("opis_label")}</label>
          <textarea rows={3} maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none transition-colors" />
        </div>

        {!jePotraznja && (
          <CenaUnos
            cenaTip={cenaTip}
            setCenaTip={setCenaTip}
            price={price}
            setPrice={setPrice}
            cenaDo={cenaDo}
            setCenaDo={setCenaDo}
            t={t}
          />
        )}

        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">
            {t("lokacija_label")} <span className="text-kolo-muted font-normal">{t("lokacija_opciono")}</span>
          </label>
          <input type="text" maxLength={60} value={location} onChange={(e) => setLocation(e.target.value)}
            placeholder={t("lokacija_placeholder")}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">
            {t("kontakt_telefon")} <span className="text-kolo-muted font-normal">{t("lokacija_opciono")}</span>
          </label>
          <input type="tel" maxLength={20} value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder={t("kontakt_placeholder")}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors" />
        </div>

        {/* Slike */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">
            {t("slike_label")} <span className="text-kolo-muted font-normal">{t("slike_count", { count: ukupnoSlika })}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {/* Postojeće slike */}
            {oglas.images.map((_, idx) => (
              keepIndices.includes(idx) && (
                <div key={`e-${idx}`} className="relative w-20 h-20 rounded-xl border border-kolo-border overflow-hidden bg-kolo-bg">
                  <Image
                    src={`/api/pijaca/slika/${oglas.id}/${idx}`}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => ukloniPostojecu(idx)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )
            ))}
            {/* Nove slike */}
            {noveSlike.map((f, i) => (
              <div key={`n-${i}`} className="relative w-20 h-20 rounded-xl border border-kolo-green-100 overflow-hidden bg-kolo-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => ukloniNovu(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            {/* Dodaj novu */}
            {ukupnoSlika < 5 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-kolo-border flex items-center justify-center text-kolo-muted hover:border-kolo-muted transition-colors text-xl"
              >
                +
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleNoveSlike} />
          <p className="mt-1.5 text-xs text-kolo-muted">{t("slike_hint")}</p>
        </div>

        {error && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-xl px-4 py-3">{error}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-semibold hover:bg-kolo-border transition-colors">
            {t("otkazi_btn")}
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50">
            {loading ? t("cuvam") : t("sacuvaj_izmene")}
          </button>
        </div>
      </form>
    </div>
  );
}
