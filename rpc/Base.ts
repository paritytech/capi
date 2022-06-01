import { IngressMessage, InitMessage } from "./messages.ts";

export type ListenerCb<IngressMessage_ extends IngressMessage = IngressMessage> = (
  ingressMessage: IngressMessage_,
) => void;

export type StopListening = () => void;

export abstract class RpcClient {
  #nextId = 0;

  uid = (): string => {
    return (this.#nextId++).toString();
  };

  abstract send: (egressMessage: InitMessage) => void;
  abstract listen: (listenerCb: ListenerCb) => StopListening;
  abstract close: () => Promise<void>;
}

export type RpcClientFactory<Beacon> = (beacon: Beacon) => Promise<RpcClient>;
