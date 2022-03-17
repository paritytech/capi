import { call } from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

export const RpcMethods = <
  Beacon,
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return sys.effect<string>()(
    "RpcMethods",
    { resource },
    async (_, resolved) => {
      return call(resolved.resource, "rpc_methods");
    },
  );
};
