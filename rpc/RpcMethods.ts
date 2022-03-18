import * as common from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

export interface RpcMethodsResolved {
  methods: string[];
  version: number;
}

export const isRpcMethodsResolved = (inQuestion: any): inQuestion is RpcMethodsResolved => {
  return !!(inQuestion && Array.isArray(inQuestion.methods) && typeof inQuestion.version === "number");
};

export const RpcMethods = <
  Beacon,
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return sys.effect<RpcMethodsResolved>()(
    "RpcMethods",
    { resource },
    (_, resolved) => {
      return common.call(resolved.resource, "rpc_methods", isRpcMethodsResolved);
    },
  );
};
