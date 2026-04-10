"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import LokacijaSearch from "@/components/LokacijaSearch";

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
    avatar: string | null;
  };
}

export default function ProfilKlijent({ user }: ProfilProps) {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(user.avatar);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
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
  const [podaciError, setPodaciError] = useState("");
  const [podaciSuccess, setPodaciSuccess] = useState("");
  const [podaciLoading, setPodaciLoading] = useState(false);

  const mozeMenjatiPseudonim = !user.pseudonimChangedAt ||
    (Date.now() - new Date(user.pseudonimChangedAt).getTime()) > 30 * 24 * 60 * 60 * 1000;

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError("");
    setAvatarLoading(true);

    const base64 = await new Promise<string>((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = url;
    });

    if (base64.length > 150_000) {
      setAvatarError("Slika je prevelika. Pokušaj sa manjom slikom.");
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
    if (!res.ok) { setAvatarError(data.error ?? "Greška pri čuvanju."); return; }
    setAvatar(base64);
    e.target.value = "";
  }

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

  async function sacuvajPodatke(e: React.FormEvent) {
    e.preventDefault();
    setPodaciError(""); setPodaciSuccess("");
    setPodaciLoading(true);
    const res = await fetch("/api/profil/podaci", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ punoIme }),
    });
    const data = await res.json();
    setPodaciLoading(false);
    if (!res.ok) { setPodaciError(data.error ?? "Greška pri čuvanju."); return; }
    setPodaciSuccess("Sačuvano.");
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
    if (!res.ok) { setLocError(data.error ?? "Greška pri čuvanju."); return; }
    setLocSuccess("Sačuvano.");
    router.refresh();
  }

  const roleLabel: Record<string, string> = {
    FIZICKO_LICE: "Fizičko lice",
    ZADRUGAR: "Zadrugar",
    ADMIN: "Administrator",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-kolo-text">Profil</h1>

      {/* Profilna slika */}
      <div className="bg-white rounded-2xl border border-kolo-border p-6">
        <h2 className="text-base font-semibold text-kolo-muted mb-4">Profilna slika</h2>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-kolo-border shrink-0">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={user.pseudonim} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-kolo-green-500 flex items-center justify-center text-white font-bold text-2xl">
                {user.pseudonim.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-kolo-border text-sm text-kolo-text hover:bg-kolo-bg transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {avatarLoading ? "Čuvam..." : "Postavi sliku"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={avatarLoading}
                onChange={uploadAvatar}
              />
            </label>
            <p className="text-xs text-kolo-muted mt-2">JPG, PNG, WebP — automatski se iseca na kvadrat 256×256px</p>
            {avatarError && <p className="text-sm text-kolo-danger mt-2">{avatarError}</p>}
          </div>
        </div>
      </div>

      {/* Osnovni podaci */}
      <div className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
        <h2 className="text-base font-semibold text-kolo-muted">Osnovni podaci</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-kolo-muted">Pseudonim</dt>
            <dd className="font-medium text-kolo-text">{user.pseudonim}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-kolo-muted">Email</dt>
            <dd className="text-kolo-muted">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-kolo-muted">Uloga</dt>
            <dd className="text-kolo-muted">{roleLabel[user.role] ?? user.role}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-kolo-muted">Status</dt>
            <dd>
              {user.verified ? (
                <span className="text-kolo-green-700 font-medium">Verifikovan</span>
              ) : (
                <span className="text-kolo-gold-600 font-medium">Čeka verifikaciju</span>
              )}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-kolo-muted">POEN stanje</dt>
            <dd className="font-bold text-kolo-green-700">{user.balance.toLocaleString()} POEN</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-kolo-muted">Referral kod</dt>
            <dd className="font-mono text-kolo-text bg-kolo-bg px-2 py-0.5 rounded">{user.referralCode}</dd>
          </div>
          {user.punoIme && (
            <div className="flex justify-between">
              <dt className="text-kolo-muted">Ime i prezime</dt>
              <dd className="text-kolo-muted">{user.punoIme}</dd>
            </div>
          )}
          {user.location && (
            <div className="flex justify-between">
              <dt className="text-kolo-muted">Lokacija</dt>
              <dd className="text-kolo-muted">{user.location}</dd>
            </div>
          )}
          {user.telefon && (
            <div className="flex justify-between">
              <dt className="text-kolo-muted">Telefon</dt>
              <dd className="text-kolo-muted">{user.telefon}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-kolo-muted">Registrovan</dt>
            <dd className="text-kolo-muted">{new Date(user.createdAt).toLocaleDateString("sr-RS")}</dd>
          </div>
        </dl>
      </div>

      {/* Lokacija i telefon */}
      <div className="bg-white rounded-2xl border border-kolo-border p-6">
        <h2 className="text-base font-semibold text-kolo-muted mb-4">Lokacija i kontakt</h2>
        <form onSubmit={sacuvajLokaciju} className="space-y-3">
          <div>
            <label className="block text-sm text-kolo-muted mb-1.5">Mesto <span className="text-kolo-muted">(opciono)</span></label>
            <LokacijaSearch value={location} onChange={setLocation} />
          </div>
          <div>
            <label className="block text-sm text-kolo-muted mb-1.5">Telefon <span className="text-kolo-muted">(opciono)</span></label>
            <input
              type="tel"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              placeholder="npr. +381 60 123 4567"
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
            {locLoading ? "Čuvam..." : "Sačuvaj"}
          </button>
        </form>
      </div>

      {/* Ime i prezime */}
      <div className="bg-white rounded-2xl border border-kolo-border p-6">
        <h2 className="text-base font-semibold text-kolo-muted mb-4">Ime i prezime</h2>
        <form onSubmit={sacuvajPodatke} className="space-y-3">
          <div>
            <label className="block text-sm text-kolo-muted mb-1.5">Puno ime <span className="text-kolo-muted">(opciono)</span></label>
            <input
              type="text"
              value={punoIme}
              onChange={(e) => setPunoIme(e.target.value)}
              placeholder="npr. Marko Marković"
              maxLength={100}
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
            {podaciLoading ? "Čuvam..." : "Sačuvaj"}
          </button>
        </form>
      </div>

      {/* Promena pseudonima */}
      <div className="bg-white rounded-2xl border border-kolo-border p-6">
        <h2 className="text-base font-semibold text-kolo-muted mb-4">Promena pseudonima</h2>
        {mozeMenjatiPseudonim ? (
          <form onSubmit={promeniPseudonim} className="space-y-3">
            <input
              type="text"
              minLength={3}
              maxLength={30}
              placeholder="Novi pseudonim"
              value={noviPseudonim}
              onChange={(e) => setNoviPseudonim(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500"
            />
            {psError && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{psError}</p>}
            {psSuccess && <p className="text-sm text-kolo-green-700 bg-kolo-green-100 rounded-lg px-3 py-2">{psSuccess}</p>}
            <button type="submit" className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors">
              Promeni pseudonim
            </button>
          </form>
        ) : (
          <p className="text-sm text-kolo-muted">
            Pseudonim možete menjati jednom u 30 dana.{" "}
            {user.pseudonimChangedAt && (
              <>Sledeća promena moguća: {new Date(new Date(user.pseudonimChangedAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("sr-RS")}.</>
            )}
          </p>
        )}
      </div>

      {/* Promena lozinke */}
      <div className="bg-white rounded-2xl border border-kolo-border p-6">
        <h2 className="text-base font-semibold text-kolo-muted mb-4">Promena lozinke</h2>
        <form onSubmit={promeniLozinku} className="space-y-3">
          <input
            type="password"
            placeholder="Trenutna lozinka"
            value={staraLozinka}
            onChange={(e) => setStaraLozinka(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500"
          />
          <input
            type="password"
            placeholder="Nova lozinka (min. 8 karaktera)"
            value={novaLozinka}
            onChange={(e) => setNovaLozinka(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500"
          />
          {lzError && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{lzError}</p>}
          {lzSuccess && <p className="text-sm text-kolo-green-700 bg-kolo-green-100 rounded-lg px-3 py-2">{lzSuccess}</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors">
            Promeni lozinku
          </button>
        </form>
      </div>

      {/* Moji oglasi */}
      <Link
        href="/profil/oglasi"
        className="block bg-white rounded-2xl border border-kolo-border px-6 py-4 hover:border-kolo-green-100 transition-colors"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-kolo-text">Moji oglasi</p>
            <p className="text-xs text-kolo-muted mt-0.5">Pregled aktivnih i prodatih oglasa</p>
          </div>
          <span className="text-kolo-border">→</span>
        </div>
      </Link>
    </div>
  );
}
