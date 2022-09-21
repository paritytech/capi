import { Config } from "../../config/mod.ts";
import { ErrorCtor } from "../../util/mod.ts";
import * as B from "../Base.ts";
import { ClientHooks, ParseRawIngressMessageError } from "../common.ts";
import { WsContainer } from "./ws_container.ts";

export type ProxyClientHooks<Config_ extends Config<string>> = ClientHooks<Config_, Event>;

export async function proxyClient<Config_ extends Config<string>>(
  config: Config_,
): Promise<ProxyClient<Config_> | FailedToOpenConnectionError> {
  const ws = new WsContainer({
    webSocketFactory: () => new WebSocket(config.discoveryValue),
  });
  const event = await ws.once(["open", "error"]);
  if (event.type === "error") {
    return new FailedToOpenConnectionError();
  }
  return new ProxyClient(ws);
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
        close: async () => {
          ws.removeListener("message", this.onMessage);
          ws.removeListener("error", this.onError);
          ws.close();
          await ws.once("close");
          return undefined;
        },
      },
    );
    ws.addListener("message", this.onMessage);
    ws.addListener("error", this.onError);
  }
}

export class FailedToOpenConnectionError extends ErrorCtor("FailedToOpenConnection") {}
export class FailedToDisconnectError extends ErrorCtor("FailedToDisconnect") {}
