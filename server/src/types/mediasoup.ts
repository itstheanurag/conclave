export enum MeetingRoomEvents {
  JoinRoom = "joinRoom",
  CreateWebRtcTransport = "createWebRtcTransport",
  ConnectWebRtcTransport = "connectWebRtcTransport",
  Produce = "produce",
  CloseProducer = "closeProducer",
  Consume = "consume",
  ResumeConsumer = "resumeConsumer",
  GetRouterRtpCapabilities = "getRouterRtpCapabilities",
}

export enum MeetingRoomResponses {
  JoinRoomResponse = "joinRoomResponse",
  CreateWebRtcTransportResponse = "createWebRtcTransportResponse",
  ConnectWebRtcTransportResponse = "connectWebRtcTransportResponse",
  ProduceResponse = "produceResponse",
  CloseProducerResponse = "closeProducerResponse",
  ConsumeResponse = "consumeResponse",
  ResumeConsumerResponse = "resumeConsumerResponse",
  GetRouterRtpCapabilitiesResponse = "getRouterRtpCapabilitiesResponse",
}

export enum MeetingRoomNotifications {
  NewProducer = "newProducer",
  ProducerClosed = "producerClosed",
  NewParticipant = "newParticipant",
  ParticipantLeft = "participantLeft",
}
