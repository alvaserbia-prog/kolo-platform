"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Email je obavezan."); return; }
    if (!email.includes("@")) { setError("Unesite ispravnu email adresu."); return; }
    if (!password) { setError("Lozinka je obavezna."); return; }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!res || !res.ok || res.error) {
        setError("Pogrešan email ili lozinka.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Greška pri prijavi. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-8">
        <div className="mb-7">
          <h1 className="text-xl font-bold text-kolo-text">Prijava</h1>
          <p className="mt-1 text-sm text-kolo-muted">Dobrodošli nazad u KOLO</p>
        </div>

        {registered && (
          <div className="mb-5 text-sm text-kolo-green-700 bg-kolo-green-100 rounded-xl px-4 py-3">
            Nalog je kreiran. Prijavite se i sačekajte admin verifikaciju.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4" suppressHydrationWarning>
          <div>
            <label className="block text-sm font-medium text-kolo-text mb-1.5">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors bg-kolo-bg"
              placeholder="vas@email.com"
              suppressHydrationWarning
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-kolo-text mb-1.5">
              Lozinka
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors bg-kolo-bg"
              placeholder="••••••••"
              suppressHydrationWarning
            />
          </div>

          {error && (
            <p className="text-sm text-kolo-danger bg-red-50 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
            suppressHydrationWarning
          >
            {loading ? "Prijava u toku..." : "Prijavi se"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-kolo-muted">
          Nemate nalog?{" "}
          <Link href="/registracija" className="text-kolo-green-700 font-medium hover:underline">
            Registrujte se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
