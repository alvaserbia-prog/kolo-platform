// Scena 2 — „Poželela je da razmeni ajvar za cipele sa obućarom, ali njemu ajvar ne treba. Obućaru trebaju drva.“
// Obućarska radnja (kamera bliže): Milica pruži teglu; na „ne treba“ obućar odmahne, preko tegle crveni iks,
// tegla se vrati. Na „drva“ iznad obućara oblačić sa drvima. Prva strelica lanca: Milica → obućar.
import React from "react";
import { Kadar } from "../alat";
import { kad } from "../vreme";
import { KAM2, Lanac } from "./lanac";

export const Scena2: React.FC = () => (
  <Kadar>
    <Lanac
      kam={KAM2}
      d={{ pruzi: kad(2, "razmeni") + 6, str1: kad(2, "obućarom,"), neO: kad(2, "ne"), oblDrva: kad(2, "drva.") - 4 }}
    />
  </Kadar>
);
