import { Device } from "mediasoup-client";

type Transport = ReturnType<Device["createSendTransport"]>;
let device: Device;
let sendTransport: Transport;
let recvTransport: Transport;

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
  console.log("Connected to signaling server");
};

socket.onmessage = async (message) => {
  const data = JSON.parse(message.data);

  switch (data.type) {
    case "routerRtpCapabilities":
      await loadDevice(data.payload);
      break;
    case "transportCreated":
      await createTransport(data.payload, data.payload.direction);
      break;
    case "consumerCreated":
      await createConsumer(data.payload);
      break;
    // Handle other signaling messages
  }
};

const loadDevice = async (routerRtpCapabilities: any) => {
  try {
    device = new Device();
    await device.load({ routerRtpCapabilities });
    console.log("Device loaded");
    
    socket.send(
      JSON.stringify({
        type: "createTransport",
        payload: { direction: "send" },
      })
    );

    socket.send(
      JSON.stringify({
        type: "createTransport",
        payload: { direction: "recv" },
      })
    );
  } catch (error) {
    console.error("Error loading device:", error);
  }
};

const createTransport = async (
  transportParams: any,
  direction: "send" | "recv"
) => {
  try {
    if (direction === "send") {
      sendTransport = device.createSendTransport(transportParams);
      console.log("Send transport created");

      sendTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          try {
            socket.send(
              JSON.stringify({
                type: "connectTransport",
                payload: { id: sendTransport.id, dtlsParameters },
              })
            );
            callback();
          } catch (error) {
            errback(error as Error);
          }
        }
      );

      sendTransport.on("produce", async (parameters, callback, errback) => {
        try {
          socket.send(
            JSON.stringify({
              type: "createProducer",
              payload: {
                transportId: sendTransport.id,
                kind: parameters.kind,
                rtpParameters: parameters.rtpParameters,
              },
            })
          );
          socket.onmessage = (message) => {
            const data = JSON.parse(message.data);
            if (data.type === "producerCreated") {
              callback({ id: data.payload.id });
            }
          };
        } catch (error) {
          errback(error as Error);
        }
      });

      const stream = await getMediaStream();
      if (stream) {
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          await sendTransport.produce({ track: videoTrack });
        }
      }
    } else if (direction === "recv") {
      recvTransport = device.createRecvTransport(transportParams);
      console.log("Recv transport created");

      recvTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          try {
            socket.send(
              JSON.stringify({
                type: "connectTransport",
                payload: { id: recvTransport.id, dtlsParameters },
              })
            );
            callback();
          } catch (error) {
            errback(error as Error);
          }
        }
      );
    }
  } catch (error) {
    console.error("Error creating transport:", error);
  }
};

const createConsumer = async (consumerParams: any) => {
  try {
    const consumer = await recvTransport.consume(consumerParams);
    console.log("Consumer created");

    const { track } = consumer;
    const stream = new MediaStream();
    stream.addTrack(track);

    // TODO: Add the stream to the UI
  } catch (error) {
    console.error("Error creating consumer:", error);
  }
};

export const getMediaStream = async () => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  } catch (error) {
    console.error("Error getting media stream:", error);
    return null;
  }
};

export const getDevice = () => device;
