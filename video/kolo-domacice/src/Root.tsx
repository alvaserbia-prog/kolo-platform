import { Composition, Still } from "remotion";
import { Slikovnica } from "./Slikovnica";
import { Naslovna } from "./Naslovna";
import plan from "./plan.json";

export const Root: React.FC = () => (
  <>
    <Composition id="KoloDomacice" component={Slikovnica} durationInFrames={plan.frejmova} fps={plan.fps} width={1080} height={1920} />
    <Still id="Naslovna" component={Naslovna} width={1080} height={1920} />
  </>
);
