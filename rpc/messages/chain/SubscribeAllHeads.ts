import { InitBase, ResBase } from "../common.ts";

export type ChainSubscribeAllHeadsInit = InitBase<"chain_subscribeAllHeads">;

export type ChainSubscribeAllHeadsRes = ResBase<string>;

export type ChainSubscribeAllHeadsNotif = ResBase<{
  digest: {
    logs: string[];
  };
  extrinsicsRoot: string;
  number: string;
  parentHash: string;
  stateRoot: string;
}>;
