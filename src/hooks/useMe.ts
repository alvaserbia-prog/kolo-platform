"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export interface Notifikacija {
  id: string;
  tip: string;
  naslov: string;
  tekst: string;
  procitana: boolean;
  link: string | null;
  createdAt: string;
}

export interface DnevniBrojevi {
  novcanik: number;
  pijaca: number;
  tablaJemstva: number;
  adminCekanje: number;
}

export interface MeData {
  balance: number;
  avatar: string | null;
  neprocitanoPoruke: number;
  notifikacije: Notifikacija[];
  notifNeprocitano: number;
  dnevniBrojevi: DnevniBrojevi | null;
  nadzorBroj: number;
  politikaPotrebno: boolean;
}

export const ME_KEY = ["me"] as const;

async function dohvatiMe(): Promise<MeData> {
  const res = await fetch("/api/me");
  if (!res.ok) throw new Error("Greška pri dohvatanju /api/me");
  return res.json();
}

/**
 * Jedinstveni izvor podataka za „chrome" (Header + Sidebar), keširan kroz React
 * Query. Sve komponente koje pozovu `useMe()` dele ISTU keširanu query instancu
 * (React Query deduplikuje po `ME_KEY`) — umesto ranijih ~6 nezavisnih fetch-eva
 * po navigaciji. Polling na 30s; React Query ga automatski pauzira kada tab nije
 * vidljiv (refetchIntervalInBackground = false po defaultu).
 */
export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: dohvatiMe,
    refetchInterval: 30_000,
  });
}

/**
 * Most ka postojećim window event-ima app-a: kada se negde emituje
 * `balans-updated` / `avatar-updated` / `poruke-procitane`, invalidiraj keš
 * `['me']` da se chrome odmah osveži. Montirati jednom (npr. u AppShell).
 */
export function useMeEventBridge() {
  const qc = useQueryClient();
  useEffect(() => {
    const invalidiraj = () => qc.invalidateQueries({ queryKey: ME_KEY });
    window.addEventListener("balans-updated", invalidiraj);
    window.addEventListener("avatar-updated", invalidiraj);
    window.addEventListener("poruke-procitane", invalidiraj);
    return () => {
      window.removeEventListener("balans-updated", invalidiraj);
      window.removeEventListener("avatar-updated", invalidiraj);
      window.removeEventListener("poruke-procitane", invalidiraj);
    };
  }, [qc]);
}

/** Optimistički lokalni patch keša `['me']` (npr. badge na 0 pre potvrde servera). */
export function useMePatch() {
  const qc = useQueryClient();
  return (delta: Partial<MeData>) =>
    qc.setQueryData<MeData>(ME_KEY, (prev) => (prev ? { ...prev, ...delta } : prev));
}
