import { pageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("zajednickoDobroPage");
  return pageMetadata({
    title: t("meta_title"),
    description: t("meta_desc"),
    path: "/zajednicko-dobro",
  });
}

export default async function ZajednickoDobroPage() {
  const t = await getTranslations("zajednickoDobroPage");

  return (
    <div className="max-w-[932px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-kolo-green-900 mb-3">{t("naslov")}</h1>
        <p className="text-kolo-muted leading-relaxed text-body">
          {t("opis")}
        </p>
      </div>

      <div className="space-y-4">
        <section className="bg-kolo-surface border border-kolo-border rounded-2xl p-6">
          <h2 className="font-semibold text-kolo-text mb-2">{t("softver_naslov")}</h2>
          <p className="text-sm text-kolo-muted leading-relaxed">
            {t("softver_tekst")}
          </p>
          <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-kolo-green-700 hover:underline mt-2 inline-block">
            {t("softver_cta")} →
          </a>
        </section>

        <section className="bg-kolo-surface border border-kolo-border rounded-2xl p-6">
          <h2 className="font-semibold text-kolo-text mb-2">{t("sadrzaj_naslov")}</h2>
          <p className="text-sm text-kolo-muted leading-relaxed">
            {t("sadrzaj_tekst")}
          </p>
          <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.sr" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-kolo-green-700 hover:underline mt-2 inline-block">
            {t("sadrzaj_cta")} →
          </a>
        </section>

        <section className="bg-kolo-surface border border-kolo-border rounded-2xl p-6">
          <h2 className="font-semibold text-kolo-text mb-2">{t("doprinosi_naslov")}</h2>
          <p className="text-sm text-kolo-muted leading-relaxed">
            {t("doprinosi_tekst")}
          </p>
          <a href="https://github.com/alvaserbia-prog/kolo-platform/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-kolo-green-700 hover:underline mt-2 inline-block">
            {t("doprinosi_cta")} →
          </a>
        </section>

        <section className="bg-kolo-surface border border-kolo-border rounded-2xl p-6">
          <h2 className="font-semibold text-kolo-text mb-2">{t("principi_naslov")}</h2>
          <ul className="text-sm text-kolo-muted leading-relaxed space-y-2 list-disc pl-5">
            <li><strong>{t("principi_1_naslov")}</strong> — {t("principi_1_opis")}</li>
            <li><strong>{t("principi_2_naslov")}</strong> — {t("principi_2_opis")}</li>
            <li><strong>{t("principi_3_naslov")}</strong> — {t("principi_3_opis")}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
