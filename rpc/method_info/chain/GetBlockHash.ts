import { EgressMessageBase, IngressOpaqueMessage, MethodName } from "../common.ts";

export type ChainGetBlockHashEgressMessage = EgressMessageBase<MethodName.ChainGetBlockHash>;

export type ChainGetBlockHashIngressMessage = IngressOpaqueMessage<string>;
