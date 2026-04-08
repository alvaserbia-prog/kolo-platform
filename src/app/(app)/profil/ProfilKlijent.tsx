"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";

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
  };
}

export default function ProfilKlijent({ user }: ProfilProps) {
  const router = useRouter();
  const [noviPseudonim, setNoviPseudonim] = useState("");
  const [psError, setPsError] = useState("");
  const [psSuccess, setPsSuccess] = useState("");
  const [novaLozinka, setNovaLozinka] = useState("");
  const [staraLozinka, setStaraLozinka] = useState("");
  const [lzError, setLzError] = useState("");
  const [lzSuccess, setLzSuccess] = useState("");

  // Provera da li je moguća promena pseudonima (jednom u 30 dana)
  const mozeMenjatiPseudonim = !user.pseudonimChangedAt ||
    (Date.now() - new Date(user.pseudonimChangedAt).getTime()) > 30 * 24 * 60 * 60 * 1000;

  async function promeniPseudonim(e: React.FormEvent) {
    e.preventDefault();
    setPsError(""); setPsSuccess("");
    if (noviPseudonim.length < 3) { setPsError("Minimalno 3 karaktera."); return; }
    const res = await fetch("/api/profil/pseudonim", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudonim: noviPseudonim }),
    });
    const data = await res.json();
    if (!res.ok) { setPsError(data.error); return; }
    setPsSuccess("Pseudonim promenjen. Odjavljujemo vas...");
    setTimeout(() => signOut({ callbackUrl: "/login" }), 1500);
  }

  async function promeniLozinku(e: React.FormEvent) {
    e.preventDefault();
    setLzError(""); setLzSuccess("");
    if (novaLozinka.length < 8) { setLzError("Lozinka mora imati najmanje 8 karaktera."); return; }
    const res = await fetch("/api/profil/lozinka", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staraLozinka, novaLozinka }),
    });
    const data = await res.json();
    if (!res.ok) { setLzError(data.error); return; }
    setLzSuccess("Lozinka promenjena."); setStaraLozinka(""); setNovaLozinka("");
  }

  const roleLabel: Record<string, string> = {
    FIZICKO_LICE: "Fizičko lice",
    ZADRUGAR: "Zadrugar",
    ADMIN: "Administrator",
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Profil</h1>

      {/* Osnovni podaci */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-700">Osnovni podaci</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Pseudonim</dt>
            <dd className="font-medium text-gray-900">{user.pseudonim}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-700">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Uloga</dt>
            <dd className="text-gray-700">{roleLabel[user.role] ?? user.role}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Status</dt>
            <dd>
              {user.verified ? (
                <span className="text-green-700 font-medium">Verifikovan</span>
              ) : (
                <span className="text-amber-600 font-medium">Čeka verifikaciju</span>
              )}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">POEN stanje</dt>
            <dd className="font-bold text-green-700">{user.balance.toLocaleString()} POEN</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Referral kod</dt>
            <dd className="font-mono text-gray-900 bg-gray-50 px-2 py-0.5 rounded">{user.referralCode}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Registrovan</dt>
            <dd className="text-gray-700">{new Date(user.createdAt).toLocaleDateString("sr-RS")}</dd>
          </div>
        </dl>
      </div>

      {/* Promena pseudonima */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Promena pseudonima</h2>
        {mozeMenjatiPseudonim ? (
          <form onSubmit={promeniPseudonim} className="space-y-3">
            <input
              type="text"
              minLength={3}
              maxLength={30}
              placeholder="Novi pseudonim"
              value={noviPseudonim}
              onChange={(e) => setNoviPseudonim(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600"
            />
            {psError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{psError}</p>}
            {psSuccess && <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{psSuccess}</p>}
            <button type="submit" className="w-full py-3 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors">
              Promeni pseudonim
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-500">
            Pseudonim možete menjati jednom u 30 dana.{" "}
            {user.pseudonimChangedAt && (
              <>Sledeća promena moguća: {new Date(new Date(user.pseudonimChangedAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("sr-RS")}.</>
            )}
          </p>
        )}
      </div>

      {/* Promena lozinke */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Promena lozinke</h2>
        <form onSubmit={promeniLozinku} className="space-y-3">
          <input
            type="password"
            placeholder="Trenutna lozinka"
            value={staraLozinka}
            onChange={(e) => setStaraLozinka(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600"
          />
          <input
            type="password"
            placeholder="Nova lozinka (min. 8 karaktera)"
            value={novaLozinka}
            onChange={(e) => setNovaLozinka(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600"
          />
          {lzError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{lzError}</p>}
          {lzSuccess && <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{lzSuccess}</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors">
            Promeni lozinku
          </button>
        </form>
      </div>

      {/* Moji oglasi */}
      <Link
        href="/profil/oglasi"
        className="block bg-white rounded-2xl border border-gray-200 px-6 py-4 hover:border-green-300 transition-colors"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-900">Moji oglasi</p>
            <p className="text-xs text-gray-400 mt-0.5">Pregled aktivnih i prodatih oglasa</p>
          </div>
          <span className="text-gray-300">→</span>
        </div>
      </Link>
    </div>
  );
}
