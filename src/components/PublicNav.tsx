"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/kolo-icon.png";

type Props = {
  isLoggedIn: boolean;
};

export default function PublicNav({ isLoggedIn }: Props) {
  const [oKoluOpen, setOKoluOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const linkBase =
    "text-base text-kolo-muted hover:text-kolo-green-700 transition-colors";
  const dropdownItem =
    "block px-4 py-2.5 text-sm text-kolo-text hover:bg-kolo-bg hover:text-kolo-green-700 transition-colors";
  const mobilePrimary =
    "block py-2.5 text-lg font-medium text-kolo-text hover:text-kolo-green-700 transition-colors";
  const mobileSecondary =
    "block py-2 text-base text-kolo-text hover:text-kolo-green-700 transition-colors";
  const mobileFooter =
    "block py-1.5 text-kolo-muted hover:text-kolo-green-700 transition-colors";

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className={linkBase}>
          Početna
        </Link>
        <Link href="/pijaca" className={linkBase}>
          Pijaca
        </Link>
        <Link href="/kako-funkcionise" className={linkBase}>
          Kako funkcioniše
        </Link>

        <div
          ref={dropdownRef}
          className="relative"
          onMouseEnter={() => setOKoluOpen(true)}
          onMouseLeave={() => setOKoluOpen(false)}
        >
          <button
            onClick={() => setOKoluOpen((v) => !v)}
            className={`flex items-center gap-1 ${linkBase}`}
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
            <div className="absolute top-full left-0 mt-1 w-60 bg-white rounded-2xl card-shadow py-2 z-50">
              <Link href="/o-nama" onClick={() => setOKoluOpen(false)} className={dropdownItem}>
                O nama
              </Link>
              <Link href="/o-sistemu" onClick={() => setOKoluOpen(false)} className={dropdownItem}>
                O sistemu
              </Link>
              <Link
                href="/cesto-postavljena-pitanja"
                onClick={() => setOKoluOpen(false)}
                className={dropdownItem}
              >
                Često postavljana pitanja
              </Link>
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
              <Link href="/" onClick={() => setMobileOpen(false)} className={mobilePrimary}>
                Početna
              </Link>
              <Link href="/pijaca" onClick={() => setMobileOpen(false)} className={mobilePrimary}>
                Pijaca
              </Link>
              <Link
                href="/kako-funkcionise"
                onClick={() => setMobileOpen(false)}
                className={mobilePrimary}
              >
                Kako funkcioniše
              </Link>
            </div>

            <div className="space-y-1 pt-2 border-t border-kolo-border">
              <div className="text-xs uppercase font-semibold text-kolo-muted tracking-wider pt-3 pb-1">
                O KOLU
              </div>
              <Link href="/o-nama" onClick={() => setMobileOpen(false)} className={mobileSecondary}>
                O nama
              </Link>
              <Link
                href="/o-sistemu"
                onClick={() => setMobileOpen(false)}
                className={mobileSecondary}
              >
                O sistemu
              </Link>
              <Link
                href="/cesto-postavljena-pitanja"
                onClick={() => setMobileOpen(false)}
                className={mobileSecondary}
              >
                Često postavljana pitanja
              </Link>
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
              <Link
                href="/pokrovitelji"
                onClick={() => setMobileOpen(false)}
                className={mobileFooter}
              >
                Pokrovitelji
              </Link>
              <Link href="/uslovi" onClick={() => setMobileOpen(false)} className={mobileFooter}>
                Uslovi korišćenja
              </Link>
              <Link
                href="/privatnost"
                onClick={() => setMobileOpen(false)}
                className={mobileFooter}
              >
                Politika privatnosti
              </Link>
              <a
                href="mailto:kontakt@ekolo.rs"
                onClick={() => setMobileOpen(false)}
                className={mobileFooter}
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
