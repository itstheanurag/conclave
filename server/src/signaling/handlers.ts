import { WebSocket } from "ws";
import type { Transport, Producer } from "mediasoup/node/lib/types";
import { createWebRtcTransport } from "@src/mediasoup/transport";

const rooms = new Map<string, Set<WebSocket>>();
const transports = new Map<string, Transport>();
const producers = new Map<string, Producer>();

export async function handleMessage(ws: WebSocket, message: string) {
  const msg = JSON.parse(message);

  switch (msg.type) {
    case "joinRoom":
      handleJoinRoom(ws, msg.payload.room);
      break;
    case "createTransport": {
      const transportData = await createWebRtcTransport();
      transports.set(transportData.params.id, transportData.transport);

      ws.send(
        JSON.stringify({
          type: "transportCreated",
          payload: {
            ...transportData.params,
            direction: msg.payload.direction,
          },
        })
      );
      break;
    }
    case "connectTransport": {
      const transport = transports.get(msg.payload.id);
      if (transport)
        await transport.connect({ dtlsParameters: msg.payload.dtlsParameters });
      break;
    }
    case "createProducer": {
      const transport = transports.get(msg.payload.transportId);
      if (transport) {
        const producer = await transport.produce({
          kind: msg.payload.kind,
          rtpParameters: msg.payload.rtpParameters,
        });
        producers.set(producer.id, producer);
        ws.send(
          JSON.stringify({
            type: "producerCreated",
            payload: { id: producer.id },
          })
        );
      }
      break;
    }
    case "createConsumer": {
      const transport = transports.get(msg.payload.transportId);
      if (transport) {
        const consumer = await transport.consume({
          producerId: msg.payload.producerId,
          rtpCapabilities: msg.payload.rtpCapabilities,
        });
        ws.send(
          JSON.stringify({
            type: "consumerCreated",
            payload: {
              id: consumer.id,
              producerId: consumer.producerId,
              kind: consumer.kind,
              rtpParameters: consumer.rtpParameters,
            },
          })
        );
      }
      break;
    }
  }
}

function handleJoinRoom(ws: WebSocket, room: string) {
  if (!rooms.has(room)) rooms.set(room, new Set());
  rooms.get(room)!.add(ws);
  console.log(`🟢 Client joined room: ${room}`);

  for (const producer of Array.from(producers.values())) {
    ws.send(
      JSON.stringify({
        type: "newProducer",
        payload: { producerId: producer.id },
      })
    );
  }
}
