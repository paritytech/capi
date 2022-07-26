import { Config } from "../../config/mod.ts";
import { unimplemented } from "../../deps/std/testing/asserts.ts";
import { isWsUrl } from "../../util/mod.ts";
import { FailedToOpenConnectionError, ProxyClient, proxyClient } from "./proxy.ts";
import {
  FailedToAddChainError,
  FailedToStartSmoldotError,
  SmoldotClient,
  smoldotClient,
} from "./smoldot.ts";

export type StdClient<Config_ extends Config<string>> =
  | ProxyClient<Config_>
  | SmoldotClient<Config_>;

export type StdClientInitError =
  | FailedToOpenConnectionError
  | FailedToStartSmoldotError
  | FailedToAddChainError;

export function stdClient<Config_ extends Config<string>>(
  config: Config_,
): Promise<StdClient<Config_> | StdClientInitError> {
  if (typeof config.discoveryValue === "string") {
    if (isWsUrl(config.discoveryValue)) {
      return proxyClient(config);
    } else {
      return smoldotClient(config);
    }
  }
  return unimplemented();
}
