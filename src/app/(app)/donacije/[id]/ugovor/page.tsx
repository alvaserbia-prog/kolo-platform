import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UgovorAkcije from "./UgovorAkcije";

/**
 * Ugovor o donaciji (Pravilnik o pokroviteljstvu i donacijama, čl. 5b).
 *
 * Prikazuje se SNIMLJEN tekst sa zapisa donacije — nikad se ne generiše ponovo
 * pri čitanju. Vidi ga isključivo sam donator (čl. 67 Pravilnika o KOLO
 * sistemu): dokument nosi ime, iznos i broj POEN-a.
 */
export default async function UgovorODonacijiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const t = await getTranslations("donacije");

  const donacija = await prisma.donationRecord.findUnique({
    where: { id },
    select: { userId: true, ugovorTekst: true },
  });

  // Tuđa donacija i donacija bez ugovora izgledaju isto — 404. Poruka „nemaš
  // pristup" bi potvrdila da zapis postoji.
  if (!donacija || donacija.userId !== session.user.id || !donacija.ugovorTekst) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <Link href="/donacije" className="text-sm text-kolo-muted hover:text-kolo-text">
          ← {t("ugovor_nazad")}
        </Link>
        <UgovorAkcije labela={t("ugovor_stampaj")} />
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 print:border-0 print:shadow-none print:rounded-none">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-kolo-text">
          {donacija.ugovorTekst}
        </pre>
      </div>

      <p className="text-xs text-kolo-muted print:hidden">{t("ugovor_napomena")}</p>
    </div>
  );
}
