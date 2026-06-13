"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Pseudonim from "@/components/Pseudonim";
import { JEDINICE_VREDNOSTI } from "@/lib/jedinice";

interface OglasProps {
  id: string;
  title: string;
  description: string;
  price: number;
  jedinica: string | null;
  kolicina: number | null;
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
}

interface Props {
  oglas: OglasProps;
  isVerified: boolean;
  walletBalance: number;
}

// Map a DB category value to its i18n key suffix
function kategorijaKljuc(kat: string): string {
  const map: Record<string, string> = {
    "Hrana": "Hrana",
    "Usluge": "Usluge",
    "Zanati": "Zanati",
    "Elektronika": "Elektronika",
    "Odeća": "Odeca",
    "Ostalo": "Ostalo",
  };
  return map[kat] ?? "Ostalo";
}

export default function OglasDetalj({ oglas, isVerified, walletBalance }: Props) {
  const t = useTranslations("pijaca");
  const router = useRouter();
  const [activeSlika, setActiveSlika] = useState(0);
  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);
  const [deaktiviranjeLoading, setDeaktiviranjeLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  async function handleKontakt() {
    setChatLoading(true);
    const res = await fetch("/api/poruke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: oglas.sellerId }),
    });
    setChatLoading(false);
    if (!res.ok) return;
    const data = await res.json();
    router.push(`/poruke?k=${data.konverzacijaId}`);
  }

  const imaSlika = oglas.images.length > 0;
  const dostupan = oglas.status === "ACTIVE";

  async function handleKupi() {
    setLoading(true);
    setPoruka(null);
    const res = await fetch(`/api/pijaca/${oglas.id}/kupi`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setPoruka({ text: t("kupovina_uspesna_kratko"), ok: true });
      setTimeout(() => router.refresh(), 1500);
    } else {
      setPoruka({ text: data.error ?? t("greska_generalna"), ok: false });
    }
  }

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
      <div className="flex items-center gap-3">
        <Link href="/pijaca" className="text-kolo-muted hover:text-kolo-muted transition-colors text-sm">
          {t("nazad_pijaca")}
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        {/* Slike */}
        {imaSlika ? (
          <div className="space-y-2">
            <div className="relative w-full aspect-[4/3] bg-kolo-bg">
              <Image
                src={`/api/pijaca/slika/${oglas.id}/${activeSlika}`}
                alt={oglas.title}
                fill
                className="object-contain"
                unoptimized
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
                      className="object-cover"
                      unoptimized
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
              <p className="text-2xl font-bold text-kolo-green-700">{oglas.price.toLocaleString("sr-RS")}</p>
              <p className="text-sm text-kolo-green-700">POEN{oglas.jedinica ? ` / ${oglas.jedinica}` : ""}</p>
            </div>
          </div>

          {oglas.description && (
            <p className="text-sm text-kolo-muted leading-relaxed">{oglas.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-kolo-muted pt-1 border-t border-kolo-border">
            <span>{t("prodavac")}: <strong className="text-kolo-muted"><Pseudonim>{oglas.sellerPseudonim}</Pseudonim></strong></span>
            {oglas.kolicina != null && (
              <span>{t("na_stanju")}: <strong className="text-kolo-muted">{oglas.kolicina.toLocaleString("sr-RS")}{oglas.jedinica ? ` ${oglas.jedinica}` : ""}</strong></span>
            )}
            {oglas.location && <span>{t("lokacija")}: <strong className="text-kolo-muted">{oglas.location}</strong></span>}
            <span>{t("objavljeno")}: {new Date(oglas.createdAt).toLocaleDateString("sr-RS")}</span>
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

          {/* Kupac */}
          {dostupan && !oglas.isMine && (
            <div className="space-y-2">
              {!isVerified ? (
                <div className="bg-kolo-gold-100 border border-kolo-gold-100 rounded-xl px-4 py-3 text-sm text-kolo-gold-600">
                  <Link href="/tabla-jemstva" className="font-semibold hover:underline">{t("zatrazi_verifikaciju_kupovina")}</Link>{" "}
                  {t("zatrazi_verifikaciju_kupovina_tekst")}
                </div>
              ) : walletBalance < oglas.price ? (
                <div className="bg-kolo-danger-light border border-kolo-danger/20 rounded-xl px-4 py-3 text-sm text-kolo-danger">
                  {t("nedovoljno_poen", { stanje: walletBalance.toLocaleString("sr-RS"), cena: oglas.price.toLocaleString("sr-RS") })}
                </div>
              ) : null}
              {poruka && (
                <p className={`text-sm px-4 py-3 rounded-xl ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>
                  {poruka.text}
                </p>
              )}
              {isVerified && (
                <button
                  onClick={handleKupi}
                  disabled={loading || walletBalance < oglas.price || !!poruka?.ok}
                  className="w-full py-3.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
                >
                  {loading ? t("obradjem") : t("plati_iznos", { iznos: oglas.price.toLocaleString("sr-RS") })}
                </button>
              )}
              <button
                onClick={handleKontakt}
                disabled={chatLoading}
                className="w-full py-3 rounded-xl border border-kolo-border text-kolo-muted text-sm font-medium hover:bg-kolo-bg transition-colors disabled:opacity-50"
              >
                {chatLoading ? "..." : t("kontaktiraj_prodavca")}
              </button>
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
        </div>
      </div>
    </div>
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
  const [title, setTitle] = useState(oglas.title);
  const [description, setDescription] = useState(oglas.description);
  const [price, setPrice] = useState(String(oglas.price));
  const [jedinica, setJedinica] = useState(oglas.jedinica ?? "");
  const [kolicina, setKolicina] = useState(oglas.kolicina != null ? String(oglas.kolicina) : "");
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
    const p = Math.floor(Number(price));
    if (titleVal.length < 3) { setError(t("naslov_greska")); return; }
    if (isNaN(p) || p <= 0) { setError(t("cena_greska")); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", titleVal);
      fd.append("description", description.trim());
      fd.append("price", String(p));
      fd.append("jedinica", jedinica);
      fd.append("kolicina", kolicina.trim());
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

        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">{t("cena_label")}</label>
          <input type="number" min={1} step={1} value={price} onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm font-mono outline-none focus:border-kolo-green-500 transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-kolo-muted mb-2">
              {t("jedinica_label")} <span className="text-kolo-muted font-normal">{t("lokacija_opciono")}</span>
            </label>
            <select value={jedinica} onChange={(e) => setJedinica(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors bg-white">
              <option value="">{t("jedinica_bez")}</option>
              {JEDINICE_VREDNOSTI.map((j) => (
                <option key={j} value={j}>{t(`jed_${j}`)} ({j})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-kolo-muted mb-2">
              {t("stanje_label")} <span className="text-kolo-muted font-normal">{t("lokacija_opciono")}</span>
            </label>
            <input type="number" min={1} step={1} value={kolicina} onChange={(e) => setKolicina(e.target.value)}
              placeholder={t("stanje_placeholder")}
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm font-mono outline-none focus:border-kolo-green-500 transition-colors" />
          </div>
        </div>

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
                    className="object-cover"
                    unoptimized
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

function kategorijaEmoji(kat: string) {
  const map: Record<string, string> = {
    Hrana: "🥗", Usluge: "🤝", Zanati: "🔧", Elektronika: "💻", Odeća: "👕", Ostalo: "📦",
  };
  return map[kat] ?? "📦";
}
