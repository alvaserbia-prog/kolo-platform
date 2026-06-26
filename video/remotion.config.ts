// Podešavanja za render i Studio. Ovo NIJE obavezno, ali je korisno.
import { Config } from "@remotion/cli/config";

// Kvalitet H.264 enkodiranja: niže = bolji kvalitet (1 najbolje, 51 najgore).
// 18 je "vizuelno bez gubitka" i sasvim dovoljno za Reels/TikTok.
Config.setCrf(18);

// Format slike po frejmu tokom rendera (interno). jpeg = brže, png = lossless.
Config.setVideoImageFormat("jpeg");
