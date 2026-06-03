import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { dohvatiRegistarOdluka } from "@/lib/protokol/glasanje";
import IzvrsenjeKontrole from "./IzvrsenjeKontrole";

export const metadata = { title: "Registar odluka — KOLO" };

const IZVRSENJE_LABEL: Record<string, string> = {
  ZA_IZVRSENJE: "Čeka izvršenje",
  IZVRSENO: "Izvršeno",
  VETO_OBUSTAVLJENO: "Veto — izvršenje obustavljeno",
};

// Registar odluka Gornjeg Kola (Pravilnik o Gornjem Kolu 3.7.6, čl. 21).
// Nepromenljiv, javno vidljiv pregled svih zatvorenih predloga sa ishodom.
export default async function RegistarOdlukaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const jeAdmin = session.user.tipKorisnika === "POCETNI";

  const odluke = await dohvatiRegistarOdluka();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="kolo-naslov">Registar odluka</h1>
          <p className="text-sm text-kolo-muted mt-1">
            Nepromenljiv pregled svih zatvorenih predloga Gornjeg Kola sa ishodom (čl. 21).
          </p>
        </div>
        <Link href="/zrno" className="shrink-0 text-sm text-kolo-green-700 hover:underline">
          ← Glasanje
        </Link>
      </div>

      {odluke.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          Još uvek nema zatvorenih odluka.
        </div>
      ) : (
        <div className="space-y-3">
          {odluke.map((o) => {
            const usvojen = o.ishodUsvojen === true;
            const datum = new Date(o.rok).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" });
            return (
              <div key={o.id} className="bg-white rounded-2xl border border-kolo-border p-5 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-kolo-text">{o.title}</p>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded font-medium ${usvojen ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-bg text-kolo-muted"}`}>
                    {usvojen ? "Usvojeno" : "Neusvojeno"}
                  </span>
                </div>
                <p className="text-xs text-kolo-muted">Predlagač: {o.authorPseudonim} · Zatvoreno: {datum}</p>
                <p className="text-sm text-kolo-muted whitespace-pre-line">{o.description}</p>
                <div className="flex gap-4 text-xs text-kolo-muted pt-1 border-t border-kolo-border">
                  <span>ZA: <span className="font-semibold text-kolo-green-700">{o.zaZbir}</span> glasačke moći</span>
                  <span>PROTIV: <span className="font-semibold text-kolo-danger">{o.protivZbir}</span></span>
                  <span>· {o.brGlasova} glasača</span>
                </div>

                {/* Izvršenje usvojene odluke (čl. 17, 18) */}
                {o.izvrsenjeStatus && (
                  <div className="text-xs">
                    <span className={`inline-block px-2 py-0.5 rounded font-medium ${
                      o.izvrsenjeStatus === "IZVRSENO" ? "bg-kolo-green-100 text-kolo-green-700"
                      : o.izvrsenjeStatus === "VETO_OBUSTAVLJENO" ? "bg-kolo-danger-light text-kolo-danger"
                      : "bg-kolo-gold-100 text-kolo-gold-600"
                    }`}>
                      {IZVRSENJE_LABEL[o.izvrsenjeStatus]}
                    </span>
                    {o.vetoObrazlozenje && (
                      <p className="mt-1 text-kolo-muted italic">Obrazloženje veta: {o.vetoObrazlozenje}</p>
                    )}
                  </div>
                )}

                {jeAdmin && o.izvrsenjeStatus === "ZA_IZVRSENJE" && <IzvrsenjeKontrole id={o.id} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
