import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  const [clanovi, banka] = await Promise.all([
    prisma.user.count({ where: { verified: true } }),
    prisma.wallet.findUnique({ where: { id: "banka-singleton" }, select: { balance: true } }),
  ]);
  const opticaj = banka ? Math.abs(banka.balance) : 0;

  return (
    <div className="min-h-full bg-kolo-bg">
      {/* Nav */}
      <header className="border-b border-kolo-border bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kolo-logo.png" alt="KOLO" style={{ height: 44, width: "auto" }} />
          <div className="flex items-center gap-3">
            <Link href="/pijaca" className="text-sm text-kolo-muted hover:text-kolo-green-700 transition-colors">
              Pijaca
            </Link>
            <Link href="/kako-funkcionise" className="text-sm text-kolo-muted hover:text-kolo-green-700 transition-colors">
              Kako funkcioniše
            </Link>
            <Link href="/login" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-500 transition-colors">
              Prijavi se
            </Link>
            <Link href="/registracija" className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors">
              Pridruži se
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          Alternativni ekonomski sistem
        </div>
        <h1 className="text-5xl font-bold text-kolo-green-900 mb-6" style={{ letterSpacing: "-0.03em", lineHeight: 1.15 }}>
          Sistem zasnovan<br />na uzajamnosti
        </h1>
        <p className="text-lg text-kolo-muted max-w-xl mx-auto mb-10 leading-relaxed">
          KOLO je mreža lokalnih zadruga gde doprinosi zajednici imaju vrednost.
          POEN beleži tvoj doprinos, ZRNO ti daje glas.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/registracija" className="px-7 py-3.5 bg-kolo-green-700 text-white font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors text-sm">
            Postani član →
          </Link>
          <Link href="/kako-funkcionise" className="px-7 py-3.5 border border-kolo-border text-kolo-text font-medium rounded-xl hover:border-kolo-green-700 hover:text-kolo-green-700 transition-colors text-sm">
            Kako funkcioniše
          </Link>
        </div>
      </section>

      {/* Javni widget */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="bg-white rounded-2xl card-shadow p-5 text-center">
            <p className="text-3xl font-bold font-mono text-kolo-green-700">{clanovi.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-kolo-muted mt-1">verifikovanih članova</p>
          </div>
          <div className="bg-white rounded-2xl card-shadow p-5 text-center">
            <p className="text-3xl font-bold font-mono text-kolo-green-700">{opticaj.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-kolo-muted mt-1">POEN u opticaju</p>
          </div>
        </div>
      </section>

      {/* Šta je KOLO */}
      <section className="bg-white border-t border-kolo-border">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-kolo-green-900 mb-10 text-center" style={{ letterSpacing: "-0.02em" }}>
            Kako KOLO funkcioniše
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                ikona: "🌾",
                naslov: "Doprinesi zajednici",
                opis: "Verifikacijom identiteta i donacijama Fondaciji zarađuješ POEN — jedinicu evidencije doprinosa.",
              },
              {
                ikona: "🤝",
                naslov: "Trguj i razmenjuj",
                opis: "Na Pijaci prodaješ i kupuješ robu i usluge koristeći POEN između članova zajednice.",
              },
              {
                ikona: "🗳️",
                naslov: "Upravljaj sistemom",
                opis: "ZRNO je glasačka jedinica. Zaključavanjem ZRNA dobijaš glas u odlukama koje oblikuju KOLO.",
              },
            ].map((k) => (
              <div key={k.naslov} className="text-center">
                <div className="text-4xl mb-4">{k.ikona}</div>
                <h3 className="font-semibold text-kolo-text mb-2">{k.naslov}</h3>
                <p className="text-sm text-kolo-muted leading-relaxed">{k.opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programi preview */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-kolo-green-900 mb-3 text-center" style={{ letterSpacing: "-0.02em" }}>
          Programi Banke
        </h2>
        <p className="text-sm text-kolo-muted text-center mb-10 max-w-lg mx-auto">
          KOLO Banka emituje POEN kroz programe koji nagrađuju doprinos zajednici.
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {[
            { naziv: "Verifikacija", opis: "1.000 POEN za svaki novi verifikovani nalog", ikona: "✓" },
            { naziv: "Preporuke", opis: "Do 10.000 POEN po preporuci, 10 nivoa nagrade", ikona: "→" },
            { naziv: "Donacije", opis: "Kurs POEN/RSD raste sa ukupnim donacijama", ikona: "♥" },
            { naziv: "Podrška porodicama", opis: "Programi za majke, starije, školovanje i zapošljavanje", ikona: "🏡", locked: true },
          ].map((p) => (
            <div key={p.naziv} className={`bg-white rounded-2xl card-shadow p-5 flex gap-4 items-start ${p.locked ? "opacity-60" : ""}`}>
              <div className="w-9 h-9 rounded-xl bg-kolo-green-100 text-kolo-green-700 flex items-center justify-center text-lg shrink-0 font-bold">
                {p.locked ? "🔒" : p.ikona}
              </div>
              <div>
                <p className="text-sm font-semibold text-kolo-text">{p.naziv}</p>
                <p className="text-xs text-kolo-muted mt-0.5">{p.opis}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-kolo-green-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-14 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ letterSpacing: "-0.02em" }}>Spreman/a da se pridružiš?</h2>
          <p className="text-green-200 mb-8 text-sm">Registracija je besplatna. Verifikacijom dobijate 1.000 POEN bonus.</p>
          <Link href="/registracija" className="px-8 py-3.5 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm">
            Registruj se besplatno →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-kolo-border bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center text-xs text-kolo-muted">
          <span>© 2025 KOLO Fondacija</span>
          <div className="flex gap-6">
            <Link href="/kako-funkcionise" className="hover:text-kolo-green-700 transition-colors">Kako funkcioniše</Link>
            <Link href="/pijaca" className="hover:text-kolo-green-700 transition-colors">Pijaca</Link>
            <Link href="/login" className="hover:text-kolo-green-700 transition-colors">Prijava</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
