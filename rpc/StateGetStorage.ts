import { call } from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

export const StateGetStorage = <
  Beacon,
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
  Key extends sys.AnyEffectA<string>,
>(
  resource: Resource,
  key: Key,
) => {
  return sys.effect<string>()(
    "StateGetStorage",
    { resource, key },
    async (_, resolved) => {
      return call(resolved.resource, "state_getStorage", resolved.key);
    },
  );
};
