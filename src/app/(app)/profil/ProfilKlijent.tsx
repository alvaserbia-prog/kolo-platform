"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import LokacijaSearch from "@/components/LokacijaSearch";
import { useTranslations } from "next-intl";

const MAX_DISPLAY = 440;

const TIPOVI_ODLUKA = [
  { value: "VERIFIKACIJA", label: "Verifikacija identiteta" },
  { value: "SUSPENZIJA", label: "Suspenzija/isključenje naloga" },
  { value: "PROGRAM", label: "Upis u program" },
  { value: "OSTALO", label: "Ostalo" },
];

interface ProfilProps {
  user: {
    id: string;
    email: string;
    pseudonim: string;
    role: string;
    verified: boolean;
    verifiedAt: string | null;
    pseudonimChangedAt: string | null;
    referralCode: string;
    balance: number;
    createdAt: string;
    location: string | null;
    telefon: string | null;
    punoIme: string | null;
    opis: string | null;
    avatar: string | null;
    prikaziLokaciju: boolean;
    prikaziOpis: boolean;
    prikaziPunoIme: boolean;
    prikaziTelefon: boolean;
    prikaziBilans: boolean;
    prikaziZrno: boolean;
    prikaziRangPreporuka: boolean;
    prikaziRangDonacija: boolean;
    prikaziOglase: boolean;
  };
}

export default function ProfilKlijent({ user }: ProfilProps) {
  const t = useTranslations("profil");
  const tc = useTranslations("common");
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(user.avatar);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  // crop modal
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropDisplay, setCropDisplay] = useState({ w: 1, h: 1, scale: 1 });
  const [cropRadius, setCropRadius] = useState(120);
  const [circleCenter, setCircleCenter] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; cx: number; cy: number } | null>(null);
  const cropImgRef = useRef<HTMLImageElement>(null);
  const [noviPseudonim, setNoviPseudonim] = useState("");
  const [psError, setPsError] = useState("");
  const [psSuccess, setPsSuccess] = useState("");
  const [novaLozinka, setNovaLozinka] = useState("");
  const [staraLozinka, setStaraLozinka] = useState("");
  const [lzError, setLzError] = useState("");
  const [lzSuccess, setLzSuccess] = useState("");
  const [location, setLocation] = useState(user.location ?? "");
  const [telefon, setTelefon] = useState(user.telefon ?? "");
  const [locError, setLocError] = useState("");
  const [locSuccess, setLocSuccess] = useState("");
  const [locLoading, setLocLoading] = useState(false);
  const [punoIme, setPunoIme] = useState(user.punoIme ?? "");
  const [opis, setOpis] = useState(user.opis ?? "");
  const [podaciError, setPodaciError] = useState("");
  const [podaciSuccess, setPodaciSuccess] = useState("");
  const [podaciLoading, setPodaciLoading] = useState(false);

  // Vidljivost profila
  const [togglei, setTogglei] = useState({
    prikaziLokaciju: user.prikaziLokaciju,
    prikaziOpis: user.prikaziOpis,
    prikaziPunoIme: user.prikaziPunoIme,
    prikaziTelefon: user.prikaziTelefon,
    prikaziBilans: user.prikaziBilans,
    prikaziZrno: user.prikaziZrno,
    prikaziRangPreporuka: user.prikaziRangPreporuka,
    prikaziRangDonacija: user.prikaziRangDonacija,
    prikaziOglase: user.prikaziOglase,
  });
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  async function promeniToggle(field: keyof typeof togglei, vrednost: boolean) {
    setToggleLoading(field);
    const noviTogglei = { ...togglei, [field]: vrednost };
    setTogglei(noviTogglei);
    await fetch("/api/profil/podaci", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: vrednost }),
    });
    setToggleLoading(null);
  }

  // Prigovor
  const [prigovorTip, setPrigovorTip] = useState("OSTALO");
  const [prigovorOpis, setPrigovorOpis] = useState("");
  const [prigovorError, setPrigovorError] = useState("");
  const [prigovorSuccess, setPrigovorSuccess] = useState("");
  const [prigovorLoading, setPrigovorLoading] = useState(false);

  // Brisanje naloga
  const [brisiModalOpen, setBrisiModalOpen] = useState(false);
  const [brisiPrimalac, setBrisiPrimalac] = useState("");
  const [brisiError, setBrisiError] = useState("");
  const [brisiLoading, setBrisiLoading] = useState(false);

  const mozeMenjatiPseudonim = !user.pseudonimChangedAt ||
    (Date.now() - new Date(user.pseudonimChangedAt).getTime()) > 30 * 24 * 60 * 60 * 1000;

  function selectAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError("");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(MAX_DISPLAY / img.width, MAX_DISPLAY / img.height, 1);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const r = Math.min(dw, dh) / 2 - 12;
      setCropDisplay({ w: dw, h: dh, scale });
      setCropRadius(r);
      setCircleCenter({ x: dw / 2, y: dh / 2 });
      setCropSrc(url);
    };
    img.src = url;
    e.target.value = "";
  }

  const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const pt = "touches" in e ? e.touches[0] : e;
    dragRef.current = { startX: pt.clientX, startY: pt.clientY, cx: circleCenter.x, cy: circleCenter.y };
  }, [circleCenter]);

  const onDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragRef.current) return;
    const pt = "touches" in e ? e.touches[0] : e;
    const dx = pt.clientX - dragRef.current.startX;
    const dy = pt.clientY - dragRef.current.startY;
    const r = cropRadius;
    setCircleCenter({
      x: Math.min(cropDisplay.w - r, Math.max(r, dragRef.current.cx + dx)),
      y: Math.min(cropDisplay.h - r, Math.max(r, dragRef.current.cy + dy)),
    });
  }, [cropRadius, cropDisplay]);

  const onDragEnd = useCallback(() => { dragRef.current = null; }, []);

  async function confirmCrop() {
    if (!cropSrc || !cropImgRef.current) return;
    setAvatarLoading(true);
    setAvatarError("");

    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const { scale } = cropDisplay;
    const r = cropRadius / scale;
    const cx = circleCenter.x / scale;
    const cy = circleCenter.y / scale;
    ctx.drawImage(cropImgRef.current, cx - r, cy - r, r * 2, r * 2, 0, 0, size, size);

    const base64 = canvas.toDataURL("image/jpeg", 0.82);
    URL.revokeObjectURL(cropSrc);
    setCropSrc(null);

    if (base64.length > 150_000) {
      setAvatarError(t("foto_napomena"));
      setAvatarLoading(false);
      return;
    }

    const res = await fetch("/api/profil/avatar", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: base64 }),
    });
    const data = await res.json();
    setAvatarLoading(false);
    if (!res.ok) { setAvatarError(data.error ?? tc("greska_ucitavanja")); return; }
    setAvatar(base64);
    window.dispatchEvent(new CustomEvent("avatar-updated", { detail: base64 }));
  }

  async function promeniPseudonim(e: React.FormEvent) {
    e.preventDefault();
    setPsError(""); setPsSuccess("");
    if (noviPseudonim.length < 3) { setPsError(t("ps_min_3")); return; }
    const res = await fetch("/api/profil/pseudonim", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudonim: noviPseudonim }),
    });
    const data = await res.json();
    if (!res.ok) { setPsError(data.error); return; }
    setPsSuccess(t("ps_uspeh"));
    setTimeout(() => signOut({ callbackUrl: "/login" }), 1500);
  }

  async function promeniLozinku(e: React.FormEvent) {
    e.preventDefault();
    setLzError(""); setLzSuccess("");
    if (novaLozinka.length < 8) { setLzError(t("lz_greska_duljina")); return; }
    const res = await fetch("/api/profil/lozinka", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staraLozinka, novaLozinka }),
    });
    const data = await res.json();
    if (!res.ok) { setLzError(data.error); return; }
    setLzSuccess(t("lz_uspeh")); setStaraLozinka(""); setNovaLozinka("");
  }

  async function sacuvajPodatke(e: React.FormEvent) {
    e.preventDefault();
    setPodaciError(""); setPodaciSuccess("");
    setPodaciLoading(true);
    const res = await fetch("/api/profil/podaci", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ punoIme, opis }),
    });
    const data = await res.json();
    setPodaciLoading(false);
    if (!res.ok) { setPodaciError(data.error ?? tc("greska_ucitavanja")); return; }
    setPodaciSuccess(t("sacuvano"));
    router.refresh();
  }

  async function sacuvajLokaciju(e: React.FormEvent) {
    e.preventDefault();
    setLocError(""); setLocSuccess("");
    setLocLoading(true);
    const res = await fetch("/api/profil/lokacija", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, telefon }),
    });
    const data = await res.json();
    setLocLoading(false);
    if (!res.ok) { setLocError(data.error ?? tc("greska_ucitavanja")); return; }
    setLocSuccess(t("sacuvano"));
    router.refresh();
  }

  const roleLabel: Record<string, string> = {
    FIZICKO_LICE: t("uloga_fizicko"),
    ZADRUGAR: t("uloga_zadrugar"),
    ADMIN: t("uloga_admin"),
  };

  async function posaljiPrigovor(e: React.FormEvent) {
    e.preventDefault();
    setPrigovorError(""); setPrigovorSuccess("");
    if (prigovorOpis.trim().length < 10) { setPrigovorError("Opis mora imati najmanje 10 karaktera."); return; }
    setPrigovorLoading(true);
    const res = await fetch("/api/prigovor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opis: prigovorOpis, tipOdluke: prigovorTip }),
    });
    const data = await res.json();
    setPrigovorLoading(false);
    if (!res.ok) { setPrigovorError(data.error ?? "Greška pri slanju."); return; }
    setPrigovorSuccess("Prigovor je primljen. Odgovorićemo u roku od 30 dana.");
    setPrigovorOpis("");
  }

  async function obrisiNalog() {
    setBrisiError("");
    setBrisiLoading(true);
    const res = await fetch("/api/profil", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prenesPoen: brisiPrimalac || undefined }),
    });
    const data = await res.json();
    setBrisiLoading(false);
    if (!res.ok) { setBrisiError(data.error ?? "Greška pri brisanju."); return; }
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="space-y-6">
      <h1 className="kolo-naslov">{t("naslov")}</h1>

      {/* Profilna slika + Osnovni podaci — jedno pored drugog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-kolo-border p-6 flex flex-col items-center gap-5">
          <h2 className="text-base font-semibold text-kolo-muted self-start">{t("profilna_slika")}</h2>
          <div className="w-56 h-56 rounded-full overflow-hidden ring-2 ring-kolo-border shrink-0">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={user.pseudonim} className="block w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-kolo-green-500 flex items-center justify-center text-white font-bold text-7xl">
                {user.pseudonim.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-1 mt-auto">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-kolo-border text-sm text-kolo-text hover:bg-kolo-bg transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {avatarLoading ? t("cuvam_sliku") : t("postavi_sliku")}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={avatarLoading}
                onChange={selectAvatar}
              />
            </label>
            <p className="text-xs text-kolo-muted text-center">{t("foto_napomena")}</p>
            {avatarError && <p className="text-sm text-kolo-danger text-center">{avatarError}</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-kolo-border p-6">
          <h2 className="text-base font-semibold text-kolo-muted mb-4">{t("osnovi_podaci")}</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-kolo-muted">{t("pseudonim_label")}</dt>
              <dd className="font-medium text-kolo-text">{user.pseudonim}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-kolo-muted">{t("email_label")}</dt>
              <dd className="text-kolo-muted">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-kolo-muted">{t("uloga_label")}</dt>
              <dd className="text-kolo-muted">{roleLabel[user.role] ?? user.role}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-kolo-muted">{t("status_label")}</dt>
              <dd>
                {user.verified ? (
                  <span className="text-kolo-green-700 font-medium">{t("status_verifikovan")}</span>
                ) : (
                  <span className="text-kolo-gold-600 font-medium">{t("status_ceka")}</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-kolo-muted">{t("poen_stanje_label")}</dt>
              <dd className="font-bold text-kolo-green-700">{user.balance.toLocaleString()} POEN</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-kolo-muted">{t("referral_kod_label")}</dt>
              <dd className="font-mono text-kolo-text bg-kolo-bg px-2 py-0.5 rounded">{user.referralCode}</dd>
            </div>
            {user.punoIme && (
              <div className="flex justify-between">
                <dt className="text-kolo-muted">{t("ime_prezime_label")}</dt>
                <dd className="text-kolo-muted">{user.punoIme}</dd>
              </div>
            )}
            {user.location && (
              <div className="flex justify-between">
                <dt className="text-kolo-muted">{t("lokacija_label")}</dt>
                <dd className="text-kolo-muted">{user.location}</dd>
              </div>
            )}
            {user.telefon && (
              <div className="flex justify-between">
                <dt className="text-kolo-muted">{t("telefon_label")}</dt>
                <dd className="text-kolo-muted">{user.telefon}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-kolo-muted">{t("registrovan_label")}</dt>
              <dd className="text-kolo-muted">{new Date(user.createdAt).toLocaleDateString("sr-RS")}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Ime i prezime + Lokacija i kontakt — jedno pored drugog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-kolo-border p-6">
          <h2 className="text-base font-semibold text-kolo-muted mb-4">{t("ime_prezime_sekcija")}</h2>
          <form onSubmit={sacuvajPodatke} className="space-y-3">
            <div>
              <label className="block text-sm text-kolo-muted mb-1.5">{t("puno_ime")} <span className="text-kolo-muted">({tc("opciono")})</span></label>
              <input
                type="text"
                value={punoIme}
                onChange={(e) => setPunoIme(e.target.value)}
                placeholder={t("puno_ime_placeholder")}
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-kolo-muted mb-1.5">{t("opis_zanimanje")} <span className="text-kolo-muted">({tc("opciono")})</span></label>
              <input
                type="text"
                value={opis}
                onChange={(e) => setOpis(e.target.value)}
                placeholder={t("opis_placeholder")}
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600 transition-colors"
              />
            </div>
            {podaciError && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{podaciError}</p>}
            {podaciSuccess && <p className="text-sm text-kolo-green-700 bg-kolo-green-100 rounded-lg px-3 py-2">{podaciSuccess}</p>}
            <button
              type="submit"
              disabled={podaciLoading}
              className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors disabled:opacity-60"
            >
              {podaciLoading ? tc("cuvam") : tc("sacuvaj")}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-kolo-border p-6">
          <h2 className="text-base font-semibold text-kolo-muted mb-4">{t("lokacija_kontakt")}</h2>
          <form onSubmit={sacuvajLokaciju} className="space-y-3">
            <div>
              <label className="block text-sm text-kolo-muted mb-1.5">{t("mesto")} <span className="text-kolo-muted">({tc("opciono")})</span></label>
              <LokacijaSearch value={location} onChange={setLocation} />
            </div>
            <div>
              <label className="block text-sm text-kolo-muted mb-1.5">{t("telefon")} <span className="text-kolo-muted">({tc("opciono")})</span></label>
              <input
                type="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder={t("telefon_placeholder")}
                className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600 transition-colors"
              />
            </div>
            {locError && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{locError}</p>}
            {locSuccess && <p className="text-sm text-kolo-green-700 bg-kolo-green-100 rounded-lg px-3 py-2">{locSuccess}</p>}
            <button
              type="submit"
              disabled={locLoading}
              className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors disabled:opacity-60"
            >
              {locLoading ? tc("cuvam") : tc("sacuvaj")}
            </button>
          </form>
        </div>
      </div>

      {/* Promena pseudonima + Promena lozinke — jedno pored drugog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-kolo-border p-6">
          <h2 className="text-base font-semibold text-kolo-muted mb-4">{t("promena_pseudonima")}</h2>
          {mozeMenjatiPseudonim ? (
            <form onSubmit={promeniPseudonim} className="space-y-3">
              <input
                type="text"
                minLength={3}
                maxLength={30}
                placeholder={t("novi_pseudonim")}
                value={noviPseudonim}
                onChange={(e) => setNoviPseudonim(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500"
              />
              {psError && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{psError}</p>}
              {psSuccess && <p className="text-sm text-kolo-green-700 bg-kolo-green-100 rounded-lg px-3 py-2">{psSuccess}</p>}
              <button type="submit" className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors">
                {t("promeni_pseudonim")}
              </button>
            </form>
          ) : (
            <p className="text-sm text-kolo-muted">
              {t("pseudonim_30_dana")}{" "}
              {user.pseudonimChangedAt && (
                <>{t("sledeca_promena")} {new Date(new Date(user.pseudonimChangedAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("sr-RS")}.</>
              )}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-kolo-border p-6">
          <h2 className="text-base font-semibold text-kolo-muted mb-4">{t("promena_lozinke")}</h2>
          <form onSubmit={promeniLozinku} className="space-y-3">
            <input
              type="password"
              placeholder={t("trenutna_lozinka")}
              value={staraLozinka}
              onChange={(e) => setStaraLozinka(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500"
            />
            <input
              type="password"
              placeholder={t("nova_lozinka")}
              value={novaLozinka}
              onChange={(e) => setNovaLozinka(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500"
            />
            {lzError && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{lzError}</p>}
            {lzSuccess && <p className="text-sm text-kolo-green-700 bg-kolo-green-100 rounded-lg px-3 py-2">{lzSuccess}</p>}
            <button type="submit" className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors">
              {t("promeni_lozinku")}
            </button>
          </form>
        </div>
      </div>

      {/* Crop modal */}
      {cropSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl max-w-full">
            <p className="text-sm text-kolo-muted">{t("crop_opis")}</p>
            <div
              className="relative cursor-grab active:cursor-grabbing rounded-xl overflow-hidden select-none"
              style={{ width: cropDisplay.w, height: cropDisplay.h }}
              onMouseDown={onDragStart}
              onMouseMove={onDragMove}
              onMouseUp={onDragEnd}
              onMouseLeave={onDragEnd}
              onTouchStart={onDragStart}
              onTouchMove={onDragMove}
              onTouchEnd={onDragEnd}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={cropImgRef}
                src={cropSrc}
                alt=""
                draggable={false}
                style={{ width: cropDisplay.w, height: cropDisplay.h, display: "block", pointerEvents: "none" }}
              />
              <svg
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
                width={cropDisplay.w}
                height={cropDisplay.h}
              >
                <defs>
                  <mask id="cm">
                    <rect width={cropDisplay.w} height={cropDisplay.h} fill="white" />
                    <circle cx={circleCenter.x} cy={circleCenter.y} r={cropRadius} fill="black" />
                  </mask>
                </defs>
                <rect width={cropDisplay.w} height={cropDisplay.h} fill="black" fillOpacity={0.55} mask="url(#cm)" />
                <circle cx={circleCenter.x} cy={circleCenter.y} r={cropRadius} fill="none" stroke="white" strokeWidth={2} strokeDasharray="6 3" />
              </svg>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => { URL.revokeObjectURL(cropSrc); setCropSrc(null); }}
                className="flex-1 py-2.5 rounded-xl border border-kolo-border text-sm text-kolo-muted hover:bg-kolo-bg transition-colors"
              >
                {tc("otkazi")}
              </button>
              <button
                onClick={confirmCrop}
                disabled={avatarLoading}
                className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors disabled:opacity-60"
              >
                {avatarLoading ? tc("cuvam") : tc("potvrdi")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Moji oglasi */}
      <Link
        href="/profil/oglasi"
        className="block bg-white rounded-2xl border border-kolo-border px-6 py-4 hover:border-kolo-green-100 transition-colors"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-kolo-text">{t("moji_oglasi")}</p>
            <p className="text-xs text-kolo-muted mt-0.5">{t("moji_oglasi_opis")}</p>
          </div>
          <span className="text-kolo-border">→</span>
        </div>
      </Link>

      {/* Vidljivost profila */}
      <div className="bg-white rounded-2xl border border-kolo-border p-6">
        <h2 className="text-base font-semibold text-kolo-muted mb-1">Vidljivost profila</h2>
        <p className="text-xs text-kolo-muted mb-5">Izaberite koje informacije su vidljive drugim verifikovanim korisnicima na vašem javnom profilu.</p>
        <div className="space-y-0 divide-y divide-kolo-border">
          {([
            { field: "prikaziLokaciju", label: "Lokacija" },
            { field: "prikaziBilans", label: "POEN balans" },
            { field: "prikaziZrno", label: "ZRNO (ukupan broj)" },
            { field: "prikaziRangPreporuka", label: "Rang preporuka" },
            { field: "prikaziRangDonacija", label: "Rang donacija" },
            { field: "prikaziOglase", label: "Oglasi na Pijaci" },
            { field: "prikaziOpis", label: "Opis / zanimanje" },
            { field: "prikaziPunoIme", label: "Pravo ime" },
            { field: "prikaziTelefon", label: "Telefon" },
          ] as { field: keyof typeof togglei; label: string }[]).map(({ field, label }) => (
            <div key={field} className="flex items-center justify-between py-3">
              <span className="text-sm text-kolo-text">{label}</span>
              <button
                onClick={() => promeniToggle(field, !togglei[field])}
                disabled={toggleLoading === field}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-60 ${
                  togglei[field] ? "bg-kolo-green-700" : "bg-kolo-border"
                }`}
                aria-label={`${label} — ${togglei[field] ? "vidljivo" : "skriveno"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    togglei[field] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Podaci i privatnost */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eksport podataka */}
        <div className="bg-white rounded-2xl border border-kolo-border p-6">
          <h2 className="text-base font-semibold text-kolo-muted mb-2">Pravo na prenosivost podataka</h2>
          <p className="text-xs text-kolo-muted mb-4">
            Preuzmite kopiju svih vaših ličnih podataka u JSON formatu (čl. 36 Zakona o zaštiti podataka o ličnosti).
            JMBG nije uključen — dostupan na pisani zahtev.
          </p>
          <a
            href="/api/profil/eksport"
            download
            className="inline-block px-4 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors"
          >
            Preuzmi moje podatke
          </a>
        </div>

        {/* Prigovor na odluku */}
        <div className="bg-white rounded-2xl border border-kolo-border p-6">
          <h2 className="text-base font-semibold text-kolo-muted mb-2">Prigovor na odluku</h2>
          <p className="text-xs text-kolo-muted mb-4">
            Ukoliko smatrate da je neka odluka sistema (verifikacija, suspenzija, upis u program) donesena pogrešno,
            možete podneti prigovor. Odgovorićemo u roku od 30 dana.
          </p>
          <form onSubmit={posaljiPrigovor} className="space-y-3">
            <select
              value={prigovorTip}
              onChange={(e) => setPrigovorTip(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600"
            >
              {TIPOVI_ODLUKA.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <textarea
              value={prigovorOpis}
              onChange={(e) => setPrigovorOpis(e.target.value)}
              placeholder="Opišite prigovor (min. 10 karaktera)..."
              rows={3}
              maxLength={2000}
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600 resize-none"
            />
            {prigovorError && <p className="text-xs text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{prigovorError}</p>}
            {prigovorSuccess && <p className="text-xs text-kolo-green-700 bg-kolo-green-100 rounded-lg px-3 py-2">{prigovorSuccess}</p>}
            <button
              type="submit"
              disabled={prigovorLoading}
              className="w-full py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors disabled:opacity-60"
            >
              {prigovorLoading ? "Šaljem..." : "Pošalji prigovor"}
            </button>
          </form>
        </div>
      </div>

      {/* Brisanje naloga */}
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <h2 className="text-base font-semibold text-kolo-danger mb-2">Brisanje naloga</h2>
        <p className="text-xs text-kolo-muted mb-4">
          Brisanjem naloga anonimizuju se svi vaši lični podaci (email, ime, telefon, lokacija, avatar).
          Transakcione istorije ostaju sa anonimizovanim pseudonimom. POEN možete preneti drugom korisniku
          ili će biti vraćeni Banci. ZRNA se automatski prodaju. Ova radnja je <strong>nepovratna</strong>.
        </p>
        {!brisiModalOpen ? (
          <button
            onClick={() => setBrisiModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-red-300 text-kolo-danger text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            Obriši nalog
          </button>
        ) : (
          <div className="space-y-3 border border-red-200 rounded-xl p-4 bg-red-50">
            <p className="text-sm font-semibold text-kolo-danger">Potvrda brisanja naloga</p>
            <div>
              <label className="block text-xs text-kolo-muted mb-1.5">
                Pseudonim korisnika kome da se prenesu vaši POEN-i <span className="font-normal">(opciono — prazno = vraća Banci)</span>
              </label>
              <input
                type="text"
                value={brisiPrimalac}
                onChange={(e) => setBrisiPrimalac(e.target.value)}
                placeholder="pseudonim primaoca"
                className="w-full px-4 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-red-400"
              />
            </div>
            {brisiError && <p className="text-xs text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{brisiError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setBrisiModalOpen(false); setBrisiError(""); }}
                className="flex-1 py-2.5 rounded-xl border border-kolo-border text-sm text-kolo-muted hover:bg-kolo-bg transition-colors"
              >
                Odustani
              </button>
              <button
                onClick={obrisiNalog}
                disabled={brisiLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {brisiLoading ? "Brišem..." : "Potvrdi brisanje"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
