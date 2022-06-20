import { ErrorCtor } from "../util/mod.ts";
import { AnyMethods } from "./Base.ts";
import { FailedToAddChainError, FailedToStartSmoldotError, SmoldotClient } from "./smoldot.ts";
import { FailedToOpenConnectionError, ProxyWsUrlClient } from "./ws.ts";

type DiscoveryValues = readonly [string, ...string[]];
// TODO: replace with better branded types
type Beacon<M extends AnyMethods> = DiscoveryValues & { _beacon: { supported: M } };
export function beacon<Supported extends AnyMethods>(
  discoveryValues: DiscoveryValues,
): Beacon<Supported> {
  return discoveryValues as Beacon<Supported>;
}

// TODO: use branded beacon types instead of string
// TODO: dyn import smoldot and provider if chain spec is provided
// TODO: handle retry
// TODO: narrow to `[string, ...string[]]`
export async function client<M extends AnyMethods>(beacon: Beacon<M>): Promise<
  | SmoldotClient<M>
  | ProxyWsUrlClient<M>
  | FailedToOpenConnectionError
  | FailedToStartSmoldotError
  | FailedToAddChainError
  | AllBeaconsErroredError
> {
  const [e0, ...rest] = beacon;
  const result = await (async () => {
    if (isWsUrl(e0)) {
      return ProxyWsUrlClient.open({ beacon: e0 });
    } else {
      return SmoldotClient.open({ beacon: e0 });
    }
  })();
  if (result instanceof Error) {
    if (rest.length > 0) {
      return await client(rest as unknown as Beacon<M>);
    }
    return new AllBeaconsErroredError();
  }
  // TODO: fix
  return result as any;
}

// TODO: validate chain spec as well
// TODO: better validation
function isWsUrl(inQuestion: string): boolean {
  return inQuestion.startsWith("wss://");
}

export class AllBeaconsErroredError extends ErrorCtor("AllBeaconsErrored") {}
