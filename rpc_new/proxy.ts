import { deferred } from "../deps/std/async.ts";
import * as msg from "./msg.ts";
import { ProviderFactory } from "./provider.ts";

const connections = new Map<string, Connection>();

interface Connection {
  socket: WebSocket;
  listeners: Set<RawHandler>;
}
type RawHandler = (e: Event | MessageEvent) => void;

export const proxyProviderFactory: ProviderFactory<string, Event, Event, Event> = (
  url,
  handler,
) => {
  const rawHandler: RawHandler = (e) => {
    if (e instanceof MessageEvent) {
      handler(msg.parse(e.data));
    } else {
      handler(e);
    }
  };
  return {
    release: () => {
      const { socket, listeners } = connection(url, rawHandler);
      socket.removeEventListener("message", rawHandler);
      socket.removeEventListener("error", rawHandler);
      listeners.delete(rawHandler);
      if (!listeners.size) {
        connections.delete(url);
        return new Promise<void>((resolve) => {
          const closeHandler = () => {
            resolve();
            socket.removeEventListener("close", closeHandler);
          };
          socket.addEventListener("close", closeHandler);
          socket.close();
        });
      }
      return Promise.resolve();
    },
    send: async (message) => {
      const { socket } = connection(url, rawHandler);
      const openError = await ensureSocketOpen(socket);
      if (openError) return openError;
      socket.send(JSON.stringify(message));
      return;
    },
  };
};

function connection(url: string, handler: RawHandler): Connection {
  let connection = connections.get(url);
  if (!connection) {
    const socket = new WebSocket(url);
    connection = {
      socket,
      listeners: new Set([handler]),
    };
    socket.addEventListener("message", handler);
    socket.addEventListener("error", handler);
    connections.set(url, connection);
  } else {
    if (!connection.listeners.has(handler)) {
      connection.listeners.add(handler);
      connection.socket.addEventListener("message", handler);
      connection.socket.addEventListener("error", handler);
    }
  }
  return connection;
}

function ensureSocketOpen(socket: WebSocket): Promise<void | Event> {
  if (socket.readyState === WebSocket.OPEN) {
    return Promise.resolve();
  }
  const pending = deferred<void | Event>();
  const openHandler = () => {
    removeOpenHandlers();
    pending.resolve();
  };
  const openErrorHandler = (e: Event) => {
    removeOpenHandlers();
    pending.resolve(e);
  };
  const removeOpenHandlers = () => {
    socket.removeEventListener("open", openHandler);
    socket.removeEventListener("error", openErrorHandler);
  };
  socket.addEventListener("open", openHandler);
  socket.addEventListener("error", openErrorHandler);
  return pending;
}
