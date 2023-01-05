import { retry, RetryOptions } from "../../deps/std/async.ts"
import * as msg from "../messages.ts"
import { ListenersContainer, nextIdFactory, Provider, ProviderListener } from "./base.ts"
import { ProviderCloseError, ProviderHandlerError, ProviderSendError } from "./errors.ts"

const CUSTOM_WS_CLOSE_CODE = 4000

export interface ProxyProviderFactoryProps {
  retryOptions?: RetryOptions
}

export const proxyProviderFactory = (
  { retryOptions }: ProxyProviderFactoryProps = {},
): Provider<string, Event, Event, Event> => {
  const listenersContainer = new ListenersContainer<string, Event, Event>()
  const activeWs = new Map()
  const connectingWs = new Map()
  return (url, listener) => {
    listenersContainer.set(url, listener)
    let ws: WebSocket | undefined
    return {
      nextId: nextIdFactory(),
      send: (message) => {
        ;(async () => {
          try {
            ws = await openedWs({
              url,
              activeWs,
              connectingWs,
              retryOptions,
              listener: (e) => listenersContainer.forEachListener(url, e),
            })
          } catch (error) {
            return listener(new ProviderHandlerError(error as Event))
          }
          try {
            ws.send(JSON.stringify(message))
          } catch (error) {
            listener(new ProviderSendError(error as Event, message))
          }
        })()
      },
      release: () => {
        listenersContainer.delete(url, listener)
        if (!listenersContainer.count(url) && ws) {
          return closeWs(ws)
        }
        return Promise.resolve(undefined)
      },
    }
  }
}

export const proxyProvider = proxyProviderFactory()

interface OpenedWsProps {
  url: string
  activeWs: Map<string, WebSocket>
  connectingWs: Map<string, Promise<WebSocket>>
  retryOptions?: RetryOptions
  listener: ProviderListener<Event, Event>
}

function openedWs({ url, activeWs, connectingWs, listener, retryOptions }: OpenedWsProps) {
  return retry(() => {
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
            (e) => listener(msg.parse(e.data)),
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
              if (e.code !== CUSTOM_WS_CLOSE_CODE) {
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
  }, retryOptions)
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
    socket.close(CUSTOM_WS_CLOSE_CODE, "Client normal closure")
  })
}
