"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8 flex flex-col items-center">
          <Image src="/kolo-logo.png" alt="KOLO" width={160} height={109} className="object-contain" priority unoptimized />
          <p className="mt-2 text-sm text-gray-500">Prijavite se na platformu</p>
        </div>

        {registered && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
            Nalog je kreiran. Prijavite se i sačekajte admin verifikaciju.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4" suppressHydrationWarning>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
              placeholder="vas@email.com"
              suppressHydrationWarning
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lozinka
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
              placeholder="••••••••"
              suppressHydrationWarning
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-60"
            suppressHydrationWarning
          >
            {loading ? "Prijava u toku..." : "Prijavi se"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Nemate nalog?{" "}
          <Link href="/registracija" className="text-green-700 font-medium hover:underline">
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
