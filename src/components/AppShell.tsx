"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useMe, useMeEventBridge, useMePatch, ME_KEY } from "@/hooks/useMe";
import { useSkrolPamcenje } from "@/hooks/useSkrolPamcenje";

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
  // Back/forward vraća poziciju skrola sadržaja (skrol je u div-u ispod, ne na
  // window-u, pa browser/Next restauracija ne važi).
  const skrolRef = useSkrolPamcenje<HTMLDivElement>();

  // Jedan keširan izvor za ceo chrome (balans, badge-evi, notifikacije, nadzor,
  // politika) — deli se sa Header-om kroz React Query keš. Ranije: 6 fetch-eva.
  useMeEventBridge();
  const { data: me } = useMe();
  const patchMe = useMePatch();

  const dnevniBrojevi = me?.dnevniBrojevi ?? null;
  const brojZaNadzor = me?.nadzorBroj ?? 0;

  // Provera pristanka na Politiku privatnosti (popup za Pravilnik je uklonjen).
  //
  // `/profil` je namerno izuzet iz gejta: Politika čl. 16 i Uslovi čl. 40 (v4.1.1)
  // izričito kažu da ograničenje pristupa do prihvatanja NE dira u pravo na pristup,
  // prenosivost i brisanje podataka. Ta prava se ostvaruju upravo na podešavanjima
  // profila (eksport + gašenje naloga), a ekran za prihvatanje na njih i linkuje —
  // bez ovog izuzetka bi taj link vraćao korisnika nazad na sam gejt.
  //
  // Poređenje je TAČNO `/profil`, ne `startsWith`: `/profil/<pseudonim>` je tuđi javni
  // profil, a `/profil/oglasi` moji oglasi — to nisu prava iz ZZPL-a i ostaju iza gejta.
  //
  // Brana protiv petlje (`gejtPokusaji`): ako nas ekran za pristanak vrati
  // nazad — jer server već zna za pristanak, a keširani `['me']` još drži staru
  // vrednost — dva redirect-a se smenjuju u krug i stranica vidljivo blinka.
  // Prvi put samo osvežimo `['me']` iz baze; ako se bouncing nastavi, prestajemo
  // da preusmeravamo. Brojač se resetuje čim se gejt legitimno zatvori, a
  // ubrzano brojimo samo uzastopne skokove (razmak < 2s) — obična navigacija
  // korisnika koji nije pristao ne troši pokušaje.
  const gejtPokusaji = useRef(0);
  const gejtPoslednji = useRef(0);
  useEffect(() => {
    if (pathname === "/politika-prihvati" || pathname === "/profil") return;
    if (!me?.politikaPotrebno) { gejtPokusaji.current = 0; return; }

    const sada = Date.now();
    gejtPokusaji.current = sada - gejtPoslednji.current < 2_000 ? gejtPokusaji.current + 1 : 1;
    gejtPoslednji.current = sada;

    if (gejtPokusaji.current === 3) {
      qc.invalidateQueries({ queryKey: ME_KEY });
      return;
    }
    if (gejtPokusaji.current > 3) return;

    router.replace("/politika-prihvati");
  }, [me?.politikaPotrebno, pathname, router, qc]);

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
      <div ref={skrolRef} className="flex-1 min-h-0 overflow-y-auto">
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
