import * as common from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

export interface ChainGetBlockOk {
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
  justification: null; // TODO...
}

export const isChainGetBlockOk = (inQuestion: any): inQuestion is ChainGetBlockOk => {
  return typeof inQuestion === "object" && inQuestion.block && inQuestion.block.header;
};

export const ChainGetBlock = <
  Beacon,
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
  Hash extends sys.AnyEffectA<string | undefined>,
>(
  resource: Resource,
  hash: Hash,
) => {
  return sys.effect<ChainGetBlockOk>()(
    "ChainGetBlock",
    { resource, hash },
    async (_, resolved) => {
      return common.call(
        resolved.resource,
        "chain_getBlock",
        isChainGetBlockOk,
        ...(resolved.hash ? [resolved.hash] : []),
      );
    },
  );
};
