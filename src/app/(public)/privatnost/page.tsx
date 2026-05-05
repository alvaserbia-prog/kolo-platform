import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politika privatnosti — KOLO",
  description: "Politika privatnosti KOLO platforme",
};

export default function PolitikaPrivatnostiPage() {
  return (
    <div className="max-w-[800px] mx-auto pb-16">

      <div className="mb-8">
        <p className="text-xs text-kolo-muted mb-1">Pravni dokumenti</p>
        <h1 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
          Politika privatnosti KOLO platforme
        </h1>
        <p className="text-sm text-kolo-muted mt-2">
          Verzija 4 (beta) · Stupila na snagu: 12. april 2026.
        </p>
        <div className="mt-4 flex gap-3 text-sm">
          <span className="text-kolo-muted">Vidite i:</span>
          <Link href="/uslovi" className="text-kolo-green-700 hover:underline">
            Uslove korišćenja
          </Link>
        </div>
      </div>

      <div className="space-y-8 text-sm text-kolo-text leading-relaxed text-body">

        {/* Član 1 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 1 — Rukovalac podacima
          </h2>
          <p className="mb-3">
            Rukovalac podacima o ličnosti u smislu Zakona o zaštiti podataka o ličnosti je:
          </p>
          <div className="bg-kolo-bg rounded-xl p-4 space-y-1 text-xs font-mono mb-3">
            <p><span className="text-kolo-muted">Naziv:</span> Alva Fondacija</p>
            <p><span className="text-kolo-muted">Sedište:</span> Oslobođenja 82A, 25284, Stanišić, Srbija</p>
            <p><span className="text-kolo-muted">Matični broj:</span> 28830360</p>
            <p><span className="text-kolo-muted">PIB:</span> 110186805</p>
            <p><span className="text-kolo-muted">Email:</span> privatnost@ekolo.rs</p>
          </div>
          <p className="text-kolo-muted text-xs italic">
            Fondacija je u postupku promene naziva u KOLO Fondaciju i ažuriranja podataka u APR.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 2 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 2 — Na koga se primenjuje
          </h2>
          <p className="mb-3">
            Ova politika primenjuje se na sva lica koja koriste KOLO platformu. Platforma je namenjena
            isključivo <strong>punoletnim licima</strong> (18+). Ukoliko saznamo da su podaci maloletnog
            lica prikupljeni greškom, iste ćemo bez odlaganja izbrisati.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 3 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 3 — Koje podatke prikupljamo i zašto
          </h2>

          <div className="space-y-5">
            <div>
              <p className="font-semibold mb-2">3.1 Registracija naloga</p>
              <ul className="space-y-1 text-kolo-muted list-disc list-inside">
                <li>Pseudonim — identifikacija u sistemu; osnov: izvršenje ugovora</li>
                <li>Email adresa — komunikacija i oporavak naloga; osnov: izvršenje ugovora</li>
                <li>Lozinka — čuva se isključivo u hashovanom obliku</li>
                <li>Referral kod (opciono) — evidencija preporuke; osnov: izvršenje ugovora</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">3.2 Profil korisnika (opciono)</p>
              <p className="text-kolo-muted mb-2">Korisnik može dobrovoljno popuniti:</p>
              <ul className="space-y-1 text-kolo-muted list-disc list-inside">
                <li>Lokacija, broj telefona, puno ime, profilna slika, opis — osnov: pristanak</li>
              </ul>
              <p className="text-kolo-muted mt-2 text-xs">
                Pseudonim, lokacija, opis i profilna slika vidljivi su verifikovanim korisnicima.
                Puno ime, telefon i email nisu javno vidljivi.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">3.3 Verifikacija identiteta (opciono)</p>
              <p className="text-kolo-muted mb-2">Za verifikaciju prikupljamo:</p>
              <ul className="space-y-1 text-kolo-muted list-disc list-inside">
                <li>Broj lične karte i JMBG — osnov: pristanak i zakonska obaveza (AML)</li>
                <li>Skenirana dokumenta — osnov: pristanak i zakonska obaveza</li>
              </ul>
              <p className="text-kolo-muted mt-2 text-xs">
                Verifikacioni podaci koriste se isključivo za utvrđivanje identiteta i ispunjavanje
                AML obaveza. Ne dele se sa drugim korisnicima.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">3.4 Transakcioni podaci</p>
              <p className="text-kolo-muted">
                POEN transakcije, ZRNO operacije i glasovi evidentiraju se automatski. Ovi zapisi su
                <strong className="text-kolo-text"> trajni</strong> zbog tehničke invarijante zatvorenog
                sistema (zero-sum princip) i zakonskih obaveza.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">3.5 Sadržaj poruka</p>
              <p className="text-kolo-muted">
                Sadržaj privatnih poruka dostupan je isključivo pošiljaocu i primaocu. Fondacija ne
                pristupa sadržaju poruka osim u slučaju prijave zloupotrebe ili po nalogu nadležnog organa.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">3.7 Tehnički podaci</p>
              <p className="text-kolo-muted">
                IP adresa, podaci o uređaju, vreme pristupa i neuspeli pokušaji prijave — osnov: legitimni
                interes (bezbednost platforme). Čuvaju se 12 meseci.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 4 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 4 — Javna evidencija transakcija
          </h2>
          <div className="bg-kolo-green-50 border border-kolo-green-200 rounded-xl p-4 mb-4 text-xs">
            <p className="font-semibold text-kolo-green-900 mb-1">Strukturalna karakteristika sistema</p>
            <p className="text-kolo-green-800">
              Sve POEN transakcije evidentiraju se u javnom feed-u dostupnom verifikovanim korisnicima,
              uz prikaz pseudonima, iznosa i vremena. Ovo je tehnička garancija zero-sum invarijante —
              da KOLO Banka ne stvara vrednost ex nihilo. Javna evidencija nije opciona.
            </p>
          </div>
          <p className="mb-3">
            <strong>Pravni osnov</strong> za obradu pseudonimnih transakcijskih podataka je izvršenje
            ugovora i strukturalna nužnost usluge — ne pristanak. Korisnik prihvata ovu obradu
            registracijom.
          </p>
          <p className="mb-3">
            <strong>Status pseudonimnih podataka.</strong> Pseudonim, lokacija, istorija transakcija
            i drugi atributi zadržavaju karakter ličnih podataka jer u zatvorenoj zajednici postoji
            razumna mogućnost re-identifikacije kombinovanjem dostupnih atributa.
          </p>
          <p>
            <strong>Pravo na anonimizaciju.</strong> Korisnik koji više ne želi da bude vidljiv može
            istupiti iz Platforme. Istupanje pokreće mehanizam anonimizacije: pseudonim se zamenjuje
            identifikatorom <code className="bg-kolo-bg px-1 rounded">Član-XXXXX</code>, profilni podaci
            se brišu, a numerička istorija transakcija ostaje trajno sačuvana iz zakonskih razloga.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 5 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 5 — Kolačići
          </h2>
          <p>
            Platforma koristi isključivo <strong>tehnički neophodne kolačiće</strong>: sesijski kolačić
            za prijavu (NextAuth), CSRF token i kolačić sa preferencama. Platforma ne koristi analitičke,
            marketinške niti kolačiće trećih strana.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 6 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 6 — Primaoci podataka
          </h2>
          <p className="mb-3">Vaši podaci se ne prodaju, ne iznajmljuju niti ustupaju trećim licima u komercijalne svrhe.</p>
          <p className="text-kolo-muted">
            Podaci mogu biti dostupni: hosting provajderu (DigitalOcean) za tehničko funkcionisanje;
            lokalnoj zadruzi u meri neophodnoj za upravljanje članstvom; nadležnim državnim organima
            kada je to zakonska obaveza.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 8 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 8 — Rokovi čuvanja podataka
          </h2>
          <div className="space-y-2">
            {[
              ["Podaci aktivnog naloga", "Dok nalog ostaje aktivan"],
              ["POEN transakcije, ZRNO operacije, glasovi", "Trajno (u pseudonimnom obliku)"],
              ["Verifikacioni podaci (lk, JMBG)", "Najmanje 5 godina od deaktivacije naloga"],
              ["Administrativna evidencija identitet ↔ ČlanID", "10 godina od poslednje transakcije"],
              ["Audit log admin akcija", "5 godina od nastanka"],
              ["Tehnički logovi (IP, user-agent)", "12 meseci od nastanka"],
              ["Sadržaj poruka", "Do deaktivacije naloga jedne strane ili 24 meseca od poslednje aktivnosti"],
            ].map(([sta, rok]) => (
              <div key={sta} className="flex gap-3 text-xs">
                <span className="text-kolo-text font-medium w-56 shrink-0">{sta}</span>
                <span className="text-kolo-muted">{rok}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 10 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 10 — Vaša prava
          </h2>
          <p className="mb-3">U skladu sa ZZPL imate sledeća prava:</p>
          <ol className="space-y-2 list-decimal list-inside text-kolo-muted">
            <li><strong className="text-kolo-text">Pravo na pristup</strong> — kopija vaših podataka na zahtev</li>
            <li><strong className="text-kolo-text">Pravo na ispravku</strong> — ispravljanje netačnih podataka</li>
            <li><strong className="text-kolo-text">Pravo na anonimizaciju</strong> — istupanjem iz sistema prema mehanizmu iz Člana 4</li>
            <li><strong className="text-kolo-text">Pravo na ograničenje obrade</strong> — dok se rešava prigovor</li>
            <li><strong className="text-kolo-text">Pravo na prenosivost</strong> — vaši podaci u JSON formatu</li>
            <li><strong className="text-kolo-text">Pravo na prigovor</strong> — na obradu zasnovanu na legitimnom interesu</li>
            <li><strong className="text-kolo-text">Pravo na povlačenje pristanka</strong> — za opciona profilna polja i verifikacione podatke</li>
            <li><strong className="text-kolo-text">Pravo na ljudski pregled</strong> — automatizovane odluke sistema</li>
          </ol>
          <p className="mt-4 text-kolo-muted text-xs">
            <strong>Kako ostvariti prava:</strong> Zahtev se podnosi na privatnost@ekolo.rs.
            Odgovaramo u roku od 30 dana. Pravo na pritužbu možete podneti Povereniku za informacije
            od javnog značaja i zaštitu podataka o ličnosti (www.poverenik.rs).
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 11 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 11 — Bezbednost podataka
          </h2>
          <ul className="space-y-1 text-kolo-muted list-disc list-inside">
            <li>Šifrovanje lozinki standardnim hash algoritmom</li>
            <li>Šifrovan prenos (HTTPS/TLS)</li>
            <li>Kontrola pristupa po ulogama (minimalna neophodnost)</li>
            <li>Pseudonimnost identiteta po dizajnu</li>
            <li>Atomske transakcione operacije sa zero-sum proverom</li>
            <li>Audit log admin akcija sa vremenskom oznakom</li>
          </ul>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 12 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 12 — Izmene Politike privatnosti
          </h2>
          <p>
            O izmenama koje značajno utiču na vaša prava bićete obavešteni putem emaila i notifikacije
            u Platformi, najmanje <strong>15 dana</strong> pre stupanja izmena na snagu. Pri prvom
            narednom prijavljivanju od korisnika se traži aktivna potvrda prihvatanja. Aktuelna verzija
            uvek je dostupna na Platformi.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 13 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 13 — Merodavno pravo
          </h2>
          <p>
            Ova politika uređena je pravom Republike Srbije. Za sve sporove nadležan je sud u Somboru.
          </p>
        </section>

      </div>

      <div className="mt-10 pt-6 border-t border-kolo-border flex flex-wrap gap-4 text-sm text-kolo-muted">
        <Link href="/uslovi" className="text-kolo-green-700 hover:underline">
          Uslovi korišćenja →
        </Link>
        <Link href="/" className="hover:text-kolo-green-700 transition-colors">
          Nazad na početnu
        </Link>
      </div>

    </div>
  );
}
