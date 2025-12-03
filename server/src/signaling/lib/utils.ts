import { WebSocket } from "ws";
import { getWorker, mediaCodecs } from "@src/lib/mediasoup/worker";
import { Room, roomsMap } from "./Room";
import { Participant } from "./Participant";
import {
  MeetingRoomNotifications,
  MeetingRoomResponses,
} from "@src/types/mediasoup";

export async function handleJoinRoom(
  ws: WebSocket,
  roomId: string,
  peerId: string,
  userName: string
) {
  let room = roomsMap.get(roomId);
  if (!room) {
    console.log("Room does not exists creating one");
    const worker = getWorker();
    const router = await worker.createRouter({ mediaCodecs });
    room = new Room(roomId, router);
    roomsMap.set(roomId, room);
    console.log(`✨ New room created: ${roomId}`);
  }

  const isHost = room.participants.size === 0; // First participant to join is host
  const participant = new Participant(ws, peerId, userName, isHost);
  room.addParticipant(participant);
  console.log(`🟢 Participant ${userName} (${peerId}) joined room: ${roomId}`);

  // Send existing producers and all participants info to the joining client
  const existingProducers = room.getProducersForOtherParticipants(peerId);
  ws.send(
    JSON.stringify({
      type: MeetingRoomResponses.JoinRoomResponse,
      payload: {
        messageId: MeetingRoomResponses.JoinRoomResponse, // Placeholder messageId
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
  room.broadcast(peerId, MeetingRoomNotifications.NewParticipant, {
    userId: participant.userId,
    userName: participant.userName,
    isHost: participant.isHost,
  });
}

export function handleDisconnect(roomId: string, peerId: string) {
  const room = roomsMap.get(roomId);
  if (!room) return;

  room.removeParticipant(peerId);
  console.log(`🔴 Participant ${peerId} left room: ${roomId}`);

  // Notify others
  room.broadcast(peerId, MeetingRoomNotifications.ParticipantLeft, {
    userId: peerId,
  });

  if (room.participants.size === 0) {
    room.close();
    roomsMap.delete(roomId);
    console.log(`🔥 Room ${roomId} closed (empty)`);
  }
}
