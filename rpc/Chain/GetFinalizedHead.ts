import * as u from "/_/util/mod.ts";
import { call } from "/rpc/common.ts";
import * as s from "/system/mod.ts";

export const ChainGetFinalizedHead = <
  Beacon,
  Resource extends s.AnyEffectA<s.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return s.effect<string>()("ChainGetFinalizedHead", { resource }, (_, resolved) => {
    return call(resolved.resource, "chain_getFinalizedHead", u.isStr);
  });
};
