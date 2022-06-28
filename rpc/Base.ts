import { deferred } from "../_deps/async.ts";
import { AnyMethods } from "../util/mod.ts";
import * as msg from "./messages.ts";

// TODO: rename
interface Subscription<M extends AnyMethods> {
  listeners: Map<ListenerCb<msg.NotifMessage<M>>, true>;
  close: () => void;
}

export abstract class Client<
  M extends AnyMethods,
  ParsedError extends Error,
  RawIngressMessage,
  RawError,
> {
  #nextId = 0;
  listeners = new Map<ListenerCb<msg.IngressMessage<M>>, true>();
  subscriptions = new Map<string, Subscription<M>>();

  /**
   * Construct a new RPC client
   *
   * @param hooks the error handling and message hooks with which you'd like the instance to operate
   */
  constructor(readonly hooks?: ClientHooks<M, ParsedError>) {}

  /**
   * Send a message to the RPC server
   *
   * @param egressMessage the message you wish to send to the RPC server
   */
  send = (egressMessage: msg.InitMessage<M>): void => {
    this.hooks?.send?.(egressMessage);
    this._send(egressMessage);
  };

  /**
   * The provider-specific send implementation
   *
   * @param egressMessage the message you wish to send to the RPC server
   */
  abstract _send: (egressMessage: msg.InitMessage<M>) => void;

  /**
   * Parse messages returned from the RPC server (this includes RPC server errors)
   *
   * @param rawIngressMessage the raw response from the given provider, likely in need of some sanitization
   * @returns the sanitized ingress message, common to all providers
   */
  abstract parseIngressMessage: (
    rawIngressMessage: RawIngressMessage,
  ) => msg.IngressMessage<M> | ParseRawIngressMessageError;

  /**
   * Parse errors of the given client, such as an error `Event` in the case of `WebSocket`s
   *
   * @param rawError the raw error from the given provider
   * @returns an instance of `RpcError`, typed via the client's sole generic type param
   */
  abstract parseError: (rawError: RawError) => ParsedError | ParseRawErrorError;

  // TODO: introduce `FailedToClose` error in the return type (union with `undefined`)
  /**
   * Close the connection and free up resources
   *
   * @returns a promise, which resolved to `undefined` upon successful cancellation
   */
  abstract _close: () => Promise<undefined | CloseError>;

  close = (): Promise<undefined | CloseError> => {
    this.hooks?.close?.();
    return this._close();
  };

  /** @returns a new ID, unique to the client instance */
  uid = (): string => {
    return (this.#nextId++).toString();
  };

  /**
   * Attach a listener to handle ingress messages
   *
   * @param listener the callback to be triggered upon arrival of ingress messages
   * @returns a function to detach the listener
   */
  listen = (listener: ListenerCb<msg.IngressMessage<M>>): StopListening => {
    // TODO: do we care about repeat registration?
    if (!this.listeners.has(listener)) {
      this.listeners.set(listener, true);
    }
    return () => {
      this.listeners.delete(listener);
    };
  };

  // TODO: do we want to parameterize `RpcClient` with a `RawMessage` type?
  /** @internal */
  onMessage = (message: RawIngressMessage) => {
    const parsed = this.parseIngressMessage(message);
    if (parsed instanceof Error) {
      this.hooks?.error?.(parsed);
    } else {
      this.hooks?.receive?.(parsed);
      for (const listener of this.listeners.keys()) {
        listener(parsed);
      }
    }
  };

  /** @internal */
  onError = (error: RawError): void => {
    const parsedError = this.parseError(error);
    this.hooks?.error?.(parsedError);
  };

  /**
   * Call an RPC method and return a promise resolving to an ingress message with an ID that matches the egress message
   *
   * @param method the name of the method you wish to call
   * @param params the params with which to call the method
   * @returns an ingress message corresponding to the given method (or a message-agnostic error)
   */
  call = async <Method extends keyof M>(
    method: Method,
    params: msg.InitMessageByMethodName<M>[Method]["params"],
  ): Promise<msg.OkMessage<M, Method> | msg.ErrMessage> => {
    const init = <msg.InitMessage<M, Method>> {
      jsonrpc: "2.0",
      id: this.uid(),
      method,
      params,
    };
    const isCorrespondingRes = IsCorrespondingRes<M, typeof init>(init);
    const pending = deferred<msg.OkMessage<M, Method> | msg.ErrMessage>();
    const stopListening = this.listen((res) => {
      if (isCorrespondingRes(res)) {
        pending.resolve(res);
      }
    });
    this.send(init);
    const result = await pending;
    stopListening();
    return result;
  };

  /**
   * Initialize an RPC subscription
   *
   * @param method the method name of the subscription you wish to init
   * @param params the params with which to init the subscription
   * @param listenerCb the callback to which notifications should be supplied
   * @returns a function with which to stop listening for notifications
   */
  #subscribeUnsafe = async <Method extends Extract<msg.SubscriptionMethodName<M>, keyof M>>(
    method: Method,
    params: msg.InitMessage<M, Method>["params"],
    listenerCb: ListenerCb<msg.NotifMessage<M, Method>>,
  ): Promise<StopListening | msg.ErrMessage> => {
    const initRes = await this.call(method, params);
    if (initRes.error) {
      return initRes;
    }
    const stopListening = this.listen((res) => {
      // TODO: handle subscription errors
      if (res.params?.subscription && res.params.subscription === initRes.result) {
        // TODO
        listenerCb(res as any);
      }
    });
    return stopListening;
  };

  subscribe = async <Method extends Extract<msg.SubscriptionMethodName<M>, keyof M>>(
    method: Method,
    params: msg.InitMessage<M, Method>["params"],
    listenerCb: ListenerCb<msg.NotifMessage<M, Method>>,
  ): Promise<StopListening | msg.ErrMessage> => {
    // TODO: why is `keyof M` being inferred with sym as a member?
    const key = `${method as string}(${JSON.stringify(params)})`;
    const existing = this.subscriptions.get(key);
    const Close = (group: Subscription<M>) => {
      return () => {
        // TODO
        group.listeners.delete(listenerCb as any);
        if (!group.listeners.size) {
          group.close();
          this.subscriptions.delete(key);
        }
      };
    };
    if (existing) {
      existing.listeners.set(listenerCb as any, true);
      return Close(existing);
    } else {
      const group: Subscription<M> = {
        listeners: new Map([[listenerCb as any, true]]),
        close: undefined!,
      };
      const subscribeResult = await this.#subscribeUnsafe(method, params, (message) => {
        for (const listener of group.listeners.keys()) {
          listener(message);
        }
      });
      if (typeof subscribeResult === "function") {
        group.close = subscribeResult;
      }
      return Close(group);
    }
  };
}

// Swap with branded type
const _N: unique symbol = Symbol();
export type SubscriptionBrand<NotificationResult = any> = { [_N]: NotificationResult };

export interface ClientHooks<
  M extends AnyMethods,
  ParsedError extends Error,
> {
  send?: (message: msg.InitMessage<M>) => void;
  receive?: (message: msg.IngressMessage<M>) => void;
  error?: (error: ParsedError | ParseRawErrorError) => void;
  close?: () => void;
}

export type AnyClient<M extends AnyMethods = AnyMethods, ParsedError extends Error = Error> =
  Client<M, ParsedError, any, any>;

export class ParseRawIngressMessageError extends Error {}
export class ParseRawErrorError extends Error {}
export class CloseError extends Error {}

export type ListenerCb<IngressMessage> = (ingressMessage: IngressMessage) => void;

export type StopListening = () => void;

export function IsCorrespondingRes<
  M extends AnyMethods,
  Init_ extends msg.InitMessage<M>,
>(init: Init_) {
  return <InQuestion extends msg.IngressMessage<M>>(
    inQuestion: InQuestion,
  ): inQuestion is Extract<
    InQuestion,
    msg.OkMessageByMethodName<M>[Init_["method"]] | msg.ErrMessage
  > => {
    return inQuestion?.id === init.id;
  };
}
