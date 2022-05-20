import { IngressMessage, Init } from "./messages.ts";

export type ListenerCb<IngressMessage_ extends IngressMessage = IngressMessage> = (
  ingressMessage: IngressMessage_,
) => void;

export type StopListening = () => void;

export interface RpcClient {
  uid: () => string;
  send: (egressMessage: Init) => void;
  listen: (listenerCb: ListenerCb) => StopListening;
  close: () => Promise<void>;
}

export type RpcClientFactory<Beacon> = (beacon: Beacon) => Promise<RpcClient>;
