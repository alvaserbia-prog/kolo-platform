import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { MODUL_DECA_AKTIVAN } from "@/lib/moduli";
import { ucitajUcesnika } from "@/lib/protokol/deca";
import PrijateljiKlijent from "./PrijateljiKlijent";

/**
 * Prijatelji — dečja zamena za stranicu Potvrde.
 *
 * Odrasli tu vide indeks stvarnosti i kod za potvrđivanje. Dete nema indeks i
 * nikoga ne potvrđuje (Modul Deca, čl. 15), pa umesto indeksa stoji BROJ
 * PRIJATELJA, a umesto koda za potvrdu kod za povezivanje.
 */
export default async function PrijateljiPage() {
  if (!MODUL_DECA_AKTIVAN) notFound();
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const ja = await ucitajUcesnika(session.user.id);
  if (!ja?.maloletan) notFound();
  return <PrijateljiKlijent />;
}
