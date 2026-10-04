import { Config } from "@remotion/cli/config";

// Chromium iz okruženja (Playwright) — Remotion ne mora ništa da preuzima.
Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
Config.setConcurrency(4);
Config.setChromiumOpenGlRenderer("swiftshader");
