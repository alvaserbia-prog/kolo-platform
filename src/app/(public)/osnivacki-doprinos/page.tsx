import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dohvatiStatusKanala, GORNJA_GRANICA, ITERATION_LIMIT } from "@/lib/protokol/osnivacki";

export const metadata = { title: "Osnivački doprinos — KOLO" };

const fmt = (n: number) => n.toLocaleString("sr-RS");

export default async function OsnivackiDoprinosPage() {
  // Pseudonimi osnivača vidljivi su isključivo verifikovanim članovima (Pravilnik o
  // osnivačkom doprinosu čl. 12 — „javnost udela" znači prema zajednici verifikovanih,
  // ne prema eksternoj javnosti). Neverifikovani/gosti vide samo agregat kanala.
  const session = await getServerSession(authOptions);
  const verifikovan = !!session?.user?.verified;

  let status: Awaited<ReturnType<typeof dohvatiStatusKanala>> | null = null;
  try {
    status = await dohvatiStatusKanala();
  } catch {
    status = null;
  }

  const [osnivaci, koraci] = await Promise.all([
    verifikovan
      ? prisma.osnivac.findMany({
          select: {
            redniBroj: true,
            udeoBrojilac: true,
            udeoImenilac: true,
            napomena: true,
            user: { select: { pseudonim: true } },
          },
          orderBy: { redniBroj: "asc" },
        })
      : Promise.resolve([] as const),
    prisma.osnivackiKorakLog.findMany({
      select: { brojKoraka: true, prag: true, iznosKoraka: true, createdAt: true },
      orderBy: { brojKoraka: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="max-w-[932px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-kolo-green-900 mb-3">Osnivački doprinos</h1>
        <p className="text-kolo-muted leading-relaxed text-body">
          Osnivački doprinos je naknadno evidentiranje rada obavljenog na projektovanju i pripremi
          KOLO sistema pre otvaranja platforme. Evidentira se automatski, u koracima od{" "}
          {fmt(GORNJA_GRANICA / ITERATION_LIMIT)} POEN-a, svaki put kada ukupan broj evidentiranih
          POEN-a u sistemu dostigne novi prag od 100.000. Ukupna gornja granica je{" "}
          {fmt(GORNJA_GRANICA)} POEN-a ({ITERATION_LIMIT} koraka), nakon čega se kanal trajno zatvara.
        </p>
      </div>

      {status && (
        <div className="bg-kolo-surface border border-kolo-border rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-kolo-text">Stanje kanala</h2>
            {status.zatvoren && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-kolo-bg text-kolo-muted">
                Trajno zatvoren
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-xs text-kolo-muted">Izvršeno koraka</div>
              <div className="font-semibold text-kolo-text">{status.brojKoraka} / {ITERATION_LIMIT}</div>
            </div>
            <div>
              <div className="text-xs text-kolo-muted">Evidentirano</div>
              <div className="font-semibold text-kolo-text">{fmt(status.ukupnoEvidentirano)} POEN</div>
            </div>
            <div>
              <div className="text-xs text-kolo-muted">Preostalo</div>
              <div className="font-semibold text-kolo-text">{fmt(status.preostalo)} POEN</div>
            </div>
            <div>
              <div className="text-xs text-kolo-muted">Iskorišćenost</div>
              <div className="font-semibold text-kolo-text">{status.procenatIskoriscenja}%</div>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-kolo-bg overflow-hidden">
            <div className="h-full bg-kolo-green-700" style={{ width: `${Math.min(100, status.procenatIskoriscenja)}%` }} />
          </div>
        </div>
      )}

      <h2 className="font-semibold text-kolo-text mb-3">Osnivači i udeli</h2>
      {!verifikovan ? (
        <div className="bg-kolo-surface border border-kolo-border rounded-2xl p-8 text-center text-kolo-muted">
          Registar osnivača sa pseudonimima i udelima dostupan je verifikovanim članovima.
          Ukupan osnivački doprinos vidljiv je gore, u stanju kanala.
        </div>
      ) : osnivaci.length === 0 ? (
        <div className="bg-kolo-surface border border-kolo-border rounded-2xl p-8 text-center text-kolo-muted">
          Registar osnivača još nije objavljen.
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {osnivaci.map((o) => (
            <div key={o.redniBroj} className="bg-kolo-surface border border-kolo-border rounded-2xl px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-semibold text-kolo-text">{o.user.pseudonim}</div>
                {o.napomena && <div className="text-sm text-kolo-muted mt-0.5">{o.napomena}</div>}
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-semibold text-kolo-green-700">
                  {Math.round((o.udeoBrojilac / o.udeoImenilac) * 1000) / 10}%
                </div>
                <div className="text-xs text-kolo-muted mt-0.5">{o.udeoBrojilac}/{o.udeoImenilac}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {koraci.length > 0 && (
        <>
          <h2 className="font-semibold text-kolo-text mb-3">Poslednji evidentirani koraci</h2>
          <div className="bg-kolo-surface border border-kolo-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-kolo-muted border-b border-kolo-border">
                  <th className="px-6 py-3 font-medium">Korak</th>
                  <th className="px-6 py-3 font-medium">Prag</th>
                  <th className="px-6 py-3 font-medium">Iznos</th>
                  <th className="px-6 py-3 font-medium">Datum</th>
                </tr>
              </thead>
              <tbody>
                {koraci.map((k) => (
                  <tr key={k.brojKoraka} className="border-b border-kolo-border last:border-0">
                    <td className="px-6 py-3 text-kolo-text">{k.brojKoraka}/{ITERATION_LIMIT}</td>
                    <td className="px-6 py-3 text-kolo-muted">{fmt(k.prag)}</td>
                    <td className="px-6 py-3 text-kolo-muted">{fmt(k.iznosKoraka)} POEN</td>
                    <td className="px-6 py-3 text-kolo-muted">
                      {new Date(k.createdAt).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
