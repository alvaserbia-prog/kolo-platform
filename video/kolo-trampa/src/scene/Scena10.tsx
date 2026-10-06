// Scena 10 — „A ono što je upisano ostaje zauvek. To je KOLO. U KOLU se taj zapis zove POEN.“
// Sveska se zatvori i ponovo otvori: redovi su i dalje tu. Na „KOLO“ (novi deo muzike) četvoro se uhvate
// u kolo, gore znak KOLO. Na „POEN“ u zaglavlju sveske zelenom kredom POEN, a redovi pozelene: zapis, nikad novčić.
import React from "react";
import { Kadar } from "../alat";
import { kad } from "../vreme";
import { Zapis } from "./zapis";

const R = -999;
export const Scena10: React.FC = () => (
  <Kadar>
    <Zapis
      d={{
        cipele: R,
        red1: R,
        ajvar: R,
        red2: R,
        drva: R,
        podvuci1: R,
        red3: R,
        krug: R,
        upitnikNestaje: R,
        zatvori: kad(10, "ostaje") - 4,
        kolo: kad(10, "KOLO."),
        poen: kad(10, "POEN.") - 2,
      }}
    />
  </Kadar>
);
