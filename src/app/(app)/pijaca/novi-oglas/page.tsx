import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NoviOglasForma from "./NoviOglasForma";

export default async function NoviOglasPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!session.user.verified) redirect("/tabla-jemstva");

  const korisnik = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { location: true, telefon: true },
  });

  return (
    <NoviOglasForma
      defaultLocation={korisnik?.location ?? ""}
      defaultPhone={korisnik?.telefon ?? ""}
    />
  );
}
