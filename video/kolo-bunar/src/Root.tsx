import { Composition, Still } from "remotion";
import { Film } from "./Film";
import { Naslovna } from "./Naslovna";
import plan from "./plan.json";

export const Root: React.FC = () => (
  <>
    <Composition id="KoloBunar" component={Film} durationInFrames={plan.frejmova} fps={plan.fps} width={1080} height={1920} />
    <Still id="Naslovna" component={Naslovna} width={1080} height={1920} />
  </>
);
