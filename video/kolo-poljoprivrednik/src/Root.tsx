import { Composition, Still } from "remotion";
import { Poljoprivrednici } from "./Video";
import { Naslovna } from "./Naslovna";
import { PLAN } from "./vreme";

export const Root: React.FC = () => (
  <>
    <Composition id="Poljoprivrednici" component={Poljoprivrednici} durationInFrames={PLAN.frejmova} fps={PLAN.fps} width={1080} height={1920} />
    <Still id="Naslovna" component={Naslovna} width={1080} height={1920} />
  </>
);
