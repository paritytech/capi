import { ProviderHandlerError } from "../mod.ts"
import { Provider, ProviderListener, ProviderRef } from "./base.ts"
import { proxyProvider } from "./proxy.ts"

const MAX_RECONNECT_ATTEMPTS = 1000

export const reconnectableProxyProvider: Provider<string, Event, Event, Event> = (
  url,
  listener,
) => {
  let inner: ProviderRef<any>
  let reconnects = 0
  const retryListener: ProviderListener<Event, Event> = (e) => {
    listener(e)
    if (
      e instanceof ProviderHandlerError
      && e.cause instanceof CloseEvent
      && !e.cause.wasClean
      && reconnects < MAX_RECONNECT_ATTEMPTS
    ) {
      inner.release()
      reconnects++
      inner = proxyProvider(url, retryListener)
    }
  }
  inner = proxyProvider(url, retryListener)
  return {
    nextId: () => inner.nextId(),
    send: (m) => inner.send(m),
    release: () => inner.release(),
  }
}
