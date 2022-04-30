import * as a from "std/async/mod.ts";
import { Listener, RpcClient, StopListening } from "./Base.ts";
import { EgressMessage } from "./method_info/mod.ts";

export class WsRpcClient implements RpcClient {
  #ws;
  #nextId = 0;
  #listeners = new Map<Listener, boolean>();

  constructor(readonly url: string) {
    this.#ws = new WebSocket(url);
    this.#ws.addEventListener("error", this.#onError);
    this.#ws.addEventListener("message", this.#onMessage);
  }

  opening = async (): Promise<void> => {
    if (this.#ws.readyState === WebSocket.CONNECTING) {
      const pending = a.deferred<void>();
      const onOpenError = () => {
        clearListeners();
        pending.reject();
      };
      const onOpen = () => {
        clearListeners();
        pending.resolve();
      };
      const clearListeners = () => {
        this.#ws.removeEventListener("error", onOpenError);
        this.#ws.removeEventListener("open", onOpen);
      };
      this.#ws.addEventListener("error", onOpenError);
      this.#ws.addEventListener("open", onOpen);
      return pending;
    }
  };

  close = async (): Promise<void> => {
    const pending = a.deferred<void>();
    const onClose = () => {
      this.#ws.removeEventListener("error", this.#onError);
      this.#ws.removeEventListener("message", this.#onMessage);
      this.#ws.removeEventListener("close", onClose);
      pending.resolve();
    };
    this.#ws.addEventListener("close", onClose);
    this.#ws.close();
    return pending;
  };

  uid = (): string => {
    return (this.#nextId++).toString();
  };

  listen = (listener: Listener): StopListening => {
    if (this.#listeners.has(listener)) {
      throw new Error();
    }
    this.#listeners.set(listener, true);
    return () => {
      if (!this.#listeners.delete(listener)) {
        throw new Error();
      }
    };
  };

  send = (egressMessage: EgressMessage): void => {
    this.#ws.send(JSON.stringify(egressMessage));
  };

  #onError = (e: Event) => {
    console.error({ e });
    throw new Error();
  };

  #onMessage = (e: MessageEvent) => {
    if (typeof e.data !== "string") {
      throw new Error();
    }
    const parsed = JSON.parse(e.data);
    for (const listener of this.#listeners.keys()) {
      listener(parsed);
    }
  };
}
