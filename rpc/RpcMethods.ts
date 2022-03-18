import * as common from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

export interface RpcMethodsOk {
  methods: string[];
  version: number;
}

export const isRpcMethodsOk = (inQuestion: unknown): inQuestion is RpcMethodsOk => {
  return !!(
    inQuestion
    && Array.isArray((inQuestion as any).methods)
    && typeof (inQuestion as any).version === "number"
  );
};

export const RpcMethods = <
  Beacon,
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return sys.effect<RpcMethodsOk>()(
    "RpcMethods",
    { resource },
    async (_, resolved) => {
      const x = await common.call(resolved.resource, "rpc_methods", isRpcMethodsOk);
      return x;
    },
  );
};
