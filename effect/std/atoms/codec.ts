import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import { deriveCodec } from "/effect/std/atoms/deriveCodec.ts";

export const codec = <
  Beacon,
  TypeI extends MaybeEffectLike<string>,
  BlockHashRest extends [blockHash?: MaybeEffectLike<string>],
>(
  beacon: Beacon,
  typeI: TypeI,
  ...[blockHash]: BlockHashRest
) => {
  return native([deriveCodec(beacon, blockHash), typeI], (deriveCodec, typeI) => {
    return () => {
      // TODO
      // @ts-ignore
      return deriveCodec(typeI);
    };
  });
};
