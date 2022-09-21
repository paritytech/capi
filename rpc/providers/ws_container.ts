import { deferred } from "../../deps/std/async.ts";
import * as U from "../../util/mod.ts";

type ReconnectOptions = {
  attempts?: number;
  maxAttempts?: number;
  delay?: number;
};

type WebSocketClientOptions = {
  webSocketFactory: () => WebSocket;
  reconnect?: ReconnectOptions;
};

type WebSocketEventTypes = keyof WebSocketEventMap;

type WebSocketListeners = {
  [P in WebSocketEventTypes]: Set<U.WatchHandler<WebSocketEventMap[P]>>;
};

export class WsContainer {
  #listeners: WebSocketListeners = {
    open: new Set(),
    close: new Set(),
    message: new Set(),
    error: new Set(),
  };
  #webSocket!: WebSocket;
  #isClosed = false;
  #isReconnecting = false;
  #reconnectTimeoutId?: number;
  #reconnectAttempts = 0;
  #reconnectMaxAttempts: number;
  #reconnectDelay: number;

  constructor(private readonly options: WebSocketClientOptions) {
    this.#reconnectMaxAttempts = options.reconnect?.maxAttempts ?? 5;
    this.#reconnectDelay = options.reconnect?.delay ?? 1000;
    this.#connect();
  }

  get isOpen(): boolean {
    return this.#webSocket.readyState === WebSocket.OPEN;
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    this.#webSocket.send(data);
  }

  close(): void {
    clearTimeout(this.#reconnectTimeoutId);
    this.#isClosed = true;
    const webSocket = this.#webSocket;
    webSocket.removeEventListener("open", this.#onWsOpen);
    webSocket.removeEventListener("close", this.#onWsClose);
    webSocket.removeEventListener("message", this.#onWsMessage);
    webSocket.removeEventListener("error", this.#onWsError);
    webSocket.close();
    if (this.#webSocket.readyState === WebSocket.CLOSED) {
      this.#emit(new CloseEvent("close", { wasClean: true }));
    } else {
      webSocket.addEventListener(
        "close",
        () => this.#emit(new CloseEvent("close", { wasClean: true })),
        { once: true },
      );
    }
  }

  addListener<K extends WebSocketEventTypes>(
    type: K,
    listener: U.WatchHandler<WebSocketEventMap[K]>,
  ) {
    this.#listeners[type].add(listener);
  }

  removeListener<K extends WebSocketEventTypes>(
    type: K,
    listener: U.WatchHandler<WebSocketEventMap[K]>,
  ) {
    this.#listeners[type].delete(listener);
  }

  once<K extends WebSocketEventTypes>(
    types: K | K[],
  ): Promise<WebSocketEventMap[K]> {
    const eventTypes = typeof types === "string"
      ? [types]
      : types;
    const result = deferred<WebSocketEventMap[K]>();
    const removeListeners = () =>
      eventTypes
        .forEach(
          (t) => this.removeListener(t, listener),
        );
    const listener: U.WatchHandler<WebSocketEventMap[K]> = (e) => {
      removeListeners();
      result.resolve(e);
    };
    eventTypes
      .forEach((type) => this.addListener(type, listener));
    return result;
  }

  #emit<K extends WebSocketEventTypes>(event: WebSocketEventMap[K]) {
    for (const listener of this.#listeners[event.type as K]) {
      listener(event);
    }
  }

  #connect() {
    this.#isClosed = false;
    this.#isReconnecting = false;
    this.#webSocket = this.options.webSocketFactory();
    this.#webSocket.addEventListener("open", this.#onWsOpen);
    this.#webSocket.addEventListener("close", this.#onWsClose);
    this.#webSocket.addEventListener("message", this.#onWsMessage);
    this.#webSocket.addEventListener("error", this.#onWsError);
  }

  #reconnect() {
    if (this.#isClosed) {
      return;
    }
    // TODO: extract reconnect logic in a class/util
    // it should be cancellable
    if (this.#isReconnecting) {
      return;
    }
    if (this.#reconnectAttempts === this.#reconnectMaxAttempts) {
      return;
    }
    this.#reconnectAttempts++;
    this.#isReconnecting = true;
    this.#reconnectTimeoutId = setTimeout(
      () => this.#connect(),
      this.#reconnectDelay,
    );
  }

  #onWsOpen = (ev: WebSocketEventMap["open"]) => {
    this.#emit(ev);
    this.#reconnectAttempts = 0;
  };

  #onWsClose = (ev: WebSocketEventMap["close"]) => {
    this.#reconnect();
    this.#emit(ev);
  };

  #onWsMessage = (ev: WebSocketEventMap["message"]) => {
    this.#emit(ev);
  };

  #onWsError = (ev: WebSocketEventMap["error"]) => {
    this.#emit(ev);
  };
}
