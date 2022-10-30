import * as msg from "../messages.ts";
import { Provider, ProviderConnection, ProviderListener } from "./base.ts";
import { ProviderCloseError, ProviderHandlerError, ProviderSendError } from "./errors.ts";

/** Global lookup of existing connections */
const connections = new Map<string, ProxyProviderConnection>();
class ProxyProviderConnection extends ProviderConnection<WebSocket, Event, Event> {}

export const proxyProvider: Provider<string, Event, Event, Event> = (url, listener) => {
  let i = 0;
  return {
    nextId: () => {
      return (i++).toString();
    },
    send: (message) => {
      const conn = connection(url, listener);
      (async () => {
        const openError = await ensureWsOpen(conn.inner);
        if (openError) {
          conn.forEachListener(new ProviderSendError(openError));
        } else {
          conn.inner.send(JSON.stringify(message));
        }
      })();
    },
    release: () => {
      const { cleanUp, listeners, inner } = connection(url, listener);
      listeners.delete(listener);
      if (!listeners.size) {
        connections.delete(url);
        cleanUp();
        return closeWs(inner);
      }
      return Promise.resolve();
    },
  };
};

function connection(
  url: string,
  listener: ProviderListener<Event, Event>,
): ProxyProviderConnection {
  let conn = connections.get(url);
  if (!conn) {
    const controller = new AbortController();
    const ws = new WebSocket(url);
    ws.addEventListener("message", (e) => {
      conn!.forEachListener(msg.parse(e.data));
    }, controller);
    ws.addEventListener("error", (e) => {
      conn!.forEachListener(new ProviderHandlerError(e));
    }, controller);
    conn = new ProxyProviderConnection(ws, () => controller.abort());
    connections.set(url, conn);
  }
  conn.addListener(listener);
  return conn;
}

function ensureWsOpen(ws: WebSocket): Promise<void | Event> {
  if (ws.readyState === WebSocket.OPEN) {
    return Promise.resolve();
  }
  return new Promise<void | Event>((resolve) => {
    const controller = new AbortController();
    ws.addEventListener("open", () => {
      controller.abort();
      resolve();
    }, controller);
    ws.addEventListener("error", (e: Event) => {
      controller.abort();
      resolve(e);
    }, controller);
  });
}

function closeWs(socket: WebSocket): Promise<void | ProviderCloseError<Event>> {
  if (socket.readyState === WebSocket.CLOSED) {
    return Promise.resolve();
  }
  return new Promise<void | ProviderCloseError<Event>>((resolve) => {
    const controller = new AbortController();
    socket.addEventListener("close", () => {
      controller.abort();
      resolve();
    }, controller);
    socket.addEventListener("error", (e: Event) => {
      controller.abort();
      resolve(new ProviderCloseError(e));
    }, controller);
    socket.close();
  });
}
