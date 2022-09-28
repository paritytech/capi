import { Config } from "../../config/mod.ts";
import { Deferred, deferred } from "../../deps/std/async.ts";
import { FailedToOpenConnectionError, ProxyClient, ProxyInternalError } from "./proxy.ts";

interface WsContainerProps<Config_ extends Config> {
  client: ProxyClient<Config_>;
  factory: (discoveryValue: Config_) => WebSocket;
}

export class WsContainer<Config_ extends Config> {
  #inner?: WebSocket;
  #isClosed = false;
  #isReconnecting = false;
  #connectFinalized?: Deferred<void | FailedToOpenConnectionError>;
  #reconnectTimeoutId: number | undefined;
  #reconnectAttempts = 0;

  constructor(readonly props: WsContainerProps<Config_>) {}

  #connect = () => {
    this.#isClosed = false;
    this.#isReconnecting = false;
    this.#inner = this.props.factory(this.props.client.config);
    this.#connectFinalized = this.#connectFinalized ?? deferred();
    this.#attachListeners();
  };

  #switchListener = (on: boolean) =>
    () => {
      if (!this.#inner) return;
      const toggle = on
        ? this.#inner.addEventListener.bind(this.#inner)
        : this.#inner.removeEventListener.bind(this.#inner);
      toggle("open", this.#onOpen);
      toggle("close", this.#onClose);
      toggle("message", this.props.client.onMessage);
      toggle("error", this.#onError);
    };
  #attachListeners = this.#switchListener(true);
  #detachListeners = this.#switchListener(false);

  async #ensureConnected(): Promise<void | FailedToOpenConnectionError> {
    const result = deferred<void | FailedToOpenConnectionError>();
    if (!this.#inner) {
      this.#connect();
    }
    if (this.#inner!.readyState === WebSocket.OPEN) {
      result.resolve();
    } else if (this.#connectFinalized) {
      result.resolve(await this.#connectFinalized);
    } else {
      result.resolve(new FailedToOpenConnectionError());
    }
    return result;
  }

  send = async (data: string): Promise<void | FailedToOpenConnectionError> =>
    (await this.#ensureConnected()) || this.#inner?.send(data);

  close(): Promise<void> {
    clearTimeout(this.#reconnectTimeoutId);
    this.#isClosed = true;
    const result = deferred<void>();
    if (!this.#inner) {
      result.resolve();
      return result;
    }
    this.#detachListeners();
    this.#inner.close();
    if (this.#inner.readyState === WebSocket.CLOSED) {
      result.resolve();
    } else {
      this.#inner.addEventListener(
        "close",
        () => result.resolve(),
        { once: true },
      );
    }
    return result;
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
    if (this.#reconnectAttempts === 4) {
      this.#connectFinalized?.resolve(new FailedToOpenConnectionError());
      return;
    }
    this.#reconnectAttempts++;
    this.#isReconnecting = true;
    this.#connectFinalized = this.#connectFinalized ?? deferred();
    this.#reconnectTimeoutId = setTimeout(this.#connect, 250);
  }

  #onOpen = () => {
    this.#reconnectAttempts = 0;
    this.#connectFinalized?.resolve();
    this.#connectFinalized = undefined;
  };

  #onClose = () => {
    this.#reconnect();
  };

  #onError = (e: Event) => {
    this.props.client.onError(new ProxyInternalError(e));
  };
}
