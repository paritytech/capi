import * as U from "../../util/mod.ts";
import * as msg from "../messages.ts";
import { Provider, ProviderConnection, ProviderListener } from "./base.ts";
import { ProviderCloseError, ProviderHandlerError, ProviderSendError } from "./errors.ts";

export type ProxyProvider = Provider<string, Event, Event, Event>;

export const proxyProvider: ProxyProvider = (url, listener) => {
  return {
    send: (message) => {
      const { inner, forEachListener } = connection(url, listener);
      (async () => {
        const openError = await ensureWsOpen(inner);
        if (openError) {
          forEachListener(new ProviderSendError(openError));
          return;
        }
        inner.send(JSON.stringify(message));
      })();
    },
    release: () => {
      const { listenerRoot, listeners, inner } = connection(url, listener);
      listeners.delete(listener);
      if (!listeners.size) {
        connections.delete(url);
        inner.removeEventListener("message", listenerRoot.message);
        inner.removeEventListener("error", listenerRoot.error);
        return closeWs(inner);
      }
      return Promise.resolve();
    },
  };
};

/** Global lookup of existing connections and references */
const connections = new Map<string, ProxyProviderConnection>();
class ProxyProviderConnection extends ProviderConnection<
  /* inner */ WebSocket,
  /* handler error data */ Event,
  /* send error data */ Event,
  /* listener root */ {
    message: U.Listener<MessageEvent>;
    error: U.Listener<Event>;
  }
> {}

function connection(
  url: string,
  listener: ProviderListener<Event, Event>,
): ProxyProviderConnection {
  let conn = connections.get(url);
  if (!conn) {
    const ws = new WebSocket(url);
    const message = (e: MessageEvent) => {
      conn!.forEachListener(msg.parse(e.data));
    };
    const error = (e: Event) => {
      conn!.forEachListener(new ProviderHandlerError(e));
    };
    const listenerBound = listener.bind({
      stop: () => {
        conn!.listeners.delete(listenerBound);
      },
    });
    conn = new ProxyProviderConnection(ws, { message, error }, listenerBound);
    ws.addEventListener("message", message);
    ws.addEventListener("error", error);
    connections.set(url, conn);
  } else if (!conn.listeners.has(listener)) {
    conn.listeners.add(listener);
  }
  return conn;
}

function ensureWsOpen(ws: WebSocket): Promise<void | Event> {
  if (ws.readyState === WebSocket.OPEN) {
    return Promise.resolve();
  }
  return new Promise<void | Event>((resolve) => {
    const controller = new AbortController();
    const { signal } = controller;
    ws.addEventListener("open", () => {
      controller.abort();
      resolve();
    }, { signal });
    ws.addEventListener("error", (e: Event) => {
      controller.abort();
      resolve(e);
    }, { signal });
  });
}

function closeWs(socket: WebSocket): Promise<void | ProviderCloseError<Event>> {
  if (socket.readyState === WebSocket.CLOSED) {
    return Promise.resolve();
  }
  return new Promise<void | ProviderCloseError<Event>>((resolve) => {
    const controller = new AbortController();
    const { signal } = controller;
    socket.addEventListener("close", () => {
      controller.abort();
      resolve();
    }, { signal });
    socket.addEventListener("error", (e: Event) => {
      controller.abort();
      resolve(new ProviderCloseError(e));
    }, { signal });
    socket.close();
  });
}
