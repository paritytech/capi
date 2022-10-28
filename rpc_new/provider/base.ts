import * as msg from "../messages.ts";
import * as U from "../util.ts";
import { ProviderCloseError, ProviderHandlerError, ProviderSendError } from "./errors.ts";

/**
 * @param discoveryValue the value with which to discover the given chain
 * @param listener the callback to which messages and errors should be applied
 */
export type Provider<DiscoveryValue, HandlerErrorData, SendErrorData, CloseErrorData> = (
  discoveryValue: DiscoveryValue,
  listener: ProviderListener<HandlerErrorData, SendErrorData>,
) => ProviderRef<CloseErrorData>;

export type ProviderListener<HandlerErrorData, SendErrorData> = U.Listener<
  msg.IngressMessage | ProviderHandlerError<HandlerErrorData> | ProviderSendError<SendErrorData>,
  { stop: () => void }
>;

export interface ProviderRef<CloseErrorData> {
  send: ProviderSend;
  release: ProviderRelease<CloseErrorData>;
}

export type ProviderSend = (message: msg.EgressMessage) => void;

export type ProviderRelease<CloseErrorData> = () => Promise<
  void | ProviderCloseError<CloseErrorData>
>;

export abstract class ProviderConnection<
  Inner,
  HandlerErrorData,
  SendErrorData,
> {
  /** The set of high-level listeners, which accept parsed messages and errors */
  listeners = new Map<
    U.Listener<
      | msg.IngressMessage
      | ProviderHandlerError<HandlerErrorData>
      | ProviderSendError<SendErrorData>
    >,
    U.Listener<
      | msg.IngressMessage
      | ProviderHandlerError<HandlerErrorData>
      | ProviderSendError<SendErrorData>
    >
  >();

  /**
   * @param inner the underlying representation of the connection (such as a websocket or smoldot chain)
   * @param firstListener the
   */
  constructor(
    readonly inner: Inner,
    readonly cleanUp: () => void,
  ) {
  }

  addListener(
    listener: U.Listener<
      | msg.IngressMessage
      | ProviderHandlerError<HandlerErrorData>
      | ProviderSendError<SendErrorData>
    >,
  ) {
    if (this.listeners.has(listener)) {
      return;
    }
    this.listeners.set(
      listener,
      listener.bind({
        stop: () => {
          this.listeners.delete(listener);
        },
      }),
    );
  }

  /**
   * Execute each listener in sequence
   * @param message the message to apply to each listener
   */
  forEachListener: U.Listener<any /* NARROW */> = (message) => {
    for (const listener of this.listeners.values()) {
      listener(message);
    }
  };
}
