import { Composition } from "remotion";
import { Kolaz } from "./Kolaz";
import { Naslovna } from "./Naslovna";
import plan from "./plan.json";

export const Root: React.FC = () => (
  <>
  <Composition
    id="KoloPrviOglas"
    component={Kolaz}
    durationInFrames={plan.frejmova}
    fps={plan.fps}
    width={1080}
    height={1920}
  />
  <Composition id="Naslovna" component={Naslovna} durationInFrames={1} fps={30} width={1080} height={1920} />
  </>
);
