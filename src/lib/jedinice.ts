// Jedinice mere za oglase na Pijaci.
// Vrednosti se čuvaju u bazi (kolona MarketplaceListing.jedinica) — NE menjati ih.
// Skraćenica (vrednost) ujedno služi i kao sufiks uz cenu ("500 POEN / kg"),
// dok se puni naziv prikazuje kroz prevod `pijaca.jed_<vrednost>`.
export const JEDINICE_VREDNOSTI = ["kom", "kg", "g", "l", "ml", "m", "pak"] as const;

export type Jedinica = (typeof JEDINICE_VREDNOSTI)[number];

export function jeIspravnaJedinica(v: string | null | undefined): v is Jedinica {
  return !!v && (JEDINICE_VREDNOSTI as readonly string[]).includes(v);
}
