import {
  DtlsParameters,
  IceCandidate,
  IceParameters,
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup-client/types";

export type WebSocketMessage =
  | JoinRoomRequest
  | RoomRouterRtpCapabilitiesResponse
  | CreateWebRtcTransportRequest
  | WebRtcTransportCreatedResponse
  | ConnectWebRtcTransportRequest
  | ProduceRequest
  | ProduceResponse
  | ConsumeRequest
  | ConsumeResponse
  | NewProducerNotification
  | ProducerClosedNotification;

export interface JoinRoomRequest {
  type: "join-room";
  data: {
    roomId: string;
    peerId: string;
  };
}

export interface RoomRouterRtpCapabilitiesResponse {
  type: "room-router-rtp-capabilities";
  data: {
    routerRtpCapabilities: RtpCapabilities;
  };
}

export interface CreateWebRtcTransportRequest {
  type: "create-web-rtc-transport";
  data: {
    direction: "send" | "recv";
  };
}

export interface WebRtcTransportCreatedResponse {
  type: "web-rtc-transport-created";
  data: {
    direction: "send" | "recv";
    params: {
      id: string;
      iceParameters: IceParameters;
      iceCandidates: IceCandidate[];
      dtlsParameters: DtlsParameters;
    };
  };
}

export interface ConnectWebRtcTransportRequest {
  type: "connect-web-rtc-transport";
  data: {
    transportId: string;
    dtlsParameters: DtlsParameters;
  };
}

export interface ProduceRequest {
  type: "produce";
  data: {
    transportId: string;
    kind: MediaKind;
    rtpParameters: RtpParameters;
    appData?: Record<string, unknown>;
  };
}

export interface ProduceResponse {
  type: "produce-response";
  data: {
    id: string;
  };
}

export interface ConsumeRequest {
  type: "consume";
  data: {
    transportId: string;
    producerId: string;
    rtpCapabilities: RtpCapabilities;
  };
}

export interface ConsumeResponse {
  type: "consume-response";
  data: {
    id: string;
    producerId: string;
    kind: MediaKind;
    rtpParameters: RtpParameters;
  };
}

export interface NewProducerNotification {
  type: "new-producer";
  data: {
    peerId: string;
    producerId: string;
    kind: MediaKind;
    rtpParameters: RtpParameters;
  };
}

export interface ProducerClosedNotification {
  type: "producer-closed";
  data: {
    producerId: string;
  };
}

export interface MediasoupClientOptions {
  websocketUrl: string;
  roomId: string;
  peerId: string;
}

export interface ProducerInfo<
  T extends Record<string, unknown> = Record<string, unknown>
> {
  id: string;
  kind: MediaKind;
  track: MediaStreamTrack;
  appData?: T;
}

export interface MeetingParticipant {
  id: string;
  name: string;
  isLocal: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isHost: boolean;
  isSpeaking?: boolean;
  stream?: MediaStream;
  isScreenShare?: boolean;
}

export type MediasoupEvents = {
  localStream: MediaStream | undefined;
  newConsumer: {
    peerId: string;
    producerId: string;
    kind: MediaKind;
    track: MediaStreamTrack;
  };
  consumerClosed: {
    producerId: string;
  };
};

export type Listener<T> = (payload: T) => void;
