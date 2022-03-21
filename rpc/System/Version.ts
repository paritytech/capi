import * as u from "/_/util/mod.ts";
import { call } from "/rpc/common.ts";
import * as s from "/system/mod.ts";

export const SystemVersion = <
  Beacon,
  Resource extends s.AnyEffectA<s.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return s.effect<string>()(
    "SystemVersion",
    { resource },
    (_, resolved) => {
      return call(resolved.resource, "system_version", u.isStr);
    },
  );
};
