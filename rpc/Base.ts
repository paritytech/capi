import { Config } from "../config/mod.ts";
import { deferred } from "../deps/std/async.ts";
import * as U from "../util/mod.ts";
import { ClientHooks, Provider } from "./common.ts";
import * as msg from "./messages.ts";

export type OnMessage<Message> = (message: Message) => void;

export abstract class Client<
  Config_ extends Config,
  RawIngressMessage,
  InternalError,
  CloseError extends Error,
> {
  #nextId = 0;
  #listenerCbs = new Map<U.WatchHandler<msg.IngressMessage>, true>();

  /**
   * Construct a new RPC client
   *
   * @param hooks the error handling and message hooks with which you'd like the instance to operate
   */
  constructor(
    readonly provider: Provider<RawIngressMessage, CloseError>,
    readonly hooks?: ClientHooks<InternalError>,
  ) {}

  /**
   * Send a message to the RPC server
   *
   * @param egressMessage the message you wish to send to the RPC server
   */
  send = (egressMessage: msg.InitMessage): void => {
    this.hooks?.send?.(egressMessage);
    this.provider.send(egressMessage);
  };

  close = (): Promise<undefined | CloseError> => {
    this.hooks?.close?.();
    return this.provider.close();
  };

  /** @returns a new ID, unique to the client instance */
  uid = (): string => {
    return (this.#nextId++).toString();
  };

  /**
   * Attach a listener to handle ingress messages
   *
   * @param createListenerCb the factory for the callback to be triggered upon arrival of ingress messages
   */
  listen = (createListenerCb: U.CreateWatchHandler<msg.IngressMessage>): void => {
    const stopListening = () => {
      this.#listenerCbs.delete(listenerCb);
    };
    const listenerCb = createListenerCb(stopListening);
    this.#listenerCbs.set(listenerCb, true);
  };

  // TODO: do we want to parameterize `RpcClient` with a `RawMessage` type?
  /** @internal */
  onMessage: OnMessage<RawIngressMessage> = (message) => {
    const parsed = this.provider.parseIngressMessage(message);
    if (parsed instanceof Error) {
      this.hooks?.error?.(parsed);
    } else {
      this.hooks?.receive?.(parsed);
      for (const listener of this.#listenerCbs.keys()) {
        listener(parsed);
      }
    }
  };

  /** @internal */
  onError = (error: InternalError): void => {
    this.hooks?.error?.(error);
  };

  /**
   * Call an RPC method and return a promise resolving to an ingress message with an ID that matches the egress message
   *
   * @param methodName the name of the method you wish to call
   * @param params the params with which to call the method
   * @returns an ingress message corresponding to the given method (or a message-agnostic error)
   */
  call = (
    methodName: string,
    params: unknown[],
  ): Promise<msg.IngressMessage> => {
    const init = <msg.InitMessage> {
      jsonrpc: "2.0",
      id: this.uid(),
      method: methodName,
      params,
    };
    const ingressMessagePending = deferred<msg.IngressMessage>();
    this.listen((stopListening) => {
      return (res) => {
        if (res.id === init.id) {
          stopListening();
          ingressMessagePending.resolve(res as msg.IngressMessage);
        }
      };
    });
    this.send(init);
    return ingressMessagePending;
  };

  /**
   * Initialize an RPC subscription
   *
   * @param methodName the method name of the subscription you wish to init
   * @param params the params with which to init the subscription
   * @param createListenerCb the factory of the callback to which notifications should be supplied
   */
  subscribe = async (
    methodName: string,
    params: unknown[],
    createListenerCb: CreateListenerCb,
    cleanup: SubscriptionCleanup = () => Promise.resolve(),
  ): Promise<undefined | msg.ErrMessage> => {
    const initRes = await this.call(methodName, params);
    if (initRes.error) {
      return initRes;
    }
    const cleanupApplied = () => cleanup(initRes as msg.OkMessage);
    const terminalPending = deferred<undefined | msg.ErrMessage>();
    this.listen((stop) => {
      const listenerCb = createListenerCb(
        async () => {
          stop();
          await cleanupApplied();
          terminalPending.resolve();
        },
      );
      return (res) => {
        if (res.params?.subscription && res.params.subscription === initRes.result) {
          listenerCb(res as msg.NotifMessage);
        } else {
          // TODO: associate errors with subscriptions & exit
        }
      };
    });
    return await terminalPending;
  };
}

export type CreateListenerCb = U.CreateWatchHandler<msg.NotifMessage>;

export type SubscriptionCleanup = (initOk: msg.OkMessage) => Promise<void>;
