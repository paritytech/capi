import * as u from "/_/util/mod.ts";
import * as common from "/rpc/common.ts";
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
    (_, resolved) => {
      return common.call(resolved.resource, "state_getStorage", u.isStr, resolved.key);
    },
  );
};
