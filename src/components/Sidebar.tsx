"use client";

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
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <span className="text-xl font-bold tracking-tight text-gray-900">KOLO</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
