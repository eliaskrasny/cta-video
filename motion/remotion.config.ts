// Render settings shared by everyone. Change them here, never per person.
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("png"); // lossless frames, so brand colours don't drift before encoding
Config.setColorSpace("bt709"); // YouTube's colour space; keeps #F4EFE6 looking like #F4EFE6
Config.setCodec("h264");
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
