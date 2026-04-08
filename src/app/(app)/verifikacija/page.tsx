import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import VerifikacijaKlijent from "./VerifikacijaKlijent";

export default async function VerifikacijaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.verified) redirect("/dashboard");

  const vr = await prisma.verificationRequest.findUnique({
    where: { userId: session.user.id },
    select: { status: true, rejectionReason: true, createdAt: true },
  });

  return (
    <VerifikacijaKlijent
      request={
        vr
          ? {
              status: vr.status,
              rejectionReason: vr.rejectionReason ?? null,
              createdAt: vr.createdAt.toISOString(),
            }
          : null
      }
    />
  );
}
