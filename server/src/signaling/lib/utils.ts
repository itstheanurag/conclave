import { WebSocket } from "ws";
import type { RtpCapabilities } from "mediasoup/node/lib/types";
import { createWorker } from "mediasoup";
import { Room, roomsMap } from "./Room";
import { Participant } from "./Participant";

export async function handleJoinRoom(
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
