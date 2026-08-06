import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import PokroviteljstvoPrijava from "./PokroviteljstvoPrijava";

export const metadata = { title: "Postani pokrovitelj — KOLO" };

export default async function PostaniPokroviteljPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/prijava");
  const t = await getTranslations("postaniPokrovitelj");

  const [mojiPokrovitelji, sviPokrovitelji] = await Promise.all([
    session.user.verified
      ? prisma.pokrovitelj.findMany({
          where: { vlasnikId: session.user.id },
          select: {
            id: true,
            naziv: true,
            pib: true,
            rsdKumulativ: true,
            trenutniNivo: true,
            status: true,
          },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
    prisma.pokrovitelj.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        naziv: true,
        adresa: true,
        rsdKumulativ: true,
        trenutniNivo: true,
      },
      orderBy: { rsdKumulativ: "desc" },
    }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="kolo-naslov mb-2">{t("naslov")}</h1>
        <p className="text-kolo-muted leading-relaxed">
          {t("opis")}
        </p>
      </div>

      {!session.user.verified && (
        <div className="bg-kolo-gold-50 border border-kolo-gold-200 rounded-2xl p-5 mb-6">
          <p className="text-sm text-kolo-gold-700 font-medium mb-2">{t("verifikacija_potrebna")}</p>
          <p className="text-sm text-kolo-muted mb-3">
            {t("verifikacija_opis")}
          </p>
          <Link href="/tabla-jemstva" className="text-sm font-medium text-kolo-gold-600 hover:underline">
            {t("verifikacija_link")}
          </Link>
        </div>
      )}

      {session.user.verified && <PokroviteljstvoPrijava />}

      <div className="bg-kolo-surface border border-kolo-border rounded-2xl p-5 mb-6">
        <h2 className="font-semibold text-kolo-text mb-3">{t("nivoi_naslov")}</h2>
        <div className="space-y-1.5 text-sm">
          {[
            { nivo: 1, rsd: "10.000", poen: "20.000" },
            { nivo: 2, rsd: "20.000", poen: "30.000" },
            { nivo: 3, rsd: "50.000", poen: "80.000" },
            { nivo: 4, rsd: "100.000", poen: "150.000" },
            { nivo: 5, rsd: "200.000", poen: "300.000" },
            { nivo: 6, rsd: "500.000", poen: "800.000" },
            { nivo: 7, rsd: "1.000.000", poen: "1.500.000" },
          ].map((r) => (
            <div key={r.nivo} className="flex justify-between py-1.5 border-b border-kolo-border last:border-0">
              <span className="text-kolo-muted">{t("nivo_red", { nivo: r.nivo, rsd: r.rsd })}</span>
              <span className="font-semibold text-kolo-green-700">{r.poen} POEN</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-kolo-muted">
          {t("nivoi_napomena")}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-kolo-text mb-3">{t("ranglista_naslov")}</h2>
        {sviPokrovitelji.length === 0 ? (
          <div className="bg-kolo-surface border border-kolo-border rounded-2xl p-6 text-center text-sm text-kolo-muted">
            {t("ranglista_prazno")}
          </div>
        ) : (
          <div className="space-y-2">
            {sviPokrovitelji.map((p, i) => (
              <div
                key={p.id}
                className="bg-kolo-surface border border-kolo-border rounded-2xl px-5 py-3 flex items-center gap-4"
              >
                <div className="text-sm font-semibold text-kolo-muted w-6 text-right shrink-0">
                  {i + 1}.
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-kolo-text">{p.naziv}</div>
                  {p.adresa && (
                    <div className="text-xs text-kolo-muted mt-0.5">
                      {p.adresa}
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-semibold text-kolo-green-700">
                    {t("nivo_oznaka", { n: p.trenutniNivo })}
                  </div>
                  <div className="text-xs text-kolo-muted mt-0.5">
                    {Number(p.rsdKumulativ).toLocaleString("sr-RS")} RSD
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {mojiPokrovitelji.length > 0 && (
        <div>
          <h2 className="font-semibold text-kolo-text mb-3">{t("moji_naslov")}</h2>
          <div className="space-y-3">
            {mojiPokrovitelji.map((p) => (
              <div
                key={p.id}
                className="bg-kolo-surface border border-kolo-border rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="font-medium text-kolo-text">{p.naziv}</div>
                  <div className="text-xs text-kolo-muted mt-0.5">
                    {t("pib_oznaka")} {p.pib}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    p.status === "ACTIVE"
                      ? "bg-kolo-green-100 text-kolo-green-700"
                      : "bg-kolo-danger-light text-kolo-danger"
                  }`}>
                    {p.status === "ACTIVE" ? t("status_aktivan") : t("status_suspendovan")}
                  </div>
                  <div className="text-sm text-kolo-muted mt-1">{t("nivo_oznaka", { n: p.trenutniNivo })}</div>
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
