"use client";

import { useState, useEffect, useRef } from "react";
import { intlTag } from "@/lib/format";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Pseudonim from "@/components/Pseudonim";
import UspehKartica from "@/components/UspehKartica";
import { profilHref } from "@/lib/profil-link";
import { jeNadoknada, iznosNadoknade, raspolozivo } from "@/lib/protokol/nadoknada";

/**
 * Spisak ljudi čiji se prvi doprinos čeka, uz zabeleženu potvrdu odnosno nadzor.
 *
 * Namerno LINKOVI na profil, a ne goli tekst: podsetiti čoveka znači otići kod njega,
 * pa put do njega mora biti jedan klik — inače spisak samo imenuje problem. Adresa ide
 * kroz `profilHref` (u interfejsu pseudonim, interni id u svemu što se čuva).
 *
 * 🔴 Ne prikazuje ni iznos po čoveku ni datum potvrde. Iznos stoji jednom, u redu
 * iznad: po vezi je uvek isti (1.000 odn. 500), pa bi ponovljen uz svako ime samo
 * sugerisao da se o njemu pregovara. Spisak odgovara na jedno pitanje — koga podsetiti.
 */
function SpisakCekanja({ ljudi }: { ljudi: { id: string; pseudonim: string }[] }) {
  if (ljudi.length === 0) return null;
  return (
    <ul className="mt-1.5 flex flex-wrap gap-1.5">
      {ljudi.map((o) => (
        <li key={o.id}>
          <Link
            href={profilHref({ id: o.id, pseudonim: o.pseudonim })}
            className="inline-block rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-sm text-amber-900 hover:bg-amber-100"
          >
            @<Pseudonim>{o.pseudonim}</Pseudonim>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// qrcode.react se deli sa html5-qrcode u isti veliki chunk (~361KB). Učitava se
// LENJO — QR se prikazuje tek kad korisnik otvori karticu za upis POEN-a, pa ne
// opterećuje početni bundle Novčanika.
const QRCodeSVG = dynamic(() => import("qrcode.react").then((m) => m.QRCodeSVG), {
  ssr: false,
});

// Skener kamere (html5-qrcode ~200KB) — učitava se LENJO, tek kad kupac otvori
// skener za plaćanje. Deli isti chunk sa skenerom u verifikaciji.
const QrSkener = dynamic(() => import("@/components/verifikacija/QrSkener"), {
  ssr: false,
});

interface Props {
  /**
   * Maloletni nalog. Menja se SAMO objašnjenje uz minus.
   *
   * 🔴 Zatečeni tekst govori o poništenoj potvrdi i o prijavi razmene — dva
   * instituta koja dete nikad nije dodirnulo. Kod deteta minus nastaje iz
   * raskinutog prijateljstva (čl. 14c) ili sa osamnaestim rođendanom (čl. 19),
   * pa dete koje se posvađalo sa drugaricom čita pasus o postupku Fondacije.
   * Iznos, računica i pravni režim minusa ostaju isti — menja se rečenica.
   */
  maloletan?: boolean;
  balance: number;
  pseudonim: string;
  memberHash: string;
  platiPseudonim?: string;
  prefillIznos?: string;
  prefillOpis?: string;
  /** Doprinos sadržaju koji čeka okidač (0 = nema). Nikad se ne sabira sa stanjem. */
  zabelezenDoprinos?: number;
  /** POEN po potvrdama koji čeka prvi doprinos — tvoj (dokaz stvarnosti čl. 7). */
  zabelezenePotvrdeMoje?: number;
  /** POEN po potvrdama koje si dao — čeka TUĐI prvi doprinos. */
  zabelezenePotvrdeTudje?: number;
  /** POEN za obavljen nadzor — takođe čeka tuđi prvi doprinos (čl. 7 st. 2). */
  zabelezenePotvrdeNadzor?: number;
  /**
   * Ljudi čiji se prvi doprinos čeka. Iznos sam po sebi ne kaže vlasniku naloga šta
   * može da uradi: taj POEN otključava TUĐI potez, pa je jedina radnja koja mu stoji
   * na raspolaganju da podseti baš tog čoveka.
   *
   * 🔴 Ne otvara nijedan nov podatak — ista imena već stoje na stranici Potvrde
   * odnosno Nadzor; vidi ih isključivo vlasnik naloga (čl. 67).
   */
  cekamPotvrdjene?: { id: string; pseudonim: string }[];
  cekamNadzorom?: { id: string; pseudonim: string }[];
  /** Rezervisano za kolektivnu nabavku. Nula = reda nema (odluka vlasnika). */
  rezervisanoNabavka?: number;
  /** Neverifikovani sme samo da prima — dugme za upis mu se ne prikazuje. */
  smeDaSalje?: boolean;
  /**
   * Zašto dugmeta nema. Detetu se NE sme reći „otvara se po potvrdi": ono potvrdu
   * ne dobija do punoletstva (čl. 15), pa bi ga uputstvo slalo u prazno. Njegov
   * uslov je da roditelj preuzme nalog.
   */
  razlogZabrane?: "neverifikovan" | "ceka_roditelja";
}

export default function NovcanikKartice({ balance, pseudonim, memberHash, platiPseudonim, prefillIznos, prefillOpis, zabelezenDoprinos = 0, zabelezenePotvrdeMoje = 0, zabelezenePotvrdeTudje = 0, zabelezenePotvrdeNadzor = 0, cekamPotvrdjene = [], cekamNadzorom = [], rezervisanoNabavka = 0, smeDaSalje = true, razlogZabrane = "neverifikovan", maloletan = false }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("novcanik");
  const tc = useTranslations("common");
  // Nadoknada po poništenju lažne verifikacije (dokaz stvarnosti čl. 20b). Negativan
  // zapis JESTE nadoknada — nema zasebne kolone. Prikazuje se kao zaseban red, a ne
  // kao „minus stanje", jer nije dug i ne može se naplatiti.
  const uNadoknadi = jeNadoknada(balance);

  // Sme li nalog da prepiše POEN drugome. Spaja dva razloga zabrane koja su se do
  // sada proveravala odvojeno: tip naloga (čl. 28 st. 2, odn. čl. 14 Pravilnika o
  // učešću dece) i nepokriven zapis (nadoknada po čl. 20b).
  //
  // 🔴 Obrazac za prepis se NE otvara nalogu koji ne sme da prepisuje. Do ove izmene
  // ga je `?plati=` (skeniran QR ili link iz oglasa) otvarao bez obzira na dozvolu,
  // pa je nov član popunjavao ceo obrazac i tek pri slanju dobijao 403 sa
  // `/api/transfer`. Ista provera stoji i nad skenerom, koji vodi pravo u taj obrazac.
  const smeDaPrepisuje = smeDaSalje && !uNadoknadi;

  const [showSend, setShowSend] = useState(smeDaPrepisuje && !!platiPseudonim);
  const [showQR, setShowQR] = useState(false);
  const [showSkener, setShowSkener] = useState(false);
  // Razlaganje zabeleženog doprinosa po stavkama — zatvoreno dok se ne zatraži.
  const [showStavke, setShowStavke] = useState(false);

  // Zabeleženo se na ekranu sabira u JEDAN broj, a razlaže po tome NA KOGA SE ČEKA.
  // Kanal (oglas, putanja razmene, potvrda, nadzor) je podatak o poreklu; vlasnika
  // naloga zanima čiji se potez čeka, jer samo to kaže šta on može da uradi.
  const cekaFondaciju = zabelezenDoprinos;
  const cekaTebe = zabelezenePotvrdeMoje;
  const cekaDruge = zabelezenePotvrdeTudje + zabelezenePotvrdeNadzor;
  const zabelezenoUkupno = cekaFondaciju + cekaTebe + cekaDruge;

  return (
    <>
      {/* Gornja kartica: balans POEN (ZRNO kartica privremeno uklonjena) */}
      <div>
        {/* Balans kartica: dugmad levo (jedno ispod drugog), stanje veliko desno.

            🔴 Ko ne sme da prepisuje NE dobija novčanik-vizual. Zelena kartica, broj
            preko pola visine kartice, oznaka jedinice ispod njega i dugmad za plaćanje
            pored — to je vizuelni jezik platne kartice i obećava raspolaganje koje
            pravilo ne daje, pa odsustvo dugmeta „Prepiši POEN" izgleda kao kvar. Takvom nalogu
            kartica pokazuje ono što veliki broj i inače znači — koliko SME da prepiše,
            dakle nulu — a koliko mu je stvarno evidentirano stoji u redu „Na tvom
            zapisu" odmah ispod. To nije nov obrazac: `raspolozivo()` isto tako već
            pokazuje nulu zapisu u nadoknadi, a pravi iznos nosi zaseban red.

            🟢 „Moj QR" OSTAJE i takvom nalogu, i to namerno: nov član sme da PRIMA
            (čl. 28 st. 2), a QR je način da mu se prepiše POEN za prodato dobro. To mu
            je ujedno i put do potvrde (čl. 40a), pa bi sklanjanje tog dugmeta zatvorilo
            ulaz kroz Pijacu. Skener se sklanja jer vodi u suprotnom smeru — u obrazac
            za prepis DRUGOME. */}
        <div
          className={
            smeDaSalje
              ? "bg-gradient-to-br from-kolo-green-700 to-kolo-green-500 rounded-2xl p-6 text-white shadow-lg"
              : "rounded-2xl border border-kolo-border bg-white p-6"
          }
        >
          <div className="flex items-center justify-between gap-4">
            {/* LEVO — dugmad jedno ispod drugog */}
            <div className="flex flex-col gap-3 shrink-0">
              {smeDaPrepisuje && (
                <button
                  onClick={() => setShowSend(true)}
                  className="px-5 py-2 bg-white text-kolo-green-700 text-sm font-semibold rounded-xl hover:bg-kolo-green-100 transition-colors"
                >
                  {t("posalji_poen")}
                </button>
              )}
              {/* Skener otvara obrazac za prepis, pa ga ne vidi ko ne sme da prepisuje. */}
              {smeDaPrepisuje && (
                <button
                  onClick={() => setShowSkener(true)}
                  className="px-5 py-2 bg-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-colors border border-white/30"
                >
                  {t("skeniraj_dugme")}
                </button>
              )}
              <button
                onClick={() => setShowQR(true)}
                className={
                  smeDaSalje
                    ? "px-5 py-2 bg-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-colors border border-white/30"
                    : "px-5 py-2 bg-kolo-green-50 text-kolo-green-700 text-sm font-semibold rounded-xl hover:bg-kolo-green-100 transition-colors border border-kolo-border"
                }
              >
                {t("moj_qr")}
              </button>
            </div>

            {/* DESNO — stanje veliko */}
            <div className="text-right min-w-0">
              <p
                className={`text-4xl sm:text-5xl font-bold tracking-tight tabular-nums break-words${
                  smeDaSalje ? "" : " text-kolo-text"
                }`}
              >
                {(smeDaSalje ? raspolozivo(balance) : 0).toLocaleString(intlTag(locale))}
              </p>
              <p className={smeDaSalje ? "text-lg text-white/70 mt-0.5" : "text-lg text-kolo-muted mt-0.5"}>
                {tc("poen")}
              </p>
              {/* Bez ove oznake veliki broj se i dalje čita kao „stanje računa". */}
              {!smeDaSalje && (
                <p className="text-sm text-kolo-muted mt-0.5">{t("raspolozivo_labela")}</p>
              )}
            </div>
          </div>

          {/* Objašnjenje stoji UZ broj, u istoj kartici. Do ove izmene je stajalo ispod
              svih redova, pa se na dužem ekranu nije videlo u istom pogledu sa brojem
              koji objašnjava — a bez njega nula izgleda kao da je nešto nestalo. */}
          {!smeDaSalje && (
            <p className="mt-4 text-sm text-kolo-muted">
              {razlogZabrane === "ceka_roditelja" ? t("ceka_roditelja") : t("samo_primalac")}
            </p>
          )}
        </div>

        {/* Forma za prepis POEN-a stoji ODMAH ispod kartice sa stanjem, a iznad
            redova sa zabeleženim doprinosom i potvrdama. Razlog je redosled
            radnje: dugme je na kartici, pa obrazac mora da se otvori uz njega —
            ranije je stajao ispod svih zabeleženih redova, pa se na dužem ekranu
            klik nije video i delovalo je kao da dugme ne radi. Redovi ispod su
            stanje koje se čita, obrazac je radnja koja se izvodi. */}
        {showSend && (
          <div className="mt-3">
            <SendForma
              onClose={() => setShowSend(false)}
              onSuccess={() => { setShowSend(false); window.dispatchEvent(new Event("balans-updated")); router.refresh(); }}
              initialPseudonim={platiPseudonim}
              initialIznos={prefillIznos}
              initialOpis={prefillOpis}
            />
          </div>
        )}

        {/* Nadoknada (čl. 20b) stoji ISPOD kartice, kao zaseban red. Nije prikazana
            kao negativno stanje jer nije dug: Fondacija po njoj nema potraživanje i
            ne može je naplatiti. Razmena dobara i usluga se njome ne ograničava —
            ograničen je samo upis POENA drugome, dok zapis ne pređe nulu. */}
        {uNadoknadi && (
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-amber-900">{t(maloletan ? "nadoknada_naslov_dete" : "nadoknada_naslov")}</p>
              <p className="text-lg font-bold tabular-nums text-amber-800">
                {iznosNadoknade(balance).toLocaleString(intlTag(locale))} {tc("poen")}
              </p>
            </div>
            <p className="text-sm text-amber-800/80 mt-1">{t(maloletan ? "nadoknada_opis_dete" : "nadoknada_opis")}</p>
          </div>
        )}

        {/* Na tvom zapisu — POEN koji nalog STVARNO ima, ali njime još ne sme da
            raspolaže (čl. 28 st. 2 za nov član, čl. 14 Pravilnika o učešću dece za
            dete koje čeka roditelja). Veliki broj iznad pokazuje raspoloživo za
            prepis, dakle nulu; bez ovog reda bi čovek koji je nešto prodao na Pijaci
            pomislio da mu je prodaja nestala. Zapis JESTE njegov i zbir u sistemu ga
            broji — čeka se samo pravo raspolaganja, koje dolazi sa potvrdom.

            🔴 Ovo NIJE isto što i zabeleženo ispod: ovde je POEN upisan u Protokol,
            tamo zapis još ne postoji (čl. 40a st. 3). Dva reda se ne spajaju. */}
        {!smeDaSalje && raspolozivo(balance) > 0 && (
          <div className="mt-3 rounded-2xl border border-kolo-border bg-white px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-kolo-text">{t("na_zapisu_naslov")}</p>
              <p className="text-lg font-bold tabular-nums text-kolo-green-700">
                {raspolozivo(balance).toLocaleString(intlTag(locale))} {tc("poen")}
              </p>
            </div>
            <p className="text-sm text-kolo-muted mt-1">
              {t(razlogZabrane === "ceka_roditelja" ? "na_zapisu_opis_dete" : "na_zapisu_opis")}
            </p>
          </div>
        )}

        {/* Zabeležen doprinos — JEDAN broj za sve što čeka uslov, sa razlaganjem na
            klik. Do ove izmene je to bilo pet redova sa skoro istim naslovima
            (doprinos po čl. 40a, koraci putanje razmene, potvrde primljene, potvrde
            date, nadzor), pa se iz ekrana nije video odgovor na jedino pitanje koje
            vlasnika naloga zanima: šta treba da se desi da se ovo upiše.

            🔴 Razlaganje ide po tome NA KOGA SE ČEKA, ne po kanalu. Kanal je podatak o
            poreklu; čeka se uvek nečiji potez — Fondacijin, sopstveni ili tuđi — i samo
            to kaže čoveku šta može da uradi. Po kanalu poređani redovi su to skrivali:
            „potvrde koje si dao" i „nadzor" čekaju treća lica i on tu ne može ništa
            osim da ih podseti, a „prvi oglas" čeka UO.

            🔴 Nikad se ne sabira sa stanjem: do okidača to nije zapis POEN-a (čl. 40a
            st. 3). Naziv je „Zabeležen doprinos", nikad „POEN na čekanju" — POEN
            postoji isključivo kao zapis u Protokolu (čl. 12), a to pravilo čuva
            `potvrda-uslov-izvor.test.ts`.

            🔴 Rezervisano za nabavku NIJE ovde i ne sme da se doda: taj POEN je već
            upisan u zapis, samo je vezan do preuzimanja (čl. 23 st. 2) — drugi institut
            i drugi ishod. */}
        {zabelezenoUkupno > 0 && (
          <div className="mt-3 rounded-2xl border border-kolo-border bg-white px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-kolo-text">{t("zabelezen_naslov")}</p>
              <p className="text-lg font-bold tabular-nums text-kolo-green-700">
                {zabelezenoUkupno.toLocaleString(intlTag(locale))} {tc("poen")}
              </p>
            </div>
            <p className="text-sm text-kolo-muted mt-1">{t("zabelezen_opis")}</p>

            <button
              type="button"
              onClick={() => setShowStavke((v) => !v)}
              aria-expanded={showStavke}
              className="mt-2 text-sm font-semibold text-kolo-green-700 hover:underline"
            >
              {showStavke ? t("zabelezen_sakrij") : t("zabelezen_stavke")}
            </button>

            {showStavke && (
              <div className="mt-3 space-y-3 border-t border-kolo-border pt-3">
                {cekaFondaciju > 0 && (
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-semibold text-kolo-text">{t("ceka_fondaciju")}</p>
                      <p className="text-sm font-bold tabular-nums text-kolo-text">
                        {cekaFondaciju.toLocaleString(intlTag(locale))} {tc("poen")}
                      </p>
                    </div>
                    <p className="text-sm text-kolo-muted mt-1">{t("ceka_fondaciju_opis")}</p>
                  </div>
                )}

                {cekaTebe > 0 && (
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-semibold text-kolo-text">{t("ceka_tebe")}</p>
                      <p className="text-sm font-bold tabular-nums text-kolo-text">
                        {cekaTebe.toLocaleString(intlTag(locale))} {tc("poen")}
                      </p>
                    </div>
                    <p className="text-sm text-kolo-muted mt-1">
                      {t("zabelezene_potvrde_moje", {
                        iznos: cekaTebe.toLocaleString(intlTag(locale)),
                      })}
                    </p>
                  </div>
                )}

                {cekaDruge > 0 && (
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-semibold text-kolo-text">{t("ceka_druge")}</p>
                      <p className="text-sm font-bold tabular-nums text-kolo-text">
                        {cekaDruge.toLocaleString(intlTag(locale))} {tc("poen")}
                      </p>
                    </div>
                    {zabelezenePotvrdeTudje > 0 && (
                      <div className="mt-1">
                        <p className="text-sm text-kolo-muted">
                          {t("zabelezene_potvrde_tudje", {
                            iznos: zabelezenePotvrdeTudje.toLocaleString(intlTag(locale)),
                          })}
                        </p>
                        <SpisakCekanja ljudi={cekamPotvrdjene} />
                      </div>
                    )}
                    {zabelezenePotvrdeNadzor > 0 && (
                      <div className="mt-1">
                        <p className="text-sm text-kolo-muted">
                          {t("zabelezene_potvrde_nadzor", {
                            iznos: zabelezenePotvrdeNadzor.toLocaleString(intlTag(locale)),
                          })}
                        </p>
                        <SpisakCekanja ljudi={cekamNadzorom} />
                      </div>
                    )}
                  </div>
                )}

                {/* Mehanizam potvrda objašnjen JEDNOM, na kraju: uslov je isti za „čeka
                    tebe" i za „čeka druge", samo se meri na različitom čoveku. Naslov
                    je uvodna reč te rečenice — oba ključa traži
                    `potvrda-uslov-izvor.test.ts` i ne smeju da nestanu iz copy-ja. */}
                {(cekaTebe > 0 || cekaDruge > 0) && (
                  <p className="text-sm text-kolo-muted border-t border-kolo-border pt-3">
                    <span className="font-semibold text-kolo-text">
                      {t("zabelezene_potvrde_naslov")}
                    </span>
                    {" — "}
                    {t("zabelezene_potvrde_opis")}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Rezervisano za kolektivnu nabavku (Pravilnik o projektima i kolektivnim
            nabavkama čl. 23 st. 2). Zaseban red, NIKAD sabran sa stanjem — isti
            razlog kao zabeležen doprinos. Red se prikazuje samo kad rezervacija
            postoji; do preuzimanja POEN nije poništen (čl. 27 st. 3). */}
        {rezervisanoNabavka > 0 && (
          <div className="mt-3 rounded-2xl border border-kolo-border bg-white px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-kolo-text">{t("rezervisano_nabavka")}</p>
              <p className="text-lg font-bold tabular-nums text-kolo-green-700">
                {rezervisanoNabavka.toLocaleString(intlTag(locale))} {tc("poen")}
              </p>
            </div>
            <p className="text-sm text-kolo-muted mt-1">{t("rezervisano_nabavka_opis")}</p>
          </div>
        )}

      </div>

      {/* QR modal */}
      {showQR && (
        <QRModal pseudonim={pseudonim} memberHash={memberHash} onClose={() => setShowQR(false)} />
      )}

      {/* Skener za plaćanje (kupac skenira QR prodavca) */}
      {showSkener && (
        <SkenerModal onClose={() => setShowSkener(false)} />
      )}
    </>
  );
}

// ── Skener modal (kupac skenira QR prodavca i plaća) ──────────────────────────

function SkenerModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("novcanik");
  const router = useRouter();
  const [greska, setGreska] = useState("");

  function handleDetektovan(tekst: string) {
    setGreska("");
    // QR prodavca kodira URL: .../m/<hash>?amount=..&opis=..  ili
    // .../novcanik?plati=<pseudonim>&iznos=..&description=..
    // Kupac skenira → vodimo ga kroz isti tok plaćanja (formu za upis POEN-a).
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://ekolo.rs";
    let putanja: string | null = null;
    try {
      const url = new URL(tekst.trim(), baseUrl);
      if (url.pathname.startsWith("/m/") || url.pathname.startsWith("/novcanik")) {
        putanja = url.pathname + url.search;
      }
    } catch {
      // nije validan URL
    }
    if (!putanja) {
      setGreska(t("skener_greska_qr"));
      return;
    }
    onClose();
    router.push(putanja);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-kolo-text">{t("skener_naslov")}</h3>
          <button onClick={onClose} className="text-kolo-muted hover:text-kolo-text text-xl leading-none">×</button>
        </div>
        <p className="text-sm text-kolo-muted">{t("skener_opis")}</p>
        {greska && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>
        )}
        <QrSkener
          onDetektovan={handleDetektovan}
          onZatvori={onClose}
          uputstvo={t("skener_uputstvo")}
        />
      </div>
    </div>
  );
}

// ── Forma za upis POEN-a ──────────────────────────────────────────────────────

function SendForma({ onClose, onSuccess, initialPseudonim, initialIznos, initialOpis }: { onClose: () => void; onSuccess: () => void; initialPseudonim?: string; initialIznos?: string; initialOpis?: string }) {
  const locale = useLocale();
  const t = useTranslations("novcanik");
  const tc = useTranslations("common");
  const [pseudonim, setPseudonim] = useState(initialPseudonim ?? "");
  const [amount, setAmount] = useState(initialIznos ?? "");
  const [description, setDescription] = useState(initialOpis ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sugestije, setSugestije] = useState<string[]>([]);
  const [showSugestije, setShowSugestije] = useState(false);
  const [aktivniIndex, setAktivniIndex] = useState(-1);
  const [uspeh, setUspeh] = useState<{ iznos: number; pseudonim: string; naCekanju: boolean } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSugestije(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handlePseudonimChange(val: string) {
    setPseudonim(val);
    setShowSugestije(true);
    setAktivniIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setSugestije([]); return; }
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/korisnici/pretraga?q=${encodeURIComponent(val.trim())}`);
      const data = await res.json();
      setSugestije((data as { pseudonim: string }[]).map((u) => u.pseudonim));
    }, 250);
  }

  function odaberi(ps: string) {
    setPseudonim(ps);
    setSugestije([]);
    setShowSugestije(false);
    setAktivniIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSugestije || sugestije.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const novi = Math.min(aktivniIndex + 1, sugestije.length - 1);
      setAktivniIndex(novi);
      listaRef.current?.children[novi]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const novi = Math.max(aktivniIndex - 1, 0);
      setAktivniIndex(novi);
      listaRef.current?.children[novi]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (aktivniIndex >= 0 && aktivniIndex < sugestije.length) {
        e.preventDefault();
        odaberi(sugestije[aktivniIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSugestije(false);
      setAktivniIndex(-1);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!pseudonim.trim()) { setError(t("send_greska_pseudonim")); return; }
    const iznos = parseInt(amount, 10);
    if (!amount || isNaN(iznos) || iznos <= 0) { setError(t("send_greska_iznos")); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudonim: pseudonim.trim(), amount: iznos, description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? t("send_greska")); return; }
      // Prepis iz dečjeg zapisa iznad praga se NE izvršava odmah nego čeka roditelja
      // (Pravilnik o učešću dece, čl. 14). Ekran to mora da kaže — inače dete vidi
      // „prepisano" a POEN se nije pomerio.
      setUspeh({ iznos, pseudonim: pseudonim.trim(), naCekanju: data?.naCekanju === true });
    } catch {
      setError(t("send_greska"));
    } finally {
      setLoading(false);
    }
  }

  if (uspeh) {
    return (
      <UspehKartica
        naslov={uspeh.naCekanju ? t("send_ceka_naslov") : t("send_uspeh_naslov")}
        opis={t(uspeh.naCekanju ? "send_ceka_opis" : "send_uspeh_opis", {
          iznos: uspeh.iznos.toLocaleString(intlTag(locale)),
          pseudonim: uspeh.pseudonim,
        })}
        dugmeTekst={t("send_uspeh_dugme")}
        onDugme={onSuccess}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-kolo-muted">{t("send_naslov")}</h2>
        <button onClick={onClose} className="text-kolo-muted hover:text-kolo-muted text-xl leading-none">×</button>
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div className="relative" ref={wrapperRef}>
          <label className="block text-sm font-medium text-kolo-muted mb-1">{t("send_pseudonim")}</label>
          <input
            type="text"
            value={pseudonim}
            onChange={(e) => handlePseudonimChange(e.target.value)}
            onFocus={() => pseudonim.length >= 2 && setShowSugestije(true)}
            onKeyDown={handleKeyDown}
            placeholder={t("send_pseudonim_placeholder")}
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
          />
          {showSugestije && sugestije.length > 0 && (
            <ul ref={listaRef} className="absolute z-20 left-0 right-0 mt-1 bg-white border border-kolo-border rounded-xl shadow-lg overflow-hidden">
              {sugestije.map((ps, i) => (
                <li key={ps}>
                  <button
                    type="button"
                    onMouseDown={() => odaberi(ps)}
                    onMouseEnter={() => setAktivniIndex(i)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      i === aktivniIndex
                        ? "bg-kolo-green-100 text-kolo-green-800"
                        : "text-kolo-muted hover:bg-kolo-green-50 hover:text-kolo-green-700"
                    }`}
                  >
                    {ps}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">{t("send_iznos")}</label>
          <input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t("send_iznos_placeholder")}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">
            {t("send_opis")} <span className="text-kolo-muted font-normal">({tc("opciono")})</span>
          </label>
          <input
            type="text"
            maxLength={100}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("send_opis_placeholder")}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
          />
        </div>
        {error && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{error}</p>}
        {/* Šta prepis JESTE, rečeno na mestu gde se radi. Reč „prepis" u govoru
            vuče na dve pogrešne strane — „prepisati kuću" (prenos svojine, a POEN
            nije imovinsko pravo, čl. 12–13) i „prepisati" kao kopirati (kopija bi
            značila da POEN nastaje ni iz čega, protiv zero-suma). Ova rečenica
            gasi obe. */}
        <p className="text-xs text-kolo-muted leading-snug">{t("send_napomena")}</p>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium hover:bg-kolo-border transition-colors"
          >
            {tc("otkazi")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
          >
            {loading ? t("send_dugme_loading") : t("send_dugme")}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── QR modal ──────────────────────────────────────────────────────────────────

function QRModal({ pseudonim, memberHash, onClose }: { pseudonim: string; memberHash: string; onClose: () => void }) {
  const t = useTranslations("novcanik");
  const tc = useTranslations("common");
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://ekolo.rs";
  const [iznos, setIznos] = useState("");
  const [opis, setOpis] = useState("");

  function buildQrValue() {
    if (memberHash) {
      const params = new URLSearchParams();
      if (iznos && parseInt(iznos) > 0) params.set("amount", iznos);
      if (opis.trim()) params.set("opis", opis.trim());
      const qs = params.toString();
      return `${baseUrl}/m/${memberHash}${qs ? `?${qs}` : ""}`;
    } else {
      const params = new URLSearchParams({ plati: pseudonim });
      if (iznos && parseInt(iznos) > 0) params.set("iznos", iznos);
      if (opis.trim()) params.set("description", opis.trim());
      return `${baseUrl}/novcanik?${params.toString()}`;
    }
  }

  const qrValue = buildQrValue();

  function kopiraj() {
    navigator.clipboard.writeText(qrValue).catch(() => {});
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 space-y-4 text-center">
        <h3 className="text-base font-semibold text-kolo-text">{t("qr_naslov")}</h3>
        <p className="text-sm text-kolo-muted">{t("qr_opis")}</p>

        <div className="space-y-2 text-left">
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">{t("qr_iznos")} <span className="text-kolo-border font-normal">({tc("opciono")})</span></label>
            <input
              type="number"
              min={1}
              step={1}
              value={iznos}
              onChange={(e) => setIznos(e.target.value)}
              placeholder={t("qr_placeholder_iznos")}
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">{tc("opis")} <span className="text-kolo-border font-normal">({tc("opciono")})</span></label>
            <input
              type="text"
              maxLength={100}
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              placeholder={t("qr_placeholder_opis")}
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-center p-4 bg-white rounded-xl border border-kolo-border">
          <QRCodeSVG
            value={qrValue}
            size={180}
            fgColor="#1B6B3A"
            bgColor="#FFFFFF"
            level="M"
          />
        </div>
        <p className="text-sm font-semibold text-kolo-green-700 font-mono"><Pseudonim>{pseudonim}</Pseudonim></p>
        <div className="flex gap-2">
          <button
            onClick={kopiraj}
            className="flex-1 py-2.5 rounded-xl border border-kolo-border text-kolo-muted text-sm font-medium hover:bg-kolo-bg transition-colors"
          >
            {t("qr_kopiraj")}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 transition-colors"
          >
            {tc("zatvori")}
          </button>
        </div>
      </div>
    </div>
  );
}
