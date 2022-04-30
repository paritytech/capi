import { Init, Notif, Res } from "./messages/types.ts";

export type ListenerCb<Message extends Res | Notif = Res | Notif> = (message: Message) => void;
export type StopListening = () => void;

export interface RpcClient {
  uid: () => string;
  send: (message: Init) => void;
  listen: (listenerCb: ListenerCb) => StopListening;
  close: () => Promise<void>;
}

export type RpcClientFactory<Beacon> = (beacon: Beacon) => Promise<RpcClient>;
