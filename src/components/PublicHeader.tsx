import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/kolo-icon.png";
import JezikSvitcer from "@/components/JezikSvitcer";
import PublicNav from "@/components/PublicNav";

export default async function PublicHeader() {
  const session = await getServerSession(authOptions);
  const maintenance = process.env.MAINTENANCE_MODE === "true";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-kolo-border">
      <div className="max-w-[1140px] mx-auto px-6 h-16 flex items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={logoImg} alt="KOLO" width={48} height={28} style={{ height: "auto" }} />
            <span className="font-bold text-kolo-green-900 text-xl tracking-tight">KOLO</span>
          </Link>
          <div className="hidden md:flex">
            <JezikSvitcer />
          </div>
        </div>

        <PublicNav isLoggedIn={!!session} maintenance={maintenance} />

        <div className="hidden md:flex items-center gap-3 shrink-0">
          {maintenance ? (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-kolo-border rounded-full text-xs font-medium text-kolo-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-kolo-gold-600" />
              Uskoro
            </span>
          ) : session ? (
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
