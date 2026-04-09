"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    <header className="h-11 shrink-0 bg-white border-b border-kolo-border px-4 flex items-center justify-between">
      {/* Hamburger — samo mobilno */}
      <button
        onClick={onMenuOpen}
        className="md:hidden p-1.5 rounded-lg text-kolo-muted hover:text-kolo-text hover:bg-kolo-bg transition-colors"
        aria-label="Meni"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div className="hidden md:block" />

      <div className="flex items-center gap-4 text-sm">
        {session ? (
          <>
            <BalansHeader userId={session.user.id} />
            <span className="text-kolo-border">•</span>
            <BellNotifikacije />
          </>
        ) : (
          <span className="text-kolo-muted text-xs">Učitavam...</span>
        )}
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
    <span className="text-kolo-muted">
      <span className="font-medium text-kolo-text">
        {balans === null ? "..." : balans.toLocaleString("sr-RS")}
      </span>{" "}
      POEN
    </span>
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
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
    // Prikaži toast ako je porastao broj nepročitanih (ne pri prvom učitavanju)
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
      {/* Toast */}
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
          <button
            onClick={(e) => { e.stopPropagation(); setToast(null); }}
            className="text-kolo-border hover:text-kolo-muted text-lg leading-none shrink-0"
          >×</button>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-1.5 rounded-lg text-kolo-muted hover:text-kolo-text hover:bg-kolo-bg transition-colors"
        aria-label="Notifikacije"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {neprocitano > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-kolo-danger-light0 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            {neprocitano > 9 ? "9+" : neprocitano}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-kolo-border z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-kolo-border">
            <span className="text-sm font-semibold text-kolo-text">Obaveštenja</span>
            {neprocitano > 0 && (
              <button onClick={oznaciProcitane} disabled={loading}
                className="text-xs text-kolo-green-700 hover:underline disabled:opacity-50">
                Označi sve kao pročitano
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifikacije.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-kolo-muted">
                Nema obaveštenja.
              </div>
            ) : (
              notifikacije.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleKlik(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-kolo-bg transition-colors border-b border-kolo-border/50 last:border-0 ${
                    !n.procitana ? "bg-kolo-green-100/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.procitana && (
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-kolo-green-700 shrink-0" />
                    )}
                    <div className={!n.procitana ? "" : "pl-4"}>
                      <p className={`text-sm font-semibold ${TIP_BOJA[n.tip] ?? "text-kolo-text"}`}>
                        {n.naslov}
                      </p>
                      <p className="text-xs text-kolo-muted mt-0.5 leading-relaxed">{n.tekst}</p>
                      <p className="text-[10px] text-kolo-border mt-1">
                        {new Date(n.createdAt).toLocaleString("sr-RS", {
                          day: "2-digit", month: "2-digit",
                          hour: "2-digit", minute: "2-digit",
                        })}
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
