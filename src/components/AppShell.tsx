"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useMe, useMeEventBridge, useMePatch, ME_KEY } from "@/hooks/useMe";

interface AppShellProps {
  verified: boolean;
  isAdmin: boolean;
  jeNadzornik?: boolean;
  children: React.ReactNode;
}

export default function AppShell({ verified, isAdmin, jeNadzornik, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const qc = useQueryClient();

  // Jedan keširan izvor za ceo chrome (balans, badge-evi, notifikacije, nadzor,
  // politika) — deli se sa Header-om kroz React Query keš. Ranije: 6 fetch-eva.
  useMeEventBridge();
  const { data: me } = useMe();
  const patchMe = useMePatch();

  const dnevniBrojevi = me?.dnevniBrojevi ?? null;
  const brojZaNadzor = me?.nadzorBroj ?? 0;

  // Provera pristanka na Politiku privatnosti (popup za Pravilnik je uklonjen).
  useEffect(() => {
    if (pathname === "/politika-prihvati") return;
    if (me?.politikaPotrebno) router.replace("/politika-prihvati");
  }, [me?.politikaPotrebno, pathname, router]);

  // Kad korisnik otvori Novčanik/Pijaca → označi "viđeno" (badge ide na 0).
  // Optimistički nuliramo lokalno (setQueryData), pa serveru javimo da pomeri
  // "viđeno" vreme i invalidiramo keš da se uskladi.
  useEffect(() => {
    const sekcija =
      pathname.startsWith("/novcanik") ? "novcanik" :
      pathname.startsWith("/pijaca") ? "pijaca" :
      null;
    if (!sekcija) return;

    patchMe(
      dnevniBrojevi
        ? { dnevniBrojevi: { ...dnevniBrojevi, [sekcija]: 0 } }
        : {},
    );
    fetch("/api/dnevni-brojevi/vidjeno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sekcija }),
    })
      .then(() => qc.invalidateQueries({ queryKey: ME_KEY }))
      .catch(() => {});
  // Pokreće se na promenu rute; dnevniBrojevi namerno van deps (čita se sveža
  // vrednost samo radi optimističkog nulovanja).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="h-full bg-kolo-bg text-kolo-text flex flex-col overflow-x-hidden">
      <Header onMenuOpen={() => setMobileOpen(true)} />
      {/* Skrol je na punoj širini viewporta → skrolbar je uz desnu ivicu ekrana
          (ranije je bio na centriranom <main> pa je „visio" u sredini desno). */}
      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="flex w-full min-w-0">
        <Sidebar
          verified={verified}
          isAdmin={isAdmin}
          jeNadzornik={jeNadzornik}
          brojZaNadzor={brojZaNadzor}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          dnevniBrojevi={dnevniBrojevi}
        />
        <main className="flex-1 min-w-0">
          <div className="px-4 py-5 md:px-8 md:py-6">
            {children}
          </div>
        </main>
      </div>
      </div>
    </div>
  );
}
