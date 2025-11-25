import { Device } from "mediasoup-client";
import {
  JoinRoomRequest,
  CreateWebRtcTransportRequest,
  ConnectWebRtcTransportRequest,
  ProduceRequest,
  ProduceResponse,
  ConsumeRequest,
  ConsumeResponse,
  NewProducerNotification,
  ProducerClosedNotification,
  ProducerInfo,
  MediasoupClientOptions,
  WebSocketMessage,
  Listener,
  MediasoupEvents,
} from "../types/mediasoup";

import type {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
  Transport,
} from "mediasoup-client/types";

/* ---------- Typed EventEmitter ---------- */

class TypedEventEmitter<E extends Record<string, any>> {
  private listeners: {
    [K in keyof E]?: Listener<E[K]>[];
  } = {};

  on<K extends keyof E>(event: K, listener: Listener<E[K]>): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof E>(event: K, listener: Listener<E[K]>): void {
    const arr = this.listeners[event];
    if (!arr) return;
    this.listeners[event] = arr.filter((l) => l !== listener);
  }

  emit<K extends keyof E>(event: K, payload: E[K]): void {
    const arr = this.listeners[event];
    if (!arr) return;
    arr.forEach((listener) => listener(payload));
  }
}

/* ---------- MediasoupClient ---------- */

export class MediasoupClient extends TypedEventEmitter<MediasoupEvents> {
  private device: Device | undefined;
  private ws: WebSocket;
  private roomId: string;
  private peerId: string;
  private sendTransport: Transport | undefined;
  private recvTransport: Transport | undefined;
  private producers: Map<string, ProducerInfo> = new Map();
  private consumers: Map<string, MediaStreamTrack> = new Map();
  private _localStream: MediaStream | undefined;

  constructor(options: MediasoupClientOptions) {
    super();
    this.roomId = options.roomId;
    this.peerId = options.peerId;
    this.ws = new WebSocket(options.websocketUrl);
    this.ws.onopen = this.handleWsOpen;
    this.ws.onmessage = this.handleWsMessage;
    this.ws.onclose = this.handleWsClose;
    this.ws.onerror = this.handleWsError;
  }

  /* ---------- WebSocket handlers ---------- */

  private handleWsOpen = () => {
    console.log("WebSocket connected");

    const message: JoinRoomRequest = {
      type: "joinRoom",
      data: { roomId: this.roomId, peerId: this.peerId },
    };

    this.ws.send(JSON.stringify(message));
  };

  private handleWsMessage = async (event: MessageEvent) => {
    const message: WebSocketMessage = JSON.parse(event.data);
    console.log("WebSocket message received:", message);

    switch (message.type) {
      case "getRouterRtpCapabilitiesResponse": {
        const rtpCapabilities = message.data?.routerRtpCapabilities;
        if (!rtpCapabilities) {
          console.error("Invalid RTP caps response:", message);
          return;
        }

        await this.loadDevice(rtpCapabilities);
        break;
      }

      case "newProducer": {
        const { peerId, producerId, kind } = (
          message as NewProducerNotification
        ).data;

        await this.createConsumer(peerId, producerId, kind);

        break;
      }

      case "producerClosed": {
        const { producerId } = (message as ProducerClosedNotification).data;
        this.removeConsumer(producerId);
        break;
      }

      case "createWebRtcTransportResponse": {
        const { direction, params } = message.data;

        if (direction === "send") {
          this.sendTransport = this.device?.createSendTransport(params);

          this.sendTransport?.on(
            "connect",
            ({ dtlsParameters }, callback, errback) => {
              const connectMsg: ConnectWebRtcTransportRequest = {
                type: "connectWebRtcTransport",
                data: {
                  transportId: this.sendTransport!.id,
                  dtlsParameters,
                },
              };

              this.send(connectMsg).then(callback).catch(errback);
            }
          );

          this.sendTransport?.on(
            "produce",
            async ({ kind, rtpParameters, appData }, callback, errback) => {
              try {
                const req: ProduceRequest = {
                  type: "produce",
                  data: {
                    transportId: this.sendTransport!.id,
                    kind,
                    rtpParameters,
                    appData,
                  },
                };

                const { id } = await this.send<ProduceResponse["data"]>(req);
                callback({ id });
              } catch (err) {
                errback(err as any);
              }
            }
          );
        } else {
          this.recvTransport = this.device?.createRecvTransport(params);

          this.recvTransport?.on(
            "connect",
            ({ dtlsParameters }, callback, errback) => {
              const connectMsg: ConnectWebRtcTransportRequest = {
                type: "connectWebRtcTransport",
                data: {
                  transportId: this.recvTransport!.id,
                  dtlsParameters,
                },
              };

              this.send(connectMsg).then(callback).catch(errback);
            }
          );
        }

        break;
      }

      default:
        console.warn("Unknown WebSocket message type:", message.type);
    }
  };

  private handleWsClose = () => {
    console.log("WebSocket disconnected");
  };

  private handleWsError = (error: Event) => {
    console.error("WebSocket error:", error);
  };

  /* ---------- Typed send() ---------- */

  private send = <T = any>(message: WebSocketMessage): Promise<T> => {
    return new Promise((resolve, reject) => {
      this.ws.send(JSON.stringify(message));

      const expectedResponseType = `${message.type}Response`;

      const handleResponse = (event: MessageEvent) => {
        const response = JSON.parse(event.data);

        if (response.type === expectedResponseType) {
          this.ws.removeEventListener("message", handleResponse);

          if (response.error) return reject(new Error(response.error));

          resolve(response.data as T);
        }
      };

      this.ws.addEventListener("message", handleResponse);
    });
  };

  /* ---------- Device & Transports ---------- */

  private async loadDevice(routerRtpCapabilities: RtpCapabilities) {
    try {
      this.device = new Device();
      await this.device.load({ routerRtpCapabilities });

      console.log("Mediasoup device loaded");

      this.send<CreateWebRtcTransportRequest>({
        type: "createWebRtcTransport",
        data: { direction: "send" },
      });

      this.send<CreateWebRtcTransportRequest>({
        type: "createWebRtcTransport",
        data: { direction: "recv" },
      });
    } catch (err: any) {
      console.error("Error loading mediasoup device:", err);
    }
  }

  /* ---------- Local Media ---------- */

  public async enableWebcam() {
    if (!this.device?.canProduce("video")) {
      console.error("Cannot produce video");
      return;
    }

    this._localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const track = this._localStream.getVideoTracks()[0];
    const producer = await this.sendTransport?.produce({ track });

    if (producer) {
      this.producers.set(producer.id, {
        id: producer.id,
        kind: "video",
        track,
        appData: producer.appData,
      });

      this.emit("localStream", this._localStream);
    }
  }

  public async enableMic() {
    if (!this.device?.canProduce("audio")) {
      console.error("Cannot produce audio");
      return;
    }

    if (!this._localStream) {
      this._localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    }

    const track = this._localStream.getAudioTracks()[0];
    const producer = await this.sendTransport?.produce({ track });

    if (producer) {
      this.producers.set(producer.id, {
        id: producer.id,
        kind: "audio",
        track,
      });

      this.emit("localStream", this._localStream);
    }
  }

  /* ---------- Disable Webcam ---------- */
  public async disableWebcam() {
    const videoProducer = Array.from(this.producers.values()).find(
      (p) => p.kind === "video" && !p.appData?.share
    );

    if (!videoProducer) return;

    // Stop track
    videoProducer.track.stop();

    // Close producer on server
    await this.send({
      type: "closeProducer",
      data: {
        producerId: videoProducer.id,
      },
    });

    this.producers.delete(videoProducer.id);

    // Update local preview
    if (this._localStream) {
      const videoTrack = this._localStream.getVideoTracks()[0];
      if (videoTrack) this._localStream.removeTrack(videoTrack);
      this.emit("localStream", this._localStream);
    }

    console.log("Webcam disabled");
  }

  /* ---------- Disable Microphone ---------- */
  public async disableMic() {
    const audioProducer = Array.from(this.producers.values()).find(
      (p) => p.kind === "audio"
    );

    if (!audioProducer) {
      console.warn("No active mic producer found");
      return;
    }

    // Stop the track locally
    audioProducer.track.stop();

    // Tell server to close this producer
    await this.send({
      type: "closeProducer",
      data: {
        producerId: audioProducer.id,
      },
    });

    // Remove from local map
    this.producers.delete(audioProducer.id);

    // Update local preview
    if (this._localStream) {
      const audioTrack = this._localStream.getAudioTracks()[0];
      if (audioTrack) this._localStream.removeTrack(audioTrack);
      this.emit("localStream", this._localStream);
    }

    console.log("Microphone disabled");
  }

  /* ---------- Enable Screen Share ---------- */
  public async enableScreenShare() {
    if (!this.device?.canProduce("video")) {
      console.error("Cannot produce screen share");
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const track = screenStream.getVideoTracks()[0];

      const producer = await this.sendTransport?.produce({
        track,
        appData: { share: true },
      });

      if (producer) {
        this.producers.set(producer.id, {
          id: producer.id,
          kind: "video",
          track,
          appData: producer.appData,
        });

        // Replace local stream preview only if needed
        this.emit("localStream", this._localStream);

        track.onended = async () => {
          console.log("Screen share ended");
          await this.disableScreenShare();
        };

        console.log("Screen share enabled");
      }
    } catch (error) {
      console.error("Error enabling screen share:", error);
    }
  }

  /* ---------- Disable Screen Share ---------- */
  public async disableScreenShare() {
    const shareProducer = Array.from(this.producers.values()).find(
      (p) => p.kind === "video" && p.appData?.share
    );

    if (!shareProducer) return;

    // Stop track
    shareProducer.track.stop();

    // Tell server to close producer
    await this.send({
      type: "closeProducer",
      data: {
        producerId: shareProducer.id,
      },
    });

    this.producers.delete(shareProducer.id);

    this.emit("localStream", this._localStream);

    console.log("Screen share disabled");
  }

  /* ---------- Remote Consumers ---------- */

  private async createConsumer(
    peerId: string,
    producerId: string,
    kind: MediaKind
  ) {
    if (!this.device) {
      console.error("Device not loaded");
      return;
    }

    if (!this.recvTransport) {
      console.error("No recvTransport available");
      return;
    }

    try {
      const consumeRequest: ConsumeRequest = {
        type: "consume",
        data: {
          transportId: this.recvTransport.id,
          producerId,
          rtpCapabilities: this.device.rtpCapabilities,
        },
      };

      // Server returns rtpParameters HERE
      const { id, rtpParameters } = await this.send<ConsumeResponse["data"]>(
        consumeRequest
      );

      const consumer = await this.recvTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
      });

      if (consumer) {
        this.consumers.set(producerId, consumer.track);

        this.emit("newConsumer", {
          peerId,
          producerId,
          kind,
          track: consumer.track,
        });
      }
    } catch (error) {
      console.error("Error creating consumer:", error);
    }
  }

  private removeConsumer(producerId: string) {
    const track = this.consumers.get(producerId);
    if (track) {
      track.stop();
      this.consumers.delete(producerId);

      this.emit("consumerClosed", { producerId });
    }
  }

  /* ---------- Helpers ---------- */

  getLocalStream() {
    return this._localStream;
  }

  getConsumers() {
    return Array.from(this.consumers.entries()).map(([id, track]) => ({
      id,
      track,
    }));
  }

  public close() {
    this.ws.close();
    this.sendTransport?.close();
    this.recvTransport?.close();

    this.producers.forEach((p) => p.track.stop());
    this.consumers.forEach((t) => t.stop());

    this.device = undefined;
    this._localStream = undefined;

    this.producers.clear();
    this.consumers.clear();

    console.log("MediasoupClient closed");
  }
}
