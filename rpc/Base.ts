import { Config } from "../config/mod.ts";
import { deferred } from "../deps/std/async.ts";
import * as U from "../util/mod.ts";
import { Provider } from "./common.ts";
import * as msg from "./messages.ts";
import { IsCorrespondingRes } from "./util.ts";

export type OnMessage<Message> = (message: Message) => void;

export abstract class Client<
  Config_ extends Config,
  RawIngressMessage,
  InternalError,
  SendError extends Error,
  CloseError extends Error,
> {
  #nextId = 0;
  #listenerCbs = new Map<U.WatchHandler<msg.IngressMessage<Config_>>, true>();

  /**
   * Construct a new RPC client
   */
  constructor(
    readonly provider: Provider<Config_, RawIngressMessage, SendError, CloseError>,
  ) {}

  /**
   * Send a message to the RPC server
   *
   * @param egressMessage the message you wish to send to the RPC server
   */
  send = (egressMessage: msg.InitMessage<Config_>): Promise<void | SendError> => {
    return this.provider.send(egressMessage);
  };

  close = (): Promise<undefined | CloseError> => {
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
  listen = (createListenerCb: U.CreateWatchHandler<msg.IngressMessage<Config_>>): void => {
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
      // FIXME: define behavior for provider.parseIngressMessage errors
    } else {
      for (const listener of this.#listenerCbs.keys()) {
        listener(parsed);
      }
    }
  };

  /** @internal */
  onError = (_error: InternalError): void => {
    // FIXME: define behavior for provider errors
    // inflight call/subscriptions might need to be rejected/cancelled
  };

  /**
   * Call an RPC method and return a promise resolving to an ingress message with an ID that matches the egress message
   *
   * @param methodName the name of the method you wish to call
   * @param params the params with which to call the method
   * @returns an ingress message corresponding to the given method (or a message-agnostic error)
   */
  call = <
    MethodName extends Extract<keyof Config_["RpcMethods"], string>,
    IngressMessage extends msg.OkMessage<Config_, MethodName> | msg.ErrMessage<Config_>,
  >(
    methodName: MethodName,
    params: Parameters<Config_["RpcMethods"][MethodName]>,
  ): Promise<IngressMessage> => {
    const init = <msg.InitMessage<Config_, MethodName>> {
      jsonrpc: "2.0",
      id: this.uid(),
      method: methodName,
      params,
    };
    const isCorrespondingRes = IsCorrespondingRes(init);
    const ingressMessagePending = deferred<IngressMessage>();
    this.listen((stopListening) => {
      return (res) => {
        if (isCorrespondingRes(res)) {
          stopListening();
          ingressMessagePending.resolve(res as IngressMessage);
        }
      };
    });
    const sendResult = this.send(init);
    if (sendResult instanceof Error) {
      // FIXME: ingressMessagePending should be resolved to a non-RPC Error
      // and stopListening() should be invoked
    }
    return ingressMessagePending;
  };

  /**
   * Initialize an RPC subscription
   *
   * @param methodName the method name of the subscription you wish to init
   * @param params the params with which to init the subscription
   * @param createListenerCb the factory of the callback to which notifications should be supplied
   */
  subscribe = async <MethodName extends Extract<keyof Config_["RpcSubscriptionMethods"], string>>(
    methodName: MethodName,
    params: Parameters<Config_["RpcSubscriptionMethods"][MethodName]>,
    createListenerCb: CreateListenerCb<Config_, MethodName>,
    cleanup: SubscriptionCleanup<Config_, MethodName> = () => Promise.resolve(),
  ): Promise<undefined | msg.ErrMessage<Config_>> => {
    const initRes = await this.call(methodName, params);
    if (initRes.error) {
      // TODO: fix typings
      return initRes as msg.ErrMessage<Config_>;
    }
    const cleanupApplied = () => cleanup(initRes as msg.OkMessage<Config_, MethodName>);
    const terminalPending = deferred<undefined | msg.ErrMessage<Config_>>();
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
          listenerCb(res as msg.NotifMessage<Config_, MethodName>);
        } else {
          // TODO: associate errors with subscriptions & exit
        }
      };
    });
    return await terminalPending;
  };
}

export type CreateListenerCb<
  Config_ extends Config,
  MethodName extends Extract<keyof Config_["RpcSubscriptionMethods"], string>,
> = U.CreateWatchHandler<msg.NotifMessage<Config_, MethodName>>;

export type SubscriptionCleanup<
  Config_ extends Config,
  MethodName extends keyof Config_["RpcMethods"],
> = (initOk: msg.OkMessage<Config_, MethodName>) => Promise<void>;
