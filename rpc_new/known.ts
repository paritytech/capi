import * as known from "../known/rpc/mod.ts";
import * as U from "../util/mod.ts";
import { call, subscription } from "./effects.ts";

export namespace state {
  export const getMetadata = call<[at?: U.Hash], U.Hex>("state_getMetadata");
}
export namespace chain {
  export const subscribeNewHeads = subscription<[], known.Header>()("chain_subscribeNewHeads");
  export const unsubscribeNewHeads = call<[id: string], true>("chain_unsubscribeNewHeads");
}
