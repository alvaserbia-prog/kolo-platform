"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import JezikSvitcer from "@/components/JezikSvitcer";

interface DnevniBrojevi {
  novcanik: number;
  pijaca: number;
  tablaJemstva: number;
  adminCekanje: number;
}

interface SidebarProps {
  verified: boolean;
  isAdmin: boolean;
  jeNadzornik?: boolean; // POCETNI ili NOSILAC_ZRNA — vidi link "Nadzor"
  brojZaNadzor?: number; // badge na sidebar-u
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  dnevniBrojevi?: DnevniBrojevi | null;
}

function jeAktivan(pathname: string, href: string) {
  return pathname === href || (href !== "/sistem" && pathname.startsWith(href + "/"));
}

function BadgePill({ broj }: { broj: number }) {
  return (
    <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-kolo-gold-400 text-black text-xs font-semibold">
      {broj}
    </span>
  );
}

function NavLink({ href, label, broj, aktivan, uvuceno, onClick }: {
  href: string; label: string; broj: number; aktivan: boolean; uvuceno?: boolean; onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between ${uvuceno ? "pl-7 pr-3" : "px-3"} py-2 rounded-xl text-base font-medium transition-all duration-150 ${
        aktivan ? "bg-white/15 text-white" : "text-white/55 hover:bg-white/10 hover:text-white/90"
      }`}
    >
      <span>{label}</span>
      {broj > 0 && <BadgePill broj={broj} />}
    </Link>
  );
}

// Padajuća (collapsible) grupa — roditeljski red sa strelicom otvara/zatvara decu.
// Auto-otvorena ako je trenutna ruta jedno od dece; zbirni badge na roditelju dok je zatvorena.
function PadajucaGrupa({ label, links, badge, pathname, onLinkClick }: {
  label: string;
  links: { href: string; label: string }[];
  badge: Record<string, number>;
  pathname: string;
  onLinkClick?: () => void;
}) {
  const nekiAktivan = links.some((l) => jeAktivan(pathname, l.href));
  const [otvoreno, setOtvoreno] = useState(nekiAktivan);
  const zbirBadge = links.reduce((s, l) => s + (badge[l.href] ?? 0), 0);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOtvoreno((o) => !o)}
        aria-expanded={otvoreno}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-base font-medium text-white/55 hover:bg-white/10 hover:text-white/90 transition-all duration-150"
      >
        <span>{label}</span>
        <span className="flex items-center">
          {!otvoreno && zbirBadge > 0 && <BadgePill broj={zbirBadge} />}
          <svg
            className={`ml-1.5 w-4 h-4 transition-transform duration-200 ${otvoreno ? "rotate-90" : ""}`}
            viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
          >
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {otvoreno && (
        <div className="mt-0.5 space-y-0.5">
          {links.map((l) => (
            <NavLink
              key={l.href}
              href={l.href}
              label={l.label}
              broj={badge[l.href] ?? 0}
              aktivan={jeAktivan(pathname, l.href)}
              uvuceno
              onClick={onLinkClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent({
  verified,
  isAdmin,
  jeNadzornik,
  brojZaNadzor,
  onLinkClick,
  dnevniBrojevi,
}: {
  verified: boolean;
  isAdmin: boolean;
  jeNadzornik?: boolean;
  brojZaNadzor?: number;
  onLinkClick?: () => void;
  dnevniBrojevi?: DnevniBrojevi | null;
}) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const badge: Record<string, number> = dnevniBrojevi ? {
    "/novcanik": dnevniBrojevi.novcanik,
    "/pijaca": dnevniBrojevi.pijaca,
    "/tabla-jemstva": dnevniBrojevi.tablaJemstva,
    "/admin": dnevniBrojevi.adminCekanje,
  } : {};
  if (jeNadzornik && brojZaNadzor && brojZaNadzor > 0) {
    badge["/nadzor"] = brojZaNadzor;
  }

  // Stavke poverenja: Verifikacija + Tabla jemstva
  const poverenje = [
    { href: "/verifikacija", label: t("verifikacija") },
    { href: "/tabla-jemstva", label: t("tabla_jemstva") },
  ];

  // Padajuća grupa "Zajedničko dobro": ZRNO, Doprinos, Programi (+ Nadzor za nadzornike)
  const zajednickoDobro = [
    { href: "/zrno", label: t("zrno") },
    { href: "/doprinos-oglasi", label: t("doprinos") },
    { href: "/programi", label: t("programi") },
    ...(jeNadzornik ? [{ href: "/nadzor", label: t("nadzor") }] : []),
  ];

  const adminGrupa = isAdmin ? [{ links: [{ href: "/admin", label: t("admin") }] }] : [];

  // Grupe se razlikuju po statusu: neverifikovan dobija slim navigaciju
  // koja ga vodi ka verifikaciji; verifikovan vidi pun sistem grupisan po nameni.
  const grupe: { label?: string; collapsible?: boolean; links: { href: string; label: string }[] }[] = verified
    ? [
        { links: [
          { href: "/pocetna", label: t("pocetna") },
          { href: "/sistem", label: t("sistem") },
        ] },
        { links: [
          { href: "/novcanik", label: t("novcanik") },
          { href: "/pijaca", label: t("pijaca") },
        ] },
        { links: poverenje },
        { label: t("grupa_zajednicko_dobro"), collapsible: true, links: zajednickoDobro },
        { links: [
          { href: "/donacije", label: t("donacije") },
          { href: "/postani-pokrovitelj", label: t("postani_pokrovitelj") },
        ] },
        ...adminGrupa,
      ]
    : [
        { links: [
          { href: "/pocetna", label: t("pocetna") },
          { href: "/sistem", label: t("sistem") },
          { href: "/novcanik", label: t("novcanik") },
          { href: "/pijaca", label: t("pijaca") },
        ] },
        { links: poverenje },
        ...adminGrupa,
      ];

  return (
    <>
      <div className="flex flex-col items-center px-4 pt-2 pb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kolo-hero-logo.png" alt="KOLO" style={{ width: 130, height: 130, objectFit: "contain", borderRadius: "1.25rem" }} />
        <span className="font-bold text-white text-5xl tracking-widest mt-2">KOLO</span>
      </div>
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        {grupe.map((grupa, gi) => (
          <div key={grupa.label ?? `grupa-${gi}`} className={gi > 0 ? "pt-2" : ""}>
            {grupa.collapsible ? (
              <PadajucaGrupa
                label={grupa.label!}
                links={grupa.links}
                badge={badge}
                pathname={pathname}
                onLinkClick={onLinkClick}
              />
            ) : (
              <>
                {grupa.label && (
                  <p className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                    {grupa.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {grupa.links.map(({ href, label }) => (
                    <NavLink
                      key={href}
                      href={href}
                      label={label}
                      broj={badge[href] ?? 0}
                      aktivan={jeAktivan(pathname, href)}
                      onClick={onLinkClick}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </nav>
      {!verified && (
        <div className="px-3 pb-3 pt-2 border-t border-white/10">
          <Link
            href="/tabla-jemstva"
            onClick={onLinkClick}
            className="block w-full text-center px-3 py-2 bg-kolo-gold-400/20 text-kolo-gold-400 text-sm font-semibold rounded-xl hover:bg-kolo-gold-400 hover:text-white transition-colors"
          >
            {t("verifikuj_nalog")}
          </Link>
        </div>
      )}
    </>
  );
}

export default function Sidebar({ verified, isAdmin, jeNadzornik, brojZaNadzor, mobileOpen, onMobileClose, dnevniBrojevi }: SidebarProps) {
  // Zatvori drawer pri promeni rute
  const pathname = usePathname();
  useEffect(() => {
    onMobileClose?.();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 shrink-0 bg-kolo-green-900 flex-col">
        <SidebarContent verified={verified} isAdmin={isAdmin} jeNadzornik={jeNadzornik} brojZaNadzor={brojZaNadzor} dnevniBrojevi={dnevniBrojevi} />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-kolo-green-900 flex flex-col md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kolo-icon.png" alt="KOLO" style={{ width: 38, height: 38, objectFit: "contain" }} />
            <span className="font-bold text-white text-xl tracking-widest">KOLO</span>
          </div>
          <JezikSvitcer />
        </div>
        <SidebarContent verified={verified} isAdmin={isAdmin} jeNadzornik={jeNadzornik} brojZaNadzor={brojZaNadzor} onLinkClick={onMobileClose} dnevniBrojevi={dnevniBrojevi} />
      </aside>
    </>
  );
}
