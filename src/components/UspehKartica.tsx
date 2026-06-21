"use client";

/**
 * Pun „uspeh" ekran (zeleni krug + kvačica + naslov + opis + dugme),
 * stilski usklađen sa ekranom posle postavljanja oglasa (NoviOglasForma).
 * Renderuje se unutar kartice (rounded-2xl) da legne u layout /verifikacija.
 */
export default function UspehKartica({
  naslov,
  opis,
  dugmeTekst,
  onDugme,
}: {
  naslov: string;
  opis: React.ReactNode;
  dugmeTekst: string;
  onDugme: () => void;
}) {
  return (
    <div className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
      <div className="text-center space-y-4 py-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-kolo-green-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-kolo-green-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="kolo-naslov">{naslov}</h2>
        <p className="text-sm text-kolo-muted max-w-sm mx-auto">{opis}</p>
        <button
          onClick={onDugme}
          className="px-6 py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors"
        >
          {dugmeTekst}
        </button>
      </div>
    </div>
  );
}
