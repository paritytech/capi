import { deferred } from "../_deps/async.ts";
import * as M from "./messages.ts";

export interface ClientProps<Beacon, ParsedError extends Error> {
  beacon: Beacon;
  hooks?: {
    send?: (message: M.InitMessage) => void;
    receive?: (message: M.IngressMessage) => void;
    error?: (error: ParsedError | ParseRawErrorError) => void;
  };
}

export abstract class Client<
  Beacon,
  RawIngressMessage,
  RawError,
  ParsedError extends Error,
> {
  #nextId = 0;
  listeners = new Map<ListenerCb, boolean>();

  /**
   * Construct a new RPC client
   *
   * @param props the beacon, error handling and message hooks with which you'd like the instance to operate
   */
  constructor(readonly props: ClientProps<Beacon, ParsedError>) {}

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
  abstract parseIngressMessage: (
    rawIngressMessage: RawIngressMessage,
  ) => M.IngressMessage | ParseRawIngressMessageError;

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
   * @returns a promise, which resolved to `undefined` upon successful cancelation
   */
  abstract close: () => Promise<undefined | CloseError>;

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
      this.props.hooks?.error?.(parsed);
    } else {
      this.props.hooks?.receive?.(parsed);
      for (const listener of this.listeners.keys()) {
        listener(parsed);
      }
    }
  };

  /** @internal */
  onError = (error: RawError): void => {
    const parsedError = this.parseError(error);
    this.props.hooks?.error?.(parsedError);
  };

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
  ): Promise<StopListening | M.ErrMessage> => {
    const initRes = await this.call(method, params);
    if (initRes.error) {
      return initRes;
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

export class ParseRawIngressMessageError extends Error {}
export class ParseRawErrorError extends Error {}
export class CloseError extends Error {}

export type ListenerCb<IngressMessage_ extends M.IngressMessage = M.IngressMessage> = (
  ingressMessage: IngressMessage_,
) => void;

export type StopListening = () => void;

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
