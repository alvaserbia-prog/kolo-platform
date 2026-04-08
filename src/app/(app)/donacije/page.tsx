import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DonacijeKlijent from "./DonacijeKlijent";

export default async function DonacijePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!session.user.verified) redirect("/dashboard?poruka=donacije");

  return <DonacijeKlijent />;
}
