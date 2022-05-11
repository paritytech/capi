import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import { Metadata } from "/effect/std/metadata.ts";
import * as m from "/frame_metadata/mod.ts";

// TODO: move into & get from `frame_metadata`
export class DeriveCodecError extends Error {}

export const deriveCodec = <
  Beacon,
  BlockHashRest extends [blockHash?: MaybeEffectLike<string>],
>(
  beacon: Beacon,
  ...[blockHash]: BlockHashRest
) => {
  return native([new Metadata(beacon, blockHash)], (metadata) => {
    return async () => {
      return m.DeriveCodec(metadata);
    };
  });
};
