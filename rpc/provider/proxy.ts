import { retry } from "../../deps/std/async.ts"
import { nextIdFactory, Provider, ProviderListener } from "./base.ts"
import { ProviderCloseError, ProviderHandlerError, ProviderSendError } from "./errors.ts"

/** Global lookup of existing connections */
// const connections = new Map<string, ProxyProviderConnection>()
// type ProxyProviderConnection = ProviderConnection<WebSocket, Event, Event>

const nextId = nextIdFactory()

const listeners = new Map<
  string,
  Map<ProviderListener<Event, Event>, ProviderListener<Event, Event>>
>()

function setListener(url: string, listener: ProviderListener<Event, Event>) {
  if (!listeners.has(url)) {
    listeners.set(url, new Map())
  }
  const map = listeners.get(url)!
  if (map.has(listener)) return
  map.set(
    listener,
    listener.bind({
      stop: () => deleteListener(url, listener),
    }),
  )
}

function deleteListener(url: string, listener: ProviderListener<Event, Event>) {
  if (!listeners.has(url)) return
  const map = listeners.get(url)!
  map.delete(listener)
}

function callListener(url: string, message: Parameters<ProviderListener<Event, Event>>[0]) {
  if (!listeners.has(url)) return
  for (const listener of listeners.get(url)!.values()) {
    listener(message)
  }
}

export const proxyProvider: Provider<string, Event, Event, Event> = (url, listener) => {
  setListener(url, listener)
  let ws: WebSocket
  return {
    nextId,
    send: (message) => {
      ;(async () => {
        try {
          ws = await openWsWithRetry(url, listener)
        } catch (error) {
          return callListener(url, new ProviderHandlerError(error as Event))
        }
        try {
          ws.send(JSON.stringify(message))
        } catch (error) {
          callListener(url, new ProviderSendError(error as Event, message))
        }
      })()
    },
    release: () => {
      deleteListener(url, listener)
      if (ws) {
        return closeWs(ws)
      }
      return Promise.resolve(undefined)
    },
  }
}

const activeWs = new Map<string, WebSocket>()
const connectingWs = new Map<string, Promise<WebSocket>>()

function openWsWithRetry(
  url: string,
  listener: ProviderListener<Event, Event>,
) {
  return retry(() => openWs(url, listener), { maxAttempts: 10 })
}

function openWs(
  url: string,
  listener: ProviderListener<Event, Event>,
) {
  if (activeWs.has(url)) {
    return Promise.resolve(activeWs.get(url)!)
  }
  if (connectingWs.has(url)) {
    return connectingWs.get(url)!
  }

  const openedWs = new Promise<WebSocket>((resolve, reject) => {
    const connectingWsController = new AbortController()
    const ws = new WebSocket(url)
    ws.addEventListener(
      "open",
      () => {
        connectingWsController.abort()
        connectingWs.delete(url)
        activeWs.set(url, ws)

        const activeWsController = new AbortController()
        ws.addEventListener(
          "message",
          (e) => listener(JSON.parse(e.data)),
          activeWsController,
        )
        ws.addEventListener(
          "error",
          (e) => {
            activeWs.delete(url)
            listener(new ProviderHandlerError(e))
          },
          activeWsController,
        )
        ws.addEventListener(
          "close",
          (e) => {
            activeWs.delete(url)
            activeWsController.abort()
            if (!e.wasClean) {
              listener(new ProviderHandlerError(e))
            }
          },
          activeWsController,
        )
        resolve(ws)
      },
      connectingWsController,
    )
    ws.addEventListener(
      "close",
      (e) => {
        connectingWsController.abort()
        connectingWs.delete(url)
        activeWs.delete(url)
        reject(e)
      },
      connectingWsController,
    )
  })
  connectingWs.set(url, openedWs)
  return openedWs
}

function closeWs(socket: WebSocket): Promise<undefined | ProviderCloseError<Event>> {
  if (socket.readyState === WebSocket.CLOSED) {
    return Promise.resolve(undefined)
  }
  return new Promise<undefined | ProviderCloseError<Event>>((resolve) => {
    const controller = new AbortController()
    socket.addEventListener("close", () => {
      controller.abort()
      resolve(undefined)
    }, controller)
    socket.addEventListener("error", (e) => {
      controller.abort()
      resolve(new ProviderCloseError(e))
    }, controller)
    socket.close()
  })
}
