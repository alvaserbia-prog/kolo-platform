import { notFound } from "next/navigation";
import { MODUL_DECA_AKTIVAN } from "@/lib/moduli";
import PotvrdeKlijent from "./PotvrdeKlijent";

/**
 * Ekran izjašnjenja o postojanju deteta (Pravilnik o Modulu Deca, čl. 6).
 *
 * Otvara ga korisnik iz zvonceta. Vidi jednu rečenicu — pseudonim roditelja i
 * uzrast deteta u godinama — i ništa iz detetovog naloga.
 */
export default function PotvrdePage() {
  if (!MODUL_DECA_AKTIVAN) notFound();
  return <PotvrdeKlijent />;
}
