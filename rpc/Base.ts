import { EgressMessage, IngressMessage } from "./method_info/mod.ts";

export type Listener = (message: IngressMessage) => void;
export type StopListening = () => void;

export interface RpcClient {
  opening: () => Promise<void>;
  uid: () => string;
  send: (message: EgressMessage) => void;
  listen: (listener: Listener) => StopListening;
  close: () => Promise<void>;
}

// const connections = Connections();
// const connection = await connections.ref("...");
// const payload = EgressMessage({
//   id: connection.uid(),
//   method: "state_getMetadata",
//   params: [],
// });
// const isPayloadResponse = IngressGuard<MethodName.StateGetMetadata>((message) => {
//   if (message.result && message.result.id === payload.id) {
//     return true;
//   }
//   return false;
// });
// const stop = connection.listen((message) => {
//   if (isPayloadResponse(message)) {
//     console.log(message);
//     stop();
//     connection.deref();
//   }
// });
