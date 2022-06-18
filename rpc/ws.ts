import { deferred } from "../_deps/async.ts";
import { RpcClient } from "./Base.ts";
import { RpcClientError } from "./Error.ts";
import { IngressMessage, InitMessage } from "./messages.ts";

export class WsRpcClient extends RpcClient<WsRpcClientError> {
  #ws;

  constructor(readonly url: string) {
    super();
    this.#ws = new WebSocket(url);
    this.#ws.addEventListener("error", this.onError);
    this.#ws.addEventListener("message", this.onMessage);
  }

  opening = (): Promise<void> => {
    const pending = deferred<void>();
    if (this.#ws.readyState === WebSocket.CONNECTING) {
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
    } else {
      pending.resolve();
    }
    return pending;
  };

  close = async (): Promise<void> => {
    const pending = deferred<void>();
    const onClose = () => {
      this.#ws.removeEventListener("error", this.onError);
      this.#ws.removeEventListener("message", this.onMessage);
      this.#ws.removeEventListener("close", onClose);
      pending.resolve();
    };
    this.#ws.addEventListener("close", onClose);
    this.#ws.close();
    return pending;
  };

  send = (egressMessage: InitMessage): void => {
    this.#ws.send(JSON.stringify(egressMessage));
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

export type WsRpcClientError =
  | WsRpcClientError.FailedToInitialize
  | WsRpcClientError.FailedToParse;
export namespace WsRpcClientError {
  export class FailedToInitialize extends RpcClientError {}
  export class FailedToParse extends RpcClientError {}
  export class WsError extends RpcClientError {}
}
