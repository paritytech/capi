import * as U from "../../util/mod.ts";
import * as msg from "../messages.ts";
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
  msg.IngressMessage | ProviderHandlerError<HandlerErrorData> | ProviderSendError<SendErrorData>
>;

export interface ProviderRef<CloseErrorData> {
  send: ProviderSend;
  release: ProviderRelease<CloseErrorData>;
}

export type ProviderSend = (message: msg.EgressMessage) => void;

export type ProviderRelease<CloseErrorData> = () => Promise<
  void | ProviderCloseError<CloseErrorData>
>;

export abstract class ProviderConnection<Inner, HandlerErrorData, SendErrorData, ListenerRoot> {
  /** The set of high-level listeners, which accept parsed messages and errors */
  listeners;

  /**
   * @param inner the underlying representation of the connection (such as a websocket or smoldot chain)
   * @param listenerRoot the means of message-handling – this should delegate to higher-level listeners with `forEachListener`
   * @param firstListener the
   */
  constructor(
    readonly inner: Inner,
    readonly listenerRoot: ListenerRoot,
    readonly firstListener: U.Listener<
      msg.IngressMessage | ProviderHandlerError<HandlerErrorData> | ProviderSendError<SendErrorData>
    >,
  ) {
    this.listeners = new Set([firstListener]);
  }

  /**
   * Execute each listener in sequence
   * @param message the message to apply to each listener
   */
  forEachListener: U.Listener<any> = (message) => {
    for (const listener of this.listeners) {
      listener(message);
    }
  };
}
