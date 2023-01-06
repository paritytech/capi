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
    const map = U.getOrInit(this.#listeners, discoveryValue, () =>
      new Map<
        ProviderListener<SendErrorData, HandlerErrorData>,
        ProviderListener<SendErrorData, HandlerErrorData>
      >())
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
