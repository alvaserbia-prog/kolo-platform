import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ZadaciKlijent from "./ZadaciKlijent";

export default async function ZadaciPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return <ZadaciKlijent isVerified={session.user.verified} />;
}
