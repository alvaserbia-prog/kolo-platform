// Scena 9 — „Kada obućaru zatrebaju drva, Stevan mu ih donese, jer se zna da je obućar već dao svoje. Tako niko
// ne mora da čeka da naiđe neko ko baš ima ono što mu treba.“
// Obućaru zatrebaju drva (oblačić); Stevan mu ih donese. Na „jer se zna“ prvi red u svesci se zeleno podvuče,
// upiše se „Stevan · dao drva“. Na „niko ne mora da čeka“ strelice davanja se spoje, a Stevanov upitnik
// (njegova potreba iz scene 3) se obriše: i on je upisan kao onaj koji je dao.
import React from "react";
import { Kadar } from "../alat";
import { kad } from "../vreme";
import { Zapis } from "./zapis";

const R = -999;
export const Scena9: React.FC = () => (
  <Kadar>
    <Zapis
      d={{
        cipele: R,
        red1: R,
        ajvar: R,
        red2: R,
        oblDrva: kad(9, "drva,") - 8,
        drva: kad(9, "donese,") - 8,
        podvuci1: kad(9, "zna"),
        red3: kad(9, "svoje.") - 4,
        krug: kad(9, "niko"),
        upitnikNestaje: kad(9, "čeka"),
      }}
    />
  </Kadar>
);
