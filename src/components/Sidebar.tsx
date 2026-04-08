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

function KoloLogo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Wheel / grain icon */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="13" stroke="#1B6B3A" strokeWidth="2" />
        <circle cx="14" cy="14" r="3.5" fill="#1B6B3A" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 14 + 4.5 * Math.cos(rad);
          const y1 = 14 + 4.5 * Math.sin(rad);
          const x2 = 14 + 9.5 * Math.cos(rad);
          const y2 = 14 + 9.5 * Math.sin(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1B6B3A" strokeWidth="1.8" strokeLinecap="round" />;
        })}
      </svg>
      <span className="text-lg font-semibold tracking-tight text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
        KOLO
      </span>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-kolo-bg border-r border-kolo-border flex flex-col">
      <div className="px-5 py-5 border-b border-kolo-border">
        <KoloLogo />
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
