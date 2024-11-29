import { TestData } from "../types.ts";
import { businessTests } from "./business.ts";
import { communicationTests } from "./communication.ts";
import { cryptoTests } from "./crypto.ts";
import { developmentTests } from "./development.ts";
import { healthTests } from "./health.ts";
import { intelligenceTests } from "./intelligence.ts";
import { mediaTests } from "./media.ts";
import { productivityTests } from "./productivity.ts";
import { realEstateTests } from "./real-estate.ts";
import { researchTests } from "./research.ts";
import { securityTests } from "./security.ts";
import { shoppingTests } from "./shopping.ts";
import { socialMediaTests } from "./social-media.ts";
import { spiritualTests } from "./spiritual.ts";
import { travelTests } from "./travel.ts";
import { videoAudioTests } from "./video-audio.ts";
import { webTests } from "./web.ts";
import { benchmarkTests } from "./benchmark.ts";

export const allTests: TestData[] = [
  ...businessTests,
  ...communicationTests,
  ...cryptoTests,
  ...developmentTests,
  ...healthTests,
  ...intelligenceTests,
  ...mediaTests,
  ...productivityTests,
  ...realEstateTests,
  ...researchTests,
  ...securityTests,
  ...shoppingTests,
  ...socialMediaTests,
  ...spiritualTests,
  ...travelTests,
  ...videoAudioTests,
  ...webTests,
  ...benchmarkTests,
];
