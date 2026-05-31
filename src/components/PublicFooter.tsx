import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/kolo-icon.png";

export default function PublicFooter() {
  return (
    <footer className="border-t border-kolo-border bg-white mt-8">
      <div className="max-w-[932px] mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brend */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src={logoImg} alt="KOLO" width={28} height={19} style={{ height: "auto" }} />
              <span className="font-bold text-kolo-green-900">KOLO</span>
            </div>
            <p className="text-sm text-kolo-muted leading-relaxed mb-2">
              Sistem evidencije doprinosa zajedničkom dobru.
            </p>
            <p className="text-xs text-kolo-muted">Sombor, Srbija · Rana faza</p>
          </div>

          {/* Sistem */}
          <div>
            <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">Sistem</p>
            <ul className="space-y-2 text-sm text-kolo-muted">
              <li><Link href="/kako-funkcionise" className="hover:text-kolo-green-700 transition-colors">Kako funkcioniše</Link></li>
              <li><Link href="/o-sistemu" className="hover:text-kolo-green-700 transition-colors">O sistemu</Link></li>
              <li><Link href="/pijaca" className="hover:text-kolo-green-700 transition-colors">Pijaca</Link></li>
            </ul>
          </div>

          {/* Zajednica */}
          <div>
            <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">Zajednica</p>
            <ul className="space-y-2 text-sm text-kolo-muted">
              <li><Link href="/o-nama" className="hover:text-kolo-green-700 transition-colors">O nama</Link></li>
              <li><Link href="/cesto-postavljena-pitanja" className="hover:text-kolo-green-700 transition-colors">FAQ</Link></li>
              <li><Link href="/pokrovitelji" className="hover:text-kolo-green-700 transition-colors">Pokrovitelji</Link></li>
              <li><a href="mailto:kontakt@ekolo.rs" className="hover:text-kolo-green-700 transition-colors">Kontakt</a></li>
            </ul>
          </div>

          {/* Pravni okvir */}
          <div>
            <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">Pravni okvir</p>
            <ul className="space-y-2 text-sm text-kolo-muted">
              <li><Link href="/pravilnik" className="hover:text-kolo-green-700 transition-colors">Pravilnici</Link></li>
              <li><Link href="/statut" className="hover:text-kolo-green-700 transition-colors">Statut</Link></li>
              <li><Link href="/whitepaper" className="hover:text-kolo-green-700 transition-colors">Whitepaper</Link></li>
              <li><Link href="/uslovi" className="hover:text-kolo-green-700 transition-colors">Uslovi korišćenja</Link></li>
              <li><Link href="/privatnost" className="hover:text-kolo-green-700 transition-colors">Politika privatnosti</Link></li>
            </ul>
          </div>
        </div>

        {/* Donja traka — copyright + licence (na svakoj strani) */}
        <div className="border-t border-kolo-border pt-5 text-xs text-kolo-muted leading-relaxed text-center space-y-1.5">
          <p>© 2026 KOLO Fondacija · Sombor, Srbija · Rana faza · ekolo.rs</p>
          <p>
            Softver: <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" className="hover:underline">AGPL-3.0</a>
            {" · "}
            Sadržaj: <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.sr" target="_blank" rel="noopener noreferrer" className="hover:underline">CC BY-SA 4.0</a>
            {" · "}
            <Link href="/zajednicko-dobro" className="text-kolo-green-700 hover:underline">Zajedničko dobro i licence</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
