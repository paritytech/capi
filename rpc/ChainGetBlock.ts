import * as common from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

export interface ChainGetBlockResolved {
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

export const isChainGetBlockResolved = (inQuestion: any): inQuestion is ChainGetBlockResolved => {
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
  return sys.effect<ChainGetBlockResolved>()(
    "ChainGetBlock",
    { resource, hash },
    async (_, resolved) => {
      return common.call(
        resolved.resource,
        "chain_getBlock",
        isChainGetBlockResolved,
        ...(resolved.hash ? [resolved.hash] : []),
      );
    },
  );
};
