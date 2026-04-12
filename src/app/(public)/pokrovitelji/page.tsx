import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Pokrovitelji — KOLO" };

export default async function PokroviteljiPage() {
  const pokrovitelji = await prisma.pokrovitelj.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      naziv: true,
      adresa: true,
      zadruga: { select: { name: true } },
      rsdKumulativ: true,
      trenutniNivo: true,
    },
    orderBy: { rsdKumulativ: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-kolo-green-900 mb-3">Pokrovitelji</h1>
        <p className="text-kolo-muted leading-relaxed">
          Pokrovitelji su pravna lica i organizacije koje podržavaju KOLO zajednicu
          sponzorstvima i donacijama. Njihovi vlasnici — verifikovani članovi platforme —
          dobijaju POEN bonuse srazmerno kumulativnom doprinosu.
        </p>
      </div>

      {pokrovitelji.length === 0 ? (
        <div className="bg-kolo-surface border border-kolo-border rounded-2xl p-8 text-center text-kolo-muted">
          Još uvek nema registrovanih pokrovitelja.
        </div>
      ) : (
        <div className="space-y-3">
          {pokrovitelji.map((p) => (
            <div
              key={p.id}
              className="bg-kolo-surface border border-kolo-border rounded-2xl px-6 py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="font-semibold text-kolo-text">{p.naziv}</div>
                <div className="text-sm text-kolo-muted mt-0.5">
                  {p.adresa && <span>{p.adresa}</span>}
                  {p.zadruga && (
                    <span className={p.adresa ? " · " : ""}>
                      Zadruga: {p.zadruga.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-semibold text-kolo-green-700">
                  Nivo {p.trenutniNivo}
                </div>
                <div className="text-xs text-kolo-muted mt-0.5">
                  {Number(p.rsdKumulativ).toLocaleString("sr-RS")} RSD
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-5 bg-kolo-gold-50 border border-kolo-gold-200 rounded-2xl">
        <h2 className="font-semibold text-kolo-gold-700 mb-2">Postanite pokrovitelj</h2>
        <p className="text-sm text-kolo-muted mb-3">
          Ako zastupate pravno lice i želite da podržite KOLO zajednicu, obratite se
          administratorima platforme ili se prijavite kao verifikovani član.
        </p>
        <Link
          href="/postani-pokrovitelj"
          className="inline-block text-sm font-medium text-kolo-gold-600 hover:underline"
        >
          Saznajte više →
        </Link>
      </div>
    </div>
  );
}
