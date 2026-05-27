import PublicHeader from "@/components/PublicHeader";
import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-kolo-bg flex flex-col">
      <PublicHeader />
      <main className="max-w-[932px] mx-auto px-6 py-6 w-full flex-1">
        {children}
      </main>
      <footer className="border-t border-kolo-border mt-8">
        <div className="max-w-[932px] mx-auto px-6 py-5 text-xs text-kolo-muted leading-relaxed">
          Softver: <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" className="hover:underline">AGPL-3.0</a>
          {" · "}
          Sadržaj: <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.sr" target="_blank" rel="noopener noreferrer" className="hover:underline">CC BY-SA 4.0</a>
          {" · "}
          <Link href="/zajednicko-dobro" className="text-kolo-green-700 hover:underline">Zajedničko dobro i licence</Link>
        </div>
      </footer>
    </div>
  );
}
