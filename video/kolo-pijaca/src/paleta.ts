// Paleta „Pijace“: izometrijska ilustracija u jakim i čistim bojama (odluka vlasnika).
// Zelena KOLO boja (sa ekolo.rs) ostaje za sve što pripada platformi.
export const P = {
  nebo: "#BFE3F0",
  pozadina: "#FFF4E2",
  kaldrma: "#EAD7B7",
  kaldrmaLinija: "#D9C29C",
  trava: "#9CCB6B",
  travaTamna: "#79AE4E",
  belo: "#FFFFFF",
  krem: "#FFF9EE",
  mastilo: "#22324A",
  mastiloSvetlo: "#5B6B82",
  senka: "#22324A",
  // drvo tezgi
  drvo: "#D9965B",
  drvoTamno: "#9C5E33",
  // tende i boje robe
  crvena: "#E8483B",
  narandzasta: "#F28C28",
  zuta: "#F6C445",
  plava: "#2F80C9",
  tirkiz: "#25B0A6",
  ljubicasta: "#8E5BC2",
  roze: "#F07CA0",
  // pekmez (šljiva)
  pekmez: "#6B2350",
  pekmezSvetli: "#9C3B77",
  staklo: "#E6F3F6",
  poklopac: "#E8483B",
  // likovi
  koza: "#F4C7A1",
  koza2: "#E0A77E",
  kosaSeda: "#D9D4CC",
  kosaTamna: "#3E2B1E",
  kosaSmedja: "#8A5530",
  rada: "#E8483B",
  radaMarama: "#F6C445",
  dejan: "#2F80C9",
  dejanKapa: "#F28C28",
  // dinari (uopšteno, bez izgleda prave novčanice)
  dinar: "#B9D8A6",
  dinarTamni: "#6E9A5B",
  // KOLO
  zelena900: "#0F3D20",
  zelena700: "#1B6B3A",
  zelena500: "#2E9D54",
  zelena100: "#E8F5EC",
  zlatna: "#F5B842",
};

/** Potamni boju (#rrggbb) za k (0–1). */
export const tamnije = (c: string, k: number) => {
  const n = parseInt(c.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - k));
  const g = Math.round(((n >> 8) & 255) * (1 - k));
  const b = Math.round((n & 255) * (1 - k));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

/** Posvetli boju (#rrggbb) za k (0–1). */
export const svetlije = (c: string, k: number) => {
  const n = parseInt(c.slice(1), 16);
  const f = (x: number) => Math.round(x + (255 - x) * k);
  return `#${((1 << 24) | (f((n >> 16) & 255) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).slice(1)}`;
};
