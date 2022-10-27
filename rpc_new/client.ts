import { Deferred, deferred } from "../deps/std/async.ts";
import * as U from "../util/mod.ts";
import * as msg from "./messages.ts";
import {
  Provider,
  ProviderHandlerError,
  ProviderListener,
  ProviderSendError,
} from "./provider/mod.ts";

export class Client<DiscoveryValue, SendE, InternalE, CloseE> {
  providerRef;
  listeners = new Set<U.Listener<msg.IngressMessage | InternalE>>();
  pendingCalls: Record<string, Deferred<unknown>> = {};

  constructor(
    readonly provider: Provider<DiscoveryValue, InternalE, SendE, CloseE>,
    readonly discoveryValue: DiscoveryValue,
  ) {
    this.providerRef = provider(discoveryValue, this.#listener);
  }

  #listener: ProviderListener<InternalE, SendE> = (e) => {
    if (e instanceof Error) {
      for (const id in this.pendingCalls) {
        const pendingCall = this.pendingCalls[id]!;
        pendingCall.resolve(e);
        delete this.pendingCalls[id];
      }
    } else if (e.id) {
      const pendingCall = this.pendingCalls[e.id]!;
      pendingCall.resolve(e);
      delete this.pendingCalls[e.id];
    } else if (e.params) {
      // TODO: subscription
    }
  };

  call: ClientCall<SendE, InternalE> = (message) => {
    const waiter = deferred<
      msg.OkMessage | msg.ErrorMessage | ProviderSendError<SendE> | ProviderHandlerError<InternalE>
    >();
    this.pendingCalls[message.id] = waiter;
    this.providerRef.send(message);
    return waiter;
  };

  close = () => {
    return this.providerRef.release();
  };
}

export type ClientCall<SendE, InternalE> = (message: msg.EgressMessage) => Promise<
  msg.OkMessage | msg.ErrorMessage | ProviderSendError<SendE> | ProviderHandlerError<InternalE>
>;
