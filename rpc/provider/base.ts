import * as U from "../../util/mod.ts"
import * as msg from "../messages.ts"
import { ProviderCloseError, ProviderHandlerError, ProviderSendError } from "./errors.ts"

/**
 * @param discoveryValue the value with which to discover the given chain
 * @param listener the callback to which messages and errors should be applied
 */
export type Provider<
  DiscoveryValue = any,
  SendErrorData = any,
  HandlerErrorData = any,
  CloseErrorData = any,
> = (
  discoveryValue: DiscoveryValue,
  listener: ProviderListener<SendErrorData, HandlerErrorData>,
) => ProviderRef<CloseErrorData>

export type ProviderListener<SendErrorData, HandlerErrorData> = U.Listener<
  | msg.IngressMessage
  | ProviderSendError<SendErrorData>
  | ProviderHandlerError<HandlerErrorData>,
  any
>

export interface ProviderRef<CloseErrorData> {
  nextId(): number
  send(message: msg.EgressMessage): void
  release(): Promise<undefined | ProviderCloseError<CloseErrorData>>
}

export class ProviderConnection<Inner, SendErrorData, HandlerErrorData> {
  /** The set of high-level listeners, which accept parsed messages and errors */
  listeners = new Map<
    ProviderListener<SendErrorData, HandlerErrorData>,
    ProviderListener<SendErrorData, HandlerErrorData>
  >()

  /**
   * @param inner the underlying representation of the connection (such as a WebSocket or smoldot chain)
   * @param cleanUp cb to close the connection (`inner`) and free up resources
   */
  constructor(readonly inner: Inner, readonly cleanUp: () => void) {}

  addListener = (listener: ProviderListener<SendErrorData, HandlerErrorData>) => {
    if (this.listeners.has(listener)) {
      return
    }
    this.listeners.set(
      listener,
      listener.bind({
        stop: () => {
          this.listeners.delete(listener)
        },
      }),
    )
  }

  /**
   * Execute each listener in sequence
   * @param message the message to apply to each listener
   */
  forEachListener: ProviderListener<SendErrorData, HandlerErrorData> = (message) => {
    for (const listener of this.listeners.values()) {
      listener(message)
    }
  }
}

export function nextIdFactory() {
  let i = 0
  return () => i++
}

export class ListenersContainer<
  DiscoveryValue,
  SendErrorData,
  HandlerErrorData,
> {
  #listeners = new Map<
    DiscoveryValue,
    Map<
      ProviderListener<SendErrorData, HandlerErrorData>,
      ProviderListener<SendErrorData, HandlerErrorData>
    >
  >()

  set(discoveryValue: DiscoveryValue, listener: ProviderListener<SendErrorData, HandlerErrorData>) {
    let map = this.#listeners.get(discoveryValue)
    if (!map) {
      map = new Map()
      this.#listeners.set(discoveryValue, map)
    }
    if (map.has(listener)) return
    map.set(
      listener,
      listener.bind({
        stop: () => map!.delete(listener),
      }),
    )
  }

  delete(
    discoveryValue: DiscoveryValue,
    listener: ProviderListener<SendErrorData, HandlerErrorData>,
  ) {
    this.#listeners.get(discoveryValue)?.delete(listener)
  }

  count(discoveryValue: DiscoveryValue) {
    return this.#listeners.get(discoveryValue)?.size ?? 0
  }

  forEachListener(
    discoveryValue: DiscoveryValue,
    message: Parameters<ProviderListener<SendErrorData, HandlerErrorData>>[0],
  ) {
    const map = this.#listeners.get(discoveryValue)
    if (!map) return
    for (const listener of map.values()) {
      listener(message)
    }
  }
}
