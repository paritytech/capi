import { call, subscription } from "./narrow.ts";

export namespace state {
  /** Some description */
  export function getMetadata(blockHash?: string) {
    return call<string>("state_getMetadata", blockHash);
  }
}

export namespace chain {
  export const subscribeAllHeads = subscription<unknown>()("chain_subscribeAllHeads");
}
