import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "O nama — KOLO",
  description:
    "KOLO je inicijativa grupe ljudi iz Sombora koji veruju da zajednica može da organizuje sopstvenu razmenu — bez posrednika, bez kamata, bez eksternih centara moći.",
};

export default function ONamaPage() {
  return (
    <div className="max-w-[1140px] mx-auto space-y-6 pb-8">

      {/* Uvod */}
      <section className="text-center pt-4">
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
          Ko smo
        </div>
        <h1 className="text-3xl font-bold text-kolo-green-900 mb-4" style={{ letterSpacing: "-0.02em" }}>
          O nama
        </h1>
        <p className="text-kolo-muted leading-relaxed max-w-xl mx-auto">
          KOLO je inicijativa grupe ljudi iz Sombora koji veruju da zajednica može da
          organizuje sopstvenu razmenu — bez posrednika, bez kamata, bez eksternih centara moći.
        </p>
      </section>

      {/* Poreklo */}
      <section className="bg-white rounded-2xl card-shadow p-6 space-y-4">
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
          Poreklo ideje
        </div>
        <p className="text-kolo-green-900 text-lg font-semibold leading-relaxed">
          Sve počinje od jednostavnog pitanja: zašto dva čoveka iz iste ulice ne mogu da
          se dogovore, a svaki od njih treba ono što drugi može da pruži?
        </p>
        <p className="text-kolo-muted leading-relaxed">
          Odgovor nije nedostatak volje — odgovor je nedostatak sistema koji bi tu razmenu
          evidentirano i pošteno zabeležio. KOLO je pokušaj da se taj sistem napravi.
          Ne kao startup, ne kao aplikacija za brzu zaradu — kao infrastruktura zajednice.
        </p>
      </section>

      {/* Fondacija */}
      <section className="bg-white rounded-2xl card-shadow p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-kolo-green-100 text-kolo-green-700 flex items-center justify-center font-bold text-sm shrink-0">
            F
          </div>
          <div>
            <h2 className="text-lg font-bold text-kolo-green-900 mb-2">Fondacija KOLO</h2>
            <p className="text-sm text-kolo-muted leading-relaxed mb-3">
              Fondacija je organizacioni kičmenjak sistema. Ona ne poseduje KOLO — ona ga
              čuva. Zadatak Fondacije je da obezbedi infrastrukturu, verifikuje članove,
              vodi evidenciju i postepeno prenosi upravljanje na Gornje Kolo — skupštinu
              verifikovanih članova koji glasaju ZRNOM.
            </p>
            <div className="bg-kolo-bg rounded-xl p-4">
              <p className="text-xs font-semibold text-kolo-text mb-1">Status</p>
              <p className="text-sm text-kolo-muted">
                Fondacija je u procesu registracije u Somboru. Sistem je u alpha fazi —
                svi podaci su realni, ali pravni okvir je još u izgradnji.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principi */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
          Na čemu stojimo
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              naslov: "Transparentnost",
              opis: "Svaka transakcija je javna. Svako pravilo je dostupno. Nema skrivenih mehanizama ni privilegovanih korisnika.",
              boja: "bg-kolo-green-100 text-kolo-green-700",
              ikona: "◎",
            },
            {
              naslov: "Uzajamnost",
              opis: "KOLO funkcioniše zato što neko daje — a ne zato što neko naplaćuje uslugu posredovanja. Sistem radi za članove.",
              boja: "bg-kolo-green-100 text-kolo-green-700",
              ikona: "⇄",
            },
            {
              naslov: "Lokalna ukorenost",
              opis: "Zadruge su osnova sistema. Razmena koja ima smisla odvija se između ljudi koji se poznaju i koji žive na istom prostoru.",
              boja: "bg-kolo-gold-100 text-kolo-gold-600",
              ikona: "⌖",
            },
            {
              naslov: "Samouprava",
              opis: "Cilj nije da Fondacija večno upravlja — cilj je da sistem preraste u zajednicu koja se sama organizuje kroz glasanje ZRNOM.",
              boja: "bg-kolo-gold-100 text-kolo-gold-600",
              ikona: "◈",
            },
          ].map((p) => (
            <div key={p.naslov} className="bg-white rounded-2xl card-shadow p-5 flex gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${p.boja}`}>
                {p.ikona}
              </div>
              <div>
                <p className="font-semibold text-kolo-text text-sm">{p.naslov}</p>
                <p className="text-sm text-kolo-muted mt-1 leading-relaxed">{p.opis}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Šta nismo */}
      <section className="bg-white rounded-2xl card-shadow p-6 border-l-4 border-kolo-green-700 space-y-3">
        <h2 className="text-lg font-bold text-kolo-green-900">Šta KOLO nije</h2>
        <p className="text-sm text-kolo-muted leading-relaxed">
          KOLO nije startup koji traži investitore. Nije kriptovaluta. Nije piramidalna šema.
          Nije zamena za dinar ni zvanično platno sredstvo. POEN je interna evidencija doprinosa —
          postoji da beleži šta si dao zajednici, ne da bi se bogatilo preprodajom.
        </p>
        <p className="text-sm text-kolo-muted leading-relaxed">
          Nema obećanja brze zarade. Nema garancija koje ne možemo da ispunimo.
          Ima samo sistem koji funkcioniše onoliko dobro koliko ljudi u njemu rade jedni za druge.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-kolo-green-700 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
          Postani deo zajednice
        </h2>
        <p className="text-white/70 text-sm mb-6">
          Alpha faza je otvorena. Registracija je besplatna.
          Verifikacijom dobijaš 1.000 POEN bonusa.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/registracija"
            className="px-7 py-3 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm"
          >
            Registruj se besplatno →
          </Link>
          <Link
            href="/kako-funkcionise"
            className="px-7 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            Kako funkcioniše
          </Link>
        </div>
      </section>

    </div>
  );
}
