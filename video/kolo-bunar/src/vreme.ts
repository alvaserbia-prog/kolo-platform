import plan from "./plan.json";

export type Rec = { w: string; s: number; e: number };
export type Scena = (typeof plan.scene)[number];
export const FPS = plan.fps;
/**
 * Koliko tekst i slika idu ISPRED izgovorene reči (odluka vlasnika 28.09.2026): titl, natpis i
 * pokret vezan za reč pojavljuju se 0,7 s pre izgovora, jer oko čita sporije nego što uho čuje;
 * kad je tekst išao tačno uz reč, gledalac je doživljavao da kasni. Glas i muzika se ne pomeraju.
 */
export const PREDNOST_S = 0.7;
export const scena = (id: number): Scena => plan.scene.find((s) => s.id === id)!;

/**
 * Lokalni frejm (unutar Sequence scene) u kom počinje reč `rec` (n-ta pojava).
 * Animacija se kači na izgovorenu reč, ne na sekunde, pa prati glas.
 */
export const kad = (id: number, rec: string, pojava = 1): number => {
  const s = scena(id);
  let n = 0;
  const cisto = (x: string) => x.toLowerCase().replace(/[.,?!]/g, "");
  for (const w of s.reci as Rec[]) {
    if (cisto(w.w) === cisto(rec) && ++n === pojava) return Math.round((s.glasOd - s.od + w.s - PREDNOST_S) * FPS);
  }
  throw new Error(`reč „${rec}" (${pojava}) nije u sceni ${id}`);
};

/** Lokalni frejm za zadatu sekundu naracije scene (0 = početak klipa). */
export const glasF = (id: number, sek: number) => {
  const s = scena(id);
  return Math.round((s.glasOd - s.od + sek - PREDNOST_S) * FPS);
};

export const trajanjeF = (id: number) => scena(id).doF - scena(id).odF;
