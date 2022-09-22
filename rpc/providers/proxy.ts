import { Config } from "../../config/mod.ts";
import { ErrorCtor } from "../../util/mod.ts";
import * as B from "../Base.ts";
import { FailedToSendMessageError, ParseRawIngressMessageError } from "../common.ts";
import { WsContainer } from "./ws_container.ts";

export async function proxyClient<Config_ extends Config<string | string[]>>(
  config: Config_,
): Promise<ProxyClient<Config_> | FailedToOpenConnectionError> {
  const createWebSocketFactory = () => {
    let index = 0;
    return (discoveryValue: Config_["discoveryValue"]) => {
      if (typeof discoveryValue === "string") {
        return new WebSocket(discoveryValue);
      }
      index %= discoveryValue.length;
      return new WebSocket(discoveryValue[index++]!);
    };
  };
  const ws = new WsContainer({
    discoveryValue: config.discoveryValue,
    webSocketFactory: createWebSocketFactory(),
  });
  const event = await ws.once(["open", "error"]);
  if (event.type === "error") {
    return new FailedToOpenConnectionError();
  }
  return new ProxyClient(ws);
}

export class ProxyClient<Config_ extends Config> extends B.Client<
  Config_,
  MessageEvent,
  Event,
  FailedToSendMessageError,
  FailedToDisconnectError
> {
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
          try {
            return ws.send(JSON.stringify(egressMessage));
          } catch (error) {
            return new FailedToSendMessageError(error);
          }
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
