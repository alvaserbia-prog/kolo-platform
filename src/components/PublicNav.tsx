"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logoImg from "@/assets/kolo-icon.png";

type Props = {
  isLoggedIn: boolean;
};

const O_KOLU_PUTANJE = ["/o-nama", "/o-sistemu", "/cesto-postavljena-pitanja"];

export default function PublicNav({ isLoggedIn }: Props) {
  const [oKoluOpen, setOKoluOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (!oKoluOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOKoluOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [oKoluOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(path + "/");
  const isOKoluActive = O_KOLU_PUTANJE.some((p) => isActive(p));

  const topLink = (path: string, label: string) => (
    <Link
      href={path}
      className={`text-base transition-colors ${
        isActive(path)
          ? "text-kolo-green-700 font-semibold"
          : "text-kolo-muted hover:text-kolo-green-700"
      }`}
    >
      {label}
    </Link>
  );

  const dropdownItem = (path: string, label: string) => {
    const active = isActive(path);
    return (
      <Link
        href={path}
        onClick={() => setOKoluOpen(false)}
        className={`block px-4 py-2.5 text-sm transition-colors ${
          active
            ? "bg-kolo-green-100 text-kolo-green-700 font-semibold"
            : "text-kolo-text hover:bg-kolo-bg hover:text-kolo-green-700"
        }`}
      >
        {label}
      </Link>
    );
  };

  const mobilePrimaryLink = (path: string, label: string) => {
    const active = isActive(path);
    return (
      <Link
        href={path}
        onClick={() => setMobileOpen(false)}
        className={`block py-2.5 text-lg transition-colors ${
          active
            ? "text-kolo-green-700 font-bold"
            : "text-kolo-text font-medium hover:text-kolo-green-700"
        }`}
      >
        {label}
      </Link>
    );
  };

  const mobileSecondaryLink = (path: string, label: string) => {
    const active = isActive(path);
    return (
      <Link
        href={path}
        onClick={() => setMobileOpen(false)}
        className={`block py-2 text-base transition-colors ${
          active
            ? "text-kolo-green-700 font-semibold"
            : "text-kolo-text hover:text-kolo-green-700"
        }`}
      >
        {label}
      </Link>
    );
  };

  const mobileFooterLink = (path: string, label: string) => {
    const active = isActive(path);
    return (
      <Link
        href={path}
        onClick={() => setMobileOpen(false)}
        className={`block py-1.5 transition-colors ${
          active
            ? "text-kolo-green-700 font-semibold"
            : "text-kolo-muted hover:text-kolo-green-700"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6">
        {topLink("/", "Početna")}
        {topLink("/pijaca", "Pijaca")}
        {topLink("/kako-funkcionise", "Kako funkcioniše")}

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOKoluOpen((v) => !v)}
            className={`flex items-center gap-1 text-base transition-colors ${
              isOKoluActive
                ? "text-kolo-green-700 font-semibold"
                : "text-kolo-muted hover:text-kolo-green-700"
            }`}
            aria-haspopup="true"
            aria-expanded={oKoluOpen}
          >
            O KOLU
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={`transition-transform duration-200 ${oKoluOpen ? "rotate-180" : ""}`}
            >
              <path
                d="M2 4L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {oKoluOpen && (
            <div className="absolute top-full left-0 mt-1 w-60 bg-white rounded-2xl card-shadow overflow-hidden py-1 z-50">
              {dropdownItem("/o-nama", "O nama")}
              {dropdownItem("/o-sistemu", "O sistemu")}
              {dropdownItem("/cesto-postavljena-pitanja", "Često postavljana pitanja")}
            </div>
          )}
        </div>
      </nav>

      {/* Mobilni hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-kolo-text hover:bg-kolo-bg transition-colors"
        aria-label="Otvori meni"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M3 6h16M3 11h16M3 16h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Mobilni overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-white md:hidden flex flex-col">
          <div className="flex items-center justify-between h-16 px-6 border-b border-kolo-border shrink-0">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5"
            >
              <Image
                src={logoImg}
                alt="KOLO"
                width={48}
                height={28}
                style={{ height: "auto" }}
              />
              <span className="font-bold text-kolo-green-900 text-xl tracking-tight">
                KOLO
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-kolo-text hover:bg-kolo-bg transition-colors"
              aria-label="Zatvori meni"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M5 5l12 12M17 5L5 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <div className="space-y-1">
              {mobilePrimaryLink("/", "Početna")}
              {mobilePrimaryLink("/pijaca", "Pijaca")}
              {mobilePrimaryLink("/kako-funkcionise", "Kako funkcioniše")}
            </div>

            <div className="space-y-1 pt-2 border-t border-kolo-border">
              <div className="text-xs uppercase font-semibold text-kolo-muted tracking-wider pt-3 pb-1">
                O KOLU
              </div>
              {mobileSecondaryLink("/o-nama", "O nama")}
              {mobileSecondaryLink("/o-sistemu", "O sistemu")}
              {mobileSecondaryLink("/cesto-postavljena-pitanja", "Često postavljana pitanja")}
            </div>

            <div className="pt-4 border-t border-kolo-border space-y-3">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-kolo-green-700 text-white text-base font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
                >
                  Moj nalog →
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-3 border border-kolo-green-700 text-kolo-green-700 text-base font-semibold rounded-xl hover:bg-kolo-bg transition-colors"
                  >
                    Prijavi se
                  </Link>
                  <Link
                    href="/registracija"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-kolo-gold-600 text-white text-base font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors"
                  >
                    Pridruži se
                  </Link>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-kolo-border space-y-2 text-sm">
              {mobileFooterLink("/pokrovitelji", "Pokrovitelji")}
              {mobileFooterLink("/uslovi", "Uslovi korišćenja")}
              {mobileFooterLink("/privatnost", "Politika privatnosti")}
              <a
                href="mailto:kontakt@ekolo.rs"
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-kolo-muted hover:text-kolo-green-700 transition-colors"
              >
                Kontakt
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
