import * as u from "/_/util/mod.ts";
import { call } from "/rpc/common.ts";
import * as s from "/system/mod.ts";

export const SystemLocalListenAddresses = <
  Beacon,
  Resource extends s.AnyEffectA<s.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return s.effect<string[]>()(
    "SystemLocalListenAddresses",
    { resource },
    (_, resolved) => {
      // TODO: do we still like the approach wherein we supply the guard to `common.call`?
      return call(resolved.resource, "system_localListenAddresses", u.isArray);
    },
  );
};
