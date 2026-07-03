"use client";

import { useState, useEffect, useRef, useCallback, memo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Pseudonim from "@/components/Pseudonim";
import KorisnikAvatar from "@/components/KorisnikAvatar";

type Konverzacija = {
  id: string;
  drugiId: string;
  drugiPseudonim: string;
  drugiAvatar: string | null;
  poslednjaPorukaIznos: string | null;
  poslednjaPosiljacJa: boolean;
  poslednjeVreme: string;
  neprocitano: number;
};

type Poruka = {
  id: string;
  tekst: string;
  moja: boolean;
  createdAt: string;
};

function PorukeContent() {
  const t = useTranslations("poruke");
  const router = useRouter();
  const searchParams = useSearchParams();
  const aktivnaKonvId = searchParams.get("k");

  const [konverzacije, setKonverzacije] = useState<Konverzacija[]>([]);
  const [verified, setVerified] = useState(true);
  const [poruke, setPoruke] = useState<Poruka[]>([]);
  const [drugiPseudonim, setDrugiPseudonim] = useState("");
  const [drugiId, setDrugiId] = useState("");
  const [drugiAvatar, setDrugiAvatar] = useState<string | null>(null);
  const [mojAvatar, setMojAvatar] = useState<string | null>(null);
  const [mojPseudonim, setMojPseudonim] = useState("");
  const [mobilniPrikaz, setMobilniPrikaz] = useState<"lista" | "chat">("lista");
  const [tekst, setTekst] = useState("");
  const [slanje, setSlanje] = useState(false);
  const [noviKorisnik, setNoviKorisnik] = useState("");
  const [novaKonvGreska, setNovaKonvGreska] = useState("");
  const [sugestije, setSugestije] = useState<{ id: string; pseudonim: string }[]>([]);
  const [showSugestije, setShowSugestije] = useState(false);
  const [aktivniIndex, setAktivniIndex] = useState(-1);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const sugestijeRef = useRef<HTMLUListElement>(null);

  const ucitajKonverzacije = useCallback(async () => {
    const res = await fetch("/api/poruke");
    if (res.ok) {
      const data = await res.json();
      const nove: Konverzacija[] = data.konverzacije ?? [];
      // Bail-out: ako se lista nije promenila (polling na 5s), NE diraj state —
      // inače bi se cela lista konverzacija re-renderovala svakih 5s bez razloga.
      setKonverzacije((prev) => (istiKonv(prev, nove) ? prev : nove));
      if (typeof data.verified === "boolean") setVerified(data.verified);
    }
  }, []);

  const ucitajPoruke = useCallback(async (konvId: string) => {
    const res = await fetch(`/api/poruke/${konvId}`);
    if (!res.ok) return;
    const data = await res.json();
    const nove: Poruka[] = data.poruke ?? [];
    // Bail-out: ako nema novih poruka, zadrži istu referencu — time se gasi i
    // re-render svih mehurića i nasilni scroll na dno svakih 5s (vidi efekat).
    setPoruke((prev) => (istePoruke(prev, nove) ? prev : nove));
    setDrugiPseudonim(data.drugiUser?.pseudonim ?? "");
    setDrugiId(data.drugiUser?.id ?? "");
    setDrugiAvatar(data.drugiUser?.avatar ?? null);
    setMojAvatar(data.mojAvatar ?? null);
    setMojPseudonim(data.mojPseudonim ?? "");
    // GET je upravo označio primljene poruke pročitanim — osveži badge u zaglavlju.
    window.dispatchEvent(new Event("poruke-procitane"));
  }, []);

  // Inicijalno učitavanje konverzacija
  useEffect(() => {
    ucitajKonverzacije();
  }, [ucitajKonverzacije]);

  // Učitaj poruke kad se promeni aktivna konverzacija
  useEffect(() => {
    if (aktivnaKonvId) {
      ucitajPoruke(aktivnaKonvId);
      // Deep-link (npr. „Kontaktiraj prodavca") otvara konverzaciju direktno —
      // na mobilnom prebaci na chat prikaz, inače ostaje skrivena lista.
      setMobilniPrikaz("chat");
    } else {
      setPoruke([]);
      setDrugiPseudonim("");
      setDrugiId("");
      setDrugiAvatar(null);
    }
  }, [aktivnaKonvId, ucitajPoruke]);

  // Polling za nove poruke (5s)
  useEffect(() => {
    if (!aktivnaKonvId) return;
    const interval = setInterval(() => {
      ucitajPoruke(aktivnaKonvId);
      ucitajKonverzacije();
    }, 5000);
    return () => clearInterval(interval);
  }, [aktivnaKonvId, ucitajPoruke, ucitajKonverzacije]);

  // Scroll na dno pri novim porukama. Zbog bail-out-a u `ucitajPoruke`, `poruke`
  // menja referencu SAMO kad stvarno ima novih poruka — pa se ovo više ne okida
  // (i ne trza skrol) na svaki 5s poll bez promene.
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [poruke]);

  // Stabilan handler za otvaranje konverzacije → memo-izovani redovi se ne
  // re-renderuju samo zato što se roditelj iscrtao.
  const otvoriKonv = useCallback((id: string) => {
    router.push(`/poruke?k=${id}`);
    setMobilniPrikaz("chat");
  }, [router]);

  // Zatvori sugestije klikom van
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowSugestije(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleNoviKorisnikChange(val: string) {
    setNoviKorisnik(val);
    setNovaKonvGreska("");
    setShowSugestije(true);
    setAktivniIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setSugestije([]); return; }
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/korisnici/pretraga?q=${encodeURIComponent(val.trim())}`);
      const data = await res.json();
      setSugestije(Array.isArray(data) ? data : []);
    }, 250);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSugestije || sugestije.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAktivniIndex((prev) => {
        const next = prev < sugestije.length - 1 ? prev + 1 : 0;
        sugestijeRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAktivniIndex((prev) => {
        const next = prev > 0 ? prev - 1 : sugestije.length - 1;
        sugestijeRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
        return next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (aktivniIndex >= 0 && sugestije[aktivniIndex]) {
        otvoriKonverzaciju(sugestije[aktivniIndex].id);
      }
    } else if (e.key === "Escape") {
      setShowSugestije(false);
      setAktivniIndex(-1);
    }
  }

  async function otvoriKonverzaciju(userId: string) {
    setNovaKonvGreska("");
    const res = await fetch("/api/poruke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) {
      const d = await res.json();
      setNovaKonvGreska(d.error ?? "—");
      return;
    }
    const data = await res.json();
    setNoviKorisnik("");
    setSugestije([]);
    setShowSugestije(false);
    await ucitajKonverzacije();
    router.push(`/poruke?k=${data.konverzacijaId}`);
    setMobilniPrikaz("chat");
  }

  async function posalji(e: React.FormEvent) {
    e.preventDefault();
    if (!tekst.trim() || !aktivnaKonvId || slanje) return;
    setSlanje(true);
    const res = await fetch(`/api/poruke/${aktivnaKonvId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tekst }),
    });
    setSlanje(false);
    if (!res.ok) return;
    const novaPoruka: Poruka = await res.json();
    setPoruke((prev) => [...prev, novaPoruka]);
    setTekst("");
    await ucitajKonverzacije();
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      posalji(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="flex h-full overflow-hidden rounded-2xl border border-kolo-border bg-white shadow-sm" style={{ minHeight: "calc(100vh - 3.5rem - 2rem)" }}>
      {/* Leva tabla — lista konverzacija */}
      <div className={`w-full md:w-72 shrink-0 border-r border-kolo-border flex flex-col ${mobilniPrikaz === "chat" ? "hidden md:flex" : "flex"}`}>
        <div className="px-4 py-3 border-b border-kolo-border">
          <h1 className="text-base font-semibold text-kolo-text">{t("naslov")}</h1>
        </div>

        {/* Nova konverzacija — pretraga (samo verifikovani mogu da iniciraju) */}
        {!verified ? (
          <div className="px-3 py-2 border-b border-kolo-border">
            <p className="text-[11px] text-kolo-muted leading-relaxed">
              {t("neverifikovan_info")}
            </p>
          </div>
        ) : (
        <div className="px-3 py-2 border-b border-kolo-border" ref={searchWrapperRef}>
          <div className="relative">
            <input
              type="text"
              value={noviKorisnik}
              onChange={(e) => handleNoviKorisnikChange(e.target.value)}
              onFocus={() => noviKorisnik.length >= 2 && setShowSugestije(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder={t("novi_chat")}
              autoComplete="off"
              className="w-full px-3 py-2 text-xs rounded-xl border border-kolo-border outline-none focus:border-kolo-green-700 transition-colors"
            />
            {showSugestije && sugestije.length > 0 && (
              <ul ref={sugestijeRef} className="absolute z-20 left-0 right-0 mt-1 bg-white border border-kolo-border rounded-xl shadow-lg overflow-hidden">
                {sugestije.map((u, i) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      onMouseDown={() => otvoriKonverzaciju(u.id)}
                      onMouseEnter={() => setAktivniIndex(i)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        i === aktivniIndex
                          ? "bg-kolo-green-100/50 text-kolo-green-700"
                          : "text-kolo-text hover:bg-kolo-green-100/50 hover:text-kolo-green-700"
                      }`}
                    >
                      <Pseudonim>{u.pseudonim}</Pseudonim>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {novaKonvGreska && <p className="text-xs text-red-500 mt-1">{novaKonvGreska}</p>}
        </div>
        )}

        {/* Lista konverzacija */}
        <div className="flex-1 overflow-y-auto">
          {konverzacije.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-kolo-muted whitespace-pre-line">{t("nema_konverzacija")}</p>
          ) : (
            konverzacije.map((k) => (
              <KonverzacijaRed
                key={k.id}
                k={k}
                aktivna={aktivnaKonvId === k.id}
                onOtvori={otvoriKonv}
                t={t}
              />
            ))
          )}
        </div>
      </div>

      {/* Desna tabla — aktivni chat */}
      <div className={`flex-1 flex-col min-w-0 ${mobilniPrikaz === "lista" ? "hidden md:flex" : "flex"}`}>
        {!aktivnaKonvId ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-kolo-muted text-sm">{t("izaberite_konverzaciju")}</p>
          </div>
        ) : (
          <>
            {/* Header chata */}
            <div className="px-4 py-3 border-b border-kolo-border flex items-center gap-3">
              <button
                onClick={() => setMobilniPrikaz("lista")}
                className="md:hidden p-1 text-kolo-muted hover:text-kolo-text transition-colors shrink-0"
                aria-label={t("nazad")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <KorisnikAvatar
                avatar={drugiAvatar}
                pseudonim={drugiPseudonim}
                userId={drugiId || undefined}
                size={32}
              />
              {drugiId ? (
                <Link href={`/profil/${drugiId}`} className="text-sm font-semibold text-kolo-green-700 hover:underline">
                  <Pseudonim>{drugiPseudonim}</Pseudonim>
                </Link>
              ) : (
                <span className="text-sm font-semibold text-kolo-text"><Pseudonim>{drugiPseudonim}</Pseudonim></span>
              )}
            </div>

            {/* Poruke */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
              {poruke.length === 0 && (
                <p className="text-center text-xs text-kolo-muted py-8">{t("pocnite_konverzaciju")}</p>
              )}
              {poruke.map((p) => (
                <PorukaBubble
                  key={p.id}
                  p={p}
                  avatar={p.moja ? mojAvatar : drugiAvatar}
                  pseudonim={p.moja ? mojPseudonim : drugiPseudonim}
                  userId={p.moja ? undefined : drugiId || undefined}
                />
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-kolo-border">
              <form onSubmit={posalji} className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={tekst}
                  onChange={(e) => setTekst(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("napišite_poruku")}
                  maxLength={1000}
                  rows={1}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors resize-none leading-relaxed"
                  style={{ maxHeight: "120px", overflowY: "auto" }}
                />
                <button
                  type="submit"
                  disabled={slanje || !tekst.trim()}
                  className="px-4 py-2.5 border border-transparent leading-relaxed bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors disabled:opacity-50 shrink-0"
                >
                  {slanje ? t("saljem") : t("posalji")}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Bail-out poređenja (polling bez promene ne sme da okine re-render) ──────────
function istePoruke(a: Poruka[], b: Poruka[]): boolean {
  return a.length === b.length && a[a.length - 1]?.id === b[b.length - 1]?.id;
}
function istiKonv(a: Konverzacija[], b: Konverzacija[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id || a[i].neprocitano !== b[i].neprocitano || a[i].poslednjeVreme !== b[i].poslednjeVreme) {
      return false;
    }
  }
  return true;
}

// ── Memo-izovane stavke listi ──────────────────────────────────────────────────
type TF = ReturnType<typeof useTranslations<"poruke">>;

const KonverzacijaRed = memo(function KonverzacijaRed({
  k,
  aktivna,
  onOtvori,
  t,
}: {
  k: Konverzacija;
  aktivna: boolean;
  onOtvori: (id: string) => void;
  t: TF;
}) {
  return (
    <button
      onClick={() => onOtvori(k.id)}
      className={`w-full text-left px-4 py-3 border-b border-kolo-border/50 last:border-0 hover:bg-kolo-bg transition-colors ${
        aktivna ? "bg-kolo-green-100/40" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar bez linka — red je već <button>, ugnežden link bi bio nevalidan */}
        <KorisnikAvatar avatar={k.drugiAvatar} pseudonim={k.drugiPseudonim} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-0.5 gap-2">
            <span className="text-sm font-semibold text-kolo-text truncate"><Pseudonim>{k.drugiPseudonim}</Pseudonim></span>
            <div className="flex items-center gap-1.5 shrink-0">
              {k.neprocitano > 0 && (
                <span className="w-4 h-4 bg-kolo-green-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {k.neprocitano > 9 ? "9+" : k.neprocitano}
                </span>
              )}
              <span className="text-[10px] text-kolo-border">
                {new Date(k.poslednjeVreme).toLocaleString("sr-RS", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
          {k.poslednjaPorukaIznos && (
            <p className="text-xs text-kolo-muted truncate">
              {k.poslednjaPosiljacJa ? t("vi") : ""}{k.poslednjaPorukaIznos}
            </p>
          )}
        </div>
      </div>
    </button>
  );
});

const PorukaBubble = memo(function PorukaBubble({
  p,
  avatar,
  pseudonim,
  userId,
}: {
  p: Poruka;
  avatar: string | null;
  pseudonim: string;
  userId?: string;
}) {
  return (
    <div className={`flex items-end gap-2 ${p.moja ? "justify-end" : "justify-start"}`}>
      {!p.moja && <KorisnikAvatar avatar={avatar} pseudonim={pseudonim} userId={userId} size={28} />}
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          p.moja
            ? "bg-kolo-green-700 text-white rounded-br-sm"
            : "bg-kolo-bg text-kolo-text border border-kolo-border rounded-bl-sm"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{p.tekst}</p>
        <p className={`text-[10px] mt-1 ${p.moja ? "text-white/70" : "text-kolo-border"}`}>
          {new Date(p.createdAt).toLocaleString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      {p.moja && <KorisnikAvatar avatar={avatar} pseudonim={pseudonim} size={28} />}
    </div>
  );
});

export default function PorukeStrana() {
  return (
    <Suspense>
      <PorukeContent />
    </Suspense>
  );
}
