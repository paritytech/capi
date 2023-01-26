import * as U from "../../util/mod.ts"
import * as msg from "../messages.ts"
import { nextIdFactory, Provider, ProviderConnection, ProviderListener } from "./base.ts"
import { ProviderCloseError, ProviderHandlerError, ProviderSendError } from "./errors.ts"

/** Global lookup of existing connections */
const connections = new Map<string, ProxyProviderConnection>()
type ProxyProviderConnection = ProviderConnection<WebSocket, Event, Event>

const nextId = nextIdFactory()

export const proxyProvider: Provider<string, Event, Event, Event> = (url, listener) => {
  return {
    nextId,
    send: (message) => {
      let conn: ProxyProviderConnection
      try {
        conn = connection(url, listener)
      } catch (error) {
        listener(new ProviderHandlerError(error as Event))
        return
      }
      ;(async () => {
        const openError = await ensureWsOpen(conn.inner)
        if (openError) {
          conn.forEachListener(new ProviderSendError(openError, message))
          return
        }
        try {
          conn.inner.send(JSON.stringify(message))
        } catch (error) {
          listener(new ProviderSendError(error as Event, message))
        }
      })()
    },
    release: () => {
      const conn = connections.get(url)
      if (!conn) {
        return Promise.resolve(undefined)
      }
      const { cleanUp, listeners, inner } = conn
      listeners.delete(listener)
      if (!listeners.size) {
        connections.delete(url)
        cleanUp()
        return closeWs(inner)
      }
      return Promise.resolve(undefined)
    },
  }
}

function connection(
  url: string,
  listener: ProviderListener<Event, Event>,
): ProxyProviderConnection {
  const conn = U.getOrInit(connections, url, () => {
    const controller = new AbortController()
    const ws = new WebSocket(url)
    ws.addEventListener("message", (e) => {
      conn.forEachListener(msg.parse(e.data))
    }, controller)
    ws.addEventListener("error", (e) => {
      conn.forEachListener(new ProviderHandlerError(e))
    }, controller)
    ws.addEventListener("close", (e) => {
      conn.forEachListener(new ProviderHandlerError(e))
    }, controller)
    return new ProviderConnection(ws, () => controller.abort())
  })
  conn.addListener(listener)
  return conn
}

function ensureWsOpen(ws: WebSocket): Promise<undefined | Event> {
  if (ws.readyState === WebSocket.OPEN) {
    return Promise.resolve(undefined)
  } else if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
    return Promise.resolve(new Event("error"))
  } else {
    return new Promise<undefined | Event>((resolve) => {
      const controller = new AbortController()
      ws.addEventListener("open", () => {
        controller.abort()
        resolve(undefined)
      }, controller)
      ws.addEventListener("error", (e) => {
        controller.abort()
        resolve(e)
      }, controller)
    })
  }
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
