import { deferred } from "../_deps/async.ts";
import { ErrorCtor } from "../util/mod.ts";
import * as B from "./Base.ts";
import { IngressMessage, InitMessage } from "./messages.ts";

export class FailedToStartSmoldotError extends ErrorCtor("FailedToStartSmoldot") {}
export class FailedToInitializeChainError extends ErrorCtor("FailedToInitializeChain") {}
export class FailedToParseIngressMessageError extends ErrorCtor("FailedToParseIngressMessage") {}
export class SmoldotInternalError extends ErrorCtor("SmoldotInternal") {}

export class ProxyWsUrlRpcClient extends B.Client<string, ProxyWsUrlRpcClientError> {
  #ws?: WebSocket;

  static open = async (
    props: B.ClientProps<WsProxyUrl, ProxyWsUrlRpcClientError>,
  ): Promise<void> => {
    const client = new ProxyWsUrlRpcClient(props);
    const ws = new WebSocket(props.beacon);
    client.#ws = ws;
    ws.addEventListener("error", client.onError);
    ws.addEventListener("message", client.onMessage);
    const pending = deferred<void>();
    if (ws.readyState === WebSocket.CONNECTING) {
      const onOpenError = () => {
        clearListeners();
        pending.reject();
      };
      const onOpen = () => {
        clearListeners();
        pending.resolve();
      };
      const clearListeners = () => {
        ws.removeEventListener("error", onOpenError);
        ws.removeEventListener("open", onOpen);
      };
      ws.addEventListener("error", onOpenError);
      ws.addEventListener("open", onOpen);
    } else {
      pending.resolve();
    }
    return pending;
  };

  close = async (): Promise<void> => {
    const pending = deferred<void>();
    const onClose = () => {
      this.#ws?.removeEventListener("error", this.onError);
      this.#ws?.removeEventListener("message", this.onMessage);
      this.#ws?.removeEventListener("close", onClose);
      pending.resolve();
    };
    this.#ws?.addEventListener("close", onClose);
    this.#ws?.close();
    return pending;
  };

  send = (egressMessage: InitMessage): void => {
    this.#ws?.send(JSON.stringify(egressMessage));
  };

  parseMessage = (e: unknown): IngressMessage => {
    if (
      typeof e !== "object"
      || e === null
      || !("data" in e)
      || typeof (e as { data?: string }).data !== "string"
    ) {
      throw new WsRpcClientError.FailedToParse();
    }
    return JSON.parse((e as { data: string }).data);
  };

  // TODO: provide insight into error via `_e`
  parseError = (_e: Event): WsRpcClientError => {
    return new WsRpcClientError.WsError();
  };
}
