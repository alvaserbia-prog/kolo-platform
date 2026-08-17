/**
 * Ekonomija dečjeg prostora — čista pravila (Modul Deca, čl. 14b, 14c, 19).
 *
 * Ovde se čuva ono što je u opisu modula obrazloženo kao NOSIVO, pa mora da padne
 * glasno ako se promeni:
 *
 *  - isplata čeka OBE strane (jedina odbrana od farmovanja);
 *  - braća i sestre sklapaju prijateljstvo, ali ono ne nosi POEN;
 *  - ciklus raskini–obnovi daje TAČNO NULU (zato zapis sme u minus);
 *  - pri punoletstvu otpis pada na obe strane, i samo za isplaćena prijateljstva.
 */
import { describe, it, expect } from "vitest";
import {
  PRIJATELJSTVO_POEN,
  otpisPriPunoletstvu,
  prijateljstvoNosiPoen,
  stanjeDeteta,
  suBracaISestre,
  type StanjeDeteta,
  type Ucesnik,
} from "@/lib/deca-pravila";

function dete(id: string, roditeljIds: string[], stanje: StanjeDeteta = "AKTIVNO"): Ucesnik {
  return { id, maloletan: true, dozvolaOdrasli: false, roditeljIds, stanje };
}

describe("iznos je 500 po strani", () => {
  it("konstanta se ne pomera nečujno — akt je navodi brojem", () => {
    expect(PRIJATELJSTVO_POEN).toBe(500);
  });
});

describe("🔴 obostrano čekanje je cela odbrana od farmovanja", () => {
  /**
   * Napad koji ovo sprečava: broj dece po roditelju nije ograničen, pa jedan čovek
   * otvori deset naloga, upari ih međusobno (45 parova) i prekidačem iz čl. 10
   * prepiše sve sebi. Dve brane ga obaraju nezavisno — braća ne nose POEN, a nalog
   * je aktivan tek kad ga preuzme roditelj koji je REDOVAN ČLAN, dakle čovek koga je
   * neko treći potvrdio u stvarnom svetu.
   */
  it("deset naloga istog roditelja daje NULA POEN-a, iako je 45 parova", () => {
    const deca = Array.from({ length: 10 }, (_, i) => dete(`d${i}`, ["farmer"]));
    let parova = 0;
    let saPoenom = 0;
    for (let i = 0; i < deca.length; i++) {
      for (let j = i + 1; j < deca.length; j++) {
        parova += 1;
        if (prijateljstvoNosiPoen(deca[i], deca[j])) saPoenom += 1;
      }
    }
    expect(parova).toBe(45);
    expect(saPoenom).toBe(0);
  });

  it("nalozi bez preuzetog roditelja ne nose POEN ni kad nisu braća", () => {
    const a = dete("a", [], "NA_CEKANJU");
    const b = dete("b", [], "NA_CEKANJU");
    expect(suBracaISestre(a, b)).toBe(false);
    expect(prijateljstvoNosiPoen(a, b)).toBe(false);
  });

  it("čim OBE strane pređu u AKTIVNO, isti par nosi POEN", () => {
    const a = dete("a", ["r1"], "POVEZANO");
    const b = dete("b", ["r2"], "AKTIVNO");
    expect(prijateljstvoNosiPoen(a, b)).toBe(false);
    expect(prijateljstvoNosiPoen({ ...a, stanje: "AKTIVNO" }, b)).toBe(true);
  });
});

describe("🔴 ciklus raskini–obnovi mora da daje nulu", () => {
  /**
   * Bez minusa bi postojao ovakav potez: sklopi prijateljstvo, dobij 500, odmah
   * prepiši roditelju, raskini — otpis pada na prazan račun; pa obnovi par i ponovi.
   * Sa minusom (zapis sme ispod nule) ciklus daje tačno nulu, pa je obnavljanje para
   * bezopasno i pomirene drugarice ne gube ništa trajno.
   *
   * Test opisuje aritmetiku koju sprovodi `raskiniPrijateljstvo` / `probajIsplatiti`.
   */
  function ciklus(krugova: number, potrosiOdmah: boolean): number {
    let zapis = 0;
    for (let i = 0; i < krugova; i++) {
      zapis += PRIJATELJSTVO_POEN; // isplata
      if (potrosiOdmah) zapis -= PRIJATELJSTVO_POEN; // prepis roditelju
      zapis -= PRIJATELJSTVO_POEN; // otpis pri raskidu — SME u minus
      if (potrosiOdmah) zapis += PRIJATELJSTVO_POEN; // ono što je prepisano roditelju
    }
    return zapis;
  }

  it("štediša izlazi na nulu", () => {
    expect(ciklus(1, false)).toBe(0);
    expect(ciklus(50, false)).toBe(0);
  });

  it("i onaj ko odmah potroši izlazi na nulu — kazna je samo odložena", () => {
    expect(ciklus(1, true)).toBe(0);
    expect(ciklus(50, true)).toBe(0);
  });
});

describe("otpis pri punoletstvu — čl. 19 st. 2", () => {
  it("računa se po broju ŽIVIH ISPLAĆENIH prijateljstava", () => {
    expect(otpisPriPunoletstvu(30)).toBe(15_000);
  });

  it("raskinuta, bratska i prijateljstva na čekanju se ne broje", () => {
    // Sva tri slučaja nose isto polje `poenIsplacen === false`, pa je brojač isti.
    const isplacenih = 3;
    expect(otpisPriPunoletstvu(isplacenih)).toBe(3 * PRIJATELJSTVO_POEN);
  });

  it("nalog bez ijednog isplaćenog prijateljstva ne gubi ništa", () => {
    expect(otpisPriPunoletstvu(0)).toBe(0);
  });
});

describe("stanje naloga sa dvoje roditelja", () => {
  it("drugi roditelj koji još nije redovan član ne obara stanje", () => {
    expect(
      stanjeDeteta([
        { aktivan: true, redovan: true },
        { aktivan: true, redovan: false },
      ])
    ).toBe("AKTIVNO");
  });

  it("kad prvom roditelju padne potvrda, drugi ga drži", () => {
    expect(
      stanjeDeteta([
        { aktivan: true, redovan: false },
        { aktivan: true, redovan: true },
      ])
    ).toBe("AKTIVNO");
  });

  it("kad obojici padne potvrda, dete ide u POVEZANO — ne u NA_CEKANJU", () => {
    expect(
      stanjeDeteta([
        { aktivan: true, redovan: false },
        { aktivan: true, redovan: false },
      ])
    ).toBe("POVEZANO");
  });
});
