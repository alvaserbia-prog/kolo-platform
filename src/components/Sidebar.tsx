"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import JezikSvitcer from "@/components/JezikSvitcer";

interface DnevniBrojevi {
  novcanik: number;
  pijaca: number;
  krug: number;
  ped: number;
  programi: number;
  zrno: number;
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
    "/zrno": dnevniBrojevi.zrno,
  } : {};
  if (jeNadzornik && brojZaNadzor && brojZaNadzor > 0) {
    badge["/nadzor"] = brojZaNadzor;
  }

  // Stavke poverenja: Verifikacija + Tabla jemstva (+ Nadzor za nadzornike)
  const poverenje = [
    { href: "/verifikacija", label: t("verifikacija") },
    { href: "/tabla-jemstva", label: t("tabla_jemstva") },
    ...(jeNadzornik ? [{ href: "/nadzor", label: t("nadzor") }] : []),
  ];

  const adminGrupa = isAdmin ? [{ links: [{ href: "/admin", label: t("admin") }] }] : [];

  // Grupe se razlikuju po statusu: neverifikovan dobija slim navigaciju
  // koja ga vodi ka verifikaciji; verifikovan vidi pun sistem grupisan po nameni.
  const grupe: { label?: string; links: { href: string; label: string }[] }[] = verified
    ? [
        { links: [
          { href: "/pocetna", label: t("pocetna") },
          { href: "/sistem", label: t("sistem") },
        ] },
        { links: [
          { href: "/novcanik", label: t("novcanik") },
          { href: "/pijaca", label: t("pijaca") },
          { href: "/programi", label: t("programi") },
          { href: "/doprinos-oglasi", label: t("doprinos") },
        ] },
        { links: [
          { href: "/zrno", label: t("zrno") },
        ] },
        { links: poverenje },
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
            {grupa.label && (
              <p className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                {grupa.label}
              </p>
            )}
            <div className="space-y-0.5">
              {grupa.links.map(({ href, label }) => {
                const active = pathname === href || (href !== "/sistem" && pathname.startsWith(href + "/"));
                const count = badge[href] ?? 0;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onLinkClick}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-base font-medium transition-all duration-150 ${
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/55 hover:bg-white/10 hover:text-white/90"
                    }`}
                  >
                    <span>{label}</span>
                    {count > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-kolo-gold-400 text-black text-xs font-semibold">
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
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
