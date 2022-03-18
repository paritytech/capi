import * as u from "/_/util/mod.ts";
import * as common from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

export const SystemVersion = <
  Beacon,
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return sys.effect<string>()(
    "SystemVersion",
    { resource },
    (_, resolved) => {
      return common.call(resolved.resource, "system_version", u.isStr);
    },
  );
};
