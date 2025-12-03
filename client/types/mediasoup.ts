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
  | JoinRoomResponse
  | RouterRtpCapabilitiesResponse
  | CreateWebRtcTransportRequest
  | CreateWebRtcTransportResponse
  | ConnectWebRtcTransportRequest
  | ProduceRequest
  | ProduceResponse
  | ConsumeRequest
  | ConsumeResponse
  | NewProducerNotification
  | ProducerClosedNotification
  | CloseProducerRequest
  | CloseProducerResponse;

export interface JoinRoomRequest {
  type: "joinRoom";
  data: {
    roomId: string;
    peerId: string;
  };
}

export interface JoinRoomResponse {
  type: "joinRoomResponse";
  data: {
    participants: MeetingParticipant[];
  };
}

export interface RouterRtpCapabilitiesResponse {
  type: "getRouterRtpCapabilitiesResponse";
  data: {
    routerRtpCapabilities: RtpCapabilities;
  };
}

export interface CreateWebRtcTransportRequest {
  type: "createWebRtcTransport";
  data: {
    direction: "send" | "recv";
  };
}

export interface CreateWebRtcTransportResponse {
  type: "createWebRtcTransportResponse";
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
  type: "connectWebRtcTransport";
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
  type: "produceResponse";
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
  type: "consumeResponse";
  data: {
    id: string;
    producerId: string;
    kind: MediaKind;
    rtpParameters: RtpParameters;
  };
}

export interface NewProducerNotification {
  type: "newProducer";
  data: {
    peerId: string;
    producerId: string;
    kind: MediaKind;
  };
}

export interface ProducerClosedNotification {
  type: "producerClosed";
  data: {
    producerId: string;
  };
}

export interface CloseProducerRequest {
  type: "closeProducer";
  data: {
    producerId: string;
  };
}

export interface CloseProducerResponse {
  type: "closeProducerResponse";
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

  newParticipant: {
    peerId: string;
    isHost: boolean;
    name: string;
  };

  participantLeft: {
    peerId: string;
  };

  deviceLoaded: undefined;
};

export type Listener<T> = (payload: T) => void;
