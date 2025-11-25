import { Device, Producer } from 'mediasoup-client';
import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
  Transport,
} from 'mediasoup-client/lib/types';
import {
  JoinRoomRequest,
  RoomRouterRtpCapabilitiesResponse,
  CreateWebRtcTransportRequest,
  WebRtcTransportCreatedResponse,
  ConnectWebRtcTransportRequest,
  ProduceRequest,
  ProduceResponse,
  ConsumeRequest,
  ConsumeResponse,
  NewProducerNotification,
  ProducerClosedNotification,
} from '../types/mediasoup';

// Basic EventEmitter implementation
class EventEmitter {
  private listeners: { [event: string]: Function[] } = {};

  on(event: string, listener: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event: string, listener: Function) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach(listener => listener(...args));
  }
}

interface MediasoupClientOptions {
  websocketUrl: string;
  roomId: string;
  peerId: string;
}

interface ProducerInfo<T extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  kind: MediaKind;
  track: MediaStreamTrack;
  appData?: T;
}

export class MediasoupClient extends EventEmitter {
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

  private handleWsOpen = () => {
    console.log('WebSocket connected');
    const message: JoinRoomRequest = { type: 'join-room', data: { roomId: this.roomId, peerId: this.peerId } };
    this.ws.send(JSON.stringify(message));
  };

  private handleWsMessage = async (event: MessageEvent) => {
    const message = JSON.parse(event.data);
    console.log('WebSocket message received:', message);

    switch (message.type) {
      case 'room-router-rtp-capabilities':
        await this.loadDevice((message as RoomRouterRtpCapabilitiesResponse).data.routerRtpCapabilities);
        break;
      case 'new-producer':
        const newProducerMsg = message as NewProducerNotification;
        await this.createConsumer(
          newProducerMsg.data.peerId,
          newProducerMsg.data.producerId,
          newProducerMsg.data.kind,
          newProducerMsg.data.rtpParameters,
        );
        break;
      case 'producer-closed':
        const producerClosedMsg = message as ProducerClosedNotification;
        this.removeConsumer(producerClosedMsg.data.producerId);
        break;
      case 'web-rtc-transport-created':
        const transportCreatedMsg = message as WebRtcTransportCreatedResponse;
        if (transportCreatedMsg.data.direction === 'send') {
          this.sendTransport = this.device?.createSendTransport(transportCreatedMsg.data.params);
          this.sendTransport?.on('connect', ({ dtlsParameters }, callback, errback) => {
            const connectTransportMsg: ConnectWebRtcTransportRequest = {
              type: 'connect-web-rtc-transport',
              data: {
                transportId: this.sendTransport?.id as string,
                dtlsParameters,
              },
            };
            this.send(connectTransportMsg)
              .then(callback)
              .catch(errback);
          });
          this.sendTransport?.on('produce', async ({ kind, rtpParameters, appData }, callback, errback) => {
            try {
              const produceRequest: ProduceRequest = {
                type: 'produce',
                data: {
                  transportId: this.sendTransport?.id as string,
                  kind,
                  rtpParameters,
                  appData,
                },
              };
              const { id } = await this.send<ProduceResponse>(produceRequest);
              callback({ id });
            } catch (error) {
              errback(error);
            }
          });
          this.sendTransport?.on('producedata', (parameters, callback, errback) => {
            console.log('producedata', parameters);
          });
        } else {
          this.recvTransport = this.device?.createRecvTransport(transportCreatedMsg.data.params);
          this.recvTransport?.on('connect', ({ dtlsParameters }, callback, errback) => {
            const connectTransportMsg: ConnectWebRtcTransportRequest = {
              type: 'connect-web-rtc-transport',
              data: {
                transportId: this.recvTransport?.id as string,
                dtlsParameters,
              },
            };
            this.send(connectTransportMsg)
              .then(callback)
              .catch(errback);
          });
        }
        break;
      default:
        console.warn('Unknown WebSocket message type:', message.type);
    }
  };

  private handleWsClose = () => {
    console.log('WebSocket disconnected');
  };

  private handleWsError = (error: Event) => {
    console.error('WebSocket error:', error);
  };

  private send = <T = any>(message: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      this.ws.send(JSON.stringify(message));

      const handleResponse = (event: MessageEvent) => {
        const response = JSON.parse(event.data);
        if (response.type === `${message.type}-response`) {
          this.ws.removeEventListener('message', handleResponse);
          if (response.error) {
            reject(new Error(response.error));
          }
          else {
            resolve(response.data);
          }
        }
      };
      this.ws.addEventListener('message', handleResponse);
    });
  };

  private async loadDevice(routerRtpCapabilities: RtpCapabilities) {
    try {
      this.device = new Device();
      await this.device.load({ routerRtpCapabilities });
      console.log('Mediasoup device loaded');
      const createSendTransportRequest: CreateWebRtcTransportRequest = { type: 'create-web-rtc-transport', data: { direction: 'send' } };
      this.send(createSendTransportRequest);
      const createRecvTransportRequest: CreateWebRtcTransportRequest = { type: 'create-web-rtc-transport', data: { direction: 'recv' } };
      this.send(createRecvTransportRequest);
    } catch (error) {
      console.error('Error loading mediasoup device:', error);
      if (error.name === 'UnsupportedError') {
        console.error('Browser not supported');
      }
    }
  }

  public async enableWebcam() {
    if (!this.device?.canProduce('video')) {
      console.error('Cannot produce video');
      return;
    }
    try {
      this._localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const track = this._localStream.getVideoTracks()[0];
      const producer = await this.sendTransport?.produce({ track });
      if (producer) {
        this.producers.set(producer.id, { id: producer.id, kind: 'video', track, appData: producer.appData });
        console.log('Webcam enabled', producer);
        this.emit('localStream', this._localStream);
      }
    } catch (error) {
      console.error('Error enabling webcam:', error);
    }
  }

  public async enableMic() {
    if (!this.device?.canProduce('audio')) {
      console.error('Cannot produce audio');
      return;
    }
    try {
      if (!this._localStream) {
        this._localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      const track = this._localStream.getAudioTracks()[0];
      const producer = await this.sendTransport?.produce({ track });
      if (producer) {
        this.producers.set(producer.id, { id: producer.id, kind: 'audio', track, appData: producer.appData });
        console.log('Mic enabled', producer);
        this.emit('localStream', this._localStream);
      }
    } catch (error) {
      console.error('Error enabling mic:', error);
    }
  }

  public async enableScreenShare() {
    if (!this.device?.canProduce('video')) {
      console.error('Cannot produce video (screen share)');
      return;
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = screenStream.getVideoTracks()[0];
      const producer = await this.sendTransport?.produce({ track, appData: { share: true } });
      if (producer) {
        this.producers.set(producer.id, { id: producer.id, kind: 'video', track, appData: producer.appData });
        console.log('Screen share enabled', producer);
        this.emit('localStream', this._localStream);
        track.onended = async () => {
          console.log('Screen share ended');
          await this.disableScreenShare();
        };
      }
    } catch (error) {
      console.error('Error enabling screen share:', error);
    }
  }

  public async disableWebcam() {
    const videoProducer = Array.from(this.producers.values()).find(p => p.kind === 'video' && !p.appData?.share);
    if (videoProducer) {
      videoProducer.track.stop();
      // TODO: Tell server to close producer
      this.producers.delete(videoProducer.id);
      console.log('Webcam disabled');
      this.emit('localStream', this._localStream);
    }
  }

  public async disableMic() {
    const audioProducer = Array.from(this.producers.values()).find(p => p.kind === 'audio');
    if (audioProducer) {
      audioProducer.track.stop();
      // TODO: Tell server to close producer
      this.producers.delete(audioProducer.id);
      console.log('Mic disabled');
      this.emit('localStream', this._localStream);
    }
  }

  public async disableScreenShare() {
    const screenProducer = Array.from(this.producers.values()).find(p => p.kind === 'video' && p.appData?.share);
    if (screenProducer) {
      screenProducer.track.stop();
      // TODO: Tell server to close producer
      this.producers.delete(screenProducer.id);
      console.log('Screen share disabled');
      this.emit('localStream', this._localStream);
    }
  }

  private async createConsumer(
    peerId: string,
    producerId: string,
    kind: MediaKind,
    rtpParameters: RtpParameters,
  ) {
    if (!this.device?.canConsume({ producerId, rtpCapabilities: this.device.rtpCapabilities })) {
      console.error('Cannot consume');
      return;
    }
    try {
      const { id } = await this.send<ConsumeResponse>('consume', {
        transportId: this.recvTransport?.id,
        producerId,
        rtpCapabilities: this.device.rtpCapabilities,
      });
      const consumer = await this.recvTransport?.consume({
        id,
        producerId,
        kind,
        rtpParameters,
      });
      if (consumer) {
        this.consumers.set(consumer.id, consumer.track);
        console.log('New consumer', consumer);
        this.emit('newConsumer', { peerId, producerId, kind, track: consumer.track });
      }
    } catch (error) {
      console.error('Error creating consumer:', error);
    }
  }

  private removeConsumer(producerId: string) {
    const consumerTrack = this.consumers.get(producerId);
    if (consumerTrack) {
      consumerTrack.stop();
      this.consumers.delete(producerId);
      console.log('Consumer removed', producerId);
      this.emit('consumerClosed', { producerId });
    }
  }

  public getLocalStream() {
    return this._localStream;
  }

  public getConsumers() {
    return Array.from(this.consumers.entries()).map(([id, track]) => ({ id, track }));
  }

  public close() {
    this.ws.close();
    this.sendTransport?.close();
    this.recvTransport?.close();
    this.producers.forEach(producer => producer.track.stop());
    this.consumers.forEach(track => track.stop());
    this.device = undefined;
    this._localStream = undefined;
    this.producers.clear();
    this.consumers.clear();
    console.log('MediasoupClient closed');
  }
}
