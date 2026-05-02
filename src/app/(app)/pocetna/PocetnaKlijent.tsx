"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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
  content: string;
  createdAt: string;
}

interface Props {
  pseudonim: string;
  verified: boolean;
  currentUserId: string;
  blog: BlogObjava[];
  chatInicijalno: ChatPoruka[];
}

export default function PocetnaKlijent({
  pseudonim,
  verified,
  currentUserId,
  blog,
  chatInicijalno,
}: Props) {
  const [poruke, setPoruke] = useState<ChatPoruka[]>(chatInicijalno);
  const [input, setInput] = useState("");
  const [salje, setSalje] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const [otvorenaObjava, setOtvorenaObjava] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Skroluj na dno chata pri inicijalizaciji i pri svakoj novoj poruci
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [poruke.length]);

  // Polling za nove poruke svakih 5 sekundi
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
    }, 5000);
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
        setGreska(data.error ?? "Greška pri slanju.");
        return;
      }
      setPoruke((prev) => [...prev, data.poruka]);
      setInput("");
    } catch {
      setGreska("Greška u mreži.");
    } finally {
      setSalje(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="kolo-naslov" style={{ letterSpacing: "-0.02em" }}>
        Dobrodošao, {pseudonim}
      </h1>

      {/* ── BLOG / VESTI FONDACIJE ──────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-kolo-text">Vesti Fondacije</h2>
        </div>

        {blog.length === 0 ? (
          <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
            Još uvek nema objava.
          </div>
        ) : (
          <div className="space-y-3">
            {blog.map((o) => {
              const otvorena = otvorenaObjava === o.id;
              const sazet = o.content.length > 280 && !otvorena;
              return (
                <article
                  key={o.id}
                  className="bg-white rounded-2xl border border-kolo-border p-5"
                >
                  <h3 className="text-base font-semibold text-kolo-text mb-1">
                    {o.title}
                  </h3>
                  <p className="text-xs text-kolo-muted mb-3">
                    {new Date(o.publishedAt).toLocaleDateString("sr-RS", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-kolo-text leading-relaxed whitespace-pre-wrap">
                    {sazet ? o.content.slice(0, 280) + "…" : o.content}
                  </p>
                  {o.content.length > 280 && (
                    <button
                      onClick={() => setOtvorenaObjava(otvorena ? null : o.id)}
                      className="mt-2 text-sm font-medium text-kolo-green-700 hover:underline"
                    >
                      {otvorena ? "Skupi" : "Pročitaj celu objavu →"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ── CHAT SOBA ───────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-kolo-text">Chat soba</h2>
          <span className="text-xs text-kolo-muted">
            Poruke se brišu nakon 30 dana
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden flex flex-col" style={{ height: 480 }}>
          {/* Spisak poruka */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
          >
            {poruke.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-kolo-muted">
                Nema poruka. Budi prvi koji će napisati.
              </div>
            ) : (
              poruke.map((p) => {
                const moja = p.userId === currentUserId;
                return (
                  <div
                    key={p.id}
                    className={`flex ${moja ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[75%] ${moja ? "items-end" : "items-start"} flex flex-col`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Link
                          href={`/profil/${p.userId}`}
                          className="text-xs font-medium text-kolo-green-700 hover:underline"
                        >
                          {p.pseudonim}
                        </Link>
                        {p.verified && (
                          <span className="text-[10px] bg-kolo-green-100 text-kolo-green-700 px-1 rounded font-medium">
                            ✓
                          </span>
                        )}
                        <span className="text-[10px] text-kolo-muted">
                          {new Date(p.createdAt).toLocaleString("sr-RS", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
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
                  placeholder="Napiši poruku…"
                  maxLength={1000}
                  className="flex-1 px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || salje}
                  className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {salje ? "..." : "Pošalji"}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-kolo-muted">
                  Pisanje u chat sobu dostupno je samo verifikovanim članovima.
                </span>
                <Link
                  href="/verifikacija"
                  className="shrink-0 px-3 py-1.5 bg-kolo-gold-600 text-white text-xs font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors"
                >
                  Verifikuj nalog →
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
  );
}
