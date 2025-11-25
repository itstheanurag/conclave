import { WebSocket } from "ws";
import type {
  Transport,
  Producer,
  Consumer,
} from "mediasoup/node/lib/types";

export interface ProducerInfo {
  id: string;
  kind: "audio" | "video";
  participantId: string;
  participantName: string;
}

export class Participant {
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
    userName:string,
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
