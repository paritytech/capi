import { deferred } from "../_deps/async.ts";
import { ListenerCb, RpcClient, RpcClientFactory, StopListening } from "./Base.ts";
import { InitMessage } from "./messages.ts";

export const wsRpcClient: RpcClientFactory<string> = async (url) => {
  const rpcClient = new WsRpcClient(url);
  await rpcClient.opening();
  return rpcClient;
};

export class WsRpcClient extends RpcClient {
  #ws;
  #listeners = new Map<ListenerCb, boolean>();

  constructor(readonly url: string) {
    super();
    this.#ws = new WebSocket(url);
    this.#ws.addEventListener("error", this.#onError);
    this.#ws.addEventListener("message", this.#onMessage);
  }

  opening = (): Promise<void> => {
    if (this.#ws.readyState === WebSocket.CONNECTING) {
      const pending = deferred<void>();
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
    return Promise.resolve();
  };

  close = async (): Promise<void> => {
    const pending = deferred<void>();
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

  listen = (listener: ListenerCb): StopListening => {
    if (this.#listeners.has(listener)) {
      throw new WsRpcClientRegisteredListenerTwiceError(listener);
    }
    this.#listeners.set(listener, true);
    return () => {
      this.#listeners.delete(listener);
    };
  };

  send = (egressMessage: InitMessage): void => {
    this.#ws.send(JSON.stringify(egressMessage));
  };

  #onError = (e: Event) => {
    throw new WsRpcClientServerError(e);
  };

  #onMessage = (e: MessageEvent) => {
    if (typeof e.data !== "string") {
      throw new WsRpcClientNoDataError(e);
    }
    const parsed = JSON.parse(e.data);
    for (const listener of this.#listeners.keys()) {
      listener(parsed);
    }
  };
}

export type WsRpcClientError =
  | WsRpcClientServerError
  | WsRpcClientRegisteredListenerTwiceError
  | WsRpcClientNoDataError;

export class WsRpcClientServerError extends Error {
  constructor(readonly event: Event) {
    super();
  }
}
export class WsRpcClientRegisteredListenerTwiceError extends Error {
  constructor(readonly listener: ListenerCb) {
    super();
  }
}
export class WsRpcClientNoDataError extends Error {
  constructor(readonly event: Event) {
    super();
  }
}
