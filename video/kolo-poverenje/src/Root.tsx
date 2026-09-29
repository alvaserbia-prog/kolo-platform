import { Composition, Still } from "remotion";
import { Naslovna1, Naslovna2, Naslovna3 } from "./Naslovne";
import { CijiSiTi } from "./v1k/Video";
import { PLAN as P1 } from "./v1/vreme";
import { PoznajesLiNekoga } from "./v2/Video";
import { PLAN as P2 } from "./v2/vreme";
import { PotvrdaOdgovornost } from "./v3k/Video";
import { PLAN as P3 } from "./v3/vreme";

export const Root: React.FC = () => (
  <>
    <Composition id="CijiSiTi" component={CijiSiTi} durationInFrames={P1.frejmova} fps={P1.fps} width={1080} height={1920} />
    <Composition id="PoznajesLiNekoga" component={PoznajesLiNekoga} durationInFrames={P2.frejmova} fps={P2.fps} width={1080} height={1920} />
    <Composition id="PotvrdaOdgovornost" component={PotvrdaOdgovornost} durationInFrames={P3.frejmova} fps={P3.fps} width={1080} height={1920} />
    <Still id="Naslovna1" component={Naslovna1} width={1080} height={1920} />
    <Still id="Naslovna2" component={Naslovna2} width={1080} height={1920} />
    <Still id="Naslovna3" component={Naslovna3} width={1080} height={1920} />
  </>
);
