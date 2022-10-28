import { Deferred, deferred } from "../deps/std/async.ts";
import * as msg from "./messages.ts";
import {
  Provider,
  ProviderHandlerError,
  ProviderListener,
  ProviderSendError,
} from "./provider/mod.ts";
import * as U from "./util.ts";

export class Client<DiscoveryValue, SendE, InternalE, CloseE> {
  providerRef;
  // Is this used?
  // listeners = new Set<U.Listener<msg.IngressMessage | InternalE>>();
  pendingCalls: Record<string, Deferred<unknown>> = {};
  pendingSubscriptions: Record<
    string,
    U.Listener<
      | msg.NotificationMessage
      | msg.ErrorMessage
      | ProviderSendError<SendE>
      | ProviderHandlerError<InternalE>
    >
  > = {};
  activeSubscriptions: Record<
    string,
    U.Listener<
      | msg.NotificationMessage
      | msg.ErrorMessage
      | ProviderSendError<SendE>
      | ProviderHandlerError<InternalE>
    >
  > = {};
  activeSubscriptionByMessageId: Record<string, string> = {};

  constructor(
    readonly provider: Provider<DiscoveryValue, InternalE, SendE, CloseE>,
    readonly discoveryValue: DiscoveryValue,
  ) {
    this.providerRef = provider(discoveryValue, this.#listener);
  }

  #listener: ProviderListener<InternalE, SendE, CloseE> = (e) => {
    if (e instanceof Error) {
      for (const id in this.pendingCalls) {
        const pendingCall = this.pendingCalls[id]!;
        pendingCall.resolve(e);
        delete this.pendingCalls[id];
        this.pendingSubscriptions[id]?.(e);
        delete this.pendingSubscriptions[id];
      }
      for (const id in this.activeSubscriptions) {
        this.activeSubscriptions[id]?.(e);
        delete this.activeSubscriptions[id];
      }
    } else if (e.id) {
      const pendingCall = this.pendingCalls[e.id]!;
      pendingCall.resolve(e);
      delete this.pendingCalls[e.id];
      if (this.pendingSubscriptions[e.id]) {
        if (e.error) {
          this.pendingSubscriptions[e.id]!(e);
        } else {
          this.activeSubscriptions[e.result] = this.pendingSubscriptions[e.id]!;
          this.activeSubscriptionByMessageId[e.id] = e.result;
        }
        delete this.pendingSubscriptions[e.id];
      }
    } else if (e.params) {
      this.activeSubscriptions[e.params.subscription]?.(e);
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

  subscribe: ClientSubscribe<SendE, InternalE> = (message, listener) => {
    const stop = () => {
      delete this.pendingSubscriptions[message.id];
      const activeSubscriptionId = this.activeSubscriptionByMessageId[message.id];
      if (activeSubscriptionId) {
        delete this.activeSubscriptions[activeSubscriptionId];
      }
    };
    this.pendingSubscriptions[message.id] = listener.bind({ stop });
    this.call(message);
  };

  close = () => {
    return this.providerRef.release();
  };
}

export type ClientCall<SendE, InternalE> = (message: msg.EgressMessage) => Promise<
  msg.OkMessage | msg.ErrorMessage | ProviderSendError<SendE> | ProviderHandlerError<InternalE>
>;

export type ClientSubscribe<SendE, InternalE> = (
  message: msg.EgressMessage,
  listener: U.Listener<
    | msg.NotificationMessage
    | msg.ErrorMessage
    | ProviderSendError<SendE>
    | ProviderHandlerError<InternalE>,
    ClientSubscribeContext
  >,
) => void;

interface ClientSubscribeContext {
  stop: () => void;
}
