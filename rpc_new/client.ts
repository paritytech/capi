import { Deferred, deferred } from "../deps/std/async.ts";
import * as msg from "./messages.ts";
import { Provider, ProviderListener } from "./provider/base.ts";
import { ProviderHandlerError, ProviderSendError } from "./provider/errors.ts";
import * as U from "./util.ts";

export class Client<
  DiscoveryValue = any,
  SendErrorData = any,
  HandlerErrorData = any,
  CloseErrorData = any,
> {
  providerRef;
  pendingCalls: Record<string, Deferred<unknown>> = {};
  pendingSubscriptions: SubscriptionListeners<SendErrorData, HandlerErrorData> = {};
  activeSubscriptions: SubscriptionListeners<SendErrorData, HandlerErrorData> = {};
  activeSubscriptionByMessageId: Record<string, string> = {};
  subscriptionStates: Record<string, WeakMap<new() => unknown, unknown>> = {};

  constructor(
    readonly provider: Provider<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>,
    readonly discoveryValue: DiscoveryValue,
  ) {
    this.providerRef = provider(discoveryValue, this.#listener);
  }

  #listener: ProviderListener<SendErrorData, HandlerErrorData> = (e) => {
    if (e instanceof Error) {
      for (const id in this.pendingCalls) {
        const pendingCall = this.pendingCalls[id]!;
        pendingCall.resolve(e);
        delete this.pendingCalls[id];
        this.pendingSubscriptions[id]!(e);
        delete this.pendingSubscriptions[id];
      }
      for (const id in this.activeSubscriptions) {
        this.activeSubscriptions[id]!(e);
        delete this.activeSubscriptions[id];
        delete this.subscriptionStates[id];
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
      this.activeSubscriptions[e.params.subscription]!(e);
    }
  };

  call: ClientCall<SendErrorData, HandlerErrorData> = (message) => {
    const waiter = deferred<ClientCallEvent<SendErrorData, HandlerErrorData>>();
    this.pendingCalls[message.id] = waiter;
    this.providerRef.send(message);
    return waiter;
  };

  subscribe: ClientSubscribe<SendErrorData, HandlerErrorData> = (message, listener) => {
    const stop = () => {
      delete this.pendingSubscriptions[message.id];
      const activeSubscriptionId = this.activeSubscriptionByMessageId[message.id];
      if (activeSubscriptionId) {
        delete this.activeSubscriptions[activeSubscriptionId];
      }
    };
    this.pendingSubscriptions[message.id] = listener.bind({
      stop,
      state: <T>(ctor: new() => T) => {
        let state = this.subscriptionStates[message.id];
        if (!state) {
          state = new WeakMap();
          this.subscriptionStates[message.id] = state;
        }
        let instance = state.get(ctor);
        if (!instance) {
          instance = new ctor();
          state.set(ctor, instance);
        }
        return instance as T;
      },
    }) as U.Listener<
      ClientSubscriptionEvent<SendErrorData, HandlerErrorData>
    >;
    this.call(message);
  };

  discard = () => {
    // TODO: more cleanup here?
    return this.providerRef.release();
  };
}

export type ClientCallEvent<SendErrorData, HandlerErrorData, Result = any> =
  | msg.OkMessage<Result>
  | msg.ErrorMessage
  | ProviderSendError<SendErrorData>
  | ProviderHandlerError<HandlerErrorData>;

export type ClientCall<SendErrorData, HandlerErrorData> = <Result = any>(
  message: msg.EgressMessage,
) => Promise<ClientCallEvent<SendErrorData, HandlerErrorData, Result>>;

export type ClientSubscriptionEvent<
  SendErrorData,
  HandlerErrorData,
  Method extends string = string,
  Result = any,
> =
  | msg.NotificationMessage<Method, Result>
  | msg.ErrorMessage
  | ProviderSendError<SendErrorData>
  | ProviderHandlerError<HandlerErrorData>;

type SubscriptionListeners<SendErrorData, HandlerErrorData> = Record<
  string,
  ClientSubscribeListener<SendErrorData, HandlerErrorData>
>;

export type ClientSubscribe<SendErrorData, HandlerErrorData> = <
  Method extends string = string,
  Result = any,
>(
  message: msg.EgressMessage,
  listener: ClientSubscribeListener<
    SendErrorData,
    HandlerErrorData,
    ClientSubscribeContext,
    Method,
    Result
  >,
) => void;

export type ClientSubscribeListener<
  SendErrorData,
  HandlerErrorData,
  Context = void,
  Method extends string = string,
  Result = string,
> = U.Listener<
  ClientSubscriptionEvent<SendErrorData, HandlerErrorData, Method, Result>,
  Context
>;

export interface ClientSubscribeContext {
  stop: () => void;
  state: <T>(ctor: new() => T) => T;
}
