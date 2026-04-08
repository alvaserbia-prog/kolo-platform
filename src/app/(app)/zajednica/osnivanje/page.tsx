import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import OsnivanjeForma from "./OsnivanjeForma";

export default async function OsnivanjePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!session.user.verified) redirect("/verifikacija");
  return <OsnivanjeForma />;
}
