import { Composition } from "remotion";
import { Usteda } from "./u/Video";
import { PLAN } from "./u/vreme";

export const Root: React.FC = () => (
  <>
    <Composition id="Usteda" component={Usteda} durationInFrames={PLAN.frejmova} fps={PLAN.fps} width={1080} height={1920} />
  </>
);
