import { ErrorCtor } from "../util/mod.ts";
import { FailedToAddChainError, FailedToStartSmoldotError, SmoldotClient } from "./smoldot.ts";
import { FailedToOpenConnectionError, ProxyWsUrlClient } from "./ws.ts";

// TODO: use branded beacon types instead of string
// TODO: dyn import smoldot and provider if chain spec is provided
// TODO: handle retry
// TODO: narrow to `[string, ...string[]]`
export async function rpcClient<Beacons extends [string, ...string[]]>(
  ...beacons: Beacons
): Promise<
  | SmoldotClient
  | ProxyWsUrlClient
  | FailedToOpenConnectionError
  | FailedToStartSmoldotError
  | FailedToAddChainError
  | AllBeaconsErroredError
> {
  const [beacon, ...rest] = beacons;
  const result = await (async () => {
    if (isWsUrl(beacon)) {
      return ProxyWsUrlClient.open({ beacon });
    } else {
      return SmoldotClient.open({ beacon });
    }
  })();
  if (result instanceof Error) {
    if (rest.length > 0) {
      return await rpcClient(...rest as [string, ...string[]]);
    }
    return new AllBeaconsErroredError();
  }
  return result;
}

// TODO: validate chain spec as well
// TODO: better validation
function isWsUrl(inQuestion: string): boolean {
  return inQuestion.startsWith("wss://");
}

export class AllBeaconsErroredError extends ErrorCtor("AllBeaconsErrored") {}
