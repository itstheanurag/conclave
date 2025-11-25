import { WebSocketServer } from "ws";
import { handleMessage } from "./handlers";

export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: 3001 });

  wss.on("connection", (ws) => {
    console.log("🔗 WebSocket client connected");

    ws.on("message", (msg) => handleMessage(ws, msg.toString()));
    ws.on("close", () => console.log("❌ WebSocket client disconnected"));
  });

  console.log("📡 WebSocket server running on ws://localhost:3001");
}
