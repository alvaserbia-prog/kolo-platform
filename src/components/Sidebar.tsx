"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  verified: boolean;
  isAdmin: boolean;
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

export default function Sidebar({ verified, isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const links = [
    ...(verified ? linkoviVerifikovan : linkoviNeverifikovan),
    ...(isAdmin ? linkoviAdmin : []),
  ];

  return (
    <aside className="w-56 shrink-0 bg-kolo-bg border-r border-kolo-border flex flex-col">
      <div className="flex flex-col items-center justify-center px-4 py-4 border-b border-kolo-border gap-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kolo-icon.png" alt="KOLO" style={{ width: 120, height: "auto", mixBlendMode: "multiply" }} />
        <span className="font-bold text-kolo-green-900 text-2xl tracking-widest">KOLO</span>
      </div>
      <nav className="flex-1 px-2.5 py-4 space-y-0.5">
        {links.map(({ href, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
          return (
            <Link
              key={href}
              href={href}
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
        <div className="px-3 pb-4">
          <Link href="/verifikacija"
            className="block w-full text-center px-3 py-2 bg-kolo-gold-100 text-kolo-gold-600 text-xs font-semibold rounded-xl hover:bg-kolo-gold-400 hover:text-white transition-colors">
            Verifikuj nalog →
          </Link>
        </div>
      )}
    </aside>
  );
}
