// Redovi komšijske sveske. Smer kao na ekolo.rs: „ko prepisuje → kome · iznos · za šta".
// Sećanje (scene 2–3) se zatvara u kolo: Jova je Stani doneo drva, Pera je Jovi popravio
// ogradu, Stana je Peri donela kolače.
import type { Red } from "./sveska";

export const SECANJE: Red[] = [
  { od: "Stana", ka: "Jova", iznos: "2.000", sta: "drva" },
  { od: "Jova", ka: "Pera", iznos: "3.000", sta: "ograda" },
  { od: "Pera", ka: "Stana", iznos: "1.000", sta: "kolači" },
];
export const MILAN_ANA: Red = { od: "Milan", ka: "Ana", iznos: "5.000", sta: "med" };
export const ANA_LAZAR: Red = { od: "Ana", ka: "Lazar", iznos: "4.000", sta: "popravka" };
