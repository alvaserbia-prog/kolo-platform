import plan from "./plan.json";
import { napraviVreme, type Plan } from "../vreme";

export const PLAN = plan as Plan;
export const { kad, kadKraj, glob, scena, trajanjeF } = napraviVreme(PLAN);
