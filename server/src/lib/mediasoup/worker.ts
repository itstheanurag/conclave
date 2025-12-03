import * as mediasoup from "mediasoup";
import type { Worker, Router } from "mediasoup/node/lib/types";

let worker: Worker;
let router: Router;

const mediaCodecs: mediasoup.types.RouterOptions["mediaCodecs"] = [
  {
    kind: "audio" as const,
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: "video" as const,
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: { "x-google-start-bitrate": 1000 },
  },
];

export async function startMediasoup() {
  worker = await mediasoup.createWorker({ logLevel: "warn" });

  worker.on("died", () => {
    console.error("❌ Mediasoup worker died");
    setTimeout(() => process.exit(1), 2000);
  });

  router = await worker.createRouter({ mediaCodecs });
  console.log("🎥 Mediasoup worker and router started");
}

export const getRouter = () => router;
export const getWorker = () => worker;

export { mediaCodecs };
