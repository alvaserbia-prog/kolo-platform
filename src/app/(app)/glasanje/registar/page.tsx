import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { dohvatiRegistarOdluka } from "@/lib/protokol/glasanje";
import IzvrsenjeKontrole from "./IzvrsenjeKontrole";
import PreporukaOdgovor from "./PreporukaOdgovor";
import { jeAdmin } from "@/lib/dozvole";
import { getTranslations } from "next-intl/server";

export const metadata = { title: "Registar odluka — KOLO" };

// Registar odluka Gornjeg Kola (Pravilnik o Gornjem Kolu 3.7.6, čl. 21).
// Nepromenljiv, javno vidljiv pregled svih zatvorenih predloga sa ishodom.
export default async function RegistarOdlukaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const korisnikJeAdmin = jeAdmin(session.user);
  const t = await getTranslations("glasanje");

  const odluke = await dohvatiRegistarOdluka();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="kolo-naslov">{t("registar_naslov")}</h1>
          <p className="text-sm text-kolo-muted mt-1">
            {t("registar_opis")}
          </p>
        </div>
        <Link href="/zrno" className="shrink-0 text-sm text-kolo-green-700 hover:underline">
          {t("registar_nazad")}
        </Link>
      </div>

      {odluke.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          {t("registar_prazno")}
        </div>
      ) : (
        <div className="space-y-3">
          {odluke.map((o) => {
            const usvojen = o.ishodUsvojen === true;
            const datum = new Date(o.rok).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" });
            return (
              <div key={o.id} className="bg-white rounded-2xl border border-kolo-border p-5 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-kolo-text">{o.title}</p>
                    {o.vrsta === "DINARSKA_PREPORUKA" && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-kolo-gold-50 text-kolo-gold-600 font-medium">{t("vrsta_preporuka")}</span>
                    )}
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded font-medium ${usvojen ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-bg text-kolo-muted"}`}>
                    {usvojen ? t("usvojeno") : t("neusvojeno")}
                  </span>
                </div>
                <p className="text-xs text-kolo-muted">{t("registar_predlagac", { pseudonim: o.authorPseudonim })} · {t("registar_zatvoreno", { datum })}</p>
                <p className="text-sm text-kolo-muted whitespace-pre-line">{o.description}</p>
                <div className="flex gap-4 text-xs text-kolo-muted pt-1 border-t border-kolo-border">
                  <span>{t("registar_za_zbir", { zbir: o.zaZbir })}</span>
                  <span>{t("registar_protiv_zbir", { zbir: o.protivZbir })}</span>
                  <span>· {t("registar_br_glasaca", { count: o.brGlasova })}</span>
                </div>

                {/* Izvršenje usvojene odluke (čl. 17, 18) */}
                {o.izvrsenjeStatus && (
                  <div className="text-xs">
                    <span className={`inline-block px-2 py-0.5 rounded font-medium ${
                      o.izvrsenjeStatus === "IZVRSENO" ? "bg-kolo-green-100 text-kolo-green-700"
                      : o.izvrsenjeStatus === "VETO_OBUSTAVLJENO" ? "bg-kolo-danger-light text-kolo-danger"
                      : "bg-kolo-gold-100 text-kolo-gold-600"
                    }`}>
                      {o.izvrsenjeStatus === "ZA_IZVRSENJE" ? t("izvrsenje_ceka") : o.izvrsenjeStatus === "IZVRSENO" ? t("izvrsenje_izvrseno") : t("izvrsenje_veto")}
                    </span>
                    {o.vetoObrazlozenje && (
                      <p className="mt-1 text-kolo-muted italic">{t("veto_obrazlozenje_label")} {o.vetoObrazlozenje}</p>
                    )}
                  </div>
                )}

                {korisnikJeAdmin && o.izvrsenjeStatus === "ZA_IZVRSENJE" && <IzvrsenjeKontrole id={o.id} />}

                {/* Usvojena dinarska preporuka — odgovor UO (čl. 20) */}
                {usvojen && o.vrsta === "DINARSKA_PREPORUKA" && (
                  o.uoOdgovor ? (
                    <div className="text-xs">
                      <span className={`inline-block px-2 py-0.5 rounded font-medium ${o.uoOdgovor === "PRIHVACENO" ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-bg text-kolo-muted"}`}>
                        {t("uo_odgovor_label")} {o.uoOdgovor === "PRIHVACENO" ? t("uo_prihvaceno") : t("uo_odbijeno")}
                      </span>
                      {o.uoObrazlozenje && <p className="mt-1 text-kolo-muted italic">{o.uoObrazlozenje}</p>}
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-kolo-gold-600 font-medium">{t("uo_ceka_odgovor")}</p>
                      {korisnikJeAdmin && <PreporukaOdgovor id={o.id} />}
                    </>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
