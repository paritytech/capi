import { unimplemented } from "../../_deps/std/testing/asserts.ts";
import { Config } from "../../config/mod.ts";
import { isWsUrl } from "../../util/mod.ts";
import { ProviderMethods } from "../common.ts";
import { FailedToOpenConnectionError, ProxyClient, proxyClient } from "./proxy.ts";
import {
  FailedToAddChainError,
  FailedToStartSmoldotError,
  SmoldotClient,
  smoldotClient,
} from "./smoldot.ts";

export type StdClient<M extends ProviderMethods> = ProxyClient<M> | SmoldotClient<M>;

export type StdClientInitError =
  | FailedToOpenConnectionError
  | FailedToStartSmoldotError
  | FailedToAddChainError;

export function stdClient<M extends ProviderMethods>(
  discoveryValue: string,
): Promise<StdClient<M> | StdClientInitError> {
  if (typeof discoveryValue === "string") {
    if (isWsUrl(discoveryValue)) {
      return proxyClient<M>(discoveryValue);
    } else {
      return smoldotClient<M>(discoveryValue);
    }
  }
  unimplemented();
}

export function fromConfig<M extends ProviderMethods>(config: Config<string, M>) {
  return stdClient<M>(config.discoveryValue);
}
