import { EgressMessageBase, IngressOpaqueMessage, MethodName } from "../common.ts";

export type StateGetStorageEgressMessage = EgressMessageBase<MethodName.StateGetStorage, [
  key: string,
  blockHash?: string,
]>;

export type StateGetStorageIngressMessage = IngressOpaqueMessage<string>;
