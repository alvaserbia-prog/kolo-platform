import { Composition } from "remotion";
import { TRAJANJE, FPS } from "./zajednicko";
import { Tipografija } from "./Tipografija";
import { Telefon } from "./Telefon";
import { Vez } from "./Vez";
import { Mreza } from "./Mreza";
import { Linija } from "./Linija";

const STILOVI = [
  ["Stil1-Tipografija", Tipografija],
  ["Stil2-Telefon", Telefon],
  ["Stil3-Vez", Vez],
  ["Stil4-Mreza", Mreza],
  ["Stil5-Linija", Linija],
] as const;

export const Root: React.FC = () => (
  <>
    {STILOVI.map(([id, C]) => (
      <Composition key={id} id={id} component={C} durationInFrames={TRAJANJE} fps={FPS} width={1080} height={1920} />
    ))}
  </>
);
