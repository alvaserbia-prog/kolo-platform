import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import NoviOglasForma from "./NoviOglasForma";

export default async function NoviOglasPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!session.user.verified) redirect("/verifikacija");

  return <NoviOglasForma />;
}
