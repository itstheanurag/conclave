import { WebSocket } from "ws";
import type {
  Transport,
  Producer,
  RtpCapabilities,
  Router,
  Consumer,
} from "mediasoup/node/lib/types";
import { createWebRtcTransport } from "@src/mediasoup/transport";
import { createWorker } from "mediasoup";

interface ProducerInfo {
  id: string;
  kind: "audio" | "video";
  participantId: string;
  participantName: string;
}

class Participant {
  ws: WebSocket;
  userId: string;
  userName: string;
  sendTransport: Transport | null = null;
  recvTransport: Transport | null = null;
  producers: Map<string, Producer> = new Map();
  consumers: Map<string, Consumer> = new Map();

  constructor(ws: WebSocket, userId: string, userName: string) {
    this.ws = ws;
    this.userId = userId;
    this.userName = userName;
  }

  addProducer(producer: Producer) {
    this.producers.set(producer.id, producer);
  }

  removeProducer(producerId: string) {
    this.producers.delete(producerId);
  }

  addConsumer(consumer: Consumer) {
    this.consumers.set(consumer.id, consumer);
  }

  removeConsumer(consumerId: string) {
    this.consumers.delete(consumerId);
  }

  close() {
    this.sendTransport?.close();
    this.recvTransport?.close();
    this.producers.forEach((producer) => producer.close());
    this.consumers.forEach((consumer) => consumer.close());
  }
}

class Room {
  id: string;
  router: Router;
  participants: Map<string, Participant> = new Map(); // userId -> Participant

  constructor(id: string, router: Router) {
    this.id = id;
    this.router = router;
  }

  addParticipant(participant: Participant) {
    this.participants.set(participant.userId, participant);
  }

  removeParticipant(userId: string) {
    this.participants.delete(userId);
  }

  getProducersForOtherParticipants(excludeUserId: string): ProducerInfo[] {
    const allProducers: ProducerInfo[] = [];
    this.participants.forEach((participant) => {
      if (participant.userId !== excludeUserId) {
        participant.producers.forEach((producer) => {
          allProducers.push({
            id: producer.id,
            kind: producer.kind,
            participantId: participant.userId,
            participantName: participant.userName,
          });
        });
      }
    });
    return allProducers;
  }

  broadcast(senderUserId: string, type: string, payload: any) {
    this.participants.forEach((participant) => {
      if (participant.userId !== senderUserId) {
        participant.ws.send(JSON.stringify({ type, payload }));
      }
    });
  }

  close() {
    this.participants.forEach((participant) => participant.close());
    this.router.close();
  }
}

const roomsMap = new Map<string, Room>(); // roomId -> Room

export async function handleMessage(ws: WebSocket, message: string) {
  const msg = JSON.parse(message);

  switch (msg.type) {
    case "joinRoom":
      await handleJoinRoom(
        ws,
        msg.payload.roomId,
        msg.payload.userId,
        msg.payload.userName,
        msg.payload.rtpCapabilities
      );
      break;
    case "createWebRtcTransport": {
      const { roomId, userId, producing, consuming } = msg.payload;
      const room = roomsMap.get(roomId);
      const participant = room?.participants.get(userId);

      if (!room || !participant) {
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: {
              messageId: msg.payload.messageId,
              error: "Room or participant not found",
            },
          })
        );
        return;
      }

      const { transport, params } = await createWebRtcTransport();

      if (producing) {
        participant.sendTransport = transport;
      } else if (consuming) {
        participant.recvTransport = transport;
      }

      ws.send(
        JSON.stringify({
          type: `${msg.type}-response`,
          payload: {
            messageId: msg.payload.messageId,
            data: {
              id: params.id,
              iceParameters: params.iceParameters,
              iceCandidates: params.iceCandidates,
              dtlsParameters: params.dtlsParameters,
            },
          },
        })
      );

      break;
    }
    case "connectWebRtcTransport": {
      const { roomId, userId, transportId, dtlsParameters } = msg.payload;
      const room = roomsMap.get(roomId);
      const participant = room?.participants.get(userId);

      if (!room || !participant) {
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: {
              messageId: msg.payload.messageId,
              error: "Room or participant not found",
            },
          })
        );
        return;
      }

      const transport =
        participant.sendTransport?.id === transportId
          ? participant.sendTransport
          : participant.recvTransport;

      if (transport) {
        await transport.connect({ dtlsParameters });
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: { messageId: msg.payload.messageId, data: "connected" },
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: {
              messageId: msg.payload.messageId,
              error: "Transport not found",
            },
          })
        );
      }
      break;
    }
    case "produce": {
      const { roomId, userId, transportId, kind, rtpParameters, appData } =
        msg.payload;
      const room = roomsMap.get(roomId);
      const participant = room?.participants.get(userId);

      if (!room || !participant || !participant.sendTransport) {
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: {
              messageId: msg.payload.messageId,
              error: "Room, participant or send transport not found",
            },
          })
        );
        return;
      }

      const producer = await participant.sendTransport.produce({
        kind,
        rtpParameters,
        appData,
      });
      participant.addProducer(producer);

      // Notify other participants in the room about the new producer
      room.broadcast(userId, "newProducer", {
        producerId: producer.id,
        kind: producer.kind,
        participantId: participant.userId,
        participantName: participant.userName,
      });

      ws.send(
        JSON.stringify({
          type: `${msg.type}-response`,
          payload: {
            messageId: msg.payload.messageId,
            data: { id: producer.id },
          },
        })
      );
      break;
    }
    case "consume": {
      const { roomId, userId, transportId, producerId, rtpCapabilities } =
        msg.payload;
      const room = roomsMap.get(roomId);
      const participant = room?.participants.get(userId);

      if (!room || !participant || !participant.recvTransport) {
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: {
              messageId: msg.payload.messageId,
              error: "Room, participant or receive transport not found",
            },
          })
        );
        return;
      }

      const producerToConsume = Array.from(room.participants.values())
        .flatMap((p) => Array.from(p.producers.values()))
        .find((p) => p.id === producerId);

      if (!producerToConsume) {
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: {
              messageId: msg.payload.messageId,
              error: "Producer to consume not found",
            },
          })
        );
        return;
      }

      const consumer = await participant.recvTransport.consume({
        producerId: producerToConsume.id,
        rtpCapabilities,
        paused: true, // Start paused
      });

      participant.addConsumer(consumer);

      ws.send(
        JSON.stringify({
          type: `${msg.type}-response`,
          payload: {
            messageId: msg.payload.messageId,
            data: {
              id: consumer.id,
              producerId: consumer.producerId,
              kind: consumer.kind,
              rtpParameters: consumer.rtpParameters,
            },
          },
        })
      );
      break;
    }
    case "resumeConsumer": {
      const { roomId, userId, consumerId } = msg.payload;
      const room = roomsMap.get(roomId);
      const participant = room?.participants.get(userId);

      if (!room || !participant) {
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: {
              messageId: msg.payload.messageId,
              error: "Room or participant not found",
            },
          })
        );
        return;
      }

      // Find the consumer on the participant
      const consumerToResume = participant.consumers.get(consumerId); // Assuming Participant has a consumers map

      if (consumerToResume) {
        await consumerToResume.resume();
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: { messageId: msg.payload.messageId, data: "resumed" },
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: {
              messageId: msg.payload.messageId,
              error: "Consumer not found",
            },
          })
        );
      }
      break;
    }
    case "getRouterRtpCapabilities": {
      const { roomId } = msg.payload;
      const room = roomsMap.get(roomId);

      if (!room) {
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: {
              messageId: msg.payload.messageId,
              error: "Room not found",
            },
          })
        );
        return;
      }

      ws.send(
        JSON.stringify({
          type: `${msg.type}-response`,
          payload: {
            messageId: msg.payload.messageId,
            data: room.router.rtpCapabilities,
          },
        })
      );
      break;
    }
    default:
      console.warn("Unknown message type:", msg.type);
      break;
  }
}

async function handleJoinRoom(
  ws: WebSocket,
  roomId: string,
  userId: string,
  userName: string,
  rtpCapabilities: RtpCapabilities
) {
  let room = roomsMap.get(roomId);
  if (!room) {
    const worker = await createWorker();
    const router = await worker.createRouter();
    room = new Room(roomId, router);
    roomsMap.set(roomId, room);
    console.log(`✨ New room created: ${roomId}`);
  }

  const participant = new Participant(ws, userId, userName);
  room.addParticipant(participant);
  console.log(`🟢 Participant ${userName} (${userId}) joined room: ${roomId}`);

  // Send existing producers to the joining client
  const existingProducers = room.getProducersForOtherParticipants(userId);
  ws.send(
    JSON.stringify({
      type: "joinRoom-response",
      payload: {
        messageId: "initial-join-response", // Placeholder messageId
        data: {
          producers: existingProducers,
          routerRtpCapabilities: room.router.rtpCapabilities,
        },
      },
    })
  );

  ws.on("close", () => {
    console.log(`🔴 Participant ${userName} (${userId}) left room: ${roomId}`);
    participant.close(); // Close all transports and producers/consumers for this participant
    room.removeParticipant(userId);

    // If the room is empty, close the room
    if (room.participants.size === 0) {
      room.close();
      roomsMap.delete(roomId);
      console.log(`🗑️ Room ${roomId} closed as it is empty.`);
    }
  });

  ws.on("error", (error) => {
    console.error(
      `❌ WebSocket error for ${userName} (${userId}) in room ${roomId}:`,
      error
    );
    // Handle error, potentially close participant resources
    participant.close();
    room.removeParticipant(userId);
    if (room.participants.size === 0) {
      room.close();
      roomsMap.delete(roomId);
      console.log(`🗑️ Room ${roomId} closed due to error.`);
    }
  });
}
