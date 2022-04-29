import { EgressMessageBase, IngressOpaqueMessage, MethodName } from "../common.ts";

export type SystemChainTypeEgressMessage = EgressMessageBase<MethodName.SystemChainType>;

export type SystemChainTypeIngressMessage = IngressOpaqueMessage<SystemChainTypeKind>;

export const enum SystemChainTypeKind {
  Development = "Development",
  Local = "Local",
  Live = "Live",
  Custom = "Custom",
}
