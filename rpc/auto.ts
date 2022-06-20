import { ErrorCtor } from "../util/mod.ts";
import { AnyMethods } from "./Base.ts";
import { Beacon } from "./Beacon.ts";
import { FailedToAddChainError, FailedToStartSmoldotError, SmoldotClient } from "./smoldot.ts";
import { FailedToOpenConnectionError, ProxyWsUrlClient } from "./ws.ts";

// TODO: use branded beacon types instead of string
// TODO: dyn import smoldot and provider if chain spec is provided
// TODO: handle retry
// TODO: narrow to `[string, ...string[]]`
export async function client<M extends AnyMethods>(
  beacon: Beacon<M>,
  currentDiscoveryValueI = 0,
): Promise<
  | SmoldotClient<M>
  | ProxyWsUrlClient<M>
  | FailedToOpenConnectionError
  | FailedToStartSmoldotError
  | FailedToAddChainError
  | AllBeaconsErroredError
> {
  const currentDiscoveryValue = beacon.discoveryValues[currentDiscoveryValueI];
  if (currentDiscoveryValue) {
    const result = await (async () => {
      if (isWsUrl(currentDiscoveryValue)) {
        return ProxyWsUrlClient.open<M>({ discoveryValue: currentDiscoveryValue });
      } else {
        return SmoldotClient.open<M>({ discoveryValue: currentDiscoveryValue });
      }
    })();
    if (result instanceof Error) {
      return await client(beacon, currentDiscoveryValueI + 1);
    }
    return result;
  }
  return new AllBeaconsErroredError();
}

// TODO: validate chain spec as well
// TODO: better validation
function isWsUrl(inQuestion: string): boolean {
  return inQuestion.startsWith("wss://");
}

export class AllBeaconsErroredError extends ErrorCtor("AllBeaconsErrored") {}
