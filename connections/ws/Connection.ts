import * as a from "std/async/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import { Connection, Payload } from "../common.ts";

export class WsConnection implements Connection {
  #connection;
  #id = 0;
  #payloads = new Map<number, Payload>();
  #pending: Record<number, a.Deferred<Event | MessageEvent>> = {};

  constructor(readonly url: string) {
    this.#connection = new Promise<WebSocket>((resolve, reject) => {
      const connection = new WebSocket(url);

      const onOpen = (): void => {
        connection.removeEventListener("open", onOpen);
        connection.addEventListener("error", this.#onErr);
        connection.addEventListener("message", this.#onMsg);
        resolve(connection);
      };
      connection.addEventListener("open", onOpen);

      const onOpenErr = (): void => {
        connection.removeEventListener("error", onOpenErr);
        reject();
      };
      connection.addEventListener("error", onOpenErr);
    });
  }

  close = async (): Promise<void> => {
    const connection = await this.#connection;
    return new Promise<void>((resolve) => {
      const onClose = (e: CloseEvent): void => {
        connection.removeEventListener("close", onClose);
        if (e.wasClean) {
          console.log({ CLEAN_CLOSE_EVENT: e.code });
          resolve();
        } else {
          console.log({ DIRTY_CLOSE_EVENT: e.code });
          resolve(); // ... TODO: would we rather reject here?
        }
      };
      connection.addEventListener("close", onClose);
      // TODO: ensure queue is empty
      connection.removeEventListener("error", this.#onErr);
      connection.removeEventListener("message", this.#onMsg);
      connection.close();
    });
  };

  definePayload = (payload: Payload): number => {
    const id = this.#id++;
    this.#payloads.set(id, payload);
    return id;
  };

  sendPayload = async (id: number): Promise<void> => {
    const connection = await this.#connection;
    const payload = this.#payloads.get(id);
    asserts.assert(payload);
    console.log({
      jsonrpc: "2.0",
      id,
      method: payload.method,
      params: payload.params,
    });
    connection.send(JSON.stringify({
      jsonrpc: "2.0",
      id,
      method: payload.method,
      params: payload.params,
    }));
  };

  receive = (id: number): Promise<unknown> => {
    const pending = a.deferred<Event | MessageEvent>();
    this.#pending[id] = pending;
    return pending;
  };

  #onErr = (e: Event): void => {
    console.log({ ERR: e });
  };

  #onMsg = (e: MessageEvent): void => {
    const data = JSON.parse(e.data);
    const id = data.id;
    asserts.assert(typeof id === "number");
    const pending = this.#pending[id];
    asserts.assert(pending);
    this.#payloads.delete(id);
    delete this.#pending[id];

    const err = data.error;
    if (err) {
      const { code, message } = err;
      asserts.assert(typeof code === "number" && typeof message === "string");
      pending.reject(new ServerErrResponse(code, message));
    } else {
      const result = data.result;
      asserts.assert(typeof result === "string");
      pending.resolve(data.result);
    }
  };
}

export class ServerErrResponse extends Error {
  constructor(
    readonly code: number,
    readonly message: string,
  ) {
    super();
  }
}
