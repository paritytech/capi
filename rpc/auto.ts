import { Beacon } from "../Beacon.ts";
import { ErrorCtor, isWsUrl } from "../util/mod.ts";
import { AnyMethods } from "../util/mod.ts";
import {
  type FailedToAddChainError,
  type FailedToStartSmoldotError,
  type SmoldotClient,
} from "./providers/smoldot.ts";
import { type FailedToOpenConnectionError, type ProxyWsUrlClient } from "./providers/ws.ts";

export async function client<M extends AnyMethods>(
  beacon: Beacon<string, M>,
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
        return (
          await import("./providers/ws.ts")
        ).ProxyWsUrlClient.open<M>({ discoveryValue: currentDiscoveryValue });
      } else {
        return (
          await import("./providers/smoldot.ts")
        ).SmoldotClient.open<M>({ discoveryValue: currentDiscoveryValue });
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
