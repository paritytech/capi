import { Config } from "../../config/mod.ts";
import { unimplemented } from "../../deps/std/testing/asserts.ts";
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

export async function stdClient<Config_ extends Config<string>>(
  config: Config_,
): Promise<StdClient<Config_> | StdClientInitError> {
  const discoveryValue = await config.discoveryValue;
  if (typeof discoveryValue === "string") {
    // TODO: improve check / move selection elsewhere
    if (discoveryValue.startsWith("ws")) {
      return proxyClient(config);
    } else {
      return smoldotClient(config);
    }
  }
  return unimplemented();
}
