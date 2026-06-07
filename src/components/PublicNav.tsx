"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import logoImg from "@/assets/kolo-icon.png";
import JezikSvitcer from "@/components/JezikSvitcer";
import { useTranslations } from "next-intl";

type Props = {
  isLoggedIn: boolean;
  maintenance?: boolean;
};

export default function PublicNav({ isLoggedIn, maintenance = false }: Props) {
  const t = useTranslations("javneKomponente");
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() || "/";

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
        {topLink("/", t("nav_fooldal"))}
        {topLink("/pijaca", t("nav_pijaca"))}
        {topLink("/kako-funkcionise", t("nav_kako_funkcionise"))}
        {topLink("/o-sistemu", t("nav_o_sistemu"))}
        {topLink("/o-nama", t("nav_o_nama"))}
        {topLink("/cesto-postavljena-pitanja", t("nav_pitanja"))}
      </nav>

      {/* Mobilni hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-kolo-text hover:bg-kolo-bg transition-colors"
        aria-label={t("header_aria_otvori")}
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
            <div className="flex items-center gap-3">
              <JezikSvitcer />
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-kolo-text hover:bg-kolo-bg transition-colors"
                aria-label={t("header_aria_zatvori")}
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
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <div className="space-y-1">
              {mobilePrimaryLink("/", t("nav_fooldal"))}
              {mobilePrimaryLink("/pijaca", t("nav_pijaca"))}
              {mobilePrimaryLink("/kako-funkcionise", t("nav_kako_funkcionise"))}
              {mobilePrimaryLink("/o-sistemu", t("nav_o_sistemu"))}
              {mobilePrimaryLink("/o-nama", t("nav_o_nama"))}
              {mobilePrimaryLink("/cesto-postavljena-pitanja", t("nav_pitanja"))}
            </div>

            <div className="pt-4 border-t border-kolo-border space-y-3">
              {maintenance ? (
                <span className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-kolo-border rounded-xl text-base font-medium text-kolo-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-kolo-gold-600" />
                  {t("header_uskoro_pocinemo")}
                </span>
              ) : isLoggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-kolo-green-700 text-white text-base font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
                >
                  {t("header_moj_nalog")}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-3 border border-kolo-green-700 text-kolo-green-700 text-base font-semibold rounded-xl hover:bg-kolo-bg transition-colors"
                  >
                    {t("header_prijavi_se")}
                  </Link>
                  <Link
                    href="/registracija"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-kolo-gold-600 text-white text-base font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors"
                  >
                    {t("header_priduzi_se")}
                  </Link>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-kolo-border space-y-2 text-sm">
              {mobileFooterLink("/pokrovitelji", t("nav_pokrovitelji"))}
              {mobileFooterLink("/uslovi", t("nav_uslovi"))}
              {mobileFooterLink("/privatnost", t("nav_politika"))}
              <a
                href="mailto:kontakt@ekolo.rs"
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-kolo-muted hover:text-kolo-green-700 transition-colors"
              >
                {t("nav_kontakt")}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
