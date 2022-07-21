import { deadline, deferred } from "../../_deps/std/async.ts";
import { ErrorCtor } from "../../util/mod.ts";
import * as B from "../Base.ts";
import { ClientHooks, ParseRawIngressMessageError, ProviderMethods } from "../common.ts";

export type ProxyClientHooks<M extends ProviderMethods> = ClientHooks<M, WebSocketInternalError>;

export async function proxyClient<M extends ProviderMethods>(
  proxyWsUrl: string,
  hooks?: ProxyClientHooks<M>,
): Promise<ProxyClient<M> | FailedToOpenConnectionError> {
  const ws = new WebSocket(proxyWsUrl);
  const client = new ProxyClient(ws, hooks);
  ws.addEventListener("error", client.onError);
  ws.addEventListener("message", client.onMessage);
  const pending = deferred<ProxyClient<M> | FailedToOpenConnectionError>();
  if (ws.readyState === WebSocket.CONNECTING) {
    const onOpenError = (e: any) => {
      console.log({ log: e });
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

export class ProxyClient<M extends ProviderMethods>
  extends B.Client<M, WebSocketInternalError, MessageEvent, Event, FailedToDisconnectError>
{
  constructor(
    private ws: WebSocket,
    hooks?: ProxyClientHooks<M>,
  ) {
    super(
      {
        parse: {
          ingressMessage: (e) => {
            if (
              typeof e !== "object"
              || e === null
              || !("data" in e)
              || typeof (e as { data?: string }).data !== "string"
            ) {
              return new ParseRawIngressMessageError();
            }
            return JSON.parse((e as { data: string }).data);
          },
          // TODO: provide insight into error via `_e`
          error: (_e) => {
            return new WebSocketInternalError();
          },
        },
        send: (egressMessage) => {
          this.ws?.send(JSON.stringify(egressMessage));
        },
        close: async () => {
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
        },
      },
      hooks,
    );
  }
}

export class FailedToOpenConnectionError extends ErrorCtor("FailedToOpenConnection") {}
export class WebSocketInternalError extends ErrorCtor("WebSocketInternal") {}
export class FailedToDisconnectError extends ErrorCtor("FailedToDisconnect") {}
