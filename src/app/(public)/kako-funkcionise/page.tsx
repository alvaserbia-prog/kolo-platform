import Link from "next/link";

export default function KakoFunkcionisePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-16">

      {/* Uvod */}
      <section className="text-center pt-4">
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
          Vodič za nove članove
        </div>
        <h1 className="text-3xl font-bold text-kolo-green-900 mb-4" style={{ letterSpacing: "-0.02em" }}>
          Kako funkcioniše KOLO?
        </h1>
        <p className="text-kolo-muted leading-relaxed max-w-xl mx-auto">
          KOLO je mreža zadruga koja beleži doprinos članova i nagrađuje ga internom jedinicom POEN.
          Nije banka, nije kripto — to je sistem uzajamnosti.
        </p>
      </section>

      {/* Koraci */}
      <section>
        <h2 className="text-xl font-bold text-kolo-green-900 mb-6" style={{ letterSpacing: "-0.02em" }}>
          Četiri koraka do aktivnog članstva
        </h2>
        <div className="space-y-4">
          {[
            {
              korak: "1",
              naslov: "Registrujte se",
              opis: "Kreirajte nalog sa pseudonimom — vaše pravo ime ostaje privatno. Pseudonim je jedino što ostatak zajednice vidi.",
              boja: "bg-kolo-green-100 text-kolo-green-700",
            },
            {
              korak: "2",
              naslov: "Verifikujte identitet",
              opis: "Uploadujte obe strane lične karte ili se javite u lokalnu zadrugu radi lične verifikacije. Svaki čovek se verifikuje jednom.",
              boja: "bg-kolo-green-100 text-kolo-green-700",
            },
            {
              korak: "3",
              naslov: "Preuzmite 1.000 POEN bonus",
              opis: "KOLO Banka automatski emituje 1.000 POEN na vaš novčanik čim admin odobri verifikaciju. To je vaš startni kapital.",
              boja: "bg-kolo-gold-100 text-kolo-gold-600",
            },
            {
              korak: "4",
              naslov: "Trgujte i doprinesite zajednici",
              opis: "Koristite POEN za kupovinu na Pijaci, ili nudite sopstvene usluge i robu. ZRNO vam daje glas u upravljanju sistemom.",
              boja: "bg-kolo-green-100 text-kolo-green-700",
            },
          ].map((s) => (
            <div key={s.korak} className="flex gap-4 bg-white rounded-2xl card-shadow p-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${s.boja}`}>
                {s.korak}
              </div>
              <div>
                <p className="font-semibold text-kolo-text">{s.naslov}</p>
                <p className="text-sm text-kolo-muted mt-1 leading-relaxed">{s.opis}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POEN */}
      <section className="bg-white rounded-2xl card-shadow p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-kolo-green-100 text-kolo-green-700 flex items-center justify-center font-bold text-sm">P</div>
          <h2 className="text-lg font-bold text-kolo-green-900">Šta je POEN?</h2>
        </div>
        <p className="text-sm text-kolo-muted leading-relaxed">
          POEN (izv. od "poen") je <strong className="text-kolo-text">jedinica evidencije doprinosa</strong> —
          beleži koliko si dao/la zajednici. Nije novac u pravnom smislu i ne može se zameniti za dinare.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { naslov: "Cel broj", opis: "1 POEN = 1 POEN. Nema centi ni decimala." },
            { naslov: "Zero-sum", opis: "Zbir svih POEN-a u sistemu uvek je nula. Banka emituje, ti primaš." },
            { naslov: "Bez provizije", opis: "Prenos između članova je 1:1. Niko ne uzima deo." },
            { naslov: "Traje večno", opis: "POEN ne ističe. Tvoj doprinos se pamti." },
          ].map((f) => (
            <div key={f.naslov} className="bg-kolo-bg rounded-xl p-3">
              <p className="text-xs font-semibold text-kolo-text">{f.naslov}</p>
              <p className="text-xs text-kolo-muted mt-0.5">{f.opis}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ZRNO */}
      <section className="bg-white rounded-2xl card-shadow p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-kolo-gold-100 text-kolo-gold-600 flex items-center justify-center font-bold text-sm">Z</div>
          <h2 className="text-lg font-bold text-kolo-green-900">Šta je ZRNO?</h2>
        </div>
        <p className="text-sm text-kolo-muted leading-relaxed">
          ZRNO je <strong className="text-kolo-text">upravljačka jedinica</strong>.
          Kupuješ ga od KOLO Banke u zamenu za POEN, i koristiš ga za glasanje o odlukama zajednice.
          Zaključavanjem ZRNA dobijate glas razmerno veličini vašeg doprinosa.
        </p>
        <div className="bg-kolo-gold-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-kolo-gold-600 mb-1">Kurs ZRNA</p>
          <p className="text-xs text-kolo-muted leading-relaxed">
            Kurs ZRNA raste sa svakom donacijom Fondaciji. Što više donacija, veća vrednost ZRNA.
            To znači da rani članovi plaćaju manje POEN po ZRNU.
          </p>
        </div>
      </section>

      {/* Verifikacija */}
      <section className="bg-white rounded-2xl card-shadow p-6 space-y-4">
        <h2 className="text-lg font-bold text-kolo-green-900">Verifikacija identiteta</h2>
        <p className="text-sm text-kolo-muted leading-relaxed">
          Svaki član se verifikuje <strong className="text-kolo-text">jednom i samo jednom</strong>.
          Jedan čovek = jedan nalog. Verifikacija sprečava duplikate i čuva integritet sistema.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-kolo-bg rounded-xl p-4">
            <p className="text-sm font-semibold text-kolo-text mb-1">Kanal 1 — Upload</p>
            <p className="text-xs text-kolo-muted leading-relaxed">
              Fotografišite obe strane lične karte i uploadujete kroz aplikaciju. Admin pregleda i odobrava.
            </p>
          </div>
          <div className="bg-kolo-bg rounded-xl p-4">
            <p className="text-sm font-semibold text-kolo-text mb-1">Kanal 2 — Lično</p>
            <p className="text-xs text-kolo-muted leading-relaxed">
              Javite se u lokalnu zadrugu i pokažite dokument lično. Admin unosi JMBG direktno u sistem.
            </p>
          </div>
        </div>
      </section>

      {/* Programi */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
          Programi Banke
        </h2>
        <p className="text-sm text-kolo-muted">
          KOLO Banka emituje POEN isključivo kroz odobrene programe. Svaki dan može da emituje
          maksimalno <strong className="text-kolo-text">10% od ukupnog opticaja</strong>.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {[
            {
              naziv: "Verifikacija",
              iznos: "1.000 POEN",
              opis: "Svaki novi verifikovani nalog dobija jednokratnu nagradu od 1.000 POEN.",
              ikona: "✓",
              aktivan: true,
            },
            {
              naziv: "Preporuke",
              iznos: "do 10.000 POEN",
              opis: "Za svaku osobu kojoj si preporučio KOLO i koja se verifikuje, dobijaš nagradu. 10 nivoa nagrade — do 10.000 POEN po preporuci.",
              ikona: "→",
              aktivan: true,
            },
            {
              naziv: "Donacije",
              iznos: "kurs raste",
              opis: "Svaka donacija Fondaciji povećava kurs POEN/RSD. Donatori dobijaju POEN srazmerno donaciji.",
              ikona: "♥",
              aktivan: true,
            },
            {
              naziv: "Podrška porodicama",
              iznos: "u pripremi",
              opis: "Programi za majke, starije, školovanje i zapošljavanje. Biće aktivirani u narednoj fazi razvoja.",
              ikona: "🏡",
              aktivan: false,
            },
          ].map((p) => (
            <div key={p.naziv} className={`bg-white rounded-2xl card-shadow p-5 flex gap-4 items-start ${!p.aktivan ? "opacity-60" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-kolo-green-100 text-kolo-green-700 flex items-center justify-center text-lg shrink-0 font-bold">
                {!p.aktivan ? "🔒" : p.ikona}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-kolo-text">{p.naziv}</p>
                  <span className="text-xs font-mono bg-kolo-green-100 text-kolo-green-700 px-2 py-0.5 rounded">{p.iznos}</span>
                </div>
                <p className="text-sm text-kolo-muted mt-1 leading-relaxed">{p.opis}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Zadruge */}
      <section className="bg-white rounded-2xl card-shadow p-6 space-y-4">
        <h2 className="text-lg font-bold text-kolo-green-900">Lokalne zadruge</h2>
        <p className="text-sm text-kolo-muted leading-relaxed">
          KOLO funkcioniše kroz mrežu lokalnih zadruga. Svaka zadruga je autonomna i
          upravlja sopstvenim programima. Zadrugar je član koji se formalno učlani u zadrugu
          i preuzima odgovornost u upravljanju.
        </p>
        <div className="bg-kolo-bg rounded-xl p-4">
          <p className="text-xs font-semibold text-kolo-text mb-1">Kako osnovati zadrugu?</p>
          <p className="text-xs text-kolo-muted">
            Potrebno je minimum 3 verifikovana člana. Inicijator šalje zahtev za osnivanje,
            Fondacija pregleda i odobrava. Osnivanje donosi 50.000 POEN startnog kapitala.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-kolo-green-700 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>Spreman/a da se pridružiš?</h2>
        <p className="text-white/70 text-sm mb-6">Registracija je besplatna. Verifikacijom dobijate 1.000 POEN bonus.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/registracija"
            className="px-7 py-3 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm">
            Registruj se besplatno →
          </Link>
          <Link href="/pijaca"
            className="px-7 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm">
            Pogledaj Pijacku
          </Link>
        </div>
      </section>

    </div>
  );
}
