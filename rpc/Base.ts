import { Config } from "../config/mod.ts";
import { deferred } from "../deps/std/async.ts";
import * as U from "../util/mod.ts";
import { ClientHooks, Provider } from "./common.ts";
import * as msg from "./messages.ts";
import { IsCorrespondingRes } from "./util.ts";

// TODO: extra all base methods into standalone
export type OnMessage<RawIngressMessage> = (message: RawIngressMessage) => void;

export abstract class Client<
  Config_ extends Config,
  RawIngressMessage,
  InternalError,
  CloseError extends Error,
> {
  #nextId = 0;
  #listenerCbs = new Map<U.ListenerCb<msg.IngressMessage<Config_>>, true>();

  /**
   * Construct a new RPC client
   *
   * @param hooks the error handling and message hooks with which you'd like the instance to operate
   */
  constructor(
    readonly provider: Provider<Config_, RawIngressMessage, CloseError>,
    readonly hooks?: ClientHooks<Config_, InternalError>,
  ) {}

  /**
   * Send a message to the RPC server
   *
   * @param egressMessage the message you wish to send to the RPC server
   */
  send = (egressMessage: msg.InitMessage<Config_>): void => {
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
  listen = (createListenerCb: U.CreateListenerCb<msg.IngressMessage<Config_>>) => {
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
  call = <MethodName extends Extract<keyof Config_["RpcCallMethods"], string>>(
    methodName: MethodName,
    params: Parameters<Config_["RpcMethods"][MethodName]>,
  ): Promise<msg.OkMessage<Config_, MethodName> | msg.ErrMessage<Config_>> => {
    const init = <msg.InitMessage<Config_, MethodName>> {
      jsonrpc: "2.0",
      id: this.uid(),
      method: methodName,
      params,
    };
    const isCorrespondingRes = IsCorrespondingRes(init);
    const pending = deferred<msg.OkMessage<Config_, MethodName> | msg.ErrMessage<Config_>>();
    this.listen((stopListening) => {
      return (res) => {
        if (isCorrespondingRes(res)) {
          stopListening();
          // TODO: fix these typings
          pending.resolve(res as any);
        } else { /* TODO: handle */ }
      };
    });
    this.send(init);
    return pending;
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
    createListenerCb: U.CreateListenerCb<msg.NotifMessage<Config_, MethodName>>,
  ): Promise<undefined | msg.ErrMessage<Config_>> => {
    const initRes = await this.call(methodName, params);
    if (initRes.error) {
      // TODO: fix typings
      return initRes as msg.ErrMessage<Config_>;
    }
    const status = deferred<undefined | msg.ErrMessage<Config_>>();
    this.listen((stop) => {
      const listenerCb = createListenerCb(U.resolveOnCall(status, stop));
      return (res) => {
        if (res.params?.subscription && res.params.subscription === initRes.result) {
          listenerCb(res as any);
        } else { /* TODO: error */ }
      };
    });
    return await status;
  };
}
