import * as u from "/_/util/mod.ts";
import { ConnectionPool, Payload } from "/connection/common.ts";
import * as async from "std/async/mod.ts";

// Refine
export type CloseError = ClosedConnectionBeforePendingResolved | AttemptedCloseOfNonexistentConnection;
export class AttemptedCloseOfNonexistentConnection extends u.ErrorCtor("AttemptedCloseOfNonexistentConnection") {}
export class ClosedConnectionBeforePendingResolved extends u.ErrorCtor("ClosedConnectionBeforePendingResolved") {}

// TODO: fine-tune Error types!

export class WebSocketConnectionPool implements ConnectionPool<string> {
  // #abortController = new AbortController();
  #connections: Record<string, WebSocket> = {};
  #egress: Record<string, Payload[]> = {};
  #callbackById: Record<string, (response: unknown) => void> = {};
  #inflight = new Map<Payload, async.Deferred<unknown>>();

  open(url: string): void {
    const connection = new WebSocket(url);
    this.#connections[url] = connection;

    connection.onopen = () => {
      connection.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const parsedId = parsed.id;
          if (typeof parsedId !== "string") {
            throw new Error("YET ANOTHER");
          }
          const callback = this.#callbackById[parsedId];
          if (!callback) {
            throw new Error("MORE?!");
          }
          callback(parsed.result);
        } catch (e) {
          console.error(e);
          throw new Error("Encountered another error");
        }
      };

      connection.onerror = (error) => {
        console.error({ AN_ERROR: error });
        throw new Error("Encountered an error:");
      };

      const egress = this.#egress[url];
      if (egress) {
        egress.forEach((value) => {
          this.send(url, value);
        });
        delete this.#egress[url];
      }
    };
  }

  close(url: string): void {
    const connection = this.#connections[url];
    if (!connection) {
      throw new AttemptedCloseOfNonexistentConnection();
    }
    for (const pending of this.#inflight.values()) {
      // console.error("Should abort", pending);
      // // TODO: is this sufficient, or do we need an abort controller signal callback?
      // throw new ClosedBeforeResolved();
      // pending.reject()
    }
    connection.close();
  }

  send(
    url: string,
    payload: Payload,
  ): void {
    const connection = this.#connections[url];
    if (!connection) {
      throw new Error();
    }
    if (connection.readyState === WebSocket.CONNECTING) {
      this.#egress[url] = this.#egress[url] || [];
      this.#egress[url]!.push(payload);
      // TODO: is this better: `this.#egress[url] = [...(this.#egress[url] || []), payload];`
    } else if (connection.readyState === WebSocket.OPEN) {
      connection.send(JSON.stringify({
        jsonrpc: "2.0",
        ...payload,
      }));
    }
  }

  receive(payload: Payload): Promise<unknown> {
    const pending = async.deferred<unknown>();
    this.#inflight.set(payload, pending);
    this.#callbackById[payload.id] = (result) => {
      this.#inflight.delete(payload);
      delete this.#callbackById[payload.id];
      pending.resolve(result);
    };
    return pending;
  }
}
