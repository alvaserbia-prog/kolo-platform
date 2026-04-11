"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import JezikSvitcer from "@/components/JezikSvitcer";

interface Notifikacija {
  id: string;
  tip: string;
  naslov: string;
  tekst: string;
  procitana: boolean;
  link: string | null;
  createdAt: string;
}

export default function Header({ onMenuOpen }: { onMenuOpen?: () => void }) {
  const { data: session } = useSession();

  return (
    <header className="shrink-0 bg-kolo-bg flex items-center justify-center">
      <div className="flex w-full max-w-[1140px] h-16 items-center justify-between bg-kolo-green-900">

        {/* Placeholder — ista širina kao sidebar (w-52) */}
        <div className="hidden md:block w-52 shrink-0" />

        {/* Hamburger — mobilno */}
        <div className="flex md:hidden items-center gap-2 px-4">
          <button
            onClick={onMenuOpen}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Meni"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="font-bold text-white text-base tracking-widest">KOLO</span>
        </div>

        {/* Desna strana: jezik + balans + poruke + notifikacije + profil */}
        <div className="flex items-center gap-0 px-4">
          <div className="hidden sm:flex mr-2">
            <JezikSvitcer />
          </div>
          {session ? (
            <>
              <BalansHeader userId={session.user.id} />
              <div className="w-px h-4 bg-white/20 mx-1" />
              {/* Poruke ikonica */}
              <Link
                href="/poruke"
                className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Poruke"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </Link>
              {/* Notifikacije */}
              <BellNotifikacije />
              {/* Profilni krug */}
              <div className="ml-1.5">
                <ProfilMeni
                  userId={session.user.id}
                  pseudonim={session.user.pseudonim}
                />
              </div>
            </>
          ) : (
            <span className="text-white/50 text-sm">Učitavam...</span>
          )}
        </div>
      </div>
    </header>
  );
}

function BalansHeader({ userId }: { userId: string }) {
  const [balans, setBalans] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/profil/balans")
      .then((r) => r.json())
      .then((d) => setBalans(d.balance ?? 0))
      .catch(() => setBalans(0));
  }, [userId]);

  return (
    <span className="text-white/60 text-xl hidden sm:inline">
      <span className="font-semibold text-white text-xl">
        {balans === null ? "..." : balans.toLocaleString("sr-RS")}
      </span>{" "}
      POEN
    </span>
  );
}

function ProfilMeni({ userId, pseudonim }: { userId: string; pseudonim: string }) {
  const router = useRouter();
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/profil/balans")
      .then((r) => r.json())
      .then((d) => setAvatar(d.avatar ?? null))
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    function onAvatarUpdated(e: Event) {
      setAvatar((e as CustomEvent<string>).detail);
    }
    window.addEventListener("avatar-updated", onAvatarUpdated);
    return () => window.removeEventListener("avatar-updated", onAvatarUpdated);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const inicijal = pseudonim.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/20 hover:ring-white/50 transition-all shrink-0"
        aria-label="Profil"
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={pseudonim} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-kolo-green-500 flex items-center justify-center text-white font-bold text-sm">
            {inicijal}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-kolo-border z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-kolo-border">
            <p className="text-sm font-semibold text-kolo-text truncate">{pseudonim}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); router.push("/profil"); }}
              className="w-full text-left px-4 py-2.5 text-sm text-kolo-text hover:bg-kolo-bg transition-colors flex items-center gap-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {t("moj_profil")}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-left px-4 py-2.5 text-sm text-kolo-danger hover:bg-kolo-danger-light transition-colors flex items-center gap-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {t("odjavi_se")}
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

function BellNotifikacije() {
  const router = useRouter();
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [neprocitano, setNeprocitano] = useState(0);
  const [notifikacije, setNotifikacije] = useState<Notifikacija[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Notifikacija | null>(null);
  const prevNeprocitanoRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ucitaj();
    const interval = setInterval(ucitaj, 15_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  async function ucitaj() {
    const res = await fetch("/api/notifikacije");
    if (!res.ok) return;
    const data = await res.json();
    const noviCount: number = data.neprocitano ?? 0;
    const lista: Notifikacija[] = data.notifikacije ?? [];
    if (prevNeprocitanoRef.current !== null && noviCount > prevNeprocitanoRef.current) {
      const najnovija = lista.find((n) => !n.procitana);
      if (najnovija) setToast(najnovija);
    }
    prevNeprocitanoRef.current = noviCount;
    setNeprocitano(noviCount);
    setNotifikacije(lista);
  }

  async function oznaciProcitane() {
    setLoading(true);
    await fetch("/api/notifikacije", { method: "PATCH" });
    setNeprocitano(0);
    setNotifikacije((prev) => prev.map((n) => ({ ...n, procitana: true })));
    setLoading(false);
  }

  function handleKlik(n: Notifikacija) {
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  return (
    <div className="relative" ref={panelRef}>
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
        className="relative w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Notifikacije"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    {!n.procitana && <div className="mt-1.5 w-2 h-2 rounded-full bg-kolo-green-700 shrink-0" />}
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
        </div>
      )}
    </div>
  );
}
