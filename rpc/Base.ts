import { deferred } from "../_deps/async.ts";
import * as E from "./Error.ts";
import * as M from "./messages.ts";

export type ListenerCb<IngressMessage_ extends M.IngressMessage = M.IngressMessage> = (
  ingressMessage: IngressMessage_,
) => void;

export type StopListening = () => void;

export abstract class RpcClient<RpcError extends E.RpcError> {
  #nextId = 0;
  listeners = new Map<ListenerCb, boolean>();
  #errors: RpcError[] = [];

  /**
   * Send a message to the RPC server
   *
   * @param egressMessage the message you wish to send to the RPC server
   */
  abstract send: (egressMessage: M.InitMessage) => void;

  /**
   * Parse messages returned from the RPC server (this includes RPC server errors)
   *
   * @param rawIngressMessage the raw response from the given provider, likely in need of some sanitization
   * @returns the sanitized ingress message, common to all providers
   */
  abstract parseMessage: (rawIngressMessage: unknown) => M.IngressMessage;

  /**
   * Parse errors of the given client, such as an error `Event` in the case of `WebSocket`s
   *
   * @param rawError the raw error from the given provider
   * @returns an instance of `RpcError`, typed via the client's sole generic type param
   */
  abstract parseError: (rawError: any) => RpcError;

  // TODO: introduce `FailedToClose` error in the return type (union with `undefined`)
  /**
   * Close the connection and free up resources
   *
   * @returns a promise, which resolved to `undefined` upon successful cancelation
   */
  abstract close: () => Promise<void>;

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
  listen = (listener: ListenerCb): StopListening => {
    if (this.listeners.has(listener)) {
      throw new Error();
    }
    this.listeners.set(listener, true);
    return () => {
      this.listeners.delete(listener);
    };
  };

  // TODO: do we want to parameterize `RpcClient` with a `RawMessage` type?
  /** @internal */
  onMessage = (message: unknown) => {
    const parsed = this.parseMessage(message);
    for (const listener of this.listeners.keys()) {
      listener(parsed);
    }
  };

  /** @internal */
  onError = (error: unknown): void => {
    this.#errors.push(this.parseError(error));
  };

  abstract opening(): Promise<void>;

  /**
   * Call an RPC method and return a promise resolving to an ingress message with an ID that matches the egress message
   *
   * @param method the name of the method you wish to call
   * @param params the params with which to call the method
   * @returns an ingress message corresponding to the given method (or a message-agnostic error)
   */
  call = async <Method extends M.MethodName>(
    method: Method,
    params: M.InitMessageByMethodName[Method]["params"],
  ): Promise<M.OkMessage<Method> | M.ErrMessage> => {
    const init = <M.InitMessage<Method>> {
      jsonrpc: "2.0",
      id: this.uid(),
      method,
      params,
    };
    const isCorrespondingRes = IsCorrespondingRes(init);
    const pending = deferred<M.OkMessage<Method> | M.ErrMessage>();
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
  subscribe = async <Method extends M.SubscriptionMethodName>(
    method: Method,
    params: M.InitMessage<Method>["params"],
    listenerCb: ListenerCb<M.NotifMessage<Method>>,
  ): Promise<StopListening> => {
    const initRes = await this.call(method, params);
    if (initRes instanceof E.RpcServerError) {
      throw initRes;
    }
    const stopListening = this.listen((res) => {
      // TODO: handle subscription errors
      if (res.params?.subscription === initRes.result) {
        listenerCb(res as M.NotifMessage<Method>);
      }
    });
    return stopListening;
  };
}

export function IsCorrespondingRes<Init_ extends M.InitMessage>(init: Init_) {
  return <InQuestion extends M.IngressMessage>(
    inQuestion: InQuestion,
  ): inQuestion is Extract<InQuestion, M.OkMessageByMethodName[Init_["method"]] | M.ErrMessage> => {
    if (inQuestion.error || inQuestion.result) {
      inQuestion;
    }
    return inQuestion?.id === init.id;
  };
}
