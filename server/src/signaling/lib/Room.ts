import type { Router } from "mediasoup/node/lib/types";
import { Participant, ProducerInfo } from "./Participant";

export class Room {
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

export const roomsMap = new Map<string, Room>(); // roomId -> Room
