import { Link } from "@/i18n/navigation";
import Image from "next/image";
import logoImg from "@/assets/kolo-icon.png";
import { getTranslations } from "next-intl/server";
import { POKROVITELJSTVO_AKTIVNO } from "@/lib/moduli";

export default async function PublicFooter() {
  const t = await getTranslations("javneKomponente");

  return (
    <footer className="border-t border-kolo-border bg-white mt-8">
      <div className="max-w-[932px] mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brend */}
          <div>
            <div className="flex items-center gap-2 h-7 mb-5">
              <Image src={logoImg} alt="KOLO" width={28} height={19} style={{ height: "auto" }} />
              <span className="font-bold text-kolo-green-900 text-lg">KOLO</span>
            </div>
            <p className="text-sm text-kolo-muted leading-relaxed mb-2">
              {t("footer_brand_opis").split("\n").map((line, i) => (
                <span key={i}>{line}{i === 0 ? <br /> : null}</span>
              ))}
            </p>
          </div>

          {/* Sistem */}
          <div>
            <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase h-7 flex items-center mb-5">{t("footer_sistem")}</p>
            <ul className="space-y-2 text-sm text-kolo-muted">
              <li><Link href="/kako-funkcionise" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_kako")}</Link></li>
              <li><Link href="/kako-sistem-radi" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_kako_sistem")}</Link></li>
              <li><Link href="/o-sistemu" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_o_sistemu")}</Link></li>
              <li><Link href="/pijaca" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_pijaca")}</Link></li>
              <li><Link href="/whitepaper" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_whitepaper")}</Link></li>
            </ul>
          </div>

          {/* Zajednica */}
          <div>
            <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase h-7 flex items-center mb-5">{t("footer_zajednica")}</p>
            <ul className="space-y-2 text-sm text-kolo-muted">
              <li><Link href="/o-nama" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_o_nama")}</Link></li>
              <li><Link href="/cesto-postavljena-pitanja" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_faq")}</Link></li>
              {POKROVITELJSTVO_AKTIVNO && <li><Link href="/pokrovitelji" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_pokrovitelji")}</Link></li>}
              <li><a href="mailto:kontakt@ekolo.rs" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_kontakt")}</a></li>
            </ul>
          </div>

          {/* Pravni okvir */}
          <div>
            <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase h-7 flex items-center mb-5">{t("footer_pravni")}</p>
            <ul className="space-y-2 text-sm text-kolo-muted">
              <li><Link href="/pravna-pozicija" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_pravna")}</Link></li>
              <li><Link href="/pravilnik" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_pravilnik")}</Link></li>
              <li><Link href="/statut" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_statut")}</Link></li>
              <li><Link href="/uslovi" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_uslovi")}</Link></li>
              <li><Link href="/privatnost" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_privatnost")}</Link></li>
              <li><Link href="/rizici" className="hover:text-kolo-green-700 transition-colors">{t("footer_link_rizici")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Donja traka — pravni identitet, copyright i licence (na svakoj
            strani). Registracioni podaci stoje ovde, a ne u koloni brenda:
            javni su podaci iz Registra zadužbina i fondacija APR i pripadaju
            uz copyright, a kolonu brenda su izdužili preko ostalih triju.
            Broj rešenja se NE objavljuje. */}
        <div className="border-t border-kolo-border pt-5 text-xs text-kolo-muted leading-relaxed text-center space-y-1.5">
          <p>
            {t("footer_fondacija_adresa")}
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline">{t("footer_fondacija_brojevi")}</span>
          </p>
          <p>{t("footer_fondacija_registar")}</p>
          <p>
            {t("footer_copyright")}
            {" · "}
            <a href="mailto:kontakt@ekolo.rs" className="hover:text-kolo-green-700 transition-colors">kontakt@ekolo.rs</a>
          </p>
          <p>
            {t("footer_softver_label")}: <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" className="hover:underline">AGPL-3.0</a>
            {" · "}
            {t("footer_sadrzaj_label")}: <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.sr" target="_blank" rel="noopener noreferrer" className="hover:underline">CC BY-SA 4.0</a>
            {" · "}
            <Link href="/zajednicko-dobro" className="text-kolo-green-700 hover:underline">{t("footer_zajednicko_dobro_link")}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
