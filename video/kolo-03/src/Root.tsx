import { Composition, Still } from "remotion";
import { Naslovna } from "./Naslovna";
import { Kolaz } from "./Kolaz";
import plan from "./plan.json";

export const Root: React.FC = () => (
  <>
  <Still id="Naslovna" component={Naslovna} width={1080} height={1920} />
  <Composition
    id="Kolo03"
    component={Kolaz}
    durationInFrames={plan.frejmova}
    fps={plan.fps}
    width={1080}
    height={1920}
  />
  </>
);
