import { Composition } from "remotion";
import { Kolaz } from "./Kolaz";
import plan from "./plan.json";

export const Root: React.FC = () => (
  <Composition
    id="KoloUvod"
    component={Kolaz}
    durationInFrames={plan.frejmova}
    fps={plan.fps}
    width={1080}
    height={1920}
  />
);
