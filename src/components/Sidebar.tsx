"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface SidebarProps {
  verified: boolean;
  isAdmin: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const linkoviVerifikovan = [
  { href: "/dashboard", label: "Početna" },
  { href: "/novcanik", label: "Novčanik" },
  { href: "/poruke", label: "Poruke" },
  { href: "/pijaca", label: "Pijaca" },
  { href: "/zajednica", label: "Zajednica" },
  { href: "/zaposljavnje", label: "Zapošljavanje" },
  { href: "/programi", label: "Programi" },
  { href: "/zrno", label: "ZRNO" },
  { href: "/sistem", label: "Sistem" },
  { href: "/glasanje", label: "Glasanje" },
  { href: "/preporuke", label: "Preporuke" },
  { href: "/donacije", label: "Donacije" },
  { href: "/postani-pokrovitelj", label: "Pokroviteljstvo" },
  { href: "/profil", label: "Profil" },
];

const linkoviNeverifikovan = [
  { href: "/dashboard", label: "Početna" },
  { href: "/novcanik", label: "Novčanik" },
  { href: "/poruke", label: "Poruke" },
  { href: "/pijaca", label: "Pijaca" },
  { href: "/sistem", label: "Sistem" },
  { href: "/verifikacija", label: "Verifikacija" },
  { href: "/profil", label: "Profil" },
];

const linkoviAdmin = [
  { href: "/admin", label: "Admin" },
  { href: "/admin/simulator", label: "Simulator" },
];

function SidebarContent({
  verified,
  isAdmin,
  onLinkClick,
}: {
  verified: boolean;
  isAdmin: boolean;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const links = [
    ...(verified ? linkoviVerifikovan : linkoviNeverifikovan),
    ...(isAdmin ? linkoviAdmin : []),
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-center px-4 py-3 border-b border-kolo-border gap-0.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kolo-icon.png" alt="KOLO" style={{ width: 96, height: "auto", mixBlendMode: "multiply" }} />
        <span className="font-bold text-kolo-green-900 text-xl tracking-widest">KOLO</span>
      </div>
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {links.map(({ href, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-kolo-green-100 text-kolo-green-900 ring-1 ring-kolo-green-700"
                  : "text-kolo-muted hover:bg-kolo-green-100/50 hover:text-kolo-green-900"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      {!verified && (
        <div className="px-3 pb-3 pt-2 border-t border-kolo-border">
          <Link
            href="/verifikacija"
            onClick={onLinkClick}
            className="block w-full text-center px-3 py-2 bg-kolo-gold-100 text-kolo-gold-600 text-xs font-semibold rounded-xl hover:bg-kolo-gold-400 hover:text-white transition-colors"
          >
            Verifikuj nalog →
          </Link>
        </div>
      )}
    </>
  );
}

export default function Sidebar({ verified, isAdmin, mobileOpen, onMobileClose }: SidebarProps) {
  // Zatvori drawer pri promeni rute
  const pathname = usePathname();
  useEffect(() => {
    onMobileClose?.();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-44 shrink-0 bg-kolo-bg border-r border-kolo-border flex-col">
        <SidebarContent verified={verified} isAdmin={isAdmin} />
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-kolo-bg border-r border-kolo-border flex flex-col md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent verified={verified} isAdmin={isAdmin} onLinkClick={onMobileClose} />
      </aside>
    </>
  );
}
