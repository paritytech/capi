import { call } from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

export const StateGetMetadata = <
  Beacon,
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return sys.effect<string>()(
    "StateGetMetadata",
    { resource },
    async (_, resolved) => {
      return call(resolved.resource, "state_getMetadata");
    },
  );
};
