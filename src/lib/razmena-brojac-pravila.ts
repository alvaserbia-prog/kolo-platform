/**
 * Brojač razmena — donji prag, na jednom mestu.
 *
 * „Razmena" u javnim pokazateljima (naslovna, početna, /sistem) nije zaseban
 * zapis nego prepis POEN-a između dva korisnička zapisa (`TRANSFER`). Bez donjeg
 * praga taj brojač meri i simbolične prepise od jednog POEN-a, pa broj na ekranu
 * prestaje da govori o razmeni dobara i usluga — a to je jedino zbog čega tamo i
 * stoji.
 *
 * 🔴 Prag se meri PO PREPISU, ne po zbiru sa istim čovekom: pet prepisa od po
 * 50 POEN nisu jedna razmena od 250, nego pet sitnih koje brojač ne prihvata.
 *
 * 🔴 Ovo je DRUGI prag od `MIN_IZNOS_TRANSAKCIJE` (1.000 POEN) u
 * `doprinos-razmeni-pravila.ts` i ne spajaju se: tamo se odlučuje da li se
 * čoveku upisuje POEN po lestvici čl. 40b, ovde se samo broji šta se prikazuje.
 * Lestvica nagrađuje, brojač meri — pragovi im se mogu i razići.
 *
 * 🟡 Prepis ispod praga se ne poništava, ne skriva i ne gubi: stoji u istoriji
 * novčanika obe strane, u `/api/javno/feed` i u zbiru prepisanih POEN-a
 * („Ukupno prepisa"). Iz brojača razmena izlazi samo kao stavka koja se broji.
 *
 * Fajl je namerno bez ijednog `import`-a i bez Prisme (pravilo 9) — uvoze ga
 * serverske stranice koje same pišu upit.
 */

/** Najmanji prepis koji brojač razmena prihvata kao razmenu. */
export const MIN_POEN_RAZMENE = 100;

/**
 * Uslov po kome se prepis broji kao razmena. Ide u SVAKI upit koji javno
 * prikazuje broj razmena ili njihov spisak — spaja se spread-om, da uslov ostane
 * jedan i kad upit ima svojih (npr. `createdAt` za „danas", `BEZ_DECE` za spisak).
 */
export const USLOV_RAZMENE = {
  type: "TRANSFER",
  amount: { gte: MIN_POEN_RAZMENE },
} as const;
