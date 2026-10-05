import { Composition, Still } from "remotion";
import { Kolaz } from "./Kolaz";
import { Naslovna } from "./Naslovna";
import plan from "./plan.json";

export const Root: React.FC = () => (
  <>
    <Composition
      id="Kolo04"
      component={Kolaz}
      durationInFrames={plan.frejmova}
      fps={plan.fps}
      width={1080}
      height={1920}
    />
    <Still id="Naslovna" component={Naslovna} width={1080} height={1920} />
  </>
);
