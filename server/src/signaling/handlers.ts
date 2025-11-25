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
  isHost: boolean;

  constructor(
    ws: WebSocket,
    userId: string,
    userName: string,
    isHost: boolean = false
  ) {
    this.ws = ws;
    this.userId = userId;
    this.userName = userName;
    this.isHost = isHost;
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
  hostId: string | null = null;

  constructor(id: string, router: Router) {
    this.id = id;
    this.router = router;
  }

  addParticipant(participant: Participant) {
    this.participants.set(participant.userId, participant);
    if (!this.hostId) {
      this.hostId = participant.userId;
      participant.isHost = true;
    }
  }

  removeParticipant(userId: string) {
    this.participants.delete(userId);
    if (this.hostId === userId) {
      this.hostId = null; // Host left, reassign if needed or handle room closure
      // For simplicity, if host leaves, next participant becomes host or room closes
      if (this.participants.size > 0) {
        const newHost = this.participants.values().next().value;
        if (newHost) {
          this.hostId = newHost.userId;
          newHost.isHost = true;
        }
      }
    }
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

  getAllParticipantsInfo(): Array<{
    userId: string;
    userName: string;
    isHost: boolean;
  }> {
    return Array.from(this.participants.values()).map((p) => ({
      userId: p.userId,
      userName: p.userName,
      isHost: p.isHost,
    }));
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
        appData: producer.appData, // Include appData
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
    case "closeProducer": {
      const { roomId, userId, producerId } = msg.payload;
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

      const producer = participant.producers.get(producerId);
      if (producer) {
        producer.close();
        participant.removeProducer(producerId);
        room.broadcast(userId, "producerClosed", { producerId });
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: { messageId: msg.payload.messageId, data: "closed" },
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            type: `${msg.type}-response`,
            payload: {
              messageId: msg.payload.messageId,
              error: "Producer not found",
            },
          })
        );
      }
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
              appData: producerToConsume.appData, // Include appData
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

  const isHost = room.participants.size === 0; // First participant to join is host
  const participant = new Participant(ws, userId, userName, isHost);
  room.addParticipant(participant);
  console.log(`🟢 Participant ${userName} (${userId}) joined room: ${roomId}`);

  // Send existing producers and all participants info to the joining client
  const existingProducers = room.getProducersForOtherParticipants(userId);
  ws.send(
    JSON.stringify({
      type: "joinRoom-response",
      payload: {
        messageId: "initial-join-response", // Placeholder messageId
        data: {
          producers: existingProducers.map((p) => ({
            ...p,
            appData: room.participants.get(p.participantId)?.producers.get(p.id)
              ?.appData,
          })),
          routerRtpCapabilities: room.router.rtpCapabilities,
          participants: room.getAllParticipantsInfo(), // Send all participants info
        },
      },
    })
  );

  // Notify other participants about the new participant
  room.broadcast(userId, "newParticipant", {
    userId: participant.userId,
    userName: participant.userName,
    isHost: participant.isHost,
  });
}
