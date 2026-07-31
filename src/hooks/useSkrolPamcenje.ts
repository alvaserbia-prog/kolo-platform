"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Pamćenje pozicije skrola za unutrašnji scroll kontejner (AppShell).
// Browser i Next.js vraćaju poziciju pri back/forward navigaciji samo za
// window skrol; naš sadržaj skroluje u <div overflow-y-auto>, pa se pozicija
// inače gubi. Čuvamo scrollTop po URL-u u sessionStorage i vraćamo ga
// ISKLJUČIVO pri popstate (back/forward) navigaciji — obična navigacija
// zadržava postojeće ponašanje (Next skroluje sadržaj na vrh).
export function useSkrolPamcenje<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const jePopRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sacuvaj = () => {
      try {
        sessionStorage.setItem(
          `skrol:${location.pathname}${location.search}`,
          String(el.scrollTop),
        );
      } catch {
        // sessionStorage nedostupan (privatni mod i sl.) — bez pamćenja.
      }
    };
    const naPop = () => {
      jePopRef.current = true;
    };

    el.addEventListener("scroll", sacuvaj, { passive: true });
    window.addEventListener("popstate", naPop);
    return () => {
      el.removeEventListener("scroll", sacuvaj);
      window.removeEventListener("popstate", naPop);
    };
  }, []);

  useEffect(() => {
    if (!jePopRef.current) return;
    jePopRef.current = false;

    const el = ref.current;
    if (!el) return;

    let sacuvano = 0;
    try {
      sacuvano = Number(
        sessionStorage.getItem(`skrol:${location.pathname}${location.search}`) ?? 0,
      );
    } catch {
      return;
    }
    if (!sacuvano) return;

    // Next posle commit-a nove stranice sam skroluje sadržaj na vrh, a sadržaj
    // može da se doraduje kroz još koji frejm — zato poziciju namećemo kroz
    // nekoliko uzastopnih frejmova umesto jednom.
    let preostalo = 8;
    let raf = 0;
    const vrati = () => {
      el.scrollTop = sacuvano;
      if (--preostalo > 0) raf = requestAnimationFrame(vrati);
    };
    raf = requestAnimationFrame(vrati);
    return () => cancelAnimationFrame(raf);
  }, [pathname, searchParams]);

  return ref;
}
