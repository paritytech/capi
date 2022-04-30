import * as a from "std/async/mod.ts";
import { ListenerCb, RpcClient, RpcClientFactory, StopListening } from "./Base.ts";
import { Init } from "./messages/types.ts";

export class WsRpcClient implements RpcClient {
  #ws;
  #nextId = 0;
  #listeners = new Map<ListenerCb, boolean>();

  constructor(
    readonly url: string,
    readonly onClose?: () => void,
  ) {
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
    this.onClose?.(); // TODO: ensure this works
    return pending;
  };

  uid = (): string => {
    return (this.#nextId++).toString();
  };

  listen = (listener: ListenerCb): StopListening => {
    if (this.#listeners.has(listener)) {
      throw new Error();
    }
    this.#listeners.set(listener, true);
    return () => {
      this.#listeners.delete(listener);
    };
  };

  send = (egressMessage: Init): void => {
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

export const wsRpcClient: RpcClientFactory<string> = async (
  url,
  onClose,
) => {
  const rpcClient = new WsRpcClient(url, onClose);
  await rpcClient.opening();
  return rpcClient;
};
