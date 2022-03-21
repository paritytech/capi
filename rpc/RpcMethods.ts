import { call } from "/rpc/common.ts";
import * as s from "/system/mod.ts";

export interface RpcMethodsResolved {
  methods: string[];
  version: number;
}

export const isRpcMethodsResolved = (inQuestion: any): inQuestion is RpcMethodsResolved => {
  return !!(inQuestion && Array.isArray(inQuestion.methods) && typeof inQuestion.version === "number");
};

export const RpcMethods = <
  Beacon,
  Resource extends s.AnyEffectA<s.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return s.effect<RpcMethodsResolved>()(
    "RpcMethods",
    { resource },
    (_, resolved) => {
      return call(resolved.resource, "rpc_methods", isRpcMethodsResolved);
    },
  );
};
