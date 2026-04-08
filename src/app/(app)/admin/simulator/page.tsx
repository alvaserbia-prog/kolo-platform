import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SimulatorKlijent from "./SimulatorKlijent";

export default async function SimulatorPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="max-w-5xl py-6 px-4">
      <SimulatorKlijent />
    </div>
  );
}
