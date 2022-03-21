import * as u from "/_/util/mod.ts";
import { call } from "/rpc/common.ts";
import * as s from "/system/mod.ts";

export const ChainGetBlockHash = <
  Beacon,
  Resource extends s.AnyEffectA<s.ResourceResolved<Beacon>>,
  Height extends s.AnyEffectA<number | undefined>,
>(
  resource: Resource,
  height: Height,
) => {
  return s.effect<string>()(
    "ChainGetBlockHash",
    { resource, height },
    (_, resolved) => {
      return call(
        resolved.resource,
        "chain_getBlockHash",
        u.isStr, // Validate that it is a hex string?
        ...(resolved.height ? [resolved.height.toString()] : []),
      );
    },
  );
};
