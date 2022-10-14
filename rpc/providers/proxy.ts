import { Config } from "../../config/mod.ts";
import { deadline, deferred } from "../../deps/std/async.ts";
import { ErrorCtor } from "../../util/mod.ts";
import * as B from "../Base.ts";
import { ClientHooks, ParseRawIngressMessageError } from "../common.ts";

export type ProxyClientHooks<Config_ extends Config<string>> = ClientHooks<Config_, Event>;

export async function proxyClient<Config_ extends Config<string>>(
  config: Config_,
  hooks?: ProxyClientHooks<Config_>,
): Promise<ProxyClient<Config_> | FailedToOpenConnectionError> {
  const ws = new WebSocket(await config.discoveryValue);
  const client = new ProxyClient(ws, hooks);
  ws.addEventListener("error", client.onError);
  ws.addEventListener("message", client.onMessage);
  const pending = deferred<ProxyClient<Config_> | FailedToOpenConnectionError>();
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
  return await pending;
}

export class ProxyClient<Config_ extends Config>
  extends B.Client<Config_, MessageEvent, Event, FailedToDisconnectError>
{
  constructor(ws: WebSocket, hooks?: ProxyClientHooks<Config_>) {
    super(
      {
        parseIngressMessage: (e) => {
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
        send: (egressMessage) => {
          ws.send(JSON.stringify(egressMessage));
        },
        close: async () => {
          const pending = deferred<undefined | FailedToDisconnectError>();
          const onClose = () => {
            ws.removeEventListener("error", this.onError);
            ws.removeEventListener("message", this.onMessage);
            ws.removeEventListener("close", onClose);
            pending.resolve();
          };
          ws.addEventListener("close", onClose);
          ws.close();
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
export class FailedToDisconnectError extends ErrorCtor("FailedToDisconnect") {}
