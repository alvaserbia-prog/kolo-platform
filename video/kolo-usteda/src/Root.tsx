import { Composition, Still } from "remotion";
import { Naslovna, Naslovna2, Naslovna3, Naslovna4 } from "./Naslovna";
import { Usteda } from "./u/Video";
import { PLAN } from "./u/vreme";

export const Root: React.FC = () => (
  <>
    <Composition id="Usteda" component={Usteda} durationInFrames={PLAN.frejmova} fps={PLAN.fps} width={1080} height={1920} />
    <Still id="Naslovna" component={Naslovna} width={1080} height={1920} />
    <Still id="Naslovna2" component={Naslovna2} width={1080} height={1920} />
    <Still id="Naslovna3" component={Naslovna3} width={1080} height={1920} />
    <Still id="Naslovna4" component={Naslovna4} width={1080} height={1920} />
  </>
);
