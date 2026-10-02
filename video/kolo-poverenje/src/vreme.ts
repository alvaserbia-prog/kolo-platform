// Vreme priče: sve animacije se kače na izgovorenu reč, ne na sekunde, pa prate glas.
// Svaki video ima svoj plan (src/vN/plan.json); ovde je zajednička mehanika.
export type Rec = { w: string; s: number; e: number };
export type ScenaPlan = {
  id: number;
  od: number;
  do: number;
  odF: number;
  doF: number;
  glasOd: number;
  glasDo: number;
  glasOdF: number;
  klipOd: number;
  klipDo: number;
  reci: Rec[];
  tekst: string;
};
export type Plan = { fps: number; prednost?: number; trajanje: number; frejmova: number; scene: ScenaPlan[] };

const cisto = (x: string) => x.toLowerCase().replace(/[.,?!:„“"]/g, "");

export const napraviVreme = (plan: Plan) => {
  const scena = (id: number): ScenaPlan => plan.scene.find((s) => s.id === id)!;
  /** Lokalni frejm (unutar scene) u kom počinje reč `rec` (n-ta pojava). */
  const kad = (id: number, rec: string, pojava = 1): number => {
    const s = scena(id);
    let n = 0;
    for (const w of s.reci) {
      if (cisto(w.w) === cisto(rec) && ++n === pojava) return Math.round((s.glasOd - s.od + w.s - (plan.prednost ?? 0)) * plan.fps);
    }
    throw new Error(`reč „${rec}" (${pojava}) nije u sceni ${id}`);
  };
  /** Lokalni frejm kraja reči. */
  const kadKraj = (id: number, rec: string, pojava = 1): number => {
    const s = scena(id);
    let n = 0;
    for (const w of s.reci) {
      if (cisto(w.w) === cisto(rec) && ++n === pojava) return Math.round((s.glasOd - s.od + w.e - (plan.prednost ?? 0)) * plan.fps);
    }
    throw new Error(`reč „${rec}" (${pojava}) nije u sceni ${id}`);
  };
  /** Globalni frejm reči (za naslove i titlove). */
  const glob = (id: number, rec: string, pojava = 1) => scena(id).odF + kad(id, rec, pojava);
  const trajanjeF = (id: number) => scena(id).doF - scena(id).odF;
  return { plan, scena, kad, kadKraj, glob, trajanjeF };
};
