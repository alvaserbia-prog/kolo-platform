"use client";

/**
 * PRIVREMENA stranica za dijagnostiku izbora slika na telefonu.
 *
 * Povod: prijavljeno je da se slike ne mogu dodati na oglas, a serverski logovi
 * pokazuju da zahtev NIKAD ne krene — dakle lomi se u pregledaču, pre mreže.
 * Reprodukcija na iPhone-u ovde nije moguća (nema WebKit-a), pa ova stranica
 * ispisuje na ekran svaki korak: da li je dodir stigao, da li je `change` stigao,
 * koliko datoteka, kog tipa i veličine, i šta je od njih napravljeno.
 *
 * 🟡 Briše se čim se uzrok utvrdi. Ne linkuje se nigde i nije u sitemap-u.
 */

import { useState } from "react";
import {
  MAX_UKUPNO,
  pripremiSlike,
  ukupnaVelicina,
  type IzabranaSlika,
} from "@/lib/slika-upload";

const ID = "proba-unos";

export default function ProbaSlika() {
  const [redovi, setRedovi] = useState<string[]>([]);
  const [slike, setSlike] = useState<IzabranaSlika[]>([]);

  function zapisi(tekst: string) {
    const t = new Date().toLocaleTimeString("sr-RS");
    setRedovi((prev) => [...prev, `${t}  ${tekst}`]);
  }

  function okruzenje() {
    zapisi(`pregledač: ${navigator.userAgent}`);
    zapisi(`createImageBitmap: ${typeof createImageBitmap === "function" ? "postoji" : "NE POSTOJI"}`);
    zapisi(
      `canvas 2d: ${document.createElement("canvas").getContext("2d") ? "radi" : "NE RADI"}`
    );
    zapisi(`toBlob: ${typeof document.createElement("canvas").toBlob === "function" ? "postoji" : "NE POSTOJI"}`);
  }

  async function naPromenu(e: React.ChangeEvent<HTMLInputElement>) {
    const izabrane = Array.from(e.target.files ?? []);
    zapisi(`✅ „change" JE STIGAO — datoteka: ${izabrane.length}`);
    if (izabrane.length === 0) {
      zapisi("⚠️ nijedna datoteka nije stigla (korisnik je odustao ili ih telefon nije predao)");
      return;
    }
    for (const f of izabrane) {
      zapisi(`  • ${f.name || "(bez imena)"} | tip: ${f.type || "(prazan)"} | ${Math.round(f.size / 1024)} KB`);
    }

    zapisi("počinjem pripremu…");
    try {
      const gotove: IzabranaSlika[] = [];
      const ishod = await pripremiSlike(izabrane, (s) => {
        gotove.push(s);
        zapisi(`  ✔ pripremljena: ${Math.round(s.file.size / 1024)} KB, ${s.file.type}`);
        setSlike((prev) => [...prev, s]);
      });
      zapisi(
        `gotovo: ${gotove.length} od ${izabrane.length} | ukupno ${Math.round(
          ukupnaVelicina(gotove.map((s) => s.file)) / 1024
        )} KB (granica ${Math.round(MAX_UKUPNO / 1024)} KB)`
      );
      if (ishod.formatOdbijen) zapisi("⚠️ neka slika je odbijena zbog FORMATA");
      if (ishod.velicinaOdbijena) zapisi("⚠️ neka slika je odbijena zbog VELIČINE");
    } catch (err) {
      zapisi(`❌ GREŠKA: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-5">
      <div>
        <h1 className="text-xl font-bold">Provera izbora slika</h1>
        <p className="text-sm text-kolo-muted mt-1">
          Pritisni „Izaberi sliku", izaberi jednu fotografiju i pošalji sliku ovog ekrana.
          Stranica ništa ne šalje i ništa ne čuva.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <label
          htmlFor={ID}
          className="px-5 py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold cursor-pointer"
          onClick={() => zapisi("👆 dodir na dugme je stigao")}
        >
          Izaberi sliku
        </label>
        <input
          id={ID}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={naPromenu}
        />
        <button
          type="button"
          onClick={okruzenje}
          className="px-4 py-3 rounded-xl border border-kolo-border text-sm font-semibold"
        >
          Podaci o telefonu
        </button>
      </div>

      {/* Drugi put do istog polja — ako prvi na nekom telefonu ne radi, ovaj hoće. */}
      <div className="rounded-xl border border-kolo-border p-3">
        <p className="text-xs text-kolo-muted mb-2">
          Ako gornje dugme ne radi, probaj ovo polje:
        </p>
        <input type="file" accept="image/*" multiple onChange={naPromenu} className="text-sm" />
      </div>

      {slike.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {slike.map((s) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.pregled} src={s.pregled} alt="" className="w-20 h-20 object-cover rounded-xl border border-kolo-border" />
          ))}
        </div>
      )}

      <div>
        <p className="text-sm font-semibold mb-1">Šta se desilo:</p>
        <pre className="text-xs whitespace-pre-wrap break-words bg-kolo-bg rounded-xl p-3 min-h-24">
          {redovi.length === 0 ? "(još ništa — pritisni dugme)" : redovi.join("\n")}
        </pre>
      </div>
    </div>
  );
}
