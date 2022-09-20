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

    webSocket.onopen = null;
    webSocket.onclose = null;
    webSocket.onmessage = null;
    webSocket.onerror = null;

    webSocket.close();

    if (this.#webSocket.readyState === WebSocket.CLOSED) {
      this.#dispatch(new CloseEvent("close", { wasClean: true }));
      this.#removeAllListeners();
    } else {
      webSocket.onclose = () => {
        this.#dispatch(new CloseEvent("close", { wasClean: true }));
        this.#removeAllListeners();
        webSocket.onclose = null;
      };
    }
  }

  listen<K extends WebSocketEventTypes>(
    type: K,
    createListenerCb: U.CreateWatchHandler<WebSocketEventMap[K]>,
  ) {
    const stopListening = () => {
      this.#listeners[type].delete(listenerCb);
    };
    const listenerCb = createListenerCb(stopListening);
    this.#listeners[type].add(listenerCb);
  }

  #dispatch<K extends WebSocketEventTypes>(event: WebSocketEventMap[K]) {
    for (const listener of this.#listeners[event.type as K]) {
      listener(event);
    }
  }

  #removeAllListeners() {
    for (const set of Object.values(this.#listeners)) {
      set.clear();
    }
  }

  #connect() {
    this.#isClosed = false;
    this.#isReconnecting = false;
    this.#webSocket = this.options.webSocketFactory();

    this.#webSocket.onopen = this.#onWsOpen;
    this.#webSocket.onclose = this.#onWsClose;
    this.#webSocket.onmessage = this.#onWsMessage;
    this.#webSocket.onerror = this.#onWsError;
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
    this.#dispatch(ev);

    this.#reconnectAttempts = 0;
  };

  #onWsClose = (ev: WebSocketEventMap["close"]) => {
    this.#reconnect();

    this.#dispatch(ev);
  };

  #onWsMessage = (ev: WebSocketEventMap["message"]) => {
    this.#dispatch(ev);
  };

  #onWsError = (ev: WebSocketEventMap["error"]) => {
    this.#dispatch(ev);
  };
}
