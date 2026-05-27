export const metadata = { title: "Zajedničko dobro i licence — KOLO" };

export default function ZajednickoDobroPage() {
  return (
    <div className="max-w-[932px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-kolo-green-900 mb-3">Zajedničko dobro i licence</h1>
        <p className="text-kolo-muted leading-relaxed text-body">
          Zajedničko dobro KOLO sistema čine softver sistema, pravila sistema, evidencija
          doprinosa i učešća, i sadržaj nastao u sistemu. Ono je kolektivno dobro svih korisnika —
          nijedan korisnik, osnivač ni Fondacija nema svojinsko pravo nad njim (čl. 4–5 Pravilnika).
        </p>
      </div>

      <div className="space-y-4">
        <section className="bg-kolo-surface border border-kolo-border rounded-2xl p-6">
          <h2 className="font-semibold text-kolo-text mb-2">Softver — AGPL-3.0</h2>
          <p className="text-sm text-kolo-muted leading-relaxed">
            Izvorni kod sistema licenciran je pod{" "}
            <strong>GNU Affero General Public License, verzija 3.0 (AGPL-3.0-only)</strong>.
            Svako ko koristi ili menja softver mora omogućiti pristup izvornom kodu pod istom licencom.
          </p>
          <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-kolo-green-700 hover:underline mt-2 inline-block">
            Pun tekst AGPL-3.0 →
          </a>
        </section>

        <section className="bg-kolo-surface border border-kolo-border rounded-2xl p-6">
          <h2 className="font-semibold text-kolo-text mb-2">Sadržaj — CC BY-SA 4.0</h2>
          <p className="text-sm text-kolo-muted leading-relaxed">
            Sadržaj koji nastaje u sistemu — dokumentacija, tekstovi i materijali — licenciran je pod{" "}
            <strong>Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)</strong>.
            Slobodno se može deliti i prerađivati, uz navođenje autorstva i pod istom licencom.
          </p>
          <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.sr" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-kolo-green-700 hover:underline mt-2 inline-block">
            Pun tekst CC BY-SA 4.0 →
          </a>
        </section>

        <section className="bg-kolo-surface border border-kolo-border rounded-2xl p-6">
          <h2 className="font-semibold text-kolo-text mb-2">Doprinosi (čl. 8)</h2>
          <ul className="text-sm text-kolo-muted leading-relaxed space-y-1.5 list-disc pl-5">
            <li>Doprinosi <strong>kodu</strong> prihvataju se pod uslovima <strong>Developer Certificate of Origin (DCO)</strong> — doprinosilac potvrđuje pravo da doprinese delo pod licencom zajedničkog dobra.</li>
            <li>Doprinosi <strong>sadržaju</strong> prihvataju se uz prihvatanje licence zajedničkog dobra (CC BY-SA 4.0).</li>
            <li>Doprinosi pripadaju zajedničkom dobru.</li>
            <li><strong>Atribucija doprinosa je trajna</strong> — zapis o autorstvu čuva se neograničeno (u git istoriji, kroz <code>Signed-off-by</code>) i preživljava anonimizaciju ili brisanje naloga.</li>
          </ul>
        </section>

        <section className="bg-kolo-surface border border-kolo-border rounded-2xl p-6">
          <h2 className="font-semibold text-kolo-text mb-2">Brend</h2>
          <p className="text-sm text-kolo-muted leading-relaxed">
            Naziv „KOLO", logotip, znak i domeni <strong>nisu</strong> deo zajedničkog dobra i pod
            isključivom su kontrolom Fondacije. Licence zajedničkog dobra ne daju pravo na korišćenje brenda.
          </p>
        </section>
      </div>
    </div>
  );
}
