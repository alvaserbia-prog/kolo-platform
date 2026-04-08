import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PublicHeader from "@/components/PublicHeader";

export default async function PijacaLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <div className="flex h-full bg-kolo-bg text-kolo-text">
        <Sidebar verified={session.user.verified} isAdmin={session.user.role === "ADMIN"} />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="max-w-5xl mx-auto px-6 py-6 w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kolo-bg">
      <PublicHeader />
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
