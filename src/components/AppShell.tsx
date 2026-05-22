"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DnevniBrojevi {
  novcanik: number;
  pijaca: number;
  krug: number;
  ped: number;
  programi: number;
  zrno: number;
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

  // Provera da li korisnik treba da prihvati novu verziju Politike privatnosti
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
    <div className="h-full bg-kolo-bg text-kolo-text flex flex-col">
      <Header onMenuOpen={() => setMobileOpen(true)} />
      <div className="flex flex-1 min-h-0 justify-center">
      <div className="flex w-full max-w-[1140px] min-w-0">
        <Sidebar
          verified={verified}
          isAdmin={isAdmin}
          jeNadzornik={jeNadzornik}
          brojZaNadzor={brojZaNadzor}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          dnevniBrojevi={dnevniBrojevi}
        />
        <main className="flex-1 overflow-auto">
          <div className="px-4 py-5 md:px-8 md:py-6">
            {children}
          </div>
        </main>
      </div>
      </div>
    </div>
  );
}
