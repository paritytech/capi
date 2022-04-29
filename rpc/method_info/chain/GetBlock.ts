import { EgressMessageBase, IngressOpaqueMessage, MethodName } from "../common.ts";

export type ChainGetBlockEgressMessage = EgressMessageBase<MethodName.ChainGetBlock, [blockHash?: string]>;

export type ChainGetBlockIngressMessage = IngressOpaqueMessage<{
  block: {
    extrinsics: string[];
    header: {
      digest: {
        logs: string[];
      };
      extrinsicsRoot: string;
      number: string;
      parentHash: string;
      stateRoot: string;
    };
  };
  justifications: null; // TODO...
}>;
