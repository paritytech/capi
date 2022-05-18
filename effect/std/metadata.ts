import { HOEffect, MaybeEffectLike } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";
import { metadataDecoded } from "/effect/std/atoms/metadataDecoded.ts";
import { select } from "/effect/std/atoms/select.ts";
import { rpcCall } from "/effect/std/RpcCall.ts";

export class Metadata<
  Beacon,
  BlockHashRest extends [blockHash?: MaybeEffectLike<string>],
> extends HOEffect {
  root;
  blockHash;

  constructor(
    readonly beacon: Beacon,
    ...[blockHash]: BlockHashRest
  ) {
    super();
    const rpcCall_ = rpcCall(beacon, "state_getMetadata", blockHash);
    const result = select(rpcCall_, "result");
    this.root = metadataDecoded(result);
    this.blockHash = blockHash;
  }
}

export const metadata = <
  Beacon,
  BlockHashRest extends [blockHash?: MaybeEffectLike<string>],
>(
  beacon: Beacon,
  ...[blockHash]: BlockHashRest
): Metadata<Beacon, BlockHashRest> => {
  return new Metadata(beacon, blockHash);
};
