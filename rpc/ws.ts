import { deadline, deferred } from "../_deps/async.ts";
import { ErrorCtor } from "../util/mod.ts";
import * as B from "./Base.ts";
import { IngressMessage, InitMessage } from "./messages.ts";

export class FailedToOpenConnectionError extends ErrorCtor("FailedToOpenConnection") {}
export class WebSocketInternalError extends ErrorCtor("WebSocketInternal") {}
export class FailedToDisconnectError extends ErrorCtor("FailedToDisconnect") {}

export class ProxyWsUrlClient<M extends B.AnyMethods>
  extends B.Client<M, string, MessageEvent, Event, WebSocketInternalError>
{
  #ws?: WebSocket;

  static open = async <M extends B.AnyMethods>(
    props: B.ClientProps<M, string, WebSocketInternalError>,
  ): Promise<ProxyWsUrlClient<M> | FailedToOpenConnectionError> => {
    const client = new ProxyWsUrlClient(props);
    const ws = new WebSocket(props.discoveryValue);
    client.#ws = ws;
    ws.addEventListener("error", client.onError);
    ws.addEventListener("message", client.onMessage);
    const pending = deferred<ProxyWsUrlClient<M> | FailedToOpenConnectionError>();
    if (ws.readyState === WebSocket.CONNECTING) {
      const onOpenError = () => {
        clearListeners();
        pending.resolve(new FailedToOpenConnectionError());
      };
      const onOpen = () => {
        clearListeners();
        pending.resolve(client);
      };
      const clearListeners = () => {
        ws.removeEventListener("error", onOpenError);
        ws.removeEventListener("open", onOpen);
      };
      ws.addEventListener("error", onOpenError);
      ws.addEventListener("open", onOpen);
    } else {
      pending.resolve(client);
    }
    return pending;
  };

  close = async (): Promise<undefined | FailedToDisconnectError> => {
    const pending = deferred<undefined | FailedToDisconnectError>();
    const onClose = () => {
      this.#ws?.removeEventListener("error", this.onError);
      this.#ws?.removeEventListener("message", this.onMessage);
      this.#ws?.removeEventListener("close", onClose);
      pending.resolve();
    };
    this.#ws?.addEventListener("close", onClose);
    this.#ws?.close();
    try {
      await deadline(pending, 250);
    } catch (_e) {
      pending.resolve(new FailedToDisconnectError());
    }
    return pending;
  };

  _send = (egressMessage: InitMessage<M>): void => {
    this.#ws?.send(JSON.stringify(egressMessage));
  };

  parseIngressMessage = (e: unknown): IngressMessage<M> | B.ParseRawIngressMessageError => {
    if (
      typeof e !== "object"
      || e === null
      || !("data" in e)
      || typeof (e as { data?: string }).data !== "string"
    ) {
      return new B.ParseRawIngressMessageError();
    }
    return JSON.parse((e as { data: string }).data);
  };

  // TODO: provide insight into error via `_e`
  parseError = (_e: Event): WebSocketInternalError => {
    return new WebSocketInternalError();
  };
}
