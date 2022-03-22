import * as u from "/_/util/mod.ts";
import { call } from "/rpc/common.ts";
import * as s from "/system/mod.ts";

export const StateGetStorage = <
  Resource extends s.AnyEffectA<s.ResourceResolved<any>>,
  Key extends s.AnyEffectA<string>,
>(
  resource: Resource,
  key: Key,
) => {
  return s.effect<string>()(
    "StateGetStorage",
    { resource, key },
    (_, resolved) => {
      return call(resolved.resource, "state_getStorage", u.isStr, resolved.key);
    },
  );
};
