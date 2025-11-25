import { CONFIG } from "config";
import { app } from "@src/lib/server";
import { startWebSocketServer } from "@src/signaling/server";
import { startMediasoup } from "@src/lib/mediasoup/worker";

(async () => {
  const server = Bun.serve({
    port: CONFIG.APP.PORT || 3000,
    fetch: app.fetch,
  });

  console.log(`✅ Server running on http://localhost:${server.port}`);
  console.log(`📘 Docs: http://localhost:${server.port}/docs`);

  await startMediasoup();
  startWebSocketServer();
})();
