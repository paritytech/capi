import { Config } from "../../config/mod.ts";
import { deadline, deferred } from "../../deps/std/async.ts";
import { ErrorCtor } from "../../util/mod.ts";
import * as B from "../Base.ts";
import { ClientHooks, ParseRawIngressMessageError } from "../common.ts";
import { WebSocketProxy } from "./web-socket-proxy.ts";

export type ProxyClientHooks<Config_ extends Config<string>> = ClientHooks<Config_, Event>;

export async function proxyClient<Config_ extends Config<string>>(
  config: Config_,
  hooks?: ProxyClientHooks<Config_>,
): Promise<ProxyClient<Config_> | FailedToOpenConnectionError> {
  const wsIsOpen = deferred();
  const ws = new WebSocketProxy({
    webSocketFactory: () => new WebSocket(config.discoveryValue),
  });

  ws.onopen = () => wsIsOpen.resolve();
  ws.onerror = () => wsIsOpen.reject();

  try {
    await wsIsOpen;
  } catch (_e) {
    return new FailedToOpenConnectionError();
  } finally {
    ws.onopen = undefined;
    ws.onerror = undefined;
  }

  return new ProxyClient(ws, hooks);
}

export class ProxyClient<Config_ extends Config>
  extends B.Client<Config_, MessageEvent, Event, FailedToDisconnectError>
{
  constructor(ws: WebSocketProxy, hooks?: ProxyClientHooks<Config_>) {
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
          const isClosed = deferred<undefined | FailedToDisconnectError>();

          ws.onclose = () => isClosed.resolve();
          ws.close();

          try {
            await deadline(isClosed, 250);
          } catch (_e) {
            isClosed.resolve(new FailedToDisconnectError());
          } finally {
            ws.onclose = undefined;
            ws.onmessage = undefined;
            ws.onerror = undefined;
          }

          return isClosed;
        },
      },
      hooks,
    );

    ws.onmessage = this.onMessage;
    ws.onerror = this.onError;
  }
}

export class FailedToOpenConnectionError extends ErrorCtor("FailedToOpenConnection") {}
export class FailedToDisconnectError extends ErrorCtor("FailedToDisconnect") {}
