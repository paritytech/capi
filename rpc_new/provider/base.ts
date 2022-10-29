import * as msg from "../messages.ts";
import * as U from "../util.ts";
import { ProviderCloseError, ProviderHandlerError, ProviderSendError } from "./errors.ts";

/**
 * @param discoveryValue the value with which to discover the given chain
 * @param listener the callback to which messages and errors should be applied
 */
export type Provider<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData> = (
  discoveryValue: DiscoveryValue,
  listener: ProviderListener<SendErrorData, HandlerErrorData>,
) => ProviderRef<CloseErrorData>;

export type ProviderListenerEvent<SendErrorData, HandlerErrorData> =
  | msg.IngressMessage
  | ProviderSendError<SendErrorData>
  | ProviderHandlerError<HandlerErrorData>;

export type ProviderListener<SendErrorData, HandlerErrorData> = U.Listener<
  ProviderListenerEvent<SendErrorData, HandlerErrorData>
>;

export interface ProviderRef<CloseErrorData> {
  nextId: () => string;
  send: ProviderSend;
  release: ProviderRelease<CloseErrorData>;
}

export type ProviderSend = (message: msg.EgressMessage) => void;

export type ProviderRelease<CloseErrorData> = () => Promise<
  void | ProviderCloseError<CloseErrorData>
>;

export abstract class ProviderConnection<Inner, SendErrorData, HandlerErrorData> {
  /** The set of high-level listeners, which accept parsed messages and errors */
  listeners = new Map<
    ProviderListener<SendErrorData, HandlerErrorData>,
    ProviderListener<SendErrorData, HandlerErrorData>
  >();

  /**
   * @param inner the underlying representation of the connection (such as a websocket or smoldot chain)
   * @param cleanUp cb to close the connection (`inner`) and free up resources
   */
  constructor(readonly inner: Inner, readonly cleanUp: () => void) {}

  addListener = (listener: ProviderListener<SendErrorData, HandlerErrorData>) => {
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
  };

  /**
   * Execute each listener in sequence
   * @param message the message to apply to each listener
   */
  forEachListener: ProviderListener<SendErrorData, HandlerErrorData> = (message) => {
    for (const listener of this.listeners.values()) {
      listener(message);
    }
  };
}
