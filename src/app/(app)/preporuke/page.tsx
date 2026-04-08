import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import PreporukeKlijent from "./PreporukeKlijent";

export default async function PreporukePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!session.user.verified) redirect("/dashboard?poruka=preporuke");

  return <PreporukeKlijent />;
}
