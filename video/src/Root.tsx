// REGISTAR KLIPOVA.
// Ovde nabrajaš sve video "kompozicije" (Composition) koje postoje u projektu.
// Svaka <Composition> je jedan klip sa svojim dimenzijama, trajanjem i FPS-om.
// U Remotion Studiju će se svaka pojaviti u listi sa leve strane.

import { Composition } from "remotion";
import { SomborKlip } from "./SomborKlip";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // id = jedinstveno ime klipa. Koristi se i u komandi za render
        // (npr. `remotion render Sombor ...`).
        id="Sombor"
        // component = React komponenta koja crta svaki frejm.
        component={SomborKlip}
        // 9:16 vertikalni format za Reels/TikTok.
        width={1080}
        height={1920}
        // fps = frejmova po sekundi.
        fps={30}
        // durationInFrames = ukupno frejmova. 150 / 30fps = 5 sekundi.
        durationInFrames={150}
      />
    </>
  );
};
