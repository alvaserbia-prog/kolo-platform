// Scena 3 — „Stevan ima drva, ali ni njemu ne treba ajvar. On traži nekog da mu okreči kuću.“
// Kamera se odmakne udesno i otkrije Stevana pored gomile drva; strelica obućar → Stevan. Na „ne treba ajvar“
// Stevan odmahne (iks preko tegle). Na „okreči kuću“ oblačić sa kućom, četkom i kofom, a lanac se završi upitnikom.
import React from "react";
import { Kadar, napredak, useF } from "../alat";
import { kad } from "../vreme";
import { Lanac, kamPrelaz } from "./lanac";

const RANIJE = -999; // događaji iz scene 2 su već tu
export const Scena3: React.FC = () => {
  const f = useF();
  return (
    <Kadar>
      <Lanac
        kam={kamPrelaz(napredak(f, -4, 26))}
        d={{
          pruzi: RANIJE,
          str1: RANIJE,
          neO: RANIJE,
          oblDrva: RANIJE,
          stevan: kad(3, "Stevan") - 4,
          str2: kad(3, "drva,"),
          pruziS: kad(3, "ali"),
          neS: kad(3, "ne"),
          oblKuca: kad(3, "okreči") - 4,
          upitnik: kad(3, "kuću.") + 6,
        }}
      />
    </Kadar>
  );
};
