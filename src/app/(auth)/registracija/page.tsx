"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function RegistracijaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    pseudonim: "",
    password: "",
    passwordConfirm: "",
    referralCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.email.trim()) { setError("Email je obavezan."); return; }
    if (!form.email.includes("@")) { setError("Unesite ispravnu email adresu."); return; }
    if (form.pseudonim.trim().length < 3) { setError("Pseudonim mora imati najmanje 3 karaktera."); return; }
    if (form.password.length < 8) { setError("Lozinka mora imati najmanje 8 karaktera."); return; }
    if (form.password !== form.passwordConfirm) { setError("Lozinke se ne poklapaju."); return; }

    setLoading(true);
    const res = await fetch("/api/registracija", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        pseudonim: form.pseudonim,
        password: form.password,
        referralCode: form.referralCode || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Greška pri registraciji.");
      return;
    }

    // Auto-login pa redirect na verifikaciju
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      router.push("/login?registered=1");
      return;
    }

    router.push("/verifikacija");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8 flex flex-col items-center">
          <Image src="/kolo-logo.png" alt="KOLO" width={100} height={100} className="object-contain" priority />
          <p className="mt-2 text-sm text-gray-500">Registracija novog člana</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
              placeholder="vas@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pseudonim *
            </label>
            <input
              type="text"
              autoComplete="username"
              maxLength={30}
              value={form.pseudonim}
              onChange={(e) => set("pseudonim", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
              placeholder="VasePseudonim"
            />
            <p className="mt-1 text-xs text-gray-400">Javno vidljiv, ne prikazuje pravo ime</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lozinka * <span className="text-gray-400 font-normal">(min. 8 karaktera)</span>
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Potvrda lozinke *
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={form.passwordConfirm}
              onChange={(e) => set("passwordConfirm", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referral kod <span className="text-gray-400 font-normal">(opciono)</span>
            </label>
            <input
              type="text"
              value={form.referralCode}
              onChange={(e) => set("referralCode", e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors font-mono"
              placeholder="ABCD1234"
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
          >
            {loading ? "Registracija..." : "Registruj se"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Već imate nalog?{" "}
          <Link href="/login" className="text-green-700 font-medium hover:underline">
            Prijavite se
          </Link>
        </p>
      </div>
    </div>
  );
}
