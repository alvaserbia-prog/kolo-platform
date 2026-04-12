"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface DnevniBrojevi {
  novcanik: number;
  pijaca: number;
  zajednica: number;
  zaposljavnje: number;
  programi: number;
  zrno: number;
}

interface SidebarProps {
  verified: boolean;
  isAdmin: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  dnevniBrojevi?: DnevniBrojevi | null;
}

function SidebarContent({
  verified,
  isAdmin,
  onLinkClick,
  dnevniBrojevi,
}: {
  verified: boolean;
  isAdmin: boolean;
  onLinkClick?: () => void;
  dnevniBrojevi?: DnevniBrojevi | null;
}) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const badge: Record<string, number> = dnevniBrojevi ? {
    "/novcanik": dnevniBrojevi.novcanik,
    "/pijaca": dnevniBrojevi.pijaca,
    "/zajednica": dnevniBrojevi.zajednica,
    "/zaposljavnje": dnevniBrojevi.zaposljavnje,
    "/programi": dnevniBrojevi.programi,
    "/zrno": dnevniBrojevi.zrno,
  } : {};

  const linkoviVerifikovan = [
    { href: "/sistem", label: t("pocetna") },
    { href: "/novcanik", label: t("novcanik") },
    { href: "/pijaca", label: t("pijaca") },
    { href: "/zajednica", label: t("zajednica") },
    { href: "/zaposljavnje", label: t("zaposljavnje") },
    { href: "/programi", label: t("programi") },
    { href: "/zrno", label: t("zrno") },
    { href: "/postani-pokrovitelj", label: t("pokroviteljstvo") },
  ];

  const linkoviNeverifikovan = [
    { href: "/sistem", label: t("pocetna") },
    { href: "/novcanik", label: t("novcanik") },
    { href: "/pijaca", label: t("pijaca") },
    { href: "/verifikacija", label: t("verifikacija") },
  ];

  const linkoviAdmin = [
    { href: "/admin", label: t("admin") },
    { href: "/admin/simulator", label: t("simulator") },
  ];

  const links = [
    ...(verified ? linkoviVerifikovan : linkoviNeverifikovan),
    ...(isAdmin ? linkoviAdmin : []),
  ];

  return (
    <>
      <div className="flex flex-col items-center px-4 pt-2 pb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kolo-hero-logo.png" alt="KOLO" style={{ width: 130, height: 130, objectFit: "contain", borderRadius: "1.25rem" }} />
        <span className="font-bold text-white text-5xl tracking-widest mt-2">KOLO</span>
      </div>
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {links.map(({ href, label }) => {
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
                <span className="text-xs font-semibold text-kolo-green-400">({count})</span>
              )}
            </Link>
          );
        })}
      </nav>
      {!verified && (
        <div className="px-3 pb-3 pt-2 border-t border-white/10">
          <Link
            href="/verifikacija"
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

export default function Sidebar({ verified, isAdmin, mobileOpen, onMobileClose, dnevniBrojevi }: SidebarProps) {
  // Zatvori drawer pri promeni rute
  const pathname = usePathname();
  useEffect(() => {
    onMobileClose?.();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 shrink-0 bg-kolo-green-900 flex-col">
        <SidebarContent verified={verified} isAdmin={isAdmin} dnevniBrojevi={dnevniBrojevi} />
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
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kolo-icon.png" alt="KOLO" style={{ width: 38, height: 38, objectFit: "contain" }} />
          <span className="font-bold text-white text-xl tracking-widest">KOLO</span>
        </div>
        <SidebarContent verified={verified} isAdmin={isAdmin} onLinkClick={onMobileClose} dnevniBrojevi={dnevniBrojevi} />
      </aside>
    </>
  );
}
