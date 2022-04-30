import { InitBase, ResBase } from "../common.ts";

export type ChainGetBlockInit = InitBase<"chain_getBlock", [blockHash?: string]>;

export type ChainGetBlockRes = ResBase<{
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
