import { ProviderHandlerError } from "../mod.ts"
import { Provider, ProviderListener, ProviderRef } from "./base.ts"
import { proxyProvider } from "./proxy.ts"

export const reconnectableProxyProviderFactory =
  (maxAttempts = 3): Provider<string, Event, Event, Event> => (url, listener) => {
    let inner: ProviderRef<any>
    let attempts = 0
    const retryListener: ProviderListener<Event, Event> = (e) => {
      listener(e)
      if (
        e instanceof ProviderHandlerError
        && e.cause instanceof CloseEvent
        && !e.cause.wasClean
        && attempts < maxAttempts
      ) {
        inner.release()
        attempts++
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
