import { WebSocket } from "ws";
import { createWebRtcTransport } from "@src/lib/mediasoup/transport";
import { roomsMap, handleJoinRoom, Room, Participant } from "./lib";
import {
  MeetingRoomEvents,
  MeetingRoomNotifications,
  MeetingRoomResponses,
} from "@src/types/mediasoup";

// Helper to find participant by their WebSocket connection
function findParticipantByWs(
  ws: WebSocket
): { room: Room; participant: Participant } | null {
  for (const room of Array.from(roomsMap.values())) {
    for (const participant of Array.from(room.participants.values())) {
      if (participant.ws === ws) {
        return { room, participant };
      }
    }
  }
  return null;
}

export async function handleMessage(ws: WebSocket, message: string) {
  const msg = JSON.parse(message);

  console.log(msg, "message recieved on backend");

  switch (msg.type) {
    case MeetingRoomEvents.JoinRoom:
      return await handleJoinRoom(
        ws,
        msg.data.roomId,
        msg.data.peerId,
        msg.data.userName
      );
    case MeetingRoomEvents.CreateWebRtcTransport: {
      // Support both { direction: 'send'/'recv' } and { producing, consuming } formats
      const { roomId, userId, producing, consuming, direction } = msg.data;

      // Determine transport direction
      const isSend = direction === "send" || producing === true;
      const isRecv = direction === "recv" || consuming === true;

      // Find the participant's room and userId from stored connection if not provided
      let room = roomId ? roomsMap.get(roomId) : undefined;
      let participant = room?.participants.get(userId);

      // If roomId/userId not provided in message, try to find from connection context
      if (!room || !participant) {
        const found = findParticipantByWs(ws);
        if (found) {
          room = found.room;
          participant = found.participant;
        }
      }

      if (!room || !participant) {
        ws.send(
          JSON.stringify({
            type: MeetingRoomResponses.CreateWebRtcTransportResponse,
            payload: {
              messageId: msg.data.messageId,
              error: "Room or participant not found",
              direction: isSend ? "send" : "recv",
            },
          })
        );
        return;
      }

      const { transport, params } = await createWebRtcTransport();

      if (isSend) {
        participant.sendTransport = transport;
      } else if (isRecv) {
        participant.recvTransport = transport;
      }

      ws.send(
        JSON.stringify({
          type: MeetingRoomResponses.CreateWebRtcTransportResponse,
          payload: {
            messageId: msg.data.messageId,
            direction: isSend ? "send" : "recv",
            params: {
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
    case MeetingRoomEvents.ConnectWebRtcTransport: {
      const { roomId, userId, transportId, dtlsParameters } = msg.data;

      // Try to find room/participant from message data first, then fallback to WS lookup
      let room = roomId ? roomsMap.get(roomId) : undefined;
      let participant = room?.participants.get(userId);

      if (!room || !participant) {
        const found = findParticipantByWs(ws);
        if (found) {
          room = found.room;
          participant = found.participant;
        }
      }

      if (!room || !participant) {
        ws.send(
          JSON.stringify({
            type: MeetingRoomResponses.ConnectWebRtcTransportResponse,
            payload: {
              messageId: msg.data.messageId,
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
            type: MeetingRoomResponses.ConnectWebRtcTransportResponse,
            payload: { messageId: msg.data.messageId, data: "connected" },
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            type: MeetingRoomResponses.ConnectWebRtcTransportResponse,
            payload: {
              messageId: msg.data.messageId,
              error: "Transport not found",
            },
          })
        );
      }
      break;
    }
    case MeetingRoomEvents.Produce: {
      const { roomId, userId, transportId, kind, rtpParameters, appData } =
        msg.data;

      // Try to find room/participant from message data first, then fallback to WS lookup
      let room = roomId ? roomsMap.get(roomId) : undefined;
      let participant = room?.participants.get(userId);

      if (!room || !participant) {
        const found = findParticipantByWs(ws);
        if (found) {
          room = found.room;
          participant = found.participant;
        }
      }

      if (!room || !participant || !participant.sendTransport) {
        ws.send(
          JSON.stringify({
            type: MeetingRoomResponses.ProduceResponse,
            payload: {
              messageId: msg.data.messageId,
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
      room.broadcast(userId, MeetingRoomNotifications.NewProducer, {
        producerId: producer.id,
        kind: producer.kind,
        participantId: participant.userId,
        participantName: participant.userName,
        appData: producer.appData, // Include appData
      });

      ws.send(
        JSON.stringify({
          type: MeetingRoomResponses.ProduceResponse,
          payload: {
            messageId: msg.data.messageId,
            data: { id: producer.id },
          },
        })
      );
      break;
    }
    case MeetingRoomEvents.CloseProducer: {
      const { roomId, userId, producerId } = msg.data;
      const room = roomsMap.get(roomId);
      const participant = room?.participants.get(userId);

      if (!room || !participant) {
        ws.send(
          JSON.stringify({
            type: MeetingRoomResponses.CloseProducerResponse,
            payload: {
              messageId: msg.data.messageId,
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
        room.broadcast(userId, MeetingRoomNotifications.ProducerClosed, {
          producerId,
        });
        ws.send(
          JSON.stringify({
            type: MeetingRoomResponses.CloseProducerResponse,
            payload: { messageId: msg.data.messageId, data: "closed" },
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            type: MeetingRoomResponses.CloseProducerResponse,
            payload: {
              messageId: msg.data.messageId,
              error: "Producer not found",
            },
          })
        );
      }
      break;
    }
    case MeetingRoomEvents.Consume: {
      const { roomId, userId, transportId, producerId, rtpCapabilities } =
        msg.data;
      const room = roomsMap.get(roomId);
      const participant = room?.participants.get(userId);

      if (!room || !participant || !participant.recvTransport) {
        ws.send(
          JSON.stringify({
            type: MeetingRoomResponses.ConsumeResponse,
            payload: {
              messageId: msg.data.messageId,
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
            type: MeetingRoomResponses.ConsumeResponse,
            payload: {
              messageId: msg.data.messageId,
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
          type: MeetingRoomResponses.ConsumeResponse,
          payload: {
            messageId: msg.data.messageId,
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
    case MeetingRoomEvents.ResumeConsumer: {
      const { roomId, userId, consumerId } = msg.data;
      const room = roomsMap.get(roomId);
      const participant = room?.participants.get(userId);

      if (!room || !participant) {
        ws.send(
          JSON.stringify({
            type: MeetingRoomResponses.ResumeConsumerResponse,
            payload: {
              messageId: msg.data.messageId,
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
            type: MeetingRoomResponses.ResumeConsumerResponse,
            payload: { messageId: msg.data.messageId, data: "resumed" },
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            type: MeetingRoomResponses.ResumeConsumerResponse,
            payload: {
              messageId: msg.data.messageId,
              error: "Consumer not found",
            },
          })
        );
      }
      break;
    }
    case MeetingRoomEvents.GetRouterRtpCapabilities: {
      const { roomId } = msg.data;
      const room = roomsMap.get(roomId);

      if (!room) {
        ws.send(
          JSON.stringify({
            type: MeetingRoomResponses.GetRouterRtpCapabilitiesResponse,
            payload: {
              messageId: msg.data.messageId,
              error: "Room not found",
            },
          })
        );
        return;
      }

      ws.send(
        JSON.stringify({
          type: MeetingRoomResponses.GetRouterRtpCapabilitiesResponse,
          payload: {
            messageId: msg.data.messageId,
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
