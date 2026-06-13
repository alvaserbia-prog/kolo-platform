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

// Ikonice navigacije — inline SVG (isti stil kao u Header-u: 24x24, stroke currentColor).
// Mapiranje ruta → ikonica drži izgled doslednim i bez dodatne zavisnosti.
function NavIkona({ href, mali }: { href: string; mali?: boolean }) {
  const s = mali ? 16 : 18;
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (href) {
    case "/pocetna":
      return <svg {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>;
    case "/sistem":
      return <svg {...p}><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></svg>;
    case "/novcanik":
      return <svg {...p}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>;
    case "/pijaca":
      return <svg {...p}><path d="m2 7 2-4h16l2 4" /><path d="M4 7v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7" /><path d="M2 7h20" /><path d="M9 21v-6h6v6" /></svg>;
    case "/verifikacija":
      return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case "/tabla-jemstva":
      return <svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "/zrno":
      return <svg {...p}><path d="M7 20h10" /><path d="M12 20V11" /><path d="M12 11C9 11 7 9 7 6c3 0 5 2 5 5Z" /><path d="M12 11c0-3 2-5 5-5 0 3-2 5-5 5Z" /></svg>;
    case "/doprinos-oglasi":
      return <svg {...p}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8" /><path d="M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8" /></svg>;
    case "/programi":
      return <svg {...p}><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 12h6" /><path d="M9 16h6" /></svg>;
    case "/nadzor":
      return <svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "/donacije":
      return <svg {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" /></svg>;
    case "/postani-pokrovitelj":
      return <svg {...p}><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></svg>;
    case "/admin":
      return <svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    default:
      return <svg {...p}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

function NavLink({ href, label, broj, aktivan, uvuceno, onClick }: {
  href: string; label: string; broj: number; aktivan: boolean; uvuceno?: boolean; onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-2.5 ${uvuceno ? "pl-4 pr-3" : "px-3"} py-2 rounded-xl text-base font-medium transition-all duration-150 ${
        aktivan ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/10 hover:text-white/90"
      }`}
    >
      {aktivan && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-kolo-gold-400" aria-hidden="true" />
      )}
      <span className={`shrink-0 transition-opacity ${aktivan ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
        <NavIkona href={href} mali={uvuceno} />
      </span>
      <span className="flex-1 truncate">{label}</span>
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
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-base font-medium transition-all duration-150 ${
          nekiAktivan ? "text-white/90" : "text-white/55 hover:bg-white/10 hover:text-white/90"
        }`}
      >
        <span className="flex items-center gap-2.5">
          <span className={`shrink-0 transition-opacity ${nekiAktivan ? "opacity-100" : "opacity-70"}`}>
            {/* Zajedničko dobro — ikonica paketa/resursa */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </span>
          <span>{label}</span>
        </span>
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
      {/* Glatka animacija visine preko grid-rows 0fr→1fr (bez JS merenja) */}
      <div className={`grid transition-all duration-200 ease-out ${otvoreno ? "grid-rows-[1fr] opacity-100 mt-0.5" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="space-y-0.5">
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
        </div>
      </div>
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

  // Padajuća grupa "Zajedničko dobro": Sistem, ZRNO, Doprinos, Programi (+ Nadzor za nadzornike)
  const zajednickoDobro = [
    { href: "/sistem", label: t("sistem") },
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
        ] },
        { links: [
          { href: "/novcanik", label: t("novcanik") },
          { href: "/pijaca", label: t("pijaca") },
        ] },
        { links: poverenje },
        { links: [
          { href: "/donacije", label: t("donacije") },
          { href: "/postani-pokrovitelj", label: t("postani_pokrovitelj") },
        ] },
        { label: t("grupa_zajednicko_dobro"), collapsible: true, links: zajednickoDobro },
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
      <div className="flex flex-col items-center px-4 pt-3 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kolo-hero-logo.png" alt="KOLO" style={{ width: 92, height: 92, objectFit: "contain", borderRadius: "1.1rem" }} />
        <span className="font-bold text-white text-3xl tracking-[0.2em] mt-1.5">KOLO</span>
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
      <aside className="hidden md:flex w-52 shrink-0 bg-kolo-green-900 flex-col relative before:absolute before:top-0 before:bottom-0 before:right-full before:w-screen before:bg-kolo-green-900 before:content-['']">
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
