import { Container, MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import { rpcCall } from "/effect/std/rpcCall.ts";
import * as m from "/frame_metadata/mod.ts";

// TODO: move into `frame_metadata`
export class MetadataDecodeError extends Error {}

// TODO: block hash param
export const _metadata = <
  Beacon,
  BlockHashRest extends [blockHash?: MaybeEffectLike<string>],
>(
  beacon: Beacon,
  ...[blockHash]: BlockHashRest
) => {
  return native([rpcCall(beacon, "state_getMetadata", blockHash)], (result) => {
    return async () => {
      const raw = (result as any).result as string;
      try {
        return m.fromPrefixedHex(raw);
      } catch (e) {
        console.error(e);
        return new MetadataDecodeError();
      }
    };
  });
};

export class Metadata<
  Beacon,
  BlockHashRest extends [blockHash?: MaybeEffectLike<string>],
> extends Container {
  inner;
  blockHash;

  constructor(
    readonly beacon: Beacon,
    ...[blockHash]: BlockHashRest
  ) {
    super();
    this.inner = _metadata(beacon, blockHash);
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
