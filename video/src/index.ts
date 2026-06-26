// ULAZNA TAČKA Remotion projekta.
// Remotion ovde "ulazi" kad pokreneš Studio ili render.
// Jedini posao ovog fajla: reci Remotion-u koja je korenska (root) komponenta
// u kojoj su registrovani svi tvoji klipovi.

import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
