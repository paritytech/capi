import { Config } from "../../config/mod.ts";
import { ErrorCtor } from "../../util/mod.ts";
import * as B from "../Base.ts";
import { ParseRawIngressMessageError } from "../common.ts";
import { WsContainer } from "./ws_container.ts";

export function proxyClient<Config_ extends Config<string | string[]>>(
  config: Config_,
): ProxyClient<Config_> {
  return new ProxyClient(config);
}

export class ProxyClient<Config_ extends Config> extends B.Client<
  Config_,
  MessageEvent,
  ProxyInternalError,
  FailedToDisconnectError
> {
  #container!: WsContainer<Config_>;

  constructor(readonly config: Config_) {
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
        send: async (egressMessage) => {
          try {
            const result = await this.#container.send(JSON.stringify(egressMessage));
            if (result instanceof Error) {
              return new ProxyInternalError(result);
            }
            return result;
          } catch (error) {
            return new ProxyInternalError(error);
          }
        },
        close: async () => {
          await this.#container.close();
          return undefined;
        },
      },
    );
    this.#initContainer();
  }

  #initContainer() {
    let index = 0;
    const factory = ({ discoveryValue }: Config_) => {
      if (typeof discoveryValue === "string") {
        return new WebSocket(discoveryValue);
      }
      index %= discoveryValue.length;
      return new WebSocket(discoveryValue[index++]!);
    };
    this.#container = new WsContainer({ client: this, factory });
  }
}

export class FailedToOpenConnectionError extends ErrorCtor("FailedToOpenConnection") {}
export class FailedToDisconnectError extends ErrorCtor("FailedToDisconnect") {}
export class ProxyInternalError extends ErrorCtor("ProxyInternal") {
  constructor(readonly inner: unknown) {
    super();
  }
}
