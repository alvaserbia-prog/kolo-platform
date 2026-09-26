import { Composition } from "remotion";
import { Naslovna } from "./Naslovna";
import { Kolaz } from "./Kolaz";
import plan from "./plan.json";

export const Root: React.FC = () => (
  <>
  <Composition
    id="KoloStaDaPonudis"
    component={Kolaz}
    durationInFrames={plan.frejmova}
    fps={plan.fps}
    width={1080}
    height={1920}
  />
  <Composition id="Naslovna" component={Naslovna} durationInFrames={plan.frejmova} fps={plan.fps} width={1080} height={1920} />
  </>
);
