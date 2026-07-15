"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import JezikSvitcer from "@/components/JezikSvitcer";
import Pojam from "@/components/Pojam";
import Pseudonim from "@/components/Pseudonim";
import PushObavestenja from "@/components/PushObavestenja";
import { useMe, useMePatch, type Notifikacija } from "@/hooks/useMe";

export default function Header({ onMenuOpen }: { onMenuOpen?: () => void }) {
  const { data: session } = useSession();
  const t = useTranslations("header");

  return (
    <header className="shrink-0 bg-kolo-bg flex items-center justify-center">
      <div className="relative flex w-full h-16 items-center justify-between bg-kolo-green-900 before:absolute before:top-0 before:bottom-0 before:right-full before:w-screen before:bg-kolo-green-900 before:content-[''] after:absolute after:top-0 after:bottom-0 after:left-full after:w-screen after:bg-kolo-green-900 after:content-['']">

        {/* Leva strana: logo (desktop) / hamburger + logo (mobilno) */}
        <div className="flex items-center shrink-0">
          {/* Desktop: logo + naziv (klikabilno na početnu) + jezik switcher desno od naziva */}
          <div className="hidden md:flex items-center px-4 gap-3 shrink-0">
            <Link href="/pocetna" className="flex items-center gap-2.5 group">
              <Image src="/kolo-icon.png" alt="KOLO" width={32} height={32} priority className="rounded-lg shrink-0" />
              <span className="font-bold text-white text-xl tracking-[0.2em] group-hover:opacity-90 transition-opacity">KOLO</span>
            </Link>
            <JezikSvitcer />
          </div>
          {/* Mobilno: hamburger + logo */}
          <div className="flex md:hidden items-center gap-1.5 pl-2 pr-1">
            <button
              onClick={onMenuOpen}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={t("aria_meni")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <Link href="/pocetna" className="flex items-center gap-1.5">
              <Image src="/kolo-icon.png" alt="KOLO" width={26} height={26} priority className="rounded-md shrink-0" />
              <span className="font-bold text-white text-base tracking-widest">KOLO</span>
            </Link>
          </div>
        </div>

        {/* Sredina: Bagovi + Upiši POEN */}
        <div className="flex-1 flex justify-start md:justify-center pl-2 md:pl-0">
          <div className="flex items-center gap-3 md:gap-5 md:ml-[1cm]">
            {/* Prijavljeni bagovi i status rada na njima.
                Na mobilnom se sklanja iz top bara (premešteno u profilni meni)
                da se gornja traka ne pretrpa i profilna ikonica ostane vidljiva. */}
            <Link
              href="/bagovi"
              title={t("bagovi")}
              aria-label={t("bagovi")}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 text-white/80 hover:text-white text-xs md:text-sm font-semibold rounded-xl border border-white/40 hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/>
                <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/>
                <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/>
                <path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/>
                <path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/>
                <path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
              </svg>
              <span className="hidden sm:inline">{t("bagovi")}</span>
            </Link>
            <Link
              href="/novcanik"
              className="px-2.5 py-1 md:px-4 md:py-1.5 bg-kolo-green-600 hover:bg-kolo-green-500 text-white text-xs md:text-sm font-semibold rounded-xl border border-white/70 transition-colors whitespace-nowrap"
            >
              {t("upisi_poen")}
            </Link>
          </div>
        </div>

        {/* Desna strana: balans + poruke + notifikacije + profil */}
        <div className="flex items-center gap-1.5 md:gap-3 pr-2 md:px-4">
          {session ? (
            <>
              <BalansHeader />
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              {/* Pomoć / onboarding — na mobilnom u profilnom meniju (vidi ProfilMeni) */}
              <Link
                href="/dobrodosli"
                className="w-9 h-9 hidden md:flex items-center justify-center rounded-full text-white/60 ring-2 ring-white/20 hover:text-white hover:ring-white/50 transition-all shrink-0"
                aria-label={t("aria_kako_funkcionise")}
                title={t("aria_kako_funkcionise")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </Link>
              {/* Poruke ikonica sa badge-om nepročitanih */}
              <PorukeIkona ariaLabel={t("aria_poruke")} />
              {/* Notifikacije */}
              <BellNotifikacije />
              {/* Profilni krug */}
              <ProfilMeni
                userId={session.user.id}
                pseudonim={session.user.pseudonim}
              />
            </>
          ) : (
            <span className="text-white/50 text-sm">{t("ucitavanje")}</span>
          )}
        </div>
      </div>
    </header>
  );
}

function BalansHeader() {
  const t = useTranslations("header");
  // Balans dolazi iz keširanog /api/me (React Query) — osvežava ga `balans-updated`
  // event preko useMeEventBridge (montiran u AppShell). Bez zasebnog fetch-a.
  const { data: me } = useMe();
  const balans = me?.balance ?? null;

  return (
    <span className="text-white/60 text-sm hidden sm:inline-flex items-center gap-1">
      <span className="font-semibold text-white text-sm">
        {balans === null ? "..." : balans.toLocaleString("sr-RS")}
      </span>
      <Pojam
        termin="POEN"
        objasnjenje={t("poen_objasnjenje")}
      />
    </span>
  );
}

function ProfilMeni({ userId, pseudonim }: { userId: string; pseudonim: string }) {
  const router = useRouter();
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  // Avatar iz keširanog /api/me; `avatar-updated` event invalidira keš (bridge).
  const { data: me } = useMe();
  const avatar = me?.avatar ?? null;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Resetuj error state kada se avatar prosledi (nova slika)
  useEffect(() => {
    setImageError(false);
  }, [avatar]);

  const inicijal = pseudonim.charAt(0).toUpperCase();

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/20 hover:ring-white/50 transition-all shrink-0"
        aria-label={t("aria_profil")}
      >
        {avatar && !imageError ? (
          avatar.startsWith("http") ? (
            // R2 URL → next/image: optimizuje (256→36px, AVIF/WebP) i kešira dugo
            // (minimumCacheTTL), pa se avatar ne preuzima iznova na svakoj stranici.
            <Image
              src={avatar}
              alt={pseudonim}
              width={36}
              height={36}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            // Legacy base64 data: URI — next/image ne optimizuje data URL-ove.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={pseudonim}
              width={36}
              height={36}
              decoding="async"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )
        ) : (
          <div className="w-full h-full bg-kolo-green-500 flex items-center justify-center text-white font-bold text-xs">
            {inicijal}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-auto min-w-max bg-white rounded-2xl shadow-xl border border-kolo-border z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-kolo-border">
            <p className="text-sm font-semibold text-kolo-text truncate text-right"><Pseudonim>{pseudonim}</Pseudonim></p>
          </div>
          {/* Mobilno: stavke koje na desktopu stoje u gornjoj traci (Bagovi, Pomoć).
              Na mobilnom su sklonjene iz trake, pa ih ovde držimo dostupnim. */}
          <div className="py-1 md:hidden border-b border-kolo-border">
            <button
              onClick={() => { setOpen(false); router.push("/bagovi"); }}
              className="w-full text-right px-4 py-2.5 text-sm text-kolo-text hover:bg-kolo-bg transition-colors flex items-center justify-end gap-3"
            >
              {t("bagovi")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/>
                <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/>
                <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/>
                <path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/>
                <path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/>
                <path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
              </svg>
            </button>
            <button
              onClick={() => { setOpen(false); router.push("/dobrodosli"); }}
              className="w-full text-right px-4 py-2.5 text-sm text-kolo-text hover:bg-kolo-bg transition-colors flex items-center justify-end gap-3"
            >
              {t("aria_kako_funkcionise")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
          </div>
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); router.push(`/profil/${userId}`); }}
              className="w-full text-right px-4 py-2.5 text-sm text-kolo-text hover:bg-kolo-bg transition-colors flex items-center justify-end gap-3"
            >
              {t("moj_profil")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>
              </svg>
            </button>
            <button
              onClick={() => { setOpen(false); router.push("/profil"); }}
              className="w-full text-right px-4 py-2.5 text-sm text-kolo-text hover:bg-kolo-bg transition-colors flex items-center justify-end gap-3"
            >
              {t("podesi_profil")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>
          <div className="border-t border-kolo-border" />
          <div className="py-1">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-right px-4 py-2.5 text-sm text-kolo-danger hover:bg-kolo-danger-light transition-colors flex items-center justify-end gap-3"
            >
              {t("odjavi_se")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const TIP_BOJA: Record<string, string> = {
  transfer_primljen: "text-kolo-green-700",
  verifikacija_odobrena: "text-kolo-green-700",
  verifikacija_odbijena: "text-red-500",
  preporuka_nagradjeni: "text-kolo-gold-600",
  oglas_kupljen: "text-kolo-green-700",
  info: "text-kolo-muted",
};

function PorukeIkona({ ariaLabel }: { ariaLabel: string }) {
  // Broj nepročitanih iz keširanog /api/me. Stranica /poruke emituje
  // „poruke-procitane" → bridge invalidira keš → badge se osveži.
  const { data: me } = useMe();
  const neprocitano = me?.neprocitanoPoruke ?? 0;

  return (
    <Link
      href="/poruke"
      className="relative w-9 h-9 flex items-center justify-center rounded-full text-white/60 ring-2 ring-white/20 hover:text-white hover:ring-white/50 transition-all shrink-0"
      aria-label={ariaLabel}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      {neprocitano > 0 && (
        <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
          {neprocitano > 9 ? "9+" : neprocitano}
        </span>
      )}
    </Link>
  );
}

function BellNotifikacije() {
  const router = useRouter();
  const t = useTranslations("header");
  // Podaci iz keširanog /api/me; lokalni state samo za UI (dropdown/toast).
  const { data: me } = useMe();
  const patchMe = useMePatch();
  const notifikacije = me?.notifikacije ?? [];
  const neprocitano = me?.notifNeprocitano ?? 0;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Notifikacija | null>(null);
  const prevNeprocitanoRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Toast za novo obaveštenje: okida se kada broj nepročitanih poraste između
  // dve osvežene vrednosti keša (/api/me poll ili invalidacija).
  useEffect(() => {
    if (prevNeprocitanoRef.current !== null && neprocitano > prevNeprocitanoRef.current) {
      const najnovija = notifikacije.find((n) => !n.procitana);
      if (najnovija) setToast(najnovija);
    }
    prevNeprocitanoRef.current = neprocitano;
  }, [neprocitano, notifikacije]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(id);
    }
  }, [toast]);

  async function oznaciProcitane() {
    setLoading(true);
    // Optimistički u kešu: sve pročitano → badge 0.
    patchMe({ notifNeprocitano: 0, notifikacije: notifikacije.map((n) => ({ ...n, procitana: true })) });
    await fetch("/api/notifikacije", { method: "PATCH" }).catch(() => {});
    setLoading(false);
  }

  async function handleKlik(n: Notifikacija) {
    setOpen(false);
    if (!n.procitana) {
      // Optimistički označi samo ovu kao pročitanu → badge padne za 1.
      patchMe({
        notifNeprocitano: Math.max(0, neprocitano - 1),
        notifikacije: notifikacije.map((x) => (x.id === n.id ? { ...x, procitana: true } : x)),
      });
      fetch("/api/notifikacije", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: n.id }),
      }).catch(() => {});
    }
    if (n.link) router.push(n.link);
  }

  return (
    <div className="relative flex items-center" ref={panelRef}>
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[100] w-80 bg-white rounded-2xl shadow-xl border border-kolo-border p-4 flex items-start gap-3 animate-slide-up"
          onClick={() => { setToast(null); if (toast.link) router.push(toast.link); }}
          style={{ cursor: toast.link ? "pointer" : "default" }}
        >
          <div className="mt-0.5 w-2 h-2 rounded-full bg-kolo-green-700 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${TIP_BOJA[toast.tip] ?? "text-kolo-text"}`}>{toast.naslov}</p>
            <p className="text-xs text-kolo-muted mt-0.5 leading-relaxed line-clamp-2">{toast.tekst}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setToast(null); }} className="text-kolo-border hover:text-kolo-muted text-lg leading-none shrink-0">×</button>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 flex items-center justify-center rounded-full text-white/60 ring-2 ring-white/20 hover:text-white hover:ring-white/50 transition-all shrink-0"
        aria-label={t("aria_notifikacije")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {neprocitano > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            {neprocitano > 9 ? "9+" : neprocitano}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-kolo-border z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-kolo-border">
            <span className="text-sm font-semibold text-kolo-text">{t("obavestenja")}</span>
            {neprocitano > 0 && (
              <button onClick={oznaciProcitane} disabled={loading} className="text-xs text-kolo-green-700 hover:underline disabled:opacity-50">
                {t("oznaci_procitane")}
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifikacije.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-kolo-muted">{t("nema_obavestenja")}</div>
            ) : (
              notifikacije.map((n) => (
                <button key={n.id} onClick={() => handleKlik(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-kolo-bg transition-colors border-b border-kolo-border/50 last:border-0 ${!n.procitana ? "bg-kolo-green-100/30" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.procitana && <div className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                    <div className={!n.procitana ? "" : "pl-4"}>
                      <p className={`text-sm font-semibold ${TIP_BOJA[n.tip] ?? "text-kolo-text"}`}>{n.naslov}</p>
                      <p className="text-xs text-kolo-muted mt-0.5 leading-relaxed">{n.tekst}</p>
                      <p className="text-[10px] text-kolo-border mt-1">
                        {new Date(n.createdAt).toLocaleString("sr-RS", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          {/* Web Push — uključi obaveštenja na telefonu/uređaju (radi i kad je sajt zatvoren). */}
          <div className="px-4 py-3 border-t border-kolo-border">
            <PushObavestenja />
          </div>
        </div>
      )}
    </div>
  );
}
