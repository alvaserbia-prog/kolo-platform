import { IstorijaSkeleton } from "./IstorijaTransakcija";

// Instant skeleton dok server pripremi kartice (laki upiti: stanje POEN/ZRNO).
// Uklanja belu pauzu pri ulasku na /novcanik.
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="bg-white rounded-2xl border border-kolo-border p-6 shadow-sm h-[7.5rem] animate-pulse" />
        <div className="bg-gradient-to-br from-kolo-green-700 to-kolo-green-500 rounded-2xl p-6 shadow-lg h-[7.5rem] animate-pulse opacity-80" />
      </div>
      <IstorijaSkeleton />
    </div>
  );
}
