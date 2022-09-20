type ReconnectOptions = {
  attempts?: number;
  maxAttempts?: number;
  delay?: number;
};

type WebSocketClientOptions = {
  webSocketFactory: () => WebSocket;
  reconnect?: ReconnectOptions;
};

export class WsContainer implements Pick<WebSocket, "send" | "close"> {
  onopen?: (e: WebSocketEventMap["open"]) => void;
  onclose?: (e: WebSocketEventMap["close"]) => void;
  onmessage?: (e: WebSocketEventMap["message"]) => void;
  onerror?: (e: WebSocketEventMap["error"]) => void;

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

  close(code?: number, reason?: string): void {
    clearTimeout(this.#reconnectTimeoutId);

    this.#isClosed = true;

    const webSocket = this.#webSocket;

    webSocket.onopen = null;
    webSocket.onclose = null;
    webSocket.onmessage = null;
    webSocket.onerror = null;

    webSocket.close(code, reason);

    if (this.#webSocket.readyState === WebSocket.CLOSED) {
      this.onclose?.(new CloseEvent("close", { wasClean: true, code, reason }));
    } else {
      webSocket.onclose = () => {
        this.onclose?.(new CloseEvent("close", { wasClean: true, code, reason }));
        webSocket.onclose = null;
      };
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
    this.onopen?.(ev);

    this.#reconnectAttempts = 0;
  };

  #onWsClose = (ev: WebSocketEventMap["close"]) => {
    this.#reconnect();

    this.onclose?.(ev);
  };

  #onWsMessage = (ev: WebSocketEventMap["message"]) => {
    this.onmessage?.(ev);
  };

  #onWsError = (ev: WebSocketEventMap["error"]) => {
    this.onerror?.(ev);
  };
}
