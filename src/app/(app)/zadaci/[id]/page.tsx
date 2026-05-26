import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ZadatakDetaljKlijent from "./ZadatakDetaljKlijent";

export default async function ZadatakDetaljPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const { id } = await params;
  return <ZadatakDetaljKlijent id={id} isVerified={session.user.verified} />;
}
