"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Početna" },
  { href: "/novcanik", label: "Novčanik" },
  { href: "/pijaca", label: "Pijaca" },
  { href: "/zajednica", label: "Zajednica" },
  { href: "/programi", label: "Programi" },
  { href: "/zrno", label: "ZRNO" },
  { href: "/glasanje", label: "Glasanje" },
  { href: "/profil", label: "Profil" },
  { href: "/admin", label: "Admin" },
  { href: "/admin/simulator", label: "Simulator" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-kolo-bg border-r border-kolo-border flex flex-col">
      {/* Logo — samo ikona, bez KOLO teksta (tekst je već u logo fajlu) */}
      <div className="flex items-center justify-center px-5 py-4 border-b border-kolo-border">
        <Image
          src="/kolo-logo.png"
          alt="KOLO"
          width={80}
          height={80}
          className="object-contain"
          priority
          unoptimized
        />
      </div>
      <nav className="flex-1 px-2.5 py-4 space-y-0.5">
        {links.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-kolo-green-100 text-kolo-green-900 border-l-[3px] border-kolo-green-700 pl-[9px]"
                  : "text-kolo-muted hover:bg-kolo-green-100/50 hover:text-kolo-green-900"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
