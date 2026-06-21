"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DnevniBrojevi {
  novcanik: number;
  pijaca: number;
  tablaJemstva: number;
  adminCekanje: number;
}

interface AppShellProps {
  verified: boolean;
  isAdmin: boolean;
  jeNadzornik?: boolean;
  children: React.ReactNode;
}

export default function AppShell({ verified, isAdmin, jeNadzornik, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dnevniBrojevi, setDnevniBrojevi] = useState<DnevniBrojevi | null>(null);
  const [brojZaNadzor, setBrojZaNadzor] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();

  // Provera pristanaka: Politika privatnosti
  // (Popup za prihvatanje Pravilnika je uklonjen — nudio je zastarelu verziju.)
  useEffect(() => {
    if (pathname === "/politika-prihvati") return;
    fetch("/api/politika/prihvati")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.potrebno) {
          router.replace("/politika-prihvati");
        }
      })
      .catch(() => {});
  // Proveravamo samo pri mountovanju
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!verified) return;
    fetch("/api/dnevni-brojevi")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setDnevniBrojevi(data); })
      .catch(() => {});
  }, [verified]);

  // Kad korisnik otvori Novčanik/Pijaca → označi "viđeno" (badge ide na 0).
  // Optimistički nuliramo lokalno, pa serveru javimo da pomeri "viđeno" vreme.
  useEffect(() => {
    const sekcija =
      pathname.startsWith("/novcanik") ? "novcanik" :
      pathname.startsWith("/pijaca") ? "pijaca" :
      null;
    if (!sekcija) return;

    setDnevniBrojevi((prev) => (prev ? { ...prev, [sekcija]: 0 } : prev));
    fetch("/api/dnevni-brojevi/vidjeno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sekcija }),
    })
      // Posle pomeranja "viđeno" vremena osveži brojeve da ne dođe do trke
      // sa inicijalnim GET-om (koji bi mogao da vrati staru, ne-nulu vrednost).
      .then(() => fetch("/api/dnevni-brojevi"))
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setDnevniBrojevi(data); })
      .catch(() => {});
  }, [pathname]);

  // Učitaj broj verifikacija za nadzor (samo POCETNI / NOSILAC_ZRNA)
  useEffect(() => {
    if (!jeNadzornik) return;
    fetch("/api/nadzor")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.verifikacije) setBrojZaNadzor(data.verifikacije.length);
      })
      .catch(() => {});
  }, [jeNadzornik, pathname]);

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
