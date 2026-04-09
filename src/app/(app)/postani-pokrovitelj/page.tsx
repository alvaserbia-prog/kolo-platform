import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Postani pokrovitelj — KOLO" };

export default async function PostaniPokroviteljPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/prijava");

  const mojiPokrovitelji = session.user.verified
    ? await prisma.pokrovitelj.findMany({
        where: { vlasnikId: session.user.id },
        select: {
          id: true,
          naziv: true,
          pib: true,
          rsdKumulativ: true,
          trenutniNivo: true,
          status: true,
          zadruga: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-kolo-green-900 mb-2">Pokroviteljstvo</h1>
        <p className="text-kolo-muted leading-relaxed">
          Pokrovitelj je pravno lice koje sponzoriše zadrugu ili donira Fondaciji.
          Kao vlasnik pokrovitelja, dobijate POEN bonuse pri svakom dostizanju novog nivoa.
        </p>
      </div>

      {!session.user.verified && (
        <div className="bg-kolo-gold-50 border border-kolo-gold-200 rounded-2xl p-5 mb-6">
          <p className="text-sm text-kolo-gold-700 font-medium mb-2">Potrebna je verifikacija</p>
          <p className="text-sm text-kolo-muted mb-3">
            Da biste mogli biti vlasnik pokrovitelja, potrebno je da verifikujete nalog.
          </p>
          <Link href="/verifikacija" className="text-sm font-medium text-kolo-gold-600 hover:underline">
            Verifikuj nalog →
          </Link>
        </div>
      )}

      <div className="bg-kolo-surface border border-kolo-border rounded-2xl p-5 mb-6">
        <h2 className="font-semibold text-kolo-text mb-3">Kako funkcioniše?</h2>
        <div className="space-y-2 text-sm text-kolo-muted">
          <p>1. Kontaktirajte administratore platforme sa podacima o pravnom licu (naziv, PIB).</p>
          <p>2. Admin kreira pokrovitelja i dodeljuje ga vama kao vlasniku.</p>
          <p>3. Kada pravno lice uplati sponzorstvo ili donaciju, admin evidentira doprinos u RSD.</p>
          <p>4. Pri dostizanju svakog nivoa, vi automatski dobijate POEN bonus na račun.</p>
        </div>
      </div>

      <div className="bg-kolo-surface border border-kolo-border rounded-2xl p-5 mb-6">
        <h2 className="font-semibold text-kolo-text mb-3">Struktura bonusa</h2>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between py-1.5 border-b border-kolo-border">
            <span className="text-kolo-muted">Nivo 1 — prvi doprinos</span>
            <span className="font-semibold text-kolo-green-700">20.000 POEN</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-kolo-border">
            <span className="text-kolo-muted">Nivo 2 — 50.000 RSD kumulativno</span>
            <span className="font-semibold text-kolo-green-700">50.000 POEN</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-kolo-border">
            <span className="text-kolo-muted">Nivo 3 — 100.000 RSD kumulativno</span>
            <span className="font-semibold text-kolo-green-700">100.000 POEN</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-kolo-border">
            <span className="text-kolo-muted">Nivo 4 — 200.000 RSD kumulativno</span>
            <span className="font-semibold text-kolo-green-700">200.000 POEN</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-kolo-muted">Nivo 5+ — 1-2-5 skala bez gornje granice</span>
            <span className="font-semibold text-kolo-green-700">prag u POEN</span>
          </div>
        </div>
      </div>

      {mojiPokrovitelji.length > 0 && (
        <div>
          <h2 className="font-semibold text-kolo-text mb-3">Moji pokrovitelji</h2>
          <div className="space-y-3">
            {mojiPokrovitelji.map((p) => (
              <div
                key={p.id}
                className="bg-kolo-surface border border-kolo-border rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="font-medium text-kolo-text">{p.naziv}</div>
                  <div className="text-xs text-kolo-muted mt-0.5">
                    PIB: {p.pib}
                    {p.zadruga && <span> · Zadruga: {p.zadruga.name}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    p.status === "ACTIVE"
                      ? "bg-kolo-green-100 text-kolo-green-700"
                      : "bg-kolo-danger-light text-kolo-danger"
                  }`}>
                    {p.status === "ACTIVE" ? "Aktivan" : "Suspendovan"}
                  </div>
                  <div className="text-sm text-kolo-muted mt-1">Nivo {p.trenutniNivo}</div>
                  <div className="text-xs text-kolo-muted">
                    {Number(p.rsdKumulativ).toLocaleString("sr-RS")} RSD
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
