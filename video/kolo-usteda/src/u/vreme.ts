import plan from "../v1/plan.json";
import { napraviVreme, type Plan } from "../vreme";

export const PLAN = plan as Plan;
export const { kad, kadKraj, glob, scena, trajanjeF } = napraviVreme(PLAN);
