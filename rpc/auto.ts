import { Beacon } from "../Beacon.ts";
import { ErrorCtor, isWsUrl } from "../util/mod.ts";
import { AnyMethods } from "../util/mod.ts";
import { FailedToAddChainError, FailedToStartSmoldotError, SmoldotClient } from "./smoldot.ts";
import { FailedToOpenConnectionError, ProxyWsUrlClient } from "./ws.ts";

export async function client<M extends AnyMethods>(
  beacon: Beacon<M>,
  currentDiscoveryValueI = 0,
): Promise<
  | SmoldotClient<M>
  | ProxyWsUrlClient<M>
  | FailedToOpenConnectionError
  | FailedToStartSmoldotError
  | FailedToAddChainError
  | BeaconFailedError
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
  return new BeaconFailedError();
}

export class BeaconFailedError extends ErrorCtor("AllBeaconsErrored") {}
