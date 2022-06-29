import { deadline, deferred } from "../../_deps/async.ts";
import { Beacon } from "../../Beacon.ts";
import { AnyMethods, ErrorCtor } from "../../util/mod.ts";
import * as B from "../Base.ts";
import * as msg from "../messages.ts";

export class ProxyBeacon<M extends AnyMethods> extends Beacon<string, M> {}
export type ProxyClientHooks<M extends AnyMethods> = B.ClientHooks<M, WebSocketInternalError>;

export async function proxyClient<M extends AnyMethods>(
  beacon: ProxyBeacon<M>,
  hooks?: ProxyClientHooks<M>,
): Promise<ProxyClient<M> | FailedToOpenConnectionError> {
  const ws = new WebSocket(beacon.discoveryValue);
  const client = new ProxyClient(ws, hooks);
  ws.addEventListener("error", client.onError);
  ws.addEventListener("message", client.onMessage);
  const pending = deferred<ProxyClient<M> | FailedToOpenConnectionError>();
  if (ws.readyState === WebSocket.CONNECTING) {
    const onOpenError = (_e: any) => {
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
}

export class ProxyClient<M extends AnyMethods>
  extends B.Client<M, WebSocketInternalError, MessageEvent, Event>
{
  constructor(
    private ws: WebSocket,
    hooks?: ProxyClientHooks<M>,
  ) {
    super(hooks);
  }

  _send = (egressMessage: msg.InitMessage<M>): void => {
    this.ws?.send(JSON.stringify(egressMessage));
  };

  parseIngressMessage = (e: unknown): msg.IngressMessage<M> | B.ParseRawIngressMessageError => {
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

  _close = async (): Promise<undefined | FailedToDisconnectError> => {
    const pending = deferred<undefined | FailedToDisconnectError>();
    const onClose = () => {
      this.ws?.removeEventListener("error", this.onError);
      this.ws?.removeEventListener("message", this.onMessage);
      this.ws?.removeEventListener("close", onClose);
      pending.resolve();
    };
    this.ws?.addEventListener("close", onClose);
    this.ws?.close();
    try {
      await deadline(pending, 250);
    } catch (_e) {
      pending.resolve(new FailedToDisconnectError());
    }
    return pending;
  };
}

export class FailedToOpenConnectionError extends ErrorCtor("FailedToOpenConnection") {}
export class WebSocketInternalError extends ErrorCtor("WebSocketInternal") {}
export class FailedToDisconnectError extends ErrorCtor("FailedToDisconnect") {}
