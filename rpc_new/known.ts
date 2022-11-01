import * as known from "../known/rpc/mod.ts";
import * as U from "../util/mod.ts";
import { call, subscription } from "./effects.ts";

export namespace state {
  export const getMetadata = call<U.Hex>("state_getMetadata");
}
export namespace chain {
  export const unsubscribeNewHeads = call<true>("chain_unsubscribeNewHeads");
  export const subscribeNewHeads = subscription<known.Header>()("chain_subscribeNewHeads");
}
