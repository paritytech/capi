import { Config } from "../../config/mod.ts";
import { CreateWatchHandler, ErrorCtor } from "../../util/mod.ts";
import * as B from "../Base.ts";
import { ClientHooks, ParseRawIngressMessageError } from "../common.ts";
import { WsContainer } from "./ws_container.ts";

export type ProxyClientHooks<Config_ extends Config<string>> = ClientHooks<Config_, Event>;

export function proxyClient<Config_ extends Config<string>>(
  config: Config_,
): Promise<ProxyClient<Config_> | FailedToOpenConnectionError> {
  const ws = new WsContainer({
    webSocketFactory: () => new WebSocket(config.discoveryValue),
  });

  return new Promise((resolve) => {
    const createWatchHandler: CreateWatchHandler<Event> = (stop) =>
      (e: Event) => {
        stop();
        if (e.type === "error") {
          resolve(new FailedToOpenConnectionError());
        } else {
          resolve(new ProxyClient(ws));
        }
      };

    ws.listen("open", createWatchHandler);
    ws.listen("error", createWatchHandler);
  });
}

export class ProxyClient<Config_ extends Config>
  extends B.Client<Config_, MessageEvent, Event, FailedToDisconnectError>
{
  constructor(ws: WsContainer) {
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
        close: () =>
          new Promise((resolve) => {
            ws.listen("close", (stop) =>
              () => {
                stop();
                resolve(undefined);
              });
            ws.close();
          }),
      },
    );

    ws.listen("message", () =>
      (e) => {
        this.onMessage(e);
      });
    ws.listen("error", () =>
      (e) => {
        this.onError(e);
      });
  }
}

export class FailedToOpenConnectionError extends ErrorCtor("FailedToOpenConnection") {}
export class FailedToDisconnectError extends ErrorCtor("FailedToDisconnect") {}
