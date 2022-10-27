import { deferred } from "../../deps/std/async.ts";
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
        if (openError) forEachListener(new ProviderSendError(openError));
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
    conn = new ProxyProviderConnection(ws, { message, error }, listener);
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
    const openHandler = () => {
      removeOpenHandlers();
      resolve();
    };
    const openErrorHandler = (e: Event) => {
      removeOpenHandlers();
      resolve(e);
    };
    const removeOpenHandlers = () => {
      ws.removeEventListener("open", openHandler);
      ws.removeEventListener("error", openErrorHandler);
    };
    ws.addEventListener("open", openHandler);
    ws.addEventListener("error", openErrorHandler);
  });
}

function closeWs(socket: WebSocket): Promise<void | ProviderCloseError<Event>> {
  const pending = deferred<void | ProviderCloseError<Event>>();
  const closeHandler = () => {
    pending.resolve();
    removeCloseHandlers();
  };
  const closeErrorHandler = (e: Event) => {
    pending.resolve(new ProviderCloseError(e));
    removeCloseHandlers();
  };
  const removeCloseHandlers = () => {
    socket.removeEventListener("close", closeHandler);
    socket.removeEventListener("error", closeErrorHandler);
  };
  socket.addEventListener("close", closeHandler);
  socket.close();
  return pending;
}
