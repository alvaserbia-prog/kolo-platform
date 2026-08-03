// Udaljenost između mesta u Srbiji.
// Lokacije oglasa/korisnika su slobodan tekst (LokacijaSearch nudi naselja iz
// naselja-srbije.ts). Naziv se razrešava u koordinate SAMOG NASELJA
// (naselja-koordinate.ts, GeoNames) kad postoje; za naselja bez sopstvenih
// koordinata pada se nazad na centar OPŠTINE kojoj naselje pripada.
// Tačnost je ~km — dovoljno za informativni prikaz na kartici oglasa.

import { NASELJE_OPSTINA, OPSTINA_KOORDINATE } from "./naselja-geo";
import { NASELJE_KOORDINATE } from "./naselja-koordinate";

export type Koordinate = readonly [number, number];

// Ista normalizacija kao u LokacijaSearch: mala slova, bez dijakritika.
function normalizuj(s: string): string {
  return s
    .toLowerCase()
    .replace(/[čć]/g, "c")
    .replace(/[š]/g, "s")
    .replace(/[ž]/g, "z")
    .replace(/[đ]/g, "d")
    .trim();
}

// Indeks: normalizovan naziv naselja/opštine → koordinate.
// Gradi se jednom pri učitavanju modula (~1.000 unosa). Redosled prioriteta:
// 1) centri opština, 2) koordinate samih naselja (pregaze centar opštine i za
//    istoimeni grad-sedište, npr. „Sombor" dobija tačku grada; generator
//    preskače naselja čije ime sudara sa imenom DRUGE opštine),
// 3) preostala naselja bez sopstvenih koordinata → centar svoje opštine.
const INDEKS: Map<string, Koordinate> = (() => {
  const m = new Map<string, Koordinate>();
  for (const [opstina, koord] of Object.entries(OPSTINA_KOORDINATE)) {
    m.set(normalizuj(opstina), koord);
  }
  for (const [naselje, koord] of Object.entries(NASELJE_KOORDINATE)) {
    m.set(normalizuj(naselje), koord);
  }
  for (const [naselje, opstina] of Object.entries(NASELJE_OPSTINA)) {
    const koord = OPSTINA_KOORDINATE[opstina];
    const kljuc = normalizuj(naselje);
    // Naziv opštine/naselja sa koordinatama ima prednost nad istoimenim
    // naseljem u drugoj opštini (prvo upisano važi).
    if (koord && !m.has(kljuc)) m.set(kljuc, koord);
  }
  return m;
})();

// Razreši slobodan tekst lokacije u koordinate. Toleriše dodatak iza zareza
// („Novi Sad, Liman") tako što proba i deo pre prvog zareza.
export function koordinateZaMesto(naziv: string | null | undefined): Koordinate | null {
  if (!naziv) return null;
  const cel = normalizuj(naziv);
  if (INDEKS.has(cel)) return INDEKS.get(cel)!;
  const preZareza = normalizuj(naziv.split(",")[0]);
  return INDEKS.get(preZareza) ?? null;
}

// Haversine — udaljenost velikog kruga u kilometrima.
export function udaljenostKm(a: Koordinate, b: Koordinate): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const la = (a[0] * Math.PI) / 180;
  const lb = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la) * Math.cos(lb) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Udaljenost između dva mesta po nazivu; null kad neko od njih nije prepoznato.
export function udaljenostIzmedjuMesta(
  mestoA: string | null | undefined,
  mestoB: string | null | undefined
): number | null {
  const a = koordinateZaMesto(mestoA);
  const b = koordinateZaMesto(mestoB);
  if (!a || !b) return null;
  return udaljenostKm(a, b);
}
