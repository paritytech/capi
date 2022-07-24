import { deferred } from "../deps/std/async.ts";
import * as U from "../util/mod.ts";
import { ClientHooks, Provider, ProviderMethods } from "./common.ts";
import * as msg from "./messages.ts";
import { IsCorrespondingRes } from "./util.ts";

export abstract class Client<
  M extends ProviderMethods,
  ParsedError extends Error,
  RawIngressMessage,
  RawError,
  CloseError extends Error,
> {
  #nextId = 0;
  #listenerCbs = new Map<ListenerCb<msg.IngressMessage<M>>, true>();

  /**
   * Construct a new RPC client
   *
   * @param hooks the error handling and message hooks with which you'd like the instance to operate
   */
  constructor(
    readonly provider: Provider<M, ParsedError, RawIngressMessage, RawError, CloseError>,
    readonly hooks?: ClientHooks<M, ParsedError>,
  ) {}

  /**
   * Send a message to the RPC server
   *
   * @param egressMessage the message you wish to send to the RPC server
   */
  send = (egressMessage: msg.InitMessage<M>): void => {
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
  listen = (createListenerCb: CreateListenerCb<msg.IngressMessage<M>>) => {
    const stopListening = () => {
      this.#listenerCbs.delete(listenerCb);
    };
    const listenerCb = createListenerCb(stopListening);
    this.#listenerCbs.set(listenerCb, true);
  };

  // TODO: do we want to parameterize `RpcClient` with a `RawMessage` type?
  /** @internal */
  onMessage = (message: RawIngressMessage) => {
    const parsed = this.provider.parse.ingressMessage(message);
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
  onError = (error: RawError): void => {
    const parsedError = this.provider.parse.error(error);
    this.hooks?.error?.(parsedError);
  };

  /**
   * Call an RPC method and return a promise resolving to an ingress message with an ID that matches the egress message
   *
   * @param method the name of the method you wish to call
   * @param params the params with which to call the method
   * @returns an ingress message corresponding to the given method (or a message-agnostic error)
   */
  call = <Method extends keyof M>(
    method: Method,
    params: msg.InitMessage<M, Method>["params"],
  ): Promise<msg.OkMessage<M, Method> | msg.ErrMessage> => {
    const init = <msg.InitMessage<M, Method>> {
      jsonrpc: "2.0",
      id: this.uid(),
      method,
      params,
    };
    const isCorrespondingRes = IsCorrespondingRes(init);
    const pending = deferred<msg.OkMessage<M, Method> | msg.ErrMessage>();
    this.listen((stopListening) => {
      return (res) => {
        if (isCorrespondingRes(res)) {
          stopListening();
          pending.resolve(res);
        } else { /* TODO: handle */ }
      };
    });
    this.send(init);
    return pending;
  };

  /**
   * Initialize an RPC subscription
   *
   * @param method the method name of the subscription you wish to init
   * @param params the params with which to init the subscription
   * @param createListenerCb the factory of the callback to which notifications should be supplied
   */
  subscribe = async <Method extends Extract<msg.SubscriptionMethodName<M>, keyof M>>(
    method: Method,
    params: msg.InitMessage<M, Method>["params"],
    createListenerCb: CreateListenerCb<msg.NotifMessage<M, Method>>,
  ): Promise<undefined | msg.ErrMessage> => {
    const initRes = await this.call(method, params);
    if (initRes.error) {
      return initRes;
    }
    const status = deferred<undefined | msg.ErrMessage>();
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

export type CreateListenerCb<IngressMessage> = (stop: StopListening) => ListenerCb<IngressMessage>;
export type StopListening = () => void;
export type ListenerCb<IngressMessage> = (ingressMessage: IngressMessage) => void;
