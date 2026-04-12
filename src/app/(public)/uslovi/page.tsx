import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Uslovi korišćenja — KOLO",
  description: "Uslovi korišćenja KOLO platforme",
};

export default function UsloviPage() {
  return (
    <div className="max-w-[800px] mx-auto pb-16">

      <div className="mb-8">
        <p className="text-xs text-kolo-muted mb-1">Pravni dokumenti</p>
        <h1 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
          Uslovi korišćenja KOLO platforme
        </h1>
        <p className="text-sm text-kolo-muted mt-2">
          Verzija 4 · Stupili na snagu: 12. april 2026.
        </p>
        <div className="mt-4 flex gap-3 text-sm">
          <span className="text-kolo-muted">Vidite i:</span>
          <Link href="/privatnost" className="text-kolo-green-700 hover:underline">
            Politiku privatnosti
          </Link>
        </div>
      </div>

      <div className="space-y-8 text-sm text-kolo-text leading-relaxed">

        {/* Član 1 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 1 — Opšte odredbe i identifikacija Fondacije
          </h2>
          <p className="mb-3">
            KOLO Platforma (u daljem tekstu: Platforma) je informacioni sistem u vlasništvu Alva Fondacije
            (u daljem tekstu: Fondacija), neprofitne organizacije registrovane u Republici Srbiji.
          </p>
          <div className="bg-kolo-bg rounded-xl p-4 space-y-1 text-xs font-mono mb-3">
            <p><span className="text-kolo-muted">Naziv:</span> Alva Fondacija</p>
            <p><span className="text-kolo-muted">Matični broj:</span> 28830360</p>
            <p><span className="text-kolo-muted">PIB:</span> 110186805</p>
            <p><span className="text-kolo-muted">Sedište:</span> Stanišić, Oslobođenja 82A</p>
            <p><span className="text-kolo-muted">Email:</span> info@kolo.rs</p>
            <p><span className="text-kolo-muted">Zaštita podataka:</span> privatnost@kolo.rs</p>
            <p><span className="text-kolo-muted">Prijave nezakonitog sadržaja:</span> prijave@kolo.rs</p>
          </div>
          <p className="text-kolo-muted text-xs italic mb-3">
            Fondacija je u postupku promene naziva u KOLO Fondaciju i ažuriranja podataka u APR.
          </p>
          <p className="mb-3">
            Ovi Uslovi korišćenja uređuju prava i obaveze između Fondacije i svakog lica koje pristupa
            ili koristi Platformu (u daljem tekstu: Korisnik).
          </p>
          <p className="mb-3">
            Platforma je sistem evidencije doprinosa i upravljačka infrastruktura KOLO mreže, uređena
            Pravilnikom o KOLO sistemu. Platforma <strong>nije</strong> platni sistem, platna institucija,
            banka, berza niti investiciona platforma.
          </p>
          <p>
            <strong>Prihvatanje Uslova.</strong> Korišćenjem Platforme Korisnik potvrđuje da je pročitao,
            razumeo i prihvatio ove Uslove, Politiku privatnosti i Pravilnik u celosti.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 2 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 2 — Zaključenje, trajanje i prestanak ugovora
          </h2>
          <p className="mb-3">
            <strong>Zaključenje.</strong> Ugovorni odnos nastaje u trenutku uspešne registracije,
            koja obuhvata: (a) popunjavanje obaveznih podataka, (b) izričito prihvatanje ovih Uslova,
            Politike privatnosti i Pravilnika, i (c) potvrdu email adrese.
          </p>
          <p className="mb-3">
            <strong>Trajanje.</strong> Ugovor se zaključuje na neodređeno vreme.
          </p>
          <p>
            <strong>Prestanak.</strong> Ugovor prestaje dobrovoljnim istupanjem, isključenjem Korisnika
            ili prestankom postojanja Platforme ili Fondacije.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 3 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 3 — Beta faza i izmene Uslova
          </h2>
          <p className="mb-3">
            <strong>Beta faza.</strong> Platforma se nalazi u fazi razvoja. Pojedine funkcionalnosti
            predviđene Pravilnikom, uključujući lokalne zadruge sa pravnim subjektivitetom, Programe
            Podrške i aktivno Gornje Kolo, u ovoj fazi su neaktivne ili ograničeno dostupne.
          </p>
          <p>
            <strong>Izmene Uslova.</strong> Fondacija zadržava pravo da izmeni ove Uslove uz obaveštenje
            najmanje <strong>15 dana</strong> pre stupanja izmena na snagu. Pri prvom narednom prijavljivanju
            od Korisnika se traži aktivna potvrda prihvatanja nove verzije.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 4 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 4 — Registracija i nalog
          </h2>
          <ul className="space-y-2 mb-3">
            <li className="flex gap-2"><span className="text-kolo-muted shrink-0">4.1</span>
              <span>Registracija je dostupna punoletnim licima (18+) sa važećom email adresom koja prihvataju ove Uslove.</span>
            </li>
            <li className="flex gap-2"><span className="text-kolo-muted shrink-0">4.2</span>
              <span>Svako fizičko lice može imati isključivo jedan korisnički nalog.</span>
            </li>
            <li className="flex gap-2"><span className="text-kolo-muted shrink-0">4.3</span>
              <span>Korisnik je odgovoran za tačnost unetih podataka i dužan da ih ažurira u roku od 15 dana od promene.</span>
            </li>
            <li className="flex gap-2"><span className="text-kolo-muted shrink-0">4.4</span>
              <span>Korisnik je odgovoran za čuvanje poverljivosti svojih pristupnih podataka.</span>
            </li>
            <li className="flex gap-2"><span className="text-kolo-muted shrink-0">4.5</span>
              <span>Korisnički nalog je lični i ne može se prenositi niti deliti.</span>
            </li>
            <li className="flex gap-2"><span className="text-kolo-muted shrink-0">4.6</span>
              <span>Pseudonim mora biti jedinstven i može se menjati najviše jednom u 30 dana.</span>
            </li>
          </ul>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 5 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 5 — Pravna priroda POENA i ZRNA
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-xs">
            <p className="font-semibold text-amber-900 mb-1">Važno upozorenje</p>
            <p className="text-amber-800">
              POEN i ZRNO nisu novac, elektronski novac, kriptovaluta, hartija od vrednosti niti investicija.
              Ne postoji konverzija POENA u dinare ni u kakvim okolnostima. Platforma se pruža besplatno
              i ne naplaćuje nikakvu novčanu naknadu.
            </p>
          </div>
          <p className="mb-3">
            <strong>POEN</strong> je interna jedinica evidencije doprinosa u KOLO sistemu — izraz zahvalnosti
            sistema i pravo na buduće primanje dobara i usluga unutar mreže. Referentna vrednost 1 POEN ≈ 1 RSD
            je isključivo orijentir bez pravnog dejstva i bez garancije.
          </p>
          <p className="mb-3">
            <strong>ZRNO</strong> je upravljačka jedinica koja nosiocu daje pravo učešća u odlučivanju u okviru
            Gornjeg Kola. ZRNO nije prenosivo između Korisnika — sticanje i prodaja vrše se isključivo od i
            prema KOLO Banci. Fiksna emisija iznosi tačno 1.000.000 ZRNA.
          </p>
          <p>
            <strong>KOLO Banka</strong> je softverski protokol koji automatski emituje POEN jedinice prema
            algoritmima definisanim Pravilnikom. KOLO Banka nije pravno lice i ne stupa u pravne odnose
            sa Korisnicima.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 6 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 6 — Verifikacija identiteta
          </h2>
          <p className="mb-3">
            Verifikacija identiteta je opciona. Korisnik koji se ne verifikuje može koristiti Platformu
            sa ograničenim skupom funkcionalnosti.
          </p>
          <p>
            Verifikacijom Korisnik stiče: bonus od 1.000 POENA, pristup sistemu preporuka, pravo na
            donacije, pravo na sticanje ZRNA, učešće u Programu Zapošljavanje, pun uvid u pseudonime
            i transakcije, te pristup komunikaciji i pijaci.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 7 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 7 — Gradirana vidljivost podataka
          </h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-1">Eksterni posetilac (neregistrovan)</p>
              <p className="text-kolo-muted">
                Vidi javnu prezentaciju, sistemske agregate, rang-listu pokrovitelja i pijacu na nivou oglasa
                — bez pseudonima i bez mogućnosti kontakta.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Neverifikovan prijavljen korisnik</p>
              <p className="text-kolo-muted">
                Vidi agregatni feed transakcija bez identifikatora strana, sopstvenu istoriju, podatke o
                zadrugama i sistemske agregate. Ne vidi pseudonime u tuđim transakcijama, profile korisnika
                niti identitete prodavaca. Ne može slati poruke niti kupovati na pijaci.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Verifikovan korisnik</p>
              <p className="text-kolo-muted">
                Ima pun uvid u pseudonime, transakcije, profile, rang-liste, punu funkcionalnost pijace
                i sistema poruka.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 8 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 8 — Pravila korišćenja i zabranjene aktivnosti
          </h2>
          <p className="mb-3">Korisniku je zabranjeno da:</p>
          <ol className="space-y-1 list-decimal list-inside text-kolo-muted">
            <li>registruje više naloga ili se registruje lažnim identitetom,</li>
            <li>vrši fiktivne transakcije u svrhu veštačkog generisanja POENA,</li>
            <li>lažno evidentira angažovanje u Programima Banke,</li>
            <li>koristi Platformu za pranje novca, prevaru ili drugu nezakonitu aktivnost,</li>
            <li>zloupotrebljava lične podatke drugih Korisnika,</li>
            <li>pokušava da neovlašćeno pristupi tuđim nalozima,</li>
            <li>koristi automatizovane alate bez pisanog odobrenja Fondacije,</li>
            <li>zaključuje aranžmane van Platforme čiji je predmet prenos POENA uz novčanu nadoknadu.</li>
          </ol>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 9 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 9 — Pijaca i transakcije između korisnika
          </h2>
          <p>
            Transakcije na Pijaci zaključuju se isključivo između Korisnika. Fondacija nije strana u tim
            transakcijama, ne jemči za njihovo ispunjenje niti za kvalitet dobara i usluga. Rizik neispunjenja
            snose Korisnici kao strane u transakciji.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 10 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 10 — Dostupnost i izmene Platforme
          </h2>
          <p>
            Platforma se pruža u stanju u kakvom je. Fondacija ne garantuje neprekidnu dostupnost i
            zadržava pravo da u bilo kom trenutku izmeni, ograniči ili obustavi rad Platforme ili njenih
            funkcionalnosti. Fondacija ne odgovara za štetu nastalu usled tehničkih prekida, osim u
            slučaju namere ili grube nepažnje.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 11 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 11 — Ograničenje odgovornosti
          </h2>
          <p className="mb-3">Fondacija ne odgovara za:</p>
          <ul className="space-y-1 list-disc list-inside text-kolo-muted mb-3">
            <li>vrednost POENA — ne postoji garancija dostupnosti robe ili usluga,</li>
            <li>promene kursa ZRNA koje proističu iz deterministicke formule,</li>
            <li>transakcije između Korisnika,</li>
            <li>štetu nastalu usled tehničkih smetnji,</li>
            <li>odluke regulatornih organa,</li>
            <li>posledice koje nastanu ako Korisnik sam otkrije sopstveni identitet.</li>
          </ul>
          <p className="text-kolo-muted text-xs">
            Korisnik izričito prihvata da se u odnosu sa Fondacijom ne smatra potrošačem u smislu Zakona
            o zaštiti potrošača, s obzirom da Platforma ne naplaćuje nikakvu novčanu naknadu.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 12 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 12 — Prestanak članstva i anonimizacija
          </h2>
          <p className="mb-3">
            <strong>Dobrovoljno istupanje.</strong> Korisnik može u svakom trenutku deaktivirati nalog.
            Pre deaktivacije može preneti POENE i prodati ZRNA. Eventualni POENI koji ostanu vraćaju se
            Banci. Deaktivacija pokreće mehanizam anonimizacije.
          </p>
          <p className="mb-3">
            <strong>Mehanizam anonimizacije.</strong> Deaktivacijom se: pseudonim, profilna slika, kontakt
            i drugi identifikacioni podaci trajno uklanjaju; Korisnik se u svim transakcijskim zapisima
            zamenjuje neutralnim identifikatorom formata <code className="bg-kolo-bg px-1 rounded">Član-XXXXX</code>;
            numerička istorija transakcija ostaje trajno sačuvana iz zakonskih razloga.
          </p>
          <p>
            <strong>Suspenzija i isključenje.</strong> Fondacija može privremeno suspendovati nalog
            (max 30 dana) ili trajno isključiti Korisnika zbog teže povrede Uslova ili Pravilnika.
            Korisnik ima pravo na izjašnjenje i žalbu.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Član 13 */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 13 — Rešavanje sporova
          </h2>
          <p className="mb-3">
            Sporovi se rešavaju kroz interni postupak. Fondacija odgovara u roku od <strong>30 dana</strong>.
            Žalba se može podneti u roku od <strong>15 dana</strong> od prijema odluke.
          </p>
          <p>
            Za sve sporove nadležan je <strong>sud u Somboru</strong>, osim ako prinudni propisi ne
            određuju drugačije.
          </p>
        </section>

        <hr className="border-kolo-border" />

        {/* Završne odredbe */}
        <section>
          <h2 className="text-base font-bold text-kolo-green-900 mb-3">
            Član 14–15 — Intelektualna svojina i završne odredbe
          </h2>
          <p className="mb-3">
            Svi elementi Platforme — softver, dizajn, naziv, logotip i dokumentacija — vlasništvo su
            Fondacije ili se koriste na osnovu odgovarajuće licence. Korisnik nema pravo da ih kopira,
            distribuira niti modifikuje bez pisanog odobrenja Fondacije.
          </p>
          <p>
            Ovi Uslovi uređeni su pravom Republike Srbije i sačinjeni su na srpskom jeziku.
            Ako se bilo koja odredba utvrdi kao ništava, preostale ostaju na snazi.
          </p>
        </section>

      </div>

      <div className="mt-10 pt-6 border-t border-kolo-border flex flex-wrap gap-4 text-sm text-kolo-muted">
        <Link href="/privatnost" className="text-kolo-green-700 hover:underline">
          Politika privatnosti →
        </Link>
        <Link href="/" className="hover:text-kolo-green-700 transition-colors">
          Nazad na početnu
        </Link>
      </div>

    </div>
  );
}
