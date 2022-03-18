import * as u from "/_/util/mod.ts";
import * as common from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

export const ChainGetBlockHash = <
  Beacon,
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
  Height extends sys.AnyEffectA<number | undefined>,
>(
  resource: Resource,
  height: Height,
) => {
  return sys.effect<string>()(
    "ChainGetBlockHash",
    { resource, height },
    async (_, resolved) => {
      return common.call(
        resolved.resource,
        "chain_getBlockHash",
        u.isString, // Validate that it is a hex string?
        ...(resolved.height ? [resolved.height] : []),
      );
    },
  );
};
