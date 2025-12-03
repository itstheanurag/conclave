import { WebSocketServer, WebSocket } from "ws";
import { handleMessage } from "./handlers";
import { handleDisconnect } from "./lib/utils";

interface ExtWebSocket extends WebSocket {
  roomId?: string;
  peerId?: string;
}

export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: 3001 });

  wss.on("connection", (ws: ExtWebSocket) => {
    console.log("🔗 WebSocket client connected");

    ws.on("message", (msg) => {
      const message = JSON.parse(msg.toString());
      if (message.type === "joinRoom") {
        ws.roomId = message.data.roomId;
        ws.peerId = message.data.peerId;
      }
      handleMessage(ws, msg.toString());
    });

    ws.on("close", () => {
      console.log("❌ WebSocket client disconnected");
      if (ws.roomId && ws.peerId) {
        handleDisconnect(ws.roomId, ws.peerId);
      }
    });
  });

  console.log("📡 WebSocket server running on ws://localhost:3001");
}
