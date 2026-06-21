"use client";

import type { CenaTip } from "@/lib/cena-oglas";

// Izbor varijante cene (FIKSNA / RASPON / DOGOVOR) + odgovarajuća polja unosa.
// Stanje drži roditeljska forma; komponenta je čisto kontrolisana (controlled).
// `t` je next-intl prevodilac iz namespace-a "pijaca".
export default function CenaUnos({
  cenaTip,
  setCenaTip,
  price,
  setPrice,
  cenaDo,
  setCenaDo,
  t,
}: {
  cenaTip: CenaTip;
  setCenaTip: (v: CenaTip) => void;
  price: string;
  setPrice: (v: string) => void;
  cenaDo: string;
  setCenaDo: (v: string) => void;
  t: (key: string) => string;
}) {
  const tipovi: { val: CenaTip; label: string }[] = [
    { val: "FIKSNA", label: t("cena_tip_fiksna") },
    { val: "RASPON", label: t("cena_tip_raspon") },
    { val: "DOGOVOR", label: t("cena_tip_dogovor") },
  ];

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-kolo-border text-sm font-mono outline-none focus:border-kolo-green-500 transition-colors";

  return (
    <div>
      <label className="block text-sm font-semibold text-kolo-muted mb-2">{t("cena_tip_label")}</label>

      {/* Izbor varijante cene */}
      <div className="flex gap-2 mb-3">
        {tipovi.map(({ val, label }) => (
          <button
            key={val}
            type="button"
            onClick={() => setCenaTip(val)}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              cenaTip === val
                ? "bg-kolo-green-700 text-white"
                : "bg-white border border-kolo-border text-kolo-muted hover:border-kolo-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Polja zavise od izabrane varijante */}
      {cenaTip === "FIKSNA" && (
        <input
          type="number"
          min={1}
          step={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="500"
          className={inputCls}
        />
      )}

      {cenaTip === "RASPON" && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={t("cena_od")}
            className={inputCls}
          />
          <span className="text-kolo-muted">—</span>
          <input
            type="number"
            min={1}
            step={1}
            value={cenaDo}
            onChange={(e) => setCenaDo(e.target.value)}
            placeholder={t("cena_do")}
            className={inputCls}
          />
        </div>
      )}

      {cenaTip === "DOGOVOR" && (
        <p className="text-sm text-kolo-muted bg-kolo-bg rounded-xl px-4 py-3">{t("cena_dogovor_hint")}</p>
      )}
    </div>
  );
}
