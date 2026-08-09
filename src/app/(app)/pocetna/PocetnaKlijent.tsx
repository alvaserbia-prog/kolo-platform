"use client";

import { useEffect, useRef, useState } from "react";
import { intlTag } from "@/lib/format";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import Pseudonim from "@/components/Pseudonim";
import { profilHref } from "@/lib/profil-link";

interface BlogObjava {
  id: string;
  title: string;
  content: string;
  authorPseudonim: string;
  publishedAt: string;
}

interface ChatPoruka {
  id: string;
  userId: string;
  pseudonim: string;
  verified: boolean;
  avatar: string | null;
  content: string;
  createdAt: string;
}

interface Props {
  pseudonim: string;
  verified: boolean;
  currentUserId: string;
  blog: BlogObjava[];
  chatInicijalno: ChatPoruka[];
  /** UO Fondacije — može ukloniti spornu poruku iz sobe (Uslovi čl. 25 st. 2). */
  jeAdminViewer: boolean;
  /** Brojač stanja sistema na vrhu strane. */
  brojac: { clanovi: number; oglasi: number; razmene: number; opticaj: number };
}

export default function PocetnaKlijent({
  pseudonim,
  verified,
  currentUserId,
  blog,
  chatInicijalno,
  jeAdminViewer,
  brojac,
}: Props) {
  const locale = useLocale();
  const t = useTranslations("pocetna");
  const [poruke, setPoruke] = useState<ChatPoruka[]>(chatInicijalno);
  const [input, setInput] = useState("");
  const [salje, setSalje] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const [otvorenaObjava, setOtvorenaObjava] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  /**
   * Uklanjanje sporne poruke iz Pričaonice (Uslovi čl. 25 st. 2 — obuhvata „svu
   * drugu komunikaciju putem Platforme"). Razlog je obavezan jer se šalje autoru.
   * Bez ovoga bi jedina poluga nad spornom porukom bila isključenje korisnika.
   */
  async function ukloniPoruku(id: string) {
    const razlog = prompt("Razlog uklanjanja (vidi ga autor poruke):")?.trim();
    if (!razlog) return;
    const res = await fetch(`/api/admin/chat/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ razlog }),
    });
    if (res.ok) setPoruke((prev) => prev.filter((p) => p.id !== id));
    else {
      const data = await res.json().catch(() => ({}));
      setGreska(data.error ?? "Greška pri uklanjanju poruke.");
    }
  }

  // Skroluj na dno chata pri inicijalizaciji i pri svakoj novoj poruci
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [poruke.length]);

  // Polling za nove poruke u pričaonici (10s — globalna soba, ne treba realtime)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const last = poruke[poruke.length - 1];
        const url = last
          ? `/api/chat?since=${encodeURIComponent(last.createdAt)}`
          : `/api/chat`;
        const res = await fetch(url);
        if (!res.ok) return;
        const noveData: ChatPoruka[] = await res.json();
        if (noveData.length > 0) {
          setPoruke((prev) => {
            const postojeci = new Set(prev.map((p) => p.id));
            const dodaj = noveData.filter((p) => !postojeci.has(p.id));
            return [...prev, ...dodaj];
          });
        }
      } catch {
        // ignoriši
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [poruke]);

  async function posaljiPoruku(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || salje) return;
    setSalje(true);
    setGreska(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGreska(data.error ?? t("greska_slanje"));
        return;
      }
      setPoruke((prev) => [...prev, data.poruka]);
      setInput("");
    } catch {
      setGreska(t("greska_mreza"));
    } finally {
      setSalje(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="kolo-naslov" style={{ letterSpacing: "-0.02em" }}>
        {t.rich("dobrodoslice", { pseudonim, ime: (c) => <Pseudonim>{c}</Pseudonim> })}
      </h1>

      {/* Brojač stanja sistema. Stoji na vrhu jer je jedini zajednički pokazatelj
          da mreža raste — sve ostalo na strani je tekst pojedinaca. */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          ["brojac_clanovi", brojac.clanovi],
          ["brojac_oglasi", brojac.oglasi],
          ["brojac_razmene", brojac.razmene],
          ["brojac_opticaj", brojac.opticaj],
        ] as const).map(([kljuc, vrednost]) => (
          <div key={kljuc} className="bg-white rounded-2xl border border-kolo-border px-4 py-3">
            <p className="text-2xl font-bold tabular-nums text-kolo-text">
              {vrednost.toLocaleString(intlTag(locale))}
            </p>
            <p className="text-xs text-kolo-muted mt-0.5">{t(kljuc)}</p>
          </div>
        ))}
      </div>

      {/* Levo Vesti Fondacije, desno Pričaonica */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* ── BLOG / VESTI FONDACIJE ──────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-kolo-text">{t("vesti_naslov")}</h2>
        </div>

        {/* Prozor vesti — jedna bela kartica iste visine kao Pričaonica, sa skrolom */}
        <div className="bg-white rounded-2xl border border-kolo-border overflow-y-auto divide-y divide-kolo-border" style={{ height: 640 }}>
          {blog.length === 0 ? (
            <div className="h-full flex items-center justify-center p-8 text-center text-sm text-kolo-muted">
              {t("nema_objava")}
            </div>
          ) : (
            blog.map((o) => {
              const otvorena = otvorenaObjava === o.id;
              // Ako je jedina objava, prikaži je celu (bez skraćivanja) da popuni prozor.
              const jedina = blog.length === 1;
              const sazet = o.content.length > 280 && !otvorena && !jedina;
              return (
                <article
                  key={o.id}
                  className="p-5"
                >
                  <h3 className="text-base font-semibold text-kolo-text mb-1">
                    {o.title}
                  </h3>
                  <p className="text-xs text-kolo-muted mb-3">
                    {new Date(o.publishedAt).toLocaleDateString(intlTag(locale), {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-kolo-text leading-relaxed whitespace-pre-wrap text-body">
                    {sazet ? o.content.slice(0, 280) + "…" : o.content}
                  </p>
                  {o.content.length > 280 && !jedina && (
                    <button
                      onClick={() => setOtvorenaObjava(otvorena ? null : o.id)}
                      className="mt-2 text-sm font-medium text-kolo-green-700 hover:underline"
                    >
                      {otvorena ? t("skupi") : t("procitaj_celo")}
                    </button>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* ── PRIČAONICA ──────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-kolo-text">{t("chat_naslov")}</h2>
          <span className="text-xs text-kolo-muted">
            {t("chat_brisanje")}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden flex flex-col" style={{ height: 640 }}>
          {/* Spisak poruka */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
          >
            {poruke.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-kolo-muted">
                {t("chat_nema_poruka")}
              </div>
            ) : (
              poruke.map((p) => {
                const moja = p.userId === currentUserId;
                return (
                  <div
                    key={p.id}
                    className={`flex items-end gap-2 ${moja ? "justify-end" : "justify-start"}`}
                  >
                    {!moja && <ChatAvatar avatar={p.avatar} pseudonim={p.pseudonim} userId={p.userId} />}
                    <div className={`max-w-[75%] ${moja ? "items-end" : "items-start"} flex flex-col`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Link
                          href={profilHref({ id: p.userId, pseudonim: p.pseudonim })}
                          className="text-xs font-medium text-kolo-green-700 hover:underline"
                        >
                          <Pseudonim>{p.pseudonim}</Pseudonim>
                        </Link>
                        {p.verified && (
                          <span className="text-[10px] bg-kolo-green-100 text-kolo-green-700 px-1 rounded font-medium">
                            ✓
                          </span>
                        )}
                        <span className="text-[10px] text-kolo-muted">
                          {new Date(p.createdAt).toLocaleString(intlTag(locale), {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {jeAdminViewer && (
                          <button
                            onClick={() => ukloniPoruku(p.id)}
                            title={t("chat_ukloni_poruku")}
                            className="text-[10px] text-kolo-muted hover:text-kolo-danger transition-colors"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                          moja
                            ? "bg-kolo-green-700 text-white rounded-tr-sm"
                            : "bg-kolo-bg text-kolo-text rounded-tl-sm"
                        }`}
                      >
                        {p.content}
                      </div>
                    </div>
                    {moja && <ChatAvatar avatar={p.avatar} pseudonim={p.pseudonim} userId={p.userId} />}
                  </div>
                );
              })
            )}
          </div>

          {/* Input ili upozorenje */}
          <div className="border-t border-kolo-border p-3">
            {verified ? (
              <form onSubmit={posaljiPoruku} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("chat_placeholder")}
                  maxLength={1000}
                  className="flex-1 px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || salje}
                  className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {salje ? "..." : t("chat_posalji")}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-kolo-muted">
                  {t("chat_samo_verif")}
                </span>
                <Link
                  href="/verifikacija"
                  className="shrink-0 px-3 py-1.5 bg-kolo-gold-600 text-white text-xs font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors"
                >
                  {t("chat_zatrazi_verif")}
                </Link>
              </div>
            )}
            {greska && (
              <p className="mt-2 text-xs text-kolo-danger">{greska}</p>
            )}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

// Mali avatar korisnika pored poruke u pričaonici. R2/http URL ili legacy base64;
// fallback = inicijal pseudonima. Klik vodi na javni profil.
function ChatAvatar({
  avatar,
  pseudonim,
  userId,
}: {
  avatar: string | null;
  pseudonim: string;
  userId: string;
}) {
  const inicijal = (pseudonim?.trim()?.[0] ?? "?").toUpperCase();
  return (
    <Link
      href={profilHref({ id: userId, pseudonim })}
      title={pseudonim}
      className="shrink-0 w-7 h-7 rounded-full overflow-hidden bg-kolo-green-500 flex items-center justify-center text-white font-bold text-[11px] mb-0.5"
    >
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          alt={pseudonim}
          width={28}
          height={28}
          decoding="async"
          className="w-full h-full object-cover"
        />
      ) : (
        inicijal
      )}
    </Link>
  );
}
