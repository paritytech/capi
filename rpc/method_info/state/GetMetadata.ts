import { EgressMessageBase, IngressOpaqueMessage, MethodName } from "../common.ts";

export type StateGetMetadataEgressMessage = EgressMessageBase<MethodName.StateGetMetadata, [blockHash?: string]>;

export type StateGetMetadataIngressMessage = IngressOpaqueMessage<string>;
