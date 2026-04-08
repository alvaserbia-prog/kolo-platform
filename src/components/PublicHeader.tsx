import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/kolo-logo.png";

export default async function PublicHeader() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-kolo-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <Image src={logoImg} alt="KOLO" width={120} height={82} style={{ height: "auto" }} />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/pijaca" className="text-sm text-kolo-muted hover:text-kolo-green-700 transition-colors">
            Pijaca
          </Link>
          <Link href="/kako-funkcionise" className="text-sm text-kolo-muted hover:text-kolo-green-700 transition-colors">
            Kako funkcioniše
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
            >
              Moj nalog →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors"
              >
                Prijavi se
              </Link>
              <Link
                href="/registracija"
                className="px-4 py-2 bg-kolo-gold-600 text-white text-sm font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors"
              >
                Pridruži se
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
