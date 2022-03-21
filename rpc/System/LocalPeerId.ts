import * as u from "/_/util/mod.ts";
import { call } from "/rpc/common.ts";
import * as s from "/system/mod.ts";

export const SystemLocalPeerId = <
  Beacon,
  Resource extends s.AnyEffectA<s.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return s.effect<string>()(
    "SystemLocalPeerId",
    { resource },
    (_, resolved) => {
      return call(resolved.resource, "system_localPeerId", u.isStr);
    },
  );
};
