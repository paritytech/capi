import { unimplemented } from "../../_deps/asserts.ts";
import { Config } from "../../Config.ts";
import { AnyMethods, isWsUrl } from "../../util/mod.ts";
import { FailedToOpenConnectionError, ProxyClient, proxyClient } from "./proxy.ts";
import {
  FailedToAddChainError,
  FailedToStartSmoldotError,
  SmoldotClient,
  smoldotClient,
} from "./smoldot.ts";

export type StdClient<M extends AnyMethods> = ProxyClient<M> | SmoldotClient<M>;

export type StdClientInitError =
  | FailedToOpenConnectionError
  | FailedToStartSmoldotError
  | FailedToAddChainError;

export function stdClient<M extends AnyMethods>(
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

export function fromConfig<M extends AnyMethods>(config: Config<string, M>) {
  return stdClient<M>(config.discoveryValue);
}
