import { notFound } from "next/navigation";
import { MODUL_DECA_AKTIVAN } from "@/lib/moduli";
import SkoleKlijent from "./SkoleKlijent";

export const metadata = { title: "Škole" };

export default function SkolePage() {
  if (!MODUL_DECA_AKTIVAN) notFound();
  return <SkoleKlijent />;
}
