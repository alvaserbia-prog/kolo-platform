// Scena 8 — „Drugi način je da se zapisuje. Obućar da Milici cipele, i u zajedničku svesku se zapiše da je on dao.
// Milica da ajvar onome kome treba, i to se takođe zapiše.“
// Tabla obrisana: „2. zapis“, zajednička sveska. Obućar daje cipele Milici (ona ih obuje), u svesci se ispiše
// „Obućar · dao cipele“. Milica nosi teglu Ani, ispiše se „Milica · dala ajvar“.
import React from "react";
import { Kadar } from "../alat";
import { kad } from "../vreme";
import { Zapis } from "./zapis";

export const Scena8: React.FC = () => (
  <Kadar>
    <Zapis d={{ cipele: kad(8, "cipele,") - 10, red1: kad(8, "zapiše"), ajvar: kad(8, "ajvar") - 6, red2: kad(8, "zapiše.") - 6 }} />
  </Kadar>
);
