import { WebSocket } from "ws";
import { createWebRtcTransport } from "@src/lib/mediasoup/transport";
import { roomsMap, handleJoinRoom } from "./lib";

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
