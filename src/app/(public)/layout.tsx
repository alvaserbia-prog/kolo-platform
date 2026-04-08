import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-kolo-bg">
      <header className="border-b border-kolo-border bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kolo-logo.png" alt="KOLO" style={{ height: 44, width: "auto" }} />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/pijaca" className="text-sm text-kolo-muted hover:text-kolo-green-700 transition-colors">
              Pijaca
            </Link>
            <Link href="/kako-funkcionise" className="text-sm text-kolo-muted hover:text-kolo-green-700 transition-colors">
              Kako funkcioniše
            </Link>
            {session ? (
              <Link href="/dashboard" className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors">
                Moj nalog
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-500 transition-colors">
                  Prijavi se
                </Link>
                <Link href="/registracija" className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors">
                  Pridruži se
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
