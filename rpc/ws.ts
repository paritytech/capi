import * as a from "std/async/mod.ts";
import { Connection, ConnectionListener, ConnectionPool, ConnectionPoolFactory } from "./common.ts";

export class WsConnection implements Connection {
  users = 1;

  #ws;
  #nextId = 0;
  #listeners = new Map<ConnectionListener, true>();

  constructor(
    readonly url: string,
    readonly cleanupContext: () => void,
  ) {
    this.#ws = new WebSocket(url);
    this.#ws.addEventListener("error", this.#handler);
    this.#ws.addEventListener("message", this.#handler);
  }

  opening = async (): Promise<void> => {
    if (this.#ws.readyState === WebSocket.OPEN) {
      return;
    }
    const pending = a.deferred<void>();
    const onOpenErr = () => {
      clearListeners();
      pending.reject();
    };
    const onOpen = () => {
      clearListeners();
      pending.resolve();
    };
    const clearListeners = () => {
      this.#ws.removeEventListener("error", onOpenErr);
      this.#ws.removeEventListener("open", onOpen);
    };
    this.#ws.addEventListener("error", onOpenErr);
    this.#ws.addEventListener("open", onOpen);
    return pending;
  };

  get nextId(): number {
    return this.#nextId++;
  }

  send: Connection["send"] = (props) => {
    this.#ws.send(JSON.stringify({
      jsonrpc: "2.0",
      ...props,
    }));
  };

  ask: Connection["ask"] = (props) => {
    const pending = a.deferred();
    const handler = async (message: unknown) => {
      if (typeof message === "object" && message !== null && (message as { id?: number }).id === props.id) {
        this.removeListener(handler);
        pending.resolve(message);
      }
      // TODO: retry logic after certain amount of time?
    };
    this.addListener(handler);
    this.send(props);
    return pending;
  };

  addListener: Connection["addListener"] = (listener) => {
    this.#listeners.set(listener, true);
  };

  removeListener: Connection["removeListener"] = (listener) => {
    this.#listeners.delete(listener);
  };

  deref: Connection["deref"] = async () => {
    if (this.users > 1) {
      this.users -= 1;
      return;
    }
    const pending = a.deferred<void>();
    const onClose = () => {
      this.#ws.removeEventListener("error", this.#handler);
      this.#ws.removeEventListener("message", this.#handler);
      this.#ws.removeEventListener("close", onClose);
      this.cleanupContext();
      pending.resolve();
    };
    this.#ws.addEventListener("close", onClose);
    this.#ws.close();
    return pending;
  };

  #handler = (message: Event | MessageEvent): void => {
    if (message instanceof MessageEvent) {
      if (typeof message.data !== "string") {
        throw new Error("TODO");
      }
      const parsed = JSON.parse(message.data);
      for (const listener of this.#listeners.keys()) {
        listener(parsed);
      }
    } else {
      console.log({ ERROR: message });
      // TODO
      throw new Error();
    }
  };
}

// TODO: decide whether to use `WeakRef` to auto-decrement/release the connection
export class WsConnectionPool implements ConnectionPool<string> {
  #entries = new Map<string, WsConnection>();

  use = async (url: string) => {
    const existing = this.#entries.get(url);
    if (existing) {
      existing.users += 1;
      return existing;
    }
    const connection = new WsConnection(url, () => {
      this.#entries.delete(url);
    });
    await connection.opening();
    this.#entries.set(url, connection);
    return connection;
  };
}

export const wsConnectionPool: ConnectionPoolFactory<string> = () => {
  return new WsConnectionPool();
};
