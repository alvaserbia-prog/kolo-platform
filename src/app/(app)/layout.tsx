import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="h-full bg-kolo-bg text-kolo-text flex justify-center">
      <div className="flex w-full max-w-[1140px] min-w-0">
        <Sidebar verified={session.user.verified} isAdmin={session.user.role === "ADMIN"} />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="px-6 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
