import * as msg from "./msg.ts";
import { ProviderFactory } from "./provider.ts";

export class Client<DiscoveryValue, SendE, HandlerE, CloseE> {
  provider;
  listeners = new Set<Listener<msg.Ingress | HandlerE>>();

  constructor(
    readonly providerFactory: ProviderFactory<DiscoveryValue, HandlerE, SendE, CloseE>,
    readonly discoveryValue: DiscoveryValue,
  ) {
    this.provider = providerFactory(discoveryValue, this.#parentListener);
  }

  #parentListener = (e: msg.Ingress | HandlerE) => {
    for (const listener of this.listeners) {
      listener(e);
    }
  };

  call: ClientCall = () => {};

  subscribe: ClientSubscribe<SendE, HandlerE> = (
    message,
    createListener,
  ) => {
    const listener = createListener(() => {
      this.listeners.delete(listenerNormalized);
    });
    const listenerNormalized = () => {};
    return Promise.resolve();
  };
}
export type ClientCall = (message: msg.Egress) => void;
export type ClientSubscribe<SendE, InternalE> = (
  message: msg.Egress,
  createListener: CreateListener<InternalE | msg.Notif>,
) => Promise<void | SendE>;
export type CreateListener<Event> = (stop: () => void) => Listener<Event>;
export type Listener<Event> = (event: Event) => void;
